import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-[#ECEEF8] dark:border-slate-800 shadow-soft-lg text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-3xl bg-[#FFF3E8] dark:bg-rose-950/60 text-[#FF6B4A] flex items-center justify-center mx-auto mb-4 font-display font-black text-2xl">
          404
        </div>
        <h1 className="font-display font-black text-2xl text-[#1E2238] dark:text-white mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-xs text-[#8C93B0] dark:text-slate-400 mb-6">Halaman kuis yang Anda tuju tidak tersedia atau telah dipindahkan.</p>
        <Link href="/">
          <Button variant="purple" size="sm" className="gap-1.5">
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Button>
        </Link>
      </div>
    </main>
  );
}
