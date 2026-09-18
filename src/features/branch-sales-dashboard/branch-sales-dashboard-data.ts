export type BranchSalesRow = {
  id: string;
  name: string;
  location: string;
  sales: number;
  orders: number;
  customers: number;
  growth: number;
  chartMillions: number;
  color: string;
};

export type SalesPeriod = {
  label: string;
  factor: number;
};

export const salesPeriods: SalesPeriod[] = [
  { label: "01 Apr 2025 - 30 Apr 2025", factor: 1 },
  { label: "01 Mar 2025 - 31 Mar 2025", factor: 0.92 },
  { label: "01 Feb 2025 - 28 Feb 2025", factor: 0.84 },
  { label: "01 Jan 2025 - 31 Mar 2025", factor: 2.76 },
];

export const initialBranchSales: BranchSalesRow[] = [
  {
    id: "BR-001",
    name: "Main Branch",
    location: "Dhaka",
    sales: 1_850_000,
    orders: 820,
    customers: 540,
    growth: 14,
    chartMillions: 18.5,
    color: "#bd8215",
  },
  {
    id: "BR-002",
    name: "Uttara Branch",
    location: "Uttara, Dhaka",
    sales: 680_300,
    orders: 312,
    customers: 248,
    growth: 8,
    chartMillions: 6.8,
    color: "#347bdd",
  },
  {
    id: "BR-003",
    name: "Chittagong Branch",
    location: "Chittagong",
    sales: 315_300,
    orders: 116,
    customers: 104,
    growth: 5,
    chartMillions: 3.1,
    color: "#1eb96c",
  },
];

const indianNumber = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatCurrency(value: number) {
  return `৳ ${indianNumber.format(Math.round(value))}`;
}

export function formatNumber(value: number) {
  return indianNumber.format(Math.round(value));
}

