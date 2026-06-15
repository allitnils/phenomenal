'use strict';

const { getDb } = require('../db/migrations');

function computeCooccurrence() {
  const db = getDb();

  const codes = db.prepare('SELECT id, name, color FROM codes').all();
  const segments = db.prepare('SELECT transcript_id, code_id FROM segments').all();

  const byTranscript = {};
  for (const seg of segments) {
    if (!byTranscript[seg.transcript_id]) byTranscript[seg.transcript_id] = new Set();
    byTranscript[seg.transcript_id].add(seg.code_id);
  }

  const matrix = {};
  for (const codesets of Object.values(byTranscript)) {
    const arr = [...codesets];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const key = [arr[i], arr[j]].sort().join('-');
        matrix[key] = (matrix[key] || 0) + 1;
      }
    }
  }

  const codeMap = Object.fromEntries(codes.map(c => [c.id, c]));
  const nodes = codes.map(c => ({
    id: c.id,
    name: c.name,
    color: c.color,
    count: segments.filter(s => s.code_id === c.id).length,
  }));

  const links = Object.entries(matrix).map(([key, weight]) => {
    const [source, target] = key.split('-').map(Number);
    return { source, target, weight };
  });

  return {
    nodes,
    links,
    matrix: Object.fromEntries(
      Object.entries(matrix).map(([k, v]) => {
        const [a, b] = k.split('-').map(Number);
        return [k, { sourceCode: codeMap[a]?.name, targetCode: codeMap[b]?.name, weight: v }];
      })
    ),
  };
}

module.exports = { computeCooccurrence };
