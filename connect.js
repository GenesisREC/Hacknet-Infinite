// ============================================================
// PC BOOT ANIMATION — pantalla de encendido
// ============================================================
const PC_BOOT_LINES = [
    'AMIBIOS (C) 2024 Hacknet Systems Inc.',
    'Version 4.51PG',
    '',
    'CPU: Quantum-Core @ 4.80GHz',
    'Memory Test: 65536K OK',
    '',
    'Detecting IDE drives...',
    '  Primary Master  : HACKNET_SSD 512GB',
    '  Primary Slave   : None',
    '  Secondary Master: None',
    '',
    'Initializing network stack...',
    'Loading kernel modules...',
    '[ OK ] mounting /home',
    '[ OK ] mounting /var',
    '[ OK ] mounting /bin',
    '[ OK ] starting cron.service',
    '[ OK ] starting network.service',
    '[ OK ] starting ssh.service',
    '',
    'SYSTEM READY.',
    ''
];

// ------------------------------------------------------------
// Pantalla inicial: solo el botón de encendido
// ------------------------------------------------------------
// ------------------------------------------------------------
// Pantalla inicial: solo el botón de encendido
// ------------------------------------------------------------
function waitForPowerButton(onPowerOn) {
    const overlay = document.getElementById('pc-boot-overlay');
    if (!overlay) { if (onPowerOn) onPowerOn(); return; }

    overlay.style.display = 'flex';
    overlay.classList.remove('crt-powering', 'crt-on');

    // Botón de power con ícono SVG (no emoji, no caracteres Unicode raros)
    overlay.innerHTML = `
        <div class="pc-power-btn-wrapper">
            <button class="pc-power-btn" id="pc-power-btn" type="button" title="Encender PC" aria-label="Encender PC">
                <svg class="pc-power-icon" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18.36 6.64 a 9 9 0 1 1 -12.73 0"></path>
                    <line x1="12" y1="2" x2="12" y2="12"></line>
                </svg>
            </button>
            <div class="pc-power-hint">PRESIONÁ PARA ENCENDER</div>
        </div>`;

    const btn = document.getElementById('pc-power-btn');
    let pressed = false;

    function press() {
        if (pressed) return;
        pressed = true;

        btn.classList.add('pressed');
        btn.disabled = true;

        if (typeof initAudio === 'function') initAudio();
        if (typeof playBootSound === 'function') {
            try { playBootSound(); } catch(e) {}
        }

        // Delay corto para que se vea el flash del botón
        setTimeout(() => {
            // Restaurar contenido de la pantalla de boot
            overlay.innerHTML = `
                <div class="pc-boot-screen">
                    <div class="pc-boot-text" id="pc-boot-text"></div>
                </div>`;
            overlay.classList.remove('crt-powering', 'crt-on');
            void overlay.offsetWidth;
            overlay.classList.add('crt-powering', 'crt-on');

            if (onPowerOn) onPowerOn();
        }, 380);
    }

    btn.addEventListener('click', press);

    // Enter/Space también encienden (por accesibilidad)
    const keyHandler = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            document.removeEventListener('keydown', keyHandler);
            press();
        }
    };
    document.addEventListener('keydown', keyHandler);
}

