import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username wajib diisi').max(50),
  password: z.string().min(1, 'Password wajib diisi'),
});

export async function POST(req: Request) {
  const clientIp = getClientIp(req);

  // Rate limit: Max 15 login attempts per 10 minutes per IP
  const rateLimit = checkRateLimit(clientIp, 15, 10 * 60 * 1000);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Terlalu banyak percobaan login. Coba lagi dalam beberapa saat.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Username dan Password wajib diisi' }, { status: 400 });
    }

    const { username, password } = parseResult.data;

    await initDb();

    // 1. Fetch user from Neon PostgreSQL
    const userRecords = await sql`
      SELECT id, username, password_hash, xp, level 
      FROM users 
      WHERE username = ${username} 
      LIMIT 1;
    `;

    if (!userRecords || userRecords.length === 0) {
      return NextResponse.json(
        { error: 'Username atau password salah.' },
        { status: 401 }
      );
    }

    const user = userRecords[0];

    // 2. Securely verify password with bcrypt compare
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Username atau password salah.' },
        { status: 401 }
      );
    }

    // 3. Return authenticated user
    return NextResponse.json({
      success: true,
      message: 'Login berhasil!',
      user: {
        id: user.id,
        username: user.username,
        avatar: '👑',
        level: user.level || 1,
        xp: user.xp || 0,
      },
    });
  } catch (error: any) {
    console.error('Login API Error:', error.message);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat login.' },
      { status: 500 }
    );
  }
}
