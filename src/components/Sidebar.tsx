import React from 'react';
import { UserProfile } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  BarChart3,
  FileCheck2,
  Info,
  CheckCircle2,
  Shield,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  completedCount: number;
  passedCount: number;
  totalModules: number;
  user: UserProfile;
  onOpenAuth: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  completedCount,
  passedCount,
  totalModules,
  user,
  onOpenAuth,
  isOpenMobile,
  onCloseMobile,
}) => {
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  const menuItems = [
    {
      id: 'home',
      label: 'หน้าแรก',
      subtitle: 'Home Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'modules',
      label: 'บทเรียน 7 หน่วย',
      subtitle: 'Learning Modules',
      icon: BookOpen,
      badge: `${completedCount}/${totalModules}`,
      badgeColor: completedCount === totalModules ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800',
    },
    {
      id: 'quiz',
      label: 'แบบทดสอบความรู้',
      subtitle: 'Quiz (70 ข้อ)',
      icon: HelpCircle,
      badge: `${passedCount}/${totalModules} ผ่าน`,
      badgeColor: passedCount === totalModules ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800',
    },
    {
      id: 'results',
      label: 'ผลการเรียนรู้',
      subtitle: 'Learning Results',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'evaluation',
      label: 'แบบประเมินความคิดเห็น',
      subtitle: 'Evaluation (16 ข้อ)',
      icon: FileCheck2,
      badge: '4 ด้าน',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'about',
      label: 'เกี่ยวกับโครงงาน',
      subtitle: 'About Project & CPS',
      icon: Info,
      badge: 'CPS 5 ขั้น',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    ...(user.role === 'admin'
      ? [
          {
            id: 'admin',
            label: 'แผงควบคุมผู้ดูแล',
            subtitle: 'Admin Console',
            icon: Shield,
            badge: 'Admin',
            badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
          },
        ]
      : []),
  ];

  const handleSelect = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Progress Card */}
          <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-600 text-white rounded-2xl p-4 shadow-md shadow-blue-500/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-blue-100 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-300" />
                ความก้าวหน้าการเรียน
              </span>
              <span className="font-bold text-cyan-200 font-mono text-sm">{progressPercent}%</span>
            </div>

            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden mb-3">
              <div
                className="bg-white h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/10">
              <div className="bg-white/10 rounded-lg p-1.5 text-center">
                <div className="text-blue-100 text-[10px]">เรียนสำเร็จ</div>
                <div className="font-bold text-white text-xs">{completedCount} / {totalModules} หน่วย</div>
              </div>
              <div className="bg-white/10 rounded-lg p-1.5 text-center">
                <div className="text-blue-100 text-[10px]">ผ่านทดสอบ</div>
                <div className="font-bold text-cyan-200 text-xs">{passedCount} / {totalModules} หน่วย</div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              เมนูหลัก
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isAdminItem = item.id === 'admin';

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all group ${
                    isActive
                      ? isAdminItem
                        ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-300 shadow-xs'
                        : 'bg-blue-50/90 text-blue-700 font-semibold border border-blue-200 shadow-xs'
                      : isAdminItem
                      ? 'text-amber-800 hover:bg-amber-50/60 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? isAdminItem
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-blue-600 text-white shadow-xs'
                          : isAdminItem
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm tracking-tight leading-tight">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer User Profile Widget with Role Badge */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <div
            onClick={onOpenAuth}
            className={`flex items-center justify-between p-2.5 bg-white border rounded-xl hover:shadow-xs transition cursor-pointer ${
              user.role === 'admin'
                ? 'border-amber-200 hover:border-amber-400'
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 shrink-0"
                />
                {user.role === 'admin' && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-500 border border-white rounded-full flex items-center justify-center">
                    <Shield className="w-2 h-2 text-white" />
                  </span>
                )}
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
                  <span>{user.name}</span>
                  {user.isGmail && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
                </div>
                <div className="text-[10px] font-mono flex items-center gap-1 text-slate-500">
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
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>

          <div className="mt-2.5 text-center text-[10px] text-slate-400">
            SafeNet Learning • AI Vibe Coding & CPS
          </div>
        </div>
      </aside>
    </>
  );
};
