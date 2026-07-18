/**
 * v2-snake-bg.js — full-viewport ambient wireframe tube that wanders the
 * page background.
 * @module v2-snake-bg
 */

import * as THREE from 'three';

const TRAIL_LENGTH = 40;
const TUBE_RADIUS = 15; // thinner reads as a near-invisible hairline
const TUBULAR_SEGMENTS = 64;
const RADIAL_SEGMENTS = 8;
const COLOR_TAIL = new THREE.Color(0x7c5cff); // --primary
const COLOR_HEAD = new THREE.Color(0x38bdf8); // --primary-2

/**
 * Cheap dependency-free "noise": 3 summed sine waves, not true Perlin but
 * smooth enough for an ambient wander target.
 * @param {number} t - time in seconds
 * @param {number} seed - per-axis offset
 * @returns {number}
 */
function wanderNoise(t, seed) {
    return (
        Math.sin(t * 0.31 + seed) * 0.5 +
        Math.sin(t * 0.17 + seed * 1.7) * 0.3 +
        Math.sin(t * 0.53 + seed * 0.4) * 0.2
    );
}

/**
 * Creates and boots the full-page snake background inside `container`.
 * @param {HTMLElement} container - `.snake-bg-wrap` (v2.css)
 * @returns {Promise<{pause: () => void, resume: () => void, dispose: () => void}>}
 */
export async function createSnakeBackground(container) {
    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.z = 500;

    let halfHeight = camera.position.z * Math.tan((22.5 * Math.PI) / 180);
    let halfWidth = halfHeight * (width / height);

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

    // Trail starts bunched at the origin so the snake "grows" into view.
    const trail = Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3(0, 0, 0));
    const head = new THREE.Vector3(0, 0, 0);
    const target = new THREE.Vector3(0, 0, 0);

    let tube = null;
    const material = new THREE.MeshBasicMaterial({
        vertexColors: true,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
    });

    const pointer = { x: 0, y: 0, active: false };

    function onPointerMove(e) {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        pointer.active = true;
    }

    function onResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        halfHeight = camera.position.z * Math.tan((22.5 * Math.PI) / 180);
        halfWidth = halfHeight * (width / height);
        renderer.setSize(width, height);
    }

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);

    let paused = false;
    let rafId = null;
    let disposed = false;
    const clock = new THREE.Clock();

    function rebuildTube() {
        const curve = new THREE.CatmullRomCurve3(trail);
        const geometry = new THREE.TubeGeometry(curve, TUBULAR_SEGMENTS, TUBE_RADIUS, RADIAL_SEGMENTS, false);

        const uv = geometry.attributes.uv;
        const colors = new Float32Array(uv.count * 3);
        const c = new THREE.Color();
        for (let i = 0; i < uv.count; i++) {
            c.copy(COLOR_TAIL).lerp(COLOR_HEAD, uv.getX(i));
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        if (tube) {
            scene.remove(tube);
            tube.geometry.dispose();
        }
        tube = new THREE.Mesh(geometry, material);
        scene.add(tube);
    }

    function animate() {
        if (disposed) return;
        rafId = requestAnimationFrame(animate);
        if (paused) return;

        const t = clock.getElapsedTime();

        // Ambient wander target, in normalized -1..1 space.
        const wanderX = wanderNoise(t, 0);
        const wanderY = wanderNoise(t, 37.1);

        // Gentle pull toward pointer (never a hard chase), 0 until it moves.
        const pointerPull = pointer.active ? 0.22 : 0;
        const nx = wanderX * (1 - pointerPull) + pointer.x * pointerPull;
        const ny = wanderY * (1 - pointerPull) + pointer.y * pointerPull;

        target.x = nx * halfWidth * 0.85;
        target.y = ny * halfHeight * 0.85;
        target.z = Math.sin(t * 0.6) * 40;

        head.lerp(target, 0.02);

        trail.shift();
        trail.push(head.clone());

        rebuildTube();

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
            window.removeEventListener('resize', onResize);

            if (tube) {
                scene.remove(tube);
                tube.geometry.dispose();
            }
            material.dispose();
            scene.clear();
            renderer.dispose();
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        },
    };
}
