import React, { useState } from 'react';
import { BookOpen, Sparkles, Building2, UserCheck, ExternalLink, X, Copy, Check, TrendingUp, Quote, Tag, Search, Calendar } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/mockData';
import { PortfolioItem, ClientType } from '../types';

interface PortfolioSectionProps {
  onSelectServiceForBooking?: (serviceTitle: string) => void;
  isFullPage?: boolean;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onSelectServiceForBooking,
  isFullPage = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<ClientType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const categories = [
    { id: 'all', label: 'جميع الإصدارات' },
    { id: 'personal_memoir', label: 'سير ذاتية فردية' },
    { id: 'corporate_legacy', label: 'تاريخ عوائل وشركات' },
    { id: 'executive_biography', label: 'مذكرات قيادية' },
    { id: 'editorial_editing', label: 'تحرير وتدقيق' },
  ];

  const filteredPortfolio = PORTFOLIO_DATA.filter((item) => {
    // Category match
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    // Client type match
    if (clientFilter !== 'all' && item.clientType !== clientFilter) {
      return false;
    }
    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchClient = item.clientName.toLowerCase().includes(q);
      const matchSnippet = item.shortSnippet.toLowerCase().includes(q);
      const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchClient && !matchSnippet && !matchTags) {
        return false;
      }
    }
    return true;
  });

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <section id="portfolio" className={`bg-white border-b border-slate-200/80 relative font-['Cairo'] ${isFullPage ? 'py-12 min-h-screen' : 'py-20'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>معرض الإصدارات السابقة والكتب المطبوعة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Tajawal'] tracking-tight">
            إصدارات سابقة ونصوص خلدت حكايات شركائنا
          </h2>
          <p className="text-slate-600 text-base leading-relaxed font-medium">
            استكشف عينات حقيقية من كتب السيرة الذاتية والمذكرات المطبوعة التي صغناها ووُثقت بأعلى معايير الجودة والتصميم الفاخر.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث في الإصدارات السابقة باسم صاحب السيرة، العائلة، التخصص، أو الكلمة المفتاحية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:border-amber-500 focus:outline-none font-medium shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Client Type Toggle */}
          <div className="pt-2 flex justify-center">
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 inline-flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setClientFilter('all')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  clientFilter === 'all' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                جميع العملاء
              </button>
              <button
                onClick={() => setClientFilter('business')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  clientFilter === 'business' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>الشركات والمنشآت</span>
              </button>
              <button
                onClick={() => setClientFilter('individual')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  clientFilter === 'individual' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>الأفراد والقياديين</span>
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        {filteredPortfolio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolio.map((item: PortfolioItem) => (
              <div
                key={item.id}
                className="bg-slate-50 rounded-3xl p-6 border border-slate-200 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group hover:shadow-lg"
              >
                <div>
                  {/* Header Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-200">
                      {item.categoryLabel}
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-semibold">{item.year}</span>
                  </div>

                  {/* Title & Client */}
                  <h3 className="text-lg font-bold text-slate-900 font-['Tajawal'] mb-1 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1">
                    {item.clientType === 'business' ? <Building2 className="w-3.5 h-3.5 text-blue-600" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{item.clientName}</span>
                  </p>

                  {/* Optional Book Cover Display */}
                  {item.coverImage && (
                    <div className="mb-4 flex justify-center">
                      <div className="relative group/cover rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 max-w-[180px] sm:max-w-[200px] aspect-[3/4]">
                        <img
                          src={item.coverImage}
                          alt={`غلاف ${item.title}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center transform group-hover/cover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Short Snippet Box */}
                  <p className="text-slate-700 text-xs leading-relaxed mb-5 bg-white p-4 rounded-2xl border border-slate-200 line-clamp-3 italic font-serif">
                    "{item.shortSnippet}"
                  </p>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
                    {item.metrics.map((m, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-2xs">
                        <span className="block text-[10px] text-slate-500 font-medium">{m.label}</span>
                        <span className="font-extrabold text-emerald-700 font-['Tajawal']">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inspect Button */}
                <button
                  onClick={() => setActiveModalItem(item)}
                  className="w-full py-3 rounded-xl bg-white hover:bg-slate-950 hover:text-white border border-slate-300 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
                >
                  <span>استعراض النموذج والتحليل الكامل</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">لا توجد مشاريع تطابق هذا البحث حالياً</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">جرب تغيير الكلمة المفتاحية أو اختر تخصصاً آخر من فلتر التصنيفات أعلاه.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setClientFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}

      </div>

      {/* Portfolio Item Sample Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col text-slate-900">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-200 mb-2 inline-block">
                  {activeModalItem.categoryLabel}
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-['Tajawal']">
                  {activeModalItem.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  العميل: {activeModalItem.clientName} | الإصدار: {activeModalItem.year}
                </p>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 space-y-6 overflow-y-auto font-['Cairo'] text-sm">
              
              {/* Cover Image Banner if available */}
              {activeModalItem.coverImage && (
                <div className="flex justify-center bg-slate-100 p-4 rounded-2xl border border-slate-200">
                  <div className="rounded-xl overflow-hidden border border-slate-300 shadow-md max-w-[200px] aspect-[3/4]">
                    <img
                      src={activeModalItem.coverImage}
                      alt={`غلاف ${activeModalItem.title}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Strategic Challenge & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span>التحدي الاستراتيجي قبل الصياغة:</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {activeModalItem.strategyChallenge}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>الحل ونبرة الصوت المختارة:</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {activeModalItem.solutionAndTone}
                  </p>
                </div>
              </div>

              {/* Actual Content Snippet Draft */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>مقتطف حقيقي من نص المحتوى الصادر:</span>
                  </span>
                  <button
                    onClick={() => handleCopyText(activeModalItem.fullContentSnippet)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-700 hover:bg-slate-100"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>نسخ المقتطف</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-mono border border-slate-200 max-h-60 overflow-y-auto">
                  {activeModalItem.fullContentSnippet}
                </div>
              </div>

              {/* Results & Metrics */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase">أرقام التأثير والنتائج المحققة:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {activeModalItem.metrics.map((m, idx) => (
                    <div key={idx} className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-center">
                      <span className="text-[11px] text-emerald-800 block font-medium">{m.label}</span>
                      <span className="text-xl font-extrabold text-emerald-700 font-['Tajawal']">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial if exists */}
              {activeModalItem.testimonial && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                  <Quote className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-amber-950 leading-relaxed italic font-medium">
                      "{activeModalItem.testimonial.quote}"
                    </p>
                    <p className="text-[11px] font-bold text-slate-900 mt-2">
                      — {activeModalItem.testimonial.author} ({activeModalItem.testimonial.role})
                    </p>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeModalItem.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 font-semibold">
                    <Tag className="w-3 h-3 text-amber-600" />
                    {tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              {onSelectServiceForBooking && (
                <button
                  onClick={() => {
                    const title = activeModalItem.title;
                    setActiveModalItem(null);
                    onSelectServiceForBooking(title);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>اطلب صياغة مشابهة لمشروعك</span>
                </button>
              )}

              <button
                onClick={() => setActiveModalItem(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
