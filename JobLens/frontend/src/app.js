// ============================================================
// src/app.js  —  App Shell + Router
// ============================================================

import { renderDashboard }  from './pages/Dashboard.js';
import { renderSkills }     from './pages/Skills.js';
import { renderRoles }      from './pages/Roles.js';
import { renderSalary }     from './pages/Salary.js';
import { renderGeo }        from './pages/Geography.js';
import { renderSkillGap }   from './pages/SkillGap.js';
import { renderInsights }   from './pages/Insights.js';

// ── State ──────────────────────────────────────────────────
export const state = {
  currentPage: 'dashboard',
  theme: localStorage.getItem('joblens-theme') || 'dark',
  userSkills: JSON.parse(localStorage.getItem('joblens-skills') || '["Python","SQL","Docker","React","Git","CSS"]'),
  filters: { category: 'all', role: 'all', location: 'all' },
};

// ── Nav config ────────────────────────────────────────────
const NAV_ITEMS = [
  { group: 'Overview', items: [
    { id: 'dashboard', label: 'Dashboard',      icon: '▦', badge: null },
  ]},
  { group: 'Analytics', items: [
    { id: 'skills',    label: 'Skills Analysis', icon: '◈', badge: null },
    { id: 'roles',     label: 'Job Roles',       icon: '◎', badge: null },
    { id: 'salary',    label: 'Salary Trends',   icon: '＄', badge: null },
    { id: 'geo',       label: 'Geography',       icon: '⊕', badge: null },
  ]},
  { group: 'Tools', items: [
    { id: 'gap',       label: 'Skill Gap',       icon: '△', badge: 'NEW' },
    { id: 'insights',  label: 'AI Insights',     icon: '✦', badge: null },
  ]},
];

const PAGE_RENDERERS = {
  dashboard: renderDashboard,
  skills:    renderSkills,
  roles:     renderRoles,
  salary:    renderSalary,
  geo:       renderGeo,
  gap:       renderSkillGap,
  insights:  renderInsights,
};

// ── Sidebar HTML ──────────────────────────────────────────
function buildSidebar() {
  const navHtml = NAV_ITEMS.map(group => `
    <div class="nav-section">
      <div class="nav-section-label">${group.group}</div>
      ${group.items.map(item => `
        <div class="nav-item ${state.currentPage === item.id ? 'active' : ''}"
             data-page="${item.id}" role="button" tabindex="0">
          <div class="nav-icon">${item.icon}</div>
          <span>${item.label}</span>
          ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
        </div>
      `).join('')}
    </div>
  `).join('');

  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <span>Job<span class="logo-dot">Lens</span></span>
        <span class="logo-badge">v2.0</span>
      </div>
      ${navHtml}
      <div class="sidebar-footer">
        <div class="theme-toggle" id="theme-toggle">
          <span>${state.theme === 'dark' ? '☀️' : '🌙'}</span>
          <span>${state.theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </div>
        <div style="font-size:11px;color:var(--text3);text-align:center;padding:4px 0">
          12,847 jobs · March 2025
        </div>
      </div>
    </aside>
  `;
}

// ── Navigate ──────────────────────────────────────────────
export function navigate(pageId) {
  if (!PAGE_RENDERERS[pageId]) return;
  state.currentPage = pageId;

  // Update sidebar active states
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId);
  });

  // Render page
  const main = document.getElementById('main-content');
  if (main) {
    main.innerHTML = '';
    PAGE_RENDERERS[pageId](main);
  }
}

// ── Theme ─────────────────────────────────────────────────
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('joblens-theme', state.theme);
  document.documentElement.setAttribute('data-theme', state.theme === 'light' ? 'light' : '');
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = `<span>${state.theme === 'dark' ? '☀️' : '🌙'}</span><span>${state.theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>`;
}

// ── Mount ─────────────────────────────────────────────────
export function renderApp() {
  // Apply saved theme
  if (state.theme === 'light') document.documentElement.setAttribute('data-theme', 'light');

  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="app-shell">
      ${buildSidebar()}
      <div class="main-content" id="main-content"></div>
    </div>
  `;

  // Nav click delegation
  document.getElementById('sidebar').addEventListener('click', e => {
    const item = e.target.closest('[data-page]');
    if (item) navigate(item.dataset.page);
    const toggle = e.target.closest('#theme-toggle');
    if (toggle) toggleTheme();
  });

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (e.target.closest('[data-page]') && (e.key === 'Enter' || e.key === ' ')) {
      navigate(e.target.closest('[data-page]').dataset.page);
    }
  });

  // Initial render
  navigate('dashboard');
}
