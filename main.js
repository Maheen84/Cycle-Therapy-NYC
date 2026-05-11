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

// ─── Anti-Gravity Testimonials Carousel (Silent Infinite Loop) ────────────────
(function initCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    // Original cards (3 reviews)
    const originals = Array.from(track.querySelectorAll('.testimonial-card'));
    if (originals.length === 0) return;

    const N   = originals.length; // 3
    const GAP = 30;

    // ── Clone all cards and append for seamless loop ───────────────────────────
    // Track becomes: [1, 2, 3, clone1, clone2, clone3]
    originals.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });

    // ── State ─────────────────────────────────────────────────────────────────
    let current = 0;
    let timer   = null;
    let jumping = false;

    // ── Slide to card index ───────────────────────────────────────────────────
    function slideTo(idx, animate) {
        const cardW = originals[0].getBoundingClientRect().width;
        track.style.transition = animate
            ? 'transform 1.4s cubic-bezier(0.65, 0, 0.35, 1)'
            : 'none';
        track.style.transform = `translateX(-${idx * (cardW + GAP)}px)`;
        current = idx;
    }

    // After each animated slide, if we've hit a clone, silently jump back
    track.addEventListener('transitionend', () => {
        if (jumping) return;
        if (current >= N) {
            jumping = true;
            slideTo(current - N, false);
            requestAnimationFrame(() => requestAnimationFrame(() => {
                jumping = false;
            }));
        }
    });

    // ── Auto-play: advance one card every 4 seconds ───────────────────────────
    function startTimer() {
        stopTimer();
        timer = setInterval(() => {
            if (!jumping) slideTo(current + 1, true);
        }, 4000);
    }

    function stopTimer() {
        if (timer) { clearInterval(timer); timer = null; }
    }

    // ── Hover pause ───────────────────────────────────────────────────────────
    const container = document.querySelector('.carousel-container');
    container.addEventListener('mouseenter', stopTimer);
    container.addEventListener('mouseleave', startTimer);

    // ── Boot ──────────────────────────────────────────────────────────────────
    slideTo(0, false);
    startTimer();

    // Re-sync offset on resize
    let resizeTO;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTO);
        resizeTO = setTimeout(() => slideTo(current, false), 300);
    });
}());
