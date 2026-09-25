// ============================================================
// SUSPICION.JS — Sistema de sospecha del operador
// ============================================================

const SUSPICION_MAX = 100;
const SUSPICION_OFFLINE_CAP = 40;

// ── Eventos que suben (o bajan) sospecha ──
const SUSPICION_EVENTS = {
    trace_disconnect: { amount:  15, label: 'Desconexión con rastreo activo' },
    sell_with_log:    { amount:  10, label: 'Venta de datos con log intacto' },
    sell_anon:        { amount:   3, label: 'Venta de datos sin rastro' },
    mission_complete: { amount:   5, label: 'Contrato de HackNet completado' }
};

// ── Velocidad de decay según nivel ──
const SUSPICION_DECAY_RATES = [
    { min:  0, max:  20, intervalMs:  30000 },  // 1 pt / 30s
    { min: 21, max:  50, intervalMs:  60000 },  // 1 pt / 60s
    { min: 51, max:  80, intervalMs:  90000 },  // 1 pt / 90s
    { min: 81, max: 100, intervalMs: 120000 }   // 1 pt / 120s
];

// ── Umbrales que disparan emails amenazantes (una sola vez por sesión) ──
const SUSPICION_THRESHOLDS = [
    { at: 21, flag: 'warn_21', sender: 'security@cyber-defense.com', subject: 'Aviso de actividad sospechosa',
      body: `Le informamos que hemos detectado actividad inusual asociada a su operación.\n\nIP de origen: 127.0.0.1 (proxied)\nNivel de amenaza: MODERADO\nEstado: BAJO VIGILANCIA\n\nEsto es solo un aviso. Recomendamos cesar cualquier actividad irregular durante los próximos días. El siguiente aviso será una notificación formal.\n\n— Departamento de Análisis, Cyber Defense Division` },

    { at: 51, flag: 'warn_51', sender: 'legal@incident-response.net', subject: 'NOTIFICACIÓN FORMAL — Investigación abierta',
      body: `Estimado/a operador:\n\nHemos abierto una investigación formal sobre las actividades asociadas a su operación.\n\nSu identidad está siendo investigada activamente. Los registros de conexión han sido preservados como evidencia.\n\nSi esta situación continúa, en menos de 72 horas contaremos con una orden de registro para su domicilio.\n\nLe recomendamos contactar a un abogado.\n\n— Departamento Legal, Incident Response` },

    { at: 81, flag: 'warn_81', sender: 'fiscalia@cibercrimen.gob.ar', subject: 'ORDEN DE ALLANAMIENTO — Plazo: 24 horas',
      body: `NOTIFICACIÓN OFICIAL\n\nSe ha emitido una orden de allanamiento contra su domicilio.\n\nNivel de amenaza: CRÍTICO\nEstado: IDENTIFICADO\nPlazo: 24 HORAS\n\nSi no cesa la actividad y no elimina todos los rastros antes del plazo indicado, una unidad de cibercrimen se presentará físicamente en su ubicación.\n\nNo se admiten apelaciones.\n\n— Fiscalía Federal, Unidad de Cibercrimen` }
];

// ============================================================
// NIVELES
// ============================================================
function getSuspicionTier(pct) {
    if (pct >= 81) return { id: 'critical', label: 'IDENTIFICADO', color: '#ff3333' };
    if (pct >= 51) return { id: 'high',     label: 'BUSCADO',      color: '#ff8833' };
    if (pct >= 21) return { id: 'medium',   label: 'VIGILADO',     color: '#ffcc00' };
    return           { id: 'low',      label: 'BAJO PERFIL',  color: '#33ff33' };
}

