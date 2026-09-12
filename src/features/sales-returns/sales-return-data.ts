export type ReturnLine = {
  id: number;
  product: string;
  code: string;
  purity: string;
  weight: number;
  rate: number;
  purchasedQuantity: number;
  returnQuantity: number;
  unitRefund: number;
};

export const invoiceDetails = {
  invoiceNo: "S-2025-00125",
  invoiceDate: "25 Apr 2025",
  customer: "Rahim Uddin",
  customerId: "C-000125",
  totalAmount: 125_300,
} as const;

export const initialReturnLines: ReturnLine[] = [
  { id: 1, product: "Gold Ring", code: "GR-002", purity: "22K", weight: 5.2, rate: 8_650, purchasedQuantity: 1, returnQuantity: 1, unitRefund: 43_784 },
  { id: 2, product: "Pendant", code: "PD-006", purity: "18K", weight: 4.2, rate: 6_800, purchasedQuantity: 1, returnQuantity: 0, unitRefund: 28_560 },
  { id: 3, product: "Gold Chain", code: "GC-005", purity: "22K", weight: 12, rate: 8_650, purchasedQuantity: 2, returnQuantity: 0, unitRefund: 103_800 },
];

const currency = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatReturnCurrency(value: number) {
  return `\u09F3 ${currency.format(Math.round(value))}`;
}
