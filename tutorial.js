// ============================================================
// TUTORIAL — LIBRO INTERACTIVO
// ============================================================
const TUTORIAL_SEEN_KEY = 'hacknet_tutorial_seen_v1';

let tutorialCurrentSpread = 0;
let tutorialIsAnimating = false;
let tutorialPhase = 'idle';
let tutorialTimers = [];

function clearTutorialTimers() {
    tutorialTimers.forEach(t => clearTimeout(t));
    tutorialTimers = [];
}
function laterT(fn, delay) {
    const id = setTimeout(fn, delay);
    tutorialTimers.push(id);
    return id;
}

// ============================================================
// CONTENIDO DEL MANUAL
// ============================================================
const TUTORIAL_PAGES = [
    { type: 'content', html: `
        <div class="book-content">
            <h2>Bienvenido, operador</h2>
            <p>Hacknet Infinite es un juego de hackeo que se juega <b>escribiendo</b>. No hay botones ni personajes que mover: todo pasa en una pantalla negra con letras verdes.</p>
            <h3>Qué es una terminal</h3>
            <p>Una <b>terminal</b> es una ventana donde le das órdenes a la computadora escribiendo. En vez de hacer clic con el mouse, escribís lo que querés hacer y apretás <b>ENTER</b>.</p>
            <p>Por ejemplo: si querés ver qué archivos hay, escribís <code>ls</code> y apretás ENTER. La máquina te muestra la lista.</p>
            <div class="book-highlight"><b>Regla número uno:</b> cada vez que apretás ENTER, la computadora ejecuta lo que escribiste. Si está bien, funciona; si no, te tira un error. No pasa nada grave, podés volver a intentar.</div>
        </div>` },
    { type: 'content', html: `
        <div class="book-content">
            <h2>Cómo se controla</h2>
            <p>Abajo de la pantalla vas a ver una línea así:</p>
            <p class="book-prompt-demo">user@local:~$ _</p>
            <p>Eso se llama <b>prompt</b>. Te dice quién sos y dónde estás. Al lado hay un cursor titilando esperando que escribas. Ahí van los comandos.</p>
            <h3>Teclas útiles</h3>
            <ul>
                <li><b>ENTER</b> — ejecuta el comando que escribiste</li>
                <li><b>TAB</b> — autocompleta (escribí <code>con</code> y TAB = <code>connect</code>)</li>
                <li><b>↑ / ↓</b> — repite comandos que ya usaste</li>
                <li><b>F1</b> — abre este manual cuando quieras</li>
            </ul>
        </div>` },
    { type: 'content', html: `
        <div class="book-content">
            <h2>La pantalla del juego</h2>
            <p>La pantalla se divide en dos paneles:</p>
            <ul>
                <li><b>Izquierda:</b> la terminal. Acá escribís y ves los resultados.</li>
                <li><b>Derecha:</b> tu RAM, los procesos activos y el NetMap (mapa de la red).</li>
            </ul>
            <h3>Qué es la RAM</h3>
            <p>La RAM es la memoria de tu PC. Cada programa que corrés gasta un poco. Si se llena, no vas a poder correr más crackers al mismo tiempo. Podés comprar más RAM en el mercado.</p>
        </div>` },
    { type: 'content', html: `
        <div class="book-content">
            <h2>El ciclo del juego</h2>
            <p>Todo gira alrededor de cuatro pasos que vas a repetir siempre:</p>
            <div class="book-step"><b>1. Escanear la red.</b> Con <code>netmap scan</code> buscás servidores nuevos.</div>
            <div class="book-step"><b>2. Romper puertos.</b> Con <code>connect</code> entrás al server y corrés crackers contra los puertos cerrados.</div>
            <div class="book-step"><b>3. Entrar y robar.</b> Una vez adentro, con <code>scp</code> bajás lo que valga plata.</div>
            <div class="book-step"><b>4. Vender.</b> En <code>market.onion</code> vendés lo robado y comprás mejor equipo.</div>
            <div class="book-highlight">No hace falta que memorices nada. Escribí <code>help</code> cuando te olvides de un comando.</div>
        </div>` },
    { type: 'content', html: `
        <div class="book-content">
            <h2>Los primeros comandos</h2>
            <p>Estos son los más básicos. Empezá por <code>help</code> y <code>ls</code>.</p>
            <h3>Ayuda y navegación</h3>
            <ul>
                <li><code>help</code> — lista de todos los comandos</li>
                <li><code>clear</code> — limpia la pantalla</li>
                <li><code>ls</code> — muestra los archivos de la carpeta</li>
                <li><code>cd [carpeta]</code> — entra a una carpeta</li>
                <li><code>cd ..</code> — vuelve atrás</li>
                <li><code>cat [archivo]</code> — lee un archivo</li>
            </ul>
        </div>` },
    { type: 'content', html: `
        <div class="book-content">
            <h2>Comandos de red</h2>
            <ul>
                <li><code>netmap</code> — abre el mapa de la red</li>
                <li><code>netmap scan</code> — busca servidores nuevos</li>
                <li><code>connect [IP]</code> — te conecta a un server</li>
                <li><code>disconnect</code> — te desconecta (¡clave si hay rastreo!)</li>
                <li><code>probe</code> — muestra los puertos del server</li>
                <li><code>run [exe] [puerto]</code> — corre un cracker</li>
                <li><code>porthack [puertos]</code> — intenta entrar</li>
                <li><code>scp [archivo]</code> — baja un archivo</li>
            </ul>
        </div>` },
    { type: 'content', html: `
        <div class="book-content">
            <h2>Tu primer hackeo</h2>
            <p>El server de pruebas <code>probe.com</code> es para practicar sin riesgo. Pasos:</p>
            <div class="book-step"><b>1.</b> Abrí el mapa: <code>netmap</code></div>
            <div class="book-step"><b>2.</b> Escaneá: <code>netmap scan</code></div>
            <div class="book-step"><b>3.</b> Conectate: <code>connect probe.com</code></div>
            <div class="book-step"><b>4.</b> Mirá los puertos: <code>probe</code></div>
            <div class="book-step"><b>5.</b> Corré un cracker: <code>run ssh_crack.exe 22</code></div>
            <div class="book-step"><b>6.</b> Entrá con: <code>porthack 22</code></div>
        </div>` },
    { type: 'content', html: `
        <div class="book-content">
            <h2>Los crackers</h2>
            <p>Un <b>cracker</b> adivina la contraseña de un puerto. Cada servicio necesita el suyo:</p>
            <ul>
                <li><code>ssh_crack.exe</code> → SSH (22)</li>
                <li><code>http_crack.exe</code> → HTTP (80)</li>
                <li><code>sql_crack.exe</code> → SQL (1433)</li>
                <li><code>ftp_crack.exe</code> → FTP (21)</li>
                <li><code>smtp_crack.exe</code> → SMTP (25)</li>
                <li><code>telnet_crack.exe</code> → Telnet (23)</li>
                <li><code>dns_crack.exe</code> → DNS (53)</li>
            </ul>
            <p>Si tu cracker es más viejo que el puerto, el ataque falla. Conseguí versiones nuevas en servers difíciles o misiones.</p>
        </div>` },
    { type: 'content', html: `
        <div class="book-content">
            <h2>Misiones — HackNet</h2>
            <p>En <b>HackNet</b> hay gente que paga por trabajos específicos.</p>
            <p style="text-align:center;"><code>connect hacknet.onion</code></p>
            <h3>Para empezar</h3>
            <ul>
                <li>Creá mail en <code>connect gomail.com</code></li>
                <li>Vinculá la cuenta en HackNet</li>
                <li>Mirá contratos con <code>missions</code></li>
            </ul>
            <ul>
                <li><code>accept [ID]</code> — aceptar uno</li>
                <li><code>claim [ID]</code> — cobrar recompensa</li>
            </ul>
            <div class="book-highlight">Las misiones son la mejor fuente de crackers y plata. Cuando te trabes, hacelas.</div>
        </div>` },
    { type: 'content', html: `
        <div class="book-content">
            <h2>Rastreo</h2>
            <p>Algunos servers tienen <b>rastreo</b>: al conectarte arranca un cronómetro. Si llega a cero, <b>perdés la partida</b>.</p>
            <h3>Cómo frenarlo</h3>
            <ul>
                <li><b>Desconectate:</b> el comando <code>disconnect</code> lo corta al instante.</li>
                <li><b>Borrar el log:</b> en <code>/var/log/</code> hay un archivo <code>conn_XXXX.txt</code>. Borralo con <code>rm</code>.</li>
            </ul>
            <div class="book-highlight">Si no estás seguro, <code>disconnect</code> antes de que sea tarde. Perder un hackeo es mejor que perder la partida.</div>
        </div>` },
    { type: 'content', html: `
        <div class="book-content">
            <h2>Rastreo rápido</h2>
            <p>Si hacés mucho ruido (muchas descargas, muchos intentos fallidos), el server activa un <b>rastreo rápido</b>: 22 segundos que solo frenás desconectándote ya.</p>
            <h3>Última oportunidad</h3>
            <p>Si el rastreo llega a cero, entrás en <b>modo emergencia</b>: tenés 100 segundos para hackear el server del atacante y borrar tu registro. Si fallás, game over.</p>
        </div>` },
    { type: 'content', html: `
        <div class="book-content">
            <h2>InfoMarket</h2>
            <p>En <code>connect market.onion</code> vendés lo robado y comprás mejoras.</p>
            <h3>Qué vender</h3>
            <p>Los archivos que bajás van a <code>/download</code>. Los <b>financieros</b> (tarjetas, cuentas, bases de datos) son los que más pagan.</p>
            <h3>Qué comprar</h3>
            <ul>
                <li><b>RAM:</b> más memoria para correr más cosas</li>
                <li><b>CPU:</b> crackers más rápidos</li>
                <li><b>Antena:</b> más rango en el NetMap</li>
            </ul>
            <div class="book-highlight">Vendé seguido. Si te rastrean, perdés también lo que tenías sin vender.</div>
        </div>` },
    { type: 'content', html: `
        <div class="book-content">
            <h2>Fin del manual</h2>
            <p>Con esto ya tenés lo mínimo para arrancar. Lo demás lo aprendés jugando.</p>
            <h3>Recordatorio</h3>
            <ul>
                <li><b>help</b> — siempre disponible</li>
                <li><b>F1</b> — abre este manual</li>
                <li><b>disconnect</b> — tu mejor amigo cuando el rastreo aprieta</li>
            </ul>
            <div class="book-highlight" style="text-align:center; margin-top: 36px;">
                "La información es el arma.<br>El silencio es la defensa."
                <div style="margin-top: 16px; font-size: 0.85em; letter-spacing: 4px; opacity: 0.7;">◆ ◆ ◆</div>
            </div>
        </div>` }
];

