// ============================================================
// WEBS.JS — Sitios web falsos procedurales
// ============================================================
// Los "web servers" son servers especiales que al conectarte
// muestran una página web en vez del formulario de login.
// Son fáciles de hackear (puertos bajos, sin trace) y no
// contienen archivos valiosos: solo HTML y CSS sin valor.
// ============================================================

// TLDs variados (para parecer de todo el mundo)
const WEB_TLDS = [
    'com', 'net', 'io', 'co', 'org', 'info', 'biz',
    'ar', 'com.ar', 'br', 'com.br', 'mx', 'com.mx', 'cl', 'pe', 've', 'uy', 'py', 'bo', 'ec',
    'es', 'uk', 'co.uk', 'de', 'fr', 'it', 'nl', 'se', 'no', 'fi', 'dk', 'ch', 'at', 'be', 'pt', 'pl', 'gr', 'tr', 'ru', 'cz',
    'jp', 'cn', 'kr', 'in', 'au', 'com.au', 'ca', 'nz', 'za', 'sg', 'my', 'th'
];

// Sectores de industria
const WEB_INDUSTRIES = {
    tech: {
        prefixes: ['Nexus', 'Byte', 'Cloud', 'Data', 'Quantum', 'Neon', 'Apex', 'Core', 'Vertex', 'Zenith', 'Helix', 'Orbit', 'Pixel', 'Lumen', 'Sync'],
        suffixes: ['Tech', 'Systems', 'Labs', 'Soft', 'Digital', 'Networks', 'Solutions'],
        taglines: ['Innovación sin límites.', 'El futuro, hoy.', 'Tecnología que conecta.', 'Construimos el mañana digital.', 'Soluciones que escalan.'],
        products: ['Cloud Hosting', 'Consultoría IT', 'Desarrollo de software', 'SaaS Empresarial', 'Ciberseguridad', 'Inteligencia Artificial', 'Backend as a Service', 'Apps móviles'],
        about: ['Fundada hace más de una década, somos pioneros en la transformación digital.', 'Trabajamos con más de 200 clientes en toda Latinoamérica.', 'Nuestro equipo de ingenieros está distribuido en 8 países.'],
        cta: ['Solicitá una demo gratuita.', 'Hablá con un especialista.', 'Empezá tu transformación digital.'],
        accent: '#00d4ff', accentDark: '#005fa3'
    },
    food: {
        prefixes: ['Delicia', 'Sabores', 'Bocado', 'Ágora', 'Raíz', 'Fogón', 'Mesa', 'Sazón', 'Olla', 'Yunta'],
        suffixes: ['Gourmet', 'Catering', 'Foods', 'Delights', 'Cocina', 'Kitchen'],
        taglines: ['El sabor de lo nuestro.', 'Cocina con alma.', 'Tradición y vanguardia en cada plato.', 'Ingredientes frescos, resultados únicos.'],
        products: ['Menú ejecutivo', 'Catering para eventos', 'Deliveries gourmet', 'Viandas semanales', 'Clases de cocina', 'Pastelería artesanal'],
        about: ['Somos un emprendimiento familiar con más de 20 años.', 'Trabajamos con productores locales.', 'Cada plato se prepara con ingredientes frescos del día.'],
        cta: ['Reservá tu mesa hoy.', 'Pedí tu delivery.', 'Consultanos por eventos.'],
        accent: '#ff8844', accentDark: '#a04000'
    },
    travel: {
        prefixes: ['Horizonte', 'Ruta', 'Destino', 'Brújula', 'Nómada', 'Mochila', 'Épica', 'Cumbre', 'Travesía', 'Aurora'],
        suffixes: ['Travel', 'Tours', 'Viajes', 'Journeys', 'Expeditions', 'Aventura'],
        taglines: ['Tu próxima aventura empieza acá.', 'Descubrí el mundo con nosotros.', 'Viajes que se vuelven historias.', 'Más que un viaje, una experiencia.'],
        products: ['Paquetes al Caribe', 'Circuitos por Europa', 'Aventura en la Patagonia', 'Cruceros', 'Escapadas de fin de semana', 'Luna de miel'],
        about: ['Agencia con más de 15 años en turismo.', 'Operamos en 30 destinos nacionales e internacionales.', 'Trabajamos con las principales aerolíneas.'],
        cta: ['Cotizá tu viaje.', 'Consultá disponibilidad.', 'Reservá con un asesor.'],
        accent: '#44aaff', accentDark: '#005599'
    },
    banking: {
        prefixes: ['Capital', 'Finanza', 'Crédito', 'Ahorro', 'Confianza', 'Norte', 'Cimiento', 'Banco', 'Fides', 'Aurea'],
        suffixes: ['Bank', 'Financial', 'Capital', 'Investments', 'Group', 'Trust'],
        taglines: ['Tu dinero, seguro.', 'Construimos tu futuro financiero.', 'La banca del siglo XXI.', 'Inversiones inteligentes.'],
        products: ['Cuenta corriente', 'Plazo fijo', 'Préstamos personales', 'Tarjetas de crédito', 'Fondos de inversión', 'Seguros'],
        about: ['Institución financiera con presencia en 12 provincias.', 'Más de 500.000 clientes confían en nosotros.', 'Regulado por el Banco Central.'],
        cta: ['Abrí tu cuenta online.', 'Simulá tu préstamo.', 'Conocé nuestros beneficios.'],
        accent: '#44cc88', accentDark: '#006644'
    },
    sports: {
        prefixes: ['Fuerza', 'Pulso', 'Atleta', 'Meta', 'Gimnasio', 'Salto', 'Alto', 'Cumbre', 'Puro', 'Corredor'],
        suffixes: ['Sport', 'Fitness', 'Gym', 'Training', 'Athletics', 'Club'],
        taglines: ['Tu mejor versión empieza hoy.', 'Entrená con los mejores.', 'Resultados reales.', 'Superá tus límites.'],
        products: ['Membresías', 'Entrenamiento personal', 'Clases grupales', 'Nutrición deportiva', 'Tienda de indumentaria'],
        about: ['Gimnasio con más de 10 años en el mercado.', '3 sedes y 50 entrenadores certificados.', 'Clases para todas las edades.'],
        cta: ['Probá gratis una clase.', 'Consultanos por planes.', 'Reservá tu lugar.'],
        accent: '#ff5577', accentDark: '#a00030'
    },
    education: {
        prefixes: ['Saber', 'Mente', 'Formar', 'Aula', 'Campus', 'Academia', 'Brújula', 'Sendero', 'Ateneo'],
        suffixes: ['Academy', 'Institute', 'School', 'Learning', 'Edu', 'College'],
        taglines: ['Aprender es crecer.', 'Formación de excelencia.', 'Educación que transforma.', 'Tu futuro, nuestra misión.'],
        products: ['Cursos presenciales', 'Cursos online', 'Diplomaturas', 'Posgrados', 'Capacitaciones corporativas'],
        about: ['Institución educativa con 25 años de trayectoria.', 'Más de 10.000 egresados en todo el país.', 'Docentes con experiencia profesional.'],
        cta: ['Inscribite hoy.', 'Conocé los cursos.', 'Solicitá información.'],
        accent: '#aa77ff', accentDark: '#5500aa'
    },
    health: {
        prefixes: ['Vida', 'Bienestar', 'Cuidar', 'Clínica', 'Centro', 'Salud', 'Aurora', 'Vitalis', 'Cuidarte'],
        suffixes: ['Health', 'Medical', 'Clinic', 'Care', 'Wellness', 'Salud'],
        taglines: ['Tu salud, nuestra prioridad.', 'Cuidamos lo más importante.', 'Atención médica de excelencia.', 'Bienestar para toda la familia.'],
        products: ['Consultas médicas', 'Estudios de diagnóstico', 'Kinesiología', 'Nutrición', 'Odontología', 'Pediatría'],
        about: ['Centro médico con 40 profesionales.', 'Atendemos todas las obras sociales.', 'Equipamiento de última generación.'],
        cta: ['Solicitá tu turno.', 'Consultá disponibilidad.', 'Urgencias 24hs.'],
        accent: '#44ddff', accentDark: '#0077aa'
    },
    fashion: {
        prefixes: ['Estilo', 'Tendencia', 'Urbana', 'Época', 'Vitrina', 'Atelier', 'Silueta', 'Telar', 'Brío'],
        suffixes: ['Fashion', 'Style', 'Wear', 'Boutique', 'Store', 'Moda'],
        taglines: ['Vestí tu actitud.', 'Moda con identidad.', 'Nueva temporada, nuevas ideas.', 'Estilo sin esfuerzo.'],
        products: ['Indumentaria femenina', 'Indumentaria masculina', 'Accesorios', 'Calzado', 'Colección verano', 'Denim premium'],
        about: ['Marca de diseño independiente.', 'Telas de producción nacional.', 'Envíos a todo el país.'],
        cta: ['Ver nueva colección.', 'Suscribite al newsletter.', 'Encontrá tu local.'],
        accent: '#ff88cc', accentDark: '#990055'
    },
    auto: {
        prefixes: ['Motor', 'Rueda', 'Conducir', 'Taller', 'Garaje', 'Vértigo', 'Chasis', 'Pista', 'Carrera'],
        suffixes: ['Motors', 'Auto', 'Garage', 'Cars', 'Service', 'Automotores'],
        taglines: ['Manejá con confianza.', 'El auto de tus sueños.', 'Service oficial garantizado.', 'Pasión por los motores.'],
        products: ['Autos 0km', 'Usados certificados', 'Service oficial', 'Repuestos originales', 'Plan de ahorro'],
        about: ['Concesionario oficial con 20 años en el mercado.', 'Más de 5.000 autos entregados.', 'Financiación propia disponible.'],
        cta: ['Cotizá tu auto.', 'Agendá un test drive.', 'Consultanos por planes.'],
        accent: '#ffaa44', accentDark: '#996600'
    },
    music: {
        prefixes: ['Sonido', 'Ritmo', 'Melodía', 'Acorde', 'Sinfonía', 'Nota', 'Armonía', 'Pulso', 'Onda'],
        suffixes: ['Music', 'Records', 'Studio', 'Sound', 'Audio', 'Label'],
        taglines: ['La música que te mueve.', 'Sonido profesional.', 'Estudio de grabación.', 'Producción de alto nivel.'],
        products: ['Grabación en estudio', 'Mezcla y mastering', 'Producción musical', 'Clases de instrumentos', 'Alquiler de equipos'],
        about: ['Estudio profesional con equipamiento de última generación.', 'Trabajamos con artistas y sellos.', 'Más de 300 producciones realizadas.'],
        cta: ['Reservá tu sesión.', 'Escuchá nuestros trabajos.', 'Consultanos por tarifas.'],
        accent: '#dd44ff', accentDark: '#7700aa'
    },
    realestate: {
        prefixes: ['Hogar', 'Terreno', 'Propiedad', 'Metros', 'Llave', 'Umbral', 'Portal', 'Raíz', 'Nido'],
        suffixes: ['Properties', 'Real Estate', 'Homes', 'Group', 'Estates', 'Inmobiliaria'],
        taglines: ['Encontrá tu lugar en el mundo.', 'Tu próxima casa te espera.', 'Más que propiedades.', 'Tasaciones gratuitas.'],
        products: ['Venta de departamentos', 'Alquileres temporarios', 'Casas en barrios cerrados', 'Terrenos', 'Locales comerciales'],
        about: ['Inmobiliaria con 30 años de experiencia.', 'Más de 1.000 propiedades vendidas.', 'Equipo de 15 martilleros matriculados.'],
        cta: ['Buscá tu propiedad.', 'Pedí una tasación.', 'Contactá a un asesor.'],
        accent: '#88ddaa', accentDark: '#226644'
    },
    telecom: {
        prefixes: ['Conexión', 'Fibra', 'Señal', 'Enlace', 'Puente', 'Antena', 'Nodo', 'Circuito', 'Onda'],
        suffixes: ['Telecom', 'Comunicaciones', 'Network', 'Connect', 'Link', 'Fiber'],
        taglines: ['Conectamos tu mundo.', 'Internet de alta velocidad.', 'Sin cortes, sin excusas.', 'La red del futuro.'],
        products: ['Internet fibra óptica', 'Telefonía móvil', 'TV por cable', 'Planes empresariales', 'Telefonía fija'],
        about: ['Operador con presencia nacional.', 'Más de 500.000 hogares conectados.', 'Fibra óptica de última milla.'],
        cta: ['Contratá tu plan.', 'Verificá cobertura.', 'Atención 24/7.'],
        accent: '#44ffcc', accentDark: '#008877'
    },
    pets: {
        prefixes: ['Huella', 'Cola', 'Patita', 'Bigotes', 'Peludo', 'Rincón', 'Amigo', 'Collar', 'Hocico'],
        suffixes: ['Pets', 'Pet Shop', 'Veterinaria', 'Animals', 'Care', 'Mascotas'],
        taglines: ['Todo para tu mejor amigo.', 'Cuidamos a quien más querés.', 'Amor por los animales.', 'Nutrición y salud animal.'],
        products: ['Alimento balanceado', 'Veterinaria', 'Peluquería canina', 'Juguetes', 'Accesorios'],
        about: ['Pet shop con más de 15 años de trayectoria.', 'Contamos con servicio de veterinaria propio.', 'Envíos a domicilio.'],
        cta: ['Agendá turno con el veterinario.', 'Pedí tu delivery.', 'Conocé nuestras promos.'],
        accent: '#ffcc44', accentDark: '#997700'
    },
    jobs: {
        prefixes: ['Trabajo', 'Empleo', 'Oportunidad', 'Carrera', 'Talento', 'Puesto', 'Futuro', 'Despegue'],
        suffixes: ['Jobs', 'Empleos', 'Careers', 'Work', 'Talent', 'HR'],
        taglines: ['Encontrá el trabajo que buscás.', 'Conectamos talento con oportunidades.', 'Tu carrera empieza acá.', 'El empleo que merecés.'],
        products: ['Búsqueda de empleo', 'Publicación de ofertas', 'Head hunting', 'Consultoría RRHH', 'Capacitaciones'],
        about: ['Portal con más de 50.000 usuarios activos.', 'Trabajamos con las principales empresas.', 'Servicios gratuitos para postulantes.'],
        cta: ['Creá tu CV online.', 'Postulate a una oferta.', 'Publicá tu búsqueda.'],
        accent: '#66aaff', accentDark: '#005599'
    },
    construction: {
        prefixes: ['Cimiento', 'Estructura', 'Viga', 'Ladrillo', 'Andamio', 'Nivel', 'Plomada', 'Solidez'],
        suffixes: ['Construcciones', 'Obras', 'Build', 'Group', 'Ingeniería', 'Constructora'],
        taglines: ['Construimos confianza.', 'Obras de calidad garantizada.', 'Del plano a la realidad.', 'Solidez en cada proyecto.'],
        products: ['Construcción de viviendas', 'Refacciones', 'Obra pública', 'Proyectos industriales', 'Dirección de obra'],
        about: ['Constructora con más de 25 años en el rubro.', 'Cientos de obras terminadas.', 'Equipo de arquitectos e ingenieros.'],
        cta: ['Pedí tu presupuesto.', 'Consultanos por tu obra.', 'Agendá una visita.'],
        accent: '#ddaa77', accentDark: '#886633'
    },
    news: {
        prefixes: ['Diario', 'Noticia', 'Cronista', 'Boletín', 'Gaceta', 'Prensa', 'Alerta', 'Reporte'],
        suffixes: ['News', 'Times', 'Post', 'Press', 'Herald', 'Medio'],
        taglines: ['La verdad, siempre.', 'Periodismo independiente.', 'Información veraz al instante.', 'Las noticias que importan.'],
        products: ['Suscripción digital', 'Edición impresa', 'Newsletter diario', 'Contenido premium', 'Publicidad'],
        about: ['Medio con más de 40 años de historia.', 'Periodistas en todo el país.', 'Comprometidos con la verdad.'],
        cta: ['Suscribite hoy.', 'Ver edición digital.', 'Enviá tu noticia.'],
        accent: '#8899aa', accentDark: '#334455'
    }
};

