export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  questionId: number;
  selected: number | null; // null = tidak dijawab
}

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  durationSeconds: number;
  answers: QuizAnswer[];
  timestamp: string;
}

export interface QuizRecord extends QuizResult {
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

export interface QuizService {
  /**
   * Membuat kuis baru dari topik/kategori tertentu.
   * Saat ini menggunakan mock data, nanti akan dihubungkan ke Gemini API.
   */
  generateQuiz(topic: string, difficulty: QuizDifficulty, count: number): Promise<Quiz>;

  /**
   * Menyimpan hasil kuis ke penyimpanan (localStorage / backend database).
   */
  saveResult(result: QuizResult): Promise<void>;

  /**
   * Mengambil riwayat kuis pengguna.
   */
  getHistory(): Promise<QuizRecord[]>;
}

export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';

export const quizService: QuizService = {
  async generateQuiz(_topic, _difficulty, _count): Promise<Quiz> {
    // TODO: Ganti dengan pemanggilan Gemini API di server
    // const response = await fetch('/api/generate-quiz', { ... });
    throw new Error('Not implemented yet - akan dihubungkan ke Gemini API');
  },

  async saveResult(_result: QuizResult): Promise<void> {
    // TODO: Kirim ke backend (misal: POST /api/quiz/result)
    // localStorage sudah ditangani oleh useQuizStorage
  },

  async getHistory(): Promise<QuizRecord[]> {
    // TODO: Ambil dari backend (misal: GET /api/quiz/history)
    return [];
  },
};