const TUTORIAL_TOTAL_SPREADS = Math.ceil(TUTORIAL_PAGES.length / 2);

// ============================================================
// SONIDOS
// ============================================================
function playBookLiftSound() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, t);
        osc.frequency.exponentialRampToValueAtTime(230, t + 1.2);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.04, t + 0.4);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 1.75);
    } catch(e) {}
}

function playBookCoverOpenSound() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.linearRampToValueAtTime(85, t + 1.1);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.045, t + 0.12);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 1.4);
        const sr = audioCtx.sampleRate;
        const bufSize = Math.floor(sr * 1.3);
        const buf = audioCtx.createBuffer(1, bufSize, sr);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
            const p = i / bufSize;
            const env = Math.sin(Math.PI * p) * (0.7 + 0.3 * Math.sin(p * Math.PI * 4));
            d[i] = (Math.random() * 2 - 1) * env;
        }
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass'; filter.frequency.value = 1600;
        const g2 = audioCtx.createGain(); g2.gain.value = 0.028;
        src.connect(filter); filter.connect(g2); g2.connect(audioCtx.destination);
        src.start(t + 0.35);
    } catch(e) {}
}

function playBookPageTurnSound() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const sr = audioCtx.sampleRate;
        const bufSize = Math.floor(sr * 0.55);
        const buf = audioCtx.createBuffer(1, bufSize, sr);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
            const p = i / bufSize;
            const env = Math.sin(Math.PI * p) * (0.6 + 0.4 * Math.sin(p * Math.PI * 7));
            d[i] = (Math.random() * 2 - 1) * env;
        }
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2200, t);
        filter.frequency.linearRampToValueAtTime(5000, t + 0.45);
        filter.Q.value = 0.9;
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.055, t + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        src.connect(filter); filter.connect(g); g.connect(audioCtx.destination);
        src.start();
    } catch(e) {}
}

