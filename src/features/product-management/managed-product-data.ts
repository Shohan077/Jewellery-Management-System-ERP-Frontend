export type ManagedProductStatus = "Active" | "Inactive";
export type ManagedProduct = { id: number; code: string; name: string; category: string; metalType: "Gold" | "Silver" | "Diamond"; purity: string; weight: number; salesPrice: number; status: ManagedProductStatus };

const featuredProducts: ManagedProduct[] = [
  { id: 1, code: "PRD-001", name: "Gold Chain", category: "Chain", metalType: "Gold", purity: "22K", weight: 10.5, salesPrice: 82_000, status: "Active" },
  { id: 2, code: "PRD-002", name: "Diamond Ring", category: "Ring", metalType: "Gold", purity: "18K", weight: 5.2, salesPrice: 125_000, status: "Active" },
  { id: 3, code: "PRD-003", name: "Gold Pendant", category: "Pendant", metalType: "Gold", purity: "21K", weight: 3.8, salesPrice: 45_000, status: "Active" },
  { id: 4, code: "PRD-004", name: "Silver Bangle", category: "Bangle", metalType: "Silver", purity: "925", weight: 12, salesPrice: 18_000, status: "Active" },
  { id: 5, code: "PRD-005", name: "Nose Pin", category: "Nose Pin", metalType: "Gold", purity: "22K", weight: 1.2, salesPrice: 12_500, status: "Active" },
  { id: 6, code: "PRD-006", name: "Bracelet", category: "Bracelet", metalType: "Gold", purity: "18K", weight: 8.5, salesPrice: 68_000, status: "Inactive" },
  { id: 7, code: "PRD-007", name: "Earring", category: "Earring", metalType: "Gold", purity: "22K", weight: 4.3, salesPrice: 38_000, status: "Active" },
  { id: 8, code: "PRD-008", name: "Chain Set", category: "Set", metalType: "Gold", purity: "21K", weight: 25, salesPrice: 210_000, status: "Active" },
  { id: 9, code: "PRD-009", name: "Anklet", category: "Anklet", metalType: "Silver", purity: "925", weight: 15.6, salesPrice: 22_000, status: "Active" },
  { id: 10, code: "PRD-010", name: "Locket", category: "Locket", metalType: "Gold", purity: "22K", weight: 6.8, salesPrice: 55_000, status: "Active" },
];

const generatedNames = ["Temple Necklace", "Cocktail Ring", "Pearl Earring", "Charm Bracelet", "Wedding Set", "Classic Locket"] as const;
const generatedProducts: ManagedProduct[] = Array.from({ length: 75 }, (_, index) => ({
  id: index + 11,
  code: `PRD-${String(index + 11).padStart(3, "0")}`,
  name: generatedNames[index % generatedNames.length],
  category: ["Necklace", "Ring", "Earring", "Bracelet", "Set", "Locket"][index % 6],
  metalType: index % 5 === 0 ? "Silver" : index % 7 === 0 ? "Diamond" : "Gold",
  purity: index % 5 === 0 ? "925" : index % 3 === 0 ? "18K" : "22K",
  weight: 2.5 + (index % 24) * 0.75,
  salesPrice: 22_000 + (index % 16) * 8_500,
  status: index % 14 === 0 ? "Inactive" : "Active",
}));

export const managedProducts = [...featuredProducts, ...generatedProducts];
