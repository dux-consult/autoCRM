import React, { useState, useEffect } from 'react';
import { messageTemplateService } from '../services/messageTemplateService';
import { MessageTemplate, MessageTemplateType, MessageChannel } from '../types';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogHeader, DialogTitle } from './ui';
import { Plus, Edit, Trash2, Save, X, MessageSquare, Zap, Clock, Gift, Info } from 'lucide-react';

export const MessageTemplateList = () => {
    const [templates, setTemplates] = useState<MessageTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Partial<MessageTemplate>>({});

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const data = await messageTemplateService.getTemplates();
            setTemplates(data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingTemplate({
            name: '',
            content: '',
            type: 'onboarding',
            channel: 'line',
            variables: ['customer_name', 'product_name'],
            is_default: false
        });
        setIsModalOpen(true);
    };

    const handleEdit = (template: MessageTemplate) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('คุณต้องการลบ Template นี้ใช่หรือไม่?')) return;
        try {
            await messageTemplateService.deleteTemplate(id);
            fetchTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('ไม่สามารถลบ Template ได้');
        }
    };

    const handleSave = async () => {
        try {
            if (editingTemplate.id) {
                await messageTemplateService.updateTemplate(editingTemplate.id, editingTemplate);
            } else {
                await messageTemplateService.createTemplate(editingTemplate);
            }
            setIsModalOpen(false);
            fetchTemplates();
        } catch (error) {
            console.error('Error saving template:', error);
            alert('บันทึกไม่สำเร็จ');
        }
    };

    const getTypeIcon = (type?: string) => {
        switch (type) {
            case 'onboarding': return <Zap className="w-4 h-4 text-green-500" />;
            case 'retention': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'maturity': return <Gift className="w-4 h-4 text-purple-500" />;
            default: return <MessageSquare className="w-4 h-4" />;
        }
    };

    const insertVariable = (variable: string) => {
        setEditingTemplate(prev => ({
            ...prev,
            content: (prev.content || '') + ` {{${variable}}} `
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                        Template ข้อความ
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">จัดการข้อความตอบกลับอัตโนมัติสำหรับแต่ละสถานการณ์</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4 mr-2" />
                    สร้าง Template
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(template => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow relative group">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-lg bg-gray-50`}>
                                        {getTypeIcon(template.type)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                                        <p className="text-xs text-gray-500 capitalize">{template.type} • {template.channel}</p>
                                    </div>
                                </div>
                                {template.is_default && (
                                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                        Default
                                    </span>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 min-h-[80px] line-clamp-3 mb-4">
                                {template.content}
                            </div>
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                                    <Edit className="w-4 h-4 text-gray-500" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(template.id)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTemplate.id ? 'แก้ไข Template' : 'สร้าง Template ใหม่'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex gap-6 mt-4">
                        {/* Left: Settings */}
                        <div className="w-1/2 space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">ชื่อ Template</label>
                                <Input
                                    value={editingTemplate.name}
                                    onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                                    placeholder="เช่น แจ้งเตือนเช็คระยะ 6 เดือน"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">ประเภท (Phase)</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg bg-white"
                                    value={editingTemplate.type}
                                    onChange={e => setEditingTemplate({ ...editingTemplate, type: e.target.value as MessageTemplateType })}
                                >
                                    <option value="onboarding">Onboarding (เริ่มใช้งาน)</option>
                                    <option value="retention">Retention (บำรุงรักษา)</option>
                                    <option value="maturity">Maturity (ต่ออายุ/หมดอายุ)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">ช่องทางส่ง</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingTemplate({ ...editingTemplate, channel: 'line' })}
                                        className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${editingTemplate.channel === 'line'
                                                ? 'bg-green-50 border-green-500 text-green-700'
                                                : 'border-gray-200 text-gray-600'
                                            }`}
                                    >
                                        LINE OA
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingTemplate({ ...editingTemplate, channel: 'sms' })}
                                        className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${editingTemplate.channel === 'sms'
                                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                : 'border-gray-200 text-gray-600'
                                            }`}
                                    >
                                        SMS
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={editingTemplate.is_default || false}
                                    onChange={e => setEditingTemplate({ ...editingTemplate, is_default: e.target.checked })}
                                    className="rounded border-gray-300"
                                />
                                <label htmlFor="isDefault" className="text-sm text-gray-700">ตั้งเป็นค่าเริ่มต้นสำหรับประเภทนี้</label>
                            </div>
                        </div>

                        {/* Right: Content Editor */}
                        <div className="w-1/2 space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block flex justify-between">
                                    ข้อความ
                                    <span className="text-xs text-gray-400 font-normal">แชทบับเบิ้ล</span>
                                </label>
                                <textarea
                                    className="w-full h-40 p-3 border rounded-xl resize-none text-sm bg-gray-50 focus:bg-white transition-colors"
                                    placeholder="สวัสดีครับคุณ {{customer_name}}..."
                                    value={editingTemplate.content}
                                    onChange={e => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 mb-2 block flex items-center gap-1">
                                    <Info className="w-3 h-3" />
                                    คลิกเพื่อแทรกตัวแปร
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['customer_name', 'product_name', 'service_date', 'shop_contact'].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => insertVariable(v)}
                                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-600 transition-colors"
                                        >
                                            {`{{${v}}}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
                        <Button onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            บันทึก
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
