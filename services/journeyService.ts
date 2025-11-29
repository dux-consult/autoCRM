import { supabase } from '../lib/supabase';
import { AutomationJourney, JourneyVersion } from '../types';
import { Node, Edge } from '@xyflow/react';

export const journeyService = {
    async getAllJourneys() {
        const { data, error } = await supabase
            .from('automation_journeys')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data as AutomationJourney[];
    },

    async getJourney(id: string) {
        // Get journey metadata
        const { data: journey, error: journeyError } = await supabase
            .from('automation_journeys')
            .select('*')
            .eq('id', id)
            .single();

        if (journeyError) throw journeyError;

        // Get latest version
        const { data: version, error: versionError } = await supabase
            .from('journey_versions')
            .select('*')
            .eq('journey_id', id)
            .order('version_number', { ascending: false })
            .limit(1)
            .single();

        // It's possible to have a journey without versions if just created, but we'll handle that
        return {
            journey: journey as AutomationJourney,
            latestVersion: version as JourneyVersion | null
        };
    },

    async saveJourney(
        id: string | null,
        name: string,
        description: string,
        nodes: Node[],
        edges: Edge[],
        isPublish: boolean = false
    ) {
        let journeyId = id;

        // 1. Create or Update Journey Metadata
        if (!journeyId) {
            const { data, error } = await supabase
                .from('automation_journeys')
                .insert([{
                    name,
                    description,
                    status: isPublish ? 'active' : 'draft'
                }])
                .select()
                .single();

            if (error) throw error;
            journeyId = data.id;
        } else {
            const { error } = await supabase
                .from('automation_journeys')
                .update({
                    name,
                    description,
                    status: isPublish ? 'active' : 'draft',
                    updated_at: new Date().toISOString()
                })
                .eq('id', journeyId);

            if (error) throw error;
        }

        // 2. Save Version
        // For simplicity, we'll just get the latest version number and increment
        // In a real app, we might check if the latest version is already a draft and update it instead of creating new

        // Get max version
        const { data: maxVerData } = await supabase
            .from('journey_versions')
            .select('version_number')
            .eq('journey_id', journeyId)
            .order('version_number', { ascending: false })
            .limit(1)
            .single();

        const nextVersion = (maxVerData?.version_number || 0) + 1;

        const definition = { nodes, edges };

        const { error: versionError } = await supabase
            .from('journey_versions')
            .insert([{
                journey_id: journeyId,
                version_number: nextVersion,
                definition,
                is_active: isPublish
            }]);

        if (versionError) throw versionError;

        return journeyId;
    },

    async getJourneyHistory(journeyId: string) {
        const { data, error } = await supabase
            .from('journey_enrollments')
            .select(`
                *,
                customer:customers (first_name, last_name, email)
            `)
            .eq('journey_id', journeyId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getEnrollmentLogs(enrollmentId: string) {
        const { data, error } = await supabase
            .from('journey_logs')
            .select('*')
            .eq('enrollment_id', enrollmentId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    }
};
