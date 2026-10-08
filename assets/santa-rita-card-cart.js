import { CartAddEvent } from '@theme/events';

// Delegation also covers cards replaced by filtering or infinite scrolling.
document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches('.santa-rita-product-card__form')) return;
  event.preventDefault();
  if (form.dataset.addingToCart === 'true') return;

  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('[data-cart-status]');
  if (!button || !status) return;
  const body = new FormData(form);
  if (!body.get('id')) {
    status.textContent = 'Selecciona una presentación disponible.';
    return;
  }

  const originalLabel = button.textContent;
  form.dataset.addingToCart = 'true';
  button.disabled = true;
  button.textContent = 'Agregando…';
  form.setAttribute('aria-busy', 'true');
  status.textContent = '';
  delete status.dataset.error;

  const sections = [...new Set(Array.from(document.querySelectorAll('cart-items-component'),
    (item) => item.dataset.sectionId).filter(Boolean))].slice(0, 5);
  if (sections.length) body.set('sections', sections.join(','));
  body.set('sections_url', window.location.pathname);

  try {
    const response = await fetch(Theme.routes.cart_add_url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body,
    });
    const result = await response.json();
    if (!response.ok || result.status) {
      throw new Error(typeof result.description === 'string' ? result.description : 'No se pudo agregar el producto. Inténtalo nuevamente.');
    }
    status.textContent = 'Producto agregado exitosamente. Puedes seguir comprando.';
    document.dispatchEvent(new CartAddEvent(result, String(body.get('id')), {
      source: 'product-form-component',
      itemCount: Number(body.get('quantity')) || 1,
      productId: form.dataset.wshProductId,
      sections: result.sections,
      skipCartDrawer: true,
    }));
  } catch (error) {
    status.dataset.error = 'true';
    status.textContent = error instanceof TypeError
      ? 'No pudimos confirmar la operación. Revisa tu carrito antes de volver a intentarlo.'
      : error.message || 'No se pudo agregar el producto. Inténtalo nuevamente.';
  } finally {
    delete form.dataset.addingToCart;
    form.removeAttribute('aria-busy');
    button.disabled = false;
    button.textContent = originalLabel;
  }
});
