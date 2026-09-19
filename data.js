// ============================================================
// BASES DE DATOS PARA GENERACIÓN ALEATORIA
// ============================================================
// Listas grandes + generadores combinatorios. Todo lo que se
// genere acá es virtualmente irrepetible.
// ============================================================

// ==== NOMBRES ====
const D_NOMBRES_M = [
    'Juan', 'Pedro', 'Carlos', 'Luis', 'Miguel', 'Jorge', 'Diego', 'Pablo', 'Andrés', 'Fernando',
    'Roberto', 'Alejandro', 'Martín', 'Santiago', 'Nicolás', 'Franco', 'Gonzalo', 'Matías', 'Tomás', 'Bruno',
    'Federico', 'Emiliano', 'Joaquín', 'Thiago', 'Benjamín', 'Facundo', 'Iván', 'Rodrigo', 'Leandro', 'Ezequiel',
    'Sebastián', 'Agustín', 'Ramiro', 'Felipe', 'Ricardo', 'Eduardo', 'Javier', 'Sergio', 'Héctor', 'Manuel',
    'Raúl', 'Alberto', 'Enrique', 'Óscar', 'Rubén', 'Damián', 'Cristian', 'Marcelo', 'Claudio', 'Hugo',
    'Esteban', 'Gabriel', 'Mauricio', 'Ariel', 'Dante', 'Lucas', 'Mateo', 'Valentino', 'Bautista', 'Ciro',
    'Simón', 'Lorenzo', 'Félix', 'Ramón', 'Salvador', 'Ernesto', 'Adolfo', 'Rogelio', 'Antonio', 'Julio',
    'Augusto', 'Ignacio', 'Néstor', 'Osvaldo', 'Norberto', 'Rafael', 'Arturo', 'Bernardo', 'Dylan', 'Enzo',
    'Gael', 'Ian', 'Kevin', 'Lautaro', 'Máximo', 'Noah', 'Owen', 'Pietro', 'Renzo', 'Tobías',
    'Ulises', 'Vicente', 'Walter', 'Xavier', 'Yago', 'Zacarías', 'Adrián', 'Benicio', 'Cristóbal', 'Elías'
];

const D_NOMBRES_F = [
    'María', 'Ana', 'Laura', 'Sofía', 'Valentina', 'Camila', 'Martina', 'Lucía', 'Catalina', 'Mía',
    'Isabella', 'Delfina', 'Victoria', 'Julieta', 'Agustina', 'Florencia', 'Micaela', 'Rocío', 'Abril', 'Renata',
    'Emma', 'Olivia', 'Zoe', 'Alma', 'Lola', 'Mora', 'Pilar', 'Clara', 'Elena', 'Paula',
    'Carla', 'Daniela', 'Andrea', 'Gabriela', 'Silvina', 'Mariana', 'Verónica', 'Romina', 'Soledad', 'Carolina',
    'Belén', 'Milagros', 'Guadalupe', 'Yamila', 'Antonella', 'Malena', 'Josefina', 'Milena', 'Alina', 'Bianca',
    'Cecilia', 'Lorena', 'Marcela', 'Patricia', 'Sandra', 'Silvia', 'Susana', 'Teresa', 'Viviana', 'Adriana',
    'Alicia', 'Beatriz', 'Carmen', 'Cristina', 'Estela', 'Eugenia', 'Fernanda', 'Gloria', 'Irene', 'Jacqueline',
    'Karina', 'Liliana', 'Manuela', 'Natalia', 'Noelia', 'Olga', 'Rita', 'Rosa', 'Stella', 'Tatiana',
    'Ursula', 'Verena', 'Ximena', 'Yolanda', 'Zulma', 'Amanda', 'Brenda', 'Constanza', 'Dana', 'Erika'
];

