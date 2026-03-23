# Pan Pacific Hotel Group — Singapore Stays (Demo)

**A Mobile-First Web Application with iPhone Frame Layout.**

## Overview

This app simulates **browsing Singapore hotels and completing a guest booking** inside a 390×844px iPhone frame, built to demonstrate **Braze WebSDK** integrations (In-App Messages, Content Cards, custom events, and user attributes). Content is **100% demo data** (properties, March–April 2026 seasonal offers, and sample rates) — not live inventory or payment processing.

## Tech Stack

| Layer       | Technology |
| ----------- | ---------- |
| **UI**      | HTML5, CSS3 (iPhone frame), Tailwind CSS (CDN), custom `pphg-theme.css` / `pphg-components.css` |
| **Icons**   | FontAwesome (Kit: `a21f98a3f6`) |
| **SDK**     | Braze WebSDK |
| **State**   | `StorageManager` singleton (`ar_app_` prefixed keys) |
| **Logs**    | `AppLogger` (styled console + `getLogs()` for the debug overlay) |
| **Hosting** | Vercel |

Design tokens and UX patterns follow [`.cursor/design/design.json`](.cursor/design/design.json) (dark luxury surface, gold primary, bottom nav: Book / Explore / Loyalty / Offers / Account).

## Setup

1. Clone from [auzaniridzwan-oss](https://github.com/auzaniridzwan-oss).
2. Set Braze credentials in [`js/config.js`](js/config.js).
3. Run locally: `npx serve .`
4. Deploy via [Vercel](https://vercel.com/auzani-ridzwans-projects).

## Architecture

- **`StorageManager`** ([`js/storage-manager.js`](js/storage-manager.js)) — All persisted state (e.g. `user_session`, `booking_draft`, `braze_init_status`) uses the `ar_app_` prefix.
- **`AppLogger`** ([`js/app-logger.js`](js/app-logger.js)) — Centralized logging; ERROR events also send Braze `App_Error`.
- **`BrazeManager`** ([`js/braze-manager.js`](js/braze-manager.js)) — SDK load/init, `changeUser`, IAM + Content Card subscriptions, guarded `logCustomEvent` / attributes.
- **`Router`** ([`js/router.js`](js/router.js)) — Hash routes for tabs plus dynamic hotel paths: `/hotel/:id`, `/hotel/:id/rooms`, `/hotel/:id/checkout`.
- **Screens** ([`js/screens/`](js/screens/)) — Each screen renders into `#app-content`. The previous marketplace screens are preserved under [`js/screens/_backup_easymoney/`](js/screens/_backup_easymoney/) with their own [`demo-data.easymoney.js`](js/screens/_backup_easymoney/demo-data.easymoney.js) snapshot (not loaded by the current app).
- **Demo data** ([`js/demo-data.js`](js/demo-data.js)) — Singapore hotels, room types, Q1 2026 offers, and `TEST_USER`.

## iPhone frame

`#phone-frame` wraps `#app-header`, scrollable `#app-content`, and `#app-nav`. A fixed **toolbar** above the frame provides **Debug** (SDK overlay) and **Reset** (clears `ar_app_*` keys and reloads). The original marketplace shell is saved as [`index.html.bak`](index.html.bak).

## Braze integration

### Custom events (representative)

| Event | When |
| ----- | ---- |
| `Navigation - Tab Switched` | Hash route change (tab summary) |
| `Search - Submitted` | Book home search / browse CTA |
| `Hotel - Viewed` | Hotel chosen from Explore list |
| `Hotel - Detail Viewed` | Hotel overview screen |
| `Hotel - Quick Action` | Call / map / email taps |
| `Booking - Dates Selected` | Continue to rooms from detail |
| `Booking - Room Selected` | Room card confirm |
| `Checkout - Started` | Checkout screen load |
| `Booking - Completed` | Demo confirmation |
| `Promotion - Viewed` | Offer card tap |
| `Loyalty - Screen Viewed` | DISCOVERY tab |
| `App_Error` | Logger ERROR |

Events are sent with `app_version` and `platform: web_mobile_frame` where applicable.

### User attributes

- `app_version`, `platform` (on init)
- `last_booking_hotel_id`, `last_booking_total_sgd` (after demo checkout)

### Test user

Defined in [`js/demo-data.js`](js/demo-data.js) (`TEST_USER`) — used with `braze.changeUser` when no session exists.

### Content Cards

Captioned Image cards with extras `type: banner` or `type: toast` are handled by existing carousel / toast wiring in [`js/components/promo-carousel.js`](js/components/promo-carousel.js) and [`js/components/braze-toast.js`](js/components/braze-toast.js) if you connect them from the Book or Explore flows later.

### SDK reference

[Braze Web SDK documentation](https://www.braze.com/docs/developer_guide/sdk_integration/?sdktab=web)

## Why try/catch and guards?

Braze may be blocked by extensions or ad blockers, and `localStorage` can throw in private modes. The app uses `if (window.braze)` checks and `StorageManager` try/catch so the UI still runs in “offline demo” mode.
