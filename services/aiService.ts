import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../lib/supabase';

export const aiService = {
    async getApiKey() {
        const { data: integration } = await supabase
            .from('integrations')
            .select('config')
            .eq('provider', 'gemini')
            .eq('is_active', true)
            .single();

        if (!integration || !integration.config.api_key) {
            throw new Error('Gemini API Key not configured');
        }
        return integration.config.api_key;
    },

    async generateFlow(prompt: string) {
        try {
            const apiKey = await this.getApiKey();
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const systemPrompt = `
                You are an expert Automation Flow Generator.
                User will provide a requirement. You must output a JSON object representing the flow.
                The JSON must have "nodes" and "edges".
                Node types: 'trigger', 'action', 'condition', 'delay'.
                Action types: 'line_message', 'email', 'task'.
                Trigger types: 'new_customer', 'new_transaction'.
                
                Example Output Format:
                {
                    "nodes": [
                        { "id": "1", "type": "trigger", "position": { "x": 0, "y": 0 }, "data": { "label": "New Customer", "triggerType": "new_customer" } },
                        { "id": "2", "type": "action", "position": { "x": 0, "y": 100 }, "data": { "label": "Send Welcome LINE", "actionType": "line_message", "emailBody": "Welcome!" } }
                    ],
                    "edges": [
                        { "id": "e1-2", "source": "1", "target": "2" }
                    ]
                }
                RETURN ONLY JSON. NO MARKDOWN.
            `;

            const result = await model.generateContent(`${systemPrompt}\n\nUser Requirement: ${prompt}`);
            const response = result.response;
            const text = response.text();

            // Clean up markdown code blocks if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);

        } catch (error) {
            console.error('AI Flow Generation Error:', error);
            throw error;
        }
    },

    async rewriteContent(text: string, tone: 'urgency' | 'empathy' | 'reward') {
        try {
            const apiKey = await this.getApiKey();
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const tonePrompts = {
                urgency: "Make it urgent, short, and persuasive. Use emojis like 🚨 or ⏳.",
                empathy: "Make it caring, understanding, and polite. Use emojis like 🤝 or 🧡.",
                reward: "Focus on the benefit, discount, or exclusivity. Use emojis like 🎁 or ✨."
            };

            const prompt = `Rewrite the following text to match the tone: ${tone}. ${tonePrompts[tone]}\n\nText: "${text}"`;

            const result = await model.generateContent(prompt);
            return result.response.text();

        } catch (error) {
            console.error('AI Rewrite Error:', error);
            return text; // Fallback to original
        }
    },

    async generateCallScript(context: any) {
        try {
            const apiKey = await this.getApiKey();
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `
                Generate a short call script for a sales staff.
                Customer Context: ${JSON.stringify(context)}
                Goal: Close the sale or follow up.
                Keep it natural, polite, and concise (Thai language).
            `;

            const result = await model.generateContent(prompt);
            return result.response.text();

        } catch (error) {
            console.error('AI Script Generation Error:', error);
            return "Error generating script. Please review customer history manually.";
        }
    },

    async simulateJourney(flowDefinition: any) {
        try {
            const apiKey = await this.getApiKey();
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `
                Simulate 100 customers going through this automation flow.
                Flow Definition: ${JSON.stringify(flowDefinition)}
                
                Predict:
                1. Total Sales (assume average product price 1000 THB if purchase happens).
                2. Conversion Rate (%).
                3. Drop-off Rate (%).
                4. Potential Risks (e.g., blocked users).
                
                Return JSON format:
                {
                    "totalSales": number,
                    "conversionRate": number,
                    "dropOffRate": number,
                    "risks": ["risk1", "risk2"]
                }
                RETURN ONLY JSON.
            `;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);

        } catch (error) {
            console.error('AI Simulation Error:', error);
            return {
                totalSales: 0,
                conversionRate: 0,
                dropOffRate: 0,
                risks: ["Simulation failed"]
            };
        }
    }
};
