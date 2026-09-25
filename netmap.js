let netmapZoom = 1;
const NETMAP_ZOOM_MIN = 0.35;
const NETMAP_ZOOM_MAX = 3.5;
const NETMAP_ZOOM_STEP = 1.15;

function getServerBasePosition(index) {
    let i = index;
    let ring = 0;
    while (true) {
        const cap = 6 * (ring + 1);
        if (i < cap) break;
        i -= cap;
        ring++;
    }
    const radius = 85 + ring * 70;
    const count = 6 * (ring + 1);
    const angleOffset = ring * 0.6 - Math.PI / 2;
    const angle = (i / count) * Math.PI * 2 + angleOffset;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

function resolveNodeOverlaps(nodes, minDist) {
    const iterations = 20;
    for (let iter = 0; iter < iterations; iter++) {
        let moved = false;
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = b.baseX - a.baseX;
                const dy = b.baseY - a.baseY;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 0.0001) {
                    const angle = Math.random() * Math.PI * 2;
                    const offset = minDist * 0.5;
                    if (!a.fixed) { a.baseX -= Math.cos(angle) * offset; a.baseY -= Math.sin(angle) * offset; }
                    if (!b.fixed) { b.baseX += Math.cos(angle) * offset; b.baseY += Math.sin(angle) * offset; }
                    moved = true;
                    continue;
                }
                if (dist < minDist) {
                    const overlap = minDist - dist;
                    const nx = dx / dist, ny = dy / dist;
                    if (a.fixed && !b.fixed) { b.baseX += nx * overlap; b.baseY += ny * overlap; }
                    else if (b.fixed && !a.fixed) { a.baseX -= nx * overlap; a.baseY -= ny * overlap; }
                    else if (!a.fixed && !b.fixed) {
                        a.baseX -= nx * overlap * 0.5; a.baseY -= ny * overlap * 0.5;
                        b.baseX += nx * overlap * 0.5; b.baseY += ny * overlap * 0.5;
                    }
                    moved = true;
                }
            }
        }
        if (!moved) break;
    }
}

