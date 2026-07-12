// screens.js - View Renderers and Business Logic for all 10 AssetFlow Screens

// 1. Auth Page Renderer (Login / Signup toggle)
function renderLoginSignup() {
  const container = document.getElementById('auth-card-body');
  if (!container) return;

  // Render Login view by default
  showLoginView();

  window.showLoginView = function() {
    container.innerHTML = `
      <h2 class="auth-title">Sign In to AssetFlow</h2>
      <p class="auth-subtitle">Enterprise Asset & Resource Management</p>
      <form id="login-form">
        <div class="form-group">
          <label for="login-email">Corporate Email</label>
          <input type="email" id="login-email" class="form-control" placeholder="name@company.com" required value="admin@assetflow.com">
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" class="form-control" placeholder="••••••••" required value="admin123">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Sign In</button>
      </form>
      <div style="margin-top: 1.5rem; text-align: center; font-size: 0.85rem;">
        <span style="color: var(--text-secondary);">Don't have an account? </span>
        <a onclick="showSignupView()" style="color: var(--primary); cursor: pointer; font-weight: 600;">Sign Up</a>
      </div>
      <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1rem; font-size: 0.75rem; color: var(--text-muted); text-align: center;">
        <strong>Demo Accounts (Password: admin123 / manager123 / user123):</strong><br>
        admin@assetflow.com (Admin) | sarah.c@assetflow.com (Manager)
      </div>
    `;

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      loginUser(email, pass);
    });
  };

  window.showSignupView = function() {
    container.innerHTML = `
      <h2 class="auth-title">Create Account</h2>
      <p class="auth-subtitle">Join your organization's directory</p>
      <form id="signup-form">
        <div class="form-group">
          <label for="signup-name">Full Name</label>
          <input type="text" id="signup-name" class="form-control" placeholder="Jane Doe" required>
        </div>
        <div class="form-group">
          <label for="signup-email">Corporate Email</label>
          <input type="email" id="signup-email" class="form-control" placeholder="name@company.com" required>
        </div>
        <div class="form-group">
          <label for="signup-password">Password</label>
          <input type="password" id="signup-password" class="form-control" placeholder="••••••••" required>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Sign Up</button>
      </form>
      <div style="margin-top: 1.5rem; text-align: center; font-size: 0.85rem;">
        <span style="color: var(--text-secondary);">Already have an account? </span>
        <a onclick="showLoginView()" style="color: var(--primary); cursor: pointer; font-weight: 600;">Sign In</a>
      </div>
    `;

    document.getElementById('signup-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const pass = document.getElementById('signup-password').value;
      if (signupUser(name, email, pass)) {
        showLoginView();
      }
    });
  };
}

