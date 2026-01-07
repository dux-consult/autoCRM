import React, { useState } from 'react';
import { Button } from './ui';
import { Menu, X, Command, Check, Scissors, Calendar, Heart, ArrowRight, PawPrint, Sparkles } from 'lucide-react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface PetShopPageProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
    onNavigateHome: () => void;
    onNavigateAirService: () => void;
}

export const PetShopPage: React.FC<PetShopPageProps> = ({
    onLoginClick,
    onRegisterClick,
    onNavigateHome,
    onNavigateAirService
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
                        <Button onClick={onRegisterClick} size="sm" className="bg-pink-600 hover:bg-pink-700">
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
                        <button onClick={onNavigateHome} className="block w-full text-left text-sm font-medium text-slate-600">
                            หน้าแรก
                        </button>
                        <button onClick={onNavigateAirService} className="block w-full text-left text-sm font-medium text-slate-600">
                            โซลูชั่นอื่นๆ
                        </button>
                        <div className="pt-4 flex flex-col gap-3">
                            <Button variant="outline" className="w-full justify-center" onClick={onLoginClick}>{t('login')}</Button>
                            <Button className="w-full justify-center bg-pink-600 hover:bg-pink-700" onClick={onRegisterClick}>ทดลองใช้ฟรี →</Button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 opacity-60"></div>
                <div className="absolute top-20 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>

                <div className="relative max-w-5xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-pink-200 shadow-sm">
                        <PawPrint className="w-4 h-4 text-pink-600 mr-2" />
                        <span className="text-sm font-semibold text-pink-600">{t('petShopSolution')}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
                        {t('petShopHeroTitle')}
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        {t('petShopHeroDesc')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-pink-600 hover:bg-pink-700" onClick={onRegisterClick}>
                            {t('tryFree')}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto" onClick={onLoginClick}>
                            {t('login')}
                        </Button>
                    </div>

                    {/* Hero Visual */}
                    <div className="mt-16 relative mx-auto max-w-4xl">
                        <div className="aspect-[16/10] rounded-3xl bg-gradient-to-br from-white to-pink-50 border-2 border-pink-100 shadow-2xl p-8 flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-100 flex flex-col items-center gap-3 transform hover:scale-105 transition-transform">
                                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                                        <PawPrint className="w-6 h-6 text-pink-600" />
                                    </div>
                                    <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                    <div className="h-2 w-20 bg-slate-100 rounded"></div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 flex flex-col items-center gap-3 transform hover:scale-105 transition-transform">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Scissors className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                    <div className="h-2 w-20 bg-slate-100 rounded"></div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 flex flex-col items-center gap-3 transform hover:scale-105 transition-transform">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-blue-600" />
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
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-wider">
                                POS System
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{t('petShopFeature1Title')}</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {t('petShopFeature1Desc')}
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    บริการตัดขน อาบน้ำ ฝากเลี้ยง
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    รองรับเงินสด โอน บัตรเครดิต
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-12 aspect-square flex items-center justify-center shadow-inner">
                            <Heart className="w-32 h-32 text-pink-300" />
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wider">
                                Booking
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{t('petShopFeature2Title')}</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {t('petShopFeature2Desc')}
                            </p>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-12 aspect-square flex items-center justify-center shadow-inner">
                            <Scissors className="w-32 h-32 text-purple-300" />
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                                Pet History
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{t('petShopFeature3Title')}</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {t('petShopFeature3Desc')}
                            </p>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-blue-50 to-pink-50 rounded-3xl p-12 aspect-square flex items-center justify-center shadow-inner">
                            <PawPrint className="w-32 h-32 text-blue-300" />
                        </div>
                    </div>

                </div>
            </section>

            {/* Business Challenges Section */}
            <section id="challenges" className="py-24 px-6 bg-gradient-to-b from-white to-pink-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">ปัญหาที่ร้านสัตว์เลี้ยงมักพบ</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">เข้าใจทุกปัญหา เพราะเราออกแบบมาเพื่อธุรกิจแบบคุณโดยเฉพาะ</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-pink-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-2xl">😰</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">จำไม่ได้ว่าสัตว์เลี้ยงตัวไหนฉีดวัคซีนหรือยัง</h3>
                                    <p className="text-slate-600 leading-relaxed">มีลูกค้าหลายร้อยคน แต่ละคนมีหมาแมวหลายตัว จดในสมุดก็หาไม่เจอ บางทีพลาดนัดหมายเพราะลืม</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-pink-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">คิวอาบน้ำ-ตัดขนซ้ำซ้อน</h3>
                                    <p className="text-slate-600 leading-relaxed">ลูกค้าโทรมาจองคิว บันทึกไว้ในโน้ต พอถึงวันงานกลับมีคิวชนกัน ช่างไม่พอ ลูกค้าก็ไม่พอใจ</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-pink-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-2xl">💸</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">ลูกค้าเก่าหาย ต้องหาลูกค้าใหม่ตลอด</h3>
                                    <p className="text-slate-600 leading-relaxed">ลูกค้ามาซื้อของแล้วก็หายไป ไม่รู้จะติดตามยังไง ต้องใช้เงินโฆษณาหาลูกค้าใหม่ตลอด แพงมาก</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border border-pink-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-slate-900">สต็อกหมด ลูกค้าผิดหวัง</h3>
                                    <p className="text-slate-600 leading-relaxed">อาหารสุนัข/แมวหมดสต็อกกะทันหัน ลูกค้าจะซื้อแต่ไม่มีของ ต้องขอโทษ จำไม่ได้ว่าของอะไรใกล้หมด</p>
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
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">SARN แก้ปัญหาไได้อย่างไร</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">จากกระดาษและสมุดจด มาสู่ระบบดิจิทัลที่ช่วยให้ธุรกิจเติบโตได้</p>
                    </div>
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-pink-50 to-white p-8 rounded-3xl border border-pink-100">
                            <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center shrink-0">
                                <PawPrint className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">บันทึกประวัติสัตว์เลี้ยงครบถ้วน</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    บันทึกข้อมูลสัตว์เลี้ยงของแต่ละครอบครัว รวมถึงวันที่ฉีดวัคซีน การรักษา อาหารที่ชอบ พฤติกรรม ความแพ้ต่างๆ
                                    <strong className="text-pink-600"> ระบบจะแจ้งเตือนอัตโนมัติเมื่อถึงเวลาฉีดวัคซีนตัวถัดไป</strong> ไม่พลาด ลูกค้าประทับใจ
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-gradient-to-br from-purple-50 to-white p-8 rounded-3xl border border-purple-100">
                            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                                <Calendar className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">จัดการคิวอาบน้ำ-ตัดขนแบบมืออาชีพ</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    ลูกค้าสามารถจองคิวผ่านระบบได้ คุณดูปฏิทินได้ชัดเจนว่าวันไหนว่างหรือเต็ม จัดตารางช่างได้ง่าย
                                    <strong className="text-purple-600"> ระบบส่ง SMS/LINE แจ้งเตือนลูกค้าอัตโนมัติก่อนถึงนัด 1 วัน</strong> ลดงานของพนักงาน ลูกค้าไม่ลืมนัด
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border border-blue-100">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">สร้างความสัมพันธ์กับลูกค้าระยะยาว</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    ระบบจะแจ้งเตือนเมื่อลูกค้าไม่ได้มาซื้อของนานเกินไป หรือเมื่อถึงวันเกิดของสัตว์เลี้ยง คุณสามารถส่งโปรโมชั่นพิเศษ
                                    <strong className="text-blue-600"> ทำให้ลูกค้ารู้สึกว่าคุณใส่ใจ กลับมาซื้อซ้ำได้มากขึ้น</strong>
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
                        <p className="text-lg text-slate-600">เห็นภาพชัดเจนว่า SARN จะช่วยธุรกิจคุณได้อย่างไร</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="bg-pink-50 rounded-xl p-4 mb-6">
                                <h4 className="font-bold text-pink-900">สถานการณ์: ลูกค้าโทรมาถามว่าหมาฉีดวัคซีนครั้งสุดท้ายเมื่อไหร่</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="text-red-500 font-bold">❌</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">แบบเก่า:</p>
                                        <p className="text-slate-600">ต้องไปค้นหาในสมุด อาจจะหาไม่เจอ บอกไม่ได้ ลูกค้าก็ไม่พอใจ</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-green-500 font-bold">✅</span>
                                    <div>
                                        <p className="font-semibold text-pink-600">ใช้ SARN:</p>
                                        <p className="text-slate-600">เปิดระบบ ค้นหาชื่อลูกค้า เห็นประวัติสังว์เลี้ยงทั้งหมดทันทีท วันที่ ยี่ห้อวัคซีน ครบถ้วน</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="bg-purple-50 rounded-xl p-4 mb-6">
                                <h4 className="font-bold text-purple-900">สถานการณ์: อยากส่งโปรโมชั่นอาหารสุนัขลดราคา แต่ไม่รู้จะส่งให้ใคร</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="text-red-500 font-bold">❌</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">แบบเก่า:</p>
                                        <p className="text-slate-600">โพสต์ในเฟซบุ๊ค หวังว่าคนจะเห็น ส่วนใหญ่ไม่เห็น ของก็ขายไม่หมด</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-green-500 font-bold">✅</span>
                                    <div>
                                        <p className="font-semibold text-purple-600">ใช้ SARN:</p>
                                        <p className="text-slate-600">กรองลูกค้าที่เคยซื้ออาหารสุนัขยี่ห้อนี้ ส่งข้อความ LINE ไปหาทุกคนอัตโนมัติ ขายหมดในวันเดียว</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                <h4 className="font-bold text-blue-900">สถานการณ์: ช่างตัดขนวันนี้ไม่ว่าง แต่มีคนจองไว้ 3 คิว</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="text-red-500 font-bold">❌</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">แบบเก่า:</p>
                                        <p className="text-slate-600">พึ่งรู้ตอนเช้า ต้องโทรไปบอกลูกค้าทีละคน นัดใหม่ ลูกค้าโกรธ</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-green-500 font-bold">✅</span>
                                    <div>
                                        <p className="font-semibold text-blue-600">ใช้ SARN:</p>
                                        <p className="text-slate-600">เห็นปฏิทินชัดเจนว่าช่างคนไหนว่างหรือเต็ม สามารถเลื่อนคิวในระบบได้ทันที ส่ง SMS แจ้งลูกค้าอัตโนมัติ</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="bg-green-50 rounded-xl p-4 mb-6">
                                <h4 className="font-bold text-green-900">สถานการณ์: ลูกค้ามาซื้อของทุกเดือน แต่เดือนนี้ยังไม่มา</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="text-red-500 font-bold">❌</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">แบบเก่า:</p>
                                        <p className="text-slate-600">ไม่รู้เลยว่าลูกค้าหาย อาจจะไปซืับที่อื่นแล้ว</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-green-500 font-bold">✅</span>
                                    <div>
                                        <p className="font-semibold text-green-600">ใช้ SARN:</p>
                                        <p className="text-slate-600">ระบบแจ้งเตือนว่ามีลูกค้าที่ควรติดตาม ส่งข้อความถามทักทาย ลูกค้ากลับมาซื้อต่อ</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-pink-600 to-purple-600">\n                <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                    {t('petShopCtaTitle')}
                </h2>
                <p className="text-xl text-pink-100 max-w-2xl mx-auto">
                    {t('petShopCtaDesc')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-white text-pink-600 hover:bg-pink-50" onClick={onRegisterClick}>
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
