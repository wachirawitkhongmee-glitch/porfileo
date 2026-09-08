/* ============================================
   FUTURISTIC PORTFOLIO — JavaScript Engine
   Particles, Typing, 3D Tilt, Scroll Reveal, Loading
   ============================================ */

function dismissLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    const bar = document.getElementById('loader-bar');
    if (bar) bar.style.width = '100%';
    if (screen && !screen.classList.contains('loaded')) {
        screen.classList.add('loaded');
        setTimeout(() => {
            screen.style.display = 'none';
        }, 600);
    }
}

// Global safety fail-safe: Hide loading screen after 1.5 seconds under all circumstances
setTimeout(dismissLoadingScreen, 1500);

function initAll() {
    // ── Loading Screen ──
    initLoadingScreen();

    // ── Particles ──
    try { initParticles(); } catch (e) { console.warn('Particles:', e); }

    // ── Navbar ──
    try { initNavbar(); } catch (e) { console.warn('Navbar:', e); }

    // ── Typing Animation ──
    try { initTypingAnimation(); } catch (e) { console.warn('Typing:', e); }

    // ── Scroll Reveal ──
    try { initScrollReveal(); } catch (e) { console.warn('ScrollReveal:', e); }

    // ── 3D Card Tilt ──
    try { initCardTilt(); } catch (e) { console.warn('CardTilt:', e); }

    // ── Skill Circle Animation ──
    try { initSkillCircles(); } catch (e) { console.warn('SkillCircles:', e); }

    // ── Modal ──
    try { initModal(); } catch (e) { console.warn('Modal:', e); }

    // ── Profile Parallax ──
    try { initProfileParallax(); } catch (e) { console.warn('Parallax:', e); }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

/* ============================================
   LOADING SCREEN
   ============================================ */
function initLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    const bar = document.getElementById('loader-bar');
    if (!screen) return;

    if (!bar) {
        dismissLoadingScreen();
        return;
    }

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 25) + 20;
        if (progress > 100) progress = 100;
        bar.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(dismissLoadingScreen, 250);
        }
    }, 70);
}

/* ============================================
   PARTICLE SYSTEM (Canvas 2D)
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    const PARTICLE_COUNT = 70;
    const CONNECTION_DIST = 140;
    const MOUSE_DIST = 180;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.4 + 0.1
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
                    ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles & mouse connections
        particles.forEach(p => {
            // Particle dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
            ctx.fill();

            // Mouse connection
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_DIST) {
                const opacity = (1 - dist / MOUSE_DIST) * 0.3;
                ctx.strokeStyle = `rgba(179, 71, 234, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
        });

        requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    // Scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Hamburger toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.length <= 1) return;
            try {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const y = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            } catch (err) {
                // Ignore invalid selector
            }
        });
    });
}

/* ============================================
   TYPING ANIMATION
   ============================================ */
function initTypingAnimation() {
    const element = document.getElementById('typing-text');
    if (!element) return;

    const phrases = [
        'Web Developer',
        'Tech Enthusiast',
        'Student',
        'Creative Coder',
        'Future Engineer'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

/* ============================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================ */
function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ============================================
   3D CARD TILT EFFECT
   ============================================ */
function initCardTilt() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
}

/* ============================================
   SKILL CIRCLE ANIMATION
   ============================================ */
function initSkillCircles() {
    const circles = document.querySelectorAll('.skill-circle');
    if (!circles.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const target = parseInt(circle.getAttribute('data-target'), 10);
                animateCircle(circle, target);
                observer.unobserve(circle);
            }
        });
    }, { threshold: 0.5 });

    circles.forEach(circle => observer.observe(circle));
}

function animateCircle(circle, target) {
    let current = 0;
    const duration = 1500;
    const start = performance.now();

    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);
        circle.style.setProperty('--progress', current);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

/* ============================================
   MODAL
   ============================================ */
function initModal() {
    const modalBtns = document.querySelectorAll('.open-modal');
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-btn');

    if (!modal) return;

    modalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnEl = e.currentTarget;
            const card = btnEl.closest('.project-card');
            if (card) {
                const title = btnEl.getAttribute('data-title') || card.querySelector('.project-title')?.textContent || 'Project';
                const desc = btnEl.getAttribute('data-desc') || card.querySelector('.project-desc')?.textContent || '';
                const videoUrl = btnEl.getAttribute('data-video');
                const imgUrl = btnEl.getAttribute('data-img');
                const badge = btnEl.getAttribute('data-badge');

                document.getElementById('modal-title').textContent = title;

                const modalBody = modal.querySelector('.modal-body');
                if (modalBody) {
                    let badgeHtml = badge ? `<div style="display: inline-flex; align-items: center; gap: 6px; padding: 0.3rem 0.8rem; background: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 4px; color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.75rem; margin-bottom: 0.8rem; letter-spacing: 1px;">${badge}</div>` : '';

                    let mediaHtml = '';
                    if (imgUrl) {
                        mediaHtml = `
                            <div style="position: relative; border-radius: 8px; overflow: hidden; margin-top: 1.2rem; border: 1px solid var(--glass-border);">
                                <img src="${imgUrl}" alt="${title}" style="width: 100%; height: auto; max-height: 280px; object-fit: cover; display: block;" onerror="this.src='https://img.youtube.com/vi/YlX7FGCKZRM/maxresdefault.jpg'">
                            </div>
                        `;
                    } else {
                        mediaHtml = `<div class="placeholder-img" style="height: 180px; margin-top: 1.2rem;">// PROJECT_DATA</div>`;
                    }

                    let actionHtml = '';
                    if (videoUrl) {
                        actionHtml = `
                            <div style="margin-top: 1.5rem; display: flex; gap: 1rem; align-items: center;">
                                <a href="${videoUrl}" target="_blank" rel="noopener noreferrer" class="project-btn-yt" style="padding: 0.6rem 1.2rem; font-size: 0.75rem;">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                    เปิดดูคลิปบน YouTube ↗
                                </a>
                            </div>
                        `;
                    }

                    modalBody.innerHTML = `
                        ${badgeHtml}
                        <p>${desc}</p>
                        ${mediaHtml}
                        ${actionHtml}
                    `;
                }
            }
            modal.style.display = 'flex';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
}

/* ============================================
   PROFILE PARALLAX (Mouse-based)
   ============================================ */
function initProfileParallax() {
    const frame = document.getElementById('profile-frame');
    if (!frame) return;

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        // Gentle position shift (no rotation)
        const moveX = x * 8;
        const moveY = y * 5;

        // Get the floating animation's current state and add parallax
        frame.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
    });

    // Reset on mouse leave from hero
    const hero = document.getElementById('home');
    if (hero) {
        hero.addEventListener('mouseleave', () => {
            frame.style.transform = '';
            frame.style.transition = 'transform 0.5s ease';
        });
        hero.addEventListener('mouseenter', () => {
            frame.style.transition = 'transform 0.15s ease-out';
        });
    }
}
