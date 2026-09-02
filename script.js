(function () {
    const toggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("safeYatriTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }

    toggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");

        const isDark = document.body.classList.contains("dark-theme");
        localStorage.setItem(
            "safeYatriTheme",
            isDark ? "dark" : "light"
        );

        // Keep the real map visually synchronized with the app theme.
        if (typeof updateEscapeMapTheme === "function") {
            updateEscapeMapTheme();
        }
    });
})();

/*
 * Register the offline service worker as early as possible so any
 * map tile (or app file) the user loads while online gets cached
 * automatically for offline use.
 */
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/sw.js")
            .catch(function (err) {
                console.error("Service worker registration failed:", err);
            });
    });
}

const placeSafetyFeatures = {

    "Lingaraj Temple":
        ["CCTV Surveillance", "Security Personnel", "First Aid Post", "Help Desk"],

    "Rajarani Temple":
        ["CCTV Surveillance", "Security Personnel", "Signage & Barricades"],

    "Dhauli Peace Pagoda":
        ["CCTV Surveillance", "Security Personnel", "First Aid Post", "Public Address System"],

    "Khandagiri & Udayagiri Caves":
        ["Security Personnel", "First Aid Post", "Guided Pathways"],

    "Ekamra Kanan Botanical Garden":
        ["CCTV Surveillance", "Security Patrol", "First Aid Post"],

    "Nandankanan Zoological Park":
        ["CCTV Surveillance", "Security Personnel", "First Aid Post", "Help Desk"],

    "ITER, SOA University":
        ["CCTV Surveillance", "Security Personnel", "First Aid Post", "Help Desk"]

};

function lookupPopularPlace(name) {

    return popularPlaces.find(
        place => place.name === name
    );

}

