// ============================================================
// INFOMARKET — Mercado de la dark web
// ============================================================
// Estructura: form login/register + overlay web con dashboard.

function getFileValue(fileName, fileData) {
    if (!fileData || fileData.type !== 'file') return 0;
    if (fileData.isExecutable) return 0;
    if (fileData.isTraceLog) return 0;
    if (fileData.isProtectedZip) return 0;
    if ((fileName || '').toLowerCase().endsWith('.zip')) return 0;
    if (fileData.value !== undefined && fileData.value > 0) return fileData.value;
    return 0;
}

// ============================================================
// LOGIN / REGISTER FORM
// ============================================================
function openMarketForm() {
    marketFormOverlay.style.display = 'flex';
    gameState.marketFormMode = gameState.marketAccount ? 'login' : 'register';
    renderMarketForm();
}

function closeMarketForm() {
    marketFormOverlay.style.display = 'none';
    if (!gameState.inMarket && !gameState.isGameOver) input.focus();
}

function switchMarketForm(mode) {
    if (mode === 'register' && gameState.marketAccount) {
        document.getElementById('market-form-error').textContent = '! Ya existe una cuenta.';
        return;
    }
    gameState.marketFormMode = mode;
    renderMarketForm();
}

function renderMarketForm() {
    const mode = gameState.marketFormMode;
    const titleEl = document.getElementById('market-form-title');
    const btnEl = document.getElementById('market-form-submit');
    const linkEl = document.getElementById('market-form-link');
    const errorEl = document.getElementById('market-form-error');
    const urlEl = document.querySelector('#market-form-overlay .url');
    const savedCard = document.getElementById('saved-key-card');
    document.getElementById('market-input-user').value = '';
    document.getElementById('market-input-pass').value = '';
    errorEl.textContent = '';
    if (mode === 'login') {
        titleEl.textContent = 'Login'; btnEl.textContent = 'Sign In';
        urlEl.textContent = 'https://market.onion/login';
        linkEl.innerHTML = gameState.marketAccount
            ? `Forgot your account? - <a onclick="switchMarketForm('register')">use a different one</a>`
            : `Don't have an account - <a onclick="switchMarketForm('register')">click here</a>`;
    } else {
        titleEl.textContent = 'Register'; btnEl.textContent = 'Create Account';
        urlEl.textContent = 'https://market.onion/register';
        linkEl.innerHTML = `Already have an account - <a onclick="switchMarketForm('login')">click here</a>`;
    }
    if (mode === 'login' && gameState.marketAccount) {
        document.getElementById('saved-key-user').textContent = gameState.marketAccount.username;
        document.getElementById('saved-key-pass').textContent = '•'.repeat(Math.max(4, gameState.marketAccount.password.length));
        savedCard.style.display = 'block';
    } else savedCard.style.display = 'none';
    setTimeout(() => document.getElementById('market-input-user').focus(), 100);
}

function loginWithSavedKey() {
    if (!gameState.marketAccount) return;
    gameState.marketSession = true;
    closeMarketForm();
    output.innerHTML += `<span class="text-success">[✓] Bienvenido, ${gameState.marketAccount.username}.</span><br>`;
    output.scrollTop = output.scrollHeight;
    openMarketWeb();
    saveGame();
}

