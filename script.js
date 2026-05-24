// ========== ЗАГРУЗКА ПРАВИЛ ИЗ ВНЕШНЕГО ФАЙЛА ==========
const rulesContainer = document.getElementById('rulesContent');
let originalRulesHtml = '';

async function loadRules() {
    try {
        const response = await fetch('rules-content.html');
        if (!response.ok) throw new Error('Не удалось загрузить правила');
        const html = await response.text();
        rulesContainer.innerHTML = html;
        originalRulesHtml = html;
    } catch (error) {
        rulesContainer.innerHTML = '<div class="error">Ошибка загрузки правил. Проверьте соединение.</div>';
        console.error(error);
    }
}

// ========== ПОИСК ПО ПРАВИЛАМ ==========
function highlightText(searchTerm) {
    if (!searchTerm.trim()) {
        rulesContainer.innerHTML = originalRulesHtml;
        return;
    }
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const newHtml = originalRulesHtml.replace(regex, `<span class="highlight">$1</span>`);
    rulesContainer.innerHTML = newHtml;
    const firstHighlight = rulesContainer.querySelector('.highlight');
    if (firstHighlight) firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ========== МОДАЛЬНЫЕ ОКНА (ОСОБЕННОСТИ И ФРАКЦИИ) ==========
const featuresData = {
    radiation: { title: "Радиация & Аномалии", img: "https://via.placeholder.com/500x280?text=Аномалия+и+артефакт", desc: "Зона полна смертельных аномалий. Артефакты дают баффы, но добыча опасна. Радиация требует дозиметра и антирадов." },
    world: { title: "Кастомный мир", img: "https://via.placeholder.com/500x280?text=Заброшенный+бункер", desc: "Расширенная карта: Припять, Кордон, Янтарь, секретные бункеры. Живой мир с выбросами и событиями." },
    economy: { title: "Экономика и квесты", img: "https://via.placeholder.com/500x280?text=Торговец+в+баре", desc: "Динамические цены, бартер, квесты фракций. Каждое задание влияет на репутацию." },
    dayz: { title: "DayZ-механики", img: "https://via.placeholder.com/500x280?text=Медицина+и+выживание", desc: "Переломы, кровотечения, инфекции, износ оружия. Реалистичное лечение." },
    voice: { title: "VoiceRP", img: "https://via.placeholder.com/500x280?text=Рация+и+переговоры", desc: "Рации с частотами, эффект расстояния. Эмоции через /me, /do. Строгий отыгрыш." }
};

const factionsData = {
    oksop: { name: "ОКСОП", img: "https://via.placeholder.com/500x280?text=ОКСОП", desc: "Военные, конфискуют запрещённое оружие. Дисциплина, субординация." },
    neutral: { name: "Нейтралы", img: "https://via.placeholder.com/500x280?text=Нейтралы", desc: "Помощь сталкерам, садоводство на свалке, торговля." },
    bandits: { name: "Бандиты", img: "https://via.placeholder.com/500x280?text=Бандиты", desc: "Грабежи, рэкет, контрабанда. Могут задерживать без причины." },
    sin: { name: "Грех", img: "https://via.placeholder.com/500x280?text=Грех", desc: "Религиозные фанатики, очищение Зоны. Агрессивны к чужакам." },
    duty: { name: "Долг", img: "https://via.placeholder.com/500x280?text=Долг", desc: "Защита человечества, изъятие артефактов. Строгий устав." },
    freedom: { name: "Свобода", img: "https://via.placeholder.com/500x280?text=Свобода", desc: "Анархисты, свободное изучение Зоны. Конфискуют части мутантов." },
    renegades: { name: "Ренегаты", img: "https://via.placeholder.com/500x280?text=Ренегаты", desc: "Изгои, нападают на всех. Скрываются в болотах." },
    mercs: { name: "Наёмники", img: "https://via.placeholder.com/500x280?text=Наёмники", desc: "Профессионалы за деньги. Контракты на убийство." },
    clearSky: { name: "Чистое Небо", img: "https://via.placeholder.com/500x280?text=Чистое+Небо", desc: "Учёные, исследователи. Разработка детекторов и медикаментов." },
    monolith: { name: "Монолит", img: "https://via.placeholder.com/500x280?text=Монолит", desc: "Секта, поклонение Монолиту. Фанатики, на них не действует PG." }
};
const factionOrder = ["oksop","neutral","bandits","sin","duty","freedom","renegades","mercs","clearSky","monolith"];

const modal = document.getElementById('featureModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

function showSimpleModal(key) {
    const d = featuresData[key];
    if (!d) return;
    modalTitle.textContent = d.title;
    modalBody.innerHTML = `<img class="modal-img" src="${d.img}"><p class="modal-desc">${d.desc}</p>`;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showFactionsModal() {
    modalTitle.textContent = "RP-фракции (10 группировок)";
    let html = `<div class="faction-tabs" id="factionTabs">`;
    factionOrder.forEach(k => { html += `<button class="faction-tab" data-faction="${k}">${factionsData[k].name}</button>`; });
    html += `</div><div id="factionContents">`;
    factionOrder.forEach(k => {
        let f = factionsData[k];
        html += `<div class="faction-content" data-faction-content="${k}"><img class="modal-img" src="${f.img}"><p class="modal-desc">${f.desc}</p></div>`;
    });
    html += `</div>`;
    modalBody.innerHTML = html;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    const firstTab = document.querySelector('.faction-tab');
    if (firstTab) firstTab.click();
    document.querySelectorAll('.faction-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const key = tab.getAttribute('data-faction');
            document.querySelectorAll('.faction-tab').forEach(t => t.classList.remove('active-faction'));
            tab.classList.add('active-faction');
            document.querySelectorAll('.faction-content').forEach(c => {
                if (c.getAttribute('data-faction-content') === key) c.classList.add('active-faction-content');
                else c.classList.remove('active-faction-content');
            });
        });
    });
    if (document.querySelectorAll('.faction-content').length) document.querySelectorAll('.faction-content')[0].classList.add('active-faction-content');
}

