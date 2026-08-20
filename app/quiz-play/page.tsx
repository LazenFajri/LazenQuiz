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
      router.push('/quiz-setup');
    }
  }, [ready, activeQuiz, router]);

  const handleComplete = (results: any) => {
    if (!activeQuiz) return;
    const record: StoredQuiz = {
      ...activeQuiz,
      score: results.score,
      total: results.total,
      answers: results.answers,
      durationSeconds: results.durationSeconds || 0,
      timestamp: new Date().toISOString(),
    };
    addToHistory(record);
    localStorage.setItem('lastQuizResult', JSON.stringify(record));
    localStorage.setItem('lastQuizInfo', JSON.stringify(activeQuiz));
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