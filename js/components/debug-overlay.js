/**
 * Debug Overlay — displays Braze user profile and the last 20 log entries.
 * Rendered outside the phone frame for developer inspection.
 * @module DebugOverlay
 */
import BrazeManager from '../braze-manager.js';
import AppLogger from '../app-logger.js';
import StorageManager from '../storage-manager.js';
import AppConfig from '../config.js';

const DebugOverlay = {
  /** @type {HTMLElement|null} */
  _container: null,
  /** @type {boolean} */
  _visible: false,

  /**
   * Initialize the overlay and bind the toggle button.
   */
  init() {
    this._container = document.getElementById('debug-overlay');
    const toggleBtn = document.getElementById('btn-debug');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
  },

  /**
   * Toggle overlay visibility and refresh content.
   */
  toggle() {
    this._visible = !this._visible;
    if (this._container) {
      this._container.classList.toggle('hidden', !this._visible);
      if (this._visible) this.render();
    }
  },

  /**
   * Render the debug overlay content.
   */
  render() {
    if (!this._container) return;

    const user = BrazeManager.getUserProfile();
    const deviceId = BrazeManager.getDeviceId();
    const deviceIdDisplay = deviceId || 'N/A';
    const logs = AppLogger.getLogs().filter(entry => entry.category === 'SDK').slice(0, 20);
    const brazeStatus = StorageManager.get('braze_init_status', 'unknown');

    const userSection = user
      ? `
      <div class="debug-section">
        <div class="debug-row"><span class="debug-label">External ID</span><span class="debug-value">${user.external_id || 'N/A'}</span></div>
        <div class="debug-row"><span class="debug-label">Name</span><span class="debug-value">${user.first_name || ''} ${user.last_name || ''}</span></div>
        <div class="debug-row"><span class="debug-label">Email</span><span class="debug-value">${user.email || 'N/A'}</span></div>
        <div class="debug-row"><span class="debug-label">Phone</span><span class="debug-value">${user.phone || 'N/A'}</span></div>
        <div class="debug-row"><span class="debug-label">Country</span><span class="debug-value">${user.country || 'N/A'}</span></div>
        <div class="debug-row"><span class="debug-label">pphg_loyalty_id</span><span class="debug-value">${user.pphg_loyalty_id ?? 'N/A'}</span></div>
        <div class="debug-row"><span class="debug-label">pphg_loyalty_points</span><span class="debug-value">${user.pphg_loyalty_points ?? 'N/A'}</span></div>
        <div class="debug-row"><span class="debug-label">pphg_loyalty_tier</span><span class="debug-value">${user.pphg_loyalty_tier ?? 'N/A'}</span></div>
      </div>`
      : `<div class="debug-section"><div style="color:#999;">Not logged in — use toolbar Log in.</div></div>`;

    this._container.innerHTML = `
      <button class="debug-close" aria-label="Close Debug">Close</button>
      <h2>SDK Debug Overlay</h2>

      <h3>App Info</h3>
      <div class="debug-section">
        <div class="debug-row"><span class="debug-label">App Name</span><span class="debug-value">${AppConfig.app.name}</span></div>
        <div class="debug-row"><span class="debug-label">Version</span><span class="debug-value">${AppConfig.app.version}</span></div>
        <div class="debug-row"><span class="debug-label">Platform</span><span class="debug-value">${AppConfig.app.platform}</span></div>
        <div class="debug-row"><span class="debug-label">Braze Status</span><span class="debug-value">${brazeStatus}</span></div>
        <div class="debug-row"><span class="debug-label">Device ID</span><span class="debug-value">${deviceIdDisplay}</span></div>
      </div>

      <h3>User Profile</h3>
      ${userSection}

      <h3>Storage Keys</h3>
      <div class="debug-section">
        ${this._renderStorageKeys()}
      </div>

      <h3>Recent SDK Events (${logs.length})</h3>
      <div class="debug-section">
        ${logs.length === 0
          ? '<div style="color:#666;">No events logged yet.</div>'
          : logs.map(entry => `
            <div class="debug-log-entry">
              <span class="log-level-${entry.level}">[${entry.level}]</span>
              <span style="color:#90CAF9;">[${entry.category}]</span>
              ${entry.message}
              <span style="color:#666; font-size:10px;">${entry.timestamp.substring(11, 19)}</span>
            </div>
          `).join('')
        }
      </div>
    `;

    const closeBtn = this._container.querySelector('.debug-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggle());
    }
  },

  /**
   * Render all ar_app_ storage keys as debug rows.
   * @returns {string} HTML string.
   * @private
   */
  _renderStorageKeys() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('ar_app_'));
    if (keys.length === 0) return '<div style="color:#666;">No stored keys.</div>';

    return keys.map(key => {
      const shortKey = key.replace('ar_app_', '');
      let value = '';
      try {
        const raw = localStorage.getItem(key);
        const parsed = JSON.parse(raw);
        value = typeof parsed === 'object' ? JSON.stringify(parsed).substring(0, 60) : String(parsed);
      } catch (_) {
        value = localStorage.getItem(key) || '';
      }
      return `<div class="debug-row"><span class="debug-label">${shortKey}</span><span class="debug-value">${value}</span></div>`;
    }).join('');
  }
};

export default DebugOverlay;
