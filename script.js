// ==========================================
// Menorca Itinerary Application Logic
// ==========================================

// --- 1. GLOBAL STATE ---
let activeDay = 1;
let map;
let currentWind = 'none';
const markers = [];
const completedDays = JSON.parse(localStorage.getItem('minorca_completed_days')) || [];
const visitedBeaches = JSON.parse(localStorage.getItem('minorca_visited_beaches')) || [];
const totalDays = 8;

// --- PIN LOCK PROTECTION (SHA-256 Encrypted) ---
// SHA-256 Hash of PIN "Minorca2026": e09c233fcad9bae01cef1ec749fb92c61d2f762bb5587f46f71c130761277398
const TARGET_PIN_HASH = "e09c233fcad9bae01cef1ec749fb92c61d2f762bb5587f46f71c130761277398";

const hashPIN = async (pin) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const checkLockStatus = () => {
    const isUnlocked = localStorage.getItem('minorca_authenticated') === 'true';
    const lockScreen = document.getElementById('lock-screen');
    if (isUnlocked && lockScreen) {
        lockScreen.classList.add('unlocked');
    }
};

window.handleUnlock = async (e) => {
    e.preventDefault();
    const pinInput = document.getElementById('pin-input');
    const lockError = document.getElementById('lock-error');
    const enteredPin = pinInput.value.trim();

    const enteredHash = await hashPIN(enteredPin);
    if (enteredHash === TARGET_PIN_HASH) {
        localStorage.setItem('minorca_authenticated', 'true');
        document.getElementById('lock-screen').classList.add('unlocked');
        lockError.style.display = 'none';
    } else {
        lockError.style.display = 'block';
        pinInput.value = '';
        pinInput.focus();
    }
};

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    checkLockStatus();
    initTheme();
    initChecklists();
    renderBeachesCatalog();
    renderDayTimeline(activeDay);
    initMap();
    setupEventListeners();
    updateProgress();
    updateWindRecommendation();
    fetchLiveWindData();
});

// --- 3. THEME CONTROLLER ---
const initTheme = () => {
    const theme = localStorage.getItem('minorca_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
};

const updateThemeIcon = (theme) => {
    const icon = document.getElementById('theme-icon');
    icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    lucide.createIcons({ attrs: { id: 'theme-icon' }, nameList: ['sun', 'moon'] });
};

const toggleTheme = () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('minorca_theme', next);
    updateThemeIcon(next);
    
    if (map) {
        map.eachLayer(layer => { if (layer instanceof L.TileLayer) map.removeLayer(layer); });
        L.tileLayer(next === 'dark' 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; contributors &copy; CARTO'
        }).addTo(map);
    }
};

// --- 4. MAP CONTROLLER ---
const initMap = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const tileUrl = isDark 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    map = L.map('map', { center: [39.95, 4.02], zoom: 10, scrollWheelZoom: false });
    L.tileLayer(tileUrl, { attribution: '&copy; OpenStreetMap &copy; CARTO' }).addTo(map);

    addMarker(hotelCoords, "Hotel RV Club Menorca", "hotel", "#d00000", `
        <div class="map-popup">
            <h4>RVHotels Sea Club Menorca</h4>
            <p>La tua base per l'intera vacanza</p>
            <span class="popup-tag">Hotel</span>
        </div>
    `);

    addMarker(airportCoords, "Aeroporto di Minorca (MAH)", "airport", "#3a0ca3", `
        <div class="map-popup">
            <h4>Aeroporto di Minorca (MAH)</h4>
            <p>Arrivo: 23 Lug ore 17:30<br>Partenza: 30 Lug ore 18:00</p>
        </div>
    `);

    beaches.forEach(b => {
        const color = visitedBeaches.includes(b.id) ? "#2ec4b6" : "#028090";
        addMarker(b.coords, b.name, `beach-${b.id}`, color, `
            <div class="map-popup">
                <h4>${b.name}</h4>
                <p>${b.type} • ${b.time}</p>
                <button class="popup-focus-btn" onclick="focusBeachCard('${b.id}')">Dettagli Spiaggia</button>
            </div>
        `);
    });

    const sights = [
        { name: "Pont d'en Gil (Arco Naturale)", coords: [40.0108, 3.7925], desc: "Spettacolare arco di roccia per il tramonto." },
        { name: "Ciutadella de Menorca", coords: [40.0022, 3.8407], desc: "Città storica, porto e cattedrale." },
        { name: "Fornells", coords: [40.0573, 4.1311], desc: "Villaggio di pescatori famoso per la zuppa di aragosta." },
        { name: "Faro di Cavalleria", coords: [40.0883, 4.0911], desc: "Faro maestoso su scogliere di 90m nel nord." },
        { name: "Faro di Favàritx", coords: [39.9983, 4.2655], desc: "Faro in uno scenario lunare di lavagna scura." }
    ];

    sights.forEach(s => {
        addMarker(s.coords, s.name, "sightseeing", "#f0a500", `<div class="map-popup"><h4>${s.name}</h4><p>${s.desc}</p></div>`);
    });

    focusMapView(itinerary[1].mapFocus, itinerary[1].mapZoom, "Hotel & Dintorni");
};

