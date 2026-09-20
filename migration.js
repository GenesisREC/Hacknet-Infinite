// ============================================================
// MIGRACIÓN DE GUARDADOS ANTIGUOS
// ============================================================
// Cuando el jugador tiene un save de una versión anterior, le
// mostramos un overlay explicando la situación. Puede:
//   - Migrar (preserva cuentas, herramientas, pines, nombre)
//   - Empezar de cero (borra el save viejo)
// En ningún caso se borra el save sin consentimiento explícito.

let pendingMigrationSave = null;
let pendingMigrationKey  = null;
let pendingMigrationVersion = 0;

// ------------------------------------------------------------
// EXTRACCIÓN DE LO PRESERVABLE
// ------------------------------------------------------------
function extractPreservables(oldSave) {
    const out = {
        identity: null,
        accounts: { gomail: null, hacknet: null, market: null, gomailLinked: false, hacknetLinked: false },
        tools: null,
        money: 0,
        hardware: null,
        maxRam: 1.2,
        ramUpgradeLevel: 0,
        pinnedServers: [],
        wallbreakerObtained: false
    };

    if (!oldSave || typeof oldSave !== 'object') return out;

    // Identidad
    if (oldSave.localUser) {
        out.identity = {
            user: String(oldSave.localUser),
            pass: oldSave.localPass ? String(oldSave.localPass) : '1234'
        };
    }

    // Cuentas
    if (oldSave.gomailAccount && oldSave.gomailAccount.username)
        out.accounts.gomail = { username: oldSave.gomailAccount.username, password: oldSave.gomailAccount.password };
    if (oldSave.missionAccount && oldSave.missionAccount.username)
        out.accounts.hacknet = { username: oldSave.missionAccount.username, password: oldSave.missionAccount.password };
    if (oldSave.marketAccount && oldSave.marketAccount.username)
        out.accounts.market = { username: oldSave.marketAccount.username, password: oldSave.marketAccount.password };
    out.accounts.gomailLinked   = !!oldSave.gomailLinked;
    out.accounts.hacknetLinked  = !!(oldSave.missionAccount && oldSave.gomailLinked);

    // Herramientas (solo nombre + versión → el resto se reconstruye)
    if (Array.isArray(oldSave.tools)) {
        out.tools = oldSave.tools
            .filter(t => t && typeof t.name === 'string' && typeof t.v === 'number')
            .map(t => ({ name: t.name, v: t.v }));
    }

    // Dinero
    if (typeof oldSave.money === 'number') out.money = oldSave.money;

    // Hardware (solo niveles)
    if (oldSave.hardware) {
        out.hardware = {
            cpu:     { level: (oldSave.hardware.cpu && oldSave.hardware.cpu.level) || 0 },
            antenna: { level: (oldSave.hardware.antenna && oldSave.hardware.antenna.level) || 0 }
        };
    }
    if (typeof oldSave.maxRam === 'number') out.maxRam = oldSave.maxRam;
    if (typeof oldSave.ramUpgradeLevel === 'number') out.ramUpgradeLevel = oldSave.ramUpgradeLevel;

    // Servidores fijados (solo metadata, no el fs completo)
    if (Array.isArray(oldSave.servers)) {
        oldSave.servers.forEach(s => {
            if (s && s.pinned && typeof s.ip === 'string') {
                out.pinnedServers.push({
                    ip: s.ip,
                    name: s.name || 'Servidor fijado',
                    tier: typeof s.tier === 'number' ? s.tier : 1,
                    profile: s.profile || 'mixed',
                    profileLabel: s.profileLabel || 'Servidor',
                    netIndex: typeof s.netIndex === 'number' ? s.netIndex : undefined
                });
            }
        });
    }

    if (oldSave.wallbreakerObtained) out.wallbreakerObtained = true;

    return out;
}

