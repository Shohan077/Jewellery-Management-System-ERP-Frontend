export type SupplierStatus = "Active" | "Inactive";
export type SupplierCategory = "Gold" | "Diamond" | "Jewellery" | "Bullion";

export type SupplierRecord = {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  totalPurchase: number;
  dueAmount: number;
  status: SupplierStatus;
  category: SupplierCategory;
};

const featuredSuppliers: SupplierRecord[] = [
  { id: 1, name: "Ali Gold Traders", contactPerson: "Ali Hossain", phone: "01711-223344", totalPurchase: 7_520_000, dueAmount: 250_000, status: "Active", category: "Gold" },
  { id: 2, name: "Diamond House Ltd.", contactPerson: "Karim Uddin", phone: "01822-334455", totalPurchase: 6_230_000, dueAmount: 120_000, status: "Active", category: "Diamond" },
  { id: 3, name: "Rahman Jewellers", contactPerson: "Abdul Rahman", phone: "01611-446566", totalPurchase: 4_890_000, dueAmount: 0, status: "Active", category: "Jewellery" },
  { id: 4, name: "Gold Line BD", contactPerson: "Nizam Uddin", phone: "01933-556677", totalPurchase: 3_560_000, dueAmount: 520_000, status: "Active", category: "Gold" },
  { id: 5, name: "Diamond World", contactPerson: "Salim Khan", phone: "01844-667788", totalPurchase: 2_875_000, dueAmount: 180_000, status: "Active", category: "Diamond" },
  { id: 6, name: "M/S. Jewel Mart", contactPerson: "Jalal Uddin", phone: "01755-778899", totalPurchase: 2_540_000, dueAmount: 0, status: "Inactive", category: "Jewellery" },
  { id: 7, name: "Trust Gold Supply", contactPerson: "Rafique Islam", phone: "01677-889900", totalPurchase: 1_860_000, dueAmount: 230_000, status: "Active", category: "Gold" },
  { id: 8, name: "Prime Diamond", contactPerson: "Shahidul Alam", phone: "01988-990011", totalPurchase: 1_575_000, dueAmount: 0, status: "Active", category: "Diamond" },
  { id: 9, name: "Eastern Bullion", contactPerson: "Masud Rana", phone: "01811-112233", totalPurchase: 1_290_000, dueAmount: 110_000, status: "Active", category: "Bullion" },
  { id: 10, name: "Shine Metals Ltd.", contactPerson: "Tariq Ahmed", phone: "01766-334455", totalPurchase: 1_020_000, dueAmount: 0, status: "Active", category: "Bullion" },
];

const generatedNames = [
  "Bengal Gold House",
  "Dhaka Diamond Co.",
  "Royal Ornament Supply",
  "Sonar Bangla Traders",
  "Heritage Bullion",
  "Crown Jewellery Works",
  "Pearl & Stone Ltd.",
  "Golden Arc Supply",
];

const contactNames = [
  "Saiful Islam",
  "Mizanur Rahman",
  "Nusrat Karim",
  "Hasan Mahmud",
  "Farid Hossain",
  "Sadia Akter",
];

export const supplierCategories: SupplierCategory[] = ["Gold", "Diamond", "Jewellery", "Bullion"];

const generatedSuppliers = Array.from({ length: 290 }, (_, generatedIndex): SupplierRecord => {
  const id = featuredSuppliers.length + generatedIndex + 1;
  const category = supplierCategories[generatedIndex % supplierCategories.length];

  return {
    id,
    name: `${generatedNames[generatedIndex % generatedNames.length]} ${Math.floor(generatedIndex / generatedNames.length) + 1}`,
    contactPerson: contactNames[generatedIndex % contactNames.length],
    phone: `01${String(300_000_000 + generatedIndex).slice(-9)}`,
    totalPurchase: 360_000 + (generatedIndex % 24) * 92_500,
    dueAmount: generatedIndex % 4 === 0 ? 45_000 + (generatedIndex % 7) * 25_000 : 0,
    status: generatedIndex % 17 === 0 ? "Inactive" : "Active",
    category,
  };
});

export const suppliers: SupplierRecord[] = [...featuredSuppliers, ...generatedSuppliers];

export const supplierStats = {
  total: 320,
  active: 285,
  totalPurchase: 25_678_900,
  outstandingDue: 1_845_600,
} as const;

const currencyFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatSupplierCurrency(value: number) {
  return `\u09F3 ${currencyFormatter.format(value)}`;
}
