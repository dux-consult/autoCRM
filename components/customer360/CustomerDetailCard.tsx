import React, { useState, useEffect, useCallback } from 'react';
import { Customer } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../ui';
import { User, Edit2, Check, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';

interface CustomerDetailCardProps {
    customer: Customer;
    onUpdate: (updates: Partial<Customer>) => void;
}

export const CustomerDetailCard: React.FC<CustomerDetailCardProps> = ({ customer, onUpdate }) => {
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        phone: customer.phone || '',
        date_of_birth: customer.date_of_birth || '',
        tax_id: customer.tax_id || '',
        address: customer.address || { line1: '', city: '', zip: '' }
    });

    // Debounced auto-save
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleChange = (field: string, value: string) => {
        const newFormData = { ...formData, [field]: value };
        setFormData(newFormData);

        // Auto-save with debounce
        if (saveTimeout) clearTimeout(saveTimeout);
        setSaveTimeout(setTimeout(() => {
            onUpdate({ [field]: value });
        }, 1000));
    };

    const handleAddressChange = (field: string, value: string) => {
        const newAddress = { ...formData.address, [field]: value };
        setFormData({ ...formData, address: newAddress });

        // Auto-save with debounce
        if (saveTimeout) clearTimeout(saveTimeout);
        setSaveTimeout(setTimeout(() => {
            onUpdate({ address: newAddress });
        }, 1000));
    };

    useEffect(() => {
        return () => {
            if (saveTimeout) clearTimeout(saveTimeout);
        };
    }, [saveTimeout]);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {t('customerDetails') || 'ข้อมูลลูกค้า'}
                    </span>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-400'
                            }`}
                    >
                        {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    </button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Phone */}
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{t('phoneLabel') || 'เบอร์โทร'}</span>
                    {isEditing ? (
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="text-right px-2 py-1 border rounded w-36 text-sm"
                        />
                    ) : (
                        <span className="font-medium">{customer.phone || '-'}</span>
                    )}
                </div>

                {/* Birthday */}
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{t('birthday') || 'วันเกิด'}</span>
                    {isEditing ? (
                        <input
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) => handleChange('date_of_birth', e.target.value)}
                            className="text-right px-2 py-1 border rounded text-sm"
                        />
                    ) : (
                        <span className="font-medium">{formatDate(customer.date_of_birth)}</span>
                    )}
                </div>

                {/* Tax ID */}
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{t('taxId') || 'เลขประจำตัวผู้เสียภาษี'}</span>
                    {isEditing ? (
                        <input
                            type="text"
                            value={formData.tax_id}
                            onChange={(e) => handleChange('tax_id', e.target.value)}
                            className="text-right px-2 py-1 border rounded w-36 text-sm"
                            placeholder="xxxxxxxxxxxxx"
                        />
                    ) : (
                        <span className="font-medium font-mono">{customer.tax_id || '-'}</span>
                    )}
                </div>

                {/* Address */}
                <div className="pt-2 border-t">
                    <span className="text-sm text-gray-500 block mb-2">{t('shippingAddress') || 'ที่อยู่จัดส่ง'}</span>
                    {isEditing ? (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={formData.address.line1 || ''}
                                onChange={(e) => handleAddressChange('line1', e.target.value)}
                                className="w-full px-2 py-1 border rounded text-sm"
                                placeholder={t('addressLine1') || 'ที่อยู่'}
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formData.address.city || ''}
                                    onChange={(e) => handleAddressChange('city', e.target.value)}
                                    className="flex-1 px-2 py-1 border rounded text-sm"
                                    placeholder={t('city') || 'เมือง'}
                                />
                                <input
                                    type="text"
                                    value={formData.address.zip || ''}
                                    onChange={(e) => handleAddressChange('zip', e.target.value)}
                                    className="w-24 px-2 py-1 border rounded text-sm"
                                    placeholder={t('zipCode') || 'รหัสไปรษณีย์'}
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm">
                            {customer.address?.line1 || '-'}
                            {customer.address?.city && `, ${customer.address.city}`}
                            {customer.address?.zip && ` ${customer.address.zip}`}
                        </p>
                    )}
                </div>

                {/* Referral */}
                {customer.referral && (
                    <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-gray-500">{t('referredBy') || 'แนะนำโดย'}</span>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                // Navigate to referrer's profile - would need to implement
                                console.log('Navigate to referrer:', customer.referral_id);
                            }}
                            className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
                        >
                            {customer.referral.first_name} {customer.referral.last_name}
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
