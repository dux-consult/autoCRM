import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Mail, MessageSquare, Clock, GitBranch, Zap, MoreHorizontal } from 'lucide-react';

const getNodeIcon = (type: string) => {
    switch (type) {
        case 'trigger': return <Zap className="w-4 h-4 text-white" />;
        case 'action': return <Mail className="w-4 h-4 text-white" />; // Default action icon
        case 'condition': return <GitBranch className="w-4 h-4 text-white" />;
        case 'delay': return <Clock className="w-4 h-4 text-white" />;
        default: return <Zap className="w-4 h-4 text-white" />;
    }
};

const getNodeColor = (type: string) => {
    switch (type) {
        case 'trigger': return 'bg-blue-500';
        case 'action': return 'bg-slate-600';
        case 'condition': return 'bg-purple-500';
        case 'delay': return 'bg-orange-500';
        default: return 'bg-gray-500';
    }
};

export const CustomNode = memo(({ data, type, selected }: NodeProps) => {
    const label = data.label as string;
    const description = data.description as string;

    // Determine specific icon based on label if type is action
    let icon = getNodeIcon(type || 'default');
    if (label === 'Send LINE') icon = <MessageSquare className="w-4 h-4 text-white" />;

    return (
        <div className={`w-[280px] bg-white rounded-xl shadow-sm border transition-all duration-200 group ${selected ? 'border-primary ring-2 ring-primary/20 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}>
            {type !== 'trigger' && (
                <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-gray-400 !-top-1.5" />
            )}

            <div className="flex items-center p-3 gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${getNodeColor(type || 'default')}`}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{label}</h3>
                    <p className="text-xs text-gray-500 truncate">{description || 'Click to configure'}</p>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-gray-400 !-bottom-1.5" />
        </div>
    );
});
