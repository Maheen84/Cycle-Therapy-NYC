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

// Anti-Gravity Testimonials Carousel (Group Paging)
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(document.querySelectorAll('.testimonial-card'));
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!track || cards.length === 0) return;

    // Reset dots
    dotsContainer.innerHTML = '';
    const numPages = window.innerWidth > 992 ? 2 : cards.length;
    
    for (let i = 0; i < numPages; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToPage(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');
    let currentPage = 0;
    let isTransitioning = false;
    let autoPlayInterval;

    function goToPage(page) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentPage = page;

        // Transition effect (float up and fade out)
        track.classList.add('transitioning');
        
        setTimeout(() => {
            const cardWidth = cards[0].offsetWidth;
            const gap = 30;
            let offset;

            if (window.innerWidth > 992) {
                // Desktop: Page 0 = cards 1-3, Page 1 = card 4 centered
                if (page === 0) {
                    offset = 0;
                } else {
                    // Center the last card
                    const containerWidth = document.querySelector('.carousel-container').offsetWidth;
                    offset = (cardWidth * 3 + gap * 3) - (containerWidth / 2 - cardWidth / 2);
                }
            } else {
                // Mobile/Tablet: 1 card at a time
                offset = page * (cardWidth + gap);
            }

            track.style.transform = `translateX(-${offset}px)`;
            
            // Update dots
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentPage]) dots[currentPage].classList.add('active');

            setTimeout(() => {
                track.classList.remove('transitioning');
                isTransitioning = false;
            }, 400);
        }, 400);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            const nextPage = (currentPage + 1) % numPages;
            goToPage(nextPage);
        }, 4000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Initial state
    startAutoPlay();

    // Pause on hover
    const container = document.querySelector('.carousel-container');
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);

    // Responsive update
    window.addEventListener('resize', () => {
        // Simple refresh for demo purposes
        location.reload(); 
    });
});