// ------------------------------------------------------------
// Tipeo del BIOS (letra por letra, con scroll)
// ------------------------------------------------------------
function playBootTyping(onComplete) {
    const overlay = document.getElementById('pc-boot-overlay');
    const textEl  = document.getElementById('pc-boot-text');
    if (!overlay || !textEl) { if (onComplete) onComplete(); return; }

    textEl.textContent = '';

    let acc = '';
    let lineIdx = 0;
    let charIdx = 0;
    let done = false;
    let skipEnabled = false;

    function scrollDown() {
        const scroller = overlay.querySelector('.pc-boot-screen');
        if (scroller) scroller.scrollTop = scroller.scrollHeight;
    }

    function onKey(e) {
        if (e.key !== 'Enter' && e.key !== 'Escape') return;
        if (!skipEnabled) return;
        e.preventDefault();
        e.stopPropagation();
        finish(true);
    }

    function finish(wasSkipped) {
        if (done) return;
        done = true;
        document.removeEventListener('keydown', onKey);

        if (wasSkipped) {
            textEl.textContent = PC_BOOT_LINES.join('\n');
            scrollDown();
        }

        setTimeout(() => {
            overlay.classList.remove('crt-powering', 'crt-on');
            overlay.style.display = 'none';
            // Restaurar HTML limpio por si se reusa
            overlay.innerHTML = `
                <div class="pc-boot-screen">
                    <div class="pc-boot-text" id="pc-boot-text"></div>
                </div>`;
            if (onComplete) onComplete();
        }, 650);
    }

    function tick() {
        if (done) return;
        if (lineIdx >= PC_BOOT_LINES.length) { finish(false); return; }

        const line = PC_BOOT_LINES[lineIdx];

        if (charIdx < line.length) {
            acc += line[charIdx];
            charIdx++;
            textEl.textContent = acc;
            scrollDown();

            const c = line[charIdx - 1];
            if (c !== ' ' && typeof playTypingSound === 'function') {
                try { playTypingSound(); } catch(e) {}
            }
            setTimeout(tick, 5 + Math.random() * 8);
        } else {
            acc += '\n';
            textEl.textContent = acc;
            scrollDown();
            lineIdx++;
            charIdx = 0;

            const wasBlank = line.trim().length === 0;
            setTimeout(tick, wasBlank ? 130 : 45 + Math.random() * 55);
        }
    }

    // El listener del skip se agrega después del power-on CRT,
    // así un Enter temprano (del botón o del setup) no lo auto-skipea
    setTimeout(() => {
        skipEnabled = true;
        document.addEventListener('keydown', onKey);
        tick();
    }, 1900);
}

// ------------------------------------------------------------
// Secuencia completa: botón → CRT → tipeo
// ------------------------------------------------------------
function showPowerAndBoot(onBootComplete) {
    waitForPowerButton(() => {
        playBootTyping(onBootComplete);
    });
}

// ============================================================
// CONNECT OVERLAY
// ============================================================
function openConnectOverlay(server) {
    gameState.connectOverlayOpen = true;
    const overlay = document.getElementById('connect-overlay');
    overlay.style.display = 'flex';

    document.getElementById('connect-ip-display').textContent = server.ip;
    document.getElementById('connect-info-ip').textContent = server.ip;
    document.getElementById('connect-info-sec').textContent = Math.round(server.securityLevel * 100) + '%';
    document.getElementById('connect-info-sec').className = 'val ' + (server.securityLevel > 0.6 ? 'danger' : 'ok');

    const traceEl = document.getElementById('connect-info-trace');
    if (!server.hasTrace) {
        traceEl.textContent = 'NINGUNO';
        traceEl.className = 'val ok';
    } else if (server.traceLogPath && server.fs[server.traceLogPath]) {
        traceEl.textContent = 'ACTIVO';
        traceEl.className = 'val danger';
    } else {
        traceEl.textContent = 'ARMADO';
        traceEl.className = 'val danger';
    }

    const openCount = server.ports.filter(p => p.state === 'open').length;
    document.getElementById('connect-info-ports').textContent = `${openCount} / ${server.reqPorts}`;
    document.getElementById('connect-info-ports').className = 'val ' + (openCount >= server.reqPorts ? 'ok' : '');

    const formPanel = overlay.querySelector('.connect-form-panel');
    const keyCard = document.getElementById('connect-key-card');
    if (formPanel) formPanel.style.display = 'flex';

    document.getElementById('connect-input-user').value = '';
    document.getElementById('connect-input-pass').value = '';
    document.getElementById('connect-error').textContent = '';

    if (server.savedCredentials) {
        document.getElementById('connect-key-user').textContent = server.savedCredentials.user;
        document.getElementById('connect-key-pass').textContent = '•'.repeat(Math.max(4, server.savedCredentials.pass.length));
        if (keyCard) keyCard.style.display = 'block';
    } else {
        if (keyCard) keyCard.style.display = 'none';
    }

    const hintEl = overlay.querySelector('.connect-hint');
    if (hintEl) {
        if (gameState.isAuthenticated) {
            hintEl.textContent = '✓ Sesión autenticada';
        } else if (server.accessed) {
            hintEl.textContent = '⚠ Firewall vulnerado';
        } else {
            hintEl.textContent = '⚠ Acceso bloqueado';
        }
    }

    input.disabled = true;
    setTimeout(() => {
        const u = document.getElementById('connect-input-user');
        if (u && !gameState.isAuthenticated) u.focus();
    }, 100);
    updateUI();
}

