import React, { useState } from 'react';
import { Customer } from '../types';
import { customerService } from '../services/customerService';
import { Button, Input } from './ui';
import { useLanguage } from '../src/contexts/LanguageContext';

interface CustomerFormProps {
    initialData?: Customer;
    onSuccess: () => void;
    onCancel: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ initialData, onSuccess, onCancel }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<Customer>>({
        first_name: initialData?.first_name || '',
        last_name: initialData?.last_name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        date_of_birth: initialData?.date_of_birth || '',
        gender: initialData?.gender || '',
        interests: initialData?.interests || [],
        line_user_id: initialData?.line_user_id || '',
        facebook_psid: initialData?.facebook_psid || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (initialData?.id) {
                await customerService.updateCustomer(initialData.id, formData);
            } else {
                await customerService.createCustomer(formData);
            }
            onSuccess();
        } catch (err) {
            console.error(err);
            setError(t('failedToSaveCustomer'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('firstNameLabel')}</label>
                    <Input
                        required
                        value={formData.first_name}
                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('lastNameLabel')}</label>
                    <Input
                        value={formData.last_name}
                        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('emailLabel')}</label>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('phoneLabel')}</label>
                    <Input
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('dobLabel')}</label>
                    <Input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('genderLabel')}</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    >
                        <option value="">{t('selectGender')}</option>
                        <option value="Male">{t('male')}</option>
                        <option value="Female">{t('female')}</option>
                        <option value="Other">{t('other')}</option>
                    </select>
                </div>
            </div>

            {/* ช่องทางติดต่อ Automation */}
            <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">ช่องทางติดต่อ (สำหรับ Automation)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <span className="text-green-600">●</span> LINE User ID
                        </label>
                        <Input
                            value={formData.line_user_id}
                            onChange={e => setFormData({ ...formData, line_user_id: e.target.value })}
                            placeholder="U1234567890abcdef..."
                            className="font-mono text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <span className="text-blue-600">●</span> Facebook PSID
                        </label>
                        <Input
                            value={formData.facebook_psid}
                            onChange={e => setFormData({ ...formData, facebook_psid: e.target.value })}
                            placeholder="1234567890123456"
                            className="font-mono text-sm"
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    * LINE User ID และ Facebook PSID จะได้มาอัตโนมัติเมื่อลูกค้าทักมาหาเพจ/บอท
                </p>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>{t('cancel')}</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? t('saving') : (initialData ? t('update') : t('create'))}
                </Button>
            </div>
        </form>
    );
};
