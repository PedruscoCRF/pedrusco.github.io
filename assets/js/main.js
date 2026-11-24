/* ============================================================
   MENU MOBILE
   ============================================================ */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

function closeMenu() {
    if (navMenu) navMenu.classList.remove('show-menu');
}

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.toggle('show-menu'));
}

if (navClose) {
    navClose.addEventListener('click', closeMenu);
}

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
});

/* Fecha o menu ao clicar em um link */
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

/* Fecha o menu ao clicar fora dele */
document.addEventListener('click', event => {
    if (!navMenu || !navMenu.classList.contains('show-menu')) return;
    if (navMenu.contains(event.target) || navToggle.contains(event.target)) return;
    closeMenu();
});

/* ============================================================
   LINK ATIVO CONFORME A SEÇÃO VISÍVEL
   ============================================================ */
const navLinks = document.querySelectorAll('.nav__link');

function setActiveLink(id) {
    navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active-link', isActive);
    });
}

if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
    }, {
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}

/* ============================================================
   HEADER COM BORDA AO ROLAR + BOTÃO VOLTAR AO TOPO
   ============================================================ */
const header = document.getElementById('header');
const scrollTopButton = document.getElementById('scrolltop');

function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
    if (scrollTopButton) scrollTopButton.classList.toggle('show-scroll', window.scrollY > 320);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ============================================================
   TEMA CLARO / ESCURO
   ============================================================ */
const themeButton = document.getElementById('theme-button');
const themeIcon = document.getElementById('theme-icon');
const darkTheme = 'dark-theme';
const savedTheme = localStorage.getItem('selected-theme');

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle(darkTheme, isDark);

    if (themeIcon) {
        themeIcon.classList.toggle('bx-moon', !isDark);
        themeIcon.classList.toggle('bx-sun', isDark);
    }
}

if (savedTheme) {
    applyTheme(savedTheme);
} else {
    applyTheme('dark');
}

if (themeButton) {
    themeButton.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains(darkTheme) ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem('selected-theme', nextTheme);
    });
}

/* ============================================================
   ANO ATUAL NO RODAPÉ
   ============================================================ */
const yearElement = document.getElementById('year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

/* ============================================================
   GERAR PDF DA VERSÃO WEB (layout do site)
   ============================================================ */
const resumeWebButton = document.getElementById('resume-button-web');
const resumeArea = document.getElementById('resume');

if (resumeWebButton && resumeArea && typeof html2pdf !== 'undefined') {
    resumeWebButton.addEventListener('click', async () => {
        const previousTheme = document.body.classList.contains(darkTheme);

        /* garante que logos e foto estejam decodificados antes da captura */
        await Promise.all([...resumeArea.querySelectorAll('img')].map(img =>
            img.decode ? img.decode().catch(() => {}) : Promise.resolve()
        ));

        /* O PDF é sempre gerado no tema claro, em layout compacto */
        const restoreTheme = () => {
            document.body.classList.remove('pdf-mode');
            applyTheme(previousTheme ? 'dark' : 'light');
        };

        document.body.classList.remove(darkTheme);
        document.body.classList.add('pdf-mode');

        html2pdf().set({
            margin: [8, 8, 8, 8],
            filename: 'Pedro-Lucas-Curriculo.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 3, useCORS: true, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: {
                mode: ['css', 'legacy'],
                avoid: ['.job', '.certificate', '.timeline__item', '.language', '.interest']
            }
        }).from(resumeArea).save().then(() => {
            restoreTheme();
        }).catch(() => {
            restoreTheme();
        });
    });
}
