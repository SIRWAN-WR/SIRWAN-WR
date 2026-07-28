import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Layers, Send, Lightbulb } from 'lucide-react';
import { AIBriefResponse } from '../types';

interface AIBriefGeneratorProps {
  onOpenBookingWithService: (serviceName: string) => void;
}

export const AIBriefGenerator: React.FC<AIBriefGeneratorProps> = ({
  onOpenBookingWithService
}) => {
  const [topic, setTopic] = useState('');
  const [clientType, setClientType] = useState<'business' | 'individual'>('business');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIBriefResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/brief-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicOrIndustry: topic,
          clientType,
          targetAudience: audience,
          goal
        })
      });

      if (!response.ok) {
        throw new Error('حدث خطأ أثناء التواصل مع محرك الذكاء الاصطناعي');
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      console.error(err);
      setError('تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="brief-ai" className="py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>مساعد هيكلية وتخطيط كتب السيرة الذاتية الذكي</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Tajawal']">
            اكتشف هيكلية وفصول كتابك الفاخر في ثوانٍ
          </h2>
          <p className="text-slate-600 text-base leading-relaxed font-medium">
            اكتب ملخصاً سريعا عن سيرتك، رحلتك، أو تاريخ عائلتك، وسيقوم مساعدنا الذكي باقتراح العنوان الفاخر، نبرة السرد، وهيكلة الفصول الرئيسية الموصى بها.
          </p>
        </div>

        {/* Two Column Layout: Form + Generated Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Input */}
          <div className="lg:col-span-5 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <form onSubmit={handleGenerateBrief} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">نوع كتاب السيرة الذاتية:</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setClientType('individual')}
                    className={`py-2 rounded-lg transition-all ${
                      clientType === 'individual' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    سيرة فردية / مذكرات
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType('business')}
                    className={`py-2 rounded-lg transition-all ${
                      clientType === 'business' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    تاريخ عائلة / مجموعة تجارية
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  صف المحطات الفاصلة في سيرتك أو قصة التأسيس *
                </label>
                <textarea
                  required
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="مثال: رجل أعمال عصامي بدأ في السبعينات من دكان صغير في سوق الزل وحول التجارة إلى مجموعة استثمارية.. أو مذكرات طبيب جراح أجرى أكثر من 2000 عملية.."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 text-xs focus:border-amber-500 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  الهدف الرئيسي من كتاب السيرة الذاتية (اختياري)
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="مثال: توثيق التاريخ، إلهام الأبناء والأحفاد، إهداء خاص..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:border-amber-500 focus:outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="w-full py-3.5 rounded-xl bg-slate-950 text-white font-extrabold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                    <span>جاري تحليل الفكرة وصياغة الهيكلية...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 stroke-[2.5] text-amber-400" />
                    <span>توليد مقترح المحتوى وBrief الذكي</span>
                  </>
                )}
              </button>

            </form>

            {error && (
              <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">
                {error}
              </p>
            )}
          </div>

          {/* AI Result Box */}
          <div className="lg:col-span-7 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm min-h-[420px] flex flex-col justify-between">
            {result ? (
              <div className="space-y-6">
                
                {/* Proposed Title */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">العنوان المقترح للمشروع:</span>
                  <h3 className="text-lg font-extrabold text-slate-900 font-['Tajawal']">
                    {result.titleIdea}
                  </h3>
                </div>

                {/* Analysis & Tone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block mb-1">الجمهور المستهدف:</span>
                    <span className="font-bold text-slate-900">{result.targetAudienceAnalysis}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block mb-1">نبرة الصوت الموصى بها:</span>
                    <span className="font-bold text-amber-800">{result.recommendedTone}</span>
                  </div>
                </div>

                {/* Content Structure */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>الأفكار والهيكلية التحريرية المقترحة:</span>
                  </span>
                  <div className="space-y-1.5">
                    {result.contentStructure.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium">
                        <span className="font-mono text-amber-700 font-bold">{idx + 1}.</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Service & Timeline */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-600 block">الخدمة المقترحة للتنفيذ:</span>
                    <span className="text-sm font-extrabold text-slate-900 font-['Tajawal']">{result.suggestedService}</span>
                    <span className="text-xs text-slate-600 block mt-0.5 font-medium">المدى الزمني: {result.estimatedTimeline}</span>
                  </div>

                  <button
                    onClick={() => onOpenBookingWithService(result.suggestedService)}
                    className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
                  >
                    <span>احجز تنفيذ هذا الـ Brief</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>

              </div>
            ) : (
              <div className="my-auto text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-2xs">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900 font-['Tajawal']">
                    بانتظار إدخال أفكارك
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                    قم بتعبئة النموذج المقابل واضغط على "توليد مقترح المحتوى" للحصول على تحليل وهيكلية فورية معتمدة على Gemini.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