// ------------------------------------------------------------
// OVERLAY
// ------------------------------------------------------------
function showMigrationOverlay(oldSave, oldVersion, oldKey) {
    pendingMigrationSave    = oldSave;
    pendingMigrationKey     = oldKey;
    pendingMigrationVersion = oldVersion;

    const overlay = document.getElementById('migration-overlay');
    if (!overlay) return;

    const info = SAVE_VERSION_INFO[SAVE_VERSION] || { release: 'v' + SAVE_VERSION };
    const p = extractPreservables(oldSave);

    // Cabecera
    document.getElementById('migration-version-info').textContent =
        `Guardado v${oldVersion} → v${SAVE_VERSION}  (${info.release})`;

    // Lista de preservables
    const items = [];
    if (p.identity) items.push(`Usuario: <b>${p.identity.user}</b>`);
    if (p.accounts.gomail) items.push(`GoMail: <b>${p.accounts.gomail.username}@gomail.com</b>`);
    if (p.accounts.hacknet) items.push(`HackNet: <b>${p.accounts.hacknet.username}</b>`);
    if (p.accounts.market) items.push(`InfoMarket: <b>${p.accounts.market.username}</b>`);
    if (p.tools && p.tools.length) {
        const tl = p.tools.map(t => `${t.name} v${t.v.toFixed(1)}`).join(', ');
        items.push(`Herramientas: <b>${tl}</b>`);
    }
    if (p.money > 0) items.push(`Créditos: <b>${p.money.toLocaleString()} CR</b>`);
    if (p.hardware && (p.hardware.cpu.level > 0 || p.hardware.antenna.level > 0)) {
        items.push(`Hardware: CPU nv ${p.hardware.cpu.level}, Antena nv ${p.hardware.antenna.level}`);
    }
    if (p.pinnedServers.length > 0) {
        items.push(`${p.pinnedServers.length} servidor(es) fijado(s) en NetMap`);
    }
    if (p.wallbreakerObtained) items.push('wallbreaker.exe desbloqueado');

    const listEl = document.getElementById('migration-preserve-list');
    if (items.length === 0) {
        listEl.innerHTML = '<div class="migration-empty">No se detectó nada para preservar.</div>';
    } else {
        listEl.innerHTML = '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
    }

    // Lista de pérdidas (regeneración procedural)
    const lost = [
        'Servidores descubiertos (se regeneran)',
        'Archivos descargados en /download',
        'Misiones activas y completadas',
        'Bandeja de entrada de GoMail',
        'Rastreo o quick-trace pendiente'
    ];
    document.getElementById('migration-lost-list').innerHTML =
        '<ul>' + lost.map(i => `<li>${i}</li>`).join('') + '</ul>';

    overlay.style.display = 'flex';
}

function confirmMigration() {
    if (!pendingMigrationSave) return;
    applyMigratedSave(pendingMigrationSave);
    cleanupMigration();
}

function declineMigration() {
    if (!pendingMigrationSave) return;
    // El jugador acepta perder todo → borramos
    try {
        if (pendingMigrationKey) localStorage.removeItem(pendingMigrationKey);
        SAVE_KEY_LEGACY.forEach(k => localStorage.removeItem(k));
    } catch(e) {}
    cleanupMigration();
    if (typeof showPowerAndBoot === 'function') {
        showPowerAndBoot(() => startSetup());
    } else {
        startSetup();
    }
}

function cleanupMigration() {
    pendingMigrationSave = null;
    pendingMigrationKey  = null;
    pendingMigrationVersion = 0;
    const overlay = document.getElementById('migration-overlay');
    if (overlay) overlay.style.display = 'none';
}

