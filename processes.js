// ============================================================
// HELPERS DE DIAGNÓSTICO
// ============================================================
window.diagnoseGame = function() {
    const info = {
        ramCalculada: calculateRamUsage(),
        gameStateRam: gameState.ram,
        maxRam: gameState.maxRam,
        netmapOpen: gameState.netmapOpen,
        isDeleting: gameState.isDeleting,
        isDownloading: gameState.isDownloading,
        isGameOver: gameState.isGameOver,
        isConnected: gameState.isConnected,
        isAuthenticated: gameState.isAuthenticated,
        currentIP: gameState.currentIP,
        inputDisabled: input.disabled,
        playerTier: getPlayerTier(),
        bestToolVersion: getBestToolVersion(),
        hackedServers: gameState.hackedServers.length,
        toolsCount: gameState.tools.length,
        toolsNames: gameState.tools.map(t => `${t.name} v${t.v.toFixed(1)}`),
        binChildren: localFS['/bin'] ? localFS['/bin'].children : 'NO /bin',
        processes: gameState.runningProcesses.map(p => ({
            name: p.toolName, ram: p.ram, status: p.status, progress: p.progress,
            isScan: !!p.isScan, isDownload: !!p.isDownload, isUnzip: !!p.isUnzip
        }))
    };
    console.table(info);
    return info;
};

window.fixStuckState = function() {
    gameState.isDeleting = false;
    gameState.isDownloading = false;
    gameState.ram = calculateRamUsage();
    if (!gameState.isGameOver) { input.disabled = false; input.focus(); }
    updateUI();
};

window.forceKillAll = function() {
    gameState.runningProcesses = [];
    gameState.scanning = false;
    stopScannerSound();
    currentProcessPage = 0;
    gameState.ram = calculateRamUsage();
    lastProcessSignature = '__force__';
    updateUI();
};

// ============================================================
// DURACIONES
// ============================================================
function calculatePortDuration(portVersion, crackVersion) {
    const pv = Math.max(0.3, parseFloat(portVersion) || 1.0);
    const cv = Math.max(0.3, parseFloat(crackVersion) || 1.0);
    const diff = Math.max(0, cv - pv);
    const base = 1500 + pv * 1800;
    const factor = 1 + 12 * Math.exp(-diff * 2.0);
    let duration = base * factor;
    duration = Math.max(2500, Math.min(60000, duration));
    const jitter = 0.9 + Math.random() * 0.2;
    return Math.round(duration * jitter);
}

function getToolDuration(toolName, isTestMode, portObj, tool) {
    if (isTestMode) {
        const TEST_DURATIONS = {
            'sql_crack.exe':    5000,
            'ssh_crack.exe':    5000,
            'http_crack.exe':   5000,
            'ftp_crack.exe':    6000,
            'smtp_crack.exe':   6000,
            'telnet_crack.exe': 6000,
            'dns_crack.exe':    6000,
            'wallbreaker.exe':  5000
        };
        return (TEST_DURATIONS[toolName] || 5000) * getHardwareCPUMult();
    }
    // Crackers rápidos en modo last-chance — escalados al nivel del jugador
    if (gameState.gamePhase === 'last-chance') {
        const bv = getBestToolVersion();
        const base = 4000 + Math.max(0, bv - 1) * 1000;
        return base + Math.random() * 2000;
    }
    if (portObj && tool) return calculatePortDuration(portObj.v, tool.v) * getHardwareCPUMult();
    return 5000 * getHardwareCPUMult();
}
const PORTHACK_RAM_COST = 0.4;
const PORTHACK_BASE_MS = 24000;
const PORTHACK_PER_PORT_MS = 1200;
const PORTHACK_SECURITY_MS = 4000;

function getPortHackDuration(server, portsCount) {
    if (server && server.isLastChanceServer) {
        const bv = getBestToolVersion();
        const base = 12000 + Math.max(0, bv - 1) * 1500;
        return base + Math.random() * 4000;
    }
    const sec = server.securityLevel || 0;
    const n = Math.max(1, portsCount || server.reqPorts || 1);
    let dur = PORTHACK_BASE_MS + n * PORTHACK_PER_PORT_MS + sec * PORTHACK_SECURITY_MS;
    dur = Math.max(28000, Math.min(45000, dur));
    const jitter = 0.95 + Math.random() * 0.1;
    return Math.round(dur * jitter);
}

// ============================================================
// PROCESOS
// ============================================================
function changeProcessPage(delta) {
    const total = gameState.runningProcesses.length;
    if (total === 0) return;
    currentProcessPage = Math.max(0, Math.min(total - 1, currentProcessPage + delta));
    lastProcessSignature = '__force__';
    updateUI();
}

