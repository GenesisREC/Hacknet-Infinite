// ============================================================
// SISTEMA DE ÚLTIMA OPORTUNIDAD
// ============================================================
const LAST_CHANCE_DURATION = 100;
const LAST_CHANCE_SAVE_KEY = 'hacknet_lastchance_v2.3';
const LC_WRONG_FILE_PENALTY = 8;

// ============================================================
// PERSISTENCIA DEL LAST-CHANCE (anti-reload)
// ============================================================
function persistLastChanceState(state) {
    try {
        localStorage.setItem(LAST_CHANCE_SAVE_KEY, JSON.stringify(state));
    } catch(e) {}
}
function clearPersistedLastChance() {
    try { localStorage.removeItem(LAST_CHANCE_SAVE_KEY); } catch(e) {}
}
function getPersistedLastChance() {
    try {
        const raw = localStorage.getItem(LAST_CHANCE_SAVE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || typeof data.phase !== 'string') return null;
        return data;
    } catch(e) { return null; }
}
// ============================================================
// EVENTOS DINÁMICOS DURANTE LA LAST-CHANCE
// ============================================================
const LC_FILE_PREFIXES = ['records', 'trace', 'session', 'capture', 'dump', 'audit', 'log', 'data', 'report', 'scan'];
const LC_FILE_EXTS = ['.txt', '.log', '.sql', '.csv', '.json', '.cfg', '.md'];
const LC_DECOY_IPS = [
    '185.220.101.5', '91.243.44.12', '45.12.98.210', '104.28.14.75',
    '198.51.100.42', '203.0.113.7', '192.0.2.55', '77.88.55.66',
    '23.129.64.130', '51.15.43.205', '89.234.157.254', '176.10.99.200',
    '109.70.100.20', '171.25.193.20', '195.176.3.19', '185.100.87.202'
];
const LC_DECOY_USERS = ['anon_7f3a', 'user_9c2d', 'target_x', 'operador_4', 'h4ck3r_88', 'n0mbre_rnd', 'operador_11', 'anon_3321'];
const LC_STATUSES = ['ACTIVO', 'PENDIENTE', 'EN PROGRESO', 'SUSPENDIDO', 'COMPLETADO'];

const LC_HACKER_TAUNTS = [
    'Te veo, {USER}.',
    'No vas a encontrarlo a tiempo.',
    'Mi servidor está lleno de registros. ¿Cuál es el tuyo?',
    '¿Ya te rendiste?',
    'El rastreo no se detiene, solo se acelera.',
    'Cada segundo que perdés me acerca más.',
    'Buena suerte con eso.',
    '¿Sabés lo que pasa cuando llegue a 0?',
    'Corre, ratoncito, corre.',
    'Mientras vos buscás, yo avanzo.',
    '¿Pensaste que era fácil?',
    'Este server no es tuyo, {USER}.'
];

function spawnLastChanceDecoy() {
    if (gameState.gamePhase !== 'last-chance') return;
    if (!remoteFS || !remoteFS['/root']) return;

    // Candidatos: /root y todas sus subcarpetas
    const candidateDirs = ['/root'];
    Object.keys(remoteFS).forEach(path => {
        if (path.startsWith('/root/') && remoteFS[path].type === 'dir') {
            candidateDirs.push(path);
        }
    });

    const dirPath = candidateDirs[Math.floor(Math.random() * candidateDirs.length)];

    let name, guard = 0;
    do {
        const p = LC_FILE_PREFIXES[Math.floor(Math.random() * LC_FILE_PREFIXES.length)];
        const e = LC_FILE_EXTS[Math.floor(Math.random() * LC_FILE_EXTS.length)];
        const n2 = String(Math.floor(Math.random() * 9000) + 1000);
        name = `${p}_${n2}${e}`;
        guard++;
    } while (remoteFS[(dirPath === '/' ? '/' : dirPath + '/') + name] && guard < 50);

    const fullPath = (dirPath === '/' ? '/' : dirPath + '/') + name;
    if (remoteFS[fullPath]) return;

    const fakeIP = LC_DECOY_IPS[Math.floor(Math.random() * LC_DECOY_IPS.length)];
    const fakeUser = LC_DECOY_USERS[Math.floor(Math.random() * LC_DECOY_USERS.length)];
    const status = LC_STATUSES[Math.floor(Math.random() * LC_STATUSES.length)];
    const date = new Date();
    const origin = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

    const content = [
        '[REGISTRO DE RASTREO]',
        '',
        `Timestamp: ${date.toLocaleString()}`,
        `IP objetivo: ${fakeIP}`,
        `Usuario vinculado: ${fakeUser}`,
        `Estado: ${status}`,
        `Origen de conexión: ${origin}`
    ].join('\n');

    remoteFS[fullPath] = makeFile(content, 4 + Math.floor(Math.random() * 12), false, 0, 'financiero');
    remoteFS[dirPath].children.push(name);

    output.innerHTML += `<div class="msg-box" style="border-color:#ff8833; background:rgba(60,30,0,0.4);">` +
        `<span class="text-fire" style="font-weight:bold;">[⚠] Nuevo registro entrante: ${fullPath}</span>` +
        `</div>`;
    output.scrollTop = output.scrollHeight;
    playTracePip();
}

function spawnHackerTaunt() {
    if (gameState.gamePhase !== 'last-chance') return;
    const user = gameState.localUser || 'user';
    const t = LC_HACKER_TAUNTS[Math.floor(Math.random() * LC_HACKER_TAUNTS.length)].replace(/\{USER\}/g, user);
    output.innerHTML += `<div class="msg-box" style="border-color:#ff3333; background:rgba(60,0,0,0.5); border-left:4px solid #ff3333;">` +
        `<span class="text-error" style="font-weight:bold;">&gt; MENSAJE DEL ATACANTE:</span> ` +
        `<span style="color:#ffcc00;">"${t}"</span>` +
        `</div>`;
    output.scrollTop = output.scrollHeight;
    playTraceCriticalPip();
}

function triggerLastChanceEvent() {
    if (gameState.gamePhase !== 'last-chance') return;
    if (Math.random() < 0.55) spawnLastChanceDecoy();
    else spawnHackerTaunt();
}

function startLastChanceEvents() {
    if (gameState.lastChanceEventTimer) clearInterval(gameState.lastChanceEventTimer);
    gameState.lastChanceEventTimer = setInterval(triggerLastChanceEvent, 15000);
}

