/**
 * Profile screen — test user info and settings menu.
 * @module Profile
 */
import Header from '../../components/header.js';
import BrazeManager from '../../braze-manager.js';
import { TEST_USER } from './demo-data.easymoney.js';
import AppLogger from '../../app-logger.js';

/**
 * Render the Profile screen.
 * @param {HTMLElement} container - The #app-content element.
 */
export default function renderProfile(container) {
  Header.renderSubPage('Profile', { backRoute: '/' });

  const user = BrazeManager.getUserProfile();
  const wrapper = document.createElement('div');
  wrapper.style.paddingTop = '45px';

  const header = document.createElement('div');
  header.className = 'profile-header';

  const avatar = document.createElement('div');
  avatar.className = 'profile-avatar';
  avatar.innerHTML = '<i class="fa-solid fa-circle-user" aria-hidden="true"></i>';

  const name = document.createElement('div');
  name.className = 'profile-name';
  name.textContent = `${user.first_name} ${user.last_name}`;

  const email = document.createElement('div');
  email.className = 'profile-email';
  email.textContent = user.email;

  header.appendChild(avatar);
  header.appendChild(name);
  header.appendChild(email);
  wrapper.appendChild(header);

  const menuItems = [
    { icon: 'fa-solid fa-receipt', label: 'My Orders' },
    { icon: 'fa-solid fa-heart', label: 'Wishlist' },
    { icon: 'fa-solid fa-map-marker-alt', label: 'Addresses' },
    { icon: 'fa-solid fa-credit-card', label: 'Payment Methods' },
    { icon: 'fa-solid fa-bell', label: 'Notifications' },
    { icon: 'fa-solid fa-shield-halved', label: 'Privacy & Security' },
    { icon: 'fa-solid fa-circle-question', label: 'Help & Support' },
  ];

  menuItems.forEach(item => {
    const row = document.createElement('div');
    row.className = 'profile-menu-item';
    row.innerHTML = `
      <i class="${item.icon}" aria-hidden="true"></i>
      <span>${item.label}</span>
      <i class="fa-solid fa-chevron-right" style="color:var(--color-text-muted); font-size:12px;" aria-hidden="true"></i>
    `;
    row.addEventListener('click', () => {
      AppLogger.info('UI', `Profile menu: ${item.label}`);
    });
    wrapper.appendChild(row);
  });

  const idSection = document.createElement('div');
  idSection.style.cssText = 'padding:24px 16px; text-align:center; font-size:11px; color:var(--color-text-muted);';
  idSection.textContent = `External ID: ${user.external_id}`;
  wrapper.appendChild(idSection);

  container.innerHTML = '';
  container.appendChild(wrapper);
}
