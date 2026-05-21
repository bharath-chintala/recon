import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface RateLimitRecord {
  countMin: number;
  countHour: number;
  firstMinStart: number;
  firstHourStart: number;
}

const ipMap = new Map<string, RateLimitRecord>();

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || (request as any).ip || 'unknown';
  const path = request.nextUrl.pathname;

  // Exclude static assets and health checks from rate limiting
  if (ip !== 'unknown' && !path.startsWith('/_next') && !path.startsWith('/api/health') && !path.match(/\.(png|jpe?g|gif|svg|webp|ico)$/)) {
    const now = Date.now();
    const limitWindowMin = 60 * 1000;
    const limitWindowHour = 60 * 60 * 1000;
    
    let record = ipMap.get(ip);
    if (!record) {
      record = { countMin: 0, countHour: 0, firstMinStart: now, firstHourStart: now };
    }
    
    if (now - record.firstMinStart > limitWindowMin) {
      record.countMin = 0;
      record.firstMinStart = now;
    }
    
    if (now - record.firstHourStart > limitWindowHour) {
      record.countHour = 0;
      record.firstHourStart = now;
    }
    
    record.countMin++;
    record.countHour++;
    
    if (record.countMin > 60 || record.countHour > 1000) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
    
    ipMap.set(ip, record);
  }

  const session = request.cookies.get('admin_session')?.value
  
  // Protect /dashboard
  if (path.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // If logged in, redirect away from /login
  if (path === '/login') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
