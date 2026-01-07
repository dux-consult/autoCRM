import React, { useState } from 'react';
import { Button } from './ui';
import { Menu, X, Command, Check, Wind, Wrench, ClipboardList, ArrowRight, PawPrint, Sparkles } from 'lucide-react';
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
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Navbar */}
            <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                            <Command className="text-white w-6 h-6" />
                        </div>
                        <div className="flex flex-col -space-y-0.5">
                            <span className="text-xl font-bold text-slate-900 tracking-tight">SARN</span>
                            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Auto CRM</span>
                        </div>
                    </div>

                    {/* Desktop Menu - Content Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                            คุณสมบัติ
                        </a>
                        <a href="#challenges" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                            ปัญหาที่พบบ่อย
                        </a>
                        <a href="#use-cases" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                            ตัวอย่างการใช้งาน
                        </a>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <LanguageSwitcher />
                        <Button onClick={onLoginClick} variant="ghost" size="sm">
                            {t('login')}
                        </Button>
                        <Button onClick={onRegisterClick} size="sm" className="bg-blue-600 hover:bg-blue-700">
                            ทดลองใช้ฟรี
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
                            คุณสมบัติ
                        </a>
                        <a href="#challenges" className="block w-full text-left text-sm font-medium text-slate-600">
                            ปัญหาที่พบบ่อย
                        </a>
                        <a href="#use-cases" className="block w-full text-left text-sm font-medium text-slate-600">
                            ตัวอย่างการใช้งาน
                        </a>
                        <div className="pt-4 flex flex-col gap-3">
                            <Button variant="outline" className="w-full justify-center" onClick={onLoginClick}>{t('login')}</Button>
                            <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700" onClick={onRegisterClick}>ทดลองใช้ฟรี</Button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50 opacity-60"></div>
                <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl"></div>

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
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">ปัญหาที่ธุรกิจแอร์มักพบ</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">จัดการงานซ่อม/ล้างให้เป็นระบบ ลูกค้าประทับใจ</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-2xl">😵‍💫</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">จำไม่ได้ว่าลูกค้าคนไหนถึงรอบล้างแอร์</h3>
                                    <p className="text-slate-600 leading-relaxed">ข้อมูลอยู่ในกระดาษ หรือ Excel ที่ไม่อัปเดต ทำให้เสียโอกาสในการขายบริการซ้ำ</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">นัดหมายซ้อนทับ ช่างไปผิดที่</h3>
                                    <p className="text-slate-600 leading-relaxed">สื่อสารผ่านไลน์กลุ่ม ข้อมูลตกหล่น ช่างไปผิดเวลานัด หรือรับงานซ้อนกันโดยไม่รู้ตัว</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-2xl">❓</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">ไม่รู้ประวัติการซ่อมเดิม</h3>
                                    <p className="text-slate-600 leading-relaxed">ลูกค้าแจ้งว่าแอร์เสียตัวเดิม แต่จำไม่ได้ว่าเคยซ่อมอะไรไปบ้าง อาการเดิมหรือเปล่า</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-2xl">📉</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">รายได้ไม่แน่นอน</h3>
                                    <p className="text-slate-600 leading-relaxed">รอลูกค้าโทรมาเรียกอย่างเดียว ไม่มีการรุกตลาดหาลูกค้าเก่า</p>
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
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">SARN ช่วยจัดการงานบริการอย่างไร</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">ระบบที่คิดมาเพื่อทีมงานบริการและงานช่างโดยเฉพาะ</p>
                    </div>
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border border-blue-100">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                <Wind className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">แจ้งเตือนล้างแอร์อัตโนมัติ</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    ระบบบันทึกวันที่ติดตั้งหรือล้างล่าสุด และ
                                    <strong className="text-blue-600"> แจ้งเตือนลูกค้าอัตโนมัติเมื่อครบ 6 เดือน</strong> ทาง LINE/SMS เพิ่มยอดขายบริการซ้ำได้ทันที
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-gradient-to-br from-cyan-50 to-white p-8 rounded-3xl border border-cyan-100">
                            <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center shrink-0">
                                <Wrench className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">ติดตามสถานะงานซ่อม Real-time</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    เปิด Job งานในระบบ มอบหมายช่าง ติดตามสถานะ (รอเข้าซ่อม, กำลังซ่อม, เสร็จสิ้น) ง่ายๆผ่านมือถือ
                                    <strong className="text-cyan-600"> ลูกค้าเช็คสถานะได้เอง ลดการโทรตามงาน</strong>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-200">
                            <div className="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center shrink-0">
                                <ClipboardList className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">ประวัติการซ่อมครบถ้วน</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    ช่างสามารถดูประวัติย้อนหลังได้ว่าแอร์ตัวนี้เคยซ่อมอะไรไป เปลี่ยนอะไหล่ตัวไหน
                                    <strong className="text-slate-600"> วิเคราะห์อาการเสียได้แม่นยำขึ้น ดูเป็นมืออาชีพ</strong>
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
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">ตัวอย่างการใช้งานจริง</h2>
                        <p className="text-lg text-slate-600">ยกระดับงานบริการของคุณให้เหนือกว่าคู่แข่ง</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                <h4 className="font-bold text-blue-900">สถานการณ์: ลูกค้าถามว่า "ล้างแอร์ครั้งล่าสุดเมื่อไหร่?"</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="text-red-500 font-bold">❌</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">แบบเก่า:</p>
                                        <p className="text-slate-600">ต้องเดา หรือไปค้นใบเสร็จเล่มเก่า เสียเวลาหา ไม่แน่ใจข้อมูล</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-green-500 font-bold">✅</span>
                                    <div>
                                        <p className="font-semibold text-blue-600">ใช้ SARN:</p>
                                        <p className="text-slate-600">พิมพ์ชื่อลูกค้า หรือเบอร์โทร เจอประวัติทันที พร้อมบอกวันครบกำหนดล้างรอบถัดไป</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="bg-cyan-50 rounded-xl p-4 mb-6">
                                <h4 className="font-bold text-cyan-900">สถานการณ์: ช่างลาป่วยกะทันหัน แต่มีนัดลูกค้าไว้</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="text-red-500 font-bold">❌</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">แบบเก่า:</p>
                                        <p className="text-slate-600">วุ่นวาย โทรเลื่อนลูกค้า หรือหาช่างอื่นแทนมั่วไปหมด ข้อมูลไม่อัปเดต</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-green-500 font-bold">✅</span>
                                    <div>
                                        <p className="font-semibold text-cyan-600">ใช้ SARN:</p>
                                        <p className="text-slate-600">ดูตารางงานรวม เลือกช่างคนอื่นที่ว่างในช่วงเวลานั้นแทนได้ทันที หรือส่ง SMS แจ้งเลื่อนนัดลูกค้าได้จากระบบ</p>
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
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50" onClick={onRegisterClick}>
                            {t('tryFree')}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto border-white text-white hover:bg-white/10" onClick={onLoginClick}>
                            {t('login')}
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
