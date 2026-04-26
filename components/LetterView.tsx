'use client';

import { format, parse } from 'date-fns';

interface Letter {
  id: number;
  date: string;
  title: string | null;
  content: string;
}

export default function LetterView({ letter }: { letter: Letter }) {
  const formattedDate = format(
    parse(letter.date, 'MM/dd/yyyy', new Date()),
    'MMMM d, yyyy'
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-8 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Parchment paper effect */}
        <div className="bg-white shadow-xl rounded-lg p-12 border-l-4 border-rose-200">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 tracking-widest">
              {formattedDate}
            </div>
            {letter.title && (
              <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                {letter.title}
              </h1>
            )}
            <div className="w-12 h-1 bg-rose-300 mx-auto mt-4" />
          </div>

          {/* Letter content */}
          <div className="max-w-none text-lg leading-relaxed text-gray-700 whitespace-pre-wrap" style={{ fontFamily: 'var(--font-lora), serif' }}>
            {letter.content}
          </div>

          {/* Closing flourish */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-right text-gray-600 italic">
            ♥
          </div>
        </div>
      </div>
    </div>
  );
}
