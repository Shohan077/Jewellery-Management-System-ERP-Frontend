export const finishedItemCategories = [
  "Necklace",
  "Ring",
  "Bracelet",
  "Pendant",
  "Earring",
] as const;

export const finishedItemStatuses = ["Ready", "QC Pending", "Stocked"] as const;
export const finishedItemMaterials = ["Gold", "Diamond", "Other"] as const;

export type FinishedItemCategory = (typeof finishedItemCategories)[number];
export type FinishedItemStatus = (typeof finishedItemStatuses)[number];
export type FinishedItemMaterial = (typeof finishedItemMaterials)[number];

export type FinishedItem = {
  id: string;
  itemCode: string;
  itemName: string;
  category: FinishedItemCategory;
  material: FinishedItemMaterial;
  weight: number;
  quantity: number;
  status: FinishedItemStatus;
  completionDate: string;
  productionValue: number;
};

export const finishedItemsSummary = {
  totalFinishedItems: 85,
  totalGoldWeight: 125.75,
  totalDiamonds: 320,
  totalProductionValue: 1_245_000,
} as const;

export const initialFinishedItems: FinishedItem[] = [
  {
    id: "finished-item-1",
    itemCode: "FI-2025-001",
    itemName: "Gold Necklace",
    category: "Necklace",
    material: "Gold",
    weight: 25.5,
    quantity: 2,
    status: "Ready",
    completionDate: "2025-04-15",
    productionValue: 315_000,
  },
  {
    id: "finished-item-2",
    itemCode: "FI-2025-002",
    itemName: "Gold Ring",
    category: "Ring",
    material: "Gold",
    weight: 5.2,
    quantity: 10,
    status: "Ready",
    completionDate: "2025-04-14",
    productionValue: 208_000,
  },
  {
    id: "finished-item-3",
    itemCode: "FI-2025-003",
    itemName: "Gold Bracelet",
    category: "Bracelet",
    material: "Gold",
    weight: 15,
    quantity: 5,
    status: "Ready",
    completionDate: "2025-04-12",
    productionValue: 275_000,
  },
  {
    id: "finished-item-4",
    itemCode: "FI-2025-004",
    itemName: "Diamond Pendant",
    category: "Pendant",
    material: "Diamond",
    weight: 8.75,
    quantity: 3,
    status: "Ready",
    completionDate: "2025-04-10",
    productionValue: 286_000,
  },
  {
    id: "finished-item-5",
    itemCode: "FI-2025-005",
    itemName: "Gold Earring",
    category: "Earring",
    material: "Gold",
    weight: 4.3,
    quantity: 12,
    status: "Ready",
    completionDate: "2025-04-08",
    productionValue: 161_000,
  },
];

export function formatFinishedItemDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatBdt(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}
