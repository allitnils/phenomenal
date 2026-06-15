document.addEventListener('DOMContentLoaded', () => {
  const views = {
    transcripts: renderTranscripts,
    coding: renderCoding,
    graph: renderGraph,
    memos: renderMemos,
    help: renderHelp,
  };

  initSidebar((view) => {
    document.getElementById('topbar-title').textContent = view;
    const fn = views[view];
    if (fn) fn();
  });

  document.querySelector('[data-view="transcripts"]').click();

  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${location.host}`);
  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.type === 'connected') console.log('WebSocket connected');
    } catch (_) {}
  };

  document.getElementById('export-csv').addEventListener('click', () => {
    window.location.href = '/api/export/csv';
  });
  document.getElementById('export-json').addEventListener('click', () => {
    window.location.href = '/api/export/json';
  });
  document.getElementById('export-nvivo').addEventListener('click', () => {
    window.location.href = '/api/export/nvivo';
  });
});
