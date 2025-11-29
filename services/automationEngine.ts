import { supabase } from '../lib/supabase';
import { AutomationJourney, JourneyVersion } from '../types';
import { journeyService } from './journeyService';
import { lineService } from './lineService';
import { emailService } from './emailService';
import { aiService } from './aiService';

interface JourneyContext {
    [key: string]: any;
}

export const automationEngine = {
    // 1. Start a Journey based on a Trigger
    async startJourney(triggerType: string, triggerData: any) {
        console.log(`Checking triggers for: ${triggerType}`, triggerData);

        // Find active journeys
        const { data: activeJourneys } = await supabase
            .from('automation_journeys')
            .select('id')
            .eq('status', 'active');

        if (!activeJourneys || activeJourneys.length === 0) return;

        for (const journey of activeJourneys) {
            // Get the definition
            const { latestVersion } = await journeyService.getJourney(journey.id);
            if (!latestVersion || !latestVersion.definition) continue;

            const { nodes } = latestVersion.definition;

            // Find Trigger Node
            const triggerNode = nodes.find((n: any) => n.type === 'trigger');

            // Simple check: In a real app, we'd check if the trigger node CONFIG matches the event
            // For now, we assume if it's a "trigger" node, it matches "new_customer" or "transaction" based on label
            // This is a simplification.

            let isMatch = false;
            if (triggerType === 'new_customer' && triggerNode?.data?.label === 'New Customer') {
                isMatch = true;
            } else if (triggerType === 'new_transaction' && triggerNode?.data?.label === 'New Transaction') {
                isMatch = true;
            }

            if (isMatch) {
                await this.enrollCustomer(journey.id, triggerData.id || triggerData.customer_id, triggerNode.id, triggerData);
            }
        }
    },

    // 2. Enroll Customer into a Journey
    async enrollCustomer(journeyId: string, customerId: string, startNodeId: string, initialContext: any) {
        console.log(`Enrolling customer ${customerId} into journey ${journeyId}`);

        const { data: enrollment, error } = await supabase
            .from('journey_enrollments')
            .insert([{
                journey_id: journeyId,
                customer_id: customerId,
                current_node_id: startNodeId,
                status: 'active',
                context: initialContext
            }])
            .select()
            .single();

        if (error) {
            console.error('Error enrolling customer:', error);
            return;
        }

        // Log entry
        await this.logAction(enrollment.id, startNodeId, 'enter', 'Customer enrolled');

        // Process the first step immediately
        await this.processEnrollment(enrollment.id);
    },

    // 3. Process the current step of an enrollment
    async processEnrollment(enrollmentId: string) {
        // Fetch enrollment details
        const { data: enrollment } = await supabase
            .from('journey_enrollments')
            .select('*')
            .eq('id', enrollmentId)
            .single();

        if (!enrollment || enrollment.status !== 'active') return;

        // Get Journey Definition
        const { latestVersion } = await journeyService.getJourney(enrollment.journey_id);
        if (!latestVersion) return;

        const { nodes, edges } = latestVersion.definition;
        const currentNode = nodes.find((n: any) => n.id === enrollment.current_node_id);

        if (!currentNode) {
            await this.completeEnrollment(enrollmentId, 'failed', 'Node not found');
            return;
        }

        console.log(`Processing node: ${currentNode.data.label} (${currentNode.type})`);

        // --- EXECUTE NODE LOGIC ---
        try {
            if (currentNode.type === 'action') {
                await this.executeAction(enrollment, currentNode);
                await this.moveToNextNode(enrollment, currentNode, edges);

            } else if (currentNode.type === 'condition') {
                const isTrue = await this.evaluateCondition(enrollment, currentNode);
                await this.logAction(enrollmentId, currentNode.id, 'process', `Condition checked: ${isTrue}`);

                // Move based on condition
                await this.moveToNextNode(enrollment, currentNode, edges, isTrue);

            } else if (currentNode.type === 'delay') {
                await this.logAction(enrollmentId, currentNode.id, 'process', `Waiting...`);
                // Stop here. Cron job will pick up.
            } else if (currentNode.type === 'trigger') {
                await this.moveToNextNode(enrollment, currentNode, edges);
            }
        } catch (err: any) {
            console.error('Error processing node:', err);
            await this.logAction(enrollmentId, currentNode.id, 'error', err.message);
        }
    },

    // 4. Move to Next Node
    async moveToNextNode(enrollment: any, currentNode: any, edges: any[], conditionResult?: boolean) {
        // Find outgoing edge
        // If conditionResult is provided, we need to filter edges.
        // Since we don't have visual handles for True/False yet, we'll use a convention:
        // First edge connected = True (or default), Second edge = False.
        // OR better: check edge labels if they exist.

        let edge;
        const outgoingEdges = edges.filter((e: any) => e.source === currentNode.id);

        if (currentNode.type === 'condition' && conditionResult !== undefined) {
            // Simple convention for now: 
            // If True, take the first edge found.
            // If False, take the second edge found (if any).
            // This is brittle but works for a prototype without advanced handle management.
            if (conditionResult) {
                edge = outgoingEdges[0];
            } else {
                edge = outgoingEdges[1];
            }
        } else {
            edge = outgoingEdges[0];
        }

        if (edge) {
            const nextNodeId = edge.target;

            // Update Enrollment
            await supabase
                .from('journey_enrollments')
                .update({ current_node_id: nextNodeId, updated_at: new Date().toISOString() })
                .eq('id', enrollment.id);

            await this.logAction(enrollment.id, currentNode.id, 'exit', 'Moved to next node');

            // Recursive call to process next node
            await this.processEnrollment(enrollment.id);
        } else {
            // End of Journey
            await this.completeEnrollment(enrollment.id, 'completed', 'Journey finished');
        }
    },

    // Helper: Evaluate Condition
    async evaluateCondition(enrollment: any, node: any): Promise<boolean> {
        const { conditionField, conditionOperator, conditionValue } = node.data;
        const context = enrollment.context || {};

        // Fetch real customer data if needed
        let actualValue = context[conditionField];

        // If not in context, maybe fetch from DB (mocked for 'total_spend' etc)
        if (actualValue === undefined) {
            // In a real app, query 'customers' or 'transactions' table here based on enrollment.customer_id
            if (conditionField === 'total_spend') actualValue = 1500; // Mock
            if (conditionField === 'total_transactions') actualValue = 5; // Mock
        }

        console.log(`Evaluating: ${actualValue} ${conditionOperator} ${conditionValue}`);

        switch (conditionOperator) {
            case '>': return Number(actualValue) > Number(conditionValue);
            case '<': return Number(actualValue) < Number(conditionValue);
            case '>=': return Number(actualValue) >= Number(conditionValue);
            case '<=': return Number(actualValue) <= Number(conditionValue);
            default: return false;
        }
    },

    // Helper: Execute Action
    async executeAction(enrollment: any, node: any) {
        const { actionType } = node.data;
        const context = enrollment.context || {};

        if (actionType === 'email') {
            const subject = this.replaceVariables(node.data.emailSubject, context);
            const body = this.replaceVariables(node.data.emailBody, context);

            await this.logAction(enrollment.id, node.id, 'process', `Sending Email: ${subject}`);

            // Use real email service
            const emailResult = await emailService.sendEmail(context.email, subject, body);

            if (emailResult.success) {
                await this.logAction(enrollment.id, node.id, 'process', `Email Sent Successfully`);
            } else {
                await this.logAction(enrollment.id, node.id, 'warning', `Email Failed: ${emailResult.error}`);
            }

        } else if (actionType === 'line_message') {
            const message = this.replaceVariables(node.data.emailBody, context); // Reusing emailBody
            const stickerPackageId = node.data.stickerPackageId;
            const stickerId = node.data.stickerId;

            await this.logAction(enrollment.id, node.id, 'process', `Sending LINE Message...`);

            const result = await lineService.sendMessage(enrollment.customer_id, message, stickerPackageId, stickerId);

            if (result.success) {
                await this.logAction(enrollment.id, node.id, 'process', `LINE Message Sent: ${message.substring(0, 30)}...`);
            } else {
                await this.logAction(enrollment.id, node.id, 'warning', `LINE Failed: ${result.error}`);
            }

        } else if (actionType === 'task') {
            const title = this.replaceVariables(node.data.taskTitle, context);
            const days = Number(node.data.taskDueDate) || 3;
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + days);

            // AI: Generate Call Script
            let script = '';
            try {
                await this.logAction(enrollment.id, node.id, 'process', `Generating AI Call Script...`);
                script = await aiService.generateCallScript(context);
            } catch (e) {
                console.error('Failed to generate call script', e);
                await this.logAction(enrollment.id, node.id, 'warning', `Failed to generate script`);
            }

            const { error } = await supabase.from('tasks').insert([{
                title: title,
                type: 'Call',
                status: 'Pending',
                due_date: dueDate.toISOString(),
                customer_id: enrollment.customer_id,
                script: script
            }]);

            if (error) throw error;
            await this.logAction(enrollment.id, node.id, 'process', `Created Task: ${title} with AI Script`);
        }
    },

    // Helper: Replace Variables
    replaceVariables(text: string, context: any): string {
        if (!text) return '';
        return text.replace(/{{(.*?)}}/g, (match, p1) => {
            const key = p1.trim();
            return context[key] !== undefined ? context[key] : match;
        });
    },

    async completeEnrollment(id: string, status: string, message: string) {
        await supabase
            .from('journey_enrollments')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);

        await this.logAction(id, null, 'exit', message);
    },

    async logAction(enrollmentId: string, nodeId: string | null, action: string, message: string) {
        await supabase.from('journey_logs').insert([{
            enrollment_id: enrollmentId,
            node_id: nodeId,
            action,
            message
        }]);
    }
};
