import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { MessageSquare, CheckCircle, XCircle, Loader2, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const IntegrationsPage = () => {
    const [activeTab, setActiveTab] = useState('line');

    // LINE Config State
    const [config, setConfig] = useState({
        channelAccessToken: '',
        channelSecret: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    // Email Config State
    const [emailConfig, setEmailConfig] = useState({
        scriptUrl: ''
    });
    const [emailConnected, setEmailConnected] = useState(false);
    const [showEmailGuide, setShowEmailGuide] = useState(false);

    // AI Config State
    const [aiConfig, setAiConfig] = useState({
        apiKey: ''
    });
    const [aiConnected, setAiConnected] = useState(false);

    useEffect(() => {
        fetchIntegration();
        fetchEmailIntegration();
        fetchAiIntegration();
    }, []);

    const fetchIntegration = async () => {
        try {
            const { data, error } = await supabase
                .from('integrations')
                .select('*')
                .eq('provider', 'line')
                .single();

            if (data) {
                setConfig({
                    channelAccessToken: data.config.channel_access_token || '',
                    channelSecret: data.config.channel_secret || ''
                });
                setIsConnected(true);
            }
        } catch (error) {
            // No integration found, that's fine
        } finally {
            setLoading(false);
        }
    };

    const fetchEmailIntegration = async () => {
        try {
            const { data, error } = await supabase
                .from('integrations')
                .select('*')
                .eq('provider', 'email_gas')
                .single();

            if (data) {
                setEmailConfig({
                    scriptUrl: data.config.script_url || ''
                });
                setEmailConnected(true);
            }
        } catch (error) {
            // No integration found
        }
    };

    const fetchAiIntegration = async () => {
        try {
            const { data, error } = await supabase
                .from('integrations')
                .select('*')
                .eq('provider', 'gemini')
                .single();

            if (data) {
                setAiConfig({
                    apiKey: data.config.api_key || ''
                });
                setAiConnected(true);
            }
        } catch (error) {
            // No integration found
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Check if exists
            const { data: existing } = await supabase
                .from('integrations')
                .select('id')
                .eq('provider', 'line')
                .single();

            const payload = {
                provider: 'line',
                config: {
                    channel_access_token: config.channelAccessToken,
                    channel_secret: config.channelSecret
                },
                is_active: true,
                updated_at: new Date().toISOString()
            };

            if (existing) {
                await supabase
                    .from('integrations')
                    .update(payload)
                    .eq('id', existing.id);
            } else {
                await supabase
                    .from('integrations')
                    .insert([payload]);
            }

            setIsConnected(true);
            alert('LINE integration saved successfully!');
        } catch (error) {
            console.error('Error saving integration:', error);
            alert('Failed to save integration');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveEmail = async () => {
        setSaving(true);
        try {
            const { data: existing } = await supabase
                .from('integrations')
                .select('id')
                .eq('provider', 'email_gas')
                .single();

            const payload = {
                provider: 'email_gas',
                config: {
                    script_url: emailConfig.scriptUrl
                },
                is_active: true,
                updated_at: new Date().toISOString()
            };

            if (existing) {
                await supabase.from('integrations').update(payload).eq('id', existing.id);
            } else {
                await supabase.from('integrations').insert([payload]);
            }

            setEmailConnected(true);
            alert('Email integration saved successfully!');
        } catch (error) {
            console.error('Error saving email integration:', error);
            alert('Failed to save email integration');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAi = async () => {
        setSaving(true);
        try {
            const { data: existing } = await supabase
                .from('integrations')
                .select('id')
                .eq('provider', 'gemini')
                .single();

            const payload = {
                provider: 'gemini',
                config: {
                    api_key: aiConfig.apiKey
                },
                is_active: true,
                updated_at: new Date().toISOString()
            };

            if (existing) {
                await supabase.from('integrations').update(payload).eq('id', existing.id);
            } else {
                await supabase.from('integrations').insert([payload]);
            }

            setAiConnected(true);
            alert('AI integration saved successfully!');
        } catch (error) {
            console.error('Error saving AI integration:', error);
            alert('Failed to save AI integration');
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const GAS_CODE = `function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var to = data.to;
  var subject = data.subject;
  var body = data.body;
  
  GmailApp.sendEmail(to, subject, body);
  
  return ContentService.createTextOutput(JSON.stringify({'status': 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}`;

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto text-primary" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
                    <p className="text-gray-500">Connect your CRM with external platforms.</p>
                </div>
            </div>

            <div className="flex space-x-2 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('line')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'line' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    LINE Official Account
                </button>
                <button
                    onClick={() => setActiveTab('email')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'email' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Email (Gmail)
                </button>
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'ai' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    AI (Gemini)
                </button>
            </div>

            {activeTab === 'line' && (
                <Card className="border-l-4 border-l-[#00B900]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#00B900]/10 rounded-xl flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-[#00B900]" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">LINE Official Account</CardTitle>
                                <p className="text-sm text-gray-500">Send automated messages and notifications via LINE.</p>
                            </div>
                        </div>
                        <div>
                            {isConnected ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                    <CheckCircle className="w-4 h-4" /> Connected
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                                    <XCircle className="w-4 h-4" /> Not Connected
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        {/* Setup Guide Accordion */}
                        <div className="border border-blue-100 bg-blue-50 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setShowGuide(!showGuide)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-100/50 transition-colors"
                            >
                                <div className="flex items-center gap-2 text-blue-800 font-medium">
                                    <HelpCircle className="w-5 h-5" />
                                    How to connect LINE OA (Step-by-Step)
                                </div>
                                {showGuide ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-blue-600" />}
                            </button>

                            {showGuide && (
                                <div className="p-4 pt-0 text-sm text-blue-900 space-y-3 border-t border-blue-100 bg-white/50">
                                    <ol className="list-decimal list-inside space-y-2 mt-3 ml-2">
                                        <li>Go to <a href="https://developers.line.biz/console/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium inline-flex items-center">LINE Developers Console <ExternalLink className="w-3 h-3 ml-1" /></a> and log in.</li>
                                        <li>Create a new <strong>Provider</strong> (usually your business name).</li>
                                        <li>Create a new <strong>Messaging API</strong> channel.</li>
                                        <li>Go to the <strong>Messaging API</strong> tab in your channel settings.</li>
                                        <li>Scroll down to the bottom to find <strong>Channel Access Token</strong> and click 'Issue'.</li>
                                        <li>Copy the long token string and paste it below.</li>
                                        <li>Copy the <strong>Channel Secret</strong> from the 'Basic Settings' tab.</li>
                                    </ol>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Channel Access Token (Long-lived)</label>
                                <Input
                                    type="password"
                                    value={config.channelAccessToken}
                                    onChange={(e) => setConfig({ ...config, channelAccessToken: e.target.value })}
                                    placeholder="x/x/x..."
                                    className="font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Channel Secret</label>
                                <Input
                                    type="password"
                                    value={config.channelSecret}
                                    onChange={(e) => setConfig({ ...config, channelSecret: e.target.value })}
                                    placeholder="Enter Channel Secret"
                                    className="font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSave} disabled={saving || !config.channelAccessToken}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Connection
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'email' && (
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                                <div className="text-red-500 font-bold text-xl">G</div>
                            </div>
                            <div>
                                <CardTitle className="text-lg">Gmail Integration (Free)</CardTitle>
                                <p className="text-sm text-gray-500">Send emails using your own Gmail account via Google Apps Script.</p>
                            </div>
                        </div>
                        <div>
                            {emailConnected ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                    <CheckCircle className="w-4 h-4" /> Connected
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                                    <XCircle className="w-4 h-4" /> Not Connected
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        {/* Setup Guide Accordion */}
                        <div className="border border-blue-100 bg-blue-50 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setShowEmailGuide(!showEmailGuide)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-100/50 transition-colors"
                            >
                                <div className="flex items-center gap-2 text-blue-800 font-medium">
                                    <HelpCircle className="w-5 h-5" />
                                    How to connect Gmail (Step-by-Step)
                                </div>
                                {showEmailGuide ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-blue-600" />}
                            </button>

                            {showEmailGuide && (
                                <div className="p-4 pt-0 text-sm text-blue-900 space-y-4 border-t border-blue-100 bg-white/50">
                                    <ol className="list-decimal list-inside space-y-3 mt-3 ml-2">
                                        <li>Go to <a href="https://script.google.com/home" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium inline-flex items-center">Google Apps Script <ExternalLink className="w-3 h-3 ml-1" /></a> and click <strong>"New Project"</strong>.</li>
                                        <li>
                                            Delete any code in the editor and paste the following code:
                                            <div className="mt-2 relative">
                                                <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto font-mono">
                                                    {GAS_CODE}
                                                </pre>
                                                <button
                                                    onClick={() => copyToClipboard(GAS_CODE)}
                                                    className="absolute top-2 right-2 px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors"
                                                >
                                                    Copy Code
                                                </button>
                                            </div>
                                        </li>
                                        <li>Click <strong>Deploy</strong> (top right) {'>'} <strong>New deployment</strong>.</li>
                                        <li>Click the gear icon (Select type) {'>'} <strong>Web app</strong>.</li>
                                        <li>
                                            Set configuration:
                                            <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                                                <li>Description: "AutoCRM Email"</li>
                                                <li>Execute as: <strong>Me</strong> (your email)</li>
                                                <li>Who has access: <strong>Anyone</strong> (Important!)</li>
                                            </ul>
                                        </li>
                                        <li>Click <strong>Deploy</strong> and authorize access with your Gmail account.</li>
                                        <li>Copy the <strong>Web app URL</strong> and paste it below.</li>
                                    </ol>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Script Web App URL</label>
                            <Input
                                type="text"
                                value={emailConfig.scriptUrl}
                                onChange={(e) => setEmailConfig({ ...emailConfig, scriptUrl: e.target.value })}
                                placeholder="https://script.google.com/macros/s/..."
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500">This URL allows AutoCRM to send emails on your behalf via Google's secure servers.</p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSaveEmail} disabled={saving || !emailConfig.scriptUrl}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Email Connection
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'ai' && (
                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Google Gemini AI</CardTitle>
                                <p className="text-sm text-gray-500">Unlock AI features: Magic Flow, Content Rewriting, and more.</p>
                            </div>
                        </div>
                        <div>
                            {aiConnected ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                    <CheckCircle className="w-4 h-4" /> Connected
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                                    <XCircle className="w-4 h-4" /> Not Connected
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" /> How to get Gemini API Key (Free)
                            </h3>
                            <div className="text-sm text-purple-900 space-y-2">
                                <p>1. Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-medium">Google AI Studio</a>.</p>
                                <p>2. Click <strong>Create API key</strong>.</p>
                                <p>3. Copy the key and paste it below.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Gemini API Key</label>
                            <Input
                                type="password"
                                value={aiConfig.apiKey}
                                onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                                placeholder="AIzaSy..."
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSaveAi} disabled={saving || !aiConfig.apiKey}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save AI Connection
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
