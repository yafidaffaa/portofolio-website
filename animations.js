// animations.js - Portfolio Animation & Interaction Logic

// ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// ===== OBSERVE ELEMENTS ON PAGE LOAD =====
function initScrollAnimations() {
    // Observe sections
    const sections = document.querySelectorAll('section:not(#hero)');
    sections.forEach(section => {
        animateOnScroll.observe(section);
    });

    // Observe cards with stagger effect
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        animateOnScroll.observe(card);
    });
}

// ===== PARALLAX EFFECT FOR HERO =====
function initParallaxEffect() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroContent = document.querySelector('.hero-content');
                const scrollIndicator = document.querySelector('.scroll-indicator');
                
                if (heroContent && scrolled < window.innerHeight) {
                    heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                    heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
                }
                
                if (scrollIndicator) {
                    scrollIndicator.style.opacity = 1 - (scrolled / 300);
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===== SMOOTH REVEAL FOR ABOUT SECTION =====
function enhanceAboutSection() {
    const moreAboutBtn = document.getElementById('moreAboutBtn');
    const closeAboutBtn = document.getElementById('closeAboutBtn');
    const aboutExpanded = document.getElementById('aboutExpanded');
    
    if (moreAboutBtn) {
        moreAboutBtn.addEventListener('click', () => {
            aboutExpanded.classList.remove('hidden');
            
            // Smooth scroll with offset
            setTimeout(() => {
                const offset = 100;
                const elementPosition = aboutExpanded.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Trigger animations
                animateAboutContent();
            }, 100);
        });
    }
    
    if (closeAboutBtn) {
        closeAboutBtn.addEventListener('click', () => {
            // Fade out effect before hiding
            aboutExpanded.style.opacity = '0';
            aboutExpanded.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                aboutExpanded.classList.add('hidden');
                aboutExpanded.style.opacity = '1';
                aboutExpanded.style.transform = 'translateY(0)';
                
                // Scroll to hero
                document.getElementById('hero').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        });
    }
}

// ===== ANIMATE ABOUT CONTENT =====
function animateAboutContent() {
    const aboutContent = document.querySelector('.about-content');
    if (!aboutContent) return;
    
    const elements = aboutContent.querySelectorAll('h2, h3, p, #skillsContainer');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('fade-in-up');
        }, index * 100);
    });
}

// ===== ENHANCED FILTER ANIMATIONS =====
function enhanceFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn, .cert-filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all buttons in the same group
            const group = this.classList.contains('filter-btn') ? '.filter-btn' : '.cert-filter-btn';
            document.querySelectorAll(group).forEach(b => {
                b.classList.remove('active');
                b.style.transform = 'scale(1)';
            });
            
            // Add active to clicked button with scale effect
            this.classList.add('active');
            this.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Animate grid items
            animateGridItems();
        });
    });
}

// ===== ANIMATE GRID ITEMS ON FILTER =====
function animateGridItems() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    const certGrid = document.getElementById('certGrid');
    
    [portfolioGrid, certGrid].forEach(grid => {
        if (!grid) return;
        
        const items = grid.querySelectorAll('.card-hover');
        
        // Fade out
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
        });
        
        // Fade in with stagger
        setTimeout(() => {
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                    item.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                }, index * 50);
            });
        }, 100);
    });
}

// ===== MODAL ANIMATIONS =====
function enhanceModalAnimations() {
    const portfolioModal = document.getElementById('portfolioModal');
    const certModal = document.getElementById('certModal');
    
    // Enhance modal open
    const originalShowProjectModal = window.showProjectModal;
    window.showProjectModal = function(project) {
        if (originalShowProjectModal) {
            originalShowProjectModal(project);
        }
        animateModalOpen(portfolioModal);
    };
    
    const originalShowCertModal = window.showCertModal;
    window.showCertModal = function(cert) {
        if (originalShowCertModal) {
            originalShowCertModal(cert);
        }
        animateModalOpen(certModal);
    };
    
    // Enhance modal close
    const closeButtons = document.querySelectorAll('[id^="close"]');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('[id$="Modal"]');
            if (modal) {
                animateModalClose(modal);
            }
        });
    });
    
    // Close on backdrop click with animation
    [portfolioModal, certModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    animateModalClose(this);
                }
            });
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('[id$="Modal"]:not(.hidden)');
            if (openModal) {
                animateModalClose(openModal);
            }
        }
    });
}