const addMarker = (coords, title, id, color, popupHtml) => {
    const icon = L.divIcon({
        className: `custom-marker-wrapper marker-id-${id}`,
        html: `<div class="map-marker" style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });
    const marker = L.marker(coords, { icon, title }).addTo(map).bindPopup(popupHtml);
    markers.push({ id, marker });
};

const updateMarkerColor = (id, color) => {
    const mObj = markers.find(m => m.id === `beach-${id}`);
    if (mObj) {
        const icon = L.divIcon({
            className: `custom-marker-wrapper marker-id-beach-${id}`,
            html: `<div class="map-marker" style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35); transform: scale(1.15);"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });
        mObj.marker.setIcon(icon);
    }
};

const focusMapView = (coords, zoom, label) => {
    if (map) {
        map.setView(coords, zoom, { animate: true, duration: 1.2 });
        document.getElementById('map-target-name').innerText = label;
    }
};

window.openMarkerPopup = (id) => {
    const mObj = markers.find(m => m.id === id || m.id === `beach-${id}`);
    if (mObj && map) {
        map.setView(mObj.marker.getLatLng(), 13);
        mObj.marker.openPopup();
    }
};

// --- 5. TIMELINE & ACCORDION RENDERER ---
const renderDayTimeline = (dayNum) => {
    const dayData = itinerary[dayNum];
    if (!dayData) return;

    const panel = document.getElementById('day-detail-panel');
    panel.style.opacity = 0;

    setTimeout(() => {
        const isCompleted = completedDays.includes(dayNum);
        let scheduleHtml = '';

        dayData.schedule.forEach(item => {
            let metaHtml = '';
            if (item.type === 'scooter') {
                metaHtml = `<span class="meta-tag scooter"><i data-lucide="bike"></i> Scooter 125cc</span>`;
            } else if (item.type === 'beach' && item.beachId) {
                const b = beaches.find(b => b.id === item.beachId);
                metaHtml = `
                    <span class="meta-tag beach"><i data-lucide="palmtree"></i> Spiaggia</span>
                    <span class="meta-tag scooter"><i data-lucide="navigation"></i> ${b.time}</span>
                `;
            }

            const mapButton = item.coords 
                ? `<button class="map-view-btn" onclick="focusLocation([${item.coords.join(',')}], 14, '${item.title.replace(/'/g, "\\'")}')"><i data-lucide="map-pin"></i> Vedi su Mappa</button>`
                : (item.beachId ? `<button class="map-view-btn" onclick="openMarkerPopup('beach-${item.beachId}')"><i data-lucide="map-pin"></i> Trova Spiaggia</button>` : '');

            scheduleHtml += `
                <li class="schedule-item">
                    <div class="schedule-dot"></div>
                    <span class="schedule-time">${item.time}</span>
                    <div class="schedule-content">
                        <h4>${item.title}</h4>
                        <p>${item.desc}</p>
                        <div class="schedule-meta">${metaHtml}</div>
                        ${mapButton}
                    </div>
                </li>
            `;
        });

        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">
                    <h3>Giorno ${dayNum}: ${dayData.title}</h3>
                    <div class="date">${dayData.date}</div>
                </div>
                <button class="day-completed-btn ${isCompleted ? 'completed' : ''}" id="complete-day-btn-${dayNum}" onclick="toggleDayCompleted(${dayNum})">
                    <i data-lucide="${isCompleted ? 'check-circle' : 'circle'}"></i>
                    <span>${isCompleted ? 'Completato' : 'Segna come completato'}</span>
                </button>
            </div>
            <ul class="day-schedule">${scheduleHtml}</ul>
        `;

        lucide.createIcons();
        panel.style.opacity = 1;
    }, 150);
};

window.focusLocation = (coords, zoom, label) => {
    focusMapView(coords, zoom, label);
    const found = markers.find(m => {
        const ll = m.marker.getLatLng();
        return Math.abs(ll.lat - coords[0]) < 0.005 && Math.abs(ll.lng - coords[1]) < 0.005;
    });
    if (found) found.marker.openPopup();
};

// --- 6. BEACH CATALOG RENDERER ---
const renderBeachesCatalog = () => {
    const catalog = document.getElementById('beaches-catalog');
    let html = '';

    beaches.forEach(b => {
        const isVisited = visitedBeaches.includes(b.id);
        const classTag = b.tags[0].includes('Bianca') ? 'white-sand' : (b.tags[0].includes('Rossa') ? 'red-sand' : (b.tags[0].includes('Piattaforme') ? 'platforms' : 'wild'));
        const tagsHtml = b.tags.map(t => `<span class="beach-tag ${classTag}">${t}</span>`).join('');

        html += `
            <div class="beach-card" id="beach-card-${b.id}">
                <div class="beach-img-wrapper" onclick="openImageModal('${b.img}', '${b.name.replace(/'/g, "\\'")}', '${b.desc.replace(/'/g, "\\'")}')">
                    <span class="beach-badge">${b.type}</span>
                    <button class="beach-favorite-btn ${isVisited ? 'visited' : ''}" onclick="toggleBeachVisited('${b.id}', event)">
                        <i data-lucide="${isVisited ? 'check-square' : 'square'}"></i>
                    </button>
                    <img src="${b.img}" alt="${b.name}" class="beach-img" loading="lazy">
                </div>
                <div class="beach-info">
                    <div class="beach-title">
                        <h3>${b.name}</h3>
                        <span class="beach-distance"><i data-lucide="navigation" style="width:12px;height:12px;display:inline;"></i> ${b.time.split(' ')[0]} min</span>
                    </div>
                    <p class="beach-desc">${b.desc}</p>
                    <div class="beach-tags">${tagsHtml}</div>
                    <div class="beach-footer">
                        <span class="beach-difficulty"><i data-lucide="footprints"></i> Cammino: ${b.difficulty.split(' ')[0]}</span>
                        <a href="#itinerary-section" class="beach-visit-link" onclick="goToDay(${b.day})">Vedi Giorno ${b.day} <i data-lucide="arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `;
    });
    catalog.innerHTML = html;
    lucide.createIcons();
};

