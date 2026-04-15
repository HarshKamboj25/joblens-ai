// ============================================================
// pages/Dashboard.js  —  Main Overview Page
// ============================================================

import { SKILLS, ROLES, META, CATEGORIES } from '../data/jobMarketData.js';
import { pageHeader, metricCard, card, skillBarList, salaryBarList, animateBars, roleCard, skillsCloud, donutLegend, sectionLabel } from '../utils/ui.js';
import { makeDoughnut, canvasWrap } from '../utils/charts.js';
import { navigate } from '../app.js';

const METRICS = [
  { label: 'Total Jobs Analyzed',    value: '12,847', delta: '18% vs last month', deltaType: 'up', glyph: '▦', colorVar: '--text'    },
  { label: 'Unique Skills Detected', value: '284',    delta: '23 new skills',     deltaType: 'up', glyph: '◈', colorVar: '--red'     },
  { label: 'Avg Salary (Tech)',       value: '$118K',  delta: '6.2% YoY',          deltaType: 'up', glyph: '＄', colorVar: '--yellow'  },
  { label: 'Fastest Growing Role',   value: 'AI Eng', delta: '+142% YoY',         deltaType: 'up', glyph: '↑', colorVar: '--accent2' },
];

export function renderDashboard(container) {
  container.innerHTML = `
    ${pageHeader({ title: 'AI Job Market', em: 'Analytics', subtitle: `Analyzing ${META.totalJobs.toLocaleString()} job listings · Updated ${META.dataDate}` })}

    <div class="page-content">
      <!-- KPI row -->
      <div>
        ${sectionLabel('Overview Metrics')}
        <div class="grid-4">
          ${METRICS.map((m, i) => `<div class="delay-${i + 1}">${metricCard(m)}</div>`).join('')}
        </div>
      </div>

      <!-- Charts row 1 -->
      <div class="grid-6-4">
        ${card({
          title: 'Top In-Demand Skills',
          subtitle: 'Frequency in listings',
          body: `<div id="skills-bar-list">${skillBarList(SKILLS.slice(0, 10))}</div>`,
        })}

        ${card({
          title: 'Role Distribution',
          subtitle: 'By category',
          body: `
            <div style="display:flex;flex-direction:column;align-items:center;gap:16px">
              <canvas id="donutChart" width="180" height="180"></canvas>
              <div style="display:flex;flex-direction:column;gap:8px;width:100%" id="donut-legend"></div>
            </div>
          `,
        })}
      </div>

      <!-- Charts row 2 -->
      <div class="grid-4-4-4">
        ${card({
          title: 'Salary by Role',
          subtitle: 'Annual avg',
          body: `<div id="salary-bar-list">${salaryBarList(ROLES.slice(0, 6))}</div>`,
        })}

        ${card({
          title: 'Trending Roles',
          subtitle: 'YoY growth',
          body: `<div style="display:flex;flex-direction:column;gap:6px" id="role-cards-list">
            ${ROLES.slice(0, 6).map(roleCard).join('')}
          </div>`,
        })}

        ${card({
          title: 'Skills Cloud',
          subtitle: 'Size = demand',
          body: `<div class="skills-cloud">${skillsCloud(SKILLS.slice(0, 18))}</div>`,
        })}
      </div>

      <!-- Quick links -->
      <div>
        ${sectionLabel('Explore Deeper')}
        <div class="grid-4">
          ${[
            { page:'skills',   label:'Skills Analysis', sub:'284 skills ranked',          icon:'◈', col:'#6c63ff' },
            { page:'roles',    label:'Job Roles',        sub:'8 role deep dives',          icon:'◎', col:'#ff6b6b' },
            { page:'salary',   label:'Salary Trends',    sub:'Role & skill premiums',      icon:'＄', col:'#06d6a0' },
            { page:'gap',      label:'Skill Gap Check',  sub:'Find your missing skills',   icon:'△', col:'#ffd166' },
          ].map(l => `
            <div class="card animate-in" style="cursor:pointer;border-color:${l.col}30"
                 data-quicknav="${l.page}" role="button" tabindex="0">
              <div style="font-size:24px;margin-bottom:10px">${l.icon}</div>
              <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:4px">${l.label}</div>
              <div style="font-size:12px;color:var(--text3)">${l.sub}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Animate bars
  animateBars();

  // Donut chart
  const catCounts = {};
  SKILLS.forEach(s => { catCounts[s.cat] = (catCounts[s.cat] || 0) + s.mentions; });
  const catLabels  = Object.keys(CATEGORIES).map(k => CATEGORIES[k].label);
  const catData    = Object.keys(CATEGORIES).map(k => catCounts[k] || 0);
  const catColors  = Object.keys(CATEGORIES).map(k => CATEGORIES[k].color);
  makeDoughnut('donutChart', { labels: catLabels, data: catData, colors: catColors });
  document.getElementById('donut-legend').innerHTML = donutLegend(catLabels, catData, catColors);

  // Role card clicks → Roles page
  container.querySelectorAll('[data-role]').forEach(el => {
    el.addEventListener('click', () => navigate('roles'));
  });

  // Quick nav
  container.querySelectorAll('[data-quicknav]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.quicknav));
  });
}
