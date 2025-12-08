import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../ui';
import { Sparkles, Gift, MessageSquare, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { generateMarketingMessage } from '../../services/geminiService';

interface AINextBestActionProps {
    customer: Customer;
}

interface Suggestion {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    action: string;
    type: 'birthday' | 'service' | 'upsell' | 'retention';
}

export const AINextBestAction: React.FC<AINextBestActionProps> = ({ customer }) => {
    const { t } = useLanguage();
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [generatedMessage, setGeneratedMessage] = useState('');
    const [generating, setGenerating] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);

    useEffect(() => {
        generateSuggestions();
    }, [customer]);

    const generateSuggestions = () => {
        const newSuggestions: Suggestion[] = [];

        // Birthday suggestion
        if (customer.date_of_birth) {
            const birthday = new Date(customer.date_of_birth);
            const today = new Date();
            const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
            const diffDays = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays > 0 && diffDays <= 7) {
                newSuggestions.push({
                    id: 'birthday',
                    icon: <Gift className="w-5 h-5 text-pink-500" />,
                    title: `วันเกิดใกล้ถึงแล้ว (อีก ${diffDays} วัน)`,
                    description: 'ส่งคูปองวันเกิดให้ลูกค้าไหม?',
                    action: 'ส่งคูปอง HBD',
                    type: 'birthday'
                });
            }
        }

        // At-risk suggestion
        const segment = customer.segmentation_status?.toLowerCase() || '';
        if (segment.includes('risk') || segment.includes('attention')) {
            newSuggestions.push({
                id: 'retention',
                icon: <RefreshCw className="w-5 h-5 text-yellow-500" />,
                title: 'ลูกค้าเสี่ยงจะหายไป',
                description: 'ไม่ซื้อมานานแล้ว ลองติดต่อกลับ?',
                action: 'ส่งข้อความ',
                type: 'retention'
            });
        }

        // Upsell suggestion
        if (customer.total_transactions >= 3) {
            newSuggestions.push({
                id: 'upsell',
                icon: <Sparkles className="w-5 h-5 text-purple-500" />,
                title: 'โอกาส Upsell',
                description: 'ลูกค้าซื้อบ่อย อาจสนใจสินค้าพรีเมียม',
                action: 'แนะนำสินค้า',
                type: 'upsell'
            });
        }

        // Default suggestion if no specific ones
        if (newSuggestions.length === 0) {
            newSuggestions.push({
                id: 'default',
                icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
                title: 'ทักทายลูกค้า',
                description: 'สร้างความสัมพันธ์ด้วยข้อความที่เป็นกันเอง',
                action: 'สร้างข้อความ',
                type: 'retention'
            });
        }

        setSuggestions(newSuggestions);
    };

    const handleGenerateMessage = async (suggestion: Suggestion) => {
        setSelectedSuggestion(suggestion);
        setShowMessageModal(true);
        setGenerating(true);

        try {
            let contextPrompt = '';
            switch (suggestion.type) {
                case 'birthday':
                    contextPrompt = 'วันเกิด ส่งคูปองส่วนลดพิเศษ';
                    break;
                case 'retention':
                    contextPrompt = 'ติดตาม ให้กลับมาซื้อ ข้อเสนอพิเศษ';
                    break;
                case 'upsell':
                    contextPrompt = 'แนะนำสินค้าพรีเมียม เพิ่มยอด';
                    break;
                default:
                    contextPrompt = 'ทักทาย สร้างความสัมพันธ์';
            }

            const message = await generateMarketingMessage(
                customer.first_name,
                contextPrompt,
                customer.last_purchase_date
                    ? new Date(customer.last_purchase_date).toLocaleDateString('th-TH')
                    : 'ไม่ทราบ'
            );
            setGeneratedMessage(message);
        } catch (error) {
            console.error('Error generating message:', error);
            setGeneratedMessage('ไม่สามารถสร้างข้อความได้ กรุณาลองใหม่');
        } finally {
            setGenerating(false);
        }
    };

    const handleSendMessage = () => {
        // Mock send - would integrate with LINE/SMS in real implementation
        alert(t('messageSent') || 'ส่งข้อความแล้ว! (Mock)');
        setShowMessageModal(false);
        setGeneratedMessage('');
        setSelectedSuggestion(null);
    };

    return (
        <>
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50/50">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        {t('aiSuggestion') || 'AI แนะนำ'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.id}
                            className="p-3 bg-white rounded-lg border border-purple-100 shadow-sm"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    {suggestion.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{suggestion.description}</p>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="mt-2 gap-1 text-xs"
                                        onClick={() => handleGenerateMessage(suggestion)}
                                    >
                                        <MessageSquare className="w-3 h-3" />
                                        {suggestion.action}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Message Modal */}
            {showMessageModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowMessageModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                {t('generateMessage') || 'สร้างข้อความ AI'}
                            </h3>
                            <p className="text-purple-100 text-sm">{selectedSuggestion?.title}</p>
                        </div>

                        <div className="p-4">
                            {generating ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                                    <span className="ml-3 text-gray-500">{t('generating') || 'กำลังสร้าง...'}</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <textarea
                                        value={generatedMessage}
                                        onChange={(e) => setGeneratedMessage(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
                                        rows={5}
                                        placeholder="ข้อความจะแสดงที่นี่..."
                                    />

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => handleGenerateMessage(selectedSuggestion!)}
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            {t('regenerate') || 'สร้างใหม่'}
                                        </Button>
                                        <Button
                                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                                            onClick={handleSendMessage}
                                            disabled={!generatedMessage}
                                        >
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            {t('sendMessage') || 'ส่งข้อความ'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
