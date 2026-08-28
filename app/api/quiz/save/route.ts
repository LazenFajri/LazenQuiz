import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Strict Zod Validation Schema for Score Submission
const saveQuizAttemptSchema = z.object({
  sessionId: z.string().trim().min(1).max(64).regex(/^[a-zA-Z0-9_-]+$/, 'Session ID must be alphanumeric'),
  username: z.string().trim().max(50).optional().default('Player'),
  topic: z.string().trim().min(1).max(100).refine((val) => !/<[^>]*script/i.test(val), 'HTML tags forbidden'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  score: z.number().int().min(0).max(1000, 'Score exceeds maximum allowed'),
  totalQuestions: z.number().int().min(1).max(100),
  timeSpentSeconds: z.number().int().min(0).max(7200, 'Time spent exceeds realistic threshold'),
});

export async function POST(req: Request) {
  const clientIp = getClientIp(req);

  // 1. Rate Limiting: Max 20 requests per 5 minutes per IP
  const rateLimit = checkRateLimit(clientIp, 20, 5 * 60 * 1000);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Too Many Requests', retryAfterSeconds: rateLimit.retryAfterSeconds },
      { status: 429 }
    );
  }

  // 2. Validate Content-Type
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid Content-Type' }, { status: 415 });
  }

  try {
    const body = await req.json();

    // 3. Validate Payload with Zod
    const parseResult = saveQuizAttemptSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const {
      sessionId,
      username,
      topic,
      difficulty,
      score,
      totalQuestions,
      timeSpentSeconds,
    } = parseResult.data;

    // Ensure table exists (idempotent)
    await initDb();

    // 4. Safe Parameterized Queries (Anti-SQLi)
    const result = await sql`
      INSERT INTO quiz_attempts (
        session_id,
        username,
        topic,
        difficulty,
        score,
        total_questions,
        time_spent_seconds
      )
      VALUES (
        ${sessionId},
        ${username || 'Player'},
        ${topic},
        ${difficulty},
        ${score},
        ${totalQuestions},
        ${timeSpentSeconds}
      )
      RETURNING id, created_at;
    `;

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error: any) {
    console.error('Neon DB Save Error:', error.message);
    return NextResponse.json(
      { error: 'Gagal menyimpan riwayat pengerjaan ke database' },
      { status: 500 }
    );
  }
}
