// ============================================================
// pages/Skills.js  —  Skills Deep Dive
// ============================================================

import { SKILLS, MONTHS, CATEGORIES } from '../data/jobMarketData.js';
import { pageHeader, card, sectionLabel, catBadge, growthBadge, emptyState } from '../utils/ui.js';
import { makeBarChart, makeLineChart, canvasWrap, destroyChart } from '../utils/charts.js';

let activeCat = 'all';
let searchQuery = '';

function filteredSkills() {
  return SKILLS.filter(s =>
    (activeCat === 'all' || s.cat === activeCat) &&
    (searchQuery === '' || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
}

function buildTable(skills) {
  if (!skills.length) return emptyState('No skills match your filter.');
  const rows = skills.map(s => `
    <tr>
      <td>${s.name}</td>
      <td>${catBadge(s.cat)}</td>
      <td><span style="font-family:var(--font-mono)">${s.mentions.toLocaleString()}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:5px;background:var(--bg3);border-radius:3px;overflow:hidden;min-width:60px">
            <div style="width:${s.pct}%;height:100%;background:${CATEGORIES[s.cat]?.color || '#6c63ff'};border-radius:3px"></div>
          </div>
          <span style="font-size:12px;color:var(--text2)">${s.pct}%</span>
        </div>
      </td>
      <td style="color:var(--green)">$${Math.round(s.avgSalary / 1000)}K</td>
      <td>${growthBadge(s.growth)}</td>
    </tr>
  `).join('');

  return `
    <table>
      <thead>
        <tr>
          <th>Skill</th><th>Category</th><th>Mentions</th>
          <th>Demand</th><th>Avg Salary</th><th>Growth YoY</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderCharts() {
  const skills = filteredSkills().slice(0, 16);

  destroyChart('skillsBarChart');
  makeBarChart('skillsBarChart', {
    labels: skills.map(s => s.name),
    datasets: [{
      label: 'Demand %',
      data: skills.map(s => s.pct),
      backgroundColor: skills.map(s => (CATEGORIES[s.cat]?.color || '#6c63ff') + 'cc'),
    }],
    horizontal: true,
    yCallback: v => v + '%',
  });

  // Trend lines for top 4 skills
  destroyChart('trendChart');
  const top4 = SKILLS.slice(0, 4);
  const TREND_COLORS = ['#6c63ff','#ff6b6b','#06d6a0','#ffd166'];
  makeLineChart('trendChart', {
    labels: MONTHS,
    datasets: top4.map((s, i) => ({
      label: s.name,
      data: s.trend,
      borderColor: TREND_COLORS[i],
      backgroundColor: TREND_COLORS[i] + '15',
      fill: false,
    })),
  });
}

function refreshTable() {
  const wrap = document.getElementById('skills-table-wrap');
  if (wrap) wrap.innerHTML = buildTable(filteredSkills());
}

export function renderSkills(container) {
  activeCat = 'all';
  searchQuery = '';

  const catFilters = [
    { id: 'all', label: 'All Skills' },
    ...Object.entries(CATEGORIES).map(([id, c]) => ({ id, label: c.label }))
  ];

  container.innerHTML = `
    ${pageHeader({ title: 'Skills', em: 'Analysis', subtitle: '284 unique skills tracked across 12,847 job listings' })}

    <div class="page-content">
      ${sectionLabel('Filter by Category')}

      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <div class="filter-row" id="cat-filter-row">
          ${catFilters.map(f => `
            <div class="filter-btn ${f.id === 'all' ? 'active' : ''}" data-cat="${f.id}" role="button">${f.label}</div>
          `).join('')}
        </div>
        <div class="search-bar" style="max-width:240px">
          <span class="search-icon">🔍</span>
          <input type="search" placeholder="Search skills..." id="skill-search" />
        </div>
      </div>

      <div class="grid-6-4">
        ${card({ title: 'Skill Demand', subtitle: 'Filtered view', body: canvasWrap('skillsBarChart', 420) })}
        ${card({ title: '12-Month Trend', subtitle: 'Top skills rolling', body: canvasWrap('trendChart', 420) })}
      </div>

      ${card({
        title: 'Skills Directory',
        subtitle: `${SKILLS.length} skills`,
        body: `<div class="table-wrap" id="skills-table-wrap">${buildTable(SKILLS)}</div>`,
      })}
    </div>
  `;

  renderCharts();

  // Category filter
  container.getElementById?.('cat-filter-row') ||
  document.getElementById('cat-filter-row').addEventListener('click', e => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    activeCat = btn.dataset.cat;
    document.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('active', b.dataset.cat === activeCat));
    refreshTable();
    renderCharts();
  });

  document.getElementById('skill-search').addEventListener('input', e => {
    searchQuery = e.target.value;
    refreshTable();
  });
}
