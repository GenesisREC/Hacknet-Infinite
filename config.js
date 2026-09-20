// ============================================================
// SAVE VERSIONING & MIGRATION
// ============================================================
const SAVE_KEY = 'hacknet_save';                        // clave unificada actual
const SAVE_KEY_LEGACY = ['hacknet_save_v3', 'hacknet_save_v2', 'hacknet_save_v1'];
const SAVE_VERSION = 4;                                 // ← subir cuando rompas compatibilidad
const UPDATE_SEEN_KEY = 'hacknet_last_seen_version';

// Info mostrada en el overlay de migración (por versión objetivo)
const SAVE_VERSION_INFO = {
    4: {
        release: 'v1.6.0',
        label: 'Actualización mayor',
        highlights: [
            'Sistema de noticias y NetMap ampliado',
            'Reformulación de misiones y archivos procedurales',
            'Nuevo motor de audio por animación'
        ]
    },
    3: { release: 'v1.0.0', label: 'Lanzamiento inicial', highlights: [] }
};

const TOOL_TEMPLATES = {
    'ssh_crack.exe':    { service: 'SSH',    defaultPort: 22,   ram: 1.0,  anim: 'ssh' },
    'sql_crack.exe':    { service: 'SQL',    defaultPort: 1433, ram: 0.9,  anim: 'sql' },
    'http_crack.exe':   { service: 'HTTP',   defaultPort: 80,   ram: 0.8,  anim: 'http' },
    'ftp_crack.exe':    { service: 'FTP',    defaultPort: 21,   ram: 0.9,  anim: 'ftp' },
    'smtp_crack.exe':   { service: 'SMTP',   defaultPort: 25,   ram: 1.0,  anim: 'smtp' },
    'telnet_crack.exe': { service: 'TELNET', defaultPort: 23,   ram: 1.1,  anim: 'telnet' },
    'dns_crack.exe':    { service: 'DNS',    defaultPort: 53,   ram: 0.85, anim: 'dns' },
    'wallbreaker.exe':  { service: 'FIREWALL', defaultPort: null, ram: 0.9, anim: 'wallbreaker', isApp: true }
};
const ALL_TOOL_NAMES = Object.keys(TOOL_TEMPLATES);
const CRACKER_NAMES = ['ssh_crack.exe', 'sql_crack.exe', 'http_crack.exe', 'ftp_crack.exe', 'smtp_crack.exe', 'telnet_crack.exe', 'dns_crack.exe'];

const RAM_UPGRADES = [
    { ram: 1.6, price: 25000 }, { ram: 2.0, price: 60000 }, { ram: 2.5, price: 110000 },
    { ram: 3.0, price: 180000 }, { ram: 4.0, price: 300000 }
];
const CPU_UPGRADES = [
    { mult: 0.90, price: 20000,  label: 'Dual-Core 3.2GHz' },
    { mult: 0.78, price: 55000,  label: 'Quad-Core 4.0GHz' },
    { mult: 0.62, price: 130000, label: 'Octa-Core 4.8GHz' },
    { mult: 0.45, price: 280000, label: 'Quantum 8-Qubit' }
];
const ANTENNA_UPGRADES = [
    { range: 1.20, price: 15000, label: 'Yagi 5dBi' },
    { range: 1.50, price: 42000, label: 'Parabólica 12dBi' },
    { range: 1.90, price: 100000, label: 'Phased Array' },
    { range: 2.40, price: 220000, label: 'Quantum Relay' }
];

const USERNAME_POOL = ['admin','root','user','sysadmin','operator','guest','manager','webmaster','support'];
const PASSWORD_POOL = ['123456','admin','password','qwerty','letmein','hunter2','root','toor','pass123','welcome','changeme','p@ssw0rd','letmein1'];
const PROBE_SECRET_CODE = 'Lugones258965474123';

const FILE_CATEGORIES = {
    financiero:  { basePerKB15: 26, cap: Infinity, label: 'Financiero'  },
    personal:    { basePerKB15: 15, cap: 50000,    label: 'Personal'    },
    corporativo: { basePerKB15: 10, cap: 5000,     label: 'Corporativo' },
    basura:      { basePerKB15: 5,  cap: 200,      label: 'Basura'      }
};
const CATEGORY_TIER_SCALE = { basura: 0.03, corporativo: 0.12, personal: 0.20, financiero: 0.40 };
const BINARY_EXTENSIONS = ['.db', '.pdf', '.zip', '.tar.gz', '.docx', '.xlsx', '.png', '.jpg', '.dwg', '.dat', '.bin'];

function isBinaryFile(fileName) {
    const lower = (fileName || '').toLowerCase();
    return BINARY_EXTENSIONS.some(ext => lower.endsWith(ext));
}
function computeFileValue(category, sizeKB, serverTier) {
    const cat = FILE_CATEGORIES[category] || FILE_CATEGORIES.basura;
    const weightFactor = Math.pow(Math.max(0.5, sizeKB), 1.5);
    const tierMult = 1 + (serverTier || 0) * 0.4;
    const raw = cat.basePerKB15 * weightFactor * tierMult;
    const capped = cat.cap === Infinity ? raw : Math.min(raw, cat.cap);
    return Math.max(1, Math.round(capped / 10) * 10);
}
function scaleFileSize(baseSize, tier, category) {
    const catScale = CATEGORY_TIER_SCALE[category] || 0.12;
    const mult = 1 + tier * catScale;
    return Math.max(1, Math.round(baseSize * mult * 10) / 10);
}

const SERVER_DIR_LAYOUTS = {
    hacker:   { primaryDir: '/root',          dirs: [ { path: '/root', weight: 3 }, { path: '/root/.keys', weight: 2 }, { path: '/opt/exploits', weight: 2 }, { path: '/etc/secrets', weight: 2 }, { path: '/var/backups', weight: 1 } ] },
    database: { primaryDir: '/var/lib/mysql', dirs: [ { path: '/var/lib/mysql', weight: 4 }, { path: '/home/dba/Dumps', weight: 3 }, { path: '/var/backups', weight: 2 }, { path: '/etc/mysql', weight: 1 } ] },
    web:      { primaryDir: '/var/www/html',  dirs: [ { path: '/var/www/html', weight: 3 }, { path: '/home/webdev/Projects', weight: 2 }, { path: '/var/log/apache2', weight: 2 }, { path: '/etc/nginx/sites', weight: 1 } ] },
    mail:     { primaryDir: '/var/mail',      dirs: [ { path: '/var/mail', weight: 3 }, { path: '/home/postmaster/Archive', weight: 2 }, { path: '/var/log/mail', weight: 2 }, { path: '/etc/postfix', weight: 1 } ] },
    backup:   { primaryDir: '/var/backups',   dirs: [ { path: '/var/backups', weight: 4 }, { path: '/mnt/nas/snapshots', weight: 2 }, { path: '/home/sysop', weight: 1 } ] },
    office:   { primaryDir: '/home/empleado', dirs: [ { path: '/home/empleado/Documentos', weight: 3 }, { path: '/home/empleado/Escritorio', weight: 2 }, { path: '/home/empleado/Descargas', weight: 2 }, { path: '/home/empleado', weight: 1 } ] },
    mixed:    { primaryDir: '/home/user',     dirs: [ { path: '/home/user', weight: 2 }, { path: '/var/lib/data', weight: 2 }, { path: '/opt', weight: 1 }, { path: '/var/backups', weight: 1 } ] },
    lowvalue: { primaryDir: '/home/empleado', dirs: [ { path: '/home/empleado', weight: 3 }, { path: '/home/empleado/Documentos', weight: 1 } ] }
};
function getLayoutForProfile(profileId) {
    return SERVER_DIR_LAYOUTS[profileId] || SERVER_DIR_LAYOUTS.mixed;
}

