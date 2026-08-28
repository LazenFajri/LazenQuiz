'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Trophy, Flame, Play, Menu, X, Swords, User, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { useQuizStorage } from '@/hooks/useQuizStorage';
import { useTheme } from '@/components/providers/ThemeProvider';
import { LoginModal } from '@/components/auth/LoginModal';

export function Navbar() {
  const pathname = usePathname();
  const { activeQuiz, history } = useQuizStorage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; avatar: string } | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('lazenUser');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('lazenUser');
    setUser(null);
  };

  const isPlayPage = pathname === '/quiz-play';
  const totalScore = history.reduce((acc, h) => acc + (h.score || 0) * 100, 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-[#EAEFF8] dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo (Dribbble 3D Style) */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-[#6C5CE7]/30 group-hover:scale-105 transition-transform flex-shrink-0 flex items-center justify-center bg-slate-900 border border-[#6C5CE7]/30">
              <img
                src="/logo.png"
                alt="LazenQuiz Logo"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight text-[#1E2238] dark:text-white leading-tight">
                Lazen<span className="text-[#6C5CE7]">Quiz</span>
              </span>
              <span className="text-[9px] font-extrabold text-[#8C93B0] tracking-wider uppercase -mt-0.5">
                Knowledge Arena
              </span>
            </div>
          </Link>

          {/* Desktop Navigation & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF3E8] dark:bg-rose-950/40 border border-[#FFE0CC] dark:border-rose-900 text-[#FF6B4A] font-extrabold text-xs shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{totalScore} XP</span>
            </div>

            {activeQuiz && !isPlayPage && (
              <Link
                href="/quiz-play"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#6C5CE7] text-white text-xs font-bold shadow-md shadow-[#6C5CE7]/25 hover:bg-[#5842D8] transition-all animate-pulse"
              >
                <span>Lanjut Main</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </Link>
            )}

            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                  pathname === '/'
                    ? 'bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-300'
                    : 'text-[#646D89] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white hover:bg-[#F4F6FC] dark:hover:bg-slate-800'
                }`}
              >
                Explore
              </Link>

              <Link
                href="/quiz-pvp"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                  pathname === '/quiz-pvp'
                    ? 'bg-[#FFF0EB] dark:bg-rose-950/60 text-[#FF6B4A] dark:text-rose-300'
                    : 'text-[#646D89] dark:text-slate-400 hover:text-[#FF6B4A] hover:bg-[#FFF8F5] dark:hover:bg-slate-800'
                }`}
              >
                <Swords className="w-3.5 h-3.5 text-[#FF6B4A]" />
                <span>PvP Arena 1v1</span>
              </Link>

              <Link
                href="/quiz-history"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                  pathname === '/quiz-history'
                    ? 'bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-300'
                    : 'text-[#646D89] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white hover:bg-[#F4F6FC] dark:hover:bg-slate-800'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Leaderboard</span>
              </Link>
            </nav>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-2xl bg-[#F4F6FC] dark:bg-slate-800 text-[#1E2238] dark:text-amber-400 hover:bg-[#ECEEF8] dark:hover:bg-slate-700 transition-colors shadow-sm"
              title={theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Login / User Status */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#EAEFF8] dark:border-slate-800">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-300 text-xs font-bold">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[100px]">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Keluar"
                  className="p-2 rounded-xl text-[#94A3B8] hover:text-[#FF6B4A] hover:bg-[#FFF0EB] dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl btn-3d-brand text-white text-xs font-bold shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </button>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[#F4F6FC] dark:bg-slate-800 text-[#1E2238] dark:text-amber-400"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF3E8] dark:bg-rose-950/40 border border-[#FFE0CC] dark:border-rose-900 text-[#FF6B4A] font-extrabold text-[11px]">
              <Flame className="w-3 h-3 fill-current" />
              <span>{totalScore} XP</span>
            </div>

            {user ? (
              <div className="w-8 h-8 rounded-xl bg-[#F0EDFF] dark:bg-indigo-950 text-[#6C5CE7] flex items-center justify-center font-bold text-xs">
                {user.username.charAt(0).toUpperCase()}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-[#6C5CE7] text-white text-[11px] font-bold"
              >
                Masuk
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-2xl bg-[#F4F6FC] dark:bg-slate-800 text-[#1E2238] dark:text-slate-200 hover:bg-[#ECEEF8] dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#EAEFF8] dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1.5 animate-fade-in-up">
            {activeQuiz && !isPlayPage && (
              <Link
                href="/quiz-play"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-[#6C5CE7] text-white text-xs font-bold shadow-sm mb-2"
              >
                <span className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Lanjutkan Kuis Aktif</span>
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">Active</span>
              </Link>
            )}

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition-all ${
                pathname === '/' ? 'bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7]' : 'text-[#646D89] dark:text-slate-400 hover:bg-[#F4F6FC] dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
              <span>Explore Kuis & AI</span>
            </Link>

            <Link
              href="/quiz-pvp"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition-all ${
                pathname === '/quiz-pvp' ? 'bg-[#FFF0EB] dark:bg-rose-950/60 text-[#FF6B4A]' : 'text-[#646D89] dark:text-slate-400 hover:bg-[#F4F6FC] dark:hover:bg-slate-800'
              }`}
            >
              <Swords className="w-4 h-4 text-[#FF6B4A]" />
              <span>PvP Battle Arena 1v1</span>
            </Link>

            <Link
              href="/quiz-history"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition-all ${
                pathname === '/quiz-history' ? 'bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7]' : 'text-[#646D89] dark:text-slate-400 hover:bg-[#F4F6FC] dark:hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4 text-[#FFB800]" />
              <span>Live Leaderboard</span>
            </Link>
          </div>
        )}
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />
    </>
  );
}
