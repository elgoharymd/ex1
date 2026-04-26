const splashScreen = document.getElementById('splashScreen');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const tipText = document.getElementById('tipText');
const frame = document.getElementById('secureFrame');
const errorContainer = document.getElementById('errorContainer');

const tips = [
    { icon: "fa-brain", text: "الدوبامين هو مفتاح التحفيز والمكافأة في الدماغ" },
    { icon: "fa-heart", text: "الرياضة تزيد إفراز الدوبامين بشكل طبيعي" },
    { icon: "fa-music", text: "الاستماع للموسيقى يحفز إفراز الدوبامين" },
    { icon: "fa-sun", text: "التعرض لأشعة الشمس يزيد من مستويات الدوبامين" },
    { icon: "fa-apple-alt", text: "الأطعمة الغنية بالتيروزين تعزز إنتاج الدوبامين" },
    { icon: "fa-bed", text: "النوم الجيد ينظم مستويات الدوبامين في الدماغ" },
    { icon: "fa-hand-peace", text: "التأمل يزيد من إفراز الدوبامين" },
    { icon: "fa-chart-line", text: "تحديد الأهداف الصغيرة يحفز إفراز الدوبامين" }
];

let progress = 0;
let tipIndex = 0;
let loadInterval;
let tipInterval;
let retryCount = 0;
const maxRetries = 3;

function updateProgress() {
    if (progress < 100) {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        progressFill.style.width = progress + '%';
        progressText.innerText = `جاري التحميل ${Math.floor(progress)}%`;
    }
}

function changeTip() {
    tipIndex = (tipIndex + 1) % tips.length;
    const tip = tips[tipIndex];
    tipText.innerHTML = `<i class="fas ${tip.icon}"></i> ${tip.text}`;
    tipText.style.opacity = '0';
    setTimeout(() => {
        tipText.style.opacity = '1';
    }, 300);
}

function startLoadingAnimation() {
    loadInterval = setInterval(updateProgress, 200);
    tipInterval = setInterval(changeTip, 4000);
}

function finishLoading() {
    clearInterval(loadInterval);
    clearInterval(tipInterval);
    progressFill.style.width = '100%';
    progressText.innerText = 'جاري التحميل 100%';
    setTimeout(() => {
        splashScreen.classList.add('hide');
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 800);
    }, 500);
}

function showError() {
    errorContainer.classList.add('show');
}

function hideError() {
    errorContainer.classList.remove('show');
}

let loadTimeout;

function startLoadTimer() {
    clearTimeout(loadTimeout);
    loadTimeout = setTimeout(function() {
        if (!frame.classList.contains('visible')) {
            if (retryCount < maxRetries) {
                retryCount++;
                console.log('محاولة إعادة التحميل رقم', retryCount);
                frame.src = 'project/index.html';
                startLoadTimer();
            } else {
                showError();
                finishLoading();
            }
        }
    }, 8000);
}

frame.addEventListener('load', function() {
    clearTimeout(loadTimeout);
    retryCount = 0;
    frame.classList.add('visible');
    finishLoading();
});

window.reloadSecureApp = function() {
    hideError();
    frame.classList.remove('visible');
    frame.src = 'project/index.html';
    retryCount = 0;
    startLoadTimer();
    splashScreen.classList.remove('hide');
    splashScreen.style.display = 'flex';
    progress = 0;
    progressFill.style.width = '0%';
    progressText.innerText = 'جاري التحميل 0%';
    startLoadingAnimation();
};

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

document.addEventListener('copy', function(e) {
    e.preventDefault();
    return false;
});

const noop = function() {};
if (typeof window.console !== 'undefined') {
    const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace'];
    for (let i = 0; i < methods.length; i++) {
        if (window.console[methods[i]]) {
            window.console[methods[i]] = noop;
        }
    }
}

function generateWatermark() {
    const watermark = document.getElementById('watermark');
    if (watermark) {
        const timestamp = Date.now().toString(36);
        watermark.innerHTML = `🔒 ${timestamp}`;
    }
}

function generateVisitCounter() {
    const counter = document.getElementById('visitCounter');
    if (counter) {
        const randomVisits = Math.floor(Math.random() * 5000) + 1000;
        counter.innerHTML = `👥 ${randomVisits.toLocaleString()} زائر اليوم`;
    }
}

startLoadingAnimation();
startLoadTimer();
generateWatermark();
generateVisitCounter();

console.log("%c⚠️ هذا الموقع محمي. جميع المحاولات مسجلة.", "color: red; font-size: 14px;");
