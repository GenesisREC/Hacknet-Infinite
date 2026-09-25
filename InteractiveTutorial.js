// ============================================================
// INTERACTIVE TUTORIAL — Guía paso a paso (HELP.exe como app)
// ============================================================
// Se abre con el comando "run HELP.exe". Se muestra como sección
// en el panel derecho (igual que NetMap/wallbreaker). No consume
// RAM. Se cierra con "rm HELP.exe" (definitivo) o con [X] (pausa).
// ============================================================

const IT_STEPS = [

    { id: 'welcome',
      title: 'Bienvenido, operador',
      body: 'Soy tu guía. Te voy a llevar paso a paso por tu primer hackeo completo: desde abrir el mapa hasta vender lo que robaste. Al terminar, vas a poder jugar solo.',
      hint: null, hintText: 'Si ya sabés lo que hacés, podés cerrar este panel con el botón [X].',
      waitForButton: true, buttonLabel: '▸ EMPEZAR' },

    { id: 'intro_explorer',
      title: 'Truco · Si te perdés, hay un explorador',
      body: 'Hacknet se juega escribiendo comandos, pero si en algún momento te mareás con tanto texto, tenés una herramienta de apoyo: el explorador visual. Se abre con "explorer" (o su atajo "ex"), se muestra arriba de la terminal, y te deja navegar carpetas y archivos con clicks. No reemplaza a los comandos, solo es una ayuda. Después del tutorial podés probarlo cuando quieras.',
      hint: null,
      hintText: 'No es obligatorio. Lo menciono para que sepas que existe.',
      waitForButton: true,
      buttonLabel: '▸ ENTENDIDO' },

    { id: 'netmap_open',
      title: 'Paso 1 · Abrí el NetMap',
      body: 'El NetMap es tu mapa de la red. Ahí aparecen los servidores que vas descubriendo. Escribí el comando y apretá ENTER.',
      hint: 'netmap',
      hintText: 'Tip: apretá USAR y se completa solo en la terminal.',
      check: () => gameState.netmapOpen === true },

    { id: 'netmap_scan',
      title: 'Paso 2 · Escaneá la red',
      body: 'Para descubrir servidores, escaneá. Vas a ver una lupa recorriendo el mapa. Cada círculo nuevo es un server.',
      hint: 'netmap scan',
      hintText: 'El escaneo tarda unos segundos y consume RAM.',
      check: () => !gameState.scanning &&
                   gameState.servers.filter(s => s.discovered && !s.isProbeServer).length >= 3 },

    { id: 'connect_probe',
      title: 'Paso 3 · Conectate a probe.com',
      body: 'probe.com es un servidor de entrenamiento. Ahí podés practicar sin riesgo de rastreo ni firewall. Conectate.',
      hint: 'connect probe.com',
      hintText: 'Se va a abrir una ventana con la info del server.',
      check: () => gameState.isConnected && gameState.currentServer && gameState.currentServer.isProbeServer },

    { id: 'open_terminal',
      title: 'Paso 4 · Abrí la terminal',
      body: 'Estás viendo la ventana de conexión. probe.com no requiere login, así que apretá el botón "ABRIR TERMINAL" que está abajo a la derecha.',
      hint: null,
      hintText: 'No hace falta escribir nada: solo apretá el botón.',
      check: () => !gameState.connectOverlayOpen &&
                   gameState.isConnected &&
                   gameState.currentServer &&
                   gameState.currentServer.isProbeServer },

    { id: 'probe',
      title: 'Paso 5 · Ver los puertos',
      body: 'Todo servidor tiene puertos (SSH, HTTP, SQL…). Cada uno está bloqueado y hay que abrirlo. Para ver los de este server, usá el comando probe.',
      hint: 'probe',
      hintText: 'Vas a ver una lista con el estado de cada puerto.',
      check: () => InteractiveTutorial.executedCommands.has('probe') },

    { id: 'run_cracker',
      title: 'Paso 6 · Corré el cracker SSH',
      body: 'Los crackers son programas que revientan puertos. Cada servicio tiene el suyo. ssh_crack.exe rompe el puerto 22 (SSH). Correlo.',
      hint: 'run ssh_crack.exe 22',
      hintText: 'Vas a ver una animación en el panel derecho mientras corre.',
      check: () => gameState.runningProcesses.some(p => p.toolName === 'ssh_crack.exe') ||
                   (gameState.currentServer &&
                    gameState.currentServer.ports.find(p => p.port === 22) &&
                    gameState.currentServer.ports.find(p => p.port === 22).state === 'open') },

    { id: 'wait_cracker',
      title: 'Paso 7 · Esperá a que termine',
      body: 'El cracker está trabajando. Mirá la barra de progreso del proceso. Cuando llegue al 100%, el puerto 22 va a quedar abierto.',
      hint: null, hintText: null,
      check: () => !gameState.runningProcesses.some(p => p.toolName === 'ssh_crack.exe') &&
                   gameState.currentServer &&
                   gameState.currentServer.ports.find(p => p.port === 22) &&
                   gameState.currentServer.ports.find(p => p.port === 22).state === 'open' },

    { id: 'porthack',
      title: 'Paso 8 · Abrí el túnel',
      body: 'Con el puerto abierto, ya podés acceder al server. Ejecutá porthack sobre los puertos abiertos para establecer el túnel inverso.',
      hint: 'porthack 22',
      hintText: 'Es el paso final para tener acceso.',
      check: () => gameState.runningProcesses.some(p => p.isPortHack) ||
                   (gameState.currentServer && gameState.currentServer.accessed === true) },

    { id: 'wait_porthack',
      title: 'Paso 9 · Esperá el túnel',
      body: 'Se está estableciendo el túnel. Es una animación linda la de porthack. Unos segundos y estás dentro.',
      hint: null, hintText: null,
      check: () => gameState.currentServer && gameState.currentServer.accessed === true },

    { id: 'ls',
      title: 'Paso 10 · Listá archivos',
      body: 'Ya estás dentro del server. Ahora mirá qué hay en la carpeta actual con el comando ls.',
      hint: 'ls',
      hintText: 'Vas a ver archivos con colores según su tipo.',
      check: () => InteractiveTutorial.executedCommands.has('ls') },

    { id: 'cat',
      title: 'Paso 11 · Leé un archivo',
      body: 'Antes de bajarte algo, podés leerlo para ver qué contiene. Probá con un archivo .txt chico usando cat.',
      hint: 'cat notas.txt',
      hintText: 'También podés probar con otros archivos de la lista.',
      check: () => InteractiveTutorial.executedCommands.has('cat') },

    { id: 'scp',
      title: 'Paso 12 · Descargá un archivo',
      body: 'Para bajarte un archivo, usá scp. Va a parar a /download (o a /bin si es un .exe). Bajate alguno de los que viste.',
      hint: 'scp notas.txt',
      hintText: 'Después vas a poder venderlo en el mercado.',
      check: () => gameState.runningProcesses.some(p => p.isDownload) ||
                   (localFS['/download'] && localFS['/download'].children.length > 0) },

    { id: 'wait_scp',
      title: 'Paso 13 · Esperá la descarga',
      body: 'Mientras baja, mirá la animación de transferencia. Ya casi.',
      hint: null, hintText: null,
      check: () => !gameState.runningProcesses.some(p => p.isDownload) &&
                   localFS['/download'] && localFS['/download'].children.length > 0 },

    // ---------- INTRO A LOS ZIP ----------
    { id: 'unzip_intro',
      title: 'Paso 14 · Los ZIP',
      body: 'Algunos archivos son ZIPs: paquetes comprimidos que contienen varios archivos adentro. Hay dos tipos. Los normales se abren con "unzip archivo.zip". Los protegidos piden la clave: "unzip archivo.zip laClave". Este server de práctica (que en realidad simula ser tu propia PC) tiene uno de cada uno en /home/user/Descargas.',
      hint: null,
      hintText: 'Tip: en /home/user/notas.txt está anotada la clave del ZIP protegido.',
      waitForButton: true,
      buttonLabel: '▸ ENTENDIDO' },

    { id: 'unzip_open',
      title: 'Paso 15 · Abrí el ZIP normal',
      body: 'Empecemos por el fácil. En Descargas tenés "mi_backup.zip", un ZIP sin contraseña. Corré unzip sobre él. Los archivos se van a extraer a una carpeta nueva con el mismo nombre del ZIP + "_extracted".',
      hint: 'unzip /home/user/Descargas/mi_backup.zip',
      hintText: 'Vas a ver una animación mientras se extrae. Después podés mirar el contenido con ls.',
      check: () => InteractiveTutorial.executedCommands.has('unzip:mi_backup.zip') },

    { id: 'unzip_protected',
      title: 'Paso 16 · Abrí el ZIP con contraseña',
      body: 'Ahora el protegido: "backup_privado.zip". Necesitás la clave. Está anotada en algún archivo de texto del server. Buscala, después corré unzip pasando la clave como segundo argumento.',
      hint: 'unzip /home/user/Descargas/backup_privado.zip r00t2024',
      hintText: 'La clave está en notas.txt. Si querés, primero leela con "cat /home/user/notas.txt".',
      check: () => InteractiveTutorial.executedCommands.has('unzip:backup_privado.zip') },

    // ---------- DESCONECTAR ----------
    { id: 'disconnect',
      title: 'Paso 17 · Desconectate',
      body: 'Siempre desconectate cuando termines con un server. Si tiene rastreo activo, cada segundo cuenta. Ahora mismo no hay rastreo, pero es buena costumbre.',
      hint: 'disconnect', hintText: null,
      check: () => gameState.isConnected === false },

    // ---------- INTRO GOMAIL ----------
    { id: 'intro_gomail',
      title: 'Paso 18 · Conocé GoMail',
      body: 'GoMail es un correo ficticio. Ahí te van a llegar mensajes importantes: contratos aceptados de HackNet, datos de misiones, recordatorios. Se accede con "connect gomail.com". La primera vez tenés que crear una cuenta.',
      hint: null,
      hintText: 'No entres ahora — te explico el resto primero.',
      waitForButton: true,
      buttonLabel: '▸ ENTENDIDO' },

    // ---------- INTRO HACKNET ----------
    { id: 'intro_hacknet',
      title: 'Paso 19 · Conocé HackNet',
      body: 'HackNet es el tablón de contratos. Ahí otros hackers publican trabajos: extraer archivos específicos de una IP, hackear servidores puntuales, operaciones silenciosas. Pagan en créditos y a veces sueltan crackers. Para usarlo tenés que crear una cuenta en GoMail y vincularla desde "connect hacknet.onion".',
      hint: null,
      hintText: 'Las misiones son la mejor fuente de crackers y plata.',
      waitForButton: true,
      buttonLabel: '▸ ENTENDIDO' },

    // ---------- INTRO MARKET ----------
    { id: 'intro_market',
      title: 'Paso 20 · Conocé el InfoMarket',
      body: 'El InfoMarket es el mercado negro. Ahí vendés los archivos que robás y comprás mejoras: más RAM para correr más crackers en paralelo, CPU más rápido para reducir tiempos, y antena con más rango para el NetMap. Se accede con "connect market.onion". Los archivos que bajás con scp van a la carpeta /download y desde ahí los vendés.',
      hint: null,
      hintText: 'Los archivos financieros pagan más que los personales. Los de basura casi no valen.',
      waitForButton: true,
      buttonLabel: '▸ ENTENDIDO' },

    // ---------- INTRO NEWS ----------
    { id: 'intro_news',
      title: 'Paso 21 · Conocé News.com',
      body: 'News.com es el portal de noticias. Ahí aparecen titulares generados por tus acciones en la red: filtraciones, ataques, hackeos silenciosos. Todo lo que hacés queda registrado públicamente (con el nombre del server, no el tuyo). Además, en la pestaña UPDATES se publican las actualizaciones de un juego popular de la actualidad. Entrá con "connect news.com" cuando quieras.',
      hint: null,
      hintText: 'No hace falta que entres ahora. Es solo para que sepas que existe.',
      waitForButton: true,
      buttonLabel: '▸ ENTENDIDO' },

        // ---------- SOSPECHA Y LIMPIEZA ----------
        { id: 'intro_suspicion',
      title: 'Paso 23 · Sospecha y limpieza legal',
      body: 'A medida que operás, tu nivel de sospecha sube. Tres cosas te delatan: desconectarte con un rastreo activo sin borrar el log, vender archivos cuya conexión quedó registrada, y completar contratos de HackNet. Si borrás el log ANTES de desconectarte o de vender, no sube nada.\n\nLa sospecha se muestra en News.com como una barra con tu nombre: BAJO PERFIL (verde), VIGILADO (amarillo), BUSCADO (naranja) e IDENTIFICADO (rojo). Si llega al 100%, entrás a un allanamiento y perdés.\n\nPara bajarla hay dos formas. Primero: el tiempo. Si estás desconectado y sin overlays abiertos, baja sola. Cuanto más alto el nivel, más lento el goteo (de 30s por punto a 2 minutos por punto). También baja si cerrás el juego y volvés después: hasta 40 puntos de golpe.\n\nSegundo: contratar un abogado. En HackNet, el comando "lawyer" te ofrece un servicio legal que limpia tu expediente. Reducís 50 puntos de un saque. El precio escala con tu sospecha: a 20% cuesta 17.000 CR, a 100% cuesta 45.000 CR. Aceptás con "lawyer confirm".\n\nRegla de oro: SIEMPRE borrá el log de conexión antes de desconectarte o de vender. Es gratis y es la mejor defensa.',
      hint: null,
      hintText: 'En resumen: no te ensucies, y si te ensuciás, pagá un abogado.',
      waitForButton: true,
      buttonLabel: '▸ ENTENDIDO' },

    // ---------- PASO FINAL: BORRAR HELP.exe ----------
    { id: 'rm_help',
      title: 'Paso final · Borrá el manual',
      body: 'Ya sabés lo básico: escanear, conectar, romper puertos, bajar archivos, descomprimir ZIPs, vender y a dónde ir para las misiones. Ahora borrá este manual. Está en /home/user/documentos/HELP.exe.',
      hint: 'rm /home/user/documentos/HELP.exe',
      hintText: 'También podés hacer "cd documentos" y después "rm HELP.exe". Al borrarlo, el tutorial termina definitivamente.',
      check: () => !localFS['/home/user/documentos/HELP.exe'] }
];