function renderProcesses() {
    const total = gameState.runningProcesses.length;
    if (total === 0) currentProcessPage = 0;
    else {
        if (currentProcessPage >= total) currentProcessPage = total - 1;
        if (currentProcessPage < 0) currentProcessPage = 0;
    }
    const sig = gameState.runningProcesses.map(p => p.id).join('|') + '|' + currentProcessPage;
    if (sig === lastProcessSignature) {
        const proc = gameState.runningProcesses[currentProcessPage];
        if (proc) {
            const bar = document.getElementById('proc-bar-' + proc.id);
            if (bar) {
                bar.style.width = proc.progress + '%';
                if (proc.isStalled) bar.classList.add('stalled'); else bar.classList.remove('stalled');
            }
            const card = document.getElementById('proccard-' + proc.id);
            if (card) {
                if (proc.isStalled) card.classList.add('stalled'); else card.classList.remove('stalled');
            }
            updateProcessStatusUI(proc);
        }
        return;
    }
    lastProcessSignature = sig;
    if (total === 0) {
        processesList.innerHTML = `<div class="empty-state">(sin procesos activos)</div>`;
        processesPagination.style.display = 'none';
        return;
    }
    const proc = gameState.runningProcesses[currentProcessPage];
    let html = '';
    let statusText = '', statusClass = '';
    if (proc.isRm) {
    statusText = proc.status === 'hacking'
        ? `Borrando ${proc.fileName}...`
        : (proc.resultMessage || '');
    statusClass = proc.status === 'active' ? 'active' : '';
} else if (proc.isUnzip) {
        statusText = proc.status === 'hacking'
            ? `Extrayendo ${proc.extractedCount || 0}/${proc.totalFiles} archivos...`
            : (proc.resultMessage || '');
        statusClass = proc.status === 'active' ? 'active' : '';
    } else if (proc.isDownload) {
        statusText = proc.status === 'hacking'
            ? `Descargando ${proc.fileSizeKB.toFixed(1)} KB...`
            : (proc.resultMessage || '');
        statusClass = proc.status === 'active' ? 'active' : '';
    } else if (proc.isPortHack) {
        statusText = proc.status === 'hacking' ? 'Estableciendo túnel inverso...' : (proc.resultMessage || '');
        statusClass = proc.status === 'active' ? 'active' : (proc.status === 'failed' ? 'failed' : '');
    } else if (proc.isScan) {
        statusText = proc.status === 'hacking' ? 'Escaneando red...' : (proc.resultMessage || '');
        statusClass = proc.status === 'hacking' ? '' : 'active';
    }
    else if (proc.status === 'hacking') statusText = proc.portNum ? `Hackeando :${proc.portNum}...` : 'Iniciando...';
    else if (proc.status === 'active') { statusText = proc.resultMessage || 'Activo'; statusClass = 'active'; }
    else if (proc.status === 'failed') { statusText = proc.resultMessage || 'Fallido'; statusClass = 'failed'; }

    let headerText;
    if (proc.isUnzip) headerText = `<span class="proc-name" style="color:#ffaa44;">unzip</span> <span class="proc-port">→ ${proc.zipName}</span>`;
    else if (proc.isDownload) headerText = `<span class="proc-name" style="color:#33ccff;">scp</span> <span class="proc-port">→ ${proc.fileName}</span>`;
    else if (proc.isRm) headerText = `<span class="proc-name" style="color:#ff8844;">rm</span> <span class="proc-port">→ ${proc.fileName}</span>`;
    else if (proc.isPortHack) headerText = `<span class="proc-name" style="color:#33ffff;">porthack</span>`;
    else if (proc.isScan) headerText = `scan.exe`;
    else headerText = `${proc.toolName}${proc.portNum ? ' <span class="proc-port">→ :' + proc.portNum + '</span>' : ''}`;

    const isDownload = proc.isDownload;
    const isUnzip = proc.isUnzip;
    const isRm = !!proc.isRm;
    const isSql = proc.toolName === 'sql_crack.exe' && !proc.isScan && !proc.isPortHack && !proc.isDownload && !proc.isUnzip && proc.sqlScript;
    const isSsh = proc.toolName === 'ssh_crack.exe' && !proc.isScan && !proc.isPortHack && !proc.isDownload && !proc.isUnzip && proc.sshOrbs;
    const isHttp = proc.toolName === 'http_crack.exe' && !proc.isScan && !proc.isPortHack && !proc.isDownload && !proc.isUnzip && proc.httpTree;
    const isFtp = proc.toolName === 'ftp_crack.exe' && !proc.isScan && !proc.isPortHack && !proc.isDownload && !proc.isUnzip && proc.ftpData;
    const isSmtp = proc.toolName === 'smtp_crack.exe' && !proc.isScan && !proc.isPortHack && !proc.isDownload && !proc.isUnzip && proc.smtpData;
    const isTelnet = proc.toolName === 'telnet_crack.exe' && !proc.isScan && !proc.isPortHack && !proc.isDownload && !proc.isUnzip && proc.telnetData;
    const isDns = proc.toolName === 'dns_crack.exe' && !proc.isScan && !proc.isPortHack && !proc.isDownload && !proc.isUnzip && proc.dnsData;
    const isPortHack = proc.isPortHack && proc.portHackData;
    const stalledClass = proc.isStalled ? ' stalled' : '';
    html += `<div class="process-card${stalledClass}" id="proccard-${proc.id}">
        <div class="proc-header">
            <span>${headerText}</span>
            <span class="proc-kill" onclick="killProcess('${proc.id}')">[X]</span>
        </div>`;
    if (isSql)    html += `<canvas class="sql-canvas"    id="sql-canvas-${proc.id}"    width="${SQL_CANVAS_W}"    height="${SQL_CANVAS_H}"></canvas>`;
    if (isSsh)    html += `<canvas class="ssh-canvas"    id="ssh-canvas-${proc.id}"    width="${SSH_CANVAS_W}"    height="${SSH_CANVAS_H}"></canvas>`;
    if (isHttp)   html += `<canvas class="http-canvas"   id="http-canvas-${proc.id}"   width="${HTTP_CANVAS_W}"   height="${HTTP_CANVAS_H}"></canvas>`;
    if (isFtp)    html += `<canvas class="ftp-canvas"    id="ftp-canvas-${proc.id}"    width="${FTP_CANVAS_W}"    height="${FTP_CANVAS_H}"></canvas>`;
    if (isSmtp)   html += `<canvas class="smtp-canvas"   id="smtp-canvas-${proc.id}"   width="${SMTP_CANVAS_W}"   height="${SMTP_CANVAS_H}"></canvas>`;
    if (isTelnet) html += `<canvas class="telnet-canvas" id="telnet-canvas-${proc.id}" width="${TELNET_CANVAS_W}" height="${TELNET_CANVAS_H}"></canvas>`;
    if (isDns)    html += `<canvas class="smtp-canvas"   id="dns-canvas-${proc.id}"    width="${DNS_CANVAS_W}"    height="${DNS_CANVAS_H}"></canvas>`;
    if (isPortHack) html += `<canvas class="smtp-canvas" id="porthack-canvas-${proc.id}" width="${PORTHACK_CANVAS_W}" height="${PORTHACK_CANVAS_H}"></canvas>`;
    if (isDownload) html += `<canvas class="sql-canvas"  id="dl-canvas-${proc.id}"     width="${DOWNLOAD_CANVAS_W}" height="${DOWNLOAD_CANVAS_H}"></canvas>`;
    if (isRm)       html += `<canvas class="sql-canvas"  id="rm-canvas-${proc.id}"     width="${RM_CANVAS_W}"       height="${RM_CANVAS_H}"></canvas>`;
    if (isUnzip)  html += `<canvas class="sql-canvas"    id="uz-canvas-${proc.id}"     width="${UNZIP_CANVAS_W}"    height="${UNZIP_CANVAS_H}"></canvas>`;
    html += `<div class="progress-container">
            <div class="progress-bar${stalledClass}" id="proc-bar-${proc.id}" style="width:${proc.progress}%"></div>
        </div>
        <div class="proc-status ${statusClass}" id="proc-status-${proc.id}">${statusText}</div>
    </div>`;
    processesList.innerHTML = html;
    if (total > 1) {
        processesPagination.style.display = 'flex';
        document.getElementById('proc-page-indicator').textContent = `${currentProcessPage + 1} / ${total}`;
        document.getElementById('proc-prev-btn').disabled = currentProcessPage === 0;
        document.getElementById('proc-next-btn').disabled = currentProcessPage === total - 1;
    } else {
        processesPagination.style.display = 'none';
    }
}