// 2. Dashboard Screen Renderer
function renderDashboard(container) {
  const assets = AssetFlowDB.getAll('assets');
  const alls = AssetFlowDB.getAll('allocations').filter(a => a.status === 'Active' || a.status === 'Overdue');
  const bkgs = AssetFlowDB.getAll('bookings').filter(b => b.status === 'Upcoming' || b.status === 'Ongoing');
  const mnts = AssetFlowDB.getAll('maintenance').filter(m => m.status === 'Pending' || m.status === 'In Progress' || m.status === 'Approved');
  const transfers = AssetFlowDB.getAll('transfers').filter(t => t.status === 'Pending');

  // Compute counts
  const availableCount = assets.filter(a => a.status === 'Available').length;
  const allocatedCount = assets.filter(a => a.status === 'Allocated').length;
  const maintenanceCount = assets.filter(a => a.status === 'Under Maintenance').length;
  const activeBookingsCount = bkgs.length;
  const pendingTransfersCount = transfers.length;
  
  // Compute overdue returns
  const today = new Date().toISOString().split('T')[0];
  const overdueAlls = alls.filter(a => a.expectedReturnDate && a.expectedReturnDate < today);
  const upcomingAlls = alls.filter(a => a.expectedReturnDate && a.expectedReturnDate >= today);

  container.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card" onclick="navigateTo('directory')">
        <div class="kpi-icon-wrapper kpi-available"><i data-lucide="check-circle-2"></i></div>
        <div class="kpi-info">
          <span class="kpi-value">${availableCount}</span>
          <span class="kpi-title">Assets Available</span>
        </div>
      </div>
      <div class="kpi-card" onclick="navigateTo('directory')">
        <div class="kpi-icon-wrapper kpi-allocated"><i data-lucide="users"></i></div>
        <div class="kpi-info">
          <span class="kpi-value">${allocatedCount}</span>
          <span class="kpi-title">Assets Allocated</span>
        </div>
      </div>
      <div class="kpi-card" onclick="navigateTo('maintenance')">
        <div class="kpi-icon-wrapper kpi-maintenance"><i data-lucide="wrench"></i></div>
        <div class="kpi-info">
          <span class="kpi-value">${maintenanceCount}</span>
          <span class="kpi-title">Maintenance Today</span>
        </div>
      </div>
      <div class="kpi-card" onclick="navigateTo('booking')">
        <div class="kpi-icon-wrapper kpi-bookings"><i data-lucide="calendar"></i></div>
        <div class="kpi-info">
          <span class="kpi-value">${activeBookingsCount}</span>
          <span class="kpi-title">Active Bookings</span>
        </div>
      </div>
      ${currentUser.role !== 'Employee' ? `
      <div class="kpi-card" onclick="navigateTo('allocation')">
        <div class="kpi-icon-wrapper kpi-transfers"><i data-lucide="arrow-left-right"></i></div>
        <div class="kpi-info">
          <span class="kpi-value">${pendingTransfersCount}</span>
          <span class="kpi-title">Pending Transfers</span>
        </div>
      </div>
      ` : ''}
      <div class="kpi-card" onclick="navigateTo('${currentUser.role === 'Employee' ? 'directory' : 'allocation'}')">
        <div class="kpi-icon-wrapper kpi-overdue"><i data-lucide="alert-octagon"></i></div>
        <div class="kpi-info">
          <span class="kpi-value">${overdueAlls.length}</span>
          <span class="kpi-title">Overdue Returns</span>
        </div>
      </div>
    </div>

    <div class="quick-actions-bar">
      ${currentUser.role === 'Admin' || currentUser.role === 'Asset Manager' ? `
        <button class="btn btn-primary" onclick="triggerQuickAction('register')"><i data-lucide="plus-circle"></i> Register Asset</button>
      ` : ''}
      <button class="btn btn-secondary" onclick="triggerQuickAction('book')"><i data-lucide="calendar-plus"></i> Book Shared Resource</button>
      <button class="btn btn-secondary" onclick="triggerQuickAction('maintenance')"><i data-lucide="shield-alert"></i> Raise Maintenance Request</button>
    </div>

    <div class="analytics-grid">
      <!-- Overdue Returns -->
      <div class="card">
        <h3 style="margin-bottom: 1rem; color: var(--danger); display: flex; align-items: center; gap: 0.5rem;">
          <i data-lucide="alert-triangle"></i> Overdue Return Trackings
        </h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Asset Name</th>
                <th>Holder</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${overdueAlls.length === 0 ? '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No overdue allocations.</td></tr>' : overdueAlls.map(a => {
                const asset = AssetFlowDB.getById('assets', a.assetId);
                const holder = a.allocatedTo === 'user' ? AssetFlowDB.getById('users', a.targetId) : AssetFlowDB.getById('departments', a.targetId);
                return `
                  <tr>
                    <td><strong style="color:var(--primary);">${asset ? asset.tag : 'Unknown'}</strong></td>
                    <td>${asset ? asset.name : 'Unknown'}</td>
                    <td>${holder ? holder.name : 'Unknown'}</td>
                    <td class="text-danger">${a.expectedReturnDate}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Upcoming Returns -->
      <div class="card">
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
          <i data-lucide="clock"></i> Upcoming Returns
        </h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Asset Name</th>
                <th>Holder</th>
                <th>Expected Date</th>
              </tr>
            </thead>
            <tbody>
              ${upcomingAlls.length === 0 ? '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No upcoming returns expected.</td></tr>' : upcomingAlls.slice(0, 5).map(a => {
                const asset = AssetFlowDB.getById('assets', a.assetId);
                const holder = a.allocatedTo === 'user' ? AssetFlowDB.getById('users', a.targetId) : AssetFlowDB.getById('departments', a.targetId);
                return `
                  <tr>
                    <td><strong style="color:var(--primary);">${asset ? asset.tag : 'Unknown'}</strong></td>
                    <td>${asset ? asset.name : 'Unknown'}</td>
                    <td>${holder ? holder.name : 'Unknown'}</td>
                    <td class="text-success">${a.expectedReturnDate}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Quick Action triggers
  window.triggerQuickAction = function(action) {
    if (action === 'register') {
      navigateTo('directory');
      openRegisterAssetModal();
    } else if (action === 'book') {
      navigateTo('booking');
    } else if (action === 'maintenance') {
      navigateTo('maintenance');
      openRaiseMaintenanceModal();
    }
  };
}

// 3. Organization Setup Screen Renderer (Admin Only)
function renderOrgSetup(container) {
  container.innerHTML = `
    <div class="tabs-header">
      <button class="tab-btn active" onclick="switchSetupTab('dept-tab', this)">Department Management</button>
      <button class="tab-btn" onclick="switchSetupTab('cat-tab', this)">Asset Categories</button>
      <button class="tab-btn" onclick="switchSetupTab('emp-tab', this)">Employee Directory</button>
    </div>

    <!-- Tab 1: Departments -->
    <div id="dept-tab" class="tab-content active">
      <div class="card">
        <div style="display:flex; justify-content:space-between; margin-bottom:1rem; align-items:center;">
          <h3 style="font-size:1.1rem; font-weight:600;">Departments Master</h3>
          <button class="btn btn-primary btn-sm" onclick="openDepartmentModal()"><i data-lucide="plus"></i> Add Department</button>
        </div>
        <div class="table-container">
          <table id="departments-table">
            <!-- Dynamic data loaded here -->
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 2: Asset Categories -->
    <div id="cat-tab" class="tab-content">
      <div class="card">
        <div style="display:flex; justify-content:space-between; margin-bottom:1rem; align-items:center;">
          <h3 style="font-size:1.1rem; font-weight:600;">Asset Categories</h3>
          <button class="btn btn-primary btn-sm" onclick="openCategoryModal()"><i data-lucide="plus"></i> Add Category</button>
        </div>
        <div class="table-container">
          <table id="categories-table">
            <!-- Dynamic categories loaded here -->
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 3: Employees -->
    <div id="emp-tab" class="tab-content">
      <div class="card">
        <h3 style="margin-bottom:1rem; font-size:1.1rem; font-weight:600;">Employee Directory & Promoted Roles</h3>
        <div class="table-container">
          <table id="employees-table">
            <!-- Dynamic employees data -->
          </table>
        </div>
      </div>
    </div>
  `;

  // Inner helpers
  window.switchSetupTab = function(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
    
    if (tabId === 'dept-tab') loadDepartmentsData();
    if (tabId === 'cat-tab') loadCategoriesData();
    if (tabId === 'emp-tab') loadEmployeesData();
    
    if (window.lucide) window.lucide.createIcons();
  };

  // Populate data functions
  window.loadDepartmentsData = function() {
    const depts = AssetFlowDB.getAll('departments');
    const users = AssetFlowDB.getAll('users');
    const table = document.getElementById('departments-table');
    
    table.innerHTML = `
      <thead>
        <tr>
          <th>Department Name</th>
          <th>Department Head</th>
          <th>Parent Department</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${depts.map(d => {
          const head = users.find(u => u.id === d.headId);
          const parent = depts.find(dp => dp.id === d.parentId);
          return `
            <tr>
              <td><strong>${d.name}</strong></td>
              <td>${head ? head.name : '<span style="color:var(--text-muted);">Unassigned</span>'}</td>
              <td>${parent ? parent.name : '<span style="color:var(--text-muted);">None</span>'}</td>
              <td><span class="badge badge-${d.status.toLowerCase()}">${d.status}</span></td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="openDepartmentModal('${d.id}')" style="padding:0.3rem 0.5rem;"><i data-lucide="edit-3"></i></button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    `;
    if (window.lucide) window.lucide.createIcons();
  };

  window.loadCategoriesData = function() {
    const cats = AssetFlowDB.getAll('categories');
    const table = document.getElementById('categories-table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Category Name</th>
          <th>Description</th>
          <th>Custom Attributes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${cats.map(c => `
          <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.description}</td>
            <td>${c.fields && c.fields.length > 0 ? c.fields.map(f => `${f.name} (${f.type})`).join(', ') : 'None'}</td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="openCategoryModal('${c.id}')" style="padding:0.3rem 0.5rem;"><i data-lucide="edit-3"></i></button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
    if (window.lucide) window.lucide.createIcons();
  };

  window.loadEmployeesData = function() {
    const users = AssetFlowDB.getAll('users');
    const depts = AssetFlowDB.getAll('departments');
    const table = document.getElementById('employees-table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Assigned Role</th>
          <th>Status</th>
          <th>Promote Role / Toggle Status</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(u => {
          const dept = depts.find(d => d.id === u.departmentId);
          return `
            <tr>
              <td><strong>${u.name}</strong></td>
              <td>${u.email}</td>
              <td>${dept ? dept.name : '<span style="color:var(--text-muted);">Unassigned</span>'}</td>
              <td><span style="font-weight:600; color:var(--primary);">${u.role}</span></td>
              <td><span class="badge badge-${u.status.toLowerCase()}">${u.status}</span></td>
              <td>
                <div style="display:flex; gap:0.5rem; align-items:center;">
                  <select class="form-control" style="width:auto; padding:0.2rem 0.5rem;" onchange="promoteEmployeeRole('${u.id}', this.value)">
                    <option value="Employee" ${u.role === 'Employee' ? 'selected' : ''}>Employee</option>
                    <option value="Department Head" ${u.role === 'Department Head' ? 'selected' : ''}>Department Head</option>
                    <option value="Asset Manager" ${u.role === 'Asset Manager' ? 'selected' : ''}>Asset Manager</option>
                    <option value="Admin" ${u.role === 'Admin' ? 'selected' : ''}>Admin</option>
                  </select>
                  <button class="btn btn-secondary btn-sm" onclick="toggleEmployeeStatus('${u.id}')" style="padding:0.3rem 0.5rem;">
                    ${u.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    `;
    if (window.lucide) window.lucide.createIcons();
  };

  // Promote employee role
  window.promoteEmployeeRole = function(userId, newRole) {
    if (userId === currentUser.id && newRole !== 'Admin') {
      showToast("You cannot demote yourself from Admin role!", "warning");
      loadEmployeesData();
      return;
    }
    const user = AssetFlowDB.update('users', userId, { role: newRole });
    if (user) {
      showToast(`Promoted ${user.name} to ${newRole}`, 'success');
      AssetFlowDB.log(currentUser.id, currentUser.name, 'Promote Role', `Promoted ${user.name} to ${newRole}`);
      AssetFlowDB.notify(userId, 'Role Promoted', `Your role has been updated to ${newRole} by the Administrator.`, 'success');
      loadEmployeesData();
    }
  };

  // Toggle user status active/inactive
  window.toggleEmployeeStatus = function(userId) {
    if (userId === currentUser.id) {
      showToast("You cannot deactivate your own account!", "warning");
      return;
    }
    const user = AssetFlowDB.getById('users', userId);
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    AssetFlowDB.update('users', userId, { status: newStatus });
    showToast(`Updated ${user.name} status to ${newStatus}`, 'info');
    AssetFlowDB.log(currentUser.id, currentUser.name, 'Toggle User Status', `Updated ${user.name} status to ${newStatus}`);
    loadEmployeesData();
  };

  // Create/Edit Department Modal
  window.openDepartmentModal = function(id = null) {
    const isEdit = !!id;
    const dept = isEdit ? AssetFlowDB.getById('departments', id) : null;
    const users = AssetFlowDB.getAll('users');
    const depts = AssetFlowDB.getAll('departments').filter(d => !id || d.id !== id); // exclude self for parent selection
    
    const body = `
      <form id="dept-form">
        <div class="form-group">
          <label>Department Name</label>
          <input type="text" id="dept-name" class="form-control" value="${dept ? dept.name : ''}" required>
        </div>
        <div class="form-group">
          <label>Department Head</label>
          <select id="dept-head" class="form-control">
            <option value="">-- Assign Head --</option>
            ${users.map(u => `<option value="${u.id}" ${dept && dept.headId === u.id ? 'selected' : ''}>${u.name} (${u.role})</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Parent Department (Hierarchy)</label>
          <select id="dept-parent" class="form-control">
            <option value="">-- Select Parent --</option>
            ${depts.map(d => `<option value="${d.id}" ${dept && dept.parentId === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select id="dept-status" class="form-control">
            <option value="Active" ${dept && dept.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Inactive" ${dept && dept.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitDepartment('${id}')">${isEdit ? 'Save Changes' : 'Create Department'}</button>
    `;

    openModal(isEdit ? 'Edit Department' : 'Create Department', body, footer);
  };

  window.submitDepartment = function(id) {
    const name = document.getElementById('dept-name').value;
    const headId = document.getElementById('dept-head').value || null;
    const parentId = document.getElementById('dept-parent').value || null;
    const status = document.getElementById('dept-status').value;

    if (!name) return;

    if (id !== 'null' && id !== '') {
      AssetFlowDB.update('departments', id, { name, headId, parentId, status });
      showToast('Department updated', 'success');
      AssetFlowDB.log(currentUser.id, currentUser.name, 'Edit Department', `Modified department ${name}`);
    } else {
      AssetFlowDB.insert('departments', { name, headId, parentId, status });
      showToast('Department created', 'success');
      AssetFlowDB.log(currentUser.id, currentUser.name, 'Create Department', `Created department ${name}`);
    }
    
    // Automatically update employee department links if a Head is assigned
    if (headId) {
      AssetFlowDB.update('users', headId, { departmentId: id || 'dept-' }); 
    }

    closeModal();
    loadDepartmentsData();
  };

  // Create/Edit Category Modal
  window.openCategoryModal = function(id = null) {
    const isEdit = !!id;
    const cat = isEdit ? AssetFlowDB.getById('categories', id) : null;
    
    let fieldsCount = cat && cat.fields ? cat.fields.length : 0;
    
    const body = `
      <form id="cat-form">
        <div class="form-group">
          <label>Category Name</label>
          <input type="text" id="cat-name" class="form-control" value="${cat ? cat.name : ''}" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="cat-desc" class="form-control" required>${cat ? cat.description : ''}</textarea>
        </div>
        <div class="form-group">
          <label style="display:flex; justify-content:space-between; align-items:center;">
            Custom Category Attributes
            <button type="button" class="btn btn-secondary btn-sm" onclick="addCustomFieldRow()" style="padding:0.2rem 0.5rem;"><i data-lucide="plus"></i> Add Field</button>
          </label>
          <div id="custom-fields-container" style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.5rem;">
            ${cat && cat.fields ? cat.fields.map((f, i) => `
              <div class="form-row" id="field-row-${i}">
                <input type="text" class="form-control field-name" placeholder="Attribute Name (e.g. Material)" value="${f.name}">
                <div style="display:flex; gap:0.25rem;">
                  <select class="form-control field-type">
                    <option value="text" ${f.type === 'text' ? 'selected' : ''}>Text</option>
                    <option value="number" ${f.type === 'number' ? 'selected' : ''}>Number</option>
                    <option value="date" ${f.type === 'date' ? 'selected' : ''}>Date</option>
                  </select>
                  <button type="button" class="btn btn-danger btn-sm" onclick="removeFieldRow('field-row-${i}')" style="padding:0.5rem;"><i data-lucide="trash-2"></i></button>
                </div>
              </div>
            `).join('') : ''}
          </div>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitCategory('${id}')">${isEdit ? 'Save Changes' : 'Create Category'}</button>
    `;

    openModal(isEdit ? 'Edit Asset Category' : 'Create Asset Category', body, footer);
    
    let fieldIndex = fieldsCount;
    window.addCustomFieldRow = function() {
      const parent = document.getElementById('custom-fields-container');
      const row = document.createElement('div');
      row.className = 'form-row';
      row.id = `field-row-${fieldIndex}`;
      row.innerHTML = `
        <input type="text" class="form-control field-name" placeholder="Attribute Name (e.g. Warranty)" required>
        <div style="display:flex; gap:0.25rem;">
          <select class="form-control field-type">
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
          </select>
          <button type="button" class="btn btn-danger btn-sm" onclick="removeFieldRow('${row.id}')" style="padding:0.5rem;"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      parent.appendChild(row);
      fieldIndex++;
      if (window.lucide) window.lucide.createIcons();
    };

    window.removeFieldRow = function(rowId) {
      document.getElementById(rowId).remove();
    };
  };

  window.submitCategory = function(id) {
    const name = document.getElementById('cat-name').value;
    const description = document.getElementById('cat-desc').value;
    
    const rows = document.querySelectorAll('#custom-fields-container .form-row');
    const fields = [];
    rows.forEach(r => {
      const fName = r.querySelector('.field-name').value;
      const fType = r.querySelector('.field-type').value;
      if (fName) {
        fields.push({ name: fName, type: fType });
      }
    });

    if (!name || !description) return;

    if (id !== 'null' && id !== '') {
      AssetFlowDB.update('categories', id, { name, description, fields });
      showToast('Category updated', 'success');
      AssetFlowDB.log(currentUser.id, currentUser.name, 'Edit Category', `Modified category ${name}`);
    } else {
      AssetFlowDB.insert('categories', { name, description, fields });
      showToast('Category created', 'success');
      AssetFlowDB.log(currentUser.id, currentUser.name, 'Create Category', `Created category ${name}`);
    }

    closeModal();
    loadCategoriesData();
  };

  // Seed default tab load
  loadDepartmentsData();
}

// 4. Asset Directory Screen Renderer
function renderAssetDirectory(container) {
  const cats = AssetFlowDB.getAll('categories');
  const assets = AssetFlowDB.getAll('assets');

  container.innerHTML = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem; align-items:center;">
        <h3 style="font-size:1.1rem; font-weight:600;">Assets Master Directory</h3>
        ${currentUser.role === 'Admin' || currentUser.role === 'Asset Manager' ? `
          <button class="btn btn-primary" onclick="openRegisterAssetModal()"><i data-lucide="plus"></i> Register Asset</button>
        ` : ''}
      </div>

      <!-- Filters -->
      <div class="filter-row">
        <div class="search-input-wrapper">
          <input type="text" id="asset-search" class="form-control" placeholder="Search by name, tag, or serial..." oninput="filterAssetsDirectory()">
        </div>
        <select id="filter-category" class="form-control" style="width:auto;" onchange="filterAssetsDirectory()">
          <option value="">-- All Categories --</option>
          ${cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
        <select id="filter-status" class="form-control" style="width:auto;" onchange="filterAssetsDirectory()">
          <option value="">-- All Statuses --</option>
          <option value="Available">Available</option>
          <option value="Allocated">Allocated</option>
          <option value="Reserved">Reserved</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Lost">Lost</option>
          <option value="Retired">Retired</option>
          <option value="Disposed">Disposed</option>
        </select>
        <select id="filter-bookable" class="form-control" style="width:auto;" onchange="filterAssetsDirectory()">
          <option value="">-- All Types --</option>
          <option value="shared">Shared/Bookable</option>
          <option value="assigned">Assigned/Non-Bookable</option>
        </select>
      </div>

      <!-- Asset Grid Table -->
      <div class="table-container">
        <table id="assets-directory-table">
          <!-- Populated by filterAssetsDirectory -->
        </table>
      </div>
    </div>
  `;

  window.filterAssetsDirectory = function() {
    const q = document.getElementById('asset-search').value.toLowerCase();
    const catId = document.getElementById('filter-category').value;
    const status = document.getElementById('filter-status').value;
    const bookableType = document.getElementById('filter-bookable').value;
    
    let filtered = AssetFlowDB.getAll('assets');
    
    if (q) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.tag.toLowerCase().includes(q) || 
        a.serialNumber.toLowerCase().includes(q)
      );
    }
    
    if (catId) {
      filtered = filtered.filter(a => a.categoryId === catId);
    }
    
    if (status) {
      filtered = filtered.filter(a => a.status === status);
    }

    if (bookableType) {
      const isB = bookableType === 'shared';
      filtered = filtered.filter(a => a.isBookable === isB);
    }

    const table = document.getElementById('assets-directory-table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Asset Tag</th>
          <th>Asset Name</th>
          <th>Category</th>
          <th>Serial Number</th>
          <th>Condition</th>
          <th>Location</th>
          <th>Shared</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.length === 0 ? '<tr><td colspan="9" style="text-align:center; color:var(--text-muted);">No assets match your search parameters.</td></tr>' : filtered.map(a => {
          const cat = cats.find(c => c.id === a.categoryId);
          return `
            <tr>
              <td><strong style="color:var(--primary);">${a.tag}</strong></td>
              <td><strong>${a.name}</strong></td>
              <td>${cat ? cat.name : 'Unknown'}</td>
              <td><code>${a.serialNumber}</code></td>
              <td>${a.condition}</td>
              <td>${a.location}</td>
              <td>${a.isBookable ? '<span class="badge badge-reserved">Yes</span>' : '<span style="color:var(--text-muted);">No</span>'}</td>
              <td><span class="badge badge-${a.status.replace(' ', '-').toLowerCase()}">${a.status}</span></td>
              <td>
                <div style="display:flex; gap:0.25rem;">
                  <button class="btn btn-secondary btn-sm" onclick="openAssetDetailModal('${a.id}')" style="padding:0.35rem 0.5rem;"><i data-lucide="eye"></i> Details</button>
                  ${currentUser.role === 'Admin' || currentUser.role === 'Asset Manager' ? `
                    <button class="btn btn-secondary btn-sm" onclick="openRegisterAssetModal('${a.id}')" style="padding:0.35rem 0.5rem;"><i data-lucide="edit-3"></i></button>
                  ` : ''}
                </div>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    `;
    if (window.lucide) window.lucide.createIcons();
  };

  // Asset detail modal showing details and audit history logs
  window.openAssetDetailModal = function(assetId) {
    const a = AssetFlowDB.getById('assets', assetId);
    if (!a) return;
    const cat = AssetFlowDB.getById('categories', a.categoryId);
    
    // Fetch Allocation history
    const alls = AssetFlowDB.getAll('allocations').filter(al => al.assetId === assetId);
    const users = AssetFlowDB.getAll('users');
    const depts = AssetFlowDB.getAll('departments');
    
    const allocationHistoryHTML = alls.length === 0 ? '<div style="color:var(--text-muted); font-size:0.85rem;">No allocation history.</div>' : alls.map(al => {
      const holder = al.allocatedTo === 'user' ? users.find(u => u.id === al.targetId) : depts.find(d => d.id === al.targetId);
      return `
        <div class="history-item">
          <div class="history-time">${al.allocationDate} ${al.actualReturnDate ? `to ${al.actualReturnDate}` : '(Active)'}</div>
          <div class="history-desc">Allocated to <strong>${holder ? holder.name : 'Unknown'}</strong>. status: <span class="text-${al.status === 'Active' ? 'success' : 'muted'}">${al.status}</span></div>
          ${al.returnNotes ? `<div class="history-time" style="margin-top:0.15rem; font-style:italic;">Notes: "${al.returnNotes}"</div>` : ''}
        </div>
      `;
    }).join('');

    // Fetch Maintenance history
    const mnts = AssetFlowDB.getAll('maintenance').filter(m => m.assetId === assetId);
    const maintenanceHistoryHTML = mnts.length === 0 ? '<div style="color:var(--text-muted); font-size:0.85rem;">No maintenance history.</div>' : mnts.map(m => `
      <div class="history-item">
        <div class="history-time">${m.requestDate.split('T')[0]} - ${m.status}</div>
        <div class="history-desc">"${m.description}" | Priority: <span class="text-warning">${m.priority}</span></div>
        ${m.resolutionNotes ? `<div class="history-time" style="font-style:italic;">Resolution: "${m.resolutionNotes}" on ${m.resolutionDate.split('T')[0]}</div>` : ''}
      </div>
    `).join('');

    // Generate custom fields markup
    let customFieldsHTML = '';
    if (a.customFields) {
      customFieldsHTML = Object.entries(a.customFields).map(([key, val]) => `
        <div>
          <div class="detail-label">${key}</div>
          <div class="detail-value">${val || 'N/A'}</div>
        </div>
      `).join('');
    }

    const body = `
      <div class="detail-grid">
        <div>
          <div class="detail-label">Asset Name</div>
          <div class="detail-value" style="font-size:1.1rem; color:var(--primary);">${a.name}</div>
        </div>
        <div>
          <div class="detail-label">Asset Tag / ID</div>
          <div class="detail-value">${a.tag}</div>
        </div>
        <div>
          <div class="detail-label">Serial Number</div>
          <div class="detail-value"><code>${a.serialNumber}</code></div>
        </div>
        <div>
          <div class="detail-label">Category</div>
          <div class="detail-value">${cat ? cat.name : 'Unknown'}</div>
        </div>
        <div>
          <div class="detail-label">Acquisition Cost</div>
          <div class="detail-value">$${a.acquisitionCost}</div>
        </div>
        <div>
          <div class="detail-label">Acquisition Date</div>
          <div class="detail-value">${a.acquisitionDate}</div>
        </div>
        <div>
          <div class="detail-label">Condition</div>
          <div class="detail-value">${a.condition}</div>
        </div>
        <div>
          <div class="detail-label">Location</div>
          <div class="detail-value">${a.location}</div>
        </div>
        <div>
          <div class="detail-label">Booking Mode</div>
          <div class="detail-value">${a.isBookable ? 'Shared (Bookable)' : 'Assigned (Non-Bookable)'}</div>
        </div>
        <div>
          <div class="detail-label">Current Status</div>
          <div class="detail-value"><span class="badge badge-${a.status.replace(' ', '-').toLowerCase()}">${a.status}</span></div>
        </div>
        ${customFieldsHTML}
      </div>
      
      <h4 style="margin: 1.5rem 0 0.5rem 0; font-size: 0.95rem; border-bottom:1px solid var(--border-color); padding-bottom:0.25rem;">Allocation History</h4>
      <div class="history-list">
        ${allocationHistoryHTML}
      </div>
      
      <h4 style="margin: 1.5rem 0 0.5rem 0; font-size: 0.95rem; border-bottom:1px solid var(--border-color); padding-bottom:0.25rem;">Maintenance & Repair History</h4>
      <div class="history-list">
        ${maintenanceHistoryHTML}
      </div>
    `;

    openModal(`Asset Info: ${a.name}`, body, `<button class="btn btn-secondary" onclick="closeModal()">Close</button>`);
  };

  // Create or edit asset form modal
  window.openRegisterAssetModal = function(id = null) {
    const isEdit = !!id;
    const asset = isEdit ? AssetFlowDB.getById('assets', id) : null;
    const cats = AssetFlowDB.getAll('categories');

    // Build categories options
    const categorySelectHTML = cats.map(c => `
      <option value="${c.id}" ${asset && asset.categoryId === c.id ? 'selected' : ''}>${c.name}</option>
    `).join('');

    const body = `
      <form id="asset-reg-form">
        <div class="form-row">
          <div class="form-group">
            <label>Asset Name</label>
            <input type="text" id="reg-name" class="form-control" value="${asset ? asset.name : ''}" required>
          </div>
          <div class="form-group">
            <label>Category</label>
            <select id="reg-category" class="form-control" onchange="renderCustomFieldsForCategory(this.value)" ${isEdit ? 'disabled' : ''} required>
              <option value="">-- Select --</option>
              ${categorySelectHTML}
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Serial Number</label>
            <input type="text" id="reg-serial" class="form-control" value="${asset ? asset.serialNumber : ''}" required>
          </div>
          <div class="form-group">
            <label>Acquisition Cost ($)</label>
            <input type="number" id="reg-cost" class="form-control" value="${asset ? asset.acquisitionCost : ''}" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Acquisition Date</label>
            <input type="date" id="reg-date" class="form-control" value="${asset ? asset.acquisitionDate : ''}" required>
          </div>
          <div class="form-group">
            <label>Current Condition</label>
            <select id="reg-condition" class="form-control" required>
              <option value="New" ${asset && asset.condition === 'New' ? 'selected' : ''}>New</option>
              <option value="Good" ${asset && asset.condition === 'Good' ? 'selected' : ''}>Good</option>
              <option value="Fair" ${asset && asset.condition === 'Fair' ? 'selected' : ''}>Fair</option>
              <option value="Poor" ${asset && asset.condition === 'Poor' ? 'selected' : ''}>Poor</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Storage / Physical Location</label>
            <input type="text" id="reg-location" class="form-control" value="${asset ? asset.location : ''}" placeholder="e.g. Floor 2 Cabinet B" required>
          </div>
          <div class="form-group">
            <label>Allocation Mode</label>
            <select id="reg-bookable" class="form-control" required>
              <option value="false" ${asset && !asset.isBookable ? 'selected' : ''}>Assign directly to Employee/Department</option>
              <option value="true" ${asset && asset.isBookable ? 'selected' : ''}>Shared resource (Bookable timeslots)</option>
            </select>
          </div>
        </div>

        <!-- Custom fields placeholder -->
        <div id="category-custom-fields-area"></div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitRegisterAsset('${id}')">${isEdit ? 'Save Changes' : 'Register Asset'}</button>
    `;

    openModal(isEdit ? 'Edit Registered Asset' : 'Register New Asset', body, footer);
    
    // Auto render custom fields if editing
    if (asset) {
      renderCustomFieldsForCategory(asset.categoryId, asset.customFields);
    }

    window.renderCustomFieldsForCategory = function(catId, existingVals = null) {
      const area = document.getElementById('category-custom-fields-area');
      area.innerHTML = '';
      if (!catId) return;

      const category = AssetFlowDB.getById('categories', catId);
      if (category && category.fields && category.fields.length > 0) {
        area.innerHTML = `
          <h4 style="margin:1rem 0 0.5rem 0; font-size:0.85rem; color:var(--text-secondary); border-bottom:1px solid var(--border-color); padding-bottom:0.25rem;">Custom Attribute Details</h4>
          <div class="form-row" style="grid-template-columns: 1fr 1fr;">
            ${category.fields.map(f => {
              const val = existingVals ? existingVals[f.name] || '' : '';
              return `
                <div class="form-group">
                  <label>${f.name}</label>
                  <input type="${f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}" class="form-control custom-attribute-input" data-field-name="${f.name}" value="${val}" required>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }
    };
  };

  window.submitRegisterAsset = function(id) {
    const name = document.getElementById('reg-name').value;
    const catId = document.getElementById('reg-category').value;
    const serial = document.getElementById('reg-serial').value;
    const cost = parseFloat(document.getElementById('reg-cost').value);
    const date = document.getElementById('reg-date').value;
    const condition = document.getElementById('reg-condition').value;
    const location = document.getElementById('reg-location').value;
    const isBookable = document.getElementById('reg-bookable').value === 'true';

    if (!name || !catId || !serial || isNaN(cost) || !date || !location) {
      showToast('Please fill all required fields correctly', 'warning');
      return;
    }

    // Collect custom category fields
    const customFields = {};
    document.querySelectorAll('.custom-attribute-input').forEach(input => {
      const name = input.getAttribute('data-field-name');
      customFields[name] = input.value;
    });

    if (id !== 'null' && id !== '') {
      const updated = AssetFlowDB.update('assets', id, {
        name, serialNumber: serial, acquisitionCost: cost, acquisitionDate: date,
        condition, location, isBookable, customFields
      });
      showToast(`Asset details updated for ${updated.tag}`, 'success');
      AssetFlowDB.log(currentUser.id, currentUser.name, 'Modify Asset', `Modified details of ${name} (${updated.tag})`);
    } else {
      // Auto-generate tag code
      const assets = AssetFlowDB.getAll('assets');
      const maxTagNum = assets.reduce((max, a) => {
        const num = parseInt(a.tag.split('-')[1]);
        return num > max ? num : max;
      }, 0);
      const newTag = `AF-${String(maxTagNum + 1).padStart(4, '0')}`;

      const inserted = AssetFlowDB.insert('assets', {
        name, categoryId: catId, tag: newTag, serialNumber: serial, acquisitionCost: cost,
        acquisitionDate: date, condition, location, isBookable, status: 'Available', customFields
      });
      showToast(`Registered new asset ${inserted.tag}`, 'success');
      AssetFlowDB.log(currentUser.id, currentUser.name, 'Register Asset', `Registered new asset ${name} with tag ${inserted.tag}`);
    }

    closeModal();
    filterAssetsDirectory();
  };

  // Seed list load
  filterAssetsDirectory();
}

// 5. Asset Allocation & Transfer Screen
function renderAssetAllocation(container) {
  const assets = AssetFlowDB.getAll('assets');
  const alls = AssetFlowDB.getAll('allocations').filter(a => a.status === 'Active' || a.status === 'Overdue');
  const transfers = AssetFlowDB.getAll('transfers');
  
  const users = AssetFlowDB.getAll('users');
  const depts = AssetFlowDB.getAll('departments');

  container.innerHTML = `
    <div class="tabs-header">
      <button class="tab-btn active" onclick="switchAllocationTab('active-alc-tab', this)">Active Allocations</button>
      <button class="tab-btn" onclick="switchAllocationTab('transfers-tab', this)">Transfers Requests (${transfers.filter(t=>t.status==='Pending').length})</button>
    </div>

    <!-- Active Allocations Tab -->
    <div id="active-alc-tab" class="tab-content active">
      <div class="card">
        <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; align-items:center;">
          <h3 style="font-size:1.1rem; font-weight:600;">Active Holders Summary</h3>
          ${currentUser.role === 'Admin' || currentUser.role === 'Asset Manager' ? `
            <button class="btn btn-primary" onclick="openNewAllocationModal()"><i data-lucide="plus"></i> Allocate Asset</button>
          ` : ''}
        </div>
        <div class="table-container">
          <table id="allocations-table">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Asset Name</th>
                <th>Allocated Type</th>
                <th>Holder</th>
                <th>Allocation Date</th>
                <th>Expected Return</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${alls.length === 0 ? '<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No active asset allocations.</td></tr>' : alls.map(a => {
                const asset = assets.find(as => as.id === a.assetId);
                const holderName = a.allocatedTo === 'user' ? 
                  (users.find(u => u.id === a.targetId)?.name || 'Unknown') :
                  (depts.find(d => d.id === a.targetId)?.name || 'Unknown');
                
                return `
                  <tr>
                    <td><strong style="color:var(--primary);">${asset ? asset.tag : 'N/A'}</strong></td>
                    <td>${asset ? asset.name : 'Unknown'}</td>
                    <td>${a.allocatedTo === 'user' ? 'Employee' : 'Department'}</td>
                    <td><strong>${holderName}</strong></td>
                    <td>${a.allocationDate}</td>
                    <td>${a.expectedReturnDate || '<span style="color:var(--text-muted);">None</span>'}</td>
                    <td><span class="badge badge-${a.status.toLowerCase()}">${a.status}</span></td>
                    <td>
                      <div style="display:flex; gap:0.25rem;">
                        <button class="btn btn-secondary btn-sm" onclick="openReturnCheckinModal('${a.id}')" style="padding:0.35rem 0.5rem;"><i data-lucide="corner-down-left"></i> Return</button>
                        <button class="btn btn-secondary btn-sm" onclick="openInitiateTransferModal('${a.id}')" style="padding:0.35rem 0.5rem;"><i data-lucide="arrow-left-right"></i> Transfer</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Transfer Requests Tab -->
    <div id="transfers-tab" class="tab-content">
      <div class="card">
        <h3 style="margin-bottom:1.5rem; font-size:1.1rem; font-weight:600;">Inter-Employee Transfer Queue</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Asset Name</th>
                <th>From Employee</th>
                <th>To Employee</th>
                <th>Requested By</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${transfers.length === 0 ? '<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No asset transfer requests.</td></tr>' : transfers.map(t => {
                const asset = assets.find(as => as.id === t.assetId);
                const fromEmp = users.find(u => u.id === t.fromUserId)?.name || 'Unknown';
                const toEmp = users.find(u => u.id === t.toUserId)?.name || 'Unknown';
                const reqBy = users.find(u => u.id === t.requestedBy)?.name || 'Unknown';
                
                const isPending = t.status === 'Pending';
                
                return `
                  <tr>
                    <td><strong style="color:var(--primary);">${asset ? asset.tag : 'N/A'}</strong></td>
                    <td>${asset ? asset.name : 'Unknown'}</td>
                    <td>${fromEmp}</td>
                    <td><strong>${toEmp}</strong></td>
                    <td>${reqBy}</td>
                    <td>${t.requestDate.split('T')[0]}</td>
                    <td><span class="badge ${t.status === 'Approved' ? 'badge-available' : t.status === 'Rejected' ? 'badge-lost' : 'badge-reserved'}">${t.status}</span></td>
                    <td>
                      ${isPending ? `
                        <div style="display:flex; gap:0.25rem;">
                          <button class="btn btn-success btn-sm" onclick="handleTransferApproval('${t.id}', 'approve')" style="padding:0.35rem 0.5rem;"><i data-lucide="check"></i> Approve</button>
                          <button class="btn btn-danger btn-sm" onclick="handleTransferApproval('${t.id}', 'reject')" style="padding:0.35rem 0.5rem;"><i data-lucide="x"></i> Reject</button>
                        </div>
                      ` : '<span style="color:var(--text-muted);">Completed</span>'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  window.switchAllocationTab = function(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  };

  // Open Allocate Asset Modal
  window.openNewAllocationModal = function() {
    const availAssets = AssetFlowDB.getAll('assets').filter(a => a.status === 'Available' && !a.isBookable);
    const usersList = AssetFlowDB.getAll('users');
    const deptsList = AssetFlowDB.getAll('departments');

    const body = `
      <form id="allocate-form">
        <div class="form-group">
          <label>Select Available Asset</label>
          <select id="alc-asset" class="form-control" required>
            <option value="">-- Choose Asset --</option>
            ${availAssets.map(a => `<option value="${a.id}">${a.tag} - ${a.name} (${a.location})</option>`).join('')}
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Allocation Target Type</label>
            <select id="alc-target-type" class="form-control" onchange="toggleAllocationTargetList(this.value)" required>
              <option value="user">Employee</option>
              <option value="department">Department</option>
            </select>
          </div>
          <div class="form-group">
            <label>Select Target Holder</label>
            <select id="alc-target-id" class="form-control" required>
              <!-- Populated dynamically -->
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Expected Return Date (Optional)</label>
          <input type="date" id="alc-return-date" class="form-control">
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitAllocation()">Allocate Asset</button>
    `;

    openModal('Allocate Asset', body, footer);
    toggleAllocationTargetList('user');

    window.toggleAllocationTargetList = function(type) {
      const select = document.getElementById('alc-target-id');
      select.innerHTML = '';
      if (type === 'user') {
        select.innerHTML = usersList.map(u => `<option value="${u.id}">${u.name} (${u.role})</option>`).join('');
      } else {
        select.innerHTML = deptsList.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
      }
    };
  };

  // Submit allocation
  window.submitAllocation = function() {
    const assetId = document.getElementById('alc-asset').value;
    const targetType = document.getElementById('alc-target-type').value;
    const targetId = document.getElementById('alc-target-id').value;
    const returnDate = document.getElementById('alc-return-date').value || null;

    if (!assetId || !targetId) {
      showToast('Please select both the asset and target holder', 'warning');
      return;
    }

    // Verify conflicts
    const asset = AssetFlowDB.getById('assets', assetId);
    if (asset.status !== 'Available') {
      showToast('Conflict: This asset is already allocated!', 'danger');
      return;
    }

    // Create allocation
    const alc = AssetFlowDB.insert('allocations', {
      assetId,
      allocatedTo: targetType,
      targetId,
      allocatedBy: currentUser.id,
      allocationDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: returnDate,
      actualReturnDate: null,
      returnNotes: null,
      status: 'Active'
    });

    // Update asset status
    AssetFlowDB.update('assets', assetId, { status: 'Allocated' });

    // Toast and Log
    const targetName = targetType === 'user' ? 
      AssetFlowDB.getById('users', targetId).name : 
      AssetFlowDB.getById('departments', targetId).name;
      
    showToast(`Allocated ${asset.tag} to ${targetName}`, 'success');
    AssetFlowDB.log(currentUser.id, currentUser.name, 'Allocate Asset', `Allocated ${asset.name} (${asset.tag}) to ${targetName}`);
    
    // Notify
    if (targetType === 'user') {
      AssetFlowDB.notify(targetId, 'Asset Allocated', `Asset ${asset.name} (${asset.tag}) has been allocated to you. Expected return: ${returnDate || 'N/A'}.`, 'success');
    }

    closeModal();
    navigateTo('allocation');
  };

  // Return Check-in modal
  window.openReturnCheckinModal = function(alcId) {
    const alc = AssetFlowDB.getById('allocations', alcId);
    if (!alc) return;
    const asset = AssetFlowDB.getById('assets', alc.assetId);

    const body = `
      <form id="return-form">
        <p style="margin-bottom:1rem; font-size:0.9rem;">Marking asset <strong>${asset.tag} - ${asset.name}</strong> as returned. Please input check-in inspection notes:</p>
        <div class="form-group">
          <label>Check-in / Condition Notes</label>
          <textarea id="ret-notes" class="form-control" placeholder="Condition is good. Normal wear and tear." required></textarea>
        </div>
        <div class="form-group">
          <label>Asset Return Condition Status</label>
          <select id="ret-condition" class="form-control">
            <option value="Good" ${asset.condition === 'Good' ? 'selected' : ''}>Good</option>
            <option value="New" ${asset.condition === 'New' ? 'selected' : ''}>New</option>
            <option value="Fair" ${asset.condition === 'Fair' ? 'selected' : ''}>Fair</option>
            <option value="Poor" ${asset.condition === 'Poor' ? 'selected' : ''}>Poor</option>
          </select>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-success" onclick="submitReturnCheckin('${alcId}')">Complete Check-in</button>
    `;

    openModal('Asset Return Check-in', body, footer);
  };

  window.submitReturnCheckin = function(alcId) {
    const notes = document.getElementById('ret-notes').value;
    const condition = document.getElementById('ret-condition').value;

    if (!notes) {
      showToast('Please add check-in notes', 'warning');
      return;
    }

    const alc = AssetFlowDB.getById('allocations', alcId);
    const asset = AssetFlowDB.getById('assets', alc.assetId);

    // Update allocation record
    AssetFlowDB.update('allocations', alcId, {
      actualReturnDate: new Date().toISOString().split('T')[0],
      returnNotes: notes,
      status: 'Returned'
    });

    // Reset Asset to Available
    AssetFlowDB.update('assets', alc.assetId, {
      status: 'Available',
      condition: condition
    });

    showToast(`Asset ${asset.tag} returned successfully`, 'success');
    AssetFlowDB.log(currentUser.id, currentUser.name, 'Return Asset', `Inspected & returned ${asset.name} (${asset.tag}). Condition: ${condition}`);
    
    closeModal();
    navigateTo('allocation');
  };

  // Initiate Transfer Request Modal
  window.openInitiateTransferModal = function(alcId) {
    const alc = AssetFlowDB.getById('allocations', alcId);
    if (!alc) return;
    const asset = AssetFlowDB.getById('assets', alc.assetId);
    const usersList = AssetFlowDB.getAll('users').filter(u => u.id !== alc.targetId); // exclude current holder

    const currentHolder = alc.allocatedTo === 'user' ? 
      AssetFlowDB.getById('users', alc.targetId) : 
      AssetFlowDB.getById('departments', alc.targetId);

    const body = `
      <form id="transfer-form">
        <p style="margin-bottom:1rem; font-size:0.9rem;">Asset <strong>${asset.tag} - ${asset.name}</strong> is currently held by <strong>${currentHolder.name}</strong>.</p>
        <div class="form-group">
          <label>Transfer to Employee</label>
          <select id="tf-target-user" class="form-control" required>
            <option value="">-- Select Recipient --</option>
            ${usersList.map(u => `<option value="${u.id}">${u.name} (${u.role})</option>`).join('')}
          </select>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitInitiateTransfer('${alcId}')">Submit Transfer Request</button>
    `;

    openModal('Initiate Asset Transfer', body, footer);
  };

  window.submitInitiateTransfer = function(alcId) {
    const alc = AssetFlowDB.getById('allocations', alcId);
    const targetUserId = document.getElementById('tf-target-user').value;

    if (!targetUserId) {
      showToast('Please select transfer recipient', 'warning');
      return;
    }

    const asset = AssetFlowDB.getById('assets', alc.assetId);

    // Create transfer request
    const tf = AssetFlowDB.insert('transfers', {
      assetId: alc.assetId,
      fromUserId: alc.allocatedTo === 'user' ? alc.targetId : null,
      toUserId: targetUserId,
      requestedBy: currentUser.id,
      status: 'Pending',
      requestDate: new Date().toISOString(),
      approvalDate: null
    });

    showToast(`Transfer request submitted for ${asset.tag}`, 'success');
    AssetFlowDB.log(currentUser.id, currentUser.name, 'Initiate Transfer', `Requested transfer of ${asset.name} (${asset.tag}) to user ID ${targetUserId}`);

    // Notify Approvers (Managers / Department Head)
    const deptHead = AssetFlowDB.getAll('users').find(u => u.role === 'Department Head' && u.departmentId === currentUser.departmentId);
    if (deptHead) {
      AssetFlowDB.notify(deptHead.id, 'Transfer Pending', `${currentUser.name} requested transfer of ${asset.name} (${asset.tag}).`, 'info');
    }
    
    // Notify managers
    const managers = AssetFlowDB.getAll('users').filter(u => u.role === 'Asset Manager' || u.role === 'Admin');
    managers.forEach(m => {
      AssetFlowDB.notify(m.id, 'Transfer Request', `${currentUser.name} requested transfer of ${asset.tag} to a new employee.`, 'info');
    });

    closeModal();
    navigateTo('allocation');
  };

  // Transfer approvals
  window.handleTransferApproval = function(tfId, action) {
    const tf = AssetFlowDB.getById('transfers', tfId);
    if (!tf) return;
    const asset = AssetFlowDB.getById('assets', tf.assetId);
    const recipient = AssetFlowDB.getById('users', tf.toUserId);

    if (action === 'approve') {
      // 1. Close current active allocation
      const currentAlc = AssetFlowDB.getAll('allocations').find(a => a.assetId === tf.assetId && (a.status === 'Active' || a.status === 'Overdue'));
      if (currentAlc) {
        AssetFlowDB.update('allocations', currentAlc.id, {
          actualReturnDate: new Date().toISOString().split('T')[0],
          returnNotes: 'Asset transferred to another user via approved request.',
          status: 'Returned'
        });
      }

      // 2. Create new allocation
      AssetFlowDB.insert('allocations', {
        assetId: tf.assetId,
        allocatedTo: 'user',
        targetId: tf.toUserId,
        allocatedBy: currentUser.id,
        allocationDate: new Date().toISOString().split('T')[0],
        expectedReturnDate: null,
        actualReturnDate: null,
        returnNotes: null,
        status: 'Active'
      });

      // 3. Mark transfer approved
      AssetFlowDB.update('transfers', tfId, {
        status: 'Approved',
        approvalDate: new Date().toISOString()
      });

      showToast(`Transfer approved. Asset ${asset.tag} re-allocated to ${recipient.name}.`, 'success');
      AssetFlowDB.log(currentUser.id, currentUser.name, 'Approve Transfer', `Approved transfer of ${asset.name} (${asset.tag}) to ${recipient.name}`);
      
      AssetFlowDB.notify(tf.toUserId, 'Asset Re-allocated', `Asset ${asset.name} (${asset.tag}) has been transferred to you.`, 'success');
      if (tf.fromUserId) {
        AssetFlowDB.notify(tf.fromUserId, 'Asset Transferred', `Asset ${asset.name} (${asset.tag}) has been returned and transferred to another user.`, 'info');
      }
    } else {
      // Mark transfer rejected
      AssetFlowDB.update('transfers', tfId, {
        status: 'Rejected'
      });
      showToast('Transfer request rejected', 'info');
      AssetFlowDB.log(currentUser.id, currentUser.name, 'Reject Transfer', `Rejected transfer of ${asset.name} (${asset.tag}) to ${recipient.name}`);
      AssetFlowDB.notify(tf.requestedBy, 'Transfer Rejected', `Transfer request for ${asset.tag} was rejected.`, 'danger');
    }

    navigateTo('allocation');
  };
}

// 6. Resource Booking Screen Renderer
function renderResourceBooking(container) {
  const assets = AssetFlowDB.getAll('assets').filter(a => a.isBookable);
  const bookings = AssetFlowDB.getAll('bookings');
  const users = AssetFlowDB.getAll('users');

  container.innerHTML = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; align-items:center; flex-wrap:wrap; gap:1rem;">
        <h3 style="font-size:1.1rem; font-weight:600;">Shared/Bookable Resource Calendar Scheduler</h3>
        <button class="btn btn-primary" onclick="openNewBookingModal()"><i data-lucide="calendar-plus"></i> Reserve Time Slot</button>
      </div>

      <!-- Resource List Selector -->
      <div class="filter-row" style="margin-bottom: 2rem;">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <label style="font-weight:600; font-size:0.85rem; color:var(--text-secondary);">Select Resource:</label>
          <select id="booking-resource-select" class="form-control" style="width:250px;" onchange="loadResourceSchedule(this.value)">
            ${assets.map((a, i) => `<option value="${a.id}" ${i === 0 ? 'selected' : ''}>${a.name} (${a.location})</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Timeline Schedule Grid for the day -->
      <h4 id="resource-schedule-title" style="margin-bottom:1rem; font-size:0.95rem; display:flex; align-items:center; gap:0.5rem; color:var(--primary);">
        <i data-lucide="clock"></i> Today's Reservation Timeline (July 12, 2026)
      </h4>
      <div class="timeline-grid" id="booking-timeline-container">
        <!-- Injected slots timeline -->
      </div>
    </div>

    <!-- Active Reservations List -->
    <div class="card">
      <h3 style="font-size:1.1rem; font-weight:600; margin-bottom:1rem;">Active Room / Vehicle Bookings</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Resource</th>
              <th>Booked By</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.filter(b=>b.status!=='Cancelled').length === 0 ? '<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No upcoming resource bookings.</td></tr>' : bookings.filter(b=>b.status!=='Cancelled').map(b => {
              const res = assets.find(a => a.id === b.assetId);
              const holder = users.find(u => u.id === b.userId);
              const start = new Date(b.startTime);
              const end = new Date(b.endTime);
              return `
                <tr>
                  <td><strong>${res ? res.name : 'Unknown'}</strong></td>
                  <td>${holder ? holder.name : 'Unknown'}</td>
                  <td>${start.toDateString()}</td>
                  <td><code>${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</code></td>
                  <td><code>${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</code></td>
                  <td>${b.purpose}</td>
                  <td><span class="badge ${b.status === 'Completed' ? 'badge-available' : 'badge-reserved'}">${b.status}</span></td>
                  <td>
                    ${b.status === 'Upcoming' && (b.userId === currentUser.id || currentUser.role === 'Admin') ? `
                      <button class="btn btn-danger btn-sm" onclick="cancelResourceBooking('${b.id}')" style="padding:0.35rem 0.5rem;"><i data-lucide="trash-2"></i> Cancel</button>
                    ` : '<span style="color:var(--text-muted); font-size:0.8rem;">Locked</span>'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Draw resource schedule timeline for selected resource
  window.loadResourceSchedule = function(assetId) {
    if (!assetId) return;
    const res = assets.find(a => a.id === assetId);
    document.getElementById('resource-schedule-title').innerHTML = `<i data-lucide="clock"></i> Today's Reservation Timeline - ${res.name} (July 12, 2026)`;
    
    const container = document.getElementById('booking-timeline-container');
    
    // Day spans from 08:00 to 18:00 (10 slots)
    const hours = Array.from({ length: 11 }, (_, i) => 8 + i); // 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
    
    // Fetch today's bookings for this resource
    const resBookings = bookings.filter(b => b.assetId === assetId && b.startTime.startsWith('2026-07-12') && b.status !== 'Cancelled');
    
    let timelineHTML = `
      <!-- Left Resource details -->
      <div class="timeline-resource-col">
        <div class="timeline-resource-header">Resource</div>
        <div class="timeline-resource-cell">${res.name}</div>
      </div>
      
      <!-- Right slots columns -->
      <div class="timeline-slots-col">
        <div class="timeline-slots-header-row">
          ${hours.slice(0, -1).map(h => `<div class="timeline-time-slot-header">${String(h).padStart(2, '0')}:00</div>`).join('')}
        </div>
        <div class="timeline-slots-row">
          ${hours.slice(0, -1).map(() => `<div class="timeline-slot-cell"></div>`).join('')}
          
          <!-- Inject Booking overlay elements absolute positioned -->
          ${resBookings.map(b => {
            const startHour = new Date(b.startTime).getHours() + (new Date(b.startTime).getMinutes() / 60);
            const endHour = new Date(b.endTime).getHours() + (new Date(b.endTime).getMinutes() / 60);
            
            // Grid starts at 8.0, total width is 10 hours.
            const gridStart = 8;
            const leftPct = ((startHour - gridStart) / 10) * 100;
            const widthPct = ((endHour - startHour) / 10) * 100;
            
            const booker = users.find(u => u.id === b.userId);
            
            return `
              <div class="timeline-booking-bar event-indigo" style="left:${leftPct}%; width:${widthPct}%;" title="${b.purpose} (Booked by ${booker ? booker.name : 'Unknown'})">
                ${b.purpose.substring(0, 15)}... (${booker ? booker.name.split(' ')[0] : 'User'})
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    
    container.innerHTML = timelineHTML;
    if (window.lucide) window.lucide.createIcons();
  };

  // Create Booking Modal
  window.openNewBookingModal = function() {
    const bookableAssets = AssetFlowDB.getAll('assets').filter(a => a.isBookable);
    
    const body = `
      <form id="new-booking-form">
        <div class="form-group">
          <label>Select Shared Resource</label>
          <select id="bk-asset" class="form-control" required>
            ${bookableAssets.map(a => `<option value="${a.id}">${a.name} (${a.location})</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>Booking Date</label>
          <input type="date" id="bk-date" class="form-control" value="2026-07-12" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Start Time (Hour)</label>
            <input type="time" id="bk-start" class="form-control" value="10:00" required>
          </div>
          <div class="form-group">
            <label>End Time (Hour)</label>
            <input type="time" id="bk-end" class="form-control" value="11:00" required>
          </div>
        </div>

        <div class="form-group">
          <label>Meeting Purpose / Booking Reason</label>
          <input type="text" id="bk-purpose" class="form-control" placeholder="Project Sync Meeting" required>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitResourceBooking()">Reserve Slot</button>
    `;

    openModal('Book Shared Resource', body, footer);
  };

  window.submitResourceBooking = function() {
    const assetId = document.getElementById('bk-asset').value;
    const date = document.getElementById('bk-date').value;
    const start = document.getElementById('bk-start').value;
    const end = document.getElementById('bk-end').value;
    const purpose = document.getElementById('bk-purpose').value;

    if (!assetId || !date || !start || !end || !purpose) {
      showToast('Please fill out all fields', 'warning');
      return;
    }

    const startISO = `${date}T${start}:00`;
    const endISO = `${date}T${end}:00`;

    if (new Date(startISO) >= new Date(endISO)) {
      showToast('Start time must be before End time', 'danger');
      return;
    }

    // Overlap validation check
    const bookings = AssetFlowDB.getAll('bookings');
    const hasOverlap = bookings.some(b => {
      if (b.assetId !== assetId || b.status === 'Cancelled') return false;
      const bStart = new Date(b.startTime);
      const bEnd = new Date(b.endTime);
      const newStart = new Date(startISO);
      const newEnd = new Date(endISO);
      
      // Overlap formula: (newStart < bEnd) && (newEnd > bStart)
      return (newStart < bEnd) && (newEnd > bStart);
    });

    if (hasOverlap) {
      showToast('Overlapping Slot Blocked: This slot is already booked for this resource.', 'danger');
      return;
    }

    // Register booking
    AssetFlowDB.insert('bookings', {
      assetId,
      userId: currentUser.id,
      startTime: startISO,
      endTime: endISO,
      status: 'Upcoming',
      purpose
    });

    const res = assets.find(a => a.id === assetId);
    showToast(`Successfully booked ${res.name}`, 'success');
    AssetFlowDB.log(currentUser.id, currentUser.name, 'Book Resource', `Booked ${res.name} for ${date} (${start} - ${end})`);
    
    closeModal();
    navigateTo('booking');
  };

  window.cancelResourceBooking = function(bookingId) {
    const b = AssetFlowDB.getById('bookings', bookingId);
    const res = AssetFlowDB.getById('assets', b.assetId);
    AssetFlowDB.update('bookings', bookingId, { status: 'Cancelled' });
    showToast('Reservation cancelled', 'info');
    AssetFlowDB.log(currentUser.id, currentUser.name, 'Cancel Booking', `Cancelled reservation for ${res.name}`);
    navigateTo('booking');
  };

  // Seed default timeline display
  if (assets.length > 0) {
    loadResourceSchedule(assets[0].id);
    document.getElementById('booking-resource-select').value = assets[0].id;
  }
}

// 7. Maintenance Management Screen
function renderMaintenance(container) {
  const mnts = AssetFlowDB.getAll('maintenance');
  const assets = AssetFlowDB.getAll('assets');
  const users = AssetFlowDB.getAll('users');

  container.innerHTML = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; align-items:center;">
        <h3 style="font-size:1.1rem; font-weight:600;">Maintenance Log & Repairs</h3>
        <button class="btn btn-primary" onclick="openRaiseMaintenanceModal()"><i data-lucide="shield-alert"></i> Raise Repair Ticket</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Asset Tag</th>
              <th>Asset Name</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Reported By</th>
              <th>Technician</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${mnts.length === 0 ? '<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No maintenance tickets raised.</td></tr>' : mnts.map(m => {
              const asset = assets.find(a => a.id === m.assetId);
              const reporter = users.find(u => u.id === m.reportedBy)?.name || 'Unknown';
              return `
                <tr>
                  <td><strong style="color:var(--primary);">${asset ? asset.tag : 'N/A'}</strong></td>
                  <td>${asset ? asset.name : 'Unknown'}</td>
                  <td>${m.description}</td>
                  <td><span class="badge badge-priority-${m.priority.toLowerCase()}">${m.priority}</span></td>
                  <td>${reporter}</td>
                  <td>${m.technician || '<span style="color:var(--text-muted);">Unassigned</span>'}</td>
                  <td><span class="badge badge-${m.status.toLowerCase().replace(' ', '-')}">${m.status}</span></td>
                  <td>
                    <div style="display:flex; gap:0.25rem;">
                      ${currentUser.role === 'Asset Manager' || currentUser.role === 'Admin' ? `
                        ${m.status === 'Pending' ? `
                          <button class="btn btn-success btn-sm" onclick="handleMaintenanceWorkflow('${m.id}', 'approve')" style="padding:0.35rem 0.5rem;"><i data-lucide="check"></i> Approve</button>
                          <button class="btn btn-danger btn-sm" onclick="handleMaintenanceWorkflow('${m.id}', 'reject')" style="padding:0.35rem 0.5rem;"><i data-lucide="x"></i> Reject</button>
                        ` : ''}
                        ${m.status === 'Approved' ? `
                          <button class="btn btn-primary btn-sm" onclick="openAssignTechModal('${m.id}')" style="padding:0.35rem 0.5rem;"><i data-lucide="user-check"></i> Assign Tech</button>
                        ` : ''}
                        ${m.status === 'In Progress' ? `
                          <button class="btn btn-success btn-sm" onclick="openResolveMaintenanceModal('${m.id}')" style="padding:0.35rem 0.5rem;"><i data-lucide="check-circle-2"></i> Resolve</button>
                        ` : ''}
                      ` : '<span style="color:var(--text-muted); font-size:0.8rem;">No Actions</span>'}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Raise repair ticket modal
  window.openRaiseMaintenanceModal = function() {
    const assetsList = AssetFlowDB.getAll('assets').filter(a => a.status === 'Available' || a.status === 'Allocated');
    const body = `
      <form id="maintenance-form">
        <div class="form-group">
          <label>Select Affected Asset</label>
          <select id="mnt-asset" class="form-control" required>
            <option value="">-- Choose Asset --</option>
            ${assetsList.map(a => `<option value="${a.id}">${a.tag} - ${a.name} (${a.location})</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>Issue Description</label>
          <textarea id="mnt-desc" class="form-control" placeholder="Describe the physical damage or software issue in detail..." required></textarea>
        </div>

        <div class="form-group">
          <label>Priority Level</label>
          <select id="mnt-priority" class="form-control" required>
            <option value="Low">Low (Non-urgent)</option>
            <option value="Medium" selected>Medium</option>
            <option value="High">High (Impacting daily work)</option>
            <option value="Critical">Critical (Immediate repair needed)</option>
          </select>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitMaintenanceRequest()">Submit Ticket</button>
    `;

    openModal('Raise Repair Maintenance Ticket', body, footer);
  };

  window.submitMaintenanceRequest = function() {
    const assetId = document.getElementById('mnt-asset').value;
    const description = document.getElementById('mnt-desc').value;
    const priority = document.getElementById('mnt-priority').value;

    if (!assetId || !description || !priority) {
      showToast('Please fill all fields', 'warning');
      return;
    }

    AssetFlowDB.insert('maintenance', {
      assetId,
      reportedBy: currentUser.id,
      description,
      priority,
      status: 'Pending',
      technician: null,
      requestDate: new Date().toISOString(),
      resolutionDate: null,
      resolutionNotes: null
    });

    const asset = assets.find(a => a.id === assetId);
    showToast(`Maintenance ticket created for ${asset.tag}`, 'success');
    AssetFlowDB.log(currentUser.id, currentUser.name, 'Request Maintenance', `Raised repair request for ${asset.name} (${asset.tag})`);
    
    // Notify managers
    const managers = AssetFlowDB.getAll('users').filter(u => u.role === 'Asset Manager' || u.role === 'Admin');
    managers.forEach(m => {
      AssetFlowDB.notify(m.id, 'New Maintenance Request', `A new ${priority} priority ticket has been raised for ${asset.tag}.`, 'info');
    });

    closeModal();
    navigateTo('maintenance');
  };

  // Maintenance Workflow Steps
  window.handleMaintenanceWorkflow = function(id, action) {
    const m = AssetFlowDB.getById('maintenance', id);
    const asset = AssetFlowDB.getById('assets', m.assetId);

    if (action === 'approve') {
      AssetFlowDB.update('maintenance', id, { status: 'Approved' });
      // Transition Asset status to Under Maintenance
      AssetFlowDB.update('assets', m.assetId, { status: 'Under Maintenance' });
      showToast(`Maintenance approved for ${asset.tag}`, 'success');
      AssetFlowDB.log(currentUser.id, currentUser.name, 'Approve Maintenance', `Approved maintenance request for ${asset.name} (${asset.tag})`);
      AssetFlowDB.notify(m.reportedBy, 'Maintenance Approved', `Your repair ticket for ${asset.tag} has been approved.`, 'success');
    } else if (action === 'reject') {
      AssetFlowDB.update('maintenance', id, { status: 'Rejected' });
      showToast('Maintenance request rejected', 'info');
      AssetFlowDB.log(currentUser.id, currentUser.name, 'Reject Maintenance', `Rejected maintenance request for ${asset.name} (${asset.tag})`);
      AssetFlowDB.notify(m.reportedBy, 'Maintenance Rejected', `Your repair ticket for ${asset.tag} was rejected.`, 'danger');
    }

    navigateTo('maintenance');
  };

  // Assign Technician Modal
  window.openAssignTechModal = function(id) {
    const body = `
      <form id="tech-form">
        <div class="form-group">
          <label>Assign Technician / Service Team Name</label>
          <input type="text" id="tech-name" class="form-control" placeholder="e.g. Dell IT Support Team" required>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitAssignTech('${id}')">Assign Team</button>
    `;

    openModal('Assign Maintenance Technician', body, footer);
  };

  window.submitAssignTech = function(id) {
    const tech = document.getElementById('tech-name').value;
    if (!tech) return;

    AssetFlowDB.update('maintenance', id, {
      technician: tech,
      status: 'In Progress'
    });

    const m = AssetFlowDB.getById('maintenance', id);
    const asset = AssetFlowDB.getById('assets', m.assetId);
    showToast(`Technician assigned for ${asset.tag}`, 'success');
    AssetFlowDB.log(currentUser.id, currentUser.name, 'Assign Tech', `Assigned technician ${tech} to repair ${asset.name} (${asset.tag})`);

    closeModal();
    navigateTo('maintenance');
  };

  // Resolve Maintenance Modal
  window.openResolveMaintenanceModal = function(id) {
    const body = `
      <form id="resolve-form">
        <div class="form-group">
          <label>Resolution Notes</label>
          <textarea id="res-notes" class="form-control" placeholder="Replaced screen. Everything tests fine." required></textarea>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-success" onclick="submitResolveMaintenance('${id}')">Resolve Ticket</button>
    `;

    openModal('Resolve Repair Ticket', body, footer);
  };

  window.submitResolveMaintenance = function(id) {
    const notes = document.getElementById('res-notes').value;
    if (!notes) return;

    const m = AssetFlowDB.getById('maintenance', id);
    const asset = AssetFlowDB.getById('assets', m.assetId);

    // 1. Mark Maintenance as Resolved
    AssetFlowDB.update('maintenance', id, {
      status: 'Resolved',
      resolutionDate: new Date().toISOString(),
      resolutionNotes: notes
    });

    // 2. Return Asset status back to Available
    AssetFlowDB.update('assets', m.assetId, { status: 'Available' });

    showToast(`Asset ${asset.tag} repair resolved`, 'success');
    AssetFlowDB.log(currentUser.id, currentUser.name, 'Resolve Maintenance', `Resolved repair ticket for ${asset.name} (${asset.tag}). Notes: ${notes}`);
    
    AssetFlowDB.notify(m.reportedBy, 'Repair Completed', `Maintenance ticket for ${asset.tag} has been completed and resolved.`, 'success');

    closeModal();
    navigateTo('maintenance');
  };
}

// 8. Asset Audit Screen
function renderAssetAudit(container) {
  const audits = AssetFlowDB.getAll('audits');
  const depts = AssetFlowDB.getAll('departments');
  const users = AssetFlowDB.getAll('users');

  container.innerHTML = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; align-items:center;">
        <h3 style="font-size:1.1rem; font-weight:600;">Scheduled Verification Audit Cycles</h3>
        ${currentUser.role === 'Admin' ? `
          <button class="btn btn-primary" onclick="openNewAuditModal()"><i data-lucide="plus"></i> Schedule Audit Cycle</button>
        ` : ''}
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Audit Cycle Name</th>
              <th>Scope</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Assigned Auditor(s)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${audits.length === 0 ? '<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">No verification audits scheduled.</td></tr>' : audits.map(aud => {
              const auditorNames = aud.auditors.map(aid => users.find(u => u.id === aid)?.name || 'Unknown').join(', ');
              
              const isAssignedAuditor = aud.auditors.includes(currentUser.id);
              const isActive = aud.status === 'Active';
              
              return `
                <tr>
                  <td><strong>${aud.name}</strong></td>
                  <td>${aud.scopeType === 'location' ? 'Location' : 'Department'}: <code>${aud.scopeValue}</code></td>
                  <td>${aud.startDate}</td>
                  <td>${aud.endDate}</td>
                  <td>${auditorNames}</td>
                  <td><span class="badge ${aud.status === 'Completed' ? 'badge-available' : 'badge-reserved'}">${aud.status}</span></td>
                  <td>
                    <div style="display:flex; gap:0.25rem;">
                      ${isActive && (isAssignedAuditor || currentUser.role === 'Admin') ? `
                        <button class="btn btn-primary btn-sm" onclick="openAuditPerformScreen('${aud.id}')" style="padding:0.35rem 0.5rem;"><i data-lucide="clipboard-check"></i> Audit Items</button>
                      ` : ''}
                      ${aud.status === 'Completed' ? `
                        <button class="btn btn-secondary btn-sm" onclick="viewDiscrepancyReport('${aud.id}')" style="padding:0.35rem 0.5rem;"><i data-lucide="file-text"></i> Discrepancy Report</button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Create Audit cycle Modal
  window.openNewAuditModal = function() {
    const auditorList = users.filter(u => u.role === 'Asset Manager' || u.role === 'Department Head' || u.role === 'Admin');

    const body = `
      <form id="audit-cycle-form">
        <div class="form-group">
          <label>Audit Cycle Name</label>
          <input type="text" id="aud-name" class="form-control" placeholder="Q3 Electronics Audit" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Audit Scope Mode</label>
            <select id="aud-scope-type" class="form-control" onchange="toggleAuditScopeOptions(this.value)" required>
              <option value="location">Physical Location</option>
              <option value="department">Department Allocation</option>
            </select>
          </div>
          <div class="form-group">
            <label>Scope Reference Value</label>
            <select id="aud-scope-val" class="form-control" required>
              <!-- Injected values -->
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Start Date</label>
            <input type="date" id="aud-start" class="form-control" required>
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input type="date" id="aud-end" class="form-control" required>
          </div>
        </div>

        <div class="form-group">
          <label>Assign Lead Auditor(s)</label>
          <select id="aud-auditors" class="form-control" multiple style="height:80px;" required>
            ${auditorList.map(a => `<option value="${a.id}">${a.name} (${a.role})</option>`).join('')}
          </select>
          <small style="color:var(--text-muted);">Hold Ctrl/Cmd to select multiple auditors.</small>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitCreateAuditCycle()">Launch Audit</button>
    `;

    openModal('Schedule New Audit Cycle', body, footer);
    toggleAuditScopeOptions('location');

    window.toggleAuditScopeOptions = function(type) {
      const select = document.getElementById('aud-scope-val');
      select.innerHTML = '';
      if (type === 'location') {
        const locations = [...new Set(AssetFlowDB.getAll('assets').map(a => a.location))];
        select.innerHTML = locations.map(l => `<option value="${l}">${l}</option>`).join('');
      } else {
        select.innerHTML = depts.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
      }
    };
  };

  window.submitCreateAuditCycle = function() {
    const name = document.getElementById('aud-name').value;
    const scopeType = document.getElementById('aud-scope-type').value;
    const scopeValue = document.getElementById('aud-scope-val').value;
    const start = document.getElementById('aud-start').value;
    const end = document.getElementById('aud-end').value;
    
    const auditorsSelect = document.getElementById('aud-auditors');
    const auditors = Array.from(auditorsSelect.selectedOptions).map(opt => opt.value);

    if (!name || !scopeValue || !start || !end || auditors.length === 0) {
      showToast('Please fill all fields', 'warning');
      return;
    }

    AssetFlowDB.insert('audits', {
      name,
      scopeType,
      scopeValue,
      startDate: start,
      endDate: end,
      auditors,
      status: 'Active',
      results: {},
      discrepancyReport: null
    });

    showToast(`Audit cycle ${name} scheduled successfully`, 'success');
    AssetFlowDB.log(currentUser.id, currentUser.name, 'Schedule Audit', `Created active audit cycle ${name}`);
    
    // Notify auditors
    auditors.forEach(aid => {
      AssetFlowDB.notify(aid, 'Audit Cycle Assigned', `You have been assigned as an auditor for ${name}.`, 'info');
    });

    closeModal();
    navigateTo('audit');
  };

  // Perform Audit Screen Overlay
  window.openAuditPerformScreen = function(id) {
    const aud = AssetFlowDB.getById('audits', id);
    let scopeAssets = [];
    
    if (aud.scopeType === 'location') {
      scopeAssets = AssetFlowDB.getAll('assets').filter(a => a.location === aud.scopeValue);
    } else {
      // Find allocations for the department
      const deptAlls = AssetFlowDB.getAll('allocations').filter(al => al.allocatedTo === 'department' && al.targetId === aud.scopeValue && (al.status === 'Active' || al.status === 'Overdue'));
      const deptAssetIds = deptAlls.map(a => a.assetId);
      scopeAssets = AssetFlowDB.getAll('assets').filter(a => deptAssetIds.includes(a.id));
    }

    const body = `
      <div style="margin-bottom:1.5rem;">
        <h4 style="color:var(--primary); font-size:0.95rem;">Verify items for audit cycle: ${aud.name}</h4>
        <p style="font-size:0.8rem; color:var(--text-secondary);">Mark each asset condition. Unflagged items will show as discrepant.</p>
      </div>

      <div class="table-container" style="max-height: 400px; overflow-y: auto;">
        <table>
          <thead>
            <tr>
              <th>Asset Tag</th>
              <th>Asset Name</th>
              <th>Location</th>
              <th>Condition</th>
              <th>Audit Log Actions</th>
            </tr>
          </thead>
          <tbody>
            ${scopeAssets.map(a => {
              const prevResult = aud.results[a.id] ? aud.results[a.id].status : null;
              
              return `
                <tr>
                  <td><strong style="color:var(--primary);">${a.tag}</strong></td>
                  <td>${a.name}</td>
                  <td>${a.location}</td>
                  <td>${a.condition}</td>
                  <td>
                    <div style="display:flex; gap:0.25rem;">
                      <button class="btn btn-sm ${prevResult === 'Verified' ? 'btn-success' : 'btn-secondary'}" onclick="logAuditResult('${id}', '${a.id}', 'Verified')" style="padding:0.25rem 0.4rem;">Verify</button>
                      <button class="btn btn-sm ${prevResult === 'Missing' ? 'btn-danger' : 'btn-secondary'}" onclick="logAuditResult('${id}', '${a.id}', 'Missing')" style="padding:0.25rem 0.4rem;">Missing</button>
                      <button class="btn btn-sm ${prevResult === 'Damaged' ? 'btn-warning' : 'btn-secondary'}" onclick="logAuditResult('${id}', '${a.id}', 'Damaged')" style="padding:0.25rem 0.4rem;">Damaged</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="submitCloseAuditCycle('${id}')">Lock & Close Audit Cycle</button>
    `;

    openModal(`Executing Audit: ${aud.name}`, body, footer);
  };

  // Log single asset result
  window.logAuditResult = function(auditId, assetId, status) {
    const aud = AssetFlowDB.getById('audits', auditId);
    const results = { ...aud.results };
    results[assetId] = { status, notes: `Marked ${status} by auditor.` };
    
    AssetFlowDB.update('audits', auditId, { results });
    showToast(`Logged item status as ${status}`, 'info');
    
    // Refresh modal body
    openAuditPerformScreen(auditId);
  };

  // Close audit cycle and generate discrepancies
  window.submitCloseAuditCycle = function(auditId) {
    const aud = AssetFlowDB.getById('audits', auditId);
    const assets = AssetFlowDB.getAll('assets');
    
    let scopeAssets = [];
    if (aud.scopeType === 'location') {
      scopeAssets = assets.filter(a => a.location === aud.scopeValue);
    } else {
      const deptAlls = AssetFlowDB.getAll('allocations').filter(al => al.allocatedTo === 'department' && al.targetId === aud.scopeValue && (al.status === 'Active' || al.status === 'Overdue'));
      const deptAssetIds = deptAlls.map(a => a.assetId);
      scopeAssets = assets.filter(a => deptAssetIds.includes(a.id));
    }

    const discrepancies = [];
    let missingCount = 0;
    let damagedCount = 0;
    
    scopeAssets.forEach(a => {
      const res = aud.results[a.id];
      if (!res) {
        discrepancies.push(`Discrepancy: ${a.tag} (${a.name}) was NOT verified during audit.`);
      } else if (res.status === 'Missing') {
        missingCount++;
        discrepancies.push(`Missing: ${a.tag} (${a.name}) marked as Missing.`);
        // Auto update asset status to Lost
        AssetFlowDB.update('assets', a.id, { status: 'Lost' });
      } else if (res.status === 'Damaged') {
        damagedCount++;
        discrepancies.push(`Damaged: ${a.tag} (${a.name}) marked as Damaged.`);
        // Auto create maintenance ticket
        AssetFlowDB.insert('maintenance', {
          assetId: a.id,
          reportedBy: currentUser.id,
          description: `Discovered as damaged during audit cycle: ${aud.name}`,
          priority: 'High',
          status: 'Pending',
          technician: null,
          requestDate: new Date().toISOString(),
          resolutionDate: null,
          resolutionNotes: null
        });
      }
    });

    const report = discrepancies.length === 0 ? 
      "Discrepancy Report: Audit cycle finished with zero discrepancies. All items accounted for." :
      `Discrepancy Report Summary:\n- Missing assets: ${missingCount}\n- Damaged assets: ${damagedCount}\n\nFlags logs:\n` + discrepancies.join('\n');

    AssetFlowDB.update('audits', auditId, {
      status: 'Completed',
      discrepancyReport: report
    });

    showToast(`Audit cycle closed. ${discrepancies.length} discrepancy items flagged.`, 'warning');
    AssetFlowDB.log(currentUser.id, currentUser.name, 'Close Audit', `Closed audit cycle ${aud.name} with reports.`);

    closeModal();
    navigateTo('audit');
  };

  // View Discrepancy Report Modal
  window.viewDiscrepancyReport = function(id) {
    const aud = AssetFlowDB.getById('audits', id);
    const body = `
      <div class="card" style="background-color: var(--bg-tertiary);">
        <pre style="white-space: pre-wrap; font-family: inherit; font-size: 0.9rem; line-height: 1.5; color: var(--text-primary);">${aud.discrepancyReport}</pre>
      </div>
    `;
    openModal(`Discrepancy Report: ${aud.name}`, body, `<button class="btn btn-secondary" onclick="closeModal()">Close</button>`);
  };
}

// 9. Reports & Analytics Screen
function renderReports(container) {
  const assets = AssetFlowDB.getAll('assets');
  const cats = AssetFlowDB.getAll('categories');
  const mnts = AssetFlowDB.getAll('maintenance');
  const bkgs = AssetFlowDB.getAll('bookings');
  
  // Compute analytics
  // 1. Utilization
  const catUtilization = cats.map(c => {
    const catAssets = assets.filter(a => a.categoryId === c.id);
    const total = catAssets.length;
    const allocated = catAssets.filter(a => a.status === 'Allocated' || a.status === 'Reserved').length;
    const pct = total > 0 ? Math.round((allocated / total) * 100) : 0;
    return { name: c.name, total, allocated, pct };
  });

  // 2. Maintenance frequency
  const mntFrequency = cats.map(c => {
    const catAssets = assets.filter(a => a.categoryId === c.id).map(a => a.id);
    const totalMnts = mnts.filter(m => catAssets.includes(m.assetId)).length;
    return { name: c.name, count: totalMnts };
  });

  // 3. Peak booking slots (heatmap)
  // Let's count booking counts grouped by hour of start times (09:00 to 17:00)
  const hourBookings = Array.from({ length: 9 }, (_, i) => 9 + i).map(h => {
    const count = bkgs.filter(b => {
      const hour = new Date(b.startTime).getHours();
      return hour === h && b.status !== 'Cancelled';
    }).length;
    return { hour: `${String(h).padStart(2, '0')}:00`, count };
  });

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; align-items:center;">
      <h3 style="font-size:1.1rem; font-weight:600;">Organization Analytics & Insights</h3>
      <button class="btn btn-secondary" onclick="exportReportsCSV()"><i data-lucide="download"></i> Export Data (CSV)</button>
    </div>

    <div class="analytics-grid">
      <!-- Utilization Trends -->
      <div class="card">
        <h4 style="font-size:0.95rem; font-weight:600; color:var(--primary); margin-bottom:1.25rem;">Asset Utilization Trends by Category</h4>
        <div class="bar-chart-container">
          ${catUtilization.map(u => `
            <div class="bar-row">
              <span class="bar-label">${u.name}</span>
              <div class="bar-track">
                <div class="bar-fill" style="width:${u.pct}%"></div>
              </div>
              <span class="bar-value">${u.pct}%</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Maintenance Frequency -->
      <div class="card">
        <h4 style="font-size:0.95rem; font-weight:600; color:var(--accent); margin-bottom:1.25rem;">Maintenance Frequency by Category</h4>
        <div class="bar-chart-container">
          ${mntFrequency.map(f => {
            const maxVal = Math.max(...mntFrequency.map(x=>x.count), 1);
            const pct = Math.round((f.count / maxVal) * 100);
            return `
              <div class="bar-row">
                <span class="bar-label">${f.name}</span>
                <div class="bar-track">
                  <div class="bar-fill" style="width:${pct}%; background:linear-gradient(90deg, var(--accent) 0%, var(--danger) 100%);"></div>
                </div>
                <span class="bar-value">${f.count}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Booking Heatmap Card -->
    <div class="card">
      <h4 style="font-size:0.95rem; font-weight:600; color:var(--success); margin-bottom:1rem;">Peak Resource Reservation Heatmap (Hourly)</h4>
      <div style="display:flex; gap:0.5rem; justify-content:space-between; flex-wrap:wrap; margin-top:1rem;">
        ${hourBookings.map(hb => {
          let color = 'rgba(255, 255, 255, 0.02)';
          if (hb.count > 0 && hb.count <= 1) color = 'rgba(99, 102, 241, 0.2)';
          if (hb.count > 1 && hb.count <= 3) color = 'rgba(99, 102, 241, 0.5)';
          if (hb.count > 3) color = 'var(--primary)';
          
          return `
            <div style="flex-grow:1; min-width:80px; text-align:center; padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); background-color:${color};">
              <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:0.25rem;">${hb.hour}</div>
              <strong style="font-size:1.2rem;">${hb.count}</strong>
              <div style="font-size:0.7rem; color:var(--text-muted);">Bookings</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Export Analytics CSV
  window.exportReportsCSV = function() {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Utilization
    csvContent += "--- UTILIZATION REPORT ---\nCategory,Total,Allocated,Percentage\n";
    catUtilization.forEach(u => {
      csvContent += `${u.name},${u.total},${u.allocated},${u.pct}%\n`;
    });
    
    // Maintenance
    csvContent += "\n--- MAINTENANCE FREQUENCY ---\nCategory,Repairs Count\n";
    mntFrequency.forEach(f => {
      csvContent += `${f.name},${f.count}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "AssetFlow_Analytics_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Analytics CSV report generated and downloaded.', 'success');
  };
}

// 10. Activity Logs & Notifications Screen
function renderActivityLogs(container) {
  const logs = AssetFlowDB.getAll('logs').sort((a,b)=> new Date(b.timestamp) - new Date(a.timestamp));

  container.innerHTML = `
    <div class="card">
      <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; align-items:center;">
        <h3 style="font-size:1.1rem; font-weight:600;">System Security Audit Trail Logs</h3>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Operator Account</th>
              <th>Operation Action</th>
              <th>Details / Log Statement</th>
            </tr>
          </thead>
          <tbody>
            ${logs.length === 0 ? '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No activity logs found.</td></tr>' : logs.map(l => {
              const t = new Date(l.timestamp);
              return `
                <tr>
                  <td style="color:var(--text-muted);"><code>${t.toLocaleString()}</code></td>
                  <td><strong>${l.userName}</strong></td>
                  <td><span class="badge badge-reserved" style="font-weight:600;">${l.action}</span></td>
                  <td><code>${l.details}</code></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
