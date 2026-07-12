// app.js - Shell layout, Routing, Session Management, and Global UI Interactions

// Global state
let currentUser = null;
let currentRoute = 'dashboard';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme from storage
  initTheme();
  
  // Check if session exists
  const storedUser = localStorage.getItem('assetflow_session');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    renderAppShell();
  } else {
    // Show login page
    renderAuthPage();
  }
});

// Theme Management
function initTheme() {
  const theme = localStorage.getItem('assetflow_theme') || 'light'; // default to light for Notion-like clean start
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('assetflow_theme', newTheme);
  
  // Update toggle button icon
  const icon = document.getElementById('theme-toggle-icon');
  if (icon) {
    icon.setAttribute('data-lucide', newTheme === 'light' ? 'moon' : 'sun');
  }
  if (window.lucide) {
    window.lucide.createIcons();
  }
  showToast(`Theme switched to ${newTheme} mode`, 'info');
}

// Presence status mapped to user roles (MS Teams styling)
function getPresenceClass(role) {
  switch (role) {
    case 'Admin':
      return 'busy';       // Red status
    case 'Asset Manager':
      return 'online';     // Green status
    case 'Department Head':
      return 'away';       // Yellow status
    case 'Employee':
    default:
      return 'online';     // Green status
  }
}

function getPresenceLabel(role) {
  switch (role) {
    case 'Admin': return 'Busy';
    case 'Asset Manager': return 'Available';
    case 'Department Head': return 'Away';
    default: return 'Available';
  }
}

// Auth view
function renderAuthPage() {
  currentRoute = 'login';
  const root = document.getElementById('app-root');
  root.innerHTML = `
    <div class="auth-container">
      <div class="auth-card" id="auth-card-body">
        <!-- Injected Login or Signup -->
      </div>
    </div>
  `;
  renderLoginSignup();
}

// Log in function
function loginUser(email, password) {
  const users = AssetFlowDB.getAll('users');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (user) {
    if (user.status === 'Inactive') {
      showToast('Account is deactivated. Please contact your administrator.', 'danger');
      return false;
    }
    currentUser = user;
    localStorage.setItem('assetflow_session', JSON.stringify(user));
    showToast(`Welcome back, ${user.name}!`, 'success');
    AssetFlowDB.log(user.id, user.name, 'User Logged In', 'Successfully logged in');
    renderAppShell();
    return true;
  } else {
    showToast('Invalid email or password', 'danger');
    return false;
  }
}

// Sign up function
function signupUser(name, email, password) {
  const users = AssetFlowDB.getAll('users');
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    showToast('Email already registered', 'danger');
    return false;
  }
  
  // Default role: Employee (no role selection at signup as per features)
  const newUser = AssetFlowDB.insert('users', {
    name,
    email,
    password,
    role: 'Employee',
    departmentId: null,
    status: 'Active'
  });
  
  showToast('Account created successfully! Please log in.', 'success');
  AssetFlowDB.log(newUser.id, newUser.name, 'User Registered', 'Created employee account');
  
  // Notify admins
  const admins = users.filter(u => u.role === 'Admin');
  admins.forEach(admin => {
    AssetFlowDB.notify(admin.id, 'New Registration', `${name} signed up as an employee.`, 'info');
  });

  return true;
}

// Logout function
function logoutUser() {
  if (currentUser) {
    AssetFlowDB.log(currentUser.id, currentUser.name, 'User Logged Out', 'Successfully logged out');
  }
  currentUser = null;
  localStorage.removeItem('assetflow_session');
  renderAuthPage();
  showToast('Logged out successfully', 'info');
}