function stopLastChanceEvents() {
    if (gameState.lastChanceEventTimer) {
        clearInterval(gameState.lastChanceEventTimer);
        gameState.lastChanceEventTimer = null;
    }
}
// ============================================================
// ORIGEN DEL RASTREO (para el mensaje final)
// ============================================================
const TRACE_SOURCE_KEY = 'hacknet_trace_source_v1';

function saveTraceSource(data) {
    try { localStorage.setItem(TRACE_SOURCE_KEY, JSON.stringify(data)); } catch(e) {}
}
function getTraceSource() {
    try {
        const raw = localStorage.getItem(TRACE_SOURCE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
}
function clearTraceSource() {
    try { localStorage.removeItem(TRACE_SOURCE_KEY); } catch(e) {}
}

// Perfiles "casuales" (hackers, PCs de oficina) — el resto son "formales" (empresas)
const CASUAL_PROFILES = ['hacker', 'lowvalue', 'office', 'mixed'];

const GAMEOVER_SENDERS = {
    casual: [
        'hacker_anonimo@darkweb.onion',
        'el_que_te_encontro@darkweb.onion',
        'tu_nuevo_dueno@darkweb.onion',
        'sombra_digital@darkweb.onion',
        'venganza_anonima@darkweb.onion'
    ],
    formal: [
        'legal@cyber-defense.com',
        'security@incident-response.net',
        'notificaciones@legal-team.org',
        'auditoria@corp-seguridad.com',
        'cumplimiento@data-protection.io'
    ]
};

const GAMEOVER_SUBJECTS = {
    casual: [
        'Encontrado 💀',
        'Bienvenido al club 💀',
        'Tarde o temprano pasaba',
        'Te encontré 😈',
        'GAME OVER, amigo',
        'Ahora sí, a llorar'
    ],
    formal: [
        'Notificación legal — Acceso no autorizado',
        'Aviso formal — IP registrada',
        'Cese y desista',
        'Comunicación oficial — Incidente de seguridad',
        'Notificación de acciones legales',
        'Reporte forense — Identificación positiva'
    ]
};

const GAMEOVER_MESSAGES = {
    casual: [
        `Bueno bueno bueno... mirá quién cayó.

Pensaste que podías jugar al hacker sin consecuencias, ¿no? Tu IP ({IP}) estaba en mi base desde hace rato. Solo era cuestión de tiempo.

Ahora estás en un calabozo digital, y todo lo que hackeaste fue en vano.

La próxima vez, borrá los logs antes de desconectarte.

— El que te hackeó primero`,

        `Jajaja... en serio, ¿pensaste que no te iba a encontrar?

Tu IP ({IP}) quedó registrada en el server desde el primer momento en que te conectaste. Yo solo tuve que esperar.

Ahora a llorar al campito. Nos vemos.

— Un amigo`,

        `Epa, epa, epa... mirá esto.

Un pichón de hacker. Tu IP ({IP}) está en mi lista desde el segundo uno. Con esa firma digital tan... digamos... inocente, te ubiqué en minutos.

Bienvenido al club. Aunque ahora sos más un recuerdo que un miembro.

— El que sabe`,

        `¿En serio te llamás {USER}?

Con esa IP ({IP}) tan fácil de rastrear, te encontré en menos de lo que tardás en escribir 'help'. Andá a buscar un diccionario, hacker de cartón.

Tu PC ahora es mi propiedad. Gracias por el hosting.

— Tu nuevo dueño`,

        `Che, te cuento algo: tu IP ({IP}) es más famosa que mi ex.

Todos en la dark web la conocen. Ahora también la policía. Y vos vas a conocer la cárcel.

No te olvides de mandarme una carta.

— El que te encontró antes que el FBI`,

        `Y bueno... era cantado.

IP ({IP}) registrada, usuario {USER} identificado. Sabés cuál fue tu error? Creer que un par de logs borrados te hacían invisible.

Nos vemos en el juicio.

— Un viejo conocido`
    ],

    formal: [
        `Estimado/a {USER}:

Le informamos que su dirección IP ({IP}) ha sido registrada como origen de los incidentes reportados en nuestros sistemas.

Los logs han sido preservados y entregados al equipo legal. Se iniciarán las acciones correspondientes.

— Departamento Legal, Cyber Defense Division`,

        `Este es un aviso formal de cese y desista.

Su IP ({IP}) fue identificada mediante análisis forense durante la auditoría de seguridad. Los cargos incluyen acceso no autorizado, sustracción de información confidencial y daños a la infraestructura.

La documentación ya obra en poder de las autoridades competentes.

— Departamento de Seguridad Informática`,

        `A la atención de {USER}:

Le notificamos que su IP ({IP}) ha sido vinculada a los accesos no autorizados detectados en nuestros servidores. El registro completo será presentado como evidencia.

No existe posibilidad de apelación. Las pruebas son concluyentes.

— División Legal, Ciberseguridad`,

        `COMUNICACIÓN OFICIAL

Hemos finalizado la auditoría forense. La IP ({IP}) fue rastreada hasta su ubicación. Los datos serán transferidos al organismo regulatorio correspondiente en las próximas 24 horas.

Sus servicios de internet serán suspendidos de forma preventiva.

— Departamento de Cumplimiento Normativo`,

        `Estimado/a {USER}:

Su intento de acceso no autorizado ha sido documentado en su totalidad. La IP ({IP}) fue aislada del tráfico y vinculada a un perfil forense completo.

Le recomendamos contactar a un abogado antes de la citación judicial.

— Auditoría de Sistemas`
    ]
};

function buildGameOverEmail() {
    const source = getTraceSource();
    let profile = source ? source.profile : 'random';

    // Si fue forzado con gameOver() sin server → elegimos uno al azar
    if (profile === 'random') {
        const all = [...CASUAL_PROFILES, 'database', 'web', 'mail', 'backup'];
        profile = all[Math.floor(Math.random() * all.length)];
    }

    const isCasual = CASUAL_PROFILES.includes(profile);
    const category = isCasual ? 'casual' : 'formal';
    const pool = GAMEOVER_MESSAGES[category];

    const body = pool[Math.floor(Math.random() * pool.length)]
        .replace(/\{IP\}/g, '127.0.0.1')
        .replace(/\{USER\}/g, gameState.localUser || 'user');

    const sender = GAMEOVER_SENDERS[category][Math.floor(Math.random() * GAMEOVER_SENDERS[category].length)];
    const subject = GAMEOVER_SUBJECTS[category][Math.floor(Math.random() * GAMEOVER_SUBJECTS[category].length)];

    return { sender, subject, body };
}
// ============================================================
// SONIDOS
// ============================================================
function playShutdownSound() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 3.0);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.06, t + 0.15);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 3.3);

        const sr = audioCtx.sampleRate;
        const bufSize = Math.floor(sr * 3.2);
        const buf = audioCtx.createBuffer(1, bufSize, sr);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
            const env = Math.pow(1 - i / bufSize, 2);
            d[i] = (Math.random() * 2 - 1) * env;
        }
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        const f = audioCtx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.setValueAtTime(4000, t);
        f.frequency.exponentialRampToValueAtTime(120, t + 3.0);
        const g2 = audioCtx.createGain(); g2.gain.value = 0.08;
        src.connect(f); f.connect(g2); g2.connect(audioCtx.destination);
        src.start();
    } catch(e) {}
}