// ============================================================
// SUBIR SOSPECHA
// ============================================================
function increaseSuspicion(eventKey, opts) {
    opts = opts || {};
    const event = SUSPICION_EVENTS[eventKey];
    if (!event) return;

    const before = gameState.suspicion || 0;
    const after = Math.min(SUSPICION_MAX, before + event.amount);
    gameState.suspicion = after;

    // Historial
    if (!Array.isArray(gameState.suspicionHistory)) gameState.suspicionHistory = [];
    gameState.suspicionHistory.unshift({
        ts: Date.now(),
        event: eventKey,
        label: event.label,
        amount: event.amount,
        total: after,
        identified: !!opts.identified
    });
    if (gameState.suspicionHistory.length > 30) gameState.suspicionHistory.pop();

    // Chequear umbrales de email
    _checkSuspicionThresholds(before, after);

    // Actualizar UI
    if (typeof renderSuspicionBar === 'function') {
        try { renderSuspicionBar(); } catch (e) {}
    }

    // Noticia
    try { generateSuspicionNews(eventKey, opts); } catch (e) {}

    // Trigger del allanamiento al 100%
    if (after >= 100 && before < 100) {
        setTimeout(_triggerAllanamiento, 800);
    }

    try { if (typeof saveGame === 'function') saveGame(); } catch (e) {}

    return after;
}

// ============================================================
// BAJAR SOSPECHA
// ============================================================
function decreaseSuspicion(amount, reason) {
    if (!amount || amount <= 0) return;
    const before = gameState.suspicion || 0;
    const after = Math.max(0, before - amount);
    if (after === before) return;

    gameState.suspicion = after;

    if (typeof renderSuspicionBar === 'function') {
        try { renderSuspicionBar(); } catch (e) {}
    }
    try { if (typeof saveGame === 'function') saveGame(); } catch (e) {}
}

function resetSuspicion() {
    gameState.suspicion = 0;
    gameState.suspicionHistory = [];
    if (gameState.suspicionThresholdsHit) gameState.suspicionThresholdsHit = {};
}

// ============================================================
// DECAY ACTIVO — tick cada 5s mientras el jugador está desconectado
// ============================================================
let _suspicionDecayTimer = null;
let _suspicionLastDecayAt = 0;

function startSuspicionDecay() {
    if (_suspicionDecayTimer) return;
    _suspicionLastDecayAt = Date.now();
    _suspicionDecayTimer = setInterval(_suspicionDecayTick, 5000);
}

function stopSuspicionDecay() {
    if (_suspicionDecayTimer) {
        clearInterval(_suspicionDecayTimer);
        _suspicionDecayTimer = null;
    }
}

function _suspicionDecayTick() {
    if (typeof gameState === 'undefined') return;
    const susp = gameState.suspicion || 0;
    if (susp <= 0) return;

    // Solo baja si estás desconectado y sin overlays bloqueantes
    if (gameState.gamePhase !== 'normal') return;
    if (gameState.isConnected) return;
    if (gameState.inHacknet || gameState.inGomail || gameState.inMarket || gameState.inNews) return;
    if (gameState.connectOverlayOpen) return;
    if (gameState.tutorialOpen) return;
    if (gameState.isDeleting) return;
    if (gameState.scanning) return;
    if (gameState.isGameOver) return;
    if (typeof BF !== 'undefined' && BF.active) return;

    const now = Date.now();
    const elapsed = now - _suspicionLastDecayAt;

    // Determinar la tasa según nivel actual
    const rate = SUSPICION_DECAY_RATES.find(r => susp >= r.min && susp <= r.max);
    if (!rate) return;

    if (elapsed >= rate.intervalMs) {
        _suspicionLastDecayAt = now;
        decreaseSuspicion(1, 'lay_low');
    }
}

