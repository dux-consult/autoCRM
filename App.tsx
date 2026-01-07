import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { PetShopPage } from './components/PetShopPage';
import { AirServicePage } from './components/AirServicePage';
import { ViewState, RFMSegment, Customer } from './types';
import { MOCK_CUSTOMERS, MOCK_TASKS, MOCK_TENANTS } from './constants';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Table, TableHeader, TableRow, TableHead, TableCell } from './components/ui';

import { transactionService } from './services/transactionService';
import { customerService } from './services/customerService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Plus, Filter, Download, MoreHorizontal, Phone, MessageSquare, Sparkles, AlertCircle, ArrowUpRight, Calendar, DollarSign, CheckSquare, Lock } from 'lucide-react';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LanguageProvider, useLanguage } from './src/contexts/LanguageContext';
import { AuthModal } from './src/components/AuthModal';
import { CustomerList } from './components/CustomerList';
import { ProductList } from './components/ProductList';
import { TransactionList } from './components/TransactionList';
import { TaskList } from './components/TaskList';
import { SettingsView } from './components/SettingsView';
import { AutomationView } from './components/AutomationView';
import { Customer360 } from './components/customer360';

type PublicPage = 'home' | 'pet-shop' | 'air-service';

// --- Dashboard View ---
const DashboardView = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    averageOrderValue: 0
  });
  const [rfmData, setRfmData] = useState([
    { name: 'Champion', value: 0, color: '#0052FF' },
    { name: 'Loyal', value: 0, color: '#4C82FF' },
    { name: 'At Risk', value: 0, color: '#FFB02E' },
    { name: 'Lost', value: 0, color: '#CFD9E0' },
    { name: 'New', value: 0, color: '#10B981' }
  ]);
  const [chartData, setChartData] = useState<{ name: string; sales: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactions, customers] = await Promise.all([
          transactionService.getTransactions(),
          customerService.getCustomers()
        ]);

        // Calculate Revenue Stats
        const totalRev = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
        const avgOrder = transactions.length > 0 ? totalRev / transactions.length : 0;

        setStats({
          totalRevenue: totalRev,
          totalTransactions: transactions.length,
          averageOrderValue: avgOrder
        });

        // Calculate Chart Data (Last 7 Days)
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d;
        });

        const dailySales = last7Days.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

          const sales = transactions
            .filter(t => t.transaction_date.startsWith(dateStr))
            .reduce((sum, t) => sum + (t.total_amount || 0), 0);

          return { name: dayName, sales };
        });

        setChartData(dailySales);

        // Calculate RFM Segments
        const segments = {
          'Champion': 0,
          'Loyal': 0,
          'At Risk': 0,
          'Lost': 0,
          'New': 0
        };

        customers.forEach(c => {
          const seg = c.segmentation_status || 'New';
          if (seg.includes('Champion')) segments['Champion']++;
          else if (seg.includes('Loyal') || seg.includes('Potential')) segments['Loyal']++;
          else if (seg.includes('Risk') || seg.includes('Attention')) segments['At Risk']++;
          else if (seg.includes('Lost') || seg.includes('Hibernating')) segments['Lost']++;
          else segments['New']++;
        });

        setRfmData([
          { name: 'Champion', value: segments['Champion'], color: '#0052FF' },
          { name: 'Loyal', value: segments['Loyal'], color: '#4C82FF' },
          { name: 'At Risk', value: segments['At Risk'], color: '#FFB02E' },
          { name: 'Lost', value: segments['Lost'], color: '#CFD9E0' },
          { name: 'New', value: segments['New'], color: '#10B981' }
        ]);

      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">{t('loadingDashboard')}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
              <DollarSign className="text-primary w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('totalRevenue')}</p>
              <h3 className="text-2xl font-bold text-gray-900">฿{stats.totalRevenue.toLocaleString()}</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" /> {stats.totalTransactions} {t('transactionsCount')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mr-4">
              <Calendar className="text-purple-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('avgOrderValue')}</p>
              <h3 className="text-2xl font-bold text-gray-900">฿{stats.averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {t('perTransaction')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mr-4">
              <Sparkles className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('autoGenerated')}</p>
              <h3 className="text-2xl font-bold text-gray-900">85</h3>
              <p className="text-xs text-gray-500 mt-1">
                {t('tasksCreated')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle>{t('salesActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <Tooltip
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#0052FF" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle>{t('customerSegmentation')}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rfmData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {rfmData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- Customers View ---
const CustomersView = ({ onViewCustomer360 }: { onViewCustomer360?: (customerId: string) => void }) => {
  return <CustomerList onViewCustomer360={onViewCustomer360} />;
};

// --- Super Admin View ---
const SuperAdminView = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-8 rounded-2xl mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">{t('superAdminConsole')}</h2>
          <p className="text-slate-400">{t('systemMonitoring')}</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('totalTenants')}</p>
            <h3 className="text-2xl font-bold mt-1">{MOCK_TENANTS.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('activeMrr')}</p>
            <h3 className="text-2xl font-bold mt-1">฿45,000</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('totalUsers')}</p>
            <h3 className="text-2xl font-bold mt-1">17</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('systemHealth')}</p>
            <h3 className="text-2xl font-bold mt-1 text-green-500">99.9%</h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('tenantsSmes')}</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{t('tenantName')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('users')}</TableHead>
              <TableHead>{t('customers')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {MOCK_TENANTS.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs text-gray-500">{t.id}</TableCell>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>
                  <Badge variant={t.status === 'Active' ? 'success' : t.status === 'Trial' ? 'warning' : 'danger'}>
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell>{t.userCount}</TableCell>
                <TableCell>{t.customerCount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Manage</Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

// --- Authenticated App Container ---
const DashboardApp = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const { role } = useAuth();
  const { t } = useLanguage();

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    if (view !== 'customer360') {
      setSelectedCustomerId(null);
    }
  };

  const handleViewCustomer360 = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setCurrentView('customer360');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'customers': return <CustomersView onViewCustomer360={handleViewCustomer360} />;
      case 'customer360':
        if (!selectedCustomerId) {
          handleViewChange('customers');
          return null;
        }
        return (
          <Customer360
            customerId={selectedCustomerId}
            onBack={() => handleViewChange('customers')}
          />
        );
      case 'products': return <ProductList />;
      case 'transactions': return <TransactionList />;
      case 'tasks': return <TaskList />;
      case 'automation': return <AutomationView />;
      case 'superadmin':
        if (role !== 'super_admin') return <div className="p-10 text-center text-red-500">{t('accessDenied')}</div>;
        return <SuperAdminView />;
      case 'settings': return <SettingsView />;
      default: return <div className="p-10 text-center text-gray-500">{t('comingSoon')}</div>;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={handleViewChange}>
      {renderView()}
    </Layout>
  );
};

// --- Main App Entry ---
function AppContent() {
  const { user, loading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authInitialView, setAuthInitialView] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<PublicPage>('home');

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <DashboardApp />;
  }

  const handleLoginClick = () => {
    setAuthInitialView('login');
    setIsLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthInitialView('register');
    setIsLoginModalOpen(true);
  };

  const renderPublicPage = () => {
    switch (currentPage) {
      case 'pet-shop':
        return (
          <PetShopPage
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateAirService={() => setCurrentPage('air-service')}
          />
        );
      case 'air-service':
        return (
          <AirServicePage
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
            onNavigateHome={() => setCurrentPage('home')}
            onNavigatePetShop={() => setCurrentPage('pet-shop')}
          />
        );
      case 'home':
      default:
        return (
          <LandingPage
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
            onNavigatePetShop={() => setCurrentPage('pet-shop')}
            onNavigateAirService={() => setCurrentPage('air-service')}
          />
        );
    }
  };

  return (
    <>
      {renderPublicPage()}
      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialView={authInitialView}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}