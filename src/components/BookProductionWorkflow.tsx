import React, { useState } from 'react';
import { 
  Headphones, 
  PenTool, 
  SearchCheck, 
  Sparkles, 
  FileCheck2, 
  Palette, 
  BookOpenCheck, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Users2, 
  Award,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { WORKFLOW_STAGES, WORKFLOW_RULES } from '../data/mockData';
import { WorkflowStage } from '../types';

interface BookProductionWorkflowProps {
  onStartProject?: () => void;
}

export const BookProductionWorkflow: React.FC<BookProductionWorkflowProps> = ({
  onStartProject
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const getStageIcon = (iconName: string, className: string = "w-6 h-6") => {
    switch (iconName) {
      case 'Headphones':
        return <Headphones className={className} />;
      case 'PenTool':
        return <PenTool className={className} />;
      case 'SearchCheck':
        return <SearchCheck className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'FileCheck2':
        return <FileCheck2 className={className} />;
      case 'Palette':
        return <Palette className={className} />;
      case 'BookOpenCheck':
        return <BookOpenCheck className={className} />;
      default:
        return <FileText className={className} />;
    }
  };

  const currentStage: WorkflowStage = WORKFLOW_STAGES.find(s => s.stepNumber === activeStep) || WORKFLOW_STAGES[0];

  return (
    <section id="workflow" className="py-20 bg-slate-900 text-white relative font-['Cairo'] overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>من المقابلة الأولى إلى تسليم الكتاب النهائي</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Tajawal'] tracking-tight leading-tight">
            سلسلة إنتاج الكتاب في <span className="text-amber-400">سيروان</span>
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            منظومة متكاملة من 7 مراحل دقيقة يعمل عليها فريق متنسق لضمان خروج سيرة ذاتية وفاخرة تليق بتاريخكم ومكانتكم.
          </p>
        </div>

        {/* Pipeline Process Flow Navigation - Desktop & Mobile Horizontal Slider */}
        <div className="bg-slate-800/80 p-4 sm:p-6 rounded-3xl border border-slate-700/80 shadow-2xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>انقر على أي مرحلة لاستكشاف المهام والمخرجات:</span>
            </div>
            <div className="text-xs text-slate-400 font-mono font-semibold">
              المرحلة {activeStep} من 7
            </div>
          </div>

          {/* Stepper Buttons (RTL Order) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {WORKFLOW_STAGES.map((stage) => {
              const isActive = stage.stepNumber === activeStep;
              const isPassed = stage.stepNumber < activeStep;

              return (
                <button
                  key={stage.stepNumber}
                  onClick={() => setActiveStep(stage.stepNumber)}
                  className={`p-3 rounded-2xl transition-all text-right flex flex-col justify-between border relative overflow-hidden group ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105 z-10'
                      : isPassed
                      ? 'bg-slate-800/90 text-slate-200 border-emerald-500/50 hover:bg-slate-700'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center font-mono ${
                      isActive
                        ? 'bg-slate-950 text-amber-400'
                        : isPassed
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {stage.stepNumber}
                    </span>
                    <div className={isActive ? 'text-slate-950' : 'text-amber-400'}>
                      {getStageIcon(stage.iconName, "w-4 h-4")}
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold font-['Tajawal'] leading-snug ${isActive ? 'text-slate-950' : 'text-white'}`}>
                      {stage.roleTitle}
                    </h4>
                    <p className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                      {stage.roleSubtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Card View */}
          <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-6 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                  {getStageIcon(currentStage.iconName, "w-7 h-7")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      المرحلة الرقم {currentStage.stepNumber}
                    </span>
                    <span className="text-xs text-slate-400">{currentStage.roleSubtitle}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-['Tajawal'] mt-1">
                    {currentStage.roleTitle}
                  </h3>
                </div>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1 border border-slate-700"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>المرحلة السابقة</span>
                </button>
                <button
                  disabled={activeStep === 7}
                  onClick={() => setActiveStep(prev => Math.min(7, prev + 1))}
                  className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <span>المرحلة التالية</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stage Tasks Grid & Deliverable */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Tasks List */}
              <div className="lg:col-span-2 space-y-3">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>المهام الرئيسية في هذه المرحلة:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentStage.tasks.map((task, idx) => (
                    <div key={idx} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-2" />
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {task}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverable Box */}
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-amber-500/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>المخرجات المعتمدة من المرحلة:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 font-semibold leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 italic">
                    "{currentStage.deliverable}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>تخضع لمعايير السرية</span>
                  </span>
                  <span>اعتماد إجباري للمرحلة التالي</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Workflow Principles & Rules Banner (from bottom of image) */}
        <div className="bg-gradient-to-r from-amber-500/10 via-slate-800 to-emerald-500/10 p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Tajawal']">
                ملاحظات وتعهدات جودة العمل بالمنظومة
              </h3>
              <p className="text-xs text-slate-400">
                قواعد صارمة تلتزم بها سيروان في كل مشروع سيرة ذاتية
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WORKFLOW_RULES.map((rule, idx) => (
              <div key={idx} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {rule}
                </p>
              </div>
            ))}
          </div>

          {onStartProject && (
            <div className="text-center pt-2">
              <button
                onClick={onStartProject}
                className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
              >
                <span>ابدأ رحلة إنتاج كتابك الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
