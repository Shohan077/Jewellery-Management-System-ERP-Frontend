export type DashboardProduct = {
  id: number;
  name: string;
  quantity: number;
  amount: number;
};

export const weeklyPerformance = [
  { week: "W1", sales: 1_360_000, purchase: 670_000 },
  { week: "W2", sales: 1_090_000, purchase: 790_000 },
  { week: "W3", sales: 1_150_000, purchase: 760_000 },
  { week: "W4", sales: 1_440_000, purchase: 910_000 },
] as const;

export const categorySales = [
  { name: "Necklace", value: 28, color: "#c7901d" },
  { name: "Ring", value: 22, color: "#3179d6" },
  { name: "Earring", value: 18, color: "#7048e8" },
  { name: "Bracelet", value: 12, color: "#24b46a" },
  { name: "Chain", value: 10, color: "#ef7f3f" },
  { name: "Others", value: 10, color: "#7b7f86" },
] as const;

export const topSellingProducts: DashboardProduct[] = [
  { id: 1, name: "Gold Necklace", quantity: 28, amount: 280_000 },
  { id: 2, name: "Gold Ring", quantity: 46, amount: 195_000 },
  { id: 3, name: "Diamond Earring", quantity: 32, amount: 172_000 },
  { id: 4, name: "Gold Chain", quantity: 25, amount: 145_000 },
  { id: 5, name: "Gold Bracelet", quantity: 18, amount: 120_000 },
];

export const dashboardTotals = {
  sales: 2_845_600,
  purchase: 1_820_300,
  profit: 1_025_300,
  expenses: 400_000,
} as const;

const formatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatDashboardCurrency(value: number) {
  return `\u09F3 ${formatter.format(Math.round(value))}`;
}
