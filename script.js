const targetUrl = "https://dopaminea.com";

const splashScreen = document.getElementById('splashScreen');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const tipText = document.getElementById('tipText');
const frame = document.getElementById('secureFrame');

let progress = 0;
let loadInterval;
let tipInterval;
let retryCount = 0;
const maxRetries = 5; // عدد محاولات إعادة التحميل

// نصائح سريعة
const tips = [
    { icon: "fa-brain", text: "الدوبامين هو مفتاح التحفيز والمكافأة في الدماغ" },
    { icon: "fa-heart", text: "الرياضة تزيد إفراز الدوبامين بشكل طبيعي" },
    { icon: "fa-music", text: "الاستماع للموسيقى يحفز إفراز الدوبامين" }
];

// تحديث شريط التحميل بسرعة
function updateProgress() {
    if (progress < 100) {
        progress += Math.random() * 20 + 15;
        if (progress > 100) progress = 100;
        progressFill.style.width = progress + '%';
        progressText.innerText = `جاري التحميل ${Math.floor(progress)}%`;
        
        if (progress >= 100) {
            clearInterval(loadInterval);
        }
    }
}

// تغيير النصائح
function changeTip() {
    if (tips.length > 1) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        tipText.innerHTML = `<i class="fas ${randomTip.icon}"></i> ${randomTip.text}`;
    }
}

function startLoadingAnimation() {
    loadInterval = setInterval(updateProgress, 40);
    tipInterval = setInterval(changeTip, 2500);
}

function finishLoading() {
    clearInterval(loadInterval);
    clearInterval(tipInterval);
    progressFill.style.width = '100%';
    progressText.innerText = 'جاري فتح الموقع...';
    
    setTimeout(() => {
        splashScreen.classList.add('hide');
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 300);
    }, 200);
}

// إعادة المحاولة بدون ظهور رسالة خطأ
function retryLoad() {
    if (retryCount < maxRetries) {
        retryCount++;
        console.log('إعادة محاولة التحميل رقم', retryCount);
        
        // تغيير النص عشان المستحس يقفلش
        progressText.innerText = `إعادة المحاولة ${retryCount}/${maxRetries}...`;
        
        // إعادة تحميل الإطار
        frame.src = targetUrl;
        
        // لو وصل لآخر محاولة، نزيد وقت الانتظار
        let timeoutDuration = 3000;
        if (retryCount >= maxRetries) {
            timeoutDuration = 5000;
            progressText.innerText = 'جاري الاتصال بالخادم...';
        }
        
        loadTimeout = setTimeout(() => {
            if (!frame.classList.contains('visible')) {
                retryLoad();
            }
        }, timeoutDuration);
    } else {
        // لو فشلت كل المحاولات، نخلي شاشة التحميل بس من غير رسالة خطأ
        progressText.innerText = 'جاري المحاولة مرة أخرى...';
        // نعيد المحاولات من الصفر بعد 5 ثواني
        setTimeout(() => {
            retryCount = 0;
            retryLoad();
        }, 5000);
    }
}

let loadTimeout;

function startLoadTimer() {
    clearTimeout(loadTimeout);
    loadTimeout = setTimeout(() => {
        if (!frame.classList.contains('visible')) {
            retryLoad();
        }
    }, 2000);
}

// لما الإطار يخلص تحميل
frame.addEventListener('load', function() {
    clearTimeout(loadTimeout);
    retryCount = 0;
    frame.classList.add('visible');
    finishLoading();
});

// لو حصل خطأ في الإطار، نحاول تاني
frame.addEventListener('error', function() {
    console.log('خطأ في تحميل الإطار');
    if (!frame.classList.contains('visible')) {
        retryLoad();
    }
});

// بدء التحميل
startLoadingAnimation();
startLoadTimer();

// حماية الموقع
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => e.preventDefault());
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('copy', (e) => e.preventDefault());

// تعطيل الكونسول
const noop = () => {};
if (typeof window.console !== 'undefined') {
    ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace'].forEach(method => {
        if (window.console[method]) window.console[method] = noop;
    });
}

// علامة مائية وعداد زوار
function generateWatermark() {
    const watermark = document.getElementById('watermark');
    if (watermark) {
        watermark.innerHTML = `🔒 ${Date.now().toString(36)}`;
    }
}

function generateVisitCounter() {
    const counter = document.getElementById('visitCounter');
    if (counter) {
        const randomVisits = Math.floor(Math.random() * 5000) + 1000;
        counter.innerHTML = `👥 ${randomVisits.toLocaleString()} زائر اليوم`;
    }
}

generateWatermark();
generateVisitCounter();
