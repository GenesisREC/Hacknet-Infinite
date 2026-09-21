const gameState = {
    localUser: 'user',
    localPass: '1234',
    setupComplete: false,
    currentIP: null, currentServer: null, ram: 0, maxRam: 1.2,
    traceInterval: null, traceTime: 0, isConnected: false,
    isAuthenticated: false,
    netmapOpen: false, isDeleting: false, isGameOver: false,
    isDownloading: false,
    quickTraceActive: false,
    traceSpeedMult: 1,
    ramUpgradeLevel: 0,
    servers: [], runningProcesses: [],
    hackedServers: [],
    lastKnownTier: 0,
    scanning: false, scanStartTime: 0, scanProgress: 0,
    scanLupaX: 0, scanLupaY: 0, scanVX: 0, scanVY: 0,
    scanTargetX: 0, scanTargetY: 0, scanTrail: [],
    scanDiscoverOrder: [], scanDiscoveredCount: 0, scanProcId: null,
    netmapNodes: [],
    netmapServerNodes: [],
    netmapBounds: null,
    netmapCamX: 0, netmapCamY: 0,
    netmapDragging: false, netmapDragStartX: 0, netmapDragStartY: 0,
    netmapDragCamStartX: 0, netmapDragCamStartY: 0, netmapDragMoved: false,
    money: 0,
    marketAccount: null,
    marketSession: false,
    inMarket: false,
    connectOverlayOpen: false,
    pendingReset: false,
    marketFormMode: 'login',
    hacknetFormMode: 'login',
    gomailFormMode: 'login',
    wallbreakerObtained: false,
    wallbreakerApp: null,
    gamePhase: 'normal',
    lastChanceTimer: null,
    lastChanceEventTimer: null,
    lastChanceTimeLeft: 0,
    lastChanceServer: null,
    lastChanceTargetPath: null,

    // ==== TUTORIAL ====
    tutorialOpen: false,

    // ==== NEWS ====
    newsOpen: false,
    inNews: false,
    newsTab: 'latest',
    newsLog: [],
    newsCounter: 0,
    
    // ==== ANTI-DUPLICADOS (flavor) ====
    usedFlavorIds: [],

      // ==== ANTI-DUPLICADOS ====
    downloadedFileIds: [],

    // ==== MISIONES ====
    missionAccount: null,
    gomailAccount: null,
    gomailLinked: false,
    hacknetSession: false,
    gomailSession: false,
    inHacknet: false,
    inGomail: false,
    gomailInbox: [],
    missionsAvailable: [],
    missionsActive: [],
    missionsCompleted: [],
    lastMissionSpawn: 0,
    missionCounter: 0,

    // ==== HARDWARE ====
    hardware: {
        cpu:     { level: 0, mult: 1.0,  label: 'Base Dual-Core 2.4GHz' },
        antenna: { level: 0, range: 1.0, label: 'Antena integrada' }
    },

    tools: [
        { name: 'ssh_crack.exe', v: 1.0, ram: 1.0, service: 'SSH' },
        { name: 'sql_crack.exe', v: 1.0, ram: 0.9, service: 'SQL' },
        { name: 'http_crack.exe', v: 1.0, ram: 0.8, service: 'HTTP' }
    ]
};

let lastProcessSignature = '';
let currentProcessPage = 0;
let commandHistory = [];
let historyIndex = -1;
let suggestions = [];
let suggestionIndex = -1;
let isSuggestionOpen = false;
let netmapAnimFrameId = null;

let localFS, remoteFS;
let localCWD = '/home/user';
let remoteCWD = '/home/user';

// ============================================================
// AUDIO BASE
// ============================================================
let audioCtx = null;

window._userHasInteracted = false;
['click', 'keydown', 'mousedown', 'touchstart', 'pointerdown'].forEach(evt => {
    document.addEventListener(evt, () => {
        window._userHasInteracted = true;
        if (!audioCtx) {
            try {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (Ctx) {
                    audioCtx = new Ctx();
                    if (audioCtx.state === 'suspended') audioCtx.resume();
                }
            } catch(e) {}
        }
    }, { once: true, capture: true });
});

function initAudio() {
    if (!audioCtx) {
        if (!window._userHasInteracted) return;
        try {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) audioCtx = new Ctx();
        } catch(e) { return; }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        try { audioCtx.resume(); } catch(e) {}
    }
}
function playTone(freq, duration, type, volume, slideTo) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type || 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, audioCtx.currentTime + duration);
        const v = volume !== undefined ? volume : 0.04;
        gain.gain.setValueAtTime(v, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
}
function soundKeyClick() { playTone(700 + Math.random() * 250, 0.018, 'square', 0.012); }
function soundCommandEnter() { playTone(900, 0.04, 'square', 0.025, 1200); }
function soundError() { playTone(180, 0.14, 'sawtooth', 0.035, 90); }
function soundSuccess() {
    playTone(700, 0.06, 'sine', 0.04, 1000);
    setTimeout(() => playTone(1100, 0.09, 'sine', 0.035, 1400), 70);
}
function soundMissionComplete() {
    [523, 659, 783, 1046].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.2, 'sine', 0.05), i * 80);
    });
}
function soundMissionAccepted() { playTone(660, 0.08, 'square', 0.03, 990); }
function soundCrackerDrop() {
    playTone(800, 0.05, 'square', 0.03, 1400);
    setTimeout(() => playTone(1400, 0.12, 'sine', 0.04), 60);
}

let scannerOsc = null, scannerGain = null, scannerLFO = null, scannerLFOGain = null, scannerSubOsc = null, scannerSubGain = null;
function soundScanStart() {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.055, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.28);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}
}
function startScannerSound() {
    if (!audioCtx || scannerOsc) return;
    try {
        scannerOsc = audioCtx.createOscillator(); scannerGain = audioCtx.createGain();
        scannerLFO = audioCtx.createOscillator(); scannerLFOGain = audioCtx.createGain();
        scannerOsc.type = 'sine'; scannerOsc.frequency.value = 620;
        scannerLFO.type = 'triangle'; scannerLFO.frequency.value = 1.6;
        scannerLFOGain.gain.value = 320;
        scannerLFO.connect(scannerLFOGain); scannerLFOGain.connect(scannerOsc.frequency);
        scannerGain.gain.setValueAtTime(0, audioCtx.currentTime);
        scannerGain.gain.linearRampToValueAtTime(0.022, audioCtx.currentTime + 0.25);
        scannerOsc.connect(scannerGain); scannerGain.connect(audioCtx.destination);
        scannerSubOsc = audioCtx.createOscillator(); scannerSubGain = audioCtx.createGain();
        scannerSubOsc.type = 'sine'; scannerSubOsc.frequency.value = 90;
        scannerSubGain.gain.setValueAtTime(0, audioCtx.currentTime);
        scannerSubGain.gain.linearRampToValueAtTime(0.012, audioCtx.currentTime + 0.3);
        scannerSubOsc.connect(scannerSubGain); scannerSubGain.connect(audioCtx.destination);
        scannerOsc.start(); scannerLFO.start(); scannerSubOsc.start();
    } catch(e) {}
}
function stopScannerSound() {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    try {
        if (scannerGain) { scannerGain.gain.cancelScheduledValues(t); scannerGain.gain.setValueAtTime(scannerGain.gain.value, t); scannerGain.gain.linearRampToValueAtTime(0.0001, t + 0.25); }
        if (scannerSubGain) { scannerSubGain.gain.cancelScheduledValues(t); scannerSubGain.gain.setValueAtTime(scannerSubGain.gain.value, t); scannerSubGain.gain.linearRampToValueAtTime(0.0001, t + 0.25); }
    } catch(e) {}
    const oscRef = scannerOsc, lfoRef = scannerLFO, subRef = scannerSubOsc;
    scannerOsc = null; scannerLFO = null; scannerSubOsc = null;
    scannerGain = null; scannerLFOGain = null; scannerSubGain = null;
    setTimeout(() => { try { if (oscRef) oscRef.stop(); } catch(e) {} try { if (lfoRef) lfoRef.stop(); } catch(e) {} try { if (subRef) subRef.stop(); } catch(e) {} }, 320);
}
function soundSonarPing() {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, audioCtx.currentTime + 0.28);
        gain.gain.setValueAtTime(0.065, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    } catch(e) {}
}
function soundScanComplete() {
    if (!audioCtx) return;
    [523, 659, 880].forEach((f, i) => {
        try {
            const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
            osc.type = 'sine'; osc.frequency.value = f;
            const start = audioCtx.currentTime + i * 0.09;
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.05, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.38);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(start); osc.stop(start + 0.42);
        } catch(e) {}
    });
}
function playTraceHeartbeat() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator(); const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(72, t);
        osc.frequency.exponentialRampToValueAtTime(42, t + 0.18);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.075, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.32);
    } catch(e) {}
}
function playTracePip() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator(); const g = audioCtx.createGain();
        osc.type = 'square'; osc.frequency.setValueAtTime(1400, t);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06, t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.1);
    } catch(e) {}
}
function playTraceCriticalPip() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator(); const g = audioCtx.createGain();
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(1900, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.085, t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.15);
    } catch(e) {}
}

// ============================================================
// HELPERS DE PROGRESIÓN
// ============================================================
function getBestToolVersion() {
    if (!gameState.tools || gameState.tools.length === 0) return 1.0;
    return Math.max(...gameState.tools.map(t => t.v || 1.0));
}
function getPlayerTier() { return getPlayerTierFromVersion(getBestToolVersion()); }

