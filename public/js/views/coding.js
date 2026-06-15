let _codes = [];
let _transcript = null;
let _segments = [];
let _selectedCodeId = null;

async function renderCoding() {
  document.getElementById('topbar-title').textContent = 'Coding';
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="grid-2" style="gap:20px;height:calc(100vh - 120px)">
      <div style="display:flex;flex-direction:column;gap:16px;overflow-y:auto">
        <div>
          <label style="font-size:12px;color:var(--muted);margin-bottom:6px;display:block">Select Transcript</label>
          <select id="transcript-select" onchange="loadCodingTranscript(this.value)">
            <option value="">Choose a transcript...</option>
          </select>
        </div>
        <div id="coding-text" class="coding-area">Select a transcript to begin coding.</div>
      </div>
      <div style="overflow-y:auto">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <span style="font-size:13px;font-weight:600">Codes</span>
          <button class="btn btn-primary" style="padding:5px 10px;font-size:12px" onclick="showAddCode()">+ Code</button>
        </div>
        <div id="code-list">Loading...</div>
        <div id="add-code-form" style="display:none;margin-top:12px" class="card">
          <div class="form-group"><label>Code Name *</label><input type="text" id="new-code-name" placeholder="e.g. liminal-space"></div>
          <div class="form-group"><label>Category</label><input type="text" id="new-code-cat" placeholder="e.g. place"></div>
          <div class="form-group"><label>Colour</label><input type="text" id="new-code-color" value="#6366f1"></div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" onclick="saveCode()">Save</button>
            <button class="btn btn-ghost" onclick="document.getElementById('add-code-form').style.display='none'">Cancel</button>
          </div>
        </div>
        <div style="margin-top:20px">
          <div style="font-size:13px;font-weight:600;margin-bottom:8px">Coded Segments</div>
          <div id="segments-panel">Select a transcript to see segments.</div>
        </div>
      </div>
    </div>
  `;

  await Promise.all([loadCodesForCoding(), loadTranscriptsForCoding()]);

  if (window._currentTranscript) {
    document.getElementById('transcript-select').value = window._currentTranscript;
    await loadCodingTranscript(window._currentTranscript);
    window._currentTranscript = null;
  }
}

async function loadTranscriptsForCoding() {
  const sel = document.getElementById('transcript-select');
  if (!sel) return;
  const transcripts = await API.get('/transcripts');
  transcripts.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.title;
    sel.appendChild(opt);
  });
}

async function loadCodesForCoding() {
  const list = document.getElementById('code-list');
  if (!list) return;
  _codes = await API.get('/codes');
  list.innerHTML = _codes.map(c => `
    <div class="card" style="padding:10px 14px;margin-bottom:6px;cursor:pointer;border-left:3px solid ${c.color}" onclick="selectCode(${c.id})">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:500">${escHtml(c.name)}</span>
        <span style="font-size:11px;color:var(--muted)">${c.usage_count} segs</span>
      </div>
      ${c.category ? `<div style="font-size:11px;color:var(--muted)">${escHtml(c.category)}</div>` : ''}
    </div>
  `).join('') || '<p style="color:var(--muted);font-size:13px">No codes yet.</p>';
}

function selectCode(id) {
  _selectedCodeId = id;
  document.querySelectorAll('#code-list .card').forEach(el => el.style.opacity = '0.5');
  const allCards = document.querySelectorAll('#code-list .card');
  const idx = _codes.findIndex(c => c.id === id);
  if (allCards[idx]) allCards[idx].style.opacity = '1';
  showToast(`Code selected: ${_codes.find(c => c.id === id)?.name}`);
}

async function loadCodingTranscript(id) {
  if (!id) return;
  _transcript = await API.get('/transcripts/' + id);
  _segments = _transcript.segments || [];
  renderTranscriptText();
  renderSegmentsPanel();
}

function renderTranscriptText() {
  const el = document.getElementById('coding-text');
  if (!el || !_transcript) return;
  el.textContent = _transcript.content;
  el.addEventListener('mouseup', handleTextSelection);
}

function handleTextSelection() {
  if (!_selectedCodeId || !_transcript) return;
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return;
  const text = sel.toString().trim();
  if (!text) return;

  const range = sel.getRangeAt(0);
  const el = document.getElementById('coding-text');
  const preRange = document.createRange();
  preRange.setStart(el, 0);
  preRange.setEnd(range.startContainer, range.startOffset);
  const start = preRange.toString().length;
  const end = start + text.length;

  sel.removeAllRanges();
  applySegment({ start_offset: start, end_offset: end, text });
}

async function applySegment({ start_offset, end_offset, text }) {
  try {
    await API.post('/segments', {
      transcript_id: _transcript.id,
      code_id: _selectedCodeId,
      start_offset, end_offset, text,
    });
    showToast('Segment coded');
    await loadCodingTranscript(_transcript.id);
  } catch (e) {
    showToast(e.message, 'error');
  }
}

function renderSegmentsPanel() {
  const el = document.getElementById('segments-panel');
  if (!el) return;
  if (_segments.length === 0) {
    el.innerHTML = '<p style="color:var(--muted);font-size:13px">No coded segments yet. Select text to code.</p>';
    return;
  }
  el.innerHTML = _segments.map(s => `
    <div class="card" style="padding:10px 14px;margin-bottom:6px;border-left:3px solid ${s.code_color}">
      <div style="display:flex;justify-content:space-between">
        <span class="badge" style="background:${s.code_color}">${escHtml(s.code_name)}</span>
        <button class="btn btn-danger" style="padding:2px 8px;font-size:11px" onclick="deleteSegment(${s.id})">×</button>
      </div>
      <div style="margin-top:6px;font-size:13px;color:var(--muted)">"${escHtml(s.text.substring(0, 80))}${s.text.length > 80 ? '…' : ''}"</div>
    </div>
  `).join('');
}

async function deleteSegment(id) {
  try {
    await API.del('/segments/' + id);
    showToast('Segment removed');
    await loadCodingTranscript(_transcript.id);
  } catch (e) {
    showToast(e.message, 'error');
  }
}

function showAddCode() {
  document.getElementById('add-code-form').style.display = 'block';
}

async function saveCode() {
  const name = document.getElementById('new-code-name').value.trim();
  if (!name) return showToast('Name required', 'error');
  try {
    await API.post('/codes', {
      name,
      category: document.getElementById('new-code-cat').value.trim() || null,
      color: document.getElementById('new-code-color').value || '#6366f1',
    });
    showToast('Code created');
    document.getElementById('add-code-form').style.display = 'none';
    await loadCodesForCoding();
  } catch (e) {
    showToast(e.message, 'error');
  }
}
