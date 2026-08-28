// In-Memory Token Bucket / Sliding Window Rate Limiter
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipRateLimits: Map<string, RateLimitRecord> = new Map();

/**
 * Check if an IP has exceeded rate limit
 * @param ip Client IP Address
 * @param maxRequests Maximum allowed requests in the window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; limit: number; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = ipRateLimits.get(ip);

  // Clean old expired records periodically
  if (ipRateLimits.size > 5000) {
    for (const [key, val] of ipRateLimits.entries()) {
      if (now > val.resetTime) {
        ipRateLimits.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    ipRateLimits.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfter),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    retryAfterSeconds: 0,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