const IT_STATE_KEY = 'hacknet_tutorial_state_v1';
// ============================================================
// ESTADO
// ============================================================
const InteractiveTutorial = {
    active: false,
    panelVisible: false,
    currentStepIndex: 0,
    pollTimer: null,
    stepCounterEl: null,
    titleEl: null,
    bodyEl: null,
    hintEl: null,
    hintCodeEl: null,
    useBtn: null,
    hintTextEl: null,
    actionBtn: null,
    progressBarEl: null,
    overlayChoiceEl: null,
    executedCommands: new Set()
};

// ------------------------------------------------------------
// Persistencia — sobrevivir al F5
// ------------------------------------------------------------
function IT_SaveState() {
    if (!InteractiveTutorial || !InteractiveTutorial.active) return;
    try {
        const data = {
            active: true,
            currentStepIndex: InteractiveTutorial.currentStepIndex,
            executedCommands: Array.from(InteractiveTutorial.executedCommands || []),
            ts: Date.now()
        };
        localStorage.setItem(IT_STATE_KEY, JSON.stringify(data));
    } catch (e) {}
}

function IT_ClearState() {
    try { localStorage.removeItem(IT_STATE_KEY); } catch (e) {}
}

function IT_LoadState() {
    try {
        const raw = localStorage.getItem(IT_STATE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || !data.active) return null;
        // Estados viejos (>7 días) se descartan
        if (data.ts && (Date.now() - data.ts) > 7 * 24 * 60 * 60 * 1000) {
            IT_ClearState();
            return null;
        }
        return data;
    } catch (e) { return null; }
}

