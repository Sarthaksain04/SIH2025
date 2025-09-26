/**
 * Civic Admin Dashboard - Main JavaScript
 * Handles navigation, charts, modals, and interactive features
 */

class CivicAdminDashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.charts = {};
        this.map = null;
        this.init();
    }

    init() {
        this.initNavigation();
        this.initCharts();
        this.initMap();
        this.initModals();
        this.initEventListeners();
        this.initMobileMenu();
        this.simulateRealTimeUpdates();
    }

    // Navigation System
    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const pageContents = document.querySelectorAll('.page-content');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = item.dataset.page;
                this.switchPage(targetPage);
            });
        });
    }

    switchPage(pageId) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        // Update page content
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageId}-page`).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard Overview',
            reports: 'Active Reports',
            map: 'Live Issue Map',
            departments: 'Department Management',
            analytics: 'Advanced Analytics',
            settings: 'System Settings'
        };
        document.querySelector('.page-title').textContent = titles[pageId];

        this.currentPage = pageId;

        // Initialize page-specific features
        if (pageId === 'map' && !this.map) {
            setTimeout(() => this.initMap(), 100);
        }
    }

    // Chart Initialization
    initCharts() {
        this.initCategoryChart();
        this.initResponseChart();
        this.initDepartmentChart();
        this.initAnalyticsCharts();
    }

    initCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Potholes', 'Streetlights', 'Sanitation', 'Graffiti', 'Noise', 'Other'],
                datasets: [{
                    data: [35, 25, 20, 12, 5, 3],
                    backgroundColor: [
                        '#ef4444', // danger
                        '#f59e0b', // warning  
                        '#22c55e', // success
                        '#3b82f6', // primary
                        '#64748b', // secondary
                        '#8b5cf6'  // purple
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
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
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((context.raw / total) * 100);
                                return `${context.label}: ${context.raw} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%',
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    initResponseChart() {
        const ctx = document.getElementById('responseChart');
        if (!ctx) return;

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

        this.charts.response = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Response Time (hours)',
                    data: [3.2, 2.8, 2.5, 2.9, 2.1, 1.8, 2.4],
                    borderColor: '#3b82f6',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Average: ${context.raw}h`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return value + 'h';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Map Initialization
    initMap() {
        const mapElement = document.getElementById('issueMap');
        if (!mapElement) return;

        // Initialize Leaflet map
        this.map = L.map('issueMap').setView([40.7128, -74.0060], 12); // NYC coordinates

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ' OpenStreetMap contributors'
        }).addTo(this.map);

        // Sample issue markers
        const issues = [
            { lat: 40.7589, lng: -73.9851, type: 'pothole', title: 'Large pothole reported', priority: 'critical' },
            { lat: 40.7505, lng: -73.9934, type: 'streetlight', title: 'Streetlight malfunction', priority: 'high' },
            { lat: 40.7614, lng: -73.9776, type: 'trash', title: 'Overflowing trash bin', priority: 'medium' },
            { lat: 40.7282, lng: -73.9942, type: 'graffiti', title: 'Graffiti removal needed', priority: 'low' },
            { lat: 40.7450, lng: -73.9889, type: 'pothole', title: 'Road surface damage', priority: 'high' },
            { lat: 40.7692, lng: -73.9442, type: 'streetlight', title: 'Broken street lamp', priority: 'medium' }
        ];

        // Add markers to map
        issues.forEach(issue => {
            const markerColor = this.getMarkerColor(issue.type);
            const marker = L.circleMarker([issue.lat, issue.lng], {
                color: '#ffffff',
                fillColor: markerColor,
                fillOpacity: 0.9,
                weight: 2,
                radius: 8
            }).addTo(this.map);

            marker.bindPopup(`
                <div class="map-popup">
                    <h4>${issue.title}</h4>
                    <p><strong>Type:</strong> ${issue.type}</p>
                    <p><strong>Priority:</strong> <span class="priority-badge ${issue.priority}">${issue.priority}</span></p>
                    <div class="popup-actions">
                        <button class="btn-primary btn-sm">View Details</button>
                        <button class="btn-secondary btn-sm">Assign</button>
                    </div>
                </div>
            `);
        });
    }

    getMarkerColor(type) {
        const colors = {
            pothole: '#ef4444',
            streetlight: '#f59e0b',
            trash: '#22c55e',
            graffiti: '#3b82f6',
            noise: '#64748b'
        };
        return colors[type] || '#64748b';
    }

    // Modal System
    initModals() {
        const modal = document.getElementById('reportModal');
        const closeBtn = modal.querySelector('.modal-close');
        const viewButtons = document.querySelectorAll('.btn-icon.view');

        // Open modal
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('reportModal');
            });
        });

        // Close modal
        closeBtn.addEventListener('click', () => {
            this.closeModal('reportModal');
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal('reportModal');
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal('reportModal');
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event Listeners
    initEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Filter functionality
        const filterSelects = document.querySelectorAll('.filter-select');
        filterSelects.forEach(select => {
            select.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        // Time filter buttons
        const timeButtons = document.querySelectorAll('.time-btn');
        timeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                timeButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChartData(e.target.textContent);
            });
        });

        // Notification button
        const notificationBtn = document.querySelector('.notification-btn');
        notificationBtn.addEventListener('click', () => {
            this.showNotifications();
        });

        // Action buttons
        this.initActionButtons();
    }

    initActionButtons() {
        // Assign buttons
        document.querySelectorAll('.btn-icon.assign').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAssignDialog();
            });
        });

        // Update buttons
        document.querySelectorAll('.btn-icon.update').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showUpdateDialog();
            });
        });

        // Export buttons
        document.querySelectorAll('button:contains("Export")').forEach(btn => {
            btn.addEventListener('click', () => {
                this.exportData();
            });
        });
    }

    // Mobile Menu
    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // Search functionality
    handleSearch(query) {
        if (this.currentPage === 'reports') {
            this.filterReports(query);
        }
        // Implement search for other pages as needed
    }

    filterReports(query) {
        const rows = document.querySelectorAll('.reports-table tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Filter functionality
    applyFilters() {
        // Implementation for applying filters
        console.log('Applying filters...');
    }

    // Chart updates
    updateChartData(period) {
        if (this.charts.response) {
            let newData;
            switch(period) {
                case '7D':
                    newData = [3.2, 2.8, 2.5, 2.9, 2.1, 1.8, 2.4];
                    break;
                case '30D':
                    newData = [3.5, 3.1, 2.9, 3.2, 2.8, 2.5, 2.7, 2.3];
                    break;
                case '90D':
                    newData = [4.1, 3.8, 3.5, 3.2, 2.9, 2.6, 2.4, 2.2];
                    break;
                default:
                    newData = [3.2, 2.8, 2.5, 2.9, 2.1, 1.8, 2.4];
            }
            
            this.charts.response.data.datasets[0].data = newData;
            this.charts.response.update();
        }
    }

    // Notification system
    showNotifications() {
        const notifications = [
            { type: 'urgent', message: 'Critical pothole reported on Main St', time: '2 min ago' },
            { type: 'info', message: 'Weekly report is ready for download', time: '1 hour ago' },
            { type: 'success', message: '5 issues resolved in your district', time: '3 hours ago' }
        ];

        // Create notification dropdown (simplified)
        alert('Notifications:\n' + notifications.map(n => `${n.message} (${n.time})`).join('\n'));
    }

    // Dialog systems
    showAssignDialog() {
        const departments = ['Public Works', 'Sanitation', 'Transportation', 'Parks & Recreation'];
        const selected = prompt(`Assign to department:\n${departments.map((d, i) => `${i+1}. ${d}`).join('\n')}`);
        if (selected) {
            this.showToast('Issue assigned successfully!', 'success');
        }
    }

    showUpdateDialog() {
        const statuses = ['New', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
        const selected = prompt(`Update status:\n${statuses.map((s, i) => `${i+1}. ${s}`).join('\n')}`);
        if (selected) {
            this.showToast('Status updated successfully!', 'success');
        }
    }

    // Data export
    exportData() {
        this.showToast('Exporting data...', 'info');
        // Simulate export
        setTimeout(() => {
            this.showToast('Export completed!', 'success');
        }, 2000);
    }

    // Toast notifications
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-left: 4px solid ${this.getToastColor(type)};
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle'
        };
        return icons[type] || 'info-circle';
    }

    getToastColor(type) {
        const colors = {
            success: '#22c55e',
            info: '#3b82f6',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        return colors[type] || '#3b82f6';
    }

    // Real-time updates simulation
    simulateRealTimeUpdates() {
        setInterval(() => {
            this.updateStats();
            this.addRandomActivity();
        }, 30000); // Update every 30 seconds
    }

    updateStats() {
        // Simulate stat updates
        const urgentCount = document.querySelector('.stat-card.urgent h3');
        const activeCount = document.querySelector('.stat-card.active h3');
        const resolvedCount = document.querySelector('.stat-card.resolved h3');
        
        if (urgentCount) {
            const current = parseInt(urgentCount.textContent);
            urgentCount.textContent = current + Math.floor(Math.random() * 3 - 1); // +/- 1
        }
        
        if (activeCount) {
            const current = parseInt(activeCount.textContent);
            activeCount.textContent = current + Math.floor(Math.random() * 5 - 2); // +/- 2
        }
        
        if (resolvedCount) {
            const current = parseInt(resolvedCount.textContent);
            resolvedCount.textContent = current + Math.floor(Math.random() * 10); // + 0-9
        }
    }

    addRandomActivity() {
        const activities = [
            { type: 'pothole', text: 'New pothole reported on Elm Street', status: 'new' },
            { type: 'streetlight', text: 'Streetlight repair completed', status: 'resolved' },
            { type: 'trash', text: 'Sanitation request assigned', status: 'assigned' },
            { type: 'graffiti', text: 'Graffiti removal in progress', status: 'progress' }
        ];

        const activity = activities[Math.floor(Math.random() * activities.length)];
        const activityFeed = document.querySelector('.activity-feed');
        
        if (activityFeed) {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-avatar ${activity.type}">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.text}</strong></p>
                    <span class="timestamp">Just now</span>
                </div>
                <span class="status-badge ${activity.status}">${activity.status}</span>
            `;

            // Add new activity at the top
            activityFeed.insertBefore(activityItem, activityFeed.firstChild);

            // Remove old activities (keep max 5)
            const items = activityFeed.querySelectorAll('.activity-item');
            if (items.length > 5) {
                activityFeed.removeChild(items[items.length - 1]);
            }
        }
    }

    getActivityIcon(type) {
        const icons = {
            pothole: 'road',
            streetlight: 'lightbulb',
            trash: 'trash',
            graffiti: 'spray-can',
            noise: 'volume-up'
        };
        return icons[type] || 'exclamation-triangle';
    }

    // Department Chart Initialization
    initDepartmentChart() {
        const ctx = document.getElementById('departmentChart');
        if (!ctx) return;

        this.charts.department = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Public Works', 'Sanitation', 'Transportation', 'Parks & Recreation', 'Utilities', 'Emergency'],
                datasets: [
                    {
                        label: 'Response Time (hours)',
                        data: [2.1, 1.8, 3.2, 2.7, 1.5, 0.5],
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: '#3b82f6',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                    },
                    {
                        label: 'Resolution Rate (%)',
                        data: [89, 92, 79, 86, 95, 98],
                        backgroundColor: 'rgba(34, 197, 94, 0.6)',
                        borderColor: '#22c55e',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                        yAxisID: 'y1',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                if (context.datasetIndex === 0) {
                                    return `${context.dataset.label}: ${context.raw}h`;
                                } else {
                                    return `${context.dataset.label}: ${context.raw}%`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            maxRotation: 45
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)',
                        },
                        ticks: {
                            color: '#64748b',
                            callback: function(value) {
                                return value + 'h';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Response Time (hours)',
                            color: '#64748b'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            color: '#64748b',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Resolution Rate (%)',
                            color: '#64748b'
                        }
                    },
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Analytics Charts Initialization
    initAnalyticsCharts() {
        this.initVolumeTrendsChart();
        this.initResolutionChart();
        this.initSatisfactionChart();
        this.initAnalyticsMap();
    }

    initVolumeTrendsChart() {
        const ctx = document.getElementById('volumeTrendsChart');
        if (!ctx) return;

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

        this.charts.volumeTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Total Issues',
                    data: [145, 167, 158, 182, 174, 163],
                    borderColor: '#3b82f6',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)',
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    initResolutionChart() {
        const ctx = document.getElementById('resolutionChart');
        if (!ctx) return;

        this.charts.resolution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['< 1 hour', '1-4 hours', '4-12 hours', '12-24 hours', '> 24 hours'],
                datasets: [{
                    data: [15, 35, 28, 15, 7],
                    backgroundColor: [
                        '#22c55e',
                        '#3b82f6', 
                        '#f59e0b',
                        '#ef4444',
                        '#64748b'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((context.raw / total) * 100);
                                return `${context.label}: ${percentage}%`;
                            }
                        }
                    }
                },
                cutout: '50%'
            }
        });
    }

    initSatisfactionChart() {
        const ctx = document.getElementById('satisfactionChart');
        if (!ctx) return;

        this.charts.satisfaction = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Very Satisfied',
                        data: [45, 48, 52, 55, 58, 62],
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Satisfied',
                        data: [35, 33, 30, 28, 25, 23],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Neutral',
                        data: [15, 14, 13, 12, 12, 11],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Dissatisfied',
                        data: [5, 5, 5, 5, 5, 4],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 70,
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)',
                        },
                        ticks: {
                            color: '#64748b',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    initAnalyticsMap() {
        const mapElement = document.getElementById('analyticsMap');
        if (!mapElement) return;

        // Initialize analytics heat map
        const analyticsMap = L.map('analyticsMap').setView([40.7128, -74.0060], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ' OpenStreetMap contributors'
        }).addTo(analyticsMap);

        // Add heat map data points
        const heatData = [
            [40.7589, -73.9851, 0.8],
            [40.7505, -73.9934, 0.6],
            [40.7614, -73.9776, 0.9],
            [40.7282, -73.9942, 0.4],
            [40.7450, -73.9889, 0.7],
            [40.7692, -73.9442, 0.5],
            [40.7831, -73.9712, 0.8],
            [40.7380, -73.9903, 0.6],
            [40.7549, -73.9840, 0.9],
            [40.7181, -74.0075, 0.3]
        ];

        // Create circle markers for heat map effect
        heatData.forEach(point => {
            const [lat, lng, intensity] = point;
            L.circleMarker([lat, lng], {
                color: intensity > 0.7 ? '#ef4444' : intensity > 0.5 ? '#f59e0b' : '#22c55e',
                fillColor: intensity > 0.7 ? '#ef4444' : intensity > 0.5 ? '#f59e0b' : '#22c55e',
                fillOpacity: 0.6,
                radius: intensity * 15,
                weight: 2
            }).addTo(analyticsMap);
        });

        this.analyticsMap = analyticsMap;
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CivicAdminDashboard();
    initializeCivicStarSystem();
});

