# Pan Pacific Hotel Group — Singapore Stays (Demo)

**A Mobile-First Web Application with iPhone Frame Layout.**

## Overview

This app simulates **browsing Singapore hotels and completing a guest booking** inside a 390×844px iPhone frame, built to demonstrate **Braze WebSDK** integrations (In-App Messages, Content Cards, custom events, and user attributes). Content is **100% demo data** (properties, March–April 2026 seasonal offers, and sample rates) — not live inventory or payment processing.

**Demo vs live identity:** Use the toolbar to switch **Demo** / **Live** mode. In Demo, **Log in** applies the built-in test user. In Live, **Log in** opens a dialog to enter a Braze **external_id**; the app calls a small **Vercel serverless** endpoint that uses the **Braze REST API** to fetch a safe subset of profile fields (so the REST key stays on the server, not in the browser).

## Tech Stack

| Layer       | Technology |
| ----------- | ---------- |
| **UI**      | HTML5, CSS3 (iPhone frame), Tailwind CSS (CDN), custom `pphg-theme.css` / `pphg-components.css` |
| **Icons**   | FontAwesome (Kit: `a21f98a3f6`) |
| **SDK**     | Braze WebSDK |
| **Auth**    | `AuthService` ([`js/auth-service.js`](js/auth-service.js)) — `ar_app_auth_mode`, `ar_app_logged_in`, loyalty snapshot for UI |
| **API**     | [`api/braze-profile.js`](api/braze-profile.js) — Vercel serverless; `/api/braze-profile` (POST) resolves profile by `external_id` |
| **State**   | `StorageManager` singleton (`ar_app_` prefixed keys) |
| **Logs**    | `AppLogger` (styled console + `getLogs()` for the debug overlay) |
| **Hosting** | Vercel |

Design tokens and UX patterns follow [`.cursor/design/design.json`](.cursor/design/design.json) (dark luxury surface, gold primary, bottom nav: Book / Explore / Loyalty / Offers / Account).

## Setup