// Render the application wrapper shell
function renderAppShell() {
  const root = document.getElementById('app-root');
  
  // Generate sidebar items based on role
  const sidebarItems = getSidebarNavigation();
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const themeIcon = currentTheme === 'light' ? 'moon' : 'sun';
  
  root.innerHTML = `
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo-container">
        <div class="logo-icon">AF</div>
        <span class="logo-text">AssetFlow</span>
      </div>
      <ul class="nav-menu">
        ${sidebarItems}
      </ul>
      <div class="sidebar-footer">
        <div class="user-profile-widget">
          <div class="user-avatar-wrapper">
            <div class="user-avatar">${getInitials(currentUser.name)}</div>
            <span class="presence-dot ${getPresenceClass(currentUser.role)}" title="${getPresenceLabel(currentUser.role)}"></span>
          </div>
          <div class="user-details">
            <span class="user-name-label">${currentUser.name}</span>
            <span class="user-role-label">${currentUser.role}</span>
          </div>
        </div>
        <a class="nav-item" onclick="logoutUser()" style="border-top: 1px solid var(--border-color); margin-top: 0.25rem;">
          <i data-lucide="log-out"></i>
          <span>Sign Out</span>
        </a>
      </div>
    </aside>
    
    <!-- Main Panel -->
    <main class="main-content">
      <header class="top-header">
        <div class="header-title-container">
          <h1 id="header-page-title">Dashboard</h1>
        </div>
        <div class="header-actions">
          <!-- Dev Role Switcher -->
          <div class="dev-switcher">
            <span>Dev Mode:</span>
            <select id="dev-role-select" onchange="devSwitchUser(this.value)">
              <option value="">-- Switch User/Role --</option>
              <option value="usr-1" ${currentUser.id === 'usr-1' ? 'selected' : ''}>System Admin</option>
              <option value="usr-2" ${currentUser.id === 'usr-2' ? 'selected' : ''}>Asset Manager</option>
              <option value="usr-3" ${currentUser.id === 'usr-3' ? 'selected' : ''}>Department Head</option>
              <option value="usr-4" ${currentUser.id === 'usr-4' ? 'selected' : ''}>Employee (Priya)</option>
              <option value="usr-5" ${currentUser.id === 'usr-5' ? 'selected' : ''}>Employee (Raj)</option>
            </select>
          </div>
          
          <!-- Theme Switcher -->
          <button class="icon-btn" onclick="toggleTheme()" title="Toggle Theme">
            <i data-lucide="${themeIcon}" id="theme-toggle-icon"></i>
          </button>
          
          <!-- Notifications Bell -->
          <button class="icon-btn" onclick="toggleNotifications(true)">
            <i data-lucide="bell"></i>
            ${getUnreadNotificationCount() > 0 ? '<span class="badge-dot" id="ntf-bell-dot"></span>' : ''}
          </button>
        </div>
      </header>
      
      <!-- Content Area -->
      <div class="page-container" id="page-container">
        <!-- Rendered Screen -->
      </div>
    </main>
  `;
  
  // Navigate to current or default route
  if (currentRoute === 'login' || currentRoute === 'signup') {
    currentRoute = 'dashboard';
  }
  navigateTo(currentRoute);
}

// Role-based navigation items builder
function getSidebarNavigation() {
  const role = currentUser.role;
  let html = `
    <li><a class="nav-item ${currentRoute === 'dashboard' ? 'active' : ''}" onclick="navigateTo('dashboard')"><i data-lucide="layout-dashboard"></i><span>Dashboard</span></a></li>
    <li><a class="nav-item ${currentRoute === 'directory' ? 'active' : ''}" onclick="navigateTo('directory')"><i data-lucide="folder-search"></i><span>Asset Directory</span></a></li>
    <li><a class="nav-item ${currentRoute === 'booking' ? 'active' : ''}" onclick="navigateTo('booking')"><i data-lucide="calendar"></i><span>Resource Booking</span></a></li>
    <li><a class="nav-item ${currentRoute === 'maintenance' ? 'active' : ''}" onclick="navigateTo('maintenance')"><i data-lucide="wrench"></i><span>Maintenance</span></a></li>
  `;

  // Department Head & Higher
  if (role !== 'Employee') {
    html += `
      <li><a class="nav-item ${currentRoute === 'allocation' ? 'active' : ''}" onclick="navigateTo('allocation')"><i data-lucide="shuffle"></i><span>Allocations & Transfers</span></a></li>
    `;
  }
  
  // Manager & Admin
  if (role === 'Admin' || role === 'Asset Manager') {
    html += `
      <div class="nav-section-title">Operations</div>
      <li><a class="nav-item ${currentRoute === 'audit' ? 'active' : ''}" onclick="navigateTo('audit')"><i data-lucide="clipboard-check"></i><span>Asset Audits</span></a></li>
      <li><a class="nav-item ${currentRoute === 'reports' ? 'active' : ''}" onclick="navigateTo('reports')"><i data-lucide="bar-chart-3"></i><span>Reports & Analytics</span></a></li>
    `;
  }

  // Admin only
  if (role === 'Admin') {
    html += `
      <div class="nav-section-title">Settings</div>
      <li><a class="nav-item ${currentRoute === 'setup' ? 'active' : ''}" onclick="navigateTo('setup')"><i data-lucide="settings"></i><span>Organization Setup</span></a></li>
    `;
  }

  html += `
    <div class="nav-section-title">Security</div>
    <li><a class="nav-item ${currentRoute === 'logs' ? 'active' : ''}" onclick="navigateTo('logs')"><i data-lucide="scroll"></i><span>Activity Logs</span></a></li>
  `;

  return html;
}