function updateProcessBarUI(proc) {
    const bar = document.getElementById('proc-bar-' + proc.id);
    if (bar) bar.style.width = proc.progress + '%';
}

function updateProcessStatusUI(proc) {
    const statusEl = document.getElementById('proc-status-' + proc.id);
    if (!statusEl) return;

if (proc.isRm) {
    if (proc.status === 'hacking') {
        statusEl.textContent = `Borrando ${proc.fileName}...`;
        statusEl.className = 'proc-status';
    } else if (proc.status === 'active') {
        statusEl.textContent = 'Eliminado';
        statusEl.className = 'proc-status active';
    }
    return;
}

    if (proc.isUnzip) {
        if (proc.status === 'hacking') {
            statusEl.textContent = `Extrayendo archivos...`;
            statusEl.className = 'proc-status';
        } else if (proc.status === 'active') {
            statusEl.textContent = 'Completado';
            statusEl.className = 'proc-status active';
        }
        return;
    }

    if (proc.isDownload) {
        if (proc.status === 'hacking') {
            statusEl.textContent = `Descargando ${proc.fileSizeKB.toFixed(1)} KB...`;
            statusEl.className = 'proc-status';
        } else if (proc.status === 'active') {
            statusEl.textContent = 'Completado';
            statusEl.className = 'proc-status active';
        }
        return;
    }

    if (proc.isStalled && proc.status === 'hacking') {
        statusEl.textContent = '⚠ Atascado...';
        statusEl.className = 'proc-status stalled';
        return;
    }
    if (proc.isPortHack) {
        statusEl.textContent = proc.status === 'hacking' ? 'Estableciendo túnel inverso...' : (proc.resultMessage || '');
        statusEl.className = 'proc-status ' + (proc.status === 'active' ? 'active' : (proc.status === 'failed' ? 'failed' : ''));
        return;
    }
    if (proc.isScan) statusEl.textContent = proc.status === 'hacking' ? 'Escaneando red...' : (proc.resultMessage || '');
    else if (proc.status === 'hacking') { statusEl.textContent = proc.portNum ? `Hackeando :${proc.portNum}...` : 'Iniciando...'; statusEl.className = 'proc-status'; }
    else if (proc.status === 'active') { statusEl.textContent = proc.resultMessage || 'Activo'; statusEl.className = 'proc-status active'; }
    else if (proc.status === 'failed') { statusEl.textContent = proc.resultMessage || 'Fallido'; statusEl.className = 'proc-status failed'; }
}

function updateUI() {
    const currentTier = getPlayerTier();
    if (currentTier > gameState.lastKnownTier) {
        regenerateUndiscoveredServers();
    }

    gameState.ram = calculateRamUsage();
    // Cap visual: nunca mostrar más que maxRam
    const ramDisplay = Math.min(gameState.ram, gameState.maxRam);
    ramStatus.textContent = `${ramDisplay.toFixed(1)} / ${gameState.maxRam.toFixed(1)} GB`;
    const ramPercent = Math.min(100, (gameState.ram / gameState.maxRam) * 100);
    ramBar.style.width = ramPercent + '%';
    if (ramPercent > 85) ramBar.style.background = '#ff3333';
    else if (ramPercent > 60) ramBar.style.background = '#ffcc00';
    else ramBar.style.background = '#0f0';

    if (gameState.inMarket) {
        connStatus.textContent = 'InfoMarket';
        connStatus.style.color = '#ffcc00';
        promptSymbol.textContent = 'market>';
        promptSymbol.style.color = '#ffcc00';
    } else if (gameState.inHacknet) {
        connStatus.textContent = 'HackNet.onion';
        connStatus.style.color = '#ffaa44';
        promptSymbol.textContent = 'hacknet>';
        promptSymbol.style.color = '#ffaa44';
    } else if (gameState.inGomail) {
        connStatus.textContent = 'GoMail';
        connStatus.style.color = '#44ddff';
        promptSymbol.textContent = 'gomail>';
        promptSymbol.style.color = '#44ddff';
    } else if (!gameState.isConnected) {
        connStatus.textContent = 'DESCONECTADO';
        connStatus.style.color = '#ff3333';
        promptSymbol.textContent = `${gameState.localUser}@local:${localCWD}$`;
        promptSymbol.style.color = '#33ff33';
    } else if (!gameState.isAuthenticated) {
        connStatus.textContent = `CONECTADO: ${gameState.currentIP}`;
        connStatus.style.color = '#33ff33';
        promptSymbol.textContent = `${gameState.currentIP}:${remoteCWD}$`;
        promptSymbol.style.color = '#33ff33';
    } else {
        connStatus.textContent = `CONECTADO: ${gameState.currentIP}`;
        connStatus.style.color = '#33ff33';
        const remoteUser = gameState.currentServer && gameState.currentServer.savedCredentials ? gameState.currentServer.savedCredentials.user : (gameState.currentServer && gameState.currentServer.credentials ? gameState.currentServer.credentials.user : 'root');
        promptSymbol.textContent = `${remoteUser}@${gameState.currentIP}:${remoteCWD}$`;
        promptSymbol.style.color = '#33ff33';
    }
    netmapSection.style.display = gameState.netmapOpen ? 'block' : 'none';

    if (!gameState.isDeleting && !gameState.isGameOver && !gameState.connectOverlayOpen) {
        if (input.disabled) input.disabled = false;
    }

    renderProcesses();
}

