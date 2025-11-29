import React, { useState, useEffect } from 'react';
import { Customer, Product, Transaction, TransactionItem } from '../types';
import { customerService } from '../services/customerService';
import { productService } from '../services/productService';
import { transactionService } from '../services/transactionService';
import { Button, Input } from './ui';
import { Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../src/contexts/LanguageContext';

interface TransactionFormProps {
    initialData?: Transaction;
    onSuccess: () => void;
    onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ initialData, onSuccess, onCancel }) => {
    const { t } = useLanguage();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedCustomerId, setSelectedCustomerId] = useState(initialData?.customer_id || '');
    const [transactionDate, setTransactionDate] = useState(
        initialData?.transaction_date ? new Date(initialData.transaction_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    );
    const [items, setItems] = useState<Partial<TransactionItem>[]>(initialData?.items || []);

    useEffect(() => {
        const loadData = async () => {
            const [custs, prods] = await Promise.all([
                customerService.getCustomers(),
                productService.getProducts()
            ]);
            setCustomers(custs);
            setProducts(prods);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (initialData && (!initialData.items || initialData.items.length === 0)) {
            const fetchFullTransaction = async () => {
                try {
                    const fullTrans = await transactionService.getTransaction(initialData.id);
                    setItems(fullTrans.items || []);
                } catch (err) {
                    console.error("Failed to load transaction details", err);
                }
            };
            fetchFullTransaction();
        } else if (initialData && initialData.items) {
            setItems(initialData.items);
        }
    }, [initialData]);


    const handleAddItem = () => {
        setItems([...items, { product_id: '', quantity: 1, unit_price: 0, total_price: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleItemChange = (index: number, field: keyof TransactionItem, value: any) => {
        const newItems = [...items];
        const item = { ...newItems[index] };

        if (field === 'product_id') {
            const product = products.find(p => p.id === value);
            if (product) {
                item.product_id = product.id;
                item.unit_price = product.selling_price;
                item.total_price = item.quantity! * product.selling_price;
            }
        } else if (field === 'quantity') {
            item.quantity = parseInt(value) || 0;
            item.total_price = item.quantity * (item.unit_price || 0);
        }

        newItems[index] = item;
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.total_price || 0), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomerId || items.length === 0) return;

        setLoading(true);
        try {
            const transactionData = {
                customer_id: selectedCustomerId,
                transaction_date: transactionDate,
                total_amount: calculateTotal(),
                status: 'completed' as const
            };

            if (initialData) {
                await transactionService.updateTransaction(initialData.id, transactionData, items);
            } else {
                await transactionService.createTransaction(transactionData, items);
            }
            onSuccess();
        } catch (err) {
            console.error(err);
            alert(t('failedToSaveTransaction'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('customerLabel')}</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        value={selectedCustomerId}
                        onChange={e => setSelectedCustomerId(e.target.value)}
                        required
                    >
                        <option value="">{t('selectCustomer')}</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('dateLabel')}</label>
                    <Input
                        type="date"
                        value={transactionDate}
                        onChange={e => setTransactionDate(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">{t('itemsLabel')}</h4>
                    <Button type="button" size="sm" variant="outline" onClick={handleAddItem}>
                        <Plus className="w-4 h-4 mr-2" /> {t('addItem')}
                    </Button>
                </div>

                {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                            <select
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                value={item.product_id}
                                onChange={e => handleItemChange(index, 'product_id', e.target.value)}
                                required
                            >
                                <option value="">{t('selectProduct')}</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (฿{p.selling_price})</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-20">
                            <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                placeholder={t('qtyPlaceholder')}
                            />
                        </div>
                        <div className="w-24 pt-2 text-right text-sm font-medium">
                            ฿{item.total_price?.toLocaleString()}
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm border border-dashed rounded-lg">
                        {t('noItemsAdded')}
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-bold">
                    {t('totalLabel')} ฿{calculateTotal().toLocaleString()}
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>{t('cancel')}</Button>
                    <Button type="submit" disabled={loading || !selectedCustomerId || items.length === 0}>
                        {loading ? t('saving') : (initialData ? t('updateTransaction') : t('createTransaction'))}
                    </Button>
                </div>
            </div>
        </form>
    );
};
