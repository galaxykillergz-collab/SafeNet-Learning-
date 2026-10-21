import {
  UserProfile,
  UserRole,
  QuizScoreRecord,
  EvaluationResult,
  AuthorInfo,
  AdminUserRecord,
} from '../types';
import { defaultAuthors } from '../data/aboutData';

const KEYS = {
  USER: 'safenet_user_profile',
  COMPLETED_MODULES: 'safenet_completed_modules',
  QUIZ_SCORES: 'safenet_quiz_scores',
  EVALUATION: 'safenet_evaluation_result',
  AUTHORS: 'safenet_authors_info',
  ADMIN_EMAILS: 'safenet_admin_emails',
  ALL_USERS: 'safenet_all_users',
  WATCHED_VIDEOS: 'safenet_watched_videos',
};

export const PRIMARY_ADMIN_EMAIL = 'galaxykillergz@gmail.com';

export const initialAdminRecords: AdminUserRecord[] = [
  {
    email: PRIMARY_ADMIN_EMAIL,
    addedBy: 'System Primary Administrator',
    addedAt: '2026-10-21T00:00:00.000Z',
    note: 'ผู้ดูแลระบบหลักของโครงการ (Primary Superadmin)',
    isPrimary: true,
  },
];

export const defaultUser: UserProfile = {
  id: '',
  name: 'ผู้เรียน SafeNet',
  email: '',
  role: 'user',
  phoneNumber: '',
  studentId: '',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SafeNetLearner',
  institution: '',
  signedInAt: '',
  lastActiveAt: '',
  isGmail: false,
};

