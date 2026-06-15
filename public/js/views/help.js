'use strict';

function renderHelp() {
  document.getElementById('topbar-title').textContent = 'Help & Guide';
  const content = document.getElementById('content');
  content.innerHTML = `
    <div style="max-width:760px;margin:0 auto">

      <div style="margin-bottom:32px">
        <h2 style="font-size:22px;font-weight:700;margin-bottom:6px">Getting started with phenomenal</h2>
        <p style="color:var(--muted);font-size:14px;line-height:1.7">
          phenomenal is a qualitative research coding platform. You import interview transcripts,
          apply codes to passages of text, analyse how codes appear together across interviews,
          and write analytical memos — all in the browser, all stored locally on the server.
        </p>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:32px">
        ${helpStep(1, 'Add a transcript', 'transcripts')}
        ${helpStep(2, 'Create codes', 'coding')}
        ${helpStep(3, 'Code the text', 'coding')}
        ${helpStep(4, 'Explore co-occurrence', 'graph')}
        ${helpStep(5, 'Write memos', 'memos')}
        ${helpStep(6, 'Export your data', null)}
      </div>

      ${section('1 — Transcripts', `
        <p>Transcripts are the raw material — interview recordings, field notes, focus group text, anything you want to code.</p>
        <ol style="margin:12px 0 0 20px;display:flex;flex-direction:column;gap:8px">
          <li>Go to <strong>Transcripts</strong> in the sidebar</li>
          <li>Click <strong>+ Add Transcript</strong></li>
          <li>Give it a title (e.g. <code>Interview with P01</code>), participant label, and interview date</li>
          <li>Paste the full transcript text into the content box</li>
          <li>Click <strong>Save Transcript</strong></li>
        </ol>
        <div class="help-tip">You can store as many transcripts as you like. The full text is stored in SQLite on the server — nothing leaves the instance.</div>
      `)}

      ${section('2 — Codes', `
        <p>Codes are labels you apply to passages of text. In grounded theory, codes emerge from the data. In thematic analysis, you may have a starter set. Either way works here.</p>
        <ol style="margin:12px 0 0 20px;display:flex;flex-direction:column;gap:8px">
          <li>Go to <strong>Coding</strong> in the sidebar</li>
          <li>Click <strong>+ Code</strong> in the right panel</li>
          <li>Enter a code name (e.g. <code>liminal-space</code>, <code>technostress</code>, <code>boundary-work</code>)</li>
          <li>Optionally add a category (groups related codes) and pick a colour</li>
          <li>Click <strong>Save</strong></li>
        </ol>
        <div class="help-tip">Use short, hyphenated names for codes — they render cleanly in the graph and export files. You can have as many codes as needed.</div>
      `)}

      ${section('3 — Coding text', `
        <p>This is the core workflow: select a passage, apply a code.</p>
        <ol style="margin:12px 0 0 20px;display:flex;flex-direction:column;gap:8px">
          <li>Go to <strong>Coding</strong></li>
          <li>Choose a transcript from the dropdown at the top left</li>
          <li>The transcript text appears in the left panel</li>
          <li><strong>Click a code</strong> in the right panel to select it (it will highlight)</li>
          <li><strong>Select text</strong> in the transcript by clicking and dragging</li>
          <li>Release — the segment is saved automatically and appears in the Coded Segments list below</li>
          <li>Repeat: select a different code, select more text</li>
        </ol>
        <div class="help-tip">You can apply multiple codes to the same passage — just select the text again with a different code active. Overlapping segments are supported.</div>
        <div class="help-tip" style="margin-top:8px">To remove a segment, click the <strong>×</strong> button next to it in the Coded Segments list.</div>
      `)}

      ${section('4 — Co-occurrence graph', `
        <p>The graph shows which codes appear together across transcripts. A thick edge means those two codes were both applied in many interviews.</p>
        <ul style="margin:12px 0 0 20px;display:flex;flex-direction:column;gap:6px">
          <li><strong>Node size</strong> = how many segments that code has</li>
          <li><strong>Edge thickness</strong> = how often the two codes appear in the same transcript</li>
          <li><strong>Drag nodes</strong> to reposition them</li>
          <li>Clusters of tightly connected codes often signal a theme worth exploring in a memo</li>
        </ul>
        <div class="help-tip">The graph updates live as you add segments. Come back after each coding session to see patterns emerge.</div>
      `)}

      ${section('5 — Memos', `
        <p>Memos are analytical notes — the space where you interpret, theorise, and track your thinking as it evolves. They are a core practice in grounded theory.</p>
        <ol style="margin:12px 0 0 20px;display:flex;flex-direction:column;gap:8px">
          <li>Go to <strong>Memos</strong></li>
          <li>Click <strong>+ New Memo</strong></li>
          <li>Write freely — observations, hypotheses, connections between codes, questions to pursue</li>
          <li>Click <strong>Save</strong></li>
        </ol>
        <div class="help-tip">Good memo practice: write a memo whenever the graph or a coded passage surprises you. Memos become your audit trail and the raw material for your write-up.</div>
      `)}

      ${section('6 — Exporting', `
        <p>Use the export buttons at the bottom of the sidebar to download your data.</p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">
          ${exportRow('CSV', 'One row per coded segment. Columns: transcript, participant, code, category, text, offsets, memo, date. Import into Excel or R.')}
          ${exportRow('JSON', 'Complete data dump: all transcripts, codes, segments, and memos. Use this for backups or to import into another tool.')}
          ${exportRow('NVivo', 'Tab-delimited format compatible with NVivo import (Name / Content / Code columns). Useful if collaborators use NVivo.')}
        </div>
        <div class="help-tip" style="margin-top:12px">Export JSON regularly as a backup — it captures everything and can be used to restore if needed.</div>
      `)}

      ${section('Keyboard shortcuts & tips', `
        <ul style="margin:0 0 0 20px;display:flex;flex-direction:column;gap:8px">
          <li>Select text with mouse, release to code — no button to click</li>
          <li>Click a different code in the list to switch which code is active</li>
          <li>A code turns semi-transparent when not selected; full opacity when active</li>
          <li>The segment count next to each code updates in real time</li>
          <li>Segments are ordered by position in the transcript, not creation time</li>
          <li>Memos can be as short as one sentence or several paragraphs — write at whatever length the insight demands</li>
        </ul>
      `)}

      <div style="margin-top:32px;padding:20px 24px;background:var(--surface);border:1px solid var(--border);border-radius:8px;display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap">
        <div>
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">About phenomenal</div>
          <div style="font-size:13px;color:var(--muted);line-height:1.65;max-width:480px">
            Built for qualitative researchers using grounded theory, thematic analysis, or IPA.
            Self-hosted — your data stays on your server. No accounts, no cloud sync, no usage limits.
          </div>
          <div style="margin-top:10px;display:flex;gap:12px;flex-wrap:wrap">
            <a href="https://github.com/allitnils/phenomenal" target="_blank" rel="noopener"
               style="font-size:12px;color:var(--muted);text-decoration:none;display:inline-flex;align-items:center;gap:4px">
              ⌥ Source on GitHub
            </a>
          </div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:11px;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.06em">Built by</div>
          <a href="https://ivanocampo.com" target="_blank" rel="noopener"
             style="font-size:15px;font-weight:700;color:var(--accent);text-decoration:none;font-family:'Fira Code',monospace;display:block;margin-bottom:8px">
            Ivan Ocampo
          </a>
          <a href="mailto:ivan@ivanocampo.com?subject=phenomenal%20feedback"
             style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);text-decoration:none;padding:6px 12px;border:1px solid var(--border);border-radius:5px;transition:all 0.15s"
             onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--text)'"
             onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--muted)'">
            ✉ Send feedback
          </a>
        </div>
      </div>

    </div>

    <style>
      .help-step {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 16px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s;
      }
      .help-step:hover { background: var(--surface2); border-color: var(--accent); }
      .help-step-num {
        width: 28px; height: 28px;
        border-radius: 50%;
        background: var(--accent);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .help-step-label { font-weight: 500; font-size: 14px; }
      .help-step-nav { margin-left: auto; font-size: 12px; color: var(--accent); }
      .help-section { margin-bottom: 28px; }
      .help-section h3 {
        font-size: 15px; font-weight: 700;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border);
        font-family: 'Fira Code', monospace;
        color: var(--accent);
      }
      .help-section p, .help-section li { color: var(--muted); font-size: 13px; line-height: 1.75; }
      .help-section strong { color: var(--text); }
      .help-section code {
        font-family: 'Fira Code', monospace;
        background: var(--surface2);
        padding: 1px 5px;
        border-radius: 3px;
        font-size: 12px;
        color: var(--accent);
      }
      .help-tip {
        margin-top: 12px;
        padding: 10px 14px;
        background: rgba(99,102,241,0.08);
        border-left: 3px solid var(--accent);
        border-radius: 0 6px 6px 0;
        font-size: 12px;
        color: var(--muted);
        line-height: 1.65;
      }
      .export-row {
        padding: 12px 16px;
        background: var(--surface2);
        border: 1px solid var(--border);
        border-radius: 6px;
      }
      .export-row-label { font-weight: 600; font-size: 13px; margin-bottom: 3px; }
      .export-row-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }
    </style>
  `;

  // Wire up clickable workflow steps
  document.querySelectorAll('.help-step[data-nav]').forEach(el => {
    el.addEventListener('click', () => {
      const view = el.dataset.nav;
      const navItem = document.querySelector(`.nav-item[data-view="${view}"]`);
      if (navItem) navItem.click();
    });
  });
}

function helpStep(num, label, view) {
  const nav = view ? `data-nav="${view}"` : '';
  const arrow = view ? `<span class="help-step-nav">Go there →</span>` : '';
  return `
    <div class="help-step" ${nav}>
      <div class="help-step-num">${num}</div>
      <div class="help-step-label">${label}</div>
      ${arrow}
    </div>
  `;
}

function section(title, body) {
  return `
    <div class="help-section">
      <h3>${title}</h3>
      ${body}
    </div>
  `;
}

function exportRow(label, desc) {
  return `
    <div class="export-row">
      <div class="export-row-label">${label}</div>
      <div class="export-row-desc">${desc}</div>
    </div>
  `;
}
