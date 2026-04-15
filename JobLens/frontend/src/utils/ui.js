// ============================================================
// utils/ui.js  —  Reusable HTML component builders
// ============================================================

import { CATEGORIES } from '../data/jobMarketData.js';

// ── Page header ───────────────────────────────────────────
export function pageHeader({ title, em, subtitle, actions = '' }) {
  return `
    <div class="page-header">
      <div>
        <h1>${title} ${em ? `<em>${em}</em>` : ''}</h1>
        ${subtitle ? `<div class="page-header-sub">${subtitle}</div>` : ''}
      </div>
      <div class="header-actions">
        <div class="badge-live">Live Data</div>
        ${actions}
      </div>
    </div>
  `;
}

// ── Metric card ───────────────────────────────────────────
export function metricCard({ label, value, delta, deltaType = 'up', glyph = '', colorVar = '--text' }) {
  const cls = deltaType === 'up' ? 'delta-up' : deltaType === 'down' ? 'delta-down' : 'delta-neu';
  const arrow = deltaType === 'up' ? '↑' : deltaType === 'down' ? '↓' : '→';
  return `
    <div class="metric-card animate-in" data-glyph="${glyph}">
      <div class="metric-label">${label}</div>
      <div class="metric-value" style="color:${colorVar.startsWith('--') ? `var(${colorVar})` : colorVar}">${value}</div>
      ${delta ? `<div class="metric-delta ${cls}">${arrow} ${delta}</div>` : ''}
    </div>
  `;
}

// ── Card wrapper ──────────────────────────────────────────
export function card({ title, subtitle = '', body, extraClass = '' }) {
  return `
    <div class="card animate-in ${extraClass}">
      <div class="card-title">
        <span class="ct">${title}</span>
        ${subtitle ? `<span class="cs">${subtitle}</span>` : ''}
      </div>
      ${body}
    </div>
  `;
}

// ── Custom horizontal bar list ────────────────────────────
export function skillBarList(skills, maxPct = 100) {
  const COLORS = ['#6c63ff','#9d97ff','#4ecdc4','#06d6a0','#ffd166','#ff6b6b','#f7b731','#45b7d1','#a29bfe','#74b9ff'];
  return skills.map((s, i) => `
    <div class="bar-row">
      <div class="bar-label">${s.name}</div>
      <div class="bar-track">
        <div class="bar-fill" id="bf-${s.id || i}"
          style="width:0%;background:${COLORS[i % COLORS.length]}"
          data-target="${(s.pct / maxPct * 100).toFixed(1)}">
        </div>
      </div>
      <div class="bar-pct">${s.pct}%</div>
    </div>
  `).join('');
}

// ── Salary bar list ───────────────────────────────────────
export function salaryBarList(roles, maxSalary = 160000) {
  const COLORS = ['#6c63ff','#9d97ff','#4ecdc4','#06d6a0','#ffd166','#ff6b6b','#f7b731','#45b7d1'];
  return roles.map((r, i) => `
    <div class="sal-row">
      <div class="sal-label">${r.role}</div>
      <div class="sal-track">
        <div class="sal-fill" id="sf-${r.id}"
          style="width:0%;background:${COLORS[i]}"
          data-target="${(r.avgSalary / maxSalary * 100).toFixed(1)}">
          $${Math.round(r.avgSalary / 1000)}K
        </div>
      </div>
    </div>
  `).join('');
}

// ── Animate all bars on page ──────────────────────────────
export function animateBars() {
  requestAnimationFrame(() => {
    document.querySelectorAll('[data-target]').forEach(el => {
      el.style.width = el.dataset.target + '%';
    });
  });
}

// ── Role card ─────────────────────────────────────────────
export function roleCard(r) {
  const growing = parseInt(r.growth) > 50;
  return `
    <div class="role-card" data-role="${r.id}" role="button" tabindex="0">
      <div class="role-icon" style="background:${r.color}22;color:${r.color}">${r.icon}</div>
      <div>
        <div style="font-size:13.5px;font-weight:500;color:var(--text)">${r.role}</div>
        <div style="font-size:11.5px;color:var(--text2);margin-top:2px">${r.count.toLocaleString()} openings</div>
      </div>
      <div class="role-trend ${growing ? 'delta-up' : 'delta-up'}">+${r.growth}%</div>
    </div>
  `;
}

// ── Skills cloud ──────────────────────────────────────────
export function skillsCloud(skills) {
  const sizes = [22, 20, 18, 17, 16, 15, 14, 13, 13, 12, 12, 12, 11, 11, 11, 11, 11, 11, 11, 11];
  return skills.map((s, i) => {
    const col = CATEGORIES[s.cat]?.color || '#9699b0';
    const sz = sizes[i] || 11;
    const pad = sz > 16 ? '7px 14px' : '5px 10px';
    return `<span class="skill-tag tag" style="font-size:${sz}px;padding:${pad};background:${col}20;color:${col};border-color:${col}40">${s.name}</span>`;
  }).join('');
}

// ── Category badge ────────────────────────────────────────
export function catBadge(cat) {
  const c = CATEGORIES[cat];
  if (!c) return cat;
  return `<span class="tag" style="background:${c.color}20;color:${c.color}">${c.label}</span>`;
}

// ── Growth badge ──────────────────────────────────────────
export function growthBadge(pct) {
  const pos = pct >= 0;
  const col = pos ? 'var(--green)' : 'var(--red)';
  const bg  = pos ? 'rgba(6,214,160,0.12)' : 'rgba(255,107,107,0.12)';
  return `<span class="tag" style="background:${bg};color:${col}">${pos ? '+' : ''}${pct}%</span>`;
}

// ── Section label ─────────────────────────────────────────
export function sectionLabel(text) {
  return `<div class="section-label">${text}</div>`;
}

// ── Empty state ───────────────────────────────────────────
export function emptyState(msg = 'No data found') {
  return `<div style="text-align:center;padding:40px;color:var(--text3);font-size:14px">${msg}</div>`;
}

// ── Donut legend ─────────────────────────────────────────
export function donutLegend(labels, data, colors) {
  const total = data.reduce((a, b) => a + b, 0);
  return labels.map((l, i) => `
    <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--text2)">
      <div style="width:10px;height:10px;border-radius:2px;background:${colors[i]};flex-shrink:0"></div>
      <span>${l}</span>
      <span style="margin-left:auto;font-weight:500;color:var(--text)">${Math.round(data[i] / total * 100)}%</span>
    </div>
  `).join('');
}

// ── Geo item ──────────────────────────────────────────────
export function geoItem(g) {
  return `
    <div class="geo-item">
      <div style="font-size:13px;color:var(--text);flex:1">${g.city}</div>
      <div style="font-size:11px;color:var(--text3)">${g.country}</div>
      <div class="geo-bar-mini"><div class="geo-bar-fill" style="width:${g.pct}%;background:${g.color}"></div></div>
      <div style="font-size:12px;width:52px;text-align:right;color:${g.color};font-weight:500">${g.count.toLocaleString()}</div>
    </div>
  `;
}

// ── Filter row ────────────────────────────────────────────
export function filterRow(filters, activeId, onClickAttr) {
  return `
    <div class="filter-row">
      ${filters.map(f => `
        <div class="filter-btn ${f.id === activeId ? 'active' : ''}" ${onClickAttr}="${f.id}" role="button" tabindex="0">
          ${f.label}
        </div>
      `).join('')}
    </div>
  `;
}
