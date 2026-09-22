// ============================================================
// NEWS.COM — Portal de noticias
// ============================================================

// ============================================================
// UPDATES — changelog manual
// ============================================================
const NEWS_UPDATES = [
{
        version: 'v1.8.0',
        date: '2026-09-22',
        title: 'Hacknet Infinite ahora se juega desde el celular',
        body: [
            { text: 'El juego es jugable en celulares y tablets: layout adaptado a pantallas verticales y controles táctiles.', tag: 'new' },
            { text: 'Viewport fijo: se desactiva el zoom accidental por doble tap y el rebote de scroll.', tag: 'new' },
            { text: 'El input del terminal usa 16px en mobile, lo que evita que iOS haga auto-zoom al enfocar.', tag: 'fix' },
            { text: 'Cuando aparece el teclado virtual, la terminal se scrollea sola para que el prompt no quede tapado.', tag: 'fix' },
            { text: 'Botones, sugerencias y controles de proceso tienen área táctil más grande.', tag: 'bal' },
            { text: 'NetMap, wallbreaker y los canvases de los crackers se reescalan al ancho disponible.', tag: 'fix' },
            { text: 'Los formularios de InfoMarket, HackNet y GoMail se apilan verticalmente en pantallas chicas.', tag: 'fix' },
            { text: 'La ventana de conexión ocupa toda la pantalla en mobile, con las secciones apiladas.', tag: 'fix' },
            { text: 'El manual de usuario se adapta a la pantalla del celular.', tag: 'fix' },
            { text: 'Los efectos :hover ya no se quedan "pegados" después de un tap en mobile.', tag: 'fix' },
            { text: 'Se eliminó el detector de DevTools y su alarma: disparaba falsos positivos al abrir el teclado virtual, rotar la pantalla o cambiar de app.', tag: 'fix' },
            { text: 'Se eliminó el spam binario en la consola del navegador.', tag: 'fix' }
        ]
    },
        {
        version: 'v1.7.0',
        date: '2026-09-21',
        title: 'Archivos con sabor, identidades persistentes y noticias agrupadas',
        body: [
            { text: 'Nuevo pool de 150 archivos únicos sin valor comercial: notas, chats, diarios, sátiras, referencias a juegos.', tag: 'new' },
            { text: 'Los archivos de sabor no se repiten nunca en la misma partida: cada servidor recibe un set distinto.', tag: 'new' },
            { text: 'Cada servidor tiene una identidad fija (persona o empresa) que se mantiene durante toda la partida.', tag: 'new' },
            { text: 'Las noticias ahora referencian al dueño del servidor en lugar de la IP.', tag: 'new' },
            { text: 'Las noticias de un mismo servidor se agrupan en una sola entrada en lugar de aparecer por separado.', tag: 'new' },
            { text: 'Las noticias tardan entre 5 y 15 segundos en publicarse, simulando el tiempo de reacción de la prensa.', tag: 'new' },
            { text: 'Sistema anti-duplicados: los archivos bajados dos veces del mismo server pierden su valor de venta.', tag: 'bal' },
            { text: 'Los ZIP duplicados descomprimen sus archivos internos sin valor de venta.', tag: 'bal' },
            { text: 'El comando help está reorganizado por secciones y solo muestra los comandos disponibles para el jugador.', tag: 'fix' },
            { text: 'wallbreaker help ahora es un manual completo con ejemplo de uso paso a paso.', tag: 'new' },
            { text: 'wallbreaker table quedó como tabla HEX → ASCII compacta.', tag: 'new' },
            { text: 'La tabla HEX ahora incluye una explicación de cómo se lee, para quienes no conocen el sistema hexadecimal.', tag: 'fix' },
            { text: 'Volumen general del juego elevado para mejor feedback auditivo.', tag: 'bal' }
        ]
    },
    {
    	version: 'v1.6.0',
    	date: '2026-09-20',
    	title: 'Borrado con animación + migración de guardados',
    	body: [
        	{ text: 'El comando rm ahora muestra una animación por cada archivo eliminado, con su nombre y tamaño.', tag: 'new' },
        	{ text: 'rm * borra secuencialmente: un proceso visible por archivo, no todos de golpe.', tag: 'new' },
        	{ text: 'Sistema de migración de guardados para versiones antiguas: preserva cuentas, herramientas, créditos y pines.', tag: 'new' },
        	{ text: 'News.com ahora aparece como nodo fijo en el NetMap.', tag: 'new' }
    	]
    },
    {
        version: 'v1.5.0',
        date: '2026-09-20',
        title: 'Portal de noticias y ajustes',
        body: [
            { text: 'Nueva página News.com con feed de actividad en tiempo real.', tag: 'new' },
            { text: 'Feed generado automáticamente a partir de tus acciones en la red.', tag: 'new' },
            { text: 'Pestaña de Updates con changelog del juego.', tag: 'new' },
            { text: 'Ajustes de rendimiento en la generación procedural.', tag: 'fix' }
        ]
    },
    {
        version: 'v1.4.0',
        date: '2026-09-18',
        title: 'Tutorial interactivo',
        body: [
            { text: 'Manual de usuario integrado como libro 3D interactivo.', tag: 'new' },
            { text: 'El tutorial aparece automáticamente la primera vez que abrís el juego.', tag: 'new' },
            { text: 'Botón MANUAL en la barra superior (o F1) para abrirlo cuando quieras.', tag: 'new' }
        ]
    },
    {
        version: 'v1.3.0',
        date: '2026-09-15',
        title: 'Generación procedural de archivos',
        body: [
            { text: 'Los archivos de los servers ahora se generan con datos aleatorios únicos.', tag: 'new' },
            { text: 'Pool de nombres, apellidos, dominios, bancos y empresas expandido.', tag: 'new' },
            { text: 'Cada hackeo produce contenido distinto — imposible ver dos veces lo mismo.', tag: 'new' },
            { text: 'Se pueden correr varios crackers en paralelo (solo limitado por RAM).', tag: 'bal' }
        ]
    },
    {
        version: 'v1.2.0',
        date: '2026-09-12',
        title: 'InfoMarket rediseñado',
        body: [
            { text: 'El mercado ahora es una página web con dashboard visual.', tag: 'new' },
            { text: 'Botones para vender y comprar mejoras de hardware.', tag: 'new' },
            { text: 'Cards con vista previa de cada upgrade disponible.', tag: 'new' },
            { text: 'Corregido el bug de duplicación de archivos en el inventario.', tag: 'fix' }
        ]
    },
    {
        version: 'v1.1.0',
        date: '2026-09-08',
        title: 'Sistema de misiones y last-chance',
        body: [
            { text: 'Nueva red HackNet con contratos generados proceduralmente.', tag: 'new' },
            { text: 'Sistema de rastreo inverso: si te rastrean hasta el final, modo emergencia.', tag: 'new' },
            { text: 'Si sobrevivís la última oportunidad, la partida continúa.', tag: 'new' },
            { text: 'Los puertos de los servers ahora escalan con tu nivel de cracker.', tag: 'bal' }
        ]
    },
    {
        version: 'v1.0.0',
        date: '2026-09-01',
        title: 'Lanzamiento inicial',
        body: [
            { text: 'Hacknet Infinite: PC Edition disponible.', tag: 'new' },
            { text: 'NetMap, wallbreaker, proceso de crackers animados.', tag: 'new' },
            { text: 'Sistema de archivos completo con generación procedural.', tag: 'new' }
        ]
    }
];