const D_SEGUNDOS_NOMBRES = [
    'Carlos', 'Alberto', 'Antonio', 'Andrés', 'Esteban', 'Fernando', 'Gabriel', 'Gustavo', 'Hernán', 'Ignacio',
    'Javier', 'Joaquín', 'José', 'Juan', 'León', 'Manuel', 'Marcelo', 'Martín', 'Mateo', 'Matías',
    'Nicolás', 'Pablo', 'Pedro', 'Rafael', 'Ramón', 'Ricardo', 'Roberto', 'Rodrigo', 'Salvador', 'Santiago',
    'Sebastián', 'Sergio', 'Tomás', 'Valentín', 'Vicente', 'Alejandro', 'Alfonso', 'Álvaro', 'Benito', 'Bruno',
    'Cristóbal', 'Damián', 'Eduardo', 'Emilio', 'Enrique', 'Ernesto', 'Fabián', 'Federico', 'Felipe', 'Francisco',
    'Gerardo', 'Guillermo', 'Hugo', 'Ismael', 'Jorge', 'Julio', 'Lorenzo', 'Lucas', 'Luis', 'Mariano',
    'Mauricio', 'Miguel', 'Néstor', 'Norberto', 'Octavio', 'Osvaldo', 'Patricio', 'Raúl', 'René', 'Rubén',
    'Saúl', 'Simón', 'Teodoro', 'Ulises', 'Uriel', 'Walter', 'Wenceslao', 'Xavier', 'Yago', 'Zacarías'
];

const D_APELLIDOS = [
    'González', 'Rodríguez', 'Gómez', 'Fernández', 'López', 'Díaz', 'Martínez', 'Pérez', 'García', 'Sánchez',
    'Romero', 'Sosa', 'Torres', 'Álvarez', 'Ruiz', 'Ramírez', 'Flores', 'Acosta', 'Benítez', 'Medina',
    'Herrera', 'Aguirre', 'Giménez', 'Molina', 'Silva', 'Castro', 'Rojas', 'Ortiz', 'Núñez', 'Luna',
    'Juárez', 'Cabrera', 'Ríos', 'Morales', 'Godoy', 'Moreno', 'Ferreyra', 'Domínguez', 'Carrizo', 'Peralta',
    'Castillo', 'Ledesma', 'Quiroga', 'Vega', 'Vera', 'Villalba', 'Maldonado', 'Campos', 'Ibarra', 'Cardozo',
    'Suárez', 'Pereyra', 'Figueroa', 'Cáceres', 'Chávez', 'Franco', 'Ferreira', 'Aguilar', 'Méndez', 'Salazar',
    'Vargas', 'Bravo', 'Paz', 'Coronel', 'Soto', 'Córdoba', 'Miranda', 'Ponce', 'Ramos', 'Serrano',
    'Reyes', 'Ojeda', 'Paredes', 'Zárate', 'Valdez', 'Andrada', 'Barrios', 'Bustos', 'Calderón', 'Cano',
    'Carrasco', 'Contreras', 'Cortés', 'Cuevas', 'Delgado', 'Duarte', 'Escobar', 'Espinoza', 'Estrada', 'Gaitán',
    'Galván', 'Guzmán', 'Heredia', 'Ibáñez', 'León', 'Lozano', 'Lucero', 'Márquez', 'Mejía', 'Mendoza',
    'Montes', 'Navarro', 'Ochoa', 'Oliva', 'Orellana', 'Osorio', 'Palacios', 'Peña', 'Pineda', 'Portillo',
    'Quintero', 'Rendón', 'Restrepo', 'Rivera', 'Robles', 'Rosales', 'Salas', 'Salinas', 'Sanabria', 'Sandoval',
    'Santos', 'Solano', 'Tapia', 'Toledo', 'Trejo', 'Uribe', 'Valencia', 'Vallejo', 'Varela', 'Vásquez',
    'Velásquez', 'Vergara', 'Villanueva', 'Yáñez', 'Zambrano', 'Zapata', 'Alonso', 'Andrade', 'Arce', 'Arias'
];

// ==== CONTACTO / UBICACIÓN ====
const D_DOMINIOS_MAIL = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.com',
    'protonmail.com', 'icloud.com', 'mail.com', 'aol.com', 'gmx.com',
    'zoho.com', 'yandex.com', 'tutanota.com', 'fastmail.com', 'hushmail.com'
];

