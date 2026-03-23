/**
 * Room type list — select rate and continue to checkout.
 * @module RoomSelection
 */
import Header from '../components/header.js';
import Router from '../router.js';
import BrazeManager from '../braze-manager.js';
import StorageManager from '../storage-manager.js';
import {
  getHotelById,
  getRoomsForHotel,
  formatSgd,
  DEFAULT_STAY,
} from '../demo-data.js';

/**
 * @param {string} checkIn
 * @param {string} checkOut
 * @returns {number}
 */
function nightsBetween(checkIn, checkOut) {
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  return Math.max(1, Math.round((b - a) / 86400000));
}

/**
 * Render room selection for a hotel.
 * @param {HTMLElement} container
 * @param {string} hotelId
 */
export default function renderRoomSelection(container, hotelId) {
  const hotel = getHotelById(hotelId);
  const rooms = getRoomsForHotel(hotelId);

  if (!hotel || rooms.length === 0) {
    Header.renderSubPage('Rooms', { backRoute: '/explore' });
    const err = document.createElement('div');
    err.style.cssText = 'padding:48px 20px;text-align:center;color:var(--pphg-text-secondary);';
    err.textContent = 'No rooms available for this demo property.';
    container.innerHTML = '';
    container.appendChild(err);
    return;
  }

  Header.renderSubPage('Choose room', { backRoute: `/hotel/${hotelId}` });

  let draft = StorageManager.get('booking_draft', {});
  if (draft.hotelId !== hotelId) {
    draft = {
      hotelId,
      adults: 2,
      children: 0,
      checkIn: DEFAULT_STAY.checkIn,
      checkOut: DEFAULT_STAY.checkOut,
    };
  }
  if (!draft.checkIn || !draft.checkOut) {
    draft.checkIn = draft.checkIn || DEFAULT_STAY.checkIn;
    draft.checkOut = draft.checkOut || DEFAULT_STAY.checkOut;
  }
  StorageManager.set('booking_draft', draft);

  const nights = nightsBetween(draft.checkIn, draft.checkOut);

  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding:12px var(--container-padding) 28px;';

  const summary = document.createElement('div');
  summary.style.cssText =
    'background:var(--pphg-surface);border:1px solid var(--pphg-border);border-radius:8px;padding:14px 16px;margin-bottom:20px;';
  summary.innerHTML = `
    <div class="pphg-label" style="margin-bottom:4px;">${hotel.name}</div>
    <div style="font-size:14px;color:var(--pphg-text-primary);">${draft.checkIn} → ${draft.checkOut}</div>
    <div style="font-size:13px;color:var(--pphg-text-secondary);margin-top:6px;">${nights} night${nights === 1 ? '' : 's'} · Demo dates</div>
  `;

  wrap.appendChild(summary);

  rooms.forEach((room) => {
    const card = document.createElement('div');
    card.className = 'pphg-room-card';

    const im = document.createElement('img');
    im.src = room.image;
    im.alt = '';

    const body = document.createElement('div');
    body.className = 'pphg-room-card__body';

    const title = document.createElement('div');
    title.className = 'pphg-room-card__title';
    title.textContent = room.title;

    const meta = document.createElement('div');
    meta.className = 'pphg-room-card__meta';
    meta.textContent = room.meta;

    const total = room.pricePerNight * nights;
    const price = document.createElement('div');
    price.className = 'pphg-room-card__price';
    price.textContent = `${formatSgd(room.pricePerNight)} / night · ${formatSgd(total)} total`;

    const sel = document.createElement('button');
    sel.type = 'button';
    sel.className = 'pphg-btn-primary';
    sel.textContent = 'Select room';
    sel.addEventListener('click', () => {
      const next = {
        ...draft,
        hotelId,
        roomId: room.id,
        roomTitle: room.title,
        pricePerNight: room.pricePerNight,
        nights,
        totalSgd: total,
      };
      StorageManager.set('booking_draft', next);
      BrazeManager.logEvent('Booking - Room Selected', {
        hotel_id: hotelId,
        room_id: room.id,
        nights,
        total_sgd: total,
      });
      Router.navigate(`/hotel/${hotelId}/checkout`);
    });

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(price);
    body.appendChild(sel);

    card.appendChild(im);
    card.appendChild(body);
    wrap.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(wrap);
}