// ============================================================
// POOLS DE TEXTO PARA NOTICIAS
// ============================================================
const NEWS_TITULARES_HACK = {
    hacker: [
        'Servidor clandestino en {IP} fue comprometido',
        'Nodo hacker en {IP} cayó ante un ataque dirigido',
        'Un intruso logró acceso total al servidor {IP}'
    ],
    database: [
        'Base de datos expuesta en {IP}: filtración masiva de registros',
        'Robo de información en {IP} compromete datos de clientes',
        'Ataque a la base de datos de {IP} deja miles de registros al descubierto'
    ],
    web: [
        'Servidor web en {IP} fue vulnerado por un atacante desconocido',
        'Ataque a infraestructura web en {IP} deja servicios caídos',
        'Hackean el sitio alojado en {IP}: datos de usuarios en riesgo'
    ],
    mail: [
        'Correos corporativos en {IP} fueron interceptados',
        'Servidor de correo en {IP} filtra comunicaciones privadas',
        'Ataque al servidor de correo {IP}: miles de mensajes comprometidos'
    ],
    backup: [
        'Backups críticos en {IP} desaparecieron tras un hackeo',
        'Servidor de respaldo en {IP} fue comprometido',
        'Los respaldos de {IP} fueron vulnerados en un ataque silencioso'
    ],
    office: [
        'PC de oficina en {IP} fue accedida de forma no autorizada',
        'Equipo corporativo en {IP} comprometido por un intruso',
        'Intrusión detectada en la PC de oficina {IP}'
    ],
    mixed: [
        'Sistema mixto en {IP} fue vulnerado',
        'Servidor multifunción en {IP} comprometido',
        'Intrusión detectada en el sistema de {IP}'
    ],
    lowvalue: [
        'Nodo secundario en {IP} fue hackeado',
        'Equipo menor en {IP} cayó ante un ataque',
        'Intrusión en el nodo de bajo valor {IP}'
    ]
};