const D_CALLES = [
    'Av. Corrientes', 'Av. Rivadavia', 'Av. Santa Fe', 'Av. Belgrano', 'Av. 9 de Julio',
    'Av. Libertador', 'Av. Callao', 'Av. Córdoba', 'Av. San Martín', 'Av. Mitre',
    'Calle Florida', 'Calle Lavalle', 'Calle Sarmiento', 'Calle Esmeralda', 'Calle Suipacha',
    'Calle Maipú', 'Calle Reconquista', 'Calle Alem', 'Calle Balcarce', 'Calle Defensa',
    'Calle Belgrano', 'Calle Alvear', 'Calle Ayacucho', 'Calle Junín', 'Calle Salta',
    'Av. Directorio', 'Av. La Plata', 'Av. Vélez Sarsfield', 'Av. Carabobo', 'Calle Moreno',
    'Calle Constitución', 'Calle Humberto Primo', 'Calle Bolívar', 'Calle Chile', 'Calle México',
    'Calle Venezuela', 'Calle Perú', 'Calle Estados Unidos', 'Av. Caseros', 'Av. San Juan',
    'Av. Independencia', 'Av. Brasil', 'Av. Warnes', 'Av. Díaz Vélez', 'Av. Ángel Gallardo',
    'Av. Estado de Israel', 'Av. Pueyrredón', 'Av. Scalabrini Ortiz', 'Av. Bullrich', 'Av. Santa Fe'
];

const D_CIUDADES = [
    'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata',
    'Mar del Plata', 'Salta', 'San Miguel de Tucumán', 'Santa Fe', 'San Juan',
    'Resistencia', 'Neuquén', 'Corrientes', 'Posadas', 'Bahía Blanca',
    'Paraná', 'Santiago del Estero', 'Jujuy', 'Río Cuarto', 'Comodoro Rivadavia',
    'San Luis', 'Tandil', 'Olavarría', 'Pergamino', 'Rafaela',
    'Santa Rosa', 'Trelew', 'Ushuaia', 'Río Gallegos', 'Bariloche'
];

const D_PROVINCIAS = [
    'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut',
    'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
    'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén',
    'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
    'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
];

const D_PAISES = [
    'Argentina', 'Uruguay', 'Chile', 'Brasil', 'Paraguay', 'Bolivia',
    'Perú', 'Colombia', 'Venezuela', 'Ecuador', 'México', 'España',
    'Estados Unidos', 'Canadá', 'Francia', 'Italia', 'Alemania', 'Reino Unido',
    'Países Bajos', 'Suiza', 'Suecia', 'Japón', 'China', 'Australia'
];

// ==== FINANCIERO ====
const D_BANCOS = [
    'Banco Nación', 'Banco Provincia', 'Banco Galicia', 'Santander Río', 'BBVA',
    'HSBC', 'Citibank', 'ICBC', 'Banco Macro', 'Banco Francés',
    'Brubank', 'Ualá', 'Naranja X', 'Mercado Pago', 'Banco Hipotecario',
    'Banco Supervielle', 'Banco Ciudad', 'Banco Patagonia', 'Banco Comafi', 'Banco Credicoop',
    'Banco Itaú', 'Banco Piano', 'Banco del Sol', 'Bancor', 'Banco Coinag'
];

const D_MONEDAS = ['USD', 'EUR', 'ARS', 'BRL', 'GBP', 'CHF', 'JPY', 'CNY'];

// ==== EMPRESAS ====
const D_TIPOS_EMPRESA = ['S.A.', 'S.R.L.', 'S.A.S.', 'Inc.', 'LLC', 'Ltd.', 'Corp.', 'GmbH', 'PLC', 'S.p.A.'];

const D_PREFIJOS_EMPRESA = [
    'Tech', 'Data', 'Global', 'National', 'United', 'Cyber', 'Net', 'Info', 'Neo', 'Alpha',
    'Beta', 'Delta', 'Omega', 'Prime', 'First', 'Union', 'Central', 'Inter', 'Multi', 'Omni',
    'Quantum', 'Digital', 'Smart', 'Future', 'Next', 'Blue', 'Red', 'Silver', 'Golden', 'Nova',
    'Nexus', 'Vertex', 'Apex', 'Zenith', 'Pinnacle', 'Summit', 'Peak', 'Core', 'Edge', 'Star',
    'Atlas', 'Orion', 'Vega', 'Sirius', 'Polaris', 'Andromeda', 'Phoenix', 'Titan', 'Hydra', 'Fénix'
];

const D_SUFIJOS_EMPRESA = [
    'Solutions', 'Systems', 'Corp', 'Industries', 'Group', 'Holdings', 'Partners', 'Associates',
    'Enterprises', 'Ventures', 'Technologies', 'Networks', 'Communications', 'Consulting',
    'Services', 'Logistics', 'Trading', 'Investments', 'Capital', 'Financial'
];