// ============================================================
// API PÚBLICA
// ============================================================
function InteractiveTutorialStart() {
    if (InteractiveTutorial.active && InteractiveTutorial.panelVisible) {
        output.innerHTML += `<span class="text-warning">HELP.exe ya está abierto.</span><br>`;
        output.scrollTop = output.scrollHeight;
        return;
    }

    if (!InteractiveTutorial.active) {
        InteractiveTutorial.active = true;
        InteractiveTutorial.currentStepIndex = 0;
        InteractiveTutorial.executedCommands = new Set();
    }

    IT_BuildContent();
    IT_ShowSection();
    IT_RenderStep();
    IT_StartPolling();
    IT_SaveState();

    try { if (typeof soundSuccess === 'function') soundSuccess(); } catch (e) {}
}

function InteractiveTutorialStop(reason) {
    if (!InteractiveTutorial.active) return;
    InteractiveTutorial.active = false;
    InteractiveTutorial.panelVisible = false;
    IT_StopPolling();
    IT_ClearState();

    const rp = document.querySelector('.right-panel');
    if (rp) {
        rp.classList.remove('tabs-active', 'tab-help', 'tab-processes');
    }

    try { if (typeof saveGame === 'function') saveGame(); } catch (e) {}

    if (reason === 'complete') {
        setTimeout(() => {
            try { if (typeof soundMissionComplete === 'function') soundMissionComplete(); } catch (e) {}
        }, 100);
    }
}

