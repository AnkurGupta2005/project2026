/* =========================================================
   PILGRIMSAFE AI
   Pure JavaScript Hackathon Prototype

   Features:
   - Visitor Dashboard
   - Admin Dashboard
   - Crowd Risk
   - Incident Reporting
   - Geolocation
   - AI Person Detection
   - Weather / Transport simulation
   - Alerts
   - Multilingual UI
   - LocalStorage
   - Offline support
========================================================= */


/* =========================================================
   GLOBAL DATA
========================================================= */

let zones = [

    {
        id: 0,
        name: "Temple Entrance",
        capacity: 100,
        people: 45,
        risk: 20,
        weatherRisk: 20,
        status: "SAFE",
        lat: 28.6139,
        lng: 77.2090
    },

    {
        id: 1,
        name: "Main Temple",
        capacity: 150,
        people: 120,
        risk: 55,
        weatherRisk: 20,
        status: "WARNING",
        lat: 28.6145,
        lng: 77.2080
    },

    {
        id: 2,
        name: "Mountain Path",
        capacity: 100,
        people: 180,
        risk: 90,
        weatherRisk: 30,
        status: "DANGER",
        lat: 28.6150,
        lng: 77.2070
    },

    {
        id: 3,
        name: "Parking Area",
        capacity: 200,
        people: 70,
        risk: 25,
        weatherRisk: 10,
        status: "SAFE",
        lat: 28.6125,
        lng: 77.2100
    }

];


let incidents = [];


let currentLanguage = "en";


let cameraStream = null;

let detectionModel = null;

