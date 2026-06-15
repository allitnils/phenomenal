'use strict';

const { getDb } = require('../db/migrations');

function exportCSV() {
  const db = getDb();
  const rows = db.prepare(`
    SELECT s.id, t.title as transcript, t.participant, c.name as code, c.category,
           s.text, s.start_offset, s.end_offset, s.memo, s.created_at
    FROM segments s
    JOIN transcripts t ON s.transcript_id = t.id
    JOIN codes c ON s.code_id = c.id
    ORDER BY t.title, s.start_offset
  `).all();

  const header = 'id,transcript,participant,code,category,text,start_offset,end_offset,memo,created_at\n';
  const body = rows.map(r =>
    [r.id, r.transcript, r.participant || '', r.code, r.category || '',
     JSON.stringify(r.text), r.start_offset, r.end_offset,
     JSON.stringify(r.memo || ''), r.created_at].join(',')
  ).join('\n');

  return header + body;
}

function exportNVivo() {
  const db = getDb();
  const rows = db.prepare(`
    SELECT t.title as Name, s.text as Content, c.name as Code
    FROM segments s
    JOIN transcripts t ON s.transcript_id = t.id
    JOIN codes c ON s.code_id = c.id
  `).all();

  const header = 'Name\tContent\tCode\n';
  const body = rows.map(r => `${r.Name}\t${r.Content}\t${r.Code}`).join('\n');
  return header + body;
}

function exportJSON() {
  const db = getDb();
  const transcripts = db.prepare('SELECT * FROM transcripts').all();
  const codes = db.prepare('SELECT * FROM codes').all();
  const segments = db.prepare('SELECT * FROM segments').all();
  const memos = db.prepare('SELECT * FROM memos').all();
  return JSON.stringify({ transcripts, codes, segments, memos }, null, 2);
}

module.exports = { exportCSV, exportNVivo, exportJSON };
