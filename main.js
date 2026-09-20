[
    'news-web-overlay',
    'tutorial-overlay',
    'market-form-overlay',
    'market-web-overlay',
    'hacknet-form-overlay',
    'gomail-form-overlay',
    'gomail-web-overlay',
    'connect-overlay'
].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
});

function renderSuggestions() {
    suggestionBox.innerHTML = '';
    suggestions.forEach((sugRaw, index) => {
        const sug = normalizeSuggestion(sugRaw);
        const div = document.createElement('div');
        div.className = 'suggestion-item' + (index === suggestionIndex ? ' active' : '');
        if (sug.isCred) div.classList.add('cred-suggestion');
        const labelSpan = document.createElement('span');
        labelSpan.textContent = sug.label;
        div.appendChild(labelSpan);
        if (sug.isCred) {
            const tag = document.createElement('span');
            tag.className = 'cred-tag';
            tag.textContent = '[ENTER]';
            div.appendChild(tag);
        }
        div.addEventListener('click', () => { suggestionIndex = index; applySuggestion(); });
        suggestionBox.appendChild(div);
    });
    suggestionBox.style.display = 'block';
}

function updateSuggestionUI() {
    const items = suggestionBox.querySelectorAll('.suggestion-item');
    items.forEach((item, index) => {
        if (index === suggestionIndex) item.classList.add('active'); else item.classList.remove('active');
    });
}

function applySuggestion() {
    const selected = normalizeSuggestion(suggestions[suggestionIndex]);
    if (selected.isCred) {
        input.value = selected.fill;
    } else {
        const parts = input.value.trim().split(' ');
        if (parts.length > 0) parts.pop();
        parts.push(selected.fill);
        input.value = parts.join(' ') + ' ';
    }
    isSuggestionOpen = false;
    suggestionBox.style.display = 'none';
    input.focus();
}

