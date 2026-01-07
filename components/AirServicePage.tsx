import React, { useState } from 'react';
import { Button } from './ui';
import { Menu, X, Command, Check, Wind, Wrench, ClipboardList, ArrowRight, PawPrint, Sparkles, TrendingUp, BarChart } from 'lucide-react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface AirServicePageProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
    onNavigateHome: () => void;
    onNavigatePetShop: () => void;
}

export const AirServicePage: React.FC<AirServicePageProps> = ({
    onLoginClick,
    onRegisterClick,
    onNavigateHome,
    onNavigatePetShop
}) => {
    const { t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
            <style>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float-slow {
                    animation: float-slow 6s ease-in-out infinite;
                }
            `}</style>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
                    {/* Left: Logo + Category */}
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={onNavigateHome}>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                                <Command className="text-white w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold text-slate-900 tracking-tight">SARN</span>
                        </div>
                        <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
                        <span className="text-sm font-bold text-blue-600 hidden sm:block">{t('navForAirService')}</span>
                    </div>

                    {/* Center: Navigation (Truly Centered) */}
                    <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            {t('features')}
                        </a>
                        <a href="#challenges" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            {t('navChallenges')}
                        </a>
                        <a href="#use-cases" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            {t('navUseCases')}
                        </a>
                    </div>

                    {/* Right: Actions (Lang + CTA) - No Login */}
                    <div className="hidden md:flex items-center gap-4">
                        <LanguageSwitcher />
                        <Button onClick={onRegisterClick} className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                            {t('tryFree')}
                        </Button>
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
                    <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-4 shadow-lg">
                        <a href="#features" className="block w-full text-left text-sm font-medium text-slate-600">
                            {t('features')}
                        </a>
                        <a href="#challenges" className="block w-full text-left text-sm font-medium text-slate-600">
                            {t('navChallenges')}
                        </a>
                        <a href="#use-cases" className="block w-full text-left text-sm font-medium text-slate-600">
                            {t('navUseCases')}
                        </a>
                        <div className="pt-4 flex flex-col gap-3">
                            <Button variant="outline" className="w-full justify-center" onClick={onLoginClick}>{t('login')}</Button>
                            <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700" onClick={onRegisterClick}>{t('startFreeTrial')}</Button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-40 px-6 overflow-hidden">
                {/* Modern Background */}
                <div className="absolute inset-0 bg-white">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0f2fe_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
                    <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/40 rounded-full blur-[100px] animate-float-slow"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200/40 rounded-full blur-[100px] animate-float-slow" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative max-w-5xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-blue-200 shadow-sm">
                        <Wind className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-semibold text-blue-600">{t('airServiceSolution')}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                        {t('airServiceHeroTitle')}
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        {t('airServiceHeroDesc')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-blue-600 hover:bg-blue-700" onClick={onRegisterClick}>
                            {t('tryFree')}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto" onClick={onLoginClick}>
                            {t('login')}
                        </Button>
                    </div>

                    {/* Hero Visual */}
                    <div className="mt-16 relative mx-auto max-w-4xl">
                        <div className="aspect-[16/10] rounded-3xl bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 shadow-2xl p-8 flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 flex flex-col items-center gap-3 transform hover:scale-105 transition-transform">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Wrench className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                    <div className="h-2 w-20 bg-slate-100 rounded"></div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-cyan-100 flex flex-col items-center gap-3 transform hover:scale-105 transition-transform">
                                    <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                                        <Wind className="w-6 h-6 text-cyan-600" />
                                    </div>
                                    <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                    <div className="h-2 w-20 bg-slate-100 rounded"></div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center gap-3 transform hover:scale-105 transition-transform">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                        <ClipboardList className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                    <div className="h-2 w-20 bg-slate-100 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Air Service Trends Section */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                                <TrendingUp className="w-4 h-4" /> {t('airTrendsBadge')}
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">{t('airTrendsTitle')}</h2>
                            <p className="text-slate-600 leading-relaxed">
                                {t('airTrendsDesc')}
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="text-3xl font-bold text-blue-600 mb-1">-20%</div>
                                    <div className="text-sm text-slate-500">{t('airTrendsStat1')}</div>
                                </div>
                                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <div className="text-3xl font-bold text-cyan-600 mb-1">2x</div>
                                    <div className="text-sm text-slate-500">{t('airTrendsStat2')}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10"></div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-slate-700">{t('airTrendsChartSchedule')}</h4>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{t('airTrendsChartOnTime')}</span>
                                    </div>
                                    {[t('airTrendsChartClean'), t('airTrendsChartCheck'), t('airTrendsChartParts')].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-28 text-sm font-bold text-slate-600">{item}</div>
                                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${i === 0 ? 'bg-blue-600 w-[100%]' : i === 1 ? 'bg-blue-400 w-[80%]' : 'bg-blue-300 w-[30%]'}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                    <p className="text-sm text-slate-500">{t('airTrendsCaption')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto space-y-20">

                    {/* Feature 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                                Job Tracking
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{t('airServiceFeature1Title')}</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {t('airServiceFeature1Desc')}
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    สถานะงาน: รอช่าง, กำลังดำเนินงาน, เสร็จสิ้น
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    แจ้งเตือนลูกค้าอัตโนมัติเมื่อมีการอัปเดต
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-12 aspect-square flex items-center justify-center shadow-inner">
                            <Wrench className="w-32 h-32 text-blue-300" />
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 text-xs font-bold uppercase tracking-wider">
                                Maintenance
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{t('airServiceFeature2Title')}</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {t('airServiceFeature2Desc')}
                            </p>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-12 aspect-square flex items-center justify-center shadow-inner">
                            <Wind className="w-32 h-32 text-cyan-300" />
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                Service History
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{t('airServiceFeature3Title')}</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {t('airServiceFeature3Desc')}
                            </p>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-12 aspect-square flex items-center justify-center shadow-inner">
                            <ClipboardList className="w-32 h-32 text-slate-300" />
                        </div>
                    </div>

                </div>
            </section>

            {/* Business Challenges Section */}
            <section id="challenges" className="py-24 px-6 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">{t('airServiceChallengesTitle')}</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t('airServiceChallengesDesc')}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-2xl">😵‍💫</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">{t('airServiceChallenge1Title')}</h3>
                                    <p className="text-slate-600 leading-relaxed">{t('airServiceChallenge1Desc')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">{t('airServiceChallenge2Title')}</h3>
                                    <p className="text-slate-600 leading-relaxed">{t('airServiceChallenge2Desc')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-2xl">❓</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">{t('airServiceChallenge3Title')}</h3>
                                    <p className="text-slate-600 leading-relaxed">{t('airServiceChallenge3Desc')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-2xl">📉</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">{t('airServiceChallenge4Title')}</h3>
                                    <p className="text-slate-600 leading-relaxed">{t('airServiceChallenge4Desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How SARN Helps */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">{t('airServiceSolutionTitle')}</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t('airServiceSolutionDesc')}</p>
                    </div>
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border border-blue-100">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                <Wind className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">{t('airServiceSolution1Title')}</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    {t('airServiceSolution1Desc')}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-gradient-to-br from-cyan-50 to-white p-8 rounded-3xl border border-cyan-100">
                            <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center shrink-0">
                                <Wrench className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">{t('airServiceSolution2Title')}</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    {t('airServiceSolution2Desc')}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-200">
                            <div className="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center shrink-0">
                                <ClipboardList className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">{t('airServiceSolution3Title')}</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    {t('airServiceSolution3Desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section id="use-cases" className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">{t('airServiceUseCasesTitle')}</h2>
                        <p className="text-lg text-slate-600">{t('airServiceUseCasesDesc')}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                <h4 className="font-bold text-blue-900">{t('airServiceUseCase1Title')}</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="text-red-500 font-bold">❌</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">{t('oldWay')}:</p>
                                        <p className="text-slate-600">{t('airServiceUseCase1Old')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-green-500 font-bold">✅</span>
                                    <div>
                                        <p className="font-semibold text-blue-600">{t('useSarn')}:</p>
                                        <p className="text-slate-600">{t('airServiceUseCase1New')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="bg-cyan-50 rounded-xl p-4 mb-6">
                                <h4 className="font-bold text-cyan-900">{t('airServiceUseCase2Title')}</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="text-red-500 font-bold">❌</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">{t('oldWay')}:</p>
                                        <p className="text-slate-600">{t('airServiceUseCase2Old')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-green-500 font-bold">✅</span>
                                    <div>
                                        <p className="font-semibold text-cyan-600">{t('useSarn')}:</p>
                                        <p className="text-slate-600">{t('airServiceUseCase2New')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-cyan-600">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-white">
                        {t('airServiceCtaTitle')}
                    </h2>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        {t('airServiceCtaDesc')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        <Button size="lg" className="h-16 px-8 text-xl w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 rounded-2xl shadow-xl shadow-black/10 hover:shadow-black/20 transition-all hover:-translate-y-1 font-bold" onClick={onRegisterClick}>
                            {t('startFreeTrial')} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-16 px-8 text-xl w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 rounded-2xl transition-all font-bold">
                            {t('viewDemo')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 py-12 text-white">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <Command className="text-slate-900 w-4 h-4" />
                        </div>
                        <div className="flex flex-col -space-y-0.5">
                            <span className="font-bold leading-none">SARN</span>
                            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase leading-none">Auto CRM</span>
                        </div>
                    </div>
                    <div className="flex gap-8 text-sm text-slate-400">
                        <a href="#" className="hover:text-white transition-colors">{t('terms')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('privacy')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('help')}</a>
                    </div>
                    <p className="text-sm text-slate-500">{t('copyright')}</p>
                </div>
            </footer>
        </div>
    );
};