let zones = [

    {
        id: 0,
        name: "Lingaraj Temple",
        capacity: 100,
        people: 45,
        risk: 20,
        weatherRisk: 20,
        status: "SAFE",
        lat: 20.2372,
        lng: 85.8348,
        radius: 60,
        icon: "🛕",
        features: placeSafetyFeatures["Lingaraj Temple"]
    },

    {
        id: 1,
        name: "Rajarani Temple",
        capacity: 150,
        people: 120,
        risk: 55,
        weatherRisk: 20,
        status: "WARNING",
        lat: 20.2622,
        lng: 85.8419,
        radius: 70,
        icon: "🏯",
        features: placeSafetyFeatures["Rajarani Temple"]
    },

    {
        id: 2,
        name: "Dhauli Peace Pagoda",
        capacity: 100,
        people: 180,
        risk: 90,
        weatherRisk: 30,
        status: "DANGER",
        lat: 20.1897,
        lng: 85.8322,
        radius: 120,
        icon: "🕊️",
        features: placeSafetyFeatures["Dhauli Peace Pagoda"]
    },

    {
        id: 3,
        name: "Khandagiri & Udayagiri Caves",
        capacity: 200,
        people: 70,
        risk: 25,
        weatherRisk: 10,
        status: "SAFE",
        lat: 20.2632,
        lng: 85.7857,
        radius: 90,
        icon: "⛰️",
        features: placeSafetyFeatures["Khandagiri & Udayagiri Caves"]
    },

    {
        id: 4,
        name: "ITER, SOA University",
        capacity: 300,
        people: 210,
        risk: 30,
        weatherRisk: 15,
        status: "SAFE",
        lat: 20.2590,
        lng: 85.7918,
        radius: 100,
        icon: "🎓",
        features: placeSafetyFeatures["ITER, SOA University"]
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

let popularPlaces = [

    {
        name: "Lingaraj Temple",
        icon: "🛕",
        lat: 20.2372,
        lng: 85.8348,
        defaultCapacity: 100,
        features: placeSafetyFeatures["Lingaraj Temple"]
    },

    {
        name: "Khandagiri & Udayagiri Caves",
        icon: "⛰️",
        lat: 20.2632,
        lng: 85.7857,
        defaultCapacity: 200,
        features: placeSafetyFeatures["Khandagiri & Udayagiri Caves"]
    },

    {
        name: "Dhauli Peace Pagoda",
        icon: "🕊️",
        lat: 20.1897,
        lng: 85.8322,
        defaultCapacity: 100,
        features: placeSafetyFeatures["Dhauli Peace Pagoda"]
    },

    {
        name: "Rajarani Temple",
        icon: "🏯",
        lat: 20.2622,
        lng: 85.8419,
        defaultCapacity: 150,
        features: placeSafetyFeatures["Rajarani Temple"]
    },

    {
        name: "Ekamra Kanan Botanical Garden",
        icon: "🌳",
        lat: 20.2961,
        lng: 85.8245,
        defaultCapacity: 180,
        features: placeSafetyFeatures["Ekamra Kanan Botanical Garden"]
    },

    {
        name: "Nandankanan Zoological Park",
        icon: "🦁",
        lat: 20.3936,
        lng: 85.8189,
        defaultCapacity: 250,
        features: placeSafetyFeatures["Nandankanan Zoological Park"]
    },

    {
        name: "ITER, SOA University",
        icon: "🎓",
        lat: 20.2590,
        lng: 85.7918,
        defaultCapacity: 300,
        features: placeSafetyFeatures["ITER, SOA University"]
    }

];

let userLocation = null;

let incidentLocation = null;

let currentWeatherRisk = 20;

let currentWeatherText = "Clear sky";

let currentTemperatureC = null;

let currentTransportRisk = 10;

let currentLanguage = "en";

let cameraStream = null;

let detectionModel = null;

let detectionRunning = false;

let crowdHistory = [];
let crowdPeak = 0;
let lastCrowdSampleAt = 0;
let lastAnomalyKey = "";
let anomalyEvents = [];
let detectedIncident = null;
const CROWD_HISTORY_WINDOW_MS = 30000;
const ANOMALY_COOLDOWN_MS = 15000;

let geofenceWatchId = null;

let geofenceMonitoringActive = false;

let activeGeofenceZoneIds = new Set();

let geofenceEvents = [];

// --- Geofence accuracy / hysteresis / dwell-confirmation tuning ---
// Zone radii are as small as 60-120m, so a low-accuracy GPS fix can
// easily land "inside" a zone it isn't really in (or vice versa).
// These three settings work together to stop that from producing
// false or flapping ENTER/EXIT alerts during live monitoring:
//   - a fix worse than GEOFENCE_MAX_ACCURACY_METERS is ignored
//     entirely for that tick rather than trusted;
//   - once inside, you must cross a larger exit radius to leave
//     (hysteresis), so jitter right on the boundary doesn't flap;
//   - a brand-new ENTER needs this many consecutive fixes inside
//     before it's confirmed and an alert fires.
const GEOFENCE_MAX_ACCURACY_METERS = 100;
const GEOFENCE_EXIT_BUFFER_RATIO = 1.3;
const GEOFENCE_ENTER_CONFIRMATIONS_REQUIRED = 2;

// zoneId -> consecutive live fixes seen inside it, not yet confirmed.
let pendingGeofenceEnterCounts = new Map();

// zoneId -> zone.status as of the last time we alerted for it, so a
// risk-level change while the visitor is still standing inside the
// same zone can re-alert instead of staying silent until they leave.
let activeGeofenceZoneStatus = new Map();

// Accuracy (meters) of the most recent live geofence GPS fix, shown
// in the status panel so visitors know how much to trust it.
let lastGeofenceAccuracy = null;

let liveSafetyRefreshInterval = null;

let lastLiveSafetyFixAt = null;

const ADMIN_USERNAME = "admin";

const ADMIN_PASSWORD = "12345";

const ADVISORY_API_URL = "/api/advisories";

const ADVISORY_POLL_INTERVAL_MS = 15000;

const INCIDENT_API_URL = "/api/incidents";

const INCIDENT_POLL_INTERVAL_MS = 15000;

const SOS_API_URL = "/api/sos";

const SOS_POLL_INTERVAL_MS = 15000;

// India's unified emergency helpline (police / fire / ambulance).
const EMERGENCY_PHONE_NUMBER = "112";

let safetyAdvisories = [];

let lastPoppedAdvisoryId = null;

let sosAlerts = [];

let lastSeenSosId = null;

function getAdminApiKey() {

    return (
        sessionStorage.getItem(
            "safeYatriAdminApiKey"
        ) || ""
    );

}

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

        geofenceToggle:
            "Enable Live Geofence Alerts",

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
            "Safety Operations Dashboard",

        adminControlCenter:
            "CONTROL CENTER",

        adminMonitoringDesc:
            "Privacy-conscious monitoring and incident coordination",

        systemSafe:
            "SYSTEM SAFE",

        logout:
            "Logout",

        computerVision:
            "COMPUTER VISION",

        aiCrowdMonitoring:
            "AI Crowd Monitoring",

        aiCrowdMonitoringDesc:
            "Anonymous person detection. No face recognition or individual tracking.",

        cameraOffline:
            "Camera Offline",

        startCameraOverlayText:
            "Start camera to begin AI crowd detection",

        peopleDetectedLabel:
            "People Detected",

        aiModelLabel:
            "AI Model",

        aiModelNotLoaded:
            "Not Loaded",

        zoneLingarajTemple:
            "Lingaraj Temple",

        zoneRajaraniTemple:
            "Rajarani Temple",

        zoneDhauliPeacePagoda:
            "Dhauli Peace Pagoda",

        zoneKhandagiriCaves:
            "Khandagiri & Udayagiri Caves",

        startAiCameraBtn:
            "Start AI Camera",

        stopCameraBtn:
            "Stop Camera",

        privacyModeNote:
            "Privacy mode: Only anonymous people counts are retained.",

        liveSafetyIntelligence:
            "LIVE SAFETY INTELLIGENCE",

        liveCrowdAnomalyMonitoring:
            "Live Crowd & Anomaly Monitoring",

        liveCrowdAnomalyDesc:
            "The browser camera counts people anonymously and watches for sudden crowd changes, sustained overcrowding and unusual monitoring events.",

        liveCameraOffline:
            "CAMERA OFFLINE",

        anonymousCameraZoneEstimate:
            "Anonymous camera-zone estimate",

        statusNormal:
            "NORMAL",

        currentCountLabel:
            "Current Count",

        peakCountLabel:
            "Peak Count",

        changePer10sLabel:
            "Change / 10s",

        anomalyScoreLabel:
            "Anomaly Score",

        zoneOccupancyLabel:
            "Zone occupancy",

        startCameraBeginLiveMonitoring:
            "Start the AI camera to begin live monitoring.",

        unusualActivityLabel:
            "Unusual Activity",

        noAnomalyDetected:
            "No anomaly detected",

        monitoringWillAppear:
            "Monitoring will appear here when the camera is running.",

        unusualIncidentDetection:
            "Unusual Incident Detection",

        heuristicAlertsDesc:
            "Heuristic alerts are generated from anonymous person-count trends. They are indicators, not confirmed emergencies.",

        noIncidentFlagged:
            "No unusual incident currently flagged.",

        controlRoomLabel:
            "CONTROL ROOM",

        sendSafetyAdvisory:
            "Send Safety Advisory",

        sendAdvisoryDesc:
            "Sent advisories appear instantly on the visitor page for everyone browsing the site.",

        severityLow:
            "Low",

        severityMedium:
            "Medium",

        severityHigh:
            "High",

        severityCritical:
            "Critical",

        messageLabel:
            "Message",

        advisoryPlaceholder:
            "e.g. Lingaraj Temple zone is at full capacity — please use the East entrance.",

        sendAdvisoryBtn:
            "Send Advisory",

        noAdvisoriesYet:
            "No advisories sent yet.",

        mobilityLabel:
            "MOBILITY",

        amaBusLiveTransport:
            "AMA Bus Live Transport",

        amaBusDesc:
            "Live AMA Bus (CRUT) status and route occupancy for Bhubaneswar.",

        liveLabel:
            "LIVE",

        amaBusStatusLabel:
            "AMA Bus Status",

        checkingLiveFeed:
            "Checking live feed...",

        loadingRouteStatus:
            "Loading route status...",

        footfallEnvironment:
            "FOOTFALL & ENVIRONMENT",

        locationDetectionRiskPrediction:
            "Location Detection & Risk Prediction",

        locationDetectionDesc:
            "Detects the visitor's current location, names the nearest place they're in, pulls a live weather forecast for those exact coordinates, predicts crowd density based on typical time-of-day patterns, and combines both into a risk conclusion.",

        detectLocationAssessRiskBtn:
            "Detect Location & Assess Risk",

        noAssessmentYet:
            "No assessment yet — run a detection above.",

        boundaryAlertsLabel:
            "BOUNDARY ALERTS",

        geofenceActivity:
            "Geofence Activity",

        geofenceActivityDesc:
            "Live ENTER/EXIT events for the radius drawn around each zone (Detect My Location or Enable Live Geofence Alerts on the visitor side triggers these).",

        noGeofenceActivity:
            "No geofence activity yet — detect a location or enable live monitoring above.",

        incidentCenterLabel:
            "INCIDENT CENTER",

        activeIncidents:
            "Active Incidents",

        clearResolvedBtn:
            "Clear Resolved",

        environmentLabel:
            "ENVIRONMENT",

        weatherTransportLabel:
            "Weather & Transport",

        loadingText:
            "Loading...",

        normalStatus:
            "Normal",

        shuttleServicesOperational:
            "Shuttle services operational",

        connectivityLabel:
            "Connectivity",

        onlineStatus:
            "Online",

        offlineCacheEnabled:
            "Offline cache enabled",

        popularPlacesTitle:
            "Bhubaneswar Popular Places — Crowd Check",

        popularPlacesDesc:
            "Check current crowd levels at popular temples, gardens and sightseeing spots around Bhubaneswar before you head out.",

        checkPopularCrowds:
            "Check Crowd Levels",

        popularPlacesHint:
            "Tap the button above to see an estimated crowd level for each place."

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

        geofenceToggle:
            "लाइव जियोफेंस अलर्ट सक्षम करें",

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
            "BHU मौसम प्रसारित करें",

        adminControlCenter:
            "नियंत्रण केंद्र",

        adminMonitoringDesc:
            "गोपनीयता-सजग निगरानी और घटना समन्वय",

        systemSafe:
            "सिस्टम सुरक्षित",

        logout:
            "लॉगआउट",

        computerVision:
            "कंप्यूटर विज़न",

        aiCrowdMonitoring:
            "AI भीड़ निगरानी",

        aiCrowdMonitoringDesc:
            "गुमनाम व्यक्ति पहचान। कोई चेहरा पहचान या व्यक्तिगत ट्रैकिंग नहीं।",

        cameraOffline:
            "कैमरा ऑफ़लाइन",

        startCameraOverlayText:
            "AI भीड़ पहचान शुरू करने के लिए कैमरा चालू करें",

        peopleDetectedLabel:
            "पहचाने गए लोग",

        aiModelLabel:
            "AI मॉडल",

        aiModelNotLoaded:
            "लोड नहीं हुआ",

        zoneLingarajTemple:
            "Lingaraj Temple",

        zoneRajaraniTemple:
            "Rajarani Temple",

        zoneDhauliPeacePagoda:
            "Dhauli Peace Pagoda",

        zoneKhandagiriCaves:
            "Khandagiri & Udayagiri Caves",

        startAiCameraBtn:
            "AI कैमरा शुरू करें",

        stopCameraBtn:
            "कैमरा बंद करें",

        privacyModeNote:
            "गोपनीयता मोड: केवल गुमनाम लोगों की संख्या रखी जाती है।",

        liveSafetyIntelligence:
            "लाइव सुरक्षा इंटेलिजेंस",

        liveCrowdAnomalyMonitoring:
            "लाइव भीड़ और असामान्यता निगरानी",

        liveCrowdAnomalyDesc:
            "ब्राउज़र कैमरा गुमनाम रूप से लोगों की गिनती करता है और अचानक भीड़ परिवर्तन, लगातार भीड़भाड़ तथा असामान्य घटनाओं पर नज़र रखता है।",

        liveCameraOffline:
            "कैमरा ऑफ़लाइन",

        anonymousCameraZoneEstimate:
            "गुमनाम कैमरा-क्षेत्र अनुमान",

        statusNormal:
            "सामान्य",

        currentCountLabel:
            "वर्तमान गिनती",

        peakCountLabel:
            "अधिकतम गिनती",

        changePer10sLabel:
            "परिवर्तन / 10 सेकंड",

        anomalyScoreLabel:
            "असामान्यता स्कोर",

        zoneOccupancyLabel:
            "क्षेत्र अधिभोग",

        startCameraBeginLiveMonitoring:
            "लाइव निगरानी शुरू करने के लिए AI कैमरा चालू करें।",

        unusualActivityLabel:
            "असामान्य गतिविधि",

        noAnomalyDetected:
            "कोई असामान्यता नहीं मिली",

        monitoringWillAppear:
            "कैमरा चालू होने पर निगरानी यहाँ दिखाई देगी।",

        unusualIncidentDetection:
            "असामान्य घटना पहचान",

        heuristicAlertsDesc:
            "ये अलर्ट गुमनाम व्यक्ति-गणना रुझानों से उत्पन्न होते हैं। ये संकेतक हैं, पुष्टि की गई आपात स्थिति नहीं।",

        noIncidentFlagged:
            "फ़िलहाल कोई असामान्य घटना चिह्नित नहीं है।",

        controlRoomLabel:
            "नियंत्रण कक्ष",

        sendSafetyAdvisory:
            "सुरक्षा सलाह भेजें",

        sendAdvisoryDesc:
            "भेजी गई सलाह साइट ब्राउज़ कर रहे सभी लोगों के विज़िटर पेज पर तुरंत दिखाई देती है।",

        severityLow:
            "कम",

        severityMedium:
            "मध्यम",

        severityHigh:
            "उच्च",

        severityCritical:
            "गंभीर",

        messageLabel:
            "संदेश",

        advisoryPlaceholder:
            "उदा. Lingaraj Temple क्षेत्र पूर्ण क्षमता पर है — कृपया पूर्वी प्रवेश द्वार का उपयोग करें।",

        sendAdvisoryBtn:
            "सलाह भेजें",

        noAdvisoriesYet:
            "अभी तक कोई सलाह नहीं भेजी गई।",

        mobilityLabel:
            "गतिशीलता",

        amaBusLiveTransport:
            "AMA बस लाइव परिवहन",

        amaBusDesc:
            "भुवनेश्वर के लिए लाइव AMA बस (CRUT) स्थिति और मार्ग अधिभोग।",

        liveLabel:
            "लाइव",

        amaBusStatusLabel:
            "AMA बस स्थिति",

        checkingLiveFeed:
            "लाइव फ़ीड जाँची जा रही है...",

        loadingRouteStatus:
            "मार्ग स्थिति लोड हो रही है...",

        footfallEnvironment:
            "फुटफॉल और वातावरण",

        locationDetectionRiskPrediction:
            "स्थान पहचान और जोखिम पूर्वानुमान",

        locationDetectionDesc:
            "विज़िटर के वर्तमान स्थान का पता लगाता है, वे जिस निकटतम स्थान पर हैं उसका नाम बताता है, उन्हीं निर्देशांकों के लिए लाइव मौसम पूर्वानुमान लाता है, सामान्य समय-आधारित पैटर्न पर आधारित भीड़ घनत्व का अनुमान लगाता है, और दोनों को मिलाकर एक जोखिम निष्कर्ष देता है।",

        detectLocationAssessRiskBtn:
            "स्थान पहचानें और जोखिम आँकें",

        noAssessmentYet:
            "अभी तक कोई आकलन नहीं — ऊपर पहचान चलाएँ।",

        boundaryAlertsLabel:
            "सीमा अलर्ट",

        geofenceActivity:
            "जियोफेंस गतिविधि",

        geofenceActivityDesc:
            "प्रत्येक क्षेत्र के चारों ओर खींची गई परिधि के लिए लाइव ENTER/EXIT घटनाएँ (विज़िटर साइड पर मेरा स्थान पता करें या लाइव जियोफेंस अलर्ट सक्षम करें से ये ट्रिगर होती हैं)।",

        noGeofenceActivity:
            "अभी तक कोई जियोफेंस गतिविधि नहीं — स्थान पता करें या ऊपर लाइव निगरानी सक्षम करें।",

        incidentCenterLabel:
            "घटना केंद्र",

        activeIncidents:
            "सक्रिय घटनाएँ",

        clearResolvedBtn:
            "हल की गई साफ़ करें",

        environmentLabel:
            "वातावरण",

        weatherTransportLabel:
            "मौसम और परिवहन",

        loadingText:
            "लोड हो रहा है...",

        normalStatus:
            "सामान्य",

        shuttleServicesOperational:
            "शटल सेवाएँ चालू हैं",

        connectivityLabel:
            "कनेक्टिविटी",

        onlineStatus:
            "ऑनलाइन",

        offlineCacheEnabled:
            "ऑफ़लाइन कैश सक्षम है",

        popularPlacesTitle:
            "भुवनेश्वर लोकप्रिय स्थान — भीड़ जांच",

        popularPlacesDesc:
            "निकलने से पहले भुवनेश्वर के लोकप्रिय मंदिरों, बगीचों और दर्शनीय स्थलों पर मौजूदा भीड़ स्तर जांचें।",

        checkPopularCrowds:
            "भीड़ स्तर जांचें",

        popularPlacesHint:
            "प्रत्येक स्थान के लिए अनुमानित भीड़ स्तर देखने के लिए ऊपर दिए गए बटन को दबाएं।"

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

        geofenceToggle:
            "লাইভ জিওফেন্স সতর্কতা চালু করুন",

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
            "BHU আবহাওয়া প্রচার করুন",

        adminControlCenter:
            "নিয়ন্ত্রণ কেন্দ্র",

        adminMonitoringDesc:
            "গোপনীয়তা-সচেতন পর্যবেক্ষণ এবং ঘটনা সমন্বয়",

        systemSafe:
            "সিস্টেম নিরাপদ",

        logout:
            "লগআউট",

        computerVision:
            "কম্পিউটার ভিশন",

        aiCrowdMonitoring:
            "AI ভিড় পর্যবেক্ষণ",

        aiCrowdMonitoringDesc:
            "বেনামী ব্যক্তি শনাক্তকরণ। কোনো মুখ শনাক্তকরণ বা ব্যক্তিগত ট্র্যাকিং নেই।",

        cameraOffline:
            "ক্যামেরা অফলাইন",

        startCameraOverlayText:
            "AI ভিড় শনাক্তকরণ শুরু করতে ক্যামেরা চালু করুন",

        peopleDetectedLabel:
            "শনাক্ত হওয়া মানুষ",

        aiModelLabel:
            "AI মডেল",

        aiModelNotLoaded:
            "লোড হয়নি",

        zoneLingarajTemple:
            "Lingaraj Temple",

        zoneRajaraniTemple:
            "Rajarani Temple",

        zoneDhauliPeacePagoda:
            "Dhauli Peace Pagoda",

        zoneKhandagiriCaves:
            "Khandagiri & Udayagiri Caves",

        startAiCameraBtn:
            "AI ক্যামেরা শুরু করুন",

        stopCameraBtn:
            "ক্যামেরা বন্ধ করুন",

        privacyModeNote:
            "গোপনীয়তা মোড: শুধুমাত্র বেনামী মানুষের সংখ্যা সংরক্ষিত হয়।",

        liveSafetyIntelligence:
            "লাইভ নিরাপত্তা ইন্টেলিজেন্স",

        liveCrowdAnomalyMonitoring:
            "লাইভ ভিড় ও অস্বাভাবিকতা পর্যবেক্ষণ",

        liveCrowdAnomalyDesc:
            "ব্রাউজার ক্যামেরা বেনামীভাবে মানুষ গণনা করে এবং হঠাৎ ভিড় পরিবর্তন, ক্রমাগত অতিরিক্ত ভিড় ও অস্বাভাবিক ঘটনার উপর নজর রাখে।",

        liveCameraOffline:
            "ক্যামেরা অফলাইন",

        anonymousCameraZoneEstimate:
            "বেনামী ক্যামেরা-অঞ্চল অনুমান",

        statusNormal:
            "স্বাভাবিক",

        currentCountLabel:
            "বর্তমান সংখ্যা",

        peakCountLabel:
            "সর্বোচ্চ সংখ্যা",

        changePer10sLabel:
            "পরিবর্তন / ১০ সেকেন্ড",

        anomalyScoreLabel:
            "অস্বাভাবিকতার স্কোর",

        zoneOccupancyLabel:
            "অঞ্চলের দখল",

        startCameraBeginLiveMonitoring:
            "লাইভ পর্যবেক্ষণ শুরু করতে AI ক্যামেরা চালু করুন।",

        unusualActivityLabel:
            "অস্বাভাবিক কার্যকলাপ",

        noAnomalyDetected:
            "কোনো অস্বাভাবিকতা পাওয়া যায়নি",

        monitoringWillAppear:
            "ক্যামেরা চালু থাকলে পর্যবেক্ষণ এখানে দেখা যাবে।",

        unusualIncidentDetection:
            "অস্বাভাবিক ঘটনা শনাক্তকরণ",

        heuristicAlertsDesc:
            "এই সতর্কতাগুলি বেনামী ব্যক্তি-গণনার প্রবণতা থেকে তৈরি হয়। এগুলি নির্দেশক, নিশ্চিত জরুরি অবস্থা নয়।",

        noIncidentFlagged:
            "বর্তমানে কোনো অস্বাভাবিক ঘটনা চিহ্নিত নেই।",

        controlRoomLabel:
            "নিয়ন্ত্রণ কক্ষ",

        sendSafetyAdvisory:
            "নিরাপত্তা পরামর্শ পাঠান",

        sendAdvisoryDesc:
            "পাঠানো পরামর্শ সঙ্গে সঙ্গে সাইট ব্রাউজ করা সকলের দর্শনার্থী পেজে দেখা যায়।",

        severityLow:
            "নিম্ন",

        severityMedium:
            "মাঝারি",

        severityHigh:
            "উচ্চ",

        severityCritical:
            "সংকটজনক",

        messageLabel:
            "বার্তা",

        advisoryPlaceholder:
            "যেমন: Lingaraj Temple অঞ্চল পূর্ণ ধারণক্ষমতায় আছে — অনুগ্রহ করে পূর্ব প্রবেশপথ ব্যবহার করুন।",

        sendAdvisoryBtn:
            "পরামর্শ পাঠান",

        noAdvisoriesYet:
            "এখনও কোনো পরামর্শ পাঠানো হয়নি।",

        mobilityLabel:
            "চলাচল",

        amaBusLiveTransport:
            "AMA বাস লাইভ পরিবহন",

        amaBusDesc:
            "ভুবনেশ্বরের জন্য লাইভ AMA বাস (CRUT) অবস্থা এবং রুট দখল।",

        liveLabel:
            "লাইভ",

        amaBusStatusLabel:
            "AMA বাসের অবস্থা",

        checkingLiveFeed:
            "লাইভ ফিড পরীক্ষা করা হচ্ছে...",

        loadingRouteStatus:
            "রুটের অবস্থা লোড হচ্ছে...",

        footfallEnvironment:
            "পদচারণা ও পরিবেশ",

        locationDetectionRiskPrediction:
            "অবস্থান শনাক্তকরণ ও ঝুঁকি পূর্বাভাস",

        locationDetectionDesc:
            "দর্শনার্থীর বর্তমান অবস্থান শনাক্ত করে, তারা যে নিকটতম স্থানে আছেন তার নাম জানায়, ঠিক সেই স্থানাঙ্কের জন্য লাইভ আবহাওয়ার পূর্বাভাস আনে, সাধারণ সময়-ভিত্তিক প্যাটার্নের উপর ভিত্তি করে ভিড়ের ঘনত্ব অনুমান করে এবং দুটোকে একত্র করে একটি ঝুঁকি সিদ্ধান্তে পৌঁছায়।",

        detectLocationAssessRiskBtn:
            "অবস্থান শনাক্ত করুন ও ঝুঁকি মূল্যায়ন করুন",

        noAssessmentYet:
            "এখনও কোনো মূল্যায়ন নেই — উপরে একটি শনাক্তকরণ চালান।",

        boundaryAlertsLabel:
            "সীমানা সতর্কতা",

        geofenceActivity:
            "জিওফেন্স কার্যকলাপ",

        geofenceActivityDesc:
            "প্রতিটি অঞ্চলের চারপাশে আঁকা পরিধির জন্য লাইভ ENTER/EXIT ঘটনা (দর্শনার্থী পাশে আমার অবস্থান শনাক্ত করুন বা লাইভ জিওফেন্স সতর্কতা চালু করুন এগুলি ট্রিগার করে)।",

        noGeofenceActivity:
            "এখনও কোনো জিওফেন্স কার্যকলাপ নেই — একটি অবস্থান শনাক্ত করুন বা উপরে লাইভ পর্যবেক্ষণ চালু করুন।",

        incidentCenterLabel:
            "ঘটনা কেন্দ্র",

        activeIncidents:
            "সক্রিয় ঘটনা",

        clearResolvedBtn:
            "সমাধান হওয়া মুছুন",

        environmentLabel:
            "পরিবেশ",

        weatherTransportLabel:
            "আবহাওয়া ও পরিবহন",

        loadingText:
            "লোড হচ্ছে...",

        normalStatus:
            "স্বাভাবিক",

        shuttleServicesOperational:
            "শাটল পরিষেবা চালু আছে",

        connectivityLabel:
            "সংযোগ",

        onlineStatus:
            "অনলাইন",

        offlineCacheEnabled:
            "অফলাইন ক্যাশ সক্ষম",

        popularPlacesTitle:
            "ভুবনেশ্বর জনপ্রিয় স্থান — ভিড় পরীক্ষা",

        popularPlacesDesc:
            "বেরোনোর আগে ভুবনেশ্বরের জনপ্রিয় মন্দির, বাগান ও দর্শনীয় স্থানের বর্তমান ভিড়ের মাত্রা যাচাই করুন।",

        checkPopularCrowds:
            "ভিড়ের মাত্রা যাচাই করুন",

        popularPlacesHint:
            "প্রতিটি স্থানের আনুমানিক ভিড়ের মাত্রা দেখতে উপরের বোতামটি চাপুন।"

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

        geofenceToggle:
            "நேரடி புவி வேலி எச்சரிக்கைகளை இயக்கு",

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
            "BHU வானிலையை ஒளிபரப்பவும்",

        adminControlCenter:
            "கட்டுப்பாட்டு மையம்",

        adminMonitoringDesc:
            "தனியுரிமை-கவனமான கண்காணிப்பு மற்றும் சம்பவ ஒருங்கிணைப்பு",

        systemSafe:
            "அமைப்பு பாதுகாப்பானது",

        logout:
            "வெளியேறு",

        computerVision:
            "கணினி பார்வை",

        aiCrowdMonitoring:
            "AI கூட்ட கண்காணிப்பு",

        aiCrowdMonitoringDesc:
            "அநாமதேய நபர் கண்டறிதல். முக அடையாளம் அல்லது தனிநபர் கண்காணிப்பு இல்லை.",

        cameraOffline:
            "கேமரா ஆஃப்லைன்",

        startCameraOverlayText:
            "AI கூட்ட கண்டறிதலைத் தொடங்க கேமராவைத் தொடங்குங்கள்",

        peopleDetectedLabel:
            "கண்டறியப்பட்ட நபர்கள்",

        aiModelLabel:
            "AI மாதிரி",

        aiModelNotLoaded:
            "ஏற்றப்படவில்லை",

        zoneLingarajTemple:
            "Lingaraj Temple",

        zoneRajaraniTemple:
            "Rajarani Temple",

        zoneDhauliPeacePagoda:
            "Dhauli Peace Pagoda",

        zoneKhandagiriCaves:
            "Khandagiri & Udayagiri Caves",

        startAiCameraBtn:
            "AI கேமராவைத் தொடங்கு",

        stopCameraBtn:
            "கேமராவை நிறுத்து",

        privacyModeNote:
            "தனியுரிமை பயன்முறை: அநாமதேய நபர் எண்ணிக்கை மட்டுமே வைக்கப்படும்.",

        liveSafetyIntelligence:
            "நேரடி பாதுகாப்பு நுண்ணறிவு",

        liveCrowdAnomalyMonitoring:
            "நேரடி கூட்டம் & முரண்பாடு கண்காணிப்பு",

        liveCrowdAnomalyDesc:
            "உலாவி கேமரா நபர்களை அநாமதேயமாக எண்ணி, திடீர் கூட்ட மாற்றங்கள், தொடர்ச்சியான நெரிசல் மற்றும் அசாதாரண நிகழ்வுகளைக் கண்காணிக்கிறது.",

        liveCameraOffline:
            "கேமரா ஆஃப்லைன்",

        anonymousCameraZoneEstimate:
            "அநாமதேய கேமரா-மண்டல மதிப்பீடு",

        statusNormal:
            "இயல்பானது",

        currentCountLabel:
            "தற்போதைய எண்ணிக்கை",

        peakCountLabel:
            "உச்ச எண்ணிக்கை",

        changePer10sLabel:
            "மாற்றம் / 10 வி",

        anomalyScoreLabel:
            "முரண்பாடு மதிப்பெண்",

        zoneOccupancyLabel:
            "மண்டல ஆக்கிரமிப்பு",

        startCameraBeginLiveMonitoring:
            "நேரடி கண்காணிப்பைத் தொடங்க AI கேமராவைத் தொடங்குங்கள்.",

        unusualActivityLabel:
            "அசாதாரண செயல்பாடு",

        noAnomalyDetected:
            "முரண்பாடு எதுவும் கண்டறியப்படவில்லை",

        monitoringWillAppear:
            "கேமரா இயங்கும்போது கண்காணிப்பு இங்கே தோன்றும்.",

        unusualIncidentDetection:
            "அசாதாரண சம்பவ கண்டறிதல்",

        heuristicAlertsDesc:
            "இந்த எச்சரிக்கைகள் அநாமதேய நபர்-எண்ணிக்கை போக்குகளிலிருந்து உருவாக்கப்படுகின்றன. இவை குறிகாட்டிகளே, உறுதிசெய்யப்பட்ட அவசரநிலைகள் அல்ல.",

        noIncidentFlagged:
            "தற்போது அசாதாரண சம்பவம் எதுவும் குறிக்கப்படவில்லை.",

        controlRoomLabel:
            "கட்டுப்பாட்டு அறை",

        sendSafetyAdvisory:
            "பாதுகாப்பு அறிவுரையை அனுப்பு",

        sendAdvisoryDesc:
            "அனுப்பப்பட்ட அறிவுரைகள் தளத்தை உலாவும் அனைவருக்கும் பார்வையாளர் பக்கத்தில் உடனடியாகத் தோன்றும்.",

        severityLow:
            "குறைவு",

        severityMedium:
            "நடுத்தரம்",

        severityHigh:
            "அதிகம்",

        severityCritical:
            "மிக அவசரம்",

        messageLabel:
            "செய்தி",

        advisoryPlaceholder:
            "எ.கா. Lingaraj Temple மண்டலம் முழு கொள்ளளவில் உள்ளது — தயவுசெய்து கிழக்கு நுழைவாயிலைப் பயன்படுத்தவும்.",

        sendAdvisoryBtn:
            "அறிவுரையை அனுப்பு",

        noAdvisoriesYet:
            "இதுவரை அறிவுரைகள் எதுவும் அனுப்பப்படவில்லை.",

        mobilityLabel:
            "நடமாட்டம்",

        amaBusLiveTransport:
            "AMA பேருந்து நேரடி போக்குவரத்து",

        amaBusDesc:
            "புவனேஸ்வருக்கான நேரடி AMA பேருந்து (CRUT) நிலை மற்றும் வழித்தட ஆக்கிரமிப்பு.",

        liveLabel:
            "நேரடி",

        amaBusStatusLabel:
            "AMA பேருந்து நிலை",

        checkingLiveFeed:
            "நேரடி ஊட்டம் சரிபார்க்கப்படுகிறது...",

        loadingRouteStatus:
            "வழித்தட நிலை ஏற்றப்படுகிறது...",

        footfallEnvironment:
            "வருகை & சூழல்",

        locationDetectionRiskPrediction:
            "இட கண்டறிதல் & ஆபத்து முன்னறிவிப்பு",

        locationDetectionDesc:
            "பார்வையாளரின் தற்போதைய இருப்பிடத்தைக் கண்டறிந்து, அவர்கள் இருக்கும் அருகிலுள்ள இடத்தின் பெயரைத் தெரிவித்து, அதே ஆயத்தொலைவுகளுக்கான நேரடி வானிலை முன்னறிவிப்பைப் பெற்று, வழக்கமான நேர அடிப்படையிலான வடிவங்களின் அடிப்படையில் கூட்ட அடர்த்தியை முன்னறிவித்து, இரண்டையும் இணைத்து ஒரு ஆபத்து முடிவை அளிக்கிறது.",

        detectLocationAssessRiskBtn:
            "இடத்தைக் கண்டறிந்து ஆபத்தை மதிப்பிடு",

        noAssessmentYet:
            "இதுவரை மதிப்பீடு இல்லை — மேலே ஒரு கண்டறிதலை இயக்கவும்.",

        boundaryAlertsLabel:
            "எல்லை எச்சரிக்கைகள்",

        geofenceActivity:
            "புவி வேலி செயல்பாடு",

        geofenceActivityDesc:
            "ஒவ்வொரு மண்டலத்தையும் சுற்றி வரையப்பட்ட ஆரத்திற்கான நேரடி ENTER/EXIT நிகழ்வுகள் (பார்வையாளர் பக்கத்தில் என் இருப்பிடத்தைக் கண்டறியவும் அல்லது நேரடி புவி வேலி எச்சரிக்கைகளை இயக்கு இவற்றைத் தூண்டும்).",

        noGeofenceActivity:
            "இதுவரை புவி வேலி செயல்பாடு இல்லை — ஓர் இடத்தைக் கண்டறியவும் அல்லது மேலே நேரடி கண்காணிப்பை இயக்கவும்.",

        incidentCenterLabel:
            "சம்பவ மையம்",

        activeIncidents:
            "செயலில் உள்ள சம்பவங்கள்",

        clearResolvedBtn:
            "தீர்க்கப்பட்டவற்றை அழி",

        environmentLabel:
            "சூழல்",

        weatherTransportLabel:
            "வானிலை & போக்குவரத்து",

        loadingText:
            "ஏற்றப்படுகிறது...",

        normalStatus:
            "இயல்பானது",

        shuttleServicesOperational:
            "ஷட்டில் சேவைகள் இயங்குகின்றன",

        connectivityLabel:
            "இணைப்பு",

        onlineStatus:
            "ஆன்லைன்",

        offlineCacheEnabled:
            "ஆஃப்லைன் தேக்ககம் இயக்கப்பட்டுள்ளது",

        popularPlacesTitle:
            "புவனேஸ்வர் பிரபல இடங்கள் — கூட்ட சரிபார்ப்பு",

        popularPlacesDesc:
            "நீங்கள் புறப்படுவதற்கு முன், புவனேஸ்வரைச் சுற்றியுள்ள பிரபலமான கோவில்கள், தோட்டங்கள் மற்றும் சுற்றுலா இடங்களில் தற்போதைய கூட்ட அளவைச் சரிபார்க்கவும்.",

        checkPopularCrowds:
            "கூட்ட அளவைச் சரிபார்க்கவும்",

        popularPlacesHint:
            "ஒவ்வொரு இடத்திற்குமான மதிப்பிடப்பட்ட கூட்ட அளவைக் காண மேலே உள்ள பொத்தானை அழுத்தவும்."

    },

    or: {

        appName: "Safe Yatri AI",

        visitor: "ଦର୍ଶନାର୍ଥୀ",

        admin: "ଆଡମିନ ଡ୍ୟାସବୋର୍ଡ",

        heroTitle:
            "ଅଧିକ ସୁରକ୍ଷିତ ତୀର୍ଥଯାତ୍ରା। ଅଧିକ ସ୍ମାର୍ଟ ଭିଡ଼ି ପରିଚାଳନା।",

        heroText:
            "Safe Yatri AI ଭୁବନେଶ୍ୱରରେ ତୀର୍ଥଯାତ୍ରୀ ଓ ଦର୍ଶନାର୍ଥୀଙ୍କୁ ରିଅଲ-ଟାଇମ ଭିଡ଼ି ନିରୀକ୍ଷଣ, ତୁରନ୍ତ ପାଣିପାଗ ପ୍ରସାରଣ, ନିକଟସ୍ଥ ସୁବିଧା ସ୍ଥାନ, ଦ୍ରୁତ ଘଟଣା ରିପୋର୍ଟିଂ ଏବଂ ଜରୁରୀକାଳୀନ ପ୍ରତିକ୍ରିୟା ମାଧ୍ୟମରେ ସୁରକ୍ଷିତ ରଖେ — କମ ସଂଯୋଗ ଥିବା ଅଞ୍ଚଳରେ ମଧ୍ୟ।",

        checkSafety:
            "ମୋର ସୁରକ୍ଷା ଯାଞ୍ଚ କରନ୍ତୁ",

        currentSafety:
            "ବର୍ତ୍ତମାନର ସୁରକ୍ଷା ସ୍ଥିତି",

        overallRisk:
            "ସାମଗ୍ରିକ ବିପଦ",

        crowdLevel:
            "ଭିଡ଼ି ସ୍ତର",

        weather:
            "ପାଣିପାଗ (ଭୁବନେଶ୍ୱର)",

        transport:
            "ପରିବହନ",

        siteZones:
            "ସାଇଟ ସୁରକ୍ଷା ମଣ୍ଡଳ",

        yourLocation:
            "ଆପଣଙ୍କର ସ୍ଥାନ",

        detectLocation:
            "ମୋର ସ୍ଥାନ ଚିହ୍ନଟ କରନ୍ତୁ",

        geofenceToggle:
            "ଲାଇଭ ଜିଓଫେନ୍ସ ଆଲର୍ଟ ସକ୍ଷମ କରନ୍ତୁ",

        reportIncident:
            "ଏକ ଘଟଣା ରିପୋର୍ଟ କରନ୍ତୁ",

        incidentZone:
            "ସ୍ଥାନ / ମଣ୍ଡଳ",

        incidentType:
            "ଘଟଣା ପ୍ରକାର",

        severity:
            "ଗୁରୁତ୍ୱ",

        description:
            "ବର୍ଣ୍ଣନା",

        submitIncident:
            "ଘଟଣା ଦାଖଲ କରନ୍ତୁ",

        emergency:
            "ଜରୁରୀକାଳୀନ ସାହାଯ୍ୟ",

        safeRoute:
            "ସୁରକ୍ଷିତ ମାର୍ଗ ଖୋଜନ୍ତୁ",

        escapeRoute:
            "ନିକଟତମ ପଳାୟନ ମାର୍ଗ ଖୋଜନ୍ତୁ",

        escapeMapTitle:
            "ଭୁବନେଶ୍ୱର ସହର — ପଳାୟନ ମାର୍ଗ ମାନଚିତ୍ର",

        locateOnMap:
            "ମୋର ସ୍ଥାନ ଚିହ୍ନଟ କରନ୍ତୁ",

        incidentLocationLabel:
            "ଆପଣଙ୍କର ସ୍ଥାନ ସଂଲଗ୍ନ କରନ୍ତୁ",

        attachLocation:
            "ମୋର ବର୍ତ୍ତମାନ ସ୍ଥାନ ବ୍ୟବହାର କରନ୍ତୁ",

        adminDashboard:
            "ସୁରକ୍ଷା ପରିଚାଳନା ଡ୍ୟାସବୋର୍ଡ",

        nearbyFacilities:
            "ନିକଟସ୍ଥ ସୁବିଧା",

        facilitiesHint:
            "ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା, ଶୌଚାଳୟ ଏବଂ ମେଡିକାଲ କ୍ୟାମ୍ପ ଦେଖିବାକୁ ଉପରେ ଆପଣଙ୍କର ସ୍ଥାନ ଚିହ୍ନଟ କରନ୍ତୁ।",

        broadcastWeather:
            "ଭୁବନେଶ୍ୱର ପାଣିପାଗ ପ୍ରସାରଣ କରନ୍ତୁ",

        adminControlCenter:
            "ନିୟନ୍ତ୍ରଣ କେନ୍ଦ୍ର",

        adminMonitoringDesc:
            "ଗୋପନୀୟତା-ସଚେତନ ନିରୀକ୍ଷଣ ଏବଂ ଘଟଣା ସମନ୍ୱୟ",

        systemSafe:
            "ସିଷ୍ଟମ ସୁରକ୍ଷିତ",

        logout:
            "ଲଗଆଉଟ",

        computerVision:
            "କମ୍ପ୍ୟୁଟର ଭିଜନ",

        aiCrowdMonitoring:
            "AI ଭିଡ଼ି ନିରୀକ୍ଷଣ",

        aiCrowdMonitoringDesc:
            "ଅଜ୍ଞାତ ବ୍ୟକ୍ତି ଗଣନା। କୌଣସି ମୁହଁ ଚିହ୍ନଟ କିମ୍ବା ବ୍ୟକ୍ତିଗତ ଟ୍ରାକିଂ ନାହିଁ।",

        cameraOffline:
            "କେମେରା ଅଫଲାଇନ",

        startCameraOverlayText:
            "AI ଭିଡ଼ି ଚିହ୍ନଟ ଆରମ୍ଭ କରିବାକୁ କେମେରା ଆରମ୍ଭ କରନ୍ତୁ",

        peopleDetectedLabel:
            "ଚିହ୍ନଟ ହୋଇଥିବା ଲୋକ",

        aiModelLabel:
            "AI ମଡେଲ",

        aiModelNotLoaded:
            "ଲୋଡ ହୋଇନାହିଁ",

        zoneLingarajTemple:
            "Lingaraj Temple",

        zoneRajaraniTemple:
            "Rajarani Temple",

        zoneDhauliPeacePagoda:
            "Dhauli Peace Pagoda",

        zoneKhandagiriCaves:
            "Khandagiri & Udayagiri Caves",

        startAiCameraBtn:
            "AI କେମେରା ଆରମ୍ଭ କରନ୍ତୁ",

        stopCameraBtn:
            "କେମେରା ବନ୍ଦ କରନ୍ତୁ",

        privacyModeNote:
            "ଗୋପନୀୟତା ମୋଡ୍: କେବଳ ଅଜ୍ଞାତ ବ୍ୟକ୍ତି ସଂଖ୍ୟା ରଖାଯିବ।",

        liveSafetyIntelligence:
            "ଲାଇଭ ସୁରକ୍ଷା ବୁଦ୍ଧିମତା",

        liveCrowdAnomalyMonitoring:
            "ଲାଇଭ ଭିଡ଼ି ଏବଂ ଅସଙ୍ଗତି ନିରୀକ୍ଷଣ",

        liveCrowdAnomalyDesc:
            "ବ୍ରାଉଜର କେମେରା ଅଜ୍ଞାତ ଭାବରେ ଲୋକଙ୍କୁ ଗଣନା କରି ହଠାତ ଭିଡ଼ି ପରିବର୍ତ୍ତନ, କ୍ରମାଗତ ଭିଡ଼ ଏବଂ ଅସାଧାରଣ ଘଟଣା ନିରୀକ୍ଷଣ କରେ।",

        liveCameraOffline:
            "କେମେରା ଅଫଲାଇନ",

        anonymousCameraZoneEstimate:
            "ଅଜ୍ଞାତ କେମେରା-ମଣ୍ଡଳ ଆକଳନ",

        statusNormal:
            "ସାଧାରଣ",

        currentCountLabel:
            "ବର୍ତ୍ତମାନ ସଂଖ୍ୟା",

        peakCountLabel:
            "ସର୍ବୋଚ୍ଚ ସଂଖ୍ୟା",

        changePer10sLabel:
            "ପରିବର୍ତ୍ତନ / ୧୦ ସେକେଣ୍ଡ",

        anomalyScoreLabel:
            "ଅସଙ୍ଗତି ସ୍କୋର",

        zoneOccupancyLabel:
            "ମଣ୍ଡଳ ଅଧିକାର",

        startCameraBeginLiveMonitoring:
            "ଲାଇଭ ନିରୀକ୍ଷଣ ଆରମ୍ଭ କରିବାକୁ AI କେମେରା ଆରମ୍ଭ କରନ୍ତୁ।",

        unusualActivityLabel:
            "ଅସାଧାରଣ କାର୍ଯ୍ୟକଳାପ",

        noAnomalyDetected:
            "କୌଣସି ଅସଙ୍ଗତି ଚିହ୍ନଟ ହୋଇନାହିଁ",

        monitoringWillAppear:
            "କେମେରା ଚାଲିଲେ ନିରୀକ୍ଷଣ ଏଠାରେ ଦେଖାଯିବ।",

        unusualIncidentDetection:
            "ଅସାଧାରଣ ଘଟଣା ଚିହ୍ନଟ",

        heuristicAlertsDesc:
            "ଏହି ଆଲର୍ଟଗୁଡ଼ିକ ଅଜ୍ଞାତ ବ୍ୟକ୍ତି-ସଂଖ୍ୟା ପ୍ରବୃତ୍ତିରୁ ସୃଷ୍ଟି ହୁଏ। ଏଗୁଡ଼ିକ ସୂଚକ ମାତ୍ର, ନିଶ୍ଚିତ ଜରୁରୀକାଳୀନ ଅବସ୍ଥା ନୁହେଁ।",

        noIncidentFlagged:
            "ବର୍ତ୍ତମାନ କୌଣସି ଅସାଧାରଣ ଘଟଣା ଚିହ୍ନିତ ହୋଇନାହିଁ।",

        controlRoomLabel:
            "କଣ୍ଟ୍ରୋଲ ରୁମ",

        sendSafetyAdvisory:
            "ସୁରକ୍ଷା ପରାମର୍ଶ ପଠାନ୍ତୁ",

        sendAdvisoryDesc:
            "ପଠାଯାଇଥିବା ପରାମର୍ଶ ସାଇଟ ବ୍ରାଉଜ କରୁଥିବା ସମସ୍ତଙ୍କ ପାଇଁ ଦର୍ଶନାର୍ଥୀ ପୃଷ୍ଠାରେ ତୁରନ୍ତ ଦେଖାଯିବ।",

        severityLow:
            "କମ",

        severityMedium:
            "ମଧ୍ୟମ",

        severityHigh:
            "ଅଧିକ",

        severityCritical:
            "ଅତି ଜରୁରୀ",

        messageLabel:
            "ସନ୍ଦେଶ",

        advisoryPlaceholder:
            "ଉଦା. Lingaraj Temple ମଣ୍ଡଳ ପୂର୍ଣ୍ଣ କ୍ଷମତାରେ ଅଛି — ଦୟାକରି ପୂର୍ବ ପ୍ରବେଶ ଦ୍ୱାର ବ୍ୟବହାର କରନ୍ତୁ।",

        sendAdvisoryBtn:
            "ପରାମର୍ଶ ପଠାନ୍ତୁ",

        noAdvisoriesYet:
            "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ପରାମର୍ଶ ପଠାଯାଇନାହିଁ।",

        mobilityLabel:
            "ଗତିଶୀଳତା",

        amaBusLiveTransport:
            "AMA ବସ ଲାଇଭ ପରିବହନ",

        amaBusDesc:
            "ଭୁବନେଶ୍ୱର ପାଇଁ ଲାଇଭ AMA ବସ (CRUT) ସ୍ଥିତି ଏବଂ ମାର୍ଗ ଅଧିକାର।",

        liveLabel:
            "ଲାଇଭ",

        amaBusStatusLabel:
            "AMA ବସ ସ୍ଥିତି",

        checkingLiveFeed:
            "ଲାଇଭ ଫିଡ ଯାଞ୍ଚ ହେଉଛି...",

        loadingRouteStatus:
            "ମାର୍ଗ ସ୍ଥିତି ଲୋଡ ହେଉଛି...",

        footfallEnvironment:
            "ପାଦଚାରଣ ଏବଂ ପରିବେଶ",

        locationDetectionRiskPrediction:
            "ସ୍ଥାନ ଚିହ୍ନଟ ଏବଂ ବିପଦ ପୂର୍ବାନୁମାନ",

        locationDetectionDesc:
            "ଦର୍ଶନାର୍ଥୀଙ୍କର ବର୍ତ୍ତମାନ ସ୍ଥାନ ଚିହ୍ନଟ କରି, ସେ ଥିବା ନିକଟସ୍ଥ ସ୍ଥାନର ନାମ ଜଣାଇ, ସେହି ସ୍ଥାନାଙ୍କ ପାଇଁ ଲାଇଭ ପାଣିପାଗ ପୂର୍ବାନୁମାନ ପାଇ, ନିୟମିତ ସମୟ-ଆଧାରିତ ପ୍ରତିରୂପ ଅନୁସାରେ ଭିଡ଼ି ଘନତ୍ୱର ପୂର୍ବାନୁମାନ କରି, ଏବଂ ଉଭୟଙ୍କୁ ମିଶାଇ ଏକ ବିପଦ ନିଷ୍କର୍ଷ ଦିଏ।",

        detectLocationAssessRiskBtn:
            "ସ୍ଥାନ ଚିହ୍ନଟ କରି ବିପଦ ମୂଲ୍ୟାୟନ କରନ୍ତୁ",

        noAssessmentYet:
            "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ମୂଲ୍ୟାୟନ ନାହିଁ — ଉପରେ ଏକ ଚିହ୍ନଟ ଚଲାନ୍ତୁ।",

        boundaryAlertsLabel:
            "ସୀମା ଆଲର୍ଟ",

        geofenceActivity:
            "ଜିଓଫେନ୍ସ କାର୍ଯ୍ୟକଳାପ",

        geofenceActivityDesc:
            "ପ୍ରତ୍ୟେକ ମଣ୍ଡଳ ଚାରିପାଖର ଚିହ୍ନିତ ପରିଧି ପାଇଁ ଲାଇଭ ENTER/EXIT ଘଟଣା (ଦର୍ଶନାର୍ଥୀ ପୃଷ୍ଠାରେ ମୋର ସ୍ଥାନ ଚିହ୍ନଟ କରନ୍ତୁ କିମ୍ବା ଲାଇଭ ଜିଓଫେନ୍ସ ଆଲର୍ଟ ସକ୍ଷମ କରନ୍ତୁ ଏହାକୁ ସକ୍ରିୟ କରେ)।",

        noGeofenceActivity:
            "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଜିଓଫେନ୍ସ କାର୍ଯ୍ୟକଳାପ ନାହିଁ — ଏକ ସ୍ଥାନ ଚିହ୍ନଟ କରନ୍ତୁ କିମ୍ବା ଉପରେ ଲାଇଭ ନିରୀକ୍ଷଣ ସକ୍ଷମ କରନ୍ତୁ।",

        incidentCenterLabel:
            "ଘଟଣା କେନ୍ଦ୍ର",

        activeIncidents:
            "ସକ୍ରିୟ ଘଟଣା",

        clearResolvedBtn:
            "ସମାଧାନ ହୋଇଥିବା ଗୁଡ଼ିକ ସଫା କରନ୍ତୁ",

        environmentLabel:
            "ପରିବେଶ",

        weatherTransportLabel:
            "ପାଣିପାଗ ଏବଂ ପରିବହନ",

        loadingText:
            "ଲୋଡ ହେଉଛି...",

        normalStatus:
            "ସାଧାରଣ",

        shuttleServicesOperational:
            "ସଟଲ ସେବା ଚାଲୁଅଛି",

        connectivityLabel:
            "ସଂଯୋଗ",

        onlineStatus:
            "ଅନଲାଇନ",

        offlineCacheEnabled:
            "ଅଫଲାଇନ କ୍ୟାଶ ସକ୍ଷମ",

        popularPlacesTitle:
            "ଭୁବନେଶ୍ୱର ଲୋକପ୍ରିୟ ସ୍ଥାନ — ଭିଡ଼ି ଯାଞ୍ଚ",

        popularPlacesDesc:
            "ଭୁବନେଶ୍ୱରର ଲୋକପ୍ରିୟ ମନ୍ଦିର, ଉଦ୍ୟାନ ଏବଂ ଦର୍ଶନୀୟ ସ୍ଥାନଗୁଡ଼ିକରେ ବର୍ତ୍ତମାନର ଭିଡ଼ି ସ୍ତର ଯାଞ୍ଚ କରନ୍ତୁ, ଯାତ୍ରା କରିବା ପୂର୍ବରୁ ଯୋଜନା କରିବାରେ ସାହାଯ୍ୟ ପାଇଁ।",

        checkPopularCrowds:
            "ଭିଡ଼ି ସ୍ତର ଯାଞ୍ଚ କରନ୍ତୁ",

        popularPlacesHint:
            "ପ୍ରତ୍ୟେକ ସ୍ଥାନରେ ଅନୁମାନିତ ଭିଡ଼ି ସ୍ତର ଦେଖିବାକୁ ଉପରେ ବଟନ ଦବାନ୍ତୁ।"

    }

};

