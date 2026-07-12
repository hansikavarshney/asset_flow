// landing.js — Modular Landing Page for AssetFlow ERP

function renderLandingPage() {
  const root = document.getElementById('app-root');
  if (!root) return;

  // Add landing-body class to body to isolate fonts and styles
  document.body.className = 'landing-body';

  // Get dynamic counts from local DB to align landing numbers with DB state (fallback to seeds if empty)
  let dbAssetsCount = 50000; 
  let dbOrgCount = 1200;
  try {
    if (window.AssetFlowDB) {
      AssetFlowDB.init();
      const assets = AssetFlowDB.getAll('assets') || [];
      if (assets.length > 0) {
        dbAssetsCount = 50000 + assets.length; // mock addition to make it dynamic
      }
    }
  } catch (e) {
    console.warn("Database not ready for counts, fallback to defaults", e);
  }

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const themeIcon = currentTheme === 'light' ? 'moon' : 'sun';

  root.innerHTML = `
    <!-- ─────────────────────────────────────────
         STICKY NAVIGATION BAR
    ───────────────────────────────────────── -->
    <header class="lp-header">
      <div class="lp-nav-container">
        <div class="lp-logo" onclick="scrollToSection('hero')">
          <div class="lp-logo-icon">AF</div>
          <span>AssetFlow</span>
        </div>
        
        <ul class="lp-nav-links" id="lp-mobile-menu">
          <li><a href="#features" class="lp-nav-link" onclick="handleMenuClick(event, 'features')">Features</a></li>
          <li><a href="#how-it-works" class="lp-nav-link" onclick="handleMenuClick(event, 'how-it-works')">Solutions</a></li>
          <li><a href="#preview" class="lp-nav-link" onclick="handleMenuClick(event, 'preview')">Dashboard</a></li>
          <li><a href="#benefits" class="lp-nav-link" onclick="handleMenuClick(event, 'benefits')">Benefits</a></li>
          <li><a href="#testimonials" class="lp-nav-link" onclick="handleMenuClick(event, 'testimonials')">Pricing</a></li>
        </ul>

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
          
          <button class="lp-menu-toggle" onclick="toggleMobileMenu()" aria-label="Toggle Menu">
            <i data-lucide="menu" id="lp-menu-icon" style="width: 24px; height: 24px;"></i>
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
        <div class="lp-hero-pill">
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
          <button class="btn-hero-secondary ripple-btn" onclick="scrollToSection('preview')">
            Watch Demo <i data-lucide="play" style="width: 18px; height: 18px; fill: currentColor;"></i>
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
         STATISTICS SECTION
    ───────────────────────────────────────── -->
    <section class="lp-stats-section" id="stats">
      <div class="lp-stats-grid">
        <div class="lp-stats-card fade-in-on-scroll">
          <div class="lp-stats-number" data-target="${dbAssetsCount}">0</div>
          <div class="lp-stats-label">Assets Fully Managed</div>
        </div>
        <div class="lp-stats-card fade-in-on-scroll" style="transition-delay: 0.1s;">
          <div class="lp-stats-number" data-target="${dbOrgCount}">0</div>
          <div class="lp-stats-label">Trusted Organizations</div>
        </div>
        <div class="lp-stats-card fade-in-on-scroll" style="transition-delay: 0.2s;">
          <div class="lp-stats-number" data-target="99" data-decimals="1" data-suffix="%">0%</div>
          <div class="lp-stats-label">System Performance Uptime</div>
        </div>
        <div class="lp-stats-card fade-in-on-scroll" style="transition-delay: 0.3s;">
          <div class="lp-stats-number" data-target="35" data-suffix="%">0%</div>
          <div class="lp-stats-label">Operational Efficiency Gain</div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────
         FEATURES SECTION
    ───────────────────────────────────────── -->
    <section class="lp-features-section" id="features">
      <div class="lp-section-header">
        <span class="lp-section-tag">Key Pillars</span>
        <h2 class="lp-section-title">Everything you need to automate resource logistics</h2>
        <p class="lp-section-desc">Discard fragmented sheets. AssetFlow joins procurement, assignments, routine checks, and audits into one unified dashboard.</p>
      </div>

      <div class="lp-features-grid">
        <!-- Feature 1: Asset Tracking -->
        <div class="lp-feature-card fade-in-on-scroll">
          <div class="lp-feature-icon"><i data-lucide="package-search"></i></div>
          <h3 class="lp-feature-title">Asset Lifecycle Tracking</h3>
          <p class="lp-feature-desc">Oversee hardware from acquisition to retirement. Log custody handovers, serial warranty codes, and location paths automatically.</p>
          <a class="lp-feature-link" href="#preview" onclick="scrollToSection('preview')">Learn More <i data-lucide="chevron-right"></i></a>
        </div>

        <!-- Feature 2: Booking Management -->
        <div class="lp-feature-card fade-in-on-scroll" style="transition-delay: 0.1s;">
          <div class="lp-feature-icon"><i data-lucide="calendar-check-2"></i></div>
          <h3 class="lp-feature-title">Resource Bookings</h3>
          <p class="lp-feature-desc">Schedule shared meeting coordinates, labs, testing machinery, and vehicles. Prevent double bookings with custom approvals.</p>
          <a class="lp-feature-link" href="#preview" onclick="scrollToSection('preview')">Learn More <i data-lucide="chevron-right"></i></a>
        </div>

        <!-- Feature 3: Maintenance Workflow -->
        <div class="lp-feature-card fade-in-on-scroll" style="transition-delay: 0.2s;">
          <div class="lp-feature-icon"><i data-lucide="wrench"></i></div>
          <h3 class="lp-feature-title">Maintenance Workflows</h3>
          <p class="lp-feature-desc">Raise diagnostic tasks, assign service providers, track expenses, and schedule routine preventive maintenance dynamically.</p>
          <a class="lp-feature-link" href="#preview" onclick="scrollToSection('preview')">Learn More <i data-lucide="chevron-right"></i></a>
        </div>

        <!-- Feature 4: Audit Management -->
        <div class="lp-feature-card fade-in-on-scroll">
          <div class="lp-feature-icon"><i data-lucide="clipboard-list"></i></div>
          <h3 class="lp-feature-title">Asset Audits & Compliance</h3>
          <p class="lp-feature-desc">Design custom checklist scopes for physical inspection cycles. Match barcode lists and handle discrepancies in real time.</p>
          <a class="lp-feature-link" href="#preview" onclick="scrollToSection('preview')">Learn More <i data-lucide="chevron-right"></i></a>
        </div>

        <!-- Feature 5: Analytics Dashboard -->
        <div class="lp-feature-card fade-in-on-scroll" style="transition-delay: 0.1s;">
          <div class="lp-feature-icon"><i data-lucide="pie-chart"></i></div>
          <h3 class="lp-feature-title">Analytics & Reports</h3>
          <p class="lp-feature-desc">Examine depreciation curves, resource demands, ticket speeds, and department allocation percentages instantly.</p>
          <a class="lp-feature-link" href="#preview" onclick="scrollToSection('preview')">Learn More <i data-lucide="chevron-right"></i></a>
        </div>

        <!-- Feature 6: Secure Integrations -->
        <div class="lp-feature-card fade-in-on-scroll" style="transition-delay: 0.2s;">
          <div class="lp-feature-icon"><i data-lucide="shield-alert"></i></div>
          <h3 class="lp-feature-title">Role-Based Safeguards</h3>
          <p class="lp-feature-desc">Implement granular security. Limit checkouts, settings logs, and approvals based on custom organization department rules.</p>
          <a class="lp-feature-link" href="#preview" onclick="scrollToSection('preview')">Learn More <i data-lucide="chevron-right"></i></a>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────
         HOW IT WORKS SECTION
    ───────────────────────────────────────── -->
    <section class="lp-how-section" id="how-it-works">
      <div class="lp-how-section-inner">
      <div class="lp-section-header">
        <span class="lp-section-tag">Logistics Flow</span>
        <h2 class="lp-section-title">Streamlined from onboarding to reporting</h2>
        <p class="lp-section-desc">Experience a linear, automated management system that scales with your company size.</p>
      </div>

      <div class="lp-timeline-container">
        <div class="lp-timeline-line">
          <div class="lp-timeline-progress" id="lp-timeline-progress"></div>
        </div>
        
        <div class="lp-timeline-grid">
          <!-- Step 1 -->
          <div class="lp-timeline-step fade-in-on-scroll">
            <div class="lp-step-node">1</div>
            <div class="lp-step-card">
              <h4 class="lp-step-title">Register Assets</h4>
              <p class="lp-step-desc">Bulk upload or scan details to index barcode numbers.</p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="lp-timeline-step fade-in-on-scroll" style="transition-delay: 0.1s;">
            <div class="lp-step-node">2</div>
            <div class="lp-step-card">
              <h4 class="lp-step-title">Allocate Resources</h4>
              <p class="lp-step-desc">Assign custody, keys, or books to teams with rules.</p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="lp-timeline-step fade-in-on-scroll" style="transition-delay: 0.2s;">
            <div class="lp-step-node">3</div>
            <div class="lp-step-card">
              <h4 class="lp-step-title">Track Usage</h4>
              <p class="lp-step-desc">Monitor location changes and checkout duration live.</p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="lp-timeline-step fade-in-on-scroll" style="transition-delay: 0.3s;">
            <div class="lp-step-node">4</div>
            <div class="lp-step-card">
              <h4 class="lp-step-title">Maintenance</h4>
              <p class="lp-step-desc">Auto-raise service requests when problems appear.</p>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="lp-timeline-step fade-in-on-scroll" style="transition-delay: 0.4s;">
            <div class="lp-step-node">5</div>
            <div class="lp-step-card">
              <h4 class="lp-step-title">Verify Audits</h4>
              <p class="lp-step-desc">Run location checkpoints to align records.</p>
            </div>
          </div>

          <!-- Step 6 -->
          <div class="lp-timeline-step fade-in-on-scroll" style="transition-delay: 0.5s;">
            <div class="lp-step-node">6</div>
            <div class="lp-step-card">
              <h4 class="lp-step-title">Generate Reports</h4>
              <p class="lp-step-desc">Export tax valuation spreadsheets in seconds.</p>
            </div>
          </div>
        </div>
      </div>
      </div><!-- /lp-how-section-inner -->
    </section>

    <!-- ─────────────────────────────────────────
         DASHBOARD PREVIEW SECTION (ERP MOCK)
    ───────────────────────────────────────── -->
    <section class="lp-preview-section" id="preview">
      <div class="lp-section-header">
        <span class="lp-section-tag">Interactive Demo</span>
        <h2 class="lp-section-title">The powerful dashboard at your fingertips</h2>
        <p class="lp-section-desc">Take a look inside the AssetFlow interface, engineered to make asset coordination simple.</p>
      </div>

      <div class="lp-browser-mockup fade-in-on-scroll">
        <div class="lp-browser-header">
          <div class="lp-browser-dots">
            <span class="lp-dot lp-dot-close"></span>
            <span class="lp-dot lp-dot-min"></span>
            <span class="lp-dot lp-dot-max"></span>
          </div>
          <div class="lp-browser-address">https://app.assetflow.com/dashboard</div>
        </div>

        <div class="lp-mock-erp">
          <!-- Mini Sidebar -->
          <aside class="lp-erp-sidebar">
            <div style="font-weight: 800; font-size: 0.9rem; color: var(--lp-primary); display: flex; align-items: center; gap: 0.5rem; margin-bottom:1rem;">
              <div class="lp-logo-icon" style="width:24px; height:24px; font-size:0.7rem; border-radius:6px;">AF</div>
              <span>AssetFlow</span>
            </div>
            <div class="lp-erp-nav">
              <span class="lp-erp-nav-item active"><i data-lucide="layout-dashboard" style="width: 14px; height: 14px;"></i> Dashboard</span>
              <span class="lp-erp-nav-item"><i data-lucide="folder-search" style="width: 14px; height: 14px;"></i> Directory</span>
              <span class="lp-erp-nav-item"><i data-lucide="calendar" style="width: 14px; height: 14px;"></i> Bookings</span>
              <span class="lp-erp-nav-item"><i data-lucide="wrench" style="width: 14px; height: 14px;"></i> Maintenance</span>
              <span class="lp-erp-nav-item"><i data-lucide="clipboard-check" style="width: 14px; height: 14px;"></i> Audits</span>
              <span class="lp-erp-nav-item"><i data-lucide="settings" style="width: 14px; height: 14px;"></i> Configuration</span>
            </div>
          </aside>

          <!-- Main mock app panel -->
          <div class="lp-erp-main">
            <!-- Header bar -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--lp-border); padding-bottom: 0.75rem;">
              <h3 style="font-size: 1.15rem; font-weight:700; color:var(--lp-text-primary);">Dashboard Summary</h3>
              <div style="display:flex; align-items:center; gap: 0.75rem;">
                <div style="font-size: 0.75rem; background: rgba(34, 197, 94, 0.1); color: var(--lp-success); padding: 0.25rem 0.6rem; border-radius: 9999px; font-weight: 600;">System Online</div>
                <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--lp-border); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700;">SC</div>
              </div>
            </div>

            <!-- Dashboard Mock Widgets Grid -->
            <div class="lp-erp-grid">
              
              <!-- Left Column: Asset Table and Chart -->
              <div style="display:flex; flex-direction:column; gap: 1.25rem;">
                
                <!-- KPI mini list -->
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                  <div class="lp-mini-card">
                    <span style="font-size:0.75rem; color: var(--lp-text-secondary); display:block; margin-bottom:0.25rem;">Available Assets</span>
                    <strong style="font-size: 1.25rem; font-weight: 800; color:var(--lp-success);">348</strong>
                  </div>
                  <div class="lp-mini-card">
                    <span style="font-size:0.75rem; color: var(--lp-text-secondary); display:block; margin-bottom:0.25rem;">Allocated Custody</span>
                    <strong style="font-size: 1.25rem; font-weight: 800; color:var(--lp-primary);">192</strong>
                  </div>
                  <div class="lp-mini-card">
                    <span style="font-size:0.75rem; color: var(--lp-text-secondary); display:block; margin-bottom:0.25rem;">Maintenance Active</span>
                    <strong style="font-size: 1.25rem; font-weight: 800; color:#F59E0B;">18</strong>
                  </div>
                </div>

                <!-- Asset Table -->
                <div class="lp-mini-card" style="padding:1rem;">
                  <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">Asset Registry Directory</div>
                  <table class="lp-mini-table">
                    <thead>
                      <tr>
                        <th>Tag</th>
                        <th>Asset Name</th>
                        <th>Location</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>AF-0001</strong></td>
                        <td>MacBook Pro 16"</td>
                        <td>HQ - Floor 3</td>
                        <td><span style="font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 9999px; background: rgba(37, 99, 235, 0.1); color: var(--lp-primary);">Allocated</span></td>
                      </tr>
                      <tr>
                        <td><strong>AF-0002</strong></td>
                        <td>ThinkPad T14</td>
                        <td>HQ - Floor 2</td>
                        <td><span style="font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 9999px; background: rgba(34, 197, 94, 0.1); color: var(--lp-success);">Available</span></td>
                      </tr>
                      <tr>
                        <td><strong>AF-0004</strong></td>
                        <td>Tesla Model 3</td>
                        <td>Garage A</td>
                        <td><span style="font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 9999px; background: rgba(34, 197, 94, 0.1); color: var(--lp-success);">Available</span></td>
                      </tr>
                      <tr>
                        <td><strong>AF-0006</strong></td>
                        <td>iPad Pro 11"</td>
                        <td>HQ - IT Cabinet</td>
                        <td><span style="font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 9999px; background: rgba(239, 68, 68, 0.1); color: #EF4444;">In Service</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

              <!-- Right Column: Recent Activities and bookings -->
              <div style="display:flex; flex-direction:column; gap:1.25rem;">
                
                <!-- Allocation Chart Mock (SVG) -->
                <div class="lp-mini-card" style="padding:1rem; display:flex; flex-direction:column; align-items:center;">
                  <div style="font-size: 0.85rem; font-weight: 700; width:100%; text-align:left; margin-bottom: 0.5rem;">Allocation Distribution</div>
                  <svg width="130" height="130" viewBox="0 0 36 36" style="margin: 0.5rem 0;">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563EB" stroke-width="4.2" stroke-dasharray="60 40" stroke-dashoffset="100"></circle>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4F46E5" stroke-width="4.2" stroke-dasharray="30 70" stroke-dashoffset="40"></circle>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22C55E" stroke-width="4.2" stroke-dasharray="10 90" stroke-dashoffset="10"></circle>
                  </svg>
                  <div style="display:flex; flex-direction:column; gap:0.25rem; font-size:0.7rem; width:100%;">
                    <div style="display:flex; align-items:center; gap:0.35rem;"><span style="width:6px; height:6px; background:#2563EB; border-radius:50%;"></span> IT Hardware (60%)</div>
                    <div style="display:flex; align-items:center; gap:0.35rem;"><span style="width:6px; height:6px; background:#4F46E5; border-radius:50%;"></span> Office furniture (30%)</div>
                    <div style="display:flex; align-items:center; gap:0.35rem;"><span style="width:6px; height:6px; background:#22C55E; border-radius:50%;"></span> Vehicles (10%)</div>
                  </div>
                </div>

                <!-- Recent booking list -->
                <div class="lp-mini-card" style="padding: 1rem;">
                  <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem;">Upcoming Resource Bookings</div>
                  <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.7rem;">
                    <div style="border-left: 2px solid var(--lp-primary); padding-left:0.5rem;">
                      <div style="font-weight:700;">Conference Room Alpha</div>
                      <div style="color:var(--lp-text-secondary);">Sprint Planning Meeting · 10:00 AM</div>
                    </div>
                    <div style="border-left: 2px solid var(--lp-success); padding-left:0.5rem;">
                      <div style="font-weight:700;">Tesla Model 3</div>
                      <div style="color:var(--lp-text-secondary);">Client Onsite Visit · 01:00 PM</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────
         BENEFITS SECTION
    ───────────────────────────────────────── -->
    <section class="lp-benefits-section" id="benefits">
      <div class="lp-benefits-ill">
        <!-- Interactive vector illustration of asset flow -->
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="svg-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB"></stop>
              <stop offset="100%" stop-color="#4F46E5"></stop>
            </linearGradient>
            <linearGradient id="svg-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#06B6D4"></stop>
              <stop offset="100%" stop-color="#22C55E"></stop>
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#0F172A" flood-opacity="0.08"></feDropShadow>
            </filter>
          </defs>
          
          <!-- Central Hub -->
          <circle cx="200" cy="200" r="45" fill="url(#svg-grad-1)" filter="url(#shadow)"></circle>
          <text x="200" y="205" text-anchor="middle" fill="#FFFFFF" font-family="Inter" font-weight="800" font-size="12">AssetFlow</text>

          <!-- Surrounding Node 1 (Procure) -->
          <line x1="200" y1="200" x2="80" y2="110" stroke="var(--lp-border)" stroke-width="2" stroke-dasharray="6,4"></line>
          <circle cx="80" cy="110" r="30" fill="var(--lp-card-bg)" stroke="var(--lp-primary)" stroke-width="2" filter="url(#shadow)"></circle>
          <text x="80" y="114" text-anchor="middle" fill="var(--lp-text-primary)" font-family="Inter" font-weight="700" font-size="9">Procure</text>

          <!-- Surrounding Node 2 (Allocate) -->
          <line x1="200" y1="200" x2="320" y2="110" stroke="var(--lp-border)" stroke-width="2" stroke-dasharray="6,4"></line>
          <circle cx="320" cy="110" r="30" fill="var(--lp-card-bg)" stroke="var(--lp-secondary)" stroke-width="2" filter="url(#shadow)"></circle>
          <text x="320" y="114" text-anchor="middle" fill="var(--lp-text-primary)" font-family="Inter" font-weight="700" font-size="9">Allocate</text>

          <!-- Surrounding Node 3 (Maintain) -->
          <line x1="200" y1="200" x2="320" y2="290" stroke="var(--lp-border)" stroke-width="2" stroke-dasharray="6,4"></line>
          <circle cx="320" cy="290" r="30" fill="var(--lp-card-bg)" stroke="var(--lp-accent)" stroke-width="2" filter="url(#shadow)"></circle>
          <text x="320" y="294" text-anchor="middle" fill="var(--lp-text-primary)" font-family="Inter" font-weight="700" font-size="9">Maintain</text>

          <!-- Surrounding Node 4 (Audit) -->
          <line x1="200" y1="200" x2="80" y2="290" stroke="var(--lp-border)" stroke-width="2" stroke-dasharray="6,4"></line>
          <circle cx="80" cy="290" r="30" fill="var(--lp-card-bg)" stroke="var(--lp-success)" stroke-width="2" filter="url(#shadow)"></circle>
          <text x="80" y="294" text-anchor="middle" fill="var(--lp-text-primary)" font-family="Inter" font-weight="700" font-size="9">Audit</text>

          <!-- Outer orbiting circle line -->
          <circle cx="200" cy="200" r="135" fill="none" stroke="var(--lp-border)" stroke-width="1.5" stroke-dasharray="3,6"></circle>
        </svg>
      </div>

      <div class="lp-benefit-cards">
        <div class="lp-section-header" style="text-align: left; margin-bottom: 2rem; max-width: 100%;">
          <span class="lp-section-tag">Value Proposition</span>
          <h2 class="lp-section-title">Engineered to eliminate resource wastage</h2>
        </div>

        <div class="lp-benefit-item fade-in-on-scroll">
          <div class="lp-benefit-check"><i data-lucide="check" style="width:20px; height:20px;"></i></div>
          <div>
            <h3 class="lp-benefit-title">Reduce Manual Bottlenecks</h3>
            <p class="lp-benefit-desc">Automated emails and alerts coordinate check-outs and returns, reducing human administration hours by up to 50%.</p>
          </div>
        </div>

        <div class="lp-benefit-item fade-in-on-scroll" style="transition-delay: 0.1s;">
          <div class="lp-benefit-check"><i data-lucide="check" style="width:20px; height:20px;"></i></div>
          <div>
            <h3 class="lp-benefit-title">Prevent Double Allocations</h3>
            <p class="lp-benefit-desc">Our intelligent calendar scheduling engine bars asset clashes, enforcing tight scheduling limits based on device types.</p>
          </div>
        </div>

        <div class="lp-benefit-item fade-in-on-scroll" style="transition-delay: 0.2s;">
          <div class="lp-benefit-check"><i data-lucide="check" style="width:20px; height:20px;"></i></div>
          <div>
            <h3 class="lp-benefit-title">Automate Routine Workflows</h3>
            <p class="lp-benefit-desc">Setup recurring triggers for maintenance, safety check cycles, compliance reporting, and audit reports without writing custom scripts.</p>
          </div>
        </div>

        <div class="lp-benefit-item fade-in-on-scroll" style="transition-delay: 0.3s;">
          <div class="lp-benefit-check"><i data-lucide="check" style="width:20px; height:20px;"></i></div>
          <div>
            <h3 class="lp-benefit-title">Enforce Operational Accountability</h3>
            <p class="lp-benefit-desc">Full tamper-evident database audit logs keep track of allocations, asset location shifts, and settings overrides.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────
         TESTIMONIALS SECTION
    ───────────────────────────────────────── -->
    <section class="lp-testimonials-section" id="testimonials">
      <div class="lp-section-header">
        <span class="lp-section-tag">Reviews</span>
        <h2 class="lp-section-title">Trusted by industry operational leaders</h2>
        <p class="lp-section-desc">Read how scaling organizations utilize AssetFlow to keep logistics simple.</p>
      </div>

      <div class="lp-testimonials-grid">
        <!-- Testimonial 1 -->
        <div class="lp-testimonial-card fade-in-on-scroll">
          <div class="lp-test-stars">
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
          </div>
          <p class="lp-test-quote">
            "Before AssetFlow, we tracked 2,000 laptops across spreadsheet files. Double allocations and lost machinery were common. Now, onboarding new devices takes five seconds, and audits are completed in minutes."
          </p>
          <div class="lp-test-user">
            <div class="lp-test-avatar">MH</div>
            <div>
              <div class="lp-test-name">Marcus Hayes</div>
              <div class="lp-test-company">VP of Operations, LinearSpace</div>
            </div>
          </div>
        </div>

        <!-- Testimonial 2 -->
        <div class="lp-testimonial-card fade-in-on-scroll" style="transition-delay: 0.1s;">
          <div class="lp-test-stars">
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
          </div>
          <p class="lp-test-quote">
            "Our physical inventory audits used to require three days of manual checkouts. AssetFlow reduced that down to an hour. The real-time dashboard notifications provide complete operational visibility."
          </p>
          <div class="lp-test-user">
            <div class="lp-test-avatar">LC</div>
            <div>
              <div class="lp-test-name">Linda Carter</div>
              <div class="lp-test-company">Director of IT, Stripe Logistics</div>
            </div>
          </div>
        </div>

        <!-- Testimonial 3 -->
        <div class="lp-testimonial-card fade-in-on-scroll" style="transition-delay: 0.2s;">
          <div class="lp-test-stars">
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
            <i data-lucide="star" style="width:16px; height:16px; fill:currentColor;"></i>
          </div>
          <p class="lp-test-quote">
            "The booking scheduling limits are phenomenal. Employees schedule rooms and cars autonomously, and the system automatically logs mileage and issues routine maintenance alerts without fail."
          </p>
          <div class="lp-test-user">
            <div class="lp-test-avatar">DK</div>
            <div>
              <div class="lp-test-name">Devin Kincaid</div>
              <div class="lp-test-company">Head of Facilities, Framer Labs</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────
         TRUSTED BY LOGOS
    ───────────────────────────────────────── -->
    <section class="lp-trusted-section">
      <div class="lp-trusted-title">Providing infrastructure for forward-thinking organizations</div>
      <div class="lp-logos-container">
        <div class="lp-logo-item"><i data-lucide="stripe" style="width:20px; height:20px; margin-right:4px;"></i> Stripe</div>
        <div class="lp-logo-item"><i data-lucide="box" style="width:20px; height:20px; margin-right:4px;"></i> Linear</div>
        <div class="lp-logo-item"><i data-lucide="triangle" style="width:20px; height:20px; margin-right:4px;"></i> Vercel</div>
        <div class="lp-logo-item"><i data-lucide="figma" style="width:20px; height:20px; margin-right:4px;"></i> Figma</div>
        <div class="lp-logo-item"><i data-lucide="slack" style="width:20px; height:20px; margin-right:4px;"></i> Slack</div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────
         FOOTER CTA BANNER
    ───────────────────────────────────────── -->
    <section class="lp-footer-cta-section">
      <div class="lp-cta-banner fade-in-on-scroll">
        <h2 class="lp-cta-title">Ready to simplify enterprise asset management?</h2>
        <div class="lp-cta-buttons">
          <button class="btn-hero-primary ripple-btn" onclick="goToAuthPage('signup')" style="background:#FFFFFF; color:#0F172A; box-shadow:none;">
            Start Free <i data-lucide="arrow-right" style="width:18px; height:18px;"></i>
          </button>
          <button class="btn-hero-secondary ripple-btn" onclick="goToAuthPage('login')" style="background:transparent; border-color:rgba(255,255,255,0.2); color:#FFFFFF; box-shadow:none;">
            Schedule Demo <i data-lucide="calendar" style="width:18px; height:18px;"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- ─────────────────────────────────────────
         FOOTER
    ───────────────────────────────────────── -->
    <footer class="lp-footer">
      <div class="lp-footer-container">
        <div class="lp-footer-brand">
          <div class="lp-logo">
            <div class="lp-logo-icon">AF</div>
            <span>AssetFlow</span>
          </div>
          <p class="lp-footer-desc">
            Next-generation resource tracking and logistical automation system built for scaling operations.
          </p>
          <div class="lp-socials">
            <a class="lp-social-icon" href="#"><i data-lucide="twitter" style="width:16px; height:16px;"></i></a>
            <a class="lp-social-icon" href="#"><i data-lucide="github" style="width:16px; height:16px;"></i></a>
            <a class="lp-social-icon" href="#"><i data-lucide="linkedin" style="width:16px; height:16px;"></i></a>
          </div>
        </div>

        <div class="lp-footer-col">
          <h4 class="lp-footer-title">Product</h4>
          <ul class="lp-footer-links">
            <li><a class="lp-footer-link" href="#features" onclick="scrollToSection('features')">Features</a></li>
            <li><a class="lp-footer-link" href="#how-it-works" onclick="scrollToSection('how-it-works')">Solutions</a></li>
            <li><a class="lp-footer-link" href="#preview" onclick="scrollToSection('preview')">Dashboard Preview</a></li>
            <li><a class="lp-footer-link" href="#benefits" onclick="scrollToSection('benefits')">Benefits</a></li>
          </ul>
        </div>

        <div class="lp-footer-col">
          <h4 class="lp-footer-title">Company</h4>
          <ul class="lp-footer-links">
            <li><a class="lp-footer-link" href="#">About Us</a></li>
            <li><a class="lp-footer-link" href="#">Careers</a></li>
            <li><a class="lp-footer-link" href="#">Customers</a></li>
            <li><a class="lp-footer-link" href="#">Press Kit</a></li>
          </ul>
        </div>

        <div class="lp-footer-col">
          <h4 class="lp-footer-title">Resources</h4>
          <ul class="lp-footer-links">
            <li><a class="lp-footer-link" href="#">Documentation</a></li>
            <li><a class="lp-footer-link" href="#">Help Center</a></li>
            <li><a class="lp-footer-link" href="#">Developer API</a></li>
            <li><a class="lp-footer-link" href="#">Status Page</a></li>
          </ul>
        </div>

        <div class="lp-footer-col">
          <h4 class="lp-footer-title">Legal</h4>
          <ul class="lp-footer-links">
            <li><a class="lp-footer-link" href="#">Privacy Policy</a></li>
            <li><a class="lp-footer-link" href="#">Terms of Service</a></li>
            <li><a class="lp-footer-link" href="#">Security Standards</a></li>
            <li><a class="lp-footer-link" href="#">GDPR Compliance</a></li>
          </ul>
        </div>
      </div>

      <div class="lp-footer-bottom">
        <span>© 2026 AssetFlow Technologies Inc. All rights reserved.</span>
        <span>Made with care for scaling organizations.</span>
      </div>
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

  // Setup scroll animations and timeline progress
  setupScrollReveal();

  // Scroll to stats and verify if we need to start counters
  checkStatsCounters();
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

// Toggle mobile navigation links drawer
function toggleMobileMenu() {
  const menu = document.getElementById('lp-mobile-menu');
  const icon = document.getElementById('lp-menu-icon');
  if (!menu || !icon) return;

  menu.classList.toggle('active');
  const isActive = menu.classList.contains('active');
  icon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Close mobile menu and scroll
function handleMenuClick(event, sectionId) {
  event.preventDefault();
  const menu = document.getElementById('lp-mobile-menu');
  const icon = document.getElementById('lp-menu-icon');
  
  if (menu && menu.classList.contains('active')) {
    menu.classList.remove('active');
    if (icon) icon.setAttribute('data-lucide', 'menu');
    if (window.lucide) window.lucide.createIcons();
  }

  scrollToSection(sectionId);
}

// Smooth scroll to a target HTML element id
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const headerOffset = 70;
  const elementPosition = el.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Ripple Effect Creator
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

// ─────────────────────────────────────────
// SCROLL OBSERVERS & COUNT-UP LOGIC
// ─────────────────────────────────────────

function setupScrollReveal() {
  const fadeEls = document.querySelectorAll('.fade-in-on-scroll');
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-active');
        
        // Trigger statistics count-up if this specific stat card becomes active
        if (entry.target.classList.contains('lp-stats-card')) {
          const numEl = entry.target.querySelector('.lp-stats-number');
          if (numEl && !numEl.classList.contains('counted')) {
            animateCounter(numEl);
          }
        }
        
        // Timeline scroll progression
        if (entry.target.classList.contains('lp-timeline-step')) {
          updateTimelineProgress();
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, options);

  fadeEls.forEach(el => observer.observe(el));
}

// Count up check (in case observer starts off-screen/on-screen)
function checkStatsCounters() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  const rect = statsSection.getBoundingClientRect();
  if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
    document.querySelectorAll('.lp-stats-number').forEach(numEl => {
      if (!numEl.classList.contains('counted')) {
        animateCounter(numEl);
      }
    });
  }
}

// Animate statistical counter
function animateCounter(numEl) {
  numEl.classList.add('counted');
  const target = parseFloat(numEl.getAttribute('data-target'));
  const decimals = parseInt(numEl.getAttribute('data-decimals')) || 0;
  const suffix = numEl.getAttribute('data-suffix') || '';
  const duration = 2000; // ms
  const start = 0;
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out cubic curve
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = start + easeProgress * (target - start);

    if (decimals > 0) {
      numEl.textContent = currentValue.toFixed(decimals) + suffix;
    } else {
      let rounded = Math.floor(currentValue);
      // Format 50000+ as 50K+
      if (rounded >= 1000) {
        numEl.textContent = (rounded / 1000).toFixed(0) + 'K+' + suffix;
      } else {
        numEl.textContent = rounded + suffix;
      }
    }

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      if (decimals > 0) {
        numEl.textContent = target.toFixed(decimals) + suffix;
      } else {
        if (target >= 1000) {
          numEl.textContent = (target / 1000).toFixed(0) + 'K+' + suffix;
        } else {
          numEl.textContent = target + suffix;
        }
      }
    }
  }

  requestAnimationFrame(updateCount);
}

// Calculate timeline completion line based on visible cards
function updateTimelineProgress() {
  const steps = document.querySelectorAll('.lp-timeline-step');
  const progressLine = document.getElementById('lp-timeline-progress');
  if (!progressLine || steps.length === 0) return;

  let activeCount = 0;
  steps.forEach(step => {
    if (step.classList.contains('fade-in-active')) {
      activeCount++;
    }
  });

  const percentage = ((activeCount - 1) / (steps.length - 1)) * 100;
  progressLine.style.width = Math.max(0, Math.min(percentage, 100)) + '%';
}

window.addEventListener('scroll', () => {
  // If stats counters didn't run via Observer, check scroll position
  checkStatsCounters();
});
