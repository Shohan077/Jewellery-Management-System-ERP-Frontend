export const diamondShapes = [
  "Round",
  "Princess",
  "Oval",
  "Emerald",
  "Cushion",
  "Marquise",
  "Pear",
  "Radiant",
  "Heart",
  "Asscher",
] as const;

export const diamondColors = ["D", "E", "F", "G", "H", "I", "J"] as const;
export const diamondClarities = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"] as const;

export type DiamondShape = (typeof diamondShapes)[number];
export type DiamondColor = (typeof diamondColors)[number];
export type DiamondClarity = (typeof diamondClarities)[number];

export type DiamondRecord = {
  id: number;
  code: string;
  shape: DiamondShape;
  carat: number;
  color: DiamondColor;
  clarity: DiamondClarity;
  certificateNo: string;
  status: "Active";
  stock: number;
};

const featuredDiamonds: DiamondRecord[] = [
  { id: 1, code: "DM-001", shape: "Round", carat: 0.5, color: "D", clarity: "VVS1", certificateNo: "GIA123456", status: "Active", stock: 1 },
  { id: 2, code: "DM-002", shape: "Princess", carat: 1, color: "E", clarity: "VS1", certificateNo: "GIA123457", status: "Active", stock: 1 },
  { id: 3, code: "DM-003", shape: "Oval", carat: 0.75, color: "F", clarity: "VS2", certificateNo: "IGI765432", status: "Active", stock: 1 },
  { id: 4, code: "DM-004", shape: "Emerald", carat: 1.2, color: "G", clarity: "VVS2", certificateNo: "GIA789012", status: "Active", stock: 1 },
  { id: 5, code: "DM-005", shape: "Cushion", carat: 0.8, color: "E", clarity: "SI1", certificateNo: "IGI456789", status: "Active", stock: 1 },
  { id: 6, code: "DM-006", shape: "Marquise", carat: 0.6, color: "F", clarity: "VS1", certificateNo: "GIA321654", status: "Active", stock: 1 },
  { id: 7, code: "DM-007", shape: "Pear", carat: 1.5, color: "D", clarity: "VVS1", certificateNo: "GIA987654", status: "Active", stock: 1 },
  { id: 8, code: "DM-008", shape: "Radiant", carat: 1, color: "G", clarity: "SI2", certificateNo: "IGI147258", status: "Active", stock: 1 },
  { id: 9, code: "DM-009", shape: "Heart", carat: 0.3, color: "E", clarity: "VS2", certificateNo: "GIA369258", status: "Active", stock: 1 },
  { id: 10, code: "DM-010", shape: "Asscher", carat: 1.25, color: "F", clarity: "VS1", certificateNo: "IGI741852", status: "Active", stock: 1 },
];

const generatedDiamonds = Array.from({ length: 235 }, (_, generatedIndex): DiamondRecord => {
  const id = featuredDiamonds.length + generatedIndex + 1;
  const shape = diamondShapes[generatedIndex % diamondShapes.length];
  const color = diamondColors[(generatedIndex * 3) % diamondColors.length];
  const clarity = diamondClarities[(generatedIndex * 5) % diamondClarities.length];
  const certificatePrefix = generatedIndex % 3 === 0 ? "GIA" : "IGI";

  return {
    id,
    code: `DM-${String(id).padStart(3, "0")}`,
    shape,
    carat: Number((0.35 + (generatedIndex % 18) * 0.1).toFixed(2)),
    color,
    clarity,
    certificateNo: `${certificatePrefix}${String(500_000 + generatedIndex * 173).padStart(6, "0")}`,
    status: "Active",
    stock: 1 + (generatedIndex % 4),
  };
});

export const initialDiamonds: DiamondRecord[] = [...featuredDiamonds, ...generatedDiamonds];

export function formatCarat(carat: number) {
  return carat.toFixed(2);
}