// Most browsers block audio until the user has interacted with the
// page at least once. Create/resume the shared AudioContext on the
// very first click/touch/keypress so the advisory popup sound is
// ready to play whenever an advisory actually arrives.
document.addEventListener(
    "click",
    unlockAdvisoryAudio,
    { once: true }
);

document.addEventListener(
    "keydown",
    unlockAdvisoryAudio,
    { once: true }
);

document.addEventListener(
    "touchstart",
    unlockAdvisoryAudio,
    { once: true }
);

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadData();

        renderAIZoneOptions();

        populateTourFinderPlaces();

        const tourFinderInputEl =
            document.getElementById(
                "tourFinderInput"
            );

        if (tourFinderInputEl) {

            tourFinderInputEl.addEventListener(
                "keydown",
                event => {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        findTourPlace();

                    }

                }
            );

        }

        renderEverything();

        // Automatically request the user's real GPS location for the escape map.
        window.setTimeout(() => {
            if (typeof startAutomaticEscapeLocation === "function") {
                startAutomaticEscapeLocation();
            }
        }, 350);

        updateTime();

        window.setInterval(
            updateTime,
            10000
        );

        fetchLiveWeather();

        window.setInterval(
            fetchLiveWeather,
            10 * 60 * 1000
        );

        fetchAmaBusStatus();

        window.setInterval(
            fetchAmaBusStatus,
            20000
        );

        fetchAdvisories();

        window.setInterval(
            fetchAdvisories,
            ADVISORY_POLL_INTERVAL_MS
        );

        fetchIncidents();

        window.setInterval(
            fetchIncidents,
            INCIDENT_POLL_INTERVAL_MS
        );

        fetchSosAlerts();

        window.setInterval(
            fetchSosAlerts,
            SOS_POLL_INTERVAL_MS
        );

        const sosFabBtn =
            document.getElementById(
                "sosFab"
            );

        if (sosFabBtn) {

            sosFabBtn.addEventListener(
                "click",
                openSosConfirm
            );

        }

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

    localStorage.setItem(
        "safeYatriGeofenceEvents",
        JSON.stringify(geofenceEvents)
    );

    localStorage.setItem(
        "safeYatriLastPoppedAdvisoryId",
        JSON.stringify(lastPoppedAdvisoryId)
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

    const storedGeofenceEvents =
        localStorage.getItem(
            "safeYatriGeofenceEvents"
        );

    if (storedGeofenceEvents) {

        try {

            geofenceEvents =
                JSON.parse(
                    storedGeofenceEvents
                );

        } catch {

            console.log(
                "Could not load geofence events"
            );

        }

    }

    const storedLastPoppedAdvisoryId =
        localStorage.getItem(
            "safeYatriLastPoppedAdvisoryId"
        );

    if (storedLastPoppedAdvisoryId) {

        try {

            lastPoppedAdvisoryId =
                JSON.parse(
                    storedLastPoppedAdvisoryId
                );

        } catch {

            console.log(
                "Could not load last popped advisory id"
            );

        }

    }

    zones.forEach(zone => {

        if (!zone.radius) {

            zone.radius = 75;

        }

        if (!zone.features || !zone.icon) {

            const match =
                lookupPopularPlace(zone.name);

            if (!zone.features) {

                zone.features =
                    (match && match.features) ||
                    ["CCTV Surveillance", "Security Personnel"];

            }

            if (!zone.icon) {

                zone.icon =
                    (match && match.icon) ||
                    "📍";

            }

        }

    });

}

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

        <div class="form-group" style="margin-top:14px">

            <label>Advisory API Key</label>

            <input type="password"
                   id="adminApiKeyInput"
                   placeholder="Broadcast key"
                   autocomplete="off">

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

            const apiKeyField =
                document.getElementById(
                    "adminApiKeyInput"
                );

            if (usernameField) {

                usernameField.focus();

            }

            [usernameField, passwordField, apiKeyField].forEach(
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

    const apiKey =
        document.getElementById(
            "adminApiKeyInput"
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

        sessionStorage.setItem(
            "safeYatriAdminApiKey",
            apiKey
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

function checkMySafety() {

    scrollToSection(
        "locationSection"
    );

    getUserLocation();

    const started =
        startGeofenceMonitoring({ silent: true });

    if (started) {

        showToast(
            "Live safety tracking is now on — your status will update in real time"
        );

    }

}

function changeLanguage(language) {

    currentLanguage =
        language;

    /*
     * `currentLanguage` above is a top-level `let`, which does NOT
     * attach to `window` in a classic script. voice-assistant.js
     * reads `window.currentLanguage` to know the site's language,
     * so without this line that read is always undefined and the
     * assistant can start out of sync with the actual site language.
     */
    window.currentLanguage =
        language;

    const dictionary =
        translations[language];

    const fallback =
        translations.en;

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            const text =
                dictionary[key] ||
                fallback[key];

            if (text) {

                element.textContent =
                    text;

            }

        });

    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(element => {

            const key =
                element.dataset.i18nPlaceholder;

            const text =
                dictionary[key] ||
                fallback[key];

            if (text) {

                element.placeholder =
                    text;

            }

        });

    showToast(
        "Language changed"
    );

}

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

function renderEverything() {

    zones.forEach(
        zone => calculateRisk(zone)
    );

    renderVisitor();

    renderAdmin();

    renderSafetyAdvisories();

    renderPopularPlaces();

    renderEscapeMap();

    renderEscapeRouteSummary();

    refreshIncidentLocationStatus();

    saveData();

}

function renderVisitor() {

    const publicRisk =
        computeVisitorRisk();

    setVisitorRisk(
        publicRisk
    );

    updateAlert(publicRisk);

    renderGeofenceStatus(
        zones.filter(
            zone => activeGeofenceZoneIds.has(zone.id)
        )
    );

    renderLiveSafetyStatus(
        userLocation?.lat,
        userLocation?.lng
    );

}

function renderPopularPlaces() {

    const container =
        document.getElementById(
            "popularPlacesResult"
        );

    if (!container) return;

    container.innerHTML =
        popularPlaces
            .map(place => `

                <div class="popular-place-card">

                    <div class="popular-place-icon">
                        ${place.icon}
                    </div>

                    <div class="popular-place-info">

                        <strong>${place.name}</strong>

                        <p class="popular-place-status">
                            ${place.crowdStatus
                                ? `<span style="color:${getRiskColor(place.crowdStatus)}">
                                        ${getZoneIcon(place.crowdStatus)}
                                        ${place.crowdLabel}
                                   </span>`
                                : "Tap the button above to check"
                            }
                        </p>

                        ${place.features && place.features.length
                            ? `<div class="feature-tags">
                                    ${place.features.map(feature => `
                                        <span class="feature-tag">
                                            <i class="fa-solid fa-circle-check"></i> ${feature}
                                        </span>
                                    `).join("")}
                               </div>`
                            : ""
                        }

                    </div>

                </div>

            `)
            .join("");

}

const PLACE_TYPE = {
    "Lingaraj Temple": "temple",
    "Khandagiri & Udayagiri Caves": "heritage",
    "Dhauli Peace Pagoda": "heritage",
    "Rajarani Temple": "temple",
    "Ekamra Kanan Botanical Garden": "garden",
    "Nandankanan Zoological Park": "zoo"
};

const HOURLY_PATTERN = {

    temple: [
        0.05, 0.05, 0.05, 0.10, 0.25, 0.55,
        0.75, 0.70, 0.55, 0.40, 0.35, 0.35,
        0.30, 0.30, 0.35, 0.40, 0.55, 0.75,
        0.80, 0.60, 0.35, 0.20, 0.10, 0.05
    ],

    heritage: [
        0.02, 0.02, 0.02, 0.02, 0.02, 0.05,
        0.10, 0.20, 0.40, 0.60, 0.75, 0.80,
        0.75, 0.70, 0.65, 0.55, 0.35, 0.15,
        0.05, 0.02, 0.02, 0.02, 0.02, 0.02
    ],

    garden: [
        0.02, 0.02, 0.02, 0.02, 0.10, 0.45,
        0.65, 0.60, 0.45, 0.30, 0.20, 0.15,
        0.10, 0.15, 0.25, 0.40, 0.60, 0.70,
        0.55, 0.30, 0.10, 0.02, 0.02, 0.02
    ],

    zoo: [
        0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
        0.02, 0.05, 0.15, 0.45, 0.65, 0.75,
        0.80, 0.75, 0.65, 0.50, 0.30, 0.10,
        0.02, 0.02, 0.02, 0.02, 0.02, 0.02
    ]

};

const KNOWN_EVENTS_2026 = [

    {
        name: "Maha Shivratri",
        start: "2026-02-15",
        end: "2026-02-16",
        boost: { temple: 45, heritage: 10, garden: 8, zoo: 5 }
    },

    {
        name: "Rath Yatra season",
        start: "2026-07-16",
        end: "2026-07-25",
        boost: { temple: 45, heritage: 20, garden: 15, zoo: 10 }
    },

    {
        name: "Ganesh Chaturthi season",
        start: "2026-09-14",
        end: "2026-09-25",
        boost: { temple: 20, heritage: 10, garden: 10, zoo: 10 }
    },

    {
        name: "Durga Puja / Sharad Navratri",
        start: "2026-10-11",
        end: "2026-10-19",
        boost: { temple: 35, heritage: 15, garden: 20, zoo: 20 }
    },

    {
        name: "Diwali",
        start: "2026-11-07",
        end: "2026-11-09",
        boost: { temple: 30, heritage: 10, garden: 15, zoo: 15 }
    },

    {
        name: "Kartik Purnima / Dev Diwali",
        start: "2026-11-23",
        end: "2026-11-24",
        boost: { temple: 25, heritage: 5, garden: 10, zoo: 5 }
    }

];

function toDateOnly(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function findActiveEvent(now) {

    const today = toDateOnly(now).getTime();

    return KNOWN_EVENTS_2026.find(event => {

        const start = toDateOnly(new Date(event.start)).getTime();
        const end = toDateOnly(new Date(event.end)).getTime();

        return today >= start && today <= end;

    }) || null;

}

function computeHistoricCrowdEstimate(place, now) {

    const type =
        PLACE_TYPE[place.name] || "heritage";

    const hour = now.getHours();
    const day = now.getDay();
    const isWeekend = (day === 0 || day === 6);

    const hourlyFraction =
        HOURLY_PATTERN[type][hour];

    const weekendMultiplier =
        isWeekend ? 1.3 : 1.0;

    let occupancy =
        hourlyFraction * 100 * weekendMultiplier;

    const activeEvent =
        findActiveEvent(now);

    if (activeEvent) {
        occupancy += activeEvent.boost[type] || 0;
    }

    occupancy =
        Math.max(2, Math.min(100, Math.round(occupancy)));

    const status =
        occupancy < 50
            ? "SAFE"
            : occupancy < 80
                ? "WARNING"
                : "DANGER";

    const dayLabel =
        isWeekend ? "weekend" : "weekday";

    const timeLabel =
        hour < 6 ? "late night"
            : hour < 12 ? "morning"
                : hour < 17 ? "afternoon"
                    : hour < 21 ? "evening"
                        : "night";

    const reason =
        activeEvent
            ? `${activeEvent.name} crowd surge, ${dayLabel} ${timeLabel}`
            : `Typical ${dayLabel} ${timeLabel} footfall`;

    return { occupancy, status, reason };

}

function checkPopularPlacesCrowd() {

    const now = new Date();

    popularPlaces.forEach(place => {

        const { occupancy, status, reason } =
            computeHistoricCrowdEstimate(place, now);

        place.occupancy = occupancy;
        place.crowdStatus = status;

        const label =
            status === "SAFE"
                ? "Low crowd"
                : status === "WARNING"
                    ? "Moderate crowd"
                    : "High crowd";

        place.crowdLabel =
            `${label} (${occupancy}%) - ${reason}`;

    });

    renderPopularPlaces();

    showToast(
        "Crowd levels updated from historic day/time & festival data"
    );

}

/* =========================================================
   AI TOUR FINDER
   ---------------------------------------------------------
   Visitor searches a place name; we compute its live crowd
   estimate (same heuristic used above) and current weather,
   then ask a real AI model (Claude, via the /api/tour-advisor
   Netlify function) to judge whether it's a good time to go —
   grounded strictly in that data, with a nearby calmer place
   suggested from our own tracked list if not. If the AI
   endpoint can't be reached, a simple local fallback rule
   keeps the feature usable (e.g. offline).
========================================================= */

const TOUR_ADVISOR_API_URL = "/api/tour-advisor";

function populateTourFinderPlaces() {

    const list =
        document.getElementById(
            "tourFinderPlacesList"
        );

    if (!list) return;

    list.innerHTML =
        popularPlaces
            .map(place => `<option value="${escapeHtml(place.name)}"></option>`)
            .join("");

}

function findPopularPlaceByName(query) {

    const normalized =
        query.trim().toLowerCase();

    if (!normalized) return null;

    return (
        popularPlaces.find(
            place => place.name.toLowerCase() === normalized
        ) ||
        popularPlaces.find(
            place => place.name.toLowerCase().includes(normalized)
        ) ||
        null
    );

}

async function findTourPlace() {

    const input =
        document.getElementById(
            "tourFinderInput"
        );

    const resultBox =
        document.getElementById(
            "tourFinderResult"
        );

    if (!resultBox) return;

    const query =
        input ? input.value : "";

    const place =
        findPopularPlaceByName(query);

    if (!place) {

        resultBox.innerHTML = `
            <p class="advisory-empty">
                Couldn't match "${escapeHtml(query)}" to a tracked place.
                Try: ${popularPlaces.map(p => escapeHtml(p.name)).join(", ")}.
            </p>
        `;

        return;

    }

    resultBox.innerHTML = `
        <p class="tour-finder-loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            Checking live crowd and weather conditions for ${escapeHtml(place.name)}...
        </p>
    `;

    const now = new Date();

    const requestedEstimate =
        computeHistoricCrowdEstimate(place, now);

    const alternatives =
        popularPlaces
            .filter(p => p.name !== place.name)
            .map(p => {

                const estimate =
                    computeHistoricCrowdEstimate(p, now);

                return {
                    name: p.name,
                    occupancy: estimate.occupancy,
                    status: estimate.status,
                    reason: estimate.reason,
                    distanceKm:
                        Math.round(
                            calculateDistance(
                                place.lat, place.lng, p.lat, p.lng
                            ) * 10
                        ) / 10
                };

            })
            .sort((a, b) => a.distanceKm - b.distanceKm);

    const payload = {
        place: {
            name: place.name,
            occupancy: requestedEstimate.occupancy,
            crowdStatus: requestedEstimate.status,
            crowdReason: requestedEstimate.reason
        },
        weather: {
            risk: currentWeatherRisk,
            text: currentWeatherText,
            temperature: currentTemperatureC
        },
        alternatives: alternatives
    };

    try {

        const response =
            await fetch(
                TOUR_ADVISOR_API_URL,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );

        if (!response.ok) {

            throw new Error(
                "Bad response: " + response.status
            );

        }

        const advice =
            await response.json();

        renderTourFinderResult(
            place,
            requestedEstimate,
            advice
        );

    } catch (error) {

        console.log(
            "Tour advisor request failed, using local fallback",
            error
        );

        renderTourFinderResult(
            place,
            requestedEstimate,
            fallbackTourAdvice(requestedEstimate, alternatives)
        );

    }

}

function fallbackTourAdvice(requestedEstimate, alternatives) {

    // Only used if the AI advisor endpoint can't be reached (e.g. no
    // network, or ANTHROPIC_API_KEY not configured yet) — a simple
    // local rule so the feature still works.
    const combinedRisk =
        requestedEstimate.occupancy * 0.6 +
        currentWeatherRisk * 0.4;

    const verdict =
        combinedRisk < 45
            ? "SAFE"
            : combinedRisk < 70
                ? "CAUTION"
                : "UNSAFE";

    const reason =
        `Crowd is at ${requestedEstimate.occupancy}% (${requestedEstimate.reason}) ` +
        `with a weather risk score of ${currentWeatherRisk}/100 (${currentWeatherText}).`;

    let alternative = null;

    if (verdict === "UNSAFE" && alternatives.length > 0) {

        alternative =
            [...alternatives].sort(
                (a, b) => a.occupancy - b.occupancy
            )[0].name;

    }

    return { verdict, reason, alternative };

}

function renderTourFinderResult(place, estimate, advice) {

    const resultBox =
        document.getElementById(
            "tourFinderResult"
        );

    if (!resultBox) return;

    const verdict =
        (advice.verdict || "CAUTION").toString().toUpperCase();

    const verdictClass =
        verdict === "SAFE"
            ? "verdict-safe"
            : verdict === "UNSAFE"
                ? "verdict-unsafe"
                : "verdict-caution";

    const verdictIcon =
        verdict === "SAFE"
            ? "✅"
            : verdict === "UNSAFE"
                ? "⛔"
                : "⚠️";

    const verdictLabel =
        verdict === "SAFE"
            ? "Good time to visit"
            : verdict === "UNSAFE"
                ? "Not a good time right now"
                : "Visit with caution";

    const alternativePlace =
        advice.alternative
            ? popularPlaces.find(
                  p => p.name.toLowerCase() === advice.alternative.toString().toLowerCase()
              )
            : null;

    resultBox.innerHTML = `

        <div class="tour-finder-verdict ${verdictClass}">

            <div class="tour-finder-verdict-icon">${verdictIcon}</div>

            <div>
                <h4>${escapeHtml(place.name)} — ${verdictLabel}</h4>
                <p>${escapeHtml(advice.reason || "")}</p>
            </div>

        </div>

        <div class="tour-finder-meta">
            <span><i class="fa-solid fa-users"></i> Crowd: ${estimate.occupancy}% (${estimate.status})</span>
            <span><i class="fa-solid fa-cloud"></i> Weather: ${escapeHtml(currentWeatherText)} (risk ${currentWeatherRisk}/100)</span>
        </div>

        ${
            alternativePlace
                ? `
                    <div class="tour-finder-alt">
                        <h4>
                            <i class="fa-solid fa-route"></i>
                            Suggested instead: ${alternativePlace.icon || ""} ${escapeHtml(alternativePlace.name)}
                        </h4>
                        <p>Calmer conditions right now.</p>
                        <a href="https://www.google.com/maps?q=${alternativePlace.lat},${alternativePlace.lng}"
                           target="_blank" rel="noopener">
                            <i class="fa-solid fa-location-dot"></i> View on map
                        </a>
                    </div>
                  `
                : ""
        }

    `;

}

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

function renderAdmin() {

    zones.forEach(
        zone => calculateRisk(zone)
    );

    renderAdminIncidents();

    updateAdminStatus();

    renderGeofenceEventLog();

}

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

/* Resilient multi-tier geolocation resolver */
function getGeolocationPosition(options = {}) {

    return new Promise(async (resolve) => {

        const tryBrowserLocation = (enableHighAcc, timeoutMs) => {
            return new Promise((res, rej) => {
                if (!("geolocation" in navigator)) {
                    return rej(new Error("Geolocation is not supported by this browser."));
                }
                navigator.geolocation.getCurrentPosition(
                    position => {
                        res({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy || 0
                        });
                    },
                    error => {
                        rej(error);
                    },
                    {
                        enableHighAccuracy: enableHighAcc,
                        timeout: timeoutMs,
                        maximumAge: 60000,
                        ...options
                    }
                );
            });
        };

        // 1. Try GPS / High accuracy first
        try {
            const pos = await tryBrowserLocation(true, 5000);
            return resolve(pos);
        } catch (e1) {
            // 2. Try Low accuracy / Cellular & Wi-Fi triangulation
            try {
                const pos = await tryBrowserLocation(false, 7000);
                return resolve(pos);
            } catch (e2) {
                console.warn("Browser GPS unavailable, falling back to network IP location...", e2);
            }
        }

        // 3. Network IP lookup fallback
        try {
            const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3500) });
            if (res.ok) {
                const data = await res.json();
                if (data && typeof data.latitude === "number" && typeof data.longitude === "number") {
                    return resolve({
                        lat: data.latitude,
                        lng: data.longitude,
                        accuracy: 2500,
                        isFallback: true
                    });
                }
            }
        } catch (errIp) {
            try {
                const res2 = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(3500) });
                if (res2.ok) {
                    const data2 = await res2.json();
                    if (data2 && data2.success && data2.latitude && data2.longitude) {
                        return resolve({
                            lat: Number(data2.latitude),
                            lng: Number(data2.longitude),
                            accuracy: 2500,
                            isFallback: true
                        });
                    }
                }
            } catch (errIp2) {}
        }

        // 4. City project default fallback
        resolve({
            lat: BHUBANESWAR_LAT || 20.2961,
            lng: BHUBANESWAR_LNG || 85.8245,
            accuracy: 5000,
            isDefault: true
        });

    });

}

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

    const matchedZone =
        zones.find(
            zone =>
                zone.name.toLowerCase() ===
                zoneText.toLowerCase()
        );

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

    const incidentPayload = {

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
            etaMinutes

    };

    try {

        const response =
            await fetch(
                INCIDENT_API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(incidentPayload)
                }
            );

        if (!response.ok) {

            throw new Error(
                "Bad response: " + response.status
            );

        }

        incidents =
            await response.json();

        saveData();

    } catch (error) {

        console.log(
            "Could not reach the server, saving incident locally only",
            error
        );

        incidents.unshift({
            id: Date.now(),
            ...incidentPayload,
            status: "OPEN",
            time: new Date().toLocaleString(),
            syncedToServer: false
        });

        saveData();

        showToast(
            "Could not reach the server — incident saved on this device only"
        );

    }

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

