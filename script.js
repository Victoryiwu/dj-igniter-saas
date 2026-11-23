// ================= DJ IGNITER MASTER SCRIPT =================
// Powers navbar, quick AI drawer, animations, audio, forms across ALL pages
// Production-ready • Mobile-first • Error-proof
(function () {
    'use strict';

    const CONFIG = {
        clickSound: 'click.mp3',
        successSound: 'click.mp3',
        paystackKey: 'pk_test_your_paystack_key_here',
        animations: {
            duration: 0.6,
            easing: 'ease'
        }
    };

    const prefersReducedMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ================= UTILITY FUNCTIONS =================
    function playSound(id) {
        try {
            const audio = document.getElementById(id);
            if (!audio || typeof audio.play !== 'function') return;
            audio.currentTime = 0;
            audio.volume = 0.25;
            audio.play().catch(() => {});
        } catch (_) {
            // Audio playback blocked or unavailable
        }
    }

    function debounce(fn, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function loadStorage(key, fallback) {
        if (window.Utils && typeof window.Utils.load === 'function') {
            return window.Utils.load(key, fallback);
        }
        try {
            const raw = localStorage.getItem(key);
            return raw !== null ? JSON.parse(raw) : fallback;
        } catch (_) {
            return fallback;
        }
    }

    // ================= NAVBAR & MOBILE MENU =================
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const mobileToggle = document.getElementById('mobileToggle');
        const navLinks = document.querySelector('.nav-links');
        const navContainer = navbar ? navbar.querySelector('.nav-container') : null;
        const navElement = navContainer ? navContainer.querySelector('nav') : null;

        if (!navbar) return;

        window.addEventListener(
            'scroll',
            debounce(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            }, 10),
            { passive: true }
        );

        if (navLinks) {
            const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
            navLinks.querySelectorAll('a').forEach((link) => {
                const href = (link.getAttribute('href') || '').split('#')[0].split('?')[0].toLowerCase();
                if (
                    href &&
                    (href === currentPage ||
                        href.replace('.html', '') === currentPage.replace('.html', ''))
                ) {
                    link.classList.add('active');
                }
            });
        }

        if (mobileToggle && navElement) {
            mobileToggle.setAttribute('aria-expanded', 'false');

            const closeMenu = () => {
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                navElement.classList.remove('mobile-open');
                if (navLinks) navLinks.classList.remove('show');
            };

            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = navElement.classList.toggle('mobile-open');
                mobileToggle.classList.toggle('active', isOpen);
                mobileToggle.setAttribute('aria-expanded', String(isOpen));
                if (navLinks) navLinks.classList.toggle('show', isOpen);
            });

            if (navLinks) {
                navLinks.querySelectorAll('a').forEach((link) => {
                    link.addEventListener('click', closeMenu);
                });
            }

            document.addEventListener('click', (e) => {
                if (!navbar.contains(e.target)) {
                    closeMenu();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeMenu();
            });

            window.addEventListener(
                'resize',
                debounce(() => {
                    if (window.innerWidth > 1080) {
                        closeMenu();
                    }
                }, 150),
                { passive: true }
            );
        }
    }

    // ================= SMOOTH SCROLLING =================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const hash = this.getAttribute('href');
                if (!hash || hash === '#') return;
                const target = document.querySelector(hash);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: prefersReducedMotion ? 'auto' : 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ================= ANIMATIONS =================
    function initAnimations() {
        const heroes = document.querySelectorAll(
            '.hero, .service-hero, .booking-hero, .contact-hero, .about-hero, .portfolio-hero, .pricing-hero, .assistant-hero, .services-hero'
        );
        heroes.forEach((hero) => hero.classList.add('show'));

        const fadeEls = document.querySelectorAll('.fade');
        if (!fadeEls.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            fadeEls.forEach((el) => el.classList.add('show'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('show');

                    if (
                        entry.target.classList.contains('services-grid') ||
                        entry.target.classList.contains('pricing-grid')
                    ) {
                        Array.from(entry.target.children).forEach((child, i) => {
                            setTimeout(() => {
                                child.style.opacity = '1';
                                child.style.transform = 'translateY(0)';
                            }, i * 100);
                        });
                    }

                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.08,
                rootMargin: '0px 0px -30px 0px'
            }
        );

        fadeEls.forEach((el) => observer.observe(el));
    }

    // ================= SMART CHATBOT DRAWER =================
    function buildAssistantReply(prompt) {
        const q = prompt.toLowerCase().trim();

        if (/(price|pricing|cost|rate|how much|fee|₦|naira)/i.test(q)) {
            return 'Starting rates: Event DJ from ₦800k (Weddings ~₦1.2M, Corporate ~₦1.5M), Mixtapes from ₦150k (Pro Mix ₦350k), and Websites from ₦300k. Open pricing.html or assistant.html for details.';
        }
        if (/(book|booking|reserve|hire|date|slot|event)/i.test(q)) {
            return 'To book, head to booking.html with your service, preferred date, and event/project notes—or ask on assistant.html if you want help shaping your brief first.';
        }
        if (/(mixtape|mix|dj|set|party|wedding|club|afrobeats|amapiano)/i.test(q)) {
            return 'We do live DJ sets and custom mixtapes across Afrobeats, street-pop, Amapiano, hip-hop, and party hits—tailored to your crowd energy and runtime.';
        }
        if (/(web|website|code|site|app|store|html|css|js|react)/i.test(q)) {
            return 'We build responsive landing pages, business websites, and web apps with clean UI, mobile layouts, and structured forms. Check programming.html or tell me what you are building.';
        }
        return 'I can help with DJ bookings, pricing, mixtapes, websites, or brainstorming ideas. What would you like to explore?';
    }

    function initChatbot() {
        const chatToggle = document.getElementById('chatToggle');
        const chatbot = document.getElementById('chatbot');
        const closeChat = document.getElementById('closeChat');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatOutput = document.getElementById('chat-output');

        if (!chatToggle) return;

        // If the page does not have an inline #chatbot drawer, route #chatToggle straight to assistant.html
        if (!chatbot) {
            chatToggle.addEventListener('click', () => {
                window.location.href = 'assistant.html';
            });
            return;
        }

        let isOpen = false;

        const setChatState = (open) => {
            isOpen = open;
            chatbot.classList.toggle('open', isOpen);
            chatbot.style.display = isOpen ? 'flex' : 'none';
            chatToggle.setAttribute('aria-expanded', String(isOpen));
            if (isOpen && chatInput) chatInput.focus();
        };

        chatToggle.addEventListener('click', () => setChatState(!isOpen));

        if (closeChat) {
            closeChat.addEventListener('click', () => setChatState(false));
        }

        function addMessage(sender, text) {
            if (!chatOutput) return;
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${sender}`;

            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            avatar.setAttribute('aria-hidden', 'true');
            avatar.textContent = sender === 'user' ? 'You' : 'AI';

            const messageText = document.createElement('div');
            messageText.className = 'message-text';
            messageText.textContent = text;

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(messageText);
            chatOutput.appendChild(messageDiv);
            chatOutput.scrollTop = chatOutput.scrollHeight;
        }

        function sendChatMessage() {
            if (!chatInput) return;
            const message = chatInput.value.trim();
            if (!message) return;
            addMessage('user', message);
            chatInput.value = '';

            setTimeout(() => {
                addMessage('bot', buildAssistantReply(message));
                playSound('successSound');
            }, 300);
        }

        if (chatSend) chatSend.addEventListener('click', sendChatMessage);
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                }
            });
        }
    }

    // ================= COUNTER ANIMATIONS =================
    function initCounters() {
        const counters = document.querySelectorAll('[data-target]');
        if (!counters.length) return;

        const animateCounter = (counter) => {
            const target = parseFloat(counter.dataset.target);
            if (!Number.isFinite(target)) return;

            if (prefersReducedMotion) {
                counter.textContent = target.toLocaleString();
                return;
            }

            const steps = 50;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Number.isInteger(target)
                        ? Math.floor(current).toLocaleString()
                        : current.toFixed(1);
                }
            }, 24);
        };

        if (!('IntersectionObserver' in window)) {
            counters.forEach(animateCounter);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        });

        counters.forEach((counter) => observer.observe(counter));
    }

    // ================= BOOKING PREFILL =================
    function initBookingPrefill() {
        const urlParams = new URLSearchParams(window.location.search);
        const service = urlParams.get('service');
        const name = urlParams.get('name');
        const email = urlParams.get('email');
        const details = urlParams.get('details');

        const isBookingPage =
            window.location.pathname.toLowerCase().includes('booking.html') ||
            Boolean(document.getElementById('bookingForm'));

        if (!isBookingPage) return;

        const serviceEl = document.getElementById('service');
        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');
        const detailsEl = document.getElementById('details');

        if (service && serviceEl && !serviceEl.value) {
            serviceEl.value = service;
            if (typeof window.updatePriceDisplay === 'function') {
                window.updatePriceDisplay();
            }
        }
        if (name && nameEl && !nameEl.value) nameEl.value = name;
        if (email && emailEl && !emailEl.value) emailEl.value = email;
        if (details && detailsEl && !detailsEl.value) detailsEl.value = details;
    }

    // ================= ADMIN DASHBOARD =================
    function initAdminFeatures() {
        if (!window.location.pathname.toLowerCase().includes('admin.html')) return;
        if (typeof window.exportData === 'function') return;

        window.exportData = function () {
            const bookings = loadStorage('dj_igniter_bookings', loadStorage('bookings', []));
            const messages = loadStorage('contactMessages', []);
            const payload = {
                bookings,
                messages,
                timestamp: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dj-igniter-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        };
    }

    // ================= BACK TO TOP =================
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    // ================= THEME & PRELOADER =================
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const applyThemeIcon = (isLight) => {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
            } else {
                themeToggle.textContent = isLight ? '☀️' : '🌙';
            }
        };

        let initialLight = false;
        try {
            initialLight = localStorage.getItem('dj-theme') === 'light';
        } catch (_) {
            initialLight = false;
        }

        if (initialLight) {
            document.body.classList.add('light-mode');
        }
        applyThemeIcon(initialLight);

        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-mode');
            try {
                localStorage.setItem('dj-theme', isLight ? 'light' : 'dark');
            } catch (_) {
                // Storage unavailable
            }
            applyThemeIcon(isLight);
        });
    }

    function initPreloader() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        let hidden = false;
        const hideLoader = () => {
            if (hidden) return;
            hidden = true;
            const fadeMs = prefersReducedMotion ? 0 : 350;
            loader.style.transition = `opacity ${fadeMs}ms ease`;
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.add('loaded');
            }, fadeMs);
        };

        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            window.addEventListener('load', hideLoader, { once: true });
            setTimeout(hideLoader, 2500);
        }
    }

    function initTypingEffect() {
        const typingElement = document.getElementById('typingText');
        if (!typingElement) return;

        const texts = [
            'Where Beats Meet Technology',
            'DJ • Mixtapes • Web Craft',
            'High-Energy Sets & Clean Code'
        ];

        typingElement.textContent = texts[0];

        if (prefersReducedMotion) {
            return;
        }

        let textIndex = 0;
        let charIndex = texts[0].length;

        function eraseCurrent() {
            if (charIndex > 0) {
                charIndex--;
                typingElement.textContent = texts[textIndex].slice(0, charIndex);
                setTimeout(eraseCurrent, 40);
            } else {
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(typeNext, 250);
            }
        }

        function typeNext() {
            const currentPhrase = texts[textIndex];
            if (charIndex < currentPhrase.length) {
                charIndex++;
                typingElement.textContent = currentPhrase.slice(0, charIndex);
                setTimeout(typeNext, 75);
            } else {
                setTimeout(eraseCurrent, 2400);
            }
        }

        setTimeout(eraseCurrent, 2200);
    }

    // ================= INITIALIZE EVERYTHING =================
    document.addEventListener('DOMContentLoaded', function () {
        initNavbar();
        initSmoothScroll();
        initAnimations();
        initChatbot();
        initCounters();
        initBookingPrefill();
        initAdminFeatures();
        initBackToTop();
        initThemeToggle();
        initPreloader();
        initTypingEffect();

        document.addEventListener('click', (e) => {
            const clickable = e.target.closest('a[href], button, .btn, .service-card');
            if (!clickable) return;
            if (clickable.id === 'themeToggle' || clickable.id === 'chatToggle') return;
            playSound('clickSound');
        });
    });

    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });

    window.addEventListener('error', function (e) {
        console.error('Script error:', e.error || e.message);
    });
})();
