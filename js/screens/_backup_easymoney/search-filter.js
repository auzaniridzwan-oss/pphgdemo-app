/**
 * SearchAndFilter screen — search bar, horizontal filter chips, and product grid.
 * @module SearchFilter
 */
import Header from '../../components/header.js';
import ProductCard from '../../components/product-card.js';
import { PRODUCTS, CATEGORIES, FILTER_CHIPS } from './demo-data.easymoney.js';
import Router from '../../router.js';
import BrazeManager from '../../braze-manager.js';

/**
 * Render the SearchAndFilter screen into the content container.
 * @param {HTMLElement} container - The #app-content element.
 */
export default function renderSearchFilter(container) {
  Header.renderSubPage('Store', { backRoute: '/' });

  const wrapper = document.createElement('div');
  wrapper.style.paddingTop = '45px';

  let searchQuery = '';
  let activeChip = 'All';
  let filteredProducts = [...PRODUCTS];

  const searchBar = document.createElement('div');
  searchBar.className = 'search-bar';
  searchBar.innerHTML = '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Search items...';
  input.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    applyFilters();
  });
  searchBar.appendChild(input);
  wrapper.appendChild(searchBar);

  const chipsContainer = document.createElement('div');
  chipsContainer.className = 'filter-chips';

  FILTER_CHIPS.forEach(label => {
    const chip = document.createElement('button');
    chip.className = `filter-chip ${label === activeChip ? 'active' : ''}`;
    chip.textContent = label;
    chip.addEventListener('click', () => {
      activeChip = label;
      chipsContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyFilters();
    });
    chipsContainer.appendChild(chip);
  });
  wrapper.appendChild(chipsContainer);

  const productGrid = document.createElement('div');
  productGrid.className = 'product-grid';
  wrapper.appendChild(productGrid);

  /** Re-filter and re-render the product grid. */
  function applyFilters() {
    filteredProducts = PRODUCTS.filter(p => {
      const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery);
      const matchesChip = activeChip === 'All' || CATEGORIES.find(c => c.id === p.category)?.label === activeChip;
      return matchesSearch && matchesChip;
    });

    productGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <p>No items found</p>
        </div>
      `;
      return;
    }

    filteredProducts.forEach(prod => {
      productGrid.appendChild(ProductCard.create(prod, (p) => {
        Router.navigate(`/product/${p.id}`);
        BrazeManager.logEvent('em_viewproduct', {
          'prod_id': p.id,
          'prod_category': p.category,
          'prod_name': p.title,
          'prod_price': p.price,
        });
      }));
    });
  }

  applyFilters();
  container.innerHTML = '';
  container.appendChild(wrapper);
}
