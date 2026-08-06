import { Component } from '@theme/component';
import { debounce, onAnimationEnd, prefersReducedMotion } from '@theme/utilities';
import { sectionRenderer } from '@theme/section-renderer';
import { morph } from '@theme/morph';
import { RecentlyViewed } from '@theme/recently-viewed-products';
import { DialogCloseEvent, DialogOpenEvent, DialogComponent } from '@theme/dialog';

/**
 * A custom element that allows the user to search for resources available on the store.
 *
 * @typedef {object} Refs
 * @property {HTMLInputElement} searchInput - The search input element.
 * @property {HTMLElement} predictiveSearchResults - The predictive search results container.
 * @property {HTMLElement} resetButton - The reset button element.
 * @property {HTMLElement[]} [resultsItems] - The search results items elements.
 * @property {HTMLFormElement} [form] - The predictive search form.
 * @property {HTMLElement} [recentlyViewedWrapper] - The recently viewed products wrapper.
 * @property {HTMLElement[]} [recentlyViewedTitle] - The recently viewed title elements.
 * @property {HTMLElement[]} [recentlyViewedItems] - The recently viewed product items.
 * @extends {Component<Refs>}
 */
class PredictiveSearchComponent extends Component {
  requiredRefs = ['searchInput', 'predictiveSearchResults', 'resetButton'];

  #controller = new AbortController();

  /**
   * @type {AbortController | null}
   */
  #activeFetch = null;

  #emptyStateLoaded = false;

  #SANTA_RITA_SEARCH_STORAGE_KEY = 'santaRitaRecentSearches';

  #SANTA_RITA_MAX_SUGGESTIONS = 4;

  /**
   * Get the dialog component.
   * @returns {DialogComponent | null} The dialog component.
   */
  get dialog() {
    return this.closest('dialog-component');
  }

  connectedCallback() {
    super.connectedCallback();

    const { dialog } = this;
    const { signal } = this.#controller;

    if (this.refs.searchInput.value.length > 0) {
      this.#showResetButton();
    }

    if (dialog) {
      document.addEventListener('keydown', this.#handleKeyboardShortcut, { signal });
      dialog.addEventListener(DialogCloseEvent.eventName, this.#handleDialogClose, { signal });
      dialog.addEventListener(DialogOpenEvent.eventName, this.#handleDialogOpen, { signal, once: true });

      this.addEventListener('click', this.#handleModalClick, { signal });
    }

    if (this.dataset.santaRitaSearch === 'true') {
      this.refs.form?.addEventListener('submit', this.#handleSantaRitaSearchSubmit, { signal });
      this.#hydrateSantaRitaSuggestions(this.refs.predictiveSearchResults);
    }

    if (this.dataset.santaRitaSearch !== 'true' && RecentlyViewed.getProducts().length > 0) {
      requestIdleCallback(() => {
        this.#loadEmptyState();
      });
    }
  }

  /**
   * Handles clicks within the predictive search modal to maintain focus on the input
   * @param {MouseEvent} event - The mouse event
   */
  #handleModalClick = (event) => {
    const target = /** @type {HTMLElement} */ (event.target);
    const isInteractiveElement =
      target instanceof HTMLButtonElement ||
      target instanceof HTMLAnchorElement ||
      target instanceof HTMLInputElement ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input');

    if (!isInteractiveElement && this.refs.searchInput) {
      this.refs.searchInput.focus();
    }
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#controller.abort();
  }

  /**
   * Handles the CMD+K key combination.
   * @param {KeyboardEvent} event - The keyboard event.
   */
  #handleKeyboardShortcut = (event) => {
    if (event.metaKey && event.key === 'k') {
      this.dialog?.toggleDialog();
    }
  };

  /**
   * Handles the dialog close event.
   */
  #handleDialogClose = () => {
    this.#resetSearch();
  };

  #handleDialogOpen = () => {
    if (
      this.dataset.santaRitaSearch !== 'true' &&
      !this.#emptyStateLoaded &&
      RecentlyViewed.getProducts().length > 0
    ) {
      this.#loadEmptyState();
    }
  };

  #loadEmptyState() {
    if (this.#emptyStateLoaded) return;
    this.#emptyStateLoaded = true;
    this.resetSearch(false);
  }

  /**
   * Stores submitted search terms so the empty state can become dynamic over time.
   */
  #handleSantaRitaSearchSubmit = () => {
    this.#storeSantaRitaSearchTerm(this.refs.searchInput.value);
  };

  /**
   * @param {string} searchTerm
   */
  #storeSantaRitaSearchTerm(searchTerm) {
    const normalizedTerm = searchTerm.trim().replace(/\s+/g, ' ');
    if (!normalizedTerm) return;