async function resolveIncident(id) {

    if (!isAdminLoggedIn()) {

        showToast(
            "Please log in as admin first"
        );

        return;

    }

    try {

        const response =
            await fetch(
                INCIDENT_API_URL,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-key": getAdminApiKey()
                    },
                    body: JSON.stringify({
                        id: id,
                        status: "CLOSED"
                    })
                }
            );

        if (response.status === 401) {

            showToast(
                "Invalid admin key — check the Advisory API Key entered at login"
            );

            return;

        }

        if (!response.ok) {

            throw new Error(
                "Bad response: " + response.status
            );

        }

        incidents =
            await response.json();

        saveData();

        renderEverything();

        showToast(
            "Incident resolved"
        );

    } catch (error) {

        console.log(
            "Could not resolve incident",
            error
        );

        showToast(
            "Could not reach the server — incident not resolved"
        );

    }

}

async function clearResolvedIncidents() {

    if (!isAdminLoggedIn()) {

        showToast(
            "Please log in as admin first"
        );

        return;

    }

    try {

        const response =
            await fetch(
                INCIDENT_API_URL,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-key": getAdminApiKey()
                    },
                    body: JSON.stringify({
                        status: "CLOSED"
                    })
                }
            );

        if (response.status === 401) {

            showToast(
                "Invalid admin key — check the Advisory API Key entered at login"
            );

            return;

        }

        if (!response.ok) {

            throw new Error(
                "Bad response: " + response.status
            );

        }

        incidents =
            await response.json();

        saveData();

        renderEverything();

        showToast(
            "Resolved incidents cleared"
        );

    } catch (error) {

        console.log(
            "Could not clear resolved incidents",
            error
        );

        showToast(
            "Could not reach the server — incidents not cleared"
        );

    }

}

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
        setCrowdLiveIndicator(true);

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

    setCrowdLiveIndicator(false);

    document.getElementById(
        "cameraStatus"
    ).style.background =
        "#f1f5f9";

    document.getElementById(
        "cameraStatus"
    ).style.color =
        "#727b8d";

    resetCrowdIntelligence();

    showToast(
        "Camera stopped"
    );

}

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

        updateLiveCrowdIntelligence(people.length);

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

