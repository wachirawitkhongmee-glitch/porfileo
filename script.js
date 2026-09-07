document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Modal Logic
    const modals = document.querySelectorAll('.open-modal');
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-btn');

    if (modals && modal) {
        modals.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.card');
                const title = card.querySelector('.card-title').innerText;
                document.getElementById('modal-title').innerText = title;
                modal.style.display = 'flex';
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Three.js 3D Avatar Placeholder Setup
    initThreeJS();
});

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Placeholder 3D Object (Icosahedron as an "Avatar" placeholder)
    // To use a real user model later, use GLTFLoader to load a .glb/.gltf file
    const geometry = new THREE.IcosahedronGeometry(1.5, 1);
    
    // Create a modern glass-like or glowing material
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x4f46e5, // Primary color
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.9, // glass-like
        thickness: 0.5,
        envMapIntensity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });
    
    const avatarMesh = new THREE.Mesh(geometry, material);
    scene.add(avatarMesh);

    // Inner core to make it look cool
    const coreGeometry = new THREE.IcosahedronGeometry(0.8, 0);
    const coreMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x8b5cf6, 
        wireframe: true 
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    avatarMesh.add(coreMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Add glowing particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        // Random positions around the avatar
        posArray[i] = (Math.random() - 0.5) * 8;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.6
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Interactivity: follow mouse slightly
    let mouseX = 0;
    let mouseY = 0;
    
    // Floating animation variables
    const clock = new THREE.Clock();

    document.addEventListener('mousemove', (event) => {
        // Normalize mouse coordinates (-1 to +1)
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();

        // Base rotation
        avatarMesh.rotation.y += 0.005;
        avatarMesh.rotation.x += 0.002;
        
        coreMesh.rotation.y -= 0.01;
        coreMesh.rotation.z -= 0.005;

        // Particles rotation
        particlesMesh.rotation.y -= 0.001;
        particlesMesh.rotation.x += 0.0005;

        // Floating effect
        avatarMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.2;

        // Mouse interaction (gentle follow)
        // Lerp towards mouse position for smooth effect
        const targetRotationX = mouseY * 0.5;
        const targetRotationY = mouseX * 0.5;
        
        avatarMesh.rotation.x += 0.05 * (targetRotationX - avatarMesh.rotation.x);
        avatarMesh.rotation.y += 0.05 * (targetRotationY - avatarMesh.rotation.y);

        renderer.render(scene, camera);
    }

    animate();
}
