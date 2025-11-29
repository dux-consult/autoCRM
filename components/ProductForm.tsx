import React, { useState } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { Button, Input } from './ui';

interface ProductFormProps {
    initialData?: Product;
    onSuccess: () => void;
    onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: initialData?.name || '',
        selling_price: initialData?.selling_price || 0,
        cost_price: initialData?.cost_price || 0,
        unit: initialData?.unit || '',
        usage_duration_days: initialData?.usage_duration_days || 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (initialData?.id) {
                await productService.updateProduct(initialData.id, formData);
            } else {
                await productService.createProduct(formData);
            }
            onSuccess();
        } catch (err) {
            console.error(err);
            setError('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Selling Price</label>
                    <Input
                        type="number"
                        required
                        value={formData.selling_price}
                        onChange={e => setFormData({ ...formData, selling_price: parseFloat(e.target.value) })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Cost Price</label>
                    <Input
                        type="number"
                        value={formData.cost_price}
                        onChange={e => setFormData({ ...formData, cost_price: parseFloat(e.target.value) })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Unit (e.g., pcs, box)</label>
                    <Input
                        value={formData.unit}
                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Usage Duration (Days)</label>
                    <Input
                        type="number"
                        value={formData.usage_duration_days}
                        onChange={e => setFormData({ ...formData, usage_duration_days: parseInt(e.target.value) })}
                        placeholder="For proactive alerts"
                    />
                    <p className="text-xs text-gray-500">Estimated days until product runs out.</p>
                </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
                </Button>
            </div>
        </form>
    );
};
