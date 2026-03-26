/**
 * Braze WebSDK integration manager.
 * Wraps all SDK calls in safety checks so the app never crashes if the SDK is blocked.
 * @module BrazeManager
 */
import AppConfig from './config.js';
import AppLogger from './app-logger.js';
import StorageManager from './storage-manager.js';
import AuthService from './auth-service.js';
import BrazeToast from './components/braze-toast.js';

const BrazeManager = {
  _initialized: false,

  /**
   * Wait for the DOM to be fully parsed before proceeding.
   * Resolves immediately if the document is already interactive or complete.
   * @returns {Promise<void>}
   * @private
   */
  _waitForDOM() {
    return new Promise(resolve => {
      if (document.readyState !== 'loading') return resolve();
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    });
  },

  /**
   * Dynamically inject the Braze SDK script tag into <head>.
   * Resolves immediately if the SDK is already present on window (e.g. cached).
   * Rejects if the script fails to load.
   * @returns {Promise<void>}
   * @private
   */
  _loadSDK() {
    return new Promise((resolve, reject) => {
      if (window.braze) return resolve();
      const script = document.createElement('script');
      script.src = AppConfig.braze.sdkUrl;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Braze SDK script failed to load'));
      document.head.appendChild(script);
      AppLogger.debug('SDK', 'Braze SDK script injected', { src: script.src });
    });
  },

  /**
   * Public entry point — waits for DOM ready, lazily loads the SDK script,
   * then delegates to init() for SDK configuration and user identification.
   * @returns {Promise<boolean>} Resolves to true if initialization succeeded.
   */
  async load() {
    await this._waitForDOM();
    try {
      await this._loadSDK();
    } catch (e) {
      AppLogger.warn('SDK', e.message + ' — running in offline mode');
      StorageManager.set('braze_init_status', 'unavailable');
      return false;
    }
    return this.init();
  },

  /**
   * Initialize the Braze WebSDK and set up the user session.
   * Called internally by load() after the SDK script is confirmed present.
   * @returns {boolean} True if initialization succeeded.
   */
  init() {
    if (!window.braze) {
      AppLogger.warn('SDK', 'Braze SDK not available — running in offline mode');
      StorageManager.set('braze_init_status', 'unavailable');
      return false;
    }

    try {
      window.braze.initialize(AppConfig.braze.apiKey, {
        baseUrl: AppConfig.braze.baseUrl,
        enableLogging: AppLogger.DEBUG_MODE,
        allowUserSuppliedJavascript: true,
      });

      this._setupSubscriptions();
      this._identifyUser();

      window.braze.openSession();
      this._initialized = true;
      AppLogger.setBrazeManager(this);
      StorageManager.set('braze_init_status', 'initialized');
      AppLogger.info('SDK', 'Braze SDK initialized successfully');
      return true;
    } catch (e) {
      AppLogger.error('SDK', 'Braze SDK initialization failed', e.message);
      StorageManager.set('braze_init_status', 'error');
      return false;
    }
  },

  /**
   * Identify the Braze user from stored session when logged in; otherwise stay anonymous.
   * @private
   */
  _identifyUser() {
    if (!window.braze) return;
    if (!AuthService.isLoggedIn()) {
      AppLogger.info('SDK', 'Anonymous session (not logged in)');
      return;
    }
    this.identifyLoggedInUser();
  },

  /**
   * Apply `user_session` to the SDK (changeUser + metadata). Call after login or on boot when already logged in.
   */
  identifyLoggedInUser() {
    if (!window.braze) return;
    const user = StorageManager.get('user_session', null);
    if (!user?.external_id) {
      AppLogger.warn('SDK', 'identifyLoggedInUser: missing user_session');
      return;
    }
    try {
      window.braze.changeUser(user.external_id);
      window.braze.getUser().setCustomUserAttribute('app_version', AppConfig.app.version);
      window.braze.getUser().setCustomUserAttribute('platform', AppConfig.app.platform);
      window.braze.requestContentCardsRefresh();
      AppLogger.info('SDK', 'User identified', { external_id: user.external_id });
    } catch (e) {
      AppLogger.error('SDK', 'Failed to identify user', e.message);
    }
  },

  /**
   * Fetch loyalty + name fields from Vercel proxy (Braze REST). Caller stores via AuthService.loginLive.
   * @param {string} externalId
   * @returns {Promise<Object>} Profile payload for loginLive.
   */
  async fetchLiveProfileFromServer(externalId) {
    const res = await fetch('/api/braze-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ external_id: externalId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.error || res.statusText || 'Profile fetch failed';
      throw new Error(msg);
    }
    return data;
  },

  /**
   * Subscribe to In-App Messages and Content Cards.
   * @private
   */
  _setupSubscriptions() {
    if (!window.braze) return;

    window.braze.subscribeToInAppMessage((inAppMessage) => {
      AppLogger.info('SDK', 'In-App Message Received', inAppMessage);
      this._renderIAM(inAppMessage);
      return false;
    });

    window.braze.subscribeToContentCardsUpdates((payload) => {
      const list = Array.isArray(payload) ? payload : (payload?.cards ?? []);
      const banners = list.filter(c => c.extras && String(c.extras.type) === 'banner');
      const toasts = list.filter(c => c.extras && String(c.extras.type) === 'toast');
      AppLogger.info('SDK', 'Content Cards Updated', {
        count: list.length,
        banners: banners.length,
        toasts: toasts.length,
      });
      if (banners.length > 0) {
        document.dispatchEvent(new CustomEvent('braze:banners', { detail: banners }));
      }
      if (toasts.length > 0) {
        document.dispatchEvent(new CustomEvent('braze:toasts', { detail: toasts }));
      }
    });

    window.braze.requestContentCardsRefresh();
  },

  /**
   * Render an In-App Message inside the phone frame.
   * @param {Object} inAppMessage - Braze IAM object.
   * @private
   */
  _renderIAM(inAppMessage) {
    const container = document.getElementById('phone-frame');
    if (!container) return;

    try {
      BrazeToast.showForInAppMessage(inAppMessage);
    } catch (e) {
      AppLogger.error('SDK', 'IAM render failed', e?.message || String(e));
    }
  },

  /**
   * Log a custom event to Braze with optional properties.
   * @param {string} eventName - Title Case event name.
   * @param {Object} [properties={}] - Key-value event properties.
   */
  logEvent(eventName, properties = {}) {
    AppLogger.info('SDK', `Event: ${eventName}`, properties);

    if (!window.braze) return;

    try {
      window.braze.logCustomEvent(eventName, {
        ...properties,
        app_version: AppConfig.app.version,
        platform: AppConfig.app.platform,
      });
    } catch (e) {
      AppLogger.error('SDK', `Failed to log event: ${eventName}`, e.message);
    }
  },

  /**
   * Set a custom user attribute on the current Braze user.
   * @param {string} key - Attribute key in snake_case.
   * @param {*} value - Attribute value.
   */
  setAttribute(key, value) {
    if (!window.braze) return;

    try {
      window.braze.getUser().setCustomUserAttribute(key, value);
      AppLogger.debug('SDK', `Attribute set: ${key}`, value);
    } catch (e) {
      AppLogger.error('SDK', `Failed to set attribute: ${key}`, e.message);
    }
  },

  /**
   * Returns the Braze Web SDK device id for this browser (anonymous or identified).
   * May be undefined before `initialize` completes; null if the SDK is unavailable or the call fails.
   * @returns {string|null|undefined}
   */
  getDeviceId() {
    if (!window.braze) return null;
    try {
      return window.braze.getDeviceId();
    } catch (e) {
      return null;
    }
  },

  /**
   * Get the current user data for the debug overlay / Account screen.
   * @returns {Object|null} Session object or null when logged out.
   */
  getUserProfile() {
    if (!AuthService.isLoggedIn()) return null;
    return StorageManager.get('user_session', null);
  },
};

export default BrazeManager;
