export type SupplierStatus = "Active" | "Inactive";

export type SupplierProfileRecord = {
  supplierId: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  supplierType: string;
  openingBalance: number;
  totalPurchase: number;
  outstandingDue: number;
  totalInvoices: number;
  lastPurchase: string;
  memberSince: string;
  status: SupplierStatus;
};

export type SupplierPurchase = {
  id: number;
  date: string;
  invoiceNo: string;
  amount: number;
  status: "Received";
};

export const supplierProfileBase: Omit<SupplierProfileRecord, "supplierId"> = {
  name: "Ali Gold Traders",
  contactPerson: "Ali Hossain",
  phone: "01711-223344",
  email: "ali@goldtraders.com",
  address: "New Market, Dhaka\nBangladesh",
  supplierType: "Gold Supplier",
  openingBalance: 0,
  totalPurchase: 7_520_000,
  outstandingDue: 250_000,
  totalInvoices: 48,
  lastPurchase: "26 Apr 2025",
  memberSince: "10 Jan 2023",
  status: "Active",
};

export function getSupplierProfile(supplierId: string): SupplierProfileRecord {
  return { supplierId, ...supplierProfileBase };
}

export const purchaseTrend = [
  { month: "May", amount: 720_000 },
  { month: "Jun", amount: 910_000 },
  { month: "Jul", amount: 610_000 },
  { month: "Aug", amount: 840_000 },
  { month: "Sep", amount: 980_000 },
  { month: "Oct", amount: 760_000 },
  { month: "Nov", amount: 120_000 },
  { month: "Dec", amount: 510_000 },
  { month: "Jan", amount: 470_000 },
  { month: "Feb", amount: 980_000 },
  { month: "Mar", amount: 670_000 },
  { month: "Apr", amount: 1_120_000 },
] as const;

export const recentSupplierPurchases: SupplierPurchase[] = [
  { id: 245, date: "26 Apr 2025", invoiceNo: "P-000245", amount: 280_000, status: "Received" },
  { id: 231, date: "15 Apr 2025", invoiceNo: "P-000231", amount: 195_000, status: "Received" },
  { id: 210, date: "02 Mar 2025", invoiceNo: "P-000210", amount: 320_000, status: "Received" },
  { id: 198, date: "18 Feb 2025", invoiceNo: "P-000198", amount: 170_000, status: "Received" },
  { id: 172, date: "05 Jan 2025", invoiceNo: "P-000172", amount: 225_000, status: "Received" },
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export function formatSupplierProfileCurrency(value: number) {
  return `\u09F3 ${currencyFormatter.format(value)}`;
}
