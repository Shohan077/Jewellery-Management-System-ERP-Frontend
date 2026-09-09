import type { PaymentStatus } from "@/components/ui/status-badge";

export type InvoiceRecord = {
  id: number;
  date: string;
  invoiceNo: string;
  customer: string;
  mobile: string;
  amount: number;
  status: PaymentStatus;
};

const featuredInvoices: InvoiceRecord[] = [
  { id: 1, date: "30 Apr 2025", invoiceNo: "S-000125", customer: "Rahim Uddin", mobile: "01711 234 567", amount: 72_500, status: "Paid" },
  { id: 2, date: "30 Apr 2025", invoiceNo: "S-000124", customer: "Nusrat Jahan", mobile: "01819 876 543", amount: 120_000, status: "Paid" },
  { id: 3, date: "29 Apr 2025", invoiceNo: "S-000123", customer: "Tanvir Ahmed", mobile: "01912 445 621", amount: 45_800, status: "Due" },
  { id: 4, date: "29 Apr 2025", invoiceNo: "S-000122", customer: "Farzana Akter", mobile: "01628 912 300", amount: 88_000, status: "Paid" },
  { id: 5, date: "28 Apr 2025", invoiceNo: "S-000121", customer: "Md. Selim", mobile: "01747 308 144", amount: 66_200, status: "Paid" },
  { id: 6, date: "28 Apr 2025", invoiceNo: "S-000120", customer: "Salma Begum", mobile: "01842 713 982", amount: 95_000, status: "Due" },
  { id: 7, date: "27 Apr 2025", invoiceNo: "S-000119", customer: "Arif Hossain", mobile: "01309 432 556", amount: 110_500, status: "Paid" },
  { id: 8, date: "27 Apr 2025", invoiceNo: "S-000118", customer: "Laila Khan", mobile: "01533 208 145", amount: 58_300, status: "Paid" },
  { id: 9, date: "26 Apr 2025", invoiceNo: "S-000117", customer: "Jahid Hasan", mobile: "01780 229 117", amount: 77_800, status: "Returned" },
  { id: 10, date: "26 Apr 2025", invoiceNo: "S-000116", customer: "Tamanna Akter", mobile: "01861 842 900", amount: 92_000, status: "Paid" },
];

const customerNames = [
  "Imran Chowdhury",
  "Tania Sultana",
  "Shakib Islam",
  "Maliha Noor",
  "Sabbir Rahman",
  "Raisa Karim",
  "Mahmud Hasan",
  "Nabila Ahmed",
];

const generatedInvoices = Array.from({ length: 1_235 }, (_, generatedIndex): InvoiceRecord => {
  const id = featuredInvoices.length + generatedIndex + 1;
  const status: PaymentStatus = generatedIndex < 973 ? "Paid" : generatedIndex < 1_181 ? "Due" : "Returned";
  const day = 25 - (generatedIndex % 25);
  const monthOffset = Math.floor(generatedIndex / 25);
  const monthNames = ["Apr", "Mar", "Feb", "Jan", "Dec", "Nov", "Oct", "Sep", "Aug", "Jul", "Jun", "May"];
  const month = monthNames[monthOffset % monthNames.length];
  const year = 2025 - Math.floor(monthOffset / monthNames.length);
  const sequence = 1_115 - generatedIndex;

  return {
    id,
    date: `${String(day).padStart(2, "0")} ${month} ${year}`,
    invoiceNo: `S-${String(Math.max(sequence, 1)).padStart(6, "0")}`,
    customer: customerNames[generatedIndex % customerNames.length],
    mobile: `01${String(300_000_000 + generatedIndex).slice(-9)}`,
    amount: 34_500 + (generatedIndex % 18) * 6_750,
    status,
  };
});

export const invoices: InvoiceRecord[] = [...featuredInvoices, ...generatedInvoices];

export type Product = {
  id: string;
  name: string;
  code: string;
  purity: string;
  weight: number;
  makingCharge: number;
  unitPrice: number;
};

export const productCatalog: Product[] = [
  { id: "necklace", name: "Gold Necklace", code: "G-NECK-001", purity: "22K", weight: 12.5, makingCharge: 3_500, unitPrice: 8_420 },
  { id: "ring", name: "Gold Ring", code: "G-RING-002", purity: "22K", weight: 5.2, makingCharge: 800, unitPrice: 8_420 },
  { id: "bangle", name: "Gold Bangle", code: "G-BANG-003", purity: "22K", weight: 8.75, makingCharge: 1_850, unitPrice: 8_420 },
  { id: "earrings", name: "Gold Earrings", code: "G-EARR-004", purity: "21K", weight: 4.1, makingCharge: 950, unitPrice: 8_050 },
  { id: "chain", name: "Gold Chain", code: "G-CHAIN-005", purity: "22K", weight: 7.35, makingCharge: 1_400, unitPrice: 8_420 },
];

export const initialProducts = productCatalog.slice(0, 2);

const currencyFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatCurrency(value: number) {
  return `৳ ${currencyFormatter.format(value)}`;
}

export function getProductTotal(product: Product) {
  return Math.round(product.weight * product.unitPrice + product.makingCharge);
}
