// ------------------------------
// LOAD GAME & APP JSON FILES
// ------------------------------

let gameData = [];
let appData = [];
let themeData = [
    {
        id: 'indigo',
        name: 'Deep Indigo',
        accent: '#6366f1',
        secondary: '#38bdf8',
        background: '#040816',
        sidebarBg: '#0f172a',
        cardBg: '#1e293b',
        textColor: '#cbd5e1',
        textColorRgb: '203, 213, 225'
    },
    {
        id: 'green',
        name: 'Cyber Green',
        accent: '#10b981',
        secondary: '#34d399',
        background: '#0a0a0a',
        sidebarBg: '#1c1c1c',
        cardBg: '#2d2d2d',
        textColor: '#ccffcc',
        textColorRgb: '204, 255, 204'
    },
    {
        id: 'white',
        name: 'Arctic White',
        accent: '#3b82f6',
        secondary: '#2563eb',
        background: '#f8fafc',
        sidebarBg: '#ffffff',
        cardBg: '#e2e8f0',
        textColor: '#1e293b',
        textColorRgb: '30, 41, 59'
    },
    {
        id: 'red',
        name: 'Crimson Surge',
        accent: '#ef4444',
        secondary: '#f87171',
        background: '#0a0a0a',
        sidebarBg: '#1c0a0a',
        cardBg: '#2d1414',
        textColor: '#fef2f2',
        textColorRgb: '254, 242, 242'
    }
];

let currentThemeId = localStorage.getItem('currentTheme') || 'indigo';

function loadGameData() {
    return fetch("games.json")
        .then(res => res.json())
        .then(data => {
            gameData = data;
            renderGames();
            renderFeaturedGames();
        })
        .catch(err => console.error("Error loading games.json:", err));
}

function loadAppData() {
    return fetch("apps.json")
        .then(res => res.json())
        .then(data => {
            appData = data;
            renderApps();
        })
        .catch(err => console.error("Error loading apps.json:", err));
}


// ------------------------------
// TAB HANDLING
// ------------------------------

function showTab(tabId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.classList.remove('active');
    });

    document.getElementById(tabId).style.display = 'block';
    document.getElementById(`nav-${tabId}`).classList.add('active');

    if (tabId === "home") {
        renderFeaturedGames();
    }
}


// ------------------------------
// RENDERING FUNCTIONS
// ------------------------------

function renderFeaturedGames() {
    const container = document.getElementById("home");
    container.innerHTML = `
        <h1 class="text-4xl font-bold mb-6">Featured Games</h1>
        <div id="featured-games-list" class="grid grid-cols-2 md:grid-cols-4 gap-6"></div>
    `;

    const list = document.getElementById("featured-games-list");
    list.innerHTML = gameData
        .filter(g => g.featured)
        .map(g => `
            <div class="game-card p-4 rounded-xl cursor-pointer" onclick="openIframeModal('${g.url}', '${g.title}')">
                <img src="https://placehold.co/150x150/${g.iconUrl}" class="rounded-lg mb-3" />
                <div class="text-lg font-semibold">${g.title}</div>
                <div class="text-sm opacity-70">${g.category}</div>
            </div>
        `)
        .join("");
}

function renderGames() {
    const container = document.getElementById("games");
    container.innerHTML = `
        <h1 class="text-4xl font-bold mb-4">All Games</h1>
        <input type="text" id="game-search" class="dashboard-input w-full p-3 mb-8 rounded-xl" 
            placeholder="Search games..." onkeyup="filterCards(this, 'game-list')" />
        <div id="game-list" class="grid grid-cols-2 md:grid-cols-5 gap-6"></div>
    `;

    const list = document.getElementById("game-list");
    list.innerHTML = gameData
        .map(g => `
            <div class="game-card p-3 rounded-xl text-center cursor-pointer" data-title="${g.title}" 
                onclick="openIframeModal('${g.url}', '${g.title}')">
                <img src="https://placehold.co/150/${g.iconUrl}" class="rounded-lg mb-2"/>
                <div class="text-lg font-semibold">${g.title}</div>
                <div class="text-xs opacity-70">${g.category}</div>
            </div>
        `)
        .join("");
}

