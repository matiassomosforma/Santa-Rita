import { CartAddEvent } from '@theme/events';

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-card-quantity-change]');
  if (!button) return;
  const control = button.closest('.santa-rita-product-card__amount');
  const input = control?.querySelector('input[name="quantity"]');
  if (!input) return;
  const current = Number(input.value);
  input.value = String(Math.max(1, (Number.isFinite(current) ? Math.floor(current) : 1) + Number(button.dataset.cardQuantityChange)));
  input.dispatchEvent(new Event('change', { bubbles: true }));
});

document.addEventListener('change', (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !input.matches('.santa-rita-product-card__amount input')) return;
  const value = Number(input.value);
  input.value = String(Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1);
  input.closest('.santa-rita-product-card__amount').querySelector('[data-card-quantity-change="-1"]').disabled = Number(input.value) <= 1;
});

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
    status.classList.remove('visually-hidden');
    status.dataset.error = 'true';
    status.textContent = 'Selecciona una presentación disponible.';
    return;
  }

  const originalMarkup = button.innerHTML;
  let added = false;
  const resetButton = () => {
    delete form.dataset.addingToCart;
    delete button.dataset.cartState;
    button.disabled = false;
    button.innerHTML = originalMarkup;
  };
  form.dataset.addingToCart = 'true';
  button.disabled = true;
  button.dataset.cartState = 'loading';
  const buttonLabel = button.querySelector('.santa-rita-product-card__button-label') || button;
  buttonLabel.textContent = 'Agregando…';
  form.setAttribute('aria-busy', 'true');
  status.textContent = '';
  status.classList.add('visually-hidden');
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
    added = true;
    button.dataset.cartState = 'added';
    button.innerHTML = '<svg class="santa-rita-cart-check" viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="santa-rita-product-card__button-label">Agregado</span>';
    status.textContent = 'Producto agregado al carrito.';
    document.dispatchEvent(new CartAddEvent(result, String(body.get('id')), {
      source: 'product-form-component',
      itemCount: Number(body.get('quantity')) || 1,
      productId: form.dataset.wshProductId,
      sections: result.sections,
      skipCartDrawer: true,
    }));
    // Card additions always open the minicart, regardless of the theme's auto-open setting.
    document.querySelector('cart-drawer-component')?.open();
  } catch (error) {
    status.classList.remove('visually-hidden');
    status.dataset.error = 'true';
    status.textContent = error instanceof TypeError
      ? 'No pudimos confirmar la operación. Revisa tu carrito antes de volver a intentarlo.'
      : error.message || 'No se pudo agregar el producto. Inténtalo nuevamente.';
  } finally {
    form.removeAttribute('aria-busy');
    if (added) {
      window.setTimeout(() => {
        resetButton();
        status.textContent = '';
      }, 2400);
    } else {
      resetButton();
    }
  }
});
