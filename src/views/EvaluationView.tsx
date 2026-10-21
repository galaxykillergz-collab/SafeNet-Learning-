import React, { useState } from 'react';
import { EvaluationResult, EvaluationItem } from '../types';
import {
  evaluationCategories,
  evaluationItems,
  likertScaleOptions,
  getScoreInterpretation,
} from '../data/evaluationData';
import {
  FileCheck2,
  CheckCircle2,
  Send,
  RotateCcw,
  BarChart3,
  Sparkles,
  Heart,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Palette,
  LayoutGrid,
  HeartHandshake,
} from 'lucide-react';

interface EvaluationViewProps {
  evaluationResult: EvaluationResult | null;
  onSaveEvaluation: (result: EvaluationResult) => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  evaluationResult,
  onSaveEvaluation,
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>(
    evaluationResult?.answers || {}
  );
  const [submitted, setSubmitted] = useState<boolean>(!!evaluationResult);
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalItems = evaluationItems.length;
  const answeredCount = Object.keys(answers).length;

  const handleScoreSelect = (itemId: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [itemId]: score,
    }));
    if (validationError) setValidationError(null);
  };

  const handleResetForm = () => {
    setAnswers({});
    setSubmitted(false);
    setValidationError(null);
  };

  const calculateResults = (): EvaluationResult => {
    const categorySums: Record<string, { sum: number; count: number }> = {
      content: { sum: 0, count: 0 },
      design: { sum: 0, count: 0 },
      usability: { sum: 0, count: 0 },
      satisfaction: { sum: 0, count: 0 },
    };

    let totalSum = 0;

    evaluationItems.forEach((item) => {
      const score = answers[item.id] || 0;
      categorySums[item.category].sum += score;
      categorySums[item.category].count += 1;
      totalSum += score;
    });

    const categoryAverages = {
      content: Number((categorySums.content.sum / categorySums.content.count).toFixed(2)),
      design: Number((categorySums.design.sum / categorySums.design.count).toFixed(2)),
      usability: Number((categorySums.usability.sum / categorySums.usability.count).toFixed(2)),
      satisfaction: Number((categorySums.satisfaction.sum / categorySums.satisfaction.count).toFixed(2)),
    };

    const overallAverage = Number((totalSum / totalItems).toFixed(2));

    return {
      answers,
      submittedAt: new Date().toISOString(),
      categoryAverages,
      overallAverage,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (answeredCount < totalItems) {
      setValidationError(`กรุณาตอบแบบประเมินให้ครบทั้ง 16 ข้อ (ปัจจุบันตอบแล้ว ${answeredCount} ข้อ)`);
      return;
    }

    const result = calculateResults();
    onSaveEvaluation(result);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeResult = submitted ? (evaluationResult || calculateResults()) : null;

  const getCategoryIcon = (key: string) => {
    switch (key) {
      case 'content':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'design':
        return <Palette className="w-5 h-5 text-indigo-600" />;
      case 'usability':
        return <LayoutGrid className="w-5 h-5 text-cyan-600" />;
      case 'satisfaction':
        return <HeartHandshake className="w-5 h-5 text-emerald-600" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-cyan-200 mb-3">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>ขั้นตอนที่ 5 ของกระบวนการ CPS: การประเมินผลและการปรับปรุง</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            แบบประเมินความคิดเห็นต่อแอปพลิเคชัน
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 font-light leading-relaxed">
            ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการนำไปปรับปรุงและพัฒนาสื่อการเรียนรู้ SafeNet Learning ให้มีประสิทธิภาพสูงสุด (มาตราส่วน 5 ระดับ Likert Scale รวม 16 ข้อ)
          </p>
        </div>

        {/* Status in Banner */}
        <div className="mt-5 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-blue-100">
          <span>ความคืบหน้าการตอบแบบประเมิน:</span>
          <span className="font-mono font-bold text-white text-sm">
            {answeredCount} / {totalItems} ข้อ ({Math.round((answeredCount / totalItems) * 100)}%)
          </span>
        </div>
      </div>

      {/* Submitted Result Analytics Display */}
      {submitted && activeResult && (
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-emerald-950">
                  ขอบพระคุณสำหรับการประเมินความคิดเห็น!
                </h2>
                <p className="text-xs text-emerald-800">
                  ข้อมูลการประเมินถูกบันทึกลงในระบบเรียบร้อยแล้ว
                </p>
              </div>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 shadow-2xs transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
              <span>แก้ไขคำตอบแบบประเมิน</span>
            </button>
          </div>

          {/* Overall Score Highlight */}
          <div className="text-center p-6 bg-slate-50/70 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              ค่าเฉลี่ยความพึงพอใจในภาพรวม (Overall Average)
            </span>
            <div className="text-4xl sm:text-5xl font-black text-blue-700 font-mono my-2">
              {activeResult.overallAverage.toFixed(2)}{' '}
              <span className="text-xl font-normal text-slate-400">/ 5.00</span>
            </div>
            {(() => {
              const interp = getScoreInterpretation(activeResult.overallAverage);
              return (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${interp.color}`}>
                  ระดับ: {interp.label}
                </span>
              );
            })()}
          </div>

          {/* Category Score Breakdown */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>ผลคะแนนเฉลี่ยจำแนกตามรายด้าน (4 ด้าน):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {evaluationCategories.map((cat) => {
                const avg = activeResult.categoryAverages[cat.key];
                const interp = getScoreInterpretation(avg);
                const percent = (avg / 5) * 100;

                return (
                  <div key={cat.key} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-slate-800 text-xs sm:text-sm">
                        {getCategoryIcon(cat.key)}
                        <span>{cat.title}</span>
                      </div>
                      <span className="font-mono font-bold text-blue-700 text-base">
                        {avg.toFixed(2)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2.5 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                      <span>{interp.label}</span>
                      <span>{percent.toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Form / Likert Assessment Table */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Scale Legend */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-700 mb-2">เกณฑ์การให้คะแนน (5-Point Likert Scale):</div>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {likertScaleOptions.map((opt) => (
              <div key={opt.score} className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-mono font-bold text-slate-900 text-sm">{opt.score}</div>
                <div className="text-[11px] text-slate-600 truncate">{opt.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Warning Alert */}
        {validationError && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-800 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-medium">{validationError}</span>
          </div>
        )}

        {/* 4 Categories */}
        {evaluationCategories.map((category) => {
          const items = evaluationItems.filter((item) => item.category === category.key);

          return (
            <div
              key={category.key}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Category Header */}
              <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  {getCategoryIcon(category.key)}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {category.title}
                  </h2>
                  <p className="text-xs text-slate-500">{category.description}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {items.map((item, idx) => {
                  const currentScore = answers[item.id];

                  return (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 hover:bg-slate-50/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                          {item.text}
                        </p>
                      </div>

                      {/* 1 to 5 Score Radio Group */}
                      <div className="flex items-center gap-1.5 sm:gap-2 self-end md:self-center shrink-0">
                        {likertScaleOptions.map((opt) => {
                          const isSelected = currentScore === opt.score;

                          return (
                            <button
                              key={opt.score}
                              type="button"
                              onClick={() => handleScoreSelect(item.id, opt.score)}
                              className={`w-10 h-10 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border ${
                                isSelected
                                  ? `${opt.color} shadow-sm ring-2 ring-blue-300 scale-105`
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                              title={`${opt.score} = ${opt.label}`}
                            >
                              <span>{opt.score}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Submit Actions */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            สถานะการตอบ:{' '}
            <strong className={answeredCount === totalItems ? 'text-emerald-700' : 'text-amber-700'}>
              {answeredCount} จาก {totalItems} ข้อ
            </strong>{' '}
            {answeredCount === totalItems && '✓ ครบถ้วนพร้อมส่ง'}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              ล้างคำตอบ
            </button>

            <button
              type="submit"
              disabled={answeredCount < totalItems}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${
                answeredCount === totalItems
                  ? 'bg-blue-600 hover:bg-blue-700 text-white transform active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>บันทึกและส่งผลการประเมิน</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