function playBookCloseSound() {
    if (!audioCtx) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.3);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.09, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.55);
    } catch(e) {}
}

// ============================================================
// RENDER
// ============================================================
function renderTutorialPageHTML(pageIndex) {
    if (pageIndex < 0 || pageIndex >= TUTORIAL_PAGES.length) return `<div class="book-content"></div>`;
    return TUTORIAL_PAGES[pageIndex].html + `<div class="book-page-number">— ${pageIndex + 1} —</div>`;
}

function renderTutorialSpread() {
    const leftPageIdx = tutorialCurrentSpread * 2;
    const rightPageIdx = leftPageIdx + 1;
    document.getElementById('book-left').innerHTML = renderTutorialPageHTML(leftPageIdx);
    document.getElementById('book-right').innerHTML = renderTutorialPageHTML(rightPageIdx);
    updateTutorialNav();
}

function updateTutorialNav() {
    document.getElementById('book-prev-btn').disabled = tutorialCurrentSpread === 0;
    document.getElementById('book-next-btn').disabled = tutorialCurrentSpread >= TUTORIAL_TOTAL_SPREADS - 1;
    document.getElementById('book-indicator').textContent =
        `${tutorialCurrentSpread + 1} / ${TUTORIAL_TOTAL_SPREADS}`;
}

