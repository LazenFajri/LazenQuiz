import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET(req: Request) {
  try {
    await initDb();

    // 1. Fetch top scores aggregated from Neon DB
    const topAttempts = await sql`
      SELECT 
        session_id,
        topic,
        difficulty,
        score,
        total_questions,
        time_spent_seconds,
        created_at
      FROM quiz_attempts
      ORDER BY score DESC, time_spent_seconds ASC
      LIMIT 20;
    `;

    // 2. Fetch total aggregates
    const stats = await sql`
      SELECT 
        COUNT(*)::int as total_plays,
        COALESCE(SUM(score), 0)::int as total_points,
        COALESCE(AVG(score)::numeric(10,1), 0) as avg_score
      FROM quiz_attempts;
    `;

    return NextResponse.json({
      success: true,
      data: topAttempts || [],
      stats: stats[0] || { total_plays: 0, total_points: 0, avg_score: 0 },
    });
  } catch (error: any) {
    console.error('Neon DB Leaderboard Error:', error);
    return NextResponse.json({
      success: false,
      data: [],
      stats: { total_plays: 0, total_points: 0, avg_score: 0 },
      error: error.message,
    });
  }
}
