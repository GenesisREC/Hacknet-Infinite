// ============================================================
// NEWS.COM — Portal de noticias
// ============================================================

// ============================================================
// UPDATES — changelog manual
// ============================================================
const NEWS_UPDATES = [
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
function newsAdd(category, title, text) {
    if (!gameState.newsLog) gameState.newsLog = [];
    gameState.newsCounter = (gameState.newsCounter || 0) + 1;
    const entry = {
        id: 'n' + gameState.newsCounter,
        ts: Date.now(),
        category,
        title,
        text
    };
    gameState.newsLog.unshift(entry);
    if (gameState.newsLog.length > 60) gameState.newsLog.pop();
    return entry;
}

// ============================================================
// HOOKS DE ACTIVIDAD
// ============================================================
function newsOnServerHacked(server) {
    if (!server) return;
    const ip = server.ip || '?.?.?.?';
    const profile = server.profile || 'mixed';
    const pool = NEWS_TITULARES_HACK[profile] || NEWS_TITULARES_HACK.mixed;
    const title = newsFill(newsPick(pool), { IP: ip });
    const text = newsPick(NEWS_CUERPOS_HACK);
    newsAdd('cyber', title, text);

    if (server.hasTrace) {
        newsAdd('info',
            `Rastreo activo en ${ip} tras el incidente`,
            `El servidor comprometido mantenía un sistema de rastreo activo. Se desconoce si el atacante logró evadirlo.`);
    }
}

function newsOnFinancialLeak(fileName, serverIP) {
    if (!fileName) return;
    const ip = serverIP || 'IP desconocida';
    const title = newsFill(newsPick(NEWS_TITULARES_LEAK_FIN), { IP: ip });
    const text = newsPick(NEWS_CUERPOS_LEAK_FIN) + ` (Archivo: ${fileName})`;
    newsAdd('leak', title, text);
}

function newsOnPersonalLeak(fileName, serverIP) {
    if (!fileName) return;
    const ip = serverIP || 'IP desconocida';
    const title = newsFill(newsPick(NEWS_TITULARES_LEAK_PERS), { IP: ip });
    const text = newsPick(NEWS_CUERPOS_LEAK_PERS) + ` (Archivo: ${fileName})`;
    newsAdd('leak', title, text);
}

function newsOnMarketSale(fileName, value) {
    const titulares = NEWS_TITULARES_MARKET;
    const titulo = newsPick(titulares);
    const v = Number(value) || 0;
    const textos = [
        `El lote fue vendido por ${v.toLocaleString()} créditos. El comprador permanece anónimo.`,
        `Analistas estiman que la operación se concretó en minutos. La demanda de datos filtrados sigue en aumento.`,
        `Fuentes del mercado negro confirman la transacción. El archivo "${fileName}" ya no está disponible.`,
        `El precio alcanzado sorprendió a los propios vendedores. Algunos especulan con una nueva ola de filtraciones.`
    ];
    newsAdd('market', titulo, newsPick(textos));
}

function newsOnLogWiped(serverIP) {
    const ip = serverIP || 'IP desconocida';
    const title = newsFill(newsPick(NEWS_TITULARES_GHOST), { IP: ip });
    const text = newsPick(NEWS_CUERPOS_GHOST);
    newsAdd('ghost', title, text);
}

function newsOnTraceComplete(serverIP) {
    const ip = serverIP || 'IP desconocida';
    const title = newsFill(newsPick(NEWS_TITULARES_TRACE), { IP: ip });
    newsAdd('info', title, 'Las autoridades fueron notificadas. El atacante será localizado en las próximas horas.');
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

function switchNewsTab(tab) {
    gameState.newsTab = tab;
    updateNewsTabs();
    const urlEl = document.getElementById('news-web-url');
    if (urlEl) {
        urlEl.textContent = tab === 'latest'
            ? 'https://news.com/latest'
            : 'https://news.com/updates';
    }
    renderNewsWeb();
}

function updateNewsTabs() {
    const latestBtn = document.getElementById('news-tab-latest');
    const updatesBtn = document.getElementById('news-tab-updates');
    if (!latestBtn || !updatesBtn) return;
    const isLatest = gameState.newsTab === 'latest';
    latestBtn.classList.toggle('active', isLatest);
    updatesBtn.classList.toggle('active', !isLatest);
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

// ==== Modificar switchNewsTab existente ====
// Reemplazá la función actual por esta versión:
function switchNewsTab(tab) {
    gameState.newsTab = tab;
    updateNewsTabs();
    const urlEl = document.getElementById('news-web-url');
    if (urlEl) {
        urlEl.textContent = tab === 'latest'
            ? 'https://news.com/latest'
            : 'https://news.com/updates';
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
window.newsOnTraceComplete   = newsOnTraceComplete;
window.openNewsWeb           = openNewsWeb;
window.closeNewsWeb          = closeNewsWeb;
window.switchNewsTab         = switchNewsTab;