function setCrowdLiveIndicator(active) {
    const el = document.getElementById("crowdLiveIndicator");
    if (!el) return;
    el.classList.toggle("active", active);
    el.innerHTML = `<span class="live-dot"></span> ${active ? "LIVE CAMERA" : "CAMERA OFFLINE"}`;
}

function selectedAIZone() {
    const id = Number(document.getElementById("aiZone")?.value ?? 0);
    return zones.find(z => z.id === id) || zones[0];
}

function handleAIZoneChange() {

    const zone = selectedAIZone();

    resetCrowdIntelligence();

    const zoneEl = document.getElementById("crowdMonitorZone");
    if (zoneEl) zoneEl.textContent = zone.name;

    const msg = document.getElementById("liveCrowdMessage");
    if (msg) {
        msg.textContent = detectionRunning
            ? "Switched zone — rebuilding live baseline..."
            : "Start the AI camera to begin live monitoring.";
    }

    renderAIZoneFeatures();

}

function renderAIZoneOptions() {

    const select =
        document.getElementById("aiZone");

    if (!select) return;

    const previousValue =
        select.value;

    select.innerHTML =
        zones.map(zone => `
            <option value="${zone.id}">
                ${zone.icon ? zone.icon + " " : ""}${zone.name}
            </option>
        `).join("");

    const stillExists =
        zones.some(
            zone => String(zone.id) === previousValue
        );

    select.value =
        stillExists
            ? previousValue
            : (zones[0] ? String(zones[0].id) : "");

    renderAIZoneFeatures();

    renderAddZonePlaceOptions();

}

function renderAIZoneFeatures() {

    const container =
        document.getElementById("aiZoneFeatures");

    if (!container) return;

    const zone =
        selectedAIZone();

    if (!zone || !zone.features || zone.features.length === 0) {

        container.innerHTML = "";
        return;

    }

    container.innerHTML = `
        <span class="feature-tags-label">Safety features here:</span>
        <div class="feature-tags">
            ${zone.features.map(feature => `
                <span class="feature-tag">
                    <i class="fa-solid fa-circle-check"></i> ${feature}
                </span>
            `).join("")}
        </div>
    `;

}

function renderAddZonePlaceOptions() {

    const select =
        document.getElementById("addZonePlaceSelect");

    if (!select) return;

    const availablePlaces =
        popularPlaces.filter(
            place =>
                !zones.some(
                    zone => zone.name === place.name
                )
        );

    if (availablePlaces.length === 0) {

        select.innerHTML =
            `<option value="">All popular places are already monitored</option>`;

        select.disabled = true;

        return;

    }

    select.disabled = false;

    select.innerHTML =
        availablePlaces.map(place => `
            <option value="${place.name}">
                ${place.icon ? place.icon + " " : ""}${place.name}
            </option>
        `).join("");

}

function addMonitoredZone() {

    const select =
        document.getElementById("addZonePlaceSelect");

    const placeName =
        select ? select.value : "";

    const place =
        popularPlaces.find(
            candidate => candidate.name === placeName
        );

    if (!place) {

        showToast(
            "Pick a place to add first"
        );

        return;

    }

    if (zones.some(zone => zone.name === place.name)) {

        showToast(
            `${place.name} is already being monitored`
        );

        return;

    }

    const nextId =
        zones.length
            ? Math.max(...zones.map(zone => zone.id)) + 1
            : 0;

    const capacity =
        place.defaultCapacity || 150;

    const newZone = {
        id: nextId,
        name: place.name,
        capacity: capacity,
        people: Math.round(capacity * 0.3),
        risk: 0,
        weatherRisk: currentWeatherRisk,
        status: "SAFE",
        lat: place.lat,
        lng: place.lng,
        radius: 75,
        icon: place.icon,
        features: place.features || []
    };

    calculateRisk(newZone);

    zones.push(newZone);

    renderAIZoneOptions();

    const zoneSelect =
        document.getElementById("aiZone");

    if (zoneSelect) zoneSelect.value = String(newZone.id);

    handleAIZoneChange();

    renderEverything();

    showToast(
        `${place.name} added to live monitoring`
    );

}

function removeMonitoredZone() {

    if (zones.length <= 1) {

        showToast(
            "At least one monitored place is required"
        );

        return;

    }

    const zone =
        selectedAIZone();

    if (!zone) return;

    if (detectionRunning) {

        stopCamera();

    }

    activeGeofenceZoneIds.delete(zone.id);

    zones =
        zones.filter(
            candidate => candidate.id !== zone.id
        );

    resetCrowdIntelligence();

    renderAIZoneOptions();

    handleAIZoneChange();

    renderEverything();

    showToast(
        `${zone.name} removed from live monitoring`
    );

}

function addAnomalyEvent(title, detail, level="warning") {
    const now = Date.now();
    const key = `${title}:${selectedAIZone().id}`;
    if (key === lastAnomalyKey && now - (anomalyEvents[0]?.timestamp || 0) < ANOMALY_COOLDOWN_MS) return;
    lastAnomalyKey = key;
    anomalyEvents.unshift({ title, detail, level, timestamp: now });
    anomalyEvents = anomalyEvents.slice(0, 8);
    renderAnomalyEvents();
}

function renderAnomalyEvents() {
    const list = document.getElementById("anomalyList");
    if (!list) return;
    if (!anomalyEvents.length) {
        list.innerHTML = `<div class="anomaly-empty">No unusual activity detected.</div>`;
        return;
    }
    list.innerHTML = anomalyEvents.slice(0, 5).map(e => `
        <div class="anomaly-item ${e.level}">
            <strong>${e.title}</strong>
            <span>${e.detail} · ${new Date(e.timestamp).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit", second:"2-digit"})}</span>
        </div>`).join("");
}

function flagDetectedIncident(title, detail, severity="HIGH") {
    const now = Date.now();
    if (detectedIncident && now - detectedIncident.timestamp < ANOMALY_COOLDOWN_MS) return;
    detectedIncident = { title, detail, severity, timestamp: now };
    const box = document.getElementById("detectedIncidentBox");
    if (!box) return;
    box.innerHTML = `
        <div class="detected-incident">
            <div><span class="tag">${severity}</span><strong style="display:block;margin-top:7px;">${title}</strong><span style="font-size:12px;color:var(--muted);">${detail}</span></div>
            <button onclick="useDetectedIncident()">Review</button>
        </div>`;
}

function useDetectedIncident() {
    const zone = selectedAIZone();
    const type = document.getElementById("incidentType");
    const zoneSelect = document.getElementById("incidentZone");
    const severity = document.getElementById("incidentSeverity");
    const description = document.getElementById("incidentDescription");
    if (zoneSelect) zoneSelect.value = zone.name;
    if (type) type.value = "Crowd Problem";
    if (severity) severity.value = detectedIncident?.severity || "HIGH";
    if (description) description.value = `${detectedIncident?.title || "Unusual crowd activity"}: ${detectedIncident?.detail || "AI monitoring flagged unusual activity."}`;
    const form = document.querySelector(".incident-form");
    form?.scrollIntoView({behavior:"smooth", block:"center"});
    showToast("Detected event copied to incident form");
}

function updateLiveCrowdIntelligence(count) {
    const zone = selectedAIZone();
    const now = Date.now();
    const previous = crowdHistory.length ? crowdHistory[crowdHistory.length - 1].count : count;
    crowdHistory.push({ count, timestamp: now });
    crowdHistory = crowdHistory.filter(s => now - s.timestamp <= CROWD_HISTORY_WINDOW_MS);
    crowdPeak = Math.max(crowdPeak, count);

    const oldSample = crowdHistory.find(s => now - s.timestamp >= 9000);
    const delta = count - (oldSample?.count ?? previous);
    const occupancy = zone.capacity ? (count / zone.capacity) * 100 : 0;
    const recentCounts = crowdHistory.map(s => s.count);
    const avg = recentCounts.reduce((a,b)=>a+b,0) / Math.max(1,recentCounts.length);
    const surgeRatio = avg ? Math.abs(count - avg) / avg : 0;

    let score = 0;
    if (occupancy >= 100) score += 55;
    else if (occupancy >= 80) score += 30;
    if (Math.abs(delta) >= Math.max(3, zone.capacity * .20)) score += 30;
    else if (Math.abs(delta) >= Math.max(2, zone.capacity * .10)) score += 15;
    if (surgeRatio >= .50) score += 20;
    score = Math.min(100, Math.round(score));

    const countEl=document.getElementById("liveCrowdCount");
    const peakEl=document.getElementById("liveCrowdPeak");
    const deltaEl=document.getElementById("liveCrowdDelta");
    const scoreEl=document.getElementById("liveAnomalyScore");
    const occEl=document.getElementById("liveCrowdOccupancy");
    const bar=document.getElementById("liveCrowdBar");
    const zoneEl=document.getElementById("crowdMonitorZone");
    const badge=document.getElementById("crowdConditionBadge");
    const msg=document.getElementById("liveCrowdMessage");
    const scoreBox=document.getElementById("anomalyScoreBox");
    const statusText=document.getElementById("anomalyStatusText");

    if(countEl) countEl.textContent=count;
    if(peakEl) peakEl.textContent=crowdPeak;
    if(deltaEl) deltaEl.textContent=(delta>0?"+":"")+delta;
    if(scoreEl) scoreEl.textContent=score+"%";
    if(occEl) occEl.textContent=Math.round(occupancy)+"%";
    if(zoneEl) zoneEl.textContent=zone.name;
    if(bar){bar.style.width=Math.min(100,Math.max(0,occupancy))+"%";bar.style.background=occupancy>=100?"#ef4444":occupancy>=80?"#f59e0b":"#22c55e";}
    if(scoreBox){scoreBox.textContent=score+"%";scoreBox.style.background=score>=70?"#fee2e2":score>=40?"#fef3c7":"#eff6ff";scoreBox.style.color=score>=70?"#b91c1c":score>=40?"#a16207":"#2563eb";}

    if(occupancy>=100){
        if(badge){badge.textContent="OVER CAPACITY"; badge.style.background="#fee2e2"; badge.style.color="#b91c1c";}
        if(msg) msg.textContent="Crowd count is at or above the configured zone capacity.";
        addAnomalyEvent("Over-capacity crowd", `${count} detected in ${zone.name} (capacity ${zone.capacity})`, "danger");
        flagDetectedIncident("Potential crowding incident", `${count} people detected in ${zone.name}; occupancy is ${Math.round(occupancy)}%.`, "HIGH");
    } else if(Math.abs(delta)>=Math.max(3, zone.capacity*.20)){
        if(badge){badge.textContent=delta>0?"SURGE DETECTED":"RAPID DROP"; badge.style.background="#fef3c7"; badge.style.color="#a16207";}
        if(msg) msg.textContent=delta>0?"A rapid increase in the anonymous camera count was detected.":"A rapid decrease in the anonymous camera count was detected.";
        addAnomalyEvent(delta>0?"Sudden crowd surge":"Sudden crowd drop", `${delta>0?"+":""}${delta} people compared with the recent baseline in ${zone.name}`, "warning");
        if(delta>0) flagDetectedIncident("Unusual crowd surge", `Anonymous count changed by ${delta} people in about 10 seconds at ${zone.name}.`, "HIGH");
    } else if(score>=40){
        if(badge){badge.textContent="WATCH"; badge.style.background="#fef3c7"; badge.style.color="#a16207";}
        if(msg) msg.textContent="Monitoring shows elevated crowd pressure or unusual variation.";
        if(statusText) statusText.textContent="Elevated activity — keep monitoring.";
    } else {
        if(badge){badge.textContent="NORMAL"; badge.style.background="#dcfce7"; badge.style.color="#15803d";}
        if(msg) msg.textContent="Crowd pattern is currently within the normal monitoring range.";
        if(statusText) statusText.textContent="No anomaly detected";
    }
    if(statusText && score>=70) statusText.textContent="High anomaly signal — review incident panel.";
    if(score>=70) addAnomalyEvent("High anomaly score", `Monitoring score reached ${score}% in ${zone.name}`, "danger");
    lastCrowdSampleAt=now;
}

function resetCrowdIntelligence() {
    crowdHistory=[]; crowdPeak=0; lastAnomalyKey=""; anomalyEvents=[]; detectedIncident=null;
    renderAnomalyEvents();
    const box=document.getElementById("detectedIncidentBox"); if(box) box.innerHTML='<div class="anomaly-empty">No unusual incident currently flagged.</div>';
    ["liveCrowdCount","liveCrowdPeak","liveCrowdDelta"].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent="0";});
    ["liveCrowdOccupancy","liveAnomalyScore"].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent="0%";});

    const badge = document.getElementById("crowdConditionBadge");
    if (badge) {
        badge.textContent = "NORMAL";
        badge.style.background = "#dcfce7";
        badge.style.color = "#15803d";
    }

    const msg = document.getElementById("liveCrowdMessage");
    if (msg) msg.textContent = "Start the AI camera to begin live monitoring.";

    const bar = document.getElementById("liveCrowdBar");
    if (bar) { bar.style.width = "0%"; bar.style.background = "#22c55e"; }

    const scoreBox = document.getElementById("anomalyScoreBox");
    if (scoreBox) {
        scoreBox.textContent = "0%";
        scoreBox.style.background = "#eff6ff";
        scoreBox.style.color = "#2563eb";
    }

    const statusText = document.getElementById("anomalyStatusText");
    if (statusText) statusText.textContent = "No anomaly detected";
}

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

    zone.people =
        count;

    calculateRisk(
        zone
    );

    saveData();

    renderVisitor();

    renderAdmin();

}

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

    currentWeatherText =
        text;

    currentTemperatureC =
        temperature;

    zones.forEach(zone => {

        zone.weatherRisk =
            risk;

        calculateRisk(zone);

    });

    renderEverything();

}

const AMA_BUS_API_URL = "";
const AMA_BUS_API_KEY = "";

let busStops = [

    {
        name: "Temple Gate Bus Stop",
        lat: 20.2378,
        lng: 85.8312,
        buses: [
            { route: "AMA-12", destination: "Airport", headwayMinutes: 12 },
            { route: "AMA-27", destination: "Railway Station", headwayMinutes: 18 }
        ]
    },

    {
        name: "Lingaraj Square Stop",
        lat: 20.2368,
        lng: 85.8352,
        buses: [
            { route: "AMA-04", destination: "Bus Stand", headwayMinutes: 10 },
            { route: "AMA-31", destination: "City Center", headwayMinutes: 25 }
        ]
    },

    {
        name: "Bhubaneswar Railway Station Stop",
        lat: 20.2644,
        lng: 85.8281,
        buses: [
            { route: "AMA-27", destination: "Temple Gate", headwayMinutes: 18 },
            { route: "AMA-08", destination: "Airport", headwayMinutes: 15 },
            { route: "AMA-19", destination: "Master Canteen Square", headwayMinutes: 12 }
        ]
    },

    {
        name: "Master Canteen Square Stop",
        lat: 20.2700,
        lng: 85.8410,
        buses: [
            { route: "AMA-19", destination: "Railway Station", headwayMinutes: 12 },
            { route: "AMA-31", destination: "Lingaraj Square", headwayMinutes: 25 }
        ]
    },

    {
        name: "Vani Vihar Square Stop",
        lat: 20.2955,
        lng: 85.8236,
        buses: [
            { route: "AMA-15", destination: "Ekamra Kanan / Rajarani", headwayMinutes: 20 },
            { route: "AMA-08", destination: "Airport", headwayMinutes: 15 }
        ]
    },

    {
        name: "Nandankanan Zoo Gate Stop",
        lat: 20.3939,
        lng: 85.8186,
        buses: [
            { route: "AMA-22", destination: "Master Canteen Square", headwayMinutes: 30 }
        ]
    },

    {
        name: "ITER, SOA University Stop",
        lat: 20.2586,
        lng: 85.7924,
        buses: [
            { route: "AMA-14", destination: "Khandagiri Square", headwayMinutes: 15 },
            { route: "AMA-33", destination: "Master Canteen Square", headwayMinutes: 20 }
        ]
    }

];

