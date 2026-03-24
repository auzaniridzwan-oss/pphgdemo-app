/**
 * DISCOVERY loyalty — tier progress and benefits from session / Braze-backed fields.
 * @module Loyalty
 */
import Header from '../components/header.js';
import BrazeManager from '../braze-manager.js';
import AuthService from '../auth-service.js';

/**
 * Heuristic progress bar width from tier label (no next-tier data from Braze in this demo).
 * @param {string|null} tier
 * @returns {number} Percent 0–100
 */
function tierProgressPercent(tier) {
  const t = (tier || '').toLowerCase();
  if (t.includes('platinum')) return 100;
  if (t.includes('gold')) return 88;
  if (t.includes('silver')) return 55;
  if (t.includes('bronze') || t.includes('member')) return 32;
  return 45;
}

/**
 * @param {HTMLElement} container
 */
export default function renderLoyalty(container) {
  Header.renderSubPage('DISCOVERY', { backRoute: '/' });

  BrazeManager.logEvent('Loyalty - Screen Viewed', { program: 'DISCOVERY' });

  const snap = AuthService.getLoyaltySnapshot();
  const tierDisplay = snap.tier || '—';
  const pointsDisplay =
    snap.points != null ? `${snap.points.toLocaleString()} points` : '—';
  const memberIdLine =
    snap.loyalty_id != null
      ? `<div class="pphg-label" style="color:var(--pphg-text-secondary);margin-top:10px;">Loyalty ID · ${escapeHtml(snap.loyalty_id)}</div>`
      : '';
  const progressPct = tierProgressPercent(snap.tier);
  const subline =
    snap.tier && snap.points != null
      ? `${pointsDisplay} · progress to next tier is illustrative`
      : pointsDisplay;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding:12px var(--container-padding) 28px;';

  wrap.innerHTML = `
    <div style="background:linear-gradient(135deg, var(--pphg-surface) 0%, #2a2418 100%);border:1px solid var(--pphg-border);border-radius:8px;padding:20px;margin-bottom:20px;">
      <div class="pphg-label" style="color:var(--pphg-primary);">Your tier</div>
      <div class="pphg-heading-serif" style="font-size:22px;margin-bottom:8px;">${escapeHtml(tierDisplay)}</div>
      <div style="font-size:13px;color:var(--pphg-text-secondary);">${escapeHtml(subline)}</div>
      ${memberIdLine}
      <div style="height:6px;background:var(--pphg-border);border-radius:3px;margin-top:14px;overflow:hidden;">
        <div style="width:${progressPct}%;height:100%;background:var(--pphg-primary);"></div>
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

/**
 * @param {string} s
 * @returns {string}
 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
