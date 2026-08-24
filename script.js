/* =========================================================
   SAFE YATRI AI - 3 Section Dashboard
   
   Features:
   - Visitor Section: Safety alerts, crowd checks
   - AI Section: AI modules, detection systems
   - Admin Section: Login, monitoring, controls
========================================================= */

/* =========================================================
   GLOBAL STATE
========================================================= */

let isAdminAuthenticated = false;
let adminUser = null;

let zones = [
    { id: 0, name: "Lingaraj Temple", capacity: 100, people: 45, risk: 20, status: "SAFE", closed: false, manualOverride: false, history: [] },
    { id: 1, name: "Mukteshwar Temple", capacity: 150, people: 120, risk: 55, status: "WARNING", closed: false, manualOverride: false, history: [] },
    { id: 2, name: "Dhauli Peace Pagoda", capacity: 100, people: 180, risk: 90, status: "DANGER", closed: false, manualOverride: false, history: [] },
    { id: 3, name: "Nandankanan Zoo", capacity: 200, people: 70, risk: 25, status: "SAFE", closed: false, manualOverride: false, history: [] }
];

let incidents = [
    { id: 1, zone: "Lingaraj Temple", title: "Crowd Surge at Temple", desc: "High crowd density detected, evacuation recommended", severity: "critical", time: "5 mins ago" }
];

let aiCameraActive = false;
let detectionFrameCount = 0;
let currentVideoStream = null;

/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeSectionNavigation();
    initializeLanguage();
    loadAdminAuthState();
    updateAllDisplays();
});

/* =========================================================
   THEME & STYLING
========================================================= */

function initializeTheme() {
    const toggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('safeYatriTheme') || 'light';
    
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
        document.body.classList.add('dark-theme');
    }
    
    toggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark-theme');
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('safeYatriTheme', isDark ? 'dark' : 'light');
    });
}

/* =========================================================
   SECTION NAVIGATION
========================================================= */

function initializeSectionNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.classList.add('active');
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        }
    });
    
    // Handle admin section special logic
    if (sectionName === 'admin') {
        updateAdminDisplay();
    }
}

/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    
    // Simple validation (in production, verify with backend)
    if (username === 'admin' && password === '12345') {
        isAdminAuthenticated = true;
        adminUser = { username, name: 'Admin Officer' };
        
        // Save auth state
        localStorage.setItem('adminAuth', JSON.stringify(adminUser));
        
        updateAdminDisplay();
        showToast('Successfully logged in!');
    } else {
        showToast('Invalid username or password', 'error');
    }
}

function handleAdminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        isAdminAuthenticated = false;
        adminUser = null;
        localStorage.removeItem('adminAuth');
        updateAdminDisplay();
        showToast('Logged out successfully');
    }
}

function loadAdminAuthState() {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
        try {
            adminUser = JSON.parse(savedAuth);
            isAdminAuthenticated = true;
        } catch (e) {
            isAdminAuthenticated = false;
        }
    }
}

function updateAdminDisplay() {
    const loginPanel = document.getElementById('adminLoginPanel');
    const dashboard = document.getElementById('adminDashboard');
    
    if (isAdminAuthenticated) {
        loginPanel.style.display = 'none';
        dashboard.style.display = 'block';
        updateAdminDashboard();
    } else {
        loginPanel.style.display = 'block';
        dashboard.style.display = 'none';
    }
}

function updateAdminDashboard() {
    // Update quick stats
    document.getElementById('adminActiveVisitors').textContent = Math.floor(Math.random() * 2000 + 500);
    document.getElementById('adminActiveAlerts').textContent = incidents.length;
    document.getElementById('adminStatus').textContent = 'Good';
    document.getElementById('adminConnectivity').textContent = 'Online';
    
    // Update zones
    renderZones();
    
    // Update incidents
    updateIncidentsDisplay();
    
    // Update weather
    updateWeatherDisplay();
}

/* =========================================================
   ALERTS & BROADCASTING
========================================================= */