// ============================================================
// HELPERS
// ============================================================
function wPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function wRandInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

function wSlug(str) {
    return String(str).toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
}

function wEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ============================================================
// GENERACIÓN DE SITIO
// ============================================================
function generateFakeWebsite() {
    const keys = Object.keys(WEB_INDUSTRIES);
    const industryKey = wPick(keys);
    const industry = WEB_INDUSTRIES[industryKey];

    const prefix = wPick(industry.prefixes);
    const suffix = wPick(industry.suffixes);
    const legal = wPick(['', ' S.A.', ' S.R.L.', ' & Co.', ' Group', ' Holdings', ' Corp.', ' Inc.']);
    const companyName = `${prefix} ${suffix}${legal}`;

    // Dominio
    const tld = wPick(WEB_TLDS);
    const useSuffix = Math.random() < 0.4;
    let slug = wSlug(prefix);
    if (useSuffix) slug += wSlug(suffix);
    const domain = slug + '.' + tld;

    const tagline = wPick(industry.taglines);
    const products = [...industry.products].sort(() => Math.random() - 0.5).slice(0, wRandInt(3, 6));
    const about = wPick(industry.about);
    const cta = wPick(industry.cta);

    // Features aleatorias
    const hasCookieBanner = Math.random() < 0.4;
    const hasConstructionBanner = Math.random() < 0.12;
    const hasChatWidget = Math.random() < 0.25;

    // Datos de contacto
    const telefono = typeof dGenerarTelefono === 'function' ? dGenerarTelefono() : '+00 000 000-0000';
    const direccion = typeof dGenerarDireccion === 'function' ? dGenerarDireccion() : 'Calle Falsa 123';
    const emailContacto = `contacto@${domain}`;
    const year = 2024 + Math.floor(Math.random() * 3);

    return {
        domain,
        companyName,
        industry: industryKey,
        tagline,
        accent: industry.accent,
        accentDark: industry.accentDark,
        products,
        about,
        cta,
        telefono,
        direccion,
        emailContacto,
        year,
        hasCookieBanner,
        hasConstructionBanner,
        hasChatWidget,
        nav: ['Inicio', 'Productos', 'Nosotros', 'Contacto'],
        productDescriptions: products.map(() => wPick([
            'Servicio profesional, rápido y confiable.',
            'Más de 10 años de experiencia en el rubro.',
            'Consultanos por descuentos especiales.',
            'Disponible en todas nuestras sucursales.',
            'Atención personalizada garantizada.',
            'Financiación disponible.',
            'Garantía oficial.',
            'Envíos a todo el país.'
        ]))
    };
}