// ============================================================
// FLIP PAGE — fade simple
// ============================================================
function tutorialNextPage() {
    if (tutorialIsAnimating || tutorialPhase !== 'reading') return;
    if (tutorialCurrentSpread >= TUTORIAL_TOTAL_SPREADS - 1) return;
    tutorialIsAnimating = true;
    playBookPageTurnSound();

    const leftPage = document.getElementById('book-left');
    const rightPage = document.getElementById('book-right');

    const nextSpread = tutorialCurrentSpread + 1;
    const newLeftHTML = renderTutorialPageHTML(nextSpread * 2);
    const newRightHTML = renderTutorialPageHTML(nextSpread * 2 + 1);

    leftPage.style.transition = 'opacity 0.3s';
    rightPage.style.transition = 'opacity 0.3s';
    leftPage.style.opacity = '0';
    rightPage.style.opacity = '0';

    laterT(() => {
        leftPage.innerHTML = newLeftHTML;
        rightPage.innerHTML = newRightHTML;
        leftPage.scrollTop = 0;
        rightPage.scrollTop = 0;
        leftPage.style.opacity = '1';
        rightPage.style.opacity = '1';
        tutorialCurrentSpread = nextSpread;
        updateTutorialNav();
        tutorialIsAnimating = false;
    }, 300);
}

function tutorialPrevPage() {
    if (tutorialIsAnimating || tutorialPhase !== 'reading') return;
    if (tutorialCurrentSpread <= 0) return;
    tutorialIsAnimating = true;
    playBookPageTurnSound();

    const leftPage = document.getElementById('book-left');
    const rightPage = document.getElementById('book-right');

    const prevSpread = tutorialCurrentSpread - 1;
    const newLeftHTML = renderTutorialPageHTML(prevSpread * 2);
    const newRightHTML = renderTutorialPageHTML(prevSpread * 2 + 1);

    leftPage.style.transition = 'opacity 0.3s';
    rightPage.style.transition = 'opacity 0.3s';
    leftPage.style.opacity = '0';
    rightPage.style.opacity = '0';

    laterT(() => {
        leftPage.innerHTML = newLeftHTML;
        rightPage.innerHTML = newRightHTML;
        leftPage.scrollTop = 0;
        rightPage.scrollTop = 0;
        leftPage.style.opacity = '1';
        rightPage.style.opacity = '1';
        tutorialCurrentSpread = prevSpread;
        updateTutorialNav();
        tutorialIsAnimating = false;
    }, 300);
}

