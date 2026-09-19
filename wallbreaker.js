// ============================================================
// WALLBREAKER — App de firewall
// ============================================================
// Todo el estado vive en gameState.wallbreakerApp

const WB_PHASES = {
    red:    [0.00, 0.26],
    green:  [0.26, 0.52],
    blue:   [0.52, 0.78],
    fusion: [0.78, 1.00]
};

const WB_PORT_TIMING = {
    analyze: [0.00, 0.06],
    appear:  [0.06, 0.24],
    breach:  [0.24, 0.88],
    finish:  [0.88, 1.00]
};

// Timings de analyze (antes ~5.6s, ahora ~2.6s)
const WB_T_SWEEP_END      = 400;
const WB_T_NODES_START    = 400;
const WB_T_NODES_END      = 1500;
const WB_T_EDGES_START    = 1500;
const WB_T_EDGES_END      = 2000;
const WB_T_HANDSHAKE_END  = 2300;
const WB_T_CAPTURE_END    = 2600;

// Timings de break (antes ~15.3s, ahora ~6.5s)
const WB_BT_CHARGE_END        = 700;
const WB_BT_IMPACTS_END       = 5800;
const WB_BT_EXPLOSION_DELAY   = 500;
const WB_BT_DONE              = 7000;
const WB_BT_APP_CLOSE         = 6500;

const WB_CRACK_MIN_DIST  = 45;
const WB_CRACK_MAX_TRIES = 12;

let _wbLastNow = 0;
let _wbShakeX = 0, _wbShakeY = 0;
let _wbLoopId = null;

