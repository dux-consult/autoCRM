import { supabase } from '../lib/supabase';

const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';

export const lineService = {
    async sendMessage(customerId: string, text: string, stickerPackageId?: string, stickerId?: string) {
        console.log(`[LINE Service] Preparing to send to customer ${customerId}: ${text} (Sticker: ${stickerPackageId}/${stickerId})`);

        // 1. Get Customer's LINE User ID
        // In a real app, 'customers' table should have a 'line_user_id' column.
        // For now, we'll check if it exists in the 'customers' table metadata or similar.
        const { data: customer } = await supabase
            .from('customers')
            .select('line_user_id')
            .eq('id', customerId)
            .single();

        if (!customer || !customer.line_user_id) {
            console.warn(`[LINE Service] Customer ${customerId} does not have a linked LINE User ID.`);
            return { success: false, error: 'No LINE User ID linked' };
        }

        // 2. Get LINE Channel Token from Integrations
        const { data: integration } = await supabase
            .from('integrations')
            .select('config')
            .eq('provider', 'line')
            .eq('is_active', true)
            .single();

        if (!integration || !integration.config.channel_access_token) {
            console.warn(`[LINE Service] No active LINE integration found.`);
            return { success: false, error: 'LINE Integration not configured' };
        }

        const token = integration.config.channel_access_token;

        // 3. Construct Messages Payload
        const messages: any[] = [];

        if (text) {
            messages.push({
                type: 'text',
                text: text
            });
        }

        if (stickerPackageId && stickerId) {
            messages.push({
                type: 'sticker',
                packageId: stickerPackageId,
                stickerId: stickerId
            });
        }

        if (messages.length === 0) {
            return { success: false, error: 'No message content provided' };
        }

        // 4. Send Message via LINE API
        try {
            const response = await fetch(LINE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    to: customer.line_user_id,
                    messages: messages
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('[LINE Service] API Error:', errorData);
                throw new Error(`LINE API Error: ${errorData.message}`);
            }

            console.log(`[LINE Service] Message sent successfully!`);
            return { success: true };

        } catch (error: any) {
            console.error('[LINE Service] Failed to send message:', error);
            return { success: false, error: error.message };
        }
    }
};
