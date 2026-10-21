import React from 'react';
import { QuizScoreRecord } from '../types';
import { modulesData } from '../data/modulesData';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Award,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
} from 'lucide-react';

interface ResultsViewProps {
  completedModules: number[];
  quizScores: Record<number, QuizScoreRecord>;
  onNavigateToQuiz: (moduleId: number) => void;
  onNavigateToModule: (moduleId: number) => void;
  onOpenCert: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  completedModules,
  quizScores,
  onNavigateToQuiz,
  onNavigateToModule,
  onOpenCert,
}) => {
  const totalModules = modulesData.length;
  const completedCount = completedModules.length;

  // Calculate actual scores from user data
  let totalScore = 0;
  let maxPossibleScore = totalModules * 10; // 70 total
  let attemptedModulesCount = 0;
  let passedCount = 0;

  const modulesStats = modulesData.map((m) => {
    const record = quizScores[m.id];
    const score = record?.highestScore ?? 0;
    const isAttempted = record !== undefined;
    const isPassed = record?.passed ?? false;

    if (isAttempted) {
      attemptedModulesCount += 1;
      totalScore += score;
    }
    if (isPassed) {
      passedCount += 1;
    }

    return {
      module: m,
      record,
      score,
      isAttempted,
      isPassed,
      completed: completedModules.includes(m.id),
    };
  });

  const overallPercentage =
    attemptedModulesCount > 0
      ? Math.round((totalScore / (totalModules * 10)) * 100)
      : 0;

  const studyProgress = Math.round((completedCount / totalModules) * 100);

  // Filter modules needing review:
  // 1) Attempted but failed (< 8)
  // 2) Not yet attempted
  const failedModules = modulesStats.filter((m) => m.isAttempted && !m.isPassed);
  const unattemptedModules = modulesStats.filter((m) => !m.isAttempted);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-cyan-200 mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>ระบบวิเคราะห์และติดตามผลการเรียนรู้จริง (Learning Analytics)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            แดชบอร์ดผลการเรียนรู้ของคุณ
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 font-light leading-relaxed">
            สรุปข้อมูลสถิติคะแนนจริงจากการทำแบบทดสอบ 70 ข้อ สถานะการเรียนรู้ และข้อแนะนำสำหรับพัฒนาตนเอง
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/20">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-blue-100 font-medium">ความก้าวหน้าการเรียนรู้และการสอบรวม:</span>
            <span className="font-bold text-white font-mono text-sm">{overallPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${overallPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            หน่วยที่เรียนสำเร็จ
          </span>
          <div className="text-2xl font-black text-slate-900">
            {completedCount} <span className="text-sm font-medium text-slate-400">/ {totalModules}</span>
          </div>
          <div className="text-xs text-blue-600 font-medium mt-1">ความคืบหน้า {studyProgress}%</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            คะแนนสอบรวมทั้งหมด
          </span>
          <div className="text-2xl font-black text-blue-700 font-mono">
            {totalScore} <span className="text-sm font-medium text-slate-400">/ 70</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">จากข้อสอบจริงทั้งหมด 70 ข้อ</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            สถานะการผ่านเกณฑ์
          </span>
          <div className="text-2xl font-black text-emerald-700">
            {passedCount} <span className="text-sm font-medium text-slate-400">/ {totalModules} หน่วย</span>
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            {passedCount === 7 ? '🎉 ผ่านเกณฑ์ครบทุกหน่วย!' : `เหลืออีก ${7 - passedCount} หน่วย`}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              สิทธิ์รับใบประกาศนียบัตร
            </span>
            <div className="text-base font-bold text-slate-800">
              {passedCount >= 7 ? '✓ มีสิทธิ์รับแล้ว' : 'ยังไม่ผ่านเกณฑ์'}
            </div>
          </div>
          <button
            onClick={onOpenCert}
            className={`mt-2 w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              passedCount >= 7
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>{passedCount >= 7 ? 'เปิดดูใบประกาศฯ' : 'ตรวจสอบเงื่อนไข'}</span>
          </button>
        </div>
      </div>

      {/* Visual Score Comparison Bar Chart */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>แผนภูมิเปรียบเทียบผลคะแนนสอบแต่ละหน่วย (คะแนนเต็ม 10)</span>
            </h2>
            <p className="text-xs text-slate-500">
              เส้นประสีเขียวระบุเกณฑ์ขั้นต่ำในการผ่าน (8 คะแนน หรือ 80%)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span> ผ่าน (&gt;= 8)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-400"></span> ไม่ผ่าน (&lt;8)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200"></span> ยังไม่สอบ
            </span>
          </div>
        </div>

        {/* Visual Chart Bars */}
        <div className="space-y-4 pt-2">
          {modulesStats.map(({ module, score, isAttempted, isPassed }) => {
            const barWidthPercent = (score / 10) * 100;

            return (
              <div key={module.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      หน่วยที่ {module.id}:
                    </span>
                    <span className="text-slate-600 truncate max-w-[200px] sm:max-w-md">
                      {module.shortTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {isAttempted ? `${score} / 10` : 'ยังไม่สอบ'}
                    </span>
                    {isAttempted && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isPassed ? 'ผ่าน' : 'ไม่ผ่าน'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Track with Benchmark line at 80% */}
                <div className="relative w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                  {/* Passing Threshold 80% guide marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-emerald-600/70 z-10"
                    style={{ left: '80%' }}
                    title="เกณฑ์ผ่าน 8 คะแนน"
                  ></div>

                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      !isAttempted
                        ? 'bg-slate-200'
                        : isPassed
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-r from-rose-500 to-amber-500'
                    }`}
                    style={{ width: `${Math.max(isAttempted ? 6 : 0, barWidthPercent)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Module Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            ตารางสถานะและผลคะแนนรายหน่วยอย่างละเอียด
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">หน่วยการเรียนรู้</th>
                <th className="py-3 px-4">สถานะบทเรียน</th>
                <th className="py-3 px-4 text-center">คะแนนสูงสุด</th>
                <th className="py-3 px-4 text-center">ผลการประเมิน</th>
                <th className="py-3 px-4 text-center">จำนวนครั้งที่สอบ</th>
                <th className="py-3 px-4 text-right">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modulesStats.map(({ module, record, score, isAttempted, isPassed, completed }) => (
                <tr key={module.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    <div className="font-bold text-slate-900">หน่วยที่ {module.id}: {module.shortTitle}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{module.subtitle}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {completed ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>เรียนสำเร็จ</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">ยังไม่สำเร็จ</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-sm">
                    {isAttempted ? `${score}/10` : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {isAttempted ? (
                      isPassed ? (
                        <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          ผ่านเกณฑ์ (80%+)
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-[10px]">
                          ไม่ผ่านเกณฑ์
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400">ยังไม่ได้ทดสอบ</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                    {record?.attempts ?? 0}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => onNavigateToModule(module.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition"
                    >
                      อ่านบทเรียน
                    </button>
                    <button
                      onClick={() => onNavigateToQuiz(module.id)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-medium transition"
                    >
                      {isAttempted ? 'สอบใหม่' : 'เข้าสอบ'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations & Actionable Review Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Target className="w-5 h-5 text-blue-600" />
          <span>คำแนะนำส่วนบุคคลเพื่อการพัฒนาการเรียนรู้ (Personalized Recommendations)</span>
        </div>

        {failedModules.length === 0 && unattemptedModules.length === 0 ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-sm">
            <Sparkles className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <strong>ยินดีด้วย! ท่านสอบผ่านเกณฑ์มาตรฐานครบทั้ง 7 หน่วยการเรียนรู้แล้ว</strong>
              <p className="text-xs text-emerald-700 mt-0.5">
                ท่านพร้อมสำหรับการรับใบประกาศนียบัตรรับรองสมรรถนะ และร่วมทำแบบประเมินความคิดเห็นต่อระบบ
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {failedModules.length > 0 && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>หน่วยที่ยังไม่ผ่านเกณฑ์ (ได้ต่ำกว่า 8 คะแนน) ควรกลับไปทบทวน:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {failedModules.map(({ module, score }) => (
                    <div
                      key={module.id}
                      className="p-2.5 bg-white rounded-xl border border-rose-200 flex items-center justify-between text-xs"
                    >
                      <div className="truncate mr-2">
                        <span className="font-bold text-slate-800">หน่วยที่ {module.id}:</span>{' '}
                        <span className="text-slate-600">{module.shortTitle}</span>
                        <span className="block text-[11px] text-rose-600 font-mono">คะแนนล่าสุด: {score}/10</span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => onNavigateToModule(module.id)}
                          className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[10px] font-semibold"
                        >
                          ทบทวน
                        </button>
                        <button
                          onClick={() => onNavigateToQuiz(module.id)}
                          className="px-2 py-1 bg-rose-600 text-white hover:bg-rose-700 rounded text-[10px] font-semibold"
                        >
                          สอบแก้ตัว
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {unattemptedModules.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-800">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>หน่วยที่ยังไม่ได้ทำแบบทดสอบ ({unattemptedModules.length} หน่วย):</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {unattemptedModules.map(({ module }) => (
                    <button
                      key={module.id}
                      onClick={() => onNavigateToQuiz(module.id)}
                      className="px-3 py-1.5 bg-white border border-blue-200 hover:border-blue-400 text-blue-800 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <span>หน่วยที่ {module.id}: {module.shortTitle}</span>
                      <ArrowRight className="w-3 h-3 text-blue-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