// Router navigate
function navigateTo(route) {
  currentRoute = route;
  
  // Update Header Title
  const pageTitle = document.getElementById('header-page-title');
  if (pageTitle) {
    pageTitle.textContent = formatRouteTitle(route);
  }
  
  // Highlight active sidebar item
  const navItems = document.querySelectorAll('.nav-menu .nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    const onclickStr = item.getAttribute('onclick') || '';
    if (onclickStr.includes(`'${route}'`)) {
      item.classList.add('active');
    }
  });
  
  // Render target screen
  const container = document.getElementById('page-container');
  if (!container) return;
  
  container.classList.add('fade-out');
  
  setTimeout(() => {
    // Skeleton Loader
    container.innerHTML = `
      <div style="padding:2rem;">
        <div class="skeleton" style="width:40%; height:2.5rem; margin-bottom:1.5rem;"></div>
        <div class="skeleton" style="width:100%; height:8rem; margin-bottom:1rem;"></div>
        <div class="skeleton" style="width:100%; height:8rem; margin-bottom:1rem;"></div>
        <div class="skeleton" style="width:60%; height:8rem; margin-bottom:1rem;"></div>
      </div>
    `;
    container.classList.remove('fade-out');
    container.classList.add('fade-in');
    
    setTimeout(() => {
      container.innerHTML = '';
      
      switch(route) {
        case 'dashboard':
          renderDashboard(container);
          break;
        case 'setup':
          if (currentUser.role === 'Admin') renderOrgSetup(container);
          else navigateTo('dashboard');
          break;
        case 'directory':
          renderAssetDirectory(container);
          break;
        case 'allocation':
          if (currentUser.role !== 'Employee') renderAssetAllocation(container);
          else navigateTo('dashboard');
          break;
        case 'booking':
          renderResourceBooking(container);
          break;
        case 'maintenance':
          renderMaintenance(container);
          break;
        case 'audit':
          if (currentUser.role === 'Admin' || currentUser.role === 'Asset Manager') renderAssetAudit(container);
          else navigateTo('dashboard');
          break;
        case 'reports':
          if (currentUser.role === 'Admin' || currentUser.role === 'Asset Manager') renderReports(container);
          else navigateTo('dashboard');
          break;
        case 'logs':
          renderActivityLogs(container);
          break;
        default:
          container.innerHTML = `<h2>Page Not Found</h2>`;
      }
      
      if (window.lucide) {
        window.lucide.createIcons();
      }
      
      container.classList.remove('fade-in');
    }, 200); // skeleton display duration
  }, 200); // fade out duration
}

// Quick Dev User Switcher
function devSwitchUser(userId) {
  if (!userId) return;
  const user = AssetFlowDB.getById('users', userId);
  if (user) {
    currentUser = user;
    localStorage.setItem('assetflow_session', JSON.stringify(user));
    showToast(`Switched account to ${user.name} (${user.role})`, 'info');
    AssetFlowDB.log(user.id, user.name, 'Dev Account Switch', 'Switched user role via debug panel');
    renderAppShell();
  }
}

// Helpers
function getInitials(name) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function formatRouteTitle(route) {
  if (route === 'setup') return '⚙️ Organization Setup';
  if (route === 'directory') return '📁 Asset Registration & Directory';
  if (route === 'allocation') return '🔄 Asset Allocation & Transfer';
  if (route === 'booking') return '📅 Resource Booking';
  if (route === 'maintenance') return '🛠️ Maintenance Management';
  if (route === 'audit') return '📋 Asset Audit Cycles';
  if (route === 'reports') return '📊 Reports & Analytics';
  if (route === 'logs') return '📜 Activity Logs';
  if (route === 'dashboard') return '🏡 Dashboard';
  return route.charAt(0).toUpperCase() + route.slice(1);
}

// Toast Notification Manager
function showToast(message, type = 'info', undoCallback = null) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle';
  if (type === 'danger') iconName = 'alert-triangle';
  if (type === 'warning') iconName = 'alert-circle';
  
  let undoHTML = '';
  if (undoCallback) {
    undoHTML = `<button class="toast-undo-btn" id="undo-btn-${Date.now()}">Undo</button>`;
  }

  toast.innerHTML = `
    <div style="display:flex; align-items:center;">
      <i data-lucide="${iconName}"></i>
      <span class="toast-msg">${message}</span>
      ${undoHTML}
    </div>
  `;
  
  container.appendChild(toast);
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  if (undoCallback) {
    const btn = toast.querySelector('.toast-undo-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        undoCallback();
        toast.remove();
      });
    }
  }

  // Slide out and remove
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        if (toast.parentNode) toast.remove();
      });
    }
  }, undoCallback ? 6000 : 4000);
}

