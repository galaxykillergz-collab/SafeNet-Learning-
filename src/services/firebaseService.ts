import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../firebase';
import { UserProfile, QuizScoreRecord, EvaluationResult, AdminUserRecord } from '../types';

export const firebaseService = {
  // Sync User Profile
  async saveUserProfile(user: UserProfile): Promise<void> {
    const docId = auth.currentUser?.uid || user.id || encodeURIComponent(user.email);
    const path = `users/${docId}`;
    try {
      await setDoc(
        doc(db, 'users', docId),
        {
          name: user.name,
          email: user.email.toLowerCase(),
          role: user.role,
          phoneNumber: user.phoneNumber || '',
          studentId: user.studentId || '',
          avatar: user.avatar,
          institution: user.institution || '',
          isGmail: user.isGmail ?? true,
          completedModules: user.completedModules || [],
          quizScores: user.quizScores || {},
          isCertificateEligible: user.isCertificateEligible || false,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Get User Profile
  async getUserProfile(docId: string): Promise<UserProfile | null> {
    const path = `users/${docId}`;
    try {
      const snap = await getDoc(doc(db, 'users', docId));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  // Save Quiz Score
  async saveQuizScore(userId: string, moduleId: number, scoreRecord: QuizScoreRecord): Promise<void> {
    const path = `users/${userId}/quizScores/${moduleId}`;
    try {
      await setDoc(doc(db, 'users', userId, 'quizScores', String(moduleId)), {
        userId,
        moduleId,
        highestScore: scoreRecord.highestScore,
        lastScore: scoreRecord.lastScore,
        attempts: scoreRecord.attempts,
        passed: scoreRecord.passed,
        lastAttemptDate: scoreRecord.lastAttemptDate,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save Evaluation
  async saveEvaluation(evaluation: EvaluationResult): Promise<void> {
    const evalId = `eval-${Date.now()}`;
    const path = `evaluations/${evalId}`;
    try {
      await setDoc(doc(db, 'evaluations', evalId), {
        userId: auth.currentUser?.uid || 'guest',
        userEmail: evaluation.evaluatedByEmail || '',
        userName: evaluation.evaluatedByName || '',
        answers: evaluation.answers,
        categoryAverages: evaluation.categoryAverages,
        overallAverage: evaluation.overallAverage,
        submittedAt: evaluation.submittedAt || new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  // Admin: Get all users from Firestore
  async getAllUsers(): Promise<UserProfile[]> {
    const path = 'users';
    try {
      const q = query(collection(db, 'users'), limit(50));
      const snap = await getDocs(q);
      const list: UserProfile[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as UserProfile);
      });
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // Admin: Get Admin allowlist
  async getAdmins(): Promise<AdminUserRecord[]> {
    const path = 'admins';
    try {
      const snap = await getDocs(collection(db, 'admins'));
      const list: AdminUserRecord[] = [];
      snap.forEach((d) => {
        list.push(d.data() as AdminUserRecord);
      });
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // Admin: Add Admin allowlist record
  async addAdmin(email: string, addedBy: string, note?: string): Promise<void> {
    const cleanEmail = email.trim().toLowerCase();
    const path = `admins/${cleanEmail}`;
    try {
      await setDoc(doc(db, 'admins', cleanEmail), {
        email: cleanEmail,
        addedBy,
        addedAt: new Date().toISOString(),
        note: note || 'Admin ผู้ดูแลระบบ',
        isPrimary: false,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
};
