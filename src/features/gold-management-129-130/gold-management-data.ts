export type GoldPurity = "24K" | "22K" | "18K";

export type GoldRateRow = {
  id: string;
  date: string;
  purity: GoldPurity;
  rate: number;
  change: number;
  source: string;
};

export const initialGoldRates: GoldRateRow[] = [
  { id: "gr-001", date: "2025-04-30", purity: "24K", rate: 10250, change: 0.8, source: "Local Market" },
  { id: "gr-002", date: "2025-04-30", purity: "22K", rate: 9850, change: 1.2, source: "Local Market" },
  { id: "gr-003", date: "2025-04-30", purity: "18K", rate: 8120, change: 1.1, source: "Local Market" },
  { id: "gr-004", date: "2025-04-29", purity: "24K", rate: 10170, change: -0.5, source: "Local Market" },
  { id: "gr-005", date: "2025-04-29", purity: "22K", rate: 9730, change: -0.4, source: "Local Market" },
  { id: "gr-006", date: "2025-04-29", purity: "18K", rate: 8030, change: -0.3, source: "Local Market" },
  { id: "gr-007", date: "2025-04-28", purity: "24K", rate: 10120, change: 0.6, source: "Local Market" },
  { id: "gr-008", date: "2025-04-28", purity: "22K", rate: 9770, change: 0.5, source: "Local Market" },
];

export type GoldStockStatus = "Available" | "Reserved" | "Damaged";
export type GoldStockRow = {
  id: string;
  code: string;
  purity: GoldPurity;
  weight: number;
  type: string;
  location: string;
  status: GoldStockStatus;
  addedDate: string;
};

export const initialGoldStock: GoldStockRow[] = [
  { id: "gs-001", code: "GS-2025-001", purity: "24K", weight: 2500, type: "Raw Gold", location: "Main Vault", status: "Available", addedDate: "10 Apr 2025" },
  { id: "gs-002", code: "GS-2025-002", purity: "22K", weight: 5000, type: "Raw Gold", location: "Main Vault", status: "Available", addedDate: "08 Apr 2025" },
  { id: "gs-003", code: "GS-2025-003", purity: "18K", weight: 1250, type: "Raw Gold", location: "Main Vault", status: "Reserved", addedDate: "05 Apr 2025" },
  { id: "gs-004", code: "GS-2025-004", purity: "22K", weight: 750, type: "Finished Item", location: "Showroom - 1", status: "Available", addedDate: "03 Apr 2025" },
  { id: "gs-005", code: "GS-2025-005", purity: "24K", weight: 500, type: "WIP (In Process)", location: "Workshop", status: "Reserved", addedDate: "01 Apr 2025" },
  { id: "gs-006", code: "GS-2025-006", purity: "22K", weight: 300, type: "Scrap", location: "Main Vault", status: "Damaged", addedDate: "28 Mar 2025" },
];

export function formatBdt(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

export function formatWeight(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 3 }).format(value);
}

