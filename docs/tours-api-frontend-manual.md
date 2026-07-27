Tours — Manual de la API para el front-end
Este documento es la única fuente de verdad para integrar el widget de reserva de tours desde el tema (Liquid). Describe cómo llamar a los endpoints, qué recibe y qué devuelve cada uno, el flujo completo de compra y todos los mensajes de error posibles. El front NO necesita saber nada de lo que ocurre en el backend: todo lo que se puede consumir está acá.

Todos los ejemplos usan CLP como moneda. Los montos que devuelven estos endpoints son enteros en pesos (ej. 35000 = $35.000), sin decimales ni subunidad.

1. Conceptos básicos
1.1 Cómo se llaman los endpoints (App Proxy)
Todos los endpoints viven bajo el App Proxy de la tienda:

https://<tu-tienda>.myshopify.com/apps/santa-rita/tours/<endpoint>
Desde el tema siempre usa la ruta relativa (mismo dominio de la tienda):

fetch("/apps/santa-rita/tours/meta")
No tienes que firmar nada ni mandar credenciales. Shopify agrega y firma automáticamente los parámetros de identidad (shop, timestamp, signature, logged_in_customer_id) antes de que la petición llegue al backend. Si el cliente está logueado, su identidad viaja firmada; si es invitado, igual funciona (salvo donde se indique lo contrario).

1.2 El tour (handle)
Casi todos los endpoints reciben un parámetro tour. Es el handle de la entrada del metaobject tour — el mismo valor que en el admin aparece como “Identificador de URL” de la entrada (ej. tour-premium, tour-clasico). El front normalmente ya lo conoce porque es la entrada que está renderizando.

1.3 Envelope de respuesta (¡importante!)
Todos los endpoints responden siempre con HTTP 200 (el App Proxy de Shopify enmascara los códigos no-2xx, así que no sirve mirar el status). Debes decidir por el campo success del JSON.

Éxito:

{
  "success": true,
  "code": "ok",
  "data": { }
}
Error:

{
  "success": false,
  "code": "invalid_date",
  "message": "La fecha 2026-13-40 no es válida; usa el formato AAAA-MM-DD."
}
success — true/false. Ramifica siempre por acá.
code — string estable para máquina (ver §8 catálogo de errores). Úsalo si quieres lógica por tipo de error.
message — texto en español listo para mostrar al usuario. Siempre viene en los errores.
data — el payload (solo en éxito). Lo que documenta cada endpoint abajo va dentro de data.
Patrón recomendado en el front:

async function callTours(path, options) {
  const res = await fetch(`/apps/santa-rita/tours/${path}`, options);
  const body = await res.json();
  if (!body.success) {
    // body.message ya viene traducido y listo para mostrar
    throw new ToursError(body.code, body.message);
  }
  return body.data;
}
2. GET tours/meta — catálogos para armar el formulario
Catálogos globales y estáticos (no dependen del tour). Los necesitas para poblar el <select> de nacionalidad, los labels de idioma y los maxlength de los inputs. Cachéalo fuerte: solo cambia con un deploy del backend.

Entrada
Sin parámetros.