// Add some utility functions for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add loading states to buttons
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('btn-primary') || this.classList.contains('btn-secondary')) {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 1000);
            }
        });
    });

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add form validation styles
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('invalid', function() {
            this.style.borderColor = '#ef4444';
        });
        
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = '#22c55e';
            }
        });
    });
});

// ==========================================================================
// Civic Star Appreciation System
// ==========================================================================

function initializeCivicStarSystem() {
    initCivicStarModal();
    initAppreciationOptions();
    initRewardSelection();
    initCertificatePreview();
    addCivicStarsNavigation();
}

function initCivicStarModal() {
    const modal = document.getElementById('civicStarModal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeCivicStarModal();
        });
    }

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCivicStarModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCivicStarModal();
        }
    });
}

function initAppreciationOptions() {
    const options = document.querySelectorAll('.appreciation-option');
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            options.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
            
            // Update appreciation message based on selection
            updateAppreciationMessage(option.dataset.type);
        });
    });
}

function updateAppreciationMessage(type) {
    const messageTextarea = document.querySelector('.appreciation-text');
    if (!messageTextarea) return;

    const messages = {
        'civic-star': 'Thank you for being an outstanding citizen! Your report about the pothole on Main St & 5th Ave has been successfully resolved. Your active participation helps make our community safer and better for everyone.',
        'community-hero': 'Congratulations on being recognized as a Community Hero! Your exceptional dedication to civic engagement and multiple successful reports have made a significant impact on our neighborhood. Thank you for going above and beyond!',
        'safety-champion': 'Your vigilance in reporting critical safety issues has earned you the Safety Champion recognition. Thank you for helping keep our community safe and preventing potential accidents through your proactive reporting.'
    };

    messageTextarea.value = messages[type] || messages['civic-star'];
}

