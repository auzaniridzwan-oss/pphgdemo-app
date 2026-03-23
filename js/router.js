/**
 * Hash-based SPA router.
 * Maps URL hashes to screen render functions and synchronizes the bottom nav.
 * @module Router
 */
import AppLogger from './app-logger.js';
import BrazeManager from './braze-manager.js';

const Router = {
  /** @type {Object.<string, Function>} Route name -> render function */
  _routes: {},
  /**
   * Optional matchers for dynamic paths (e.g. /hotel/:id/rooms).
   * Each matcher returns null or { handler: Function, args: Array }.
   * @type {Array<Function>}
   */
  _matchers: [],
  /** @type {string} Currently active route */
  _currentRoute: '',
  /** @type {Function|null} Callback invoked when route changes (to update nav) */
  _onRouteChange: null,

  /**
   * Register route handlers.
   * @param {Object.<string, Function>} routes - Map of hash paths to render functions.
   */
  register(routes) {
    this._routes = routes;
  },

  /**
   * Register a dynamic route matcher (checked after exact static paths).
   * @param {Function} matcher - (path: string) => null | { handler: Function, args: Array }
   */
  registerMatcher(matcher) {
    this._matchers.push(matcher);
  },

  /**
   * Set a callback that fires on every route change (used to sync bottom nav).
   * @param {Function} callback - Function(routePath).
   */
  onRouteChange(callback) {
    this._onRouteChange = callback;
  },

  /**
   * Start listening for hash changes and render the initial route.
   */
  start() {
    window.addEventListener('hashchange', () => this._handleRoute());
    this._handleRoute();
    AppLogger.info('SYSTEM', 'Router started');
  },

  /**
   * Programmatically navigate to a hash route.
   * @param {string} path - Hash path (e.g., '/cart' → becomes '#/cart').
   */
  navigate(path) {
    const normalized = path.startsWith('#') ? path : `#${path.startsWith('/') ? path : `/${path}`}`;
    window.location.hash = normalized;
  },

  /**
   * @returns {string} Current hash path.
   */
  getCurrentRoute() {
    return this._currentRoute;
  },

  /**
   * Parse the current hash and invoke the matching route handler.
   * @private
   */
  _handleRoute() {
    const hash = window.location.hash || '#/';
    const path = hash.replace('#', '') || '/';
    const contentEl = document.getElementById('app-content');

    if (!contentEl) return;

    if (path !== this._currentRoute) {
      const prevRoute = this._currentRoute;
      this._currentRoute = path;

      let handled = false;

      if (this._routes[path]) {
        this._routes[path](contentEl);
        handled = true;
      } else {
        for (let i = 0; i < this._matchers.length; i++) {
          const match = this._matchers[i](path);
          if (match && typeof match.handler === 'function') {
            match.handler(contentEl, ...(match.args || []));
            handled = true;
            break;
          }
        }
      }

      if (!handled && this._routes['/']) {
        this._routes['/'](contentEl);
      }

      if (this._onRouteChange) {
        this._onRouteChange(path);
      }

      if (prevRoute && prevRoute !== path) {
        const tabName = this._getTabName(path);
        BrazeManager.logEvent('Navigation - Tab Switched', {
          tab_name: tabName,
          from: prevRoute,
          to: path,
        });
      }

      contentEl.scrollTop = 0;
      AppLogger.info('UI', `Route changed: ${path}`);
    }
  },

  /**
   * Derive a human-readable tab name from a route path.
   * @param {string} path
   * @returns {string}
   * @private
   */
  _getTabName(path) {
    const names = {
      '/': 'Book',
      '/explore': 'Explore',
      '/loyalty': 'Loyalty',
      '/offers': 'Offers',
      '/account': 'Account',
    };
    if (path.startsWith('/hotel')) return 'Book';
    return names[path] || 'Unknown';
  }
};

export default Router;
