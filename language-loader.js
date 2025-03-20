// Language Loader - Handles loading and applying translations

// Use existing translations if available, otherwise create a new object
// This prevents "Identifier 'translations' has already been declared" error
if (typeof window.translations === 'undefined') {
    window.translations = {};
}

// Load the language based on URL path
function getCurrentLanguage() {
    const path = window.location.pathname;
    if (path.includes('/ru/')) return 'ru';
    if (path.includes('/bg/')) return 'bg';
    return 'en'; // Default language
}

// Safely load translations from separate file or use embedded fallback
function loadTranslations() {
    try {
        // Check if translations have already been loaded by the separate translations.js file
        // or the inline fallback in HTML
        if (Object.keys(window.translations).length > 0) {
            // Translations already loaded, no need to do anything
            return;
        }

        // Otherwise, try to fetch the translations file
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/shared/translations.js', false); // Synchronous for simplicity
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Extract the translations object from the JS file
                    const content = xhr.responseText;
                    const translationsStart = content.indexOf('const translations = {');
                    if (translationsStart !== -1) {
                        const translationsEnd = content.lastIndexOf('};') + 1;
                        const translationsCode = content.substring(translationsStart, translationsEnd + 1);
                        
                        // Execute the translations code
                        eval('window.translations = ' + translationsCode.replace('const translations = ', ''));
                    }
                }
            }
        };
        xhr.send();
    } catch (error) {
        console.error('Error loading translations:', error);
        
        // Fallback with minimal translations for critical UI elements
        if (Object.keys(window.translations).length === 0) {
            window.translations = {
                en: {
                    nav_home: "Home",
                    nav_services: "Services",
                    nav_works: "Works",
                    nav_process: "Process",
                    nav_team: "Team",
                    nav_contact: "Contact",
                    hero_title: "Creating digital experiences",
                    hero_subtitle: "We design & develop websites and applications that stand out and drive results."
                },
                ru: {
                    nav_home: "Главная",
                    nav_services: "Услуги",
                    nav_works: "Проекты",
                    nav_process: "Процесс",
                    nav_team: "Команда",
                    nav_contact: "Контакты",
                    hero_title: "Создаем цифровые впечатления",
                    hero_subtitle: "Мы проектируем и разрабатываем сайты и приложения, которые выделяются и приносят результаты."
                },
                bg: {
                    nav_home: "Начало",
                    nav_services: "Услуги",
                    nav_works: "Проекти",
                    nav_process: "Процес",
                    nav_team: "Екип",
                    nav_contact: "Контакти",
                    hero_title: "Създаваме дигитални преживявания",
                    hero_subtitle: "Проектираме и разработваме уебсайтове и приложения, които се открояват и постигат резултати."
                }
            };
        }
    }
}

// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
    // Make sure translations are loaded
    loadTranslations();
    
    const currentLang = getCurrentLanguage();
    
    // Set the document language attribute
    document.documentElement.lang = currentLang;
    
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (window.translations[currentLang] && window.translations[currentLang][key]) {
            // Special handling for input placeholders and values
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('placeholder')) {
                    element.setAttribute('placeholder', window.translations[currentLang][key]);
                } else {
                    element.value = window.translations[currentLang][key];
                }
            } 
            // Special handling for elements with specific attributes
            else if (element.hasAttribute('data-i18n-attr')) {
                const attr = element.getAttribute('data-i18n-attr');
                element.setAttribute(attr, window.translations[currentLang][key]);
            } 
            // Default: update text content
            else {
                element.textContent = window.translations[currentLang][key];
            }
        }
    });
    
    // Update language switcher active state
    const langButtons = document.querySelectorAll('.lang-btn');
    const mobileLangButtons = document.querySelectorAll('.mobile-language-switcher .lang-btn');
    
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

// Handle language switching
function setupLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const mobileLangButtons = document.querySelectorAll('.mobile-language-switcher .lang-btn');
    
    function switchLanguage(lang) {
        // Construct the new URL based on the language
        let newUrl;
        const currentUrl = window.location.href;
        const baseUrl = window.location.origin;
        const currentPath = window.location.pathname;
        
        // If we're already on a language path, replace it
        if (currentPath.match(/^\/(en|ru|bg)\//)) {
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
}

// Handle page redirects to language-specific paths
function handleLanguageRedirects() {
    const path = window.location.pathname;
    
    // Don't redirect if already on a language-specific path
    if (path.match(/^\/(en|ru|bg)\//)) {
        return;
    }
    
    // Don't redirect if on the root path with hash (e.g., /#services)
    if ((path === '/' || path === '') && window.location.hash) {
        return;
    }
    
    // For homepage or other paths without language prefix
    const currentLang = getCurrentLanguage();
    const newPath = `/${currentLang}${path === '/' ? '' : path}`;
    
    // Only redirect if not on the correct path already
    if (path !== newPath) {
        window.location.href = window.location.origin + newPath;
    }
}

// Wait for document load to avoid unnecessary warnings
window.addEventListener('load', () => {
    // Handle initial redirects
    handleLanguageRedirects();
    
    // Apply translations based on current language
    applyTranslations();
    
    // Setup language switcher
    setupLanguageSwitcher();
});

// Also initialize on DOMContentLoaded for faster UI reaction
document.addEventListener('DOMContentLoaded', () => {
    // Only do basic initialization for faster initial rendering
    applyTranslations();
    setupLanguageSwitcher();
});