GET /apps/santa-rita/tours/meta
Salida (data)
{
  "nationalities": [
    { "id": 60, "name": "Alemania" },
    { "id": 10, "name": "Argentina" },
    { "id": 26, "name": "Australia u Oceanía" },
    { "id": 11, "name": "Brasil" },
    { "id": 15, "name": "Canadá" },
    { "id": 1,  "name": "Chile" },
    { "id": 22, "name": "China" },
    { "id": 12, "name": "Colombia" },
    { "id": 61, "name": "Ecuador" },
    { "id": 20, "name": "España" },
    { "id": 18, "name": "Francia" },
    { "id": 19, "name": "Inglaterra" },
    { "id": 21, "name": "Japón" },
    { "id": 14, "name": "México" },
    { "id": 25, "name": "Otros Asia" },
    { "id": 24, "name": "Otros Europa" },
    { "id": 23, "name": "Otros Sud-América" },
    { "id": 13, "name": "Perú" },
    { "id": 17, "name": "Rusia" },
    { "id": 16, "name": "USA" },
    { "id": 59, "name": "Venezuela" }
  ],
  "defaultNationalityId": 1,
  "languages": [
    { "code": "es", "label": "Español" },
    { "code": "en", "label": "Inglés" },
    { "code": "pt", "label": "Portugués" },
    { "code": "fr", "label": "Francés" }
  ],
  "fieldLimits": {
    "paxName": 35,
    "phone": 30,
    "email": 241
  }
}
Campo	Uso en el front
nationalities	Opciones del <select> de nacionalidad. id es lo que se manda en create.
defaultNationalityId	Preselecciona esta opción (Chile = 1).
languages	Catálogo global de labels de idioma. Qué idiomas ofrece un tour concreto sale de tours/config (ver §9); estos son solo los textos.
fieldLimits.paxName	maxlength del input de nombre (35). El backend además lo pasa a MAYÚSCULAS.
fieldLimits.phone	maxlength del input de teléfono (30).
fieldLimits.email	maxlength del input de email (241).
Errores posibles
Este endpoint no valida entradas; solo puede fallar por causas de infraestructura:

code	message	Cuándo
unauthorized	Solicitud no autorizada.	Firma del proxy inválida.
internal_error	Ocurrió un error inesperado. Inténtalo nuevamente.	Error inesperado del servidor.
3. GET tours/availability — horarios disponibles para un día
Una vez que el cliente eligió cantidad de adultos, niños, idioma y fecha, este endpoint devuelve las horas disponibles de ese día (cruzando el cupo del Web Service de Turismo con las reservas locales) y el precio a cobrar. Consulta un servicio externo en cada llamada → llámalo cuando el cliente termine de elegir, no en cada tecla.

Entrada (query params)
Param	Req.	Formato	Ejemplo	Notas
tour	✅	handle de la entrada	tour-premium	Ver §1.2.
language	✅	código ISO es/en/pt/fr	es	Debe ser uno de los idiomas que ofrece el tour.
date	✅	AAAA-MM-DD	2026-12-10	Fecha del tour elegida por el cliente.
adults	➖	entero ≥ 0	2	Ausente = 0. En la carga inicial puede ir vacío.
children	➖	entero ≥ 0	1	Ausente = 0.
GET /apps/santa-rita/tours/availability?tour=tour-premium&language=es&date=2026-12-10&adults=2&children=1
Salida (data) — party válida con horarios
{
  "quote": {
    "total": 80000,
    "discount": 0,
    "currency": "CLP",
    "adults": 2,
    "children": 1,
    "adultPrice": 35000,
    "childPrice": 10000,
    "billableAdults": 2,
    "billableChildren": 1,
    "promoApplied": false
  },
  "hours": ["10:00", "12:30", "16:00"],
  "party": { "ok": true }
}
Campo	Descripción
quote	Precio a cobrar para esa party+fecha (ver forma detallada en la tabla de abajo). Es el mismo monto que cobrará create.
hours	Horas ofrecibles ("HH:mm") de ese día con cupo suficiente. Esta es la lista para el selector de hora. Puede venir vacía si no hay cupo.
party	Resultado de validar la party contra las reglas del tour. Ver abajo.
Forma del objeto quote (idéntico en availability, price y como base de create):

Campo	Tipo	Descripción
total	entero	Total a cobrar en CLP (con promoción ya aplicada si corresponde).
discount	entero	Descuento aplicado en CLP (0 si no hubo promo).
currency	string	Siempre "CLP".
adults	entero	Adultos de la party (eco de la entrada).
children	entero	Niños de la party.
adultPrice	entero	Precio regular por adulto.
childPrice	entero	Precio regular por niño.
billableAdults	entero	Adultos facturables (difiere de adults solo en promos «Compra X Paga Y»).
billableChildren	entero	Niños facturables.
promoApplied	boolean	true si aplicó una promoción.
Salida (data) — party que NO cumple las reglas del tour
⚠️ Importante: cuando la party (cantidad de personas) no cumple las reglas del tour, el endpoint responde success: true (no es un error de sistema) pero con hours: [] y party.ok: false + un reason. Esto también ocurre en la carga inicial (0 adultos, 0 niños → "empty"). No consulta el Web Service en este caso.