function closeConnectOverlay(disconnect) {
    gameState.connectOverlayOpen = false;
    document.getElementById('connect-overlay').style.display = 'none';
    if (disconnect) {
        if (gameState.currentServer) resetServerAccess(gameState.currentServer);
        gameState.isConnected = false;
        gameState.isAuthenticated = false;
        gameState.currentIP = null;
        gameState.currentServer = null;
        remoteFS = {};
        remoteCWD = '/home/user';
        killAllProcesses();
        stopTrace();
        output.innerHTML += `<span class="text-warning">Conexión cancelada.</span><br>`;
        output.scrollTop = output.scrollHeight;
    }
    if (!gameState.isDeleting && !gameState.isGameOver) {
        input.disabled = false;
        input.focus();
    }
    lastProcessSignature = '__force__';
    updateUI();
    saveGame();
}

function cancelConnect() {
    closeConnectOverlay(true);
}

function openTerminalFromConnect() {
    const server = gameState.currentServer;
    if (!server) { closeConnectOverlay(true); return; }
    closeConnectOverlay(false);
    let html = `<div class="msg-box"><span class="text-success">[✓] Terminal abierta en ${server.ip}.</span>`;
    if (!server.accessed) {
        html += `<br><span class="text-muted">Acceso bloqueado.</span>`;
    } else if (!gameState.isAuthenticated) {
        html += `<br><span class="text-warning">Sesión sin autenticar.</span>`;
    } else {
        html += `<br><span class="text-muted">Sesión autenticada como </span><span class="text-info">${server.savedCredentials ? server.savedCredentials.user : server.credentials.user}</span><span class="text-muted">.</span>`;
    }
    html += `</div>`;
    output.innerHTML += html;
    output.scrollTop = output.scrollHeight;
}

function submitConnectForm() {
    const server = gameState.currentServer;
    if (!server) return;
    const userInput = document.getElementById('connect-input-user');
    const passInput = document.getElementById('connect-input-pass');
    const errEl = document.getElementById('connect-error');
    const user = userInput.value.trim();
    const pass = passInput.value;
    errEl.textContent = '';

    if (!user || !pass) {
        errEl.textContent = '! Introduce usuario y contraseña.';
        return;
    }
    const cred = server.credentials;
    if (user === cred.user && pass === cred.pass) {
        gameState.isAuthenticated = true;
        server.savedCredentials = { user: cred.user, pass: cred.pass };
        output.innerHTML += `<div class="msg-box"><span class="text-success">[✓] Autenticado como ${cred.user}@${server.ip}.</span><br><span class="text-muted">💾 Credenciales guardadas para futuras conexiones.</span></div>`;
        closeConnectOverlay(false);
        output.scrollTop = output.scrollHeight;
        saveGame();
    } else {
        errEl.textContent = '! Usuario o contraseña incorrectos.';
        passInput.value = '';
        passInput.focus();
    }
}

function loginWithConnectKey() {
    const server = gameState.currentServer;
    if (!server || !server.savedCredentials) return;
    gameState.isAuthenticated = true;
    output.innerHTML += `<div class="msg-box"><span class="text-success">[✓] Acceso concedido con clave guardada. Bienvenido, ${server.savedCredentials.user}.</span></div>`;
    closeConnectOverlay(false);
    output.scrollTop = output.scrollHeight;
    saveGame();
}

document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('connect-overlay');
    if (!overlay || overlay.style.display !== 'flex') return;
    if (e.target && e.target.tagName === 'BUTTON') return;
    if (e.key === 'Enter') { e.preventDefault(); submitConnectForm(); }
    else if (e.key === 'Escape') { e.preventDefault(); openTerminalFromConnect(); }
});

// ============================================================
// HACKNET FORM
// ============================================================
function openHacknetForm() {
    document.getElementById('hacknet-form-overlay').style.display = 'flex';
    gameState.hacknetFormMode = gameState.missionAccount ? 'login' : 'register';
    renderHacknetForm();
}

