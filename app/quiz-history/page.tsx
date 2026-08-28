'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  Flame,
  Search,
  Trash2,
  Play,
  Award,
  Crown,
  Medal,
  Clock,
  User,
  GraduationCap,
  Globe2,
  Users2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Loader2,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useQuizStorage } from '@/hooks/useQuizStorage';

export default function QuizHistoryPage() {
  const { history, clearHistory, removeFromHistory } = useQuizStorage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'world' | 'weekly' | 'my_history'>('world');
  const [searchQuery, setSearchQuery] = useState('');
  const [dbLeaderboard, setDbLeaderboard] = useState<any[]>([]);
  const [dbStats, setDbStats] = useState({ total_plays: 0, total_points: 0, avg_score: 0 });
  const [loading, setLoading] = useState(true);

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Fetch live real data from Neon PostgreSQL
  useEffect(() => {
    setLoading(true);
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setDbLeaderboard(json.data);
        }
        if (json.stats) {
          setDbStats(json.stats);
        }
      })
      .catch((err) => console.error('Fetch Leaderboard Error:', err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Prepare top 3 podium items (real Neon DB records or fallbacks)
  const top1 = dbLeaderboard[0] || { username: 'Omnibus AI', topic: 'Sains & Kosmos', score: 2130, time_spent_seconds: 45 };
  const top2 = dbLeaderboard[1] || { username: 'David Law', topic: 'Teknologi & Web', score: 1688, time_spent_seconds: 52 };
  const top3 = dbLeaderboard[2] || { username: 'Sheeva Jon', topic: 'Matematika', score: 1394, time_spent_seconds: 60 };

  const filteredHistory = [...history].reverse().filter((item) =>
    item.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="py-4 sm:py-6 max-w-4xl mx-auto space-y-6">
      {/* Header & Tabs Navigation */}
      <ScrollReveal direction="down" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#6C5CE7] dark:text-indigo-400 uppercase mb-0.5">
              <Trophy className="w-4 h-4 text-[#FFB800]" />
              <span>Realtime Neon DB Cloud Leaderboard</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1E2238] dark:text-white">
              Hall of Fame & Ranking
            </h1>
          </div>

          {/* Filter Segment Pills (World, Weekly, Riwayat Kamu) */}
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-[#EAEFF8] dark:border-slate-800 rounded-2xl shadow-sm">
            <button
              onClick={() => setActiveTab('world')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'world'
                  ? 'bg-[#6C5CE7] text-white shadow-sm'
                  : 'text-[#646D89] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white'
              }`}
            >
              World Rank
            </button>

            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'weekly'
                  ? 'bg-[#6C5CE7] text-white shadow-sm'
                  : 'text-[#646D89] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white'
              }`}
            >
              Weekly Best
            </button>

            <button
              onClick={() => setActiveTab('my_history')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'my_history'
                  ? 'bg-[#6C5CE7] text-white shadow-sm'
                  : 'text-[#646D89] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white'
              }`}
            >
              Riwayat Saya ({history.length})
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* 3D Stepped Podium */}
      {activeTab !== 'my_history' && (
        <ScrollReveal direction="up" delay={100}>
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-[#EAEFF8] dark:border-slate-800 shadow-sm transition-colors">
            <div className="text-center mb-6">
              <h2 className="font-display font-black text-xl text-[#1E2238] dark:text-white">
                Top 3 Trivia Champions
              </h2>
              <p className="text-xs text-[#8C93B0] dark:text-slate-400">
                Peringkat pemain tertinggi yang tercatat langsung di Neon DB
              </p>
            </div>

            {/* Stepped 3D Podium Layout */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-md mx-auto pt-4">
              {/* Rank 2 (Silver Pillar) */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-400 flex items-center justify-center font-display font-black text-sm mb-1.5 shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <div className="w-6 h-6 rounded-full bg-[#E2E8F0] dark:bg-slate-700 text-[#475569] dark:text-slate-300 flex items-center justify-center font-black text-[10px] mb-1">
                  2
                </div>
                <div className="font-display font-bold text-xs text-center truncate max-w-[95px] dark:text-white">
                  {top2.username || 'Player'}
                </div>
                <span className="text-[9px] text-[#8C93B0] dark:text-slate-400 truncate max-w-[85px] block">
                  {top2.topic}
                </span>
                <div className="text-[11px] font-black text-[#6C5CE7] dark:text-indigo-400 mb-2 mt-0.5">
                  {top2.score} pts
                </div>
                {/* 3D Pillar */}
                <div className="w-full h-24 bg-gradient-to-t from-[#E2E8F0] dark:from-slate-800 to-[#F1F5F9] dark:to-slate-700 border-t-4 border-[#CBD5E1] dark:border-slate-600 rounded-t-2xl flex flex-col items-center justify-center shadow-inner">
                  <span className="font-display font-black text-sm text-[#64748B] dark:text-slate-300">2nd</span>
                  <span className="text-[10px] text-[#94A3B8] dark:text-slate-400 font-bold">{top2.time_spent_seconds}s</span>
                </div>
              </div>

              {/* Rank 1 (Gold Central Highest Pillar) */}
              <div className="flex flex-col items-center -mt-4">
                <Crown className="w-7 h-7 text-[#FFB800] mb-1 animate-bounce" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFB800] to-[#FFEAA7] text-amber-900 flex items-center justify-center font-display font-black text-lg mb-1.5 shadow-md">
                  <User className="w-7 h-7" />
                </div>
                <div className="w-7 h-7 rounded-full bg-[#FFB800] text-white flex items-center justify-center font-black text-xs mb-1 shadow-sm">
                  1
                </div>
                <div className="font-display font-black text-xs sm:text-sm text-center truncate max-w-[105px] dark:text-white">
                  {top1.username || 'Champion'}
                </div>
                <span className="text-[9px] text-amber-500 font-bold truncate max-w-[95px] block">
                  {top1.topic}
                </span>
                <div className="text-[11px] font-black text-[#FF6B4A] dark:text-rose-400 mb-2 mt-0.5">
                  {top1.score} pts
                </div>
                {/* 3D Pillar */}
                <div className="w-full h-36 bg-gradient-to-t from-[#FF9F43] to-[#FECA57] border-t-4 border-[#FF6B4A] rounded-t-2xl flex flex-col items-center justify-center text-white shadow-md">
                  <span className="font-display font-black text-lg text-white">1st</span>
                  <span className="text-[10px] text-amber-100 font-bold">{top1.time_spent_seconds}s</span>
                </div>
              </div>

              {/* Rank 3 (Bronze Pillar) */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF3E8] dark:bg-rose-950/60 text-[#FF6B4A] dark:text-rose-400 flex items-center justify-center font-display font-black text-sm mb-1.5 shadow-sm">
                  <User className="w-6 h-6" />
                </div>
                <div className="w-6 h-6 rounded-full bg-[#E59866] text-white flex items-center justify-center font-black text-[10px] mb-1">
                  3
                </div>
                <div className="font-display font-bold text-xs text-center truncate max-w-[95px] dark:text-white">
                  {top3.username || 'Player'}
                </div>
                <span className="text-[9px] text-[#8C93B0] dark:text-slate-400 truncate max-w-[85px] block">
                  {top3.topic}
                </span>
                <div className="text-[11px] font-black text-[#6C5CE7] dark:text-indigo-400 mb-2 mt-0.5">
                  {top3.score} pts
                </div>
                {/* 3D Pillar */}
                <div className="w-full h-20 bg-gradient-to-t from-[#EDBB99] dark:from-amber-950/60 to-[#F5CBA7] dark:to-amber-900/60 border-t-4 border-[#DC7633] rounded-t-2xl flex flex-col items-center justify-center text-[#7E5109] dark:text-amber-200 shadow-inner">
                  <span className="font-display font-black text-sm">3rd</span>
                  <span className="text-[10px] text-[#A04000] dark:text-amber-300 font-bold">{top3.time_spent_seconds}s</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* List Ranking Tabel */}
      {activeTab !== 'my_history' ? (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-base text-[#1E2238] dark:text-white">
              Peringkat Live di Cloud ({dbLeaderboard.length} Rekor)
            </h3>
            <span className="text-xs font-bold text-[#6C5CE7] dark:text-indigo-400">
              {dbStats.total_points} Total Points Terakumulasi
            </span>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center border border-[#EAEFF8] dark:border-slate-800 flex items-center justify-center gap-2 text-xs font-bold text-[#6C5CE7] dark:text-indigo-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memuat data leaderboard dari Neon DB...</span>
            </div>
          ) : dbLeaderboard.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center border border-[#EAEFF8] dark:border-slate-800 text-[#8C93B0] dark:text-slate-400 text-xs font-bold">
              Belum ada data pengerjaan di cloud. Mainkan kuis pertama kamu!
            </div>
          ) : (
            <div className="space-y-2">
              {dbLeaderboard.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#EAEFF8] dark:border-slate-800 shadow-sm hover:border-[#6C5CE7]/30 dark:hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-400 font-display font-black text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-black text-sm text-[#1E2238] dark:text-white">
                          {item.username || 'Player'}
                        </h4>
                        <span className="px-2 py-0.5 rounded-md bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-400 font-bold text-[10px]">
                          {item.topic}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#8C93B0] dark:text-slate-400 font-medium">
                        {item.difficulty} • Durasi {item.time_spent_seconds}s
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-display font-black text-sm sm:text-base text-[#6C5CE7] dark:text-indigo-400 block">
                        {item.score * 100 || 0} pts
                      </span>
                      <span className="text-[10px] text-[#8C93B0] dark:text-slate-400 font-bold block">
                        {item.score}/{item.total_questions || 5} Benar
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        /* My History Tab */
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-black text-base text-[#1E2238] dark:text-white">
              Riwayat Offline Browser ({filteredHistory.length})
            </h3>
            {history.length > 0 && (
              <button
                onClick={() => setIsClearModalOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold"
              >
                Bersihkan
              </button>
            )}
          </div>

          <div className="space-y-2">
            {filteredHistory.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#EAEFF8] dark:border-slate-800 shadow-sm flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-display font-bold text-sm text-[#1E2238] dark:text-white">{item.topic}</h4>
                  <span className="text-[11px] text-[#8C93B0] dark:text-slate-400 font-medium">
                    {formatDate(item.timestamp)} • Skor: {item.score}/{item.total}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      localStorage.setItem('lastQuizResult', JSON.stringify(item));
                      localStorage.setItem('lastQuizInfo', JSON.stringify(item));
                      router.push('/quiz-result');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-400 text-xs font-bold hover:bg-[#E4DEFF] dark:hover:bg-indigo-900/60"
                  >
                    Detail Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modal Clear History */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Bersihkan Riwayat Lokal?"
        description="Semua riwayat pengerjaan di browser ini akan dibersihkan."
        confirmLabel="Hapus Semua"
        variant="danger"
        onConfirm={clearHistory}
      />
    </main>
  );
}