{
  "quote": { "total": 0, "discount": 0, "currency": "CLP", "adults": 0, "children": 0, "adultPrice": 35000, "childPrice": 10000, "billableAdults": 0, "billableChildren": 0, "promoApplied": false },
  "hours": [],
  "party": { "ok": false, "reason": "empty" }
}
Valores posibles de party.reason (útiles para mostrar un mensaje contextual sin re-implementar los rangos):

reason	Significado
empty	No se seleccionó ninguna persona (0 adultos y 0 niños).
people_range	El total (adultos + niños) está fuera del rango permitido por el tour.
adults_range	La cantidad de adultos está fuera del rango permitido.
children_range	La cantidad de niños está fuera del rango permitido.
Los rangos concretos (mín/máx de personas, adultos y niños) de cada tour los obtienes de tours/config (ver §9), para poder fijar los min/max de los inputs antes de llamar acá.

invalid_party (error) vs. party.ok: false (reglas) — no confundir
Son dos capas distintas y nunca se pisan:

invalid_party (error duro, success: false) → valida la forma del dato: se dispara solo cuando adults/children vienen presentes pero no son enteros ≥ 0 (basura como "abc", o negativos como "-1"). Es un input malformado (bug del front o query manipulada); no debería ocurrir si mandas enteros. Ojo: un campo ausente o vacío NO es invalid_party → se interpreta como 0.
party.ok: false (no es error, success: true) → valida las reglas de negocio: los números son enteros válidos ≥ 0, pero no cumplen los mín/máx del tour (incluye el 0,0 inicial → "empty").
En una frase: invalid_party = “esto no es un número”; party.reason = “es un número válido pero rompe las reglas del tour”. Ejemplos con un tour de minPeople 2 / minAdults 2 / maxChildren 2:

Entrada adults,children	Respuesta
"abc", 0 ó -1, 0	success:false, code:"invalid_party"
ausente, ausente	success:true, party.reason:"empty" (→ 0,0)
0, 0	success:true, party.reason:"empty"
1, 0	success:true, party.reason:"people_range" (total 1 < 2)
1, 1	success:true, party.reason:"adults_range" (adultos 1 < 2)
2, 3	success:true, party.reason:"children_range" (niños 3 > 2)
Errores posibles (success: false)
code	message	Cuándo
invalid_tour	El tour {tour} no es válido o no existe.	Falta tour o no existe esa entrada.
invalid_date	La fecha {date} no es válida; usa el formato AAAA-MM-DD.	date ausente o con formato incorrecto.
invalid_party	La cantidad de personas no cumple las reglas del tour.	adults/children presentes pero no numéricos.
invalid_language	El idioma {language} no está disponible para este tour.	El tour no ofrece ese idioma (o language inválido).
reservations_disabled	Las reservas para este tour no están disponibles.	El tour tiene las reservas deshabilitadas.
tour_misconfigured	Este tour no está disponible por un problema de configuración de precios.	Config de precios inválida en el backend.
not_configured	El servicio de tours no está configurado. {pieza}	Falta la URL del Web Service en el backend.
unauthorized	Solicitud no autorizada.	Firma del proxy inválida.
internal_error	Ocurrió un error inesperado. Inténtalo nuevamente.	Error inesperado (incl. caída del Web Service).
4. Flujo de compra (resumen)
La compra son 3 llamadas + 1 redirección, en este orden:

0) GET  tours/nonce            → al RENDERIZAR el formulario (una vez); guardas el `nonce`
1) POST tours/create           → al enviar, con ESE mismo `nonce`; obtienes { purchaseToken, token, redirectUrl }
2) Redirigir a Webpay          → POST del formulario a `redirectUrl` con el campo `token_ws`
   ── el cliente paga en Webpay ──
3) Webpay vuelve al backend, que confirma el pago y redirige a tu página "gracias"
   con  ?token=<purchaseToken>   (el resultado NO viene en la URL; se consulta con result)
4) GET  tours/result?token=…   → en la página "gracias", haces polling hasta ver el resultado
El nonce se pide una sola vez al abrir el formulario (paso 0), no en cada envío. Es lo que permite al backend cortar el doble-submit. Ver §5.

