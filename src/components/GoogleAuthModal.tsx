import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { isAdminEmail } from '../utils/storage';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import {
  X,
  Mail,
  ShieldCheck,
  CheckCircle2,
  School,
  Phone,
  Hash,
  Shield,
  User,
  RefreshCw,
} from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveUser: (user: UserProfile) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
}) => {
  const [email, setEmail] = useState(currentUser.email || '');
  const [name, setName] = useState(currentUser.name === 'ผู้เรียน SafeNet' ? '' : currentUser.name);
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');
  const [studentId, setStudentId] = useState(currentUser.studentId || '');
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [avatarSeed, setAvatarSeed] = useState(currentUser.name || 'Learner');
  const [autoRole, setAutoRole] = useState<UserRole>(
    isAdminEmail(currentUser.email) ? 'admin' : 'user'
  );
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setAutoRole(isAdminEmail(email) ? 'admin' : 'user');
  }, [email]);

  if (!isOpen) return null;

  const handleFirebasePopup = async () => {
    try {
      setAuthError(null);
      setIsLoadingGoogle(true);
      const res = await signInWithPopup(auth, googleProvider);
      const googleUser = res.user;
      if (googleUser.email) {
        const detectedRole: UserRole = isAdminEmail(googleUser.email) ? 'admin' : 'user';
        const updatedUser: UserProfile = {
          id: googleUser.uid,
          name: googleUser.displayName || name || 'ผู้เรียน SafeNet',
          email: googleUser.email.toLowerCase(),
          role: detectedRole,
          phoneNumber: phoneNumber || googleUser.phoneNumber || '',
          studentId: studentId || (detectedRole === 'admin' ? 'ADM-OFFICER' : ''),
          avatar:
            googleUser.photoURL ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
              googleUser.displayName || googleUser.email
            )}`,
          institution: institution || '',
          signedInAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          isGmail: true,
          completedModules: currentUser.completedModules || [],
          quizScores: currentUser.quizScores || {},
          isCertificateEligible: currentUser.isCertificateEligible || false,
        };
        onSaveUser(updatedUser);
        onClose();
      }
    } catch (err: any) {
      console.warn('Google Popup sign-in error:', err);
      setAuthError('ไม่สามารถเปิดหน้าต่าง Google ได้ สามารถกรอกอีเมลด้านล่างเพื่อเข้าสู่ระบบ');
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const detectedRole: UserRole = isAdminEmail(email.trim()) ? 'admin' : 'user';

    const updatedUser: UserProfile = {
      id: currentUser.id || `usr-${Date.now()}`,
      name: name.trim() || (detectedRole === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้เรียนรู้ SafeNet'),
      email: email.trim().toLowerCase(),
      role: detectedRole,
      phoneNumber: phoneNumber.trim(),
      studentId: studentId.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed || email)}`,
      institution: institution.trim(),
      signedInAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      isGmail: true,
      completedModules: currentUser.completedModules || [],
      quizScores: currentUser.quizScores || {},
      isCertificateEligible: currentUser.isCertificateEligible || false,
    };

    onSaveUser(updatedUser);
    onClose();
  };

  const generateRandomStudentSeed = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setAvatarSeed(`User-${randomNum}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header with Google Theme */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2.5">
            <svg viewBox="0 0 24 24" className="w-10 h-10">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold tracking-tight">
            เข้าสู่ระบบด้วย Google Account (Firebase)
          </h3>
          <p className="text-blue-100 text-xs mt-1">
            บันทึกความคืบหน้าการเรียน ผลคะแนนสอบ และออกใบประกาศนียบัตร
          </p>

          {/* Role Status Tag */}
          {email && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-white/15 border-white/30 text-white">
              {autoRole === 'admin' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-amber-300" />
                  <span>สถานะสิทธิ์: ผู้ดูแลระบบ (Admin)</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-cyan-300" />
                  <span>สถานะสิทธิ์: ผู้ใช้ทั่วไป / นักศึกษา (User)</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs font-sans">
          {authError && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[11px]">
              {authError}
            </div>
          )}

          {/* Primary Action: One-click Firebase Google Popup Button */}
          <button
            type="button"
            onClick={handleFirebasePopup}
            disabled={isLoadingGoogle}
            className="w-full py-3 px-4 bg-white border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 text-slate-800 font-bold rounded-2xl shadow-sm transition flex items-center justify-center gap-3 active:scale-[0.99]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-sm">
              {isLoadingGoogle ? 'กำลังเชื่อมต่อ Google Account...' : 'ลงชื่อเข้าใช้ด้วย Google (Firebase)'}
            </span>
          </button>

          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-[10px] text-slate-400 font-medium uppercase">
              หรือระบุข้อมูลโปรไฟล์ผู้เรียน
            </span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-3">
            {/* Email input */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                อีเมล Google Account (Gmail) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-red-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
              {autoRole === 'admin' ? (
                <span className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-amber-600" /> อีเมลนี้เป็นผู้ดูแลระบบ (Admin)
                </span>
              ) : (
                <span className="text-[11px] text-slate-500 mt-1 block">
                  * จะได้รับสิทธิ์ User สำหรับศึกษาบทเรียนและทำแบบทดสอบ
                </span>
              )}
            </div>

            {/* Profile fields: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  ชื่อ - นามสกุล (สำหรับพิมพ์บนใบประกาศฯ)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setAvatarSeed(e.target.value);
                  }}
                  placeholder="เช่น นายชลธี พัฒนาสกุล"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  เบอร์โทรศัพท์ติดต่อ
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="เช่น 081-234-5678"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Student ID / Staff ID & Institution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  รหัสนักศึกษา / รหัสประจำตัว
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="เช่น 660101234"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  สังกัด / คณะ / มหาวิทยาลัย
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <School className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="เช่น คณะเทคโนโลยีสารสนเทศ"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Profile Avatar Preview & Randomizer */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed || email || 'Learner')}`}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full bg-white border border-slate-300 shadow-xs"
                />
                <div>
                  <div className="font-semibold text-slate-800 text-[11px]">ภาพโปรไฟล์</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                    {avatarSeed || email || 'SafeNet'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={generateRandomStudentSeed}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 flex items-center gap-1 text-[11px] font-medium transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>เปลี่ยนไอคอน</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>บันทึกข้อมูลโปรไฟล์ & เริ่มต้นใช้งาน</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ซิงค์ข้อมูลกับ Firebase Firestore โดยตรง</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