function initRewardSelection() {
    const rewardCheckboxes = document.querySelectorAll('.reward-checkbox');
    const certificatePreview = document.getElementById('certificatePreview');
    
    rewardCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Show/hide certificate preview
            if (checkbox.value === 'certificate' && certificatePreview) {
                if (checkbox.checked) {
                    certificatePreview.style.display = 'block';
                    updateCertificateDate();
                } else {
                    certificatePreview.style.display = 'none';
                }
            }
            
            updatePreviewButton();
        });
    });
}

function initCertificatePreview() {
    updateCertificateDate();
}

function updateCertificateDate() {
    const dateElement = document.getElementById('certificateDate');
    if (dateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

function updatePreviewButton() {
    const previewBtn = document.querySelector('.preview-btn');
    const sendBtn = document.querySelector('.send-btn');
    const selectedRewards = document.querySelectorAll('.reward-checkbox:checked');
    
    if (previewBtn) {
        previewBtn.textContent = selectedRewards.length > 0 ? 'Preview Rewards' : 'Preview';
    }
}

function addCivicStarsNavigation() {
    // Add Civic Stars to navigation if not already present
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    // Check if Civic Stars nav item already exists
    if (document.querySelector('[data-page="civic-stars"]')) return;
    
    const civicStarsNavItem = document.createElement('li');
    civicStarsNavItem.className = 'nav-item';
    civicStarsNavItem.setAttribute('data-page', 'civic-stars');
    civicStarsNavItem.innerHTML = `
        <a href="#civic-stars">
            <i class="fas fa-star"></i>
            <span>Civic Stars</span>
            <span class="badge" style="background: #ffd700; color: #2c3e50;">47</span>
        </a>
    `;
    
    // Insert before settings
    const settingsItem = document.querySelector('[data-page="settings"]');
    if (settingsItem) {
        navMenu.insertBefore(civicStarsNavItem, settingsItem);
    } else {
        navMenu.appendChild(civicStarsNavItem);
    }
    
    // Add click event listener
    civicStarsNavItem.addEventListener('click', (e) => {
        e.preventDefault();
        showCivicStarsPage();
    });
}

function showCivicStarsPage() {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('[data-page="civic-stars"]').classList.add('active');
    
    // Update page content
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    const civicStarsPage = document.getElementById('civic-stars-page');
    if (civicStarsPage) {
        civicStarsPage.classList.add('active');
        civicStarsPage.style.display = 'block';
    }
    
    // Update page title
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.textContent = '🌟 Civic Stars Hall of Fame';
    }
}

// Modal control functions
function openCivicStarModal() {
    const modal = document.getElementById('civicStarModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset form to default state
        resetCivicStarForm();
    }
}

function closeCivicStarModal() {
    const modal = document.getElementById('civicStarModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function resetCivicStarForm() {
    // Reset appreciation type to default
    const options = document.querySelectorAll('.appreciation-option');
    options.forEach(opt => opt.classList.remove('active'));
    document.querySelector('.appreciation-option[data-type="civic-star"]')?.classList.add('active');
    
    // Reset checkboxes
    document.querySelectorAll('.reward-checkbox').forEach(cb => cb.checked = false);
    
    // Hide certificate preview
    const certificatePreview = document.getElementById('certificatePreview');
    if (certificatePreview) {
        certificatePreview.style.display = 'none';
    }
    
    // Reset message
    updateAppreciationMessage('civic-star');
}

function previewAppreciation() {
    const selectedRewards = Array.from(document.querySelectorAll('.reward-checkbox:checked')).map(cb => cb.value);
    
    // If certificate is selected, show the full certificate preview
    if (selectedRewards.includes('certificate')) {
        previewCertificate();
        return;
    }
    
    // Otherwise show the regular preview
    const selectedType = document.querySelector('.appreciation-option.active')?.dataset.type || 'civic-star';
    const message = document.querySelector('.appreciation-text')?.value || '';
    
    let previewContent = `Preview of Civic Star Appreciation:\n\n`;
    previewContent += `Type: ${getAppreciationType(selectedType)}\n`;
    previewContent += `Message: ${message.substring(0, 100)}...\n\n`;
    
    if (selectedRewards.length > 0) {
        previewContent += `Rewards included:\n${selectedRewards.map(reward => `• ${getRewardName(reward)}`).join('\n')}\n\n`;
    }
    
    previewContent += `Send this appreciation to Sarah Johnson?`;
    
    if (confirm(previewContent)) {
        sendAppreciation();
    }
}

function sendAppreciation() {
    const sendBtn = document.querySelector('.send-btn');
    if (!sendBtn) return;
    
    // Show loading state
    const originalContent = sendBtn.innerHTML;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        sendBtn.innerHTML = originalContent;
        sendBtn.disabled = false;
        
        // Close modal
        closeCivicStarModal();
        
        // Show success message
        showSuccessToast('🌟 Civic Star appreciation sent successfully! Sarah Johnson has been notified.');
        
        // Update stats (simulate)
        updateCivicStarStats();
        
    }, 2000);
}

