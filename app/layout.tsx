import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LazenQuiz - Dribbble Aesthetic AI Trivia & 1v1 PvP Arena',
  description:
    'Play smart quizzes, compete live on real Neon DB leaderboards, and battle friends in 1v1 PvP rooms.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-[#F0F4FA] dark:bg-slate-950 text-[#1E2238] dark:text-slate-100 min-h-screen antialiased selection:bg-[#6C5CE7]/20 selection:text-[#6C5CE7] transition-colors duration-200">
        <ThemeProvider>
          <SmoothScrollProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6">
                {children}
              </div>
            </div>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}