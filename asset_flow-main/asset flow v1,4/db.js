// db.js - Mock Database module using localStorage for AssetFlow ERP

const DB_KEY = 'assetflow_db';

const defaultSeed = {
  users: [
    { id: 'usr-1', name: 'System Admin', email: 'admin@assetflow.com', password: 'admin123', role: 'Admin', departmentId: 'dept-1', status: 'Active' },
    { id: 'usr-2', name: 'Sarah Connor', email: 'sarah.c@assetflow.com', password: 'manager123', role: 'Asset Manager', departmentId: 'dept-1', status: 'Active' },
    { id: 'usr-3', name: 'John Doe', email: 'john.d@assetflow.com', password: 'user123', role: 'Department Head', departmentId: 'dept-2', status: 'Active' },
    { id: 'usr-4', name: 'Priya Sharma', email: 'priya.s@assetflow.com', password: 'user123', role: 'Employee', departmentId: 'dept-2', status: 'Active' },
    { id: 'usr-5', name: 'Raj Patel', email: 'raj.p@assetflow.com', password: 'user123', role: 'Employee', departmentId: 'dept-3', status: 'Active' },
    { id: 'usr-6', name: 'Alex Wong', email: 'alex.w@assetflow.com', password: 'user123', role: 'Employee', departmentId: 'dept-2', status: 'Active' },
    { id: 'usr-7', name: 'Emily Davis', email: 'emily.d@assetflow.com', password: 'user123', role: 'Employee', departmentId: 'dept-3', status: 'Active' }
  ],
  departments: [
    { id: 'dept-1', name: 'Operations & IT', headId: 'usr-2', parentId: null, status: 'Active' },
    { id: 'dept-2', name: 'Engineering', headId: 'usr-3', parentId: 'dept-1', status: 'Active' },
    { id: 'dept-3', name: 'Human Resources', headId: null, parentId: 'dept-1', status: 'Active' }
  ],
  categories: [
    { id: 'cat-1', name: 'Electronics', description: 'Computers, Phones, Monitors, etc.', fields: [{ name: 'Warranty (months)', type: 'number' }, { name: 'Processor', type: 'text' }] },
    { id: 'cat-2', name: 'Furniture', description: 'Desks, Chairs, Filing cabinets, etc.', fields: [{ name: 'Material', type: 'text' }] },
    { id: 'cat-3', name: 'Vehicles', description: 'Company cars, vans, shuttle buses', fields: [{ name: 'License Plate', type: 'text' }, { name: 'Fuel Type', type: 'text' }] },
    { id: 'cat-4', name: 'Facilities', description: 'Meeting rooms, conference halls, labs', fields: [{ name: 'Capacity', type: 'number' }] }
  ],
  assets: [
    { id: 'ast-1', name: 'MacBook Pro 16"', categoryId: 'cat-1', tag: 'AF-0001', serialNumber: 'C02DF431MD6M', acquisitionDate: '2025-01-15', acquisitionCost: 2499, condition: 'New', location: 'HQ - Floor 3', isBookable: false, status: 'Allocated', customFields: { 'Warranty (months)': '36', 'Processor': 'M3 Max' } },
    { id: 'ast-2', name: 'ThinkPad T14', categoryId: 'cat-1', tag: 'AF-0002', serialNumber: 'PF3Z213A', acquisitionDate: '2025-02-10', acquisitionCost: 1350, condition: 'Good', location: 'HQ - Floor 2', isBookable: false, status: 'Available', customFields: { 'Warranty (months)': '24', 'Processor': 'Intel i7' } },
    { id: 'ast-3', name: 'Ergonomic Mesh Chair', categoryId: 'cat-2', tag: 'AF-0003', serialNumber: 'CH-88214', acquisitionDate: '2024-11-05', acquisitionCost: 450, condition: 'Good', location: 'HQ - Room 204', isBookable: false, status: 'Available', customFields: { 'Material': 'Mesh/Aluminum' } },
    { id: 'ast-4', name: 'Tesla Model 3', categoryId: 'cat-3', tag: 'AF-0004', serialNumber: '5YJ3E1EB9L', acquisitionDate: '2024-06-20', acquisitionCost: 38000, condition: 'Good', location: 'Garage A', isBookable: true, status: 'Available', customFields: { 'License Plate': 'CA-998XX', 'Fuel Type': 'Electric' } },
    { id: 'ast-5', name: 'Conference Room Alpha', categoryId: 'cat-4', tag: 'AF-0005', serialNumber: 'N/A', acquisitionDate: '2022-09-01', acquisitionCost: 5000, condition: 'Good', location: 'HQ - Floor 1', isBookable: true, status: 'Available', customFields: { 'Capacity': '12' } },
    { id: 'ast-6', name: 'iPad Pro 11"', categoryId: 'cat-1', tag: 'AF-0006', serialNumber: 'DLX299881', acquisitionDate: '2025-03-01', acquisitionCost: 899, condition: 'New', location: 'HQ - IT Cabinet', isBookable: false, status: 'Under Maintenance', customFields: { 'Warranty (months)': '12', 'Processor': 'M2' } },
    { id: 'ast-7', name: 'Dell UltraSharp 34"', categoryId: 'cat-1', tag: 'AF-0007', serialNumber: 'CN-0HG928', acquisitionDate: '2024-08-15', acquisitionCost: 799, condition: 'Fair', location: 'HQ - Room 302', isBookable: false, status: 'Allocated', customFields: { 'Warranty (months)': '36', 'Processor': 'N/A' } }
  ],
  allocations: [
    { id: 'alc-1', assetId: 'ast-1', allocatedTo: 'user', targetId: 'usr-4', allocatedBy: 'usr-2', allocationDate: '2025-01-16', expectedReturnDate: '2026-01-16', actualReturnDate: null, returnNotes: null, status: 'Active' },
    { id: 'alc-2', assetId: 'ast-7', allocatedTo: 'user', targetId: 'usr-3', allocatedBy: 'usr-2', allocationDate: '2024-08-16', expectedReturnDate: '2026-07-10', actualReturnDate: null, returnNotes: null, status: 'Overdue' }
  ],
  transfers: [],
  bookings: [
    { id: 'bkg-1', assetId: 'ast-5', userId: 'usr-4', startTime: '2026-07-12T10:00:00', endTime: '2026-07-12T11:30:00', status: 'Upcoming', purpose: 'Sprint Planning Meeting' },
    { id: 'bkg-2', assetId: 'ast-4', userId: 'usr-3', startTime: '2026-07-12T13:00:00', endTime: '2026-07-12T17:00:00', status: 'Upcoming', purpose: 'Client Onsite Visit' }
  ],
  maintenance: [
    { id: 'mnt-1', assetId: 'ast-6', reportedBy: 'usr-4', description: 'Screen flickering issue and battery draining rapidly.', priority: 'High', status: 'Approved', technician: 'TechSquad Solutions', requestDate: '2026-07-10T11:00:00', resolutionDate: null, resolutionNotes: null }
  ],
  audits: [
    {
      id: 'aud-1',
      name: 'Q2 HQ Floor 3 Audit',
      scopeType: 'location',
      scopeValue: 'HQ - Floor 3',
      startDate: '2026-06-01',
      endDate: '2026-06-05',
      auditors: ['usr-2'],
      status: 'Completed',
      results: {
        'ast-1': { status: 'Verified', notes: 'Asset in pristine condition.' }
      },
      discrepancyReport: 'Audit completed successfully. All items verified.'
    }
  ],
  logs: [
    { id: 'log-1', userId: 'usr-2', userName: 'Sarah Connor', action: 'Asset Registered', details: 'Registered new asset MacBook Pro 16" (AF-0001)', timestamp: '2025-01-15T10:00:00' },
    { id: 'log-2', userId: 'usr-2', userName: 'Sarah Connor', action: 'Asset Allocated', details: 'Allocated AF-0001 to Priya Sharma', timestamp: '2025-01-16T11:00:00' }
  ],
  notifications: [
    { id: 'ntf-1', userId: 'usr-4', title: 'Asset Allocated', message: 'You have been allocated MacBook Pro 16" (AF-0001). Expected return date: 2026-01-16.', type: 'success', read: false, timestamp: '2025-01-16T11:00:00' },
    { id: 'ntf-2', userId: 'usr-3', title: 'Overdue Asset Return', message: 'Your allocation of Dell UltraSharp 34" (AF-0007) is past its expected return date.', type: 'danger', read: false, timestamp: '2026-07-11T09:00:00' }
  ]
};

