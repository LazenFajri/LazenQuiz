'use client';
import { useState, useEffect } from 'react';
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
  BrainCircuit,
  Copy,
  Check,
  Users2,
  Play,
  Loader2,
  ChevronRight,
  AlertTriangle,
  Lock,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ErrorFallbackModal } from '@/components/ui/ErrorFallbackModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { MOCK_QUESTION_BANK, MockQuestion } from '@/lib/mockData';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export default function PvPBattlePage() {
  const router = useRouter();
  const [mode, setMode] = useState<'selection' | 'waiting_room' | 'battle' | 'result'>('selection');

  // User Auth State for PvP
  const [user, setUser] = useState<{ username: string; avatar: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [playerName, setPlayerName] = useState('Pemain 1');
  const [roomCode, setRoomCode] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [copied, setCopied] = useState(false);

  // Room data
  const [roomData, setRoomData] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Gameplay State
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [oppName, setOppName] = useState('Lawan');
  const [myStreak, setMyStreak] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [roundTimer, setRoundTimer] = useState(10);
  const [loading, setLoading] = useState(false);

  // Custom Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('lazenUser');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setUser(u);
        setPlayerName(u.username);
      }
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // 1. Create Real 1v1 Room with offline bank fallback
  const handleCreateRoom = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      let qList: Question[] = [];

      try {
        const genRes = await fetch('/api/quiz/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: 'Duel Pengetahuan Umum & Sains',
            difficulty: 'Medium',
            questionCount: 5,
          }),
        });

        if (genRes.ok) {
          const genData = await genRes.json();
          qList = genData.questions || [];
        }
      } catch (e) {
        console.warn('Fallback to local mock bank for room');
      }

      if (qList.length === 0) {
        const allQs: MockQuestion[] = Object.values(MOCK_QUESTION_BANK).flat();
        const shuffled = [...allQs].sort(() => 0.5 - Math.random()).slice(0, 5);
        qList = shuffled.map((q, idx) => ({
          id: idx + 1,
          question: q.question,
          options: q.options,
          correct: q.correct,
          explanation: q.explanation,
        }));
      }

      const roomRes = await fetch('/api/pvp/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          playerName: user.username || playerName || 'Player 1',
          topic: 'Duel 1v1 Teman Asli',
          questions: qList,
        }),
      });

      const resJson = await roomRes.json();
      if (resJson.success) {
        setRoomCode(resJson.room.code);
        setRoomData(resJson.room);
        setQuestions(qList);
        setMode('waiting_room');
      } else {
        throw new Error(resJson.error || 'Gagal membuat room');
      }
    } catch (e: any) {
      console.error(e);
      showToast(e.message || 'Gagal membuat room PvP. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Join Real 1v1 Room with Code
  const handleJoinRoom = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!joinCodeInput.trim()) {
      showToast('Ketik 4-digit room code terlebih dahulu.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/pvp/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          roomCode: joinCodeInput.trim().toUpperCase(),
          playerName: user.username || playerName || 'Player 2',
        }),
      });

      const resJson = await res.json();
      if (resJson.success) {
        setRoomData(resJson.room);
        setQuestions(resJson.room.questions);
        setOppName(resJson.room.hostName || 'Host');
        setMode('battle');
      } else {
        showToast(resJson.error || 'Room tidak ditemukan.');
      }
    } catch (e: any) {
      showToast('Terjadi kendala saat join room.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Quick Match with AI
  const handleQuickMatchAI = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setLoading(true);
    setOppName('Nicola Tesla (AI)');
    try {
      let qList: Question[] = [];
      try {
        const genRes = await fetch('/api/quiz/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: 'Teknologi & Pengetahuan Umum',
            difficulty: 'Medium',
            questionCount: 5,
          }),
        });
        if (genRes.ok) {
          const genData = await genRes.json();
          qList = genData.questions || [];
        }
      } catch (e) {}

      if (qList.length === 0) {
        const allQs: MockQuestion[] = Object.values(MOCK_QUESTION_BANK).flat();
        qList = [...allQs].sort(() => 0.5 - Math.random()).slice(0, 5);
      }

      setQuestions(qList);
      setMode('battle');
    } catch (e) {
      showToast('Gagal memulai Quick Match.');
    } finally {
      setLoading(false);
    }
  };

  // Poll waiting room if host is waiting for friend to join
  useEffect(() => {
    if (mode !== 'waiting_room' || !roomCode) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/pvp/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'poll', roomCode }),
        });
        const json = await res.json();
        if (json.success && json.room.players.length >= 2) {
          setRoomData(json.room);
          setOppName(json.room.players[1].name);
          setMode('battle');
        }
      } catch (e) {}
    }, 2000);

    return () => clearInterval(interval);
  }, [mode, roomCode]);

  // Round Timer Countdown during battle
  useEffect(() => {
    if (mode !== 'battle') return;

    if (roundTimer <= 0) {
      handleNextRound();
      return;
    }

    const timer = setInterval(() => {
      setRoundTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, roundTimer]);

  const handleSelectOption = (idx: number) => {
    if (answered || mode !== 'battle' || !questions[currentIdx]) return;
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

    if (oppName.includes('AI')) {
      const isOppCorrect = Math.random() < 0.75;
      if (isOppCorrect) {
        setOppScore((prev) => prev + 100 + Math.floor(Math.random() * 50));
      }
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
    } else {
      try {
        fetch('/api/quiz/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: `pvp_${Date.now()}`,
            topic: `PvP 1v1 vs ${oppName}`,
            difficulty: 'Medium',
            score: myScore,
            totalQuestions: questions.length,
            timeSpentSeconds: 50 - roundTimer,
          }),
        }).catch(() => {});
      } catch (e) {}

      setMode('result');
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentQ = questions[currentIdx];

  return (
    <main className="max-w-xl mx-auto py-4 space-y-4">
      {/* Floating Notification Toast */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#FFE0CC] dark:border-rose-900 shadow-xl text-xs font-bold text-[#FF6B4A] dark:text-rose-400 flex items-center gap-2 animate-pop-in">
          <AlertTriangle className="w-4 h-4 text-[#FF6B4A] dark:text-rose-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MODE 1: SELECTION MENU (Real Friend vs AI) */}
      {mode === 'selection' && (
        <ScrollReveal direction="down" delay={0}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-[#EAEFF8] dark:border-slate-800 shadow-sm text-center transition-colors">
            <div className="w-16 h-16 rounded-3xl bg-[#FFF0EB] dark:bg-rose-950/60 text-[#FF6B4A] dark:text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Swords className="w-8 h-8" />
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#1E2238] dark:text-white mb-1.5">
              1v1 PvP Battle Arena
            </h1>
            <p className="text-xs sm:text-sm text-[#8C93B0] dark:text-slate-400 max-w-sm mx-auto mb-5 font-medium">
              Tantang teman aslimu dengan Room Code atau duel cepat lawan Bot AI master trivia.
            </p>

            {/* If Not Logged In / Guest: Show Required Sign Up / Sign In Banner */}
            {!user ? (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#F0EDFF] to-[#FFF3E8] dark:from-slate-950 dark:to-slate-900 border-2 border-dashed border-[#6C5CE7]/40 dark:border-indigo-500/40 text-center space-y-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#6C5CE7] text-white flex items-center justify-center mx-auto shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-[#1E2238] dark:text-white">
                    Mode PvP Khusus Akun Terdaftar
                  </h3>
                  <p className="text-xs text-[#8C93B0] dark:text-slate-400 mt-0.5 max-w-xs mx-auto">
                    Daftar akun (Sign Up) atau Masuk terlebih dahulu untuk menikmati duel live bersama teman & klaim skor di Leaderboard!
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-5 py-2.5 rounded-2xl btn-3d-brand text-white font-black text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Daftar / Masuk Sekarang</span>
                  </button>

                  <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 text-[#646D89] dark:text-slate-300 font-bold text-xs hover:bg-[#F4F6FC]"
                  >
                    Kuis Biasa (Tanpa Login)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Logged in User Pill */}
                <div className="p-2.5 rounded-2xl bg-[#F0EDFF] dark:bg-indigo-950/40 border border-[#6C5CE7]/30 flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#6C5CE7] dark:text-indigo-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Login sebagai: <strong>{user.username}</strong></span>
                  </span>
                  <span className="text-[10px] bg-[#00B894] text-white font-black px-2 py-0.5 rounded-full">
                    PvP Ready
                  </span>
                </div>

                {/* Option A: Create Room with Friend */}
                <button
                  onClick={handleCreateRoom}
                  disabled={loading}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#6C5CE7] to-[#8C7AE6] text-white font-black text-sm flex items-center justify-between shadow-md shadow-[#6C5CE7]/25 hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="block font-display text-base leading-tight">Buat Room Duel (Lawan Teman)</span>
                      <span className="text-[11px] text-white/80 font-normal">Dapatkan 4-digit code & bagikan ke temanmu</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Option B: Join Room with Code */}
                <div className="p-4 rounded-2xl bg-[#F8FAFD] dark:bg-slate-950 border-2 border-[#EAEFF8] dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
                  <input
                    type="text"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    maxLength={4}
                    placeholder="Ketik 4-Digit Room Code..."
                    className="w-full sm:flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-[#EAEFF8] dark:border-slate-800 rounded-xl text-center sm:text-left font-display font-black tracking-widest text-[#1E2238] dark:text-white focus:outline-none focus:border-[#6C5CE7] uppercase text-sm"
                  />
                  <button
                    onClick={handleJoinRoom}
                    disabled={!joinCodeInput.trim() || loading}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-3d-brand text-white font-black text-xs disabled:opacity-40"
                  >
                    Join Room
                  </button>
                </div>

                {/* Option C: Quick AI Match */}
                <button
                  onClick={handleQuickMatchAI}
                  disabled={loading}
                  className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#EAEFF8] dark:border-slate-800 text-[#1E2238] dark:text-white hover:border-[#FF6B4A] dark:hover:border-rose-500 font-bold text-xs flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#FF6B4A] dark:text-rose-400" />
                    <span>Quick Match Lawan Bot AI (Instant Play)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8C93B0] dark:text-slate-400" />
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>
      )}

      {/* MODE 2: WAITING ROOM FOR FRIEND */}
      {mode === 'waiting_room' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-[#EAEFF8] dark:border-slate-800 shadow-md space-y-5 text-center transition-colors">
          <div className="w-16 h-16 rounded-3xl bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-400 flex items-center justify-center mx-auto animate-pulse-pill">
            <Wifi className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-display font-black text-2xl text-[#1E2238] dark:text-white mb-1">
              Menunggu Teman Masuk...
            </h2>
            <p className="text-xs text-[#8C93B0] dark:text-slate-400">
              Bagikan kode room ini kepada temanmu untuk mulai bertarung.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0EDFF] dark:bg-slate-950 border-2 border-dashed border-[#6C5CE7] dark:border-indigo-500 flex items-center justify-between">
            <span className="font-display font-black text-3xl tracking-widest text-[#6C5CE7] dark:text-indigo-400">
              {roomCode}
            </span>
            <button
              onClick={copyRoomCode}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-[#6C5CE7] dark:text-indigo-300 font-bold text-xs shadow-sm flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin'}</span>
            </button>
          </div>

          <button
            onClick={() => setMode('selection')}
            className="text-xs font-bold text-[#8C93B0] dark:text-slate-400 hover:text-[#1E2238] dark:hover:text-white"
          >
            Batalkan Room
          </button>
        </div>
      )}

      {/* MODE 3: RESULT SCREEN */}
      {mode === 'result' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-[#EAEFF8] dark:border-slate-800 shadow-md space-y-5 text-center transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF3E8] dark:bg-rose-950/60 text-[#FF6B4A] dark:text-rose-400 flex items-center justify-center mx-auto text-3xl">
            {myScore > oppScore ? <Trophy className="w-9 h-9 text-[#FFB800]" /> : <Award className="w-9 h-9 text-[#6C5CE7] dark:text-indigo-400" />}
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#1E2238] dark:text-white">
            {myScore > oppScore ? 'Victory! Kamu Menang!' : myScore === oppScore ? 'Draw Match!' : 'Defeat! Pertandingan Sengit!'}
          </h1>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F8FAFD] dark:bg-slate-950 border border-[#EAEFF8] dark:border-slate-800">
            <div className="border-r border-[#EAEFF8] dark:border-slate-800 pr-2">
              <span className="text-xs font-bold text-[#6C5CE7] dark:text-indigo-400 block mb-1">Skor Kamu</span>
              <span className="font-display font-black text-3xl text-[#1E2238] dark:text-white">{myScore}</span>
            </div>
            <div className="pl-2">
              <span className="text-xs font-bold text-[#FF6B4A] dark:text-rose-400 block mb-1">{oppName}</span>
              <span className="font-display font-black text-3xl text-[#1E2238] dark:text-white">{oppScore}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode('selection');
                setCurrentIdx(0);
                setMyScore(0);
                setOppScore(0);
                setSelectedOpt(null);
                setAnswered(false);
              }}
              className="flex-1 py-3 rounded-xl btn-3d-coral text-white font-black text-xs"
            >
              Main Lagi
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 rounded-xl bg-[#F0EDFF] dark:bg-slate-800 text-[#6C5CE7] dark:text-indigo-300 font-bold text-xs"
            >
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* MODE 4: LIVE 1v1 BATTLE ROUND */}
      {mode === 'battle' && (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-[#EAEFF8] dark:border-slate-800 shadow-sm transition-colors">
            <div className="grid grid-cols-3 items-center gap-2">
              {/* Player HUD */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center font-black text-xs shadow-sm">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8C93B0] dark:text-slate-400 block truncate max-w-[70px]">
                    {user?.username || 'Kamu'}
                  </span>
                  <span className="font-display font-black text-sm text-[#6C5CE7] dark:text-indigo-400">{myScore} pts</span>
                </div>
              </div>

              {/* Countdown Center */}
              <div className="text-center">
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF3E8] dark:bg-rose-950/60 text-[#FF6B4A] dark:text-rose-300 font-display font-black text-xs animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{roundTimer}s</span>
                </div>
                <span className="block text-[9px] font-extrabold text-[#8C93B0] dark:text-slate-400 mt-0.5">
                  Ronde {currentIdx + 1}/{questions.length}
                </span>
              </div>

              {/* Opponent HUD */}
              <div className="flex items-center justify-end gap-2 text-right">
                <div>
                  <span className="text-[10px] font-bold text-[#8C93B0] dark:text-slate-400 block truncate max-w-[80px]">
                    {oppName}
                  </span>
                  <span className="font-display font-black text-sm text-[#FF6B4A] dark:text-rose-400">{oppScore} pts</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#FF6B4A] text-white flex items-center justify-center font-black text-xs shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          {currentQ && (
            <div className="bg-gradient-to-br from-[#6C5CE7] to-[#7D6EF0] rounded-3xl p-6 text-white shadow-md">
              <span className="text-[11px] font-extrabold uppercase text-purple-200 block mb-2">
                Soal #{currentIdx + 1}
              </span>
              <h2 className="font-display font-black text-lg text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>
          )}

          {/* Answer Options */}
          {currentQ && (
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === currentQ.correct;

                let style = 'bg-white dark:bg-slate-900 border-2 border-[#EAEFF8] dark:border-slate-800 text-[#1E2238] dark:text-white hover:border-[#6C5CE7] dark:hover:border-indigo-500';
                let keyStyle = 'bg-[#F0EDFF] dark:bg-indigo-950/60 text-[#6C5CE7] dark:text-indigo-400';

                if (answered) {
                  if (isCorrect) {
                    style = 'border-2 border-[#00B894] bg-[#E0F9F3] dark:bg-teal-950/50 text-[#00B894] dark:text-teal-300 font-bold';
                    keyStyle = 'bg-[#00B894] text-white font-black';
                  } else if (isSelected && !isCorrect) {
                    style = 'border-2 border-[#FF6B4A] bg-[#FFF0EB] dark:bg-rose-950/50 text-[#FF6B4A] dark:text-rose-300 font-bold';
                    keyStyle = 'bg-[#FF6B4A] text-white font-black';
                  } else {
                    style = 'opacity-40 bg-white dark:bg-slate-900 border-[#EAEFF8] dark:border-slate-800 text-[#94A3B8]';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={answered}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between gap-3 shadow-sm ${style}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl font-display font-black text-xs flex items-center justify-center ${keyStyle}`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold">{opt}</span>
                    </div>

                    {answered && (
                      <div>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-[#00B894]" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-[#FF6B4A]" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Sign Up / Login Modal for PvP */}
      <LoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(u) => {
          setUser(u);
          setPlayerName(u.username);
          setIsAuthModalOpen(false);
          showToast(`Selamat datang, ${u.username}! Mode PvP sekarang terbuka.`);
        }}
      />
    </main>
  );
}
