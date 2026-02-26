import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DBackground() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // ── Scene Setup ──────────────────────────────────────────────
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0); // transparent background
        mount.appendChild(renderer.domElement);

        // ── Particle Cloud ───────────────────────────────────────────
        const particleCount = 4000;
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Distribute particles in a sphere
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 1.5 + Math.random() * 0.5;

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x3b82f6,   // Blue
            size: 0.012,
            transparent: true,
            opacity: 0.75,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // ── Floating Torus Knot (accent) ──────────────────────────────
        const torusGeo = new THREE.TorusKnotGeometry(0.6, 0.15, 128, 16);
        const torusMat = new THREE.MeshStandardMaterial({
            color: 0x2563eb,
            wireframe: true,
            opacity: 0.15,
            transparent: true,
        });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        scene.add(torus);

        // Light for the torus
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // ── Mouse Interaction ─────────────────────────────────────────
        let mouseX = 0;
        let mouseY = 0;
        const onMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMouseMove);

        // ── Resize Handler ────────────────────────────────────────────
        const onResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', onResize);

        // ── Animation Loop ────────────────────────────────────────────
        let frameId;
        const clock = new THREE.Clock();

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            // Particles: slow rotation + mouse parallax
            particles.rotation.y = elapsed * 0.04 + mouseX * 0.15;
            particles.rotation.x = elapsed * 0.02 + mouseY * 0.1;

            // Torus: orbit & pulse
            torus.rotation.x = elapsed * 0.3;
            torus.rotation.y = elapsed * 0.2;
            const scale = 1 + 0.05 * Math.sin(elapsed * 1.5);
            torus.scale.set(scale, scale, scale);

            renderer.render(scene, camera);
        };
        animate();

        // ── Cleanup ───────────────────────────────────────────────────
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            torusGeo.dispose();
            torusMat.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
            }}
        >
            {/* Soft radial vignette so content stays readable */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(ellipse at 70% 50%, transparent 30%, rgba(248,250,252,0.85) 70%, rgba(248,250,252,1) 100%)',
                zIndex: 1,
                pointerEvents: 'none',
            }} />
        </div>
    );
}
