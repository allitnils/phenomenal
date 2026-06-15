async function renderMemos() {
  document.getElementById('topbar-title').textContent = 'Memos';
  const content = document.getElementById('content');
  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <h2 style="font-size:18px;font-weight:700">Research Memos</h2>
      <button class="btn btn-primary" onclick="showAddMemo()">+ New Memo</button>
    </div>
    <div id="memo-list">Loading...</div>
  `;
  await loadMemoList();
}

async function loadMemoList() {
  const list = document.getElementById('memo-list');
  if (!list) return;
  try {
    const memos = await API.get('/memos');
    if (memos.length === 0) {
      list.innerHTML = '<p style="color:var(--muted)">No memos yet.</p>';
      return;
    }
    list.innerHTML = memos.map(m => `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div class="card-title">${escHtml(m.title)}</div>
          <button class="btn btn-danger" onclick="deleteMemo(${m.id})">Delete</button>
        </div>
        <div class="card-meta">${new Date(m.updated_at).toLocaleDateString()}</div>
        <div style="margin-top:10px;font-size:13px;white-space:pre-wrap">${escHtml(m.content)}</div>
      </div>
    `).join('');
  } catch (e) {
    list.innerHTML = `<p style="color:var(--red)">${e.message}</p>`;
  }
}

function showAddMemo() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <h2 style="font-size:18px;font-weight:700;margin-bottom:20px">New Memo</h2>
    <div class="form-group"><label>Title *</label><input type="text" id="m-title" placeholder="Theoretical insight..."></div>
    <div class="form-group"><label>Content *</label><textarea id="m-content" style="min-height:200px"></textarea></div>
    <div style="display:flex;gap:12px">
      <button class="btn btn-primary" onclick="saveMemo()">Save</button>
      <button class="btn btn-ghost" onclick="renderMemos()">Cancel</button>
    </div>
  `;
}

async function saveMemo() {
  const title = document.getElementById('m-title').value.trim();
  const content = document.getElementById('m-content').value.trim();
  if (!title || !content) return showToast('Title and content required', 'error');
  try {
    await API.post('/memos', { title, content });
    showToast('Memo saved');
    renderMemos();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

async function deleteMemo(id) {
  if (!confirm('Delete this memo?')) return;
  try {
    await API.del('/memos/' + id);
    showToast('Deleted');
    loadMemoList();
  } catch (e) {
    showToast(e.message, 'error');
  }
}