Los detalles de cada paso están en las secciones 5 a 7.

5. GET tours/nonce — token de un solo uso para crear la reserva
Pide un nonce: un token de un solo uso que protege contra reenvíos, doble-submit y CSRF. Se manda en el body de tours/create y el backend lo consume una sola vez (dos envíos con el mismo nonce → solo uno crea la reserva).

⚠️ Cuándo llamarlo (importante)
Pide el nonce UNA vez, cuando se renderiza el formulario de compra — NO en cada POST tours/create.

El nonce es lo que le permite al backend detectar múltiples envíos del mismo formulario. Si pidieras un nonce nuevo justo antes de cada create, cada envío llevaría un token distinto y el backend no podría relacionarlos → un doble-click o doble-submit crearía dos reservas (y dos cobros). Al reutilizar el mismo nonce que obtuviste al abrir el formulario, ambos envíos compiten por el mismo token y solo uno prospera.

Reglas prácticas:

Al renderizar el formulario → GET tours/nonce y guarda el nonce.
Al enviar (POST tours/create) → manda ese mismo nonce, no pidas uno nuevo.
Si create falla por una razón distinta al nonce (ej. sold_out, invalid_party), el nonce sigue vivo → corrige y reintenta con el mismo nonce.
Pide un nonce nuevo solo si create responde invalid_nonce o request_expired, o si el formulario lleva abierto más que el TTL (15 minutos; ver expiresAt).
Entrada
Sin parámetros.

GET /apps/santa-rita/tours/nonce
Salida (data)
{
  "nonce": "b3f1c2a9e8d7...9f",
  "expiresAt": "2026-07-17T18:32:00.000Z"
}
Campo	Descripción
nonce	Token opaco. Guárdalo y mándalo tal cual en el body de create.
expiresAt	Instante de expiración (ISO 8601, UTC). Si venció, pide uno nuevo antes de reintentar.
Errores posibles
code	message	Cuándo
unauthorized	Solicitud no autorizada.	Firma del proxy inválida.
internal_error	Ocurrió un error inesperado. Inténtalo nuevamente.	Error inesperado.
6. POST tours/create — crear la reserva e iniciar el pago
Crea la reserva (en estado pending, reservando cupo) e inicia la transacción de pago con Webpay. El backend recalcula todo server-side (precio, cupo, reglas) — el body es solo input; nunca se confía en el precio que mande el front.

Entrada (body JSON)
Manda Content-Type: application/json.

Campo	Req.	Tipo	Ejemplo	Notas
tour	✅	string	tour-premium	Handle de la entrada.
language	✅	string ISO	es	es/en/pt/fr; debe ser un idioma que ofrece el tour.
date	✅	AAAA-MM-DD	2026-12-10	Misma fecha que usaste en availability.
hour	✅	HH:mm	12:30	Una de las horas que devolvió availability. No un id interno.
adults	✅	entero ≥ 0	2	Igual que en availability.
children	✅	entero ≥ 0	1	
name	✅	string	Juan Pérez	Nombre del pasajero. Máx. fieldLimits.paxName (35).
phone	✅	string	+56912345678	Máx. fieldLimits.phone (30).
email	✅	string	juan@mail.cl	Máx. fieldLimits.email (241).
nationalityId	➖	entero	1	Un id del catálogo de tours/meta. Ausente → Chile (1) por defecto.
nonce	✅	string	b3f1c2...	El nonce que obtuviste de tours/nonce.
POST /apps/santa-rita/tours/create
Content-Type: application/json

