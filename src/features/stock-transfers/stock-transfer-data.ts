export type StockBranch = {
  id: string;
  name: string;
  location?: string;
};

export type StockProduct = {
  id: string;
  name: string;
  code: string;
  availableStock: number;
  unit: "pcs";
};

export type RecentTransfer = {
  id: string;
  date: string;
  fromBranch: string;
  toBranch: string;
  totalItems: number;
  status: "Completed" | "Pending";
};

export const stockTransferBranches: readonly StockBranch[] = [
  { id: "main", name: "Main Branch", location: "Dhaka" },
  { id: "uttara", name: "Uttara Branch" },
  { id: "chittagong", name: "Chittagong Branch" },
  { id: "sylhet", name: "Sylhet Branch" },
  { id: "khulna", name: "Khulna Branch" },
];

export const stockProductCatalog: readonly StockProduct[] = [
  { id: "gold-necklace", name: "Gold Necklace", code: "GN-001", availableStock: 12, unit: "pcs" },
  { id: "gold-ring", name: "Gold Ring", code: "GR-002", availableStock: 25, unit: "pcs" },
  { id: "diamond-earring", name: "Diamond Earring", code: "DE-003", availableStock: 8, unit: "pcs" },
  { id: "gold-chain", name: "Gold Chain", code: "GC-005", availableStock: 18, unit: "pcs" },
  { id: "gold-bangle", name: "Gold Bangle", code: "GB-004", availableStock: 15, unit: "pcs" },
  { id: "pendant", name: "Pendant", code: "PD-006", availableStock: 9, unit: "pcs" },
  { id: "diamond-ring", name: "Diamond Ring", code: "DR-008", availableStock: 6, unit: "pcs" },
];

export const initialStockTransferQuantities: Readonly<Record<string, number>> = {
  "gold-necklace": 3,
  "gold-ring": 5,
  "diamond-earring": 2,
  "gold-chain": 4,
};

export const recentStockTransfers: readonly RecentTransfer[] = [
  { id: "ST-0428", date: "28 Apr 2025", fromBranch: "Main Branch", toBranch: "Uttara Branch", totalItems: 12, status: "Completed" },
  { id: "ST-0420", date: "20 Apr 2025", fromBranch: "Main Branch", toBranch: "Chittagong Branch", totalItems: 8, status: "Completed" },
  { id: "ST-0415", date: "15 Apr 2025", fromBranch: "Uttara Branch", toBranch: "Main Branch", totalItems: 5, status: "Pending" },
  { id: "ST-0410", date: "10 Apr 2025", fromBranch: "Main Branch", toBranch: "Sylhet Branch", totalItems: 10, status: "Completed" },
  { id: "ST-0405", date: "05 Apr 2025", fromBranch: "Khulna Branch", toBranch: "Main Branch", totalItems: 7, status: "Completed" },
  { id: "ST-0331", date: "31 Mar 2025", fromBranch: "Main Branch", toBranch: "Khulna Branch", totalItems: 6, status: "Completed" },
];