function layoutNodes() {
    const now = performance.now();

    const playerNode = { id: 'player', ip: '127.0.0.1', baseX: 0, baseY: 0, x: 0, y: 0, w: 60, h: 16, clickable: false, fixed: true, isPlayer: true };
    const gomailNode = { id: 'gomail', ip: 'gomail.com', baseX: -90, baseY: -70, x: 0, y: 0, w: 60, h: 16, clickable: true, isGomail: true, fixed: false, floatPhaseX: 0.5, floatPhaseY: 1.5, floatAmpX: 2, floatAmpY: 2, floatSpeed: 0.4 };
    const marketNode = { id: 'market', ip: 'market.onion', baseX: 90, baseY: -70, x: 0, y: 0, w: 60, h: 16, clickable: true, isMarket: true, fixed: false, floatPhaseX: 2.1, floatPhaseY: 0.7, floatAmpX: 2, floatAmpY: 2, floatSpeed: 0.5 };
    const hacknetNode = { id: 'hacknet', ip: 'hacknet.onion', baseX: 0, baseY: -140, x: 0, y: 0, w: 70, h: 16, clickable: true, isHacknet: true, fixed: false, floatPhaseX: 1.2, floatPhaseY: 2.8, floatAmpX: 2, floatAmpY: 2, floatSpeed: 0.45 };
    const newsNode = { id: 'news', ip: 'news.com', baseX: -140, baseY: 20, x: 0, y: 0, w: 60, h: 16, clickable: true, isNews: true, fixed: false, floatPhaseX: 1.9, floatPhaseY: 0.3, floatAmpX: 2, floatAmpY: 2, floatSpeed: 0.38 };

    const discoveredServers = gameState.servers.filter(s => s.discovered);
    const serverNodes = [];
    discoveredServers.forEach((server) => {
        const basePos = getServerBasePosition(server.netIndex !== undefined ? server.netIndex : 0);
        serverNodes.push({
            id: 'server_' + server.ip,
            ip: server.ip,
            baseX: basePos.x, baseY: basePos.y, x: 0, y: 0,
            w: 70, h: 16, clickable: true,
            hasTrace: server.hasTrace,
            server: server,
            fixed: false,
            floatPhaseX: (server.netIndex * 1.7) % (Math.PI * 2),
            floatPhaseY: (server.netIndex * 2.3) % (Math.PI * 2),
            floatAmpX: 1.2, floatAmpY: 1.2,
            floatSpeed: 0.3 + (server.netIndex % 5) * 0.08
        });
    });

    let allNodes;
if (gameState.gamePhase === 'last-chance') {
    allNodes = [playerNode, ...serverNodes];
} else {
    allNodes = [playerNode, gomailNode, marketNode, hacknetNode, newsNode, ...serverNodes];
}
    resolveNodeOverlaps(allNodes, 70);

    allNodes.forEach(n => {
        if (n.fixed) { n.x = n.baseX; n.y = n.baseY; }
        else {
            const t = now * 0.001 * n.floatSpeed;
            n.x = n.baseX + Math.sin(t + n.floatPhaseX) * n.floatAmpX;
            n.y = n.baseY + Math.cos(t * 1.3 + n.floatPhaseY) * n.floatAmpY;
        }
    });

    gameState.netmapNodes = allNodes;
    gameState.netmapServerNodes = serverNodes;

    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    allNodes.forEach(n => {
        const halfW = n.w / 2 + 20;
        const halfH = n.h / 2 + 20;
        if (n.x - halfW < minX) minX = n.x - halfW;
        if (n.x + halfW > maxX) maxX = n.x + halfW;
        if (n.y - halfH < minY) minY = n.y - halfH;
        if (n.y + halfH > maxY) maxY = n.y + halfH;
    });
    gameState.netmapBounds = { minX, maxX, minY, maxY };
}