// ============================================================
// RENDER DEL HTML DEL SITIO
// ============================================================
function renderFakeWebsiteHTML(site) {
    const productsHTML = site.products.map((p, i) => `
        <div class="web-product">
            <div class="web-product-mark" style="background:${site.accent}22; color:${site.accent}; border-color:${site.accent}55;">◆</div>
            <h3>${wEscape(p)}</h3>
            <p>${wEscape(site.productDescriptions[i])}</p>
        </div>
    `).join('');

    const cookieBanner = site.hasCookieBanner ? `
        <div class="web-cookie-banner">
            <p>Este sitio utiliza cookies para mejorar tu experiencia. Al continuar, aceptás nuestra política de privacidad.</p>
            <button>Aceptar</button>
        </div>
    ` : '';

    const constructionBanner = site.hasConstructionBanner ? `
        <div class="web-construction-banner">
            Sitio en construcción — algunas secciones pueden no estar disponibles
        </div>
    ` : '';

    const chatWidget = site.hasChatWidget ? `
        <div class="web-chat-widget">
            <div class="web-chat-bubble">?</div>
            <div class="web-chat-text">¿Necesitás ayuda?</div>
        </div>
    ` : '';

    return `
        <div class="web-site" style="--accent: ${site.accent}; --accent-dark: ${site.accentDark};">
            ${constructionBanner}

            <header class="web-site-header">
                <div class="web-site-logo">
                    <span class="web-site-logo-mark" style="background: ${site.accent};">${wEscape(site.companyName[0])}</span>
                    <span class="web-site-logo-text">${wEscape(site.companyName)}</span>
                </div>
                <nav class="web-site-nav">
                    ${site.nav.map(n => `<a href="#">${wEscape(n)}</a>`).join('')}
                </nav>
                <div class="web-site-header-cta">
                    <button class="web-site-btn-primary" style="background: ${site.accent};">Contactar</button>
                </div>
            </header>

            <section class="web-site-hero">
                <div class="web-site-hero-content">
                    <h1>${wEscape(site.companyName)}</h1>
                    <p class="web-site-tagline">${wEscape(site.tagline)}</p>
                    <button class="web-site-btn-primary web-site-btn-large" style="background: ${site.accent};">
                        ${wEscape(site.cta)}
                    </button>
                </div>
            </section>

            <section class="web-site-products">
                <h2>Nuestros productos</h2>
                <div class="web-site-products-grid">
                    ${productsHTML}
                </div>
            </section>

            <section class="web-site-about">
                <div class="web-site-about-col">
                    <h2>Sobre nosotros</h2>
                    <p>${wEscape(site.about)}</p>
                </div>
                <div class="web-site-about-col">
                    <h3>Contacto</h3>
                    <p><b>Teléfono:</b> ${wEscape(site.telefono)}</p>
                    <p><b>Email:</b> ${wEscape(site.emailContacto)}</p>
                    <p><b>Dirección:</b> ${wEscape(site.direccion)}</p>
                </div>
            </section>

            <footer class="web-site-footer">
                <div class="web-site-footer-left">
                    © ${site.year} ${wEscape(site.companyName)}. Todos los derechos reservados.
                </div>
                <div class="web-site-footer-right">
                    <a href="#">Términos</a>
                    <a href="#">Privacidad</a>
                    <a href="#" class="web-site-staff-link" onclick="openTerminalFromWeb(); return false;" title="Panel de administración">
                        Acceso empleados
                    </a>
                </div>
            </footer>

            ${cookieBanner}
            ${chatWidget}
        </div>
    `;
}