const NEWS_CUERPOS_HACK = [
    'Según fuentes anónimas, el ataque provino desde una IP enmascarada. No hay reportes de daños mayores.',
    'El equipo del servidor reportó el incidente horas después. Se investigan las causas.',
    'Especialistas indican que el atacante usó herramientas conocidas del mercado negro.',
    'La empresa afectada declinó hacer declaraciones. El servicio permanece inestable.',
    'Vecinos del datacenter reportaron actividad inusual durante la madrugada.',
    'El ataque fue silencioso: no se activaron alarmas hasta varias horas después.'
];

const NEWS_TITULARES_LEAK_FIN = [
    'Filtración de datos financieros vinculada a {IP}',
    'Documentos confidenciales aparecen tras el hackeo de {IP}',
    'Nueva filtración: archivos sensibles de {IP} circulan en la red',
    'Credenciales bancarias filtradas desde {IP}'
];

const NEWS_CUERPOS_LEAK_FIN = [
    'Los archivos incluyen credenciales bancarias, números de tarjeta y datos personales. Analistas advierten sobre el riesgo de fraude.',
    'Especialistas en seguridad califican el hecho como "uno de los peores incidentes del año". Las víctimas aún no fueron notificadas.',
    'La filtración podría afectar a cientos de usuarios. Se recomienda cambiar contraseñas de inmediato.',
    'Los datos ya estarían siendo vendidos en el mercado negro. Los precios rondan los miles de créditos por lote.'
];

const NEWS_TITULARES_LEAK_PERS = [
    'Datos personales expuestos tras ataque a {IP}',
    'Filtración de información privada en {IP}',
    'Agenda de contactos comprometida en {IP}',
    'Correos privados filtrados desde {IP}'
];

const NEWS_CUERPOS_LEAK_PERS = [
    'Los archivos contienen nombres, teléfonos y correos electrónicos. Expertos advierten sobre campañas de phishing.',
    'La filtración expone comunicaciones privadas y datos de contacto de múltiples personas.',
    'Se recomienda extremar precauciones ante posibles estafas dirigidas.',
    'Los datos podrían ser usados para suplantación de identidad.'
];

const NEWS_TITULARES_MARKET = [
    'Datos robados aparecen a la venta en el mercado negro',
    'Lote de información filtrada se ofrece en foros clandestinos',
    'Venta de archivos comprometidos genera revuelo en la dark web'
];

const NEWS_TITULARES_GHOST = [
    'Ataque fantasma en {IP}: rastros eliminados',
    'Intruso borra logs de {IP} sin dejar rastro',
    'Hackeo limpio en {IP}: no quedan evidencias'
];

const NEWS_CUERPOS_GHOST = [
    'El atacante logró borrar los registros de conexión antes de desconectarse. Los investigadores no tienen pistas.',
    'No hay logs disponibles. El equipo forense analiza los metadatos restantes.',
    'El rastro se perdió por completo. Se sospecha de un operador con experiencia.'
];

const NEWS_TITULARES_TRACE = [
    'Rastreo exitoso: atacante identificado en {IP}',
    'La policía cibernética rastreó un ataque desde {IP}',
    'Identifican origen de intrusión en {IP}'
];

// ============================================================
// HELPERS DE GENERACIÓN
// ============================================================
function newsPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function newsFill(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] !== undefined ? vars[k] : m));
}

