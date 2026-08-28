import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

// In-memory room storage for real-time 1v1 PvP matchmaking
interface PvPRoom {
  code: string;
  hostName: string;
  topic: string;
  questions: any[];
  players: { id: string; name: string; score: number; answeredCount: number; ready: boolean }[];
  status: 'waiting' | 'in_game' | 'finished';
  createdAt: number;
}

const pvpRooms: Record<string, PvPRoom> = {};

// Clean rooms older than 30 minutes
function cleanOldRooms() {
  const now = Date.now();
  for (const code in pvpRooms) {
    if (now - pvpRooms[code].createdAt > 30 * 60 * 1000) {
      delete pvpRooms[code];
    }
  }
}

export async function POST(req: Request) {
  try {
    cleanOldRooms();
    const body = await req.json();
    const { action, roomCode, playerName, topic = 'Umum', questions = [] } = body;

    // 1. CREATE ROOM
    if (action === 'create') {
      const code = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newRoom: PvPRoom = {
        code,
        hostName: playerName || 'Player 1',
        topic,
        questions,
        players: [
          {
            id: `p_${Date.now()}_1`,
            name: playerName || 'Player 1',
            score: 0,
            answeredCount: 0,
            ready: true,
          },
        ],
        status: 'waiting',
        createdAt: Date.now(),
      };
      pvpRooms[code] = newRoom;
      return NextResponse.json({ success: true, room: newRoom });
    }

    // 2. JOIN ROOM
    if (action === 'join') {
      const upperCode = (roomCode || '').toUpperCase().trim();
      const room = pvpRooms[upperCode];
      if (!room) {
        return NextResponse.json({ success: false, error: 'Room code tidak ditemukan atau sudah kadaluarsa.' }, { status: 404 });
      }

      if (room.players.length >= 2) {
        return NextResponse.json({ success: false, error: 'Room ini sudah penuh (Maksimal 2 pemain).' }, { status: 400 });
      }

      const newPlayer = {
        id: `p_${Date.now()}_2`,
        name: playerName || 'Player 2',
        score: 0,
        answeredCount: 0,
        ready: true,
      };
      room.players.push(newPlayer);
      room.status = 'in_game';

      return NextResponse.json({ success: true, room });
    }

    // 3. GET STATUS / UPDATE SCORE
    if (action === 'update_score' || action === 'poll') {
      const upperCode = (roomCode || '').toUpperCase().trim();
      const room = pvpRooms[upperCode];
      if (!room) {
        return NextResponse.json({ success: false, error: 'Room tidak ditemukan.' }, { status: 404 });
      }

      if (action === 'update_score') {
        const { playerId, score, answeredCount } = body;
        const p = room.players.find((pl) => pl.id === playerId || pl.name === playerName);
        if (p) {
          p.score = score;
          p.answeredCount = answeredCount;
        }
        if (room.players.every((pl) => pl.answeredCount >= room.questions.length)) {
          room.status = 'finished';
        }
      }

      return NextResponse.json({ success: true, room });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('PvP Room Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
