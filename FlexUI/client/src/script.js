// HRMS Application - Complete Vanilla JavaScript Implementation
// All functionality for Employee, Department, Attendance, Leave, Payroll, and Performance Management

class HRMSApp {
    constructor() {
        this.currentUser = {
            id: 'admin',
            name: 'John Admin',
            role: 'HR Manager',
            email: 'admin@company.com'
        };
        
        this.charts = {};
        this.currentSection = 'dashboard';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortField = '';
        this.sortDirection = 'asc';
        this.searchQuery = '';
        this.filterDepartment = '';
        
        this.init();
    }

    // Initialize the application
    init() {
        this.initializeLocalStorage();
        this.initializeEventListeners();
        this.initializeCharts();
        this.loadDashboard();
        this.updateStatistics();
        
        // Set current date for attendance
        const today = new Date().toISOString().split('T')[0];
        const attendanceDateInput = document.getElementById('attendanceDate');
        if (attendanceDateInput) {
            attendanceDateInput.value = today;
        }
        
        console.log('HRMS Application initialized successfully');
    }

    // Initialize local storage with default structure
    initializeLocalStorage() {
        const defaultData = {
            employees: [],
            departments: [],
            attendance: [],
            leaves: [],
            payroll: [],
            performance: [],
            settings: {
                lastBackup: null,
                leaveTypes: ['annual', 'sick', 'personal', 'maternity', 'emergency'],
                leaveBalances: {}
            },
            activities: []
        };

        if (!localStorage.getItem('hrms_data')) {
            localStorage.setItem('hrms_data', JSON.stringify(defaultData));
            this.addActivity('System initialized', 'system');
        }
    }

    // Get data from local storage
    getData() {
        return JSON.parse(localStorage.getItem('hrms_data')) || {};
    }

    // Save data to local storage
    saveData(data) {
        localStorage.setItem('hrms_data', JSON.stringify(data));
    }

    // Add activity log
    addActivity(message, type = 'info', userId = null) {
        const data = this.getData();
        const activity = {
            id: this.generateId(),
            message,
            type,
            userId: userId || this.currentUser.id,
            userName: this.currentUser.name,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        
        data.activities = data.activities || [];
        data.activities.unshift(activity);
        
        // Keep only last 50 activities
        if (data.activities.length > 50) {
            data.activities = data.activities.slice(0, 50);
        }
        
        this.saveData(data);
        this.loadRecentActivities();
    }

    // Generate unique ID
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Sidebar toggle
        this.initializeSidebarToggle();

        // Employee management
        this.initializeEmployeeEvents();

        // Department management
        this.initializeDepartmentEvents();

        // Attendance management
        this.initializeAttendanceEvents();

        // Leave management
        this.initializeLeaveEvents();

        // Payroll management
        this.initializePayrollEvents();

        // Performance management
        this.initializePerformanceEvents();

        // Export and backup
        this.initializeExportEvents();

        // Search and filter
        this.initializeSearchAndFilter();

        // Table sorting
        this.initializeTableSorting();
    }

    // Initialize sidebar toggle functionality
    initializeSidebarToggle() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarClose = document.getElementById('sidebarClose');

        const toggleSidebar = (show = null) => {
            if (show === null) {
                sidebar.classList.toggle('-translate-x-full');
            } else if (show) {
                sidebar.classList.remove('-translate-x-full');
            } else {
                sidebar.classList.add('-translate-x-full');
            }
        };