function getSuggestions(inputText) {
    const parts = inputText.trim().split(' ').filter(p => p !== '');
    const currentPart = parts[parts.length - 1] || '';
    let matches = [];

    // ============================================================
    // MODO HACKNET
    // ============================================================
    if (gameState.inHacknet) {
        if (parts.length <= 1) {
            const cmds = ['help', 'missions', 'accept', 'active', 'claim', 'abandon', 'wallet', 'exit', 'disconnect'];
            matches = cmds.filter(c => c.startsWith(currentPart.toLowerCase()));
        } else if (['accept', 'claim', 'abandon'].includes(parts[0].toLowerCase())) {
            const list = parts[0].toLowerCase() === 'accept' ? gameState.missionsAvailable : gameState.missionsActive;
            matches = list.map(m => m.id).filter(id => id.startsWith(currentPart));
        }
        return matches;
    }

   
    // ============================================================
    // MODO GOMAIL (input bloqueado, pero por las dudas)
    // ============================================================
    if (gameState.inGomail) return [];

    // ============================================================
    // MODO TERMINAL
    // ============================================================
    if (parts.length <= 1) {
        const commands = [
    'help', 'ls', 'cd', 'cat', 'rm', 'cp', 'mv',
    'netmap', 'connect', 'disconnect', 'scan',
    'probe', 'run', 'scp', 'unzip', 'login',
    'porthack', 'wallbreaker', 'tools', 'ps',
    'hardware', 'debug', 'clear', 'restart', 'reset'
];
        matches = commands.filter(c => c.startsWith(currentPart.toLowerCase()));
    } else if (parts[0].toLowerCase() === 'connect') {
        const ips = ['market.onion', 'hacknet.onion', 'gomail.com', 'probe.com', 'news.com'];
        gameState.servers.forEach(s => { if (s.discovered) ips.push(s.ip); });
        gameState.missionsActive.forEach(m => { if (m.targetIP && !ips.includes(m.targetIP)) ips.push(m.targetIP); });
        matches = ips.filter(ip => ip.startsWith(currentPart));
    } else if (parts[0].toLowerCase() === 'scan') {
        const ips = [];
        gameState.missionsActive.forEach(m => { if (m.targetIP) ips.push(m.targetIP); });
        gameState.servers.forEach(s => { if (s.discovered) ips.push(s.ip); });
        matches = ips.filter(ip => ip.startsWith(currentPart));
    } else if (parts[0].toLowerCase() === 'run') {
        if (parts.length === 2) matches = localFS['/bin'].children.filter(t => t.startsWith(currentPart));
        else if (parts.length === 3 && gameState.isConnected && gameState.currentServer) {
            matches = gameState.currentServer.ports.map(p => p.port.toString()).filter(p => p.startsWith(currentPart));
        }
    } else if (parts[0].toLowerCase() === 'netmap') {
        if (parts.length === 2) matches = ['scan', 'list', 'remove', 'pin', 'unpin', 'clear'].filter(c => c.startsWith(currentPart));
        else if (parts.length === 3 && ['remove', 'pin', 'unpin'].includes(parts[1].toLowerCase())) {
            matches = gameState.servers.filter(s => s.discovered).map(s => s.ip).filter(ip => ip.startsWith(currentPart));
        }
    } else if (parts[0].toLowerCase() === 'wallbreaker' || parts[0].toLowerCase() === 'wb') {
        if (parts.length === 2) matches = ['analyze', 'table', 'signature', 'break', 'status', 'close'].filter(c => c.startsWith(currentPart.toLowerCase()));
    } else if (['ls', 'cd', 'cat', 'rm'].includes(parts[0].toLowerCase())) {
        const fs = getCurrentFS();
        const dir = fs[getCurrentCWD()];
        if (dir && dir.children) matches = dir.children.filter(c => c.startsWith(currentPart));
    } else if (parts[0].toLowerCase() === 'scp') {
        if (parts.length === 2) {
            const dir = remoteFS[remoteCWD];
            if (dir && dir.children) matches = dir.children.filter(c => c.startsWith(currentPart));
        } else if (parts.length === 3) {
            const dir = localFS[localCWD];
            if (dir && dir.children) matches = dir.children.filter(c => c.startsWith(currentPart));
        }
    } else if (['cp', 'mv'].includes(parts[0].toLowerCase())) {
        if (parts.length === 2) {
            const dir = getCurrentFS()[getCurrentCWD()];
            if (dir && dir.children) matches = dir.children.filter(c => c.startsWith(currentPart));
        }
    } else if (parts[0].toLowerCase() === 'debug') {
        if (parts.length === 2) matches = ['missions', 'spawn', 'complete', 'accept_all', 'clear', 'tier', 'reset_accounts', 'money', 'cpu', 'antenna', 'mail'].filter(c => c.startsWith(currentPart.toLowerCase()));
    } else if (parts[0].toLowerCase() === 'reset') {
        if (parts.length === 2) matches = ['confirm'].filter(c => c.startsWith(currentPart.toLowerCase()));
    } else if (parts[0].toLowerCase() === 'trace-speed') {
        matches = [];
    }
    return matches;
}

