const targetUrl = "https://dopaminea.com";

const splashScreen = document.getElementById('splashScreen');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const tipText = document.getElementById('tipText');
const frame = document.getElementById('secureFrame');
const errorContainer = document.getElementById('errorContainer');

// تم تقليل عدد النصائح عشان التحميل أسرع
const tips = [
    { icon: "fa-brain", text: "الدوبامين هو مفتاح التحفيز والمكافأة في الدماغ" }
];

let progress = 0;
let tipIndex = 0;
let loadInterval;
let tipInterval;
let retryCount = 0;
const maxRetries = 2; // تم تقليل عدد المحاولات

// تم زيادة سرعة التحميل بشكل كبير
function updateProgress() {
    if (progress < 100) {
        progress += Math.random() * 30 + 20; // زيادة سرعة التحميل
        if (progress > 100) progress = 100;
        progressFill.style.width = progress + '%';
        progressText.innerText = `جاري التحميل ${Math.floor(progress)}%`;
        
        // لو وصل 100% ننهي فوراً
        if (progress >= 100) {
            clearInterval(loadInterval);
        }
    }
}

function changeTip() {
    // تم تقليل تغيير النصائح عشان أسرع
    if (tips.length > 1) {
        tipIndex = (tipIndex + 1) % tips.length;
        const tip = tips[tipIndex];
        tipText.innerHTML = `<i class="fas ${tip.icon}"></i> ${tip.text}`;
    }
}

function startLoadingAnimation() {
    loadInterval = setInterval(updateProgress, 30); // من 200ms إلى 30ms (أسرع)
    tipInterval = setInterval(changeTip, 2000); // من 4000ms إلى 2000ms
}

function finishLoading() {
    clearInterval(loadInterval);
    clearInterval(tipInterval);
    progressFill.style.width = '100%';
    progressText.innerText = 'تم التحميل بنجاح 100%';
    
    // إخفاء شاشة التحميل فوراً خلال 200ms بدل 800ms
    setTimeout(() => {
        splashScreen.classList.add('hide');
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 200);
    }, 100);
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
    // تم تقليل وقت الانتظار من 8000ms إلى 2000ms
    loadTimeout = setTimeout(function() {
        if (!frame.classList.contains('visible')) {
            if (retryCount < maxRetries) {
                retryCount++;
                console.log('محاولة إعادة التحميل رقم', retryCount);
                frame.src = targetUrl;
                startLoadTimer();
            } else {
                showError();
                finishLoading();
            }
        }
    }, 2000);
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
    frame.src = targetUrl;
    retryCount = 0;
    startLoadTimer();
    splashScreen.classList.remove('hide');
    splashScreen.style.display = 'flex';
    progress = 0;
    progressFill.style.width = '0%';
    progressText.innerText = 'جاري التحميل 0%';
    startLoadingAnimation();
};

// حماية الموقع
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