const SERVER_FILE_POOL = [
    // ============================================================
    // FINANCIERO
    // ============================================================
    { name: 'passwd.txt', category: 'financiero', size: 3, gen: (tier) => {
        const lines = [];
        const n = dRandInt(4, 12);
        for (let i = 0; i < n; i++) {
            const p = dGenerarNombreCompleto();
            lines.push(`${dGenerarUsuario(p.nombre)}:${dPick(D_CONTRASEÑAS_COMUNES)}${dRandInt(10, 999)}`);
        }
        return lines.join('\n');
    }},
    { name: 'shadow.txt', category: 'financiero', size: 4, gen: (tier) => {
        const lines = [];
        const n = dRandInt(3, 8);
        for (let i = 0; i < n; i++) {
            const u = dGenerarUsuario(dGenerarNombreCompleto().nombre);
            const hash = Array.from({length: 22}, () => 'abcdefghijklmnopqrstuvwxyz0123456789./'[dRandInt(0, 37)]).join('');
            lines.push(`${u}:$6$${hash}:${dRandInt(19000, 19500)}:0:99999:7:::`);
        }
        return lines.join('\n');
    }},
    { name: 'database.sql', category: 'financiero', size: 18, gen: (tier) => {
        const lines = ['-- Dump MySQL', 'CREATE TABLE usuarios (id INT PRIMARY KEY, nombre VARCHAR(120), email VARCHAR(120), dni VARCHAR(20), telefono VARCHAR(30), tarjeta VARCHAR(30));'];
        const n = dRandInt(6, 14);
        for (let i = 0; i < n; i++) {
            const p = dGenerarNombreCompleto();
            lines.push(`INSERT INTO usuarios VALUES (${i+1}, '${p.nombre}', '${dGenerarEmail(p.nombre)}', '${dGenerarDNI()}', '${dGenerarTelefono()}', '${dGenerarTarjeta()}');`);
        }
        lines.push(`-- ${dRandInt(8000, 15000)} registros más...`);
        return lines.join('\n');
    }},
    { name: 'facturas.txt', category: 'financiero', size: 8, gen: (tier) => {
        const lines = [];
        const n = dRandInt(4, 10);
        for (let i = 0; i < n; i++) {
            lines.push(`FACTURA ${dGenerarFactura()} — ${dGenerarEmpresa()} — ${dGenerarMonto(1000, 250000).toLocaleString()} ${dPick(D_MONEDAS)}`);
        }
        return lines.join('\n');
    }},
    { name: 'claves.txt', category: 'financiero', size: 4, gen: (tier) => {
        const servicios = ['API_STRIPE', 'AWS_SECRET', 'DB_PASSWORD', 'API_KEY', 'TOKEN_SECRET', 'JWT_SECRET', 'MAILCHIMP_KEY', 'SENDGRID_KEY', 'TWILIO_SID', 'MERCADOPAGO_TOKEN'];
        const lines = [];
        const n = dRandInt(3, 7);
        for (let i = 0; i < n; i++) {
            const key = Array.from({length: dRandInt(20, 40)}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[dRandInt(0, 61)]).join('');
            lines.push(`${servicios[i % servicios.length]}=${key}`);
        }
        return lines.join('\n');
    }},
    { name: 'tarjetas.csv', category: 'financiero', size: 12, gen: (tier) => {
        const lines = ['num_tarjeta,titular,venc,cvv,saldo'];
        const n = dRandInt(3, 9);
        for (let i = 0; i < n; i++) {
            const p = dGenerarNombreCompleto();
            lines.push(`${dGenerarTarjeta()},${p.nombre},${dGenerarVencimiento()},${dGenerarCVV()},${dGenerarMonto(500, 200000)}`);
        }
        return lines.join('\n');
    }},
    { name: 'nominas_2024.pdf', category: 'financiero', size: 20, content: null },
    { name: 'cripto_wallet.dat', category: 'financiero', size: 6, content: null },
    { name: 'cuentas_offshore.txt', category: 'financiero', size: 9, gen: (tier) => {
        const lines = [];
        const n = dRandInt(2, 5);
        for (let i = 0; i < n; i++) {
            lines.push(`Titular: ${dGenerarEmpresa()} — ${dPick(D_BANCOS)} — ${dGenerarIBAN()} — ${dGenerarMonto(500000, 5000000).toLocaleString()} ${dPick(D_MONEDAS)}`);
        }
        return lines.join('\n');
    }},
    { name: 'wallets.json', category: 'financiero', size: 5, gen: (tier) => {
        const wallets = [];
        const n = dRandInt(2, 5);
        for (let i = 0; i < n; i++) {
            const addr = 'bc1q' + Array.from({length: 38}, () => 'abcdefghijklmnopqrstuvwxyz023456789'[dRandInt(0, 30)]).join('');
            wallets.push(`{ "chain":"BTC","addr":"${addr}","bal":${(Math.random() * 5).toFixed(3)} }`);
        }
        return `{ "wallets": [\n  ${wallets.join(',\n  ')}\n] }`;
    }},
    { name: 'pagos_proveedores.csv', category: 'financiero', size: 14, gen: (tier) => {
        const lines = ['fecha,proveedor,monto,factura'];
        const n = dRandInt(4, 10);
        for (let i = 0; i < n; i++) {
            lines.push(`${dGenerarFecha()},${dGenerarEmpresa()},${dGenerarMonto(1000, 500000)},${dGenerarFactura()}`);
        }
        return lines.join('\n');
    }},
    { name: 'boveda_backup.zip', category: 'financiero', size: 22, content: null },
    { name: 'transferencias.txt', category: 'financiero', size: 6, gen: (tier) => {
        const lines = ['[TRANSFERENCIAS RECIENTES]', ''];
        const n = dRandInt(5, 12);
        for (let i = 0; i < n; i++) {
            lines.push(`${dGenerarFecha()} ${dGenerarHora()} → ${dGenerarMonto(500, 250000).toLocaleString()} ${dPick(D_MONEDAS)} a ${dGenerarEmpresa()}`);
        }
        return lines.join('\n');
    }},
    { name: 'cuentas.txt', category: 'financiero', size: 8, gen: (tier) => {
        const lines = [];
        const n = dRandInt(4, 10);
        for (let i = 0; i < n; i++) {
            const p = dGenerarNombreCompleto();
            lines.push(`${p.nombre} | ${dPick(D_BANCOS)} | CBU ${dGenerarCBU()} | Saldo ${dGenerarMonto(1000, 500000)}`);
        }
        return lines.join('\n');
    }},
    { name: 'creditos.txt', category: 'financiero', size: 7, gen: (tier) => {
        const lines = [];
        const n = dRandInt(3, 8);
        for (let i = 0; i < n; i++) {
            lines.push(`${dGenerarFactura()} | ${dGenerarMonto(10000, 900000)} ${dPick(D_MONEDAS)} | Vence ${dGenerarFecha()} | ${dPick(D_ESTADOS)}`);
        }
        return lines.join('\n');
    }},
    { name: 'inversiones.xls', category: 'financiero', size: 15, content: null },
    { name: 'gastos_mensuales.csv', category: 'financiero', size: 9, gen: (tier) => {
        const lines = ['mes,concepto,monto'];
        const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        const n = dRandInt(4, 10);
        for (let i = 0; i < n; i++) {
            lines.push(`${dPick(meses)},${dPick(['Luz','Gas','Agua','Internet','Alquiler','Sueldos','Marketing','Servicios'])},${dGenerarMonto(5000, 200000)}`);
        }
        return lines.join('\n');
    }},

    // ============================================================
    // PERSONAL
    // ============================================================
    { name: 'contactos.txt', category: 'personal', size: 4, gen: (tier) => {
        const lines = [];
        const n = dRandInt(6, 18);
        for (let i = 0; i < n; i++) {
            const p = dGenerarNombreCompleto();
            lines.push(`${p.nombre.padEnd(28)} - ${dGenerarEmail(p.nombre).padEnd(30)} - ${dGenerarTelefono()}`);
        }
        return lines.join('\n');
    }},
    { name: 'users.db', category: 'personal', size: 15, content: null },
    { name: 'clientes.txt', category: 'personal', size: 10, gen: (tier) => {
        const lines = ['LISTADO DE CLIENTES', ''];
        const n = dRandInt(8, 20);
        for (let i = 0; i < n; i++) {
            const p = dGenerarNombreCompleto();
            lines.push(`${i+1}. ${p.nombre} — ${dGenerarEmail(p.nombre)} — ${dGenerarTelefono()} — ${dGenerarMonto(1000, 500000)} ${dPick(D_MONEDAS)}`);
        }
        return lines.join('\n');
    }},
    { name: 'correos.eml', category: 'personal', size: 9, gen: (tier) => {
        const p = dGenerarNombreCompleto();
        const p2 = dGenerarNombreCompleto();
        const asunto = dPick(D_ASUNTOS_CORREO);
        const cuerpo = [dPick(D_FRASES_CORREO), '', dPick(D_FRASES_CORREO)].join('\n');
        return `From: ${dGenerarEmail(p.nombre)}\nTo: ${dGenerarEmail(p2.nombre)}\nSubject: ${asunto}\nDate: ${dGenerarFecha()} ${dGenerarHora()}\n\n${cuerpo}\n\n--\n${p.nombre}`;
    }},
    { name: 'empleados.xlsx', category: 'personal', size: 11, content: null },
    { name: 'dni_escaneados.zip', category: 'personal', size: 16, content: null },
    { name: 'chat_logs.txt', category: 'personal', size: 7, gen: (tier) => {
        const p1 = dGenerarNombreCompleto();
        const p2 = dGenerarNombreCompleto();
        const lines = [`[Chat entre ${p1.nombre} y ${p2.nombre}]`, ''];
        const n = dRandInt(8, 20);
        for (let i = 0; i < n; i++) {
            const quien = i % 2 === 0 ? p1.primerNombre : p2.primerNombre;
            const hora = `${String(dRandInt(8, 22)).padStart(2, '0')}:${String(dRandInt(0, 59)).padStart(2, '0')}`;
            lines.push(`[${hora}] ${quien}: ${dPick([
                'Todo bien?', 'Te paso el archivo', 'Nos vemos mañana', 'No me llegó nada',
                'Confirmame por favor', 'Se cayó el server', 'Ya lo revisé', 'Genial!',
                'Ok, dale', 'Te llamo en un rato', 'Necesito eso para ayer', 'Buenísimo',
                'Dale, lo veo', 'Perfecto', 'Ahí te mando', 'Está tardando mucho'
            ])}`);
        }
        return lines.join('\n');
    }},
    { name: 'contactos_vip.txt', category: 'personal', size: 6, gen: (tier) => {
        const lines = ['— CONTACTOS VIP —', ''];
        const cargos = ['CEO', 'CTO', 'CFO', 'Director General', 'Ministro', 'Embajador', 'Senador', 'Diputado', 'Juez', 'Fiscal'];
        const n = dRandInt(4, 10);
        for (let i = 0; i < n; i++) {
            const p = dGenerarNombreCompleto();
            lines.push(`- ${dPick(cargos)} - ${p.nombre} - ${dGenerarEmail(p.nombre)} - ${dGenerarTelefono()}`);
        }
        return lines.join('\n');
    }},
    { name: 'agenda.txt', category: 'personal', size: 5, gen: (tier) => {
        const lines = ['AGENDA PERSONAL', ''];
        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const n = dRandInt(4, 10);
        for (let i = 0; i < n; i++) {
            lines.push(`${dPick(dias)} ${dGenerarHora()} — ${dPick(D_TEMAS_CHAT)} con ${dGenerarNombreCompleto().nombre}`);
        }
        return lines.join('\n');
    }},
    { name: 'notas_personales.txt', category: 'personal', size: 3, gen: (tier) => {
        const lines = ['Anotaciones varias:', ''];
        const n = dRandInt(5, 15);
        const items = dShuffle(D_NOTAS_VARIAS).slice(0, n);
        items.forEach(it => lines.push('- ' + it));
        return lines.join('\n');
    }},
    { name: 'familia.txt', category: 'personal', size: 3, gen: (tier) => {
        const lines = ['Familiares:', ''];
        const parentescos = ['Madre', 'Padre', 'Hermano/a', 'Tío/a', 'Primo/a', 'Abuelo/a', 'Sobrino/a'];
        const n = dRandInt(3, 8);
        for (let i = 0; i < n; i++) {
            const p = dGenerarNombreCompleto();
            lines.push(`${dPick(parentescos)}: ${p.nombre} — ${dGenerarTelefono()}`);
        }
        return lines.join('\n');
    }},
    { name: 'amigos.txt', category: 'personal', size: 3, gen: (tier) => {
        const lines = [];
        const n = dRandInt(4, 12);
        for (let i = 0; i < n; i++) {
            const p = dGenerarNombreCompleto();
            lines.push(`${p.nombre} — ${dGenerarTelefono()} — ${dGenerarEmail(p.nombre)}`);
        }
        return lines.join('\n');
    }},
    { name: 'medico.txt', category: 'personal', size: 4, gen: (tier) => {
        const p = dGenerarNombreCompleto();
        const obras = ['OSDE', 'Swiss Medical', 'Galeno', 'Medifé', 'IOMA', 'PAMI', 'OSECAC'];
        return `Médico de cabecera: Dr. ${p.nombre}\nObra social: ${dPick(obras)}\nAfiliado: ${dGenerarMonto(100000, 999999)}\nÚltima visita: ${dGenerarFecha()}\n\nRecordatorios:\n- Revisar la receta\n- Sacar turno nuevamente en ${dRandInt(1, 6)} meses`;
    }},
    { name: 'diario.txt', category: 'personal', size: 6, gen: (tier) => {
        const lines = ['Diario personal', ''];
        const n = dRandInt(3, 7);
        for (let i = 0; i < n; i++) {
            lines.push(`--- ${dGenerarFecha()} ---`);
            lines.push(dPick([
                'Hoy fue un día tranquilo.',
                'Me siento un poco cansado últimamente.',
                'Empecé un curso nuevo.',
                'No me gustó cómo me hablaron en el trabajo.',
                'Salí a caminar por la tarde.',
                'Cociné algo rico.',
                'Leí un libro interesante.',
                'Pensé en el pasado un rato.'
            ]));
            lines.push('');
        }
        return lines.join('\n');
    }},

    // ============================================================
    // CORPORATIVO
    // ============================================================
    { name: 'datos.txt', category: 'corporativo', size: 12, gen: (tier) => {
        const lineas = [
            `Empresa: ${dGenerarEmpresa()}`,
            `CUIT: ${dGenerarCUIT()}`,
            `Última auditoría: ${dGenerarFecha()}`,
            `Estado: ${dPick(D_ESTADOS)}`,
            '',
            'Objetivos del trimestre:',
            '- Aumentar facturación',
            '- Reducir costos operativos',
            '- Expandir a nuevos mercados'
        ];
        return lineas.join('\n');
    }},
    { name: 'inventario.txt', category: 'corporativo', size: 6, gen: (tier) => {
        const items = ['Servidores Dell R740', 'Switches Cisco', 'Laptops', 'Monitores', 'Impresoras', 'Routers', 'UPS', 'Discos SSD'];
        const lines = ['INVENTARIO', ''];
        const n = dRandInt(4, 9);
        dShuffle(items).slice(0, n).forEach(it => {
            lines.push(`- ${it}: ${dRandInt(2, 250)} unidades`);
        });
        return lines.join('\n');
    }},
    { name: 'secretos.txt', category: 'corporativo', size: 5, gen: (tier) => {
        return `PROYECTO ${dPick(['HALCÓN', 'FÉNIX', 'CÓNDOR', 'TITÁN', 'NEPTUNO', 'ORIÓN', 'ATLAS'])} - CLASIFICADO\n\nPresupuesto: ${dGenerarMonto(500000, 8000000).toLocaleString()} ${dPick(D_MONEDAS)}\nResponsable: ${dGenerarNombreCompleto().nombre}\nFecha estimada: ${dGenerarFecha()}\nContacto: ${dGenerarTelefono()}`;
    }},
    { name: 'config.cfg', category: 'corporativo', size: 3, gen: (tier) => {
        const p = dGenerarNombreCompleto();
        return `[server]\nhostname = prod-${dPick(['db','web','api','mail','cache'])}-${dRandInt(1, 9)}\n\n[auth]\nadmin_user = ${dGenerarUsuario(p.nombre)}\nadmin_pass = ${dPick(D_CONTRASEÑAS_COMUNES)}${dRandInt(10, 999)}\n\n[network]\nip_internal = 10.${dRandInt(0,255)}.${dRandInt(0,255)}.${dRandInt(1,254)}\nport = ${dPick([8080, 3000, 8000, 9000])}`;
    }},
    { name: 'agenda.txt', category: 'corporativo', size: 6, gen: (tier) => {
        const lines = ['REUNIONES', ''];
        const n = dRandInt(4, 10);
        for (let i = 0; i < n; i++) {
            lines.push(`${dPick(['Lunes','Martes','Miércoles','Jueves','Viernes'])} ${dGenerarHora()}: ${dPick(D_TEMAS_CHAT)} (sala ${dPick(D_SUCURSALES)})`);
        }
        return lines.join('\n');
    }},
    { name: 'informes.docx', category: 'corporativo', size: 14, content: null },
    { name: 'planos.pdf', category: 'corporativo', size: 16, content: null },
    { name: 'source_code.zip', category: 'corporativo', size: 20, content: null },
    { name: 'contratos_nda.pdf', category: 'corporativo', size: 13, content: null },
    { name: 'auditoria_2024.docx', category: 'corporativo', size: 15, content: null },
    { name: 'logs_auth.txt', category: 'corporativo', size: 4, gen: (tier) => {
        const lines = [];
        const n = dRandInt(6, 18);
        for (let i = 0; i < n; i++) {
            const p = dGenerarNombreCompleto();
            const tipo = dPick(['LOGIN OK', 'LOGIN FAILED', 'ACCOUNT LOCKED', 'PASSWORD CHANGED', 'LOGOUT']);
            lines.push(`[${dGenerarFecha()} ${dGenerarHora()}] ${tipo} user=${dGenerarUsuario(p.nombre)} ip=${dGenerarIP()}`);
        }
        return lines.join('\n');
    }},
    { name: 'planos_edificio.dwg', category: 'corporativo', size: 18, content: null },
    { name: 'propuesta_comercial.docx', category: 'corporativo', size: 12, content: null },
    { name: 'presupuesto_2024.xlsx', category: 'corporativo', size: 10, content: null },
    { name: 'proveedores.txt', category: 'corporativo', size: 8, gen: (tier) => {
        const lines = ['PROVEEDORES', ''];
        const n = dRandInt(5, 12);
        for (let i = 0; i < n; i++) {
            const p = dGenerarNombreCompleto();
            lines.push(`${dGenerarEmpresa()} | Contacto: ${p.nombre} | ${dGenerarEmail(p.nombre)} | ${dGenerarTelefono()}`);
        }
        return lines.join('\n');
    }},
    { name: 'oficinas.txt', category: 'corporativo', size: 5, gen: (tier) => {
        const lines = ['SUCURSALES', ''];
        const n = dRandInt(3, 8);
        for (let i = 0; i < n; i++) {
            lines.push(`- Sucursal ${dPick(D_SUCURSALES)}: ${dGenerarDireccion()} | Tel: ${dGenerarTelefono()}`);
        }
        return lines.join('\n');
    }},
    { name: 'actas_reuniones.txt', category: 'corporativo', size: 7, gen: (tier) => {
        const lines = ['ACTAS DE REUNIÓN', ''];
        const n = dRandInt(3, 6);
        for (let i = 0; i < n; i++) {
            lines.push(`--- ${dGenerarFecha()} — Reunión de ${dPick(D_TEMAS_CHAT)} ---`);
            const participantes = [];
            const k = dRandInt(3, 6);
            for (let j = 0; j < k; j++) participantes.push(dGenerarNombreCompleto().nombre);
            lines.push(`Participantes: ${participantes.join(', ')}`);
            lines.push(`Temas tratados: ${dPick(D_TEMAS_CHAT)}, ${dPick(D_TEMAS_CHAT)}`);
            lines.push('');
        }
        return lines.join('\n');
    }},
    { name: 'presupuestos_2024.txt', category: 'corporativo', size: 9, gen: (tier) => {
        const lines = [];
        const n = dRandInt(4, 10);
        for (let i = 0; i < n; i++) {
            lines.push(`${dGenerarFecha()} | ${dGenerarEmpresa()} | ${dGenerarMonto(5000, 900000)} ${dPick(D_MONEDAS)} | ${dPick(D_ESTADOS)}`);
        }
        return lines.join('\n');
    }},
    { name: 'marketing_plan.txt', category: 'corporativo', size: 8, gen: (tier) => {
        return `PLAN DE MARKETING ${dRandInt(2023, 2025)}\n\nPresupuesto: ${dGenerarMonto(50000, 900000).toLocaleString()} ${dPick(D_MONEDAS)}\nResponsable: ${dGenerarNombreCompleto().nombre}\n\nCanales:\n- ${dPick(['Redes sociales','Google Ads','Email marketing','SEO','Influencers'])}\n- ${dPick(['Redes sociales','Google Ads','Email marketing','SEO','Influencers'])}\n- ${dPick(['Redes sociales','Google Ads','Email marketing','SEO','Influencers'])}`;
    }},

    // ============================================================
    // BASURA
    // ============================================================
    { name: 'notas.txt', category: 'basura', size: 2, gen: (tier) => {
        const lines = ['Notas varias:', ''];
        const n = dRandInt(3, 10);
        dShuffle(D_NOTAS_VARIAS).slice(0, n).forEach(it => lines.push('- ' + it));
        return lines.join('\n');
    }},
    { name: 'lista_compras.txt', category: 'basura', size: 1, gen: (tier) => {
        const cosas = ['manzanas', 'leche', 'pan', 'huevos', 'café', 'azúcar', 'yerba', 'arroz', 'fideos', 'aceite', 'sal', 'queso', 'jamón', 'tomate', 'cebolla', 'papas', 'bananas', 'yogur', 'galletitas', 'chocolate'];
        const lines = ['LISTA DE COMPRAS', ''];
        const n = dRandInt(4, 10);
        dShuffle(cosas).slice(0, n).forEach(c => lines.push('- ' + c));
        return lines.join('\n');
    }},
    { name: 'readme.md', category: 'basura', size: 1, gen: (tier) => {
        const proyectos = ['Proyecto Interno', 'Mi App', 'Notas del curso', 'Borrador', 'Test', 'Demo'];
        return `# ${dPick(proyectos)}\n\nTODO: limpiar antes de liberar.\n\nCreado por: ${dGenerarNombreCompleto().nombre}\nÚltima edición: ${dGenerarFecha()}`;
    }},
    { name: 'tareas.txt', category: 'basura', size: 1, gen: (tier) => {
        const tareas = ['Revisar servidor de backups', 'Actualizar WordPress', 'Comprar dominio', 'Pagar hosting', 'Renovar certificado SSL', 'Responder ticket', 'Hacer backup', 'Actualizar dependencias', 'Revisar logs'];
        const lines = ['PENDIENTES:', ''];
        const n = dRandInt(3, 8);
        dShuffle(tareas).slice(0, n).forEach(t => {
            const done = Math.random() < 0.3;
            lines.push(`- [${done ? 'x' : ' '}] ${t}`);
        });
        return lines.join('\n');
    }},
    { name: 'apuntes.txt', category: 'basura', size: 3, gen: (tier) => {
        const temas = ['Matemática', 'Historia', 'Programación', 'Inglés', 'Física', 'Química', 'Biología', 'Filosofía', 'Literatura'];
        const lines = [`Apuntes de ${dPick(temas)}`, ''];
        const n = dRandInt(5, 12);
        for (let i = 0; i < n; i++) {
            lines.push(`- ${dPick([
                'Definición importante',
                'Fórmula clave',
                'Ver capítulo 3',
                'Repasar antes del examen',
                'Preguntar al profe',
                'Ejemplo práctico',
                'Concepto central',
                'Autor: ' + dGenerarNombreCompleto().nombre
            ])}`);
        }
        return lines.join('\n');
    }},
    { name: 'recordatorios.txt', category: 'basura', size: 2, gen: (tier) => {
        const lines = [];
        const n = dRandInt(4, 10);
        dShuffle(D_NOTAS_VARIAS).slice(0, n).forEach(it => lines.push('• ' + it));
        return lines.join('\n');
    }},
    { name: 'recetas.txt', category: 'basura', size: 4, gen: (tier) => {
        const platos = ['Tarta de manzana', 'Milanesas', 'Pizza casera', 'Empanadas', 'Guiso de lentejas', 'Locro', 'Asado', 'Ñoquis', 'Paella'];
        const lines = [];
        const n = dRandInt(3, 6);
        dShuffle(platos).slice(0, n).forEach(p => {
            lines.push(`--- ${p} ---`);
            lines.push('Ingredientes: ' + dRandInt(3, 8) + ' principales');
            lines.push('Tiempo: ' + dRandInt(20, 120) + ' minutos');
            lines.push('');
        });
        return lines.join('\n');
    }},
    { name: 'pendientes.txt', category: 'basura', size: 2, gen: (tier) => {
        const lines = ['COSAS PENDIENTES', ''];
        const n = dRandInt(5, 12);
        dShuffle(D_NOTAS_VARIAS).slice(0, n).forEach((it, i) => lines.push(`${i+1}. ${it}`));
        return lines.join('\n');
    }},
    { name: 'links.txt', category: 'basura', size: 2, gen: (tier) => {
        const dominios = ['youtube.com', 'github.com', 'stackoverflow.com', 'reddit.com', 'medium.com', 'wikipedia.org', 'docs.google.com', 'notion.so', 'trello.com'];
        const lines = [];
        const n = dRandInt(5, 15);
        for (let i = 0; i < n; i++) {
            lines.push(`https://${dPick(dominios)}/${Math.random().toString(36).substring(2, 10)}`);
        }
        return lines.join('\n');
    }}
];