function killProcess(procId) {
    if (gameState.isDeleting) return;
    const idx = gameState.runningProcesses.findIndex(p => p.id === procId);
    if (idx < 0) return;
    const proc = gameState.runningProcesses[idx];
    if (proc.isScan) {
        gameState.scanning = false;
        stopScannerSound();
        output.innerHTML += `<span class="text-warning">[!] Escaneo cancelado.</span><br>`;
    }
	else if (proc.isRm) {
    output.innerHTML += `<span class="text-warning">[!] Borrado cancelado: ${proc.fileName}.</span><br>`;
}
    else if (proc.isDownload) {
        output.innerHTML += `<span class="text-warning">[!] Descarga cancelada: ${proc.fileName}.</span><br>`;
    }
    else if (proc.isUnzip) {
        output.innerHTML += `<span class="text-warning">[!] Descompresión cancelada: ${proc.zipName}.</span><br>`;
    }
    else if (proc.isPortHack) {
        output.innerHTML += `<span class="text-warning">[!] Porthack cancelado.</span><br>`;
    }
    else {
        if (proc.portObj && proc.portObj.state === 'open') proc.portObj.state = 'blocked';
        output.innerHTML += `<span class="text-warning">[!] Proceso ${proc.toolName} terminado.${proc.portObj ? ` Puerto ${proc.portNum} bloqueado.` : ''}</span><br>`;
    }
    output.scrollTop = output.scrollHeight;
    gameState.runningProcesses.splice(idx, 1);
    if (currentProcessPage >= gameState.runningProcesses.length) {
        currentProcessPage = Math.max(0, gameState.runningProcesses.length - 1);
    }
    lastProcessSignature = '__force__';
    updateUI();
}

function killAllProcesses() {
    gameState.runningProcesses.forEach(proc => { if (proc.portObj && proc.portObj.state === 'open') proc.portObj.state = 'blocked'; });
    gameState.runningProcesses = [];
    gameState.scanning = false;
    stopScannerSound();
    currentProcessPage = 0;
}

// ============================================================
// DESCARGA (scp como proceso)
// ============================================================
async function launchDownload(proc) {
    try {
        const startTime = Date.now();
        await new Promise(resolve => {
            function frame() {
                try {
                    const now = Date.now();
                    const cur = gameState.runningProcesses.find(p => p.id === proc.id);
                    if (!cur) { resolve(); return; }
                    if (gameState.isGameOver) { resolve(); return; }

                    if (!gameState.isConnected || gameState.currentIP !== cur.sourceServerIP) {
                        const idx = gameState.runningProcesses.findIndex(p => p.id === proc.id);
                        if (idx >= 0) gameState.runningProcesses.splice(idx, 1);
                        output.innerHTML += `<span class="text-error">[✗] Descarga cancelada: conexión cerrada (${cur.fileName}).</span><br>`;
                        output.scrollTop = output.scrollHeight;
                        lastProcessSignature = '__force__';
                        updateUI();
                        resolve();
                        return;
                    }

                    const elapsed = now - startTime;
                    cur.animatedElapsed = elapsed;
                    const progress = Math.min(100, (elapsed / cur.durationMs) * 100);
                    cur.progress = Math.floor(progress);

                    const bar = document.getElementById('proc-bar-' + proc.id);
                    if (bar) bar.style.width = progress + '%';
                    updateProcessStatusUI(cur);

                    try { drawDownloadAnimation(cur, now); } catch (e) { console.error('[dl draw]', e); }

                    updateAnimSound(cur, 'scp', progress / 100, now);

                    if (progress < 100) requestAnimationFrame(frame);
                    else resolve();
                } catch (err) {
                    console.error('[launchDownload] Error:', err);
                    resolve();
                }
            }
            requestAnimationFrame(frame);
        });

        const cur = gameState.runningProcesses.find(p => p.id === proc.id);
        if (!cur) return;

        const sourceFile = remoteFS[cur.sourcePath];
        if (!sourceFile) {
            output.innerHTML += `<span class="text-error">[✗] Archivo remoto perdido (${cur.fileName}).</span><br>`;
            const idx = gameState.runningProcesses.findIndex(p => p.id === proc.id);
            if (idx >= 0) gameState.runningProcesses.splice(idx, 1);
            lastProcessSignature = '__force__';
            updateUI();
            return;
        }

        const destDir = cur.destDirPath;
        const localDestPath = destDir === '/' ? '/' + cur.fileName : destDir + '/' + cur.fileName;

        if (!localFS[destDir].children.includes(cur.fileName)) {
    localFS[destDir].children.push(cur.fileName);
}
localFS[localDestPath] = { ...sourceFile };
if (cur.sourceServerIP) localFS[localDestPath].sourceServerIP = cur.sourceServerIP;
        if (cur.sourceServerIdentity) localFS[localDestPath].sourceServerIdentity = cur.sourceServerIdentity;

// ==== ANTI-DUPLICADOS ====
// Si es duplicado, se guarda con value 0 y una marca para que
// (si es zip) los archivos extraídos también salgan sin valor.
if (cur.isDuplicate) {
    localFS[localDestPath].value = 0;
    localFS[localDestPath].isDuplicateDownload = true;
}

if (cur.isExe) {
    const newVersion = sourceFile.version || 1.0;
    const existingTool = gameState.tools.find(t => t.name === cur.fileName);
    const template = TOOL_TEMPLATES[cur.fileName];
    if (template) {
        if (existingTool) {
            existingTool.v = newVersion;
            existingTool.ram = template.ram;
            existingTool.service = template.service;
        } else {
            gameState.tools.push({ name: cur.fileName, v: newVersion, ram: template.ram, service: template.service });
        }
    }
} else {
    // Registrar el ID como ya descargado (aunque sea duplicado,
    // así el set queda consistente y no se re-chequea dos veces).
    if (cur.sourceInstanceId) {
        if (!Array.isArray(gameState.downloadedFileIds)) gameState.downloadedFileIds = [];
        if (!gameState.downloadedFileIds.includes(cur.sourceInstanceId)) {
            gameState.downloadedFileIds.push(cur.sourceInstanceId);
        }
    }

    // Leer del FS local ya guardado (puede tener value = 0 si es duplicado)
    const storedFile = localFS[localDestPath];
    const sellValue = getFileValue(cur.fileName, storedFile);
    let extra = '';
    if (sellValue > 0) {
        extra = ` <span class="text-gold">(vendible: ${sellValue} CR)</span>`;
    } else if (cur.isDuplicate) {
        extra = ` <span class="text-warning">(duplicado — sin valor de venta)</span>`;
    }
    output.innerHTML += `<span class="text-success">[✓] ${cur.fileName} → ${destDir}</span>${extra}<br>`;
}

        cur.status = 'active';
        cur.resultMessage = 'Completado';
        updateProcessStatusUI(cur);

        setTimeout(() => {
            const idx = gameState.runningProcesses.findIndex(p => p.id === proc.id);
            if (idx >= 0) {
                gameState.runningProcesses.splice(idx, 1);
                if (currentProcessPage >= gameState.runningProcesses.length) {
                    currentProcessPage = Math.max(0, gameState.runningProcesses.length - 1);
                }
                lastProcessSignature = '__force__';
                updateUI();
            }
        }, 1500);

        checkDownloadTrigger();
        updateUI();
        saveGame();
    } catch (err) {
        console.error('[launchDownload] EXCEPCIÓN:', err);
    }
}

