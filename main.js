// Navbar Scroll Effect
const nav = document.querySelector('#navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    // Basic mobile menu styling toggle
    if (navLinks.style.display === 'flex') {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(18, 18, 18, 0.95)';
        navLinks.style.padding = '20px';
        navLinks.style.textAlign = 'center';
    }
});

// Reveal on Scroll
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    
    revealElements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < triggerBottom) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); // Initial check

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Contact Form Handling (Simple Alert for Demo)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // We let the 'mailto' action happen naturally, 
        // but we can provide a small visual feedback.
        setTimeout(() => {
            console.log('Form submission initiated via mailto');
        }, 100);
    });
}

// ─── Anti-Gravity Testimonials Carousel ───────────────────────────────────────
// Note: <script type="module"> is already deferred, so we don't need
// DOMContentLoaded. Instead we use a simple init guard.
(function initCarousel() {
    const track        = document.querySelector('.carousel-track');
    const dotsWrap     = document.querySelector('.carousel-dots');
    if (!track || !dotsWrap) return;

    const cards        = Array.from(track.querySelectorAll('.testimonial-card'));
    if (cards.length === 0) return;

    // ── State ──────────────────────────────────────────────────────────────────
    let current  = 0;   // current page index
    let timer    = null;
    const GAP    = 30;  // matches CSS gap

    // ── Helpers ────────────────────────────────────────────────────────────────
    function numPages() {
        return window.innerWidth > 992 ? 2 : cards.length;
    }

    function slideTo(page) {
        const pages = numPages();
        current = ((page % pages) + pages) % pages;   // safe modulo

        const cardW       = cards[0].getBoundingClientRect().width;
        const containerW  = track.parentElement.offsetWidth;
        let offset = 0;

        if (window.innerWidth > 992) {
            if (current === 0) {
                offset = 0;
            } else {
                // Center the 4th card in the viewport
                const card4Left = 3 * (cardW + GAP);
                offset = card4Left - (containerW / 2 - cardW / 2);
            }
        } else {
            offset = current * (cardW + GAP);
        }

        track.style.transform = `translateX(-${offset}px)`;

        // Update dots
        document.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    // ── Dots ───────────────────────────────────────────────────────────────────
    function buildDots() {
        dotsWrap.innerHTML = '';
        for (let i = 0; i < numPages(); i++) {
            const d = document.createElement('div');
            d.className = 'dot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', () => { slideTo(i); resetTimer(); });
            dotsWrap.appendChild(d);
        }
    }

    // ── Auto-play ──────────────────────────────────────────────────────────────
    function startTimer() {
        stopTimer();
        timer = setInterval(() => slideTo(current + 1), 4000);
    }

    function stopTimer() {
        if (timer) { clearInterval(timer); timer = null; }
    }

    function resetTimer() { stopTimer(); startTimer(); }

    // ── Hover pause ────────────────────────────────────────────────────────────
    const container = document.querySelector('.carousel-container');
    container.addEventListener('mouseenter', stopTimer);
    container.addEventListener('mouseleave', startTimer);

    // ── Boot ───────────────────────────────────────────────────────────────────
    buildDots();
    slideTo(0);
    startTimer();

    // Rebuild on resize (debounced)
    let resizeTO;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTO);
        resizeTO = setTimeout(() => { buildDots(); slideTo(0); }, 300);
    });
}());
