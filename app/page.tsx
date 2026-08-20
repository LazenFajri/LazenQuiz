'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HomePage } from '@/components/home/HomePage';

export default function Home() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('lazen-quiz');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.activeQuiz) {
        router.push('/quiz-play');
        return;
      }
    }
    setChecked(true);
  }, [router]);

  if (!checked) return null;

  return <HomePage />;
}