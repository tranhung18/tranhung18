/**
 * v2.js — Entry point for the V2 "Bento Console" layout. Renders every
 * section from data.js and wires up all interactions. ES module, no globals.
 * @module v2
 */

import {
    typingPhrases,
    nav,
    hero,
    about,
    skillFilters,
    skills,
    projects,
    experience,
    contact,
    footer as footerText,
} from './data.js';

const LANG_STORAGE_KEY = 'portfolio-lang';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Build a bilingual inline-span pair, matching V1's `.en` / `.vi` pattern so
 * the same CSS rule (`body.lang-en .vi{display:none}`) toggles both layouts.
 * @param {{en:string, vi:string}} pair
 * @returns {string} HTML string
 */
function bi(pair) {
    return `<span class="en">${pair.en}</span><span class="vi">${pair.vi}</span>`;
}

/**
 * Escape-free HTML join helper for arrays rendered as repeated markup.
 * @param {Array<*>} items
 * @param {(item: *, index: number) => string} mapper
 * @returns {string}
 */
function renderList(items, mapper) {
    return items.map(mapper).join('');
}

/* ==========================================================================
   NAV
   ========================================================================== */

/**
 * Renders the dock nav links from data.nav into both the desktop dock nav
 * and the separate mobile overlay nav (see #mobile-nav-overlay in index.html
 * for why these are two elements instead of one repositioned via CSS).
 * @returns {void}
 */
function renderNav() {
    const links = renderList(nav, (item) => `
        <a href="${item.href}" class="dock-link">${bi(item.label)}</a>
    `);
    const dockNav = document.getElementById('dock-nav');
    const mobileNav = document.getElementById('mobile-nav-overlay');
    if (dockNav) dockNav.innerHTML = links;
    if (mobileNav) mobileNav.innerHTML = links;
}

/* ==========================================================================
   HERO — bento grid
   ========================================================================== */

/** Renders the hero bento grid tiles from data. @returns {void} */
function renderHero() {
    const el = document.getElementById('hero-bento');
    if (!el) return;

    // Hero row (intro + 3D tile) is the whole grid - stats/project/contact
    // tiles were removed since they duplicated the sections below.
    el.innerHTML = `
        <div class="bento-tile hero-tile-intro c-8 r-2 reveal-up">
            <span class="hero-badge-v2"><span class="pulse-dot-v2"></span>${bi({
                en: 'Available for Full-Stack Opportunities',
                vi: 'Sẵn sàng cho cơ hội Full-Stack',
            })}</span>
            <h1 class="hero-title-v2">${bi(hero.greeting)} <span class="gradient-text">Trần Hữu Hùng</span></h1>
            <p class="hero-role-v2">${bi(hero.subtitlePrefix)} <span class="typing-text-v2"></span><span class="cursor-v2" aria-hidden="true">|</span></p>
            <div class="hero-cta-row">
                <a href="${hero.ctaPrimary.href}" class="btn-v2 btn-v2-primary">${bi({ en: hero.ctaPrimary.en, vi: hero.ctaPrimary.vi })}</a>
                <a href="${hero.ctaSecondary.href}" class="btn-v2 btn-v2-ghost">${bi({ en: hero.ctaSecondary.en, vi: hero.ctaSecondary.vi })}</a>
            </div>
        </div>

        <div class="bento-tile hero-tile-3d c-4 r-2 reveal-up" id="hero-3d-tile">
            <div class="hero-3d-canvas-wrap" id="hero-3d-canvas-wrap">
                <div class="hero-3d-fallback" id="hero-3d-fallback"></div>
            </div>
        </div>
    `;
    el.setAttribute('aria-busy', 'false');

    initTyping(document.querySelector('.typing-text-v2'));
    initHero3D();
}

/* ==========================================================================
   TYPING ENGINE (self-contained copy for V2, phrases sourced from data.js)
   ========================================================================== */

let typingState = null;

/**
 * Starts (or restarts) the hero typing animation into the given element.
 * @param {HTMLElement|null} targetEl
 * @returns {void}
 */
