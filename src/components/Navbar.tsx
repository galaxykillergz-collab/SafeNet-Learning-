import React from 'react';
import { UserProfile } from '../types';
import {
  ShieldCheck,
  Award,
  RotateCcw,
  Menu,
  X,
  CheckCircle2,
  Shield,
  User,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile;
  completedCount: number;
  passedCount: number;
  totalModules: number;
  onOpenAuth: () => void;
  onOpenReset: () => void;
  onOpenCert: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  completedCount,
  passedCount,
  totalModules,
  onOpenAuth,
  onOpenReset,
  onOpenCert,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                    SafeNet Learning
                  </span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold bg-cyan-100 text-cyan-800 rounded-full">
                    CPS 5 ขั้นตอน
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-[260px]">
                  ความรู้เรื่องการใช้อินเทอร์เน็ตอย่างปลอดภัย
                </p>
              </div>
            </button>
          </div>

          {/* Center / Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Console Switch button (visible only if user has admin role) */}
            {user.role === 'admin' && (
              <button
                onClick={() => onSelectTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                  currentTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                }`}
                title="เปิดแผงควบคุมผู้ดูแลระบบ (Admin Console)"
              >
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden md:inline">แผงควบคุม Admin</span>
                <span className="md:hidden">Admin</span>
              </button>
            )}

            {/* Quick Progress Badge */}
            <div
              onClick={() => onSelectTab('results')}
              className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition text-xs"
              title="ดูผลการเรียนรู้"
            >
              <div className="text-slate-600 font-medium">ความคืบหน้า:</div>
              <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <span className="font-bold text-blue-700 font-mono">{progressPercent}%</span>
              <span className="text-slate-400">({completedCount}/{totalModules})</span>
            </div>

            {/* Certificate Button */}
            <button
              onClick={onOpenCert}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-xs ${
                passedCount >= 7
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 animate-pulse'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
              }`}
              title="ใบประกาศนียบัตร"
            >
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">ประกาศนียบัตร</span>
              {passedCount >= 7 ? (
                <span className="px-1.5 py-0.2 bg-white/20 text-[10px] rounded-full">พร้อมรับ!</span>
              ) : (
                <span className="text-[10px] opacity-75">({passedCount}/7)</span>
              )}
            </button>

            {/* User Gmail Profile Button */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-medium transition ${
                user.role === 'admin'
                  ? 'bg-amber-50/80 hover:bg-amber-100/90 border-amber-300 text-amber-950'
                  : 'bg-blue-50/80 hover:bg-blue-100/90 border-blue-200 text-blue-900'
              }`}
              title="จัดการโปรไฟล์ผู้เรียน / สลับสิทธิ์ผู้ใช้"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full bg-white shadow-xs border border-slate-200 shrink-0"
                />
                {user.role === 'admin' && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-500 border border-white rounded-full flex items-center justify-center">
                    <Shield className="w-1.5 h-1.5 text-white" />
                  </span>
                )}
              </div>

              <div className="text-left hidden sm:block max-w-[130px] truncate">
                <div className="font-semibold text-slate-800 text-[11px] truncate flex items-center gap-1">
                  <span>{user.name}</span>
                  {user.isGmail && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
                </div>
                <div className="text-[10px] text-slate-500 truncate font-mono flex items-center gap-1">
                  <span
                    className={`px-1 rounded text-[9px] font-bold uppercase ${
                      user.role === 'admin'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role}
                  </span>
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              <div className="sm:hidden">
                {user.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-amber-600" />
                ) : (
                  <User className="w-4 h-4 text-blue-600" />
                )}
              </div>
            </button>

            {/* Reset Button */}
            <button
              onClick={onOpenReset}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="รีเซ็ตความคืบหน้า"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