const ZIP_PASSWORD_POOL = [
    'r00t2024', 'admin123', 'verano2023', 'corp!2024', 'S3cur3!',
    'MiPerro2019', 'backup2024', 'letmein!', 'c0rprate!', 'secreto123',
    'hunter2!', 'password2024', 'C0rp0r4t3', 'h4ckm3', 'passw0rd',
    'Tr4b4j0!', 'clave#1', '2024Admin', 'empresa!', 'seguridad99'
];
const ZIP_PASSWORD_HINT_TEMPLATES = [
    (pw) => `Notas de la semana:\n- Revisar backups el lunes\n- Clave del zip: "${pw}"\n- Llamar al proveedor`,
    (pw) => `Recordatorio:\nActualizar contraseñas antes del viernes.\nLa del backup es: ${pw}\nNo compartir.`,
    (pw) => `[LOG INTERNO]\nBackup completado 03:14 AM\nPassword usada: ${pw}\nVerificar integridad`,
    (pw) => `Config rápida:\nHost: 10.0.0.5\nUser: admin\nBackup pass: ${pw}\nPuerto SSH: 22`,
    (pw) => `Hola equipo,\nLa clave del zip de backups de este mes es "${pw}".\n--Soporte`,
    (pw) => `Anotaciones:\n- Comprar café\n- La pass del zip es ${pw} (no me la acuerdo nunca)\n- Revisar mail`
];
const ZIP_CONTENT_TEMPLATES = [
    [
        { name: 'wallets_priv.txt', category: 'financiero', size: 6, content: `BTC: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh\nLlave: 5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF` },
        { name: 'seeds.txt', category: 'financiero', size: 3, content: `Seed phrases:\n1. abandon abandon ... about\n2. zoo zoo ... vote` },
        { name: 'balance.txt', category: 'financiero', size: 2, content: `Total BTC: 1.42\nTotal ETH: 12.8\nValor aprox: 890K USD` }
    ],
    [
        { name: 'fotos_privadas.zip', category: 'personal', size: 45, content: null },
        { name: 'diario.txt', category: 'personal', size: 12, content: `Diario personal:\n- Hoy fue un día difícil\n- La reunión salió mejor de lo esperado` },
        { name: 'documentos_personales.pdf', category: 'personal', size: 8, content: null }
    ],
    [
        { name: 'dni_escaneados.zip', category: 'personal', size: 22, content: null },
        { name: 'pasaportes.zip', category: 'personal', size: 30, content: null },
        { name: 'licencias.pdf', category: 'personal', size: 12, content: null }
    ],
    [
        { name: 'auditoria_2024.docx', category: 'corporativo', size: 18, content: null },
        { name: 'balance_Q4.xlsx', category: 'corporativo', size: 15, content: null },
        { name: 'informe_final.pdf', category: 'corporativo', size: 20, content: null }
    ],
    [
        { name: 'cuentas_offshore.csv', category: 'financiero', size: 8, content:
`titular,banco,cuenta,saldo
XYZ Holdings,Cayman National,KY-8829-114-552,2400000
Alpha Investments,Swiss Private,CH-7782-991-043,890000` },
        { name: 'transferencias.txt', category: 'financiero', size: 4, content:
`2024-01-15 → 450K USD a Swiss Private
2024-02-03 → 220K USD a Cayman` }
    ]
];
function pickZipPassword() { return ZIP_PASSWORD_POOL[Math.floor(Math.random() * ZIP_PASSWORD_POOL.length)]; }
function buildZipHintContent(pw) {
    const tpl = ZIP_PASSWORD_HINT_TEMPLATES[Math.floor(Math.random() * ZIP_PASSWORD_HINT_TEMPLATES.length)];
    return tpl(pw);
}
function pickZipContent() { return ZIP_CONTENT_TEMPLATES[Math.floor(Math.random() * ZIP_CONTENT_TEMPLATES.length)]; }

