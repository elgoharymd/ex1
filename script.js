<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=yes">
    
    <title>دوبامين | المركز العلمي للدوبامين</title>
    <meta name="description" content="المركز العلمي المتخصص في الدوبامين - أحدث الأبحاث والتقارير العلمية">
    <meta name="robots" content="index, follow">
    
    <meta property="og:title" content="دوبامين | المركز العلمي للدوبامين">
    <meta property="og:description" content="منصة علمية متخصصة في الدوبامين">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="ar_AR">
    
    <link rel="icon" type="image/jpeg" href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2Xrst_-NA_H-l97_0RgyhAuotWFS2I2MI1A4uVBidAIYPCbajJumUTdar9u55C-VF7tKq4m_MUza7zBtxbV0hTTY_wojRA_ZNIfKVmThAuxDaFaO3CYpMOupFYpSsxSj1Kj9m7QDfHxgULcD89zvsQd3KRUKqZVAMlCgl0XivNh-amFmq6_ZzQJ4j2225/s729/18.jpg%20(1).jpeg">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }
        
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #0a0e27;
            height: 100vh;
            width: 100vw;
            position: fixed;
            font-family: 'Cairo', system-ui, sans-serif;
        }
        
        /* شاشة التحميل */
        .splash-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0f172a 100%);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }
        
        .splash-screen.hide {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }
        
        /* الخلفية المتحركة */
        .splash-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        
        .splash-bg .circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.1);
            animation: floatBg 20s infinite linear;
        }
        
        .splash-bg .circle:nth-child(1) { width: 300px; height: 300px; top: -100px; right: -100px; animation-duration: 25s; }
        .splash-bg .circle:nth-child(2) { width: 200px; height: 200px; bottom: -50px; left: -50px; animation-duration: 18s; animation-delay: -5s; }
        .splash-bg .circle:nth-child(3) { width: 150px; height: 150px; top: 50%; left: 20%; animation-duration: 22s; animation-delay: -10s; }
        .splash-bg .circle:nth-child(4) { width: 400px; height: 400px; bottom: -150px; right: -150px; animation-duration: 30s; animation-delay: -15s; }
        .splash-bg .circle:nth-child(5) { width: 100px; height: 100px; top: 20%; right: 30%; animation-duration: 15s; animation-delay: -3s; }
        
        @keyframes floatBg {
            0% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        .splash-content {
            text-align: center;
            z-index: 10;
            animation: fadeInUp 0.8s ease-out;
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* اللوجو الدائري */
        .splash-logo {
            width: 130px;
            height: 130px;
            margin: 0 auto 30px;
            background: url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2Xrst_-NA_H-l97_0RgyhAuotWFS2I2MI1A4uVBidAIYPCbajJumUTdar9u55C-VF7tKq4m_MUza7zBtxbV0hTTY_wojRA_ZNIfKVmThAuxDaFaO3CYpMOupFYpSsxSj1Kj9m7QDfHxgULcD89zvsQd3KRUKqZVAMlCgl0XivNh-amFmq6_ZzQJ4j2225/s729/18.jpg%20(1).jpeg') center/cover no-repeat;
            border-radius: 50%;
            animation: logoPulse 1.5s ease-in-out infinite, logoGlow 2s ease-in-out infinite;
            border: 3px solid rgba(59, 130, 246, 0.4);
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
        }
        
        @keyframes logoPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
        }
        
        @keyframes logoGlow {
            0%, 100% { filter: drop-shadow(0 0 15px rgba(59,130,246,0.3)); }
            50% { filter: drop-shadow(0 0 35px rgba(59,130,246,0.7)); }
        }
        
        .splash-title {
            font-size: 32px;
            font-weight: 800;
            background: linear-gradient(135deg, #fff, #93c5fd);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: titleGlow 2s ease-in-out infinite;
        }
        
        @keyframes titleGlow {
            0%, 100% { text-shadow: 0 0 10px rgba(59,130,246,0.3); }
            50% { text-shadow: 0 0 25px rgba(59,130,246,0.6); }
        }
        
        .splash-subtitle {
            font-size: 14px;
            color: rgba(255,255,255,0.6);
            margin-bottom: 40px;
        }
        
        .loader-wrapper {
            width: 280px;
            margin: 0 auto 25px;
        }
        
        .progress-bar-container {
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.15);
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 12px;
        }
        
        .progress-bar-fill {
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6);
            background-size: 200% 100%;
            border-radius: 10px;
            transition: width 0.3s ease;
            animation: gradientMove 1.5s linear infinite;
        }
        
        @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }
        
        .progress-text {
            color: rgba(255,255,255,0.8);
            font-size: 13px;
            text-align: center;
        }
        
        .loading-dots {
            display: inline-flex;
            gap: 4px;
            margin-top: 20px;
        }
        
        .loading-dots span {
            width: 8px;
            height: 8px;
            background: #3b82f6;
            border-radius: 50%;
            display: inline-block;
            animation: dotBounce 1.4s ease-in-out infinite;
        }
        
        .loading-dots span:nth-child(1) { animation-delay: 0s; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        .loading-dots span:nth-child(4) { animation-delay: 0.6s; }
        
        @keyframes dotBounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
            40% { transform: scale(1); opacity: 1; }
        }
        
        .tips-container {
            position: absolute;
            bottom: 50px;
            left: 0;
            right: 0;
            text-align: center;
        }
        
        .tip-text {
            color: rgba(255,255,255,0.4);
            font-size: 12px;
            transition: opacity 0.3s ease;
        }
        
        .tip-text i { margin-left: 6px; color: #3b82f6; }
        
        .secure-iframe {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            background: white;
            opacity: 0;
            transition: opacity 0.6s ease;
            z-index: 9990;
        }
        
        .secure-iframe.visible { opacity: 1; }
        
        .error-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10,14,39,0.98);
            backdrop-filter: blur(15px);
            z-index: 10001;
            display: none;
            justify-content: center;
            align-items: center;
        }
        
        .error-container.show { display: flex; animation: fadeIn 0.4s ease; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .error-card {
            background: white;
            padding: 35px 30px;
            border-radius: 32px;
            text-align: center;
            max-width: 350px;
            width: 85%;
        }
        
        .error-card i { font-size: 55px; color: #ef4444; margin-bottom: 18px; }
        .error-card h3 { color: #1e293b; margin-bottom: 10px; }
        .error-card p { color: #64748b; margin-bottom: 25px; }
        .error-card button {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            border: none;
            padding: 12px 28px;
            border-radius: 40px;
            cursor: pointer;
        }
        
        .watermark {
            position: fixed;
            bottom: 8px;
            right: 8px;
            font-size: 9px;
            color: rgba(0,0,0,0.1);
            z-index: 10002;
            pointer-events: none;
        }
        
        body { overflow: hidden; }
    </style>
</head>
<body>

    <!-- شاشة التحميل -->
    <div class="splash-screen" id="splashScreen">
        <div class="splash-bg">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
        </div>
        
        <div class="splash-content">
            <div class="splash-logo"></div>
            <h1 class="splash-title">دوبامين</h1>
            <p class="splash-subtitle">المركز العلمي المتقدم</p>
            
            <div class="loader-wrapper">
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" id="progressFill"></div>
                </div>
                <div class="progress-text" id="progressText">جاري التحميل 0%</div>
            </div>
            
            <div class="loading-dots">
                <span></span><span></span><span></span><span></span>
            </div>
        </div>
        
        <div class="tips-container">
            <div class="tip-text" id="tipText">
                <i class="fas fa-brain"></i> الدوبامين هو مفتاح التحفيز والمكافأة في الدماغ
            </div>
        </div>
    </div>

    <!-- الإطار المحمي - يستدعي project/index.html -->
    <iframe id="secureFrame" class="secure-iframe" src="project/index.html" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-top-navigation allow-popups-to-escape-sandbox" loading="eager"></iframe>

    <div class="watermark" id="watermark"></div>

    <div class="error-container" id="errorContainer">
        <div class="error-card">
            <i class="fas fa-wifi"></i>
            <h3>حدث خطأ في الاتصال</h3>
            <p>يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة</p>
            <button onclick="reloadSecureApp()">إعادة المحاولة</button>
        </div>
    </div>

    <script>
        // عناصر الشاشة
        const splashScreen = document.getElementById('splashScreen');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const tipText = document.getElementById('tipText');
        const frame = document.getElementById('secureFrame');
        const errorContainer = document.getElementById('errorContainer');
        
        // النصائح
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
        let loadInterval, tipInterval;
        
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
            setTimeout(() => { tipText.style.opacity = '1'; }, 300);
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
                setTimeout(() => { splashScreen.style.display = 'none'; }, 800);
            }, 500);
        }
        
        startLoadingAnimation();
        
        let loadTimeout;
        let retryCount = 0;
        const maxRetries = 3;
        
        function showError() { errorContainer.classList.add('show'); }
        function hideError() { errorContainer.classList.remove('show'); }
        
        function startLoadTimer() {
            clearTimeout(loadTimeout);
            loadTimeout = setTimeout(() => {
                if (!frame.classList.contains('visible')) {
                    if (retryCount < maxRetries) {
                        retryCount++;
                        frame.src = 'project/index.html';
                        startLoadTimer();
                    } else {
                        showError();
                        finishLoading();
                    }
                }
            }, 8000);
        }
        
        frame.addEventListener('load', () => {
            clearTimeout(loadTimeout);
            retryCount = 0;
            frame.classList.add('visible');
            finishLoading();
        });
        
        startLoadTimer();
        
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
        
        // حماية
        (function() {
            const blockedKeys = [
                { key: 'F12', preventDefault: true },
                { key: 'I', ctrl: true, shift: true, preventDefault: true },
                { key: 'J', ctrl: true, shift: true, preventDefault: true },
                { key: 'C', ctrl: true, shift: true, preventDefault: true },
                { key: 'u', ctrl: true, preventDefault: true },
                { key: 's', ctrl: true, preventDefault: true },
                { key: 'p', ctrl: true, preventDefault: true },
                { key: 'F5', preventDefault: true }
            ];
            document.addEventListener('keydown', function(e) {
                for (let blocker of blockedKeys) {
                    let match = true;
                    if (blocker.key && e.key !== blocker.key) match = false;
                    if (blocker.ctrl && !e.ctrlKey) match = false;
                    if (blocker.shift && !e.shiftKey) match = false;
                    if (match && blocker.preventDefault) {
                        e.preventDefault();
                        return false;
                    }
                }
            });
        })();
        
        document.addEventListener('contextmenu', e => { e.preventDefault(); return false; });
        document.addEventListener('dragstart', e => { e.preventDefault(); return false; });
        document.addEventListener('drop', e => { e.preventDefault(); return false; });
        document.addEventListener('selectstart', e => { e.preventDefault(); return false; });
        document.addEventListener('copy', e => { e.preventDefault(); return false; });
        
        (function() {
            const noop = function() {};
            if (typeof window.console !== 'undefined') {
                const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace'];
                for (let i = 0; i < methods.length; i++) {
                    if (window.console[methods[i]]) window.console[methods[i]] = noop;
                }
            }
        })();
        
        document.getElementById('watermark').innerHTML = `🔒 ${Date.now().toString(36)}`;
        
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css';
        document.head.appendChild(fontAwesome);
        
        const googleFont = document.createElement('link');
        googleFont.rel = 'stylesheet';
        googleFont.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(googleFont);
    </script>
</body>
</html>