// ===== ANIMATE MODAL OPEN =====
function animateModalOpen(modal) {
    if (!modal) return;
    
    modal.classList.remove('hidden');
    const content = modal.querySelector('.modal-content');
    
    // Animate backdrop
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.transition = 'opacity 0.3s ease';
        modal.style.opacity = '1';
    }, 10);
    
    // Animate content
    if (content) {
        content.style.transform = 'scale(0.9) translateY(20px)';
        content.style.opacity = '0';
        
        setTimeout(() => {
            content.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            content.style.transform = 'scale(1) translateY(0)';
            content.style.opacity = '1';
        }, 50);
    }
    
    document.body.style.overflow = 'hidden';
}

// ===== ANIMATE MODAL CLOSE =====
function animateModalClose(modal) {
    if (!modal) return;
    
    const content = modal.querySelector('.modal-content');
    
    // Animate content out
    if (content) {
        content.style.transform = 'scale(0.95) translateY(10px)';
        content.style.opacity = '0';
    }
    
    // Animate backdrop out
    modal.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.overflow = 'auto';
        
        // Reset styles
        modal.style.opacity = '1';
        if (content) {
            content.style.transform = 'scale(1) translateY(0)';
            content.style.opacity = '1';
        }
    }, 300);
}

// ===== CARD HOVER EFFECTS =====
function enhanceCardHoverEffects() {
    const cards = document.querySelectorAll('.card-hover');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect
            this.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
            
            // Animate image inside
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
}

// ===== CURSOR TRAIL EFFECT (OPTIONAL - SUBTLE) =====
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-dot';
    cursor.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '0.6';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}

// ===== TYPING EFFECT FOR HEADLINE =====
function initTypingEffect() {
    const headline = document.getElementById('heroHeadline');
    if (!headline || !headline.textContent) return;
    
    const text = headline.textContent;
    headline.textContent = '';
    headline.style.opacity = '1';
    
    let index = 0;
    const typingSpeed = 50;
    
    function type() {
        if (index < text.length) {
            headline.textContent += text.charAt(index);
            index++;
            setTimeout(type, typingSpeed);
        }
    }
    
    // Start typing after hero animation
    setTimeout(type, 1000);
}

// ===== SKILL BADGE HOVER EFFECT =====
function enhanceSkillBadges() {
    const skillsContainer = document.getElementById('skillsContainer');
    if (!skillsContainer) return;
    
    const observer = new MutationObserver(() => {
        const badges = skillsContainer.querySelectorAll('span');
        badges.forEach((badge, index) => {
            badge.style.animationDelay = `${index * 0.05}s`;
            
            badge.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.1) rotate(2deg)';
            });
            
            badge.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            });
        });
    });
    
    observer.observe(skillsContainer, { childList: true });
}

// ===== LAZY LOAD IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== SMOOTH SCROLL WITH EASING =====
function enhanceSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== PROGRESS BAR ON SCROLL =====
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ===== INITIALIZE ALL ANIMATIONS =====
function initAllAnimations() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initAnimations, 100);
        });
    } else {
        setTimeout(initAnimations, 100);
    }
}

function initAnimations() {
    initScrollAnimations();
    initParallaxEffect();
    enhanceAboutSection();
    enhanceFilterButtons();
    enhanceModalAnimations();
    enhanceCardHoverEffects();
    enhanceSkillBadges();
    enhanceSmoothScroll();
    initScrollProgress();
    // initCursorEffect(); // Uncomment for cursor trail effect
    // initTypingEffect(); // Uncomment for typing effect
    initLazyLoading();
}

// Start initialization
initAllAnimations();