/**
 * Version switcher (V1 <-> V2). Shared by index.html (V2, default) and
 * v1.html; persists the choice without touching the "portfolio-lang" key.
 * @module version-toggle
 */

const TARGET_URL = { v1: 'v1.html', v2: 'index.html' };

/**
 * @returns {"v1"|"v2"} the version the current page represents, read
 * from body[data-version] (falls back to "v1" if missing).
 */
function getCurrentVersion() {
    const v = document.body.getAttribute('data-version');
    return v === 'v2' ? 'v2' : 'v1';
}

/**
 * @param {"v1"|"v2"} current
 * @returns {void}
 */
function reflectActiveState(current) {
    document.querySelectorAll('[data-version-btn]').forEach((btn) => {
        const isActive = btn.getAttribute('data-version-btn') === current;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
    });
}

/** @returns {void} */
function init() {
    const current = getCurrentVersion();
    reflectActiveState(current);

    document.querySelectorAll('[data-version-btn]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-version-btn');
            if (target !== 'v1' && target !== 'v2') return;
            if (target === current) return;

            try {
                localStorage.setItem('portfolio-version', target);
            } catch (e) {
                /* localStorage unavailable - navigate anyway, just won't persist */
            }
            window.location.href = TARGET_URL[target];
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