function closeHelpApp() {
    // Botón [X] del panel. Reinicia el tutorial desde cero y cierra la pestaña.
    InteractiveTutorial.panelVisible = false;
    InteractiveTutorial.active = false;
    InteractiveTutorial.currentStepIndex = 0;
    InteractiveTutorial.executedCommands = new Set();
    IT_StopPolling();
    IT_ClearState();

    // Quitar el sistema de tabs del panel derecho (NO tocar style.display
    // del #help-section: lo controla el CSS con la clase .tab-help)
    const rp = document.querySelector('.right-panel');
    if (rp) {
        rp.classList.remove('tabs-active', 'tab-help', 'tab-processes');
    }

    // Limpiar el contenido inyectado para que en la próxima apertura
    // se reconstruya desde cero
    const container = document.getElementById('help-content');
    if (container) {
        container.innerHTML = '';
        delete container.dataset.itBuilt;
    }
    InteractiveTutorial.titleEl = null;
    InteractiveTutorial.bodyEl = null;
    InteractiveTutorial.hintEl = null;
    InteractiveTutorial.hintCodeEl = null;
    InteractiveTutorial.useBtn = null;
    InteractiveTutorial.hintTextEl = null;
    InteractiveTutorial.actionBtn = null;
    InteractiveTutorial.progressBarEl = null;
    InteractiveTutorial.stepCounterEl = null;

    output.innerHTML += `<span class="text-muted">[HELP.exe] Manual cerrado. El tutorial se reiniciará desde el principio cuando lo abras de nuevo con </span><span class="text-cmd">run HELP.exe</span><span class="text-muted">.</span><br>`;
    output.scrollTop = output.scrollHeight;

    try { if (typeof saveGame === 'function') saveGame(); } catch (e) {}
}