function drawNodeOrb(x, y, color, label, opts) {
    opts = opts || {};
    const isActive = opts.active !== false;
    const radius = opts.radius || 6;
    const hasGlow = opts.glow || false;

    if (hasGlow && isActive) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
        grad.addColorStop(0, color + '55');
        grad.addColorStop(1, color + '00');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, radius * 3, 0, Math.PI * 2); ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.strokeStyle = isActive ? color : color + '55';
    ctx.lineWidth = 1.4 / netmapZoom;
    if (hasGlow && isActive) {
        ctx.shadowBlur = 8 / netmapZoom;
        ctx.shadowColor = color;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (isActive) {
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }

    if (label) {
        // El texto crece linealmente con el zoom, con techo.
        // Base 11px al zoom 1, +3.5px por unidad de zoom, cap a 22px.
        // Nunca por debajo de 11px (zoom out no lo achica).
        const screenSize = Math.max(11, Math.min(22, 11 + (netmapZoom - 1) * 3.5));
        const fontSize = screenSize / netmapZoom;

        // Bold a partir de 15px para mejorar legibilidad
        const fontWeight = screenSize >= 15 ? 'bold ' : '';
        ctx.font = `${fontWeight}${fontSize}px Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Offset proporcional al radio del círculo (para que respire)
        const labelY = y + radius + Math.max(5 / netmapZoom, 3.5);

        // Sombra sutil para que se lea sobre cualquier fondo
        ctx.save();
        ctx.shadowBlur = 4 / netmapZoom;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.fillStyle = isActive ? color : color + '77';
        ctx.fillText(label, x, labelY);
        ctx.restore();
    }
}

function drawNetmap() {
    if (!gameState.netmapOpen) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    layoutNodes();
    const bounds = gameState.netmapBounds;

    let camX = gameState.netmapCamX, camY = gameState.netmapCamY;
    const marginX = 50, marginY = 40;
    camX = Math.max(bounds.minX - marginX, Math.min(bounds.maxX + marginX, camX));
    camY = Math.max(bounds.minY - marginY, Math.min(bounds.maxY + marginY, camY));
    gameState.netmapCamX = camX; gameState.netmapCamY = camY;

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(netmapZoom, netmapZoom);
    ctx.translate(-camX, -camY);

    const viewHalfW = (W / 2) / netmapZoom;
    const viewHalfH = (H / 2) / netmapZoom;
    const worldLeft = camX - viewHalfW, worldRight = camX + viewHalfW;
    const worldTop = camY - viewHalfH, worldBottom = camY + viewHalfH;

    ctx.strokeStyle = 'rgba(0, 255, 0, 0.08)';
    ctx.lineWidth = 1 / netmapZoom;
    const gridSpacing = 25;
    const startGridX = Math.floor(worldLeft / gridSpacing) * gridSpacing;
    for (let x = startGridX; x <= worldRight; x += gridSpacing) { ctx.beginPath(); ctx.moveTo(x, worldTop); ctx.lineTo(x, worldBottom); ctx.stroke(); }
    const startGridY = Math.floor(worldTop / gridSpacing) * gridSpacing;
    for (let y = startGridY; y <= worldBottom; y += gridSpacing) { ctx.beginPath(); ctx.moveTo(worldLeft, y); ctx.lineTo(worldRight, y); ctx.stroke(); }

    // FIX: buscar nodos por ID en vez de por índice
    const nodes = gameState.netmapNodes;
    const isLastChance = gameState.gamePhase === 'last-chance';
    const player = nodes.find(n => n.isPlayer) || nodes[0];
    const gomail = isLastChance ? null : nodes.find(n => n.isGomail);
const market = isLastChance ? null : nodes.find(n => n.isMarket);
const hacknet = isLastChance ? null : nodes.find(n => n.isHacknet);
const news = isLastChance ? null : nodes.find(n => n.isNews);
const servers = gameState.netmapServerNodes;

    ctx.lineWidth = 0.8 / netmapZoom;

    // Conexión player → gomail (si existe)
    if (gomail) {
        ctx.strokeStyle = 'rgba(255, 204, 0, 0.35)';
        ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(gomail.x, gomail.y); ctx.stroke();
    }
    // Conexión player → market (si existe)
    if (market) {
        ctx.strokeStyle = 'rgba(255, 204, 0, 0.35)';
        ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(market.x, market.y); ctx.stroke();
    }
    // Conexión player → hacknet (si existe)
    if (hacknet) {
        ctx.strokeStyle = 'rgba(255, 170, 68, 0.35)';
        ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(hacknet.x, hacknet.y); ctx.stroke();
    }
	
if (news) {
    ctx.strokeStyle = 'rgba(68, 221, 255, 0.35)';
    ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(news.x, news.y); ctx.stroke();
}
    // Conexiones player → servers
    servers.forEach(s => {
        ctx.beginPath(); ctx.moveTo(player.x, player.y); ctx.lineTo(s.x, s.y);
        if (s.server.pinned) ctx.strokeStyle = 'rgba(255, 221, 68, 0.45)';
        else if (s.hasTrace) ctx.strokeStyle = 'rgba(255, 80, 80, 0.35)';
        else ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.stroke();
    });

    drawNodeOrb(player.x, player.y, '#33ccff', '127.0.0.1', { radius: 9, glow: true, active: true });
    if (gomail) drawNodeOrb(gomail.x, gomail.y, '#ffcc00', 'gomail.com', { radius: 8, glow: true, active: true });
    if (market) drawNodeOrb(market.x, market.y, '#ffcc00', 'market.onion', { radius: 8, glow: true, active: true });
    if (hacknet) drawNodeOrb(hacknet.x, hacknet.y, '#ffaa44', 'hacknet.onion', { radius: 8, glow: true, active: true });
    if (news) drawNodeOrb(news.x, news.y, '#44ddff', 'news.com', { radius: 8, glow: true, active: true });
    servers.forEach(s => {
        let color;
        if (s.server.pinned) color = '#ffdd44';
        else if (s.hasTrace) color = '#ff6666';
        else color = '#33ff33';
        const active = s.server.discovered;
        drawNodeOrb(s.x, s.y, color, s.ip, { radius: 6, glow: true, active });
                if (s.server.pinned) {
            // Mismo criterio que los labels: lineal + cap
            const pinScreenSize = Math.max(12, Math.min(22, 12 + (netmapZoom - 1) * 3.5));
            ctx.fillStyle = '#ffdd44';
            ctx.font = `bold ${pinScreenSize / netmapZoom}px Consolas, monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            const pinOffset = Math.max(10 / netmapZoom, 6);
            ctx.fillText('📌', s.x, s.y - pinOffset);
        }
    });

    if (gameState.scanning) {
        gameState.scanTrail.forEach((t, i) => {
            const alpha = (i / gameState.scanTrail.length) * 0.15;
            ctx.beginPath(); ctx.arc(t.x, t.y, 16, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(51, 255, 51, ${alpha})`; ctx.fill();
        });
        const lx = gameState.scanLupaX, ly = gameState.scanLupaY;
        const grad = ctx.createRadialGradient(lx, ly, 4, lx, ly, 22);
        grad.addColorStop(0, 'rgba(51, 255, 51, 0.4)');
        grad.addColorStop(1, 'rgba(51, 255, 51, 0)');
        ctx.beginPath(); ctx.arc(lx, ly, 22, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(lx, ly, 16, 0, Math.PI * 2); ctx.strokeStyle = '#33ff33'; ctx.lineWidth = 2 / netmapZoom; ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lx - 8, ly); ctx.lineTo(lx + 8, ly);
        ctx.moveTo(lx, ly - 8); ctx.lineTo(lx, ly + 8);
        ctx.strokeStyle = 'rgba(51, 255, 51, 0.7)'; ctx.lineWidth = 1 / netmapZoom; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(lx + 11, ly + 11); ctx.lineTo(lx + 20, ly + 20);
        ctx.strokeStyle = '#33ff33'; ctx.lineWidth = 2.5 / netmapZoom; ctx.stroke();
    }

    ctx.restore();

    ctx.fillStyle = 'rgba(0, 255, 0, 0.45)';
    ctx.font = '8px Consolas, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillText(`x:${Math.round(camX)} y:${Math.round(camY)} · zoom:${netmapZoom.toFixed(2)}x`, 4, H - 4);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(0, 255, 0, 0.35)';
    ctx.fillText('[rueda = zoom]', W - 4, H - 4);
}

function startNetmapAnim() {
    if (netmapAnimFrameId) return;
    function loop() {
        if (!gameState.netmapOpen) { netmapAnimFrameId = null; return; }
        drawNetmap();
        netmapAnimFrameId = requestAnimationFrame(loop);
    }
    netmapAnimFrameId = requestAnimationFrame(loop);
}

function getVisibleWorldBounds() {
    const W = canvas.width, H = canvas.height;
    const viewHalfW = (W / 2) / netmapZoom;
    const viewHalfH = (H / 2) / netmapZoom;
    const camX = gameState.netmapCamX;
    const camY = gameState.netmapCamY;
    return {
        left: camX - viewHalfW,
        right: camX + viewHalfW,
        top: camY - viewHalfH,
        bottom: camY + viewHalfH
    };
}

function startScan() {
    if (gameState.gamePhase === 'last-chance') {
        output.innerHTML += `<span class="text-error">[✗] Escaneo deshabilitado en modo emergencia.</span><br>`;
        output.scrollTop = output.scrollHeight;
        return;
    }
    if (!gameState.netmapOpen) { output.innerHTML += `<span class="text-error">Error: Necesitas abrir NetMap primero (comando: netmap).</span><br>`; return; }
    if (gameState.scanning) { output.innerHTML += `<span class="text-warning">Ya hay un escaneo en curso.</span><br>`; return; }

    let undiscovered = gameState.servers.filter(s => !s.discovered);
    if (undiscovered.length === 0) {
        spawnMoreServers(6);
        undiscovered = gameState.servers.filter(s => !s.discovered);
        output.innerHTML += `<span class="text-info">[i] La red se ha expandido. Nuevos nodos disponibles.</span><br>`;
    }

    if (gameState.ram + SCAN_RAM_COST > gameState.maxRam) { output.innerHTML += `<span class="text-error">Error: RAM insuficiente para escanear (requiere ${SCAN_RAM_COST} GB).</span><br>`; return; }
    gameState.scanning = true;
    gameState.scanStartTime = Date.now();
    gameState.scanProgress = 0;

    const vb = getVisibleWorldBounds();
    gameState.scanLupaX = (vb.left + vb.right) / 2;
    gameState.scanLupaY = (vb.top + vb.bottom) / 2;
    gameState.scanVX = 0; gameState.scanVY = 0;
    updateScanTarget();
    gameState.scanTrail = [];
    gameState.scanDiscoveredCount = 0;
    gameState.scanDiscoverOrder = [...undiscovered].sort(() => Math.random() - 0.5).slice(0, Math.min(4, undiscovered.length));
    const procId = 'scan_' + Date.now();
    const proc = { id: procId, toolName: 'scan.exe', portNum: null, ram: SCAN_RAM_COST, serverIP: 'local', isScan: true, status: 'hacking', progress: 0, portObj: null, resultMessage: '' };
    gameState.runningProcesses.push(proc);
    gameState.scanProcId = procId;
    currentProcessPage = gameState.runningProcesses.length - 1;
    lastProcessSignature = '__force__';
    updateUI();
    output.innerHTML += `<div class="msg-box"><span class="text-success">[>] Escaneando red local... (${SCAN_RAM_COST} GB de RAM)</span></div>`;
    output.scrollTop = output.scrollHeight;

    initAudio();
    soundScanStart();
    setTimeout(() => startScannerSound(), 150);

    function animLoop() {
        if (!gameState.scanning) return;
        const elapsed = Date.now() - gameState.scanStartTime;
        const progress = Math.min(100, (elapsed / SCAN_DURATION_MS) * 100);
        gameState.scanProgress = progress;

        const vb = getVisibleWorldBounds();
        const margin = 20;
        const minX = vb.left + margin;
        const maxX = vb.right - margin;
        const minY = vb.top + margin;
        const maxY = vb.bottom - margin;

        const dx = gameState.scanTargetX - gameState.scanLupaX;
        const dy = gameState.scanTargetY - gameState.scanLupaY;
        gameState.scanVX += dx * 0.0009; gameState.scanVY += dy * 0.0009;
        gameState.scanVX *= 0.97; gameState.scanVY *= 0.97;
        gameState.scanLupaX += gameState.scanVX; gameState.scanLupaY += gameState.scanVY;

        gameState.scanLupaX = Math.max(minX, Math.min(maxX, gameState.scanLupaX));
        gameState.scanLupaY = Math.max(minY, Math.min(maxY, gameState.scanLupaY));

        gameState.scanTrail.push({ x: gameState.scanLupaX, y: gameState.scanLupaY });
        if (gameState.scanTrail.length > 24) gameState.scanTrail.shift();
        if (Math.hypot(dx, dy) < 25) updateScanTarget();

        const proc = gameState.runningProcesses.find(p => p.id === gameState.scanProcId);
        if (proc) { proc.progress = Math.floor(progress); updateProcessBarUI(proc); }

        const shouldBeDiscovered = Math.floor((progress / 100) * gameState.scanDiscoverOrder.length);
        while (gameState.scanDiscoveredCount < shouldBeDiscovered) {
            gameState.scanDiscoverOrder[gameState.scanDiscoveredCount].discovered = true;
            gameState.scanDiscoveredCount++;
            soundSonarPing();
        }
        if (progress < 100) requestAnimationFrame(animLoop); else finishScan();
    }
    requestAnimationFrame(animLoop);
}

function updateScanTarget() {
    const vb = getVisibleWorldBounds();
    const margin = 25;
    gameState.scanTargetX = vb.left + margin + Math.random() * (vb.right - vb.left - margin * 2);
    gameState.scanTargetY = vb.top + margin + Math.random() * (vb.bottom - vb.top - margin * 2);
}

function finishScan() {
    const idx = gameState.runningProcesses.findIndex(p => p.id === gameState.scanProcId);
    gameState.scanDiscoverOrder.forEach(s => s.discovered = true);
    if (idx >= 0) gameState.runningProcesses.splice(idx, 1);
    gameState.scanning = false;
    stopScannerSound();
    if (currentProcessPage >= gameState.runningProcesses.length) {
        currentProcessPage = Math.max(0, gameState.runningProcesses.length - 1);
    }
    lastProcessSignature = '__force__';
    output.innerHTML += `<div class="msg-box"><span class="text-success">✓ Escaneo completo. ${gameState.scanDiscoverOrder.length} nodo(s) descubierto(s):</span><br>`;
    gameState.scanDiscoverOrder.forEach(s => {
    const traceInfo = s.hasTrace ? '<span class="text-error">[RASTREO ACTIVO]</span>' : '<span class="text-success">[SIN RASTREO]</span>';
    const secInfo = s.hasTrace ? ` <span class="text-muted">(seg: ${Math.round(s.securityLevel*100)}%)</span>` : '';
    const webTag = s.isWebServer ? ' <span class="text-fire">[WEB]</span>' : '';
    output.innerHTML += `&nbsp;&nbsp;<span class="text-info">${s.ip}</span>${webTag} ${traceInfo}${secInfo}<br>`;
});
    output.innerHTML += `<span class="text-muted">Haz clic en un nodo del NetMap para autocompletar el connect. Arrastra el mapa para desplazarte. Rueda del ratón para zoom.</span></div>`;
    output.scrollTop = output.scrollHeight;
    soundScanComplete();
    updateUI();
    saveGame();
}

function handleNetmapClick(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);
    const W = canvas.width, H = canvas.height;
    const worldX = (clickX - W / 2) / netmapZoom + gameState.netmapCamX;
    const worldY = (clickY - H / 2) / netmapZoom + gameState.netmapCamY;

    // En touch damos un poco más de margen porque el dedo es más impreciso
    const isTouch = e.pointerType === 'touch' || e.pointerType === 'pen';
    const hitR = isTouch ? 20 : 14;

    for (const node of gameState.netmapNodes) {
        if (!node.clickable) continue;
        const dx = worldX - node.x;
        const dy = worldY - node.y;
        if (Math.abs(dx) < hitR && Math.abs(dy) < hitR) {
            if (node.isMarket) input.value = 'connect market.onion';
            else if (node.isGomail) input.value = 'connect gomail.com';
            else if (node.isHacknet) input.value = 'connect hacknet.onion';
            else if (node.isNews) input.value = 'connect news.com';
            else input.value = `connect ${node.ip}`;
            input.focus();
            setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
            return;
        }
    }
}

// ============================================================
// NETMAP INPUT — Pointer Events (mouse + touch unificados)
// ============================================================

// Mapa de punteros activos: pointerId → { x, y, type }
const netmapActivePointers = new Map();

// Estado del pinch zoom
let netmapPinchStartDist = 0;
let netmapPinchStartZoom = 1;
let netmapPinchMidX = 0;
let netmapPinchMidY = 0;

function netmapPointerDownHandler(e) {
    if (!gameState.netmapOpen || gameState.scanning) return;
    // Solo botón principal para mouse
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}

    netmapActivePointers.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY,
        type: e.pointerType
    });

    if (netmapActivePointers.size === 1) {
        // Un solo dedo / mouse → modo drag
        gameState.netmapDragging = true;
        gameState.netmapDragStartX = e.clientX;
        gameState.netmapDragStartY = e.clientY;
        gameState.netmapDragCamStartX = gameState.netmapCamX;
        gameState.netmapDragCamStartY = gameState.netmapCamY;
        gameState.netmapDragMoved = false;
        canvas.classList.add('dragging');
    } else if (netmapActivePointers.size === 2) {
        // Dos dedos → pinch zoom
        gameState.netmapDragging = false;
        canvas.classList.remove('dragging');

        const pts = [...netmapActivePointers.values()];
        netmapPinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        netmapPinchStartZoom = netmapZoom;

        // Coordenadas internas del canvas del punto medio del pinch
        const rect = canvas.getBoundingClientRect();
        const midClientX = (pts[0].x + pts[1].x) / 2;
        const midClientY = (pts[0].y + pts[1].y) / 2;
        netmapPinchMidX = (midClientX - rect.left) * (canvas.width / rect.width);
        netmapPinchMidY = (midClientY - rect.top) * (canvas.height / rect.height);
    }
}

function netmapPointerMoveHandler(e) {
    if (!gameState.netmapOpen) return;
    if (!netmapActivePointers.has(e.pointerId)) return;

    netmapActivePointers.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY,
        type: e.pointerType
    });

    if (netmapActivePointers.size === 1 && gameState.netmapDragging) {
        // Drag con un dedo
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const dx = (e.clientX - gameState.netmapDragStartX) * scaleX;
        const dy = (e.clientY - gameState.netmapDragStartY) * scaleY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) gameState.netmapDragMoved = true;
        gameState.netmapCamX = gameState.netmapDragCamStartX - dx / netmapZoom;
        gameState.netmapCamY = gameState.netmapDragCamStartY - dy / netmapZoom;
        drawNetmap();
    } else if (netmapActivePointers.size === 2) {
        // Pinch zoom
        const pts = [...netmapActivePointers.values()];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);

        if (netmapPinchStartDist > 0) {
            const factor = dist / netmapPinchStartDist;
            let newZoom = netmapPinchStartZoom * factor;
            newZoom = Math.max(NETMAP_ZOOM_MIN, Math.min(NETMAP_ZOOM_MAX, newZoom));

            const W = canvas.width, H = canvas.height;
            const oldZoom = netmapZoom;

            // Punto del mundo que estaba debajo del centro del pinch
            const wx = (netmapPinchMidX - W / 2) / oldZoom + gameState.netmapCamX;
            const wy = (netmapPinchMidY - H / 2) / oldZoom + gameState.netmapCamY;

            // Re-anclar con el nuevo zoom para que no se escape
            gameState.netmapCamX = wx - (netmapPinchMidX - W / 2) / newZoom;
            gameState.netmapCamY = wy - (netmapPinchMidY - H / 2) / newZoom;
            netmapZoom = newZoom;
            drawNetmap();
        }
        gameState.netmapDragMoved = true;
    }
}

function netmapPointerUpHandler(e) {
    if (!gameState.netmapOpen) return;
    const wasTracked = netmapActivePointers.has(e.pointerId);
    netmapActivePointers.delete(e.pointerId);

    try { canvas.releasePointerCapture(e.pointerId); } catch (err) {}

    if (netmapActivePointers.size === 0) {
        // Último dedo levantado
        if (gameState.netmapDragging && !gameState.netmapDragMoved && wasTracked && !gameState.scanning) {
            // Fue un tap limpio → click en nodo
            handleNetmapClick(e);
        }
        gameState.netmapDragging = false;
        canvas.classList.remove('dragging');
    } else if (netmapActivePointers.size === 1) {
        // Pasamos de pinch a drag con un dedo restante
        const remaining = [...netmapActivePointers.values()][0];
        gameState.netmapDragging = true;
        gameState.netmapDragStartX = remaining.x;
        gameState.netmapDragStartY = remaining.y;
        gameState.netmapDragCamStartX = gameState.netmapCamX;
        gameState.netmapDragCamStartY = gameState.netmapCamY;
        // Ya hubo movimiento con el pinch: no cuenta como tap
        gameState.netmapDragMoved = true;
    }
}

function netmapPointerCancelHandler(e) {
    netmapActivePointers.delete(e.pointerId);
    if (netmapActivePointers.size === 0) {
        gameState.netmapDragging = false;
        canvas.classList.remove('dragging');
    }
}

function netmapWheelHandler(e) {
    if (!gameState.netmapOpen) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    const W = canvas.width, H = canvas.height;
    const oldZoom = netmapZoom;
    const factor = e.deltaY < 0 ? NETMAP_ZOOM_STEP : 1 / NETMAP_ZOOM_STEP;
    let newZoom = oldZoom * factor;
    newZoom = Math.max(NETMAP_ZOOM_MIN, Math.min(NETMAP_ZOOM_MAX, newZoom));
    if (Math.abs(newZoom - oldZoom) < 0.0001) return;
    const wx = (mx - W / 2) / oldZoom + gameState.netmapCamX;
    const wy = (my - H / 2) / oldZoom + gameState.netmapCamY;
    gameState.netmapCamX = wx - (mx - W / 2) / newZoom;
    gameState.netmapCamY = wy - (my - H / 2) / newZoom;
    netmapZoom = newZoom;
    drawNetmap();
}

function netmapDblClickHandler(e) {
    if (!gameState.netmapOpen) return;
    e.preventDefault();
    netmapZoom = 1;
    gameState.netmapCamX = 0;
    gameState.netmapCamY = 0;
    drawNetmap();
}

canvas.addEventListener('pointerdown',   netmapPointerDownHandler);
canvas.addEventListener('pointermove',   netmapPointerMoveHandler);
canvas.addEventListener('pointerup',     netmapPointerUpHandler);
canvas.addEventListener('pointercancel', netmapPointerCancelHandler);
canvas.addEventListener('wheel',         netmapWheelHandler, { passive: false });
canvas.addEventListener('dblclick',      netmapDblClickHandler);

function toggleNetmap() {
    if (gameState.isDeleting) return;
    if (gameState.netmapOpen) {
        if (gameState.scanning) {
            output.innerHTML += `<span class="text-error">No puedes cerrar NetMap mientras escaneas.</span><br>`;
            output.scrollTop = output.scrollHeight;
            return;
        }
        gameState.netmapOpen = false;

        // Limpiar estado de input táctil
        netmapActivePointers.clear();
        gameState.netmapDragging = false;
        gameState.netmapDragMoved = false;
        canvas.classList.remove('dragging');

        output.innerHTML += `<span class="text-warning">NetMap cerrado. RAM liberada.</span><br>`;
    } else {
        if (gameState.ram + 0.5 > gameState.maxRam) {
            output.innerHTML += `<span class="text-error">Error: RAM insuficiente para abrir NetMap (requiere 0.5 GB).</span><br>`;
            return;
        }
        gameState.netmapOpen = true;
        gameState.netmapCamX = 0;
        gameState.netmapCamY = 0;
        netmapZoom = 1;

        // Reset input táctil
        netmapActivePointers.clear();
        gameState.netmapDragging = false;
        gameState.netmapDragMoved = false;

        startNetmapAnim();
        output.innerHTML += `<span class="text-success">NetMap abierto. Arrastrá para mover · Pellizcá para zoom · Doble clic para resetear.</span><br>`;
    }
    output.scrollTop = output.scrollHeight;
    updateUI();
}