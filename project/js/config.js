// =============== Tailwind Configuration ===============
tailwind.config = {
    theme: {
        extend: {
            fontFamily: { 'cairo': ['Cairo', 'sans-serif'] }
        }
    }
};

// =============== Firebase Configuration ===============
const firebaseConfig = {
    apiKey: "AIzaSyCuYQh5gqlss3gdRjpSPZm-zShiwSAtetQ",
    authDomain: "prmaga1.firebaseapp.com",
    databaseURL: "https://prmaga1-default-rtdb.firebaseio.com/",
    projectId: "prmaga1",
    storageBucket: "prmaga1.firebasestorage.app",
    messagingSenderId: "750206146558",
    appId: "1:750206146558:web:43ca060ad36e830ca252af"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// =============== Default Quiz Questions ===============
const defaultQuiz = [
    { text: "كم مرة تشعر برغبة ملحة في التحقق من هاتفك ووسائل التواصل الاجتماعي؟", options: ["دائمًا", "كثيرًا", "أحيانًا", "نادرًا"], scores: [4,3,2,1] },
    { text: "هل تجد صعوبة في التوقف عن استخدام الأجهزة الإلكترونية؟", options: ["دائمًا", "كثيرًا", "أحيانًا", "نادرًا"], scores: [4,3,2,1] },
    { text: "كم مرة تتناول الطعام بدافع الملل أو التوتر؟", options: ["دائمًا", "كثيرًا", "أحيانًا", "نادرًا"], scores: [4,3,2,1] },
    { text: "هل تشعر بالنشوة عند شراء أشياء جديدة؟", options: ["دائمًا", "كثيرًا", "أحيانًا", "نادرًا"], scores: [4,3,2,1] },
    { text: "كم مرة تقضي ساعات في مشاهدة المقاطع القصيرة؟", options: ["دائمًا", "كثيرًا", "أحيانًا", "نادرًا"], scores: [4,3,2,1] }
];
