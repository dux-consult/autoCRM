import React, { useState } from 'react';
import { Button } from './ui';
import { Menu, X, Check, ArrowRight, Database, Zap, MessageCircle, Users, BarChart, Lock, ChevronRight, Command, Sparkles, Clock } from 'lucide-react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
// Simple count-up animation component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};


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
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee 40s linear infinite reverse;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Command className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="text-xl font-bold text-slate-900 tracking-tight">SARN</span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Auto CRM</span>
            </div>
          </div>

          {/* Desktop Menu - True Centered */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
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
      <section className="relative pt-32 pb-40 px-6 overflow-hidden">
        {/* Modern Background */}
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-slate-600">ออกแบบมาเพื่อ SME ไทย 🇹🇭</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            {t('heroTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">{t('heroTitle2')}</span><br />
            {t('heroTitle3')}
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('heroDesc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button size="lg" className="h-16 px-8 text-xl w-full sm:w-auto shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 font-bold" onClick={onRegisterClick}>
              {t('tryFree')}
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-8 text-xl w-full sm:w-auto hover:bg-slate-50 transition-all group font-bold">
              {t('watchVideo')} <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Visual Placeholder */}
          <div className="mt-20 relative mx-auto max-w-5xl rounded-2xl bg-white/50 border border-slate-200 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center group backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-white/50 opacity-50"></div>
            {/* Abstract UI representation */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 p-12 w-full max-w-4xl opacity-80 group-hover:scale-105 transition-transform duration-700">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-4 transform transition-transform hover:-translate-y-2 duration-300">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><Users className="text-primary" /></div>
                <div className="h-2 w-24 bg-slate-100 rounded"></div>
                <div className="h-2 w-32 bg-slate-100 rounded"></div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-4 mt-12 transform transition-transform hover:-translate-y-2 duration-300 delay-75">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><Zap className="text-green-600" /></div>
                <div className="h-2 w-24 bg-slate-100 rounded"></div>
                <div className="h-2 w-32 bg-slate-100 rounded"></div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-4 transform transition-transform hover:-translate-y-2 duration-300 delay-150">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center"><MessageCircle className="text-purple-600" /></div>
                <div className="h-2 w-24 bg-slate-100 rounded"></div>
                <div className="h-2 w-32 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-slate-500 mb-8 uppercase tracking-wider font-semibold">ได้รับความไว้วางใจจาก SMEs ทั่วประเทศ</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><span className="text-2xl">🏪</span> ร้านค้าปลีก</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><span className="text-2xl">🐾</span> ร้านสัตว์เลี้ยง</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><span className="text-2xl">❄️</span> บริการแอร์</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><span className="text-2xl">💇</span> ร้านเสริมสวย</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><span className="text-2xl">🔧</span> ศูนย์ซ่อม</div>
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
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-100 transition-transform">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">จัดการลูกค้า</h3>
              <p className="text-slate-600 leading-relaxed">บันทึกข้อมูลลูกค้าครบถ้วน วิเคราะห์กลุ่มลูกค้า (RFM) แบ่งเกรด A, B, C อัตโนมัติ</p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-green-100 transition-transform">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">ระบบอัตโนมัติ</h3>
              <p className="text-slate-600 leading-relaxed">สร้าง Flow อัตโนมัติ แจ้งเตือนตามลูกค้า ส่งโปรโมชั่นวันเกิด ไม่พลาดทุกโอกาส</p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-100 transition-transform">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">AI ผู้ช่วยการตลาด</h3>
              <p className="text-slate-600 leading-relaxed">AI เขียนข้อความการตลาดให้ ปรับแต่งตามข้อมูลและกลุ่มลูกค้าแต่ละคน</p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-100 transition-transform">
                <BarChart className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">รายงานแบบเรียลไทม์</h3>
              <p className="text-slate-600 leading-relaxed">Dashboard สรุปยอดขาย กราฟวิเคราะห์ลูกค้า ติดตามธุรกิจได้ทุกที่ทุกเวลา</p>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-pink-200 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-pink-100 transition-transform">
                <MessageCircle className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">LINE Integration</h3>
              <p className="text-slate-600 leading-relaxed">เชื่อมต่อ LINE OA ส่งข้อความ โปรโมชั่น แจ้งเตือนหาลูกค้าอัตโนมัติ</p>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-100 transition-transform">
                <Database className="w-6 h-6 text-cyan-600" />
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

      {/* SME Impact Section */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">

            {/* Left Content: Stats & Insights */}
            <div className="flex-1 space-y-8 animate-in slide-in-from-left-8 duration-700 fade-in">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/50 text-blue-700 text-sm font-bold border border-blue-200">
                🚀 SME Insights
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                ทำไมธุรกิจยุคใหม่<br />
                <span className="text-primary">ต้องมีระบบ CRM?</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                การแข่งขันในตลาด SME สูงขึ้นทุกวัน การบริหารจัดการลูกค้าด้วยวิธีเดิมๆ อาจไม่ทันกิน ข้อมูลสถิติชี้ชัดว่าเทคโนโลยีช่วยสร้างความได้เปรียบ
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <BarChart className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">+29%</div>
                    <div className="text-slate-600 text-sm">ยอดขายเพิ่มขึ้นเมื่อใช้ CRM*</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">-10 ชม.</div>
                    <div className="text-slate-600 text-sm">ลดเวลาทำงานเอกสารต่อสัปดาห์**</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic">
                *อ้างอิงจาก Salesforce (Sales Trends Report)<br />
                **ข้อมูลเฉลี่ยจากผู้ใช้งานจริงของ SARN Platform
              </p>
            </div>

            {/* Right Content: Animated Visual Charts */}
            <div className="flex-1 w-full animate-in slide-in-from-right-8 duration-700 fade-in delay-200">
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-blue-900/10 border border-slate-100">
                {/* Header of Chart Panel */}
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                  <div className="font-bold text-slate-800">{t('landingChartPerformance')}</div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-xs text-slate-500"><div className="w-3 h-3 bg-slate-200 rounded-full"></div> {t('landingChartBefore')}</div>
                    <div className="flex items-center gap-1 text-xs text-primary font-bold"><div className="w-3 h-3 bg-primary rounded-full"></div> {t('landingChartAfter')}</div>
                  </div>
                </div>

                {/* Animated Bar Chart Rows */}
                <div className="space-y-8">
                  {/* Row 1: Customer Retention (Low to High) */}
                  <div className="space-y-3 group">
                    <div className="flex justify-between text-sm font-medium text-slate-700">
                      <span>{t('landingChartRetention')}</span>
                      <span className="text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">{t('landingChartRetentionGrowth')}</span>
                    </div>
                    {/* Before */}
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="w-12 text-right">{t('landingChartBefore')}</div>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-300 w-[25%] rounded-full"></div>
                      </div>
                      <div className="w-12">25%</div>
                    </div>
                    {/* After */}
                    <div className="flex items-center gap-3 text-xs text-primary font-bold">
                      <div className="w-12 text-right">SARN</div>
                      <div className="flex-1 h-3 bg-blue-50 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[0%] animate-[growWidth_1.5s_ease-out_forwards_0.5s] rounded-full shadow-sm shadow-blue-200" style={{ width: '75%' }}></div>
                      </div>
                      <div className="w-12">75%</div>
                    </div>
                  </div>

                  {/* Row 2: Response Speed */}
                  <div className="space-y-3 group">
                    <div className="flex justify-between text-sm font-medium text-slate-700">
                      <span>{t('landingChartResponseSpeed')}</span>
                      <span className="text-green-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">{t('landingChartSpeedGrowth')}</span>
                    </div>
                    {/* Before */}
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="w-12 text-right">{t('landingChartBefore')}</div>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-300 w-[20%] rounded-full"></div>
                      </div>
                      <div className="w-12">{t('landingChartSlow')}</div>
                    </div>
                    {/* After */}
                    <div className="flex items-center gap-3 text-xs text-green-600 font-bold">
                      <div className="w-12 text-right">SARN</div>
                      <div className="flex-1 h-3 bg-green-50 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[0%] animate-[growWidth_1.5s_ease-out_forwards_0.7s] rounded-full shadow-sm shadow-green-200" style={{ width: '90%' }}></div>
                      </div>
                      <div className="w-12">{t('landingChartInstant')}</div>
                    </div>
                  </div>

                  {/* Row 3: Human Error */}
                  <div className="space-y-3 group">
                    <div className="flex justify-between text-sm font-medium text-slate-700">
                      <span>{t('landingChartError')}</span>
                      <span className="text-orange-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">{t('landingChartErrorReduction')}</span>
                    </div>
                    {/* Before */}
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="w-12 text-right">{t('landingChartBefore')}</div>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-200 w-[80%] rounded-full"></div>
                      </div>
                      <div className="w-12">High</div>
                    </div>
                    {/* After */}
                    <div className="flex items-center gap-3 text-xs text-orange-600 font-bold">
                      <div className="w-12 text-right">SARN</div>
                      <div className="flex-1 h-3 bg-orange-50 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-[0%] animate-[growWidth_1.5s_ease-out_forwards_0.9s] rounded-full shadow-sm shadow-orange-200" style={{ width: '5%' }}></div>
                      </div>
                      <div className="w-12">0%</div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -right-8 -bottom-8 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-bounce-slow hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">💰</span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{t('landingRoiTitle')}</div>
                      <div className="font-bold text-slate-900">{t('landingRoiValue')}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Animated */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-300">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <div className="text-slate-400 text-sm font-medium">{t('landingStatsSmeUsers')}</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-300">
                <AnimatedCounter end={10000} suffix="+" />
              </div>
              <div className="text-slate-400 text-sm font-medium">ลูกค้าในระบบ</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-300">
                <AnimatedCounter end={99} suffix=".9%" />
              </div>
              <div className="text-slate-400 text-sm font-medium">Uptime</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-yellow-300">
                24/7
              </div>
              <div className="text-slate-400 text-sm font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews - Marquee Style */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">{t('reviewsTitle')}</h2>
          <p className="text-lg text-slate-600">{t('reviewsDesc')}</p>
        </div>

        {/* Marquee Container */}
        <div className="flex gap-6 w-max animate-marquee hover:[animation-play-state:paused] py-4">
          {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((item, index) => (
            <div key={index} className="w-[350px] bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                  ${index % 3 === 0 ? 'bg-blue-500' : index % 3 === 1 ? 'bg-pink-500' : 'bg-green-500'}`}>
                  {index % 3 === 0 ? 'S' : index % 3 === 1 ? 'P' : 'C'}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">ร้านสมบูรณ์ การช่าง</div>
                  <div className="flex text-yellow-400 text-xs">{'⭐'.repeat(5)}</div>
                </div>
                <div className="ml-auto">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-blue-600" /></div>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed border-l-2 border-slate-100 pl-3">
                "{t('review1Text')}"
              </p>
              <div className="mt-4 text-xs text-slate-400 flex items-center gap-1">
                Google Reviews <span className="w-1 h-1 bg-slate-400 rounded-full"></span> 2 วันที่แล้ว
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#F4F6F8] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('pricingTitle')}</h2>
            <p className="text-slate-500">{t('pricingDesc')}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Main Pricing Unit (Unified Standard + Trial) */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden relative group hover:border-primary/30 transition-all duration-500">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-primary to-purple-500"></div>

              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-12 items-start">

                  {/* Left: Price & CTA */}
                  <div className="flex-1 space-y-8 relative">
                    <div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-4 border border-blue-100">
                        {t('recommendedForSme')}
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-2">{t('smePro')}</h3>
                      <p className="text-slate-500 leading-relaxed">
                        {t('standardPlanDesc')}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold text-slate-900 tracking-tight">990</span>
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-slate-500">THB</span>
                          <span className="text-sm text-slate-400">/ เดือน</span>
                        </div>
                      </div>

                      <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="font-bold text-blue-700 mb-1 flex items-center gap-2 text-lg">
                            <Sparkles className="w-5 h-5 text-blue-600 fill-blue-600" /> {t('trial30Days')}
                          </div>
                          <p className="text-sm text-blue-600/80">
                            {t('accessProFeatures')}<br />
                            <span className="opacity-75 text-xs">{t('noCreditCardCancel')}</span>
                          </p>
                        </div>
                        {/* Decor */}
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-200/50 rounded-full blur-2xl"></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-2">
                      <Button size="lg" className="w-full text-xl h-16 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1 font-bold" onClick={onRegisterClick}>
                        {t('start30DaysTrial')} <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </div>

                  {/* Right: Features Grid */}
                  <div className="flex-1 w-full bg-slate-50 rounded-3xl p-8 border border-slate-100">
                    <div className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      {t('everythingIncluded')}
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-slate-700 group/item">
                        <Check className="w-5 h-5 text-green-500 shrink-0 group-hover/item:scale-110 transition-transform" />
                        <span>{t('unlimitedDb')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700 group/item">
                        <Check className="w-5 h-5 text-green-500 shrink-0 group-hover/item:scale-110 transition-transform" />
                        <span>{t('lineOaConnect')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700 group/item">
                        <Check className="w-5 h-5 text-green-500 shrink-0 group-hover/item:scale-110 transition-transform" />
                        <span>{t('fullAutomation')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700 group/item">
                        <Check className="w-5 h-5 text-green-500 shrink-0 group-hover/item:scale-110 transition-transform" />
                        <span>{t('realTimeDashboard')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700 group/item">
                        <Check className="w-5 h-5 text-green-500 shrink-0 group-hover/item:scale-110 transition-transform" />
                        <span>{t('dealsPipeline')}</span>
                      </li>
                      <li className="flex items-start gap-3 text-slate-700 group/item">
                        <Check className="w-5 h-5 text-green-500 shrink-0 group-hover/item:scale-110 transition-transform" />
                        <span>{t('exportReports')}</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>

            {/* Subtle Enterprise Link */}
            <div className="mt-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => window.location.href = 'mailto:sales@sarn.com'}>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                <span className="text-slate-600 text-sm">
                  {t('enterpriseNeed')}
                </span>
                <span className="text-purple-600 font-bold text-sm group-hover:underline flex items-center gap-1">
                  {t('contactSales')} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
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