/**
 * ShoppingCart screen — cart items, coupon selector, total summary, and checkout.
 * Unique items only (no quantity counter).
 * @module ShoppingCart
 */
import Header from '../../components/header.js';
import StorageManager from '../../storage-manager.js';
import BrazeManager from '../../braze-manager.js';
import BottomNav from '../../components/bottom-nav.js';
import { COUPONS, formatPrice } from './demo-data.easymoney.js';

/**
 * Render the ShoppingCart screen.
 * @param {HTMLElement} container - The #app-content element.
 */
export default function renderShoppingCart(container) {
  Header.renderSubPage('Shopping Cart', { backRoute: '/' });

  const wrapper = document.createElement('div');
  wrapper.style.paddingTop = '45px';

  let cart = StorageManager.get('cart', []);
  let appliedCoupon = StorageManager.get('coupons_applied', null);

  /** Full re-render of the cart screen. */
  function render() {
    wrapper.innerHTML = '';
    cart = StorageManager.get('cart', []);

    if (cart.length === 0) {
      wrapper.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
          <p>Your cart is empty</p>
        </div>
      `;
      container.innerHTML = '';
      container.appendChild(wrapper);
      return;
    }

    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';

      const img = document.createElement('img');
      img.className = 'cart-item-image';
      img.src = item.thumbnail;
      img.alt = item.title;
      img.loading = 'lazy';

      const info = document.createElement('div');
      info.className = 'cart-item-info';

      const title = document.createElement('div');
      title.className = 'cart-item-title';
      title.textContent = item.title;

      const price = document.createElement('div');
      price.className = 'cart-item-price';
      price.textContent = formatPrice(item.price);

      info.appendChild(title);
      info.appendChild(price);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'cart-item-remove';
      removeBtn.setAttribute('aria-label', `Remove ${item.title}`);
      removeBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
      removeBtn.addEventListener('click', () => {
        cart = cart.filter(c => c.id !== item.id);
        StorageManager.set('cart', cart);
        BottomNav.updateCartBadge();
        /* BRAZE USER CUSTOM EVENT - Cart Item Removed */
        BrazeManager.logEvent('em_removefromcart', {
          'prod_id': item.id,
          'prod_category': item.category,
          'prod_name': item.title,
          'prod_price': item.price
        });
        render();
      });

      row.appendChild(img);
      row.appendChild(info);
      row.appendChild(removeBtn);
      wrapper.appendChild(row);
    });

    const couponRow = document.createElement('div');
    couponRow.className = 'coupon-row';

    const couponLeft = document.createElement('div');
    couponLeft.style.display = 'flex';
    couponLeft.style.alignItems = 'center';
    couponLeft.style.gap = '8px';
    couponLeft.innerHTML = '<i class="fa-solid fa-ticket" aria-hidden="true" style="color:var(--color-primary);"></i>';
    const couponText = document.createElement('span');
    couponText.style.cssText = 'font-size:14px; color:var(--color-text-main);';
    couponText.textContent = appliedCoupon ? `${appliedCoupon.code} applied` : 'Apply Coupon';
    couponLeft.appendChild(couponText);

    const couponRight = document.createElement('i');
    couponRight.className = 'fa-solid fa-chevron-right';
    couponRight.style.cssText = 'font-size:12px; color:var(--color-text-muted);';

    couponRow.appendChild(couponLeft);
    couponRow.appendChild(couponRight);
    couponRow.addEventListener('click', () => showCouponPicker());
    wrapper.appendChild(couponRow);

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    let discount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percent') {
        discount = Math.round(subtotal * (appliedCoupon.discountValue / 100));
      } else {
        discount = appliedCoupon.discountValue;
      }
      if (subtotal < appliedCoupon.minSpend) {
        discount = 0;
      }
    }

    const grandTotal = Math.max(0, subtotal - discount);

    const summary = document.createElement('div');
    summary.className = 'cart-summary';

    const subtotalRow = document.createElement('div');
    subtotalRow.className = 'cart-summary-row';
    subtotalRow.innerHTML = `<span>Subtotal (${cart.length} items)</span><span>${formatPrice(subtotal)}</span>`;
    summary.appendChild(subtotalRow);

    if (discount > 0) {
      const discRow = document.createElement('div');
      discRow.className = 'cart-summary-row';
      discRow.innerHTML = `<span style="color:var(--color-accent-discount);">Discount</span><span style="color:var(--color-accent-discount);">-${formatPrice(discount)}</span>`;
      summary.appendChild(discRow);
    }

    const totalRow = document.createElement('div');
    totalRow.className = 'cart-summary-row total';
    totalRow.innerHTML = `<span>Grand Total</span><span>${formatPrice(grandTotal)}</span>`;
    summary.appendChild(totalRow);

    wrapper.appendChild(summary);

    const checkoutBtn = document.createElement('button');
    checkoutBtn.className = 'btn-checkout';
    checkoutBtn.textContent = `Checkout — ${formatPrice(grandTotal)}`;
    checkoutBtn.addEventListener('click', () => {
      BrazeManager.logEvent('em_checkout', {
        total: grandTotal,
        item_count: cart.length,
        coupon: appliedCoupon?.code || null,
      });
      checkoutBtn.textContent = 'Order Placed!';
      checkoutBtn.style.background = '#4CAF50';
      checkoutBtn.disabled = true;
    });
    wrapper.appendChild(checkoutBtn);

    container.innerHTML = '';
    container.appendChild(wrapper);
  }

  /** Show a simple inline coupon picker. */
  function showCouponPicker() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.4);
      z-index:300; display:flex; align-items:flex-end; justify-content:center;
    `;

    const sheet = document.createElement('div');
    sheet.style.cssText = `
      background:white; border-radius:16px 16px 0 0;
      width:var(--phone-w); max-width:390px; padding:24px 16px 40px;
    `;

    const title = document.createElement('div');
    title.style.cssText = 'font-size:16px; font-weight:700; margin-bottom:16px; color:var(--color-text-main);';
    title.textContent = 'Select Coupon';
    sheet.appendChild(title);

    COUPONS.forEach(coupon => {
      const card = document.createElement('div');
      card.className = 'coupon-card';
      card.style.margin = '0 0 12px';

      const code = document.createElement('div');
      code.className = 'coupon-code';
      code.textContent = coupon.code;

      const desc = document.createElement('div');
      desc.className = 'coupon-desc';
      desc.textContent = coupon.description;
      if (coupon.minSpend > 0) {
        desc.textContent += ` (min. spend ${formatPrice(coupon.minSpend)})`;
      }

      card.appendChild(code);
      card.appendChild(desc);
      card.addEventListener('click', () => {
        appliedCoupon = coupon;
        StorageManager.set('coupons_applied', coupon);
        BrazeManager.logEvent('em_applycoupon', {
          coupon_code: coupon.code,
          discount: coupon.discountValue,
        });
        modal.remove();
        render();
      });
      sheet.appendChild(card);
    });

    const clearBtn = document.createElement('button');
    clearBtn.style.cssText = `
      width:100%; padding:12px; border:1px solid var(--color-border);
      border-radius:var(--radius-medium); background:white;
      font-size:14px; color:var(--color-text-muted); cursor:pointer; min-height:44px;
    `;
    clearBtn.textContent = 'Remove Coupon';
    clearBtn.addEventListener('click', () => {
      appliedCoupon = null;
      StorageManager.remove('coupons_applied');
      modal.remove();
      render();
    });
    sheet.appendChild(clearBtn);

    modal.appendChild(sheet);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    document.getElementById('phone-frame').appendChild(modal);
  }

  render();
}
