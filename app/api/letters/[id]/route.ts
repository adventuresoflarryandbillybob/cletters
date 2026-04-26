import { NextRequest, NextResponse } from 'next/server';
import { getLetterById, updateLetter, deleteLetter } from '@/lib/db';
import { decryptSession } from '@/lib/session';

// GET: Get specific letter (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const letter = getLetterById(Number(id));
    if (!letter) {
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(letter);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch letter' },
      { status: 500 }
    );
  }
}

// PUT: Update letter (requires auth)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    if (date) {
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
      if (!dateRegex.test(date)) {
        return NextResponse.json(
          { error: 'Invalid date format. Use MM/DD/YYYY' },
          { status: 400 }
        );
      }
    }

    const letter = updateLetter(Number(id), { date, title, content });
    return NextResponse.json(letter);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update letter' },
      { status: 500 }
    );
  }
}

// DELETE: Delete letter (requires auth)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    deleteLetter(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete letter' },
      { status: 500 }
    );
  }
}