const DOWNLOAD_RAM_PER_KB = 0.08;
const DOWNLOAD_RAM_MIN = 0.1;
const DOWNLOAD_RAM_MAX = 3.0;
const DOWNLOAD_BASE_MS = 1500;
const DOWNLOAD_PER_KB_MS = 100;
const DOWNLOAD_MAX_MS = 20000;
function getDownloadRAM(sizeKB) {
    const raw = sizeKB * DOWNLOAD_RAM_PER_KB;
    return Math.min(DOWNLOAD_RAM_MAX, Math.max(DOWNLOAD_RAM_MIN, raw));
}
function getDownloadDuration(sizeKB) {
    const raw = DOWNLOAD_BASE_MS + sizeKB * DOWNLOAD_PER_KB_MS;
    return Math.min(DOWNLOAD_MAX_MS, Math.max(1500, raw));
}
const UNZIP_RAM_PER_KB = 0.025;
const UNZIP_RAM_MIN = 0.3;
const UNZIP_RAM_MAX = 2.0;
const UNZIP_BASE_MS = 800;
const UNZIP_PER_FILE_MS = 400;
const UNZIP_PER_KB_MS = 30;
const UNZIP_MAX_MS = 15000;
function getUnzipRAM(sizeKB) {
    const raw = sizeKB * UNZIP_RAM_PER_KB;
    return Math.min(UNZIP_RAM_MAX, Math.max(UNZIP_RAM_MIN, raw));
}
function getUnzipDuration(sizeKB, numFiles) {
    const raw = UNZIP_BASE_MS + numFiles * UNZIP_PER_FILE_MS + sizeKB * UNZIP_PER_KB_MS;
    return Math.min(UNZIP_MAX_MS, Math.max(1500, raw));
}