function getHardwareCPUMult() { return gameState.hardware.cpu.mult || 1.0; }
function getHardwareAntennaRange() { return gameState.hardware.antenna.range || 1.0; }

// ============================================================
// FILE HELPERS
// ============================================================
function makeFile(content, sizeKB, isTraceLog, value, category) {
    const f = { type: 'file', content, size: sizeKB, isTraceLog: isTraceLog || false };
    if (value !== undefined && value !== null) f.value = value;
    if (category) f.category = category;
    return f;
}
function makeExe(name, version) {
    const template = TOOL_TEMPLATES[name];
    if (!template) return null;
    const sizeKB = parseFloat((3 + version * 1.5).toFixed(1));
    return {
        type: 'file',
        content: `[${template.service} cracker v${version}] Binario ejecutable.`,
        size: sizeKB,
        version: parseFloat(version),
        isExecutable: true
    };
}
function mulberry32(a) {
    return function() {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
function generateBinaryPreview(fileName, sizeKB) {
    let seed = 0;
    const key = fileName + ':' + sizeKB;
    for (let i = 0; i < key.length; i++) seed = ((seed << 5) - seed + key.charCodeAt(i)) | 0;
    const rng = mulberry32(seed);
    const lines = Math.min(18, Math.max(6, Math.floor(sizeKB / 2) + 6));
    const out = [];
    for (let l = 0; l < lines; l++) {
        let line = '';
        for (let c = 0; c < 44; c++) line += rng() < 0.5 ? '0' : '1';
        out.push(line);
    }
    return out.join('\n');
}

function buildInitialLocalFS() {
    const fs = {
        '/': { type: 'dir', children: ['bin', 'home', 'var', 'download'] },
        '/bin': { type: 'dir', children: ['ssh_crack.exe', 'sql_crack.exe', 'http_crack.exe'], isProtected: true },
        '/bin/ssh_crack.exe': makeExe('ssh_crack.exe', 1.0),
        '/bin/sql_crack.exe': makeExe('sql_crack.exe', 1.0),
        '/bin/http_crack.exe': makeExe('http_crack.exe', 1.0),
        '/home': { type: 'dir', children: ['user'] },
        '/home/user': { type: 'dir', children: [
            'notas.txt', 'comandos.txt', 'netmap.txt', 'conexion.txt',
            'hackeo.txt', 'rastreo.txt', 'infomarket.txt', 'hacknet.txt'
        ] },
        '/home/user/notas.txt': makeFile(
`Bienvenido.

Arrancaste de cero. Sin equipo, sin contactos, sin reputación.
Solo tenés una PC y esta carpeta.

Reglas del juego:
- No hay tutoriales.
- No hay flechas indicando qué hacer.
- Si la cagás, perdés todo.

Suerte.
-- Anónimo`, 2),
        '/home/user/comandos.txt': makeFile(
`// LISTA DE COMANDOS QUE CONOZCO //

Navegación local:
  ls / cd / cat / rm / cp / mv / clear

Red:
  netmap / netmap scan / connect [IP] / disconnect
  scan [IP]                - Revelar un servidor puntual (misiones)

Ataque:
  probe / run [exe] [puerto] / scp [archivo] / login [user] [pass] / porthack [puertos] / unzip

Misiones:
  connect hacknet.onion    - Tablón de contratos
  connect gomail.com       - Correo personal
  connect news.com         - Portal de noticias
  missions                 - Ver misiones activas
  missions available       - Ver disponibles
  missions accept [id]     - Aceptar
  missions claim [id]      - Reclamar recompensa

Firewall:
  wallbreaker / wallbreaker analyze / wallbreaker break X.Y

Hardware:
  hardware                 - Ver tu hardware actual

Otros:
  tools / ps / reset / clearsave`, 2),
        '/home/user/netmap.txt': makeFile(
`// MAPA DE RED //

El netmap no viene con nada. Tenés que descubrir los nodos
escaneando. Solo se puede escanear con el mapa abierto.

Escaneo: netmap scan (consume RAM).

La antena mejora la distancia visible del mapa.

TIP: si una misión te da una IP objetivo, usá "scan [IP]"
para revelarla directamente en el NetMap.`, 2),
        '/home/user/conexion.txt': makeFile(
`// CONEXIONES //

connect [IP] abre una ventana con info del server y un panel
de login opcional.

Servidores virtuales:
  hacknet.onion - Tablón de contratos
  gomail.com    - Correo
  market.onion  - InfoMarket
  news.com      - Portal de noticias
  probe.com     - Servidor de pruebas`, 2),
        '/home/user/hackeo.txt': makeFile(
`// HACKEAR UN SERVER //

1. connect [IP]
2. probe
3. run [exe] [puerto] en cada puerto requerido
4. porthack [puertos]
5. scp [archivo]

Los crackers ahora son RAROS. Es más fácil conseguirlos
en misiones de HackNet que en servidores.`, 2),
        '/home/user/rastreo.txt': makeFile(
`// RASTREO //

NINGUNO / ARMADO / ACTIVO.

Cuando el rastreo llega a cero, perdés.
Para detenerlo: disconnect, o borrar /var/log/conn_XXXX.txt.`, 2),
        '/home/user/infomarket.txt': makeFile(
`// INFOMARKET //

Mercado en la dark web. Vendé archivos, comprá hardware.

Acceso: connect market.onion

Categorías:
  - RAM
  - CPU (acelera todos los crackers)
  - Antena (rango del netmap)`, 2),
        '/home/user/hacknet.txt': makeFile(
`// HACKNET.ONION //

Registrate y vinculá tu cuenta de gomail.
Ahí aparecen los contratos disponibles.

Solo los contratos pagados se reclaman acá.
El correo con los detalles te llega a gomail.com.

Acceso: connect hacknet.onion`, 2),
        '/var': { type: 'dir', children: ['log'] },
        '/var/log': { type: 'dir', children: ['syslog.txt'] },
        '/var/log/syslog.txt': makeFile('Registros del sistema local...', 2),
        '/download': { type: 'dir', children: [] }
    };
    if (gameState.wallbreakerObtained) {
        if (!fs['/bin'].children.includes('wallbreaker.exe')) {
            fs['/bin'].children.push('wallbreaker.exe');
            fs['/bin/wallbreaker.exe'] = makeExe('wallbreaker.exe', 1.0);
        }
    }
    return fs;
}

localFS = buildInitialLocalFS();
remoteFS = {};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function formatSize(kb) { return `${kb.toFixed(1)} KB`; }

function getCurrentFS() { return gameState.isConnected ? remoteFS : localFS; }
function getCurrentCWD() { return gameState.isConnected ? remoteCWD : localCWD; }
function setCurrentCWD(newPath) { if (gameState.isConnected) remoteCWD = newPath; else localCWD = newPath; }

function resolvePath(path, cwd) {
    if (!path) return cwd;
    if (path.startsWith('/')) return path;
    if (path === '..') { if (cwd === '/') return '/'; return cwd.substring(0, cwd.lastIndexOf('/')) || '/'; }
    if (path === '.') return cwd;
    return cwd === '/' ? '/' + path : cwd + '/' + path;
}

function ensureDir(fs, path) {
    if (path === '/' || fs[path]) return;
    const parts = path.split('/').filter(p => p);
    let current = '';
    for (let i = 0; i < parts.length; i++) {
        current += '/' + parts[i];
        if (!fs[current]) {
            fs[current] = { type: 'dir', children: [] };
            const parent = current.substring(0, current.lastIndexOf('/')) || '/';
            if (fs[parent] && !fs[parent].children.includes(parts[i])) {
                fs[parent].children.push(parts[i]);
            }
        }
    }
}
function pickWeightedDir(dirs) {
    const total = dirs.reduce((s, d) => s + d.weight, 0);
    let r = Math.random() * total;
    for (const d of dirs) {
        r -= d.weight;
        if (r <= 0) return d.path;
    }
    return dirs[dirs.length - 1].path;
}

// ============================================================
// GENERACIÓN DE FILES DEL SERVER
// ============================================================
function generateServerFiles(tier, profile, ports) {
    const services = ports.map(p => p.service);
    const fileNames = new Set();

    if (services.includes('SQL'))    { fileNames.add('database.sql'); fileNames.add('users.db'); }
    if (services.includes('HTTP'))   { fileNames.add('source_code.zip'); fileNames.add('config.cfg'); }
    if (services.includes('SMTP'))   { fileNames.add('correos.eml'); fileNames.add('contactos.txt'); }
    if (services.includes('FTP'))    { fileNames.add('boveda_backup.zip'); fileNames.add('dni_escaneados.zip'); }
    if (services.includes('TELNET')) { fileNames.add('passwd.txt'); fileNames.add('shadow.txt'); }
    if (services.includes('DNS'))    { fileNames.add('config.cfg'); fileNames.add('logs_auth.txt'); }

    if (profile.filePool === 'any') {
        const shuffled = [...SERVER_FILE_POOL].sort(() => Math.random() - 0.5);
        shuffled.slice(0, 4 + Math.floor(Math.random() * 4)).forEach(f => fileNames.add(f.name));
    } else if (Array.isArray(profile.filePool)) {
        profile.filePool.forEach(f => fileNames.add(f));
    }

    if (fileNames.size < 3) {
        const shuffled = [...SERVER_FILE_POOL].sort(() => Math.random() - 0.5);
        shuffled.slice(0, 3).forEach(f => fileNames.add(f.name));
    }

    const list = [...fileNames].slice(0, 8);
    const files = [];

    list.forEach(name => {
        const template = SERVER_FILE_POOL.find(f => f.name === name);
        if (template) {
            const scaledSize = scaleFileSize(template.size, tier, template.category);
            const value = computeFileValue(template.category, scaledSize, tier);
            const finalContent = (typeof template.gen === 'function')
                ? template.gen(tier)
                : template.content;
            files.push({
                name: template.name,
                content: finalContent,
                size: scaledSize,
                category: template.category,
                value: value
            });
        }
    });

    let zipChance = 0;
    if (tier >= 2 && tier <= 4) zipChance = 0.20;
    else if (tier >= 5 && tier <= 7) zipChance = 0.35;
    else if (tier >= 8) zipChance = 0.50;

    let protectedZip = null;
    let zipHintFile = null;

    if (Math.random() < zipChance) {
        const zipContents = pickZipContent();
        const password = pickZipPassword();
        const zipNamePool = ['backup_2024.zip', 'backup_privado.zip', 'archivos_secretos.zip',
                             'wallet_backup.zip', 'fotos_privadas.zip', 'documentos_personales.zip',
                             'backup_importante.zip', 'datos_sensibles.zip'];
        const zipName = zipNamePool[Math.floor(Math.random() * zipNamePool.length)];
        const innerTotalSize = zipContents.reduce((s, f) => s + f.size, 0);
        const zipSize = Math.round(innerTotalSize * 1.2);

        protectedZip = {
            name: zipName,
            category: 'financiero',
            content: null,
            size: scaleFileSize(zipSize, tier, 'financiero'),
            value: 0,
            isProtectedZip: true,
            zipPassword: password,
            zipContents: zipContents
        };
        files.push(protectedZip);

        const hintNames = ['notas.txt', 'recordatorios.txt', 'agenda.txt', 'log_semanal.txt',
                           'config_rapida.txt', 'instrucciones.txt', 'pendientes.txt', 'notas_varias.txt'];
        const hintName = hintNames[Math.floor(Math.random() * hintNames.length)];
        const hintContent = buildZipHintContent(password);
        const hintSize = scaleFileSize(2, tier, 'basura');

        zipHintFile = {
            name: hintName,
            category: 'basura',
            content: hintContent,
            size: hintSize,
            value: computeFileValue('basura', hintSize, tier)
        };
        files.push(zipHintFile);
    }

    return { files, protectedZip, zipHintFile };
}

// ============================================================
// CREACIÓN DEL FS DEL SERVER
// ============================================================
function createServerFS(tier, profile, ports) {
    const layout = getLayoutForProfile(profile.id);
    const fs = { '/': { type: 'dir', children: [] } };

    ['var', 'var/log', 'etc', 'home', 'bin', 'tmp', 'opt'].forEach(d => ensureDir(fs, '/' + d));

    fs['/var/log/syslog.txt'] = makeFile('[SYSLOG] Servicios del sistema iniciados. Uptime: 47 días.', 3, false, 0, 'basura');
    fs['/var/log/auth.txt']   = makeFile('[AUTH] 3 intentos fallidos de login. Bloqueado.', 4, false, 0, 'basura');
    fs['/var/log/daemon.txt'] = makeFile('[DAEMON] Proceso cron ejecutado.', 2, false, 0, 'basura');
    fs['/var/log/kern.txt']   = makeFile('[KERNEL] Módulos de red inicializados.', 5, false, 0, 'basura');
    fs['/var/log'].children.push('syslog.txt', 'auth.txt', 'daemon.txt', 'kern.txt');

    fs['/etc/hostname']    = makeFile('server-node', 1, false, 0, 'basura');
    fs['/etc/resolv.conf'] = makeFile('nameserver 8.8.8.8\nnameserver 1.1.1.1', 1, false, 0, 'basura');
    fs['/etc/passwd']      = makeFile('root:x:0:0:root:/root:/bin/bash\nadmin:x:1000:1000::/home/admin:/bin/bash', 2, false, 0, 'corporativo');
    fs['/etc/shadow']      = makeFile('root:$6$Xk9pQ2vB$Ld9hK3..:19345:0:99999:7:::', 3, false, 0, 'financiero');
    fs['/etc'].children.push('hostname', 'resolv.conf', 'passwd', 'shadow');

    layout.dirs.forEach(d => ensureDir(fs, d.path));

    const { files: serverFiles, protectedZip, zipHintFile } = generateServerFiles(tier, profile, ports);

    serverFiles.forEach(sf => {
        if (sf.isProtectedZip) return;
        const targetDir = pickWeightedDir(layout.dirs);
        ensureDir(fs, targetDir);
        const path = targetDir === '/' ? '/' + sf.name : targetDir + '/' + sf.name;
        fs[path] = makeFile(sf.content, sf.size, false, sf.value, sf.category);
        if (!fs[targetDir].children.includes(sf.name)) {
            fs[targetDir].children.push(sf.name);
        }
    });

    if (protectedZip) {
        const nonPrimaryDirs = layout.dirs.filter(d => d.path !== layout.primaryDir);
        const zipDir = nonPrimaryDirs.length > 0
            ? nonPrimaryDirs[Math.floor(Math.random() * nonPrimaryDirs.length)].path
            : layout.primaryDir;
        ensureDir(fs, zipDir);
        const zipPath = zipDir === '/' ? '/' + protectedZip.name : zipDir + '/' + protectedZip.name;
        fs[zipPath] = {
            type: 'file',
            content: null,
            size: protectedZip.size,
            isProtectedZip: true,
            zipPassword: protectedZip.zipPassword,
            zipContents: protectedZip.zipContents,
            category: 'financiero',
            value: 0
        };
        if (!fs[zipDir].children.includes(protectedZip.name)) {
            fs[zipDir].children.push(protectedZip.name);
        }
    }

    if (zipHintFile) {
        ensureDir(fs, layout.primaryDir);
        const hintPath = layout.primaryDir === '/' ? '/' + zipHintFile.name : layout.primaryDir + '/' + zipHintFile.name;
        fs[hintPath] = makeFile(zipHintFile.content, zipHintFile.size, false, zipHintFile.value, zipHintFile.category);
        if (!fs[layout.primaryDir].children.includes(zipHintFile.name)) {
            fs[layout.primaryDir].children.push(zipHintFile.name);
        }
    }

    const cfg = getTierConfig(tier);
    const binChance = profile.binToolsChance !== undefined ? profile.binToolsChance : 0.35;
    if (Math.random() < binChance) {
        const [bMin, bMax] = profile.binToolsCount || [1, 3];
        const numTools = randInt(bMin, bMax);
        const shuffled = [...CRACKER_NAMES].sort(() => Math.random() - 0.5);
        const [tMin, tMax] = cfg.toolVersionRange;
        const boost = profile.binToolsVersionBoost || 0;
        for (let i = 0; i < numTools && i < shuffled.length; i++) {
            const tname = shuffled[i];
            const version = Math.min(5.0, randFloat(tMin + boost, tMax + boost));
            fs['/bin/' + tname] = makeExe(tname, parseFloat(version.toFixed(1)));
            if (!fs['/bin'].children.includes(tname)) fs['/bin'].children.push(tname);
        }
    }
    if (typeof injectFlavorFiles === 'function') {
        injectFlavorFiles(fs, tier, profile);
    }    

    return fs;
}

function getUniqueFileName(fs, dirPath, baseName, extraReserved) {
    const dir = fs[dirPath];
    if (!dir || !dir.children) return baseName;
    const existing = new Set(dir.children);
    if (extraReserved) { for (const n of extraReserved) existing.add(n); }
    if (!existing.has(baseName)) return baseName;

    const dotIdx = baseName.lastIndexOf('.');
    const name = dotIdx > 0 ? baseName.substring(0, dotIdx) : baseName;
    const ext = dotIdx > 0 ? baseName.substring(dotIdx) : '';

    let n = 1;
    while (n < 9999) {
        const candidate = `${name}(${n})${ext}`;
        if (!existing.has(candidate)) return candidate;
        n++;
    }
    return `${name}(${Date.now()})${ext}`;
}

// ============================================================
// RAM
// ============================================================
function calculateRamUsage() {
    let total = 0;
    if (gameState.netmapOpen && gameState.gamePhase !== 'last-chance') total += 0.5;
    if (gameState.wallbreakerApp && gameState.wallbreakerApp.open) total += FIREWALL_RAM_COST;
    gameState.runningProcesses.forEach(p => { total += p.ram; });
    return total;
}

// ============================================================
// UTILS
// ============================================================
function normalizeSuggestion(s) {
    if (typeof s === 'string') return { label: s, fill: s, isCred: false };
    return s;
}
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function randFloat(a, b) { return a + Math.random() * (b - a); }
function pickOne(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function uid() { return Date.now().toString(36) + Math.random().toString(36).substring(2, 8); }

// ============================================================
// SERVER GENERATION
// ============================================================
function getCompatibleProfile(tier) {
    const cfg = getTierConfig(tier);
    const avail = cfg.services;
    const candidates = SERVER_PROFILES.filter(p => {
        if (p.requireSQL    && !avail.includes('SQL'))    return false;
        if (p.requireHTTP   && !avail.includes('HTTP'))   return false;
        if (p.requireSMTP   && !avail.includes('SMTP'))   return false;
        if (p.requireFTP    && !avail.includes('FTP'))    return false;
        if (p.requireTELNET && !avail.includes('TELNET')) return false;
        if (p.requireDNS    && !avail.includes('DNS'))    return false;
        return p.services.some(s => avail.includes(s));
    });
    if (candidates.length === 0) return SERVER_PROFILES[SERVER_PROFILES.length - 1];
    const totalWeight = candidates.reduce((a, p) => a + p.weight, 0);
    let r = Math.random() * totalWeight;
    for (const p of candidates) {
        r -= p.weight;
        if (r <= 0) return p;
    }
    return candidates[candidates.length - 1];
}

function generatePortsForServer(tier, profile) {
    const cfg = getTierConfig(tier);
    const usedPorts = new Set();
    const serviceCount = {};
    const MAX_PER_SERVICE = 2;

    const SERVICE_PORTS = {
        'SSH':    [22, 2222],
        'HTTP':   [80, 8080, 8000, 3000],
        'SQL':    [1433, 3306, 5432, 1521],
        'FTP':    [21, 2121],
        'SMTP':   [25, 587, 465],
        'TELNET': [23, 2323],
        'DNS':    [53, 5353],
        'HTTPS':  [443, 8443],
        'POP3':   [110, 995],
        'IMAP':   [143, 993],
        'NTP':    [123],
        'SNMP':   [161, 162],
        'LDAP':   [389, 636],
        'SMB':    [445, 139]
    };

    function pickUniquePortForService(service) {
        const pool = SERVICE_PORTS[service] || null;
        if (pool) {
            for (const p of pool) {
                if (!usedPorts.has(p)) { usedPorts.add(p); return p; }
            }
        }
        for (let tries = 0; tries < 200; tries++) {
            const p = randInt(10000, 65535);
            if (!usedPorts.has(p)) { usedPorts.add(p); return p; }
        }
        return randInt(10000, 65535);
    }

    function canUseService(svc) {
        return (serviceCount[svc] || 0) < MAX_PER_SERVICE;
    }

    function registerService(svc) {
        serviceCount[svc] = (serviceCount[svc] || 0) + 1;
    }

    const finalServices = profile.services.filter(s => cfg.services.includes(s));
    const effectiveServices = finalServices.length > 0 ? finalServices : cfg.services;
    const [vMin, vMax] = cfg.versionRange;
    const [totalMin, totalMax] = cfg.totalPortsRange;
    const [decoMin, decoMax] = cfg.decorativeRange;

    const totalDesired = randInt(totalMin, totalMax);
    const numDeco = Math.min(totalDesired - 2, randInt(decoMin, decoMax));
    let numAttackable = Math.max(2, totalDesired - numDeco);

    const maxAttackablePossible = effectiveServices.length * MAX_PER_SERVICE;
    const targetAttackable = Math.min(numAttackable, maxAttackablePossible);

    const desiredTotal = Math.min(MAX_PORTS_PER_SERVER, totalDesired);
    let numDecoAdjusted = Math.max(numDeco, desiredTotal - targetAttackable);
    numDecoAdjusted = Math.min(numDecoAdjusted, MAX_PORTS_PER_SERVER - targetAttackable);

    const ports = [];
    const availableServices = [...effectiveServices].sort(() => Math.random() - 0.5);

    for (let i = 0; i < targetAttackable; i++) {
        let chosenSvc = null;
        let attempts = 0;
        const shuffled = [...availableServices].sort(() => Math.random() - 0.5);

        while (attempts < 50 && chosenSvc === null) {
            const candidate = shuffled[attempts % shuffled.length];
            if (canUseService(candidate)) {
                chosenSvc = candidate;
                break;
            }
            attempts++;
        }

        if (chosenSvc === null) break;

        registerService(chosenSvc);
        ports.push({
            port: pickUniquePortForService(chosenSvc),
            service: chosenSvc,
            name: chosenSvc,
            v: randFloat(vMin, vMax).toFixed(1),
            state: 'blocked'
        });
    }

    const deco = [...DECORATIVE_SERVICES].sort(() => Math.random() - 0.5);
    let decoIndex = 0;
    for (let i = 0; i < numDecoAdjusted && decoIndex < deco.length; i++) {
        let chosenDeco = null;
        let attempts = 0;
        while (attempts < deco.length && chosenDeco === null) {
            const candidate = deco[(decoIndex + attempts) % deco.length];
            if (canUseService(candidate.service)) {
                chosenDeco = candidate;
                break;
            }
            attempts++;
        }
        if (chosenDeco === null) break;

        registerService(chosenDeco.service);
        ports.push({
            port: pickUniquePortForService(chosenDeco.service),
            service: chosenDeco.service,
            name: chosenDeco.name,
            v: randFloat(0.5, 2.5).toFixed(1),
            state: 'blocked'
        });
        decoIndex++;
    }

    const coreServices = ['SSH', 'HTTP', 'SQL'];
    const availableCores = coreServices.filter(s => cfg.services.includes(s));
    const hasCore = ports.some(p => coreServices.includes(p.service));
    if (!hasCore && availableCores.length > 0) {
        let pickedCore = null;
        for (const svc of availableCores.sort(() => Math.random() - 0.5)) {
            if (canUseService(svc)) { pickedCore = svc; break; }
        }
        if (pickedCore) {
            registerService(pickedCore);
            ports.push({
                port: pickUniquePortForService(pickedCore),
                service: pickedCore,
                name: pickedCore,
                v: randFloat(vMin, vMax).toFixed(1),
                state: 'blocked'
            });
        }
    }

    while (ports.length > MAX_PORTS_PER_SERVER) ports.pop();
    return ports.sort(() => Math.random() - 0.5);
}

function generateUniqueIP(usedIPs) {
    for (let i = 0; i < 200; i++) {
        const a = [10, 172, 192][Math.floor(Math.random() * 3)];
        let ip;
        if (a === 10) ip = `10.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*254)+1}`;
        else if (a === 172) ip = `172.${16+Math.floor(Math.random()*16)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*254)+1}`;
        else ip = `192.168.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*254)+1}`;
        if (!usedIPs.includes(ip)) return ip;
    }
    return `10.${Date.now() % 256}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*254)+1}`;
}

function createServerObject(ip, netIndex, tier, opts) {
    opts = opts || {};
    if (tier === undefined) tier = getPlayerTier();
    const cfg = getTierConfig(tier);
    const profile = getCompatibleProfile(tier);
    const ports = generatePortsForServer(tier, profile);

    if (opts.maxPortVersion !== undefined) {
        const maxV = parseFloat(opts.maxPortVersion);
        if (!isNaN(maxV)) {
            ports.forEach(p => {
                if (ATTACKABLE_SERVICES.includes(p.service) && parseFloat(p.v) > maxV) {
                    p.v = maxV.toFixed(1);
                }
            });
        }
    }

    const attackableCount = ports.filter(p => ATTACKABLE_SERVICES.includes(p.service)).length;
    const [reqMin, reqMax] = cfg.reqPorts;
    const reqPorts = Math.max(1, Math.min(attackableCount, randInt(reqMin, reqMax)));
    const hasTrace = Math.random() < cfg.traceChance;
    let traceDuration = 0;
    if (hasTrace) {
        const [tMin, tMax] = cfg.traceDurationBase;
        const maxV = Math.max(...ports.filter(p => ATTACKABLE_SERVICES.includes(p.service)).map(p => parseFloat(p.v)), 1);
        const versionFactor = 0.85 + (maxV / 3.5) * 0.30;
        traceDuration = Math.round(randInt(tMin, tMax) * versionFactor);
    }
    let securityLevel = 0;
    ports.forEach(p => { if (['SSH','HTTP','SQL'].includes(p.service)) securityLevel += parseFloat(p.v); });
    const maxSecurity = 6 * 2.5;
    const secRatio = Math.min(1, securityLevel / maxSecurity);
    const credentials = {
        user: USERNAME_POOL[Math.floor(Math.random() * USERNAME_POOL.length)],
        pass: PASSWORD_POOL[Math.floor(Math.random() * PASSWORD_POOL.length)]
    };
    const hasFirewall = opts.forceFirewall === true || Math.random() < (cfg.firewallChance || 0);
    let firewall = null;
    if (hasFirewall) {
        const [vMin, vMax] = cfg.versionRange;
        const fwVersion = parseFloat((randFloat(vMin, vMax) * 1.1).toFixed(1));
        firewall = {
            hasFirewall: true,
            active: true,
            version: fwVersion,
            analyzed: false,
            analyzeUses: 0,
            broken: false,
            capturedHex: null,
            wallMarks: null,
            tier: tier
        };
    }
    return {
        ip, name: `${profile.label} ${netIndex + 1}`, ports, reqPorts,
        accessed: false,
        traceLogPath: null,
        discovered: false,
        hasTrace, traceDuration,
        securityLevel: secRatio,
        credentials,
        credentialsRevealed: false,
        savedCredentials: null,
        downloadsDuringSession: 0,
        quickTraceTriggered: false,
        pinned: false,
        netIndex: netIndex,
        tier: tier,
        profile: profile.id,
        profileLabel: profile.label,
        primaryDir: getLayoutForProfile(profile.id).primaryDir,
        firewall: firewall,
        fs: createServerFS(tier, profile, ports),
        identity: generateServerIdentity(profile.id)
    };
}
// ============================================================
// PROBE SERVER
// ============================================================
function createProbeServer() {
    const binChildren = [];
    const fs = {
        '/': { type: 'dir', children: ['bin', 'home', 'var', 'etc', 'tmp', 'opt'] },
        '/bin': { type: 'dir', children: binChildren },
        '/home': { type: 'dir', children: ['user'] },
        '/home/user': { type: 'dir', children: ['Documentos', 'Descargas', 'Escritorio', 'notas.txt'] },
        '/home/user/Documentos': { type: 'dir', children: ['agenda.txt', 'contactos.txt', 'informe_interno.txt'] },
        '/home/user/Descargas': { type: 'dir', children: ['backup_privado.zip'] },
        '/home/user/Escritorio': { type: 'dir', children: [] },
        '/var': { type: 'dir', children: ['log', 'lib', 'backups'] },
        '/var/log': { type: 'dir', children: ['syslog.txt', 'auth.log'] },
        '/var/lib': { type: 'dir', children: ['mysql'] },
        '/var/lib/mysql': { type: 'dir', children: ['database.sql'] },
        '/var/backups': { type: 'dir', children: [] },
        '/etc': { type: 'dir', children: ['hostname', 'passwd'] },
        '/tmp': { type: 'dir', children: [] },
        '/opt': { type: 'dir', children: [] }
    };

    fs['/home/user/notas.txt'] = makeFile(
`Notas personales:
- Comprar café
- Actualizar el servidor el viernes
- Clave del backup: "r00t2024"  ← ¡No me olvidar!
- Llamar al proveedor de internet`,
        2, false, computeFileValue('basura', 2, 0), 'basura');

    fs['/var/lib/mysql/database.sql'] = makeFile(
`-- Dump MySQL de pruebas
CREATE TABLE usuarios (id INT, email VARCHAR(255), tarjeta VARCHAR(20));
INSERT INTO usuarios VALUES (1, 'juan@test.com', '4532-****-****-1234');
INSERT INTO usuarios VALUES (2, 'maria@test.com', '5412-****-****-0987');
-- 12,847 registros más...`,
        18, false, computeFileValue('financiero', 18, 0), 'financiero');

    fs['/home/user/Documentos/contactos.txt'] = makeFile(
`AGENDA DE CONTACTOS DE PRUEBA

Juan García    - jgarcia@test.com  - +54 11 5555-1234
María López    - mlopez@test.com   - +54 11 5555-5678`,
        4, false, computeFileValue('personal', 4, 0), 'personal');

    fs['/home/user/Documentos/agenda.txt'] = makeFile(
`REUNIONES DE PRUEBA

Lunes:      Test de integración
Miércoles:  Revisión de backups`,
        3, false, computeFileValue('corporativo', 3, 0), 'corporativo');

    fs['/home/user/Documentos/informe_interno.txt'] = makeFile(
`INFORME INTERNO DE PRUEBA

Este servidor es de pruebas.`,
        2, false, computeFileValue('corporativo', 2, 0), 'corporativo');

    fs['/var/log/syslog.txt'] = makeFile(`[SYSLOG] Servidor de pruebas iniciado.`, 2, false, 0, 'basura');
    fs['/var/log/auth.log'] = makeFile(`[AUTH] 3 intentos fallidos desde 185.220.101.5`, 3, false, 0, 'basura');
    fs['/etc/hostname'] = makeFile('probe-server', 1, false, 0, 'basura');
    fs['/etc/passwd'] = makeFile(`root:x:0:0:root:/root:/bin/bash\nprobe:x:1000:1000::/home/user:/bin/bash`, 2, false, 0, 'corporativo');

    fs['/home/user/Descargas/backup_privado.zip'] = {
        type: 'file',
        content: null,
        size: 35,
        isProtectedZip: true,
        zipPassword: 'r00t2024',
        category: 'financiero',
        value: 0,
        zipContents: [
            { name: 'wallets.txt', category: 'financiero', size: 5, content: `BTC: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh\nLlave privada: 5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF` },
            { name: 'tarjetas.csv', category: 'financiero', size: 8, content: `num_tarjeta,titular,venc,cvv\n4532-1234-5678-9012,Juan Pérez,12/25,123\n5412-8765-4321-0987,María López,08/26,456` },
            { name: 'notas_privadas.txt', category: 'personal', size: 3, content: `Notas que nadie debería leer:\n- Recordar borrar esto antes de vender la PC` }
        ]
    };

    ALL_TOOL_NAMES.forEach(name => {
        if (name === 'wallbreaker.exe') return;
        const f = makeExe(name, 5.0);
        if (f) { fs['/bin/' + name] = f; binChildren.push(name); }
    });
    const wb = makeExe('wallbreaker.exe', 1.0);
    fs['/bin/wallbreaker.exe'] = wb;
    binChildren.push('wallbreaker.exe');

    const ports = [
        { port: 22,   service: 'SSH',    name: 'SSH',    v: '1.5', state: 'blocked' },
        { port: 80,   service: 'HTTP',   name: 'HTTP',   v: '1.5', state: 'blocked' },
        { port: 1433, service: 'SQL',    name: 'SQL',    v: '1.5', state: 'blocked' },
        { port: 21,   service: 'FTP',    name: 'FTP',    v: '1.5', state: 'blocked' },
        { port: 25,   service: 'SMTP',   name: 'SMTP',   v: '1.5', state: 'blocked' },
        { port: 23,   service: 'TELNET', name: 'TELNET', v: '1.5', state: 'blocked' },
        { port: 53,   service: 'DNS',    name: 'DNS',    v: '1.5', state: 'blocked' }
    ];
    const firewall = {
        hasFirewall: true, active: true, version: 1.0,
        analyzed: false, analyzeUses: 0, broken: false,
        capturedHex: null, wallMarks: null, tier: 0
    };

    return {
        ip: '10.0.0.1',
        name: 'Servidor de Pruebas',
        alias: 'probe.com',
        ports, reqPorts: 1,
        accessed: false,
        traceLogPath: null,
        discovered: true,
        hiddenFromScan: true,
        hasTrace: true,
        traceDuration: 600,
        securityLevel: 0,
        credentials: { user: 'probe', pass: 'probe' },
        credentialsRevealed: true,
        savedCredentials: null,
        downloadsDuringSession: 0,
        quickTraceTriggered: false,
        pinned: false,
        netIndex: -1,
        tier: 0,
        profile: 'mixed',
        profileLabel: 'Servidor de Pruebas',
        primaryDir: '/home/user',
        firewall,
        fs,
        isProbeServer: true
    };
}

// ============================================================
// GENERACIÓN DE RED
// ============================================================
function spawnMoreServers(count) {
    const usedIPs = gameState.servers.map(s => s.ip);
    const startIdx = gameState.servers.length;
    const playerTier = getPlayerTier();
    for (let i = 0; i < count; i++) {
        const ip = generateUniqueIP(usedIPs);
        usedIPs.push(ip);
        const variantTier = pickVariantTier(playerTier);
        gameState.servers.push(createServerObject(ip, startIdx + i, variantTier));
    }
}

function generateNetwork() {
    gameState.servers = [];
    const usedIPs = [];
    const probeServer = createProbeServer();
    gameState.servers.push(probeServer);
    usedIPs.push(probeServer.ip);
    const initialCount = 30;
    const playerTier = getPlayerTier();
    for (let i = 0; i < initialCount; i++) {
        const ip = generateUniqueIP(usedIPs);
        usedIPs.push(ip);
        const variantTier = pickVariantTier(playerTier);
        gameState.servers.push(createServerObject(ip, i, variantTier));
    }
    gameState.lastKnownTier = playerTier;
}

function regenerateUndiscoveredServers() {
    const newTier = getPlayerTier();
    if (newTier === gameState.lastKnownTier) return { changed: false };
    let regenerated = 0;
    gameState.servers.forEach((s, idx) => {
        if (!s.discovered && !s.isProbeServer && !s.fromMission) {
            const variantTier = pickVariantTier(newTier);
            const newServer = createServerObject(s.ip, s.netIndex !== undefined ? s.netIndex : idx, variantTier);
            gameState.servers[idx] = newServer;
            regenerated++;
        }
    });
    gameState.lastKnownTier = newTier;
    return { changed: true, newTier, regenerated };
}

// ============================================================
// TRACE LOGS / RESET
// ============================================================
function createTraceLog(server) {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2,'0')}h${String(now.getMinutes()).padStart(2,'0')}m${String(now.getSeconds()).padStart(2,'0')}s`;
    const fileName = `conn_${ts}.txt`;
    const filePath = '/var/log/' + fileName;
    const content = `[REGISTRO DE CONEXIÓN ENTRANTE]\nIP Origen: 127.0.0.1 (proxied)\nFecha: ${now.toLocaleString()}\nEstado: SESIÓN ACTIVA - VINCULADA A RASTREO`;
    server.fs[filePath] = makeFile(content, 8, true);
    server.fs['/var/log'].children.push(fileName);
    server.traceLogPath = filePath;
}

function resetServerAccess(server) {
    if (!server) return;
    if (server.isProbeServer) {
        server.accessed = false;
        if (server.ports) server.ports.forEach(p => { p.state = 'blocked'; });
        if (server.firewall && server.firewall.hasFirewall) {
            server.firewall.active = true;
            server.firewall.analyzed = false;
            server.firewall.broken = false;
            server.firewall.analyzeUses = 0;
            server.firewall.capturedHex = null;
            server.firewall.wallMarks = null;
        }
        return;
    }
    server.accessed = false;
    if (server.ports) server.ports.forEach(p => { p.state = 'blocked'; });
    if (server.firewall && server.firewall.hasFirewall) {
        server.firewall.active = true;
        server.firewall.analyzed = false;
        server.firewall.broken = false;
        server.firewall.analyzeUses = 0;
        server.firewall.capturedHex = null;
        server.firewall.wallMarks = null;
    }
}

// ============================================================
// MISIONES — GENERACIÓN PROCEDURAL
// ============================================================
function generateMissionId() {
    gameState.missionCounter++;
    return 'M' + String(gameState.missionCounter).padStart(4, '0');
}

function hasMissionRequirement(req) {
    if (!req) return true;
    if (req === 'wallbreaker') return !!gameState.wallbreakerObtained;
    if (req === 'tools_5') return gameState.tools.length >= 5;
    if (req === 'tier_3') return getPlayerTier() >= 3;
    return true;
}

function pickSecondaryMissionType() {
    const available = SECONDARY_MISSION_TYPES.filter(t => hasMissionRequirement(t.requires));
    if (available.length === 0) return SECONDARY_MISSION_TYPES[0];
    const total = available.reduce((a, t) => a + t.weight, 0);
    let r = Math.random() * total;
    for (const t of available) {
        r -= t.weight;
        if (r <= 0) return t;
    }
    return available[available.length - 1];
}

function generateSecondaryMission() {
    const tier = getPlayerTier();
    const type = pickSecondaryMissionType();
    const base = type.gen(tier);
    const now = Date.now();
    return {
        id: generateMissionId(),
        type: type.id,
        requires: type.requires || null,
        title: base.title,
        description: base.description,
        minTier: base.minTier,
        targetCount: base.targetCount,
        progress: 0,
        meta: base.meta,
        rewardCR: base.rewardCR,
        rewardTool: base.rewardTool,
        targetIP: base.targetIP || null,
        sender: base.sender || null,
        acceptedAt: now,
        expiresAt: now + MISSION_EXPIRY_MS
    };
}

function refillMissionsPool() {
    while (gameState.missionsAvailable.length < MISSION_MAX_AVAILABLE) {
        gameState.missionsAvailable.push(generateSecondaryMission());
    }
}

function cleanupExpiredMissions() {
    const now = Date.now();
    gameState.missionsAvailable = gameState.missionsAvailable.filter(m => m.expiresAt > now);
    gameState.missionsActive = gameState.missionsActive.filter(m => m.expiresAt > now);
}

function tickMissions() {
    const now = Date.now();
    if (gameState.missionAccount && gameState.gomailLinked) {
        if (now - gameState.lastMissionSpawn >= MISSION_SPAWN_INTERVAL_MS) {
            gameState.lastMissionSpawn = now;
            cleanupExpiredMissions();
            refillMissionsPool();
        }
    }
}

// ============================================================
// PROGRESO DE MISIONES
// ============================================================
function checkMissionProgress(event) {
    if (!gameState.missionsActive.length) return [];
    const completed = [];
    gameState.missionsActive.forEach(m => {
        if (m.progress >= m.targetCount) return;

        if (m.meta.action === 'hack' && event.type === 'hack') {
            if (event.tier >= m.minTier) m.progress = Math.min(m.targetCount, m.progress + 1);
        }
        if (m.meta.action === 'hack_ip' && event.type === 'hack') {
            if (event.serverIP === m.targetIP) m.progress = m.targetCount;
        }
        if (m.meta.action === 'stealth_hack' && event.type === 'stealth_hack') {
            if (event.tier >= m.minTier) m.progress = m.targetCount;
        }
        if (m.meta.action === 'smooth_hack' && event.type === 'smooth_hack') {
            if (event.tier >= m.minTier) m.progress = m.targetCount;
        }
        if (m.meta.action === 'ghost_hack' && event.type === 'ghost_hack') {
            if (event.tier >= m.minTier) m.progress = m.targetCount;
        }
        if (m.meta.action === 'sell_value' && event.type === 'sell') {
            m.progress = Math.min(m.targetCount, m.progress + event.amount);
        }
        if (m.meta.action === 'download' && event.type === 'download') {
            if (event.serverIP === m.targetIP && event.fileName === m.meta.fileName) {
                m.progress = m.targetCount;
            }
        }
        if (m.meta.action === 'download_crackers' && event.type === 'download') {
            if (event.serverIP === m.targetIP && event.fileName.toLowerCase().endsWith('.exe')) {
                m.progress = Math.min(m.targetCount, m.progress + 1);
            }
        }

        if (m.progress >= m.targetCount && !m.readyToClaim) {
            m.progress = m.targetCount;
            m.readyToClaim = true;
            completed.push(m);
        }
    });
    return completed;
}

function autoAdvanceMissionsOnEvent(event) {
    if (!gameState.missionsActive.length) return;
    const completed = checkMissionProgress(event);
    if (completed && completed.length > 0) {
        completed.forEach(m => {
            output.innerHTML += `<span class="text-success">[✓] Misión lista para reclamar: </span><span class="text-warning">${m.title}</span><br>`;
        });
        output.scrollTop = output.scrollHeight;
        soundMissionComplete();
    }
}

// ============================================================
// HARDWARE
// ============================================================
function applyHardwareToState() {
    gameState.hardware.cpu.mult = 1.0;
    for (let i = 0; i <= gameState.hardware.cpu.level - 1; i++) {
        if (CPU_UPGRADES[i]) gameState.hardware.cpu.mult = CPU_UPGRADES[i].mult;
    }
    if (gameState.hardware.cpu.level === 0) gameState.hardware.cpu.mult = 1.0;

    gameState.hardware.antenna.range = 1.0;
    for (let i = 0; i <= gameState.hardware.antenna.level - 1; i++) {
        if (ANTENNA_UPGRADES[i]) gameState.hardware.antenna.range = ANTENNA_UPGRADES[i].range;
    }
    if (gameState.hardware.antenna.level === 0) gameState.hardware.antenna.range = 1.0;
}

// ============================================================
// SAVE / LOAD
// ============================================================
function saveGame() {
    if (!gameState.setupComplete) return;
    if (gameState.isDeleting) return;
    if (gameState.scanning) return;
    if (gameState.isGameOver) return;
    if (gameState.isDownloading) return;
    if (gameState.gamePhase === 'last-chance') return;
    if (gameState.gamePhase === 'white-terminal') return;
    if (gameState.gamePhase === 'game-over') return;
    if (gameState.localUser === undefined) return;

    let serialized;
    try {
        const save = {
            version: SAVE_VERSION,
            localUser: gameState.localUser,
            localPass: gameState.localPass,
            servers: gameState.servers,
            tools: gameState.tools,
            maxRam: gameState.maxRam,
            ramUpgradeLevel: gameState.ramUpgradeLevel,
            hardware: gameState.hardware,
            currentIP: gameState.currentIP,
            isConnected: gameState.isConnected,
            isAuthenticated: gameState.isAuthenticated,
            currentServerIP: gameState.currentServer ? gameState.currentServer.ip : null,
            localFS: localFS,
            remoteFS: remoteFS,
            localCWD: localCWD,
            remoteCWD: remoteCWD,
            traceTime: gameState.traceTime,
            traceActive: gameState.traceInterval !== null,
            quickTraceActive: gameState.quickTraceActive,
            hackedServers: gameState.hackedServers,
            lastKnownTier: gameState.lastKnownTier,
            runningProcesses: gameState.runningProcesses.map(p => ({
                id: p.id, toolName: p.toolName, portNum: p.portNum, ram: p.ram,
                serverIP: p.serverIP, isTestMode: p.isTestMode, status: p.status,
                progress: p.progress, resultMessage: p.resultMessage,
                animatedElapsed: p.animatedElapsed || 0,
                isScan: p.isScan || false,
                isDownload: p.isDownload || false,
                isUnzip: p.isUnzip || false,
                stallSchedule: p.stallSchedule || [],
                sqlDuration: p.sqlDuration, sshDuration: p.sshDuration,
                httpDuration: p.httpDuration, ftpDuration: p.ftpDuration,
                smtpDuration: p.smtpDuration, telnetDuration: p.telnetDuration,
                dnsDuration: p.dnsDuration
            })),
            currentProcessPage: currentProcessPage,
            netmapOpen: gameState.netmapOpen,
            netmapCamX: gameState.netmapCamX,
            netmapCamY: gameState.netmapCamY,
            commandHistory: commandHistory.slice(-100),
            money: gameState.money,
            marketAccount: gameState.marketAccount,
            marketSession: gameState.marketSession,
            inMarket: gameState.inMarket,
            wallbreakerObtained: gameState.wallbreakerObtained,
            missionAccount: gameState.missionAccount,
            gomailAccount: gameState.gomailAccount,
            gomailLinked: gameState.gomailLinked,
            gomailInbox: gameState.gomailInbox || [],
            missionsAvailable: gameState.missionsAvailable,
            missionsActive: gameState.missionsActive,
            missionsCompleted: gameState.missionsCompleted.slice(-50),
            lastMissionSpawn: gameState.lastMissionSpawn,
            missionCounter: gameState.missionCounter,
            newsLog: gameState.newsLog || [],
            newsCounter: gameState.newsCounter || 0,
            downloadedFileIds: gameState.downloadedFileIds || [],
            usedFlavorIds: gameState.usedFlavorIds || []
        };
        serialized = JSON.stringify(save);
    } catch (serErr) {
        console.warn('[save] No se pudo serializar el estado:', serErr);
        return;
    }

    // 1º intento: save completo
    try {
        localStorage.setItem(SAVE_KEY, serialized);
        try { SAVE_KEY_LEGACY.forEach(k => localStorage.removeItem(k)); } catch(e) {}
        return;
    } catch (e) {
        const isQuota = e && (e.name === 'QuotaExceededError' ||
                              e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
                              e.code === 22 || e.code === 1014);
        if (!isQuota) {
            console.warn('[save] Error guardando la sesión:', e);
            return;
        }
        console.warn('[save] Quota de localStorage excedida. Limpiando claves legacy y reintentando…');
    }

    // 2º intento: borramos legacy y reintentamos
    try { SAVE_KEY_LEGACY.forEach(k => localStorage.removeItem(k)); } catch(e) {}
    try {
        localStorage.setItem(SAVE_KEY, serialized);
        return;
    } catch (e) {
        console.warn('[save] Sigue sin entrar. Guardando versión reducida (sin newsLog/remoteFS).');
    }

    // 3º intento: save reducido (sin news log ni remoteFS, que son lo más pesado)
    try {
        const minimal = {
            version: SAVE_VERSION,
            localUser: gameState.localUser,
            localPass: gameState.localPass,
            servers: gameState.servers,
            tools: gameState.tools,
            maxRam: gameState.maxRam,
            ramUpgradeLevel: gameState.ramUpgradeLevel,
            hardware: gameState.hardware,
            localFS: localFS,
            remoteFS: {},
            localCWD: localCWD,
            remoteCWD: remoteCWD,
            money: gameState.money,
            wallbreakerObtained: gameState.wallbreakerObtained,
            missionAccount: gameState.missionAccount,
            gomailAccount: gameState.gomailAccount,
            gomailLinked: gameState.gomailLinked,
            marketAccount: gameState.marketAccount,
            missionCounter: gameState.missionCounter,
            lastKnownTier: gameState.lastKnownTier,
            usedFlavorIds: gameState.usedFlavorIds || [],
            downloadedFileIds: gameState.downloadedFileIds || []
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(minimal));
        console.warn('[save] Guardado en MODO REDUCIDO (perdés news y FS remoto).');
    } catch (e2) {
        console.error('[save] No se pudo guardar ni en modo reducido:', e2);
    }
}

// ============================================================
// DETECCIÓN DE SAVES ANTIGUOS (para migración)
// ============================================================
function getRawSave() {
    let raw = localStorage.getItem(SAVE_KEY);
    if (raw) return { raw, key: SAVE_KEY };
    for (const k of SAVE_KEY_LEGACY) {
        raw = localStorage.getItem(k);
        if (raw) return { raw, key: k };
    }
    return null;
}

function peekSaveInfo() {
    const found = getRawSave();
    if (!found) return { exists: false };
    try {
        const save = JSON.parse(found.raw);
        if (!save || typeof save !== 'object') return { exists: true, corrupted: true, key: found.key };
        return {
            exists: true,
            key: found.key,
            version: save.version || 0,
            current: save.version === SAVE_VERSION,
            outdated: (save.version || 0) > 0 && (save.version || 0) < SAVE_VERSION,
            save
        };
    } catch(e) {
        return { exists: true, corrupted: true, key: found.key };
    }
}

function loadGame() {
    const found = getRawSave();
if (!found) return false;
try {
    const save = JSON.parse(found.raw);
    if (!save || save.version !== SAVE_VERSION) return false;
        gameState.localUser = save.localUser || 'user';
        gameState.localPass = save.localPass || '1234';
        gameState.setupComplete = true;
        gameState.wallbreakerObtained = !!save.wallbreakerObtained;
        localFS = save.localFS || buildInitialLocalFS();
        remoteFS = save.remoteFS || {};
        localCWD = save.localCWD || '/home/user';
        remoteCWD = save.remoteCWD || '/home/user';
        gameState.maxRam = save.maxRam || 1.2;
        gameState.ramUpgradeLevel = save.ramUpgradeLevel || 0;
        gameState.hardware = save.hardware || {
            cpu:     { level: 0, mult: 1.0,  label: 'Base Dual-Core 2.4GHz' },
            antenna: { level: 0, range: 1.0, label: 'Antena integrada' }
        };
        if (!gameState.hardware.cpu) gameState.hardware.cpu = { level: 0, mult: 1.0, label: 'Base Dual-Core 2.4GHz' };
        if (!gameState.hardware.antenna) gameState.hardware.antenna = { level: 0, range: 1.0, label: 'Antena integrada' };
        applyHardwareToState();
        gameState.tools = save.tools || [];
        gameState.servers = save.servers || [];
        if (!gameState.servers.some(s => s.isProbeServer)) {
            gameState.servers.unshift(createProbeServer());
        }
        gameState.hackedServers = save.hackedServers || [];
        gameState.lastKnownTier = getPlayerTier();
        gameState.currentIP = save.currentIP || null;
        gameState.isConnected = !!save.isConnected;
        gameState.isAuthenticated = !!save.isAuthenticated;
        gameState.currentServer = save.currentServerIP ? (gameState.servers.find(s => s.ip === save.currentServerIP) || null) : null;
        gameState.netmapOpen = !!save.netmapOpen;
        gameState.netmapCamX = save.netmapCamX || 0;
        gameState.netmapCamY = save.netmapCamY || 0;
        currentProcessPage = save.currentProcessPage || 0;
        commandHistory = save.commandHistory || [];
        historyIndex = commandHistory.length;
        gameState.money = save.money || 0;
        gameState.marketAccount = save.marketAccount || null;
        gameState.marketSession = !!save.marketSession;
        gameState.inMarket = !!save.inMarket;

        gameState.missionAccount = save.missionAccount || null;
        gameState.gomailAccount = save.gomailAccount || null;
        gameState.gomailLinked = !!save.gomailLinked;
        gameState.gomailInbox = save.gomailInbox || [];
        gameState.missionsAvailable = save.missionsAvailable || [];
        gameState.missionsActive = save.missionsActive || [];
        gameState.missionsCompleted = save.missionsCompleted || [];
        gameState.lastMissionSpawn = save.lastMissionSpawn || 0;
        gameState.missionCounter = save.missionCounter || 0;
        gameState.hacknetSession = false;
        gameState.gomailSession = false;
        gameState.inHacknet = false;
        gameState.inGomail = false;

        gameState.newsLog = save.newsLog || [];
        gameState.newsCounter = save.newsCounter || 0;
        gameState.downloadedFileIds = save.downloadedFileIds || [];
        gameState.usedFlavorIds = save.usedFlavorIds || [];
        gameState.inNews = false;
        gameState.newsOpen = false;
        gameState.newsTab = 'latest';

        gameState.servers.forEach((s, idx) => {
    if (s.isProbeServer) return;
    if (!s.credentials) {
        s.credentials = {
            user: USERNAME_POOL[Math.floor(Math.random() * USERNAME_POOL.length)],
            pass: PASSWORD_POOL[Math.floor(Math.random() * PASSWORD_POOL.length)]
        };
    }
    if (s.credentialsRevealed === undefined) s.credentialsRevealed = false;
    if (s.savedCredentials === undefined) s.savedCredentials = null;
    if (s.downloadsDuringSession === undefined) s.downloadsDuringSession = 0;
    if (s.quickTraceTriggered === undefined) s.quickTraceTriggered = false;
    if (s.pinned === undefined) s.pinned = false;
    if (s.netIndex === undefined) s.netIndex = idx;
    if (s.tier === undefined) s.tier = getPlayerTier();
    if (s.profile === undefined) s.profile = 'mixed';
    if (s.profileLabel === undefined) s.profileLabel = 'Servidor';
    if (s.firewall === undefined) s.firewall = null;
    if (s.fromMission === undefined) s.fromMission = null;
    if (s.primaryDir === undefined) s.primaryDir = getLayoutForProfile(s.profile).primaryDir;
    if (s.identity === undefined) {
        s.identity = generateServerIdentity(s.profile || 'mixed');
    }
});

        if (localFS['/bin'] && localFS['/bin'].children) {
            const orphanExes = localFS['/bin'].children.filter(name => {
                const t = TOOL_TEMPLATES[name];
                if (!t) return false;
                return !gameState.tools.find(tool => tool.name === name);
            });
            orphanExes.forEach(name => {
                delete localFS['/bin/' + name];
                localFS['/bin'].children = localFS['/bin'].children.filter(c => c !== name);
            });
        }

        gameState.runningProcesses = [];
        (save.runningProcesses || []).forEach(p => {
            if (p.isScan) return;
            if (p.isDownload) return;
            if (p.isUnzip) return;
            if (p.status === 'failed' || p.status === 'active') return;
            const proc = {
                id: p.id, toolName: p.toolName, portNum: p.portNum, ram: p.ram,
                serverIP: p.serverIP, isTestMode: p.isTestMode, status: p.status,
                progress: p.progress || 0, resultMessage: p.resultMessage || '',
                animatedElapsed: p.animatedElapsed || 0,
                isStalled: false, stallSchedule: p.stallSchedule || [],
                accumulatedStall: 0, currentStall: null, portObj: null
            };
            if (p.portNum && gameState.currentServer) {
                proc.portObj = gameState.currentServer.ports.find(pt => pt.port === p.portNum) || null;
            }
            if (p.toolName === 'sql_crack.exe' && !p.isTestMode) {
                const sqlData = createSqlScript(SQL_CANVAS_W, SQL_CANVAS_H);
                proc.sqlScript = sqlData.script; proc.sqlGroups = sqlData.groups;
                proc.sqlDuration = p.sqlDuration || 5000; proc.sqlStartTime = Date.now();
            }
            if (p.toolName === 'ssh_crack.exe' && !p.isTestMode) {
                proc.sshOrbs = createSshOrbs(SSH_CANVAS_W, SSH_CANVAS_H);
                proc.sshDuration = p.sshDuration || 5000; proc.sshStartTime = Date.now();
            }
            if (p.toolName === 'http_crack.exe' && !p.isTestMode) {
                proc.httpTree = createHttpTree(HTTP_CANVAS_W, HTTP_CANVAS_H);
                proc.httpDuration = p.httpDuration || 5000; proc.httpStartTime = Date.now();
            }
            if (p.toolName === 'ftp_crack.exe' && !p.isTestMode) {
                proc.ftpData = createFtpData(FTP_CANVAS_W, FTP_CANVAS_H);
                proc.ftpDuration = p.ftpDuration || 15000; proc.ftpStartTime = Date.now();
                proc.ftpFlashUntil = 0;
            }
            if (p.toolName === 'smtp_crack.exe' && !p.isTestMode) {
                proc.smtpData = createSmtpData();
                proc.smtpDuration = p.smtpDuration || 12000;
                proc.smtpStartTime = Date.now();
            }
            if (p.toolName === 'telnet_crack.exe' && !p.isTestMode) {
                proc.telnetData = createTelnetData();
                proc.telnetDuration = p.telnetDuration || 20000;
                proc.telnetStartTime = Date.now();
            }
            if (p.toolName === 'dns_crack.exe' && !p.isTestMode) {
                proc.dnsData = createDnsData();
                proc.dnsDuration = p.dnsDuration || 15000;
                proc.dnsStartTime = Date.now();
            }
            gameState.runningProcesses.push(proc);
        });

        if (save.traceActive && save.traceTime > 0) {
            gameState.traceTime = save.traceTime;
            gameState.quickTraceActive = !!save.quickTraceActive;
            if (gameState.quickTraceActive) document.body.classList.add('quick-trace-active');
            else document.body.classList.add('trace-active');
            if (save.traceTime <= 10) document.body.classList.add('trace-critical');
            const m = Math.floor(save.traceTime / 60), s = save.traceTime % 60;
            traceTimer.textContent = gameState.quickTraceActive ? `⚠ RASTREO RÁPIDO: ${save.traceTime}s` : `RASTREO: ${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
            gameState.traceInterval = setInterval(() => {
                gameState.traceTime--;
                if (gameState.quickTraceActive) {
                    traceTimer.textContent = `⚠ RASTREO RÁPIDO: ${gameState.traceTime}s`;
                } else {
                    const mm = Math.floor(gameState.traceTime/60), ss = gameState.traceTime%60;
                    traceTimer.textContent = `RASTREO: ${mm.toString().padStart(2,'0')}:${ss.toString().padStart(2,'0')}`;
                }
                if (gameState.traceTime <= 0) { clearInterval(gameState.traceInterval); gameOver(); }
            }, 1000);
        } else {
            gameState.traceTime = 0;
            gameState.traceInterval = null;
            gameState.quickTraceActive = false;
            document.body.classList.remove('quick-trace-active');
            document.body.classList.remove('trace-active');
            document.body.classList.remove('trace-critical');
            traceTimer.textContent = 'RASTREO: --:--';
        }

        gameState.runningProcesses.forEach(proc => {
            if (proc.status === 'hacking') {
                const tool = gameState.tools.find(t => t.name === proc.toolName);
                if (tool) animateToolProgress(proc, tool, proc.portObj, proc.portNum, proc.isTestMode, proc.animatedElapsed);
            }
        });

        output.innerHTML = `<span class="text-info">[✓] Sesión restaurada. Bienvenido de nuevo, ${gameState.localUser}.</span><br><br>`;

        if (gameState.inMarket) {
            if (gameState.marketSession) openMarketWeb();
            else setTimeout(() => { openMarketForm(); }, 300);
        }
        return true;
    } catch(e) { console.error('Error al cargar la sesión:', e); return false; }
}

