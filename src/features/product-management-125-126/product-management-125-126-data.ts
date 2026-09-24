export type CategoryStatus = "Active" | "Inactive";

export type ProductCategory = {
  id: number;
  name: string;
  description: string;
  subCategories: number;
  products: number;
  status: CategoryStatus;
};

export type ProductStatus = "Active" | "Inactive";

export type ManagedCatalogProduct = {
  id: number;
  code: string;
  name: string;
  category: string;
  karigar: string;
  weight: number;
  makingCharge: number;
  status: ProductStatus;
  kind: "necklace" | "ring" | "bracelet" | "earring" | "pendant" | "chain" | "set";
};

const categorySeed: Array<Omit<ProductCategory, "id">> = [
  { name: "Necklace", description: "All types of necklaces", subCategories: 8, products: 85, status: "Active" },
  { name: "Ring", description: "Gold, diamond and silver rings", subCategories: 6, products: 72, status: "Active" },
  { name: "Bracelet", description: "Bracelets and bangles", subCategories: 5, products: 48, status: "Active" },
  { name: "Earring", description: "All earring collections", subCategories: 6, products: 60, status: "Active" },
  { name: "Pendant", description: "Pendants and lockets", subCategories: 4, products: 38, status: "Active" },
  { name: "Chain", description: "Gold and silver chains", subCategories: 5, products: 42, status: "Active" },
  { name: "Bridal Set", description: "Complete bridal sets", subCategories: 3, products: 25, status: "Active" },
  { name: "Men's Collection", description: "Men's jewellery items", subCategories: 4, products: 28, status: "Active" },
  { name: "Kids Collection", description: "Kids and baby jewellery", subCategories: 3, products: 15, status: "Inactive" },
  { name: "Other", description: "Other jewellery items", subCategories: 4, products: 12, status: "Active" },
  { name: "Anklet", description: "Traditional and modern anklets", subCategories: 2, products: 8, status: "Inactive" },
  { name: "Nose Pin", description: "Nose pins and studs", subCategories: 2, products: 7, status: "Inactive" },
];

export const productCategories: ProductCategory[] = categorySeed.map((category, index) => ({ ...category, id: index + 1 }));

const featuredProducts: ManagedCatalogProduct[] = [
  { id: 1, code: "PRD-001", name: "Gold Necklace - Classic", category: "Necklace", karigar: "Rahim Uddin", weight: 25.5, makingCharge: 4500, status: "Active", kind: "necklace" },
  { id: 2, code: "PRD-002", name: "Diamond Ring - Solitaire", category: "Ring", karigar: "Karim Ali", weight: 5.2, makingCharge: 2800, status: "Active", kind: "ring" },
  { id: 3, code: "PRD-003", name: "Gold Bracelet - Elegant", category: "Bracelet", karigar: "Jamal Hossain", weight: 15, makingCharge: 3200, status: "Active", kind: "bracelet" },
  { id: 4, code: "PRD-004", name: "Diamond Earring - Stud", category: "Earring", karigar: "Salim Khan", weight: 4.8, makingCharge: 1500, status: "Active", kind: "earring" },
  { id: 5, code: "PRD-005", name: "Gold Pendant - Heart", category: "Pendant", karigar: "Rafiq Mia", weight: 3.2, makingCharge: 1200, status: "Active", kind: "pendant" },
  { id: 6, code: "PRD-006", name: "Gold Chain - 22K", category: "Chain", karigar: "Nusrat Jahan", weight: 18.5, makingCharge: 2500, status: "Active", kind: "chain" },
  { id: 7, code: "PRD-007", name: "Bridal Set - Premium", category: "Bridal Set", karigar: "Karim Ali", weight: 45, makingCharge: 8000, status: "Active", kind: "set" },
  { id: 8, code: "PRD-008", name: "Men's Ring - Classic", category: "Men's Collection", karigar: "Jamal Hossain", weight: 8.3, makingCharge: 2000, status: "Active", kind: "ring" },
];

const names = [
  "Royal Necklace", "Heritage Ring", "Temple Bracelet", "Classic Earring", "Floral Pendant", "Daily Chain", "Wedding Set", "Signet Ring",
] as const;
const categories = ["Necklace", "Ring", "Bracelet", "Earring", "Pendant", "Chain", "Bridal Set", "Men's Collection"] as const;
const karigars = ["Rahim Uddin", "Karim Ali", "Jamal Hossain", "Salim Khan", "Rafiq Mia", "Nusrat Jahan"] as const;
const kinds: ManagedCatalogProduct["kind"][] = ["necklace", "ring", "bracelet", "earring", "pendant", "chain", "set", "ring"];

export const catalogManagementProducts: ManagedCatalogProduct[] = Array.from({ length: 320 }, (_, index) => {
  if (index < featuredProducts.length) return featuredProducts[index];
  const id = index + 1;
  const category = categories[index % categories.length];
  return {
    id,
    code: `PRD-${String(id).padStart(3, "0")}`,
    name: `${names[index % names.length]} - ${["Classic", "Premium", "Elegant", "Heritage"][index % 4]}`,
    category,
    karigar: karigars[index % karigars.length],
    weight: Number((2.5 + (index % 44) * 0.75).toFixed(3)),
    makingCharge: 900 + (index % 16) * 350,
    status: id % 31 === 0 ? "Inactive" : "Active",
    kind: kinds[index % kinds.length],
  };
});

export const productCategoryOptions = ["All Categories", ...categories] as const;
export const productKarigarOptions = ["All Karigars", ...karigars] as const;
