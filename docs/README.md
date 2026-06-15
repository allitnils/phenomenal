# phenomenal — Developer Documentation

## API Reference

All endpoints return JSON. Base path: `/api`.

### Transcripts

| Method | Path | Description |
|---|---|---|
| GET | `/transcripts` | List all transcripts |
| GET | `/transcripts/:id` | Get transcript with coded segments |
| POST | `/transcripts` | Create transcript |
| PUT | `/transcripts/:id` | Update transcript |
| DELETE | `/transcripts/:id` | Delete transcript and segments |

### Codes

| Method | Path | Description |
|---|---|---|
| GET | `/codes` | List codes with usage counts |
| POST | `/codes` | Create code |
| PUT | `/codes/:id` | Update code |
| DELETE | `/codes/:id` | Delete code |

### Segments

| Method | Path | Description |
|---|---|---|
| GET | `/segments?transcript_id=&code_id=` | List segments, optionally filtered |
| POST | `/segments` | Create segment |
| DELETE | `/segments/:id` | Remove segment |

### Memos

| Method | Path | Description |
|---|---|---|
| GET | `/memos` | List all memos |
| GET | `/memos/:id` | Get memo |
| POST | `/memos` | Create memo |
| PUT | `/memos/:id` | Update memo |
| DELETE | `/memos/:id` | Delete memo |

### Analysis

| Method | Path | Description |
|---|---|---|
| GET | `/analysis/cooccurrence` | D3-ready nodes and links |

### Export

| Method | Path | Description |
|---|---|---|
| GET | `/export/csv` | Segments as CSV |
| GET | `/export/json` | Full project as JSON |
| GET | `/export/nvivo` | NVivo tab-delimited |
