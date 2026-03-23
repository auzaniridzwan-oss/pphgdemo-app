/**
 * Explore — list and filter Singapore hotels from demo data.
 * @module Explore
 */
import Header from '../components/header.js';
import Router from '../router.js';
import BrazeManager from '../braze-manager.js';
import { HOTELS } from '../demo-data.js';
import { createHotelCard } from '../components/hotel-card.js';

/**
 * Render Explore screen.
 * @param {HTMLElement} container
 */
export default function renderExplore(container) {
  Header.renderSubPage('Singapore', { backRoute: '/' });

  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding:12px var(--container-padding) 24px;';

  const searchLabel = document.createElement('span');
  searchLabel.className = 'pphg-label';
  searchLabel.textContent = 'Find a property';

  const search = document.createElement('input');
  search.type = 'search';
  search.placeholder = 'Search by name or district';
  search.style.cssText =
    'width:100%;background:var(--pphg-surface);border:1px solid var(--pphg-border);border-radius:6px;color:var(--pphg-text-primary);padding:12px 14px;font-size:15px;margin-bottom:16px;';

  const listHost = document.createElement('div');

  /**
   * @param {string} q
   */
  function renderList(q) {
    listHost.innerHTML = '';
    const needle = (q || '').trim().toLowerCase();
    const filtered = HOTELS.filter(
      (h) =>
        !needle ||
        h.name.toLowerCase().includes(needle) ||
        h.area.toLowerCase().includes(needle)
    );

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'text-align:center;color:var(--pphg-text-secondary);padding:32px 12px;';
      empty.textContent = 'No matches — try “Marina” or “Orchard”.';
      listHost.appendChild(empty);
      return;
    }

    filtered.forEach((hotel) => {
      listHost.appendChild(
        createHotelCard(hotel, () => {
          BrazeManager.logEvent('Hotel - Viewed', {
            hotel_id: hotel.id,
            hotel_name: hotel.name,
            from_price: hotel.fromPrice,
          });
          Router.navigate(`/hotel/${hotel.id}`);
        })
      );
    });
  }

  search.addEventListener('input', () => renderList(search.value));

  wrap.appendChild(searchLabel);
  wrap.appendChild(search);
  wrap.appendChild(listHost);
  renderList('');

  container.innerHTML = '';
  container.appendChild(wrap);
}