let detectionRunning = false;


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

    en: {

        appName: "PilgrimSafe AI",

        visitor: "Visitor",

        admin: "Admin Dashboard",

        heroTitle:
            "Safer Pilgrimage. Smarter Crowd Management.",

        heroText:
            "Real-time crowd monitoring, incident reporting, weather intelligence and location-based safety alerts.",

        checkSafety:
            "Check My Safety",

        currentSafety:
            "Current Safety Status",

        overallRisk:
            "Overall Risk",

        crowdLevel:
            "Crowd Level",

        weather:
            "Weather",

        transport:
            "Transport",

        siteZones:
            "Site Safety Zones",

        yourLocation:
            "Your Location",

        detectLocation:
            "Detect My Location",

        reportIncident:
            "Report an Incident",

        incidentZone:
            "Location / Zone",

        incidentType:
            "Incident Type",

        severity:
            "Severity",

        description:
            "Description",

        submitIncident:
            "Submit Incident",

        emergency:
            "Emergency Help",

        safeRoute:
            "Find Safe Route",

        adminDashboard:
            "Safety Operations Dashboard"

    },


    hi: {

        appName: "पिलग्रिमसेफ AI",

        visitor: "यात्री",

        admin: "प्रशासन डैशबोर्ड",

        heroTitle:
            "सुरक्षित तीर्थयात्रा। स्मार्ट भीड़ प्रबंधन।",

        heroText:
            "रीयल-टाइम भीड़ निगरानी, घटना रिपोर्टिंग, मौसम जानकारी और स्थान-आधारित सुरक्षा चेतावनियाँ।",

        checkSafety:
            "मेरी सुरक्षा जाँचें",

        currentSafety:
            "वर्तमान सुरक्षा स्थिति",

        overallRisk:
            "कुल जोखिम",

        crowdLevel:
            "भीड़ स्तर",

        weather:
            "मौसम",

        transport:
            "परिवहन",

        siteZones:
            "साइट सुरक्षा क्षेत्र",

        yourLocation:
            "आपका स्थान",

        detectLocation:
            "मेरा स्थान पता करें",

        reportIncident:
            "घटना की रिपोर्ट करें",

        incidentZone:
            "स्थान / क्षेत्र",

        incidentType:
            "घटना का प्रकार",

        severity:
            "गंभीरता",

        description:
            "विवरण",

        submitIncident:
            "घटना जमा करें",

        emergency:
            "आपातकालीन सहायता",

        safeRoute:
            "सुरक्षित मार्ग खोजें",

        adminDashboard:
            "सुरक्षा संचालन डैशबोर्ड"

    },


    bn: {

        appName: "পিলগ্রিমসেফ AI",

        visitor: "দর্শনার্থী",

        admin: "অ্যাডমিন ড্যাশবোর্ড",

        heroTitle:
            "নিরাপদ তীর্থযাত্রা। স্মার্ট ভিড় ব্যবস্থাপনা।",

        heroText:
            "রিয়েল-টাইম ভিড় পর্যবেক্ষণ, ঘটনা রিপোর্টিং, আবহাওয়া তথ্য এবং অবস্থানভিত্তিক নিরাপত্তা সতর্কতা।",

        checkSafety:
            "আমার নিরাপত্তা পরীক্ষা করুন",

        currentSafety:
            "বর্তমান নিরাপত্তা অবস্থা",

        overallRisk:
            "সামগ্রিক ঝুঁকি",

        crowdLevel:
            "ভিড়ের মাত্রা",

        weather:
            "আবহাওয়া",

        transport:
            "পরিবহন",

        siteZones:
            "নিরাপত্তা অঞ্চল",

        yourLocation:
            "আপনার অবস্থান",

        detectLocation:
            "আমার অবস্থান শনাক্ত করুন",

        reportIncident:
            "ঘটনা রিপোর্ট করুন",

        incidentZone:
            "স্থান / অঞ্চল",

        incidentType:
            "ঘটনার ধরন",

        severity:
            "গুরুত্ব",

        description:
            "বিবরণ",

        submitIncident:
            "ঘটনা জমা দিন",

        emergency:
            "জরুরি সহায়তা",

        safeRoute:
            "নিরাপদ পথ খুঁজুন",

        adminDashboard:
            "নিরাপত্তা অপারেশন ড্যাশবোর্ড"

    },


    ta: {

        appName: "பில்கிரிம்சேஃப் AI",

        visitor: "பார்வையாளர்",

        admin: "நிர்வாக டாஷ்போர்டு",

        heroTitle:
            "பாதுகாப்பான யாத்திரை. புத்திசாலியான கூட்ட மேலாண்மை.",

        heroText:
            "நேரடி கூட்ட கண்காணிப்பு, சம்பவ அறிக்கை, வானிலை தகவல் மற்றும் இட அடிப்படையிலான பாதுகாப்பு எச்சரிக்கைகள்.",

        checkSafety:
            "என் பாதுகாப்பைச் சரிபார்க்கவும்",

        currentSafety:
            "தற்போதைய பாதுகாப்பு நிலை",

        overallRisk:
            "மொத்த ஆபத்து",

        crowdLevel:
            "கூட்ட அளவு",

        weather:
            "வானிலை",

        transport:
            "போக்குவரத்து",

        siteZones:
            "பாதுகாப்பு மண்டலங்கள்",

        yourLocation:
            "உங்கள் இருப்பிடம்",

        detectLocation:
            "என் இருப்பிடத்தை கண்டறியவும்",

        reportIncident:
            "சம்பவத்தைப் புகாரளிக்கவும்",

        incidentZone:
            "இடம் / மண்டலம்",

        incidentType:
            "சம்பவ வகை",

        severity:
            "தீவிரம்",

        description:
            "விவரம்",

        submitIncident:
            "சம்பவத்தை சமர்ப்பிக்கவும்",

        emergency:
            "அவசர உதவி",

        safeRoute:
            "பாதுகாப்பான பாதையைத் தேடுங்கள்",

        adminDashboard:
            "பாதுகாப்பு செயல்பாட்டு டாஷ்போர்டு"

    }

};


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadData();

        renderEverything();

        updateTime();

        window.setInterval(
            updateTime,
            10000
        );

        window.setInterval(
            simulateEnvironmentalChanges,
            15000
        );

        updateConnectionStatus();

        window.addEventListener(
            "online",
            updateConnectionStatus
        );

        window.addEventListener(
            "offline",
            updateConnectionStatus
        );

    }
);


/* =========================================================
   LOCAL STORAGE
========================================================= */

function saveData() {

    localStorage.setItem(
        "pilgrimZones",
        JSON.stringify(zones)
    );

    localStorage.setItem(
        "pilgrimIncidents",
        JSON.stringify(incidents)
    );
}


function loadData() {

    const storedZones =
        localStorage.getItem(
            "pilgrimZones"
        );

    const storedIncidents =
        localStorage.getItem(
            "pilgrimIncidents"
        );


    if (storedZones) {

        try {

            zones =
                JSON.parse(storedZones);

        } catch {

            console.log(
                "Could not load zones"
            );

        }

    }


    if (storedIncidents) {

        try {

            incidents =
                JSON.parse(
                    storedIncidents
                );

        } catch {

            console.log(
                "Could not load incidents"
            );

        }

    }

}


/* =========================================================
   PAGE SWITCHING
========================================================= */

function showPage(page) {

    const visitorPage =
        document.getElementById(
            "visitorPage"
        );

    const adminPage =
        document.getElementById(
            "adminPage"
        );

    const visitorBtn =
        document.getElementById(
            "visitorBtn"
        );

    const adminBtn =
        document.getElementById(
            "adminBtn"
        );


    if (page === "visitor") {

        visitorPage.classList.add("active");

        adminPage.classList.remove("active");

        visitorBtn.classList.add("active");

        adminBtn.classList.remove("active");

    }


    if (page === "admin") {

        adminPage.classList.add("active");

        visitorPage.classList.remove("active");

        adminBtn.classList.add("active");

        visitorBtn.classList.remove("active");

        renderAdmin();

    }

}


