export type ProductionReportType =
  | "Production Summary"
  | "Karigar Performance"
  | "Item Production";

export type KarigarPerformance = {
  id: number;
  name: string;
  totalOrders: number;
  completed: number;
  inProgress: number;
  pending: number;
};

export const reportTypes: ProductionReportType[] = [
  "Production Summary",
  "Karigar Performance",
  "Item Production",
];

export const monthlyProduction = [
  { month: "Jan", completed: 9, inProgress: 21 },
  { month: "Feb", completed: 14, inProgress: 25 },
  { month: "Mar", completed: 20, inProgress: 29 },
  { month: "Apr", completed: 19, inProgress: 28 },
  { month: "May", completed: 16, inProgress: 32 },
  { month: "Jun", completed: 36, inProgress: 39 },
] as const;

export const itemProduction = [
  { name: "Necklace", value: 35, color: "#1479d4" },
  { name: "Ring", value: 42, color: "#189f58" },
  { name: "Bracelet", value: 18, color: "#7b4dc7" },
  { name: "Earring", value: 15, color: "#d94555" },
  { name: "Pendant", value: 10, color: "#e89120" },
  { name: "Others", value: 5, color: "#5ba3aa" },
] as const;

export const karigarPerformance: KarigarPerformance[] = [
  { id: 1, name: "Rahim Uddin", totalOrders: 10, completed: 8, inProgress: 2, pending: 0 },
  { id: 2, name: "Karim Ali", totalOrders: 8, completed: 6, inProgress: 1, pending: 1 },
  { id: 3, name: "Jamal Hossain", totalOrders: 6, completed: 4, inProgress: 2, pending: 0 },
  { id: 4, name: "Salim Khan", totalOrders: 5, completed: 3, inProgress: 1, pending: 1 },
  { id: 5, name: "Rafiq Mia", totalOrders: 3, completed: 3, inProgress: 0, pending: 0 },
];

export const karigarOptions = ["All Karigars", ...karigarPerformance.map((row) => row.name)];

export type ProductionReportStatus = "Completed" | "In Progress" | "Pending";

export type ProductionReportOrder = {
  id: number;
  orderNo: string;
  itemName: string;
  karigar: string;
  assignedDate: string;
  assignedDateIso: string;
  expectedDate: string;
  status: ProductionReportStatus;
  producedQuantity: number;
  productionValue: number;
};

export const productionReportStatuses = ["All", "Completed", "In Progress", "Pending"] as const;

export const productionReportOrders: ProductionReportOrder[] = [
  { id: 1, orderNo: "PO-2025-001", itemName: "Gold Necklace", karigar: "Rahim Uddin", assignedDate: "10 Apr 2025", assignedDateIso: "2025-04-10", expectedDate: "20 Apr 2025", status: "Completed", producedQuantity: 5, productionValue: 325000 },
  { id: 2, orderNo: "PO-2025-002", itemName: "Gold Ring", karigar: "Karim Ali", assignedDate: "12 Apr 2025", assignedDateIso: "2025-04-12", expectedDate: "22 Apr 2025", status: "In Progress", producedQuantity: 8, productionValue: 184000 },
  { id: 3, orderNo: "PO-2025-003", itemName: "Gold Bracelet", karigar: "Jamal Hossain", assignedDate: "15 Apr 2025", assignedDateIso: "2025-04-15", expectedDate: "25 Apr 2025", status: "In Progress", producedQuantity: 3, productionValue: 246000 },
  { id: 4, orderNo: "PO-2025-004", itemName: "Diamond Pendant", karigar: "Salim Khan", assignedDate: "18 Apr 2025", assignedDateIso: "2025-04-18", expectedDate: "28 Apr 2025", status: "Pending", producedQuantity: 0, productionValue: 0 },
  { id: 5, orderNo: "PO-2025-005", itemName: "Gold Earring", karigar: "Rafiq Mia", assignedDate: "20 Apr 2025", assignedDateIso: "2025-04-20", expectedDate: "30 Apr 2025", status: "Completed", producedQuantity: 12, productionValue: 216000 },
];

export const detailedReportSummary = {
  total: 48,
  completed: 32,
  inProgress: 12,
  pending: 4,
} as const;