function playPowerDownSound() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.9);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.05, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 1.1);
    } catch(e) {}
}

function playBootSound() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.06, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.45);

        setTimeout(() => {
            if (!audioCtx) return;
            const t2 = audioCtx.currentTime;
            const osc2 = audioCtx.createOscillator();
            const g2 = audioCtx.createGain();
            osc2.type = 'square';
            osc2.frequency.setValueAtTime(1320, t2);
            g2.gain.setValueAtTime(0, t2);
            g2.gain.linearRampToValueAtTime(0.05, t2 + 0.01);
            g2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.3);
            osc2.connect(g2); g2.connect(audioCtx.destination);
            osc2.start(t2); osc2.stop(t2 + 0.35);
        }, 250);
    } catch(e) {}
}

function playTypingSound() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200 + Math.random() * 400, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.012, t + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.02);
    } catch(e) {}
}

function playLineBreakSound() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.02, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.12);
    } catch(e) {}
}

function playConfirmSound() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        [523, 659, 880].forEach((f, i) => {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            const start = t + i * 0.06;
            o.type = 'sine';
            o.frequency.value = f;
            g.gain.setValueAtTime(0, start);
            g.gain.linearRampToValueAtTime(0.05, start + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
            o.connect(g); g.connect(audioCtx.destination);
            o.start(start); o.stop(start + 0.45);
        });
    } catch(e) {}
}

// ============================================================
// ANIMACIÓN DE APAGADO (más lenta, negro puro intermedio)
// ============================================================
function playShutdownAnimation(callback) {
    let overlay = document.getElementById('shutdown-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'shutdown-overlay';
        document.body.appendChild(overlay);
    }
    overlay.style.background = '#000';
    overlay.style.display = 'flex';
    overlay.innerHTML =
        '<div class="shutdown-text">CERRANDO SESIÓN SEGURA...\n\n' +
        '> Matando procesos...\n' +
        '> Cerrando puertos...\n' +
        '> Borrando caché...\n' +
        '> Eliminando rastros...\n\n' +
        '⚠ SISTEMA COMPROMETIDO ⚠\n\n' +
        '> APAGANDO PC...</div>';

    if (typeof initAudio === 'function') initAudio();
    playShutdownSound();

    document.body.classList.add('shutdown-glitch');

    // FASE 1: mensajes de shutdown (3.8s, el CSS hace el fade)
    setTimeout(() => {
        // FASE 2: quitar glitch, dejar que el texto se desvanezca
        document.body.classList.remove('shutdown-glitch');
        const txt = overlay.querySelector('.shutdown-text');
        if (txt) {
            txt.style.animation = 'none';
            txt.style.transition = 'opacity 0.9s';
            txt.style.opacity = '0';
        }

        // FASE 3: pantalla COMPLETAMENTE negra (1.5s hold)
        setTimeout(() => {
            overlay.innerHTML = ''; // overlay sigue negro puro
            playPowerDownSound();

            setTimeout(() => {
                // FASE 4: transición al boot (callback)
                if (typeof callback === 'function') callback();
                // Ocultar el overlay de shutdown en cuanto white-terminal lo tape
                setTimeout(() => {
                    overlay.style.display = 'none';
                    overlay.innerHTML = '';
                }, 50);
            }, 1500);
        }, 1000);
    }, 3800);
}

