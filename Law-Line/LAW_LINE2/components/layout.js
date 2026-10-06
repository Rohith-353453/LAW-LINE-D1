import { searchIndex } from './search-index.js';

export function initLayout() {
    // 0. Inject Font Awesome
    if (!document.getElementById('fa-cdn')) {
        const fa = document.createElement('link');
        fa.id = 'fa-cdn';
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fa);
    }

    // 1. Inject Fuse.js
    if (!window.Fuse) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js";
        script.onload = () => { console.log("✅ Fuse.js Loaded"); };
        document.head.appendChild(script);
    }

    // 2. Define HTML
    const headerHTML = `
    <!-- Desktop Header -->
    <div class="hidden lg:grid grid-cols-3 items-center max-w-7xl mx-auto px-6 py-4">
        
        <!-- Left: Themes Dropdown -->
        <div class="flex justify-start">
            <div class="relative group">
                <button class="flex items-center gap-2 text-gray-700 font-bold hover:text-primary transition py-2">
                    <span>EXPLORE THEMES</span>
                    <i class="fas fa-chevron-down text-xs transition transform group-hover:rotate-180"></i>
                </button>
                
                <!-- Dropdown Menu -->
                <div class="absolute top-full left-0 w-64 bg-white shadow-xl rounded-xl border border-gray-100 hidden group-hover:block dropdown-menu z-50 p-2">
                    <a href="children.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition group/item">
                        <i class="fas fa-child text-xl text-primary w-6 text-center group-hover/item:scale-110 transition"></i>
                        <span class="text-sm font-medium text-gray-700">Children</span>
                    </a>
                    <a href="women.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition group/item">
                        <i class="fas fa-female text-xl text-primary w-6 text-center group-hover/item:scale-110 transition"></i>
                        <span class="text-sm font-medium text-gray-700">Women</span>
                    </a>
                    <a href="employees.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition group/item">
                        <i class="fas fa-briefcase text-xl text-primary w-6 text-center group-hover/item:scale-110 transition"></i>
                        <span class="text-sm font-medium text-gray-700">Employees</span>
                    </a>
                    <a href="seniorcitizens.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition group/item">
                        <i class="fas fa-user-clock text-xl text-primary w-6 text-center group-hover/item:scale-110 transition"></i>
                        <span class="text-sm font-medium text-gray-700">Senior Citizens</span>
                    </a>
                    <hr class="my-1 border-gray-100">
                    <a href="crimes.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition group/item">
                        <i class="fas fa-gavel text-xl text-primary w-6 text-center group-hover/item:scale-110 transition"></i>
                        <span class="text-sm font-medium text-gray-700">Crimes & Violence</span>
                    </a>
                    <a href="police.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition group/item">
                        <i class="fas fa-balance-scale text-xl text-primary w-6 text-center group-hover/item:scale-110 transition"></i>
                        <span class="text-sm font-medium text-gray-700">Police & Courts</span>
                    </a>
                    <a href="family.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition group/item">
                        <i class="fas fa-home text-xl text-primary w-6 text-center group-hover/item:scale-110 transition"></i>
                        <span class="text-sm font-medium text-gray-700">Family & Marriage</span>
                    </a>
                    <a href="money.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition group/item">
                        <i class="fas fa-coins text-xl text-primary w-6 text-center group-hover/item:scale-110 transition"></i>
                        <span class="text-sm font-medium text-gray-700">Money & Property</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Center: Logo -->
        <div class="flex flex-col items-center cursor-pointer" onclick="window.location.href='index.html'">
            <div class="flex items-center gap-2">
                <img src="logo.png" alt="LAW LINE" class="w-10 h-10 object-contain">
                <h1 class="text-2xl font-bold text-primary tracking-tight">LAW LINE</h1>
            </div>
            <p class="text-[10px] text-gray-500 font-medium tracking-widest uppercase mt-1">Clarity over legal confusion</p>
        </div>

        <!-- Right: Actions -->
        <div class="flex justify-end items-center gap-6">
            <a href="index.html#users" class="text-sm font-medium text-gray-600 hover:text-primary transition">By User</a>
            <a href="contact.html" class="text-sm font-medium text-gray-600 hover:text-primary transition">Contact</a>
            
            <div class="h-6 w-px bg-gray-200"></div>

            <button id="openSearchBtn" class="text-gray-500 hover:text-primary transition">
                <i class="fas fa-search text-lg"></i>
            </button>

            <div id="loginContainer">
                <button id="openLoginBtn" class="bg-primary text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-accent transition shadow-md">Sign In</button>
            </div>
        </div>
    </div>

    <!-- Mobile Header -->
    <div class="lg:hidden flex justify-between items-center px-6 py-4">
        <!-- Hamburger -->
        <button id="mobileMenuBtn" class="text-gray-700 hover:text-primary transition">
            <i class="fas fa-bars text-2xl"></i>
        </button>

        <!-- Center Logo -->
        <div class="flex items-center gap-2" onclick="window.location.href='index.html'">
            <img src="logo.png" alt="LAW LINE" class="w-8 h-8 object-contain">
            <h1 class="text-xl font-bold text-primary">LAW LINE</h1>
        </div>

        <!-- Search Icon -->
         <button id="mobileSearchBtn" class="text-gray-500">
            <i class="fas fa-search text-xl"></i>
        </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <div id="mobileMenu" class="fixed inset-0 z-40 bg-white hidden lg:hidden flex flex-col pt-20 px-6 overflow-y-auto">
        <button id="closeMobileMenu" class="absolute top-5 right-6 text-gray-500 text-2xl">✕</button>
        
        <div class="space-y-6">
            <a href="index.html" class="block text-2xl font-bold text-gray-800">Home</a>
            
            <div>
                <p class="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Themes</p>
                <div class="grid grid-cols-2 gap-4">
                    <a href="children.html" class="p-3 bg-gray-50 rounded-xl text-center"><i class="fas fa-child text-2xl mb-1 text-primary"></i><span class="block text-xs font-medium mt-1">Children</span></a>
                    <a href="women.html" class="p-3 bg-gray-50 rounded-xl text-center"><i class="fas fa-female text-2xl mb-1 text-primary"></i><span class="block text-xs font-medium mt-1">Women</span></a>
                    <a href="crimes.html" class="p-3 bg-gray-50 rounded-xl text-center"><i class="fas fa-gavel text-2xl mb-1 text-primary"></i><span class="block text-xs font-medium mt-1">Crimes</span></a>
                    <a href="police.html" class="p-3 bg-gray-50 rounded-xl text-center"><i class="fas fa-balance-scale text-2xl mb-1 text-primary"></i><span class="block text-xs font-medium mt-1">Police</span></a>
                    <a href="family.html" class="p-3 bg-gray-50 rounded-xl text-center"><i class="fas fa-home text-2xl mb-1 text-primary"></i><span class="block text-xs font-medium mt-1">Family</span></a>
                    <a href="money.html" class="p-3 bg-gray-50 rounded-xl text-center"><i class="fas fa-coins text-2xl mb-1 text-primary"></i><span class="block text-xs font-medium mt-1">Money</span></a>
                </div>
            </div>

            <hr class="border-gray-100">
            
            <a href="index.html#users" class="block text-lg font-medium text-gray-700">By User</a>
            <a href="contact.html" class="block text-lg font-medium text-gray-700">Contact Us</a>
            
            <div id="mobileLoginContainer" class="pt-4">
                <!-- Injected via basic logic below if needed, usually main login handles this -->
            </div>
        </div>
    </div>

    <!-- Site Search Modal (Injected) -->
    <div id="siteSearchModal" class="fixed inset-0 z-[60] hidden flex items-start justify-center pt-20 px-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="closeSearchOverlay"></div>
        <div class="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
            <div class="p-4 border-b border-gray-200 flex items-center gap-3">
                <i class="fas fa-search text-gray-400"></i>
                <input type="text" id="siteSearchInput" placeholder="Search for laws, rights, or topics..." class="flex-1 outline-none text-lg text-gray-700 placeholder-gray-400 h-10">
                <button id="closeSearchBtn" class="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div id="siteSearchResults" class="overflow-y-auto p-2 bg-gray-50 flex-1 min-h-[100px]">
                <p class="text-center text-gray-400 py-8">Start typing to search...</p>
            </div>
        </div>
    </div>
    `;

    const footerHTML = `
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        <!-- Col 1: About -->
        <div>
            <div class="flex items-center gap-3 mb-6">
                <!-- Footer Logo -->
                <img src="logo.png" alt="LAW LINE Logo" class="w-12 h-12 object-contain brightness-0 invert opacity-90">
                <span class="text-xl font-bold tracking-tight">LAW LINE</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed mb-6">
                Making Indian laws simple, accessible, and understandable for every citizen. 
                We provide clarity over legal confusion through verified information and AI assistance.
            </p>
            <p class="text-xs text-gray-500">© 2026 LAW LINE. All rights reserved.</p>
        </div>

        <!-- Col 2: Quick Links -->
        <div>
            <h4 class="text-white font-bold mb-6 tracking-wide text-sm uppercase">Quick Links</h4>
            <ul class="space-y-3 text-sm text-gray-400">
                <li><a href="index.html" class="hover:text-primary transition">Home</a></li>
                <li><a href="index.html#themes" class="hover:text-primary transition">Legal Themes</a></li>
                <li><a href="index.html#users" class="hover:text-primary transition">Resources by User</a></li>
                <li><a href="contact.html" class="hover:text-primary transition">Contact Us</a></li>
            </ul>
        </div>

        <!-- Col 3: Legal & Social -->
        <div>
            <h4 class="text-white font-bold mb-6 tracking-wide text-sm uppercase">Legal & Social</h4>
            <ul class="space-y-3 text-sm text-gray-400 mb-8">
                <li><a href="#" class="hover:text-primary transition">Privacy Policy</a></li>
                <li><a href="#" class="hover:text-primary transition">Terms of Service</a></li>
                <li><a href="#" class="hover:text-primary transition">Cookie Policy</a></li>
            </ul>
            <div class="flex gap-4">
                <a href="#" class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition text-white">
                    <i class="fab fa-twitter text-xs"></i>
                </a>
                <a href="#" class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition text-white">
                    <i class="fab fa-linkedin-in text-xs"></i>
                </a>
                <a href="#" class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition text-white">
                    <i class="fab fa-instagram text-xs"></i>
                </a>
            </div>
        </div>
    </div>
    `;

    const headerEl = document.getElementById('app-header');
    const footerEl = document.getElementById('app-footer');

    if (headerEl) {
        headerEl.innerHTML = headerHTML;
        headerEl.className = "sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm";
    }

    if (footerEl) {
        footerEl.innerHTML = footerHTML;
        footerEl.className = "bg-dark text-white py-16 border-t border-gray-800";
    }

    // Logic Initialization
    initInteractions();
    initSearchLogic();
}

