# phenomenal

Self-hosted qualitative research platform for thematic coding, grounded theory analysis, and co-occurrence visualisation.

Built for researchers who want full control over their data — no cloud accounts, no usage limits, no external data transfer. Everything runs in your browser against a SQLite database on your own server.

**Live demo:** https://phenomenal.fly.dev

---

## What it does

| Feature | Description |
|---------|-------------|
| **Transcript management** | Store and organise interview transcripts, field notes, or any text corpus |
| **In-browser coding** | Select text with your mouse → code applied instantly, no button required |
| **Code library** | Create codes with names, categories, and colours; track usage counts |
| **Co-occurrence graph** | D3 force graph showing which codes appear together across transcripts |
| **Memos** | Analytical notes — essential for grounded theory and thematic analysis |
| **Export** | CSV, JSON, and NVivo-compatible tab-delimited formats |

---

## Quickstart (local)

**Requirements:** Node.js 20+

```bash
git clone https://github.com/allitnils/phenomenal.git
cd phenomenal
npm install
npm start
```

Open http://localhost:3000

To load sample data (two transcripts, five codes):

```bash
npm run seed
```

---

## How to use it

### 1 — Add a transcript

Go to **Transcripts → + Add Transcript**. Paste your interview text into the content field. Add participant label and interview date if you want them tracked. Save.

---

### 2 — Create codes

Go to **Coding**. In the right panel, click **+ Code**. Enter a name (e.g. `liminal-space`), an optional category (e.g. `place`), and pick a colour. Save.

---

### 3 — Code the text

1. Go to **Coding**
2. Select a transcript from the dropdown (top left)
3. **Click a code** in the right panel to activate it
4. **Click and drag** to select a passage of text in the transcript
5. Release — the segment is saved immediately

To remove a segment, click the **×** button next to it in the Coded Segments list.

You can apply multiple codes to the same passage by selecting the text again with a different code active.

---

### 4 — Explore the co-occurrence graph

Go to **Co-occurrence**. The graph shows:

- **Nodes** — each code; size = number of segments
- **Edges** — co-occurrence in the same transcript; thickness = frequency

Drag nodes to reposition them. Clusters of tightly connected codes often indicate a theme worth naming in a memo.

---

### 5 — Write memos

Go to **Memos → + New Memo**. Write at whatever length the insight demands. Memos capture your interpretive thinking, theoretical hunches, and questions to pursue.

---

### 6 — Export

Use the **Export** buttons in the sidebar:

| Format | Contents | Use for |
|--------|----------|---------|
| **CSV** | One row per coded segment — transcript, participant, code, category, text, offsets, date | Excel, R, SPSS |
| **JSON** | Complete data dump — all transcripts, codes, segments, memos | Backup, migration |
| **NVivo** | Tab-delimited: Name / Content / Code columns | Collaborators using NVivo |

Export JSON regularly as a backup.

---

## Architecture

```
phenomenal/
├── server/          Express + better-sqlite3 + WebSockets
│   ├── routes/      REST API: transcripts, codes, segments, memos
│   ├── analysis/    Co-occurrence matrix + export logic
│   └── db/          SQLite schema + migrations
└── public/          Pure HTML/CSS/JS — no build step
    ├── js/views/    One file per view (transcripts, coding, graph, memos, help)
    └── css/         Single stylesheet, dark academic theme
```

No bundler. No framework. The frontend is plain JavaScript loaded directly in the browser. D3 v7 is loaded from CDN for the force graph.

---

## Deployment on Fly.io (free)

```bash
curl -L https://fly.io/install.sh | sh
export PATH="$HOME/.fly/bin:$PATH"
flyctl auth login

flyctl apps create phenomenal --org personal
flyctl volumes create phenomenal_data --region syd --size 1 --app phenomenal --yes
flyctl deploy --remote-only --app phenomenal
```

The SQLite database is stored in `/data/phenomenal.db` on a persistent volume — it survives restarts and redeploys.

---

## Database schema

```sql
transcripts  (id, title, content, participant, interview_date, created_at, updated_at)
codes        (id, name, description, color, category, created_at)
segments     (id, transcript_id, code_id, start_offset, end_offset, text, memo, created_at)
memos        (id, title, content, transcript_id, code_id, created_at, updated_at)
```

---

## REST API

```
GET/POST   /api/transcripts
GET/PUT/DELETE /api/transcripts/:id

GET/POST   /api/codes
PUT/DELETE /api/codes/:id

GET/POST   /api/segments
DELETE     /api/segments/:id

GET/POST   /api/memos
PUT/DELETE /api/memos/:id

GET  /api/analysis/cooccurrence
GET  /api/export/csv
GET  /api/export/json
GET  /api/export/nvivo
```

---

## Methodological notes

phenomenal supports multiple qualitative methodologies:

**Grounded theory** — Start with no codes. Let categories emerge from open coding. Use the co-occurrence graph to identify axial connections. Write memos throughout.

**Thematic analysis** (Braun & Clarke) — Create a starter code list, apply codes across transcripts, use the graph to identify theme clusters.

**IPA** — Code one transcript at a time. Use memos to track interpretive moves.

---

## Contributing

```bash
DB_PATH=:memory: npm test
```

Issues and PRs welcome.
