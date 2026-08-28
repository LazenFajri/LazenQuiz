import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { MOCK_QUESTION_BANK, MockQuestion } from '@/lib/mockData';

// 1. Strict Zod Input Validation Schema
const generateQuizSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(1, 'Topik kuis tidak boleh kosong')
    .max(80, 'Topik maksimal 80 karakter')
    .refine((val) => !/<[^>]*script/i.test(val) && !/<[^>]*iframe/i.test(val), {
      message: 'Karakter atau tag HTML tidak diizinkan',
    }),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
  questionCount: z.number().int().min(3).max(10).default(5),
});

const quizResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    difficulty: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correct: {
            type: Type.INTEGER,
            description: 'Index integer jawaban benar: 0=A, 1=B, 2=C, 3=D',
          },
          explanation: {
            type: Type.STRING,
            description: 'Penjelasan 1 kalimat singkat dan padat',
          },
        },
        required: ['id', 'question', 'options', 'correct', 'explanation'],
      },
    },
  },
  required: ['topic', 'difficulty', 'questions'],
};

export async function POST(req: Request) {
  const clientIp = getClientIp(req);

  // 2. Rate Limiting: Max 20 requests per 10 minutes per IP
  const rateLimit = checkRateLimit(clientIp, 20, 10 * 60 * 1000);
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Santai Dulu! Server Sedang Sibuk ⚡',
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  // 3. Header check
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { error: 'Invalid Content-Type. Harap gunakan application/json.' },
      { status: 415 }
    );
  }

  let rawBody: any = null;
  try {
    rawBody = await req.json();

    // 4. Validate with Zod
    const parseResult = generateQuizSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Input tidak valid', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { topic, difficulty, questionCount } = parseResult.data;

    // 5. Check API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY tidak ditemukan, menggunakan bank soal lokal');
      return NextResponse.json(getFallbackQuiz(topic, difficulty, questionCount));
    }

    const ai = new GoogleGenAI({ apiKey });

    // Prompt ultra-ringkas & cepat: penjelasan 1 kalimat agar inferensi kilat
    const prompt = `Buatlah kuis pilihan ganda ${questionCount} butir soal dalam Bahasa Indonesia.
Topik: "${topic}"
Tingkat Kesulitan: ${difficulty}

Ketentuan Cepat:
1. Soal wajib 100% spesifik topik "${topic}".
2. Tepat 4 pilihan (A, B, C, D) per soal.
3. 'correct' adalah index integer (0 untuk A, 1 untuk B, 2 untuk C, 3 untuk D).
4. Penjelasan ringkas maksimal 1 kalimat per butir soal.`;

    // Gunakan gemini-3.5-flash-lite untuk latensi paling rendah & kecepatan maksimal
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: quizResponseSchema,
        temperature: 0.4,
      },
    });

    if (!response.text) {
      throw new Error('Gemini API mengembalikan respons kosong');
    }

    const parsedData = JSON.parse(response.text);

    return NextResponse.json({
      id: `quiz_${Date.now()}`,
      topic: parsedData.topic || topic,
      difficulty: parsedData.difficulty || difficulty,
      questionCount: parsedData.questions?.length || questionCount,
      questions: parsedData.questions,
    });
  } catch (error: any) {
    console.error('Quiz Generation Error:', error.message);
    const fallback = getFallbackQuiz(rawBody?.topic || 'Fisika & Sains', 'Medium', 5);
    return NextResponse.json(fallback, { status: 200 });
  }
}

function getFallbackQuiz(topic: string, difficulty: string, count: number) {
  const allQs: MockQuestion[] = Object.values(MOCK_QUESTION_BANK).flat();
  const shuffled = [...allQs].sort(() => 0.5 - Math.random()).slice(0, count);

  return {
    id: `quiz_fb_${Date.now()}`,
    topic: topic || 'Pengetahuan Umum',
    difficulty: difficulty || 'Medium',
    questionCount: shuffled.length,
    questions: shuffled.map((q, idx) => ({
      id: idx + 1,
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation,
    })),
  };
}
