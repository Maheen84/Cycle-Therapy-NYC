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

// Anti-Gravity Testimonials Carousel (Group Sliding)
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(document.querySelectorAll('.testimonial-card'));
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!track || cards.length === 0) return;

    // Initialize Dots
    function initDots() {
        dotsContainer.innerHTML = '';
        const isDesktop = window.innerWidth > 992;
        const numPages = isDesktop ? 2 : cards.length;
        
        for (let i = 0; i < numPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToPage(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    initDots();

    let currentPage = 0;
    let autoPlayInterval;

    function goToPage(page) {
        const isDesktop = window.innerWidth > 992;
        const numPages = isDesktop ? 2 : cards.length;
        currentPage = page % numPages;

        const container = document.querySelector('.carousel-container');
        const containerWidth = container.offsetWidth;
        const cardWidth = cards[0].offsetWidth;
        const gap = 30;
        
        let offset = 0;

        if (isDesktop) {
            // Desktop Group Sliding (2 Pages)
            if (currentPage === 0) {
                offset = 0;
            } else {
                // To center Card 4:
                // card4CenterPos = (3 cards + 3 gaps) + cardWidth/2
                const card4Start = 3 * (cardWidth + gap);
                const card4Center = card4Start + (cardWidth / 2);
                // Offset needed to put card4Center at containerWidth/2
                offset = card4Center - (containerWidth / 2);
            }
        } else {
            // Mobile/Tablet Single Sliding
            offset = currentPage * (cardWidth + gap);
        }

        track.style.transform = `translateX(-${offset}px)`;
        
        // Update Dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            const isDesktop = window.innerWidth > 992;
            const numPages = isDesktop ? 2 : cards.length;
            const nextPage = (currentPage + 1) % numPages;
            goToPage(nextPage);
        }, 4000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Hover logic
    const container = document.querySelector('.carousel-container');
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);

    // Initial Start
    startAutoPlay();

    // Handle Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initDots();
            goToPage(0); // Reset to start on resize for stability
        }, 250);
    });
});
