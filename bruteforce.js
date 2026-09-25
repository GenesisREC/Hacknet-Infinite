// ============================================================
// BRUTEFORCE.JS — Minijuego de defensa contra brute force
// ============================================================
// Se dispara automáticamente según el nivel de sospecha del
// jugador. Si perdés, el hacker te roba CR / crackers, o te
// manda al last chance si no tenés nada. Si ganás, zafás.
// ============================================================

// ============================================================
// CONFIGURACIÓN DE RONDAS (progresivas)
// ============================================================
const BF_ROUNDS = [
    {
        duration: 30, speed: 3, maxAttempts: 200,
        forbiddenCount: 0,
        reqs: [
            { id: 'len', label: 'Mínimo 6 caracteres', fn: v => v.length >= 6 }
        ]
    },
    {
        duration: 22, speed: 5, maxAttempts: 200,
        forbiddenCount: 1,
        reqs: [
            { id: 'len',   label: 'Mínimo 8 caracteres',  fn: v => v.length >= 8 },
            { id: 'upper', label: 'Al menos 1 mayúscula', fn: v => /[A-Z]/.test(v) }
        ]
    },
    {
        duration: 15, speed: 8, maxAttempts: 200,
        forbiddenCount: 2,
        reqs: [
            { id: 'len',   label: 'Mínimo 8 caracteres',  fn: v => v.length >= 8 },
            { id: 'upper', label: 'Al menos 1 mayúscula', fn: v => /[A-Z]/.test(v) },
            { id: 'num',   label: 'Al menos 1 número',    fn: v => /[0-9]/.test(v) }
        ]
    },
    {
        duration: 11, speed: 12, maxAttempts: 200,
        forbiddenCount: 3,
        reqs: [
            { id: 'len',    label: 'Mínimo 9 caracteres',              fn: v => v.length >= 9 },
            { id: 'upper',  label: 'Al menos 1 mayúscula',             fn: v => /[A-Z]/.test(v) },
            { id: 'num',    label: 'Al menos 1 número',                fn: v => /[0-9]/.test(v) },
            { id: 'sym',    label: 'Al menos 1 símbolo (!@#$)',        fn: v => /[!@#$%&*?_\-]/.test(v) },
            { id: 'nolazy', label: 'Sin "1234", "admin" ni "qwerty"',  fn: v => !/(1234|admin|password|qwerty)/i.test(v) }
        ]
    },
    {
        duration: 8, speed: 18, maxAttempts: 200,
        forbiddenCount: 4,
        reqs: [
            { id: 'len',    label: 'Mínimo 10 caracteres',   fn: v => v.length >= 10 },
            { id: 'upper',  label: 'Al menos 2 mayúsculas',  fn: v => (v.match(/[A-Z]/g) || []).length >= 2 },
            { id: 'lower',  label: 'Al menos 2 minúsculas',  fn: v => (v.match(/[a-z]/g) || []).length >= 2 },
            { id: 'num',    label: 'Al menos 2 números',     fn: v => (v.match(/[0-9]/g) || []).length >= 2 },
            { id: 'sym',    label: 'Al menos 1 símbolo',     fn: v => /[!@#$%&*?_\-]/.test(v) },
            { id: 'vocals', label: 'Al menos 2 vocales',     fn: v => (v.match(/[aeiouAEIOU]/g) || []).length >= 2 }
        ]
    }
];
const BF_TOTAL_ROUNDS = BF_ROUNDS.length;

// ============================================================
// WORDLIST DEL ATACANTE
// ============================================================
const BF_WORDLIST = [
    '1234','12345','123456','1234567','12345678','123456789','1234567890',
    'password','password1','password123','passw0rd','Password1','Password123',
    'admin','admin1','admin123','admin2024','admin2025','administrator',
    'root','root1','root123','toor','qwerty','qwerty123','qwertyuiop',
    'letmein','letmein1','welcome','welcome1','welcome123',
    'changeme','changeme1','monkey','monkey1','dragon','master','shadow',
    'sunshine','princess','football','baseball','iloveyou','trustno1',
    'abc123','abcd1234','test','test1','test123','guest','guest1',
    'user','user1','user123','demo','demo123','sample',
    'hunter2','pass123','pass1234','passw0rd1','clave','clave123',
    'contraseña','contraseña1','secreto','secreto123','mipass',
    'P@ssw0rd','P@ssword1','P@ssword123','P@ssw0rd!','P@ssw0rd2024',
    'Admin@123','Admin@2024','Root@123','Root@2024','W3lcome!',
    'Ch4ngeme!','Hunt3r2','Tr0ub4dor','Tr0ub4dor&3','CorrectHorseBattery',
    'iloveyou1','iloveyou123','master1','master123','shadow1','shadow123',
    'george','jordan','michael','jennifer','jessica','ashley',
    'superman','batman','spiderman','ironman','avengers',
    'starwars','startrek','pokemon','naruto','goku'
];

const BF_USERNAMES = ['admin', 'root', 'user', 'oracle', 'postgres', 'www-data', 'ubuntu', 'pi', 'guest', 'test'];

// ============================================================
// ESTADO
// ============================================================
const BF = {
    active: false,
    round: 0,
    attemptsMade: 0,
    maxAttempts: 200,
    speed: 3,
    running: false,
    paused: false,
    timer: null,
    raf: null,
    roundTimer: null,
    lastFrame: 0,
    elapsedMs: 0,
    currentPass: '',
    roundDurationMs: 0,
    onCloseCallback: null,
    forbiddenLetters: [],
    usedPasswords: []
};

// ============================================================
// SCHEDULER — Chequeo periódico de ataque
// ============================================================
let _bfCheckTimer = null;

function startBruteforceScheduler() {
    if (_bfCheckTimer) return;
    _bfCheckTimer = setInterval(_bfCheckTick, 30000);
}

function stopBruteforceScheduler() {
    if (_bfCheckTimer) {
        clearInterval(_bfCheckTimer);
        _bfCheckTimer = null;
    }
}

function _bfCheckTick() {
    if (BF.active) return;
    if (typeof gameState === 'undefined') return;
    if (gameState.gamePhase !== 'normal') return;
    if (gameState.isConnected) return;
    if (gameState.inHacknet || gameState.inGomail || gameState.inMarket || gameState.inNews) return;
    if (gameState.connectOverlayOpen) return;
    if (gameState.tutorialOpen) return;
    if (gameState.isDeleting) return;
    if (gameState.isGameOver) return;
    if (gameState.scanning) return;

    const susp = gameState.suspicion || 0;
    if (susp < 15) return;

    // Chance escala con sospecha: 15% -> 25% a 100%
    const chance = (susp / 100) * 0.25;
    if (Math.random() < chance) {
        launchBruteforceAttack();
    }
}

// ============================================================
// LANZAR ATAQUE
// ============================================================
function launchBruteforceAttack() {
    if (BF.active) return;

    BF.active = true;
    BF.round = 0;
    BF.attemptsMade = 0;
    BF.elapsedMs = 0;
    BF.usedPasswords = [gameState.localPass || '1234']; // no se puede repetir NUNCA
    BF.forbiddenLetters = [];

    // Cerrar overlays que puedan chocar
    try {
        if (gameState.tutorialOpen && typeof closeTutorial === 'function') closeTutorial();
        if (gameState.inNews && typeof closeNewsWeb === 'function') closeNewsWeb();
        if (gameState.inMarket && typeof closeMarketWeb === 'function') closeMarketWeb();
        if (gameState.inGomail && typeof closeGomailWeb === 'function') closeGomailWeb();
        if (gameState.inHacknet && typeof exitHacknet === 'function') exitHacknet();
    } catch (e) {}

    // UI
    document.getElementById('bf-overlay').classList.add('active');
    document.getElementById('bf-play-area').style.display = 'block';
    document.getElementById('bf-result-screen').classList.remove('active');
    document.getElementById('bf-attempts').innerHTML = '';
    document.getElementById('bf-input').value = '';
    document.getElementById('bf-input').disabled = false;
    document.getElementById('bf-apply').disabled = true;
    document.getElementById('bf-pause-notice').classList.remove('active');
    document.getElementById('bf-current-pass').textContent = gameState.localPass || '1234';

    // Sonidos
    try { if (typeof soundScanStart === 'function') soundScanStart(); } catch (e) {}
    try { if (typeof haptic === 'function') haptic([60, 40, 60]); } catch (e) {}

    startBFRound();
}

// ============================================================
// RONDAS
// ============================================================
function startBFRound() {
    const cfg = BF_ROUNDS[BF.round];
    BF.maxAttempts = cfg.maxAttempts;
    BF.speed = cfg.speed;
    BF.attemptsMade = 0;
    BF.elapsedMs = 0;
    BF.roundDurationMs = cfg.duration * 1000;
    BF.paused = false;
    BF.running = true;

        // Sortear letras prohibidas para esta ronda
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    // Excluir letras que ya están en BF.usedPasswords para no hacer imposible la ronda
    const prevLetters = new Set();
    BF.usedPasswords.forEach(p => {
        p.toUpperCase().split('').forEach(c => {
            if (/[A-Z]/.test(c)) prevLetters.add(c);
        });
    });
    const available = allLetters.filter(L => !prevLetters.has(L));
    // Si nos quedamos sin letras (raro), usar todas
    const pool = available.length >= cfg.forbiddenCount ? available : allLetters;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    BF.forbiddenLetters = shuffled.slice(0, cfg.forbiddenCount);

    document.getElementById('bf-attempts').innerHTML = '';
    document.getElementById('bf-progress-fill').style.width = '0%';
    document.getElementById('bf-progress-pct').textContent = '0%';
    document.getElementById('bf-attempts-count').textContent = `0 / ${BF.maxAttempts}`;
    document.getElementById('bf-speed').textContent = BF.speed + ' / s';
    document.getElementById('bf-pause-notice').classList.remove('active');

    const info = document.getElementById('bf-round-info');
    info.textContent = `Ronda ${BF.round + 1} de ${BF_TOTAL_ROUNDS} — ${cfg.duration} segundos`;

    renderBFRoundDots();
    renderBFReqs(BF.round);
    document.getElementById('bf-input').value = '';
    updateBFReqs('');
    updateBFStrength(0);

    startBFAttemptLoop();
    startBFProgressLoop();
}

function startBFAttemptLoop() {
    if (BF.timer) clearInterval(BF.timer);
    const tickMs = 1000 / BF.speed;
    BF.timer = setInterval(() => {
        if (!BF.running || BF.paused) return;
        BF.attemptsMade++;
        addBFAttempt();
        if (BF.attemptsMade >= BF.maxAttempts) onBFLose();
    }, tickMs);
}

function startBFProgressLoop() {
    BF.lastFrame = performance.now();
    const loop = (now) => {
        if (!BF.running) return;
        const dt = now - BF.lastFrame;
        BF.lastFrame = now;
        if (!BF.paused) BF.elapsedMs += dt;

        const pct = Math.min(100, (BF.elapsedMs / BF.roundDurationMs) * 100);
        document.getElementById('bf-progress-fill').style.width = pct + '%';
        document.getElementById('bf-progress-pct').textContent = Math.round(pct) + '%';

        const remaining = Math.max(0, (BF.roundDurationMs - BF.elapsedMs) / 1000);
        document.getElementById('bf-eta').textContent = remaining.toFixed(1) + 's';

        if (BF.elapsedMs >= BF.roundDurationMs && !BF.paused) {
            onBFLose();
            return;
        }
        BF.raf = requestAnimationFrame(loop);
    };
    BF.raf = requestAnimationFrame(loop);
}

function addBFAttempt() {
    const user = BF_USERNAMES[Math.floor(Math.random() * BF_USERNAMES.length)];
    const pass = BF_WORDLIST[Math.floor(Math.random() * BF_WORDLIST.length)];
    const exact = pass === BF.currentPass;
    const near = !exact && bfSimilarity(pass, BF.currentPass) > 0.5;

    const line = document.createElement('div');
    line.className = 'bf-attempt';
    if (near) line.classList.add('near');
    if (exact) line.classList.add('hit');
    line.innerHTML = `<span class="who">${user} /</span> <span class="pass">${pass}</span> <span class="status">${exact ? '✓ MATCH' : '✗'}</span>`;

    const container = document.getElementById('bf-attempts');
    container.appendChild(line);
    const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 80;
    if (nearBottom) container.scrollTop = container.scrollHeight;

    document.getElementById('bf-attempts-count').textContent = `${BF.attemptsMade} / ${BF.maxAttempts}`;

    if (exact) onBFLose();
}

function bfSimilarity(a, b) {
    if (!a || !b) return 0;
    a = a.toLowerCase(); b = b.toLowerCase();
    let common = 0;
    const minLen = Math.min(a.length, b.length);
    for (let i = 0; i < minLen; i++) if (a[i] === b[i]) common++;
    let bonus = 0;
    if (a.includes(b) || b.includes(a)) bonus = 0.3;
    return Math.min(0.99, (common / Math.max(a.length, b.length)) * 0.7 + bonus);
}

// ============================================================
// CAMBIO DE PASSWORD
// ============================================================
function onBFChangePassword(newPass) {
    BF.paused = true;
    BF.currentPass = newPass;
    gameState.localPass = newPass;
    BF.usedPasswords.push(newPass);
    document.getElementById('bf-current-pass').textContent = newPass;
    document.getElementById('bf-pause-notice').classList.add('active');

    try { if (typeof soundSuccess === 'function') soundSuccess(); } catch (e) {}
    try { if (typeof saveGame === 'function') saveGame(); } catch (e) {}

    setTimeout(() => {
        BF.paused = false;
        BF.round++;
        if (BF.round >= BF_TOTAL_ROUNDS) {
            onBFWin();
            return;
        }
        startBFRound();
    }, 2500);
}

// ============================================================
// GANAR / PERDER
// ============================================================
function onBFLose() {
    if (!BF.running) return;
    BF.running = false;
    BF.paused = false;
    if (BF.timer) clearInterval(BF.timer);
    if (BF.raf) cancelAnimationFrame(BF.raf);
    renderBFRoundDots(true);
    showBFResultLose();
}

function onBFWin() {
    BF.running = false;
    BF.paused = false;
    if (BF.timer) clearInterval(BF.timer);
    if (BF.raf) cancelAnimationFrame(BF.raf);
    renderBFRoundDots();
    showBFResultWin();
}

// ============================================================
// RENDER DE RONDAS
// ============================================================
function renderBFRoundDots(failed) {
    const container = document.getElementById('bf-round-dots');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < BF_TOTAL_ROUNDS; i++) {
        const dot = document.createElement('div');
        dot.className = 'bf-round-dot';
        if (i < BF.round) dot.classList.add('done');
        else if (i === BF.round) {
            if (failed) dot.classList.add('failed');
            else dot.classList.add('active');
        }
        container.appendChild(dot);
    }
}

// ============================================================
// REQUISITOS DINÁMICOS
// ============================================================
function renderBFReqs(roundIdx) {
    const reqs = BF_ROUNDS[roundIdx].reqs;
    const ul = document.getElementById('bf-reqs');
    if (!ul) return;
    ul.innerHTML = '';

    // Requisito dinámico: letras prohibidas
    if (BF.forbiddenLetters.length > 0) {
        const li = document.createElement('li');
        li.dataset.req = 'forbidden';
        li.className = 'req-forbidden';
        li.innerHTML = `Sin las letras: <b>${BF.forbiddenLetters.join(' · ')}</b>`;
        ul.appendChild(li);
    }

    // Requisito dinámico: no repetir
    if (BF.usedPasswords.length > 1) {
        const li = document.createElement('li');
        li.dataset.req = 'repeat';
        li.textContent = 'No puede repetir una contraseña anterior';
        ul.appendChild(li);
    }

    // Requisitos de la ronda
    reqs.forEach(req => {
        const li = document.createElement('li');
        li.dataset.req = req.id;
        li.textContent = req.label;
        ul.appendChild(li);
    });

    const totalReqs = ul.children.length;
    ul.style.gridTemplateColumns = totalReqs >= 5 ? '1fr 1fr' : '1fr';
// Actualizar panel de letras prohibidas (arriba del input)
    const panel = document.getElementById('bf-forbidden-panel');
    const lettersEl = document.getElementById('bf-forbidden-letters');
    if (panel && lettersEl) {
        if (BF.forbiddenLetters.length > 0) {
            panel.style.display = 'flex';
            lettersEl.innerHTML = BF.forbiddenLetters
                .map(L => `<span>${L}</span>`)
                .join('');
        } else {
            panel.style.display = 'none';
        }
    }
}

function updateBFReqs(v) {
    const reqs = BF_ROUNDS[BF.round].reqs;
    let allOk = true;

    document.querySelectorAll('#bf-reqs li').forEach(li => {
        const key = li.dataset.req;
        let ok = false;

        if (key === 'forbidden') {
            const upper = v.toUpperCase();
            ok = !BF.forbiddenLetters.some(L => upper.includes(L));
        } else if (key === 'repeat') {
            ok = !BF.usedPasswords.includes(v);
        } else {
            const req = reqs.find(r => r.id === key);
            if (!req) { li.classList.toggle('ok', true); return; }
            ok = req.fn(v);
        }

        li.classList.toggle('ok', ok);
        if (!ok) allOk = false;
    });

    document.getElementById('bf-apply').disabled = !allOk;
}

function updateBFStrength(s) {
    const fill = document.getElementById('bf-strength-fill');
    const text = document.getElementById('bf-strength-text');
    if (!fill || !text) return;
    fill.style.width = (s * 100) + '%';
    if (s < 0.4) {
        fill.style.background = '#ff3333';
        fill.style.boxShadow = '0 0 8px #ff3333';
        text.textContent = 'DÉBIL';
        text.style.color = '#ff3333';
    } else if (s < 0.7) {
        fill.style.background = '#ffcc00';
        fill.style.boxShadow = '0 0 8px #ffcc00';
        text.textContent = 'MEDIA';
        text.style.color = '#ffcc00';
    } else {
        fill.style.background = '#33ff33';
        fill.style.boxShadow = '0 0 8px #33ff33';
        text.textContent = 'FUERTE';
        text.style.color = '#33ff33';
    }
}

function bfCalcStrength(pass) {
    let s = 0;
    if (pass.length >= 8) s += 0.2;
    if (pass.length >= 12) s += 0.15;
    if (pass.length >= 16) s += 0.15;
    if (/[A-Z]/.test(pass)) s += 0.1;
    if (/[a-z]/.test(pass)) s += 0.1;
    if (/[0-9]/.test(pass)) s += 0.1;
    if (/[^A-Za-z0-9]/.test(pass)) s += 0.2;
    if (BF_WORDLIST.some(w => pass.toLowerCase().includes(w.toLowerCase()))) s -= 0.4;
    return Math.max(0, Math.min(1, s));
}

// ============================================================
// RESULTADOS
// ============================================================
function showBFResultWin() {
    document.getElementById('bf-play-area').style.display = 'none';
    document.getElementById('bf-result-screen').classList.add('active');

    document.getElementById('bf-result-title').className = 'bf-result-title win';
    document.getElementById('bf-result-title').textContent = 'DEFENSA EXITOSA';
    document.getElementById('bf-result-subtitle').textContent = 'El atacante desistió después de 5 rondas.';

    document.getElementById('bf-result-punishment-wrap').innerHTML = `
        <div class="bf-result-punishment" style="border-color:#33ff33; background:rgba(0,50,0,0.3);">
            <div class="bf-result-punishment-title" style="color:#33ff33;">RECOMPENSA</div>
            <div class="bf-result-punishment-body">
                ▸ No perdiste créditos ni crackers.<br>
                ▸ El atacante no dejó rastros: <b>sospecha sin cambios</b>.<br>
                ▸ Password actual: <b>${gameState.localPass}</b>
            </div>
        </div>`;

    try { if (typeof soundMissionComplete === 'function') soundMissionComplete(); } catch (e) {}
    try { if (typeof saveGame === 'function') saveGame(); } catch (e) {}
}

function showBFResultLose() {
    document.getElementById('bf-play-area').style.display = 'none';
    document.getElementById('bf-result-screen').classList.add('active');

    document.getElementById('bf-result-title').className = 'bf-result-title lose';
    document.getElementById('bf-result-title').textContent = 'SISTEMA PENETRADO';
    document.getElementById('bf-result-subtitle').textContent = 'El atacante obtuvo acceso a tu máquina.';

    const punishment = calcBFPunishment();
    let html = '';

    if (punishment.type === 'cr') {
        const before = gameState.money;
        gameState.money = Math.max(0, gameState.money - punishment.amount);
        html = `
            <div class="bf-result-punishment cr">
                <div class="bf-result-punishment-title">[ PÉRDIDA DE CRÉDITOS ]</div>
                <div class="bf-result-punishment-body">
                    El atacante vació tu wallet antes de irse.<br><br>
                    ▸ Créditos antes: <b>${before.toLocaleString()} CR</b><br>
                    ▸ Robados: <span class="amount">-${punishment.amount.toLocaleString()} CR</span><br>
                    ▸ Créditos ahora: <b>${gameState.money.toLocaleString()} CR</b>
                </div>
            </div>`;
    } else if (punishment.type === 'cracker') {
        const removed = punishment.cracker;
        // Borrar del FS
        if (localFS['/bin'] && localFS['/bin'].children) {
            localFS['/bin'].children = localFS['/bin'].children.filter(c => c !== removed);
            delete localFS['/bin/' + removed];
        }
        gameState.tools = gameState.tools.filter(t => t.name !== removed);
        html = `
            <div class="bf-result-punishment cracker">
                <div class="bf-result-punishment-title">[ CRACKER ELIMINADO ]</div>
                <div class="bf-result-punishment-body">
                    Sin créditos que robar, el atacante borró uno de tus crackers.<br><br>
                    ▸ Cracker perdido: <span class="amount">${removed}</span><br>
                    ▸ Crackers restantes: <b>${gameState.tools.length}</b>
                </div>
            </div>`;
    } else {
        html = `
            <div class="bf-result-punishment lastchance">
                <div class="bf-result-punishment-title">[ ! SISTEMA COMPROMETIDO ! ]</div>
                <div class="bf-result-punishment-body">
                    No te quedaban créditos ni crackers que perder.<br>
                    El atacante tomó control total de tu PC.<br><br>
                    ▸ Iniciando protocolo de emergencia...<br>
                    ▸ <b>ÚLTIMA OPORTUNIDAD ACTIVADA</b>
                </div>
            </div>`;
    }

    document.getElementById('bf-result-punishment-wrap').innerHTML = html;

    // Enviar email burlón del hacker
    try { sendHackerTauntEmail(punishment); } catch (e) {}

    try { if (typeof soundError === 'function') soundError(); } catch (e) {}
    try { if (typeof updateUI === 'function') updateUI(); } catch (e) {}
    try { if (typeof saveGame === 'function') saveGame(); } catch (e) {}

    // Programar el last chance si corresponde
    if (punishment.type === 'lastchance') {
        setTimeout(() => {
            closeBROverlay(true);
            if (typeof enterWhiteTerminal === 'function') enterWhiteTerminal();
        }, 3500);
    }
}

function calcBFPunishment() {
    // 1) CR si tiene suficiente
    if (gameState.money >= 3000) {
        const pct = gameState.money * 0.25;
        const amount = Math.min(25000, Math.max(3000, Math.round(pct)));
        return { type: 'cr', amount };
    }

    // 2) Cracker extra (no los 3 iniciales)
    const baseTools = ['ssh_crack.exe', 'sql_crack.exe', 'http_crack.exe'];
    const extras = gameState.tools
        .map(t => t.name)
        .filter(name => !baseTools.includes(name));
    if (extras.length > 0) {
        const removed = extras[Math.floor(Math.random() * extras.length)];
        return { type: 'cracker', cracker: removed };
    }

    // 3) Last chance
    return { type: 'lastchance' };
}

// ============================================================
// EMAIL BURLÓN DEL HACKER
// ============================================================
const BF_TAUNT_EMAILS = [
    {
        subject: 'Gracias por las vacaciones',
        body: `Che, {USER}, gracias por dejarme pasar.

Fue re fácil. Tu password era tan obvia que la adiviné en el primer intento.
Aproveché para hacer unas compras, nada personal.

La próxima poné algo mejor. O no, mejor no. Así vuelvo.

— El que te hackeó`
    },
    {
        subject: 'Tsk tsk tsk...',
        body: `Hola, {USER}.

Te cuento cómo fue: entré, miré, me llevé lo que quise.
No pusiste ni un mínimo de resistencia. Me decepcionaste.

Probá con mayúsculas la próxima. O números. O cualquier cosa que no sea "1234".

Saludos desde algún lugar del mundo,
— Anónimo`
    },
    {
        subject: 'Nuevo cliente',
        body: `Hola, {USER}.

Soy tu nuevo cliente. Me llevé {AMOUNT} créditos de tu cuenta.
Un placer hacer negocios.

Tu equipo es muy lindo, por cierto. La próxima vez, aseguralo.

— Tu nuevo dueño`
    },
    {
        subject: 'Regalito',
        body: `Che, {USER}, te dejo un regalito.

No te lo voy a explicar. Andá a mirar tu cuenta.
Y después a mirar tu /bin, que se ve que faltaba algo.

Cuando quieras revancha, avisame. Pero avisame con un password decente.

— M.`
    },
    {
        subject: 'Sos un chiste',
        body: `Jajajaja.

En serio, {USER}, tu password es un chiste.
Te la dejo pasar porque me hiciste reír.

Igual me llevé unas cositas. Pero por el show, viste.

— El que se ríe`
    },
    {
        subject: 'Hasta la próxima',
        body: `Buenas.

Entré, hice lo mío, me fui. Un placer.
No me busques, no me vas a encontrar.

Pero si querés intentarlo, ya sabés dónde estoy: en tu propio sistema.

— Alguien`
    },
    {
        subject: 'De nada',
        body: `Hola, {USER}.

Vine a ayudarte a entender que tu seguridad es un desastre.
Te dejé sin {LOST}. De nada.

La próxima cobro la consultoría.

— Tu amigo el hacker`
    }
];

function sendHackerTauntEmail(punishment) {
    if (!gameState.gomailAccount) return;
    if (typeof sendGomailEmail !== 'function') return;

    const template = BF_TAUNT_EMAILS[Math.floor(Math.random() * BF_TAUNT_EMAILS.length)];
    const user = gameState.localUser || 'user';

    let loss = 'nada importante';
    if (punishment.type === 'cr')      loss = punishment.amount.toLocaleString() + ' CR';
    else if (punishment.type === 'cracker') loss = punishment.cracker;
    else                               loss = 'todo';

    const subject = template.subject.replace(/\{USER\}/g, user);
    const body = template.body
        .replace(/\{USER\}/g, user)
        .replace(/\{AMOUNT\}/g, punishment.type === 'cr' ? punishment.amount.toLocaleString() : 'unos cuantos')
        .replace(/\{LOST\}/g, loss);

    const senderPool = [
        'anon@darkweb.onion',
        'venganza@darkweb.onion',
        'el_que_te_hackeo@darkweb.onion',
        'buena_suerte@darkweb.onion',
        'no_reply@cyber-threat.io',
        'tutelador@darkweb.onion'
    ];
    const sender = senderPool[Math.floor(Math.random() * senderPool.length)];

    sendGomailEmail(sender, subject, body, null);
}

// ============================================================
// CERRAR OVERLAY
// ============================================================
function closeBROverlay(silent) {
    document.getElementById('bf-overlay').classList.remove('active');
    BF.active = false;
    BF.running = false;
    if (BF.timer) clearInterval(BF.timer);
    if (BF.raf) cancelAnimationFrame(BF.raf);
    if (!silent) {
        try { if (typeof input !== 'undefined' && input) input.focus(); } catch (e) {}
    }
}

// ============================================================
// INPUTS
// ============================================================
document.getElementById('bf-input')?.addEventListener('input', e => {
    const v = e.target.value;
    updateBFReqs(v);
    updateBFStrength(bfCalcStrength(v));
});

document.getElementById('bf-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !document.getElementById('bf-apply').disabled) {
        const v = e.target.value;
        if (v) onBFChangePassword(v);
    }
});

document.getElementById('bf-apply')?.addEventListener('click', () => {
    const v = document.getElementById('bf-input').value;
    if (v) onBFChangePassword(v);
});

document.getElementById('bf-btn-close')?.addEventListener('click', () => closeBROverlay());
document.getElementById('bf-btn-retry')?.addEventListener('click', () => {
    closeBROverlay(true);
    setTimeout(() => launchBruteforceAttack(), 250);
});

// ============================================================
// AUTO-START DEL SCHEDULER
// ============================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(startBruteforceScheduler, 8000));
} else {
    setTimeout(startBruteforceScheduler, 8000);
}

// Exports
window.launchBruteforceAttack = launchBruteforceAttack;
window.closeBROverlay = closeBROverlay;
window.startBruteforceScheduler = startBruteforceScheduler;
window.stopBruteforceScheduler = stopBruteforceScheduler;