function submitMarketForm() {
    const userInput = document.getElementById('market-input-user');
    const passInput = document.getElementById('market-input-pass');
    const errorEl = document.getElementById('market-form-error');
    const mode = gameState.marketFormMode;
    const user = userInput.value.trim();
    const pass = passInput.value;
    errorEl.textContent = '';
    if (mode === 'register') {
        if (gameState.marketAccount) { errorEl.textContent = '! Ya existe una cuenta.'; return; }
        if (user.length < 3 || user.length > 24) { errorEl.textContent = '! Usuario entre 3 y 24 caracteres.'; return; }
        if (pass.length < 4) { errorEl.textContent = '! Contraseña mínima de 4 caracteres.'; return; }
        gameState.marketAccount = { username: user, password: pass };
        gameState.marketSession = true;
        closeMarketForm();
        output.innerHTML += `<span class="text-success">[✓] Cuenta creada: ${user}</span><br>`;
        output.scrollTop = output.scrollHeight;
        openMarketWeb();
        saveGame();
        return;
    }
    if (!gameState.marketAccount) { errorEl.textContent = '! Sin cuenta. Registrate primero.'; return; }
    if (user === gameState.marketAccount.username && pass === gameState.marketAccount.password) {
        gameState.marketSession = true;
        closeMarketForm();
        output.innerHTML += `<span class="text-success">[✓] Sesión iniciada como ${user}</span><br>`;
        output.scrollTop = output.scrollHeight;
        openMarketWeb();
        saveGame();
    } else {
        errorEl.textContent = '! Usuario o contraseña incorrectos.';
        passInput.value = '';
        passInput.focus();
    }
}

document.addEventListener('keydown', (e) => {
    if (marketFormOverlay.style.display !== 'flex') return;
    if (e.key === 'Enter') { e.preventDefault(); submitMarketForm(); }
    else if (e.key === 'Escape') { e.preventDefault(); closeMarketForm(); }
});

// ============================================================
// MARKET WEB OVERLAY
// ============================================================
function openMarketWeb() {
    gameState.inMarket = true;
    gameState.isConnected = false;
    gameState.isAuthenticated = false;
    gameState.currentIP = null;
    gameState.currentServer = null;
    if (typeof stopTrace === 'function') stopTrace();
    const overlay = document.getElementById('market-web-overlay');
    overlay.style.display = 'flex';
    input.disabled = true;
    document.getElementById('market-web-user').textContent =
        gameState.marketAccount ? '@' + gameState.marketAccount.username : '-';
    renderMarketWeb();
    updateUI();
}

function closeMarketWeb() {
    document.getElementById('market-web-overlay').style.display = 'none';
    gameState.inMarket = false;
    gameState.marketSession = false;
    output.innerHTML += `<span class="text-warning">Sesión de InfoMarket cerrada.</span><br>`;
    output.scrollTop = output.scrollHeight;
    updateUI();
    saveGame();
    if (!gameState.isGameOver && !gameState.connectOverlayOpen) {
        input.disabled = false;
        input.focus();
    }
}

