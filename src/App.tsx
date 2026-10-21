import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  QuizScoreRecord,
  EvaluationResult,
  AuthorInfo,
  UserRole,
} from './types';
import {
  getUserProfile,
  saveUserProfile,
  getCompletedModules,
  markModuleCompleted,
  getQuizScores,
  saveQuizScore,
  getEvaluationResult,
  saveEvaluationResult,
  getAuthorsInfo,
  saveAuthorsInfo,
  resetAllData,
  defaultUser,
  isAdminEmail,
} from './utils/storage';
import { modulesData } from './data/modulesData';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseService } from './services/firebaseService';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { CertificateModal } from './components/CertificateModal';
import { HomeDashboard } from './views/HomeDashboard';
import { ModulesView } from './views/ModulesView';
import { QuizView } from './views/QuizView';
import { ResultsView } from './views/ResultsView';
import { EvaluationView } from './views/EvaluationView';
import { AboutView } from './views/AboutView';
import { AdminView } from './views/AdminView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [targetModuleId, setTargetModuleId] = useState<number>(1);

  // Storage states
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [quizScores, setQuizScores] = useState<Record<number, QuizScoreRecord>>({});
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [authors, setAuthors] = useState<AuthorInfo[]>([]);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial data from LocalStorage & listen to Firebase Auth
  useEffect(() => {
    setUser(getUserProfile());
    setCompletedModules(getCompletedModules());
    setQuizScores(getQuizScores());
    setEvaluationResult(getEvaluationResult());
    setAuthors(getAuthorsInfo());

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.email) {
        const detectedRole: UserRole = isAdminEmail(fbUser.email) ? 'admin' : 'user';
        const updated: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'ผู้เรียน SafeNet',
          email: fbUser.email.toLowerCase(),
          role: detectedRole,
          phoneNumber: fbUser.phoneNumber || '081-234-5678',
          studentId: detectedRole === 'admin' ? 'ADM-OFFICER' : '660109999',
          avatar:
            fbUser.photoURL ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
              fbUser.displayName || 'User'
            )}`,
          institution: 'สถาบันการศึกษา / ทั่วไป',
          signedInAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          isGmail: true,
        };
        setUser(updated);
        saveUserProfile(updated);
        firebaseService.saveUserProfile(updated).catch(() => {});
      }
    });

    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleNavigate = (tab: string, moduleId?: number) => {
    setCurrentTab(tab);
    if (moduleId !== undefined) {
      setTargetModuleId(moduleId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveUserProfile(updatedUser);
    // Sync to Firebase Firestore
    firebaseService.saveUserProfile(updatedUser).catch((err) => {
      console.warn('Firestore user sync fallback:', err);
    });

    const roleLabel = updatedUser.role === 'admin' ? 'Admin (ผู้ดูแลระบบ)' : 'User (ผู้ใช้งานทั่วไป)';
    showToast(`ลงชื่อเข้าใช้สำเร็จ: ${updatedUser.name} [สิทธิ์: ${roleLabel}]`);
  };

  const handleMarkModuleCompleted = (moduleId: number) => {
    markModuleCompleted(moduleId);
    const updated = getCompletedModules();
    setCompletedModules(updated);
    showToast(`บันทึกการเรียนหน่วยที่ ${moduleId} เรียบร้อยแล้ว`);

    // Sync updated completedModules to Firestore
    firebaseService.saveUserProfile({ ...user, completedModules: updated }).catch(() => {});
  };

  const handleSaveScore = (moduleId: number, score: number, passingScore: number = 8) => {
    const updatedRecord = saveQuizScore(moduleId, score, passingScore);
    setQuizScores(getQuizScores());
    setCompletedModules(getCompletedModules());

    // Sync score record to Firestore
    firebaseService
      .saveQuizScore(user.id || encodeURIComponent(user.email), moduleId, updatedRecord)
      .catch(() => {});

    if (score >= passingScore) {
      showToast(`🎉 ยินดีด้วย! สอบผ่านหน่วยที่ ${moduleId} ได้คะแนน ${score}/10`);
    } else {
      showToast(`ผลการทดสอบหน่วยที่ ${moduleId}: ${score}/10 (ยังไม่ผ่านเกณฑ์ 8 คะแนน)`);
    }

    return updatedRecord;
  };

  const handleSaveEvaluation = (result: EvaluationResult) => {
    setEvaluationResult(result);
    saveEvaluationResult(result);

    // Sync evaluation to Firestore
    firebaseService.saveEvaluation(result).catch(() => {});
    showToast('ขอบพระคุณสำหรับแบบประเมินความคิดเห็น บันทึกข้อมูลสำเร็จ');
  };

  const handleSaveAuthors = (updatedAuthors: AuthorInfo[]) => {
    setAuthors(updatedAuthors);
    saveAuthorsInfo(updatedAuthors);
    showToast('บันทึกข้อมูลคณะผู้จัดทำเรียบร้อยแล้ว');
  };

  const handleResetConfirm = () => {
    resetAllData();
    setUser(getUserProfile());
    setCompletedModules([]);
    setQuizScores({});
    setEvaluationResult(null);
    setAuthors(getAuthorsInfo());
    showToast('รีเซ็ตข้อมูลความคืบหน้าและคะแนนทั้งหมดเรียบร้อยแล้ว');
  };

  const totalModules = modulesData.length;
  const completedCount = completedModules.length;
  const passedCount = Object.values(quizScores).filter((q) => q.passed).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        user={user}
        completedCount={completedCount}
        passedCount={passedCount}
        totalModules={totalModules}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenReset={() => setIsResetModalOpen(true)}
        onOpenCert={() => setIsCertModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleNavigate}
          completedCount={completedCount}
          passedCount={passedCount}
          totalModules={totalModules}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-72 w-full px-4 sm:px-6 lg:px-8 py-6">
          {currentTab === 'home' && (
            <HomeDashboard
              onNavigate={handleNavigate}
              user={user}
              completedModules={completedModules}
              quizScores={quizScores}
              onOpenCert={() => setIsCertModalOpen(true)}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />
          )}

          {currentTab === 'modules' && (
            <ModulesView
              initialModuleId={targetModuleId}
              completedModules={completedModules}
              quizScores={quizScores}
              onMarkCompleted={handleMarkModuleCompleted}
              onNavigateToQuiz={(mId) => handleNavigate('quiz', mId)}
            />
          )}

          {currentTab === 'quiz' && (
            <QuizView
              initialModuleId={targetModuleId}
              quizScores={quizScores}
              onSaveScore={handleSaveScore}
              onNavigateToModule={(mId) => handleNavigate('modules', mId)}
            />
          )}

          {currentTab === 'results' && (
            <ResultsView
              completedModules={completedModules}
              quizScores={quizScores}
              onNavigateToQuiz={(mId) => handleNavigate('quiz', mId)}
              onNavigateToModule={(mId) => handleNavigate('modules', mId)}
              onOpenCert={() => setIsCertModalOpen(true)}
            />
          )}

          {currentTab === 'evaluation' && (
            <EvaluationView
              evaluationResult={evaluationResult}
              onSaveEvaluation={handleSaveEvaluation}
            />
          )}

          {currentTab === 'about' && (
            <AboutView
              authors={authors}
              onSaveAuthors={handleSaveAuthors}
            />
          )}

          {currentTab === 'admin' && (
            <AdminView
              currentUser={user}
              onOpenCert={() => setIsCertModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-slideUp">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onSaveUser={handleSaveUser}
      />

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
      />

      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        user={user}
        completedCount={completedCount}
        passedCount={passedCount}
      />
    </div>
  );
}
