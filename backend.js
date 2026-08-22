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
           AMA Bus (CRUT) live transport — falls back to a
           clearly-labeled simulation if no real endpoint is
           configured (see AMA_BUS_API_URL above). Updates
           independently of weather.
        */

        fetchAmaBusStatus();

        window.setInterval(
            fetchAmaBusStatus,
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


    renderAdminIncidents();

    updateAdminStatus();

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


/* =========================================================
   SHARED GEOLOCATION HELPER

   Every "detect my location" feature in the app (visitor
   location card, incident-report attach, admin risk check)
   funnels through this single function so the bug-prone
   parts — secure-context checks, timeouts, and per-error
   messaging — only have to be right once.

   Returns a Promise that resolves to { lat, lng } or rejects
   with an Error whose .message is already safe to show
   directly to the user.
========================================================= */

function getGeolocationPosition(options = {}) {

    return new Promise((resolve, reject) => {

        if (!("geolocation" in navigator)) {

            reject(new Error(
                "Geolocation is not supported by this browser."
            ));

            return;

        }


        /*
           navigator.geolocation exists on insecure origins in
           some browsers but every request silently fails there.
           window.isSecureContext is true for https:// and for
           localhost, so this correctly allows local development
           while catching the "opened over plain http" case that
           otherwise looks exactly like "the button does nothing".
        */

        if (
            window.isSecureContext === false
        ) {

            reject(new Error(
                "Location access needs a secure connection (https://). " +
                "This page is being served over an insecure connection, " +
                "so the browser is blocking the location request."
            ));

            return;

        }


        const requestOptions = {

            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,

            ...options

        };


        navigator.geolocation.getCurrentPosition(

            position => {

                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });

            },

            error => {

                let message =
                    "Could not access your location.";


                switch (error.code) {

                    case error.PERMISSION_DENIED:

                        message =
                            "Location permission was denied. Please allow " +
                            "location access for this site in your browser " +
                            "settings and try again.";

                        break;


                    case error.POSITION_UNAVAILABLE:

                        message =
                            "Your location could not be determined right now. " +
                            "Please check that location services are turned " +
                            "on for your device/browser and try again.";

                        break;


                    case error.TIMEOUT:

                        message =
                            "Location request timed out. Please check your " +
                            "connection and try again.";

                        break;

                }


                const wrapped =
                    new Error(message);

                wrapped.code =
                    error.code;

                reject(wrapped);

            },

            requestOptions

        );

    });

}


/*
   Resolve which location to send with
   an incident report: a manually
   attached location first, then the
   last detected user location, then a
   fresh live geolocation fetch.
*/

function resolveIncidentLocation() {

    if (incidentLocation) {

        return Promise.resolve(incidentLocation);

    }


    if (userLocation) {

        return Promise.resolve(userLocation);

    }


    return getGeolocationPosition()
        .then(location => {

            userLocation =
                location;

            return location;

        })
        .catch(error => {

            console.error(error);

            return null;

        });

}


