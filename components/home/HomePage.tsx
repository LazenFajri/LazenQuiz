'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Trophy,
  Zap,
  Play,
  Clock,
  Swords,
  Users,
  Award,
  ChevronRight,
  Code2,
  Atom,
  Landmark,
  Globe2,
  Film,
  Lightbulb,
  Medal,
  Crown,
  User,
  Plus,
  Compass,
  CheckCircle2,
  TrendingUp,
  Loader2,
  BrainCircuit,
  Calculator,
  FlaskConical,
  BookOpen,
} from 'lucide-react';
import { useQuizStorage } from '@/hooks/useQuizStorage';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ErrorFallbackModal } from '@/components/ui/ErrorFallbackModal';
import { MOCK_QUESTION_BANK, MockQuestion } from '@/lib/mockData';

const dribbbleCategories = [
  {
    id: 'math',
    name: 'Math & Logic',
    questionsCount: '15 Soal',
    badge: 'Trending',
    gradient: 'from-[#FF6B8B] via-[#FF8E53] to-[#FFA07A]',
    shadow: 'shadow-rose-500/20',
    icon: <Calculator className="w-7 h-7 text-white" />,
    desc: 'Uji logika hitung & pola angka cepat',
  },
  {
    id: 'science',
    name: 'Science Lab',
    questionsCount: '20 Soal',
    badge: 'Popular',
    gradient: 'from-[#00C9FF] via-[#92FE9D] to-[#55EFC4]',
    shadow: 'shadow-teal-500/20',
    icon: <FlaskConical className="w-7 h-7 text-white" />,
    desc: 'Eksperimen fakta sains, alam, & fisika',
  },
  {
    id: 'tech',
    name: 'Tech & Coding',
    questionsCount: '25 Soal',
    badge: 'Hot',
    gradient: 'from-[#6C5CE7] via-[#8C7AE6] to-[#A29BFE]',
    shadow: 'shadow-indigo-500/20',
    icon: <Code2 className="w-7 h-7 text-white" />,
    desc: 'Algoritma, AI, Web, & inovasi digital',
  },
];

const quickRecentQuizzes = [
  { name: 'Technology & AI', progress: 85, badgeColor: 'bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-400', icon: <Code2 className="w-4 h-4 text-[#6C5CE7] dark:text-indigo-400" /> },
  { name: 'World History & Facts', progress: 60, badgeColor: 'bg-[#FFF3E8] dark:bg-rose-950/60 text-[#FF6B4A] dark:text-rose-400', icon: <Landmark className="w-4 h-4 text-[#FF6B4A] dark:text-rose-400" /> },
  { name: 'Science & Cosmos', progress: 100, badgeColor: 'bg-[#E0F9F3] dark:bg-teal-950/60 text-[#00B894] dark:text-teal-400', icon: <Atom className="w-4 h-4 text-[#00B894] dark:text-teal-400" /> },
];