function broadcastAlert() {
    if (!isAdminAuthenticated) {
        showToast('Please login to broadcast alerts', 'error');
        return;
    }
    
    const level = document.getElementById('alertLevel').value;
    const message = document.getElementById('alertMessage').value;
    const zone = document.getElementById('alertZone').value;
    
    if (!message.trim()) {
        showToast('Please enter an alert message', 'error');
        return;
    }
    
    // Simulate broadcast
    console.log(`Broadcasting ${level} alert to ${zone}:`, message);
    
    // Add to visitor alerts
    const alertsContainer = document.getElementById('visitorAlerts');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${level}`;
    alertDiv.innerHTML = `
        <i class="fa-solid fa-circle-exclamation"></i>
        <div>
            <strong>${level.toUpperCase()}</strong>
            <p>${message}</p>
        </div>
    `;
    alertsContainer.prepend(alertDiv);
    
    // Clear form
    document.getElementById('alertMessage').value = '';
    
    showToast(`Alert broadcast to ${zone}!`);
}

function updateIncidentsDisplay() {
    const container = document.getElementById('adminIncidents');
    container.innerHTML = '';
    
    if (incidents.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">No active incidents</p>';
        return;
    }
    
    incidents.forEach(incident => {
        const card = document.createElement('div');
        card.className = 'incident-card';
        card.innerHTML = `
            <span class="incident-badge ${incident.severity}">${incident.severity.toUpperCase()}</span>
            <h3>${incident.title}</h3>
            <p>${incident.zone}</p>
            <p class="incident-desc">${incident.desc}</p>
            <div class="incident-actions">
                <button class="btn btn-sm btn-secondary">View Details</button>
                <button class="btn btn-sm btn-danger" onclick="resolveIncident(${incident.id})">Resolve</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function resolveIncident(id) {
    incidents = incidents.filter(i => i.id !== id);
    updateIncidentsDisplay();
    showToast('Incident resolved');
}

/* =========================================================
   ZONE MONITORING & MANAGEMENT
========================================================= */

function computeZoneStatus(risk) {
    if (risk >= 75) return 'DANGER';
    if (risk >= 40) return 'WARNING';
    return 'SAFE';
}

function statusColor(status) {
    if (status === 'DANGER') return 'var(--danger)';
    if (status === 'WARNING') return 'var(--warning)';
    return 'var(--success)';
}

function recordZoneHistory(zone) {
    if (!zone.history) zone.history = [];
    zone.history.push(zone.people);
    if (zone.history.length > 12) zone.history.shift();
}

function renderZones() {
    const grid = document.getElementById('zonesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    zones.forEach(zone => {
        const occupancyPct = Math.max(0, Math.min(100, Math.round((zone.people / zone.capacity) * 100)));
        const statusLabel = zone.closed ? 'Closed' : zone.status.charAt(0) + zone.status.slice(1).toLowerCase();
        const statusClass = zone.closed ? 'closed' : zone.status.toLowerCase();
        const barColor = zone.closed ? 'var(--muted)' : statusColor(zone.status);

        const card = document.createElement('div');
        card.className = `zone-card${zone.closed ? ' zone-closed' : ''}`;
        card.innerHTML = `
            <div class="zone-header">
                <h3>${zone.name}</h3>
                <span class="status-badge ${statusClass}">${statusLabel}</span>
            </div>
            <div class="zone-stats">
                <div><span>Capacity:</span> <strong>${zone.capacity}</strong></div>
                <div><span>Current:</span> <strong id="zone${zone.id}Count">${zone.people}</strong></div>
                <div><span>Risk:</span> <strong id="zone${zone.id}Risk">${zone.risk}%</strong></div>
                ${zone.manualOverride ? '<div><span>Mode:</span> <strong class="manual-tag">Manual</strong></div>' : ''}
            </div>
            <div class="zone-progress">
                <div class="progress" style="width: ${occupancyPct}%; background: ${barColor};"></div>
            </div>
            <button class="btn btn-sm" onclick="manageZone(${zone.id})">
                <i class="fa-solid fa-sliders"></i> Manage Zone
            </button>
        `;
        grid.appendChild(card);
    });
}

function renderZoneHistory(zone) {
    if (!zone.history || zone.history.length === 0) {
        return `<p class="zone-history-empty">No occupancy history yet this session — check back after the next live update.</p>`;
    }
    const max = Math.max(zone.capacity, ...zone.history, 1);
    const bars = zone.history.map(value => {
        const height = Math.max(6, Math.round((value / max) * 100));
        return `<div class="zone-history-bar" style="height: ${height}%;" title="${value} people"></div>`;
    }).join('');
    return `
        <div class="zone-history">
            <span class="zone-history-label">Recent Occupancy Trend</span>
            <div class="zone-history-chart">${bars}</div>
        </div>
    `;
}