1. **Clone:** [github.com/auzaniridzwan-oss/pphgdemo-app](https://github.com/auzaniridzwan-oss/pphgdemo-app)
2. **Web SDK:** Set Braze Web credentials in [`js/config.js`](js/config.js) (`apiKey`, `baseUrl`).
3. **Live login (optional, local / Vercel):** For the REST profile lookup, set environment variables on Vercel (or your host):
   - `BRAZE_REST_API_KEY` — REST API key with permission to export users
   - `BRAZE_REST_URL` — optional; default `https://rest.iad-03.braze.com` (match your dashboard cluster)
4. Run locally: `npx serve .` (serverless `/api/*` routes run on Vercel, not static `serve` alone).
5. Deploy via [Vercel](https://vercel.com/auzani-ridzwans-projects) — SPA rewrites exclude `/api/` so [`vercel.json`](vercel.json) routes hit the function.

## Architecture

- **`StorageManager`** ([`js/storage-manager.js`](js/storage-manager.js)) — All persisted state (e.g. `user_session`, `booking_draft`, `braze_init_status`, `auth_mode`, `logged_in`) uses the `ar_app_` prefix. Exposes **`subscribe(listener)`** so UI (e.g. the debug overlay) can react after `set`, `remove`, or `clearSession`.
- **`AppLogger`** ([`js/app-logger.js`](js/app-logger.js)) — Centralized logging; ERROR events also send Braze `App_Error`. Exposes **`subscribe(listener)`** so the debug panel can refresh when new log lines are written.
- **`BrazeManager`** ([`js/braze-manager.js`](js/braze-manager.js)) — SDK load/init, `changeUser`, IAM + Content Card subscriptions, guarded events/attributes, `getDeviceId()` for the debug panel, `fetchLiveProfileFromServer()` for Live login.
- **`AuthService`** ([`js/auth-service.js`](js/auth-service.js)) — Demo vs Live mode, login/logout, loyalty fields for Loyalty/Account screens; logout may call `braze.wipeData` when switching modes.
- **`Router`** ([`js/router.js`](js/router.js)) — Hash routes for tabs plus dynamic hotel paths: `/hotel/:id`, `/hotel/:id/rooms`, `/hotel/:id/checkout`.
- **Screens** ([`js/screens/`](js/screens/)) — Each screen renders into `#app-content`. The previous marketplace screens are preserved under [`js/screens/_backup_easymoney/`](js/screens/_backup_easymoney/) with their own [`demo-data.easymoney.js`](js/screens/_backup_easymoney/demo-data.easymoney.js) snapshot (not loaded by the current app).
- **Demo data** ([`js/demo-data.js`](js/demo-data.js)) — Singapore hotels, room types, Q1 2026 offers, `TEST_USER`, and `DEMO_LOYALTY` for Demo mode.

## iPhone frame

`#phone-frame` wraps `#app-header`, scrollable `#app-content`, and `#app-nav`. **Outside** the frame, a fixed **toolbar** provides:

- **Demo** / **Live** — switches auth mode (confirm + logout if already signed in).
- **Log in** / **Log out** — Demo login uses `TEST_USER`; Live login prompts for `external_id` and loads profile via `/api/braze-profile`.
- **Debug** — Opens a **left-docked** SDK debugger (does not cover the phone): session metadata, **Braze device ID**, user profile snapshot, recent SDK-category logs, and `ar_app_*` keys. While open, the panel **updates live** when logs are written or app storage changes (subscriptions + `requestAnimationFrame` batching); **scroll position is preserved** across re-renders. Body text in the panel is **selectable** for copy/paste (close button stays non-selectable). Panel uses a dark shell with light “card” sections; the page **canvas** around the phone is a warm off-white (`--pphg-canvas`).
- **Reset** — Clears `ar_app_*` keys and reloads.

The original marketplace shell is kept locally as [`index.html.bak`](index.html.bak) (ignored by git via `*.bak`).

## Braze integration

### Custom events (representative)

| Event | When |
| ----- | ---- |
| `Navigation - Tab Switched` | Hash route change (tab summary) |
| `Auth - Login Completed` | After successful Demo or Live login (`mode`: `demo` \| `live`) |
| `Search - Submitted` | Book home search / browse CTA |
| `hotels_explore_viewed` | Explore (Singapore) hotel list screen load (`hotel_count`) |
| `hotel_explore_item_clicked` | Hotel card tap on Explore (`hotel_id`, `hotel_name`, `from_price`) |
| `hotel_detail_viewed` | Hotel overview screen (`hotel_id`, `hotel_name`) |
| `Hotel - Quick Action` | Call / map / email taps |
| `Booking - Dates Selected` | Continue to rooms from detail |
| `Booking - Room Selected` | Room card confirm |
| `Checkout - Started` | Checkout screen load |
| `Booking - Completed` | Demo confirmation |
| `promotions_screen_viewed` | Offers tab screen load (`offer_count`) |
| `promotion_viewed` | Offer card tap (`offer_id`, `offer_title`) |
| `Loyalty - Screen Viewed` | DISCOVERY tab |
| `App_Error` | Logger ERROR |

Events are sent with `app_version` and `platform: web_mobile_frame` where applicable.

**Event naming:** Explore, hotel detail, and Offers use **snake_case** names (`hotels_explore_viewed`, `hotel_explore_item_clicked`, `hotel_detail_viewed`, `promotions_screen_viewed`, `promotion_viewed`) so payloads map cleanly to analytics pipelines. Other custom events in this app remain **Title Case** (e.g. `Navigation - Tab Switched`, `Auth - Login Completed`).

### User attributes

- `app_version`, `platform` (on init)
- `last_booking_hotel_id`, `last_booking_total_sgd` (after demo checkout)
- Live profile: standard fields and custom attributes returned by the export API are merged into the session UI where applicable (e.g. loyalty tier/points).

### Test user & Live profile

- **Demo:** [`js/demo-data.js`](js/demo-data.js) defines `TEST_USER` — used when logging in under **Demo** mode with no prior session.
- **Live:** User enters **external_id**; [`api/braze-profile.js`](api/braze-profile.js) calls Braze `/users/export/ids` and returns `first_name`, `last_name`, `email`, and loyalty-oriented fields. **`pphg_loyalty_id`** is resolved from a user alias with label `id_loyalty` when present, otherwise from custom attribute `pphg_loyalty_id`.

### Content Cards

Captioned Image cards with extras `type: banner` or `type: toast` are handled by existing carousel / toast wiring in [`js/components/promo-carousel.js`](js/components/promo-carousel.js) and [`js/components/braze-toast.js`](js/components/braze-toast.js) if you connect them from the Book or Explore flows later.

### SDK reference

[Braze Web SDK documentation](https://www.braze.com/docs/developer_guide/sdk_integration/?sdktab=web)

## Why try/catch and guards?

Braze may be blocked by extensions or ad blockers, and `localStorage` can throw in private modes. The app uses `if (window.braze)` checks and `StorageManager` try/catch so the UI still runs in “offline demo” mode.

**REST vs Web SDK:** Live profile enrichment uses a serverless function so the **REST API key is never shipped to the client**; the browser only receives the JSON subset the function returns.
