// =============== Global Variables ===============
let currentSectionData = {};
let quizQuestions = [];
let userAnswers = [];
let currentQuestionIndex = 0;
let autoAdvanceTimer = null;

// =============== Quiz Functions ===============
async function loadQuiz() {
    const snap = await db.ref('quiz/questions').once('value');
    quizQuestions = snap.exists() ? snap.val() : defaultQuiz;
    userAnswers = new Array(quizQuestions.length).fill(-1);
    currentQuestionIndex = 0;
}

function renderFullscreenQuiz() {
    const container = document.getElementById('fullscreenQuizContainer');
    if (!container || quizQuestions.length === 0) return;
    
    const currentQ = quizQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;
    const selectedAnswer = userAnswers[currentQuestionIndex];
    
    let html = `
        <div class="quiz-container">
            <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="quiz-counter">السؤال ${currentQuestionIndex + 1} من ${quizQuestions.length}</div>
            <div class="quiz-question-wrapper">
                <div class="quiz-question-text">${escapeHtml(currentQ.text)}</div>
                <div class="quiz-options-grid">
                    ${currentQ.options.map((opt, idx) => `<div class="quiz-option-card ${selectedAnswer === idx ? 'selected' : ''}" data-opt-index="${idx}">${escapeHtml(opt)}</div>`).join('')}
                </div>
            </div>
            <div class="quiz-nav-buttons">
                <button class="quiz-nav-btn prev" id="prevBtn" ${currentQuestionIndex === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}><i class="fas fa-arrow-right ml-1"></i> السابق</button>
                ${currentQuestionIndex === quizQuestions.length - 1 ? 
                    `<button class="quiz-nav-btn submit" id="submitBtn"><i class="fas fa-chart-line ml-1"></i> عرض النتيجة</button>` : 
                    `<button class="quiz-nav-btn next" id="nextBtn" ${selectedAnswer === -1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>التالي <i class="fas fa-arrow-left mr-1"></i></button>`
                }
            </div>
        </div>
    `;
    container.innerHTML = html;
    
    document.querySelectorAll('#fullscreenQuizContainer .quiz-option-card').forEach(opt => {
        opt.addEventListener('click', () => {
            if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
            const optIndex = parseInt(opt.dataset.optIndex);
            userAnswers[currentQuestionIndex] = optIndex;
            
            document.querySelectorAll('#fullscreenQuizContainer .quiz-option-card').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) {
                nextBtn.disabled = false;
                nextBtn.style.opacity = '1';
                nextBtn.style.cursor = 'pointer';
            }
            
            if (currentQuestionIndex < quizQuestions.length - 1) {
                autoAdvanceTimer = setTimeout(() => {
                    nextQuestion();
                }, 500);
            }
        });
    });
    
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                renderFullscreenQuiz();
            }
        });
    }
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
            if (userAnswers[currentQuestionIndex] !== -1) {
                nextQuestion();
            }
        });
    }
    
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
            if (userAnswers[currentQuestionIndex] !== -1) {
                calculateAndShowResult();
            } else {
                Swal.fire({ title: "لم تكتمل الإجابة", text: "الرجاء الإجابة على السؤال الحالي أولاً", icon: "warning" });
            }
        });
    }
}

function nextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        renderFullscreenQuiz();
        const modalContent = document.querySelector('.fullscreen-content');
        if (modalContent) modalContent.scrollTop = 0;
    }
}

function calculateScore() {
    let total = 0, max = quizQuestions.length * 4;
    for (let i = 0; i < quizQuestions.length; i++) {
        total += userAnswers[i] !== -1 ? quizQuestions[i].scores[userAnswers[i]] : 1;
    }
    return Math.round((total / max) * 100);
}