function closeHacknetForm() {
    document.getElementById('hacknet-form-overlay').style.display = 'none';
    if (!gameState.isConnected && !gameState.isGameOver) {
        input.disabled = false;
        input.focus();
    }
}

function switchHacknetForm(mode) {
    if (mode === 'register' && gameState.missionAccount) {
        document.getElementById('hacknet-form-error').textContent = '! Ya existe una cuenta registrada.';
        return;
    }
    gameState.hacknetFormMode = mode;
    renderHacknetForm();
}

function renderHacknetForm() {
    const mode = gameState.hacknetFormMode;
    const titleEl  = document.getElementById('hacknet-form-title');
    const btnEl    = document.getElementById('hacknet-form-submit');
    const linkEl   = document.getElementById('hacknet-form-link');
    const gomailEl = document.getElementById('hacknet-input-gomail');
    const errorEl  = document.getElementById('hacknet-form-error');
    const keyCard  = document.getElementById('hacknet-saved-key-card');

    document.getElementById('hacknet-input-user').value = '';
    document.getElementById('hacknet-input-pass').value = '';
    if (gomailEl) gomailEl.value = '';
    errorEl.textContent = '';

    if (mode === 'register') {
        titleEl.textContent = 'Register';
        btnEl.textContent = 'Create Account';
        if (gomailEl) gomailEl.style.display = 'block';
        linkEl.innerHTML = `Already have an account - <a onclick="switchHacknetForm('login')">click here</a>`;
    } else {
        titleEl.textContent = 'Login';
        btnEl.textContent = 'Sign In';
        if (gomailEl) gomailEl.style.display = 'none';
        linkEl.innerHTML = `Don't have an account - <a onclick="switchHacknetForm('register')">click here</a>`;
    }

    if (mode === 'login' && gameState.missionAccount) {
        document.getElementById('hacknet-saved-key-user').textContent = gameState.missionAccount.username;
        document.getElementById('hacknet-saved-key-pass').textContent =
            '•'.repeat(Math.max(4, gameState.missionAccount.password.length));
        if (keyCard) keyCard.style.display = 'block';
    } else {
        if (keyCard) keyCard.style.display = 'none';
    }

    setTimeout(() => {
        const u = document.getElementById('hacknet-input-user');
        if (u) u.focus();
    }, 100);
}

function submitHacknetForm() {
    const mode = gameState.hacknetFormMode;
    const userInput = document.getElementById('hacknet-input-user');
    const passInput = document.getElementById('hacknet-input-pass');
    const errEl = document.getElementById('hacknet-form-error');
    const user = userInput.value.trim();
    const pass = passInput.value;
    errEl.textContent = '';

    if (mode === 'register') {
        if (gameState.missionAccount) { errEl.textContent = '! Ya existe una cuenta.'; return; }
        if (user.length < 3) { errEl.textContent = '! Usuario: mínimo 3 caracteres.'; return; }
        if (pass.length < 4) { errEl.textContent = '! Contraseña: mínimo 4 caracteres.'; return; }

        const gomailEl = document.getElementById('hacknet-input-gomail');
        const gomailUser = gomailEl ? gomailEl.value.trim() : '';
        if (!gomailUser) { errEl.textContent = '! Necesitás vincular un usuario de GoMail.'; return; }
        if (!gameState.gomailAccount) {
            errEl.textContent = '! No tenés cuenta de GoMail. Creala primero en gomail.com.';
            return;
        }
        if (gomailUser !== gameState.gomailAccount.username) {
            errEl.textContent = '! Ese usuario de GoMail no coincide con tu cuenta.';
            return;
        }

        gameState.missionAccount = { username: user, password: pass };
        gameState.gomailLinked = true;
        gameState.hacknetSession = true;
        closeHacknetForm();
        output.innerHTML += `<span class="text-success">[✓] Cuenta HackNet creada: ${user}</span><br>`;
        output.innerHTML += `<span class="text-muted">Vinculada a ${gomailUser}@gomail.com</span><br>`;
        output.scrollTop = output.scrollHeight;
        enterHacknet();
        saveGame();
        return;
    }

    if (!gameState.missionAccount) { errEl.textContent = '! Sin cuenta. Registrate primero.'; return; }
    if (user === gameState.missionAccount.username && pass === gameState.missionAccount.password) {
        gameState.hacknetSession = true;
        closeHacknetForm();
        enterHacknet();
        saveGame();
    } else {
        errEl.textContent = '! Usuario o contraseña incorrectos.';
        passInput.value = '';
        passInput.focus();
    }
}

