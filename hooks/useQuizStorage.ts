'use client';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'lazen-quiz';

export interface StoredQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface StoredAnswer {
  questionId: number;
  selected: number | null;
  correct: number;
}

export interface StoredQuiz {
  id: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  questions: StoredQuestion[];
  timestamp?: string;
  score?: number;
  total?: number;
  durationSeconds?: number;
  answers?: StoredAnswer[];
}

export interface UseQuizStorageReturn {
  activeQuiz: StoredQuiz | null;
  history: StoredQuiz[];
  bookmarks: number[];
  setActiveQuiz: (quiz: StoredQuiz) => void;
  clearActiveQuiz: () => void;
  addToHistory: (record: StoredQuiz) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  toggleBookmark: (questionId: number) => void;
  isBookmarked: (questionId: number) => boolean;
}

function load(): {
  activeQuiz: StoredQuiz | null;
  history: StoredQuiz[];
  bookmarks: number[];
} {
  if (typeof window === 'undefined') {
    return { activeQuiz: null, history: [], bookmarks: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { activeQuiz: null, history: [], bookmarks: [] };
    const parsed = JSON.parse(raw);
    return {
      activeQuiz: parsed.activeQuiz ?? null,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
    };
  } catch {
    return { activeQuiz: null, history: [], bookmarks: [] };
  }
}

export function useQuizStorage(): UseQuizStorageReturn {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota limits
    }
  }, [state]);

  const toggleBookmark = (questionId: number) => {
    setState((prev) => {
      const exists = prev.bookmarks.includes(questionId);
      const nextBookmarks = exists
        ? prev.bookmarks.filter((id) => id !== questionId)
        : [...prev.bookmarks, questionId];
      return { ...prev, bookmarks: nextBookmarks };
    });
  };

  const isBookmarked = (questionId: number) => {
    return state.bookmarks.includes(questionId);
  };

  return {
    activeQuiz: state.activeQuiz,
    history: state.history,
    bookmarks: state.bookmarks,
    setActiveQuiz: (quiz) => setState((prev) => ({ ...prev, activeQuiz: quiz })),
    clearActiveQuiz: () => setState((prev) => ({ ...prev, activeQuiz: null })),
    addToHistory: (record) =>
      setState((prev) => ({
        ...prev,
        history: [...prev.history, record],
      })),
    removeFromHistory: (id) =>
      setState((prev) => ({
        ...prev,
        history: prev.history.filter((h) => h.id !== id),
      })),
    clearHistory: () => setState((prev) => ({ ...prev, history: [] })),
    toggleBookmark,
    isBookmarked,
  };
}