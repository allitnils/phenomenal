'use strict';

function setupWebSocket(wss) {
  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'connected', message: 'phenomenal WebSocket ready' }));

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', ts: Date.now() }));
        }
      } catch {
        // ignore malformed messages
      }
    });
  });
}

module.exports = { setupWebSocket };