// ============================================================
// ABRIR / CERRAR
// ============================================================
function openTutorial() {
    if (gameState.tutorialOpen) return;
    if (gameState.gamePhase === 'last-chance' || gameState.gamePhase === 'white-terminal' || gameState.gamePhase === 'game-over') return;
    gameState.tutorialOpen = true;
    if (typeof initAudio === 'function') initAudio();

    clearTutorialTimers();
    tutorialCurrentSpread = 0;
    tutorialIsAnimating = false;
    tutorialPhase = 'cover';
    renderTutorialSpread();

    const overlay = document.getElementById('tutorial-overlay');
    const cover = document.getElementById('book-cover');
    const leftPage = document.getElementById('book-left');
    const rightPage = document.getElementById('book-right');

    cover.classList.remove('opened');
    leftPage.style.opacity = '1';
    rightPage.style.opacity = '1';

    if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
    }

    overlay.style.display = 'flex';
    playBookLiftSound();

    // Fade-out de la portada (0.6s) y listo
    laterT(() => {
        if (!gameState.tutorialOpen) return;
        cover.classList.add('opened');
        playBookCoverOpenSound();

        laterT(() => {
            if (!gameState.tutorialOpen) return;
            tutorialPhase = 'reading';
        }, 600);
    }, 700);
}

function closeTutorial() {
    if (!gameState.tutorialOpen) return;
    if (tutorialPhase === 'closing') return;

    const wasOpened = (tutorialPhase === 'reading' || tutorialPhase === 'cover');
    tutorialPhase = 'closing';
    clearTutorialTimers();

    const overlay = document.getElementById('tutorial-overlay');
    const cover = document.getElementById('book-cover');

    playBookCloseSound();

    const finishClose = () => {
        overlay.style.display = 'none';
        cover.classList.remove('opened');
        gameState.tutorialOpen = false;
        tutorialPhase = 'idle';
        try { localStorage.setItem(TUTORIAL_SEEN_KEY, '1'); } catch(e) {}
        setTimeout(() => {
            const setupOv = document.getElementById('setup-overlay');
            if (setupOv && setupOv.style.display === 'flex') {
                const su = document.getElementById('setup-user');
                if (su) { su.focus(); return; }
            }
            if (typeof input !== 'undefined' && input && !input.disabled) {
                input.focus();
            }
            // NUEVO: chequear notificación de update al cerrar el tutorial
            if (typeof maybeShowUpdateNotification === 'function') {
                maybeShowUpdateNotification();
            }
        }, 60);
    };

    if (wasOpened) {
        cover.classList.remove('opened');
        laterT(finishClose, 650);
    } else {
        finishClose();
    }
}

// ============================================================
// PRIMER ARRANQUE
// ============================================================
function maybeShowTutorialOnFirstRun() {
    let seen = false;
    try { seen = localStorage.getItem(TUTORIAL_SEEN_KEY) === '1'; } catch(e) {}
    if (!seen) setTimeout(() => openTutorial(), 600);
}

// ============================================================
// ATAJOS DE TECLADO
// ============================================================
document.addEventListener('keydown', (e) => {
    if (gameState.tutorialOpen) {
        if (e.key === 'Escape') { e.preventDefault(); closeTutorial(); return; }
        if (tutorialPhase !== 'reading') return;
        if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); tutorialNextPage(); return; }
        if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   { e.preventDefault(); tutorialPrevPage(); return; }
        return;
    }
    if (e.key === 'F1') { e.preventDefault(); openTutorial(); }
});