function manageZone(zoneId) {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    const occupancyPct = Math.max(0, Math.min(100, Math.round((zone.people / zone.capacity) * 100)));

    showModal(`
        <h2><i class="fa-solid fa-map-location-dot"></i> Manage Zone</h2>
        <p style="color: var(--muted); margin: 0.25rem 0 1.5rem;">${zone.name}${zone.closed ? ' — currently closed to visitors' : ` — ${occupancyPct}% of capacity`}</p>

        <div class="zone-manage-stats">
            <div><span>Status</span><strong>${zone.closed ? 'Closed' : zone.status}</strong></div>
            <div><span>Occupancy</span><strong>${zone.people} / ${zone.capacity}</strong></div>
            <div><span>Risk Score</span><strong>${zone.risk}%</strong></div>
            <div><span>Mode</span><strong>${zone.manualOverride ? 'Manual' : 'Auto'}</strong></div>
        </div>

        ${renderZoneHistory(zone)}

        <div class="form-group">
            <label for="manageCapacity">Capacity</label>
            <input type="number" id="manageCapacity" min="1" value="${zone.capacity}">
        </div>
        <div class="form-group">
            <label for="manageCount">Current People Count</label>
            <input type="number" id="manageCount" min="0" value="${zone.people}">
        </div>
        <div class="form-group">
            <label for="manageStatusOverride">Status Mode</label>
            <select id="manageStatusOverride">
                <option value="auto" ${!zone.manualOverride ? 'selected' : ''}>Auto (calculated from occupancy)</option>
                <option value="SAFE" ${zone.manualOverride && zone.status === 'SAFE' ? 'selected' : ''}>Force Safe</option>
                <option value="WARNING" ${zone.manualOverride && zone.status === 'WARNING' ? 'selected' : ''}>Force Warning</option>
                <option value="DANGER" ${zone.manualOverride && zone.status === 'DANGER' ? 'selected' : ''}>Force Danger</option>
            </select>
        </div>

        <button class="btn btn-primary btn-block" onclick="saveZoneChanges(${zone.id})">
            <i class="fa-solid fa-floppy-disk"></i> Save Changes
        </button>

        <div class="zone-manage-actions">
            <button class="btn btn-sm btn-secondary" onclick="sendZoneAlert(${zone.id})">
                <i class="fa-solid fa-bullhorn"></i> Alert This Zone
            </button>
            <button class="btn btn-sm ${zone.closed ? 'btn-secondary' : 'btn-danger'}" onclick="toggleZoneClosed(${zone.id})">
                <i class="fa-solid fa-${zone.closed ? 'lock-open' : 'lock'}"></i> ${zone.closed ? 'Reopen Zone' : 'Close Zone'}
            </button>
            <button class="btn btn-sm btn-danger" onclick="logZoneIncident(${zone.id})">
                <i class="fa-solid fa-triangle-exclamation"></i> Log Incident
            </button>
        </div>
    `);
}

function saveZoneChanges(zoneId) {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    const capacity = parseInt(document.getElementById('manageCapacity').value, 10);
    const count = parseInt(document.getElementById('manageCount').value, 10);
    const mode = document.getElementById('manageStatusOverride').value;

    if (isNaN(capacity) || capacity < 1) {
        showToast('Capacity must be at least 1', 'error');
        return;
    }
    if (isNaN(count) || count < 0) {
        showToast('People count cannot be negative', 'error');
        return;
    }

    zone.capacity = capacity;
    zone.people = count;

    if (mode === 'auto') {
        zone.manualOverride = false;
        zone.risk = Math.min(100, Math.round((count / capacity) * 100));
        zone.status = computeZoneStatus(zone.risk);
    } else {
        zone.manualOverride = true;
        zone.status = mode;
        zone.risk = mode === 'SAFE' ? 20 : mode === 'WARNING' ? 55 : 90;
    }

    recordZoneHistory(zone);
    renderZones();
    closeModal();
    showToast(`${zone.name} updated`);
}

function toggleZoneClosed(zoneId) {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    zone.closed = !zone.closed;
    renderZones();
    closeModal();

    if (zone.closed) {
        showToast(`${zone.name} closed to visitors`, 'error');
    } else {
        showToast(`${zone.name} reopened`);
    }
}

