'use client';

import { useEffect, useState } from 'react';
import HamburgerMenu from '@/components/HamburgerMenu';
import LetterView from '@/components/LetterView';

interface Letter {
  id: number;
  date: string;
  title: string | null;
  content: string;
  created_at: string;
}

export default function ReaderPage() {
  const [currentLetterId, setCurrentLetterId] = useState<number | null>(null);
  const [currentLetter, setCurrentLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLetters = async () => {
      try {
        const res = await fetch('/api/letters');
        const letters = await res.json();
        if (letters.length > 0) {
          setCurrentLetterId(letters[0].id);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to load letters:', error);
        setLoading(false);
      }
    };
    loadLetters();
  }, []);

  useEffect(() => {
    if (currentLetterId === null) return;

    const loadLetter = async () => {
      try {
        const res = await fetch(`/api/letters/${currentLetterId}`);
        if (res.ok) {
          const letter = await res.json();
          setCurrentLetter(letter);
        }
      } catch (error) {
        console.error('Failed to load letter:', error);
      }
    };
    loadLetter();
  }, [currentLetterId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <HamburgerMenu
        onSelectLetter={setCurrentLetterId}
        currentLetterId={currentLetterId}
      />

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      ) : currentLetter ? (
        <LetterView letter={currentLetter} />
      ) : (
        <div className="min-h-screen flex items-center justify-center text-center">
          <div>
            <p className="text-gray-500 text-xl mb-2">No love letters yet...</p>
            <p className="text-gray-400">Check back soon ♥</p>
          </div>
        </div>
      )}
    </div>
  );
}
