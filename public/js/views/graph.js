async function renderGraph() {
  document.getElementById('topbar-title').textContent = 'Co-occurrence Graph';
  const content = document.getElementById('content');
  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h2 style="font-size:18px;font-weight:700">Code Co-occurrence</h2>
    </div>
    <div id="graph-container"></div>
    <div style="margin-top:16px;font-size:12px;color:var(--muted)">
      Nodes = codes (size = usage count). Edges = co-occurrence in same transcript (thickness = frequency).
    </div>
  `;
  await loadGraph();
}

async function loadGraph() {
  const container = document.getElementById('graph-container');
  if (!container) return;
  try {
    const data = await API.get('/analysis/cooccurrence');
    if (data.nodes.length === 0) {
      container.innerHTML = '<p style="color:var(--muted);padding:20px">No coded segments yet — code some text first.</p>';
      return;
    }
    drawForceGraph(container, data);
  } catch (e) {
    container.innerHTML = `<p style="color:var(--red);padding:20px">${e.message}</p>`;
  }
}

function drawForceGraph(container, { nodes, links }) {
  const W = container.clientWidth || 700;
  const H = 500;

  const svg = d3.select(container)
    .append('svg')
    .attr('width', W)
    .attr('height', H);

  const maxCount = Math.max(...nodes.map(n => n.count), 1);
  const radius = n => 8 + (n.count / maxCount) * 16;

  const maxWeight = links.length ? Math.max(...links.map(l => l.weight), 1) : 1;
  const strokeW = l => 1 + (l.weight / maxWeight) * 5;

  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(W / 2, H / 2))
    .force('collision', d3.forceCollide().radius(d => radius(d) + 10));

  const link = svg.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#334155')
    .attr('stroke-opacity', 0.8)
    .attr('stroke-width', d => strokeW(d));

  const node = svg.append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .call(d3.drag()
      .on('start', (event, d) => { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
      .on('end', (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
    );

  node.append('circle')
    .attr('r', d => radius(d))
    .attr('fill', d => d.color)
    .attr('stroke', '#0f1117')
    .attr('stroke-width', 2);

  node.append('text')
    .text(d => d.name)
    .attr('dy', '0.35em')
    .attr('x', d => radius(d) + 4)
    .attr('font-size', 11);

  sim.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
}
