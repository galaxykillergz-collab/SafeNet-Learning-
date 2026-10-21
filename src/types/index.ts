export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  studentId?: string;
  avatar: string;
  institution?: string;
  signedInAt: string;
  lastActiveAt?: string;
  isGmail: boolean;
  // Learning stats
  completedModules?: number[];
  quizScores?: Record<number, number>; // moduleId -> highestScore
  isCertificateEligible?: boolean;
  watchedVideos?: string[]; // IDs of watched videos
}

export interface VideoSlide {
  step: number;
  title: string;
  description: string;
  highlights: string[];
  actionItem: string;
  icon?: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  youtubeId: string; // YouTube video ID (e.g. "zCG_TLrx_AA")
  backupYoutubeId?: string; // Alternative mirror YouTube video ID
  searchQuery?: string; // YouTube search query fallback
  duration: string; // e.g. "5:20 นาที"
  source: string; // e.g. "ETDA Thailand", "สกมช. NCSA", "TruePlookpanya"
  tag?: string; // e.g. "คลิปหลัก", "กรณีศึกษา"
  keyTakeaways?: string[];
  fallbackSlides?: VideoSlide[];
}

export interface AdminUserRecord {
  email: string;
  addedBy: string;
  addedAt: string;
  note?: string;
  isPrimary?: boolean;
}

export interface ModuleSection {
  title: string;
  content: string;
  keyPoints?: string[];
  alertNote?: string;
}

export interface CaseStudy {
  title: string;
  scenario: string;
  impact: string;
  prevention: string;
}

export interface LearningModule {
  id: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  iconName: string;
  colorTheme: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    gradient: string;
  };
  objectives: string[];
  estimatedMinutes: number;
  sections: ModuleSection[];
  videos?: VideoLesson[];
  caseStudy: CaseStudy;
  bestPractices: string[];
  summaryPoints: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface ModuleQuiz {
  moduleId: number;
  moduleTitle: string;
  passingScore: number; // 8 out of 10
  questions: QuizQuestion[];
}

export interface QuizScoreRecord {
  highestScore: number;
  lastScore: number;
  attempts: number;
  passed: boolean;
  lastAttemptDate: string;
}

export interface EvaluationItem {
  id: string;
  text: string;
  category: 'content' | 'design' | 'usability' | 'satisfaction';
}

export interface EvaluationCategory {
  key: 'content' | 'design' | 'usability' | 'satisfaction';
  title: string;
  description: string;
  iconName: string;
}

export interface EvaluationResult {
  answers: Record<string, number>; // questionId -> 1..5
  submittedAt: string;
  categoryAverages: {
    content: number;
    design: number;
    usability: number;
    satisfaction: number;
  };
  overallAverage: number;
  evaluatedByEmail?: string;
  evaluatedByName?: string;
}

export interface AuthorInfo {
  name: string;
  role: string;
  studentId?: string;
  faculty?: string;
  institution: string;
  email: string;
}

export interface CPSStep {
  step: number;
  nameTh: string;
  nameEn: string;
  description: string;
  activities: string[];
  output: string;
}
