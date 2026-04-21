// =========================
// 🔥 GLOBAL BOOKING SYSTEM (UPGRADED)
// =========================

// Show / hide custom service input
function checkOther(selectElement) {
    let customInput =
        selectElement.parentElement.querySelector('.customService') ||
        document.getElementById('customService');

    if (!customInput) return;

    if (selectElement.value === 'Other') {
        customInput.style.display = 'block';
        customInput.required = true;
    } else {
        customInput.style.display = 'none';
        customInput.required = false;
    }
}

// Save booking (WORKS FOR ALL PAGES)
function saveBooking(event) {
    event.preventDefault();

    const form = event.target;

    // Try both class + ID system (VERY IMPORTANT FIX)
    const name =
        form.querySelector('input[name="name"]')?.value ||
        document.getElementById('name')?.value;

    const email =
        form.querySelector('input[name="email"]')?.value ||
        document.getElementById('email')?.value;

    const serviceSelect =
        form.querySelector('.serviceSelect') ||
        document.getElementById('service');

    const customService =
        form.querySelector('.customService')?.value ||
        document.getElementById('customService')?.value;

    const date =
        form.querySelector('input[name="date"]')?.value ||
        document.getElementById('date')?.value;

    if (!serviceSelect) return;

    const service =
        serviceSelect.value === 'Other'
            ? customService
            : serviceSelect.value;

    const booking = { name, email, service, date };

    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Show success message
    let successMsg =
        form.querySelector('.successMsg') ||
        document.getElementById('successMsg');

    if (successMsg) {
        successMsg.textContent = '✅ Booking Saved Successfully!';
        successMsg.style.color = '#00ff88';
    }

    form.reset();

    if (form.querySelector('.customService')) {
        form.querySelector('.customService').style.display = 'none';
    }

    if (document.getElementById('customService')) {
        document.getElementById('customService').style.display = 'none';
    }
}

// =========================
// 🚀 AUTO INIT
// =========================
document.addEventListener('DOMContentLoaded', () => {

    // Attach to ALL booking forms
    const forms = document.querySelectorAll('.bookingForm, form');

    forms.forEach(form => {
        form.addEventListener('submit', saveBooking);

        // Attach select change
        const select =
            form.querySelector('.serviceSelect') ||
            form.querySelector('#service');

        if (select) {
            select.addEventListener('change', () => checkOther(select));
        }
    });

});
// ================= SMOOTH PAGE INIT =================
document.addEventListener('DOMContentLoaded', function () {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Fade in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });

    document.querySelectorAll('.fade').forEach(el => observer.observe(el));

    // Mobile menu toggle
    document.getElementById('mobileToggle')?.addEventListener('click', function () {
        document.querySelector('.nav-links').classList.toggle('active');
    });

    // Chat functionality
    const chatToggle = document.getElementById('chatToggle');
    const chatbot = document.getElementById('chatbot');
    const closeChat = document.getElementById('closeChat');

    chatToggle?.addEventListener('click', () => {
        chatbot.style.display = 'flex';
        setTimeout(() => chatbot.classList.add('show'), 10);
    });

    closeChat?.addEventListener('click', () => {
        chatbot.classList.remove('show');
        setTimeout(() => chatbot.style.display = 'none', 300);
    });

    // Click sound
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('click', () => {
            const audio = document.getElementById('clickSound');
            audio.currentTime = 0;
            audio.play().catch(() => { }); // Ignore audio errors
        });
    });
});
// ================= ENHANCED ADMIN SYSTEM =================
class AdminDashboard {
    constructor() {
        this.correctPassword = "igniter2024"; // Updated secure password
        this.init();
    }

