export type AdjustmentType = "Add" | "Reduce";

export type GoldAdjustmentRecord = {
  id: number;
  number: string;
  date: string;
  type: AdjustmentType;
  purity: "24K" | "22K" | "18K";
  weight: number;
  reason: string;
  karigar: string;
};

export const initialAdjustments: GoldAdjustmentRecord[] = [
  { id: 1, number: "ADJ-2025-001", date: "29 Apr 2025", type: "Add", purity: "22K", weight: 500, reason: "Melting Return", karigar: "Rahim Uddin" },
  { id: 2, number: "ADJ-2025-002", date: "26 Apr 2025", type: "Reduce", purity: "24K", weight: 200, reason: "Production Loss", karigar: "Karim Ali" },
  { id: 3, number: "ADJ-2025-003", date: "22 Apr 2025", type: "Add", purity: "18K", weight: 350, reason: "Purchase Adjustment", karigar: "Jamal Hossain" },
  { id: 4, number: "ADJ-2025-004", date: "18 Apr 2025", type: "Reduce", purity: "22K", weight: 150, reason: "Damaged", karigar: "Jamal Hossain" },
  { id: 5, number: "ADJ-2025-005", date: "15 Apr 2025", type: "Add", purity: "24K", weight: 600, reason: "Refinement", karigar: "Salim Khan" },
  { id: 6, number: "ADJ-2025-006", date: "10 Apr 2025", type: "Reduce", purity: "22K", weight: 100, reason: "Making Charge", karigar: "Rafiq Mia" },
  { id: 7, number: "ADJ-2025-007", date: "05 Apr 2025", type: "Add", purity: "18K", weight: 250, reason: "Stock Reconciliation", karigar: "—" },
  { id: 8, number: "ADJ-2025-008", date: "02 Apr 2025", type: "Reduce", purity: "24K", weight: 300, reason: "Cutting Loss", karigar: "Nusrat Jahan" },
];

export const karigarOptions = ["All Karigar", "Rahim Uddin", "Karim Ali", "Jamal Hossain", "Salim Khan", "Rafiq Mia", "Nusrat Jahan"] as const;
export const purityOptions = ["All Purity", "24K", "22K", "18K"] as const;

export type ReportTab = "Stock Report" | "Movement Report" | "Adjustment Report" | "Purity Wise Report" | "Karigar Wise Report";

export const reportTabs: ReportTab[] = ["Stock Report", "Movement Report", "Adjustment Report", "Purity Wise Report", "Karigar Wise Report"];

export const stockSummary = [
  { purity: "24K", opening: 3500, incoming: 1100, outgoing: 650, closing: 3950 },
  { purity: "22K", opening: 6250, incoming: 2000, outgoing: 1750, closing: 6500 },
  { purity: "18K", opening: 1800, incoming: 600, outgoing: 450, closing: 1950 },
];

export const recentActivities = [
  { date: "30 Apr 2025", activity: "Stock Added", purity: "22K", weight: 500 },
  { date: "29 Apr 2025", activity: "Stock Reduced", purity: "24K", weight: 200 },
  { date: "28 Apr 2025", activity: "Stock Added", purity: "18K", weight: 350 },
  { date: "26 Apr 2025", activity: "Stock Reduced", purity: "22K", weight: 150 },
];

export const movementRows = [
  { date: "30 Apr 2025", reference: "PUR-2025-041", type: "Purchase", purity: "24K", incoming: 850, outgoing: 0, balance: 3950 },
  { date: "29 Apr 2025", reference: "ADJ-2025-001", type: "Adjustment", purity: "22K", incoming: 500, outgoing: 0, balance: 6500 },
  { date: "28 Apr 2025", reference: "PRO-2025-028", type: "Production", purity: "22K", incoming: 0, outgoing: 450, balance: 6000 },
  { date: "26 Apr 2025", reference: "ADJ-2025-002", type: "Adjustment", purity: "24K", incoming: 0, outgoing: 200, balance: 3750 },
];

export const adjustmentSummary = [
  { purity: "24K", added: 11, reduced: 6, net: 350 },
  { purity: "22K", added: 14, reduced: 8, net: 750 },
  { purity: "18K", added: 7, reduced: 5, net: 150 },
];

export const karigarSummary = [
  { name: "Rahim Uddin", added: 500, reduced: 0, net: 500 },
  { name: "Karim Ali", added: 0, reduced: 200, net: -200 },
  { name: "Jamal Hossain", added: 350, reduced: 150, net: 200 },
  { name: "Salim Khan", added: 600, reduced: 0, net: 600 },
  { name: "Rafiq Mia", added: 0, reduced: 100, net: -100 },
];

