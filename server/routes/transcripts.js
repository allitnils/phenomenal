'use strict';

const { Router } = require('express');
const { getDb } = require('../db/migrations');

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT id, title, participant, interview_date, created_at FROM transcripts ORDER BY created_at DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM transcripts WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const segments = db.prepare(`
    SELECT s.*, c.name as code_name, c.color as code_color
    FROM segments s JOIN codes c ON s.code_id = c.id
    WHERE s.transcript_id = ?
    ORDER BY s.start_offset
  `).all(req.params.id);
  res.json({ ...row, segments });
});

router.post('/', (req, res) => {
  const { title, content, participant, interview_date } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title and content are required' });
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO transcripts (title, content, participant, interview_date) VALUES (?, ?, ?, ?)'
  ).run(title, content, participant || null, interview_date || null);
  res.status(201).json({ id: result.lastInsertRowid, title });
});

router.put('/:id', (req, res) => {
  const { title, content, participant, interview_date } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM transcripts WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare(
    "UPDATE transcripts SET title = ?, content = ?, participant = ?, interview_date = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(title, content, participant || null, interview_date || null, req.params.id);
  res.json({ id: Number(req.params.id), title });
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM transcripts WHERE id = ?').run(req.params.id);
  res.json({ deleted: Number(req.params.id) });
});

module.exports = router;
