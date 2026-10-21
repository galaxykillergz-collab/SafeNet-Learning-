import React from 'react';
import { LearningModule, UserProfile, QuizScoreRecord } from '../types';
import { modulesData } from '../data/modulesData';
import {
  ShieldCheck,
  BookOpen,
  HelpCircle,
  BarChart3,
  FileCheck2,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Lock,
  Users,
  AlertTriangle,
  Lightbulb,
  Video,
} from 'lucide-react';

interface HomeDashboardProps {
  onNavigate: (tab: string, moduleId?: number) => void;
  user: UserProfile;
  completedModules: number[];
  quizScores: Record<number, QuizScoreRecord>;
  onOpenCert: () => void;
  onOpenAuth: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  user,
  completedModules,
  quizScores,
  onOpenCert,
  onOpenAuth,
}) => {
  const totalModules = modulesData.length;
  const completedCount = completedModules.length;
  const passedCount = Object.values(quizScores).filter((q) => q.passed).length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  // Find next uncompleted module
  const nextModule = modulesData.find((m) => !completedModules.includes(m.id)) || modulesData[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-blue-900/10 border border-blue-500/20">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-cyan-200 border border-white/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>โครงงานพัฒนาสื่อมัลติมีเดียด้วยกระบวนการ CPS 5 ขั้นตอน</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            ยินดีต้อนรับสู่ <span className="text-cyan-300">SafeNet Learning</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100 mt-2 font-light leading-relaxed">
            แหล่งเรียนรู้ออนไลน์เพื่อสร้างภูมิคุ้มกันดิจิทัล เรียนรู้การป้องกันภัยคุกคามทางไซเบอร์ ปกป้องข้อมูลส่วนบุคคล และทดสอบสมรรถนะความรู้ผ่านแบบทดสอบ 70 ข้อ
          </p>

          {/* User Status Bar inside Banner */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-blue-200">ผู้ใช้งาน:</span>
              <strong className="text-white font-medium">{user.name}</strong>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  user.role === 'admin'
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-cyan-500/80 text-white'
                }`}
              >
                {user.role === 'admin' ? '🛡️ Admin' : '👤 User'}
              </span>
              {user.isGmail && (
                <span className="px-1.5 py-0.5 bg-emerald-500/80 text-[10px] rounded-md font-mono">Gmail</span>
              )}
            </div>

            <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-blue-200">รหัส/สังกัด: </span>
              <span className="text-white font-medium">
                {user.studentId ? `${user.studentId} • ` : ''}{user.institution || 'ทั่วไป'}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('modules', nextModule.id)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-800 hover:bg-cyan-50 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-95"
            >
              <span>{completedCount === 0 ? 'เริ่มเรียนรู้หน่วยที่ 1' : `เรียนต่อ: ${nextModule.shortTitle}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('quiz')}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/20 backdrop-blur-md transition"
            >
              <HelpCircle className="w-4 h-4 text-cyan-300" />
              <span>ทำแบบทดสอบ (70 ข้อ)</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition transform active:scale-95"
              >
                <span>แผงควบคุม Admin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenCert}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border backdrop-blur-md text-xs font-semibold transition ${
                passedCount >= 7
                  ? 'bg-amber-400 text-slate-900 border-amber-300 font-bold shadow-lg'
                  : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{passedCount >= 7 ? 'รับใบประกาศนียบัตร' : 'เกณฑ์ใบประกาศฯ'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Modules */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">บทเรียนทั้งหมด</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalModules} <span className="text-sm font-medium text-slate-500">หน่วย</span></div>
          <p className="text-xs text-slate-500 mt-1">เนื้อหามาตรฐาน ปฏิบัติได้จริง</p>
        </div>

        {/* Card 2: Completed Modules */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">เรียนสำเร็จแล้ว</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{completedCount} <span className="text-sm font-medium text-slate-500">/ {totalModules} หน่วย</span></div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Card 3: Overall Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-cyan-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ความคืบหน้ารวม</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-700">{progressPercent}%</div>
          <p className="text-xs text-slate-500 mt-1">
            {progressPercent === 100 ? '🎉 ยอดเยี่ยม! สำเร็จครบทุกหน่วย' : 'กำลังก้าวหน้าอย่างต่อเนื่อง'}
          </p>
        </div>

        {/* Card 4: Passed Quizzes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-200 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ผ่านแบบทดสอบ</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">{passedCount} <span className="text-sm font-medium text-slate-500">/ {totalModules} ชุด</span></div>
          <p className="text-xs text-slate-500 mt-1">เกณฑ์ผ่าน 80% (8/10 คะแนน)</p>
        </div>
      </section>

      {/* Modules Roadmap Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              หน่วยการเรียนรู้ทั้ง 7 หน่วย (Learning Modules)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              ออกแบบอย่างเป็นระบบ ครอบคลุมตั้งแต่พื้นฐาน ข้อมูลส่วนตัว รหัสผ่าน ข่าวปลอม จนถึงจริยธรรมดิจิทัล
            </p>
          </div>
          <button
            onClick={() => onNavigate('modules')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>ดูทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulesData.map((module) => {
            const isCompleted = completedModules.includes(module.id);
            const scoreRec = quizScores[module.id];
            const isPassed = scoreRec?.passed;

            return (
              <div
                key={module.id}
                onClick={() => onNavigate('modules', module.id)}
                className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between ${
                  isCompleted ? 'border-emerald-200 hover:border-emerald-300' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${module.colorTheme.badge}`}>
                      หน่วยที่ {module.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {module.videos && module.videos.length > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <Video className="w-3 h-3 text-rose-500" />
                          <span>{module.videos.length} คลิป</span>
                        </span>
                      )}
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>เรียนแล้ว</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>~{module.estimatedMinutes} นาที</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base line-clamp-1">
                    {module.title.replace(`หน่วยที่ ${module.id}: `, '')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {module.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  {scoreRec ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">คะแนนสูงสุด:</span>
                      <span className={`font-bold font-mono ${isPassed ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {scoreRec.highestScore}/10
                      </span>
                      {isPassed ? (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 rounded">ผ่าน</span>
                      ) : (
                        <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 rounded">ทบทวน</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400">ยังไม่ได้ทำแบบทดสอบ</span>
                  )}

                  <span className="font-semibold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>เข้าเรียน</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Launchpad & CPS Highlight */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box 1: Quick Quiz & Evaluation */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-xs font-semibold text-cyan-200 mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>การประเมินและการวัดผล</span>
            </div>
            <h3 className="text-xl font-bold">แบบทดสอบ 70 ข้อ และแบบประเมิน 16 ข้อ</h3>
            <p className="text-xs text-blue-200 mt-1.5 leading-relaxed">
              วัดผลสัมฤทธิ์ทางการเรียนรู้ด้วยแบบทดสอบปรนัย 4 ตัวเลือก พร้อมเฉลยละเอียด และร่วมประเมินความพึงพอใจ 4 ด้านตามมาตราส่วน Likert Scale
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('quiz')}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
            >
              เริ่มทำแบบทดสอบ (Quiz)
            </button>
            <button
              onClick={() => onNavigate('evaluation')}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-medium text-xs rounded-xl border border-white/20 transition"
            >
              ทำแบบประเมินความคิดเห็น
            </button>
          </div>
        </div>

        {/* Box 2: CPS Process Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-50 text-cyan-800 rounded-lg text-xs font-semibold mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-cyan-600" />
              <span>กระบวนการคิดเชิงสร้างสรรค์ (CPS)</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">ขับเคลื่อนด้วย CPS 5 ขั้นตอน & AI Vibe Coding</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              โครงงานนี้ประยุกต์ใช้ Creative Problem Solving: ระบุปัญหา (Problem Identification), ค้นหาข้อมูล (Fact Finding), เลือกแนวคิด (Idea Finding), พัฒนานวัตกรรม (Solution Development) และประเมินผล (Evaluation)
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex -space-x-1 overflow-hidden">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-700"
                >
                  {s}
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('about')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>อ่านรายละเอียด CPS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
