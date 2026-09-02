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
  X,
  Lightbulb,
} from 'lucide-react';
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
    const currentAnswers = answersRef.current;
    
    // Ensure all questions have an entry, even if unanswered
    const finalAnswers = quiz.questions.map((q) => {
      const existing = currentAnswers.find((a) => a.questionId === q.id);
      return existing || { questionId: q.id, selected: null, correct: q.correct };
    });

    const score = finalAnswers.filter((a) => a.selected === a.correct).length;
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    setIsFinished(true);
    onComplete({ score, total, durationSeconds, answers: finalAnswers });
  }, [quiz.questions, total, onComplete]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentEliminated = eliminatedOptions[question.id] || [];

  return (
    <div className="max-w-xl w-full mx-auto py-3 sm:py-6 space-y-4">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-[#EAEFF8] dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between gap-3 mb-3">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className="w-10 h-10 rounded-2xl bg-[#F4F6FC] dark:bg-slate-800 hover:bg-[#ECEEF8] dark:hover:bg-slate-700 disabled:opacity-30 flex items-center justify-center text-[#1E2238] dark:text-slate-200 font-bold transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h3 className="font-display font-black text-base sm:text-lg text-[#1E2238] dark:text-white leading-none mb-1">
              {quiz.topic}
            </h3>
            <span className="text-[11px] font-bold text-[#8C93B0] dark:text-slate-400">
              Soal {current + 1} dari {total}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF3E8] dark:bg-rose-950/60 text-[#FF6B4A] dark:text-rose-300 font-display font-black text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Segmented Step Bullet Indicator */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-[#F1F5F9] dark:border-slate-800">
          {Array.from({ length: total }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                idx === current
                  ? 'bg-[#6C5CE7] dark:bg-indigo-500 scale-y-125'
                  : idx < current
                  ? 'bg-[#00B894]'
                  : 'bg-[#E2E8F0] dark:bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Lavender Question Banner Card */}
      <ScrollReveal direction="up" delay={0} key={`q-${current}`}>
        <div className="bg-gradient-to-br from-[#6C5CE7] via-[#7D6EF0] to-[#8C7AE6] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="px-3 py-1 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-wider">
              Pertanyaan #{current + 1}
            </span>

            {streak > 1 && (
              <span className="px-3 py-1 rounded-full bg-[#FF6B4A] text-white text-xs font-black flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{streak}x Combo</span>
              </span>
            )}
          </div>

          <h2 className="font-display font-black text-lg sm:text-2xl text-white leading-relaxed mb-2 relative z-10">
            {question.question}
          </h2>
        </div>
      </ScrollReveal>

      {/* 4 Choices Options List */}
      <div className="space-y-2.5">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = index === question.correct;
          const isEliminated = currentEliminated.includes(index);

          let optionStyle =
            'bg-white dark:bg-slate-900 border-2 border-[#EAEFF8] dark:border-slate-800 text-[#1E2238] dark:text-slate-100 hover:border-[#6C5CE7]/60 dark:hover:border-indigo-500/60 shadow-sm';
          let labelKeyStyle = 'bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-400';

          if (isEliminated) {
            optionStyle = 'opacity-25 pointer-events-none line-through bg-[#F8FAFC] dark:bg-slate-950 border-[#E2E8F0] dark:border-slate-800';
          } else if (hasAnswered) {
            if (isCorrect) {
              optionStyle = 'border-2 border-[#00B894] bg-[#E0F9F3] dark:bg-teal-950/50 text-[#00B894] dark:text-teal-300 font-bold shadow-md';
              labelKeyStyle = 'bg-[#00B894] text-white font-black';
            } else if (isSelected && !isCorrect) {
              optionStyle = 'border-2 border-[#FF6B4A] bg-[#FFF0EB] dark:bg-rose-950/50 text-[#FF6B4A] dark:text-rose-300 font-bold shadow-md';
              labelKeyStyle = 'bg-[#FF6B4A] text-white font-black';
            } else {
              optionStyle = 'opacity-40 bg-white dark:bg-slate-900 border-[#EAEFF8] dark:border-slate-800 text-[#94A3B8]';
            }
          } else if (isSelected) {
            optionStyle = 'border-2 border-[#6C5CE7] dark:border-indigo-500 bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-300 font-bold shadow-sm';
            labelKeyStyle = 'bg-[#6C5CE7] text-white font-black';
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={hasAnswered || isEliminated}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-150 flex items-center justify-between gap-3 ${optionStyle} ${
                hasAnswered ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl font-display font-black text-xs flex items-center justify-center flex-shrink-0 ${labelKeyStyle}`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-sm sm:text-base font-semibold">
                  {option}
                </span>
              </div>

              {hasAnswered && (
                <div>
                  {isCorrect && <CheckCircle2 className="w-6 h-6 text-[#00B894]" />}
                  {isSelected && !isCorrect && <XCircle className="w-6 h-6 text-[#FF6B4A]" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {hasAnswered && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#EAEFF8] dark:border-slate-800 shadow-sm flex items-start gap-2.5 transition-colors">
          <Lightbulb className="w-4 h-4 text-[#6C5CE7] dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#4834D4] dark:text-indigo-300 font-medium leading-relaxed">
            <span className="font-extrabold block text-[#6C5CE7] dark:text-indigo-400 mb-0.5">Pembahasan:</span>
            {question.explanation ||
              `Jawaban yang benar adalah opsi ${String.fromCharCode(65 + question.correct)}: ${
                question.options[question.correct]
              }.`}
          </div>
        </div>
      )}

      {/* Action Next Question / Finish Button */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleUseLifeline}
          disabled={usedLifeline5050 || hasAnswered}
          className={`px-4 py-3 rounded-2xl border-2 font-black text-xs flex items-center gap-1.5 transition-all ${
            usedLifeline5050
              ? 'opacity-30 border-[#E2E8F0] dark:border-slate-800 bg-[#F1F5F9] dark:bg-slate-950 text-[#94A3B8]'
              : 'border-[#6C5CE7] dark:border-indigo-500 bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-300 hover:bg-[#E4DEFF]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bantuan 50:50</span>
        </button>

        {hasAnswered ? (
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-6 rounded-2xl btn-3d-coral text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{current === total - 1 ? 'Selesai & Lihat Skor' : 'Soal Berikutnya'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="text-xs font-bold text-[#8C93B0] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white px-4"
          >
            Lewati Soal
          </button>
        )}
      </div>
    </div>
  );
}