/* =========================================================
   LANGUAGE
========================================================= */

function changeLanguage(language) {

    currentLanguage =
        language;


    const dictionary =
        translations[language];


    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            if (dictionary[key]) {

                element.textContent =
                    dictionary[key];

            }

        });


    showToast(
        "Language changed"
    );

}


/* =========================================================
   RISK ENGINE
========================================================= */

function calculateRisk(zone) {

    const crowdPercentage =
        (zone.people / zone.capacity) * 100;


    let crowdRisk;


    if (crowdPercentage < 50) {

        crowdRisk = 10;

    }
    else if (crowdPercentage < 75) {

        crowdRisk = 30;

    }
    else if (crowdPercentage < 100) {

        crowdRisk = 55;

    }
    else if (crowdPercentage < 125) {

        crowdRisk = 80;

    }
    else {

        crowdRisk = 100;

    }


    const zoneIncidents =
        incidents.filter(
            incident =>
                incident.zoneId === zone.id &&
                incident.status === "OPEN"
        );


    let incidentRisk = 0;


    zoneIncidents.forEach(
        incident => {

            if (
                incident.severity ===
                "CRITICAL"
            ) {

                incidentRisk += 100;

            }
            else if (
                incident.severity ===
                "HIGH"
            ) {

                incidentRisk += 75;

            }
            else if (
                incident.severity ===
                "MEDIUM"
            ) {

                incidentRisk += 45;

            }
            else {

                incidentRisk += 20;

            }

        }
    );


    incidentRisk =
        Math.min(
            incidentRisk,
            100
        );


    /*
       Weighted risk:

       Crowd      55%
       Incident   30%
       Weather    15%
    */

    const finalRisk =
        Math.round(

            crowdRisk * 0.55 +

            incidentRisk * 0.30 +

            zone.weatherRisk * 0.15

        );


    zone.risk =
        finalRisk;


    if (finalRisk < 40) {

        zone.status =
            "SAFE";

    }
    else if (finalRisk < 70) {

        zone.status =
            "WARNING";

    }
    else {

        zone.status =
            "DANGER";

    }


    return finalRisk;

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderEverything() {

    zones.forEach(
        zone => calculateRisk(zone)
    );

    renderVisitor();

    renderAdmin();

    populateIncidentZones();

    saveData();

}


/* =========================================================
   VISITOR PAGE
========================================================= */

function renderVisitor() {

    renderVisitorZones();


    let totalPeople = 0;

    let totalCapacity = 0;

    let highestRisk = 0;


    zones.forEach(zone => {

        totalPeople +=
            zone.people;

        totalCapacity +=
            zone.capacity;

        highestRisk =
            Math.max(
                highestRisk,
                zone.risk
            );

    });


    setVisitorRisk(
        highestRisk
    );


    let crowdText;


    const occupancy =
        (
            totalPeople /
            totalCapacity
        ) * 100;


    if (occupancy < 50) {

        crowdText = "Low";

    }
    else if (occupancy < 75) {

        crowdText = "Moderate";

    }
    else if (occupancy < 100) {

        crowdText = "High";

    }
    else {

        crowdText = "Very High";

    }


    document.getElementById(
        "visitorCrowd"
    ).textContent =
        crowdText;


    document.getElementById(
        "visitorCrowdPeople"
    ).textContent =
        `${totalPeople} visitors`;


    updateAlert(highestRisk);

}


/* =========================================================
   VISITOR RISK
========================================================= */

function setVisitorRisk(score) {

    const riskElement =
        document.getElementById(
            "visitorRisk"
        );

    const scoreElement =
        document.getElementById(
            "visitorRiskScore"
        );

    const bar =
        document.getElementById(
            "visitorRiskBar"
        );


    scoreElement.textContent =
        `${score} / 100`;


    bar.style.width =
        `${score}%`;


    if (score < 40) {

        riskElement.textContent =
            "LOW";

        riskElement.style.color =
            "#16a34a";

        bar.style.background =
            "#16a34a";

    }
    else if (score < 70) {

        riskElement.textContent =
            "MODERATE";

        riskElement.style.color =
            "#f59e0b";

        bar.style.background =
            "#f59e0b";

    }
    else {

        riskElement.textContent =
            "HIGH";

        riskElement.style.color =
            "#dc2626";

        bar.style.background =
            "#dc2626";

    }

}


/* =========================================================
   VISITOR ZONES
========================================================= */

function renderVisitorZones() {

    const container =
        document.getElementById(
            "visitorZones"
        );


    container.innerHTML = "";


    zones.forEach(zone => {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "zone-card " +
            zone.status.toLowerCase();


        div.innerHTML = `

            <div class="zone-top">

                <h3>
                    ${getZoneIcon(zone.status)}
                    ${zone.name}
                </h3>

                <span class="zone-status ${zone.status.toLowerCase()}">
                    ${zone.status}
                </span>

            </div>


            <div class="zone-info">

                <div>

                    <span>Visitors</span>

                    <strong>
                        ${zone.people}
                    </strong>

                </div>


                <div>

                    <span>Capacity</span>

                    <strong>
                        ${zone.capacity}
                    </strong>

                </div>


                <div>

                    <span>Risk</span>

                    <strong>
                        ${zone.risk}/100
                    </strong>

                </div>


                <div>

                    <span>Incidents</span>

                    <strong>
                        ${
                            incidents.filter(
                                i =>
                                    i.zoneId === zone.id &&
                                    i.status === "OPEN"
                            ).length
                        }
                    </strong>

                </div>

            </div>

        `;


        container.appendChild(div);

    });

}


/* =========================================================
   ADMIN PAGE
========================================================= */

function renderAdmin() {

    zones.forEach(
        zone => calculateRisk(zone)
    );


    renderAdminZones();

    renderAdminIncidents();

    updateAdminStats();

    updateAdminConditions();

    updateAdminStatus();

}


/* =========================================================
   ADMIN ZONES
========================================================= */

function renderAdminZones() {

    const container =
        document.getElementById(
            "adminZones"
        );


    container.innerHTML = "";


    zones.forEach(zone => {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "admin-zone";


        const occupancy =
            Math.round(
                (
                    zone.people /
                    zone.capacity
                ) * 100
            );


        div.innerHTML = `

            <div class="admin-zone-name">

                <h3>
                    ${getZoneIcon(zone.status)}
                    ${zone.name}
                </h3>

                <span>
                    Zone ID:
                    ${zone.id + 1}
                </span>

            </div>


            <div class="metric">

                <span>Visitors</span>

                <strong>
                    ${zone.people}
                </strong>

            </div>


            <div class="metric">

                <span>Occupancy</span>

                <strong>
                    ${occupancy}%
                </strong>

            </div>


            <div class="metric">

                <span>Risk</span>

                <strong>
                    ${zone.risk}
                </strong>

            </div>


            <div>

                <span class="risk-badge"
                      style="
                        background:${getRiskBackground(zone.status)};
                        color:${getRiskColor(zone.status)};
                      ">

                    ${zone.status}

                </span>

            </div>

        `;


        container.appendChild(div);

    });

}


/* =========================================================
   ADMIN INCIDENTS
========================================================= */

function renderAdminIncidents() {

    const container =
        document.getElementById(
            "adminIncidents"
        );


    container.innerHTML = "";


    const openIncidents =
        incidents.filter(
            incident =>
                incident.status === "OPEN"
        );


    if (
        openIncidents.length === 0
    ) {

        container.innerHTML = `

            <div class="map-card">

                <p>
                    ✅ No active incidents.
                    The site is operating normally.
                </p>

            </div>

        `;

        return;

    }


    openIncidents.forEach(
        incident => {

            const zone =
                zones.find(
                    z =>
                        z.id ===
                        incident.zoneId
                );


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "incident-card";


            div.innerHTML = `

                <div class="incident-top">

                    <h3>
                        🚨 ${incident.type}
                    </h3>

                    <span class="severity ${incident.severity}">
                        ${incident.severity}
                    </span>

                </div>


                <p>
                    <strong>
                        Zone:
                    </strong>

                    ${zone
                        ? zone.name
                        : "Unknown"
                    }
                </p>


                <p>
                    ${incident.description}
                </p>


                <p>
                    Reported:
                    ${incident.time}
                </p>


                <button class="resolve-btn"
                        onclick="resolveIncident(${incident.id})">

                    ✓ Resolve Incident

                </button>

            `;


            container.appendChild(div);

        }
    );

}


/* =========================================================
   ADMIN STATISTICS
========================================================= */

function updateAdminStats() {

    const totalVisitors =
        zones.reduce(
            (sum, zone) =>
                sum + zone.people,
            0
        );


    const highRisk =
        zones.filter(
            zone =>
                zone.status ===
                "DANGER"
        ).length;


    const openIncidents =
        incidents.filter(
            incident =>
                incident.status ===
                "OPEN"
        ).length;


    document.getElementById(
        "totalVisitors"
    ).textContent =
        totalVisitors;


    document.getElementById(
        "highRiskZones"
    ).textContent =
        highRisk;


    document.getElementById(
        "openIncidents"
    ).textContent =
        openIncidents;

}


/* =========================================================
   ADMIN STATUS
========================================================= */

function updateAdminStatus() {

    const pill =
        document.getElementById(
            "adminOverallStatus"
        );


    const highRisk =
        zones.some(
            zone =>
                zone.status ===
                "DANGER"
        );


    const mediumRisk =
        zones.some(
            zone =>
                zone.status ===
                "WARNING"
        );


    if (highRisk) {

        pill.textContent =
            "SYSTEM HIGH RISK";

        pill.style.background =
            "#fee2e2";

        pill.style.color =
            "#dc2626";

    }
    else if (mediumRisk) {

        pill.textContent =
            "SYSTEM WARNING";

        pill.style.background =
            "#fef3c7";

        pill.style.color =
            "#a16207";

    }
    else {

        pill.textContent =
            "SYSTEM SAFE";

        pill.style.background =
            "#dcfce7";

        pill.style.color =
            "#16a34a";

    }

}


/* =========================================================
   INCIDENT REPORTING
========================================================= */

function populateIncidentZones() {

    const select =
        document.getElementById(
            "incidentZone"
        );


    if (!select) return;


    select.innerHTML = "";


    zones.forEach(zone => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            zone.id;


        option.textContent =
            zone.name;


        select.appendChild(
            option
        );

    });

}


