'use client';
import { useState } from 'react';
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
  User,
  GraduationCap,
  Briefcase,
  Compass,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useQuizStorage } from '@/hooks/useQuizStorage';

const mockTopPlayers = [
  { rank: 1, name: 'Pedro (Genius)', points: '3,645 pts', icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" /> },
  { rank: 2, name: 'Andrew (Pro)', points: '3,496 pts', icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" /> },
  { rank: 3, name: 'Freida (Explorer)', points: '3,178 pts', icon: <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" /> },
  { rank: 4, name: 'Clinton (Ace)', points: '2,846 pts', icon: <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" /> },
];

export default function QuizHistoryPage() {
  const { history, clearHistory, removeFromHistory } = useQuizStorage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalQuizzes = history.length;
  const bestScore = history.length > 0 ? Math.max(...history.map((h) => h.score || 0)) : 0;
  const totalXP = history.reduce((acc, h) => acc + (h.score || 0) * 100, 0);

  const filteredHistory = [...history].reverse().filter((item) =>
    item.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInspect = (item: any) => {
    localStorage.setItem('lastQuizResult', JSON.stringify(item));
    localStorage.setItem('lastQuizInfo', JSON.stringify(item));
    router.push('/quiz-result');
  };

  return (
    <main className="py-6 sm:py-12 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <ScrollReveal direction="down" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#6C5CE7] uppercase mb-0.5">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
              <span>Leaderboard & History</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-[#1E2238]">
              Hall of Fame
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {history.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsClearModalOpen(true)}
                className="text-xs text-[#EF4444] border-[#FCA5A5] hover:bg-[#FEF2F2]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bersihkan</span>
              </Button>
            )}

            <Button
              variant="coral"
              size="sm"
              onClick={() => router.push('/quiz-setup')}
              className="shadow-coral-glow text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Kuis Baru</span>
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Podium Top 3 Leaderboard */}
      <ScrollReveal direction="up" delay={100}>
        <div className="bg-gradient-to-br from-[#6C5CE7] to-[#5842D8] text-white p-5 sm:p-8 rounded-3xl sm:rounded-4xl shadow-soft-lg">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="font-display font-black text-lg sm:text-2xl text-white">
              Top Players of The Week
            </h2>
            <p className="text-[11px] sm:text-xs text-purple-200">Raih skor tertinggi untuk masuk ke podium juara!</p>
          </div>

          {/* 3 Columns Podium */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 items-end max-w-lg mx-auto pt-2 sm:pt-4">
            {/* Rank 2 */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center mb-1.5 shadow-soft-sm">
                {mockTopPlayers[1].icon}
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center font-black text-[10px] sm:text-xs mb-1">
                2
              </div>
              <div className="font-display font-bold text-[11px] sm:text-sm text-center truncate max-w-[80px] sm:max-w-none">
                {mockTopPlayers[1].name.split(' ')[0]}
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-purple-200 mb-1.5">
                {mockTopPlayers[1].points}
              </div>
              <div className="w-full h-18 sm:h-24 bg-white/20 rounded-t-xl sm:rounded-t-2xl flex items-center justify-center font-display font-black text-sm sm:text-lg">
                2nd
              </div>
            </div>

            {/* Rank 1 */}
            <div className="flex flex-col items-center">
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFD700] mb-1 animate-bounce" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/25 border border-white/30 flex items-center justify-center mb-1.5 shadow-soft-sm">
                {mockTopPlayers[0].icon}
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFD700] text-amber-900 flex items-center justify-center font-black text-xs mb-1 shadow-md">
                1
              </div>
              <div className="font-display font-black text-xs sm:text-base text-center truncate max-w-[90px] sm:max-w-none">
                {mockTopPlayers[0].name.split(' ')[0]}
              </div>
              <div className="text-[10px] sm:text-[11px] font-extrabold text-[#FFEAA7] mb-1.5">
                {mockTopPlayers[0].points}
              </div>
              <div className="w-full h-24 sm:h-32 bg-white/30 rounded-t-xl sm:rounded-t-2xl flex items-center justify-center font-display font-black text-lg sm:text-2xl text-[#FFEAA7]">
                1st
              </div>
            </div>

            {/* Rank 3 */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center mb-1.5 shadow-soft-sm">
                {mockTopPlayers[2].icon}
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#CD7F32] text-white flex items-center justify-center font-black text-[10px] sm:text-xs mb-1">
                3
              </div>
              <div className="font-display font-bold text-[11px] sm:text-sm text-center truncate max-w-[80px] sm:max-w-none">
                {mockTopPlayers[2].name.split(' ')[0]}
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-purple-200 mb-1.5">
                {mockTopPlayers[2].points}
              </div>
              <div className="w-full h-14 sm:h-18 bg-white/15 rounded-t-xl sm:rounded-t-2xl flex items-center justify-center font-display font-black text-xs sm:text-base">
                3rd
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* User Progress Stats Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <ScrollReveal direction="up" delay={150}>
          <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#ECEEF8] shadow-soft-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold text-[#8C93B0] uppercase mb-1">Kuis Dimainkan</div>
            <div className="font-display font-black text-xl sm:text-2xl text-[#1E2238]">{totalQuizzes} Sesi</div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#ECEEF8] shadow-soft-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold text-[#8C93B0] uppercase mb-1">Skor Terbaik</div>
            <div className="font-display font-black text-xl sm:text-2xl text-[#6C5CE7]">{bestScore} Benar</div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={250}>
          <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#ECEEF8] shadow-soft-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold text-[#8C93B0] uppercase mb-1">Total XP Dikumpulkan</div>
            <div className="font-display font-black text-xl sm:text-2xl text-[#FF6B4A]">+{totalXP} XP</div>
          </div>
        </ScrollReveal>
      </section>

      {/* History Records List */}
      <div className="space-y-4">
        <ScrollReveal direction="up" delay={280}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-display text-xl sm:text-2xl font-black text-[#1E2238]">
              Riwayat Pengerjaan Kamu
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik kuis..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-2xl text-xs font-semibold text-[#1E2238] placeholder-[#94A3B8] focus:outline-none focus:border-[#6C5CE7]"
              />
            </div>
          </div>
        </ScrollReveal>

        {filteredHistory.length === 0 ? (
          <ScrollReveal direction="up" delay={300}>
            <div className="bg-white p-8 sm:p-10 rounded-2xl sm:rounded-3xl text-center border border-[#ECEEF8] shadow-soft-sm text-[#8C93B0] text-xs sm:text-sm font-semibold">
              {history.length === 0
                ? 'Belum ada riwayat kuis. Mainkan kuis pertamamu sekarang!'
                : 'Tidak ada riwayat yang cocok dengan pencarian.'}
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {filteredHistory.map((item, index) => {
              const pct =
                item.total && item.total > 0
                  ? Math.round(((item.score || 0) / item.total) * 100)
                  : 0;

              return (
                <ScrollReveal
                  key={item.id || index}
                  direction="up"
                  delay={index * 60}
                >
                  <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#ECEEF8] shadow-soft-sm hover:border-[#D5D8FB] hover:shadow-soft-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleInspect(item)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-base sm:text-lg text-[#1E2238] hover:text-[#6C5CE7] transition-colors">
                          {item.topic}
                        </h3>
                        <Badge variant="purple" size="sm">
                          {item.difficulty}
                        </Badge>
                      </div>
                      <div className="text-[11px] sm:text-xs font-bold text-[#8C93B0]">
                        {formatDate(item.timestamp)} • {item.questionCount || item.questions?.length || 0} Soal
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
                      <div
                        className="text-left sm:text-right cursor-pointer"
                        onClick={() => handleInspect(item)}
                      >
                        <div className="font-display font-black text-lg sm:text-xl text-[#6C5CE7]">
                          {item.score || 0}/{item.total || 0}
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-bold text-[#8C93B0]">{pct}% Akurasi</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleInspect(item)}
                          className="text-xs"
                        >
                          Detail
                        </Button>
                        <button
                          onClick={() => setDeleteTargetId(item.id)}
                          className="p-2 rounded-xl text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Bersihkan Semua Riwayat?"
        description="Semua catatan skor dan riwayat pengerjaanmu akan dihapus dari perangkat ini."
        confirmLabel="Hapus Semua"
        variant="danger"
        onConfirm={clearHistory}
      />

      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Hapus Sesi Kuis Ini?"
        description="Data pengerjaan untuk topik ini akan dihapus permanen."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={() => {
          if (deleteTargetId) removeFromHistory(deleteTargetId);
        }}
      />
    </main>
  );
}