window.focusBeachCard = (beachId) => {
    const card = document.getElementById(`beach-card-${beachId}`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.transform = "scale(1.03) translateY(-10px)";
        setTimeout(() => { card.style.transform = ""; }, 1500);
    }
};

window.goToDay = (dayNum) => {
    activeDay = dayNum;
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.classList.toggle('active', parseInt(tab.getAttribute('data-day')) === dayNum);
        tab.setAttribute('aria-selected', parseInt(tab.getAttribute('data-day')) === dayNum ? 'true' : 'false');
    });
    
    const tab = document.getElementById(`tab-day-${dayNum}`);
    if (tab) tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    
    renderDayTimeline(dayNum);
    focusMapView(itinerary[dayNum].mapFocus, itinerary[dayNum].mapZoom, `Giorno ${dayNum}: ${itinerary[dayNum].title}`);
    updateWindRecommendation();
};

// --- 7. STATE PERSISTENCE & PROGRESS ---
window.toggleDayCompleted = (dayNum) => {
    const idx = completedDays.indexOf(dayNum);
    if (idx === -1) completedDays.push(dayNum);
    else completedDays.splice(idx, 1);
    
    localStorage.setItem('minorca_completed_days', JSON.stringify(completedDays));
    
    const btn = document.getElementById(`complete-day-btn-${dayNum}`);
    if (btn) {
        const isComp = completedDays.includes(dayNum);
        btn.classList.toggle('completed', isComp);
        btn.innerHTML = `<i data-lucide="${isComp ? 'check-circle' : 'circle'}"></i> <span>${isComp ? 'Completato' : 'Segna come completato'}</span>`;
        lucide.createIcons();
    }
    updateProgress();
};