/* =========================================================
   REPORT INCIDENT
========================================================= */

function reportIncident() {

    const zoneId =
        Number(
            document.getElementById(
                "incidentZone"
            ).value
        );


    const type =
        document.getElementById(
            "incidentType"
        ).value;


    const severity =
        document.getElementById(
            "incidentSeverity"
        ).value;


    const description =
        document.getElementById(
            "incidentDescription"
        ).value.trim();


    if (!description) {

        showToast(
            "Please enter an incident description"
        );

        return;

    }


    const incident = {

        id:
            Date.now(),

        zoneId:
            zoneId,

        type:
            type,

        severity:
            severity,

        description:
            description,

        status:
            "OPEN",

        time:
            new Date().toLocaleString()

    };


    incidents.unshift(
        incident
    );


    saveData();

    renderEverything();


    document.getElementById(
        "incidentDescription"
    ).value = "";


    document.getElementById(
        "incidentMessage"
    ).innerHTML = `

        <div class="alert-box"
             style="margin:0">

            <div class="alert-icon">

                ✓

            </div>

            <div>

                <h3>
                    Incident Submitted
                </h3>

                <p>
                    Safety personnel have
                    been notified.
                </p>

            </div>

        </div>

    `;


    showToast(
        "Incident reported successfully"
    );

}


