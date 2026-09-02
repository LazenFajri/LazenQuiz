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
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Brand Logo (Responsive sizing) */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 sm:gap-2.5 group flex-shrink min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg shadow-[#6C5CE7]/30 group-hover:scale-105 transition-transform flex-shrink-0 flex items-center justify-center bg-slate-900 border border-[#6C5CE7]/30">
              <img
                src="/logo.png"
                alt="LazenQuiz Logo"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-[#1E2238] dark:text-white leading-tight truncate">
                Lazen<span className="text-[#6C5CE7]">Quiz</span>
              </span>
              <span className="hidden xs:inline-block text-[8px] sm:text-[9px] font-extrabold text-[#8C93B0] tracking-wider uppercase -mt-0.5 truncate">
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
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            {/* Quick XP Pill on Header (single line, no wrap) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF3E8] dark:bg-rose-950/50 border border-[#FFE0CC] dark:border-rose-900/60 text-[#FF6B4A] font-black text-[11px] shadow-sm whitespace-nowrap">
              <Flame className="w-3.5 h-3.5 fill-current flex-shrink-0" />
              <span>{totalScore} XP</span>
            </div>

            {/* Quick Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[#F4F6FC] dark:bg-slate-800 text-[#1E2238] dark:text-amber-400 hover:bg-[#ECEEF8] transition-colors border border-transparent dark:border-slate-700/60"
              title="Ganti Tema"
              aria-label="Ganti Tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile User Profile Sheet (Opened via Bottom Nav 'Akun' button) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#EAEFF8] dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 animate-fade-in-up">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFD] dark:bg-slate-950 border border-[#EAEFF8] dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#6C5CE7]/10 dark:bg-indigo-950 flex items-center justify-center text-[#6C5CE7] font-black text-sm border border-[#6C5CE7]/20">
                  {user ? user.username.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1E2238] dark:text-white">
                    {user ? user.username : 'Tamu'}
                  </span>
                  <span className="text-[11px] text-[#8C93B0]">
                    Total <strong className="text-[#FF6B4A]">{totalScore} XP</strong> terkumpul
                  </span>
                </div>
              </div>

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-100 dark:border-rose-900 hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl btn-3d-brand text-white text-xs font-bold shadow-sm"
                >
                  Masuk
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-2.5 pointer-events-none safe-bottom">
        <nav
          aria-label="Mobile Bottom Navigation"
          className="pointer-events-auto max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-[#EAEFF8] dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-3xl p-1.5 flex items-center justify-around"
        >
          {/* 1. Explore */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-2xl transition-all ${
              pathname === '/'
                ? 'bg-[#F0EDFF] dark:bg-indigo-950/70 text-[#6C5CE7] dark:text-indigo-300 font-extrabold shadow-sm scale-105'
                : 'text-[#8C93B0] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white font-semibold'
            }`}
          >
            <Sparkles className={`w-5 h-5 mb-0.5 ${pathname === '/' ? 'text-[#6C5CE7] dark:text-indigo-300 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-tight">Explore</span>
          </Link>

          {/* 2. PvP 1v1 Arena */}
          <Link
            href="/quiz-pvp"
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-2xl transition-all ${
              pathname === '/quiz-pvp'
                ? 'bg-[#FFF0EB] dark:bg-rose-950/70 text-[#FF6B4A] dark:text-rose-300 font-extrabold shadow-sm scale-105'
                : 'text-[#8C93B0] dark:text-slate-400 hover:text-[#FF6B4A] font-semibold'
            }`}
          >
            <Swords className={`w-5 h-5 mb-0.5 ${pathname === '/quiz-pvp' ? 'text-[#FF6B4A] dark:text-rose-300 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-tight">PvP 1v1</span>
          </Link>

          {/* 3. Continue Active Quiz (if available) */}
          {activeQuiz && !isPlayPage ? (
            <Link
              href="/quiz-play"
              className="flex flex-col items-center justify-center -mt-5 px-3 py-2 rounded-2xl bg-[#6C5CE7] text-white font-black shadow-lg shadow-[#6C5CE7]/40 hover:bg-[#5842D8] transition-all transform active:scale-95 animate-bounce"
            >
              <Play className="w-5 h-5 fill-current mb-0.5" />
              <span className="text-[9px] uppercase tracking-wider">Main</span>
            </Link>
          ) : null}

          {/* 4. Leaderboard / History */}
          <Link
            href="/quiz-history"
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-2xl transition-all ${
              pathname === '/quiz-history'
                ? 'bg-[#FFFBEB] dark:bg-amber-950/70 text-[#D97706] dark:text-amber-300 font-extrabold shadow-sm scale-105'
                : 'text-[#8C93B0] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white font-semibold'
            }`}
          >
            <Trophy className={`w-5 h-5 mb-0.5 ${pathname === '/quiz-history' ? 'text-[#D97706] dark:text-amber-300 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] leading-tight">Ranking</span>
          </Link>

          {/* 5. User Profile / Modal Trigger */}
          <button
            onClick={() => {
              if (user) {
                setMobileMenuOpen(!mobileMenuOpen);
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-2xl transition-all ${
              mobileMenuOpen
                ? 'bg-[#F0EDFF] dark:bg-indigo-950/70 text-[#6C5CE7] font-extrabold'
                : 'text-[#8C93B0] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white font-semibold'
            }`}
          >
            {user ? (
              <User className={`w-5 h-5 mb-0.5 ${mobileMenuOpen ? 'text-[#6C5CE7] dark:text-indigo-300 stroke-[2.5]' : ''}`} />
            ) : (
              <LogIn className="w-5 h-5 mb-0.5" />
            )}
            <span className="text-[10px] leading-tight truncate max-w-[50px]">
              {user ? 'Akun' : 'Masuk'}
            </span>
          </button>
        </nav>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />
    </>
  );
}