// ============================================================
// ALTA DE NOTICIAS
// ============================================================
function newsAdd(category, title, text, ip) {
    if (!gameState.newsLog) gameState.newsLog = [];
    gameState.newsCounter = (gameState.newsCounter || 0) + 1;
    const entry = {
        id: 'n' + gameState.newsCounter,
        ts: Date.now(),
        category,
        title,
        text,
        ip: ip || null   // ← opcional, para agrupar/filtrar después
    };
    gameState.newsLog.unshift(entry);
    if (gameState.newsLog.length > 60) gameState.newsLog.pop();
    return entry;
}
// ============================================================
// IDENTIDAD DE SERVIDOR
// ============================================================
const PERSON_PROFILES  = ['hacker', 'office', 'lowvalue'];
const COMPANY_PROFILES = ['database', 'web', 'mail', 'backup'];

function generateServerIdentity(profile) {
    let isPerson;
    if (PERSON_PROFILES.includes(profile)) isPerson = true;
    else if (COMPANY_PROFILES.includes(profile)) isPerson = false;
    else isPerson = Math.random() < 0.5;

    if (isPerson) {
        const p = dGenerarNombreCompleto();
        return { type: 'person', name: p.nombre };
    }
    return { type: 'company', name: dGenerarEmpresa() };
}

function getServerIdentity(server) {
    if (!server) return { type: 'company', name: 'Servidor desconocido' };
    if (!server.identity) {
        server.identity = generateServerIdentity(server.profile || 'mixed');
    }
    return server.identity;
}

// ============================================================
// COLA DE NOTICIAS — delay + agrupación por IP
// ============================================================
const NEWS_DELAY_MIN_MS = 5000;
const NEWS_DELAY_MAX_MS = 15000;

const pendingNewsByIP = {};

function newsEnqueueByIP(ip, identity, event) {
    if (!ip) return;
    if (!pendingNewsByIP[ip]) {
        pendingNewsByIP[ip] = { events: [], timer: null, ip, identity };
    }
    if (!pendingNewsByIP[ip].identity && identity) {
        pendingNewsByIP[ip].identity = identity;
    }
    pendingNewsByIP[ip].events.push({ ...event, ts: Date.now() });

    if (pendingNewsByIP[ip].timer) clearTimeout(pendingNewsByIP[ip].timer);
    const delay = NEWS_DELAY_MIN_MS + Math.random() * (NEWS_DELAY_MAX_MS - NEWS_DELAY_MIN_MS);
    pendingNewsByIP[ip].timer = setTimeout(() => flushNewsForIP(ip), delay);
}

function newsEnqueue(server, event) {
    if (!server || !server.ip) return;
    if (server.isProbeServer || server.isLastChanceServer) return;
    newsEnqueueByIP(server.ip, getServerIdentity(server), event);
}

function flushNewsForIP(ip) {
    const pending = pendingNewsByIP[ip];
    if (!pending || pending.events.length === 0) {
        delete pendingNewsByIP[ip];
        return;
    }

    const identity = pending.identity || { type: 'company', name: 'Servidor desconocido' };
    const events = pending.events;

    const hasLeakFin  = events.some(e => e.type === 'leak_fin');
    const hasLeakPers = events.some(e => e.type === 'leak_pers');
    const hasMarket   = events.some(e => e.type === 'market_sale');
    const hasLogWiped = events.some(e => e.type === 'log_wiped');
    const hasHack     = events.some(e => e.type === 'hack');

    let category, title;

    if (hasLeakFin) {
        category = 'leak';
        title = identity.type === 'person'
            ? `Filtración de datos financieros de ${identity.name}`
            : `Filtración de datos financieros en ${identity.name}`;
    } else if (hasLeakPers) {
        category = 'leak';
        title = identity.type === 'person'
            ? `Datos personales de ${identity.name} expuestos`
            : `Filtración de información privada en ${identity.name}`;
    } else if (hasMarket) {
        category = 'market';
        title = identity.type === 'person'
            ? `Datos robados a ${identity.name} aparecen a la venta`
            : `Lote de ${identity.name} aparece en el mercado negro`;
    } else if (hasLogWiped) {
        category = 'ghost';
        title = identity.type === 'person'
            ? `Ataque fantasma contra ${identity.name}: sin rastros`
            : `Ataque limpio a ${identity.name}: evidencias borradas`;
    } else if (hasHack) {
        category = 'cyber';
        title = identity.type === 'person'
            ? `El equipo de ${identity.name} sufrió un ataque`
            : `${identity.name} comprometida por un atacante`;
    } else {
        category = 'info';
        title = `Incidente reportado en ${identity.name}`;
    }

    const body = buildGroupedBody(events, identity);
    newsAdd(category, title, body, ip);
    delete pendingNewsByIP[ip];
}

