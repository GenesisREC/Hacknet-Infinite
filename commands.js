function startTrace(durationSeconds) {
    if (gameState.traceInterval) clearInterval(gameState.traceInterval);
    saveGame();                 
    savePreTraceSnapshot();   
    const speedMult = gameState.traceSpeedMult || 1;
    const tickMs = Math.max(50, 1000 / speedMult);
    gameState.traceTime = durationSeconds;
    gameState.quickTraceActive = false;
    document.body.classList.remove('quick-trace-active');
    document.body.classList.add('trace-active');
    if (durationSeconds <= 10) document.body.classList.add('trace-critical');
    else document.body.classList.remove('trace-critical');
    const mins = Math.floor(durationSeconds / 60), secs = durationSeconds % 60;
    traceTimer.textContent = `RASTREO: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    traceTimer.style.color = '#ff5500';
    traceTimer.style.fontWeight = 'bold';
    traceTimer.style.textShadow = '0 0 8px rgba(255, 80, 0, 0.9)';
    if (gameState.currentServer) gameState.currentServer._traceTriggered = true;
    let tick = 0;
    gameState.traceInterval = setInterval(() => {
        gameState.traceTime--;
        tick++;
        const m = Math.floor(gameState.traceTime / 60), s = gameState.traceTime % 60;
        traceTimer.textContent = `RASTREO: ${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        if (gameState.traceTime <= 10 && gameState.traceTime > 0) {
            document.body.classList.add('trace-critical');
            if (gameState.traceTime <= 5) playTraceCriticalPip(); else playTracePip();
        } else if (gameState.traceTime > 0) {
            const ratio = gameState.traceTime / durationSeconds;
            let cadence;
            if (ratio > 0.6) cadence = 3;
            else if (ratio > 0.3) cadence = 2;
            else cadence = 1;
            if (tick % cadence === 0) playTraceHeartbeat();
        }
        if (gameState.traceTime <= 0) { clearInterval(gameState.traceInterval); stopTrace(); gameOver(); }
    }, tickMs);
}

function triggerQuickTrace(server) {
    if (gameState.quickTraceActive) return;
    saveGame();                 
    savePreTraceSnapshot();
    server.quickTraceTriggered = true;
    if (gameState.traceInterval) clearInterval(gameState.traceInterval);
    gameState.quickTraceActive = true;
    gameState.traceTime = 22;
    document.body.classList.add('quick-trace-active');
    document.body.classList.remove('trace-active');
    document.body.classList.remove('trace-critical');
    output.innerHTML += `<div class="quick-trace-box">
        <div class="text-error" style="font-size:1.35rem; font-weight:bold; letter-spacing:2px;">⚠⚠⚠  ALERTA — RASTREO RÁPIDO  ⚠⚠⚠</div>
        <div class="text-error" style="font-weight:bold; margin-top:8px;">El servidor ha detectado actividad sospechosa:</div>
        <div class="text-warning">&nbsp;• Seguridad del servidor: <b>${Math.round(server.securityLevel * 100)}%</b></div>
        <div class="text-warning">&nbsp;• Descargas acumuladas: <b>${server.downloadsDuringSession}</b></div>
        <div class="text-error" style="margin-top:8px; font-size:1.05rem; font-weight:bold;">▸ SE HA INICIADO UN RASTREO ACELERADO DE 22 SEGUNDOS.</div>
        <div class="text-warning" style="font-weight:bold;">▸ ESCRIBE 'disconnect' AHORA MISMO o perderás la partida.</div>
        <div class="text-muted">(El rastreo rápido no se puede detener borrando logs.)</div>
    </div>`;
    traceTimer.style.color = '#ff0000';
    traceTimer.style.fontWeight = 'bold';
    traceTimer.style.textShadow = '0 0 10px rgba(255,0,0,1)';
    gameState.traceInterval = setInterval(() => {
        gameState.traceTime--;
        traceTimer.textContent = `⚠ RASTREO RÁPIDO: ${String(gameState.traceTime).padStart(2, '0')}s`;
        if (gameState.traceTime <= 10 && gameState.traceTime > 0) {
            document.body.classList.add('trace-critical');
            if (gameState.traceTime <= 5) playTraceCriticalPip(); else playTracePip();
        }
        if (gameState.traceTime === 10 || gameState.traceTime === 5) {
            output.innerHTML += `<span class="text-error" style="font-weight:bold;">[!] ${gameState.traceTime}s restantes — ¡DESCONÉCTATE!</span><br>`;
            output.scrollTop = output.scrollHeight;
        }
        if (gameState.traceTime <= 0) { clearInterval(gameState.traceInterval); stopTrace(); gameOver(); }
    }, 1000);
    output.scrollTop = output.scrollHeight;
}

function stopTrace() {
    if (gameState.traceInterval) clearInterval(gameState.traceInterval);
    gameState.traceInterval = null;
    gameState.quickTraceActive = false;
    document.body.classList.remove('quick-trace-active');
    document.body.classList.remove('trace-active');
    document.body.classList.remove('trace-critical');
    traceTimer.style.animation = '';
    traceTimer.style.color = '#f00';
    traceTimer.style.textShadow = '0 0 5px rgba(255, 0, 0, 0.5)';
    traceTimer.textContent = 'RASTREO: --:--';
}

function gameOver() {
    // Guardar el server que nos rastreó (para el mensaje final)
    if (gameState.currentServer) {
        saveTraceSource({
            profile: gameState.currentServer.profile || 'mixed',
            label: gameState.currentServer.profileLabel || 'Servidor',
            ip: gameState.currentServer.ip
        });
    } else {
        saveTraceSource({ profile: 'random', label: 'Desconocido', ip: null });
    }

    if (typeof enterWhiteTerminal === 'function') {
        enterWhiteTerminal();
    } else {
        gameState.isGameOver = true;
        clearSave();
        input.disabled = true;
        output.innerHTML += `<div class="msg-box"><span class="text-error">[!] FUISTE RASTREADO.</span></div>`;
        setTimeout(() => window.location.reload(), 3000);
    }
}

async function deleteFilesSequentially(filesToDelete) {
    input.disabled = true;
    gameState.isDeleting = true;
    output.innerHTML += `<span class="text-warning">[!] Iniciando borrado... El rastreo continúa.</span><br>`;
    output.scrollTop = output.scrollHeight;

    for (const fileInfo of filesToDelete) {
        if (gameState.isGameOver) break;

        // Duración proporcional al tamaño (mínimo 600ms, máximo 4000ms)
        const deleteTimeMs = Math.max(600, Math.min(fileInfo.size * 250, 4000));
        const deleteTimeSec = (deleteTimeMs / 1000).toFixed(1);

        output.innerHTML += `<span class="text-muted">→ Borrando ${fileInfo.name} (${formatSize(fileInfo.size)})... ${deleteTimeSec}s</span><br>`;
        output.scrollTop = output.scrollHeight;

        // Lanzar proceso visible (con su animación)
        await launchRmProcess(fileInfo, deleteTimeMs);

        if (gameState.isGameOver) break;

        // Ejecutar el borrado real del FS
        const fs = fileInfo.isRemote ? remoteFS : localFS;
        delete fs[fileInfo.path];
        const parentDir = fileInfo.path.substring(0, fileInfo.path.lastIndexOf('/')) || '/';
        if (fs[parentDir]) {
            fs[parentDir].children = fs[parentDir].children.filter(c => c !== fileInfo.name);
        }
        output.innerHTML += `<span class="text-success">✓ ${fileInfo.name} eliminado</span><br>`;

        // Hook: victoria de last-chance
        if (typeof checkLastChanceFileDeleted === 'function') {
            if (checkLastChanceFileDeleted(fileInfo.path)) {
                gameState.isDeleting = false;
                return;
            }
        }

        // Hook: log de rastreo borrado
        if (fileInfo.isTraceLog && gameState.isConnected) {
            stopTrace();
            if (gameState.currentServer) gameState.currentServer.traceLogPath = null;
            output.innerHTML += `<div class="msg-box"><span class="text-success">[✓] Log de conexión eliminado. Rastreo detenido.</span></div>`;
            output.scrollTop = output.scrollHeight;
            autoAdvanceMissionsOnEvent({ type: 'log_deleted', serverIP: gameState.currentIP });
                        if (typeof newsOnLogWiped === 'function' && gameState.currentServer) {
                newsOnLogWiped(gameState.currentServer);
            }
        }

        output.scrollTop = output.scrollHeight;
    }

    gameState.isDeleting = false;
    if (!gameState.isGameOver) { input.disabled = false; input.focus(); }
    output.scrollTop = output.scrollHeight;
}

// ============================================================
// CREACIÓN DE SERVER DE MISIÓN
// ============================================================
function createMissionTargetServer(mission) {
    const ip = mission.targetIP;
    if (!ip) return null;
    if (gameState.servers.some(s => s.ip === ip)) {
        // Ya existe: sólo marcar como "del mission"
        const existing = gameState.servers.find(s => s.ip === ip);
        existing.hiddenFromScan = true;
        return existing;
    }
    const tier = mission.meta.serverTier || mission.minTier || 1;

    // Cap: la versión de los puertos nunca supera demasiado la del jugador
    const maxV = Math.max(1.0, getBestToolVersion() + 0.3);

    const server = createServerObject(ip, gameState.servers.length, tier, {
        maxPortVersion: maxV,
        forceFirewall: !!mission.meta.forceFirewall
    });

    server.discovered = false;
    server.hiddenFromScan = true;
    server.fromMission = mission.id;

    // ─── GARANTÍA DE MISIONES ─────────────────────────────────
    // Aseguramos que SIEMPRE haya al menos `reqPorts` puertos
    // rompibles con las herramientas actuales del jugador. Los
    // demás pueden quedar in-hackeables para mantener la sensación
    // de dificultad, pero la misión es siempre completable.
    const playerV = getBestToolVersion();
    const attackable = server.ports.filter(p => ATTACKABLE_SERVICES.includes(p.service));
    const breakable = attackable.filter(p => parseFloat(p.v) <= playerV);
    const needBreakable = server.reqPorts;
    if (breakable.length < needBreakable) {
        const toFix = needBreakable - breakable.length;
        // Empezar por los que están más cerca de ser rompibles
        const candidates = attackable
            .filter(p => parseFloat(p.v) > playerV)
            .sort((a, b) => parseFloat(a.v) - parseFloat(b.v));
        for (let i = 0; i < toFix && i < candidates.length; i++) {
            candidates[i].v = (playerV * 0.95).toFixed(1);
        }
    }
    // ──────────────────────────────────────────────────────────

    // Inyectar archivos específicos
    if (mission.meta.includeFiles) {
        mission.meta.includeFiles.forEach(fname => {
            const template = SERVER_FILE_POOL.find(f => f.name === fname);
            if (!template) return;
            const scaledSize = scaleFileSize(template.size, tier, template.category);
            const value = computeFileValue(template.category, scaledSize, tier);
            const dir = server.primaryDir;
            const path = dir === '/' ? '/' + fname : dir + '/' + fname;
            server.fs[path] = makeFile(template.content, scaledSize, false, value, template.category);
            if (server.fs[dir] && !server.fs[dir].children.includes(fname)) {
                server.fs[dir].children.push(fname);
            }
        });
    }

    // Inyectar crackers
    if (mission.meta.hasCrackers) {
        const numTools = mission.meta.crackerCount || 2;
        const shuffled = [...CRACKER_NAMES].sort(() => Math.random() - 0.5);
        const [tMin, tMax] = getTierConfig(tier).toolVersionRange;
        for (let i = 0; i < numTools && i < shuffled.length; i++) {
            const tname = shuffled[i];
            const version = parseFloat(randFloat(tMin, tMax).toFixed(1));
            server.fs['/bin/' + tname] = makeExe(tname, version);
            if (!server.fs['/bin'].children.includes(tname)) server.fs['/bin'].children.push(tname);
        }
    }

    gameState.servers.push(server);
    return server;
}

// ============================================================
// HACKNET
// ============================================================
function enterHacknet() {
    gameState.inHacknet = true;
    gameState.inGomail = false;
    gameState.hacknetSession = !!gameState.missionAccount;
    promptSymbol.textContent = 'hacknet>';
    promptSymbol.style.color = '#ffaa44';
    connStatus.textContent = 'HackNet.onion';
    connStatus.style.color = '#ffaa44';
    output.innerHTML += `<div class="msg-box" style="border-left-color:#ffaa44; border-color:#ffaa44;">
        <div style="color:#ffaa44; font-weight:bold; letter-spacing:2px;">◈ HACKNET.ONION ◈</div>
        <div class="text-muted">Tablón de contratos para operadores.</div>
        ${gameState.missionAccount ? `<div class="text-success" style="margin-top:6px;">Cuenta: <b>${gameState.missionAccount.username}</b></div>` : ''}
    </div>`;
    output.scrollTop = output.scrollHeight;
    updateUI();
}

