export const WORK_ORDER_STORAGE_KEY = "jewellery-erp.manufacturing-work-orders";

export const workOrderStatuses = ["Draft", "Pending", "In Progress", "On Hold", "Completed"] as const;
export type WorkOrderStatus = (typeof workOrderStatuses)[number];

export const priorities = ["Low", "Normal", "High", "Urgent"] as const;
export type WorkOrderPriority = (typeof priorities)[number];

export const productOptions = [
  { name: "Gold Ring (22K)", designNo: "DR-001", kind: "ring" },
  { name: "Gold Necklace (22K)", designNo: "DR-002", kind: "necklace" },
  { name: "Gold Bangle (22K)", designNo: "DR-003", kind: "ring" },
  { name: "Diamond Ring (18K)", designNo: "DR-004", kind: "diamond" },
  { name: "Gold Chain (22K)", designNo: "DR-005", kind: "chain" },
  { name: "Gold Earrings (22K)", designNo: "DR-006", kind: "earrings" },
  { name: "Gold Pendant (22K)", designNo: "DR-007", kind: "pendant" },
  { name: "Gold Bracelet (22K)", designNo: "DR-008", kind: "bracelet" },
] as const;

export type ProductKind = (typeof productOptions)[number]["kind"];

export const karigarOptions = [
  "Mohammad Ali",
  "Rafiq Islam",
  "Kalim Uddin",
  "Jabbar Hossain",
  "Selim Mia",
  "Rahin Khan",
  "Abdul Karim",
  "Nasir Uddin",
] as const;

export type ManufacturingWorkOrder = {
  id: number;
  orderNo: string;
  orderDate: string;
  product: string;
  productKind: ProductKind;
  designNo: string;
  quantity: number;
  unit: "Pcs" | "Set";
  estimatedWeight: number;
  karigar: string;
  expectedDate: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  remarks: string;
};

const featuredWorkOrders: ManufacturingWorkOrder[] = [
  { id: 1, orderNo: "MO-2025-001", orderDate: "2025-04-01", product: "Gold Ring (22K)", productKind: "ring", designNo: "DR-001", quantity: 10, unit: "Pcs", estimatedWeight: 50, karigar: "Mohammad Ali", expectedDate: "2025-04-10", priority: "Normal", status: "In Progress", remarks: "Ring production for the April collection." },
  { id: 2, orderNo: "MO-2025-002", orderDate: "2025-03-28", product: "Gold Necklace (22K)", productKind: "necklace", designNo: "DR-002", quantity: 5, unit: "Pcs", estimatedWeight: 82.5, karigar: "Rafiq Islam", expectedDate: "2025-04-08", priority: "High", status: "Completed", remarks: "Necklace production batch." },
  { id: 3, orderNo: "MO-2025-003", orderDate: "2025-04-05", product: "Gold Bangle (22K)", productKind: "ring", designNo: "DR-003", quantity: 8, unit: "Pcs", estimatedWeight: 64, karigar: "Kalim Uddin", expectedDate: "2025-04-15", priority: "Normal", status: "In Progress", remarks: "Bangle batch for showroom stock." },
  { id: 4, orderNo: "MO-2025-004", orderDate: "2025-04-06", product: "Diamond Ring (18K)", productKind: "diamond", designNo: "DR-004", quantity: 3, unit: "Pcs", estimatedWeight: 15.75, karigar: "Jabbar Hossain", expectedDate: "2025-04-14", priority: "High", status: "On Hold", remarks: "Awaiting stone approval." },
  { id: 5, orderNo: "MO-2025-005", orderDate: "2025-04-03", product: "Gold Chain (22K)", productKind: "chain", designNo: "DR-005", quantity: 12, unit: "Pcs", estimatedWeight: 90, karigar: "Selim Mia", expectedDate: "2025-04-14", priority: "Normal", status: "Pending", remarks: "Standard chain batch." },
  { id: 6, orderNo: "MO-2025-006", orderDate: "2025-04-02", product: "Gold Earrings (22K)", productKind: "earrings", designNo: "DR-006", quantity: 12, unit: "Pcs", estimatedWeight: 45.25, karigar: "Rahin Khan", expectedDate: "2025-04-14", priority: "Normal", status: "Completed", remarks: "Earrings production batch." },
  { id: 7, orderNo: "MO-2025-007", orderDate: "2025-04-01", product: "Gold Pendant (22K)", productKind: "pendant", designNo: "DR-007", quantity: 20, unit: "Pcs", estimatedWeight: 58.5, karigar: "Kalim Uddin", expectedDate: "2025-04-18", priority: "Normal", status: "In Progress", remarks: "Pendant batch for branch distribution." },
];

function isoDateFromDayOffset(offset: number) {
  const date = new Date(Date.UTC(2025, 2, 1 + offset));
  return date.toISOString().slice(0, 10);
}

const generatedWorkOrders: ManufacturingWorkOrder[] = Array.from({ length: 118 }, (_, offset) => {
  const id = offset + 8;
  const product = productOptions[offset % productOptions.length];
  const statusCycle: WorkOrderStatus[] = ["Pending", "In Progress", "Completed", "In Progress", "On Hold"];
  return {
    id,
    orderNo: `MO-2025-${String(id).padStart(3, "0")}`,
    orderDate: isoDateFromDayOffset((offset * 3) % 88),
    product: product.name,
    productKind: product.kind,
    designNo: `DR-${String(id).padStart(3, "0")}`,
    quantity: 2 + ((offset * 7) % 22),
    unit: offset % 11 === 0 ? "Set" : "Pcs",
    estimatedWeight: Number((12.5 + ((offset * 7.35) % 110)).toFixed(3)),
    karigar: karigarOptions[(offset * 3) % karigarOptions.length],
    expectedDate: isoDateFromDayOffset(((offset * 3) % 88) + 9),
    priority: priorities[offset % priorities.length],
    status: statusCycle[offset % statusCycle.length],
    remarks: "Scheduled manufacturing order.",
  };
});

export const initialManufacturingWorkOrders: ManufacturingWorkOrder[] = [
  ...featuredWorkOrders,
  ...generatedWorkOrders,
];

export function formatWorkOrderDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function isManufacturingWorkOrder(value: unknown): value is ManufacturingWorkOrder {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ManufacturingWorkOrder>;
  return typeof record.orderNo === "string"
    && typeof record.product === "string"
    && typeof record.designNo === "string"
    && typeof record.orderDate === "string"
    && typeof record.expectedDate === "string";
}