function renderApps() {
    const container = document.getElementById("apps");
    container.innerHTML = `
        <h1 class="text-4xl font-bold mb-4">Utility Apps</h1>
        <input type="text" id="app-search" class="dashboard-input w-full p-3 mb-8 rounded-xl" 
            placeholder="Search apps..." onkeyup="filterCards(this, 'app-list')" />
        <div id="app-list" class="grid grid-cols-2 md:grid-cols-5 gap-6"></div>
    `;

    const list = document.getElementById("app-list");
    list.innerHTML = appData
        .map(a => `
            <div class="game-card p-3 rounded-xl text-center cursor-pointer" data-title="${a.title}" 
                onclick="openIframeModal('${a.url}', '${a.title}')">
                <img src="https://placehold.co/150/${a.iconUrl}" class="rounded-lg mb-2"/>
                <div class="text-lg font-semibold">${a.title}</div>
                <div class="text-xs opacity-70">${a.category}</div>
            </div>
        `)
        .join("");
}


// ------------------------------
// FILTERING
// ------------------------------

function filterCards(input, containerId) {
    const filter = input.value.toUpperCase();
    const container = document.getElementById(containerId);

    [...container.children].forEach(item => {
        const title = item.getAttribute("data-title").toUpperCase();
        item.style.display = title.includes(filter) ? "" : "none";
    });
}


// ------------------------------
// THEME SYSTEM
// ------------------------------

function renderThemes() {
    const container = document.getElementById("settings");
    container.innerHTML = `
        <h1 class="text-4xl font-bold mb-6">Settings</h1>
        <h2 class="text-2xl font-semibold mb-4">Themes</h2>
        <div id="theme-list" class="flex gap-6 flex-wrap"></div>
    `;

    const list = document.getElementById("theme-list");

    list.innerHTML = themeData.map(theme => `
        <div class="theme-swatch w-20 h-20 rounded-xl shadow-xl cursor-pointer flex items-center justify-center"
            id="theme-swatch-${theme.id}" style="background:${theme.sidebarBg}"
            onclick="applyTheme('${theme.id}')">
            <div class="w-8 h-8 rounded-full" style="background:${theme.accent}"></div>
        </div>
    `).join("");

    document
        .getElementById(`theme-swatch-${currentThemeId}`)
        ?.classList.add("active");
}

function applyTheme(id) {
    const t = themeData.find(x => x.id === id);
    if (!t) return;

    document.documentElement.style.setProperty("--theme-background", t.background);
    document.documentElement.style.setProperty("--theme-sidebar-bg", t.sidebarBg);
    document.documentElement.style.setProperty("--theme-card-bg", t.cardBg);
    document.documentElement.style.setProperty("--theme-text-color", t.textColor);
    document.documentElement.style.setProperty("--theme-text-color-rgb", t.textColorRgb);
    document.documentElement.style.setProperty("--theme-accent", t.accent);
    document.documentElement.style.setProperty("--theme-secondary-accent", t.secondary);

    document.querySelectorAll(".theme-swatch").forEach(s => s.classList.remove("active"));
    document.getElementById(`theme-swatch-${id}`).classList.add("active");

    localStorage.setItem("currentTheme", id);
}


// ------------------------------
// MODAL / IFRAME HANDLING
// ------------------------------

function openIframeModal(url, title) {
    document.getElementById("modal-title").textContent = title;
    document.body.style.overflow = "hidden";
    document.getElementById("iframe-modal").style.display = "block";

    const iframe = document.getElementById("game-iframe");
    iframe.src = url;
}

function closeIframeModal() {
    document.getElementById("iframe-modal").style.display = "none";
    document.getElementById("game-iframe").src = "";
    document.body.style.overflow = "auto";
}


// ------------------------------
// INITIALIZE
// ------------------------------

window.onload = () => {
    renderThemes();
    applyTheme(currentThemeId);

    showTab("home");

    loadGameData();
    loadAppData();
};
