import React from 'react';
import { MessageSquare, Mail, Clock, GitBranch, Zap } from 'lucide-react';

export const Sidebar = () => {
    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Toolbox</h3>
                <p className="text-xs text-gray-500">Drag nodes to the canvas</p>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Triggers</h4>
                    <div
                        className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg cursor-grab hover:shadow-md transition-all mb-2"
                        onDragStart={(event) => onDragStart(event, 'trigger', 'New Customer')}
                        draggable
                    >
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">New Customer</span>
                    </div>
                    <div
                        className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg cursor-grab hover:shadow-md transition-all"
                        onDragStart={(event) => onDragStart(event, 'trigger', 'Order Placed')}
                        draggable
                    >
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Order Placed</span>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Actions</h4>
                    <div
                        className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-primary/50 hover:shadow-md transition-all mb-2"
                        onDragStart={(event) => onDragStart(event, 'action', 'Send Email')}
                        draggable
                    >
                        <Mail className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Send Email</span>
                    </div>
                    <div
                        className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-primary/50 hover:shadow-md transition-all mb-2"
                        onDragStart={(event) => onDragStart(event, 'action', 'Send LINE')}
                        draggable
                    >
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Send LINE</span>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Logic</h4>
                    <div
                        className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-primary/50 hover:shadow-md transition-all mb-2"
                        onDragStart={(event) => onDragStart(event, 'condition', 'Check Condition')}
                        draggable
                    >
                        <GitBranch className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Condition</span>
                    </div>
                    <div
                        className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-primary/50 hover:shadow-md transition-all"
                        onDragStart={(event) => onDragStart(event, 'delay', 'Wait')}
                        draggable
                    >
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">Delay</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