// ============================================================
// DECAY OFFLINE — calculado al cargar el save
// ============================================================
function applyOfflineSuspicionDecay() {
    if (!gameState.lastSeenAt) {
        gameState.lastSeenAt = Date.now();
        return 0;
    }

    const elapsed = Date.now() - gameState.lastSeenAt;
    if (elapsed < 60000) return 0; // menos de 1 min, no hace nada

    const susp = gameState.suspicion || 0;
    if (susp <= 0) return 0;

    // Simulamos el decay en bloques: tomamos el nivel inicial
    // y aplicamos la tasa hasta llegar a 0 o al cap.
    const rate = SUSPICION_DECAY_RATES.find(r => susp >= r.min && susp <= r.max) || SUSPICION_DECAY_RATES[0];
    const points = Math.floor(elapsed / rate.intervalMs);
    const actualPoints = Math.min(points, SUSPICION_OFFLINE_CAP, susp);

    if (actualPoints > 0) {
        gameState.suspicion = Math.max(0, susp - actualPoints);
        if (typeof renderSuspicionBar === 'function') {
            try { renderSuspicionBar(); } catch (e) {}
        }
    }

    return actualPoints;
}

// ============================================================
// EMAILS EN UMBRALES
// ============================================================
function _checkSuspicionThresholds(before, after) {
    if (!gameState.suspicionThresholdsHit) gameState.suspicionThresholdsHit = {};
    SUSPICION_THRESHOLDS.forEach(t => {
        if (before < t.at && after >= t.at && !gameState.suspicionThresholdsHit[t.flag]) {
            gameState.suspicionThresholdsHit[t.flag] = true;
            try {
                if (typeof sendGomailEmail === 'function') {
                    sendGomailEmail(t.sender, t.subject, t.body, null);
                }
            } catch (e) {}
        }
    });
}

// ============================================================
// ALLANAMIENTO AL 100%
// ============================================================
function _triggerAllanamiento() {
    if (typeof enterRaidSequence === 'function') {
        enterRaidSequence();
    } else if (typeof enterWhiteTerminal === 'function') {
        enterWhiteTerminal();
    }
}

// ============================================================
// HOOKS (existentes)
// ============================================================
function suspicionOnDisconnect(server) {
    if (!server || !server.traceLogPath) return;
    if (!server.fs || !server.fs[server.traceLogPath]) return;
    increaseSuspicion('trace_disconnect', {
        identified: true,
        serverName: server.name,
        serverIP: server.ip,
        serverIdentity: server.identity || null
    });
}

function suspicionOnSell(fileName, file, sourceServerIP) {
    if (!sourceServerIP) {
        increaseSuspicion('sell_anon', {
            identified: false,
            fileName: fileName,
            serverIdentity: (file && file.sourceServerIdentity) || null
        });
        return;
    }
    const server = gameState.servers.find(s => s.ip === sourceServerIP);
    const hasLog = server && server.traceLogPath && server.fs && server.fs[server.traceLogPath];
    if (hasLog) {
        increaseSuspicion('sell_with_log', {
            identified: true,
            fileName: fileName,
            serverName: server.name,
            serverIP: server.ip,
            serverIdentity: server.identity || { type: 'company', name: server.name }
        });
    } else {
        increaseSuspicion('sell_anon', {
            identified: false,
            fileName: fileName,
            serverIdentity: (server && server.identity) || (file && file.sourceServerIdentity) || null
        });
    }
}

function suspicionOnMissionClaim(mission) {
    if (!mission) return;
    increaseSuspicion('mission_complete', {
        identified: true,
        missionTitle: mission.title,
        missionId: mission.id,
        targetIP: mission.targetIP || null
    });
}