input.addEventListener('keydown', (e) => {
    // Inicializar audio en el primer gesto
    initAudio();

	if (gameState.tutorialOpen) { e.preventDefault(); return; }
    	if (gameState.isDeleting) { e.preventDefault(); return; }

    // Sonido de tecleo (excepto teclas de control)
    if (e.key.length === 1 || e.key === 'Backspace') {
        soundKeyClick();
    }

    if (e.key === 'Tab') {
        e.preventDefault();
        if (isSuggestionOpen) { suggestionIndex = (suggestionIndex + 1) % suggestions.length; updateSuggestionUI(); }
        else {
            const matches = getSuggestions(input.value);
            if (matches.length === 1) {
                const m = matches[0];
                if (typeof m === 'object' && m.isCred) {
                    input.value = m.fill;
                } else {
                    const parts = input.value.trim().split(' ');
                    if (parts.length > 0) parts.pop();
                    parts.push(typeof m === 'object' ? m.fill : m);
                    input.value = parts.join(' ') + ' ';
                }
            } else if (matches.length > 1) { suggestions = matches; suggestionIndex = 0; isSuggestionOpen = true; renderSuggestions(); }
        }
    } else if (e.key === 'Enter') {
        soundCommandEnter();
        if (isSuggestionOpen) { e.preventDefault(); applySuggestion(); }
        else {
    const cmd = input.value;
    if (cmd.trim() !== '') {
        try {
            handleCommand(cmd);
        } catch (err) {
            console.error('[handleCommand] excepción:', err);
            output.innerHTML += `<div class="msg-box"><span class="text-error">[!] Error interno: ${err.message}</span></div>`;
            output.scrollTop = output.scrollHeight;
        } finally {
            input.value = '';
        }
    }
}
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (isSuggestionOpen) { suggestionIndex = (suggestionIndex - 1 + suggestions.length) % suggestions.length; updateSuggestionUI(); }
        else if (historyIndex > 0) { historyIndex--; input.value = commandHistory[historyIndex]; }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (isSuggestionOpen) { suggestionIndex = (suggestionIndex + 1) % suggestions.length; updateSuggestionUI(); }
        else if (historyIndex < commandHistory.length - 1) { historyIndex++; input.value = commandHistory[historyIndex]; }
        else { historyIndex = commandHistory.length; input.value = ''; }
    } else if (e.key === 'Escape') { if (isSuggestionOpen) { isSuggestionOpen = false; suggestionBox.style.display = 'none'; } }
    else { if (isSuggestionOpen) { isSuggestionOpen = false; suggestionBox.style.display = 'none'; } }
});

document.querySelector('.center-panel').addEventListener('mousedown', (e) => {
    initAudio();
    // Si el click fue DENTRO del output, no robamos foco (permite seleccionar)
    if (e.target && (e.target.id === 'terminal-output' || e.target.closest('#terminal-output'))) {
        return;
    }
});

document.querySelector('.center-panel').addEventListener('click', (e) => {
    initAudio();
    const sel = window.getSelection();
    if (sel && sel.toString().length > 0) return;
    if (e.target && (e.target.id === 'terminal-output' || e.target.closest('#terminal-output'))) {
        return;
    }
    if (!gameState.isDeleting && !gameState.connectOverlayOpen) input.focus();
});

// INIT
// INIT
const pendingLC = (typeof getPersistedLastChance === 'function') ? getPersistedLastChance() : null;

function _revealHUD(withFade) {
    document.body.classList.remove('booting', 'boot-topbar', 'boot-right', 'boot-center');
    document.body.classList.remove('ui-booting');
    if (withFade) {
        document.body.classList.add('ui-fade-in');
        setTimeout(() => document.body.classList.remove('ui-fade-in'), 750);
    } else {
        document.body.classList.add('ui-visible');
    }
}

