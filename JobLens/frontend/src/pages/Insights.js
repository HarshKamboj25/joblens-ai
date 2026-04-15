// ============================================================
// pages/Insights.js
// ============================================================

import { INSIGHTS, FORECAST } from '../data/jobMarketData.js';
import { pageHeader, card, sectionLabel } from '../utils/ui.js';
import { makeLineChart, canvasWrap, destroyChart } from '../utils/charts.js';

export function renderInsights(container) {
  container.innerHTML = `
    ${pageHeader({ title: 'AI', em: 'Insights', subtitle: 'Intelligent analysis of market signals and emerging trends' })}

    <div class="page-content">
      ${sectionLabel('Market Intelligence')}

      <div class="grid-3">
        ${INSIGHTS.map((ins, i) => `
          <div class="insight-card animate-in delay-${(i % 4) + 1}">
            <div style="font-size:13px;font-weight:500;color:var(--text2);margin-bottom:6px">${ins.emoji} ${ins.title}</div>
            <div class="insight-hero ${ins.heroBig ? '' : 'sm'}">${ins.hero}</div>
            <div style="font-size:13px;color:var(--text2);line-height:1.7;margin-bottom:12px">${ins.body}</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${ins.tags.map(t => `
                <span class="tag" style="background:${t.color}18;color:${t.color};border:1px solid ${t.color}30">${t.label}</span>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      ${card({ title: 'Technology Adoption Forecast', subtitle: 'Actuals + 6-month projection', body: canvasWrap('forecastChart', 280) })}

      ${sectionLabel('Key Takeaways')}
      <div class="grid-3">
        ${[
          { title: 'For Students', icon: '🎓', points: ['Start with Python + SQL — they appear in 80%+ of postings','Add one cloud provider (AWS preferred)', 'Build 2–3 real projects with actual data', 'Learn Git/Docker early — expected baseline by employers'] },
          { title: 'For Career Switchers', icon: '🔄', points: ['Data Analyst → AI Engineer is the hottest transition', 'LangChain + RAG skills bridge the gap', 'Expect 6–12 months of dedicated learning', 'Portfolio with LLM-powered apps stands out'] },
          { title: 'For Mid-Career Pros', icon: '📈', points: ['Kubernetes + AWS adds $28K+ salary premium', 'MLOps is undersupplied — strong opportunity', 'Avoid over-investing in declining tools (SAS, MATLAB)', 'Cloud certifications (AWS SAA, GCP Pro) pay off'] },
        ].map(s => `
          <div class="card animate-in">
            <div style="font-size:22px;margin-bottom:8px">${s.icon}</div>
            <div style="font-weight:500;color:var(--text);margin-bottom:12px">${s.title}</div>
            <ul style="list-style:none;display:flex;flex-direction:column;gap:8px">
              ${s.points.map(p => `
                <li style="display:flex;gap:8px;font-size:13px;color:var(--text2);line-height:1.5">
                  <span style="color:var(--accent);flex-shrink:0;margin-top:2px">→</span>
                  ${p}
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  destroyChart('forecastChart');
  const colors = FORECAST.series.map(s => s.color);
  const actualEnd = FORECAST.actual_end;

  makeLineChart('forecastChart', {
    labels: FORECAST.labels,
    datasets: [
      ...FORECAST.series.map((s, i) => ({
        label: s.name,
        data: s.data.slice(0, actualEnd + 1).concat(new Array(FORECAST.labels.length - actualEnd - 1).fill(null)),
        borderColor: s.color,
        fill: false,
        pointRadius: 3,
        borderWidth: 2,
      })),
      ...FORECAST.series.map((s, i) => ({
        label: s.name + ' (forecast)',
        data: new Array(actualEnd).fill(null).concat(s.data.slice(actualEnd)),
        borderColor: s.color,
        borderDash: [6, 4],
        fill: false,
        pointRadius: 3,
        borderWidth: 2,
        pointStyle: 'triangle',
      })),
    ],
    yCallback: v => v + '%',
  });

  // Hide forecast entries from legend (they duplicate the actual series)
  setTimeout(() => {
    const chart = document.getElementById('forecastChart')?._chartInstance;
    if (chart) {
      chart.data.datasets.forEach((ds, i) => {
        if (ds.label.includes('forecast')) chart.setDatasetVisibility(i, false);
      });
      chart.update();
    }
  }, 300);
}