{
  "tour": "tour-premium",
  "language": "es",
  "date": "2026-12-10",
  "hour": "12:30",
  "adults": 2,
  "children": 1,
  "name": "Juan Pérez",
  "phone": "+56912345678",
  "email": "juan@mail.cl",
  "nationalityId": 1,
  "nonce": "b3f1c2a9e8d7...9f"
}
Salida (data)
{
  "purchaseToken": "clz8h2k9m0000abcd1234efgh",
  "token": "01ab34cd...ef",
  "redirectUrl": "https://webpay3g.transbank.cl/webpayserver/initTransaction"
}
Campo	Descripción
purchaseToken	Id de la reserva. No necesitas persistirlo: tras el pago, el backend lo pasa por la URL a tu página “gracias” (?token=<purchaseToken>), y de ahí lo lees para llamar a tours/result.
token	Token de Transbank para redirigir a Webpay. Va en el campo token_ws del formulario de redirección.
redirectUrl	URL de Webpay a la que debes hacer POST para iniciar el pago.
Redirigir a Webpay (paso 3 del flujo)
Webpay se inicia con un POST de formulario (no un fetch, no un GET). El formulario tiene la forma estándar de Transbank, donde:

action = el redirectUrl que devolvió tours/create.
El campo token_ws = el token que devolvió tours/create.
<!-- action = redirectUrl (de create); token_ws = token (de create) -->
<form method="post" action="https://webpay3gint.transbank.cl/webpayserver/initTransaction">
  <input name="token_ws" value="01ab34cd...ef" />
</form>
El dominio del action lo determina siempre redirectUrl (ambiente de integración vs. producción de Transbank); no lo hardcodees, úsalo tal cual viene en la respuesta de create.

Puedes construirlo y enviarlo dinámicamente:

const { token, redirectUrl } = data; // respuesta de create

const form = document.createElement("form");
form.method = "post";
form.action = redirectUrl;          // ← action = redirectUrl

const input = document.createElement("input");
input.type = "hidden";
input.name = "token_ws";
input.value = token;                // ← token_ws = token

form.appendChild(input);
document.body.appendChild(form);
form.submit();
Tras pagar (o anular), Webpay devuelve el control al backend, que confirma el pago y redirige el navegador a tu página “gracias” (ver §7).

Errores posibles (success: false)
code	message	Cuándo
invalid_tour	El tour {tour} no es válido o no existe.	tour ausente o inexistente.
invalid_date	La fecha {date} no es válida; usa el formato AAAA-MM-DD.	date mal formada.
invalid_slot	El horario seleccionado no es válido.	hour mal formada, o esa hora ya no existe en el Web Service.
missing_fields	Faltan datos obligatorios (nombre, teléfono o correo).	Falta name, phone o email.
invalid_party	La cantidad de personas no cumple las reglas del tour.	Party no numérica, o no cumple reglas, o total ≤ 0.
invalid_nationality	La nacionalidad {nationality} no es válida.	nationalityId presente pero fuera del catálogo.
invalid_language	El idioma {language} no está disponible para este tour.	El tour no ofrece ese idioma.
reservations_disabled	Las reservas para este tour no están disponibles.	Reservas deshabilitadas para el tour.
tour_misconfigured	Este tour no está disponible por un problema de configuración de precios.	Config de precios inválida en el backend.
too_many_pending	Tienes demasiadas reservas en proceso sin pagar. Complétalas o espera unos minutos antes de crear otra.	Ya hay 3 reservas pending con ese email.
sold_out	Ya no hay cupo disponible para ese horario.	Se agotó el cupo del horario elegido.
invalid_nonce	La solicitud no es válida o ya fue procesada. Recarga la página e inténtalo de nuevo.	Nonce ausente, vencido o ya usado. Pide un nonce nuevo.
request_expired	La solicitud expiró. Recarga la página e inténtalo de nuevo.	La petición llegó fuera de la ventana anti-replay (90s).
not_configured	El servicio de tours no está configurado. {pieza}	Falta config de Web Service / Webpay / página gracias en el backend.
payment_error	No se pudo iniciar el pago. Inténtalo nuevamente.	Falló la creación de la transacción en Webpay (red/timeout).
unauthorized	Solicitud no autorizada.	Firma del proxy inválida.
internal_error	Ocurrió un error inesperado. Inténtalo nuevamente.	Error inesperado del servidor.
Nota sobre invalid_nonce: un nonce se consume solo si TODAS las validaciones pasaron. Si create falla por otra razón (ej. sold_out), puedes reintentar con el mismo nonce tras corregir. Solo pide uno nuevo si el error es invalid_nonce o request_expired.

7. GET tours/result — estado de la reserva (página “gracias”)
Cuando el cliente vuelve del pago, el backend lo redirige a tu página “gracias” con el token de la reserva en la URL:

