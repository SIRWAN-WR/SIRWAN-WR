import React from 'react';
import { Award, Feather, ShieldCheck, Calendar, ArrowLeft, BookOpen, Tv, Newspaper, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { WRITER_PROFILE } from '../data/mockData';
import aliAlshraimiPortrait from '../assets/images/regenerated_image_1785171681030.png';

interface AboutWriterProps {
  onOpenBooking?: () => void;
}

export const AboutWriter: React.FC<AboutWriterProps> = ({ onOpenBooking }) => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-amber-50/20 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-950 text-xs sm:text-sm font-bold shadow-sm">
            <Feather className="w-4 h-4 text-amber-700" />
            <span>عن الكاتب والمؤسس الرئيسي</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Tajawal'] tracking-tight">
            علي الشريمي
          </h2>
          <p className="text-amber-800 font-bold text-base sm:text-lg">
            كاتبٌ وصحفي سعودي | مؤسس والرئيس الإبداعي لـ منصة "سيروان"
          </p>
        </div>

        {/* Profile Grid: Left Photo & Fast Facts / Right Detailed Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Author Card & Image Header */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Author Portrait Image Box */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xl relative overflow-hidden group">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/4.5] bg-slate-100">
                <img
                  src={aliAlshraimiPortrait}
                  alt="علي الشريمي - كاتب وصحفي سعودي"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 right-4 left-4 text-white p-4 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                    <Award className="w-4 h-4" />
                    <span>جائزة أفضل كاتب صحفي (2019)</span>
                  </div>
                  <h3 className="text-lg font-black font-['Tajawal'] text-white">
                    علي الشريمي
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    خبرة أكثر من 15 عاماً في الصحافة والسير السردية
                  </p>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-xl font-black text-amber-700 font-['Tajawal']">15+</span>
                  <span className="text-[11px] font-bold text-slate-600">سنة خبرة</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-xl font-black text-slate-900 font-['Tajawal']">2011</span>
                  <span className="text-[11px] font-bold text-slate-600">جريدة الوطن</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-xl font-black text-emerald-700 font-['Tajawal']">100%</span>
                  <span className="text-[11px] font-bold text-slate-600">دقة التوثيق</span>
                </div>
              </div>

              {/* Consultation CTA */}
              {onOpenBooking && (
                <div className="mt-5">
                  <button
                    onClick={onOpenBooking}
                    className="w-full py-4 rounded-2xl bg-slate-950 text-white font-bold text-sm hover:bg-amber-600 hover:text-slate-950 transition-all duration-300 flex items-center justify-center gap-2 shadow-md group/btn"
                  >
                    <Calendar className="w-4 h-4 text-amber-400 group-hover/btn:text-slate-950" />
                    <span>حجز جلسة استشارية مع الكاتب علي الشريمي</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Quick Credentials Badge */}
            <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-300/60 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm font-['Tajawal']">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <span>فلسفة الكاتب في التوثيق:</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-medium italic">
                "{WRITER_PROFILE.tagline}"
              </p>
            </div>

          </div>

          {/* Full Bio & Achievements Breakdown */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Bio Paragraphs */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900">
                  <Feather className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Tajawal']">
                    النبذة التعريفية والمسيرة المهنية
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    رحلة خمسة عشر عاماً من الشغف والتوثيق الأدبي
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                {WRITER_PROFILE.fullBioParagraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className={idx === 0 ? "text-slate-900 font-semibold text-base sm:text-lg leading-relaxed bg-amber-50/50 p-4 rounded-2xl border-r-4 border-amber-500" : ""}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

            </div>

            {/* Highlights Grid: Journalism + TV + Books */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Journalism Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 hover:border-amber-400 transition-all shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                    <Newspaper className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 font-['Tajawal'] text-base">
                    المسيرة الصحفية والإعلامية
                  </h4>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 font-medium">
                  {WRITER_PROFILE.journalism.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block">{item.title}</strong>
                        <span>{item.detail}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* TV & Visual Media */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 hover:border-amber-400 transition-all shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
                    <Tv className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 font-['Tajawal'] text-base">
                    الإعلام المرئي والبرامج
                  </h4>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 font-medium">
                  {WRITER_PROFILE.tvPrograms.map((prog, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block">{prog.name} ({prog.network})</strong>
                        <span>{prog.role}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Award Banner */}
            <div className="p-6 rounded-3xl bg-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-400 shrink-0">
                  <Star className="w-6 h-6 fill-amber-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-['Tajawal'] text-white">
                    جائزة منتدى الثلاثاء الثقافي (2019)
                  </h4>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    أفضل كاتب صحفي في مجال الإعلام وحقوق الإنسان تقديرًا لطرحه المهني والمؤثر.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