function exitHacknet() {
    gameState.inHacknet = false;
    gameState.hacknetSession = false;
    gameState.isConnected = false;
    gameState.currentIP = null;
    gameState.currentServer = null;
    promptSymbol.textContent = `${gameState.localUser}@local:${localCWD}$`;
    promptSymbol.style.color = '#33ff33';
    connStatus.textContent = 'DESCONECTADO';
    connStatus.style.color = '#ff3333';
    output.innerHTML += `<span class="text-warning">Sesión de HackNet cerrada.</span><br>`;
    output.scrollTop = output.scrollHeight;
    updateUI();
    saveGame();
}

function handleHacknetCommand(cmd) {
    const args = cmd.trim().split(' ');
    const action = args[0].toLowerCase();
    output.innerHTML += `<span class="text-cmd" style="color:#ffaa44;">hacknet> ${cmd}</span><br>`;
    if (cmd.trim() !== '') { commandHistory.push(cmd); historyIndex = commandHistory.length; }

    switch (action) {
                                                case 'help':
    output.innerHTML += `<div class="msg-box" style="border-color:#ffaa44; padding:18px 22px;">

        <div style="text-align:center; color:#ffaa44; font-weight:bold; letter-spacing:4px; font-size:1.05rem;
                    border-bottom:1px dashed rgba(255,170,68,0.5); padding-bottom:12px; margin-bottom:16px;">
            ▸ HACKNET.ONION — COMANDOS
        </div>

        <table class="help-table" style="margin-top:0;">
            <tr><td>missions</td><td>Lista los contratos disponibles en el tablón</td></tr>
            <tr><td>accept [ID]</td><td>Acepta un contrato del tablón</td></tr>
            <tr><td>active</td><td>Muestra tus contratos activos y su progreso</td></tr>
            <tr><td>claim [ID]</td><td>Reclama la recompensa de un contrato completado</td></tr>
            <tr><td>abandon [ID]</td><td>Abandona un contrato en curso</td></tr>
            <tr><td>wallet</td><td>Muestra tu saldo actual en créditos</td></tr>
            <tr><td>exit</td><td>Cierra sesión y sale de HackNet</td></tr>
            <tr><td>disconnect</td><td>Alias de <code>exit</code></td></tr>
        </table>

        <div style="text-align:center; color:#aa8844; font-size:0.75rem; margin-top:16px;
                    padding-top:10px; border-top:1px dashed rgba(255,170,68,0.35);">
            Los detalles de cada contrato aceptado llegan a tu GoMail.
        </div>

    </div>`;
    break;
                case 'missions': {
            if (!gameState.hacknetSession) { output.innerHTML += `<span class="text-error">Iniciá sesión primero.</span><br>`; break; }
            refillMissionsPool();
            if (!gameState.missionsAvailable.length) { output.innerHTML += `<span class="text-muted">No hay contratos disponibles ahora.</span><br>`; break; }
            let html = '<div class="msg-box" style="border-color:#ffaa44;">';
            html += '<div style="color:#ffaa44; font-weight:bold; margin-bottom:10px;">▸ CONTRATOS DISPONIBLES</div>';
            gameState.missionsAvailable.forEach(m => {
                const exp = Math.max(0, Math.floor((m.expiresAt - Date.now()) / 60000));
                const senderTag = m.sender ? ` <span class="text-muted">de ${m.sender}</span>` : '';
                const ipTag = m.targetIP ? `<span class="text-fire">[IP: ${m.targetIP}]</span> ` : '';
                html += `<div class="mission-item">
                    <div class="mission-title"><span class="text-cmd">[${m.id}]</span> <span class="text-warning">${m.title}</span>${senderTag}</div>
                    <div class="mission-desc">${m.description}</div>
                    <div class="mission-meta">${ipTag}<span class="text-info">Pago: ${m.rewardCR.toLocaleString()} CR${m.rewardTool ? ' + posible cracker' : ''}</span> <span class="text-muted">· expira en ${exp}m</span></div>
                </div>`;
            });
            html += '<div class="text-muted" style="margin-top:8px;">Usá: accept [ID]</div></div>';
            output.innerHTML += html;
            break;
        }

        case 'accept': {
            if (!gameState.hacknetSession) { output.innerHTML += `<span class="text-error">Iniciá sesión primero.</span><br>`; break; }
            if (!args[1]) { output.innerHTML += `<span class="text-error">Uso: accept [ID]</span><br>`; break; }
            if (gameState.missionsActive.length >= MISSION_MAX_ACTIVE) { output.innerHTML += `<span class="text-error">Límite alcanzado (${MISSION_MAX_ACTIVE} activas).</span><br>`; break; }
            const idx = gameState.missionsAvailable.findIndex(m => m.id === args[1]);
            if (idx < 0) { output.innerHTML += `<span class="text-error">Contrato no encontrado.</span><br>`; break; }
            const m = gameState.missionsAvailable.splice(idx, 1)[0];
            m.acceptedAt = Date.now();
            m.progress = 0;
            gameState.missionsActive.push(m);

            // Crear el server objetivo si tiene targetIP
            if (m.targetIP) {
                createMissionTargetServer(m);
            }

            output.innerHTML += `<span class="text-success">[✓] Contrato aceptado: ${m.title}</span><br>`;
            if (m.targetIP) {
                output.innerHTML += `<span class="text-warning">[!] Objetivo: <b>${m.targetIP}</b></span><br>`;
                output.innerHTML += `<span class="text-info">Tip: escaneá la IP con </span><span class="text-cmd">scan ${m.targetIP}</span><span class="text-info"> para revelarla en el NetMap.</span><br>`;
            }
            output.innerHTML += `<span class="text-muted">Detalles enviados a tu GoMail.</span><br>`;
            sendGomailEmail('hacknet@onion', 'Contrato aceptado: ' + m.title,
                `Contrato ID: ${m.id}\n\n${m.description}\n\nRecompensa: ${m.rewardCR.toLocaleString()} CR${m.rewardTool ? '\nBonus: posible cracker' : ''}${m.targetIP ? `\n\nIP objetivo: ${m.targetIP}\nUsá "scan ${m.targetIP}" para revelarla.` : ''}\n\nReclamá la recompensa en HackNet cuando lo completes.`,
                m.id);
            soundMissionAccepted();
            saveGame();
            break;
        }

        case 'active': {
            if (!gameState.hacknetSession) { output.innerHTML += `<span class="text-error">Iniciá sesión primero.</span><br>`; break; }
            if (!gameState.missionsActive.length) { output.innerHTML += `<span class="text-muted">Sin contratos activos.</span><br>`; break; }
            let html = '<div class="msg-box" style="border-color:#ffaa44;">';
            html += `<div style="color:#ffaa44; font-weight:bold; margin-bottom:10px;">▸ CONTRATOS ACTIVOS (${gameState.missionsActive.length}/${MISSION_MAX_ACTIVE})</div>`;
            gameState.missionsActive.forEach(m => {
                const ready = m.readyToClaim;
                const statusColor = ready ? '#33ff33' : '#ffcc00';
                html += `<div class="mission-item">
                    <div class="mission-title"><span class="text-cmd">[${m.id}]</span> <span style="color:${statusColor};">${ready ? '✓ ' : ''}${m.title}</span></div>
                    ${m.targetIP ? `<div class="mission-meta"><span class="text-fire">IP: ${m.targetIP}</span></div>` : ''}
                    <div class="mission-progress">Progreso: ${m.progress}/${m.targetCount}</div>
                    <div class="mission-meta"><span class="text-info">Pago: ${m.rewardCR.toLocaleString()} CR</span></div>
                </div>`;
            });
            html += '</div>';
            output.innerHTML += html;
            break;
        }

        case 'claim': {
            if (!gameState.hacknetSession) { output.innerHTML += `<span class="text-error">Iniciá sesión primero.</span><br>`; break; }
            if (!args[1]) { output.innerHTML += `<span class="text-error">Uso: claim [ID]</span><br>`; break; }
            const idx2 = gameState.missionsActive.findIndex(m => m.id === args[1]);
            if (idx2 < 0) { output.innerHTML += `<span class="text-error">Contrato no encontrado.</span><br>`; break; }
            const m2 = gameState.missionsActive[idx2];
            if (!m2.readyToClaim) { output.innerHTML += `<span class="text-warning">No completaste este contrato (${m2.progress}/${m2.targetCount}).</span><br>`; break; }
            gameState.money += m2.rewardCR;
            output.innerHTML += `<span class="text-success">[✓] ${m2.title} — completado</span><br>`;
            output.innerHTML += `<span class="text-gold">&nbsp;&nbsp;+ ${m2.rewardCR.toLocaleString()} CR</span><br>`;
            if (m2.rewardTool && Math.random() < m2.rewardTool.chance) {
                const toolName = CRACKER_NAMES[Math.floor(Math.random() * CRACKER_NAMES.length)];
                const tierCfg = getTierConfig(m2.rewardTool.tier);
                const [tMin, tMax] = tierCfg.toolVersionRange;
                const version = parseFloat(Math.min(5.0, randFloat(tMin, tMax)).toFixed(1));
                const existing = gameState.tools.find(t => t.name === toolName);
                if (existing) {
                    if (version > existing.v) {
                        existing.v = version;
                        localFS['/bin/' + toolName] = makeExe(toolName, version);
                        output.innerHTML += `<span class="text-success">&nbsp;&nbsp;↑ Upgrade: ${toolName} v${version.toFixed(1)}</span><br>`;
                    } else {
                        output.innerHTML += `<span class="text-muted">&nbsp;&nbsp;(Cracker drop: ${toolName} v${version} — ya tenés mejor)</span><br>`;
                    }
                } else {
                    gameState.tools.push({ name: toolName, v: version, ram: TOOL_TEMPLATES[toolName].ram, service: TOOL_TEMPLATES[toolName].service });
                    if (!localFS['/bin'].children.includes(toolName)) localFS['/bin'].children.push(toolName);
                    localFS['/bin/' + toolName] = makeExe(toolName, version);
                    output.innerHTML += `<span class="text-fire">[★] ¡Cracker obtenido! ${toolName} v${version.toFixed(1)}</span><br>`;
                    soundCrackerDrop();
                }
            }
            gameState.missionsActive.splice(idx2, 1);
            m2.claimedAt = Date.now();
            gameState.missionsCompleted.push(m2);
            soundMissionComplete();
            sendGomailEmail('hacknet@onion', '[✓] Contrato completado: ' + m2.title,
                `Recompensa entregada: ${m2.rewardCR.toLocaleString()} CR\n\nContrato ${m2.id} cerrado.`);
            updateUI();
            saveGame();
            break;
        }

        case 'abandon': {
            if (!gameState.hacknetSession) { output.innerHTML += `<span class="text-error">Iniciá sesión primero.</span><br>`; break; }
            if (!args[1]) { output.innerHTML += `<span class="text-error">Uso: abandon [ID]</span><br>`; break; }
            const idx3 = gameState.missionsActive.findIndex(m => m.id === args[1]);
            if (idx3 < 0) { output.innerHTML += `<span class="text-error">Contrato no encontrado.</span><br>`; break; }
            const m3 = gameState.missionsActive.splice(idx3, 1)[0];
            output.innerHTML += `<span class="text-warning">Contrato abandonado: ${m3.title}</span><br>`;
            saveGame();
            break;
        }

        case 'wallet':
            output.innerHTML += `<span class="text-gold">Saldo: ${gameState.money.toLocaleString()} CR</span><br>`;
            break;

        case 'exit':
        case 'disconnect':
            exitHacknet();
            break;

        default:
            output.innerHTML += `<span class="text-error">Comando no reconocido. Escribí 'help'.</span><br>`;
    }
    output.scrollTop = output.scrollHeight;
}

