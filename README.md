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
- `/mortgages/new` — create a mortgage or pawn entry
- `/expenses` — cash and expense management
- `/branches` — branch management and performance
- `/settings` — shop and system settings
- `/diamonds` — diamond inventory management
- `/old-gold/new` — record an old-gold purchase
- `/customer-dues` — customer receivables and collections
- `/reports/profit-loss` — interactive profit and loss report
- `/customers/C-000125/profile` — detailed customer profile variant
- `/suppliers/S-00001` — supplier profile, history, and products
- `/barcodes` — barcode generation and label printing
- `/stock-transfers/new` — transfer inventory between branches
- `/product-management/catalog` — full product management catalogue
- `/purchase-management/new` — create a purchase entry with live totals
- `/pos/new` — point-of-sale invoice workflow
- `/sales/returns/new` — find an invoice and process a sales return
- `/inventory/stock-view` — current stock valuation and availability
- `/gold-rates/manage` — gold-rate update and seven-day history
- `/karigars/manage` — craftsman status and workload management
- `/reports/dashboard` — consolidated reports and analytics dashboard
- `/users` — user, role, branch, and status management
- `/sales/quotations/new` — create, preview, save, and send quotations
- `/accounts/payments` — record customer and supplier payments
- `/users/activity-log` — filter and export system activity history
- `/certificates` — jewellery certificate and hallmark registry
- `/manufacturing/orders` — production order and karigar workflow
- `/accounts/expenses` — expense ledger and voucher management
- `/branches/overview` — branch stock analytics and transfers
- `/loyalty` — customer membership tiers, loyalty points, and rewards
- `/branches/sales-dashboard` — multi-branch sales comparison and performance
- `/inventory/alerts` — low-stock and out-of-stock alerts
- `/settings/system` — general company and system preferences
- `/manufacturing/work-orders` — manufacturing order list and filters
- `/manufacturing/work-orders/new` — create a manufacturing order
- `/manufacturing/material-issues` — material issue records and filters
- `/manufacturing/material-issues/new` — issue materials to a karigar

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