function clearSave() {
    try {
        localStorage.removeItem(SAVE_KEY);
        SAVE_KEY_LEGACY.forEach(k => localStorage.removeItem(k));
    } catch(e) {}
}

// ============================================================
// SNAPSHOT PRE-RASTREO (para restaurar al perder)
// ============================================================
const PRETRACE_KEY = SAVE_KEY + '_pretrace';

function savePreTraceSnapshot() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) localStorage.setItem(PRETRACE_KEY, raw);
    } catch(e) {}
}
function restorePreTraceSnapshot() {
    try {
        const snap = localStorage.getItem(PRETRACE_KEY);
        if (!snap) return false;
        localStorage.setItem(SAVE_KEY, snap);
        return true;
    } catch(e) { return false; }
}
function clearPreTraceSnapshot() {
    try { localStorage.removeItem(PRETRACE_KEY); } catch(e) {}
}

// ============================================================
// DOM REFS
// ============================================================
const output = document.getElementById('terminal-output');
const input = document.getElementById('terminal-input');
const promptSymbol = document.getElementById('prompt-symbol');
const traceTimer = document.getElementById('trace-timer');
const connStatus = document.getElementById('conn-status');
const ramStatus = document.getElementById('ram-status');
const ramBar = document.getElementById('ram-bar');
const netmapSection = document.getElementById('netmap-section');
const processesList = document.getElementById('processes-list');
const processesPagination = document.getElementById('processes-pagination');
const canvas = document.getElementById('netmap-canvas');
const ctx = canvas.getContext('2d');
const suggestionBox = document.getElementById('suggestion-box');
const marketFormOverlay = document.getElementById('market-form-overlay');

