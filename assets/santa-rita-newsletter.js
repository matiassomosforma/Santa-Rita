// Keep Shopify's native form as a fallback and show only server-confirmed results.
document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches('.santa-rita-footer__form')) return;
  if (event.defaultPrevented) return;
  event.preventDefault();
  if (form.getAttribute('aria-busy') === 'true') return;

  const button = form.querySelector('button[type="submit"]');
  const input = form.querySelector('input[type="email"]');
  const label = button.textContent;
  // Match the native customer form's application/x-www-form-urlencoded body.
  const data = new URLSearchParams();
  for (const [name, value] of new FormData(form)) {
    if (typeof value === 'string') data.append(name, value);
  }
  form.querySelector('.santa-rita-footer__message')?.remove();
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
  form.setAttribute('aria-busy', 'true');
  button.disabled = true;
  button.textContent = 'Enviando…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      credentials: 'same-origin',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const url = new URL(response.url);
    // Shopify may require an interactive anti-spam challenge.
    if (url.origin === location.origin && /\/challenge(?:\/|$)/.test(url.pathname)) {
      location.assign(url.href);
      return;
    }
    const html = new DOMParser().parseFromString(await response.text(), 'text/html');
    const returnedForm = html.getElementById(form.id);
    const message = returnedForm?.querySelector('.santa-rita-footer__message');
    if (!message) throw new Error('Unconfirmed submission');

    const result = document.importNode(message, true);
    result.removeAttribute('autofocus');
    result.tabIndex = -1;
    form.append(result);
    input.setAttribute('aria-describedby', result.id);
    if (result.classList.contains('santa-rita-footer__message--error')) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.value = '';
    }
    result.focus({ preventScroll: true });
  } catch (failure) {
    const error = document.createElement('div');
    error.id = `${form.id}-error`;
    error.className = 'santa-rita-footer__message santa-rita-footer__message--error';
    error.setAttribute('role', 'alert');
    error.tabIndex = -1;
    error.textContent = failure instanceof Error && failure.message === 'HTTP 500'
      ? 'El servidor no pudo procesar la solicitud (error 500). No pudimos confirmar tu suscripción. Inténtalo más tarde.'
      : 'No pudimos confirmar tu suscripción. Inténtalo nuevamente. Si el problema continúa, recarga la página.';
    form.append(error);
    input.setAttribute('aria-describedby', error.id);
    error.focus({ preventScroll: true });
  } finally {
    form.removeAttribute('aria-busy');
    button.disabled = false;
    button.textContent = label;
  }
});
