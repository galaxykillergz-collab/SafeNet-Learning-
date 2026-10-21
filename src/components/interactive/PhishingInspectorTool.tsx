import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Search, ExternalLink, ShieldAlert, ShieldCheck } from 'lucide-react';

interface SampleURL {
  url: string;
  isPhishing: boolean;
  domain: string;
  clue: string;
  impersonating: string;
}

const sampleURLs: SampleURL[] = [
  {
    url: 'https://kasikornbank.com/th/personal',
    isPhishing: false,
    domain: 'kasikornbank.com',
    clue: 'เป็นโดเมนจริงของธนาคารกสิกรไทย สะกดถูกต้อง ไม่มีคำเติมแต่งหรืออักขระแปลกปลอม',
    impersonating: 'ธนาคารกสิกรไทย (ตัวจริง)',
  },
  {
    url: 'https://k-bank-th-secure-login.cc/verify',
    isPhishing: true,
    domain: 'k-bank-th-secure-login.cc',
    clue: 'มีขีดคั่น มีคำว่า "secure-login" และใช้นามสกุล .cc เป็นเว็บไซต์ฟิชชิ่งปลอมแปลงธนาคาร',
    impersonating: 'แอบอ้างธนาคารกสิกรไทย',
  },
  {
    url: 'https://appleid.apple.com',
    isPhishing: false,
    domain: 'apple.com',
    clue: 'โดเมนหลักคือ apple.com (appleid เป็น subdomain ของทางการ) ถูกต้องและปลอดภัย',
    impersonating: 'Apple Inc. (ตัวจริง)',
  },
  {
    url: 'https://apple-account-unlock-alert.info/auth',
    isPhishing: true,
    domain: 'apple-account-unlock-alert.info',
    clue: 'ใช้ชื่อ Apple ผสมคำว่า "account-unlock" และใช้นามสกุล .info เพื่อหลอกดักรหัสผ่าน Apple ID',
    impersonating: 'แอบอ้าง Apple Support',
  },
  {
    url: 'https://thaipoliceonline.go.th',
    isPhishing: false,
    domain: 'thaipoliceonline.go.th',
    clue: 'ลงท้ายด้วย .go.th ซึ่งเป็นโดเมนสงวนเฉพาะสำหรับหน่วยงานภาครัฐในประเทศไทยเท่านั้น มิจฉาชีพไม่สามารถจดได้',
    impersonating: 'สำนักงานตำรวจแห่งชาติ (ตัวจริง)',
  },
  {
    url: 'https://thai-police-complaint-case1441.online/register',
    isPhishing: true,
    domain: 'thai-police-complaint-case1441.online',
    clue: 'ลงท้ายด้วย .online ไม่ใช่ .go.th มีการแอบอ้างเบอร์ 1441 เป็นแก๊งคอลเซ็นเตอร์หลอกซ้ำซ้อน',
    impersonating: 'แอบอ้างตำรวจไซเบอร์',
  },
];

export const PhishingInspectorTool: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [customInput, setCustomInput] = useState('');
  const [testedCustom, setTestedCustom] = useState<boolean>(false);

  const current = sampleURLs[selectedIdx];

  const handleCustomCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setTestedCustom(true);
  };

  const isCustomSuspicious = customInput.includes('-') || 
    customInput.endsWith('.cc') || 
    customInput.endsWith('.info') || 
    customInput.endsWith('.tk') ||
    customInput.includes('login') ||
    customInput.includes('verify') ||
    customInput.includes('free');

  return (
    <div className="bg-gradient-to-br from-rose-50/70 via-white to-amber-50/40 border border-rose-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-2 text-rose-950 font-bold text-sm sm:text-base">
        <ShieldAlert className="w-5 h-5 text-rose-600" />
        <span>เครื่องมือฝึกวิเคราะห์เว็บไซต์และลิงก์ฟิชชิ่ง (Phishing Spotter)</span>
      </div>
      <p className="text-xs text-slate-600 mb-4">
        คลิกเลือกตัวอย่าง URL ด้านล่างเพื่อฝึกทักษะการสังเกตจุดพิรุธของลิงก์หลอกลวงที่พบบ่อยในประเทศไทย
      </p>

      {/* Preset Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {sampleURLs.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setSelectedIdx(idx);
              setTestedCustom(false);
            }}
            className={`p-2.5 rounded-xl text-left border text-xs transition flex items-center justify-between ${
              selectedIdx === idx && !testedCustom
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="truncate mr-2">
              <span className="font-mono font-medium block truncate text-slate-800">
                {sample.url.replace('https://', '')}
              </span>
              <span className="text-[10px] text-slate-500">{sample.impersonating}</span>
            </div>
            {sample.isPhishing ? (
              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded shrink-0">
                ⚠️ ลิงก์ปลอม
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded shrink-0">
                ✓ ลิงก์จริง
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Analysis Result Box */}
      {!testedCustom ? (
        <div className={`p-4 rounded-xl border ${current.isPhishing ? 'bg-rose-50/80 border-rose-200' : 'bg-emerald-50/80 border-emerald-200'} transition`}>
          <div className="flex items-start gap-3">
            {current.isPhishing ? (
              <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1 text-xs space-y-1">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-bold text-sm text-slate-900">
                  {current.isPhishing ? '🔴 สรุป: เว็บไซต์ฟิชชิ่งอันตราย (Phishing URL)' : '🟢 สรุป: เว็บไซต์ทางการที่ปลอดภัย (Official URL)'}
                </span>
                <span className="font-mono text-[11px] text-slate-600">Domain: {current.domain}</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-sans pt-1">
                <strong>จุดสังเกตสำคัญ:</strong> {current.clue}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Custom URL check result */
        <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 text-xs">
          <div className="font-bold text-slate-800 mb-1">ผลการวิเคราะห์เบื้องต้นสำหรับ: {customInput}</div>
          <p className="text-slate-600">
            {isCustomSuspicious
              ? '⚠️ พบสัญญาณความเสี่ยง: มีคำว่า login/verify/free หรือมีเครื่องหมายขีดคั่นหรือนามสกุลโดเมนที่มักใช้ในเว็บสแปม กรุณาตรวจสอบให้แน่ใจว่าเป็นโดเมนทางการของบริษัทนั้นจริงหรือไม่'
              : 'ℹ️ ไม่พบคำหรือสัญลักษณ์อันตรายทั่วไปเบื้องต้น แต่ยังคงต้องตรวจสอบความถูกต้องของตัวสะกดชื่อโดเมนเสมอ'}
          </p>
        </div>
      )}

      {/* Quick custom test input */}
      <form onSubmit={handleCustomCheck} className="mt-3 flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="หรือลองพิมพ์ชื่อ URL อื่น ๆ เพื่อจำลองการตรวจสอบ..."
          className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-xl transition"
        >
          วิเคราะห์
        </button>
      </form>
    </div>
  );
};