document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', () => {
        const f = card.getAttribute('data-feature');
        if (f === 'factions') showFactionsModal();
        else if (featuresData[f]) showSimpleModal(f);
    });
});

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}
document.querySelector('.close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('show')) closeModal(); });

// ========== РАДИО ПЛЕЕР ==========
const trackList = [
    { name: "Ambient Zone", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { name: "Stalker Radio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { name: "Freedom Call", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { name: "Dead City", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
];
let currentTrack = 0, audio = new Audio(trackList[0].url), isPlaying = false;
audio.volume = 0.5;
const playPause = document.getElementById('playPauseBtn'), prev = document.getElementById('prevTrack'), next = document.getElementById('nextTrack'), volSlider = document.getElementById('volumeSlider'), trackNameSpan = document.getElementById('trackName');
function updateTrack() { trackNameSpan.textContent = trackList[currentTrack].name; audio.src = trackList[currentTrack].url; if (isPlaying) audio.play().catch(e => console.log); }
function playTrack() { audio.play().then(() => { isPlaying = true; playPause.innerHTML = '<i class="fas fa-pause"></i>'; }).catch(() => { isPlaying = false; playPause.innerHTML = '<i class="fas fa-play"></i>'; }); }
function pauseTrack() { audio.pause(); isPlaying = false; playPause.innerHTML = '<i class="fas fa-play"></i>'; }
playPause.addEventListener('click', () => { isPlaying ? pauseTrack() : playTrack(); });
prev.addEventListener('click', () => { currentTrack = (currentTrack - 1 + trackList.length) % trackList.length; updateTrack(); if (isPlaying) playTrack(); else audio.src = trackList[currentTrack].url; });
next.addEventListener('click', () => { currentTrack = (currentTrack + 1) % trackList.length; updateTrack(); if (isPlaying) playTrack(); else audio.src = trackList[currentTrack].url; });
volSlider.addEventListener('input', (e) => { audio.volume = e.target.value; });
audio.addEventListener('ended', () => { next.click(); });
trackNameSpan.textContent = trackList[0].name; audio.volume = volSlider.value;

// ========== ТАБЫ, БУРГЕР, КОПИРОВАНИЕ ==========
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
function switchTab(tabId) {
    tabContents.forEach(c => c.classList.remove('active-tab'));
    document.getElementById(tabId)?.classList.add('active-tab');
    tabBtns.forEach(btn => { btn.classList.remove('active'); if (btn.getAttribute('data-tab') === tabId) btn.classList.add('active'); });
    if (tabId === 'rules' && rulesContainer.innerHTML.includes('Загрузка правил')) loadRules();
}
tabBtns.forEach(btn => { btn.addEventListener('click', () => { switchTab(btn.getAttribute('data-tab')); if (navLinks.classList.contains('active')) navLinks.classList.remove('active'); }); });
const burger = document.getElementById('burgerBtn'), navLinks = document.getElementById('navLinks');
if (burger) burger.addEventListener('click', () => navLinks.classList.toggle('active'));
const startBtn = document.getElementById('startBtn');
if (startBtn) startBtn.addEventListener('click', (e) => { e.preventDefault(); switchTab('howto'); document.getElementById('howto').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
function showToast(msg) { let existing = document.querySelector('.toast-msg'); if (existing) existing.remove(); let div = document.createElement('div'); div.className = 'toast-msg'; div.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`; document.body.appendChild(div); setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 400); }, 2500); }
const ip = 'play.nexusrp.ru';
document.getElementById('copyIpButton')?.addEventListener('click', () => { navigator.clipboard.writeText(ip); showToast('IP скопирован: ' + ip); });
document.getElementById('copyIpBtn')?.addEventListener('click', (e) => { e.preventDefault(); navigator.clipboard.writeText(ip); showToast('IP скопирован: ' + ip); });
document.getElementById('copyDiscordBtn')?.addEventListener('click', () => { navigator.clipboard.writeText('https://discord.gg/nexusrp'); showToast('Приглашение в Discord скопировано!'); });
if (!document.querySelector('.tab-btn.active')) switchTab('about');

// ========== ПОДКЛЮЧЕНИЕ ПОИСКА ПОСЛЕ ЗАГРУЗКИ ПРАВИЛ ==========
const searchInput = document.getElementById('rulesSearchInput');
const searchBtn = document.getElementById('searchRulesBtn');
const clearBtn = document.getElementById('clearSearchBtn');
searchBtn.addEventListener('click', () => { if (originalRulesHtml) highlightText(searchInput.value); });
clearBtn.addEventListener('click', () => { searchInput.value = ''; if (originalRulesHtml) rulesContainer.innerHTML = originalRulesHtml; });
searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && originalRulesHtml) highlightText(searchInput.value); });

// Изначально правила не загружены, загрузим при первом открытии вкладки (уже в switchTab)