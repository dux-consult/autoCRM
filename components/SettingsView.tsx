import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { shopService } from '../services/shopService';
import { Shop } from '../types';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from './ui';
import { User, Building, Save, MessageSquare } from 'lucide-react';
import { IntegrationsPage } from './settings/IntegrationsPage';
import { useLanguage } from '../src/contexts/LanguageContext';

export const SettingsView: React.FC = () => {
    const { t } = useLanguage();
    const { user, role } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'integrations'>('profile');
    const [loading, setLoading] = useState(false);
    const [shopLoading, setShopLoading] = useState(false);
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: user?.email || ''
    });
    const [shop, setShop] = useState<Partial<Shop>>({
        name: '',
        address: '',
        phone: ''
    });
    const [existingShopId, setExistingShopId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user!.id)
                .single();

            if (profileData) {
                setProfile({
                    first_name: profileData.first_name || '',
                    last_name: profileData.last_name || '',
                    email: user?.email || ''
                });
            }

            // Fetch Shop
            const shopData = await shopService.getShop();
            if (shopData) {
                setShop(shopData);
                setExistingShopId(shopData.id);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: profile.first_name,
                    last_name: profile.last_name
                })
                .eq('id', user!.id);

            if (error) throw error;
            alert(t('profileUpdated'));
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(t('failedToUpdateProfile'));
        } finally {
            setLoading(false);
        }
    };

    const handleSaveShop = async () => {
        if (!shop.name) {
            alert(t('shopNameRequired'));
            return;
        }
        setShopLoading(true);
        try {
            if (existingShopId) {
                await shopService.updateShop(existingShopId, shop);
                alert(t('shopSettingsUpdated'));
            } else {
                const newShop = await shopService.createShop(shop);
                if (newShop) {
                    setExistingShopId(newShop.id);
                    alert(t('shopCreated'));
                }
            }
        } catch (error) {
            console.error('Error saving shop:', error);
            alert(t('failedToSaveShop'));
        } finally {
            setShopLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{t('settingsTitle')}</h2>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'profile'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {t('generalProfile')}
                </button>
                <button
                    onClick={() => setActiveTab('integrations')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'integrations'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {t('integrations')}
                </button>
            </div>

            {activeTab === 'integrations' ? (
                <IntegrationsPage />
            ) : (
                <div className="space-y-6">
                    {/* Profile Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" /> {t('userProfile')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('firstName')}</label>
                                    <Input
                                        value={profile.first_name}
                                        onChange={e => setProfile({ ...profile, first_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('lastName')}</label>
                                    <Input
                                        value={profile.last_name}
                                        onChange={e => setProfile({ ...profile, last_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('email')}</label>
                                    <Input
                                        value={profile.email}
                                        disabled
                                        className="bg-gray-50 text-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('role')}</label>
                                    <div className="px-3 py-2 border rounded-md bg-gray-50 text-gray-500 capitalize">
                                        {role?.replace('_', ' ')}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2">
                                <Button onClick={handleSaveProfile} disabled={loading}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading ? t('saving') : t('saveProfile')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shop Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="w-5 h-5 text-purple-600" /> {t('shopSettings')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('shopName')}</label>
                                <Input
                                    value={shop.name}
                                    onChange={e => setShop({ ...shop, name: e.target.value })}
                                    placeholder="e.g. My Awesome Store"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('phone')}</label>
                                    <Input
                                        value={shop.phone}
                                        onChange={e => setShop({ ...shop, phone: e.target.value })}
                                        placeholder="081-234-5678"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('address')}</label>
                                    <Input
                                        value={shop.address}
                                        onChange={e => setShop({ ...shop, address: e.target.value })}
                                        placeholder="123 Main St, Bangkok"
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <Button onClick={handleSaveShop} variant="outline" disabled={shopLoading}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {shopLoading ? t('saving') : (existingShopId ? t('updateShopSettings') : t('createShop'))}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};