function loginWithSavedHacknetKey() {
    if (!gameState.missionAccount) return;
    gameState.hacknetSession = true;
    closeHacknetForm();
    enterHacknet();
    saveGame();
}

// ============================================================
// GOMAIL FORM
// ============================================================
function openGomailForm() {
    document.getElementById('gomail-form-overlay').style.display = 'flex';
    gameState.gomailFormMode = gameState.gomailAccount ? 'login' : 'register';
    renderGomailForm();
}

function closeGomailForm() {
    document.getElementById('gomail-form-overlay').style.display = 'none';
    if (!gameState.isConnected && !gameState.isGameOver) {
        input.disabled = false;
        input.focus();
    }
}

function switchGomailForm(mode) {
    if (mode === 'register' && gameState.gomailAccount) {
        document.getElementById('gomail-form-error').textContent = '! Ya existe una cuenta registrada.';
        return;
    }
    gameState.gomailFormMode = mode;
    renderGomailForm();
}

function renderGomailForm() {
    const mode = gameState.gomailFormMode;
    const titleEl = document.getElementById('gomail-form-title');
    const btnEl   = document.getElementById('gomail-form-submit');
    const linkEl  = document.getElementById('gomail-form-link');
    const errorEl = document.getElementById('gomail-form-error');
    const keyCard = document.getElementById('gomail-saved-key-card');

    document.getElementById('gomail-input-user').value = '';
    document.getElementById('gomail-input-pass').value = '';
    errorEl.textContent = '';

    if (mode === 'register') {
        titleEl.textContent = 'Register';
        btnEl.textContent = 'Create Account';
        linkEl.innerHTML = `Already have an account - <a onclick="switchGomailForm('login')">click here</a>`;
    } else {
        titleEl.textContent = 'Login';
        btnEl.textContent = 'Sign In';
        linkEl.innerHTML = `Don't have an account - <a onclick="switchGomailForm('register')">click here</a>`;
    }

    if (mode === 'login' && gameState.gomailAccount) {
        document.getElementById('gomail-saved-key-user').textContent = gameState.gomailAccount.username;
        document.getElementById('gomail-saved-key-pass').textContent =
            '•'.repeat(Math.max(4, gameState.gomailAccount.password.length));
        if (keyCard) keyCard.style.display = 'block';
    } else {
        if (keyCard) keyCard.style.display = 'none';
    }

    setTimeout(() => {
        const u = document.getElementById('gomail-input-user');
        if (u) u.focus();
    }, 100);
}

function submitGomailForm() {
    const mode = gameState.gomailFormMode;
    const userInput = document.getElementById('gomail-input-user');
    const passInput = document.getElementById('gomail-input-pass');
    const errEl = document.getElementById('gomail-form-error');
    const user = userInput.value.trim();
    const pass = passInput.value;
    errEl.textContent = '';

    if (mode === 'register') {
        if (gameState.gomailAccount) { errEl.textContent = '! Ya existe una cuenta.'; return; }
        if (user.length < 3) { errEl.textContent = '! Usuario: mínimo 3 caracteres.'; return; }
        if (pass.length < 4) { errEl.textContent = '! Contraseña: mínimo 4 caracteres.'; return; }

        gameState.gomailAccount = { username: user, password: pass };
        gameState.gomailSession = true;
        closeGomailForm();
        output.innerHTML += `<span class="text-success">[✓] Cuenta GoMail creada: ${user}@gomail.com</span><br>`;
        output.scrollTop = output.scrollHeight;
        openGomailWeb();
        saveGame();
        return;
    }

    if (!gameState.gomailAccount) { errEl.textContent = '! Sin cuenta. Registrate primero.'; return; }
    if (user === gameState.gomailAccount.username && pass === gameState.gomailAccount.password) {
        gameState.gomailSession = true;
        closeGomailForm();
        openGomailWeb();
        saveGame();
    } else {
        errEl.textContent = '! Usuario o contraseña incorrectos.';
        passInput.value = '';
        passInput.focus();
    }
}