// ============================================================
// NOTICIAS (existentes)
// ============================================================
function generateSuspicionNews(eventKey, opts) {
    if (typeof newsAdd !== 'function') return;
    const player = gameState.localUser || 'operador';
    const identity = opts.serverIdentity || null;
    const companyName = (identity && identity.name) ? identity.name : (opts.serverName || 'un servidor');
    const ip = opts.serverIP || '0.0.0.0';

    if (eventKey === 'trace_disconnect') {
        newsAdd('cyber',
            `${player} fue rastreado tras hackear ${companyName}`,
            `El operador conocido como "${player}" dejó su log de conexión activo tras comprometer ${companyName} (${ip}). Los administradores del servidor iniciaron un rastreo inverso y obtuvieron su identidad. Las autoridades fueron notificadas.`,
            ip);
        return;
    }
    if (eventKey === 'sell_with_log') {
        newsAdd('leak',
            `${player} filtró información de ${companyName}`,
            `Datos sustraídos de ${companyName} (${ip}) aparecieron en el mercado negro. La firma del atacante fue vinculada al operador "${player}" gracias a los registros de conexión que quedaron intactos.`,
            ip);
        return;
    }
    if (eventKey === 'sell_anon') {
        const target = (companyName && companyName !== 'un servidor') ? `de ${companyName}` : 'de un servidor no identificado';
        newsAdd('leak',
            `Filtración anónima afecta a ${companyName !== 'un servidor' ? companyName : 'una empresa'}`,
            `Información sensible ${target} apareció en foros clandestinos. El atacante logró operar sin dejar rastros.`,
            ip);
        return;
    }
    if (eventKey === 'mission_complete') {
        const target = opts.targetIP || 'un objetivo desconocido';
        newsAdd('cyber',
            `${player} completó un contrato en ${target}`,
            `El operador "${player}" cerró un contrato de HackNet que comprometió los sistemas de ${target}.`,
            opts.targetIP || null);
        return;
    }
}

// ============================================================
// RENDER DE LA BARRA EN NEWS.COM
// ============================================================
function renderSuspicionBar() {
    const bar = document.getElementById('news-suspicion-bar');
    if (!bar) return;

    const pct = Math.max(0, Math.min(100, gameState.suspicion || 0));
    const tier = getSuspicionTier(pct);

    const userEl   = document.getElementById('news-suspicion-user');
    const fillEl   = document.getElementById('news-suspicion-fill');
    const pctEl    = document.getElementById('news-suspicion-pct');
    const statusEl = document.getElementById('news-suspicion-status');
    const decayEl  = document.getElementById('news-suspicion-decay');

    if (userEl) userEl.textContent = gameState.localUser || 'operador';
    if (fillEl) {
        fillEl.style.width = pct + '%';
        fillEl.style.background = tier.color;
        fillEl.style.boxShadow = '0 0 12px ' + tier.color;
    }
    if (pctEl) pctEl.textContent = Math.round(pct) + '%';
    if (statusEl) {
        statusEl.textContent = tier.label;
        statusEl.style.color = tier.color;
        statusEl.style.textShadow = '0 0 8px ' + tier.color;
    }
    bar.style.borderLeftColor = tier.color;
    bar.dataset.tier = tier.id;

    // Indicador de decay
    if (decayEl) {
        if (pct > 0 && !gameState.isConnected) {
            const rate = SUSPICION_DECAY_RATES.find(r => pct >= r.min && pct <= r.max);
            const seconds = rate ? Math.round(rate.intervalMs / 1000) : 60;
            decayEl.textContent = `↓ 1pt / ${seconds}s`;
            decayEl.style.display = 'inline';
        } else if (pct > 0) {
            decayEl.textContent = '↓ decay pausado (conectado)';
            decayEl.style.display = 'inline';
            decayEl.style.opacity = '0.5';
        } else {
            decayEl.style.display = 'none';
        }
    }
}

// ============================================================
// Exports
// ============================================================
window.increaseSuspicion        = increaseSuspicion;
window.decreaseSuspicion        = decreaseSuspicion;
window.resetSuspicion           = resetSuspicion;
window.getSuspicionTier         = getSuspicionTier;
window.suspicionOnDisconnect    = suspicionOnDisconnect;
window.suspicionOnSell          = suspicionOnSell;
window.suspicionOnMissionClaim  = suspicionOnMissionClaim;
window.renderSuspicionBar       = renderSuspicionBar;
window.startSuspicionDecay      = startSuspicionDecay;
window.stopSuspicionDecay       = stopSuspicionDecay;
window.applyOfflineSuspicionDecay = applyOfflineSuspicionDecay;

// Auto-arranque del decay
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(startSuspicionDecay, 3000));
} else {
    setTimeout(startSuspicionDecay, 3000);
}