function initTyping(targetEl) {
    if (!targetEl) return;
    if (typingState && typingState.timeout) clearTimeout(typingState.timeout);

    typingState = {
        el: targetEl,
        phrases: document.body.classList.contains('lang-vi') ? typingPhrases.vi : typingPhrases.en,
        phraseIndex: 0,
        charIndex: 0,
        isDeleting: false,
        timeout: null,
    };

    if (prefersReducedMotion) {
        targetEl.textContent = typingState.phrases[0];
        return;
    }

    tick();

    function tick() {
        const s = typingState;
        if (!s || s.el !== targetEl) return; // superseded by a newer call
        const phrase = s.phrases[s.phraseIndex];
        let speed = 100;

        if (s.isDeleting) {
            s.el.textContent = phrase.substring(0, s.charIndex - 1);
            s.charIndex--;
            speed = 50;
        } else {
            s.el.textContent = phrase.substring(0, s.charIndex + 1);
            s.charIndex++;
            speed = 100;
        }

        if (!s.isDeleting && s.charIndex === phrase.length) {
            s.isDeleting = true;
            speed = 2000;
        } else if (s.isDeleting && s.charIndex === 0) {
            s.isDeleting = false;
            s.phraseIndex = (s.phraseIndex + 1) % s.phrases.length;
            speed = 500;
        }

        s.timeout = setTimeout(tick, speed);
    }
}

/* ==========================================================================
   ABOUT
   ========================================================================== */

/** Renders the About bento grid. @returns {void} */
function renderAbout() {
    const el = document.getElementById('about-bento');
    if (!el) return;

    el.innerHTML = `
        <div class="bento-tile about-tile-avatar c-4 r-2 reveal-up" id="about-3d-tile">
            <div class="tile-3d-backdrop" id="about-3d-canvas-wrap">
                <div class="tile-3d-backdrop-fallback" aria-hidden="true"></div>
            </div>
        </div>
        <div class="bento-tile about-tile-text c-8 reveal-up">
            <h3>${bi(about.heading)}</h3>
            ${renderList(about.paragraphs, (p) => `<p>${bi(p)}</p>`)}
        </div>
        <div class="bento-tile c-8 reveal-up">
            <span class="tile-label">${bi({ en: 'strengths', vi: 'thế mạnh' })}</span>
            <div class="strength-grid">
                ${renderList(about.strengths, (s) => `<span class="strength-chip"><i class="ph-light ${s.icon}"></i>${bi({ en: s.en, vi: s.vi })}</span>`)}
            </div>
        </div>
    `;
    el.setAttribute('aria-busy', 'false');
    initAbout3D();
}

/* ==========================================================================
   SKILLS
   ========================================================================== */

// Brand glow color per skill tile (see .skill-tile in v2.css), derived from
// data.js instead of V1's hardcoded root-variable table. Fallback for the
// two phosphor-icon skills that have no iconColor.
const NAMED_COLOR_RGB = {
    cicd: '32, 136, 255',
    postman: '255, 108, 55',
};

/**
 * Converts a `RRGGBB` hex string (no `#`) to a `"r, g, b"` string suitable
 * for `rgba(var(--brand-rgb), alpha)`.
 * @param {string} hex
 * @returns {string}
 */
function hexToRgb(hex) {
    const n = parseInt(hex, 16);
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/**
 * Resolves the brand-glow RGB for a skill: own iconColor, then named fallback, then violet.
 * @param {{iconColor?: string, color?: string}} skill
 * @returns {string}
 */
function skillBrandRgb(skill) {
    if (skill.iconColor) return hexToRgb(skill.iconColor);
    if (skill.color && NAMED_COLOR_RGB[skill.color]) return NAMED_COLOR_RGB[skill.color];
    return '124, 92, 255';
}

/** Renders skill filter buttons and skill tiles. @returns {void} */
function renderSkills() {
    const filterBar = document.getElementById('skill-filter-bar');
    const grid = document.getElementById('skills-bento');
    if (!filterBar || !grid) return;

    filterBar.innerHTML = renderList(skillFilters, (f, idx) => `
        <button class="skill-filter-btn${idx === 0 ? ' active' : ''}" data-filter="${f.key}" aria-pressed="${idx === 0}">${bi(f.label)}</button>
    `);

    grid.innerHTML = renderList(skills, (s) => `
        <div class="bento-tile skill-tile c-3 reveal-up" data-category="${s.category}" style="--brand-rgb: ${skillBrandRgb(s)};">
            <div class="skill-tile-icon">${
                s.phosphorIcon
                    ? `<i class="ph-light ${s.phosphorIcon}"></i>`
                    : `<img src="https://cdn.simpleicons.org/${s.iconSlug}/${s.iconColor}" alt="${s.name}" loading="lazy" width="26" height="26">`
            }</div>
            <h4>${s.name}</h4>
            <p>${bi(s.desc)}</p>
        </div>
    `);
    grid.setAttribute('aria-busy', 'false');

    filterBar.querySelectorAll('.skill-filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBar.querySelectorAll('.skill-filter-btn').forEach((b) => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            const filter = btn.getAttribute('data-filter');
            grid.querySelectorAll('.skill-tile').forEach((tile) => {
                const matches = filter === 'all' || tile.getAttribute('data-category') === filter;
                tile.classList.toggle('is-hidden', !matches);
            });
        });
    });
}

