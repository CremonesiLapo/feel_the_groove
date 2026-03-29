// Slider State
let currentSlide = 0;
const totalSlides = 5;
let isAnimating = false;
let touchStartY = 0;
let touchEndY = 0;
let lastScrollTime = 0;
const scrollCooldown = 800; // ms between scrolls

// DOM Elements
const slidesWrapper = document.getElementById('slidesWrapper');
const indicators = document.querySelectorAll('.indicator');
const navLinks = document.querySelectorAll('.nav-links a');
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');

// Initialize
function init() {
    updateSlidePosition();
    setupEventListeners();
}

// Go to specific slide
function goToSlide(index) {
    if (isAnimating || index === currentSlide || index < 0 || index >= totalSlides) return;

    isAnimating = true;
    currentSlide = index;
    updateSlidePosition();
    updateIndicators();
    updateNavLinks();

    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

// Update slide position
function updateSlidePosition() {
    const viewportHeight = window.innerHeight;
    slidesWrapper.style.transform = `translateY(-${currentSlide * viewportHeight}px)`;
}

// Update indicators
function updateIndicators() {
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === currentSlide);
    });
}

// Update nav links
function updateNavLinks() {
    navLinks.forEach((link, i) => {
        link.classList.toggle('active', i === currentSlide);
    });
}

// Next/Prev slide
function nextSlide() {
    if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
}

function prevSlide() {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
}

// Event Listeners
function setupEventListeners() {
    // Wheel/Scroll event with throttling
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);

    // Touch events
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Indicator clicks
    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => goToSlide(i));
    });

    // Nav links
    navLinks.forEach((link, i) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlide(i);
            navLinksContainer.classList.remove('active');
        });
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });

    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSlidePosition();
        }, 100);
    });
}

// Handle wheel event
function handleWheel(e) {
    e.preventDefault();

    const now = Date.now();
    if (now - lastScrollTime < scrollCooldown) return;

    const delta = e.deltaY;
    if (Math.abs(delta) < 10) return; // Ignore small movements

    lastScrollTime = now;

    if (delta > 0) {
        nextSlide();
    } else {
        prevSlide();
    }
}

// Handle keyboard
function handleKeydown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
    } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(totalSlides - 1);
    }
}

// Handle touch
function handleTouchStart(e) {
    touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Parallax effect for shapes (mouse move)
document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 968) return; // Disable on mobile

    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (0.5 - x) * speed;
        const yOffset = (0.5 - y) * speed;
        shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

// Start
init();
