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

