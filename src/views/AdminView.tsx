import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  AdminUserRecord,
  QuizScoreRecord,
  EvaluationResult,
} from '../types';
import { firebaseService } from '../services/firebaseService';
import {
  PRIMARY_ADMIN_EMAIL,
  getAdminRecords,
  addAdminEmail,
  removeAdminEmail,
  getAllUsers,
} from '../utils/storage';
import {
  Shield,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  Search,
  Trash2,
  Mail,
  Award,
  CheckCircle2,
  XCircle,
  Phone,
  Hash,
  School,
  BarChart3,
  Calendar,
  Sparkles,
  Lock,
} from 'lucide-react';

interface AdminViewProps {
  currentUser: UserProfile;
  onRefreshData?: () => void;
  onOpenCert?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'admins' | 'stats'>('users');
  const [adminList, setAdminList] = useState<AdminUserRecord[]>(getAdminRecords());
  const [userList, setUserList] = useState<UserProfile[]>(getAllUsers());

  // Load real users and admins from Firestore
  useEffect(() => {
    let isMounted = true;
    firebaseService
      .getAllUsers()
      .then((fbUsers) => {
        if (isMounted && fbUsers && fbUsers.length > 0) {
          setUserList(fbUsers);
        }
      })
      .catch(() => {});

    firebaseService
      .getAdmins()
      .then((fbAdmins) => {
        if (isMounted && fbAdmins && fbAdmins.length > 0) {
          setAdminList(fbAdmins);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Add new admin form
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminNote, setNewAdminNote] = useState('');
  const [adminMessage, setAdminMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    const success = addAdminEmail(
      newAdminEmail.trim(),
      currentUser.email,
      newAdminNote.trim()
    );

    if (success) {
      // Sync to Firestore
      firebaseService
        .addAdmin(newAdminEmail.trim(), currentUser.email, newAdminNote.trim())
        .catch(() => {});

      setAdminMessage({
        text: `เพิ่มอีเมล ${newAdminEmail} เป็นผู้ดูแลระบบ (Admin) เรียบร้อยแล้ว`,
        type: 'success',
      });
      setNewAdminEmail('');
      setNewAdminNote('');
      setAdminList(getAdminRecords());
      setUserList(getAllUsers());
    } else {
      setAdminMessage({
        text: `อีเมล ${newAdminEmail} มีสิทธิ์ Admin อยู่แล้วในระบบ`,
        type: 'error',
      });
    }

    setTimeout(() => setAdminMessage(null), 4000);
  };

  const handleRemoveAdmin = (email: string) => {
    if (window.confirm(`ยืนยันการถอนสิทธิ์ผู้ดูแลระบบของ ${email}?`)) {
      const success = removeAdminEmail(email);
      if (success) {
        setAdminList(getAdminRecords());
        setUserList(getAllUsers());
        setAdminMessage({
          text: `ถอนสิทธิ์ Admin ของ ${email} เรียบร้อยแล้ว`,
          type: 'success',
        });
        setTimeout(() => setAdminMessage(null), 4000);
      }
    }
  };

  // Filtered users
  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.studentId && u.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.institution && u.institution.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = filterRole === 'all' || u.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const totalUsers = userList.length;
  const adminCount = adminList.length;
  const certifiedCount = userList.filter((u) => u.isCertificateEligible || (u.completedModules?.length ?? 0) >= 7).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      {/* Admin Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>แผงควบคุมผู้ดูแลระบบ (Admin Console)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              ระบบจัดการสิทธิ์และผู้เรียน SafeNet
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              จัดการรายชื่อผู้ดูแลระบบ (Admin), ติดตามความก้าวหน้าของผู้เรียน/นักศึกษา และตรวจสอบสิทธิ์การรับใบประกาศนียบัตร
            </p>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-md text-xs text-right">
            <div className="text-slate-300">ผู้ดูแลระบบปัจจุบัน:</div>
            <div className="font-bold text-white text-sm truncate">{currentUser.name}</div>
            <div className="text-[11px] text-amber-300 font-mono">{currentUser.email}</div>
          </div>
        </div>

        {/* 3 Metrics Overview */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
            <div className="text-[11px] text-slate-300">ผู้เรียนในระบบทั้งหมด</div>
            <div className="text-xl sm:text-2xl font-black text-white">{totalUsers} <span className="text-xs font-normal text-slate-300">คน</span></div>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
            <div className="text-[11px] text-slate-300">ผู้ดูแลระบบ (Admin)</div>
            <div className="text-xl sm:text-2xl font-black text-amber-300">{adminCount} <span className="text-xs font-normal text-slate-300">คน</span></div>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
            <div className="text-[11px] text-slate-300">ผ่านเกณฑ์รับใบประกาศฯ</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">{certifiedCount} <span className="text-xs font-normal text-slate-300">คน</span></div>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>รายชื่อผู้เรียนและนักศึกษา ({totalUsers})</span>
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`flex items-center gap-2 py-3 px-5 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'admins'
              ? 'border-amber-500 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4 text-amber-600" />
          <span>จัดการรายชื่อผู้ดูแลระบบ (Admin: {adminCount})</span>
        </button>
      </div>

      {/* Notification Toast in Admin View */}
      {adminMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-medium flex items-center gap-2 ${
            adminMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {adminMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{adminMessage.text}</span>
        </div>
      )}

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อ, รหัสนักศึกษา, อีเมล..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* Filter by Role */}
            <div className="flex items-center gap-2 text-xs self-end sm:self-center">
              <span className="text-slate-500 font-semibold">กรองสิทธิ์:</span>
              <button
                onClick={() => setFilterRole('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filterRole === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setFilterRole('user')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filterRole === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                User (ผู้เรียน)
              </button>
              <button
                onClick={() => setFilterRole('admin')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filterRole === 'admin'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Admin (ผู้ดูแล)
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">ข้อมูลผู้เรียน</th>
                  <th className="py-3 px-4">สิทธิ์การใช้งาน</th>
                  <th className="py-3 px-4">รหัสนักศึกษา / เบอร์โทร</th>
                  <th className="py-3 px-4">คณะ / สังกัด</th>
                  <th className="py-3 px-4 text-center">เรียนสำเร็จ</th>
                  <th className="py-3 px-4 text-center">สิทธิ์ใบประกาศฯ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-slate-700 text-xs">
                        ยังไม่มีข้อมูลผู้เรียนที่ลงทะเบียนในระบบ
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        ผู้เรียนจริงจะปรากฏในระบบโดยอัตโนมัติเมื่อลงชื่อเข้าใช้ด้วย Google Account (Firebase)
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const completedNum = user.completedModules?.length ?? 0;
                    const isCert = user.isCertificateEligible || completedNum >= 7;

                    return (
                      <tr key={user.email} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full border border-slate-200 bg-white shadow-2xs"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{user.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <Shield className="w-3 h-3 text-amber-600" />
                              <span>Admin</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              <span>User</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                          <div>{user.studentId || '-'}</div>
                          <div className="text-slate-400 text-[10px]">{user.phoneNumber || '-'}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                          {user.institution || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold font-mono">
                          <span className={completedNum >= 7 ? 'text-emerald-700' : 'text-blue-700'}>
                            {completedNum} / 7
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isCert ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <Award className="w-3 h-3 text-emerald-600" />
                              <span>ได้รับสิทธิ์</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">ยังไม่ผ่านเกณฑ์</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADMIN MANAGEMENT */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          {/* Add Admin Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <UserPlus className="w-5 h-5 text-amber-600" />
              <span>เพิ่มอีเมลผู้ดูแลระบบ (Add New Admin Email)</span>
            </div>
            <p className="text-xs text-slate-600">
              ผู้ใช้ที่ Login ด้วยอีเมลที่ระบุในรายการนี้ จะได้รับสิทธิ์ <strong>Admin</strong> โดยอัตโนมัติ เพื่อเข้าถึงแผงควบคุมและดูแลผู้เรียน
            </p>

            <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
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
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="เช่น co-advisor@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  หมายเหตุ / สังกัดผู้ดูแล
                </label>
                <input
                  type="text"
                  value={newAdminNote}
                  onChange={(e) => setNewAdminNote(e.target.value)}
                  placeholder="เช่น ผู้ช่วยสอน หรือ อาจารย์ที่ปรึกษาโครงงาน"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>เพิ่มสิทธิ์ Admin</span>
                </button>
              </div>
            </form>
          </div>

          {/* Current Admins List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>รายชื่อผู้ดูแลระบบทั้งหมดในปัจจุบัน ({adminList.length})</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {adminList.map((admin) => (
                <div
                  key={admin.email}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                        admin.isPrimary ? 'bg-amber-500' : 'bg-slate-700'
                      }`}
                    >
                      <Shield className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm font-mono">{admin.email}</span>
                        {admin.isPrimary ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Primary Superadmin
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            Co-Admin
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 mt-0.5">{admin.note || 'ผู้ดูแลระบบ'}</p>
                      <div className="text-[10px] text-slate-400 mt-1">
                        แต่งตั้งโดย: {admin.addedBy} • วันที่: {new Date(admin.addedAt).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                  </div>

                  <div>
                    {admin.isPrimary ? (
                      <span className="text-[11px] text-slate-400 italic">
                        ผู้ดูแลระบบเริ่มต้น (ไม่สามารถลบได้)
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRemoveAdmin(admin.email)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold transition flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ถอนสิทธิ์</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