    const recentSearches = this.#getSantaRitaSearchTerms().filter(
      (term) => term.toLowerCase() !== normalizedTerm.toLowerCase()
    );

    recentSearches.unshift(normalizedTerm);
    try {
      localStorage.setItem(
        this.#SANTA_RITA_SEARCH_STORAGE_KEY,
        JSON.stringify(recentSearches.slice(0, this.#SANTA_RITA_MAX_SUGGESTIONS))
      );
    } catch {
      // If storage is unavailable, keep the static fallback suggestions.
    }
  }

  #getSantaRitaSearchTerms() {
    try {
      const terms = JSON.parse(localStorage.getItem(this.#SANTA_RITA_SEARCH_STORAGE_KEY) || '[]');
      return Array.isArray(terms) ? terms.filter((term) => typeof term === 'string' && term.trim()) : [];
    } catch {
      return [];
    }
  }

  /**
   * @param {ParentNode} root
   */
  async #hydrateSantaRitaSuggestions(root) {
    if (this.dataset.santaRitaSearch !== 'true') return;

    const suggestionsList = root.querySelector('[data-sr-search-suggestions-list]');
    if (!(suggestionsList instanceof HTMLElement)) return;

    const suggestions = this.#getSantaRitaSearchTerms().map((term) => ({
      label: term,
      url: this.#getSearchUrl(term),
    }));

    if (suggestions.length < this.#SANTA_RITA_MAX_SUGGESTIONS) {
      const viewedProductSuggestions = await this.#getSantaRitaViewedProductSuggestions();

      for (const suggestion of viewedProductSuggestions) {
        const isDuplicate = suggestions.some(
          (item) => item.label.toLowerCase() === suggestion.label.toLowerCase() || item.url === suggestion.url
        );

        if (!isDuplicate) {
          suggestions.push(suggestion);
        }

        if (suggestions.length >= this.#SANTA_RITA_MAX_SUGGESTIONS) break;
      }
    }

    if (suggestions.length === 0) {
      this.#wireSantaRitaDefaultSuggestions(suggestionsList);
      return;
    }

    suggestionsList.replaceChildren(
      ...suggestions.slice(0, this.#SANTA_RITA_MAX_SUGGESTIONS).map((suggestion) => {
        const item = document.createElement('li');
        item.className = 'santa-rita-search-suggestions__item';
        item.setAttribute('ref', 'resultsItems[]');

        const link = document.createElement('a');
        link.href = suggestion.url;
        link.textContent = suggestion.label;
        link.addEventListener('click', () => {
          if (suggestion.type !== 'product') {
            this.#storeSantaRitaSearchTerm(suggestion.label);
          }
        });

        item.append(link);
        return item;
      })
    );
  }

  /**
   * @param {HTMLElement} suggestionsList
   */
  #wireSantaRitaDefaultSuggestions(suggestionsList) {
    const defaultSuggestionLinks = suggestionsList.querySelectorAll('[data-sr-default-suggestion] a');

    defaultSuggestionLinks.forEach((link) => {
      link.addEventListener(
        'click',
        () => {
          this.#storeSantaRitaSearchTerm(link.textContent || '');
        },
        { once: true }
      );
    });
  }

  /**
   * @param {string} term
   */
  #getSearchUrl(term) {
    const searchUrl = new URL(Theme.routes.search_url, location.origin);
    searchUrl.searchParams.set('q', term);
    searchUrl.searchParams.set('options[prefix]', 'last');
    return searchUrl.toString();
  }

  async #getSantaRitaViewedProductSuggestions() {
    const recentlyViewedMarkup = await this.#getRecentlyViewedProductsMarkup();
    if (!recentlyViewedMarkup) return [];

    const parsedMarkup = new DOMParser().parseFromString(recentlyViewedMarkup, 'text/html');
    const productCards = Array.from(parsedMarkup.querySelectorAll('#predictive-search-products li'));

    return productCards
      .map((card) => {
        const link = card.querySelector('a[href]');
        if (!(link instanceof HTMLAnchorElement)) return null;

        const title = card.querySelector('.resource-card__title');
        const label = title?.textContent?.trim().replace(/\s+/g, ' ');
        if (!label) return null;

        return {
          label,
          url: link.href,
          type: 'product',
        };
      })
      .filter(Boolean)
      .slice(0, this.#SANTA_RITA_MAX_SUGGESTIONS);
  }

  get #allResultsItems() {
    const containers = Array.from(
      this.querySelectorAll(
        '.predictive-search-results__wrapper-queries, ' +
          '.predictive-search-results__wrapper-products, ' +
          '.predictive-search-results__list'
      )
    );

    const allItems = containers
      .flatMap((container) => {
        if (container.classList.contains('predictive-search-results__wrapper-products')) {
          return Array.from(container.querySelectorAll('.predictive-search-results__card'));
        }
        return Array.from(container.querySelectorAll('[ref="resultsItems[]"], .predictive-search-results__card'));
      })
      .filter((item) => item instanceof HTMLElement);

    return /** @type {HTMLElement[]} */ (allItems);
  }

  /**
   * Track whether the last interaction was keyboard-based
   * @type {boolean}
   */
  #isKeyboardNavigation = false;

  get #currentIndex() {
    return this.#allResultsItems?.findIndex((item) => item.getAttribute('aria-selected') === 'true') ?? -1;
  }

  set #currentIndex(index) {
    if (!this.#allResultsItems?.length) return;

    let activeItem = null;

    this.#allResultsItems.forEach((item) => {
      item.classList.remove('keyboard-focus');
    });

    for (const [itemIndex, item] of this.#allResultsItems.entries()) {
      if (itemIndex === index) {
        item.setAttribute('aria-selected', 'true');
        if (this.#isKeyboardNavigation) {
          item.classList.add('keyboard-focus');
        }
        activeItem = item;
      } else {
        item.removeAttribute('aria-selected');
      }
    }

    activeItem?.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'nearest' });
    this.refs.searchInput.focus();
  }

  get #currentItem() {
    return this.#allResultsItems?.[this.#currentIndex];
  }

  /**
   * Navigate through the predictive search results using arrow keys or close them with the Escape key.
   * @param {KeyboardEvent} event - The keyboard event.
   */
  onSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.#resetSearch();
      return;
    }

    if (!this.#allResultsItems?.length || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      return;
    }

    const currentIndex = this.#currentIndex;
    const totalItems = this.#allResultsItems.length;

    switch (event.key) {
      case 'ArrowDown':
        this.#isKeyboardNavigation = true;
        event.preventDefault();
        this.#currentIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
        break;

      case 'Tab':
        if (event.shiftKey) {
          this.#isKeyboardNavigation = true;
          event.preventDefault();
          this.#currentIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
        } else {
          this.#isKeyboardNavigation = true;
          event.preventDefault();
          this.#currentIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
        }
        break;

      case 'ArrowUp':
        this.#isKeyboardNavigation = true;
        event.preventDefault();
        this.#currentIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
        break;

      case 'Enter': {
        const singleResultContainer = this.refs.predictiveSearchResults.querySelector('[data-single-result-url]');
        if (singleResultContainer instanceof HTMLElement && singleResultContainer.dataset.singleResultUrl) {
          event.preventDefault();
          window.location.href = singleResultContainer.dataset.singleResultUrl;
          return;
        }

        if (this.#currentIndex >= 0) {
          event.preventDefault();
          this.#currentItem?.querySelector('a')?.click();
        } else {
          const searchUrl = new URL(Theme.routes.search_url, location.origin);
          searchUrl.searchParams.set('q', this.refs.searchInput.value);
          this.#storeSantaRitaSearchTerm(this.refs.searchInput.value);
          window.location.href = searchUrl.toString();
        }
        break;
      }
    }
  };

  /**
   * Clears the recently viewed products.
   * @param {Event} event - The event.
   */
  clearRecentlyViewedProducts(event) {
    event.stopPropagation();

    RecentlyViewed.clearProducts();

    const { recentlyViewedItems, recentlyViewedTitle, recentlyViewedWrapper } = this.refs;

    const allRecentlyViewedElements = [...(recentlyViewedItems || []), ...(recentlyViewedTitle || [])];

    if (allRecentlyViewedElements.length === 0) {
      return;
    }

    if (recentlyViewedWrapper) {
      recentlyViewedWrapper.classList.add('removing');

      onAnimationEnd(recentlyViewedWrapper, () => {
        recentlyViewedWrapper.remove();
      });
    }
  }

  /**
   * Reset the search state.
   * @param {boolean} [keepFocus=true] - Whether to keep focus on input after reset
   */
  resetSearch = debounce((keepFocus = true) => {
    if (keepFocus) {
      this.refs.searchInput.focus();
    }
    this.#resetSearch();
  }, 100);

  /**
   * Debounce the search handler to fetch and display search results based on the input value.
   * Reset the current selection index and close results if the search term is empty.
   */
  search = debounce((event) => {
    // If the input is not a text input (like using the Escape key), don't search
    if (!event.inputType) return;

    const searchTerm = this.refs.searchInput.value.trim();
    this.#currentIndex = -1;

    if (!searchTerm.length) {
      this.#resetSearch();
      return;
    }

    this.#showResetButton();
    this.#getSearchResults(searchTerm);
  }, 200);

  /**
   * Resets scroll positions for search results containers
   */
  #resetScrollPositions() {
    requestAnimationFrame(() => {
      this.refs.predictiveSearchResults.querySelector('.predictive-search-results__inner')?.scrollTo(0, 0);
      this.querySelector('.predictive-search-form__content')?.scrollTo(0, 0);
    });
  }

  /**
   * Fetch search results using the section renderer and update the results container.
   * @param {string} searchTerm - The term to search for
   */
  async #getSearchResults(searchTerm) {
    if (!this.dataset.sectionId) return;

    const url = new URL(Theme.routes.predictive_search_url, location.origin);
    url.searchParams.set('q', searchTerm);
    url.searchParams.set('resources[limit_scope]', 'each');

    const { predictiveSearchResults } = this.refs;

    const abortController = this.#createAbortController();

    sectionRenderer
      .getSectionHTML(this.dataset.sectionId, false, url)
      .then((resultsMarkup) => {
        if (!resultsMarkup) return;

        if (abortController.signal.aborted) return;

        morph(predictiveSearchResults, resultsMarkup);

        this.#resetScrollPositions();
      })
      .catch((error) => {
        if (abortController.signal.aborted) return;
        throw error;
      });
  }

  /**
   * Fetch the markup for the recently viewed products.
   * @returns {Promise<string | null>} The markup for the recently viewed products.
   */
  async #getRecentlyViewedProductsMarkup() {
    if (!this.dataset.sectionId) return null;

    const viewedProducts = RecentlyViewed.getProducts();
    if (viewedProducts.length === 0) return null;

    const url = new URL(Theme.routes.search_url, location.origin);
    url.searchParams.set('q', viewedProducts.map(/** @param {string} id */ (id) => `id:${id}`).join(' OR '));
    url.searchParams.set('resources[type]', 'product');

    return sectionRenderer.getSectionHTML(this.dataset.sectionId, false, url);
  }

  #hideResetButton() {
    const { resetButton } = this.refs;

    resetButton.hidden = true;
  }

  #showResetButton() {
    const { resetButton } = this.refs;

    resetButton.hidden = false;
  }

  #createAbortController() {
    const abortController = new AbortController();
    if (this.#activeFetch) {
      this.#activeFetch.abort();
    }
    this.#activeFetch = abortController;
    return abortController;
  }

  #resetSearch = async () => {
    const { predictiveSearchResults, searchInput } = this.refs;
    const emptySectionId = 'predictive-search-empty';

    this.#currentIndex = -1;
    searchInput.value = '';
    this.#hideResetButton();

    const abortController = this.#createAbortController();
    const url = new URL(window.location.href);
    url.searchParams.delete('page');

    const emptySectionMarkup = await sectionRenderer.getSectionHTML(emptySectionId, false, url);
    const parsedEmptySectionMarkup = new DOMParser()
      .parseFromString(emptySectionMarkup, 'text/html')
      .querySelector('.predictive-search-empty-section');

    if (!parsedEmptySectionMarkup) throw new Error('No empty section markup found');

    /** This needs to be awaited and not .then so the DOM is already morphed
     * when #closeResults is called and therefore the height is animated */
    const viewedProducts = RecentlyViewed.getProducts();

    if (this.dataset.santaRitaSearch !== 'true' && viewedProducts.length > 0) {
      const recentlyViewedMarkup = await this.#getRecentlyViewedProductsMarkup();
      if (!recentlyViewedMarkup) return;

      const parsedRecentlyViewedMarkup = new DOMParser().parseFromString(recentlyViewedMarkup, 'text/html');
      const recentlyViewedProductsHtml = parsedRecentlyViewedMarkup.getElementById('predictive-search-products');
      if (!recentlyViewedProductsHtml) return;

      for (const child of recentlyViewedProductsHtml.children) {
        if (child instanceof HTMLElement) {
          child.setAttribute('ref', 'recentlyViewedWrapper');
        }
      }

      const collectionElement = parsedEmptySectionMarkup.querySelector('#predictive-search-products');
      if (!collectionElement) return;
      collectionElement.prepend(...recentlyViewedProductsHtml.children);
    }

    if (abortController.signal.aborted) return;

    morph(predictiveSearchResults, parsedEmptySectionMarkup);
    await this.#hydrateSantaRitaSuggestions(predictiveSearchResults);
    this.#resetScrollPositions();
  };
}

if (!customElements.get('predictive-search-component')) {
  customElements.define('predictive-search-component', PredictiveSearchComponent);
}