// ============================================================
// DEBUG
// ============================================================
function handleDebugCommand(args) {
    const sub = (args[1] || '').toLowerCase();
    if (!sub || sub === 'help') {
        output.innerHTML += `<div class="msg-box" style="border-color:#ff8833;">
            <div style="color:#ff8833; font-weight:bold; margin-bottom:8px;">▸ DEBUG — Solo probe.com</div>
            <table class="help-table">
                <tr><td>debug missions</td><td>Lista misiones</td></tr>
                <tr><td>debug spawn [n]</td><td>Genera n misiones</td></tr>
                <tr><td>debug complete</td><td>Completa activas</td></tr>
                <tr><td>debug accept_all</td><td>Acepta todas</td></tr>
                <tr><td>debug clear</td><td>Borra todas</td></tr>
                <tr><td>debug tier [n]</td><td>Fuerza tier n (0-8)</td></tr>
                <tr><td>debug reset_accounts</td><td>Borra cuentas</td></tr>
                <tr><td>debug money [n]</td><td>+n CR</td></tr>
                <tr><td>debug cpu [n]</td><td>CPU nivel n</td></tr>
                <tr><td>debug antenna [n]</td><td>Antenna nivel n</td></tr>
                <tr><td>debug mail</td><td>Genera email de prueba</td></tr>
            </table>
        </div>`;
        return;
    }
    if (sub === 'missions') {
        output.innerHTML += `<div class="msg-box" style="border-color:#ff8833;">`;
        output.innerHTML += `<div style="color:#ff8833;">Disponibles: ${gameState.missionsAvailable.length}</div>`;
        gameState.missionsAvailable.forEach(m => {
            output.innerHTML += `<div>&nbsp;&nbsp;<span class="text-cmd">[${m.id}]</span> ${m.title} ${m.targetIP ? `(IP: ${m.targetIP})` : ''} <span class="text-muted">(${m.rewardCR} CR)</span></div>`;
        });
        output.innerHTML += `<div style="color:#ff8833; margin-top:6px;">Activas: ${gameState.missionsActive.length}</div>`;
        gameState.missionsActive.forEach(m => {
            const st = m.readyToClaim ? '<span class="text-success">[READY]</span>' : `<span class="text-muted">[${m.progress}/${m.targetCount}]</span>`;
            output.innerHTML += `<div>&nbsp;&nbsp;<span class="text-cmd">[${m.id}]</span> ${m.title} ${st}</div>`;
        });
        output.innerHTML += `</div>`;
        return;
    }
    if (sub === 'spawn') {
        const n = parseInt(args[2]) || 5;
        for (let i = 0; i < n; i++) gameState.missionsAvailable.push(generateSecondaryMission());
        output.innerHTML += `<span class="text-success">[✓] ${n} misiones generadas.</span><br>`;
        return;
    }
    if (sub === 'complete') {
        gameState.missionsActive.forEach(m => { m.progress = m.targetCount; m.readyToClaim = true; });
        output.innerHTML += `<span class="text-success">[✓] ${gameState.missionsActive.length} completadas.</span><br>`;
        return;
    }
    if (sub === 'accept_all') {
        let count = 0;
        while (gameState.missionsAvailable.length > 0 && gameState.missionsActive.length < MISSION_MAX_ACTIVE) {
            const m = gameState.missionsAvailable.shift();
            m.progress = 0; m.acceptedAt = Date.now();
            gameState.missionsActive.push(m);
            if (m.targetIP) createMissionTargetServer(m);
            count++;
        }
        output.innerHTML += `<span class="text-success">[✓] ${count} aceptadas.</span><br>`;
        return;
    }
    if (sub === 'clear') {
        gameState.missionsAvailable = []; gameState.missionsActive = [];
        output.innerHTML += `<span class="text-success">[✓] Misiones borradas.</span><br>`;
        return;
    }
    if (sub === 'tier') {
        const t = parseInt(args[2]);
        if (isNaN(t) || t < 0 || t >= PLAYER_TIERS.length) { output.innerHTML += `<span class="text-error">Tier inválido (0-8).</span><br>`; return; }
        const tierCfg = getTierConfig(t);
        const ver = parseFloat(tierCfg.toolVersionRange[1].toFixed(1));
        gameState.tools.forEach(tool => { if (tool.v < ver) tool.v = ver; });
        CRACKER_NAMES.forEach(name => {
            if (!gameState.tools.find(t2 => t2.name === name)) gameState.tools.push({ name, v: ver, ram: TOOL_TEMPLATES[name].ram, service: TOOL_TEMPLATES[name].service });
            if (!localFS['/bin'].children.includes(name)) localFS['/bin'].children.push(name);
            localFS['/bin/' + name] = makeExe(name, ver);
        });
        updateUI();
        output.innerHTML += `<span class="text-success">[✓] Tier → ${t}.</span><br>`;
        return;
    }
    if (sub === 'reset_accounts') {
        gameState.missionAccount = null; gameState.gomailAccount = null;
        gameState.gomailLinked = false; gameState.gomailInbox = [];
        gameState.missionsAvailable = []; gameState.missionsActive = [];
        output.innerHTML += `<span class="text-success">[✓] Cuentas reseteadas.</span><br>`;
        return;
    }
    if (sub === 'money') {
        const n = parseInt(args[2]) || 100000;
        gameState.money += n;
        output.innerHTML += `<span class="text-success">[✓] +${n.toLocaleString()} CR.</span><br>`;
        updateUI();
        return;
    }
    if (sub === 'cpu') {
        const n = parseInt(args[2]) || 0;
        gameState.hardware.cpu.level = Math.max(0, Math.min(CPU_UPGRADES.length, n));
        applyHardwareToState();
        output.innerHTML += `<span class="text-success">[✓] CPU nivel ${gameState.hardware.cpu.level}.</span><br>`;
        return;
    }
    if (sub === 'antenna') {
        const n = parseInt(args[2]) || 0;
        gameState.hardware.antenna.level = Math.max(0, Math.min(ANTENNA_UPGRADES.length, n));
        applyHardwareToState();
        output.innerHTML += `<span class="text-success">[✓] Antenna nivel ${gameState.hardware.antenna.level}.</span><br>`;
        return;
    }
    if (sub === 'mail') {
        sendGomailEmail('test@debug', 'Mail de prueba', 'Este es un mail de prueba.\n\nLinea 1\nLinea 2\n\nSaludos.');
        output.innerHTML += `<span class="text-success">[✓] Mail enviado.</span><br>`;
        return;
    }
    output.innerHTML += `<span class="text-error">Subcomando desconocido.</span><br>`;
}

