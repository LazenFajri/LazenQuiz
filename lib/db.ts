import { neon } from '@neondatabase/serverless';

// Neon Serverless SQL Client
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL is not set in environment variables');
}

export const sql = neon(databaseUrl || '');

// Initialize table schema if not exists (quiz_attempts & users)
export async function initDb() {
  if (!databaseUrl) return;
  try {
    // 1. Table users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        xp INT DEFAULT 0,
        level INT DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Table quiz_attempts with username column
    await sql`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id VARCHAR(64) NOT NULL,
        username VARCHAR(50) DEFAULT 'Player',
        topic VARCHAR(100) NOT NULL,
        difficulty VARCHAR(20) NOT NULL,
        score INT NOT NULL,
        total_questions INT NOT NULL,
        time_spent_seconds INT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Alter table to add username if old table exists
    try {
      await sql`
        ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS username VARCHAR(50) DEFAULT 'Player';
      `;
    } catch {}

    console.log('Neon DB tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Neon DB tables:', error);
  }
}
