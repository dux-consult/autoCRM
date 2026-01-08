import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const productService = {
    async getProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Product[];
    },

    async getProduct(id: string) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Product;
    },

    async createProduct(product: Partial<Product>) {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select()
            .single();

        if (error) throw error;
        return data as Product;
    },

    async updateProduct(id: string, updates: Partial<Product>) {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Product;
    },

    async deleteProduct(id: string) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async uploadProductImage(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `product_${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Product image upload error:', uploadError);
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);

        return data.publicUrl;
    }
};