// ============================================================
// GOMAIL — Envío de mails
// ============================================================
function sendGomailEmail(from, subject, body, missionId) {
    if (!gameState.gomailAccount) return;
    if (!gameState.gomailInbox) gameState.gomailInbox = [];
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    gameState.gomailInbox.unshift({
        id: 'e' + Date.now() + Math.floor(Math.random() * 1000),
        from, subject, body, time: ts, read: false,
        missionId: missionId || null
    });
    if (gameState.gomailInbox.length > 50) gameState.gomailInbox.pop();
}
// ============================================================
// FLAVOR FILES — Archivos chatarra únicos
// ============================================================
// Usamos un pool gigante (FLAVOR_FILES en lore.js). Cada partida
// va marcando los que ya usó para que NUNCA se repitan.

function getAvailableFlavorFiles() {
    if (!Array.isArray(gameState.usedFlavorIds)) gameState.usedFlavorIds = [];
    const used = new Set(gameState.usedFlavorIds);
    return FLAVOR_FILES.filter(f => !used.has(f.id));
}

function pickRandomFlavorFiles(count) {
    const available = getAvailableFlavorFiles();
    if (available.length === 0) return [];
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

function markFlavorUsed(id) {
    if (!Array.isArray(gameState.usedFlavorIds)) gameState.usedFlavorIds = [];
    if (!gameState.usedFlavorIds.includes(id)) {
        gameState.usedFlavorIds.push(id);
    }
}

function injectFlavorFiles(fs, tier, profile) {
    const layout = getLayoutForProfile(profile.id || profile);
    const dirs = layout.dirs.map(d => d.path);

    // Probabilidad de que el server tenga flavors
    // Los "lowvalue" tienen menos, los "database" tienen más
    let baseChance = 0.6;
    let maxCount = 2;
    if (profile.id === 'database' || profile.id === 'backup') {
        baseChance = 0.85; maxCount = 3;
    } else if (profile.id === 'hacker') {
        baseChance = 0.75; maxCount = 3;
    } else if (profile.id === 'lowvalue') {
        baseChance = 0.35; maxCount = 1;
    }

    if (Math.random() > baseChance) return 0;

    const count = 1 + Math.floor(Math.random() * maxCount);
    const picked = pickRandomFlavorFiles(count);

    picked.forEach(fl => {
        const targetDir = dirs[Math.floor(Math.random() * dirs.length)];
        ensureDir(fs, targetDir);

        // Renombrar si colisiona con un archivo existente
        const finalName = getUniqueFileName(fs, targetDir, fl.name, []);
        const finalPath = targetDir === '/' ? '/' + finalName : targetDir + '/' + finalName;

        fs[finalPath] = {
            type: 'file',
            content: fl.content,
            size: fl.size || 2.0,
            category: 'basura',
            value: 0,
            isFlavor: true,
            flavorId: fl.id
        };
        if (!fs[targetDir].children.includes(finalName)) {
            fs[targetDir].children.push(finalName);
        }
        markFlavorUsed(fl.id);
    });

    return picked.length;
}