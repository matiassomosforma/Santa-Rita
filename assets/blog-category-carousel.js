class BlogCategoryCarousel extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('nav');
    this.prev = this.querySelector('[data-category-prev]');
    this.next = this.querySelector('[data-category-next]');
    this.controller = new AbortController();
    const options = { signal: this.controller.signal };
    this.prev.addEventListener('click', () => this.move(-1), options);
    this.next.addEventListener('click', () => this.move(1), options);
    this.track.addEventListener('scroll', () => this.updateButtons(), options);
    this.observer = new ResizeObserver(() => this.update());
    this.observer.observe(this);
    for (const link of this.track.children) this.observer.observe(link);
    this.update();
  }

  disconnectedCallback() {
    this.controller.abort();
    this.observer.disconnect();
  }

  update() {
    if (!this.clientWidth) return;
    const gap = parseFloat(getComputedStyle(this.track).columnGap) || 0;
    const links = [...this.track.children];
    const contentWidth = links.reduce((width, link) => width + link.getBoundingClientRect().width, 0)
      + Math.max(0, links.length - 1) * gap + 4;
    const overflow = contentWidth > this.clientWidth + 1;
    this.prev.hidden = !overflow;
    this.next.hidden = !overflow;
    this.updateButtons();
  }

  updateButtons() {
    this.prev.disabled = this.track.scrollLeft <= 1;
    this.next.disabled = this.track.scrollLeft + this.track.clientWidth >= this.track.scrollWidth - 1;
  }

  move(direction) {
    this.track.scrollBy({
      left: direction * this.track.clientWidth * 0.8,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }
}

if (!customElements.get('blog-category-carousel')) {
  customElements.define('blog-category-carousel', BlogCategoryCarousel);
}
