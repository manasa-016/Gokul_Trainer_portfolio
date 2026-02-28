/* ============================================
   GOKULAKRISHNAN MUTHUSAMY - PORTFOLIO JS
   3D Effects, Animations, and Interactions
   ============================================ */

// ---- Three.js Professional Mesh Background ----
(function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create Mesh Background
    const planeSize = 30;
    const planeSegments = 40;
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize, planeSegments, planeSegments);

    // Custom vertex animation
    const originalPositions = geometry.attributes.position.array.slice();

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColorPrimary: { value: new THREE.Color(0x7c3aed) },
            uColorSecondary: { value: new THREE.Color(0x06b6d4) }
        },
        vertexShader: `
            uniform float uTime;
            varying float vElevation;
            
            void main() {
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                
                float elevation = sin(modelPosition.x * 0.3 + uTime * 0.5) * 
                                  cos(modelPosition.z * 0.3 + uTime * 0.5) * 0.8;
                
                modelPosition.y += elevation;
                
                vElevation = elevation;
                gl_Position = projectionMatrix * viewMatrix * modelPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 uColorPrimary;
            uniform vec3 uColorSecondary;
            varying float vElevation;
            
            void main() {
                float mixStrength = (vElevation + 0.8) / 1.6;
                vec3 color = mix(uColorPrimary, uColorSecondary, mixStrength);
                gl_FragColor = vec4(color, 0.08); // Very subtle
            }
        `,
        transparent: true,
        wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -2;
    scene.add(mesh);

    // Add flowing particles (Dots at intersections)
    const pointsMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.3,
        sizeAttenuation: true
    });
    const points = new THREE.Points(geometry, pointsMaterial);
    points.rotation.x = -Math.PI / 2;
    points.position.y = -2;
    scene.add(points);

    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        material.uniforms.uTime.value = elapsedTime;

        // Subtle camera movement
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.01;
        camera.position.z += (10 + mouseY * 5 - camera.position.z) * 0.01;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
})();


// ---- Custom Cursor ----
(function initCursor() {
    const dot = document.getElementById('cursorDot');
    const outline = document.getElementById('cursorOutline');

    if (!dot || !outline) return;

    if (window.innerWidth <= 768) return;

    let curX = 0, curY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
        curX = e.clientX;
        curY = e.clientY;
        dot.style.left = curX - 4 + 'px';
        dot.style.top = curY - 4 + 'px';
    });

    function animateOutline() {
        dotX += (curX - dotX) * 0.15;
        dotY += (curY - dotY) * 0.15;
        outline.style.left = dotX - 18 + 'px';
        outline.style.top = dotY - 18 + 'px';
        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Hover effect on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .tilt-card, .skill-tag, .cert-card, .role-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hover'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
    });
})();

// ---- Loader ----
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        // Trigger hero animations
        document.querySelectorAll('.hero .animate-in').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 120);
        });
    }, 1500);
});

// ---- Navbar ----
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
})();

// ---- Typing Effect ----
(function initTypingEffect() {
    const roles = [
        'AI/ML Expert & Trainer',
        'Data Science Professional',
        'Generative AI Specialist',
        'Full-Stack Python Developer',
        'Founder — Magizh Technologies',
        'IIT Madras Academic Mentor',
        'Guest Professor at VIT'
    ];

    const typedEl = document.getElementById('typedText');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typedEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typedEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    setTimeout(typeEffect, 2000);
})();

// ---- Counter Animation ----
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            updateCounter();
        });
    }

    // Trigger when hero stats are visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) observer.observe(statsEl);
})();

// ---- 3D Card Tilt Effect ----
(function init3DCard() {
    const card = document.getElementById('hero3dCard');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -12;
        const rotateY = (x - centerX) / centerX * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
})();

// ---- Tilt Effect for Cards ----
(function initTiltCards() {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
        });
    });
})();

// ---- Scroll Reveal Animations ----
(function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .timeline-item, .skill-category, .edu-card, .contact-card, .contact-form-wrapper, .about-text, .about-visual, .certifications, .other-roles'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay
                setTimeout(() => {
                    entry.target.classList.add('reveal');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
})();

// ---- Smooth Scroll ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- Contact Form ----
(function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('formName').value;
        const email = document.getElementById('formEmail').value;
        const subject = document.getElementById('formSubject').value;
        const message = document.getElementById('formMessage').value;

        // Create mailto link
        const mailtoLink = `mailto:gokulakrishnan.msamy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
        window.location.href = mailtoLink;

        // Show success feedback
        const btn = form.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            form.reset();
        }, 3000);
    });
})();

// ---- Parallax on scroll ----
(function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
    });
})();

// ---- Magnetic button effect ----
(function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
})();

console.log('%c🚀 Gokulakrishnan Muthusamy Portfolio v1.0', 'color: #7c3aed; font-size: 16px; font-weight: bold;');
console.log('%cDesigned with ❤️ and Three.js', 'color: #06b6d4; font-size: 12px;');
