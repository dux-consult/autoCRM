import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@/components/ui';
import { MessageSquare, CheckCircle, XCircle, Loader2, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Sparkles, Phone, Facebook } from 'lucide-react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { smsService } from '@/services/smsService';
import { facebookService } from '@/services/facebookService';

export const IntegrationsPage = () => {
    const { t } = useLanguage();
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

    // SMS Config State
    const [smsConfig, setSmsConfig] = useState({
        apiKey: '',
        apiSecret: '',
        sender: ''
    });
    const [smsConnected, setSmsConnected] = useState(false);
    const [smsCredit, setSmsCredit] = useState<number | null>(null);
    const [showSmsGuide, setShowSmsGuide] = useState(false);

    // Facebook Config State
    const [fbConfig, setFbConfig] = useState({
        accessToken: '',
        pageId: '',
        pageName: ''
    });
    const [fbConnected, setFbConnected] = useState(false);
    const [showFbGuide, setShowFbGuide] = useState(false);

    useEffect(() => {
        fetchIntegration();
        fetchEmailIntegration();
        fetchAiIntegration();
        fetchSmsIntegration();
        fetchFbIntegration();
    }, []);

    const fetchIntegration = async () => {
        try {
            const { data, error } = await supabase
                .from('integrations')
                .select('*')
                .eq('provider', 'line')
                .maybeSingle();

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
                .maybeSingle();

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
                .maybeSingle();

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

    const fetchSmsIntegration = async () => {
        try {
            const { data } = await supabase
                .from('integrations')
                .select('*')
                .eq('provider', 'thaibulksms')
                .maybeSingle();

            if (data) {
                setSmsConfig({
                    apiKey: data.config.api_key || '',
                    apiSecret: data.config.api_secret || '',
                    sender: data.config.sender || ''
                });
                setSmsConnected(true);
                // Fetch credit
                const creditRes = await smsService.getCredit();
                if (!creditRes.error) {
                    setSmsCredit(creditRes.credit);
                }
            }
        } catch (error) {
            // No integration found
        }
    };

    const fetchFbIntegration = async () => {
        try {
            const { data } = await supabase
                .from('integrations')
                .select('*')
                .eq('provider', 'facebook')
                .maybeSingle();

            if (data) {
                setFbConfig({
                    accessToken: data.config.page_access_token || '',
                    pageId: data.config.page_id || '',
                    pageName: data.config.page_name || ''
                });
                setFbConnected(true);
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
                .maybeSingle();

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
            alert(t('lineSaved'));
        } catch (error) {
            console.error('Error saving integration:', error);
            alert(t('failedToSaveLine'));
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
                .maybeSingle();

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
            alert(t('emailSaved'));
        } catch (error) {
            console.error('Error saving email integration:', error);
            alert(t('failedToSaveEmail'));
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
                .maybeSingle();

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
            alert(t('aiSaved'));
        } catch (error) {
            console.error('Error saving AI integration:', error);
            alert(t('failedToSaveAi'));
        } finally {
            setSaving(false);
        }
    };

    const handleSaveSms = async () => {
        setSaving(true);
        try {
            // Test connection first
            const testResult = await smsService.testConnection(smsConfig.apiKey, smsConfig.apiSecret);
            if (!testResult.success) {
                alert('ไม่สามารถเชื่อมต่อได้: ' + testResult.error);
                setSaving(false);
                return;
            }

            const { data: existing } = await supabase
                .from('integrations')
                .select('id')
                .eq('provider', 'thaibulksms')
                .maybeSingle();

            const payload = {
                provider: 'thaibulksms',
                config: {
                    api_key: smsConfig.apiKey,
                    api_secret: smsConfig.apiSecret,
                    sender: smsConfig.sender
                },
                is_active: true,
                updated_at: new Date().toISOString()
            };

            if (existing) {
                await supabase.from('integrations').update(payload).eq('id', existing.id);
            } else {
                await supabase.from('integrations').insert([payload]);
            }

            setSmsConnected(true);
            setSmsCredit(testResult.credit || 0);
            alert('บันทึกการเชื่อมต่อ SMS สำเร็จ!');
        } catch (error) {
            console.error('Error saving SMS integration:', error);
            alert('ไม่สามารถบันทึกได้');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveFb = async () => {
        setSaving(true);
        try {
            // Test connection first
            const testResult = await facebookService.testConnection(fbConfig.accessToken);
            if (!testResult.success) {
                alert('ไม่สามารถเชื่อมต่อได้: ' + testResult.error);
                setSaving(false);
                return;
            }

            const { data: existing } = await supabase
                .from('integrations')
                .select('id')
                .eq('provider', 'facebook')
                .maybeSingle();

            const payload = {
                provider: 'facebook',
                config: {
                    page_access_token: fbConfig.accessToken,
                    page_id: testResult.pageId,
                    page_name: testResult.pageName
                },
                is_active: true,
                updated_at: new Date().toISOString()
            };

            if (existing) {
                await supabase.from('integrations').update(payload).eq('id', existing.id);
            } else {
                await supabase.from('integrations').insert([payload]);
            }

            setFbConfig({
                accessToken: fbConfig.accessToken,
                pageId: testResult.pageId || '',
                pageName: testResult.pageName || ''
            });
            setFbConnected(true);
            alert('บันทึกการเชื่อมต่อ Facebook สำเร็จ!');
        } catch (error) {
            console.error('Error saving Facebook integration:', error);
            alert('ไม่สามารถบันทึกได้');
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert(t('copiedToClipboard'));
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
                    <h2 className="text-2xl font-bold text-gray-900">{t('integrations')}</h2>
                    <p className="text-gray-500">{t('integrationsDesc')}</p>
                </div>
            </div>

            <div className="flex space-x-2 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('line')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'line' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    {t('lineOA')}
                </button>
                <button
                    onClick={() => setActiveTab('email')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'email' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    {t('emailGmail')}
                </button>
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'ai' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    {t('aiGemini')}
                </button>
                <button
                    onClick={() => setActiveTab('sms')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'sms' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    SMS
                </button>
                <button
                    onClick={() => setActiveTab('facebook')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'facebook' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Facebook
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
                                <CardTitle className="text-lg">{t('lineOA')}</CardTitle>
                                <p className="text-sm text-gray-500">{t('lineDesc')}</p>
                            </div>
                        </div>
                        <div>
                            {isConnected ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                    <CheckCircle className="w-4 h-4" /> {t('connected')}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                                    <XCircle className="w-4 h-4" /> {t('notConnected')}
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
                                    {t('howToConnectLine')}
                                </div>
                                {showGuide ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-blue-600" />}
                            </button>

                            {showGuide && (
                                <div className="p-4 pt-0 text-sm text-blue-900 space-y-3 border-t border-blue-100 bg-white/50">
                                    <ol className="list-decimal list-inside space-y-2 mt-3 ml-2">
                                        <li>ไปที่ <a href="https://developers.line.biz/console/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium inline-flex items-center">LINE Developers Console <ExternalLink className="w-3 h-3 ml-1" /></a> และเข้าสู่ระบบ</li>
                                        <li>สร้าง <strong>Provider</strong> ใหม่ (ใช้ชื่อธุรกิจของคุณ)</li>
                                        <li>สร้าง Channel ใหม่ แบบ <strong>Messaging API</strong></li>
                                        <li>ไปที่แท็บ <strong>Messaging API</strong> ในการตั้งค่า Channel</li>
                                        <li>เลื่อนลงไปด้านล่างเพื่อหา <strong>Channel Access Token</strong> แล้วกด 'Issue'</li>
                                        <li>คัดลอก Token แล้วนำมาวางด้านล่าง</li>
                                        <li>คัดลอก <strong>Channel Secret</strong> จากแท็บ 'Basic Settings'</li>
                                    </ol>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">{t('channelAccessToken')}</label>
                                <Input
                                    type="password"
                                    value={config.channelAccessToken}
                                    onChange={(e) => setConfig({ ...config, channelAccessToken: e.target.value })}
                                    placeholder="x/x/x..."
                                    className="font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">{t('channelSecret')}</label>
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
                                {t('saveConnection')}
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
                                <CardTitle className="text-lg">{t('gmailIntegration')}</CardTitle>
                                <p className="text-sm text-gray-500">{t('gmailDesc')}</p>
                            </div>
                        </div>
                        <div>
                            {emailConnected ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                    <CheckCircle className="w-4 h-4" /> {t('connected')}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                                    <XCircle className="w-4 h-4" /> {t('notConnected')}
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
                                    {t('howToConnectGmail')}
                                </div>
                                {showEmailGuide ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-blue-600" />}
                            </button>

                            {showEmailGuide && (
                                <div className="p-4 pt-0 text-sm text-blue-900 space-y-4 border-t border-blue-100 bg-white/50">
                                    <ol className="list-decimal list-inside space-y-3 mt-3 ml-2">
                                        <li>ไปที่ <a href="https://script.google.com/home" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium inline-flex items-center">Google Apps Script <ExternalLink className="w-3 h-3 ml-1" /></a> แล้วกด <strong>"New Project"</strong></li>
                                        <li>
                                            ลบโค้ดเดิมออกแล้ววางโค้ดนี้แทน:
                                            <div className="mt-2 relative">
                                                <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto font-mono">
                                                    {GAS_CODE}
                                                </pre>
                                                <button
                                                    onClick={() => copyToClipboard(GAS_CODE)}
                                                    className="absolute top-2 right-2 px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors"
                                                >
                                                    คัดลอก
                                                </button>
                                            </div>
                                        </li>
                                        <li>กด <strong>Deploy</strong> (มุมขวาบน) {'>'} <strong>New deployment</strong></li>
                                        <li>กดไอคอนรูปเฟือง (Select type) {'>'} <strong>Web app</strong></li>
                                        <li>
                                            ตั้งค่าดังนี้:
                                            <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                                                <li>Description: "AutoCRM Email"</li>
                                                <li>Execute as: <strong>Me</strong> (อีเมลของคุณ)</li>
                                                <li>Who has access: <strong>Anyone</strong> (สำคัญมาก!)</li>
                                            </ul>
                                        </li>
                                        <li>กด <strong>Deploy</strong> แล้วอนุญาตการเข้าถึงด้วยบัญชี Gmail ของคุณ</li>
                                        <li>คัดลอก <strong>Web app URL</strong> มาวางด้านล่าง</li>
                                    </ol>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{t('scriptWebAppUrl')}</label>
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
                                {t('saveEmailConnection')}
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
                                <CardTitle className="text-lg">{t('googleGeminiAi')}</CardTitle>
                                <p className="text-sm text-gray-500">{t('geminiDesc')}</p>
                            </div>
                        </div>
                        <div>
                            {aiConnected ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                    <CheckCircle className="w-4 h-4" /> {t('connected')}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                                    <XCircle className="w-4 h-4" /> {t('notConnected')}
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" /> {t('howToGetGeminiKey')}
                            </h3>
                            <div className="text-sm text-purple-900 space-y-2">
                                <p>1. ไปที่ <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-medium">Google AI Studio</a></p>
                                <p>2. กด <strong>Create API key</strong></p>
                                <p>3. คัดลอก Key มาวางด้านล่าง</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{t('geminiApiKey')}</label>
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
                                {t('saveAiConnection')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'sms' && (
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                                <Phone className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">ThaibulkSMS</CardTitle>
                                <p className="text-sm text-gray-500">ส่ง SMS แจ้งเตือนลูกค้าอัตโนมัติ</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {smsCredit !== null && smsConnected && (
                                <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-200">
                                    เครดิต: {smsCredit.toLocaleString()}
                                </span>
                            )}
                            {smsConnected ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                    <CheckCircle className="w-4 h-4" /> เชื่อมต่อแล้ว
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                                    <XCircle className="w-4 h-4" /> ยังไม่เชื่อมต่อ
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        {/* Setup Guide */}
                        <div className="border border-orange-100 bg-orange-50 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setShowSmsGuide(!showSmsGuide)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-orange-100/50 transition-colors"
                            >
                                <div className="flex items-center gap-2 text-orange-800 font-medium">
                                    <HelpCircle className="w-5 h-5" />
                                    วิธีเชื่อมต่อ ThaibulkSMS
                                </div>
                                {showSmsGuide ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-orange-600" />}
                            </button>

                            {showSmsGuide && (
                                <div className="p-4 pt-0 text-sm text-orange-900 space-y-3 border-t border-orange-100 bg-white/50">
                                    <ol className="list-decimal list-inside space-y-2 mt-3 ml-2">
                                        <li>ไปที่ <a href="https://portal.thaibulksms.com" target="_blank" rel="noreferrer" className="text-orange-600 underline font-medium inline-flex items-center">ThaibulkSMS Portal <ExternalLink className="w-3 h-3 ml-1" /></a> และสมัครสมาชิก/เข้าสู่ระบบ</li>
                                        <li>ไปที่เมนู <strong>ตั้งค่า</strong> {'>'} <strong>API Key</strong></li>
                                        <li>กด <strong>สร้าง API Key ใหม่</strong></li>
                                        <li>คัดลอก <strong>API Key</strong> และ <strong>API Secret</strong> มาวางด้านล่าง</li>
                                        <li>กำหนด Sender Name (ชื่อผู้ส่ง ไม่เกิน 11 ตัวอักษร)</li>
                                    </ol>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">API Key</label>
                                <Input
                                    type="password"
                                    value={smsConfig.apiKey}
                                    onChange={(e) => setSmsConfig({ ...smsConfig, apiKey: e.target.value })}
                                    placeholder="ใส่ API Key จาก ThaibulkSMS"
                                    className="font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">API Secret</label>
                                <Input
                                    type="password"
                                    value={smsConfig.apiSecret}
                                    onChange={(e) => setSmsConfig({ ...smsConfig, apiSecret: e.target.value })}
                                    placeholder="ใส่ API Secret จาก ThaibulkSMS"
                                    className="font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Sender Name (ชื่อผู้ส่ง)</label>
                                <Input
                                    type="text"
                                    value={smsConfig.sender}
                                    onChange={(e) => setSmsConfig({ ...smsConfig, sender: e.target.value })}
                                    placeholder="เช่น MyShop (ไม่เกิน 11 ตัวอักษร)"
                                    maxLength={11}
                                />
                                <p className="text-xs text-gray-500">ชื่อที่จะแสดงบนมือถือผู้รับ (ต้องลงทะเบียนกับ ThaibulkSMS)</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSaveSms} disabled={saving || !smsConfig.apiKey || !smsConfig.apiSecret}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                บันทึกการเชื่อมต่อ
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'facebook' && (
                <Card className="border-l-4 border-l-blue-600">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Facebook className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Facebook Messenger</CardTitle>
                                <p className="text-sm text-gray-500">ส่งข้อความหาลูกค้าผ่าน Messenger</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {fbConnected && fbConfig.pageName && (
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                                    {fbConfig.pageName}
                                </span>
                            )}
                            {fbConnected ? (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                    <CheckCircle className="w-4 h-4" /> เชื่อมต่อแล้ว
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                                    <XCircle className="w-4 h-4" /> ยังไม่เชื่อมต่อ
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        {/* Setup Guide */}
                        <div className="border border-blue-100 bg-blue-50 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setShowFbGuide(!showFbGuide)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-100/50 transition-colors"
                            >
                                <div className="flex items-center gap-2 text-blue-800 font-medium">
                                    <HelpCircle className="w-5 h-5" />
                                    วิธีเชื่อมต่อ Facebook Messenger
                                </div>
                                {showFbGuide ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-blue-600" />}
                            </button>

                            {showFbGuide && (
                                <div className="p-4 pt-0 text-sm text-blue-900 space-y-4 border-t border-blue-100 bg-white/50">
                                    <div>
                                        <h4 className="font-bold mb-2">ขั้นตอนที่ 1: สร้าง Facebook App</h4>
                                        <ol className="list-decimal list-inside space-y-1 ml-2">
                                            <li>ไปที่ <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium inline-flex items-center">Facebook Developers <ExternalLink className="w-3 h-3 ml-1" /></a></li>
                                            <li>กด <strong>My Apps</strong> {'>'} <strong>Create App</strong></li>
                                            <li>เลือก <strong>Business</strong> {'>'} <strong>Next</strong></li>
                                            <li>ตั้งชื่อ App (เช่น "AutoCRM Bot") {'>'} <strong>Create App</strong></li>
                                        </ol>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2">ขั้นตอนที่ 2: เพิ่ม Messenger Product</h4>
                                        <ol className="list-decimal list-inside space-y-1 ml-2">
                                            <li>ในหน้า App Dashboard กด <strong>Add Product</strong></li>
                                            <li>เลือก <strong>Messenger</strong> {'>'} <strong>Set Up</strong></li>
                                            <li>ไปที่ <strong>Access Tokens</strong> section</li>
                                            <li>กด <strong>Add or Remove Pages</strong> {'>'} เลือกเพจธุรกิจของคุณ</li>
                                            <li>กด <strong>Generate Token</strong> {'>'} คัดลอก Token มาวางด้านล่าง</li>
                                        </ol>
                                    </div>
                                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                        <p className="text-yellow-800 text-xs">
                                            <strong>ข้อจำกัด:</strong> Facebook มี 24-Hour Window - สามารถส่งข้อความหาลูกค้าได้เฉพาะเมื่อลูกค้าทักมาภายใน 24 ชม. ที่ผ่านมา
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Page Access Token</label>
                            <Input
                                type="password"
                                value={fbConfig.accessToken}
                                onChange={(e) => setFbConfig({ ...fbConfig, accessToken: e.target.value })}
                                placeholder="ใส่ Page Access Token จาก Facebook"
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSaveFb} disabled={saving || !fbConfig.accessToken}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                บันทึกการเชื่อมต่อ
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
