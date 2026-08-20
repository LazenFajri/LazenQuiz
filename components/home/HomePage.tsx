'use client';
import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { FEATURED_CATEGORIES } from '@/lib/mockData';
import { useQuizStorage } from '@/hooks/useQuizStorage';

const categoryIcons = [
  <Code2 key="code" className="w-5 h-5 sm:w-6 sm:h-6 text-[#6C5CE7]" />,
  <Atom key="atom" className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6B4A]" />,
  <Landmark key="landmark" className="w-5 h-5 sm:w-6 sm:h-6 text-[#00B894]" />,
  <Globe2 key="globe" className="w-5 h-5 sm:w-6 sm:h-6 text-[#0984E3]" />,
  <Film key="film" className="w-5 h-5 sm:w-6 sm:h-6 text-[#E84393]" />,
  <Lightbulb key="bulb" className="w-5 h-5 sm:w-6 sm:h-6 text-[#F59E0B]" />,
];

const topChampions = [
  { name: 'Albert Einstein', role: 'Genius Tier', score: '3,840 pts', icon: <Atom className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" /> },
  { name: 'Ada Lovelace', role: 'Code Master', score: '3,650 pts', icon: <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" /> },
  { name: 'Isaac Newton', role: 'Physics Guru', score: '3,490 pts', icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" /> },
];

export function HomePage() {
  const router = useRouter();
  const { history, activeQuiz } = useQuizStorage();

  const totalQuizzes = history.length;
  const totalXP = history.reduce((acc, h) => acc + (h.score || 0) * 100, 0);

  return (
    <main className="py-6 sm:py-12 space-y-8 sm:space-y-12">
      {/* 1. Hero Gamesin & Quizzo Style Banner */}
      <ScrollReveal direction="up" delay={0}>
        <section className="relative rounded-3xl sm:rounded-4xl bg-gradient-to-r from-[#6C5CE7] via-[#7D6EF0] to-[#8C7AE6] text-white p-6 sm:p-10 md:p-12 overflow-hidden shadow-soft-lg">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none animate-float-gentle" />
          <div className="absolute bottom-0 left-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-[#FF6B4A]/20 rounded-full blur-2xl translate-y-1/2 pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] sm:text-xs font-extrabold uppercase tracking-wider mb-4 sm:mb-5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FFEAA7] animate-pulse-glow" />
              <span>Trivia Battle & Knowledge Game</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] mb-3 sm:mb-4 text-white">
              Play Quiz Together, <br className="hidden sm:block" />
              <span className="text-[#FFEAA7]">Level Up Your Brain!</span>
            </h1>

            <p className="text-purple-100 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 max-w-xl">
              Tantang wawasanmu dengan ribuan pertanyaan seru, kumpulkan XP, bertarung di arena 1v1, dan raih posisi teratas di Leaderboard!
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Button
                size="lg"
                variant="coral"
                onClick={() => router.push('/quiz-pvp')}
                className="w-full sm:w-auto shadow-coral-glow justify-center group font-black"
              >
                <Swords className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                <span>Play 1v1 PvP Arena</span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/quiz-setup')}
                className="w-full sm:w-auto bg-white text-[#6C5CE7] hover:bg-white/95 border-none shadow-soft-sm justify-center font-bold"
              >
                <span>Solo Practice</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 2. Quick Player Status & Competitions Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <ScrollReveal direction="left" delay={100} className="h-full">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ECEEF8] shadow-soft-sm flex items-center justify-between h-full">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF3E8] border border-[#FFE0CC] flex items-center justify-center text-[#FF6B4A] shadow-soft-sm flex-shrink-0">
                <User className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-bold text-[#8C93B0] uppercase">Profil Kamu</div>
                <h3 className="font-display font-black text-base sm:text-lg text-[#1E2238]">Juara Trivia</h3>
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#6C5CE7]">
                  <Flame className="w-3.5 h-3.5 fill-current text-[#FF6B4A]" />
                  <span>{totalXP} Total XP</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-black text-xl sm:text-2xl text-[#1E2238]">{totalQuizzes}</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-[#8C93B0]">Kuis Selesai</div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={200} className="md:col-span-2 h-full">
          <div className="bg-gradient-to-br from-[#1E2238] to-[#2D325A] text-white p-5 sm:p-6 rounded-3xl shadow-soft-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 h-full">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFEAA7] flex-shrink-0">
                <Swords className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#FF6B4A] text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                    Live Arena
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium">1v1 PvP Match</span>
                </div>
                <h3 className="font-display font-extrabold text-sm sm:text-lg text-white">
                  Battle of The Minds: Duel Pengetahuan
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300">Reward: +250 XP, Trophy Badges & Ranking Points</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="coral"
              onClick={() => router.push('/quiz-pvp')}
              className="w-full sm:w-auto shadow-coral-glow justify-center text-xs font-black"
            >
              Mulai Duel 1v1
            </Button>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Discover Quizzes */}
      <section className="space-y-4 sm:space-y-6">
        <ScrollReveal direction="up" delay={50}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl sm:text-3xl font-black text-[#1E2238] tracking-tight">
                Discover Quizzes
              </h2>
              <p className="text-xs sm:text-sm text-[#8C93B0] font-medium">
                Pilih kategori favoritmu dan mulai uji ketangkasan menjawab!
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/quiz-setup')}
              className="text-[#6C5CE7] hover:bg-[#F0EDFF] text-xs font-bold flex-shrink-0"
            >
              Lihat Semua <ChevronRight className="w-4 h-4 ml-0.5" />
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURED_CATEGORIES.map((cat, idx) => {
            const bgGradients = [
              'from-[#6C5CE7]/10 to-[#8C7AE6]/5 border-[#E6E2FF]',
              'from-[#FF6B4A]/10 to-[#FFA07A]/5 border-[#FFE7E0]',
              'from-[#00B894]/10 to-[#55EFC4]/5 border-[#E0F9F3]',
              'from-[#0984E3]/10 to-[#74B9FF]/5 border-[#E2F0FD]',
              'from-[#E84393]/10 to-[#FD79A8]/5 border-[#FDE6F1]',
              'from-[#FDCB6E]/15 to-[#FFEAA7]/10 border-[#FFF5DC]',
            ];

            return (
              <ScrollReveal
                key={cat.id}
                direction="up"
                delay={idx * 60}
                className="h-full"
              >
                <div
                  onClick={() => router.push(`/quiz-setup?topic=${cat.id}`)}
                  className={`card-soft card-soft-interactive p-5 sm:p-6 bg-gradient-to-br ${bgGradients[idx % bgGradients.length]} cursor-pointer flex flex-col justify-between h-full`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white shadow-soft-sm flex items-center justify-center">
                        {categoryIcons[idx % categoryIcons.length]}
                      </div>
                      <Badge variant={cat.popular ? 'coral' : 'purple'}>{cat.badge}</Badge>
                    </div>

                    <h3 className="font-display font-bold text-lg sm:text-xl text-[#1E2238] mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#646D89] leading-relaxed mb-4 sm:mb-6 font-medium">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-black/5 text-xs font-bold text-[#6C5CE7]">
                    <span>Mulai Sekarang</span>
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-soft-sm">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 4. Weekly Leaderboard Podium */}
      <ScrollReveal direction="up" delay={100}>
        <section className="bg-white p-5 sm:p-8 rounded-3xl sm:rounded-4xl border border-[#ECEEF8] shadow-soft-sm space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#6C5CE7] uppercase tracking-wider mb-0.5">
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
                <span>Top Champions</span>
              </div>
              <h2 className="font-display text-lg sm:text-2xl font-black text-[#1E2238]">
                Weekly Leaderboard
              </h2>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push('/quiz-history')}
              className="text-xs flex-shrink-0"
            >
              Lihat Rank
            </Button>
          </div>

          {/* Podium 3 Teratas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1 sm:pt-2">
            {topChampions.map((player, idx) => {
              const rankStyles = [
                'bg-[#FFF9E6] border-[#FFE7A3] text-[#B45309]',
                'bg-[#F1F5F9] border-[#E2E8F0] text-[#475569]',
                'bg-[#FFF1EC] border-[#FFD9CC] text-[#C2410C]',
              ];
              const medalIcons = [
                <Crown key="crown" className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFB800] animate-bounce" />,
                <Medal key="silver" className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />,
                <Award key="bronze" className="w-5 h-5 sm:w-6 sm:h-6 text-[#D97706]" />,
              ];

              return (
                <ScrollReveal
                  key={player.name}
                  direction="pop"
                  delay={idx * 100}
                >
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border text-center relative flex flex-col items-center justify-center card-soft-interactive ${rankStyles[idx]}`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white shadow-soft-sm flex items-center justify-center mb-2">
                      {medalIcons[idx]}
                    </div>
                    <h4 className="font-display font-extrabold text-[#1E2238] text-sm sm:text-base mb-0.5">
                      {player.name}
                    </h4>
                    <div className="text-[10px] sm:text-[11px] font-bold opacity-75 mb-2">{player.role}</div>
                    <div className="px-3 py-1 rounded-full bg-white font-extrabold text-xs shadow-soft-sm text-[#1E2238]">
                      {player.score}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}