https://<tu-tienda>/<pagina-gracias>?token=<purchaseToken>
token — es el purchaseToken de la reserva. Es el único dato en el que debes confiar de la URL: con él consultas el estado real llamando a este endpoint (tours/result).
⚠️ El resultado del pago NO viene en la URL — se consulta con tours/result. El backend no pone un ?error= cuando el pago falla en una reserva válida: el desenlace (pagado / rechazado / abortado) lo determinas siempre con tours/result, que es autoritativo (el estado lo fija el servidor, no el cliente). Confiar en un parámetro de la URL sería inseguro: la barra de direcciones es manipulable por el usuario y podría “hacerse ver pagado” sin haberlo hecho.

Único caso con ?error=: si el retorno llega sin una reserva válida que consultar (token de Transbank inválido o reserva inexistente), la URL trae ?error=invalid_token o ?error=not_found y NO trae ?token=. Ahí no hay nada que consultar en tours/result: muestra un mensaje genérico de “no pudimos encontrar tu reserva”. (Trátalo solo como una pista, no como un dato autoritativo.)

En la página “gracias”, si hay token, consulta el estado con este endpoint. Como el registro final puede tardar unos segundos (ocurre en background tras el pago), haz polling cada 2–3s hasta tener un resultado estable.

Entrada (query params)
Param	Req.	Descripción
token	✅	El purchaseToken (llega en la URL).
GET /apps/santa-rita/tours/result?token=clz8h2k9m0000abcd1234efgh
Salida (data)
{
  "status": "reserved",
  "paidStatus": "paid",
  "reservationCode": "R-123456",
  "tour": {
    "name": "Tour Premium",
    "date": "2026-12-10T12:30:00-03:00",
    "adults": 2,
    "children": 1
  },
  "total": 80000
}
Campo	Tipo	Descripción
paidStatus	string	Desenlace del pago, resumido — el campo clave para la página gracias. Uno de: "pending" (aún sin confirmar → sigue polling), "paid" (pago exitoso → muestra confirmación), "failed" (pago no concretado → muestra fallo). No interpretes status a mano.
status	string	Estado detallado de la reserva (ver tabla abajo). Úsalo solo si quieres distinguir el motivo (ej. rechazado vs. anulado); para decidir éxito/fallo usa paidStatus.
reservationCode	string	Código de reserva del Web Service. Llega después del pago (cuando completa el registro en background). Puede venir ausente al principio.
tour.name	string	Nombre del tour.
tour.date	string	Fecha+hora del tour (formato del Web Service, con offset).
tour.adults	entero	Adultos reservados.
tour.children	entero	Niños reservados.
total	entero	Total cobrado (CLP).
Cómo interpretar paidStatus / status
paidStatus resume los status detallados en tres valores. Esta es la correspondencia:

paidStatus	status detallado(s)	Qué mostrar
pending	pending	Aún no se confirma el pago. Sigue haciendo polling.
paid	paid, reserving, reserved, reservation_failed	✅ Pago exitoso. Muestra confirmación; el reservationCode llega cuando termine el registro en background.
failed	payment_failed, payment_init_failed, aborted, abandoned	Pago no concretado. Muestra mensaje de fallo.
Sobre reservation_failed: cuenta como paid a propósito. El cliente pagó; que el registro en el Web Service falle es un asunto de background/ops (se reintenta solo), no un error que deba ver el cliente en la página “gracias”.

Si quieres afinar el mensaje de fallo (ej. “pago rechazado” vs. “anulaste el pago” vs. “no se pudo iniciar”), mira el status detallado: payment_failed (rechazado por Transbank), aborted (el cliente anuló en Webpay), abandoned (no se confirmó a tiempo), payment_init_failed (nunca llegó a Webpay).

Regla práctica para la página gracias:

