# Exclusiones de productos

En cada sección **Santa Rita más vendidos** (incluidas las instancias tituladas
**Nuevos lanzamientos**), configura **Colecciones excluidas** y **Etiquetas de
producto excluidas**. Se aplican tanto a productos manuales como a la colección
fallback. Se mantiene la exclusión de tours que ya tenía esta sección.

Para todos los **SR vinos relacionados**, usa **Configuración del tema → SR
exclusiones relacionados**. Permite excluir colecciones, etiquetas y productos
individuales. Cada sección también admite exclusiones adicionales por colección
y etiqueta; se suman a las generales.

Las etiquetas se separan con comas y coinciden por nombre completo, ignorando
mayúsculas y espacios exteriores. Basta coincidir con una regla para excluir.
Los controles vacíos no agregan restricciones. No modifican el catálogo ni la
visibilidad del producto en búsqueda u otras páginas.

El límite de tarjetas se aplica después del filtrado. Los relacionados filtran
también el relleno y evitan repetir productos. Si no quedan candidatos, la sección
no muestra un carrusel vacío en la tienda. Las colecciones usan los candidatos que
Liquid entrega (hasta 50 sin paginación); las recomendaciones solicitan hasta 10.
Por ello, una exclusión amplia puede dejar menos tarjetas que el máximo configurado.

## Verificación en tienda

Ejecuta `shopify theme check` y abre una vista de desarrollo con
`shopify theme dev --store santa-rita-dev.myshopify.com`.

Comprueba en escritorio y móvil: una colección excluida, etiquetas con distintas
mayúsculas, productos manuales, un producto excluido globalmente en relacionados,
relleno sin duplicados y todos los candidatos excluidos. Verifica que los cambios
se reflejen al guardar los ajustes en el editor. Los controles están traducidos al
español y al inglés.
