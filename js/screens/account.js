/**
 * Account — profile summary, quick actions, app version.
 * @module Account
 */
import Header from '../components/header.js';
import Router from '../router.js';
import AppLogger from '../app-logger.js';
import AppConfig from '../config.js';
import BrazeManager from '../braze-manager.js';

/**
 * @param {HTMLElement} container
 */
export default function renderAccount(container) {
  Header.renderSubPage('Account', { backRoute: '/' });

  const user = BrazeManager.getUserProfile();
  if (!user) {
    Router.navigate('/');
    return;
  }

  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding:12px var(--container-padding) 28px;';

  const banner = document.createElement('div');
  banner.style.cssText =
    'background:var(--pphg-surface);border:1px solid var(--pphg-border);border-radius:8px;padding:16px;margin-bottom:20px;';
  banner.innerHTML = `
    <div class="pphg-label" style="margin-bottom:6px;">DISCOVERY member</div>
    <div style="font-size:16px;font-weight:600;color:var(--pphg-text-primary);">${user.first_name} ${user.last_name}</div>
    <div style="font-size:12px;color:var(--pphg-text-secondary);margin-top:6px;">${user.email}</div>
  `;
  wrap.appendChild(banner);

  const grid = document.createElement('div');
  grid.className = 'pphg-account-grid';

  const items = [
    { icon: 'fa-solid fa-calendar-check', label: 'My stays', route: '/explore' },
    { icon: 'fa-solid fa-headset', label: 'Contact', route: null },
    { icon: 'fa-solid fa-circle-question', label: 'FAQ', route: null },
    { icon: 'fa-solid fa-gear', label: 'Settings', route: null },
  ];

  items.forEach((item) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'pphg-account-tile';
    tile.innerHTML = `<i class="${item.icon}" aria-hidden="true"></i><span>${item.label}</span>`;
    tile.addEventListener('click', () => {
      AppLogger.info('UI', `Account tile: ${item.label}`);
      if (item.route) Router.navigate(item.route);
    });
    grid.appendChild(tile);
  });

  wrap.appendChild(grid);

  const ver = document.createElement('div');
  ver.style.cssText =
    'text-align:center;font-size:11px;color:var(--pphg-text-secondary);padding:16px 0;';
  ver.textContent = `${AppConfig.app.name} demo v${AppConfig.app.version} · ${AppConfig.app.platform}`;
  wrap.appendChild(ver);

  container.innerHTML = '';
  container.appendChild(wrap);
}
