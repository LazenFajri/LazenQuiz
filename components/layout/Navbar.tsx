'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Compass, History, Trophy, Flame, Play, User, Menu, X, Swords } from 'lucide-react';
import { useQuizStorage } from '@/hooks/useQuizStorage';

export function Navbar() {
  const pathname = usePathname();
  const { activeQuiz, history } = useQuizStorage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPlayPage = pathname === '/quiz-play' || pathname === '/quiz-pvp';
  const totalScore = history.reduce((acc, h) => acc + (h.score || 0) * 100, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#ECEEF8] shadow-soft-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#8C7AE6] flex items-center justify-center shadow-purple-glow group-hover:scale-105 transition-transform flex-shrink-0">
            <span className="font-display font-black text-white text-xl sm:text-2xl">Q</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-[#1E2238]">
              Lazen<span className="text-[#6C5CE7]">Quiz</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-[#8C93B0] tracking-wider uppercase -mt-1 hidden xs:block">
              Trivia & Knowledge
            </span>
          </div>
        </Link>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF3E8] border border-[#FFE0CC] text-[#FF6B4A] font-extrabold text-xs">
            <Flame className="w-4 h-4 fill-current" />
            <span>{totalScore} XP</span>
          </div>

          {activeQuiz && !isPlayPage && (
            <Link
              href="/quiz-play"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#6C5CE7] text-white text-xs font-bold shadow-purple-glow hover:bg-[#5842D8] transition-all animate-pulse"
            >
              <span>Lanjut Main</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </Link>
          )}

          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                pathname === '/'
                  ? 'bg-[#F0EDFF] text-[#6C5CE7]'
                  : 'text-[#646D89] hover:text-[#1E2238] hover:bg-[#F4F6FC]'
              }`}
            >
              Explore
            </Link>

            <Link
              href="/quiz-pvp"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                pathname === '/quiz-pvp'
                  ? 'bg-[#FFF3E8] text-[#FF6B4A]'
                  : 'text-[#646D89] hover:text-[#FF6B4A] hover:bg-[#FFF8F5]'
              }`}
            >
              <Swords className="w-4 h-4 text-[#FF6B4A]" />
              <span>PvP Battle</span>
            </Link>

            <Link
              href="/quiz-setup"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                pathname === '/quiz-setup'
                  ? 'bg-[#F0EDFF] text-[#6C5CE7]'
                  : 'text-[#646D89] hover:text-[#1E2238] hover:bg-[#F4F6FC]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Create Quiz</span>
            </Link>

            <Link
              href="/quiz-history"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                pathname === '/quiz-history'
                  ? 'bg-[#F0EDFF] text-[#6C5CE7]'
                  : 'text-[#646D89] hover:text-[#1E2238] hover:bg-[#F4F6FC]'
              }`}
            >
              <Trophy className="w-4 h-4 text-[#FFB800]" />
              <span>Leaderboard</span>
            </Link>
          </nav>
        </div>

        {/* Mobile Right Controls */}
        <div className="flex md:hidden items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF3E8] border border-[#FFE0CC] text-[#FF6B4A] font-extrabold text-[11px]">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{totalScore} XP</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#F4F6FC] text-[#1E2238] hover:bg-[#ECEEF8] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#ECEEF8] bg-white px-4 py-4 space-y-2 animate-fade-in-up">
          <Link
            href="/quiz-pvp"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#FF8E53] text-white text-xs font-bold shadow-coral-glow mb-2"
          >
            <span className="flex items-center gap-2">
              <Swords className="w-4 h-4" />
              <span>PvP Battle Arena 1v1</span>
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-black">Live</span>
          </Link>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-bold transition-all ${
              pathname === '/' ? 'bg-[#F0EDFF] text-[#6C5CE7]' : 'text-[#646D89] hover:bg-[#F4F6FC]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
            <span>Explore Quizzes</span>
          </Link>

          <Link
            href="/quiz-setup"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-bold transition-all ${
              pathname === '/quiz-setup' ? 'bg-[#F0EDFF] text-[#6C5CE7]' : 'text-[#646D89] hover:bg-[#F4F6FC]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#6C5CE7]" />
            <span>Create Custom Quiz</span>
          </Link>

          <Link
            href="/quiz-history"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-bold transition-all ${
              pathname === '/quiz-history' ? 'bg-[#F0EDFF] text-[#6C5CE7]' : 'text-[#646D89] hover:bg-[#F4F6FC]'
            }`}
          >
            <Trophy className="w-4 h-4 text-[#FFB800]" />
            <span>Leaderboard & History</span>
          </Link>
        </div>
      )}
    </header>
  );
}