// --- 1) Last-chance pendiente (prioridad máxima) ---
if (pendingLC) {
    const saveInfoLC = (typeof peekSaveInfo === 'function') ? peekSaveInfo() : { exists: false };
    if (saveInfoLC.exists && saveInfoLC.current) {
        const restored = loadGame();
        if (restored) {
            if (pendingLC.phase === 'pending') {
                _revealHUD(false);
                if (typeof enterWhiteTerminal === 'function') {
                    enterWhiteTerminal();
                } else {
                    clearPersistedLastChance();
                    updateUI();
                    input.focus();
                }
            } else if (pendingLC.phase === 'active' && pendingLC.timeLeft > 0) {
                _revealHUD(false);
                if (typeof resumeLastChance === 'function') {
                    resumeLastChance(pendingLC);
                } else {
                    clearPersistedLastChance();
                    updateUI();
                    input.focus();
                }
            } else {
                _revealHUD(true);
                clearPersistedLastChance();
                updateUI();
                input.focus();
                if (gameState.netmapOpen) startNetmapAnim();
            }
        } else {
            clearPersistedLastChance();
            clearSave();
            startSetup();
        }
    } else {
        // El save desapareció o cambió de versión → descartar LC
        clearPersistedLastChance();
        if (saveInfoLC.exists && saveInfoLC.outdated) {
            // Derivar a migración
            document.body.classList.remove('booting');
            document.querySelector('.top-bar').style.display = 'none';
            document.querySelector('.main-content').style.display = 'none';
            document.body.classList.add('ui-visible');
            setTimeout(() => {
                showMigrationOverlay(saveInfoLC.save, saveInfoLC.version, saveInfoLC.key);
            }, 100);
        } else if (!saveInfoLC.exists) {
            showPowerAndBoot(() => startSetup());
        } else {
            clearSave();
            startSetup();
        }
    }
}
// --- 2) Save de versión anterior → migración ---
else {
    const saveInfo = (typeof peekSaveInfo === 'function') ? peekSaveInfo() : { exists: false };

    if (saveInfo.exists && saveInfo.corrupted) {
        // Save corrupto → borrar y empezar de cero
        clearSave();
        showPowerAndBoot(() => startSetup());
    } else if (saveInfo.exists && saveInfo.outdated) {
        // Overlay de migración
        document.body.classList.remove('booting');
        document.body.classList.add('ui-visible');
        const topBar = document.querySelector('.top-bar');
        const mainC  = document.querySelector('.main-content');
        if (topBar) topBar.style.display = 'none';
        if (mainC)  mainC.style.display  = 'none';
        setTimeout(() => {
            showMigrationOverlay(saveInfo.save, saveInfo.version, saveInfo.key);
        }, 150);
    } else if (saveInfo.exists && saveInfo.current) {
        const restored = loadGame();
        if (!restored) {
            clearSave();
            startSetup();
        } else {
            _revealHUD(true);
            updateUI();
            input.focus();
            if (gameState.netmapOpen) startNetmapAnim();
        }
    } else {
        // Primera partida
        showPowerAndBoot(() => startSetup());
    }
}
// ============================================================
// BLOQUEAR MENÚ CONTEXTUAL (Opera GX, Chrome, Firefox, etc.)
// ============================================================
document.addEventListener('contextmenu', (e) => {
    // Bloquear en toda la app
    e.preventDefault();
    return false;
});

// Bloquear también los gestos del navegador (doble tap, etc.)
document.addEventListener('selectstart', (e) => {
    const target = e.target;
    if (!target) return;

    // Si el target es el document o un text node, permitir por defecto
    // (la validación real la hace el selectionchange)
    let el = target;
    if (target.nodeType === 3) el = target.parentElement;   // text node
    if (!el || typeof el.closest !== 'function') return;    // document, etc.

    const tag = el.tagName ? el.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea') return;
    if (el.closest('#terminal-output')) return;
    if (el.closest('.webmail-content')) return;
    if (el.closest('.msg-box') || el.closest('.market-box') || el.closest('.mission-item')) return;
    if (el.closest('#gomail-web-overlay')) return;
    if (el.closest('#gomail-form-overlay') || el.closest('#hacknet-form-overlay') ||
        el.closest('#market-form-overlay') || el.closest('#connect-overlay') ||
        el.closest('#setup-overlay')) return;
    // Bloquear en cualquier otro lugar (evita selección accidental de UI)
    e.preventDefault();
});

// ============================================================
// SONIDO SATISFACTORIO AL SELECCIONAR TEXTO
// ============================================================
let _lastSelectionSoundAt = 0;
let _lastSelectionLength = 0;

function playSelectionBlip(intensity) {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'triangle';
        // Pitch base: sube un poco con la intensidad (más texto = más agudo)
        const baseFreq = 1400 + Math.min(800, intensity * 40);
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.04);

        filter.type = 'bandpass';
        filter.frequency.value = baseFreq * 1.1;
        filter.Q.value = 6;

        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.022, t + 0.003);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);

        osc.connect(filter);
        filter.connect(g);
        g.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.06);
    } catch(e) {}
}

