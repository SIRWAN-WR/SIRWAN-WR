import React from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-sm">
            <Quote className="w-3.5 h-3.5 text-amber-700" />
            <span>آراء العملاء والشركاء</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Tajawal']">
            ماذا يقول قادة الأعمال والأفراد عن ثقتهم بكلماتنا؟
          </h2>
          <p className="text-slate-600 text-base leading-relaxed font-medium">
            شهادات موثقة من شركاء النجاح في مختلف القطاعات بالمملكة والخليج.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white p-7 rounded-3xl border border-slate-200 hover:border-amber-400 transition-all flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed italic font-['Cairo'] font-medium">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-['Tajawal'] flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
