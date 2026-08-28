import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Secret HMAC key for Altcha challenge verification
const ALTCHA_HMAC_KEY = process.env.ALTCHA_HMAC_KEY || 'lazenquiz_altcha_secret_key_2026';

export async function GET() {
  try {
    // Generate random secret number
    const salt = crypto.randomBytes(16).toString('hex');
    const secret = Math.floor(Math.random() * 50000) + 1; // Small proof of work range for instant verification
    const algorithm = 'SHA-256';

    // Hash the secret number with salt
    const challenge = crypto
      .createHash('sha256')
      .update(salt + secret)
      .digest('hex');

    // Create signature to prevent tampering
    const signature = crypto
      .createHmac('sha256', ALTCHA_HMAC_KEY)
      .update(challenge)
      .digest('hex');

    return NextResponse.json({
      algorithm,
      challenge,
      salt,
      signature,
      maxnumber: 100000,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to generate captcha' }, { status: 500 });
  }
}
