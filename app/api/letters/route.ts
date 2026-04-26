import { NextRequest, NextResponse } from 'next/server';
import { getAllLetters, createLetter } from '@/lib/db';
import { decryptSession } from '@/lib/session';
import { sendLoveLetterNotification } from '@/lib/email';

// GET: List all letters (public)
export async function GET() {
  try {
    const letters = getAllLetters();
    return NextResponse.json(letters);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch letters' },
      { status: 500 }
    );
  }
}

// POST: Create new letter (requires auth)
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = await decryptSession(sessionCookie);
    if (!session?.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { date, title, content } = await request.json();

    if (!date || !content) {
      return NextResponse.json(
        { error: 'Date and content are required' },
        { status: 400 }
      );
    }

    // Validate date format MM/DD/YYYY
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use MM/DD/YYYY' },
        { status: 400 }
      );
    }

    const letter = createLetter({ date, title, content });

    // Send email notification asynchronously (don't wait for it)
    sendLoveLetterNotification(title || 'Untitled Letter');

    return NextResponse.json(letter, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create letter' },
      { status: 500 }
    );
  }
}
