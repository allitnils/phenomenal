'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');

process.env.DB_PATH = ':memory:';

const { app } = require('../server/index');
const http = require('http');

let server;
let baseUrl;

before((done) => {
  server = http.createServer(app);
  server.listen(0, '127.0.0.1', () => {
    baseUrl = `http://127.0.0.1:${server.address().port}`;
    done();
  });
});

after((done) => {
  server.close(done);
});

async function req(method, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: response.status, body: json };
}

describe('Health', () => {
  it('GET /health returns ok', async () => {
    const { status, body } = await req('GET', '/health');
    assert.strictEqual(status, 200);
    assert.strictEqual(body.status, 'ok');
  });
});

describe('Transcripts API', () => {
  let transcriptId;

  it('GET /api/transcripts returns empty array initially', async () => {
    const { status, body } = await req('GET', '/api/transcripts');
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(body));
  });

  it('POST /api/transcripts creates a transcript', async () => {
    const { status, body } = await req('POST', '/api/transcripts', {
      title: 'Test Interview',
      content: 'This is interview content about liminal spaces and remote work.',
      participant: 'P01',
    });
    assert.strictEqual(status, 201);
    assert.ok(body.id);
    transcriptId = body.id;
  });

  it('GET /api/transcripts/:id returns transcript with segments', async () => {
    const { status, body } = await req('GET', `/api/transcripts/${transcriptId}`);
    assert.strictEqual(status, 200);
    assert.strictEqual(body.title, 'Test Interview');
    assert.ok(Array.isArray(body.segments));
  });

  it('POST /api/transcripts validates required fields', async () => {
    const { status } = await req('POST', '/api/transcripts', { title: 'No content' });
    assert.strictEqual(status, 400);
  });
});

describe('Codes API', () => {
  it('GET /api/codes returns empty array initially', async () => {
    const { status, body } = await req('GET', '/api/codes');
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(body));
  });

  it('POST /api/codes creates a code', async () => {
    const { status, body } = await req('POST', '/api/codes', {
      name: 'liminal-space',
      color: '#6366f1',
      category: 'place',
    });
    assert.strictEqual(status, 201);
    assert.ok(body.id);
  });

  it('POST /api/codes rejects duplicate names', async () => {
    const { status } = await req('POST', '/api/codes', { name: 'liminal-space' });
    assert.strictEqual(status, 409);
  });
});

describe('Cooccurrence Analysis', () => {
  it('GET /api/analysis/cooccurrence returns graph data', async () => {
    const { status, body } = await req('GET', '/api/analysis/cooccurrence');
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(body.nodes));
    assert.ok(Array.isArray(body.links));
  });
});
