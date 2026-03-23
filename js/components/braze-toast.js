/**
 * Braze toast — push-style notification at top of #phone-frame.
 * Content Cards via `braze:toasts`; In-App Messages via `showForInAppMessage`.
 * @module BrazeToast
 */
import AppLogger from '../app-logger.js';

const AUTO_DISMISS_MS = 5000;

/** @type {HTMLElement|null} */
let _host = null;
/** @type {ReturnType<typeof setTimeout>|null} */
let _dismissTimer = null;
/** @type {(() => void)|null} */
let _onDismissCallback = null;
let _initialized = false;

/**
 * Maps a Braze CaptionedImage card to plain fields for the UI.
 * @param {Object} card - Braze content card instance.
 * @returns {{ title: string, description: string, imageUrl: string, alt: string, url: string }}
 */
function mapCaptionedImageCard(card) {
  return {
    title: card.title || '',
    description: card.description || '',
    imageUrl: card.imageUrl || card.image || '',
    alt: card.altImageText || '',
    url: card.url || '',
  };
}

/**
 * Clears auto-dismiss timer.
 * @private
 */
function _clearTimer() {
  if (_dismissTimer) {
    clearTimeout(_dismissTimer);
    _dismissTimer = null;
  }
}

/**
 * Removes the visible toast from the host.
 * @private
 */
function _clearToastDOM() {
  if (!_host) return;
  _host.innerHTML = '';
}

/**
 * Hides toast, invokes dismiss callback, clears timers.
 * @private
 */
function _hide() {
  _clearTimer();
  if (_onDismissCallback) {
    try {
      _onDismissCallback();
    } catch (e) {
      AppLogger.warn('UI', 'Braze toast onDismiss failed', e.message);
    }
    _onDismissCallback = null;
  }
  _clearToastDOM();
}

/**
 * Logs content card impression to Braze when available.
 * @param {Object} card - Braze card reference.
 * @private
 */
function _logImpression(card) {
  if (!window.braze || typeof window.braze.logContentCardImpressions !== 'function') return;
  try {
    window.braze.logContentCardImpressions([card]);
    AppLogger.debug('SDK', 'Content card impression logged (toast)', { id: card.id });
  } catch (e) {
    AppLogger.warn('SDK', 'logContentCardImpressions failed', e.message);
  }
}

/**
 * Logs content card click to Braze when available.
 * @param {Object} card - Braze card reference.
 * @private
 */
function _logClick(card) {
  if (!window.braze || typeof window.braze.logContentCardClick !== 'function') return;
  try {
    window.braze.logContentCardClick(card);
  } catch (e) {
    AppLogger.warn('SDK', 'logContentCardClick failed', e.message);
  }
}

/**
 * Renders toast UI from a plain payload (shared by content cards and IAM).
 * @param {Object} opts
 * @param {string} opts.title - Header line.
 * @param {string} opts.description - Body text.
 * @param {string} [opts.imageUrl=''] - Optional image URL.
 * @param {string} [opts.alt=''] - Image alt text.
 * @param {number} opts.dismissMs - Auto-hide after this many ms.
 * @param {() => void} [opts.onImpression] - After mount (analytics).
 * @param {() => void} [opts.onDismiss] - On timer or dismiss button (analytics).
 * @param {(ev: MouseEvent) => void} [opts.onRowClick] - Row tap handler (overrides default URL open).
 * @private
 */