const TRANSIT_DEMAND = {

    weekday: [
        0.05, 0.05, 0.05, 0.05, 0.10, 0.25,
        0.55, 0.80, 0.95, 0.85, 0.55, 0.45,
        0.45, 0.50, 0.55, 0.60, 0.75, 0.95,
        0.90, 0.60, 0.35, 0.20, 0.10, 0.05
    ],

    weekend: [
        0.05, 0.05, 0.05, 0.05, 0.05, 0.10,
        0.20, 0.30, 0.45, 0.55, 0.60, 0.65,
        0.65, 0.65, 0.60, 0.60, 0.65, 0.70,
        0.60, 0.45, 0.30, 0.15, 0.10, 0.05
    ]

};

function nextArrivalMinutes(headwayMinutes, now) {

    const minutesSinceMidnight =
        now.getHours() * 60 + now.getMinutes();

    const intoCycle =
        minutesSinceMidnight % headwayMinutes;

    return headwayMinutes - intoCycle;

}

function occupancyForDemand(demandIndex) {

    if (demandIndex < 0.4) return "Light";
    if (demandIndex < 0.75) return "Moderate";
    return "Crowded";

}

function computeStopSufficiency(stop, now) {

    const day = now.getDay();
    const isWeekend = (day === 0 || day === 6);
    const hour = now.getHours();

    const demandIndex =
        isWeekend
            ? TRANSIT_DEMAND.weekend[hour]
            : TRANSIT_DEMAND.weekday[hour];

    const supplyPerHour =
        stop.buses.reduce(
            (total, bus) => total + (60 / bus.headwayMinutes),
            0
        );

    const requiredPerHour =
        4 + demandIndex * 8;

    const ratio =
        supplyPerHour / requiredPerHour;

    const level =
        ratio >= 1.15
            ? "GOOD"
            : ratio >= 0.75
                ? "MODERATE"
                : "BAD";

    const busesWithEta =
        stop.buses.map(bus => ({
            ...bus,
            etaMinutes: nextArrivalMinutes(bus.headwayMinutes, now),
            occupancy: occupancyForDemand(demandIndex)
        })).sort((a, b) => a.etaMinutes - b.etaMinutes);

    const dayLabel = isWeekend ? "weekend" : "weekday";

    const timeLabel =
        hour < 6 ? "late night"
            : hour < 12 ? "morning"
                : hour < 17 ? "afternoon"
                    : hour < 21 ? "evening"
                        : "night";

    const reason =
        `${stop.buses.length} route(s), ~${supplyPerHour.toFixed(1)} buses/hr ` +
        `vs typical ${dayLabel} ${timeLabel} demand`;

    return { level, demandIndex, supplyPerHour, requiredPerHour, buses: busesWithEta, reason };

}

function computeCityWideSufficiency(now) {

    const perStop =
        busStops.map(stop => computeStopSufficiency(stop, now));

    const avgRatio =
        perStop.reduce(
            (sum, r) => sum + (r.supplyPerHour / r.requiredPerHour),
            0
        ) / perStop.length;

    const level =
        avgRatio >= 1.15
            ? "GOOD"
            : avgRatio >= 0.75
                ? "MODERATE"
                : "BAD";

    return { level, perStop };

}

function findNearestBusStop(lat, lng) {

    let nearest = busStops[0];
    let smallestDistance = Infinity;

    busStops.forEach(stop => {

        const distance =
            calculateDistance(lat, lng, stop.lat, stop.lng);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            nearest = stop;
        }

    });

    return { stop: nearest, distanceKm: smallestDistance };

}

function applyTransportLevel(level, detailText) {

    const label =
        level === "GOOD" ? "Good"
            : level === "MODERATE" ? "Moderate"
                : "Bad";

    const visitorEl = document.getElementById("visitorTransport");
    const adminEl = document.getElementById("adminTransport");
    const statusEl = document.getElementById("amaBusStatus");
    const detailEl = document.getElementById("amaBusStatusText");

    if (visitorEl) visitorEl.textContent = label;
    if (adminEl) adminEl.textContent = label;
    if (statusEl) statusEl.textContent = label;
    if (detailEl && detailText) detailEl.textContent = detailText;

    currentTransportRisk =
        level === "BAD" ? 75
            : level === "MODERATE" ? 40
                : 10;

    renderEverything();

}

function renderBusList(listEl, buses) {

    if (!listEl) return;

    listEl.innerHTML =
        buses.map(bus => `

            <div class="advisory-item">
                <div>
                    <strong>${bus.route}</strong>
                    — ${bus.destination}
                </div>
                <div style="color:var(--muted); font-size:13px; margin-top:4px;">
                    Next in ${bus.etaMinutes} min · ${bus.occupancy} occupancy
                </div>
            </div>

        `).join("");

}

function renderNearestBusStop(nearestResult, sufficiency) {

    const container =
        document.getElementById("nearestBusStopResult");

    if (!container) return;

    const color =
        sufficiency.level === "GOOD" ? "#16a34a"
            : sufficiency.level === "MODERATE" ? "#f59e0b"
                : "#dc2626";

    const label =
        sufficiency.level === "GOOD" ? "Good"
            : sufficiency.level === "MODERATE" ? "Moderate"
                : "Bad";

    container.innerHTML = `

        <div class="advisory-item">
            <div>
                <strong>${nearestResult.stop.name}</strong>
                — ${nearestResult.distanceKm.toFixed(2)} km away
            </div>
            <div style="margin-top:6px;">
                Transport status:
                <strong style="color:${color}">${label}</strong>
            </div>
            <div style="color:var(--muted); font-size:13px; margin-top:4px;">
                ${sufficiency.reason}
            </div>
        </div>

    `;

    renderBusList(
        document.getElementById("nearestBusStopRoutes"),
        sufficiency.buses
    );

}

function checkNearestBusStop() {

    const button =
        document.getElementById("findNearestBusBtn");

    const container =
        document.getElementById("nearestBusStopResult");

    if (button) button.disabled = true;

    if (container) {
        container.innerHTML =
            `<p class="advisory-empty">Detecting your location…</p>`;
    }

    const proceed = ({ lat, lng }) => {

        userLocation = { lat, lng };

        const nearestResult =
            findNearestBusStop(lat, lng);

        const sufficiency =
            computeStopSufficiency(nearestResult.stop, new Date());

        renderNearestBusStop(nearestResult, sufficiency);

        applyTransportLevel(
            sufficiency.level,
            `Nearest stop: ${nearestResult.stop.name} (${nearestResult.distanceKm.toFixed(1)} km)`
        );

        showToast(`Nearest bus stop: ${nearestResult.stop.name}`);

    };

    const fail = error => {

        console.error(error);

        if (container) {
            container.innerHTML =
                `<p class="advisory-empty">Could not detect your location — enable location access and try again.</p>`;
        }

    };

    const finish = () => { if (button) button.disabled = false; };

    if (userLocation) {

        proceed(userLocation);
        finish();

    }
    else {

        getGeolocationPosition()
            .then(proceed)
            .catch(fail)
            .finally(finish);

    }

}

async function fetchAmaBusStatus() {

    const badge =
        document.getElementById("amaBusLiveBadge");

    if (badge) {

        badge.style.display = "none";

    }

    if (!AMA_BUS_API_URL) {

        if (userLocation) {

            checkNearestBusStop();

        }
        else {

            const { level } =
                computeCityWideSufficiency(new Date());

            applyTransportLevel(
                level,
                "Detect your location for your nearest stop"
            );

            renderBusList(
                document.getElementById("amaBusRoutes"),
                busStops[0].buses.map(bus => ({
                    ...bus,
                    etaMinutes: nextArrivalMinutes(bus.headwayMinutes, new Date()),
                    occupancy: occupancyForDemand(
                        computeStopSufficiency(busStops[0], new Date()).demandIndex
                    )
                }))
            );

        }

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

        const liveRoutes =
            Array.isArray(data.routes) ? data.routes : [];

        const statusEl = document.getElementById("amaBusStatus");
        const detailEl = document.getElementById("amaBusStatusText");

        if (statusEl) statusEl.textContent = "Live";
        if (detailEl) detailEl.textContent = `${liveRoutes.length} routes reporting`;
        if (badge) badge.style.display = "inline-flex";

        renderBusList(
            document.getElementById("amaBusRoutes"),
            liveRoutes
        );

    } catch (error) {

        console.log(
            "Live AMA Bus fetch failed, using nearest-stop model:",
            error
        );

        if (userLocation) {
            checkNearestBusStop();
        }
        else {
            const { level } = computeCityWideSufficiency(new Date());
            applyTransportLevel(level, "Detect your location for your nearest stop");
        }

    }

}

const historicalCrowdPatterns = {

    0: {
        weekday: [0.05,0.05,0.05,0.08,0.2,0.45,0.7,0.85,0.75,0.6,0.5,0.45,0.4,0.4,0.45,0.5,0.6,0.75,0.9,0.8,0.6,0.35,0.15,0.08],
        weekend: [0.08,0.06,0.06,0.1,0.3,0.6,0.85,1.0,0.95,0.85,0.75,0.7,0.65,0.65,0.7,0.75,0.85,0.95,1.05,0.9,0.7,0.45,0.2,0.1]
    },

    1: {
        weekday: [0.05,0.05,0.05,0.1,0.3,0.6,0.85,0.95,0.8,0.65,0.55,0.5,0.45,0.45,0.5,0.55,0.65,0.8,1.0,0.85,0.6,0.35,0.15,0.08],
        weekend: [0.08,0.06,0.06,0.15,0.4,0.75,1.0,1.15,1.05,0.95,0.85,0.8,0.75,0.75,0.8,0.85,0.95,1.1,1.2,1.0,0.75,0.5,0.25,0.12]
    },

    2: {
        weekday: [0.02,0.02,0.02,0.03,0.1,0.35,0.6,0.75,0.7,0.6,0.55,0.5,0.45,0.45,0.5,0.55,0.6,0.65,0.55,0.35,0.15,0.05,0.02,0.02],
        weekend: [0.03,0.02,0.02,0.05,0.2,0.55,0.85,0.95,0.9,0.8,0.75,0.7,0.65,0.65,0.7,0.75,0.8,0.75,0.6,0.4,0.2,0.08,0.03,0.02]
    },

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
        date.getDay();

    const isWeekend =
        day === 0 || day === 6;

    const hour =
        date.getHours();

    return isWeekend
        ? pattern.weekend[hour]
        : pattern.weekday[hour];

}

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

function forecastZoneTrend(zoneId, date = new Date()) {

    const nextHourDate =
        new Date(date.getTime() + 60 * 60 * 1000);

    const currentPercent =
        Math.round(getCrowdMultiplier(zoneId, date) * 100);

    const nextPercent =
        Math.round(getCrowdMultiplier(zoneId, nextHourDate) * 100);

    const delta =
        nextPercent - currentPercent;

    const direction =
        delta >= 8 ? "RISING" :
        delta <= -8 ? "FALLING" : "STEADY";

    return {

        currentPercent,
        nextPercent,
        delta,
        direction

    };

}

function forecastUpcomingPeak(zoneId, date = new Date(), hoursAhead = 6) {

    const zone =
        zones.find(z => z.id === zoneId);

    let peak = null;

    for (let h = 1; h <= hoursAhead; h++) {

        const futureDate =
            new Date(date.getTime() + h * 60 * 60 * 1000);

        const percent =
            Math.round(getCrowdMultiplier(zoneId, futureDate) * 100);

        if (!peak || percent > peak.percent) {

            peak = {
                percent,
                hoursFromNow: h,
                time: futureDate
            };

        }

    }

    return {

        zoneName: zone ? zone.name : "Unknown zone",
        peak

    };

}

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

function crowdPercentToRisk(percent) {

    if (percent < 50) return 10;
    if (percent < 75) return 30;
    if (percent < 100) return 55;
    if (percent < 125) return 80;

    return 100;

}

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

            checkNearestBusStop();

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

    const trend =
        forecastZoneTrend(prediction.zoneId, prediction.dateUsed);

    const peak =
        forecastUpcomingPeak(prediction.zoneId, prediction.dateUsed);

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

            <p style="margin-top:6px;">
                <i class="fa-solid ${
                    trend.direction === "RISING" ? "fa-arrow-trend-up" :
                    trend.direction === "FALLING" ? "fa-arrow-trend-down" : "fa-minus"
                }"></i>
                Next hour forecast: <strong>${trend.nextPercent}%</strong>
                (${trend.direction.toLowerCase()}) ·
                Peak in next 6h: <strong>${peak.peak.percent}%</strong>
                around ${peak.peak.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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

    currentWeatherRisk =
        weatherRisk;

    currentWeatherText =
        weather;

    currentTemperatureC =
        temperature;

    currentTransportRisk =
        transportRisk;

    zones.forEach(zone => {

        zone.weatherRisk =
            weatherRisk;

        calculateRisk(zone);

    });

    renderEverything();

}

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

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}

async function fetchIncidents() {

    try {

        const response =
            await fetch(
                INCIDENT_API_URL
            );

        if (!response.ok) {

            throw new Error(
                "Bad response: " + response.status
            );

        }

        incidents =
            await response.json();

        saveData();

        renderEverything();

    } catch (error) {

        console.log(
            "Could not fetch incidents, showing last known copy",
            error
        );

    }

}

async function fetchAdvisories() {

    try {

        const response =
            await fetch(
                ADVISORY_API_URL
            );

        if (!response.ok) {

            throw new Error(
                "Bad response: " + response.status
            );

        }

        safetyAdvisories =
            await response.json();

        saveData();

        renderSafetyAdvisories();

    } catch (error) {

        console.log(
            "Could not fetch advisories, showing last known copy",
            error
        );

    }

}

async function sendSafetyAdvisory() {

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

    try {

        const response =
            await fetch(
                ADVISORY_API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-key": getAdminApiKey()
                    },
                    body: JSON.stringify({
                        message: message,
                        severity: severity
                    })
                }
            );

        if (response.status === 401) {

            showToast(
                "Invalid broadcast key — check the Advisory API Key entered at login"
            );

            return;

        }

        if (!response.ok) {

            throw new Error(
                "Bad response: " + response.status
            );

        }

        safetyAdvisories =
            await response.json();

        messageField.value =
            "";

        saveData();

        renderSafetyAdvisories();

        showToast(
            "Safety advisory sent to visitors"
        );

    } catch (error) {

        console.log(
            "Could not send advisory",
            error
        );

        showToast(
            "Could not reach the server — advisory not sent"
        );

    }

}

async function deleteSafetyAdvisory(id) {

    try {

        const response =
            await fetch(
                ADVISORY_API_URL,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-key": getAdminApiKey()
                    },
                    body: JSON.stringify({ id: id })
                }
            );

        if (response.status === 401) {

            showToast(
                "Invalid broadcast key — check the Advisory API Key entered at login"
            );

            return;

        }

        if (!response.ok) {

            throw new Error(
                "Bad response: " + response.status
            );

        }

        safetyAdvisories =
            await response.json();

        saveData();

        renderSafetyAdvisories();

        showToast(
            "Advisory removed"
        );

    } catch (error) {

        console.log(
            "Could not delete advisory",
            error
        );

        showToast(
            "Could not reach the server — advisory not removed"
        );

    }

}

/* =========================================================
   INSTANT SOS HELP
   ---------------------------------------------------------
   Floating button (under the voice assistant) that lets a
   visitor raise an emergency alert in one tap. There is no
   real dispatch link into an actual police station's own
   systems here — that would need a genuine integration (an
   SMS/WhatsApp gateway, a government emergency API, etc.)
   with real credentials this project doesn't have. Instead,
   confirming an SOS does two real things at once:
     1. Logs the alert with the visitor's live location to
        the shared backend, where it shows up instantly on
        the Admin Dashboard's "Emergency SOS Alerts" panel —
        the control room / security-post monitoring screen.
     2. Offers a one-tap call to India's unified emergency
        helpline (112), which is a real, working action.
========================================================= */

function openSosConfirm() {

    showModal(`

        <h2>
            <i class="fa-solid fa-triangle-exclamation" style="color:var(--red);"></i>
            Instant Emergency Help
        </h2>

        <p style="margin-top:12px;">
            Do you need emergency help right now? Confirming will
            alert on-site security with your current location.
        </p>

        <div style="display:flex; gap:10px; margin-top:22px;">

            <button class="secondary-btn"
                    style="flex:1;"
                    onclick="closeModal()">
                Cancel
            </button>

            <button class="danger-btn"
                    style="flex:1;"
                    onclick="confirmSosAlert()">
                <i class="fa-solid fa-bell"></i> Yes, Send SOS
            </button>

        </div>

    `);

}

async function confirmSosAlert() {

    showModal(`

        <h2>
            <i class="fa-solid fa-triangle-exclamation" style="color:var(--red);"></i>
            Sending SOS…
        </h2>

        <p style="margin-top:12px;">
            Detecting your location and alerting on-site security.
            Please stay on this page.
        </p>

    `);

    let position = null;

    try {

        position =
            await getGeolocationPosition();

    } catch (error) {

        position = null;

    }

    const payload = {
        lat: position ? position.lat : null,
        lng: position ? position.lng : null,
        accuracy: position ? position.accuracy : null,
        message: "Visitor pressed the Instant SOS Help button"
    };

    let delivered = false;

    try {

        const response =
            await fetch(
                SOS_API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

        delivered = response.ok;

        if (delivered) {

            fetchSosAlerts();

        }

    } catch (error) {

        console.log(
            "Could not send SOS alert",
            error
        );

        delivered = false;

    }

    const mapsLink =
        position
            ? `https://www.google.com/maps?q=${position.lat},${position.lng}`
            : null;

    showModal(`

        <h2>
            <i class="fa-solid fa-circle-check" style="color:var(--green);"></i>
            SOS ${delivered ? "Sent" : "Not Delivered"}
        </h2>

        <p style="margin-top:12px;">
            ${
                delivered
                    ? "On-site security has been alerted with your location."
                    : "We could not reach the server, so please call for help directly below — your report will keep retrying in the background."
            }
        </p>

        ${
            mapsLink
                ? `<p style="margin-top:8px; font-size:13px; color:var(--muted);">
                       Location shared: <a href="${mapsLink}" target="_blank" rel="noopener">
                       ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}</a>
                   </p>`
                : `<p style="margin-top:8px; font-size:13px; color:var(--muted);">
                       Your location could not be detected — please share it verbally
                       when you call.
                   </p>`
        }

        <a href="tel:${EMERGENCY_PHONE_NUMBER}"
           class="danger-btn"
           style="display:flex; align-items:center; justify-content:center; gap:8px; margin-top:18px; text-decoration:none;">
            <i class="fa-solid fa-phone"></i>
            Call Emergency Helpline (${EMERGENCY_PHONE_NUMBER})
        </a>

        <button class="secondary-btn"
                style="width:100%; margin-top:10px;"
                onclick="closeModal()">
            Close
        </button>

    `);

}