/* =========================================================
   RESOLVE INCIDENT
========================================================= */

function resolveIncident(id) {

    const incident =
        incidents.find(
            i =>
                i.id === id
        );


    if (!incident) return;


    incident.status =
        "CLOSED";


    saveData();

    renderEverything();


    showToast(
        "Incident resolved"
    );

}


/* =========================================================
   CLEAR RESOLVED
========================================================= */

function clearResolvedIncidents() {

    incidents =
        incidents.filter(
            incident =>
                incident.status !==
                "CLOSED"
        );


    saveData();

    renderEverything();


    showToast(
        "Resolved incidents cleared"
    );

}


/* =========================================================
   AI CAMERA
========================================================= */

async function startCamera() {

    const video =
        document.getElementById(
            "camera"
        );


    const overlay =
        document.getElementById(
            "cameraOverlay"
        );


    const status =
        document.getElementById(
            "cameraStatus"
        );


    try {

        cameraStream =
            await navigator.mediaDevices
                .getUserMedia({

                    video: {
                        facingMode:
                            "environment"
                    },

                    audio: false

                });


        video.srcObject =
            cameraStream;


        overlay.style.display =
            "none";


        status.textContent =
            "Camera Active";


        status.style.background =
            "#dcfce7";


        status.style.color =
            "#16a34a";


        if (!detectionModel) {

            status.textContent =
                "Loading AI...";


            detectionModel =
                await cocoSsd.load();


            document.getElementById(
                "aiModelStatus"
            ).textContent =
                "COCO-SSD Loaded";

        }


        detectionRunning =
            true;


        detectPeople();


        showToast(
            "AI camera started"
        );

    }
    catch(error) {

        console.error(error);


        showModal(`

            <h2>
                Camera Access Required
            </h2>

            <p style="margin-top:15px">

                Your browser needs permission
                to access the camera.

            </p>

            <p style="margin-top:10px">

                For this feature to work,
                allow camera permission
                when prompted.

            </p>

        `);

    }

}


/* =========================================================
   STOP CAMERA
========================================================= */

function stopCamera() {

    detectionRunning =
        false;


    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );

        cameraStream =
            null;

    }


    const video =
        document.getElementById(
            "camera"
        );


    video.srcObject =
        null;


    document.getElementById(
        "cameraOverlay"
    ).style.display =
        "flex";


    document.getElementById(
        "cameraStatus"
    ).textContent =
        "Camera Offline";


    document.getElementById(
        "cameraStatus"
    ).style.background =
        "#f1f5f9";


    document.getElementById(
        "cameraStatus"
    ).style.color =
        "#727b8d";


    showToast(
        "Camera stopped"
    );

}


