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
        const deleteTimeMs = Math.max(500, Math.min(fileInfo.size * 250, 5000));
        const deleteTimeSec = (deleteTimeMs / 1000).toFixed(1);
        output.innerHTML += `<span class="text-muted">→ Borrando ${fileInfo.name} (${formatSize(fileInfo.size)})... ${deleteTimeSec}s</span><br>`;
        output.scrollTop = output.scrollHeight;
        await sleep(deleteTimeMs);
        if (gameState.isGameOver) break;
        const fs = fileInfo.isRemote ? remoteFS : localFS;
        delete fs[fileInfo.path];
        const parentDir = fileInfo.path.substring(0, fileInfo.path.lastIndexOf('/')) || '/';
        if (fs[parentDir]) fs[parentDir].children = fs[parentDir].children.filter(c => c !== fileInfo.name);
        output.innerHTML += `<span class="text-success">✓ ${fileInfo.name} eliminado</span><br>`;
        // Hook: victoria de last-chance
        if (typeof checkLastChanceFileDeleted === 'function') {
            if (checkLastChanceFileDeleted(fileInfo.path)) {
                gameState.isDeleting = false;
                return;
            }
        }
        output.scrollTop = output.scrollHeight;
        if (fileInfo.isTraceLog && gameState.isConnected) {
            stopTrace();
            if (gameState.currentServer) gameState.currentServer.traceLogPath = null;
            output.innerHTML += `<div class="msg-box"><span class="text-success">[✓] Log de conexión eliminado. Rastreo detenido.</span></div>`;
            output.scrollTop = output.scrollHeight;
            autoAdvanceMissionsOnEvent({ type: 'log_deleted', serverIP: gameState.currentIP });
        }
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
                case 'help': {
            let html = '<div class="msg-box" style="border-color:#ffaa44;">';
            html += '<div style="color:#ffaa44; font-weight:bold; margin-bottom:8px;">HACKNET.ONION — Comandos</div>';
            html += '<table class="help-table">';
            html += '<tr><td>missions</td><td>Ver contratos disponibles</td></tr>';
            html += '<tr><td>accept [ID]</td><td>Aceptar contrato</td></tr>';
            html += '<tr><td>active</td><td>Ver contratos activos</td></tr>';
            html += '<tr><td>claim [ID]</td><td>Reclamar recompensa</td></tr>';
            html += '<tr><td>abandon [ID]</td><td>Abandonar contrato</td></tr>';
            html += '<tr><td>wallet</td><td>Ver saldo</td></tr>';
            html += '<tr><td>exit</td><td>Salir de HackNet</td></tr>';
            html += '</table></div>';
            output.innerHTML += html;
            break;
        }

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

    switch (action) {
        case 'help':
            output.innerHTML += `<div class="msg-box">
                <div class="text-success" style="margin-bottom:6px;">Comandos:</div>
                <table class="help-table">
                    <tr><td>ls / cd / cat / rm / cp / mv</td><td>Navegación de archivos</td></tr>
                    <tr><td>scan [IP]</td><td>Escanear una IP puntual (misiones)</td></tr>
                    <tr><td>netmap / netmap scan</td><td>Mapa de red / escaneo</td></tr>
                    <tr><td>connect [IP]</td><td>Conectar</td></tr>
                    <tr><td>connect hacknet.onion</td><td>Tablón de contratos</td></tr>
                    <tr><td>connect gomail.com</td><td>Correo</td></tr>
                    <tr><td>connect market.onion</td><td>InfoMarket</td></tr>
                    <tr><td>connect probe.com</td><td>Servidor de pruebas</td></tr>
                    <tr><td>disconnect</td><td>Desconectar</td></tr>
                    <tr><td>probe / run [exe] [puerto]</td><td>Ataque</td></tr>
                    <tr><td>scp / unzip / porthack</td><td>Descarga / Zip / Acceso</td></tr>
                    <tr><td>wallbreaker</td><td>App firewall</td></tr>
                    <tr><td>hardware / tools / ps</td><td>Info</td></tr>
                    <tr><td>reset / clearsave</td><td>Reiniciar / Borrar</td></tr>
                    <tr><td>trace-speed [1-50]</td><td>Velocidad del rastreo</td></tr>
                </table>
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
            if (wbSub === 'table') {
                output.innerHTML += `<div class="msg-box"><div class="text-info" style="font-weight:bold; margin-bottom:6px;">TABLA HEX → ASCII</div><pre style="font-family:Consolas,monospace; color:#33ccff; font-size:0.85rem; line-height:1.4;">
── ESPECIALES ────
  0x23 → '#'   0x2E → '.'   0x5F → '_'
── DÍGITOS ───────
  0x30 → '0'   0x31 → '1'   0x32 → '2'   0x33 → '3'
  0x34 → '4'   0x35 → '5'   0x36 → '6'   0x37 → '7'
  0x38 → '8'   0x39 → '9'
── MAYÚSCULAS ────
  0x41 → 'A'   ...   0x5A → 'Z'
── MINÚSCULAS ────
  0x61 → 'a'   ...   0x7A → 'z'
</pre></div>`;
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

        case 'connect': {
            if (!args[1]) { output.innerHTML += `<span class="text-error">Especificá IP o dirección.</span><br>`; break; }
            const target = args[1].toLowerCase();
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
            if (server.isProbeServer) unlockAllToolsForProbe();
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
            const toolName = args[1];
            const template = TOOL_TEMPLATES[toolName];
            if (!template) { output.innerHTML += `<span class="text-error">'${toolName}' no es válido.</span><br>`; break; }
            if (template.isApp) { output.innerHTML += `<span class="text-warning">'${toolName}' es una app.</span><br>`; break; }
            let tool = gameState.tools.find(t => t.name === toolName);
            const ownsTool = !!tool && localFS['/bin'].children.includes(toolName);
            let portObj = null, portNum = null, forcedTest = false;
            if (args[2]) {
                portNum = parseInt(args[2]);
                if (isNaN(portNum) || portNum <= 0 || portNum > 65535) { output.innerHTML += `<span class="text-error">Puerto inválido.</span><br>`; break; }
                if (!ownsTool) {
                    tool = { name: toolName, v: 1.0, ram: template.ram, service: template.service };
                    portNum = null; forcedTest = true;
                } else if (gameState.isConnected && gameState.currentServer) {
                    const foundPort = gameState.currentServer.ports.find(p => p.port === portNum);
                    if (!foundPort) { portNum = null; forcedTest = true; }
                    else if (foundPort.service !== tool.service) { output.innerHTML += `<span class="text-error">Servicio incorrecto.</span><br>`; break; }
                    else if (foundPort.state === 'open') { output.innerHTML += `<span class="text-warning">Puerto ya abierto.</span><br>`; break; }
                    else { portObj = foundPort; }
                } else { portNum = null; forcedTest = true; }
            } else {
                if (!ownsTool) { output.innerHTML += `<span class="text-error">'${toolName}' no en /bin.</span><br>`; break; }
            }
            if (launchTool(tool, portObj, portNum)) { /* ok */ }
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
            const proc = {
                id: 'unz_' + Date.now() + Math.floor(Math.random() * 1000),
                toolName: 'unzip', isUnzip: true, status: 'hacking', progress: 0, ram: ramCost,
                serverIP: gameState.currentIP || 'local', sourceServerIP: gameState.currentIP || 'local',
                isRemote: gameState.isConnected,
                zipPath, zipName, zipPassword: pw, zipContents,
                extractDirPath, extractDirName, extractDirParent: zipDirPath,
                extractedCount: 0, totalFiles: zipContents.length,
                fileName: zipName, fileSizeKB: sizeKB, durationMs,
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
            const reservedNames = gameState.runningProcesses.filter(p => p.isDownload && p.destDirPath === localDirPath).map(p => p.fileName);
            let finalName;
            if (isExe) finalName = fileName;
            else finalName = getUniqueFileName(localFS, localDirPath, fileName, reservedNames);
            const durationMs = getDownloadDuration(sizeKB);
            const serverIPAtStart = gameState.currentIP;
            const serverTierAtStart = gameState.currentServer.tier;
            const proc = {
                id: 'dl_' + Date.now() + Math.floor(Math.random() * 1000),
                toolName: 'scp', isDownload: true, status: 'hacking', progress: 0, ram: ramCost,
                serverIP: serverIPAtStart, sourceServerIP: serverIPAtStart,
                sourcePath: remoteFilePath, sourceFS: 'remote',
                destDirPath: localDirPath, destFS: 'local',
                fileName: finalName, originalFileName: fileName,
                fileSizeKB: sizeKB, isExe, durationMs,
                animatedElapsed: 0, startedAt: Date.now(), resultMessage: ''
            };
            gameState.runningProcesses.push(proc);
            currentProcessPage = gameState.runningProcesses.length - 1;
            lastProcessSignature = '__force__';
            updateUI();
            output.innerHTML += `<span class="text-info">[↓] Descarga: ${finalName} (${sizeKB.toFixed(1)} KB · ${ramCost.toFixed(2)} GB)</span><br>`;
            output.scrollTop = output.scrollHeight;
            launchDownload(proc).then(() => {
                autoAdvanceMissionsOnEvent({ type: 'download', fileName, tier: serverTierAtStart, serverIP: serverIPAtStart });
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
    if (gameState.traceInterval) clearInterval(gameState.traceInterval);
    gameState.traceInterval = null;
    gameState.scanning = false;
    gameState.runningProcesses = [];
    stopScannerSound();
    clearSave();
    document.body.classList.remove('quick-trace-active');
    document.body.classList.remove('trace-active');
    document.body.classList.remove('trace-critical');
    gameState.currentIP = null; gameState.currentServer = null;
    gameState.isConnected = false; gameState.isAuthenticated = false;
    gameState.netmapOpen = false; gameState.isDeleting = false; gameState.isGameOver = false;
    gameState.isDownloading = false; gameState.quickTraceActive = false;
    gameState.money = 0;
    gameState.marketAccount = null; gameState.marketSession = false; gameState.inMarket = false;
    gameState.connectOverlayOpen = false; gameState.pendingReset = false;
    gameState.ram = 0; gameState.maxRam = 1.2; gameState.ramUpgradeLevel = 0; gameState.traceTime = 0;
    gameState.netmapCamX = 0; gameState.netmapCamY = 0;
    gameState.hackedServers = []; gameState.lastKnownTier = 0;
    gameState.wallbreakerObtained = false; gameState.wallbreakerApp = null;
    gameState.missionAccount = null; gameState.gomailAccount = null; gameState.gomailLinked = false;
    gameState.hacknetSession = false; gameState.gomailSession = false;
    gameState.inHacknet = false; gameState.inGomail = false;
    gameState.missionsAvailable = []; gameState.missionsActive = []; gameState.missionsCompleted = [];
    gameState.lastMissionSpawn = 0; gameState.missionCounter = 0; gameState.gomailInbox = [];
    gameState.hardware = {
        cpu:     { level: 0, mult: 1.0,  label: 'Base Dual-Core 2.4GHz' },
        antenna: { level: 0, range: 1.0, label: 'Antena integrada' }
    };
    gameState.tools = [
        { name: 'ssh_crack.exe', v: 1.0, ram: 1.0, service: 'SSH' },
        { name: 'sql_crack.exe', v: 1.0, ram: 0.9, service: 'SQL' },
        { name: 'http_crack.exe', v: 1.0, ram: 0.8, service: 'HTTP' }
    ];
    localFS = buildInitialLocalFS();
    remoteFS = {};
    localCWD = '/home/user';
    remoteCWD = '/home/user';
    generateNetwork();
    commandHistory = []; historyIndex = -1;
    currentProcessPage = 0; lastProcessSignature = '__force__';
    stopTrace();
    output.innerHTML = '';
    updateUI();
    input.disabled = true;
    gameState.setupComplete = false;
    gameState.localUser = 'user'; gameState.localPass = '1234';
    setTimeout(() => {
        if (marketFormOverlay) marketFormOverlay.style.display = 'none';
        ['connect-overlay', 'hacknet-form-overlay', 'gomail-form-overlay', 'gomail-web-overlay', 'wallbreaker-section'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        startSetup();
    }, 400);
}