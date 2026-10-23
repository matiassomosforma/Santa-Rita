# Informe de Theme Check

Comando: `shopify theme check --output json`

214 errores y 463 advertencias. Ningún hallazgo en los archivos modificados para las exclusiones de productos. Los hallazgos del analizador no equivalen necesariamente a fallos visibles en la tienda; las referencias de aplicaciones requieren verificación en Shopify.

## Errores

### blocks/_header-logo.liquid

- Línea 71 — **ImgWidthAndHeight**: Missing width attribute on img tag
- Línea 95 — **ImgWidthAndHeight**: Missing width attribute on img tag

### snippets/header-drawer.liquid

- Línea 70 — **ImgWidthAndHeight**: Missing width attribute on img tag

### templates/collection.wpd_collection_data.liquid

- Línea 3 — **MissingTemplate**: 'snippets/wpd_product_limit.liquid' does not exist
- Línea 18 — **MissingTemplate**: 'snippets/wlm-product.liquid' does not exist
- Línea 20 — **MissingTemplate**: 'snippets/wlm-product.liquid' does not exist

### templates/search.wcp_discount_api.liquid

- Línea 2 — **ContentForHeaderModification**: Do not rely on the content of `content_for_header`

### templates/search.wpd_search_data.liquid

- Línea 3 — **MissingTemplate**: 'snippets/wpd_product_limit.liquid' does not exist
- Línea 17 — **MissingTemplate**: 'snippets/wlm-search.liquid' does not exist
- Línea 19 — **MissingTemplate**: 'snippets/wlm-search.liquid' does not exist

### snippets/wcp_net.liquid

- Línea 1022 — **ImgWidthAndHeight**: Missing width and height attributes on img tag

### locales/es.json

- Línea 383 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.addMore' does not exist
- Línea 384 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.addMoreFrom' does not exist
- Línea 385 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.unlockPercentageDiscount' does not exist
- Línea 386 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.unlockFixedAmountDiscount' does not exist
- Línea 387 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.addMoreToUnlock' does not exist
- Línea 388 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.addMoreQuantity' does not exist
- Línea 389 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.addMoreAmount' does not exist
- Línea 390 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.bundleAt' does not exist
- Línea 391 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.bundleAtPerItem' does not exist
- Línea 392 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.addToBundle' does not exist
- Línea 393 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.added' does not exist
- Línea 394 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.addBundleToCart' does not exist
- Línea 395 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.alertSoldOut' does not exist
- Línea 396 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.bundleAddedToCart' does not exist
- Línea 397 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.addToCartButtonTooltip' does not exist
- Línea 398 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.appliedTier' does not exist
- Línea 399 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.loadMore' does not exist
- Línea 400 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.loading' does not exist
- Línea 401 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.pick' does not exist
- Línea 402 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.soldOut' does not exist
- Línea 403 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.atLeast' does not exist
- Línea 404 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.maximumOf' does not exist
- Línea 405 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.lessThan' does not exist
- Línea 406 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.tabHeading' does not exist
- Línea 407 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.totalPrice' does not exist
- Línea 408 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.saved' does not exist
- Línea 409 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.unavailable' does not exist
- Línea 410 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.viewCart' does not exist
- Línea 411 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.selectOnce' does not exist
- Línea 412 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.noteHeader' does not exist
- Línea 413 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.required' does not exist
- Línea 414 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.checkout' does not exist
- Línea 415 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.createAnother' does not exist
- Línea 416 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.quantity' does not exist
- Línea 417 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.optional' does not exist
- Línea 418 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.quickviewIconText' does not exist
- Línea 419 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.filterBy' does not exist
- Línea 420 — **MatchingTranslations**: A default translation for 'sections.byob-custom-messages.stepBuilderReady' does not exist

### locales/cs.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/da.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/de.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/fi.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/fr.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/it.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/ja.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/ko.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/nb.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/nl.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/pl.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/pt-BR.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/pt-PT.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/sv.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/th.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/tr.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/zh-CN.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### locales/zh-TW.schema.json

- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.collections' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.tags_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.related_info' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.products' is missing
- Línea 10 — **MatchingTranslations**: The translation for 'sr_exclusions.local_info' is missing

### templates/product.json

- Línea 297 — **JSONMissingBlock**: Theme block 'blocks/shopify://apps/judge-me-reviews/blocks/review_widget/61ccd3b1-a9f2-4160-9fe9-4fec8413e5d8.liquid' does not exist.

