// ============================================================
// utils/charts.js  —  Chart factory helpers
// ============================================================

// ── Chart.js CDN must be loaded before calling these ──────
// Add to index.html: <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>

const GRID_COLOR    = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#2a2d4a';
const TEXT_COLOR    = getComputedStyle(document.documentElement).getPropertyValue('--text2').trim()  || '#9699b0';
const TICK_FONT     = { size: 11, family: "'DM Sans', sans-serif" };

export function resolveColor(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function baseScales(type = 'cartesian') {
  if (type === 'radar') return {
    r: {
      grid:        { color: resolveColor('--border') || '#2a2d4a' },
      ticks:       { display: false, backdropColor: 'transparent' },
      pointLabels: { color: resolveColor('--text2') || '#9699b0', font: TICK_FONT },
      angleLines:  { color: resolveColor('--border') || '#2a2d4a' },
    }
  };

  return {
    x: { grid: { color: resolveColor('--border') || '#2a2d4a', drawBorder: false }, ticks: { color: resolveColor('--text2') || '#9699b0', font: TICK_FONT } },
    y: { grid: { color: resolveColor('--border') || '#2a2d4a', drawBorder: false }, ticks: { color: resolveColor('--text2') || '#9699b0', font: TICK_FONT } },
  };
}

function baseLegend(show = true) {
  return { display: show, labels: { color: resolveColor('--text2') || '#9699b0', font: TICK_FONT, boxWidth: 10, padding: 14 } };
}

// ── Bar Chart ─────────────────────────────────────────────
export function makeBarChart(canvasId, { labels, datasets, horizontal = false, stacked = false, yCallback }) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  if (ctx._chartInstance) ctx._chartInstance.destroy();

  const ds = datasets.map(d => ({
    ...d,
    borderRadius: 6,
    borderSkipped: false,
  }));

  const scales = baseScales();
  if (horizontal) { const tmp = scales.x; scales.x = scales.y; scales.y = tmp; scales.y.grid = { display: false, drawBorder: false }; }
  if (stacked) { scales.x.stacked = true; scales.y.stacked = true; }
  if (yCallback) scales.y.ticks = { ...scales.y.ticks, callback: yCallback };

  const chart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: ds },
    options: {
      indexAxis: horizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: baseLegend(datasets.length > 1), tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label || ''}: ${ctx.formattedValue}` } } },
      scales,
    }
  });
  ctx._chartInstance = chart;
  return chart;
}

// ── Line Chart ────────────────────────────────────────────
export function makeLineChart(canvasId, { labels, datasets, yCallback, fill = false }) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  if (ctx._chartInstance) ctx._chartInstance.destroy();

  const ds = datasets.map(d => ({
    ...d,
    tension: 0.4,
    fill: d.fill !== undefined ? d.fill : fill,
    pointRadius: 3,
    pointHoverRadius: 5,
    borderWidth: d.borderWidth || 2,
  }));

  const scales = baseScales();
  if (yCallback) scales.y.ticks.callback = yCallback;

  const chart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: ds },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: baseLegend(datasets.length > 1) },
      scales,
    }
  });
  ctx._chartInstance = chart;
  return chart;
}

// ── Doughnut Chart ────────────────────────────────────────
export function makeDoughnut(canvasId, { labels, data, colors }) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  if (ctx._chartInstance) ctx._chartInstance.destroy();

  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }] },
    options: {
      responsive: false,
      cutout: '68%',
      plugins: { legend: { display: false } },
    }
  });
  ctx._chartInstance = chart;
  return chart;
}

// ── Radar Chart ───────────────────────────────────────────
export function makeRadar(canvasId, { labels, datasets }) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  if (ctx._chartInstance) ctx._chartInstance.destroy();

  const ds = datasets.map(d => ({ ...d, borderWidth: 2, pointRadius: 4 }));

  const chart = new Chart(ctx, {
    type: 'radar',
    data: { labels, datasets: ds },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: baseLegend(true) },
      scales: baseScales('radar'),
    }
  });
  ctx._chartInstance = chart;
  return chart;
}

// ── Destroy helper ────────────────────────────────────────
export function destroyChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (ctx && ctx._chartInstance) { ctx._chartInstance.destroy(); ctx._chartInstance = null; }
}

// ── Canvas wrapper ────────────────────────────────────────
export function canvasWrap(id, height = 320) {
  return `<div style="position:relative;height:${height}px"><canvas id="${id}"></canvas></div>`;
}
