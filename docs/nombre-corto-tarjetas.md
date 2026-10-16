# Nombre corto para tarjetas

Las tarjetas Santa Rita permiten mostrar un nombre corto sin modificar el título
del producto ni el H1 de su ficha. Se aplica en escritorio y móvil a más vendidos,
colecciones, resultados de búsqueda, búsqueda predictiva, vinos relacionados y
recomendaciones de la página 404.

## Configuración en Shopify

Crear una definición de metafield para productos con estos valores:

- Nombre: Nombre corto para tarjetas
- Espacio de nombres y clave: `custom.nombre_corto_tarjeta`
- Tipo: Texto de una sola línea
- Habilitar acceso de lectura en la tienda online si aparece esa opción.

Luego, editar cada producto y completar el metafield en la sección de metacampos.
Por ejemplo, para un producto llamado “Medalla Real Cabernet Sauvignon 750 CC”,
usar “Medalla Real Cabernet Sauvignon” como nombre corto.

Si el campo está vacío o contiene solo espacios, la tarjeta usa el título original.
El texto se escapa como HTML. No se modifican el título del producto, su URL,
su H1 ni su configuración SEO. La definición y los valores deben crearse en el
administrador de Shopify; el código del tema solamente los lee.

## Comprobación visual

1. Completar el nombre corto de un producto y comprobar su tarjeta en móvil y escritorio.
2. Abrir su ficha y comprobar que mantiene el título completo.
3. Dejar el campo vacío y comprobar que la tarjeta vuelve al título original.
