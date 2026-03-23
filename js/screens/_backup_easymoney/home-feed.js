/**
 * HomeFeed screen — carousel, category grid, filter tabs, and product grid.
 * All content rendered dynamically from demo data.
 * @module HomeFeed
 */
import Header from '../../components/header.js';
import PromoCarousel from '../../components/promo-carousel.js';
import CategoryIcon from '../../components/category-icon.js';
import ProductCard from '../../components/product-card.js';
import { BANNERS, CATEGORIES, PRODUCTS, FILTER_TABS } from './demo-data.easymoney.js';
import Router from '../../router.js';
import BrazeManager from '../../braze-manager.js';

/**
 * Render the HomeFeed screen into the content container.
 * @param {HTMLElement} container - The #app-content element.
 */
export default function renderHomeFeed(container) {
  Header.renderHome();
  PromoCarousel.destroy();

  const wrapper = document.createElement('div');
  wrapper.style.paddingTop = '45px';

  wrapper.appendChild(PromoCarousel.create(BANNERS));

  const catTitle = document.createElement('div');
  catTitle.className = 'section-title';
  catTitle.textContent = 'Categories';
  wrapper.appendChild(catTitle);

  const catGrid = document.createElement('div');
  catGrid.className = 'category-grid';
  CATEGORIES.forEach(cat => {
    catGrid.appendChild(CategoryIcon.create(cat, (c) => {
      Router.navigate('/search');
      BrazeManager.logEvent('em_selectcategory', { category_id: c.id, category_label: c.label });
    }));
  });
  wrapper.appendChild(catGrid);

  const tabContainer = document.createElement('div');
  tabContainer.className = 'filter-tabs';

  let activeFilter = 'Hot Deals';

  /**
   * @param {string} filterLabel
   * @returns {Array<Object>} Filtered products matching the selected tab.
   */
  function getFilteredProducts(filterLabel) {
    const statusMap = {
      'Hot Deals': 'hot',
      'New Arrivals': 'new',
      'Rare Items': 'rare',
    };
    return PRODUCTS.filter(p => p.status === statusMap[filterLabel]);
  }

  /** @param {HTMLElement} gridEl - The product grid to re-render. */
  function refreshGrid(gridEl) {
    gridEl.innerHTML = '';
    getFilteredProducts(activeFilter).forEach(prod => {
      gridEl.appendChild(ProductCard.create(prod, (p) => {
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

  FILTER_TABS.forEach(label => {
    const tab = document.createElement('button');
    tab.className = `filter-tab ${label === activeFilter ? 'active' : ''}`;
    tab.textContent = label;
    tab.addEventListener('click', () => {
      activeFilter = label;
      tabContainer.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      refreshGrid(productGrid);
    });
    tabContainer.appendChild(tab);
  });
  wrapper.appendChild(tabContainer);

  const productGrid = document.createElement('div');
  productGrid.className = 'product-grid';
  refreshGrid(productGrid);
  wrapper.appendChild(productGrid);

  container.innerHTML = '';
  container.appendChild(wrapper);
}
