import React from 'react';
import { Mail, MapPin, Calendar, ArrowUp } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 font-['Cairo'] relative text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-3.5 rounded-2xl bg-white text-slate-950 border border-slate-200 shadow-xl inline-block">
              <BrandLogo variant="dark" size="md" showSubtitle={true} />
            </div>

            <p className="text-xs leading-relaxed text-slate-300 max-w-sm font-medium">
              سيروان | SIRWAN المتخصصة في صناعة وتوثيق كتب السيرة الذاتية والمذكرات للشخصيات والرواد والعائلات والشركات التجارية بالمملكة العربية السعودية والعالم العربي.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>حجز موعد استشارة لكتابك</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm font-['Tajawal']">روابط سريعة</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#services" className="hover:text-amber-400 transition-colors">كتب سير الأفراد والرواد</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">كتب العوائل والشركات</a></li>
              <li><a href="#portfolio" className="hover:text-amber-400 transition-colors">معرض الإصدارات السابقة</a></li>
              <li><a href="#brief-ai" className="hover:text-amber-400 transition-colors">مساعد هيكلية السيرة الذاتية AI</a></li>
            </ul>
          </div>

          {/* Services Scope */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm font-['Tajawal']">أبرز التخصصات</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li>صناعة كتاب السيرة الذاتية والمذكرات</li>
              <li>توثيق كتاب تاريخ العوائل والشركات</li>
              <li>جلسات الحوار والتفريغ التوثيقي</li>
              <li>إعادة الصياغة والمراجعة السردية</li>
              <li>التصميم والطباعة الفاخرة للكتب</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs">
            <h4 className="text-white font-bold text-sm font-['Tajawal']">تواصل معنا</h4>
            <div className="space-y-2.5 text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">admin@sirwan-wr.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 font-medium">
          <p>© {new Date().getFullYear()} منصة سيروان | SIRWAN لصناعة وتطوير المحتوى. جميع الحقوق محفوظة.</p>
          
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-400 transition-all flex items-center gap-1.5"
          >
            <span>إلى الأعلى</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
