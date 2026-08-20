'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QuizSetupForm } from '@/components/quiz/setup/QuizSetupForm';
import { useQuizStorage } from '@/hooks/useQuizStorage';
import { getMockQuiz } from '@/lib/mockData';
import type { StoredQuiz } from '@/hooks/useQuizStorage';

function QuizSetupContent() {
  const { setActiveQuiz } = useQuizStorage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get('topic') || '';
  const [loading, setLoading] = useState(false);

  const handleStart = async (
    topic: string,
    difficulty: string,
    questionCount: number
  ) => {
    setLoading(true);
    // Simulate generation latency
    await new Promise((resolve) => setTimeout(resolve, 900));
    const quiz = getMockQuiz(topic, difficulty, questionCount);
    setActiveQuiz(quiz as StoredQuiz);
    setLoading(false);
    router.push('/quiz-play');
  };

  return (
    <div className="w-full py-8 sm:py-12">
      <QuizSetupForm
        initialTopic={initialTopic}
        onStart={handleStart}
        loading={loading}
      />
    </div>
  );
}

export default function QuizSetupPage() {
  return (
    <main className="min-h-[calc(100vh-4.5rem)] px-4 sm:px-6 flex items-center justify-center">
      <Suspense fallback={<div className="text-slate-400 text-sm">Memuat form kuis...</div>}>
        <QuizSetupContent />
      </Suspense>
    </main>
  );
}