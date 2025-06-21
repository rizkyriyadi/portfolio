// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
// REGISTER ScrollToPlugin explicitly
gsap.registerPlugin(ScrollToPlugin); // BARIS INI PENTING!

// Function to load HTML components
async function loadComponent(url, containerId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
        return true; // Indicate success
    } catch (error) {
        console.error(`Could not load component from ${url}:`, error);
        return false; // Indicate failure
    }
}

// Function to initialize GSAP animations
function initializeGSAPAnimations() {
    // Hero section animations
    gsap.from('.hero h1', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' });
    gsap.from('.hero p', { y: 50, opacity: 0, duration: 1, delay: 0.4, ease: 'power3.out' });

    // Projects section animations with ScrollTrigger
    gsap.from('.projects h2', { 
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', 
        scrollTrigger: { 
            trigger: '.projects', 
            start: 'top 80%', 
            toggleActions: 'play none none none',
        } 
    });
    
    gsap.from('.project-card', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: { 
            trigger: '.project-grid', 
            start: 'top 75%',
            toggleActions: 'play none none none',
        }
    });

    // Contact section animations with ScrollTrigger
    gsap.from('.contact h2', { 
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', 
        scrollTrigger: { 
            trigger: '.contact', 
            start: 'top 80%', 
            toggleActions: 'play none none none',
        } 
    });

    gsap.from('.contact-button', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { 
            trigger: '.contact-links', 
            start: 'top 80%', 
            toggleActions: 'play none none none',
        }
    });
}

// Ensure DOM is loaded and then load components and initialize features
document.addEventListener('DOMContentLoaded', async () => {
    // Load all components asynchronously
    const navbarLoaded = await loadComponent('components/navbar.html', 'navbar-container');
    await loadComponent('components/hero.html', 'hero-container');
    await loadComponent('components/projects.html', 'projects-container');
    await loadComponent('components/contact.html', 'contact-container');

    // Dark Mode Toggle initialization
    if (navbarLoaded) {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const savedTheme = localStorage.getItem('theme');

            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.body.classList.add('dark-mode');
            }

            toggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
            });
        } else {
            console.warn('Theme toggle button not found after component load. Check components/navbar.html');
        }
    }

    // Initialize GSAP animations after all components are loaded and rendered
    initializeGSAPAnimations();

    // Smooth Scroll for Navbar (must be re-initialized after navbar component is loaded)
    document.querySelectorAll('#navbar-container a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Pastikan ScrollToPlugin sudah dimuat dan terdaftar
                gsap.to(window, { duration: 1, scrollTo: { y: targetElement, offsetY: 70 }, ease: 'power3.out' });
            } else {
                console.warn(`Scroll target ${targetId} not found.`);
            }
        });
    });

    console.log('Portfolio page loaded for Rizky Riyadi with enhanced features!');
});


// ... (kode yang sudah ada) ...

// Function to update active navbar link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navbar-container a[href^="#"]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Offset for fixed navbar
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const currentId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ... (Di dalam DOMContentLoaded event listener) ...

    // Initial check for active link
    updateActiveNavLink();

    // Listen for scroll events to update active link
    window.addEventListener('scroll', updateActiveNavLink);

    // Update smooth scroll for Navbar to use updatedActiveNavLink logic
    document.querySelectorAll('#navbar-container a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                gsap.to(window, { 
                    duration: 1, 
                    scrollTo: { y: targetElement, offsetY: 70 }, 
                    ease: 'power3.out',
                    onComplete: () => { // Update active class after scroll completes
                        updateActiveNavLink(); 
                    }
                });
            } else {
                console.warn(`Scroll target ${targetId} not found.`);
            }
        });
    });

// ... (sisa kode) ...