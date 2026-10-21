import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const PasswordStrengthTool: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Criteria checks
  const hasLength = password.length >= 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passedCriteria = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  let strengthLabel = 'ยังไม่มีข้อมูล';
  let strengthColor = 'bg-slate-200 text-slate-700';
  let crackTime = 'พิมพ์รหัสผ่านเพื่อทดสอบ';

  if (password.length > 0) {
    if (password.length < 8) {
      strengthLabel = 'อันตรายมาก (อ่อนแอมาก)';
      strengthColor = 'bg-rose-500 text-white';
      crackTime = 'ถูกเจาะได้ทันที (< 1 วินาที)';
    } else if (passedCriteria <= 2) {
      strengthLabel = 'อ่อนแอ';
      strengthColor = 'bg-orange-500 text-white';
      crackTime = 'ประมาณ 2 - 10 นาที';
    } else if (passedCriteria === 3) {
      strengthLabel = 'ปานกลาง';
      strengthColor = 'bg-amber-500 text-white';
      crackTime = 'ประมาณ 3 สัปดาห์ ถึง 2 เดือน';
    } else if (passedCriteria === 4) {
      strengthLabel = 'แข็งแกร่งดี';
      strengthColor = 'bg-teal-500 text-white';
      crackTime = 'ประมาณ 50 - 200 ปี';
    } else {
      strengthLabel = 'แข็งแกร่งระดับสูงสุด (แนะนำ)';
      strengthColor = 'bg-emerald-600 text-white';
      crackTime = 'ต้องใช้เวลาหลายล้านปีในการสุ่มเดา';
    }
  }

  const samplePassphrases = [
    'Coffee!River7SunnyMorning',
    'Tiger#BlueSky$Run9Run',
    'Green@Mountain$Book42!',
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 border border-indigo-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-3 text-indigo-950 font-bold text-sm sm:text-base">
        <KeyRound className="w-5 h-5 text-indigo-600" />
        <span>เครื่องมือทดสอบความปลอดภัยของรหัสผ่าน (Interactive Tool)</span>
      </div>
      <p className="text-xs text-slate-600 mb-4">
        ทดลองพิมพ์รหัสผ่านจำลอง เพื่อดูว่าคอมพิวเตอร์และแฮกเกอร์จะใช้เวลาถอดรหัสนานเท่าใด (ระบบไม่บันทึกข้อมูลใด ๆ ทั้งสิ้น)
      </p>

      {/* Input */}
      <div className="relative mb-3">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="ลองพิมพ์รหัสผ่าน เช่น Pass123 หรือ Blue$TreeMorning9"
          className="w-full pl-3.5 pr-10 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
          title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Strength Bar */}
      {password.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-slate-700">ระดับความแข็งแกร่ง:</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${strengthColor}`}>
              {strengthLabel}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${
                passedCriteria <= 2
                  ? 'bg-rose-500'
                  : passedCriteria === 3
                  ? 'bg-amber-500'
                  : passedCriteria === 4
                  ? 'bg-teal-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.max(10, (passedCriteria / 5) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
            <span>⏱️ เวลาประเมินในการถอดรหัส (Brute Force):</span>
            <span className="font-semibold text-indigo-900">{crackTime}</span>
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] text-slate-600 mb-3">
        <div className={`flex items-center gap-1 ${hasLength ? 'text-emerald-700 font-medium' : ''}`}>
          {hasLength ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 inline-block text-slate-300">•</span>}
          <span>ยาว 12 ตัวอักษรขึ้นไป</span>
        </div>
        <div className={`flex items-center gap-1 ${hasUpper ? 'text-emerald-700 font-medium' : ''}`}>
          {hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 inline-block text-slate-300">•</span>}
          <span>มีอักษรพิมพ์ใหญ่ (A-Z)</span>
        </div>
        <div className={`flex items-center gap-1 ${hasLower ? 'text-emerald-700 font-medium' : ''}`}>
          {hasLower ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 inline-block text-slate-300">•</span>}
          <span>มีอักษรพิมพ์เล็ก (a-z)</span>
        </div>
        <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-700 font-medium' : ''}`}>
          {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 inline-block text-slate-300">•</span>}
          <span>มีตัวเลข (0-9)</span>
        </div>
        <div className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-700 font-medium' : ''}`}>
          {hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 inline-block text-slate-300">•</span>}
          <span>มีอักขระพิเศษ (!@#$%)</span>
        </div>
      </div>

      {/* Passphrase Quick Demo */}
      <div className="pt-2 border-t border-indigo-100 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-indigo-900 font-medium">กดลองชุดรหัสตัวอย่างแบบ Passphrase:</span>
        {samplePassphrases.map((phrase, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setPassword(phrase)}
            className="text-[11px] px-2 py-0.5 bg-white border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-50 font-mono transition"
          >
            {phrase}
          </button>
        ))}
      </div>
    </div>
  );
};
