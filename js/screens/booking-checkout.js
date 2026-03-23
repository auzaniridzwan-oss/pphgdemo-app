/**
 * Review booking, guest details, mock payment, confirm.
 * @module BookingCheckout
 */
import Header from '../components/header.js';
import Router from '../router.js';
import BrazeManager from '../braze-manager.js';
import StorageManager from '../storage-manager.js';
import { getHotelById, formatSgd } from '../demo-data.js';

/**
 * @param {HTMLElement} container
 * @param {string} hotelId
 */
export default function renderBookingCheckout(container, hotelId) {
  const draft = StorageManager.get('booking_draft', {});

  if (!draft.roomId || draft.hotelId !== hotelId) {
    Header.renderSubPage('Checkout', { backRoute: `/hotel/${hotelId}/rooms` });
    const err = document.createElement('div');
    err.style.cssText = 'padding:48px 20px;text-align:center;color:var(--pphg-text-secondary);';
    err.innerHTML =
      '<p>Select a room first.</p><button type="button" class="pphg-btn-primary" style="margin-top:16px;">View rooms</button>';
    err.querySelector('button').addEventListener('click', () => {
      Router.navigate(`/hotel/${hotelId}/rooms`);
    });
    container.innerHTML = '';
    container.appendChild(err);
    return;
  }

  const hotel = getHotelById(hotelId);
  Header.renderSubPage('Review & pay', { backRoute: `/hotel/${hotelId}/rooms` });

  BrazeManager.logEvent('Checkout - Started', {
    hotel_id: hotelId,
    room_id: draft.roomId,
    total_sgd: draft.totalSgd,
  });

  let adults = draft.adults ?? 2;
  let children = draft.children ?? 0;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding:12px var(--container-padding) 32px;';

  const card = document.createElement('div');
  card.style.cssText =
    'background:var(--pphg-surface);border:1px solid var(--pphg-border);border-radius:8px;padding:16px;margin-bottom:20px;';
  card.innerHTML = `
    <div class="pphg-heading-serif" style="font-size:15px;margin-bottom:10px;">Booking summary</div>
    <div style="font-size:14px;color:var(--pphg-text-primary);margin-bottom:6px;">${hotel?.name || 'Hotel'}</div>
    <div style="font-size:13px;color:var(--pphg-text-secondary);">${draft.roomTitle}</div>
    <div style="font-size:13px;color:var(--pphg-text-secondary);margin-top:8px;">${draft.checkIn} → ${draft.checkOut} · ${draft.nights} night(s)</div>
    <div style="font-size:18px;font-weight:700;color:var(--pphg-primary);margin-top:14px;">${formatSgd(draft.totalSgd)}</div>
  `;
  wrap.appendChild(card);

  function stepper(label, get, set) {
    const row = document.createElement('div');
    row.className = 'pphg-stepper';

    const l = document.createElement('span');
    l.className = 'pphg-stepper__label';
    l.textContent = label;

    const controls = document.createElement('div');
    controls.className = 'pphg-stepper__controls';

    const minus = document.createElement('button');
    minus.type = 'button';
    minus.className = 'pphg-stepper__btn';
    minus.textContent = '−';

    const val = document.createElement('span');
    val.className = 'pphg-stepper__value';
    val.textContent = String(get());

    const plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'pphg-stepper__btn';
    plus.textContent = '+';

    function sync() {
      val.textContent = String(get());
      const cur = StorageManager.get('booking_draft', {});
      StorageManager.set('booking_draft', { ...cur, adults, children });
    }

    minus.addEventListener('click', () => {
      set(-1);
      sync();
    });
    plus.addEventListener('click', () => {
      set(1);
      sync();
    });

    controls.appendChild(minus);
    controls.appendChild(val);
    controls.appendChild(plus);
    row.appendChild(l);
    row.appendChild(controls);
    return row;
  }

  wrap.appendChild(
    stepper(
      'Adults',
      () => adults,
      (d) => {
        adults = Math.max(1, adults + d);
      }
    )
  );
  wrap.appendChild(
    stepper(
      'Children',
      () => children,
      (d) => {
        children = Math.max(0, children + d);
      }
    )
  );

  const formTitle = document.createElement('div');
  formTitle.className = 'pphg-heading-serif';
  formTitle.style.cssText = 'font-size:14px;margin:24px 0 12px;';
  formTitle.textContent = 'Guest details';
  wrap.appendChild(formTitle);

  const fields = ['first_name', 'last_name', 'email', 'phone'];
  const labels = ['First name', 'Last name', 'Email', 'Phone'];
  const inputs = {};
  fields.forEach((key, i) => {
    const g = document.createElement('div');
    g.className = 'pphg-input-group';
    const lb = document.createElement('span');
    lb.className = 'pphg-label';
    lb.textContent = labels[i];
    const inp = document.createElement('input');
    inp.name = key;
    inp.type = key.includes('email') ? 'email' : 'text';
    g.appendChild(lb);
    g.appendChild(inp);
    wrap.appendChild(g);
    inputs[key] = inp;
  });

  const payLabel = document.createElement('div');
  payLabel.className = 'pphg-heading-serif';
  payLabel.style.cssText = 'font-size:14px;margin:20px 0 12px;';
  payLabel.textContent = 'Payment method';
  wrap.appendChild(payLabel);

  const payRow = document.createElement('div');
  payRow.style.cssText = 'display:flex;gap:10px;margin-bottom:16px;';
  ['Card', 'PayNow'].forEach((label, idx) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.style.cssText = `flex:1;min-height:44px;border-radius:4px;border:1px solid var(--pphg-border);background:${idx === 0 ? 'var(--pphg-primary)' : 'transparent'};color:${idx === 0 ? '#fff' : 'var(--pphg-text-primary)'};font-size:12px;font-weight:600;cursor:pointer;`;
    payRow.appendChild(b);
  });
  wrap.appendChild(payRow);

  const agree = document.createElement('label');
  agree.style.cssText =
    'display:flex;align-items:flex-start;gap:10px;font-size:12px;color:var(--pphg-text-secondary);margin-bottom:20px;cursor:pointer;';
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.style.marginTop = '2px';
  agree.appendChild(cb);
  agree.appendChild(
    document.createTextNode('I agree to the rate plan, cancellation policy, and Pan Pacific Hotels Group terms.')
  );
  wrap.appendChild(agree);

  const bookBtn = document.createElement('button');
  bookBtn.type = 'button';
  bookBtn.className = 'pphg-btn-primary';
  bookBtn.textContent = 'Book now';
  bookBtn.addEventListener('click', () => {
    if (!cb.checked) {
      alert('Please accept the terms to continue (demo).');
      return;
    }
    BrazeManager.logEvent('Booking - Completed', {
      hotel_id: hotelId,
      room_id: draft.roomId,
      total_sgd: draft.totalSgd,
      adults,
      children,
    });
    BrazeManager.setAttribute('last_booking_hotel_id', hotelId);
    BrazeManager.setAttribute('last_booking_total_sgd', draft.totalSgd);
    StorageManager.remove('booking_draft');
    Router.navigate('/account');
    setTimeout(() => {
      alert('Thank you — your demo reservation is confirmed. Check Account for details.');
    }, 0);
  });
  wrap.appendChild(bookBtn);

  container.innerHTML = '';
  container.appendChild(wrap);
}
