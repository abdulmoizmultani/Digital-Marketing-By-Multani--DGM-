// Loading Screen
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 800);
});

// Particle Canvas Animation
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let scrollY = 0;
    let lastScrollY = 0;
    let scrollVelocity = 0;
    let targetScrollVelocity = 0;
    let heroSection = document.querySelector('.hero');
    let isInHero = true;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseX: 0,
            baseY: 0,
            radius: Math.random() * 2.5 + 1.5,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8,
            opacity: Math.random() * 0.6 + 0.4,
            parallaxSpeed: Math.random() * 0.5 + 0.3, // Different speeds for depth effect
        };
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
        for (let i = 0; i < particleCount; i++) {
            const particle = createParticle();
            particle.baseX = particle.x;
            particle.baseY = particle.y;
            particles.push(particle);
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Smooth scroll velocity
        scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.1;

        // Update and draw particles
        particles.forEach((particle, index) => {
            // Apply scroll-based movement
            const scrollEffect = scrollVelocity * particle.parallaxSpeed;
            particle.x = particle.baseX + scrollEffect;
            particle.y = particle.baseY + scrollEffect * 0.5; // Vertical movement is less

            // Normal particle movement
            particle.baseX += particle.speedX;
            particle.baseY += particle.speedY;

            // Wrap around edges
            if (particle.baseX < -100) particle.baseX = canvas.width + 100;
            if (particle.baseX > canvas.width + 100) particle.baseX = -100;
            if (particle.baseY < -100) particle.baseY = canvas.height + 100;
            if (particle.baseY > canvas.height + 100) particle.baseY = -100;

            // Keep particles within visible area with scroll offset
            if (particle.x < -50) particle.x = canvas.width + 50;
            if (particle.x > canvas.width + 50) particle.x = -50;
            if (particle.y < -50) particle.y = canvas.height + 50;
            if (particle.y > canvas.height + 50) particle.y = -50;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            ctx.fill();

            // Draw connections
            particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            });
        });

        animationId = requestAnimationFrame(animateParticles);
    }

    function startParticles() {
        resizeCanvas();
        initParticles();
        animateParticles();
    }

    // Scroll event handler for particle animation
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Check if we're in hero section
        if (heroSection) {
            const heroRect = heroSection.getBoundingClientRect();
            isInHero = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
        }

        if (isInHero) {
            // Calculate scroll velocity (positive = scrolling down, negative = scrolling up)
            targetScrollVelocity = scrollDelta * 2; // Amplify the effect
            
            // Decay velocity when not scrolling
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                targetScrollVelocity = 0;
            }, 50);
        } else {
            targetScrollVelocity = 0;
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    // Initialize and handle resize
    startParticles();
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        startParticles();
    });
}

// Loader Particle Canvas Animation
const loaderCanvas = document.getElementById('loader-particles-canvas');
if (loaderCanvas) {
    const loaderCtx = loaderCanvas.getContext('2d');
    let loaderParticles = [];
    let loaderAnimationId;

    function resizeLoaderCanvas() {
        loaderCanvas.width = window.innerWidth;
        loaderCanvas.height = window.innerHeight;
    }

    function createLoaderParticle() {
        return {
            x: Math.random() * loaderCanvas.width,
            y: Math.random() * loaderCanvas.height,
            baseX: 0,
            baseY: 0,
            radius: Math.random() * 2.5 + 1.5,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8,
            opacity: Math.random() * 0.6 + 0.4,
            parallaxSpeed: Math.random() * 0.5 + 0.3,
        };
    }

    function initLoaderParticles() {
        loaderParticles = [];
        const particleCount = Math.floor((loaderCanvas.width * loaderCanvas.height) / 10000);
        for (let i = 0; i < particleCount; i++) {
            const particle = createLoaderParticle();
            particle.baseX = particle.x;
            particle.baseY = particle.y;
            loaderParticles.push(particle);
        }
    }

    function animateLoaderParticles() {
        loaderCtx.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);

        loaderParticles.forEach((particle, index) => {
            particle.baseX += particle.speedX;
            particle.baseY += particle.speedY;

            if (particle.baseX < -100) particle.baseX = loaderCanvas.width + 100;
            if (particle.baseX > loaderCanvas.width + 100) particle.baseX = -100;
            if (particle.baseY < -100) particle.baseY = loaderCanvas.height + 100;
            if (particle.baseY > loaderCanvas.height + 100) particle.baseY = -100;

            particle.x = particle.baseX;
            particle.y = particle.baseY;

            if (particle.x < -50) particle.x = loaderCanvas.width + 50;
            if (particle.x > loaderCanvas.width + 50) particle.x = -50;
            if (particle.y < -50) particle.y = loaderCanvas.height + 50;
            if (particle.y > loaderCanvas.height + 50) particle.y = -50;

            loaderCtx.beginPath();
            loaderCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            loaderCtx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            loaderCtx.fill();

            loaderParticles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    loaderCtx.beginPath();
                    loaderCtx.moveTo(particle.x, particle.y);
                    loaderCtx.lineTo(otherParticle.x, otherParticle.y);
                    loaderCtx.strokeStyle = `rgba(99, 102, 241, ${0.3 * (1 - distance / 150)})`;
                    loaderCtx.lineWidth = 1.5;
                    loaderCtx.stroke();
                }
            });
        });

        loaderAnimationId = requestAnimationFrame(animateLoaderParticles);
    }

    function startLoaderParticles() {
        resizeLoaderCanvas();
        initLoaderParticles();
        animateLoaderParticles();
    }

    startLoaderParticles();
    window.addEventListener('resize', () => {
        cancelAnimationFrame(loaderAnimationId);
        startLoaderParticles();
    });
}

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effects
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Animate numbers on scroll
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * (end - start) + start);
        element.textContent = current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end;
        }
    };
    window.requestAnimationFrame(step);
}

// Enhanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate stats
            if (entry.target.classList.contains('stat-number')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
            
            // Fade in animation for cards
            if (entry.target.classList.contains('service-card') || 
                entry.target.classList.contains('portfolio-card') ||
                entry.target.classList.contains('feature-item')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        }
    });
}, observerOptions);

// Observe stat numbers
document.querySelectorAll('.stat-number').forEach(stat => {
    observer.observe(stat);
});

// Observe service and portfolio cards with stagger
document.querySelectorAll('.service-card, .portfolio-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observe feature items
document.querySelectorAll('.feature-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Add fade-in animation on scroll for sections
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(section);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-background');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Active navigation highlighting on scroll
const sectionsForNav = document.querySelectorAll('section[id]');
const navLinksArray = Array.from(document.querySelectorAll('.nav-link'));

window.addEventListener('scroll', () => {
    let current = '';
    
    sectionsForNav.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Enhanced Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        console.log('Form submitted:', data);
        
        // Show success message
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
    });
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Cursor effect for interactive elements (optional enhancement)
const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-card');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
    });
});

// Scroll to top button (optional)
let scrollToTopBtn = null;

function createScrollToTopButton() {
    scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    `;
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(scrollToTopBtn);
}

createScrollToTopButton();

window.addEventListener('scroll', () => {
    if (scrollToTopBtn) {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }
});

// Add hover effect to scroll to top button
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);
