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
    // 2. HEADER "SCROLLED" STATE (IntersectionObserver, no scroll listener)
    // ----------------------------------------------------
    const header = document.querySelector('.header');
    const scrollSentinel = document.getElementById('scroll-sentinel');

    if (header && scrollSentinel) {
        // Sentinel is a 40px-tall marker pinned to the very top of the document;
        // once it scrolls out of view, the page has scrolled past the threshold.
        const headerObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        });
        headerObserver.observe(scrollSentinel);
    }

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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentPhrases = phrasesEn;
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let typingTimeout;

    function typeEffect() {
        if (!typingSpan) return;

        // Reduced motion: show the first phrase statically, no looping.
        if (prefersReducedMotion) {
            typingSpan.textContent = currentPhrases[0];
            return;
        }

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
    // 5. ACTIVE LINK HIGHLIGHTING (IntersectionObserver scrollspy, no scroll listener)
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const sectionInView = new Map();

    function updateActiveNav() {
        let currentId = '';
        sections.forEach(section => {
            if (sectionInView.get(section.id)) currentId = section.id;
        });

        if (currentId === 'home' || !currentId) currentId = 'about';

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    }

    const navSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => sectionInView.set(entry.target.id, entry.isIntersecting));
        updateActiveNav();
    }, { rootMargin: '-30% 0px -65% 0px' });

    sections.forEach(section => navSpyObserver.observe(section));
    updateActiveNav();

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
    // 7. TIMELINE SLIDE-IN ANIMATION
    // ----------------------------------------------------
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    item.classList.add('slide-in');
                    const content = item.querySelector('.timeline-content');
                    if (content) {
                        content.addEventListener('animationend', () => {
                            item.classList.remove('slide-in');
                            item.classList.add('revealed');
                        }, { once: true });
                    }
                    timelineObserver.unobserve(item);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
        timelineItems.forEach(item => timelineObserver.observe(item));
    }

    // ----------------------------------------------------
    // 9. SKILL CARDS STAGGERED REVEAL
    // ----------------------------------------------------
    const skillsSection = document.getElementById('skills');
    const allSkillCards = document.querySelectorAll('.skill-card');
    let skillsRevealed = false;

    if (skillsSection && allSkillCards.length > 0) {
        const skillsRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !skillsRevealed) {
                    skillsRevealed = true;
                    const visibleCards = [...allSkillCards].filter(c =>
                        window.getComputedStyle(c).display !== 'none'
                    );
                    visibleCards.forEach((card, idx) => {
                        card.style.animation = `cardReveal 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 65}ms both`;
                        card.addEventListener('animationend', () => {
                            card.style.animation = '';
                            card.classList.add('card-revealed');
                        }, { once: true });
                    });
                    skillsRevealObserver.unobserve(skillsSection);
                }
            });
        }, { threshold: 0.05 });
        skillsRevealObserver.observe(skillsSection);
    }

    // ----------------------------------------------------
    // 10. STATS POP-IN ANIMATION
    // ----------------------------------------------------
    const profileStats = document.querySelector('.profile-stats');
    if (profileStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat-number').forEach((num, idx) => {
                        num.style.animation = `statPopIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 160}ms both`;
                        num.addEventListener('animationend', () => {
                            num.style.animation = '';
                            num.classList.add('stat-revealed');
                        }, { once: true });
                    });
                    statsObserver.unobserve(profileStats);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(profileStats);
    }

    // ----------------------------------------------------
    // 11. 3D TILT EFFECT ON CARDS
    // ----------------------------------------------------
    document.querySelectorAll('.skill-card, .project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * 8;
            const tiltY = (0.5 - x) * 8;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => { card.style.transition = ''; }, 500);
        });
    });

    // ----------------------------------------------------
    // 12. HERO EFFECTS
    // ----------------------------------------------------
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    // Hero spotlight + parallax on mousemove
    const heroSectionEl  = document.querySelector('.hero-section');
    const heroSpotlight  = document.querySelector('.hero-spotlight');
    const heroParallaxLayers = heroSectionEl ? [
        { el: heroSectionEl.querySelector('.hero-badge'),    d: 16 },
        { el: heroSectionEl.querySelector('.hero-title'),    d: 26 },
        { el: heroSectionEl.querySelector('.hero-subtitle'), d: 18 },
        { el: heroSectionEl.querySelector('.hero-desc'),     d: 10 },
        { el: heroSectionEl.querySelector('.hero-actions'),  d: 7  },
    ].filter(l => l.el) : [];

    if (heroSectionEl && isFinePointer) {
        heroSectionEl.addEventListener('mousemove', e => {
            const rect = heroSectionEl.getBoundingClientRect();

            // Move spotlight origin to cursor
            if (heroSpotlight) {
                const px = ((e.clientX - rect.left) / rect.width  * 100).toFixed(2);
                const py = ((e.clientY - rect.top)  / rect.height * 100).toFixed(2);
                heroSpotlight.style.setProperty('--mx', px + '%');
                heroSpotlight.style.setProperty('--my', py + '%');
            }

            // Subtle parallax: each layer moves proportional to depth
            const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2); // -1 to 1
            const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
            heroParallaxLayers.forEach(({ el, d }) => {
                el.style.transform  = `translate(${dx * d * 0.5}px, ${dy * d * 0.35}px)`;
                el.style.transition = 'transform 0.08s linear';
            });
        }, { passive: true });

        heroSectionEl.addEventListener('mouseleave', () => {
            heroParallaxLayers.forEach(({ el }) => {
                el.style.transform  = '';
                el.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => { el.style.transition = ''; }, 900);
            });
        });
    }

    // Magnetic pull on hero CTA buttons
    document.querySelectorAll('.hero-actions .btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r  = btn.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
            const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
            btn.style.transform  = `translate(${dx}px, ${dy}px) scale(1.06)`;
            btn.style.transition = 'transform 0.12s ease-out';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform  = '';
            btn.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => { btn.style.transition = ''; }, 550);
        });
    });
});