function InteractiveTutorialOnCommand(action, args, rawCmd) {
    if (!InteractiveTutorial.active) return;

    InteractiveTutorial.executedCommands.add(action);
    if (action === 'run' && args && args[1]) {
        InteractiveTutorial.executedCommands.add('run:' + args[1]);
    }
    if (action === 'unzip' && args && args[1]) {
        // Normalizamos el path: nos quedamos con el nombre del archivo
        InteractiveTutorial.executedCommands.add('unzip:' + args[1].split('/').pop());
    }
    IT_CheckCurrentStep();
    IT_SaveState();
}

window.InteractiveTutorialStart = InteractiveTutorialStart;
window.InteractiveTutorialStop = InteractiveTutorialStop;
window.InteractiveTutorialIsActive = function() { return InteractiveTutorial.active; };
window.InteractiveTutorialOnCommand = InteractiveTutorialOnCommand;
window.closeHelpApp = closeHelpApp;

// ============================================================
// MODAL DE ELECCIÓN
// ============================================================
function InteractiveTutorialShowChoice() {
    if (InteractiveTutorial.overlayChoiceEl) return;

    const overlay = document.createElement('div');
    overlay.id = 'it-choice-modal';
    overlay.innerHTML =
        '<div class="it-choice-box">' +
            '<div class="it-choice-title">¿CÓMO QUERÉS EMPEZAR?</div>' +
            '<div class="it-choice-sub">Esta elección es solo para esta partida. Después podés cambiar de opinión reiniciando.</div>' +
            '<button class="it-choice-btn it-choice-guided" data-action="guided">' +
                '<div class="it-choice-btn-title">▸ TUTORIAL INTERACTIVO</div>' +
                '<div class="it-choice-btn-sub">Aprendé paso a paso tu primer hackeo completo</div>' +
            '</button>' +
            '<button class="it-choice-btn it-choice-expert" data-action="expert">' +
                '<div class="it-choice-btn-title">▸ MODO EXPERTO</div>' +
                '<div class="it-choice-btn-sub">Ya sé jugar, dejame arrancar</div>' +
            '</button>' +
        '</div>';

    document.body.appendChild(overlay);
    InteractiveTutorial.overlayChoiceEl = overlay;

    overlay.querySelector('[data-action="guided"]').addEventListener('click', () => {
        IT_CloseChoiceModal();
        setTimeout(() => {
            if (typeof handleCommand === 'function') {
                handleCommand('run HELP.exe');
            } else {
                InteractiveTutorialStart();
            }
        }, 200);
    });
    overlay.querySelector('[data-action="expert"]').addEventListener('click', () => {
        IT_CloseChoiceModal();
        if (typeof openTutorial === 'function') {
            setTimeout(() => openTutorial(), 300);
        }
    });
}

