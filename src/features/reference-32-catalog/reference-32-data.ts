export type AttributeStatus = "Active" | "Inactive";

export type AttributeRecord = {
  id: number;
  name: string;
  group: string;
  inputType: "Dropdown" | "Number" | "Text" | "Yes / No";
  required: boolean;
  status: AttributeStatus;
};

export const attributeGroups = [
  { name: "General", count: 6 },
  { name: "Gold Specific", count: 4 },
  { name: "Diamond Specific", count: 4 },
  { name: "Design", count: 3 },
  { name: "Size & Dimension", count: 3 },
  { name: "Other", count: 2 },
] as const;

const attributeSeeds: Omit<AttributeRecord, "id">[] = [
  { name: "Metal Type", group: "General", inputType: "Dropdown", required: true, status: "Active" },
  { name: "Purity (Karat)", group: "Gold Specific", inputType: "Dropdown", required: true, status: "Active" },
  { name: "Weight (gm)", group: "General", inputType: "Number", required: true, status: "Active" },
  { name: "Stone Type", group: "Diamond Specific", inputType: "Dropdown", required: false, status: "Active" },
  { name: "Stone Weight (ct)", group: "Diamond Specific", inputType: "Number", required: false, status: "Active" },
  { name: "Color", group: "Design", inputType: "Dropdown", required: false, status: "Active" },
  { name: "Size", group: "Size & Dimension", inputType: "Text", required: false, status: "Active" },
  { name: "Certification", group: "Diamond Specific", inputType: "Dropdown", required: false, status: "Active" },
  { name: "Engraving", group: "Design", inputType: "Text", required: false, status: "Inactive" },
  { name: "SKU", group: "General", inputType: "Text", required: true, status: "Active" },
  { name: "Collection", group: "General", inputType: "Dropdown", required: false, status: "Active" },
  { name: "Making Charge", group: "Gold Specific", inputType: "Number", required: false, status: "Active" },
  { name: "Stone Count", group: "Diamond Specific", inputType: "Number", required: false, status: "Active" },
  { name: "Length", group: "Size & Dimension", inputType: "Number", required: false, status: "Active" },
  { name: "Width", group: "Size & Dimension", inputType: "Number", required: false, status: "Active" },
  { name: "Hallmark No.", group: "Gold Specific", inputType: "Text", required: false, status: "Active" },
  { name: "Occasion", group: "Other", inputType: "Dropdown", required: false, status: "Active" },
  { name: "Custom Note", group: "Other", inputType: "Text", required: false, status: "Active" },
];

export const attributeRecords: AttributeRecord[] = attributeSeeds.map((record, index) => ({
  ...record,
  id: index + 1,
  status: [8, 11, 14, 16].includes(index) ? "Inactive" : record.status,
}));

export type DesignStatus = "Active" | "In Production" | "Archived";
export type DesignIcon = "necklace" | "ring" | "earring" | "pendant" | "bracelet" | "chain";

export type DesignRecord = {
  id: number;
  code: string;
  name: string;
  category: string;
  status: DesignStatus;
  icon: DesignIcon;
};

export const designCategories = [
  { name: "Necklace Designs", count: 12 },
  { name: "Ring Designs", count: 10 },
  { name: "Earring Designs", count: 8 },
  { name: "Pendant Designs", count: 6 },
  { name: "Bracelet Designs", count: 8 },
  { name: "Chain Designs", count: 6 },
  { name: "Bridal Designs", count: 4 },
  { name: "Custom Designs", count: 2 },
] as const;

const designSeeds: Omit<DesignRecord, "id">[] = [
  { code: "DN-001", name: "Royal Necklace", category: "Necklace Designs", status: "Active", icon: "necklace" },
  { code: "DR-002", name: "Classic Ring", category: "Ring Designs", status: "Active", icon: "ring" },
  { code: "DE-003", name: "Flower Earring", category: "Earring Designs", status: "Active", icon: "earring" },
  { code: "DP-004", name: "Heart Pendant", category: "Pendant Designs", status: "Active", icon: "pendant" },
  { code: "DB-005", name: "Bridal Bangle", category: "Bracelet Designs", status: "In Production", icon: "bracelet" },
  { code: "DC-006", name: "Chain Pattern", category: "Chain Designs", status: "Active", icon: "chain" },
  { code: "DB-007", name: "Queen's Set", category: "Bridal Designs", status: "Active", icon: "necklace" },
  { code: "DR-008", name: "Men's Ring", category: "Custom Designs", status: "Archived", icon: "ring" },
];

export const designRecords: DesignRecord[] = Array.from({ length: 56 }, (_, index) => {
  const source = designSeeds[index % designSeeds.length];
  const batch = Math.floor(index / designSeeds.length);
  const status: DesignStatus = index < designSeeds.length
    ? source.status
    : index < designSeeds.length + 11
      ? "In Production"
      : index < designSeeds.length + 16
        ? "Archived"
        : "Active";
  return {
    ...source,
    id: index + 1,
    code: index < designSeeds.length ? source.code : `${source.code.slice(0, 2)}-${String(index + 1).padStart(3, "0")}`,
    name: index < designSeeds.length ? source.name : `${source.name} ${batch + 1}`,
    status,
  };
});

export const designStatusOptions = ["All Status", "Active", "In Production", "Archived"] as const;
