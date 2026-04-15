// ============================================================
// pages/SkillGap.js  —  Interactive Skill Gap Analyzer
// ============================================================

import { SKILL_GAP_ROLES } from '../data/jobMarketData.js';
import { pageHeader, card, sectionLabel } from '../utils/ui.js';
import { makeRadar, canvasWrap, destroyChart } from '../utils/charts.js';
import { state } from '../app.js';

const RADAR_DOMAINS   = ['AI/ML', 'Cloud', 'Data', 'Web Dev', 'DevOps', 'Statistics'];
const ROLE_RADAR      = {
  mle:    [90,65,75,20,55,80],
  ds:     [80,40,90,25,35,95],
  ai:     [95,70,50,35,60,65],
  da:     [45,35,85,35,30,75],
  de:     [50,80,90,25,70,40],
  fs:     [15,45,40,90,50,20],
  mlops:  [60,85,50,25,90,40],
  devops: [25,90,35,20,95,20],
};
const USER_RADAR      = [20, 30, 15, 45, 30, 10];
const ALL_SKILLS      = ['Python','SQL','Docker','React','Node.js','Git','CSS','TypeScript',
                         'AWS','TensorFlow','PyTorch','Pandas','Scikit-learn','Kubernetes',
                         'Apache Spark','Airflow','Kafka','Statistics','R','A/B Testing',
                         'Machine Learning','NLP','LangChain','RAG','Vector DB','FastAPI',
                         'MLflow','Power BI','Tableau','Excel','dbt','Hadoop','Scala',
                         'Terraform','CI/CD','Linux','Monitoring','Bash','Helm','Ansible',
                         'OpenAI API','Prompt Eng','MLOps','DAX','ETL','Data Storytelling'];

function saveSkills(skills) {
  state.userSkills = skills;
  localStorage.setItem('joblens-skills', JSON.stringify(skills));
}

function computeGap(roleId) {
  const req  = SKILL_GAP_ROLES[roleId].required;
  const have = req.filter(s => state.userSkills.includes(s));
  const need = req.filter(s => !state.userSkills.includes(s));
  const pct  = Math.round(have.length / req.length * 100);
  return { have, need, pct, req };
}

function updateGapDisplay(roleId) {
  const { have, need, pct } = computeGap(roleId);
  const haveEl = document.getElementById('have-skills');
  const needEl = document.getElementById('need-skills');
  const barEl  = document.getElementById('match-bar');
  const pctEl  = document.getElementById('match-pct');
  if (haveEl) haveEl.innerHTML = have.map(s => `<span class="gap-skill have">${s}</span>`).join('') || '<span style="color:var(--text3);font-size:12px">None matched yet</span>';
  if (needEl) needEl.innerHTML = need.map(s => `<span class="gap-skill need">${s}</span>`).join('');
  if (barEl)  barEl.style.width = pct + '%';
  if (pctEl)  { pctEl.textContent = pct + '%'; pctEl.style.color = pct >= 70 ? 'var(--green)' : pct >= 40 ? 'var(--yellow)' : 'var(--red)'; }

  destroyChart('gapRadar');
  makeRadar('gapRadar', {
    labels: RADAR_DOMAINS,
    datasets: [
      { label: 'Your Profile',    data: USER_RADAR,          borderColor: '#06d6a0', backgroundColor: 'rgba(6,214,160,0.12)', pointBackgroundColor: '#06d6a0' },
      { label: SKILL_GAP_ROLES[roleId].name, data: ROLE_RADAR[roleId], borderColor: '#6c63ff', backgroundColor: 'rgba(108,99,255,0.10)', pointBackgroundColor: '#6c63ff' },
    ],
  });
}

function renderMySkillsWrap() {
  const el = document.getElementById('my-skills-list');
  if (!el) return;
  el.innerHTML = state.userSkills.map(s => `
    <span class="gap-skill have" style="cursor:pointer;position:relative" data-remove="${s}">
      ${s} <span style="margin-left:4px;opacity:0.6">×</span>
    </span>
  `).join('');
}

function renderSkillPicker() {
  const el = document.getElementById('skill-picker');
  if (!el) return;
  const remaining = ALL_SKILLS.filter(s => !state.userSkills.includes(s));
  el.innerHTML = remaining.map(s => `
    <span class="tag skill-tag" style="background:var(--bg3);color:var(--text2);border:1px solid var(--border);font-size:12px;padding:4px 10px;cursor:pointer" data-add="${s}">${s}</span>
  `).join('');
}