function attachIncidentLocation() {

    const status =
        document.getElementById(
            "incidentLocationStatus"
        );

    const button =
        document.getElementById(
            "attachLocationBtn"
        );


    if (status) {

        status.textContent =
            "Detecting your location...";

    }

    if (button) {

        button.disabled = true;

    }


    getGeolocationPosition()
        .then(location => {

            incidentLocation =
                location;

            refreshIncidentLocationStatus();

            showToast(
                "Location attached to incident report"
            );

        })
        .catch(error => {

            console.error(error);

            if (status) {

                status.textContent =
                    `${error.message} You can still submit — a location will be requested automatically.`;

            }

        })
        .finally(() => {

            if (button) {

                button.disabled = false;

            }

        });

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
   AMA BUS (CRUT) — LIVE TRANSPORT

   AMA Bus (also written "Mo Bus") is the real public bus
   service for Bhubaneswar, run by CRUT (Capital Region
   Urban Transport). As of writing, CRUT does not publish a
   documented public developer API / API key for live bus
   positions (no GTFS-Realtime feed, no public token) — its
   live tracking only exists inside its own app/website.

   So this section is built the same honest way the weather
   section above is: AMA_BUS_API_URL is a placeholder. If
   you (or CRUT) ever get access to a real feed:
     1. Set AMA_BUS_API_URL / AMA_BUS_API_KEY below.
     2. fetchAmaBusStatus() will call it automatically.
   Until then, it clearly falls back to a labeled simulation
   — never silently pretends to be live data.
========================================================= */

const AMA_BUS_API_URL = "";   // e.g. a CRUT GTFS-Realtime or partner endpoint, once you have one
const AMA_BUS_API_KEY = "";   // fill in only if the endpoint above requires it


/*
   Routes that pass near the pilgrimage site, used for the
   admin route list. Route numbers/names are illustrative
   placeholders — swap in the real AMA Bus route numbers
   that serve your site once you have them.
*/

let amaBusRoutes = [

    { route: "AMA-12", name: "Airport – Temple Gate", etaMinutes: 6, occupancy: "Moderate" },
    { route: "AMA-27", name: "Railway Station – Temple Gate", etaMinutes: 11, occupancy: "Crowded" },
    { route: "AMA-04", name: "Bus Stand – Parking Area", etaMinutes: 4, occupancy: "Light" }

];


async function fetchAmaBusStatus() {

    const badge =
        document.getElementById("amaBusLiveBadge");

    if (badge) {

        badge.style.display = "none";

    }


    if (!AMA_BUS_API_URL) {

        /*
           No real endpoint configured — go straight to the
           labeled simulation instead of pretending to fetch.
        */

        simulateAmaBusStatus();

        return;

    }


    try {

        const response =
            await fetch(AMA_BUS_API_URL, {

                headers: AMA_BUS_API_KEY
                    ? { Authorization: `Bearer ${AMA_BUS_API_KEY}` }
                    : {}

            });


        if (!response.ok) {

            throw new Error("AMA Bus request failed");

        }


        const data =
            await response.json();

        /*
           NOTE: the shape of `data` depends entirely on
           whatever real endpoint you plug in — adapt this
           mapping to match it. This is just a reasonable
           example shape (array of {route, name, etaMinutes,
           occupancy}).
        */

        amaBusRoutes =
            Array.isArray(data.routes)
                ? data.routes
                : amaBusRoutes;


        applyAmaBusUpdate({

            statusText: "Live",
            detailText: `${amaBusRoutes.length} routes reporting`,
            live: true

        });

    } catch (error) {

        console.log(
            "Live AMA Bus fetch failed, using simulated data:",
            error
        );

        simulateAmaBusStatus();

    }

}


/*
   Fallback simulation — clearly labeled as such in the UI
   (no "Live" badge). Mirrors simulateTransportConditions()
   above, but also produces a per-route ETA list for the
   admin panel.
*/

function simulateAmaBusStatus() {

    const conditions =
        ["Normal", "Moderate", "Delayed"];

    const occupancyLevels =
        ["Light", "Moderate", "Crowded"];

    const overall =
        conditions[Math.floor(Math.random() * conditions.length)];


    amaBusRoutes =
        amaBusRoutes.map(route => ({

            ...route,

            etaMinutes:
                Math.max(2, route.etaMinutes + Math.round((Math.random() - 0.5) * 6)),

            occupancy:
                occupancyLevels[Math.floor(Math.random() * occupancyLevels.length)]

        }));


    applyAmaBusUpdate({

        statusText: overall,
        detailText: "Simulated — no public AMA Bus API configured",
        live: false

    });


    /*
       Keep feeding the existing visitor risk model, same
       as simulateTransportConditions() did.
    */

    document.getElementById("visitorTransport").textContent = overall;
    document.getElementById("adminTransport").textContent = overall;

    currentTransportRisk =
        overall === "Delayed" ? 75 :
        overall === "Moderate" ? 40 : 10;

    renderEverything();

}


function applyAmaBusUpdate({ statusText, detailText, live }) {

    const statusEl =
        document.getElementById("amaBusStatus");

    const detailEl =
        document.getElementById("amaBusStatusText");

    const badge =
        document.getElementById("amaBusLiveBadge");

    const listEl =
        document.getElementById("amaBusRoutes");


    if (statusEl) statusEl.textContent = statusText;

    if (detailEl) detailEl.textContent = detailText;

    if (badge) badge.style.display = live ? "inline-flex" : "none";


    if (listEl) {

        listEl.innerHTML =
            amaBusRoutes.map(route => `

                <div class="advisory-item">
                    <div>
                        <strong>${route.route}</strong>
                        — ${route.name}
                    </div>
                    <div style="color:var(--muted); font-size:13px; margin-top:4px;">
                        ETA ${route.etaMinutes} min · ${route.occupancy} occupancy
                    </div>
                </div>

            `).join("");

    }

}


/* =========================================================
   CROWD PREDICTION (historical time-of-day patterns)

   There's no real historical footfall dataset available for
   this prototype, so — same spirit as the zones' simulated
   capacity/people numbers above — this uses a heuristic
   model of typical pilgrimage-site crowd patterns by hour of
   day and weekday vs. weekend. Swap the numbers below for
   real historical data if/when you have it; the prediction
   functions below don't care where the multipliers come
   from.

   Each entry is 24 multipliers (one per hour, 0–1.6+) of a
   zone's capacity, roughly modeling: quiet overnight, a
   morning-darshan peak, a lull midday, and an evening peak.
========================================================= */

const historicalCrowdPatterns = {

    // Temple Entrance — steady, two clear peaks
    0: {
        weekday: [0.05,0.05,0.05,0.08,0.2,0.45,0.7,0.85,0.75,0.6,0.5,0.45,0.4,0.4,0.45,0.5,0.6,0.75,0.9,0.8,0.6,0.35,0.15,0.08],
        weekend: [0.08,0.06,0.06,0.1,0.3,0.6,0.85,1.0,0.95,0.85,0.75,0.7,0.65,0.65,0.7,0.75,0.85,0.95,1.05,0.9,0.7,0.45,0.2,0.1]
    },

    // Main Temple — highest during morning & evening aarti
    1: {
        weekday: [0.05,0.05,0.05,0.1,0.3,0.6,0.85,0.95,0.8,0.65,0.55,0.5,0.45,0.45,0.5,0.55,0.65,0.8,1.0,0.85,0.6,0.35,0.15,0.08],
        weekend: [0.08,0.06,0.06,0.15,0.4,0.75,1.0,1.15,1.05,0.95,0.85,0.8,0.75,0.75,0.8,0.85,0.95,1.1,1.2,1.0,0.75,0.5,0.25,0.12]
    },

    // Mountain Path — lower overnight, sharper daytime peak (light-dependent)
    2: {
        weekday: [0.02,0.02,0.02,0.03,0.1,0.35,0.6,0.75,0.7,0.6,0.55,0.5,0.45,0.45,0.5,0.55,0.6,0.65,0.55,0.35,0.15,0.05,0.02,0.02],
        weekend: [0.03,0.02,0.02,0.05,0.2,0.55,0.85,0.95,0.9,0.8,0.75,0.7,0.65,0.65,0.7,0.75,0.8,0.75,0.6,0.4,0.2,0.08,0.03,0.02]
    },

    // Parking Area — fills ahead of peak darshan times, empties after
    3: {
        weekday: [0.05,0.05,0.05,0.1,0.25,0.5,0.65,0.7,0.6,0.5,0.45,0.45,0.4,0.4,0.45,0.5,0.6,0.7,0.75,0.55,0.35,0.2,0.1,0.05],
        weekend: [0.06,0.05,0.05,0.15,0.35,0.65,0.8,0.85,0.75,0.65,0.6,0.6,0.55,0.55,0.6,0.65,0.75,0.85,0.9,0.7,0.5,0.3,0.15,0.08]
    }

};


function getCrowdMultiplier(zoneId, date) {

    const pattern =
        historicalCrowdPatterns[zoneId];

    if (!pattern) return 0.5;


    const day =
        date.getDay(); // 0 = Sunday ... 6 = Saturday

    const isWeekend =
        day === 0 || day === 6;

    const hour =
        date.getHours();


    return isWeekend
        ? pattern.weekend[hour]
        : pattern.weekday[hour];

}


/*
   Core prediction: given a lat/lng (the detected visitor
   location) and a time, find the nearest named place/zone
   and predict how crowded it's expected to be right now,
   based on the historical pattern above.
*/

function predictCrowdAtLocation(lat, lng, date = new Date()) {

    const zone =
        findNearestZone(lat, lng);

    const distanceKm =
        calculateDistance(lat, lng, zone.lat, zone.lng);

    const multiplier =
        getCrowdMultiplier(zone.id, date);

    const predictedPeople =
        Math.round(zone.capacity * multiplier);

    const predictedPercent =
        Math.round((predictedPeople / zone.capacity) * 100);

    const predictedStatus =
        predictedPercent >= 100 ? "DANGER" :
        predictedPercent >= 65 ? "WARNING" : "SAFE";


    return {

        placeName: zone.name,
        zoneId: zone.id,
        capacity: zone.capacity,
        predictedPeople,
        predictedPercent,
        predictedStatus,
        distanceKm,
        dateUsed: date

    };

}


/*
   Fetches a LIVE weather forecast for the exact detected
   coordinates (not the fixed Bhubaneswar city point used by
   fetchLiveWeather()). Falls back to the current city-wide
   weather risk if the request fails, so the flow still works
   offline / on API failure.
*/

async function fetchWeatherForCoordinates(lat, lng) {

    try {

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,precipitation,wind_speed_10m&timezone=Asia%2FKolkata`;

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error("Location weather request failed");

        }

        const data =
            await response.json();

        const current =
            data.current;

        const info =
            describeWeatherCode(current.weather_code);

        return {

            temperature: Math.round(current.temperature_2m),
            text: info.text,
            icon: info.icon,
            risk: info.risk,
            windSpeed: current.wind_speed_10m,
            precipitation: current.precipitation,
            live: true

        };

    } catch (error) {

        console.log(
            "Location-specific weather fetch failed, using city-wide reading:",
            error
        );

        return {

            temperature: null,
            text: "Unavailable (using city-wide reading)",
            icon: "fa-cloud",
            risk: currentWeatherRisk,
            windSpeed: null,
            precipitation: null,
            live: false

        };

    }

}


/*
   Converts a crowd prediction percentage into a 0-100 risk
   score using the same bands as calculateRisk(), so crowd
   risk is scored consistently everywhere in the app.
*/

function crowdPercentToRisk(percent) {

    if (percent < 50) return 10;
    if (percent < 75) return 30;
    if (percent < 100) return 55;
    if (percent < 125) return 80;

    return 100;

}


/*
   Combines the crowd-density prediction for the detected
   location with the live weather reading for those exact
   coordinates (plus any open incidents already logged for
   the nearest zone) into a single risky / not-risky
   conclusion.

   Weighting mirrors calculateRisk(): crowd matters most,
   weather and open incidents adjust it up or down.

       Crowd density   50%
       Weather         30%
       Open incidents  20%
*/

function computeLocationSafety(prediction, weather) {

    const crowdRisk =
        crowdPercentToRisk(prediction.predictedPercent);

    const weatherRisk =
        weather.risk;

    const zoneIncidents =
        incidents.filter(
            incident =>
                incident.zoneId === prediction.zoneId &&
                incident.status === "OPEN"
        ).length;

    const incidentRisk =
        Math.min(zoneIncidents * 35, 100);

    const combinedScore =
        Math.round(
            crowdRisk * 0.50 +
            weatherRisk * 0.30 +
            incidentRisk * 0.20
        );

    let conclusion;
    let isRisky;

    if (combinedScore >= 65) {

        conclusion = "RISKY";
        isRisky = true;

    }
    else if (combinedScore >= 40) {

        conclusion = "USE CAUTION";
        isRisky = true;

    }
    else {

        conclusion = "NOT RISKY";
        isRisky = false;

    }

    return {

        crowdRisk,
        weatherRisk,
        incidentRisk,
        openIncidentCount: zoneIncidents,
        combinedScore,
        conclusion,
        isRisky

    };

}


/*
   Admin-triggered flow: detect the current browser's
   location (standing in, in this single-client prototype,
   for "the visitor using the app right now"), name the
   nearest place they're in, pull live weather for those exact
   coordinates, predict crowd density there, and render a
   combined risky / not-risky conclusion.
*/

function runLocationSafetyCheck() {

    const resultEl =
        document.getElementById("crowdPredictionResult");

    if (!resultEl) return;


    const button =
        document.getElementById("runLocationSafetyBtn");


    resultEl.innerHTML =
        `<p class="advisory-empty">Detecting location…</p>`;

    if (button) {

        button.disabled = true;

    }


    getGeolocationPosition()
        .then(async ({ lat, lng }) => {

            userLocation = { lat, lng };

            resultEl.innerHTML =
                `<p class="advisory-empty">Location found — fetching weather forecast and predicting crowd density…</p>`;

            const prediction =
                predictCrowdAtLocation(lat, lng);

            const weather =
                await fetchWeatherForCoordinates(lat, lng);

            const safety =
                computeLocationSafety(prediction, weather);

            renderLocationSafety(prediction, weather, safety);

        })
        .catch(error => {

            console.error(error);

            resultEl.innerHTML =
                `<p class="advisory-empty">${error.message}</p>`;

        })
        .finally(() => {

            if (button) {

                button.disabled = false;

            }

        });

}


function renderLocationSafety(prediction, weather, safety) {

    const resultEl =
        document.getElementById("crowdPredictionResult");

    if (!resultEl) return;


    const crowdColor =
        getRiskColor(prediction.predictedStatus);

    const conclusionColor =
        safety.conclusion === "NOT RISKY" ? "#16a34a" :
        safety.conclusion === "USE CAUTION" ? "#f59e0b" : "#dc2626";

    const timeLabel =
        prediction.dateUsed.toLocaleString([], {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit"
        });

    const temperatureText =
        weather.temperature !== null
            ? `${weather.temperature}°C, ${weather.text}`
            : weather.text;

    const conclusionSentence =
        safety.conclusion === "NOT RISKY"
            ? `Conditions at ${prediction.placeName} are calm right now — low crowd density and manageable weather. Being here does not currently look risky.`
            : safety.conclusion === "USE CAUTION"
            ? `${prediction.placeName} shows a moderate combined risk right now, driven by crowd levels and/or weather. Being here carries some risk — stay alert.`
            : `${prediction.placeName} shows a high combined risk right now. Being in this place is risky at the moment — consider moving to a lower-risk area.`;


    resultEl.innerHTML = `

        <div class="advisory-item">

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>You are currently near: ${prediction.placeName}</strong>
                <span style="color:${conclusionColor}; font-weight:700;">${safety.conclusion}</span>
            </div>

            <p style="margin-top:6px; color:var(--muted); font-size:13px;">
                Nearest detected place · ${prediction.distanceKm.toFixed(2)} km away · ${timeLabel}
                ${weather.live ? " · live weather for these coordinates" : " · weather fallback (city-wide reading)"}
            </p>

            <p style="margin-top:10px;">
                <i class="fa-solid fa-cloud-sun"></i>
                Weather here: <strong>${temperatureText}</strong>
            </p>

            <p style="margin-top:6px;">
                <i class="fa-solid fa-users"></i>
                Predicted crowd: <strong>${prediction.predictedPeople}</strong>
                of ${prediction.capacity} capacity
                (<strong style="color:${crowdColor}">${prediction.predictedPercent}%</strong> ·
                ${prediction.predictedStatus})
            </p>

            ${safety.openIncidentCount > 0 ? `
            <p style="margin-top:6px; color:#dc2626;">
                <i class="fa-solid fa-triangle-exclamation"></i>
                ${safety.openIncidentCount} open incident(s) reported near this zone
            </p>` : ""}

            <p style="margin-top:10px; font-weight:600; color:${conclusionColor};">
                Conclusion: ${conclusionSentence}
            </p>

            <p style="margin-top:8px; color:var(--muted); font-size:12px;">
                Combined risk score ${safety.combinedScore}/100
                (crowd density 50% · weather 30% · open incidents 20%).
                Crowd density is based on typical time-of-day patterns for
                this location, not a live headcount.
            </p>

        </div>

    `;

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


    const button =
        document.getElementById(
            "detectLocationBtn"
        );


    message.textContent =
        "Detecting your location...";

    result.innerHTML = "";

    if (button) {

        button.disabled = true;

    }


    getGeolocationPosition()
        .then(({ lat, lng }) => {

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

        })
        .catch(error => {

            console.error(error);


            message.textContent =
                "Could not detect your location.";


            result.innerHTML = `

                <p>
                    ${error.message}
                </p>

            `;

        })
        .finally(() => {

            if (button) {

                button.disabled = false;

            }

        });

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