export function HomePage() {
  const router = useRouter();
  const { history, setActiveQuiz } = useQuizStorage();

  // Real data state
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [dbStats, setDbStats] = useState({ total_plays: 0, total_points: 0 });
  const [currentUser, setCurrentUser] = useState<{ username: string; avatar: string } | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('lazenUser');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch { }
  }, []);

  // Error Fallback Modal State
  const [errorModal, setErrorModal] = useState<{
    show: boolean;
    type: 'rate_limit' | 'server_error' | 'offline';
    title?: string;
    message?: string;
    retryAfterSeconds?: number;
  }>({
    show: false,
    type: 'server_error',
  });

  // Fetch real statistics from Neon DB
  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((json) => {
        if (json.stats) {
          setDbStats(json.stats);
        }
      })
      .catch(() => { });
  }, []);

  const handleStartAIQuiz = async (customTopic?: string) => {
    const selectedTopic = (customTopic || topic).trim() || 'Teknologi & Pengetahuan Umum';
    setLoading(true);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty,
          questionCount,
        }),
      });

      if (res.status === 429) {
        const errJson = await res.json();
        setErrorModal({
          show: true,
          type: 'rate_limit',
          title: 'Santai Dulu! Server Sedang Sibuk ⚡',
          message: 'Kamu telah membuat beberapa kuis. Istirahat sejenak atau gunakan bank soal offline.',
          retryAfterSeconds: errJson.retryAfterSeconds || 30,
        });
        return;
      }

      const data = await res.json();
      if (data && data.questions && data.questions.length > 0) {
        setActiveQuiz(data);
        router.push('/quiz-play');
      } else {
        throw new Error('Gagal memuat soal kuis');
      }
    } catch (error) {
      console.error(error);
      setErrorModal({
        show: true,
        type: 'server_error',
        title: 'Layanan Sedang Istirahat Sebentar',
        message: 'Koneksi ke AI terhambat. Tenang, kamu bisa langsung bermain dengan bank soal cadangan lokal!',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseOfflineBank = () => {
    const allQs: MockQuestion[] = Object.values(MOCK_QUESTION_BANK).flat();
    const shuffled = [...allQs].sort(() => 0.5 - Math.random()).slice(0, questionCount);

    const offlineQuiz = {
      id: `offline_${Date.now()}`,
      topic: topic.trim() || 'Pengetahuan Umum (Offline)',
      difficulty,
      questionCount: shuffled.length,
      questions: shuffled.map((q, idx) => ({
        id: idx + 1,
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation,
      })),
    };

    setActiveQuiz(offlineQuiz);
    setErrorModal((prev) => ({ ...prev, show: false }));
    router.push('/quiz-play');
  };

  const totalUserXP = history.reduce((acc, h) => acc + (h.score || 0) * 100, 0);
  const userRankTitle = totalUserXP >= 2000 ? 'Master League' : totalUserXP >= 1000 ? 'Diamond Tier' : totalUserXP >= 400 ? 'Gold Tier' : 'Novice Tier';

  return (
    <main className="py-4 sm:py-6 space-y-5 sm:space-y-6">
      {/* 1. Profile Header & Level Progress Banner */}
      <ScrollReveal direction="down" delay={0}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-[#EAEFF8] dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#8C7AE6] flex items-center justify-center text-white shadow-md shadow-[#6C5CE7]/30 text-xl font-display font-black flex-shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold text-[#8C93B0] dark:text-slate-400">
                  Hi, {currentUser?.username || 'Trivia Master'}!
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FFF3E8] dark:bg-rose-950/60 text-[#FF6B4A] dark:text-rose-300 text-[10px] font-black uppercase">
                  {userRankTitle}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-300 text-[10px] font-black">
                  {totalUserXP} XP
                </span>
              </div>
              <h1 className="font-display font-black text-xl sm:text-2xl text-[#1E2238] dark:text-white tracking-tight">
                Let's test your brain today!
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => router.push('/quiz-pvp')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl btn-3d-coral text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Swords className="w-4 h-4" />
              <span>1v1 PvP Arena</span>
            </button>

            <button
              onClick={() => router.push('/quiz-history')}
              className="px-4 py-2.5 rounded-2xl bg-[#F0EDFF] dark:bg-indigo-950/60 hover:bg-[#E4DEFF] dark:hover:bg-indigo-900/60 text-[#6C5CE7] dark:text-indigo-300 font-black text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Trophy className="w-4 h-4 text-[#FFB800]" />
              <span>Leaderboard</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. Featured Interactive Carousel Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-lg text-[#1E2238] dark:text-white">
            Pilih Kategori Populer
          </h2>
          <span className="text-xs font-bold text-[#6C5CE7] dark:text-indigo-400">AI Auto-Generated</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {dribbbleCategories.map((cat, idx) => (
            <ScrollReveal key={cat.id} direction="up" delay={idx * 60}>
              <div
                onClick={() => handleStartAIQuiz(cat.name)}
                className={`rounded-3xl p-5 sm:p-6 bg-gradient-to-br ${cat.gradient} text-white shadow-lg ${cat.shadow} cursor-pointer transform hover:-translate-y-1.5 transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-48 sm:h-52 group`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/25 backdrop-blur-md text-white font-extrabold text-[10px] uppercase tracking-wider">
                    {cat.badge}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-display font-black text-xl text-white mb-0.5">
                    {cat.name}
                  </h3>
                  <p className="text-white/85 text-xs font-medium mb-3">
                    {cat.desc}
                  </p>

                  <div className="flex items-center justify-between text-xs font-extrabold text-white pt-2 border-t border-white/20">
                    <span className="flex items-center gap-1">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Mainkan Sekarang</span>
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 3. AI Custom Quiz Generator Bar */}
      <ScrollReveal direction="up" delay={150}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-[#EAEFF8] dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-400 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-[#6C5CE7] dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-[#1E2238] dark:text-white">
                Custom AI Quiz Generator
              </h3>
              <p className="text-[11px] font-medium text-[#8C93B0] dark:text-slate-400">
                Masukkan topik apa saja dan Gemini 3.5 Flash akan meracik soal interaktif dalam hitungan detik.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Sejarah Majapahit, Web Development, Fisika..."
              className="w-full px-4 py-3 bg-[#F8FAFD] dark:bg-slate-950 border-2 border-[#EAEFF8] dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-semibold text-[#1E2238] dark:text-white placeholder-[#94A3B8] dark:placeholder-slate-500 focus:outline-none focus:border-[#6C5CE7] dark:focus:border-indigo-500 transition-all"
            />

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              {/* Quick Difficulty Pills */}
              <div className="flex items-center gap-1 p-1 bg-[#F8FAFD] dark:bg-slate-950 border-2 border-[#EAEFF8] dark:border-slate-800 rounded-2xl flex-1 sm:flex-none justify-between sm:justify-start">
                {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${difficulty === d
                        ? 'bg-[#6C5CE7] dark:bg-indigo-600 text-white shadow-sm'
                        : 'text-[#646D89] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white'
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleStartAIQuiz()}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl btn-3d-brand text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Meracik Soal AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Kuis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 4. Recent Quizzes & Live Database Activity */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-lg text-[#1E2238] dark:text-white">
            Recent Quizzes & Progress
          </h2>
          <span className="text-xs font-bold text-[#8C93B0] dark:text-slate-400">
            {dbStats.total_plays} Total Kuis Dimainkan di Cloud
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickRecentQuizzes.map((q) => (
            <div
              key={q.name}
              onClick={() => handleStartAIQuiz(q.name)}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#EAEFF8] dark:border-slate-800 shadow-sm hover:border-[#6C5CE7]/30 dark:hover:border-indigo-500/40 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${q.badgeColor}`}>
                  {q.icon}
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#1E2238] dark:text-white">{q.name}</h4>
                  <span className="text-[11px] text-[#8C93B0] dark:text-slate-400 font-medium">Klik untuk main</span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full border-2 border-[#6C5CE7]/20 dark:border-indigo-500/30 flex items-center justify-center text-[10px] font-black text-[#6C5CE7] dark:text-indigo-400">
                {q.progress}%
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Error Fallback & Rate Limit Modal */}
      {errorModal.show && (
        <ErrorFallbackModal
          type={errorModal.type}
          title={errorModal.title}
          message={errorModal.message}
          retryAfterSeconds={errorModal.retryAfterSeconds}
          onRetry={() => {
            setErrorModal((prev) => ({ ...prev, show: false }));
            handleStartAIQuiz();
          }}
          onUseOfflineFallback={handleUseOfflineBank}
          onClose={() => setErrorModal((prev) => ({ ...prev, show: false }))}
        />
      )}
    </main>
  );
}