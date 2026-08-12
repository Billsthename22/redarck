import { NextRequest, NextResponse } from 'next/server';

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  keyPrefix: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

const getClientIp = (req: NextRequest) => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  return req.headers.get('x-real-ip') || 'unknown';
};

export function rateLimit(req: NextRequest, options: RateLimitOptions) {
  const now = Date.now();
  const key = `${options.keyPrefix}:${getClientIp(req)}`;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return null;
  }

  existing.count += 1;

  if (existing.count <= options.limit) {
    return null;
  }

  const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);

  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
        'X-RateLimit-Limit': String(options.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(existing.resetAt / 1000)),
      },
    }
  );
}