### sections/byob-custom-messages.liquid

- Línea 12 — **TranslationKeyExists**: 'sections.byob-custom-messages.addMore' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 13 — **TranslationKeyExists**: 'sections.byob-custom-messages.addMoreFrom' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 14 — **TranslationKeyExists**: 'sections.byob-custom-messages.unlockPercentageDiscount' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 15 — **TranslationKeyExists**: 'sections.byob-custom-messages.unlockFixedAmountDiscount' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 16 — **TranslationKeyExists**: 'sections.byob-custom-messages.addMoreToUnlock' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 17 — **TranslationKeyExists**: 'sections.byob-custom-messages.addMoreQuantity' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 18 — **TranslationKeyExists**: 'sections.byob-custom-messages.addMoreAmount' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 19 — **TranslationKeyExists**: 'sections.byob-custom-messages.bundleAt' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 20 — **TranslationKeyExists**: 'sections.byob-custom-messages.bundleAtPerItem' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 21 — **TranslationKeyExists**: 'sections.byob-custom-messages.addToBundle' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 22 — **TranslationKeyExists**: 'sections.byob-custom-messages.added' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 23 — **TranslationKeyExists**: 'sections.byob-custom-messages.addBundleToCart' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 24 — **TranslationKeyExists**: 'sections.byob-custom-messages.alertSoldOut' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 25 — **TranslationKeyExists**: 'sections.byob-custom-messages.addToCartButtonTooltip' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 26 — **TranslationKeyExists**: 'sections.byob-custom-messages.appliedTier' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 27 — **TranslationKeyExists**: 'sections.byob-custom-messages.bundleAddedToCart' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 28 — **TranslationKeyExists**: 'sections.byob-custom-messages.loadMore' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 29 — **TranslationKeyExists**: 'sections.byob-custom-messages.loading' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 30 — **TranslationKeyExists**: 'sections.byob-custom-messages.pick' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 31 — **TranslationKeyExists**: 'sections.byob-custom-messages.soldOut' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 32 — **TranslationKeyExists**: 'sections.byob-custom-messages.atLeast' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 33 — **TranslationKeyExists**: 'sections.byob-custom-messages.maximumOf' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 34 — **TranslationKeyExists**: 'sections.byob-custom-messages.lessThan' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 35 — **TranslationKeyExists**: 'sections.byob-custom-messages.tabHeading' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 36 — **TranslationKeyExists**: 'sections.byob-custom-messages.totalPrice' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 37 — **TranslationKeyExists**: 'sections.byob-custom-messages.saved' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 38 — **TranslationKeyExists**: 'sections.byob-custom-messages.unavailable' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 39 — **TranslationKeyExists**: 'sections.byob-custom-messages.viewCart' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 40 — **TranslationKeyExists**: 'sections.byob-custom-messages.selectOnce' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 41 — **TranslationKeyExists**: 'sections.byob-custom-messages.noteHeader' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 42 — **TranslationKeyExists**: 'sections.byob-custom-messages.required' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 43 — **TranslationKeyExists**: 'sections.byob-custom-messages.checkout' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 44 — **TranslationKeyExists**: 'sections.byob-custom-messages.createAnother' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 45 — **TranslationKeyExists**: 'sections.byob-custom-messages.quantity' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 46 — **TranslationKeyExists**: 'sections.byob-custom-messages.optional' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 47 — **TranslationKeyExists**: 'sections.byob-custom-messages.quickviewIconText' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 48 — **TranslationKeyExists**: 'sections.byob-custom-messages.filterBy' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'
- Línea 49 — **TranslationKeyExists**: 'sections.byob-custom-messages.stepBuilderReady' does not have a matching entry in 'locales/en.default.json' or 'sections/byob-custom-messages.liquid'

## Advertencias por categoría

- VariableName: 260
- UndefinedObject: 99
- DeprecatedTag: 45
- UnusedAssign: 17
- ValidScopedCSSClass: 11
- DeprecatedFilter: 9
- RemoteAsset: 9
- OrphanedSnippet: 7
- UnrecognizedRenderSnippetArguments: 3
- ValidRenderSnippetArgumentTypes: 1
- MissingRenderSnippetArguments: 1
- UnusedDocParam: 1