const SCAN_RAM_COST = 0.3;
const SCAN_DURATION_MS = 11000;
const MAX_PORTS_PER_SERVER = 6;

const SQL_CANVAS_W = 295; const SQL_CANVAS_H = 175;
const SSH_CANVAS_W = 295; const SSH_CANVAS_H = 175;
const HTTP_CANVAS_W = 295; const HTTP_CANVAS_H = 175;
const FTP_CANVAS_W = 295; const FTP_CANVAS_H = 175;
const SMTP_CANVAS_W = 290; const SMTP_CANVAS_H = 260;
const TELNET_CANVAS_W = 290; const TELNET_CANVAS_H = 260;
const DNS_CANVAS_W = 290; const DNS_CANVAS_H = 260;
const PORTHACK_CANVAS_W = 290; const PORTHACK_CANVAS_H = 260;
const WALLBREAKER_CANVAS_W = 290; const WALLBREAKER_CANVAS_H = 260;
const DOWNLOAD_CANVAS_W = 295; const DOWNLOAD_CANVAS_H = 100;
const UNZIP_CANVAS_W = 295; const UNZIP_CANVAS_H = 130;
const RM_CANVAS_W = 295;const RM_CANVAS_H = 90;


const FIREWALL_RAM_COST = 0.9;
const WALLBREAKER_ANALYZE_MS = 2600;
const WALLBREAKER_BREAK_MS = 7000;
const FIREWALL_MAX_ANALYZE_USES = 2;

