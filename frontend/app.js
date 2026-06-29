/**
 * TaskFlow — app.js
 * Handles login + dashboard rendering via a single Axios call to GET /api/dashboard
 */

const API_BASE = 'http://127.0.0.1:5000/api';

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const $ = id => document.getElementById(id);
const token = () => localStorage.getItem('token');
const user  = () => {
  try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; }
};

function setToken(t, u) {
  localStorage.setItem('token', t);
  localStorage.setItem('user', JSON.stringify(u));
}
function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function showPage(name) {
  $('login-page').classList.toggle('hidden', name !== 'login');
  $('dashboard-page').classList.toggle('hidden', name !== 'dashboard');
}

// ──────────────────────────────────────────────
// Password toggle
// ──────────────────────────────────────────────
$('toggle-password').addEventListener('click', () => {
  const inp = $('login-password');
  inp.type = inp.type === 'password' ? 'text' : 'password';
});

// ──────────────────────────────────────────────
// Sidebar toggle (mobile)
// ──────────────────────────────────────────────
$('sidebar-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// ──────────────────────────────────────────────
// Date display
// ──────────────────────────────────────────────
function setDate() {
  $('topbar-date').textContent = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

// ──────────────────────────────────────────────
// Greeting
// ──────────────────────────────────────────────
function setGreeting() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  const name = user().name || user().email?.split('@')[0] || 'vous';
  $('dashboard-greeting').textContent = `${greet}, ${name} 👋`;
}

// ──────────────────────────────────────────────
// Login
// ──────────────────────────────────────────────
$('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = $('login-submit-btn');
  const errEl = $('login-error');
  errEl.textContent = '';
  btn.classList.add('loading');
  btn.disabled = true;

  const email    = $('login-email').value.trim();
  const password = $('login-password').value;

  try {
    const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
    setToken(data.token, data.user || { email });
    showPage('dashboard');
    initDashboard();
  } catch (err) {
    const msg = err.response?.data?.message || 'Identifiants incorrects.';
    errEl.textContent = msg;
  } finally {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
});

// ──────────────────────────────────────────────
// Logout
// ──────────────────────────────────────────────
$('logout-btn').addEventListener('click', () => {
  clearSession();
  showPage('login');
  $('login-form').reset();
  $('login-error').textContent = '';
});

// ──────────────────────────────────────────────
// Refresh button
// ──────────────────────────────────────────────
$('refresh-btn').addEventListener('click', () => {
  const btn = $('refresh-btn');
  btn.classList.add('spinning');
  loadDashboard().finally(() => {
    setTimeout(() => btn.classList.remove('spinning'), 600);
  });
});

$('retry-btn').addEventListener('click', loadDashboard);

// ──────────────────────────────────────────────
// Dashboard init
// ──────────────────────────────────────────────
function initDashboard() {
  setDate();
  setGreeting();

  // Populate sidebar user info
  const u = user();
  const name = u.name || u.email?.split('@')[0] || 'U';
  $('sidebar-username').textContent = name;
  $('sidebar-avatar').textContent   = name.charAt(0).toUpperCase();

  loadDashboard();
}

// ──────────────────────────────────────────────
// Single Axios call — GET /api/dashboard
// ──────────────────────────────────────────────
async function loadDashboard() {
  // Show loading
  $('dashboard-loading').classList.remove('hidden');
  $('dashboard-error').classList.add('hidden');
  $('dashboard-content').classList.add('hidden');

  try {
    const { data } = await axios.get(`${API_BASE}/dashboard`, {
      headers: { Authorization: `Bearer ${token()}` }
    });

    renderMetrics(data);
    renderProgress(data);
    renderTasksInProgress(data.tasksInProgress || []);

    $('dashboard-content').classList.remove('hidden');
  } catch (err) {
    $('dashboard-error').classList.remove('hidden');
    const msg = err.response?.data?.message || err.message || 'Erreur inconnue.';
    $('dashboard-error-msg').textContent = msg;

    // If 401, send back to login
    if (err.response?.status === 401) {
      clearSession();
      showPage('login');
    }
  } finally {
    $('dashboard-loading').classList.add('hidden');
  }
}

// ──────────────────────────────────────────────
// Render: metric cards
// ──────────────────────────────────────────────
function renderMetrics({ activeProjects, assignedTasks, completedTasks, overdueTasks }) {
  animateCount('metric-active-projects',  activeProjects  || 0);
  animateCount('metric-assigned-tasks',   assignedTasks   || 0);
  animateCount('metric-completed-tasks',  completedTasks  || 0);
  animateCount('metric-overdue-tasks',    overdueTasks    || 0);
}

function animateCount(elId, target) {
  const el = $(elId);
  const duration = 800;
  const start = performance.now();
  const from = parseInt(el.textContent) || 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.round(from + (target - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ──────────────────────────────────────────────
// Render: progress bar
// ──────────────────────────────────────────────
function renderProgress({ assignedTasks, completedTasks }) {
  const total = assignedTasks || 0;
  const done  = completedTasks || 0;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  $('progress-fill').style.width = pct + '%';
  $('progress-percent').textContent = pct + '%';
  $('progress-track-aria').setAttribute('aria-valuenow', pct);
  $('progress-label-done').textContent  = `${done} terminée${done !== 1 ? 's' : ''}`;
  $('progress-label-total').textContent = `sur ${total} assignée${total !== 1 ? 's' : ''}`;
}

// ──────────────────────────────────────────────
// Render: tasks in progress
// ──────────────────────────────────────────────
function renderTasksInProgress(tasks) {
  const list  = $('tasks-list');
  const empty = $('tasks-empty');
  const badge = $('tasks-in-progress-count');

  badge.textContent = tasks.length;
  list.innerHTML = '';

  if (!tasks.length) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  const priorityLabel = { haute: 'Haute', moyenne: 'Moyenne', basse: 'Basse' };

  tasks.forEach((task, i) => {
    const priority = (task.priority || 'basse').toLowerCase();
    const deadline = task.deadline ? new Date(task.deadline) : null;
    const isOverdue = deadline && deadline < new Date();

    const card = document.createElement('div');
    card.className = `task-card priority-${priority}`;
    card.style.animationDelay = `${i * 0.06}s`;

    card.innerHTML = `
      <div class="task-priority-badge"></div>
      <div class="task-main">
        <div class="task-name">${escapeHtml(task.title || task.name || 'Tâche sans titre')}</div>
        <div class="task-meta">
          <span class="task-priority-label">${priorityLabel[priority] || priority}</span>
          ${deadline ? `
            <span class="task-deadline ${isOverdue ? 'overdue' : ''}">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${isOverdue ? 'En retard — ' : ''}${formatDate(deadline)}
            </span>` : ''}
        </div>
      </div>
      <span class="task-status-chip">En cours</span>
    `;
    list.appendChild(card);
  });
}

// ──────────────────────────────────────────────
// Utilities
// ──────────────────────────────────────────────
function formatDate(date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ──────────────────────────────────────────────
// Boot — decide which page to show
// ──────────────────────────────────────────────
(function boot() {
  if (token()) {
    showPage('dashboard');
    initDashboard();
  } else {
    showPage('login');
  }
})();
