'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Flame,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface QuizPlayProps {
  quiz: {
    id: string;
    topic: string;
    difficulty: string;
    questionCount: number;
    questions: Question[];
  };
  onComplete: (results: {
    score: number;
    total: number;
    durationSeconds: number;
    answers: { questionId: number; selected: number | null; correct: number }[];
  }) => void;
}

export function QuizPlay({ quiz, onComplete }: QuizPlayProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<
    { questionId: number; selected: number | null; correct: number }[]
  >([]);
  const [timeLeft, setTimeLeft] = useState(() => quiz.questions.length * 30);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<number, number[]>>({});
  const [usedLifeline5050, setUsedLifeline5050] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const finishedRef = useRef(false);

  const question = quiz.questions[current];
  const total = quiz.questions.length;

  const handleFinish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const finalAnswers = answersRef.current;
    const score = finalAnswers.filter((a) => a.selected === a.correct).length;
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    setIsFinished(true);
    onComplete({ score, total, durationSeconds, answers: finalAnswers });
  }, [total, onComplete]);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
    }
  }, [timeLeft, handleFinish]);

  useEffect(() => {
    if (!isFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isFinished]);

  const handleUseLifeline = () => {
    if (usedLifeline5050 || hasAnswered) return;
    setUsedLifeline5050(true);
    const wrongIndices = question.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== question.correct);

    const shuffledWrong = [...wrongIndices].sort(() => 0.5 - Math.random());
    const toEliminate = shuffledWrong.slice(0, 2);

    setEliminatedOptions((prev) => ({
      ...prev,
      [question.id]: toEliminate,
    }));
  };

  const handleSelect = (index: number) => {
    if (isFinished || hasAnswered) return;
    setSelected(index);
    setHasAnswered(true);

    const isCorrect = index === question.correct;
    if (isCorrect) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === question.id);
      if (existing) {
        return prev.map((a) =>
          a.questionId === question.id ? { ...a, selected: index } : a
        );
      }
      return [
        ...prev,
        { questionId: question.id, selected: index, correct: question.correct },
      ];
    });
  };

  const jumpToQuestion = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= total) return;
    setCurrent(targetIdx);
    const existing = answers.find((a) => a.questionId === quiz.questions[targetIdx].id);
    setSelected(existing?.selected ?? null);
    setHasAnswered(existing?.selected !== null && existing?.selected !== undefined);
  };

  const handleNext = () => {
    if (current < total - 1) {
      jumpToQuestion(current + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      jumpToQuestion(current - 1);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isFinished) return;
      const key = e.key.toLowerCase();
      if (['1', 'a'].includes(key)) handleSelect(0);
      else if (['2', 'b'].includes(key)) handleSelect(1);
      else if (['3', 'c'].includes(key)) handleSelect(2);
      else if (['4', 'd'].includes(key)) handleSelect(3);
      else if (key === 'arrowright' || key === 'enter') {
        if (hasAnswered) handleNext();
      } else if (key === 'arrowleft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentEliminated = eliminatedOptions[question.id] || [];
  const progressPercent = ((current + 1) / total) * 100;

  if (isFinished) {
    const score = answersRef.current.filter((a) => a.selected === a.correct).length;
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <ScrollReveal direction="pop" delay={0}>
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#ECEEF8] shadow-soft-lg">
            <div className="w-16 h-16 rounded-3xl bg-[#FFF9E6] text-[#FFB800] flex items-center justify-center mx-auto mb-4 shadow-soft-sm">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-[#1E2238] mb-2">
              Quiz Completed!
            </h2>
            <p className="text-xs sm:text-sm text-[#8C93B0] mb-6">Mengkalkulasi skor dan ranking kamu...</p>
            <div className="font-display text-3xl sm:text-4xl font-black text-[#6C5CE7]">
              {score} / {total} Jawaban Benar
            </div>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="max-w-2xl w-full mx-auto py-4 sm:py-6">
      {/* Top Header Controls (Responsive flex-wrap) */}
      <ScrollReveal direction="down" delay={0}>
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-[#ECEEF8] shadow-soft-sm flex items-center justify-between gap-2 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#F4F6FC] hover:bg-[#EAEFFC] disabled:opacity-40 flex items-center justify-center text-[#1E2238] font-bold transition-all flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-sm sm:text-lg text-[#1E2238]">
                  Soal {current + 1}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#8C93B0]">/ {total}</span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-extrabold text-[#6C5CE7] uppercase truncate max-w-[120px] sm:max-w-none">
                {quiz.topic}
              </div>
            </div>
          </div>

          {/* Dynamic Timer & Lifeline */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {streak > 1 && (
              <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF3E8] border border-[#FFE0CC] text-[#FF6B4A] text-[11px] font-black animate-pop-in">
                <Flame className="w-3 h-3 fill-current" />
                <span>{streak}x</span>
              </div>
            )}

            <button
              onClick={handleUseLifeline}
              disabled={usedLifeline5050 || hasAnswered}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-extrabold border-2 flex items-center gap-1 transition-all ${
                usedLifeline5050
                  ? 'opacity-40 border-[#E2E8F0] bg-[#F1F5F9] text-[#94A3B8]'
                  : 'border-[#6C5CE7] bg-[#F0EDFF] text-[#6C5CE7] hover:bg-[#E3DCFF]'
              }`}
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>50:50</span>
            </button>

            {/* Time Badge */}
            <div
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full font-display font-black text-[11px] sm:text-xs ${
                timeLeft <= 15
                  ? 'bg-[#FFE8E8] text-[#EF4444] animate-pulse'
                  : 'bg-[#F0EDFF] text-[#6C5CE7]'
              }`}
            >
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Progress Bar */}
      <div className="h-1.5 sm:h-2 w-full bg-[#E2E8F0] rounded-full mb-4 sm:mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#FF6B4A] transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <ScrollReveal direction="up" delay={50} key={`question-${current}`}>
        <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-8 border border-[#ECEEF8] shadow-soft-lg mb-4 sm:mb-6">
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#F0EDFF] text-[#6C5CE7] font-display font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              {current + 1}
            </div>
            <h2 className="font-display font-black text-base sm:text-xl md:text-2xl text-[#1E2238] leading-snug">
              {question.question}
            </h2>
          </div>

          {/* Options List */}
          <div className="space-y-2.5 sm:space-y-3.5">
            {question.options.map((option, index) => {
              const isSelected = selected === index;
              const showResult = hasAnswered;
              const isCorrect = index === question.correct;
              const isEliminated = currentEliminated.includes(index);

              let buttonStyle =
                'border-2 border-[#E2E8F0] bg-white hover:border-[#6C5CE7]/60 hover:bg-[#F8FAFC] text-[#1E2238]';
              let keyStyle = 'bg-[#F1F5F9] text-[#64748B]';

              if (isEliminated) {
                buttonStyle = 'opacity-25 pointer-events-none line-through border-[#E2E8F0] bg-[#F8FAFC]';
              } else if (showResult) {
                if (isCorrect) {
                  buttonStyle = 'border-2 border-[#10B981] bg-[#ECFDF5] text-[#065F46] font-bold shadow-soft-sm';
                  keyStyle = 'bg-[#10B981] text-white font-black';
                } else if (isSelected && !isCorrect) {
                  buttonStyle = 'border-2 border-[#EF4444] bg-[#FEF2F2] text-[#991B1B] font-bold shadow-soft-sm';
                  keyStyle = 'bg-[#EF4444] text-white font-black';
                } else {
                  buttonStyle = 'opacity-40 border-[#E2E8F0] bg-white text-[#94A3B8]';
                }
              } else if (isSelected) {
                buttonStyle = 'border-2 border-[#6C5CE7] bg-[#F0EDFF] text-[#6C5CE7] font-bold shadow-soft-sm';
                keyStyle = 'bg-[#6C5CE7] text-white font-black';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={hasAnswered || isEliminated}
                  className={`w-full text-left p-3.5 sm:p-4.5 rounded-2xl transition-all duration-150 flex items-center justify-between gap-3 ${buttonStyle} ${
                    showResult || isEliminated ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 flex-1">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-display font-black text-xs flex items-center justify-center flex-shrink-0 transition-transform ${keyStyle}`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-xs sm:text-base font-semibold leading-relaxed">
                      {option}
                    </span>
                  </div>

                  {showResult && (
                    <div className="flex-shrink-0">
                      {isCorrect && (
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#10B981] animate-pop-in" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#EF4444] animate-pop-in" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Card */}
          {hasAnswered && (
            <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-2xl bg-[#F0EDFF] border border-[#DED7FC] animate-fade-in-up">
              <div className="flex items-center gap-2 mb-1 text-xs font-black text-[#6C5CE7] uppercase">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Pembahasan Soal</span>
              </div>
              <p className="text-xs sm:text-sm text-[#4834D4] leading-relaxed font-medium">
                {question.explanation ||
                  `Jawaban yang benar adalah opsi ${String.fromCharCode(65 + question.correct)}: ${
                    question.options[question.correct]
                  }.`}
              </p>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Next Question / Finish Action */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] sm:text-xs font-bold text-[#8C93B0] hidden xs:block">
          Keyboard: <kbd className="px-1.5 py-0.5 bg-white border border-[#CBD5E1] rounded text-[#1E2238]">A-D</kbd> atau <kbd className="px-1.5 py-0.5 bg-white border border-[#CBD5E1] rounded text-[#1E2238]">1-4</kbd>
        </div>

        <div className="w-full sm:w-auto flex items-center justify-end">
          {hasAnswered ? (
            <Button
              variant="coral"
              size="lg"
              onClick={handleNext}
              className="w-full sm:w-auto shadow-coral-glow animate-pop-in justify-center text-xs sm:text-sm"
            >
              <span>{current === total - 1 ? 'Selesai & Lihat Skor' : 'Soal Berikutnya'}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={handleNext}
              disabled={current === total - 1}
              className="text-xs font-bold"
            >
              Lewati Soal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}