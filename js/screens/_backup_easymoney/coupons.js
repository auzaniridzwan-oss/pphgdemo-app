/**
 * Coupons screen — displays all available coupons.
 * @module Coupons
 */
import Header from '../../components/header.js';
import { COUPONS, formatPrice } from './demo-data.easymoney.js';
import AppLogger from '../../app-logger.js';

/**
 * Render the Coupons screen.
 * @param {HTMLElement} container - The #app-content element.
 */
export default function renderCoupons(container) {
  Header.renderSubPage('Coupons', { backRoute: '/' });

  const wrapper = document.createElement('div');
  wrapper.style.paddingTop = '45px';

  const title = document.createElement('div');
  title.className = 'section-title';
  title.textContent = 'Available Coupons';
  wrapper.appendChild(title);

  COUPONS.forEach(coupon => {
    const card = document.createElement('div');
    card.className = 'coupon-card';

    const codeRow = document.createElement('div');
    codeRow.style.cssText = 'display:flex; justify-content:space-between; align-items:center;';

    const code = document.createElement('div');
    code.className = 'coupon-code';
    code.textContent = coupon.code;

    const value = document.createElement('span');
    value.style.cssText = 'font-size:14px; font-weight:700; color:var(--color-primary);';
    value.textContent = coupon.discountType === 'percent'
      ? `${coupon.discountValue}% OFF`
      : `${formatPrice(coupon.discountValue)} OFF`;

    codeRow.appendChild(code);
    codeRow.appendChild(value);

    const desc = document.createElement('div');
    desc.className = 'coupon-desc';
    desc.textContent = coupon.description;
    if (coupon.minSpend > 0) {
      desc.textContent += ` (min. spend ${formatPrice(coupon.minSpend)})`;
    }

    card.appendChild(codeRow);
    card.appendChild(desc);

    card.addEventListener('click', () => {
      AppLogger.info('UI', 'Coupon tapped', { coupon_code: coupon.code });
    });

    wrapper.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(wrapper);
}
