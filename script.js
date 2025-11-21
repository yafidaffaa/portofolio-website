// script.js - Portfolio Landing Page Logic

// Global variables untuk menyimpan data
let aboutData = null;
let portfolioData = [];
let certsData = [];
let socialsData = null;

// Load semua data saat halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllData();
    initializeEventListeners();
    initializeFilterStyles();
});

// Function untuk load semua JSON data
async function loadAllData() {
    try {
        // Load about data
        const aboutResponse = await fetch('data/about.json');
        aboutData = await aboutResponse.json();
        loadAboutData();

        // Load portfolio data
        const portfolioResponse = await fetch('data/portfolio.json');
        portfolioData = await portfolioResponse.json();
        loadPortfolio();

        // Load certifications data
        const certsResponse = await fetch('data/certs.json');
        certsData = await certsResponse.json();
        loadCertifications();

        // Load socials data
        const socialsResponse = await fetch('data/socials.json');
        socialsData = await socialsResponse.json();
        loadSocials();

    } catch (error) {
        console.error('Error loading data:', error);
        showErrorMessage();
    }
}

// Function untuk menampilkan error message jika gagal load data
function showErrorMessage() {
    const errorMsg = `
        <div class="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg">
            <p class="font-semibold">Error loading data. Please check console for details.</p>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', errorMsg);
}

// Load About Data ke Hero dan About Section
function loadAboutData() {
    if (!aboutData) return;

    document.getElementById('heroName').textContent = aboutData.name;
    document.getElementById('heroHeadline').textContent = aboutData.headline;
    document.getElementById('heroShortBio').textContent = aboutData.short_bio;
    document.getElementById('longBio').textContent = aboutData.long_bio;
    document.getElementById('footerName').textContent = aboutData.name;

    // Load skills badges
    const skillsContainer = document.getElementById('skillsContainer');
    skillsContainer.innerHTML = aboutData.skills.map(skill => 
        `<span class="bg-indigo-100 text-indigo-700 px-5 py-2 rounded-full font-semibold text-sm md:text-base hover:bg-indigo-200 transition-colors">
            ${skill}
        </span>`
    ).join('');
}

// Load Portfolio dengan filter
function loadPortfolio(category = 'All') {
    if (!portfolioData.length) return;

    const filtered = category === 'All' 
        ? portfolioData 
        : portfolioData.filter(p => p.category === category);
    
    const grid = document.getElementById('portfolioGrid');
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 text-lg">No projects found in this category.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(project => `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer card-hover" 
             data-project-id="${project.id}">
            <div class="overflow-hidden">
                <img src="${project.image}" 
                     alt="${project.title}" 
                     class="w-full h-56 object-cover transition-transform duration-300 hover:scale-110">
            </div>
            <div class="p-6">
                <span class="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    ${project.category}
                </span>
                <h3 class="text-xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-colors">
                    ${project.title}
                </h3>
                <p class="text-gray-600 mb-4 leading-relaxed">
                    ${project.short_desc}
                </p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${project.tech.slice(0, 3).map(t => 
                        `<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium">
                            ${t}
                        </span>`
                    ).join('')}
                    ${project.tech.length > 3 ? 
                        `<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium">
                            +${project.tech.length - 3}
                        </span>` : ''
                    }
                </div>
                <button class="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center gap-2">
                    View Details
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');

    // Add click handlers untuk setiap card
    grid.querySelectorAll('[data-project-id]').forEach(card => {
        card.addEventListener('click', () => {
            const project = portfolioData.find(p => p.id === card.dataset.projectId);
            showProjectModal(project);
        });
    });
}

// Load Certifications dengan filter
function loadCertifications(type = 'All') {
    if (!certsData.length) return;

    const filtered = type === 'All' 
        ? certsData 
        : certsData.filter(c => c.type === type);
    
    const grid = document.getElementById('certGrid');
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 text-lg">No certifications found in this category.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(cert => `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer card-hover" 
             data-cert-id="${cert.id}">
            <div class="overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                <img src="${cert.image}" 
                     alt="${cert.name}" 
                     class="w-full h-56 object-contain p-6 transition-transform duration-300 hover:scale-105">
            </div>
            <div class="p-6">
                <span class="inline-block bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    ${cert.type}
                </span>
                <h3 class="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                    ${cert.name}
                </h3>
                <p class="text-gray-600 text-sm font-semibold mb-3">
                    ${cert.issuer}
                </p>
                <p class="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    ${cert.description.substring(0, 120)}...
                </p>
                <button class="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center gap-2">
                    View Certificate
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');

    // Add click handlers untuk setiap card
    grid.querySelectorAll('[data-cert-id]').forEach(card => {
        card.addEventListener('click', () => {
            const cert = certsData.find(c => c.id === card.dataset.certId);
            showCertModal(cert);
        });
    });
}

// Load Social Media Links
function loadSocials() {
    if (!socialsData) return;

    const container = document.getElementById('socialsContainer');
    
    const socialIcons = {
        email: {
            icon: `<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                   </svg>`,
            label: 'Email'
        },
        linkedin: {
            icon: `<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                   </svg>`,
            label: 'LinkedIn'
        },
        github: {
            icon: `<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                   </svg>`,
            label: 'GitHub'
        },
        kaggle: {
            icon: `<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.358"/>
                   </svg>`,
            label: 'Kaggle'
        },
        medium: {
            icon: `<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                   </svg>`,
            label: 'Medium'
        }
    };

    const links = [];
    for (const [key, value] of Object.entries(socialsData)) {
        if (socialIcons[key]) {
            const href = key === 'email' ? `mailto:${value}` : value;
            links.push(`
                <a href="${href}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="text-white hover:text-indigo-400 transition-all duration-300 transform hover:scale-110 flex flex-col items-center gap-2 group"
                   title="${socialIcons[key].label}">
                    <div class="p-3 bg-gray-800 rounded-full group-hover:bg-indigo-600 transition-colors">
                        ${socialIcons[key].icon}
                    </div>
                    <span class="text-sm text-gray-400 group-hover:text-white transition-colors">
                        ${socialIcons[key].label}
                    </span>
                </a>
            `);
        }
    }
    container.innerHTML = links.join('');
}