async function fetchSosAlerts() {

    try {

        const response =
            await fetch(
                SOS_API_URL
            );

        if (!response.ok) {

            throw new Error(
                "Bad response: " + response.status
            );

        }

        sosAlerts =
            await response.json();

        renderSosAlerts();

    } catch (error) {

        console.log(
            "Could not fetch SOS alerts",
            error
        );

    }

}

function renderSosAlerts() {

    const adminContainer =
        document.getElementById(
            "adminSosList"
        );

    if (!adminContainer) return;

    const openAlerts =
        sosAlerts.filter(
            alert => alert.status !== "RESOLVED"
        );

    if (sosAlerts.length === 0) {

        adminContainer.innerHTML =
            `<p class="advisory-empty">No SOS alerts yet.</p>`;

        return;

    }

    adminContainer.innerHTML =
        sosAlerts
            .map(alert => {

                const mapsLink =
                    (typeof alert.lat === "number" && typeof alert.lng === "number")
                        ? `https://www.google.com/maps?q=${alert.lat},${alert.lng}`
                        : null;

                return `

                    <div class="advisory-item severity-${alert.status === "RESOLVED" ? "low" : "critical"}">

                        <div class="advisory-top">

                            <strong>
                                ${alert.status === "RESOLVED" ? "RESOLVED" : "🚨 ACTIVE SOS"}
                            </strong>

                            <span>
                                ${new Date(alert.time).toLocaleString(
                                    [],
                                    { dateStyle: "medium", timeStyle: "short" }
                                )}
                            </span>

                        </div>

                        <p>${escapeHtml(alert.message)}</p>

                        <p style="font-size:13px;">
                            ${
                                mapsLink
                                    ? `<a href="${mapsLink}" target="_blank" rel="noopener">
                                           <i class="fa-solid fa-location-dot"></i> View location on map
                                       </a>`
                                    : "Location not available"
                            }
                        </p>

                        ${
                            alert.status !== "RESOLVED"
                                ? `<button class="resolve-btn" onclick="resolveSosAlert(${alert.id})">
                                       <i class="fa-solid fa-check"></i> Mark Resolved
                                   </button>`
                                : ""
                        }

                    </div>

                `;

            })
            .join("");

    if (
        openAlerts.length > 0 &&
        openAlerts[0].id !== lastSeenSosId
    ) {

        lastSeenSosId =
            openAlerts[0].id;

        playAdvisoryPopupSound();

    }

}

async function resolveSosAlert(id) {

    try {

        const response =
            await fetch(
                SOS_API_URL,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "x-admin-key": getAdminApiKey()
                    },
                    body: JSON.stringify({ id: id, status: "RESOLVED" })
                }
            );

        if (response.status === 401) {

            showToast(
                "Invalid admin key — check the Advisory API Key entered at login"
            );

            return;

        }

        if (!response.ok) {

            throw new Error(
                "Bad response: " + response.status
            );

        }

        sosAlerts =
            await response.json();

        renderSosAlerts();

        showToast(
            "SOS alert marked as resolved"
        );

    } catch (error) {

        console.log(
            "Could not resolve SOS alert",
            error
        );

        showToast(
            "Could not reach the server — SOS alert not updated"
        );

    }

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

    maybeShowAdvisoryPopup();

}

// Shared AudioContext used to generate the advisory popup chime.
// Created lazily (and unlocked on first user interaction, see the
// click/keydown/touchstart listeners near DOMContentLoaded) since
// browsers won't let audio play before the user has interacted
// with the page at all.
let advisoryAudioCtx = null;

function unlockAdvisoryAudio() {

    try {

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!advisoryAudioCtx) {
            advisoryAudioCtx = new AudioContextClass();
        }

        if (advisoryAudioCtx.state === "suspended") {
            advisoryAudioCtx.resume();
        }

    } catch (error) {

        console.log(
            "Could not unlock advisory audio",
            error
        );

    }

}

// Plays a short two-note "ding-dong" style chime — synthesized with
// the Web Audio API so no external sound file is needed and it
// still works offline.
function playAdvisoryPopupSound() {

    try {

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!advisoryAudioCtx) {
            advisoryAudioCtx = new AudioContextClass();
        }

        if (advisoryAudioCtx.state === "suspended") {
            advisoryAudioCtx.resume();
        }

        const now =
            advisoryAudioCtx.currentTime;

        const notes = [
            { freq: 880, start: 0, duration: 0.18 },
            { freq: 660, start: 0.16, duration: 0.3 }
        ];

        notes.forEach(note => {

            const oscillator =
                advisoryAudioCtx.createOscillator();

            const gain =
                advisoryAudioCtx.createGain();

            oscillator.type = "sine";

            oscillator.frequency.setValueAtTime(
                note.freq,
                now + note.start
            );

            gain.gain.setValueAtTime(
                0,
                now + note.start
            );

            gain.gain.linearRampToValueAtTime(
                0.35,
                now + note.start + 0.02
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                now + note.start + note.duration
            );

            oscillator.connect(gain);
            gain.connect(advisoryAudioCtx.destination);

            oscillator.start(now + note.start);
            oscillator.stop(now + note.start + note.duration + 0.05);

        });

    } catch (error) {

        console.log(
            "Could not play advisory popup sound",
            error
        );

    }

}

function maybeShowAdvisoryPopup() {

    if (safetyAdvisories.length === 0) return;

    const latest =
        safetyAdvisories[0];

    if (latest.id === lastPoppedAdvisoryId) return;

    lastPoppedAdvisoryId =
        latest.id;

    saveData();

    playAdvisoryPopupSound();

    showModal(`

        <h2>
            ⚠ Safety Advisory
        </h2>

        <div class="advisory-item severity-${latest.severity.toLowerCase()}" style="margin-top:15px;">

            <div class="advisory-top">

                <strong>
                    ${latest.severity}
                </strong>

                <span>
                    ${new Date(latest.time).toLocaleString(
                        [],
                        { dateStyle: "medium", timeStyle: "short" }
                    )}
                </span>

            </div>

            <p>${escapeHtml(latest.message)}</p>

        </div>

    `);

}

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

    if (message) {
        message.textContent =
            "Detecting your location...";
    }

    if (result) {
        result.innerHTML = "";
    }

    if (button) {

        button.disabled = true;

    }

    getGeolocationPosition()
        .then(({ lat, lng, isFallback, isDefault }) => {

            if (message) {
                message.textContent = isDefault
                    ? "Default Bhubaneswar location loaded."
                    : isFallback
                    ? "Location detected via network connection."
                    : "Location detected successfully.";
            }

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

            if (result) {
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
            }

            evaluateGeofences(lat, lng);

            checkNearestBusStop();

            renderLiveSafetyStatus(lat, lng);

            if (escapeMap) {
                updateRealUserMarker();
                renderEscapeMap();
            }

            showToast("Location updated successfully");

        })
        .catch(error => {

            console.error(error);

            if (message) {
                message.textContent =
                    "Could not detect your location.";
            }

            if (result) {
                result.innerHTML = `

                    <p>
                        ${error.message}
                    </p>

                `;
            }

        })
        .finally(() => {

            if (button) {

                button.disabled = false;

            }

        });

}

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

function isInsideGeofence(lat, lng, zone, radiusMultiplier = 1) {

    const radiusMeters =
        (zone.radius || 75) * radiusMultiplier;

    const distanceMeters =
        calculateDistance(lat, lng, zone.lat, zone.lng) * 1000;

    return distanceMeters <= radiusMeters;

}

function getActiveGeofences(lat, lng, radiusMultiplier = 1) {

    return zones.filter(
        zone => isInsideGeofence(lat, lng, zone, radiusMultiplier)
    );

}

function logGeofenceEvent(zone, type) {

    geofenceEvents.unshift({

        zoneId: zone.id,
        zoneName: zone.name,
        status: zone.status,
        type: type,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })

    });

    geofenceEvents =
        geofenceEvents.slice(0, 30);

    renderGeofenceEventLog();

}

function evaluateGeofences(lat, lng, options = {}) {

    const {
        accuracy = null,
        requireConfirmation = false
    } = options;

    if (requireConfirmation) {
        lastGeofenceAccuracy = accuracy;
    }

    // A live fix that's too imprecise to trust against zone radii
    // this small (60-120m) is skipped entirely for this tick rather
    // than risking a false ENTER/EXIT. Only applies to the live
    // watchPosition loop — a deliberate one-off "Detect My Location"
    // check is evaluated immediately regardless of accuracy.
    if (
        requireConfirmation &&
        typeof accuracy === "number" &&
        accuracy > GEOFENCE_MAX_ACCURACY_METERS
    ) {

        console.log(
            "Skipping geofence check — low-accuracy fix (" +
            Math.round(accuracy) + "m, need " +
            GEOFENCE_MAX_ACCURACY_METERS + "m or better)"
        );

        renderGeofenceStatus(
            zones.filter(zone => activeGeofenceZoneIds.has(zone.id))
        );

        return;

    }

    // Candidates at each zone's normal radius — a fresh ENTER (or an
    // immediate, non-live evaluation) is decided against this.
    const candidateZones =
        getActiveGeofences(lat, lng, 1);

    const candidateIds =
        new Set(candidateZones.map(zone => zone.id));

    let nowInsideIds;
    let nowInside;

    if (requireConfirmation) {

        // --- Hysteresis + dwell confirmation (live monitoring) ---

        nowInsideIds =
            new Set(activeGeofenceZoneIds);

        // A brand-new zone only counts as entered once it's shown up
        // as a candidate GEOFENCE_ENTER_CONFIRMATIONS_REQUIRED times
        // in a row — a single noisy fix can't trigger an alert.
        candidateZones.forEach(zone => {

            if (activeGeofenceZoneIds.has(zone.id)) {
                pendingGeofenceEnterCounts.delete(zone.id);
                return;
            }

            const count =
                (pendingGeofenceEnterCounts.get(zone.id) || 0) + 1;

            if (count >= GEOFENCE_ENTER_CONFIRMATIONS_REQUIRED) {

                pendingGeofenceEnterCounts.delete(zone.id);
                nowInsideIds.add(zone.id);

            } else {

                pendingGeofenceEnterCounts.set(zone.id, count);

            }

        });

        // Reset the dwell counter for anything that isn't even a
        // candidate anymore (i.e. fully outside its normal radius).
        pendingGeofenceEnterCounts.forEach((count, zoneId) => {
            if (!candidateIds.has(zoneId)) {
                pendingGeofenceEnterCounts.delete(zoneId);
            }
        });

        // Only exit a zone you're already inside once you've crossed
        // its larger exit-buffer radius, so a fix jittering right on
        // the boundary doesn't flap ENTER/EXIT back and forth.
        activeGeofenceZoneIds.forEach(zoneId => {

            const zone =
                zones.find(z => z.id === zoneId);

            if (!zone) {
                nowInsideIds.delete(zoneId);
                return;
            }

            const stillInside =
                isInsideGeofence(
                    lat, lng, zone, GEOFENCE_EXIT_BUFFER_RATIO
                );

            if (!stillInside) {
                nowInsideIds.delete(zoneId);
            }

        });

        nowInside =
            zones.filter(zone => nowInsideIds.has(zone.id));

    } else {

        // --- Immediate evaluation (manual "Detect My Location") ---

        nowInside = candidateZones;
        nowInsideIds = candidateIds;

    }

    nowInside.forEach(zone => {

        if (!activeGeofenceZoneIds.has(zone.id)) {

            logGeofenceEvent(zone, "ENTER");

            onGeofenceEnter(zone);

        } else if (activeGeofenceZoneStatus.get(zone.id) !== zone.status) {

            // Risk level changed while the visitor is still standing
            // inside the zone — re-alert instead of staying silent
            // until they eventually leave.
            onGeofenceStatusChange(zone);

        }

        activeGeofenceZoneStatus.set(zone.id, zone.status);

    });

    activeGeofenceZoneIds.forEach(zoneId => {

        if (!nowInsideIds.has(zoneId)) {

            const zone =
                zones.find(z => z.id === zoneId);

            if (zone) {

                logGeofenceEvent(zone, "EXIT");

                onGeofenceExit(zone);

            }

            activeGeofenceZoneStatus.delete(zoneId);

        }

    });

    activeGeofenceZoneIds = nowInsideIds;

    renderGeofenceStatus(nowInside);

    lastLiveSafetyFixAt = Date.now();

    renderLiveSafetyStatus(lat, lng);

    saveData();

}

function buildZoneTrendLine(zone) {

    const trend =
        forecastZoneTrend(zone.id);

    return trend.direction === "RISING"
        ? `Crowd here is trending up — predicted ${trend.nextPercent}% within the hour.`
        : trend.direction === "FALLING"
        ? `Crowd here is trending down — predicted ${trend.nextPercent}% within the hour.`
        : `Crowd here is expected to stay steady over the next hour.`;

}

function showZoneRiskModal(zone, headline) {

    showModal(`

        <h2 style="color:${getRiskColor(zone.status)}">
            ${headline}
        </h2>

        <p style="margin-top:15px">
            <strong>${zone.name}</strong> is currently
            <strong style="color:${getRiskColor(zone.status)}">${zone.status}</strong>.
        </p>

        <p style="margin-top:10px">
            ${buildZoneTrendLine(zone)}
        </p>

        <p style="margin-top:10px">
            Please follow staff instructions and consider
            an alternate route if the area feels overcrowded.
        </p>

    `);

}

function onGeofenceEnter(zone) {

    if (zone.status === "DANGER" || zone.status === "WARNING") {

        showZoneRiskModal(
            zone,
            zone.status === "DANGER"
                ? "⚠ Entered a Danger Zone"
                : "⚠ Entered a Caution Zone"
        );

    }
    else {

        showToast(`Entered ${zone.name} — currently SAFE`);

    }

}

function onGeofenceStatusChange(zone) {

    if (zone.status === "DANGER" || zone.status === "WARNING") {

        showZoneRiskModal(
            zone,
            zone.status === "DANGER"
                ? "⚠ Risk Increased — Now a Danger Zone"
                : "⚠ Risk Increased — Now a Caution Zone"
        );

    }
    else {

        showToast(`${zone.name} is now SAFE`);

    }

}

function onGeofenceExit(zone) {

    showToast(`Left ${zone.name}`);

}

function renderGeofenceStatus(activeZones) {

    const el =
        document.getElementById("geofenceStatus");

    if (!el) return;

    const monitoringLine =
        geofenceMonitoringActive
            ? `<span style="color:#16a34a"><i class="fa-solid fa-satellite-dish"></i> Live geofence monitoring ON</span>`
            : `<span style="color:var(--muted)"><i class="fa-solid fa-satellite-dish"></i> Live geofence monitoring off</span>`;

    const zonesLine =
        activeZones.length > 0
            ? activeZones.map(zone => `
                <span style="color:${getRiskColor(zone.status)}; font-weight:600;">
                    <i class="fa-solid fa-draw-polygon"></i> Inside ${zone.name} (${zone.status})
                </span>
              `).join("<br>")
            : `<span style="color:var(--muted)">Not currently inside any zone geofence</span>`;

    const accuracyLine =
        geofenceMonitoringActive && typeof lastGeofenceAccuracy === "number"
            ? lastGeofenceAccuracy > GEOFENCE_MAX_ACCURACY_METERS
                ? `<br><span style="color:#d97706">GPS accuracy ±${Math.round(lastGeofenceAccuracy)}m — too low to trust, waiting for a better fix</span>`
                : `<br><span style="color:var(--muted)">GPS accuracy ±${Math.round(lastGeofenceAccuracy)}m</span>`
            : "";

    el.innerHTML = `
        <div style="margin-top:8px; font-size:13px; line-height:1.7;">
            ${monitoringLine}<br>
            ${zonesLine}
            ${accuracyLine}
        </div>
    `;

}

function setLiveSafetyIndicator(active) {

    const el = document.getElementById("liveSafetyIndicator");

    if (!el) return;

    el.classList.toggle("active", active);

    el.innerHTML =
        `<span class="live-dot"></span> ${active ? "LIVE TRACKING ON" : "LIVE TRACKING OFF"}`;

}

function getLiveSafetyPlaces() {

    const now = new Date();

    return popularPlaces.map(place => {

        const liveZone =
            zones.find(zone => zone.name === place.name);

        if (liveZone) {

            return {
                name: liveZone.name,
                lat: liveZone.lat,
                lng: liveZone.lng,
                status: liveZone.status,
                features: liveZone.features
            };

        }

        const { status } =
            computeHistoricCrowdEstimate(place, now);

        return {
            name: place.name,
            lat: place.lat,
            lng: place.lng,
            status: status,
            features: place.features
        };

    });

}

function findNearestLiveSafetyPlace(lat, lng) {

    const places =
        getLiveSafetyPlaces();

    let nearest =
        places[0];

    let smallestDistance =
        Infinity;

    places.forEach(place => {

        const distance =
            calculateDistance(lat, lng, place.lat, place.lng);

        if (distance < smallestDistance) {

            smallestDistance = distance;
            nearest = place;

        }

    });

    return nearest;

}

function renderLiveSafetyStatus(lat, lng) {

    const card =
        document.getElementById("liveSafetyCard");

    if (!card) return;

    zones.forEach(
        zone => calculateRisk(zone)
    );

    const livePlaces =
        getLiveSafetyPlaces();

    const nearest =
        (typeof lat === "number" && typeof lng === "number")
            ? findNearestLiveSafetyPlace(lat, lng)
            : null;

    const highRisk =
        livePlaces.some(place => place.status === "DANGER");

    const mediumRisk =
        livePlaces.some(place => place.status === "WARNING");

    const overall =
        highRisk
            ? { label: "HIGH RISK NEARBY", bg: "#fee2e2", color: "#dc2626" }
            : mediumRisk
            ? { label: "CAUTION ADVISED", bg: "#fef3c7", color: "#a16207" }
            : { label: "ALL ZONES SAFE", bg: "#dcfce7", color: "#16a34a" };

    const overallPill =
        document.getElementById("liveSafetyOverallPill");

    if (overallPill) {

        overallPill.textContent = overall.label;
        overallPill.style.background = overall.bg;
        overallPill.style.color = overall.color;

    }

    const nearestEl =
        document.getElementById("liveSafetyNearestZone");

    if (nearestEl) {

        nearestEl.innerHTML =
            nearest
                ? `You're closest to <strong>${nearest.name}</strong> — currently
                   <strong style="color:${getRiskColor(nearest.status)}">${nearest.status}</strong>`
                : `Tap "Detect My Location" or "Check My Safety" to see your nearest place.`;

    }

    const nearestFeaturesEl =
        document.getElementById("liveSafetyNearestFeatures");

    if (nearestFeaturesEl) {

        nearestFeaturesEl.innerHTML =
            (nearest && nearest.features && nearest.features.length)
                ? `
                    <span class="feature-tags-label">Safety features here:</span>
                    <div class="feature-tags">
                        ${nearest.features.map(feature => `
                            <span class="feature-tag">
                                <i class="fa-solid fa-circle-check"></i> ${feature}
                            </span>
                        `).join("")}
                    </div>
                  `
                : "";

    }

    const chipsEl =
        document.getElementById("liveSafetyZoneChips");

    if (chipsEl) {

        chipsEl.innerHTML =
            livePlaces.map(place => `
                <span class="zone-status ${place.status.toLowerCase()}"
                      title="${place.features && place.features.length
                          ? "Safety features: " + place.features.join(", ")
                          : ""}">
                    ${place.name}: ${place.status}
                </span>
            `).join("");

    }

    const timeEl =
        document.getElementById("liveSafetyUpdatedAt");

    if (timeEl) {

        timeEl.textContent =
            lastLiveSafetyFixAt
                ? `Updated ${new Date(lastLiveSafetyFixAt).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit", second:"2-digit"})}`
                : "Waiting for your location...";

    }

}

