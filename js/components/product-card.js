/**
 * ProductCard — reusable card with status badge, grade badge, thumbnail, title, and pricing.
 * @module ProductCard
 */
import { formatPrice } from '../demo-data.js';

const ProductCard = {
  /**
   * Create a product card DOM element.
   * @param {Object} product - Product data object from demo-data.
   * @param {Function} [onClick] - Click handler receiving the product object.
   * @returns {HTMLElement} The card element.
   */
  create(product, onClick) {
    const card = document.createElement('div');
    card.className = 'product-card';

    if (product.status) {
      const statusBadge = document.createElement('span');
      statusBadge.className = `badge-status ${product.status}`;
      statusBadge.textContent = product.status.charAt(0).toUpperCase() + product.status.slice(1);
      card.appendChild(statusBadge);
    }

    if (product.grade) {
      const gradeBadge = document.createElement('span');
      gradeBadge.className = `badge-grade grade-${product.grade.toLowerCase()}`;
      gradeBadge.textContent = product.grade;
      card.appendChild(gradeBadge);
    }

    const img = document.createElement('img');
    img.className = 'product-card-image';
    img.src = product.thumbnail;
    img.alt = product.title;
    img.loading = 'lazy';
    card.appendChild(img);

    const body = document.createElement('div');
    body.className = 'product-card-body';

    const title = document.createElement('div');
    title.className = 'product-card-title';
    title.textContent = product.title;
    body.appendChild(title);

    if (product.discount) {
      const discountRow = document.createElement('div');
      discountRow.style.display = 'flex';
      discountRow.style.alignItems = 'center';
      discountRow.style.gap = '4px';
      discountRow.style.marginTop = '2px';

      const discountLabel = document.createElement('span');
      discountLabel.className = 'product-card-discount';
      discountLabel.textContent = `-${Math.round(product.discount * 100)}%`;

      const originalPrice = document.createElement('span');
      originalPrice.className = 'product-card-original-price';
      originalPrice.textContent = formatPrice(product.originalPrice);

      discountRow.appendChild(discountLabel);
      discountRow.appendChild(originalPrice);
      body.appendChild(discountRow);
    }

    const price = document.createElement('div');
    price.className = 'product-card-price';
    price.textContent = formatPrice(product.price);
    body.appendChild(price);

    card.appendChild(body);

    if (onClick) {
      card.addEventListener('click', () => onClick(product));
    }

    return card;
  }
};

export default ProductCard;
