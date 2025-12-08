import React from 'react';
import { CustomerProduct } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../ui';
import { Package, AlertCircle, Wrench, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';

interface ProductOnHandProps {
    products: CustomerProduct[];
}

export const ProductOnHand: React.FC<ProductOnHandProps> = ({ products }) => {
    const { t } = useLanguage();

    const calculateUsageProgress = (product: CustomerProduct) => {
        if (!product.installation_date || !product.next_service_date) return 0;

        const installDate = new Date(product.installation_date).getTime();
        const serviceDate = new Date(product.next_service_date).getTime();
        const now = Date.now();

        const totalDuration = serviceDate - installDate;
        const elapsed = now - installDate;

        return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    };

    const getDaysRemaining = (product: CustomerProduct) => {
        if (!product.next_service_date) return null;
        const serviceDate = new Date(product.next_service_date).getTime();
        const now = Date.now();
        const days = Math.ceil((serviceDate - now) / (1000 * 60 * 60 * 24));
        return days;
    };

    const getStatusColor = (daysRemaining: number | null) => {
        if (daysRemaining === null) return 'bg-gray-200';
        if (daysRemaining <= 0) return 'bg-red-500';
        if (daysRemaining <= 7) return 'bg-red-500';
        if (daysRemaining <= 30) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getProgressBarColor = (daysRemaining: number | null) => {
        if (daysRemaining === null) return 'bg-gray-400';
        if (daysRemaining <= 0) return 'bg-red-500';
        if (daysRemaining <= 7) return 'bg-red-500';
        if (daysRemaining <= 30) return 'bg-yellow-500';
        return 'bg-primary';
    };

    if (products.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        {t('productOnHand') || 'สินค้าที่ถือครอง'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>{t('noProducts') || 'ยังไม่มีสินค้า'}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    {t('productOnHand') || 'สินค้าที่ถือครอง'}
                    <span className="text-sm font-normal text-gray-500">({products.length})</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {products.map((product) => {
                    const progress = calculateUsageProgress(product);
                    const daysRemaining = getDaysRemaining(product);
                    const productInfo = product.product;

                    return (
                        <div
                            key={product.id}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                {/* Product Image Placeholder */}
                                <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center flex-shrink-0">
                                    <Package className="w-8 h-8 text-gray-300" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Product Name */}
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className="font-medium text-gray-900 truncate">
                                            {productInfo?.name || 'ไม่ทราบชื่อสินค้า'}
                                        </h4>
                                        {product.quantity > 1 && (
                                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                                                x{product.quantity}
                                            </span>
                                        )}
                                    </div>

                                    {/* Usage Progress Bar */}
                                    <div className="mb-2">
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(daysRemaining)}`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Status Text */}
                                    <div className="flex items-center gap-2 text-sm">
                                        {daysRemaining !== null && daysRemaining <= 7 && (
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className={daysRemaining !== null && daysRemaining <= 7 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                                            {daysRemaining === null
                                                ? (t('noServiceDate') || 'ไม่มีกำหนด Service')
                                                : daysRemaining <= 0
                                                    ? (t('overdue') || 'เลยกำหนดแล้ว!')
                                                    : (t('daysRemainingService') || `เหลือ ${daysRemaining} วันถึงรอบ Service`).replace('{days}', String(daysRemaining))}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-3">
                                        <Button size="sm" variant="outline" className="gap-1 text-xs">
                                            <Wrench className="w-3 h-3" />
                                            {t('requestService') || 'แจ้งซ่อม/Service'}
                                        </Button>
                                        <Button size="sm" variant="outline" className="gap-1 text-xs">
                                            <RefreshCw className="w-3 h-3" />
                                            {t('reorder') || 'ซื้อซ้ำ'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};
