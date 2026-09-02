/*
 * Safe Yatri AI — "Ask Safe Yatri" voice assistant
 * -------------------------------------------------
 * A small, fully client-side (no API key, works offline) helper that:
 *
 *   1. Explains what each feature on the site does, by voice or text,
 *      in English, Hindi, Bengali, Tamil or Odia.
 *   2. Lets the visitor jump straight to (and, for safe/read-only
 *      actions, run) that feature once they say they want to use it.
 *
 * It relies only on the standard Web Speech APIs (SpeechRecognition
 * for listening, SpeechSynthesis for replying) plus the page's own
 * functions (checkMySafety, getUserLocation, etc. from script.js).
 * Nothing here calls a server, so it keeps working even offline —
 * it just won't be able to *listen* without a network-backed STT
 * engine on some browsers (typing always still works).
 */

(function () {

    "use strict";

    /* ---------------------------------------------------------
       1. LANGUAGE + SPEECH LOCALE MAPPING
    --------------------------------------------------------- */

    const SPEECH_LOCALE = {
        en: "en-IN",
        hi: "hi-IN",
        bn: "bn-IN",
        ta: "ta-IN",
        or: "or-IN"
    };

    /* ---------------------------------------------------------
       2. UI STRINGS
    --------------------------------------------------------- */

    const VA_STRINGS = {

        en: {
            title: "Safe Yatri Assistant",
            placeholder: "Ask about a feature...",
            greeting:
                "Hi! I'm the Safe Yatri assistant. Ask me about any feature — like \"crowd levels\" or \"report an incident\" — and I'll explain it and take you there.",
            help:
                "Here's what I can help with. Tap any of these, or type / speak your question:",
            notUnderstood:
                "I didn't quite catch a feature in that. Try asking about safety, crowd levels, weather, your location, facilities, reporting an incident, or the escape route.",
            listening: "Listening...",
            micUnsupported:
                "Voice input isn't supported in this browser — you can still type your question below.",
            micPermissionDenied:
                "Microphone access is blocked for this site — allow it in your browser's site settings, or type your question below.",
            openLabel: "Open",
            takingThere: "Opening it for you now.",
            langChanged: "Assistant language set to English.",
            muteOn: "Voice replies muted.",
            muteOff: "Voice replies on."
        },

        hi: {
            title: "सेफ यात्री सहायक",
            placeholder: "किसी फ़ीचर के बारे में पूछें...",
            greeting:
                "नमस्ते! मैं सेफ यात्री सहायक हूं। मुझसे किसी भी फ़ीचर के बारे में पूछें — जैसे \"भीड़ की स्थिति\" या \"घटना दर्ज करें\" — मैं आपको समझाऊंगा और वहां ले जाऊंगा।",
            help:
                "मैं इनमें मदद कर सकता हूं। किसी पर टैप करें, या अपना सवाल टाइप/बोलें:",
            notUnderstood:
                "मुझे उसमें कोई फ़ीचर नहीं मिला। सुरक्षा, भीड़, मौसम, स्थान, सुविधाओं, घटना रिपोर्ट या निकास मार्ग के बारे में पूछ कर देखें।",
            listening: "सुन रहा हूं...",
            micUnsupported:
                "इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है — आप नीचे टाइप कर सकते हैं।",
            micPermissionDenied:
                "इस साइट के लिए माइक्रोफ़ोन एक्सेस अवरुद्ध है — ब्राउज़र सेटिंग्स में इसे अनुमति दें, या नीचे टाइप करें।",
            openLabel: "खोलें",
            takingThere: "अभी आपके लिए खोल रहा हूं।",
            langChanged: "सहायक की भाषा हिन्दी सेट की गई।",
            muteOn: "आवाज़ में जवाब बंद कर दिए गए।",
            muteOff: "आवाज़ में जवाब चालू हैं।"
        },

        bn: {
            title: "সেফ যাত্রী সহায়ক",
            placeholder: "কোনো ফিচার সম্পর্কে জিজ্ঞাসা করুন...",
            greeting:
                "নমস্কার! আমি সেফ যাত্রী সহায়ক। যেকোনো ফিচার সম্পর্কে জিজ্ঞাসা করুন — যেমন \"ভিড়ের অবস্থা\" বা \"ঘটনা রিপোর্ট করুন\" — আমি ব্যাখ্যা করব এবং সেখানে নিয়ে যাব।",
            help:
                "আমি এগুলোতে সাহায্য করতে পারি। যেকোনো একটিতে ট্যাপ করুন, বা টাইপ/বলুন:",
            notUnderstood:
                "আমি সেখানে কোনো ফিচার বুঝতে পারিনি। নিরাপত্তা, ভিড়, আবহাওয়া, অবস্থান, সুবিধা, ঘটনা রিপোর্ট বা পালানোর পথ সম্পর্কে জিজ্ঞাসা করে দেখুন।",
            listening: "শুনছি...",
            micUnsupported:
                "এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয় — আপনি নিচে টাইপ করতে পারেন।",
            micPermissionDenied:
                "এই সাইটের জন্য মাইক্রোফোন অ্যাক্সেস বন্ধ আছে — ব্রাউজার সেটিংসে অনুমতি দিন, অথবা নিচে টাইপ করুন।",
            openLabel: "খুলুন",
            takingThere: "এখনই আপনার জন্য খুলছি।",
            langChanged: "সহায়কের ভাষা বাংলা করা হয়েছে।",
            muteOn: "ভয়েস উত্তর বন্ধ করা হয়েছে।",
            muteOff: "ভয়েস উত্তর চালু আছে।"
        },

        ta: {
            title: "சேஃப் யாத்ரி உதவியாளர்",
            placeholder: "ஒரு அம்சத்தைப் பற்றி கேளுங்கள்...",
            greeting:
                "வணக்கம்! நான் சேஃப் யாத்ரி உதவியாளர். \"கூட்ட நிலை\" அல்லது \"சம்பவத்தை பதிவு செய்யவும்\" போன்ற எந்த அம்சத்தைப் பற்றியும் கேளுங்கள் — நான் விளக்கி அங்கு அழைத்துச் செல்கிறேன்.",
            help:
                "இவற்றில் நான் உதவ முடியும். ஏதேனும் ஒன்றைத் தட்டவும், அல்லது தட்டச்சு செய்யவும் / பேசவும்:",
            notUnderstood:
                "அதில் ஒரு அம்சத்தை என்னால் புரிந்துகொள்ள முடியவில்லை. பாதுகாப்பு, கூட்டம், வானிலை, இருப்பிடம், வசதிகள், சம்பவ அறிக்கை அல்லது வெளியேறும் பாதை பற்றி கேட்டுப் பாருங்கள்.",
            listening: "கேட்கிறேன்...",
            micUnsupported:
                "இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை — கீழே தட்டச்சு செய்யலாம்.",
            micPermissionDenied:
                "இந்த தளத்திற்கு மைக்ரோஃபோன் அணுகல் தடுக்கப்பட்டுள்ளது — உலாவி அமைப்புகளில் அனுமதிக்கவும், அல்லது கீழே தட்டச்சு செய்யவும்.",
            openLabel: "திற",
            takingThere: "இப்போது உங்களுக்காக திறக்கிறேன்.",
            langChanged: "உதவியாளர் மொழி தமிழாக அமைக்கப்பட்டது.",
            muteOn: "குரல் பதில்கள் நிறுத்தப்பட்டன.",
            muteOff: "குரல் பதில்கள் இயக்கத்தில் உள்ளன."
        },

        or: {
            title: "ସେଫ ଯାତ୍ରୀ ସହାୟକ",
            placeholder: "କୌଣସି ଫିଚର ବିଷୟରେ ପଚାରନ୍ତୁ...",
            greeting:
                "ନମସ୍କାର! ମୁଁ ସେଫ ଯାତ୍ରୀ ସହାୟକ। ମୋତେ ଯେକୌଣସି ଫିଚର ବିଷୟରେ ପଚାରନ୍ତୁ — ଯେମିତି \"ଭିଡ଼ ସ୍ଥିତି\" କିମ୍ବା \"ଘଟଣା ରିପୋର୍ଟ କରନ୍ତୁ\" — ମୁଁ ବୁଝାଇବି ଏବଂ ସେଠାକୁ ନେଇଯିବି।",
            help:
                "ମୁଁ ଏଥିରେ ସାହାଯ୍ୟ କରିପାରିବି। ଯେକୌଣସି ଗୋଟିଏରେ ଟାପ କରନ୍ତୁ, କିମ୍ବା ଟାଇପ / କୁହନ୍ତୁ:",
            notUnderstood:
                "ମୁଁ ସେଥିରେ କୌଣସି ଫିଚର ବୁଝି ପାରିଲି ନାହିଁ। ସୁରକ୍ଷା, ଭିଡ଼, ପାଣିପାଗ, ଅବସ୍ଥାନ, ସୁବିଧା, ଘଟଣା ରିପୋର୍ଟ କିମ୍ବା ପଳାୟନ ପଥ ବିଷୟରେ ପଚାରି ଦେଖନ୍ତୁ।",
            listening: "ଶୁଣୁଛି...",
            micUnsupported:
                "ଏହି ବ୍ରାଉଜରରେ ଭଏସ୍ ଇନପୁଟ୍ ସମର୍ଥିତ ନୁହେଁ — ଆପଣ ତଳେ ଟାଇପ୍ କରିପାରିବେ।",
            micPermissionDenied:
                "ଏହି ସାଇଟ ପାଇଁ ମାଇକ୍ରୋଫୋନ ଆକ୍ସେସ ଅବରୋଧିତ ଅଛି — ବ୍ରାଉଜର ସେଟିଂସରେ ଅନୁମତି ଦିଅନ୍ତୁ, କିମ୍ବା ତଳେ ଟାଇପ୍ କରନ୍ତୁ।",
            openLabel: "ଖୋଲନ୍ତୁ",
            takingThere: "ବର୍ତ୍ତମାନ ଆପଣଙ୍କ ପାଇଁ ଖୋଲୁଛି।",
            langChanged: "ସହାୟକ ଭାଷା ଓଡ଼ିଆ ସେଟ୍ ହେଲା।",
            muteOn: "ଭଏସ୍ ଉତ୍ତର ବନ୍ଦ କରାଗଲା।",
            muteOff: "ଭଏସ୍ ଉତ୍ତର ଚାଲୁ ଅଛି।"
        }
    };

    /* ---------------------------------------------------------
       3. FEATURES — description, keywords (per language) and
          the action to run when the visitor wants to use it.
    --------------------------------------------------------- */

    function safeCall(fnName, arg) {
        try {
            if (typeof window[fnName] === "function") {
                window[fnName](arg);
            }
        } catch (err) {
            /* Never let a page function error break the assistant. */
        }
    }

    const FEATURES = [

        {
            id: "checkSafety",
            label: {
                en: "Check My Safety", hi: "मेरी सुरक्षा जांचें",
                bn: "আমার নিরাপত্তা পরীক্ষা করুন", ta: "எனது பாதுகாப்பைச் சரிபார்க்கவும்",
                or: "ମୋ ସୁରକ୍ଷା ଯାଞ୍ଚ କରନ୍ତୁ"
            },
            desc: {
                en: "Runs a full safety check — your location, live weather and crowd risk — and turns on live tracking.",
                hi: "यह आपकी पूरी सुरक्षा जांच करता है — स्थान, मौसम और भीड़ का जोखिम — और लाइव ट्रैकिंग चालू करता है।",
                bn: "এটি আপনার সম্পূর্ণ নিরাপত্তা পরীক্ষা করে — অবস্থান, আবহাওয়া ও ভিড়ের ঝুঁকি — এবং লাইভ ট্র্যাকিং চালু করে।",
                ta: "இது உங்கள் முழு பாதுகாப்பு சரிபார்ப்பை செய்கிறது — இருப்பிடம், வானிலை, கூட்ட ஆபத்து — மற்றும் நேரடி கண்காணிப்பை இயக்குகிறது.",
                or: "ଏହା ଆପଣଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ସୁରକ୍ଷା ଯାଞ୍ଚ କରେ — ଅବସ୍ଥାନ, ପାଣିପାଗ ଏବଂ ଭିଡ଼ ବିପଦ — ଏବଂ ଲାଇଭ ଟ୍ରାକିଂ ଚାଲୁ କରେ।"
            },
            keywords: {
                en: ["safety", "check my safety", "am i safe", "safe"],
                hi: ["सुरक्षा", "मेरी सुरक्षा", "सुरक्षित"],
                bn: ["নিরাপত্তা", "নিরাপদ"],
                ta: ["பாதுகாப்பு", "பாதுகாப்பாக"],
                or: ["ସୁରକ୍ଷା", "ସୁରକ୍ଷିତ"]
            },
            sectionId: "visitorSafety",
            run: function () { safeCall("checkMySafety"); }
        },

        {
            id: "crowd",
            label: {
                en: "Popular Places Crowd Check", hi: "लोकप्रिय स्थान भीड़ जांच",
                bn: "জনপ্রিয় স্থানের ভিড় পরীক্ষা", ta: "பிரபல இடங்களின் கூட்ட சரிபார்ப்பு",
                or: "ଲୋକପ୍ରିୟ ସ୍ଥାନର ଭିଡ଼ ଯାଞ୍ଚ"
            },
            desc: {
                en: "Shows current crowd levels at popular Bhubaneswar temples, gardens and sightseeing spots.",
                hi: "भुवनेश्वर के लोकप्रिय मंदिरों, बगीचों और पर्यटन स्थलों की वर्तमान भीड़ दिखाता है।",
                bn: "ভুবনেশ্বরের জনপ্রিয় মন্দির, বাগান ও দর্শনীয় স্থানের বর্তমান ভিড়ের মাত্রা দেখায়।",
                ta: "பூவனேஸ்வரின் பிரபலமான கோயில்கள், தோட்டங்கள் மற்றும் சுற்றுலா இடங்களின் தற்போதைய கூட்ட அளவைக் காட்டுகிறது.",
                or: "ଭୁବନେଶ୍ୱରର ଲୋକପ୍ରିୟ ମନ୍ଦିର, ବଗିଚା ଏବଂ ଦର୍ଶନୀୟ ସ୍ଥାନର ବର୍ତ୍ତମାନ ଭିଡ଼ ସ୍ତର ଦେଖାଏ।"
            },
            keywords: {
                en: ["crowd", "popular places", "temple crowd", "how crowded"],
                hi: ["भीड़", "भीड़भाड़", "लोकप्रिय स्थान"],
                bn: ["ভিড়", "জনপ্রিয় স্থান"],
                ta: ["கூட்டம்", "பிரபல இடங்கள்"],
                or: ["ଭିଡ଼", "ଲୋକପ୍ରିୟ ସ୍ଥାନ"]
            },
            sectionId: "popularPlacesSection",
            run: function () { safeCall("checkPopularPlacesCrowd"); }
        },

        {
            id: "weather",
            label: {
                en: "Weather Updates", hi: "मौसम अपडेट",
                bn: "আবহাওয়ার আপডেট", ta: "வானிலை புதுப்பிப்புகள்",
                or: "ପାଣିପାଗ ଅପଡେଟ୍"
            },
            desc: {
                en: "Shows the live Bhubaneswar weather feeding into your safety score.",
                hi: "आपकी सुरक्षा स्कोर में जुड़ने वाला भुवनेश्वर का लाइव मौसम दिखाता है।",
                bn: "আপনার নিরাপত্তা স্কোরে যুক্ত হওয়া ভুবনেশ্বরের লাইভ আবহাওয়া দেখায়।",
                ta: "உங்கள் பாதுகாப்பு மதிப்பெண்ணில் சேரும் பூவனேஸ்வரின் நேரடி வானிலையைக் காட்டுகிறது.",
                or: "ଆପଣଙ୍କ ସୁରକ୍ଷା ସ୍କୋରରେ ଯୋଡ଼ୁଥିବା ଭୁବନେଶ୍ୱରର ଲାଇଭ ପାଣିପାଗ ଦେଖାଏ।"
            },
            keywords: {
                en: ["weather", "rain", "temperature", "forecast"],
                hi: ["मौसम", "बारिश", "तापमान"],
                bn: ["আবহাওয়া", "বৃষ্টি", "তাপমাত্রা"],
                ta: ["வானிலை", "மழை", "வெப்பநிலை"],
                or: ["ପାଣିପାଗ", "ବର୍ଷା", "ତାପମାତ୍ରା"]
            },
            sectionId: "visitorSafety",
            run: null
        },

        {
            id: "location",
            label: {
                en: "Detect My Location", hi: "मेरा स्थान पता करें",
                bn: "আমার অবস্থান শনাক্ত করুন", ta: "எனது இருப்பிடத்தைக் கண்டறியவும்",
                or: "ମୋ ଅବସ୍ଥାନ ଚିହ୍ନଟ କରନ୍ତୁ"
            },
            desc: {
                en: "Finds your GPS location, names the nearest place, and updates your live safety status.",
                hi: "आपका GPS स्थान ढूंढता है, निकटतम स्थान बताता है, और आपकी लाइव सुरक्षा स्थिति अपडेट करता है।",
                bn: "আপনার জিপিএস অবস্থান খুঁজে বের করে, নিকটতম স্থানের নাম বলে এবং লাইভ নিরাপত্তা অবস্থা আপডেট করে।",
                ta: "உங்கள் GPS இருப்பிடத்தைக் கண்டறிந்து, அருகிலுள்ள இடத்தைப் பெயரிட்டு, நேரடி பாதுகாப்பு நிலையைப் புதுப்பிக்கிறது.",
                or: "ଆପଣଙ୍କ GPS ଅବସ୍ଥାନ ଖୋଜେ, ନିକଟତମ ସ୍ଥାନର ନାମ ଦିଏ ଏବଂ ଲାଇଭ ସୁରକ୍ଷା ସ୍ଥିତି ଅପଡେଟ୍ କରେ।"
            },
            keywords: {
                en: ["location", "gps", "where am i", "my location"],
                hi: ["स्थान", "मेरा स्थान", "जीपीएस"],
                bn: ["অবস্থান", "জিপিএস"],
                ta: ["இருப்பிடம்", "ஜிபிஎஸ்"],
                or: ["ଅବସ୍ଥାନ", "ଜିପିଏସ୍"]
            },
            sectionId: "locationSection",
            run: function () { safeCall("getUserLocation"); }
        },

        {
            id: "geofence",
            label: {
                en: "Live Geofence Alerts", hi: "लाइव जियोफेंस अलर्ट",
                bn: "লাইভ জিওফেন্স সতর্কতা", ta: "நேரடி ஜியோஃபென்ஸ் எச்சரிக்கைகள்",
                or: "ଲାଇଭ ଜିଓଫେନ୍ସ ଆଲର୍ଟ"
            },
            desc: {
                en: "Turns on live alerts when you enter or exit a mapped safety zone.",
                hi: "जब आप किसी सुरक्षा क्षेत्र में प्रवेश करते या बाहर निकलते हैं तो लाइव अलर्ट चालू करता है।",
                bn: "আপনি কোনো নিরাপত্তা অঞ্চলে প্রবেশ বা প্রস্থান করলে লাইভ সতর্কতা চালু করে।",
                ta: "நீங்கள் ஒரு பாதுகாப்பு மண்டலத்திற்குள் நுழையும்போது அல்லது வெளியேறும்போது நேரடி எச்சரிக்கைகளை இயக்குகிறது.",
                or: "ଆପଣ କୌଣସି ସୁରକ୍ଷା ମଣ୍ଡଳରେ ପ୍ରବେଶ କିମ୍ବା ପ୍ରସ୍ଥାନ କଲେ ଲାଇଭ ଆଲର୍ଟ ଚାଲୁ କରେ।"
            },
            keywords: {
                en: ["geofence", "live alerts", "zone alert"],
                hi: ["जियोफेंस", "अलर्ट"],
                bn: ["জিওফেন্স", "সতর্কতা"],
                ta: ["ஜியோஃபென்ஸ்", "எச்சரிக்கை"],
                or: ["ଜିଓଫେନ୍ସ", "ଆଲର୍ଟ"]
            },
            sectionId: "locationSection",
            run: null
        },

        {
            id: "facilities",
            label: {
                en: "Nearby Facilities", hi: "आस-पास की सुविधाएं",
                bn: "কাছাকাছি সুবিধা", ta: "அருகிலுள்ள வசதிகள்",
                or: "ନିକଟସ୍ଥ ସୁବିଧା"
            },
            desc: {
                en: "Lists the closest hospital, washroom and medical camp once your location is detected.",
                hi: "आपका स्थान पता चलने पर निकटतम अस्पताल, शौचालय और मेडिकल कैंप दिखाता है।",
                bn: "অবস্থান শনাক্ত হলে নিকটতম হাসপাতাল, শৌচাগার ও মেডিকেল ক্যাম্প দেখায়।",
                ta: "உங்கள் இருப்பிடம் கண்டறியப்பட்டதும் அருகிலுள்ள மருத்துவமனை, கழிப்பறை மற்றும் மருத்துவ முகாமைக் காட்டுகிறது.",
                or: "ଆପଣଙ୍କ ଅବସ୍ଥାନ ଚିହ୍ନଟ ହେଲେ ନିକଟତମ ଡାକ୍ତରଖାନା, ପାଇଖାନା ଏବଂ ମେଡିକାଲ କ୍ୟାମ୍ପ ଦେଖାଏ।"
            },
            keywords: {
                en: ["hospital", "washroom", "toilet", "facilities", "medical camp"],
                hi: ["अस्पताल", "शौचालय", "सुविधाएं"],
                bn: ["হাসপাতাল", "শৌচাগার", "সুবিধা"],
                ta: ["மருத்துவமனை", "கழிப்பறை", "வசதிகள்"],
                or: ["ଡାକ୍ତରଖାନା", "ପାଇଖାନା", "ସୁବିଧା"]
            },
            sectionId: "facilitiesSection",
            run: null
        },

        {
            id: "incident",
            label: {
                en: "Report an Incident", hi: "घटना दर्ज करें",
                bn: "ঘটনা রিপোর্ট করুন", ta: "சம்பவத்தைப் பதிவு செய்யவும்",
                or: "ଘଟଣା ରିପୋର୍ଟ କରନ୍ତୁ"
            },
            desc: {
                en: "Lets you report a medical emergency, fire, crowd problem or other issue, with your location attached.",
                hi: "यह आपको चिकित्सा आपातकाल, आग, भीड़ की समस्या या अन्य समस्या को अपने स्थान के साथ दर्ज करने देता है।",
                bn: "এটি আপনাকে চিকিৎসা জরুরি অবস্থা, আগুন, ভিড়ের সমস্যা বা অন্য কোনো সমস্যা আপনার অবস্থানসহ রিপোর্ট করতে দেয়।",
                ta: "மருத்துவ அவசரநிலை, தீ, கூட்ட பிரச்சனை அல்லது வேறு பிரச்சனையை உங்கள் இருப்பிடத்துடன் தெரிவிக்க அனுமதிக்கிறது.",
                or: "ଏହା ଆପଣଙ୍କୁ ଡାକ୍ତରୀ ଜରୁରୀକାଳୀନ, ନିଆଁ, ଭିଡ଼ ସମସ୍ୟା କିମ୍ବା ଅନ୍ୟ ସମସ୍ୟାକୁ ଆପଣଙ୍କ ଅବସ୍ଥାନ ସହିତ ରିପୋର୍ଟ କରିବାକୁ ଦିଏ।"
            },
            keywords: {
                en: ["report incident", "emergency", "fire", "medical emergency", "report"],
                hi: ["घटना", "आपातकाल", "आग", "रिपोर्ट"],
                bn: ["ঘটনা", "জরুরি", "আগুন", "রিপোর্ট"],
                ta: ["சம்பவம்", "அவசரநிலை", "தீ", "அறிக்கை"],
                or: ["ଘଟଣା", "ଜରୁରୀକାଳୀନ", "ନିଆଁ", "ରିପୋର୍ଟ"]
            },
            sectionId: "incidentSection",
            run: null
        },

        {
            id: "escape",
            label: {
                en: "Escape Route Map", hi: "निकास मार्ग मानचित्र",
                bn: "পালানোর পথের মানচিত্র", ta: "வெளியேறும் பாதை வரைபடம்",
                or: "ପଳାୟନ ପଥ ମାନଚିତ୍ର"
            },
            desc: {
                en: "Opens a live map with your position and calculates the fastest walking route to safety.",
                hi: "आपकी स्थिति के साथ लाइव मानचित्र खोलता है और सुरक्षा तक तेज़ पैदल मार्ग निकालता है।",
                bn: "আপনার অবস্থানসহ লাইভ মানচিত্র খোলে এবং নিরাপত্তার দ্রুততম হাঁটার পথ বের করে।",
                ta: "உங்கள் இருப்பிடத்துடன் நேரடி வரைபடத்தைத் திறந்து, பாதுகாப்புக்கான வேகமான நடைபாதையைக் கணக்கிடுகிறது.",
                or: "ଆପଣଙ୍କ ଅବସ୍ଥାନ ସହିତ ଲାଇଭ ମାନଚିତ୍ର ଖୋଲେ ଏବଂ ସୁରକ୍ଷା ପାଇଁ ଦ୍ରୁତତମ ପାଦଚଲା ପଥ ବାହାର କରେ।"
            },
            keywords: {
                en: ["escape route", "way out", "exit route", "escape map"],
                hi: ["निकास मार्ग", "बाहर निकलने का रास्ता"],
                bn: ["পালানোর পথ", "বের হওয়ার রাস্তা"],
                ta: ["வெளியேறும் பாதை", "வெளியேறும் வழி"],
                or: ["ପଳାୟନ ପଥ", "ବାହାରକୁ ରାସ୍ତା"]
            },
            sectionId: "escapeMapSection",
            run: function () { safeCall("findNearestEscapeRoute"); }
        },

        {
            id: "advisories",
            label: {
                en: "Safety Advisories", hi: "सुरक्षा सलाह",
                bn: "নিরাপত্তা পরামর্শ", ta: "பாதுகாப்பு அறிவுரைகள்",
                or: "ସୁରକ୍ଷା ପରାମର୍ଶ"
            },
            desc: {
                en: "Shows official safety messages sent by the on-site control room team.",
                hi: "ऑन-साइट नियंत्रण कक्ष टीम द्वारा भेजे गए आधिकारिक सुरक्षा संदेश दिखाता है।",
                bn: "অন-সাইট নিয়ন্ত্রণ কক্ষ দল থেকে পাঠানো সরকারি নিরাপত্তা বার্তা দেখায়।",
                ta: "ஆன்-சைட் கட்டுப்பாட்டு அறை குழுவால் அனுப்பப்பட்ட அதிகாரப்பூர்வ பாதுகாப்பு செய்திகளைக் காட்டுகிறது.",
                or: "ଅନ-ସାଇଟ ନିୟନ୍ତ୍ରଣ କକ୍ଷ ଦଳ ଦ୍ୱାରା ପଠାଯାଇଥିବା ସରକାରୀ ସୁରକ୍ଷା ବାର୍ତ୍ତା ଦେଖାଏ।"
            },
            keywords: {
                en: ["advisory", "advisories", "announcement", "control room message"],
                hi: ["सलाह", "सूचना", "एडवाइजरी"],
                bn: ["পরামর্শ", "ঘোষণা"],
                ta: ["அறிவுரை", "அறிவிப்பு"],
                or: ["ପରାମର୍ଶ", "ଘୋଷଣା"]
            },
            sectionId: "advisorySection",
            run: null
        },

        {
            id: "admin",
            label: {
                en: "Admin Dashboard", hi: "व्यवस्थापक डैशबोर्ड",
                bn: "অ্যাডমিন ড্যাশবোর্ড", ta: "நிர்வாக டாஷ்போர்டு",
                or: "ଆଡମିନ ଡ୍ୟାସବୋର୍ଡ"
            },
            desc: {
                en: "Opens the control-room dashboard for staff to manage incidents, advisories and live monitoring. Staff login required.",
                hi: "यह कर्मचारियों के लिए घटनाओं, सलाह और लाइव निगरानी प्रबंधित करने हेतु नियंत्रण कक्ष डैशबोर्ड खोलता है। स्टाफ लॉगिन आवश्यक है।",
                bn: "এটি কর্মীদের জন্য ঘটনা, পরামর্শ ও লাইভ পর্যবেক্ষণ পরিচালনার নিয়ন্ত্রণ কক্ষ ড্যাশবোর্ড খোলে। স্টাফ লগইন প্রয়োজন।",
                ta: "இது சம்பவங்கள், அறிவுரைகள் மற்றும் நேரடி கண்காணிப்பை நிர்வகிக்க பணியாளர்களுக்கான கட்டுப்பாட்டு அறை டாஷ்போர்டைத் திறக்கிறது. பணியாளர் உள்நுழைவு தேவை.",
                or: "ଏହା କର୍ମଚାରୀଙ୍କ ପାଇଁ ଘଟଣା, ପରାମର୍ଶ ଏବଂ ଲାଇଭ ମନିଟରିଂ ପରିଚାଳନା କରିବାକୁ ନିୟନ୍ତ୍ରଣ କକ୍ଷ ଡ୍ୟାସବୋର୍ଡ ଖୋଲେ। ଷ୍ଟାଫ ଲଗଇନ୍ ଆବଶ୍ୟକ।"
            },
            keywords: {
                en: ["admin", "dashboard", "control room", "staff login"],
                hi: ["व्यवस्थापक", "नियंत्रण कक्ष", "एडमिन"],
                bn: ["অ্যাডমিন", "নিয়ন্ত্রণ কক্ষ"],
                ta: ["நிர்வாகி", "கட்டுப்பாட்டு அறை"],
                or: ["ଆଡମିନ", "ନିୟନ୍ତ୍ରଣ କକ୍ଷ"]
            },
            sectionId: null,
            run: function () { safeCall("showPage", "admin"); }
        }
    ];

    /* Actions that are safe to run immediately (read-only / idempotent). */
    const AUTO_RUNNABLE = new Set([
        "checkSafety", "crowd", "location", "escape"
    ]);

    /* Language-switch phrases the visitor might type or say. */
    const LANG_SWITCH = {
        en: "english", hi: "हिन्दी", bn: "বাংলা", ta: "தமிழ்", or: "ଓଡ଼ିଆ"
    };
    const LANG_SWITCH_ALT = {
        hindi: "hi", bengali: "bn", bangla: "bn", tamil: "ta", odia: "or", oriya: "or", english: "en"
    };

    /* ---------------------------------------------------------
       4. STATE
    --------------------------------------------------------- */

    let vaLang = (window.currentLanguage || "en");
    let vaMuted = localStorage.getItem("vaMuted") === "1";
    let recognition = null;
    let recognizing = false;

    /* ---------------------------------------------------------
       5. DOM READY
    --------------------------------------------------------- */

    document.addEventListener("DOMContentLoaded", init);

    function init() {

        const fab = document.getElementById("vaFab");
        const panel = document.getElementById("vaPanel");
        const closeBtn = document.getElementById("vaCloseBtn");
        const muteBtn = document.getElementById("vaMuteBtn");
        const langDropdown = document.getElementById("vaLangDropdown");
        const langBtn = document.getElementById("vaLangBtn");
        const langList = document.getElementById("vaLangList");
        const form = document.getElementById("vaInputRow");
        const textInput = document.getElementById("vaTextInput");
        const micBtn = document.getElementById("vaMicBtn");
        const mainLangSelect = document.getElementById("languageSelect");

        if (!fab || !panel) return;

        updateMuteIcon(muteBtn);
        syncLangDropdownUI(vaLang);

        fab.addEventListener("click", function () {
            const opening = !panel.classList.contains("open");
            panel.classList.toggle("open");
            fab.setAttribute("aria-expanded", String(opening));
            if (opening && !panel.dataset.greeted) {
                panel.dataset.greeted = "1";
                addAssistantMessage(t("greeting"));
                renderChips();
                speak(t("greeting"));
            }
            if (opening) textInput.focus();
        });

        closeBtn.addEventListener("click", function () {
            panel.classList.remove("open");
            fab.setAttribute("aria-expanded", "false");
            stopListening();
        });

        muteBtn.addEventListener("click", function () {
            vaMuted = !vaMuted;
            localStorage.setItem("vaMuted", vaMuted ? "1" : "0");
            updateMuteIcon(muteBtn);
            addAssistantMessage(vaMuted ? t("muteOn") : t("muteOff"));
        });

        /* Custom language dropdown — open/close + choose an option. */
        if (langBtn && langList) {

            langBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                const opening = langList.hasAttribute("hidden");
                if (opening) {
                    langList.removeAttribute("hidden");
                } else {
                    langList.setAttribute("hidden", "");
                }
                langBtn.setAttribute("aria-expanded", String(opening));
            });

            langList.addEventListener("click", function (e) {
                const li = e.target.closest("li[data-lang]");
                if (!li) return;
                setLanguage(li.dataset.lang, true);
                langList.setAttribute("hidden", "");
                langBtn.setAttribute("aria-expanded", "false");
            });

            document.addEventListener("click", function (e) {
                if (langDropdown && !langDropdown.contains(e.target)) {
                    langList.setAttribute("hidden", "");
                    langBtn.setAttribute("aria-expanded", "false");
                }
            });

            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape" && !langList.hasAttribute("hidden")) {
                    langList.setAttribute("hidden", "");
                    langBtn.setAttribute("aria-expanded", "false");
                    langBtn.focus();
                }
            });
        }

        /* Stay in sync if the visitor changes the main site language. */
        if (mainLangSelect) {
            mainLangSelect.addEventListener("change", function () {
                setLanguage(mainLangSelect.value, false);
            });
        }

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const value = textInput.value.trim();
            if (!value) return;
            textInput.value = "";
            handleUserInput(value);
        });

        micBtn.addEventListener("click", function () {
            if (recognizing) {
                stopListening();
            } else {
                startListening();
            }
        });

        setupRecognition();
    }

    /* Reflects the current language onto the button label + the
       selected <li> in the custom dropdown. */
    function syncLangDropdownUI(lang) {
        const langBtnLabel = document.getElementById("vaLangBtnLabel");
        const langList = document.getElementById("vaLangList");
        if (langBtnLabel && langList) {
            const activeLi = langList.querySelector('li[data-lang="' + lang + '"]');
            if (activeLi) langBtnLabel.textContent = activeLi.textContent;
            langList.querySelectorAll("li[data-lang]").forEach(function (li) {
                li.setAttribute("aria-selected", String(li.dataset.lang === lang));
            });
        }
    }

    function setLanguage(lang, announce) {
        if (!VA_STRINGS[lang]) return;
        vaLang = lang;
        syncLangDropdownUI(lang);
        document.getElementById("vaTitle").textContent = t("title");
        document.getElementById("vaTextInput").placeholder = t("placeholder");
        if (recognition) recognition.lang = SPEECH_LOCALE[lang] || "en-IN";
        if (announce) {
            addAssistantMessage(t("langChanged"));
            speak(t("langChanged"));
            renderChips();
        }
    }

    /* ---------------------------------------------------------
       6. STRINGS / RENDERING HELPERS
    --------------------------------------------------------- */

    function t(key) {
        return (VA_STRINGS[vaLang] && VA_STRINGS[vaLang][key]) ||
               VA_STRINGS.en[key] || "";
    }

    function addMessage(text, who) {
        const list = document.getElementById("vaMessages");
        const row = document.createElement("div");
        row.className = "va-msg va-msg-" + who;
        row.textContent = text;
        list.appendChild(row);
        list.scrollTop = list.scrollHeight;
        return row;
    }

    function addAssistantMessage(text) {
        return addMessage(text, "bot");
    }

    function addUserMessage(text) {
        return addMessage(text, "user");
    }

    function addFeatureMessage(feature) {
        const list = document.getElementById("vaMessages");
        const wrap = document.createElement("div");
        wrap.className = "va-msg va-msg-bot va-msg-feature";

        const p = document.createElement("p");
        p.textContent = feature.desc[vaLang] || feature.desc.en;
        wrap.appendChild(p);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "va-open-btn";
        btn.innerHTML =
            '<i class="fa-solid fa-arrow-right"></i> ' +
            t("openLabel") + ": " + (feature.label[vaLang] || feature.label.en);
        btn.addEventListener("click", function () {
            goToFeature(feature, true);
        });
        wrap.appendChild(btn);

        list.appendChild(wrap);
        list.scrollTop = list.scrollHeight;
    }

    function renderChips() {
        const chips = document.getElementById("vaChips");
        chips.innerHTML = "";
        FEATURES.forEach(function (feature) {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "va-chip";
            chip.textContent = feature.label[vaLang] || feature.label.en;
            chip.addEventListener("click", function () {
                addUserMessage(chip.textContent);
                addAssistantMessage(feature.desc[vaLang] || feature.desc.en);
                speak(feature.desc[vaLang] || feature.desc.en);
                goToFeature(feature, true);
            });
            chips.appendChild(chip);
        });
    }

    /* ---------------------------------------------------------
       7. NAVIGATION / ACTIONS
    --------------------------------------------------------- */

    function goToFeature(feature, userWantsToUse) {

        if (feature.id === "admin") {
            addAssistantMessage(t("takingThere"));
            speak(t("takingThere"));
            safeCall("showPage", "admin");
            return;
        }

        if (feature.sectionId) {
            safeCall("scrollToSection", feature.sectionId);
        }

        if (userWantsToUse && feature.run) {
            feature.run();
        }

        addAssistantMessage(t("takingThere"));
        speak(t("takingThere"));
    }

    /* ---------------------------------------------------------
       8. INTENT MATCHING
    --------------------------------------------------------- */

    function detectLanguageSwitch(raw) {
        const lower = raw.toLowerCase().trim();
        for (const code in LANG_SWITCH) {
            if (lower === LANG_SWITCH[code].toLowerCase() ||
                raw.indexOf(LANG_SWITCH[code]) !== -1) {
                return code;
            }
        }
        if (LANG_SWITCH_ALT[lower]) return LANG_SWITCH_ALT[lower];
        for (const word in LANG_SWITCH_ALT) {
            if (lower.indexOf(word) !== -1) return LANG_SWITCH_ALT[word];
        }
        return null;
    }

    function matchFeature(raw) {
        const lower = raw.toLowerCase();
        let best = null;
        let bestLen = 0;

        FEATURES.forEach(function (feature) {
            Object.keys(feature.keywords).forEach(function (langCode) {
                feature.keywords[langCode].forEach(function (kw) {
                    const needle = kw.toLowerCase();
                    if (lower.indexOf(needle) !== -1 && needle.length > bestLen) {
                        best = feature;
                        bestLen = needle.length;
                    }
                });
            });
        });

        return best;
    }

    function handleUserInput(raw) {
        addUserMessage(raw);

        const langCode = detectLanguageSwitch(raw);
        if (langCode) {
            setLanguage(langCode, true);
            return;
        }

        const lowerRaw = raw.toLowerCase();
        if (["help", "menu", "features", "what can you do"].some(function (w) {
            return lowerRaw.indexOf(w) !== -1;
        })) {
            addAssistantMessage(t("help"));
            speak(t("help"));
            renderChips();
            return;
        }

        const feature = matchFeature(raw);
        if (feature) {
            addFeatureMessage(feature);
            speak(feature.desc[vaLang] || feature.desc.en);
        } else {
            addAssistantMessage(t("notUnderstood"));
            speak(t("notUnderstood"));
            renderChips();
        }
    }

    /* ---------------------------------------------------------
       9. TEXT TO SPEECH
    --------------------------------------------------------- */

    /*
     * Chrome (and some other browsers) load the voice list
     * asynchronously — the very first call to getVoices() right
     * after page load often returns an EMPTY array, even though
     * voices exist. Without caching + a retry-on-load, the first
     * "speak" after switching language (or the first speak of the
     * whole session) can silently pick no voice and, on some
     * browser/OS combinations with no installed Hindi/Bengali/
     * Tamil/Odia voice, produce no audio at all.
     */
    let cachedVoices = [];

    function refreshVoiceCache() {
        if ("speechSynthesis" in window) {
            cachedVoices = window.speechSynthesis.getVoices();
        }
    }

    if ("speechSynthesis" in window) {
        refreshVoiceCache();
        window.speechSynthesis.onvoiceschanged = refreshVoiceCache;
    }

    function speak(text) {
        if (vaMuted || !text) return;
        if (!("speechSynthesis" in window)) return;

        if (!cachedVoices.length) refreshVoiceCache();

        /* First call of the session: the voice list can still be
           genuinely empty here (it loads asynchronously on some
           browsers). Wait for it once instead of speaking with no
           voice picked, then speak — this avoids ever double-firing
           speech, since normally cachedVoices is already populated
           and this branch is skipped entirely. */
        if (!cachedVoices.length && "onvoiceschanged" in window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = function () {
                refreshVoiceCache();
                window.speechSynthesis.onvoiceschanged = refreshVoiceCache;
                speak(text);
            };
            return;
        }

        try {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = SPEECH_LOCALE[vaLang] || "en-IN";

            const match = cachedVoices.find(function (v) {
                return v.lang && v.lang.toLowerCase().indexOf(vaLang) === 0;
            });
            if (match) utter.voice = match;

            window.speechSynthesis.speak(utter);
        } catch (err) {
            /* Speech synthesis is best-effort only. */
        }
    }

    function updateMuteIcon(muteBtn) {
        if (!muteBtn) return;
        muteBtn.innerHTML = vaMuted
            ? '<i class="fa-solid fa-volume-xmark"></i>'
            : '<i class="fa-solid fa-volume-high"></i>';
    }

    /* ---------------------------------------------------------
       10. SPEECH RECOGNITION (voice input)
    --------------------------------------------------------- */

    function setupRecognition() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const micBtn = document.getElementById("vaMicBtn");

        if (!SR) {
            if (micBtn) micBtn.style.display = "none";
            return;
        }

        recognition = new SR();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.lang = SPEECH_LOCALE[vaLang] || "en-IN";

        recognition.onstart = function () {
            recognizing = true;
            document.getElementById("vaFab").classList.add("va-fab-listening");
            micBtn.classList.add("va-mic-active");
            document.getElementById("vaTextInput").placeholder = t("listening");
        };

        recognition.onend = function () {
            recognizing = false;
            document.getElementById("vaFab").classList.remove("va-fab-listening");
            micBtn.classList.remove("va-mic-active");
            document.getElementById("vaTextInput").placeholder = t("placeholder");
        };

        recognition.onerror = function (event) {
            recognizing = false;
            micBtn.classList.remove("va-mic-active");
            document.getElementById("vaFab").classList.remove("va-fab-listening");
            document.getElementById("vaTextInput").placeholder = t("placeholder");

            /*
             * Previously this reset the button and did nothing else —
             * so any failure (wrong language support, no mic
             * permission, no network) looked identical to "nothing
             * happened" from the visitor's side. Surface a message
             * for every failure mode instead of only some of them.
             */
            const err = event && event.error;

            if (err === "not-allowed" || err === "service-not-allowed") {
                addAssistantMessage(t("micPermissionDenied") || t("micUnsupported"));
            } else if (err === "language-not-supported") {
                addAssistantMessage(t("micUnsupported"));
            } else if (err === "network") {
                addAssistantMessage(t("micUnsupported"));
            } else if (err === "no-speech" || err === "aborted") {
                /* Visitor just didn't say anything / tapped again —
                   not a failure worth interrupting them about. */
            } else if (err === "audio-capture") {
                addAssistantMessage(t("micUnsupported"));
            }
        };

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            handleUserInput(transcript);
        };
    }

    function startListening() {
        if (!recognition) {
            addAssistantMessage(t("micUnsupported"));
            return;
        }
        try {
            recognition.lang = SPEECH_LOCALE[vaLang] || "en-IN";
            recognition.start();
        } catch (err) {
            /* Already-started errors are safe to ignore. */
        }
    }

    function stopListening() {
        if (recognition && recognizing) {
            try { recognition.stop(); } catch (err) { /* ignore */ }
        }
    }

}());