// Show Project Modal
function showProjectModal(project) {
    if (!project) return;

    // Isi data modal
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalLongDesc').textContent = project.long_desc;
    document.getElementById('modalLink').href = project.link;

    const gallery = document.getElementById('modalGallery');

    // ====== SINGLE IMAGE ======
    if (project.gallery.length === 1) {
        gallery.innerHTML = `
            <img src="${project.gallery[0]}" 
                 alt="${project.title}" 
                 class="w-full h-64 md:h-96 object-cover rounded-lg shadow-md">
        `;
    } 
    // ====== CAROUSEL ======
    else if (project.gallery.length > 1) {
        gallery.innerHTML = `
            <div class="relative w-full overflow-hidden rounded-lg">
                <div id="carouselTrack" 
                     class="flex transition-transform duration-500 ease-in-out" 
                     style="width:${project.gallery.length * 100}%">
                    ${project.gallery.map(img => `
                        <div class="w-full flex-shrink-0">
                            <img src="${img}" alt="${project.title}" 
                                 class="w-full h-64 md:h-96 object-cover rounded-lg shadow-md">
                        </div>
                    `).join('')}
                </div>

                <!-- Bullets -->
                <div id="carouselBullets" 
                     class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                    ${project.gallery.map((_, idx) => `
                        <button class="w-3 h-3 rounded-full ${idx === 0 ? 'bg-indigo-600' : 'bg-gray-300'}"></button>
                    `).join('')}
                </div>
            </div>
        `;

        let currentIndex = 0;
        const track = gallery.querySelector('#carouselTrack');
        const bullets = gallery.querySelectorAll('#carouselBullets button');

        function updateCarousel(index) {
            currentIndex = index;
            track.style.transform = `translateX(-${100 * index}%)`;
            bullets.forEach((b, i) => {
                b.classList.toggle('bg-indigo-600', i === index);
                b.classList.toggle('bg-gray-300', i !== index);
            });
        }

        // Bullet click
        bullets.forEach((b, i) => {
            b.addEventListener('click', () => updateCarousel(i));
        });

        // Auto-slide
        setInterval(() => {
            const nextIndex = (currentIndex + 1) % project.gallery.length;
            updateCarousel(nextIndex);
        }, 4000);
    }

    // Tech badges
    const techContainer = document.getElementById('modalTech');
    techContainer.innerHTML = project.tech.map(t => 
        `<span class="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
            ${t}
        </span>`
    ).join('');

    // Show modal
    document.getElementById('portfolioModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}


// Show Certification Modal
function showCertModal(cert) {
    if (!cert) return;

    document.getElementById('certModalTitle').textContent = cert.name;
    document.getElementById('certModalIssuer').textContent = cert.issuer;
    document.getElementById('certModalDesc').textContent = cert.description;
    document.getElementById('certModalLink').href = cert.link;
    document.getElementById('certModalImage').src = cert.full_image;

    // Show modal
    document.getElementById('certModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close Modals
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Initialize Event Listeners
function initializeEventListeners() {
    // About Me expand/collapse
    document.getElementById('moreAboutBtn').addEventListener('click', () => {
        document.getElementById('aboutExpanded').classList.remove('hidden');
        document.getElementById('aboutExpanded').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });

    document.getElementById('closeAboutBtn').addEventListener('click', () => {
        document.getElementById('hero').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });

    // Portfolio filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active', 'bg-indigo-600', 'text-white');
                b.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
            });
            btn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
            btn.classList.add('active', 'bg-indigo-600', 'text-white');
            
            // Load filtered portfolio
            loadPortfolio(btn.dataset.category);
        });
    });

    // Certification filter buttons
    document.querySelectorAll('.cert-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.cert-filter-btn').forEach(b => {
                b.classList.remove('active', 'bg-indigo-600', 'text-white');
                b.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
            });
            btn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
            btn.classList.add('active', 'bg-indigo-600', 'text-white');
            
            // Load filtered certifications
            loadCertifications(btn.dataset.type);
        });
    });

    // Portfolio Modal close
    document.getElementById('closePortfolioModal').addEventListener('click', () => {
        closeModal('portfolioModal');
    });

    // Certification Modal close
    document.getElementById('closeCertModal').addEventListener('click', () => {
        closeModal('certModal');
    });

    // Close modals on backdrop click
    document.getElementById('portfolioModal').addEventListener('click', (e) => {
        if (e.target.id === 'portfolioModal') {
            closeModal('portfolioModal');
        }
    });

    document.getElementById('certModal').addEventListener('click', (e) => {
        if (e.target.id === 'certModal') {
            closeModal('certModal');
        }
    });

    // Close modals with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal('portfolioModal');
            closeModal('certModal');
        }
    });
}

// Initialize filter button styles
function initializeFilterStyles() {
    document.querySelectorAll('.filter-btn, .cert-filter-btn').forEach(btn => {
        if (btn.classList.contains('active')) {
            btn.classList.add('bg-indigo-600', 'text-white');
        } else {
            btn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
        }
        
        // Add base styles
        btn.classList.add('px-6', 'py-2', 'rounded-full', 'font-semibold', 
                          'transition-all', 'duration-300', 'cursor-pointer');
    });
}

// Smooth scroll untuk anchor links (jika ada)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});