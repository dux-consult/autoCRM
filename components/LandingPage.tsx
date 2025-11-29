import React, { useState } from 'react';
import { Button } from './ui';
import { Menu, X, Check, ArrowRight, Database, Zap, MessageCircle, Users, BarChart, Lock, ChevronRight, Command } from 'lucide-react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegisterClick }) => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Command className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="text-xl font-bold text-slate-900 tracking-tight">SARN</span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Auto CRM</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">{t('features')}</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">{t('pricing')}</a>
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">{t('aboutUs')}</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="ghost" onClick={onLoginClick}>{t('login')}</Button>
            <Button onClick={onRegisterClick}>{t('register')}</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <button className="p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-4 shadow-lg absolute w-full">
            <a href="#features" className="block text-sm font-medium text-slate-600">{t('features')}</a>
            <a href="#pricing" className="block text-sm font-medium text-slate-600">{t('pricing')}</a>
            <div className="pt-4 flex flex-col gap-3">
              <Button variant="outline" className="w-full justify-center" onClick={onLoginClick}>{t('login')}</Button>
              <Button className="w-full justify-center" onClick={onRegisterClick}>{t('register')}</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            {t('heroTitle1')} <span className="text-primary">{t('heroTitle2')}</span><br />
            {t('heroTitle3')}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {t('heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto" onClick={onRegisterClick}>
              {t('tryFree')}
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto group">
              {t('watchVideo')} <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Visual Placeholder */}
          <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl bg-slate-50 border border-slate-200 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-white opacity-50"></div>
            {/* Abstract UI representation */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 p-12 w-full max-w-4xl opacity-80 group-hover:scale-105 transition-transform duration-700">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><Users className="text-primary" /></div>
                <div className="h-2 w-24 bg-slate-100 rounded"></div>
                <div className="h-2 w-32 bg-slate-100 rounded"></div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-4 mt-12">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><Zap className="text-green-600" /></div>
                <div className="h-2 w-24 bg-slate-100 rounded"></div>
                <div className="h-2 w-32 bg-slate-100 rounded"></div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center"><MessageCircle className="text-purple-600" /></div>
                <div className="h-2 w-24 bg-slate-100 rounded"></div>
                <div className="h-2 w-32 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section (Pain Points) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('painPoint1Title')}</h3>
              <p className="text-slate-500 leading-relaxed">{t('painPoint1Desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('painPoint2Title')}</h3>
              <p className="text-slate-500 leading-relaxed">{t('painPoint2Desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('painPoint3Title')}</h3>
              <p className="text-slate-500 leading-relaxed">{t('painPoint3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-24">

          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider">
                Easy Import
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">{t('feature1Title')}</h2>
              <p className="text-lg text-slate-500">
                {t('feature1Desc')}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-green-600" /></div>
                  {t('feature1Point1')}
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-green-600" /></div>
                  {t('feature1Point2')}
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-slate-100 rounded-2xl p-8 aspect-video flex items-center justify-center shadow-inner">
              <Database className="w-24 h-24 text-slate-300" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wider">
                Automation Wizard
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">{t('feature2Title')}</h2>
              <p className="text-lg text-slate-500">
                {t('feature2Desc')}
              </p>
            </div>
            <div className="flex-1 bg-slate-100 rounded-2xl p-8 aspect-video flex items-center justify-center shadow-inner">
              <Zap className="w-24 h-24 text-slate-300" />
            </div>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#F4F6F8] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('pricingTitle')}</h2>
            <p className="text-slate-500">{t('pricingDesc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <div className="mb-4">
                <span className="font-bold text-lg">{t('starter')}</span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">{t('free')}</span>
                <span className="text-slate-500 ml-2">{t('lifetime')}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> {t('starterPoint1')}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> {t('starterPoint2')}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> {t('starterPoint3')}
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={onRegisterClick}>{t('startFree')}</Button>
            </div>

            {/* SME Pro */}
            <div className="bg-white rounded-2xl p-8 border-2 border-primary shadow-xl relative flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                {t('recommended')}
              </div>
              <div className="mb-4">
                <span className="font-bold text-lg text-primary">{t('smePro')}</span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">{t('priceMonthly')}</span>
                <span className="text-slate-500 ml-2">{t('perMonth')}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-primary shrink-0" /> {t('smePoint1')}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-primary shrink-0" /> {t('smePoint2')}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-primary shrink-0" /> {t('smePoint3')}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-primary shrink-0" /> {t('smePoint4')}
                </li>
              </ul>
              <Button className="w-full" onClick={onRegisterClick}>{t('subscribeNow')}</Button>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <div className="mb-4">
                <span className="font-bold text-lg">{t('enterprise')}</span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">{t('contactUs')}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> {t('enterprisePoint1')}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> {t('enterprisePoint2')}
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> {t('enterprisePoint3')}
                </li>
              </ul>
              <Button variant="outline" className="w-full">{t('contactSales')}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Command className="text-white w-4 h-4" />
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="font-bold text-slate-900 leading-none">SARN</span>
              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase leading-none">Auto CRM</span>
            </div>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-primary">{t('terms')}</a>
            <a href="#" className="hover:text-primary">{t('privacy')}</a>
            <a href="#" className="hover:text-primary">{t('help')}</a>
          </div>
          <p className="text-sm text-slate-400">{t('copyright')}</p>
        </div>
      </footer>
    </div>
  );
};