function loginWithSavedGomailKey() {
    if (!gameState.gomailAccount) return;
    gameState.gomailSession = true;
    closeGomailForm();
    openGomailWeb();
    saveGame();
}

// ============================================================
// GOMAIL WEBMAIL
// ============================================================
function openGomailWeb() {
    gameState.inGomail = true;
    gameState.gomailSession = true;
    gameState.isConnected = false;
    gameState.isAuthenticated = false;
    gameState.currentIP = null;
    gameState.currentServer = null;

    document.getElementById('gomail-web-overlay').style.display = 'flex';
    input.disabled = true;

    document.getElementById('gomail-web-user').textContent =
        gameState.gomailAccount ? '@' + gameState.gomailAccount.username : '-';

    renderGomailWeb();
    updateUI();
}

function closeGomailWeb() {
    document.getElementById('gomail-web-overlay').style.display = 'none';
    gameState.inGomail = false;
    gameState.gomailSession = false;
    gameState.isConnected = false;
    gameState.currentIP = null;
    gameState.currentServer = null;

    output.innerHTML += `<span class="text-warning">Sesión de GoMail cerrada.</span><br>`;
    output.scrollTop = output.scrollHeight;
    updateUI();
    saveGame();

    if (!gameState.isGameOver && !gameState.connectOverlayOpen) {
        input.disabled = false;
        input.focus();
    }
}

function renderGomailWeb(view) {
    const content = document.getElementById('gomail-web-content');
    const backBtn = document.getElementById('gomail-back-btn');
    const urlEl   = document.getElementById('gomail-web-url');
    if (!content) return;

    if (!view || view.type === 'inbox') {
        backBtn.style.display = 'none';
        urlEl.textContent = 'https://gomail.com/inbox';

        const inbox = gameState.gomailInbox || [];
        let html = `<div class="webmail-inbox-title">📥 Bandeja de entrada
            <span class="webmail-badge">${inbox.length} mensaje${inbox.length === 1 ? '' : 's'}</span>
        </div>`;

        if (inbox.length === 0) {
            html += `<div class="webmail-empty">
                No tenés mensajes todavía.
                <br><span style="opacity:0.7; font-size:0.85em;">Acá van a llegar los mails de HackNet.</span>
            </div>`;
        } else {
            inbox.forEach(m => {
                const unreadCls = m.read ? '' : ' webmail-row-unread';
                html += `<div class="webmail-row${unreadCls}" onclick="openGomailEmail('${m.id}')">
                    <div class="webmail-row-left">${m.read ? '📧' : '✉'}</div>
                    <div class="webmail-row-mid">
                        <div class="webmail-row-from">${m.from}</div>
                        <div class="webmail-row-subject">${m.subject}</div>
                    </div>
                    <div class="webmail-row-time">${m.time}</div>
                </div>`;
            });
        }
        content.innerHTML = html;

    } else if (view.type === 'email') {
        backBtn.style.display = 'inline-block';
        urlEl.textContent = 'https://gomail.com/email/' + view.id;

        const m = (gameState.gomailInbox || []).find(x => x.id === view.id);
        if (!m) {
            content.innerHTML = `<div class="webmail-empty">Mensaje no encontrado.</div>`;
            return;
        }
        m.read = true;

        const myUser = gameState.gomailAccount ? gameState.gomailAccount.username : 'user';
        content.innerHTML = `<div class="webmail-email">
            <div class="webmail-email-header">
                <div class="webmail-email-subject">${m.subject}</div>
                <div class="webmail-email-meta">
                    <div><span class="webmail-label">De:</span> ${m.from}</div>
                    <div><span class="webmail-label">Para:</span> ${myUser}@gomail.com</div>
                    <div><span class="webmail-label">Hora:</span> ${m.time}</div>
                </div>
            </div>
            <div class="webmail-email-body">${(m.body || '').replace(/\n/g, '<br>')}</div>
        </div>`;
    }
}