// ==== TEXTOS GENÉRICOS ====
const D_TEMAS_CHAT = [
    'Reunión', 'Proyecto', 'Cliente', 'Presupuesto', 'Pago', 'Entrega', 'Diseño', 'Desarrollo',
    'Marketing', 'Ventas', 'Soporte', 'Reclamo', 'Cita', 'Consulta', 'Contrato', 'Factura',
    'Actualización', 'Migración', 'Auditoría', 'Documentación'
];

const D_ASUNTOS_CORREO = [
    'Reunión confirmada', 'Presupuesto adjunto', 'Solicitud de cambios', 'Re: propuesta',
    'Entrega final', 'Consulta urgente', 'Recordatorio de pago', 'Confirmación de pedido',
    'Nuevas credenciales', 'Actualización de datos', 'Bienvenido', 'Problema técnico',
    'Aprobación pendiente', 'Revisión semanal', 'Fwd: documentación', 'Alta de usuario',
    'Baja de servicio', 'Solicitud de acceso', 'Entrega de informe', 'Cambio de contraseña'
];

const D_FRASES_CORREO = [
    'Te adjunto lo que me pediste.',
    'Quedo a la espera de tu respuesta.',
    'Cualquier cosa avisame.',
    'Saludos cordiales.',
    'Nos vemos mañana.',
    'Gracias por la paciencia.',
    'Por favor confirmame cuando puedas.',
    'No te olvides de revisar esto.',
    'Atentamente.',
    'Un abrazo.',
    'Ya lo revisé, está todo OK.',
    'Necesito respuesta para ayer.',
    'Adjunto lo solicitado.',
    'Cualquier duda, avisame.',
    'Gracias de antemano.'
];

const D_NOTAS_VARIAS = [
    'Comprar café', 'Llamar al plomero', 'Revisar el server el lunes', 'Cargar el celular',
    'Pagar el alquiler', 'Comprar 2 kg de pan', 'Ir al médico el jueves', 'Renovar el dominio',
    'Hablar con marketing', 'Preparar informe mensual', 'Responder mails pendientes', 'Actualizar el backup',
    'Pasar por el correo', 'Imprimir contratos', 'Reservar sala de reuniones', 'Comprar pasajes',
    'Llamar al banco', 'Revisar el auto', 'Comprar lamparitas', 'Cambiar el filtro de agua',
    'Buscar regalo de cumpleaños', 'Renovar el DNI', 'Sacar turno médico', 'Pagar la luz',
    'Pagar el gas', 'Comprar nuevo teclado', 'Arreglar la puerta', 'Llamar al seguro',
    'Revisar la factura de internet', 'Planificar las vacaciones'
];

const D_CONTRASEÑAS_COMUNES = [
    '123456', 'password', '12345678', 'qwerty', '123456789',
    'letmein', 'admin', 'welcome', 'monkey', 'abc123',
    'root', 'toor', 'pass', 'admin123', 'test123',
    'qwerty123', 'asdfgh', 'zxcvbn', 'iloveyou', 'princess',
    '111111', '1234567', 'sunshine', 'master', 'shadow'
];

const D_SUCURSALES = [
    'Central', 'Norte', 'Sur', 'Este', 'Oeste',
    'Centro', 'Palermo', 'Belgrano', 'Caballito', 'Recoleta',
    'Retiro', 'San Telmo', 'Villa Crespo', 'Nuñez', 'Flores'
];

const D_ESTADOS = ['ACTIVO', 'PENDIENTE', 'SUSPENDIDO', 'CERRADO', 'EN REVISIÓN', 'APROBADO', 'RECHAZADO'];

