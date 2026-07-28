import React, { useState } from 'react';
import { Calculator, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';

interface PricingCalculatorProps {
  onOpenBookingForQuote: (details: string) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  onOpenBookingForQuote
}) => {
  const [bookType, setBookType] = useState<string>('personal');
  const [pageCount, setPageCount] = useState<number>(200);
  const [coverType, setCoverType] = useState<'paperback' | 'hardcover' | 'leather'>('hardcover');
  const [includeInterviews, setIncludeInterviews] = useState<boolean>(true);
  const [printedCopies, setPrintedCopies] = useState<number>(50);

  // Price Calculation Logic for Biography Book Production
  const calculateEstimate = () => {
    let basePrice = 0;

    switch (bookType) {
      case 'personal':
        basePrice = 12000 + (pageCount * 40);
        break;
      case 'corporate':
        basePrice = 25000 + (pageCount * 60);
        break;
      case 'interviews':
        basePrice = 4000 + (pageCount * 20);
        break;
      case 'editing':
        basePrice = 6000 + (pageCount * 25);
        break;
      default:
        basePrice = 10000;
    }

    if (includeInterviews) basePrice += 3000; // Oral History Interview Sessions
    if (coverType === 'hardcover') basePrice += 2500;
    if (coverType === 'leather') basePrice += 5000;
    
    // Printing Copies calculation
    basePrice += (printedCopies * 35);

    return Math.round(basePrice);
  };

  const estimatedPrice = calculateEstimate();

  const handleBooking = () => {
    const bookNameMap: Record<string, string> = {
      personal: 'كتاب سيرة ذاتية فردية',
      corporate: 'كتاب تاريخ عائلي/شركة',
      interviews: 'جلسات حوار وتفريغ',
      editing: 'تحرير ومراجعة مسودة'
    };

    const details = `حاسبة تقدير كتاب السيرة: ${bookNameMap[bookType]} (${pageCount} صفحة، غلاف ${coverType === 'leather' ? 'جلد فاخر' : coverType === 'hardcover' ? 'مقوى' : 'ورقي'}، ${printedCopies} نسخة مطبوعة) - التكلفة: ${estimatedPrice.toLocaleString()} ريال`;
    onOpenBookingForQuote(details);
  };

  return (
    <section id="calculator" className="py-20 bg-white border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-sm">
            <Calculator className="w-3.5 h-3.5 text-amber-700" />
            <span>حاسبة تقدير تكلفة إنتاج الكتاب الشفافة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Tajawal']">
            احسب التكلفة التقديرية لكتاب سيرتك الذاتية
          </h2>
          <p className="text-slate-600 text-base leading-relaxed font-medium">
            حدد نوع الكتاب، عدد الصفحات المتوقع، نوع التجليد والطباعة للحصول على تقدير شفاف يشمل المراحل السبع الكاملة.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Inputs Column */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Book Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">1. اختر نوع مشروع كتاب السيرة الذاتية:</label>
              <select
                value={bookType}
                onChange={(e) => setBookType(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-slate-900 text-xs focus:border-amber-500 focus:outline-none font-medium"
              >
                <option value="personal">صناعة كتاب سيرة ذاتية للأفراد والرواد (Personal Biography)</option>
                <option value="corporate">توثيق كتاب تاريخ العوائل والشركات التجاري (Corporate & Family Legacy)</option>
                <option value="interviews">جلسات الحوار والتفريغ التوثيقي فقط (Oral Interviews & Transcription)</option>
                <option value="editing">إعادة صياغة وتحرير مسودة كتاب مكتوبة (Memoir Editing & Polish)</option>
              </select>
            </div>

            {/* Page Count Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">2. عدد صفحات الكتاب التقديري:</label>
                <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">{pageCount} صفحة</span>
              </div>
              <input
                type="range"
                min={80}
                max={500}
                step={20}
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full accent-amber-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>80 صفحة</span>
                <span>250 صفحة</span>
                <span>500 صفحة</span>
              </div>
            </div>

            {/* Cover Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">3. نوع التجليد والإخراج الفني للغلاف:</label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCoverType('paperback')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    coverType === 'paperback' ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  غلاف ورقي مرن
                </button>
                <button
                  type="button"
                  onClick={() => setCoverType('hardcover')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    coverType === 'hardcover' ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  غلاف مقوى (Hardcover)
                </button>
                <button
                  type="button"
                  onClick={() => setCoverType('leather')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    coverType === 'leather' ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  تجليد جلد وفاخر
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2 border-t border-slate-200 text-xs">
              <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl border border-slate-200 font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={includeInterviews}
                  onChange={(e) => setIncludeInterviews(e.target.checked)}
                  className="accent-amber-600 w-4 h-4 rounded"
                />
                <span>تضمين جلسات الحوار والتفريغ التوثيقي الميدانية (+3,000 ريال)</span>
              </label>

              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">عدد النسخ المطبوعة الفاخرة المطلوب تسليمها:</span>
                <select
                  value={printedCopies}
                  onChange={(e) => setPrintedCopies(Number(e.target.value))}
                  className="bg-slate-100 border border-slate-300 rounded-lg p-1.5 text-slate-900 font-mono font-bold"
                >
                  <option value={10}>10 نسخ تذكارية</option>
                  <option value={50}>50 نسخة</option>
                  <option value={100}>100 نسخة</option>
                  <option value={300}>300 نسخة</option>
                  <option value={500}>500 نسخة فاخرة</option>
                </select>
              </div>
            </div>

          </div>

          {/* Estimate Output Box */}
          <div className="md:col-span-5 bg-white p-7 rounded-2xl border border-slate-200 text-center space-y-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-bold block">التكلفة التقديرية لكامل مراحل الإنتاج السبع:</span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-['Tajawal'] py-2">
                {estimatedPrice.toLocaleString()} <span className="text-sm font-semibold text-slate-600">ريال سعودي</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                تغطي التفريغ، كاتب السرد، التحرير، التدقيق اللغوي، التصميم والطباعة.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 text-right">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>الالتزام التام بمعايير السرية المطلقة</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                <span>اعتماد مرحلي للعميل خطوة بخطوة</span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full py-3.5 rounded-xl bg-slate-950 text-white font-extrabold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>طلب حجز موعد استكشافي لكتابك</span>
              <ArrowLeft className="w-4 h-4 text-amber-400" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
