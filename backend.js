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
        lat: 20.2380,
        lng: 85.8315
    },

    {
        id: 1,
        name: "Main Temple",
        capacity: 150,
        people: 120,
        risk: 55,
        weatherRisk: 20,
        status: "WARNING",
        lat: 20.2388,
        lng: 85.8322
    },

    {
        id: 2,
        name: "Mountain Path",
        capacity: 100,
        people: 180,
        risk: 90,
        weatherRisk: 30,
        status: "DANGER",
        lat: 20.2408,
        lng: 85.8345
    },

    {
        id: 3,
        name: "Parking Area",
        capacity: 200,
        people: 70,
        risk: 25,
        weatherRisk: 10,
        status: "SAFE",
        lat: 20.2362,
        lng: 85.8298
    }

];


let incidents = [];


let facilities = [

    {
        name: "Bhubaneswar Trauma & Emergency Hospital",
        type: "Hospital",
        icon: "🏥",
        lat: 20.2392,
        lng: 85.8328
    },

    {
        name: "Public Washroom - Main Gate",
        type: "Washroom",
        icon: "🚻",
        lat: 20.2367,
        lng: 85.8302
    },

    {
        name: "Medical Camp - Temple Grounds",
        type: "Medical Camp",
        icon: "⛑️",
        lat: 20.2384,
        lng: 85.8318
    },

    {
        name: "Bhubaneswar City Fire Department",
        type: "Fire Department",
        icon: "🚒",
        lat: 20.2355,
        lng: 85.8285
    },

    {
        name: "Site Security & Police Post",
        type: "Security",
        icon: "🚓",
        lat: 20.2412,
        lng: 85.8350
    }

];


let userLocation = null;


/*
   Location manually attached to an
   incident report. Falls back to
   userLocation, then a live geolocation
   fetch, if not set.
*/

let incidentLocation = null;


/*
   Drive the visitor-facing risk meter
   from weather + transport conditions
   only (not crowd counts). Updated by
   simulateEnvironmentalChanges().
*/

let currentWeatherRisk = 20;

let currentTransportRisk = 10;


let currentLanguage = "en";


let cameraStream = null;

let detectionModel = null;

let detectionRunning = false;


/* =========================================================
   ADMIN AUTH

   Client-side gate only — this is a
   prototype. Credentials live in this
   file, so anyone can read them from
   the browser's dev tools. Don't reuse
   this pattern for a real deployment;
   a real admin login needs to be
   checked on a server.
========================================================= */

const ADMIN_USERNAME = "admin";

const ADMIN_PASSWORD = "12345";


