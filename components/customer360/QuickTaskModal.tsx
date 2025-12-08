import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../ui';
import { X, Calendar } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { taskService } from '../../services/taskService';

interface QuickTaskModalProps {
    customerId: string;
    customerName: string;
    onClose: () => void;
}

export const QuickTaskModal: React.FC<QuickTaskModalProps> = ({
    customerId,
    customerName,
    onClose
}) => {
    const { t } = useLanguage();
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'Call' | 'SMS' | 'LINE'>('Call');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setSaving(true);
        try {
            await taskService.createTask({
                title,
                type,
                status: 'Pending',
                due_date: new Date(dueDate).toISOString(),
                customer_id: customerId
            });
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-bold text-lg">{t('quickTask') || 'สร้าง Task ด่วน'}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            {t('customer') || 'ลูกค้า'}
                        </label>
                        <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-600">
                            {customerName}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            {t('taskTitle') || 'หัวข้อ'} *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('taskTitlePlaceholder') || 'เช่น โทรติดตามลูกค้า'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            {t('taskType') || 'ประเภท'}
                        </label>
                        <div className="flex gap-2">
                            {(['Call', 'SMS', 'LINE'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`flex-1 py-2 rounded-lg border transition-colors ${type === t
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            {t('dueDate') || 'วันครบกำหนด'}
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            {t('cancel') || 'ยกเลิก'}
                        </Button>
                        <Button type="submit" className="flex-1" disabled={saving || !title.trim()}>
                            {saving ? (t('saving') || 'กำลังบันทึก...') : (t('createTask') || 'สร้าง Task')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