    init() {
        this.playClickSound = () => {
            const audio = document.getElementById('clickSound');
            audio.currentTime = 0;
            audio.play().catch(() => { });
        };

        // Event listeners
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                this.playClickSound();
            }
        });

        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.searchBookings(e.target.value);
        });

        // Navbar scroll
        window.addEventListener('scroll', () => {
            document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    checkPassword() {
        const input = document.getElementById("password").value;
        const errorMsg = document.getElementById("errorMsg");

        if (input === this.correctPassword) {
            document.getElementById("loginBox").style.display = "none";
            document.getElementById("adminPanel").style.display = "block";
            this.updateStats();
            this.loadBookings();
            document.getElementById("password").value = "";
        } else {
            errorMsg.textContent = "❌ Incorrect Password";
            errorMsg.style.opacity = "1";
            setTimeout(() => errorMsg.style.opacity = "0", 3000);
        }
    }

    loadBookings(searchTerm = '') {
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        const filteredBookings = bookings.filter(booking =>
            booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.service.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredBookings.length === 0) {
            document.getElementById("bookingList").innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>No bookings found</h3>
                    <p>Try adjusting your search terms</p>
                </div>
            `;
            return;
        }

        let output = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;

        filteredBookings.forEach((booking, index) => {
            const globalIndex = JSON.parse(localStorage.getItem("bookings")).indexOf(booking);
            output += `
                <tr>
                    <td><strong>${booking.name}</strong></td>
                    <td>${booking.email}</td>
                    <td>${booking.service}</td>
                    <td>${new Date(booking.date).toLocaleDateString()}</td>
                    <td><span class="status-pending">⏳ Pending</span></td>
                    <td>
                        <button onclick="admin.deleteBooking(${globalIndex})" class="btn btn-danger" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                            ❌ Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        output += "</tbody></table>";
        document.getElementById("bookingList").innerHTML = output;
    }

    searchBookings(term) {
        this.loadBookings(term);
    }

    deleteBooking(index) {
        if (confirm("Delete this booking?")) {
            let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
            bookings.splice(index, 1);
            localStorage.setItem("bookings", JSON.stringify(bookings));
            this.updateStats();
            this.loadBookings();
        }
    }

    clearBookings() {
        if (confirm("⚠️ Delete ALL bookings? This cannot be undone!")) {
            localStorage.removeItem("bookings");
            this.updateStats();
            this.loadBookings();
        }
    }

    exportData() {
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        if (bookings.length === 0) return alert("No data to export");

        let csv = "Name,Email,Service,Date\n";
        bookings.forEach(b => {
            csv += `"${b.name}","${b.email}","${b.service}","${b.date}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dj-igniter-bookings-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }

    updateStats() {
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        document.getElementById("totalBookings").textContent = bookings.length;
        document.getElementById("pending").textContent = bookings.length;
        document.getElementById("completed").textContent = "0";
    }

    logout() {
        document.getElementById("loginBox").style.display = "flex";
        document.getElementById("adminPanel").style.display = "none";
        document.getElementById("password").value = "";
        document.getElementById("errorMsg").textContent = "";
    }
}

// Initialize dashboard
const admin = new AdminDashboard();

// Global functions for onclick handlers
window.checkPassword = () => admin.checkPassword();
window.logout = () => admin.logout();
window.loadBookings = () => admin.loadBookings();
window.clearBookings = () => admin.clearBookings();
window.exportData = () => admin.exportData();
// ================= AVA AI ASSISTANT =================
class AvaAssistant {
    constructor() {
        this.responses = {
            greetings: ["Hello! How can I help with your DJ booking?", "Hi there! Ready to book DJ Igniter?", "Hey! What service interests you?"],
            booking: ["Great choice! Visit the <a href='booking.html'>Booking page</a> to schedule.", "Click 'Book Now' in the navbar or visit booking.html!", "Ready to book? Use the booking form!"],
            pricing: ["Pricing starts at $500/event. Visit <a href='pricing.html'>Pricing page</a> for details!", "Packages from $500-$2000. See pricing page for full breakdown."],
            services: ["DJ Igniter offers: Weddings, Corporate, Clubs, Private Events. Full list on Services page!", "Services: DJ Sets, Event Hosting, Custom Playlists, Website Development."],
            availability: ["Check real-time availability on the booking form!", "Most weekends available. Submit booking form for instant confirmation."],
            website: ["DJ Igniter builds premium websites like this one! Contact for custom sites.", "Full-stack web development + DJ services combo!"],
            contact: ["Email: info@djigniter.com | Phone: (555) 123-DJ | Booking form available!"],
            default: ["I can help with bookings, pricing, services! What specifically?", "Try asking about 'booking', 'pricing', or 'services'!"]
        };

        this.init();
    }

    init() {
        const input = document.getElementById('userInput');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Focus on load
        setTimeout(() => input.focus(), 1000);
    }

    async sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';

        // Show typing
        this.showTyping();

        // Simulate AI response delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

        this.hideTyping();
        this.generateResponse(message);
    }

    addMessage(sender, text) {
        const chatbox = document.getElementById('chatbox');
        const isUser = sender === 'user';

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

        messageDiv.innerHTML = `
            <div class="avatar">${isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>'}</div>
            <div class="message-content">
                ${text.replace(/booking/g, "<a href='booking.html' style='color: var(--primary-gold);'>booking</a>")
                .replace(/pricing/g, "<a href='pricing.html' style='color: var(--primary-gold);'>pricing</a>")}
            </div>
        `;

        chatbox.appendChild(messageDiv);
        chatbox.scrollTop = chatbox.scrollHeight;

        // Play sound
        document.getElementById('sendSound' || 'clickSound').play().catch(() => { });
    }

    showTyping() {
        const lastMessage = document.querySelector('.bot-message:last-child .message-content');
        const typing = lastMessage.querySelector('.typing-indicator') ||
            document.createElement('div');
        typing.className = 'typing-indicator';
        typing.innerHTML = '<span></span><span></span><span></span>';
        typing.style.display = 'flex';
        lastMessage.appendChild(typing);
    }

    hideTyping() {
        document.querySelector('.typing-indicator')?.remove();
    }

    generateResponse(message) {
        const msg = message.toLowerCase();

        // Match responses
        for (let [key, responses] of Object.entries(this.responses)) {
            if (msg.includes(key)) {
                return this.addMessage('bot', responses[Math.floor(Math.random() * responses.length)]);
            }
        }

        this.addMessage('bot', this.responses.default[Math.floor(Math.random() * this.responses.default.length)]);
    }
}

// Quick reply functions
function quickReply(type) {
    document.getElementById('userInput').value = type;
    sendMessage();
}

function clearChat() {
    if (confirm('Clear chat history?')) {
        document.getElementById('chatbox').innerHTML = `
            <div class="message bot-message welcome-message">
                <div class="avatar"><i class="fas fa-robot"></i></div>
                <div class="message-content">
                    <p>Chat cleared! How can I help you today? 🎧</p>
                </div>
            </div>
        `;
    }
}

function focusChat() {
    document.getElementById('userInput').focus();
    document.getElementById('userInput').placeholder = "Ask me anything...";
}

// Initialize
const ava = new AvaAssistant();
window.sendMessage = sendMessage;
window.quickReply = quickReply;
window.clearChat = clearChat;
window.focusChat = focusChat;
// ================= PREMIUM BOOKING SYSTEM =================
class BookingSystem {
    constructor() {
        this.init();
        this.checkAvailability();
    }

    init() {
        // Form submission
        document.getElementById('bookingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitBooking();
        });

        // Play sounds
        document.addEventListener('click', (e) => {
            if (e.target.closest('button, .cta, a')) {
                this.playSound('clickSound');
            }
        });

        // Navbar scroll
        window.addEventListener('scroll', () => {
            document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
        });

        // Set min date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('date').min = tomorrow.toISOString().split('T')[0];
    }

    async submitBooking() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            details: document.getElementById('details').value,
            timestamp: new Date().toISOString(),
            id: 'B' + Date.now()
        };

        // Validation
        if (!this.validateForm(formData)) return;

        // Check availability
        if (!await this.checkDateAvailability(formData.date)) {
            this.showError('Date not available. Please choose another date.');
            return;
        }

        // Save to localStorage
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(formData);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Success
        this.showSuccess(formData);
        this.resetForm();
        this.playSound('successSound');
        this.showNotification('Booking confirmed! Check your email.');
    }

    validateForm(data) {
        if (!data.name || data.name.length < 2) {
            this.showError('Please enter your full name');
            return false;
        }
        if (!data.email.includes('@')) {
            this.showError('Please enter valid email');
            return false;
        }
        if (!data.date) {
            this.showError('Please select event date');
            return false;
        }
        return true;
    }

    async checkDateAvailability(date) {
        // Simulate availability check
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const selectedDate = new Date(date).toDateString();
        const sameDayBookings = bookings.filter(b => new Date(b.date).toDateString() === selectedDate);
        return sameDayBookings.length < 2; // Max 2 bookings per day
    }

    checkAvailability() {
        const status = document.getElementById('availabilityText');
        setTimeout(() => {
            status.textContent = '✅ Open for bookings - 15+ dates available';
            status.style.color = 'var(--success)';
        }, 1500);
    }

    showSuccess(data) {
        document.getElementById('successMsg').style.display = 'block';
        document.getElementById('successMsg').innerHTML = `
            <i class="fas fa-check-circle"></i>
            <strong>🎉 Booking Confirmed!</strong><br>
            <small>${data.service} - ${new Date(data.date).toLocaleDateString()}</small><br>
            Check your email for confirmation. We'll contact you within 24h!
        `;
        document.getElementById('errorMsg').style.display = 'none';
    }

    showError(message) {
        document.getElementById('errorMsg').style.display = 'block';
        document.getElementById('errorMsg').textContent = message;
        document.getElementById('successMsg').style.display = 'none';
    }

    resetForm() {
        document.getElementById('bookingForm').reset();
    }

    playSound(id) {
        const audio = document.getElementById(id);
        audio.currentTime = 0;
        audio.play().catch(() => { });
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = 'notification success show';
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
}

// Initialize
const bookingSystem = new BookingSystem();
window.bookingSystem = bookingSystem;
// ================= PREMIUM CONTACT SYSTEM =================
class ContactSystem {
    constructor() {
        this.init();
    }

    init() {
        // Form handling
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Copy to clipboard
        document.querySelectorAll('[data-copy]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.copyToClipboard(link.dataset.copy);
            });
        });

        // Sounds
        document.addEventListener('click', (e) => {
            if (e.target.closest('button, .cta, a')) {
                this.playSound('clickSound');
            }
        });

        // Navbar
        window.addEventListener('scroll', () => {
            document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
        });

        // Form validation
        this.addValidation();
    }

    async handleSubmit() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        if (!this.validateForm(formData)) return;

        // Simulate API call
        this.showLoading();

        // Save to localStorage (for demo)
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push({
            ...formData,
            timestamp: new Date().toISOString(),
            id: 'M' + Date.now()
        });
        localStorage.setItem('contactMessages', JSON.stringify(messages));

        setTimeout(() => {
            this.showSuccess(formData);
            this.resetForm();
            this.playSound('successSound');
            this.showNotification('Message sent! Response within 24h.');
        }, 1500);
    }

    validateForm(data) {
        if (data.name.length < 2) {
            this.showError('Name must be at least 2 characters');
            return false;
        }
        if (!data.email.includes('@') || !data.email.includes('.')) {
            this.showError('Please enter valid email');
            return false;
        }
        if (data.message.length < 10) {
            this.showError('Message must be at least 10 characters');
            return false;
        }
        return true;
    }

    showLoading() {
        const feedback = document.getElementById('formFeedback');
        feedback.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        feedback.className = 'form-feedback loading';
    }

    showSuccess(data) {
        document.getElementById('formFeedback').innerHTML = `
            <i class="fas fa-check-circle"></i>
            <strong>Message Sent Successfully!</strong><br>
            <small>Hi ${data.name}, we'll reply to ${data.email} within 24 hours!</small>
        `;
        document.getElementById('formFeedback').className = 'form-feedback success';
    }

    showError(message) {
        document.getElementById('formFeedback').innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        document.getElementById('formFeedback').className = 'form-feedback error';
    }

    resetForm() {
        document.getElementById('contactForm').reset();
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            const original = event.target.innerHTML;
            event.target.innerHTML = '✅ Copied!';
            event.target.style.color = 'var(--success)';
            setTimeout(() => {
                event.target.innerHTML = original;
                event.target.style.color = '';
            }, 2000);
            this.showNotification('Copied to clipboard!');
        });
    }

    addValidation() {
        const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    input.style.borderColor = 'var(--error)';
                } else {
                    input.style.borderColor = 'var(--primary-gold)';
                }
            });
        });
    }

    playSound(id) {
        const audio = document.getElementById(id);
        audio.currentTime = 0;
        audio.play().catch(() => { });
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = 'notification success';
        notification.style.display = 'flex';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 4000);
    }
}

// Initialize
const contactSystem = new ContactSystem();
// ================= SERVICE BOOKING SYSTEM =================
document.addEventListener('DOMContentLoaded', function () {
    // Navbar scroll
    window.addEventListener('scroll', () => {
        document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Fade animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    });
    document.querySelectorAll('.fade').forEach(el => observer.observe(el));

    // Booking form
    document.getElementById('bookingForm').addEventListener('submit', function (e) {
        e.preventDefault();
        submitServiceBooking(this);
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

function submitServiceBooking(form) {
    const formData = new FormData(form);
    const booking = {
        name: formData.get('name'),
        email: formData.get('email'),
        service: formData.get('service'),
        date: formData.get('date'),
        type: 'Event DJ Service',
        timestamp: new Date().toISOString()
    };

    // Save to localStorage
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Success feedback
    const feedback = document.getElementById('bookingFeedback');
    feedback.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <strong>✅ DJ Booked Successfully!</strong><br>
            <small>${booking.service} on ${new Date(booking.date).toLocaleDateString()}</small>
        </div>
    `;
    form.reset();

    // Scroll to feedback
    feedback.scrollIntoView({ behavior: 'smooth' });
}
// ================= ULTIMATE HOMEPAGE SCRIPT =================
document.addEventListener('DOMContentLoaded', function () {
    // Preloader
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => document.getElementById('loader').style.display = 'none', 500);
        }, 2500);
    });

    // Typing effect
    const texts = ['Where Beats Meet Technology', 'DJ • Developer • Creator', 'High-Energy Performances'];
    let textIndex = 0;
    let charIndex = 0;
    const typingElement = document.getElementById('typingText');

    function typeWriter() {
        if (charIndex < texts[textIndex].length) {
            typingElement.textContent += texts[textIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 80);
        } else {
            setTimeout(() => {
                charIndex = 0;
                typingElement.textContent = '';
                textIndex = (textIndex + 1) % texts.length;
                typeWriter();
            }, 2000);
        }
    }
    typeWriter();

    // Counter animation
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => animateCounter(counter));
                observer.unobserve(entry.target);
            }
        });
    });
    document.querySelector('.stats-section')?.addEventListener('mouseenter', () => {
        counters.forEach(counter => animateCounter(counter));
    });

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target + (target === 4.9 ? '⭐' : '');
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current) + (target === 4.9 ? '' : '+');
            }
        }, 30);
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Navbar scroll
    window.addEventListener('scroll', () => {
        document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Audio visualizer (enhanced)
    initVisualizer();
});

