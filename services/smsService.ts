import { supabase } from '../lib/supabase';

const BASE_URL = 'https://api-v2.thaibulksms.com';

interface SMSConfig {
    api_key: string;
    api_secret: string;
    sender?: string;
}

interface SendSMSResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

interface CreditResponse {
    credit: number;
    error?: string;
}

// Helper to get config from database
async function getConfig(): Promise<SMSConfig | null> {
    const { data } = await supabase
        .from('integrations')
        .select('config')
        .eq('provider', 'thaibulksms')
        .maybeSingle();

    if (!data?.config) return null;
    return {
        api_key: data.config.api_key || '',
        api_secret: data.config.api_secret || '',
        sender: data.config.sender || ''
    };
}

// Create Basic Auth header
function createAuthHeader(apiKey: string, apiSecret: string): string {
    return 'Basic ' + btoa(`${apiKey}:${apiSecret}`);
}

export const smsService = {
    /**
     * Get remaining credit from ThaibulkSMS account
     */
    async getCredit(): Promise<CreditResponse> {
        const config = await getConfig();
        if (!config) {
            return { credit: 0, error: 'SMS not configured' };
        }

        try {
            const response = await fetch(`${BASE_URL}/credit`, {
                method: 'GET',
                headers: {
                    'Authorization': createAuthHeader(config.api_key, config.api_secret),
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { credit: 0, error: errorData.message || 'Failed to get credit' };
            }

            const data = await response.json();
            return { credit: data.credit || data.balance || 0 };
        } catch (error: any) {
            console.error('ThaibulkSMS credit check error:', error);
            return { credit: 0, error: error.message };
        }
    },

    /**
     * Send SMS via ThaibulkSMS
     * @param to - Recipient phone number (format: 0812345678 or 66812345678)
     * @param message - Text message content
     * @param sender - Optional sender name (max 11 chars)
     */
    async sendSMS(to: string, message: string, sender?: string): Promise<SendSMSResponse> {
        const config = await getConfig();
        if (!config) {
            return { success: false, error: 'SMS not configured' };
        }

        // Format phone number (remove leading 0, add 66)
        let msisdn = to.replace(/\D/g, '');
        if (msisdn.startsWith('0')) {
            msisdn = '66' + msisdn.substring(1);
        } else if (!msisdn.startsWith('66')) {
            msisdn = '66' + msisdn;
        }

        try {
            const formData = new URLSearchParams();
            formData.append('msisdn', msisdn);
            formData.append('message', message);
            formData.append('sender', sender || config.sender || 'AutoCRM');

            const response = await fetch(`${BASE_URL}/sms`, {
                method: 'POST',
                headers: {
                    'Authorization': createAuthHeader(config.api_key, config.api_secret),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || data.error || 'Failed to send SMS'
                };
            }

            return {
                success: true,
                messageId: data.messageId || data.uuid
            };
        } catch (error: any) {
            console.error('ThaibulkSMS send error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Test connection with ThaibulkSMS
     */
    async testConnection(apiKey: string, apiSecret: string): Promise<{ success: boolean; credit?: number; error?: string }> {
        try {
            const response = await fetch(`${BASE_URL}/credit`, {
                method: 'GET',
                headers: {
                    'Authorization': createAuthHeader(apiKey, apiSecret),
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { success: false, error: errorData.message || 'Invalid credentials' };
            }

            const data = await response.json();
            return { success: true, credit: data.credit || data.balance || 0 };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};