export function renderSkillGap(container) {
  let selectedRole = 'mle';

  const roleOptions = Object.entries(SKILL_GAP_ROLES).map(([id, r]) =>
    `<option value="${id}">${r.name}</option>`
  ).join('');

  container.innerHTML = `
    ${pageHeader({ title: 'Skill Gap', em: 'Analyzer', subtitle: 'Compare your skills against any target role' })}

    <div class="page-content">
      ${sectionLabel('Your Profile')}

      <div class="grid-6-4">
        <div style="display:flex;flex-direction:column;gap:16px">
          ${card({
            title: 'Your Current Skills',
            subtitle: 'Click × to remove',
            body: `
              <div class="gap-skills" id="my-skills-list" style="margin-bottom:14px"></div>
              <div style="font-size:11px;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">Add a skill</div>
              <div class="gap-skills" id="skill-picker" style="max-height:130px;overflow-y:auto"></div>
            `,
          })}

          ${card({
            title: 'Target Role',
            body: `
              <select id="role-select" style="margin-bottom:16px">${roleOptions}</select>

              <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Skills You Have ✓</div>
              <div class="gap-skills" id="have-skills" style="margin-bottom:14px"></div>

              <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Skills to Learn →</div>
              <div class="gap-skills" id="need-skills" style="margin-bottom:16px"></div>

              <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Match Score</div>
              <div style="display:flex;align-items:center;gap:14px">
                <div style="flex:1;height:8px;background:var(--bg3);border-radius:4px;overflow:hidden">
                  <div id="match-bar" style="height:100%;background:linear-gradient(90deg,var(--accent),var(--green));border-radius:4px;transition:width 0.8s var(--ease);width:0%"></div>
                </div>
                <div id="match-pct" style="font-family:var(--font-head);font-weight:800;font-size:26px;min-width:60px;text-align:right">0%</div>
              </div>
            `,
          })}
        </div>

        ${card({ title: 'Skill Radar', subtitle: 'Your profile vs role', body: canvasWrap('gapRadar', 340) })}
      </div>

      ${sectionLabel('Recommended Learning Paths')}
      <div class="grid-3" id="learning-paths">
        ${Object.entries(SKILL_GAP_ROLES).map(([id, r]) => {
          const { pct } = computeGap(id);
          const col = pct >= 70 ? 'var(--green)' : pct >= 40 ? 'var(--yellow)' : 'var(--red)';
          return `
            <div class="card animate-in" style="cursor:pointer;border-color:${pct >= 70 ? 'rgba(6,214,160,0.2)' : 'var(--border)'}" data-pick-role="${id}">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <div style="font-weight:500;color:var(--text)">${r.name}</div>
                <div style="font-family:var(--font-head);font-weight:800;font-size:20px;color:${col}">${pct}%</div>
              </div>
              <div style="height:4px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-bottom:10px">
                <div style="width:${pct}%;height:100%;background:${col};border-radius:2px"></div>
              </div>
              <div style="font-size:11.5px;color:var(--text3)">${r.required.length - Math.round(pct / 100 * r.required.length)} skills to learn</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  renderMySkillsWrap();
  renderSkillPicker();
  updateGapDisplay(selectedRole);

  // Role select change
  document.getElementById('role-select').addEventListener('change', e => {
    selectedRole = e.target.value;
    updateGapDisplay(selectedRole);
  });

  // Remove skill
  document.getElementById('my-skills-list').addEventListener('click', e => {
    const skill = e.target.closest('[data-remove]')?.dataset.remove;
    if (!skill) return;
    saveSkills(state.userSkills.filter(s => s !== skill));
    renderMySkillsWrap();
    renderSkillPicker();
    updateGapDisplay(selectedRole);
    refreshPathCards();
  });

  // Add skill
  document.getElementById('skill-picker').addEventListener('click', e => {
    const skill = e.target.closest('[data-add]')?.dataset.add;
    if (!skill) return;
    saveSkills([...state.userSkills, skill]);
    renderMySkillsWrap();
    renderSkillPicker();
    updateGapDisplay(selectedRole);
    refreshPathCards();
  });

  // Quick role pick from path cards
  document.getElementById('learning-paths').addEventListener('click', e => {
    const roleId = e.target.closest('[data-pick-role]')?.dataset.pickRole;
    if (!roleId) return;
    selectedRole = roleId;
    document.getElementById('role-select').value = roleId;
    updateGapDisplay(roleId);
  });

  function refreshPathCards() {
    document.querySelectorAll('[data-pick-role]').forEach(el => {
      const id = el.dataset.pickRole;
      const { pct } = computeGap(id);
      const col = pct >= 70 ? 'var(--green)' : pct >= 40 ? 'var(--yellow)' : 'var(--red)';
      el.querySelector('[style*="font-head"]').textContent = pct + '%';
      el.querySelector('[style*="font-head"]').style.color = col;
      const bar = el.querySelector('[style*="height:4px"] > div');
      if (bar) { bar.style.width = pct + '%'; bar.style.background = col; }
      const lastLine = el.querySelectorAll('[style*="font-size:11.5px"]')[0];
      if (lastLine) lastLine.textContent = (SKILL_GAP_ROLES[id].required.length - Math.round(pct / 100 * SKILL_GAP_ROLES[id].required.length)) + ' skills to learn';
    });
  }
}
