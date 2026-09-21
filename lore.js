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
    }
];