window.toggleBeachVisited = (beachId, event) => {
    if (event) event.stopPropagation();
    const idx = visitedBeaches.indexOf(beachId);
    if (idx === -1) {
        visitedBeaches.push(beachId);
        updateMarkerColor(beachId, "#2ec4b6");
    } else {
        visitedBeaches.splice(idx, 1);
        updateMarkerColor(beachId, "#028090");
    }
    localStorage.setItem('minorca_visited_beaches', JSON.stringify(visitedBeaches));
    renderBeachesCatalog();
    updateProgress();
};

const updateProgress = () => {
    document.getElementById('completed-days-count').innerText = completedDays.length;
    document.getElementById('visited-beaches-count').innerText = visitedBeaches.length;
    const progress = ((completedDays.length / totalDays) * 50) + ((visitedBeaches.length / beaches.length) * 50);
    document.getElementById('trip-progress').style.width = `${progress}%`;
};

// --- 8. CHECKLISTS ---
const initChecklists = () => {
    ['beach-checklist', 'docs-checklist'].forEach(cid => {
        const checkboxes = document.getElementById(cid).querySelectorAll('.todo-checkbox');
        checkboxes.forEach((cb, idx) => {
            const key = `minorca_todo_${cid}_${idx}`;
            cb.checked = localStorage.getItem(key) === 'true';
            cb.addEventListener('change', () => localStorage.setItem(key, cb.checked));
        });
    });
};

// --- 9. LIGHTBOX MODAL ---
window.openImageModal = (src, title, desc) => {
    const modal = document.getElementById('image-modal');
    document.getElementById('modal-img').src = src;
    document.getElementById('modal-caption').innerHTML = `<strong>${title}</strong><br><span style="font-size: 0.88rem; color: #cbd5e1;">${desc}</span>`;
    modal.style.display = "block";
    modal.setAttribute('aria-hidden', 'false');
};

const closeImageModal = () => {
    const modal = document.getElementById('image-modal');
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
};

// --- 10. EVENT LISTENERS ---
const setupEventListeners = () => {
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.addEventListener('click', () => goToDay(parseInt(tab.getAttribute('data-day'))));
    });
    
    // Wind selector buttons listeners
    document.querySelectorAll('.wind-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.wind-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentWind = btn.getAttribute('data-wind');
            updateWindRecommendation();
        });
    });

    document.getElementById('image-modal').addEventListener('click', (e) => {
        if (e.target.id === 'image-modal' || e.target.id === 'modal-close') closeImageModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeImageModal(); });
};