const ATTACKABLE_SERVICES = ['SSH', 'HTTP', 'SQL', 'FTP', 'SMTP', 'TELNET', 'DNS'];
const DECORATIVE_SERVICES = [
    { service: 'HTTPS', name: 'HTTPS' }, { service: 'POP3', name: 'POP3' },
    { service: 'IMAP', name: 'IMAP' },   { service: 'NTP', name: 'NTP' },
    { service: 'SNMP', name: 'SNMP' },   { service: 'LDAP', name: 'LDAP' },
    { service: 'SMB', name: 'SMB' }
];
const CLASSIC_PORT_POOL = [
    21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995,
    1433, 1521, 1723, 2049, 2082, 2083, 2086, 2087, 2095, 2096,
    3000, 3128, 3306, 3389, 4443, 5000, 5432, 5555, 5900, 6379,
    6667, 7001, 7002, 8000, 8008, 8080, 8081, 8443, 8888, 9000,
    9090, 9200, 9999, 10000, 11211, 27017, 28017, 50000
];

const PLAYER_TIERS = [
    { label: 'Iniciado',     minVersion: 0.0, versionRange: [0.5, 1.2], toolVersionRange: [0.8, 1.5], reqPorts: [1, 1], totalPortsRange: [2, 3], services: ['SSH', 'HTTP', 'SQL'], traceChance: 0.00, traceDurationBase: [0, 0],     rewardMult: 0.7, decorativeRange: [0, 1], firewallChance: 0.00 },
    { label: 'Novato',       minVersion: 1.4, versionRange: [1.0, 1.8], toolVersionRange: [1.3, 1.9], reqPorts: [1, 2], totalPortsRange: [3, 4], services: ['SSH', 'HTTP', 'SQL', 'FTP'], traceChance: 0.15, traceDurationBase: [18, 30],   rewardMult: 1.0, decorativeRange: [0, 1], firewallChance: 0.00 },
    { label: 'Operador',     minVersion: 1.8, versionRange: [1.5, 2.2], toolVersionRange: [1.7, 2.3], reqPorts: [2, 2], totalPortsRange: [4, 5], services: ['SSH', 'HTTP', 'SQL', 'FTP', 'SMTP'], traceChance: 0.30, traceDurationBase: [22, 38],   rewardMult: 1.4, decorativeRange: [0, 2], firewallChance: 0.20 },
    { label: 'Especialista', minVersion: 2.2, versionRange: [1.9, 2.6], toolVersionRange: [2.1, 2.7], reqPorts: [2, 3], totalPortsRange: [4, 6], services: ['SSH', 'HTTP', 'SQL', 'FTP', 'SMTP', 'TELNET'], traceChance: 0.45, traceDurationBase: [26, 45],   rewardMult: 1.8, decorativeRange: [0, 2], firewallChance: 0.35 },
    { label: 'Veterano',     minVersion: 2.6, versionRange: [2.3, 3.0], toolVersionRange: [2.5, 3.1], reqPorts: [3, 3], totalPortsRange: [5, 7], services: ['SSH', 'HTTP', 'SQL', 'FTP', 'SMTP', 'TELNET', 'DNS'], traceChance: 0.55, traceDurationBase: [30, 52],   rewardMult: 2.2, decorativeRange: [0, 2], firewallChance: 0.45 },
    { label: 'Élite',        minVersion: 3.0, versionRange: [2.7, 3.4], toolVersionRange: [2.9, 3.5], reqPorts: [3, 4], totalPortsRange: [6, 7], services: ['SSH', 'HTTP', 'SQL', 'FTP', 'SMTP', 'TELNET', 'DNS'], traceChance: 0.65, traceDurationBase: [34, 58],   rewardMult: 2.8, decorativeRange: [0, 1], firewallChance: 0.55 },
    { label: 'Maestro',      minVersion: 3.4, versionRange: [3.1, 3.8], toolVersionRange: [3.3, 3.9], reqPorts: [4, 4], totalPortsRange: [6, 7], services: ['SSH', 'HTTP', 'SQL', 'FTP', 'SMTP', 'TELNET', 'DNS'], traceChance: 0.75, traceDurationBase: [38, 65],   rewardMult: 3.5, decorativeRange: [0, 1], firewallChance: 0.65 },
    { label: 'Fantasma',     minVersion: 3.8, versionRange: [3.5, 4.3], toolVersionRange: [3.7, 4.4], reqPorts: [4, 5], totalPortsRange: [6, 7], services: ['SSH', 'HTTP', 'SQL', 'FTP', 'SMTP', 'TELNET', 'DNS'], traceChance: 0.85, traceDurationBase: [42, 72],   rewardMult: 4.2, decorativeRange: [0, 1], firewallChance: 0.75 },
    { label: 'Singularidad', minVersion: 4.3, versionRange: [4.0, 5.0], toolVersionRange: [4.2, 5.0], reqPorts: [5, 5], totalPortsRange: [7, 7], services: ['SSH', 'HTTP', 'SQL', 'FTP', 'SMTP', 'TELNET', 'DNS'], traceChance: 0.90, traceDurationBase: [46, 80],   rewardMult: 5.0, decorativeRange: [0, 0], firewallChance: 0.85 }
];
function getPlayerTierFromVersion(maxToolVersion) {
    for (let i = PLAYER_TIERS.length - 1; i >= 0; i--) {
        if (maxToolVersion >= PLAYER_TIERS[i].minVersion) return i;
    }
    return 0;
}
function getTierConfig(tier) {
    return PLAYER_TIERS[Math.max(0, Math.min(PLAYER_TIERS.length - 1, tier))];
}