// ============================================================
// UNZIP (descompresión progresiva archivo por archivo)
// ============================================================
async function launchUnzip(proc) {
    try {
        const startTime = Date.now();
        let extractedSoFar = 0;
        let dirCreated = false;

        await new Promise(resolve => {
            function frame() {
                try {
                    const now = Date.now();
                    const cur = gameState.runningProcesses.find(p => p.id === proc.id);
                    if (!cur) { resolve(); return; }
                    if (gameState.isGameOver) { resolve(); return; }

                    if (cur.isRemote && (!gameState.isConnected || gameState.currentIP !== cur.sourceServerIP)) {
                        const idx = gameState.runningProcesses.findIndex(p => p.id === proc.id);
                        if (idx >= 0) gameState.runningProcesses.splice(idx, 1);
                        output.innerHTML += `<span class="text-error">[✗] Descompresión cancelada: conexión cerrada (${cur.zipName}).</span><br>`;
                        output.scrollTop = output.scrollHeight;
                        lastProcessSignature = '__force__';
                        updateUI();
                        resolve();
                        return;
                    }

                    const elapsed = now - startTime;
                    cur.animatedElapsed = elapsed;
                    const progress = Math.min(100, (elapsed / cur.durationMs) * 100);
                    cur.progress = Math.floor(progress);

                    const fs = cur.isRemote ? remoteFS : localFS;

                    if (!dirCreated && fs[cur.extractDirParent]) {
                        if (!fs[cur.extractDirPath]) {
                            fs[cur.extractDirPath] = { type: 'dir', children: [] };
                            if (!fs[cur.extractDirParent].children.includes(cur.extractDirName)) {
                                fs[cur.extractDirParent].children.push(cur.extractDirName);
                            }
                        }
                        dirCreated = true;
                    }

                    const targetExtracted = Math.floor((progress / 100) * cur.totalFiles);
                    while (extractedSoFar < targetExtracted && extractedSoFar < cur.zipContents.length) {
                        const inner = cur.zipContents[extractedSoFar];
                        const innerPath = cur.extractDirPath + '/' + inner.name;
                        const val = cur.isDuplicateDownload
                            ? 0
                            : computeFileValue(inner.category, inner.size,
                                gameState.currentServer && cur.isRemote ? gameState.currentServer.tier : 0);
                        fs[innerPath] = makeFile(inner.content, inner.size, false, val, inner.category);
                        if (cur.sourceServerIP) fs[innerPath].sourceServerIP = cur.sourceServerIP;
                        if (cur.sourceServerIdentity) fs[innerPath].sourceServerIdentity = cur.sourceServerIdentity;
                        if (!fs[cur.extractDirPath].children.includes(inner.name)) {
                            fs[cur.extractDirPath].children.push(inner.name);
                        }
                        output.innerHTML += `<span class="text-sys">  → ${inner.name} <span class="text-muted">(${formatSize(inner.size)})</span></span><br>`;
                        output.scrollTop = output.scrollHeight;
                        soundSuccess();
                        extractedSoFar++;
                        cur.extractedCount = extractedSoFar;
                    }

                    const bar = document.getElementById('proc-bar-' + proc.id);
                    if (bar) bar.style.width = progress + '%';
                    updateProcessStatusUI(cur);

                    try { drawUnzipAnimation(cur, now); } catch (e) { console.error('[uz draw]', e); }

                    updateAnimSound(cur, 'unzip', progress / 100, now);

                    if (progress < 100) requestAnimationFrame(frame);
                    else resolve();
                } catch (err) {
                    console.error('[launchUnzip] Error:', err);
                    resolve();
                }
            }
            requestAnimationFrame(frame);
        });

        const cur = gameState.runningProcesses.find(p => p.id === proc.id);
        if (!cur) return;

        const fs = cur.isRemote ? remoteFS : localFS;

        while (extractedSoFar < cur.zipContents.length) {
            const inner = cur.zipContents[extractedSoFar];
            const innerPath = cur.extractDirPath + '/' + inner.name;
            const val = cur.isDuplicateDownload
                ? 0
                : computeFileValue(inner.category, inner.size,
                    gameState.currentServer && cur.isRemote ? gameState.currentServer.tier : 0);
            fs[innerPath] = makeFile(inner.content, inner.size, false, val, inner.category);
            if (cur.sourceServerIP) fs[innerPath].sourceServerIP = cur.sourceServerIP;
            if (cur.sourceServerIdentity) fs[innerPath].sourceServerIdentity = cur.sourceServerIdentity;
            if (!fs[cur.extractDirPath].children.includes(inner.name)) {
                fs[cur.extractDirPath].children.push(inner.name);
            }
            output.innerHTML += `<span class="text-sys">  → ${inner.name} <span class="text-muted">(${formatSize(inner.size)})</span></span><br>`;
            extractedSoFar++;
        }

        if (fs[cur.zipPath]) {
            delete fs[cur.zipPath];
            const zipDir = fs[cur.extractDirParent];
            if (zipDir) zipDir.children = zipDir.children.filter(c => c !== cur.zipName);
        }

        output.innerHTML += `<span class="text-success">[✓] ${cur.totalFiles} archivos extraídos en ${cur.extractDirPath}</span><br>`;
        output.scrollTop = output.scrollHeight;

        cur.status = 'active';
        cur.resultMessage = 'Completado';
        updateProcessStatusUI(cur);

        setTimeout(() => {
            const idx = gameState.runningProcesses.findIndex(p => p.id === proc.id);
            if (idx >= 0) {
                gameState.runningProcesses.splice(idx, 1);
                if (currentProcessPage >= gameState.runningProcesses.length) {
                    currentProcessPage = Math.max(0, gameState.runningProcesses.length - 1);
                }
                lastProcessSignature = '__force__';
                updateUI();
            }
        }, 1500);

        updateUI();
        saveGame();
    } catch (err) {
        console.error('[launchUnzip] EXCEPCIÓN:', err);
    }
}

