import React, { useState, useEffect } from 'react';
import { ServiceFlowConfig, MessageTemplate, DEFAULT_SERVICE_FLOW_CONFIG, FlowPreviewNode } from '../../types';
import { messageTemplateService } from '../../services/messageTemplateService';
import { TimelinePreview, generateFlowPreviewNodes } from './TimelinePreview';
import { Switch, Button, Input } from '../ui';
import { Zap, Settings, ChevronDown, ChevronUp, Sparkles, Plus, Trash2 } from 'lucide-react';
import { ServiceFlowAction } from '../../types';

interface ServiceFlowBuilderProps {
    lifecycleMonths: number;
    serviceIntervalMonths: number;
    config: ServiceFlowConfig;
    onConfigChange: (config: ServiceFlowConfig) => void;
    onLifecycleChange: (months: number) => void;
    onIntervalChange: (months: number) => void;
}

export const ServiceFlowBuilder: React.FC<ServiceFlowBuilderProps> = ({
    lifecycleMonths,
    serviceIntervalMonths,
    config,
    onConfigChange,
    onLifecycleChange,
    onIntervalChange
}) => {
    const [templates, setTemplates] = useState<MessageTemplate[]>([]);
    const [expandedPhase, setExpandedPhase] = useState<string | null>('onboarding');
    const [previewNodes, setPreviewNodes] = useState<FlowPreviewNode[]>([]);

    useEffect(() => {
        loadTemplates();
    }, []);

    useEffect(() => {
        const nodes = generateFlowPreviewNodes(lifecycleMonths, serviceIntervalMonths, config);
        setPreviewNodes(nodes);
    }, [lifecycleMonths, serviceIntervalMonths, config]);

    const loadTemplates = async () => {
        try {
            const data = await messageTemplateService.getTemplates();
            setTemplates(data);
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    };

    const updatePhaseConfig = (phase: 'onboarding' | 'retention' | 'maturity', updates: Partial<ServiceFlowConfig[typeof phase]>) => {
        onConfigChange({
            ...config,
            [phase]: { ...config[phase], ...updates }
        });
    };

    const togglePhase = (phase: string) => {
        setExpandedPhase(expandedPhase === phase ? null : phase);
    };

    const getTemplatesByType = (type: string) => {
        return templates.filter(t => t.type === type);
    };

    // --- Retention Action Helpers ---
    const addRetentionAction = () => {
        const newAction: ServiceFlowAction = {
            id: `action_${Date.now()}`,
            days_offset: 7,
            offset_type: 'before',
            task_name: 'เตือนบริการ',
            message_template_id: null
        };
        const currentActions = config.retention.actions || [];
        updatePhaseConfig('retention', { actions: [...currentActions, newAction] });
    };

    const removeRetentionAction = (actionId: string) => {
        const currentActions = config.retention.actions || [];
        updatePhaseConfig('retention', { actions: currentActions.filter(a => a.id !== actionId) });
    };

    const updateRetentionAction = (actionId: string, updates: Partial<ServiceFlowAction>) => {
        const currentActions = config.retention.actions || [];
        const newActions = currentActions.map(a =>
            a.id === actionId ? { ...a, ...updates } : a
        );
        updatePhaseConfig('retention', { actions: newActions });
    };

    return (
        <div className="space-y-6">
            {/* Time Configuration */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    ตั้งค่าระยะเวลา
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ระยะเวลาดูแล/รับประกัน
                        </label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                min={0}
                                value={lifecycleMonths}
                                onChange={(e) => onLifecycleChange(parseInt(e.target.value) || 0)}
                                className="w-24"
                            />
                            <span className="text-sm text-gray-500">เดือน</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            รอบบริการ
                        </label>
                        <div className="flex items-center gap-2">
                            <select
                                value={serviceIntervalMonths}
                                onChange={(e) => onIntervalChange(parseInt(e.target.value))}
                                className="px-3 py-2 border rounded-lg"
                            >
                                <option value={1}>ทุก 1 เดือน</option>
                                <option value={3}>ทุก 3 เดือน</option>
                                <option value={6}>ทุก 6 เดือน</option>
                                <option value={12}>ทุก 1 ปี</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phase Configurations */}
            <div className="space-y-3">
                {/* Phase 1: Onboarding */}
                <div className="border rounded-xl overflow-hidden">
                    <div
                        className="flex items-center justify-between p-4 bg-green-50 cursor-pointer"
                        onClick={() => togglePhase('onboarding')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                                1
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Onboarding</h4>
                                <p className="text-xs text-gray-500">เริ่มต้นหลังการขาย (Day 0)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={config.onboarding.enabled}
                                onCheckedChange={(checked) => updatePhaseConfig('onboarding', { enabled: checked })}
                                onClick={(e) => e.stopPropagation()}
                            />
                            {expandedPhase === 'onboarding' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                    </div>
                    {expandedPhase === 'onboarding' && config.onboarding.enabled && (
                        <div className="p-4 space-y-4 bg-white">
                            <div>
                                <label className="block text-sm font-medium mb-1">ชื่อ Task</label>
                                <Input
                                    value={config.onboarding.task_name}
                                    onChange={(e) => updatePhaseConfig('onboarding', { task_name: e.target.value })}
                                    placeholder="เช่น ติดตั้งสินค้า"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Template ข้อความ</label>
                                <select
                                    value={config.onboarding.message_template_id || ''}
                                    onChange={(e) => updatePhaseConfig('onboarding', { message_template_id: e.target.value || null })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="">-- เลือก Template --</option>
                                    {getTemplatesByType('onboarding').map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Phase 2: Retention */}
                <div className="border rounded-xl overflow-hidden">
                    <div
                        className="flex items-center justify-between p-4 bg-blue-50 cursor-pointer"
                        onClick={() => togglePhase('retention')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                                2
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Retention Loop</h4>
                                <p className="text-xs text-gray-500">เตือนบริการตามรอบ</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={config.retention.enabled}
                                onCheckedChange={(checked) => updatePhaseConfig('retention', { enabled: checked })}
                                onClick={(e) => e.stopPropagation()}
                            />
                            {expandedPhase === 'retention' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                    </div>
                    {expandedPhase === 'retention' && config.retention.enabled && (
                        <div className="p-4 space-y-4 bg-white">
                            <div className="space-y-3">
                                {(config.retention.actions || []).map((action, index) => (
                                    <div key={action.id} className="p-4 border border-blue-100 rounded-xl bg-blue-50/30 relative group">
                                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => removeRetentionAction(action.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>

                                        <h5 className="text-xs font-bold text-blue-600 mb-3 uppercase tracking-wider flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">
                                                {index + 1}
                                            </div>
                                            Task ที่ {index + 1}
                                        </h5>

                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium mb-1">ระยะเวลา</label>
                                                    <select
                                                        className="w-full px-2 py-1.5 text-sm border rounded-lg mb-1"
                                                        value={action.offset_type}
                                                        onChange={(e) => updateRetentionAction(action.id, { offset_type: e.target.value as 'before' | 'after' })}
                                                    >
                                                        <option value="before">ก่อนถึงรอบ</option>
                                                        <option value="after">หลังถึงรอบ</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium mb-1">จำนวนวัน</label>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            className="h-9"
                                                            value={action.days_offset}
                                                            onChange={(e) => updateRetentionAction(action.id, { days_offset: parseInt(e.target.value) || 0 })}
                                                        />
                                                        <span className="text-sm text-gray-500">วัน</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium mb-1">ชื่อ Task</label>
                                                <Input
                                                    className="h-9 bg-white"
                                                    value={action.task_name}
                                                    onChange={(e) => updateRetentionAction(action.id, { task_name: e.target.value })}
                                                    placeholder="ชื่อกิจกรรม"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium mb-1">Template ข้อความ</label>
                                                <select
                                                    value={action.message_template_id || ''}
                                                    onChange={(e) => updateRetentionAction(action.id, { message_template_id: e.target.value || null })}
                                                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                                                >
                                                    <option value="">-- ไม่ส่งข้อความ --</option>
                                                    {getTemplatesByType('retention').map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                                onClick={addRetentionAction}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                เพิ่ม Task การแจ้งเตือน
                            </Button>
                        </div>
                    )}
                </div>

                {/* Phase 3: Maturity */}
                <div className="border rounded-xl overflow-hidden">
                    <div
                        className="flex items-center justify-between p-4 bg-purple-50 cursor-pointer"
                        onClick={() => togglePhase('maturity')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                                3
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Maturity / Renewal</h4>
                                <p className="text-xs text-gray-500">สิ้นสุดประกัน</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={config.maturity.enabled}
                                onCheckedChange={(checked) => updatePhaseConfig('maturity', { enabled: checked })}
                                onClick={(e) => e.stopPropagation()}
                            />
                            {expandedPhase === 'maturity' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                    </div>
                    {expandedPhase === 'maturity' && config.maturity.enabled && (
                        <div className="p-4 space-y-4 bg-white">
                            <div>
                                <label className="block text-sm font-medium mb-1">ชื่อ Task</label>
                                <Input
                                    value={config.maturity.task_name}
                                    onChange={(e) => updatePhaseConfig('maturity', { task_name: e.target.value })}
                                    placeholder="เช่น โทรเสนอต่อ MA"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Template ข้อความ</label>
                                <select
                                    value={config.maturity.message_template_id || ''}
                                    onChange={(e) => updatePhaseConfig('maturity', { message_template_id: e.target.value || null })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="">-- เลือก Template --</option>
                                    {getTemplatesByType('maturity').map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Timeline Preview */}
            <div className="border rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Preview Timeline
                </h3>
                <TimelinePreview
                    nodes={previewNodes}
                    onNodeClick={(node) => {
                        // Open phase editor for clicked node
                        setExpandedPhase(node.phase);
                    }}
                />
            </div>
        </div>
    );
};
