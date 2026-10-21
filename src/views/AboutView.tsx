import React, { useState } from 'react';
import { AuthorInfo } from '../types';
import { projectInfo, cpsSteps, credibleReferences } from '../data/aboutData';
import {
  Info,
  Lightbulb,
  Cpu,
  Target,
  Users,
  Layers,
  Edit3,
  Save,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  PhoneCall,
  Sparkles,
  School,
  Mail,
  User,
} from 'lucide-react';

interface AboutViewProps {
  authors: AuthorInfo[];
  onSaveAuthors: (authors: AuthorInfo[]) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  authors,
  onSaveAuthors,
}) => {
  const [editingAuthorIdx, setEditingAuthorIdx] = useState<number | null>(null);
  const [authorList, setAuthorList] = useState<AuthorInfo[]>(authors);
  const [editFormData, setEditFormData] = useState<AuthorInfo>(authors[0]);

  const handleStartEdit = (idx: number) => {
    setEditingAuthorIdx(idx);
    setEditFormData({ ...authorList[idx] });
  };

  const handleSaveAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAuthorIdx === null) return;

    const updated = [...authorList];
    updated[editingAuthorIdx] = editFormData;
    setAuthorList(updated);
    onSaveAuthors(updated);
    setEditingAuthorIdx(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-cyan-200 mb-3">
            <Info className="w-3.5 h-3.5" />
            <span>โครงงานพัฒนาสื่อมัลติมีเดียแอปพลิเคชันเพื่อการเรียนรู้</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {projectInfo.titleTh}
          </h1>
          <div className="text-cyan-200 text-sm font-medium mt-1">
            {projectInfo.titleEn}
          </div>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 font-light leading-relaxed">
            {projectInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Project Background & Significance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>ที่มาและความสำคัญของโครงงาน</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line">
          {projectInfo.background}
        </p>

        {/* Objectives & Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Target className="w-4 h-4 text-blue-600" />
              <span>วัตถุประสงค์ของโครงงาน</span>
            </div>
            <ul className="space-y-2">
              {projectInfo.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-blue-950 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-cyan-50/60 border border-cyan-200 rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-cyan-900 font-bold text-sm">
              <Users className="w-4 h-4 text-cyan-700" />
              <span>กลุ่มเป้าหมาย (Target Audience)</span>
            </div>
            <ul className="space-y-2">
              {projectInfo.targetAudience.map((aud, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-cyan-950 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                  <span>{aud}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CPS 5 Steps (Creative Problem Solving) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold mb-1">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Creative Problem Solving Methodology</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              กระบวนการแก้ปัญหาเชิงสร้างสรรค์ (CPS) 5 ขั้นตอน
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">5 Phases Flow</span>
        </div>

        <div className="space-y-5">
          {cpsSteps.map((step) => (
            <div
              key={step.step}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-xs transition space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      ขั้นตอนที่ {step.step}: {step.nameTh}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Phase {step.step}: {step.nameEn}
                    </div>
                  </div>
                </div>

                <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-blue-700 font-medium">
                  ผลลัพธ์: {step.output}
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {step.description}
              </p>

              {/* Activities list */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 block">กิจกรรมที่ดำเนินการ:</span>
                <ul className="space-y-1">
                  {step.activities.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0"></span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Vibe Coding Process & Technologies */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>กระบวนการ AI Vibe Coding & เทคโนโลยีที่ใช้</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
          {projectInfo.vibeCodingProcess}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {projectInfo.toolsAndTech.map((tool, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
              <div className="font-bold text-slate-900 text-xs sm:text-sm">{tool.name}</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Authors & Advisors (Editable & Stored in LocalStorage) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>ข้อมูลผู้จัดทำและอาจารย์ที่ปรึกษา (สามารถแก้ไขได้)</span>
            </h2>
            <p className="text-xs text-slate-500">
              คลิกปุ่ม &quot;แก้ไขข้อมูล&quot; เพื่อปรับเปลี่ยนชื่อ รหัสนักศึกษา คณะ และสถาบันตามการนำเสนอจริง
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {authorList.map((author, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 relative space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{author.name}</h3>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {author.role}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartEdit(idx)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="แก้ไขข้อมูล"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-1">
                {author.studentId && <div><strong>สังกัด/รหัส:</strong> {author.studentId}</div>}
                {author.faculty && <div><strong>สาขา/คณะ:</strong> {author.faculty}</div>}
                <div><strong>สถาบัน:</strong> {author.institution}</div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                  <Mail className="w-3 h-3" />
                  <span>{author.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Author Modal / In-place Form */}
        {editingAuthorIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                แก้ไขข้อมูล: {authorList[editingAuthorIdx].role}
              </h3>

              <form onSubmit={handleSaveAuthor} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ชื่อ - นามสกุล</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">บทบาท / ตำแหน่ง</label>
                  <input
                    type="text"
                    required
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">รหัสนักศึกษา / สังกัด</label>
                  <input
                    type="text"
                    value={editFormData.studentId || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, studentId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">สาขาวิชา / คณะ</label>
                  <input
                    type="text"
                    value={editFormData.faculty || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, faculty: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">สถาบันการศึกษา / มหาวิทยาลัย</label>
                  <input
                    type="text"
                    required
                    value={editFormData.institution}
                    onChange={(e) => setEditFormData({ ...editFormData, institution: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">อีเมลติดต่อ</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingAuthorIdx(null)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกข้อมูล</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Credible References & Government Hotlines */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>แหล่งอ้างอิงความรู้และหน่วยงานที่น่าเชื่อถือ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {credibleReferences.map((ref, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-blue-200 transition space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{ref.name}</h4>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 shrink-0"
                  title="เปิดเว็บไซต์ทางการ"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{ref.role}</p>
              <div className="pt-2 border-t border-slate-200/80 flex items-center gap-1.5 text-[10px] text-blue-800 font-medium">
                <PhoneCall className="w-3 h-3 text-emerald-600" />
                <span>{ref.hotline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
