import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'letters.db');

let dbInstance: Database.Database | null = null;

function getDb() {
  if (!dbInstance) {
    dbInstance = new Database(dbPath);
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('synchronous = NORMAL');
    initSchema();
  }
  return dbInstance;
}

function initSchema() {
  const database = getDb();
  database.exec(`
    CREATE TABLE IF NOT EXISTS letters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      title TEXT,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_letters_date ON letters(date);
  `);
}

export interface Letter {
  id: number;
  date: string;
  title: string | null;
  content: string;
  created_at: string;
}

export function getAllLetters(): Letter[] {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT id, date, title, content, created_at FROM letters
    ORDER BY date DESC
  `);
  return stmt.all() as Letter[];
}

export function getLetterById(id: number): Letter | null {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT id, date, title, content, created_at FROM letters WHERE id = ?
  `);
  return (stmt.get(id) as Letter | undefined) || null;
}

export function createLetter(data: {
  date: string;
  title?: string;
  content: string;
}): Letter {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO letters (date, title, content)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(data.date, data.title || null, data.content);
  return getLetterById(Number(result.lastInsertRowid))!;
}

export function updateLetter(
  id: number,
  data: { date?: string; title?: string; content?: string }
): Letter {
  const database = getDb();
  const current = getLetterById(id);
  if (!current) throw new Error('Letter not found');

  const stmt = database.prepare(`
    UPDATE letters
    SET date = ?, title = ?, content = ?
    WHERE id = ?
  `);
  const result = stmt.run(
    data.date ?? current.date,
    data.title ?? current.title,
    data.content ?? current.content,
    id
  );

  if (result.changes === 0) {
    throw new Error('Failed to update letter');
  }

  return getLetterById(id)!;
}

export function deleteLetter(id: number): void {
  const database = getDb();
  const stmt = database.prepare('DELETE FROM letters WHERE id = ?');
  const result = stmt.run(id);

  if (result.changes === 0) {
    throw new Error('Letter not found or already deleted');
  }
}
