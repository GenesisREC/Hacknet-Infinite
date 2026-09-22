// ============================================================
// UPDATE CHECKER — Detecta nuevas versiones en el servidor
// ============================================================
// Hace polling a version.json cada X minutos. Cuando detecta que
// la versión remota es distinta a la que está corriendo el cliente,
// muestra un toast "RECARGAR". El jugador decide cuándo.
//
// Persiste la versión descartada en localStorage para no volver a
// mostrar el mismo toast tras un reload (aunque NEWS_UPDATES no
// se haya actualizado).
//
// IMPORTANTE: cambiar UPDATE_CHECK_URL por la URL real de tu repo.
// ============================================================

const UPDATE_CHECK_URL = 'https://genesisrec.github.io/Hacknet-Infinite/version.json';
const UPDATE_CHECK_INTERVAL_MS = 3 * 60 * 1000;        // 3 minutos entre checks
const UPDATE_CHECK_VISIBILITY_MIN_MS = 60 * 1000;      // 1 min mínimo al volver a la pestaña
const UPDATE_CHECK_INITIAL_DELAY_MS = 30 * 1000;       // 30s después de arrancar

// Clave para recordar versiones ya descartadas por el jugador
const UPDATE_DISMISSED_KEY = 'hacknet_update_dismissed_version';

let _updateCheckTimer = null;
let _lastUpdateCheckAt = 0;
let _knownRemoteVersion = null;
let _updateToastShownForVersion = null;
let _updateCheckRunning = false;

// ------------------------------------------------------------
// Persistencia de versión descartada
// ------------------------------------------------------------
function getDismissedVersion() {
    try { return localStorage.getItem(UPDATE_DISMISSED_KEY); } catch(e) { return null; }
}
function setDismissedVersion(v) {
    try { localStorage.setItem(UPDATE_DISMISSED_KEY, v); } catch(e) {}
}
function clearDismissedVersion() {
    try { localStorage.removeItem(UPDATE_DISMISSED_KEY); } catch(e) {}
}

// ------------------------------------------------------------
// Detección de la versión local actual
// ------------------------------------------------------------
function getLocalRunningVersion() {
    // Si NEWS_UPDATES existe, la primera entrada es la versión local
    if (typeof NEWS_UPDATES !== 'undefined' && Array.isArray(NEWS_UPDATES) && NEWS_UPDATES.length > 0) {
        return NEWS_UPDATES[0].version || null;
    }
    return null;
}

// ------------------------------------------------------------
// Check principal
// ------------------------------------------------------------
async function checkForNewVersion(opts) {
    opts = opts || {};
    const force = !!opts.force;

    if (_updateCheckRunning) return;
    if (!force && Date.now() - _lastUpdateCheckAt < 30 * 1000) return;

    _updateCheckRunning = true;
    _lastUpdateCheckAt = Date.now();

    try {
        // Bypass de caché con query param + no-store
        const url = UPDATE_CHECK_URL + '?t=' + Date.now();
        const resp = await fetch(url, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });

        if (!resp.ok) {
            _updateCheckRunning = false;
            return;
        }

        const remote = await resp.json();
        if (!remote || !remote.version) {
            _updateCheckRunning = false;
            return;
        }

        _knownRemoteVersion = remote.version;
        const localVersion = getLocalRunningVersion();

        // Sin versión local → no podemos comparar, pero guardamos por si acaso
        if (!localVersion) {
            _updateCheckRunning = false;
            return;
        }

        // Comparación semántica: 1.9.2 > 1.9.1
        if (isVersionNewer(remote.version, localVersion)) {
            const dismissed = getDismissedVersion();

            // Solo mostrar si:
            //  - no lo mostramos ya en esta sesión
            //  - no fue descartado por el jugador antes
            if (_updateToastShownForVersion !== remote.version &&
                dismissed !== remote.version) {
                _updateToastShownForVersion = remote.version;
                showServerUpdateToast(remote);
            }
        } else {
            // Local alcanzó o superó a remota → limpiar dismissed
            // (por si en el futuro se publica una versión igual a la descartada)
            if (getDismissedVersion()) clearDismissedVersion();
        }

        _updateCheckRunning = false;
    } catch (e) {
        // Silencioso: si falla la red, no rompemos el juego
        _updateCheckRunning = false;
    }
}