async function calculateAndShowResult() {
    let unanswered = [];
    for (let i = 0; i < quizQuestions.length; i++) if (userAnswers[i] === -1) unanswered.push(i+1);
    if (unanswered.length) {
        Swal.fire({ title: "أسئلة غير مكتملة", text: `الرجاء الإجابة على الأسئلة: ${unanswered.join(', ')}`, icon: "warning" });
        return;
    }
    
    const percentage = calculateScore();
    let resultClass = '', title = '', message = '', advice = '', icon = '';
    if (percentage <= 40) {
        resultClass = 'result-normal';
        title = '🟢 درجة إدمان منخفضة';
        message = 'ممتاز! مستوى اعتمادك طبيعي';
        advice = '✅ حافظ على عاداتك الصحية\n✅ مارس الهوايات الإيجابية';
        icon = 'fa-face-smile';
    } else if (percentage <= 60) {
        resultClass = 'result-recovery';
        title = '🟡 درجة إدمان متوسطة';
        message = 'لديك بعض السلوكيات الزائدة';
        advice = '📱 قلل استخدام وسائل التواصل\n🏃 مارس الرياضة يومياً';
        icon = 'fa-face-meh';
    } else {
        resultClass = 'result-severe';
        title = '🔴 درجة إدمان عالية';
        message = 'يوجد اعتماد شديد على الدوبامين';
        advice = '⚠️ ننصحك باستشارة طبيب نفسي';
        icon = 'fa-face-frown';
    }
    
    const resultDiv = document.getElementById('fullscreenQuizResult');
    resultDiv.innerHTML = `
        <div class="${resultClass} result-card">
            <i class="fas ${icon} text-5xl mb-4 text-white"></i>
            <h3 class="text-2xl font-bold mb-4 text-white">${title}</h3>
            <div class="score-circle">
                <span class="text-5xl font-bold text-white">${percentage}%</span>
                <span class="text-sm opacity-90 text-white">نسبة الإدمان</span>
            </div>
            <p class="text-lg mb-4 text-white">${message}</p>
            <div class="bg-white/20 rounded-xl p-4 mt-4"><p class="text-sm whitespace-pre-line text-white">📋 ${advice}</p></div>
            <div class="flex gap-3 justify-center mt-6">
                <button onclick="resetFullscreenQuiz()" class="px-6 py-2 bg-white text-gray-800 rounded-xl font-semibold transition-all hover:scale-105">إعادة الاختبار</button>
                <button onclick="shareResult(${percentage})" class="px-6 py-2 bg-white/20 text-white rounded-xl font-semibold transition-all hover:scale-105">مشاركة</button>
            </div>
        </div>
    `;
    resultDiv.classList.remove('hidden');
    try { await db.ref('quiz_results').push().set({ percentage, date: new Date().toISOString() }); } catch(e) {}
}

function resetFullscreenQuiz() {
    if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
    userAnswers.fill(-1);
    currentQuestionIndex = 0;
    renderFullscreenQuiz();
    const resultDiv = document.getElementById('fullscreenQuizResult');
    if (resultDiv) resultDiv.classList.add('hidden');
}

function shareResult(percentage) {
    shareItem(`نتيجتي في مقياس إدمان الدوبامين: ${percentage}%`, window.location.href);
}

function closeFullscreenModal() {
    if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
    const modal = document.getElementById('fullscreenModal');
    modal.classList.remove('show');
}

// =============== Fullscreen Section Functions ===============
async function openSectionFullscreen(sectionId) {
    const modal = document.getElementById('fullscreenModal');
    const modalContent = document.getElementById('fullscreenModalContent');
    modalContent.innerHTML = '<div class="text-center py-10"><i class="fas fa-spinner fa-spin text-3xl" style="color: var(--primary);"></i><p class="mt-3">جاري التحميل...</p></div>';
    modal.classList.add('show');
    await loadSectionData(sectionId);
    renderFullscreenContent(sectionId, modalContent);
}

async function loadSectionData(sectionId) {
    if (sectionId === 'hero') {
        const texts = await loadTexts();
        currentSectionData = { title: 'الرئيسية', icon: 'fa-home', texts: texts };
        return;
    }
    if (sectionId === 'quiz') {
        await loadQuiz();
        currentSectionData = { title: 'مقياس إدمان الدوبامين', icon: 'fa-chart-line' };
        return;
    }
    const snap = await db.ref(sectionId).once('value');
    const data = snap.val();
    let title = '', icon = '';
    switch(sectionId) {
        case 'reports': title = 'التقارير العلمية'; icon = 'fa-newspaper'; break;
        case 'articles': title = 'المقالات العلمية'; icon = 'fa-pen-fancy'; break;
        case 'news': title = 'أخبار الدوبامين'; icon = 'fa-bullhorn'; break;
        case 'interviews': title = 'حوارات وخبراء'; icon = 'fa-comments'; break;
        case 'investigations': title = 'التحقيقات'; icon = 'fa-microscope'; break;
        case 'infographics': title = 'الإنفوجرافيك'; icon = 'fa-chart-pie'; break;
        case 'videos': title = 'الفيديوهات'; icon = 'fa-video'; break;
        default: title = sectionId; icon = 'fa-folder';
    }
    currentSectionData = { title: title, icon: icon, data: data, sectionId: sectionId };
}

