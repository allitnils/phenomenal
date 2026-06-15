'use strict';

const { Router } = require('express');
const { getDb } = require('../db/migrations');

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const { transcript_id, code_id } = req.query;
  let query = `
    SELECT s.*, c.name as code_name, c.color as code_color, t.title as transcript_title
    FROM segments s
    JOIN codes c ON s.code_id = c.id
    JOIN transcripts t ON s.transcript_id = t.id
    WHERE 1=1
  `;
  const params = [];
  if (transcript_id) { query += ' AND s.transcript_id = ?'; params.push(transcript_id); }
  if (code_id) { query += ' AND s.code_id = ?'; params.push(code_id); }
  query += ' ORDER BY s.created_at DESC';
  res.json(db.prepare(query).all(...params));
});

router.post('/', (req, res) => {
  const { transcript_id, code_id, start_offset, end_offset, text, memo } = req.body;
  if (!transcript_id || !code_id || start_offset == null || end_offset == null || !text) {
    return res.status(400).json({ error: 'transcript_id, code_id, start_offset, end_offset, text are required' });
  }
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO segments (transcript_id, code_id, start_offset, end_offset, text, memo) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(transcript_id, code_id, start_offset, end_offset, text, memo || null);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM segments WHERE id = ?').run(req.params.id);
  res.json({ deleted: Number(req.params.id) });
});

module.exports = router;