        sidebarToggle?.addEventListener('click', () => toggleSidebar());
        sidebarClose?.addEventListener('click', () => toggleSidebar(false));

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 1024 && 
                !sidebar.contains(e.target) && 
                !sidebarToggle?.contains(e.target)) {
                toggleSidebar(false);
            }
        });
    }

    // Navigation between sections
    navigateToSection(sectionName) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

        // Show target section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');
        }

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'employees': 'Employee Management',
            'recruitment': 'Recruitment & Onboarding',
            'departments': 'Organization Structure',
            'attendance': 'Time & Attendance',
            'shifts': 'Shift Management',
            'leave': 'Leave Management',
            'payroll': 'Payroll Processing',
            'benefits': 'Benefits Administration',
            'expenses': 'Expense Management',
            'performance': 'Performance Management',
            'learning': 'Learning & Development',
            'talent': 'Talent Management',
            'engagement': 'Employee Engagement',
            'communication': 'Communication Hub',
            'analytics': 'HR Analytics',
            'compliance': 'Compliance Management',
            'ess': 'Employee Self Service',
            'mss': 'Manager Self Service',
            'settings': 'System Configuration'
        };

        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = titles[sectionName] || 'Dashboard';
        }

        this.currentSection = sectionName;

        // Load section-specific data
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'employees':
                this.loadEmployees();
                break;
            case 'recruitment':
                this.loadRecruitment();
                break;
            case 'departments':
                this.loadDepartments();
                break;
            case 'attendance':
                this.loadAttendance();
                break;
            case 'shifts':
                this.loadShifts();
                break;
            case 'leave':
                this.loadLeaves();
                break;
            case 'payroll':
                this.loadPayroll();
                break;
            case 'benefits':
                this.loadBenefits();
                break;
            case 'expenses':
                this.loadExpenses();
                break;
            case 'performance':
                this.loadPerformance();
                break;
            case 'learning':
                this.loadLearning();
                break;
            case 'talent':
                this.loadTalent();
                break;
            case 'engagement':
                this.loadEngagement();
                break;
            case 'communication':
                this.loadCommunication();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'compliance':
                this.loadCompliance();
                break;
            case 'ess':
                this.loadESS();
                break;
            case 'mss':
                this.loadMSS();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }

        // Close sidebar on mobile
        if (window.innerWidth < 1024) {
            document.getElementById('sidebar')?.classList.add('-translate-x-full');
        }
    }

    // Employee Management Functions
    initializeEmployeeEvents() {
        const addBtn = document.getElementById('addEmployeeBtn');
        const modal = document.getElementById('employeeModal');
        const closeBtn = document.getElementById('closeEmployeeModal');
        const cancelBtn = document.getElementById('cancelEmployee');
        const form = document.getElementById('employeeForm');

        addBtn?.addEventListener('click', () => this.showEmployeeModal());
        closeBtn?.addEventListener('click', () => this.hideEmployeeModal());
        cancelBtn?.addEventListener('click', () => this.hideEmployeeModal());

        // Close modal when clicking outside
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideEmployeeModal();
            }
        });

        // Form submission
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEmployee();
        });

        // Print employees
        document.getElementById('printEmployees')?.addEventListener('click', () => {
            this.printEmployees();
        });
    }

    showEmployeeModal(employee = null) {
        const modal = document.getElementById('employeeModal');
        const title = document.getElementById('employeeModalTitle');
        const form = document.getElementById('employeeForm');

        if (employee) {
            title.textContent = 'Edit Employee';
            this.populateEmployeeForm(employee);
            form.dataset.employeeId = employee.id;
        } else {
            title.textContent = 'Add New Employee';
            form.reset();
            delete form.dataset.employeeId;
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    hideEmployeeModal() {
        const modal = document.getElementById('employeeModal');
        const form = document.getElementById('employeeForm');
        
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        form.reset();
        delete form.dataset.employeeId;
    }

    populateEmployeeForm(employee) {
        document.getElementById('firstName').value = employee.firstName || '';
        document.getElementById('lastName').value = employee.lastName || '';
        document.getElementById('email').value = employee.email || '';
        document.getElementById('phone').value = employee.phone || '';
        document.getElementById('department').value = employee.department || '';
        document.getElementById('position').value = employee.position || '';
        document.getElementById('hireDate').value = employee.hireDate || '';
        document.getElementById('salary').value = employee.salary || '';
        document.getElementById('address').value = employee.address || '';
    }

    saveEmployee() {
        this.showLoading();

        const form = document.getElementById('employeeForm');
        const formData = new FormData(form);
        const employeeId = form.dataset.employeeId;

        const employee = {
            id: employeeId || this.generateId(),
            firstName: formData.get('firstName') || document.getElementById('firstName').value,
            lastName: formData.get('lastName') || document.getElementById('lastName').value,
            email: formData.get('email') || document.getElementById('email').value,
            phone: formData.get('phone') || document.getElementById('phone').value,
            department: formData.get('department') || document.getElementById('department').value,
            position: formData.get('position') || document.getElementById('position').value,
            hireDate: formData.get('hireDate') || document.getElementById('hireDate').value,
            salary: parseFloat(formData.get('salary') || document.getElementById('salary').value) || 0,
            address: formData.get('address') || document.getElementById('address').value,
            status: 'active',
            createdAt: employeeId ? undefined : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Validate required fields
        if (!employee.firstName || !employee.lastName || !employee.email || !employee.department || !employee.position) {
            this.hideLoading();
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(employee.email)) {
            this.hideLoading();
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        const data = this.getData();
        
        if (employeeId) {
            // Update existing employee
            const index = data.employees.findIndex(emp => emp.id === employeeId);
            if (index !== -1) {
                data.employees[index] = { ...data.employees[index], ...employee };
                this.addActivity(`Updated employee ${employee.firstName} ${employee.lastName}`, 'update');
            }
        } else {
            // Add new employee
            data.employees.push(employee);
            this.addActivity(`Added new employee ${employee.firstName} ${employee.lastName}`, 'create');
        }

        this.saveData(data);

        setTimeout(() => {
            this.hideLoading();
            this.hideEmployeeModal();
            this.loadEmployees();
            this.updateStatistics();
            this.showNotification(
                employeeId ? 'Employee updated successfully!' : 'Employee added successfully!', 
                'success'
            );
        }, 1000);
    }

    loadEmployees() {
        const data = this.getData();
        let employees = [...(data.employees || [])];

        // Apply search filter
        if (this.searchQuery) {
            employees = employees.filter(emp => 
                emp.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                emp.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                emp.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                emp.position.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        // Apply department filter
        if (this.filterDepartment) {
            employees = employees.filter(emp => emp.department === this.filterDepartment);
        }

        // Apply sorting
        if (this.sortField) {
            employees.sort((a, b) => {
                let aVal = a[this.sortField];
                let bVal = b[this.sortField];
                
                if (this.sortField === 'name') {
                    aVal = `${a.firstName} ${a.lastName}`;
                    bVal = `${b.firstName} ${b.lastName}`;
                }
                
                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }
                
                if (this.sortDirection === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
        }

        this.renderEmployeeTable(employees);
        this.updateEmployeePagination(employees.length);
    }

    renderEmployeeTable(employees) {
        const tbody = document.getElementById('employeeTableBody');
        if (!tbody) return;

        if (employees.length === 0) {
            tbody.innerHTML = `
                <tr id="noEmployeesRow">
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                        <i class="fas fa-users text-4xl mb-4"></i>
                        <p>No employees found</p>
                    </td>
                </tr>
            `;
            return;
        }

        // Pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedEmployees = employees.slice(startIndex, endIndex);

        tbody.innerHTML = paginatedEmployees.map(employee => `
            <tr data-employee-id="${employee.id}">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${employee.id.substring(0, 8)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img class="h-8 w-8 rounded-full" src="https://ui-avatars.com/api/?name=${encodeURIComponent(employee.firstName + ' ' + employee.lastName)}&background=1976D2&color=fff" alt="Employee">
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${employee.firstName} ${employee.lastName}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${employee.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${employee.department}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${employee.position}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button class="text-primary hover:text-blue-700 edit-employee" data-id="${employee.id}" data-testid="button-edit-employee-${employee.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900 delete-employee" data-id="${employee.id}" data-testid="button-delete-employee-${employee.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add event listeners for edit and delete buttons
        tbody.querySelectorAll('.edit-employee').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const employeeId = e.currentTarget.getAttribute('data-id');
                const employee = employees.find(emp => emp.id === employeeId);
                if (employee) {
                    this.showEmployeeModal(employee);
                }
            });
        });

        tbody.querySelectorAll('.delete-employee').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const employeeId = e.currentTarget.getAttribute('data-id');
                this.deleteEmployee(employeeId);
            });
        });
    }

    updateEmployeePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const paginationInfo = document.getElementById('employeePaginationInfo');
        
        if (paginationInfo) {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endIndex = Math.min(this.currentPage * this.itemsPerPage, totalItems);
            paginationInfo.textContent = `Showing ${startIndex} to ${endIndex} of ${totalItems} results`;
        }
    }

    deleteEmployee(employeeId) {
        if (!confirm('Are you sure you want to delete this employee?')) {
            return;
        }

        const data = this.getData();
        const employeeIndex = data.employees.findIndex(emp => emp.id === employeeId);
        
        if (employeeIndex !== -1) {
            const employee = data.employees[employeeIndex];
            data.employees.splice(employeeIndex, 1);
            this.saveData(data);
            this.addActivity(`Deleted employee ${employee.firstName} ${employee.lastName}`, 'delete');
            this.loadEmployees();
            this.updateStatistics();
            this.showNotification('Employee deleted successfully!', 'success');
        }
    }

    printEmployees() {
        const data = this.getData();
        const employees = data.employees || [];
        
        const printContent = `
            <div style="padding: 20px; font-family: Arial, sans-serif;">
                <h1 style="text-align: center; margin-bottom: 30px;">Employee List</h1>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: #f3f4f6;">
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Name</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Email</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Department</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Position</th>
                            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Hire Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${employees.map(emp => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 12px;">${emp.firstName} ${emp.lastName}</td>
                                <td style="border: 1px solid #ddd; padding: 12px;">${emp.email}</td>
                                <td style="border: 1px solid #ddd; padding: 12px;">${emp.department}</td>
                                <td style="border: 1px solid #ddd; padding: 12px;">${emp.position}</td>
                                <td style="border: 1px solid #ddd; padding: 12px;">${emp.hireDate}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p style="text-align: center; color: #666; font-size: 12px;">
                    Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
                </p>
            </div>
        `;

        printJS({
            printable: printContent,
            type: 'raw-html',
            style: '@media print { body { margin: 0; } }'
        });
    }

    // Department Management Functions
    initializeDepartmentEvents() {
        const addBtn = document.getElementById('addDepartmentBtn');
        const modal = document.getElementById('departmentModal');
        const closeBtn = document.getElementById('closeDepartmentModal');
        const cancelBtn = document.getElementById('cancelDepartment');
        const form = document.getElementById('departmentForm');

        addBtn?.addEventListener('click', () => this.showDepartmentModal());
        closeBtn?.addEventListener('click', () => this.hideDepartmentModal());
        cancelBtn?.addEventListener('click', () => this.hideDepartmentModal());

        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideDepartmentModal();
            }
        });

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDepartment();
        });
    }

    showDepartmentModal(department = null) {
        const modal = document.getElementById('departmentModal');
        const title = document.getElementById('departmentModalTitle');
        const form = document.getElementById('departmentForm');

        if (department) {
            title.textContent = 'Edit Department';
            this.populateDepartmentForm(department);
            form.dataset.departmentId = department.id;
        } else {
            title.textContent = 'Add New Department';
            form.reset();
            delete form.dataset.departmentId;
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    hideDepartmentModal() {
        const modal = document.getElementById('departmentModal');
        const form = document.getElementById('departmentForm');
        
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        form.reset();
        delete form.dataset.departmentId;
    }

    populateDepartmentForm(department) {
        document.getElementById('departmentName').value = department.name || '';
        document.getElementById('departmentManager').value = department.manager || '';
        document.getElementById('departmentBudget').value = department.budget || '';
        document.getElementById('departmentDescription').value = department.description || '';
    }

    saveDepartment() {
        this.showLoading();

        const form = document.getElementById('departmentForm');
        const departmentId = form.dataset.departmentId;

        const department = {
            id: departmentId || this.generateId(),
            name: document.getElementById('departmentName').value,
            manager: document.getElementById('departmentManager').value,
            budget: parseFloat(document.getElementById('departmentBudget').value) || 0,
            description: document.getElementById('departmentDescription').value,
            employees: 0,
            createdAt: departmentId ? undefined : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (!department.name || !department.manager) {
            this.hideLoading();
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const data = this.getData();
        
        if (departmentId) {
            const index = data.departments.findIndex(dept => dept.id === departmentId);
            if (index !== -1) {
                data.departments[index] = { ...data.departments[index], ...department };
                this.addActivity(`Updated department ${department.name}`, 'update');
            }
        } else {
            data.departments.push(department);
            this.addActivity(`Added new department ${department.name}`, 'create');
        }

        this.saveData(data);

        setTimeout(() => {
            this.hideLoading();
            this.hideDepartmentModal();
            this.loadDepartments();
            this.updateStatistics();
            this.showNotification(
                departmentId ? 'Department updated successfully!' : 'Department added successfully!', 
                'success'
            );
        }, 1000);
    }

    loadDepartments() {
        const data = this.getData();
        const departments = data.departments || [];
        
        // Calculate employee count for each department
        departments.forEach(dept => {
            dept.employees = data.employees.filter(emp => emp.department === dept.name.toLowerCase()).length;
        });

        this.renderDepartments(departments);
    }

    renderDepartments(departments) {
        const container = document.getElementById('departmentsContainer');
        if (!container) return;

        if (departments.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-8 col-span-full" id="noDepartmentsMessage">
                    <i class="fas fa-building text-4xl mb-4"></i>
                    <p>No departments found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = departments.map(dept => `
            <div class="border rounded-lg p-6 hover:shadow-md transition-shadow duration-200" data-department-id="${dept.id}">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-semibold text-gray-800">${dept.name}</h4>
                    <div class="flex space-x-2">
                        <button class="text-primary hover:text-blue-700 edit-department" data-id="${dept.id}" data-testid="button-edit-department-${dept.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-900 delete-department" data-id="${dept.id}" data-testid="button-delete-department-${dept.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="space-y-2">
                    <p class="text-sm text-gray-600"><strong>Manager:</strong> ${dept.manager}</p>
                    <p class="text-sm text-gray-600"><strong>Employees:</strong> ${dept.employees}</p>
                    <p class="text-sm text-gray-600"><strong>Budget:</strong> $${dept.budget.toLocaleString()}</p>
                    ${dept.description ? `<p class="text-sm text-gray-600"><strong>Description:</strong> ${dept.description}</p>` : ''}
                </div>
            </div>
        `).join('');

        // Add event listeners
        container.querySelectorAll('.edit-department').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const deptId = e.currentTarget.getAttribute('data-id');
                const department = departments.find(dept => dept.id === deptId);
                if (department) {
                    this.showDepartmentModal(department);
                }
            });
        });

        container.querySelectorAll('.delete-department').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const deptId = e.currentTarget.getAttribute('data-id');
                this.deleteDepartment(deptId);
            });
        });
    }

    deleteDepartment(departmentId) {
        if (!confirm('Are you sure you want to delete this department?')) {
            return;
        }

        const data = this.getData();
        const deptIndex = data.departments.findIndex(dept => dept.id === departmentId);
        
        if (deptIndex !== -1) {
            const department = data.departments[deptIndex];
            data.departments.splice(deptIndex, 1);
            this.saveData(data);
            this.addActivity(`Deleted department ${department.name}`, 'delete');
            this.loadDepartments();
            this.updateStatistics();
            this.showNotification('Department deleted successfully!', 'success');
        }
    }

    // Attendance Management Functions
    initializeAttendanceEvents() {
        const markBtn = document.getElementById('markAttendanceBtn');
        const reportsBtn = document.getElementById('viewReportsBtn');
        const dateInput = document.getElementById('attendanceDate');

        markBtn?.addEventListener('click', () => this.markAttendance());
        reportsBtn?.addEventListener('click', () => this.viewAttendanceReports());
        dateInput?.addEventListener('change', () => this.loadAttendance());
    }

    markAttendance() {
        // For demo purposes, we'll mark attendance for all employees
        const data = this.getData();
        const employees = data.employees || [];
        const selectedDate = document.getElementById('attendanceDate').value;
        
        if (!selectedDate) {
            this.showNotification('Please select a date', 'error');
            return;
        }

        this.showLoading();

        setTimeout(() => {
            employees.forEach(employee => {
                const existingRecord = data.attendance.find(att => 
                    att.employeeId === employee.id && att.date === selectedDate
                );
                
                if (!existingRecord) {
                    const attendance = {
                        id: this.generateId(),
                        employeeId: employee.id,
                        employeeName: `${employee.firstName} ${employee.lastName}`,
                        date: selectedDate,
                        checkIn: '09:00',
                        checkOut: '18:00',
                        status: Math.random() > 0.1 ? 'present' : 'absent',
                        hours: Math.random() > 0.1 ? 9.0 : 0,
                        createdAt: new Date().toISOString()
                    };
                    
                    data.attendance.push(attendance);
                }
            });

            this.saveData(data);
            this.hideLoading();
            this.loadAttendance();
            this.updateStatistics();
            this.addActivity(`Marked attendance for ${selectedDate}`, 'update');
            this.showNotification('Attendance marked successfully!', 'success');
        }, 1500);
    }

    loadAttendance() {
        const data = this.getData();
        const selectedDate = document.getElementById('attendanceDate').value;
        
        if (!selectedDate) return;

        const todayAttendance = data.attendance.filter(att => att.date === selectedDate);
        this.renderAttendanceTable(todayAttendance);
        this.updateAttendanceStats(todayAttendance, data.employees.length);
    }

    renderAttendanceTable(attendance) {
        const tbody = document.getElementById('attendanceTableBody');
        if (!tbody) return;

        if (attendance.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                        <i class="fas fa-clock text-4xl mb-4"></i>
                        <p>No attendance records for selected date</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = attendance.map(att => `
            <tr data-attendance-id="${att.id}">
                <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img class="h-8 w-8 rounded-full" src="https://ui-avatars.com/api/?name=${encodeURIComponent(att.employeeName)}&background=1976D2&color=fff" alt="Employee">
                        <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">${att.employeeName}</div>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${att.checkIn || '-'}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${att.checkOut || '-'}</td>
                <td class="px-4 py-4 whitespace-nowrap">
                    <span class="status-badge ${att.status}">${att.status.charAt(0).toUpperCase() + att.status.slice(1)}</span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${att.hours}</td>
            </tr>
        `).join('');
    }

    updateAttendanceStats(attendance, totalEmployees) {
        const present = attendance.filter(att => att.status === 'present').length;
        const absent = attendance.filter(att => att.status === 'absent').length;
        const late = attendance.filter(att => att.status === 'late').length;
        const onLeave = attendance.filter(att => att.status === 'leave').length;

        document.getElementById('attendancePresentStat').textContent = present;
        document.getElementById('attendanceAbsentStat').textContent = absent;
        document.getElementById('attendanceLateStat').textContent = late;
        document.getElementById('attendanceOnLeaveStat').textContent = onLeave;
    }

    viewAttendanceReports() {
        this.showNotification('Attendance reports feature would generate detailed analytics', 'info');
    }

    // Leave Management Functions
    initializeLeaveEvents() {
        const applyBtn = document.getElementById('applyLeaveBtn');
        const modal = document.getElementById('leaveModal');
        const closeBtn = document.getElementById('closeLeaveModal');
        const cancelBtn = document.getElementById('cancelLeave');
        const form = document.getElementById('leaveForm');

        applyBtn?.addEventListener('click', () => this.showLeaveModal());
        closeBtn?.addEventListener('click', () => this.hideLeaveModal());
        cancelBtn?.addEventListener('click', () => this.hideLeaveModal());

        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideLeaveModal();
            }
        });

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveLeave();
        });
    }

    showLeaveModal() {
        const modal = document.getElementById('leaveModal');
        
        // Populate employee dropdown
        this.populateEmployeeDropdown('leaveEmployee');
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    hideLeaveModal() {
        const modal = document.getElementById('leaveModal');
        const form = document.getElementById('leaveForm');
        
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        form.reset();
    }

    populateEmployeeDropdown(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;

        const data = this.getData();
        const employees = data.employees || [];

        select.innerHTML = '<option value="">Select Employee</option>' +
            employees.map(emp => 
                `<option value="${emp.id}">${emp.firstName} ${emp.lastName}</option>`
            ).join('');
    }

    saveLeave() {
        this.showLoading();

        const leave = {
            id: this.generateId(),
            employeeId: document.getElementById('leaveEmployee').value,
            leaveType: document.getElementById('leaveType').value,
            fromDate: document.getElementById('leaveFromDate').value,
            toDate: document.getElementById('leaveToDate').value,
            reason: document.getElementById('leaveReason').value,
            status: 'pending',
            appliedDate: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString()
        };

        if (!leave.employeeId || !leave.leaveType || !leave.fromDate || !leave.toDate) {
            this.hideLoading();
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Get employee name
        const data = this.getData();
        const employee = data.employees.find(emp => emp.id === leave.employeeId);
        if (employee) {
            leave.employeeName = `${employee.firstName} ${employee.lastName}`;
        }

        data.leaves.push(leave);
        this.saveData(data);

        setTimeout(() => {
            this.hideLoading();
            this.hideLeaveModal();
            this.loadLeaves();
            this.addActivity(`Leave application submitted by ${leave.employeeName}`, 'create');
            this.showNotification('Leave application submitted successfully!', 'success');
        }, 1000);
    }

    loadLeaves() {
        const data = this.getData();
        const leaves = data.leaves || [];
        this.renderLeaveTable(leaves);
        this.updateLeaveBalance();
    }

    renderLeaveTable(leaves) {
        const tbody = document.getElementById('leaveTableBody');
        if (!tbody) return;

        if (leaves.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                        <i class="fas fa-calendar-alt text-4xl mb-4"></i>
                        <p>No leave requests found</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = leaves.map(leave => `
            <tr data-leave-id="${leave.id}">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img class="h-8 w-8 rounded-full" src="https://ui-avatars.com/api/?name=${encodeURIComponent(leave.employeeName || 'Employee')}&background=1976D2&color=fff" alt="Employee">
                        <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">${leave.employeeName || 'Unknown Employee'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${leave.fromDate}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${leave.toDate}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge ${leave.status}">${leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    ${leave.status === 'pending' ? `
                        <button class="text-green-600 hover:text-green-900 approve-leave" data-id="${leave.id}" data-testid="button-approve-leave-${leave.id}">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-900 reject-leave" data-id="${leave.id}" data-testid="button-reject-leave-${leave.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : `
                        <button class="text-primary hover:text-blue-700 view-leave" data-id="${leave.id}" data-testid="button-view-leave-${leave.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                    `}
                </td>
            </tr>
        `).join('');

        // Add event listeners
        tbody.querySelectorAll('.approve-leave').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const leaveId = e.currentTarget.getAttribute('data-id');
                this.updateLeaveStatus(leaveId, 'approved');
            });
        });

        tbody.querySelectorAll('.reject-leave').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const leaveId = e.currentTarget.getAttribute('data-id');
                this.updateLeaveStatus(leaveId, 'rejected');
            });
        });
    }

    updateLeaveStatus(leaveId, status) {
        const data = this.getData();
        const leaveIndex = data.leaves.findIndex(leave => leave.id === leaveId);
        
        if (leaveIndex !== -1) {
            data.leaves[leaveIndex].status = status;
            data.leaves[leaveIndex].updatedAt = new Date().toISOString();
            this.saveData(data);
            
            const leave = data.leaves[leaveIndex];
            this.addActivity(`Leave request ${status} for ${leave.employeeName}`, 'update');
            this.loadLeaves();
            this.showNotification(`Leave request ${status} successfully!`, 'success');
        }
    }

    updateLeaveBalance() {
        const container = document.getElementById('leaveBalanceContainer');
        if (!container) return;

        // Sample leave balance data
        const leaveTypes = [
            { name: 'Annual Leave', used: 15, total: 25, color: 'blue' },
            { name: 'Sick Leave', used: 8, total: 12, color: 'red' },
            { name: 'Personal Leave', used: 3, total: 5, color: 'green' }
        ];

        container.innerHTML = leaveTypes.map(leave => {
            const percentage = (leave.used / leave.total) * 100;
            return `
                <div class="border rounded-lg p-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-gray-600">${leave.name}</span>
                        <span class="text-sm font-bold text-gray-800">${leave.used}/${leave.total}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-${leave.color}-600 h-2 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Payroll Management Functions
    initializePayrollEvents() {
        const generateBtn = document.getElementById('generatePayrollBtn');
        const exportBtn = document.getElementById('exportPayrollBtn');

        generateBtn?.addEventListener('click', () => this.generatePayroll());
        exportBtn?.addEventListener('click', () => this.exportPayroll());
    }

    generatePayroll() {
        this.showLoading();

        setTimeout(() => {
            const data = this.getData();
            const employees = data.employees || [];
            const selectedMonth = document.getElementById('payrollMonth').value;

            employees.forEach(employee => {
                const existingPayroll = data.payroll.find(p => 
                    p.employeeId === employee.id && p.month === selectedMonth
                );

                if (!existingPayroll) {
                    const baseSalary = employee.salary || 50000;
                    const allowances = baseSalary * 0.15; // 15% allowances
                    const deductions = baseSalary * 0.12; // 12% deductions (tax, insurance, etc.)
                    const netPay = baseSalary + allowances - deductions;

                    const payroll = {
                        id: this.generateId(),
                        employeeId: employee.id,
                        employeeName: `${employee.firstName} ${employee.lastName}`,
                        position: employee.position,
                        month: selectedMonth,
                        baseSalary: baseSalary,
                        allowances: allowances,
                        deductions: deductions,
                        netPay: netPay,
                        status: 'processed',
                        createdAt: new Date().toISOString()
                    };

                    data.payroll.push(payroll);
                }
            });

            this.saveData(data);
            this.hideLoading();
            this.loadPayroll();
            this.addActivity(`Payroll generated for month ${selectedMonth}`, 'create');
            this.showNotification('Payroll generated successfully!', 'success');
        }, 2000);
    }

    loadPayroll() {
        const data = this.getData();
        const payroll = data.payroll || [];
        this.renderPayrollTable(payroll);
    }

    renderPayrollTable(payroll) {
        const tbody = document.getElementById('payrollTableBody');
        if (!tbody) return;

        if (payroll.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                        <i class="fas fa-dollar-sign text-4xl mb-4"></i>
                        <p>No payroll records found</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = payroll.map(pay => `
            <tr data-payroll-id="${pay.id}">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img class="h-8 w-8 rounded-full" src="https://ui-avatars.com/api/?name=${encodeURIComponent(pay.employeeName)}&background=1976D2&color=fff" alt="Employee">
                        <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">${pay.employeeName}</div>
                            <div class="text-sm text-gray-500">${pay.position}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${pay.baseSalary.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${pay.allowances.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${pay.deductions.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$${pay.netPay.toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge ${pay.status}">${pay.status.charAt(0).toUpperCase() + pay.status.slice(1)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button class="text-primary hover:text-blue-700 view-payslip" data-id="${pay.id}" data-testid="button-view-payslip-${pay.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-gray-600 hover:text-gray-900 print-payslip" data-id="${pay.id}" data-testid="button-print-payslip-${pay.id}">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add event listeners
        tbody.querySelectorAll('.view-payslip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showNotification('Payslip viewer would open detailed view', 'info');
            });
        });

        tbody.querySelectorAll('.print-payslip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const payrollId = e.currentTarget.getAttribute('data-id');
                this.printPayslip(payrollId);
            });
        });
    }

    printPayslip(payrollId) {
        const data = this.getData();
        const payroll = data.payroll.find(p => p.id === payrollId);
        
        if (!payroll) return;

        const printContent = `
            <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="text-align: center; margin-bottom: 30px; color: #1976D2;">PAYSLIP</h1>
                <div style="border: 2px solid #1976D2; padding: 20px; border-radius: 8px;">
                    <div style="margin-bottom: 20px;">
                        <h2 style="margin: 0; color: #333;">${payroll.employeeName}</h2>
                        <p style="margin: 5px 0; color: #666;">${payroll.position}</p>
                        <p style="margin: 5px 0; color: #666;">Month: ${payroll.month}</p>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #f3f4f6;">
                            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">Description</td>
                            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold; text-align: right;">Amount</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px;">Base Salary</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${payroll.baseSalary.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px;">Allowances</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${payroll.allowances.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 12px;">Deductions</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">-$${payroll.deductions.toLocaleString()}</td>
                        </tr>
                        <tr style="background-color: #f3f4f6; font-weight: bold;">
                            <td style="border: 1px solid #ddd; padding: 12px;">Net Pay</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: right; color: #1976D2;">$${payroll.netPay.toLocaleString()}</td>
                        </tr>
                    </table>
                    <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
                        Generated on ${new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        `;

        printJS({
            printable: printContent,
            type: 'raw-html'
        });
    }

    exportPayroll() {
        const data = this.getData();
        const payroll = data.payroll || [];
        
        if (payroll.length === 0) {
            this.showNotification('No payroll data to export', 'warning');
            return;
        }

        // Create CSV content
        const csvContent = [
            ['Employee Name', 'Position', 'Month', 'Base Salary', 'Allowances', 'Deductions', 'Net Pay', 'Status'],
            ...payroll.map(p => [
                p.employeeName,
                p.position,
                p.month,
                p.baseSalary,
                p.allowances,
                p.deductions,
                p.netPay,
                p.status
            ])
        ].map(row => row.join(',')).join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payroll_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Payroll data exported successfully!', 'success');
    }

    // Performance Management Functions
    initializePerformanceEvents() {
        const addBtn = document.getElementById('addReviewBtn');
        const modal = document.getElementById('performanceModal');
        const closeBtn = document.getElementById('closePerformanceModal');
        const cancelBtn = document.getElementById('cancelPerformance');
        const form = document.getElementById('performanceForm');

        addBtn?.addEventListener('click', () => this.showPerformanceModal());
        closeBtn?.addEventListener('click', () => this.hidePerformanceModal());
        cancelBtn?.addEventListener('click', () => this.hidePerformanceModal());

        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hidePerformanceModal();
            }
        });

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePerformance();
        });
    }

    showPerformanceModal() {
        const modal = document.getElementById('performanceModal');
        
        // Populate employee dropdown
        this.populateEmployeeDropdown('performanceEmployee');
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    hidePerformanceModal() {
        const modal = document.getElementById('performanceModal');
        const form = document.getElementById('performanceForm');
        
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        form.reset();
    }

    savePerformance() {
        this.showLoading();

        const performance = {
            id: this.generateId(),
            employeeId: document.getElementById('performanceEmployee').value,
            period: document.getElementById('performancePeriod').value,
            score: parseFloat(document.getElementById('performanceScore').value),
            goals: document.getElementById('performanceGoals').value,
            improvement: document.getElementById('performanceImprovement').value,
            comments: document.getElementById('performanceComments').value,
            status: 'completed',
            createdAt: new Date().toISOString()
        };

        if (!performance.employeeId || !performance.period || !performance.score) {
            this.hideLoading();
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const data = this.getData();
        const employee = data.employees.find(emp => emp.id === performance.employeeId);
        if (employee) {
            performance.employeeName = `${employee.firstName} ${employee.lastName}`;
            performance.position = employee.position;
        }

        data.performance.push(performance);
        this.saveData(data);

        setTimeout(() => {
            this.hideLoading();
            this.hidePerformanceModal();
            this.loadPerformance();
            this.addActivity(`Performance review completed for ${performance.employeeName}`, 'create');
            this.showNotification('Performance review saved successfully!', 'success');
        }, 1000);
    }

    loadPerformance() {
        const data = this.getData();
        const performance = data.performance || [];
        this.renderPerformanceTable(performance);
        this.updatePerformanceMetrics(performance);
    }

    renderPerformanceTable(performance) {
        const tbody = document.getElementById('performanceTableBody');
        if (!tbody) return;

        if (performance.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                        <i class="fas fa-trophy text-4xl mb-4"></i>
                        <p>No performance reviews found</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = performance.map(perf => `
            <tr data-performance-id="${perf.id}">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img class="h-8 w-8 rounded-full" src="https://ui-avatars.com/api/?name=${encodeURIComponent(perf.employeeName)}&background=1976D2&color=fff" alt="Employee">
                        <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">${perf.employeeName}</div>
                            <div class="text-sm text-gray-500">${perf.position}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${perf.period}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-900 mr-2">${perf.score}/5.0</span>
                        <div class="flex text-yellow-400">
                            ${this.renderStars(perf.score)}
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge ${perf.status}">${perf.status.charAt(0).toUpperCase() + perf.status.slice(1)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button class="text-primary hover:text-blue-700 view-review" data-id="${perf.id}" data-testid="button-view-review-${perf.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-gray-600 hover:text-gray-900 edit-review" data-id="${perf.id}" data-testid="button-edit-review-${perf.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderStars(score) {
        const fullStars = Math.floor(score);
        const hasHalfStar = score % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    updatePerformanceMetrics(performance) {
        const container = document.getElementById('performanceMetricsContainer');
        if (!container) return;

        if (performance.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-chart-bar text-4xl mb-4"></i>
                    <p>No performance metrics data</p>
                </div>
            `;
            return;
        }

        const excellent = performance.filter(p => p.score >= 4.5).length;
        const good = performance.filter(p => p.score >= 3.5 && p.score < 4.5).length;
        const average = performance.filter(p => p.score >= 2.5 && p.score < 3.5).length;
        const below = performance.filter(p => p.score < 2.5).length;
        const total = performance.length;

        container.innerHTML = `
            <div class="border rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-600">Excellent (4.5-5.0)</span>
                    <span class="text-sm font-bold text-green-600">${Math.round((excellent/total)*100)}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" style="width: ${(excellent/total)*100}%"></div>
                </div>
            </div>
            
            <div class="border rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-600">Good (3.5-4.4)</span>
                    <span class="text-sm font-bold text-blue-600">${Math.round((good/total)*100)}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${(good/total)*100}%"></div>
                </div>
            </div>
            
            <div class="border rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-600">Average (2.5-3.4)</span>
                    <span class="text-sm font-bold text-yellow-600">${Math.round((average/total)*100)}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-yellow-600 h-2 rounded-full" style="width: ${(average/total)*100}%"></div>
                </div>
            </div>
            
            <div class="border rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-600">Below Average (1.0-2.4)</span>
                    <span class="text-sm font-bold text-red-600">${Math.round((below/total)*100)}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-red-600 h-2 rounded-full" style="width: ${(below/total)*100}%"></div>
                </div>
            </div>
        `;
    }

    // Search and Filter Functions
    initializeSearchAndFilter() {
        const employeeSearch = document.getElementById('employeeSearch');
        const departmentFilter = document.getElementById('departmentFilter');
        const payrollSearch = document.getElementById('payrollSearch');

        employeeSearch?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.currentPage = 1;
            this.loadEmployees();
        });

        departmentFilter?.addEventListener('change', (e) => {
            this.filterDepartment = e.target.value;
            this.currentPage = 1;
            this.loadEmployees();
        });

        payrollSearch?.addEventListener('input', (e) => {
            // Implementation for payroll search
            this.loadPayroll();
        });
    }

    // Table Sorting Functions
    initializeTableSorting() {
        document.querySelectorAll('[data-sort]').forEach(header => {
            header.addEventListener('click', () => {
                const field = header.getAttribute('data-sort');
                
                if (this.sortField === field) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortField = field;
                    this.sortDirection = 'asc';
                }

                // Update sort icons
                document.querySelectorAll('[data-sort] i').forEach(icon => {
                    icon.className = 'fas fa-sort ml-1';
                });

                const icon = header.querySelector('i');
                if (icon) {
                    icon.className = `fas fa-sort-${this.sortDirection === 'asc' ? 'up' : 'down'} ml-1`;
                }

                this.loadEmployees();
            });
        });
    }

    // Export and Backup Functions
    initializeExportEvents() {
        const exportBtn = document.getElementById('exportBtn');
        const backupBtn = document.getElementById('backupBtn');

        exportBtn?.addEventListener('click', () => this.exportData());
        backupBtn?.addEventListener('click', () => this.backupData());
    }

    exportData() {
        this.showLoading();

        setTimeout(() => {
            const data = this.getData();
            const exportData = {
                employees: data.employees,
                departments: data.departments,
                exportDate: new Date().toISOString(),
                exportedBy: this.currentUser.name
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hrms_export_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            window.URL.revokeObjectURL(url);

            this.hideLoading();
            this.addActivity('Data exported successfully', 'export');
            this.showNotification('Data exported successfully!', 'success');
        }, 2000);
    }

    backupData() {
        this.showLoading();

        setTimeout(() => {
            const data = this.getData();
            data.settings.lastBackup = new Date().toISOString();
            this.saveData(data);

            // Create backup file
            const backupData = {
                ...data,
                backupDate: new Date().toISOString(),
                backupBy: this.currentUser.name
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hrms_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            window.URL.revokeObjectURL(url);

            this.hideLoading();
            this.addActivity('System backup completed', 'backup');
            this.showNotification('Backup completed successfully!', 'success');
        }, 3000);
    }

    // Dashboard Functions
    loadDashboard() {
        this.loadRecentActivities();
        this.updateStatistics();
        
        // Reinitialize charts
        setTimeout(() => {
            this.initializeCharts();
        }, 100);
    }

    loadRecentActivities() {
        const data = this.getData();
        const activities = data.activities || [];
        const container = document.getElementById('recentActivitiesContainer');
        
        if (!container) return;

        if (activities.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-8" id="noActivitiesMessage">
                    <i class="fas fa-clock text-4xl mb-4"></i>
                    <p>No recent activities</p>
                </div>
            `;
            return;
        }

        container.innerHTML = activities.slice(0, 5).map(activity => {
            const icons = {
                create: 'fa-user-plus',
                update: 'fa-edit',
                delete: 'fa-trash',
                export: 'fa-download',
                backup: 'fa-cloud-upload-alt',
                system: 'fa-cog'
            };

            const colors = {
                create: 'bg-primary',
                update: 'bg-green-500',
                delete: 'bg-red-500',
                export: 'bg-blue-500',
                backup: 'bg-purple-500',
                system: 'bg-gray-500'
            };

            return `
                <div class="flex items-start space-x-4 py-3 border-b last:border-b-0">
                    <div class="flex-shrink-0">
                        <div class="w-8 h-8 ${colors[activity.type] || 'bg-gray-500'} rounded-full flex items-center justify-center">
                            <i class="fas ${icons[activity.type] || 'fa-info'} text-white text-xs"></i>
                        </div>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-900">${activity.message}</p>
                        <p class="text-xs text-gray-500">${activity.time} • ${activity.date}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStatistics() {
        const data = this.getData();
        
        const totalEmployees = data.employees?.length || 0;
        const totalDepartments = data.departments?.length || 0;
        
        // Calculate attendance stats for today
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = data.attendance?.filter(att => att.date === today) || [];
        const presentToday = todayAttendance.filter(att => att.status === 'present').length;
        const onLeave = data.leaves?.filter(leave => 
            leave.status === 'approved' && 
            new Date(leave.fromDate) <= new Date() && 
            new Date(leave.toDate) >= new Date()
        ).length || 0;

        // Update dashboard stats
        document.getElementById('totalEmployeesStat').textContent = totalEmployees;
        document.getElementById('presentTodayStat').textContent = presentToday;
        document.getElementById('onLeaveStat').textContent = onLeave;
        document.getElementById('departmentsStat').textContent = totalDepartments;
    }

    // Chart Functions
    initializeCharts() {
        this.initializeAttendanceChart();
        this.initializeDepartmentChart();
    }

    initializeAttendanceChart() {
        const ctx = document.getElementById('attendanceChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.attendance) {
            this.charts.attendance.destroy();
        }

        const data = this.getData();
        
        // Generate attendance data for the last 7 days
        const labels = [];
        const attendanceData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            labels.push(dayName);
            
            const dayAttendance = data.attendance?.filter(att => att.date === dateStr) || [];
            const presentCount = dayAttendance.filter(att => att.status === 'present').length;
            attendanceData.push(presentCount);
        }

        this.charts.attendance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Present',
                    data: attendanceData,
                    borderColor: '#1976D2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    initializeDepartmentChart() {
        const ctx = document.getElementById('departmentChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.department) {
            this.charts.department.destroy();
        }

        const data = this.getData();
        const departments = data.departments || [];
        
        if (departments.length === 0) {
            return;
        }

        // Calculate employee count per department
        const departmentData = departments.map(dept => {
            const employeeCount = data.employees?.filter(emp => 
                emp.department === dept.name.toLowerCase()
            ).length || 0;
            return {
                name: dept.name,
                count: employeeCount
            };
        });

        const labels = departmentData.map(d => d.name);
        const counts = departmentData.map(d => d.count);
        const colors = [
            '#1976D2',
            '#FF9800',
            '#4CAF50',
            '#F44336',
            '#9C27B0',
            '#FF5722',
            '#795548',
            '#607D8B'
        ];

        this.charts.department = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: counts,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    // Utility Functions
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type} animate-fadeIn`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas ${icons[type] || icons.info}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        container.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // Load functions for new HR modules
    loadRecruitment() {
        console.log('Loading recruitment data...');
        // Update stats or placeholder data
        document.getElementById('openPositionsStat').textContent = '5';
        document.getElementById('applicationsStat').textContent = '127';
        document.getElementById('newHiresStat').textContent = '8';
    }

    loadShifts() {
        console.log('Loading shift management data...');
        // Implementation for shift management would go here
    }

    loadBenefits() {
        console.log('Loading benefits administration data...');
        // Implementation for benefits administration would go here
    }

    loadExpenses() {
        console.log('Loading expense management data...');
        // Implementation for expense management would go here
    }

    loadLearning() {
        console.log('Loading learning & development data...');
        // Implementation for learning & development would go here
    }

    loadTalent() {
        console.log('Loading talent management data...');
        // Implementation for talent management would go here
    }

    loadEngagement() {
        console.log('Loading employee engagement data...');
        // Implementation for employee engagement would go here
    }

    loadCommunication() {
        console.log('Loading communication hub data...');
        // Implementation for communication hub would go here
    }

    loadAnalytics() {
        console.log('Loading HR analytics data...');
        // Initialize analytics charts if needed
        setTimeout(() => {
            this.initializeAnalyticsCharts();
        }, 100);
    }

    loadCompliance() {
        console.log('Loading compliance management data...');
        // Implementation for compliance management would go here
    }

    loadESS() {
        console.log('Loading employee self service data...');
        // Implementation for employee self service would go here
    }

    loadMSS() {
        console.log('Loading manager self service data...');
        // Initialize team performance chart if needed
        setTimeout(() => {
            this.initializeTeamPerformanceChart();
        }, 100);
    }

    loadSettings() {
        console.log('Loading system configuration data...');
        // Implementation for system settings would go here
    }

    // Initialize additional charts for new modules
    initializeAnalyticsCharts() {
        // Workforce Chart
        const workforceChart = document.getElementById('workforceChart');
        if (workforceChart) {
            const ctx = workforceChart.getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Operations'],
                    datasets: [{
                        data: [25, 12, 15, 8, 10],
                        backgroundColor: [
                            '#3B82F6',
                            '#10B981',
                            '#F59E0B',
                            '#EF4444',
                            '#8B5CF6'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    initializeTeamPerformanceChart() {
        // Team Performance Chart
        const teamChart = document.getElementById('teamPerformanceChart');
        if (teamChart) {
            const ctx = teamChart.getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Team Performance',
                        data: [85, 88, 92, 89, 94, 91],
                        backgroundColor: '#3B82F6',
                        borderColor: '#2563EB',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.hrmsApp = new HRMSApp();
});

// Export for testing or external access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HRMSApp;
}
