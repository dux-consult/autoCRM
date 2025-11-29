import { supabase } from '../lib/supabase';
import { Shop } from '../types';

export const shopService = {
    async getShop(): Promise<Shop | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // Get tenant_id from profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('tenant_id')
            .eq('id', user.id)
            .single();

        if (!profile?.tenant_id) return null;

        // Get shop details
        const { data: shop, error } = await supabase
            .from('tenants')
            .select('*')
            .eq('id', profile.tenant_id)
            .single();

        if (error) {
            console.error('Error fetching shop:', error);
            return null;
        }

        return shop;
    },

    async createShop(shopData: Partial<Shop>): Promise<Shop | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // Create tenant
        const { data: shop, error } = await supabase
            .from('tenants')
            .insert([{
                name: shopData.name,
                address: shopData.address,
                phone: shopData.phone
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating shop:', error);
            throw error;
        }

        // Link to profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ tenant_id: shop.id })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error linking shop to profile:', updateError);
            // Optional: Rollback tenant creation? For MVP, maybe not.
        }

        return shop;
    },

    async updateShop(id: string, shopData: Partial<Shop>): Promise<Shop | null> {
        const { data, error } = await supabase
            .from('tenants')
            .update({
                name: shopData.name,
                address: shopData.address,
                phone: shopData.phone,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating shop:', error);
            throw error;
        }

        return data;
    }
};