// ============================================================
// FS MÍNIMO — solo HTML y CSS sin valor
// ============================================================
function createWebServerFS(site) {
    const fs = {
        '/': { type: 'dir', children: ['var', 'etc', 'bin', 'home'] },
        '/var': { type: 'dir', children: ['www', 'log'] },
        '/var/www': { type: 'dir', children: ['html'] },
        '/var/www/html': { type: 'dir', children: ['index.html', 'style.css'] },
        '/var/log': { type: 'dir', children: ['access.log'] },
        '/etc': { type: 'dir', children: ['hostname', 'passwd'] },
        '/bin': { type: 'dir', children: [] },
        '/home': { type: 'dir', children: ['www-data'] },
        '/home/www-data': { type: 'dir', children: [] }
    };

    fs['/etc/hostname'] = makeFile(site.domain, 1, false, 0, 'basura');
    fs['/etc/passwd'] = makeFile(
        'root:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin',
        1, false, 0, 'basura'
    );
    fs['/var/log/access.log'] = makeFile(
        '[ACCESS LOG]\nGET / 200 OK\nGET /style.css 200 OK\nGET /favicon.ico 404 Not Found',
        3, false, 0, 'basura'
    );

    // El index.html y style.css — "código fuente" del sitio, sin valor
    fs['/var/www/html/index.html'] = makeFile(
        generateIndexHTMLFile(site),
        4, false, 0, 'basura'
    );
    fs['/var/www/html/style.css'] = makeFile(
        generateStyleCSSFile(site),
        2, false, 0, 'basura'
    );

    return fs;
}

