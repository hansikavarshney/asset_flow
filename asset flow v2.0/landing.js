// landing.js — Modular Landing Page for AssetFlow ERP

function renderLandingPage() {
  const root = document.getElementById('app-root');
  if (!root) return;

  // Add landing-body class to body to isolate fonts and styles
  document.body.className = 'landing-body';

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const themeIcon = currentTheme === 'light' ? 'moon' : 'sun';

  root.innerHTML = `
    <!-- ─────────────────────────────────────────
         STICKY NAVIGATION BAR
    ───────────────────────────────────────── -->
    <header class="lp-header">
      <div class="lp-nav-container">
        <div class="lp-logo" onclick="goToAuthPage('login')">
          <div class="lp-logo-icon">AF</div>
          <span>AssetFlow</span>
        </div>

        <div class="lp-nav-actions">
          <!-- Theme switch button -->
          <button class="lp-theme-btn" onclick="toggleLandingTheme()" title="Toggle Theme">
            <i data-lucide="${themeIcon}" id="lp-theme-icon" style="width: 18px; height: 18px;"></i>
          </button>
          
          <button class="btn-signin ripple-btn" onclick="goToAuthPage('login')">
            Sign In <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </button>
          
          <button class="btn-getstarted ripple-btn" onclick="goToAuthPage('signup')">
            <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i> Get Started
          </button>
        </div>
      </div>
    </header>

    <!-- ─────────────────────────────────────────
         HERO SECTION
    ───────────────────────────────────────── -->
    <section class="lp-hero-section" id="hero">
      <div class="lp-hero-blobs">
        <div class="lp-blob lp-blob-1"></div>
        <div class="lp-blob lp-blob-2"></div>
        <div class="lp-blob lp-blob-3"></div>
      </div>
      
      <div class="lp-hero-left">
        <!-- Announcement Pill -->
        <div class="lp-hero-pill" onclick="goToAuthPage('signup')">
          <span class="lp-hero-pill-badge">New</span>
          <span>AI-powered maintenance prediction is here</span>
          <i data-lucide="arrow-right" style="width:14px; height:14px; color:var(--lp-primary);"></i>
        </div>

        <h1 class="lp-hero-title">Manage Every Asset.<br>Empower Every Team.</h1>
        <p class="lp-hero-subtitle">
          Track lifecycle values, allocate smart resources, automate recurring maintenance, schedule deep audits, and manage company bookings—all from one intelligent, centralized ERP platform.
        </p>
        
        <div class="lp-hero-ctas">
          <button class="btn-hero-primary ripple-btn" onclick="goToAuthPage('signup')">
            Start Free <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
          </button>
          <button class="btn-hero-secondary ripple-btn" onclick="goToAuthPage('login')">
            Sign In <i data-lucide="log-in" style="width: 18px; height: 18px;"></i>
          </button>
        </div>
        
        <div class="lp-hero-badges">
          <div class="lp-badge-item">
            <span class="lp-badge-icon"><i data-lucide="shield-check" style="width:16px; height:16px;"></i></span>
            <span>Enterprise Secure</span>
          </div>
          <div class="lp-badge-item">
            <span class="lp-badge-icon"><i data-lucide="cloud" style="width:16px; height:16px;"></i></span>
            <span>100% Cloud Based</span>
          </div>
          <div class="lp-badge-item">
            <span class="lp-badge-icon"><i data-lucide="zap" style="width:16px; height:16px;"></i></span>
            <span>Instant Provisioning</span>
          </div>
          <div class="lp-badge-item">
            <span class="lp-badge-icon"><i data-lucide="users-2" style="width:16px; height:16px;"></i></span>
            <span>Role-Based Access</span>
          </div>
        </div>
      </div>

      <!-- ─── Hero Mockup Panel (centered, full-width below text) ─── -->
      <div class="lp-hero-right">
        <div class="lp-mockup-wrapper">
          
          <!-- Floating Card 1: Asset Utilization (Donut Chart) -->
          <div class="lp-float-card lp-fc-utilization" style="transform: translateZ(60px);">
            <div class="lp-mock-header">
              <span class="lp-mock-title">Asset Utilization</span>
              <span class="lp-mock-tag lp-tag-success">Optimal</span>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
              <svg width="60" height="60" viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--lp-border)" stroke-width="3"></circle>
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--lp-primary)" stroke-dasharray="92 8" stroke-dashoffset="0" stroke-width="3" stroke-linecap="round"></circle>
              </svg>
              <div>
                <div style="font-size: 1.5rem; font-weight: 800;">92%</div>
                <div style="font-size: 0.75rem; color: var(--lp-text-secondary);">Active Allocation</div>
              </div>
            </div>
          </div>

          <!-- Floating Card 2: Bookings Calendar -->
          <div class="lp-float-card lp-fc-calendar" style="transform: translateZ(40px);">
            <div class="lp-mock-header">
              <span class="lp-mock-title">Shared Calendar</span>
              <span class="lp-mock-tag lp-tag-primary">Live</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.75rem; margin-top: 0.5rem;">
              <div style="display:flex; justify-content:space-between; background:var(--lp-border); padding:0.4rem; border-radius:6px;">
                <span>Sprint Planning (Room A)</span>
                <strong style="color:var(--lp-primary);">10:00 AM</strong>
              </div>
              <div style="display:flex; justify-content:space-between; background:var(--lp-border); padding:0.4rem; border-radius:6px;">
                <span>Tesla Model 3 Booking</span>
                <strong style="color:var(--lp-secondary);">01:30 PM</strong>
              </div>
            </div>
          </div>

          <!-- Floating Card 3: Maintenance Workflow -->
          <div class="lp-float-card lp-fc-maintenance" style="transform: translateZ(70px);">
            <div class="lp-mock-header">
              <span class="lp-mock-title">Maintenance Tickets</span>
              <span class="lp-mock-tag lp-tag-danger">3 Critical</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.75rem;">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="width:6px; height:6px; background:#EF4444; border-radius:50%;"></span>
                <span>IT Server Rack - Fan Failure</span>
              </div>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="width:6px; height:6px; background:#F59E0B; border-radius:50%;"></span>
                <span>Workspace 304 - Desk Adjuster</span>
              </div>
            </div>
          </div>

          <!-- Floating Card 4: Audit Status -->
          <div class="lp-float-card lp-fc-audit" style="transform: translateZ(20px);">
            <div class="lp-mock-header">
              <span class="lp-mock-title">HQ Audit Progress</span>
              <span class="lp-mock-tag lp-tag-warning">75%</span>
            </div>
            <div style="margin-top: 0.5rem;">
              <div style="background: var(--lp-border); height: 8px; border-radius: 9999px; overflow: hidden; width: 100%;">
                <div style="background: linear-gradient(90deg, var(--lp-primary), var(--lp-accent)); width: 75%; height: 100%; border-radius: 9999px;"></div>
              </div>
              <div style="font-size: 0.7rem; color: var(--lp-text-secondary); margin-top: 0.4rem; display: flex; justify-content: space-between;">
                <span>124 Verified</span>
                <span>12 Pending</span>
              </div>
            </div>
          </div>

          <!-- Floating Card 5: Recent Alerts -->
          <div class="lp-float-card lp-fc-notifications" style="transform: translateZ(50px);">
            <div class="lp-mock-header">
              <span class="lp-mock-title">Global Activity</span>
              <i data-lucide="bell" style="width:14px; height:14px; color:var(--lp-primary);"></i>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; margin-top:0.25rem;">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--lp-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.65rem;">PS</div>
              <div>
                <strong style="color: var(--lp-text-primary);">Priya Sharma</strong>
                <span style="color: var(--lp-text-secondary);">registered MacBook Pro</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────
         MINIMAL FOOTER
    ───────────────────────────────────────── -->
    <footer class="lp-minimal-footer">
      <span>© 2026 AssetFlow Technologies Inc. All rights reserved.</span>
      <span>•</span>
      <span>Enterprise Secure</span>
      <span>•</span>
      <span>100% Cloud Based</span>
    </footer>
  `;

  // Trigger Lucide SVG replacements
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Setup click ripples for all landing page buttons
  document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', createRipple);
  });
}

