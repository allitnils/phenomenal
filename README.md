# phenomenal

Self-hosted qualitative research platform for thematic coding, grounded theory analysis, and co-occurrence visualisation.

## Who it's for

Qualitative researchers, social scientists, and PhD candidates working with interview transcripts, focus groups, or ethnographic field notes. Designed for grounded theory, thematic analysis, and interpretive phenomenological analysis (IPA).

## Quickstart

```bash
git clone https://github.com/allitnils/phenomenal
cd phenomenal
npm install
npm start
# Open http://localhost:3000
```

Optionally seed sample data:

```bash
npm run seed
```

## Features

- **Transcript management** — import interview transcripts, tag by participant and date
- **In-browser text coding** — select text, assign a code; char-offset segmentation persists to SQLite
- **Code co-occurrence graph** — D3 force-directed graph; nodes sized by usage, edges weighted by co-occurrence frequency
- **Research memos** — capture theoretical insights linked to transcripts or codes
- **Export** — CSV (for R/SPSS), JSON (full project backup), NVivo-compatible tab-delimited

## Architecture

```
phenomenal/
├── server/          Node.js + Express REST API
│   ├── db/          better-sqlite3, schema, WAL mode
│   ├── routes/      transcripts, codes, segments, memos
│   ├── websocket/   live update channel (ws)
│   └── analysis/    co-occurrence matrix, export formatters
└── public/          Pure HTML/CSS/JS — no build step
    ├── index.html   Single-page shell
    └── js/
        ├── api.js   fetch wrapper
        └── views/   transcripts, coding, graph, memos
```

No bundler, no transpilation, no framework — just `node server/index.js` and open a browser.

## Coding workflow

1. Upload a transcript (paste or type interview text)
2. Go to **Coding** — select the transcript
3. Select a code from the right panel (or create one)
4. Highlight text in the transcript — it's coded instantly
5. View all segments per transcript in the right panel

## Co-occurrence graph

Navigate to **Co-occurrence** after coding at least two different codes in the same transcript. The force graph shows which codes appear together and how often. Drag nodes to explore the structure.

## Data model

| Table | Purpose |
|---|---|
| transcripts | Interview text, participant, date |
| codes | Named codes with colour and category |
| segments | Coded text spans (char offsets into transcript) |
| memos | Free-text theoretical notes |

SQLite database stored at `./phenomenal.db` by default. Override with `DB_PATH` env var. `:memory:` for ephemeral testing.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP server port |
| `DB_PATH` | `./phenomenal.db` | SQLite file path |

## Contributing

1. Fork and clone
2. `npm install`
3. `npm test` — all tests must pass
4. Submit a PR with a clear description of the change

## Licence

MIT