// Database interface
const AssetFlowDB = {
  data: null,

  init() {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
      } else {
        this.data = JSON.parse(JSON.stringify(defaultSeed));
        this.save();
      }
    } catch (e) {
      console.error('Failed to parse database, resetting to default.', e);
      this.data = JSON.parse(JSON.stringify(defaultSeed));
      this.save();
    }
  },

  save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.data));
  },

  // Generic helpers
  getAll(table) {
    return this.data[table] || [];
  },

  getById(table, id) {
    return this.getAll(table).find(item => item.id === id);
  },

  insert(table, item) {
    const tableData = this.getAll(table);
    const prefix = table.substring(0, 3).toLowerCase();
    const id = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newItem = { id, ...item };
    tableData.push(newItem);
    this.data[table] = tableData;
    this.save();
    return newItem;
  },

  update(table, id, updates) {
    const tableData = this.getAll(table);
    const index = tableData.findIndex(item => item.id === id);
    if (index !== -1) {
      tableData[index] = { ...tableData[index], ...updates };
      this.data[table] = tableData;
      this.save();
      return tableData[index];
    }
    return null;
  },

  delete(table, id) {
    const tableData = this.getAll(table);
    const index = tableData.findIndex(item => item.id === id);
    if (index !== -1) {
      const deleted = tableData.splice(index, 1);
      this.data[table] = tableData;
      this.save();
      return deleted[0];
    }
    return null;
  },

  // Structured log helper
  log(userId, userName, action, details) {
    this.insert('logs', {
      userId,
      userName,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  },

  // Structured notification helper
  notify(userId, title, message, type = 'info') {
    this.insert('notifications', {
      userId,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    });
  }
};

// Auto initialize on import/load
AssetFlowDB.init();
window.AssetFlowDB = AssetFlowDB;
