/**
 * Bottom Navigation — Book, Explore, Loyalty, Offers, Account (design.json).
 * @module BottomNav
 */
import Router from '../router.js';

const NAV_ITEMS = [
  { label: 'Book', icon: 'fa-solid fa-calendar-check', route: '#/' },
  { label: 'Explore', icon: 'fa-solid fa-compass', route: '#/explore' },
  { label: 'Loyalty', icon: 'fa-solid fa-award', route: '#/loyalty' },
  { label: 'Offers', icon: 'fa-solid fa-tag', route: '#/offers' },
  { label: 'Account', icon: 'fa-solid fa-circle-user', route: '#/account' },
];

const BottomNav = {
  /** @type {HTMLElement|null} */
  _container: null,

  /**
   * Render the bottom navigation into the target element.
   * @param {HTMLElement} container - The #app-nav element.
   */
  render(container) {
    this._container = container;
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.setAttribute('aria-label', 'Main');

    const ul = document.createElement('ul');
    ul.style.cssText =
      'display:flex;flex:1;justify-content:space-around;align-items:flex-start;list-style:none;margin:0;padding:0;width:100%;';

    NAV_ITEMS.forEach((item) => {
      const li = document.createElement('li');
      li.style.flex = '1';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-item';
      btn.dataset.route = item.route;
      btn.setAttribute('aria-label', item.label);

      const icon = document.createElement('i');
      icon.className = item.icon;
      icon.setAttribute('aria-hidden', 'true');

      const label = document.createElement('span');
      label.className = 'nav-label';
      label.textContent = item.label;

      btn.appendChild(icon);
      btn.appendChild(label);

      btn.addEventListener('click', () => {
        Router.navigate(item.route.replace('#', ''));
      });

      li.appendChild(btn);
      ul.appendChild(li);
    });

    nav.appendChild(ul);
    container.innerHTML = '';
    container.appendChild(nav);
    this._syncActive(Router.getCurrentRoute() || '/');
  },

  /**
   * Highlight the active tab that matches the current route.
   * @param {string} route - Current route path (e.g., '/explore').
   */
  _syncActive(route) {
    if (!this._container) return;
    const buttons = this._container.querySelectorAll('.nav-item');
    buttons.forEach((btn) => {
      const btnRoute = btn.dataset.route.replace('#', '');
      const isBookTab = btnRoute === '/';
      const isExploreTab = btnRoute === '/explore';

      const activeBook =
        isBookTab &&
        (route === '/' || route.startsWith('/hotel'));

      const activeExplore = isExploreTab && route === '/explore';

      const activeOther =
        btnRoute === route &&
        btnRoute !== '/' &&
        btnRoute !== '/explore';

      btn.classList.toggle('active', activeBook || activeExplore || activeOther);
    });
  },

  /**
   * Called by the router on route change to sync the nav highlight.
   * @param {string} route
   */
  onRouteChange(route) {
    this._syncActive(route);
  }
};

export default BottomNav;
