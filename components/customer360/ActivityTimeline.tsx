import React, { useState } from 'react';
import { ActivityLog } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../ui';
import { Clock, ShoppingCart, MessageSquare, Phone, Zap, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';

interface ActivityTimelineProps {
    activities: ActivityLog[];
    total: number;
    onLoadMore: () => void;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
    activities,
    total,
    onLoadMore
}) => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);

    const handleLoadMore = async () => {
        setLoading(true);
        await onLoadMore();
        setLoading(false);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <ShoppingCart className="w-4 h-4" />;
            case 'chat': return <MessageSquare className="w-4 h-4" />;
            case 'call': return <Phone className="w-4 h-4" />;
            case 'auto': return <Zap className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'order': return 'bg-green-100 text-green-600';
            case 'chat': return 'bg-blue-100 text-blue-600';
            case 'call': return 'bg-purple-100 text-purple-600';
            case 'auto': return 'bg-yellow-100 text-yellow-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'order': return '🛒 ซื้อสินค้า';
            case 'chat': return '💬 แชท LINE';
            case 'call': return '📞 โทรศัพท์';
            case 'auto': return '🤖 ระบบอัตโนมัติ';
            default: return type;
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMins = Math.floor(diffMs / (1000 * 60));
                return `${diffMins} นาทีที่แล้ว`;
            }
            return `${diffHours} ชั่วโมงที่แล้ว`;
        }
        if (diffDays === 1) return 'เมื่อวาน';
        if (diffDays < 7) return `${diffDays} วันที่แล้ว`;

        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const hasMore = activities.length < total;

    if (activities.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        {t('activityTimeline') || 'ประวัติกิจกรรม'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-400">
                        <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>{t('noActivities') || 'ยังไม่มีกิจกรรม'}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    {t('activityTimeline') || 'ประวัติกิจกรรม'}
                    <span className="text-sm font-normal text-gray-500">({total})</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

                    {/* Timeline Items */}
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <div key={activity.id} className="relative flex gap-4">
                                {/* Icon */}
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${getIconBg(activity.type)}`}>
                                    {getIcon(activity.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-gray-900">{activity.title}</p>
                                            {activity.description && (
                                                <p className="text-sm text-gray-500 mt-0.5">{activity.description}</p>
                                            )}
                                            {activity.amount && (
                                                <p className="text-sm font-medium text-green-600 mt-1">
                                                    ฿{activity.amount.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {formatDate(activity.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Load More Button */}
                {hasMore && (
                    <div className="mt-4 text-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="gap-2"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4" />
                                    {t('loadMore') || 'โหลดเพิ่มเติม'}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
