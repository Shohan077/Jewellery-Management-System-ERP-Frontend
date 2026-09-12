export type PurchaseProduct = {
  id: string;
  name: string;
  code: string;
  purity: string;
  weight: number;
  rate: number;
};

export type PurchaseSupplier = {
  id: string;
  name: string;
};

export type PurchaseLine = {
  id: number;
  productId: string;
  purity: string;
  weight: number;
  rate: number;
};

export const purchaseProducts: PurchaseProduct[] = [
  { id: "gold-necklace", name: "Gold Necklace", code: "GN-001", purity: "22K", weight: 10.5, rate: 8420 },
  { id: "gold-ring", name: "Gold Ring", code: "GR-002", purity: "22K", weight: 5.2, rate: 8420 },
  { id: "diamond-earring", name: "Diamond Earring", code: "DE-003", purity: "18K", weight: 3.5, rate: 6500 },
  { id: "gold-bracelet", name: "Gold Bracelet", code: "GB-004", purity: "22K", weight: 8.75, rate: 8420 },
  { id: "gold-chain", name: "Gold Chain", code: "GC-005", purity: "22K", weight: 12, rate: 8650 },
  { id: "pendant", name: "Pendant", code: "PD-006", purity: "18K", weight: 4.2, rate: 6800 },
];

export const initialSuppliers: PurchaseSupplier[] = [
  { id: "S-0001", name: "Ali Gold Traders" },
  { id: "S-0002", name: "Diamond House Ltd." },
  { id: "S-0003", name: "Rahman Jewellers" },
  { id: "S-0004", name: "Gold Line BD" },
];

export const initialPurchaseLines: PurchaseLine[] = purchaseProducts.slice(0, 3).map((product, index) => ({
  id: index + 1,
  productId: product.id,
  purity: product.purity,
  weight: product.weight,
  rate: product.rate,
}));

export const purityOptions = ["24K", "22K", "21K", "18K", "925"];

export function getProduct(productId: string) {
  return purchaseProducts.find((product) => product.id === productId) ?? purchaseProducts[0];
}

export function getLineAmount(line: PurchaseLine) {
  return Math.round(Math.max(0, line.weight) * Math.max(0, line.rate));
}

const amountFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatAmount(value: number) {
  return `\u09F3 ${amountFormatter.format(Math.round(value))}`;
}