// ============================================================
// PORTHACK
// ============================================================
function launchPortHack(requestedPorts) {
    const server = gameState.currentServer;
    if (!server || !gameState.isConnected) return { ok: false, reason: 'not_connected' };
    if (server.accessed) return { ok: false, reason: 'already_accessed' };

    const openCount = server.ports.filter(p => p.state === 'open').length;
    if (openCount < server.reqPorts) {
        return { ok: false, reason: 'missing_ports', openCount, reqPorts: server.reqPorts };
    }

    gameState.ram = calculateRamUsage();
    if (gameState.ram + PORTHACK_RAM_COST > gameState.maxRam) {
        const libre = Math.max(0, gameState.maxRam - gameState.ram).toFixed(1);
        return { ok: false, reason: 'low_ram', libre };
    }

    const portsToShow = (requestedPorts && requestedPorts.length > 0)
        ? requestedPorts
        : server.ports.filter(p => p.state === 'open').map(p => p.port);

    const procId = 'ph_' + Date.now();
    const duration = getPortHackDuration(server, portsToShow.length);

    const stallSchedule = [];
    const numStalls = 1 + Math.floor(Math.random() * 2);
    const stallMin = Math.max(900, Math.round(duration * 0.06));
    const stallMax = Math.max(stallMin + 400, Math.round(duration * 0.14));
    const used = [];
    for (let i = 0; i < numStalls; i++) {
        let at;
        if (i === 0) at = 0.28 + Math.random() * 0.14;
        else at = 0.58 + Math.random() * 0.14;
        if (used.some(u => Math.abs(u - at) < 0.1)) at += 0.12;
        used.push(at);
        const stallDur = stallMin + Math.random() * (stallMax - stallMin);
        stallSchedule.push({ at, duration: Math.round(stallDur), triggered: false });
    }

    const proc = {
        id: procId,
        toolName: 'porthack',
        portNum: null,
        ram: PORTHACK_RAM_COST,
        serverIP: server.ip,
        isTestMode: false,
        isPortHack: true,
        status: 'hacking',
        progress: 0,
        portObj: null,
        resultMessage: '',
        animatedElapsed: 0,
        isStalled: false,
        stallSchedule: stallSchedule,
        accumulatedStall: 0,
        currentStall: null,
        startedAt: Date.now(),
        durationMs: duration,
        portHackData: createPortHackData(server, portsToShow),
        soundState: {
            lastMilestone: -1,
            lastTickBucket: -1,
            stallSoundLastAt: 0,
            wasStalled: false,
            completePlayed: false
        }
    };
    gameState.runningProcesses.push(proc);
    currentProcessPage = gameState.runningProcesses.length - 1;
    lastProcessSignature = '__force__';
    updateUI();
    animatePortHack(proc, server);
    return { ok: true, duration };
}

async function animatePortHack(proc, server) {
    try {
        const startTime = Date.now();
        await new Promise(resolve => {
            function frame() {
                const now = Date.now();
                if (gameState.isGameOver) { resolve(); return; }
                const cur = gameState.runningProcesses.find(p => p.id === proc.id);
                if (!cur) { resolve(); return; }

                if (cur.currentStall) {
                    if (now - cur.currentStall.startedAt >= cur.currentStall.duration) {
                        cur.accumulatedStall += (now - cur.currentStall.startedAt);
                        cur.currentStall = null;
                        cur.isStalled = false;
                    } else cur.isStalled = true;
                } else {
                    const rawElapsed = now - startTime - cur.accumulatedStall;
                    const rawProgress = rawElapsed / cur.durationMs;
                    for (const s of cur.stallSchedule) {
                        if (!s.triggered && rawProgress >= s.at) {
                            s.triggered = true;
                            cur.currentStall = { startedAt: now, duration: s.duration };
                            cur.isStalled = true;
                            break;
                        }
                    }
                }

                let effectiveElapsed = now - startTime - cur.accumulatedStall;
                if (cur.currentStall) effectiveElapsed -= (now - cur.currentStall.startedAt);
                effectiveElapsed = Math.max(0, effectiveElapsed);
                cur.animatedElapsed = effectiveElapsed;

                const progress = Math.min(100, (effectiveElapsed / cur.durationMs) * 100);
                cur.progress = Math.floor(progress);

                const bar = document.getElementById('proc-bar-' + proc.id);
                if (bar) {
                    bar.style.width = progress + '%';
                    if (cur.isStalled) bar.classList.add('stalled'); else bar.classList.remove('stalled');
                }
                const card = document.getElementById('proccard-' + proc.id);
                if (card) {
                    if (cur.isStalled) card.classList.add('stalled'); else card.classList.remove('stalled');
                }
                updateProcessStatusUI(cur);

                try {
                    if (cur.portHackData) drawPortHackAnimation(cur, now);
                } catch (drawErr) {
                    console.error('[porthack] Error dibujando:', drawErr);
                }

                updateAnimSound(cur, 'porthack', progress / 100, now);

                if (progress < 100) requestAnimationFrame(frame); else resolve();
            }
            requestAnimationFrame(frame);
        });

        const currentProc = gameState.runningProcesses.find(p => p.id === proc.id);
        if (!currentProc) return;

        server.accessed = true;
        gameState.isAuthenticated = false;
        if (!gameState.hackedServers.includes(server.ip)) {
            gameState.hackedServers.push(server.ip);
        }

        currentProc.status = 'active';
        currentProc.resultMessage = 'Acceso concedido';
        updateProcessStatusUI(currentProc);

        soundSuccess();
        updateUI();

        setTimeout(() => {
            const idx = gameState.runningProcesses.findIndex(p => p.id === proc.id);
            if (idx >= 0) {
                gameState.runningProcesses.splice(idx, 1);
                if (currentProcessPage >= gameState.runningProcesses.length) currentProcessPage = Math.max(0, gameState.runningProcesses.length - 1);
                lastProcessSignature = '__force__';
                updateUI();
            }
        }, 1500);
        saveGame();
    } catch (err) {
        console.error('[animatePortHack] EXCEPCIÓN:', err);
    }
}

