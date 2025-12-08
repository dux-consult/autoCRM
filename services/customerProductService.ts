import { supabase } from '../lib/supabase';
import { CustomerProduct } from '../types';

export const customerProductService = {
    async getProductsByCustomerId(customerId: string) {
        const { data, error } = await supabase
            .from('customer_products')
            .select(`
        *,
        product:products (id, name, selling_price, usage_duration_days)
      `)
            .eq('customer_id', customerId)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as CustomerProduct[];
    },

    async createCustomerProduct(data: Partial<CustomerProduct>) {
        const { data: result, error } = await supabase
            .from('customer_products')
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return result as CustomerProduct;
    },

    async updateProductStatus(id: string, status: 'active' | 'expired' | 'serviced') {
        const { data, error } = await supabase
            .from('customer_products')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as CustomerProduct;
    },

    async updateNextServiceDate(id: string, nextServiceDate: string) {
        const { data, error } = await supabase
            .from('customer_products')
            .update({ next_service_date: nextServiceDate })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as CustomerProduct;
    }
};
