/**
 * Hotel list card factory for Explore screen.
 * @module HotelCard
 */
import { formatSgd } from '../demo-data.js';

/**
 * Create a hotel row button for the explore list.
 * @param {Object} hotel - Hotel from demo data.
 * @param {Function} onSelect - Callback invoked with hotel object.
 * @returns {HTMLButtonElement}
 */
export function createHotelCard(hotel, onSelect) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'pphg-hotel-card';

  const img = document.createElement('img');
  img.className = 'pphg-hotel-card__thumb';
  img.src = hotel.thumbnail;
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');

  const meta = document.createElement('div');
  meta.className = 'pphg-hotel-card__meta';

  const name = document.createElement('div');
  name.className = 'pphg-hotel-card__name';
  name.textContent = hotel.name;

  const area = document.createElement('div');
  area.className = 'pphg-hotel-card__area';
  area.textContent = hotel.area;

  const from = document.createElement('div');
  from.className = 'pphg-hotel-card__from';
  from.textContent = `From ${formatSgd(hotel.fromPrice)} / night`;

  meta.appendChild(name);
  meta.appendChild(area);
  meta.appendChild(from);

  btn.appendChild(img);
  btn.appendChild(meta);

  btn.addEventListener('click', () => onSelect(hotel));

  return btn;
}

export default { createHotelCard };
