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
- `/manufacturing/material-returns` — returned-material records and status filters
- `/manufacturing/material-returns/new` — record materials returned by a karigar
- `/manufacturing/finished-products` — completed product inventory and QC status
- `/manufacturing/finished-products/new` — record a finished product completion
- `/manufacturing/wastage` — manufacturing wastage records and approvals
- `/manufacturing/wastage/new` — record and validate manufacturing wastage
- `/manufacturing/karigar-payments` — karigar payment records and balances
- `/manufacturing/karigar-payments/new` — calculate and record a karigar payment
- `/production-management/orders` — filter and review production orders
- `/production-management/material-issues` — material issue totals and issue records
- `/production-management/finished-items` — completed-item inventory and production value
- `/production-management/reports` — production summary, item mix, and karigar performance analytics
- `/production-management/material-returns/new` — record returned production materials with live validation
- `/production-management/reports/detailed` — filter, inspect, print, and export detailed production reports
- `/karigar-management/ledger` — karigar work, payment, material, and balance ledger
- `/karigar-management/payments/new` — record and persist karigar payments
- `/purchases/returns` — purchase return records, filters, and statuses
- `/purchases/returns/new` — create a supplier purchase return
- `/purchases/supplier-directory` — supplier directory with due balances
- `/purchases/supplier-directory/SUP-001` — supplier financial and purchase details
- `/purchases/suppliers` — supplier management and contacts
- `/purchases/reports` — purchase, return, net, and due report
- `/purchases/order-management` — purchase order status management
- `/purchases/expenses` — purchase-related expense tracking
- `/purchases/orders` — purchase order document list and statuses
- `/purchases/orders/new` — create a weighted purchase order
- `/purchases/return-orders` — purchase return order history
- `/purchases/return-orders/new` — create a purchase return against an order
- `/suppliers/payments/new` — allocate and save supplier payments
- `/suppliers/ledger` — supplier purchase, payment, and balance ledger
- `/purchases/expense-entry` — record purchase-related expenses
- `/purchases/expense-report` — filter and export purchase expense analytics
- `/suppliers/statement` — supplier balance statement and transaction history
- `/purchases/expense-categories` — purchase expense category management
- `/purchases/expenses/new` — BDT purchase expense entry with attachment
- `/purchases/expenses/report` — BDT purchase expense analytics and export
- `/barcodes/generate` — generate, preview, persist, and print product barcodes
- `/barcodes/print` — configure and print responsive jewellery barcode labels
- `/barcodes/invoice-settings` — persist invoice branding and display settings
- `/barcodes/invoice-templates` — select and save invoice layout templates
- `/accounts/cash-in` — record incoming cash and review recent receipts
- `/accounts/cash-out` — record outgoing cash and review recent payments
- `/accounts/cash-ledger` — filter and export the running cash ledger
- `/accounts/daily-closing` — verify, print, and confirm daily cash closing
- `/accounts/receipt-entry` — record receipts with shared cash-ledger updates
- `/accounts/payment-entry` — record payments with shared cash-ledger updates
- `/accounts/expense-entry` — record and persist operational expenses
- `/accounts/expense-report` — filter and export account expense analytics
- `/accounts/account-ledger` — detailed account transactions and balances
- `/accounts/journal-entry` — create, balance, save, and post journal entries
- `/accounts/trial-balance` — filter and export balanced account totals
- `/accounts/profit-loss` — accounting profit, loss, and monthly trend report

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
