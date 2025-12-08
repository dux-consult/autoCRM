import React, { useState } from 'react';
import { Customer } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';
import { TrendingUp, Info } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';

interface RFMCLVCardProps {
    customer: Customer;
}

export const RFMCLVCard: React.FC<RFMCLVCardProps> = ({ customer }) => {
    const { t } = useLanguage();
    const [showPopover, setShowPopover] = useState(false);

    const rfm = customer.rfm_score || { r: 3, f: 3, m: 3, score: 'B' };
    const clv = customer.clv || customer.total_spend || 0;

    const getRFMGrade = () => {
        const total = (rfm.r + rfm.f + rfm.m) / 3;
        if (total >= 4) return { grade: 'A', color: 'text-green-600', bgColor: 'bg-green-100' };
        if (total >= 3) return { grade: 'B', color: 'text-blue-600', bgColor: 'bg-blue-100' };
        if (total >= 2) return { grade: 'C', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
        return { grade: 'D', color: 'text-red-600', bgColor: 'bg-red-100' };
    };

    const grade = getRFMGrade();

    const ProgressBar = ({ value, label, color }: { value: number; label: string; color: string }) => (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium">{value}/5</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${(value / 5) * 100}%` }}
                />
            </div>
        </div>
    );

    return (
        <Card className="relative">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        RFM & CLV
                    </span>
                    <button
                        onClick={() => setShowPopover(!showPopover)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <Info className="w-4 h-4 text-gray-400" />
                    </button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* CLV Display */}
                <div className="text-center py-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Customer Lifetime Value
                    </p>
                    <p className="text-3xl font-bold text-primary">
                        ฿{clv.toLocaleString()}
                    </p>
                </div>

                {/* RFM Grade */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">{t('rfmGrade') || 'RFM Grade'}</span>
                    <span className={`px-3 py-1 rounded-full font-bold ${grade.bgColor} ${grade.color}`}>
                        {grade.grade}
                    </span>
                </div>

                {/* RFM Progress Bars */}
                <div className="space-y-3">
                    <ProgressBar
                        value={rfm.r}
                        label={t('recency') || 'Recency (ความถี่ซื้อล่าสุด)'}
                        color="bg-blue-500"
                    />
                    <ProgressBar
                        value={rfm.f}
                        label={t('frequency') || 'Frequency (ความถี่ซื้อ)'}
                        color="bg-green-500"
                    />
                    <ProgressBar
                        value={rfm.m}
                        label={t('monetary') || 'Monetary (ยอดซื้อรวม)'}
                        color="bg-purple-500"
                    />
                </div>
            </CardContent>

            {/* Popover */}
            {showPopover && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-xl shadow-xl border z-10">
                    <h4 className="font-bold mb-2">{t('rfmExplanation') || 'RFM คืออะไร?'}</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li><strong>R (Recency):</strong> ซื้อล่าสุดเมื่อไหร่</li>
                        <li><strong>F (Frequency):</strong> ซื้อบ่อยแค่ไหน</li>
                        <li><strong>M (Monetary):</strong> ใช้จ่ายเท่าไหร่</li>
                    </ul>
                    <p className="text-xs text-gray-400 mt-2">
                        คลิกที่ไหนก็ได้เพื่อปิด
                    </p>
                    <button
                        onClick={() => setShowPopover(false)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                    >
                        ×
                    </button>
                </div>
            )}
        </Card>
    );
};
