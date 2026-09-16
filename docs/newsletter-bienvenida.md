# Newsletter Santa Rita

## Estado

El formulario de `sections/santa-rita-footer.liquid` envía el correo a Shopify mediante el formulario `customer`, con la etiqueta `newsletter`. Muestra éxito o los errores devueltos por Shopify. Conserva la validación de correo del navegador.

El correo automático no está activado desde este repositorio. Su diseño y envío se configuran en Shopify Messaging, no en una sección Liquid de la tienda.

## Suscriptores

En Shopify > Clientes, filtrar por la etiqueta `newsletter` y revisar el estado de suscripción al marketing por correo. La etiqueta identifica el origen; el estado de suscripción determina si corresponde enviar marketing. Si está habilitada la confirmación doble, el usuario debe confirmar primero.

## Correo preparado para el editor

- Asunto: ¡Bienvenido a Santa Rita Online!
- Vista previa: Descubre nuestros vinos, novedades y próximas promociones.
- Fondo: #FFFCF7.
- Encabezado: logo de Santa Rita.
- Título: Gracias por ser parte de Santa Rita.
- Texto: Gracias por suscribirte a nuestro newsletter. Compartiremos contigo novedades, ofertas y una selección de vinos para disfrutar en cada ocasión.
- Botón: Explorar vinos. Enlazar a la URL pública de la tienda seguida de `/collections/all`.
- Color del botón: #B8294F, con texto blanco.
- Conservar el enlace de cancelación de suscripción y los datos del remitente que proporciona el editor.

## Configuración pendiente en Shopify

1. Abrir Apps > Messaging > Automations desde un computador.
2. Crear una automatización de bienvenida a nuevos suscriptores.
3. Editar el correo con el contenido anterior. Si la plantilla incluye un descuento, eliminar ese bloque: no se ha definido una promoción para esta bienvenida.
4. Revisar remitente, enlaces y condiciones del flujo.
5. Enviar una prueba a una dirección controlada y comprobar el diseño en móvil y escritorio.
6. Activar la automatización y probar una nueva suscripción. Comprobar el mensaje del formulario, el registro en Clientes y la recepción del correo.

Documentación:
- https://shopify.dev/docs/storefronts/themes/customer-engagement/email-consent
- https://help.shopify.com/en/manual/promoting-marketing/create-marketing/shopify-messaging/marketing-automations/create