function sendZoneAlert(zoneId) {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    showModal(`
        <h2><i class="fa-solid fa-bullhorn"></i> Alert: ${zone.name}</h2>
        <div class="form-group">
            <label for="zoneAlertLevel">Alert Level</label>
            <select id="zoneAlertLevel">
                <option value="info">Info</option>
                <option value="warning" selected>Warning</option>
                <option value="critical">Critical</option>
            </select>
        </div>
        <div class="form-group">
            <label for="zoneAlertMessage">Message</label>
            <textarea id="zoneAlertMessage" rows="3" placeholder="Enter a message for visitors in this zone..."></textarea>
        </div>
        <button class="btn btn-primary btn-block" onclick="confirmZoneAlert(${zone.id})">
            <i class="fa-solid fa-paper-plane"></i> Send Alert
        </button>
    `);
}

function confirmZoneAlert(zoneId) {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    const level = document.getElementById('zoneAlertLevel').value;
    const message = document.getElementById('zoneAlertMessage').value.trim();

    if (!message) {
        showToast('Please enter an alert message', 'error');
        return;
    }

    const alertsContainer = document.getElementById('visitorAlerts');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${level}`;
    alertDiv.innerHTML = `
        <i class="fa-solid fa-circle-exclamation"></i>
        <div>
            <strong>${level.toUpperCase()} - ${zone.name}</strong>
            <p>${message}</p>
        </div>
    `;
    alertsContainer.prepend(alertDiv);

    closeModal();
    showToast(`Alert sent to ${zone.name}`);
}

function logZoneIncident(zoneId) {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    if (!confirm(`Log a critical incident for ${zone.name}? This marks the zone as DANGER and adds it to Active Incidents.`)) {
        return;
    }

    incidents.unshift({
        id: Date.now(),
        zone: zone.name,
        title: `Incident Reported - ${zone.name}`,
        desc: 'Manually flagged by admin. Immediate attention required.',
        severity: 'critical',
        time: 'Just now'
    });

    zone.manualOverride = true;
    zone.status = 'DANGER';
    zone.risk = 95;

    updateIncidentsDisplay();
    renderZones();
    closeModal();
    showToast(`Incident logged for ${zone.name}`, 'error');
}

/* =========================================================
   WEATHER
========================================================= */

function updateWeatherDisplay() {
    const temp = Math.floor(Math.random() * 10 + 24);
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Visitor section
    document.getElementById('visitorWeather').textContent = temp + '°C';
    document.getElementById('visitorWeatherText').textContent = condition;
    
    // Admin section
    document.getElementById('adminWeather').textContent = temp + '°C';
    document.getElementById('adminWeatherStatus').textContent = condition;
}

function checkMySafety() {
    showModal(`
        <h2><i class="fa-solid fa-shield-check"></i> Your Current Safety Status</h2>
        <div style="margin-top: 1.5rem;">
            <div class="card">
                <div class="card-icon green">
                    <i class="fa-solid fa-check-circle"></i>
                </div>
                <div>
                    <p>Overall Assessment</p>
                    <h3>SAFE</h3>
                    <p style="color: var(--muted); margin-top: 0.5rem;">
                        Current location appears safe. Continue monitoring alerts.
                    </p>
                </div>
            </div>
        </div>
    `);
}

/* =========================================================
   POPULAR PLACES
========================================================= */

function checkPopularPlacesCrowd() {
    const places = [
        { name: 'Jagannath Temple', crowd: 'High', level: 'high' },
        { name: 'Lingaraj Temple', crowd: 'Moderate', level: 'moderate' },
        { name: 'Nandankanan Zoo', crowd: 'Low', level: 'low' },
        { name: 'Chilika Lake', crowd: 'Moderate', level: 'moderate' }
    ];
    
    const container = document.getElementById('popularPlacesResult');
    container.innerHTML = '';
    
    places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <h3>${place.name}</h3>
            <div class="crowd-level ${place.level}">${place.crowd}</div>
            <p style="color: var(--muted); font-size: 0.85rem;">Updated 2 mins ago</p>
        `;
        container.appendChild(card);
    });
}

/* =========================================================
   LOCATION & RISK ASSESSMENT
========================================================= */