function launchTool(tool, portObj, portNum) {
    try {
        gameState.ram = calculateRamUsage();

        if (gameState.gamePhase !== 'last-chance') {
            if (gameState.ram + tool.ram > gameState.maxRam) {
                output.innerHTML += `<span class="text-error">Error: RAM insuficiente.</span><br>`;
                output.scrollTop = output.scrollHeight;
                return false;
            }
        }

        const procId = 'p' + Date.now() + Math.floor(Math.random() * 1000);
        const isTestMode = !portObj;
        const computedDuration = getToolDuration(tool.name, isTestMode, portObj, tool);

        const proc = {
            id: procId, toolName: tool.name, portNum: portNum, ram: tool.ram,
            serverIP: gameState.isConnected ? gameState.currentIP : null,
            isTestMode, status: 'hacking', progress: 0, portObj, resultMessage: '',
            animatedElapsed: 0, isStalled: false, stallSchedule: [], accumulatedStall: 0, currentStall: null,
            startedAt: Date.now(),
            durationMs: computedDuration,
            soundState: {
                lastMilestone: -1,
                lastTickBucket: -1,
                stallSoundLastAt: 0,
                wasStalled: false,
                completePlayed: false
            }
        };

        if (tool.name === 'sql_crack.exe') {
            const sqlData = createSqlScript(SQL_CANVAS_W, SQL_CANVAS_H);
            proc.sqlScript = sqlData.script;
            proc.sqlGroups = sqlData.groups;
            proc.sqlDuration = computedDuration;
            proc.sqlStartTime = Date.now();
        }
        if (tool.name === 'ssh_crack.exe') {
            proc.sshOrbs = createSshOrbs(SSH_CANVAS_W, SSH_CANVAS_H);
            proc.sshDuration = computedDuration;
            proc.sshStartTime = Date.now();
        }
        if (tool.name === 'http_crack.exe') {
            proc.httpTree = createHttpTree(HTTP_CANVAS_W, HTTP_CANVAS_H);
            proc.httpDuration = computedDuration;
            proc.httpStartTime = Date.now();
        }
        if (tool.name === 'ftp_crack.exe') {
            proc.ftpData = createFtpData(FTP_CANVAS_W, FTP_CANVAS_H);
            proc.ftpDuration = computedDuration;
            proc.ftpStartTime = Date.now();
            proc.ftpFlashUntil = 0;
        }
        if (tool.name === 'smtp_crack.exe') {
            proc.smtpData = createSmtpData();
            proc.smtpDuration = computedDuration;
            proc.smtpStartTime = Date.now();
        }
        if (tool.name === 'telnet_crack.exe') {
            proc.telnetData = createTelnetData();
            proc.telnetDuration = computedDuration;
            proc.telnetStartTime = Date.now();
        }
        if (tool.name === 'dns_crack.exe') {
            proc.dnsData = createDnsData();
            proc.dnsDuration = computedDuration;
            proc.dnsStartTime = Date.now();
        }

        if (!isTestMode && !tool.name.includes('scan')) {
            const numStalls = 1 + Math.floor(Math.random() * 2);
            const baseDur = computedDuration;
            const stallMin = Math.max(800, Math.round(baseDur * 0.10));
            const stallMax = Math.max(stallMin + 400, Math.round(baseDur * 0.25));

            const used = [];
            for (let i = 0; i < numStalls; i++) {
                let at;
                if (i === 0) at = 0.2 + Math.random() * 0.15;
                else at = 0.5 + Math.random() * 0.2;
                if (used.some(u => Math.abs(u - at) < 0.1)) at += 0.15;
                used.push(at);
                const dur = stallMin + Math.random() * (stallMax - stallMin);
                proc.stallSchedule.push({ at, duration: Math.round(dur), triggered: false });
            }
        }

        gameState.runningProcesses.push(proc);
        currentProcessPage = gameState.runningProcesses.length - 1;
        lastProcessSignature = '__force__';
        updateUI();
        animateToolProgress(proc, tool, portObj, portNum, isTestMode, 0);
        return true;
    } catch (err) {
        console.error('[launchTool] EXCEPCIÓN:', err);
        output.innerHTML += `<div class="msg-box"><span class="text-error">[ERROR INTERNO] ${err.message}</span></div>`;
        output.scrollTop = output.scrollHeight;
        return false;
    }
}

