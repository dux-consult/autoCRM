import { supabase } from '../lib/supabase';

export const emailService = {
    async sendEmail(to: string, subject: string, body: string) {
        console.log(`[Email Service] Preparing to send email to ${to}`);

        // 1. Get Email Config (GAS Script URL)
        const { data: integration } = await supabase
            .from('integrations')
            .select('config')
            .eq('provider', 'email_gas')
            .eq('is_active', true)
            .single();

        if (!integration || !integration.config.script_url) {
            console.warn(`[Email Service] No active Email integration found.`);
            return { success: false, error: 'Email Integration not configured' };
        }

        const scriptUrl = integration.config.script_url;

        // 2. Send Request to Google Apps Script
        try {
            // Note: GAS Web App requires 'no-cors' mode if calling from browser directly,
            // BUT 'no-cors' means we can't read the response.
            // However, since we just want to fire and forget (mostly), or we trust it works.
            // Ideally, this should be done via a proxy or Edge Function to avoid CORS issues properly.
            // For this "Client-side only" prototype, we will try 'no-cors' and assume success if no network error.

            await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors', // Important for GAS Web App client-side calls
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: to,
                    subject: subject,
                    body: body
                })
            });

            console.log(`[Email Service] Email request sent to GAS!`);
            return { success: true };

        } catch (error: any) {
            console.error('[Email Service] Failed to send email:', error);
            return { success: false, error: error.message };
        }
    }
};