// Safe JSON parse
function safeParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error parsing localStorage key: ${key}`, e);
    return fallback;
  }
}

// Admin Emails Management
export function getAdminRecords(): AdminUserRecord[] {
  return safeParse<AdminUserRecord[]>(KEYS.ADMIN_EMAILS, initialAdminRecords);
}

export function saveAdminRecords(records: AdminUserRecord[]): void {
  localStorage.setItem(KEYS.ADMIN_EMAILS, JSON.stringify(records));
}

export function isAdminEmail(email: string): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === PRIMARY_ADMIN_EMAIL.toLowerCase()) return true;
  const list = getAdminRecords();
  return list.some((r) => r.email.toLowerCase() === cleanEmail);
}

export function addAdminEmail(email: string, addedBy: string, note?: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return false;
  const records = getAdminRecords();
  if (records.some((r) => r.email.toLowerCase() === cleanEmail)) {
    return false; // Already exists
  }
  const newRecord: AdminUserRecord = {
    email: cleanEmail,
    addedBy,
    addedAt: new Date().toISOString(),
    note: note?.trim() || 'ผู้ดูแลระบบที่ได้รับการแต่งตั้งเพิ่มเติม',
    isPrimary: false,
  };
  saveAdminRecords([...records, newRecord]);

  // Update user in allUsers list if present
  const allUsers = getAllUsers();
  const updatedAll = allUsers.map((u) =>
    u.email.toLowerCase() === cleanEmail ? { ...u, role: 'admin' as UserRole } : u
  );
  saveAllUsers(updatedAll);
  return true;
}

export function removeAdminEmail(email: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    return false; // Primary admin cannot be removed
  }
  const records = getAdminRecords();
  const filtered = records.filter((r) => r.email.toLowerCase() !== cleanEmail);
  saveAdminRecords(filtered);

  // Demote user to 'user' in allUsers list
  const allUsers = getAllUsers();
  const updatedAll = allUsers.map((u) =>
    u.email.toLowerCase() === cleanEmail ? { ...u, role: 'user' as UserRole } : u
  );
  saveAllUsers(updatedAll);
  return true;
}

// User Profile
export function getUserProfile(): UserProfile {
  const user = safeParse<UserProfile>(KEYS.USER, defaultUser);
  // Re-verify role dynamically against current admin list
  const role: UserRole = isAdminEmail(user.email) ? 'admin' : 'user';
  return { ...user, role };
}

export function saveUserProfile(user: UserProfile): void {
  try {
    const role: UserRole = isAdminEmail(user.email) ? 'admin' : 'user';
    const updated = { ...user, role, lastActiveAt: new Date().toISOString() };
    localStorage.setItem(KEYS.USER, JSON.stringify(updated));

    // Also update in allUsers directory
    upsertUserToDirectory(updated);
  } catch (e) {
    console.error('Error saving user profile', e);
  }
}

// Registered Users Directory (For Admin)
export function getAllUsers(): UserProfile[] {
  return safeParse<UserProfile[]>(KEYS.ALL_USERS, []);
}

export function saveAllUsers(users: UserProfile[]): void {
  localStorage.setItem(KEYS.ALL_USERS, JSON.stringify(users));
}

export function upsertUserToDirectory(user: UserProfile): void {
  const all = getAllUsers();
  const idx = all.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...user, lastActiveAt: new Date().toISOString() };
  } else {
    all.push({
      ...user,
      id: user.id || `usr-${Date.now()}`,
      lastActiveAt: new Date().toISOString(),
    });
  }
  saveAllUsers(all);
}

// Completed Modules (Array of module IDs: number[])
export function getCompletedModules(): number[] {
  return safeParse<number[]>(KEYS.COMPLETED_MODULES, []);
}

export function markModuleCompleted(moduleId: number): void {
  const current = getCompletedModules();
  if (!current.includes(moduleId)) {
    const updated = [...current, moduleId];
    localStorage.setItem(KEYS.COMPLETED_MODULES, JSON.stringify(updated));

    // Update current user record in allUsers
    const user = getUserProfile();
    user.completedModules = updated;
    upsertUserToDirectory(user);
  }
}

// Quiz Scores (Record<moduleId, QuizScoreRecord>)
export function getQuizScores(): Record<number, QuizScoreRecord> {
  return safeParse<Record<number, QuizScoreRecord>>(KEYS.QUIZ_SCORES, {});
}

export function saveQuizScore(
  moduleId: number,
  score: number,
  passingScore: number = 8
): QuizScoreRecord {
  const allScores = getQuizScores();
  const existing = allScores[moduleId] || {
    highestScore: 0,
    lastScore: 0,
    attempts: 0,
    passed: false,
    lastAttemptDate: new Date().toISOString(),
  };

  const isPassed = score >= passingScore || existing.passed;
  const newHighest = Math.max(score, existing.highestScore);

  const updatedRecord: QuizScoreRecord = {
    highestScore: newHighest,
    lastScore: score,
    attempts: existing.attempts + 1,
    passed: isPassed,
    lastAttemptDate: new Date().toISOString(),
  };

  allScores[moduleId] = updatedRecord;
  localStorage.setItem(KEYS.QUIZ_SCORES, JSON.stringify(allScores));

  // If passed, auto-mark module completed
  if (isPassed) {
    markModuleCompleted(moduleId);
  }

  // Update in directory
  const user = getUserProfile();
  const quizScoresSummary: Record<number, number> = {};
  let totalPassed = 0;
  Object.entries(allScores).forEach(([mId, rec]) => {
    quizScoresSummary[Number(mId)] = rec.highestScore;
    if (rec.passed) totalPassed += 1;
  });
  user.quizScores = quizScoresSummary;
  user.isCertificateEligible = totalPassed >= 7;
  upsertUserToDirectory(user);

  return updatedRecord;
}

// Evaluation
export function getEvaluationResult(): EvaluationResult | null {
  return safeParse<EvaluationResult | null>(KEYS.EVALUATION, null);
}

export function saveEvaluationResult(result: EvaluationResult): void {
  const user = getUserProfile();
  const enrichedResult: EvaluationResult = {
    ...result,
    evaluatedByEmail: user.email,
    evaluatedByName: user.name,
  };
  localStorage.setItem(KEYS.EVALUATION, JSON.stringify(enrichedResult));
}

// Authors info
export function getAuthorsInfo(): AuthorInfo[] {
  return safeParse<AuthorInfo[]>(KEYS.AUTHORS, defaultAuthors);
}

export function saveAuthorsInfo(authors: AuthorInfo[]): void {
  localStorage.setItem(KEYS.AUTHORS, JSON.stringify(authors));
}

// Watched Videos (Array of video IDs: string[])
export function getWatchedVideos(): string[] {
  return safeParse<string[]>(KEYS.WATCHED_VIDEOS, []);
}

export function markVideoWatched(videoId: string): string[] {
  const current = getWatchedVideos();
  if (!current.includes(videoId)) {
    const updated = [...current, videoId];
    localStorage.setItem(KEYS.WATCHED_VIDEOS, JSON.stringify(updated));

    // Also update current user
    const user = getUserProfile();
    user.watchedVideos = updated;
    upsertUserToDirectory(user);
    return updated;
  }
  return current;
}

export function toggleVideoWatched(videoId: string): { watched: boolean; list: string[] } {
  const current = getWatchedVideos();
  let updated: string[];
  let watched: boolean;

  if (current.includes(videoId)) {
    updated = current.filter((id) => id !== videoId);
    watched = false;
  } else {
    updated = [...current, videoId];
    watched = true;
  }

  localStorage.setItem(KEYS.WATCHED_VIDEOS, JSON.stringify(updated));
  const user = getUserProfile();
  user.watchedVideos = updated;
  upsertUserToDirectory(user);

  return { watched, list: updated };
}

// Reset All Data
export function resetAllData(): void {
  localStorage.removeItem(KEYS.COMPLETED_MODULES);
  localStorage.removeItem(KEYS.QUIZ_SCORES);
  localStorage.removeItem(KEYS.EVALUATION);
  localStorage.removeItem(KEYS.AUTHORS);
  localStorage.removeItem(KEYS.WATCHED_VIDEOS);
  localStorage.setItem(KEYS.USER, JSON.stringify(defaultUser));
}