async function animateToolProgress(proc, tool, portObj, portNum, isTestMode, initialElapsed = 0) {
    try {
        const durationMs = proc.durationMs || getToolDuration(tool.name, isTestMode, portObj, tool);

        const startTime = Date.now() - initialElapsed;
        const isSql    = tool.name === 'sql_crack.exe'    && proc.sqlScript;
        const isSsh    = tool.name === 'ssh_crack.exe'    && proc.sshOrbs;
        const isHttp   = tool.name === 'http_crack.exe'   && proc.httpTree;
        const isFtp    = tool.name === 'ftp_crack.exe'    && proc.ftpData;
        const isSmtp   = tool.name === 'smtp_crack.exe'   && proc.smtpData;
        const isTelnet = tool.name === 'telnet_crack.exe' && proc.telnetData;
        const isDns    = tool.name === 'dns_crack.exe'    && proc.dnsData;

        await new Promise(resolve => {
            function frame() {
                try {
                    const now = Date.now();
                    if (gameState.isGameOver) { resolve(); return; }
                    const cur = gameState.runningProcesses.find(p => p.id === proc.id);
                    if (!cur) { resolve(); return; }

                    if (cur.currentStall) {
                        if (now - cur.currentStall.startedAt >= cur.currentStall.duration) {
                            cur.accumulatedStall += (now - cur.currentStall.startedAt);
                            cur.currentStall = null;
                            cur.isStalled = false;
                        } else cur.isStalled = true;
                    } else {
                        const rawElapsed = now - startTime - cur.accumulatedStall;
                        const rawProgress = rawElapsed / durationMs;
                        for (const s of cur.stallSchedule) {
                            if (!s.triggered && rawProgress >= s.at) {
                                s.triggered = true;
                                cur.currentStall = { startedAt: now, duration: s.duration };
                                cur.isStalled = true;
                                break;
                            }
                        }
                    }

                    let effectiveElapsed = now - startTime - cur.accumulatedStall;
                    if (cur.currentStall) effectiveElapsed -= (now - cur.currentStall.startedAt);
                    effectiveElapsed = Math.max(0, effectiveElapsed);
                    cur.animatedElapsed = effectiveElapsed;

                    const progress = Math.min(100, (effectiveElapsed / durationMs) * 100);
                    cur.progress = Math.floor(progress);

                    const bar = document.getElementById('proc-bar-' + proc.id);
                    if (bar) {
                        bar.style.width = progress + '%';
                        if (cur.isStalled) bar.classList.add('stalled'); else bar.classList.remove('stalled');
                    }
                    const card = document.getElementById('proccard-' + proc.id);
                    if (card) {
                        if (cur.isStalled) card.classList.add('stalled'); else card.classList.remove('stalled');
                    }
                    updateProcessStatusUI(cur);

                    try {
                        if (isSql)    drawSqlAnimation(cur, now);
                        if (isSsh)    drawSshAnimation(cur, now);
                        if (isHttp)   drawHttpAnimation(cur, now);
                        if (isFtp)    drawFtpAnimation(cur, now);
                        if (isSmtp)   drawSmtpAnimation(cur, now);
                        if (isTelnet) drawTelnetAnimation(cur, now);
                        if (isDns)    drawDnsAnimation(cur, now);
                    } catch (drawErr) {
                        console.error('[animate] Error en dibujo:', drawErr);
                    }

                    updateAnimSound(cur, tool.name, progress / 100, now);

                    if (progress < 100) requestAnimationFrame(frame); else resolve();
                } catch (frameErr) {
                    console.error('[animate] Error en frame:', frameErr);
                    resolve();
                }
            }
            requestAnimationFrame(frame);
        });

        const currentProc = gameState.runningProcesses.find(p => p.id === proc.id);
        if (!currentProc) return;

        currentProc.finishedAt = Date.now();

        if (isTestMode) {
            currentProc.status = 'active';
            currentProc.resultMessage = 'Sin objetivo';
            updateProcessStatusUI(currentProc);
            setTimeout(() => {
                const idx = gameState.runningProcesses.findIndex(p => p.id === proc.id);
                if (idx >= 0) {
                    gameState.runningProcesses.splice(idx, 1);
                    if (currentProcessPage >= gameState.runningProcesses.length) currentProcessPage = Math.max(0, gameState.runningProcesses.length - 1);
                    lastProcessSignature = '__force__';
                    updateUI();
                }
            }, 2500);
        } else if (portObj) {
            if (parseFloat(tool.v) < parseFloat(portObj.v)) {
                currentProc.status = 'failed';
                currentProc.resultMessage = `Falló: v${tool.v} < v${portObj.v}`;
                soundError();
                updateProcessStatusUI(currentProc);
                setTimeout(() => {
                    const idx = gameState.runningProcesses.findIndex(p => p.id === proc.id);
                    if (idx >= 0) {
                        gameState.runningProcesses.splice(idx, 1);
                        if (currentProcessPage >= gameState.runningProcesses.length) currentProcessPage = Math.max(0, gameState.runningProcesses.length - 1);
                        lastProcessSignature = '__force__';
                        updateUI();
                    }
                }, 3000);
            } else {
                portObj.state = 'open';
                currentProc.status = 'active';
                currentProc.resultMessage = `Puerto ${portNum} abierto`;
                soundSuccess();
                updateProcessStatusUI(currentProc);
                setTimeout(() => {
                    const idx = gameState.runningProcesses.findIndex(p => p.id === proc.id);
                    if (idx >= 0) {
                        gameState.runningProcesses.splice(idx, 1);
                        if (currentProcessPage >= gameState.runningProcesses.length) currentProcessPage = Math.max(0, gameState.runningProcesses.length - 1);
                        lastProcessSignature = '__force__';
                        updateUI();
                    }
                }, 2000);
            }
        }
        output.scrollTop = output.scrollHeight;
        updateUI();
    } catch (err) {
        console.error('[animateToolProgress] EXCEPCIÓN:', err);
    }
}

function checkDownloadTrigger() {
    const server = gameState.currentServer;
    if (!server) return;
    if (server.quickTraceTriggered) return;

    server.downloadsDuringSession = (server.downloadsDuringSession || 0) + 1;

    if (!server.hasTrace) return;

    if (server.securityLevel >= 0.55 && server.downloadsDuringSession >= 2) {
        const chance = Math.min(0.7, (server.downloadsDuringSession - 1) * 0.3);
        if (Math.random() < chance) {
            triggerQuickTrace(server);
        }
    }
}
// ============================================================
// RM — proceso visible por archivo borrado
// ============================================================
// Un proceso por archivo (secuencial). Cada uno:
//   - Agrega un proceso a la lista
//   - Anima drawRmAnimation durante durationMs
//   - Devuelve una promesa que resuelve cuando termina
function launchRmProcess(fileInfo, durationMs) {
    return new Promise(resolve => {
        const procId = 'rm_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const proc = {
            id: procId,
            toolName: 'rm',
            isRm: true,
            status: 'hacking',
            progress: 0,
            ram: 0,
            serverIP: fileInfo.isRemote ? (gameState.currentIP || 'remote') : 'local',
            fileName: fileInfo.name,
            fileSizeKB: fileInfo.size || 1,
            isRemote: !!fileInfo.isRemote,
            animatedElapsed: 0,
            startedAt: Date.now(),
            durationMs: durationMs,
            resultMessage: ''
        };
        proc.rmData = createRmData(proc.fileName, proc.fileSizeKB);

        gameState.runningProcesses.push(proc);
        currentProcessPage = gameState.runningProcesses.length - 1;
        lastProcessSignature = '__force__';
        updateUI();

        const startTime = Date.now();

        function frame() {
            try {
                const now = Date.now();
                if (gameState.isGameOver) { resolve(); return; }
                const cur = gameState.runningProcesses.find(p => p.id === procId);
                if (!cur) { resolve(); return; }

                const elapsed = now - startTime;
                cur.animatedElapsed = elapsed;
                const progress = Math.min(100, (elapsed / durationMs) * 100);
                cur.progress = Math.floor(progress);

                const bar = document.getElementById('proc-bar-' + procId);
                if (bar) bar.style.width = progress + '%';
                updateProcessStatusUI(cur);

                try { drawRmAnimation(cur, now); } catch (e) { console.error('[rm draw]', e); }
                updateAnimSound(cur, 'rm', progress / 100, now);

                if (progress < 100) {
                    requestAnimationFrame(frame);
                } else {
                    cur.status = 'active';
                    cur.resultMessage = 'Eliminado';
                    updateProcessStatusUI(cur);
                    updateUI();

                    // Pequeña pausa para que se vea el "Eliminado"
                    setTimeout(() => {
                        const idx = gameState.runningProcesses.findIndex(p => p.id === procId);
                        if (idx >= 0) {
                            gameState.runningProcesses.splice(idx, 1);
                            if (currentProcessPage >= gameState.runningProcesses.length) {
                                currentProcessPage = Math.max(0, gameState.runningProcesses.length - 1);
                            }
                            lastProcessSignature = '__force__';
                            updateUI();
                        }
                        resolve();
                    }, 280);
                }
            } catch (err) {
                console.error('[launchRmProcess] Error:', err);
                resolve();
            }
        }
        requestAnimationFrame(frame);
    });
}