function runLocationSafetyCheck() {
    const container = document.getElementById('crowdPredictionResult');
    
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <i class="fa-solid fa-location-dot" style="font-size: 2rem; color: var(--primary); margin-bottom: 1rem;"></i>
            <h3>Location Detected</h3>
            <p style="color: var(--muted); margin: 0.5rem 0;">Lingaraj Temple Zone</p>
        </div>
        <div class="card">
            <div class="card-icon orange">
                <i class="fa-solid fa-cloud-sun"></i>
            </div>
            <div>
                <p>Weather Forecast</p>
                <h3>28°C, Partly Cloudy</h3>
                <span>Humidity: 65% | Wind: 15 km/h</span>
            </div>
        </div>
        <div class="card">
            <div class="card-icon">
                <i class="fa-solid fa-users" style="color: var(--primary);"></i>
            </div>
            <div>
                <p>Crowd Prediction</p>
                <h3>Moderate</h3>
                <span>Expected density at this time</span>
            </div>
        </div>
        <div class="card card-main">
            <div class="card-icon red">
                <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div>
                <p>Overall Risk Assessment</p>
                <h3>MEDIUM</h3>
                <div class="risk-meter">
                    <div class="risk-meter-fill" style="width: 45%;"></div>
                </div>
                <span>45 / 100</span>
            </div>
        </div>
    `;
}

/* =========================================================
   AI CAMERA DETECTION
========================================================= */

async function startAICamera() {
    if (aiCameraActive) {
        showToast('Camera is already running', 'error');
        return;
    }
    
    const container = document.getElementById('aiCameraContainer');
    const startBtn = document.getElementById('startCameraBtn');
    const stopBtn = document.getElementById('stopCameraBtn');
    const video = document.getElementById('aiVideo');
    
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
            <p style="margin-top: 1rem;">Initializing camera...</p>
        </div>
    `;
    
    try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        
        currentVideoStream = stream;
        video.srcObject = stream;
        video.style.display = 'block';
        await video.play();
        
        aiCameraActive = true;
        
        // Hide the placeholder, keep the video in its own fixed slot
        // (the controls live outside this container, so they are never wiped out)
        container.style.display = 'none';
        
        // Update button states
        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'inline-flex';
        
        // Start detection loop
        startObjectDetection(video);
        showToast('Camera started successfully');
        
    } catch (error) {
        console.error('Camera error:', error);
        aiCameraActive = false;
        container.style.display = 'flex';
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fa-solid fa-exclamation-triangle" style="color: var(--danger); font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>Camera access denied. Please enable camera permissions.</p>
            </div>
        `;
        if (startBtn) startBtn.style.display = 'inline-flex';
        if (stopBtn) stopBtn.style.display = 'none';
        showToast('Failed to access camera. Please check permissions.', 'error');
    }
}

function stopAICamera() {
    if (!aiCameraActive) {
        showToast('Camera is not running', 'error');
        return;
    }
    
    aiCameraActive = false;
    
    // Stop all video streams
    if (currentVideoStream) {
        currentVideoStream.getTracks().forEach(track => track.stop());
        currentVideoStream = null;
    }
    
    // Reset video element (it stays in the DOM, just hidden)
    const video = document.getElementById('aiVideo');
    video.pause();
    video.srcObject = null;
    video.style.display = 'none';
    
    // Reset stats
    document.getElementById('peopleCount').textContent = '0';
    document.getElementById('crowdDensity').textContent = 'Low';
    document.getElementById('anomalyCount').textContent = '0';
    document.getElementById('fpsCount').textContent = '0';
    
    // Restore the placeholder
    const container = document.getElementById('aiCameraContainer');
    container.style.display = 'flex';
    container.innerHTML = `
        <i class="fa-solid fa-video"></i>
        <p>Camera Feed</p>
    `;
    
    // Update button states (these are permanent elements, never destroyed)
    const startBtn = document.getElementById('startCameraBtn');
    const stopBtn = document.getElementById('stopCameraBtn');
    if (startBtn) startBtn.style.display = 'inline-flex';
    if (stopBtn) stopBtn.style.display = 'none';
    
    showToast('Camera stopped successfully');
}

async function startObjectDetection(videoElement) {
    try {
        const model = await cocoSsd.load();
        
        async function detect() {
            if (!aiCameraActive) return;
            
            const predictions = await model.estimateObjects(videoElement);
            
            // Count people
            const peoplePredictions = predictions.filter(p => p.class === 'person');
            document.getElementById('peopleCount').textContent = peoplePredictions.length;
            
            // Calculate crowd density
            let density = 'Low';
            if (peoplePredictions.length > 10) density = 'High';
            else if (peoplePredictions.length > 5) density = 'Moderate';
            document.getElementById('crowdDensity').textContent = density;
            
            // Random anomalies
            const anomalies = Math.floor(Math.random() * 3);
            document.getElementById('anomalyCount').textContent = anomalies;
            
            // FPS
            detectionFrameCount++;
            document.getElementById('fpsCount').textContent = (30 + Math.random() * 10).toFixed(0);
            
            requestAnimationFrame(detect);
        }
        
        detect();
        
    } catch (error) {
        console.error('Detection error:', error);
    }
}

/* =========================================================
   LANGUAGE
========================================================= */

let currentLanguage = localStorage.getItem('safeYatriLanguage') || 'en';

const translations = {
    en: {
        'visitor': 'Visitor',
        'ai': 'AI Module',
        'admin': 'Admin',
        'safer-pilgrimage': 'Safer Pilgrimage, Smarter Crowd Management',
        'safety-status': 'Current Safety Status',
        'overall-risk': 'Overall Risk',
        'weather': 'Weather (Bhubaneswar)',
        'transport': 'Transport',
        'alerts': 'Safety Alerts & Advisories',
        'peak-hours': 'Peak Hours',
        'peak-hours-desc': 'High crowd density expected between 4-6 PM. Avoid if possible.',
        'crowd-check': 'Popular Places - Crowd Check',
        'location': 'Your Location & Risk Assessment',
        'ai-modules': 'AI Safety Modules',
        'camera-detection': 'AI Camera Detection',
        'people-detected': 'People Detected',
        'crowd-density': 'Crowd Density',
        'anomalies': 'Anomalies',
        'fps': 'FPS',
        'start-detection': 'Start Detection',
        'stop-detection': 'Stop Detection',
        'admin-panel': 'Admin Panel',
        'zone-monitoring': 'Zone Monitoring & Control',
        'weather-reports': 'Weather & System Reports'
    },
    hi: {
        'visitor': 'आगंतुक',
        'ai': 'एआई मॉड्यूल',
        'admin': 'व्यवस्थापक',
        'safer-pilgrimage': 'सुरक्षित यात्रा, स्मार्ट भीड़ प्रबंधन',
        'safety-status': 'वर्तमान सुरक्षा स्थिति',
        'overall-risk': 'कुल जोखिम',
        'weather': 'मौसम (भुवनेश्वर)',
        'transport': 'परिवहन',
        'alerts': 'सुरक्षा सतर्कताएं और सलाह',
        'peak-hours': 'चरम घंटे',
        'peak-hours-desc': '4-6 बजे के बीच उच्च भीड़ घनत्व की उम्मीद है। यदि संभव हो तो बचें।',
        'crowd-check': 'लोकप्रिय स्थान - भीड़ जांच',
        'location': 'आपका स्थान और जोखिम मूल्यांकन',
        'ai-modules': 'एआई सुरक्षा मॉड्यूल',
        'camera-detection': 'एआई कैमरा डिटेक्शन',
        'people-detected': 'लोग पहचाने गए',
        'crowd-density': 'भीड़ घनत्व',
        'anomalies': 'विसंगतियां',
        'fps': 'एफपीएस',
        'start-detection': 'डिटेक्शन शुरू करें',
        'stop-detection': 'डिटेक्शन बंद करें',
        'admin-panel': 'व्यवस्थापक पैनल',
        'zone-monitoring': 'क्षेत्र निगरानी और नियंत्रण',
        'weather-reports': 'मौसम और सिस्टम रिपोर्ट'
    },
    bn: {
        'visitor': 'দর্শক',
        'ai': 'এআই মডিউল',
        'admin': 'প্রশাসক',
        'safer-pilgrimage': 'নিরাপদ তীর্থযাত্রা, স্মার্ট ভিড় ব্যবস্থাপনা',
        'safety-status': 'বর্তমান নিরাপত্তা অবস্থা',
        'overall-risk': 'সামগ্রিক ঝুঁকি',
        'weather': 'আবহাওয়া (ভুবনেশ্বর)',
        'transport': 'পরিবহন',
        'alerts': 'নিরাপত্তা সতর্কতা এবং পরামর্শ',
        'peak-hours': 'শীর্ষ ঘন্টা',
        'peak-hours-desc': '4-6 এপিএম এর মধ্যে উচ্চ ভিড় ঘনত্ব প্রত্যাশিত। সম্ভব হলে এড়িয়ে চলুন।',
        'crowd-check': 'জনপ্রিয় স্থান - ভিড় পরীক্ষা',
        'location': 'আপনার অবস্থান এবং ঝুঁকি মূল্যায়ন',
        'ai-modules': 'এআই নিরাপত্তা মডিউল',
        'camera-detection': 'এআই ক্যামেরা সনাক্তকরণ',
        'people-detected': 'লোক সনাক্ত করা হয়েছে',
        'crowd-density': 'ভিড়ের ঘনত্ব',
        'anomalies': 'অস্বাভাবিকতা',
        'fps': 'এফপিএস',
        'start-detection': 'সনাক্তকরণ শুরু করুন',
        'stop-detection': 'সনাক্তকরণ বন্ধ করুন',
        'admin-panel': 'প্রশাসক প্যানেল',
        'zone-monitoring': 'অঞ্চল পর্যবেক্ষণ এবং নিয়ন্ত্রণ',
        'weather-reports': 'আবহাওয়া এবং সিস্টেম রিপোর্ট'
    },
    ta: {
        'visitor': 'பார்வையாளர்',
        'ai': 'AI மডியூல்',
        'admin': 'நிர்வாகம்',
        'safer-pilgrimage': 'பாதுகாப்பான யாத்திரை, ஸ்மார்ட் கூட்ட நிர்வாகம்',
        'safety-status': 'தற்போதைய பாதுகாப்பு நிலை',
        'overall-risk': 'ஒட்டுமொத்த ஆபத்து',
        'weather': 'வானிலை (புவனேசுவரம்)',
        'transport': 'போக்குவரத்து',
        'alerts': 'பாதுகாப்பு எச்சரிக்கைகள் மற்றும் ஆலோசனைகள்',
        'peak-hours': 'உச்ச மணிநேரம்',
        'peak-hours-desc': 'பிற்பகல் 4-6 இடையே அதிக கூட்ட அடர்த்தி எதிர்பார்க்கப்படுகிறது। முடிந்தால் தவிர்க்கவும்.',
        'crowd-check': 'பிரபலமான இடங்கள் - கூட்ட சரிபார்ப்பு',
        'location': 'உங்கள் இருப்பிடம் மற்றும் ஆபத்து மதிப்பீடு',
        'ai-modules': 'AI பாதுகாப்பு மডியூல்',
        'camera-detection': 'AI கேமரா সনாক்தி',
        'people-detected': 'சனக்கள் சனாக்தி',
        'crowd-density': 'கூட்ட அடர்த்தி',
        'anomalies': 'விலக்குகள்',
        'fps': 'FPS',
        'start-detection': 'சனாக்தி தொடங்கவும்',
        'stop-detection': 'சனாக்தி நிறுத்தவும்',
        'admin-panel': 'நிர்வாக பேனல்',
        'zone-monitoring': 'மண்ட ஆய்வு மற்றும் கட்டுப்பாடு',
        'weather-reports': 'வானிலை மற்றும் கணினி அறிக்கை'
    },
    or: {
        'visitor': 'ଦର୍ଶକ',
        'ai': 'AI ମଡ୍ୟୁଲ',
        'admin': 'ପରିଚାଳକ',
        'safer-pilgrimage': 'ସୁରକ୍ଷିତ ତୀର୍ଥ ଯାତ୍ରା, ସ୍ମାର୍ଟ ଭିଡ ବ୍ୟବସ୍ଥାପନା',
        'safety-status': 'ବର୍ତ୍ତମାନର ନିରାପତ୍ତା ସ୍ଥିତି',
        'overall-risk': 'ମୋଟ ଝୁଁକି',
        'weather': 'ପାଗ ଖବର (ଭୁବନେଶ୍ବର)',
        'transport': 'ପରିବହନ',
        'alerts': 'ନିରାପତ୍ତା ସতର୍କତା ଏବଂ ପରାମର୍ଶ',
        'peak-hours': 'ଶିଖର ଘଣ୍ଟା',
        'peak-hours-desc': '4-6 PM ମଧ୍ୟରେ ଉଚ୍ଚ ଭିଡ ଘନତା ଆଶା କରାଯାଏ। ସମ୍ଭବ ହେଲେ ଏଡ଼ାଇ ଚଲନ୍ତୁ।',
        'crowd-check': 'ଜନପ୍ରିୟ ସ୍ଥାନ - ଭିଡ ଯାଞ୍ଚ',
        'location': 'ଆପଣାର ଅବସ୍ଥାନ ଏବଂ ଝୁଁକି ମୂଲ୍ୟାୟନ',
        'ai-modules': 'AI ନିରାପତ୍ତା ମଡ୍ୟୁଲ',
        'camera-detection': 'AI କ୍ୟାମେରା ସନାକ୍ତକରଣ',
        'people-detected': 'ମାନୁষ ସନାକ୍ତ',
        'crowd-density': 'ଭିଡ ଘନତା',
        'anomalies': 'ଅସମାନତା',
        'fps': 'FPS',
        'start-detection': 'ସନାକ୍ତକରଣ ଆରମ୍ଭ କରନ୍ତୁ',
        'stop-detection': 'ସନାକ୍ତକରଣ ବନ୍ଦ କରନ୍ତୁ',
        'admin-panel': 'ପରିଚାଳନା ପ୍ୟାନେଲ',
        'zone-monitoring': 'ଜୋନ ନିରୀକ୍ଷଣ ଏବଂ ନିୟନ୍ତ୍ରଣ',
        'weather-reports': 'ପାଗ ଏବଂ ସିଷ୍ଟମ ରିପୋର୍ଟ'
    }
};

function initializeLanguage() {
    const select = document.getElementById('languageSelect');
    select.value = currentLanguage;
    select.addEventListener('change', function() {
        changeLanguage(this.value);
    });
    // Apply initial language
    applyLanguage(currentLanguage);
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('safeYatriLanguage', lang);
    applyLanguage(lang);
    showToast('Language changed to ' + lang.toUpperCase());
}

function applyLanguage(lang) {
    const trans = translations[lang] || translations.en;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (trans[key]) {
            el.textContent = trans[key];
        }
    });
}

/* =========================================================
   MODAL
========================================================= */

function showModal(content) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = content;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Close modal on outside click
document.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
});

/* =========================================================
   TOAST NOTIFICATIONS
========================================================= */

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    
    toastText.textContent = message;
    toast.classList.add('show');
    
    // Change icon based on type
    const icon = toast.querySelector('i');
    if (type === 'error') {
        icon.className = 'fa-solid fa-exclamation-circle';
    } else {
        icon.className = 'fa-solid fa-circle-check';
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function updateAllDisplays() {
    updateWeatherDisplay();
    updateVisitorAlerts();
}

function updateVisitorAlerts() {
    const container = document.getElementById('visitorAlerts');
    const alerts = [
        { level: 'info', title: 'Peak Hours', desc: 'High crowd density expected between 4-6 PM. Avoid if possible.' },
        { level: 'warning', title: 'Weather Alert', desc: 'Light rain expected in evening. Carry umbrella.' }
    ];
    
    container.innerHTML = '';
    alerts.forEach(alert => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${alert.level}`;
        alertDiv.innerHTML = `
            <i class="fa-solid fa-circle-info"></i>
            <div>
                <strong>${alert.title}</strong>
                <p>${alert.desc}</p>
            </div>
        `;
        container.appendChild(alertDiv);
    });
}

// Simulate real-time updates
setInterval(() => {
    if (document.querySelector('.section-panel.active').id !== 'admin-section') {
        updateWeatherDisplay();
    }
}, 30000); // Update every 30 seconds

// Update admin dashboard when visible
setInterval(() => {
    if (isAdminAuthenticated && document.querySelector('.section-panel.active').id === 'admin-section') {
        // Simulate live updates (skip zones an admin has closed or manually locked)
        zones.forEach(zone => {
            if (zone.closed || zone.manualOverride) return;
            zone.people = Math.max(0, zone.people + Math.floor((Math.random() - 0.5) * 10));
            zone.risk = Math.min(100, Math.max(0, Math.round((zone.people / zone.capacity) * 100)));
            zone.status = computeZoneStatus(zone.risk);
            recordZoneHistory(zone);
        });
        updateAdminDashboard();
    }
}, 5000); // Update every 5 seconds