// ============================================================
// HANDLE COMMAND
// ============================================================
function handleCommand(cmd) {
    if (gameState.isDeleting) return;
    const trimmed = cmd.trim();
    if (gameState.inNews) { return; }
	    // En modo last-chance, solo comandos de hackeo
    if (gameState.gamePhase === 'last-chance') {
        const actionLC = trimmed.split(' ')[0].toLowerCase();
        const allowed = ['ls', 'cd', 'cat', 'rm', 'probe', 'run', 'connect', 'disconnect', 'porthack', 'scp', 'help', 'clear', 'netmap'];
        if (!allowed.includes(actionLC)) {
            output.innerHTML += `<span class="text-cmd">${promptSymbol.textContent} ${cmd}</span><br>`;
            output.innerHTML += `<span class="text-error">[✗] Comando no disponible en modo emergencia.</span><br>`;
            output.scrollTop = output.scrollHeight;
            return;
        }
    }
    if (gameState.inHacknet) { handleHacknetCommand(cmd); return; }
    if (gameState.inGomail) { return; }

    if (gameState.pendingReset) {
        if (trimmed.toLowerCase() === 'reset confirm') {
            output.innerHTML += `<span class="text-cmd">${promptSymbol.textContent} ${cmd}</span><br>`;
            output.innerHTML += `<span class="text-error">[!] Confirmado. Reiniciando...</span><br>`;
            output.scrollTop = output.scrollHeight;
            setTimeout(() => { resetGame(); }, 800);
            return;
        } else {
            gameState.pendingReset = false;
            output.innerHTML += `<span class="text-warning">[i] Reset cancelado.</span><br>`;
            output.scrollTop = output.scrollHeight;
            return;
        }
    }
    if (gameState.inMarket) { handleMarketCommand(cmd); return; }

    const args = trimmed.split(' ');
    const action = args[0].toLowerCase();
    output.innerHTML += `<span class="text-cmd">${promptSymbol.textContent} ${cmd}</span><br>`;
    if (cmd.trim() !== '') { commandHistory.push(cmd); historyIndex = commandHistory.length; }

    const FS_COMMANDS = ['ls', 'cd', 'cat', 'rm', 'cp', 'mv', 'scp', 'unzip'];
    const hasRemoteAccess = gameState.currentServer &&
        (gameState.currentServer.accessed || gameState.isAuthenticated);
    if (gameState.isConnected && gameState.currentServer && !hasRemoteAccess && FS_COMMANDS.includes(action)) {
        output.innerHTML += `<div class="msg-box"><span class="text-error">[✗] Acceso denegado al FS remoto.</span></div>`;
        output.scrollTop = output.scrollHeight;
        return;
    }
if (typeof InteractiveTutorialOnCommand === 'function') {
        try { InteractiveTutorialOnCommand(action, args, trimmed); } catch (e) { console.warn('[it-hook]', e); }
    }
    switch (action) {
                                case 'help':
            output.innerHTML += `<div class="msg-box" style="border-color:#33ff33; padding:18px 22px;">

                <div style="text-align:center; color:#33ff33; font-weight:bold; letter-spacing:4px; font-size:1.05rem;
                            border-bottom:1px dashed rgba(51,255,51,0.5); padding-bottom:12px; margin-bottom:18px;">
                    ▸ MANUAL DE COMANDOS
                </div>

                <!-- ================= NAVEGACIÓN LOCAL ================= -->
                <div style="color:#33ff33; font-weight:bold; font-size:0.75rem; letter-spacing:2px;
                            border-bottom:1px dashed rgba(51,255,51,0.35); padding-bottom:6px; margin:0 0 8px 0;">
                    [ NAVEGACIÓN LOCAL ]
                </div>
                <table class="help-table" style="margin-top:0;">
                    <tr><td>ls</td><td>Lista los archivos del directorio actual</td></tr>
                    <tr><td>cd [dir]</td><td>Cambia de directorio · <code>cd ..</code> sube un nivel · <code>cd ~</code> va a /home/user</td></tr>
                    <tr><td>cat [archivo]</td><td>Muestra el contenido de un archivo</td></tr>
                    <tr><td>rm [archivo|*]</td><td>Borra un archivo o todo el directorio · <code>rm *</code> borra secuencialmente</td></tr>
                    <tr><td>cp [orig] [dest]</td><td>Copia un archivo</td></tr>
                    <tr><td>mv [orig] [dest]</td><td>Mueve o renombra un archivo</td></tr>
                    <tr><td>clear</td><td>Limpia la pantalla de la terminal</td></tr>
                </table>

                <!-- ================= RED Y MAPA ================= -->
                <div style="color:#33ccff; font-weight:bold; font-size:0.75rem; letter-spacing:2px;
                            border-bottom:1px dashed rgba(51,204,255,0.35); padding-bottom:6px; margin:20px 0 8px 0;">
                    [ RED Y MAPA ]
                </div>
                <table class="help-table" style="margin-top:0;">
                    <tr><td>netmap</td><td>Abre o cierra el NetMap (consume 0.5 GB de RAM mientras esté abierto)</td></tr>
                    <tr><td>netmap scan</td><td>Escanea la red en busca de nodos nuevos (consume RAM)</td></tr>
                    <tr><td>netmap list</td><td>Lista todos los servidores que ya descubriste</td></tr>
                    <tr><td>netmap pin [IP]</td><td>Fija un nodo en el mapa para no perderlo de vista</td></tr>
                    <tr><td>netmap unpin [IP]</td><td>Quita el pin de un nodo</td></tr>
                    <tr><td>netmap clear</td><td>Limpia del mapa los nodos no-fijados</td></tr>
                    <tr><td>scan [IP]</td><td>Revela una IP puntual en el NetMap · ideal para misiones</td></tr>
                </table>

                <!-- ================= CONEXIÓN ================= -->
                <div style="color:#ffcc00; font-weight:bold; font-size:0.75rem; letter-spacing:2px;
                            border-bottom:1px dashed rgba(255,204,0,0.35); padding-bottom:6px; margin:20px 0 8px 0;">
                    [ CONEXIÓN ]
                </div>
                <table class="help-table" style="margin-top:0;">
                    <tr><td>connect [IP]</td><td>Abre una conexión a un servidor descubierto</td></tr>
                    <tr><td>disconnect</td><td>Corta la conexión y detiene cualquier rastreo activo</td></tr>
                </table>

                <!-- ================= ATAQUE ================= -->
                <div style="color:#ff5555; font-weight:bold; font-size:0.75rem; letter-spacing:2px;
                            border-bottom:1px dashed rgba(255,85,85,0.35); padding-bottom:6px; margin:20px 0 8px 0;">
                    [ ATAQUE ]
                </div>
                <table class="help-table" style="margin-top:0;">
                    <tr><td>probe</td><td>Muestra los puertos del servidor conectado (¡inicia rastreo si el server lo tiene!)</td></tr>
                    <tr><td>run [exe] [puerto]</td><td>Corre un cracker contra un puerto bloqueado · ej: <code>run ssh_crack.exe 22</code></td></tr>
                    <tr><td>porthack [puertos...]</td><td>Abre un túnel inverso tras abrir los puertos requeridos · ej: <code>porthack 22 80</code></td></tr>
                    <tr><td>login [user] [pass]</td><td>Autenticación con credenciales en el server</td></tr>
                    <tr><td>wallbreaker</td><td>Abre la app de firewall (si tenés wallbreaker.exe)</td></tr>
                </table>

                <!-- ================= ARCHIVOS REMOTOS ================= -->
                <div style="color:#33ccff; font-weight:bold; font-size:0.75rem; letter-spacing:2px;
                            border-bottom:1px dashed rgba(51,204,255,0.35); padding-bottom:6px; margin:20px 0 8px 0;">
                    [ ARCHIVOS REMOTOS ]
                </div>
                <table class="help-table" style="margin-top:0;">
                    <tr><td>scp [archivo] [dest]</td><td>Descarga un archivo del server · los .exe van a /bin, el resto a /download</td></tr>
                    <tr><td>unzip [zip] [pass]</td><td>Descomprime un ZIP protegido con contraseña</td></tr>
                </table>

                <!-- ================= SISTEMA ================= -->
                <div style="color:#88ff88; font-weight:bold; font-size:0.75rem; letter-spacing:2px;
                            border-bottom:1px dashed rgba(136,255,136,0.35); padding-bottom:6px; margin:20px 0 8px 0;">
                    [ SISTEMA ]
                </div>
                <table class="help-table" style="margin-top:0;">
                    <tr><td>tools</td><td>Lista las herramientas instaladas en /bin</td></tr>
                    <tr><td>ps</td><td>Muestra los procesos activos y el uso de RAM</td></tr>
                    <tr><td>hardware</td><td>Info de tu CPU, RAM y antena actual</td></tr>
                    <tr><td>reset</td><td>Reinicia la partida (pide confirmación con <code>reset confirm</code>)</td></tr>
                    <tr><td>clearsave</td><td>Borra el guardado y empieza de cero</td></tr>
                    <tr><td>restart</td><td>Recarga el juego</td></tr>
                </table>

                <div style="text-align:center; color:#668866; font-size:0.75rem; margin-top:18px;
                            padding-top:12px; border-top:1px dashed rgba(51,255,51,0.35);">
                    Tip: <code style="color:#ffcc00;">TAB</code> autocompleta · <code style="color:#ffcc00;">↑ ↓</code> historial · <code style="color:#ffcc00;">F1</code> abre el manual completo
                </div>

            </div>`;
            break;

        case 'hardware': {
            const cpu = gameState.hardware.cpu;
            const ant = gameState.hardware.antenna;
            const nextCPU = CPU_UPGRADES[cpu.level];
            const nextAnt = ANTENNA_UPGRADES[ant.level];
            const nextRam = RAM_UPGRADES[gameState.ramUpgradeLevel];
            output.innerHTML += `<div class="msg-box" style="border-color:#00cccc;">
                <div style="color:#00cccc; font-weight:bold; margin-bottom:10px;">▸ HARDWARE</div>
                <div><span class="text-info">CPU:</span> <span class="text-warning">${cpu.label}</span> <span class="text-muted">(x${cpu.mult.toFixed(2)})</span></div>
                ${nextCPU ? `<div class="text-muted" style="margin-left:14px;">Próximo: ${nextCPU.label} · ${nextCPU.price.toLocaleString()} CR</div>` : `<div class="text-success" style="margin-left:14px;">Máximo</div>`}
                <div style="margin-top:8px;"><span class="text-info">RAM:</span> <span class="text-warning">${gameState.maxRam.toFixed(1)} GB</span></div>
                ${nextRam ? `<div class="text-muted" style="margin-left:14px;">Próximo: ${nextRam.ram.toFixed(1)} GB · ${nextRam.price.toLocaleString()} CR</div>` : `<div class="text-success" style="margin-left:14px;">Máximo</div>`}
                <div style="margin-top:8px;"><span class="text-info">Antena:</span> <span class="text-warning">${ant.label}</span> <span class="text-muted">(x${ant.range.toFixed(2)})</span></div>
                ${nextAnt ? `<div class="text-muted" style="margin-left:14px;">Próximo: ${nextAnt.label} · ${nextAnt.price.toLocaleString()} CR</div>` : `<div class="text-success" style="margin-left:14px;">Máximo</div>`}
            </div>`;
            break;
        }

        case 'debug': {
            if (!gameState.isConnected || !gameState.currentServer || !gameState.currentServer.isProbeServer) {
                output.innerHTML += `<span class="text-error">Solo disponible en probe.com.</span><br>`;
                break;
            }
            handleDebugCommand(args);
            break;
        }

        case 'reset':
            gameState.pendingReset = true;
            output.innerHTML += `<div class="danger-box">
                <div class="text-error" style="font-weight:bold; font-size:1.1rem;">⚠ ¡ACCIÓN IRREVERSIBLE! ⚠</div>
                <div style="margin-top:8px;">Vas a <span class="text-error">BORRAR TODA TU PROGRESIÓN</span>.</div>
                <div class="text-warning" style="margin-top:8px;">Para confirmar, escribí: <span class="text-cmd">reset confirm</span></div>
            </div>`;
            break;

        case 'wallbreaker':
        case 'wb':
        case 'wallbreaker.exe': {
            if (!gameState.isConnected || !gameState.currentServer) { output.innerHTML += `<span class="text-error">No conectado.</span><br>`; break; }
            const wbSrv = gameState.currentServer;
            const wbSub = (args[1] || '').toLowerCase();
            const wbFw = wbSrv.firewall;
            if (!wbSub) {
                if (!wbFw || !wbFw.hasFirewall) { output.innerHTML += `<span class="text-muted">Sin firewall.</span><br>`; break; }
                if (!gameState.wallbreakerObtained) { output.innerHTML += `<span class="text-error">[✗] No tenés wallbreaker.exe.</span><br>`; break; }
                openWallbreakerApp();
                break;
            }
			            if (wbSub === 'help') {
                output.innerHTML += `<div class="msg-box" style="border-color:#ffaa44; padding:18px 22px;">

                    <div style="text-align:center; color:#ffaa44; font-weight:bold; letter-spacing:4px; font-size:1.05rem;
                                border-bottom:1px dashed rgba(255,170,68,0.5); padding-bottom:12px; margin-bottom:16px;">
                        wallbreaker.exe — AYUDA
                    </div>

                    <div style="color:#aab8c5; font-size:0.82rem; line-height:1.7; padding:0 4px 14px 4px;">
                        <b style="color:#ffaa44;">wallbreaker.exe</b> es la herramienta para neutralizar firewalls.
                        Su uso es <b style="color:#ffcc44;">secuencial</b>: primero analizás, después rompés.
                    </div>

                    <div style="color:#ffaa44; font-weight:bold; font-size:0.75rem; letter-spacing:2px;
                                border-bottom:1px dashed rgba(255,170,68,0.35); padding-bottom:6px; margin:8px 0 10px 0;">
                        [ SUBCOMANDOS ]
                    </div>

                    <table class="help-table" style="margin-top:0;">
                        <tr><td>wallbreaker</td><td>Abre la aplicación (requiere estar conectado a un server con firewall)</td></tr>
                        <tr><td>wallbreaker analyze</td><td>Ejecuta un sondeo. Captura la firma del firewall. Consume 1 análisis (máx. 2 por server).</td></tr>
                        <tr><td>wallbreaker signature</td><td>Vuelve a mostrar la firma HEX capturada.</td></tr>
                        <tr><td>wallbreaker table</td><td>Muestra la tabla de conversión HEX → ASCII.</td></tr>
                        <tr><td>wallbreaker break [v]</td><td>Rompe el firewall usando la versión correcta · ej: <code>wallbreaker break 2.4</code></td></tr>
                        <tr><td>wallbreaker status</td><td>Muestra el estado actual del firewall.</td></tr>
                        <tr><td>wallbreaker close</td><td>Cierra la app y libera la RAM.</td></tr>
                    </table>

                    <div style="color:#ffaa44; font-weight:bold; font-size:0.75rem; letter-spacing:2px;
                                border-bottom:1px dashed rgba(255,170,68,0.35); padding-bottom:6px; margin:20px 0 10px 0;">
                        [ CÓMO SE USA ]
                    </div>

                    <div style="color:#aab8c5; font-size:0.82rem; line-height:1.8; padding:0 4px;">
                        <b style="color:#ffcc44;">1.</b> Conectate al server y corré <code>probe</code>. Si tiene firewall, los puertos estarán enmascarados.<br>
                        <b style="color:#ffcc44;">2.</b> Abrí la app con <code>wallbreaker</code>.<br>
                        <b style="color:#ffcc44;">3.</b> Corré <code>wallbreaker analyze</code>. Vas a ver una animación y, al terminar, la firma HEX.<br>
                        <b style="color:#ffcc44;">4.</b> Traducí la firma con <code>wallbreaker table</code> para encontrar el número de versión (ej: <b style="color:#33ff33;">V2.4</b>).<br>
                        <b style="color:#ffcc44;">5.</b> Rompé el firewall con <code>wallbreaker break 2.4</code> (usá el número que hayas encontrado).<br>
                        <b style="color:#ffcc44;">6.</b> Listo: el firewall queda caído y ya podés usar <code>probe</code> normalmente.
                    </div>

                    <div style="color:#ffaa44; font-weight:bold; font-size:0.75rem; letter-spacing:2px;
                                border-bottom:1px dashed rgba(255,170,68,0.35); padding-bottom:6px; margin:20px 0 10px 0;">
                        [ ¿QUÉ ES HEX? ]
                    </div>

                    <div style="color:#aab8c5; font-size:0.82rem; line-height:1.7; padding:0 4px 12px 4px;">
                        Cada carácter de un texto tiene un <b style="color:#ffcc44;">número</b> interno (del <b>0</b> al <b>255</b>).
                        Ese número se puede escribir en <b style="color:#ffcc44;">HEXADECIMAL</b> (base 16) usando
                        <b style="color:#ffcc44;">dos dígitos</b> del <b style="color:#ffcc44;">00</b> al <b style="color:#ffcc44;">FF</b>.
                        El prefijo <b style="color:#ffcc44;">0x</b> solo significa <i>"lo que sigue está en hexadecimal"</i>.
                        Por ejemplo, <b style="color:#ffcc44;">0x41</b> es el número 65, y 65 es la letra <b style="color:#ffcc44;">'A'</b>.
                    </div>

                    <div style="color:#aab8c5; font-size:0.82rem; line-height:1.7; padding:0 4px;">
                        <b style="color:#ffaa44;">¿Cómo se lee la tabla?</b><br>
                        &nbsp;· El <b style="color:#ffcc44;">primer dígito</b> de un byte indica la <b>fila</b>.<br>
                        &nbsp;· El <b style="color:#ffcc44;">segundo dígito</b> indica la <b>columna</b>.<br>
                        &nbsp;· Ejemplo: <b style="color:#ffcc44;">0x56</b> → fila <b>5</b>, columna <b>6</b> → <b style="color:#ffcc44;">'V'</b>.
                    </div>

                    <div style="color:#aab8c5; font-size:0.82rem; line-height:1.8; padding:14px 4px 0 4px;
                                border-top:1px dashed rgba(255,170,68,0.35); margin-top:14px;">
                        <b style="color:#ffaa44;">Ejemplo real de firma:</b><br>
                        El firewall te devuelve algo así:<br>
                        <span style="color:#ffcc44; font-family:Consolas,monospace; letter-spacing:2px;">
                            41 46 5F 56 32 2E 34 4B 4C
                        </span><br>
                        Traducido usando la tabla (<code>wallbreaker table</code>):<br>
                        <span style="font-family:Consolas,monospace;">
                            0x41='A' &nbsp; 0x46='F' &nbsp; 0x5F='_' &nbsp;
                            0x56='V' &nbsp; 0x32='2' &nbsp; 0x2E='.' &nbsp;
                            0x34='4' &nbsp; 0x4B='K' &nbsp; 0x4C='L'
                        </span><br>
                        Texto: <b style="color:#33ff33;">AF_V2.4KL</b> → la versión es <b style="color:#33ff33;">V2.4</b>.
                    </div>

                    <div style="text-align:center; color:#668866; font-size:0.75rem; margin-top:16px;
                                padding-top:12px; border-top:1px dashed rgba(255,170,68,0.35);">
                        Cada server permite un máximo de <b style="color:#ffcc44;">2 análisis</b>. Si te pasás, se dispara el rastreo.
                    </div>

                </div>`;
                break;
            }
                                    if (wbSub === 'table') {
                output.innerHTML += `<div class="msg-box" style="border-color:#33ccff; padding:14px 20px;">

                    <div style="color:#33ccff; font-weight:bold; font-size:0.75rem; letter-spacing:2px;
                                border-bottom:1px dashed rgba(51,204,255,0.35); padding-bottom:6px; margin-bottom:10px;">
                        TABLA HEX → ASCII
                    </div>

                    <pre style="font-family:Consolas,monospace; color:#33ccff; font-size:0.82rem; line-height:1.7; margin:0; padding:0 4px;">
       0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F
  2    ·  !  "  #  $  %  &amp;  '  (  )  *  +  ,  -  .  /
  3    0  1  2  3  4  5  6  7  8  9  :  ;  &lt;  =  &gt;  ?
  4    @  A  B  C  D  E  F  G  H  I  J  K  L  M  N  O
  5    P  Q  R  S  T  U  V  W  X  Y  Z  [  \\  ]  ^  _
  6    \`  a  b  c  d  e  f  g  h  i  j  k  l  m  n  o
  7    p  q  r  s  t  u  v  w  x  y  z  {  |  }  ~
</pre>

                    <div style="color:#668866; font-size:0.75rem; margin-top:10px; padding-top:8px;
                                border-top:1px dashed rgba(51,204,255,0.35); line-height:1.6;">
                        Primer dígito = fila · Segundo dígito = columna · Ej: <b style="color:#33ccff;">0x56</b> → 'V'
                        <br>Para la explicación completa, usá <code style="color:#ffcc00;">wallbreaker help</code>.
                    </div>

                </div>`;
                break;
            }
            if (wbSub === 'signature' || wbSub === 'sig') {
                if (!wbFw || !wbFw.hasFirewall) { output.innerHTML += `<span class="text-muted">Sin firewall.</span><br>`; break; }
                showWallbreakerSignature();
                break;
            }
            if (wbSub === 'status') {
                if (!wbFw || !wbFw.hasFirewall) { output.innerHTML += `<span class="text-muted">Sin firewall.</span><br>`; break; }
                output.innerHTML += `<div class="msg-box"><div class="text-info" style="margin-bottom:6px;">FIREWALL — STATUS</div>
                    <div><span class="text-muted">Estado:</span> ${wbFw.active ? '<span class="text-error">ACTIVO</span>' : '<span class="text-success">CAÍDO</span>'}</div>
                    <div><span class="text-muted">Analizado:</span> ${wbFw.analyzed ? '<span class="text-success">SÍ</span>' : 'NO'}</div>
                    <div><span class="text-muted">Intentos:</span> ${wbFw.analyzeUses}/${FIREWALL_MAX_ANALYZE_USES}</div>
                </div>`;
                break;
            }
            if (wbSub === 'analyze') { startWallbreakerAnalyze(); break; }
            if (wbSub === 'break') {
                const vArg = args[2];
                if (vArg === undefined) { output.innerHTML += `<span class="text-error">Uso: wallbreaker break [v]</span><br>`; break; }
                const vNum = parseFloat(vArg);
                if (isNaN(vNum)) { output.innerHTML += `<span class="text-error">Versión inválida.</span><br>`; break; }
                startWallbreakerBreak(vNum);
                break;
            }
            if (wbSub === 'close') { closeWallbreakerApp(); break; }
            output.innerHTML += `<span class="text-error">Subcomando desconocido.</span><br>`;
            break;
        }

        case 'porthack': {
            if (!gameState.isConnected || !gameState.currentServer) { output.innerHTML += `<span class="text-error">No conectado.</span><br>`; break; }
            const srv = gameState.currentServer;
            if (srv.accessed) { output.innerHTML += `<span class="text-warning">Ya tenés acceso.</span><br>`; break; }
            if (srv.firewall && srv.firewall.active) { output.innerHTML += `<span class="text-error">[✗] Firewall activo.</span><br>`; break; }
            if (args.length < 2) { output.innerHTML += `<span class="text-error">Uso: porthack [puertos]</span><br>`; break; }
            const requested = [];
            const seen = new Set();
            let parseError = null;
            for (let i = 1; i < args.length; i++) {
                const p = parseInt(args[i]);
                if (isNaN(p) || p <= 0 || p > 65535) { parseError = `Puerto inválido: "${args[i]}"`; break; }
                if (seen.has(p)) { parseError = `Duplicado: ${p}`; break; }
                seen.add(p); requested.push(p);
            }
            if (parseError) { output.innerHTML += `<span class="text-error">${parseError}</span><br>`; break; }
            const portsByNum = {};
            srv.ports.forEach(p => { portsByNum[p.port] = p; });
            let notFound = null;
            for (const p of requested) { if (!portsByNum[p]) { notFound = p; break; } }
            if (notFound !== null) { output.innerHTML += `<span class="text-error">Puerto ${notFound} no existe.</span><br>`; break; }
            let notOpen = null;
            for (const p of requested) { if (portsByNum[p].state !== 'open') { notOpen = p; break; } }
            if (notOpen !== null) { output.innerHTML += `<span class="text-error">Puerto ${notOpen} no abierto.</span><br>`; break; }
            const openPorts = srv.ports.filter(p => p.state === 'open').map(p => p.port);
            const missingOpen = openPorts.filter(p => !seen.has(p));
            if (missingOpen.length > 0) { output.innerHTML += `<span class="text-error">Faltan puertos.</span><br>`; break; }
            if (openPorts.length < srv.reqPorts) { output.innerHTML += `<span class="text-error">Puertos insuficientes.</span><br>`; break; }
            const result = launchPortHack(requested);
            if (!result.ok) {
                if (result.reason === 'low_ram') output.innerHTML += `<span class="text-error">RAM insuficiente.</span><br>`;
                else output.innerHTML += `<span class="text-error">No se pudo iniciar porthack.</span><br>`;
                break;
            }
            const _server = srv, _tier = srv.tier, _hasTrace = srv.hasTrace, _dur = result.duration, _ip = srv.ip;
            setTimeout(() => {
    if (gameState.currentServer === _server && _server.accessed) {
        autoAdvanceMissionsOnEvent({ type: 'hack', tier: _tier, serverIP: _ip });
        if (!_hasTrace) autoAdvanceMissionsOnEvent({ type: 'stealth_hack', tier: _tier, serverIP: _ip });
        if (_server._traceTriggered && !_server.traceLogPath) autoAdvanceMissionsOnEvent({ type: 'ghost_hack', tier: _tier, serverIP: _ip });
        // NUEVO: noticia
        if (typeof newsOnServerHacked === 'function' && !_server.isProbeServer && !_server.isLastChanceServer) {
            newsOnServerHacked(_server);
        }
    }
}, _dur + 1000);
            break;
        }

        case 'login':
            if (!gameState.isConnected) { output.innerHTML += `<span class="text-error">No conectado.</span><br>`; break; }
            if (gameState.isAuthenticated) { output.innerHTML += `<span class="text-warning">Ya autenticado.</span><br>`; break; }
            if (!args[1] || !args[2]) { output.innerHTML += `<span class="text-error">Uso: login [u] [p]</span><br>`; break; }
            const cred = gameState.currentServer.credentials;
            if (args[1] === cred.user && args[2] === cred.pass) {
                gameState.isAuthenticated = true;
                gameState.currentServer.savedCredentials = { user: cred.user, pass: cred.pass };
                output.innerHTML += `<div class="msg-box"><span class="text-success">[✓] Autenticado: ${cred.user}@${gameState.currentIP}.</span></div>`;
                updateUI();
                saveGame();
            } else {
                output.innerHTML += `<div class="msg-box"><span class="text-error">[✗] Credenciales incorrectas.</span></div>`;
            }
            break;

        case 'tools': {
            let tc = `<div class="msg-box"><div class="text-success" style="margin-bottom:6px;">Herramientas en /bin:</div>`;
            if (gameState.tools.length === 0) tc += `<div class="text-warning">Vacío.</div>`;
            else gameState.tools.forEach(tool => {
                const isRunning = gameState.runningProcesses.some(p => p.toolName === tool.name && p.status !== 'failed');
                const st = isRunning ? ' <span class="text-success">[ACTIVO]</span>' : '';
                tc += `<div><span class="text-warning">${tool.name} v${tool.v.toFixed(1)}</span> <span class="text-info">(${tool.ram} GB)</span>${st}</div>`;
            });
            tc += `</div>`;
            output.innerHTML += tc;
            break;
        }

        case 'ps': {
            let psContent = `<div class="msg-box"><div class="text-success" style="margin-bottom:6px;">Procesos (RAM ${gameState.ram.toFixed(1)}/${gameState.maxRam.toFixed(1)} GB):</div>`;
            if (gameState.runningProcesses.length === 0) psContent += `<div class="text-muted">(sin procesos)</div>`;
            else gameState.runningProcesses.forEach(p => {
                const st = p.status === 'active' ? '<span class="text-success">[OK]</span>' : (p.status === 'failed' ? '<span class="text-error">[FALLÓ]</span>' : '<span class="text-warning">[..]</span>');
                const stall = p.isStalled ? ' <span class="text-warning">[STALLED]</span>' : '';
                psContent += `<div><span class="text-info">${p.toolName}</span> ${p.portNum ? `<span class="text-warning">→ :${p.portNum}</span>` : ''} <span class="text-muted">(${p.ram.toFixed(2)} GB)</span> ${st}${stall}</div>`;
            });
            psContent += `</div>`;
            output.innerHTML += psContent;
            break;
        }

        // ============================================================
        // SCAN [IP]
        // ============================================================
                    case 'scan': {
            if (args[1]) {
                const targetIP = args[1];
                const server = gameState.servers.find(s => s.ip === targetIP);
                if (!server) {
                    output.innerHTML += `<span class="text-error">[✗] No hay nada en ${targetIP}. IP desconocida.</span><br>`;
                    output.scrollTop = output.scrollHeight;
                    break;
                }
                if (server.discovered) {
                    output.innerHTML += `<span class="text-warning">[i] ${targetIP} ya está descubierta.</span><br>`;
                    output.scrollTop = output.scrollHeight;
                    break;
                }
                server.discovered = true;

                // FIX: un solo += con el HTML completo
                let html = '<div class="msg-box">';
                html += `<div class="text-success" style="font-weight:bold;">[✓] Objetivo revelado: ${targetIP}</div>`;
                html += '<div class="text-muted">El servidor ahora aparece en tu NetMap.</div>';
                html += '</div>';
                output.innerHTML += html;

                if (!gameState.netmapOpen) {
                    if (gameState.ram + 0.5 <= gameState.maxRam) {
                        gameState.netmapOpen = true;
                        gameState.netmapCamX = 0;
                        gameState.netmapCamY = 0;
                        netmapZoom = 1;
                        startNetmapAnim();
                        output.innerHTML += `<span class="text-info">[i] NetMap abierto automáticamente.</span><br>`;
                    } else {
                        output.innerHTML += `<span class="text-warning">[!] RAM insuficiente para abrir NetMap.</span><br>`;
                    }
                }
                soundSonarPing();
                updateUI();
                saveGame();
                output.scrollTop = output.scrollHeight;
                break;
            }
            startScan();
            break;
        }
	case 'unlock': {
            if (!gameState.isConnected || !gameState.currentServer || !gameState.currentServer.isProbeServer) {
                output.innerHTML += `<span class="text-error">unlock: comando no disponible en este servidor.</span><br>`;
                break;
            }
            if (gameState.probeUnlocked) {
                output.innerHTML += `<span class="text-warning">[i] Ya desbloqueaste el modo pruebas.</span><br>`;
                break;
            }
            if (args.length < 2) {
                output.innerHTML += `<span class="text-warning">Uso: unlock [código]</span><br>`;
                break;
            }
            const code = args.slice(1).join(' ');
            if (code === PROBE_SECRET_CODE) {
                gameState.probeUnlocked = true;
                unlockAllToolsForProbe();
                soundSuccess();
            } else {
                output.innerHTML += `<div class="msg-box"><span class="text-error">[✗] Código incorrecto.</span></div>`;
                soundError();
            }
            break;
        }
        case 'connect': {
            if (!args[1]) { output.innerHTML += `<span class="text-error">Especificá IP o dirección.</span><br>`; break; }
            const target = args[1].toLowerCase();
	    if (target === 'news.com' || target === 'news') {
    		output.innerHTML += `<span class="text-info">[~] Conectando a news.com...</span><br>`;
    		setTimeout(() => openNewsWeb(), 250);
    		saveGame();
   		 break;
		}
            if (target === 'hacknet.onion' || target === 'hacknet' || target === 'hn') {
                output.innerHTML += `<span class="text-gold">[~] Conectando a HackNet.onion...</span><br>`;
                output.innerHTML += `<span class="text-muted">[~] Túnel cifrado establecido.</span><br><br>`;
                setTimeout(() => openHacknetForm(), 250);
                saveGame();
                break;
            }
            if (target === 'gomail.com' || target === 'gomail') {
                output.innerHTML += `<span class="text-info">[~] Conectando a gomail.com...</span><br>`;
                setTimeout(() => openGomailForm(), 250);
                saveGame();
                break;
            }
            if (target === 'market.onion' || target === 'infomarket' || target === 'market') {
                output.innerHTML += `<span class="text-gold">Abriendo market.onion...</span><br>`;
                setTimeout(() => openMarketForm(), 250);
                saveGame();
                break;
            }
            let server;
            if (target === 'probe.com' || target === 'probe' || target === 'probe-server') {
                server = gameState.servers.find(s => s.isProbeServer);
            } else {
                server = gameState.servers.find(s => s.ip === args[1]);
            }
            if (!server) { output.innerHTML += `<span class="text-error">IP no encontrada.</span><br>`; break; }
            if (!server.discovered && !server.isProbeServer) { output.innerHTML += `<span class="text-error">IP desconocida. Escaneala primero con 'scan ${args[1]}'.</span><br>`; break; }
            gameState.inMarket = false;
            gameState.isConnected = true;
            gameState.isAuthenticated = false;
            gameState.currentIP = server.ip;
            gameState.currentServer = server;
            remoteFS = server.fs;
            remoteCWD = server.primaryDir || '/home/user';
            server.downloadsDuringSession = 0;
            server._traceTriggered = false;
            if (server.hasTrace && server.traceLogPath && server.fs[server.traceLogPath]) {
                const mins = Math.floor(server.traceDuration / 60), secs = server.traceDuration % 60;
                const timeStr = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
                output.innerHTML += `<div class="msg-box"><span class="text-error">[!] Rastreo activo (${timeStr}).</span></div>`;
                startTrace(server.traceDuration);
            }
            openConnectOverlay(server);
            updateUI();
            saveGame();
            break;
        }

        case 'probe': {
            if (!gameState.isConnected) { output.innerHTML += `<span class="text-error">No conectado.</span><br>`; break; }
            if (gameState.currentServer.firewall && gameState.currentServer.firewall.active) {
                output.innerHTML += `<div class="msg-box warn">
                    <div style="color:#ff8833; font-weight:bold;">[!] FIREWALL ACTIVO — puertos enmascarados.</div>
                </div>`;
                break;
            }
            if (gameState.currentServer.hasTrace && !gameState.currentServer.traceLogPath) {
                createTraceLog(gameState.currentServer);
                const mins = Math.floor(gameState.currentServer.traceDuration / 60);
                const secs = gameState.currentServer.traceDuration % 60;
                const timeStr = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
                output.innerHTML += `<div class="msg-box"><span class="text-error">[!] Rastreo iniciado (${timeStr}).</span></div>`;
                startTrace(gameState.currentServer.traceDuration);
                saveGame();
            }
            let pc = `<div class="msg-box"><div class="text-success" style="margin-bottom:6px;">Puertos de ${gameState.currentIP}:</div>`;
		gameState.currentServer.ports.forEach(p => {
                const cc = p.state === 'blocked' ? 'text-error' : 'text-success';
                const st = p.state === 'blocked' ? 'BLOQUEADO' : 'ABIERTO';
                pc += `<div><span class="text-sys">Puerto ${p.port} ${p.name} v${p.v} — </span><span class="${cc}">${st}</span></div>`;
            });
            const oc = gameState.currentServer.ports.filter(p => p.state === 'open').length;
            pc += `<div class="text-warning" style="margin-top:6px;">Abiertos: ${oc}/${gameState.currentServer.reqPorts}</div></div>`;
            output.innerHTML += pc;
            break;
        }

        case 'run': {
    if (!args[1]) { output.innerHTML += `<span class="text-error">Uso: run [exe] [puerto?]</span><br>`; break; }

    // HELP.exe es una app especial: se busca en el FS local.
    // Si existe, abre el tutorial interactivo. Si no, error.
    if (args[1].toLowerCase() === 'help.exe') {
        const helpPath = '/home/user/documentos/HELP.exe';
        if (localFS[helpPath] && localFS[helpPath].isHelpExe) {
            if (typeof InteractiveTutorialStart === 'function') {
                InteractiveTutorialStart();
            }
        } else {
            output.innerHTML += `<span class="text-error">run: HELP.exe no encontrado (¿lo borraste?).</span><br>`;
        }
        break;
    }

    const toolName = args[1];
    const template = TOOL_TEMPLATES[toolName];
    if (!template) { output.innerHTML += `<span class="text-error">'${toolName}' no es válido.</span><br>`; break; }
    if (template.isApp) { output.innerHTML += `<span class="text-warning">'${toolName}' es una app.</span><br>`; break; }

    let tool = gameState.tools.find(t => t.name === toolName);
    const ownsTool = !!tool && localFS['/bin'].children.includes(toolName);
    let portObj = null;
    let portNum = null;

    if (args[2]) {
        portNum = parseInt(args[2]);
        if (isNaN(portNum) || portNum <= 0 || portNum > 65535) {
            output.innerHTML += `<span class="text-error">Puerto inválido.</span><br>`;
            break;
        }
        if (!ownsTool) {
            // No tiene la tool: modo test (corre a velocidad de prueba, sin objetivo)
            tool = { name: toolName, v: 1.0, ram: template.ram, service: template.service };
            portNum = null;
        } else if (gameState.isConnected && gameState.currentServer) {
            const foundPort = gameState.currentServer.ports.find(p => p.port === portNum);
            if (!foundPort) {
                portNum = null;
            } else if (foundPort.service !== tool.service) {
                output.innerHTML += `<span class="text-error">Servicio incorrecto.</span><br>`;
                break;
            } else if (foundPort.state === 'open') {
                output.innerHTML += `<span class="text-warning">Puerto ya abierto.</span><br>`;
                break;
            } else {
                portObj = foundPort;
            }
        } else {
            portNum = null;
        }
    } else {
        if (!ownsTool) {
            output.innerHTML += `<span class="text-error">'${toolName}' no en /bin.</span><br>`;
            break;
        }
    }

    launchTool(tool, portObj, portNum);
    break;
}

        case 'ls': {
            const fsLs = getCurrentFS(), cwdLs = getCurrentCWD();
            let lsContent = `<div class="msg-box">`;
            if (fsLs[cwdLs] && fsLs[cwdLs].children) {
                if (fsLs[cwdLs].children.length === 0) lsContent += `<div class="text-muted">(vacío)</div>`;
                else fsLs[cwdLs].children.forEach(childName => {
                    const childPath = cwdLs === '/' ? '/' + childName : cwdLs + '/' + childName;
                    const child = fsLs[childPath];
                    if (child && child.type === 'file') {
                        const cc = child.isExecutable ? 'text-warning' : (child.isTraceLog ? 'text-error' : (child.isProtectedZip ? 'text-fire' : 'text-info'));
                        let extra = '';
                        if (child.isExecutable && child.version !== undefined) extra = ` <span class="text-success">v${child.version.toFixed(1)}</span>`;
                        if (child.isProtectedZip) extra = ` <span class="text-error">[PROTEGIDO]</span>`;
                        lsContent += `<div><span class="${cc}">${childName}</span> <span class="text-muted">(${formatSize(child.size || 0)})</span>${extra}</div>`;
                    } else lsContent += `<div><span class="text-warning">${childName}/</span></div>`;
                });
            }
            lsContent += `</div>`;
            output.innerHTML += lsContent;
            break;
        }

        case 'cd': {
            if (!args[1] || args[1] === '~') { setCurrentCWD('/home/user'); updateUI(); break; }
            const fsCd = getCurrentFS(), cwdCd = getCurrentCWD();
            let targetDir = args[1];
            if (targetDir === '..') targetDir = cwdCd.substring(0, cwdCd.lastIndexOf('/')) || '/';
            else if (targetDir === '.') targetDir = cwdCd;
            else if (!targetDir.startsWith('/')) targetDir = cwdCd === '/' ? '/' + targetDir : cwdCd + '/' + targetDir;
            if (targetDir.length > 1 && targetDir.endsWith('/')) targetDir = targetDir.slice(0, -1);
            if (fsCd[targetDir] && fsCd[targetDir].type === 'dir') setCurrentCWD(targetDir);
            else output.innerHTML += `<span class="text-error">cd: no existe: ${args[1]}</span><br>`;
            updateUI();
            break;
        }

        case 'cat': {
            if (!args[1]) { output.innerHTML += `<span class="text-error">Especificá archivo.</span><br>`; break; }
            const filePathCat = resolvePath(args[1], getCurrentCWD());
            const fsCat = getCurrentFS();
            if (fsCat[filePathCat] && fsCat[filePathCat].type === 'file') {
                const file = fsCat[filePathCat];
                const fileName = filePathCat.substring(filePathCat.lastIndexOf('/') + 1);
                if (file.isProtectedZip) {
                    output.innerHTML += `<div class="msg-box"><span class="text-muted">[${formatSize(file.size || 0)}]</span> <span class="text-fire">[zip protegido]</span><br><span class="text-warning">Requiere contraseña.</span></div>`;
                } else if (isBinaryFile(fileName)) {
                    const preview = generateBinaryPreview(fileName, file.size || 1);
                    output.innerHTML += `<div class="msg-box"><span class="text-muted">[${formatSize(file.size || 0)}]</span> <span class="text-warning">[binario]</span><br><pre style="color:#33ff33; font-size:0.72rem; margin:4px 0 0 0;">${preview}</pre></div>`;
                } else {
                    const cc = file.isTraceLog ? 'text-error' : 'text-sys';
                    output.innerHTML += `<div class="msg-box"><span class="text-muted">[${formatSize(file.size || 0)}]</span><br><span class="${cc}">${file.content || ''}</span></div>`;
                }
            } else output.innerHTML += `<span class="text-error">cat: no existe: ${args[1]}</span><br>`;
            break;
        }

                case 'rm': {
            if (!args[1]) { output.innerHTML += `<span class="text-error">Especificá archivo o *</span><br>`; break; }

            // HELP.exe: es un archivo especial. Borrarlo termina el tutorial.
            const rmLower = args[1].toLowerCase();
            if (rmLower === 'help.exe' || rmLower.endsWith('/help.exe')) {
                const helpPathRm = resolvePath(args[1], getCurrentCWD());
                if (localFS[helpPathRm] && localFS[helpPathRm].isHelpExe) {
                    // Borrar del FS
                    delete localFS[helpPathRm];
                    const helpParent = helpPathRm.substring(0, helpPathRm.lastIndexOf('/')) || '/';
                    if (localFS[helpParent]) {
                        localFS[helpParent].children = localFS[helpParent].children.filter(c => c !== 'HELP.exe');
                    }
                    output.innerHTML += `<span class="text-success">✓ HELP.exe eliminado</span><br>`;

                    // Detener el tutorial definitivamente
                    if (typeof InteractiveTutorialStop === 'function') {
                        InteractiveTutorialStop('complete');
                    }

                    // Mensaje final
                    output.innerHTML += `<div class="msg-box" style="border-color:#33ff33; margin-top:8px;">
                        <div style="color:#33ff33; font-weight:bold;">[✓] TUTORIAL COMPLETADO</div>
                        <div class="text-muted" style="margin-top:6px;">Ya sabés lo básico. Podés consultar el manual completo desde el botón MANUAL (o F1) cuando quieras.</div>
                    </div>`;
                    output.scrollTop = output.scrollHeight;
                    saveGame();
                    break;
                } else {
                    output.innerHTML += `<span class="text-error">rm: HELP.exe no existe en esta carpeta.</span><br>`;
                    break;
                }
            }

            // --- resto normal del rm ---
            const fsRm = getCurrentFS(), cwdRm = getCurrentCWD();
            if (!gameState.isConnected) {
                const testPath = args[1] === '*' ? cwdRm : resolvePath(args[1], cwdRm);
                if (testPath === '/bin' || testPath.startsWith('/bin/')) {
                    output.innerHTML += `<span class="text-error">rm: /bin protegido.</span><br>`; break;
                }
            }
            if (args[1] === '*') {
                const children = fsRm[cwdRm].children;
                if (children.length === 0) { output.innerHTML += `<span class="text-warning">Nada que borrar.</span><br>`; break; }
                const filesToDelete = children.map(childName => {
                    const path = cwdRm === '/' ? '/' + childName : cwdRm + '/' + childName;
                    const file = fsRm[path];
                    return { name: childName, path, size: file ? (file.size || 1) : 1, isTraceLog: file ? (file.isTraceLog || false) : false, isRemote: gameState.isConnected };
                });
                deleteFilesSequentially(filesToDelete);
            } else {
                const filePathRm = resolvePath(args[1], cwdRm);
                if (fsRm[filePathRm] && fsRm[filePathRm].type === 'file') {
                    const fileName = filePathRm.substring(filePathRm.lastIndexOf('/') + 1);
                    const file = fsRm[filePathRm];
                    deleteFilesSequentially([{ name: fileName, path: filePathRm, size: file.size || 1, isTraceLog: file.isTraceLog || false, isRemote: gameState.isConnected }]);
                } else output.innerHTML += `<span class="text-error">rm: no existe: ${args[1]}</span><br>`;
            }
            break;
        }

        case 'cp': case 'mv': {
            if (!args[1] || !args[2]) { output.innerHTML += `<span class="text-error">Uso: ${action} [origen] [destino]</span><br>`; break; }
            const fsCp = getCurrentFS(), cwdCp = getCurrentCWD();
            const srcPath = resolvePath(args[1], cwdCp), destPath = resolvePath(args[2], cwdCp);
            if (fsCp[srcPath] && fsCp[srcPath].type === 'file') {
                const fileName = srcPath.substring(srcPath.lastIndexOf('/') + 1);
                let finalDestPath = destPath;
                if (fsCp[destPath] && fsCp[destPath].type === 'dir') finalDestPath = destPath === '/' ? '/' + fileName : destPath + '/' + fileName;
                fsCp[finalDestPath] = { ...fsCp[srcPath] };
                if (action === 'mv') {
                    delete fsCp[srcPath];
                    const parentDir = srcPath.substring(0, srcPath.lastIndexOf('/')) || '/';
                    fsCp[parentDir].children = fsCp[parentDir].children.filter(c => c !== fileName);
                }
                const destParent = finalDestPath.substring(0, finalDestPath.lastIndexOf('/')) || '/';
                if (fsCp[destParent] && !fsCp[destParent].children.includes(fileName)) fsCp[destParent].children.push(fileName);
                output.innerHTML += `<span class="text-success">${action === 'mv' ? 'Movido' : 'Copiado'}: ${fileName}</span><br>`;
            } else output.innerHTML += `<span class="text-error">${action}: no encontrado</span><br>`;
            break;
        }

                case 'unzip': {
            if (!args[1]) { output.innerHTML += `<span class="text-error">Uso: unzip [archivo] [contraseña?]</span><br>`; break; }
            const zipPath = resolvePath(args[1], getCurrentCWD());
            const fs = getCurrentFS();
            const zipFile = fs[zipPath];
            if (!zipFile || zipFile.type !== 'file') { output.innerHTML += `<span class="text-error">unzip: no existe: ${args[1]}</span><br>`; break; }
            if (!zipFile.isProtectedZip) { output.innerHTML += `<span class="text-error">unzip: no es zip protegido.</span><br>`; break; }
            const pw = args[2];
            if (pw === undefined) { output.innerHTML += `<span class="text-warning">Extrayendo ${args[1]}... ✗ El archivo está protegido.</span><br>`; break; }
            if (pw !== zipFile.zipPassword) { output.innerHTML += `<span class="text-error">✗ Contraseña incorrecta.</span><br>`; break; }
            if (gameState.runningProcesses.some(p => p.isUnzip && p.zipPath === zipPath && p.sourceServerIP === (gameState.currentIP || 'local'))) { output.innerHTML += `<span class="text-warning">Ya hay una descompresión en curso.</span><br>`; break; }
            gameState.ram = calculateRamUsage();
            const sizeKB = zipFile.size || 1;
            const ramCost = getUnzipRAM(sizeKB);
            if (gameState.ram + ramCost > gameState.maxRam) { output.innerHTML += `<span class="text-error">RAM insuficiente.</span><br>`; break; }
            const zipDirPath = zipPath.substring(0, zipPath.lastIndexOf('/')) || '/';
            const zipName = zipPath.substring(zipPath.lastIndexOf('/') + 1);
            const extractDirName = zipName.replace(/\.zip$/i, '') + '_extracted';
            const extractDirPath = zipDirPath === '/' ? '/' + extractDirName : zipDirPath + '/' + extractDirName;
            const zipContents = zipFile.zipContents || [];
            const durationMs = getUnzipDuration(sizeKB, zipContents.length);
            const sourceServerIdentity = gameState.currentServer
                ? getServerIdentity(gameState.currentServer)
                : (zipFile.sourceServerIdentity || null);
            const proc = {
                id: 'unz_' + Date.now() + Math.floor(Math.random() * 1000),
                toolName: 'unzip', isUnzip: true, status: 'hacking', progress: 0, ram: ramCost,
                serverIP: gameState.currentIP || 'local',
                sourceServerIP: gameState.currentIP || zipFile.sourceServerIP || 'local',
                sourceServerIdentity: sourceServerIdentity,
                isRemote: gameState.isConnected,
                zipPath, zipName, zipPassword: pw, zipContents,
                extractDirPath, extractDirName, extractDirParent: zipDirPath,
                extractedCount: 0, totalFiles: zipContents.length,
                fileName: zipName, fileSizeKB: sizeKB, durationMs,
                isDuplicateDownload: !!zipFile.isDuplicateDownload,
                animatedElapsed: 0, startedAt: Date.now(), resultMessage: ''
            };
            gameState.runningProcesses.push(proc);
            currentProcessPage = gameState.runningProcesses.length - 1;
            lastProcessSignature = '__force__';
            updateUI();
            output.innerHTML += `<span class="text-info">[📦] Extrayendo ${zipName} (${zipContents.length} archivos · ${ramCost.toFixed(2)} GB)</span><br>`;
            output.scrollTop = output.scrollHeight;
            launchUnzip(proc);
            break;
        }

                        case 'scp': {
            if (!gameState.isConnected) { output.innerHTML += `<span class="text-error">No conectado.</span><br>`; break; }
            if (!gameState.currentServer.accessed && !gameState.isAuthenticated) { output.innerHTML += `<span class="text-error">Sin acceso.</span><br>`; break; }
            if (!args[1]) { output.innerHTML += `<span class="text-error">Uso: scp [archivo] [dest?]</span><br>`; break; }
            const remoteFilePath = resolvePath(args[1], remoteCWD);
            const remoteFile = remoteFS[remoteFilePath];
            if (!remoteFile || remoteFile.type !== 'file') { output.innerHTML += `<span class="text-error">scp: no existe.</span><br>`; break; }
            const fileName = remoteFilePath.substring(remoteFilePath.lastIndexOf('/') + 1);
            const isExe = fileName.endsWith('.exe') && remoteFile.isExecutable;
            let localDirPath;
            if (args[2]) localDirPath = resolvePath(args[2], localCWD);
            else localDirPath = isExe ? '/bin' : '/download';
            if (!localFS[localDirPath] || localFS[localDirPath].type !== 'dir') { output.innerHTML += `<span class="text-error">scp: dir local no existe.</span><br>`; break; }
            if (isExe) {
                const newVersion = remoteFile.version || 1.0;
                const existingTool = gameState.tools.find(t => t.name === fileName);
                if (existingTool && existingTool.v >= newVersion) { output.innerHTML += `<div class="msg-box"><span class="text-warning">⚠ Ya tenés ${fileName} v${existingTool.v.toFixed(1)}.</span></div>`; break; }
            }
            if (gameState.runningProcesses.some(p => p.isDownload && p.sourcePath === remoteFilePath && p.sourceServerIP === gameState.currentIP)) { output.innerHTML += `<span class="text-warning">Ya hay descarga en curso.</span><br>`; break; }
            gameState.ram = calculateRamUsage();
            const sizeKB = remoteFile.size || 1;
            const ramCost = getDownloadRAM(sizeKB);
            if (gameState.ram + ramCost > gameState.maxRam) { output.innerHTML += `<span class="text-error">RAM insuficiente.</span><br>`; break; }

            // ==== NOMBRE FINAL ====
            const reservedNames = gameState.runningProcesses.filter(p => p.isDownload && p.destDirPath === localDirPath).map(p => p.fileName);
            let finalName;
            if (isExe) finalName = fileName;
            else finalName = getUniqueFileName(localFS, localDirPath, fileName, reservedNames);

            // ==== ANTI-DUPLICADOS ====
            const sourceInstanceId = gameState.currentIP + '::' + remoteFilePath;
            const alreadyDownloaded =
                !isExe &&
                Array.isArray(gameState.downloadedFileIds) &&
                gameState.downloadedFileIds.includes(sourceInstanceId);
            const isDuplicate = alreadyDownloaded;

            const durationMs = getDownloadDuration(sizeKB);
            const serverIPAtStart = gameState.currentIP;
            const serverTierAtStart = gameState.currentServer.tier;
            const sourceServerRef = gameState.currentServer;
            const sourceServerIdentity = getServerIdentity(sourceServerRef);

            const proc = {
                id: 'dl_' + Date.now() + Math.floor(Math.random() * 1000),
                toolName: 'scp', isDownload: true, status: 'hacking', progress: 0, ram: ramCost,
                serverIP: serverIPAtStart, sourceServerIP: serverIPAtStart,
                sourcePath: remoteFilePath, sourceFS: 'remote',
                destDirPath: localDirPath, destFS: 'local',
                fileName: finalName, originalFileName: fileName,
                sourceInstanceId, isDuplicate,
                sourceServerIdentity,
                fileSizeKB: sizeKB, isExe, durationMs,
                animatedElapsed: 0, startedAt: Date.now(), resultMessage: ''
            };
            gameState.runningProcesses.push(proc);
            currentProcessPage = gameState.runningProcesses.length - 1;
            lastProcessSignature = '__force__';
            updateUI();
            output.innerHTML += `<span class="text-info">[↓] Descarga: ${finalName} (${sizeKB.toFixed(1)} KB · ${ramCost.toFixed(2)} GB)</span><br>`;
            if (isDuplicate) {
                output.innerHTML += `<span class="text-warning">  ⚠ Ya bajaste este archivo de este server. El duplicado no tendrá valor de venta.</span><br>`;
            }
            output.scrollTop = output.scrollHeight;
            launchDownload(proc).then(() => {
                autoAdvanceMissionsOnEvent({ type: 'download', fileName, tier: serverTierAtStart, serverIP: serverIPAtStart });
                const sourceFile = remoteFS ? remoteFS[remoteFilePath] : null;
                const cat = sourceFile && sourceFile.category ? sourceFile.category : null;
                if (typeof newsOnFinancialLeak === 'function' && cat === 'financiero') {
                    newsOnFinancialLeak(fileName, sourceServerRef);
                } else if (typeof newsOnPersonalLeak === 'function' && cat === 'personal') {
                    newsOnPersonalLeak(fileName, sourceServerRef);
                }
            });
            break;
        }

        case 'disconnect':
            if (!gameState.isConnected && !gameState.inHacknet && !gameState.inGomail) { output.innerHTML += `<span class="text-error">No conectado.</span><br>`; break; }
            if (gameState.inHacknet) { exitHacknet(); break; }
            if (gameState.inGomail) { closeGomailWeb(); break; }
            closeWallbreakerApp(true);
            if (gameState.currentServer) resetServerAccess(gameState.currentServer);
            gameState.isConnected = false;
            gameState.isAuthenticated = false;
            gameState.currentIP = null; gameState.currentServer = null;
            remoteFS = {}; remoteCWD = '/home/user';
            killAllProcesses(); stopTrace();
            lastProcessSignature = '__force__';
            updateUI();
            saveGame();
            break;

        case 'netmap':
            if (args[1]) {
                const sub = args[1].toLowerCase();
                if (sub === 'scan') startScan();
                else if (sub === 'clear') {
                    let removed = 0, kept = 0;
                    gameState.servers.forEach(s => {
                        if (s.discovered && !s.isProbeServer && !s.fromMission) {
                            if (s.pinned) kept++;
                            else { s.discovered = false; removed++; }
                        }
                    });
                    output.innerHTML += `<span class="text-warning">NetMap: ${removed} eliminados.</span><br>`;
                } else if (sub === 'list') {
                    const discovered = gameState.servers.filter(s => s.discovered);
                    let lc = `<div class="msg-box"><div class="text-success" style="margin-bottom:6px;">Nodos (${discovered.length}):</div>`;
                    lc += `<div>&nbsp;&nbsp;<span class="text-gold">hacknet.onion</span></div>`;
                    lc += `<div>&nbsp;&nbsp;<span class="text-info">gomail.com</span></div>`;
                    lc += `<div>&nbsp;&nbsp;<span class="text-gold">market.onion</span></div>`;
                    lc += `<div>&nbsp;&nbsp;<span class="text-info">news.com</span></div>`;
                    discovered.forEach(s => {
                        const traceInfo = s.hasTrace ? '<span class="text-error">[RASTREO]</span>' : '';
                        const pinInfo = s.pinned ? ' <span class="text-gold">📌</span>' : '';
                        const probeTag = s.isProbeServer ? ' <span class="text-fire">[PRUEBAS]</span>' : '';
                        lc += `<div>&nbsp;&nbsp;<span class="text-info">${s.ip}</span> ${probeTag} ${traceInfo}${pinInfo}${s.accessed ? ' <span class="text-warning">[+]</span>' : ''}</div>`;
                    });
                    lc += `</div>`;
                    output.innerHTML += lc;
                } else if (sub === 'remove') {
                    if (!args[2]) { output.innerHTML += `<span class="text-error">Uso: netmap remove [IP]</span><br>`; break; }
                    const s = gameState.servers.find(sv => sv.ip === args[2] && sv.discovered);
                    if (s && !s.fromMission) { s.discovered = false; output.innerHTML += `<span class="text-success">Nodo eliminado.</span><br>`; }
                    else if (s && s.fromMission) output.innerHTML += `<span class="text-warning">No podés eliminar nodos de misión.</span><br>`;
                    else output.innerHTML += `<span class="text-error">No encontrado.</span><br>`;
                } else if (sub === 'pin') {
                    if (!args[2]) { output.innerHTML += `<span class="text-error">Uso: netmap pin [IP]</span><br>`; break; }
                    const s = gameState.servers.find(sv => sv.ip === args[2]);
                    if (!s || !s.discovered) { output.innerHTML += `<span class="text-error">No encontrado.</span><br>`; break; }
                    s.pinned = true;
                    output.innerHTML += `<span class="text-success">📌 fijado.</span><br>`;
                    saveGame();
                } else if (sub === 'unpin') {
                    if (!args[2]) { output.innerHTML += `<span class="text-error">Uso: netmap unpin [IP]</span><br>`; break; }
                    const s = gameState.servers.find(sv => sv.ip === args[2]);
                    if (!s) { output.innerHTML += `<span class="text-error">No encontrado.</span><br>`; break; }
                    s.pinned = false;
                    output.innerHTML += `<span class="text-success">desafijado.</span><br>`;
                    saveGame();
                } else output.innerHTML += `<span class="text-error">Subcomando desconocido.</span><br>`;
            } else toggleNetmap();
            break;

        case 'trace-speed': {
    // Solo disponible si el jugador desbloqueó el modo pruebas en probe.com
    if (!gameState.probeUnlocked) {
        output.innerHTML += `<span class="text-error">Comando no reconocido: trace-speed</span><br>`;
        break;
    }
    if (gameState.isConnected) {
        output.innerHTML += `<span class="text-error">[✗] No disponible conectado.</span><br>`;
        break;
    }
    const mult = parseInt(args[1]);
    if (isNaN(mult) || mult < 1 || mult > 50) {
        output.innerHTML += `<span class="text-warning">Uso: trace-speed [1-50]</span><br>`;
        break;
    }
    gameState.traceSpeedMult = mult;
    output.innerHTML += `<span class="text-success">[✓] Velocidad: ×${mult}</span><br>`;
    break;
}

        case 'clear': output.innerHTML = ''; break;
        case 'clearsave':
            clearSave();
            output.innerHTML += `<span class="text-warning">Partida eliminada.</span><br>`;
            break;
        case 'restart':
            clearSave();
            window.location.reload();
            break;
        default: output.innerHTML += `<span class="text-error">Comando no reconocido: ${action}</span><br>`;
    }
    output.scrollTop = output.scrollHeight;
}