document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (!sel) return;

    const text = sel.toString();
    const len = text.length;

    // Solo si la selección está dentro de zonas permitidas
    if (len > 0 && sel.anchorNode) {
        const anchor = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode;
        if (anchor && !anchor.closest('#terminal-output') && !anchor.closest('.webmail-content') &&
            anchor.tagName && anchor.tagName.toLowerCase() !== 'input') {
            return;
        }
    }

    // Cambió la selección?
    if (len === _lastSelectionLength) return;
    _lastSelectionLength = len;
    if (len === 0) return;

    // Throttle: máx. un sonido cada 45ms
    const now = performance.now();
    if (now - _lastSelectionSoundAt < 45) return;
    _lastSelectionSoundAt = now;

    // Inicializar audio si no está listo
    initAudio();
    playSelectionBlip(len);
});

// ============================================================
// EXTRA: sonido al hacer Ctrl+C (copiar)
// ============================================================
document.addEventListener('copy', () => {
    initAudio();
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        [880, 1320, 1760].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            const start = t + i * 0.05;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);
            g.gain.setValueAtTime(0, start);
            g.gain.linearRampToValueAtTime(0.028, start + 0.008);
            g.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
            osc.connect(g);
            g.connect(audioCtx.destination);
            osc.start(start);
            osc.stop(start + 0.3);
        });
    } catch(e) {}
});

// ============================================================
// BLOQUEAR MENÚ CONTEXTUAL — versión reforzada
// ============================================================
document.oncontextmenu = function(e) {
    e = e || window.event;
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
    e.cancelBubble = true;
    return false;
};

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
}, true);

// Bloqueo adicional para Edge/Chrome modernos
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
}, { capture: true });

// Bloqueo en el body mismo (por si algún overlay captura antes)
document.body.setAttribute('oncontextmenu', 'return false');

// ============================================================
// SONIDO AL PEGAR (Ctrl+V)
// ============================================================
document.addEventListener('paste', (e) => {
    initAudio();
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        // Arpegio descendente — "pegado" (inverso al de copiar)
        [1760, 1320, 880].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            const start = t + i * 0.05;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);
            g.gain.setValueAtTime(0, start);
            g.gain.linearRampToValueAtTime(0.028, start + 0.008);
            g.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
            osc.connect(g);
            g.connect(audioCtx.destination);
            osc.start(start);
            osc.stop(start + 0.3);
        });
    } catch(e) {}
});

// ============================================================
// ALARMA DEVTOOLS — Continua hasta cerrar las herramientas
// ============================================================

