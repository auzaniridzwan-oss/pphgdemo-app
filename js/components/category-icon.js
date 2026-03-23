/**
 * CategoryIcon — circle icon with label for the category grid.
 * @module CategoryIcon
 */
const CategoryIcon = {
  /**
   * Create a category icon DOM element.
   * @param {Object} category - Category data object with label, icon, and color.
   * @param {Function} [onClick] - Click handler receiving the category object.
   * @returns {HTMLElement} The category item element.
   */
  create(category, onClick) {
    const item = document.createElement('div');
    item.className = 'category-item';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'category-icon';
    iconWrap.style.background = category.color + '15';
    iconWrap.style.color = category.color;

    const icon = document.createElement('i');
    icon.className = category.icon;
    icon.setAttribute('aria-hidden', 'true');
    iconWrap.appendChild(icon);

    const label = document.createElement('span');
    label.className = 'category-label';
    label.textContent = category.label;

    item.appendChild(iconWrap);
    item.appendChild(label);

    if (onClick) {
      item.addEventListener('click', () => onClick(category));
    }

    return item;
  }
};

export default CategoryIcon;
