export type BarcodeProduct = {
  id: number;
  name: string;
  code: string;
  purity: string;
  weight: number;
  barcode: string;
};

export type BarcodeRecord = {
  id: number;
  productId: number;
  productName: string;
  code: string;
  barcode: string;
  date: string;
};

export const barcodeProducts: BarcodeProduct[] = [
  { id: 1, name: "Gold Necklace", code: "GN-001", purity: "22K", weight: 10.5, barcode: "GN001250420001" },
  { id: 2, name: "Gold Ring", code: "GR-002", purity: "22K", weight: 5.2, barcode: "GR002250420002" },
  { id: 3, name: "Diamond Earring", code: "DE-003", purity: "18K", weight: 4.8, barcode: "DE003250420003" },
  { id: 4, name: "Gold Chain", code: "GC-005", purity: "22K", weight: 8.8, barcode: "GC005240420004" },
  { id: 5, name: "Pendant", code: "PD-006", purity: "21K", weight: 3.5, barcode: "PD006240420005" },
  { id: 6, name: "Gold Bracelet", code: "GB-007", purity: "22K", weight: 8.2, barcode: "GB007230420006" },
  { id: 7, name: "Nose Pin", code: "NP-010", purity: "21K", weight: 1.2, barcode: "NP010220420007" },
];

export const initialBarcodeRecords: BarcodeRecord[] = [
  { id: 1, productId: 1, productName: "Gold Necklace", code: "GN-001", barcode: "GN001250420001", date: "25 Apr 2025" },
  { id: 2, productId: 2, productName: "Gold Ring", code: "GR-002", barcode: "GR002250420002", date: "25 Apr 2025" },
  { id: 3, productId: 3, productName: "Diamond Earring", code: "DE-003", barcode: "DE003250420003", date: "24 Apr 2025" },
  { id: 4, productId: 4, productName: "Gold Chain", code: "GC-005", barcode: "GC005240420004", date: "24 Apr 2025" },
  { id: 5, productId: 5, productName: "Pendant", code: "PD-006", barcode: "PD006240420005", date: "23 Apr 2025" },
];

export function formatWeight(weight: number) {
  return `${weight.toFixed(2)} g`;
}