// ------------------------------------------------------------
// APLICAR MIGRACIÓN
// ------------------------------------------------------------
function applyMigratedSave(oldSave) {
    const p = extractPreservables(oldSave);

    // 1) Identidad
    gameState.localUser = p.identity ? p.identity.user : 'user';
    gameState.localPass = p.identity ? p.identity.pass : '1234';
    gameState.setupComplete = true;

    // 2) Cuentas
    gameState.gomailAccount   = p.accounts.gomail;
    gameState.gomailLinked    = p.accounts.gomailLinked && !!p.accounts.gomail;
    gameState.missionAccount  = p.accounts.hacknet;
    gameState.marketAccount   = p.accounts.market;
    gameState.gomailInbox     = [];
    gameState.marketSession   = false;
    gameState.hacknetSession  = false;
    gameState.gomailSession   = false;

    // 3) Progreso
    gameState.money          = p.money;
    gameState.maxRam         = p.maxRam;
    gameState.ramUpgradeLevel = p.ramUpgradeLevel;
    gameState.wallbreakerObtained = p.wallbreakerObtained;

    // 4) Hardware
    gameState.hardware = {
        cpu:     { level: 0, mult: 1.0,  label: 'Base Dual-Core 2.4GHz' },
        antenna: { level: 0, range: 1.0, label: 'Antena integrada' }
    };
    if (p.hardware) {
        gameState.hardware.cpu.level     = p.hardware.cpu.level;
        gameState.hardware.antenna.level = p.hardware.antenna.level;
    }
    applyHardwareToState();

    // 5) Herramientas: base + las preservadas (con sus versiones)
    gameState.tools = [
        { name: 'ssh_crack.exe',  v: 1.0, ram: 1.0, service: 'SSH' },
        { name: 'sql_crack.exe',  v: 1.0, ram: 0.9, service: 'SQL' },
        { name: 'http_crack.exe', v: 1.0, ram: 0.8, service: 'HTTP' }
    ];
    if (p.tools) {
        p.tools.forEach(oldt => {
            const template = TOOL_TEMPLATES[oldt.name];
            if (!template || template.isApp) return;
            const existing = gameState.tools.find(t => t.name === oldt.name);
            if (existing) {
                if (oldt.v > existing.v) existing.v = oldt.v;
            } else {
                gameState.tools.push({
                    name: oldt.name,
                    v: oldt.v,
                    ram: template.ram,
                    service: template.service
                });
            }
        });
    }

    // 6) Reset de FS / red / estado transitorio
    localFS = buildInitialLocalFS();
    remoteFS = {};
    localCWD = '/home/user';
    remoteCWD = '/home/user';

    gameState.isConnected      = false;
    gameState.currentIP        = null;
    gameState.currentServer    = null;
    gameState.isAuthenticated  = false;
    gameState.netmapOpen       = false;
    gameState.netmapCamX       = 0;
    gameState.netmapCamY       = 0;
    gameState.runningProcesses = [];
    gameState.hackedServers    = [];
    gameState.missionsAvailable = [];
    gameState.missionsActive    = [];
    gameState.missionsCompleted = [];
    gameState.scanning          = false;
    gameState.isGameOver        = false;
    gameState.gamePhase         = 'normal';
    gameState.inMarket          = false;
    gameState.inHacknet         = false;
    gameState.inGomail          = false;
    gameState.inNews            = false;
    gameState.traceInterval     = null;
    gameState.traceTime         = 0;

    // 7) /bin con las herramientas + wallbreaker si corresponde
    const binDir = localFS['/bin'];
    if (binDir) {
        gameState.tools.forEach(t => {
            if (!binDir.children.includes(t.name)) binDir.children.push(t.name);
            localFS['/bin/' + t.name] = makeExe(t.name, t.v);
        });
        if (gameState.wallbreakerObtained) {
            if (!binDir.children.includes('wallbreaker.exe')) binDir.children.push('wallbreaker.exe');
            localFS['/bin/wallbreaker.exe'] = makeExe('wallbreaker.exe', 1.0);
        }
    }

    // 8) Red nueva
    generateNetwork();

    // 9) Re-aplicar pines por IP
    p.pinnedServers.forEach(pin => {
        const existing = gameState.servers.find(s => s.ip === pin.ip);
        if (existing) {
            existing.pinned = true;
            existing.discovered = true;
        } else {
            const tier = Math.max(0, Math.min(PLAYER_TIERS.length - 1, pin.tier || 1));
            const srv = createServerObject(pin.ip, gameState.servers.length, tier);
            srv.pinned = true;
            srv.discovered = true;
            gameState.servers.push(srv);
        }
    });
    gameState.lastKnownTier = getPlayerTier();

    // 10) Log y UI ANTES de guardar (para que se vea en pantalla aunque
    //     el guardado falle por quota, etc.)
    output.innerHTML = '';
    output.innerHTML +=
        `<div class="msg-box" style="border-color:#00ff88;">` +
            `<div style="color:#00ff88; font-weight:bold;">[✓] Guardado migrado a v${SAVE_VERSION}</div>` +
            `<div style="color:#ffcc00; margin-top:6px;">Se preservaron tus cuentas, herramientas, créditos y pines.</div>` +
            `<div class="text-muted" style="margin-top:6px;">La red fue regenerada. Podés volver a hackear con tu equipo intacto.</div>` +
        `</div>`;

    // 11) Persistir PRIMERO el save nuevo (formato v4)
    //     Si esto falla, las claves viejas siguen ahí y el jugador no pierde nada.
    saveGame();

    // 12) Ahora sí: limpiar claves viejas, pero SOLO si el save actual
    //     quedó guardado con el formato nuevo. Si por algún motivo
    //     SAVE_KEY sigue con formato viejo, no lo borramos para no perder todo.
    try {
        SAVE_KEY_LEGACY.forEach(k => localStorage.removeItem(k));

        const currentRaw = localStorage.getItem(SAVE_KEY);
        if (currentRaw) {
            try {
                const currentSave = JSON.parse(currentRaw);
                if (!currentSave || currentSave.version !== SAVE_VERSION) {
                    // El save "nuevo" no quedó con la versión esperada.
                    // No borramos nada para no dejar al jugador sin partida.
                    console.warn('[migration] SAVE_KEY no quedó en v' + SAVE_VERSION + ', se conserva por seguridad.');
                }
            } catch (e) {
                console.warn('[migration] SAVE_KEY no es JSON válido tras el guardado, se conserva.');
            }
        }
    } catch(e) {
        console.warn('[migration] Error limpiando claves viejas:', e);
    }

    // 13) Mostrar HUD
    document.querySelector('.top-bar').style.display = '';
    document.querySelector('.main-content').style.display = '';
    if (typeof _revealHUD === 'function') {
        _revealHUD(true);
    } else {
        document.body.classList.remove('booting', 'boot-topbar', 'boot-right', 'boot-center');
        document.body.classList.add('ui-visible');
    }

    input.disabled = false;
    input.focus();
}