let safetyAdvisories = [];


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

    en: {

        appName: "Safe Yatri AI",

        visitor: "Visitor",

        admin: "Admin Dashboard",

        heroTitle:
            "Safer Pilgrimage. Smarter Crowd Management.",

        heroText:
            "Safe Yatri AI keeps pilgrims and visitors safe in Bhubaneswar with real-time crowd monitoring, instant weather broadcasts, nearby facility locations, fast incident reporting and emergency response — even in low-connectivity areas.",

        checkSafety:
            "Check My Safety",

        currentSafety:
            "Current Safety Status",

        overallRisk:
            "Overall Risk",

        crowdLevel:
            "Crowd Level",

        weather:
            "Weather (Bhubaneswar)",

        transport:
            "Transport",

        nearbyFacilities:
            "Nearby Facilities",

        facilitiesHint:
            "Detect your location above to see the closest hospital, washroom and medical camp.",

        broadcastWeather:
            "Broadcast Bhubaneswar Weather",

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

        escapeRoute:
            "Find Nearest Escape Route",

        escapeMapTitle:
            "Bhubaneswar City — Escape Route Map",

        locateOnMap:
            "Locate My Position",

        incidentLocationLabel:
            "Attach Your Location",

        attachLocation:
            "Use My Current Location",

        adminDashboard:
            "Safety Operations Dashboard"

    },


    hi: {

        appName: "Safe Yatri AI",

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

        escapeRoute:
            "निकटतम निकासी मार्ग खोजें",

        escapeMapTitle:
            "भुवनेश्वर शहर — निकासी मार्ग मानचित्र",

        locateOnMap:
            "मेरी स्थिति पता करें",

        incidentLocationLabel:
            "अपना स्थान जोड़ें",

        attachLocation:
            "मेरा वर्तमान स्थान उपयोग करें",

        adminDashboard:
            "सुरक्षा संचालन डैशबोर्ड",

        nearbyFacilities:
            "नज़दीकी सुविधाएं",

        facilitiesHint:
            "निकटतम अस्पताल, शौचालय और मेडिकल कैंप देखने के लिए ऊपर अपना स्थान पता करें।",

        broadcastWeather:
            "BHU मौसम प्रसारित करें"

    },


    bn: {

        appName: "Safe Yatri AI",

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

        escapeRoute:
            "নিকটতম নিষ্ক্রমণ পথ খুঁজুন",

        escapeMapTitle:
            "ভুবনেশ্বর শহর — নিষ্ক্রমণ পথের মানচিত্র",

        locateOnMap:
            "আমার অবস্থান শনাক্ত করুন",

        incidentLocationLabel:
            "আপনার অবস্থান যুক্ত করুন",

        attachLocation:
            "আমার বর্তমান অবস্থান ব্যবহার করুন",

        adminDashboard:
            "নিরাপত্তা অপারেশন ড্যাশবোর্ড",

        nearbyFacilities:
            "নিকটবর্তী সুবিধা",

        facilitiesHint:
            "নিকটতম হাসপাতাল, ওয়াশরুম এবং মেডিকেল ক্যাম্প দেখতে উপরে আপনার অবস্থান শনাক্ত করুন।",

        broadcastWeather:
            "BHU আবহাওয়া প্রচার করুন"

    },


    ta: {

        appName: "Safe Yatri AI",

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

        escapeRoute:
            "அருகிலுள்ள வெளியேறும் பாதையைத் தேடுங்கள்",

        escapeMapTitle:
            "புவனேஸ்வர் நகரம் — வெளியேறும் பாதை வரைபடம்",

        locateOnMap:
            "எனது இருப்பிடத்தைக் கண்டறியவும்",

        incidentLocationLabel:
            "உங்கள் இருப்பிடத்தை இணைக்கவும்",

        attachLocation:
            "எனது தற்போதைய இருப்பிடத்தைப் பயன்படுத்தவும்",

        adminDashboard:
            "பாதுகாப்பு செயல்பாட்டு டாஷ்போர்டு",

        nearbyFacilities:
            "அருகிலுள்ள வசதிகள்",

        facilitiesHint:
            "அருகிலுள்ள மருத்துவமனை, கழிப்பறை மற்றும் மருத்துவ முகாமைக் காண மேலே உங்கள் இருப்பிடத்தைக் கண்டறியவும்.",

        broadcastWeather:
            "BHU வானிலையை ஒளிபரப்பவும்"

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

        /*
           Live weather for Bhubaneswar, refreshed
           every 10 minutes (weather doesn't change
           fast enough to justify polling more often,
           and it's respectful of the free API).
           Falls back to simulated data if the
           request fails (e.g. offline).
        */

        fetchLiveWeather();

        window.setInterval(
            fetchLiveWeather,
            10 * 60 * 1000
        );

        /*
           Transport conditions stay simulated —
           no free live feed for shuttle status —
           and update independently of weather.
        */

        simulateTransportConditions();

        window.setInterval(
            simulateTransportConditions,
            20000
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
        "safeYatriZones",
        JSON.stringify(zones)
    );

    localStorage.setItem(
        "safeYatriIncidents",
        JSON.stringify(incidents)
    );

    localStorage.setItem(
        "safeYatriAdvisories",
        JSON.stringify(safetyAdvisories)
    );
}


