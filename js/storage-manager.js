/**
 * Centralized LocalStorage singleton.
 * All keys are prefixed with `ar_app_` to avoid collisions with third-party scripts.
 * @module StorageManager
 */
const StorageManager = {
  PREFIX: 'ar_app_',

  /**
   * Persist a value to localStorage under the app prefix.
   * @param {string} key - Storage key (without prefix).
   * @param {*} value - Any JSON-serializable value.
   */
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${this.PREFIX}${key}`, serializedValue);
    } catch (e) {
      console.error('[Storage] Error saving to disk', e);
    }
  },

  /**
   * Retrieve a value from localStorage.
   * @param {string} key - Storage key (without prefix).
   * @param {*} [defaultValue=null] - Fallback if key is missing or corrupt.
   * @returns {*} The parsed value or defaultValue.
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`${this.PREFIX}${key}`);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  /**
   * Remove a single key from localStorage.
   * @param {string} key - Storage key (without prefix).
   */
  remove(key) {
    localStorage.removeItem(`${this.PREFIX}${key}`);
  },

  /**
   * Clear all app-specific keys while leaving Braze/system keys intact.
   */
  clearSession() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }
};

export default StorageManager;