/* ==========================================================================
   PROJECTS
   ========================================================================== */

/** Renders project bento tiles (featured project gets a wider tile). @returns {void} */
function renderProjects() {
    const el = document.getElementById('projects-bento');
    if (!el) return;

    el.innerHTML = renderList(projects, (p) => `
        <div class="bento-tile project-tile ${p.featured ? 'project-tile--featured c-8' : 'c-4'} reveal-up">
            <div class="project-tile-head">
                <span class="project-tag-v2">${bi(p.tag)}</span>
                <div class="project-tile-icons">
                    ${renderList(p.techIcons, (t) => `<img src="https://cdn.simpleicons.org/${t.slug}/${t.color}" alt="${t.name}" title="${t.name}" loading="lazy" width="18" height="18">`)}
                </div>
            </div>
            <h3>${p.name}</h3>
            <p class="project-subtitle-v2">${bi(p.subtitle)}</p>
            <p class="project-desc-v2">${bi(p.desc)}</p>
            <ul class="project-highlights-v2">
                ${renderList(p.highlights, (h) => `<li><i class="ph-light ph-check-circle"></i>${bi(h)}</li>`)}
            </ul>
            <div class="project-tags-v2">
                ${renderList(p.techTags, (t) => `<span class="project-tag-chip">${t}</span>`)}
            </div>
        </div>
    `);
    el.setAttribute('aria-busy', 'false');
}

/* ==========================================================================
   EXPERIENCE — vertical stack (structurally different from V1's timeline)
   ========================================================================== */

/** Renders the experience/education stack. @returns {void} */
function renderExperience() {
    const el = document.getElementById('exp-stack');
    if (!el) return;

    el.innerHTML = renderList(experience, (item) => {
        const company = typeof item.company === 'string' ? item.company : bi(item.company);
        return `
        <li class="exp-card reveal-up">
            <div>
                <span class="exp-card-date">${bi(item.date)}</span>
            </div>
            <div>
                <h3 class="exp-card-role">${bi(item.role)}</h3>
                <p class="exp-card-company">${company}</p>
                <ul class="exp-card-details">
                    ${renderList(item.details.en, (d, i) => `<li><span class="en">${d}</span><span class="vi">${item.details.vi[i]}</span></li>`)}
                </ul>
            </div>
        </li>
    `;
    });
    el.setAttribute('aria-busy', 'false');
}

/* ==========================================================================
   CONTACT
   ========================================================================== */

/** Renders the contact bento grid. @returns {void} */
function renderContact() {
    const el = document.getElementById('contact-bento');
    if (!el) return;

    el.innerHTML = `
        <div class="bento-tile contact-tile-lead bento-tile--accent c-12 reveal-up" id="contact-3d-tile">
            <div class="tile-3d-backdrop" id="contact-3d-canvas-wrap">
                <div class="tile-3d-backdrop-fallback" aria-hidden="true"></div>
            </div>
            <div class="contact-lead-content">
                <h3>${bi(contact.connectHeading)}</h3>
                <p>${bi(contact.blurb)}</p>
            </div>
        </div>
        ${renderList(contact.items, (item) => `
            <div class="bento-tile contact-item-tile c-3 reveal-up">
                <a href="${item.href}" ${item.external ? 'target="_blank" rel="noopener"' : ''}>
                    <i class="ph-light ${item.icon} info-icon-v2"></i>
                    <span>
                        <span class="info-label-v2">${bi(item.label)}</span>
                        <span>${item.value}</span>
                    </span>
                </a>
            </div>
        `)}
    `;
    el.setAttribute('aria-busy', 'false');
    initContact3D();
}

/** Renders the footer line. @returns {void} */
function renderFooter() {
    const el = document.getElementById('v2-footer');
    if (!el) return;
    el.innerHTML = `<p>${bi(footerText)}</p>`;
}

/* ==========================================================================
   LANGUAGE SWITCH (mirrors V1's behaviour/localStorage key, additive markup)
   ========================================================================== */

