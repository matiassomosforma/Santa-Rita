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
      markProductCard(button);
      return;
    }

    if (updatedLabel === 'agregar caja') {
      button.classList.add('sr-boxi-next-button');
      markSummary(button);
      return;
    }

    if (FILTER_LABELS.has(label) || FILTER_LABELS.has(updatedLabel)) {
      button.classList.add('sr-boxi-filter-button');

      if (button.getAttribute('aria-pressed') === 'true' || button.className.toLocaleLowerCase().includes('active')) {
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

  function markProductCard(button) {
    let node = button.parentElement;

    for (let depth = 0; node && depth < 7; depth += 1, node = node.parentElement) {
      const hasImage = Boolean(node.querySelector('img'));
      const hasPrice = /\bCLP\b|\$\s?[\d.]+/.test(node.textContent || '');

      if (hasImage && hasPrice) {
        node.classList.add('sr-boxi-product-card');

        const grid = node.parentElement;
        if (grid) grid.classList.add('sr-boxi-product-grid');

        break;
      }
    }
  }

  function markSummary(button) {
    let node = button.parentElement;

    for (let depth = 0; node && depth < 8; depth += 1, node = node.parentElement) {
      const text = normaliseLower(node.textContent || '');

      if (text.includes('total') && node.querySelector('button')) {
        node.classList.add('sr-boxi-summary');

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
    ensureIntro();
    hideStepCopy();

    document.querySelectorAll('#MainContent button').forEach((button) => {
      markButton(button);
    });
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
