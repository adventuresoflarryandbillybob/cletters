'use client';

import { useEffect, useState } from 'react';
import { format, parse } from 'date-fns';

interface Letter {
  id: number;
  date: string;
  title: string | null;
}

export default function HamburgerMenu({
  onSelectLetter,
  currentLetterId,
}: {
  onSelectLetter: (id: number) => void;
  currentLetterId: number | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [letters, setLetters] = useState<Letter[]>([]);

  useEffect(() => {
    const fetchLetters = async () => {
      const res = await fetch('/api/letters');
      const data = await res.json();
      setLetters(data);
    };
    fetchLetters();
  }, []);

  const handleSelectLetter = (id: number) => {
    onSelectLetter(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 p-2 text-gray-700 hover:text-gray-900"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-16">
          <h2 className="text-xl font-bold mb-6 text-gray-800" style={{ fontFamily: 'var(--font-playfair), serif' }}>
            Love Letters
          </h2>
          <div className="space-y-2">
            {letters.length === 0 ? (
              <p className="text-gray-500 text-sm">No letters yet</p>
            ) : (
              letters.map((letter) => (
                <button
                  key={letter.id}
                  onClick={() => handleSelectLetter(letter.id)}
                  className={`w-full text-left p-3 rounded transition-colors ${
                    currentLetterId === letter.id
                      ? 'bg-rose-100 text-rose-900'
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="font-semibold text-sm">
                    {format(parse(letter.date, 'MM/dd/yyyy', new Date()), 'MMM d, yyyy')}
                  </div>
                  {letter.title && (
                    <div className="text-xs text-gray-600 mt-1">
                      {letter.title}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
