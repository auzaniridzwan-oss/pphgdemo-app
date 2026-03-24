/**
 * Application entry point — Pan Pacific Hotel Group demo (Singapore stays).
 * @module Main
 */
import StorageManager from './storage-manager.js';
import AppLogger from './app-logger.js';
import AppConfig from './config.js';
import AuthService from './auth-service.js';
import BrazeManager from './braze-manager.js';
import Router from './router.js';
import BottomNav from './components/bottom-nav.js';
import Header from './components/header.js';
import DebugOverlay from './components/debug-overlay.js';
import BrazeToast from './components/braze-toast.js';

import renderBookHome from './screens/book-home.js';
import renderExplore from './screens/explore.js';
import renderHotelDetail from './screens/hotel-detail.js';
import renderRoomSelection from './screens/room-selection.js';
import renderBookingCheckout from './screens/booking-checkout.js';
import renderOffers from './screens/offers.js';
import renderLoyalty from './screens/loyalty.js';
import renderAccount from './screens/account.js';

/**
 * Sync toolbar mode / login buttons with AuthService.
 */
function syncToolbarAuthUI() {
  const mode = AuthService.getAuthMode();
  const demoBtn = document.getElementById('btn-mode-demo');
  const liveBtn = document.getElementById('btn-mode-live');
  if (demoBtn && liveBtn) {
    const isDemo = mode === 'demo';
    demoBtn.setAttribute('aria-pressed', isDemo ? 'true' : 'false');
    liveBtn.setAttribute('aria-pressed', isDemo ? 'false' : 'true');
    demoBtn.classList.toggle('text-yellow-300', isDemo);
    demoBtn.classList.toggle('font-semibold', isDemo);
    demoBtn.classList.toggle('opacity-60', !isDemo);
    liveBtn.classList.toggle('text-yellow-300', !isDemo);
    liveBtn.classList.toggle('font-semibold', !isDemo);
    liveBtn.classList.toggle('opacity-60', isDemo);
  }
  const loginBtn = document.getElementById('btn-login');
  const logoutBtn = document.getElementById('btn-logout');
  if (loginBtn && logoutBtn) {
    const loggedIn = AuthService.isLoggedIn();
    loginBtn.classList.toggle('hidden', loggedIn);
    logoutBtn.classList.toggle('hidden', !loggedIn);
  }
}

/**
 * Show or hide live-login dialog.
 * @param {boolean} open
 */
function setLiveLoginOpen(open) {
  const backdrop = document.getElementById('live-login-backdrop');
  if (!backdrop) return;
  backdrop.classList.toggle('hidden', !open);
  backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (open) {
    const input = document.getElementById('live-external-id');
    if (input) input.focus();
  }
}

/**
 * Wire Demo/Live mode, login/logout, and live external_id dialog.
 */
function initAuthToolbar() {
  syncToolbarAuthUI();

  document.getElementById('btn-mode-demo')?.addEventListener('click', () => {
    AuthService.setAuthMode('demo');
    syncToolbarAuthUI();
  });

  document.getElementById('btn-mode-live')?.addEventListener('click', () => {
    AuthService.setAuthMode('live');
    syncToolbarAuthUI();
  });

  document.getElementById('btn-login')?.addEventListener('click', () => {
    if (AuthService.getAuthMode() === 'demo') {
      AuthService.loginDemo();
      BrazeManager.identifyLoggedInUser();
      BottomNav.refreshAuthState();
      BrazeManager.logEvent('Auth - Login Completed', { mode: 'demo' });
      syncToolbarAuthUI();
      return;
    }
    setLiveLoginOpen(true);
  });

  document.getElementById('btn-logout')?.addEventListener('click', () => {
    AuthService.logout();
  });

  document.getElementById('live-login-cancel')?.addEventListener('click', () => {
    setLiveLoginOpen(false);
  });

  document.getElementById('live-login-backdrop')?.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'live-login-backdrop') setLiveLoginOpen(false);
  });

  const submitLiveLogin = async () => {
    const input = document.getElementById('live-external-id');
    const externalId = (input?.value || '').trim();
    if (!externalId) {
      AppLogger.warn('AUTH', 'Live login: empty external_id');
      return;
    }
    try {
      const profile = await BrazeManager.fetchLiveProfileFromServer(externalId);
      AuthService.loginLive(externalId, profile);
      BrazeManager.identifyLoggedInUser();
      BottomNav.refreshAuthState();
      BrazeManager.logEvent('Auth - Login Completed', { mode: 'live' });
      if (input) input.value = '';
      setLiveLoginOpen(false);
      syncToolbarAuthUI();
    } catch (e) {
      AppLogger.error('AUTH', 'Live login failed', e?.message || String(e));
      window.alert(e?.message || 'Login failed');
    }
  };

  document.getElementById('live-login-submit')?.addEventListener('click', () => {
    submitLiveLogin();
  });

  document.getElementById('live-external-id')?.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      submitLiveLogin();
    }
  });
}

/**
 * Boot the application — called once on DOMContentLoaded.
 * Async to allow awaiting the lazy-loaded Braze SDK before the session opens.
 */
async function boot() {
  AppLogger.info('SYSTEM', `${AppConfig.app.name} v${AppConfig.app.version} starting...`);

  Header.init(document.getElementById('app-header'));
  BrazeToast.init(document.getElementById('phone-frame'));

  await BrazeManager.load();

  Router.register({
    '/': renderBookHome,
    '/explore': renderExplore,
    '/offers': renderOffers,
    '/loyalty': renderLoyalty,
    '/account': renderAccount,
  });

  Router.registerMatcher((path) => {
    const checkout = path.match(/^\/hotel\/([^/]+)\/checkout$/);
    if (checkout) {
      return { handler: renderBookingCheckout, args: [checkout[1]] };
    }
    const rooms = path.match(/^\/hotel\/([^/]+)\/rooms$/);
    if (rooms) {
      return { handler: renderRoomSelection, args: [rooms[1]] };
    }
    const detail = path.match(/^\/hotel\/([^/]+)$/);
    if (detail) {
      return { handler: renderHotelDetail, args: [detail[1]] };
    }
    return null;
  });

  Router.onRouteChange((route) => {
    BottomNav.onRouteChange(route);
  });

  BottomNav.render(document.getElementById('app-nav'));

  DebugOverlay.init();

  initAuthToolbar();

  const resetBtn = document.getElementById('btn-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      StorageManager.clearSession();
      AppLogger.info('SYSTEM', 'App reset to initial demo state');
      window.location.hash = '#/';
      window.location.reload();
    });
  }

  Router.start();

  AppLogger.info('SYSTEM', 'App boot complete');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