// ============================================================
// FASE 1: TERMINAL BLANCA
// ============================================================
function enterWhiteTerminal() {
    gameState.gamePhase = 'white-terminal';
    persistLastChanceState({ phase: 'pending' });

    document.body.classList.remove('quick-trace-active', 'trace-active', 'trace-critical', 'lastchance-mode');
    if (gameState.traceInterval) clearInterval(gameState.traceInterval);
    gameState.traceInterval = null;
    gameState.isConnected = false;
    gameState.currentIP = null;
    gameState.currentServer = null;
    gameState.isAuthenticated = false;
    gameState.inMarket = false;
    gameState.inHacknet = false;
    gameState.inGomail = false;
    gameState.inNews = false;
    killAllProcesses();
    if (typeof closeWallbreakerApp === 'function') closeWallbreakerApp(true);
    stopScannerSound();

    ['market-form-overlay', 'market-web-overlay', 'hacknet-form-overlay', 'gomail-form-overlay',
     'gomail-web-overlay', 'connect-overlay', 'wallbreaker-section',
     'lastchance-bar', 'news-web-overlay'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    playShutdownAnimation(() => {
        showWhiteTerminalMessages();
    });
}

function showWhiteTerminalMessages() {
    const overlay = document.getElementById('white-terminal-overlay');
    overlay.style.display = 'flex';
    overlay.classList.remove('crt-poweron');
    void overlay.offsetWidth;
    overlay.classList.add('crt-on', 'crt-poweron');

    document.body.style.background = '';

    if (typeof initAudio === 'function') initAudio();

    const body = document.getElementById('wt-body');
    const btn = document.getElementById('wt-action-btn');
    btn.style.display = 'none';
    btn.onclick = null;
    body.innerHTML = '';
    body.scrollTop = 0;

    // === TEXTO DEL BOOT ===
    const bootLines = [
        'AMIBIOS (C) 2024 Emergency Systems Inc.',
        'Version 4.51PG — Emergency Recovery Mode',
        '',
        'CPU: Quantum-Core @ 4.80GHz',
        'Memory Test: 262144K OK',
        '',
        'Detecting IDE drives...',
        '  Primary Master : EMERGENCY_SSD 240GB',
        '  Primary Slave  : None',
        '  Secondary Master: None',
        '',
        'Initializing network stack...',
        'Loading kernel modules...',
        'Mounting filesystems...',
        '[ OK ] /root',
        '[ OK ] /home',
        '[ OK ] /var',
        '[ OK ] /bin',
        'Starting emergency services...',
        '[ OK ] tracking-countermeasure.daemon',
        '[ OK ] anti-forensic-recovery.service',
        '',
        '⚠ RECOVERY MODE ACTIVE ⚠',
        ''
    ];

    // === TEXTO DE EMERGENCIA ===
    const messages = [
        '> Iniciando sistema de emergencia...',
        '> Restaurando punto de control...',
        '> ...',
        '',
        '⚠ ADVERTENCIA CRÍTICA ⚠',
        '',
        'Tu PC fue rastreada y comprometida.',
        'El atacante tiene tu IP guardada en su base de datos.',
        'En menos de 3 minutos la policía cibernética llegará a tu ubicación.',
        '',
        '> Última oportunidad disponible:',
        '> Vas a ser reconectado a la PC del atacante.',
        '',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '  OBJETIVO: CENTRO DE RASTREO  10.0.0.1',
        '  TIEMPO LÍMITE: ' + LAST_CHANCE_DURATION + ' SEGUNDOS',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '',
        'En /root/ y sus subcarpetas hay muchos',
        'archivos con registros de rastreo. Cada uno',
        'apunta a una IP objetivo distinta.',
        '',
        'TU IP REAL ES:  127.0.0.1',
        '',
        'Tenés que encontrar el archivo que tiene',
        'TU IP como "IP objetivo" y borrarlo.',
        '',
        '  → Ver archivos:      ls',
        '  → Leer un archivo:   cat [archivo]',
        '  → Borrar un archivo: rm [archivo]',
        '',
        '⚠ Cada archivo EQUIVOCADO que borres',
        '   te resta 8 segundos de rastreo.',
        '⚠ Si el tiempo llega a 0: GAME OVER.',
        '',
        '> Preparando último intento...'
    ];

    // === ESTADO ===
    let skipRequested = false;
    let activeTimer = null;
    let phase = 'idle'; // 'idle' | 'boot' | 'waiting' | 'msg' | 'done'

    function schedule(fn, delay) {
        if (activeTimer) clearTimeout(activeTimer);
        activeTimer = setTimeout(() => {
            activeTimer = null;
            fn();
        }, delay);
    }

    // === HANDLER DE SKIP (Enter) ===
    function handleKey(e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();

        if (phase === 'done') {
            if (btn.style.display !== 'none' && btn.onclick) btn.onclick();
            return;
        }

        skipRequested = true;
        if (activeTimer) {
            clearTimeout(activeTimer);
            activeTimer = null;
        }

        if (phase === 'boot') {
            finishBootImmediate();
        } else if (phase === 'waiting') {
            startEmergencyMessages();
        } else if (phase === 'msg') {
            finishMessagesImmediate();
        }
    }
    document.addEventListener('keydown', handleKey);

    // === FASE BOOT ===
    let bootIdx = 0;
    let bootText = '';
    let bootStarted = false;

    function typeBoot() {
        if (bootIdx >= bootLines.length) {
            phase = 'waiting';
            schedule(startEmergencyMessages, 1800);
            return;
        }
        bootText += bootLines[bootIdx] + '\n';
        body.innerHTML = bootText.replace(/\n/g, '<br>');
        body.scrollTop = body.scrollHeight;
        bootIdx++;
        schedule(typeBoot, 200 + Math.random() * 200);
    }

    function finishBootImmediate() {
        bootText = bootLines.join('\n') + '\n';
        body.innerHTML = bootText.replace(/\n/g, '<br>');
        body.scrollTop = body.scrollHeight;
        bootIdx = bootLines.length;
        phase = 'waiting';
        schedule(startEmergencyMessages, 300);
    }

    function startBootOnce() {
        if (bootStarted) return;
        bootStarted = true;
        overlay.classList.remove('crt-poweron');
        playBootSound();
        phase = 'boot';
        if (skipRequested) {
            finishBootImmediate();
            return;
        }
        typeBoot();
    }

    function onCrtEnd(e) {
        if (e.animationName === 'crtPowerOn') {
            overlay.removeEventListener('animationend', onCrtEnd);
            startBootOnce();
        }
    }
    overlay.addEventListener('animationend', onCrtEnd);
    schedule(startBootOnce, 3800);

    // === FASE MENSAJES ===
    let lineIdx = 0, charIdx = 0, currentText = '';
    let lastTypingSoundAt = 0;

    function startEmergencyMessages() {
        phase = 'msg';
        body.innerHTML = '';
        body.scrollTop = 0;
        currentText = '';
        lineIdx = 0;
        charIdx = 0;

        if (skipRequested) {
            finishMessagesImmediate();
            return;
        }
        schedule(typeNext, 900);
    }

    function typeNext() {
        if (lineIdx >= messages.length) {
            phase = 'done';
            btn.style.display = 'inline-block';
            btn.onclick = () => {
                playConfirmSound();
                overlay.classList.remove('crt-on', 'crt-poweron');
                document.removeEventListener('keydown', handleKey);
                startLastChance();
            };
            body.scrollTop = body.scrollHeight;
            return;
        }

        const line = messages[lineIdx];

        if (charIdx < line.length) {
            currentText += line[charIdx];
            charIdx++;
            const now = performance.now();
            const currentChar = line[charIdx - 1];
            if (currentChar !== ' ' && now - lastTypingSoundAt > 25) {
                playTypingSound();
                lastTypingSoundAt = now;
            }
            body.innerHTML = currentText.replace(/\n/g, '<br>') +
                '<span style="background:#000;color:#fff;">█</span>';
            body.scrollTop = body.scrollHeight;
            const delay = line.startsWith('⚠') ? 70 : 40;
            schedule(typeNext, delay);
        } else {
            currentText += '\n';
            lineIdx++;
            charIdx = 0;
            body.innerHTML = currentText.replace(/\n/g, '<br>');
            body.scrollTop = body.scrollHeight;
            if (line.trim().length > 0) playLineBreakSound();
            const delay = line.startsWith('⚠') ? 650 : 220;
            schedule(typeNext, delay);
        }
    }

    function finishMessagesImmediate() {
        currentText = messages.join('\n') + '\n';
        body.innerHTML = currentText.replace(/\n/g, '<br>');
        body.scrollTop = body.scrollHeight;
        lineIdx = messages.length;
        charIdx = 0;
        phase = 'done';
        btn.style.display = 'inline-block';
        btn.onclick = () => {
            playConfirmSound();
            overlay.classList.remove('crt-on', 'crt-poweron');
            document.removeEventListener('keydown', handleKey);
            startLastChance();
        };
    }
}

// ============================================================
// FASE 2: LAST CHANCE
// ============================================================
function startLastChance() {
    document.getElementById('white-terminal-overlay').style.display = 'none';
    document.body.style.background = '';
    gameState.gamePhase = 'last-chance';
    gameState.isGameOver = false;
    gameState.isDeleting = false;
    gameState.isDownloading = false;
    gameState.quickTraceActive = false;
    gameState.lastChanceTimeLeft = LAST_CHANCE_DURATION;

    localFS = buildInitialLocalFS();
    localCWD = '/home/user';
    remoteFS = {};
    remoteCWD = '/root';

    const lcServer = createLastChanceServer();
    gameState.servers = [lcServer];
    gameState.lastChanceServer = lcServer;

    gameState.netmapOpen = false;
    gameState.netmapCamX = 0;
    gameState.netmapCamY = 0;
    netmapZoom = 1;

    document.body.classList.add('lastchance-mode');

    persistLastChanceState({
        phase: 'active',
        timeLeft: gameState.lastChanceTimeLeft,
        targetPath: gameState.lastChanceTargetPath
    });

    output.innerHTML = '';
    output.innerHTML += '<div class="msg-box" style="border-color:#ff0000; background:rgba(60,0,0,0.45);">' +
        '<div style="color:#ff3333; font-weight:bold; font-size:1.1rem;">⚠ MODO DE EMERGENCIA ACTIVADO ⚠</div>' +
        '<div style="color:#ffcc00; margin-top:8px;">Tenés <b>' + LAST_CHANCE_DURATION + ' segundos</b> para hackear el servidor atacante y borrar el registro con tu IP.</div>' +
        '<div style="color:#ffcc00;">El registro correcto contiene <b>IP objetivo: 127.0.0.1</b>. Los demás son trampas.</div>' +
        '<div style="color:#ffcc00;">Borrar un archivo incorrecto te resta <b>' + LC_WRONG_FILE_PENALTY + 's</b>.</div>' +
        '<div style="color:#ffcc00;">Usá <b>connect ' + lcServer.ip + '</b> para entrar.</div>' +
        '</div>';

    promptSymbol.textContent = `${gameState.localUser}@local:${localCWD}$`;
    promptSymbol.style.color = '#33ff33';
    connStatus.textContent = 'MODO EMERGENCIA';
    connStatus.style.color = '#ff3333';

    const bar = document.getElementById('lastchance-bar');
    bar.style.display = 'flex';
    updateLastChanceBar();

    if (gameState.lastChanceTimer) clearInterval(gameState.lastChanceTimer);
    gameState.lastChanceTimer = setInterval(() => {
        gameState.lastChanceTimeLeft--;
        updateLastChanceBar();
        persistLastChanceState({
            phase: 'active',
            timeLeft: gameState.lastChanceTimeLeft,
            targetPath: gameState.lastChanceTargetPath
        });
        if (gameState.lastChanceTimeLeft <= 10 && gameState.lastChanceTimeLeft > 0) {
            playTraceCriticalPip();
        } else if (gameState.lastChanceTimeLeft % 5 === 0 && gameState.lastChanceTimeLeft > 0) {
            playTracePip();
        }
        if (gameState.lastChanceTimeLeft <= 0) {
            clearInterval(gameState.lastChanceTimer);
            gameState.lastChanceTimer = null;
            finalGameOver();
        }
    }, 1000);
    startLastChanceEvents();
    startNetmapAnim();
    updateUI();
    input.disabled = false;
    input.focus();
}

// ============================================================
// RESUMEN DE LC TRAS REINICIO
// ============================================================
function resumeLastChance(saved) {
    document.getElementById('white-terminal-overlay').style.display = 'none';
    document.body.style.background = '';
    gameState.gamePhase = 'last-chance';
    gameState.isGameOver = false;
    gameState.isDeleting = false;
    gameState.isDownloading = false;
    gameState.quickTraceActive = false;
    gameState.lastChanceTimeLeft = Math.max(1, saved.timeLeft || LAST_CHANCE_DURATION);

    localFS = buildInitialLocalFS();
    localCWD = '/home/user';
    remoteFS = {};
    remoteCWD = '/root';

    const forcedTargetName = saved.targetPath ? saved.targetPath.split('/').pop() : null;
    const lcServer = createLastChanceServer(saved.targetPath || null);
    gameState.servers = [lcServer];
    gameState.lastChanceServer = lcServer;

    gameState.netmapOpen = false;
    gameState.netmapCamX = 0;
    gameState.netmapCamY = 0;
    netmapZoom = 1;

    document.body.classList.add('lastchance-mode');

    output.innerHTML = '';
    output.innerHTML += '<div class="msg-box" style="border-color:#ff0000; background:rgba(60,0,0,0.45);">' +
        '<div style="color:#ff3333; font-weight:bold; font-size:1.1rem;">⚠ MODO DE EMERGENCIA — RESTAURADO ⚠</div>' +
        '<div style="color:#ffcc00; margin-top:8px;">El sistema detectó un reinicio. Retomando desde donde quedaste.</div>' +
        '<div style="color:#ffcc00;">Tenés <b>' + gameState.lastChanceTimeLeft + ' segundos</b> restantes.</div>' +
        '<div style="color:#ffcc00;">El registro correcto contiene <b>IP objetivo: 127.0.0.1</b>.</div>' +
        '<div style="color:#ffcc00;">Usá <b>connect ' + lcServer.ip + '</b> para entrar.</div>' +
        '</div>';

    promptSymbol.textContent = `${gameState.localUser}@local:${localCWD}$`;
    promptSymbol.style.color = '#33ff33';
    connStatus.textContent = 'MODO EMERGENCIA';
    connStatus.style.color = '#ff3333';

    const bar = document.getElementById('lastchance-bar');
    bar.style.display = 'flex';
    updateLastChanceBar();

    if (gameState.lastChanceTimer) clearInterval(gameState.lastChanceTimer);
    gameState.lastChanceTimer = setInterval(() => {
        gameState.lastChanceTimeLeft--;
        updateLastChanceBar();
        persistLastChanceState({
            phase: 'active',
            timeLeft: gameState.lastChanceTimeLeft,
            targetPath: gameState.lastChanceTargetPath
        });
        if (gameState.lastChanceTimeLeft <= 10 && gameState.lastChanceTimeLeft > 0) {
            playTraceCriticalPip();
        } else if (gameState.lastChanceTimeLeft % 5 === 0 && gameState.lastChanceTimeLeft > 0) {
            playTracePip();
        }
        if (gameState.lastChanceTimeLeft <= 0) {
            clearInterval(gameState.lastChanceTimer);
            gameState.lastChanceTimer = null;
            finalGameOver();
        }
    }, 1000);
    startLastChanceEvents();
    startNetmapAnim();
    updateUI();
    input.disabled = false;
    input.focus();
}

function updateLastChanceBar() {
    const pct = Math.max(0, (gameState.lastChanceTimeLeft / LAST_CHANCE_DURATION) * 100);
    const fill = document.getElementById('lc-progress-fill');
    const time = document.getElementById('lc-time');
    if (fill) fill.style.width = pct + '%';
    if (time) time.textContent = gameState.lastChanceTimeLeft + 's';
}

// ============================================================
// SERVER DE LAST CHANCE
// ============================================================
function createLastChanceServer(forcedTargetPath) {
    const bestVersion = getBestToolVersion();
    const portVersion = Math.max(0.5, Math.min(5.0, bestVersion - 0.15 + Math.random() * 0.3));

    const ownCrackers = gameState.tools.map(t => t.service).filter((v, i, a) => a.indexOf(v) === i);
    const serviceMap = { 'SSH': 22, 'HTTP': 80, 'SQL': 1433, 'FTP': 21, 'SMTP': 25, 'TELNET': 23, 'DNS': 53 };
    const crackedServices = ownCrackers.length > 0 ? ownCrackers : ['SSH', 'HTTP', 'SQL'];
    const ports = [];
    const usedPorts = new Set();

    crackedServices.slice(0, 3).forEach(svc => {
        const port = serviceMap[svc] || (Math.floor(Math.random() * 10000) + 10000);
        if (!usedPorts.has(port)) {
            usedPorts.add(port);
            ports.push({ port, service: svc, name: svc, v: portVersion.toFixed(1), state: 'blocked' });
        }
    });
    while (ports.length < 2) {
        const svc = ['SSH', 'HTTP', 'SQL', 'FTP'][ports.length % 4];
        const port = (serviceMap[svc] || 5000) + ports.length * 1000;
        if (!usedPorts.has(port)) {
            usedPorts.add(port);
            ports.push({ port, service: svc, name: svc, v: portVersion.toFixed(1), state: 'blocked' });
        }
    }

    return {
        ip: '10.0.0.1',
        name: 'CENTRO DE RASTREO',
        alias: 'LAST_CHANCE',
        ports,
        reqPorts: 1,
        accessed: false,
        traceLogPath: null,
        discovered: true,
        hiddenFromScan: true,
        hasTrace: false,
        traceDuration: 0,
        securityLevel: 0.3,
        credentials: { user: 'tracker', pass: 'root' },
        credentialsRevealed: false,
        savedCredentials: null,
        downloadsDuringSession: 0,
        quickTraceTriggered: false,
        pinned: false,
        netIndex: 0,
        tier: 0,
        profile: 'hacker',
        profileLabel: 'CENTRO DE RASTREO',
        primaryDir: '/root',
        firewall: null,
        fs: createLastChanceFS(forcedTargetPath),
        isLastChanceServer: true
    };
}

// ============================================================
// FILESYSTEM DEL LC — muchos decoys y trampas
// ============================================================
function createLastChanceFS(forcedTargetPath) {
    const fs = { '/': { type: 'dir', children: ['root', 'var', 'bin'] } };
    fs['/root'] = { type: 'dir', children: [] };
    fs['/var'] = { type: 'dir', children: ['log'] };
    fs['/var/log'] = { type: 'dir', children: ['syslog.txt'] };
    fs['/var/log/syslog.txt'] = makeFile('[SYSLOG] tracking server running...', 2);
    fs['/bin'] = { type: 'dir', children: [] };

    const userIP = '127.0.0.1';
    const userName = gameState.localUser || 'user';

    const prefixes = ['records', 'trace', 'session', 'capture', 'dump', 'audit', 'log', 'data', 'report', 'scan'];
    const safeExts = ['.txt', '.log', '.sql', '.csv', '.json', '.cfg', '.md'];

    function makeFilename(i) {
        const p = prefixes[Math.floor(Math.random() * prefixes.length)];
        const e = safeExts[Math.floor(Math.random() * safeExts.length)];
        const n1 = String(i).padStart(2, '0');
        const n2 = String(Math.floor(Math.random() * 9000) + 1000);
        return `${p}_${n1}_${n2}${e}`;
    }

    // Pool de subcarpetas bajo /root
    const folderPool = [
        'logs', 'records', 'archive', 'captures', 'dumps',
        'backups', 'tmp', 'spool', 'data', 'sessions',
        'audits', 'reports', 'queue', 'pending'
    ];

    // Elegir entre 3 y 5 carpetas
    const numFolders = 3 + Math.floor(Math.random() * 3);
    const shuffledPool = [...folderPool].sort(() => Math.random() - 0.5);
    const folderNames = shuffledPool.slice(0, numFolders);

    // Crear carpetas bajo /root
    folderNames.forEach(fn => {
        const path = '/root/' + fn;
        fs[path] = { type: 'dir', children: [] };
        fs['/root'].children.push(fn);
    });

    // Determinar el path del objetivo
    let targetDirPath, targetName;

    if (forcedTargetPath && forcedTargetPath.startsWith('/root')) {
        const lastSlash = forcedTargetPath.lastIndexOf('/');
        targetDirPath = lastSlash > 0 ? forcedTargetPath.substring(0, lastSlash) : '/root';
        targetName = forcedTargetPath.substring(lastSlash + 1);

        // Si la carpeta forzada no existe, la creamos (por si el pool random no la eligió)
        if (targetDirPath !== '/root' && !fs[targetDirPath]) {
            if (targetDirPath.startsWith('/root/')) {
                const sub = targetDirPath.substring('/root/'.length);
                if (!sub.includes('/')) {
                    fs[targetDirPath] = { type: 'dir', children: [] };
                    if (!fs['/root'].children.includes(sub)) fs['/root'].children.push(sub);
                }
            }
        }
        if (!fs[targetDirPath]) targetDirPath = '/root';
    } else {
        const candidateDirs = ['/root', ...folderNames.map(fn => '/root/' + fn)];
        targetDirPath = candidateDirs[Math.floor(Math.random() * candidateDirs.length)];
        targetName = null;
    }

    // Pools para señuelos
    const decoyIPs = [
        '185.220.101.5', '91.243.44.12', '45.12.98.210', '104.28.14.75',
        '198.51.100.42', '203.0.113.7', '192.0.2.55', '77.88.55.66',
        '23.129.64.130', '51.15.43.205', '89.234.157.254', '176.10.99.200',
        '109.70.100.20', '171.25.193.20', '195.176.3.19', '185.100.87.202'
    ];
    const decoyUsers = ['anon_7f3a', 'user_9c2d', 'target_x', 'operador_4', 'h4ck3r_88', 'n0mbre_rnd', 'operador_11', 'anon_3321'];
    const statuses = ['ACTIVO', 'PENDIENTE', 'EN PROGRESO', 'SUSPENDIDO', 'COMPLETADO'];

    function makeTrackingLog(ip, user, status, notes) {
        const date = new Date(Date.now() - Math.random() * 86400000 * 30);
        const origin = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
        const lines = [
            '[REGISTRO DE RASTREO]',
            '',
            `Timestamp: ${date.toLocaleString()}`,
            `IP objetivo: ${ip}`,
            `Usuario vinculado: ${user}`,
            `Estado: ${status}`,
            `Origen de conexión: ${origin}`
        ];
        if (notes) {
            lines.push('');
            lines.push('Notas:');
            notes.forEach(n => lines.push('- ' + n));
        }
        return lines.join('\n');
    }

    const targetContent = makeTrackingLog(
        userIP,
        userName,
        'ACTIVO',
        [
            'Sesión activa detectada',
            'Pendiente de identificación física',
            'Prioridad: ALTA'
        ]
    );

    // Total de archivos
    const totalFiles = 10 + Math.floor(Math.random() * 4);

    // Nombres únicos
    const filenames = [];
    const usedNames = new Set();
    for (let i = 0; i < totalFiles; i++) {
        let name, guard = 0;
        do { name = makeFilename(i); guard++; } while (usedNames.has(name) && guard < 50);
        usedNames.add(name);
        filenames.push(name);
    }

    // Forzar el nombre del objetivo si viene de reload
    if (targetName) {
        const existingIdx = filenames.indexOf(targetName);
        if (existingIdx >= 0) {
            [filenames[0], filenames[existingIdx]] = [filenames[existingIdx], filenames[0]];
        } else {
            filenames[0] = targetName;
        }
    }

    const targetIdx = 0;

    // Distribuir señuelos entre carpetas
    const candidateDirs = ['/root', ...folderNames.map(fn => '/root/' + fn)];
    const shuffledDirs = [...candidateDirs].sort(() => Math.random() - 0.5);

    let distIdx = 0;
    filenames.forEach((name, i) => {
        let dirPath;
        if (i === targetIdx) {
            dirPath = targetDirPath;
        } else {
            dirPath = shuffledDirs[distIdx % shuffledDirs.length];
            distIdx++;
        }
        const path = dirPath === '/' ? '/' + name : dirPath + '/' + name;
        let content;
        if (i === targetIdx) {
            content = targetContent;
            gameState.lastChanceTargetPath = path;
        } else {
            const fakeIP = decoyIPs[Math.floor(Math.random() * decoyIPs.length)];
            const fakeUser = decoyUsers[Math.floor(Math.random() * decoyUsers.length)];
            const st = statuses[Math.floor(Math.random() * statuses.length)];
            content = makeTrackingLog(fakeIP, fakeUser, st, null);
        }
        fs[path] = makeFile(content, 4 + Math.floor(Math.random() * 12), false, 0, 'financiero');
        fs[dirPath].children.push(name);
    });

    return fs;
}
// ============================================================
// GAME OVER FINAL (fallaste) — CON SCROLL
// ============================================================
function finalGameOver() {
    if (gameState.lastChanceTimer) clearInterval(gameState.lastChanceTimer);
    gameState.lastChanceTimer = null;
    stopLastChanceEvents();
    gameState.gamePhase = 'game-over';
    gameState.isGameOver = true;
    input.disabled = true;
    document.getElementById('lastchance-bar').style.display = 'none';
    document.body.classList.remove('lastchance-mode');
    clearPersistedLastChance();

    // Restaurar la partida previa al rastreo (si existe)
    const restored = restorePreTraceSnapshot();
    clearPreTraceSnapshot();

    if (audioCtx) {
        try {
            const t = audioCtx.currentTime;
            [400, 300, 200, 100].forEach((f, i) => {
                const osc = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                const start = t + i * 0.15;
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(f, start);
                g.gain.setValueAtTime(0, start);
                g.gain.linearRampToValueAtTime(0.06, start + 0.02);
                g.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
                osc.connect(g); g.connect(audioCtx.destination);
                osc.start(start); osc.stop(start + 0.45);
            });
        } catch(e) {}
    }

    const email = buildGameOverEmail();

    document.body.innerHTML = `
    <div style="position:fixed; inset:0; background:#000; color:#f00; overflow-y:auto; z-index:99999; font-family:'Consolas',monospace;">
        <div style="min-height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 20px;">
            <div style="font-size:3rem; font-weight:bold; letter-spacing:8px; text-shadow:0 0 20px #f00, 0 0 40px #f00; animation:gdPulse 0.8s infinite; text-align:center;">GAME OVER</div>
            <div style="font-size:1.2rem; color:#ffcc00; margin-top:20px; letter-spacing:3px; text-align:center;">FUISTE ENCONTRADO</div>
            <div style="max-width:700px; width:100%; margin-top:30px; border:2px solid #f00; padding:20px 26px; background:rgba(50,0,0,0.5); box-sizing:border-box;">
                <div style="color:#00ff88; font-weight:bold; margin-bottom:10px;">De: ${email.sender}</div>
                <div style="color:#00ff88; margin-bottom:6px;">Para: ${gameState.localUser}@gmail.com</div>
                <div style="color:#888; font-size:0.85rem; margin-bottom:14px;">Asunto: ${email.subject}</div>
                <div style="color:#fff; line-height:1.7; font-size:0.95rem;">
                    ${email.body.replace(/\n/g, '<br>')}
                </div>
            </div>
            <div style="color:#888; margin-top:26px; font-size:0.9rem; text-align:center;">Presioná el botón para cargar tu último guardado.</div>
            <button onclick="window.location.reload();" style="margin-top:18px; margin-bottom:30px; background:transparent; border:2px solid #f00; color:#f00; padding:12px 30px; font-family:inherit; font-weight:bold; letter-spacing:2px; cursor:pointer; font-size:1rem;">[ CARGAR ÚLTIMO GUARDADO ]</button>
        </div>
    </div>
    <style>@keyframes gdPulse { 0%,100% { text-shadow: 0 0 20px #f00, 0 0 40px #f00; } 50% { text-shadow: 0 0 40px #f00, 0 0 80px #f00, 0 0 120px #f00; } }</style>
    `;
}

// ============================================================
// VICTORIA
// ============================================================
function lastChanceVictory() {
    if (gameState.lastChanceTimer) clearInterval(gameState.lastChanceTimer);
    gameState.lastChanceTimer = null;
    stopLastChanceEvents();
    gameState.gamePhase = 'won';
    document.getElementById('lastchance-bar').style.display = 'none';
    document.body.classList.remove('lastchance-mode');
    clearPersistedLastChance();
    clearPreTraceSnapshot();
    clearTraceSource();

    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed; inset:0; background:#00ff88; z-index:99998; animation:winFlash 1.2s forwards; pointer-events:none;';
    document.body.appendChild(flash);
    const style = document.createElement('style');
    style.textContent = '@keyframes winFlash { 0% { opacity:0; } 30% { opacity:1; } 100% { opacity:0; } }';
    document.head.appendChild(style);
    setTimeout(() => flash.remove(), 1500);

    if (audioCtx) {
        try {
            const t = audioCtx.currentTime;
            [523, 659, 783, 1046, 1318].forEach((f, i) => {
                const osc = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                const start = t + i * 0.08;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, start);
                g.gain.setValueAtTime(0, start);
                g.gain.linearRampToValueAtTime(0.06, start + 0.02);
                g.gain.exponentialRampToValueAtTime(0.0001, start + 0.8);
                osc.connect(g); g.connect(audioCtx.destination);
                osc.start(start); osc.stop(start + 0.85);
            });
        } catch(e) {}
    }

    output.innerHTML = '<div class="msg-box" style="border-color:#00ff88; background:rgba(0,80,0,0.45);">' +
        '<div style="color:#00ff88; font-weight:bold; font-size:1.2rem;">✓ REGISTRO ELIMINADO ✓</div>' +
        '<div style="color:#ffcc00; margin-top:8px;">La base de datos con tu IP fue destruida.</div>' +
        '<div style="color:#ffcc00;">El sistema atacante perdió tu rastro. Reconstruyendo tu PC...</div>' +
        '</div>';

    setTimeout(() => restoreAfterVictory(), 2500);
}

