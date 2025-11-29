import React, { useState, useEffect } from 'react';
import { Customer, Transaction } from '../types';
import { transactionService } from '../services/transactionService';
import { generateMarketingMessage } from '../services/geminiService';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from './ui';
import { Sparkles, Send, History, User } from 'lucide-react';
import { useLanguage } from '../src/contexts/LanguageContext';

interface CustomerDetailProps {
    customer: Customer;
}

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer }) => {
    const { t } = useLanguage();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [aiMessage, setAiMessage] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const data = await transactionService.getTransactionsByCustomerId(customer.id);
                setTransactions(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadTransactions();
    }, [customer.id]);

    const handleGenerateMessage = async () => {
        setGenerating(true);
        try {
            const lastPurchase = customer.last_purchase_date
                ? new Date(customer.last_purchase_date).toLocaleDateString('th-TH')
                : t('never');
            const msg = await generateMarketingMessage(customer.first_name, customer.segmentation_status || 'New', lastPurchase);
            setAiMessage(msg);
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" /> {t('customerProfile')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">{t('name')}:</span>
                            <span className="font-medium">{customer.first_name} {customer.last_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">{t('emailLabel')}:</span>
                            <span className="font-medium">{customer.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">{t('phoneLabel')}:</span>
                            <span className="font-medium">{customer.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">{t('segmentLabel')}</span>
                            <Badge variant="outline">{customer.segmentation_status || 'N/A'}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">{t('totalSpendLabel')}</span>
                            <span className="font-bold text-primary">฿{customer.total_spend?.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-900">
                            <Sparkles className="w-5 h-5 text-purple-600" /> {t('aiMarketingAssistant')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            {t('aiMarketingDesc').replace('{name}', customer.first_name)}
                        </p>

                        {!aiMessage ? (
                            <Button
                                onClick={handleGenerateMessage}
                                disabled={generating}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {generating ? t('generating') : t('generateMessage')}
                            </Button>
                        ) : (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                                <div className="p-3 bg-white rounded-lg border border-purple-200 shadow-sm text-sm text-gray-800 relative">
                                    {aiMessage}
                                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-b border-r border-purple-200 transform rotate-45"></div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" className="flex-1 gap-2" onClick={() => alert(t('sentMock'))}>
                                        <Send className="w-4 h-4" /> {t('sendSms')}
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setAiMessage('')}>
                                        {t('regenerate')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" /> {t('transactionHistory')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4">{t('loadingHistory')}</div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">{t('noTransactionsFound')}</div>
                    ) : (
                        <div className="space-y-4">
                            {transactions.map(t => (
                                <div key={t.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div>
                                        <div className="font-medium">
                                            {new Date(t.transaction_date).toLocaleDateString('th-TH', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {t.items?.length || 0} {t('itemsCount')}
                                        </div>
                                    </div>
                                    <div className="font-bold text-gray-900">
                                        ฿{t.total_amount.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