function IT_CloseChoiceModal() {
    if (InteractiveTutorial.overlayChoiceEl) {
        InteractiveTutorial.overlayChoiceEl.remove();
        InteractiveTutorial.overlayChoiceEl = null;
    }
}
window.InteractiveTutorialShowChoice = InteractiveTutorialShowChoice;

// ============================================================
// CONSTRUCCIÓN DEL CONTENIDO
// ============================================================
function IT_BuildContent() {
    const container = document.getElementById('help-content');
    if (!container) return;
    if (container.dataset.itBuilt === '1') return;

    container.innerHTML =
        '<div class="help-title" id="help-title"></div>' +
        '<div class="help-body" id="help-body"></div>' +
        '<div class="help-hint" id="help-hint" style="display:none;">' +
            '<span class="help-hint-symbol">$</span>' +
            '<code class="help-hint-code" id="help-hint-code"></code>' +
            '<button class="help-use" id="help-use-btn">USAR</button>' +
        '</div>' +
        '<div class="help-hint-text" id="help-hint-text"></div>' +
        '<button class="help-action" id="help-action-btn" style="display:none;"></button>' +
        '<div class="help-progress-wrap">' +
            '<div class="help-progress-bar" id="help-progress-bar"></div>' +
        '</div>';

    container.dataset.itBuilt = '1';

    InteractiveTutorial.titleEl        = container.querySelector('#help-title');
    InteractiveTutorial.bodyEl         = container.querySelector('#help-body');
    InteractiveTutorial.hintEl         = container.querySelector('#help-hint');
    InteractiveTutorial.hintCodeEl     = container.querySelector('#help-hint-code');
    InteractiveTutorial.useBtn         = container.querySelector('#help-use-btn');
    InteractiveTutorial.hintTextEl     = container.querySelector('#help-hint-text');
    InteractiveTutorial.actionBtn      = container.querySelector('#help-action-btn');
    InteractiveTutorial.progressBarEl  = container.querySelector('#help-progress-bar');
    InteractiveTutorial.stepCounterEl  = document.getElementById('help-step-counter');

    InteractiveTutorial.useBtn.addEventListener('click', IT_UseHintCommand);
    InteractiveTutorial.actionBtn.addEventListener('click', IT_CompleteStep);
}

