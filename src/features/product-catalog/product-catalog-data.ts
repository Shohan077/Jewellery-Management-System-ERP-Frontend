export type CatalogProductStatus = "Active" | "Inactive";

export type CatalogProductKind =
  | "necklace"
  | "ring"
  | "earring"
  | "bracelet"
  | "chain"
  | "pendant"
  | "bangle"
  | "nose-pin";

export type CatalogProduct = {
  id: number;
  name: string;
  code: string;
  category: string;
  brand: string;
  purity: string;
  weight: number;
  status: CatalogProductStatus;
  kind: CatalogProductKind;
  stock: number;
};

const featuredProducts: CatalogProduct[] = [
  { id: 1, name: "Gold Necklace", code: "GN-001", category: "Necklace", brand: "Aarohan", purity: "22K", weight: 10.5, status: "Active", kind: "necklace", stock: 12 },
  { id: 2, name: "Gold Ring", code: "GR-002", category: "Ring", brand: "Royal Gold", purity: "22K", weight: 5.2, status: "Active", kind: "ring", stock: 25 },
  { id: 3, name: "Diamond Earring", code: "DE-003", category: "Earring", brand: "Diamond House", purity: "18K", weight: 3.5, status: "Active", kind: "earring", stock: 8 },
  { id: 4, name: "Gold Bracelet", code: "GB-004", category: "Bracelet", brand: "Aarohan", purity: "22K", weight: 8.75, status: "Active", kind: "bracelet", stock: 16 },
  { id: 5, name: "Gold Chain", code: "GC-005", category: "Chain", brand: "Heritage", purity: "22K", weight: 12, status: "Active", kind: "chain", stock: 18 },
  { id: 6, name: "Pendant", code: "PD-006", category: "Pendant", brand: "Aarohan", purity: "18K", weight: 4.2, status: "Active", kind: "pendant", stock: 9 },
  { id: 7, name: "Bangle", code: "BG-007", category: "Bangle", brand: "Royal Gold", purity: "22K", weight: 11.3, status: "Active", kind: "bangle", stock: 14 },
  { id: 8, name: "Nose Pin", code: "NP-008", category: "Nose Pin", brand: "Aarohan", purity: "22K", weight: 1.25, status: "Active", kind: "nose-pin", stock: 21 },
  { id: 9, name: "Diamond Ring", code: "DR-009", category: "Ring", brand: "Diamond House", purity: "18K", weight: 4.8, status: "Inactive", kind: "ring", stock: 3 },
  { id: 10, name: "Mangalsutra", code: "GM-010", category: "Necklace", brand: "Heritage", purity: "22K", weight: 9.1, status: "Active", kind: "necklace", stock: 11 },
];

const collectionNames = ["Classic", "Bridal", "Heritage", "Signature", "Temple", "Modern"] as const;
const brands = ["Aarohan", "Royal Gold", "Diamond House", "Heritage"] as const;

export const catalogProducts: CatalogProduct[] = Array.from({ length: 345 }, (_, index) => {
  if (index < featuredProducts.length) return featuredProducts[index];

  const source = featuredProducts[index % featuredProducts.length];
  const id = index + 1;
  const collection = collectionNames[Math.floor(index / featuredProducts.length) % collectionNames.length];

  return {
    ...source,
    id,
    name: `${collection} ${source.name}`,
    code: `${source.code.slice(0, 2)}-${String(id).padStart(3, "0")}`,
    brand: brands[index % brands.length],
    purity: index % 9 === 0 ? "21K" : source.purity,
    weight: Number((source.weight + (index % 8) * 0.17).toFixed(2)),
    status: id % 12 === 0 ? "Inactive" : "Active",
    stock: 2 + (id % 28),
  };
});

export const catalogCategories = [
  "Necklace",
  "Ring",
  "Earring",
  "Bracelet",
  "Chain",
  "Pendant",
  "Bangle",
  "Nose Pin",
] as const;

export const catalogBrands = brands;
