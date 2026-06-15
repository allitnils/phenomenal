'use strict';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS transcripts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  participant TEXT,
  interview_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  category TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS segments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transcript_id INTEGER NOT NULL,
  code_id INTEGER NOT NULL,
  start_offset INTEGER NOT NULL,
  end_offset INTEGER NOT NULL,
  text TEXT NOT NULL,
  memo TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (transcript_id) REFERENCES transcripts(id) ON DELETE CASCADE,
  FOREIGN KEY (code_id) REFERENCES codes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS memos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  transcript_id INTEGER,
  code_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (transcript_id) REFERENCES transcripts(id) ON DELETE SET NULL,
  FOREIGN KEY (code_id) REFERENCES codes(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_segments_transcript ON segments(transcript_id);
CREATE INDEX IF NOT EXISTS idx_segments_code ON segments(code_id);
CREATE INDEX IF NOT EXISTS idx_memos_transcript ON memos(transcript_id);
`;

module.exports = { SCHEMA };