// --- Inyectar overlay de alarma ---
(function injectAlarmOverlay() {
    if (document.getElementById('devtools-alarm-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'devtools-alarm-overlay';
    overlay.innerHTML =
        '<div class="devtools-alarm-triangle">' +
            '<div class="devtools-alarm-skull">💀</div>' +
        '</div>' +
        '<div class="devtools-alarm-message">⚠ SISTEMA COMPROMETIDO ⚠</div>' +
        '<div class="devtools-alarm-sub">CERRÁ LAS HERRAMIENTAS DE DESARROLLO PARA DETENER LA ALARMA</div>';
    document.body.appendChild(overlay);
})();

// --- Estado global ---
let _alarmActive = false;
let _alarmOsc1 = null, _alarmOsc2 = null, _alarmGain = null, _alarmLFO = null, _alarmLfoGain = null;
let _countdownInterval = null;
let _countdownValue = 10;
let _devtoolsWatcher = null;

// ============================================================
// GUARD: detectar primer gesto del usuario (arregla warning AudioContext)
// ============================================================
let _userHasInteracted = false;
document.addEventListener('click', () => { _userHasInteracted = true; }, { once: true, capture: true });
document.addEventListener('keydown', () => { _userHasInteracted = true; }, { once: true, capture: true });
document.addEventListener('mousedown', () => { _userHasInteracted = true; }, { once: true, capture: true });

// ============================================================
// SONIDO DE ALARMA CONTINUA (klaxon de sirena)
// ============================================================
function startAlarmSound() {
    if (_alarmActive) return;
    _alarmActive = true;

    if (typeof initAudio === 'function') initAudio();
    if (!audioCtx) return;

    try {
        const t = audioCtx.currentTime;
        _alarmGain = audioCtx.createGain();
        _alarmGain.gain.setValueAtTime(0, t);
        _alarmGain.gain.linearRampToValueAtTime(0.14, t + 0.15);
        _alarmGain.connect(audioCtx.destination);

        _alarmOsc1 = audioCtx.createOscillator();
        _alarmOsc1.type = 'sawtooth';
        _alarmOsc1.frequency.value = 440;
        _alarmOsc1.connect(_alarmGain);
        _alarmOsc1.start();

        _alarmOsc2 = audioCtx.createOscillator();
        _alarmOsc2.type = 'square';
        _alarmOsc2.frequency.value = 220;
        _alarmOsc2.connect(_alarmGain);
        _alarmOsc2.start();

        // LFO para efecto sirena (barrido up/down)
        _alarmLFO = audioCtx.createOscillator();
        _alarmLFO.type = 'sine';
        _alarmLFO.frequency.value = 2.2;
        _alarmLfoGain = audioCtx.createGain();
        _alarmLfoGain.gain.value = 180;
        _alarmLFO.connect(_alarmLfoGain);
        _alarmLfoGain.connect(_alarmOsc1.frequency);
        _alarmLfoGain.connect(_alarmOsc2.frequency);
        _alarmLFO.start();
    } catch(e) {
        console.error('[alarm] Error:', e);
    }
}

function stopAlarmSound() {
    if (!_alarmActive) return;
    _alarmActive = false;

    if (!audioCtx || !_alarmGain) return;
    try {
        const t = audioCtx.currentTime;
        _alarmGain.gain.cancelScheduledValues(t);
        _alarmGain.gain.setValueAtTime(_alarmGain.gain.value, t);
        _alarmGain.gain.linearRampToValueAtTime(0.0001, t + 0.15);

        const o1 = _alarmOsc1, o2 = _alarmOsc2, lfo = _alarmLFO;
        _alarmOsc1 = null; _alarmOsc2 = null; _alarmLFO = null;
        _alarmGain = null; _alarmLfoGain = null;

        setTimeout(() => {
            try { o1 && o1.stop(); } catch(e) {}
            try { o2 && o2.stop(); } catch(e) {}
            try { lfo && lfo.stop(); } catch(e) {}
        }, 300);
    } catch(e) {}
}

// ============================================================
// OVERLAY DE ALARMA (triángulo + calavera)
// ============================================================
function startCountdown() {
    const overlay = document.getElementById('devtools-alarm-overlay');
    if (overlay) overlay.style.display = 'flex';
}

function stopCountdown() {
    const overlay = document.getElementById('devtools-alarm-overlay');
    if (overlay) overlay.style.display = 'none';
}
// ============================================================
// DETECCIÓN DEVTOOLS — solo si hubo RESIZE de viewport
// ============================================================
// Reglas:
//   - DevTools docked → viewport se achica → trigger
//   - Windows key / screenshot / alt-tab → sin resize → NO trigger
//   - Cerrás DevTools → viewport vuelve → se apaga

let _devtoolsIsOpen = false;
let _devtoolsWatcherStarted = false;
let _devtoolsWasDocked = false;
let _prevW = window.innerWidth;
let _prevH = window.innerHeight;

// Detectar resize del viewport
window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const wDiff = _prevW - w;
    const hDiff = _prevH - h;

    // Viewport se achicó significativamente → DevTools se acopló
    if (wDiff > 150 || hDiff > 150) {
        _devtoolsWasDocked = true;
    }
    // Viewport volvió a crecer → DevTools se cerró (o se desacopló)
    if (wDiff < -150 || hDiff < -150) {
        _devtoolsWasDocked = false;
    }

    _prevW = w;
    _prevH = h;
});

