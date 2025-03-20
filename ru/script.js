// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize GSAP and plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // Preloader
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
                duration: 0.4, // Reduced from 0.8
                ease: 'power2.out',
                onComplete: () => {
                    preloader.style.display = 'none';
                    // Execute immediately without requestAnimationFrame
                    animateHeroSection();
                }
            });
        }
    });

    
    
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
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0 }
        );
        
        gsap.fromTo(heroSubtitle, 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.05 }
        );
        
        gsap.fromTo(heroButtons, 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.1 }
        );
        
        gsap.fromTo(heroScroll, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.5, delay: 0.15, ease: 'power2.out' }
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
    
    // Mobile menu toggle
    // Функция для закрытия меню с анимацией
function closeMenuWithAnimation() {
    // Сначала удаляем класс active, что запускает анимацию через CSS transition
    mobileMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    
    // Не убираем overflow сразу, чтобы страница не прокручивалась во время анимации
    // Ждем завершения анимации (такое же время, как в CSS transition)
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 500); // 500ms - должно соответствовать длительности CSS transition
}

// Обработчик для кнопки закрытия
menuClose.addEventListener('click', () => {
    console.log('Menu close clicked');
    closeMenuWithAnimation();
});

// Обработчик для ссылок в меню
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenuWithAnimation();
    });
});

// Обработчик для фонового слоя
const menuBg = document.querySelector('.mobile-menu-bg');
if (menuBg) {
    menuBg.addEventListener('click', () => {
        console.log('Background clicked');
        closeMenuWithAnimation();
    });
} else {
    // Альтернативный вариант
    mobileMenu.addEventListener('click', (event) => {
        if (event.target === mobileMenu) {
            console.log('Menu container clicked');
            closeMenuWithAnimation();
        }
    });
}
    if (menuToggle && mobileMenu && menuClose) {
        // Add event listener for menu toggle button
        menuToggle.addEventListener('click', () => {
            console.log('Menu toggle clicked');
            menuToggle.classList.add('active');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Add event listener for menu close button
        menuClose.addEventListener('click', () => {
            console.log('Menu close clicked');
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
          // ДОБАВИТЬ ЭТУ ЧАСТЬ: Закрытие при клике на фон
    const menuBg = document.querySelector('.mobile-menu-bg');
    if (menuBg) {
        menuBg.addEventListener('click', () => {
            console.log('Background clicked');
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    } else {
        console.error('Mobile menu elements not found:', {
            menuToggle: !!menuToggle,
            mobileMenu: !!mobileMenu,
            menuClose: !!menuClose
        });
    }
    
    // Language switcher
    const langButtons = document.querySelectorAll('.lang-btn');
    const mobileLangButtons = document.querySelectorAll('.mobile-language-switcher .lang-btn');
    const currentLang = getCurrentLanguage();
    
    // Set initial language based on URL
    function getCurrentLanguage() {
        const path = window.location.pathname;
        if (path.includes('/ru')) return 'ru';
        if (path.includes('/bg')) return 'bg';
        return 'en'; // Default language
    }
    
    // Initialize the correct language button as active
    function initializeLanguage() {
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === currentLang) {
                btn.classList.add('active');
            }
        });
        
        mobileLangButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === currentLang) {
                btn.classList.add('active');
            }
        });
    }
    
    // Initialize
    initializeLanguage();
    
    // Function to switch language
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
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
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
            
            // Here you would typically fetch project details
            // For demo, we'll just simulate loading
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
    modalClose.addEventListener('click', () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close modal on overlay click
    document.querySelector('.modal-overlay').addEventListener('click', () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
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
    
    document.querySelector('.testimonials-container').addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    document.querySelector('.testimonials-container').addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            showTestimonial(currentSlide + 1);
        }, 5000);
    });
    
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