function unlockAllToolsForProbe() {
    ALL_TOOL_NAMES.forEach(name => {
        const template = TOOL_TEMPLATES[name];
        if (!template) return;
        const existing = gameState.tools.find(t => t.name === name);
        if (!existing) gameState.tools.push({ name, v: 5.0, ram: template.ram, service: template.service });
        else if (existing.v < 5.0) existing.v = 5.0;
        if (!localFS['/bin'].children.includes(name)) localFS['/bin'].children.push(name);
        localFS['/bin/' + name] = makeExe(name, 5.0);
    });
    if (!gameState.wallbreakerObtained) gameState.wallbreakerObtained = true;
    if (!localFS['/bin'].children.includes('wallbreaker.exe')) localFS['/bin'].children.push('wallbreaker.exe');
    localFS['/bin/wallbreaker.exe'] = makeExe('wallbreaker.exe', 1.0);

    // FIX: un solo innerHTML += con el HTML completo
    const html = '<div class="msg-box">' +
        '<div class="text-success" style="font-weight:bold;">[✓] probe.com — MODO PRUEBAS</div>' +
        '<div class="text-fire">[★] Todas las herramientas (v5.0).</div>' +
        '<div class="text-info">Comando <span class="text-cmd">debug</span> disponible.</div>' +
        '</div>';
    output.innerHTML += html;
    output.scrollTop = output.scrollHeight;
}

