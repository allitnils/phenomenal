'use strict';

const { getDb, closeDb } = require('../server/db/migrations');

const db = getDb();

const transcripts = db.prepare(
  'INSERT INTO transcripts (title, content, participant, interview_date) VALUES (?, ?, ?, ?)'
);

const codes = db.prepare(
  'INSERT OR IGNORE INTO codes (name, description, color, category) VALUES (?, ?, ?, ?)'
);

const seedData = db.transaction(() => {
  const t1 = transcripts.run(
    'Interview with P01 — Remote Work Rituals',
    `P01: When I first started working from home full-time, I struggled to find my footing. The commute, oddly enough, was a transition ritual that I didn't know I needed.\n\nI: Can you tell me more about that?\n\nP01: The walk to the station, the train ride — it was a liminal space between home and work. Without it, I felt like I was always partially in both worlds, never fully in either.`,
    'P01',
    '2024-03-15'
  );

  const t2 = transcripts.run(
    'Interview with P02 — Technostress and Boundaries',
    `P02: The notifications never stop. Teams, Slack, email — it's relentless. I've started leaving my phone in another room during dinner just to feel like I'm actually home.\n\nI: Does that help?\n\nP02: Sometimes. But there's always this background anxiety, like I'm missing something. The technology is supposed to help but it ends up colonising your attention.`,
    'P02',
    '2024-03-22'
  );

  codes.run('liminal-space', 'Physical or temporal threshold between states', '#6366f1', 'place');
  codes.run('ritual', 'Repeated practices that mark transitions or states', '#8b5cf6', 'practice');
  codes.run('technostress', 'Stress arising from technology use', '#ef4444', 'wellbeing');
  codes.run('boundary-work', 'Practices to maintain work-life separation', '#22c55e', 'practice');
  codes.run('presence', 'Subjective sense of being fully present', '#3b82f6', 'experience');

  console.log(`Seeded transcripts: ${t1.lastInsertRowid}, ${t2.lastInsertRowid}`);
  console.log('Seeded 5 codes');
});

seedData();
closeDb();
console.log('Seed complete. Run: npm start');
