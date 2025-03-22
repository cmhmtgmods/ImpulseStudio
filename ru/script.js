// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize GSAP and plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // Initialize theme switcher
    initThemeSwitcher();
    
    // Initialize language switcher
    initLanguageSwitcher();
    
    
    // Initialize code animation
    initCodeAnimation();

    // Preloader with improved timing
    const preloader = document.getElementById('preloader');
    const preloaderProgressBar = document.querySelector('.preloader-progress-bar');
    let preloaderProgress = 0;
    
    const preloaderInterval = setInterval(() => {
        preloaderProgress += 5;
        preloaderProgressBar.style.width = `${preloaderProgress}%`;
        
        if (preloaderProgress >= 100) {
            clearInterval(preloaderInterval);
            
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    preloader.style.display = 'none';
                    animateHeroSection();
                }
            });
        }
    }, 50);

    // Elements
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('menuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('progressBar');
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialIndicators = document.querySelectorAll('.indicator');
    const testimonialPrev = document.getElementById('testimonialPrev');
    const testimonialNext = document.getElementById('testimonialNext');
    let currentSlide = 0;
    
    // Split text animation
    const splitTextElements = document.querySelectorAll('.split-text');
    
    splitTextElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        [...text].forEach((char, index) => {
            if (char === ' ') {
                element.innerHTML += ' ';
            } else {
                element.innerHTML += `<span class="char">${char}</span>`;
            }
        });
    });

    
    
    // Hero section animations
    function animateHeroSection() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroButtons = document.querySelector('.hero-buttons');
        const heroScroll = document.querySelector('.hero-scroll-indicator');
        
        // Set elements to be visible immediately
        gsap.set([heroTitle, heroSubtitle, heroButtons, heroScroll], { opacity: 1 });
        
        // Run animations with minimal or no delay
        gsap.fromTo(heroTitle, 
            { y: -20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.1 }
        );
        
        gsap.fromTo(heroSubtitle, 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.3 }
        );
        
        gsap.fromTo(heroButtons, 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.5 }
        );
        
        gsap.fromTo(heroScroll, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.7, delay: 0.7, ease: 'power2.out' }
        );
    }
    

    
    // Header scroll effect
    function handleScroll() {
        const scrollPosition = window.scrollY;
        
        // Update header style
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update progress bar
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollPosition / height) * 100;
        progressBar.style.width = `${scrolled}%`;
        
        // Show/hide back to top button
        if (scrollPosition > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
        
        // Activate nav link based on scroll position
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu toggle with improved animation
    function closeMenuWithAnimation() {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 500);
    }

    if (menuToggle && mobileMenu && menuClose) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.add('active');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        menuClose.addEventListener('click', () => {
            closeMenuWithAnimation();
        });

        // Close mobile menu when clicking on a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenuWithAnimation();
            });
        });
        
        // Close menu when clicking background
        const menuBg = document.querySelector('.mobile-menu-bg');
        if (menuBg) {
            menuBg.addEventListener('click', () => {
                closeMenuWithAnimation();
            });
        } else {
            mobileMenu.addEventListener('click', (event) => {
                if (event.target === mobileMenu) {
                    closeMenuWithAnimation();
                }
            });
        }
    } else {
        console.error('Mobile menu elements not found');
    }
    
    // Language switcher
    function getCurrentLanguage() {
        const path = window.location.pathname;
        if (path.includes('/ru')) return 'ru';
        if (path.includes('/bg')) return 'bg';
        return 'en'; // Default language
    }
    
    function switchLanguage(lang) {
        // Construct the new URL based on the language
        let newUrl;
        const currentUrl = window.location.href;
        const baseUrl = window.location.origin;
        
        // If we're already on a language path, replace it
        if (currentUrl.includes('/en/') || currentUrl.includes('/ru/') || currentUrl.includes('/bg/')) {
            newUrl = currentUrl.replace(/\/(en|ru|bg)\//, `/${lang}/`);
        } 
        // If there's no language in the path, add it
        else {
            const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
            newUrl = `${cleanBaseUrl}/${lang}/`;
        }
        
        // Redirect to the new URL
        window.location.href = newUrl;
    }
    
    const langButtons = document.querySelectorAll('.lang-btn');
    const mobileLangButtons = document.querySelectorAll('.mobile-language-switcher .lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    mobileLangButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Portfolio filter
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter work items
            workItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'power3.out',
                        delay: Math.random() * 0.3
                    });
                } else {
                    gsap.to(item, {
                        opacity: 0.3,
                        y: 20,
                        duration: 0.5,
                        ease: 'power3.out'
                    });
                }
            });
        });
    });
    
    // Work item click
    document.querySelectorAll('.work-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const modalContent = document.getElementById('modalContent');
            modalContent.innerHTML = '<div class="modal-loading">Loading project details...</div>';
            
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Simulate loading of project details
            setTimeout(() => {
                const workItem = link.closest('.work-item');
                const title = workItem.querySelector('.work-title').textContent;
                const description = workItem.querySelector('.work-description').textContent;
                const image = workItem.querySelector('img').getAttribute('src');
                
                modalContent.innerHTML = `
                    <div class="project-details">
                        <h2>${title}</h2>
                        <div class="project-image">
                            <img src="${image}" alt="${title}">
                        </div>
                        <div class="project-info">
                            <p>${description}</p>
                            <p>This is a detailed view of the project. In a real implementation, this would include comprehensive information about the project's goals, challenges, solutions, and outcomes.</p>
                            <div class="project-meta">
                                <div>
                                    <h3>Client</h3>
                                    <p>Brand Client</p>
                                </div>
                                <div>
                                    <h3>Services</h3>
                                    <p>Web Development, UI/UX Design</p>
                                </div>
                                <div>
                                    <h3>Year</h3>
                                    <p>2025</p>
                                </div>
                            </div>
                            <a href="#" class="btn btn-primary">Visit Project</a>
                        </div>
                    </div>
                `;
            }, 1000);
        });
    });
    
    // Close modal
    if (modalClose && projectModal) {
        modalClose.addEventListener('click', () => {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close modal on overlay click
        document.querySelector('.modal-overlay')?.addEventListener('click', () => {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Testimonial slider
    function showTestimonial(index) {
        // Hide all slides
        testimonialSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all indicators
        testimonialIndicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Handle edge cases
        if (index < 0) index = testimonialSlides.length - 1;
        if (index >= testimonialSlides.length) index = 0;
        
        // Show the selected slide
        testimonialSlides[index].classList.add('active');
        testimonialIndicators[index].classList.add('active');
        currentSlide = index;
    }
    
    if (testimonialNext && testimonialPrev) {
        testimonialNext.addEventListener('click', () => {
            showTestimonial(currentSlide + 1);
        });
        
        testimonialPrev.addEventListener('click', () => {
            showTestimonial(currentSlide - 1);
        });
        
        testimonialIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showTestimonial(index);
            });
        });
        
        // Auto rotate testimonials
        let testimonialInterval = setInterval(() => {
            showTestimonial(currentSlide + 1);
        }, 5000);
        
        const testimonialsContainer = document.querySelector('.testimonials-container');
        if (testimonialsContainer) {
            testimonialsContainer.addEventListener('mouseenter', () => {
                clearInterval(testimonialInterval);
            });
            
            testimonialsContainer.addEventListener('mouseleave', () => {
                testimonialInterval = setInterval(() => {
                    showTestimonial(currentSlide + 1);
                }, 5000);
            });
        }
    }
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            setTimeout(() => {
                this.innerHTML = `
                    <div class="form-success">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Message Sent!</h3>
                        <p>Thank you for reaching out. We'll get back to you shortly.</p>
                    </div>
                `;
            }, 1500);
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            setTimeout(() => {
                this.innerHTML = `
                    <p style="color: var(--secondary); font-weight: 500;">Thanks for subscribing!</p>
                `;
            }, 1000);
        });
    }
    
    // Scroll animations
    function initScrollAnimations() {
        // Animate section titles
        document.querySelectorAll('.section-title').forEach(title => {
            ScrollTrigger.create({
                trigger: title,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(title.querySelectorAll('.char'), {
                        opacity: 1,
                        y: 0,
                        stagger: 0.03,
                        duration: 0.5,
                        ease: 'power3.out'
                    });
                },
                once: true
            });
        });
        
        // Services animation
        gsap.utils.toArray('.service-card').forEach((card, index) => {
            ScrollTrigger.create({
                trigger: card,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: 'power3.out'
                    });
                },
                once: true
            });
        });
        
        // Work items animation
        gsap.utils.toArray('.work-item').forEach((item, index) => {
            ScrollTrigger.create({
                trigger: item,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: 'power3.out'
                    });
                },
                once: true
            });
        });
        
        // Process steps animation
        gsap.utils.toArray('.process-step').forEach((step, index) => {
            ScrollTrigger.create({
                trigger: step,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(step, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: 'power3.out'
                    });
                },
                once: true
            });
        });
        
        // Team members animation
        gsap.utils.toArray('.team-member').forEach((member, index) => {
            ScrollTrigger.create({
                trigger: member,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(member, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: 'power3.out'
                    });
                },
                once: true
            });
        });
        
        // Parallax effects
        gsap.utils.toArray(['.hero-bg-shapes .shape', '.process-shape', '.cta-shape']).forEach(shape => {
            gsap.to(shape, {
                y: () => Math.random() * 100 - 50,
                x: () => Math.random() * 100 - 50,
                scrollTrigger: {
                    trigger: shape.closest('section'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
        });
    }
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize testimonial slider
    showTestimonial(0);
});

// Theme switcher function with improved implementation
function initThemeSwitcher() {
    const themeToggle = document.querySelector('.theme-toggle');
    const mobileThemeToggle = document.querySelector('.mobile-theme-switcher .theme-toggle');
    const themeColor = document.getElementById('theme-color');
    const storedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or use system preference
    if (storedTheme) {
        document.body.classList.toggle('light-theme', storedTheme === 'light');
        if (themeColor) {
            themeColor.content = storedTheme === 'light' ? '#F8F9FC' : '#0B0A18';
        }
    } else {
        // Check user system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('light-theme', !prefersDarkMode);
        if (themeColor) {
            themeColor.content = !prefersDarkMode ? '#F8F9FC' : '#0B0A18';
        }
    }
    
    const toggleTheme = () => {
        document.body.classList.toggle('light-theme');
        
        // Save user preference
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        
        // Update meta theme-color
        if (themeColor) {
            themeColor.content = currentTheme === 'light' ? '#F8F9FC' : '#0B0A18';
        }
    };
    
    // Apply event listeners to theme toggles
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
}

// Function to initialize language switcher with flags
function initLanguageSwitcher() {
    const currentLang = getCurrentLanguage();
    const currentLangElement = document.getElementById('current-lang');
    const currentFlagElement = document.getElementById('current-flag');
    const langOptions = document.querySelectorAll('.lang-option');
    
    // Set current language and flag
    if (currentLangElement) {
        currentLangElement.textContent = currentLang.toUpperCase();
    }
    
    if (currentFlagElement) {
        currentFlagElement.className = 'lang-flag flag-' + currentLang;
    }
    
    // Event handlers for language options
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    function getCurrentLanguage() {
        const path = window.location.pathname;
        if (path.includes('/ru')) return 'ru';
        if (path.includes('/bg')) return 'bg';
        return 'en'; // Default language
    }
    
    function switchLanguage(lang) {
        // Construct the new URL based on the language
        let newUrl;
        const currentUrl = window.location.href;
        const baseUrl = window.location.origin;
        
        // If we're already on a language path, replace it
        if (currentUrl.includes('/en/') || currentUrl.includes('/ru/') || currentUrl.includes('/bg/')) {
            newUrl = currentUrl.replace(/\/(en|ru|bg)\//, `/${lang}/`);
        } 
        // If there's no language in the path, add it
        else {
            // Remove trailing slash from the baseUrl if present
            const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
            newUrl = `${cleanBaseUrl}/${lang}/`;
        }
        
        // Redirect to the new URL
        window.location.href = newUrl;
    }
}

// Function to initialize code animation with modern implementation
function initCodeAnimation() {
    const codeElement = document.getElementById('animated-code');
    const codeTabs = document.querySelectorAll('.code-tab');
    const editorContainer = document.getElementById('codeEditorContainer');
    const toggleButtons = document.querySelectorAll('#toggleEditor');
    const lineNumbersContainer = document.getElementById('lineNumbers');
    
    
    // If code element not found, exit function
    if (!codeElement) {
        console.warn('Code element not found');
        return;
    }

    // Set initial state (editor visibility)
    if (editorContainer) {
        // Start with no transform to enable animation
        setTimeout(() => {
            editorContainer.classList.add('animate-in');
        }, 300);
    }
    
    // Stop previous animations if they exist
    if (window.codeAnimationInterval) {
        clearInterval(window.codeAnimationInterval);
    }
    
    // Clean code for each tab (unchanged)
    const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Impulse Studio | Digital Experiences</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="header" id="header">
        <div class="container">
            <a href="#" class="logo">
                <div class="logo-container">
                    <span class="logo-quote logo-quote-left">&lt;/</span>
                    <span class="logo-text">Impulse</span>
                    <span class="logo-quote logo-quote-right">&gt;</span>
                </div>
            </a>
            <nav class="main-nav">
                <ul class="nav-list">
                    <li><a href="#home" class="nav-link active">Home</a></li>
                    <li><a href="#services" class="nav-link">Services</a></li>
                    <li><a href="#works" class="nav-link">Works</a></li>
                </ul>
            </nav>
        </div>
    </header>
</body>
</html>`;

    const cssCode = `/* Modern theme variables */
:root {
    --primary: #8257E5;
    --primary-light: #9466FF;
    --secondary: #FF5E93;
    --background: #0B0A18;
    --surface: #171531;
    --white: #FFFFFF;
    --gray: #8C8C9F;
    
    /* Typography */
    --font-primary: 'Outfit', sans-serif;
    --font-secondary: 'Inter', sans-serif;
    
    /* Spacing */
    --space-md: 2rem;
    --radius-md: 16px;
    --radius-full: 9999px;
}

body {
    font-family: var(--font-secondary);
    background-color: var(--background);
    color: var(--white);
    margin: 0;
    padding: 0;
}

.container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 var(--space-md);
}

/* Header styles */
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: var(--space-md) 0;
    z-index: 100;
}

.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}`;

    const jsCode = `// Main script for Impulse Studio
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme switcher
    initThemeSwitcher();
    
    // Handle scroll effects
    initScrollEffects();
    
    /**
     * Initialize theme switcher
     */
    function initThemeSwitcher() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        // Apply saved theme preference
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            document.body.classList.toggle('light-theme', 
                storedTheme === 'light');
        }
        
        // Handle theme toggle
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const currentTheme = document.body.classList.contains('light-theme') 
                ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
        });
    }
    
    /**
     * Initialize scroll effects
     */
    function initScrollEffects() {
        const header = document.getElementById('header');
        if (!header) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});`;

    // Enhanced syntax highlighting functions
    function highlightHtml(text) {
        // First safely escape HTML tags
        let safeHtml = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Highlight DOCTYPE
        safeHtml = safeHtml.replace(/(&lt;!DOCTYPE\s+html&gt;)/g, '<span class="syntax-doctype">$1</span>');
        
        // Highlight tags
        safeHtml = safeHtml.replace(/(&lt;\/?[a-zA-Z][a-zA-Z0-9]*)/g, '<span class="syntax-tag">$1</span>');
        
        // Highlight attributes
        safeHtml = safeHtml.replace(/([a-zA-Z-]+)=(&quot;|&apos;)/g, '<span class="syntax-attr">$1</span>=<span class="syntax-punctuation">$2</span>');
        
        // Highlight strings (content in quotes)
        safeHtml = safeHtml.replace(/(&quot;.*?&quot;|&apos;.*?&apos;)/g, '<span class="syntax-string">$1</span>');
        
        // Highlight closing brackets
        safeHtml = safeHtml.replace(/(&gt;)/g, '<span class="syntax-punctuation">$1</span>');
        
        return safeHtml;
    }

    function highlightCss(text) {
        // Safely escape HTML
        let safeCss = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Highlight comments
        safeCss = safeCss.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syntax-comment">$1</span>');
        
        // Highlight selectors and keywords
        safeCss = safeCss.replace(/(:root|@media|@keyframes|body|html|\.[a-zA-Z-_]+|#[a-zA-Z-_]+|[a-zA-Z-_]+(?=\s*\{))/g, '<span class="syntax-selector">$1</span>');
        
        // Highlight properties
        safeCss = safeCss.replace(/([a-zA-Z-]+)(?=\s*:)/g, '<span class="syntax-property">$1</span>');
        
        // Highlight values
        safeCss = safeCss.replace(/:(\s*)([^;{}]+)/g, ':<span class="syntax-value">$1$2</span>');
        
        // Highlight numbers with units
        safeCss = safeCss.replace(/(\d+)(px|rem|em|vh|vw|%|s|ms)/g, '<span class="syntax-value">$1$2</span>');
        
        // Highlight variables
        safeCss = safeCss.replace(/(--[a-zA-Z-]+)/g, '<span class="syntax-keyword">$1</span>');
        
        return safeCss;
    }

    function highlightJs(text) {
        // Escape HTML
        const safeJs = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Tokenization approach
        const tokens = [];
        let currentPosition = 0;
        const jsCode = safeJs;
        
        // Define patterns to match
        const patterns = [
            { type: 'comment', regex: /(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm },
            { type: 'string', regex: /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g },
            { 
                type: 'keyword', 
                regex: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|extends|import|export|try|catch|finally|async|await|from)\b/g 
            },
            { 
                type: 'builtin', 
                regex: /\b(document|window|console|localStorage|sessionStorage|setTimeout|setInterval)\b/g 
            },
            { type: 'literal', regex: /\b(true|false|null|undefined)\b/g },
            { type: 'number', regex: /\b(\d+(\.\d+)?)\b/g },
            { type: 'function', regex: /(\w+)(?=\s*\()/g },
            { type: 'property', regex: /\.(\w+)/g }
        ];
        
        // Build result with simple string concatenation
        let result = '';
        let lastIndex = 0;
        
        // Process line by line to ensure proper handling
        const lines = jsCode.split('\n');
        
        for (const line of lines) {
            let lineResult = '';
            let currentIndex = 0;
            const lineLength = line.length;
            
            while (currentIndex < lineLength) {
                let matchFound = false;
                
                // Try each pattern
                for (const pattern of patterns) {
                    pattern.regex.lastIndex = currentIndex;
                    const match = pattern.regex.exec(line);
                    
                    if (match && match.index === currentIndex) {
                        // Match found at current position
                        let cssClass = '';
                        switch (pattern.type) {
                            case 'comment': cssClass = 'syntax-comment'; break;
                            case 'string': cssClass = 'syntax-string'; break;
                            case 'keyword': cssClass = 'syntax-keyword'; break;
                            case 'builtin': cssClass = 'syntax-tag'; break;
                            case 'literal': cssClass = 'syntax-value'; break;
                            case 'number': cssClass = 'syntax-value'; break;
                            case 'function': cssClass = 'syntax-tag'; break;
                            case 'property': 
                                // Special case for properties
                                lineResult += '.';
                                lineResult += `<span class="syntax-property">${match[1]}</span>`;
                                currentIndex += match[0].length;
                                matchFound = true;
                                continue;
                        }
                        
                        lineResult += `<span class="${cssClass}">${match[0]}</span>`;
                        currentIndex += match[0].length;
                        matchFound = true;
                        break;
                    }
                    
                    // Reset regex lastIndex
                    pattern.regex.lastIndex = 0;
                }
                
                if (!matchFound) {
                    // No match found, add current character as plain text
                    lineResult += line.charAt(currentIndex);
                    currentIndex++;
                }
            }
            
            result += lineResult + '\n';
        }
        
        return result.trim();
    }

    // New function to sync line numbers with code
    function updateLineNumbers(code) {
        // Clear line numbers first
        lineNumbersContainer.innerHTML = '';
        
        // Count the number of lines
        const lines = code.split('\n');
        const lineCount = lines.length;
        
        // Create line numbers
        for (let i = 1; i <= lineCount; i++) {
            const lineNumber = document.createElement('div');
            lineNumber.className = 'line-number';
            lineNumber.textContent = i;
            lineNumbersContainer.appendChild(lineNumber);
        }
    }

    // Enhanced animation function with typing effect
    function animateTyping(tabType) {
        // Clear previous animations
        if (window.codeAnimationInterval) {
            clearInterval(window.codeAnimationInterval);
        }

            // Сбрасываем флаги при начале новой анимации
        let userScrolled = false;
        const autoScrollThreshold = 30; // Порог в пикселях от дна контейнера
        
         // Clear code container
    codeElement.innerHTML = '';
    lineNumbersContainer.innerHTML = '';
    
    // Select code and highlight function based on tab type
    let codeString, highlightFunc;
    
    if (tabType === 'html') {
        codeString = htmlCode;
        highlightFunc = highlightHtml;
    } else if (tabType === 'css') {
        codeString = cssCode;
        highlightFunc = highlightCss;
    } else if (tabType === 'js') {
        codeString = jsCode;
        highlightFunc = highlightJs;
    }
    
    // Split code into lines
    const lines = codeString.split('\n');
    
    // Создаем номера строк заранее для всего кода
    for (let i = 1; i <= lines.length; i++) {
        const lineNumber = document.createElement('div');
        lineNumber.className = 'line-number';
        lineNumber.textContent = i;
        lineNumbersContainer.appendChild(lineNumber);
    }
    
    // Create container for lines
    const linesContainer = document.createElement('div');
    linesContainer.className = 'code-lines';
    linesContainer.style.margin = '0';
    linesContainer.style.padding = '0';
    codeElement.appendChild(linesContainer);
    
    // Get code content container
    const codeContent = codeElement.closest('.code-content');

    
    
    // Add event listeners to detect user scrolling
    if (codeContent) {
        // Функция для проверки, находится ли скролл внизу контейнера
        function isScrollAtBottom() {
            return (codeContent.scrollHeight - codeContent.scrollTop - codeContent.clientHeight) < autoScrollThreshold;
        }
        
        // Event listeners for detecting user scrolling
        const scrollHandler = () => {
            userScrolled = !isScrollAtBottom();
            
            // Sync line numbers with code scroll
            lineNumbersContainer.scrollTop = codeContent.scrollTop;
        };
        
        codeContent.addEventListener('wheel', () => {
            userScrolled = true;
            // Проверяем положение через небольшую задержку, чтобы учесть инерцию
            setTimeout(scrollHandler, 50);
        });
        
        codeContent.addEventListener('scroll', scrollHandler);
        codeContent.addEventListener('touchmove', () => userScrolled = true);
        
        // Обработчик для возобновления автоскролла
        codeContent.addEventListener('scrollend', () => {
            if (isScrollAtBottom()) {
                userScrolled = false;
            }
        });
    }
    

    
    // Create typing animation
    editorContainer.classList.add('typing');
    
    let currentLine = 0;
    
    // Improved animation - add all lines immediately but make them visible one by one
    function animateLines() {
        if (currentLine >= lines.length) {
            editorContainer.classList.remove('typing');
            
            // Add blinking cursor at the end
            const cursor = document.createElement('span');
            cursor.className = 'cursor-blink';
            linesContainer.lastChild.appendChild(cursor);
            return;
        }
        
        const line = lines[currentLine];
        
        // Create a new line element
        const lineElement = document.createElement('div');
        lineElement.className = 'code-line';
        lineElement.style.margin = '0';
        lineElement.style.padding = '0 20px';
        lineElement.innerHTML = highlightFunc(line);
        linesContainer.appendChild(lineElement);
        
        // Make line visible after a small delay, but with longer transition
    requestAnimationFrame(() => {
        // Начальное состояние с высокой прозрачностью
        lineElement.style.opacity = '0';
        lineElement.style.transform = 'translateY(10px)';

        // Форсируем reflow для начала анимации
        lineElement.offsetHeight;
        
        // Запускаем плавную анимацию появления
        lineElement.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        lineElement.style.opacity = '1';
        lineElement.style.transform = 'translateY(0)';
            
            // Scroll to bottom only if user hasn't scrolled up manually
            if (codeContent && !userScrolled) {
                codeContent.scrollTop = codeContent.scrollHeight;
                lineNumbersContainer.scrollTop = codeContent.scrollTop;
            }
        }, 10);
        
        currentLine++;
        
        // Continue with next line with a random delay for natural typing effect
        setTimeout(animateLines, 300 + Math.random() * 150);
    }
    
    // Start the animation
    setTimeout(animateLines, 500);
}
    
    // Initialize tab switchers and event handlers
    let currentTab = 'html';
    
    // Add event handlers for tabs
    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.getAttribute('data-tab');
            if (tabType === currentTab) return;
            
            // Activate new tab visually
            codeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Save new active tab
            currentTab = tabType;
            
            // Animate code for selected tab
            animateTyping(tabType);
        });
    });
    
    // Collapsible code functionality
    let editorAnimationInitialized = false;
  
let isAnimating = false;
let editorInitialized = false;

// И полностью замени обработчик кнопок:
// Упрощенный обработчик для кнопок сворачивания/разворачивания
toggleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (!editorContainer) return;
        
        // Если это первое сворачивание, инициализируем редактор
        if (!editorInitialized) {
            // Сначала явно задаем высоту через DOM
            const currentHeight = editorContainer.offsetHeight;
            editorContainer.style.height = currentHeight + 'px';
            
            // Даем браузеру время применить стиль
            setTimeout(() => {
                // Затем выполняем анимацию
                performToggleAnimation();
            }, 50);
            
            editorInitialized = true;
        } else {
            // Для последующих нажатий выполняем анимацию сразу
            performToggleAnimation();
        }
        
        function performToggleAnimation() {
            // Сохраняем текущий прогресс анимации и состояние вкладок
            const currentTabElement = document.querySelector('.code-tab.active');
            const currentTabType = currentTabElement ? currentTabElement.getAttribute('data-tab') : 'html';
            
            // Сохраняем количество уже видимых строк (прогресс анимации)
            const visibleLines = document.querySelectorAll('.code-line').length;
            
            // Сохраняем состояние до переключения
            const wasMinimized = editorContainer.classList.contains('minimized');
            
            // Переключаем класс
            editorContainer.classList.toggle('minimized');
            
            // Сворачивание
            if (!wasMinimized) {
                gsap.to(editorContainer, {
                    height: "40px",
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: function() {
                        // Скрываем содержимое
                        const codeBody = editorContainer.querySelector('.code-editor-body');
                        if (codeBody) codeBody.style.display = 'none';
                    }
                });
            } 
            // Разворачивание
            else {
                // Показываем содержимое
                const codeBody = editorContainer.querySelector('.code-editor-body');
                if (codeBody) codeBody.style.display = 'flex';
                
                gsap.to(editorContainer, {
                    height: "440px",
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: function() {
                        // После разворачивания - продолжаем анимацию с того места, где остановились
                        // или запускаем заново, если нет прогресса
                        if (visibleLines > 0) {
                            continueAnimationFromLine(currentTabType, visibleLines);
                        } else {
                            animateTyping(currentTabType);
                        }
                    }
                });
            }
        }
    });
});

    
    // Sync scrolling between code content and line numbers
    const codeContent = document.querySelector('.code-content');
    if (codeContent && lineNumbersContainer) {
        codeContent.addEventListener('scroll', () => {
            lineNumbersContainer.scrollTop = codeContent.scrollTop;
        });
    }

 // Инициализация ScrollTrigger для запуска анимации при прокрутке
if (window.ScrollTrigger) {
    
    // Создаем ScrollTrigger для запуска анимации
    ScrollTrigger.create({
        trigger: editorContainer,
        start: "top 100%", // Запуск, когда верхняя часть редактора достигает 70% высоты окна
        once: true, // Запускаем только один раз
        onEnter: function() {
            console.log("Code editor scrolled into view, starting animation...");
            
            // Очищаем предыдущий контент
            codeElement.innerHTML = '';
            
            // Запускаем анимацию
            animateTyping('html');
            
            // Анимируем появление редактора
            gsap.fromTo(editorContainer, 
                { opacity: 0.5, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
        }
    });
} else {
    console.warn("ScrollTrigger not available, starting animation immediately");
    
    // Если ScrollTrigger недоступен, запускаем анимацию сразу
    setTimeout(() => {
        animateTyping('html');
    }, 500);
}


// Add a small visual indicator that code will animate when scrolled to
const placeholderLine = document.createElement('div');
placeholderLine.className = 'code-line';
placeholderLine.innerHTML = '<span class="syntax-comment">// Scroll to view code animation...</span><span class="cursor-blink"></span>';
codeElement.appendChild(placeholderLine);
}