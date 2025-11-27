import React, { useState } from 'react';
import { Button } from './ui';
import { Menu, X, Check, ArrowRight, Database, Zap, MessageCircle, Users, BarChart, Lock, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">a</span>
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">auto CRM</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">คุณสมบัติ</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">ราคา</a>
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">เกี่ยวกับเรา</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" onClick={onLoginClick}>เข้าสู่ระบบ</Button>
            <Button onClick={onLoginClick}>สมัครสมาชิก</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-4 shadow-lg absolute w-full">
            <a href="#features" className="block text-sm font-medium text-slate-600">คุณสมบัติ</a>
            <a href="#pricing" className="block text-sm font-medium text-slate-600">ราคา</a>
            <div className="pt-4 flex flex-col gap-3">
              <Button variant="outline" className="w-full justify-center" onClick={onLoginClick}>เข้าสู่ระบบ</Button>
              <Button className="w-full justify-center" onClick={onLoginClick}>สมัครสมาชิก</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            เปลี่ยนลูกค้าขาจร <span className="text-primary">ให้เป็นขาประจำ</span><br />
            ด้วยระบบ Auto CRM
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            ระบบดูแลลูกค้าสำหรับ SMEs ที่ใช้งานง่ายที่สุด ไม่ต้องเก่ง Tech ก็ทำยอดขายเพิ่มได้ด้วย Automation และ AI ผู้ช่วยอัจฉริยะ
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto" onClick={onLoginClick}>
              ทดลองใช้งานฟรี
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto group">
              ดูวิดีโอแนะนำ <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
              <h3 className="text-xl font-bold mb-3">เลิกจดกระดาษ / Excel</h3>
              <p className="text-slate-500 leading-relaxed">ข้อมูลลูกค้าหาย หาไม่เจอ ข้อมูลซ้ำซ้อน เปลี่ยนมาใช้ Database บน Cloud ที่ปลอดภัยและเข้าถึงได้ทุกที่</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">ไม่ลืมตามลูกค้า</h3>
              <p className="text-slate-500 leading-relaxed">ลูกค้าซื้อแล้วหายเงียบ? ระบบจะแจ้งเตือนให้ทักไปหาเมื่อถึงเวลาซื้อซ้ำ หรือส่งโปรโมชั่นวันเกิดให้อัตโนมัติ</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">ไม่ต้องคิดคำโฆษณาเอง</h3>
              <p className="text-slate-500 leading-relaxed">คิดไม่ออกว่าจะทักลูกค้าว่าอะไร? ให้ AI ช่วยแต่งประโยคปิดการขายตามจิตวิทยาและข้อมูลลูกค้าแต่ละคน</p>
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
              <h2 className="text-3xl md:text-4xl font-bold">นำเข้าลูกค้าเก่าง่ายๆ ในคลิกเดียว</h2>
              <p className="text-lg text-slate-500">
                มีไฟล์ Excel รายชื่อลูกค้าอยู่แล้ว? อัปโหลดเข้า auto CRM ระบบจะจัดระเบียบและวิเคราะห์ RFM Segmentation (แบ่งกลุ่มลูกค้า เกรด A, B, C) ให้อัตโนมัติทันที
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-green-600" /></div>
                  รองรับไฟล์ .xlsx และ .csv
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-green-600" /></div>
                  ตรวจสอบเบอร์โทรซ้ำอัตโนมัติ
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
              <h2 className="text-3xl md:text-4xl font-bold">สร้าง Flow อัตโนมัติเหมือนต่อ Lego</h2>
              <p className="text-lg text-slate-500">
                กำหนดกฎการดูแลลูกค้าได้เอง เช่น "ถ้าซื้อสินค้า A ครบ 3 เดือน -> ให้สร้าง Task โทรหาลูกค้าเพื่อขายไส้กรอง" ช่วยให้ทีมงานทำงานเป็นระบบ ไม่พลาดทุกโอกาสขาย
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">แพ็กเกจราคาที่คุ้มค่า</h2>
            <p className="text-slate-500">เริ่มต้นใช้งานได้ฟรี ไม่ต้องผูกบัตรเครดิต</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <div className="mb-4">
                <span className="font-bold text-lg">Starter</span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">ฟรี</span>
                <span className="text-slate-500 ml-2">/ ตลอดชีพ</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> รองรับลูกค้าสูงสุด 100 คน
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> Dashboard สรุปยอดขาย
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> ระบบ RFM พื้นฐาน
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={onLoginClick}>เริ่มใช้งานฟรี</Button>
            </div>

            {/* SME Pro */}
            <div className="bg-white rounded-2xl p-8 border-2 border-primary shadow-xl relative flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                แนะนำ
              </div>
              <div className="mb-4">
                <span className="font-bold text-lg text-primary">SME Pro</span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">฿590</span>
                <span className="text-slate-500 ml-2">/ เดือน</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-primary shrink-0" /> ไม่จำกัดจำนวนลูกค้า
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-primary shrink-0" /> AI Marketing Assistant
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-primary shrink-0" /> Automation Workflows
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-primary shrink-0" /> LINE OA Integration
                </li>
              </ul>
              <Button className="w-full" onClick={onLoginClick}>สมัครเลย</Button>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <div className="mb-4">
                <span className="font-bold text-lg">Enterprise</span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">ติดต่อเรา</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> Custom API & Webhooks
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> ทีมผู้ดูแลส่วนตัว
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-green-500 shrink-0" /> On-site Training
                </li>
              </ul>
              <Button variant="outline" className="w-full">ติดต่อฝ่ายขาย</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">a</span>
            </div>
            <span className="font-bold text-slate-900">auto CRM</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-primary">เงื่อนไขการใช้งาน</a>
            <a href="#" className="hover:text-primary">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-primary">ช่วยเหลือ</a>
          </div>
          <p className="text-sm text-slate-400">© 2024 Auto CRM Thailand. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};