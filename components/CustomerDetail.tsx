import React, { useState, useEffect } from 'react';
import { Customer, Transaction } from '../types';
import { transactionService } from '../services/transactionService';
import { generateMarketingMessage } from '../services/geminiService';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from './ui';
import { Sparkles, Send, History, User } from 'lucide-react';

interface CustomerDetailProps {
    customer: Customer;
}

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer }) => {
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
                : 'Never';
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
                            <User className="w-5 h-5" /> Customer Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Name:</span>
                            <span className="font-medium">{customer.first_name} {customer.last_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Email:</span>
                            <span className="font-medium">{customer.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Phone:</span>
                            <span className="font-medium">{customer.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Segment:</span>
                            <Badge variant="outline">{customer.segmentation_status || 'N/A'}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Total Spend:</span>
                            <span className="font-bold text-primary">฿{customer.total_spend?.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-900">
                            <Sparkles className="w-5 h-5 text-purple-600" /> AI Marketing Assistant
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Generate a personalized marketing message for {customer.first_name} based on their purchase history and segment.
                        </p>

                        {!aiMessage ? (
                            <Button
                                onClick={handleGenerateMessage}
                                disabled={generating}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {generating ? 'Generating...' : 'Generate Message'}
                            </Button>
                        ) : (
                            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                                <div className="p-3 bg-white rounded-lg border border-purple-200 shadow-sm text-sm text-gray-800 relative">
                                    {aiMessage}
                                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-b border-r border-purple-200 transform rotate-45"></div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" className="flex-1 gap-2" onClick={() => alert('Sent (Mock)!')}>
                                        <Send className="w-4 h-4" /> Send SMS
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setAiMessage('')}>
                                        Regenerate
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
                        <History className="w-5 h-5" /> Transaction History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4">Loading history...</div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">No transactions found.</div>
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
                                            {t.items?.length || 0} items
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
