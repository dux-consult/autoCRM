import React, { useState, useEffect } from 'react';
import { Customer, CustomerProduct, ActivityLog, CustomerNote } from '../../types';
import { customerService } from '../../services/customerService';
import { customerProductService } from '../../services/customerProductService';
import { customerNoteService } from '../../services/customerNoteService';
import { activityLogService } from '../../services/activityLogService';
import { useLanguage } from '../../src/contexts/LanguageContext';

import { Customer360Header } from './Customer360Header';
import { RFMCLVCard } from './RFMCLVCard';
import { CustomerDetailCard } from './CustomerDetailCard';
import { TagsPreferences } from './TagsPreferences';
import { ProductOnHand } from './ProductOnHand';
import { ActivityTimeline } from './ActivityTimeline';
import { SmartNote } from './SmartNote';
import { AINextBestAction } from './AINextBestAction';

interface Customer360Props {
    customerId: string;
    onBack: () => void;
}

export const Customer360: React.FC<Customer360Props> = ({ customerId, onBack }) => {
    const { t } = useLanguage();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [products, setProducts] = useState<CustomerProduct[]>([]);
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [notes, setNotes] = useState<CustomerNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [activitiesTotal, setActivitiesTotal] = useState(0);

    useEffect(() => {
        loadData();
    }, [customerId]);

    const loadData = async () => {
        try {
            setLoading(true);

            // First, load the customer - this is required
            const customerData = await customerService.getCustomer(customerId);
            setCustomer(customerData);

            // Then, try to load optional data from new tables (may not exist yet)
            try {
                const productsData = await customerProductService.getProductsByCustomerId(customerId);
                setProducts(productsData);
            } catch (e) {
                console.log('customer_products table may not exist yet');
                setProducts([]);
            }

            try {
                const activitiesData = await activityLogService.getActivityLogs(customerId, 10, 0);
                setActivities(activitiesData.data);
                setActivitiesTotal(activitiesData.total);
            } catch (e) {
                console.log('activity_logs table may not exist yet');
                setActivities([]);
                setActivitiesTotal(0);
            }

            try {
                const notesData = await customerNoteService.getNotesByCustomerId(customerId);
                setNotes(notesData);
            } catch (e) {
                console.log('customer_notes table may not exist yet');
                setNotes([]);
            }

        } catch (error) {
            console.error('Error loading customer 360 data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomerUpdate = async (updates: Partial<Customer>) => {
        if (!customer) return;
        try {
            const updated = await customerService.updateCustomer(customer.id, updates);
            setCustomer(updated);
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };

    const loadMoreActivities = async () => {
        try {
            const { data, total } = await activityLogService.getActivityLogs(
                customerId,
                10,
                activities.length
            );
            setActivities([...activities, ...data]);
            setActivitiesTotal(total);
        } catch (error) {
            console.error('Error loading more activities:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="text-center py-10 text-gray-500">
                {t('customerNotFound') || 'ไม่พบข้อมูลลูกค้า'}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Zone 1: Header */}
            <Customer360Header
                customer={customer}
                onBack={onBack}
                onCustomerUpdate={handleCustomerUpdate}
            />

            {/* Main 3-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Zone 2: Left Column (25%) - The Logic */}
                <div className="lg:col-span-1 space-y-6">
                    <RFMCLVCard customer={customer} />
                    <CustomerDetailCard
                        customer={customer}
                        onUpdate={handleCustomerUpdate}
                    />
                    <TagsPreferences
                        customer={customer}
                        onUpdate={handleCustomerUpdate}
                    />
                </div>

                {/* Zone 3: Center Column (50%) - The Engine */}
                <div className="lg:col-span-2 space-y-6">
                    <ProductOnHand products={products} />
                    <ActivityTimeline
                        activities={activities}
                        total={activitiesTotal}
                        onLoadMore={loadMoreActivities}
                    />
                </div>

                {/* Zone 4: Right Column (25%) - The Assistant */}
                <div className="lg:col-span-1 space-y-6">
                    <SmartNote
                        customerId={customerId}
                        notes={notes}
                        onNotesChange={setNotes}
                    />
                    <AINextBestAction customer={customer} />
                </div>
            </div>
        </div>
    );
};
