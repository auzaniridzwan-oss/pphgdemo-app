# EasyMoney marketplace screens (archived)

These modules were moved here when the app was rebranded to **Pan Pacific Hotel Group — Singapore Stays**. They are **not** imported by `js/main.js`.

- **`demo-data.easymoney.js`** — Original marketplace products, banners, and coupons (restored from git history for this folder only).
- Screen files import `../../components/*` and `../../router.js` relative to the live app; they expect the **old** router routes (`/product/:id`, `/cart`, etc.) and **old** bottom navigation.

To experiment with the archived build, you would need a temporary `main.js` that registers those routes and restores the previous UI shell.