/**
 * Applies a language, persists it, and refreshes the typing engine.
 * @param {'en'|'vi'} lang
 * @returns {void}
 */
function setLanguage(lang) {
    document.body.classList.remove('lang-en', 'lang-vi');
    document.body.classList.add(`lang-${lang}`);
    try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) { /* ignore */ }

    document.querySelectorAll('.lang-btn').forEach((btn) => {
        const isActive = btn.getAttribute('data-lang') === lang;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
    });

    const typingEl = document.querySelector('.typing-text-v2');
    if (typingEl) initTyping(typingEl);
}

/** Wires up the EN/VI buttons and applies the saved/default language. @returns {void} */
function initLangSwitch() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
    });
    let saved = 'en';
    try {
        saved = localStorage.getItem(LANG_STORAGE_KEY) || 'en';
    } catch (e) { /* ignore */ }
    setLanguage(saved);
}

/* ==========================================================================
   MOBILE DOCK MENU
   ========================================================================== */

/**
 * Wires up the mobile hamburger toggle. No focus trap; marks page content
 * `inert` while open so Tab can't walk into links behind the overlay.
 * @returns {void}
 */
function initMobileMenu() {
    const toggle = document.getElementById('dock-menu-toggle');
    const overlay = document.getElementById('mobile-nav-overlay');
    const mainContent = document.getElementById('main-content');
    const footer = document.getElementById('v2-footer');
    if (!toggle || !overlay) return;

    function setOpen(isOpen) {
        overlay.classList.toggle('open', isOpen);
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('nav-open', isOpen);
        [mainContent, footer].forEach((el) => {
            if (!el) return;
            if (isOpen) el.setAttribute('inert', ''); else el.removeAttribute('inert');
        });
    }

    toggle.addEventListener('click', () => setOpen(!overlay.classList.contains('open')));

    overlay.querySelectorAll('.dock-link').forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) setOpen(false);
    });
}

/* ==========================================================================
   SCROLLSPY (active dock link) + SCROLL REVEAL
   ========================================================================== */

/** Highlights the current section's dock link via IntersectionObserver. @returns {void} */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.dock-link');
    if (!sections.length || !links.length) return;

    const inView = new Map();
    const update = () => {
        let currentId = '';
        sections.forEach((s) => { if (inView.get(s.id)) currentId = s.id; });
        links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => inView.set(entry.target.id, entry.isIntersecting));
        update();
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach((s) => observer.observe(s));
}

/** Reveals `.reveal-up`/`.reveal-scale` elements once they enter the viewport. @returns {void} */
function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal-up, .reveal-scale');
    if (!targets.length) return;

    if (prefersReducedMotion) {
        targets.forEach((t) => t.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((t) => observer.observe(t));
}

/* ==========================================================================
   3D — lazy Three.js boot, shared by every bento tile that hosts a scene.
   ========================================================================== */

/**
 * Generic lazy-loader for a tile-scoped Three.js scene: skipped on
 * reduced-motion, imported near-viewport, paused/resumed on visibility, disposed on pagehide.
 * @param {string} tileId
 * @param {string} canvasWrapId
 * @param {(wrap: HTMLElement) => Promise<{pause:()=>void, resume:()=>void, dispose:()=>void}>} createScene
 * @returns {void}
 */
function initLazy3D(tileId, canvasWrapId, createScene) {
    const tile = document.getElementById(tileId);
    const canvasWrap = document.getElementById(canvasWrapId);
    if (!tile || !canvasWrap) return;

    if (prefersReducedMotion) {
        return; // static CSS fallback (already in the markup) stays forever
    }

    let controller = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(async (entry) => {
            if (entry.isIntersecting && !controller) {
                try {
                    controller = await createScene(canvasWrap);
                } catch (err) {
                    // Network/WebGL failure - keep the static fallback, no console spam beyond one line.
                    console.warn(`[v2] 3D scene unavailable for #${tileId}, keeping static fallback.`, err);
                }
            } else if (controller) {
                entry.isIntersecting ? controller.resume() : controller.pause();
            }
        });
    }, { threshold: 0.1 });

    observer.observe(tile);

    document.addEventListener('visibilitychange', () => {
        if (!controller) return;
        document.hidden ? controller.pause() : controller.resume();
    });

    window.addEventListener('pagehide', () => {
        if (controller) controller.dispose();
    });
}

/** Boots the hero's tech-shapes scene. @returns {void} */
function initHero3D() {
    initLazy3D('hero-3d-tile', 'hero-3d-canvas-wrap', async (wrap) => {
        const { createTechShapesScene } = await import('./v2-three-scene.js');
        return createTechShapesScene(wrap);
    });
}