function renderFullscreenContent(sectionId, container) {
    if (sectionId === 'hero') {
        const texts = currentSectionData.texts;
        const logoUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2Xrst_-NA_H-l97_0RgyhAuotWFS2I2MI1A4uVBidAIYPCbajJumUTdar9u55C-VF7tKq4m_MUza7zBtxbV0hTTY_wojRA_ZNIfKVmThAuxDaFaO3CYpMOupFYpSsxSj1Kj9m7QDfHxgULcD89zvsQd3KRUKqZVAMlCgl0XivNh-amFmq6_ZzQJ4j2225/s729/18.jpg%20(1).jpeg";
        container.innerHTML = `<div class="text-center"><img src="${logoUrl}" class="w-32 h-32 rounded-full mx-auto mb-4 cursor-pointer" style="border: 3px solid var(--primary); box-shadow: 0 0 30px var(--glow-color);" onclick="openImageModal('${logoUrl}')"><h2 class="text-2xl md:text-3xl font-bold">${texts.heroTitle || 'الدوبامين'}</h2><p class="gradient-text text-xl mt-2">وعي رقمي = عقل سليم</p><p class="text-gray-500 dark:text-gray-400 mt-4">${texts.heroDesc || ''}</p><div class="flex gap-3 justify-center mt-6"><button onclick="closeFullscreenModal(); setTimeout(() => navigateToSection('reports'), 100)" class="px-6 py-2 rounded-xl text-white transition-all hover:scale-105" style="background: var(--primary);">استكشف</button><button onclick="closeFullscreenModal(); setTimeout(() => navigateToSection('quiz'), 300)" class="px-6 py-2 rounded-xl transition-all hover:scale-105" style="background: transparent; border: 2px solid var(--primary); color: var(--primary);">اختبر نفسك</button></div></div>`;
        return;
    }
    if (sectionId === 'quiz') {
        container.innerHTML = `<h2 class="flex items-center gap-2 mb-3"><i class="fas fa-chart-line" style="color: var(--primary);"></i> <span class="gradient-text">مقياس إدمان الدوبامين</span></h2><p class="text-gray-500 dark:text-gray-400 mb-4">اختبار علمي مكون من ${quizQuestions.length} سؤالاً</p><div id="fullscreenQuizContainer"></div><div id="fullscreenQuizResult" class="mt-6 hidden"></div>`;
        renderFullscreenQuiz();
        return;
    }
    
    const data = currentSectionData.data;
    let cardsHtml = '';
    if (data && Object.keys(data).length) {
        Object.entries(data).forEach(([id, item]) => {
            const shareUrl = `${window.location.origin}/?type=${sectionId}&id=${id}`;
            if (sectionId === 'videos') {
                const videoUrl = item.videoUrl || '';
                const embedUrl = getYouTubeEmbedUrl(videoUrl);
                cardsHtml += `<div class="premium-card" onclick="openInNewTab('?type=videos&id=${id}')"><div class="share-card-btn" onclick="event.stopPropagation(); shareItem('${escapeHtml(item.title)}', '${shareUrl}')"><i class="fas fa-share-alt"></i></div><div class="video-container"><iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe></div><div class="p-3"><h3 class="font-bold text-sm mt-2 line-clamp-2">${escapeHtml(item.title)}</h3><p class="text-xs mt-1 line-clamp-2" style="color: var(--text-secondary);">${escapeHtml(item.description || '')}</p></div></div>`;
            } else {
                const imageUrl = item.image || item.imageUrl || item.img || item.photo || '';
                cardsHtml += `<div class="premium-card" onclick="openInNewTab('?type=${sectionId}&id=${id}')"><div class="share-card-btn" onclick="event.stopPropagation(); shareItem('${escapeHtml(item.title)}', '${shareUrl}')"><i class="fas fa-share-alt"></i></div><div class="card-cover" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"></div><div class="p-3"><span class="text-xs px-2 py-0.5 rounded-full" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white;">${escapeHtml(item.date || '')}</span><h3 class="font-bold text-sm mt-2 line-clamp-2">${escapeHtml(item.title)}</h3><p class="text-xs mt-1 line-clamp-2" style="color: var(--text-secondary);">${escapeHtml(item.summary || '')}</p></div></div>`;
            }
        });
    } else {
        cardsHtml = `<div class="empty-state col-span-full text-center py-10"><i class="fas fa-inbox text-4xl text-gray-400"></i><p>لا توجد محتويات</p></div>`;
    }
    container.innerHTML = `<h2 class="flex items-center gap-2 mb-3"><i class="fas ${currentSectionData.icon}" style="color: var(--primary);"></i> <span class="gradient-text">${currentSectionData.title}</span></h2><div class="cards-container">${cardsHtml}</div>`;
}