/* =========================================================
   AI PEOPLE DETECTION
========================================================= */

async function detectPeople() {

    if (
        !detectionRunning ||
        !detectionModel
    ) {

        return;

    }


    const video =
        document.getElementById(
            "camera"
        );


    const canvas =
        document.getElementById(
            "cameraCanvas"
        );


    const ctx =
        canvas.getContext(
            "2d"
        );


    if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ) {

        requestAnimationFrame(
            detectPeople
        );

        return;

    }


    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;


    try {

        const predictions =
            await detectionModel.detect(
                video
            );


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        const people =
            predictions.filter(
                prediction =>
                    prediction.class ===
                    "person" &&
                    prediction.score >=
                    0.50
            );


        document.getElementById(
            "peopleDetected"
        ).textContent =
            people.length;


        /*
            Draw anonymous bounding boxes.
            We do NOT identify faces.
        */

        people.forEach(
            prediction => {

                const [
                    x,
                    y,
                    width,
                    height
                ] =
                    prediction.bbox;


                ctx.strokeStyle =
                    "#22c55e";

                ctx.lineWidth =
                    3;


                ctx.strokeRect(
                    x,
                    y,
                    width,
                    height
                );


                ctx.fillStyle =
                    "#22c55e";


                ctx.font =
                    "14px Arial";


                ctx.fillText(
                    "PERSON",
                    x,
                    Math.max(
                        15,
                        y - 5
                    )
                );

            }
        );


        /*
            Send anonymous count
            to selected zone.
        */

        updateZoneFromAI(
            people.length
        );

    }
    catch(error) {

        console.error(
            "Detection error:",
            error
        );

    }


    if (detectionRunning) {

        setTimeout(
            detectPeople,
            500
        );

    }

}


/* =========================================================
   UPDATE ZONE FROM AI
========================================================= */

function updateZoneFromAI(
    count
) {

    const zoneId =
        Number(
            document.getElementById(
                "aiZone"
            ).value
        );


    const zone =
        zones.find(
            z =>
                z.id ===
                zoneId
        );


    if (!zone) return;


    /*
       In a real deployment:
       count would be from the current
       camera zone.

       Here we update the selected
       demonstration zone.
    */

    zone.people =
        count;


    calculateRisk(
        zone
    );


    saveData();

    renderVisitor();

    renderAdmin();

}


/* =========================================================
   SIMULATE CROWD
========================================================= */

function simulateCrowd() {

    zones.forEach(zone => {

        const random =
            Math.floor(
                Math.random() *
                (
                    zone.capacity * 1.7
                )
            );


        zone.people =
            random;


        calculateRisk(zone);

    });


    saveData();

    renderEverything();


    showToast(
        "Crowd conditions simulated"
    );

}


/* =========================================================
   WEATHER / ENVIRONMENT
========================================================= */

function simulateEnvironmentalChanges() {

    const temperatures =
        [
            24,
            25,
            26,
            27,
            28,
            29,
            30
        ];


    const weatherStates =
        [
            "Sunny",
            "Partly Cloudy",
            "Cloudy",
            "Light Rain"
        ];


    const transportStates =
        [
            "Normal",
            "Moderate",
            "Delayed"
        ];


    const temperature =
        temperatures[
            Math.floor(
                Math.random() *
                temperatures.length
            )
        ];


    const weather =
        weatherStates[
            Math.floor(
                Math.random() *
                weatherStates.length
            )
        ];


    const transport =
        transportStates[
            Math.floor(
                Math.random() *
                transportStates.length
            )
        ];


    document.getElementById(
        "visitorWeather"
    ).textContent =
        `${temperature}°C`;


    document.getElementById(
        "visitorWeatherText"
    ).textContent =
        weather;


    document.getElementById(
        "adminWeather"
    ).textContent =
        `${temperature}°C`;


    document.getElementById(
        "adminWeatherStatus"
    ).textContent =
        weather;


    document.getElementById(
        "visitorTransport"
    ).textContent =
        transport;


    document.getElementById(
        "adminTransport"
    ).textContent =
        transport;


    /*
       Adjust weather risk
    */

    let weatherRisk =
        weather === "Light Rain"
            ? 70
            : weather === "Cloudy"
                ? 35
                : weather === "Partly Cloudy"
                    ? 20
                    : 10;


    zones.forEach(zone => {

        zone.weatherRisk =
            weatherRisk;

        calculateRisk(zone);

    });


    renderEverything();

}


/* =========================================================
   ALERT
========================================================= */

