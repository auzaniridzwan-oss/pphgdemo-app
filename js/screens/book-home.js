/**
 * Book home — hero, destination prompt, entry into Singapore browse flow.
 * @module BookHome
 */
import Header from '../components/header.js';
import Router from '../router.js';
import BrazeManager from '../braze-manager.js';
import { BOOK_HERO } from '../demo-data.js';

/**
 * Render the Book tab home screen.
 * @param {HTMLElement} container - #app-content
 */
export default function renderBookHome(container) {
  Header.renderHeroBar();

  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding: 0 var(--container-padding) 24px;';

  const hero = document.createElement('div');
  hero.className = 'pphg-hero';
  hero.style.backgroundImage = `url('${BOOK_HERO.image}')`;

  const kicker = document.createElement('div');
  kicker.className = 'pphg-hero__kicker';
  kicker.textContent = BOOK_HERO.kicker;

  const title = document.createElement('h1');
  title.className = 'pphg-hero__title';
  title.textContent = BOOK_HERO.title;

  const label = document.createElement('label');
  label.className = 'pphg-label';
  label.style.color = 'rgba(255,255,255,0.85)';
  label.textContent = 'Where would you like to go?';
  label.setAttribute('for', 'pphg-dest-input');

  const input = document.createElement('input');
  input.id = 'pphg-dest-input';
  input.type = 'text';
  input.placeholder = 'Singapore hotels';
  input.autocomplete = 'off';
  input.style.cssText =
    'width:100%;padding:14px 16px;border-radius:4px;border:none;font-size:15px;margin-top:8px;background:rgba(255,255,255,0.95);color:#111;';

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      BrazeManager.logEvent('Search - Submitted', {
        query: input.value || 'Singapore',
        screen: 'book_home',
      });
      Router.navigate('/explore');
    }
  });

  hero.appendChild(kicker);
  hero.appendChild(title);
  hero.appendChild(label);
  hero.appendChild(input);

  const cta = document.createElement('button');
  cta.type = 'button';
  cta.className = 'pphg-btn-primary';
  cta.style.marginTop = '20px';
  cta.textContent = 'Browse Singapore stays';
  cta.addEventListener('click', () => {
    BrazeManager.logEvent('Search - Submitted', {
      query: input.value || 'Singapore',
      screen: 'book_home',
    });
    Router.navigate('/explore');
  });

  const sub = document.createElement('p');
  sub.style.cssText =
    'font-size:12px;color:var(--pphg-text-secondary);text-align:center;margin-top:16px;padding:0;line-height:1.5;';
  sub.textContent =
    'Demo: Marina Bay, Orchard, and Kampong Glam properties with March 2026 school-holiday and Easter lead-in offers.';

  wrap.appendChild(hero);
  wrap.appendChild(cta);
  wrap.appendChild(sub);

  container.innerHTML = '';
  container.appendChild(wrap);
}
