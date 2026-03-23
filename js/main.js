/**
 * Application entry point — Pan Pacific Hotel Group demo (Singapore stays).
 * @module Main
 */
import StorageManager from './storage-manager.js';
import AppLogger from './app-logger.js';
import AppConfig from './config.js';
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