function _isDevtoolsLikelyOpen() {
    if (document.hidden) return false;
    if (document.hasFocus()) return false;
    return _devtoolsWasDocked;
}

function _probeLoop() {
    if (!_devtoolsWatcherStarted) return;

    const likelyOpen = _isDevtoolsLikelyOpen();

    if (likelyOpen) {
        if (!_devtoolsIsOpen) {
            _devtoolsIsOpen = true;
            startAlarmSound();
            startCountdown();
            showInGameAlert();
        }
    } else {
        if (_devtoolsIsOpen) {
            _devtoolsIsOpen = false;
            stopAlarmSound();
            stopCountdown();
            hideInGameAlert();
        }
    }

    setTimeout(_probeLoop, 300);
}

function startDevtoolsWatcher() {
    if (_devtoolsWatcherStarted) return;
    _devtoolsWatcherStarted = true;
    _probeLoop();
}

// Kill switch manual
window.stopDevtoolsAlarm = function() {
    _devtoolsIsOpen = false;
    _devtoolsWasDocked = false;
    stopAlarmSound();
    stopCountdown();
    hideInGameAlert();
    console.log('%c[✓] Alarma detenida manualmente.', 'color:#00ff88;');
};

// Trigger manual (para test)
window.triggerDevtoolsAlarm = function() {
    _devtoolsIsOpen = true;
    startAlarmSound();
    startCountdown();
    showInGameAlert();
    console.log('%c[!] Alarma disparada manualmente.', 'color:#ff5555;');
};
// ============================================================
// ALERTA EN EL JUEGO
// ============================================================
function showInGameAlert() {
    try {
        if (document.getElementById('devtools-alert-msg')) return;
        const output = document.getElementById('terminal-output');
        if (!output) return;
        output.innerHTML +=
            '<div class="msg-box" id="devtools-alert-msg" style="border-color:#ff0000; background:rgba(60,0,0,0.45); animation: pulseDanger 1.2s infinite;">' +
            '<div style="color:#ff3333; font-weight:bold; font-size:1.1rem; letter-spacing:2px;">⚠ DEVTOOLS DETECTADAS — ALARMA ACTIVA ⚠</div>' +
            '<div style="color:#ffcc00; margin-top:6px;">Cerrá las herramientas de desarrollo para detener la alarma.</div>' +
            '</div>';
        output.scrollTop = output.scrollHeight;
    } catch(e) {}
}

function hideInGameAlert() {
    try {
        const alert = document.getElementById('devtools-alert-msg');
        if (alert) alert.remove();
    } catch(e) {}
}
// ============================================================
// SPAM BINARIO — Atosiga al que abre la consola
// ============================================================
(function binarySpam() {
    // Estilos para hacerlo todavía más molesto
    const styles = [
        'font-size:11px; color:#00ff88; font-family:monospace; letter-spacing:1px;',
        'font-size:11px; color:#33ff33; font-family:monospace; letter-spacing:1px;',
        'font-size:12px; color:#00ff00; font-family:monospace; letter-spacing:2px; font-weight:bold;',
        'font-size:10px; color:#66ff66; font-family:monospace;',
        'font-size:14px; color:#00ff88; font-family:monospace; font-weight:bold; text-shadow:0 0 4px #00ff88;'
    ];
    const messages = [
        '1111111111111111111111111111111111111111111111111111111111111111',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '1111111111000000000000001111111111000000000000001111111111000000',
        '1010101010101010101010101010101010101010101010101010101010101010',
        '1111111111111111111111111111111111111111111111111111111111111111',
        '0000000000000000000000000000000000000000000000000000000000000000',
        '1100110011001100110011001100110011001100110011001100110011001100',
        '1111000011110000111100001111000011110000111100001111000011110000'
    ];

    // Disparar 500 logs instantáneos (spam masivo)
    for (let i = 0; i < 500; i++) {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const style = styles[Math.floor(Math.random() * styles.length)];
        try { console.log('%c' + msg, style); } catch(e) {}
    }

    // Y seguir spameando cada 30ms por 15 segundos
    let spamCount = 0;
    const spamInterval = setInterval(() => {
        spamCount++;
        if (spamCount > 500) { clearInterval(spamInterval); return; }
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const style = styles[Math.floor(Math.random() * styles.length)];
        try { console.log('%c' + msg, style); } catch(e) {}
    }, 30);

    // A los 15s, un mensaje final socarrón
    setTimeout(() => {
        try {
            console.log(
                '%c▓▓▓ ¿TODAVÍA ACÁ? ▓▓▓',
                'font-size:22px; color:#ff0033; font-weight:bold; text-shadow:0 0 12px #ff0033; letter-spacing:3px;'
            );
            console.log(
                '%c▸ Cerrá la consola y volvé al juego, hacker. No vas a encontrar nada interesante.',
                'font-size:13px; color:#ffaa44; font-family:monospace;'
            );
        } catch(e) {}
    }, 15000);
})();
// ============================================================
// ARRANCAR WATCHER
// ============================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(startDevtoolsWatcher, 1000));
} else {
    setTimeout(startDevtoolsWatcher, 1000);
}