// =============== Load Section (with image and video support) ===============
async function loadSection(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<div class="shimmer h-56"></div><div class="shimmer h-56"></div>';
    const snap = await db.ref(type).once('value');
    const data = snap.val();
    if (data && Object.keys(data).length) {
        container.innerHTML = '';
        Object.entries(data).forEach(([id, item]) => {
            const shareUrl = `${window.location.origin}/?type=${type}&id=${id}`;
            
            if (type === 'videos') {
                const videoUrl = item.videoUrl || '';
                const embedUrl = getYouTubeEmbedUrl(videoUrl);
                container.innerHTML += `
                    <div class="premium-card" onclick="openInNewTab('?type=videos&id=${id}')">
                        <div class="share-card-btn" onclick="event.stopPropagation(); shareItem('${escapeHtml(item.title)}', '${shareUrl}')">
                            <i class="fas fa-share-alt"></i>
                        </div>
                        <div class="video-container">
                            <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
                        </div>
                        <div class="p-3">
                            <h3 class="font-bold text-sm mt-2 line-clamp-2">${escapeHtml(item.title)}</h3>
                            <p class="text-xs mt-1 line-clamp-2" style="color: var(--text-secondary);">${escapeHtml(item.description || '')}</p>
                        </div>
                    </div>
                `;
            } else {
                const imageUrl = item.image || item.imageUrl || item.img || item.photo || '';
                container.innerHTML += `
                    <div class="premium-card" onclick="openInNewTab('?type=${type}&id=${id}')">
                        <div class="share-card-btn" onclick="event.stopPropagation(); shareItem('${escapeHtml(item.title)}', '${shareUrl}')">
                            <i class="fas fa-share-alt"></i>
                        </div>
                        <div class="card-cover" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"></div>
                        <div class="p-3">
                            <span class="text-xs px-2 py-0.5 rounded-full" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white;">${escapeHtml(item.date || '')}</span>
                            <h3 class="font-bold text-sm mt-2 line-clamp-2">${escapeHtml(item.title)}</h3>
                            <p class="text-xs mt-1 line-clamp-2" style="color: var(--text-secondary);">${escapeHtml(item.summary || '')}</p>
                        </div>
                    </div>
                `;
            }
        });
        initScrollReveal();
    } else {
        container.innerHTML = `<div class="empty-state col-span-full"><i class="fas fa-inbox"></i><h3>لا توجد محتويات</h3></div>`;
    }
}

// =============== Load Texts from Firebase ===============
async function loadTexts() {
    const snap = await db.ref('site_texts').once('value');
    const texts = snap.val() || {
        siteTitle: "دوبامين", headerTitle: "دوبامين", heroTitle: "الدوبامين",
        heroDesc: "استكشف أحدث الأبحاث والتقارير حول الناقل العصبي الأكثر تأثيرًا",
        reportsTitle: "التقارير العلمية", articlesTitle: "المقالات العلمية",
        newsTitle: "أخبار الدوبامين", interviewsTitle: "حوارات وخبراء",
        investigationsTitle: "التحقيقات", infographicsTitle: "الإنفوجرافيك",
        videosTitle: "الفيديوهات", quizTitle: "مقياس إدمان الدوبامين",
        footer: "© 2026 دوبامين وعي رقمي=عقل سليم"
    };
    document.title = texts.siteTitle;
    document.getElementById('headerTitle').innerText = texts.headerTitle;
    document.getElementById('footerText').innerText = texts.footer;
    return texts;
}

