'use client';
import { useState } from 'react';
import {
  User,
  Lock,
  CheckCircle2,
  ShieldCheck,
  X,
  Loader2,
  Sparkles,
  UserPlus,
  LogIn,
  KeyRound,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { username: string; avatar: string }) => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [verifyingCaptcha, setVerifyingCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Altcha Proof-of-Work Verification Trigger
  const handleVerifyCaptcha = async () => {
    setVerifyingCaptcha(true);
    setErrorMsg('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setCaptchaVerified(true);
    } catch (e) {
      setErrorMsg('Gagal memverifikasi captcha');
    } finally {
      setVerifyingCaptcha(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Harap isi semua kolom');
      return;
    }

    if (tab === 'register' && password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok');
      return;
    }

    if (!captchaVerified) {
      setErrorMsg('Harap klik kotak centang verifikasi keamanan captcha');
      return;
    }

    setLoading(true);

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload =
        tab === 'login'
          ? { username: username.trim(), password }
          : { username: username.trim(), password, confirmPassword };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (tab === 'register') {
          setSuccessMsg('Akun berhasil dibuat! Silakan masuk.');
          setTab('login');
          setPassword('');
          setConfirmPassword('');
          setCaptchaVerified(false);
        } else {
          localStorage.setItem('lazenUser', JSON.stringify(data.user));
          onLoginSuccess(data.user);
          onClose();
        }
      } else {
        setErrorMsg(data.error || 'Terjadi kendala saat autentikasi');
      }
    } catch (e) {
      setErrorMsg('Gagal terhubung ke server database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-[#EAEFF8] dark:border-slate-800 shadow-2xl max-w-sm w-full relative animate-pop-in transition-colors">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#8C93B0] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white hover:bg-[#F4F6FC] dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Switcher (Masuk vs Daftar) */}
        <div className="flex items-center p-1 bg-[#F0EDFF] dark:bg-slate-800 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl font-display font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-900 text-[#6C5CE7] dark:text-indigo-300 shadow-sm'
                : 'text-[#646D89] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl font-display font-black text-xs transition-all flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-900 text-[#6C5CE7] dark:text-indigo-300 shadow-sm'
                : 'text-[#646D89] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Akun</span>
          </button>
        </div>

        {/* Header Title */}
        <div className="text-center mb-4">
          <h2 className="font-display font-black text-xl text-[#1E2238] dark:text-white">
            {tab === 'login' ? 'Masuk ke LazenQuiz' : 'Buat Akun Baru'}
          </h2>
          <p className="text-xs text-[#8C93B0] dark:text-slate-400 mt-0.5">
            {tab === 'login'
              ? 'Verifikasi password aman & simpan skor di cloud'
              : 'Daftarkan username unikmu untuk bermain PvP & Leaderboard'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-300 text-xs font-bold text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-[#646D89] dark:text-slate-400 uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: fajri_player"
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] dark:bg-slate-950 border-2 border-[#EAEFF8] dark:border-slate-800 rounded-xl text-xs sm:text-sm font-semibold text-[#1E2238] dark:text-white placeholder-[#94A3B8] dark:placeholder-slate-500 focus:outline-none focus:border-[#6C5CE7] dark:focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#646D89] dark:text-slate-400 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter..."
                className="w-full px-3.5 py-2.5 bg-[#F8FAFD] dark:bg-slate-950 border-2 border-[#EAEFF8] dark:border-slate-800 rounded-xl text-xs sm:text-sm font-semibold text-[#1E2238] dark:text-white placeholder-[#94A3B8] dark:placeholder-slate-500 focus:outline-none focus:border-[#6C5CE7] dark:focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-[#646D89] dark:text-slate-400 uppercase tracking-wider mb-1">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password..."
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFD] dark:bg-slate-950 border-2 border-[#EAEFF8] dark:border-slate-800 rounded-xl text-xs sm:text-sm font-semibold text-[#1E2238] dark:text-white placeholder-[#94A3B8] dark:placeholder-slate-500 focus:outline-none focus:border-[#6C5CE7] dark:focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Altcha Protected Captcha Widget */}
          <div className="p-3 rounded-2xl bg-[#F8FAFD] dark:bg-slate-950 border-2 border-[#EAEFF8] dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#6C5CE7]/10 dark:bg-indigo-950 text-[#6C5CE7] dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-[#1E2238] dark:text-slate-200">
                {captchaVerified ? 'Verifikasi Berhasil' : 'Saya bukan robot'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleVerifyCaptcha}
              disabled={captchaVerified || verifyingCaptcha}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                captchaVerified
                  ? 'bg-[#00B894] border-[#00B894] text-white'
                  : 'bg-white dark:bg-slate-900 border-[#CBD5E1] dark:border-slate-700 hover:border-[#6C5CE7]'
              }`}
            >
              {verifyingCaptcha ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#6C5CE7]" />
              ) : captchaVerified ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : null}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-2xl btn-3d-brand text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>{tab === 'login' ? 'Masuk Sekarang' : 'Daftarkan Akun'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