// ============================================================
// PRESERVAR FOCO DEL INPUT — el terminal nunca pierde el cursor
// ============================================================
// Regla: si clickeás algo que NO es un input real, no robamos el foco.
// El input sigue activo aunque hagas click en:
//   - la card de un proceso (incluido el [X] de kill)
//   - la app de wallbreaker
//   - el marco de NetMap
//   - cualquier div decorativo

document.addEventListener('mousedown', (e) => {
    initAudio();

    const t = e.target;
    if (!t) return;

    const tag = t.tagName ? t.tagName.toLowerCase() : '';

    // 1) Permitir foco normal en inputs reales y links
    if (['input', 'textarea', 'button', 'select', 'a', 'option'].includes(tag)) return;
    if (t.isContentEditable) return;

    // 2) Permitir en overlays/modales con sus propios inputs
    if (t.closest('#market-form-overlay, #hacknet-form-overlay, #gomail-form-overlay, #gomail-web-overlay, #setup-overlay, #connect-overlay')) return;

    // 3) Permitir selección de texto en el output y en webmail
    if (t.closest('#terminal-output, .webmail-content')) return;

    // 4) Permitir drag en los canvas (netmap / wallbreaker)
    if (tag === 'canvas') return;

    // 5) Cualquier otra cosa: bloquear el robo de foco
    //    (no rompe clicks, solo evita que se desenfoque el input)
    e.preventDefault();
}, true);  // capture: corre antes que cualquier otro handler
// ============================================================
// NOTIFICACIÓN DE ACTUALIZACIÓN
// ============================================================
let _updateNotifShown = false;

window.maybeShowUpdateNotification = function() {
    if (_updateNotifShown) return;
    if (gameState.tutorialOpen) return;
    if (gameState.gamePhase !== 'normal') return;
    if (gameState.isGameOver) return;

    // Primerizo: marcamos como visto sin spamear
    if (!gameState.setupComplete) {
        if (typeof markReleaseAsSeen === 'function') markReleaseAsSeen();
        _updateNotifShown = true;
        return;
    }

    _updateNotifShown = true;

    if (typeof hasPendingUpdate !== 'function' || !hasPendingUpdate()) {
        if (typeof updateUpdateBadge === 'function') updateUpdateBadge();
        return;
    }
    if (typeof updateUpdateBadge === 'function') updateUpdateBadge();
    if (typeof showUpdateToast === 'function') showUpdateToast();
};

// Chequeo inicial al arrancar (con delay para no pisar animaciones)
setTimeout(() => {
    if (typeof maybeShowUpdateNotification === 'function') {
        maybeShowUpdateNotification();
    }
}, 2500);