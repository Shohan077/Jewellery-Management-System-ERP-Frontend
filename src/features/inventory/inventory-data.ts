export type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type InventoryKind =
  | "necklace"
  | "ring"
  | "earring"
  | "bracelet"
  | "chain"
  | "pendant"
  | "bangle"
  | "nose-pin";

export type InventoryItem = {
  id: number;
  name: string;
  code: string;
  category: string;
  stockQty: number;
  unit: "pcs";
  status: InventoryStatus;
  kind: InventoryKind;
  unitValue: number;
};

export const INITIAL_STOCK_VALUE = 125_678_900;

const featuredInventory: InventoryItem[] = [
  { id: 1, name: "Gold Necklace", code: "GN-001", category: "Necklace", stockQty: 12, unit: "pcs", status: "In Stock", kind: "necklace", unitValue: 108_750 },
  { id: 2, name: "Gold Ring", code: "GR-002", category: "Ring", stockQty: 5, unit: "pcs", status: "Low Stock", kind: "ring", unitValue: 44_584 },
  { id: 3, name: "Diamond Earring", code: "DE-003", category: "Earring", stockQty: 0, unit: "pcs", status: "Out of Stock", kind: "earring", unitValue: 98_000 },
  { id: 4, name: "Gold Bracelet", code: "GB-004", category: "Bracelet", stockQty: 8, unit: "pcs", status: "In Stock", kind: "bracelet", unitValue: 72_400 },
  { id: 5, name: "Gold Chain", code: "GC-005", category: "Chain", stockQty: 25, unit: "pcs", status: "In Stock", kind: "chain", unitValue: 28_500 },
  { id: 6, name: "Pendant", code: "PD-006", category: "Pendant", stockQty: 3, unit: "pcs", status: "Low Stock", kind: "pendant", unitValue: 28_600 },
  { id: 7, name: "Bangle", code: "BG-007", category: "Bangle", stockQty: 18, unit: "pcs", status: "In Stock", kind: "bangle", unitValue: 132_000 },
  { id: 8, name: "Nose Pin", code: "NP-008", category: "Nose Pin", stockQty: 0, unit: "pcs", status: "Out of Stock", kind: "nose-pin", unitValue: 9_800 },
  { id: 9, name: "Diamond Ring", code: "DR-009", category: "Ring", stockQty: 7, unit: "pcs", status: "In Stock", kind: "ring", unitValue: 125_000 },
  { id: 10, name: "Gold Mangalsutra", code: "GM-010", category: "Necklace", stockQty: 11, unit: "pcs", status: "In Stock", kind: "necklace", unitValue: 84_500 },
];

const collectionNames = ["Classic", "Heritage", "Aarohan", "Bridal", "Signature", "Everyday"] as const;

export function statusForQuantity(quantity: number): InventoryStatus {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= 5) return "Low Stock";
  return "In Stock";
}

export const inventoryItems: InventoryItem[] = Array.from({ length: 3_245 }, (_, index) => {
  if (index < featuredInventory.length) return featuredInventory[index];

  const id = index + 1;
  const source = featuredInventory[index % featuredInventory.length];
  const collection = collectionNames[Math.floor(index / featuredInventory.length) % collectionNames.length];
  const outOfStock = id >= 11 && id <= 14;
  const lowStock = id >= 15 && id <= 40;
  const stockQty = outOfStock ? 0 : lowStock ? ((id - 15) % 5) + 1 : 6 + (id % 29);
  const prefix = source.code.slice(0, 2);

  return {
    ...source,
    id,
    name: `${collection} ${source.name}`,
    code: `${prefix}-${String(id).padStart(4, "0")}`,
    stockQty,
    status: statusForQuantity(stockQty),
    unitValue: source.unitValue + (id % 17) * 625,
  };
});

export const inventoryCategories = [
  "Necklace",
  "Ring",
  "Earring",
  "Bracelet",
  "Chain",
  "Pendant",
  "Bangle",
  "Nose Pin",
] as const;

export function formatBdt(value: number) {
  return `৳ ${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;
}