function generateIndexHTMLFile(site) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${site.companyName} — ${site.tagline}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>${site.companyName}</h1>
    <nav>
      ${site.nav.map(n => `<a href="#">${n}</a>`).join('\n      ')}
    </nav>
  </header>
  <section class="hero">
    <h2>${site.tagline}</h2>
    <p>${site.cta}</p>
  </section>
  <section class="about">
    <h2>Sobre nosotros</h2>
    <p>${site.about}</p>
  </section>
  <footer>
    <p>© ${site.year} ${site.companyName}</p>
  </footer>
</body>
</html>`;
}

function generateStyleCSSFile(site) {
    return `/* ${site.companyName} — stylesheet */
body {
  font-family: sans-serif;
  margin: 0;
  color: #222;
}
header {
  background: ${site.accent};
  color: #fff;
  padding: 1rem 2rem;
}
nav a {
  color: #fff;
  margin-right: 1rem;
  text-decoration: none;
}
.hero {
  padding: 4rem 2rem;
  background: #f4f4f4;
}
.hero h2 {
  color: ${site.accentDark};
}
footer {
  text-align: center;
  padding: 1rem;
  background: #222;
  color: #fff;
}`;
}

// ============================================================
// CREACIÓN DEL SERVER WEB
// ============================================================
function createWebServerObject(ip, netIndex) {
    const site = generateFakeWebsite();

    const ports = [
        { port: 22, service: 'SSH', name: 'SSH', v: '0.5', state: 'blocked' },
        { port: 80, service: 'HTTP', name: 'HTTP', v: '0.5', state: 'blocked' }
    ];

    return {
        ip,
        name: site.companyName,
        alias: site.domain,
        ports,
        reqPorts: 1,
        accessed: false,
        traceLogPath: null,
        discovered: false,
        hasTrace: false,
        traceDuration: 0,
        securityLevel: 0.05,
        credentials: { user: 'admin', pass: 'admin' },
        credentialsRevealed: true,
        savedCredentials: null,
        downloadsDuringSession: 0,
        quickTraceTriggered: false,
        pinned: false,
        netIndex,
        tier: 1,
        profile: 'web',
        profileLabel: 'Servidor Web',
        primaryDir: '/var/www/html',
        firewall: null,
        fs: createWebServerFS(site),
        isWebServer: true,
        website: site,
        identity: { type: 'company', name: site.companyName }
    };
}

// ============================================================
// OVERLAY — Visor de sitios web
// ============================================================
function openWebViewer(server) {
    const overlay = document.getElementById('web-viewer-overlay');
    if (!overlay || !server || !server.website) return;

    const urlEl = document.getElementById('web-viewer-url');
    const tagEl = document.getElementById('web-viewer-tag');
    const content = document.getElementById('web-viewer-content');

    if (urlEl) urlEl.textContent = 'https://' + server.website.domain;
    if (tagEl) tagEl.textContent = 'SITIO PÚBLICO';
    if (content) content.innerHTML = renderFakeWebsiteHTML(server.website);

    overlay.style.display = 'flex';
    input.disabled = true;
    updateUI();
    try { if (typeof soundSuccess === 'function') soundSuccess(); } catch (e) {}
}

function closeWebViewer() {
    const overlay = document.getElementById('web-viewer-overlay');
    if (overlay) overlay.style.display = 'none';

    // Desconectar
    if (gameState.currentServer) resetServerAccess(gameState.currentServer);
    gameState.isConnected = false;
    gameState.isAuthenticated = false;
    gameState.currentIP = null;
    gameState.currentServer = null;
    remoteFS = {};
    remoteCWD = '/home/user';
    killAllProcesses();
    if (typeof stopTrace === 'function') stopTrace();

    output.innerHTML += `<span class="text-warning">Conexión cerrada.</span><br>`;
    output.scrollTop = output.scrollHeight;
    input.disabled = false;
    input.focus();
    lastProcessSignature = '__force__';
    updateUI();
    saveGame();
}

function openTerminalFromWeb() {
    const overlay = document.getElementById('web-viewer-overlay');
    if (overlay) overlay.style.display = 'none';

    const server = gameState.currentServer;
    if (!server) return;

    output.innerHTML += `<div class="msg-box" style="border-color:#00ff88;">
        <span class="text-success">[✓] Panel de administración abierto.</span><br>
        <span class="text-muted">Conectado a </span><span class="text-info">${server.name}</span><span class="text-muted"> (${server.ip}).</span><br>
        <span class="text-info">Tip: usá </span><span class="text-cmd">probe</span><span class="text-info"> para ver los puertos y </span><span class="text-cmd">run ssh_crack.exe 22</span><span class="text-info"> para empezar.</span>
    </div>`;
    output.scrollTop = output.scrollHeight;

    input.disabled = false;
    input.focus();
    updateUI();
    saveGame();
}

// Exports
window.openWebViewer = openWebViewer;
window.closeWebViewer = closeWebViewer;
window.openTerminalFromWeb = openTerminalFromWeb;