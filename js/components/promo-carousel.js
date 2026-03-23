/**
 * PromoCarousel — banner carousel with auto-advance and dot indicators.
 * Aspect ratio 16:7 per design.json specification.
 * @module PromoCarousel
 */
import BrazeManager from '../braze-manager.js';

const PromoCarousel = {
  /** @type {number|null} Auto-advance interval ID */
  _intervalId: null,
  /** @type {number} Currently visible slide index */
  _currentSlide: 0,

  /**
   * Create and return a carousel DOM element for the given banners.
   * @param {Array<Object>} banners - Array of banner data objects.
   * @returns {HTMLElement} The carousel container element.
   */
  create(banners) {
    this._currentSlide = 0;
    this._clearInterval();

    const container = document.createElement('div');
    container.className = 'carousel-container';

    const track = document.createElement('div');
    track.className = 'carousel-track';

    banners.forEach((banner, index) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:absolute; inset:0;
        background: linear-gradient(135deg, ${banner.bg}dd 0%, ${banner.bg}88 100%);
        display:flex; flex-direction:column; justify-content:center; padding:24px;
        color:white;
      `;

      const title = document.createElement('div');
      title.style.cssText = 'font-size:18px; font-weight:800; margin-bottom:4px; line-height:1.2;';
      title.textContent = banner.title;

      const subtitle = document.createElement('div');
      subtitle.style.cssText = 'font-size:13px; opacity:0.9; margin-bottom:12px;';
      subtitle.textContent = banner.subtitle;

      const cta = document.createElement('span');
      cta.style.cssText = `
        display:inline-block; padding:6px 16px;
        background:rgba(255,255,255,0.25); border-radius:20px;
        font-size:12px; font-weight:600; backdrop-filter:blur(4px);
      `;
      cta.textContent = banner.cta;

      overlay.appendChild(title);
      overlay.appendChild(subtitle);
      overlay.appendChild(cta);
      slide.appendChild(overlay);

      slide.addEventListener('click', () => {
        BrazeManager.logEvent('em_viewpromo', {
          banner_id: banner.id,
          banner_title: banner.title,
          slide_index: index,
        });
      });

      track.appendChild(slide);
    });

    container.appendChild(track);

    if (banners.length > 1) {
      const dots = document.createElement('div');
      dots.className = 'carousel-dots';

      banners.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          this._goToSlide(track, dots, i, banners.length);
        });
        dots.appendChild(dot);
      });

      container.appendChild(dots);

      this._startAutoAdvance(track, dots, banners.length);
    }

    return container;
  },

  /**
   * Transition to a specific slide.
   * @param {HTMLElement} track
   * @param {HTMLElement} dots
   * @param {number} index
   * @param {number} total
   * @private
   */
  _goToSlide(track, dots, index, total) {
    this._currentSlide = index % total;
    track.style.transform = `translateX(-${this._currentSlide * 100}%)`;

    const allDots = dots.querySelectorAll('.carousel-dot');
    allDots.forEach((d, i) => d.classList.toggle('active', i === this._currentSlide));
  },

  /**
   * Start auto-advancing slides every 4 seconds.
   * @param {HTMLElement} track
   * @param {HTMLElement} dots
   * @param {number} total
   * @private
   */
  _startAutoAdvance(track, dots, total) {
    this._clearInterval();
    this._intervalId = setInterval(() => {
      this._goToSlide(track, dots, this._currentSlide + 1, total);
    }, 4000);
  },

  /**
   * @private
   */
  _clearInterval() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  },

  /**
   * Cleanup — stop auto-advance when leaving the screen.
   */
  destroy() {
    this._clearInterval();
  }
};

export default PromoCarousel;