function resetGame() {
    // ── Timers y audio ────────────────────────────────────────
    if (gameState.traceInterval) clearInterval(gameState.traceInterval);
    gameState.traceInterval = null;
    if (gameState.lastChanceTimer) clearInterval(gameState.lastChanceTimer);
    gameState.lastChanceTimer = null;
    if (typeof stopLastChanceEvents === 'function') stopLastChanceEvents();
    stopScannerSound();
    if (typeof stopDroneWB === 'function') stopDroneWB();
    if (typeof clearPendingNews === 'function') clearPendingNews();

    // ── Guardado ──────────────────────────────────────────────
    clearSave();
    if (typeof clearPersistedLastChance === 'function') clearPersistedLastChance();
    if (typeof clearPreTraceSnapshot === 'function') clearPreTraceSnapshot();
    if (typeof clearTraceSource === 'function') clearTraceSource();

    // ── Flags de body / overlays visuales ─────────────────────
    document.body.classList.remove(
        'quick-trace-active', 'trace-active', 'trace-critical',
        'lastchance-mode', 'shutdown-glitch',
        'ui-visible', 'ui-fade-in'
    );

    // ── Conexión / rastreo / procesos ─────────────────────────
    gameState.currentIP = null;
    gameState.currentServer = null;
    gameState.isConnected = false;
    gameState.isAuthenticated = false;
    gameState.isDeleting = false;
    gameState.isDownloading = false;
    gameState.isGameOver = false;
    gameState.quickTraceActive = false;
    gameState.traceSpeedMult = 1;
    gameState.traceTime = 0;
    gameState.scanning = false;
    gameState.runningProcesses = [];
    gameState.hackedServers = [];
    gameState.lastKnownTier = 0;
    gameState.lastChanceTimeLeft = 0;
    gameState.lastChanceServer = null;
    gameState.lastChanceTargetPath = null;

    // ── Netmap ────────────────────────────────────────────────
    gameState.netmapOpen = false;
    gameState.netmapCamX = 0;
    gameState.netmapCamY = 0;
    gameState.netmapNodes = [];
    gameState.netmapServerNodes = [];
    gameState.netmapBounds = null;
    gameState.netmapDragging = false;
    gameState.netmapDragMoved = false;

    // ── Dinero / mercado ──────────────────────────────────────
    gameState.money = 0;
    gameState.marketAccount = null;
    gameState.marketSession = false;
    gameState.inMarket = false;
    gameState.pendingReset = false;

    // ── Hardware / RAM / tools ────────────────────────────────
    gameState.ram = 0;
    gameState.maxRam = 1.2;
    gameState.ramUpgradeLevel = 0;
    gameState.hardware = {
        cpu:     { level: 0, mult: 1.0,  label: 'Base Dual-Core 2.4GHz' },
        antenna: { level: 0, range: 1.0, label: 'Antena integrada' }
    };
    gameState.tools = [
        { name: 'ssh_crack.exe', v: 1.0, ram: 1.0, service: 'SSH' },
        { name: 'sql_crack.exe', v: 1.0, ram: 0.9, service: 'SQL' },
        { name: 'http_crack.exe', v: 1.0, ram: 0.8, service: 'HTTP' }
    ];
    gameState.wallbreakerObtained = false;
    gameState.wallbreakerApp = null;

    // ── Misiones / cuentas ────────────────────────────────────
    gameState.missionAccount = null;
    gameState.gomailAccount = null;
    gameState.gomailLinked = false;
    gameState.hacknetSession = false;
    gameState.gomailSession = false;
    gameState.inHacknet = false;
    gameState.inGomail = false;
    gameState.inNews = false;
    gameState.newsOpen = false;
    gameState.missionsAvailable = [];
    gameState.missionsActive = [];
    gameState.missionsCompleted = [];
    gameState.lastMissionSpawn = 0;
    gameState.missionCounter = 0;
    gameState.gomailInbox = [];

    // ── News log ──────────────────────────────────────────────
    gameState.newsLog = [];
    gameState.newsCounter = 0;
    gameState.newsTab = 'latest';

    // ── Anti-duplicados ───────────────────────────────────────
    gameState.downloadedFileIds = [];
    gameState.usedFlavorIds = [];

    // ── Tutorial ──────────────────────────────────────────────
    gameState.tutorialOpen = false;

    // ── Progresión / debug ────────────────────────────────────
    gameState.probeUnlocked = false;
    gameState.gamePhase = 'normal';

    // ── FS / CWD / red ────────────────────────────────────────
    localFS = buildInitialLocalFS();
    remoteFS = {};
    localCWD = '/home/user';
    remoteCWD = '/home/user';
    generateNetwork();

    // ── Historial / paginación ────────────────────────────────
    commandHistory = [];
    historyIndex = -1;
    suggestions = [];
    suggestionIndex = -1;
    isSuggestionOpen = false;
    currentProcessPage = 0;
    lastProcessSignature = '__force__';

    // ── Trace ─────────────────────────────────────────────────
    stopTrace();

    // ── UI ────────────────────────────────────────────────────
    output.innerHTML = '';
    if (typeof suggestionBox !== 'undefined' && suggestionBox) suggestionBox.style.display = 'none';
    updateUI();
    input.disabled = true;

    // ── Identidad (a reescribir en el setup) ──────────────────
    gameState.setupComplete = false;
    gameState.localUser = 'user';
    gameState.localPass = '1234';

    // ── Cerrar TODOS los overlays ─────────────────────────────
    const overlaysToClose = [
        'market-form-overlay',
        'market-web-overlay',
        'hacknet-form-overlay',
        'gomail-form-overlay',
        'gomail-web-overlay',
        'news-web-overlay',
        'connect-overlay',
        'tutorial-overlay',
        'wallbreaker-section',
        'lastchance-bar',
        'white-terminal-overlay',
        'migration-overlay',
        'update-toast',
    ];
    overlaysToClose.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    // Limpiar cualquier shutdown-overlay residual
    const shutdownOv = document.getElementById('shutdown-overlay');
    if (shutdownOv) {
        shutdownOv.style.display = 'none';
        shutdownOv.innerHTML = '';
    }

    // ── Volver al boot ────────────────────────────────────────
    setTimeout(() => {
        document.body.classList.add('booting', 'ui-booting');
        showPowerAndBoot(() => startSetup());
    }, 400);
}