function loadData() {

    const storedZones =
        localStorage.getItem(
            "safeYatriZones"
        );

    const storedIncidents =
        localStorage.getItem(
            "safeYatriIncidents"
        );

    const storedAdvisories =
        localStorage.getItem(
            "safeYatriAdvisories"
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


    if (storedAdvisories) {

        try {

            safetyAdvisories =
                JSON.parse(
                    storedAdvisories
                );

        } catch {

            console.log(
                "Could not load advisories"
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

        if (!isAdminLoggedIn()) {

            showAdminLoginModal();

            return;

        }

        adminPage.classList.add("active");

        visitorPage.classList.remove("active");

        adminBtn.classList.add("active");

        visitorBtn.classList.remove("active");

        renderAdmin();

    }

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

function isAdminLoggedIn() {

    return (
        sessionStorage.getItem(
            "safeYatriAdminAuth"
        ) === "true"
    );

}


function showAdminLoginModal() {

    showModal(`

        <h2>
            <i class="fa-solid fa-lock"></i>
            Admin Login
        </h2>

        <p style="margin-top:10px; color:var(--muted)">
            Enter admin credentials to access
            the Safety Operations Dashboard.
        </p>

        <div class="form-group" style="margin-top:20px">

            <label>Username</label>

            <input type="text"
                   id="adminUsernameInput"
                   placeholder="Username"
                   autocomplete="username">

        </div>

        <div class="form-group" style="margin-top:14px">

            <label>Password</label>

            <input type="password"
                   id="adminPasswordInput"
                   placeholder="Password"
                   autocomplete="current-password">

        </div>

        <div id="adminLoginError"
             class="login-error">
        </div>

        <button class="primary-btn"
                style="width:100%; margin-top:10px"
                onclick="submitAdminLogin()">

            <i class="fa-solid fa-right-to-bracket"></i>
            Login

        </button>

    `);


    window.setTimeout(
        () => {

            const usernameField =
                document.getElementById(
                    "adminUsernameInput"
                );

            const passwordField =
                document.getElementById(
                    "adminPasswordInput"
                );


            if (usernameField) {

                usernameField.focus();

            }


            [usernameField, passwordField].forEach(
                field => {

                    if (!field) return;


                    field.addEventListener(
                        "keydown",
                        event => {

                            if (event.key === "Enter") {

                                submitAdminLogin();

                            }

                        }
                    );

                }
            );

        },
        50
    );

}


function submitAdminLogin() {

    const username =
        document.getElementById(
            "adminUsernameInput"
        ).value.trim();

    const password =
        document.getElementById(
            "adminPasswordInput"
        ).value;

    const errorBox =
        document.getElementById(
            "adminLoginError"
        );


    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        sessionStorage.setItem(
            "safeYatriAdminAuth",
            "true"
        );

        closeModal();

        showToast(
            "Welcome, admin"
        );

        showPage(
            "admin"
        );

    }
    else {

        errorBox.textContent =
            "Incorrect username or password.";

    }

}


function adminLogout() {

    sessionStorage.removeItem(
        "safeYatriAdminAuth"
    );

    showPage(
        "visitor"
    );

    showToast(
        "Logged out of admin dashboard"
    );

}


/* =========================================================
   CHECK MY SAFETY
========================================================= */

function checkMySafety() {

    /*
       "Check my safety" takes the visitor
       straight to the location detector so
       they can see conditions for their
       own area, rather than a static scroll.
    */

    scrollToSection(
        "locationSection"
    );

    getUserLocation();

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

    renderSafetyAdvisories();

    renderEscapeMap();

    renderEscapeRouteSummary();

    refreshIncidentLocationStatus();

    saveData();

}


/* =========================================================
   VISITOR PAGE
========================================================= */

function renderVisitor() {

    /*
       The visitor-facing risk meter is
       driven only by current weather and
       transport conditions — no crowd or
       public headcount is shown here.
       Detailed crowd/incident risk stays
       on the admin dashboard.
    */

    const publicRisk =
        computeVisitorRisk();


    setVisitorRisk(
        publicRisk
    );


    updateAlert(publicRisk);

}


/* =========================================================
   VISITOR RISK (WEATHER + TRANSPORT)
========================================================= */

function computeVisitorRisk() {

    return Math.round(

        currentWeatherRisk * 0.5 +

        currentTransportRisk * 0.5

    );

}


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
   ADMIN PAGE
========================================================= */

function renderAdmin() {

    zones.forEach(
        zone => calculateRisk(zone)
    );


    renderAdminZones();

    renderAdminIncidents();

    updateAdminStats();

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

                    ${incident.zoneName ||
                        (zone
                            ? zone.name
                            : "Unknown")
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

/* =========================================================
   REPORT INCIDENT
========================================================= */

/*
   Map each incident type to the kind of
   facility that should respond to it.
*/

function getRespondingFacility(type) {

    const typeMap = {

        "Medical Emergency":
            "Hospital",

        "Fire":
            "Fire Department",

        "Crowd Problem":
            "Security",

        "Blocked Path":
            "Security",

        "Weather Emergency":
            "Medical Camp",

        "Other":
            "Security"

    };


    const desiredType =
        typeMap[type] ||
        "Security";


    return (

        facilities.find(
            facility =>
                facility.type ===
                desiredType
        ) ||

        facilities[0]

    );

}


/*
   Resolve which location to send with
   an incident report: a manually
   attached location first, then the
   last detected user location, then a
   fresh live geolocation fetch.
*/

function resolveIncidentLocation() {

    return new Promise(resolve => {

        if (incidentLocation) {

            resolve(incidentLocation);

            return;

        }


        if (userLocation) {

            resolve(userLocation);

            return;

        }


        if (!navigator.geolocation) {

            resolve(null);

            return;

        }


        navigator.geolocation.getCurrentPosition(

            position => {

                const location = {

                    lat:
                        position.coords.latitude,

                    lng:
                        position.coords.longitude

                };


                userLocation =
                    location;


                resolve(location);

            },

            () => resolve(null),

            { timeout: 6000 }

        );

    });

}


function attachIncidentLocation() {

    const status =
        document.getElementById(
            "incidentLocationStatus"
        );


    if (!navigator.geolocation) {

        if (status) {

            status.textContent =
                "Geolocation is not supported by this browser.";

        }

        return;

    }


    if (status) {

        status.textContent =
            "Detecting your location...";

    }


    navigator.geolocation.getCurrentPosition(

        position => {

            incidentLocation = {

                lat:
                    position.coords.latitude,

                lng:
                    position.coords.longitude

            };


            refreshIncidentLocationStatus();


            showToast(
                "Location attached to incident report"
            );

        },

        error => {

            console.error(error);


            if (status) {

                status.textContent =
                    "Could not access your location. You can still submit — one will be requested automatically.";

            }

        }

    );

}


function refreshIncidentLocationStatus() {

    const status =
        document.getElementById(
            "incidentLocationStatus"
        );


    if (!status) return;


    if (incidentLocation) {

        status.textContent =
            `Location attached: ${incidentLocation.lat.toFixed(5)}, ${incidentLocation.lng.toFixed(5)}`;

    }
    else if (userLocation) {

        status.textContent =
            `Using your last detected location automatically (${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}).`;

    }
    else {

        status.textContent =
            "No location attached yet — one will be fetched automatically when you submit.";

    }

}


/* =========================================================
   REPORT INCIDENT
========================================================= */

async function reportIncident() {

    const zoneText =
        document.getElementById(
            "incidentZone"
        ).value.trim();


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


    if (!zoneText) {

        showToast(
            "Please enter a location or zone"
        );

        return;

    }


    if (!description) {

        showToast(
            "Please enter an incident description"
        );

        return;

    }


    /*
       Try to match the typed text
       to a known monitored zone
       (case-insensitive). If it
       doesn't match, we still accept
       it as a free-text location.
    */

    const matchedZone =
        zones.find(
            zone =>
                zone.name.toLowerCase() ===
                zoneText.toLowerCase()
        );


    /*
       Attach location — manually set,
       previously detected, or a fresh
       live fetch — and route the report
       straight to the matching facility
       (hospital, fire department, etc.)
       chosen by incident type.
    */

    const effectiveLocation =
        await resolveIncidentLocation();


    const facility =
        getRespondingFacility(type);


    let etaMinutes = null;


    if (effectiveLocation) {

        const distance =
            calculateDistance(
                effectiveLocation.lat,
                effectiveLocation.lng,
                facility.lat,
                facility.lng
            );


        etaMinutes =
            Math.max(
                3,
                Math.round(
                    (distance / 25) * 60
                ) + 2
            );

    }


    const incident = {

        id:
            Date.now(),

        zoneId:
            matchedZone
                ? matchedZone.id
                : null,

        zoneName:
            matchedZone
                ? matchedZone.name
                : zoneText,

        type:
            type,

        severity:
            severity,

        description:
            description,

        location:
            effectiveLocation,

        respondingFacility:
            facility.name,

        respondingFacilityType:
            facility.type,

        etaMinutes:
            etaMinutes,

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
        "incidentZone"
    ).value = "";


    incidentLocation = null;

    refreshIncidentLocationStatus();


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
                    ${facility.icon}
                    <strong>${facility.name}</strong>
                    has been notified
                    ${etaMinutes
                        ? `— estimated response time <strong>${etaMinutes} min</strong>.`
                        : "based on your report."}
                </p>

            </div>

        </div>

    `;


    showToast(
        `Incident reported — ${facility.name} notified`
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
   LIVE WEATHER (Bhubaneswar) — Open-Meteo
   No API key required.
========================================================= */

const BHUBANESWAR_LAT = 20.2961;

const BHUBANESWAR_LNG = 85.8245;


const WEATHER_CODE_INFO = {

    0:  { text: "Clear Sky",              icon: "fa-sun",                  risk: 10 },
    1:  { text: "Mainly Clear",           icon: "fa-sun",                  risk: 10 },
    2:  { text: "Partly Cloudy",          icon: "fa-cloud-sun",            risk: 15 },
    3:  { text: "Overcast",               icon: "fa-cloud",                risk: 20 },
    45: { text: "Fog",                    icon: "fa-smog",                 risk: 35 },
    48: { text: "Depositing Fog",         icon: "fa-smog",                 risk: 35 },
    51: { text: "Light Drizzle",          icon: "fa-cloud-rain",           risk: 30 },
    53: { text: "Drizzle",                icon: "fa-cloud-rain",           risk: 35 },
    55: { text: "Dense Drizzle",          icon: "fa-cloud-rain",           risk: 40 },
    61: { text: "Light Rain",             icon: "fa-cloud-rain",           risk: 45 },
    63: { text: "Rain",                   icon: "fa-cloud-showers-heavy",  risk: 55 },
    65: { text: "Heavy Rain",             icon: "fa-cloud-showers-heavy",  risk: 70 },
    66: { text: "Freezing Rain",          icon: "fa-cloud-rain",           risk: 60 },
    67: { text: "Heavy Freezing Rain",    icon: "fa-cloud-rain",           risk: 70 },
    71: { text: "Light Snow",             icon: "fa-snowflake",            risk: 40 },
    73: { text: "Snow",                   icon: "fa-snowflake",            risk: 50 },
    75: { text: "Heavy Snow",             icon: "fa-snowflake",            risk: 65 },
    80: { text: "Rain Showers",           icon: "fa-cloud-showers-heavy",  risk: 50 },
    81: { text: "Heavy Rain Showers",     icon: "fa-cloud-showers-heavy",  risk: 65 },
    82: { text: "Violent Rain Showers",   icon: "fa-cloud-showers-heavy",  risk: 80 },
    95: { text: "Thunderstorm",           icon: "fa-cloud-bolt",           risk: 85 },
    96: { text: "Thunderstorm w/ Hail",   icon: "fa-cloud-bolt",           risk: 90 },
    99: { text: "Severe Thunderstorm",    icon: "fa-cloud-bolt",           risk: 95 }

};


function describeWeatherCode(code) {

    return (
        WEATHER_CODE_INFO[code] ||
        { text: "Unknown", icon: "fa-cloud", risk: 20 }
    );

}


async function fetchLiveWeather() {

    try {

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${BHUBANESWAR_LAT}&longitude=${BHUBANESWAR_LNG}&current=temperature_2m,weather_code&timezone=Asia%2FKolkata`;

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Weather request failed"
            );

        }


        const data =
            await response.json();

        const current =
            data.current;

        const info =
            describeWeatherCode(
                current.weather_code
            );


        applyWeatherUpdate({

            temperature:
                Math.round(current.temperature_2m),

            text:
                info.text,

            icon:
                info.icon,

            risk:
                info.risk,

            live:
                true

        });

    } catch (error) {

        console.log(
            "Live weather fetch failed, using simulated data:",
            error
        );

        simulateEnvironmentalChanges();

    }

}


function applyWeatherUpdate({ temperature, text, icon, risk, live }) {

    document.getElementById("visitorWeather").textContent =
        `${temperature}°C`;

    document.getElementById("visitorWeatherText").textContent =
        text;

    document.getElementById("adminWeather").textContent =
        `${temperature}°C`;

    document.getElementById("adminWeatherStatus").textContent =
        text;


    const visitorIcon =
        document.getElementById("weatherIcon");

    if (visitorIcon) {

        visitorIcon.className =
            `fa-solid ${icon}`;

    }


    const adminIcon =
        document.getElementById("adminWeatherIcon");

    if (adminIcon) {

        adminIcon.className =
            `fa-solid ${icon}`;

    }


    const liveBadge =
        document.getElementById("weatherLiveBadge");

    if (liveBadge) {

        liveBadge.style.display =
            live ? "inline-flex" : "none";

    }


    currentWeatherRisk =
        risk;


    zones.forEach(zone => {

        zone.weatherRisk =
            risk;

        calculateRisk(zone);

    });


    renderEverything();

}


/*
   Transport conditions aren't available
   from a free public API for this site,
   so they stay simulated — independently
   from the (now live) weather.
*/

function simulateTransportConditions() {

    const transportStates =
        [
            "Normal",
            "Moderate",
            "Delayed"
        ];


    const transport =
        transportStates[
            Math.floor(
                Math.random() *
                transportStates.length
            )
        ];


    document.getElementById("visitorTransport").textContent =
        transport;

    document.getElementById("adminTransport").textContent =
        transport;


    currentTransportRisk =
        transport === "Delayed"
            ? 75
            : transport === "Moderate"
                ? 40
                : 10;


    renderEverything();

}


/* =========================================================
   WEATHER / ENVIRONMENT (fallback simulation — used only
   if the live weather fetch above fails, e.g. offline)
========================================================= */

function simulateEnvironmentalChanges() {

    const liveBadge =
        document.getElementById("weatherLiveBadge");

    if (liveBadge) {

        liveBadge.style.display =
            "none";

    }


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


    let transportRisk =
        transport === "Delayed"
            ? 75
            : transport === "Moderate"
                ? 40
                : 10;


    /*
       These two drive the visitor-facing
       risk meter (see computeVisitorRisk).
    */

    currentWeatherRisk =
        weatherRisk;

    currentTransportRisk =
        transportRisk;


    zones.forEach(zone => {

        zone.weatherRisk =
            weatherRisk;

        calculateRisk(zone);

    });


    renderEverything();

}


/* =========================================================
   WEATHER BROADCAST (BHU)
========================================================= */

function broadcastWeatherUpdate() {

    const temp =
        document.getElementById(
            "visitorWeather"
        ).textContent;


    const condition =
        document.getElementById(
            "visitorWeatherText"
        ).textContent;


    showModal(`

        <h2>
            📢 Weather Broadcast — Bhubaneswar
        </h2>

        <p style="margin-top:15px">
            Current live conditions at
            Bhubaneswar:
        </p>

        <div style="
            margin-top:20px;
            padding:15px;
            background:var(--blue-light);
            border-radius:10px;
        ">

            <strong>
                ${temp} · ${condition}
            </strong>

            <br><br>

            Pilgrims are advised to stay
            hydrated and carry rain
            protection if skies turn cloudy.

        </div>

    `);


    showToast(
        "Weather broadcast sent for Bhubaneswar"
    );

}


/* =========================================================
   ALERT
========================================================= */

function updateAlert(
    publicRisk
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


    if (publicRisk >= 70) {

        title.textContent =
            "⚠ High Risk Alert";


        text.textContent =
            "Weather or transport conditions are creating significant risk. Please avoid travel where possible and follow staff instructions.";


        box.style.background =
            "#fee2e2";


        box.style.borderColor =
            "#fecaca";

    }
    else if (publicRisk >= 40) {

        title.textContent =
            "⚠ Safety Advisory";


        text.textContent =
            "Weather or transport conditions require some caution. Please follow marked routes and staff instructions.";


        box.style.background =
            "#fef3c7";


        box.style.borderColor =
            "#fde68a";

    }
    else {

        title.textContent =
            "✓ Site Operating Normally";


        text.textContent =
            "Current weather and transport conditions are within safe operating limits.";


        box.style.background =
            "#dcfce7";


        box.style.borderColor =
            "#bbf7d0";

    }

}


/* =========================================================
   SAFETY ADVISORY (admin-composed, visitor-viewed)
========================================================= */

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


function sendSafetyAdvisory() {

    if (!isAdminLoggedIn()) {

        showToast(
            "Please log in as admin first"
        );

        return;

    }


    const messageField =
        document.getElementById(
            "advisoryMessage"
        );

    const severityField =
        document.getElementById(
            "advisorySeverity"
        );

    const message =
        messageField.value.trim();

    const severity =
        severityField.value;


    if (!message) {

        showToast(
            "Please enter an advisory message"
        );

        return;

    }


    safetyAdvisories.unshift({

        id:
            Date.now(),

        message:
            message,

        severity:
            severity,

        time:
            new Date().toISOString()

    });


    /*
       Keep the stored history from
       growing without limit.
    */

    safetyAdvisories =
        safetyAdvisories.slice(0, 20);


    messageField.value =
        "";


    saveData();

    renderSafetyAdvisories();


    showToast(
        "Safety advisory sent to visitors"
    );

}


function deleteSafetyAdvisory(id) {

    safetyAdvisories =
        safetyAdvisories.filter(
            advisory =>
                advisory.id !== id
        );

    saveData();

    renderSafetyAdvisories();

    showToast(
        "Advisory removed"
    );

}


function renderSafetyAdvisories() {

    const visitorContainer =
        document.getElementById(
            "visitorAdvisoryList"
        );

    const adminContainer =
        document.getElementById(
            "adminAdvisoryList"
        );


    if (safetyAdvisories.length === 0) {

        const emptyMessage =
            `<p class="advisory-empty">No advisories yet.</p>`;

        if (visitorContainer) {

            visitorContainer.innerHTML =
                `<p class="advisory-empty">No advisories from admin yet.</p>`;

        }

        if (adminContainer) {

            adminContainer.innerHTML =
                emptyMessage;

        }

        return;

    }


    const renderItem =
        (advisory, withDelete) => `

        <div class="advisory-item severity-${advisory.severity.toLowerCase()}">

            <div class="advisory-top">

                <strong>
                    ${advisory.severity}
                </strong>

                <span>
                    ${new Date(advisory.time).toLocaleString(
                        [],
                        { dateStyle: "medium", timeStyle: "short" }
                    )}
                </span>

            </div>

            <p>${escapeHtml(advisory.message)}</p>

            ${withDelete
                ? `<button class="resolve-btn" onclick="deleteSafetyAdvisory(${advisory.id})">
                        <i class="fa-solid fa-trash"></i> Remove
                   </button>`
                : ""
            }

        </div>

    `;


    if (visitorContainer) {

        visitorContainer.innerHTML =
            safetyAdvisories
                .map(advisory => renderItem(advisory, false))
                .join("");

    }


    if (adminContainer) {

        adminContainer.innerHTML =
            safetyAdvisories
                .map(advisory => renderItem(advisory, true))
                .join("");

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


            userLocation = {
                lat: lat,
                lng: lng
            };


            findNearbyFacilities(
                lat,
                lng
            );


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
   NEARBY FACILITIES
========================================================= */

function findNearbyFacilities(
    lat,
    lng
) {

    const container =
        document.getElementById(
            "facilitiesResult"
        );

    const hint =
        document.getElementById(
            "facilitiesHint"
        );


    if (!container) return;


    const withDistance =
        facilities.map(
            facility => ({
                ...facility,
                distance:
                    calculateDistance(
                        lat,
                        lng,
                        facility.lat,
                        facility.lng
                    )
            })
        ).sort(
            (a, b) =>
                a.distance - b.distance
        );


    if (hint) {

        hint.style.display =
            "none";

    }


    container.innerHTML =
        withDistance.map(
            facility => `

                <div class="facility-item">

                    <span class="facility-icon">
                        ${facility.icon}
                    </span>

                    <div>

                        <strong>
                            ${facility.name}
                        </strong>

                        <p>
                            ${facility.type} ·
                            ${facility.distance.toFixed(2)} km away
                        </p>

                    </div>

                </div>

            `
        ).join("");

}


/* =========================================================
   ESCAPE ROUTE MAP (OFFLINE)
========================================================= */

/*
   Everything here runs on data already
   held in memory (zones, facilities) plus
   the device's own geolocation — no map
   tiles or network requests are used, so
   it keeps working with no connection.
*/

function findNearestEscapeRoute() {

    scrollToSection(
        "escapeMapSection"
    );


    renderEscapeMap();

    renderEscapeRouteSummary();


    if (!userLocation) {

        locateOnEscapeMap();

    }

}


function locateOnEscapeMap() {

    const summary =
        document.getElementById(
            "escapeRouteSummary"
        );


    if (!navigator.geolocation) {

        if (summary) {

            summary.innerHTML =
                "<p>Geolocation is not supported by this browser.</p>";

        }

        return;

    }


    if (summary) {

        summary.innerHTML =
            "<p>Detecting your location...</p>";

    }


    navigator.geolocation.getCurrentPosition(

        position => {

            userLocation = {

                lat:
                    position.coords.latitude,

                lng:
                    position.coords.longitude

            };


            refreshIncidentLocationStatus();

            renderEscapeMap();

            renderEscapeRouteSummary();


            showToast(
                "Position located on the offline map"
            );

        },

        error => {

            console.error(error);


            if (summary) {

                summary.innerHTML =
                    "<p>Could not access your location. Please enable location permission and try again.</p>";

            }

        }

    );

}


/*
   Project a lat/lng onto the schematic
   map's pixel grid, given the bounding
   box of every point being plotted.
*/

function projectToMap(
    lat,
    lng,
    bounds,
    width,
    height,
    padding
) {

    const latSpan =
        (bounds.maxLat - bounds.minLat) ||
        0.001;

    const lngSpan =
        (bounds.maxLng - bounds.minLng) ||
        0.001;


    const xRatio =
        (lng - bounds.minLng) /
        lngSpan;

    const yRatio =
        (bounds.maxLat - lat) /
        latSpan;


    return {

        x:
            padding +
            xRatio * (width - padding * 2),

        y:
            padding +
            yRatio * (height - padding * 2)

    };

}


function computeBearing(
    lat1,
    lng1,
    lat2,
    lng2
) {

    const dLon =
        toRadians(lng2 - lng1);


    const y =
        Math.sin(dLon) *
        Math.cos(toRadians(lat2));


    const x =
        Math.cos(toRadians(lat1)) *
        Math.sin(toRadians(lat2)) -

        Math.sin(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.cos(dLon);


    let bearing =
        Math.atan2(y, x) *
        180 / Math.PI;


    bearing =
        (bearing + 360) % 360;


    const directions =
        [
            "N", "NNE", "NE", "ENE",
            "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW",
            "W", "WNW", "NW", "NNW"
        ];


    const index =
        Math.round(bearing / 22.5) % 16;


    return directions[index];

}


function nearestEscapeZone() {

    const safeZones =
        zones.filter(
            zone =>
                zone.status === "SAFE"
        );


    const candidates =
        safeZones.length > 0
            ? safeZones
            : [...zones].sort(
                (a, b) =>
                    a.risk - b.risk
            );


    if (!userLocation) {

        return candidates[0];

    }


    return candidates.reduce(
        (closest, zone) =>

            calculateDistance(
                userLocation.lat,
                userLocation.lng,
                zone.lat,
                zone.lng
            ) <

            calculateDistance(
                userLocation.lat,
                userLocation.lng,
                closest.lat,
                closest.lng
            )

                ? zone
                : closest

    );

}


function renderEscapeMap() {

    const container =
        document.getElementById(
            "escapeMapContainer"
        );


    if (!container) return;


    const width = 600;

    const height = 380;

    const padding = 46;


    const isDark =
        document.body.classList.contains(
            "dark-theme"
        );


    const mapBackground =
        isDark ? "#101a2e" : "#e9eefb";

    const labelColor =
        isDark ? "#f8fafc" : "#172033";

    const mutedColor =
        isDark ? "#aeb8ca" : "#727b8d";


    const points =
        [
            ...zones.map(
                zone => ({
                    lat: zone.lat,
                    lng: zone.lng
                })
            ),

            ...facilities.map(
                facility => ({
                    lat: facility.lat,
                    lng: facility.lng
                })
            )
        ];


    if (userLocation) {

        points.push({
            lat: userLocation.lat,
            lng: userLocation.lng
        });

    }


    const bounds = {

        minLat:
            Math.min(...points.map(p => p.lat)),

        maxLat:
            Math.max(...points.map(p => p.lat)),

        minLng:
            Math.min(...points.map(p => p.lng)),

        maxLng:
            Math.max(...points.map(p => p.lng))

    };


    let svg =
        `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">`;


    svg +=
        `<rect x="0" y="0" width="${width}" height="${height}" rx="16" fill="${mapBackground}" />`;


    /*
       Route line from the visitor to
       the nearest usable escape zone,
       drawn first so markers sit on top.
    */

    if (userLocation) {

        const target =
            nearestEscapeZone();

        const userPoint =
            projectToMap(
                userLocation.lat,
                userLocation.lng,
                bounds, width, height, padding
            );

        const targetPoint =
            projectToMap(
                target.lat,
                target.lng,
                bounds, width, height, padding
            );


        svg += `
            <line x1="${userPoint.x}" y1="${userPoint.y}"
                  x2="${targetPoint.x}" y2="${targetPoint.y}"
                  stroke="#2563eb" stroke-width="3"
                  stroke-dasharray="7 6" stroke-linecap="round" />
        `;

    }


    /*
       Zones
    */

    zones.forEach(zone => {

        const p =
            projectToMap(
                zone.lat, zone.lng,
                bounds, width, height, padding
            );

        const color =
            getRiskColor(zone.status);


        svg += `
            <circle cx="${p.x}" cy="${p.y}" r="15"
                    fill="${color}" fill-opacity="0.18"
                    stroke="${color}" stroke-width="2.5" />
            <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${color}" />
            <text x="${p.x}" y="${p.y - 22}" font-size="11"
                  font-weight="700" text-anchor="middle"
                  fill="${labelColor}">${zone.name}</text>
        `;

    });


    /*
       Facilities
    */

    facilities.forEach(facility => {

        const p =
            projectToMap(
                facility.lat, facility.lng,
                bounds, width, height, padding
            );


        svg += `
            <circle cx="${p.x}" cy="${p.y}" r="10"
                    fill="${isDark ? "#151f35" : "#ffffff"}"
                    stroke="#2563eb" stroke-width="2" />
            <text x="${p.x}" y="${p.y + 4}" font-size="11"
                  text-anchor="middle">${facility.icon}</text>
            <text x="${p.x}" y="${p.y + 20}" font-size="9"
                  text-anchor="middle" fill="${mutedColor}">${facility.type}</text>
        `;

    });


    /*
       Visitor marker, drawn last so it
       sits above everything else.
    */

    if (userLocation) {

        const userPoint =
            projectToMap(
                userLocation.lat,
                userLocation.lng,
                bounds, width, height, padding
            );


        svg += `
            <circle cx="${userPoint.x}" cy="${userPoint.y}" r="14"
                    fill="none" stroke="#2563eb" stroke-width="2" opacity="0.4" />
            <circle cx="${userPoint.x}" cy="${userPoint.y}" r="7"
                    fill="#2563eb" stroke="#ffffff" stroke-width="2" />
            <text x="${userPoint.x}" y="${userPoint.y + 26}" font-size="11"
                  font-weight="700" text-anchor="middle" fill="#2563eb">You</text>
        `;

    }


    svg += "</svg>";


    container.innerHTML = svg;

}


function renderEscapeRouteSummary() {

    const summary =
        document.getElementById(
            "escapeRouteSummary"
        );


    if (!summary) return;


    if (!userLocation) {

        summary.innerHTML = `

            <p>
                Tap "Locate My Position" to see your
                nearest escape route on the map above.
                Once loaded, this works without an
                internet connection.
            </p>

        `;

        return;

    }


    const target =
        nearestEscapeZone();

    const distance =
        calculateDistance(
            userLocation.lat,
            userLocation.lng,
            target.lat,
            target.lng
        );

    const direction =
        computeBearing(
            userLocation.lat,
            userLocation.lng,
            target.lat,
            target.lng
        );


    summary.innerHTML = `

        <strong>Nearest escape route</strong>

        <p style="margin-top:6px">
            Head <strong>${direction}</strong> toward
            <strong>${target.name}</strong> —
            about ${distance.toFixed(2)} km away.
        </p>

        <p style="margin-top:6px; color:var(--muted); font-size:13px">
            Zone status:
            <strong style="color:${getRiskColor(target.status)}">
                ${target.status}
            </strong>
        </p>

    `;

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

    let etaMinutes;

    let respondingFrom =
        "the nearest medical team";


    if (userLocation) {

        const hospital =
            facilities.find(
                facility =>
                    facility.type ===
                    "Hospital"
            ) ||
            facilities[0];


        const distance =
            calculateDistance(
                userLocation.lat,
                userLocation.lng,
                hospital.lat,
                hospital.lng
            );


        /*
           Assume ~25 km/h average
           speed through crowded
           pilgrimage routes, plus a
           fixed 2 minute dispatch buffer.
        */

        etaMinutes =
            Math.max(
                3,
                Math.round(
                    (distance / 25) * 60
                ) + 2
            );


        respondingFrom =
            hospital.name;

    }
    else {

        etaMinutes =
            Math.floor(
                Math.random() * 6
            ) + 5;

    }


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

            <br><br>

            Estimated arrival:
            <strong>
                ${etaMinutes} min
            </strong>

            <br>

            <span style="
                color:#727b8d;
                font-size:14px;
            ">
                from ${respondingFrom}
            </span>

        </div>

    `);


    showToast(
        `Emergency response initiated — ETA ${etaMinutes} min`
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