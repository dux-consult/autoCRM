import React, { useState } from 'react';
import { ViewState } from '../types';
import { useAuth } from '../src/contexts/AuthContext';
import { useLanguage } from '../src/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LayoutDashboard, Users, CheckSquare, Shield, Settings, Menu, Bell, Search, Command, Package, Receipt, Workflow, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  children: React.ReactNode;
}

const NavItem = ({
  icon: Icon,
  label,
  isActive,
  onClick,
  collapsed
}: {
  icon: any,
  label: string,
  isActive: boolean,
  onClick: () => void,
  collapsed?: boolean
}) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`flex items-center w-full gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
      ? 'bg-primary/10 text-primary'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } ${collapsed ? 'justify-center px-3' : ''}`}
  >
    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
    {!collapsed && <span className="truncate">{label}</span>}
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, onViewChange, children }) => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4F6F8]">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-gray-100 ${collapsed ? 'justify-center' : 'px-6'}`}>
          <div className={`flex items-center ${collapsed ? 'gap-0' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Command className="text-white w-6 h-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col -space-y-0.5">
                <span className="text-xl font-bold text-gray-900 tracking-tight">SARN</span>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Auto CRM</span>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          )}
        </button>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem
            icon={LayoutDashboard}
            label={t('dashboard')}
            isActive={currentView === 'dashboard'}
            onClick={() => { onViewChange('dashboard'); setMobileOpen(false); }}
            collapsed={collapsed}
          />
          <NavItem
            icon={Users}
            label={t('customers')}
            isActive={currentView === 'customers'}
            onClick={() => { onViewChange('customers'); setMobileOpen(false); }}
            collapsed={collapsed}
          />
          <NavItem
            icon={Package}
            label={t('products')}
            isActive={currentView === 'products'}
            onClick={() => { onViewChange('products'); setMobileOpen(false); }}
            collapsed={collapsed}
          />
          <NavItem
            icon={Receipt}
            label={t('transactions')}
            isActive={currentView === 'transactions'}
            onClick={() => { onViewChange('transactions'); setMobileOpen(false); }}
            collapsed={collapsed}
          />
          <NavItem
            icon={CheckSquare}
            label={t('tasks')}
            isActive={currentView === 'tasks'}
            onClick={() => { onViewChange('tasks'); setMobileOpen(false); }}
            collapsed={collapsed}
          />
          <NavItem
            icon={Workflow}
            label={t('automation')}
            isActive={currentView === 'automation'}
            onClick={() => { onViewChange('automation'); setMobileOpen(false); }}
            collapsed={collapsed}
          />

          {!collapsed && (
            <div className="pt-8 pb-2">
              <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('administration')}</span>
            </div>
          )}
          {collapsed && <div className="pt-4 border-t border-gray-100 mt-4" />}

          <NavItem
            icon={Shield}
            label={t('superAdmin')}
            isActive={currentView === 'superadmin'}
            onClick={() => { onViewChange('superadmin'); setMobileOpen(false); }}
            collapsed={collapsed}
          />
          <NavItem
            icon={Settings}
            label={t('settings')}
            isActive={currentView === 'settings'}
            onClick={() => { onViewChange('settings'); setMobileOpen(false); }}
            collapsed={collapsed}
          />
        </nav>

        {/* User Info */}
        <div className={`p-4 border-t border-gray-100 ${collapsed ? 'px-2' : ''}`}>
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.email?.split('@')[0] || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('signOut')}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold cursor-pointer"
                title={user?.email}
              >
                {user?.email?.[0].toUpperCase() || 'U'}
              </div>
              <button
                onClick={() => signOut()}
                title={t('signOut')}
                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="hidden md:flex flex-1 max-w-lg ml-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="w-full h-10 pl-10 pr-4 text-sm bg-gray-100 border-none rounded-full focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};
