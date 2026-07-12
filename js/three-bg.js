/**
 * Three.js Interactive Particle Background
 * High Performance 3D Particle Field reacting to Mouse Movements
 */

class SpaceParticles {
    constructor() {
        this.container = document.getElementById('canvas-container');
        if (!this.container) return;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.particlesCount = this.width < 768 ? 400 : 1000; // Optimize for mobile
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        this.init();
    }

    init() {
        // 1. Scene setup
        this.scene = new THREE.Scene();

        // 2. Camera setup
        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 100);
        this.camera.position.z = 30;

        // 3. Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // 4. Create Dynamic Glow Particle Texture
        this.particleTexture = this.createDynamicTexture();

        // 5. Generate Particle Geometry & Material
        this.createParticles();

        // 6. Bind Event Listeners
        this.bindEvents();

        // 7. Start Animation Loop
        this.animate();
    }

    createDynamicTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // Draw radial glow gradient (single locked accent hue, tonal only)
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(46, 230, 198, 0.8)');
        gradient.addColorStop(0.6, 'rgba(20, 168, 143, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);

        return new THREE.CanvasTexture(canvas);
    }

    createParticles() {
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particlesCount * 3);
        const randomSpeeds = new Float32Array(this.particlesCount);

        for (let i = 0; i < this.particlesCount; i++) {
            // Position coordinates (spread in cube coordinate space)
            positions[i * 3] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

            // Speed offsets
            randomSpeeds[i] = 0.02 + Math.random() * 0.03;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.randomSpeeds = randomSpeeds;

        // Custom particles material
        this.material = new THREE.PointsMaterial({
            size: 0.28,
            map: this.particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particleSystem = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particleSystem);
    }

    bindEvents() {
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    onMouseMove(e) {
        // Map cursor position to normalized space (-1 to +1)
        this.mouse.targetX = (e.clientX / this.width - 0.5) * 2;
        this.mouse.targetY = -(e.clientY / this.height - 0.5) * 2;
    }

    onScroll() {
        // Rotate points system based on scroll progression
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        if (this.particleSystem) {
            this.particleSystem.rotation.z = scrollPercent * 0.5;
        }
    }

    animate() {
        // Reduced motion: render the field once, static, and stop the loop.
        if (this.reducedMotion) {
            this.renderer.render(this.scene, this.camera);
            return;
        }

        requestAnimationFrame(this.animate.bind(this));

        // Smooth Mouse Lerping logic for parallax
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

        // Apply gentle floating rotation
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.001;
            this.particleSystem.rotation.x = this.mouse.y * 0.15;
            this.particleSystem.rotation.y += this.mouse.x * 0.05;

            // Animate positions for organic drifting movement
            const positions = this.geometry.attributes.position.array;
            for (let i = 0; i < this.particlesCount; i++) {
                // Drifts Y positions slowly
                positions[i * 3 + 1] += this.randomSpeeds[i] * 0.05;

                // Reset position if drifting too high
                if (positions[i * 3 + 1] > 30) {
                    positions[i * 3 + 1] = -30;
                }
            }
            this.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    new SpaceParticles();
});