function _showToastPayload(opts) {
  if (!_host) return;

  const {
    title,
    description,
    imageUrl = '',
    alt = '',
    dismissMs,
    onImpression,
    onDismiss,
    onRowClick,
  } = opts;

  _hide();

  _onDismissCallback = typeof onDismiss === 'function' ? onDismiss : null;

  try {
    onImpression?.();
  } catch (e) {
    AppLogger.warn('SDK', 'Toast onImpression failed', e.message);
  }

  const wrap = document.createElement('div');
  wrap.className = 'braze-toast-inner';
  wrap.setAttribute('role', 'alert');

  const row = document.createElement('div');
  row.className = 'braze-toast-row';

  const handleRowClick = onRowClick
    ? (ev) => {
        if (ev.target.closest('.braze-toast-dismiss')) return;
        onRowClick(ev);
      }
    : null;

  if (handleRowClick) {
    row.style.cursor = 'pointer';
    row.addEventListener('click', handleRowClick);
  }

  if (imageUrl) {
    const img = document.createElement('img');
    img.className = 'braze-toast-img';
    img.src = imageUrl;
    img.alt = alt || '';
    img.loading = 'lazy';
    img.addEventListener('error', () => {
      try {
        img.remove();
      } catch (e) {
        /* ignore */
      }
    });
    row.appendChild(img);
  }

  const textCol = document.createElement('div');
  textCol.className = 'braze-toast-text';

  const titleEl = document.createElement('div');
  titleEl.className = 'braze-toast-title';
  titleEl.textContent = title || 'Notification';

  const descEl = document.createElement('div');
  descEl.className = 'braze-toast-desc';
  descEl.textContent = description || '';

  textCol.appendChild(titleEl);
  textCol.appendChild(descEl);
  row.appendChild(textCol);

  const dismiss = document.createElement('button');
  dismiss.type = 'button';
  dismiss.className = 'braze-toast-dismiss tap-highlight';
  dismiss.setAttribute('aria-label', 'Dismiss notification');
  dismiss.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
  dismiss.addEventListener('click', (e) => {
    e.stopPropagation();
    _hide();
  });

  row.appendChild(dismiss);
  wrap.appendChild(row);
  _host.appendChild(wrap);

  const ms = typeof dismissMs === 'number' && dismissMs > 0 ? dismissMs : AUTO_DISMISS_MS;
  _dismissTimer = setTimeout(() => _hide(), ms);
  AppLogger.info('UI', 'Braze toast shown', { title });
}

/**
 * Renders a single toast for the given Braze card (last/most recent when batch).
 * @param {Object} card - CaptionedImage content card from Braze.
 * @private
 */
function _showForCard(card) {
  const { title, description, imageUrl, alt, url } = mapCaptionedImageCard(card);
  _showToastPayload({
    title: title || 'Notification',
    description,
    imageUrl,
    alt,
    dismissMs: AUTO_DISMISS_MS,
    onImpression: () => _logImpression(card),
    onRowClick: url
      ? () => {
          _logClick(card);
          window.open(url, '_blank', 'noopener,noreferrer');
          _hide();
        }
      : null,
  });
}

/**
 * Resolves optional IAM open URL from instance and extras (defensive).
 * @param {Object} iam - Braze InAppMessage.
 * @returns {string}
 * @private
 */
