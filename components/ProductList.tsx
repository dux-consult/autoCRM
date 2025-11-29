import React, { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { Product } from '../types';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableCell,
    Card,
    CardHeader,
    CardContent,
    Button,
    Input,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from './ui';
import { Plus, Search, Filter, MoreHorizontal, ArrowUpDown, Package, Trash2, Upload } from 'lucide-react';
import { ProductForm } from './ProductForm';

export const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getProducts();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingProduct(undefined);
        setIsModalOpen(true);
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        fetchProducts();
    };

    const handleImportClick = () => {
        document.getElementById('product-csv-upload')?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            if (!text) return;

            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

            // Expected headers: Name, Selling Price, Cost Price, Unit, Usage Duration

            let successCount = 0;
            let failCount = 0;

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;

                const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                const productData: any = {};

                headers.forEach((header, index) => {
                    if (header === 'Name') productData.name = values[index];
                    if (header === 'Selling Price') productData.selling_price = parseFloat(values[index]);
                    if (header === 'Cost Price') productData.cost_price = parseFloat(values[index]);
                    if (header === 'Unit') productData.unit = values[index];
                    if (header === 'Usage Duration') productData.usage_duration_days = parseInt(values[index]);
                });

                if (productData.name && productData.selling_price) {
                    try {
                        await productService.createProduct(productData);
                        successCount++;
                    } catch (err) {
                        console.error('Failed to import row', i, err);
                        failCount++;
                    }
                }
            }

            alert(`Import finished: ${successCount} success, ${failCount} failed.`);
            fetchProducts();
            event.target.value = '';
        };
        reader.readAsText(file);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && products.length === 0) return <div className="p-8 text-center">Loading products...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your product catalog and pricing.</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="file"
                        id="product-csv-upload"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button variant="outline" onClick={handleImportClick}>
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                    </Button>
                    <Button onClick={handleAddClick}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="border-b border-gray-100 bg-white/50">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <Button variant="outline" size="sm" className="hidden sm:flex">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm" className="hidden sm:flex">
                                <ArrowUpDown className="w-4 h-4 mr-2" />
                                Sort
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Selling Price</TableHead>
                                <TableHead>Cost Price</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Usage Duration</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell className="text-center py-8 text-gray-500" >
                                        <div className="flex flex-col items-center justify-center">
                                            <Package className="w-12 h-12 text-gray-300 mb-2" />
                                            <p>No products found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="font-medium text-gray-900">
                                                {product.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            ฿{product.selling_price?.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            ฿{product.cost_price?.toLocaleString() ?? '-'}
                                        </TableCell>
                                        <TableCell>
                                            {product.unit || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {product.usage_duration_days ? `${product.usage_duration_days} days` : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditClick(product)}>
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this product?')) {
                                                        productService.deleteProduct(product.id).then(() => fetchProducts());
                                                    }
                                                }}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </tbody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    </DialogHeader>
                    <ProductForm
                        initialData={editingProduct}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};
