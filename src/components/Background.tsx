"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Background() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();
        // Shading removed - Fog disabled

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles
        const particles = new THREE.Group();
        scene.add(particles);
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);
        const colorsArray = new Float32Array(particlesCount * 3);
        const sizeArray = new Float32Array(particlesCount);
        const color1 = new THREE.Color("#3b82f6");
        const color2 = new THREE.Color("#0ea5e9");
        const color3 = new THREE.Color("#a5f3fc");

        for (let i = 0; i < particlesCount; i++) {
            const radius = 20 + Math.random() * 30;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(Math.random() * 2 - 1);
            posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            posArray[i * 3 + 2] = radius * Math.cos(phi);
            sizeArray[i] = Math.random() * 1.5;
            let mixedColor = color1.clone();
            const randColor = Math.random();
            if (randColor > 0.66) mixedColor = color2.clone();
            else if (randColor > 0.33) mixedColor = color3.clone();
            colorsArray[i * 3] = mixedColor.r;
            colorsArray[i * 3 + 1] = mixedColor.g;
            colorsArray[i * 3 + 2] = mixedColor.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizeArray, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uTime;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.x += sin(pos.y * 0.1 + uTime * 0.5) * 2.0;
          pos.z += cos(pos.x * 0.1 + uTime * 0.5) * 2.0;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (350.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = pow(1.0 - dist * 2.0, 1.5);
          gl_FragColor = vec4(vColor, alpha * 0.4);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const particlesMesh = new THREE.Points(geometry, material);
        particles.add(particlesMesh);

        // Neural Core shells
        const coreGroup = new THREE.Group();
        scene.add(coreGroup);
        const coreMaterial = new THREE.LineBasicMaterial({
            color: 0x3b82f6, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending,
        });
        const shell1 = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.OctahedronGeometry(10, 2)), coreMaterial
        );
        const coreMat2 = coreMaterial.clone();
        coreMat2.opacity = 0.1;
        const shell2 = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.OctahedronGeometry(14, 1)), coreMat2
        );
        coreGroup.add(shell1);
        coreGroup.add(shell2);

        // Mouse interaction
        let mouseX = 0, mouseY = 0;
        const onMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.002;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.002;
        };
        document.addEventListener("mousemove", onMouseMove);

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            const targetX = mouseX * 5;
            const targetY = mouseY * 5;
            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (-targetY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            shell1.rotation.y = elapsedTime * 0.2;
            shell1.rotation.z = elapsedTime * 0.1;
            shell2.rotation.y = -elapsedTime * 0.15;
            shell2.rotation.x = elapsedTime * 0.1;
            particles.rotation.y = elapsedTime * 0.05;
            material.uniforms.uTime.value = elapsedTime;
            renderer.render(scene, camera);
        }
        animate();

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener("resize", onResize);

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", onResize);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} id="bg-canvas" />;
}
