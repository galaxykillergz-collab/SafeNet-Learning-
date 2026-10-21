import React, { useState, useEffect } from 'react';
import { LearningModule, QuizScoreRecord } from '../types';
import { modulesData } from '../data/modulesData';
import { PasswordStrengthTool } from '../components/interactive/PasswordStrengthTool';
import { PhishingInspectorTool } from '../components/interactive/PhishingInspectorTool';
import { VideoPlayerCard } from '../components/VideoPlayerCard';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertOctagon,
  Lightbulb,
  FileText,
  Share2,
  Check,
  Sparkles,
  Video,
} from 'lucide-react';

interface ModulesViewProps {
  initialModuleId?: number;
  completedModules: number[];
  quizScores: Record<number, QuizScoreRecord>;
  onMarkCompleted: (moduleId: number) => void;
  onNavigateToQuiz: (moduleId: number) => void;
}

export const ModulesView: React.FC<ModulesViewProps> = ({
  initialModuleId = 1,
  completedModules,
  quizScores,
  onMarkCompleted,
  onNavigateToQuiz,
}) => {
  const [activeModuleId, setActiveModuleId] = useState<number>(initialModuleId);

  useEffect(() => {
    if (initialModuleId) {
      setActiveModuleId(initialModuleId);
    }
  }, [initialModuleId]);

  const currentModule = modulesData.find((m) => m.id === activeModuleId) || modulesData[0];
  const isCompleted = completedModules.includes(currentModule.id);
  const quizRecord = quizScores[currentModule.id];

  const handleNext = () => {
    if (activeModuleId < modulesData.length) {
      setActiveModuleId(activeModuleId + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (activeModuleId > 1) {
      setActiveModuleId(activeModuleId - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Module Selector Pills */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {modulesData.map((m) => {
            const isActive = m.id === activeModuleId;
            const completed = completedModules.includes(m.id);
            const passed = quizScores[m.id]?.passed;

            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveModuleId(m.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : completed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {completed ? '✓' : m.id}
                </span>
                <span>หน่วยที่ {m.id}</span>
                {passed && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                    ผ่าน
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Module Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Module Header Banner */}
        <div className={`p-6 sm:p-8 bg-gradient-to-r ${currentModule.colorTheme.gradient} text-white relative`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
                หน่วยการเรียนรู้ที่ {currentModule.id}
              </span>
              {currentModule.videos && currentModule.videos.length > 0 && (
                <span className="px-2.5 py-1 bg-rose-500/30 backdrop-blur-md rounded-full text-xs font-medium text-rose-200 border border-rose-400/30 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-rose-300" />
                  <span>{currentModule.videos.length} คลิปวิดีโอ</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-white/90">
              <Clock className="w-3.5 h-3.5" />
              <span>เวลาศึกษาโดยประมาณ: {currentModule.estimatedMinutes} นาที</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {currentModule.title}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            {currentModule.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-white/20">
            <button
              onClick={() => onMarkCompleted(currentModule.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                isCompleted
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-blue-900 hover:bg-blue-50'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isCompleted ? 'เรียนสำเร็จแล้ว (กดเพื่อยืนยันอีกครั้ง)' : 'บันทึกว่าเรียนสำเร็จแล้ว'}</span>
            </button>

            <button
              onClick={() => onNavigateToQuiz(currentModule.id)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold backdrop-blur-md transition border border-white/20"
            >
              <HelpCircle className="w-4 h-4 text-cyan-200" />
              <span>
                {quizRecord ? `ทำแบบทดสอบใหม่ (สูงสุด: ${quizRecord.highestScore}/10)` : 'ทำแบบทดสอบท้ายบท (10 ข้อ)'}
              </span>
            </button>
          </div>
        </div>

        {/* Objectives Box */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>วัตถุประสงค์การเรียนรู้ประจำหน่วย</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {currentModule.objectives.map((obj, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-700"
              >
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </div>
                <span className="leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curated Educational Video Lessons Card */}
        {currentModule.videos && currentModule.videos.length > 0 && (
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-900/2">
            <VideoPlayerCard
              moduleId={currentModule.id}
              moduleTitle={currentModule.title}
              videos={currentModule.videos}
            />
          </div>
        )}

        {/* Detailed Sections */}
        <div className="p-6 sm:p-8 space-y-8">
          {currentModule.sections.map((section, sIdx) => (
            <article key={sIdx} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <div className="w-2 h-5 bg-blue-600 rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {section.title}
                </h2>
              </div>

              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-sans">
                {section.content}
              </div>

              {section.keyPoints && section.keyPoints.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>สาระสำคัญและข้อพึงระวัง:</span>
                  </div>
                  <ul className="space-y-2">
                    {section.keyPoints.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {section.alertNote && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{section.alertNote}</span>
                </div>
              )}
            </article>
          ))}

          {/* Embedded Interactive Widget for Module 3 & 4 */}
          {currentModule.id === 3 && (
            <div className="pt-2">
              <PasswordStrengthTool />
            </div>
          )}

          {currentModule.id === 4 && (
            <div className="pt-2">
              <PhishingInspectorTool />
            </div>
          )}

          {/* Real-life Case Study */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>ตัวอย่างสถานการณ์ในชีวิตจริง (Case Study)</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {currentModule.caseStudy.title}
            </h3>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 bg-white/10 rounded-xl border border-white/10">
                <span className="text-amber-300 font-bold block mb-1">เหตุการณ์:</span>
                <span className="text-slate-200">{currentModule.caseStudy.scenario}</span>
              </div>
              <div className="p-3.5 bg-rose-500/20 rounded-xl border border-rose-400/30">
                <span className="text-rose-300 font-bold block mb-1">ผลกระทบที่เกิดขึ้น:</span>
                <span className="text-slate-200">{currentModule.caseStudy.impact}</span>
              </div>
              <div className="p-3.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
                <span className="text-emerald-300 font-bold block mb-1">แนวทางป้องกันและแก้ไข:</span>
                <span className="text-slate-200">{currentModule.caseStudy.prevention}</span>
              </div>
            </div>
          </div>

          {/* Best Practices & Key Takeaways */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Practices */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>คำแนะนำในการป้องกันและแก้ปัญหา</span>
              </div>
              <ul className="space-y-2">
                {currentModule.bestPractices.map((bp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-emerald-950 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>สรุปความรู้สำคัญประจำหน่วย</span>
              </div>
              <ul className="space-y-2">
                {currentModule.summaryPoints.map((sp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-blue-950 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                    <span>{sp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={activeModuleId === 1}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeModuleId === 1
                ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-500'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>หน่วยก่อนหน้า</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onMarkCompleted(currentModule.id);
                onNavigateToQuiz(currentModule.id);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition transform active:scale-95"
            >
              <HelpCircle className="w-4 h-4" />
              <span>ทำแบบทดสอบท้ายบท (10 ข้อ)</span>
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={activeModuleId === modulesData.length}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              activeModuleId === modulesData.length
                ? 'opacity-40 cursor-not-allowed bg-slate-200 text-slate-500'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
            }`}
          >
            <span>หน่วยถัดไป</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
