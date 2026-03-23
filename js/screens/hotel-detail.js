/**
 * Hotel overview — gallery, quick actions, description, link to rooms.
 * @module HotelDetail
 */
import Header from '../components/header.js';
import Router from '../router.js';
import BrazeManager from '../braze-manager.js';
import StorageManager from '../storage-manager.js';
import { getHotelById, getRoomsForHotel, DEFAULT_STAY, formatSgd } from '../demo-data.js';

/**
 * Render hotel detail for a property id.
 * @param {HTMLElement} container
 * @param {string} hotelId
 */
export default function renderHotelDetail(container, hotelId) {
  const hotel = getHotelById(hotelId);
  if (!hotel) {
    Header.renderSubPage('Hotel', { backRoute: '/explore' });
    const err = document.createElement('div');
    err.style.cssText = 'padding:48px 20px;text-align:center;color:var(--pphg-text-secondary);';
    err.textContent = 'Property not found.';
    container.innerHTML = '';
    container.appendChild(err);
    return;
  }

  Header.renderSubPage(hotel.name, { backRoute: '/explore' });

  BrazeManager.logEvent('Hotel - Detail Viewed', {
    hotel_id: hotelId,
    hotel_name: hotel.name,
  });

  let slide = 0;
  const rooms = getRoomsForHotel(hotelId);

  const wrap = document.createElement('div');
  wrap.style.paddingBottom = '24px';

  const gallery = document.createElement('div');
  gallery.style.cssText = 'position:relative;width:100%;aspect-ratio:16/10;background:#111;';

  const img = document.createElement('img');
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
  img.alt = hotel.name;

  const indicator = document.createElement('div');
  indicator.style.cssText =
    'position:absolute;bottom:10px;right:12px;background:rgba(0,0,0,0.55);color:#fff;font-size:11px;padding:4px 10px;border-radius:4px;';

  function showSlide(i) {
    slide = (i + hotel.images.length) % hotel.images.length;
    img.src = hotel.images[slide];
    indicator.textContent = `${slide + 1} / ${hotel.images.length}`;
  }

  showSlide(0);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous photo');
  prev.style.cssText =
    'position:absolute;left:8px;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;border:none;background:rgba(0,0,0,0.45);color:#fff;';
  prev.innerHTML = '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>';
  prev.addEventListener('click', () => showSlide(slide - 1));

  const next = document.createElement('button');
  next.type = 'button';
  next.setAttribute('aria-label', 'Next photo');
  next.style.cssText =
    'position:absolute;right:8px;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;border:none;background:rgba(0,0,0,0.45);color:#fff;';
  next.innerHTML = '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>';
  next.addEventListener('click', () => showSlide(slide + 1));

  gallery.appendChild(img);
  gallery.appendChild(indicator);
  gallery.appendChild(prev);
  gallery.appendChild(next);

  const actions = document.createElement('div');
  actions.className = 'pphg-quick-actions';
  actions.innerHTML = `
    <button type="button"><i class="fa-solid fa-phone" aria-hidden="true"></i><span>Call</span></button>
    <button type="button"><i class="fa-solid fa-diamond-turn-right" aria-hidden="true"></i><span>Map</span></button>
    <button type="button"><i class="fa-solid fa-envelope" aria-hidden="true"></i><span>Email</span></button>
  `;
  const [btnCall, btnMap, btnMail] = actions.querySelectorAll('button');
  btnCall.addEventListener('click', () => {
    BrazeManager.logEvent('Hotel - Quick Action', { action: 'call', hotel_id: hotelId });
    window.location.href = `tel:${hotel.phone.replace(/\s/g, '')}`;
  });
  btnMap.addEventListener('click', () => {
    BrazeManager.logEvent('Hotel - Quick Action', { action: 'directions', hotel_id: hotelId });
    window.open(hotel.mapsUrl, '_blank', 'noopener');
  });
  btnMail.addEventListener('click', () => {
    BrazeManager.logEvent('Hotel - Quick Action', { action: 'email', hotel_id: hotelId });
  });

  const body = document.createElement('div');
  body.style.cssText = 'padding:16px var(--container-padding) 0;';

  const area = document.createElement('div');
  area.style.cssText = 'font-size:13px;color:var(--pphg-text-secondary);margin-bottom:8px;';
  area.textContent = hotel.area;

  const desc = document.createElement('p');
  desc.style.cssText = 'font-size:14px;line-height:1.55;color:var(--pphg-text-primary);margin-bottom:12px;';
  desc.textContent = hotel.description;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'pphg-btn-secondary';
  toggle.style.marginBottom = '20px';
  toggle.textContent = 'Read full overview';
  let expanded = false;
  toggle.addEventListener('click', () => {
    expanded = !expanded;
    desc.textContent = expanded
      ? `${hotel.description} Complimentary Wi‑Fi, 24h fitness studio, and late checkout subject to availability for DISCOVERY members.`
      : hotel.description;
    toggle.textContent = expanded ? 'Show less' : 'Read full overview';
  });

  const roomStripLabel = document.createElement('div');
  roomStripLabel.className = 'pphg-heading-serif';
  roomStripLabel.style.fontSize = '14px';
  roomStripLabel.style.marginBottom = '10px';
  roomStripLabel.textContent = 'Room types';

  const strip = document.createElement('div');
  strip.style.cssText =
    'display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;margin-bottom:8px;-webkit-overflow-scrolling:touch;';

  rooms.forEach((r) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.style.cssText =
      'flex:0 0 140px;text-align:left;border:1px solid var(--pphg-border);border-radius:8px;overflow:hidden;background:var(--pphg-surface);cursor:pointer;';
    card.innerHTML = `
      <img src="${r.image}" alt="" style="width:100%;height:88px;object-fit:cover;" />
      <div style="padding:8px;font-size:11px;color:var(--pphg-text-primary);line-height:1.3;">${r.title}</div>
    `;
    card.addEventListener('click', () => Router.navigate(`/hotel/${hotelId}/rooms`));
    strip.appendChild(card);
  });

  const from = document.createElement('div');
  from.style.cssText =
    'font-size:15px;font-weight:700;color:var(--pphg-primary);margin:12px 0 16px;';
  from.textContent = `From ${formatSgd(hotel.fromPrice)} / night`;

  const cta = document.createElement('button');
  cta.type = 'button';
  cta.className = 'pphg-btn-primary';
  cta.textContent = 'Select dates & rooms';
  cta.addEventListener('click', () => {
    StorageManager.set('booking_draft', {
      hotelId,
      checkIn: DEFAULT_STAY.checkIn,
      checkOut: DEFAULT_STAY.checkOut,
      adults: 2,
      children: 0,
    });
    BrazeManager.logEvent('Booking - Dates Selected', {
      hotel_id: hotelId,
      check_in: DEFAULT_STAY.checkIn,
      check_out: DEFAULT_STAY.checkOut,
    });
    Router.navigate(`/hotel/${hotelId}/rooms`);
  });

  body.appendChild(area);
  body.appendChild(desc);
  body.appendChild(toggle);
  body.appendChild(roomStripLabel);
  body.appendChild(strip);
  body.appendChild(from);
  body.appendChild(cta);

  wrap.appendChild(gallery);
  wrap.appendChild(actions);
  wrap.appendChild(body);

  container.innerHTML = '';
  container.appendChild(wrap);
}