Lee token de la URL. Si no hay token (llegó ?error=invalid_token/not_found) → muestra un mensaje genérico de “no encontramos tu reserva” y termina.
Con token → llama a tours/result en polling (cada 2–3s).
Decide solo por paidStatus de la respuesta (nunca por la URL):
"paid" → muestra confirmación (y el reservationCode cuando aparezca).
"failed" → muestra el mensaje de fallo (afínalo con status si quieres).
"pending" → sigue en polling.
Deja de hacer polling cuando paidStatus sea "paid" o "failed" (solo "pending" sigue).
Errores posibles (success: false)
code	message	Cuándo
not_found	No se encontró la reserva.	Falta token o no existe esa reserva.
unauthorized	Solicitud no autorizada.	Firma del proxy inválida.
internal_error	Ocurrió un error inesperado. Inténtalo nuevamente.	Error inesperado.
8. Catálogo de errores
Referencia consolidada de todos los code que puede devolver cualquier endpoint (en el envelope { success: false, code, message }). El message siempre viene en español y listo para mostrar; los {marcadores} se rellenan con el dato concreto cuando existe.

8.1 Cómo tratar cada error (3 grupos)
No todos los errores son responsabilidad del front. Se agrupan en tres:

🟢 Negocio / entrada del usuario — el front sí los maneja en su UX: muestra el message junto al campo o paso correspondiente y deja que el usuario corrija. Son el flujo normal.
🔁 Infraestructura / transitorios (Shopify, red, pago) — el front no debe preocuparse por su lógica: no son un bug del formulario ni algo que el usuario pueda corregir. Si aparecen, muestra el message y ofrece recargar la página / reintentar. Normalmente no ocurren en un flujo sano.
🔧 Configuración del backend — tampoco son culpa del front, pero recargar NO los soluciona: requieren que un admin configure/corrija algo en el backend. Muestra el message y, si persiste, avisar al equipo (no tiene sentido reintentar en loop).
Grupo	code	Qué hacer en el front
🔁	unauthorized	No debería pasar en el flujo normal. Recargar la página y reintentar.
🔁	request_expired	Anti-replay (ver §5/§6). Recargar, pedir nonce nuevo y reintentar.
🔁	invalid_nonce	Nonce vencido o ya usado. No reintentes automáticamente: “ya usado” puede significar que un envío anterior sí prosperó (doble-submit) y la reserva ya existe → reintentar crearía una segunda. Si el usuario no completó la compra, rehacer el formulario (nonce nuevo) para un reenvío manual.
🔁	payment_error	Falló iniciar el pago (Webpay/red). La reserva quedó descartada y el nonce ya se consumió → reintentar el envío con un nonce nuevo (pídelo antes de reintentar).
🔁	internal_error	Error inesperado del servidor. En endpoints de lectura, reintentar; en create, reintentar con un nonce nuevo (el anterior pudo consumirse).
🔧	not_configured	Falta config en el backend. Recargar no ayuda → avisar al equipo.
🔧	tour_misconfigured	Precios mal configurados en el metaobject. Recargar no ayuda → avisar.
🟢	invalid_tour	Handle de tour inexistente. Revisar el tour que se envía.
🟢	invalid_date	Fecha mal formada. Corregir el selector de fecha.
🟢	invalid_slot	Hora inválida o ya inexistente. Volver a pedir availability.
🟢	invalid_language	Idioma no ofrecido por el tour. Ajustar el selector.
🟢	invalid_party	Cantidades no numéricas (bug del front, ver §3). Mandar enteros ≥ 0.
🟢	invalid_nationality	Nacionalidad fuera del catálogo. Usar un id de tours/meta.
🟢	missing_fields	Faltan nombre/teléfono/email. Validar el formulario antes de enviar.
🟢	reservations_disabled	Tour con reservas cerradas. Ocultar/deshabilitar el widget.
🟢	sold_out	Sin cupo en ese horario. Ofrecer otro horario/fecha.
🟢	too_many_pending	Demasiadas reservas sin pagar. Mostrar el message y esperar.
🟢	not_found	Reserva inexistente (en tours/result). Revisar el token de la URL.
En corto: 🔁 y 🔧 no son culpa del front. Para 🔁 basta recargar/reintentar; para 🔧 recargar no sirve (es config del backend). El front solo implementa lógica de UX real para los 🟢.

