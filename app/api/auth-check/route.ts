import { NextRequest, NextResponse } from 'next/server';
import { decryptSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false });
  }

  const session = await decryptSession(sessionCookie);
  return NextResponse.json({
    authenticated: session?.authenticated ?? false,
  });
}
