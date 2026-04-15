// ============================================================
// pages/Salary.js
// ============================================================

import { ROLES, SALARY_HISTORY, SKILLS } from '../data/jobMarketData.js';
import { pageHeader, card, metricCard, sectionLabel } from '../utils/ui.js';
import { makeBarChart, makeLineChart, canvasWrap, destroyChart } from '../utils/charts.js';

export function renderSalary(container) {
  const topPremiumSkills = [...SKILLS].sort((a, b) => b.avgSalary - a.avgSalary).slice(0, 10);
  const premiums = topPremiumSkills.map(s => Math.round((s.avgSalary - 95000) / 1000));

  container.innerHTML = `
    ${pageHeader({ title: 'Salary', em: 'Trends', subtitle: 'Compensation intelligence across roles and skills' })}
    <div class="page-content">
      <div class="grid-4">
        ${metricCard({ label: 'Highest Avg Role',   value: 'AI Eng.',    delta: '$145K average',  deltaType: 'neu', glyph: '✦', colorVar: '--accent2' })}
        ${metricCard({ label: 'Best Skill Premium', value: 'RAG',        delta: '+$63K lift',     deltaType: 'up',  glyph: '↑', colorVar: '--green'   })}
        ${metricCard({ label: 'Fastest Pay Growth', value: 'AI Eng.',    delta: '↑ 21% YoY',     deltaType: 'up',  glyph: '🚀',colorVar: '--yellow'  })}
        ${metricCard({ label: 'Entry Level Avg',    value: '$78K',       delta: '↑ 9% YoY',      deltaType: 'up',  glyph: '$', colorVar: '--text'    })}
      </div>

      <div class="grid-6-4">
        ${card({ title: 'Salary by Role (Entry / Mid / Senior)', body: canvasWrap('salaryLevelChart', 340) })}
        ${card({ title: 'Skill Salary Premium', subtitle: 'vs baseline $95K', body: canvasWrap('skillPremiumChart', 340) })}
      </div>

      ${card({ title: 'Salary Growth 2021–2025', subtitle: 'All roles', body: canvasWrap('salaryHistoryChart', 320) })}

      ${sectionLabel('Role Salary Breakdown')}
      <div class="grid-3">
        ${ROLES.map(r => `
          <div class="card animate-in">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
              <span style="font-size:22px">${r.icon}</span>
              <div>
                <div style="font-weight:500;color:var(--text)">${r.role}</div>
                <div style="font-size:11.5px;color:var(--text3)">Avg $${Math.round(r.avgSalary / 1000)}K</div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${[['Entry', r.entryS], ['Mid (Avg)', r.avgSalary], ['Senior', r.seniorS]].map(([lvl, val]) => `
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="font-size:11.5px;color:var(--text3);width:70px">${lvl}</div>
                  <div style="flex:1;height:6px;background:var(--bg3);border-radius:3px;overflow:hidden">
                    <div style="width:${Math.round(val / 220000 * 100)}%;height:100%;background:${r.color};border-radius:3px"></div>
                  </div>
                  <div style="font-size:12px;color:var(--text2);width:44px;text-align:right">$${Math.round(val / 1000)}K</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  destroyChart('salaryLevelChart');
  makeBarChart('salaryLevelChart', {
    labels: ROLES.map(r => r.role),
    datasets: [
      { label: 'Entry ($K)', data: ROLES.map(r => Math.round(r.entryS / 1000)), backgroundColor: '#6c63ff55' },
      { label: 'Mid ($K)',   data: ROLES.map(r => Math.round(r.avgSalary / 1000)), backgroundColor: '#6c63ffaa' },
      { label: 'Senior ($K)',data: ROLES.map(r => Math.round(r.seniorS / 1000)), backgroundColor: '#9d97ff' },
    ],
    stacked: false,
    yCallback: v => '$' + v + 'K',
  });

  destroyChart('skillPremiumChart');
  makeBarChart('skillPremiumChart', {
    labels: topPremiumSkills.map(s => s.name),
    datasets: [{
      label: 'Premium ($K)',
      data: premiums,
      backgroundColor: premiums.map(p => p > 50 ? '#ff6b6b99' : p > 30 ? '#ffd16699' : '#06d6a099'),
    }],
    yCallback: v => '+$' + v + 'K',
  });

  destroyChart('salaryHistoryChart');
  const colors = ROLES.map(r => r.color);
  makeLineChart('salaryHistoryChart', {
    labels: SALARY_HISTORY.years,
    datasets: ROLES.map((r, i) => ({
      label: r.role,
      data: SALARY_HISTORY.roles[r.id].map(v => Math.round(v / 1000)),
      borderColor: colors[i],
      fill: false,
    })),
    yCallback: v => '$' + v + 'K',
  });
}
