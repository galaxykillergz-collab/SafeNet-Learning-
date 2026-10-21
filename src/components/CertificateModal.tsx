import React, { useRef } from 'react';
import { UserProfile } from '../types';
import { X, Award, Printer, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  completedCount: number;
  passedCount: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  user,
  completedCount,
  passedCount,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isEligible = passedCount >= 7; // All 7 quizzes passed

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const certNumber = `SN-${new Date().getFullYear()}-${Math.abs(
    (user.name + user.email).split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  ).toString().padStart(6, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">ใบประกาศนียบัตรรับรองสมรรถนะความปลอดภัยไซเบอร์</span>
          </div>
          <div className="flex items-center gap-3">
            {isEligible && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg transition"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์ / บันทึกเป็น PDF</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isEligible ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              ยังไม่ผ่านเกณฑ์การรับใบประกาศนียบัตร
            </h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              เพื่อรับใบประกาศนียบัตรอย่างเป็นทางการ ท่านต้องทำแบบทดสอบให้ผ่านเกณฑ์ 80% (อย่างน้อย 8/10 คะแนน) ครบทั้ง 7 หน่วยการเรียนรู้
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700">
              <span>ความคืบหน้าปัจจุบัน: ผ่านแบบทดสอบแล้ว</span>
              <span className="text-blue-600 font-bold">{passedCount} / 7 หน่วย</span>
            </div>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition"
              >
                กลับไปศึกษาบทเรียนและทำแบบทดสอบ
              </button>
            </div>
          </div>
        ) : (
          /* Certificate Printable Canvas */
          <div className="p-8 bg-slate-50 print:p-0 print:bg-white" ref={printRef}>
            <div className="relative border-8 border-double border-amber-600/60 bg-gradient-to-b from-white via-cyan-50/20 to-blue-50/30 p-8 sm:p-12 rounded-2xl shadow-inner text-center">
              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500 pointer-events-none"></div>
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500 pointer-events-none"></div>
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500 pointer-events-none"></div>
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500 pointer-events-none"></div>

              {/* Header */}
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-amber-400">
                  <ShieldCheck className="w-9 h-9" />
                </div>
              </div>

              <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
                SAFENET LEARNING • CREATIVE PROBLEM SOLVING PROJECT
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ใบประกาศนียบัตรรับรองสมรรถนะ
              </h2>
              <div className="text-sm font-medium text-cyan-800 mt-1">
                Certificate of Cyber Safety & Digital Literacy Competency
              </div>

              {/* Certificate Body */}
              <div className="my-6">
                <p className="text-xs text-slate-600">ขอมอบประกาศนียบัตรฉบับนี้ไว้เพื่อแสดงว่า</p>
                <div className="my-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 border-b-2 border-amber-400/80 inline-block px-8 pb-1">
                    {user.name}
                  </h1>
                </div>
                <p className="text-xs text-slate-600">
                  {user.institution || 'สถาบันการศึกษา / ผู้เรียนรู้ตลอดชีวิต'}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>

                <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto mt-4 leading-relaxed">
                  ได้ผ่านการศึกษาและผ่านการประเมินผลสัมฤทธิ์ทางการเรียนรู้เรื่อง <br />
                  <strong className="text-slate-900 font-semibold">
                    “การใช้อินเทอร์เน็ตอย่างปลอดภัยและการป้องกันภัยคุกคามทางไซเบอร์”
                  </strong>
                  <br />
                  ครบถ้วนทั้ง 7 หน่วยการเรียนรู้ ด้วยคะแนนไม่ต่ำกว่าร้อยละ 80 ตามเกณฑ์มาตรฐานโครงงาน CPS
                </p>
              </div>

              {/* Competency Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-6 text-[10px] text-slate-600 max-w-lg mx-auto">
                <span className="p-1.5 bg-white/80 border border-slate-200 rounded-lg flex items-center justify-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> พื้นฐานอินเทอร์เน็ต
                </span>
                <span className="p-1.5 bg-white/80 border border-slate-200 rounded-lg flex items-center justify-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ปกป้องข้อมูลส่วนบุคคล
                </span>
                <span className="p-1.5 bg-white/80 border border-slate-200 rounded-lg flex items-center justify-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> รหัสผ่านและ 2FA
                </span>
                <span className="p-1.5 bg-white/80 border border-slate-200 rounded-lg flex items-center justify-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> รู้ทันฟิชชิ่ง & กลโกง
                </span>
                <span className="p-1.5 bg-white/80 border border-slate-200 rounded-lg flex items-center justify-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ปลอดภัยบนโซเชียล
                </span>
                <span className="p-1.5 bg-white/80 border border-slate-200 rounded-lg flex items-center justify-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> รู้เท่าทันข่าวปลอม
                </span>
                <span className="p-1.5 bg-white/80 border border-slate-200 rounded-lg flex items-center justify-center gap-1 shadow-sm col-span-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ใช้อินเทอร์เน็ตอย่างรับผิดชอบ
                </span>
              </div>

              {/* Signatures & Verification */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 gap-8 items-end">
                <div className="text-left text-[11px] text-slate-500 font-mono">
                  <div>เลขที่ประกาศนียบัตร: {certNumber}</div>
                  <div>ออกให้ ณ วันที่: {currentDate}</div>
                  <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> ยืนยันข้อมูลผ่าน SafeNet Verification
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block text-center border-t border-slate-400 pt-1.5 px-6">
                    <div className="text-xs font-bold text-slate-800">คณะกรรมการโครงงาน SafeNet Learning</div>
                    <div className="text-[10px] text-slate-500">นวัตกรรมสื่อเพื่อการเรียนรู้ดิจิทัล (CPS 5 ขั้นตอน)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
