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

    const dots = document.querySelectorAll('.dot');
    let currentPage = 0;
    let autoPlayInterval;

    function goToPage(page) {
        currentPage = page;
        const container = document.querySelector('.carousel-container');
        const containerWidth = container.offsetWidth;
        const cardWidth = cards[0].offsetWidth;
        const gap = 30;
        
        let offset = 0;

        if (window.innerWidth > 992) {
            // Desktop Group Sliding
            if (page === 0) {
                offset = 0;
            } else {
                // Center the 4th card (last card)
                // Total distance to 4th card start = 3 cards + 3 gaps
                const card4Start = 3 * (cardWidth + gap);
                // Center it: card4Start - (container/2 - cardWidth/2)
                offset = card4Start - (containerWidth / 2 - cardWidth / 2);
            }
        } else {
            // Mobile/Tablet Single Sliding
            offset = page * (cardWidth + gap);
        }

        track.style.transform = `translateX(-${offset}px)`;
        
        // Update Dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
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
            // Re-sync position without reload if possible, 
            // but reload is safer for complex grid layouts
            location.reload(); 
        }, 250);
    });
});
