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

// Testimonials Carousel (Infinite Loop)
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(document.querySelectorAll('.testimonial-card'));
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!track || cards.length === 0) return;

    // Clone first and last cards for seamless loop
    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);
    
    track.appendChild(firstClone);
    track.insertBefore(lastClone, cards[0]);

    const allCards = document.querySelectorAll('.testimonial-card');
    let currentIndex = 1; // Start at the first original card
    let isTransitioning = false;

    // Create dots (only for original cards)
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            if (isTransitioning) return;
            goToSlide(i + 1);
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDots(index) {
        let dotIndex = index - 1;
        if (index === 0) dotIndex = cards.length - 1;
        if (index === cards.length + 1) dotIndex = 0;
        
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[dotIndex]) dots[dotIndex].classList.add('active');
    }

    function goToSlide(index, transition = true) {
        if (isTransitioning && transition) return;
        
        isTransitioning = true;
        currentIndex = index;
        
        const cardWidth = allCards[0].offsetWidth + 30; // card width + gap
        track.style.transition = transition ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        updateDots(currentIndex);
    }

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        
        if (currentIndex === 0) {
            goToSlide(cards.length, false);
        }
        if (currentIndex === cards.length + 1) {
            goToSlide(1, false);
        }
    });

    // Auto slide
    let autoSlideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);

    // Initial positioning
    setTimeout(() => goToSlide(1, false), 100);
    window.addEventListener('resize', () => goToSlide(currentIndex, false));
});
