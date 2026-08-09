(() => {
  const currency = String(
    window.Shopify?.currency?.active || window.Shopify?.currency?.currencyCode || window.Shopify?.currency?.isoCode || 'CLP'
  ).toUpperCase();

  if (currency !== 'CLP') return;

  const PRICE_SELECTOR = [
    '.sr-wsh-price',
    '.sr-wsh-compare-price',
    '[data-wpd-product-id]',
    '.price',
    '.compare-at-price',
    '.cart-items__price',
    '.cart-totals',
  ].join(',');

  const MONEY_PATTERN = /(\$\s*)(\d{1,3}(?:,\d{3})+)(?![.,]\d)/g;

  function normalizeText(text) {
    return text.replace(MONEY_PATTERN, (_, symbol, amount) => `${symbol}${amount.replaceAll(',', '.')}`);
  }

  function normalizeNode(node) {
    if (!(node instanceof Element) || !node.matches(PRICE_SELECTOR)) return;

    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let child = walker.nextNode();

    while (child) {
      if (!child.nodeValue?.includes(',')) {
        child = walker.nextNode();
        continue;
      }

      const nextValue = normalizeText(child.nodeValue);
      if (nextValue !== child.nodeValue) child.nodeValue = nextValue;
      child = walker.nextNode();
    }
  }

  function normalizePrices(root = document) {
    if (root instanceof Element) normalizeNode(root);
    root.querySelectorAll?.(PRICE_SELECTOR).forEach(normalizeNode);
  }

  const scheduleNormalize = (() => {
    let frame = 0;

    return () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => normalizePrices());
    };
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleNormalize, { once: true });
  } else {
    scheduleNormalize();
  }

  window.addEventListener('load', scheduleNormalize);

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        const parent = mutation.target.parentElement;
        if (parent?.closest(PRICE_SELECTOR)) return scheduleNormalize();
      }

      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element && (node.matches(PRICE_SELECTOR) || node.querySelector(PRICE_SELECTOR))) {
            return scheduleNormalize();
          }
        }
      }
    }
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