function openGomailEmail(id) {
    renderGomailWeb({ type: 'email', id });
    saveGame();
}

function gomailBackToInbox() {
    renderGomailWeb({ type: 'inbox' });
}

// ============================================================
// SETUP INICIAL (solo el form — el boot lo dispara main.js)
// ============================================================
let _setupUserHandler = null;
let _setupPassHandler = null;

function startSetup() {
    const overlay = document.getElementById('setup-overlay');
    const titleEl    = overlay.querySelector('.setup-title');
    const subtitleEl = overlay.querySelector('.setup-subtitle');
    const box        = overlay.querySelector('.setup-box');

    overlay.style.display = 'flex';

    // Ocultar el form mientras carga
    if (titleEl)    titleEl.style.display = 'none';
    if (subtitleEl) subtitleEl.style.display = 'none';
    if (box)        box.style.display = 'none';

    // Inyectar/reusar el loader
    let loader = overlay.querySelector('.setup-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.className = 'setup-loader';
        loader.innerHTML = `
            <div class="setup-loader-title">HACKNET INFINITE</div>
            <div class="setup-loader-status">
                <span class="setup-loader-dot"></span>
                <span class="setup-loader-text" id="setup-loader-text">Inicializando sistema</span>
            </div>
            <div class="setup-loader-bar">
                <div class="setup-loader-bar-fill" id="setup-loader-bar-fill"></div>
            </div>
            <div class="setup-loader-percent" id="setup-loader-percent">0%</div>
        `;
        overlay.appendChild(loader);
    } else {
        loader.style.display = 'flex';
    }

    const barFill   = document.getElementById('setup-loader-bar-fill');
    const percentEl = document.getElementById('setup-loader-percent');
    const textEl    = document.getElementById('setup-loader-text');

    barFill.style.width = '0%';
    percentEl.textContent = '0%';

    const steps = [
        { pct: 12, text: 'Inicializando sistema' },
        { pct: 28, text: 'Cargando módulos del kernel' },
        { pct: 46, text: 'Montando filesystems' },
        { pct: 63, text: 'Iniciando servicios de red' },
        { pct: 80, text: 'Preparando entorno de usuario' },
        { pct: 100, text: 'Sistema listo' }
    ];

    let stepIdx = 0;
    let currentPct = 0;

    function nextStep() {
        if (stepIdx >= steps.length) {
            // Terminó → revelar el form
            setTimeout(() => {
                loader.style.display = 'none';
                if (titleEl)    titleEl.style.display = '';
                if (subtitleEl) subtitleEl.style.display = '';
                if (box)        box.style.display = '';

                _bindSetupForm();
            }, 400);
            return;
        }

        const step = steps[stepIdx];
        textEl.textContent = step.text;

        // Sonido de tecleo al cambiar texto
        if (typeof playTypingSound === 'function') {
            try { playTypingSound(); } catch(e) {}
        }

        const target = step.pct;
        const interval = setInterval(() => {
            if (currentPct >= target) {
                clearInterval(interval);
                stepIdx++;
                setTimeout(nextStep, 220 + Math.random() * 180);
                return;
            }
            currentPct++;
            barFill.style.width = currentPct + '%';
            percentEl.textContent = currentPct + '%';

            // Tick sutil cada 8% de progreso
            if (currentPct % 8 === 0 && typeof playKeyClick === 'function') {
                try { playKeyClick(); } catch(e) {}
            }
        }, 16);
    }

    // Pequeño delay inicial para que se vea el fade-in
    setTimeout(nextStep, 400);
}