function IT_ClearContent() {
    // No borra el contenido, solo suelta referencias. Se reusa si se reabre.
    return;
}

function IT_ShowSection() {
    const rp = document.querySelector('.right-panel');
    if (rp) rp.classList.add('tabs-active');
    InteractiveTutorial.panelVisible = true;
    switchRightPanelTab('help');
}

function IT_HideSection() {
    InteractiveTutorial.panelVisible = false;
}

function switchRightPanelTab(tab) {
    const rp = document.querySelector('.right-panel');
    if (!rp) return;

    rp.classList.remove('tab-help', 'tab-processes');
    rp.classList.add(tab === 'help' ? 'tab-help' : 'tab-processes');

    const helpBtn = document.getElementById('tab-help-btn');
    const procBtn = document.getElementById('tab-processes-btn');
    if (helpBtn) helpBtn.classList.toggle('active', tab === 'help');
    if (procBtn) procBtn.classList.toggle('active', tab === 'processes');
}
window.switchRightPanelTab = switchRightPanelTab;

// ============================================================
// RENDER DEL STEP
// ============================================================
function IT_RenderStep() {
    const step = IT_STEPS[InteractiveTutorial.currentStepIndex];
    if (!step) return;

    const total = IT_STEPS.length;
    const idx = InteractiveTutorial.currentStepIndex;

    if (InteractiveTutorial.stepCounterEl) {
        InteractiveTutorial.stepCounterEl.textContent = 'PASO ' + (idx + 1) + ' / ' + total;
    }
    if (InteractiveTutorial.titleEl) InteractiveTutorial.titleEl.textContent = step.title;
    if (InteractiveTutorial.bodyEl)  InteractiveTutorial.bodyEl.textContent  = step.body;

    if (step.hint) {
        if (InteractiveTutorial.hintEl) InteractiveTutorial.hintEl.style.display = 'flex';
        if (InteractiveTutorial.hintCodeEl) InteractiveTutorial.hintCodeEl.textContent = step.hint;
    } else {
        if (InteractiveTutorial.hintEl) InteractiveTutorial.hintEl.style.display = 'none';
    }

    if (step.hintText) {
        if (InteractiveTutorial.hintTextEl) {
            InteractiveTutorial.hintTextEl.style.display = 'block';
            InteractiveTutorial.hintTextEl.textContent = step.hintText;
        }
    } else {
        if (InteractiveTutorial.hintTextEl) InteractiveTutorial.hintTextEl.style.display = 'none';
    }

    if (step.waitForButton) {
        if (InteractiveTutorial.actionBtn) {
            InteractiveTutorial.actionBtn.style.display = 'block';
            InteractiveTutorial.actionBtn.textContent = step.buttonLabel || '▸ CONTINUAR';
        }
    } else {
        if (InteractiveTutorial.actionBtn) InteractiveTutorial.actionBtn.style.display = 'none';
    }

    if (InteractiveTutorial.progressBarEl) {
        InteractiveTutorial.progressBarEl.style.width = (((idx + 1) / total) * 100) + '%';
    }

    try { if (typeof playTracePip === 'function') playTracePip(); } catch (e) {}
}

