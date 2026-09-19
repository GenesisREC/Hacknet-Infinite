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
    // FIX: construir el HTML completo antes de asignarlo (evita divs huérfanos)
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

// Referencias persistentes para poder remover listeners cuando se re-llama startSetup()
let _setupUserHandler = null;
let _setupPassHandler = null;

function startSetup() {
    const overlay = document.getElementById('setup-overlay');
    overlay.style.display = 'flex';
    const userInput = document.getElementById('setup-user');
    const passInput = document.getElementById('setup-pass');
    const errorEl = document.getElementById('setup-error');
    userInput.value = '';
    passInput.value = '';
    errorEl.textContent = '';
    userInput.focus();

    // Limpiar listeners previos si existían
    if (_setupUserHandler) {
        userInput.removeEventListener('keydown', _setupUserHandler);
        _setupUserHandler = null;
    }
    if (_setupPassHandler) {
        passInput.removeEventListener('keydown', _setupPassHandler);
        _setupPassHandler = null;
    }

    // Validar y avanzar usuario
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

    // Validar y finalizar contraseña
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
        generateNetwork();
        updateUI();
        output.innerHTML = `<span class="text-success">[✓] PC configurada: ${gameState.localUser}@local</span><br>` +
                           `<span class="text-muted">Bienvenido a Hacknet Infinite. Escribe 'help' para ver los comandos.</span><br><br>`;
        input.disabled = false;
        saveGame();
        input.focus();
    }

    // Handler único que chequea QUIÉN tiene el foco real
    _setupUserHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Si el foco está en el password → estamos procesando la pass
            if (document.activeElement === passInput) {
                if (validatePass()) finishSetup();
                return;
            }
            // Si el foco está en el user → validar y saltar al pass
            if (document.activeElement === userInput) {
                if (validateUser()) passInput.focus();
                return;
            }
        }
    };

    _setupPassHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Mismo handler — chequea el foco real
            if (document.activeElement === userInput) {
                if (validateUser()) passInput.focus();
                return;
            }
            if (document.activeElement === passInput) {
                // Si todavía no validamos el user (porque el jugador clickeó
                // directo en el pass sin pasar por el user), validarlo primero
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