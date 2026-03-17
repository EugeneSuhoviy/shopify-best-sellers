 class BestSellers {
    constructor(container) {
      this.container = container;
      this.tabs = container.querySelectorAll('[role="tab"]');
      this.panels = container.querySelectorAll('[role="tabpanel"]');
      this.modalWrapper = container.querySelector('[data-modal-wrapper]');
      this.modalText = container.querySelector('[data-modal-text]');

      this.init();
    }

    init() {
      // Tab switching
      this.tabs.forEach((tab) => {
        tab.addEventListener('click', () => this.switchTab(tab.dataset.index));
      });

      // Wishlist
      this.container.addEventListener('click', (e) => {
        const wishlistBtn = e.target.closest('[data-action="wishlist"]');
        if (wishlistBtn) this.openWishlist();

        const closeBtn = e.target.closest('[data-close-modal]');
        if (closeBtn) this.closeModal();

        const atcBtn = e.target.closest('[data-action="add-to-cart"]');
        if (atcBtn) this.addToCart(atcBtn);
      });
    }

    switchTab(index) {
      this.tabs.forEach((t) => {
        const active = t.dataset.index === index;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active);
      });

      this.panels.forEach((p) => {
        p.hidden = p.dataset.panel !== index;
        p.classList.toggle('is-active', p.dataset.panel === index);
      });
    }

    openWishlist() {
      const activePanel = this.container.querySelector('.best-sellers__panel.is-active');
      const productName = activePanel.querySelector('.best-sellers__card').dataset.productTitle;
      const template = this.container.dataset.wishlistTemplate;

      this.modalText.textContent = template.replace('[NAME]', productName);
      this.modalWrapper.classList.add('is-open');
      document.body.classList.add('scroll-locked');
    }

    closeModal() {
      this.modalWrapper.classList.remove('is-open');
      document.body.classList.remove('scroll-locked');
    }

    async addToCart(btn) {
      const variantId = btn.dataset.variantId;
      btn.disabled = true;

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] }),
        });

        if (response.ok) {
          window.location.href = '/cart';
        }
      } catch (error) {
        console.error('Cart Error:', error);
      } finally {
        btn.disabled = false;
      }
    }
  }

  const initSections = () => {
    document.querySelectorAll('[data-best-sellers]').forEach((el) => new BestSellers(el));
  };
  document.addEventListener('DOMContentLoaded', initSections);
  document.addEventListener('shopify:section:load', initSections);