// ============================================================
// HELPERS DE FIRMA
// ============================================================
function buildWallbreakerSignatureText(fw) {
    const tier = fw.tier || 0;
    const vStr = String(fw.version);

    let minNoise, maxNoise, markers, separators, noisePool;
    if (tier <= 3) {
        minNoise = 0;  maxNoise = 4;
        markers = ['V'];
        separators = ['_'];
        noisePool = 'AFHKLMNPQRSTWXYZ0123456789';
    } else if (tier <= 5) {
        minNoise = 4;  maxNoise = 12;
        markers = ['V', 'v', 'VRS', 'vr'];
        separators = ['_', '.', ''];
        noisePool = 'AFHKLMNPQRSTWXYZ0123456789';
    } else if (tier <= 7) {
        minNoise = 12; maxNoise = 22;
        markers = ['V', 'v', 'VRS', 'vrs', 'vr', 'VR', 'vR'];
        separators = ['_', '.', '', '-', ':'];
        noisePool = 'ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    } else {
        minNoise = 20; maxNoise = 34;
        markers = ['V', 'v', 'VRS', 'vrs', 'vr', 'VR', 'vR'];
        separators = ['_', '.', '', '-', ':', ' '];
        noisePool = 'ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    }

    const noiseLen = minNoise + Math.floor(Math.random() * (maxNoise - minNoise + 1));
    const noiseChars = [];
    for (let i = 0; i < noiseLen; i++) {
        noiseChars.push(noisePool[Math.floor(Math.random() * noisePool.length)]);
    }

    const marker = markers[Math.floor(Math.random() * markers.length)];
    const separator = separators[Math.floor(Math.random() * separators.length)];
    const block = marker + separator + vStr;

    const pos = Math.floor(Math.random() * (noiseChars.length + 1));
    noiseChars.splice(pos, 0, block);

    return noiseChars.join('');
}

function buildWallbreakerSignature(fw) {
    return buildWallbreakerSignatureText(fw)
        .split('')
        .map(c => c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
        .join(' ');
}

function showWallbreakerSignature() {
    const server = gameState.currentServer;
    const fw = server && server.firewall;
    if (!fw || !fw.hasFirewall) {
        output.innerHTML += `<span class="text-muted">Este servidor no tiene firewall.</span><br>`;
        return;
    }
    if (!fw.analyzed) {
        output.innerHTML += `<span class="text-muted">No hay firma capturada.</span><br>`;
        return;
    }
    if (!fw.capturedHex) {
        fw.capturedHex = buildWallbreakerSignature(fw);
    }
    let html = `<div class="msg-box">`;
    html += `<span class="text-info">FIRMA DEL FIREWALL</span><br>`;
    html += `<div class="hex-block" style="font-family:Consolas,monospace;color:#ffaa44;background:#150800;padding:4px 8px;display:inline-block;letter-spacing:2px;border:1px solid #663300;margin-top:6px;">${fw.capturedHex}</div>`;
    html += `</div>`;
    output.innerHTML += html;
    output.scrollTop = output.scrollHeight;
}

// ============================================================
// CICLO DE VIDA
// ============================================================
function openWallbreakerApp() {
    if (!gameState.isConnected || !gameState.currentServer) {
        output.innerHTML += `<span class="text-error">Error: No estás conectado.</span><br>`;
        return;
    }
    const server = gameState.currentServer;
    if (!server.firewall || !server.firewall.hasFirewall) {
        output.innerHTML += `<span class="text-muted">Este servidor no tiene firewall activo.</span><br>`;
        return;
    }
    if (server.firewall.broken || !server.firewall.active) {
        output.innerHTML += `<span class="text-muted">Este servidor no tiene firewall activo.</span><br>`;
        return;
    }
    if (!gameState.wallbreakerObtained) {
        output.innerHTML += `<span class="text-error">Error: No tenés wallbreaker.exe.</span><br>`;
        return;
    }
    if (gameState.wallbreakerApp && gameState.wallbreakerApp.open) {
        output.innerHTML += `<span class="text-warning">wallbreaker.exe ya está abierto.</span><br>`;
        return;
    }

    gameState.ram = calculateRamUsage();
    if (gameState.ram + FIREWALL_RAM_COST > gameState.maxRam) {
        const libre = Math.max(0, gameState.maxRam - gameState.ram).toFixed(1);
        output.innerHTML += `<span class="text-error">Error: RAM insuficiente para abrir wallbreaker.exe (requiere ${FIREWALL_RAM_COST} GB, libres ${libre} GB).</span><br>`;
        return;
    }

    const data = createWallbreakerData(server);
    gameState.wallbreakerApp = {
        open: true,
        serverIP: server.ip,
        data: data,
        analyzeActive: false,
        analyzeStartTime: 0,
        analyzeNodes: [],
        analyzeEdges: [],
        analyzeHandshakeStarted: false,
        analyzeHandshakeStartTime: 0,
        analyzeHandshakeDone: false,
        analyzeCaptureDone: false,
        analyzeSweepY: 0,
        analyzeSweepActive: false,
        breakActive: false,
        breakStartTime: 0,
        breakProjectiles: [],
        breakCracks: [],
        breakCrackPositions: [],
        breakFragments: [],
        breakDebris: [],
        breakShakeIntensity: 0,
        breakLastProjectileAt: 0,
        breakLastDebrisAt: 0,
        breakAllNodesBroken: false,
        breakAllNodesBrokenAt: 0,
        breakExploded: false,
        breakVictoryPlayed: false,
        breakAppClosing: false,
        breakNextNodeIdx: 0,
        breakPendingDelayedSpawns: [],
        wallMarks: { nodes: [], edges: [] },
        soundState: {
            lastProjectileAt: 0,
            lastAmbientCrackleAt: 0,
            lastDroneAt: 0
        }
    };

    if (server.firewall.wallMarks &&
        server.firewall.wallMarks.nodes &&
        server.firewall.wallMarks.nodes.length > 0) {
        gameState.wallbreakerApp.wallMarks.nodes = server.firewall.wallMarks.nodes.map(n => ({
            x: n.x, y: n.y, broken: false
        }));
        gameState.wallbreakerApp.wallMarks.edges = server.firewall.wallMarks.edges.map(e => ({
            from: e.from, to: e.to
        }));
    }

    const wbSection = document.getElementById('wallbreaker-section');
    if (wbSection) wbSection.style.display = 'block';
    const headerText = document.getElementById('wallbreaker-header-text');
    if (headerText) headerText.textContent = 'wallbreaker.exe — FIREWALL ACTIVE';

    updateUI();
    saveGame();

    output.innerHTML += `<span class="text-fire">[~] wallbreaker.exe abierto.</span><br>`;

    _wbLastNow = performance.now();
    if (_wbLoopId === null) {
        _wbLoopId = requestAnimationFrame(wallbreakerLoop);
    }
}

function closeWallbreakerApp(silent) {
    if (!gameState.wallbreakerApp || !gameState.wallbreakerApp.open) return;
    gameState.wallbreakerApp.open = false;

    const wbSection = document.getElementById('wallbreaker-section');
    if (wbSection) wbSection.style.display = 'none';

    stopDroneWB();

    if (!silent) {
        output.innerHTML += `<span class="text-muted">[~] wallbreaker.exe cerrado.</span><br>`;
    }
    updateUI();
    saveGame();
}

// ============================================================
// INICIALIZACIÓN DE DATOS
// ============================================================
function createWallbreakerData(server) {
    const particles = [];
    for (let i = 0; i < 280; i++) {
        particles.push({
            x: Math.random(),
            y: Math.random(),
            vy: 0.15 + Math.random() * 0.35,
            vx: (Math.random() - 0.5) * 0.05,
            size: 0.8 + Math.random() * 1.8,
            life: Math.random(),
            maxLife: 0.9 + Math.random() * 1.1,
            hue: 15 + Math.random() * 32
        });
    }
    const bits = [];
    for (let i = 0; i < 90; i++) bits.push(makeWbBit(true));

    return {
        particles,
        bits,
        WALL: null
    };
}

function makeWbBit(initial) {
    return {
        x: Math.random(),
        y: initial ? Math.random() : 1.02,
        vy: 0.06 + Math.random() * 0.14,
        vx: (Math.random() - 0.5) * 0.02,
        char: Math.random() < 0.5 ? '0' : '1',
        size: 9 + Math.random() * 8,
        life: initial ? Math.random() : 0,
        maxLife: 2.2 + Math.random() * 2.0,
        swap: Math.random() < 0.005
    };
}

// ============================================================
// LOOP PRINCIPAL
// ============================================================
function wallbreakerLoop(rafNow) {
    if (!gameState.wallbreakerApp || !gameState.wallbreakerApp.open) {
        _wbLoopId = null;
        return;
    }
    _wbLoopId = requestAnimationFrame(wallbreakerLoop);

    const now = performance.now();
    let dt = (now - _wbLastNow) / 1000;
    if (!isFinite(dt) || dt < 0) dt = 0.016;
    if (dt > 0.1) dt = 0.1;
    _wbLastNow = now;

    const app = gameState.wallbreakerApp;

    const baseShake = 0.6;
    const breakShake = app.breakShakeIntensity * 3.5;
    const totalShakeAmp = baseShake + breakShake;
    if (Math.random() < 0.5) {
        _wbShakeX = (Math.random() - 0.5) * totalShakeAmp;
        _wbShakeY = (Math.random() - 0.5) * totalShakeAmp;
    }
    _wbShakeX *= 0.82;
    _wbShakeY *= 0.82;
    app.breakShakeIntensity *= 0.93;

    try {
        if (app.analyzeActive) updateWallbreakerAnalyze(now);
        if (app.breakActive) updateWallbreakerBreak(now, dt);
        drawWallbreakerApp(now, dt);
    } catch (err) {
        console.error('[wallbreaker] Error en loop:', err);
    }
}

// ============================================================
// DIBUJO PRINCIPAL
// ============================================================
function drawWallbreakerApp(now, dt) {
    const canvas = document.getElementById('wallbreaker-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const app = gameState.wallbreakerApp;
    const data = app.data;

    if (!data.WALL) {
        data.WALL = {
            x: W * 0.18,
            y: H * 0.06,
            w: W * 0.64,
            h: H * 0.88
        };
    }
    const WALL = data.WALL;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255, 100, 30, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 15) {
        ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 15) {
        ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke();
    }

    ctx.save();
    ctx.translate(_wbShakeX, _wbShakeY);

    if (!app.breakExploded) {
        drawWallbreakerWall(ctx, W, H, WALL, now, dt, data);
    }

    if (app.wallMarks.nodes.length > 0 && !app.breakExploded) {
        drawWallbreakerMarks(ctx, WALL, now, app.wallMarks);
    }

    if (app.analyzeActive) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(WALL.x, WALL.y, WALL.w, WALL.h);
        ctx.clip();
        drawWallbreakerAnalyzeLayer(ctx, now, WALL, app);
        ctx.restore();
    }

    if (app.breakActive && !app.breakExploded) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(WALL.x, WALL.y, WALL.w, WALL.h);
        ctx.clip();
        drawWallbreakerBreakLayer(ctx, now, WALL, app);
        ctx.restore();
    }

    if (app.breakExploded) {
        drawWallbreakerFragments(ctx, app);
        drawWallbreakerDebris(ctx, app);
    }

    if (!app.breakExploded) {
        const borderAlpha = (app.analyzeActive || app.breakActive)
            ? (0.7 + 0.3 * Math.sin(now * 0.01))
            : 0.65;
        ctx.shadowBlur = 22;
        ctx.shadowColor = 'rgba(255, 100, 20, 0.9)';
        ctx.strokeStyle = `rgba(255, 150, 40, ${borderAlpha})`;
        ctx.lineWidth = (app.analyzeActive || app.breakActive) ? 2 : 1.5;
        ctx.strokeRect(WALL.x, WALL.y, WALL.w, WALL.h);
        ctx.shadowBlur = 0;
    }

    ctx.restore();

    if (app.analyzeActive) {
        const elapsed = now - app.analyzeStartTime;
        if (elapsed > WB_T_CAPTURE_END - 300 && elapsed < WB_T_CAPTURE_END) {
            const k = (elapsed - (WB_T_CAPTURE_END - 300)) / 300;
            ctx.fillStyle = `rgba(255, 230, 180, ${Math.sin(k * Math.PI) * 0.5})`;
            ctx.fillRect(0, 0, W, H);
        }
    }
    if (app.breakExploded && app.breakAllNodesBrokenAt > 0) {
        const elapsed = now - app.breakAllNodesBrokenAt - WB_BT_EXPLOSION_DELAY;
        if (elapsed > 0 && elapsed < 250) {
            const k = elapsed / 250;
            ctx.fillStyle = `rgba(255, 220, 160, ${Math.sin(k * Math.PI) * 0.8})`;
            ctx.fillRect(0, 0, W, H);
        }
    }

    const scanY = ((now / 20) % (H + 30)) - 15;
    const scanGrad = ctx.createLinearGradient(0, scanY - 10, 0, scanY + 10);
    scanGrad.addColorStop(0, 'rgba(255, 100, 30, 0)');
    scanGrad.addColorStop(0.5, 'rgba(255, 150, 50, 0.08)');
    scanGrad.addColorStop(1, 'rgba(255, 100, 30, 0)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 10, W, 20);

    ctx.strokeStyle = 'rgba(255, 136, 51, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

    updateWallbreakerAmbientSounds(now);
}

// ============================================================
// DIBUJO DEL MURO
// ============================================================
function drawWallbreakerWall(ctx, W, H, WALL, now, dt, data) {
    const baseGrad = ctx.createLinearGradient(0, WALL.y, 0, WALL.y + WALL.h);
    baseGrad.addColorStop(0, 'rgba(60, 8, 0, 0.95)');
    baseGrad.addColorStop(0.25, 'rgba(180, 45, 0, 0.9)');
    baseGrad.addColorStop(0.55, 'rgba(230, 90, 10, 0.9)');
    baseGrad.addColorStop(0.85, 'rgba(255, 160, 40, 0.9)');
    baseGrad.addColorStop(1, 'rgba(255, 210, 70, 0.9)');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(WALL.x, WALL.y, WALL.w, WALL.h);

    ctx.save();
    ctx.beginPath();
    ctx.rect(WALL.x, WALL.y, WALL.w, WALL.h);
    ctx.clip();

    const numBands = 14;
    for (let i = 0; i < numBands; i++) {
        const ty = i / (numBands - 1);
        const baseY = WALL.y + ty * WALL.h;
        const amp = 4 + Math.sin(now * 0.001 + i) * 2;
        const hue = 20 + (1 - ty) * 35;
        const alpha = 0.20 + 0.12 * Math.sin(now * 0.002 + i * 0.7);
        ctx.strokeStyle = `hsla(${hue}, 100%, 55%, ${alpha})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let x = 0; x <= 30; x++) {
            const tx = x / 30;
            const wx = WALL.x + tx * WALL.w;
            const offset =
                Math.sin(tx * 5 + now * 0.002 + i * 0.4) * amp +
                Math.sin(tx * 11 - now * 0.003 + i * 0.9) * amp * 0.5;
            const wy = baseY + offset;
            if (x === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
    }

    for (const b of data.bits) {
        b.y -= b.vy * dt;
        b.x += b.vx * dt;
        b.life += dt;
        if (b.swap && Math.random() < 0.02) b.char = b.char === '0' ? '1' : '0';
        if (b.y < -0.05 || b.life > b.maxLife) { Object.assign(b, makeWbBit(false)); continue; }
        const px = WALL.x + b.x * WALL.w;
        const py = WALL.y + b.y * WALL.h;
        const fadeIn = Math.min(1, b.life * 1.5);
        const fadeOut = Math.min(1, (b.maxLife - b.life) * 0.8);
        const alpha = Math.max(0, Math.min(fadeIn, fadeOut)) * 0.85;
        const bottomHeat = 1 - b.y;
        const lightness = 45 + bottomHeat * 35;
        const hue = 30 + bottomHeat * 15;
        ctx.font = `bold ${b.size}px Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
        ctx.shadowBlur = 5 + bottomHeat * 6;
        ctx.shadowColor = `hsla(${hue}, 100%, 60%, ${alpha * 0.9})`;
        ctx.fillText(b.char, px, py);
        ctx.shadowBlur = 0;
    }

    for (const pt of data.particles) {
        pt.y -= pt.vy * dt;
        pt.x += pt.vx * dt;
        pt.life += dt;
        if (pt.life > pt.maxLife || pt.y < -0.03) {
            pt.y = 1.0; pt.x = Math.random();
            pt.life = 0; pt.maxLife = 0.9 + Math.random() * 1.1;
            pt.hue = 15 + Math.random() * 32;
        }
        const lifeRatio = 1 - pt.life / pt.maxLife;
        if (lifeRatio <= 0) continue;
        const px = WALL.x + pt.x * WALL.w;
        const py = WALL.y + pt.y * WALL.h;
        const alpha = Math.min(1, lifeRatio * 1.4) * 0.75;
        const lightness = 45 + lifeRatio * 40;
        ctx.fillStyle = `hsla(${pt.hue}, 100%, ${lightness}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, pt.size * (0.6 + lifeRatio * 0.6), 0, Math.PI * 2);
        ctx.fill();
    }

    const bloom = ctx.createRadialGradient(
        WALL.x + WALL.w / 2, WALL.y + WALL.h * 0.8, 0,
        WALL.x + WALL.w / 2, WALL.y + WALL.h * 0.8, WALL.w * 0.75
    );
    const pulse = 0.28 + 0.08 * Math.sin(now * 0.003);
    bloom.addColorStop(0, `rgba(255, 220, 120, ${pulse})`);
    bloom.addColorStop(0.4, `rgba(255, 120, 40, ${pulse * 0.5})`);
    bloom.addColorStop(1, 'rgba(255, 60, 0, 0)');
    ctx.fillStyle = bloom;
    ctx.fillRect(WALL.x, WALL.y, WALL.w, WALL.h);

    ctx.restore();
}

// ============================================================
// MARCAS DEL ANALYZE (nodos y aristas)
// ============================================================
function drawWallbreakerMarks(ctx, WALL, now, marks) {
    for (let i = 0; i < marks.edges.length; i++) {
        const e = marks.edges[i];
        const nA = marks.nodes[e.from];
        const nB = marks.nodes[e.to];
        if (!nA || !nB) continue;
        const broken = nA.broken || nB.broken;
        ctx.strokeStyle = broken
            ? 'rgba(255, 80, 40, 0.15)'
            : 'rgba(120, 240, 255, 0.28)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(nA.x * WALL.w + WALL.x, nA.y * WALL.h + WALL.y);
        ctx.lineTo(nB.x * WALL.w + WALL.x, nB.y * WALL.h + WALL.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    for (let i = 0; i < marks.nodes.length; i++) {
        const n = marks.nodes[i];
        const px = WALL.x + n.x * WALL.w;
        const py = WALL.y + n.y * WALL.h;
        const pulse = 0.7 + 0.3 * Math.sin(now * 0.004 + i * 1.7);
        if (n.broken) {
            ctx.strokeStyle = 'rgba(255, 60, 30, 0.7)';
            ctx.lineWidth = 1.8;
            const r = 6;
            ctx.beginPath();
            ctx.moveTo(px - r, py - r);
            ctx.lineTo(px + r, py + r);
            ctx.moveTo(px + r, py - r);
            ctx.lineTo(px - r, py + r);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(255, 60, 30, 0.35)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(px, py, 9, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            ctx.strokeStyle = `rgba(120, 240, 255, ${0.55 + 0.2 * pulse})`;
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(120, 240, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(px, py, 6 * pulse, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = `rgba(220, 255, 255, ${0.7 + 0.2 * pulse})`;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
}

// ============================================================
// ANALYZE — Control
// ============================================================
function startWallbreakerAnalyze() {
    const app = gameState.wallbreakerApp;
    if (!app || !app.open) {
        output.innerHTML += `<span class="text-error">[✗] wallbreaker.exe no está abierto.</span><br>`;
        return false;
    }
    const server = gameState.currentServer;
    const fw = server.firewall;

    if (!fw || !fw.active) {
        output.innerHTML += `<span class="text-muted">Este servidor no tiene firewall activo.</span><br>`;
        return false;
    }

    if (fw.analyzed) {
        if (fw.wallMarks && fw.wallMarks.nodes && fw.wallMarks.nodes.length > 0) {
            if (!fw.capturedHex) fw.capturedHex = buildWallbreakerSignature(fw);
            showWallbreakerSignature();
            return false;
        }
        fw.analyzed = false;
        fw.analyzeUses = 0;
    }

    if (fw.analyzeUses >= FIREWALL_MAX_ANALYZE_USES) {
        output.innerHTML += `<span class="text-error">[✗] Firewall reportó actividad anómala — RASTREO INICIADO.</span><br>`;
        if (server.hasTrace && !server.traceLogPath) {
            createTraceLog(server);
            startTrace(server.traceDuration);
        } else if (server.hasTrace && server.traceLogPath) {
            startTrace(server.traceDuration);
        }
        return false;
    }
    if (app.analyzeActive) {
        output.innerHTML += `<span class="text-warning">Analyze ya en curso.</span><br>`;
        return false;
    }
    if (app.breakActive) {
        output.innerHTML += `<span class="text-warning">Break en curso.</span><br>`;
        return false;
    }

    fw.analyzeUses++;
    app.analyzeActive = true;
    app.analyzeStartTime = performance.now();
    app.analyzeSweepActive = true;
    app.analyzeNodes = [];
    app.analyzeEdges = [];
    app.analyzeHandshakeStarted = false;
    app.analyzeCaptureDone = false;

    soundWbSweepStart();

    const numNodes = 6;
    const margin = 0.15;
    let attempts = 0;
    while (app.analyzeNodes.length < numNodes && attempts < 200) {
        attempts++;
        const nx = margin + Math.random() * (1 - margin * 2);
        const ny = margin + Math.random() * (1 - margin * 2);
        let ok = true;
        for (const n of app.analyzeNodes) {
            const dx = n.x - nx, dy = n.y - ny;
            if (Math.hypot(dx, dy) < 0.25) { ok = false; break; }
        }
        if (ok) app.analyzeNodes.push({ x: nx, y: ny, born: 0, pinged: false });
    }
    for (let i = 1; i < app.analyzeNodes.length; i++) {
        let best = 0, bestDist = Infinity;
        for (let j = 0; j < i; j++) {
            const dx = app.analyzeNodes[i].x - app.analyzeNodes[j].x;
            const dy = app.analyzeNodes[i].y - app.analyzeNodes[j].y;
            const d = Math.hypot(dx, dy);
            if (d < bestDist) { bestDist = d; best = j; }
        }
        app.analyzeEdges.push({ from: best, to: i, drawn: 0 });
    }

    output.innerHTML += `<span class="text-fire">[~] Enviando paquetes de sondeo...</span><br>`;
    output.innerHTML += `<span class="text-muted">[~] Capturando handshake del firewall...</span><br>`;
    return true;
}

function updateWallbreakerAnalyze(now) {
    const app = gameState.wallbreakerApp;
    if (!app || !app.analyzeActive) return;

    let elapsed = now - app.analyzeStartTime;
    if (!isFinite(elapsed) || elapsed < 0) {
        app.analyzeStartTime = now;
        elapsed = 0;
    }

    const WALL = app.data.WALL;

    if (elapsed < WB_T_SWEEP_END) {
        app.analyzeSweepY = WALL.y + (elapsed / WB_T_SWEEP_END) * WALL.h;
    } else {
        app.analyzeSweepY = -9999;
        app.analyzeSweepActive = false;
    }
    if (elapsed > WB_T_NODES_START && elapsed < WB_T_NODES_END) {
        const t = (elapsed - WB_T_NODES_START) / (WB_T_NODES_END - WB_T_NODES_START);
        const nodesToShow = Math.ceil(t * app.analyzeNodes.length);
        app.analyzeNodes.forEach((n, i) => {
            if (i < nodesToShow && !n.pinged) {
                n.pinged = true;
                n.born = now;
                soundWbNodePing(i);
            }
        });
    } else if (elapsed >= WB_T_NODES_END) {
        app.analyzeNodes.forEach((n, i) => {
            if (!n.pinged) { n.pinged = true; n.born = now; soundWbNodePing(i); }
        });
    }
    if (elapsed > WB_T_EDGES_START && elapsed < WB_T_EDGES_END) {
        const t = (elapsed - WB_T_EDGES_START) / (WB_T_EDGES_END - WB_T_EDGES_START);
        const edgesToShow = t * app.analyzeEdges.length;
        app.analyzeEdges.forEach((e, i) => {
            const target = Math.max(0, Math.min(1, edgesToShow - i));
            if (target > 0 && e.drawn === 0) soundWbEdgeChirp();
            e.drawn = target;
        });
    } else if (elapsed >= WB_T_EDGES_END) {
        app.analyzeEdges.forEach(e => e.drawn = 1);
    }
    if (elapsed > WB_T_EDGES_END && !app.analyzeHandshakeStarted) {
        app.analyzeHandshakeStarted = true;
        app.analyzeHandshakeStartTime = now;
        soundWbHandshake();
    }
    if (elapsed >= WB_T_HANDSHAKE_END && !app.analyzeCaptureDone) {
        app.analyzeCaptureDone = true;
        soundWbCapture();
    }
    if (elapsed >= WB_T_CAPTURE_END) {
        finishWallbreakerAnalyze();
    }
}

function drawWallbreakerAnalyzeLayer(ctx, now, WALL, app) {
    if (app.analyzeSweepActive) {
        const y = app.analyzeSweepY;
        const grad = ctx.createLinearGradient(0, y - 40, 0, y + 40);
        grad.addColorStop(0, 'rgba(120, 240, 255, 0)');
        grad.addColorStop(0.4, 'rgba(120, 240, 255, 0.35)');
        grad.addColorStop(0.5, 'rgba(180, 255, 255, 0.65)');
        grad.addColorStop(0.6, 'rgba(120, 240, 255, 0.35)');
        grad.addColorStop(1, 'rgba(120, 240, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(WALL.x, y - 40, WALL.w, 80);
        ctx.strokeStyle = 'rgba(220, 255, 255, 0.95)';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#80f0ff';
        ctx.beginPath();
        ctx.moveTo(WALL.x, y);
        ctx.lineTo(WALL.x + WALL.w, y);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    for (const e of app.analyzeEdges) {
        if (e.drawn <= 0) continue;
        const nFrom = app.analyzeNodes[e.from];
        const nTo = app.analyzeNodes[e.to];
        const x1 = WALL.x + nFrom.x * WALL.w;
        const y1 = WALL.y + nFrom.y * WALL.h;
        const x2 = WALL.x + nTo.x * WALL.w;
        const y2 = WALL.y + nTo.y * WALL.h;
        const ex = x1 + (x2 - x1) * e.drawn;
        const ey = y1 + (y2 - y1) * e.drawn;
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, 'rgba(255, 180, 60, 0.75)');
        grad.addColorStop(1, 'rgba(120, 240, 255, 0.85)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(120, 240, 255, 0.7)';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.shadowBlur = 0;
        if (e.drawn < 1) {
            ctx.fillStyle = 'rgba(220, 255, 255, 1)';
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#80f0ff';
            ctx.beginPath();
            ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    if (app.analyzeHandshakeStarted && !app.analyzeCaptureDone) {
        const hs = (now - app.analyzeHandshakeStartTime) / (WB_T_HANDSHAKE_END - WB_T_EDGES_END);
        if (hs >= 0 && hs <= 1) {
            const idx = Math.min(app.analyzeEdges.length - 1, Math.floor(hs * app.analyzeEdges.length));
            const localT = (hs * app.analyzeEdges.length) - idx;
            const e = app.analyzeEdges[idx];
            if (e) {
                const nFrom = app.analyzeNodes[e.from];
                const nTo = app.analyzeNodes[e.to];
                const x1 = WALL.x + nFrom.x * WALL.w;
                const y1 = WALL.y + nFrom.y * WALL.h;
                const x2 = WALL.x + nTo.x * WALL.w;
                const y2 = WALL.y + nTo.y * WALL.h;
                const px = x1 + (x2 - x1) * localT;
                const py = y1 + (y2 - y1) * localT;
                const g = ctx.createRadialGradient(px, py, 0, px, py, 22);
                g.addColorStop(0, 'rgba(220, 255, 255, 0.95)');
                g.addColorStop(0.4, 'rgba(120, 240, 255, 0.5)');
                g.addColorStop(1, 'rgba(120, 240, 255, 0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(px, py, 22, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    for (const n of app.analyzeNodes) {
        if (!n.pinged) continue;
        const age = (now - n.born) / 1000;
        const fadeIn = Math.min(1, age * 4);
        const px = WALL.x + n.x * WALL.w;
        const py = WALL.y + n.y * WALL.h;
        if (age < 0.7) {
            const waveR = age * 60;
            const waveAlpha = (1 - age / 0.7) * 0.7;
            ctx.strokeStyle = `rgba(255, 220, 100, ${waveAlpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(px, py, waveR, 0, Math.PI * 2);
            ctx.stroke();
        }
        const pulse = 0.7 + 0.3 * Math.sin(now * 0.005 + n.x * 10);
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(255, 220, 100, 1)';
        ctx.fillStyle = `rgba(255, 240, 180, ${fadeIn})`;
        ctx.beginPath();
        ctx.arc(px, py, 3.5 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 220, 100, ${fadeIn * 0.85})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 7 * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

function finishWallbreakerAnalyze() {
    const app = gameState.wallbreakerApp;
    const server = gameState.currentServer;
    app.analyzeActive = false;

    if (!server || !server.firewall) return;
    const fw = server.firewall;
    fw.analyzed = true;

    const signatureText = buildWallbreakerSignatureText(fw);
    const hex = signatureText.split('').map(c =>
        c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')
    ).join(' ');

    app.wallMarks.nodes = app.analyzeNodes.map(n => ({
        x: n.x, y: n.y, broken: false
    }));
    app.wallMarks.edges = app.analyzeEdges.map(e => ({
        from: e.from, to: e.to
    }));

    fw.capturedHex = hex;
    fw.wallMarks = {
        nodes: app.wallMarks.nodes.map(n => ({ x: n.x, y: n.y })),
        edges: app.wallMarks.edges.map(e => ({ from: e.from, to: e.to }))
    };

    const usesLeft = FIREWALL_MAX_ANALYZE_USES - fw.analyzeUses;

    let html = `<div class="msg-box">`;
    html += `<span class="text-success">[✓] Firma capturada (${fw.analyzeUses}/${FIREWALL_MAX_ANALYZE_USES}).</span><br>`;
    html += `<div class="hex-block" style="font-family:Consolas,monospace;color:#ffaa44;background:#150800;padding:4px 8px;display:inline-block;letter-spacing:2px;border:1px solid #663300;margin-top:6px;">${hex}</div>`;
    if (usesLeft <= 0) {
        html += `<br><span class="text-error">[!] No te quedan análisis disponibles.</span>`;
    }
    html += `</div>`;
    output.innerHTML += html;
    output.scrollTop = output.scrollHeight;
    saveGame();
}

// ============================================================
// BREAK — Control
// ============================================================
function startWallbreakerBreak(version) {
    const app = gameState.wallbreakerApp;
    if (!app || !app.open) {
        output.innerHTML += `<span class="text-error">[✗] wallbreaker.exe no está abierto.</span><br>`;
        return false;
    }
    const server = gameState.currentServer;
    const fw = server.firewall;
    if (!fw || !fw.active) {
        output.innerHTML += `<span class="text-muted">Este servidor no tiene firewall activo.</span><br>`;
        return false;
    }
    if (!fw.analyzed) {
        output.innerHTML += `<span class="text-error">[✗] No tenés la firma del firewall.</span><br>`;
        return false;
    }
    if (version === undefined || isNaN(version)) {
        output.innerHTML += `<span class="text-error">[✗] Uso: wallbreaker break [versión]</span><br>`;
        return false;
    }
    if (Math.abs(version - fw.version) > 0.001) {
        output.innerHTML += `<span class="text-error">[✗] Firma no coincide. El firewall registró el intento.</span><br>`;
        if (server.hasTrace) {
            if (!server.traceLogPath) {
                createTraceLog(server);
                output.innerHTML += `<span class="text-error">[!] RASTREO INICIADO.</span><br>`;
                startTrace(server.traceDuration);
            } else {
                output.innerHTML += `<span class="text-error">[!] RASTREO CONTINÚA.</span><br>`;
            }
        }
        return false;
    }
    if (app.breakActive) {
        output.innerHTML += `<span class="text-warning">Break ya en curso.</span><br>`;
        return false;
    }

    app.breakActive = true;
    app.breakStartTime = performance.now();
    app.breakProjectiles = [];
    app.breakCracks = [];
    app.breakCrackPositions = [];
    app.breakFragments = [];
    app.breakDebris = [];
    app.breakShakeIntensity = 0;
    app.breakLastProjectileAt = 0;
    app.breakLastDebrisAt = 0;
    app.breakAllNodesBroken = false;
    app.breakAllNodesBrokenAt = 0;
    app.breakExploded = false;
    app.breakVictoryPlayed = false;
    app.breakAppClosing = false;
    app.breakNextNodeIdx = 0;
    app.breakPendingDelayedSpawns = [];

    soundWbCharge();

    output.innerHTML += `<span class="text-muted">[~] Iniciando exploit universal...</span><br>`;
    return true;
}

function updateWallbreakerBreak(now, dt) {
    const app = gameState.wallbreakerApp;
    if (!app || !app.breakActive) return;

    let elapsed = now - app.breakStartTime;
    if (!isFinite(elapsed) || elapsed < 0) {
        app.breakStartTime = now;
        elapsed = 0;
    }

    const WALL = app.data.WALL;
    const marks = app.wallMarks;

    for (let i = app.breakPendingDelayedSpawns.length - 1; i >= 0; i--) {
        if (now >= app.breakPendingDelayedSpawns[i].time) {
            const d = app.breakPendingDelayedSpawns[i];
            spawnWbProjectile(now, d.targetX, d.targetY, d.nodeIdx, app, WALL);
            app.breakPendingDelayedSpawns.splice(i, 1);
        }
    }

    if (elapsed > WB_BT_CHARGE_END && !app.breakAllNodesBroken && marks.nodes.length > 0) {
        const progress = Math.min(1, (elapsed - WB_BT_CHARGE_END) / (WB_BT_IMPACTS_END - WB_BT_CHARGE_END));
        const interval = 220 - progress * 100;

        if (now - app.breakLastProjectileAt > interval) {
            app.breakLastProjectileAt = now;
            const totalNodes = marks.nodes.length;
            let attempts = 0;
            let chosenIdx = -1;
            while (attempts < totalNodes) {
                const idx = app.breakNextNodeIdx % totalNodes;
                app.breakNextNodeIdx++;
                if (!marks.nodes[idx].broken) { chosenIdx = idx; break; }
                attempts++;
            }
            if (chosenIdx >= 0) {
                const node = marks.nodes[chosenIdx];
                const targetX = WALL.x + node.x * WALL.w;
                const targetY = WALL.y + node.y * WALL.h;
                spawnWbProjectile(now, targetX, targetY, chosenIdx, app, WALL);
                if (Math.random() < 0.5) {
                    app.breakPendingDelayedSpawns.push({
                        time: now + 80, targetX, targetY, nodeIdx: chosenIdx
                    });
                }
            }
            if (Math.random() < 0.6) {
                const sx = WALL.x + WALL.w * (0.1 + Math.random() * 0.8);
                const sy = WALL.y + WALL.h * (0.1 + Math.random() * 0.8);
                app.breakPendingDelayedSpawns.push({
                    time: now + 40 + Math.random() * 60,
                    targetX: sx, targetY: sy, nodeIdx: -1
                });
            }
        }
    }

    for (let i = app.breakProjectiles.length - 1; i >= 0; i--) {
        const p = app.breakProjectiles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const dx = p.x - p.targetX;
        const dy = p.y - p.targetY;
        if (dx * dx + dy * dy < 144) {
            onWbImpact(p.targetX, p.targetY, p.nodeIdx, now, app, WALL, marks);
            app.breakProjectiles.splice(i, 1);
            continue;
        }
        if (p.x < -200 || p.x > 800 || p.y < -200 || p.y > 800) {
            app.breakProjectiles.splice(i, 1);
        }
    }

    for (const c of app.breakCracks) {
        if (c.progress < 1) c.progress = Math.min(1, c.progress + dt * 0.9);
        for (const br of c.branches) {
            if (c.progress > 0.45 && br.progress < 1) {
                br.progress = Math.min(1, br.progress + dt * 1.1);
            }
        }
    }

    for (let i = app.breakDebris.length - 1; i >= 0; i--) {
        const d = app.breakDebris[i];
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vx *= 0.94;
        d.vy *= 0.94;
        d.vy += 40 * dt;
        d.life -= dt * 0.9;
        if (d.life <= 0) app.breakDebris.splice(i, 1);
    }

    if (!app.breakAllNodesBroken && marks.nodes.length > 0) {
        let allBroken = true;
        for (const n of marks.nodes) {
            if (!n.broken) { allBroken = false; break; }
        }
        if (allBroken) {
            app.breakAllNodesBroken = true;
            app.breakAllNodesBrokenAt = now;
        }
    }

    if (app.breakAllNodesBroken && !app.breakExploded && (now - app.breakAllNodesBrokenAt) >= WB_BT_EXPLOSION_DELAY) {
        triggerWbExplosion(app, WALL);
    }
    if (!app.breakExploded && elapsed >= WB_BT_IMPACTS_END) {
        triggerWbExplosion(app, WALL);
    }

    if (app.breakExploded) {
        for (const f of app.breakFragments) {
            f.x += f.vx * dt;
            f.y += f.vy * dt;
            f.vx *= 0.985;
            f.vy *= 0.985;
            f.rot += f.rotSpeed * dt;
            f.rotSpeed *= 0.985;
        }
        if (now - app.breakLastDebrisAt > 30 && elapsed < WB_BT_APP_CLOSE - 500) {
            app.breakLastDebrisAt = now;
            if (app.breakFragments.length > 0) {
                const f = app.breakFragments[Math.floor(Math.random() * app.breakFragments.length)];
                app.breakDebris.push({
                    x: f.cx + f.x, y: f.cy + f.y,
                    vx: (Math.random() - 0.5) * 50,
                    vy: (Math.random() - 0.5) * 50,
                    size: 1 + Math.random() * 2,
                    life: 1, hue: f.hue
                });
            }
        }
    }

    if (!app.breakVictoryPlayed && app.breakExploded && (now - app.breakAllNodesBrokenAt) >= WB_BT_EXPLOSION_DELAY + 200) {
        app.breakVictoryPlayed = true;
        soundWbVictory();
    }

    if (elapsed >= WB_BT_APP_CLOSE && !app.breakAppClosing && app.breakExploded) {
        app.breakAppClosing = true;
        finishWallbreakerBreak();
    }
}

// ============================================================
// Helpers de break
// ============================================================
function isWbCrackPositionFree(x, y, app) {
    for (const p of app.breakCrackPositions) {
        if (Math.hypot(p.x - x, p.y - y) < WB_CRACK_MIN_DIST) return false;
    }
    return true;
}

function findWbFreeCrackPosition(sx, sy, app, WALL) {
    if (isWbCrackPositionFree(sx, sy, app)) return { x: sx, y: sy };
    for (let i = 1; i <= WB_CRACK_MAX_TRIES; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = WB_CRACK_MIN_DIST * (0.9 + i * 0.35);
        const nx = sx + Math.cos(angle) * radius;
        const ny = sy + Math.sin(angle) * radius;
        if (nx < WALL.x + 10 || nx > WALL.x + WALL.w - 10) continue;
        if (ny < WALL.y + 10 || ny > WALL.y + WALL.h - 10) continue;
        if (isWbCrackPositionFree(nx, ny, app)) return { x: nx, y: ny };
    }
    return null;
}

function spawnWbProjectile(now, targetX, targetY, nodeIdx, app, WALL) {
    const arriveAngle = Math.random() * Math.PI * 2;
    const originDist = Math.max(WALL.w, WALL.h) * 1.2 + 60;
    const ox = targetX - Math.cos(arriveAngle) * originDist;
    const oy = targetY - Math.sin(arriveAngle) * originDist;
    const dx = targetX - ox;
    const dy = targetY - oy;
    const d = Math.hypot(dx, dy);
    const speed = 400 + Math.random() * 220;
    app.breakProjectiles.push({
        x: ox, y: oy,
        vx: (dx / d) * speed,
        vy: (dy / d) * speed,
        targetX, targetY,
        nodeIdx: nodeIdx !== undefined ? nodeIdx : -1
    });
    soundWbProjectileLaunch();
}

function makeWbCrack(x, y) {
    let angle = Math.random() * Math.PI * 2;
    const numSegs = 4 + Math.floor(Math.random() * 4);
    const totalLen = 40 + Math.random() * 90;
    const segLen = totalLen / numSegs;
    let gx = x, gy = y;
    const segments = [];
    for (let i = 0; i < numSegs; i++) {
        angle += (Math.random() - 0.5) * 1.4;
        const nx = gx + Math.cos(angle) * segLen;
        const ny = gy + Math.sin(angle) * segLen;
        segments.push({ x1: gx, y1: gy, x2: nx, y2: ny });
        gx = nx; gy = ny;
    }
    const branches = [];
    const numBr = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numBr; i++) {
        const idx = Math.floor(segments.length * (0.2 + Math.random() * 0.6));
        const seg = segments[Math.min(idx, segments.length - 1)];
        const mx = (seg.x1 + seg.x2) / 2;
        const my = (seg.y1 + seg.y2) / 2;
        const ba = angle + (Math.random() - 0.5) * 2.6;
        const bl = 15 + Math.random() * 40;
        branches.push({
            x: mx, y: my,
            ex: mx + Math.cos(ba) * bl,
            ey: my + Math.sin(ba) * bl,
            progress: 0
        });
    }
    return { segments, branches, progress: 0, life: 1 };
}

function onWbImpact(hitX, hitY, nodeIdx, now, app, WALL, marks) {
    let crackOriginX = hitX;
    let crackOriginY = hitY;
    if (nodeIdx >= 0 && nodeIdx < marks.nodes.length) {
        const node = marks.nodes[nodeIdx];
        crackOriginX = WALL.x + node.x * WALL.w;
        crackOriginY = WALL.y + node.y * WALL.h;
        if (!node.broken) node.broken = true;
    }
    const pos = findWbFreeCrackPosition(crackOriginX, crackOriginY, app, WALL);
    if (pos) {
        app.breakCracks.push(makeWbCrack(pos.x, pos.y));
        app.breakCrackPositions.push({ x: pos.x, y: pos.y });
    }
    const numSparks = 8 + Math.floor(Math.random() * 6);
    for (let i = 0; i < numSparks; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 60 + Math.random() * 180;
        app.breakDebris.push({
            x: hitX, y: hitY,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            size: 1.2 + Math.random() * 2.4,
            life: 1,
            hue: 15 + Math.random() * 30
        });
    }
    app.breakShakeIntensity = Math.min(1.8, app.breakShakeIntensity + 0.4);
    soundWbImpact();
    soundWbCrack();
}

function triggerWbExplosion(app, WALL) {
    const cx = WALL.x + WALL.w / 2;
    const cy = WALL.y + WALL.h / 2;
    const cols = 12, rows = 16;
    const cellW = WALL.w / cols;
    const cellH = WALL.h / rows;
    const pts = [];
    for (let r = 0; r <= rows; r++) {
        pts[r] = [];
        for (let c = 0; c <= cols; c++) {
            const jitterX = (c === 0 || c === cols) ? 0 : (Math.random() - 0.5) * cellW * 0.6;
            const jitterY = (r === 0 || r === rows) ? 0 : (Math.random() - 0.5) * cellH * 0.6;
            pts[r][c] = { x: WALL.x + c * cellW + jitterX, y: WALL.y + r * cellH + jitterY };
        }
    }
    const fragments = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tl = pts[r][c], tr = pts[r][c + 1], br = pts[r + 1][c + 1], bl = pts[r + 1][c];
            const tris = [[tl, tr, br], [tl, br, bl]];
            for (const tri of tris) {
                const tcx = (tri[0].x + tri[1].x + tri[2].x) / 3;
                const tcy = (tri[0].y + tri[1].y + tri[2].y) / 3;
                const dx = tcx - cx;
                const dy = tcy - cy;
                const d = Math.max(1, Math.hypot(dx, dy));
                const baseSpeed = 350 + Math.random() * 350;
                const vx = (dx / d) * baseSpeed + (Math.random() - 0.5) * 100;
                const vy = (dy / d) * baseSpeed + (Math.random() - 0.5) * 100;
                const ty = (tcy - WALL.y) / WALL.h;
                const hue = 20 + (1 - ty) * 25;
                const lightness = 40 + (1 - ty) * 30;
                fragments.push({
                    points: tri.map(p => ({ x: p.x, y: p.y })),
                    cx: tcx, cy: tcy, x: 0, y: 0, vx, vy,
                    rot: 0, rotSpeed: (Math.random() - 0.5) * 12,
                    life: 1, hue, lightness
                });
            }
        }
    }
    app.breakFragments = fragments;
    app.breakExploded = true;
    app.breakShakeIntensity = 3.5;
    soundWbExplosion();
}

function finishWallbreakerBreak() {
    const app = gameState.wallbreakerApp;
    const server = gameState.currentServer;
    app.breakActive = false;

    if (server && server.firewall) {
        server.firewall.active = false;
        server.firewall.broken = true;
    }

    const headerText = document.getElementById('wallbreaker-header-text');
    if (headerText) headerText.textContent = '✓ FIREWALL DESTRUIDO';

    setTimeout(() => {
        closeWallbreakerApp(true);
    }, 500);

    let html = `<div class="msg-box">`;
    html += `<span class="text-success">[✓] Firewall v${server ? server.firewall.version : '?'} neutralizado.</span>`;
    html += `</div>`;
    output.innerHTML += html;

    saveGame();
    updateUI();
}

// ============================================================
// DIBUJO DEL BREAK
// ============================================================
function drawWallbreakerBreakLayer(ctx, now, WALL, app) {
    const elapsed = now - app.breakStartTime;

    if (elapsed < WB_BT_CHARGE_END) {
        const t = elapsed / WB_BT_CHARGE_END;
        const pulse = t * (0.5 + 0.5 * Math.sin(now * 0.02));
        ctx.strokeStyle = `rgba(120, 240, 255, ${pulse * 0.8})`;
        ctx.lineWidth = 3 + pulse * 4;
        ctx.shadowBlur = 25 * pulse;
        ctx.shadowColor = '#80f0ff';
        ctx.strokeRect(WALL.x + 4, WALL.y + 4, WALL.w - 8, WALL.h - 8);
        ctx.shadowBlur = 0;
    }

    for (const p of app.breakProjectiles) {
        const grad = ctx.createLinearGradient(
            p.x - p.vx * 0.05, p.y - p.vy * 0.05,
            p.x, p.y
        );
        grad.addColorStop(0, 'rgba(120, 240, 255, 0)');
        grad.addColorStop(1, 'rgba(220, 255, 255, 0.95)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#80f0ff';
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 0.05, p.y - p.vy * 0.05);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(220, 255, 255, 1)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    for (const c of app.breakCracks) {
        const totalSegs = c.segments.length;
        const segProgress = c.progress * totalSegs;
        for (let i = 0; i < totalSegs; i++) {
            const seg = c.segments[i];
            const localT = Math.max(0, Math.min(1, segProgress - i));
            if (localT <= 0) continue;
            const ex = seg.x1 + (seg.x2 - seg.x1) * localT;
            const ey = seg.y1 + (seg.y2 - seg.y1) * localT;
            ctx.strokeStyle = `rgba(120, 240, 255, ${0.9 * c.life})`;
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 18;
            ctx.shadowColor = '#80f0ff';
            ctx.beginPath();
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(ex, ey);
            ctx.stroke();
            ctx.strokeStyle = `rgba(230, 255, 255, ${c.life})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(ex, ey);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        for (const br of c.branches) {
            if (br.progress <= 0) continue;
            const ex = br.x + (br.ex - br.x) * br.progress;
            const ey = br.y + (br.ey - br.y) * br.progress;
            ctx.strokeStyle = `rgba(120, 240, 255, ${0.75 * c.life})`;
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#80f0ff';
            ctx.beginPath();
            ctx.moveTo(br.x, br.y);
            ctx.lineTo(ex, ey);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }

    for (const d of app.breakDebris) {
        ctx.fillStyle = `hsla(${d.hue}, 100%, 65%, ${d.life * 0.9})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${d.hue}, 100%, 70%, ${d.life})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * d.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function drawWallbreakerFragments(ctx, app) {
    for (const f of app.breakFragments) {
        ctx.save();
        ctx.translate(f.cx + f.x, f.cy + f.y);
        ctx.rotate(f.rot);
        const color = `hsl(${f.hue}, 100%, ${f.lightness}%)`;
        ctx.beginPath();
        const p0 = f.points[0];
        ctx.moveTo(p0.x - f.cx, p0.y - f.cy);
        for (let i = 1; i < f.points.length; i++) {
            const p = f.points[i];
            ctx.lineTo(p.x - f.cx, p.y - f.cy);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowBlur = 14;
        ctx.shadowColor = color;
        ctx.strokeStyle = `hsla(${f.hue}, 100%, 75%, 0.95)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = `hsla(${f.hue}, 100%, 85%, 0.35)`;
        ctx.fill();
        ctx.restore();
    }
}

function drawWallbreakerDebris(ctx, app) {
    for (const d of app.breakDebris) {
        ctx.fillStyle = `hsla(${d.hue}, 100%, 65%, ${d.life * 0.9})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${d.hue}, 100%, 75%, ${d.life})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * d.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ============================================================
// SONIDO
// ============================================================
function wbAudioOn() { return audioCtx && audioCtx.state === 'running'; }
let wbDrone = null;

function startDroneWB() {
    if (!wbAudioOn() || wbDrone) return;
    try {
        const osc = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        const g = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = 42;
        filter.type = 'lowpass';
        filter.frequency.value = 160;
        filter.Q.value = 3;
        g.gain.setValueAtTime(0, audioCtx.currentTime);
        g.gain.linearRampToValueAtTime(0.016, audioCtx.currentTime + 2.0);
        osc.connect(filter); filter.connect(g); g.connect(audioCtx.destination);
        osc.start();
        wbDrone = { osc, g };
    } catch (e) {}
}

function stopDroneWB() {
    if (!wbDrone) return;
    const { osc, g } = wbDrone;
    wbDrone = null;
    try {
        const t = audioCtx.currentTime;
        g.gain.cancelScheduledValues(t);
        g.gain.setValueAtTime(g.gain.value, t);
        g.gain.linearRampToValueAtTime(0.0001, t + 0.5);
        setTimeout(() => { try { osc.stop(); } catch(e) {} }, 700);
    } catch (e) {}
}

function updateWallbreakerAmbientSounds(now) {
    if (!wbAudioOn()) return;
    if (!wbDrone) startDroneWB();
    const app = gameState.wallbreakerApp;
    if (!app) return;
    const ss = app.soundState;
    if (now - ss.lastAmbientCrackleAt > 80 + Math.random() * 220) {
        ss.lastAmbientCrackleAt = now;
        soundWbCrackle(0.5 + Math.random() * 0.5);
    }
}

function soundWbCrackle(intensity) {
    if (!wbAudioOn()) return;
    try {
        const dur = 0.05 + Math.random() * 0.08;
        const sr = audioCtx.sampleRate;
        const bufSize = Math.max(64, Math.floor(sr * dur));
        const buf = audioCtx.createBuffer(1, bufSize, sr);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
            const env = Math.pow(1 - i / bufSize, 3);
            d[i] = (Math.random() * 2 - 1) * env;
        }
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200 + Math.random() * 2600;
        filter.Q.value = 5 + Math.random() * 7;
        const g = audioCtx.createGain();
        g.gain.value = 0.012 * (intensity || 1);
        src.connect(filter); filter.connect(g); g.connect(audioCtx.destination);
        src.start();
    } catch (e) {}
}

function soundWbSweepStart() {
    if (!wbAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        const f = audioCtx.createBiquadFilter();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.exponentialRampToValueAtTime(1800, t + 0.8);
        f.type = 'bandpass'; f.Q.value = 8;
        f.frequency.setValueAtTime(200, t);
        f.frequency.exponentialRampToValueAtTime(2200, t + 0.8);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.05, t + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);
        osc.connect(f); f.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 1.0);
    } catch (e) {}
}

function soundWbNodePing(idx) {
    if (!wbAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const base = 500 + idx * 90;
        const osc = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine'; osc2.type = 'sine';
        osc.frequency.setValueAtTime(base, t);
        osc2.frequency.setValueAtTime(base * 2, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.045, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        osc.connect(g); osc2.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc2.start(t);
        osc.stop(t + 0.4); osc2.stop(t + 0.4);
    } catch (e) {}
}

function soundWbEdgeChirp() {
    if (!wbAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, t);
        osc.frequency.exponentialRampToValueAtTime(2400, t + 0.06);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.03, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.12);
    } catch (e) {}
}

function soundWbHandshake() {
    if (!wbAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(1400, t + 0.55);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.05, t + 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.7);
    } catch (e) {}
}

function soundWbCapture() {
    if (!wbAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        [659.25, 880, 1318.51].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            const start = t + i * 0.05;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);
            g.gain.setValueAtTime(0, start);
            g.gain.linearRampToValueAtTime(0.055, start + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
            osc.connect(g); g.connect(audioCtx.destination);
            osc.start(start); osc.stop(start + 0.6);
        });
    } catch (e) {}
}

