/**
 * Header component — home, hero overlay, or sub-page (back + title).
 * @module Header
 */
import Router from '../router.js';
import AppConfig from '../config.js';

const Header = {
  /** @type {HTMLElement|null} */
  _container: null,

  /**
   * Bind to the #app-header element.
   * @param {HTMLElement} container
   */
  init(container) {
    this._container = container;
  },

  /**
   * Render compact header for main Book tab (logo + explore shortcut).
   */
  renderHome() {
    if (!this._container) return;
    this._container.innerHTML = `
      <div class="header-home">
        <span class="pphg-heading-serif" style="font-size:15px;">
          ${AppConfig.app.name}
        </span>
        <button type="button" class="header-btn" aria-label="Open destinations" data-pphg-nav="explore">
          <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
        </button>
      </div>
    `;
    const btn = this._container.querySelector('[data-pphg-nav="explore"]');
    if (btn) {
      btn.addEventListener('click', () => Router.navigate('/explore'));
    }
  },

  /**
   * Header over hero — translucent bar with logo only.
   */
  renderHeroBar() {
    if (!this._container) return;
    this._container.innerHTML = `
      <div class="header-home header-home--hero">
        <span class="pphg-heading-serif" style="font-size:15px; color:#fff;">
          ${AppConfig.app.name}
        </span>
        <span style="width:36px"></span>
      </div>
    `;
  },

  /**
   * Hide header (full-bleed content manages its own chrome).
   */
  clear() {
    if (this._container) this._container.innerHTML = '';
  },

  /**
   * Render a sub-page header with back button, centered title, and optional action.
   * @param {string} title - Page title to display centered.
   * @param {Object} [options={}]
   * @param {string} [options.backRoute] - Hash to navigate to on back press; defaults to browser back.
   * @param {string} [options.actionIcon] - FontAwesome class for a right-side action button.
   * @param {Function} [options.onAction] - Click handler for the action button.
   */
  renderSubPage(title, options = {}) {
    if (!this._container) return;

    const header = document.createElement('div');
    header.className = 'header-sub';
    header.style.position = 'relative';

    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'header-btn';
    backBtn.setAttribute('aria-label', 'Go back');
    backBtn.innerHTML = '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>';
    backBtn.addEventListener('click', () => {
      if (options.backRoute) {
        Router.navigate(options.backRoute);
      } else {
        window.history.back();
      }
    });

    const titleEl = document.createElement('span');
    titleEl.className = 'header-title';
    titleEl.textContent = title;

    header.appendChild(backBtn);
    header.appendChild(titleEl);

    if (options.actionIcon) {
      const actionBtn = document.createElement('button');
      actionBtn.type = 'button';
      actionBtn.className = 'header-btn';
      actionBtn.innerHTML = `<i class="${options.actionIcon}" aria-hidden="true"></i>`;
      if (options.onAction) {
        actionBtn.addEventListener('click', options.onAction);
      }
      header.appendChild(actionBtn);
    } else {
      const spacer = document.createElement('div');
      spacer.style.width = '36px';
      header.appendChild(spacer);
    }

    this._container.innerHTML = '';
    this._container.appendChild(header);
  }
};

export default Header;
