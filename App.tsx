import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { ViewState, RFMSegment, Customer } from './types';
import { MOCK_CUSTOMERS, MOCK_TASKS, MOCK_TENANTS } from './constants';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Table, TableHeader, TableRow, TableHead, TableCell, Input, Dialog, Alert } from './components/ui';
import { generateMarketingMessage } from './services/geminiService';
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

// --- Dashboard View ---
const DashboardView = () => {
  const data = [
    { name: 'Mon', calls: 4, sales: 2400 },
    { name: 'Tue', calls: 3, sales: 1398 },
    { name: 'Wed', calls: 9, sales: 9800 },
    { name: 'Thu', calls: 2, sales: 3908 },
    { name: 'Fri', calls: 6, sales: 4800 },
    { name: 'Sat', calls: 10, sales: 3800 },
    { name: 'Sun', calls: 5, sales: 4300 },
  ];

  const pieData = [
    { name: 'Champion', value: 400, color: '#0052FF' },
    { name: 'Loyal', value: 300, color: '#4C82FF' },
    { name: 'At Risk', value: 300, color: '#FFB02E' },
    { name: 'Lost', value: 200, color: '#CFD9E0' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
              <DollarSign className="text-primary w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">฿1,250,400</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5% vs last month
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
              <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
              <h3 className="text-2xl font-bold text-gray-900">14</h3>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <AlertCircle className="w-3 h-3 mr-1" /> 3 Overdue
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
              <p className="text-sm font-medium text-gray-500">Auto-Generated</p>
              <h3 className="text-2xl font-bold text-gray-900">85</h3>
              <p className="text-xs text-gray-500 mt-1">
                Tasks created by AI this week
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle>Sales & Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip 
                   cursor={{fill: '#F1F5F9'}}
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="sales" fill="#0052FF" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle>Customer Segmentation (RFM)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
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
const CustomersView = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsGenerating(true);
    setAiMessage('');
    
    // Call the mock Gemini service
    const msg = await generateMarketingMessage(customer.name, customer.segment, customer.lastPurchaseDate);
    
    setAiMessage(msg);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
           <p className="text-gray-500">Manage your client base and view RFM insights.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="gap-2">
             <Filter className="w-4 h-4" /> Filter
           </Button>
           <Button variant="outline" size="sm" className="gap-2">
             <Download className="w-4 h-4" /> Export
           </Button>
           <Button className="gap-2">
             <Plus className="w-4 h-4" /> Add Customer
           </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>RFM Segment</TableHead>
              <TableHead>Last Purchase</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {MOCK_CUSTOMERS.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-xs text-gray-500">{customer.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    customer.segment === RFMSegment.CHAMPION ? 'success' :
                    customer.segment === RFMSegment.AT_RISK ? 'warning' :
                    customer.segment === RFMSegment.NEW ? 'default' : 'default'
                  }>
                    {customer.segment}
                  </Badge>
                </TableCell>
                <TableCell>{customer.lastPurchaseDate}</TableCell>
                <TableCell>฿{customer.totalSpent.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                     <Button 
                       variant="secondary" 
                       size="sm" 
                       className="h-8 w-8 p-0 rounded-full"
                       title="Generate AI Message"
                       onClick={() => handleGenerateAI(customer)}
                     >
                       <Sparkles className="w-4 h-4 text-purple-600" />
                     </Button>
                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                       <MoreHorizontal className="w-4 h-4" />
                     </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* AI Message Modal/Drawer Simulation */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
             <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-purple-600" />
                   AI Marketing Assistant
                </CardTitle>
                <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600">✕</button>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                 <p className="text-sm font-medium text-gray-700">Context:</p>
                 <ul className="text-xs text-gray-500 list-disc ml-4 space-y-1">
                   <li>Name: {selectedCustomer.name}</li>
                   <li>Segment: {selectedCustomer.segment} (RFM)</li>
                   <li>Last Visit: {selectedCustomer.lastPurchaseDate}</li>
                 </ul>
               </div>

               {isGenerating ? (
                 <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                   <p className="text-sm">Gemini is thinking...</p>
                 </div>
               ) : (
                 <div className="space-y-3">
                   <label className="text-sm font-medium text-gray-700">Generated Message:</label>
                   <textarea 
                     className="w-full h-24 p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                     value={aiMessage}
                     readOnly
                   />
                   <div className="flex gap-2">
                     <Button className="flex-1 gap-2" variant="primary">
                       <MessageSquare className="w-4 h-4" /> Send LINE
                     </Button>
                     <Button className="flex-1 gap-2" variant="outline">
                       <Phone className="w-4 h-4" /> Send SMS
                     </Button>
                   </div>
                 </div>
               )}
             </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- Super Admin View ---
const SuperAdminView = () => {
  return (
    <div className="space-y-6">
       <div className="bg-slate-900 text-white p-8 rounded-2xl mb-8 relative overflow-hidden">
         <div className="relative z-10">
           <h2 className="text-3xl font-bold mb-2">Super Admin Console</h2>
           <p className="text-slate-400">System-wide monitoring and tenant management.</p>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
               <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Tenants</p>
               <h3 className="text-2xl font-bold mt-1">{MOCK_TENANTS.length}</h3>
            </CardContent>
          </Card>
          <Card>
             <CardContent className="p-4">
               <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Active MRR</p>
               <h3 className="text-2xl font-bold mt-1">฿45,000</h3>
            </CardContent>
          </Card>
          <Card>
             <CardContent className="p-4">
               <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Users</p>
               <h3 className="text-2xl font-bold mt-1">17</h3>
            </CardContent>
          </Card>
          <Card>
             <CardContent className="p-4">
               <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">System Health</p>
               <h3 className="text-2xl font-bold mt-1 text-green-500">99.9%</h3>
            </CardContent>
          </Card>
       </div>

       <Card>
         <CardHeader>
           <CardTitle>Tenants (SMEs)</CardTitle>
         </CardHeader>
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>ID</TableHead>
               <TableHead>Tenant Name</TableHead>
               <TableHead>Status</TableHead>
               <TableHead>Users</TableHead>
               <TableHead>Customers</TableHead>
               <TableHead className="text-right">Actions</TableHead>
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

// --- Tasks View ---
const TasksView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tasks & Automation</h2>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Create Task</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Automation Rules Card (Simplified) */}
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
           <CardHeader>
             <CardTitle className="text-blue-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Active Workflows
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-3">
               <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Coffee Bean Refill Reminder</span>
                  </div>
                  <Badge variant="default">Auto-Call</Badge>
               </div>
               <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Birthday Promo (Champion)</span>
                  </div>
                  <Badge variant="default">Auto-LINE</Badge>
               </div>
               <Button variant="ghost" size="sm" className="w-full text-blue-600 mt-2">Manage Workflows</Button>
             </div>
           </CardContent>
        </Card>

        {/* Manual Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {MOCK_TASKS.map(task => (
                  <div key={task.id} className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                     <div className="flex items-start gap-3">
                        <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center ${task.status === 'Completed' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                           {task.status === 'Completed' && <CheckSquare className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</p>
                          <p className="text-xs text-gray-500 mt-1">For: {task.customerName} • Due {task.dueDate}</p>
                        </div>
                     </div>
                     <Badge variant={task.status === 'Overdue' ? 'danger' : 'default'}>{task.type}</Badge>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
);

// --- Authenticated App Container ---
const DashboardApp = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <DashboardView />;
      case 'customers': return <CustomersView />;
      case 'tasks': return <TasksView />;
      case 'superadmin': return <SuperAdminView />;
      case 'settings': return <div className="p-10 text-center text-gray-500">Settings View (Coming Soon)</div>;
      default: return <div className="p-10 text-center text-gray-500">Coming Soon</div>;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

// --- Main App Entry ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin' && password === '1234') {
        setIsAuthenticated(true);
        setIsLoginModalOpen(false);
        // Reset form
        setEmail('');
        setPassword('');
      } else {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง (ลองใช้: admin / 1234)');
      }
      setIsLoading(false);
    }, 1000);
  };

  if (isAuthenticated) {
    return <DashboardApp />;
  }

  return (
    <>
      <LandingPage onLoginClick={() => setIsLoginModalOpen(true)} />
      
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
         <div className="flex flex-col space-y-4">
           <div className="text-center">
             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
               <Lock className="w-6 h-6 text-primary" />
             </div>
             <h2 className="text-xl font-bold text-gray-900">ยินดีต้อนรับกลับมา</h2>
             <p className="text-sm text-gray-500 mt-1">เข้าสู่ระบบเพื่อจัดการลูกค้าของคุณ</p>
           </div>
           
           <form onSubmit={handleLogin} className="space-y-4">
             {error && (
               <Alert variant="destructive" className="flex items-center gap-2">
                 <AlertCircle className="w-4 h-4" />
                 {error}
               </Alert>
             )}
             
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">อีเมล</label>
               <Input 
                 type="text" 
                 placeholder="name@company.com" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700">รหัสผ่าน</label>
               <Input 
                 type="password" 
                 placeholder="••••••••" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
             </div>
             
             <Button type="submit" className="w-full mt-2" disabled={isLoading}>
               {isLoading ? (
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   กำลังเข้าสู่ระบบ...
                 </div>
               ) : 'เข้าสู่ระบบ'}
             </Button>

             <div className="text-center text-xs text-gray-400 mt-4">
               Demo Account: admin / 1234
             </div>
           </form>
         </div>
      </Dialog>
    </>
  );
}