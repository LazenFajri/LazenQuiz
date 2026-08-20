'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Swords,
  Shield,
  Zap,
  Flame,
  Clock,
  Trophy,
  User,
  Bot,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Wifi,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { MOCK_QUESTION_BANK, MockQuestion } from '@/lib/mockData';

interface Opponent {
  name: string;
  avatarIcon: string;
  rank: string;
  winRate: string;
  level: number;
}

const OPPONENT_POOL: Opponent[] = [
  { name: 'Nicola Tesla', avatarIcon: '⚡', rank: 'Grandmaster', winRate: '82%', level: 42 },
  { name: 'Isaac Newton', avatarIcon: '🍎', rank: 'Master', winRate: '78%', level: 38 },
  { name: 'Marie Curie', avatarIcon: '🧪', rank: 'Challenger', winRate: '85%', level: 45 },
  { name: 'Ada Lovelace', avatarIcon: '💻', rank: 'Grandmaster', winRate: '80%', level: 40 },
];

export default function PvPBattlePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'matchmaking' | 'versus' | 'battle' | 'result'>('matchmaking');
  const [opponent, setOpponent] = useState<Opponent>(OPPONENT_POOL[0]);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Scores & Answers
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [myStreak, setMyStreak] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [oppAnswerState, setOppAnswerState] = useState<'thinking' | 'answered'>('thinking');
  const [roundTimer, setRoundTimer] = useState(10);

  // Matchmaking simulation
  useEffect(() => {
    if (phase === 'matchmaking') {
      const selectedOpp = OPPONENT_POOL[Math.floor(Math.random() * OPPONENT_POOL.length)];
      setOpponent(selectedOpp);

      const allQs = Object.values(MOCK_QUESTION_BANK).flat();
      const shuffled = [...allQs].sort(() => 0.5 - Math.random()).slice(0, 5);
      setQuestions(shuffled);

      const timer = setTimeout(() => {
        setPhase('versus');
      }, 2500);
      return () => clearTimeout(timer);
    }

    if (phase === 'versus') {
      const timer = setTimeout(() => {
        setPhase('battle');
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Round Timer Countdown & Opponent simulation
  useEffect(() => {
    if (phase !== 'battle') return;

    if (roundTimer <= 0) {
      handleNextRound();
      return;
    }

    const timer = setInterval(() => {
      setRoundTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, roundTimer]);

  // Simulate Opponent answering with delay
  useEffect(() => {
    if (phase !== 'battle' || answered) return;
    setOppAnswerState('thinking');

    const delay = Math.random() * 4000 + 2000;
    const oppTimer = setTimeout(() => {
      setOppAnswerState('answered');
      const isOppCorrect = Math.random() < 0.75;
      if (isOppCorrect) {
        setOppScore((prev) => prev + 100);
      }
    }, delay);

    return () => clearTimeout(oppTimer);
  }, [phase, currentIdx]);

  const handleSelectOption = (idx: number) => {
    if (answered || phase !== 'battle') return;
    setSelectedOpt(idx);
    setAnswered(true);

    const isCorrect = idx === questions[currentIdx].correct;
    if (isCorrect) {
      const speedBonus = roundTimer * 10;
      setMyScore((prev) => prev + 100 + speedBonus);
      setMyStreak((prev) => prev + 1);
    } else {
      setMyStreak(0);
    }

    setTimeout(() => {
      handleNextRound();
    }, 1800);
  };

  const handleNextRound = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setAnswered(false);
      setRoundTimer(10);
      setOppAnswerState('thinking');
    } else {
      setPhase('result');
    }
  };

  const currentQ = questions[currentIdx];

  // 1. MATCHMAKING SCREEN
  if (phase === 'matchmaking') {
    return (
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <ScrollReveal direction="pop" delay={0}>
          <div className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-12 border border-[#ECEEF8] shadow-soft-lg text-center max-w-md w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#F0EDFF] text-[#6C5CE7] flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-soft-sm relative animate-float-gentle">
              <Swords className="w-8 h-8 sm:w-10 sm:h-10 text-[#6C5CE7]" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#10B981] rounded-full border-2 border-white animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EDFF] text-[#6C5CE7] font-extrabold text-[11px] sm:text-xs mb-3">
              <Wifi className="w-3.5 h-3.5 animate-pulse" />
              <span>Realtime Matchmaking</span>
            </div>

            <h1 className="font-display font-black text-xl sm:text-3xl text-[#1E2238] mb-2">
              Mencari Lawan...
            </h1>
            <p className="text-xs sm:text-sm text-[#8C93B0] font-medium mb-6 sm:mb-8">
              Menghubungkan kamu dengan pemain berkemampuan seimbang di server PvP.
            </p>

            <div className="w-full bg-[#F1F5F9] h-2.5 rounded-full overflow-hidden mb-6">
              <div className="h-full bg-gradient-to-r from-[#6C5CE7] via-[#FF6B4A] to-[#6C5CE7] rounded-full animate-shimmer" style={{ width: '100%' }} />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="text-xs text-[#8C93B0]"
            >
              Batalkan Pencarian
            </Button>
          </div>
        </ScrollReveal>
      </main>
    );
  }

  // 2. VERSUS CLASH SCREEN (Clean 3-Column Center-Anchored VS)
  if (phase === 'versus') {
    return (
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-3 sm:p-4">
        <ScrollReveal direction="pop" delay={0}>
          <div className="max-w-xl w-full">
            <div className="text-center mb-5 sm:mb-6">
              <span className="px-4 py-1.5 rounded-full bg-[#FF6B4A] text-white font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-coral-glow">
                Match Found!
              </span>
            </div>

            {/* Split Versus Card with Dedicated Center VS Column */}
            <div className="rounded-3xl sm:rounded-4xl overflow-hidden shadow-soft-lg border-2 sm:border-4 border-white flex items-stretch text-white">
              {/* Player Side (Purple) */}
              <div className="flex-1 bg-gradient-to-br from-[#6C5CE7] to-[#5842D8] p-4 sm:p-7 text-center flex flex-col items-center justify-center min-w-0">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2.5 sm:mb-3 shadow-soft-sm flex-shrink-0">
                  <User className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-display font-black text-sm sm:text-lg text-white truncate max-w-full">Kamu</h3>
                <span className="text-[10px] sm:text-xs font-bold text-purple-200 truncate max-w-full block">Level 24 • Pro</span>
              </div>

              {/* Dedicated Center VS Divider */}
              <div className="w-12 sm:w-16 bg-[#1E2238] flex items-center justify-center border-x-2 sm:border-x-4 border-white flex-shrink-0 relative z-10">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#2D325A] border-2 border-white/40 flex items-center justify-center font-display font-black text-xs sm:text-base text-[#FFEAA7] shadow-lg animate-pop-in">
                  VS
                </div>
              </div>

              {/* Opponent Side (Coral) */}
              <div className="flex-1 bg-gradient-to-br from-[#FF6B4A] to-[#E05334] p-4 sm:p-7 text-center flex flex-col items-center justify-center min-w-0">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2.5 sm:mb-3 shadow-soft-sm flex-shrink-0">
                  <Bot className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="font-display font-black text-sm sm:text-lg text-white truncate max-w-full">{opponent.name}</h3>
                <span className="text-[10px] sm:text-xs font-bold text-orange-200 truncate max-w-full block">
                  Lv.{opponent.level} • {opponent.rank}
                </span>
              </div>
            </div>

            <p className="text-center text-[11px] sm:text-xs font-bold text-[#8C93B0] mt-5 animate-pulse">
              Pertarungan kuis 5 ronde dimulai sekarang...
            </p>
          </div>
        </ScrollReveal>
      </main>
    );
  }

  // 3. FINAL BATTLE RESULT SCREEN
  if (phase === 'result') {
    const isWinner = myScore > oppScore;
    const isDraw = myScore === oppScore;

    return (
      <main className="py-6 sm:py-12 max-w-2xl mx-auto px-4">
        <ScrollReveal direction="pop" delay={0}>
          <div className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 border border-[#ECEEF8] shadow-soft-lg text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#FFF9E6] text-[#FFB800] flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-soft-sm">
              {isWinner ? <Trophy className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" /> : isDraw ? <Award className="w-8 h-8 sm:w-10 sm:h-10" /> : <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#64748B]" />}
            </div>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F0EDFF] text-[#6C5CE7] font-extrabold text-[11px] sm:text-xs mb-2 sm:mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Match Settlement</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl text-[#1E2238] mb-2">
              {isWinner ? 'Victory! Kamu Menang!' : isDraw ? 'Draw Match! Seri!' : 'Defeat! Tetap Semangat!'}
            </h1>
            <p className="text-xs sm:text-sm text-[#8C93B0] mb-6 sm:mb-8 font-medium">
              {isWinner
                ? 'Ketangkasan menjawabmu sangat cepat dan akurat!'
                : 'Lawan bermain sangat sengit, coba lagi untuk merebut kemenangan!'}
            </p>

            {/* Score Comparison Display */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] mb-6 sm:mb-8">
              <div className="text-center border-r border-[#E2E8F0] pr-2">
                <span className="text-[11px] sm:text-xs font-bold text-[#6C5CE7] block mb-1">Skor Kamu</span>
                <span className="font-display font-black text-2xl sm:text-4xl text-[#1E2238]">{myScore}</span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#10B981] block mt-1">+{isWinner ? '250' : '50'} XP</span>
              </div>
              <div className="text-center pl-2">
                <span className="text-[11px] sm:text-xs font-bold text-[#FF6B4A] block mb-1 truncate">{opponent.name}</span>
                <span className="font-display font-black text-2xl sm:text-4xl text-[#1E2238]">{oppScore}</span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#8C93B0] block mt-1">Lawan</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="coral"
                size="lg"
                onClick={() => {
                  setPhase('matchmaking');
                  setCurrentIdx(0);
                  setMyScore(0);
                  setOppScore(0);
                  setSelectedOpt(null);
                  setAnswered(false);
                }}
                className="w-full shadow-coral-glow justify-center text-xs sm:text-sm font-black"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                <span>Cari Lawan Lagi</span>
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/')}
                className="w-full justify-center text-xs sm:text-sm"
              >
                <span>Kembali ke Beranda</span>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </main>
    );
  }

  // 4. ACTIVE PVP BATTLE ROUND
  return (
    <main className="py-4 sm:py-10 max-w-3xl mx-auto px-2 sm:px-4">
      {/* Live PvP Header with Opponent Progress */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-[#ECEEF8] shadow-soft-sm mb-4 sm:mb-6">
        <div className="grid grid-cols-3 items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          {/* My Player HUD */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#6C5CE7] text-white flex items-center justify-center font-black text-xs shadow-purple-glow flex-shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8C93B0] block truncate">Kamu</span>
              <span className="font-display font-black text-xs sm:text-lg text-[#6C5CE7] block">{myScore} pts</span>
            </div>
          </div>

          {/* Round & Countdown Center Pill */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#FFE8E8] text-[#EF4444] font-display font-black text-xs sm:text-sm animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>{roundTimer}s</span>
            </div>
            <span className="block text-[9px] sm:text-[10px] font-extrabold text-[#8C93B0] mt-0.5 uppercase">
              Ronde {currentIdx + 1}/{questions.length}
            </span>
          </div>

          {/* Opponent HUD */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3 text-right min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#8C93B0] block truncate">
                {opponent.name}
              </span>
              <span className="font-display font-black text-xs sm:text-lg text-[#FF6B4A] block">{oppScore} pts</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#FF6B4A] text-white flex items-center justify-center font-black text-xs shadow-coral-glow flex-shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold pt-2 border-t border-[#F1F5F9] text-[#8C93B0]">
          <div className="flex items-center gap-1">
            {myStreak > 1 && (
              <span className="text-[#FF6B4A] flex items-center gap-0.5">
                <Flame className="w-3.5 h-3.5 fill-current" /> {myStreak}x Streak!
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span>Status:</span>
            {oppAnswerState === 'thinking' ? (
              <span className="text-[#6C5CE7] animate-pulse">Lawan Berpikir...</span>
            ) : (
              <span className="text-[#10B981]">Lawan Menjawab!</span>
            )}
          </div>
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <ScrollReveal direction="up" delay={0} key={`pvp-${currentIdx}`}>
          <div className="bg-white rounded-3xl sm:rounded-4xl p-4 sm:p-8 border border-[#ECEEF8] shadow-soft-lg mb-4 sm:mb-6">
            <div className="flex items-start gap-2.5 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-[#F0EDFF] text-[#6C5CE7] font-display font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                {currentIdx + 1}
              </div>
              <h2 className="font-display font-black text-sm sm:text-xl md:text-2xl text-[#1E2238] leading-snug">
                {currentQ.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5 sm:space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === currentQ.correct;

                let style = 'border-2 border-[#E2E8F0] bg-white hover:border-[#6C5CE7] text-[#1E2238]';
                let keyStyle = 'bg-[#F1F5F9] text-[#64748B]';

                if (answered) {
                  if (isCorrect) {
                    style = 'border-2 border-[#10B981] bg-[#ECFDF5] text-[#065F46] font-bold shadow-soft-sm';
                    keyStyle = 'bg-[#10B981] text-white font-black';
                  } else if (isSelected && !isCorrect) {
                    style = 'border-2 border-[#EF4444] bg-[#FEF2F2] text-[#991B1B] font-bold shadow-soft-sm';
                    keyStyle = 'bg-[#EF4444] text-white font-black';
                  } else {
                    style = 'opacity-40 border-[#E2E8F0] bg-white text-[#94A3B8]';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={answered}
                    className={`w-full text-left p-3 sm:p-4 rounded-2xl transition-all flex items-center justify-between gap-2.5 sm:gap-3 ${style} ${
                      answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-display font-black text-xs flex items-center justify-center flex-shrink-0 ${keyStyle}`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-xs sm:text-base font-semibold leading-relaxed">{opt}</span>
                    </div>

                    {answered && (
                      <div className="flex-shrink-0">
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-[#EF4444]" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      )}
    </main>
  );
}
