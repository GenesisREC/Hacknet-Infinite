// ============================================================
// NEWS.COM — Portal de noticias
// ============================================================

// ============================================================
// UPDATES — changelog manual
// ============================================================
const NEWS_UPDATES = [
    {
        version: 'v1.9.2',
        date: '2026-09-24',
        title: 'Defensa brute force, sospecha del operador, webs procedurales y quality of life',
        body: [
            // ─── DEFENSA BRUTE FORCE (MINIJUEGO) ───
            { text: 'Nuevo minijuego de defensa: si tu nivel de sospecha sube, un atacante intentará romper tu contraseña SSH en tiempo real. Tenés que cambiarla antes de que acierte.', tag: 'new' },
            { text: 'El ataque se dispara automáticamente cada 30 segundos, con chance escalada según tu sospecha: 15% de probabilidad con sospecha baja, 25% al 100%.', tag: 'new' },
            { text: 'Cinco rondas progresivas: cada una con menos tiempo, atacante más rápido y requisitos más estrictos para la nueva contraseña.', tag: 'new' },
            { text: 'Ronda 1: 30 segundos, mín. 6 caracteres. Ronda 2: 22s, mín. 8 caracteres + 1 mayúscula. Ronda 3: 15s, + 1 número. Ronda 4: 11s, + 1 símbolo + sin palabras comunes. Ronda 5: 8s, mín. 10 caracteres, 2 mayúsculas, 2 minúsculas, 2 números, 1 símbolo y 2 vocales.', tag: 'new' },
            { text: 'Nuevo sistema de letras prohibidas: cada ronda sortea letras del abecedario que no podés usar. Ronda 2 prohíbe 1 letra, ronda 3 prohíbe 2, ronda 4 prohíbe 3, ronda 5 prohíbe 4. Ejemplo: "Sin las letras: S · L · M · F".', tag: 'new' },
            { text: 'Las letras prohibidas se sortean al azar en cada ronda y nunca son las que ya usaste en contraseñas anteriores, para que siempre haya forma de ganar.', tag: 'bal' },
            { text: 'Nueva restricción: no podés repetir una contraseña que ya usaste en cualquier ronda anterior de la misma partida. Se valida en el propio checklist.', tag: 'new' },
            { text: 'Cartel naranja pulsante sobre el input mostrando las letras prohibidas de la ronda actual.', tag: 'new' },
            { text: 'Checklist dinámico: los requisitos cambian según la ronda y reflejan en vivo si la contraseña los cumple.', tag: 'new' },
            { text: 'Barra de fuerza de contraseña: rojo = DÉBIL, amarillo = MEDIA, verde = FUERTE. Las contraseñas que contienen palabras comunes del diccionario del atacante reciben penalización.', tag: 'new' },

            // ─── CONSECUENCIAS AL PERDER ───
            { text: 'Cadena de castigo al perder el minijuego: si tenés créditos te roban el 25% (mín 3.000 CR, máx 25.000 CR). Si no tenés CR, te borran un cracker extra (no los 3 iniciales).', tag: 'new' },
            { text: 'Si perdés sin créditos y solo tenés los 3 crackers iniciales, entrás automáticamente al modo Última Oportunidad.', tag: 'new' },
            { text: 'Al ganar el minijuego (sobrevivir 5 rondas) no perdés nada y el atacante desiste.', tag: 'new' },
            { text: 'Al ganar el lastchance, tu nivel de sospecha se resetea a 0 y la barra de News vuelve a verde.', tag: 'new' },

            // ─── EMAILS DEL HACKER ───
            { text: 'Si perdés el minijuego, el hacker te envía un email burlón a GoMail. Hay 7 plantillas distintas con tono variable: burlón, amenazante, decepcionado, cordial.', tag: 'new' },
            { text: 'Los emails llegan desde direcciones variadas (@darkweb.onion, @cyber-threat.io) y mencionan tu nombre de usuario, el monto robado o el cracker borrado.', tag: 'new' },

            // ─── SOSPECHA DEL OPERADOR ───
            { text: 'Nuevo sistema de sospecha: tu nivel aparece en una barra dedicada dentro de News.com, con tu nombre de operador a la izquierda.', tag: 'new' },
            { text: 'Cuatro estados visuales con colores y pulsaciones distintas: BAJO PERFIL (verde), VIGILADO (amarillo), BUSCADO (naranja) e IDENTIFICADO (rojo pulsante).', tag: 'new' },
            { text: 'El nivel sube al desconectarte con un rastreo activo sin borrar el log de conexión (+15 puntos).', tag: 'new' },
            { text: 'El nivel sube al vender archivos cuya conexión quedó registrada en el server (+10 puntos con tu nombre, +3 puntos si borraste el log y la venta queda anónima).', tag: 'new' },
            { text: 'El nivel sube al completar contratos de HackNet (+5 puntos), ya que los trabajos se publican en el mercado clandestino.', tag: 'new' },
            { text: 'Cada evento genera una noticia automática en News.com: con tu nombre si dejaste rastros, o como "filtración anónima" si lograste borrar el log antes de vender.', tag: 'new' },
            { text: 'Historial interno de los últimos 30 eventos de sospecha, con timestamp, monto, tipo y estado de identificación.', tag: 'new' },

            // ─── DECAY DE SOSPECHA ───
            { text: 'La sospecha ahora baja sola con el tiempo mientras estás desconectado y sin overlays abiertos: 1 punto cada 30s en BAJO PERFIL, cada 60s en VIGILADO, cada 90s en BUSCADO y cada 2 minutos en IDENTIFICADO.', tag: 'new' },
            { text: 'La barra de News muestra un indicador en vivo del ritmo de decay: "↓ 1pt / 60s" según tu nivel actual. Cuando estás conectado, avisa "↓ decay pausado (conectado)".', tag: 'new' },
            { text: 'Decay offline: si cerrás el juego y volvés después, la sospecha baja automáticamente hasta un tope de 40 puntos por carga. Ideal para bajar el perfil dejando la PC apagada.', tag: 'new' },

            // ─── EMAILS POR UMBRAL ───
            { text: 'Al cruzar el 21% de sospecha (VIGILADO), recibís un aviso de Cyber Defense Division en GoMail.', tag: 'new' },
            { text: 'Al cruzar el 51% (BUSCADO), recibís una notificación formal de Incident Response anunciando una investigación abierta.', tag: 'new' },
            { text: 'Al cruzar el 81% (IDENTIFICADO), recibís una orden de allanamiento de la Fiscalía Federal con plazo de 24 horas.', tag: 'new' },

            // ─── ABOGADO EN HACKNET ───
            { text: 'Nuevo comando "lawyer" en HackNet: contratás un servicio legal clandestino que borra tu nombre de los registros públicos y reduce tu sospecha en 50 puntos de un saque.', tag: 'new' },
            { text: 'El costo del abogado escala con tu exposición: desde 5.000 CR a 5% hasta 21.000 CR a 100%. Se confirma con "lawyer confirm".', tag: 'new' },
            { text: 'Al contratar el abogado, recibís un email del bufete confirmando la limpieza del expediente.', tag: 'new' },

            // ─── ALLANAMIENTO Y RAID ───
            { text: 'Al llegar al 100% de sospecha, se dispara una secuencia de allanamiento: unidad de cibercrimen detectada, protocolo de emergencia y countdown de 15 segundos antes de entrar al lastchance.', tag: 'new' },
            { text: 'El log del allanamiento tiene scroll propio con barra roja: el título y el countdown quedan siempre visibles aunque se acumulen mensajes.', tag: 'fix' },

            // ─── LAST CHANCE CON IP ALEATORIA ───
            { text: 'El servidor del centro de rastreo del lastchance ahora tiene una IP aleatoria cada vez (10.x, 172.16-31.x o 192.168.x) en vez de la fija 10.0.0.1.', tag: 'new' },
            { text: 'La IP del centro de rastreo aparece en el cartel de OBJETIVO del white terminal y en el mensaje "Usá connect X" del modo emergencia.', tag: 'new' },
            { text: 'Si recargás la página durante el white terminal o el lastchance, la IP se mantiene: se persiste en localStorage junto al resto del estado del lastchance.', tag: 'fix' },

            // ─── WEB SERVERS PROCEDURALES ───
            { text: 'Nuevo tipo de servidor: sitios web públicos. Aparecen aleatoriamente al escanear, marcados con [WEB] en el output del scan.', tag: 'new' },
            { text: '15 industrias distintas (tech, gastronomía, viajes, banca, deportes, educación, salud, moda, automotriz, música, inmobiliaria, telecomunicaciones, mascotas, empleos, construcción y prensa).', tag: 'new' },
            { text: 'Cada web server tiene un dominio único con TLD variado: .com, .io, .ar, .br, .mx, .cl, .es, .uk, .de, .jp y más de 40 opciones.', tag: 'new' },
            { text: 'Al conectarte a un web server, en vez del formulario de login aparece una página web completa con hero, productos, sección "sobre nosotros", contacto y footer.', tag: 'new' },
            { text: 'Algunas webs incluyen banners de cookies, widgets de chat flotantes o carteles de "sitio en construcción" para darle más variedad.', tag: 'new' },
            { text: 'Los web servers son fáciles de hackear a propósito: solo tienen SSH y HTTP en v0.5, sin firewall ni rastreo. La idea es que sean un objetivo relajado.', tag: 'bal' },
            { text: 'Dentro de un web server no hay archivos vendibles: solo index.html, style.css y logs de acceso. Todo vale 0 créditos.', tag: 'bal' },
            { text: 'Botón "ABRIR TERMINAL" siempre visible en la toolbar superior del sitio (verde pulsante) y también en el footer como "Acceso empleados".', tag: 'new' },
            { text: 'Los dominios completos de cada web aparecen en la barra de URL del visor, junto con el tag "SITIO PÚBLICO".', tag: 'new' },
            { text: 'Comando debug agregado: "debug web [n]" genera n web servers procedurales descubiertos, ideal para probar el feature.', tag: 'new' },

            // ─── COMANDOS DEBUG ───
            { text: 'Comandos debug agregados: "debug bf" lanza un ataque brute force manualmente, "debug suspicion [n]" muestra o setea el nivel de sospecha, "debug web [n]" spawnea web servers descubiertos.', tag: 'new' },

            // ─── NOTIFICACIONES ───
            { text: 'Nuevo sistema de notificaciones de mail: cuando llega un mensaje a GoMail, aparece un toast flotante, un badge en la barra superior y suena una alerta.', tag: 'new' },
            { text: 'El badge del top-bar muestra la cantidad de mails sin leer (ej: "3 MAIL") y desaparece cuando leés todos.', tag: 'new' },
            { text: 'Click en el badge o en el toast de mail abre GoMail automáticamente, cerrando otros overlays si hace falta.', tag: 'new' },

            // ─── WEBMAIL ───
            { text: 'Ahora podés borrar mails individualmente con un botón [×] en cada fila de la bandeja.', tag: 'new' },
            { text: 'Los mails vinculados a misiones activas quedan protegidos: no se pueden borrar hasta reclamar la recompensa en HackNet.', tag: 'new' },
            { text: 'Al intentar borrar un mail protegido, el row se sacude y aparece un banner de advertencia arriba de la bandeja.', tag: 'new' },

            // ─── TOASTS ───
            { text: 'Los toasts (mail, update de news, update del servidor) ahora se apilan automáticamente sin solaparse.', tag: 'new' },
            { text: 'Los toasts se reacomodan suavemente cuando cerrás uno, sin dejar huecos.', tag: 'fix' },

            // ─── IDS DE MISIÓN ───
            { text: 'Los IDs de misión ahora se muestran como badges destacados con formato "ID: M0001", más fáciles de ubicar al aceptar o reclamar.', tag: 'bal' },
            { text: 'Al aceptar una misión, el mensaje de confirmación incluye el comando exacto para reclamarla (ej: "claim M0001").', tag: 'fix' },

            // ─── HERRAMIENTAS ───
            { text: 'Ya no podés correr crackers que no tengas en /bin. Antes se ejecutaban silenciosamente en modo test y consumían RAM.', tag: 'fix' },
            { text: 'Al intentar correr una herramienta que no tenés, el juego te indica que la consigas en un server o en una misión de HackNet.', tag: 'fix' },
            { text: 'El mensaje de RAM insuficiente ahora muestra cuánta memoria necesita el proceso y cuánta tenés libre.', tag: 'fix' },

            // ─── ZIPs ───
            { text: 'Soporte completo de ZIPs sin contraseña: se abren directamente con "unzip archivo.zip".', tag: 'new' },
            { text: 'El comando ls ahora distingue entre [ZIP] (abierto) y [PROTEGIDO] (con clave).', tag: 'fix' },
            { text: 'El comando cat sobre un ZIP abierto muestra cuántos archivos contiene y cómo extraerlos.', tag: 'new' },
            { text: 'El Explorer también reconoce ambos tipos de ZIP y muestra los detalles en el preview.', tag: 'fix' },
            { text: 'Autocompletado con TAB activado para el comando unzip.', tag: 'fix' },

            // ─── PROBE ───
            { text: 'probe.com ahora incluye archivos personales de práctica (notas, diario, agenda, contactos) y dos ZIPs, uno con y otro sin contraseña.', tag: 'new' },
            { text: 'La contraseña del ZIP de práctica está anotada en algún archivo del propio server.', tag: 'new' },

            // ─── TUTORIAL ───
            { text: 'Tres pasos nuevos en el tutorial interactivo: explica qué son los ZIPs y te guía para abrir uno normal y uno con contraseña.', tag: 'new' },
            { text: 'Nuevo paso "Sospecha y limpieza legal" que explica el sistema completo: cómo sube, cómo baja y cuándo contratar al abogado.', tag: 'new' },
            { text: 'El tutorial ahora tiene 25 pasos en lugar de 19.', tag: 'new' },

            // ─── REVIEWS ───
            { text: 'Corregido bug en Reviews: si cambiabas de pestaña mientras cargaban, el contenido se pintaba encima de la otra pestaña.', tag: 'fix' },
            { text: 'El login de administrador ahora reemplaza el prompt nativo del navegador por un modal custom con el estilo del juego.', tag: 'new' },
            { text: 'El panel de admin valida la contraseña contra el backend antes de activarse. Antes, cualquier contraseña activaba el modo visual.', tag: 'fix' },
            { text: 'La sesión de admin guardada se re-valida al abrir la pestaña Reviews; si la clave ya no sirve, se limpia sola.', tag: 'fix' },

            // ─── UPDATE CHECKER ───
            { text: 'Corregido loop infinito del toast de actualización: si descartabas una versión, se guardaba para no volver a mostrarla.', tag: 'fix' },
            { text: 'El botón "RECARGAR AHORA" del toast de update marca la versión como vista antes de recargar.', tag: 'fix' },

            // ─── NOTICIAS ───
            { text: 'Las noticias ya no se generan al descargar archivos. Solo al venderlos en InfoMarket: el robo es silencioso hasta que se monetiza.', tag: 'bal' },
            { text: 'El comando unzip ya no muestra cada archivo extraído uno por uno. Solo un mensaje al final con el resumen.', tag: 'fix' },
            { text: 'Un solo ding al terminar la descompresión, en lugar de un pitido por archivo.', tag: 'fix' },

            // ─── EXPLORER ───
            { text: 'Corregido bug del Explorer: en carpetas vacías no aparecía el botón ".." para volver al nivel anterior.', tag: 'fix' },

            // ─── LORE / FLAVOR ───
            { text: 'El pool de archivos sin valor comercial (notas, chats, diarios, sátiras) pasó de 150 a 300 archivos únicos.', tag: 'new' },
            { text: 'Los archivos nuevos abarcan más categorías: sátira corporativa, referencias a videojuegos, foros oscuros, filosofía, diarios personales y más.', tag: 'new' },
            { text: 'Los archivos siguen sin repetirse en la misma partida: cada server recibe un set distinto.', tag: 'bal' },

            // ─── VARIOS ───
            { text: 'Eliminados prácticamente todos los emojis del juego, reemplazados por tags de texto coherentes con el estilo (ej: [ZIP], [PROTEGIDO], [ADMIN]).', tag: 'bal' },
            { text: 'Corregido bug en debug missions: mostraba las disponibles dos veces en lugar de las activas.', tag: 'fix' }
        ]
    },
   {
        version: 'v1.9.1',
        date: '2026-09-24',
        title: 'Balance de progresión: el avance ahora se siente',
        body: [
            { text: 'Rebalanceo completo de los 9 tiers de servidores. Ahora cada tier es 100% rompible desde el inicio y ~66% al entrar al siguiente.', tag: 'bal' },
            { text: 'El tier "Iniciado" ya no genera puertos por encima del nivel del jugador. Antes ~29% de los servers iniciales eran in-hackeables con los crackers base.', tag: 'bal' },
            { text: 'Los tiers superiores comienzan en el nivel exacto donde el jugador acaba el tier anterior. La progresión es continua en lugar de tener saltos.', tag: 'bal' },
            { text: 'Las misiones de HackNet ahora garantizan siempre al menos la cantidad de puertos rompibles necesarios para completarlas.', tag: 'fix' },
            { text: 'Algunos puertos de las misiones siguen siendo in-hackeables a propósito, para mantener la sensación de dificultad.', tag: 'bal' },
            { text: 'Conseguir crackers sigue siendo difícil fuera de las misiones: la fuente principal son los contratos de HackNet y las recompensas de misiones.', tag: 'bal' },
            { text: 'Ahora pasar de un tier a otro requiere unas pocas misiones y se nota el cambio de inmediato al ver servidores nuevos con más servicios.', tag: 'bal' }
        ]
    },
    {
        version: 'v1.9.0',
        date: '2026-09-23',
        title: 'Tutorial interactivo, NetMap más legible y probe.com sin firewall',
        body: [
            { text: 'Nuevo tutorial interactivo paso a paso: te guía por tu primer hackeo completo, desde abrir el NetMap hasta vender en el mercado.', tag: 'new' },
            { text: 'El tutorial vive en HELP.exe, un archivo que está en /home/user/documentos/. Se abre con "run HELP.exe" y se borra con "rm HELP.exe" para cerrarlo definitivamente.', tag: 'new' },
            { text: 'Al terminar el setup, ahora podés elegir entre "Tutorial Interactivo" o "Modo Experto". La elección no se puede cambiar sin reiniciar la partida.', tag: 'new' },
            { text: 'El tutorial incluye introducciones a GoMail, HackNet, InfoMarket y News.com sin forzarte a entrar en medio del tutorial.', tag: 'new' },
            { text: 'El panel derecho ahora usa pestañas: HELP.exe y Procesos Activos conviven sin pisarse cuando el manual está abierto.', tag: 'new' },
            { text: 'El servidor de pruebas (probe.com) ya no tiene firewall ni rastreo. Es un entorno libre para practicar con cualquier herramienta.', tag: 'fix' },
            { text: 'Los números y etiquetas del NetMap ahora escalan al hacer zoom, manteniéndose legibles en cualquier nivel.', tag: 'fix' },
            { text: 'El NetMap ahora se puede arrastrar y hacer zoom con gestos táctiles: un dedo para mover, dos dedos para pellizcar.', tag: 'new' },
            { text: 'El juego es jugable en celulares y tablets: layout adaptado a pantallas verticales, controles táctiles y viewport optimizado.', tag: 'new' },
            { text: 'Los efectos :hover ya no se quedan "pegados" después de un tap en dispositivos táctiles.', tag: 'fix' },
            { text: 'Cuando aparece el teclado virtual, la terminal se scrollea automáticamente para que el prompt no quede tapado.', tag: 'fix' },
            { text: 'Se eliminó el detector de DevTools: disparaba falsos positivos al abrir el teclado en mobile, rotar la pantalla o cambiar de app.', tag: 'fix' },
            { text: 'Los pasos del tutorial que requieren escribir comandos incluyen un botón USAR que los completa en la terminal, ideal para mobile.', tag: 'new' }
        ]
    },
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

    if (typeof renderSuspicionBar === 'function') {
        try { renderSuspicionBar(); } catch (e) {}
    }

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
    setTimeout(_restackToasts, 10);
}

function hideUpdateToast() {
    const toast = document.getElementById('update-toast');
    if (toast) toast.style.display = 'none';
    clearTimeout(window._updateToastTimer);
    setTimeout(_restackToasts, 20);
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