'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLetterForm from '@/components/AdminLetterForm';
import { format, parse } from 'date-fns';

interface Letter {
  id: number;
  date: string;
  title: string | null;
  content: string;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth-check', { credentials: 'include' });
        const data = await res.json();
        setAuthenticated(data.authenticated);
        if (data.authenticated) {
          loadLetters();
        }
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoadingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const loadLetters = async () => {
    try {
      const res = await fetch('/api/letters');
      const data = await res.json();
      setLetters(data);
    } catch (error) {
      console.error('Failed to load letters:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Invalid password');
      }

      setPassword('');
      setAuthenticated(true);
      await loadLetters();
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : 'Login failed'
      );
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setAuthenticated(false);
  };

  const handleDeleteLetter = async (id: number) => {
    if (!window.confirm('Delete this letter?')) return;

    try {
      const res = await fetch(`/api/letters/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete');
      await loadLetters();
    } catch (error) {
      console.error('Failed to delete letter:', error);
      alert('Failed to delete letter');
    }
  };


  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-white">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-white px-4">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              Admin Panel
            </h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  autoFocus
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-2 bg-rose-500 text-white rounded-md font-medium hover:bg-rose-600"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 pt-6">
          <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-playfair), serif' }}>
            Love Letters Admin
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <AdminLetterForm onSuccess={loadLetters} />
          </div>

          {/* Letters List */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Existing Letters
            </h2>
            <div className="space-y-3">
              {letters.length === 0 ? (
                <p className="text-gray-500">No letters yet. Create one!</p>
              ) : (
                letters.map((letter) => (
                  <div
                    key={letter.id}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {format(
                            parse(letter.date, 'MM/dd/yyyy', new Date()),
                            'MMM d, yyyy'
                          )}
                        </div>
                        {letter.title && (
                          <div className="text-sm text-gray-600 mt-1">
                            {letter.title}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {letter.content.substring(0, 100)}...
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLetter(letter.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
