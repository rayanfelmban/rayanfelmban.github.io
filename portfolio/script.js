// ============================================
// التفاعل في الموقع
// ============================================

const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const navToggle = document.getElementById("navToggle");
const navProgress = document.getElementById("navProgress");
const links = Array.from(document.querySelectorAll(".nav__link"));
const sections = links.map((link) => document.querySelector(link.getAttribute("href")));

// 1) الكتابة المتحركة للمسمّى الوظيفي
const roles = [
    "محلل أعمال",
    "مالك منتج رقمي",
    "عضو فريق منصة نسك",
    "أبني بمساعدة الذكاء الاصطناعي",
];
const typingEl = document.getElementById("typing");
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
    const current = roles[roleIndex];
    typingEl.textContent = deleting ? current.slice(0, charIndex--) : current.slice(0, charIndex++);

    let delay = deleting ? 45 : 90;
    if (!deleting && charIndex > current.length) { deleting = true; delay = 1600; }
    else if (deleting && charIndex < 0) { deleting = false; charIndex = 0; roleIndex = (roleIndex + 1) % roles.length; delay = 400; }
    setTimeout(typeLoop, delay);
}
typeLoop();

// 2) قائمة الجوال
navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
});
links.forEach((link) => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
}));

// 3) الشريط عند التمرير + شريط التقدم + تمييز القسم الحالي
function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 20);

    const total = document.documentElement.scrollHeight - window.innerHeight;
    navProgress.style.width = (total > 0 ? (y / total) * 100 : 0) + "%";

    const offset = window.innerHeight * 0.4;
    let activeIndex = -1;
    sections.forEach((section, i) => {
        if (section && section.getBoundingClientRect().top <= offset) activeIndex = i;
    });
    links.forEach((link, i) => link.classList.toggle("active", i === activeIndex));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// 4) ظهور العناصر عند الوصول إليها
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// 5) أشرطة المهارات تمتلئ عند الظهور
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.width = entry.target.dataset.level + "%";
        skillObserver.unobserve(entry.target);
    });
}, { threshold: 0.4 });
document.querySelectorAll(".skill__fill").forEach((el) => skillObserver.observe(el));

// 6) الأرقام تعدّ تصاعدياً
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const start = performance.now();
        const duration = 1400;
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        countObserver.unobserve(el);
    });
}, { threshold: 0.6 });
document.querySelectorAll(".stat__num").forEach((el) => countObserver.observe(el));

// 7) توهّج يتبع الفأرة على بطاقات المشاريع
document.querySelectorAll(".project").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
        card.style.setProperty("--my", (e.clientY - rect.top) + "px");
    });
});

// 8) رابط السيرة الذاتية (مؤقت حتى نضيف الملف)
document.getElementById("cvLink").addEventListener("click", (e) => {
    e.preventDefault();
    alert("ملف السيرة الذاتية سيُضاف لاحقاً.");
});

// 9) السنة الحالية في التذييل
document.getElementById("year").textContent = new Date().getFullYear();
