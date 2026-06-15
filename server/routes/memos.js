'use strict';

const { Router } = require('express');
const { getDb } = require('../db/migrations');

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM memos ORDER BY updated_at DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM memos WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

router.post('/', (req, res) => {
  const { title, content, transcript_id, code_id } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title and content are required' });
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO memos (title, content, transcript_id, code_id) VALUES (?, ?, ?, ?)'
  ).run(title, content, transcript_id || null, code_id || null);
  res.status(201).json({ id: result.lastInsertRowid, title });
});

router.put('/:id', (req, res) => {
  const { title, content } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM memos WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare(
    "UPDATE memos SET title = ?, content = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(title, content, req.params.id);
  res.json({ id: Number(req.params.id), title });
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM memos WHERE id = ?').run(req.params.id);
  res.json({ deleted: Number(req.params.id) });
});

module.exports = router;
