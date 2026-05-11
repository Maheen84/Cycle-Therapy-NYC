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

// ─── Anti-Gravity Testimonials Carousel (Seamless Infinite Clone) ─────────────
(function initCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const originals = Array.from(track.querySelectorAll('.testimonial-card'));
    if (originals.length === 0) return;

    const N          = originals.length;  // 3
    const GAP        = 30;
    const TRANSITION = 'transform 1.4s cubic-bezier(0.65, 0, 0.35, 1)';

    // Animation delays that match the CSS nth-child rules exactly.
    // Clones must share the SAME delay as their original so their float
    // phase is identical — otherwise the instant position-reset is visible.
    const DELAYS = ['0s', '1.2s', '2.4s'];

    // Append clones with matching animation-delay
    originals.forEach((card, i) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.style.animationDelay = DELAYS[i];  // ← the critical fix
        track.appendChild(clone);
    });
    // Track is now: [Real1, Real2, Real3, Clone1, Clone2, Clone3]

    let current   = 0;
    let timer     = null;
    let isJumping = false;

    // ── Move track ────────────────────────────────────────────────────────────
    function goTo(idx, animated) {
        const cardW = originals[0].getBoundingClientRect().width;
        track.style.transition = animated ? TRANSITION : 'none';
        track.style.transform  = `translateX(-${idx * (cardW + GAP)}px)`;
        current = idx;
    }

    // After each animated slide: if we're on a clone, silently reset to the
    // matching real card. Position looks identical → user sees nothing.
    track.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform') return;  // ignore other props
        if (isJumping) return;

        if (current >= N) {
            isJumping = true;
            goTo(current - N, false);          // instant, invisible reset
            requestAnimationFrame(() =>
                requestAnimationFrame(() => {  // wait 2 frames to be safe
                    isJumping = false;
                })
            );
        }
    });

    // ── Button Controls ───────────────────────────────────────────────────────
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (isJumping) return;
            if (current <= 0) {
                // Silently jump to the cloned set on the right
                isJumping = true;
                goTo(N, false);
                // Then animate one step to the left
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    isJumping = false;
                    goTo(N - 1, true);
                }));
            } else {
                goTo(current - 1, true);
            }
            resetTimer();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (isJumping) return;
            goTo(current + 1, true);
            resetTimer();
        });
    }

    // ── Auto-play ─────────────────────────────────────────────────────────────
    function startTimer() {
        stopTimer();
        timer = setInterval(() => {
            if (!isJumping) goTo(current + 1, true);
        }, 4000);
    }

    function stopTimer() {
        if (timer) { clearInterval(timer); timer = null; }
    }

    function resetTimer() {
        stopTimer();
        startTimer();
    }

    // ── Hover pause ───────────────────────────────────────────────────────────
    const container = document.querySelector('.carousel-outer-wrapper');
    if (container) {
        container.addEventListener('mouseenter', stopTimer);
        container.addEventListener('mouseleave', startTimer);
    }

    // ── Boot ──────────────────────────────────────────────────────────────────
    goTo(0, false);
    startTimer();

    let resizeTO;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTO);
        resizeTO = setTimeout(() => goTo(current, false), 300);
    });
}());
