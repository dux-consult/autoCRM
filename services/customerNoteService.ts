import { supabase } from '../lib/supabase';
import { CustomerNote } from '../types';

export const customerNoteService = {
    async getNotesByCustomerId(customerId: string) {
        const { data, error } = await supabase
            .from('customer_notes')
            .select('*')
            .eq('customer_id', customerId)
            .order('is_pinned', { ascending: false })
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data as CustomerNote[];
    },

    async createNote(note: Partial<CustomerNote>) {
        const { data, error } = await supabase
            .from('customer_notes')
            .insert([note])
            .select()
            .single();

        if (error) throw error;
        return data as CustomerNote;
    },

    async updateNote(id: string, updates: Partial<CustomerNote>) {
        const { data, error } = await supabase
            .from('customer_notes')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as CustomerNote;
    },

    async togglePin(id: string, isPinned: boolean) {
        const { data, error } = await supabase
            .from('customer_notes')
            .update({ is_pinned: !isPinned, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as CustomerNote;
    },

    async deleteNote(id: string) {
        const { error } = await supabase
            .from('customer_notes')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
