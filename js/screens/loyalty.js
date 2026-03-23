/**
 * DISCOVERY loyalty — demo tier progress and benefits.
 * @module Loyalty
 */
import Header from '../components/header.js';
import BrazeManager from '../braze-manager.js';

/**
 * @param {HTMLElement} container
 */
export default function renderLoyalty(container) {
  Header.renderSubPage('DISCOVERY', { backRoute: '/' });

  BrazeManager.logEvent('Loyalty - Screen Viewed', { program: 'DISCOVERY' });

  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding:12px var(--container-padding) 28px;';

  wrap.innerHTML = `
    <div style="background:linear-gradient(135deg, var(--pphg-surface) 0%, #2a2418 100%);border:1px solid var(--pphg-border);border-radius:8px;padding:20px;margin-bottom:20px;">
      <div class="pphg-label" style="color:var(--pphg-primary);">Your tier</div>
      <div class="pphg-heading-serif" style="font-size:22px;margin-bottom:8px;">Gold</div>
      <div style="font-size:13px;color:var(--pphg-text-secondary);">12,400 points · 1,600 to Platinum</div>
      <div style="height:6px;background:var(--pphg-border);border-radius:3px;margin-top:14px;overflow:hidden;">
        <div style="width:88%;height:100%;background:var(--pphg-primary);"></div>
      </div>
    </div>
    <div class="pphg-heading-serif" style="font-size:13px;margin-bottom:12px;">Member benefits</div>
    <ul style="list-style:none;padding:0;margin:0;font-size:14px;color:var(--pphg-text-secondary);line-height:1.7;">
      <li style="margin-bottom:10px;"><i class="fa-solid fa-check" style="color:var(--pphg-primary);margin-right:8px;" aria-hidden="true"></i>Complimentary room upgrade (subject to availability)</li>
      <li style="margin-bottom:10px;"><i class="fa-solid fa-check" style="color:var(--pphg-primary);margin-right:8px;" aria-hidden="true"></i>4 p.m. late checkout</li>
      <li style="margin-bottom:10px;"><i class="fa-solid fa-check" style="color:var(--pphg-primary);margin-right:8px;" aria-hidden="true"></i>Double points on dining — Q1 2026</li>
    </ul>
  `;

  container.innerHTML = '';
  container.appendChild(wrap);
}