function _bindSetupForm() {
    const overlay   = document.getElementById('setup-overlay');
    const userInput = document.getElementById('setup-user');
    const passInput = document.getElementById('setup-pass');
    const errorEl   = document.getElementById('setup-error');

    userInput.value = '';
    passInput.value = '';
    errorEl.textContent = '';

    setTimeout(() => userInput.focus(), 100);

    // Limpiar listeners previos
    if (_setupUserHandler) {
        userInput.removeEventListener('keydown', _setupUserHandler);
        _setupUserHandler = null;
    }
    if (_setupPassHandler) {
        passInput.removeEventListener('keydown', _setupPassHandler);
        _setupPassHandler = null;
    }

    function validateUser() {
        errorEl.textContent = '';
        const val = userInput.value.trim();
        if (val.length < 2) {
            errorEl.textContent = '! El usuario debe tener al menos 2 caracteres';
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(val)) {
            errorEl.textContent = '! Solo letras, números y guiones bajos';
            return false;
        }
        gameState.localUser = val;
        return true;
    }

    function validatePass() {
        errorEl.textContent = '';
        const val = passInput.value;
        if (val.length < 4) {
            errorEl.textContent = '! La contraseña debe tener al menos 4 caracteres';
            return false;
        }
        gameState.localPass = val;
        return true;
    }

    function finishSetup() {
        gameState.setupComplete = true;
        overlay.style.display = 'none';

        if (!gameState.servers || gameState.servers.length === 0) {
            generateNetwork();
        }
        saveGame();

        output.innerHTML =
            `<span class="text-success">[✓] PC configurada: ${gameState.localUser}@local</span><br>` +
            `<span class="text-muted">Bienvenido a Hacknet Infinite. Escribe 'help' para ver los comandos.</span><br><br>`;

        updateUI();

        // Reveal progresivo del HUD + tutorial al final
        revealHUDProgressive(() => {
            input.disabled = false;
            input.focus();

            if (typeof openTutorial === 'function') {
                setTimeout(() => openTutorial(), 500);
            }
        });
    }

    _setupUserHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            if (document.activeElement === passInput) {
                if (validatePass()) finishSetup();
                return;
            }
            if (document.activeElement === userInput) {
                if (validateUser()) passInput.focus();
                return;
            }
        }
    };

    _setupPassHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            if (document.activeElement === userInput) {
                if (validateUser()) passInput.focus();
                return;
            }
            if (document.activeElement === passInput) {
                if (!gameState.localUser || gameState.localUser === 'user') {
                    if (!validateUser()) { userInput.focus(); return; }
                }
                if (validatePass()) finishSetup();
            }
        }
    };

    userInput.addEventListener('keydown', _setupUserHandler);
    passInput.addEventListener('keydown', _setupPassHandler);
}
// ============================================================
// REVEAL PROGRESIVO DEL HUD — top-bar → right → center
// ============================================================
function revealHUDProgressive(onComplete) {
    const topBar      = document.querySelector('.top-bar');
    const centerPanel = document.querySelector('.center-panel');
    const rightPanel  = document.querySelector('.right-panel');

    // Aseguramos que el body arranca con las clases correctas
    document.body.classList.add('booting');
    document.body.classList.remove('boot-topbar', 'boot-right', 'boot-center', 'ui-visible');

    // ─────────────────────────────────────────────
    // FASE 1 — TOP-BAR
    // ─────────────────────────────────────────────
    document.body.classList.add('boot-topbar');
    if (topBar) topBar.classList.add('loading');

    setTimeout(() => {
        if (topBar) topBar.classList.remove('loading');

        setTimeout(() => {
            // ─────────────────────────────────────────────
            // FASE 2 — RIGHT-PANEL (RAM + procesos)
            // ─────────────────────────────────────────────
            document.body.classList.add('boot-right');
            if (rightPanel) rightPanel.classList.add('loading');

            setTimeout(() => {
                if (rightPanel) rightPanel.classList.remove('loading');

                setTimeout(() => {
                    // ─────────────────────────────────────────────
                    // FASE 3 — CENTER-PANEL (terminal)
                    // ─────────────────────────────────────────────
                    document.body.classList.add('boot-center');
                    if (centerPanel) centerPanel.classList.add('loading');

                    setTimeout(() => {
                        if (centerPanel) centerPanel.classList.remove('loading');

                        // Todo listo → destrabar body
                        document.body.classList.remove(
                            'booting', 'boot-topbar', 'boot-right', 'boot-center'
                        );
                        document.body.classList.add('ui-visible');

                        if (onComplete) onComplete();
                    }, 950);       // center-panel: 950ms con spinner
                }, 300);           // pausa antes de mostrar center
            }, 900);               // right-panel: 900ms con spinner
        }, 300);                   // pausa antes de mostrar right
    }, 800);                       // top-bar: 800ms con spinner
}