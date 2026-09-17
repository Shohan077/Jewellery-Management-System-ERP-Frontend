export type QuotationCustomer = {
  id: string;
  name: string;
  phone: string;
};

export type QuotationProduct = {
  id: string;
  name: string;
  code: string;
  purity: string;
  weight: number;
  rate: number;
};

export const quotationCustomers: QuotationCustomer[] = [
  { id: "C-000128", name: "Shamim Rahman", phone: "01712-345678" },
  { id: "C-000125", name: "Rahim Uddin", phone: "01712-345678" },
  { id: "C-000124", name: "Nusrat Jahan", phone: "01823-456789" },
];

export const quotationProducts: QuotationProduct[] = [
  { id: "gold-necklace", name: "Gold Necklace", code: "GN-001", purity: "22K", weight: 10.5, rate: 8420 },
  { id: "gold-ring", name: "Gold Ring", code: "GR-002", purity: "22K", weight: 5.2, rate: 8420 },
  { id: "diamond-earring", name: "Diamond Earring", code: "DE-003", purity: "18K", weight: 3.5, rate: 6500 },
  { id: "gold-bracelet", name: "Gold Bracelet", code: "GB-004", purity: "22K", weight: 8.75, rate: 8420 },
  { id: "gold-chain", name: "Gold Chain", code: "GC-005", purity: "22K", weight: 12, rate: 8650 },
  { id: "pendant", name: "Pendant", code: "PD-006", purity: "18K", weight: 4.2, rate: 6800 },
];

export const initialQuotationProducts = quotationProducts.slice(0, 3);

const currencyFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function getQuotationLineAmount(product: QuotationProduct) {
  return Math.round(product.weight * product.rate);
}

export function formatQuotationCurrency(value: number) {
  return `\u09F3 ${currencyFormatter.format(Math.round(value))}`;
}