function updateAlert(
    highestRisk
) {

    const title =
        document.getElementById(
            "visitorAlertTitle"
        );


    const text =
        document.getElementById(
            "visitorAlertText"
        );


    const box =
        document.getElementById(
            "visitorAlert"
        );


    if (highestRisk >= 70) {

        title.textContent =
            "⚠ High Risk Alert";


        text.textContent =
            "One or more areas have dangerous crowd levels. Please avoid red zones and follow alternate routes.";


        box.style.background =
            "#fee2e2";


        box.style.borderColor =
            "#fecaca";

    }
    else if (highestRisk >= 40) {

        title.textContent =
            "⚠ Safety Advisory";


        text.textContent =
            "Crowd density is elevated in some areas. Please follow staff instructions.";


        box.style.background =
            "#fef3c7";


        box.style.borderColor =
            "#fde68a";

    }
    else {

        title.textContent =
            "✓ Site Operating Normally";


        text.textContent =
            "Current visitor conditions are within safe operating limits.";


        box.style.background =
            "#dcfce7";


        box.style.borderColor =
            "#bbf7d0";

    }

}


/* =========================================================
   GEOLOCATION
========================================================= */

function getUserLocation() {

    const message =
        document.getElementById(
            "locationMessage"
        );


    const result =
        document.getElementById(
            "locationResult"
        );


    if (
        !navigator.geolocation
    ) {

        message.textContent =
            "Geolocation is not supported by this browser.";

        return;

    }


    message.textContent =
        "Detecting your location...";


    navigator.geolocation.getCurrentPosition(

        position => {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            message.textContent =
                "Location detected successfully.";


            const nearest =
                findNearestZone(
                    lat,
                    lng
                );


            result.innerHTML = `

                <strong>
                    Your approximate location
                </strong>

                <br><br>

                Latitude:
                ${lat.toFixed(5)}

                <br>

                Longitude:
                ${lng.toFixed(5)}

                <br><br>

                Nearest safety zone:

                <strong>
                    ${nearest.name}
                </strong>

                <br>

                Status:

                <strong style="color:
                    ${getRiskColor(nearest.status)}">

                    ${nearest.status}

                </strong>

            `;


            /*
                Basic geofencing warning
            */

            if (
                nearest.status ===
                "DANGER"
            ) {

                showModal(`

                    <h2 style="color:#dc2626">
                        ⚠ Danger Zone
                    </h2>

                    <p style="margin-top:15px">

                        You appear to be near

                        <strong>
                            ${nearest.name}
                        </strong>

                        which currently has
                        a high safety risk.

                    </p>

                    <p style="margin-top:10px">

                        Please use an alternate
                        route and follow staff
                        instructions.

                    </p>

                `);

            }

        },

        error => {

            console.error(error);


            message.textContent =
                "Could not access your location.";


            result.innerHTML = `

                <p>
                    Please enable location
                    permission in your browser.
                </p>

            `;

        }

    );

}


/* =========================================================
   FIND NEAREST ZONE
========================================================= */

function findNearestZone(
    lat,
    lng
) {

    let nearest =
        zones[0];

    let smallestDistance =
        Infinity;


    zones.forEach(zone => {

        const distance =
            calculateDistance(
                lat,
                lng,
                zone.lat,
                zone.lng
            );


        if (
            distance <
            smallestDistance
        ) {

            smallestDistance =
                distance;

            nearest =
                zone;

        }

    });


    return nearest;

}


/* =========================================================
   DISTANCE
========================================================= */

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R =
        6371;


    const dLat =
        toRadians(
            lat2 - lat1
        );


    const dLon =
        toRadians(
            lon2 - lon1
        );


    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(
            toRadians(lat1)
        ) *

        Math.cos(
            toRadians(lat2)
        ) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return R * c;

}


function toRadians(
    degrees
) {

    return degrees *
        Math.PI /
        180;

}


/* =========================================================
   SAFE ROUTE
========================================================= */

function findSafeRoute() {

    const safeZones =
        zones.filter(
            zone =>
                zone.status ===
                "SAFE"
        );


    if (
        safeZones.length === 0
    ) {

        showModal(`

            <h2>
                No Safe Route Available
            </h2>

            <p style="margin-top:15px">

                Current conditions require
                you to remain where you are
                and follow emergency staff
                instructions.

            </p>

        `);

        return;

    }


    const route =
        safeZones
            .map(
                zone =>
                    zone.name
            )
            .join(
                " → "
            );


    showModal(`

        <h2>
            🗺 Safe Route
        </h2>

        <p style="margin-top:15px">

            Recommended safe areas:

        </p>

        <p style="
            margin-top:12px;
            font-weight:700;
            color:#16a34a;
        ">

            ${route}

        </p>

        <p style="
            margin-top:15px;
            color:#727b8d;
        ">

            Please follow the marked
            directions and staff guidance.

        </p>

    `);

}


/* =========================================================
   EMERGENCY
========================================================= */

