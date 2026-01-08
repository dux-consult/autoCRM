import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductType, ServiceFlowConfig, DEFAULT_SERVICE_FLOW_CONFIG } from '../../types';
import { productService } from '../../services/productService';
import { aiSuggestProductConfig } from '../../services/aiProductService';
import { ServiceFlowBuilder } from './ServiceFlowBuilder';
import { Button, Input, Switch } from '../ui';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { Package, Sparkles, ImageIcon, Box, Wrench, Save, X, Loader2, Upload } from 'lucide-react';

interface ProductFormV2Props {
    initialData?: Product;
    onSuccess: () => void;
    onCancel: () => void;
}

export const ProductFormV2: React.FC<ProductFormV2Props> = ({ initialData, onSuccess, onCancel }) => {
    const { t } = useLanguage();

    // Basic Info State
    const [name, setName] = useState(initialData?.name || '');
    const [sku, setSku] = useState(initialData?.sku || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
    const [sellingPrice, setSellingPrice] = useState(initialData?.selling_price || 0);
    const [costPrice, setCostPrice] = useState(initialData?.cost_price || 0);
    const [unit, setUnit] = useState(initialData?.unit || 'ชิ้น');
    const [productType, setProductType] = useState<ProductType>(initialData?.product_type || 'tangible');
    const [stockQuantity, setStockQuantity] = useState(initialData?.stock_quantity || 0);

    // Service Flow State
    const [hasServiceFlow, setHasServiceFlow] = useState(initialData?.has_service_flow || false);
    const [lifecycleMonths, setLifecycleMonths] = useState(initialData?.lifecycle_months || 12);
    const [serviceIntervalMonths, setServiceIntervalMonths] = useState(initialData?.service_interval_months || 6);
    const [serviceFlowConfig, setServiceFlowConfig] = useState<ServiceFlowConfig>(
        initialData?.service_flow_config || DEFAULT_SERVICE_FLOW_CONFIG
    );

    // UI State
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleMagicSetup = async () => {
        if (!name.trim()) {
            setError('กรุณากรอกชื่อสินค้าก่อนใช้ Magic Setup');
            return;
        }

        setAiLoading(true);
        setAiSuggestion(null);

        try {
            const suggestion = await aiSuggestProductConfig(name);
            setLifecycleMonths(suggestion.lifecycle_months);
            setServiceIntervalMonths(suggestion.service_interval_months);
            setHasServiceFlow(true);
            setAiSuggestion(suggestion.reasoning);
        } catch (err) {
            console.error('AI suggestion failed:', err);
            setError('ไม่สามารถใช้ AI แนะนำได้');
        } finally {
            setAiLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation for image file
        if (!file.type.startsWith('image/')) {
            setError('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น');
            return;
        }

        // Limit size (e.g., 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('ขนาดไฟล์ต้องไม่เกิน 2MB');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const url = await productService.uploadProductImage(file);
            setImageUrl(url);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError('ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่ (ตรวจสอบว่ามี bucket "products" หรือไม่)');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const productData: Partial<Product> = {
                name,
                sku: sku || undefined,
                description: description || undefined,
                image_url: imageUrl || undefined,
                selling_price: sellingPrice,
                cost_price: costPrice || undefined,
                unit: unit || undefined,
                product_type: productType,
                stock_quantity: productType === 'tangible' ? stockQuantity : undefined,
                has_service_flow: hasServiceFlow,
                lifecycle_months: hasServiceFlow ? lifecycleMonths : 0,
                service_interval_months: hasServiceFlow ? serviceIntervalMonths : 0,
                service_flow_config: hasServiceFlow ? serviceFlowConfig : DEFAULT_SERVICE_FLOW_CONFIG,
                is_active: true
            };

            if (initialData?.id) {
                await productService.updateProduct(initialData.id, productData);
            } else {
                await productService.createProduct(productData);
            }
            onSuccess();
        } catch (err) {
            console.error(err);
            setError('ไม่สามารถบันทึกสินค้าได้');
        } finally {
            setLoading(false);
        }
    };

    const profitMargin = sellingPrice > 0 && costPrice > 0
        ? ((sellingPrice - costPrice) / sellingPrice * 100).toFixed(1)
        : null;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
            <div className="flex flex-1 overflow-hidden">
                {/* Left Pane - Basic Info (30%) */}
                <div className="w-[35%] border-r overflow-y-auto p-6 bg-slate-50/50">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-800 border-b border-slate-200 pb-3">
                        <Package className="w-5 h-5 text-blue-600" />
                        ข้อมูลสินค้า
                    </h2>

                    {/* Image Preview */}
                    <div className="mb-6">
                        <div
                            className="group relative aspect-square bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imageUrl ? (
                                <>
                                    <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                            <Upload className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                                    {uploading ? (
                                        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                                    ) : (
                                        <>
                                            <ImageIcon className="w-12 h-12" />
                                            <span className="text-xs font-bold">คลิกเพื่ออัปโหลด</span>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Loading Overlay */}
                            {uploading && imageUrl && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                        />

                        <div className="mt-3 relative">
                            <Input
                                className="bg-white pl-9"
                                placeholder="🔗 หรือวาง URL รูปภาพสินค้า"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    {/* Product Name with Magic Button */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">ชื่อสินค้า *</label>
                        <div className="flex gap-2">
                            <Input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="เช่น แอร์ Daikin Inverter 12000 BTU"
                                className="flex-1 bg-white"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleMagicSetup}
                                disabled={aiLoading}
                                className="shrink-0 border-blue-200 hover:bg-blue-50 transition-colors"
                                title="AI แนะนำการตั้งค่า"
                            >
                                {aiLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4 text-yellow-500" />
                                )}
                            </Button>
                        </div>
                        {aiSuggestion && (
                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {aiSuggestion}
                            </p>
                        )}
                    </div>

                    {/* SKU */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">รหัสสินค้า (SKU)</label>
                        <Input
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            placeholder="เช่น AIR-DK-12K-INV"
                            className="bg-white"
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">รายละเอียด</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="เขียนคำอธิบายสินค้า..."
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl min-h-[100px] bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>

                    {/* Price & Cost */}
                    <div className="grid grid-cols-2 gap-3 mb-2">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">ราคาขาย *</label>
                            <Input
                                type="number"
                                required
                                min={0}
                                value={sellingPrice}
                                onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                                className="bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">ราคาทุน</label>
                            <Input
                                type="number"
                                min={0}
                                value={costPrice}
                                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                                className="bg-white"
                            />
                        </div>
                    </div>
                    {profitMargin && (
                        <p className={`text-xs font-medium mb-4 ${parseFloat(profitMargin) > 0 ? 'text-green-600' : 'text-slate-500'}`}>
                            🧮 กำไร: {(sellingPrice - costPrice).toLocaleString()} บาท ({profitMargin}%)
                        </p>
                    )}

                    {/* Product Type */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">ประเภทสินค้า</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setProductType('tangible')}
                                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border-2 transition-all ${productType === 'tangible'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                    }`}
                            >
                                <Box className={`w-6 h-6 ${productType === 'tangible' ? 'text-blue-600' : 'text-slate-300'}`} />
                                <span className="text-xs font-bold uppercase tracking-wider">สินค้า</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setProductType('service')}
                                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border-2 transition-all ${productType === 'service'
                                    ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm shadow-purple-100'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                    }`}
                            >
                                <Wrench className={`w-6 h-6 ${productType === 'service' ? 'text-purple-600' : 'text-slate-300'}`} />
                                <span className="text-xs font-bold uppercase tracking-wider">บริการ</span>
                            </button>
                        </div>
                    </div>

                    {/* Stock (only for tangible) */}
                    {productType === 'tangible' && (
                        <div className="mb-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">จำนวนในสต็อก</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    value={stockQuantity}
                                    onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                                    className="w-24"
                                />
                                <Input
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    placeholder="หน่วย"
                                    className="w-20"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Pane - Service Flow (70%) */}
                <div className="w-[65%] overflow-y-auto p-6">
                    {/* Service Flow Toggle */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                        <div>
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                Automation Flow
                            </h2>
                            <p className="text-sm text-gray-500">เปิดใช้ระบบดูแลลูกค้าอัตโนมัติ</p>
                        </div>
                        <Switch
                            checked={hasServiceFlow}
                            onCheckedChange={setHasServiceFlow}
                        />
                    </div>

                    {hasServiceFlow ? (
                        <ServiceFlowBuilder
                            lifecycleMonths={lifecycleMonths}
                            serviceIntervalMonths={serviceIntervalMonths}
                            config={serviceFlowConfig}
                            onConfigChange={setServiceFlowConfig}
                            onLifecycleChange={setLifecycleMonths}
                            onIntervalChange={setServiceIntervalMonths}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400">
                            <div className="text-center">
                                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg">เปิด Automation Flow เพื่อตั้งค่าการดูแลลูกค้า</p>
                                <p className="text-sm mt-2">ระบบจะสร้าง Task และส่ง Message อัตโนมัติ</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-white border-t border-slate-100 p-4 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]">
                {error && <p className="text-red-500 text-sm mb-3 font-medium text-center">{error}</p>}
                <div className="flex justify-between items-center max-w-6xl mx-auto px-2">
                    <div className="text-xs text-slate-400 italic">
                        * ข้อมูลที่มีเครื่องหมายดอกจันจำเป็นต้องกรอก
                    </div>
                    <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl px-6">
                            <X className="w-4 h-4 mr-2" />
                            ยกเลิก
                        </Button>
                        <Button type="submit" disabled={loading} className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {initialData ? 'บันทึกการแก้ไข' : 'ยืนยันสร้างสินค้า'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};