// ------------------------------------------------------------
// Comparación semántica de versiones (1.9.2 > 1.9.1 > 1.9.0)
// ------------------------------------------------------------
function isVersionNewer(candidate, baseline) {
    if (!candidate || !baseline) return false;
    const cleanA = String(candidate).replace(/^v/i, '').trim();
    const cleanB = String(baseline).replace(/^v/i, '').trim();
    if (cleanA === cleanB) return false;

    const partsA = cleanA.split('.').map(n => parseInt(n, 10) || 0);
    const partsB = cleanB.split('.').map(n => parseInt(n, 10) || 0);

    const len = Math.max(partsA.length, partsB.length);
    for (let i = 0; i < len; i++) {
        const a = partsA[i] || 0;
        const b = partsB[i] || 0;
        if (a > b) return true;
        if (a < b) return false;
    }
    return false;
}

// ------------------------------------------------------------
// Toast de "nueva versión disponible"
// ------------------------------------------------------------
function showServerUpdateToast(remote) {
    // Evitar duplicados si ya hay uno en pantalla
    if (document.getElementById('server-update-toast')) return;

    const toast = document.createElement('div');
    toast.id = 'server-update-toast';
    toast.innerHTML =
        '<div class="sut-header">' +
            '<span class="sut-icon">◆</span>' +
            '<span class="sut-title">NUEVA VERSIÓN DISPONIBLE</span>' +
            '<button class="sut-close" id="sut-close-btn">[X]</button>' +
        '</div>' +
        '<div class="sut-body">' +
            '<div class="sut-version">' + (remote.release || remote.version) + '</div>' +
            '<div class="sut-desc">' + (remote.title || 'Hay cambios en el juego.') + '</div>' +
            '<div class="sut-hint">Recargá para aplicar la actualización.</div>' +
        '</div>' +
        '<button class="sut-reload" id="sut-reload-btn">▸ RECARGAR AHORA</button>';

    document.body.appendChild(toast);

    // Sonido de aviso
    try { if (typeof playTracePip === 'function') playTracePip(); } catch (e) {}

    // Listeners
    const closeBtn = toast.querySelector('#sut-close-btn');
    const reloadBtn = toast.querySelector('#sut-reload-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            // Marcar como descartada: no volver a molestar con esta versión
            setDismissedVersion(remote.version);
            toast.remove();
        });
    }

    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            // Marcar ANTES de recargar, para que tras el reload no vuelva a salir
            setDismissedVersion(remote.version);
            // Hard reload: bypass de caché
            try {
                // Método 1: query param único (funciona en todos los navegadores)
                const url = new URL(window.location.href);
                url.searchParams.set('_r', Date.now().toString(36));
                window.location.href = url.toString();
            } catch (e) {
                // Fallback
                window.location.reload();
            }
        });
    }
}

// ------------------------------------------------------------
// Arrancar / parar el checker
// ------------------------------------------------------------
function startUpdateChecker() {
    stopUpdateChecker();

    // Primer check con delay (no queremos saturar el arranque)
    setTimeout(() => {
        checkForNewVersion({ force: true });
    }, UPDATE_CHECK_INITIAL_DELAY_MS);

    // Check periódico
    _updateCheckTimer = setInterval(() => {
        checkForNewVersion();
    }, UPDATE_CHECK_INTERVAL_MS);

    // Check al volver a la pestaña (después de estar en background)
    document.addEventListener('visibilitychange', _onUpdateVisibilityChange);
}

function stopUpdateChecker() {
    if (_updateCheckTimer) {
        clearInterval(_updateCheckTimer);
        _updateCheckTimer = null;
    }
    document.removeEventListener('visibilitychange', _onUpdateVisibilityChange);
}

function _onUpdateVisibilityChange() {
    if (document.visibilityState === 'visible') {
        // Al volver a la pestaña, chequear si pasó suficiente tiempo
        if (Date.now() - _lastUpdateCheckAt > UPDATE_CHECK_VISIBILITY_MIN_MS) {
            checkForNewVersion();
        }
    }
}

// ------------------------------------------------------------
// Auto-arranque cuando el DOM está listo
// ------------------------------------------------------------
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Un delay extra para no competir con el boot
        setTimeout(startUpdateChecker, 5000);
    });
} else {
    setTimeout(startUpdateChecker, 5000);
}

// Exports para debug manual desde la consola
window.checkForNewVersion = checkForNewVersion;
window.startUpdateChecker = startUpdateChecker;
window.stopUpdateChecker = stopUpdateChecker;

// ------------------------------------------------------------
// Helpers de debug (opcional — desde la consola)
// ------------------------------------------------------------
//   clearDismissedVersion()  → vuelve a permitir el toast para la versión actual
//   getDismissedVersion()    → te dice qué versión está descartada
window.clearDismissedVersion = clearDismissedVersion;
window.getDismissedVersion = getDismissedVersion;