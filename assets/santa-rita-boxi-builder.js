(() => {
  const BUILDER_PATH = '/apps/boxi/box-builder';
  const INTRO_ID = 'sr-boxi-intro';
  const FILTER_LABELS = new Set([
    'all products',
    'todos los vinos',
    'tintos',
    'blancos',
    'rose',
    'rosé',
    'espumantes',
    'gran reserva',
    'reserva',
    'reserva especial',
    'ultra premium',
    'varietal',
  ]);
  const PRICE_PATTERN = /\bCLP\b|\$\s?[\d.]+|\b\d{1,3}(?:[.,]\d{3})+\b/;

  if (!window.location.pathname.includes(BUILDER_PATH)) return;

  document.body.classList.add('santa-rita-boxi-builder-page');

  function normalise(text) {
    return text.trim().replace(/\s+/g, ' ');
  }

  function normaliseLower(text) {
    return normalise(text).toLocaleLowerCase('es-CL');
  }

  function ensureIntro() {
    const main = document.getElementById('MainContent');

    if (!main || document.getElementById(INTRO_ID)) return;

    const intro = document.createElement('section');
    intro.id = INTRO_ID;
    intro.className = 'sr-boxi-intro';
    intro.innerHTML = `
      <nav class="sr-boxi-breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Inicio</a>
        <span aria-hidden="true">&gt;</span>
        <a href="/pages/arma-tu-caja">Arma tu caja</a>
        <span aria-hidden="true">&gt;</span>
        <strong>Elegir vinos</strong>
      </nav>
      <h1>Elige tus vinos</h1>
      <p>Arma tu caja con 6 botellas para una experiencia completa.</p>
    `;

    main.prepend(intro);
  }

  function updateButtonText(button) {
    const label = normaliseLower(button.textContent || '');

    if (label === 'all products') {
      button.textContent = 'Todos los vinos';
      return;
    }

    if (label === 'add') {
      button.textContent = 'Agregar al carro';
      return;
    }

    if (label === 'next') {
      button.textContent = 'Agregar caja';
    }
  }

  function normalisePriceText() {
    const walker = document.createTreeWalker(document.getElementById('MainContent') || document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach((node) => {
      if (node.parentElement?.closest(`#${INTRO_ID}`)) return;

      const nextValue = node.nodeValue
        .replace(/\bCLP\s+(?=[\d$])/g, '')
        .replace(/\b(\d{1,3}(?:,\d{3})+)\b/g, (match) => match.replace(/,/g, '.'));

      if (nextValue !== node.nodeValue) {
        node.nodeValue = nextValue;
      }
    });
  }

  function markButton(button) {
    const label = normaliseLower(button.textContent || '');

    updateButtonText(button);

    const updatedLabel = normaliseLower(button.textContent || '');

    button.classList.remove('sr-boxi-filter-button', 'sr-boxi-add-button', 'sr-boxi-next-button', 'sr-boxi-qty-button');

    if (updatedLabel === '+' || updatedLabel === '-' || updatedLabel === '−') {
      button.classList.add('sr-boxi-qty-button');
      return;
    }

    if (updatedLabel === 'agregar al carro') {
      button.classList.add('sr-boxi-add-button');
      return;
    }

    if (updatedLabel === 'agregar caja') {
      button.classList.add('sr-boxi-next-button');
      markSummary(button);
      return;
    }

    if (FILTER_LABELS.has(label) || FILTER_LABELS.has(updatedLabel)) {
      button.classList.add('sr-boxi-filter-button');

      if (button.getAttribute('aria-pressed') === 'true' || button.getAttribute('aria-selected') === 'true') {
        button.classList.add('is-active');
      }

      markFilterRow(button);
    }
  }

  function markFilterRow(button) {
    let node = button.parentElement;

    for (let depth = 0; node && depth < 4; depth += 1, node = node.parentElement) {
      const buttons = Array.from(node.querySelectorAll('button'));
      const filterButtons = buttons.filter((candidate) => {
        const label = normaliseLower(candidate.textContent || '');
        return FILTER_LABELS.has(label);
      });

      if (filterButtons.length >= 2) {
        node.classList.add('sr-boxi-filter-row');

        if (!filterButtons.some((candidate) => candidate.classList.contains('is-active'))) {
          filterButtons[0].classList.add('is-active');
        }

        break;
      }
    }
  }

  function clearGeneratedClasses() {
    document
      .querySelectorAll(
        '.sr-boxi-product-card, .sr-boxi-product-grid, .sr-boxi-product-title, .sr-boxi-summary-band, .sr-boxi-summary, .sr-boxi-slots, .sr-boxi-total'
      )
      .forEach((element) => {
        element.classList.remove(
          'sr-boxi-product-card',
          'sr-boxi-product-grid',
          'sr-boxi-product-title',
          'sr-boxi-summary-band',
          'sr-boxi-summary',
          'sr-boxi-slots',
          'sr-boxi-total'
        );
      });
  }

  function isBuilderChrome(element) {
    return (
      element.id === 'MainContent' ||
      element.id === INTRO_ID ||
      element.classList.contains('sr-boxi-intro') ||
      element.classList.contains('sr-boxi-filter-row') ||
      element.classList.contains('sr-boxi-summary') ||
      Boolean(element.querySelector('.sr-boxi-intro, .sr-boxi-filter-row, .sr-boxi-summary'))
    );
  }

  function markProductCards() {
    const main = document.getElementById('MainContent');
    if (!main) return;

    const cards = new Set();

    main.querySelectorAll('img').forEach((image) => {
      if (image.closest(`#${INTRO_ID}, header, footer, .sr-boxi-summary`)) return;

      let node = image.parentElement;

      for (let depth = 0; node && depth < 7; depth += 1, node = node.parentElement) {
        const text = normalise(node.textContent || '');
        const imageCount = node.querySelectorAll('img').length;
        const buttonCount = node.querySelectorAll('button').length;
        const hasPrice = PRICE_PATTERN.test(text);

        if (isBuilderChrome(node)) continue;

        if (hasPrice && imageCount <= 2 && buttonCount <= 3) {
          cards.add(node);
          break;
        }
      }
    });

    cards.forEach((card) => card.classList.add('sr-boxi-product-card'));
    cards.forEach(markProductTitle);

    Array.from(cards)
      .map((card) => card.parentElement)
      .filter(Boolean)
      .forEach((parent) => {
        if (parent.querySelectorAll('.sr-boxi-product-card').length >= 2) {
          parent.classList.add('sr-boxi-product-grid');
        }
      });
  }

  function markProductTitle(card) {
    const explicitTitle = card.querySelector(
      "h1, h2, h3, h4, h5, a, [class*='title' i], [class*='name' i]"
    );

    if (explicitTitle) {
      explicitTitle.classList.add('sr-boxi-product-title');
      return;
    }

    const title = Array.from(card.querySelectorAll('div, span, p')).find((element) => {
      const text = normalise(element.textContent || '');

      return (
        text.length > 3 &&
        text.length < 120 &&
        !PRICE_PATTERN.test(text) &&
        !element.querySelector('img, button') &&
        !['agregar al carro', 'add', '+', '-', '−'].includes(normaliseLower(text))
      );
    });

    if (title) title.classList.add('sr-boxi-product-title');
  }

  function markSummary(button) {
    let node = button.parentElement;

    for (let depth = 0; node && depth < 8; depth += 1, node = node.parentElement) {
      const text = normaliseLower(node.textContent || '');

      if (text.includes('total') && node.querySelector('button')) {
        node.classList.add('sr-boxi-summary');
        markSummaryBand(node);

        const total = Array.from(node.querySelectorAll('div, p, span')).find((candidate) =>
          normaliseLower(candidate.textContent || '').includes('total')
        );

        if (total) total.classList.add('sr-boxi-total');

        const imageContainer = Array.from(node.children).find((child) => child.querySelector?.('img'));
        if (imageContainer) imageContainer.classList.add('sr-boxi-slots');

        break;
      }
    }
  }

  function markSummaryBand(summary) {
    let node = summary.parentElement;

    for (let depth = 0; node && depth < 3; depth += 1, node = node.parentElement) {
      if (node.id === 'MainContent' || node.classList.contains('sr-boxi-product-grid')) return;

      node.classList.add('sr-boxi-summary-band');

      if (node.getBoundingClientRect().height >= summary.getBoundingClientRect().height) break;
    }
  }

  function hideStepCopy() {
    document.querySelectorAll('#MainContent *').forEach((element) => {
      const text = normaliseLower(element.textContent || '');
      const childCount = element.children.length;

      if (childCount > 4) return;

      if (text === 'filtro productos' || text === 'my custom data step') {
        element.classList.add('sr-boxi-stepper');
      }
    });
  }

  function hydrate() {
    clearGeneratedClasses();
    ensureIntro();
    normalisePriceText();
    hideStepCopy();

    document.querySelectorAll('#MainContent button').forEach((button) => {
      markButton(button);
    });

    markProductCards();
  }

  const observer = new MutationObserver(() => hydrate());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      hydrate();
      observer.observe(document.getElementById('MainContent') || document.body, { childList: true, subtree: true });
    });
  } else {
    hydrate();
    observer.observe(document.getElementById('MainContent') || document.body, { childList: true, subtree: true });
  }
})();
