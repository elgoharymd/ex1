// =============== Helper Functions ===============
function escapeHtml(str) { 
    if (!str) return ''; 
    return str.replace(/[&<>]/g, m => m==='&'?'&amp;':m==='<'?'&lt;':'&gt;'); 
}

function getYouTubeEmbedUrl(url) {
    if (!url) return '';
    if (url.includes('youtu.be/')) {
        let id = url.split('youtu.be/')[1];
        if (id) return `https://www.youtube.com/embed/${id.split('?')[0]}`;
    }
    if (url.includes('youtube.com/watch')) {
        let params = new URLSearchParams(url.split('?')[1]);
        let id = params.get('v');
        if (id) return `https://www.youtube.com/embed/${id}`;
    }
    return url;
}

// =============== Image Modal ===============
function openImageModal(imageUrl) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.classList.add('show');
    modalImg.src = imageUrl;
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
}

// =============== Share Function ===============
async function shareItem(title, url) {
    try {
        if (navigator.share && window.innerWidth <= 768) {
            await navigator.share({ title: title, text: `اكتشفت هذا المحتوى الرائع: ${title}`, url: url });
        } else {
            await navigator.clipboard.writeText(url);
            Swal.fire({ title: "تم نسخ الرابط! 📋", text: title, icon: "success", timer: 2000, showConfirmButton: false, toast: true, position: "bottom-end" });
        }
    } catch (err) {
        Swal.fire({ title: "حدث خطأ", text: "لم نتمكن من مشاركة المحتوى", icon: "error", timer: 1500 });
    }
}

// =============== Theme Functions ===============
function setTabColor(color) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { 
        meta = document.createElement('meta'); 
        meta.name = 'theme-color'; 
        document.head.appendChild(meta); 
    }
    meta.content = color;
}

function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('.theme-toggle i');
    const isDark = body.classList.contains('dark');
    if (isDark) {
        body.classList.remove('dark');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
        setTabColor('#ffffff');
        Swal.fire({ title: "✨ الوضع الفاتح", text: "تم التبديل إلى الوضع النهاري", icon: "success", timer: 1500, showConfirmButton: false });
    } else {
        body.classList.add('dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
        setTabColor('#0f172a');
        Swal.fire({ title: "🌙 الوضع الداكن", text: "تم التبديل إلى الوضع الليلي", icon: "success", timer: 1500, showConfirmButton: false });
    }
}

function changeColor(primary, primaryDark) {
    document.documentElement.style.setProperty('--primary', primary);
    document.documentElement.style.setProperty('--primary-dark', primaryDark);
    localStorage.setItem('userPrimary', primary);
    localStorage.setItem('userPrimaryDark', primaryDark);
    document.getElementById('colorPickerPanel').classList.remove('open');
    Swal.fire({ title: "تم تغيير اللون", text: "لون الموقع تم تحديثه", icon: "success", timer: 1500, showConfirmButton: false });
}

function loadSavedThemeAndColor() {
    const savedTheme = localStorage.getItem('theme');
    const savedPrimary = localStorage.getItem('userPrimary');
    const savedPrimaryDark = localStorage.getItem('userPrimaryDark');
    const icon = document.querySelector('.theme-toggle i');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark');
        if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
        setTabColor('#ffffff');
    } else {
        document.body.classList.add('dark');
        if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        setTabColor('#0f172a');
    }
    if (savedPrimary && savedPrimaryDark) {
        document.documentElement.style.setProperty('--primary', savedPrimary);
        document.documentElement.style.setProperty('--primary-dark', savedPrimaryDark);
    }
}

// =============== Page Transition ===============
function navigateToSection(sectionId) {
    const transition = document.getElementById('pageTransition');
    transition.classList.add('active');
    setTimeout(() => {
        openSectionFullscreen(sectionId);
        transition.classList.remove('active');
    }, 400);
}

// =============== Scroll Reveal ===============
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.premium-card, .stat-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                entry.target.classList.remove('revealed');
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

// =============== Open In New Tab ===============
function openInNewTab(url) { 
    window.open(url, '_blank'); 
}

function goBackToHome() { 
    window.location.href = './'; 
}
