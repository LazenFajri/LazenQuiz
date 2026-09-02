'use client';
import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Gauge,
  Clock,
  Layers,
  ArrowRight,
  Flame,
  Check,
  Zap,
  Sprout,
  Flame as FlameIcon,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { FEATURED_CATEGORIES } from '@/lib/mockData';

interface QuizSetupFormProps {
  initialTopic?: string;
  onStart: (topic: string, difficulty: string, questionCount: number) => void;
  loading?: boolean;
}

const difficulties = [
  {
    id: 'Easy',
    label: 'Easy',
    desc: 'Pemanasan & fakta seru',
    badgeColor: 'emerald',
    iconComponent: <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-[#10B981] flex-shrink-0" />,
  },
  {
    id: 'Medium',
    label: 'Medium',
    desc: 'Tantangan standar',
    badgeColor: 'purple',
    iconComponent: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#6C5CE7] flex-shrink-0" />,
  },
  {
    id: 'Hard',
    label: 'Hard',
    desc: 'Untuk para master trivia',
    badgeColor: 'coral',
    iconComponent: <FlameIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B4A] flex-shrink-0" />,
  },
];

export function QuizSetupForm({
  initialTopic = '',
  onStart,
  loading = false,
}: QuizSetupFormProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(10);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!topic.trim()) return;
    onStart(topic.trim(), difficulty, questionCount);
  };

  const estimatedMinutes = Math.ceil((questionCount * 30) / 60);

  return (
    <div className="w-full max-w-2xl mx-auto py-2 sm:py-6 px-1 sm:px-0">
      <ScrollReveal direction="up" delay={0}>
        <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-4xl p-5 sm:p-10 border border-[#ECEEF8] dark:border-slate-800 shadow-soft-lg">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <ScrollReveal direction="pop" delay={100}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-soft-sm">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#6C5CE7] animate-pulse-glow" />
              </div>
            </ScrollReveal>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-[#1E2238] dark:text-white tracking-tight mb-1.5 sm:mb-2">
              Create Custom Quiz
            </h1>
            <p className="text-xs sm:text-sm text-[#8C93B0] dark:text-slate-400 font-medium max-w-sm mx-auto">
              Atur topik kuis favoritmu, pilih level kesulitan, dan mulai mainkan tantangannya!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-7">
            {/* Topic Input */}
            <ScrollReveal direction="up" delay={120}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-extrabold text-[#1E2238] dark:text-white uppercase tracking-wider">
                    1. Pilih Topik / Subjek
                  </label>
                  {topic && (
                    <button
                      type="button"
                      onClick={() => setTopic('')}
                      className="text-[11px] text-[#FF6B4A] font-bold hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Teknologi, Science, Sejarah Dunia, Film..."
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-[#F8FAFC] dark:bg-slate-800 border-2 border-[#E2E8F0] dark:border-slate-700 rounded-2xl focus:outline-none focus:border-[#6C5CE7] focus:bg-white dark:focus:bg-slate-800 text-[#1E2238] dark:text-white placeholder-[#94A3B8] dark:placeholder-slate-500 text-xs sm:text-sm font-semibold transition-all shadow-inner"
                />

                {/* Quick Topic Pills */}
                <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#8C93B0] dark:text-slate-400 mr-0.5">Rekomendasi:</span>
                  {FEATURED_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setTopic(cat.id)}
                      className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border-2 font-bold transition-all ${
                        topic.toLowerCase() === cat.id.toLowerCase()
                          ? 'bg-[#6C5CE7] border-[#6C5CE7] text-white shadow-soft-sm'
                          : 'bg-white dark:bg-slate-800 border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-300 hover:border-[#6C5CE7] hover:text-[#6C5CE7]'
                      }`}
                    >
                      {cat.name.split('&')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Difficulty Cards */}
            <ScrollReveal direction="up" delay={200}>
              <div>
                <label className="block text-xs font-extrabold text-[#1E2238] dark:text-white uppercase tracking-wider mb-2.5">
                  2. Level Tantangan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {difficulties.map((d) => {
                    const isSelected = difficulty === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDifficulty(d.id)}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#6C5CE7] bg-[#F0EDFF] dark:bg-indigo-950/60 shadow-soft-sm'
                            : 'border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#CBD5E1] dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {d.iconComponent}
                            <span
                              className={`font-display text-xs sm:text-sm font-black ${
                                isSelected ? 'text-[#6C5CE7] dark:text-indigo-300' : 'text-[#1E2238] dark:text-white'
                              }`}
                            >
                              {d.label}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#6C5CE7] flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-[11px] font-medium text-[#64748B] dark:text-slate-400">{d.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* Question Count Selector (Fully responsive slider & wrap-free pills) */}
            <ScrollReveal direction="up" delay={280}>
              <div className="bg-[#F8FAFC] dark:bg-slate-800/60 border-2 border-[#E2E8F0] dark:border-slate-700 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-extrabold text-[#1E2238] dark:text-white uppercase tracking-wider">
                    3. Jumlah Soal
                  </label>
                  <span className="font-display font-black text-lg sm:text-xl text-[#6C5CE7]">
                    {questionCount} Soal
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="20"
                  step="5"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full h-2 sm:h-2.5 bg-[#E2E8F0] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#6C5CE7] my-2"
                />

                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 text-xs pt-1.5">
                  <div className="grid grid-cols-4 gap-1.5 sm:flex sm:items-center sm:gap-2">
                    {[5, 10, 15, 20].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setQuestionCount(step)}
                        className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-extrabold text-center transition-all ${
                          questionCount === step
                            ? 'bg-[#6C5CE7] text-white shadow-soft-sm'
                            : 'bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 text-[#64748B] dark:text-slate-300 hover:text-[#1E2238] dark:hover:text-white'
                        }`}
                      >
                        {step}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-[#FF6B4A] mt-1 xs:mt-0 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{estimatedMinutes} Menit</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Submit Action */}
            <ScrollReveal direction="up" delay={340}>
              <Button
                type="submit"
                disabled={!topic.trim() || loading}
                loading={loading}
                size="lg"
                variant="coral"
                className="w-full shadow-coral-glow text-sm sm:text-base font-black py-3.5 sm:py-4 justify-center"
              >
                {loading ? (
                  'Menyiapkan Soal Kuis...'
                ) : (
                  <>
                    <span>Start Quiz Game</span>
                    <Play className="w-4 h-4 fill-current ml-1" />
                  </>
                )}
              </Button>
            </ScrollReveal>
          </form>
        </div>
      </ScrollReveal>
    </div>
  );
}