function buildGroupedBody(events, identity) {
    const lines = [];
    const person = identity.type === 'person';

    if (events.some(e => e.type === 'hack')) {
        lines.push(person
            ? `El servidor personal de ${identity.name} fue accedido sin autorización.`
            : `El servidor de ${identity.name} fue comprometido por un atacante desconocido.`);
    }

    const finEvents = events.filter(e => e.type === 'leak_fin');
    if (finEvents.length > 0) {
        const files = finEvents.map(e => e.data.fileName).filter(Boolean);
        lines.push(files.length > 0
            ? `Se sustrajeron los archivos ${files.join(', ')} con datos financieros.`
            : `Se sustrajo información financiera sensible.`);
        lines.push(`Analistas advierten sobre el riesgo de fraude.`);
    }

    const persEvents = events.filter(e => e.type === 'leak_pers');
    if (persEvents.length > 0) {
        const files = persEvents.map(e => e.data.fileName).filter(Boolean);
        lines.push(files.length > 0
            ? `Los archivos ${files.join(', ')} contienen datos personales de contacto.`
            : `Se filtró información personal de contacto.`);
        lines.push(`Se recomienda extremar precauciones ante posibles estafas.`);
    }

    const marketEvents = events.filter(e => e.type === 'market_sale');
    if (marketEvents.length > 0) {
        const total = marketEvents.reduce((sum, e) => sum + (e.data.amount || 0), 0);
        lines.push(total > 0
            ? `El lote fue vendido por ${total.toLocaleString()} créditos en el mercado negro.`
            : `El lote ya fue ofrecido en foros clandestinos.`);
    }

    if (events.some(e => e.type === 'log_wiped')) {
        lines.push(`El atacante logró borrar los registros de conexión. La investigación no tiene pistas.`);
    }

    if (lines.length === 0) {
        lines.push(`Se reportaron incidentes en los sistemas de ${identity.name}.`);
    }

    return lines.join(' ');
}

// ============================================================
// HOOKS DE ACTIVIDAD (ahora usan newsEnqueue)
// ============================================================
function newsOnServerHacked(server) {
    if (!server) return;
    newsEnqueue(server, { type: 'hack' });
}

function newsOnFinancialLeak(fileName, server) {
    if (!fileName || !server) return;
    newsEnqueue(server, { type: 'leak_fin', data: { fileName } });
}

function newsOnPersonalLeak(fileName, server) {
    if (!fileName || !server) return;
    newsEnqueue(server, { type: 'leak_pers', data: { fileName } });
}

function newsOnMarketSale(fileName, value, fileRef) {
    const ip = fileRef && fileRef.sourceServerIP;
    const identity = fileRef && fileRef.sourceServerIdentity;
    if (!ip || !identity) return;
    newsEnqueueByIP(ip, identity, { type: 'market_sale', data: { fileName, amount: value } });
}

function newsOnLogWiped(server) {
    if (!server) return;
    newsEnqueue(server, { type: 'log_wiped' });
}

// ============================================================
// ABRIR / CERRAR
// ============================================================
function openNewsWeb() {
    gameState.inNews = true;
    gameState.newsOpen = true;
    gameState.isConnected = false;
    gameState.isAuthenticated = false;
    gameState.currentIP = null;
    gameState.currentServer = null;

    if (typeof stopTrace === 'function') stopTrace();

    const overlay = document.getElementById('news-web-overlay');
    if (!overlay) {
        output.innerHTML += `<span class="text-error">[✗] Error: overlay de News.com no encontrado.</span><br>`;
        return;
    }
    overlay.style.display = 'flex';
    if (typeof input !== 'undefined' && input) input.disabled = true;

    gameState.newsTab = 'latest';
    updateNewsTabs();
    renderNewsWeb();

    if (typeof updateUI === 'function') updateUI();
}

