export type StockViewStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type StockViewKind =
  | "necklace"
  | "ring"
  | "earring"
  | "bracelet"
  | "chain"
  | "pendant"
  | "bangle"
  | "nose-pin";

export type StockViewItem = {
  id: number;
  name: string;
  code: string;
  category: string;
  quantity: number;
  unit: "pcs";
  value: number;
  status: StockViewStatus;
  kind: StockViewKind;
};

export const INITIAL_STOCK_VALUE = 12_548_900;

const featuredItems: StockViewItem[] = [
  { id: 1, name: "Gold Necklace", code: "GN-001", category: "Necklace", quantity: 12, unit: "pcs", value: 360_000, status: "In Stock", kind: "necklace" },
  { id: 2, name: "Gold Ring", code: "GR-002", category: "Ring", quantity: 25, unit: "pcs", value: 210_000, status: "In Stock", kind: "ring" },
  { id: 3, name: "Diamond Earring", code: "DE-003", category: "Earring", quantity: 8, unit: "pcs", value: 180_000, status: "Low Stock", kind: "earring" },
  { id: 4, name: "Gold Bracelet", code: "GB-004", category: "Bracelet", quantity: 18, unit: "pcs", value: 270_000, status: "In Stock", kind: "bracelet" },
  { id: 5, name: "Gold Chain", code: "GC-005", category: "Chain", quantity: 6, unit: "pcs", value: 120_000, status: "Low Stock", kind: "chain" },
  { id: 6, name: "Pendant", code: "PD-006", category: "Pendant", quantity: 0, unit: "pcs", value: 0, status: "Out of Stock", kind: "pendant" },
  { id: 7, name: "Bangle", code: "BG-007", category: "Bangle", quantity: 22, unit: "pcs", value: 310_000, status: "In Stock", kind: "bangle" },
  { id: 8, name: "Nose Pin", code: "NP-008", category: "Nose Pin", quantity: 15, unit: "pcs", value: 95_000, status: "In Stock", kind: "nose-pin" },
  { id: 9, name: "Diamond Ring", code: "DR-009", category: "Ring", quantity: 4, unit: "pcs", value: 160_000, status: "Low Stock", kind: "ring" },
  { id: 10, name: "Mangalsutra", code: "GM-010", category: "Necklace", quantity: 11, unit: "pcs", value: 240_000, status: "In Stock", kind: "necklace" },
];

const templates = [
  { name: "Classic Gold Necklace", prefix: "GN", category: "Necklace", kind: "necklace" },
  { name: "Solitaire Ring", prefix: "DR", category: "Ring", kind: "ring" },
  { name: "Diamond Drop Earring", prefix: "DE", category: "Earring", kind: "earring" },
  { name: "Heritage Bracelet", prefix: "GB", category: "Bracelet", kind: "bracelet" },
  { name: "Gold Link Chain", prefix: "GC", category: "Chain", kind: "chain" },
  { name: "Bridal Pendant", prefix: "PD", category: "Pendant", kind: "pendant" },
  { name: "Classic Bangle", prefix: "BG", category: "Bangle", kind: "bangle" },
  { name: "Gold Nose Pin", prefix: "NP", category: "Nose Pin", kind: "nose-pin" },
] as const;

export function stockStatusFor(quantity: number): StockViewStatus {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= 8) return "Low Stock";
  return "In Stock";
}

const generatedItems: StockViewItem[] = Array.from({ length: 335 }, (_, index) => {
  const id = index + 11;
  const template = templates[index % templates.length];
  const quantity = index < 9 ? (index % 8) + 1 : index < 13 ? 0 : 9 + (index % 24);

  return {
    id,
    name: template.name,
    code: `${template.prefix}-${String(id).padStart(3, "0")}`,
    category: template.category,
    quantity,
    unit: "pcs",
    value: quantity === 0 ? 0 : 18_000 + (id % 11) * 3_000,
    status: stockStatusFor(quantity),
    kind: template.kind,
  };
});

export const stockViewItems: StockViewItem[] = [...featuredItems, ...generatedItems];

export const stockViewCategories = [
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