/** Boots the Contact section's ambient particle-field backdrop. @returns {void} */
function initContact3D() {
    initLazy3D('contact-3d-tile', 'contact-3d-canvas-wrap', async (wrap) => {
        const { createParticleFieldScene } = await import('./v2-three-scene.js');
        return createParticleFieldScene(wrap);
    });
}

/** Boots the About avatar tile's small orb+ring accent. @returns {void} */
function initAbout3D() {
    initLazy3D('about-3d-tile', 'about-3d-canvas-wrap', async (wrap) => {
        const { createOrbAccentScene } = await import('./v2-three-scene.js');
        return createOrbAccentScene(wrap);
    });
}

/* ==========================================================================
   SNAKE BACKGROUND — full-page ambient wireframe (see js/v2-snake-bg.js)
   ========================================================================== */

/**
 * Boots the full-page tech-snake background: deferred past `load` (idle
 * callback) so it never competes with first paint; skipped on reduced-motion.
 * @returns {void}
 */
function initSnakeBackground() {
    const wrap = document.getElementById('snake-bg-wrap');
    if (!wrap) return;

    if (prefersReducedMotion) return;

    let controller = null;

    async function boot() {
        try {
            const { createSnakeBackground } = await import('./v2-snake-bg.js');
            controller = await createSnakeBackground(wrap);
        } catch (err) {
            console.warn('[v2] snake background unavailable.', err);
        }
    }

    function scheduleBoot() {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(boot, { timeout: 2000 });
        } else {
            setTimeout(boot, 300);
        }
    }

    if (document.readyState === 'complete') {
        scheduleBoot();
    } else {
        window.addEventListener('load', scheduleBoot, { once: true });
    }

    document.addEventListener('visibilitychange', () => {
        if (!controller) return;
        document.hidden ? controller.pause() : controller.resume();
    });

    window.addEventListener('pagehide', () => {
        if (controller) controller.dispose();
    });
}

/* ==========================================================================
   TILT / PARALLAX — subtle pointer-driven 3D tilt for bento tiles
   ========================================================================== */

/**
 * Adds pointer-tracked tilt to bento tiles via CSS custom properties (pure
 * CSS transform, no canvas). Skipped on reduced-motion/no fine pointer;
 * `.hero-tile-3d` excluded since it has its own WebGL parallax.
 * @returns {void}
 */
function initTiltTiles() {
    if (prefersReducedMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const MAX_DEG = 6;
    const tiles = document.querySelectorAll('.bento-tile:not(.hero-tile-3d)');

    tiles.forEach((tile) => {
        tile.addEventListener('pointermove', (e) => {
            const rect = tile.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            tile.style.setProperty('--tilt-y', `${(px * MAX_DEG).toFixed(2)}deg`);
            tile.style.setProperty('--tilt-x', `${(-py * MAX_DEG).toFixed(2)}deg`);
            tile.style.setProperty('--tilt-lift', '-4px');
        });
        tile.addEventListener('pointerleave', () => {
            tile.style.setProperty('--tilt-x', '0deg');
            tile.style.setProperty('--tilt-y', '0deg');
            tile.style.setProperty('--tilt-lift', '0px');
        });
    });
}

/* ==========================================================================
   SPOTLIGHT BUTTONS — cursor-follow glow (see .btn-v2::before in v2.css)
   ========================================================================== */

/**
 * Sets `--spot-x`/`--spot-y` on every `.btn-v2` on pointermove, consumed by
 * the `::before` spotlight in v2.css. Same guard rails as `initTiltTiles()`.
 * @returns {void}
 */
function initSpotlightButtons() {
    if (prefersReducedMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.querySelectorAll('.btn-v2').forEach((btn) => {
        btn.addEventListener('pointermove', (e) => {
            const rect = btn.getBoundingClientRect();
            btn.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
            btn.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
        });
    });
}

/* ==========================================================================
   BOOT
   ========================================================================== */

/** Renders all sections and wires up all interactions. Entry point. @returns {void} */
function boot() {
    renderNav();
    renderHero();
    renderAbout();
    renderSkills();
    renderProjects();
    renderExperience();
    renderContact();
    renderFooter();

    initLangSwitch();
    initMobileMenu();
    initScrollSpy();
    initScrollReveal();
    initTiltTiles();
    initSpotlightButtons();
    initSnakeBackground();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