function closeNewsWeb() {
    const overlay = document.getElementById('news-web-overlay');
    if (overlay) overlay.style.display = 'none';
    gameState.inNews = false;
    gameState.newsOpen = false;

    if (typeof output !== 'undefined' && output) {
        output.innerHTML += `<span class="text-muted">Cerraste News.com.</span><br>`;
        output.scrollTop = output.scrollHeight;
    }

    if (typeof updateUI === 'function') updateUI();
    if (typeof saveGame === 'function') saveGame();

    if (!gameState.isGameOver && !gameState.connectOverlayOpen) {
        if (typeof input !== 'undefined' && input) {
            input.disabled = false;
            input.focus();
        }
    }
}

function updateNewsTabs() {
    const latestBtn  = document.getElementById('news-tab-latest');
    const updatesBtn = document.getElementById('news-tab-updates');
    const reviewsBtn = document.getElementById('news-tab-reviews');
    if (latestBtn)  latestBtn.classList.toggle('active',  gameState.newsTab === 'latest');
    if (updatesBtn) updatesBtn.classList.toggle('active', gameState.newsTab === 'updates');
    if (reviewsBtn) reviewsBtn.classList.toggle('active', gameState.newsTab === 'reviews');
}

// ============================================================
// RENDER
// ============================================================
function formatNewsTime(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'ahora';
    if (mins < 60) return `hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return `hace ${days} d`;
}

function newsCategoryLabel(cat) {
    const labels = {
        cyber: 'CIBERSEGURIDAD',
        leak: 'FILTRACIÓN',
        market: 'MERCADO NEGRO',
        ghost: 'ATAQUE FANTASMA',
        info: 'INFORMACIÓN'
    };
    return labels[cat] || 'NOTICIA';
}

function renderNewsWeb() {
    const content = document.getElementById('news-web-content');
    if (!content) return;

    if (gameState.newsTab === 'updates') {
        renderNewsUpdatesTab(content);
    } else if (gameState.newsTab === 'reviews') {
        if (typeof renderReviewsTab === 'function') {
            renderReviewsTab(content);
        } else {
            content.innerHTML = `<div class="news-empty">Sistema de reviews no cargado.</div>`;
        }
    } else {
        renderNewsLatestTab(content);
    }
}

function renderNewsLatestTab(content) {
    const news = gameState.newsLog || [];

    let html = `<div class="news-hero">
        <div class="news-hero-title">ACTIVIDAD RECIENTE EN LA RED
            <span class="news-hero-counter">${news.length} ${news.length === 1 ? 'noticia' : 'noticias'}</span>
        </div>
        <div class="news-hero-sub">Últimos incidentes reportados por fuentes públicas y anónimas.</div>
    </div>`;

    if (news.length === 0) {
        html += `<div class="news-empty">
            <div class="news-empty-icon">📭</div>
            Todavía no hay noticias.
            <br><span style="opacity:0.7; font-size:0.85em;">Hackeá servidores, robá archivos o vendé datos en el mercado negro para generar titulares.</span>
        </div>`;
    } else {
        html += `<div class="news-list">`;
        news.forEach(n => {
            html += `<div class="news-item">
                <div class="news-item-time">${formatNewsTime(n.ts)}</div>
                <div class="news-item-body">
                    <div class="news-item-category news-cat-${n.category}">${newsCategoryLabel(n.category)}</div>
                    <div class="news-item-title">${n.title}</div>
                    <div class="news-item-text">${n.text}</div>
                </div>
            </div>`;
        });
        html += `</div>`;
    }
    content.innerHTML = html;
}

function renderNewsUpdatesTab(content) {
    let html = `<div class="updates-list">`;
    NEWS_UPDATES.forEach(u => {
        html += `<div class="update-entry">
            <div class="update-version">
                <span class="update-version-tag">${u.version}</span>
                <span class="update-version-title">${u.title}</span>
                <span style="flex:1;"></span>
                <span class="update-version-date">${u.date}</span>
            </div>
            <div class="update-body">
                <ul>`;
        u.body.forEach(item => {
            const tagHtml = item.tag
                ? `<span class="update-tag update-tag-${item.tag}">${item.tag.toUpperCase()}</span>`
                : '';
            html += `<li>${item.text}${tagHtml}</li>`;
        });
        html += `</ul></div></div>`;
    });
    html += `</div>`;
    content.innerHTML = html;
}
// ============================================================
// NOTIFICACIÓN DE ACTUALIZACIONES
// ============================================================
function getLatestReleaseVersion() {
    return (NEWS_UPDATES && NEWS_UPDATES[0] && NEWS_UPDATES[0].version) || null;
}

function getSeenReleaseVersion() {
    try { return localStorage.getItem(UPDATE_SEEN_KEY); } catch(e) { return null; }
}

function hasPendingUpdate() {
    const latest = getLatestReleaseVersion();
    if (!latest) return false;
    return latest !== getSeenReleaseVersion();
}

function markReleaseAsSeen() {
    const latest = getLatestReleaseVersion();
    if (!latest) return;
    try { localStorage.setItem(UPDATE_SEEN_KEY, latest); } catch(e) {}
    updateUpdateBadge();
    hideUpdateToast();
}

function updateUpdateBadge() {
    const badge = document.getElementById('update-badge');
    if (!badge) return;
    if (hasPendingUpdate()) {
        badge.textContent = '● UPDATE ' + getLatestReleaseVersion();
        badge.style.display = 'inline-flex';
    } else {
        badge.style.display = 'none';
    }
}

function showUpdateToast() {
    if (!hasPendingUpdate()) return;
    const toast = document.getElementById('update-toast');
    if (!toast) return;
    const latest = getLatestReleaseVersion();
    const info = NEWS_UPDATES.find(u => u.version === latest) || {};
    document.getElementById('update-toast-title').textContent =
        'ACTUALIZACIÓN ' + latest + ' DISPONIBLE';
    document.getElementById('update-toast-body').textContent =
        info.title || 'Hay cambios en el juego.';
    toast.style.display = 'flex';
    clearTimeout(window._updateToastTimer);
    window._updateToastTimer = setTimeout(() => {
        toast.style.display = 'none';
    }, 12000);
}

function hideUpdateToast() {
    const toast = document.getElementById('update-toast');
    if (toast) toast.style.display = 'none';
    clearTimeout(window._updateToastTimer);
}

function goToUpdatesFromToast() {
    hideUpdateToast();
    if (gameState.inNews) {
        switchNewsTab('updates');
    } else {
        openNewsWeb();
        setTimeout(() => switchNewsTab('updates'), 40);
    }
}

// Limpia los timers pendientes de agrupación de noticias
function clearPendingNews() {
    if (typeof pendingNewsByIP !== 'object') return;
    Object.keys(pendingNewsByIP).forEach(ip => {
        const p = pendingNewsByIP[ip];
        if (p && p.timer) clearTimeout(p.timer);
        delete pendingNewsByIP[ip];
    });
}
window.clearPendingNews = clearPendingNews;

// ==== Modificar switchNewsTab existente ====
// Reemplazá la función actual por esta versión:
function switchNewsTab(tab) {
    gameState.newsTab = tab;
    updateNewsTabs();
    const urlEl = document.getElementById('news-web-url');
    if (urlEl) {
        if (tab === 'latest')       urlEl.textContent = 'https://news.com/latest';
        else if (tab === 'updates') urlEl.textContent = 'https://news.com/updates';
        else if (tab === 'reviews') urlEl.textContent = 'https://news.com/reviews';
    }
    if (tab === 'updates') {
        markReleaseAsSeen();
    }
    renderNewsWeb();
}
// ============================================================
// EXPORT A WINDOW
// ============================================================
window.newsOnServerHacked    = newsOnServerHacked;
window.newsOnFinancialLeak   = newsOnFinancialLeak;
window.newsOnPersonalLeak    = newsOnPersonalLeak;
window.newsOnMarketSale      = newsOnMarketSale;
window.newsOnLogWiped        = newsOnLogWiped;
window.openNewsWeb           = openNewsWeb;
window.closeNewsWeb          = closeNewsWeb;
window.switchNewsTab         = switchNewsTab;
window.generateServerIdentity = generateServerIdentity;
window.getServerIdentity      = getServerIdentity;