function showEmergency() {

    showModal(`

        <h2 style="color:#dc2626">

            🚨 Emergency Assistance

        </h2>

        <p style="margin-top:15px">

            Emergency services can be contacted
            immediately.

        </p>


        <div style="
            display:grid;
            gap:10px;
            margin-top:20px;
        ">

            <button
                class="danger-btn"
                onclick="sendEmergency()">

                🚑 Medical

            </button>


            <button
                class="secondary-btn"
                onclick="broadcastAlert()">

                📢 Alert Site Management

            </button>

        </div>

    `);

}


/* =========================================================
   ADMIN ACTIONS
========================================================= */

function broadcastAlert() {

    showModal(`

        <h2>
            📢 Visitor Alert Sent
        </h2>

        <p style="margin-top:15px">

            A safety announcement has been
            simulated for all visitors.

        </p>

        <div style="
            margin-top:20px;
            padding:15px;
            background:#fef3c7;
            border-radius:10px;
        ">

            <strong>
                ⚠ Safety Advisory
            </strong>

            <br><br>

            Please avoid overcrowded areas
            and use designated alternate routes.

        </div>

    `);


    showToast(
        "Visitor alert broadcast"
    );

}


function closeDangerZone() {

    const dangerZone =
        zones.find(
            zone =>
                zone.status ===
                "DANGER"
        );


    if (!dangerZone) {

        showToast(
            "No danger zone currently active"
        );

        return;

    }


    dangerZone.people =
        Math.floor(
            dangerZone.people *
            0.55
        );


    calculateRisk(
        dangerZone
    );


    saveData();

    renderEverything();


    showToast(
        `${dangerZone.name} marked for closure`
    );

}


function sendEmergency() {

    showModal(`

        <h2 style="color:#dc2626">

            🚑 Emergency Response

        </h2>

        <p style="margin-top:15px">

            Emergency services have been
            notified in this demonstration.

        </p>

        <div style="
            margin-top:20px;
            padding:15px;
            background:#fee2e2;
            border-radius:10px;
        ">

            Response Status:
            <strong>
                DISPATCHING
            </strong>

        </div>

    `);


    showToast(
        "Emergency response initiated"
    );

}


function findAlternateRoute() {

    const safest =
        [...zones]
            .sort(
                (a, b) =>
                    a.risk - b.risk
            )[0];


    showModal(`

        <h2>
            🛣 Alternate Route
        </h2>

        <p style="margin-top:15px">

            The safest currently monitored
            zone is:

        </p>

        <h3 style="
            margin-top:15px;
            color:#16a34a;
        ">

            ${safest.name}

        </h3>

        <p style="margin-top:10px">

            Current risk:
            <strong>
                ${safest.risk}/100
            </strong>

        </p>

    `);

}


/* =========================================================
   CONNECTION STATUS
========================================================= */

function updateConnectionStatus() {

    const element =
        document.getElementById(
            "connectionStatus"
        );


    if (!element) return;


    if (
        navigator.onLine
    ) {

        element.textContent =
            "Online";

        element.style.color =
            "#16a34a";

    }
    else {

        element.textContent =
            "Offline";

        element.style.color =
            "#dc2626";

    }

}


/* =========================================================
   TIME
========================================================= */

function updateTime() {

    const element =
        document.getElementById(
            "lastUpdated"
        );


    if (!element) return;


    const now =
        new Date();


    element.textContent =
        "Updated " +
        now.toLocaleTimeString(
            [],
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit"
            }
        );

}


/* =========================================================
   ICONS / COLORS
========================================================= */

function getZoneIcon(status) {

    if (
        status ===
        "SAFE"
    ) {

        return "🟢";

    }


    if (
        status ===
        "WARNING"
    ) {

        return "🟠";

    }


    return "🔴";

}


function getRiskColor(status) {

    if (
        status ===
        "SAFE"
    ) {

        return "#16a34a";

    }


    if (
        status ===
        "WARNING"
    ) {

        return "#f59e0b";

    }


    return "#dc2626";

}


function getRiskBackground(status) {

    if (
        status ===
        "SAFE"
    ) {

        return "#dcfce7";

    }


    if (
        status ===
        "WARNING"
    ) {

        return "#fef3c7";

    }


    return "#fee2e2";

}


/* =========================================================
   MODAL
========================================================= */

function showModal(
    content
) {

    document.getElementById(
        "modalContent"
    ).innerHTML =
        content;


    document.getElementById(
        "modal"
    ).classList.add(
        "show"
    );

}


function closeModal() {

    document.getElementById(
        "modal"
    ).classList.remove(
        "show"
    );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    document.getElementById(
        "toastText"
    ).textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =========================================================
   SCROLL
========================================================= */

function scrollToSection(
    id
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.scrollIntoView({
            behavior:
                "smooth"
        });

    }

}