8.2 Mensajes (plantillas)
code	message (plantilla)
invalid_date	La fecha {date} no es válida; usa el formato AAAA-MM-DD.
invalid_tour	El tour {tour} no es válido o no existe.
invalid_language	El idioma {language} no está disponible para este tour.
invalid_slot	El horario seleccionado no es válido.
invalid_nationality	La nacionalidad {nationality} no es válida.
invalid_party	La cantidad de personas no cumple las reglas del tour. {detalle}
sold_out	Ya no hay cupo disponible para ese horario.
too_many_pending	Tienes demasiadas reservas en proceso sin pagar. Complétalas o espera unos minutos antes de crear otra.
missing_fields	Faltan datos obligatorios (nombre, teléfono o correo).
reservations_disabled	Las reservas para este tour no están disponibles.
tour_misconfigured	Este tour no está disponible por un problema de configuración de precios.
payment_error	No se pudo iniciar el pago. Inténtalo nuevamente.
not_found	No se encontró la reserva.
not_configured	El servicio de tours no está configurado. {pieza}
request_expired	La solicitud expiró. Recarga la página e inténtalo de nuevo.
invalid_nonce	La solicitud no es válida o ya fue procesada. Recarga la página e inténtalo de nuevo.
unauthorized	Solicitud no autorizada.
internal_error	Ocurrió un error inesperado. Inténtalo nuevamente.
Existen otros code en el backend (login_required, no_customer, forbidden, method_not_allowed, tick_errors) usados por otros canales; los endpoints de tours documentados aquí no los devuelven.

9. Endpoints complementarios (opcionales)
No son parte del flujo obligatorio, pero ayudan a armar mejor el formulario.

GET tours/config?tour=<handle> — reglas y precios de UN tour
Devuelve las reglas de cantidad de personas y los precios base de un tour concreto, para fijar los min/max de los inputs y mostrar solo los idiomas que ese tour ofrece antes de llamar a availability.

{
  "reservationsDisabled": false,
  "adultPrice": 35000,
  "childPrice": 10000,
  "currency": "CLP",
  "languages": [ { "code": "es", "label": "Español" } ],
  "rules": {
    "minPeople": 2, "maxPeople": 6,
    "minAdults": 2, "maxAdults": 6,
    "minChildren": 0, "maxChildren": 2,
    "childrenCountAgainstAdults": true
  }
}
Los máximos pueden venir como null = sin tope.
languages acá son solo los idiomas que ofrece este tour (úsalo para el selector, en vez del catálogo global de meta).
Errores: invalid_tour, unauthorized, internal_error.
GET tours/price?tour=<handle>&date=<fecha>&adults=<n>&children=<n> — solo cotización
Devuelve el objeto quote (misma forma que en availability) sin consultar el Web Service ni el cupo. Úsalo para actualizar el precio en pantalla cuando el cliente cambia cantidades/fecha, sin golpear el servicio externo. No pide language (el precio no depende del idioma).

Devuelve directamente el objeto quote en data.
Errores: invalid_tour, invalid_date, invalid_party, tour_misconfigured, unauthorized, internal_error.
10. Checklist de integración
[ ] Al cargar el widget: GET tours/meta (nacionalidades, idiomas, límites) y GET tours/config (reglas + idiomas del tour) → arma el formulario.
[ ] Al renderizar el formulario de compra: GET tours/nonce una sola vez y guarda el nonce (no lo pidas por cada envío; es lo que corta el doble-submit).
[ ] Cliente elige adultos/niños/idioma/fecha → GET tours/availability → muestra hours y el quote.total. Si party.ok === false, muestra mensaje según reason (no llames a create).
[ ] Cliente elige una hour y completa nombre/teléfono/email/nacionalidad.
[ ] Al enviar: POST tours/create con el mismo nonce guardado → redirige a Webpay con el POST de token_ws. Pide un nonce nuevo solo si responde invalid_nonce/request_expired.
[ ] Página “gracias”: lee ?token= → GET tours/result en polling → muestra el resultado según paidStatus (pending/paid/failed; nunca según la URL). Sin token (?error=invalid_token/not_found) → mensaje genérico de “no encontramos tu reserva”.
[ ] Siempre ramifica por body.success; muestra body.message en los errores. </content> </invoke>