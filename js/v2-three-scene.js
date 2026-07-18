/**
 * v2-three-scene.js — 3 lazily-imported Three.js scenes for V2's bento tiles
 * (hero shapes, Contact particle field, About orb+ring), loaded via `initLazy3D()`.
 * @module v2-three-scene
 */

import * as THREE from 'three';

const SHAPE_COLORS = [0x7c5cff, 0x38bdf8, 0xffb454, 0x38f593];

/**
 * Builds one low-poly wireframe mesh at a random position/scale.
 * @param {number} index
 * @returns {THREE.Mesh}
 */
function createShape(index) {
    const geometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.TetrahedronGeometry(1, 0),
        new THREE.TorusGeometry(0.62, 0.2, 6, 12),
        new THREE.DodecahedronGeometry(0.8, 0),
    ];
    const geometry = geometries[index % geometries.length];
    const material = new THREE.MeshBasicMaterial({
        color: SHAPE_COLORS[index % SHAPE_COLORS.length],
        wireframe: true,
        transparent: true,
        opacity: 0.75,
    });
    const mesh = new THREE.Mesh(geometry, material);

    const scale = 0.5 + Math.random() * 0.6;
    mesh.scale.setScalar(scale);
    mesh.position.set(
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2.5
    );
    mesh.userData.spin = {
        x: (Math.random() - 0.5) * 0.006,
        y: (Math.random() - 0.5) * 0.008,
    };
    return mesh;
}

/**
 * Creates and boots the hero tech-shapes scene inside `container`.
 * @param {HTMLElement} container - the tile wrapper the canvas is appended to.
 * @returns {Promise<{pause: () => void, resume: () => void, dispose: () => void}>}
 */
export async function createTechShapesScene(container) {
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 6;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
        // WebGL unavailable - let the caller catch this and keep the fallback.
        throw err;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    // High enough that all 5 geometry types get a chance to appear.
    const shapeCount = width < 500 ? 5 : 8;
    for (let i = 0; i < shapeCount; i++) group.add(createShape(i));
    scene.add(group);

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    // scrollFrac: 0 at page top, 1 at bottom - drives a subtle idle drift.
    let scrollFrac = 0;
    let paused = false;
    let rafId = null;
    let disposed = false;

    function onPointerMove(e) {
        const rect = container.getBoundingClientRect();
        pointer.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }

    function onScroll() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollFrac = max > 0 ? window.scrollY / max : 0;
    }

    function onResize() {
        const w = container.clientWidth || width;
        const h = container.clientHeight || height;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    let resizeObserver = null;
    if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(container);
    } else {
        window.addEventListener('resize', onResize);
    }

    function animate() {
        if (disposed) return;
        rafId = requestAnimationFrame(animate);
        if (paused) return;

        pointer.x += (pointer.targetX - pointer.x) * 0.04;
        pointer.y += (pointer.targetY - pointer.y) * 0.04;
        group.rotation.y = pointer.x * 0.35;
        group.rotation.x = pointer.y * 0.25;
        // Sine curve eases back toward 0 at both ends of the page.
        group.position.y = Math.sin(scrollFrac * Math.PI) * 0.18;

        group.children.forEach((mesh) => {
            mesh.rotation.x += mesh.userData.spin.x;
            mesh.rotation.y += mesh.userData.spin.y;
        });

        renderer.render(scene, camera);
    }

    animate();

    return {
        pause() { paused = true; },
        resume() { paused = false; },
        dispose() {
            if (disposed) return;
            disposed = true;
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', onPointerMove);
            window.removeEventListener('scroll', onScroll);
            if (resizeObserver) resizeObserver.disconnect();
            else window.removeEventListener('resize', onResize);

            group.children.forEach((mesh) => {
                mesh.geometry.dispose();
                mesh.material.dispose();
            });
            scene.clear();
            renderer.dispose();
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        },
    };
}

/**
 * Ambient particle-field backdrop behind the Contact lead tile - no pointer
 * tracking, low-opacity passive drift so it doesn't compete with the CTA.
 * @param {HTMLElement} container
 * @returns {Promise<{pause: () => void, resume: () => void, dispose: () => void}>}
 */
export async function createParticleFieldScene(container) {
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.z = 5;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
        throw err;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    // Higher cap than the hero scene since this tile spans the full 12 columns.
    const count = width < 700 ? 60 : 110;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 9;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
        color: 0x8b7bff,
        size: 0.045,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let paused = false;
    let rafId = null;
    let disposed = false;

    function onResize() {
        const w = container.clientWidth || width;
        const h = container.clientHeight || height;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    let resizeObserver = null;
    if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(container);
    } else {
        window.addEventListener('resize', onResize);
    }

    function animate() {
        if (disposed) return;
        rafId = requestAnimationFrame(animate);
        if (paused) return;

        points.rotation.y += 0.0009;
        points.rotation.x += 0.0003;

        renderer.render(scene, camera);
    }

    animate();

    return {
        pause() { paused = true; },
        resume() { paused = false; },
        dispose() {
            if (disposed) return;
            disposed = true;
            if (rafId) cancelAnimationFrame(rafId);
            if (resizeObserver) resizeObserver.disconnect();
            else window.removeEventListener('resize', onResize);

            geometry.dispose();
            material.dispose();
            scene.clear();
            renderer.dispose();
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        },
    };
}

/**
 * Small ambient orb+ring accent behind the About avatar tile - white/near-white
 * (not violet/cyan) so it reads as engraved on the tile's own gradient fill.
 * @param {HTMLElement} container
 * @returns {Promise<{pause: () => void, resume: () => void, dispose: () => void}>}
 */
export async function createOrbAccentScene(container) {
    const width = container.clientWidth || 200;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
        throw err;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();

    const orbGeometry = new THREE.IcosahedronGeometry(1.3, 1);
    const orbMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    group.add(orb);

    const ringGeometry = new THREE.TorusGeometry(2, 0.02, 8, 48);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.4;
    group.add(ring);

    scene.add(group);

    let paused = false;
    let rafId = null;
    let disposed = false;

    function onResize() {
        const w = container.clientWidth || width;
        const h = container.clientHeight || height;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    let resizeObserver = null;
    if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(container);
    } else {
        window.addEventListener('resize', onResize);
    }

    function animate() {
        if (disposed) return;
        rafId = requestAnimationFrame(animate);
        if (paused) return;

        orb.rotation.y += 0.003;
        orb.rotation.x += 0.0012;
        ring.rotation.z += 0.0022;

        renderer.render(scene, camera);
    }

    animate();

    return {
        pause() { paused = true; },
        resume() { paused = false; },
        dispose() {
            if (disposed) return;
            disposed = true;
            if (rafId) cancelAnimationFrame(rafId);
            if (resizeObserver) resizeObserver.disconnect();
            else window.removeEventListener('resize', onResize);

            orbGeometry.dispose();
            orbMaterial.dispose();
            ringGeometry.dispose();
            ringMaterial.dispose();
            scene.clear();
            renderer.dispose();
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        },
    };
}
