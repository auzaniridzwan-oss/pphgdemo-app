/**
 * ProductDetail screen — image gallery, pricing, seller card, description, and sticky CTA.
 * @module ProductDetail
 */
import Header from '../../components/header.js';
import { PRODUCTS, formatPrice } from './demo-data.easymoney.js';
import StorageManager from '../../storage-manager.js';
import BrazeManager from '../../braze-manager.js';
import BottomNav from '../../components/bottom-nav.js';
import AppLogger from '../../app-logger.js';

/**
 * Render the ProductDetail screen for a given product ID.
 * @param {HTMLElement} container - The #app-content element.
 * @param {string} productId - The product ID from the route.
 */
export default function renderProductDetail(container, productId) {
  const product = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    Header.renderSubPage('Not Found', { backRoute: '/' });
    container.innerHTML = `
      <div style="padding-top:45px;">
        <div class="empty-state">
          <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
          <p>Product not found</p>
        </div>
      </div>
    `;
    return;
  }

  /* BRAZE USER CUSTOM EVENT - Product Viewed */
  AppLogger.trackEvent('em_viewproduct', {
    'prod_id': product.id,
    'prod_category': product.category,
    'prod_name': product.title,
    'prod_price': product.price,
  });

  Header.renderSubPage(product.title.substring(0, 20) + '...', {
    backRoute: '/',
    actionIcon: 'fa-solid fa-share-nodes',
    onAction: () => {
      AppLogger.info('UI', 'Share tapped', { product_id: product.id });
    },
  });

  const wrapper = document.createElement('div');
  wrapper.style.paddingTop = '45px';

  const images = product.images || [product.thumbnail];
  let currentImage = 0;

  const gallery = document.createElement('div');
  gallery.className = 'detail-gallery';

  const img = document.createElement('img');
  img.src = images[0];
  img.alt = product.title;
  gallery.appendChild(img);

  if (images.length > 1) {
    const counter = document.createElement('div');
    counter.className = 'gallery-counter';
    counter.textContent = `1 / ${images.length}`;

    gallery.addEventListener('click', () => {
      currentImage = (currentImage + 1) % images.length;
      img.src = images[currentImage];
      counter.textContent = `${currentImage + 1} / ${images.length}`;
    });

    gallery.appendChild(counter);
  }

  wrapper.appendChild(gallery);

  const priceSection = document.createElement('div');
  priceSection.className = 'detail-section';

  const priceRow = document.createElement('div');
  priceRow.className = 'detail-price-row';

  const finalPrice = document.createElement('span');
  finalPrice.className = 'detail-final-price';
  finalPrice.textContent = formatPrice(product.price);
  priceRow.appendChild(finalPrice);

  if (product.originalPrice) {
    const origPrice = document.createElement('span');
    origPrice.className = 'detail-original-price';
    origPrice.textContent = formatPrice(product.originalPrice);
    priceRow.appendChild(origPrice);
  }

  if (product.discount) {
    const discBadge = document.createElement('span');
    discBadge.className = 'detail-discount-badge';
    discBadge.textContent = `-${Math.round(product.discount * 100)}%`;
    priceRow.appendChild(discBadge);
  }

  priceSection.appendChild(priceRow);

  const titleEl = document.createElement('div');
  titleEl.className = 'detail-title';
  titleEl.textContent = product.title;
  priceSection.appendChild(titleEl);

  wrapper.appendChild(priceSection);

  if (product.seller) {
    const sellerCard = document.createElement('div');
    sellerCard.className = 'seller-card';

    const avatar = document.createElement('div');
    avatar.className = 'seller-avatar';
    avatar.textContent = product.seller.avatar || '?';

    const info = document.createElement('div');
    info.className = 'seller-info';

    const name = document.createElement('div');
    name.className = 'seller-name';
    name.textContent = product.seller.name;

    const loc = document.createElement('div');
    loc.className = 'seller-location';
    loc.textContent = product.seller.location;

    info.appendChild(name);
    info.appendChild(loc);

    const actions = document.createElement('div');
    actions.className = 'seller-actions';

    [
      { icon: 'fa-solid fa-phone', label: 'Call' },
      { icon: 'fa-brands fa-line', label: 'Line Chat' },
      { icon: 'fa-solid fa-store', label: 'View Store' },
    ].forEach(action => {
      const btn = document.createElement('button');
      btn.className = 'seller-action-btn';
      btn.setAttribute('aria-label', action.label);
      btn.innerHTML = `<i class="${action.icon}" aria-hidden="true"></i>`;
      btn.addEventListener('click', () => {
        AppLogger.info('UI', `Seller action: ${action.label}`, { product_id: product.id });
      });
      actions.appendChild(btn);
    });

    sellerCard.appendChild(avatar);
    sellerCard.appendChild(info);
    sellerCard.appendChild(actions);
    wrapper.appendChild(sellerCard);
  }

  const descSection = document.createElement('div');
  descSection.className = 'detail-section detail-description';
  descSection.innerHTML = `
    <h3>Details</h3>
    <p>${product.description}</p>
  `;
  wrapper.appendChild(descSection);

  const stickyBar = document.createElement('div');
  stickyBar.className = 'sticky-action-bar';

  const backBtn = document.createElement('button');
  backBtn.className = 'btn-secondary';
  backBtn.textContent = 'Back';
  backBtn.addEventListener('click', () => window.history.back());

  const addToCartBtn = document.createElement('button');
  addToCartBtn.className = 'btn-primary';
  addToCartBtn.textContent = 'Add to Cart';
  addToCartBtn.addEventListener('click', () => {
    const cart = StorageManager.get('cart', []);
    const exists = cart.find(item => item.id === product.id);

    if (!exists) {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        thumbnail: product.thumbnail,
      });
      StorageManager.set('cart', cart);
      BottomNav.updateCartBadge();
      /* BRAZE USER CUSTOM EVENT - Cart Item Added */
      BrazeManager.logEvent('em_addtocart', {
        'prod_id': product.id,
        'prod_category': product.category,
        'prod_name': product.title,
        'prod_price': product.price,
      });
      addToCartBtn.textContent = 'Added!';
      addToCartBtn.style.background = '#4CAF50';
      setTimeout(() => {
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.style.background = '';
      }, 1500);
    } else {
      addToCartBtn.textContent = 'Already in Cart';
      setTimeout(() => {
        addToCartBtn.textContent = 'Add to Cart';
      }, 1500);
    }
  });

  stickyBar.appendChild(backBtn);
  stickyBar.appendChild(addToCartBtn);
  wrapper.appendChild(stickyBar);

  container.innerHTML = '';
  container.appendChild(wrapper);
}
