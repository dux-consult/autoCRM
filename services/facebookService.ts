import { supabase } from '../lib/supabase';

const BASE_URL = 'https://graph.facebook.com/v19.0';

interface FacebookConfig {
    page_access_token: string;
    page_id?: string;
    page_name?: string;
}

interface SendMessageResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

interface PageInfo {
    id: string;
    name: string;
    error?: string;
}

// Helper to get config from database
async function getConfig(): Promise<FacebookConfig | null> {
    const { data } = await supabase
        .from('integrations')
        .select('config')
        .eq('provider', 'facebook')
        .maybeSingle();

    if (!data?.config) return null;
    return {
        page_access_token: data.config.page_access_token || '',
        page_id: data.config.page_id || '',
        page_name: data.config.page_name || ''
    };
}

export const facebookService = {
    /**
     * Get page info to verify token is valid
     */
    async getPageInfo(accessToken: string): Promise<PageInfo> {
        try {
            const response = await fetch(`${BASE_URL}/me?fields=id,name&access_token=${accessToken}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    id: '',
                    name: '',
                    error: errorData.error?.message || 'Invalid access token'
                };
            }

            const data = await response.json();
            return {
                id: data.id,
                name: data.name
            };
        } catch (error: any) {
            console.error('Facebook getPageInfo error:', error);
            return { id: '', name: '', error: error.message };
        }
    },

    /**
     * Send message via Facebook Messenger
     * @param recipientId - Facebook PSID (Page-Scoped User ID)
     * @param message - Text message content
     */
    async sendMessage(recipientId: string, message: string): Promise<SendMessageResponse> {
        const config = await getConfig();
        if (!config || !config.page_access_token) {
            return { success: false, error: 'Facebook not configured' };
        }

        try {
            const response = await fetch(
                `${BASE_URL}/me/messages?access_token=${config.page_access_token}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messaging_type: 'RESPONSE',
                        recipient: { id: recipientId },
                        message: { text: message }
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error?.message || 'Failed to send message'
                };
            }

            return {
                success: true,
                messageId: data.message_id
            };
        } catch (error: any) {
            console.error('Facebook sendMessage error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Test connection with Facebook Page
     */
    async testConnection(accessToken: string): Promise<{ success: boolean; pageId?: string; pageName?: string; error?: string }> {
        const pageInfo = await this.getPageInfo(accessToken);

        if (pageInfo.error) {
            return { success: false, error: pageInfo.error };
        }

        return {
            success: true,
            pageId: pageInfo.id,
            pageName: pageInfo.name
        };
    }
};
