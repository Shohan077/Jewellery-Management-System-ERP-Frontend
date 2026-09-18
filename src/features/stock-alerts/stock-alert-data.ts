export type StockAlertStatus = "Low Stock" | "Out of Stock";

export type StockAlertItem = {
  id: number;
  productName: string;
  code: string;
  category: string;
  branch: string;
  currentStock: number;
  minimumLevel: number;
  unit: "pcs";
  reorderPending: boolean;
  lastAlert: string;
};

export const stockAlertItems: StockAlertItem[] = [
  { id: 1, productName: "Gold Necklace", code: "GN-001", category: "Necklace", branch: "Main Branch", currentStock: 2, minimumLevel: 10, unit: "pcs", reorderPending: true, lastAlert: "Today, 09:20 AM" },
  { id: 2, productName: "Diamond Earring", code: "DE-003", category: "Earring", branch: "Main Branch", currentStock: 0, minimumLevel: 5, unit: "pcs", reorderPending: true, lastAlert: "Today, 09:05 AM" },
  { id: 3, productName: "Gold Chain", code: "GC-005", category: "Chain", branch: "Uttara Branch", currentStock: 3, minimumLevel: 10, unit: "pcs", reorderPending: false, lastAlert: "Today, 08:40 AM" },
  { id: 4, productName: "Gold Ring", code: "GR-002", category: "Ring", branch: "Main Branch", currentStock: 1, minimumLevel: 8, unit: "pcs", reorderPending: true, lastAlert: "Yesterday, 04:15 PM" },
  { id: 5, productName: "Pendant", code: "PD-006", category: "Pendant", branch: "Chittagong Branch", currentStock: 0, minimumLevel: 5, unit: "pcs", reorderPending: false, lastAlert: "Yesterday, 03:35 PM" },
  { id: 6, productName: "Bangle", code: "BG-007", category: "Bangle", branch: "Uttara Branch", currentStock: 4, minimumLevel: 10, unit: "pcs", reorderPending: true, lastAlert: "Yesterday, 01:10 PM" },
  { id: 7, productName: "Nose Pin", code: "NP-008", category: "Nose Pin", branch: "Main Branch", currentStock: 2, minimumLevel: 8, unit: "pcs", reorderPending: false, lastAlert: "29 Apr 2025" },
  { id: 8, productName: "Diamond Ring", code: "DR-009", category: "Ring", branch: "Chittagong Branch", currentStock: 1, minimumLevel: 5, unit: "pcs", reorderPending: true, lastAlert: "29 Apr 2025" },
  { id: 9, productName: "Gold Bracelet", code: "GB-004", category: "Bracelet", branch: "Main Branch", currentStock: 6, minimumLevel: 10, unit: "pcs", reorderPending: false, lastAlert: "28 Apr 2025" },
  { id: 10, productName: "Mangalsutra", code: "GM-010", category: "Necklace", branch: "Uttara Branch", currentStock: 0, minimumLevel: 3, unit: "pcs", reorderPending: true, lastAlert: "28 Apr 2025" },
  { id: 11, productName: "Diamond Pendant", code: "DP-011", category: "Pendant", branch: "Main Branch", currentStock: 2, minimumLevel: 6, unit: "pcs", reorderPending: false, lastAlert: "27 Apr 2025" },
  { id: 12, productName: "Gold Earrings", code: "GE-012", category: "Earring", branch: "Uttara Branch", currentStock: 3, minimumLevel: 9, unit: "pcs", reorderPending: true, lastAlert: "27 Apr 2025" },
  { id: 13, productName: "Wedding Ring", code: "WR-013", category: "Ring", branch: "Chittagong Branch", currentStock: 2, minimumLevel: 7, unit: "pcs", reorderPending: false, lastAlert: "26 Apr 2025" },
  { id: 14, productName: "Gold Locket", code: "GL-014", category: "Pendant", branch: "Main Branch", currentStock: 4, minimumLevel: 8, unit: "pcs", reorderPending: false, lastAlert: "25 Apr 2025" },
  { id: 15, productName: "Diamond Bracelet", code: "DB-015", category: "Bracelet", branch: "Uttara Branch", currentStock: 1, minimumLevel: 6, unit: "pcs", reorderPending: true, lastAlert: "25 Apr 2025" },
  { id: 16, productName: "Gold Anklet", code: "GA-016", category: "Anklet", branch: "Chittagong Branch", currentStock: 0, minimumLevel: 4, unit: "pcs", reorderPending: false, lastAlert: "24 Apr 2025" },
  { id: 17, productName: "Diamond Nose Pin", code: "DN-017", category: "Nose Pin", branch: "Main Branch", currentStock: 0, minimumLevel: 3, unit: "pcs", reorderPending: false, lastAlert: "24 Apr 2025" },
];

export const alertCategories = Array.from(new Set(stockAlertItems.map((item) => item.category))).sort();
export const alertBranches = Array.from(new Set(stockAlertItems.map((item) => item.branch))).sort();

export function getStockAlertStatus(item: Pick<StockAlertItem, "currentStock">): StockAlertStatus {
  return item.currentStock === 0 ? "Out of Stock" : "Low Stock";
}
