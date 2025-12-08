import React, { useState } from 'react';
import { Customer } from '../../types';
import { Button, Badge, Card } from '../ui';
import { ArrowLeft, Phone, MessageSquare, Plus, User } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { QuickTaskModal } from './QuickTaskModal';

interface Customer360HeaderProps {
    customer: Customer;
    onBack: () => void;
    onCustomerUpdate: (updates: Partial<Customer>) => void;
}

export const Customer360Header: React.FC<Customer360HeaderProps> = ({
    customer,
    onBack,
    onCustomerUpdate
}) => {
    const { t } = useLanguage();
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showCallModal, setShowCallModal] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);

    const getStatusChip = () => {
        const segment = customer.segmentation_status?.toLowerCase() || '';
        if (segment.includes('champion') || segment.includes('loyal')) {
            return { label: 'Active', color: 'bg-green-100 text-green-800' };
        } else if (segment.includes('risk') || segment.includes('attention')) {
            return { label: 'At-Risk', color: 'bg-yellow-100 text-yellow-800' };
        } else if (segment.includes('lost') || segment.includes('hibernating')) {
            return { label: 'Churn', color: 'bg-red-100 text-red-800' };
        }
        return { label: 'Active', color: 'bg-green-100 text-green-800' };
    };

    const getTierBadge = () => {
        const tier = customer.tier || 'Standard';
        const colors: Record<string, string> = {
            'Platinum': 'bg-gradient-to-r from-gray-600 to-gray-800 text-white',
            'Gold': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
            'Silver': 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800',
            'Standard': 'bg-gray-100 text-gray-600'
        };
        return colors[tier] || colors['Standard'];
    };

    const status = getStatusChip();

    const handleCall = () => {
        if (customer.phone) {
            // On mobile, try to open phone dialer
            if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
                window.location.href = `tel:${customer.phone}`;
            } else {
                setShowCallModal(true);
            }
        }
    };

    const handleChat = () => {
        // Mock LINE OA chat - would open LINE chat in real implementation
        setShowChatModal(true);
    };

    return (
        <>
            <Card className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left: Back + Avatar + Name */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Avatar */}
                        <div className="relative">
                            {customer.avatar_url ? (
                                <img
                                    src={customer.avatar_url}
                                    alt={customer.first_name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                    {customer.first_name?.[0]}{customer.last_name?.[0]}
                                </div>
                            )}
                            {/* Status indicator dot */}
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${status.label === 'Active' ? 'bg-green-500' :
                                    status.label === 'At-Risk' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}></div>
                        </div>

                        {/* Name + Tier + Status */}
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-bold text-gray-900">
                                    {customer.first_name} {customer.last_name}
                                    {customer.nickname && <span className="text-gray-500 font-normal"> ({customer.nickname})</span>}
                                </h1>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTierBadge()}`}>
                                    {customer.tier || 'Standard'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                    {status.label}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {customer.segmentation_status || 'New Customer'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Actions */}
                    <div className="flex items-center gap-2 ml-auto md:ml-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCall}
                            className="gap-2"
                            disabled={!customer.phone}
                        >
                            <Phone className="w-4 h-4" />
                            {t('call') || 'โทร'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleChat}
                            className="gap-2"
                            disabled={!customer.line_user_id}
                        >
                            <MessageSquare className="w-4 h-4" />
                            {t('chat') || 'แชท'}
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setShowTaskModal(true)}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            {t('addTask') || 'เพิ่ม Task'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Call Modal (Mock) */}
            {showCallModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCallModal(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{t('callCustomer') || 'โทรหาลูกค้า'}</h3>
                            <p className="text-2xl font-mono mb-4">{customer.phone}</p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowCallModal(false)}
                                >
                                    {t('cancel') || 'ยกเลิก'}
                                </Button>
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => {
                                        window.location.href = `tel:${customer.phone}`;
                                        setShowCallModal(false);
                                    }}
                                >
                                    {t('callNow') || 'โทรเลย'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Modal (Mock LINE OA) */}
            {showChatModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowChatModal(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{t('lineOaChat') || 'LINE OA Chat'}</h3>
                            <p className="text-gray-500 mb-4">
                                {customer.line_user_id
                                    ? `LINE ID: ${customer.line_user_id}`
                                    : (t('noLineConnected') || 'ยังไม่ได้เชื่อมต่อ LINE')}
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setShowChatModal(false)}
                            >
                                {t('close') || 'ปิด'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Task Modal */}
            {showTaskModal && (
                <QuickTaskModal
                    customerId={customer.id}
                    customerName={`${customer.first_name} ${customer.last_name}`}
                    onClose={() => setShowTaskModal(false)}
                />
            )}
        </>
    );
};
