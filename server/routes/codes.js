'use strict';

const { Router } = require('express');
const { getDb } = require('../db/migrations');

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT c.*, COUNT(s.id) as usage_count
    FROM codes c LEFT JOIN segments s ON s.code_id = c.id
    GROUP BY c.id ORDER BY c.name
  `).all();
  res.json(rows);
});

router.post('/', (req, res) => {
  const { name, description, color, category } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const db = getDb();
  try {
    const result = db.prepare(
      'INSERT INTO codes (name, description, color, category) VALUES (?, ?, ?, ?)'
    ).run(name, description || null, color || '#6366f1', category || null);
    res.status(201).json({ id: result.lastInsertRowid, name });
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Code name already exists' });
    throw e;
  }
});

router.put('/:id', (req, res) => {
  const { name, description, color, category } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM codes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare(
    'UPDATE codes SET name = ?, description = ?, color = ?, category = ? WHERE id = ?'
  ).run(name, description || null, color || '#6366f1', category || null, req.params.id);
  res.json({ id: Number(req.params.id), name });
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM codes WHERE id = ?').run(req.params.id);
  res.json({ deleted: Number(req.params.id) });
});

module.exports = router;
