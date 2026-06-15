async function renderTranscripts() {
  document.getElementById('topbar-title').textContent = 'Transcripts';
  const content = document.getElementById('content');
  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <h2 style="font-size:18px;font-weight:700">Interview Transcripts</h2>
      <button class="btn btn-primary" onclick="showAddTranscript()">+ Add Transcript</button>
    </div>
    <div id="transcript-list">Loading...</div>
  `;
  await loadTranscriptList();
}

async function loadTranscriptList() {
  const list = document.getElementById('transcript-list');
  if (!list) return;
  try {
    const transcripts = await API.get('/transcripts');
    if (transcripts.length === 0) {
      list.innerHTML = '<p style="color:var(--muted)">No transcripts yet. Add your first interview.</p>';
      return;
    }
    list.innerHTML = transcripts.map(t => `
      <div class="card" style="cursor:pointer" onclick="openTranscript(${t.id})">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <div class="card-title">${escHtml(t.title)}</div>
            <div class="card-meta">${t.participant ? escHtml(t.participant) + ' · ' : ''}${t.interview_date || ''} · ${new Date(t.created_at).toLocaleDateString()}</div>
          </div>
          <button class="btn btn-danger" onclick="event.stopPropagation();deleteTranscript(${t.id})">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (e) {
    list.innerHTML = `<p style="color:var(--red)">${e.message}</p>`;
  }
}

function showAddTranscript() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">New Transcript</h2>
    <div class="form-group"><label>Title *</label><input type="text" id="t-title" placeholder="Interview with P01"></div>
    <div class="grid-2">
      <div class="form-group"><label>Participant</label><input type="text" id="t-participant" placeholder="P01"></div>
      <div class="form-group"><label>Interview Date</label><input type="date" id="t-date"></div>
    </div>
    <div class="form-group"><label>Transcript Content *</label><textarea id="t-content" style="min-height:300px" placeholder="Paste interview transcript here..."></textarea></div>
    <div style="display:flex;gap:12px">
      <button class="btn btn-primary" onclick="saveTranscript()">Save Transcript</button>
      <button class="btn btn-ghost" onclick="renderTranscripts()">Cancel</button>
    </div>
  `;
}

async function saveTranscript() {
  const title = document.getElementById('t-title').value.trim();
  const content = document.getElementById('t-content').value.trim();
  if (!title || !content) return showToast('Title and content are required', 'error');
  try {
    await API.post('/transcripts', {
      title,
      content,
      participant: document.getElementById('t-participant').value.trim() || null,
      interview_date: document.getElementById('t-date').value || null,
    });
    showToast('Transcript saved');
    renderTranscripts();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

async function openTranscript(id) {
  window._currentTranscript = id;
  document.querySelector('[data-view="coding"]').click();
}

async function deleteTranscript(id) {
  if (!confirm('Delete this transcript and all its segments?')) return;
  try {
    await API.del('/transcripts/' + id);
    showToast('Deleted');
    loadTranscriptList();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