function _iamOpenUrl(iam) {
  try {
    const u = iam.uri ?? iam.url;
    if (typeof u === 'string' && u.trim()) return u.trim();
  } catch (e) {
    /* ignore */
  }
  try {
    const ex = iam.extras && typeof iam.extras === 'object' ? iam.extras : {};
    for (const key of ['link_url', 'url', 'uri']) {
      const v = ex[key];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
  } catch (e) {
    /* ignore */
  }
  return '';
}

/**
 * Picks a title string for IAM toast from extras / messageExtras.
 * @param {Object} iam
 * @returns {string}
 * @private
 */
function _iamTitle(iam) {
  try {
    const ex = iam.extras && typeof iam.extras === 'object' ? iam.extras : {};
    if (typeof ex.title === 'string' && ex.title.trim()) return ex.title.trim();
    if (typeof ex.heading === 'string' && ex.heading.trim()) return ex.heading.trim();
  } catch (e) {
    /* ignore */
  }
  try {
    const mx = iam.messageExtras && typeof iam.messageExtras === 'object' ? iam.messageExtras : {};
    for (const k of ['title', 'heading', 'subject']) {
      const v = mx[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
    for (const v of Object.values(mx)) {
      if (typeof v === 'string' && v.trim() && v.length <= 80) return v.trim();
    }
  } catch (e) {
    /* ignore */
  }
  return 'Message';
}

/**
 * Computes dismiss duration for IAM (ms).
 * @param {Object} iam
 * @returns {number}
 * @private
 */
function _iamDismissMs(iam) {
  const auto = 'AUTO_DISMISS';
  let isAuto = false;
  try {
    const DT = window.braze?.InAppMessage?.DismissType;
    if (DT && iam.dismissType === DT.AUTO_DISMISS) isAuto = true;
    if (String(iam.dismissType) === auto) isAuto = true;
  } catch (e) {
    if (String(iam.dismissType) === auto) isAuto = true;
  }
  const d = Number(iam.duration);
  if (isAuto && d > 0) return d;
  return AUTO_DISMISS_MS;
}

/**
 * Handles braze:toasts custom event; shows the last card (most recent in batch).
 * @param {CustomEvent} ev
 * @private
 */
function _onToasts(ev) {
  const toasts = ev.detail;
  if (!Array.isArray(toasts) || toasts.length === 0) return;
  const card = toasts[toasts.length - 1];
  _showForCard(card);
}

const BrazeToast = {
  /**
   * Mounts the toast host inside the phone frame and subscribes to braze:toasts.
   * @param {HTMLElement|null} phoneFrameEl - #phone-frame element.
   * @returns {void}
   */
  init(phoneFrameEl) {
    if (!phoneFrameEl || _initialized) return;
    _initialized = true;

    _host = document.createElement('div');
    _host.id = 'braze-toast-host';
    _host.setAttribute('aria-live', 'polite');
    phoneFrameEl.appendChild(_host);

    document.addEventListener('braze:toasts', _onToasts);
    AppLogger.info('UI', 'BrazeToast initialized');
  },

  /**
   * Renders a Braze In-App Message as the standard toast. Requires non-empty `message`.
   * Analytics use SDK methods when present (`logInAppMessageImpression`, etc.); behavior varies by SDK build.
   * @param {Object|null|undefined} inAppMessage - Braze InAppMessage instance.
   * @returns {void}
   */
  showForInAppMessage(inAppMessage) {
    if (inAppMessage == null) {
      AppLogger.warn('SDK', 'IAM toast skipped: missing inAppMessage');
      return;
    }
    if (inAppMessage.isControl === true) {
      return;
    }
    const body =
      typeof inAppMessage.message === 'string' ? inAppMessage.message.trim() : '';
    if (!body) {
      AppLogger.warn('SDK', 'IAM toast skipped: empty or missing message');
      return;
    }

    if (!_host) {
      AppLogger.warn('UI', 'IAM toast skipped: BrazeToast host not initialized');
      return;
    }

    const title = _iamTitle(inAppMessage);
    let imageUrl = '';
    try {
      const iu = inAppMessage.imageUrl ?? inAppMessage.image;
      if (typeof iu === 'string' && iu.trim()) imageUrl = iu.trim();
    } catch (e) {
      /* ignore */
    }
    const openUrl = _iamOpenUrl(inAppMessage);
    const dismissMs = _iamDismissMs(inAppMessage);
    const iam = inAppMessage;

    const logIamImpression = () => {
      if (!window.braze || typeof window.braze.logInAppMessageImpression !== 'function') return;
      try {
        window.braze.logInAppMessageImpression(iam);
        AppLogger.debug('SDK', 'IAM impression logged (toast)');
      } catch (e) {
        AppLogger.warn('SDK', 'logInAppMessageImpression failed', e.message);
      }
    };

    const logIamDismissed = () => {
      if (!window.braze || typeof window.braze.logInAppMessageDismissed !== 'function') return;
      try {
        window.braze.logInAppMessageDismissed(iam);
        AppLogger.debug('SDK', 'IAM dismissed logged (toast)');
      } catch (e) {
        AppLogger.warn('SDK', 'logInAppMessageDismissed failed', e.message);
      }
    };

    const logIamClick = () => {
      if (!window.braze || typeof window.braze.logInAppMessageClick !== 'function') return;
      try {
        window.braze.logInAppMessageClick(iam);
      } catch (e) {
        AppLogger.warn('SDK', 'logInAppMessageClick failed', e.message);
      }
    };

    _showToastPayload({
      title,
      description: body,
      imageUrl,
      alt: '',
      dismissMs,
      onImpression: logIamImpression,
      onDismiss: logIamDismissed,
      onRowClick: openUrl
        ? () => {
            logIamClick();
            window.open(openUrl, '_blank', 'noopener,noreferrer');
            _hide();
          }
        : null,
    });
  },

  /**
   * Removes listeners and host (e.g. for tests).
   * @returns {void}
   */
  destroy() {
    document.removeEventListener('braze:toasts', _onToasts);
    _hide();
    if (_host && _host.parentNode) {
      _host.parentNode.removeChild(_host);
    }
    _host = null;
    _initialized = false;
  },
};

export default BrazeToast;