// Modal control
function openModal(title, bodyHTML, footerHTML = '') {
  const overlay = document.getElementById('modal-overlay');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');
  const footerEl = document.getElementById('modal-footer');
  
  if (!overlay) return;
  
  titleEl.textContent = title;
  bodyEl.innerHTML = bodyHTML;
  footerEl.innerHTML = footerHTML;
  
  overlay.classList.add('active');
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// Notifications drawer control
function toggleNotifications(show) {
  const drawer = document.getElementById('ntf-drawer');
  if (!drawer) return;
  
  if (show) {
    renderNotificationsList();
    drawer.classList.add('active');
  } else {
    drawer.classList.remove('active');
  }
}

function renderNotificationsList() {
  const container = document.getElementById('ntf-list-container');
  if (!container) return;
  
  const ntfs = AssetFlowDB.getAll('notifications')
    .filter(n => n.userId === currentUser.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
  if (ntfs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); margin-top: 3rem; font-size: 0.9rem;">
        <i data-lucide="bell-off" style="width: 32px; height: 32px; margin-bottom: 0.5rem; display: block; margin-left: auto; margin-right: auto;"></i>
        No notifications
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }
  
  container.innerHTML = ntfs.map(n => `
    <div class="ntf-item ${n.read ? '' : 'unread'}" onclick="markNotificationRead('${n.id}')">
      <div class="ntf-item-title">${n.title}</div>
      <div class="ntf-item-msg">${n.message}</div>
      <div class="ntf-item-time">${formatTimestamp(n.timestamp)}</div>
    </div>
  `).join('');
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function markNotificationRead(id) {
  AssetFlowDB.update('notifications', id, { read: true });
  renderNotificationsList();
  
  // Update bell dot
  const dot = document.getElementById('ntf-bell-dot');
  if (dot && getUnreadNotificationCount() === 0) {
    dot.remove();
  }
}

function getUnreadNotificationCount() {
  if (!currentUser) return 0;
  return AssetFlowDB.getAll('notifications').filter(n => n.userId === currentUser.id && !n.read).length;
}

function formatTimestamp(timestampStr) {
  const date = new Date(timestampStr);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Global Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl+K or Cmd+K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const modal = document.getElementById('search-modal');
    if (modal) {
      modal.classList.add('active');
      setTimeout(() => document.getElementById('global-search-input')?.focus(), 50);
    }
  }
  // ? shortcut
  if (e.key === '?' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    const overlay = document.getElementById('shortcuts-modal');
    if (overlay) overlay.classList.add('active');
  }
  // Esc to close modals
  if (e.key === 'Escape') {
    closeModal();
    document.getElementById('shortcuts-modal')?.classList.remove('active');
    document.getElementById('search-modal')?.classList.remove('active');
  }
});

function closeShortcutsModal() {
  document.getElementById('shortcuts-modal')?.classList.remove('active');
}

// Global Spotlight Search Logic
document.addEventListener('input', (e) => {
  if (e.target.id !== 'global-search-input') return;
  const q = e.target.value.toLowerCase().trim();
  const container = document.getElementById('search-results-container');
  if (!container) return;

  if (!q) { container.innerHTML = ''; return; }

  const results = [];

  // Search assets
  AssetFlowDB.getAll('assets').filter(a =>
    a.name.toLowerCase().includes(q) || a.tag.toLowerCase().includes(q) || a.serialNumber.toLowerCase().includes(q)
  ).slice(0, 4).forEach(a => {
    results.push({ icon: 'package', label: a.name, sub: a.tag + ' · ' + a.status, action: `navigateTo('directory')` });
  });

  // Search users
  AssetFlowDB.getAll('users').filter(u =>
    u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  ).slice(0, 3).forEach(u => {
    results.push({ icon: 'user', label: u.name, sub: u.role + ' · ' + u.email, action: `navigateTo('setup')` });
  });

  // Search bookings
  AssetFlowDB.getAll('bookings').filter(b =>
    b.purpose.toLowerCase().includes(q)
  ).slice(0, 3).forEach(b => {
    const asset = AssetFlowDB.getById('assets', b.assetId);
    results.push({ icon: 'calendar', label: b.purpose, sub: (asset ? asset.name : '') + ' · ' + b.status, action: `navigateTo('booking')` });
  });

  if (results.length === 0) {
    container.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text-muted);">No results for "${q}"</div>`;
    return;
  }

  container.innerHTML = results.map((r, i) => `
    <div class="search-result-item" onclick="document.getElementById('search-modal').classList.remove('active'); ${r.action}">
      <i data-lucide="${r.icon}" style="width:18px; height:18px; color:var(--primary); flex-shrink:0;"></i>
      <div>
        <div style="font-weight:600; color:var(--text-primary);">${r.label}</div>
        <div style="font-size:0.8rem; color:var(--text-muted);">${r.sub}</div>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
});

// Close search when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('search-modal');
  if (modal && !modal.querySelector('.search-input-wrapper')?.contains(e.target)) {
    if (modal.classList.contains('active') && !e.target.closest('.search-modal-overlay')) {
      modal.classList.remove('active');
    }
  }
});