// =============== Load Counts ===============
async function loadCounts() {
    const reports = await db.ref('reports').once('value');
    document.getElementById('reportsCount') && (document.getElementById('reportsCount').innerText = reports.numChildren() || '0');
    const articles = await db.ref('articles').once('value');
    document.getElementById('articlesCount') && (document.getElementById('articlesCount').innerText = articles.numChildren() || '0');
    const news = await db.ref('news').once('value');
    document.getElementById('newsCount') && (document.getElementById('newsCount').innerText = news.numChildren() || '0');
    const interviews = await db.ref('interviews').once('value');
    document.getElementById('interviewsCount') && (document.getElementById('interviewsCount').innerText = interviews.numChildren() || '0');
    const quizResults = await db.ref('quiz_results').once('value');
    document.getElementById('quizCount') && (document.getElementById('quizCount').innerText = quizResults.numChildren() || '0');
    if (quizResults.exists()) {
        const vals = Object.values(quizResults.val());
        const avg = Math.round(vals.reduce((s,v) => s + (v.percentage||0), 0) / vals.length);
        document.getElementById('avgScore') && (document.getElementById('avgScore').innerText = avg + '%');
    }
}

// =============== Show Detail Page ===============
async function showDetailPage(type, id) {
    const main = document.getElementById('mainContent');
    main.innerHTML = '<div class="shimmer h-96 max-w-4xl mx-auto"></div>';
    try {
        const snap = await db.ref(`${type}/${id}`).once('value');
        const item = snap.val();
        if (!item) throw new Error();
        document.title = `${item.title} | دوبامين`;

        let typeName = '';
        switch(type) {
            case 'reports': typeName = 'تقرير علمي'; break;
            case 'articles': typeName = 'مقالة'; break;
            case 'news': typeName = 'خبر'; break;
            case 'interviews': typeName = 'حوار'; break;
            case 'investigations': typeName = 'تحقيق'; break;
            case 'infographics': typeName = 'إنفوجرافيك'; break;
            case 'videos': typeName = 'فيديو'; break;
            default: typeName = type;
        }

        let contentHtml = '';
        
        if (type === 'videos') {
            const videoUrl = item.videoUrl || '';
            const embedUrl = getYouTubeEmbedUrl(videoUrl);
            contentHtml = `
                <div class="video-container mb-4">
                    <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="prose max-w-none mt-4">${escapeHtml(item.description || '')}</div>
            `;
            main.innerHTML = `
                <div class="detail-container">
                    <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <span class="text-xs px-3 py-1 rounded-full" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white;">${typeName}</span>
                        <button onclick="shareItem('${escapeHtml(item.title)}', window.location.href)" class="share-btn"><i class="fas fa-share-alt ml-1"></i> مشاركة</button>
                    </div>
                    <h1 class="text-xl md:text-3xl font-bold mb-4">${escapeHtml(item.title)}</h1>
                    <div class="leading-relaxed" style="color: var(--text-secondary);">${contentHtml || '<p>لا يوجد محتوى</p>'}</div>
                    <div class="border-t mt-6 pt-4 text-center" style="border-color: var(--border-color);">
                        <button onclick="goBackToHome()" class="hover:underline" style="color: var(--primary); cursor: pointer;"><i class="fas fa-arrow-right ml-1"></i> العودة للرئيسية</button>
                    </div>
                </div>
            `;
        } else {
            const imageUrl = item.image || item.imageUrl || item.img || item.photo || '';
            if (imageUrl) {
                contentHtml += `<img src="${imageUrl}" class="w-full rounded-xl my-4" onerror="this.src='https://placehold.co/600x400/1e293b/60a5fa?text=No+Image'">`;
            }
            if (item.content) {
                contentHtml += `<div class="prose max-w-none">${escapeHtml(item.content)}</div>`;
            }

            main.innerHTML = `
                <div class="detail-container">
                    <div class="detail-cover" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"></div>
                    <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <span class="text-xs px-3 py-1 rounded-full" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white;">${typeName}</span>
                        <button onclick="shareItem('${escapeHtml(item.title)}', window.location.href)" class="share-btn"><i class="fas fa-share-alt ml-1"></i> مشاركة</button>
                    </div>
                    <h1 class="text-xl md:text-3xl font-bold mb-4">${escapeHtml(item.title)}</h1>
                    <div class="leading-relaxed" style="color: var(--text-secondary);">${contentHtml || '<p>لا يوجد محتوى</p>'}</div>
                    <div class="border-t mt-6 pt-4 text-center" style="border-color: var(--border-color);">
                        <button onclick="goBackToHome()" class="hover:underline" style="color: var(--primary); cursor: pointer;"><i class="fas fa-arrow-right ml-1"></i> العودة للرئيسية</button>
                    </div>
                </div>
            `;
        }
    } catch(e) {
        main.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>المحتوى غير موجود</h3><button onclick="goBackToHome()" class="inline-block mt-4 px-5 py-2 rounded-lg" style="background: var(--primary); color: white;">الرئيسية</button></div>`;
    }
}

// =============== Show Home Page ===============
async function showHome() {
    await loadQuiz();
    const texts = await loadTexts();
    const logoUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2Xrst_-NA_H-l97_0RgyhAuotWFS2I2MI1A4uVBidAIYPCbajJumUTdar9u55C-VF7tKq4m_MUza7zBtxbV0hTTY_wojRA_ZNIfKVmThAuxDaFaO3CYpMOupFYpSsxSj1Kj9m7QDfHxgULcD89zvsQd3KRUKqZVAMlCgl0XivNh-amFmq6_ZzQJ4j2225/s729/18.jpg%20(1).jpeg";
    
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="text-center p-6 md:p-8 rounded-2xl mb-6" style="background: linear-gradient(135deg, rgba(37,99,235,0.1), rgba(37,99,235,0.05)); backdrop-filter: blur(5px);" data-aos="fade-up">
            <img src="${logoUrl}" class="hero-logo mx-auto" alt="logo" onclick="openImageModal('${logoUrl}')">
<h4 class="text-lg md:text-2xl font-bold">${texts.heroTitle || 'الدوبامين'}<br><span class="gradient-text">دوبامين وعي رقمي=عقل سليم</span></h4>            <p class="text-sm md:text-base max-w-2xl mx-auto my-3" style="color: var(--text-secondary);">${texts.heroDesc || ''}</p>
            <div class="flex gap-2 justify-center flex-wrap">
                <a class="px-4 md:px-6 py-1.5 md:py-2 text-white rounded-xl text-sm cursor-pointer transition-all hover:scale-105" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark));" onclick="navigateToSection('reports')">استكشف</a>
                <a class="px-4 md:px-6 py-1.5 md:py-2 rounded-xl text-sm cursor-pointer transition-all hover:scale-105" style="background: transparent; border: 2px solid var(--primary); color: var(--primary);" onclick="navigateToSection('quiz')">اختبر مدي إدمانك</a>
            </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-6">
            <div class="stat-card"><i class="fas fa-file-alt"></i><div id="reportsCount" class="stat-number">0</div><div class="stat-label">تقارير</div></div>
            <div class="stat-card"><i class="fas fa-pen-nib"></i><div id="articlesCount" class="stat-number">0</div><div class="stat-label">مقالات</div></div>
            <div class="stat-card"><i class="fas fa-bullhorn"></i><div id="newsCount" class="stat-number">0</div><div class="stat-label">أخبار</div></div>
            <div class="stat-card"><i class="fas fa-comments"></i><div id="interviewsCount" class="stat-number">0</div><div class="stat-label">حوارات</div></div>
            <div class="stat-card"><i class="fas fa-users"></i><div id="quizCount" class="stat-number">0</div><div class="stat-label">مشاركات</div></div>
            <div class="stat-card"><i class="fas fa-chart-line"></i><div id="avgScore" class="stat-number">--%</div><div class="stat-label">المتوسط</div></div>
        </div>
        
        <section id="reports" class="mb-8"><h2 class="text-lg md:text-xl font-bold mb-3 flex items-center gap-2"><i class="fas fa-newspaper" style="color: var(--primary);"></i> <span class="gradient-text">${texts.reportsTitle}</span></h2><div id="reportsContainer" class="grid-responsive"></div></section>
        <section id="articles" class="mb-8"><h2 class="text-lg md:text-xl font-bold mb-3 flex items-center gap-2"><i class="fas fa-pen-fancy" style="color: var(--primary);"></i> <span class="gradient-text">${texts.articlesTitle}</span></h2><div id="articlesContainer" class="grid-responsive"></div></section>
        <section id="news" class="mb-8"><h2 class="text-lg md:text-xl font-bold mb-3 flex items-center gap-2"><i class="fas fa-bullhorn" style="color: var(--primary);"></i> <span class="gradient-text">${texts.newsTitle}</span></h2><div id="newsContainer" class="grid-responsive"></div></section>
        <section id="interviews" class="mb-8"><h2 class="text-lg md:text-xl font-bold mb-3 flex items-center gap-2"><i class="fas fa-comments" style="color: var(--primary);"></i> <span class="gradient-text">${texts.interviewsTitle}</span></h2><div id="interviewsContainer" class="grid-responsive"></div></section>
        <section id="investigations" class="mb-8"><h2 class="text-lg md:text-xl font-bold mb-3 flex items-center gap-2"><i class="fas fa-microscope" style="color: var(--primary);"></i> <span class="gradient-text">${texts.investigationsTitle}</span></h2><div id="investigationsContainer" class="grid-responsive"></div></section>
        <section id="infographics" class="mb-8"><h2 class="text-lg md:text-xl font-bold mb-3 flex items-center gap-2"><i class="fas fa-chart-pie" style="color: var(--primary);"></i> <span class="gradient-text">${texts.infographicsTitle}</span></h2><div id="infographicsContainer" class="grid md:grid-cols-2 gap-4"></div></section>
        <section id="videos" class="mb-8"><h2 class="text-lg md:text-xl font-bold mb-3 flex items-center gap-2"><i class="fas fa-video" style="color: var(--primary);"></i> <span class="gradient-text">${texts.videosTitle}</span></h2><div id="videosContainer" class="grid md:grid-cols-2 gap-4"></div></section>
        
        <section id="quiz-section">
            <div class="rounded-2xl shadow-xl overflow-hidden" style="background: var(--card-bg); border: 1px solid var(--border-color);">
                <div class="px-4 md:px-6 py-4 text-center" style="background: linear-gradient(135deg, var(--primary), var(--primary-dark));">
                    <h2 class="text-xl md:text-2xl font-bold text-white">${texts.quizTitle}</h2>
                    <p class="text-blue-200 text-sm">اختبار علمي دقيق لتقييم الإدمان</p>
                </div>
                <div class="p-4 md:p-6 text-center">
                    <div class="quiz-toggle-btn" onclick="navigateToSection('quiz')">
                        <i class="fas fa-chevron-down ml-1"></i> ابدأ الاختبار الآن
                    </div>
                </div>
            </div>
        </section>
    `;
    
    await loadSection('reports', 'reportsContainer');
    await loadSection('articles', 'articlesContainer');
    await loadSection('news', 'newsContainer');
    await loadSection('interviews', 'interviewsContainer');
    await loadSection('investigations', 'investigationsContainer');
    await loadSection('infographics', 'infographicsContainer');
    await loadSection('videos', 'videosContainer');
    await loadCounts();
    initScrollReveal();
}

// =============== Routing ===============
function getParams() {
    return { 
        type: new URLSearchParams(window.location.search).get('type'), 
        id: new URLSearchParams(window.location.search).get('id') 
    };
}

async function route() {
    const p = getParams();
    if (p.type && p.id) await showDetailPage(p.type, p.id);
    else await showHome();
}

// =============== Initialize ===============
AOS.init({ duration: 800, once: false });

window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollTopBtn');
    if (window.scrollY > 300) btn.classList.add('visible');
    else btn.classList.remove('visible');
});

// Color picker panel toggle on long press
let pressTimer;
document.querySelector('.theme-toggle')?.addEventListener('mousedown', () => { 
    pressTimer = setTimeout(() => document.getElementById('colorPickerPanel').classList.toggle('open'), 500); 
});
document.querySelector('.theme-toggle')?.addEventListener('mouseup', () => clearTimeout(pressTimer));
document.querySelector('.theme-toggle')?.addEventListener('mouseleave', () => clearTimeout(pressTimer));

// Start the app
loadSavedThemeAndColor();
route();