// ─────────────────────────────────────────
// EVENT LISTENERS & INTERACTION HANDLERS
// ─────────────────────────────────────────

// Switch theme dynamically and update storage
function toggleLandingTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('assetflow_theme', newTheme);
  
  // Update toggle button icon inside landing
  const icon = document.getElementById('lp-theme-icon');
  if (icon) {
    icon.setAttribute('data-lucide', newTheme === 'light' ? 'moon' : 'sun');
  }
  
  // Sync core theme switcher icons just in case they return
  const coreThemeIcon = document.getElementById('theme-toggle-icon');
  if (coreThemeIcon) {
    coreThemeIcon.setAttribute('data-lucide', newTheme === 'light' ? 'moon' : 'sun');
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }

  if (window.showToast) {
    showToast(`Switched to ${newTheme} mode`, 'info');
  }
}

// Render the standard Auth view (which delegates to screens.js auth renderer)
function goToAuthPage(view = 'login') {
  renderAuthPage();
  if (view === 'signup' && window.showSignupView) {
    window.showSignupView();
  } else if (window.showLoginView) {
    window.showLoginView();
  }
}

function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
  circle.classList.add("ripple-circle");

  const ripple = button.getElementsByClassName("ripple-circle")[0];
  if (ripple) {
    ripple.remove();
  }
  button.appendChild(circle);
}
