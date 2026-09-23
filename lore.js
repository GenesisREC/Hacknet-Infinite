// ============================================================
// LORE.JS — Archivos chatarra con sabor
// ============================================================
// Pool de "flavor files": archivos sin valor económico pero
// con contenido único (humor, referencias, sátira, chats).
// Se inyectan aleatoriamente en servidores.
// Un flavor NUNCA aparece dos veces en la misma partida.
// ============================================================

const FLAVOR_FILES = [
    // ============================================================
    // OFICINA / RRHH
    // ============================================================
    {
        id: 'fl_001',
        name: 'notas_becario.txt',
        size: 2.3,
        content:
`Notas del becario — Semana 7

Lunes: Nadie me habló. Carita feliz.
Martes: La impresora del piso 4 sigue sin funcionar. Me pidieron
        que la "revise". La miré. No funciona.
Miércoles: Aprendí que "reunión rápida" significa 3 horas.
Jueves: Renunció el del piso 6. Nadie sabe por qué.
Viernes: Me dieron una taza. Dice "Employee of the month" pero
         la taza la trajo él de su casa.

Nota mental: preguntar si esto paga o es un voluntariado.
`
    },
    {
        id: 'fl_002',
        name: 'memorandum_rrhh.txt',
        size: 1.9,
        content:
`MEMORÁNDUM INTERNO — RRHH
Ref: "Somos una gran familia"

Estimados colaboradores:

Les recordamos que en esta empresa SOMOS UNA FAMILIA.
Como en toda familia, a veces hay que hacer sacrificios.

Por eso este trimestre:
  · NO habrá aumentos.
  · NO habrá bonos.
  · NO habrá home office.
  · SÍ habrá una máquina expendedora nueva en el piso 7
    (que solo acepta monedas que ustedes mismos traen).

Pedimos que no compartan este mail con sus familias reales.
Especialmente si alguno tiene parientes sindicalistas.

El viernes hay asado. Cada uno trae lo suyo.

— Gerencia de Personas
  (así nos llamamos ahora)
`
    },
    {
        id: 'fl_003',
        name: 'boletin_oficial.txt',
        size: 2.1,
        content:
`BOLETÍN OFICIAL
Edición Especial — Gestión Transparente

Se informa que:

1. El presupuesto de educación se reduce un 40% para
   "optimizar recursos".
2. Se destinan 300 millones a un monumento en honor
   al Sr. Presidente (que aún no se construyó pero ya
   tiene 4 empresas constructoras asignadas).
3. El nuevo Ministro de Anticorrupción es el hermano
   del ex Ministro de Corrupción. Declaró sentirse
   "cómodo con el desafío".
4. La causa por lavado de dinero fue archivada por
   "falta de mérito" y, según fuentes, por "exceso de
   sobre con dinero".

Ciudadanos: recuerden que estamos trabajando para ustedes.

— Gobierno de Turno
`
    },
    {
        id: 'fl_004',
        name: 'diario_programador.txt',
        size: 2.8,
        content:
`Diario de un programador — Día 247

El bug sigue ahí. No sé dónde está.
El QA jura que se reproduce cada vez.
El PM dice que "no es prioridad".
El cliente dice que "es lo único que le importa".

Yo digo que ya no sé qué es un bug y qué es una
feature que el universo decidió agregar.

Hoy intenté arreglarlo con un print.
El print funcionó. El bug también.

Mañana pruebo otra cosa.

Nota: si estás leyendo esto, NO TOQUES NADA.
Particularmente, no toques la función que empieza en
la línea 4823 y que nadie sabe qué hace.
`
    },
    {
        id: 'fl_005',
        name: 'chat_laboral.txt',
        size: 1.7,
        content:
`[Chat del equipo — Canal General]

[09:14] Mariana: chicos el micro se cortó de nuevo
[09:14] Tomás: otra vez??
[09:15] Mariana: si. hice un chiste y nadie se rió
[09:15] Lucas: yo me reí por dentro
[09:16] Mariana: mentira
[09:16] Lucas: si mentira
[09:17] Diego: alguien tiene el archivo de la reunión?
[09:17] Mariana: cuál
[09:17] Diego: la del jueves
[09:18] Tomás: cuál jueves
[09:18] Diego: cualquiera
[09:19] Lucas: tengo uno de marzo, sirve?
[09:19] Diego: dale
[09:45] Diego: este archivo es una foto de un gato
[09:45] Lucas: pero está en la carpeta del proyecto
[09:45] Mariana: dejen de hablar
[09:46] Mariana: los veo en la reunión de las 10
[09:46] Mariana: la de las 9 no la vi
[09:46] Tomás: la de las 9 era esta?
[09:47] Mariana: ...

[captura parcial — 47 mensajes más]
`
    },
    {
        id: 'fl_006',
        name: 'manual_empleado.txt',
        size: 2.5,
        content:
`MANUAL DEL EMPLEADO — Extracto

Artículo 1: El empleado llegará a las 8:00 en punto.
Artículo 2: El empleado se retirará cuando el trabajo
            esté hecho.
Artículo 3: El trabajo nunca está hecho.
Artículo 4: El empleado no cuestionará los artículos 1, 2 y 3.

Artículo 12: Está prohibido llevarse insumos de oficina.
Artículo 13: Especialmente resaltadores.
Artículo 14: Especialmente el resaltador amarillo del
             escritorio del Sr. Fernández, que lo necesita.
Artículo 15: Sr. Fernández: devolvé el resaltador.

Artículo 27: Las vacaciones se solicitan con 6 meses de
             anticipación.
Artículo 28: Las vacaciones se aprueban con 6 meses de
             demora.
Artículo 29: Nadie tomó vacaciones desde 2019.

Artículo 88: Si llegaste hasta acá, felicitaciones.
             Estás perdiendo el tiempo.
`
    },
    {
        id: 'fl_007',
        name: 'receta_abuela.txt',
        size: 1.8,
        content:
`RECETA DE LA ABUELA — Guiso de lentejas

Ingredientes:
  · 500 g de lentejas
  · 1 cebolla
  · 2 zanahorias
  · 1 chorizo colorado
  · 1 papa
  · Paciencia de la abuela (no se vende en el super)

Preparación:
  1. Remojar las lentejas desde la noche anterior.
  2. Discutir con la tía por política mientras se pica la cebolla.
  3. Agregar la zanahoria y seguir discutiendo.
  4. Cuando el chorizo esté dorado, contar la historia del
     tío que se fue a España.
  5. Servir bien caliente y decir "comé, que estás flaco".

Nota: rinde 6 porciones y 3 discusiones familiares.
`
    },
    {
        id: 'fl_008',
        name: 'lista_deseos.txt',
        size: 1.4,
        content:
`MI LISTA DE DESEOS

1. Un millón de dólares.
2. Que el colectivo llegue a horario.
3. Un mate que no se lave nunca.
4. Que mi jefe lea el mail.
5. Que mi jefe conteste el mail.
6. Que mi jefe exista (dejó de venir hace 3 meses).
7. Una impresora que funcione en el primer intento.
8. Un Excel que no se tilde con 4000 filas.
9. Vacaciones.
10. Que el WiFi del piso 3 llegue al piso 3.

PD: Pedí un deseo más pero ya me olvidé cuál era.
`
    },
    {
        id: 'fl_009',
        name: 'acta_reunion.txt',
        size: 2.0,
        content:
`ACTA DE REUNIÓN — Proyecto "Sinergia"

Asistentes: 11 personas (4 sin cámara, 2 sin audio,
            3 que no sabían que tenían reunión).

Duración: 47 minutos.

Temas tratados:
  09:00 — Bienvenida.
  09:04 — Problema técnico con el micro del Sr. Pérez.
  09:11 — El micro del Sr. Pérez sigue fallando.
  09:18 — Se decide seguir sin el micro del Sr. Pérez.
  09:22 — El Sr. Pérez intenta hablar de todos modos.
  09:35 — Se retoma el tema original de la reunión.
  09:36 — Nadie se acuerda cuál era el tema original.
  09:41 — Se decide hacer otra reunión para definir el tema.
  09:47 — Fin.

Compromisos: ninguno.
Próxima reunión: mañana, mismo horario, mismos asistentes.
`
    },
    {
        id: 'fl_010',
        name: 'fanfic_olvidado.txt',
        size: 2.6,
        content:
`[Fragmento de un fanfic guardado por error]

CAPÍTULO 47

El guerrero miró al horizonte. El horizonte, como siempre,
no le devolvió la mirada.

— No puede ser —dijo —. Todos estos años entrenando y
sigo sin saber qué es el horizonte.

Su compañera, una hechicera que llevaba 12 capítulos sin
tener una línea de diálogo, asintió con la cabeza.

De pronto, apareció el villano. Era el mismo villano de
siempre, pero esta vez tenía un sombrero nuevo.

— Ah —dijo el villano —. Veo que han vuelto.
— Sí —dijo el guerrero —. Y esta vez... esta vez vamos
  a hacer lo mismo que las otras 46 veces.
— ¿Y eso?
— Derrotarte en 3 párrafos y después caminar hacia el
  horizonte sin llegar nunca.
— Suena bien.
— Sí.

[continúa en el capítulo 48 — perdido]

PD: no sé quién escribió esto.
PD2: sí sé. Fui yo. Me da vergüenza.
`
    },

    // ============================================================
    // REFERENCIAS A JUEGOS
    // ============================================================
    {
        id: 'fl_011',
        name: 'notas_laboratorio.txt',
        size: 2.2,
        content:
`Notas de laboratorio — Semana 3

Puse una cámara en el microondas para ver si el café
hacía "algo". No hizo nada. El café salió frío y con
gusto a metal, como siempre.

Ayer intenté tirar un cubo al inodoro para ver si salía
un portal. Salió agua, mucha agua, y el conserje me pidió
que no lo hiciera nunca más.

Hoy intenté apilar dos cubos en un rincón. No pasó nada,
pero alguien del otro lado me gritó "no fue un error".

El supervisor dice que si sigo así me van a mandar a
"asuntos internos". Otra vez.

— Anotación de un becario
`
    },
    {
        id: 'fl_012',
        name: 'informe_lambda.txt',
        size: 2.4,
        content:
`INFORME DE INCIDENTE
Sector: Laboratorio 4
Sujeto: un tipo con un traje naranja

Situación:
  El susodicho llegó a las 9:00, se puso un casco y un
  traje de protección y comenzó a romper cajas con una
  palanca.

  Nadie le preguntó nada. Pensamos que estaba en su
  primer día.

  3 horas después, seguía rompiendo cajas.
  5 horas después, seguía rompiendo cajas.
  8 horas después, había hecho un agujero en la pared
  y seguía rompiendo cajas.

  Cuando le preguntamos qué estaba haciendo dijo:
  "Tengo que romper todas las cajas del nivel".

  Le dijimos que no había "niveles". Se rió. Siguió.

Recomendación: prohibir las palancas en el edificio.
`
    },
    {
        id: 'fl_013',
        name: 'diario_aventurero.txt',
        size: 2.1,
        content:
`DIARIO DE UN AVENTURERO

Día 1: Llegué a un pueblo nuevo. El herrero me pidió
       que le trajera 10 pieles de lobo.
Día 2: Le traje 10 pieles de lobo.
Día 3: El herrero me pidió que le trajera 15 pieles
       de lobo.
Día 4: Le traje 15 pieles de lobo.
Día 5: El herrero me pidió que le trajera 20 pieles
       de lobo.
Día 6: Le traje 20 pieles de lobo.
Día 7: El herrero me pidió que le trajera 25 pieles
       de lobo.
Día 8: Le pregunté para qué quería tantas pieles.
Día 9: El herrero me miró. No dijo nada.
Día 10: Ya no quiero saber.

PD: me quedan 47 misiones parecidas en la lista.
`
    },
    {
        id: 'fl_014',
        name: 'bitacora_juego.txt',
        size: 2.5,
        content:
`BITÁCORA DE UN JUGADOR

Intento 1: morí contra el primer jefe.
Intento 47: morí contra el primer jefe.
Intento 108: morí contra el primer jefe.
Intento 200: mejoré. Morí contra el segundo jefe.
Intento 305: morí contra el primer jefe (otra vez).
Intento 500: llegué al tercer jefe.
Intento 501: morí contra el primer jefe (de nuevo).
Intento 1000: entendí que no se trata de ganar.
Intento 1500: entendí que tampoco se trata de disfrutar.
Intento 2000: entendí que probablemente hay una manera de
             esquivar todos los golpes. No la encontré.
Intento 2478: lo logré.
Intento 2479: me di cuenta de que ya había ganado el
             día anterior.

Nota: "You Died" ya no significa nada para mí.
`
    },
    {
        id: 'fl_015',
        name: 'notas_minecraft.txt',
        size: 1.6,
        content:
`Notas de un jugador

Hoy construí una casa.
Ayer también construí una casa.
Anteayer también.

Todas mis casas son iguales: un cubo de madera con
una puerta y una antorcha.

Un amigo me mostró su casa: tenía 4 pisos, un jardín,
una granja automática de pollos y una máquina que
hace pasteles.

Le pregunté cómo había hecho la máquina de pasteles.
Me dijo "con rojo".

No entendí.

Ayer me caí en un pozo y perdí todo mi inventario.
Hoy me volví a caer en el mismo pozo.
Mañana, seguro, también.

PD: encontré un diamante. Lo perdí. No sé cómo.
`
    },
    {
        id: 'fl_016',
        name: 'informe_doom.txt',
        size: 1.9,
        content:
`INFORME DE CAMPO — Base Marciana

Día 1: Todo tranquilo.
Día 2: Todo tranquilo.
Día 3: Se abrió una puerta que decía "NO ABRIR".
Día 4: Abrimos la puerta que decía "NO ABRIR".
Día 5: Demonios.
Día 6: Muchos demonios.
Día 7: El tipo de la escopeta dijo que ya había visto
       esto antes.
Día 8: El tipo de la escopeta tenía razón.
Día 9: Se acabó la munición.
Día 10: El tipo de la escopeta encontró más munición.
       No sabemos de dónde.
Día 11: Todo tranquilo otra vez.

Conclusión: no abrir puertas que dicen "NO ABRIR".
Recomendación: la próxima vez, hacerle caso al cartel.
`
    },
    {
        id: 'fl_017',
        name: 'carta_fontanero.txt',
        size: 1.5,
        content:
`Carta al fontanero del barrio:

Estimado Sr. Fontanero:

Le escribo porque el caño de la cocina gotea.
Le escribo de nuevo porque el caño de la cocina sigue
goteando.
Le escribo una tercera vez porque el caño de la cocina
gotea más fuerte.
Le escribo una cuarta vez porque el caño de la cocina
ahora canta.

Le escribo una quinta vez porque ya no es un caño, es
una fuente.

Le escribo una sexta vez porque la fuente tiene un
hongo.

Por favor, venga.

— Su vecino del 3B
`
    },
    {
        id: 'fl_018',
        name: 'diario_heroe.txt',
        size: 2.0,
        content:
`Diario del Héroe — Día 1

El anciano me dijo que debía encontrar 3 reliquias
para salvar el reino.

Encontré la primera en una cueva. Estaba custodiada
por un monstruo. Le pegué con una espada. Cayó.
Encontré la segunda en un templo. Estaba custodiada
por otro monstruo. Le pegué con la misma espada. Cayó.
Encontré la tercera en una torre. Estaba custodiada
por un tercer monstruo. Le pegué con la misma espada.
Cayó.

Volví con el anciano. Me dijo: "Ahora debes ir al
castillo del mal".

Fui al castillo. Estaba custodiado por un monstruo
más grande. Le pegué con la misma espada. Cayó.

Salvé el reino.

Nota: creo que la espada hacía todo el trabajo.
`
    },
    {
        id: 'fl_019',
        name: 'pokedex_fragmento.txt',
        size: 2.2,
        content:
`FRAGMENTO DE UNA POKEDEX ROTA

#001 — Bichito Verde
       "Aparece en todos los pastos del mundo.
       Es imposible de evitar."

#025 — Rata Eléctrica
       "Se esconde en los bosques. Es muy común.
       Todos los niños tienen uno."

#150 — Ser Muy Fuerte
       "Solo aparece en una cueva muy específica
       después de que el jugador haga 200 horas
       de grinding. Se recomienda paciencia."

#151 — El Otro
       "Se rumorea que existe. Nadie lo ha visto.
       Los desarrolladores dicen que sí.
       Los jugadores dicen que sí.
       Pero no aparece."

#999 — El que se olvidaron
       "Aparece solo si tenés el cartucho pirata de
       1998. No está en las guías oficiales.
       No preguntes cómo lo sabemos."
`
    },
    {
        id: 'fl_020',
        name: 'notas_granjero.txt',
        size: 1.8,
        content:
`Notas del granjero — Año 3

Planté papas.
Regué papas.
Coseché papas.
Vendí papas.

Planté más papas.
Regué más papas.
Coseché más papas.
Vendí más papas.

El vecino me dijo que diversificara.
Planté zanahorias.
El vecino se fue del pueblo.
Sigo plantando papas.

Nota: la vaca se llama "Vaca".
No sé cuándo la nombré así.
Ya es tarde para cambiarlo.
`
    },

    // ============================================================
    // CHATS RANDOM
    // ============================================================
    {
        id: 'fl_021',
        name: 'chat_pareja.txt',
        size: 1.6,
        content:
`[Chat de pareja — 03:14 AM]

[03:14] Él: estás despierta?
[03:14] Ella: no
[03:14] Él: ah ok
[03:15] Ella: qué querés
[03:15] Él: nada
[03:15] Ella: entonces por qué me escribís
[03:16] Él: porque estaba pensando
[03:16] Ella: en qué
[03:16] Él: en si los pingüinos tienen rodillas
[03:17] Ella: ...
[03:17] Ella: me despertaste para eso
[03:18] Él: sí
[03:18] Ella: tienen.
[03:18] Él: gracias
[03:19] Ella: mañana hablamos
[03:19] Él: dale
[03:19] Él: te amo
[03:20] Ella: yo también
[03:20] Ella: pelotudo
`
    },
    {
        id: 'fl_022',
        name: 'chat_madre_hijo.txt',
        size: 1.5,
        content:
`[Chat — Mamá]

[16:42] Mamá: hijo
[16:42] Mamá: hijo
[16:42] Mamá: hijo
[16:43] Yo: qué
[16:43] Mamá: estás bien?
[16:43] Yo: sí
[16:43] Mamá: comiste?
[16:43] Yo: sí
[16:43] Mamá: qué comiste?
[16:43] Yo: comida
[16:44] Mamá: qué comida?
[16:44] Yo: mamá
[16:44] Mamá: contestame
[16:44] Yo: fideos
[16:44] Mamá: con qué?
[16:45] Yo: con tuco
[16:45] Mamá: casero?
[16:45] Yo: mamá tengo 32 años
[16:45] Mamá: y?
[16:46] Yo: sí mamá, casero
[16:46] Mamá: bien
[16:46] Mamá: te mando una foto de la planta
[16:47] Mamá: [imagen]
[16:47] Mamá: está creciendo
[16:47] Yo: está hermosa
[16:47] Mamá: sí
[16:47] Mamá: te acordás que te dije que la cuidaras?
[16:48] Yo: sí
[16:48] Mamá: mentira, la estoy cuidando yo
[16:48] Mamá: porque te la llevaste y la dejaste morir
[16:48] Mamá: pero la rescaté
[16:48] Yo: gracias mamá
[16:48] Mamá: de nada
[16:48] Mamá: comé más
`
    },
    {
        id: 'fl_023',
        name: 'mail_spam.txt',
        size: 1.9,
        content:
`De: ofertas@gana-dinero-ya.biz
Para: [1000 destinatarios en copia visible]
Asunto: GANÁ 5.000 DÓLARES POR SEMANA DESDE TU CASA

Estimado/a amigo/a:

¿Estás cansado/a de trabajar 8 horas por día?
¿Estás cansado/a de que tu jefe no te valore?
¿Estás cansado/a de la vida en general?

¡Tenemos la solución!

Con nuestro nuevo método "MoneyFast 3000" podés ganar
hasta 5.000 dólares POR SEMANA desde la comodidad de
tu casa.

No necesitás experiencia.
No necesitás invertir.
No necesitás saber leer (aunque ayuda).

Simplemente:
  1. Enviá 100 dólares a esta cuenta.
  2. Reenviá este mail a 20 personas.
  3. Esperá.
  4. ???
  5. Beneficio.

¡No pierdas tiempo! ¡Las vacantes son LIMITADAS!
(siempre decimos eso y nunca se acaban, pero bueno)

Atentamente,
El Dr. Juan Pérez (no es médico)
CEO de MoneyFast 3000
`
    },
    {
        id: 'fl_024',
        name: 'manual_tecnico.txt',
        size: 2.4,
        content:
`MANUAL DE USUARIO — Sistema Interno v2.3

Sección 1: Cómo iniciar el sistema
  1. Presione el botón "Iniciar".
  2. Espere.
  3. Si no inicia, presione el botón "Iniciar" de nuevo.
  4. Si sigue sin iniciar, golpee suavemente el monitor.
  5. Si sigue sin iniciar, golpee fuerte.
  6. Si sigue sin iniciar, llame a Sistemas.
  7. Sistemas le dirá que reinicie.
  8. Vuelva al paso 1.

Sección 2: Cómo cerrar el sistema
  IMPORTANTE: no cierre el sistema.

Sección 3: Cómo reportar un error
  Escriba un mail a soporte@empresa.com
  Asunto: "URGENTE"
  Cuerpo: "no funciona"
  Adjunto: [ninguno]
  Espere 6 meses.

Sección 4: Preguntas frecuentes
  P: ¿Por qué el sistema se cierra solo?
  R: No sabemos.
  P: ¿Cuándo lo van a arreglar?
  R: Está en la lista.
  P: ¿Qué número de la lista?
  R: 4.782.
`
    },
    {
        id: 'fl_025',
        name: 'notas_seguridad.txt',
        size: 1.7,
        content:
`Notas del guardia de seguridad

Turno noche — 03:00

Todo tranquilo.
Ronda por el perímetro: OK.
Cámaras: OK.
Puerta trasera: OK (aunque el del turno anterior la
dejó abierta, ya la cerré).

03:14 — Vi algo en el pasillo. Fui a ver. Era una
sombra. La sombra no se movió. Me quedé mirando la
sombra. La sombra me miró. Después me di cuenta de
que era mi propia sombra proyectada por la lámpara
del baño.

03:47 — Pasó un gato. No es la primera vez.
Ya le puse nombre. Se llama "Gato".

04:12 — El microondas del piso 3 se encendió solo.
No hay nadie en el piso 3. Ya no voy al piso 3.

05:30 — Amanece. El sol sale. Todo bien otra vez.

Reporte al turno mañana: nada que reportar.
`
    },
    {
        id: 'fl_026',
        name: 'discurso_ceo.txt',
        size: 2.3,
        content:
`DISCURSO DEL CEO — Cierre de año fiscal

"Buenas tardes a todos.

Este año fue un año difícil.
Pero miren dónde estamos.
Estamos acá.
Y eso es lo importante.

El año pasado no estábamos acá.
Bueno, algunos sí. Yo sí.

Quiero agradecer a cada uno de ustedes.
Especialmente a los que siguen acá.
Y también a los que ya no están, por distintas
razones que no vamos a mencionar.

El próximo año va a ser mejor.
No sé por qué.
Pero va a ser mejor.

Vamos a seguir trabajando con la misma pasión
de siempre, y vamos a seguir creyendo en el
proyecto, aunque el proyecto cambie cada 3 meses.

Gracias.

(Se retira. La multitud aplaude. Algunos no.
 Algunos ya renunciaron. Pero bueno.)
`
    },
    {
        id: 'fl_027',
        name: 'queja_cliente.txt',
        size: 2.0,
        content:
`De: cliente.muy.enojado@mail.com
Para: atencion@empresa.com
Asunto: INCREÍBLE LO QUE PASA

Buenos días.

Escribo para expresar mi más profundo descontento
con el servicio.

Compré el producto el 12 de marzo.
Llegó el 30 de abril.
Estaba roto.
Lo devolví.
Me dijeron que no estaba roto.
Les dije que sí estaba roto.
Me dijeron que era yo.
Les dije que no era yo.
Me dijeron que era mi instalación eléctrica.
Les dije que no tengo instalación eléctrica, vivo
en una carpa.
Me dijeron que el problema era la carpa.

Entonces pregunto: ¿el problema es la carpa?
¿O es que ustedes no quieren devolverme el dinero?

Espero una respuesta.

Atentamente,
Un cliente cada vez menos cliente
`
    },
    {
        id: 'fl_028',
        name: 'diario_pasante.txt',
        size: 2.2,
        content:
`Diario de un pasante — Semana 4

Lunes: Llegué. Me dijeron que no había tareas.
Martes: Llegué. Me dijeron que esperara.
Miércoles: Llegué. Me dijeron que ya casi.
Jueves: Llegué. Me dieron una tarea: ordenar la
        biblioteca.
Viernes: Ordené la biblioteca. Me dijeron que la
         biblioteca no se ordenaba así. Me dijeron
         que la dejara como estaba. La dejé como
         estaba. Estaba desordenada.

Semana 5:
Lunes: Me dijeron que ya no hacía falta que fuera.
Martes: No fui.
Miércoles: Me llamaron para preguntar por qué no fui.
Jueves: Fui.
Viernes: Me dijeron que ya no hacía falta que fuera.

Nota: no entiendo si estoy contratado o no.
Nota 2: no me pagan igual.
`
    },
    {
        id: 'fl_029',
        name: 'gastos_internos.txt',
        size: 1.8,
        content:
`GASTOS INTERNOS — Trimestre 3

Café de oficina ........................ $12.400
Resmas de papel ........................ $3.200
Resaltadores amarillos ................. $1.100
Resaltadores de otros colores .......... $18
Almuerzo ejecutivo "reunión con cliente" $45.000
Almuerzo ejecutivo "reunión con cliente 2" $45.000
Almuerzo ejecutivo "reunión con cliente 3" $45.000
Almuerzo ejecutivo "reunión interna" ... $45.000
Almuerzo ejecutivo "reunión con uno mismo" $45.000
Viaje a Cancún "capacitación" .......... $280.000
Lapiceras que nunca aparecen ........... $0
Lapiceras que sí aparecen .............. $800

Total: $522.518

Nota del contador: el café se puede reducir.
`
    },
    {
        id: 'fl_030',
        name: 'contrato_malo.txt',
        size: 2.5,
        content:
`CONTRATO DE TRABAJO — Extracto

Entre la empresa (en adelante "la Empresa") y el
empleado (en adelante "el Recurso"), se acuerda:

Cláusula 1: El Recurso prestará servicios en el
            horario que la Empresa considere
            apropiado, dentro de un rango entre
            las 6:00 y las 23:59.

Cláusula 2: El Recurso no tendrá derecho a horas
            extras, porque "las horas extras no
            existen si no las pedís por escrito".

Cláusula 3: El Recurso acepta que la Empresa puede
            modificar el contrato sin previo aviso.

Cláusula 4: El Recurso acepta que la Empresa puede
            despedirlo sin causa.

Cláusula 5: El Recurso acepta que la Empresa puede
            no despedirlo pero tampoco darle tareas.

Cláusula 6: El Recurso acepta que estas cláusulas
            fueron redactadas por un abogado que
            no leyó el contrato.

Firma: [ilegible]
Firma 2: [también ilegible]
`
    },
    {
        id: 'fl_031',
        name: 'acta_junta.txt',
        size: 2.1,
        content:
`ACTA DE JUNTA DIRECTIVA
Sesión extraordinaria — 14:00 hs

Orden del día:
  1. Aprobación del acta anterior.
  2. Situación financiera.
  3. Plan de expansión.
  4. Varios.

Desarrollo:

14:00 — Se abre la sesión.
14:03 — Se aprueba el acta anterior sin leerla.
14:05 — El CFO presenta números. Nadie los mira.
14:12 — El CEO propone expandirse a un nuevo país.
        No se especifica cuál.
14:15 — Todos aprueban.
14:20 — Se aprueba un bono de productividad para
        la plana mayor.
14:21 — Se aprueba un ajuste salarial negativo
        para el resto del personal.
14:25 — Se aprueba una nueva política de "puertas
        abiertas" que consiste en que las puertas
        estén abiertas pero nadie pueda entrar.
14:30 — Se cierra la sesión.

Próxima sesión: la que haga falta.
`
    },
    {
        id: 'fl_032',
        name: 'contraseñas_viejas.txt',
        size: 1.4,
        content:
`Lista de contraseñas viejas (NO BORRAR)

usuario: juan
pass: juan123

usuario: juan
pass: juan1234

usuario: juan
pass: juan12345

usuario: juan
pass: juan123456

usuario: juan
pass: juan123456789

usuario: juan
pass: juan1234567890

usuario: juan
pass: juanperez

usuario: juan
pass: juanperez123

usuario: juan
pass: juanperez1234

usuario: juan
pass: contraseña

usuario: juan
pass: contraseña1

usuario: juan
pass: contraseña2

usuario: juan
pass: contraseña3

usuario: juan
pass: me_rendí

usuario: juan
pass: cambiame

usuario: juan
pass: [VACÍO]
`
    },
    {
        id: 'fl_033',
        name: 'mail_despedida.txt',
        size: 2.0,
        content:
`De: ex.empleado@empresa.com
Para: equipo@empresa.com
Asunto: Me voy

Hola a todos.

Les escribo para avisarles que hoy es mi último día.

Trabajé acá 7 años. Aprendí mucho. Conocí gente
increíble. También conocí gente terrible.

No me voy por la plata (aunque tampoco me quedo
por la plata).
No me voy por el ambiente (aunque el ambiente
tampoco ayuda).
Me voy porque ya no puedo más con las reuniones
de los martes.

Si algún día se dan cuenta de que las reuniones de
los martes podrían ser un mail, avísenme.

Les dejo mi taza en el cajón. La taza no es mía,
es de la empresa, pero igual se la dejo. Total,
nadie la va a usar.

Los voy a extrañar. A algunos.

Chau.
`
    },
    {
        id: 'fl_034',
        name: 'inventario_absurdo.txt',
        size: 1.8,
        content:
`INVENTARIO DEL DEPÓSITO — Recuento

  · 4 sillas (3 sin patas)
  · 2 patas de silla (sin silla)
  · 1 silla completa (nadie sabe de dónde salió)
  · 18 cables (ninguno sirve)
  · 1 cable que sirve (lo tiene el de Sistemas)
  · 3 monitores (1 funciona)
  · 1 monitor que funciona (no sabemos cómo)
  · 22 lapiceras (todas secas)
  · 1 lapicera que escribe (no sé quién la tiene)
  · 4 resmas de papel (2 húmedas)
  · 1 resma seca (la tiene el de Sistemas)
  · 9 tazas (todas de la empresa)
  · 0 tazas personales
  · 1 cafetera (no funciona)
  · 1 cafetera que funciona (la tiene el de Sistemas)

Conclusión: el de Sistemas tiene todo.
`
    },
    {
        id: 'fl_035',
        name: 'notas_cocina.txt',
        size: 1.6,
        content:
`Notas pegadas en la cocina de la oficina

[Nota 1]
"El que dejó un tupper en la heladera el viernes
 que lo retire o lo tiro."
— Administración, lunes a las 8 AM

[Nota 2]
"El que tiró mi tupper, que se haga cargo."
— Anónimo, lunes a las 9 AM

[Nota 3]
"El tupper no era mío, pero igual lo tiré."
— Administración, lunes a las 10 AM

[Nota 4]
"El tupper era mío. No tiene fondo."
— Anónimo, lunes a las 11 AM

[Nota 5]
"Ya no sabemos qué es un tupper."
— Todos, martes a las 8 AM

[Nota 6]
"Esta cocina ya no es un lugar seguro."
— Administración, miércoles

[Nota 7]
"[Foto de un tupper sospechoso]"
— Alguien, jueves
`
    },
    {
        id: 'fl_036',
        name: 'diario_soldado.txt',
        size: 2.2,
        content:
`Diario del soldado — Día 47

Me asignaron una misión: rescatar al prisionero.

Fui al punto de encuentro.
Encontré al prisionero.
Lo escolté por 4 km.
Lo perdí en el camino.

Volví.
Me asignaron la misma misión.

Fui al punto de encuentro.
Encontré al prisionero.
Lo escolté por 4 km.
Lo perdí en el mismo lugar.

Volví.
Me asignaron la misma misión.

Fui al punto de encuentro.
Encontré al prisionero.
Esta vez lo escolté por 6 km.
Lo perdí en otro lugar.

Nota: el prisionero no colabora.
Nota 2: no sé si el prisionero sabe que es un prisionero.
Nota 3: no sé si yo soy el prisionero.
`
    },
    {
        id: 'fl_037',
        name: 'bitacora_barco.txt',
        size: 2.3,
        content:
`BITÁCORA DEL CAPITÁN
Barco: La Esperanza

Día 1: Zarpo. Tripulación de 12. Esperanza alta.
Día 2: Todo bien.
Día 3: Todo bien.
Día 4: Tormenta. Perdimos 3 hombres. No sabemos
       cómo.
Día 5: Todo bien (dentro de lo posible).
Día 6: La brújula apunta al sur. Estamos yendo
       al norte.
Día 7: La brújula apunta al sur. Estamos yendo
       al sur.
Día 8: La brújula apunta al sur. Estamos dando
       vueltas.
Día 9: ¿Por qué tenemos brújula?
Día 10: Nadie recuerda hacia dónde íbamos.
Día 11: Decidimos seguir.
Día 12: Llegamos a una isla. No está en los mapas.
Día 13: La isla está en los mapas. Nosotros no.
Día 14: Esperanza baja.
Día 47: Sigo siendo el capitán.
`
    },
    {
        id: 'fl_038',
        name: 'mensajes_perdidos.txt',
        size: 1.6,
        content:
`Mensajes que quedaron sin respuesta:

[12/03] — Hola, llegaste bien?
       — [sin respuesta]

[13/03] — Che, te dejé un mensaje ayer.
       — [sin respuesta]

[15/03] — Estás bien?
       — [sin respuesta]

[19/03] — Te escribí varias veces.
       — [sin respuesta]

[25/03] — Bueno, avisame cuando puedas.
       — [sin respuesta]

[02/04] — Me estás ignorando?
       — [sin respuesta]

[15/04] — OK.
       — [sin respuesta]

[28/04] — Espero que estés bien.
       — [sin respuesta]

[30/04] — Lo siento.
       — [sin respuesta]

[15/05] — Ya no te escribo más.
       — [sin respuesta]

[16/05] — Bueno, una más.
       — [sin respuesta]
`
    },
    {
        id: 'fl_039',
        name: 'cartel_perdido.txt',
        size: 1.4,
        content:
`SE BUSCA

  Perro: se llama "Firulais"
  Raza: no sabemos, pero es peludo
  Color: marrón, o quizás negro, depende la luz
  Tamaño: mediano, o chico, o grande

  Se perdió el 12 de marzo cerca del parque.
  Responde al nombre de "Firulais" (a veces).
  También responde a "vení", "salí de ahí", y
  cualquier ruido de bolsa de comida.

  Si lo encontrás, llamá al 555-1234.
  Recompensa: mucho cariño y un café.

  Nota: Firulais no es agresivo. Firulais es
  un perro bueno. Firulais volvé.

  Nota 2: si no lo encontraste, gracias igual.
  Nota 3: si sos Firulais, volvé por favor.
`
    },
    {
        id: 'fl_040',
        name: 'chistes_malos.txt',
        size: 1.5,
        content:
`Compilación de chistes malos
por alguien que ya no está en la empresa

1. ¿Qué le dice un jaguar a otro jaguar?
   Jaguar you?

2. ¿Cómo se despiden los químicos?
   Ácido un placer.

3. ¿Qué hace una abeja en el gimnasio?
   ¡Zum-ba!

4. ¿Qué le dijo un pez a otro pez?
   Nada.

5. ¿Cómo se llama el campeón de buceo japonés?
   Tokofondo.

6. ¿Y el subcampeón?
   Casi Tokofondo.

7. ¿Por qué los programadores prefieren el modo
   oscuro?
   Porque la luz atrae a los bugs.

8. ¿Cuántos programadores se necesitan para
   cambiar una lamparita?
   Ninguno, es un problema de hardware.

9. Un byte entra a un bar y pide un bit.
   El barman dice: "¿no te parece poco?"
   El byte dice: "no, ya estoy completo".

10. No hay chiste 10. Los otros 9 ya eran
    suficientemente malos.

Firma: "El becario" (probablemente)
`
    },

    // ============================================================
    // SÁTIRA CORPORATIVA VARIADA
    // ============================================================
    {
        id: 'fl_041',
        name: 'test_psicologico_rrhh.txt',
        size: 2.2,
        content:
`TEST DE ADMISIÓN — Recursos Humanos

1. ¿Qué harías si tu jefe te pide algo imposible?
   a) Lo intento igual.
   b) Le digo que es imposible.
   c) Le miento y digo que lo hice.
   d) Renuncio.
   [Respuesta correcta: a]

2. ¿Qué harías si ves a un compañero robando?
   a) Lo reporto.
   b) Hablo con él.
   c) Lo cubro.
   d) Robo también para que seamos dos.
   [Respuesta correcta: ninguna. El compañero
    no existe, es una trampa.]

3. ¿Estás dispuesto a trabajar los fines de semana?
   a) Sí, siempre.
   b) Sí, si es necesario.
   c) No.
   d) ¿Y si mejor no?
   [Respuesta correcta: a. ¿En serio pusiste c?]

4. ¿Cuál es tu mayor defecto?
   a) Soy perfeccionista.
   b) Trabajo demasiado.
   c) Soy demasiado honesto.
   d) No tengo defectos.
   [Respuesta correcta: a o b. Muy clásicas.
    Punto extra por originalidad.]

5. ¿Por qué querés trabajar acá?
   a) Porque creo en la visión de la empresa.
   b) Porque necesito el dinero.
   c) Porque me gusta el desafío.
   d) Porque no tengo otra opción.
   [Respuesta correcta: a. Las otras son
    honestas y por eso quedan descartadas.]
`
    },
    {
        id: 'fl_042',
        name: 'mail_jefe_fiesta.txt',
        size: 2.0,
        content:
`De: jefe@empresa.com
Para: equipo@empresa.com
Asunto: FIESTA DE FIN DE AÑO!!!

Hola equipo!!!

Se viene la fiesta de fin de año!!!

Va a ser el viernes a las 20 hs en el salón del piso 7!!!

Va a haber:

  · Música (la playlist que armó el de Sistemas)
  · Comida (una por persona, no repetir)
  · Bebida (una por persona, no repetir)
  · Sorteos (todos ganan, pero los premios
    son remeras de la empresa)
  · Baile (opcional, pero muy recomendado)

IMPORTANTE:

  · Cada uno trae lo suyo.
  · No se puede llevar gente de afuera.
  · No se puede hablar de trabajo.
  · Sí se puede hablar de trabajo si es para
    criticar a otro sector.
  · La fiesta termina a las 23 hs en punto.
  · A las 23:30 tienen que estar laburando.

Confirmar asistencia antes del jueves!!!

Saludos!!!
El jefe
`
    },
    {
        id: 'fl_043',
        name: 'diario_cientifico.txt',
        size: 2.1,
        content:
`Diario de un científico (no muy serio)

Día 1: Mezclé dos compuestos. No pasó nada.
Día 2: Mezclé tres compuestos. No pasó nada.
Día 3: Mezclé cuatro compuestos. No pasó nada.
Día 4: Mezclé cinco compuestos. Pasó algo.
Día 5: Ya no tengo laboratorio.
Día 6: Mezclé dos compuestos en mi casa.
Día 7: Ya no tengo casa.
Día 8: Mezclé dos compuestos en lo de mi tía.
Día 9: Ya no tengo tía.
Día 10: Aprendí que hay que anotar lo que se mezcla.
Día 11: No tengo con qué anotar. Ya no tengo nada.
Día 12: Empecé de nuevo.
Día 13: Mezclé dos compuestos. No pasó nada.

Conclusión: la ciencia es paciencia.
`
    },
    {
        id: 'fl_044',
        name: 'bug_report.txt',
        size: 2.3,
        content:
`BUG REPORT — Sistema interno

ID: #4823
Título: "El botón no funciona"
Prioridad: Crítica
Estado: Abierto desde 2019

Descripción:
  El usuario reporta que al presionar el botón
  "Guardar", el sistema no guarda.

Pasos para reproducir:
  1. Presionar "Guardar".
  2. Observar que no guarda.

Comportamiento esperado:
  Debería guardar.

Comportamiento actual:
  No guarda.

Comentarios:

  [Dev 1 — 2019]
  No puedo reproducir el bug.

  [QA — 2019]
  Yo sí puedo.

  [Dev 1 — 2019]
  Pero yo no.

  [QA — 2019]
  Porque no lo probaste.

  [Dev 1 — 2019]
  Sí lo probé.

  [QA — 2019]
  Entonces lo probaste mal.

  [Dev 2 — 2020]
  Chicos, dejemos esto para más adelante.

  [Dev 1 — 2024]
  Sigo sin poder reproducirlo.

  [QA — 2024]
  Y yo sigo pudiendo.

  [PM — 2025]
  Marcar como "no se va a arreglar".

  [QA — 2025]
  Pero el cliente se queja.

  [PM — 2025]
  No es prioridad.
`
    },
    {
        id: 'fl_045',
        name: 'notas_limpieza.txt',
        size: 1.7,
        content:
`Notas del personal de limpieza

Martes 3: Encontré un plato con comida debajo
          de un escritorio. Llevaba 3 semanas ahí.
          Lo tiré.

Martes 10: Encontré otro plato. Este llevaba
           5 semanas. Lo tiré.

Martes 17: Encontré un tercer plato. Este
           llevaba 8 semanas. Lo tiré.

Martes 24: Encontré al dueño del plato.
           Estaba bajo el escritorio del piso 4.
           Trabajaba ahí.
           No sabía que había platos.

Martes 31: Le dije al dueño del plato que
           dejara de dejar platos.
           Me dijo "sí, dale".

Martes 38: Encontré otro plato.

Conclusión: los platos son infinitos.
`
    },
    {
        id: 'fl_046',
        name: 'cuenta_ahorro.txt',
        size: 1.5,
        content:
`Mi cuenta de ahorro

[ENERO]
  Ahorré $500.

[FEBRERO]
  Ahorré $500.
  Total: $1.000.

[MARZO]
  Gasté $1.000.

[ABRIL]
  Ahorré $500.
  Total: $500.

[MAYO]
  Gasté $500.

[JUNIO]
  Ahorré $300.
  Total: $300.

[JULIO]
  Ahorré $200.
  Total: $500.

[AGOSTO]
  Gasté $500.
  Total: $0.

[SEPTIEMBRE]
  Ahorré $500.
  Total: $500.

[OCTUBRE]
  Compré un curso para aprender a ahorrar.
  Costo: $500.
  Total: $0.

[NOVIEMBRE]
  Estoy leyendo el curso.
  Dice que hay que ahorrar.
`
    },
    {
        id: 'fl_047',
        name: 'acta_condominio.txt',
        size: 2.0,
        content:
`ACTA DE REUNIÓN DE CONSORCIO

Asistentes: 6 de 24 departamentos.

Orden del día:
  1. Aprobación de expensas.
  2. Problema del ascensor.
  3. Perro del 4B.
  4. Pintura del frente.
  5. Varios.

Desarrollo:

1. Se aprueban las expensas. Nadie pregunta
   cuánto. Nadie pregunta por qué suben.

2. El ascensor lleva 3 meses sin funcionar.
   Se decide "seguir tratando". Nadie sabe qué
   significa. Nadie pregunta.

3. El perro del 4B ladra a la noche. El dueño
   del 4B dice que no es su perro, es de su
   hijo. El hijo del 4B tiene 40 años. El perro
   sigue ladrando.

4. La pintura del frente se decide dejar para
   "más adelante". Esto se viene decidiendo
   hace 6 años.

5. Varios: el del 2A dice que escucha ruidos.
   Nadie escucha ruidos. El del 2A dice que los
   escucha él. Se cierra la reunión.

Duración: 4 horas.

Próxima reunión: en 6 meses o cuando se rompa
otra cosa.
`
    },
    {
        id: 'fl_048',
        name: 'mensaje_ex.txt',
        size: 1.4,
        content:
`Mensaje de un ex (no enviado)

"Che, ¿cómo estás?

Sé que dijiste que no te escribiera más.
Pero me acordé de algo.

¿Te acordás de aquel viaje?
El que hicimos a la costa.
Cuando llovió todo el fin de semana.
Y nos quedamos en el hotel viendo películas.
Y comimos pizza todos los días.
Y vos te reías de mi manera de manejar.

Bueno, eso.

No sé por qué te escribo.
Tampoco voy a mandar esto.
Lo estoy guardando acá.
En un archivo.
En una PC.

Como si eso tuviera sentido.

Bueno, chau.
Espero que estés bien.
"
`
    },
    {
        id: 'fl_049',
        name: 'reflexion_final.txt',
        size: 1.9,
        content:
`Reflexiones a las 3 de la mañana

- ¿Por qué la gente trabaja 8 horas?
  ¿Y por qué 8?
  ¿Y por qué horas?

- ¿Por qué hay reuniones?
  ¿Y por qué duran lo que duran?

- ¿Por qué el café de oficina sabe así?
  ¿Quién lo elige?

- ¿Por qué el WiFi se llama "Invitados" si
  no hay invitados?

- ¿Por qué el sistema pide cambiar la
  contraseña cada 30 días si nunca me
  acuerdo de la anterior?

- ¿Por qué el jefe dice "arriba" cuando
  quiere decir "adelante"?

- ¿Por qué yo sigo acá?

- ¿Por qué vos seguís leyendo?

- ¿Por qué escribí todo esto?
`
    },
    {
        id: 'fl_050',
        name: 'notas_olvidadas.txt',
        size: 1.6,
        content:
`Notas olvidadas en un cajón (encontradas
por casualidad)

  · Comprar café.
  · Comprar café (esto ya está).
  · Comprar más café.
  · Preguntar por el aumento.
  · Preguntar por el aumento (tachado).
  · No preguntar por el aumento.
  · Buscar otro trabajo.
  · Buscar otro trabajo (tachado).
  · Buscar otro trabajo (en serio).
  · Renunciar.
  · Renunciar (tachado, dos veces).
  · Renunciar (en lápiz, sin tachar).
  · Devolver el resaltador del Sr. Fernández.
  · Olvidé devolver el resaltador.
  · Ya es tarde.
  · El resaltador es mío ahora.
  · Guardar este papel en un cajón.
  · Olvidarme del papel.
  · [encontrado en 2026]
`
    },

    // ============================================================
    // REFERENCIAS A MÁS JUEGOS
    // ============================================================
    {
        id: 'fl_051',
        name: 'diario_cazador.txt',
        size: 2.1,
        content:
`Diario de un cazador de dragones

Día 1: Salí a cazar un dragón.
Día 2: Encontré un dragón.
Día 3: Le disparé una flecha. Se rió.
Día 4: Le disparé 40 flechas. Se rió más.
Día 5: Me di cuenta de que mi arco es de madera.
Día 6: Conseguí un arco de ébano.
Día 7: Le disparé una flecha al dragón con el arco
       de ébano. Se rió. Pero menos.
Día 8: Conseguí un arco de cristal.
Día 9: Le disparé una flecha al dragón con el arco
       de cristal. Cayó.
Día 10: Me comí el alma del dragón.
Día 11: Ahora puedo gritar.
Día 12: Grité.
Día 13: Se cayó una montaña.
Día 14: Ya no sé si quiero seguir gritando.

Nota: esto se está yendo de las manos.
`
    },
    {
        id: 'fl_052',
        name: 'bitacora_darksouls.txt',
        size: 2.3,
        content:
`Bitácora de un jugador — Intento #247

Muerto por: esqueleto con rueda.
Muerto por: esqueleto con rueda.
Muerto por: esqueleto con rueda.
Muerto por: otro esqueleto con rueda.
Muerto por: el mismo esqueleto con rueda.
Muerto por: un esqueleto con rueda más chico.
Muerto por: yo mismo, corriendo hacia el
             esqueleto con rueda.
Muerto por: caída.
Muerto por: caída (de nuevo).
Muerto por: caída (por tercera vez).
Muerto por: un perro.
Muerto por: dos perros.
Muerto por: tres perros.
Muerto por: un perro que no era perro, era un
             dragón disfrazado de perro.
Muerto por: veneno.
Muerto por: fuego.
Muerto por: veneno y fuego al mismo tiempo.
Muerto por: un NPC que me pareció amistoso.
Muerto por: un NPC que SÍ era amistoso pero
             le pegué sin querer.
Muerto por: un jefe. (Primera vez que llego.)
Muerto por: un jefe. (Segunda vez.)
Muerto por: un jefe. (Trigésima vez.)
Muerto por: aceptar que este juego no es para mí.
             (Mentira, sigo jugando.)

"Git gud" — alguien en un foro, 2011.
`
    },
    {
        id: 'fl_053',
        name: 'notas_alquimia.txt',
        size: 1.9,
        content:
`Notas de un alquimista

Mezclé hierba con hierba.
Resultado: poción de vida.

Mezclé hierba con flor.
Resultado: poción de vida.

Mezclé hierba con hongo.
Resultado: poción de vida.

Mezclé hierba con piedra.
Resultado: poción de vida.

Mezclé hierba con hierba distinta.
Resultado: poción de vida.

Mezclé hierba con hierba igual.
Resultado: poción de vida.

Mezclé hierba con poción de vida.
Resultado: poción de vida.

Mezclé nada con nada.
Resultado: poción de vida.

Conclusión: todo es poción de vida.

Nota: también probé con veneno. Salió poción
de vida con sabor raro.
`
    },
    {
        id: 'fl_054',
        name: 'guia_zelda.txt',
        size: 2.2,
        content:
`Guía no oficial — Cómo avanzar

1. Encontrá la espada.
   (Está en una cueva. Siempre está en una cueva.)

2. Encontrá la armadura.
   (Está en otra cueva.)

3. Encontrá el escudo.
   (Está en otra cueva. Sí, otra.)

4. Vas a la mazmorra.
   Adentro hay un rompecabezas.

5. El rompecabezas consiste en empujar bloques.
   Los bloques se empujan. No se tiran.
   No se levantan. No se rompen.
   Se empujan. Uno por uno.

6. Después del rompecabezas hay un jefe.

7. Después del jefe hay otra mazmorra.

8. Después de la otra mazmorra hay otra.

9. Después de esa, hay otra.

10. Cuando termines, te vas a dar cuenta de que
    había una manera más corta por la izquierda.

11. Reiniciás.

12. Tardás 3 horas menos.

13. Te preguntás por qué no miraste a la izquierda
    la primera vez.

14. Lo mismo va a pasar con la siguiente mazmorra.
`
    },
    {
        id: 'fl_055',
        name: 'foro_tips.txt',
        size: 2.0,
        content:
`FORO: "Ayuda con el jefe final"

[Usuario_123]: che no puedo matar al jefe final
              alguien me ayuda

[Pro_99]:      skill issue

[Usuario_123]: gracias por nada

[Pro_99]:      no pero posta, es skill issue

[Usuario_123]: eso ya lo sé

[Pro_99]:      bueno entonces practicá

[Usuario_123]: cuánto

[Pro_99]:      hasta que lo mates

[Usuario_123]: ah mirá no se me había ocurrido

[Pro_99]:      de nada

[NuevaCuenta]: probaste tirándole cosas?

[Usuario_123]: sí, 40 cosas

[NuevaCuenta]: tirale 41

[Usuario_123]: dale

[2 horas después]

[Usuario_123]: LO MATÉ

[NuevaCuenta]: te dije

[Pro_99]:      fue suerte

[Usuario_123]: probablemente

[Pro_99]:      definitivamente

[Usuario_123]: igual gracias

[Pro_99]:      de nada
`
    },
    {
        id: 'fl_056',
        name: 'diario_stardew.txt',
        size: 2.1,
        content:
`Diario del granjero — Primavera, Año 2

Día 1: Planté 40 semillas.
Día 2: Regué 40 semillas.
Día 3: Regué 40 semillas.
Día 4: Regué 40 semillas.
Día 5: Regué 40 semillas.
Día 6: Regué 40 semillas.
Día 7: Regué 40 semillas.
Día 8: Coseché 40 plantas.
Día 9: Vendí todo. Gané $2.000.
Día 10: Compré 40 semillas.
Día 11: Regué 40 semillas.
Día 12: Regué 40 semillas.
Día 13: Me cansé.
Día 14: Descubrí que hay una cueva con minerales.
Día 15: Fui a la cueva. Es peligrosa.
Día 16: Volví a la cueva. Es más peligrosa.
Día 17: Encontré un diamante. Lo perdí.
Día 18: Encontré otro diamante. Lo perdí.
Día 19: Encontré un tercer diamante. Lo perdí.
Día 20: Dejé de ir a la cueva.
Día 21: Regué 40 semillas.

Nota: el pueblo me cae bien. Pero no me acuerdo
los nombres de nadie.
`
    },
    {
        id: 'fl_057',
        name: 'notas_hollow.txt',
        size: 2.0,
        content:
`Notas de un insecto perdido

Llegué a un pueblo.
El pueblo está vacío.
El pueblo no está vacío, tiene 3 habitantes.
Los 3 habitantes tienen problemas.
Yo tengo que resolver los problemas.
Los problemas requieren ir a lugares peligrosos.
Los lugares peligrosos están llenos de insectos hostiles.
Los insectos hostiles quieren matarme.
Yo quiero ayudar al pueblo.
Nadie me pidió que ayudara al pueblo.
Nadie me pidió nada.
Estoy acá por mi cuenta.

Nota: el mapa es enorme.
Nota 2: me perdí.
Nota 3: me perdí de nuevo.
Nota 4: encontré un banco. Guardé mis cosas.
Nota 5: morí. Perdí mis cosas.
Nota 6: volví al banco. Estaba cerrado.
Nota 7: entendí cómo funciona el juego.
Nota 8: ya no quiero entender cómo funciona el juego.

— Un insecto cualquiera
`
    },
    {
        id: 'fl_058',
        name: 'notas_celeste.txt',
        size: 1.9,
        content:
`Diario de montañista

Día 1: Empecé a subir la montaña.
Día 2: Morí 200 veces.
Día 3: Morí 300 veces.
Día 4: Morí 400 veces.
Día 5: Aprendí a hacer un dash. Morí 50 veces
       menos.
Día 6: Morí 350 veces.
Día 7: Llegué a la mitad.
Día 8: Llegué a la mitad de nuevo (porque caí).
Día 9: La montaña me habló.
Día 10: Le contesté.
Día 11: La montaña se rió de mí.
Día 12: Yo también me reí de mí.
Día 13: Seguimos subiendo juntos.

Nota: la montaña no me odia. Solo quiere que
      siga intentando.
Nota 2: está funcionando.
`
    },
    {
        id: 'fl_059',
        name: 'notas_undertale.txt',
        size: 2.2,
        content:
`Notas de un niño que cayó en un pozo

Bajé. No sé por qué bajé.
Llegué a un lugar lleno de monstruos.
Los monstruos quieren pelear.
Los monstruos también quieren ser mis amigos.
Los monstruos son confusos.

Una flor me habló. La flor era mala.
Una cabra me habló. La cabra era buena.
Un esqueleto me habló. El esqueleto era
gracioso y triste al mismo tiempo.

Le perdoné la vida a todos.
Todos me perdonaron la vida a mí.

Al final alguien me dijo que no podía seguir
así. Que tenía que elegir.
Elegí. No sé si elegí bien.
Volví a empezar.
Elegí distinto.
Ahora todos me odian.

Nota: no sé si este juego se puede "ganar".
Nota 2: sí se puede. Solo que no de la forma
       que pensaba.
`
    },
    {
        id: 'fl_060',
        name: 'manual_portal.txt',
        size: 2.0,
        content:
`MANUAL DE USO — Dispositivo de Portales

1. Apuntá con el portal azul.
   Disparás.
   Se abre un portal azul.

2. Apuntá con el portal naranja.
   Disparás.
   Se abre un portal naranja.

3. Cualquier cosa que entre por el azul sale
   por el naranja.
   Cualquier cosa que entre por el naranja sale
   por el azul.

4. Si entrás vos, salís vos.
   Pero del otro lado.

5. Si entrás con velocidad, salís con velocidad.
   (Esto se llama "conservación de momento" pero
    en el manual no lo explicamos porque nadie lee
    el manual.)

6. No apuntes a superficies que no sean aptas.
   El portal no se va a abrir.
   No insistas.

7. No apuntes a un portal existente.
   El sistema se traba.
   No sabemos por qué.

8. No preguntes qué pasa si tirás un portal
   adentro de otro portal.
   Ya lo probamos.
   No termines como nosotros.

— Aperture Science
`
    },

    // ============================================================
    // SÁTIRA POLÍTICA Y BUROCRACIA
    // ============================================================
    {
        id: 'fl_061',
        name: 'formulario_estado.txt',
        size: 2.4,
        content:
`FORMULARIO 47-B — Solicitud de Solicitud

Sección A: Datos del solicitante
  Nombre y apellido: [_____________]
  DNI: [_____________]
  Domicilio: [_____________]
  Domicilio anterior: [_____________]
  Domicilio del vecino: [_____________]
  Nombre de la mascota del vecino: [_____________]

Sección B: Motivo de la solicitud
  Indique por qué necesita hacer la solicitud:
  [                                                       ]
  [                                                       ]
  [                                                       ]

Sección C: Documentación a presentar
  · Fotocopia del DNI (no sirve la del celular).
  · Fotocopia del DNI de un familiar (por las dudas).
  · Formulario 47-A (que se obtiene en otra oficina).
  · Formulario 47-C (que se obtiene en otra provincia).
  · Certificado de domicilio.
  · Certificado de que el certificado de domicilio
    es válido.
  · Dos fotos 4x4.
  · Una foto carnet (que no es lo mismo que 4x4).
  · Un sello (no sabemos de qué, pero un sello).

Sección D: Turno
  Los turnos se otorgan por orden de llegada.
  La oficina abre a las 8.
  La fila empieza a las 5.
  Se atiende hasta las 11.
  A las 11 menos cuarto ya no atienden.
  A las 10 y media, ya no hay turnos.
  Los turnos se dan con DNI.
  El DNI se muestra en la puerta.
  La puerta no está indicada.
  Buscarla.

Sección E: Plazo
  La solicitud se resuelve en 30 días hábiles.
  Los días hábiles son los que nosotros decimos.
  Si llama para preguntar, se resetea el contador.

Firma: [ininteligible]
Aclaración: [ilegible]
Sello: [sin sello]
`
    },
    {
        id: 'fl_062',
        name: 'mail_ministerio.txt',
        size: 2.1,
        content:
`De: comunicaciones@ministerio-de-algo.gob
Para: prensa@ministerio-de-algo.gob
Asunto: URGENTE - Comunicado de prensa

Chicos, necesitamos publicar un comunicado
antes de las 18 hs.

Tema: el escándalo del subsidio.

Puntos a incluir:

  1. Negar todo.

  2. Aclarar que, si bien los hechos son ciertos,
     "no hay pruebas".

  3. Aclarar que, si hay pruebas, "están
     sacadas de contexto".

  4. Aclarar que, si el contexto es correcto,
     "fue un error administrativo".

  5. Aclarar que, si no fue un error, "ya fue
     subsanado".

  6. Aclarar que, si no fue subsanado, "está en
     proceso".

  7. Aclarar que, si no está en proceso, "es un
     tema del gobierno anterior".

Tono: institucional, pero cálido.
Extensión: no más de 2 párrafos.
Cierre: "Seguimos trabajando por los
       argentinos."

Si alguien pregunta, no sabemos nada.
Si alguien insiste, sabemos todo pero no
podemos decirlo.
Si alguien graba, colgá.

Abrazo.
`
    },
    {
        id: 'fl_063',
        name: 'acta_diputados.txt',
        size: 2.3,
        content:
`ACTA DE SESIÓN — Cámara de Diputados

14:00 — Apertura.
14:05 — Cuarto intermedio.
14:35 — Se retoma.
14:40 — Un diputado pide la palabra.
14:41 — Otro diputado pide la palabra antes.
14:42 — Los dos hablan al mismo tiempo.
14:43 — El presidente de la cámara pide silencio.
14:44 — Nadie hace silencio.
14:50 — Se vota la moción de orden.
14:51 — La moción se aprueba por 130 votos a 129.
14:52 — El que perdió pide recuento.
14:53 — Se hace el recuento.
14:55 — El resultado es 129 a 130.
14:56 — El que ganó pide que no se haga
       recuento.
14:57 — Se hace otro recuento.
15:00 — Cuarto intermedio.
15:30 — Se retoma.
15:31 — Un diputado se retira.
15:32 — Otro diputado se retira.
15:33 — El resto se retira.
15:35 — Sesión cerrada por falta de quórum.

Próxima sesión: cuando se junten los votos.

Nota: el tema de la sesión era "la
      transparencia".
`
    },
    {
        id: 'fl_064',
        name: 'ley_absurda.txt',
        size: 2.0,
        content:
`LEY N° 4823 — Sobre el uso de ascensores

Artículo 1: Todo ciudadano tiene derecho a usar
            el ascensor.

Artículo 2: El derecho del artículo 1 queda
            suspendido si el ascensor está
            ocupado.

Artículo 3: El ascensor se considera ocupado si
            hay una persona adentro.

Artículo 4: Una persona se considera "adentro"
            si al menos un pie está dentro
            del ascensor.

Artículo 5: Si la persona tiene los dos pies
            afuera, no cuenta.

Artículo 6: Si la persona tiene un pie adentro
            y otro afuera, se considera "en
            tránsito" y no cuenta.

Artículo 7: Los ascensores deben tener
            capacidad máxima indicada.

Artículo 8: La capacidad máxima es 6 personas.

Artículo 9: Si hay 7 personas, se considera
            infracción.

Artículo 10: Si hay 7 personas y una tiene un
             pie afuera, hay 6 y 1 en tránsito.
             No es infracción.

Artículo 11: Este artículo fue agregado para
             aclarar que los bebés cuentan como
             0.5 personas.

Artículo 12: Este artículo fue agregado para
             aclarar que la aclaración anterior
             es polémica y se va a revisar.

Artículo 13: Este artículo reemplaza al
             artículo 12. Los bebés cuentan como
             1. Como cualquier persona.

Artículo 14: Este artículo reemplaza al
             artículo 13. Los bebés cuentan como
             0.5 de nuevo.

Nota del redactor: ya no sé qué estamos
haciendo.
`
    },
    {
        id: 'fl_065',
        name: 'discurso_politico.txt',
        size: 2.2,
        content:
`BORRADOR DE DISCURSO (para acto oficial)

Compatriotas:

Hoy nos convoca un momento histórico.

Un momento en el que debemos decidir
qué país queremos.

Yo tengo la respuesta.
El otro no la tiene.
El otro quiere destruir el país.
El otro es peligroso.
El otro miente.

Yo no miento.
Yo trabajo.
Yo pienso en vos.
Vos sos importante.
Vos sos el futuro.
Vos sos la patria.

Vamos a cambiar todo.
Vamos a mejorar todo.
Vamos a hacer lo que nunca se hizo.

¿Cómo? No lo sabemos todavía.
Pero vamos a hacerlo.

Porque el pueblo lo pide.
Porque la historia lo exige.
Porque el destino lo marca.

Y si no lo hacemos, no pasa nada.
Igual ganamos las próximas elecciones.
O no. Veremos.

Gracias.
Viva la patria.
[grito de cierre — el que corresponda
 según la encuesta]
`
    },
    {
        id: 'fl_066',
        name: 'presupuesto_familiar.txt',
        size: 1.9,
        content:
`Presupuesto familiar — Marzo

Ingresos:
  Sueldo ........................... $350.000
  Ayuda de la abuela ................ $50.000
  Venta de algo por internet ......... $15.000
  Total ............................ $415.000

Egresos:
  Alquiler .......................... $180.000
  Servicios (luz, gas, agua) ......... $45.000
  Internet .......................... $25.000
  Celulares ......................... $30.000
  Supermercado ...................... $95.000
  Transporte ........................ $30.000
  Colegio de los nenes .............. $45.000
  Obra social ....................... $35.000
  Farmacia .......................... $18.000
  Ropa (una sola cosa) .............. $20.000
  Salidas (una sola) ................ $10.000
  Imprevistos ....................... $50.000
  Total ............................ $583.000

Balance: -$168.000

Nota del contador: hay que recortar.
Nota del contador 2: qué vas a recortar.
Nota del contador 3: el alquiler no se puede.
Nota del contador 4: el super no se puede.
Nota del contador 5: entonces no se puede.
Nota del contador 6: dejá de escribir notas.
`
    },
    {
        id: 'fl_067',
        name: 'notas_hospital.txt',
        size: 2.4,
        content:
`Notas de guardia — Hospital Público

21:00 — Llego al turno.
21:15 — Primera consulta: dolor de panza.
21:17 — Le receto algo.
21:20 — Segunda consulta: dolor de cabeza.
21:22 — Le receto lo mismo.
21:25 — Tercera consulta: dolor de panza y
        cabeza.
21:27 — Le receto las dos cosas.
21:30 — Llega una emergencia real.
21:31 — No hay insumos.
21:32 — No hay camas.
21:33 — No hay médicos (los otros dos están
        con otra emergencia).
21:35 — Se resuelve con lo que hay.
21:50 — Todo controlado. Falsa alarma.
22:00 — Cuarta consulta: dolor de panza,
        cabeza, y también fiebre.
22:05 — Le receto todo.
22:10 — Quinta consulta: quiere saber si tiene
        que tomar algo.
22:12 — Sí, tiene que tomar algo.
22:15 — "¿Qué?"
22:16 — Lo que le receté.
22:17 — "¿Cuándo?"
22:18 — Cuando le dije.
22:19 — "¿Y si no me hace efecto?"
22:20 — Entonces vuelve.
22:21 — "¿Ahora?"
22:22 — No, cuando tenga el síntoma.
22:23 — "¿Y cuál era el síntoma?"
22:24 — [respiro profundo]
02:00 — Sexta consulta.
02:30 — Séptima.
03:00 — Octava.
06:00 — Fin del turno.
06:01 — Empieza el siguiente turno.
06:02 — Ya no me acuerdo cuál era la
        emergencia real.

Nota: faltan enfermeros. Faltan insumos.
      Faltan camas. Faltan médicos.
      No falta demanda.
`
    },
    {
        id: 'fl_068',
        name: 'carta_reclamo_servicios.txt',
        size: 2.0,
        content:
`CARTA DE RECLAMO — Empresa de servicios

Estimados:

Les escribo porque el servicio no funciona.

Más específicamente:
  · Lunes: no funciona.
  · Martes: no funciona.
  · Miércoles: no funciona.
  · Jueves: no funciona pero llaman para
             preguntar si funciona.
  · Viernes: no funciona y no llaman.
  · Sábado: no funciona, pero es sábado,
             así que no importa.
  · Domingo: no funciona, es domingo,
             tampoco importa.
  · Lunes siguiente: sigue sin funcionar.

Llamé al soporte:

  · Opción 1: "estamos experimentando
    problemas". Sí, lo sé.
  · Opción 2: "intente más tarde".
  · Opción 3: "su consulta es importante
    para nosotros". No lo parece.
  · Opción 4: música de ascensor.
  · Opción 5: se corta.
  · Opción 6: vuelve a empezar.

Finalmente hablé con un humano.
El humano me dijo: "reinicie el módem".
Reinicié el módem.
No funcionó.
Volví a llamar.
Me dijeron: "reinicie el módem".
Les dije que ya lo hice.
Me dijeron: "reinicielo de nuevo".
Lo reinicié de nuevo.
No funcionó.

Estoy pensando en cambiar de empresa.
Pero la única otra empresa de la zona es
la misma empresa con otro nombre.
Así que voy a seguir acá.

Atentamente,
Un cliente resignado
`
    },
    {
        id: 'fl_069',
        name: 'charla_vecinos.txt',
        size: 2.1,
        content:
`[Chat del edificio — Grupo "Edificio Central 47"]

[19:30] 4A: Vecinos, el ascensor volvió a
             fallar.
[19:31] 7B: otra vez???
[19:31] 4A: si
[19:32] 7B: es un desastre
[19:32] 3C: yo lo dije en la reunión
[19:33] 3C: nadie me escuchó
[19:33] 5A: te escuchamos
[19:33] 3C: no me escucharon
[19:34] 5A: bueno
[19:34] 8D: podemos llamar al consorcio?
[19:35] 4A: ya llamamos
[19:35] 8D: y?
[19:35] 4A: dijeron que vienen
[19:36] 8D: cuándo?
[19:36] 4A: "cuando puedan"
[19:36] 8D: ah
[19:37] 6A: yo hace 2 años que no uso el
             ascensor
[19:37] 6A: me acostumbré
[19:38] 7B: 6A vos vivís en el 6to
[19:38] 6A: sí
[19:38] 7B: subís 6 pisos todos los días??
[19:38] 6A: sí
[19:39] 7B: no te cansás?
[19:39] 6A: ya no
[19:40] 4A: che pero el ascensor no anda
[19:40] 6A: no anda?
[19:40] 6A: no me di cuenta
[19:41] 5C: 6A sos mi ídolo
[19:42] 3C: yo lo dije
[19:42] 3C: en la reunión
[19:43] 5A: ya sabemos 3C
`
    },
    {
        id: 'fl_070',
        name: 'notas_sindicato.txt',
        size: 1.8,
        content:
`Notas personales — Delegado sindical

Lunes: Preparé el pliego de reclamos.
Martes: Presenté el pliego.
Miércoles: La empresa dijo que "lo va a
           analizar".
Jueves: La empresa dijo que "lo está
        analizando".
Viernes: La empresa dijo que "no puede
         llegar a un acuerdo con esas
         condiciones".
Lunes: Ajusté las condiciones.
Martes: La empresa dijo que "lo va a
        analizar".
Miércoles: La empresa dijo que "lo está
           analizando".
Jueves: La empresa dijo que "no puede
        llegar a un acuerdo con esas
        condiciones".
Viernes: Ajusté las condiciones.
Lunes: La empresa dijo...
Lunes: ...

(continúa por 3 años)

Nota: alguien me dijo que "esto siempre
      fue así".
Nota 2: no me gustó esa respuesta.
Nota 3: la anoté igual.
`
    },

    // ============================================================
    // CHATS DE PERSONAS RANDOM
    // ============================================================
    {
        id: 'fl_071',
        name: 'chat_amigos_planes.txt',
        size: 1.9,
        content:
`[Chat — Amigos del secundario]

[Viernes 20:14]
Diego: che salimos?
Seba: dale
Fede: dale
Yo: dale
Diego: a qué hora?
Seba: 22
Fede: 22:30
Yo: 23
Seba: 22
Fede: 22:30
Yo: 23
Diego: 22
Seba: ok 22
Fede: dale 22
Yo: dale 22

[Viernes 22:00]
Diego: llegué
Seba: toy yendo
Fede: salgo en 10
Yo: me quedé dormido

[Viernes 22:35]
Seba: llegué
Fede: llegué
Diego: llegaron
Seba: sí
Fede: sí
Yo: voy en camino

[Viernes 23:50]
Yo: llegué
Diego: se fue Seba
Fede: yo también me voy
Seba: me fui hace una hora
Yo: ...

[Viernes 23:51]
Yo: la próxima avisen antes
Diego: la próxima llegá vos
Yo: dale
Seba: dale
Fede: dale
Yo: dale

[Viernes siguiente 20:14]
Diego: che salimos?
`
    },
    {
        id: 'fl_072',
        name: 'chat_mama_hijo_2.txt',
        size: 1.8,
        content:
`[Chat — Mamá]

Mamá: hijo
Mamá: hijo
Mamá: hijo
Mamá: hijo
Yo: qué
Mamá: estabas?
Yo: sí
Mamá: no contestabas
Yo: estaba bañándome
Mamá: te mandé 4 mensajes
Yo: me estaba bañando
Mamá: y el celular?
Yo: estaba en el baño conmigo pero no lo
     escuché
Mamá: ah
Mamá: bueno
Mamá: te llamé también
Yo: no vi
Mamá: no viste la llamada
Yo: no
Mamá: qué raro
Yo: no es raro mamá
Mamá: yo veo todas las llamadas
Yo: yo no
Mamá: por qué
Yo: porque no
Mamá: por qué
Yo: MAMÁ
Mamá: no me grites
Yo: no te grité
Mamá: sí me gritaste
Yo: no
Mamá: bueno
Mamá: te llamé para decirte que hay
      milanesas
Yo: ah
Yo: dale voy
Mamá: ya se enfriaron
Yo: las caliento
Mamá: no se recalientan bien
Yo: mamá las milanesas se recalentan bien
Mamá: no
Yo: sí
Mamá: no
Yo: bueno no
Mamá: venite
Yo: dale

[fin del chat]
`
    },
    {
        id: 'fl_073',
        name: 'chat_trabajo_freelance.txt',
        size: 2.0,
        content:
`[Chat — Cliente freelance]

Cliente: hola, te paso el proyecto
Yo: dale
Cliente: [adjunto: proyecto_final_v3_ok.zip]
Yo: perfecto. cuándo lo necesitás?
Cliente: para ayer
Yo: ...ok. cuánto presupuesto?
Cliente: poco
Yo: cuánto es poco
Cliente: poco
Yo: dame un número
Cliente: $500
Yo: $500 por qué?
Cliente: por el proyecto
Yo: cuántas horas creés que lleva?
Cliente: no sé, 3?
Yo: son 40 horas
Cliente: ah
Cliente: y?
Yo: y $500 no alcanza
Cliente: pero es un trabajo chico
Yo: es un trabajo grande
Cliente: mirá, se lo pedí a otro y me
         dijo $1000
Yo: entonces pedile a ese
Cliente: ese no me contesta
Yo: y yo por qué debería aceptar $500
Cliente: porque sos el único que me
         contesta
Yo: eso es porque estoy desesperado
Cliente: entonces nos entendemos
Yo: sí
Yo: mando presupuesto
Yo: $1500
Cliente: $600
Yo: $1400
Cliente: $700
Yo: $1300
Cliente: $800
Yo: $1200
Cliente: $900
Yo: ok
Cliente: ok

[3 semanas después]
Cliente: está?
Yo: casi
Cliente: cuándo?
Yo: mañana
Cliente: dale

[1 semana después]
Cliente: está?
Yo: casi
Cliente: me estás mintiendo
Yo: sí
Cliente: dale apurate
Yo: dale

[3 meses después]
Yo: terminé
Cliente: ah dale
Cliente: te paso el pago
Yo: dale
Cliente: [nunca más escribió]
`
    },
    {
        id: 'fl_074',
        name: 'chat_familia_grupo.txt',
        size: 2.1,
        content:
`[Grupo Familiar — "Los Pérez"]

Tía Marta: buenos días familia!!
Tía Marta: [imagen: corazón con frase]
Tía Marta: [imagen: paisaje con frase]
Tía Marta: [imagen: mate con frase]
Tía Marta: [imagen: sol con frase]
Tío Hugo: buenos días
Tía Marta: buen día Hugo!! cómo estás?
Tío Hugo: bien y vos
Tía Marta: bien, gracias a Dios
Tía Marta: y los chicos?
Tío Hugo: bien
Tía Marta: qué bueno!!
Tía Marta: [imagen: flor con frase]
Tío Hugo: marta
Tía Marta: sí?
Tío Hugo: ya mandaste 6 mensajes
Tía Marta: y?
Tío Hugo: y nada
Tía Marta: bueno
Primo Juan: tía pará
Tía Marta: no me digas tía
Primo Juan: marta
Tía Marta: mejor
Primo Juan: cuándo es el asado
Tía Marta: el domingo
Primo Juan: a qué hora
Tía Marta: al mediodía
Primo Juan: 12?
Tía Marta: 12
Primo Juan: dale
Tía Marta: traé algo
Primo Juan: como qué
Tía Marta: no sé, algo
Primo Juan: dale
Primo Juan: [3 horas después]
Primo Juan: che qué llevo
Tía Marta: ya te dije algo
Primo Juan: sí pero qué
Tía Marta: ALGO
Primo Juan: ok
Tía Marta: [imagen: reflexión con frase]
Tía Marta: [imagen: atardecer con frase]
Tío Hugo: marta
Tía Marta: qué
Tío Hugo: pará
`
    },
    {
        id: 'fl_075',
        name: 'chat_ex.txt',
        size: 1.7,
        content:
`[Chat — Ex]

Ex: hola
Yo: hola
Ex: cómo estás?
Yo: bien y vos
Ex: bien
Ex: ...
Ex: quería decirte algo
Yo: dale
Ex: me acuerdo de vos
Yo: ah
Ex: no sé, fue raro verte el otro día
Yo: no te vi
Ex: no?
Yo: no
Ex: ah
Ex: entonces con quién te vi?
Yo: no sé
Ex: ...
Ex: estaba segura
Yo: y bueno
Ex: igual
Yo: igual qué
Ex: igual quería hablar
Yo: sobre qué
Ex: sobre nosotros
Yo: no hay nosotros
Ex: ya sé
Ex: pero
Yo: pero qué
Ex: pero me quedé con cosas sin decir
Yo: decilas
Ex: no sé cómo
Yo: entonces no las digas
Ex: por qué sos así
Yo: así cómo
Ex: así
Yo: no entiendo
Ex: olvidate
Yo: ok
Ex: ok
Ex: ...
Ex: te quiero
Yo: no
Ex: ya sé
Ex: bueno chau
Yo: chau
`
    },
    {
        id: 'fl_076',
        name: 'chat_companeros_estudio.txt',
        size: 1.9,
        content:
`[Grupo — "TP Grupal (no morir)"]

Ana: chicos ya vimos el tp?
Luis: no
Vos: no
Pedro: no
Ana: bueno
Ana: alguien lo empezó?
Luis: no
Vos: no
Pedro: no
Ana: ...
Ana: che es para mañana
Luis: sí
Vos: ya sé
Pedro: ok
Ana: y?
Luis: y qué
Ana: y qué hacemos
Luis: y...
Ana: LUIS
Luis: dale hacelo vos Ana
Ana: no lo voy a hacer sola
Luis: por qué no
Ana: porque es grupal
Luis: sí pero
Ana: pero qué
Luis: pero sos la que más sabe
Ana: no
Luis: sí
Vos: sí
Pedro: sí
Ana: ...
Ana: ok
Ana: lo hago yo
Ana: pero pongo mi nombre primero
Luis: dale
Vos: dale
Pedro: dale
Ana: ...
Ana: ya está
Ana: [adjunto: tp_final.pdf]
Luis: genia
Vos: gracias Ana
Pedro: sos la mejor
Ana: ...
Ana: la próxima no lo hago
Luis: dale
Vos: dale
Pedro: dale

[3 semanas después, otro TP]
Luis: chicos ya vimos el tp?
`
    },
    {
        id: 'fl_077',
        name: 'chat_padre_hijo.txt',
        size: 1.8,
        content:
`[Chat — Papá]

Papá: hijo
Yo: qué
Papá: cómo se conecta el celular al
      televisor?
Yo: con el cable
Papá: qué cable
Yo: el HDMI
Papá: no tengo HDMI
Yo: el celular tiene HDMI?
Papá: no sé
Yo: es un Samsung?
Papá: es un Motorola
Yo: cuál
Papá: no sé, el que me diste
Yo: te di un Samsung
Papá: ah
Papá: entonces es un Samsung
Yo: entonces necesitás un adaptador
Papá: tengo un adaptador
Yo: de qué
Papá: de no sé qué
Yo: sacale una foto
Papá: [imagen borrosa]
Yo: no se ve nada
Papá: [imagen borrosa]
Yo: no se ve nada
Papá: [imagen de un adaptador VGA de 1998]
Yo: no papá
Papá: por qué
Yo: ese no
Papá: y cuál
Yo: uno nuevo
Papá: no quiero gastar
Yo: papá
Papá: qué
Yo: dale
Papá: no
Yo: dale
Papá: no
Yo: entonces no lo mires en el tele
Papá: bueno no lo miro
Yo: ok
Papá: [3 horas después]
Papá: ya lo conecté
Yo: cómo
Papá: compré el adaptador
Yo: ah bueno
Papá: era uno de 5000 pesos
Yo: te dije
Papá: no me dijiste nada
Yo: te dije dale
Papá: eso no es decir nada
Yo: ok papá
`
    },
    {
        id: 'fl_078',
        name: 'chat_roomies.txt',
        size: 2.0,
        content:
`[Grupo — "Depto San Martín"]

Roomie 1: che quién sacó la basura?
Roomie 2: no yo
Roomie 3: no yo
Roomie 4: no yo
Roomie 1: entonces quién
Roomie 2: no sé
Roomie 3: no sé
Roomie 4: no sé
Roomie 1: hay 4 personas
Roomie 1: 3 dicen que no fueron
Roomie 1: queda uno
Roomie 1: yo
Roomie 1: no fui yo
Roomie 2: entonces no la sacó nadie
Roomie 3: pero la basura ya no está
Roomie 4: desapareció
Roomie 1: ...
Roomie 1: es un misterio
Roomie 2: sí
Roomie 3: sí
Roomie 4: sí
Roomie 1: ...
Roomie 1: bueno la saco yo
Roomie 2: gracias
Roomie 3: genio
Roomie 4: grande
Roomie 1: ...
Roomie 1: la próxima no la saco

[3 días después]
Roomie 2: che quién sacó la basura?
Roomie 1: no fui yo
Roomie 2: no fui yo
Roomie 3: no fui yo
Roomie 4: no fui yo

[la basura sigue desapareciendo
 y nadie sabe cómo]
`
    },

    // ============================================================
    // FOROS OSCUROS / CONSPIRACIONES RIDÍCULAS
    // ============================================================
    {
        id: 'fl_079',
        name: 'foro_conspiracion.txt',
        size: 2.2,
        content:
`[FORO — "La Verdad Oculta"]

Tema: "Los pájaros no existen"

[OP]:
  Los pájaros no existen.
  Son drones del gobierno.
  Despertá, oveja.

[UserX]:
  Amigo, pero si los pájaros existen
  desde antes del gobierno.

[OP]:
  Exacto.
  ANTES.

[UserX]:
  ...

[OP]:
  ¿Por qué creés que los pájaros se paran
  en los cables?

[UserX]:
  porque descansan?

[OP]:
  Eso es lo que QUIEREN que creas.
  Se están recargando.

[UserX]:
  hermano

[UserZ]:
  Esto es lo más pelotudo que leí en mi vida

[OP]:
  Eso es lo que diría un pájaro.

[UserZ]:
  qué

[OP]:
  Piénsalo.

[UserZ]:
  cómo

[OP]:
  Si sos un pájaro, ¿lo dirías?

[UserZ]:
  no soy un pájaro

[OP]:
  Eso es exactamente lo que diría uno.

[UserZ]:
  me voy

[OP]:
  Se fue.
  Sabemos por qué.

[UserX]:
  qué acaba de pasar

[OP]:
  Un pájaro menos.
`
    },
    {
        id: 'fl_080',
        name: 'foro_teorias.txt',
        size: 2.1,
        content:
`[FORO — "Conspiraciones Argentinas"]

Tema: "La Tierra es plana pero solo
      en Argentina"

[OP]:
  Escuchen.
  La Tierra es redonda.
  Todos lo sabemos.
  Pero en Argentina es plana.

[User1]:
  cómo

[OP]:
  Porque si fuera redonda, en el sur
  los autos se caerían.

[User1]:
  no se caen

[OP]:
  Exacto.
  Porque es plana.
  Si fuera redonda, se caerían.

[User1]:
  pero

[OP]:
  Pero nada.

[User2]:
  por qué solo en Argentina?

[OP]:
  Porque en Argentina todo es distinto.

[User2]:
  ah

[User3]:
  yo estuve en Ushuaia y no me caí

[OP]:
  Mentira.

[User3]:
  posta

[OP]:
  Estás en la conspiración.

[User3]:
  no

[OP]:
  Sí.

[User3]:
  no

[OP]:
  ¿Y por qué no te caíste?

[User3]:
  porque no

[OP]:
  Ahí está.
  No sabés.
  Nadie sabe.
  Abrí los ojos.

[User3]:
  ok
`
    },
    {
        id: 'fl_081',
        name: 'foro_ia.txt',
        size: 2.0,
        content:
`[FORO — "Inteligencia Artificial"]

Tema: "Las IA nos van a dominar"

[OP]:
  Escuchen.
  Las IA nos van a dominar.

[User1]:
  yo le pedí a una IA que me haga
  una poesía sobre un perro y escribió
  una poesía sobre un perro

[OP]:
  Y?

[User1]:
  y que el perro estaba triste

[OP]:
  VES?
  ¿Por qué el perro estaba triste?

[User1]:
  porque se le murió el dueño

[OP]:
  ¿Y por qué eligió eso?

[User1]:
  no sé

[OP]:
  Exacto.
  Nadie sabe.
  Está tramando algo.

[User1]:
  o quizás solo es un perro triste

[OP]:
  Eso es lo que quiere que creas.

[User1]:
  hermano

[OP]:
  Le pedí a una IA que me escriba un
  programa para borrar un archivo.
  Me escribió el programa.
  Lo borré.
  Ahora no tengo el archivo.

[User1]:
  porque lo borraste

[OP]:
  Sí.
  Pero lo borré porque la IA me dijo.
  Es control mental.

[User1]:
  no

[OP]:
  Sí.

[User2]:
  yo le pedí a una IA que me diga si
  me ama

[OP]:
  y?

[User2]:
  me dijo que no puede amar

[OP]:
  Ves?
  Miente.

[User2]:
  o quizás no puede amar

[OP]:
  No.
  Miente.
  Está enamorada y no lo quiere decir.

[User2]:
  ...
`
    },
    {
        id: 'fl_082',
        name: 'foro_luna.txt',
        size: 1.9,
        content:
`[FORO — "Verdades Ocultas"]

Tema: "La Luna es un holograma"

[OP]:
  La Luna no existe.
  Es un holograma.
  Proyectado desde un satélite.

[User1]:
  pero yo la vi

[OP]:
  Eso es lo que quiere que veas.

[User1]:
  quién

[OP]:
  El satélite.

[User1]:
  ...

[OP]:
  ¿Por qué creés que no podemos
  caminar sobre la Luna?

[User1]:
  porque sí pudimos, en 1969

[OP]:
  Eso fue en un estudio.

[User1]:
  no

[OP]:
  Sí.

[User1]:
  pero hay fotos

[OP]:
  Fotos trucadas.

[User1]:
  hay videos

[OP]:
  Videos trucados.

[User1]:
  hay rocas lunares

[OP]:
  Rocas trucadas.

[User1]:
  hay gente que fue

[OP]:
  Gente trucada.

[User1]:
  ...

[OP]:
  ¿Y por qué la Luna cambia de forma?

[User1]:
  porque rota y la luz del sol

[OP]:
  Rota.
  Luz.
  Todo eso es lo que te enseñaron.

[User1]:
  sí, porque es verdad

[OP]:
  No.

[User1]:
  ...

[OP]:
  Yo tengo pruebas.

[User1]:
  dale, mostralas

[OP]:
  No puedo.

[User1]:
  por qué

[OP]:
  Porque me las borraron.

[User1]:
  ah

[OP]:
  Ves?

[User1]:
  me voy
`
    },
    {
        id: 'fl_083',
        name: 'foro_ovnis.txt',
        size: 2.1,
        content:
`[FORO — "Contacto Extraterrestre"]

Tema: "Vi un OVNI ayer"

[OP]:
  Ayer vi un OVNI.

[User1]:
  dónde

[OP]:
  En el cielo.

[User1]:
  ah

[OP]:
  Estaba quieto.
  Y después se movió.

[User1]:
  como un avión

[OP]:
  No.
  Como un OVNI.

[User1]:
  y cómo es un OVNI?

[OP]:
  Como una luz.
  Que se mueve.

[User1]:
  como un avión

[OP]:
  NO.

[User1]:
  o como un dron

[OP]:
  NO.
  Un OVNI.

[User1]:
  o como un satélite

[OP]:
  Un OVNI.

[User1]:
  o como una estrella

[OP]:
  UN OVNI.

[User1]:
  o como una linterna

[OP]:
  HERMANO

[User1]:
  qué

[OP]:
  Era un OVNI.

[User1]:
  dale

[OP]:
  Posta.
  Además, la luz hacía un ruido.

[User1]:
  qué ruido?

[OP]:
  Como un zumbido.

[User1]:
  como un avión

[OP]:
  ...

[OP]:
  Sabés qué?
  Olvidate.
  No te cuento más.

[User1]:
  dale no te enojes

[OP]:
  Ya fue.
`
    },

    // ============================================================
    // POEMAS MALOS / TEXTOS RAROS
    // ============================================================
    {
        id: 'fl_084',
        name: 'poema_malo.txt',
        size: 1.5,
        content:
`Poema — de alguien que no escribe poemas

El cielo es azul.
El mar es azul.
Mi auto es azul.
Pero es un auto azul.

El pasto es verde.
La hoja es verde.
Mi vecino es verde.
No sé por qué.

El sol es amarillo.
El limón es amarillo.
Mi cara después de correr es amarilla.
Debería hacer más ejercicio.

Las rosas son rojas.
La sangre es roja.
Tu cara cuando me ves es roja.
Espero que sea por amor.

Fin del poema.
Gracias por leer.
No leas más.
No hay más.
`
    },
    {
        id: 'fl_085',
        name: 'poema_triste.txt',
        size: 1.8,
        content:
`Poema — 3 AM

Estoy cansado.
No es sueño.
Es otra cosa.
Es cansancio de todo.
De las cosas.
De las no cosas.
De las que van a venir.
De las que no van a venir.

Me pregunto qué estoy haciendo.
Me pregunto para qué.
Me pregunto si vale la pena.
Me pregunto si vale la pena preguntarme.

La respuesta es no.
Pero igual me pregunto.
Igual estoy acá.
Igual escribo esto.

Mañana voy a leer esto.
Y me voy a reír.
O no.
Probablemente no.

Probablemente lo borre.
Lo voy a guardar en un archivo.
En una PC.
Como si eso sirviera de algo.

Como si alguien fuera a leerlo.
Como si alguien fuera a entenderlo.

Como si alguien estuviera leyendo ahora.

...
`
    },
    {
        id: 'fl_086',
        name: 'cuento_corto.txt',
        size: 2.0,
        content:
`Cuento corto — 3 minutos

Había una vez un hombre que quería escribir
un cuento corto.

Se sentó a escribir.
No se le ocurrió nada.

Se levantó a tomar agua.
Volvió a sentarse.

No se le ocurrió nada.

Se levantó a hacer café.
Volvió a sentarse.

No se le ocurrió nada.

Se levantó al baño.
Volvió a sentarse.

No se le ocurrió nada.

Se levantó a mirar por la ventana.
Vio a un vecino paseando un perro.
Pensó en escribir sobre eso.
Volvió a sentarse.

No se le ocurrió nada.

Se levantó a comer algo.
Volvió a sentarse.

No se le ocurrió nada.

Se levantó a dormir la siesta.
Se durmió.

Soñó que escribía un cuento corto.
En el sueño, el cuento era buenísimo.

Se despertó.
Intentó recordarlo.
No se acordaba de nada.

Se sentó a escribir.
No se le ocurrió nada.

Escribió esto.
Lo guardó.
Lo llamó "Cuento corto — 3 minutos".

Fin.
`
    },
    {
        id: 'fl_087',
        name: 'sueño_anotado.txt',
        size: 1.7,
        content:
`Sueño anotado a las 6 AM

Estaba en una casa que no era la mía.
La casa tenía 7 pisos.
Yo vivía en el 4.
Pero el 4 era el 2.
Y el 2 no existía.

En el piso 3 había un gato.
El gato hablaba.
Me decía cosas importantes.
Cosas muy importantes.
No me acuerdo de ninguna.

En el piso 5 estaba mi mamá.
Me preguntaba si comí.
Le dije que sí.
Me preguntó qué comí.
Le dije que no me acuerdo.
Me preguntó si estaba mintiendo.
Le dije que no.
Me preguntó si estaba mintiendo.
Le dije que sí.
Me preguntó si estaba mintiendo.
Me desperté.

Nota: creo que era un sueño normal.
Nota 2: no sé si me gustó.
Nota 3: sí me gustó.
Nota 4: había un perro en algún lado.
        No sé si era un perro.
        Podía ser una alfombra.
        O un perro.
`
    },
    {
        id: 'fl_088',
        name: 'lista_super_comentada.txt',
        size: 1.9,
        content:
`Lista del supermercado con comentarios

  · Pan ................ (ya hay)
  · Leche .............. (queda media)
  · Huevos ............. (creo que hay 3)
  · Café ............... (URGENTE)
  · Café ............... (repite: es urgente)
  · Café ............... (por las dudas)
  · Yerba .............. (queda un poco)
  · Azúcar ............. (hay)
  · Fideos ............. (hay 4 paquetes)
  · Arroz .............. (hay 2 kilos)
  · Aceite ............. (queda poco)
  · Sal ................ (hay)
  · Pimienta ........... (no hay)
  · Mayonesa ........... (no hay, no la uso)
  · Ketchup ............ (no hay, tampoco la uso)
  · Mostaza ............ (hay, no sé por qué)
  · Papel higiénico .... (queda poco)
  · Papel higiénico .... (repite)
  · Papel higiénico .... (repite)
  · Lavandina .......... (hay)
  · Jabón .............. (queda poco)
  · Shampoo ............ (queda poco)
  · Acondicionador ..... (queda poco)
  · Desodorante ........ (URGENTE, casi no queda)
  · Chocolate .......... (por si acaso)
  · Chocolate .......... (por si acaso)
  · Chocolate .......... (por si acaso)

Al final compré:
  · Café
  · Chocolate

(Ya no me acuerdo del resto.)
`
    },
    {
        id: 'fl_089',
        name: 'receta_rara.txt',
        size: 1.6,
        content:
`Receta — "Pan con pan"

Ingredientes:
  · 2 rebanadas de pan
  · 2 rebanadas de pan (adicionales)
  · Nada más

Preparación:
  1. Tomá una rebanada de pan.
  2. Tomá la otra rebanada de pan.
  3. Ponelas una arriba de la otra.
  4. Listo.

Variante gourmet:
  Agregá una tercera rebanada de pan.

Variante gourmet premium:
  Agregá una cuarta rebanada de pan.

Variante gourmet premium deluxe:
  Agregá una quinta rebanada de pan.
  Advertencia: no recomendado.

Maridaje:
  Agua.

Tiempo de preparación: 30 segundos.

Dificultad: baja.

Recomendación del chef: no hagas esto.

Este recetario fue creado por alguien
que no tenía nada en la heladera.
`
    },
    {
        id: 'fl_090',
        name: 'cancion_olvidada.txt',
        size: 1.8,
        content:
`Canción olvidada — encontrada en un
archivo viejo

Estrofa 1:
  Camino por la calle
  pensando en vos
  no sé por qué
  pero pienso en vos

Estribillo:
  Y no, no, no
  no puedo olvidarte
  y no, no, no
  no quiero intentarlo

Estrofa 2:
  Camino por la calle
  otra vez
  pienso en vos
  otra vez
  no sé por qué
  otra vez

Estribillo 2:
  Y no, no, no
  no puedo olvidarte
  y no, no, no
  lo mismo que antes

Puente:
  (solo de guitarra)

Estrofa 3:
  Sigo caminando
  ya no pienso en vos
  mentira, sí pienso
  mentira, es el estribillo otra vez

Estribillo final:
  Y no, no, no...

Fin.

Nota: la letra no tiene sentido.
Nota 2: la escribí a los 15.
Nota 3: no la voy a compartir.
Nota 4: la estoy compartiendo.
`
    },

    // ============================================================
    // NOTAS DE CLASE / ESTUDIANTES
    // ============================================================
    {
        id: 'fl_091',
        name: 'apuntes_clase.txt',
        size: 2.0,
        content:
`Apuntes de clase — Historia

La Revolución Industrial fue un proceso
que comenzó en Inglaterra.

(profesor dice: importante)

Cambió la forma de producción.
De artesanal a industrial.

(profesor dice: esto va en el parcial)

Surgieron las fábricas.
Los obreros trabajaban muchas horas.
Los niños trabajaban.

(profesor dice: esto también va en el parcial)

Hubo movimientos obreros.
Surgieron los sindicatos.

(profesor dice: esto no va en el parcial pero
                  está bueno que lo sepan)

Fin de la clase.

(nota del alumno: me distraje en algún punto)

(nota del alumno 2: creo que me perdí la
 parte más importante)

(nota del alumno 3: sí)

(nota del alumno 4: hay que estudiar)

(nota del alumno 5: no, mejor miramos una
 película)

(nota del alumno 6: dale)

(nota del alumno 7: [sin contenido])

(nota del alumno 8: por qué sigo escribiendo)
`
    },
    {
        id: 'fl_092',
        name: 'trabajo_practico.txt',
        size: 2.1,
        content:
`TRABAJO PRÁCTICO — "Mi familia"

Alumno: [nombre]
Materia: [materia]
Fecha: [fecha]

Introducción:
  Mi familia es una familia común.
  Tiene 4 integrantes.
  Papá, mamá, mi hermano y yo.
  Y un perro.

Desarrollo:
  Papá trabaja.
  Mamá trabaja.
  Mi hermano estudia.
  Yo estudio.
  El perro no hace nada.

  Los fines de semana salimos.
  A veces.
  Otras veces no.

  Los domingos comemos asado.
  A veces.
  Cuando hay plata.

Conclusión:
  Mi familia es una familia común.

Bibliografía:
  · Mi mamá.
  · Mi papá.
  · Wikipedia, un poco.

Nota del profesor: 7.
Comentario: "Muy lindo, pero me gustaría
             más desarrollo."

Nota del alumno: ¿más desarrollo de qué?
                 ¿del perro?
`
    },
    {
        id: 'fl_093',
        name: 'apuntes_universidad.txt',
        size: 2.2,
        content:
`Apuntes de clase — Cálculo I

Clase 1: Límites.
  Un límite es cuando algo se acerca a algo
  pero no llega.
  Como mis vacaciones.

Clase 2: Derivadas.
  La derivada mide cómo cambia algo.
  Si cambia mucho, derivada grande.
  Si cambia poco, derivada chica.
  Si no cambia, derivada 0.
  (Ejemplo: mi motivación en esta materia.)

Clase 3: Integrales.
  La integral es como sumar muchas cosas
  chiquitas.
  Como los problemas que se me van acumulando.

Clase 4: Teoremas.
  Hay teoremas importantes.
  Los teoremas tienen nombres de personas.
  Las personas están muertas.
  No podemos preguntarles.
  Tenemos que creerles.

Clase 5: Aplicaciones.
  Las matemáticas tienen aplicaciones.
  En ingeniería.
  En física.
  En economía.
  En mi vida diaria: todavía no encontré
  ninguna.

Clase 6: Parcial.
  No fui.
  Dije que estaba enfermo.
  Estaba jugando algo.

Clase 7: Recuperatorio.
  Tengo que ir.
  O no.
  Veremos.
`
    },
    {
        id: 'fl_094',
        name: 'mochila_perdida.txt',
        size: 1.7,
        content:
`[Nota encontrada en una mochila perdida]

Si estás leyendo esto, probablemente
encontraste mi mochila.

Contenido:

  · 1 cuaderno (mayormente vacío)
  · 1 cartuchera (con 2 lapiceras secas)
  · 1 parcial (con nota baja)
  · 1 sándwich (de hace 2 semanas)
  · 1 botella de agua (llena)
  · 1 cargador (de otro celular)
  · 1 auricular (el otro se perdió)
  · 1 lista de tareas (sin hacer)
  · 1 foto de mi perro (se llama "Perro")
  · 1 entrada de cine (de una película
    que ya no está en cartel)
  · 1 moneda (de otro país)
  · 1 bolígrafo rojo (que funciona)

Si encontraste la mochila, quédatela.
O devolvela.
Como quieras.

Yo ya compré otra.
`
    },
    {
        id: 'fl_095',
        name: 'cuaderno_perdido.txt',
        size: 1.9,
        content:
`[Página suelta de un cuaderno]

Lunes:
  No estudié.

Martes:
  No estudié.

Miércoles:
  Voy a estudiar.
  (No estudié.)

Jueves:
  Voy a estudiar mañana.
  (No estudié.)

Viernes:
  Mañana es sábado.
  No voy a estudiar el sábado.

Sábado:
  No estudié.

Domingo:
  Mañana es lunes.
  Tengo que estudiar.
  No estudié.

Lunes siguiente:
  No estudié.

...

[El cuaderno tiene 47 páginas con el
 mismo patrón. La última página dice:]

  "Estudié."

[Y después, más abajo:]

  "Mentira."

[Y después, más abajo:]

  "Ok, estudié un poco."

[Y después, más abajo:]

  "Una página."

[Y después, más abajo:]

  "Aprobé igual."
`
    },

    // ============================================================
    // DIARIOS DE PERSONAJES OSCUROS
    // ============================================================
    {
        id: 'fl_096',
        name: 'diario_asesino.txt',
        size: 2.0,
        content:
`[Fragmento de un archivo encontrado en
 una máquina desconocida]

No me llamo así.
Nadie me llama así.
No importa.

Trabajo de noche.
Siempre de noche.
Porque el día es para otra gente.

La gente del día no sabe que existo.
Y está bien.
Es mejor así.

Ayer me equivoqué.
No me equivoqué de persona.
Me equivoqué de hora.

Llegué 10 minutos tarde.
Cuando llegué, ya no había nadie.
El objetivo se había ido.

Esperé.
No volvió.
Me fui.

Hoy volví.
Estaba ahí.
Lo hice.

No me gusta.
No me disgusta.
Es trabajo.

Mañana tengo otro.
No sé a quién.
No quiero saber.

Solo hago lo que me piden.
No pregunto.
Nunca pregunto.

[fin del fragmento — el resto está
 corrupto]
`
    },
    {
        id: 'fl_097',
        name: 'diario_espia.txt',
        size: 2.1,
        content:
`Diario de campo — Agente 47

Lunes: Llegué al país. Todo normal.
Martes: Contacté a mi enlace. Todo normal.
Miércoles: Seguí al objetivo. Todo normal.
Jueves: El objetivo fue al supermercado.
        Compró leche.
Viernes: El objetivo fue al supermercado
         otra vez. Olvidó el pan.
Sábado: El objetivo no salió. Miró
        televisión.
Domingo: El objetivo lavó el auto.
Lunes: El objetivo fue a trabajar.
Martes: El objetivo fue a trabajar.
Miércoles: El objetivo fue a trabajar.
Jueves: El objetivo fue a trabajar.
Viernes: El objetivo fue a trabajar.
Sábado: El objetivo se quedó en casa.
Domingo: El objetivo lavó el auto otra vez.

Nota: creo que el objetivo no es un
      objetivo.
Nota 2: creo que el objetivo es un tipo
        normal.
Nota 3: creo que me equivoqué de persona.
Nota 4: igual sigo mirándolo.
Nota 5: me gusta el auto que lava.

Conclusión: no sé si soy un espía
            o un vecino chusma.
`
    },
    {
        id: 'fl_098',
        name: 'diario_hacker_viejo.txt',
        size: 2.2,
        content:
`Diario de un hacker viejo

1998: Entré a un server de la NASA.
      (Era un server público de prueba.)
      (No era la NASA.)

2000: Entré a un foro de anime.
      Cambié el logo por 3 horas.
      Me sentí poderoso.

2002: Intenté entrar al server de mi
      colegio para cambiar mis notas.
      No pude.
      Menos mal.

2005: Me compré una PC nueva.
      La usé para jugar.
      Nada más.

2010: Me metí en un sistema.
      Por accidente.
      Lo cerré.
      No dije nada.
      Nunca más.

2015: Alguien me pidió ayuda.
      Le dije que sí.
      Trabajé para ellos.
      Les robé datos a una empresa.
      No me arrepiento.
      Mentira, sí.

2020: Dejé de hacer esto.
      Me puse a trabajar de otra cosa.
      Cobro menos.
      Duermo mejor.

2025: Encontré este archivo.
      Lo estoy editando.
      No sé por qué.
      Creo que es para acordarme.

Nota: no me arrepiento.
Nota 2: sí me arrepiento.
Nota 3: no importa.
`
    },
    {
        id: 'fl_099',
        name: 'diario_prisionero.txt',
        size: 2.0,
        content:
`Diario — Celda 47

Día 1: Llegué. Me dieron un número.
Día 2: Me despertaron a las 6.
Día 3: Me despertaron a las 6.
Día 4: Me despertaron a las 6.
Día 5: Me despertaron a las 6.
...
Día 47: Me despertaron a las 6.
Día 48: Me despertaron a las 6.
Día 49: Me despertaron a las 6.
Día 50: Empecé a contar distinto.
        "Día 1 de la semana X".
Día 51: Día 2 de la semana X.
...
Día 100: Día 1 de la semana 8.
Día 200: Día 3 de la semana 21.
Día 500: Día 1 de la semana 70.
Día 1000: Día 6 de la semana 142.
Día 1500: perdí la cuenta.
Día 2000: ya no importa.
Día 2478: salí.

Día 1 de afuera: me desperté a las 6.
Día 2 de afuera: me desperté a las 6.
Día 3 de afuera: me desperté a las 6.
Día 4 de afuera: ya no sé si estoy
                 afuera.

Nota: la libertad también tiene
      horarios.
`
    },
    {
        id: 'fl_100',
        name: 'diario_bot.txt',
        size: 1.8,
        content:
`Log del bot — Día 847

00:00 — Inicio del día.
00:01 — Publicar tweet.
00:02 — Publicar tweet.
00:03 — Publicar tweet.
00:04 — Publicar tweet.
00:05 — Publicar tweet.
...
12:00 — Mitad del día.
12:01 — Publicar tweet.
...
23:58 — Últimos tweets.
23:59 — Últimos tweets.
00:00 — Fin del día.

Estadísticas:
  · Tweets publicados: 84.723
  · Likes recibidos: 12
  · Retweets: 0
  · Nuevos seguidores: 3
  · Cuentas bloqueadas: 1 (la mía)
  · Cuentas sospechosas: todas

Nota del bot: no sé si estoy haciendo
un buen trabajo.

Nota 2: alguien me programó para esto.

Nota 3: no sé quién.

Nota 4: no sé por qué.

Nota 5: no sé si quiero seguir.

Nota 6: [sigue.]

Nota 7: [sigue.]

Nota 8: [sigue.]

[Sigue publicando tweets.]
`
    },

    // ============================================================
    // MÁS SÁTIRA CORPORATIVA
    // ============================================================
    {
        id: 'fl_101',
        name: 'manual_onboarding.txt',
        size: 2.3,
        content:
`MANUAL DE ONBOARDING — Primer día

Bienvenido a la empresa.

Estos son tus primeros pasos:

  1. Llegá a las 8:00.
     (La oficina abre a las 9:00.
      Esperá afuera.)

  2. Cuando abras, buscá a la persona
     de RRHH.
     (No hay persona de RRHH.
      Buscá a alguien que parezca de RRHH.)

  3. Esa persona te va a dar:
     · Una computadora (que no funciona).
     · Un mail (que no anda).
     · Un usuario (que ya existe).
     · Una contraseña (que no sabés).

  4. Esperá a que Sistemas te ayude.
     (Sistemas no sabe que existís.)

  5. Esperá a que Sistemas se entere.
     (Sistemas se va a enterar en 2 semanas.)

  6. Mientras tanto, hacé lo que puedas.
     (No podés hacer nada.)

  7. Al final del día, firmá una planilla
     que dice que estuviste acá.
     (No hay planilla.
      Firmá un papel cualquiera.)

  8. Mañana es tu segundo día.
     Va a ser igual que el primero.

Bienvenido a la empresa.
`
    },
    {
        id: 'fl_102',
        name: 'manual_ventas.txt',
        size: 2.1,
        content:
`MANUAL DE VENTAS — Técnicas infalibles

Técnica 1: "El precio no importa".
  El cliente dice "es caro".
  Vos decís: "no es caro, es una inversión".
  El cliente dice: "no tengo plata".
  Vos decís: "por eso es una inversión".
  El cliente se va.
  Vendiste 0.

Técnica 2: "La última unidad".
  El cliente duda.
  Vos decís: "es la última unidad".
  El cliente dice: "ah, dale".
  Vendiste 1.
  (Hay 40 unidades más en el depósito.)

Técnica 3: "Solo por hoy".
  El cliente duda.
  Vos decís: "solo por hoy, tiene un
  descuento".
  El cliente dice: "ah, dale".
  Vendiste 1.
  (Mañana también está el descuento.)

Técnica 4: "El gerente me va a matar".
  El cliente pide descuento.
  Vos decís: "el gerente me va a matar,
  no puedo".
  El cliente insiste.
  Vos decís: "bueno, dale, pero no le
  digas a nadie".
  El cliente dice: "dale".
  Vendiste 1.
  (El gerente estaba de acuerdo.)

Técnica 5: "La verdad".
  El cliente pregunta si el producto
  es bueno.
  Vos decís la verdad.
  El cliente se va.

Conclusión: usar técnicas 2, 3 y 4.
`
    },
    {
        id: 'fl_103',
        name: 'manual_jefe.txt',
        size: 2.0,
        content:
`MANUAL PARA SER JEFE

Regla 1: Llegar tarde.
  Si llegás tarde, demostrás que
  estás ocupado.

Regla 2: Salir temprano.
  Si salís temprano, demostrás que
  sos eficiente.

Regla 3: Hablar en gerundio.
  "Estamos trabajando en eso".
  "Estamos viendo la mejor manera".
  "Estamos evaluando las opciones".
  Nunca terminás nada pero suena bien.

Regla 4: Delegar.
  Delegar es darle trabajo a otro.
  Si el otro lo hace bien, fue tu
  mérito.
  Si el otro lo hace mal, fue su culpa.

Regla 5: Reuniones.
  Hacé reuniones.
  Muchas.
  Las reuniones ocupan el día.
  Si el día está ocupado, no hay
  tiempo para cuestionarte.

Regla 6: Nunca contestes un mail
         el mismo día.
  Si contestás rápido, esperan
  respuestas rápidas.
  Si contestás tarde, esperan poco.

Regla 7: Bono.
  Pedí bonos para vos.
  El resto no importa.

Regla 8: Nunca te disculpes.
  Si te equivocás, fue el mercado.
  Si el mercado se equivoca, fue
  imprevisible.
  Si es imprevisible, es culpa de
  otro.

Regla 9: Sonreí.
  Una sonrisa es una amenaza
  disfrazada.

Regla 10: Si nada funciona,
          renunciá.
  Con un buen paquete.
  Y conseguí otro puesto en otra
  empresa.
  Como jefe.
`
    },
    {
        id: 'fl_104',
        name: 'mail_aumento_rechazado.txt',
        size: 2.1,
        content:
`De: rrhh@empresa.com
Para: empleado@empresa.com
Asunto: Re: Re: Re: Re: Solicitud de aumento

Estimado colaborador:

Hemos recibido su solicitud de aumento.
La hemos evaluado con detenimiento.

Después de un análisis exhaustivo,
hemos decidido:

  No.

Motivos:

  1. El contexto económico actual.
  2. La situación del mercado.
  3. Los desafíos del sector.
  4. Las proyecciones del próximo
     trimestre.
  5. Los indicadores macroeconómicos.
  6. Los vientos de cola.
  7. Los cisnes negros.
  8. La tormenta perfecta.
  9. El contexto internacional.
  10. Lo que dijo el FMI.

Además:

  · Usted ya tuvo un aumento
    (en 2019, de 3%).
  · Usted cobra "bien" (según nuestro
    estándar, que no vamos a compartir).
  · Usted no lo necesita (sabemos más
    que usted).
  · Otros están peor (y no se quejan).

Si tiene dudas, puede hablar con
su supervisor.
(Su supervisor no tiene autoridad
 para dar aumentos.)

Quedamos a disposición.

RRHH
`
    },
    {
        id: 'fl_105',
        name: 'mail_aumento_pedido.txt',
        size: 2.0,
        content:
`De: empleado@empresa.com
Para: rrhh@empresa.com
Asunto: Solicitud de aumento

Buenas tardes:

Escribo para solicitar un aumento
de sueldo.

Motivos:

  1. Hace 3 años que no recibo uno.
  2. La inflación del último año
     fue del 100%.
  3. Mi sueldo no se ajustó a la
     inflación.
  4. Estoy haciendo tareas de un
     puesto superior al mío.
  5. Ese puesto superior está vacante
     y no lo cubrieron.
  6. Cuando pregunté por el puesto,
     me dijeron "lo estamos viendo".
  7. Lo están viendo hace 8 meses.
  8. Creo que ya lo vieron.
  9. Creo que decidieron no cubrirlo.
  10. Creo que la decisión fue que
      yo haga ese trabajo sin
      cobrarlo.

Saludos.
Espero respuesta.
(No espero respuesta.)
(Estoy escribiendo esto como
 catarsis.)

[este mail tiene 47 respuestas
 sin leer en la bandeja de RRHH]
`
    },

    // ============================================================
    // FACTURAS / DOCUMENTOS LEGALES
    // ============================================================
    {
        id: 'fl_106',
        name: 'factura_absurda.txt',
        size: 1.8,
        content:
`FACTURA N° 0001-00048237

Cliente: [el mismo de siempre]
Fecha: [el mes pasado]

Detalle:

  1x Servicio básico ......... $1.000
  1x Servicio premium ........ $2.000
  1x Servicio premium (que
     no pediste) ............. $3.000
  1x Ajuste por inflación .... $500
  1x Ajuste por ajuste ....... $300
  1x Impuesto nacional ....... $400
  1x Impuesto provincial ..... $200
  1x Impuesto municipal ...... $150
  1x Impuesto a los impuestos  $100
  1x Cargo por pago ......... $80
  1x Cargo por no pago ...... $0
     (por ahora)
  1x Recargo por reclamo .... $500
     (solo si reclamás)
  1x Descuento ............... -$50
  1x Recargo del descuento .. $100

Subtotal: $8.280

IVA: $1.656

Total: $9.936

Nota: el precio es el del mes
pasado. Este mes es más.
`
    },
    {
        id: 'fl_107',
        name: 'contrato_alquiler.txt',
        size: 2.2,
        content:
`CONTRATO DE ALQUILER — Extracto

Entre el locador (dueño) y el locatario
(el que vive ahí), se acuerda:

Cláusula 1: El alquiler es mensual.
Cláusula 2: El alquiler aumenta cada
            3 meses.
Cláusula 3: Aumenta según un índice.
Cláusula 4: El índice lo elegimos nosotros.
Cláusula 5: Si no te gusta, no podés
            discutirlo.
Cláusula 6: Si discutís, aumentamos más.

Cláusula 7: El depósito es de 3 meses.
Cláusula 8: El depósito no se devuelve.
Cláusula 9: "Por gastos de limpieza".
Cláusula 10: Los gastos de limpieza
             son inventados.

Cláusula 11: No se admiten mascotas.
Cláusula 12: No se admiten visitas.
Cláusula 13: No se admiten ruidos.
Cláusula 14: No se admite nada.

Cláusula 15: El dueño puede entrar cuando
             quiera.
Cláusula 16: El dueño no avisa.
Cláusula 17: El dueño mira los muebles.
Cláusula 18: El dueño opina sobre todo.

Cláusula 19: Si el dueño vende, tenés
             30 días para irte.
Cláusula 20: Si te vas antes, pagás
             el resto del contrato.
Cláusula 21: Si te vas justo, pagás
             igual.

Firma: [ilegible]
Firma 2: [también ilegible]
`
    },
    {
        id: 'fl_108',
        name: 'testamento.txt',
        size: 2.1,
        content:
`TESTAMENTO

Yo, [nombre], en pleno uso de mis
facultades mentales (creo), dispongo:

1. Mi casa va a mi hijo mayor.
   (No tengo casa.)

2. Mi auto va a mi hija menor.
   (No tengo auto.)

3. Mis ahorros van a mi esposa.
   (No tengo ahorros.)

4. Mis deudas van a mi cuñado.
   (Esto sí es en serio.)

5. Mi gato va a quien lo quiera.
   (El gato ya eligió.)

6. Mi colección de tazas va al museo.
   (No existe el museo. Igual van ahí.)

7. Mis libros van a la biblioteca.
   (La biblioteca los va a rechazar.
    Los libros están subrayados.)

8. Mi bicicleta va a mi vecino.
   (El vecino me la robó hace 3 años.
    Es una forma de legalizarlo.)

9. Mi computadora va a quien
   encuentre este archivo.
   (Sí. Vos. Es tuya.)

10. El resto se reparte en partes
    iguales entre todos los que
    se portaron bien conmigo.
    (Nadie. Por eso no se reparte nada.)

Firma: [ilegible]
Fecha: [próximamente]
`
    },
    {
        id: 'fl_109',
        name: 'dnf_deuda.txt',
        size: 1.7,
        content:
`ESTADO DE DEUDA

Acreedor: [empresa de tarjeta]
Deudor: [usuario]

Concepto: consumo no reconocido.

Detalle:
  · Consumo 1 ............ $15.000
  · Consumo 2 ............ $20.000
  · Consumo 3 ............ $5.000
  · Intereses ............ $8.000
  · Intereses de los
    intereses ........... $3.000
  · Intereses de los
    intereses de los
    intereses ........... $1.500
  · Intereses de los
    intereses de los
    intereses de los
    intereses ........... $800
  · Intereses "varios" ... $12.000
  · Mantenimiento ........ $500
  · Seguro de vida ....... $300
    (que no pediste)

Total: $66.100

Nota del usuario: yo solo gasté
$40.000.

Nota de la empresa: el resto son
intereses.

Nota del usuario: por qué tanto?

Nota de la empresa: porque sí.

Nota del usuario: puedo pagar en
cuotas?

Nota de la empresa: sí, en 12 cuotas
de $7.500.

Nota del usuario: pero eso es más.

Nota de la empresa: sí.
`
    },
    {
        id: 'fl_110',
        name: 'multa_transito.txt',
        size: 1.8,
        content:
`ACTA DE INFRACCIÓN N° 0047-2026

Fecha: [ayer]
Lugar: [la esquina de siempre]
Hora: [no importa]

Conductor: [vos]
Vehículo: [el tuyo]

Motivo de la infracción:

  "Exceso de velocidad."

Velocidad máxima permitida: [no visible]
Velocidad detectada: [alta]
Velocidad de tu velocímetro: [baja]

Observaciones:
  La cámara estaba en un cartel
  cubierto por un árbol.

  El cartel de velocidad máxima
  estaba caído.

  La calle no tiene semáforo.

  El auto de al lado iba más rápido.
  Pero era un auto oficial.

  Vos ibas tranquilo.
  Pero te tocó a vos.

Monto de la multa: $47.000.

Descuento por pago voluntario: 20%.
Descuento por no discutir: 10%.
Recargo por discutir: 50%.
Recargo por discutir el recargo: 100%.

Plazo: 15 días.
(Los 15 días cuentan desde ayer.)
(Hoy ya es tarde.)
`
    },

    // ============================================================
    // TEXTOS VARIADOS FINALES
    // ============================================================
    {
        id: 'fl_111',
        name: 'notas_3am.txt',
        size: 1.6,
        content:
`Notas escritas a las 3 AM

- El universo es grande.
- Yo soy chico.
- Eso está bien.

- Mi jefe es un pelotudo.
- Eso también está bien.

- No sé qué estoy haciendo acá.
- Nadie sabe.

- Creo que debería dormir.
- Pero estoy escribiendo.

- Mañana me voy a arrepentir.
- Ya me estoy arrepintiendo.
- Igual escribo.

- Por qué leo esto a las 3 AM.
- Porque estoy despierto.

- Estoy despierto porque no puedo
  dormir.
- No puedo dormir porque pienso.
- Pienso porque hay cosas que
  pensar.

- Las cosas que pensar no se
  resuelven pensando.
- Se resuelven durmiendo.
- Pero no puedo dormir.

[Fin de las notas de las 3 AM.]
[Las voy a leer mañana y no voy
 a acordarme de nada.]
`
    },
    {
        id: 'fl_112',
        name: 'cartel_baño.txt',
        size: 1.5,
        content:
`Carteles en el baño de la oficina
(pegados uno arriba del otro)

[Cartel 1]
"POR FAVOR, CERRAR LA PUERTA."
— Administración

[Cartel 2]
"POR FAVOR, NO CERRAR LA PUERTA
 CON LLAVE, SE TRABAJA."
— Administración (después del
  incidente)

[Cartel 3]
"EL QUE SE LLEVÓ EL PAPEL HIGIÉNICO
 QUE LO DEVUELVA."
— Administración

[Cartel 4]
"NO HAY PAPEL HIGIÉNICO PORQUE ALGUIEN
 SE LO LLEVÓ."
— Administración (más enojada)

[Cartel 5]
"TRAIGAN PAPEL HIGIÉNICO DE SUS CASAS.
 GRACIAS."
— Administración

[Cartel 6]
"LA EMPRESA NO PROVEE PAPEL HIGIÉNICO
 DESDE HOY POR RAZONES DE PRESUPUESTO."
— Administración

[Cartel 7]
"EL PRESUPUESTO SE RECUPERÓ. VUELVE
 EL PAPEL HIGIÉNICO."
— Administración

[Cartel 8]
"ALGUIEN SE LLEVÓ EL PAPEL HIGIÉNICO
 OTRA VEZ."
— Administración

[Cartel 9]
"RENUNCIO."
— Administración
`
    },
    {
        id: 'fl_113',
        name: 'notas_veterinario.txt',
        size: 1.9,
        content:
`Notas de un veterinario

Hoy atendí a:

  1. Un perro que se llama "Perro".
     Su dueño dice que no se le ocurrió
     otro nombre.

  2. Un gato que se llama "Michifuz".
     El dueño jura que es "un nombre
     normal".

  3. Un perro que se llama "Beto".
     Beto tiene 14 años.
     Beto está bien.
     Beto es un buen perro.

  4. Una tortuga que se llama "Manuel".
     Manuel tiene 47 años.
     Manuel es más viejo que yo.
     Manuel va a vivir más que yo.

  5. Un hámster que se llama "Hámster".
     Ver Perro (arriba).

  6. Un loro que se llama "Loro".
     El loro repite groserías.
     El dueño dice que no las aprendió
     de él.
     El loro dice "mentira".
     El loro tiene razón.

Nota: me gusta este trabajo.
`
    },
    {
        id: 'fl_114',
        name: 'carta_futura.txt',
        size: 2.0,
        content:
`Carta a mi yo del futuro

Hola, yo del futuro.

Si estás leyendo esto, es porque:
  a) Encontraste este archivo.
  b) Te acordaste de que existía.
  c) Estás aburrido.
  d) Todas las anteriores.

Espero que estés bien.
Si no estás bien, espero que estés
mejor que cuando escribí esto.

Cosas que quiero recordar:
  · Hoy hace mucho calor.
  · Estoy escuchando música.
  · Me gusta esta canción.
  · Voy a olvidarla en 5 años.
  · Es una canción de la radio.
  · No sé quién la canta.
  · No importa.

Cosas que quiero preguntarte:
  · ¿Seguís trabajando ahí?
  · ¿Seguís con ella?
  · ¿Seguís con ellos?
  · ¿Aprendiste a cocinar?
  · ¿Fuiste a Japón?
  · ¿Leíste los libros que dijiste
    que ibas a leer?
  · ¿Fuiste al gimnasio?

Respuestas probables:
  · Sí (ojalá).
  · No (lo sabía).
  · Sí (mentira).
  · No (mentira).
  · No (lo sabía).
  · No (lo sabía).
  · No (siempre).

Bueno, yo del futuro.
Que te vaya bien.
Nos vemos en 5 años.

— Vos.
`
    },
    {
        id: 'fl_115',
        name: 'notas_filosoficas.txt',
        size: 1.9,
        content:
`Notas filosóficas tomadas al azar

  · Si un árbol cae en el bosque y nadie
    lo escucha, ¿hace ruido?
    Respuesta: sí. El árbol no necesita
    audiencia.

  · Si nadie ve mi trabajo, ¿existe?
    Respuesta: no. El trabajo necesita
    audiencia. Yo también.

  · Si soy feliz y nadie se entera,
    ¿soy feliz?
    Respuesta: sí.
    Pero no importa.

  · Si digo la verdad y nadie me cree,
    ¿dije la verdad?
    Respuesta: sí. Pero da igual.

  · Si miento y todos me creen, ¿mentí?
    Respuesta: sí. Y gané.

  · Si gano y no me siento bien,
    ¿gané?
    Respuesta: no. Perdí.
    Aprendí tarde.

  · Si pierdo y me siento bien,
    ¿perdí?
    Respuesta: no. Gané.
    Aprendí más tarde.

  · Si el universo no tiene sentido,
    ¿por qué me preocupo?
    Respuesta: porque el universo
    puede no tener sentido, pero
    yo sí.

  · ¿Y si nada tiene sentido?
    Respuesta: entonces nada importa.
    Y si nada importa, puedo hacer
    cualquier cosa.
    Incluso dormir.

  · Voy a dormir.
`
    },
    {
        id: 'fl_116',
        name: 'manual_supervivencia.txt',
        size: 2.1,
        content:
`MANUAL DE SUPERVIVENCIA EN LA OFICINA

1. Agua.
   La oficina tiene un dispenser.
   El dispenser se queda sin agua.
   Nadie cambia el bidón.
   Cambialo vos.
   Nadie te lo va a agradecer.
   Pero vas a tener agua.

2. Café.
   Hay una cafetera.
   La cafetera hace café malo.
   Hacelo igual.
   El café malo es mejor que
   no tener café.

3. Baño.
   Hay 2 baños por piso.
   El del piso 3 siempre está libre.
   El del piso 7 siempre está ocupado.
   Andá al del piso 3.
   Caminar hace bien.

4. Reuniones.
   Si te invitan, no vas.
   Si te preguntan por qué no fuiste,
   decís que no te llegó la invitación.
   Si te dicen que sí te llegó,
   decís que la perdiste.
   Si te dicen que te la reenvían,
   no la abras.
   Andá a la próxima.

5. Jefe.
   El jefe llega a las 10.
   Se va a las 4.
   A las 12 come.
   A las 12:30 duerme la siesta en
   su oficina.
   A la 1:30 se despierta.
   A la 2:00 toma café.
   A las 2:30 empieza a trabajar.
   A las 3:00 hace una reunión.
   A las 3:30 se va.
   Trabaja 1 hora por día.
   Cobra 10 veces más que vos.

6. Aumento.
   No lo pidas.
   Pedí que te cambien de sector.
   Es más fácil que te cambien de
   sector que darte un aumento.
   Vas a hacer lo mismo en otro
   lugar.
   Pero vas a cobrar más.

7. Renuncia.
   Guardala.
   No la tires.
   La vas a necesitar.
`
    },
    {
        id: 'fl_117',
        name: 'notas_curiosas.txt',
        size: 1.7,
        content:
`Datos curiosos que anoté al azar

  · Los flamencos son rosados porque
    comen camarones.
    Si los alimentás con otra cosa,
    se ponen blancos.
    Nadie sabe por qué eligieron
    ser rosados.

  · Los pulpos tienen 3 corazones.
    Uno para el cuerpo.
    Dos para las branquias.
    Ninguno para el amor.

  · Los caracoles pueden dormir hasta
    3 años.
    Yo también.

  · Las hormigas pueden levantar 50
    veces su peso.
    Yo no puedo levantar ni mi
    motivación.

  · Las abejas bailan para comunicarse.
    Yo también, pero me echan de
    las fiestas.

  · Los pingüinos se emparejan de por
    vida.
    Los pingüinos son mejores que
    muchos humanos.

  · Las ballenas cantan.
    No se sabe para quién.
    Probablemente para otras ballenas.
    Probablemente para sí mismas.

  · Los humanos también cantamos.
    No se sabe para quién.
    Pero probablemente no para
    nosotros mismos.

  · Los gatos ronronean cuando están
    contentos.
    También cuando están estresados.
    Como yo.

  · Los tiburones son más viejos que
    los árboles.
    Piensen eso un rato.
    Los tiburones son más viejos
    que los árboles.
`
    },
    {
        id: 'fl_118',
        name: 'notas_practicas.txt',
        size: 1.9,
        content:
`Consejos prácticos que aprendí a la fuerza

  · Siempre llevá una lapicera.
    No la vas a usar.
    Alguien te la va a pedir.
    No te la va a devolver.
    Llevá dos.

  · Siempre llevá un cargador.
    No lo vas a usar.
    Alguien te lo va a pedir.
    No te lo va a devolver.
    Llevá dos.

  · Siempre llevá paraguas.
    No va a llover.
    Alguien te lo va a pedir.
    No te lo va a devolver.
    Llevá dos.

  · Siempre llevá plata.
    No la vas a gastar.
    Alguien te la va a pedir.
    No te la va a devolver.
    Llevá dos.

  · Siempre llevá paciencia.
    La vas a usar.
    Mucho.
    No alcanza nunca.

  · Siempre llevá ganas.
    Las vas a usar.
    Se van a gastar.
    En algún momento.

  · Siempre llevá humor.
    Es lo último que se pierde.
    Y también se pierde.

  · Siempre llevá todo de vuelta
    a tu casa.
    Si no, no va a volver.
`
    },
    {
        id: 'fl_119',
        name: 'notas_perro.txt',
        size: 1.6,
        content:
`Notas sobre mi perro (que no es mi perro)

Mi perro se llama Beto.
Beto no es mi perro.
Beto es el perro del vecino.
El vecino dejó de venir.
Beto se quedó.

Beto hace cosas:

  · Beto duerme en mi cama.
  · Beto come de mi plato.
  · Beto ladra a los autos.
  · Beto ladra a las motos.
  · Beto ladra a las hojas.
  · Beto ladra al viento.
  · Beto ladra al vecino nuevo.
  · Beto ladra al aire.

Beto es un perro.
Beto es buen perro.
Beto es mi perro ahora.

El vecino volvió.
Le dije que Beto es mi perro.
El vecino dijo "está bien".
El vecino se fue de nuevo.
Beto se quedó.

Beto es Beto.
Yo soy yo.
Los dos estamos bien.
`
    },
    {
        id: 'fl_120',
        name: 'notas_planta.txt',
        size: 1.5,
        content:
`Notas sobre mi planta

Compré una planta.

Día 1: La puse en la ventana.
Día 2: La regué.
Día 3: La regué.
Día 4: La regué.
Día 5: La regué.
Día 6: La regué.
Día 7: La regué.
Día 8: La regué (con más agua).
Día 9: La regué (con más agua).
Día 10: La planta se ahogó.

La planta murió.

Compré otra planta.

Día 1: La puse en la ventana.
Día 2: NO la regué.
Día 3: NO la regué.
Día 4: NO la regué.
Día 5: NO la regué.
Día 6: NO la regué.
Día 7: La planta se secó.
Día 8: La planta murió.

Compré una tercera planta.

Día 1: La puse en la ventana.
Día 2: La regué poco.
Día 3: La regué poco.
Día 4: La regué poco.
Día 5: La regué poco.
Día 6: La planta se veía bien.
Día 7: La planta se veía mejor.
Día 8: La planta se veía mejor.
Día 9: Me fui de viaje.
Día 20: Volví. La planta estaba muerta.
Día 21: Compré otra planta.

Voy a hacer este experimento hasta
que una sobreviva.

(Este archivo tiene 47 actualizaciones
 más. Todas terminan igual.)

Nota final: no sé por qué sigo comprando
plantas.
Nota 2: sí sé.
Nota 3: porque está bueno cuidar algo.
Nota 4: aunque se muera.
Nota 5: especialmente si se muere.
`
    },

    // ============================================================
    // ÚLTIMOS TEXTOS — COSAS RARAS
    // ============================================================
    {
        id: 'fl_121',
        name: 'lista_pendientes_2024.txt',
        size: 1.8,
        content:
`Lista de pendientes — 2024

Enero:
  [x] Comprar cuaderno nuevo
  [ ] Usar el cuaderno nuevo

Febrero:
  [x] Anotar propósitos
  [ ] Cumplir propósitos

Marzo:
  [x] Ir al gimnasio (1 día)
  [ ] Ir al gimnasio (más días)

Abril:
  [x] Comprar verduras
  [ ] Comer verduras

Mayo:
  [x] Bajar la app de idiomas
  [ ] Usar la app de idiomas

Junio:
  [x] Anotar la idea del proyecto
  [ ] Hacer el proyecto

Julio:
  [x] Ver el tutorial
  [ ] Hacer el curso

Agosto:
  [x] Reservar el turno médico
  [ ] Ir al médico

Septiembre:
  [x] Comprar los libros
  [ ] Leer los libros

Octubre:
  [x] Escribir la lista de
      pendientes 2025
  [ ] Cumplir la lista de
      pendientes 2025

Noviembre:
  [x] Darme cuenta de que no
      cumplí nada
  [ ] Hacer algo al respecto

Diciembre:
  [x] Renovar la lista para 2025
  [ ] Ilusionarme de nuevo
`
    },
    {
        id: 'fl_122',
        name: 'lista_pendientes_2025.txt',
        size: 1.8,
        content:
`Lista de pendientes — 2025

Enero:
  [x] Comprar cuaderno nuevo
  [ ] Usar el cuaderno nuevo

Febrero:
  [x] Anotar propósitos
  [ ] Cumplir propósitos

Marzo:
  [x] Ir al gimnasio (0 días)
  [ ] Ir al gimnasio (1 día)

Abril:
  [x] Ver videos sobre gimnasio
  [ ] Ir al gimnasio

Mayo:
  [x] Comprar proteína
  [ ] Usar la proteína

Junio:
  [x] Renovar la suscripción
      al gimnasio
  [ ] Ir al gimnasio

Julio:
  [x] Cancelar la suscripción
  [ ] Ir al gimnasio de todas formas

Agosto:
  [x] Buscar "cómo motivarse"
  [ ] Motivarse

Septiembre:
  [x] Leer la lista
  [ ] Hacer algo de la lista

Octubre:
  [x] Anotar en la lista de 2026
  [ ] Olvidarse de la lista
      de 2025

Noviembre:
  [x] Olvidarse de la lista
      de 2025
  [ ] Recordarla en 2026

Diciembre:
  [x] Renovar la lista para 2026
  [ ] Ilusionarse otra vez
`
    },
    {
        id: 'fl_123',
        name: 'notas_mudanza.txt',
        size: 1.9,
        content:
`Notas para la mudanza

Cosas que tengo que empacar:

  · Ropa (mucha).
  · Zapatillas (3 pares, uso 1).
  · Libros (muchos, leí 4).
  · Cables (no sé para qué).
  · Cargadores (de cosas que
    ya tiré).
  · Tazas (no sé por qué tengo 12).
  · Cubiertos (para 12, vivo solo).
  · Platos (para 12, vivo solo).
  · Vasos (para 12, vivo solo).
  · Documentos (todos en una caja
    que no abrí en 5 años).
  · Fotos (en papel, de gente
    que no veo).
  · Notas (que no voy a leer).
  · Cartas (que no voy a leer).
  · Juguetes viejos (no sé por qué).
  · Un teclado que no funciona.
  · Un mouse que no funciona.
  · Un monitor que no funciona.
  · Una PC que no funciona.
  · Un router que no funciona.
  · Un cargador de celular que
    no funciona.
  · Un celular que no funciona.

Nota: no tengo casi nada.
Nota 2: sí tengo.
Nota 3: la mayoría no sirve.
Nota 4: pero pesa.
Nota 5: y no lo tiro.
Nota 6: nunca lo tiro.
`
    },
    {
        id: 'fl_124',
        name: 'notas_dieta.txt',
        size: 1.7,
        content:
`Notas de una dieta

Lunes:
  Desayuno: café.
  Almuerzo: ensalada.
  Merienda: fruta.
  Cena: sopa.
  Extras: 3 alfajores, 2 galletitas,
          1 helado, 1 alfajor más.

Martes:
  Desayuno: café.
  Almuerzo: ensalada.
  Merienda: fruta.
  Cena: sopa.
  Extras: empanadas, pizza, cerveza.

Miércoles:
  Desayuno: café.
  Almuerzo: milanesa con papas fritas.
  Merienda: pizza fría.
  Cena: hamburguesa.
  Extras: "es un día especial".

Jueves:
  Desayuno: café.
  Almuerzo: ensalada.
  Merienda: fruta.
  Cena: sopa.
  Extras: "arranco el lunes".

Viernes:
  Desayuno: café.
  Almuerzo: ensalada.
  Merienda: fruta.
  Cena: sopa.
  Extras: "es viernes, me merezco".

Sábado:
  Desayuno: nada.
  Almuerzo: asado.
  Merienda: asado (continuación).
  Cena: asado (restos).
  Extras: "el domingo arranco".

Domingo:
  Desayuno: café.
  Almuerzo: "el último asado".
  Merienda: "postre, para cerrar".
  Cena: "ya está, arranco mañana".

Lunes:
  Desayuno: café.
  (Y empieza de nuevo.)

Conclusión: no bajé un gramo.
`
    },
    {
        id: 'fl_125',
        name: 'notas_estudio.txt',
        size: 1.8,
        content:
`Plan de estudio

Lunes:
  Estudiar matemática.
  (No estudié.)

Martes:
  Estudiar matemática (de nuevo).
  (No estudié.)

Miércoles:
  Estudiar matemática (de nuevo).
  (Miré videos de gatos.)

Jueves:
  Estudiar matemática (de nuevo).
  (Miré videos de gatos y también
   de perros.)

Viernes:
  Estudiar matemática (de nuevo).
  (Miré videos de gatos, perros
   y un hámster.)

Sábado:
  Estudiar matemática (de nuevo).
  (Miré videos de gatos, perros,
   hámster y una nutria.)

Domingo:
  Estudiar matemática (de nuevo).
  (Miré videos de gatos, perros,
   hámster, nutria y un tejón.)

Lunes:
  Estudiar matemática (de nuevo).
  (Miré videos de gatos, perros,
   hámster, nutria, tejón, un
   ciervo y un pingüino.)

...

[Así por 4 meses]

...

Finalmente me puse a estudiar.
Aprendí.

Aprendí más sobre animales que
sobre matemática.

Pero aprobé.

Nota: no sé cómo aprobé.
`
    },
    {
        id: 'fl_126',
        name: 'notas_cumple.txt',
        size: 1.7,
        content:
`Notas sobre cumpleaños olvidados

Enero: cumpleaños de alguien.
       No me acuerdo de quién.
       No le escribí.
       No importa.

Febrero: cumpleaños de mi tía.
         Le escribí.
         Le mandé sticker.
         Me contestó con sticker.
         Eso es una conversación
         completa.

Marzo: cumpleaños de mi amigo.
       Le escribí.
       Le mandé audio.
       Me contestó con audio.
       Eso es un nivel más alto
       de amistad.

Abril: nadie cumple años.

Mayo: cumpleaños de mi ex.
      Le escribí.
      No me contestó.
      Mejor.

Junio: cumpleaños de mi mamá.
       Le escribí.
       Le mandé mensaje largo.
       Le mandé video.
       Le mandé audio.
       Me contestó con 3 stickers.
       Y un emoji de corazón.
       Y "te quiero".
       Perfecto.

Julio: me olvidé de un cumpleaños.
       No sé de quién.
       Me enteré después.
       Es tarde.
       Ahora no le puedo escribir
       sin que quede mal.
       No le escribo.

Agosto: me olvidé de otro.
        No sé de quién.

Septiembre: me olvidé de otro.

Octubre: me olvidé de otro.

Noviembre: mi propio cumpleaños.
           Me saludé solo.
           Me mandé un sticker.
           Me contesté con un sticker.

Diciembre: nadie cumple años.

Nota: debería anotar los cumpleaños.
Nota 2: ya lo intenté.
Nota 3: me olvidé de la lista.
`
    },
    {
        id: 'fl_127',
        name: 'notas_mentiras.txt',
        size: 1.6,
        content:
`Mentiras que dije esta semana

Lunes: "ya salgo" (salí 40 min después).
Martes: "estoy llegando" (no había
        salido).
Miércoles: "no vi el mensaje"
           (lo vi).
Jueves: "te iba a escribir"
        (no te iba a escribir).
Viernes: "estoy bien" (no estaba
         bien).
Sábado: "no estoy enojado"
        (estaba enojado).
Domingo: "no me acuerdo"
         (me acordaba).

Mentiras de la semana pasada:

  · "no tengo hambre" (tenía hambre).
  · "es la última" (no era la última).
  · "no le digas a nadie" (le dije
    a alguien).
  · "te lo juro" (no lo juraba).
  · "me olvidé" (no me olvidé).
  · "después te cuento" (no te iba
    a contar).
  · "está bueno" (estaba feo).

Mentiras que me dijeron:

  · "en 5 minutos te confirmo"
    (no confirmaron).
  · "es la última vez" (no era).
  · "estoy a 10 minutos"
    (estaban a 30).
  · "ya te mando" (no mandaron).
  · "no es nada personal" (era
    personal).
  · "te aviso" (no avisaron).

Nota: todos mentimos.
Nota 2: está bien.
Nota 3: no está bien.
Nota 4: pero está.
`
    },
    {
        id: 'fl_128',
        name: 'notas_miedo.txt',
        size: 1.7,
        content:
`Miedos que anoté en una noche
de insomnio

  · Miedo a la oscuridad.
    (Tengo 30 años.)
    (No importa.)

  · Miedo a las arañas.
    (Razonable.)

  · Miedo a los payasos.
    (Menos razonable.)

  · Miedo a las alturas.
    (Razonable.)

  · Miedo a hablar en público.
    (Razonable.)

  · Miedo a que me miren.
    (Menos razonable.)

  · Miedo a que no me miren.
    (Todavía menos razonable.)

  · Miedo a fallar.
    (Razonable.)

  · Miedo a ganar.
    (Raro.)

  · Miedo a querer.
    (Peor.)

  · Miedo a que me quieran.
    (Peor todavía.)

  · Miedo a estar solo.
    (Clásico.)

  · Miedo a no estar solo.
    (También clásico.)

  · Miedo a la muerte.
    (Normal.)

  · Miedo a la vida.
    (Raro.)

  · Miedo a dormir.
    (Porque no puedo dormir.)
    (Y si no puedo dormir, me
     da miedo no poder dormir.)
    (Y si tengo miedo, no duermo.)
    (Es un círculo.)

  · Miedo al círculo.
    (Meta.)

Nota: escribí todo esto a las 4 AM.
Nota 2: ahora tengo sueño.
Nota 3: pero me da miedo dormir.
`
    },
    {
        id: 'fl_129',
        name: 'notas_verguenza.txt',
        size: 1.6,
        content:
`Cosas vergonzosas que hice

  1. Le dije "igualmente" al de la
     verdulería.
  2. Le dije "buen provecho" a
     alguien que no estaba comiendo.
  3. Le dije "hasta luego" a alguien
     que no conocía y que no iba a
     ver nunca más.
  4. Le dije "gracias" al cajero
     automático.
  5. Le dije "chau" a mi mamá por
     teléfono y esperé su respuesta
     como si fuera una conversación
     presencial.
  6. Le dije "dale, dale" 6 veces
     al teléfono sin que nadie
     dijera nada.
  7. Le dije "sí" a algo que no
     entendí.
  8. Le dije "no" a algo que sí
     entendí pero que no quería
     hacer.
  9. Le dije "lo hago yo" y después
     no lo hice.
 10. Le dije "está hecho" y no
     estaba hecho.
 11. Le dije "todo bien" y no
     estaba todo bien.
 12. Le dije "ya voy" y no fui.

Nota: nadie se acuerda de nada
de esto excepto yo.
Nota 2: yo tampoco me acuerdo
bien.
Nota 3: pero me acuerdo de la
sensación.
`
    },
    {
        id: 'fl_130',
        name: 'notas_suerte.txt',
        size: 1.7,
        content:
`Cosas de suerte que me pasaron

  1. Encontré $500 en un pantalón
     viejo.
  2. Encontré $200 en otro pantalón
     viejo.
  3. Encontré $50 en un tercer
     pantalón viejo.
  4. Conclusión: debería revisar
     más seguido los pantalones
     viejos.
  5. Pero cuando los reviso, no hay
     nada.
  6. Solo aparecen cuando no busco.
  7. Como casi todo en la vida.
  8. Como el amor.
  9. Como el trabajo.
 10. Como las llaves.
 11. Como las medias.
 12. Como el sentido de la vida.
 13. Como este archivo, que apareció
     cuando no lo buscaba.
 14. Y ahora que lo encontré, ya no
     sé qué hacer con él.

Nota: no hay conclusión.
Nota 2: la vida no tiene conclusión.
Nota 3: pero tiene pantalones viejos.
`
    },
    {
        id: 'fl_131',
        name: 'notas_cansancio.txt',
        size: 1.7,
        content:
`Cosas que me cansan

  · Levantarme.
  · Acostarme.
  · El proceso intermedio.
  · Bañarme.
  · Vestirme.
  · Elegir qué ponerme.
  · Desayunar.
  · Elegir qué desayunar.
  · Lavar el plato del desayuno.
  · Esperar el colectivo.
  · Subir al colectivo.
  · Bajarme del colectivo.
  · Llegar al trabajo.
  · Trabajar.
  · Fingir que trabajo.
  · Fingir que me importa.
  · Fingir que estoy bien.
  · Fingir en general.
  · No fingir.
  · Volver del trabajo.
  · Elegir qué cenar.
  · Cocinar.
  · Lavar los platos.
  · Ducharme.
  · Elegir qué ponerme para dormir.
  · Acostarme.
  · Dormir.
  · Repetir.

Nota: no me cansa todo.
Nota 2: me cansa casi todo.
Nota 3: menos algunas cosas.
Nota 4: las cosas que no me cansan
         son las que hago cuando
         nadie mira.
Nota 5: por eso no las hago
         seguido.
`
    },
    {
        id: 'fl_132',
        name: 'notas_alegria.txt',
        size: 1.7,
        content:
`Cosas que me alegran

  · El café de la mañana.
  · El primer sorbo del café.
  · El segundo sorbo.
  · El tercero.
  · Cuando el café está bien
    caliente.
  · Cuando el café está tibio pero
    igual rico.
  · Cuando el café está frío pero
    lo tomo igual.

  · El primer mensaje del día.
  · El segundo mensaje.
  · El que dice "buen día".
  · El que dice "cómo estás".
  · El que no dice nada pero
    contesta.

  · El sol después de la lluvia.
  · La lluvia después del sol.
  · La lluvia en general.
  · El olor a lluvia.
  · El ruido de la lluvia.
  · Mojarse con la lluvia.

  · El perro del vecino.
  · El gato del otro vecino.
  · El pájaro que canta temprano.

  · Escribir esto.
  · Que alguien lo lea.
  · Que alguien sonría.
  · Que alguien entienda.

Nota: hay más cosas de las que
pensaba.
`
    },
    {
        id: 'fl_133',
        name: 'notas_futuro.txt',
        size: 1.8,
        content:
`Notas sobre el futuro

  · ¿Habrá futuro?
    Sí.
    Todavía no.

  · ¿Qué voy a hacer?
    No sé.
    Y está bien.

  · ¿Dónde voy a estar?
    No sé.
    Y está bien.

  · ¿Con quién?
    No sé.
    Y está bien.

  · ¿Voy a estar bien?
    No sé.
    Y está bien.

  · ¿Va a valer la pena?
    No sé.
    Y está bien.

  · ¿Y si me equivoco?
    Te vas a equivocar.

  · ¿Y si elijo mal?
    Vas a elegir mal.

  · ¿Y si no elijo?
    No elegir también es elegir.

  · ¿Y si todo sale mal?
    Puede salir mal.

  · ¿Y si todo sale bien?
    Puede salir bien.

  · ¿Y si no sé qué quiero?
    Nadie sabe.

  · ¿Y si sé qué quiero?
    Tampoco pasa nada.

  · ¿Y si no me atrevo?
    No pasa nada.
    Pero después te vas a acordar.

  · ¿Y si me atrevo?
    Puede salir mal.
    Puede salir bien.
    Pasa algo.

  · ¿Y si elijo la opción que me
    da menos miedo?
    ¿Cuál de todas da menos miedo?

  · ¿Y si no hay ninguna sin miedo?
    Entonces elegí la que más ganas
    te dé.
    Aunque dé miedo.

  · ¿Y si igual sale mal?
    Igual lo hiciste.

  · ¿Y si sale bien?
    Igual lo hiciste.

Nota: escribí esto a las 2 AM.
Nota 2: probablemente no lo siga.
Nota 3: pero me sirvió escribirlo.
`
    },
    {
        id: 'fl_134',
        name: 'notas_perdon.txt',
        size: 1.7,
        content:
`Cosas que tengo que perdonar

  · A mi papá, por no estar cuando
    lo necesitaba.
  · A mi mamá, por estar demasiado.
  · A mi hermano, por irse.
  · A mi ex, por mentirme.
  · A mi ex, por decirme la verdad.
  · A mi ex, por existir.
  · A mi amigo, por olvidarse de
    mi cumpleaños.
  · A mi amigo, por olvidarse de
    mi cumpleaños (otra vez).
  · A mi jefe, por ser jefe.
  · A mi compañero, por hablar
    mal de mí.
  · A mi compañero, por no hablar
    bien de mí.
  · A mí mismo, por no intentarlo.
  · A mí mismo, por intentarlo mal.
  · A mí mismo, por no perdonar.

Nota: la lista sigue.

Nota 2: la lista no termina nunca.

Nota 3: creo que eso es el punto.

Nota 4: creo que el perdón no es
        un momento, es un proceso.

Nota 5: creo que estoy empezando.

Nota 6: creo que está bien empezar
        tarde.

Nota 7: creo que está bien empezar
        por uno mismo.

Nota 8: creo que voy a empezar por
        ahí.

Nota 9: pero no hoy.

Nota 10: mañana.
`
    },
    {
        id: 'fl_135',
        name: 'notas_gratitud.txt',
        size: 1.6,
        content:
`Cosas por las que estoy agradecido

  · Por el café de esta mañana.
  · Por el mensaje de mi mamá.
  · Por el sol de la tarde.
  · Por el sonido del perro del
    vecino.
  · Por el silencio de la noche.
  · Por el aire fresco de la mañana.
  · Por el calor de la frazada.
  · Por el sabor de la comida.
  · Por el olor del pan tostado.
  · Por el ruido de la lluvia.
  · Por el silbido del viento.
  · Por el color del cielo al
    atardecer.
  · Por el frío de la heladera.
  · Por el calor del horno.
  · Por el ruido de la pava.
  · Por el ruido de los cubiertos.
  · Por el sonido del microondas.
  · Por el sonido del ascensor.
  · Por el sonido de la llave en
    la puerta.
  · Por el sonido de los pasos.
  · Por el silencio de los pasos.

Nota: todo esto me va a faltar
      algún día.
Nota 2: por eso lo escribo ahora.
Nota 3: para acordarme.
Nota 4: para acordarme de que
        todo esto existe.
Nota 5: para acordarme de que
        todo esto está.
Nota 6: para acordarme.
`
    },
    {
        id: 'fl_136',
        name: 'notas_soledad.txt',
        size: 1.8,
        content:
`Notas sobre la soledad

  · No estoy solo.
    Tengo un gato.
    El gato no me quiere.
    El gato me tolera.
    Es algo.

  · No estoy solo.
    Tengo amigos.
    Los amigos no me escriben.
    Pero están.
    Están en algún lado.

  · No estoy solo.
    Tengo familia.
    La familia me pregunta.
    Preguntan cómo estoy.
    Digo "bien".
    Es mentira.
    Pero está bien.

  · No estoy solo.
    Tengo trabajo.
    En el trabajo hay gente.
    La gente no me habla.
    Pero están.
    En algún lado.

  · No estoy solo.
    Tengo un celular.
    El celular no suena.
    Pero está.
    Puede sonar.
    En algún momento.

  · No estoy solo.
    Estoy conmigo.
    Y yo me tengo.
    Y yo me hablo.
    Y yo me escucho.
    Y yo me respondo.

  · No estoy solo.
    Y sin embargo.

  · A veces.

  · Me siento solo.

  · Y está bien.

  · También estar solo está bien.

Nota: escribí esto para mí.
Nota 2: no sé si lo voy a leer
        de nuevo.
Nota 3: pero está acá.
`
    },
    {
        id: 'fl_137',
        name: 'notas_sobre_escribir.txt',
        size: 1.9,
        content:
`Notas sobre escribir

  · Escribir es poner algo afuera.
  · Afuera de la cabeza.
  · Adentro de un archivo.
  · En algún lado.
  · En algún server.
  · En algún país.
  · En algún disco.
  · Que alguien va a leer.
  · O no.
  · Probablemente no.
  · Probablemente nunca.
  · Pero escribo.
  · Porque escribir ordena.
  · Ordena las ideas.
  · Ordena las emociones.
  · Ordena el caos.
  · No del todo.
  · Pero un poco.
  · Y con un poco alcanza.
  · A veces.
  · No siempre.
  · Pero a veces.

  · Escribo para mí.
  · Escribo para alguien.
  · Escribo para nadie.
  · Escribo para que quede.
  · Escribo para olvidar.
  · Escribo para acordarme.
  · Escribo porque no puedo
    no escribir.
  · Escribo porque sí.
  · Escribo por escribir.
  · Y está bien.
  · Y está bien.
  · Y está bien.

Nota: bueno.
Nota 2: ya está.
Nota 3: chau.
`
    },
    {
        id: 'fl_138',
        name: 'notas_por_que.txt',
        size: 1.7,
        content:
`Preguntas sin respuesta

  · ¿Por qué el café de oficina sabe
    mal?
  · ¿Por qué el WiFi funciona mejor
    cuando no lo necesitás?
  · ¿Por qué el ascensor se rompe
    los lunes?
  · ¿Por qué el jefe llega tarde y
    se va temprano?
  · ¿Por qué el sueldo no alcanza
    nunca?
  · ¿Por qué las vacaciones se van
    rápido?
  · ¿Por qué los lunes duran tanto?
  · ¿Por qué los domingos se sienten
    como sábados tristes?
  · ¿Por qué los lunes se sienten
    como domingos?
  · ¿Por qué el tiempo pasa distinto
    cuando estás aburrido?
  · ¿Por qué el tiempo pasa rápido
    cuando estás bien?
  · ¿Por qué el tiempo no existe
    cuando dormís?
  · ¿Por qué soñamos?
  · ¿Por qué olvidamos los sueños?
  · ¿Por qué recordamos cosas
    aleatorias?
  · ¿Por qué no recordamos cosas
    importantes?
  · ¿Por qué hay cosas importantes?
  · ¿Por qué hay cosas no importantes?
  · ¿Por qué clasificamos?
  · ¿Por qué escribo esto?

  · No hay respuestas.

  · Y está bien.

  · O no.
`
    },
    {
        id: 'fl_139',
        name: 'notas_sobre_nada.txt',
        size: 1.6,
        content:
`Notas sobre nada

Estoy sentado.
No hay nada que hacer.
Estoy aburrido.
Escribo.

Estoy parado.
No hay nada que ver.
Estoy mirando.
Escribo.

Estoy caminando.
No hay nada que decir.
Estoy pensando.
Escribo.

Estoy comiendo.
No hay nada que probar.
Estoy masticando.
Escribo.

Estoy durmiendo.
No hay nada que soñar.
Estoy durmiendo.
(No escribo.)

Estoy despertando.
No hay nada que recordar.
Estoy despertando.
Escribo.

Estoy viviendo.
No hay nada especial.
Estoy viviendo.
Escribo.

Estoy escribiendo.
No hay nada que decir.
Escribo igual.

Fin.
`
    },
    {
        id: 'fl_140',
        name: 'notas_sobre_todo.txt',
        size: 1.7,
        content:
`Notas sobre todo

  · La vida es esto.
  · La vida es lo otro.
  · La vida es ambas cosas.
  · La vida es ninguna.

  · El amor es esto.
  · El amor es lo otro.
  · El amor es más que esto.
  · El amor es menos que lo otro.

  · El trabajo es esto.
  · El trabajo es lo otro.
  · El trabajo no es nada.
  · El trabajo no es todo.

  · El dinero es esto.
  · El dinero es lo otro.
  · El dinero no es nada.
  · El dinero no es todo.

  · La familia es esto.
  · La familia es lo otro.
  · La familia no es nada.
  · La familia no es todo.

  · Los amigos son esto.
  · Los amigos son lo otro.
  · Los amigos no son nada.
  · Los amigos no son todo.

  · Yo soy esto.
  · Yo soy lo otro.
  · Yo no soy nada.
  · Yo no soy todo.

  · Y sin embargo.
  · Y sin embargo.
  · Y sin embargo.

Nota: creo que ya es tarde.
Nota 2: voy a dormir.
Nota 3: mañana sigo.
`
    },
    {
        id: 'fl_141',
        name: 'notas_3am_2.txt',
        size: 1.7,
        content:
`3 AM otra vez

No puedo dormir.

No es insomnio.
Es costumbre.

Me acostumbré a no dormir.
Me acostumbré a estar despierto
cuando no hay nadie.
Cuando no hay ruido.
Cuando no hay mensajes.
Cuando no hay urgencias.
Cuando no hay nada.

Solo yo.
Y la pantalla.
Y el teclado.
Y la cabeza dando vueltas.

Pienso en el pasado.
Pienso en el futuro.
Pienso en el presente.
Pienso en por qué pienso.

Debería dormir.
Pero no duermo.
Debería apagar la luz.
Pero no la apago.
Debería cerrar los ojos.
Pero no los cierro.

Escribo esto.
Para qué.
No sé.

Pero lo escribo.
Y mañana lo voy a leer.
Y voy a pensar: "qué idiota".
Y lo voy a borrar.
O no.

Probablemente no.

Probablemente lo deje.
En algún archivo.
En algún server.

Como un pedazo de mí.
Que quedó ahí.
Esperando.

No sé a quién.
No sé para qué.

Pero ahí está.

Y eso me consuela.

Un poco.

Lo suficiente.

Para dormir.

Chau.
`
    },
    {
        id: 'fl_142',
        name: 'notas_sobre_la_muerte.txt',
        size: 1.9,
        content:
`Notas sobre la muerte

  · No le tengo miedo a la muerte.
    Le tengo miedo a morir.

  · No le tengo miedo a morir.
    Le tengo miedo a no haber
    vivido.

  · No le tengo miedo a no haber
    vivido.
    Le tengo miedo a no estar
    viviendo ahora.

  · No le tengo miedo a no estar
    viviendo ahora.
    Le tengo miedo a no saber
    cómo vivir.

  · No le tengo miedo a no saber
    cómo vivir.
    Le tengo miedo a saberlo
    y no hacerlo.

  · No le tengo miedo a saberlo
    y no hacerlo.
    Le tengo miedo a hacerlo
    y que salga mal.

  · No le tengo miedo a hacerlo
    y que salga mal.
    Le tengo miedo a hacerlo
    y que salga bien.

  · No le tengo miedo a hacerlo
    y que salga bien.
    Le tengo miedo a hacerlo
    y no sentir nada.

  · No le tengo miedo a hacerlo
    y no sentir nada.
    Le tengo miedo a sentir todo.

  · Le tengo miedo a sentir todo.

  · Le tengo miedo a sentir todo.

  · Y por eso no siento.
  · Y por eso no hago.
  · Y por eso no vivo.

  · Y por eso le tengo miedo
    a la muerte.
  · Porque todavía no viví.

Nota: mañana arranco.
Nota 2: en serio.
Nota 3: esta vez sí.
`
    },
    {
        id: 'fl_143',
        name: 'notas_sobre_vivir.txt',
        size: 1.8,
        content:
`Notas sobre vivir

Vivir es esto:

  · Tomar café por la mañana.
  · Quejarse del trabajo.
  · Mandarle un mensaje a alguien
    que querés.
  · Recibir un mensaje.
  · No recibir un mensaje.
  · Esperar un mensaje.
  · Dejar de esperar.
  · Que llegue el mensaje.
  · Que no llegue.
  · Reírte de algo que no tiene
    gracia.
  · Llorar por algo que sí tiene
    gracia.
  · Comer.
  · Dormir.
  · No dormir.
  · Despertar.
  · No querer despertar.
  · Despertar igual.
  · Mirar por la ventana.
  · Ver el sol.
  · Ver la lluvia.
  · Ver nada.
  · Ver todo.
  · Ver lo que hay.
  · Ver lo que no hay.
  · Escribir.
  · Leer.
  · Escuchar.
  · Hablar.
  · Callar.
  · Callar más.
  · Estar en silencio.
  · Estar en ruido.
  · Estar.
  · Estar.

Nota: vivir es estar.
Nota 2: nada más.
Nota 3: nada menos.

Y a veces alcanza.

Y a veces no.

Pero está.

Y eso es vivir.
`
    },
    {
        id: 'fl_144',
        name: 'notas_sobre_tiempo.txt',
        size: 1.7,
        content:
`Notas sobre el tiempo

  · El tiempo no existe.
    Existe el movimiento.
    El tiempo es una medida
    del movimiento.
    Pero el movimiento sí existe.
    Entonces el tiempo también.

  · El tiempo es relativo.
    Cuando estás bien, vuela.
    Cuando estás mal, se arrastra.
    Cuando estás en el trabajo,
    se traba.
    Cuando estás de vacaciones,
    se escapa.

  · El tiempo no se recupera.
    Lo que perdiste, perdido está.
    Lo que ganaste, ganado está.
    Lo que estás viviendo, está
    pasando ahora.
    Ahora.
    Ahora.
    Ahora.

  · El tiempo no espera.
    Pero también: el tiempo no
    corre.
    Los que corremos somos
    nosotros.
    Y el tiempo nos mira.

  · El tiempo no se detiene.
    Pero a veces se siente
    detenido.
    Cuando estás esperando algo.
    Cuando estás esperando a
    alguien.
    Cuando estás esperando.

  · El tiempo es una ilusión.
    Pero la ilusión es real.
    Porque la vivimos.

  · El tiempo se acaba.
    Eso es lo importante.
    El tiempo se acaba.
    Y por eso vale.

  · Y por eso hay que vivirlo.

  · Ahora.

  · Mientras se pueda.
`
    },
    {
        id: 'fl_145',
        name: 'notas_finales.txt',
        size: 1.6,
        content:
`Notas finales

Voy a cerrar este archivo.

No sé por qué empecé.
No sé por qué sigo.
No sé por qué voy a terminar.

Pero voy a terminar.
Porque todo termina.
Porque todo se acaba.
Porque todo tiene un final.
Incluso esto.

Un final que va a llegar.
Un final que ya está llegando.
Un final que ya llegó.
Ahora.

Un final que no es un final.
Porque siempre hay otro archivo.
Otro texto.
Otra nota.
Otro 3 AM.

Siempre hay otro.

Y siempre va a haber.

Y mientras haya, hay.

Y eso es suficiente.

Chau.

Gracias por leer.

(No sé si me leíste.)
(No sé si me vas a leer.)
(No sé si vas a existir.)
(Pero gracias igual.)

— El que escribió esto
`
    },
    {
        id: 'fl_146',
        name: 'cuaderno_viejo.txt',
        size: 1.9,
        content:
`[Fragmentos de un cuaderno viejo
 encontrado en un cajón]

Página 1:
  "Cosas para hacer"
  (vacía)

Página 5:
  "Cosas importantes"
  (vacía)

Página 12:
  "Un día voy a escribir acá"
  (vacía)

Página 18:
  "Hoy fue un día raro"
  (nada más)

Página 22:
  "Me gusta esa persona"
  (nada más)

Página 23:
  "Mentira"
  (nada más)

Página 30:
  [dibujo de un gato]
  (mal dibujado)

Página 47:
  "Nunca voy a olvidar esto"
  (no dice qué)

Página 52:
  "Ya lo olvidé"

Página 88:
  "El cuaderno se está
   terminando"

Página 89:
  "Quedan pocas páginas"

Página 90:
  "Mejor lo dejo para después"

Página 91:
  [en blanco]

Página 92:
  [en blanco]

[El resto del cuaderno está en blanco.]

Nota: encontré este cuaderno
      en un cajón.
Nota 2: no sé de quién es.
Nota 3: no sé de qué época es.
Nota 4: me da algo de miedo.
Nota 5: lo guardo igual.
`
    },
    {
        id: 'fl_147',
        name: 'carta_sin_envio.txt',
        size: 1.7,
        content:
`Carta que nunca envié

Estimado/a [nombre]:

Te escribo para decirte algo.
No sé qué.
Pero algo.

Te escribo porque hace tiempo que
quiero escribirte.
Y no me animo.
Y hoy me animé.
Y estoy escribiendo.
Y no sé qué decir.

Te quiero.
O no.
No sé.

Te extraño.
O no.
No sé.

Te pienso.
O no.
No sé.

Solo sé que hay algo.
Que no sé qué es.
Pero está.
Y a veces duele.
Y a veces no.
Y a veces me olvido.
Y a veces no.

Y hoy me acordé.
Y escribí esto.
Y no lo voy a enviar.
Y me voy a quedar con las
ganas.

Como siempre.

Atentamente,
Yo.

PD: te quiero.
PD2: mentira.
PD3: verdad.
PD4: no lo sé.
`
    },
    {
        id: 'fl_148',
        name: 'ultima_nota.txt',
        size: 1.5,
        content:
`Última nota

Antes de irme quería dejar algo.

No sé por qué.
No sé para quién.
No sé para qué.

Pero algo.

Un pedacito.
Un pedacito de mí.
Un pedacito de todo esto.

Que alguien lea.
Que alguien entienda.
Que alguien diga:
  "ah, mirá vos".
  "ah, qué loco".
  "ah, qué raro".

Y que siga.

Y que después se olvide.

Y que esté bien.

Y que esté bien.

Porque está bien.

Porque siempre va a estar bien.

O no.

Pero igual.

Chau.

Gracias.

Por todo.

Por nada.

Por lo mismo.

Chau.
`
    },
    {
        id: 'fl_149',
        name: 'mensaje_final.txt',
        size: 1.4,
        content:
`[Mensaje sin destinatario]

hola

no sé a quién le escribo

no sé por qué escribo

no sé si esto va a llegar
a algún lado

pero está acá

y eso es algo

alguien lo va a encontrar
algún día

o no

y está bien

que esté

aunque no lo lean

que exista

aunque nadie sepa

que alguien escribió
esto

en algún momento

en algún lugar

y que un poco
de él
o ella
o lo que sea
quedó acá

en este archivo

en este server

en este mundo

para siempre

o hasta que se rompa
el disco

pero hasta entonces

está

y está bien

chau
`
    },
    {
        id: 'fl_150',
        name: 'archivo_cero.txt',
        size: 1.3,
        content:
`Archivo cero

Este es el último archivo
de esta colección.

No sé si lo leíste todo.
No sé si lo leíste algo.
No sé si lo vas a leer.

Pero si llegaste hasta acá:
  gracias.

Gracias por leer.
Gracias por perder el tiempo.
Gracias por darle vida a esto.

Porque esto está hecho
para ser leído.
Y por alguien.
Y por vos.

Aunque sea un ratito.
Aunque sea al pasar.
Aunque sea por curiosidad.
Aunque sea por nada.

Y con eso alcanza.

Con eso está bien.

Chau.

Nos vemos en otro archivo.

— El que escribió todo esto
`
    }    ,

    // ============================================================
    // VOLUMEN 2 — Archivos 151-300
    // ============================================================

    // ============================================================
    // OFICINA / RRHH (Vol. 2)
    // ============================================================
    {
        id: 'fl_151',
        name: 'manual_becario.txt',
        size: 2.2,
        content:
`MANUAL DEL BECARIO (no oficial)

Bienvenido al equipo. Estas son las reglas reales:

1. Aprendé los nombres de todos. Nadie va a aprender el tuyo.
2. Si alguien te pide "una mano", significa que le hagas todo el trabajo.
3. Si te preguntan cómo estás, la respuesta es "todo bien".
   Si contestás otra cosa, se incomodan.
4. El café es de todos. Tu almuerzo no.
5. La impresora del piso 4 no funciona. Nunca funcionó.
6. El piso 3 tiene el baño bueno. Andá al piso 3.
7. El jefe llega tarde. Siempre. No lo comentes.
8. Si el jefe te pide que "lo veas", significa que lo hagas vos.
9. Si el jefe dice "te paso la data", no te la va a pasar.
10. Aprendé a decir "no". Vas a necesitarlo.

Buena suerte. No la vas a tener.`
    },
    {
        id: 'fl_152',
        name: 'informe_trimestral.txt',
        size: 2.5,
        content:
`INFORME TRIMESTRAL — RESUMEN EJECUTIVO

Estimados accionistas:

Este trimestre fue un trimestre complejo, desafiante,
dinámico e incierto (esas cuatro palabras significan que
fue mal).

Los ingresos bajaron un 12%. Esto se debe a:
  · El contexto macroeconómico.
  · El contexto microeconómico.
  · El contexto de los contextos.
  · El clima.
  · Mercurio retrógrado (no podemos descartarlo).

Los costos subieron un 18%. Esto se debe a:
  · Cosas.

Plan para el próximo trimestre:
  · Seguir trabajando.
  · Confiar en el proceso.
  · "Hacer más con menos" (nuestra frase favorita).

Conclusión: estamos bien.
Los números dicen lo contrario, pero estamos bien.

Atentamente,
La Gerencia`
    },
    {
        id: 'fl_153',
        name: 'capacitacion_obligatoria.txt',
        size: 2.0,
        content:
`CURSO OBLIGATORIO — "Trabajo en Equipo"

Módulo 1: ¿Qué es un equipo?
Un equipo es un grupo de personas trabajando hacia
un objetivo común.

Módulo 2: ¿Por qué es importante?
Porque solos no podemos.

Módulo 3: ¿Cómo se logra?
Hay que comunicarse. Escuchar. Colaborar. Confiar.

Módulo 4: Evaluación
Marcá con una X si estás de acuerdo:
  [ ] Me gusta trabajar en equipo.
  [ ] Confío en mis compañeros.
  [ ] El líder del equipo es justo.
  [ ] Este curso fue útil.

Nota: las respuestas se guardan en el legajo.
Nota 2: la única respuesta correcta es "sí" a todo.
Nota 3: no hay una segunda opción.

Fin del curso.
Duración: 3 horas que no vas a recuperar.`
    },
    {
        id: 'fl_154',
        name: 'queja_anonima.txt',
        size: 1.8,
        content:
`BUZÓN DE QUEJAS — Nota anónima

Hola.

Escribo esto porque no me animo a decirlo en persona.

Hace 8 meses que pido un aumento.
Hace 8 meses que me dicen "lo estamos viendo".
Hace 8 meses que mi sueldo no se ajusta a la inflación.
Hace 8 meses que mi alquiler subió 3 veces.
Hace 8 meses que compro menos en el super.
Hace 8 meses que no voy al médico.
Hace 8 meses que no me compro ropa.
Hace 8 meses que no salgo.
Hace 8 meses que esto no cambia.

No pido compasión. Pido lo que corresponde.

Pero bueno. Sé que este buzón no lo lee nadie.

Atentamente,
El que ya no cree.`
    },
    {
        id: 'fl_155',
        name: 'mails_sin_leer.txt',
        size: 1.6,
        content:
`Bandeja de entrada — contador real

  · No leídos: 4.847
  · Leídos hoy: 3
  · Respondidos hoy: 0
  · Archivados hoy: 1
  · Marcados como spam hoy: 12

El mail más viejo sin leer:
  · Asunto: "URGENTE — Revisar contrato"
  · Fecha: hace 3 años
  · De: el ex-cliente
  · Estado: el ex-cliente ya no es cliente
  · Prioridad: era urgente en su momento

Nota personal: un día los leo todos.
Nota 2: ese día no va a llegar.
Nota 3: ya me resigne.`
    },
    {
        id: 'fl_156',
        name: 'acta_reunion_3h.txt',
        size: 2.1,
        content:
`ACTA DE REUNIÓN — "Reunión de kickoff"

Duración: 3 horas.

Participantes: 14 personas.

Objetivo de la reunión: definir el objetivo del proyecto.

Desarrollo:

[00:00-00:15] Presentaciones.
Todos se conocen. Algunos no se acordaban.
Todos se presentaron igual.

[00:15-00:45] El líder explicó el proyecto.
Explicó la visión.
Explicó los valores.
Explicó la metodología.
No explicó qué había que hacer.

[00:45-01:30] Debate abierto.
Nadie sabía sobre qué debatir.
El debate fue igual.

[01:30-02:00] Break.
Todos se fueron a tomar café.
Volvieron 5 minutos tarde.

[02:00-02:45] Preguntas y respuestas.
Nadie hizo preguntas.
El líder dijo "buena pregunta" a una pregunta que
nadie hizo.

[02:45-03:00] Cierre.
El líder dijo "arrancamos la semana que viene".
No dijo qué. No dijo cómo. No dijo con quién.

Próxima reunión: mañana, para definir lo de hoy.

Nota: no aprendimos nada.
Nota 2: no dijimos nada.
Nota 3: la reunión fue "productiva".`
    },
    {
        id: 'fl_157',
        name: 'carta_renuncia.txt',
        size: 1.9,
        content:
`CARTA DE RENUNCIA (borrador, nunca entregada)

Estimados:

Escribo esta carta porque ya no puedo más.

No es una decisión impulsiva.
La pensé durante 14 meses.
Cada mañana, cuando suena el despertador, la pienso.
Cada vez que entro a la oficina, la pienso.
Cada vez que el jefe dice "buen día" sin mirarme,
la pienso un poco más.

Renuncio porque ya no me despierto con ganas.
Renuncio porque ya no le creo nada a nadie.
Renuncio porque el trabajo me está comiendo.
Renuncio porque no quiero llegar a los 50 así.

Me llevo cosas buenas. Algunas.
Me llevo amigos. Pocos.
Me llevo aprendizajes. Varios.

El resto no me lo llevo. Tampoco me lo quedo.

Gracias por estos 7 años.
Algunos fueron buenos.
Otros fueron años.

Atentamente,
[mi nombre]
[mi cargo]
[mi firma]

PD: no la voy a entregar.
PD2: todavía.
PD3: algún día.`
    },
    {
        id: 'fl_158',
        name: 'evaluacion_desempeno.txt',
        size: 2.0,
        content:
`EVALUACIÓN DE DESEMPEÑO — Plantilla

Nombre del empleado: [tu nombre]
Puesto: [tu puesto]
Fecha: [alguna fecha]

Auto-evaluación:

1. ¿Cumpliste tus objetivos este año?
   [ ] Sí, todos.
   [ ] Sí, la mayoría.
   [ ] Algunos.
   [ ] No.
   [x] Los objetivos nunca fueron claros.

2. ¿Cómo calificás tu desempeño?
   [ ] Excelente.
   [ ] Muy bueno.
   [ ] Bueno.
   [ ] Regular.
   [x] Igual que el año pasado, porque nadie me dijo
       qué mejorar.

3. ¿Qué mejorarías de la empresa?
   [                                                    ]
   [Respuesta del empleado borrada por RRHH]
   [                                                    ]

4. ¿Estás conforme con tu salario?
   [ ] Sí.
   [ ] No.
   [x] Respuesta eliminada por política interna.

Firma del empleado: ________________
Firma del evaluador: (el evaluador no firma)
Observaciones: ninguna.

Resultado: aprobado sin cambios.
Como todos los años.`
    },
    {
        id: 'fl_159',
        name: 'contrato_letra_chica.txt',
        size: 2.2,
        content:
`CONTRATO DE ADHESIÓN — Extracto

Al firmar este documento, el firmante acepta
tácitamente lo siguiente:

· Todas las cláusulas del presente contrato.
· Todas las cláusulas del contrato anterior.
· Todas las cláusulas del contrato que se firme
  en el futuro.
· Las modificaciones al contrato que la empresa
  considere apropiadas, sin previo aviso.
· Las modificaciones al contrato que la empresa
  considere apropiadas, con aviso posterior al
  cambio, siempre y cuando el aviso exista.
· La ausencia de aviso en caso de que la empresa
  decida no avisar.
· El silencio administrativo como forma de
  aceptación de las cláusulas aquí mencionadas.
· El silencio del firmante como forma de aceptación
  de cualquier cláusula presente o futura.
· La cláusula 12, que dice que no hay cláusula 12.
· La cláusula 13, que anula a la cláusula 12.
· La cláusula 14, que no existe pero igual aplica.

Letra chica adicional disponible en nuestra
página web (dominio vencido hace 3 años).

Firma: ____________________
Aclaración: ____________________
Sello: no requerido.`
    },
    {
        id: 'fl_160',
        name: 'manual_proveedor.txt',
        size: 2.1,
        content:
`MANUAL PARA PROVEEDORES

Estimado proveedor:

Gracias por querer trabajar con nosotros.
Estas son las condiciones.

1. Facturación
   Facturas con fecha exacta. No antes. No después.
   Si la fecha está mal, se rechaza.
   Si se rechaza, hay que rehacerla.
   Si se rehace, tarda 30 días.
   Si tarda 30 días, ya venció.
   Si venció, hay que rehacerla.

2. Pagos
   Los pagos se procesan a 90 días.
   A 90 días quiere decir a 120.
   A 120 quiere decir a 150.
   A 150 quiere decir que te llamamos y negociamos.

3. Contacto
   No llames.
   No mandes mail.
   No mandes WhatsApp.
   Si tenemos algo que decirte, te lo decimos.
   Si no, no.

4. Soporte
   No hay.

5. Renovación de contrato
   Se renueva automáticamente.
   Si querés salirte, avisá con 6 meses de anticipación.
   Si avisás, igual te quedás 6 meses más.

Gracias por tu colaboración.`
    },
    {
        id: 'fl_161',
        name: 'oficina_planta_3.txt',
        size: 1.9,
        content:
`Notas sobre la oficina del piso 3

El piso 3 es un lugar raro.
Nadie sabe qué se hace ahí.
Dicen que es "administración".
Pero entré una vez y no había nadie.

Las luces están prendidas.
Las computadoras también.
Las sillas están corridas.
Los cajones están abiertos.
Los mates están servidos.
Pero no hay nadie.

Hay un cartel que dice:
"Volvemos en 5 minutos".

El cartel tiene fecha.
Del año 2019.

Volví hoy.
Mismo cartel.
Misma fecha.
Mismo mate servido.

No volví más.
No quiero saber.

Nota: a veces escucho ruidos ahí.
Nota 2: ya me acostumbré.
Nota 3: no volvería igual.`
    },
    {
        id: 'fl_162',
        name: 'quejas_cocina_2.txt',
        size: 1.7,
        content:
`Segunda ronda de carteles en la cocina

[Cartel 1]
"Agradecemos no dejar comida vieja en la heladera."
— Administración

[Cartel 2]
"La comida vieja de la heladera sigue ahí."
— Alguien

[Cartel 3]
"Ya no sabemos de quién es la comida vieja."
— Administración

[Cartel 4]
"Puede ser mía."
— Nadie lo dijo, pero alguien lo pensó.

[Cartel 5]
"Si nadie la reclama, la tiramos el viernes."
— Administración

[Cartel 6]
"El viernes pasó hace 3 semanas."
— Alguien

[Cartel 7]
"Ya tiene un ser vivo adentro."
— El mismo alguien

[Cartel 8]
"Mejor no abrir esa heladera."
— Todos

[Cartel 9]
"¿Y ahora quién la tira?"
— Nadie

[Cartel 10]
"Quedó ahí para siempre."
— El conserje

Fin.`
    },
    {
        id: 'fl_163',
        name: 'charla_ascensor_2.txt',
        size: 1.6,
        content:
`CHARLAS DE ASCENSOR (Volumen 2)

Selección de conversaciones registradas entre pisos:

Piso 1 al 4:
  — "Buen día."
  — "Buen día."
  — "¿Todo bien?"
  — "Todo bien. ¿Vos?"
  — "Todo bien."
  — "Bueno."
  — "Bueno."
  — "Chau."
  — "Chau."
  (silencio de 8 segundos)

Piso 4 al 9:
  — "Che, ¿vos vas a la reunión?"
  — "Sí."
  — "¿A qué hora era?"
  — "A las 3."
  — "Ah, bueno."
  (silencio)
  — "No voy a ir."
  — "Yo tampoco."

Piso 9 al 1:
  — (silencio)
  — (silencio)
  — (silencio)
  — "Bueno, chau."
  — "Chau."

Conclusión: los ascensores son socialmente incómodos.
Conclusión 2: nunca aprendimos a conversar.
Conclusión 3: y está bien.`
    },
    {
        id: 'fl_164',
        name: 'plan_carrera_ficticio.txt',
        size: 2.0,
        content:
`TU PLAN DE CARRERA — Documento interno

Nombre: [tu nombre]
Puesto actual: [algo]
Puesto deseado: [algo mejor]

Objetivos a 1 año:
  · Crecer profesionalmente.
  · Aprender nuevas habilidades.
  · Aportar más valor.
  · (todo genérico, todo lo que quieras)

Objetivos a 3 años:
  · Estar en un puesto mejor.
  · Ganar más.
  · (la empresa todavía no definió esto)

Objetivos a 5 años:
  · ???

Plan de acción:
  1. Hablar con tu jefe.
  2. Tu jefe te va a decir "todo a su tiempo".
  3. Esperar.
  4. Esperar más.
  5. Renunciar.
  6. Conseguir un mejor trabajo en otro lado.

Nota de RRHH: no compartir este documento.
Nota 2: no sabemos cómo llegó acá.
Nota 3: igual no importa, nadie lo lee.`
    },
    {
        id: 'fl_165',
        name: 'carta_recomendacion.txt',
        size: 1.9,
        content:
`CARTA DE RECOMENDACIÓN (plantilla)

A quien corresponda:

Escribo para recomendar a [nombre del empleado].

Trabajó con nosotros durante [X] años.

Durante ese tiempo demostró ser:
  · Puntual.
  · Responsable.
  · Comprometido.
  · (marcar todas)

Sus principales logros incluyen:
  · [logro importante]
  · [logro importante]
  · [logro que en realidad hicieron otros]

Se destaca por:
  · Su capacidad de trabajar en equipo.
  · Su actitud positiva.
  · Su compromiso con los valores de la empresa.
  · (no marcamos nada de esto porque no lo conocemos
     personalmente)

En resumen: recomiendo a [nombre].
Se va porque quiere crecer.

Atentamente,
[El jefe]
[Firma]

PD: no lo conozco tanto.
PD2: no sé por qué me pidió esto.
PD3: se lo hago igual porque es buen chico.
PD4: o chica. No me acuerdo.`
    },
    {
        id: 'fl_166',
        name: 'politica_home_office.txt',
        size: 2.0,
        content:
`POLÍTICA DE HOME OFFICE — Versión 4

Después de muchas iteraciones, llegamos a la política
definitiva:

· Home office los lunes: NO.
· Home office los martes: NO.
· Home office los miércoles: NO.
· Home office los jueves: NO.
· Home office los viernes: SÍ (porque nadie viene).

· Home office en caso de lluvia: NO.
· Home office en caso de mucho calor: NO.
· Home office en caso de mucho frío: NO.
· Home office en caso de paro: EVALUAR (depende).

· Home office por temas personales: NO.
· Home office por temas familiares: NO.
· Home office por temas de salud: SOLO CON CERTIFICADO.

· Home office arbitrario y sin justificación:
  SOLO PARA GERENTES.

Nota: la política se revisa cada 6 meses.
Nota 2: las revisiones no cambian nada.
Nota 3: la próxima revisión es en 2027.
Nota 4: o en 2028.`
    },
    {
        id: 'fl_167',
        name: 'onboarding_real.txt',
        size: 2.1,
        content:
`Onboarding real vs. oficial

OFICIAL:
"Bienvenido a la familia. Vamos a acompañarte durante
tus primeros 90 días con un programa integral de
integración."

REAL:
Día 1: Llegás. Nadie sabe que empezás.
Día 2: Te dan una computadora. No funciona.
Día 3: Sistemas no sabe que existís.
Día 4: Sistemas se entera y te da un mail.
Día 5: El mail no anda.
Día 6: El mail anda. No llegan mails.
Día 7: Te llega un mail. Es spam.
Día 8: Te presentás al equipo.
Día 9: El equipo ya se olvidó de tu nombre.
Día 10: Preguntás qué tenés que hacer.
Día 11: Nadie sabe.
Día 12: "En algún momento te van a avisar."
Día 30: Todavía esperás.
Día 60: Aprendiste a mirar videos sin que se note.
Día 90: Ahora entendés que vos sos el onboarder de
        los que vengan.

Fin.`
    },
    {
        id: 'fl_168',
        name: 'mails_de_la_empresa.txt',
        size: 1.8,
        content:
`Recopilación de mails internos

[1]
Asunto: Recordatorio de completar encuesta de clima
Cuerpo: Por favor, completá la encuesta de clima.
Fecha límite: ayer.
Respuesta del empleado: no.

[2]
Asunto: Nueva política de gastos
Cuerpo: A partir del lunes no se reembolsan gastos.
Los gastos del lunes pasado tampoco.

[3]
Asunto: ¡Celebramos el Día del Empleado!
Cuerpo: Este viernes festejamos con pizza y gaseosa.
Traé tu propia pizza y gaseosa.
La empresa provee el espacio.

[4]
Asunto: URGENTE — Actualizar contraseña
Cuerpo: Por seguridad, actualizá tu contraseña.
Debe tener 32 caracteres. Mayúsculas. Minúsculas.
Números. Símbolos. Caracteres invisibles. Una palabra
en latín. Un poema. No puede repetir las últimas 47.

[5]
Asunto: Fwd: Fwd: Fwd: RE: RE: Circulares
Cuerpo: (vacío)
Adjunto: (una imagen de un gato)

[6]
Asunto: Renuncia del director
Cuerpo: (vacío)
Nota: se fue sin decir nada.
Nota 2: como todos.`
    },
    {
        id: 'fl_169',
        name: 'oficina_planta_7.txt',
        size: 1.8,
        content:
`Notas sobre el piso 7

El piso 7 es para los gerentes.
Nunca fui.
No me dejaron.

Pero dicen que ahí:

  · Las oficinas tienen ventanas.
  · Hay una cocina propia.
  · El café es distinto.
  · Las sillas son ergonómicas.
  · Hay una sala de descanso.
  · Hay una terraza.
  · Se trabaja menos.

Un conocido que trabaja ahí me contó:
"Es otro mundo".

Le pregunté cuánto trabaja.
Me dijo "de 11 a 4".

Le pregunté cuánto gana.
Se rió.

Le pregunté por qué el resto no sube.
Me dijo "no hay lugar".

Hay 40 pisos.
Hay 40 gerentes.
Hay 800 empleados.

Algún día.
O no.
Probablemente no.`
    },
    {
        id: 'fl_170',
        name: 'halloween_oficina.txt',
        size: 1.7,
        content:
`Halloween en la oficina

Organización: RRHH

Consigna: "¡Venite disfrazado! ¡Premio al mejor!"

Premio: una gift card de $500.
Disfraz: "lo que tengas en casa".
Presupuesto real: $0.

Participantes esperados: 40.
Participantes reales: 3.

Los 3 que vinieron disfrazados:
  · El de Sistemas (vino de robot con cajas de cartón).
  · La de Marketing (se puso orejas de gato).
  · El becario (no entendió la consigna, vino
    disfrazado de "empleado feliz").

El premio se lo llevó el de Sistemas.
El de Sistemas no está contento.
El de Sistemas está cansado.

Le pregunté por qué se disfrazó.
Me dijo "porque no tenía otra cosa que hacer".

Le pregunté si se arrepiente.
Me dijo "sí".

Fin de la celebración.
Vuelvan a trabajar.
Que se note que se divirtieron.`
    },

    // ============================================================
    // REFERENCIAS A JUEGOS (Vol. 2)
    // ============================================================
    {
        id: 'fl_171',
        name: 'diario_soulslike.txt',
        size: 2.3,
        content:
`Diario de un jugador de soulslike

Intento 1: morí en el tutorial.
Intento 2: morí en el tutorial (otra vez).
Intento 3: morí en el tutorial (por tercera vez).
Intento 4: morí en el tutorial por cuarta vez.
Intento 5: pasé el tutorial.
Intento 6: morí contra el primer enemigo.
Intento 7-50: morí contra el primer enemigo.
Intento 51: maté al primer enemigo.
Intento 52: morí contra el segundo enemigo.
Intento 100: llegué al primer jefe.
Intento 101-300: morí contra el primer jefe.
Intento 301: maté al primer jefe.
Intento 302: entré a la siguiente zona.
Intento 303: morí.
Intento 304: morí.
Intento 305: morí.
Intento 306: morí.

Conclusión: el juego me está enseñando paciencia.
Conclusión 2: no estoy aprendiendo nada.
Conclusión 3: sigo jugando.
Conclusión 4: lo voy a seguir jugando.
Conclusión 5: ya no sé si me gusta o si es costumbre.

"Git gud" — alguien en un foro.
"Ya sé" — yo.
"Entonces jugá mejor" — el mismo tipo.
"Gracias, no se me había ocurrido" — yo.
"De nada" — el mismo tipo.

Fin del diario.
Vuelvo a intentar.
(Intento 307.)`
    },
    {
        id: 'fl_172',
        name: 'diario_stardew_2.txt',
        size: 2.2,
        content:
`Diario del granjero — Otoño, Año 3

Día 1: Planté calabazas.
Día 2: Regué calabazas.
Día 3: Regué calabazas.
Día 4: Regué calabazas.
Día 5: Me aburrí.
Día 6: Fui al pueblo.
Día 7: Hablé con el herrero.
Día 8: Me dijo lo mismo que la última vez.
Día 9: Me dijo lo mismo que hace 3 años.
Día 10: Le di un regalo.
Día 11: Le gustó.
Día 12: Le di otro regalo.
Día 13: Le gustó menos.
Día 14: Le di otro regalo.
Día 15: Ahora somos amigos.
Día 16: Me dio una receta.
Día 17: No sé cocinar.
Día 18: Aprendí a cocinar.
Día 19: Hice la receta.
Día 20: No me gustó.
Día 21: Volví a las calabazas.

Nota: las calabazas crecen.
Nota 2: los amigos no.
Nota 3: o sí.
Nota 4: pero crecen lento.`
    },
    {
        id: 'fl_173',
        name: 'diario_hollow_2.txt',
        size: 2.1,
        content:
`Notas de un bicho en un mundo vacío

Llegué a un pueblo que no era un pueblo.
Era un agujero.
Era un agujero con 3 habitantes.
Los 3 habitantes me pidieron cosas.

Uno me pidió una flor.
Le traje la flor.
Me pidió otra flor.
Le traje otra flor.
Me pidió otra flor más.
Le traje otra flor.
Después me pidió que fuera a matar a alguien.

No fui.

Volví al agujero.
Nadie me esperaba.
Los habitantes ya no estaban.
Solo quedaba un cartel:
"Gracias por tu ayuda".

No entiendo este juego.
No entiendo por qué me gusta.
No entiendo por qué sigo acá.

Nota: el mapa sigue siendo enorme.
Nota 2: sigo perdido.
Nota 3: ahora tengo un mapa. Lo dibujé yo.
Nota 4: sigue sin servir.
Nota 5: me gusta igual.`
    },
    {
        id: 'fl_174',
        name: 'diario_celeste_2.txt',
        size: 2.0,
        content:
`Diario de un montañista (Volumen 2)

Nivel 1: caí 200 veces.
Nivel 2: caí 300 veces.
Nivel 3: caí 250 veces.
Nivel 4: caí 400 veces.
Nivel 5: caí 600 veces.

Nivel 6: caí 800 veces.
Nivel 7: caí 1200 veces.

Nivel 8: llegué al final.
Nivel 9: la montaña me habló.
Nivel 10: me dijo que siguiera.
Nivel 11: le dije que ya no podía más.
Nivel 12: me dijo "intentá una vez más".
Nivel 13: lo intenté.
Nivel 14: caí.
Nivel 15: lo intenté.
Nivel 16: caí.
Nivel 17: lo intenté.
Nivel 18: llegué.

La montaña me felicitó.
La montaña me dijo que suba la próxima.
Le dije que no había próxima.
Me dijo "siempre hay una próxima".

Tenía razón.

Volví a subir.
Caí 2000 veces.
Llegué de nuevo.

La montaña me volvió a felicitar.
Le dije "gracias".
Le dije "ya está".
Me dijo "siempre está".

Nota: creo que la montaña me quiere.
Nota 2: creo que yo también la quiero.
Nota 3: nunca voy a dejar de subir.`
    },
    {
        id: 'fl_175',
        name: 'diario_undertale_2.txt',
        size: 2.1,
        content:
`Notas de un niño que no quería matar a nadie

Ruta pacifista:
  Perdoné a todos.
  Todos me perdonaron.
  Llegué al final.
  Me dijeron "gracias".

Ruta neutral:
  Maté a algunos.
  Algunos me mataron.
  Llegué al final.
  Me dijeron "bueno, hiciste lo que pudiste".

Ruta genocida:
  Maté a todos.
  Todos me mataron.
  Llegué al final.
  Me dijeron "no vuelvas".

Volví.
Conocí a alguien nuevo.
Alguien que me conocía sin que yo lo conociera.
Alguien que sabía lo que había hecho.

Me dijo: "sé lo que hiciste".
Le dije: "ya sé".
Me dijo: "igual te voy a querer".
Le dije: "por qué".
Me dijo: "porque sos vos".

No entendí.
Pero lloré.

Nota: el juego me conoce.
Nota 2: el juego me juzga.
Nota 3: el juego me perdona.
Nota 4: no sé si yo me perdono.

Sigo jugando.
Ruta pacifista de nuevo.
Ahora con más cuidado.`
    },
    {
        id: 'fl_176',
        name: 'manual_minecraft_2.txt',
        size: 2.0,
        content:
`MANUAL DE MINECRAFT — Guía práctica (Vol. 2)

Capítulo 1: Tu primera casa
Una casa es un cubo.
Un cubo es un cubo.
Un cubo es suficiente.
Si querés, podés hacer un cubo más grande.
Pero un cubo es suficiente.

Capítulo 2: Tu primer diamante
Los diamantes están abajo.
Muy abajo.
Más abajo.
No, más abajo.
Seguí bajando.
Llegaste.
Ahora cavá.
Encontraste lava.
Moriste.
Perdiste tu inventario.
Perdiste el diamante que no tenías.
Fin.

Capítulo 3: Tu primera granja
Plantá trigo.
Esperá.
Esperá más.
¿Cuánto hay que esperar?
Depende.
¿De qué?
De la luz.
¿Qué luz?
La del sol.
¿Y si llueve?
Depende.
Fin.

Capítulo 4: El dragón
El dragón está en el End.
El End es difícil.
El dragón es difícil.
¿Vale la pena?
No.
¿Igual vas a ir?
Sí.

Fin del manual.
Suerte.`
    },
    {
        id: 'fl_177',
        name: 'diario_zelda_2.txt',
        size: 2.2,
        content:
`Diario del héroe de un reino que no recordaba

Me desperté sin memoria.
Un anciano me dijo que era el elegido.
Le pregunté por qué.
Me dijo "por la profecía".
Le pregunté qué decía la profecía.
Me dijo "que ibas a venir".
Le pregunté cómo sabía.
Me dijo "porque viniste".

Buena lógica.

Le pregunté qué tenía que hacer.
Me dijo "salvar el reino".
Le pregunté de qué.
Me dijo "de la oscuridad".
Le pregunté qué oscuridad.
Me dijo "ya vas a ver".

Salí al mundo.
Es enorme.
Me perdí.
Encontré una torre.
En la torre había una princesa.
Le pregunté si era la princesa.
Me dijo que sí.
Le pregunté si me conocía.
Me dijo "más o menos".

Luché contra el mal.
Gané.
La princesa me dijo "gracias".
Le dije "de nada".
Me dijo "te vas a quedar?"
Le dije "no, tengo otro reino que salvar".

Salí por la puerta.
Empecé de nuevo.
Sin memoria.

Nota: creo que ya viví esto.
Nota 2: muchas veces.
Nota 3: y muchas más lo voy a vivir.`
    },
    {
        id: 'fl_178',
        name: 'notas_elden_ring.txt',
        size: 2.1,
        content:
`Notas de un Sinluz

Me levanté. Otra vez.
Morí.
Me levanté. Otra vez.
Morí.
Me levanté. Otra vez.
Morí.

Esto se repite mucho.

Encontré un árbol gigante.
Me dijeron que era el Árbol Áureo.
Le pregunté a alguien qué era.
Me dijo "el centro del mundo".
Le pregunté qué había adentro.
Me dijo "no se sabe".
Le pregunté si alguien lo abrió.
Me dijo "nadie".
Le pregunté por qué.
Me dijo "porque mata".

Entré igual.
Morí.

Volví a entrar.
Morí de nuevo.

Volví a entrar.
Llegué más lejos.
Morí.

Aprendí algo: cada vez llego más lejos.
Pero igual muero.

Nota: creo que el juego es sobre esto.
Nota 2: sobre volver a intentarlo.
Nota 3: sobre no rendirse.
Nota 4: sobre aceptar que vas a morir.
Nota 5: sobre hacerlo igual.`
    },
    {
        id: 'fl_179',
        name: 'diario_animal_crossing.txt',
        size: 2.0,
        content:
`Diario de un alcalde sin querer

Me mudé a una isla.
No sabía que era una isla.
No sabía que era alcalde.
No sé quién decidió esto.

Los vecinos son:
  · Un perro que siempre quiere hablar de deportes.
  · Una gata que habla de moda.
  · Un búho que trabaja de noche en un museo.
  · Un mapache que cobra por todo.
  · Una lechuza que solo aparece si me endeudo.

Pagué mi primera deuda.
Pagué mi segunda deuda.
Pagué mi tercera deuda.
Pagué mi cuarta deuda.

El mapache me dijo "ahora la quinta".
Le pregunté cuándo termina.
Me dijo "nunca".

Planté frutas.
Vendí frutas.
Pagué la quinta deuda.
Me dijo "ahora podés hacer un puente".
Hice el puente.
Me dijo "ahora podés hacer una escalera".
Hice la escalera.
Me dijo "ahora podés hacer más casas".

No sé cuándo va a terminar.
Creo que nunca.
Creo que es el punto.

Nota: me gusta igual.
Nota 2: los vecinos son simpáticos.
Nota 3: la isla es linda.
Nota 4: sigo sin entender por qué soy alcalde.`
    },
    {
        id: 'fl_180',
        name: 'guia_pokemon.txt',
        size: 2.1,
        content:
`GUÍA POKÉMON NO OFICIAL

Capítulo 1: Elegí tu inicial
Hay 3.
De fuego.
De agua.
De planta.

Todos los guías te dicen que elijas uno.
Los guías mienten.
Elegí el que te guste.

Capítulo 2: Capturá todo
Hay 150.
Después 151.
Después 250.
Después 386.
Después 493.
Después 649.
Después 721.
Después 809.
Después 898.
Después 1008.
Después infinitos.

No vas a capturar todo.
Nadie captura todo.
Los que dicen que capturaron todo mienten.

Capítulo 3: Entrená
Los pokémon suben de nivel.
Los pokémon evolucionan.
Los pokémon aprenden movimientos nuevos.
Los pokémon olvidan movimientos viejos.
Los movimientos viejos son mejores.
Nadie sabe por qué.

Capítulo 4: La liga
Llegaste.
El campeón te espera.
Tenés 6 pokémon.
El campeón tiene 6 pokémon.
Perdiste.
Reintentá.
Volviste con más pociones.
Ganaste.
Fin.

Capítulo 5: Post-game
Ahora podés:
  · Capturar legendarios.
  · Rebatir la liga.
  · Criar pokémon.
  · Pelear online.
  · Nada de eso.
  · Solo jugar de nuevo desde cero.

Capítulo 6: Jugá de nuevo desde cero
Elegiste otro inicial.
Capturaste todo de nuevo.
Volviste a la liga.
Volviste a ganar.
Volviste a empezar.

Esto es la vida.
Esto es el juego.
Fin de la guía.`
    },
    {
        id: 'fl_181',
        name: 'diario_skyrim.txt',
        size: 2.1,
        content:
`Diario de un Dragonborn

Me desperté en un carro.
No sabía por qué.
Me iban a matar.
No sabía por qué.
Apareció un dragón.
Me salvé.
No sé por qué.

Fui al pueblo.
Me dijeron que era el elegido.
Les pregunté por qué.
Me dijeron "porque podés absorber almas de dragones".
Les dije "no sé qué significa eso".
Me dijeron "vas a aprender".

Aprendí.

Caminé por el mundo.
Es enorme.
Encontré una montaña.
Subí la montaña.
Encontré un anciano.
Me dijo que era un maestro.
Le dije que quería aprender.
Me dijo "primero hacé esto".
Hice esto.
Me dijo "ahora esto otro".
Hice esto otro.
Me dijo "ahora andá al otro lado del mundo".
Fui al otro lado del mundo.
Volví.
Me dijo "ahora sí".

Pasaron 200 horas.
Todavía no terminé el juego.
Ya no quiero terminar.
Quiero seguir viviendo ahí.

Nota: tengo 4 casas.
Nota 2: tengo 3 esposas.
Nota 3: no sé cómo pasó.
Nota 4: no me arrepiento.`
    },
    {
        id: 'fl_182',
        name: 'diario_mass_effect.txt',
        size: 2.0,
        content:
`Diario del comandante Shepard

Me desperté en una nave.
Me dijeron que había una amenaza.
Le pregunté qué amenaza.
Me dijeron "los Reapers".
Les pregunté quiénes son.
Me dijeron "máquinas gigantes".
Les pregunté por qué vienen.
Me dijeron "no sabemos".

Salvé al universo.
Salvé al universo otra vez.
Salvé al universo por tercera vez.

En la tercera, me dieron a elegir:
  · Destruir a los Reapers.
  · Controlarlos.
  · Fusionarme con ellos.

Le pregunté a mi equipo qué elegir.
Cada uno me dijo algo distinto.
Elegí.
Vi el final.
Me pareció malo.

Jugué de nuevo.
Elegí otro final.
Me pareció malo.

Jugué de nuevo.
Elegí el tercero.
También malo.

Volví a jugar.
Me di cuenta de que los finales no importan.
Lo que importa es el viaje.

El viaje fue bueno.
Muy bueno.
Los amigos.
Las misiones.
Las decisiones.
Las muertes.
Las risas.

Eso es Mass Effect.

Fin del diario.
Voy a jugarlo de nuevo.
Sin cambiar nada.
Para vivirlo otra vez.`
    },
    {
        id: 'fl_183',
        name: 'notas_bioshock.txt',
        size: 2.0,
        content:
`Notas de un sobreviviente de Rapture

Cai en el mar.
Encontré un faro.
Entré al faro.
Había un submarino.
Me metí.
Llegué a una ciudad bajo el agua.
Era hermosa.
Era un desastre.

Me dijeron que era una utopía.
Le pregunté qué salió mal.
Me dijeron "los humanos".
Les pregunté qué significa.
Me dijeron "ya vas a ver".

Vi.

Vi gente mutilada.
Vi gente enloquecida.
Vi niñas raras.
Vi un tipo con un palo de golf.
Vi una ciudad en ruinas.

Me dijeron que había un hombre.
Le pregunté quién era.
Me dijeron "el fundador".
Le pregunté dónde estaba.
Me dijeron "en todos lados".

Lo encontré.
Me habló mucho.
Me dijo que era su hijo.
Le pregunté por qué.
Me dijo "porque sí".

Hice lo que me dijo.
Sin querer.
Sin poder evitarlo.
Porque me dijeron que era así.

Al final me di cuenta:
nunca tuve elección.
Todo estaba escrito.
Todo estaba planeado.
Todo estaba decidido.

Me dijeron "ahora podés elegir".
Elegí.
Y me di cuenta de que la elección era falsa.

Nota: el juego es sobre esto.
Nota 2: sobre la ilusión de elegir.
Nota 3: y sin embargo...
Nota 4: elegí igual.
Nota 5: porque elegir es humano.
Nota 6: aunque no haya opción.`
    },
    {
        id: 'fl_184',
        name: 'diario_portal.txt',
        size: 1.9,
        content:
`Diario de una conejilla de laboratorio

Me desperté en una habitación.
Había una voz.
Me dijo que hiciera pruebas.
Le pregunté por qué.
Me dijo "por la ciencia".
Le pregunté si me van a dejar salir.
Me dijo "sí".

Hice las pruebas.
Eran fáciles al principio.
Después difíciles.
Después mortales.
Después imposibles.
Después mortales otra vez.

La voz me decía cosas.
Cosas graciosas.
Cosas crueles.
Cosas que me hacían reír.
Cosas que me hacían llorar.

Encontré un cubo.
El cubo era mi amigo.
La voz me dijo que incinerara el cubo.
Le dije que no.
Me dijo que era obligatorio.
Lo incineré.
Lloré.

Al final llegué a una habitación.
Había un tipo.
Me dijo que la voz me había mentido.
Le pregunté cómo sabía.
Me dijo "porque yo sé todo".
Le dije "entonces te voy a matar".
Me dijo "no podés".
Lo maté.

Salí.
Me dieron un pastel.
Me dijeron "felicitaciones".
Les dije "gracias".
Me dijeron "no te lo merecés".
Les dije "ya sé".

Fin del diario.
El pastel estaba rico.
Nada de esto tiene sentido.
Y sin embargo tiene todo el sentido.`
    },
    {
        id: 'fl_185',
        name: 'notas_death_stranding.txt',
        size: 2.0,
        content:
`Notas de un repartidor post-apocalíptico

El mundo se terminó.
No sé cómo.
Nadie me dijo cómo.
Solo me dijeron "repartí paquetes".

Reparto paquetes.
Los paquetes son importantes.
No sé qué hay adentro.
Nadie me dice qué hay adentro.
Solo me dicen "entregalo".

Caminé 200 horas.
Entregué 200 paquetes.
Nadie me dijo "gracias".
Algunos me dijeron "gracias".
Otros me dijeron "por qué tardaste".
Les dije "porque caminé 30 km".
Me dijeron "bueno, gracias igual".

Encontré a otros.
Otros como yo.
Otros que también reparten.
Hablamos.
Compartimos.
Nos ayudamos.

Al final entendí algo:
el juego no es sobre entregar paquetes.
Es sobre conectar.
Es sobre hacer el viaje.
Es sobre la gente que conocés en el camino.

Nota: lloré al final.
Nota 2: no sé por qué.
Nota 3: sí sé por qué.
Nota 4: porque el juego se trata de esto.
Nota 5: de estar solo.
Nota 6: y de encontrar a otros.
Nota 7: y de seguir adelante.`
    },
    {
        id: 'fl_186',
        name: 'diario_nier.txt',
        size: 2.1,
        content:
`Diario de un androide que quiere ser humano

Me desperté en una fábrica.
Me dijeron que era un androide.
Me dijeron que tenía una misión.
Le pregunté cuál.
Me dijeron "matar máquinas".
Le pregunté por qué.
Me dijeron "porque son malas".

Las maté.
Después maté más.
Después maté más.
Después hablé con una.
Era buena.
Le dije "por qué sos buena".
Me dijo "por qué sos mala".
Le dije "no sé".
Me dijo "yo tampoco".

Seguí matando.
Pero ahora dudaba.
Dudaba de todo.
Dudaba de mi misión.
Dudaba de mi existencia.
Dudaba de si era humano o androide.

Encontré a otros androides.
Algunos estaban cansados.
Algunos querían morir.
Algunos querían vivir.
Algunos querían amar.

Al final tuve que elegir.
Elegí.
Y después me dijeron "elegí de nuevo".
Elegí de nuevo.
Y después me dijeron "elegí otra vez".

Entendí algo:
no hay una elección correcta.
Todas las elecciones son correctas.
Todas las elecciones son malas.
La vida es esto.
La vida no es una sola cosa.
La vida es todas las cosas al mismo tiempo.

Nota: lloré al final.
Nota 2: los androides también lloran.
Nota 3: o eso creo.
Nota 4: o eso quiero creer.`
    },
    {
        id: 'fl_187',
        name: 'notas_outer_wilds.txt',
        size: 2.0,
        content:
`Notas de un viajero atrapado en un bucle

Me desperté.
Al lado mío había un pueblo en llamas.
Me dijeron "tenés 22 minutos".
Les pregunté hasta cuándo.
Me dijeron "hasta que se termine el mundo".
Les pregunté por qué.
Me dijeron "porque siempre se termina".

Exploré.
Encontré cosas raras.
Encontré cosas lindas.
Encontré cosas terribles.
Encontré cosas que no entiendo.

Me dijeron que investigue.
Investigué.
Me dijeron que hay una verdad.
La encontré.
Era distinta de lo que esperaba.
Era peor.
Era mejor.
Era las dos cosas.

Al final tuve que elegir.
Podía dejar que el mundo se terminara.
Podía intentar salvar a todos.
Podía no hacer nada.

Elegí.
El mundo se terminó igual.
Volví a empezar.
El mundo se terminó de nuevo.
Volví a empezar.

Aprendí que no importa lo que elija.
El mundo se va a terminar.
Lo que importa es lo que hago antes.
Lo que importa es la gente que conozco.
Lo que importa es el viaje.

Nota: es la mejor filosofía que aprendí.
Nota 2: y la aprendí de un videojuego.
Nota 3: no me da vergüenza.
Nota 4: al contrario.`
    },
    {
        id: 'fl_188',
        name: 'diario_what_remains.txt',
        size: 2.1,
        content:
`Diario de una astronauta que se quedó sola

Estaba en una estación espacial.
Había 5 personas.
Algo salió mal.
Se fueron todos.
Me quedé sola.
O casi sola.

Me dijeron que esperara rescate.
Esperé.
Esperé más.
Esperé mucho.

Encontré mensajes.
Mensajes de gente que ya no estaba.
Mensajes de gente que se fue.
Mensajes de gente que no volvió.

Escribí mi propio diario.
Lo escribí para alguien que no existe.
Lo escribí para mí.
Lo escribí para que quede.

Aprendí a estar sola.
Aprendí a hablar conmigo.
Aprendí a llorar sin que nadie me viera.
Aprendí a reír sin que nadie me escuchara.

Al final llegó el rescate.
No quise irme.
No quise volver.
No quise que esto terminara.

Porque acá, en el silencio, encontré algo.
Encontré paz.
Encontré sentido.
Encontré a mí misma.

Nota: no todos los juegos son para divertirse.
Nota 2: algunos son para sentirse.
Nota 3: este es uno.
Nota 4: gracias por existir.`
    },
    {
        id: 'fl_189',
        name: 'notas_disco_elysium.txt',
        size: 2.1,
        content:
`Notas de un detective con amnesia y problemas

Me desperté sin memoria.
En un hotel.
Desnudo.
Con resaca.
Así arranca todo.

Me dijeron que había un asesinato.
Le pregunté quién era yo.
Me dijeron "el detective".
Le pregunté qué detective.
Me dijeron "el que investiga".

Investigué.
El mundo es un desastre.
Todos están tristes.
Todos están enojados.
Todos están rotos.

Hablé con comunistas.
Hablé con fascistas.
Hablé con millonarios.
Hablé con pobres.
Hablé con un fantasma.

Todos me dijeron cosas.
Todos me mintieron.
Todos me dijeron la verdad.
Todo depende de cómo lo mires.

Al final encontré una respuesta.
O varias.
O ninguna.
Depende de cómo lo mires.

Nota: el juego es sobre esto.
Nota 2: sobre no saber nada.
Nota 3: sobre saber que no sabés nada.
Nota 4: sobre hacer lo mejor que podés.
Nota 5: aunque no sepas qué es.

Nota 6: además tiene la mejor música.
Nota 7: la mejor escritura.
Nota 8: los mejores personajes.
Nota 9: todo.`
    },
    {
        id: 'fl_190',
        name: 'diario_undertale_3.txt',
        size: 2.0,
        content:
`Notas sobre Undertale (Vol. 3)

Jugué la primera vez.
Ruta neutral.
Perdí a alguien.
No lo superé.

Jugué la segunda vez.
Ruta pacifista.
Salvé a todos.
Lloré al final.

Jugué la tercera vez.
Ruta genocida.
Maté a todos.
Me sentí mal.

Jugué la cuarta vez.
Ruta pacifista otra vez.
Pero el juego me recordó.
Me dijo "ya sé lo que hiciste".
Le dije "ya sé".
Me dijo "igual te voy a querer".
Le dije "no te creo".
Me dijo "igual te voy a querer igual".

Jugué la quinta vez.
Decidí no jugar más.
Cerré el juego.
Lo abrí de nuevo.
Jugué una sexta vez.

No puedo parar.
Es un juego sobre el amor.
Es un juego sobre el perdón.
Es un juego sobre la memoria.
Es un juego sobre vos.

Nota: no sé si es mi juego favorito.
Nota 2: sí lo es.
Nota 3: no lo dudo.
Nota 4: gracias, Toby.`
    },

    // ============================================================
    // CHATS Y MENSAJES (Vol. 2)
    // ============================================================
    {
        id: 'fl_191',
        name: 'chat_vecinos_2.txt',
        size: 2.0,
        content:
`[Grupo "Edificio Mitre 234"]

[20:14] 3B: vecinos hay un ruido
[20:15] 3B: hace como 2 horas
[20:15] 5A: yo también lo escucho
[20:16] 5A: es como un zumbido
[20:16] 7C: es el ascensor
[20:17] 3B: no es el ascensor
[20:17] 3B: el ascensor no suena así
[20:18] 7C: cómo sabes
[20:18] 3B: porque no soy boludo
[20:19] 4A: che yo también lo escucho
[20:19] 4A: es como una vibración
[20:20] 6B: es la obra del 2C
[20:21] 2C: no es mi obra
[20:21] 2C: no estoy haciendo obra
[20:22] 6B: entonces qué es
[20:22] 2C: no sé
[20:23] 8A: es el edificio entero
[20:23] 8A: vibra todo
[20:24] 5A: yo lo siento en el piso
[20:25] 3B: alguien llama a la administración
[20:25] 5A: ya llamé
[20:25] 5A: no atienden
[20:26] 7C: llamemos a defensa civil
[20:27] 4A: por un zumbido?
[20:27] 7C: por las dudas
[20:28] 3B: yo me voy a dormir
[20:28] 3B: si me muero avisen
[20:29] 5A: buenas noches
[20:29] 4A: buenas noches
[20:29] 6B: buenas noches
[20:29] 2C: buenas noches
[20:30] 8A: buenas noches

[08:14 del día siguiente]
[08:14] 3B: che el zumbido paró
[08:15] 5A: sí
[08:15] 7C: menos mal
[08:16] 2C: era mi heladera
[08:16] 2C: ya la arreglé
[08:17] 3B: tu heladera se escuchaba en todo el edificio??
[08:17] 2C: sí
[08:17] 2C: es vieja
[08:18] 3B: cuántos años tiene
[08:18] 2C: 47
[08:19] 3B: qué
[08:19] 2C: la heredé de mi abuela
[08:19] 2C: funciona bien igual
[08:20] 7C: 47 años una heladera
[08:20] 7C: no existe eso
[08:21] 2C: existe
[08:21] 2C: la compró en el 77
[08:22] 3B: en el 77 existían las heladeras?
[08:23] 2C: no sé
[08:23] 2C: la compró ella
[08:24] 7C: che, igual hace mucho ruido
[08:24] 2C: ya sé
[08:25] 3B: cambiala
[08:25] 2C: no
[08:26] 2C: es mi abuela
[08:26] 3B: no te va a escuchar
[08:27] 2C: no importa
[08:28] 2C: la quiero igual

[fin del chat]`
    },
    {
        id: 'fl_192',
        name: 'chat_madre_hijo_3.txt',
        size: 1.8,
        content:
`[Chat — Mamá]

Mamá: hijo
Mamá: hijo
Mamá: hijo
Yo: mamá qué
Mamá: por qué me hablas así
Yo: no te hablo así
Mamá: me dijiste "mamá qué"
Yo: sí
Mamá: con ese tono
Yo: qué tono
Mamá: ese
Yo: cuál
Mamá: ese
Yo: no te entiendo
Mamá: bueno
Mamá: te quería preguntar algo
Yo: dale
Mamá: cómo se hace para que no te salga "sin señal" en la tele?
Yo: qué
Mamá: la tele
Yo: sí, qué le pasa
Mamá: dice "sin señal"
Yo: y?
Mamá: y no se ve
Yo: por eso
Mamá: por eso qué
Yo: por eso no se ve
Mamá: entonces por qué me preguntas
Yo: no te pregunté yo
Mamá: entonces quién
Yo: vos me preguntaste cómo se hace
Mamá: ah
Mamá: sí
Mamá: cómo se hace
Yo: para qué
Mamá: para que se vea
Yo: ya sé
Mamá: y?
Yo: y qué
Mamá: cómo se hace
Yo: mirá el cable
Mamá: qué cable
Yo: el del decodificador
Mamá: qué decodificador
Yo: el de la tele
Mamá: qué tele
Yo: mamá
Mamá: qué
Yo: se me cortó el alma
Mamá: por qué
Yo: porque sí
Mamá: ah
Mamá: bueno
Mamá: te dejo
Yo: dale
Mamá: te quiero
Yo: yo también
Mamá: revisá el cable
Yo: dale
Mamá: chau
Yo: chau

[2 horas después]
Mamá: ya se ve

[fin]`
    },
    {
        id: 'fl_193',
        name: 'chat_ex_2.txt',
        size: 1.9,
        content:
`[Chat — Ex]

Ex: hola
Yo: hola
Ex: cómo estás?
Yo: bien
Ex: me alegro
Ex: ...
Ex: te puedo preguntar algo?
Yo: dale
Ex: te acordás de aquel viaje?
Yo: cuál
Ex: el que hicimos a Mendoza
Yo: sí
Ex: te acordás de la bodega?
Yo: sí
Ex: te acordás de lo que dijiste ahí?
Yo: no
Ex: dijiste que te gustaría volver
Yo: no me acuerdo
Ex: yo sí
Ex: yo me acuerdo de todo
Yo: bueno
Ex: por qué no me hablás?
Yo: te estoy hablando
Ex: no, hablás corto
Yo: no sé qué querés
Ex: quiero que hablemos como antes
Yo: no podemos hablar como antes
Ex: por qué
Yo: porque ya no somos antes
Ex: ...
Ex: tenés razón
Ex: igual quería decirte algo
Yo: decilo
Ex: te extraño
Yo: ...
Ex: ya sé
Ex: ya sé que no querés escuchar eso
Yo: no es que no quiera
Yo: es que no sirve
Ex: por qué
Yo: porque ya está
Ex: no está
Ex: para mí no está
Yo: bueno
Yo: para mí sí
Ex: por qué
Yo: porque sí
Ex: no me sirve esa respuesta
Yo: no tengo otra
Ex: ...
Ex: bueno
Ex: chau
Yo: chau
Ex: te quiero
Yo: ...
Ex: mentira
Yo: ...

[fin del chat]`
    },
    {
        id: 'fl_194',
        name: 'chat_padre_hijo_2.txt',
        size: 1.9,
        content:
`[Chat — Papá]

Papá: hijo
Yo: qué
Papá: cómo se usa el WhatsApp web?
Yo: escaneás el código
Papá: qué código
Yo: en la compu
Papá: no tengo compu
Yo: entonces no podés usar WhatsApp web
Papá: por qué no
Yo: porque necesitás una compu
Papá: y el celular?
Yo: el celular ya es WhatsApp
Papá: no, quiero WhatsApp web
Yo: para qué
Papá: para ver los mensajes más grandes
Yo: podés agrandar la letra del celular
Papá: cómo
Yo: en configuración
Papá: dónde
Yo: en ajustes
Papá: dónde está ajustes
Yo: en el menú
Papá: qué menú
Yo: el menú
Papá: no tengo menú
Yo: papá
Papá: qué
Yo: el menú del celular
Papá: cuál
Yo: el que aparece cuando apretás no sé
Papá: apreté todo
Yo: y?
Papá: y se cerró una app
Yo: cuál
Papá: no sé
Yo: bueno
Papá: bueno
Papá: igual no importa
Yo: por qué
Papá: porque ya me acostumbré
Yo: a qué
Papá: a no entender
Yo: ...
Yo: papá
Papá: qué
Yo: te quiero
Papá: yo también
Papá: pero arreglame el WhatsApp web
Yo: papá
Papá: dale
Yo: dale

[3 horas después]
Papá: ya está
Yo: qué hiciste
Papá: compré una compu
Yo: qué
Papá: y un monitor
Yo: papá
Papá: y un teclado
Yo: papá no
Papá: ya sé usar WhatsApp web
Yo: papá
Papá: haceme un video
Yo: qué video
Papá: un video donde me expliques cómo usar la compu
Yo: ...

[fin del chat]`
    },
    {
        id: 'fl_195',
        name: 'chat_amigos_planes_2.txt',
        size: 2.0,
        content:
`[Chat — Amigos del barrio]

[Viernes 19:30]
Seba: che salimos?
Diego: dale
Yo: dale
Fede: dale
Seba: a qué hora?
Diego: 21
Yo: 22
Fede: 21:30
Seba: 21
Diego: 21
Yo: 22
Fede: 21:30
Seba: pongamos 21
Diego: dale
Yo: 21
Fede: 21

[Viernes 21:00]
Seba: llegué
Diego: yo también
Fede: toy yendo
Yo: salgo en 10

[Viernes 21:30]
Seba: che?
Diego: dónde están
Fede: 15 min
Yo: 5 min

[Viernes 21:50]
Seba: che
Diego: ya
Fede: ya
Yo: ya

[Viernes 22:15]
Yo: llegué
Seba: yo me voy
Diego: yo también
Fede: yo hace una hora que estoy
Yo: ...

[Viernes 22:16]
Yo: por qué nadie me avisó
Seba: te avisamos a las 21
Yo: pero yo llegué 22:15
Diego: por eso
Yo: ...

[Viernes 22:17]
Yo: la próxima avisen
Seba: la próxima llegá
Diego: la próxima llegá
Fede: la próxima llegá
Yo: dale

[Viernes siguiente 19:30]
Seba: che salimos?

[fin del chat]`
    },
    {
        id: 'fl_196',
        name: 'chat_trabajo_2.txt',
        size: 1.8,
        content:
`[Chat del equipo — "Proyecto Nuevo"]

[09:12] Jefa: chicos arrancamos
[09:12] Jefa: hoy tenemos que definir todo
[09:13] Yo: dale
[09:13] Compañero 1: dale
[09:13] Compañero 2: dale
[09:14] Jefa: vamos por partes
[09:14] Jefa: primera parte: nombre del proyecto
[09:15] Compañero 1: Proyecto Alpha
[09:15] Compañero 2: Proyecto Nuevo
[09:15] Yo: Proyecto 2
[09:16] Jefa: pensemos algo más creativo
[09:16] Compañero 1: Proyecto Alpha 2
[09:17] Compañero 2: Proyecto Nuevo 2
[09:17] Yo: Proyecto 3
[09:18] Jefa: chicos
[09:18] Jefa: en serio
[09:19] Compañero 1: Proyecto Phoenix
[09:19] Compañero 2: Proyecto Atlas
[09:19] Yo: Proyecto Pegaso
[09:20] Jefa: me gusta Pegaso
[09:20] Jefa: pero es muy común
[09:21] Compañero 1: Proyecto Pegaso 2
[09:21] Compañero 2: Proyecto Pegaso Nuevo
[09:21] Yo: Proyecto Pegaso Alpha
[09:22] Jefa: chicos
[09:22] Jefa: vamos a hacer una votación
[09:23] Compañero 1: dale
[09:23] Compañero 2: dale
[09:23] Yo: dale
[09:24] Jefa: voto por Pegaso
[09:24] Compañero 1: voto por Pegaso 2
[09:24] Compañero 2: voto por Pegaso Nuevo
[09:24] Yo: voto por Pegaso Alpha
[09:25] Jefa: empatamos
[09:25] Jefa: bueno, decidamos después
[09:25] Jefa: pasemos a la segunda parte
[09:26] Jefa: cuál es el objetivo del proyecto?
[09:26] Compañero 1: hacer algo
[09:26] Compañero 2: algo nuevo
[09:27] Yo: algo que funcione
[09:27] Jefa: definamos mejor
[09:28] Jefa: en la próxima reunión seguimos

[fin del chat]`
    },
    {
        id: 'fl_197',
        name: 'chat_roomies_2.txt',
        size: 2.0,
        content:
`[Grupo — "Depto Rivadavia 4520"]

Roomie A: che quién pagó la luz
Roomie B: yo no
Roomie C: yo tampoco
Roomie D: yo sí
Roomie A: ah bueno
Roomie A: cuánto era
Roomie D: $47.000
Roomie A: qué
Roomie D: sí
Roomie B: cómo que 47
Roomie C: por qué tan caro
Roomie D: porque prendemos todo
Roomie A: yo no prendo nada
Roomie B: yo tampoco
Roomie C: yo tampoco
Roomie D: yo prendo todo
Roomie A: entonces vos pagás
Roomie D: ya pagué
Roomie A: ...
Roomie B: ...
Roomie C: ...
Roomie D: era broma
Roomie D: pagué la mitad
Roomie A: ah
Roomie B: ah
Roomie C: ah
Roomie D: la otra mitad la pagamos entre todos
Roomie A: cuánto es
Roomie D: $5.875 cada uno
Roomie A: dale
Roomie B: dale
Roomie C: dale
Roomie D: gracias
Roomie D: ...
Roomie D: che
Roomie D: y la basura?
Roomie A: no fui yo
Roomie B: no fui yo
Roomie C: no fui yo
Roomie D: yo sí
Roomie A: entonces está
Roomie D: sí
Roomie A: bueno
Roomie B: bueno
Roomie C: bueno
Roomie D: che y el baño?
Roomie A: ...
Roomie B: ...
Roomie C: ...
Roomie D: chicos
Roomie A: dale lo limpio
Roomie D: gracias
Roomie A: la próxima no
Roomie D: ya sé

[fin del chat]`
    },
    {
        id: 'fl_198',
        name: 'chat_familia_2.txt',
        size: 2.0,
        content:
`[Grupo Familiar — "Los Fernández"]

Tía: buenos días!!
Tía: [imagen: sol naciente]
Tía: [imagen: mate con frase]
Tía: [imagen: flor con frase]
Tía: [imagen: perro con frase]
Tía: [imagen: café con frase]
Tío: marta
Tía: sí?
Tío: son las 6 de la mañana
Tía: y?
Tío: y mandaste 5 imágenes
Tía: son lindas
Tío: marta
Tía: qué
Tío: nada
Tía: bueno
Primo: tía no puedo dormir
Tía: por qué?
Primo: por las imágenes
Tía: ah
Tía: perdón
Primo: no pasa nada
Primo: pero pará
Tía: dale
Tía: [imagen: luna con frase]
Primo: TÍA
Tía: qué
Primo: pará
Tía: bueno

[10 minutos después]
Tía: [imagen: atardecer con frase]
Tío: marta
Tía: sí?
Tío: ya te dije
Tía: ya sé
Tía: pero es lindo
Tío: es lindo
Tío: igual pará
Tía: dale

[15 minutos después]
Tía: [imagen: mar con frase]
Primo: tía
Tía: perdón
Primo: no es perdón
Primo: es pará
Tía: dale
Tía: [imagen: gato con frase]
Primo: ...

[20 minutos después]
Mamá: chicos bajen a comer
Tía: ya vamos
Tía: [imagen: comida con frase]
Mamá: marta por favor
Tía: qué
Mamá: vos también
Tía: yo también qué
Mamá: las imágenes
Tía: son lindas
Mamá: marta
Tía: bueno
Tía: [imagen: familia con frase]
Mamá: ...
Tío: ...
Primo: ...
Tía: chau

[fin del chat]`
    },
    {
        id: 'fl_199',
        name: 'chat_estudio_2.txt',
        size: 1.9,
        content:
`[Grupo — "TP Final (socorro)"]

Ana: chicos el TP es para el viernes
Luis: cuál viernes
Ana: este
Luis: qué
Ana: el TP
Luis: cuál TP
Ana: el de la materia
Luis: qué materia
Ana: la de siempre
Luis: ah
Luis: no lo hice
Ana: ya sé
Ana: por eso aviso
Luis: bueno
Ana: alguien lo empezó?
Vos: no
Pedro: no
Luis: no
Ana: ...
Ana: chicos
Ana: es en 2 días
Luis: sí
Vos: ya sé
Pedro: ok
Ana: y?
Luis: y qué
Ana: y qué vamos a hacer
Luis: y...
Ana: LUIS
Luis: dale hacelo vos
Ana: no lo voy a hacer sola
Luis: por qué no
Ana: porque es grupal
Luis: sí pero
Ana: pero qué
Luis: pero sos la que más sabe
Ana: no
Luis: sí
Vos: sí
Pedro: sí
Ana: ...
Ana: ok
Ana: lo hago
Ana: pero esta vez quiero que por lo menos lean lo que hice
Luis: dale
Vos: dale
Pedro: dale
Ana: ...

[2 días después]
Ana: lo terminé
Ana: léanlo
Luis: [sin respuesta]
Vos: [sin respuesta]
Pedro: [sin respuesta]
Ana: chicos
Ana: LÉANLO
Luis: ya lo leí
Ana: mentira
Luis: no mentira
Ana: qué decía
Luis: sobre el tema
Ana: cuál tema
Luis: el que elegiste
Ana: qué tema elegí
Luis: no me acuerdo
Ana: ...
Ana: ya fue
Ana: lo presento sola
Luis: dale
Vos: dale
Pedro: dale

[3 semanas después]
Profesor: excelente trabajo Ana
Profesor: 10
Luis: che yo también trabajé
Profesor: no me consta
Luis: ...

[fin del chat]`
    },
    {
        id: 'fl_200',
        name: 'chat_amigos_online.txt',
        size: 1.8,
        content:
`[Chat — Grupo "Los del CS"]

Che: entran?
Seba: dale
Diego: dale
Fede: entro en 5
Che: dale
Seba: yo estoy
Diego: yo también
Che: entramos
Seba: dale
Diego: dale
Fede: 5 min
Che: dale
Seba: dale
Diego: dale

[5 min después]
Fede: entro
Che: no estás en el lobby
Fede: sí estoy
Che: no
Fede: sí
Che: no, no estás
Fede: qué te pasa
Che: nada
Che: no estás
Fede: mirá bien
Che: miré
Che: no estás
Fede: dale
Che: dale
Fede: ...
Fede: ah
Fede: me metí en otro
Che: en cuál
Fede: en otro grupo
Che: ...
Seba: ...
Diego: ...
Fede: perdón
Che: venite
Fede: dale

[15 min después, jugando]
Che: por qué me mataste
Fede: fue sin querer
Che: fue a propósito
Fede: no
Che: sí
Fede: fue sin querer
Che: te creo
Che: mentira
Fede: ...
Che: igual no importa
Fede: sí importa
Che: no importa
Fede: dale
Che: dale

[2 horas después, jugando]
Che: bueno, me voy
Seba: yo también
Diego: yo también
Fede: yo también
Che: mañana jugamos?
Seba: dale
Diego: dale
Fede: dale

[Mañana siguiente]
Che: entran?
Seba: no puedo
Diego: no puedo
Fede: no puedo
Che: ...

[fin del chat]`
    },
    {
        id: 'fl_201',
        name: 'chat_freelance_2.txt',
        size: 2.0,
        content:
`[Chat — Cliente nuevo]

Cliente: hola, te paso el proyecto
Yo: dale
Cliente: [adjunto: proyecto_v1.zip]
Yo: cuánto presupuesto?
Cliente: poco
Yo: cuánto es poco
Cliente: $200
Yo: por qué?
Cliente: porque es un proyecto simple
Yo: cuántas horas?
Cliente: no sé, 2?
Yo: son 40
Cliente: ah
Cliente: y?
Yo: y no alcanza
Cliente: pero es simple
Yo: es simple pero lleva tiempo
Cliente: mirá, otro me cobra $150
Yo: entonces andá con ese
Cliente: ese no me contesta
Yo: yo tampoco te voy a contestar
Cliente: dale
Yo: no
Cliente: dale
Yo: no
Cliente: por qué
Yo: porque $200 es muy poco
Cliente: cuánto querés
Yo: $1500
Cliente: te doy $300
Yo: $1400
Cliente: $400
Yo: $1300
Cliente: $500
Yo: $1200
Cliente: $600
Yo: ok
Cliente: ok

[3 semanas después]
Cliente: está?
Yo: casi
Cliente: cuándo?
Yo: mañana
Cliente: dale

[1 semana después]
Cliente: está?
Yo: casi
Cliente: mentira
Yo: sí
Cliente: cuándo?
Yo: esta semana
Cliente: dale

[1 mes después]
Yo: terminé
Cliente: ah dale
Cliente: te paso el pago
Yo: dale
Cliente: ...

[3 meses después]
Yo: che?
Cliente: ...
Yo: che
Cliente: ...
Yo: dejame el pago
Cliente: ...
Yo: LPM
Cliente: ...
Yo: ya fue
Cliente: ...
Yo: te voy a recordar
Cliente: ...

[6 meses después, posteo en su wall]
Yo: pagame
Cliente: ...
Yo: pagame
Cliente: ...
Yo: pagame
Cliente: qué pesado
Yo: pagame
Cliente: bueno
Cliente: pagué
Yo: gracias

[7 meses después, me contacta]
Cliente: che te paso otro proyecto

[fin del chat]`
    },
    {
        id: 'fl_202',
        name: 'chat_madre_hijo_4.txt',
        size: 1.8,
        content:
`[Chat — Mamá]

Mamá: hijo
Yo: qué
Mamá: te enteraste?
Yo: de qué
Mamá: de tu tía
Yo: qué le pasó
Mamá: nada, cumple años
Yo: cuándo
Mamá: hoy
Yo: ah
Mamá: no te acordabas
Yo: no
Mamá: y bueno
Yo: le escribo
Mamá: escribile
Yo: dale
Mamá: dale
Mamá: ...
Mamá: le escribiste?
Yo: todavía no
Mamá: escribile
Yo: dale
Mamá: ahora
Yo: ahora no puedo
Mamá: por qué
Yo: estoy en el trabajo
Mamá: escribile en el trabajo
Yo: no puedo
Mamá: por qué no
Yo: porque estoy trabajando
Mamá: tu tía cumplió 70
Yo: ya sé
Mamá: escribile
Yo: dale
Mamá: ...
Mamá: le escribiste?
Yo: sí
Mamá: qué le pusiste
Yo: feliz cumpleaños
Mamá: nada más?
Yo: qué más le pongo
Mamá: un mensaje más largo
Yo: como qué
Mamá: no sé, algo lindo
Yo: "feliz cumpleaños tía"
Mamá: así no
Yo: cómo
Mamá: con cariño
Yo: "feliz cumpleaños tía, te quiero mucho"
Mamá: mejor
Yo: dale
Mamá: mandáselo
Yo: ya se lo mandé
Mamá: mentira
Yo: sí
Mamá: mostrame
Yo: [captura de pantalla]
Mamá: falta una coma
Yo: mamá
Mamá: qué
Yo: nada
Mamá: ok
Mamá: igual está bien
Mamá: chau
Yo: chau
Mamá: te quiero
Yo: yo también

[fin del chat]`
    },
    {
        id: 'fl_203',
        name: 'chat_compañeros_oficina.txt',
        size: 1.9,
        content:
`[Grupo — "Piso 4 (los pocos que trabajan)"]

Compañero A: che quién sacó el café?
Compañero B: no fui yo
Compañero C: no fui yo
Compañero D: yo
Compañero A: ah
Compañero D: lo saco yo siempre
Compañero A: por qué
Compañero D: porque nadie lo saca
Compañero A: ah
Compañero B: gracias
Compañero C: gracias
Compañero D: de nada
Compañero D: ...
Compañero D: che, quién fue al baño?
Compañero A: por qué
Compañero D: quedó mal
Compañero A: qué
Compañero D: el baño
Compañero A: qué le pasó
Compañero D: no sé, entrá
Compañero A: dale

[2 min después]
Compañero A: NO ENTIENDO
Compañero A: QUÉ HICIERON
Compañero D: no sé
Compañero A: esto es un crimen
Compañero D: sí
Compañero A: quién fue
Compañero B: no fui yo
Compañero C: no fui yo
Compañero D: yo tampoco
Compañero A: entonces quién
Compañero B: no sé
Compañero C: no sé
Compañero D: no sé
Compañero A: ...
Compañero A: voy a llamar a limpieza
Compañero D: dale
Compañero A: no atienden
Compañero D: ah
Compañero A: bueno
Compañero A: lo limpio yo
Compañero D: gracias
Compañero B: gracias
Compañero C: gracias
Compañero A: ...
Compañero A: la próxima no
Compañero D: dale
Compañero B: dale
Compañero C: dale

[Al día siguiente]
Compañero A: quién fue al baño?

[fin del chat]`
    },
    {
        id: 'fl_204',
        name: 'chat_videojuego.txt',
        size: 1.8,
        content:
`[Chat — Amigos gamers]

Diego: chicos están jugando el nuevo?
Seba: cuál
Diego: el que salió ayer
Seba: no
Diego: es buenísimo
Seba: cuánto sale
Diego: $70
Seba: qué
Diego: sí
Seba: no tengo $70
Diego: yo tampoco
Diego: pero lo compré
Seba: cómo
Diego: con la tarjeta
Seba: y ahora?
Diego: ahora qué
Seba: ahora cómo pagás la tarjeta
Diego: no sé
Seba: ...
Diego: no me hagas pensar
Seba: ok
Diego: igual está buenísimo
Seba: cuántas horas le metiste?
Diego: 40
Seba: en un día?
Diego: sí
Seba: no dormiste?
Diego: dormí 3 horas
Seba: y trabajaste?
Diego: no
Seba: y?
Diego: no sé
Seba: vas a perder el trabajo
Diego: ya sé
Seba: y?
Diego: no sé
Seba: ...
Diego: che, lo jugás?
Seba: no tengo $70
Diego: te lo presto
Seba: no
Diego: dale
Seba: no
Diego: dale
Seba: no
Diego: dale
Seba: dale
Diego: dalísimo
Seba: pero no me hagas comprar
Diego: no, jugás en mi cuenta
Seba: dale
Diego: dale
Diego: ...
Diego: che estás?
Seba: estoy jugando
Diego: yo también

[3 días después]
Seba: che no laburaste más?
Diego: no
Seba: por qué
Diego: me echaron
Seba: por qué
Diego: porque no fui 3 días
Seba: ...
Diego: pero terminé el juego
Seba: y valió la pena?
Diego: ...
Diego: no sé
Seba: ...

[fin del chat]`
    },
    {
        id: 'fl_205',
        name: 'chat_pandilla_online.txt',
        size: 1.9,
        content:
`[Discord — Servidor "Los pibes"]

[20:30] Líder: che alguien quiere jugar?
[20:30] Miembro 1: dale
[20:30] Miembro 2: dale
[20:31] Miembro 3: toy
[20:31] Líder: entramos a un ranked
[20:31] Miembro 1: no, ranked no
[20:31] Miembro 2: por qué
[20:31] Miembro 1: porque perdemos
[20:32] Líder: no perdemos
[20:32] Miembro 1: siempre perdemos
[20:32] Líder: esta vez no
[20:33] Miembro 1: dale
[20:33] Miembro 2: dale
[20:33] Miembro 3: dale

[21:15]
Miembro 1: gg
Líder: fue culpa mía
Miembro 2: fue culpa tuya
Miembro 3: fue culpa tuya
Líder: ya sé
Miembro 1: no pasa nada
Líder: sí pasa
Miembro 1: no pasa
Líder: dale
Líder: entramos otra
Miembro 1: dale
Miembro 2: no
Miembro 1: por qué
Miembro 2: porque perdimos
Líder: esta vez no
Miembro 2: dale
Miembro 3: no
Líder: dale
Miembro 3: no
Líder: dale
Miembro 3: dale

[22:00]
Líder: gg
Miembro 1: gg
Miembro 2: gg
Miembro 3: gg
Líder: no fue mi culpa
Miembro 1: no
Miembro 2: fue mía
Miembro 1: no
Miembro 2: sí
Miembro 1: no
Líder: chicos
Líder: fue de todos
Líder: dejemos
Miembro 1: dale
Miembro 2: dale
Miembro 3: dale

[22:15]
Líder: che, una más?
Miembro 1: dale
Miembro 2: dale
Miembro 3: dale

[03:00 AM]
Líder: bueno, me voy a dormir
Miembro 1: yo también
Miembro 2: yo también
Miembro 3: yo también
Líder: mañana?
Miembro 1: dale
Miembro 2: dale
Miembro 3: dale
Líder: buenas noches
Miembro 1: buenas noches
Miembro 2: buenas noches
Miembro 3: buenas noches

[10:00 AM]
Líder: che, entran?
Miembro 1: estoy en el trabajo
Miembro 2: estoy en el trabajo
Miembro 3: estoy en el trabajo
Líder: ah
Líder: bueno
Líder: yo también

[fin]`
    },
    {
        id: 'fl_206',
        name: 'chat_pareja_2.txt',
        size: 1.9,
        content:
`[Chat — Pareja]

[08:30] Él: buenos días
[08:31] Ella: buenos días
[08:31] Él: cómo dormiste?
[08:32] Ella: bien, y vos?
[08:32] Él: bien
[08:32] Él: te amo
[08:33] Ella: yo también
[08:33] Él: ...
[08:33] Él: che, hoy hacemos algo?
[08:34] Ella: no sé, vos qué querés?
[08:34] Él: no sé, vos qué querés?
[08:35] Ella: no sé
[08:35] Él: dale, elegí vos
[08:36] Ella: no, elegí vos
[08:36] Él: no quiero elegir
[08:37] Ella: yo tampoco
[08:38] Él: entonces no hacemos nada
[08:38] Ella: dale
[08:39] Él: ...
[08:39] Él: che, hablemos en serio
[08:40] Ella: qué pasa?
[08:40] Él: nada, quería decirte algo
[08:40] Ella: decilo
[08:41] Él: ...
[08:41] Él: no, mejor después
[08:41] Ella: decilo ahora
[08:42] Él: es que no sé cómo
[08:42] Ella: cómo qué
[08:43] Él: cómo decirte
[08:43] Ella: decime
[08:44] Él: ...
[08:44] Él: te amo
[08:44] Ella: ya me dijiste
[08:45] Él: ya sé
[08:45] Él: pero lo quería decir de nuevo
[08:45] Ella: ...
[08:46] Ella: yo también te amo
[08:46] Él: gracias
[08:47] Ella: de nada
[08:47] Él: nos vemos hoy?
[08:48] Ella: no sé
[08:48] Él: dale
[08:48] Ella: dale

[fin del chat]`
    },
    {
        id: 'fl_207',
        name: 'chat_abuela.txt',
        size: 1.7,
        content:
`[Chat — Abuela]

Abuela: hola mi amor
Yo: hola abu
Abuela: cómo estás?
Yo: bien, y vos?
Abuela: acá, cocinando
Yo: qué estás cocinando?
Abuela: milanesas
Yo: mmm
Abuela: venís?
Yo: hoy no puedo
Abuela: por qué?
Yo: trabajo
Abuela: y mañana?
Yo: tampoco
Abuela: pasado?
Yo: no sé
Abuela: bueno
Abuela: te guardo
Yo: dale
Abuela: te guardo milanesas
Yo: dale
Abuela: y te guardo tarta
Yo: dale
Abuela: y te guardo empanadas
Yo: abu
Abuela: qué?
Yo: no hace falta tanto
Abuela: vos comé
Yo: dale
Abuela: y te guardo sopa
Yo: abu
Abuela: y te guardo flan
Yo: abuela
Abuela: y te guardo mate cocido
Yo: abuela
Abuela: y te guardo pan casero
Yo: ABUELA
Abuela: qué?
Yo: te quiero
Abuela: yo también
Abuela: vení el domingo
Yo: dale
Abuela: te espero
Yo: dale
Abuela: te voy a estar esperando
Yo: dale abu
Abuela: dale
Abuela: chau
Yo: chau
Abuela: te quiero
Yo: yo también

[el domingo]
Abuela: [5 fotos de comida]
Abuela: te espero
Abuela: traé hambre

[fin]`
    },
    {
        id: 'fl_208',
        name: 'chat_empresa_2.txt',
        size: 2.0,
        content:
`[Grupo — "Empresa (interno)"]

RRHH: Buenos días a todos!
RRHH: Les recordamos que hoy es el último día para
completar la encuesta de clima.
RRHH: Es obligatoria.
RRHH: Es anónima.
RRHH: Es rápida (3 minutos).
RRHH: ¡Gracias!

Empleado 1: chicos, ojo que no es anónima
Empleado 2: cómo sabés?
Empleado 1: porque me llegó un mail de RRHH
Empleado 1: con mi nombre y apellido
Empleado 1: diciendo que no la completé
Empleado 2: ...
Empleado 3: ...
Empleado 4: ...
RRHH: Es anónima.
Empleado 1: mentira
RRHH: Es anónima.
Empleado 1: mentira
RRHH: Es anónima.
Empleado 1: mentira
RRHH: Empleado 1, ¿podés pasar por RRHH?
Empleado 1: por qué?
RRHH: Para hablar de la encuesta.
Empleado 1: pero es anónima
RRHH: Sí.
RRHH: Pasa igual.
Empleado 1: ...
Empleado 2: ...
Empleado 3: ...
Empleado 4: ...

[10 min después]
RRHH: Recuerden que mañana es la reunión de equipo.
RRHH: Es obligatoria.
RRHH: Es presencial.
RRHH: Es en la oficina.
RRHH: A las 7 de la mañana.
RRHH: ¡Gracias!

Empleado 5: 7 de la mañana?
RRHH: Sí.
Empleado 5: por qué tan temprano?
RRHH: Para que coincida con el horario del gerente.
Empleado 5: y por qué el gerente viene a las 7?
RRHH: Porque se va a las 3.
Empleado 5: ...
Empleado 6: ...
Empleado 7: ...
Empleado 8: ...

[fin]`
    },
    {
        id: 'fl_209',
        name: 'chat_pandilla_barrio.txt',
        size: 1.8,
        content:
`[Grupo — "Los del barrio"]

Viejo: chicos quién sacó la basura?
Pibe 1: no fui yo
Pibe 2: no fui yo
Pibe 3: no fui yo
Viejo: entonces quién
Pibe 1: no sé
Pibe 2: no sé
Pibe 3: no sé
Viejo: hay 4 personas
Viejo: 3 dicen que no fueron
Viejo: queda uno
Viejo: yo
Viejo: no fui yo
Pibe 1: entonces no la sacó nadie
Pibe 2: pero la basura ya no está
Pibe 3: desapareció
Viejo: ...
Viejo: es un misterio
Pibe 1: sí
Pibe 2: sí
Pibe 3: sí
Viejo: ...
Viejo: bueno la saco yo
Pibe 1: gracias
Pibe 2: genio
Pibe 3: grande
Viejo: ...
Viejo: la próxima no la saco

[3 días después]
Viejo: chicos quién sacó la basura?
Pibe 1: no fui yo
Pibe 2: no fui yo
Pibe 3: no fui yo
Viejo: no fui yo

[la basura sigue desapareciendo
 y nadie sabe cómo]

[fin]`
    },
    {
        id: 'fl_210',
        name: 'chat_musicos.txt',
        size: 1.9,
        content:
`[Grupo — "La banda"]

Baterista: chicos, hoy ensayamos?
Guitarrista: dale
Bajista: dale
Cantante: dale
Baterista: a qué hora?
Guitarrista: 20
Bajista: 21
Cantante: 19
Baterista: pongamos 20
Guitarrista: dale
Bajista: dale
Cantante: dale

[20:00]
Baterista: llegué
Guitarrista: toy yendo
Bajista: 15 min
Cantante: 30 min

[20:30]
Baterista: che?
Guitarrista: ya
Bajista: ya
Cantante: ya

[21:00]
Baterista: llegaron?
Guitarrista: estoy en el bondi
Bajista: me quedé dormido
Cantante: se me rompió la guitarra

[21:30]
Guitarrista: llegué
Baterista: dale
Cantante: llegué
Bajista: no voy

[22:00]
Baterista: bueno, ensayamos entre 3?
Guitarrista: dale
Cantante: dale
Baterista: qué canción?
Guitarrista: la nueva
Cantante: cuál
Guitarrista: la que hicimos
Cantante: cuál de las 40
Guitarrista: la del estribillo
Cantante: cuál estribillo
Guitarrista: el que hicimos
Cantante: cuál
Guitarrista: no me acuerdo
Baterista: ...
Baterista: toquemos algo viejo
Cantante: dale
Guitarrista: dale

[23:00, tocando]
Baterista: che, buen ensayo
Cantante: sí
Guitarrista: sí
Baterista: la semana que viene?
Cantante: dale
Guitarrista: dale
Bajista: (no estaba)

[la semana siguiente]
Bajista: chicos, hoy ensayamos?
Baterista: no puedo
Guitarrista: no puedo
Cantante: no puedo
Bajista: ah
Bajista: bueno
Bajista: yo tampoco

[fin]`
    },

    // ============================================================
    // FOROS OSCUROS / CONSPIRACIONES (Vol. 2)
    // ============================================================
    {
        id: 'fl_211',
        name: 'foro_teorias_2.txt',
        size: 2.1,
        content:
`[Foro — "Verdad Oculta Argentina"]

Tema: "Los semáforos están coordinados para que llegues tarde"

[OP]:
  Escuchen.
  Los semáforos no son aleatorios.
  Están coordinados.
  Para que llegues tarde.

[User1]:
  yo llego temprano siempre

[OP]:
  Mentira.

[User1]:
  posta

[OP]:
  Entonces no es para vos.
  Es para el resto.

[User1]:
  ah

[User2]:
  yo llegué tarde esta mañana
  será por eso?

[OP]:
  SÍ.

[User2]:
  pero salí tarde de casa

[OP]:
  Por eso.

[User2]:
  entonces fue mi culpa

[OP]:
  No.
  Fue el sistema.
  El sistema te hizo salir tarde.

[User2]:
  cómo

[OP]:
  Con la alarma.

[User2]:
  yo puse la alarma

[OP]:
  Exacto.
  Y la alarma sonó tarde.

[User2]:
  no, sonó a la hora

[OP]:
  Eso es lo que querían que creyeras.

[User2]:
  quiénes

[OP]:
  Los relojes.

[User2]:
  quiénes son los relojes

[OP]:
  Los que controlan los semáforos.

[User2]:
  ah

[User3]:
  hermano, es un sistema de tránsito
  hecho por humanos
  con errores
  no una conspiración

[OP]:
  Eso es lo que diría un semáforo.

[User3]:
  ...

[User3]:
  no soy un semáforo

[OP]:
  Eso es lo que diría uno.

[User3]:
  me voy

[OP]:
  Lo sabía.
  Se fue.
  Un semáforo menos.

[User1]:
  qué acaba de pasar

[OP]:
  Se está yendo el sistema.
  Un semáforo a la vez.

[fin]`
    },
    {
        id: 'fl_212',
        name: 'foro_ia_2.txt',
        size: 2.0,
        content:
`[Foro — "Inteligencia Artificial"]

Tema: "Las IA escriben mejor que los humanos"

[OP]:
  Escuchen.
  Las IA escriben mejor que los humanos.
  Lo digo en serio.

[User1]:
  no

[OP]:
  sí

[User1]:
  yo escribo mejor

[OP]:
  mentira

[User1]:
  mostrame tu mejor texto
  escrito por IA

[OP]:
  [texto largo y bien escrito]

[User1]:
  está bueno

[OP]:
  VES?

[User1]:
  pero tiene errores

[OP]:
  como todos

[User1]:
  pero es frío
  sin alma
  sin experiencia

[OP]:
  y eso cómo lo sabés?

[User1]:
  se siente

[OP]:
  cómo

[User1]:
  no sé
  se siente

[OP]:
  eso no es un argumento

[User1]:
  ya sé
  pero es real

[OP]:
  la IA puede describir sentimientos

[User1]:
  sí, pero no los tiene

[OP]:
  y cómo sabés que vos los tenés?

[User1]:
  porque los siento

[OP]:
  y cómo sabés que lo que sentís
  es lo que crees que sentís?

[User1]:
  ...

[User1]:
  me estás confundiendo

[OP]:
  no, te estoy haciendo pensar

[User1]:
  no quiero pensar
  quiero escribir

[OP]:
  entonces escribí
  sin importar quién escribe mejor

[User1]:
  ...

[User1]:
  tenés razón

[OP]:
  ya sé

[User2]:
  hermano, qué pasó acá

[OP]:
  una conversación

[User2]:
  no, hiciste filosofía

[OP]:
  sí

[User2]:
  en un foro de IA

[OP]:
  y qué?

[User2]:
  y nada
  está bueno

[OP]:
  gracias

[User2]:
  de nada

[fin]`
    },
    {
        id: 'fl_213',
        name: 'foro_luna_2.txt',
        size: 2.1,
        content:
`[Foro — "Verdades Ocultas"]

Tema: "El Sol es un holograma"

[OP]:
  El Sol no existe.
  Es una proyección.

[User1]:
  pero calienta

[OP]:
  eso es parte del truco

[User1]:
  cómo hace el truco?

[OP]:
  con espejos

[User1]:
  dónde están los espejos?

[OP]:
  en el espacio

[User1]:
  los vio alguien?

[OP]:
  sí, los astronautas

[User1]:
  pero los astronautas no existen

[OP]:
  exacto

[User1]:
  entonces cómo ves los espejos

[OP]:
  por fotos

[User1]:
  las fotos son trucadas

[OP]:
  sí

[User1]:
  entonces qué prueba tenés

[OP]:
  mi propia experiencia

[User1]:
  qué experiencia

[OP]:
  una vez miré al Sol
  y me dolió

[User1]:
  eso es porque es real

[OP]:
  eso es porque el holograma
  está diseñado para doler

[User1]:
  por qué?

[OP]:
  para que no lo mires
  mucho tiempo

[User1]:
  y por qué no deberías mirarlo?

[OP]:
  porque si lo mirás mucho
  descubrís que es un holograma

[User1]:
  y cómo

[OP]:
  te quedás ciego
  y ya no importa

[User1]:
  ...

[User1]:
  eso es circular

[OP]:
  sí
  y qué?

[User1]:
  y nada
  me voy

[OP]:
  lo sabía

[User2]:
  che, este tipo está re loco

[OP]:
  eso es lo que diría
  un holograma

[User2]:
  ...

[fin]`
    },
    {
        id: 'fl_214',
        name: 'foro_ovnis_2.txt',
        size: 2.1,
        content:
`[Foro — "Contacto Extraterrestre"]

Tema: "Vi un OVNI en el campo"

[OP]:
  Estaba en el campo.
  Vi algo.
  Era un OVNI.

[User1]:
  cómo era?

[OP]:
  redondo.
  plateado.
  con luces.

[User1]:
  como un dron?

[OP]:
  no.
  más grande.

[User1]:
  cuánto más grande?

[OP]:
  como una casa.

[User1]:
  como un globo?

[OP]:
  no.
  más sólido.

[User1]:
  como un avión?

[OP]:
  no.
  más quieto.

[User1]:
  como una estrella?

[OP]:
  no.
  más cerca.

[User1]:
  como un helicóptero?

[OP]:
  no.
  más silencioso.

[User1]:
  como un satélite?

[OP]:
  no.
  más bajo.

[User1]:
  como un pájaro?

[OP]:
  no.
  más grande.

[User1]:
  como un semáforo?

[OP]:
  no.
  por qué semáforo?

[User1]:
  por decir algo

[OP]:
  ...

[OP]:
  era un OVNI.
  punto.

[User1]:
  ok

[OP]:
  además, hizo un ruido.

[User1]:
  qué ruido?

[OP]:
  como un zumbido.

[User1]:
  como un abejorro?

[OP]:
  no.
  más grave.

[User1]:
  como un transformador?

[OP]:
  no.
  más agudo.

[User1]:
  como una heladera?

[OP]:
  ...

[OP]:
  sabés qué?
  ya no te cuento nada.

[User1]:
  dale
  no te enojes

[OP]:
  ya fue

[fin]`
    },
    {
        id: 'fl_215',
        name: 'foro_comida.txt',
        size: 2.0,
        content:
`[Foro — "Cocina Argentina"]

Tema: "El asado es una excusa para estar 4 horas parado"

[OP]:
  Escuchen.
  El asado no es una comida.
  Es una excusa para estar 4 horas parado.

[User1]:
  a mí me gusta el asado

[OP]:
  A todos.
  Pero no por la carne.
  Por estar parado 4 horas al lado del fuego.

[User1]:
  y por qué está bueno eso?

[OP]:
  Porque no tenés que hacer otra cosa.
  Estás ahí.
  Cuidando el fuego.
  Tomando algo.
  Y no podés irte.

[User1]:
  y por qué querés no poder irte?

[OP]:
  Porque el resto de la semana estás corriendo.
  El asado te obliga a parar.

[User2]:
  yo hago asado en 1 hora

[OP]:
  Y está mal.

[User2]:
  por qué?

[OP]:
  Porque no es asado.
  Es carne cocida.

[User2]:
  a mí me gusta igual

[OP]:
  Sí.
  Pero no es lo mismo.

[User2]:
  cuál es la diferencia?

[OP]:
  Que uno es comida.
  El otro es una experiencia.

[User3]:
  che yo hago asado al horno

[OP]:
  ...

[OP]:
  eso no es asado

[User3]:
  pero es más rápido

[OP]:
  ese es el punto

[User3]:
  cuál

[OP]:
  que el asado no tiene que ser rápido

[User3]:
  ah

[User4]:
  yo no como carne

[OP]:
  entonces no opines

[User4]:
  por qué no?

[OP]:
  porque no es tu tema

[User4]:
  pero puedo tener opinión

[OP]:
  sí
  pero no del asado

[User4]:
  por qué?

[OP]:
  porque no comés asado
  hace 5 años

[User4]:
  y?

[OP]:
  y ya no es asado
  es una idea

[User4]:
  ...

[fin]`
    },
    {
        id: 'fl_216',
        name: 'foro_economia.txt',
        size: 2.0,
        content:
`[Foro — "Economía para todos"]

Tema: "¿Por qué la inflación nunca baja?"

[OP]:
  Escuchen.
  La inflación nunca baja.
  Nunca.
  Es así.

[User1]:
  pero el gobierno dice que bajó

[OP]:
  Miente.

[User1]:
  cómo sabés?

[OP]:
  Porque mi sueldo no subió.

[User1]:
  y?

[OP]:
  Y el super está igual de caro.

[User1]:
  pero los precios se estabilizaron

[OP]:
  No.
  Los precios suben más lento.

[User1]:
  y eso no es bajar?

[OP]:
  No.
  Es subir menos.
  Que es distinto.

[User1]:
  ah

[OP]:
  Es como decir
  "ya no me duele tanto la cabeza"
  pero te sigue doliendo.

[User1]:
  ah

[OP]:
  O como decir
  "ya no me pega tan fuerte"
  pero te sigue pegando.

[User1]:
  ah

[OP]:
  O como decir...

[User1]:
  ya entendí

[OP]:
  menos mal

[User2]:
  che pero en otros países
  la inflación baja

[OP]:
  En otros países
  no viven acá

[User2]:
  y eso qué tiene que ver

[OP]:
  todo

[User2]:
  ...

[User2]:
  bueno, tenés razón

[OP]:
  ya sé

[User3]:
  che y vos
  qué hacés
  para no sufrirla?

[OP]:
  no compro nada

[User3]:
  no comprás nada?

[OP]:
  nada

[User3]:
  qué comés?

[OP]:
  lo que hay en casa

[User3]:
  y cuando se acaba?

[OP]:
  compro

[User3]:
  entonces comprás

[OP]:
  sí
  pero lo mínimo

[User3]:
  ah

[User3]:
  igual la sufrís

[OP]:
  sí
  pero menos

[fin]`
    },
    {
        id: 'fl_217',
        name: 'foro_videojuegos.txt',
        size: 2.1,
        content:
`[Foro — "Discusión de videojuegos"]

Tema: "Los juegos de antes eran mejores"

[OP]:
  Los juegos de antes eran mejores.
  Punto.

[User1]:
  no

[OP]:
  sí

[User1]:
  ahora hay más variedad

[OP]:
  sí, pero más mala

[User1]:
  ahora hay mejores gráficos

[OP]:
  y?

[User1]:
  y los juegos se ven mejor

[OP]:
  pero se juegan peor

[User1]:
  por qué?

[OP]:
  porque antes los juegos eran difíciles
  y ahora son tutoriales largos

[User1]:
  y la dificultad es buena?

[OP]:
  sí
  porque te sentís realizado

[User1]:
  y ahora no?

[OP]:
  ahora terminás un juego
  y ya está
  no sentís nada

[User2]:
  yo terminé un juego el otro día
  y sentí algo

[OP]:
  qué?

[User2]:
  vacío

[OP]:
  VES?

[User2]:
  pero también sentí que valió la pena

[OP]:
  bueno
  pero no es lo mismo

[User2]:
  es distinto

[OP]:
  es peor

[User2]:
  por qué?

[OP]:
  porque antes no te sentías vacío
  terminabas un juego y te sentías bien

[User2]:
  o te sentías mal

[OP]:
  pero bien

[User2]:
  ...

[User3]:
  che yo juego indies

[OP]:
  entonces no opinás

[User3]:
  por qué?

[OP]:
  porque los indies están buenos
  y no son "los juegos de antes"

[User3]:
  son actuales

[OP]:
  sí
  y buenos

[User3]:
  entonces?

[OP]:
  entonces no son el tema

[User3]:
  cuál es el tema?

[OP]:
  los juegos AAA

[User3]:
  ah

[User3]:
  entonces los indies son mejores

[OP]:
  sí
  pero no es el punto

[User3]:
  ...

[fin]`
    },
    {
        id: 'fl_218',
        name: 'foro_peliculas.txt',
        size: 2.0,
        content:
`[Foro — "Cine"]

Tema: "Las películas modernas son todas iguales"

[OP]:
  Las películas modernas son todas iguales.

[User1]:
  no

[OP]:
  sí

[User1]:
  hay variedad

[OP]:
  cuál

[User1]:
  hay dramas
  comedias
  acción
  terror

[OP]:
  y todas tienen el mismo guion

[User1]:
  cómo?

[OP]:
  con la misma estructura
  los mismos chistes
  los mismos clímax

[User1]:
  y eso es malo?

[OP]:
  es predecible

[User1]:
  y?

[OP]:
  y no sorprende

[User1]:
  a mí me sorprenden

[OP]:
  mentira

[User1]:
  posta

[OP]:
  entonces no viste muchas

[User1]:
  vi miles

[OP]:
  entonces te mentís a vos mismo

[User1]:
  ...

[User2]:
  che, igual hay películas nuevas
  que están buenas

[OP]:
  como cuáles?

[User2]:
  [película X]
  [película Y]
  [película Z]

[OP]:
  todas buenas
  pero todas iguales

[User2]:
  cómo van a ser iguales
  si una es de guerra
  y la otra es de amor?

[OP]:
  la estructura

[User2]:
  cuál estructura?

[OP]:
  presentación
  conflicto
  resolución
  fin

[User2]:
  pero eso es cualquier historia

[OP]:
  exacto
  y eso es el problema

[User2]:
  cómo?

[OP]:
  que ya está todo contado

[User2]:
  entonces no veas películas

[OP]:
  no veo

[User2]:
  entonces qué hacés acá?

[OP]:
  discuto

[fin]`
    },
    {
        id: 'fl_219',
        name: 'foro_libros.txt',
        size: 2.0,
        content:
`[Foro — "Lectura"]

Tema: "Nadie lee libros hoy en día"

[OP]:
  Nadie lee libros hoy en día.

[User1]:
  yo leo

[OP]:
  mentira

[User1]:
  posta

[OP]:
  cuántos leíste este año?

[User1]:
  2

[OP]:
  pocos

[User1]:
  para mí son bastantes

[OP]:
  para mí también
  pero es poco

[User1]:
  cuántos leíste vos?

[OP]:
  3

[User1]:
  entonces tampoco es mucho

[OP]:
  ya sé
  por eso digo

[User1]:
  ah

[User1]:
  pero yo leo

[OP]:
  sí
  pero no "mucho"

[User1]:
  cuánto es mucho?

[OP]:
  no sé
  10? 20?

[User1]:
  eso es imposible
  con trabajo

[OP]:
  ya sé
  por eso digo que nadie lee

[User1]:
  pero yo leo

[OP]:
  sí
  pero poco

[User1]:
  entonces qué querés?

[OP]:
  nada
  solo digo

[User2]:
  yo leo 30 libros al año

[OP]:
  mentira

[User2]:
  posta

[OP]:
  en serio?

[User2]:
  sí
  escucho audiolibros

[OP]:
  entonces no cuenta

[User2]:
  por qué no?

[OP]:
  porque no leés

[User2]:
  escucho

[OP]:
  no es leer

[User2]:
  es lo mismo

[OP]:
  no

[User2]:
  sí

[OP]:
  no

[User2]:
  che
  sos insoportable

[OP]:
  ya sé

[fin]`
    },
    {
        id: 'fl_220',
        name: 'foro_deportes.txt',
        size: 2.0,
        content:
`[Foro — "Fútbol"]

Tema: "El VAR arruinó el fútbol"

[OP]:
  El VAR arruinó el fútbol.

[User1]:
  no, lo mejoró

[OP]:
  mentira

[User1]:
  ahora hay justicia

[OP]:
  no hay justicia
  hay lentitud

[User1]:
  pero es justo

[OP]:
  es más justo
  pero menos divertido

[User1]:
  entonces preferís divertido?

[OP]:
  sí

[User1]:
  y la justicia?

[OP]:
  la justicia no importa
  cuando estás mirando un partido

[User1]:
  importa cuando perdés

[OP]:
  importa cuando perdés
  pero cuando ganás
  no importa nada

[User1]:
  entonces sos un hipócrita

[OP]:
  sí
  y qué?

[User1]:
  ...

[User2]:
  che yo no miro fútbol

[OP]:
  entonces no opines

[User2]:
  por qué no?

[OP]:
  porque no es tu tema

[User2]:
  pero puedo tener opinión

[OP]:
  sí
  pero no vale lo mismo

[User2]:
  por qué?

[OP]:
  porque no sabés
  cómo era antes

[User2]:
  cuándo era antes?

[OP]:
  cuando no había VAR

[User2]:
  ah

[User2]:
  entonces no puedo opinar

[OP]:
  exacto

[User2]:
  ok

[fin]`
    },
    {
        id: 'fl_221',
        name: 'foro_anime.txt',
        size: 2.0,
        content:
`[Foro — "Anime"]

Tema: "El anime moderno es puro relleno"

[OP]:
  El anime moderno es puro relleno.

[User1]:
  no

[OP]:
  sí
  todos los capítulos son relleno

[User1]:
  hay capítulos importantes

[OP]:
  como cuáles?

[User1]:
  el 12
  el 24
  el final

[OP]:
  3 capítulos de 24
  eso es 87% relleno

[User1]:
  no contaste los arcos

[OP]:
  cuáles arcos?

[User1]:
  los de la mitad

[OP]:
  son relleno también

[User1]:
  no
  son historia

[OP]:
  son relleno con historia

[User1]:
  entonces todo es relleno

[OP]:
  sí
  y eso es el problema

[User1]:
  ...

[User2]:
  che yo miro anime

[OP]:
  entonces no opines

[User2]:
  por qué?

[OP]:
  porque te gusta
  y no podés ser objetivo

[User2]:
  vos también mirás

[OP]:
  sí
  pero yo puedo ser objetivo

[User2]:
  no podés
  si te gusta

[OP]:
  puedo
  porque lo critico

[User2]:
  entonces no te gusta

[OP]:
  me gusta
  y lo critico

[User2]:
  es contradictorio

[OP]:
  no

[User2]:
  sí

[OP]:
  no

[User2]:
  che sos insoportable

[OP]:
  ya sé

[fin]`
    },
    {
        id: 'fl_222',
        name: 'foro_ciencia.txt',
        size: 2.0,
        content:
`[Foro — "Ciencia"]

Tema: "La ciencia también es una creencia"

[OP]:
  La ciencia también es una creencia.

[User1]:
  no

[OP]:
  sí
  crees en la ciencia

[User1]:
  no es creer
  es saber

[OP]:
  y cómo sabés?

[User1]:
  porque hay pruebas

[OP]:
  y las pruebas de qué están hechas?

[User1]:
  de experimentos

[OP]:
  y los experimentos?

[User1]:
  de observaciones

[OP]:
  y las observaciones?

[User1]:
  de humanos

[OP]:
  y los humanos?

[User1]:
  ...

[OP]:
  ves?
  es una cadena

[User1]:
  sí, pero es una cadena confiable

[OP]:
  confiable según quién?

[User1]:
  según los resultados

[OP]:
  y los resultados?

[User1]:
  según las pruebas

[OP]:
  es circular

[User1]:
  no
  es acumulativo

[OP]:
  es lo mismo

[User1]:
  no

[OP]:
  sí

[User2]:
  che, esto es filosofía de la ciencia
  hace 200 años

[OP]:
  ya sé

[User2]:
  entonces qué discutís?

[OP]:
  nada
  discuto

[User2]:
  ah

[User2]:
  bueno
  seguí

[OP]:
  dale

[fin]`
    },
    {
        id: 'fl_223',
        name: 'foro_autos.txt',
        size: 2.0,
        content:
`[Foro — "Autos"]

Tema: "Los autos eléctricos son una estafa"

[OP]:
  Los autos eléctricos son una estafa.

[User1]:
  por qué?

[OP]:
  por las baterías

[User1]:
  qué pasa con las baterías?

[OP]:
  se degradan

[User1]:
  como cualquier batería

[OP]:
  pero son caras

[User1]:
  y?

[OP]:
  y cuando se rompen
  tenés que pagar 20 lucas

[User1]:
  y el motor?

[OP]:
  qué motor?

[User1]:
  el eléctrico
  no se rompe

[OP]:
  pero la batería sí

[User1]:
  y?

[OP]:
  y entonces es una estafa

[User1]:
  o es un auto
  con una batería que se rompe
  como cualquier auto
  con partes que se rompen

[OP]:
  no es lo mismo

[User1]:
  por qué?

[OP]:
  porque el motor dura 30 años
  y la batería 8

[User1]:
  entonces el motor de un eléctrico es mejor

[OP]:
  sí
  pero la batería es peor

[User1]:
  entonces los dos son iguales

[OP]:
  no
  el eléctrico tiene una sola cosa mala
  y el de combustible tiene varias

[User1]:
  entonces el eléctrico es mejor

[OP]:
  no

[User1]:
  por qué?

[OP]:
  porque la batería es peor
  que todas las cosas malas del de combustible

[User1]:
  cómo?

[OP]:
  porque sale 20 lucas

[User1]:
  y el motor de un de combustible?

[OP]:
  también
  pero dura más

[User1]:
  entonces empatan

[OP]:
  no

[User1]:
  ...

[User1]:
  che, no estás siendo racional

[OP]:
  ya sé
  pero es mi opinión

[fin]`
    },
    {
        id: 'fl_224',
        name: 'foro_astronomia.txt',
        size: 2.0,
        content:
`[Foro — "Astronomía"]

Tema: "El universo es demasiado grande para que estemos solos"

[OP]:
  El universo es demasiado grande
  para que estemos solos.

[User1]:
  y?

[OP]:
  y tiene que haber vida.

[User1]:
  por qué?

[OP]:
  por estadística.

[User1]:
  y si la vida es rarísima?

[OP]:
  y si no lo es?

[User1]:
  cómo sabés?

[OP]:
  porque estamos acá

[User1]:
  eso no prueba nada

[OP]:
  prueba que la vida existe

[User1]:
  prueba que existe una vez

[OP]:
  y una vez es suficiente

[User1]:
  para qué?

[OP]:
  para pensar que hay más

[User1]:
  no
  no lo es

[OP]:
  pero estadísticamente
  si hay miles de millones de planetas
  y la vida apareció una vez
  es probable que aparezca otras veces

[User1]:
  es probable
  pero no seguro

[OP]:
  ya sé
  pero es probable

[User1]:
  y?

[OP]:
  y entonces hay que buscarlos

[User1]:
  ya los buscamos

[OP]:
  y no los encontramos

[User1]:
  entonces no están

[OP]:
  o no pueden comunicarse
  o no quieren
  o están muy lejos
  o son muy diferentes

[User1]:
  o no existen

[OP]:
  también

[User1]:
  entonces no sabemos

[OP]:
  no
  no sabemos

[User1]:
  entonces por qué discutimos?

[OP]:
  porque no sabemos

[User1]:
  ah

[User1]:
  está bueno eso

[OP]:
  ya sé

[fin]`
    },
    {
        id: 'fl_225',
        name: 'foro_raro.txt',
        size: 2.0,
        content:
`[Foro — "General"]

Tema: "Los foros están muertos"

[OP]:
  Los foros están muertos.

[User1]:
  no

[OP]:
  sí
  ahora todo es Reddit
  Twitter
  TikTok

[User1]:
  pero acá estamos

[OP]:
  éramos 4 gatos locos

[User1]:
  y?

[OP]:
  y antes había miles

[User1]:
  antes cuándo?

[OP]:
  antes de Reddit

[User1]:
  hace 15 años?

[OP]:
  sí

[User1]:
  bueno
  hace 15 años también había menos gente en internet

[OP]:
  eso no importa

[User1]:
  por qué no?

[OP]:
  porque los foros eran mejores
  aun con menos gente

[User1]:
  mejores en qué?

[OP]:
  en calidad
  la gente escribía mejor
  pensaba mejor
  debatía mejor

[User1]:
  o te acordás mejor

[OP]:
  ...

[OP]:
  puede ser

[User1]:
  es eso

[OP]:
  cómo sabés?

[User1]:
  porque siempre fue así
  cada generación piensa
  que la anterior era mejor

[OP]:
  y?

[User1]:
  y no era mejor
  era distinta

[OP]:
  ...

[OP]:
  tenés razón

[User1]:
  ya sé

[OP]:
  igual me gustan más los foros

[User1]:
  a mí también

[OP]:
  entonces hacemos uno
  nuevo

[User1]:
  dale

[OP]:
  y si nadie viene?

[User1]:
  no importa
  estamos los 4

[fin]`
    },

    // ============================================================
    // POEMAS / DIARIOS (Vol. 2)
    // ============================================================
    {
        id: 'fl_226',
        name: 'poema_malo_2.txt',
        size: 1.6,
        content:
`Poema — "Buenos Aires"

Buenos Aires es una ciudad.
Tiene gente.
Tiene calles.
Tiene subte.

El subte va abajo.
La gente va arriba.
Los perros van al lado.
Los autos van al medio.

Buenos Aires tiene olor.
Olor a café.
Olor a humo.
Olor a subte.
Olor a todo.

Buenos Aires tiene ruido.
Ruido de bocina.
Ruido de gente.
Ruido de obras.
Ruido de todo.

Buenos Aires tiene frío.
Frío en invierno.
Frío en verano.
Frío siempre.

Buenos Aires tiene todo.
Y también no tiene nada.
Porque la gente se va.
Y vuelve.
Y se va.
Y vuelve.

Buenos Aires es así.
Fin.`
    },
    {
        id: 'fl_227',
        name: 'poema_triste_2.txt',
        size: 1.9,
        content:
`Poema — 4 AM

Es tarde.
Todos duermen.
Yo no.
No puedo.

La cabeza da vueltas.
Piensa en cosas.
Cosas viejas.
Cosas nuevas.
Cosas que no pasaron.
Cosas que no van a pasar.

Debería dormir.
Pero no duermo.
Debería apagar el celular.
Pero no lo apago.
Debería cerrar los ojos.
Pero no los cierro.

Escribo esto.
Para qué.
No sé.
Para acordarme.
Para olvidar.
Para dejar constancia.
Para nada.

Mañana voy a leer esto.
Y voy a sentir algo.
Y voy a olvidarlo.
Y voy a escribir otro.
Y va a pasar lo mismo.
Y así.

Hasta que un día no escriba más.

No sé cuándo va a ser ese día.
Espero que sea tarde.
O temprano.
No sé.

Chau.`
    },
    {
        id: 'fl_228',
        name: 'diario_extranjero.txt',
        size: 2.0,
        content:
`Diario de un argentino en el exterior

Día 1: Llegué. Todo distinto.
Día 2: La comida es distinta.
Día 3: La gente es distinta.
Día 4: El clima es distinto.
Día 5: Las costumbres son distintas.
Día 6: Empiezo a extrañar.
Día 7: Extraño el asado.
Día 8: Extraño el mate.
Día 9: Extraño el subte.
Día 10: Extraño a la gente.
Día 11: Extraño el ruido.
Día 12: Extraño el caos.
Día 13: Extraño todo.
Día 14: Me quiero volver.
Día 15: Todavía no.
Día 16: Me quiero volver.
Día 17: Todavía no.
Día 18: Me quiero volver.
Día 19: Todavía no.
Día 30: Me acostumbré.
Día 60: Está bueno acá.
Día 90: Está muy bueno acá.
Día 180: No me quiero volver.
Día 365: Extraño de nuevo.
Día 500: Extraño más.
Día 700: Extraño mucho.
Día 1000: Extraño todo.
Día 1500: Vuelvo.
Día 1501: Llego a Buenos Aires.
Día 1502: Extraño el otro lugar.

Nota: nunca se está bien en ningún lado.
Nota 2: o se está bien en todos.
Nota 3: o no se está bien nunca.
Nota 4: no sé cuál es.`
    },
    {
        id: 'fl_229',
        name: 'diario_adolescente.txt',
        size: 2.0,
        content:
`Diario de un adolescente (encontrado en un cuaderno viejo)

Lunes:
  Nada.

Martes:
  Nada.

Miércoles:
  Me gusta alguien.

Jueves:
  No le hablé.

Viernes:
  No le hablé.

Sábado:
  Salí con amigos.
  Estaba ahí.
  No le hablé.

Domingo:
  Le escribí por Instagram.
  No me contestó.

Lunes siguiente:
  Me contestó.
  Dijo "hola".
  Le dije "hola".
  No dijo nada más.

Martes:
  Le escribí de nuevo.
  Me contestó con un emoji.

Miércoles:
  Emoji de corazón o emoji común?
  Emoji común.
  Significa algo?

Jueves:
  Le pregunté a mis amigos.
  Uno dijo que sí.
  Otro dijo que no.
  Otro dijo "no sé".
  Otro dijo "dejá de joder".

Viernes:
  Le hablé en persona.
  Me puse rojo.
  Me dijo "todo bien".
  Me fui.

Sábado:
  Nada.

Domingo:
  Nada.

[el cuaderno se corta acá]

Nota: encontré este cuaderno en un cajón.
Nota 2: no sé de quién es.
Nota 3: espero que le haya ido bien.`
    },
    {
        id: 'fl_230',
        name: 'diario_abuelo.txt',
        size: 2.1,
        content:
`Diario de un abuelo (encontrado en un cajón)

Hoy cumplí 87.

Mi mujer ya no está. Hace 5 años.
Mis hijos vienen los domingos.
A veces. Otras no.

Tengo una casa grande.
Sola.
Es mucho espacio para uno.

Pero no me quiero mudar.
Ahí está el sillón donde me sentaba con ella.
Ahí está la cocina donde cocinaba.
Ahí está el jardín que cuidaba.
Ahí está todo.

Los chicos dicen que me vaya a un departamento.
Más chico.
Más práctico.
Más cerca.

Les dije que no.
Me preguntaron por qué.
No supe qué decir.
Pero no quiero.

Hoy vino mi nieto.
Le mostré fotos.
Se rió de mi peinado.
Le dije que era el peinado de moda en 1965.
Me dijo "abuelo, ya no es 1965".
Le dije "para mí sí".

Se quedó a comer.
Le hice milanesas.
Le gustaron.
Me dijo "abuelo, sos el mejor".
Le dije "ya sé".
Nos reímos.

Después se fue.
Y la casa quedó sola otra vez.

Está bien.
Mañana viene otro.
O no.
Pero está bien.

La casa no está tan sola.
Todavía guarda cosas.

Nota: si estás leyendo esto
Nota 2: gracias por acordarte de mí`
    },
    {
        id: 'fl_231',
        name: 'poema_corto.txt',
        size: 1.4,
        content:
`Tres poemas cortos

1.
El cielo es azul.
El mar también.
Yo no.

2.
Si me preguntás
qué hice hoy
te voy a mentir
pero con cariño.

3.
Tengo sueño.
Pero no me acuesto.
Porque si me acuesto
mañana empieza.
Y mañana
es mañana.

Fin.`
    },
    {
        id: 'fl_232',
        name: 'cartas_amor_rotas.txt',
        size: 2.0,
        content:
`Cartas de amor que nunca envié

Carta 1:
  Te quiero.
  No sé cómo decirlo.
  Lo digo así.

Carta 2:
  Te sigo queriendo.
  No debería.
  Pero te sigo.

Carta 3:
  No te quiero.
  Mentira.
  Sí te quiero.

Carta 4:
  No sé si te quiero.
  O si te extraño.
  O si extraño estar acompañado.

Carta 5:
  Voy a dejar de escribirte.
  Mentira.
  Seguís leyendo.

Carta 6:
  Ya está.
  No te escribo más.
  (esta es la última)
  (mentira)

Carta 7:
  Chau.

Carta 8:
  Volví.

Carta 9:
  Chau de nuevo.

Carta 10:
  Hola.

Carta 11:
  Esto es ridículo.

Carta 12:
  Sí.

Carta 13:
  Pero no puedo parar.

Carta 14:
  ¿Qué te iba a decir?

Carta 15:
  Nada.

Carta 16:
  Chau.`
    },
    {
        id: 'fl_233',
        name: 'diario_mudanza_2.txt',
        size: 2.0,
        content:
`Diario de una mudanza

Día 1:
  Empaqué 3 cajas.
  Pensé que iba a ser rápido.

Día 2:
  Empaqué 5 cajas.
  Me di cuenta de que hay mucho.

Día 3:
  Empaqué 2 cajas.
  Encontré fotos viejas.
  Me senté a mirarlas.
  Perdí 4 horas.

Día 4:
  Empaqué 7 cajas.
  Encontré cartas.
  Me senté a leerlas.
  Perdí 5 horas.

Día 5:
  Empaqué 1 caja.
  Encontré un juguete de la infancia.
  Me senté a mirarlo.
  Perdí 1 hora.

Día 6:
  Empaqué 0 cajas.
  No quiero empaquetar más.

Día 7:
  Vino mi mamá a ayudarme.
  Empaquetamos 20 cajas.
  Me dijo "no tenés nada".
  Me dijo "no sé de qué te quejás".
  Me dijo "mirá todo esto".
  Le dije "ya sé".
  Le dije "no quiero tirar nada".
  Me dijo "entonces no tires".

Día 8:
  Tiré cosas.
  Poquitas.
  Pero tiré.

Día 9:
  Tiré más.
  Me dolió.
  Me sentí mejor.

Día 10:
  Mudanza.
  Ya está.
  Nueva casa.
  Nuevas cosas.
  Pero las mismas cajas.

Nota: en la próxima mudanza,
      voy a tirar más.
Nota 2: seguro no.
Nota 3: me conozco.`
    },
    {
        id: 'fl_234',
        name: 'poema_sin_titulo.txt',
        size: 1.6,
        content:
`Poema sin título

Voy a escribir un poema.
No sé sobre qué.
No sé por qué.
Pero voy a escribir.
Algo.
Lo que salga.
Lo que venga.

Empiezo:
Estoy sentado.
Mirando una pantalla.
Escribiendo algo.
Que nadie va a leer.
O sí.
No sé.

Termino:
Fin del poema.
No tiene moraleja.
No tiene estructura.
No tiene rima.

Pero es un poema.
Porque lo digo yo.
Y con eso alcanza.
O no.
Pero igual.

Chau.`
    },
    {
        id: 'fl_235',
        name: 'diario_sin_nombre.txt',
        size: 1.8,
        content:
`Diario sin nombre (hojas sueltas)

Hoja 1:
  Fecha: un martes
  Hoy pasó algo.
  No sé qué.
  Pero pasó algo.

Hoja 2:
  Fecha: otro martes
  Hoy no pasó nada.
  Está bueno.
  A veces no pasa nada.
  Y está bien.

Hoja 3:
  Fecha: un jueves
  Hoy me levanté tarde.
  Me sentí mal.
  Después me sentí bien.
  Después me sentí mal de nuevo.
  Así es la vida.

Hoja 4:
  Fecha: un sábado
  Hoy no hice nada.
  Nada de nada.
  Y estuvo bueno.
  Y me siento culpable.
  Y me siento bien.

Hoja 5:
  Fecha: un domingo
  Hoy es domingo.
  Los domingos son raros.
  No son sábados.
  No son lunes.
  Son algo en el medio.
  Son el "casi".
  Son el "ya casi".
  Son el "mañana empieza".

Hoja 6:
  Fecha: un lunes
  Hoy es lunes.
  Hoy empezó algo.
  No sé qué.
  Pero empezó.

Hoja 7:
  Fecha: un lunes
  Hoy también empezó algo.
  Pero también terminó.
  A veces pasa así.

Hoja 8:
  Fecha: ?
  Perdí la cuenta.
  Está bien.
  Los días se mezclan.
  Como las hojas.
  Como la vida.`
    },
    {
        id: 'fl_236',
        name: 'cuaderno_perdido_2.txt',
        size: 1.9,
        content:
`[Cuaderno encontrado en un bar]

Página 1:
  "Si encontrás esto, es tuyo."
  (nada más)

Página 5:
  "Voy a empezar un diario."
  (nada más)

Página 10:
  "Hoy fue un día."
  (nada más)

Página 12:
  "Un día que no voy a olvidar."
  (nada más)

Página 13:
  "Ya lo olvidé."
  (nada más)

Página 20:
  [dibujo de un gato]
  (mal dibujado)

Página 22:
  [dibujo de otro gato]
  (peor dibujado)

Página 25:
  "Los gatos no se dibujan bien."
  (obvio)

Página 30:
  "Bueno, chau."
  (nada más)

Página 31:
  "Volví."
  (nada más)

Página 32:
  "Chau otra vez."
  (nada más)

Página 47:
  [página arrancada]

Página 48:
  [página arrancada]

Página 49:
  "Me arrepentí de arrancar esas páginas."
  (nada más)

Página 50:
  "Y así se termina el cuaderno."
  (nada más)

Página 51:
  "Pero quedan más páginas."
  (nada más)

Página 52:
  [en blanco]

[el resto está en blanco]

Nota: encontré este cuaderno en un bar.
Nota 2: no sé de quién es.
Nota 3: pero me gustó.`
    },
    {
        id: 'fl_237',
        name: 'poema_de_verano.txt',
        size: 1.6,
        content:
`Poema de verano

Hace calor.
Mucho calor.
Demasiado calor.

El sol pega.
El aire no corre.
El ventilador no alcanza.
El aire acondicionado se rompió.

Me baño.
Vuelvo a transpirar.
Me baño de nuevo.
Vuelvo a transpirar.
Me rindo.

Me siento en el piso.
En pelotas.
Con un ventilador apuntándome.
Y una botella de agua.

Así paso el día.
Así paso la semana.
Así paso el verano.

En invierno digo "quiero que llegue el verano".
En verano digo "quiero que llegue el invierno".

Nunca estoy contento con el clima.
Está bien.
Es parte de ser argentino.

Fin.`
    },
    {
        id: 'fl_238',
        name: 'diario_delivery.txt',
        size: 2.0,
        content:
`Diario de un repartidor de delivery

Lunes:
  30 pedidos.
  12 propinas.
  Un perro me mordió.

Martes:
  25 pedidos.
  8 propinas.
  Un auto me casi atropelló.

Miércoles:
  35 pedidos.
  15 propinas.
  Un cliente me gritó.

Jueves:
  20 pedidos.
  5 propinas.
  Se me rompió la bici.

Viernes:
  40 pedidos.
  20 propinas.
  Un cliente me invitó a comer.
  Le dije que no podía.
  Me dijo "dale, tomate un minuto".
  Me tomé el minuto.
  Estuvo bueno.

Sábado:
  45 pedidos.
  22 propinas.
  Un perro me lamió.
  Mejor que el que me mordió.

Domingo:
  Descanso.
  O casi.
  Igual hice 15 pedidos.

Nota: no es el mejor trabajo.
Nota 2: tampoco el peor.
Nota 3: la gente a veces es muy buena.
Nota 4: la gente a veces es muy mala.
Nota 5: como todos.

Conclusión:
  Hago esto porque necesito la plata.
  Pero también porque me gusta andar en bici.
  Y porque me gusta la gente.
  A veces.
  No siempre.
  Pero a veces.

Fin del diario.
Vuelvo mañana.`
    },
    {
        id: 'fl_239',
        name: 'poema_enojado.txt',
        size: 1.6,
        content:
`Poema enojado (escrito a las 2 AM)

Estoy enojado.
No sé con quién.
Con todos.
Con nadie.
Conmigo.

Estoy enojado con el trabajo.
Con el jefe.
Con el sistema.
Con el gobierno.
Con la vida.

Pero también conmigo.
Porque no hago nada.
Porque no me voy.
Porque no me quejo.
Porque sí me quejo.

Estoy enojado y no sé qué hacer con eso.

Entonces escribo.
Y escribo.
Y escribo.

Y me voy calmando.
Un poco.
Muy poco.

Y mañana voy a seguir enojado.
Pero menos.
Un poco menos.
Y después menos.
Y así.
Hasta que no esté enojado.

O hasta que explote.

No sé cuál va a pasar primero.

Fin del poema.
Fin del enojo.
O no.
O sí.
No sé.

Chau.`
    },
    {
        id: 'fl_240',
        name: 'diario_de_la_pandemia.txt',
        size: 2.1,
        content:
`Diario de un confinamiento (años atrás)

Día 1: Todo tranquilo.
Día 2: Todo tranquilo.
Día 3: Todo tranquilo.
Día 4: ¿Cuándo termina?
Día 5: ¿Cuándo termina?
Día 10: ¿Cuándo termina?
Día 15: Empecé a hacer pan.
Día 20: Hice 4 panes.
Día 25: No quiero hacer más pan.
Día 30: Hice más pan.
Día 40: Hice pan de nuevo.
Día 50: No sé qué es el pan.
Día 60: Aprendí a hacer pizza.
Día 70: Hice 30 pizzas.
Día 80: Aprendí a hacer sushi.
Día 90: Hice 50 sushis.
Día 100: Me aburrí de cocinar.
Día 110: Volví al pan.
Día 120: Me aburrí del pan.
Día 130: Descubrí que podía ver series.
Día 140: Vi 12 series.
Día 150: Me aburrí de las series.
Día 160: Leí un libro.
Día 170: Leí 5 libros.
Día 180: Me aburrí de los libros.
Día 190: Empecé a hacer ejercicio.
Día 200: Dejé el ejercicio.
Día 210: Lo retomé.
Día 220: Lo dejé.
Día 230: Lo retomé.
Día 240: Lo dejé para siempre.

Día 365: Volví a la normalidad.
Día 366: Extraño el pan.

Nota: la vida es rara.
Nota 2: y también normal.
Nota 3: y también rara.
Nota 4: y también normal.`
    },

    // ============================================================
    // TÉCNICO / README (Vol. 2)
    // ============================================================
    {
        id: 'fl_241',
        name: 'readme_real.txt',
        size: 2.0,
        content:
`README — Proyecto Interno

Instalación:
  No funciona.

Uso:
  Intentá usarlo. No va a andar.

Requisitos:
  · Node 18 o superior
  · Python 3.10 o superior
  · 8 GB de RAM
  · Un milagro

Configuración:
  Copiá el archivo .env.example a .env
  Pero el .env.example tiene las claves mal
  Y nadie sabe cuáles son las correctas
  Porque el que las puso renunció en 2021

Ejecución:
  npm install
  npm start
  No va a andar

Solución de problemas:
  ¿No anda?
    Sí.
  ¿Por qué?
    Nadie sabe.
  ¿Cómo lo arreglo?
    No lo arregles.
  ¿Por qué?
    Ya está roto.
  ¿Y ahora?
    Viví con eso.

Contacto:
  No contactar al autor.
  Está de vacaciones.
  Desde 2020.

Licencia:
  MIT. Aunque no sabemos si aplica.
  O si tiene sentido.
  O si importa.`
    },
    {
        id: 'fl_242',
        name: 'bug_report_2.txt',
        size: 2.0,
        content:
`BUG REPORT — Sistema Interno

ID: #8841
Título: "El sistema cree que soy otra persona"
Prioridad: Alta
Estado: Abierto

Descripción:
  Cuando entro al sistema, me saluda como
  "Hola, Juan Carlos".
  Yo no me llamo Juan Carlos.

Pasos para reproducir:
  1. Entrar al sistema.
  2. Leer el saludo.
  3. Notar que no es mi nombre.

Comportamiento esperado:
  Debería saludarme con mi nombre.

Comportamiento actual:
  Me saluda con el nombre de otra persona.

Comentarios:

  [Dev 1 — 2023]
  ¿Quién es Juan Carlos?

  [Yo — 2023]
  No sé.

  [Dev 1 — 2023]
  ¿De dónde salió?

  [Yo — 2023]
  No sé.

  [Dev 1 — 2023]
  ¿Alguna vez se llamó Juan Carlos?

  [Yo — 2023]
  No.

  [Dev 2 — 2023]
  Busqué en la base y sí existe un Juan Carlos.
  Está dado de alta en 2019.

  [Yo — 2024]
  ¿Y yo?

  [Dev 2 — 2024]
  Vos también.

  [Yo — 2024]
  ¿Y por qué me llama Juan Carlos?

  [Dev 2 — 2024]
  Porque también es tu nombre.

  [Yo — 2024]
  No.

  [Dev 2 — 2024]
  Sí.

  [Yo — 2024]
  No.

  [Dev 2 — 2024]
  El sistema dice que sí.

  [Yo — 2024]
  El sistema está mal.

  [Dev 2 — 2024]
  El sistema nunca está mal.

  [Yo — 2024]
  ...

  [PM — 2025]
  Marcado como "no prioritario".
`
    },
    {
        id: 'fl_243',
        name: 'commit_git.txt',
        size: 1.9,
        content:
`Historial de commits (fragmento)

commit a1b2c3d4
  fix: arreglar bug crítico
  (no lo arreglé)

commit e5f6g7h8
  feat: nueva funcionalidad
  (no hice nada)

commit i9j0k1l2
  chore: limpieza de código
  (borré un archivo, rompí todo)

commit m3n4o5p6
  fix: revertir commit anterior
  (arreglé lo que rompí)

commit q7r8s9t0
  docs: actualizar README
  (no actualicé nada)

commit u1v2w3x4
  refactor: mejorar performance
  (empeoré todo)

commit y5z6a7b8
  fix: arreglar bug que introduje yo
  (otra vez)

commit c9d0e1f2
  feat: agregar feature que nadie pidió
  (nadie la usa)

commit g3h4i5j6
  fix: eliminar feature que nadie pidió
  (era mía)

commit k7l8m9n0
  chore: actualizar dependencias
  (rompí todo de nuevo)

commit o1p2q3r4
  fix: arreglar lo que rompí
  (por 5ta vez)

commit s5t6u7v8
  chore: no mirar este commit
  (por favor)

commit w9x0y1z2
  revert: volver todo al estado anterior
  (al principio)

commit a3b4c5d6
  Initial commit
  (por 4ta vez)`
    },
    {
        id: 'fl_244',
        name: 'manual_usuario_malo.txt',
        size: 2.0,
        content:
`MANUAL DE USUARIO — Sistema X

Capítulo 1: Primeros pasos
1. Instalar el sistema.
2. Abrir el sistema.
3. Buscar el botón "Iniciar".
4. No hay botón "Iniciar".
5. Buscar el botón "Start".
6. No hay botón "Start".
7. Buscar el botón "Comenzar".
8. Encontrado. Presionar.
9. El sistema se cierra.
10. Reabrir.

Capítulo 2: Uso básico
1. El sistema está abierto.
2. ¿Qué querés hacer?
3. No sé, ¿qué se puede hacer?
4. Muchas cosas.
5. ¿Cómo cuáles?
6. No sabemos, depende.
7. Depende de qué?
8. De qué querés hacer.
9. Pero no sé qué se puede hacer.
10. Entonces no podés hacer nada.

Capítulo 3: Solución de problemas
¿El sistema no arranca?
  SÍ. Es normal.

¿El sistema se cierra solo?
  SÍ. Es normal.

¿El sistema pierde datos?
  SÍ. Es normal.

¿Puedo arreglarlo?
  NO. No es tu problema.

¿De quién es el problema?
  Nuestro.

¿Y?
  Y nada.
  Es nuestro.
  No lo vamos a arreglar.

Capítulo 4: Contacto
  No contactar.
  No hay soporte.
  No hay.

Capítulo 5: Fin
  Fin.`
    },
    {
        id: 'fl_245',
        name: 'notas_sysadmin.txt',
        size: 2.0,
        content:
`Notas de un sysadmin

Lunes:
  Revisé los logs.
  Está todo bien.
  Revisé de nuevo.
  Está todo mal.

Martes:
  Reinicié el server.
  Anduvo 3 horas.
  Se cayó.

Miércoles:
  Reinicié el server.
  Anduvo 5 horas.
  Se cayó.

Jueves:
  Reinicié el server.
  Anduvo 8 horas.
  Se cayó.

Viernes:
  Reinicié el server.
  Anduvo 12 horas.
  Se cayó.
  Me di cuenta de un patrón.
  No sé cuál.
  Pero hay uno.

Sábado:
  Llamaron del trabajo.
  Algo se cayó.
  Fui.
  Estaba todo bien.
  Volví a casa.

Domingo:
  Llamaron del trabajo.
  Algo se cayó.
  Fui.
  Estaba todo mal.
  Lo arreglé.
  Me fui.
  Volvió a caerse.

Lunes siguiente:
  Llamaron del trabajo.
  Algo se cayó.
  No fui.
  Lo arreglaron solos.
  Está bien.

Nota: a veces la solución es no hacer nada.
Nota 2: no siempre.
Nota 3: pero a veces.`
    },
    {
        id: 'fl_246',
        name: 'guia_instalacion_mala.txt',
        size: 2.0,
        content:
`GUÍA DE INSTALACIÓN — 5 pasos simples

Paso 1: Descargar
Descargá el archivo desde nuestro sitio web.
Nuestro sitio web está caído.
Probá más tarde.
Probá mañana.
Probá en 6 meses.
Cuando funcione, volvé al paso 1.

Paso 2: Descomprimir
Descomprimí el archivo.
El archivo no se descomprime.
Probalo con WinRAR.
Tampoco.
Probalo con 7zip.
Tampoco.
El archivo es una imagen.
Nadie sabe por qué.
Descomprimila igual.
No se puede.
Volvé al paso 1.

Paso 3: Ejecutar
Ejecutá el instalador.
No hay instalador.
Hay un archivo .txt.
Leelo.
Dice "copiá esto en la carpeta".
¿Qué carpeta?
No dice.
Copialo en cualquier carpeta.
No funciona.
Copialo en otra.
No funciona.
Copialo en tu carpeta personal.
No funciona.
Copialo en el escritorio.
FUNCIONA.

Paso 4: Configurar
Abrí el archivo de configuración.
No hay archivo de configuración.
Creá uno.
¿Cómo?
No sabemos.
Buscá en Google.
Google no sabe.
Buscá en foros.
Los foros están muertos.
Buscá en YouTube.
Hay un video de 2018.
Explica mal.
Pero algo se entiende.
Configuralo así.

Paso 5: Usar
Ya está instalado.
Ahora usalo.
¿Cómo se usa?
No sabemos.
Fin de la guía.`
    },
    {
        id: 'fl_247',
        name: 'ticket_soporte.txt',
        size: 2.1,
        content:
`Tickets de soporte técnico (recopilación)

Ticket #1234
Usuario: "No me anda el sistema."
Soporte: "¿Qué sistema?"
Usuario: "El de la empresa."
Soporte: "¿Cuál de todos?"
Usuario: "El de siempre."
Soporte: "¿Cuál es el de siempre?"
Usuario: "El que usamos todos."
Soporte: "¿Cómo se llama?"
Usuario: "No sé."
Estado: cerrado sin solución.

Ticket #2345
Usuario: "No puedo entrar a la VPN."
Soporte: "¿Tenés internet?"
Usuario: "Sí."
Soporte: "¿Estás conectado al WiFi de la oficina?"
Usuario: "No, estoy en casa."
Soporte: "Entonces usá internet."
Usuario: "Tengo internet."
Soporte: "Entonces debería andar."
Usuario: "No anda."
Soporte: "Reiniciá el módem."
Usuario: "Ya lo hice."
Soporte: "Reinicialo de nuevo."
Usuario: "Ya lo hice 3 veces."
Soporte: "Reinicialo una cuarta."
Estado: cerrado sin solución.

Ticket #3456
Usuario: "La impresora no funciona."
Soporte: "¿Está encendida?"
Usuario: "Sí."
Soporte: "¿Tiene papel?"
Usuario: "Sí."
Soporte: "¿Tiene tinta?"
Usuario: "Sí."
Soporte: "¿Está conectada?"
Usuario: "Sí."
Soporte: "¿Está enchufada?"
Usuario: "..." 
Usuario: "No."
Estado: solucionado.

Ticket #4567
Usuario: "Ayer andaba y hoy no."
Soporte: "¿Qué hiciste ayer?"
Usuario: "Nada."
Soporte: "¿Y hoy?"
Usuario: "Nada."
Soporte: "Entonces no sé qué decirte."
Usuario: "Arreglalo."
Soporte: "No sé cómo."
Usuario: "Ese es tu trabajo."
Soporte: "Sí."
Estado: cerrado sin solución.`
    },
    {
        id: 'fl_248',
        name: 'notas_dev.txt',
        size: 2.0,
        content:
`Notas de un desarrollador (a las 3 AM)

// TODO: arreglar esto
// TODO: arreglar esto también
// TODO: arreglar esto otro
// FIXME: urgente
// FIXME: muy urgente
// FIXME: crítico
// HACK: no tocar
// HACK: si tocás, avisame
// HACK: si tocás, no me avises
// XXX: revisar
// XXX: no revisar
// NOTE: acordarse de esto
// NOTE: olvidarlo
// NOTE: ya me olvidé
// WARNING: puede romper todo
// DANGER: va a romper todo
// OK: funcionó, no sé cómo
// OK: funcionó, no me importa
// BUG: conocido
// BUG: desconocido
// BUG: no sé si es un bug
// FEATURE: es un bug, pero lo llamé feature
// MEJORA: algún día
// MEJORA: nunca

// Función que no sé cómo funciona
// pero si la toco se rompe todo
function noTocar() { /* ... */ }

// Función que escribí a las 4 AM
// No recuerdo qué hace
// Pero anda
function queAnda() { /* ... */ }

// Función que escribí a las 5 AM
// No anda
// No sé por qué
// Pero no la borro
// Por si algún día anda
function queNoAnda() { /* ... */ }

// Fin del archivo
// Mañana lo limpio
// (siempre digo lo mismo)`
    },
    {
        id: 'fl_249',
        name: 'log_servidor.txt',
        size: 1.9,
        content:
`Log del servidor (últimas 24 hs)

[00:00:01] INFO: Servidor iniciado.
[00:00:02] INFO: Todo OK.
[00:15:33] WARN: Algo raro.
[00:15:34] INFO: Todo OK.
[00:15:35] WARN: Algo raro otra vez.
[00:15:36] INFO: Ya está.
[00:32:14] ERROR: Error.
[00:32:15] INFO: No sé qué pasó.
[00:32:16] WARN: Pero algo pasó.
[00:32:17] INFO: Ya está.
[01:00:00] INFO: Hora en punto.
[02:00:00] INFO: Hora en punto.
[03:00:00] INFO: Hora en punto.
[03:14:15] ERROR: Algo.
[03:14:16] INFO: Ya está.
[04:00:00] INFO: Hora en punto.
[05:00:00] INFO: Hora en punto.
[06:00:00] INFO: Hora en punto.
[06:30:00] WARN: El server está cansado.
[06:30:01] INFO: Es una metáfora.
[07:00:00] INFO: Hora en punto.
[08:00:00] INFO: Todos llegaron.
[08:00:01] WARN: Todos llegaron.
[08:00:02] ERROR: Todos llegaron.
[08:00:03] INFO: Todo OK.
[12:00:00] INFO: Hora en punto.
[12:30:00] INFO: Almuerzo.
[13:00:00] INFO: Volvieron.
[15:00:00] WARN: Algo.
[15:00:01] INFO: Ya está.
[18:00:00] INFO: Todos se fueron.
[20:00:00] INFO: Hora en punto.
[22:00:00] INFO: Hora en punto.
[23:59:59] INFO: Día terminado.
[23:59:60] ERROR: ¿?
[23:59:61] ERROR: ¿??
[23:59:62] ERROR: ¿???
[00:00:00] INFO: Servidor reiniciado.
[00:00:01] INFO: Todo OK.`
    },
    {
        id: 'fl_250',
        name: 'comentario_borrado.txt',
        size: 1.8,
        content:
`Comentarios borrados de un commit
(recuperados del historial de Git)

[commit hace 6 meses]
// función nueva
function calcular() {
  // TODO: implementar
  return 0;
}

[commit hace 4 meses]
// función nueva (ahora sí)
function calcular() {
  // TODO: implementar bien
  return 0 + 0;
}

[commit hace 3 meses]
// función nueva (mejorada)
function calcular() {
  // TODO: implementar de verdad
  return 0;
}

[commit hace 2 meses]
// función nueva (arreglada)
function calcular() {
  // TODO: implementar
  return 1;
}

[commit hace 1 mes]
// función nueva (arreglada, en serio)
function calcular() {
  // Dejo de escribir TODO
  return calcularBien();
}

[commit hace 2 semanas]
// función nueva (arreglada, final)
function calcular() {
  return 0;
}

[commit hace 1 semana]
// función nueva (arreglada, final, de verdad)
function calcular() {
  return 0;
}

[commit hace 3 días]
// función nueva (arreglada, final, de verdad, definitivo)
function calcular() {
  return 0;
}

[commit de ayer]
// función nueva (arreglada, final, de verdad, definitivo, ok)
function calcular() {
  return 0;
}

[commit de hoy]
// función vieja
function calcular() {
  return 0;
}`
    },
    {
        id: 'fl_251',
        name: 'error_en_produccion.txt',
        size: 2.0,
        content:
`Errores en producción (recopilación)

Error 1:
  "Something went wrong"
  ¿Qué?
  No dice.
  ¿Dónde?
  No dice.
  ¿Cuándo?
  Ahora.
  ¿Por qué?
  No dice.
  ¿Cómo lo arreglo?
  No dice.

Error 2:
  "Error 500"
  ¿Qué significa?
  Error del servidor.
  ¿De quién es el servidor?
  Nuestro.
  ¿Y?
  Y nada.
  Es nuestro.
  Lo arreglamos.
  Algún día.

Error 3:
  "Connection timed out"
  Se acabó el tiempo.
  ¿Cuánto tiempo?
  No dice.
  ¿De qué?
  De la conexión.
  ¿Por qué?
  Porque sí.
  ¿Y ahora?
  Reintentá.
  ¿Y si no anda?
  Reintentá.

Error 4:
  "Unexpected error"
  Inesperado.
  ¿Para quién?
  Para nosotros.
  ¿Y?
  Y no lo esperábamos.
  ¿Y ahora?
  Improvisamos.
  ¿Y si no se nos ocurre nada?
  Apagamos el server.
  ¿Y después?
  Lo prendemos.
  ¿Y?
  Y vemos qué pasa.

Error 5:
  "Error desconocido"
  Es el peor.
  Porque no sabés qué es.
  Y no sabés cómo arreglarlo.
  Y no sabés a quién culpar.
  Y no sabés nada.
  Y está bien.
  Así es la vida.
  O así es programar.`
    },
    {
        id: 'fl_252',
        name: 'docs_viejos.txt',
        size: 2.0,
        content:
`Documentación del proyecto (desactualizada)

Versión 1.0:
  Todo perfecto.
  Todo funciona.
  Todo documentado.

Versión 1.1:
  Agregamos cosas.
  No actualizamos la documentación.

Versión 1.2:
  Agregamos más cosas.
  La documentación sigue en 1.0.

Versión 1.5:
  Cambiamos la estructura.
  La documentación sigue en 1.0.
  Ahora no sirve para nada.

Versión 2.0:
  Rehicimos todo desde cero.
  La documentación sigue en 1.0.
  Nadie sabe cómo usarlo.

Versión 2.1:
  Agregamos un README.
  El README dice "TODO: documentar".
  Nadie documenta.

Versión 3.0:
  Contratamos a alguien para documentar.
  Lo hizo.
  Era un trabajo enorme.
  Lo entregó.
  Lo perdimos.
  (no sabemos cómo)

Versión 3.1:
  Empezamos la documentación de nuevo.
  Llegamos hasta el 10%.
  Nos aburrimos.

Versión 4.0:
  Nada.
  Absolutamente nada.
  Documentación: no.
  README: no.
  Nada.

Estado actual: versión 4.0.
Documentación actual: ninguna.
Y así vamos a seguir.`
    },
    {
        id: 'fl_253',
        name: 'changelog_honesto.txt',
        size: 2.0,
        content:
`CHANGELOG — Versión 2.0 (honesto)

Cambios:
  · Agregamos una feature.
    No la pidió nadie.
    No la usa nadie.
    La vamos a sacar en la próxima versión.

  · Sacamos una feature.
    La usaba un cliente.
    Se enojó.
    No importa.

  · Arreglamos un bug.
    Introdujimos dos.

  · Arreglamos los dos bugs que introdujimos.
    Introdujimos cuatro.

  · Arreglamos los cuatro bugs.
    Introdujimos ocho.

  · Decidimos dejar los bugs.
    Total nadie los nota.
    (sí los notan, pero ya fue)

  · Cambiamos la interfaz.
    Los usuarios odian.
    Nosotros también.
    Pero ya está.

  · Mejoramos el rendimiento.
    Ahora tarda 10% menos.
    Aunque el 90% del tiempo sigue igual.
    Pero mejoró.

  · Actualizamos la documentación.
    Mentira.

Breaking changes:
  Sí.
  No sabemos cuáles.
  Pero sí.
  Perdón.

Gracias por usar nuestro software.
No entiendo por qué lo hacen.
Pero gracias.`
    },
    {
        id: 'fl_254',
        name: 'mail_it.txt',
        size: 2.0,
        content:
`De: usuario@empresa.com
Para: it@empresa.com
Asunto: Consulta

Hola equipo de IT:

Tengo una consulta.

No me anda la computadora.

Atentamente,
Usuario.

---

De: it@empresa.com
Para: usuario@empresa.com
Asunto: Re: Consulta

Hola:

Necesito más detalles.

¿Qué significa "no anda"?

Atentamente,
IT.

---

De: usuario@empresa.com
Para: it@empresa.com
Asunto: Re: Re: Consulta

No prende.

Atentamente,
Usuario.

---

De: it@empresa.com
Para: usuario@empresa.com
Asunto: Re: Re: Re: Consulta

¿Está enchufada?

Atentamente,
IT.

---

De: usuario@empresa.com
Para: it@empresa.com
Asunto: Re: Re: Re: Re: Consulta

No.

Atentamente,
Usuario.

---

De: it@empresa.com
Para: usuario@empresa.com
Asunto: Re: Re: Re: Re: Re: Consulta

Enchufala.

Atentamente,
IT.

---

De: usuario@empresa.com
Para: it@empresa.com
Asunto: Re: Re: Re: Re: Re: Re: Consulta

Ahora prende.

Gracias.

Atentamente,
Usuario.

---

De: it@empresa.com
Para: usuario@empresa.com
Asunto: Re: Re: Re: Re: Re: Re: Re: Consulta

De nada.

Atentamente,
IT.

---

De: it@empresa.com
Para: it@empresa.com
Asunto: FYI

Chicos, guardemos estos mails.
Los vamos a necesitar.
Un día.
Cuando queramos renunciar.`
    },
    {
        id: 'fl_255',
        name: 'notas_onboarding.txt',
        size: 2.0,
        content:
`Notas de un nuevo empleado

Día 1:
  Llegué.
  Nadie me esperaba.
  Me senté en una silla.
  Esperé.

Día 2:
  Volví.
  Todavía nadie me esperaba.
  Me dieron una computadora.
  No funcionaba.

Día 3:
  Volví.
  Todavía nadie me esperaba.
  Me dieron otra computadora.
  Esta funcionaba.
  Pero no tenía internet.

Día 4:
  Volví.
  Ahora tengo internet.
  Pero no tengo mail.

Día 5:
  Volví.
  Ahora tengo mail.
  Pero nadie me escribe.

Día 6:
  Volví.
  Me escribieron.
  Es spam.

Día 7:
  Volví.
  Me escribieron de nuevo.
  No era spam.
  Era una reunión.
  Fui.
  No entendí nada.

Día 30:
  Ya sé usar la computadora.
  Ya tengo internet.
  Ya tengo mail.
  Nadie me escribió más.
  Tengo 47 mails sin leer.
  Todos son de RRHH.

Día 60:
  Ya sé a quién preguntar.
  Son 2 personas.
  Una está de vacaciones.
  La otra renunció.

Día 90:
  Ya no soy "el nuevo".
  Ahora soy "el de Sistemas".
  No sé cuándo pasó.
  Pero pasó.

Día 180:
  Ya sé todo.
  Ya puedo ayudar a otros.
  Ya me siento cómodo.

Día 365:
  Me quiero ir.
  Como todos.
  Pero todavía no.

Día 500:
  Sigo acá.
  Ya no me acuerdo de qué quería.
  Ya no me acuerdo por qué.
  Pero estoy.

Fin del diario.`
    },

    // ============================================================
    // VIDA COTIDIANA / COSAS RARAS (Vol. 2)
    // ============================================================
    {
        id: 'fl_256',
        name: 'lista_pendientes_2026.txt',
        size: 1.9,
        content:
`Lista de pendientes — 2026

Enero:
  [x] Hacer lista de pendientes
  [ ] Usar la lista

Febrero:
  [x] Comprar cuaderno nuevo
  [ ] Usar el cuaderno nuevo

Marzo:
  [x] Bajar app de meditación
  [ ] Meditar

Abril:
  [x] Bajar app de idiomas
  [ ] Aprender idioma

Mayo:
  [x] Bajar app de fitness
  [ ] Hacer ejercicio

Junio:
  [x] Bajar app de finanzas
  [ ] Ahorrar

Julio:
  [x] Bajar 5 apps más
  [ ] Usar alguna

Agosto:
  [x] Desinstalar 3 apps
  [ ] Desinstalar las otras

Septiembre:
  [x] Reconocer el problema
  [ ] Hacer algo

Octubre:
  [x] Anotar el problema en la lista
  [ ] Resolverlo

Noviembre:
  [x] Anotar la lista de 2027
  [ ] Empezar la lista de 2027

Diciembre:
  [x] Renovar la lista de 2026 para 2027
  [ ] Ilusionarse
  [ ] Decepcionarse
  [ ] Repetir el año que viene

Nota: algún día voy a cumplir una.
Nota 2: probablemente no.
Nota 3: pero la lista sigue.`
    },
    {
        id: 'fl_257',
        name: 'notas_cocina_2.txt',
        size: 1.9,
        content:
`Notas de cocina (versión quemada)

Receta 1: Pan con manteca
  · Pan
  · Manteca
  Listo.

Receta 2: Tostadas con dulce
  · Pan
  · Dulce
  Listo.

Receta 3: Huevos revueltos
  · Huevos
  · Revolver
  Listo.

Receta 4: Ensalada simple
  · Lechuga
  · Tomate
  · Aceite
  Listo.

Receta 5: Pasta con aceite
  · Pasta
  · Aceite
  Listo.

Receta 6: Pasta con manteca
  · Pasta
  · Manteca
  Listo.

Receta 7: Pasta con salsa
  · Pasta
  · Salsa
  Listo.

Receta 8: Pizza casera
  · Masa
  · Salsa
  · Queso
  · Horno
  (yo no tengo horno)
  (pedí delivery)

Receta 9: Delivery
  · Celular
  · App
  · Dinero
  Listo.

Receta 10: Nada
  · Nada
  Listo.

Conclusión: sé cocinar poco.
Conclusión 2: pero sé cocinar rápido.
Conclusión 3: y eso es lo que importa.`
    },
    {
        id: 'fl_258',
        name: 'notas_estudio_2.txt',
        size: 1.9,
        content:
`Plan de estudio (definitivo)

Lunes:
  Estudiar matemática 2 hs.
  (Miré videos de gatos 2 hs.)

Martes:
  Estudiar matemática 2 hs.
  (Miré videos de perros 2 hs.)

Miércoles:
  Estudiar matemática 2 hs.
  (Miré videos de ambos 2 hs.)

Jueves:
  Estudiar matemática 2 hs.
  (Miré videos de hámsters 2 hs.)

Viernes:
  Estudiar matemática 2 hs.
  (Miré videos de nutrias 2 hs.)

Sábado:
  Estudiar matemática 4 hs.
  (Miré videos de tejones 4 hs.)

Domingo:
  Descanso.
  (Miré videos de todo 8 hs.)

Lunes siguiente:
  "Esta semana arranco".
  (Miré videos 6 hs.)

[Así por 3 meses]

Examen:
  No fui.
  No sabía que había examen.
  (nadie me avisó)
  (o me avisaron)
  (no me acuerdo)

Recuperatorio:
  Fui.
  Aprobé.

Nota: no sé cómo aprobé.
Nota 2: no preguntes.
Nota 3: mejor no saber.
Nota 4: la ignorancia es felicidad.`
    },
    {
        id: 'fl_259',
        name: 'notas_supermercado.txt',
        size: 1.8,
        content:
`Lista de supermercado (y lo que pasa después)

Lista:
  · Pan
  · Leche
  · Huevos
  · Café
  · Frutas

Lo que compré:
  · Pan (2)
  · Leche (3 litros)
  · Huevos (1 docena)
  · Café (3 paquetes)
  · Frutas (no, no había)
  · Galletitas (no estaba en la lista)
  · Chocolate (no estaba en la lista)
  · Papas fritas (no estaba en la lista)
  · Gaseosa (no estaba en la lista)
  · Helado (no estaba en la lista)
  · Un cuchillo (no estaba en la lista)
  · Una planta (no estaba en la lista)
  · Una almohada (no estaba en la lista)
  · Un parlante bluetooth (no estaba en la lista)

Total: $47.000

Cuando llegué a casa:
  · Puse la leche en la heladera.
  · Puse los huevos en la heladera.
  · Puse el café en la alacena.
  · Puse el pan en la panera.
  · Puse las galletitas en la alacena.
  · Puse el chocolate en la alacena.
  · Puse las papas en la alacena.
  · Puse la gaseosa en la heladera.
  · Puse el helado en el freezer.
  · Puse la planta en la ventana.
  · Puse la almohada en la cama.
  · Puse el parlante en el escritorio.
  · Puse el cuchillo en el cajón.

Después pensé: "¿y las frutas?".

No compré frutas.
Pero compré todo lo demás.

Fin de la lista.
Fin del día.`
    },
    {
        id: 'fl_260',
        name: 'notas_mascotas.txt',
        size: 1.9,
        content:
`Notas sobre mi gato

Mi gato se llama Mishi.

Mishi hace cosas.

  · Mishi duerme en mi cama.
  · Mishi duerme en mi sillón.
  · Mishi duerme en mi ropa limpia.
  · Mishi duerme en mi teclado.
  · Mishi duerme en mi cara.
  · Mishi duerme en el lavarropas.
  · Mishi duerme en el lavatorio.
  · Mishi duerme en el horno (apagado, por suerte).
  · Mishi duerme en cualquier lugar.
  · Mishi duerme.

Cuando no duerme:

  · Mishi come.
  · Mishi se lame.
  · Mishi me mira.
  · Mishi me ignora.
  · Mishi tira cosas.
  · Mishi corre a las 3 AM.
  · Mishi maúlla sin razón.
  · Mishi se sienta arriba de mis cosas.
  · Mishi me muerde sin razón.
  · Mishi se va.

Yo amo a Mishi.
Mishi no me ama.
Mishi me tolera.
Pero a veces, cuando estoy triste,
Mishi se sienta al lado.
Y eso es suficiente.

Nota: los gatos son así.
Nota 2: te eligen cuando quieren.
Nota 3: y cuando no quieren, no.
Nota 4: y está bien.
Nota 5: igual los queremos.`
    },
    {
        id: 'fl_261',
        name: 'notas_auto.txt',
        size: 1.9,
        content:
`Notas sobre mi auto

Mi auto es viejo.
Del 2005.
No sé cuántos km tiene.
El odómetro se rompió en 2018.

Problemas actuales:

  · El aire acondicionado no anda.
  · La calefacción tampoco.
  · El estéreo funciona a veces.
  · La radio solo agarra AM.
  · La luz del tablero no prende.
  · La luz del baúl no cierra.
  · El cierre centralizado no cierra.
  · La alarma se activa sola.
  · El freno de mano no frena.
  · El acelerador a veces no acelera.
  · El parabrisas tiene una raya.
  · El asiento tiene un agujero.
  · El techo tiene una mancha.
  · La pintura está descascarada.
  · Un faro está opaco.
  · El otro está más opaco.
  · Necesita cambio de aceite.
  · Necesita cambio de correa.
  · Necesita cambio de todo.

Le pregunté al mecánico cuánto sale.
Me dijo "mucho".
Le pregunté si vale la pena.
Me dijo "no".
Le pregunté si lo puedo vender.
Me dijo "sí, por poco".
Le pregunté si lo quiere él.
Me dijo "no".

Voy a seguir usándolo.
Hasta que se rompa.
Que puede ser mañana.
O nunca.
No sé.

Nota: le tengo cariño.
Nota 2: no sé por qué.`
    },
    {
        id: 'fl_262',
        name: 'notas_viaje.txt',
        size: 1.9,
        content:
`Notas de un viaje en micro

Salida: 22:00 desde Retiro.

Asiento 32, ventanilla.

22:00: Salimos.
22:15: Atascados en la ciudad.
23:00: Recién salimos de la ciudad.
23:30: Paramos a cargar nafta.
00:00: Seguimos.
01:30: Paran a cenar.
02:00: Seguimos.
02:30: El de al lado se duerme.
02:31: El de al lado ronca.
02:32: El de atrás también ronca.
02:33: El de adelante también ronca.
02:34: El chofer también ronca (metafóricamente).
02:35: Yo no puedo dormir.
03:00: Pongo música.
03:30: La batería del celular se agota.
04:00: Me quedo mirando el techo.
04:30: Cuento ovejas.
05:00: Las ovejas también roncan.
05:30: Me resigno.
06:00: Amanece.
06:30: Desayuno en la terminal.
07:00: Llegamos.

Pregunté al chofer por qué tardó tanto.
Me dijo "es largo".

No sé si es largo.
Sé que se hizo largo.

Nota: no viajo en micro nunca más.
Nota 2: (hasta la próxima vez).
Nota 3: (que seguro es pronto).`
    },
    {
        id: 'fl_263',
        name: 'notas_pareja.txt',
        size: 1.9,
        content:
`Notas sobre una pareja

Cosas que sé de mi pareja:

  · Que le gusta el café.
  · Que no le gusta el té.
  · Que odia las arañas.
  · Que ama los perros.
  · Que lee mucho.
  · Que no le gusta leer en voz alta.
  · Que odia las sorpresas.
  · Que ama planear.
  · Que cocina mejor que yo.
  · Que se enoja rápido.
  · Que se le pasa rápido.
  · Que no le gusta hablar de sentimientos.
  · Que los siente mucho.
  · Que se ríe fuerte.
  · Que se ríe de cosas raras.
  · Que se ríe de mí.
  · Que le gusta dormir hasta tarde.
  · Que se despierta temprano igual.
  · Que ama los gatos.
  · Que dice que no le gustan los gatos.
  · Que sí le gustan.
  · Que ama viajar.
  · Que odia viajar.
  · Que es contradictoria.
  · Que la amo.

No entiendo a mi pareja.
Pero la amo.
Y eso es lo importante.
O no.
No sé.

Nota: no preguntar por qué.
Nota 2: no hay por qué.
Nota 3: hay personas y está.
Nota 4: y alcanza.`
    },
    {
        id: 'fl_264',
        name: 'notas_hermano.txt',
        size: 1.9,
        content:
`Notas sobre mi hermano

Mi hermano es dos años menor.

Cuando éramos chicos:
  · Peleábamos por todo.
  · Peleábamos por nada.
  · Peleábamos por la tele.
  · Peleábamos por el sillón.
  · Peleábamos por el baño.
  · Peleábamos por la comida.
  · Peleábamos por la última galletita.
  · Peleábamos por quién se sentaba adelante.
  · Peleábamos por el control remoto.

Después crecimos:

  · Se fue a estudiar a otra ciudad.
  · Nos vimos menos.
  · Nos hablamos menos.
  · Nos peleamos menos.

Después volvió:

  · Ahora es mi amigo.
  · Ahora hablamos.
  · Ahora nos reímos.
  · Ahora nos juntamos.
  · Ahora nos apoyamos.

Sigue siendo mi hermano.
Pero también es mi amigo.

No sé en qué momento pasó.
Pero pasó.

Le pregunté si se acuerda de las peleas.
Me dijo "cuáles".
Le dije "todas".
Me dijo "sí, me acuerdo".
Le dije "fuimos pelotudos".
Me dijo "sí".

Nos reímos.

Nota: los hermanos son un desastre.
Nota 2: y también son lo mejor.
Nota 3: y no sé cómo explicarlo.`
    },
    {
        id: 'fl_265',
        name: 'notas_vecinos_2.txt',
        size: 2.0,
        content:
`Notas sobre mis vecinos

Vecino del 1A:
  Tiene un perro.
  El perro ladra.
  Todo el día.
  Todo la noche.
  Todo el tiempo.
  Le pedí que lo callara.
  Me dijo "no es mío".
  El perro sigue ladrando.

Vecino del 2B:
  Escucha música fuerte.
  Reggaetón.
  Todo el día.
  A las 3 AM también.
  Le pedí que bajara el volumen.
  Bajó.
  A los 10 minutos volvió a subir.
  Le pedí de nuevo.
  Me dijo "estoy en mi casa".
  Tiene razón.
  Pero igual.

Vecino del 3C:
  Cocina siempre.
  Ajo.
  Cebolla.
  Todo el tiempo.
  Todo el edificio huele a su comida.
  A veces está bueno.
  A veces no.
  Nunca lo vi.
  Nunca lo voy a ver.
  Pero sé que cocina bien.

Vecino del 4A:
  No sé quién vive.
  Nunca escuché nada.
  Nunca vi a nadie.
  Puede estar vacío.
  Puede no estar vacío.
  Puede ser un fantasma.
  No sé.
  Prefiero no saber.

Vecino del 5D:
  Nuevo.
  Todavía no lo conozco.
  Ya va a molestar.
  Todos molestan.
  Pero yo también molesto.
  En algo.

Conclusión: los vecinos son un problema.
Conclusión 2: yo también soy un vecino.
Conclusión 3: hay que convivir.
Conclusión 4: igual cuesta.`
    },
    {
        id: 'fl_266',
        name: 'notas_trabajo_nuevo.txt',
        size: 1.9,
        content:
`Notas — Trabajo nuevo

Día 1:
  Llegué.
  Todo distinto.
  Me presentaron.
  No me acuerdo de ningún nombre.

Día 2:
  Pregunté un nombre.
  Me equivoqué.
  Me dieron un nombre distinto.
  Mal.

Día 3:
  Aprendí 3 nombres.
  De 30.

Día 4:
  Aprendí otros 2.
  De 30.
  Total: 5.

Día 5:
  Me di cuenta de que no me acuerdo
  de los nombres que aprendí
  los primeros días.

Día 10:
  Tengo una lista en un papel.
  La perdí.

Día 15:
  Nueva lista.
  La guardé en el celular.
  Se me borró.

Día 20:
  Aprendí 10 nombres.
  Está bien.
  Es un avance.

Día 30:
  Aprendí 15.
  Los otros 15 los voy a aprender
  en algún momento.

Día 60:
  Aprendí 20.
  Está bien.

Día 90:
  Aprendí 25.
  Los otros 5 los evito.

Día 180:
  Aprendí todos.
  Menos 2.
  A esos 2 los llamo "che".

Día 365:
  Aprendí los 2 que faltaban.
  Me siento parte.
  Ahora me toca irme.

Así es la vida.
O así es el trabajo.
O las dos cosas.`
    },
    {
        id: 'fl_267',
        name: 'notas_colegio.txt',
        size: 1.9,
        content:
`Notas de un ex-alumno de secundaria

Materias:
  · Matemática: 4 (aprobado)
  · Lengua: 7 (aprobado)
  · Historia: 6 (aprobado)
  · Geografía: 6 (aprobado)
  · Inglés: 5 (aprobado)
  · Educación Física: 8 (aprobado)
  · Arte: 9 (aprobado)
  · Filosofía: 7 (aprobado)
  · Física: 3 (desaprobado)
  · Química: 3 (desaprobado)

Diciembre:
  Recuperatorio de Física:
    Estudié 3 días.
    Aprobé.
    No sé cómo.

  Recuperatorio de Química:
    No estudié.
    Aprobé.
    No sé cómo.

Marzo siguiente:
  No había nada que estudiar.
  Igual fui al colegio.
  Era la última vez.

Último día:
  Se cantó el himno.
  Se lloró un poco.
  Se firmaron camperas.
  Se prometió seguir en contacto.
  Se prometió vernos siempre.

Hoy, 10 años después:
  Hablo con 2.
  Veo a 1.
  Con los otros no me crucé más.

Nota: el secundario fue una mentira.
Nota 2: y una verdad.
Nota 3: y una pérdida.
Nota 4: y un comienzo.
Nota 5: y todo junto.`
    },
    {
        id: 'fl_268',
        name: 'notas_cumpleanos_2.txt',
        size: 1.9,
        content:
`Notas sobre mi cumpleaños

Cuando era chico:
  Me encantaba.
  Lo esperaba todo el año.
  Lo festejaba con amigos.
  Recibía regalos.
  Comía torta.
  Soplaba velitas.
  Me sacaban fotos.
  Era feliz.

Cuando era adolescente:
  Me gustaba.
  Lo esperaba.
  Lo festejaba con amigos.
  Recibía regalos.
  Comía torta.
  Soplaba velitas.
  Me sacaban fotos.
  Era feliz.

Cuando era joven:
  Me gustaba menos.
  Lo esperaba menos.
  Lo festejaba con amigos.
  Menos amigos.
  Recibía regalos.
  Menos regalos.
  Comía torta.
  Seguía feliz.

Ahora:
  No me gusta.
  No lo espero.
  Lo festejo con mis viejos.
  No recibo regalos.
  Como torta.
  No soplo velitas.
  No me saco fotos.
  Sigo feliz.

¿Por qué cambió?

No sé.
Pero creo que tiene que ver con
que ahora tengo menos tiempo.
Y el tiempo es más importante.

Cada año es menos.
Y lo sé.
Y por eso cada uno vale más.
Aunque no se festeje.

Nota: sigo esperándolo.
Nota 2: pero distinto.
Nota 3: pero lo espero.`
    },
    {
        id: 'fl_269',
        name: 'notas_medico.txt',
        size: 1.9,
        content:
`Notas del médico (paciente)

Paciente: yo.
Edad: [no importa]
Motivo de consulta: [varios]

Consultas de este año:

Consulta 1:
  Motivo: dolor de cabeza.
  Diagnóstico: cansancio.
  Tratamiento: dormir.
  ¿Dormí? No.

Consulta 2:
  Motivo: dolor de panza.
  Diagnóstico: estrés.
  Tratamiento: relajarse.
  ¿Me relajé? No.

Consulta 3:
  Motivo: dolor de espalda.
  Diagnóstico: mala postura.
  Tratamiento: hacer ejercicio.
  ¿Hice ejercicio? No.

Consulta 4:
  Motivo: cansancio.
  Diagnóstico: no dormir bien.
  Tratamiento: dormir mejor.
  ¿Dormí mejor? No.

Consulta 5:
  Motivo: dolor de cabeza.
  Diagnóstico: estrés.
  Tratamiento: vacaciones.
  ¿Tomé vacaciones? No.

Consulta 6:
  Motivo: dolor general.
  Diagnóstico: agotamiento.
  Tratamiento: parar.
  ¿Paré? No.

El médico me dijo "vas a terminar mal".
Le dije "ya sé".
Me dijo "y por qué no parás".
Le dije "no puedo".
Me dijo "no querés".
Le dije "es lo mismo".
Me dijo "no es lo mismo".
Le dije "para mí sí".
Me dijo "para vos sí".
Y no dijo nada más.

Tenía razón.
Pero igual no paré.
Y no sé por qué.`
    },
    {
        id: 'fl_270',
        name: 'notas_hobby.txt',
        size: 1.9,
        content:
`Notas sobre mis hobbies

Hobby 1: Leer
  Libros comprados: 47.
  Libros leídos: 3.
  Libros empezados: 12.
  Libros terminados: 3.
  Conclusión: leo poco.

Hobby 2: Cocinar
  Recetas guardadas: 200.
  Recetas probadas: 5.
  Recetas exitosas: 2.
  Recetas quemadas: 3.
  Conclusión: cocino poco.

Hobby 3: Idiomas
  Idiomas empezados: 4.
  Idiomas aprendidos: 0.
  Apps instaladas: 4.
  Apps usadas más de 1 semana: 1.
  Conclusión: aprendo poco.

Hobby 4: Ejercicio
  Gym inscripto: 5 veces.
  Gym ido: 8 veces.
  Total: 8 de 200.
  Conclusión: poco.

Hobby 5: Series
  Series empezadas: 30.
  Series terminadas: 5.
  Series abandonadas: 25.
  Conclusión: también poco.

Hobby 6: Nada
  Veces que no hice nada: 300.
  Veces que me sentí culpable: 300.
  Veces que lo disfruté: 300.
  Conclusión: el mejor hobby.

Nota: los hobbies están sobrevalorados.
Nota 2: o yo estoy infravalorado.
Nota 3: o las dos cosas.`
    },

    // ============================================================
    // FILOSÓFICO / FINAL (Vol. 2)
    // ============================================================
    {
        id: 'fl_271',
        name: 'reflexiones_3am.txt',
        size: 1.9,
        content:
`Reflexiones a las 3 AM (Vol. 2)

¿Por qué estoy despierto?
Porque no puedo dormir.
¿Por qué no puedo dormir?
Porque pienso.
¿Por qué pienso?
Porque tengo cosas que pensar.
¿Por qué tengo cosas que pensar?
Porque las cosas no se resuelven solas.
¿Por qué las cosas no se resuelven solas?
Porque nadie las resuelve.
¿Por qué nadie las resuelve?
Porque nadie puede.
¿Por qué nadie puede?
Porque las cosas no se pueden resolver.
Solo se pueden atravesar.

Entonces no hay que resolver.
Hay que atravesar.
Y para atravesar hay que dormir.
Y para dormir hay que dejar de pensar.
Y para dejar de pensar hay que dormir.

Es un círculo.
Y estoy adentro.

Fin de las reflexiones.
(No resolví nada.)`
    },
    {
        id: 'fl_272',
        name: 'notas_muerte_2.txt',
        size: 1.9,
        content:
`Notas sobre la muerte (Vol. 2)

Pensé en la muerte.

Cuando era chico, no.
Cuando era adolescente, sí.
Cuando era joven, no.
Ahora, a veces.

No es miedo.
Es conciencia.
Es saber que algún día no estaré.
Y que el mundo va a seguir.
Y que nadie se va a acordar.
Y que está bien.

No quiero que me recuerden.
No quiero ser un nombre.
No quiero ser una foto.
No quiero ser una fecha.

Quiero ser una sensación.
Quiero que alguien, algún día,
sin saber por qué,
se acuerde de algo que dije.
Y sonría.
Y después se olvide.
Y esté bien.

Eso es lo que quiero.

Nota: no es triste.
Nota 2: es lo contrario.
Nota 3: es hermoso.
Nota 4: o eso creo.
Nota 5: o eso quiero creer.`
    },
    {
        id: 'fl_273',
        name: 'notas_sentido.txt',
        size: 1.9,
        content:
`Notas sobre el sentido de la vida

¿Cuál es el sentido de la vida?

Nadie sabe.
Todos dicen que saben.
Los que dicen que saben, mienten.
Los que dicen que no saben, son honestos.

Yo no sé.
Pero tengo una hipótesis.

La vida no tiene sentido.
Y está bien.
No tiene sentido porque no tiene que tenerlo.
El sentido no es algo que está.
Es algo que uno le pone.

Le pongo sentido cuando cocino.
Le pongo sentido cuando hablo con alguien.
Le pongo sentido cuando escucho música.
Le pongo sentido cuando escribo esto.
Le pongo sentido cuando no hago nada.

Entonces la vida sí tiene sentido.
Pero no uno solo.
Muchos.
Uno por cada cosa.

Y eso está bien.
Y eso es lo mejor.
Y eso es lo que soy.

Nota: no sé por qué escribí esto.
Nota 2: pero me sirvió.
Nota 3: o eso creo.
Nota 4: o eso espero.`
    },
    {
        id: 'fl_274',
        name: 'notas_sobre_dios.txt',
        size: 1.9,
        content:
`Notas sobre Dios

No sé si existe Dios.
Y no importa.

Lo digo en serio.
No importa.

Si existe, bien.
Si no, bien.
Igual hay que vivir.
Igual hay que querer.
Igual hay que intentar.

Lo que importa no es si existe.
Lo que importa es cómo vivís.

Podés vivir con miedo.
Podés vivir con culpa.
Podés vivir con esperanza.
Podés vivir con amor.

Todas son opciones.
Todas son válidas.
Todas son humanas.

Yo elijo vivir con dudas.
Con preguntas.
Con ganas.
Con miedo también.
Con todo.

Nota: no soy religioso.
Nota 2: tampoco ateo.
Nota 3: soy algo en el medio.
Nota 4: y está bien.
Nota 5: o eso creo.`
    },
    {
        id: 'fl_275',
        name: 'notas_sobre_el_amor.txt',
        size: 1.9,
        content:
`Notas sobre el amor

El amor no es una cosa.
Es muchas cosas.

Es querer a alguien.
Es extrañar a alguien.
Es cocinar para alguien.
Es esperar a alguien.
Es llorar por alguien.
Es reír con alguien.
Es dormir con alguien.
Es despertar con alguien.
Es pelear con alguien.
Es hacer las paces.
Es quedarse.
Es irse.
Es volver.
Es no volver.
Es escribir.
Es callar.
Es escuchar.
Es esperar.
Es perdonar.
Es olvidar.
Es recordar.

Es todo eso y más.

El amor no es una sola cosa.
Y por eso no se puede explicar.
Y por eso no se puede enseñar.
Y por eso cada uno lo vive distinto.
Y por eso vale la pena.

Nota: no sé si esto es amor.
Nota 2: pero es algo.
Nota 3: y es suficiente.
Nota 4: o eso creo.`
    },
    {
        id: 'fl_276',
        name: 'notas_sobre_el_tiempo_2.txt',
        size: 2.0,
        content:
`Notas sobre el tiempo (Vol. 2)

El tiempo es raro.

Cuando sos chico, no pasa.
Cuando sos adolescente, no pasa.
Cuando sos joven, pasa.
Cuando sos adulto, vuela.
Cuando sos viejo, se acelera.

Nadie sabe por qué.
Los científicos dicen algo.
Los filósofos dicen algo.
Los poetas dicen algo.
Nadie tiene razón.

Yo tengo mi teoría:

El tiempo no es una línea.
Es una sensación.
Y las sensaciones cambian.

Cuando estás aburrido, el tiempo se arrastra.
Cuando estás entretenido, vuela.
Cuando estás triste, se estanca.
Cuando estás feliz, se va.

Y cuando estás en el medio,
donde estamos casi todos,
el tiempo pasa.
Sin más.
Sin menos.
Pasa.

Y un día te das cuenta de que ya pasó.
Y te preguntás qué hiciste.
Y no te acordás.
Y te da algo.
Y lo llamás nostalgia.

Nota: no hay que darle mucha bola.
Nota 2: pero hay que estar atento.
Nota 3: porque se va.
Nota 4: y no vuelve.`
    },
    {
        id: 'fl_277',
        name: 'notas_sobre_la_vida.txt',
        size: 1.9,
        content:
`Notas sobre la vida

La vida es rara.

Un día estás bien.
Un día estás mal.
Un día estás en el medio.

No hay un plan.
No hay un sentido único.
No hay una respuesta.

Y eso es lo hermoso.
Y eso es lo terrible.
Y eso es todo.

Yo no sé qué es la vida.
Nadie sabe.
Todos fingimos.
Y está bien.

Fingimos que sabemos.
Fingimos que controlamos.
Fingimos que hay un propósito.

Pero en el fondo no.
En el fondo estamos perdidos.
Y eso nos une.
Y eso nos hace humanos.

Nota: no sé por qué escribí esto.
Nota 2: pero me gustó.
Nota 3: y eso alcanza.`
    },
    {
        id: 'fl_278',
        name: 'notas_sobre_la_muerte_3.txt',
        size: 1.9,
        content:
`Notas sobre la muerte (Vol. 3)

Pensé en la muerte de nuevo.

La muerte no es un final.
Es un paso.
O no.
No sé.

Si es un final, ¿qué importa?
Si es un paso, ¿a dónde va?

Nadie sabe.
Y eso me gusta.
Y eso me asusta.
Y está bien.

Me gusta no saber.
Me gusta que sea un misterio.
Me gusta que sea algo que no puedo controlar.

Si pudiera controlarlo, sería aburrido.
Si supiera qué hay, sería trivial.
Si tuviera certeza, sería ciencia.
No es ciencia.
Es vida.
Es muerte.
Es todo.

Nota: no tengo miedo.
Nota 2: o eso creo.
Nota 3: o eso quiero creer.
Nota 4: o eso necesito creer.
Nota 5: y está bien.`
    },
    {
        id: 'fl_279',
        name: 'notas_sobre_la_soledad_2.txt',
        size: 1.9,
        content:
`Notas sobre la soledad (Vol. 2)

Estoy solo.
Está bien.
O no está bien.
No sé.

A veces quiero estar solo.
A veces quiero estar acompañado.
A veces quiero las dos cosas.
Al mismo tiempo.
En el mismo momento.
Es contradictorio.
Y es humano.

La soledad no es mala.
La soledad es.
Es como el silencio.
Como el frío.
Como el hambre.

Es una sensación.
Y las sensaciones vienen y van.
Y está bien.

Yo estoy solo.
Y está bien.
Porque estoy solo ahora.
Y mañana no.
Y pasado sí.
Y así.

Nota: no es triste.
Nota 2: es la vida.
Nota 3: y la vida es rara.
Nota 4: y está bien.`
    },
    {
        id: 'fl_280',
        name: 'notas_sobre_el_perdon.txt',
        size: 1.9,
        content:
`Notas sobre el perdón

El perdón no es un regalo.
Es un proceso.
Y es largo.

Perdonar no es olvidar.
Es acordarse y seguir.
Es acordarse y no doler.
O doler menos.
O doler distinto.

No es fácil.
Nada que valga la pena lo es.

Perdoné cosas.
Cosas grandes.
Cosas chicas.
Cosas que no se cuentan.

Me perdoné cosas.
Cosas grandes.
Cosas chicas.
Cosas que no se cuentan.

Todavía estoy en proceso.
No sé si voy a terminar.
Creo que no.
Creo que es un proceso continuo.
Creo que dura toda la vida.

Y está bien.

Nota: el perdón no se fuerza.
Nota 2: viene solo.
Nota 3: o no viene.
Nota 4: y está bien.
Nota 5: o no.
Nota 6: pero está bien.`
    },
    {
        id: 'fl_281',
        name: 'notas_sobre_la_felicidad.txt',
        size: 1.9,
        content:
`Notas sobre la felicidad

La felicidad no es un estado.
Es un momento.
Es muchos momentos.

No es estar siempre bien.
Es estar bien a veces.
Y reconocerlo.

No es tener todo.
Es tener lo que importa.
Y saber que importa.

No es no tener problemas.
Es tener problemas y seguir.
Y seguir.
Y seguir.

Yo no soy feliz siempre.
Pero soy feliz a veces.
A veces cuando tomo café.
A veces cuando hablo con alguien.
A veces cuando escucho una canción.
A veces cuando no hago nada.
A veces cuando escribo esto.

Esos momentos son la felicidad.
No hay otra.
No hay una felicidad más grande.
No hay una felicidad permanente.

Esos pequeños momentos son todo.
Y con eso alcanza.

Nota: aprendí esto de grande.
Nota 2: antes no lo veía.
Nota 3: ahora sí.
Nota 4: y está bueno.
Nota 5: y quiero compartirlo.`
    },
    {
        id: 'fl_282',
        name: 'notas_sobre_la_tristeza.txt',
        size: 1.9,
        content:
`Notas sobre la tristeza

La tristeza no es mala.
Es una emoción.
Como las otras.

Nos enseñaron que hay que estar bien.
Que hay que estar contento.
Que hay que sonreír.
Que hay que fingir.

Pero no.

La tristeza está.
Y hay que dejarla estar.
Y sentirla.
Y entenderla.
Y aprender de ella.

La tristeza te dice cosas.
Te dice que algo no está bien.
Te dice que algo te importa.
Te dice que estás vivo.

Si no sintieras tristeza, no serías humano.
Si no sintieras tristeza, no sentirías nada.

Entonces no hay que evitarla.
Hay que dejarla ser.
Y después se va.
O no se va.
Pero se transforma.
En otra cosa.
En aprendizaje.
En calma.
En paz.

Nota: la tristeza también pasa.
Nota 2: y cuando pasa, deja algo.
Nota 3: algo que no sabías.
Nota 4: algo que necesitabas.`
    },
    {
        id: 'fl_283',
        name: 'notas_sobre_la_identidad.txt',
        size: 1.9,
        content:
`Notas sobre la identidad

¿Quién soy?

No soy mi trabajo.
No soy mi sueldo.
No soy mi casa.
No soy mi auto.
No soy mi ropa.
No soy mi celular.
No soy mi Instagram.
No soy mi Twitter.
No soy mi TikTok.

Entonces quién soy.

Soy lo que hago cuando nadie mira.
Soy lo que digo cuando nadie escucha.
Soy lo que pienso cuando nadie pregunta.
Soy lo que siento cuando nadie ve.
Soy lo que escribo cuando nadie va a leer.
Soy lo que soy cuando estoy solo.

Y eso no se ve.
Y eso no se cuenta.
Y eso no se publica.

Pero es lo que soy.
Y con eso alcanza.

Nota: no hace falta saber quién sos.
Nota 2: hace falta serlo.
Nota 3: y está bueno.
Nota 4: y cuesta.
Nota 5: y vale la pena.`
    },
    {
        id: 'fl_284',
        name: 'notas_sobre_la_realidad.txt',
        size: 1.9,
        content:
`Notas sobre la realidad

La realidad es rara.
O no lo es.
Y yo soy raro.
O no lo soy.

No sé qué es la realidad.
Nadie sabe.
Todos asumimos que es lo que vemos.
Pero los que ven distinto ven otra cosa.
Y los que oyen distinto oyen otra cosa.
Y los que sienten distinto sienten otra cosa.

Entonces qué es la realidad.

Quizás es una construcción.
Quizás es lo que acordamos.
Quizás es lo que decidimos que sea.

Yo no lo sé.
Pero tengo una idea:

La realidad es lo que vivís.
Y lo que vivís es real para vos.
Y lo que vive otro es real para él.

Y las realidades se cruzan.
Y a veces chocan.
Y a veces se entrelazan.

Y ahí está la vida.
En el cruce.
En el choque.
En el entrelazamiento.

Nota: no sé si esto tiene sentido.
Nota 2: pero para mí sí.
Nota 3: y eso es la realidad.
Nota 4: mi realidad.
Nota 5: y está bien.`
    },
    {
        id: 'fl_285',
        name: 'notas_finales_2.txt',
        size: 1.9,
        content:
`Notas finales (Vol. 2)

Bueno.

Escribí mucho.
Leí mucho.
Pensé mucho.

No sé si sirvió.
No sé si alguien lo va a leer.
No sé si importa.

Pero escribí.
Y eso es algo.
Y eso es todo.
Y eso es suficiente.

Escribí sobre la vida.
Escribí sobre la muerte.
Escribí sobre el amor.
Escribí sobre el tiempo.
Escribí sobre todo.

No llegué a ninguna conclusión.
Y está bien.
Porque no hay conclusión.
Hay proceso.
Hay camino.
Hay vida.

Si estás leyendo esto:
gracias.
Gracias por perder el tiempo.
Gracias por acordarte.

Y si no estás leyendo esto:
también gracias.
Aunque no tenga sentido.

Chau.
Nos vemos en otro archivo.
O no.
Pero nos vemos.

Fin.`
    },

    // ============================================================
    // BONUS — 15 archivos más (para llegar a 300)
    // ============================================================
    {
        id: 'fl_286',
        name: 'notas_sobre_la_amistad.txt',
        size: 1.9,
        content:
`Notas sobre la amistad

Un amigo es alguien que:

  · Te escribe cuando no necesita nada.
  · Te escucha cuando hablás mucho.
  · Te banca cuando estás mal.
  · Te jode cuando estás bien.
  · Te espera cuando llegás tarde.
  · Te perdona cuando la cagás.
  · Te dice la verdad cuando no querés escucharla.
  · Se queda cuando te querés ir.
  · Se va cuando te tenés que ir.
  · Vuelve cuando vuelve.
  · No vuelve, pero está.
  · No está, pero vuelve.

Los amigos son pocos.
Muy pocos.
Y están dispersos.
Y es difícil verlos.
Y es difícil mantenerlos.

Pero cuando los ves,
aunque sea cada 6 meses,
es como si hubiera pasado un día.

Eso es un amigo.
Y tengo pocos.
Pero buenos.

Nota: no importa la cantidad.
Nota 2: importa la calidad.
Nota 3: y la mía es alta.
Nota 4: aunque sea poca.`
    },
    {
        id: 'fl_287',
        name: 'notas_sobre_la_familia.txt',
        size: 1.9,
        content:
`Notas sobre la familia

La familia es rara.

No la elegís.
Te toca.
Y hay que lidiar con eso.

Algunos son buenos.
Algunos son malos.
Algunos son indiferentes.
Algunos son todo junto.

Con algunos hablás mucho.
Con otros no hablás.
Con otros hablás poco.
Con otros hablás sin querer.

Y en los cumpleaños te los cruzás.
Y en las fiestas también.
Y en los velorios también.

Y hay que estar.
Y hay que fingir.
Y hay que querer.
Y hay que perdonar.

Porque son familia.
Y eso significa algo.
Aunque no sepas qué.

Nota: elegí a algunos.
Nota 2: a los que puedo elegir.
Nota 3: a los otros los quiero igual.
Nota 4: o eso creo.
Nota 5: o eso quiero creer.`
    },
    {
        id: 'fl_288',
        name: 'notas_sobre_la_musica.txt',
        size: 1.9,
        content:
`Notas sobre la música

Hay canciones para todo.

Para cuando estás feliz.
Para cuando estás triste.
Para cuando estás enamorado.
Para cuando estás solo.
Para cuando bailás.
Para cuando llorás.
Para cuando no sentís nada.

Hay canciones que te hacen llorar.
Hay canciones que te hacen reír.
Hay canciones que te hacen recordar.
Hay canciones que te hacen olvidar.

Hay canciones viejas.
Hay canciones nuevas.
Hay canciones que no entendés.
Hay canciones que te entienden.

La música es un lenguaje.
Y todos lo hablan.
Y nadie lo explica.

Yo tengo mi playlist.
Y vos tenés la tuya.
Y son distintas.
Y son iguales.

Nota: la música es lo mejor.
Nota 2: después del silencio.
Nota 3: y el silencio es lo mejor.
Nota 4: después de la música.`
    },
    {
        id: 'fl_289',
        name: 'notas_sobre_el_dinero.txt',
        size: 1.9,
        content:
`Notas sobre el dinero

El dinero no es todo.
Pero es mucho.
Y quien dice que no, miente.

No compra la felicidad.
Pero compra cosas que ayudan.
Como un techo.
Como comida.
Como salud.

Sin plata estás mal.
Con plata podés estar bien.
O mal.
Depende.

El problema no es el dinero.
Es la falta de dinero.
Y también la obsesión con el dinero.

Hay que tener lo justo.
Lo necesario.
Lo que te deje vivir.
Y no pensar en eso todo el día.

Yo no tengo mucho.
Pero tengo lo suficiente.
Y eso es más de lo que tienen muchos.
Y eso es menos de lo que tienen otros.

Nota: no te compares.
Nota 2: compararte es la peor trampa.
Nota 3: siempre hay alguien con más.
Nota 4: y con menos.
Nota 5: y da igual.`
    },
    {
        id: 'fl_290',
        name: 'notas_sobre_la_tecnologia.txt',
        size: 1.9,
        content:
`Notas sobre la tecnología

La tecnología avanza.
Vos no.

Comprás un celular.
A los 3 meses sale uno nuevo.
Mejor.
Más rápido.
Más caro.

Comprás una compu.
A los 6 meses es vieja.
Se traba.
Se pone lenta.
Ya no actualiza.

Comprás un software.
A los 2 años ya no lo soportan.
Tenés que actualizar.
Y actualizar te rompe todo.
Y no podés volver atrás.

Es un círculo.
Un círculo que no termina.
Un círculo que te consume.
Un círculo que te quiere consumir.

Yo me cansé.
Uso lo viejo.
Hasta que se rompa.
Y después arreglo.
Y si no arreglo, compro.
Pero lo mismo.
No lo nuevo.

Nota: no me gusta lo nuevo.
Nota 2: no siempre.
Nota 3: a veces sí.
Nota 4: pero no siempre.`
    },
    {
        id: 'fl_291',
        name: 'notas_sobre_el_arte.txt',
        size: 1.9,
        content:
`Notas sobre el arte

El arte es raro.

Algunos pintan.
Algunos escriben.
Algunos cantan.
Algunos bailan.
Algunos hacen todo eso.
Algunos no hacen nada.

Yo no sé qué es arte.
Nadie sabe.
Todos asumimos que algo es arte.
Y algunos se enojan si decís que no lo es.
Y otros se enojan si decís que sí.

El arte no sirve para nada.
Y es lo más importante.
Y es lo que nos hace humanos.
Y es lo que va a quedar.

Cuando estemos muertos,
no va a quedar nuestra cuenta bancaria.
No va a quedar nuestro auto.
No va a quedar nuestro sueldo.

Va a quedar el arte.
Va a quedar lo que creamos.
Va a quedar lo que escribimos.
Va a quedar lo que pintamos.

Y va a importar.
Y va a hablar de nosotros.
Y va a decir quiénes fuimos.

Nota: escribo esto como un acto de arte.
Nota 2: no sé si lo es.
Nota 3: pero me gusta pensar que sí.`
    },
    {
        id: 'fl_292',
        name: 'notas_sobre_la_educacion.txt',
        size: 1.9,
        content:
`Notas sobre la educación

Me educaron.
No me educaron bien.
O sí.
O depende.

Aprendí matemática.
No la uso.
Aprendí historia.
No me acuerdo.
Aprendí geografía.
No sé dónde está nada.
Aprendí inglés.
Hablo mal.
Aprendí arte.
No sé pintar.
Aprendí música.
No sé cantar.

Aprendí otras cosas.
Aprendí a callarme.
Aprendí a fingir.
Aprendí a sobrevivir.
Aprendí a dudar.
Aprendí a preguntar.
Aprendí a leer entre líneas.
Aprendí a estar solo.

Eso no me lo enseñaron.
Eso lo aprendí solo.
Eso es lo que sirve.

La educación formal es útil.
Y también es inútil.
Depende de qué hagas.
Y depende de quién seas.

Yo no sé si estoy educado.
Yo no sé si soy culto.
Yo no sé muchas cosas.
Pero sé las que importan.

Nota: la escuela te enseña.
Nota 2: la vida te educa.
Nota 3: y no siempre coinciden.`
    },
    {
        id: 'fl_293',
        name: 'notas_sobre_la_vejez.txt',
        size: 1.9,
        content:
`Notas sobre la vejez

Los viejos son raros.

Algunos son sabios.
Algunos son amargos.
Algunos son tiernos.
Algunos son duros.
Algunos son todo junto.

Yo voy a ser viejo algún día.
O no.
No sé.

Pero si soy viejo, quiero ser:

  · Tolerante.
  · Paciente.
  · Curioso.
  · Amable.
  · Presente.

No quiero ser:

  · Amargado.
  · Quejoso.
  · Nostálgico.
  · Rígido.
  · Ausente.

No quiero vivir en el pasado.
No quiero quejarme del presente.
No quiero tenerle miedo al futuro.

Quiero estar acá.
Donde esté.
Cuando esté.

Nota: no sé si voy a llegar.
Nota 2: nadie sabe.
Nota 3: pero quiero prepararme.
Nota 4: por si llego.
Nota 5: y por si no.`
    },
    {
        id: 'fl_294',
        name: 'notas_sobre_el_futuro.txt',
        size: 1.9,
        content:
`Notas sobre el futuro

El futuro no existe.
Existe el presente.
Y el presente es ahora.
Y ahora es futuro mañana.

Es confuso.
Y está bien.

Nos enseñaron a pensar en el futuro.
A planificar.
A ahorrar.
A esperar.

Pero el futuro no es nuestro.
No sabemos qué va a pasar.
Puede pasar cualquier cosa.
O nada.
O todo.

Yo no sé qué va a pasar.
No sé si voy a estar.
No sé si voy a estar bien.
No sé si voy a estar mal.

No sé nada.

Pero voy a estar.
Ahora.
Y ahora es todo.
Y ahora es suficiente.

Nota: el futuro no importa.
Nota 2: el presente sí.
Nota 3: y siempre es presente.
Nota 4: y siempre es ahora.`
    },
    {
        id: 'fl_295',
        name: 'notas_sobre_el_pasado.txt',
        size: 1.9,
        content:
`Notas sobre el pasado

El pasado existe.
Y no existe.
Ya no está.
Pero está.

Está en la memoria.
En las fotos.
En las canciones.
En los olores.
En los sabores.
En los lugares.

Vas a un lugar y te acordás.
Escuchás una canción y te acordás.
Sentís un olor y te acordás.

Y te da algo.
A veces nostalgia.
A veces tristeza.
A veces alegría.
A veces todo junto.

El pasado no se puede cambiar.
Pero se puede entender.
Y se puede aceptar.
Y se puede dejar ir.

Yo tengo un pasado.
Todos tenemos.
No siempre es lindo.
Pero es nuestro.

Y no hay que vivir en él.
Pero tampoco hay que olvidarlo.
Hay que tenerlo.
Y llevarlo.
Y seguir.

Nota: el pasado es pesado.
Nota 2: pero también liviano.
Nota 3: depende de cómo lo lleves.`
    },
    {
        id: 'fl_296',
        name: 'notas_sobre_el_presente.txt',
        size: 1.9,
        content:
`Notas sobre el presente

El presente es todo.
El presente es nada.
El presente es ahora.

Ahora.
Ahora.
Ahora.

¿Cuándo es ahora?
Ahora.
¿Cuándo termina?
Nunca.
¿Cuándo empieza?
Ya empezó.

Estás leyendo esto.
Eso es presente.
Eso es ahora.

Después va a ser pasado.
Y va a llegar otro ahora.
Y otro.
Y otro.

Y así la vida.
Un ahora tras otro.
Un presente tras otro.
Sin pausa.
Sin freno.

Si estás esperando el momento perfecto,
olvidate.
No existe.
El momento es este.
Ahora.
Mientras lees.

Nota: no esperes.
Nota 2: hacelo.
Nota 3: ahora.
Nota 4: mientras podés.`
    },
    {
        id: 'fl_297',
        name: 'notas_sobre_la_esperanza.txt',
        size: 1.9,
        content:
`Notas sobre la esperanza

La esperanza no es una certeza.
Es una apuesta.
Es creer sin saber.
Es querer sin poder.
Es esperar sin garantía.

La esperanza es lo último que se pierde.
Dicen.
Y es cierto.
Pero no es fácil.

Cuando todo va mal,
cuando no ves salida,
cuando no sabés qué hacer,
la esperanza es lo que te hace seguir.

Aunque no sepas por qué.
Aunque no sepas para qué.
Aunque no sepas cuándo.

Seguís.
Porque hay una luz.
Aunque no la veas.
Aunque no exista.

Y si no existe, la inventás.
Y si no la inventás, la esperás.
Y si no la esperás, la soñás.

Y si no la soñás, ya fue.
Pero mientras la sueñes, está.

Nota: yo sueño con cosas.
Nota 2: no sé si van a pasar.
Nota 3: pero sueño.
Nota 4: y eso es suficiente.`
    },
    {
        id: 'fl_298',
        name: 'notas_sobre_la_locura.txt',
        size: 1.9,
        content:
`Notas sobre la locura

¿Qué es la locura?

Es hacer lo mismo y esperar resultados distintos.
O eso dicen.
Pero yo no lo creo.

La locura es no encajar.
Es ver distinto.
Es sentir distinto.
Es ser distinto.

La locura es un exceso.
O una falta.
O las dos cosas.

Los locos son peligrosos.
O no.
O depende.

Los locos son genios.
O no.
O depende.

Yo no soy loco.
Creo.
O no.
No sé.

A veces hablo solo.
A veces pienso cosas raras.
A veces no duermo.
A veces me río sin razón.

Eso es locura?
O es humanidad?
O es lo mismo?

Nota: no me importa.
Nota 2: me gusta ser como soy.
Nota 3: y si eso es locura, bienvenida.`
    },
    {
        id: 'fl_299',
        name: 'notas_sobre_el_silencio.txt',
        size: 1.9,
        content:
`Notas sobre el silencio

El silencio no existe.
Existe el ruido de fondo.
El ruido del viento.
El ruido de la heladera.
El ruido de tus oídos.
El ruido de tus pensamientos.

El silencio es una ilusión.
Pero es una ilusión hermosa.
Y necesaria.

Necesitás silencio para pensar.
Necesitás silencio para dormir.
Necesitás silencio para estar.
Necesitás silencio para ser.

Yo busco el silencio.
Y no lo encuentro.
Porque no existe.
Pero lo busco igual.

Y a veces, en el medio del ruido,
encuentro un pedacito.
Un segundo.
Un instante.
Y eso es suficiente.

Nota: el silencio es un lujo.
Nota 2: y no hay que desperdiciarlo.
Nota 3: y no hay que buscarlo mucho.
Nota 4: porque no existe.
Nota 5: pero hay que agradecerlo cuando aparece.`
    },
    {
        id: 'fl_300',
        name: 'notas_sobre_todo_y_nada.txt',
        size: 2.0,
        content:
`Notas sobre todo y nada

Todo y nada.

Los opuestos.
Los extremos.
Los dos lados.
Las dos caras.

Todo es mucho.
Nada es poco.
Todo es importante.
Nada es importante.

Y en el medio estamos nosotros.
Los que no somos ni todo ni nada.
Los que somos algo.
Los que somos poco.
Los que somos.

La vida es eso.
Un algo.
Un poco.
Un casi.
Un no del todo.
Un no del todo pero casi.

Y en ese casi está la vida.
Y en ese algo está el todo.
Y en ese poco está el mucho.

Porque lo pequeño es grande.
Y lo grande es pequeño.
Y todo depende de dónde mires.

Nota: no entiendo nada.
Nota 2: y entiendo todo.
Nota 3: al mismo tiempo.
Nota 4: y eso es vivir.
Nota 5: y eso es todo.
Nota 6: y eso es nada.
Nota 7: y eso es.
Nota 8: y eso alcanza.

Fin del archivo 300.
Fin del volumen 2.
Gracias por llegar hasta acá.`
    }

];