function soundWbCharge() {
    if (!wbAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        const f = audioCtx.createBiquadFilter();
        osc.type = 'sawtooth'; osc2.type = 'square';
        osc.frequency.setValueAtTime(50, t);
        osc.frequency.linearRampToValueAtTime(140, t + 1.0);
        osc2.frequency.setValueAtTime(75, t);
        osc2.frequency.linearRampToValueAtTime(210, t + 1.0);
        f.type = 'lowpass';
        f.frequency.setValueAtTime(300, t);
        f.frequency.exponentialRampToValueAtTime(900, t + 1.0);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.04, t + 0.3);
        g.gain.linearRampToValueAtTime(0.06, t + 0.95);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
        osc.connect(f); f.connect(g); g.connect(audioCtx.destination);
        osc2.connect(f);
        osc.start(t); osc2.start(t);
        osc.stop(t + 1.15); osc2.stop(t + 1.15);
    } catch (e) {}
}

function soundWbProjectileLaunch() {
    if (!wbAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1800 + Math.random() * 400, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.15);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.025, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.22);
    } catch (e) {}
}

function soundWbImpact() {
    if (!wbAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(32, t + 0.3);
        g.gain.setValueAtTime(0.14, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.45);

        const oscSub = audioCtx.createOscillator();
        const gSub = audioCtx.createGain();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(70, t);
        oscSub.frequency.exponentialRampToValueAtTime(28, t + 0.15);
        gSub.gain.setValueAtTime(0.10, t);
        gSub.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        oscSub.connect(gSub); gSub.connect(audioCtx.destination);
        oscSub.start(t); oscSub.stop(t + 0.25);

        const sr = audioCtx.sampleRate;
        const bufSize = Math.floor(sr * 0.08);
        const buf = audioCtx.createBuffer(1, bufSize, sr);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 5);
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        const f = audioCtx.createBiquadFilter();
        f.type = 'bandpass'; f.frequency.value = 600; f.Q.value = 1.5;
        const g2 = audioCtx.createGain(); g2.gain.value = 0.09;
        src.connect(f); f.connect(g2); g2.connect(audioCtx.destination);
        src.start();
    } catch (e) {}
}

