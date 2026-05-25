const ageGate = document.querySelector('[data-age-gate]');

if (ageGate instanceof HTMLElement) {
  const acceptButton = ageGate.querySelector('[data-age-gate-accept]');
  const rejectButton = ageGate.querySelector('[data-age-gate-reject]');
  const panel = ageGate.querySelector('.age-gate__panel');
  const focusableSelector = 'button:enabled, a[href], [tabindex]:not([tabindex^="-"])';
  const storageKey = ageGate.dataset.storageKey || 'santa-rita-age-gate-accepted';
  const rememberDays = Number.parseInt(ageGate.dataset.rememberDays || '30', 10);
  const redirectUrl = ageGate.dataset.redirectUrl || 'https://www.google.com/';
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  let previousActiveElement = null;

  const getStoredExpiry = () => {
    try {
      return Number.parseInt(window.localStorage.getItem(storageKey) || '0', 10);
    } catch (_error) {
      try {
        return Number.parseInt(window.sessionStorage.getItem(storageKey) || '0', 10);
      } catch (_sessionError) {
        return 0;
      }
    }
  };

  const setStoredExpiry = () => {
    const days = Number.isFinite(rememberDays) && rememberDays > 0 ? rememberDays : 30;
    const expiresAt = Date.now() + days * millisecondsPerDay;

    try {
      window.localStorage.setItem(storageKey, expiresAt.toString());
    } catch (_error) {
      try {
        window.sessionStorage.setItem(storageKey, expiresAt.toString());
      } catch (_sessionError) {
        // If storage is unavailable, keep the current page usable after acceptance.
      }
    }
  };

  const showAgeGate = () => {
    previousActiveElement = document.activeElement;
    ageGate.hidden = false;
    document.body.classList.add('age-gate-is-open');
    acceptButton?.focus();
  };

  const hideAgeGate = () => {
    ageGate.hidden = true;
    document.body.classList.remove('age-gate-is-open');
    previousActiveElement?.focus?.();
  };

  const shouldShow = () => {
    const expiresAt = getStoredExpiry();

    return !expiresAt || expiresAt <= Date.now();
  };

  if (shouldShow()) {
    window.requestAnimationFrame(showAgeGate);
  }

  acceptButton?.addEventListener('click', () => {
    setStoredExpiry();
    hideAgeGate();
  });

  rejectButton?.addEventListener('click', () => {
    window.location.assign(redirectUrl);
  });

  ageGate.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      return;
    }

    if (event.key !== 'Tab' || !(panel instanceof HTMLElement)) return;

    const focusableElements = Array.from(panel.querySelectorAll(focusableSelector)).filter(
      (element) => element instanceof HTMLElement && element.offsetParent !== null
    );

    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}
