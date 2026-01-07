import React, { useState } from 'react';
import { Button } from './ui';
import { Menu, X, Check, ArrowRight, Database, Zap, MessageCircle, Users, BarChart, Lock, ChevronRight, Command, Sparkles } from 'lucide-react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onNavigatePetShop?: () => void;
  onNavigateAirService?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginClick,
  onRegisterClick,
  onNavigatePetShop,
  onNavigateAirService
}) => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);

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

            {/* Solutions Dropdown - Click-based with large click area */}
            <div className="relative">
              <button
                onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                className="px-4 py-2 -mx-4 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2"
              >
                {t('solutions')}
                <span className={`text-xs transition-transform duration-200 ${isSolutionsOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {isSolutionsOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsSolutionsOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    {onNavigatePetShop && (
                      <button
                        onClick={() => {
                          onNavigatePetShop();
                          setIsSolutionsOpen(false);
                        }}
                        className="w-full px-5 py-4 text-left hover:bg-pink-50 transition-colors flex items-center gap-4 group"
                      >
                        <span className="text-3xl">🐾</span>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-pink-600 transition-colors">{t('petShopSolution')}</div>
                          <div className="text-xs text-slate-500 mt-0.5">ร้านสัตว์เลี้ยง & บริการ</div>
                        </div>
                      </button>
                    )}
                    {onNavigateAirService && (
                      <button
                        onClick={() => {
                          onNavigateAirService();
                          setIsSolutionsOpen(false);
                        }}
                        className="w-full px-5 py-4 text-left hover:bg-blue-50 transition-colors flex items-center gap-4 group"
                      >
                        <span className="text-3xl">❄️</span>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{t('airServiceSolution')}</div>
                          <div className="text-xs text-slate-500 mt-0.5">ธุรกิจแอร์ & บริการ</div>
                        </div>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

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

            <div className="space-y-3 pl-4 border-l-2 border-slate-100 py-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('solutions')}</div>
              {onNavigatePetShop && (
                <button onClick={onNavigatePetShop} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span>🐾</span> {t('petShopSolution')}
                </button>
              )}
              {onNavigateAirService && (
                <button onClick={onNavigateAirService} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span>❄️</span> {t('airServiceSolution')}
                </button>
              )}
            </div>

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

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-slate-500 mb-8 uppercase tracking-wider font-semibold">ได้รับความไว้วางใจจาก SMEs ทั่วประเทศ</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-slate-400">🏪 ร้านค้าปลีก</div>
            <div className="text-2xl font-bold text-slate-400">🐾 ร้านสัตว์เลี้ยง</div>
            <div className="text-2xl font-bold text-slate-400">❄️ บริการแอร์</div>
            <div className="text-2xl font-bold text-slate-400">💇 ร้านเสริมสวย</div>
            <div className="text-2xl font-bold text-slate-400">🔧 ศูนย์ซ่อม</div>
          </div>
        </div>
      </section>

      {/* Why Section (Pain Points) */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">ทำไมธุรกิจถึงเลือก SARN</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">ระบบจัดการลูกค้าที่ออกแบบมาเพื่อ SMEs โดยเฉพาะ ใช้งานง่าย ไม่ซับซ้อน</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{t('painPoint1Title')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('painPoint1Desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{t('painPoint2Title')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('painPoint2Desc')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{t('painPoint3Title')}</h3>
              <p className="text-slate-600 leading-relaxed">{t('painPoint3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">คุณสมบัติครบครัน ในที่เดียว</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">จัดการทุกอย่างในธุรกิจของคุณด้วยระบบเดียว ไม่ต้องใช้หลายโปรแกรม</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {/* Feature Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">จัดการลูกค้า</h3>
              <p className="text-slate-600 leading-relaxed">บันทึกข้อมูลลูกค้าครบถ้วน วิเคราะห์กลุ่มลูกค้า (RFM) แบ่งเกรด A, B, C อัตโนมัติ</p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">ระบบอัตโนมัติ</h3>
              <p className="text-slate-600 leading-relaxed">สร้าง Flow อัตโนมัติ แจ้งเตือนตามลูกค้า ส่งโปรโมชั่นวันเกิด ไม่พลาดทุกโอกาส</p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">AI ผู้ช่วยการตลาด</h3>
              <p className="text-slate-600 leading-relaxed">AI เขียนข้อความการตลาดให้ ปรับแต่งตามข้อมูลและกลุ่มลูกค้าแต่ละคน</p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border border-orange-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">รายงานแบบเรียลไทม์</h3>
              <p className="text-slate-600 leading-relaxed">Dashboard สรุปยอดขาย กราฟวิเคราะห์ลูกค้า ติดตามธุรกิจได้ทุกที่ทุกเวลา</p>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">LINE Integration</h3>
              <p className="text-slate-600 leading-relaxed">เชื่อมต่อ LINE OA ส่งข้อความ โปรโมชั่น แจ้งเตือนหาลูกค้าอัตโนมัติ</p>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-2xl border border-cyan-100 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">นำเข้าข้อมูลง่าย</h3>
              <p className="text-slate-600 leading-relaxed">อัปโหลดไฟล์ Excel รายชื่อลูกค้า ระบบจัดการและวิเคราะห์ให้อัตโนมัติ</p>
            </div>
          </div>

          {/* Detailed Feature */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-12 border border-slate-200">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold">
                  🎯 ฟีเจอร์เด่น
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{t('feature2Title')}</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {t('feature2Desc')}
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-slate-700">สร้าง Flow ง่ายๆ แบบลาก-วาง ไม่ต้องเขียนโค้ด</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-slate-700">เงื่อนไขแบบ If-Then ตามพฤติกรรมลูกค้า</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-slate-700">AI ช่วยสร้าง Flow ให้อัตโนมัติตามที่คุณบอก</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 relative">
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-3xl p-12 flex items-center justify-center">
                  <Zap className="w-32 h-32 text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Zoho Style */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-slate-400 text-sm">SMEs ใช้งาน</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-slate-400 text-sm">ลูกค้าในระบบ</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
              <div className="text-slate-400 text-sm">Uptime</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-slate-400 text-sm">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Flowlu Style */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">ลูกค้าพูดถึงเรา</h2>
            <p className="text-lg text-slate-600">ไว้วางใจจากเจ้าของธุรกิจทั่วประเทศ</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-4">
                {'⭐'.repeat(5)}
              </div>
              <p className="text-slate-700 leading-relaxed mb-6 italic">
                "ใช้งานง่ายมาก ไม่ต้องเก่ง IT ก็ทำได้ ตอนนี้ติดตามลูกค้าได้ครบทุกคน ไม่มีหลุดแล้ว ยอดขายเพิ่มขึ้น 40%"
              </p>
              <div>
                <div className="font-bold text-slate-900">คุณสมชาย ร.</div>
                <div className="text-sm text-slate-500">เจ้าของร้านอะไหล่รถยนต์</div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-4">
                {'⭐'.repeat(5)}
              </div>
              <p className="text-slate-700 leading-relaxed mb-6 italic">
                "ระบบแจ้งเตือนอัตโนมัติช่วยได้เยอะ ไม่ต้องจำว่าลูกค้าคนไหนถึงเวลาซื้อซ้ำ ระบบแจ้งให้เอง"
              </p>
              <div>
                <div className="font-bold text-slate-900">คุณนิดา ว.</div>
                <div className="text-sm text-slate-500">เจ้าของร้านสัตว์เลี้ยง</div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-4">
                {'⭐'.repeat(5)}
              </div>
              <p className="text-slate-700 leading-relaxed mb-6 italic">
                "คุ้มค่ามาก ราคาไม่แพง แต่ได้ฟีเจอร์เยอะแยะ ทีมงานซัพพอร์ตดีด้วย ตอบเร็ว"
              </p>
              <div>
                <div className="font-bold text-slate-900">คุณประเสริฐ ส.</div>
                <div className="text-sm text-slate-500">ผู้จัดการบริษัทรับเหมาแอร์</div>
              </div>
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