import React from 'react';
import { Briefcase, Building2, UserCheck, Clock, Check, Calendar, ArrowLeft, Star } from 'lucide-react';
import { SERVICES_DATA } from '../data/mockData';
import { ClientType, ServiceItem } from '../types';

interface ServicesSectionProps {
  activeClientType: ClientType;
  setActiveClientType: (type: ClientType) => void;
  onSelectServiceForBooking: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  activeClientType,
  setActiveClientType,
  onSelectServiceForBooking
}) => {
  const filteredServices = SERVICES_DATA.filter((service) => {
    if (activeClientType === 'all') return true;
    return service.category === activeClientType;
  });

  return (
    <section id="services" className="py-20 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-sm">
            <Briefcase className="w-3.5 h-3.5 text-amber-700" />
            <span>خدمات وتخصصات صناعة كتب السيرة الذاتية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Tajawal']">
            حلول وتخصصات التوثيق السردي والأدبي
          </h2>
          <p className="text-slate-600 text-base leading-relaxed font-medium">
            نقدم باقات متخصصة تشمل كتابة وتوثيق كتب السيرة الذاتية للأفراد والرواد، وتوثيق تاريخ العوائل والشركات التجارية مع الطباعة الفاخرة.
          </p>

          {/* Filter Pills */}
          <div className="pt-4 flex justify-center">
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
              <button
                onClick={() => setActiveClientType('all')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeClientType === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                جميع الخدمات
              </button>
              <button
                onClick={() => setActiveClientType('individual')}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeClientType === 'individual'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>كتب سير الأفراد والرواد</span>
              </button>
              <button
                onClick={() => setActiveClientType('business')}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeClientType === 'business'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>كتب العوائل والشركات</span>
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service: ServiceItem) => (
            <div
              key={service.id}
              className={`bg-white rounded-3xl p-7 border transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1 shadow-sm hover:shadow-md ${
                service.popular
                  ? 'border-amber-400 ring-2 ring-amber-400/20'
                  : 'border-slate-200 hover:border-amber-300'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3.5 left-6 bg-slate-950 text-amber-400 text-[11px] font-black px-3.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-400/30">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>الخدمة الأكثر طلباً</span>
                </div>
              )}

              <div>
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-lg border ${
                    service.category === 'business'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {service.category === 'business' ? 'للمنشآت والشركات' : 'للأفراد والمهنيين'}
                  </span>

                  <div className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{service.estimatedDays}</span>
                  </div>
                </div>

                {/* Service Title & Desc */}
                <h3 className="text-xl font-bold text-slate-900 font-['Tajawal'] mb-3 group-hover:text-amber-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                  {service.shortDesc}
                </p>

                {/* Deliverables Checklist */}
                <div className="space-y-2.5 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-xs font-bold text-slate-700 block mb-1">ما المخرجات المتضمنة؟</span>
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => onSelectServiceForBooking(service.title)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950 text-white hover:bg-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>طلب حجز موعد</span>
                  <ArrowLeft className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