function renderGeofenceEventLog() {

    const container =
        document.getElementById("geofenceEventLog");

    if (!container) return;

    if (geofenceEvents.length === 0) {

        container.innerHTML = `
            <p class="advisory-empty">
                No geofence activity yet — detect a location or
                enable live monitoring above.
            </p>
        `;

        return;

    }

    container.innerHTML =
        geofenceEvents.map(event => `

            <div class="advisory-item">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong>
                        ${event.type === "ENTER" ? "→ Entered" : "← Left"}
                        ${event.zoneName}
                    </strong>
                    <span style="color:${getRiskColor(event.status)}; font-weight:700;">
                        ${event.status}
                    </span>
                </div>
                <p style="margin-top:4px; color:var(--muted); font-size:13px;">
                    ${event.time}
                </p>
            </div>

        `).join("");

}

function startGeofenceMonitoring(options = {}) {

    const { silent = false } = options;

    const button =
        document.getElementById("geofenceToggleBtn");

    if (geofenceMonitoringActive) {

        return true;

    }

    if (!("geolocation" in navigator)) {

        showToast("Geolocation is not supported by this browser.");

        return false;

    }

    geofenceMonitoringActive = true;

    if (button) {

        button.innerHTML =
            `<i class="fa-solid fa-satellite-dish"></i> <span>Disable Live Geofence Alerts</span>`;

    }

    if (!silent) {

        showToast("Live geofence monitoring started");

    }

    setLiveSafetyIndicator(true);

    geofenceWatchId =
        navigator.geolocation.watchPosition(

            position => {

                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                userLocation = { lat, lng };

                evaluateGeofences(lat, lng, {
                    accuracy: position.coords.accuracy,
                    requireConfirmation: true
                });

            },

            error => {

                console.warn("Live location watch paused:", error);

            },

            {
                // Zone radii are as small as 60-120m, so we ask for
                // GPS-grade accuracy rather than the coarser
                // network-based fix — the accuracy gate in
                // evaluateGeofences() will simply skip any tick that
                // still comes back too imprecise to trust.
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 15000
            }

        );

    if (liveSafetyRefreshInterval === null) {

        liveSafetyRefreshInterval =
            window.setInterval(
                () => {
                    if (userLocation) {
                        renderLiveSafetyStatus(userLocation.lat, userLocation.lng);
                    }
                },
                15000
            );

    }

    return true;

}

function stopGeofenceMonitoring(options = {}) {

    const { silent = false } = options;

    const button =
        document.getElementById("geofenceToggleBtn");

    if (geofenceWatchId !== null) {

        navigator.geolocation.clearWatch(geofenceWatchId);

        geofenceWatchId = null;

    }

    if (liveSafetyRefreshInterval !== null) {

        window.clearInterval(liveSafetyRefreshInterval);

        liveSafetyRefreshInterval = null;

    }

    geofenceMonitoringActive = false;

    activeGeofenceZoneIds = new Set();

    pendingGeofenceEnterCounts = new Map();

    activeGeofenceZoneStatus = new Map();

    lastGeofenceAccuracy = null;

    if (button) {

        button.innerHTML =
            `<i class="fa-solid fa-satellite-dish"></i> <span>Enable Live Geofence Alerts</span>`;

    }

    renderGeofenceStatus([]);

    setLiveSafetyIndicator(false);

    if (!silent) {

        showToast("Live geofence monitoring stopped");

    }

}

function toggleGeofenceMonitoring() {

    if (geofenceMonitoringActive) {

        stopGeofenceMonitoring();

    }
    else {

        startGeofenceMonitoring();

    }

}

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

function findNearestEscapeRoute() {

    scrollToSection(
        "escapeMapSection"
    );

    initEscapeMap();

    if (!userLocation) {

        locateOnEscapeMap();

        return;
    }

    lastRealEscapeRoute = null;

    renderEscapeMap();
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


/* =========================================================
   REAL BHUBANESWAR ESCAPE MAP
   ========================================================= */

let escapeMap = null;
let escapeUserMarker = null;
let escapeDestinationMarker = null;
let escapeRouteLine = null;
let lastRealEscapeRoute = null;
let escapeRouteRequestId = 0;
let escapeLocationWatchId = null;
let escapeLocationStarted = false;
let escapeLocationPermissionHandled = false;
let escapeTiles = null;

const BHUBANESWAR_CENTER = [20.2961, 85.8245];

const TILE_URL =
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const TILE_SUBDOMAINS = "abc";

const MAX_MAP_ZOOM = 19;

const TILE_ATTRIBUTION =
    'Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';

const OFFLINE_TILE_FALLBACK =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">' +
        '<rect width="256" height="256" fill="#0b0d10"/></svg>'
    );


function isEscapeDarkTheme() {
    return document.body.classList.contains("dark-theme");
}


function addEscapeBaseLayers() {

    if (!escapeMap) return;

    escapeTiles =
        L.tileLayer(
            TILE_URL,
            {
                maxZoom: MAX_MAP_ZOOM,
                subdomains: TILE_SUBDOMAINS,
                detectRetina: true,
                errorTileUrl: OFFLINE_TILE_FALLBACK,
                attribution: TILE_ATTRIBUTION
            }
        )
        .addTo(escapeMap);

    updateEscapeMapTheme();
}


function updateEscapeMapTheme() {

    if (!escapeMap) return;

    window.setTimeout(
        () => escapeMap && escapeMap.invalidateSize(),
        50
    );
}


function initEscapeMap() {

    const container =
        document.getElementById("escapeMapContainer");

    if (!container) return null;

    if (typeof L === "undefined") {

        container.innerHTML = `
            <div class="escape-map-error">
                <strong>Map library could not be loaded.</strong>
                <span>Please check your internet connection and refresh.</span>
            </div>
        `;

        return null;
    }

    if (escapeMap) {

        updateEscapeMapTheme();

        window.setTimeout(
            () => escapeMap.invalidateSize(),
            50
        );

        return escapeMap;
    }

    escapeMap =
        L.map(
            "escapeMapContainer",
            {
                zoomControl: true,
                minZoom: 2,
                maxZoom: MAX_MAP_ZOOM,
                preferCanvas: true
            }
        )
        .setView(
            BHUBANESWAR_CENTER,
            13
        );

    addEscapeBaseLayers();

    escapeMap.on("zoomend", updateEscapeLabelDensity);
    updateEscapeLabelDensity();

    window.setTimeout(
        () => escapeMap.invalidateSize(),
        100
    );

    return escapeMap;
}

function updateEscapeLabelDensity() {

    if (!escapeMap) return;

    const container = escapeMap.getContainer();

    if (escapeMap.getZoom() < 14) {
        container.classList.add("safeyatri-labels-collapsed");
    } else {
        container.classList.remove("safeyatri-labels-collapsed");
    }
}


function makeUserIcon() {

    return L.divIcon({
        className: "",
        html:
            '<div class="safeyatri-user-marker"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
}


function makeZoneIcon(status) {

    const color =
        status === "DANGER"
            ? "#dc2626"
            : status === "WARNING"
                ? "#f59e0b"
                : "#16a34a";

    return L.divIcon({
        className: "",
        html:
            `<div class="safeyatri-zone-marker"
                  style="background:${color};"></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
    });
}


function makeFacilityIcon(facility) {

    return L.divIcon({
        className: "",
        html:
            `<div class="safeyatri-facility-marker">${facility.icon || "📍"}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });
}


function bindEscapeMarkerLabel(marker, text, offsetY) {

    marker.unbindTooltip();
    marker.bindTooltip(
        text,
        {
            permanent: true,
            direction: "top",
            offset: [0, offsetY || -15],
            className: "safeyatri-marker-label",
            opacity: 1
        }
    );
}


function updateRealUserMarker() {

    if (!escapeMap || !userLocation) {
        return;
    }

    const latLng = [
        userLocation.lat,
        userLocation.lng
    ];

    if (!escapeUserMarker) {

        escapeUserMarker =
            L.marker(
                latLng,
                {
                    icon: makeUserIcon(),
                    zIndexOffset: 3000,
                    keyboard: false
                }
            )
            .addTo(escapeMap);

    } else {

        escapeUserMarker.setLatLng(latLng);
    }

    const accuracy =
        Number(userLocation.accuracy || 0);

    const accuracyText =
        accuracy > 0
            ? `<br>Accuracy: ${Math.round(accuracy)} m`
            : "";

    const label =
        `📍 YOU ARE HERE · ${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`;

    escapeUserMarker.unbindTooltip();
    escapeUserMarker.bindTooltip(
        `
            <div class="safeyatri-user-label">
                <strong>📍 YOU ARE HERE</strong>
                <span>${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}</span>
            </div>
        `,
        {
            permanent: true,
            direction: "top",
            offset: [0, -10],
            className: "safeyatri-user-tooltip",
            opacity: 1
        }
    ).openTooltip();

    escapeUserMarker.bindPopup(`
        <div class="safeyatri-location-card">
            <strong>${label}</strong>
            <br>
            Latitude: ${userLocation.lat.toFixed(6)}
            <br>
            Longitude: ${userLocation.lng.toFixed(6)}
            ${accuracyText}
        </div>
    `);

    escapeUserMarker.setZIndexOffset(3000);
}

function renderRealSafetyZones() {

    if (!escapeMap) return;

    zones.forEach(zone => {

        if (
            typeof zone.lat !== "number" ||
            typeof zone.lng !== "number"
        ) return;

        if (zone._leafletMarker) {

            zone._leafletMarker.setLatLng(
                [zone.lat, zone.lng]
            );

            zone._leafletMarker.setIcon(
                makeZoneIcon(zone.status)
            );

            return;
        }

        const marker =
            L.marker(
                [zone.lat, zone.lng],
                {
                    icon: makeZoneIcon(zone.status),
                    zIndexOffset: 1000
                }
            )
            .addTo(escapeMap);

        const occupancy =
            zone.capacity > 0
                ? Math.round(
                    (zone.people / zone.capacity) * 100
                )
                : 0;

        marker.bindPopup(`
            <div class="safeyatri-location-card">
                <strong>
                    ${zone.icon || "📍"}
                    ${zone.name}
                </strong>
                <br><br>
                Status:
                <strong>${zone.status}</strong>
                <br>
                Occupancy:
                ${occupancy}%
            </div>
        `);

        bindEscapeMarkerLabel(
            marker,
            `${zone.icon || "📍"} ${zone.name}`,
            -15
        );

        Object.defineProperty(zone, "_leafletMarker", {
            value: marker,
            enumerable: false,
            configurable: true,
            writable: true
        });
    });
}


function renderRealFacilities() {

    if (!escapeMap) return;

    facilities.forEach(facility => {

        if (
            typeof facility.lat !== "number" ||
            typeof facility.lng !== "number"
        ) return;

        if (facility._leafletMarker) return;

        const marker =
            L.marker(
                [facility.lat, facility.lng],
                {
                    icon: makeFacilityIcon(facility),
                    zIndexOffset: 800
                }
            )
            .addTo(escapeMap);

        marker.bindPopup(`
            <div class="safeyatri-location-card">
                <strong>
                    ${facility.icon || "📍"}
                    ${facility.type}
                </strong>
                <br>
                ${facility.name || ""}
            </div>
        `);

        bindEscapeMarkerLabel(
            marker,
            `${facility.icon || "📍"} ${facility.type}`,
            -16
        );

        Object.defineProperty(facility, "_leafletMarker", {
            value: marker,
            enumerable: false,
            configurable: true,
            writable: true
        });
    });
}


async function requestRealWalkingRoute(
    start,
    destination
) {

    const requestId =
        ++escapeRouteRequestId;

    const url =
        "https://routing.openstreetmap.de/" +
        "routed-foot/route/v1/driving/" +
        `${start.lng},${start.lat};` +
        `${destination.lng},${destination.lat}` +
        "?overview=full&geometries=geojson&steps=true";

    const response =
        await fetch(
            url,
            {
                headers: {
                    "Accept":
                        "application/json"
                }
            }
        );

    if (!response.ok) {

        throw new Error(
            "Routing service HTTP " +
            response.status
        );
    }

    const data =
        await response.json();

    if (
        requestId !==
        escapeRouteRequestId
    ) {

        throw new Error(
            "Route request superseded."
        );
    }

    if (
        data.code !== "Ok" ||
        !data.routes ||
        !data.routes.length
    ) {

        throw new Error(
            "No walking route was found."
        );
    }

    return data.routes[0];
}


function clearRealEscapeRoute() {

    if (
        escapeRouteLine &&
        escapeMap
    ) {

        escapeMap.removeLayer(
            escapeRouteLine
        );
    }

    escapeRouteLine = null;

    if (
        escapeDestinationMarker &&
        escapeMap
    ) {

        escapeMap.removeLayer(
            escapeDestinationMarker
        );
    }

    escapeDestinationMarker = null;
}


function drawRealEscapeRoute(
    route,
    target
) {

    if (
        !escapeMap ||
        !route ||
        !route.geometry
    ) return;

    clearRealEscapeRoute();

    escapeRouteLine =
        L.geoJSON(
            route.geometry,
            {
                style: {
                    color: "#2563eb",
                    weight: 7,
                    opacity: 0.92,
                    lineCap: "round",
                    lineJoin: "round"
                }
            }
        )
        .addTo(escapeMap);

    escapeDestinationMarker =
        L.marker(
            [target.lat, target.lng],
            {
                icon: makeZoneIcon("SAFE"),
                zIndexOffset: 1500
            }
        )
        .addTo(escapeMap);

    escapeDestinationMarker.bindPopup(`
        <div class="safeyatri-location-card">
            <strong>🛡️ ESCAPE DESTINATION</strong>
            <br>
            ${target.name}
        </div>
    `);

    bindEscapeMarkerLabel(
        escapeDestinationMarker,
        `🛡️ ${target.name}`,
        -15
    );

    escapeMap.fitBounds(
        escapeRouteLine.getBounds(),
        {
            padding: [35, 35],
            maxZoom: 16
        }
    );
}


async function renderEscapeMap() {

    const map =
        initEscapeMap();

    if (!map) return;

    updateRealUserMarker();
    renderRealSafetyZones();
    renderRealFacilities();

    if (!userLocation) {

        const summary =
            document.getElementById(
                "escapeRouteSummary"
            );

        if (summary) {

            summary.innerHTML = `
                <p>
                    📍 Tap
                    <strong>Locate My Position</strong>
                    to show your real GPS location
                    and calculate a real walking route.
                </p>
            `;
        }

        return;
    }

    const target =
        nearestEscapeZone();

    if (!target) {

        renderEscapeRouteSummary();
        return;
    }

    const summary =
        document.getElementById(
            "escapeRouteSummary"
        );

    if (summary) {

        summary.innerHTML = `
            <p>
                🛰️ Location found.
                Calculating the real road route...
            </p>
        `;
    }

    try {

        const route =
            await requestRealWalkingRoute(
                userLocation,
                target
            );

        lastRealEscapeRoute = {
            route,
            target
        };

        drawRealEscapeRoute(
            route,
            target
        );

        renderEscapeRouteSummary();

    } catch (error) {

        console.error(
            "Real escape route error:",
            error
        );

        if (summary) {

            summary.innerHTML = `
                <p style="color:#f87171;">
                    ⚠️ Could not calculate the
                    real walking route right now.
                    Check your internet connection
                    and try again.
                </p>
            `;
        }
    }
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
                📍 Tap
                <strong>Locate My Position</strong>
                to show where you are on the
                Bhubaneswar map.
            </p>
        `;

        return;
    }

    if (!lastRealEscapeRoute) {

        summary.innerHTML = `
            <p>
                🛰️ GPS location detected.
                Calculating real walking route...
            </p>
        `;

        return;
    }

    const {
        route,
        target
    } = lastRealEscapeRoute;

    const km =
        Number(route.distance || 0) / 1000;

    const minutes =
        Math.max(
            1,
            Math.round(
                Number(route.duration || 0) / 60
            )
        );

    summary.innerHTML = `
        <strong>🛣️ REAL ESCAPE ROUTE</strong>

        <p style="margin-top:6px">
            From your current GPS position to
            <strong>${target.name}</strong>.
        </p>

        <p style="margin-top:6px">
            📏 Road distance:
            <strong>${km.toFixed(2)} km</strong>
            <br>
            🚶 Estimated walking time:
            <strong>${minutes} min</strong>
        </p>

        <p style="
            margin-top:8px;
            color:#60a5fa;
            font-size:12px;
        ">
            The blue line follows the mapped
            road/walking network.
        </p>
    `;
}


function handleEscapeLocationSuccess(position, showToastMessage = true) {

    userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy || 0
    };

    lastRealEscapeRoute = null;
    clearRealEscapeRoute();
    refreshIncidentLocationStatus();

    const map = initEscapeMap();

    if (!map) return;

    updateRealUserMarker();

    map.setView(
        [userLocation.lat, userLocation.lng],
        Math.max(map.getZoom(), 14),
        { animate: true }
    );

    renderEscapeMap();

    if (showToastMessage) {
        showToast("Your location has been detected.");
    }
}


function startAutomaticEscapeLocation() {

    if (escapeLocationStarted) return;

    escapeLocationStarted = true;

    initEscapeMap();

    const summary =
        document.getElementById("escapeRouteSummary");

    if (summary && !userLocation) {
        summary.innerHTML = `
            <p>
                📡 Detecting your location automatically...
                Please allow location access if the browser asks.
            </p>
        `;
    }

    getGeolocationPosition().then(pos => {
        escapeLocationPermissionHandled = true;
        handleEscapeLocationSuccess({
            coords: {
                latitude: pos.lat,
                longitude: pos.lng,
                accuracy: pos.accuracy || 0
            }
        }, false);
    });

}


function locateOnEscapeMap() {

    const summary =
        document.getElementById("escapeRouteSummary");

    const button =
        document.querySelector(
            '[onclick="locateOnEscapeMap()"]'
        );

    if (summary) {
        summary.innerHTML = `
            <p>
                📡 Getting your GPS location...
                Please press <strong>Allow</strong> if asked.
            </p>
        `;
    }

    if (button) {
        button.disabled = true;
        button.style.opacity = "0.65";
    }

    getGeolocationPosition()
        .then(pos => {
            escapeLocationPermissionHandled = true;
            handleEscapeLocationSuccess({
                coords: {
                    latitude: pos.lat,
                    longitude: pos.lng,
                    accuracy: pos.accuracy || 0
                }
            }, true);
        })
        .catch(err => {
            console.error("Location detection error:", err);
            if (summary) {
                summary.innerHTML = `
                    <p style="color:#f87171;">
                        📍 ${err.message}
                    </p>
                `;
            }
        })
        .finally(() => {
            if (button) {
                button.disabled = false;
                button.style.opacity = "1";
            }
        });
}

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