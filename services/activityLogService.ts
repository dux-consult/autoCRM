import { supabase } from '../lib/supabase';
import { ActivityLog } from '../types';

export const activityLogService = {
    async getActivityLogs(customerId: string, limit = 20, offset = 0) {
        const { data, error, count } = await supabase
            .from('activity_logs')
            .select('*', { count: 'exact' })
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return { data: data as ActivityLog[], total: count || 0 };
    },

    async createActivityLog(log: Partial<ActivityLog>) {
        const { data, error } = await supabase
            .from('activity_logs')
            .insert([log])
            .select()
            .single();

        if (error) throw error;
        return data as ActivityLog;
    },

    async logCall(customerId: string, success: boolean, notes?: string) {
        return this.createActivityLog({
            customer_id: customerId,
            type: 'call',
            title: success ? 'โทรสำเร็จ' : 'โทรไม่สำเร็จ',
            description: notes,
            metadata: { success }
        });
    },

    async logChat(customerId: string, summary: string) {
        return this.createActivityLog({
            customer_id: customerId,
            type: 'chat',
            title: 'แชท LINE',
            description: summary
        });
    },

    async logAutoEvent(customerId: string, title: string, description?: string) {
        return this.createActivityLog({
            customer_id: customerId,
            type: 'auto',
            title,
            description
        });
    }
};
