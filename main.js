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

// ─── Anti-Gravity Testimonials Carousel (Infinite Clone Loop) ─────────────────
(function initCarousel() {
    const track    = document.querySelector('.carousel-track');
    const dotsWrap = document.querySelector('.carousel-dots');
    if (!track || !dotsWrap) return;

    // Original cards (3 reviews)
    const originals = Array.from(track.querySelectorAll('.testimonial-card'));
    if (originals.length === 0) return;

    const N   = originals.length; // 3
    const GAP = 30;

    // ── Clone cards and append for seamless loop ──────────────────────────────
    originals.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });
    // track now has N * 2 = 6 cards  →  [1,2,3, clone1,clone2,clone3]

    // ── State ─────────────────────────────────────────────────────────────────
    let current   = 0;   // logical index: 0 = card 1 is leftmost visible
    let timer     = null;
    let jumping   = false;

    // ── Slide to a position (index = which card is leftmost) ─────────────────
    function slideTo(idx, animate) {
        const cardW = originals[0].getBoundingClientRect().width;
        const step  = cardW + GAP;

        track.style.transition = animate
            ? 'transform 1.4s cubic-bezier(0.65, 0, 0.35, 1)'
            : 'none';
        track.style.transform  = `translateX(-${idx * step}px)`;
        current = idx;

        // Update dots (mod N so clones map back to originals)
        const dotIdx = ((idx % N) + N) % N;
        document.querySelectorAll('.dot').forEach((d, i) =>
            d.classList.toggle('active', i === dotIdx)
        );
    }

    // After sliding to a clone position, silently jump back to the real card
    track.addEventListener('transitionend', () => {
        if (jumping) return;
        if (current >= N) {
            jumping = true;
            slideTo(current - N, false);
            // Allow one tick for the non-animated jump to settle
            requestAnimationFrame(() => requestAnimationFrame(() => {
                jumping = false;
            }));
        }
    });

    // ── Dots (one per original card) ──────────────────────────────────────────
    function buildDots() {
        dotsWrap.innerHTML = '';
        originals.forEach((_, i) => {
            const d = document.createElement('div');
            d.className = 'dot' + (i === 0 ? ' active' : '');
            d.addEventListener('click', () => {
                // Find position of that original card relative to current
                // and slide to a position that shows it correctly
                const target = ((i - (current % N)) + N) % N;
                slideTo(current + target, true);
                resetTimer();
            });
            dotsWrap.appendChild(d);
        });
    }

    // ── Auto-play ─────────────────────────────────────────────────────────────
    function startTimer() {
        stopTimer();
        timer = setInterval(() => {
            if (!jumping) slideTo(current + 1, true);
        }, 5000);   // 5s interval + 1.4s transition = smooth & readable
    }

    function stopTimer()  { if (timer) { clearInterval(timer); timer = null; } }
    function resetTimer() { stopTimer(); startTimer(); }

    // ── Hover pause ───────────────────────────────────────────────────────────
    const container = document.querySelector('.carousel-container');
    container.addEventListener('mouseenter', stopTimer);
    container.addEventListener('mouseleave', startTimer);

    // ── Boot ──────────────────────────────────────────────────────────────────
    buildDots();
    slideTo(0, false);
    startTimer();

    // Resize: recalculate offset without rebuilding
    let resizeTO;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTO);
        resizeTO = setTimeout(() => slideTo(current, false), 300);
    });
}());