const SERVER_PROFILES = [
    { id: 'hacker',   label: 'Nodo Hacker',               weight: 8,  services: ['SSH', 'TELNET', 'FTP'], binToolsChance: 0.25, binToolsCount: [1, 2], binToolsVersionBoost: 0.5, filePool: ['passwd.txt', 'shadow.txt', 'claves.txt', 'secretos.txt', 'config.cfg', 'cripto_wallet.dat', 'wallets.json', 'cuentas.txt', 'transferencias.txt', 'creditos.txt', 'inversiones.xls'], rewardMult: 1.3 },
    { id: 'database', label: 'Servidor de Base de Datos', weight: 12, services: ['SQL', 'SSH'], requireSQL: true, binToolsChance: 0.04, filePool: ['database.sql', 'users.db', 'clientes.txt', 'facturas.txt', 'datos.txt', 'pagos_proveedores.csv', 'cuentas.txt', 'gastos_mensuales.csv'], rewardMult: 1.6 },
    { id: 'web',      label: 'Servidor Web',              weight: 12, services: ['HTTP', 'SSH'], requireHTTP: true, binToolsChance: 0.05, filePool: ['source_code.zip', 'config.cfg', 'planos.pdf', 'logs_auth.txt', 'chat_logs.txt', 'links.txt'], rewardMult: 1.4 },
    { id: 'mail',     label: 'Servidor de Correo',        weight: 10, services: ['SMTP', 'SSH'], requireSMTP: true, binToolsChance: 0.04, filePool: ['correos.eml', 'contactos.txt', 'agenda.txt', 'contactos_vip.txt', 'chat_logs.txt', 'amigos.txt'], rewardMult: 1.3 },
    { id: 'backup',   label: 'Servidor de Backup',        weight: 8,  services: ['FTP', 'SSH'], requireFTP: true, binToolsChance: 0.04, filePool: ['boveda_backup.zip', 'source_code.zip', 'database.sql', 'dni_escaneados.zip', 'inversiones.xls'], rewardMult: 1.8 },
    { id: 'office',   label: 'PC de Oficina',             weight: 15, services: ['SSH', 'HTTP'], binToolsChance: 0.05, filePool: ['informes.docx', 'agenda.txt', 'facturas.txt', 'clientes.txt', 'contactos.txt', 'inventario.txt', 'notas.txt', 'lista_compras.txt', 'tareas.txt', 'recetas.txt', 'diario.txt', 'notas_personales.txt'] , rewardMult: 0.9 },
    { id: 'mixed',    label: 'Servidor Mixto',            weight: 15, services: ['SSH', 'HTTP', 'SQL', 'FTP', 'SMTP', 'TELNET', 'DNS'], binToolsChance: 0.08, filePool: 'any', rewardMult: 1.2 },
    { id: 'lowvalue', label: 'Nodo de Bajo Valor',        weight: 10, services: ['SSH'], binToolsChance: 0.02, filePool: ['inventario.txt', 'contactos.txt', 'notas.txt', 'readme.md', 'tareas.txt'], rewardMult: 0.6 }
];

const TIER_DISTRIBUTION = { same: 0.82, plus1: 0.12, minus1: 0.05, plus2: 0.01, plus3: 0.00 };
function pickVariantTier(playerTier) {
    const r = Math.random();
    if (r < TIER_DISTRIBUTION.same)   return playerTier;
    if (r < TIER_DISTRIBUTION.same + TIER_DISTRIBUTION.plus1)  return Math.min(PLAYER_TIERS.length - 1, playerTier + 1);
    if (r < TIER_DISTRIBUTION.same + TIER_DISTRIBUTION.plus1 + TIER_DISTRIBUTION.minus1) return Math.max(0, playerTier - 1);
    if (r < TIER_DISTRIBUTION.same + TIER_DISTRIBUTION.plus1 + TIER_DISTRIBUTION.minus1 + TIER_DISTRIBUTION.plus2) return Math.min(PLAYER_TIERS.length - 1, playerTier + 2);
    return Math.min(PLAYER_TIERS.length - 1, playerTier + 3);
}

// ============================================================
// HELPERS PARA MISIONES CON IP TARGET
// ============================================================
function generateMissionTargetIP() {
    let ip;
    let guard = 0;
    do {
        const a = [10, 172, 192][Math.floor(Math.random() * 3)];
        if (a === 10) ip = `10.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*254)+1}`;
        else if (a === 172) ip = `172.${16+Math.floor(Math.random()*16)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*254)+1}`;
        else ip = `192.168.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*254)+1}`;
        guard++;
        if (guard > 100) break;
        if (gameState.servers.some(s => s.ip === ip)) continue;
        if ((gameState.missionsAvailable || []).some(m => m.targetIP === ip)) continue;
        if ((gameState.missionsActive || []).some(m => m.targetIP === ip)) continue;
        break;
    } while (true);
    return ip;
}

// ============================================================
// TIPOS DE MISIÓN
// ============================================================
const FUNNY_HACK_NAMES = [
    'Anónimo', 'Sr. Nadie', 'Un amigo', 'Viejo conocido', 'Tu ex', 'El Vecino',
    'Sr. Sombras', 'Cyberlobo', 'Fantasma', 'La Sombra', 'Mr. Robot', 'Neo',
    'El Informante', 'Ojo Privado', 'Zero Cool', 'H4ck3r Anónimo'
];