// ============================================================
// GENERADORES
// ============================================================
function dRandInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function dPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function dShuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function dQuitarAcentos(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function dGenerarNombreCompleto() {
    const esMujer = Math.random() < 0.5;
    const primerNombre = esMujer ? dPick(D_NOMBRES_F) : dPick(D_NOMBRES_M);
    const conSegundo = Math.random() < 0.35;
    const segundoNombre = conSegundo ? dPick(D_SEGUNDOS_NOMBRES) : null;
    const apellido = dPick(D_APELLIDOS);
    const dobleApellido = Math.random() < 0.08;
    const apellido2 = dobleApellido ? dPick(D_APELLIDOS) : null;
    let nombre = primerNombre;
    if (segundoNombre) nombre += ' ' + segundoNombre;
    nombre += ' ' + apellido;
    if (apellido2) nombre += ' ' + apellido2;
    return { nombre, primerNombre, segundoNombre, apellido, apellido2, esMujer };
}

function dGenerarDNI() {
    return `${dRandInt(20, 45)}.${dRandInt(100, 999)}.${dRandInt(100, 999)}`;
}

function dGenerarTelefono() {
    const prefijo = dPick(['11', '221', '223', '261', '264', '299', '341', '342', '351', '381', '385', '387']);
    return `+54 ${prefijo} ${dRandInt(4000, 9999)}-${dRandInt(1000, 9999)}`;
}

function dGenerarEmail(nombre) {
    const dom = dPick(D_DOMINIOS_MAIL);
    const limpio = dQuitarAcentos(nombre.toLowerCase());
    const partes = limpio.split(/\s+/);
    const inicial = partes[0] ? partes[0][0] : 'x';
    const apellido = partes[partes.length - 1] || 'user';
    const num = Math.random() < 0.6 ? dRandInt(1, 99) : '';
    const formato = dRandInt(0, 3);
    let local;
    if (formato === 0) local = `${partes[0]}.${apellido}${num}`;
    else if (formato === 1) local = `${inicial}${apellido}${num}`;
    else if (formato === 2) local = `${partes[0]}${num}`;
    else local = `${inicial}.${apellido}${num}`;
    return `${local}@${dom}`;
}

function dGenerarDireccion() {
    return `${dPick(D_CALLES)} ${dRandInt(100, 9999)}, ${dPick(D_CIUDADES)}, ${dPick(D_PROVINCIAS)}`;
}

function dGenerarTarjeta() {
    const tipo = dRandInt(0, 2);
    let prefijo;
    if (tipo === 0) prefijo = '4' + dRandInt(100, 999);
    else if (tipo === 1) prefijo = '5' + dRandInt(100, 599);
    else prefijo = '3' + dRandInt(400, 499);
    return `${prefijo}-${dRandInt(1000, 9999)}-${dRandInt(1000, 9999)}-${dRandInt(1000, 9999)}`;
}

function dGenerarVencimiento() {
    return `${String(dRandInt(1, 12)).padStart(2, '0')}/${dRandInt(24, 30)}`;
}

function dGenerarCVV() { return String(dRandInt(100, 999)); }

function dGenerarCUIT() {
    return `${dRandInt(20, 34)}-${dRandInt(10000000, 99999999)}-${dRandInt(0, 9)}`;
}

function dGenerarCBU() {
    let cbu = '';
    for (let i = 0; i < 22; i++) cbu += dRandInt(0, 9);
    return cbu;
}

function dGenerarIBAN() {
    return `ES${dRandInt(10, 99)} ${dRandInt(1000, 9999)} ${dRandInt(1000, 9999)} ${dRandInt(1000, 9999)} ${dRandInt(1000, 9999)}`;
}

function dGenerarUsuario(nombre) {
    const limpio = dQuitarAcentos(nombre.toLowerCase());
    const partes = limpio.split(/\s+/);
    const base = partes[0][0] + (partes[1] || partes[0]);
    return `${base}${dRandInt(1, 999)}`;
}

function dGenerarEmpresa() {
    return `${dPick(D_PREFIJOS_EMPRESA)} ${dPick(D_SUFIJOS_EMPRESA)} ${dPick(D_TIPOS_EMPRESA)}`;
}

function dGenerarFactura() {
    return `FA-${dRandInt(2022, 2025)}-${String(dRandInt(1, 99999)).padStart(5, '0')}`;
}

function dGenerarFecha() {
    const y = dRandInt(2022, 2025);
    const m = String(dRandInt(1, 12)).padStart(2, '0');
    const d = String(dRandInt(1, 28)).padStart(2, '0');
    return `${d}/${m}/${y}`;
}

function dGenerarHora() {
    return `${String(dRandInt(0, 23)).padStart(2, '0')}:${String(dRandInt(0, 59)).padStart(2, '0')}`;
}

function dGenerarIP() {
    return `${dRandInt(1, 254)}.${dRandInt(0, 255)}.${dRandInt(0, 255)}.${dRandInt(1, 254)}`;
}

function dGenerarMonto(min, max) {
    return dRandInt(min || 100, max || 500000);
}