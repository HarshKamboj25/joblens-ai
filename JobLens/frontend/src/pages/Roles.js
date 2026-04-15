// ============================================================
// pages/Roles.js
// ============================================================

import { ROLES } from '../data/jobMarketData.js';
import { pageHeader, card, sectionLabel, growthBadge, catBadge } from '../utils/ui.js';
import { makeBarChart, canvasWrap, destroyChart } from '../utils/charts.js';

export function renderRoles(container) {
  const tableRows = ROLES.map(r => `
    <tr>
      <td><span style="margin-right:8px">${r.icon}</span>${r.role}</td>
      <td>${r.count.toLocaleString()}</td>
      <td style="color:var(--green)">$${Math.round(r.avgSalary / 1000)}K</td>
      <td>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${r.topSkills.slice(0, 3).map(s => `<span class="tag" style="background:${r.color}15;color:${r.color};font-size:11px;padding:2px 8px">${s}</span>`).join('')}
        </div>
      </td>
      <td>${r.exp}</td>
      <td>${r.remote}%</td>
      <td>${growthBadge(r.growth)}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    ${pageHeader({ title: 'Job', em: 'Roles', subtitle: '8 role categories across 12,847 listings' })}
    <div class="page-content">
      <div class="grid-4">
        ${ROLES.map(r => `
          <div class="metric-card animate-in" style="border-left:3px solid ${r.color}">
            <div class="metric-label">${r.icon} ${r.role}</div>
            <div class="metric-value" style="font-size:24px;color:${r.color}">${r.count.toLocaleString()}</div>
            <div class="metric-delta delta-up">+${r.growth}% YoY</div>
          </div>
        `).join('')}
      </div>

      <div class="grid-6-4">
        ${card({ title: 'Jobs by Role', subtitle: 'Total listings', body: canvasWrap('rolesBarChart', 320) })}
        ${card({ title: 'YoY Growth by Role', body: canvasWrap('growthBarChart', 320) })}
      </div>

      ${card({
        title: 'Role Details',
        body: `
          <div class="table-wrap">
            <table>
              <thead><tr><th>Role</th><th>Openings</th><th>Avg Salary</th><th>Top Skills</th><th>Experience</th><th>Remote %</th><th>Growth</th></tr></thead>
              <tbody>${tableRows}</tbody>
            </table>
          </div>
        `
      })}

      ${sectionLabel('Role Profiles')}
      <div class="grid-3">
        ${ROLES.map(r => `
          <div class="card animate-in" style="border-top:3px solid ${r.color}">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <div style="width:40px;height:40px;border-radius:10px;background:${r.color}20;display:flex;align-items:center;justify-content:center;font-size:20px">${r.icon}</div>
              <div>
                <div style="font-weight:500;color:var(--text)">${r.role}</div>
                <div style="font-size:11.5px;color:var(--text3)">${r.exp} experience</div>
              </div>
            </div>
            <div style="font-size:12.5px;color:var(--text2);line-height:1.6;margin-bottom:12px">${r.description}</div>
            <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px">
              ${r.topSkills.map(s => `<span class="tag" style="background:${r.color}15;color:${r.color};font-size:11px;padding:3px 9px">${s}</span>`).join('')}
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text3);border-top:1px solid var(--border2);padding-top:10px">
              <span>💰 $${Math.round(r.entryS / 1000)}K–$${Math.round(r.seniorS / 1000)}K</span>
              <span>🌐 ${r.remote}% remote</span>
              <span style="color:var(--green)">+${r.growth}%</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  destroyChart('rolesBarChart');
  makeBarChart('rolesBarChart', {
    labels: ROLES.map(r => r.role),
    datasets: [{ label: 'Openings', data: ROLES.map(r => r.count), backgroundColor: ROLES.map(r => r.color + 'cc') }],
  });

  destroyChart('growthBarChart');
  makeBarChart('growthBarChart', {
    labels: ROLES.map(r => r.role),
    datasets: [{ label: 'YoY %', data: ROLES.map(r => r.growth), backgroundColor: ROLES.map(r => r.growth > 50 ? '#ff6b6bcc' : r.growth > 20 ? '#ffd166cc' : '#06d6a0cc') }],
    horizontal: true,
    yCallback: v => v + '%',
  });
}
