export type OverviewBranch = {
  id: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  status: "Active" | "Inactive";
  stockValue: number;
  staff: number;
};

export type BranchTransfer = {
  id: string;
  date: string;
  fromBranch: string;
  toBranch: string;
  items: number;
  status: "Completed" | "Pending";
};

export const initialOverviewBranches: OverviewBranch[] = [
  { id: "BR-001", name: "Main Branch (Dhaka)", location: "Dhaka", manager: "Rahim Uddin", phone: "01712-345678", status: "Active", stockValue: 18_520_000, staff: 13 },
  { id: "BR-002", name: "Uttara Branch", location: "Uttara, Dhaka", manager: "Nusrat Jahan", phone: "01823-456678", status: "Active", stockValue: 9_050_000, staff: 8 },
  { id: "BR-003", name: "Chittagong Branch", location: "Chittagong", manager: "Tanvir Ahmed", phone: "01611-223344", status: "Active", stockValue: 4_970_000, staff: 7 },
];

export const initialBranchTransfers: BranchTransfer[] = [
  { id: "BT-2025-0041", date: "25 Apr 2025", fromBranch: "Main Branch", toBranch: "Uttara Branch", items: 25, status: "Completed" },
];

const currency = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatBranchCurrency(value: number) {
  return `\u09F3 ${currency.format(Math.round(value))}`;
}
