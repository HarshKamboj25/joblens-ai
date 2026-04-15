// ============================================================
// pages/Geography.js
// ============================================================

import { GEO } from '../data/jobMarketData.js';
import { pageHeader, card, sectionLabel, geoItem } from '../utils/ui.js';
import { makeBarChart, canvasWrap, destroyChart } from '../utils/charts.js';

export function renderGeo(container) {
  container.innerHTML = `
    ${pageHeader({ title: 'Geographic', em: 'Trends', subtitle: 'Hiring hotspots for tech roles worldwide' })}
    <div class="page-content">
      <div class="grid-4">
        ${GEO.slice(0, 4).map(g => `
          <div class="metric-card animate-in">
            <div class="metric-label">${g.city} · ${g.country}</div>
            <div class="metric-value" style="color:${g.color};font-size:26px">${g.count.toLocaleString()}</div>
            <div class="metric-delta delta-neu">Top: ${g.topRole}</div>
          </div>
        `).join('')}
      </div>

      ${card({ title: 'Top Hiring Cities', subtitle: 'Job count', body: canvasWrap('geoBarChart', 300), extraClass: 'span-2' })}

      <div class="grid-6-4">
        ${card({
          title: 'City Breakdown',
          body: GEO.map(geoItem).join(''),
        })}
        ${card({
          title: 'City Details',
          body: `
            <div class="table-wrap">
              <table>
                <thead><tr><th>City</th><th>Country</th><th>Jobs</th><th>Top Role</th><th>Avg Salary</th></tr></thead>
                <tbody>
                  ${GEO.map(g => `
                    <tr>
                      <td><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${g.color};margin-right:8px"></span>${g.city}</td>
                      <td>${g.country}</td>
                      <td>${g.count.toLocaleString()}</td>
                      <td style="color:${g.color}">${g.topRole}</td>
                      <td style="color:var(--green)">$${Math.round(g.avgSalary / 1000)}K</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `,
        })}
      </div>
    </div>
  `;

  destroyChart('geoBarChart');
  makeBarChart('geoBarChart', {
    labels: GEO.map(g => g.city),
    datasets: [{ label: 'Job Listings', data: GEO.map(g => g.count), backgroundColor: GEO.map(g => g.color + 'cc') }],
  });
}
