/**
 * Centralized logging singleton with CSS-styled console output.
 * Provides getLogs() for the Debug Overlay and fires Braze `App_Error` events on ERROR level.
 * @module AppLogger
 */
const AppLogger = {
  logs: [],
  MAX_LOGS: 100,
  DEBUG_MODE: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',

  /**
   * Core log method — formats, stores, and outputs log entries.
   * @param {string} level - INFO | DEBUG | WARN | ERROR
   * @param {string} category - UI | SDK | AUTH | STORAGE | SYSTEM
   * @param {string} message - Human-readable log message.
   * @param {*} [data=null] - Optional structured payload.
   */
  log(level, category, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, category, message, data };

    this.logs.push(logEntry);
    if (this.logs.length > this.MAX_LOGS) this.logs.shift();

    if (this.DEBUG_MODE || level === 'ERROR') {
      const color = this._getColor(level);
      console.log(
        `%c[${timestamp}] [${category}] [${level}]: ${message}`,
        `color: ${color}; font-weight: bold;`,
        data || ''
      );
    }

    if (level === 'ERROR' && window.braze) {
      try {
        window.braze.logCustomEvent('App_Error', {
          error_message: message,
          category,
          data: JSON.stringify(data)
        });
      } catch (_) { /* Braze may not be ready */ }
    }
  },

  /**
   * @param {string} level
   * @returns {string} CSS color hex for the given log level.
   * @private
   */
  _getColor(level) {
    const colors = {
      ERROR: '#ff4d4d',
      WARN: '#ffa500',
      DEBUG: '#7f8c8d',
      INFO: '#2ecc71'
    };
    return colors[level] || '#2ecc71';
  },

  /**
   * @param {string} cat - Category
   * @param {string} msg - Message
   * @param {*} [data] - Optional data
   */
  info(cat, msg, data) { this.log('INFO', cat, msg, data); },

  /**
   * @param {string} cat
   * @param {string} msg
   * @param {*} [data]
   */
  debug(cat, msg, data) { this.log('DEBUG', cat, msg, data); },

  /**
   * @param {string} cat
   * @param {string} msg
   * @param {*} [data]
   */
  warn(cat, msg, data) { this.log('WARN', cat, msg, data); },

  /**
   * @param {string} cat
   * @param {string} msg
   * @param {*} [data]
   */
  error(cat, msg, data) { this.log('ERROR', cat, msg, data); },

  /** @private */
  _brazeManager: null,

  /**
   * Register the BrazeManager reference to avoid circular imports.
   * Called by BrazeManager.init() after the SDK is ready.
   * @param {Object} ref - The BrazeManager singleton.
   */
  setBrazeManager(ref) {
    this._brazeManager = ref;
  },

  /**
   * Log a user event with custom properties and forward to Braze.
   * @param {string} eventName - Title Case event name (e.g. "Cart - Item Added").
   * @param {Object} [properties={}] - Key-value event properties.
   */
  trackEvent(eventName, properties = {}) {
    this.info('SDK', `Event: ${eventName}`, properties);
    if (this._brazeManager) {
      this._brazeManager.logEvent(eventName, properties);
    }
  },

  /**
   * Returns the most recent logs for the Debug Overlay.
   * @param {number} [count=20] - Number of entries to return.
   * @returns {Array<Object>} Recent log entries, newest first.
   */
  getLogs(count = 20) {
    return this.logs.slice(-count).reverse();
  }
};

export default AppLogger;
