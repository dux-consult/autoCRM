import React, { useEffect, useState } from 'react';
import { Node } from '@xyflow/react';
import { X, Save, Sparkles, Loader2 } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface PropertiesPanelProps {
    selectedNode: Node | null;
    onClose: () => void;
    onUpdate: (id: string, data: any) => void;
}

export const PropertiesPanel = ({ selectedNode, onClose, onUpdate }: PropertiesPanelProps) => {
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');

    // Condition State
    const [conditionField, setConditionField] = useState('total_spend');
    const [conditionOperator, setConditionOperator] = useState('>');
    const [conditionValue, setConditionValue] = useState('');

    // Action State
    const [actionType, setActionType] = useState('email'); // email, task, line_message
    // Email
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    // LINE
    const [stickerPackageId, setStickerPackageId] = useState('');
    const [stickerId, setStickerId] = useState('');
    // Task
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('3'); // days

    // AI State
    const [isRewriting, setIsRewriting] = useState(false);
    const [rewriteTone, setRewriteTone] = useState('empathy'); // urgency, empathy, reward

    useEffect(() => {
        if (selectedNode) {
            setLabel(selectedNode.data.label as string || '');
            setDescription(selectedNode.data.description as string || '');

            // Load specific data
            if (selectedNode.type === 'condition') {
                setConditionField(selectedNode.data.conditionField as string || 'total_spend');
                setConditionOperator(selectedNode.data.conditionOperator as string || '>');
                setConditionValue(selectedNode.data.conditionValue as string || '');
            } else if (selectedNode.type === 'action') {
                setActionType(selectedNode.data.actionType as string || 'email');
                setEmailSubject(selectedNode.data.emailSubject as string || '');
                setEmailBody(selectedNode.data.emailBody as string || '');
                setStickerPackageId(selectedNode.data.stickerPackageId as string || '');
                setStickerId(selectedNode.data.stickerId as string || '');
                setTaskTitle(selectedNode.data.taskTitle as string || '');
                setTaskDueDate(selectedNode.data.taskDueDate as string || '3');
            }
        }
    }, [selectedNode]);

    const handleSave = () => {
        if (selectedNode) {
            const updates: any = {
                ...selectedNode.data,
                label,
                description,
            };

            if (selectedNode.type === 'condition') {
                updates.conditionField = conditionField;
                updates.conditionOperator = conditionOperator;
                updates.conditionValue = conditionValue;
                // Auto-update label for clarity
                updates.label = `${conditionField} ${conditionOperator} ${conditionValue}`;
            } else if (selectedNode.type === 'action') {
                updates.actionType = actionType;
                if (actionType === 'email') {
                    updates.emailSubject = emailSubject;
                    updates.emailBody = emailBody;
                    updates.label = `Email: ${emailSubject || 'Untitled'}`;
                } else if (actionType === 'line_message') {
                    updates.emailBody = emailBody; // Reusing emailBody
                    updates.stickerPackageId = stickerPackageId;
                    updates.stickerId = stickerId;
                    updates.label = `LINE: ${emailBody ? emailBody.substring(0, 20) + '...' : 'Untitled'}`;
                } else {
                    updates.taskTitle = taskTitle;
                    updates.taskDueDate = taskDueDate;
                    updates.label = `Task: ${taskTitle || 'Untitled'}`;
                }
            }

            onUpdate(selectedNode.id, updates);
        }
    };

    const handleRewrite = async (target: 'subject' | 'body') => {
        const textToRewrite = target === 'subject' ? emailSubject : emailBody;
        if (!textToRewrite.trim()) return;

        setIsRewriting(true);
        try {
            const rewrittenText = await aiService.rewriteContent(textToRewrite, rewriteTone);
            if (target === 'subject') {
                setEmailSubject(rewrittenText);
            } else {
                setEmailBody(rewrittenText);
            }
        } catch (error) {
            alert('Failed to rewrite content. Please check your API Key.');
        } finally {
            setIsRewriting(false);
        }
    };

    if (!selectedNode) {
        return (
            <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-full p-6 items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <div className="w-8 h-8 border-2 border-gray-300 rounded-lg"></div>
                </div>
                <h3 className="text-gray-900 font-medium mb-1">No Node Selected</h3>
                <p className="text-sm text-gray-500">Click on a node in the canvas to configure its properties.</p>
            </aside>
        );
    }

    return (
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shadow-xl z-10">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="font-semibold text-gray-900">Configuration</h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Node Type</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 capitalize">
                        {selectedNode.type}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Label</label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="e.g. Send Welcome Email"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                        placeholder="Describe what this step does..."
                    />
                </div>

                {/* Condition Settings */}
                {selectedNode.type === 'condition' && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900">Condition Rules</h4>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Field</label>
                            <select
                                value={conditionField}
                                onChange={(e) => setConditionField(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="total_spend">Total Spend</option>
                                <option value="total_transactions">Total Transactions</option>
                                <option value="last_purchase_days">Days Since Last Purchase</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500">Operator</label>
                                <select
                                    value={conditionOperator}
                                    onChange={(e) => setConditionOperator(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value=">">Greater than</option>
                                    <option value="<">Less than</option>
                                    <option value="=">Equals</option>
                                    <option value=">=">Greater or Equal</option>
                                    <option value="<=">Less or Equal</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500">Value</label>
                                <input
                                    type="number"
                                    value={conditionValue}
                                    onChange={(e) => setConditionValue(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Settings */}
                {selectedNode.type === 'action' && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900">Action Settings</h4>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Action Type</label>
                            <select
                                value={actionType}
                                onChange={(e) => setActionType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="email">Send Email</option>
                                <option value="line_message">Send LINE Message</option>
                                <option value="task">Create Task</option>
                            </select>
                        </div>

                        {(actionType === 'email' || actionType === 'line_message') && (
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-purple-800 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Psychology Writer
                                    </span>
                                    <select
                                        value={rewriteTone}
                                        onChange={(e) => setRewriteTone(e.target.value)}
                                        className="text-xs border-none bg-white/50 rounded px-2 py-1 focus:ring-0 text-purple-900"
                                    >
                                        <option value="urgency">Urgency (FOMO)</option>
                                        <option value="empathy">Empathy (Care)</option>
                                        <option value="reward">Reward (Benefit)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {actionType === 'email' && (
                            <>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-medium text-gray-500">Subject</label>
                                        <button
                                            onClick={() => handleRewrite('subject')}
                                            disabled={isRewriting || !emailSubject}
                                            className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 disabled:opacity-50"
                                        >
                                            {isRewriting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                            Rewrite
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={emailSubject}
                                        onChange={(e) => setEmailSubject(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="Welcome to our store!"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-medium text-gray-500">Body</label>
                                        <button
                                            onClick={() => handleRewrite('body')}
                                            disabled={isRewriting || !emailBody}
                                            className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 disabled:opacity-50"
                                        >
                                            {isRewriting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                            Rewrite
                                        </button>
                                    </div>
                                    <textarea
                                        value={emailBody}
                                        onChange={(e) => setEmailBody(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="Hi {{first_name}}, ..."
                                    />
                                    <p className="text-xs text-gray-400">Available variables: {'{{first_name}}'}, {'{{total_spend}}'}</p>
                                </div>
                            </>
                        )}

                        {actionType === 'line_message' && (
                            <>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-medium text-gray-500">Message Text</label>
                                        <button
                                            onClick={() => handleRewrite('body')}
                                            disabled={isRewriting || !emailBody}
                                            className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 disabled:opacity-50"
                                        >
                                            {isRewriting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                            Rewrite
                                        </button>
                                    </div>
                                    <textarea
                                        value={emailBody} // Reusing emailBody for message text to simplify state
                                        onChange={(e) => setEmailBody(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="Hello {{first_name}}! Check out our new promotion."
                                    />
                                    <p className="text-xs text-gray-400">Available variables: {'{{first_name}}'}, {'{{total_spend}}'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500">Sticker Package ID</label>
                                        <input
                                            type="text"
                                            value={stickerPackageId}
                                            onChange={(e) => setStickerPackageId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="e.g. 446"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-500">Sticker ID</label>
                                        <input
                                            type="text"
                                            value={stickerId}
                                            onChange={(e) => setStickerId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            placeholder="e.g. 1988"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">Optional: Add a sticker to your message.</p>

                                <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-xs text-green-800">
                                    <p><strong>Note:</strong> This will send a push message to the customer's LINE account if they are linked.</p>
                                </div>
                            </>
                        )}

                        {actionType === 'task' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500">Task Title</label>
                                    <input
                                        type="text"
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="Call customer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500">Due in (Days)</label>
                                    <input
                                        type="number"
                                        value={taskDueDate}
                                        onChange={(e) => setTaskDueDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="3"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>
        </aside>
    );
};