function restoreAfterVictory() {
    gameState.gamePhase = 'normal';
    gameState.isGameOver = false;
    gameState.lastChanceServer = null;
    gameState.lastChanceTargetPath = null;
    gameState.lastChanceTimeLeft = 0;
    document.body.classList.remove('lastchance-mode');
    clearPersistedLastChance();

    generateNetwork();
    localFS = buildInitialLocalFS();
    remoteFS = {};
    localCWD = '/home/user';
    remoteCWD = '/home/user';

    gameState.isConnected = false;
    gameState.currentIP = null;
    gameState.currentServer = null;
    gameState.isAuthenticated = false;
    gameState.netmapOpen = false;
    gameState.netmapCamX = 0;
    gameState.netmapCamY = 0;

    output.innerHTML = '';
    output.innerHTML += '<div class="msg-box" style="border-color:#00ff88;">' +
        '<div style="color:#00ff88; font-weight:bold;">[✓] SISTEMA RESTAURADO</div>' +
        '<div class="text-muted" style="margin-top:6px;">Tu PC volvió a la normalidad. Nadie sabe quién sos.</div>' +
        '</div>';

    input.disabled = false;
    input.focus();
    updateUI();
    saveGame();
}

// ============================================================
// HOOK: cuando se borra un archivo, chequear victoria / penalizar
// ============================================================
function checkLastChanceFileDeleted(path) {
    if (gameState.gamePhase !== 'last-chance') return false;

    // ¿Es el objetivo? Victoria.
    if (path === gameState.lastChanceTargetPath) {
        lastChanceVictory();
        return true;
    }

    // ¿Es un archivo de /root con pinta de registro? → penalización
    const fileName = path.split('/').pop();
    if (path.startsWith('/root/') &&
        /^(records|trace|session|capture|dump|audit|log|data|report|scan)_/i.test(fileName)) {

        gameState.lastChanceTimeLeft = Math.max(1, gameState.lastChanceTimeLeft - LC_WRONG_FILE_PENALTY);
        updateLastChanceBar();
        persistLastChanceState({
            phase: 'active',
            timeLeft: gameState.lastChanceTimeLeft,
            targetPath: gameState.lastChanceTargetPath
        });

        output.innerHTML += `<div class="msg-box" style="border-color:#ff0000; background:rgba(60,0,0,0.4);">` +
            `<span class="text-error" style="font-weight:bold;">[✗] ¡ARCHIVO INCORRECTO!</span><br>` +
            `<span class="text-warning">Ese no era el registro con tu IP. El rastreo se aceleró.</span><br>` +
            `<span class="text-error" style="font-weight:bold;">Penalización: −${LC_WRONG_FILE_PENALTY}s</span>` +
            `</div>`;
        output.scrollTop = output.scrollHeight;
        playTraceCriticalPip();
    }

    return false;
}