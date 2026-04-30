// ================= DJ IGNITER MASTER SCRIPT =================
// Powers navbar, chat, animations, audio, forms across ALL pages
// Production-ready • Mobile-first • Error-proof

(function () {
    'use strict';

    console.log('🎧 DJ Igniter Script Loaded');

    // ================= CONFIG =================
    const CONFIG = {
        clickSound: 'click.mp3',
        successSound: 'success.mp3',
        paystackKey: 'pk_test_your_paystack_key_here', // Replace with real key
        animations: {
            duration: 0.6,
            easing: 'ease'
        }
    };

    // ================= UTILITY FUNCTIONS =================
    function playSound(id) {
        try {
            const audio = document.getElementById(id);
            if (audio) {
                audio.currentTime = 0;
                audio.volume = 0.3;
                audio.play().catch(e => console.log('Audio play failed:', e));
            }
        } catch (e) {
            console.log('Sound disabled');
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        if (!notification) return;

        notification.textContent = message;
        notification.className = `notification ${type} show`;

        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }

    function debounce(fn, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // ================= NAVBAR =================
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const mobileToggle = document.getElementById('mobileToggle');
        const navLinks = document.querySelector('.nav-links');

        if (!navbar || !mobileToggle || !navLinks) return;

        // Scroll effect
        window.addEventListener('scroll', debounce(() => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, 10));

        // Mobile menu
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            playSound('clickSound');
        });

        // Close mobile menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Active link highlighting
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.querySelectorAll('a').forEach(link => {
            if (link.getAttribute('href') === currentPage ||
                link.getAttribute('href') === currentPage.replace('.html', '')) {
                link.classList.add('active');
            }
        });
    }

    // ================= SMOOTH SCROLLING =================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ================= ANIMATIONS =================
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');

                    // Staggered animation for grids
                    if (entry.target.classList.contains('services-grid') ||
                        entry.target.classList.contains('pricing-grid')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, i) => {
                            setTimeout(() => {
                                child.style.opacity = '1';
                                child.style.transform = 'translateY(0)';
                            }, i * 150);
                        });
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade').forEach(el => observer.observe(el));
    }

    // ================= CHATBOT =================
    function initChatbot() {
        const chatToggle = document.getElementById('chatToggle');
        const chatbot = document.getElementById('chatbot');
        const closeChat = document.getElementById('closeChat');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatOutput = document.getElementById('chat-output');

        if (!chatToggle || !chatbot) return;

        let isOpen = false;

        chatToggle.addEventListener('click', () => {
            isOpen = !isOpen;
            chatbot.style.right = isOpen ? '20px' : '-400px';
            chatToggle.style.right = isOpen ? '450px' : '20px';
            if (isOpen && chatInput) chatInput.focus();
            playSound('clickSound');
        });

        if (closeChat) {
            closeChat.addEventListener('click', () => {
                isOpen = false;
                chatbot.style.right = '-400px';
                chatToggle.style.right = '20px';
            });
        }

        function addMessage(sender, text) {
            if (!chatOutput) return;
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${sender}`;
            messageDiv.innerHTML = `
                <div class="avatar">${sender === 'user' ? '👤' : '🤖'}</div>
                <div class="message-text">${text}</div>
            `;
            chatOutput.appendChild(messageDiv);
            chatOutput.scrollTop = chatOutput.scrollHeight;
        }

        function sendChatMessage() {
            if (!chatInput || !chatSend) return;
            const message = chatInput.value.trim();
            if (!message) return;

            addMessage('user', message);
            chatInput.value = '';

            // AI Response
            setTimeout(() => {
                const responses = [
                    "Thanks! Check booking.html for instant confirmation 🚀",
                    "Visit pricing.html for full details 💰",
                    "Try 'booking', 'pricing', or 'services'! 🎯",
                    "I'm here 24/7. What service interests you? 🎧💻"
                ];
                const response = responses[Math.floor(Math.random() * responses.length)];
                addMessage('bot', response);
                playSound('successSound');
            }, 800);
        }

        if (chatSend) chatSend.addEventListener('click', sendChatMessage);
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendChatMessage();
            });
        }
    }

    // ================= FORM HANDLING =================
    function initForms() {
        const forms = document.querySelectorAll('form[id]');
        forms.forEach(form => {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                data.timestamp = new Date().toISOString();

                // Save to localStorage
                let submissions = JSON.parse(localStorage.getItem(form.id)) || [];
                submissions.push(data);
                localStorage.setItem(form.id, JSON.stringify(submissions));

                // Success feedback
                const feedback = this.parentElement.querySelector('[id*="Feedback"], .form-feedback');
                if (feedback) {
                    feedback.innerHTML = '<i class="fas fa-check-circle"></i> Submitted successfully!';
                    feedback.className = 'form-feedback success';
                    feedback.style.display = 'block';
                }

                playSound('successSound');
                showNotification('Form submitted! Check your email.');
                this.reset();
            });
        });
    }

    // ================= COUNTER ANIMATIONS =================
    function initCounters() {
        const counters = document.querySelectorAll('[data-target]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseFloat(counter.dataset.target);
                    const increment = target / 100;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target.toLocaleString();
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current).toLocaleString();
                        }
                    }, 20);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    // ================= BOOKING PREFILL =================
    function initBookingPrefill() {
        const urlParams = new URLSearchParams(window.location.search);
        const service = urlParams.get('service');
        const name = urlParams.get('name');
        const email = urlParams.get('email');
        const details = urlParams.get('details');

        // Prefill form if on booking page
        if (window.location.pathname.includes('booking.html') ||
            document.getElementById('bookingForm')) {

            if (service && document.getElementById('service')) {
                document.getElementById('service').value = service;
            }
            if (name && document.getElementById('name')) {
                document.getElementById('name').value = name;
            }
            if (email && document.getElementById('email')) {
                document.getElementById('email').value = email;
            }
            if (details && document.getElementById('details')) {
                document.getElementById('details').value = details;
            }
        }
    }

    // ================= ADMIN DASHBOARD =================
    function initAdminFeatures() {
        if (!window.location.pathname.includes('admin.html')) return;

        // Load bookings
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];

        console.table(bookings);
        console.table(messages);

        // Export data
        window.exportData = function () {
            const data = {
                bookings: bookings,
                messages: messages,
                timestamp: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dj-igniter-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
        };
    }

    // ================= MOBILE OPTIMIZATIONS =================
    function initMobileOptimizations() {
        // Prevent zoom on input focus (iOS)
        let viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            const originalContent = viewport.content;
            document.addEventListener('touchstart', () => {
                viewport.content = originalContent + ', maximum-scale=1.0';
            }, true);
            document.addEventListener('touchend', () => {
                viewport.content = originalContent;
            }, true);
        }

        // Fast click for mobile
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (e) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    // ================= INITIALIZE EVERYTHING =================
    document.addEventListener('DOMContentLoaded', function () {
        initNavbar();
        initSmoothScroll();
        initAnimations();
        initChatbot();
        initForms();
        initCounters();
        initBookingPrefill();
        initAdminFeatures();
        initMobileOptimizations();

        // Global click sound
        document.addEventListener('click', (e) => {
            if (e.target.closest('a[href], button, .btn, .service-card')) {
                playSound('clickSound');
            }
        });

        console.log('✅ DJ Igniter fully initialized');
    });

    // ================= WINDOW EVENTS =================
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
        // Preload sounds
        playSound('clickSound');
    });

    // Error handling
    window.addEventListener('error', function (e) {
        console.error('Script error:', e.error);
        showNotification('Something went wrong. Refreshing...', 'error');
    });

})();