function getAppreciationType(type) {
    const types = {
        'civic-star': 'Civic Star Award',
        'community-hero': 'Community Hero',
        'safety-champion': 'Safety Champion'
    };
    return types[type] || 'Civic Star Award';
}

function getRewardName(reward) {
    const rewards = {
        'certificate': 'Digital Certificate',
        'public-recognition': 'Public Recognition',
        'newsletter': 'Newsletter Feature',
        'social-media': 'Social Media Post'
    };
    return rewards[reward] || reward;
}

function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
        z-index: 9999;
        font-weight: 500;
        max-width: 350px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 4000);
}

function updateCivicStarStats() {
    // Update badge in navigation if it exists
    const civicStarsBadge = document.querySelector('[data-page="civic-stars"] .badge');
    if (civicStarsBadge) {
        const currentCount = parseInt(civicStarsBadge.textContent) || 47;
        civicStarsBadge.textContent = currentCount + 1;
    }
    
    // Update stats in civic stars page if visible
    const totalStarsElement = document.querySelector('.civic-stat-card h3');
    if (totalStarsElement) {
        const currentTotal = parseInt(totalStarsElement.textContent) || 47;
        totalStarsElement.textContent = currentTotal + 1;
    }
}

function previewCertificate() {
    // Get current form data to customize the certificate
    const selectedType = document.querySelector('.appreciation-option.active')?.dataset.type || 'civic-star';
    const message = document.querySelector('.appreciation-text')?.value || '';
    
    // Open the certificate preview in a new window
    const certificateWindow = window.open('certificate-preview.html', 'CertificatePreview', 'width=900,height=700,scrollbars=yes,resizable=yes');
    
    if (certificateWindow) {
        // Wait for the window to load, then customize it if needed
        certificateWindow.addEventListener('load', function() {
            // You could customize the certificate here with the current data
            // For now, it shows the default Sarah Johnson certificate
        });
        
        // Focus the new window
        certificateWindow.focus();
    } else {
        // Fallback if popup is blocked
        alert('🎉 Certificate preview ready!\n\nPlease allow popups for this site to view the full certificate, or open certificate-preview.html manually.');
    }
}

// Make functions globally available
window.openCivicStarModal = openCivicStarModal;
window.closeCivicStarModal = closeCivicStarModal;
window.previewAppreciation = previewAppreciation;
window.sendAppreciation = sendAppreciation;
window.previewCertificate = previewCertificate;
