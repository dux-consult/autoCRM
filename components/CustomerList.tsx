import React, { useEffect, useState } from 'react';
import { customerService } from '../services/customerService';
import { Customer } from '../types';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableCell,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Input,
    Badge,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from './ui';
import { Plus, Search, Filter, MoreHorizontal, ArrowUpDown, Download, Upload, Eye, Trash2 } from 'lucide-react';
import { CustomerForm } from './CustomerForm';
import { CustomerDetail } from './CustomerDetail';
import { useLanguage } from '../src/contexts/LanguageContext';

export const CustomerList: React.FC = () => {
    const { t } = useLanguage();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit/Add Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

    // View Modal
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingCustomer, setViewingCustomer] = useState<Customer | undefined>(undefined);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await customerService.getCustomers();
            setCustomers(data);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError(t('failedToLoadCustomers'));
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingCustomer(undefined);
        setIsModalOpen(true);
    };

    const handleEditClick = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleViewClick = (customer: Customer) => {
        setViewingCustomer(customer);
        setIsViewModalOpen(true);
    };

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        fetchCustomers();
    };

    const handleExport = () => {
        const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Total Spend', 'Transactions', 'Last Purchase', 'Segment'];
        const csvContent = [
            headers.join(','),
            ...customers.map(c => [
                c.id,
                c.first_name,
                c.last_name,
                c.email,
                c.phone,
                c.total_spend,
                c.total_transactions,
                c.last_purchase_date,
                c.segmentation_status
            ].map(field => `"${field ?? ''}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'customers.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleImportClick = () => {
        document.getElementById('csv-upload')?.click();
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

            let successCount = 0;
            let failCount = 0;

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;

                const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                const customerData: any = {};

                headers.forEach((header, index) => {
                    if (header === 'First Name') customerData.first_name = values[index];
                    if (header === 'Last Name') customerData.last_name = values[index];
                    if (header === 'Email') customerData.email = values[index];
                    if (header === 'Phone') customerData.phone = values[index];
                });

                if (customerData.first_name) {
                    try {
                        await customerService.createCustomer(customerData);
                        successCount++;
                    } catch (err) {
                        console.error('Failed to import row', i, err);
                        failCount++;
                    }
                }
            }

            alert(t('importFinished').replace('{success}', successCount.toString()).replace('{fail}', failCount.toString()));
            fetchCustomers();
            event.target.value = '';
        };
        reader.readAsText(file);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
    );

    const getSegmentColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'potential loyalist': return 'success';
            case 'promising at risk': return 'warning';
            case 'need attention': return 'danger';
            default: return 'default';
        }
    };

    if (loading && customers.length === 0) return <div className="p-8 text-center">{t('loadingCustomers')}</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('customersTitle')}</h2>
                    <p className="text-sm text-gray-500 mt-1">{t('customersDesc')}</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="file"
                        id="csv-upload"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button variant="outline" onClick={handleImportClick}>
                        <Upload className="w-4 h-4 mr-2" />
                        {t('import')}
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        {t('export')}
                    </Button>
                    <Button onClick={handleAddClick}>
                        <Plus className="w-4 h-4 mr-2" />
                        {t('addCustomer')}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="border-b border-gray-100 bg-white/50">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder={t('searchCustomers')}
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <Button variant="outline" size="sm" className="hidden sm:flex">
                                <Filter className="w-4 h-4 mr-2" />
                                {t('filter')}
                            </Button>
                            <Button variant="outline" size="sm" className="hidden sm:flex">
                                <ArrowUpDown className="w-4 h-4 mr-2" />
                                {t('sort')}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('name')}</TableHead>
                                <TableHead>{t('contact')}</TableHead>
                                <TableHead>{t('totalSpend')}</TableHead>
                                <TableHead>{t('transactions')}</TableHead>
                                <TableHead>{t('lastPurchase')}</TableHead>
                                <TableHead>{t('segment')}</TableHead>
                                <TableHead className="w-[100px] text-right">{t('actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <tbody>
                            {filteredCustomers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500" >
                                        {t('noCustomersFound')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>
                                            <div className="font-medium text-gray-900">
                                                {customer.first_name} {customer.last_name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="text-gray-900">{customer.email}</span>
                                                <span className="text-gray-500">{customer.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            ฿{customer.total_spend?.toLocaleString() ?? 0}
                                        </TableCell>
                                        <TableCell>
                                            {customer.total_transactions ?? 0}
                                        </TableCell>
                                        <TableCell>
                                            {customer.last_purchase_date
                                                ? new Date(customer.last_purchase_date).toLocaleDateString('th-TH')
                                                : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {customer.segmentation_status && (
                                                <Badge variant={getSegmentColor(customer.segmentation_status) as any}>
                                                    {customer.segmentation_status}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewClick(customer)}>
                                                    <Eye className="w-4 h-4 text-blue-600" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditClick(customer)}>
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                                                    if (window.confirm(t('deleteCustomerConfirm'))) {
                                                        customerService.deleteCustomer(customer.id).then(() => fetchCustomers());
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
                        <DialogTitle>{editingCustomer ? t('editCustomer') : t('addNewCustomer')}</DialogTitle>
                    </DialogHeader>
                    <CustomerForm
                        initialData={editingCustomer}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="sm:max-w-[900px]">
                    <DialogHeader>
                        <DialogTitle>{t('customerDetails')}</DialogTitle>
                    </DialogHeader>
                    {viewingCustomer && <CustomerDetail customer={viewingCustomer} />}
                </DialogContent>
            </Dialog>
        </div>
    );
};
