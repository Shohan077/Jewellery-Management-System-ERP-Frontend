# Jewellery ERP Frontend

A responsive Next.js App Router implementation of the Jewellery ERP reference screens. The project uses TypeScript, CSS Modules, shared layout primitives, and small client-side interactions backed by realistic mock data.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The root route redirects to the login screen.

## Routes

- `/login` — sign-in screen
- `/dashboard` — business overview
- `/sales/invoices` — sales invoice list
- `/sales/invoices/new` — create sales invoice
- `/products` — product list
- `/products/new` — add product
- `/purchases` — purchase invoice list
- `/purchases/new` — create purchase invoice

- `/purchases/new/materials` — create raw-material purchase invoice
- `/customers` — customer list and create dialog
- `/customers/C-000125` — customer profile and purchase history
- `/suppliers` — supplier list and create dialog
- `/inventory/stock` — stock overview and adjustments
- `/gold-rates` — gold rate management
- `/karigars` — craftsman management
- `/reports/sales` — interactive sales report
- `/purchase-orders` — purchase order list
- `/purchase-orders/new` — create purchase order
- `/inventory/stock-list` — operational stock list
- `/product-management/products` — product management catalogue

## Architecture

- `src/app` contains route layouts and page entry points.
- `src/components/layout` contains the shared ERP sidebar and top bar.
- `src/components/ui` contains shared cards, page headers, and status badges.
- `src/features` keeps screen-specific data, behavior, and CSS Modules together.
- `public/images` contains project-owned visual assets.

The current forms and tables are front-end prototypes: filtering, pagination, file selection, exports, totals, feedback, and navigation work locally; persistence and authentication are ready to be connected to application APIs.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```
