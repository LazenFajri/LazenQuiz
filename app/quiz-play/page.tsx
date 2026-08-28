'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuizPlay } from '@/components/quiz/play/QuizPlay';
import { useQuizStorage } from '@/hooks/useQuizStorage';
import type { StoredQuiz } from '@/hooks/useQuizStorage';

export default function QuizPlayPage() {
  const { activeQuiz, addToHistory, clearActiveQuiz } = useQuizStorage();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !activeQuiz) {
      router.push('/');
    }
  }, [ready, activeQuiz, router]);

  const handleComplete = async (results: any) => {
    if (!activeQuiz) return;
    const durationSeconds = results.durationSeconds || 0;
    const record: StoredQuiz = {
      ...activeQuiz,
      score: results.score,
      total: results.total,
      answers: results.answers,
      durationSeconds,
      timestamp: new Date().toISOString(),
    };

    // 1. Save full detailed attempt in client-side LocalStorage for zero-cloud review
    addToHistory(record);
    localStorage.setItem('lastQuizResult', JSON.stringify(record));
    localStorage.setItem('lastQuizInfo', JSON.stringify(activeQuiz));

    // 2. Non-blocking summary save to Neon DB (saving only aggregated row to conserve storage)
    try {
      let currentUsername = 'Player';
      try {
        const saved = localStorage.getItem('lazenUser');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.username) currentUsername = parsed.username;
        }
      } catch {}

      fetch('/api/quiz/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeQuiz.id || `sess_${Date.now()}`,
          username: currentUsername,
          topic: activeQuiz.topic,
          difficulty: activeQuiz.difficulty,
          score: results.score,
          totalQuestions: results.total,
          timeSpentSeconds: durationSeconds,
        }),
      }).catch((err) => console.error('Neon DB background save error:', err));
    } catch (e) {
      console.error(e);
    }

    clearActiveQuiz();
    router.push('/quiz-result');
  };

  if (!ready || !activeQuiz) return null;

  return (
    <main className="min-h-[calc(100vh-4.5rem)] py-6 sm:py-10">
      <QuizPlay quiz={activeQuiz} onComplete={handleComplete} />
    </main>
  );
}