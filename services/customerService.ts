import { supabase } from '../lib/supabase';
import { Customer } from '../types';
import { automationEngine } from './automationEngine';

export const customerService = {
    async getCustomers() {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Customer[];
    },

    async getCustomer(id: string) {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Customer;
    },

    async createCustomer(customer: Partial<Customer>) {
        const { data, error } = await supabase
            .from('customers')
            .insert([customer])
            .select()
            .single();

        if (error) throw error;

        // Trigger Automation
        try {
            await automationEngine.startJourney('new_customer', data);
        } catch (err) {
            console.error('Failed to trigger automation:', err);
            // Don't fail the customer creation just because automation failed
        }

        return data as Customer;
    },

    async updateCustomer(id: string, updates: Partial<Customer>) {
        const { data, error } = await supabase
            .from('customers')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Customer;
    },

    async deleteCustomer(id: string) {
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