function soundWbCrack() {
    if (!wbAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2200 + Math.random() * 800, t);
        osc.frequency.exponentialRampToValueAtTime(3800, t + 0.08);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.028, t + 0.003);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.14);
    } catch (e) {}
}

function soundWbExplosion() {
    if (!wbAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const sub = audioCtx.createOscillator();
        const subG = audioCtx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(90, t);
        sub.frequency.exponentialRampToValueAtTime(22, t + 0.6);
        subG.gain.setValueAtTime(0.35, t);
        subG.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        sub.connect(subG); subG.connect(audioCtx.destination);
        sub.start(t); sub.stop(t + 1.0);

        const sr = audioCtx.sampleRate;
        const bufSize = Math.floor(sr * 1.6);
        const buf = audioCtx.createBuffer(1, bufSize, sr);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
            const env = Math.pow(1 - i / bufSize, 1.5);
            d[i] = (Math.random() * 2 - 1) * env;
        }
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        const f = audioCtx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.setValueAtTime(6500, t);
        f.frequency.exponentialRampToValueAtTime(180, t + 1.4);
        f.Q.value = 2;
        const g2 = audioCtx.createGain(); g2.gain.value = 0.28;
        src.connect(f); f.connect(g2); g2.connect(audioCtx.destination);
        src.start();

        const mid = audioCtx.createOscillator();
        const midG = audioCtx.createGain();
        mid.type = 'triangle';
        mid.frequency.setValueAtTime(180, t);
        mid.frequency.exponentialRampToValueAtTime(45, t + 0.35);
        midG.gain.setValueAtTime(0.18, t);
        midG.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        mid.connect(midG); midG.connect(audioCtx.destination);
        mid.start(t); mid.stop(t + 0.55);

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                if (!wbAudioOn()) return;
                const tt = audioCtx.currentTime;
                const o = audioCtx.createOscillator();
                const gg = audioCtx.createGain();
                o.type = 'triangle';
                const base = 1600 + Math.random() * 3000;
                o.frequency.setValueAtTime(base, tt);
                o.frequency.exponentialRampToValueAtTime(base * 1.5, tt + 0.05);
                gg.gain.setValueAtTime(0, tt);
                gg.gain.linearRampToValueAtTime(0.014, tt + 0.003);
                gg.gain.exponentialRampToValueAtTime(0.0001, tt + 0.12);
                o.connect(gg); gg.connect(audioCtx.destination);
                o.start(tt); o.stop(tt + 0.14);
            }, i * 50 + Math.random() * 80);
        }
    } catch (e) {}
}

function soundWbVictory() {
    if (!wbAudioOn()) return;
    try {
        const t = audioCtx.currentTime + 0.3;
        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            const start = t + i * 0.1;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);
            g.gain.setValueAtTime(0, start);
            g.gain.linearRampToValueAtTime(0.07, start + 0.03);
            g.gain.exponentialRampToValueAtTime(0.0001, start + 2.0);
            osc.connect(g); g.connect(audioCtx.destination);
            osc.start(start); osc.stop(start + 2.1);
        });
    } catch (e) {}
}