function initVisualizer() {
    const audio = document.getElementById('audioPlayer');
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
}
// Mixtape booking handler
document.addEventListener('DOMContentLoaded', function () {
    const mixtapeForm = document.getElementById('mixtapeForm');
    if (mixtapeForm) {
        mixtapeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                service: document.getElementById('service').value,
                length: document.getElementById('length').value,
                details: document.getElementById('details').value,
                type: 'Mixtape Production'
            };

            // Save booking
            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(formData);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            // Success
            const feedback = document.getElementById('bookingFeedback');
            feedback.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <strong>✅ Production Booked!</strong><br>
                    <small>${formData.service} (${formData.length})</small>
                </div>
            `;
            this.reset();
        });
    }
});
// Programming form handler
document.addEventListener('DOMContentLoaded', function () {
    const programmingForm = document.getElementById('programmingForm');
    if (programmingForm) {
        programmingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                service: document.getElementById('service').value,
                date: document.getElementById('date').value,
                details: document.getElementById('details').value,
                type: 'Programming Service'
            };

            // Save to bookings
            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(formData);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            // Success feedback
            const feedback = document.getElementById('formFeedback');
            feedback.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <strong>✅ Project Booked!</strong><br>
                    <small>${formData.service} - Response within 24h</small>
                </div>
            `;
            this.reset();
        });
    }
});
// Website form handler
document.addEventListener('DOMContentLoaded', function () {
    const websiteForm = document.getElementById('websiteForm');
    if (websiteForm) {
        websiteForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                service: document.getElementById('service').value,
                date: document.getElementById('date').value,
                details: document.getElementById('details').value,
                type: 'Website Design'
            };

            // Save booking
            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(formData);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            // Success
            const feedback = document.getElementById('formFeedback');
            feedback.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <strong>✅ Quote Requested!</strong><br>
                    <small>${formData.service} - Free consultation within 24h</small>
                </div>
            `;
            this.reset();
        });
    }
});