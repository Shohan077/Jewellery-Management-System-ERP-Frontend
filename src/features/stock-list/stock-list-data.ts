export type StockListStatus = "In Stock" | "Low Stock" | "Out of Stock";
export type StockListItem = { id: number; code: string; name: string; category: "Gold Jewellery" | "Diamond Jewellery" | "Silver Jewellery"; purity: string; quantity: number; unit: "Gram" | "Pcs" | "Set"; status: StockListStatus };

const featuredStock: StockListItem[] = [
  { id: 1, code: "ITM-001", name: "Gold Chain", category: "Gold Jewellery", purity: "22K", quantity: 15.5, unit: "Gram", status: "In Stock" },
  { id: 2, code: "ITM-002", name: "Diamond Ring", category: "Diamond Jewellery", purity: "18K", quantity: 3, unit: "Pcs", status: "Low Stock" },
  { id: 3, code: "ITM-003", name: "Silver Bangle", category: "Silver Jewellery", purity: "925", quantity: 25, unit: "Gram", status: "In Stock" },
  { id: 4, code: "ITM-004", name: "Gold Pendant", category: "Gold Jewellery", purity: "21K", quantity: 0, unit: "Pcs", status: "Out of Stock" },
  { id: 5, code: "ITM-005", name: "Nose Pin", category: "Gold Jewellery", purity: "22K", quantity: 8.2, unit: "Gram", status: "In Stock" },
  { id: 6, code: "ITM-006", name: "Bracelet", category: "Gold Jewellery", purity: "18K", quantity: 2, unit: "Pcs", status: "Low Stock" },
  { id: 7, code: "ITM-007", name: "Earring", category: "Diamond Jewellery", purity: "18K", quantity: 6, unit: "Pcs", status: "In Stock" },
  { id: 8, code: "ITM-008", name: "Ring", category: "Gold Jewellery", purity: "22K", quantity: 12.5, unit: "Pcs", status: "In Stock" },
  { id: 9, code: "ITM-009", name: "Chain Set", category: "Gold Jewellery", purity: "21K", quantity: 1, unit: "Set", status: "Low Stock" },
  { id: 10, code: "ITM-010", name: "Anklet", category: "Silver Jewellery", purity: "925", quantity: 18, unit: "Pcs", status: "In Stock" },
];

const names = ["Gold Stud", "Diamond Pendant", "Silver Chain", "Gold Bangle", "Gemstone Ring", "Wedding Set"] as const;
const categories: StockListItem["category"][] = ["Gold Jewellery", "Diamond Jewellery", "Silver Jewellery"];
const units: StockListItem["unit"][] = ["Gram", "Pcs", "Set"];
const generatedStock: StockListItem[] = Array.from({ length: 117 }, (_, index) => {
  const quantity = index % 17 === 0 ? 0 : index % 7 === 0 ? 2 : 5 + (index % 21);
  return { id: index + 11, code: `ITM-${String(index + 11).padStart(3, "0")}`, name: names[index % names.length], category: categories[index % categories.length], purity: index % 3 === 2 ? "925" : index % 2 ? "18K" : "22K", quantity, unit: units[index % units.length], status: quantity === 0 ? "Out of Stock" : quantity <= 3 ? "Low Stock" : "In Stock" };
});

export const stockListItems = [...featuredStock, ...generatedStock];
