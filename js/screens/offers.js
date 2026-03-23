/**
 * Seasonal offers — March / Q1 2026 Singapore-relevant promos.
 * @module Offers
 */
import Header from '../components/header.js';
import BrazeManager from '../braze-manager.js';
import { OFFERS } from '../demo-data.js';

/**
 * @param {HTMLElement} container
 */
export default function renderOffers(container) {
  Header.renderSubPage('Offers', { backRoute: '/' });

  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding:12px var(--container-padding) 28px;';

  const intro = document.createElement('p');
  intro.style.cssText =
    'font-size:13px;color:var(--pphg-text-secondary);line-height:1.5;margin-bottom:18px;';
  intro.textContent =
    'Limited-time packages for March school holidays, Easter weekend, and Grand Prix season previews — demo rates only.';
  wrap.appendChild(intro);

  OFFERS.forEach((offer) => {
    const card = document.createElement('article');
    card.className = 'pphg-offer-card';
    card.style.cursor = 'pointer';
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="pphg-offer-card__media">
        <img src="${offer.image}" alt="" />
        <span class="pphg-offer-card__badge">${offer.badge}</span>
      </div>
      <div class="pphg-offer-card__body">
        <h2 class="pphg-offer-card__title">${offer.title}</h2>
        <div class="pphg-offer-card__loc">${offer.location}</div>
        <div class="pphg-offer-card__valid">${offer.validThrough}</div>
      </div>
    `;
    const open = () => {
      BrazeManager.logEvent('Promotion - Viewed', {
        offer_id: offer.id,
        offer_title: offer.title,
      });
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
    wrap.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(wrap);
}
