/**
 * Portfolio General Interactions & Animations
 * Trần Hùng - Full-Stack Developer
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. MOBILE MENU TOGGLE
    // ----------------------------------------------------
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileNavToggle && navLinksContainer) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close menu on click of any nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // ----------------------------------------------------
    // 2. HEADER SHADOW ON SCROLL
    // ----------------------------------------------------
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.style.padding = '0.75rem 0';
            header.style.background = 'rgba(4, 5, 10, 0.85)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
        } else {
            header.style.padding = '1.25rem 0';
            header.style.background = 'rgba(7, 9, 19, 0.65)';
            header.style.boxShadow = 'none';
        }
    });

    // ----------------------------------------------------
    // 3. BILINGUAL SUPPORT & TYPING ENGINE INTEGRATION
    // ----------------------------------------------------
    const typingSpan = document.querySelector('.typing-text');
    const phrasesEn = [
        "Full-Stack Web Developer.",
        "Backend Architecture Expert.",
        "Database & CI/CD Specialist."
    ];
    const phrasesVi = [
        "Lập trình viên Full-Stack.",
        "Chuyên gia Kiến trúc Backend.",
        "Tối ưu Cơ sở Dữ liệu & CI/CD."
    ];

    let currentPhrases = phrasesEn;
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let typingTimeout;

    function typeEffect() {
        if (!typingSpan) return;

        const currentPhrase = currentPhrases[phraseIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster
        } else {
            typingSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Handle boundaries
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of sentence
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % currentPhrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        typingTimeout = setTimeout(typeEffect, typingSpeed);
    }

    // Language Change Controller
    function setLanguage(lang) {
        document.body.className = `lang-${lang}`;
        localStorage.setItem('portfolio-lang', lang);

        // Update active typing phrases list
        currentPhrases = lang === 'vi' ? phrasesVi : phrasesEn;

        // Reset Typing Engine securely
        clearTimeout(typingTimeout);
        phraseIndex = 0;
        charIndex = 0;
        isDeleting = false;
        if (typingSpan) typingSpan.textContent = '';
        typeEffect();

        // Update active state visual style on language switcher buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Initialize Switcher Event Listeners
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            setLanguage(selectedLang);
        });
    });

    // Check LocalStorage on boot
    const savedLanguage = localStorage.getItem('portfolio-lang') || 'en';
    setLanguage(savedLanguage);

    // ----------------------------------------------------
    // 4. INTERSECTION OBSERVER (Reveal Elements on Scroll)
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ----------------------------------------------------
    // 5. ACTIVE LINK HIGHLIGHTING
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section');
    const scrollObserverOptions = {
        threshold: 0.35,
        rootMargin: '-10% 0px -40% 0px'
    };

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, scrollObserverOptions);

    sections.forEach(section => activeLinkObserver.observe(section));

    // ----------------------------------------------------
    // 6. TECH STACK INTERACTIVE FILTERING
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const targetCategory = button.getAttribute('data-filter');

            skillCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (targetCategory === 'all' || cardCategory === targetCategory) {
                    // Show matching card with beautiful fade state
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide non-matching card
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ----------------------------------------------------
    // 7. SECURE CONTACT FORM HANDLING & VAL
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const message = document.getElementById('form-message').value.trim();
            const submitBtn = contactForm.querySelector('.submit-btn');

            // Detect Current Translation Active State
            const currentLang = document.body.classList.contains('lang-vi') ? 'vi' : 'en';

            if (!name || !email || !message) {
                const errorMsg = currentLang === 'vi' 
                    ? 'Vui lòng điền đầy đủ các thông tin.' 
                    : 'Please complete all form fields.';
                showFormStatus(errorMsg, 'error');
                return;
            }

            // Simulate sending message with visual loading status
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            const sendingMsg = currentLang === 'vi' ? 'Đang gửi...' : 'Sending Message...';
            submitBtn.innerHTML = `<span>${sendingMsg}</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

            setTimeout(() => {
                const successMsg = currentLang === 'vi'
                    ? 'Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công đến Trần Hùng.'
                    : 'Thank you! Your message has been sent successfully to Trần Hùng.';
                
                showFormStatus(successMsg, 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                
                const btnLabel = currentLang === 'vi' ? 'Gửi tin nhắn' : 'Send Message';
                submitBtn.innerHTML = `<span>${btnLabel}</span> <i class="fa-solid fa-paper-plane"></i>`;
            }, 1500);
        });
    }

    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';

        // Auto fade out status after 6 seconds if successful
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.opacity = '0';
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.style.opacity = '1';
                }, 400);
            }, 6000);
        }
    }
});