function renderMarketWeb() {
    const content = document.getElementById('market-web-content');
    if (!content) return;
    const balance = gameState.money || 0;
    document.getElementById('market-web-balance').textContent = balance.toLocaleString();

    let html = '';

    // ==== VENDER ARCHIVOS ====
    const dl = localFS['/download'];
    const sellableFiles = [];
    if (dl && dl.children) {
        dl.children.forEach(childName => {
            const file = localFS['/download/' + childName];
            if (!file || file.type !== 'file') return;
            const value = getFileValue(childName, file);
            if (value > 0) sellableFiles.push({ name: childName, file, value });
        });
    }

    html += `<div class="market-section">
        <div class="market-section-title">📁 VENDER ARCHIVOS</div>`;
    if (sellableFiles.length === 0) {
        html += `<div class="market-empty">
            No tenés archivos vendibles en /download.
            <br><span style="opacity:0.7; font-size:0.85em;">Hackeá servers y bajá archivos con <code>scp</code> para venderlos acá.</span>
        </div>`;
    } else {
        html += `<div class="market-file-list">`;
        sellableFiles.forEach(({ name, file, value }) => {
            const safeName = name.replace(/'/g, "\\'");
            html += `<div class="market-file-row">
                <div class="market-file-icon">📄</div>
                <div class="market-file-info">
                    <div class="market-file-name">${name}</div>
                    <div class="market-file-meta">${file.size.toFixed(1)} KB · ${file.category || 'archivo'}</div>
                </div>
                <div class="market-file-value">+${value.toLocaleString()} CR</div>
                <button class="market-btn market-btn-sell" onclick="sellMarketFile('${safeName}')">VENDER</button>
            </div>`;
        });
        html += `</div>`;
        const total = sellableFiles.reduce((a, f) => a + f.value, 0);
        html += `<div class="market-section-footer">Total estimado: <b>${total.toLocaleString()} CR</b></div>`;
    }
    html += `</div>`;

    // ==== MEJORAS DE HARDWARE ====
    html += `<div class="market-section">
        <div class="market-section-title">⚙️ MEJORAS DE HARDWARE</div>
        <div class="market-upgrade-grid">`;

    // RAM
    const nextRam = RAM_UPGRADES[gameState.ramUpgradeLevel];
    if (nextRam) {
        const canAfford = balance >= nextRam.price;
        html += `<div class="market-upgrade-card">
            <div class="market-upgrade-icon">🧠</div>
            <div class="market-upgrade-name">RAM</div>
            <div class="market-upgrade-current">Actual: ${gameState.maxRam.toFixed(1)} GB</div>
            <div class="market-upgrade-next">→ ${nextRam.ram.toFixed(1)} GB</div>
            <div class="market-upgrade-price">${nextRam.price.toLocaleString()} CR</div>
            <button class="market-btn ${canAfford ? 'market-btn-buy' : 'market-btn-disabled'}"
                ${canAfford ? `onclick="buyMarketUpgrade('ram')"` : 'disabled'}>
                ${canAfford ? 'COMPRAR' : 'SIN FONDOS'}
            </button>
        </div>`;
    } else {
        html += `<div class="market-upgrade-card market-upgrade-maxed">
            <div class="market-upgrade-icon">🧠</div>
            <div class="market-upgrade-name">RAM</div>
            <div class="market-upgrade-maxed-text">✓ MÁXIMO</div>
            <div class="market-upgrade-current">${gameState.maxRam.toFixed(1)} GB</div>
        </div>`;
    }

    // CPU
    const nextCpu = CPU_UPGRADES[gameState.hardware.cpu.level];
    if (nextCpu) {
        const canAfford = balance >= nextCpu.price;
        html += `<div class="market-upgrade-card">
            <div class="market-upgrade-icon">⚡</div>
            <div class="market-upgrade-name">CPU</div>
            <div class="market-upgrade-current">Actual: ${gameState.hardware.cpu.label}</div>
            <div class="market-upgrade-next">→ ${nextCpu.label}</div>
            <div class="market-upgrade-price">${nextCpu.price.toLocaleString()} CR</div>
            <button class="market-btn ${canAfford ? 'market-btn-buy' : 'market-btn-disabled'}"
                ${canAfford ? `onclick="buyMarketUpgrade('cpu')"` : 'disabled'}>
                ${canAfford ? 'COMPRAR' : 'SIN FONDOS'}
            </button>
        </div>`;
    } else {
        html += `<div class="market-upgrade-card market-upgrade-maxed">
            <div class="market-upgrade-icon">⚡</div>
            <div class="market-upgrade-name">CPU</div>
            <div class="market-upgrade-maxed-text">✓ MÁXIMO</div>
            <div class="market-upgrade-current">${gameState.hardware.cpu.label}</div>
        </div>`;
    }

    // Antena
    const nextAnt = ANTENNA_UPGRADES[gameState.hardware.antenna.level];
    if (nextAnt) {
        const canAfford = balance >= nextAnt.price;
        html += `<div class="market-upgrade-card">
            <div class="market-upgrade-icon">📡</div>
            <div class="market-upgrade-name">ANTENA</div>
            <div class="market-upgrade-current">Actual: ${gameState.hardware.antenna.label}</div>
            <div class="market-upgrade-next">→ ${nextAnt.label}</div>
            <div class="market-upgrade-price">${nextAnt.price.toLocaleString()} CR</div>
            <button class="market-btn ${canAfford ? 'market-btn-buy' : 'market-btn-disabled'}"
                ${canAfford ? `onclick="buyMarketUpgrade('antenna')"` : 'disabled'}>
                ${canAfford ? 'COMPRAR' : 'SIN FONDOS'}
            </button>
        </div>`;
    } else {
        html += `<div class="market-upgrade-card market-upgrade-maxed">
            <div class="market-upgrade-icon">📡</div>
            <div class="market-upgrade-name">ANTENA</div>
            <div class="market-upgrade-maxed-text">✓ MÁXIMO</div>
            <div class="market-upgrade-current">${gameState.hardware.antenna.label}</div>
        </div>`;
    }

    html += `</div></div>`;

    // ==== PROGRAMAS ====
    html += `<div class="market-section">
        <div class="market-section-title">💾 PROGRAMAS</div>
        <div class="market-empty">
            No hay programas disponibles por el momento.
            <br><span style="opacity:0.7; font-size:0.85em;">Los crackers se consiguen hackeando servers o completando misiones de HackNet.</span>
        </div>
    </div>`;

    // ==== LOG ====
    html += `<div class="market-log" id="market-log"></div>`;

    content.innerHTML = html;
}

// ============================================================
// ACCIONES
// ============================================================
function marketLog(msg, type) {
    const log = document.getElementById('market-log');
    if (!log) return;
    const color = type === 'error' ? '#ff5577' : (type === 'success' ? '#00ff88' : '#ffcc00');
    const div = document.createElement('div');
    div.className = 'market-log-line';
    div.style.color = color;
    div.textContent = '> ' + msg;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    setTimeout(() => { if (div.parentNode) div.style.opacity = '0.6'; }, 3000);
}

function sellMarketFile(fileName) {
    const file = localFS['/download/' + fileName];
    if (!file || file.type !== 'file') {
        marketLog('Archivo no encontrado: ' + fileName, 'error');
        return;
    }
    const value = getFileValue(fileName, file);
    if (value <= 0) {
        marketLog('Ese archivo no tiene valor.', 'error');
        return;
    }
    delete localFS['/download/' + fileName];
    localFS['/download'].children = localFS['/download'].children.filter(c => c !== fileName);
    gameState.money += value;
    marketLog(`Vendido: ${fileName} (+${value.toLocaleString()} CR)`, 'success');
    if (typeof autoAdvanceMissionsOnEvent === 'function') {
        autoAdvanceMissionsOnEvent({ type: 'sell', amount: value });
    }
if (typeof newsOnMarketSale === 'function') {
    newsOnMarketSale(fileName, value);
}
    updateUI();
    saveGame();
    renderMarketWeb();
}

function buyMarketUpgrade(type) {
    const balance = gameState.money || 0;
    if (type === 'ram') {
        const next = RAM_UPGRADES[gameState.ramUpgradeLevel];
        if (!next) { marketLog('Ya tenés la máxima RAM.', 'error'); return; }
        if (balance < next.price) { marketLog('Fondos insuficientes.', 'error'); return; }
        gameState.money -= next.price;
        gameState.maxRam = next.ram;
        gameState.ramUpgradeLevel++;
        marketLog(`RAM mejorada a ${next.ram.toFixed(1)} GB.`, 'success');
    } else if (type === 'cpu') {
        const next = CPU_UPGRADES[gameState.hardware.cpu.level];
        if (!next) { marketLog('Ya tenés el máximo CPU.', 'error'); return; }
        if (balance < next.price) { marketLog('Fondos insuficientes.', 'error'); return; }
        gameState.money -= next.price;
        gameState.hardware.cpu.level++;
        applyHardwareToState();
        marketLog(`CPU mejorado a ${next.label}.`, 'success');
    } else if (type === 'antenna') {
        const next = ANTENNA_UPGRADES[gameState.hardware.antenna.level];
        if (!next) { marketLog('Ya tenés la máxima antena.', 'error'); return; }
        if (balance < next.price) { marketLog('Fondos insuficientes.', 'error'); return; }
        gameState.money -= next.price;
        gameState.hardware.antenna.level++;
        applyHardwareToState();
        marketLog(`Antena mejorada a ${next.label}.`, 'success');
    }
    updateUI();
    saveGame();
    renderMarketWeb();
}

// Compatibilidad con código viejo
function enterMarketTerminal() { openMarketWeb(); }
function showMarketWelcome() { openMarketWeb(); }