function initInteractions() {
    // Mobile Menu
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMobileBtn = document.getElementById('closeMobileMenu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
    }
    if (closeMobileBtn && mobileMenu) {
        closeMobileBtn.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    }

    // Search Modal Open/Close
    const searchModal = document.getElementById('siteSearchModal');
    const openBtn = document.getElementById('openSearchBtn');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const closeBtn = document.getElementById('closeSearchBtn');
    const overlay = document.getElementById('closeSearchOverlay');
    const input = document.getElementById('siteSearchInput');

    const openSearch = () => {
        searchModal.classList.remove('hidden');
        setTimeout(() => input.focus(), 100);
    };

    if (openBtn) openBtn.addEventListener('click', openSearch);
    if (mobileSearchBtn) mobileSearchBtn.addEventListener('click', openSearch);

    const closeSearch = () => searchModal.classList.add('hidden');
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);
    if (overlay) overlay.addEventListener('click', closeSearch);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
            closeSearch();
        }
    });
}

function initSearchLogic() {
    const input = document.getElementById('siteSearchInput');
    const resultsContainer = document.getElementById('siteSearchResults');

    if (!input || !resultsContainer) return;

    let fuse;

    input.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        if (!window.Fuse) {
            resultsContainer.innerHTML = '<p class="text-center text-red-400 py-4">Search engine loading...</p>';
            return;
        }

        if (!fuse) {
            fuse = new window.Fuse(searchIndex, {
                keys: ['title', 'content'],
                threshold: 0.3,
                includeScore: true
            });
        }

        if (query.length < 2) {
            resultsContainer.innerHTML = '<p class="text-center text-gray-400 py-8">Start typing to search...</p>';
            return;
        }

        const results = fuse.search(query);

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="text-center text-gray-500 py-8">No results found.</p>';
            return;
        }

        resultsContainer.innerHTML = results.map(result => `
            <a href="${result.item.url}" class="block bg-white p-4 rounded-xl border border-gray-100 hover:border-primary hover:shadow-md transition mb-2 group">
                <h4 class="text-lg font-bold text-gray-800 group-hover:text-primary">${result.item.title}</h4>
                <p class="text-sm text-gray-500 line-clamp-2">${result.item.content}</p>
            </a>
        `).join('');
    });
}
