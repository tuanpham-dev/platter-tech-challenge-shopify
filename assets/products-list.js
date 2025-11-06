if (!customElements.get('products-list')) {
  const SELECTORS = {
    SHOW_MORE_BUTTON: '.products-list__show-more-button',
    CAROUSEL: '.products-list__carousel',
  }

  customElements.define('products-list', class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      // Show more button
      this.showMoreButton = this.querySelector(SELECTORS.SHOW_MORE_BUTTON);
      this.initShowMoreButton();


      // Carousel
      this.carousel = this.querySelector(SELECTORS.CAROUSEL);
      this.initCarousel();
    }

    initShowMoreButton() {
      if (!this.showMoreButton) {
        return;
      }

      this.showMoreButton.addEventListener('click', () => {
        this.toggleAttribute('data-is-collapsed');

        const isCollapsed = this.hasAttribute('data-is-collapsed');

        if (isCollapsed) {
          this.showMoreButton.textContent = this.showMoreButton.getAttribute('data-show-more-text') || 'Show More';
        } else {
          this.showMoreButton.textContent = this.showMoreButton.getAttribute('data-show-less-text') || 'Show Less';
        }
      });
    }

    initCarousel() {
      if (!this.carousel) {
        return;
      }

      const matchMedia = window.matchMedia('(min-width: 1024px)');

      const initSwiper = () => {
        if (matchMedia.matches) {
          this.swiper = new Swiper(this.carousel, {
            slidesPerView: 'auto',
            freeMode: true,
            spaceBetween: 24,
            mousewheel: {
              forceToAxis: true
            },
            scrollbar: {
              el: '.swiper-scrollbar',
              hide: false,
              draggable: true,
            },
            on: {
              scrollbarDragStart: (swiper) => {
                swiper.scrollbar.el.setAttribute('data-is-dragging', 'true');
              },
              scrollbarDragEnd: (swiper) => {
                swiper.scrollbar.el.removeAttribute('data-is-dragging');
              }
            }
          });

          const updateScrollbarVisibility = (swiper) => {
            const divider = swiper.size / (swiper.virtualSize + swiper.params.slidesOffsetBefore - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));
            this.toggleAttribute('data-is-scrollbar-hidden', divider >=1);
          }

          this.swiper.on('init update resize', updateScrollbarVisibility);
          updateScrollbarVisibility(this.swiper);
        } else {
          if (this.swiper) {
            this.swiper.destroy();
            this.swiper = null;
          }
        }
      };

      initSwiper();
      matchMedia.addEventListener('change', initSwiper);
    }
  });
}