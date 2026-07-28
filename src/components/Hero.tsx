import React from 'react';
import { Sparkles, Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ClientType } from '../types';
import { BrandLogo } from './BrandLogo';

interface HeroProps {
  activeClientType?: ClientType;
  setActiveClientType?: (type: ClientType) => void;
  onOpenBooking: () => void;
  onScrollToWorkflow: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onScrollToWorkflow
}) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-gradient-to-b from-amber-50/40 via-white to-slate-50 border-b border-slate-200/80">
      {/* Background Soft Subtle Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-200/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-emerald-100/40 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Brand Display Header Card */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="p-4 sm:p-5 rounded-3xl bg-white text-slate-950 shadow-xl border border-slate-200 mb-4 transform hover:scale-105 transition-all">
            <BrandLogo variant="dark" size="lg" showSubtitle={true} />
          </div>

          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/90 border border-amber-300/80 text-slate-900 shadow-sm transition-all hover:shadow-md">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-sm sm:text-base font-black text-amber-950 font-['Tajawal'] tracking-wide">
              لكل كيان حكاية
            </span>
            <span className="text-amber-300 font-light">|</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              صناعة كتب السيرة الذاتية بأسلوب أدبي فاخر
            </span>
          </div>
        </div>

        {/* Main Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.25] tracking-tight font-['Tajawal']">
            سيروان | SIRWAN المتخصصة في{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600">
              صناعة كتب السيرة الذاتية
            </span>
          </h1>
          <p className="text-slate-600 text-base sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            نحول رحلة حياتك، ذكرياتك، وتاريخ عائلتك أو مؤسستك إلى كتاب فاخر وموثق. ننفذ العمل عبر منظومة متكاملة من 7 مراحل دقيقة من المقابلة الأولى والتفريغ اللغوي حتى التسليم النهائي.
          </p>



          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 font-extrabold text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>طلب جلسة استكشافية لكتابك</span>
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={onScrollToWorkflow}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white border border-slate-300 text-slate-900 font-bold text-base hover:border-amber-500 hover:bg-amber-50/50 shadow-sm transition-all flex items-center justify-center gap-2.5"
            >
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>استكشف خطة العمل ومراحل إنتاج الكتاب (7 مراحل)</span>
            </button>
          </div>

          {/* Quick Guarantees */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-slate-600 font-bold">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              سرية مطلقة واحترام الخصوصية
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              اعتماد مرحلي خطوة بخطوة
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              إخراج فاخر وطباعة راقية
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