const SECONDARY_MISSION_TYPES = [

    // ============================================================
    // 1) EXTRACT: bajá un archivo específico de una IP
    // ============================================================
    {
        id: 'extract_file', weight: 25,
        gen: (tier) => {
            const filePool = [
                { name: 'passwd.txt', label: 'las contraseñas del sistema', cat: 'financiero' },
                { name: 'shadow.txt', label: 'los hashes de contraseñas', cat: 'financiero' },
                { name: 'database.sql', label: 'el dump de la base de datos', cat: 'financiero' },
                { name: 'clientes.txt', label: 'la lista completa de clientes', cat: 'personal' },
                { name: 'correos.eml', label: 'unos correos comprometedores', cat: 'personal' },
                { name: 'tarjetas.csv', label: 'las tarjetas de crédito', cat: 'financiero' },
                { name: 'wallets.json', label: 'una wallet de criptomonedas', cat: 'financiero' },
                { name: 'chat_logs.txt', label: 'una conversación privada', cat: 'personal' },
                { name: 'contactos_vip.txt', label: 'la agenda VIP', cat: 'personal' }
            ];
            const target = pickOne(filePool);
            const ip = generateMissionTargetIP();
            const serverTier = tier;
            const baseCR = 500 + serverTier * 220 + Math.floor(Math.random() * 400);
            const sender = pickOne(FUNNY_HACK_NAMES);
            const intros = [
                `Che, necesito que me traigas ${target.label} del server ${ip}.`,
                `Un conocido me pasó la data: en ${ip} está ${target.label}. Andá a buscarlo.`,
                `Necesito ${target.label} del server ${ip} antes del viernes. No preguntes.`,
                `Hay rumores de que en ${ip} hay ${target.label}. Traemelos a mí.`,
                `Filtraron ${target.label} en ${ip}. Necesito copia antes que lo hagan otros.`,
                `Un soplón me dijo que ${ip} tiene ${target.label}. Confío en vos.`,
                `Un cliente paga bien por ${target.label}. Está en ${ip}. Movete.`
            ];
            const desc = pickOne(intros);
            return {
                title: `Traeme ${target.name}`,
                description: desc,
                minTier: serverTier,
                targetCount: 1,
                targetIP: ip,
                meta: {
                    action: 'download',
                    fileName: target.name,
                    category: target.cat,
                    serverTier: serverTier,
                    includeFiles: [target.name]
                },
                rewardCR: Math.round(baseCR / 50) * 50,
                rewardTool: Math.random() < 0.25 ? { tier: serverTier, chance: 0.5 } : null,
                sender
            };
        }
    },

    // ============================================================
    // 2) CRACKER HEIST: bajá crackers de una IP
    // ============================================================
    {
        id: 'cracker_heist', weight: 15,
        gen: (tier) => {
            const ip = generateMissionTargetIP();
            const serverTier = tier;
            const crackerCount = 1 + Math.floor(Math.random() * 3);
            const baseCR = 900 + serverTier * 320;
            const sender = pickOne(FUNNY_HACK_NAMES);
            const intros = [
                `Escuché que en ${ip} hay crackers guardados. Necesito ${crackerCount} para un laburo.`,
                `Un bot me tiró que ${ip} tiene crackers olvidados. Bajate ${crackerCount}.`,
                `Necesito ${crackerCount} crackers del server ${ip}. Pagan bien.`,
                `En ${ip} hay una colección de crackers. Quiero ${crackerCount}.`
            ];
            return {
                title: `Robá ${crackerCount} cracker${crackerCount > 1 ? 's' : ''} del server`,
                description: pickOne(intros),
                minTier: serverTier,
                targetCount: crackerCount,
                targetIP: ip,
                meta: {
                    action: 'download_crackers',
                    serverTier: serverTier,
                    crackerCount: crackerCount,
                    hasCrackers: true
                },
                rewardCR: Math.round(baseCR / 50) * 50,
                rewardTool: null,
                sender
            };
        }
    },

    // ============================================================
    // 3) HACK SPECIFIC: hackeá una IP puntual
    // ============================================================
    {
        id: 'hack_specific', weight: 15,
        gen: (tier) => {
            const ip = generateMissionTargetIP();
            const serverTier = tier;
            const baseCR = 700 + serverTier * 260;
            const sender = pickOne(FUNNY_HACK_NAMES);
            const intros = [
                `Un ex socio tiene data en ${ip}. Necesito acceso a su server.`,
                `Necesito que hackees ${ip} y no hagas preguntas.`,
                `Sabemos que ${ip} guarda secretos. Entrá y mirá.`,
                `Tenemos que ver qué esconde ${ip}. Hackealo.`,
                `Un competidor tiene info en ${ip}. Entrá y confirmame.`
            ];
            return {
                title: `Hackeá el server ${ip}`,
                description: pickOne(intros),
                minTier: serverTier,
                targetCount: 1,
                targetIP: ip,
                meta: {
                    action: 'hack_ip',
                    serverTier: serverTier
                },
                rewardCR: Math.round(baseCR / 50) * 50,
                rewardTool: Math.random() < 0.30 ? { tier: serverTier, chance: 0.55 } : null,
                sender
            };
        }
    },

    // ============================================================
    // 4) STEALTH HACK: sin activar rastreo
    // ============================================================
    {
        id: 'stealth_hack', weight: 12,
        gen: (tier) => {
            const minTier = tier;
            const baseCR = 1200 + minTier * 380;
            const sender = pickOne(FUNNY_HACK_NAMES);
            const descs = [
                'Necesito entrar a una máquina sin que salte la alarma. Si te detectan, no me conocés.',
                'Laburo silencioso: hackeá un server sin activar el rastreo.',
                'Operación discreta. Entrá y salí sin que el server se dé cuenta.',
                'Necesito acceso a un host protegido. Nada de ruido.',
                'Hay una máquina vigilada. Hackeala sin dejar que active el rastreo.'
            ];
            return {
                title: 'Hackeo silencioso',
                description: pickOne(descs),
                minTier,
                targetCount: 1,
                meta: { action: 'stealth_hack' },
                rewardCR: Math.round(baseCR / 50) * 50,
                rewardTool: Math.random() < 0.40 ? { tier: minTier, chance: 0.6 } : null,
                sender
            };
        }
    },

    // ============================================================
    // 5) BULK HACK: hackeá N servers de tier X+
    // ============================================================
    {
        id: 'bulk_hack', weight: 12,
        gen: (tier) => {
            const target = 2 + Math.floor(Math.random() * 3);
            const minTier = tier;
            const baseCR = 350 + minTier * 180;
            const sender = pickOne(FUNNY_HACK_NAMES);
            const descs = [
                `Necesito que hackees ${target} máquinas. Las que encuentres, no importa cuáles.`,
                `Ronda de trabajo: entrá a ${target} servers y avisame.`,
                `Hay ${target} hosts que necesito ver comprometidos. Movete.`,
                `Conseguime acceso a ${target} máquinas distintas.`
            ];
            return {
                title: `Hackeá ${target} servers`,
                description: pickOne(descs),
                minTier,
                targetCount: target,
                meta: { action: 'hack' },
                rewardCR: Math.round((baseCR * target) / 50) * 50,
                rewardTool: Math.random() < 0.30 ? { tier: minTier, chance: 0.5 } : null,
                sender
            };
        }
    },

    // ============================================================
    // 6) SELL VALUE: juntá CR en ventas
    // ============================================================
    {
        id: 'sell_value', weight: 10,
        gen: (tier) => {
            const minTier = tier;
            const target = 1500 + minTier * 700;
            const sender = pickOne(FUNNY_HACK_NAMES);
            return {
                title: `Juntá ${target.toLocaleString()} CR`,
                description: `Vendé archivos hasta acumular ${target.toLocaleString()} CR. Negocio redondo.`,
                minTier,
                targetCount: target,
                meta: { action: 'sell_value' },
                rewardCR: Math.round(target * 0.7 / 100) * 100,
                rewardTool: Math.random() < 0.35 ? { tier: minTier, chance: 0.6 } : null,
                sender
            };
        }
    },

    // ============================================================
    // 7) GHOST HACK: hacelo y borrá logs (requiere wallbreaker)
    // ============================================================
    {
        id: 'ghost_hack', weight: 6,
        requires: 'wallbreaker',
        gen: (tier) => {
            const minTier = tier;
            const baseCR = 1500 + minTier * 420;
            const sender = pickOne(FUNNY_HACK_NAMES);
            const descs = [
                'Necesito un trabajo limpio: entrá, borrá los logs y desaparecé.',
                'Hackeá un server y borrá TODOS los rastros. Si quedan logs, no cobrás.',
                'Operación fantasma: accedé, limpiá el log de conexión y salí como si nunca hubieras estado.',
                'Sabemos que hay un server con data. Entrá, borrá los logs y desaparecé.'
            ];
            return {
                title: 'Trabajo fantasma',
                description: pickOne(descs),
                minTier,
                targetCount: 1,
                meta: { action: 'ghost_hack' },
                rewardCR: Math.round(baseCR / 50) * 50,
                rewardTool: Math.random() < 0.45 ? { tier: minTier, chance: 0.7 } : null,
                sender
            };
        }
    },

    // ============================================================
    // 8) FIREWALL BREACH: hackear un server con firewall (requiere wallbreaker)
    // ============================================================
    {
        id: 'firewall_breach', weight: 8,
        requires: 'wallbreaker',
        gen: (tier) => {
            const ip = generateMissionTargetIP();
            const serverTier = tier;
            const baseCR = 1800 + serverTier * 480;
            const sender = pickOne(FUNNY_HACK_NAMES);
            const descs = [
                `Hay un server con firewall duro en ${ip}. Solo vos podés romperlo.`,
                `Necesito entrar a ${ip} pero tiene firewall. Usá el wallbreaker.`,
                `Ese server de ${ip} tiene un firewall que no cae con nada. Rompelo.`,
                `Un firewall me está bloqueando. Está en ${ip}. Usá el wallbreaker y entrá.`,
                `Necesito acceso a ${ip}. Tiene firewall activo. Confío en tu wallbreaker.`
            ];
            return {
                title: `Rompe el firewall de ${ip}`,
                description: pickOne(descs),
                minTier: serverTier,
                targetCount: 1,
                targetIP: ip,
                meta: {
                    action: 'hack_ip',
                    serverTier: serverTier,
                    forceFirewall: true
                },
                rewardCR: Math.round(baseCR / 50) * 50,
                rewardTool: Math.random() < 0.50 ? { tier: serverTier, chance: 0.7 } : null,
                sender
            };
        }
    },
];

const UPGRADE_MISSION_CHAIN = [];
const MISSION_MAX_AVAILABLE = 6;
const MISSION_MAX_ACTIVE = 4;
const MISSION_SPAWN_INTERVAL_MS = 40000;
const MISSION_EXPIRY_MS = 24 * 60 * 60 * 1000;
const MISSION_CRACKER_DROP_CHANCE = 0.40;