// ============================================================
// AVANCE
// ============================================================
function IT_CompleteStep() {
    if (!InteractiveTutorial.active) return;
    InteractiveTutorial.currentStepIndex++;

    if (InteractiveTutorial.currentStepIndex >= IT_STEPS.length) {
        InteractiveTutorialStop('complete');
        return;
    }

    IT_RenderStep();
    IT_CheckCurrentStep();
    IT_SaveState();
}

// ============================================================
// POLLING
// ============================================================
function IT_StartPolling() {
    IT_StopPolling();
    InteractiveTutorial.pollTimer = setInterval(IT_CheckCurrentStep, 350);
}

function IT_StopPolling() {
    if (InteractiveTutorial.pollTimer) {
        clearInterval(InteractiveTutorial.pollTimer);
        InteractiveTutorial.pollTimer = null;
    }
}

function IT_CheckCurrentStep() {
    if (!InteractiveTutorial.active) return;
    const step = IT_STEPS[InteractiveTutorial.currentStepIndex];
    if (!step || typeof step.check !== 'function') return;

    let done = false;
    try { done = step.check() === true; } catch (e) { return; }

    if (done) {
        setTimeout(() => {
            if (!InteractiveTutorial.active) return;
            if (IT_STEPS[InteractiveTutorial.currentStepIndex] !== step) return;
            IT_CompleteStep();
        }, 400);
    }
}

// ============================================================
// BOTÓN USAR
// ============================================================
function IT_UseHintCommand() {
    const step = IT_STEPS[InteractiveTutorial.currentStepIndex];
    if (!step || !step.hint) return;
    const inputEl = document.getElementById('terminal-input');
    if (!inputEl || inputEl.disabled) return;
    inputEl.value = step.hint;
    inputEl.focus();
    setTimeout(() => {
        try { inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length); } catch (e) {}
    }, 0);
    try { if (typeof soundKeyClick === 'function') soundKeyClick(); } catch (e) {}
}
// ============================================================
// AUTO-RESUME — Reanudar tutorial tras un F5
// ============================================================
(function IT_AutoResumeOnLoad() {
    const saved = IT_LoadState();
    if (!saved) return;

    let attempts = 0;
    const maxAttempts = 40; // 20 segundos máximo esperando al setup

    function tryResume() {
        attempts++;

        // Esperar a que el setup esté completo y el FS exista
        if (typeof gameState === 'undefined' || !gameState.setupComplete) {
            if (attempts < maxAttempts) setTimeout(tryResume, 500);
            return;
        }

        // Si HELP.exe ya no está en el FS local, el tutorial se completó
        if (typeof localFS === 'undefined' ||
            !localFS['/home/user/documentos/HELP.exe']) {
            IT_ClearState();
            return;
        }

        // Reanudar el tutorial en el mismo paso
        InteractiveTutorial.active = true;
        InteractiveTutorial.currentStepIndex = saved.currentStepIndex || 0;
        InteractiveTutorial.executedCommands = new Set(saved.executedCommands || []);
        InteractiveTutorial.panelVisible = false;

        IT_BuildContent();
        IT_ShowSection();
        IT_RenderStep();
        IT_StartPolling();

        try {
            if (typeof output !== 'undefined') {
                output.innerHTML += `<span class="text-info">[HELP.exe] Retomando tutorial desde el paso ${InteractiveTutorial.currentStepIndex + 1}...</span><br>`;
                output.scrollTop = output.scrollHeight;
            }
        } catch (e) {}

        try { if (typeof soundSuccess === 'function') soundSuccess(); } catch (e) {}
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(tryResume, 800));
    } else {
        setTimeout(tryResume, 800);
    }
})();