export type ProductionMaterialType = "Gold" | "Diamond" | "Other";

export type ProductionMaterialUnit = "gm" | "pcs";

export type ReturnedProductionMaterial = {
  id: string;
  materialType: ProductionMaterialType;
  itemName: string;
  purity: string;
  quantity: number;
  unit: ProductionMaterialUnit;
  remarks: string;
};

export type ProductionKarigar = {
  id: string;
  name: string;
  initials: string;
  phone: string;
};

export type ProductionOrder = {
  orderNo: string;
  itemName: string;
  assignedDate: string;
  expectedDate: string;
};

export type ProductionMaterialReturnRecord = {
  returnNo: string;
  returnDate: string;
  karigarId: string;
  productionOrder: string;
  remarks: string;
  materials: ReturnedProductionMaterial[];
  savedAt: string;
};

export const PRODUCTION_MATERIAL_RETURNS_STORAGE_KEY =
  "jewellery-manager:production-material-returns:v1";

export const productionKarigars: ProductionKarigar[] = [
  { id: "K-001", name: "Rahim Uddin", initials: "RU", phone: "01314-985298" },
  { id: "K-002", name: "Karim Ali", initials: "KA", phone: "01722-481056" },
  { id: "K-003", name: "Jamal Hossain", initials: "JH", phone: "01819-620417" },
  { id: "K-004", name: "Salim Khan", initials: "SK", phone: "01913-754802" },
];

export const productionOrders: ProductionOrder[] = [
  {
    orderNo: "PO-2025-001",
    itemName: "Gold Necklace",
    assignedDate: "10 Apr 2025",
    expectedDate: "20 Apr 2025",
  },
  {
    orderNo: "PO-2025-002",
    itemName: "Gold Ring",
    assignedDate: "12 Apr 2025",
    expectedDate: "22 Apr 2025",
  },
  {
    orderNo: "PO-2025-003",
    itemName: "Gold Bracelet",
    assignedDate: "15 Apr 2025",
    expectedDate: "25 Apr 2025",
  },
];

export const materialTypeOptions: ProductionMaterialType[] = [
  "Gold",
  "Diamond",
  "Other",
];

export const unitOptions: ProductionMaterialUnit[] = ["gm", "pcs"];

export const initialReturnedProductionMaterials: ReturnedProductionMaterial[] = [
  {
    id: "returned-production-material-1",
    materialType: "Gold",
    itemName: "Gold Sheet",
    purity: "22K (916)",
    quantity: 5.25,
    unit: "gm",
    remarks: "Unused material",
  },
  {
    id: "returned-production-material-2",
    materialType: "Diamond",
    itemName: "Round Diamond",
    purity: "VVS",
    quantity: 10,
    unit: "pcs",
    remarks: "Extra pieces",
  },
  {
    id: "returned-production-material-3",
    materialType: "Other",
    itemName: "Silver Alloy",
    purity: "N/A",
    quantity: 2.1,
    unit: "gm",
    remarks: "Not used",
  },
];

export function cloneInitialReturnedMaterials() {
  return initialReturnedProductionMaterials.map((material) => ({ ...material }));
}

export function isProductionMaterialReturnRecord(
  value: unknown,
): value is ProductionMaterialReturnRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ProductionMaterialReturnRecord>;
  return typeof record.returnNo === "string"
    && typeof record.returnDate === "string"
    && typeof record.karigarId === "string"
    && typeof record.productionOrder === "string"
    && typeof record.remarks === "string"
    && typeof record.savedAt === "string"
    && Array.isArray(record.materials);
}
