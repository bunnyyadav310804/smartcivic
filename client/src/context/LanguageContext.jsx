import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const translations = {
  en: {
    // Navigation
    portal_title: 'Smart City',
    portal_subtitle: 'Civic Issue Portal',
    home: 'Home',
    complaints: 'Complaints',
    heat_map: '🗺️ Heat Map',
    new_issue: '+ Report Issue',
    logout: 'Logout',
    signed_in_as: 'Signed in as',

    // Voice Dictation
    voice_dictate: '🎙️ Voice Dictate',
    listening: '🔴 Listening (Speak now)...',

    // Form
    report_issue_title: 'Report a Civic Issue',
    report_issue_subtitle: 'Submit potholes, drainage blockages, sanitation, or damaged streetlights for municipal attention.',
    title: 'Title',
    title_placeholder: 'e.g. Deep pothole near Metro Station Pillar 42',
    description: 'Description',
    description_placeholder: 'Describe the civic issue in detail, severity, or speak using Voice Dictate...',
    category: 'Category',
    select_category: 'Select issue category',
    priority: 'Priority Level',
    anonymous_reporting: '🔒 Report Anonymously',
    anonymous_help: 'Hide your personal identity (name, email, phone) from the public feed.',
    location_section: '📍 Location & GPS Coordinates',
    use_gps: '📡 Use My GPS',
    pick_on_map: '🗺️ Pick on Map',
    hide_map: '🗺️ Hide Map Picker',
    latitude: 'Latitude',
    longitude: 'Longitude',
    address: 'Address / Landmark',
    address_placeholder: 'Street, Landmark, Ward...',
    evidence_images: '📷 Evidence Images',
    take_live_photo: '📸 Take Live Photo',
    upload_gallery: 'Upload from gallery / device files:',
    selected_photos: 'Selected photos',
    ai_detect_btn: '✨ AI Auto-Detect Category & Severity',
    ai_scanning: 'AI Scanning Visuals...',
    ai_match: 'Match',
    submit_btn: 'Submit Civic Issue',
    saving_btn: 'Saving Issue Report...',

    // Categories
    cat_potholes: 'Potholes / Road Damage',
    cat_garbage: 'Garbage & Sanitation',
    cat_drainage: 'Drainage Blockage',
    cat_water: 'Water Leakage',
    cat_streetlights: 'Damaged Streetlights',
    cat_electricity: 'Electricity & Hazards',
    cat_roads: 'Roads & Infrastructure',
    cat_sanitation: 'Sanitation & Hygiene',
    cat_other: 'Other Civic Issues',

    // Priorities
    prio_low: 'Low Priority',
    prio_medium: 'Medium Priority',
    prio_high: 'High Priority',
    prio_critical: 'Critical Emergency',

    // Statuses
    stat_submitted: 'Submitted',
    stat_assigned: 'Assigned',
    stat_in_progress: 'In Progress',
    stat_resolved: 'Resolved',
    stat_rejected: 'Rejected',

    // Actions & Badges
    upvote: 'Upvote',
    upvoted: 'Upvoted',
    export_pdf: '📄 Export PDF Certificate',
    share_whatsapp: '💬 Share on WhatsApp',
    ai_verified: 'AI Verified Resolution',
    department_analytics: '📊 Department Analytics',
    view_details: 'View Details',
    edit: 'Edit',
    delete: 'Delete',
    location: 'Location',
    status: 'Status',
    verified_proof: '✓ Verified Resolution Proof',

    // Complaints Registry Page
    complaints_registry_title: 'Civic Complaints Registry',
    complaints_registry_subtitle: 'Track reported issues in real-time, upvote community concerns, and inspect work resolutions.',
    search_placeholder: 'Search issues by title, description, or landmark...',
    all_filter: 'All',
    city_heat_map: '🗺️ City Heat Map',
    report_new_issue: '+ Report New Issue',
    no_complaints_found: 'No complaints found matching your search or filters.',
    status_filter_label: 'Filter by Status',

    // Home Page
    hero_badge: '🏛️ Municipal Smart Governance',
    hero_title_1: 'Empowering Citizens.',
    hero_title_2: 'Transforming Our City.',
    hero_desc: 'Smart Civic Issue Reporting platform enables citizens to instantly report potholes, garbage dumps, drainage blocks, and broken streetlights with GPS tracking, AI verification, and real-time status updates.',
    hero_report_btn: '+ Report an Issue',
    hero_map_btn: '🗺️ Explore City Heat Map',
    live_overview: 'Live Municipal Overview',
    total_reports: 'Total Reports',
    active_pipeline: 'In Progress',
    successfully_resolved: 'Successfully Resolved',
    resolution_rate: 'Resolution Rate',
    browse_categories: 'Browse Issues by Category',
    how_it_works: 'How the Smart System Works',
    step1_title: '1. Report with Live GPS',
    step1_desc: 'Snap photos from camera or gallery. AI auto-detects category, severity, and exact GPS coordinates.',
    step2_title: '2. Department Auto-Dispatch',
    step2_desc: 'System routes tickets to PWD, Solid Waste, BWSSB or BESCOM with strict turnaround SLAs.',
    step3_title: '3. Municipal Field Action',
    step3_desc: 'Crews inspect on-ground and upload verified "After Resolution" proof photos.',
    step4_title: '4. Citizen Rating & PDF',
    step4_desc: 'Citizen reviews the proof, rates satisfaction out of 5 stars, and exports official PDF certificates.',
    recent_reports: 'Recent Civic Reports',
    view_all_complaints: 'View All Complaints →',

    // Details Page
    back_to_complaints: '← Back to complaints',
    edit_complaint: 'Edit Complaint',
    delete_complaint: 'Delete Complaint',
    timeline_title: '⏱️ Resolution Progress Timeline',
    citizen_feedback_title: '⭐ Citizen Resolution Feedback & Rating',
    citizen_feedback_subtitle: 'Rate the quality of the municipal resolution work for public accountability.',
    rate_comment_placeholder: 'Share your thoughts on how quickly and effectively this issue was resolved...',
    submit_rating_btn: 'Submit Rating & Feedback',
    before_resolution_label: '📸 Before Resolution (Citizen Evidence)',
    after_resolution_label: '✅ After Resolution (Verified Proof)',
    municipal_remarks: 'Official Municipal Remarks / Notes',

    // AI Copilot
    copilot_title: 'SmartCity AI Copilot',
    copilot_btn: 'SmartCity AI Copilot',
    copilot_welcome: '👋 Welcome! Ask me about reporting issues, ward turnaround times, or emergency helplines in Telugu, Hindi, or English.'
  },

  te: {
    // Navigation (Telugu - తెలుగు)
    portal_title: 'స్మార్ట్ సిటీ',
    portal_subtitle: 'పౌర సమస్యల పరిష్కార పోర్టల్',
    home: 'హోమ్',
    complaints: 'ఫిర్యాదులు',
    heat_map: '🗺️ హీట్ మ్యాప్',
    new_issue: '+ సమస్యను నివేదించండి',
    logout: 'లాగౌట్',
    signed_in_as: 'లాగిన్ అయిన వారు',

    // Voice Dictation
    voice_dictate: '🎙️ వాయిస్ ద్వారా మాట్లాడండి',
    listening: '🔴 వింటున్నాము (మాట్లాడండి)...',

    // Form
    report_issue_title: 'పౌర సమస్యను నమోదు చేయండి',
    report_issue_subtitle: 'రోడ్డు గుంతలు, డ్రైనేజీ సమస్యలు, చెత్త లేదా వీధి దీపాల సమస్యలను మున్సిపల్ అధికారులకు తెలియజేయండి.',
    title: 'సమస్య శీర్షిక (Title)',
    title_placeholder: 'ఉదా: మెట్రో పిల్లర్ 42 వద్ద రోడ్డు గుంత',
    description: 'సమస్య వివరాలు (Description)',
    description_placeholder: 'సమస్యను వివరంగా రాయండి లేదా మైక్ ద్వారా మాట్లాడండి...',
    category: 'సమస్య వర్గం (Category)',
    select_category: 'వర్గాన్ని ఎంచుకోండి',
    priority: 'ప్రాధాన్యత స్థాయి (Priority)',
    anonymous_reporting: '🔒 అనామకంగా నివేదించండి (Anonymous)',
    anonymous_help: 'మీ పేరు, మొబైల్ నంబర్ మరియు ఈమెయిల్ వివరాలు ఇతరులకు కనిపించవు.',
    location_section: '📍 లొకేషన్ & జీపీఎస్ వివరాలు',
    use_gps: '📡 నా లొకేషన్ ఉపయోగించు',
    pick_on_map: '🗺️ మ్యాప్‌లో గుర్తించు',
    hide_map: '🗺️ మ్యాప్ మూసివేయి',
    latitude: 'అక్షాంశం (Latitude)',
    longitude: 'రేఖాంశం (Longitude)',
    address: 'చిరునామా / ల్యాండ్‌మార్క్',
    address_placeholder: 'వీధి పేరు, మైలురాయి, వార్డు నంబర్...',
    evidence_images: '📷 ఆధారాల ఫోటోలు (Evidence)',
    take_live_photo: '📸 లైవ్ ఫోటో తీయండి',
    upload_gallery: 'గ్యాలరీ నుండి ఫోటోలను అప్‌లోడ్ చేయండి:',
    selected_photos: 'ఎంచుకున్న ఫోటోలు',
    ai_detect_btn: '✨ AI ద్వారా కేటగిరీని స్వయంచాలకంగా గుర్తించు',
    ai_scanning: 'AI ఫోటోను స్కాన్ చేస్తోంది...',
    ai_match: 'సరిపోలిక',
    submit_btn: 'ఫిర్యాదును సమర్పించండి',
    saving_btn: 'ఫిర్యాదు నమోదవుతోంది...',

    // Categories (Telugu)
    cat_potholes: 'గుంతలు / రోడ్డు నష్టం',
    cat_garbage: 'చెత్త & పారిశుధ్యం',
    cat_drainage: 'డ్రైనేజీ అడ్డంకి',
    cat_water: 'నీటి లీకేజీ / సరఫరా సమస్య',
    cat_streetlights: 'దెబ్బతిన్న వీధి దీపాలు',
    cat_electricity: 'విద్యుత్ & ప్రమాదాలు',
    cat_roads: 'రహదారులు & మౌలిక సదుపాయాలు',
    cat_sanitation: 'పారిశుధ్యం & పరిశుభ్రత',
    cat_other: 'ఇతర సమస్యలు',

    // Priorities
    prio_low: 'తక్కువ ప్రాధాన్యత',
    prio_medium: 'మధ్యస్థ ప్రాధాన్యత',
    prio_high: 'అధిక ప్రాధాన్యత',
    prio_critical: 'అత్యవసర ప్రమాదం (Emergency)',

    // Statuses
    stat_submitted: 'సమర్పించబడింది',
    stat_assigned: 'అధికారికి కేటాయించబడింది',
    stat_in_progress: 'పని పురోగతిలో ఉంది',
    stat_resolved: 'పరిష్కరించబడింది',
    stat_rejected: 'తిరస్కరించబడింది',

    // Actions & Badges
    upvote: 'మద్దతు ఇవ్వండి (Upvote)',
    upvoted: 'మద్దతు ఇచ్చారు',
    export_pdf: '📄 అధికారిక PDF సర్టిఫికేట్',
    share_whatsapp: '💬 వాట్సాప్‌లో షేర్ చేయండి',
    ai_verified: 'AI ధృవీకరించిన పరిష్కారం',
    department_analytics: '📊 శాఖల విశ్లేషణ',
    view_details: 'వివరాలు చూడండి',
    edit: 'సవరించండి',
    delete: 'తొలగించండి',
    location: 'లొకేషన్',
    status: 'స్థితి',
    verified_proof: '✓ ధృవీకరించిన పరిష్కార ఆధారం',

    // Complaints Registry Page
    complaints_registry_title: 'పౌర ఫిర్యాదుల రిజిస్ట్రీ',
    complaints_registry_subtitle: 'నమోదైన సమస్యల పురోగతిని తెలుసుకోండి, ప్రజా సమస్యలకు మద్దతు ఇవ్వండి మరియు పరిష్కార వివరాలను పరిశీలించండి.',
    search_placeholder: 'శీర్షిక, వివరాలు లేదా ల్యాండ్‌మార్క్ ద్వారా శోధించండి...',
    all_filter: 'అన్నీ',
    city_heat_map: '🗺️ నగర హీట్ మ్యాప్',
    report_new_issue: '+ కొత్త సమస్యను నమోదు చేయండి',
    no_complaints_found: 'మీరు ఎంచుకున్న వివరాలకు సరిపోయే ఫిర్యాదులు ఏవీ లేవు.',
    status_filter_label: 'స్థితి ఆధారంగా ఫిల్టర్ చేయండి',

    // Home Page
    hero_badge: '🏛️ మున్సిపల్ స్మార్ట్ గవర్నెన్స్',
    hero_title_1: 'పౌరుల సాధికారత.',
    hero_title_2: 'నగర సమగ్ర పరివర్తన.',
    hero_desc: 'స్మార్ట్ సిటీ పోర్టల్ ద్వారా రోడ్డు గుంతలు, చెత్త కుప్పలు, డ్రైనేజీ మరియు వీధి దీపాల సమస్యలను జీపీఎస్ లొకేషన్, AI సహాయం మరియు లైవ్ అప్‌డేట్‌లతో మున్సిపల్ అధికారులకు నివేదించండి.',
    hero_report_btn: '+ సమస్యను నివేదించండి',
    hero_map_btn: '🗺️ నగర హీట్ మ్యాప్ చూడండి',
    live_overview: 'ప్రత్యక్ష మున్సిపల్ గణాంకాలు',
    total_reports: 'మొత్తం ఫిర్యాదులు',
    active_pipeline: 'పురోగతిలో ఉన్నవి',
    successfully_resolved: 'పరిష్కరించబడినవి',
    resolution_rate: 'పరిష్కార రేటు',
    browse_categories: 'వర్గాల వారీగా సమస్యలు',
    how_it_works: 'సిస్టమ్ ఎలా పనిచేస్తుంది',
    step1_title: '1. జీపీఎస్ ద్వారా నివేదించండి',
    step1_desc: 'ఫోటోలు తీసి అప్‌లోడ్ చేయండి. AI ఆటోమేటిక్‌గా కేటగిరీ, తీవ్రత మరియు జీపీఎస్ లొకేషన్‌ను గుర్తిస్తుంది.',
    step2_title: '2. సంబంధిత శాఖకు కేటాయింపు',
    step2_desc: 'ఫిర్యాదు నేరుగా రోడ్లు, పారిశుధ్యం లేదా విద్యుత్ విభాగానికి స్వయంచాలకంగా చేరుతుంది.',
    step3_title: '3. క్షేత్రస్థాయిలో పరిష్కారం',
    step3_desc: 'మున్సిపల్ బృందం క్షేత్రస్థాయిలో సమస్యను పరిష్కరించి పరిష్కార ఫోటోలను అప్‌లోడ్ చేస్తుంది.',
    step4_title: '4. రేటింగ్ & PDF సర్టిఫికేట్',
    step4_desc: 'పరిష్కారాన్ని పరిశీలించి 5-స్టార్ రేటింగ్ ఇవ్వండి మరియు అధికారిక PDF సర్టిఫికేట్ డౌన్‌లోడ్ చేసుకోండి.',
    recent_reports: 'ఇటీవలి పౌర ఫిర్యాదులు',
    view_all_complaints: 'అన్ని ఫిర్యాదులను చూడండి →',

    // Details Page
    back_to_complaints: '← ఫిర్యాదుల జాబితాకు వెళ్లండి',
    edit_complaint: 'ఫిర్యాదును సవరించండి',
    delete_complaint: 'ఫిర్యాదును తొలగించండి',
    timeline_title: '⏱️ పరిష్కార పురోగతి టైమ్‌లైన్',
    citizen_feedback_title: '⭐ పౌర సంతృప్తి రేటింగ్ & ఫీడ్‌బ్యాక్',
    citizen_feedback_subtitle: 'మున్సిపల్ అధికారులు సమస్యను పరిష్కరించిన విధానంపై మీ రేటింగ్ ఇవ్వండి.',
    rate_comment_placeholder: 'ఈ సమస్య ఎంత సమర్థవంతంగా పరిష్కరించబడిందో మీ అభిప్రాయాన్ని రాయండి...',
    submit_rating_btn: 'రేటింగ్ సమర్పించండి',
    before_resolution_label: '📸 పరిష్కారానికి ముందు (పౌర ఆధారం)',
    after_resolution_label: '✅ పరిష్కారం తర్వాత (ధృవీకరించిన ఆధారం)',
    municipal_remarks: 'మున్సిపల్ అధికారుల సూచనలు / వివరాలు',

    // AI Copilot
    copilot_title: 'స్మార్ట్ సిటీ AI సహాయకుడు',
    copilot_btn: 'స్మార్ట్ సిటీ AI సహాయకుడు',
    copilot_welcome: '👋 నమస్కారం! సమస్యల నమోదు, పరిష్కార సమయం లేదా అత్యవసర నంబర్ల గురించి నన్ను అడగండి.'
  },

  hi: {
    // Navigation (Hindi - हिन्दी)
    portal_title: 'स्मार्ट सिटी',
    portal_subtitle: 'नागरिक समस्या समाधान पोर्टल',
    home: 'होम',
    complaints: 'शिकायतें',
    heat_map: '🗺️ हीट मैप',
    new_issue: '+ समस्या दर्ज करें',
    logout: 'लॉगआउट',
    signed_in_as: 'लॉग इन उपयोगकर्ता',

    // Voice Dictation
    voice_dictate: '🎙️ बोलकर दर्ज करें (Voice Dictate)',
    listening: '🔴 सुन रहे हैं (अब बोलें)...',

    // Form
    report_issue_title: 'नागरिक समस्या दर्ज करें',
    report_issue_subtitle: 'सड़क के गड्ढे, कचरा, सीवेज रुकावट, जल रिसाव या खराब स्ट्रीट लाइट की शिकायत नगर निगम को भेजें।',
    title: 'समस्या का शीर्षक (Title)',
    title_placeholder: 'उदा: मेट्रो पिलर 42 के पास गहरा गड्ढा',
    description: 'समस्या का विवरण (Description)',
    description_placeholder: 'समस्या का विस्तार से विवरण लिखें या माइक से बोलें...',
    category: 'समस्या की श्रेणी (Category)',
    select_category: 'श्रेणी का चयन करें',
    priority: 'प्राथमिकता स्तर (Priority)',
    anonymous_reporting: '🔒 गुमनाम रूप से दर्ज करें (Anonymous)',
    anonymous_help: 'आपकी व्यक्तिगत पहचान (नाम, ईमेल, फोन) सार्वजनिक रूप से छिपी रहेगी।',
    location_section: '📍 स्थान एवं जीपीएस निर्देशांक',
    use_gps: '📡 मेरा जीपीएस स्थान लें',
    pick_on_map: '🗺️ मानचित्र पर चुनें',
    hide_map: '🗺️ मानचित्र छिपाएं',
    latitude: 'अक्षांश (Latitude)',
    longitude: 'देशांतर (Longitude)',
    address: 'पता / लैंडमार्क',
    address_placeholder: 'सड़क, लैंडमार्क, वार्ड नंबर...',
    evidence_images: '📷 साक्ष्य तस्वीरें (Evidence)',
    take_live_photo: '📸 लाइव फोटो खींचें',
    upload_gallery: 'गैलरी से तस्वीरें अपलोड करें:',
    selected_photos: 'चुनी गई तस्वीरें',
    ai_detect_btn: '✨ AI से श्रेणी व गंभीरता स्वतः पहचानें',
    ai_scanning: 'AI तस्वीरों की जांच कर रहा है...',
    ai_match: 'सटीकता',
    submit_btn: 'शिकायत सबमिट करें',
    saving_btn: 'शिकायत दर्ज हो रही है...',

    // Categories (Hindi)
    cat_potholes: 'गड्ढे / सड़क क्षति',
    cat_garbage: 'कचरा एवं स्वच्छता',
    cat_drainage: 'जल निकासी / सीवेज रुकावट',
    cat_water: 'पानी का रिसाव',
    cat_streetlights: 'क्षतिग्रस्त स्ट्रीट लाइटें',
    cat_electricity: 'बिजली एवं खतरे',
    cat_roads: 'सड़कें एवं अवसंरचना',
    cat_sanitation: 'स्वच्छता एवं सफाई',
    cat_other: 'अन्य नागरिक समस्याएं',

    // Priorities
    prio_low: 'निम्न प्राथमिकता',
    prio_medium: 'मध्यम प्राथमिकता',
    prio_high: 'उच्च प्राथमिकता',
    prio_critical: 'अति आवश्यक आपातकाल (Critical)',

    // Statuses
    stat_submitted: 'दर्ज किया गया',
    stat_assigned: 'अधिकारी को सौंपा गया',
    stat_in_progress: 'कार्य प्रगति पर है',
    stat_resolved: 'समाधान हो गया',
    stat_rejected: 'खारिज किया गया',

    // Actions & Badges
    upvote: 'समर्थन दें (Upvote)',
    upvoted: 'समर्थन दिया',
    export_pdf: '📄 आधिकारिक PDF प्रमाण पत्र',
    share_whatsapp: '💬 व्हाट्सएप पर साझा करें',
    ai_verified: 'AI सत्यापित समाधान',
    department_analytics: '📊 विभाग विश्लेषण',
    view_details: 'विवरण देखें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    location: 'स्थान',
    status: 'स्थिति',
    verified_proof: '✓ सत्यापित समाधान साक्ष्य',

    // Complaints Registry Page
    complaints_registry_title: 'नागरिक शिकायत पंजी',
    complaints_registry_subtitle: 'वास्तविक समय में समस्याओं की निगरानी करें, समर्थन दें और कार्य समाधान देखें।',
    search_placeholder: 'शीर्षक, विवरण या स्थान के आधार पर खोजें...',
    all_filter: 'सभी',
    city_heat_map: '🗺️ शहर हीट मैप',
    report_new_issue: '+ नई समस्या दर्ज करें',
    no_complaints_found: 'आपकी खोज के अनुसार कोई शिकायत नहीं मिली।',
    status_filter_label: 'स्थिति अनुसार फ़िल्टर करें',

    // Home Page
    hero_badge: '🏛️ नगर निगम स्मार्ट प्रशासन',
    hero_title_1: 'सशक्त नागरिक।',
    hero_title_2: 'बदलता हमारा शहर।',
    hero_desc: 'स्मार्ट सिटी पोर्टल के माध्यम से सड़क के गड्ढे, कचरा, सीवेज और स्ट्रीट लाइट की समस्याएं जीपीएस और एआई तकनीक से तुरंत नगर निगम को दर्ज करें।',
    hero_report_btn: '+ समस्या दर्ज करें',
    hero_map_btn: '🗺️ शहर हीट मैप देखें',
    live_overview: 'लाइव नगर निगम अवलोकन',
    total_reports: 'कुल शिकायतें',
    active_pipeline: 'प्रगति पर',
    successfully_resolved: 'सफलतापूर्वक समाधान',
    resolution_rate: 'समाधान दर',
    browse_categories: 'श्रेणी अनुसार समस्याएं',
    how_it_works: 'यह प्रणाली कैसे काम करती है',
    step1_title: '1. जीपीएस से दर्ज करें',
    step1_desc: 'कैमरे से फोटो लें। AI स्वतः श्रेणी और जीपीएस स्थान की पहचान करता है।',
    step2_title: '2. संबंधित विभाग को आवंटन',
    step2_desc: 'शिकायत संबंधित नगर निगम विभाग को तुरंत प्रेषित की जाती है।',
    step3_title: '3. फील्ड में समाधान',
    step3_desc: 'नगर निगम दल समस्या का समाधान कर साक्ष्य तस्वीर अपलोड करता है।',
    step4_title: '4. रेटिंग एवं प्रमाण पत्र',
    step4_desc: 'समाधान की समीक्षा करें, रेटिंग दें और आधिकारिक पीडीएफ प्रमाण पत्र डाउनलोड करें।',
    recent_reports: 'हाल की नागरिक शिकायतें',
    view_all_complaints: 'सभी शिकायतें देखें →',

    // Details Page
    back_to_complaints: '← शिकायतों की सूची पर लौटें',
    edit_complaint: 'शिकायत संपादित करें',
    delete_complaint: 'शिकायत हटाएं',
    timeline_title: '⏱️ समाधान प्रगति समयरेखा',
    citizen_feedback_title: '⭐ नागरिक संतुष्टि रेटिंग एवं प्रतिक्रिया',
    citizen_feedback_subtitle: 'नगर निगम द्वारा किए गए कार्य की गुणवत्ता का मूल्यांकन करें।',
    rate_comment_placeholder: 'समस्या के समाधान पर अपनी राय लिखें...',
    submit_rating_btn: 'रेटिंग सबमिट करें',
    before_resolution_label: '📸 समाधान से पहले (नागरिक साक्ष्य)',
    after_resolution_label: '✅ समाधान के बाद (सत्यापित साक्ष्य)',
    municipal_remarks: 'आधिकारिक नगर निगम टिप्पणी / निर्देश',

    // AI Copilot
    copilot_title: 'स्मार्ट सिटी AI सहायक',
    copilot_btn: 'स्मार्ट सिटी AI सहायक',
    copilot_welcome: '👋 नमस्ते! शिकायत दर्ज करने, समाधान समय या आपातकालीन हेल्पलाइन के बारे में पूछें।'
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('smartcity_language') || 'en'
  })

  function setLanguage(lang) {
    if (translations[lang]) {
      setLanguageState(lang)
      localStorage.setItem('smartcity_language', lang)
    }
  }

  function t(key) {
    const currentDict = translations[language] || translations.en
    return currentDict[key] || translations.en[key] || key
  }

  // Voice recognition locale mapping
  const speechLocale = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, speechLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}
