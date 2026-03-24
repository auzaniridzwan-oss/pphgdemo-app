/**
 * App auth state — Demo vs Live mode, login/logout, loyalty snapshot for UI.
 * Does not import BrazeManager (logout calls `window.braze` directly to avoid cycles).
 * @module AuthService
 */
import StorageManager from './storage-manager.js';
import AppLogger from './app-logger.js';
import { TEST_USER, DEMO_LOYALTY } from './demo-data.js';

const AuthService = {
  /**
   * @returns {boolean}
   */
  isLoggedIn() {
    return StorageManager.get('logged_in', false) === true;
  },

  /**
   * @returns {'demo'|'live'}
   */
  getAuthMode() {
    const m = StorageManager.get('auth_mode', 'demo');
    return m === 'live' ? 'live' : 'demo';
  },

  /**
   * Persist auth mode. If user is logged in, confirms logout before switching.
   * @param {'demo'|'live'} mode
   * @returns {boolean} True if mode was applied (may reload).
   */
  setAuthMode(mode) {
    const next = mode === 'live' ? 'live' : 'demo';
    if (this.isLoggedIn()) {
      if (!window.confirm('Switching mode will log you out. Continue?')) {
        return false;
      }
      StorageManager.set('auth_mode', next);
      this._logoutClearStorage();
      if (window.braze && typeof window.braze.wipeData === 'function') {
        try {
          window.braze.wipeData();
        } catch (e) {
          AppLogger.warn('SDK', 'wipeData failed', e?.message || String(e));
        }
      }
      AppLogger.info('AUTH', 'Mode switch with logout', { mode: next });
      window.location.reload();
      return true;
    }
    StorageManager.set('auth_mode', next);
    AppLogger.info('AUTH', 'Auth mode set', { mode: next });
    return true;
  },

  /**
   * Demo login — predefined user + loyalty; caller should run Braze identify next.
   */
  loginDemo() {
    const session = {
      ...TEST_USER,
      pphg_loyalty_id: DEMO_LOYALTY.pphg_loyalty_id,
      pphg_loyalty_points: DEMO_LOYALTY.pphg_loyalty_points,
      pphg_loyalty_tier: DEMO_LOYALTY.pphg_loyalty_tier,
    };
    StorageManager.set('user_session', session);
    StorageManager.set('logged_in', true);
    StorageManager.set('auth_mode', 'demo');
    AppLogger.info('AUTH', 'Demo login', { external_id: session.external_id });
  },

  /**
   * Live login after REST profile fetch — merges API fields onto session.
   * @param {string} externalId
   * @param {Object} profile - first_name, last_name, email, pphg_loyalty_*
   */
  loginLive(externalId, profile = {}) {
    const session = {
      external_id: externalId,
      first_name: profile.first_name ?? '',
      last_name: profile.last_name ?? '',
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      country: profile.country ?? '',
      pphg_loyalty_id: profile.pphg_loyalty_id ?? null,
      pphg_loyalty_points: profile.pphg_loyalty_points ?? null,
      pphg_loyalty_tier: profile.pphg_loyalty_tier ?? null,
    };
    StorageManager.set('user_session', session);
    StorageManager.set('logged_in', true);
    StorageManager.set('auth_mode', 'live');
    AppLogger.info('AUTH', 'Live login', { external_id: externalId });
  },

  /**
   * Loyalty fields for Loyalty screen (normalized).
   * @returns {{ loyalty_id: string|null, points: number|null, tier: string|null }}
   */
  getLoyaltySnapshot() {
    if (!this.isLoggedIn()) {
      return { loyalty_id: null, points: null, tier: null };
    }
    const s = StorageManager.get('user_session', null);
    if (!s) return { loyalty_id: null, points: null, tier: null };
    const points = s.pphg_loyalty_points;
    const numPoints = typeof points === 'number' ? points : (points != null ? Number(points) : null);
    return {
      loyalty_id: s.pphg_loyalty_id != null ? String(s.pphg_loyalty_id) : null,
      points: Number.isFinite(numPoints) ? numPoints : null,
      tier: s.pphg_loyalty_tier != null ? String(s.pphg_loyalty_tier) : null,
    };
  },

  /**
   * Wipe Braze local data, clear session keys, reload.
   */
  logout() {
    if (window.braze && typeof window.braze.wipeData === 'function') {
      try {
        window.braze.wipeData();
      } catch (e) {
        AppLogger.warn('SDK', 'wipeData on logout failed', e?.message || String(e));
      }
    }
    this._logoutClearStorage();
    AppLogger.info('AUTH', 'Logged out');
    window.location.reload();
  },

  /**
   * @private
   */
  _logoutClearStorage() {
    StorageManager.remove('logged_in');
    StorageManager.remove('user_session');
  },
};

export default AuthService;
