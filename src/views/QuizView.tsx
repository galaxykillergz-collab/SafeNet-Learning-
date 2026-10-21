import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ModuleQuiz, QuizQuestion, QuizScoreRecord } from '../types';
import { quizzesData } from '../data/quizzesData';
import { modulesData } from '../data/modulesData';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Award,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Send,
} from 'lucide-react';

interface QuizViewProps {
  initialModuleId?: number;
  quizScores: Record<number, QuizScoreRecord>;
  onSaveScore: (moduleId: number, score: number, passingScore?: number) => QuizScoreRecord;
  onNavigateToModule: (moduleId: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialModuleId = 1,
  quizScores,
  onSaveScore,
  onNavigateToModule,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<number>(initialModuleId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [reviewScore, setReviewScore] = useState<number | null>(null);

  // When initialModuleId changes externally
  useEffect(() => {
    if (initialModuleId) {
      setSelectedModuleId(initialModuleId);
      resetQuizState();
    }
  }, [initialModuleId]);

  const currentQuiz: ModuleQuiz =
    quizzesData.find((q) => q.moduleId === selectedModuleId) || quizzesData[0];
  const questions: QuizQuestion[] = currentQuiz.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setReviewScore(null);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === totalQuestions;

  const handleSubmit = () => {
    if (!isAllAnswered) return;

    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });

    setReviewScore(score);
    setIsSubmitted(true);
    onSaveScore(selectedModuleId, score, currentQuiz.passingScore);

    // If passed (>= 8), launch celebratory confetti
    if (score >= currentQuiz.passingScore) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // fallback ignore
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const highestScore = quizScores[selectedModuleId]?.highestScore ?? 0;
  const isPreviouslyPassed = quizScores[selectedModuleId]?.passed ?? false;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Quiz Module Selector */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {quizzesData.map((quiz) => {
            const isActive = quiz.moduleId === selectedModuleId;
            const scoreRec = quizScores[quiz.moduleId];
            const isPassed = scoreRec?.passed;

            return (
              <button
                key={quiz.moduleId}
                onClick={() => {
                  setSelectedModuleId(quiz.moduleId);
                  resetQuizState();
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isPassed
                      ? 'bg-emerald-100 text-emerald-800'
                      : scoreRec
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isPassed ? '✓' : quiz.moduleId}
                </span>
                <span>ชุดที่ {quiz.moduleId}</span>
                {scoreRec && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {scoreRec.highestScore}/10
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Quiz Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Quiz Banner Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
              แบบทดสอบวัดผลสัมฤทธิ์ • 10 ข้อ
            </span>
            <div className="flex items-center gap-2 text-xs font-medium text-blue-100">
              <Award className="w-4 h-4 text-amber-300" />
              <span>เกณฑ์ผ่าน 80% (อย่างน้อย {currentQuiz.passingScore} คะแนน)</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            {currentQuiz.moduleTitle}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-blue-100 pt-3 border-t border-white/20">
            <div>
              คะแนนสูงสุดที่ทำได้:{' '}
              <strong className="text-white font-mono text-sm">
                {highestScore} / 10
              </strong>{' '}
              {isPreviouslyPassed && (
                <span className="ml-1 text-[11px] bg-emerald-500/80 text-white px-1.5 py-0.5 rounded font-bold">
                  ผ่านเกณฑ์แล้ว
                </span>
              )}
            </div>
            <div>
              จำนวนครั้งที่ทำ:{' '}
              <span className="font-mono">{quizScores[selectedModuleId]?.attempts ?? 0} ครั้ง</span>
            </div>
          </div>
        </div>

        {/* If Quiz is NOT submitted yet: Show Interactive Quiz Player */}
        {!isSubmitted ? (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Top Navigator & Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-800 text-sm">
                  คำถามข้อที่ {currentQuestionIndex + 1} จาก {totalQuestions}
                </span>
                <span>
                  ตอบแล้ว <strong className="text-blue-600 font-mono">{answeredCount}</strong> / {totalQuestions} ข้อ
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>

              {/* Question dots navigator */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentQuestionIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300 shadow-xs'
                          : isAnswered
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                      title={`ข้อที่ ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {currentQuestionIndex + 1}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`w-full p-4 rounded-xl text-left border text-sm transition-all flex items-center gap-3.5 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-200 font-medium shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-100/70 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 transition ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-slate-300 text-slate-500 bg-slate-50'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="flex-1 leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                  currentQuestionIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ข้อก่อนหน้า</span>
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition shadow-sm"
                >
                  <span>ข้อถัดไป</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isAllAnswered}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${
                    isAllAnswered
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white transform active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isAllAnswered
                      ? 'ส่งคำตอบเพื่อตรวจคะแนน'
                      : `ตอบให้ครบก่อนส่ง (${answeredCount}/${totalQuestions})`}
                  </span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Result Screen & Full Explanation Key */
          <div className="p-6 sm:p-8 space-y-8">
            {/* Score Summary Box */}
            {reviewScore !== null && (
              <div
                className={`p-6 sm:p-8 rounded-3xl border text-center space-y-4 ${
                  reviewScore >= currentQuiz.passingScore
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-rose-50/70 border-rose-200'
                }`}
              >
                <div
                  className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg ${
                    reviewScore >= currentQuiz.passingScore
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {reviewScore >= currentQuiz.passingScore ? (
                    <Award className="w-10 h-10" />
                  ) : (
                    <AlertTriangle className="w-10 h-10" />
                  )}
                </div>

                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 ${
                      reviewScore >= currentQuiz.passingScore
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {reviewScore >= currentQuiz.passingScore
                      ? '✓ ผ่านเกณฑ์การประเมิน (80% ขึ้นไป)'
                      : '✕ ยังไม่ผ่านเกณฑ์การประเมิน'}
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    ได้คะแนน <span className={reviewScore >= currentQuiz.passingScore ? 'text-emerald-700' : 'text-rose-700'}>{reviewScore}</span> / 10 คะแนน
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                    {reviewScore >= currentQuiz.passingScore
                      ? 'ยอดเยี่ยมมาก! ท่านมีความรู้ความเข้าใจในเนื้อหาหน่วยนี้อย่างถูกต้องแม่นยำ สามารถนำไปประยุกต์ใช้ในชีวิตประจำวันได้จริง'
                      : 'คะแนนยังไม่ถึง 8 คะแนนตามเกณฑ์มาตรฐาน ขอแนะนำให้กลับไปอ่านทบทวนเนื้อหาในบทเรียน แล้วกลับมาทำแบบทดสอบใหม่อีกครั้ง'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetQuizState}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-xs transition"
                  >
                    <RotateCcw className="w-4 h-4 text-blue-600" />
                    <span>ทำแบบทดสอบใหม่อีกครั้ง (Retake)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToModule(selectedModuleId)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>กลับไปทบทวนบทเรียนหน่วยนี้</span>
                  </button>

                  {selectedModuleId < 7 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedModuleId(selectedModuleId + 1);
                        resetQuizState();
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      <span>ไปทำแบบทดสอบหน่วยที่ {selectedModuleId + 1}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Answer Key & Explanations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>เฉลยคำตอบพร้อมคำอธิบายละเอียด (Answer Key & Explanations)</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">10 ข้อ</span>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border text-xs space-y-3 transition ${
                        isCorrect
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="font-bold text-sm text-slate-900 leading-snug">
                            {q.question}
                          </span>
                        </div>

                        {isCorrect ? (
                          <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ตอบถูก (+1)
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                            <XCircle className="w-3.5 h-3.5" /> ตอบผิด (0)
                          </span>
                        )}
                      </div>

                      {/* Options breakdown */}
                      <div className="space-y-1.5 pl-8">
                        {q.options.map((opt, optIdx) => {
                          const isUserChoice = userAnswer === optIdx;
                          const isRightChoice = q.correctIndex === optIdx;

                          return (
                            <div
                              key={optIdx}
                              className={`p-2 rounded-lg border flex items-center justify-between text-xs ${
                                isRightChoice
                                  ? 'bg-emerald-100/70 border-emerald-300 font-medium text-emerald-950'
                                  : isUserChoice && !isCorrect
                                  ? 'bg-rose-100/70 border-rose-300 text-rose-950 line-through'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[11px] text-slate-500">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span>{opt}</span>
                              </div>
                              {isRightChoice && (
                                <span className="text-[10px] text-emerald-800 font-bold bg-white px-2 py-0.5 rounded shadow-2xs">
                                  ✓ คำตอบที่ถูกต้อง
                                </span>
                              )}
                              {isUserChoice && !isCorrect && (
                                <span className="text-[10px] text-rose-800 font-bold bg-white px-2 py-0.5 rounded shadow-2xs">
                                  คำตอบของคุณ
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed Thai Explanation */}
                      <div className="pl-8 pt-1">
                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-[11px]">
                          <strong className="text-slate-900 block mb-0.5">💡 คำอธิบายเชิงวิชาการ:</strong>
                          <span>{q.explanation}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
