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
  const { toggleBookmark, isBookmarked } = useQuizStorage();
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
      <main className="py-16 text-center px-4">
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl max-w-sm mx-auto border border-[#EAEFF8] dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-[#8C93B0] dark:text-slate-400 mb-6 text-sm font-semibold">Belum ada hasil kuis yang tercatat.</p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-2xl btn-3d-brand text-white font-black text-xs"
          >
            Mulai Kuis Baru
          </button>
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

  const [claimedXp, setClaimedXp] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setClaimedXp(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="py-4 sm:py-6 max-w-2xl mx-auto space-y-5">
      {/* Floating XP Reward Notification: Only shown once when newly finishing a quiz */}
      {!claimedXp && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#FFA07A] text-white shadow-xl flex items-center gap-2 font-display font-black text-xs animate-bounce">
          <Flame className="w-4 h-4 fill-current" />
          <span>+{earnedXP} XP Baru Ditambahkan ke Akunmu!</span>
        </div>
      )}

      {/* Top Action Nav */}
      <ScrollReveal direction="down" delay={0}>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#8C93B0] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#EAEFF8] dark:border-slate-800 text-xs font-bold text-[#1E2238] dark:text-white shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00B894]" /> : <Share2 className="w-3.5 h-3.5 text-[#6C5CE7]" />}
            <span>{copied ? 'Tersalin!' : 'Share Score'}</span>
          </button>
        </div>
      </ScrollReveal>

      {/* Dribbble Style Result Score Card */}
      <ScrollReveal direction="pop" delay={100}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 text-center border border-[#EAEFF8] dark:border-slate-800 shadow-md relative overflow-hidden space-y-4 transition-colors">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FFB800] to-[#FFEAA7] text-amber-900 flex items-center justify-center mx-auto shadow-md animate-pop-in">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-300 font-black text-[11px] uppercase tracking-wider inline-block mb-1.5">
              Kuis Selesai!
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#1E2238] dark:text-white">
              {result.score} / {result.total} Jawaban Benar
            </h1>
            <p className="text-xs text-[#8C93B0] dark:text-slate-400 font-medium mt-1">
              {pct >= 80 ? 'Hebat sekali! Kamu berhasil menguasai topik ini!' : 'Bagus! Terus tingkatkan wawasanmu!'}
            </p>
          </div>

          {/* Reward Badges */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="px-4 py-2 rounded-2xl bg-[#FFF3E8] dark:bg-rose-950/60 border border-[#FFE0CC] dark:border-rose-900 text-[#FF6B4A] dark:text-rose-300 font-display font-black text-xs flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-current" />
              <span>+{earnedXP} XP</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-[#F0EDFF] dark:bg-indigo-950/60 border border-[#DED7FC] dark:border-indigo-900 text-[#6C5CE7] dark:text-indigo-300 font-display font-black text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{pct}% Akurasi</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-2xl btn-3d-coral text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mainkan Kuis Lain</span>
            </button>

            <button
              onClick={() => router.push('/quiz-history')}
              className="w-full py-3 rounded-2xl bg-[#F0EDFF] dark:bg-slate-800 hover:bg-[#E4DEFF] text-[#6C5CE7] dark:text-indigo-300 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Trophy className="w-4 h-4 text-[#FFB800]" />
              <span>Cek Leaderboard</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Review Answers List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-lg text-[#1E2238] dark:text-white">
            Review Jawaban
          </h2>

          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-[#EAEFF8] dark:border-slate-800 rounded-2xl shadow-sm">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all' ? 'bg-[#6C5CE7] text-white shadow-sm' : 'text-[#64748B] dark:text-slate-400'
              }`}
            >
              Semua ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('correct')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'correct' ? 'bg-[#00B894] text-white shadow-sm' : 'text-[#64748B] dark:text-slate-400'
              }`}
            >
              Benar ({result.score})
            </button>
            <button
              onClick={() => setActiveTab('incorrect')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'incorrect' ? 'bg-[#FF6B4A] text-white shadow-sm' : 'text-[#64748B] dark:text-slate-400'
              }`}
            >
              Salah ({result.total - result.score})
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredQuestions.map((q, idx) => {
            const answer = result.answers.find((a) => a.questionId === q.id);
            const isCorrect = answer?.selected === q.correct;
            const isOpen = openItems.has(q.id);
            const isBook = isBookmarked(q.id);

            return (
              <div
                key={q.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border-2 transition-all shadow-sm ${
                  isCorrect ? 'border-[#EAEFF8] dark:border-slate-800' : 'border-[#FFE0CC] dark:border-rose-950/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs mt-0.5 flex-shrink-0 ${
                        isCorrect ? 'bg-[#E0F9F3] dark:bg-teal-950/60 text-[#00B894] dark:text-teal-300' : 'bg-[#FFF0EB] dark:bg-rose-950/60 text-[#FF6B4A] dark:text-rose-300'
                      }`}
                    >
                      {isCorrect ? '✓' : '✗'}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-display font-bold text-sm text-[#1E2238] dark:text-white mb-1">
                        {q.question}
                      </h4>

                      <div className="text-[11px] space-y-0.5">
                        <div className="text-[#8C93B0] dark:text-slate-400">
                          Jawabanmu:{' '}
                          <span className={`font-bold ${isCorrect ? 'text-[#00B894]' : 'text-[#FF6B4A]'}`}>
                            {answer?.selected !== null && answer?.selected !== undefined
                              ? `${String.fromCharCode(65 + answer.selected)}. ${q.options[answer.selected]}`
                              : 'Tidak dijawab'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="text-[#00B894] font-bold">
                            Jawaban benar: {String.fromCharCode(65 + q.correct)}. {q.options[q.correct]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className={`p-2 rounded-xl border transition-all ${
                        isBook
                          ? 'bg-[#FFF9E6] dark:bg-amber-950/60 border-[#FFE7A3] text-[#FFB800]'
                          : 'bg-[#F8FAFC] dark:bg-slate-800 border-[#EAEFF8] dark:border-slate-700 text-[#94A3B8]'
                      }`}
                    >
                      {isBook ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => toggleItem(q.id)}
                      className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#EAEFF8] dark:border-slate-700 text-[#64748B] dark:text-slate-300"
                    >
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-[#F1F5F9] dark:border-slate-800 text-xs text-[#4834D4] dark:text-indigo-300 bg-[#F0EDFF] dark:bg-indigo-950/40 p-3 rounded-xl flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-[#6C5CE7] dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold block text-[#6C5CE7] dark:text-indigo-400 mb-0.5">Pembahasan:</span>
                      {q.explanation ||
                        `Jawaban yang benar adalah opsi ${String.fromCharCode(65 + q.correct)}.`}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}