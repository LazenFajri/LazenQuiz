import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

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
  title: 'LazenQuiz - Fun & Engaging Trivia Game Quiz',
  description:
    'Play smart quizzes, compete on the leaderboard, earn medals, and level up your knowledge in a sleek modern design.',
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
    >
      <body className="font-sans bg-[#F4F6FC] text-[#1E2238] min-h-screen antialiased selection:bg-[#6C5CE7]/20 selection:text-[#6C5CE7]">
        <SmoothScrollProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6">
              {children}
            </div>
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}