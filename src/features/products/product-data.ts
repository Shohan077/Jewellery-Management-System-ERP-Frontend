export type ProductStatus = "Active" | "Inactive";

export type ProductKind =
  | "necklace"
  | "ring"
  | "earring"
  | "bracelet"
  | "pendant"
  | "bangle"
  | "chain"
  | "nose-pin";

export type ProductRecord = {
  id: number;
  name: string;
  code: string;
  category: string;
  purity: string;
  weight: number;
  sellingPrice: number;
  status: ProductStatus;
  kind: ProductKind;
};

const featuredProducts: ProductRecord[] = [
  { id: 1, name: "Gold Necklace", code: "GN-001", category: "Necklace", purity: "22K", weight: 12.5, sellingPrice: 108750, status: "Active", kind: "necklace" },
  { id: 2, name: "Gold Ring", code: "GR-002", category: "Ring", purity: "22K", weight: 5.2, sellingPrice: 44584, status: "Active", kind: "ring" },
  { id: 3, name: "Gold Earring", code: "GE-003", category: "Earring", purity: "21K", weight: 6.3, sellingPrice: 52300, status: "Active", kind: "earring" },
  { id: 4, name: "Diamond Ring", code: "DR-004", category: "Ring", purity: "18K", weight: 4.1, sellingPrice: 125000, status: "Active", kind: "ring" },
  { id: 5, name: "Gold Bracelet", code: "GB-005", category: "Bracelet", purity: "22K", weight: 8.2, sellingPrice: 72400, status: "Active", kind: "bracelet" },
  { id: 6, name: "Pendant", code: "PD-006", category: "Pendant", purity: "21K", weight: 3.5, sellingPrice: 28600, status: "Active", kind: "pendant" },
  { id: 7, name: "Bangle", code: "BG-007", category: "Bangle", purity: "22K", weight: 15, sellingPrice: 132000, status: "Active", kind: "bangle" },
  { id: 8, name: "Diamond Earring", code: "DE-008", category: "Earring", purity: "18K", weight: 4.8, sellingPrice: 98000, status: "Active", kind: "earring" },
  { id: 9, name: "Gold Chain", code: "GC-009", category: "Chain", purity: "22K", weight: 10, sellingPrice: 28500, status: "Active", kind: "chain" },
  { id: 10, name: "Nose Pin", code: "NP-010", category: "Nose Pin", purity: "21K", weight: 1.2, sellingPrice: 9800, status: "Active", kind: "nose-pin" },
];

const collectionNames = ["Classic", "Heritage", "Aarohan", "Bridal", "Signature", "Everyday"] as const;

export const products: ProductRecord[] = Array.from({ length: 1245 }, (_, index) => {
  if (index < featuredProducts.length) return featuredProducts[index];

  const source = featuredProducts[index % featuredProducts.length];
  const id = index + 1;
  const collection = collectionNames[Math.floor(index / featuredProducts.length) % collectionNames.length];
  const prefix = source.code.slice(0, 2);
  const weightAdjustment = (index % 9) * 0.18;
  const priceAdjustment = (index % 17) * 625;

  return {
    ...source,
    id,
    name: `${collection} ${source.name}`,
    code: `${prefix}-${String(id).padStart(4, "0")}`,
    weight: Number((source.weight + weightAdjustment).toFixed(2)),
    sellingPrice: source.sellingPrice + priceAdjustment,
    status: id % 8 === 0 ? "Inactive" : "Active",
  };
});

export const productCategories = [
  "Necklace",
  "Ring",
  "Earring",
  "Bracelet",
  "Pendant",
  "Bangle",
  "Chain",
  "Nose Pin",
] as const;

export function formatCurrency(value: number) {
  return `৳ ${new Intl.NumberFormat("en-IN").format(value)}`;
}
