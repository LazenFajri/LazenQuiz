import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(64, 'Password maksimal 64 karakter'),
  confirmPassword: z.string().optional(),
});

export async function POST(req: Request) {
  const clientIp = getClientIp(req);

  // Rate limit: Max 10 registration attempts per 15 minutes per IP
  const rateLimit = checkRateLimit(clientIp, 10, 15 * 60 * 1000);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Terlalu banyak percobaan pendaftaran. Coba lagi nanti.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parseResult = registerSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.issues[0]?.message || 'Input data tidak valid';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { username, password, confirmPassword } = parseResult.data;

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json({ error: 'Konfirmasi password tidak cocok' }, { status: 400 });
    }

    await initDb();

    // 1. Check if username already exists in database
    const existing = await sql`
      SELECT id FROM users WHERE username = ${username} LIMIT 1;
    `;

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: `Username "${username}" sudah digunakan. Silakan gunakan username lain.` },
        { status: 409 }
      );
    }

    // 2. Securely hash password with bcrypt salt rounds
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Insert new user into Neon DB
    const inserted = await sql`
      INSERT INTO users (username, password_hash, xp, level)
      VALUES (${username}, ${passwordHash}, 0, 1)
      RETURNING id, username, xp, level, created_at;
    `;

    const newUser = inserted[0];

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil!',
      user: {
        id: newUser.id,
        username: newUser.username,
        avatar: '👑',
        level: newUser.level || 1,
        xp: newUser.xp || 0,
      },
    });
  } catch (error: any) {
    console.error('Register API Error:', error.message);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat mendaftar.' },
      { status: 500 }
    );
  }
}
