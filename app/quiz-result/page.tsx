'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Share2,
  Check,
  Sparkles,
  Flame,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useQuizStorage } from '@/hooks/useQuizStorage';

interface QuizResultData {
  score: number;
  total: number;
  durationSeconds?: number;
  answers: { questionId: number; selected: number | null; correct: number }[];
}

interface QuizInfo {
  topic: string;
  difficulty: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correct: number;
    explanation?: string;
  }[];
}

export default function QuizResultPage() {
  const router = useRouter();
  const { bookmarks, toggleBookmark, isBookmarked } = useQuizStorage();
  const [result, setResult] = useState<QuizResultData | null>(null);
  const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'all' | 'correct' | 'incorrect' | 'bookmarked'>('all');
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    try {
      const savedResult = localStorage.getItem('lastQuizResult');
      const savedInfo = localStorage.getItem('lastQuizInfo');
      if (savedResult) setResult(JSON.parse(savedResult));
      if (savedInfo) setQuizInfo(JSON.parse(savedInfo));
    } catch {
      // ignore
    }
  }, []);

  const toggleItem = (id: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShare = () => {
    if (!result || !quizInfo) return;
    const text = `Saya baru saja menyelesaikan kuis ${quizInfo.topic} di LazenQuiz!\nSkor: ${result.score}/${result.total} (${Math.round((result.score / result.total) * 100)}%)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!ready) return null;

  if (!result || !quizInfo) {
    return (
      <main className="py-20 text-center px-4">
        <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-sm mx-auto border border-[#ECEEF8] shadow-soft-sm">
          <p className="text-[#8C93B0] mb-6 text-sm font-semibold">Belum ada hasil kuis yang tercatat.</p>
          <Button variant="purple" onClick={() => router.push('/quiz-setup')}>
            Mulai Kuis Baru
          </Button>
        </div>
      </main>
    );
  }

  const pct = Math.round((result.score / result.total) * 100);
  const earnedXP = result.score * 100;
  const questions = quizInfo.questions || [];

  const filteredQuestions = questions.filter((q) => {
    const ans = result.answers.find((a) => a.questionId === q.id);
    const isCorrect = ans?.selected === q.correct;
    const bookmarked = isBookmarked(q.id);

    if (activeTab === 'correct') return isCorrect;
    if (activeTab === 'incorrect') return !isCorrect;
    if (activeTab === 'bookmarked') return bookmarked;
    return true;
  });

  return (
    <main className="py-6 sm:py-12 max-w-3xl mx-auto space-y-6 sm:space-y-8">
      {/* Back button */}
      <ScrollReveal direction="down" delay={0}>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#8C93B0] hover:text-[#1E2238] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Explore</span>
          </button>

          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1 text-xs">
            {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Share Score'}</span>
          </Button>
        </div>
      </ScrollReveal>

      {/* Final Scoreboard Card */}
      <ScrollReveal direction="pop" delay={100}>
        <div className="bg-gradient-to-b from-[#6C5CE7] to-[#5842D8] rounded-3xl sm:rounded-4xl p-6 sm:p-10 text-white text-center shadow-soft-lg relative overflow-hidden">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#FFEAA7] mx-auto mb-3 sm:mb-4 shadow-soft-sm animate-pop-in">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-[11px] sm:text-xs mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Final Scoreboard</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl mb-2 text-white">
            {result.score} / {result.total}
          </h1>

          <p className="text-purple-100 text-xs sm:text-sm font-medium mb-5 sm:mb-6">
            {pct >= 80 ? 'Master Level! Performa luar biasa!' : 'Bagus sekali! Terus latih wawasanmu!'}
          </p>

          {/* Reward Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <div className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-1.5 sm:gap-2">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6B4A]" />
              <span className="font-display font-black text-xs sm:text-sm">+{earnedXP} XP</span>
            </div>

            <div className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-1.5 sm:gap-2">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
              <span className="font-display font-black text-xs sm:text-sm">{pct}% Accuracy</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Action Buttons */}
      <ScrollReveal direction="up" delay={200}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Button
            variant="coral"
            size="lg"
            onClick={() => router.push(`/quiz-setup?topic=${encodeURIComponent(quizInfo.topic)}`)}
            className="w-full shadow-coral-glow justify-center text-xs sm:text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mainkan Lagi Topik Ini</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push('/quiz-history')}
            className="w-full justify-center text-xs sm:text-sm"
          >
            <Trophy className="w-4 h-4 text-[#FFB800]" />
            <span>Lihat Leaderboard</span>
          </Button>
        </div>
      </ScrollReveal>

      {/* Review Answers */}
      <div className="space-y-4">
        <ScrollReveal direction="up" delay={250}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-xl sm:text-2xl font-black text-[#1E2238]">
              Review & Analisis Jawaban
            </h2>

            {/* Filter Pills with Horizontal Scroll on Mobile */}
            <div className="flex items-center gap-1 p-1 bg-white border border-[#ECEEF8] rounded-2xl shadow-soft-sm overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'all' ? 'bg-[#6C5CE7] text-white shadow-soft-sm' : 'text-[#64748B]'
                }`}
              >
                Semua ({questions.length})
              </button>
              <button
                onClick={() => setActiveTab('correct')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'correct' ? 'bg-[#10B981] text-white shadow-soft-sm' : 'text-[#64748B]'
                }`}
              >
                Benar ({result.score})
              </button>
              <button
                onClick={() => setActiveTab('incorrect')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'incorrect' ? 'bg-[#EF4444] text-white shadow-soft-sm' : 'text-[#64748B]'
                }`}
              >
                Salah ({result.total - result.score})
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Question Cards with Staggered ScrollReveal */}
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => {
            const answer = result.answers.find((a) => a.questionId === q.id);
            const isCorrect = answer?.selected === q.correct;
            const isOpen = openItems.has(q.id);
            const isBook = isBookmarked(q.id);

            return (
              <ScrollReveal
                key={q.id}
                direction="up"
                delay={idx * 60}
              >
                <div
                  className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 transition-all shadow-soft-sm ${
                    isCorrect ? 'border-[#E2E8F0]' : 'border-[#FEE2E2]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 sm:gap-3 flex-1">
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center font-black text-xs mt-0.5 flex-shrink-0 ${
                          isCorrect ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FEF2F2] text-[#EF4444]'
                        }`}
                      >
                        {isCorrect ? '✓' : '✗'}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-display font-bold text-[#1E2238] text-sm sm:text-base mb-1">
                          {q.question}
                        </h3>

                        <div className="text-[11px] sm:text-xs space-y-0.5">
                          <div className="text-[#64748B]">
                            Jawabanmu:{' '}
                            <span
                              className={`font-bold ${isCorrect ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
                            >
                              {answer?.selected !== null && answer?.selected !== undefined
                                ? `${String.fromCharCode(65 + answer.selected)}. ${q.options[answer.selected]}`
                                : 'Tidak dijawab'}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="text-[#059669] font-bold">
                              Jawaban benar: {String.fromCharCode(65 + q.correct)}. {q.options[q.correct]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleBookmark(q.id)}
                        className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
                          isBook
                            ? 'bg-[#FFF9E6] border-[#FFE7A3] text-[#D97706]'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8] hover:text-[#1E2238]'
                        }`}
                      >
                        {isBook ? <BookmarkCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>

                      <button
                        onClick={() => toggleItem(q.id)}
                        className="p-1.5 sm:p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#1E2238]"
                      >
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#F1F5F9] text-xs sm:text-sm text-[#4834D4] bg-[#F0EDFF] p-3.5 sm:p-4 rounded-2xl flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-[#6C5CE7] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold block mb-1">Pembahasan:</span>
                        {q.explanation ||
                          `Jawaban yang benar adalah opsi ${String.fromCharCode(65 + q.correct)}.`}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </main>
  );
}