// --- 11. WIND OPTIMIZER RECOMMENDATIONS ---
const updateWindRecommendation = () => {
    const box = document.getElementById('wind-recommendation-box');
    if (!box) return;

    const dayData = itinerary[activeDay];
    if (!dayData) return;

    const beachScheduleItem = dayData.schedule.find(item => item.type === 'beach');
    if (!beachScheduleItem || !beachScheduleItem.beachId) {
        if (currentWind === 'none') {
            box.innerHTML = `<strong>💨 Vento debole</strong>: Oggi non è prevista nessuna spiaggia in programma. Ottimo per visitare l'interno dell'isola o le città!`;
        } else if (currentWind === 'north') {
            box.innerHTML = `<strong>🌬️ Tramontana (Nord)</strong>: Oggi soffia vento da Nord. Le spiagge a nord avranno onde e vento forte. Consigliamo di rimanere al coperto o girare a Sud.`;
        } else {
            box.innerHTML = `<strong>🌬️ Scirocco/Ostro (Sud)</strong>: Vento da Sud attivo. La costa nord sarà calmissima e limpida, ideale per una passeggiata a Fornells o Favàritx!`;
        }
        return;
    }

    const beach = beaches.find(b => b.id === beachScheduleItem.beachId);
    if (!beach) return;

    const isSouthBeach = beach.type.includes('South');
    const isNorthBeach = beach.type.includes('North');

    let html = '';
    if (currentWind === 'none') {
        html = `<strong>🍃 Brezza leggera o calma</strong>: Le condizioni meteo sono perfette! La spiaggia del giorno, <strong>${beach.name}</strong> (${beach.type}), sarà calmissima con acque trasparenti e ideali per lo snorkeling.`;
    } else if (currentWind === 'north') {
        if (isSouthBeach) {
            html = `<strong>✅ Ottima scelta! Tramontana (Nord) attiva</strong>: Soffiando da Nord, il vento è bloccato dalle scogliere. La spiaggia di oggi (<strong>${beach.name}</strong>, al Sud) sarà piatta come una tavola, calda e cristallina!`;
        } else if (isNorthBeach) {
            html = `<strong>⚠️ Sconsigliata! Tramontana (Nord) attiva</strong>: La spiaggia di oggi (<strong>${beach.name}</strong>) è esposta a Nord. Troverai mare mosso, forte vento e possibili meduse. <br>💡 <strong>Alternativa del giorno</strong>: Oggi prendi lo scooter e vai a Sud (es. <strong>Cala Turqueta</strong> o <strong>Cala Mitjana</strong>)!`;
        } else {
            html = `<strong>💨 Tramontana (Nord) attiva</strong>: La spiaggia di oggi è <strong>${beach.name}</strong> (Ovest). La baia è parzialmente riparata ma mossa. Se cerchi acqua calma e sabbia fine, oggi dirigiti verso le spiagge del <strong>Sud</strong>!`;
        }
    } else if (currentWind === 'south') {
        if (isNorthBeach) {
            html = `<strong>✅ Ottima scelta! Scirocco/Ostro (Sud) attivo</strong>: Il vento soffia da Sud. Le spiagge a Nord (es. <strong>${beach.name}</strong>) saranno riparate, con acque limpide e piatte. Perfetto per godersi la sabbia rossa!`;
        } else if (isSouthBeach) {
            html = `<strong>⚠️ Sconsigliata! Scirocco/Ostro (Sud) attivo</strong>: La spiaggia di oggi (<strong>${beach.name}</strong>, al Sud) sarà mossa con vento e meduse. <br>💡 <strong>Alternativa del giorno</strong>: Oggi sposta lo scooter a Nord ed esplora <strong>Cala Pregonda</strong> o <strong>Cala Algaiarens</strong>!`;
        } else {
            html = `<strong>💨 Scirocco/Ostro (Sud) attivo</strong>: La spiaggia di oggi è <strong>${beach.name}</strong> (Ovest). È in buone condizioni e riparata, ma se desideri spiagge vergini, oggi le calette del <strong>Nord</strong> saranno straordinarie!`;
        }
    }
    box.innerHTML = html;
};

// --- 12. AUTOMATIC LIVE WEATHER & WIND FETCH (Open-Meteo API) ---
const setWindDirection = (windType) => {
    currentWind = windType;
    document.querySelectorAll('.wind-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-wind') === windType);
    });
    updateWindRecommendation();
};

const fetchLiveWindData = async () => {
    const statusSpan = document.getElementById('live-wind-status');
    if (!statusSpan) return;

    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=39.95&longitude=4.02&current_weather=true');
        const data = await response.json();

        if (data && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const speed = Math.round(data.current_weather.windspeed);
            const dir = data.current_weather.winddirection;

            let cardinal = 'Est';
            if (dir >= 337.5 || dir < 22.5) cardinal = 'Nord (Tramontana)';
            else if (dir >= 22.5 && dir < 67.5) cardinal = 'Nord-Est';
            else if (dir >= 67.5 && dir < 112.5) cardinal = 'Est';
            else if (dir >= 112.5 && dir < 157.5) cardinal = 'Sud-Est';
            else if (dir >= 157.5 && dir < 202.5) cardinal = 'Sud (Scirocco/Ostro)';
            else if (dir >= 202.5 && dir < 247.5) cardinal = 'Sud-Ovest';
            else if (dir >= 247.5 && dir < 292.5) cardinal = 'Ovest';
            else if (dir >= 292.5 && dir < 337.5) cardinal = 'Nord-Ovest';

            statusSpan.innerHTML = `LIVE METEO MINORCA: <strong>${temp}°C</strong> • Vento <strong>${cardinal}</strong> (${speed} km/h, ${dir}°)`;

            // Automatically set recommendation according to live wind direction
            if (speed < 8) {
                setWindDirection('none');
            } else if (dir >= 292.5 || dir <= 67.5) {
                setWindDirection('north');
            } else if (dir >= 112.5 && dir <= 247.5) {
                setWindDirection('south');
            } else {
                setWindDirection('none');
            }
        }
    } catch (err) {
        if (statusSpan) {
            statusSpan.innerHTML = `Meteo live non disponibile (seleziona manualmente il vento)`;
        }
    }
};
