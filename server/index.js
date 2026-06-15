'use strict';

const http = require('http');
const path = require('path');
const express = require('express');
const { WebSocketServer } = require('ws');

const transcriptsRouter = require('./routes/transcripts');
const codesRouter = require('./routes/codes');
const segmentsRouter = require('./routes/segments');
const memosRouter = require('./routes/memos');
const { setupWebSocket } = require('./websocket/handler');
const { computeCooccurrence } = require('./analysis/cooccurrence');
const { exportCSV, exportNVivo, exportJSON } = require('./analysis/export');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/transcripts', transcriptsRouter);
app.use('/api/codes', codesRouter);
app.use('/api/segments', segmentsRouter);
app.use('/api/memos', memosRouter);

app.get('/api/analysis/cooccurrence', (req, res) => {
  res.json(computeCooccurrence());
});

app.get('/api/export/csv', (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="phenomenal-export.csv"');
  res.send(exportCSV());
});

app.get('/api/export/nvivo', (req, res) => {
  res.setHeader('Content-Type', 'text/tab-separated-values');
  res.setHeader('Content-Disposition', 'attachment; filename="phenomenal-nvivo.txt"');
  res.send(exportNVivo());
});

app.get('/api/export/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="phenomenal-export.json"');
  res.send(exportJSON());
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
setupWebSocket(wss);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`phenomenal running at http://localhost:${PORT}`);
  });
}

module.exports = { app, server };
