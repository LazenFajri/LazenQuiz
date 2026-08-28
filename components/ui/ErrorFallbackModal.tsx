'use client';
import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  WifiOff,
  ServerCrash,
  RotateCcw,
  BookOpen,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ErrorFallbackProps {
  type: 'rate_limit' | 'server_error' | 'offline';
  title?: string;
  message?: string;
  retryAfterSeconds?: number;
  onRetry?: () => void;
  onUseOfflineFallback?: () => void;
  onClose?: () => void;
}

export function ErrorFallbackModal({
  type,
  title,
  message,
  retryAfterSeconds = 30,
  onRetry,
  onUseOfflineFallback,
  onClose,
}: ErrorFallbackProps) {
  const [countdown, setCountdown] = useState(retryAfterSeconds);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const isRateLimit = type === 'rate_limit';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAEFF8] shadow-2xl max-w-md w-full relative animate-pop-in">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-[#8C93B0] hover:text-[#1E2238] hover:bg-[#F4F6FC] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Icon & Status */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
              isRateLimit
                ? 'bg-[#FFF3E8] text-[#FF6B4A]'
                : 'bg-rose-50 text-rose-500'
            }`}
          >
            {isRateLimit ? (
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            ) : (
              <ServerCrash className="w-6 h-6" />
            )}
          </div>

          <div>
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                isRateLimit
                  ? 'bg-[#FFF3E8] text-[#FF6B4A]'
                  : 'bg-rose-50 text-rose-500'
              }`}
            >
              {isRateLimit ? 'Anti-Spam Shield' : 'Layanan Terkendala'}
            </span>
            <h3 className="font-display font-black text-lg text-[#1E2238] leading-tight mt-0.5">
              {title || (isRateLimit ? 'Santai Dulu! Server Sedang Sibuk ⚡' : 'Layanan Istirahat Sebentar')}
            </h3>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs text-[#646D89] leading-relaxed mb-4">
          {message ||
            (isRateLimit
              ? 'Kamu telah melakukan generate kuis cukup banyak dalam waktu singkat untuk menjaga kuota AI tetap stabil.'
              : 'Terjadi kendala koneksi ke server AI. Tenang, kuis lokalmu tetap aman dan siap dimainkan.')}
        </p>

        {/* Countdown Pill for Rate Limit */}
        {isRateLimit && countdown > 0 && (
          <div className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#F0EDFF] text-[#6C5CE7] font-display font-black text-xs mb-4">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Coba lagi dalam {countdown} detik</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {onUseOfflineFallback && (
            <button
              onClick={onUseOfflineFallback}
              className="w-full py-3 rounded-2xl btn-3d-brand text-white font-black text-xs flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Gunakan Bank Soal Cadangan Offline</span>
            </button>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRateLimit && countdown > 0}
              className="w-full py-2.5 rounded-2xl bg-[#F4F6FC] hover:bg-[#ECEEF8] disabled:opacity-40 text-[#1E2238] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isRateLimit && countdown > 0 ? `Menunggu (${countdown}s)` : 'Coba Lagi'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
