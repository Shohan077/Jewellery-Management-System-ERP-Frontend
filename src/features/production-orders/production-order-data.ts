export const productionStatuses = ["Pending", "In Progress", "Completed", "Delayed"] as const;

export type ProductionStatus = (typeof productionStatuses)[number];

export type ProductionOrder = {
  id: number;
  orderNo: string;
  productName: string;
  karigar: string;
  quantity: number;
  startDate: string;
  dueDate: string;
  status: ProductionStatus;
};

export const productOptions = [
  "Gold Necklace",
  "Gold Ring",
  "Diamond Earring",
  "Gold Bracelet",
  "Gold Chain",
  "Pendant",
  "Bangle",
  "Nose Pin",
  "Diamond Ring",
  "Mangalsutra",
] as const;

export const karigarOptions = [
  "Abul Karim",
  "Salim Mia",
  "Rafiqul Islam",
  "Mizanur Rahman",
  "Harun Rashid",
  "Sultan Ahmed",
  "Nasir Uddin",
  "Jahid Hasan",
  "Karim Hossain",
  "Dafid Hossain",
] as const;

const featuredOrders: ProductionOrder[] = [
  { id: 1, orderNo: "PO-001", productName: "Gold Necklace", karigar: "Abul Karim", quantity: 5, startDate: "20 Apr 2025", dueDate: "25 Apr 2025", status: "Completed" },
  { id: 2, orderNo: "PO-002", productName: "Gold Ring", karigar: "Salim Mia", quantity: 10, startDate: "22 Apr 2025", dueDate: "28 Apr 2025", status: "In Progress" },
  { id: 3, orderNo: "PO-003", productName: "Diamond Earring", karigar: "Rafiqul Islam", quantity: 8, startDate: "23 Apr 2025", dueDate: "29 Apr 2025", status: "In Progress" },
  { id: 4, orderNo: "PO-004", productName: "Gold Bracelet", karigar: "Mizanur Rahman", quantity: 12, startDate: "24 Apr 2025", dueDate: "30 Apr 2025", status: "Delayed" },
  { id: 5, orderNo: "PO-005", productName: "Gold Chain", karigar: "Harun Rashid", quantity: 6, startDate: "25 Apr 2025", dueDate: "02 May 2025", status: "In Progress" },
  { id: 6, orderNo: "PO-006", productName: "Pendant", karigar: "Sultan Ahmed", quantity: 15, startDate: "26 Apr 2025", dueDate: "04 May 2025", status: "Pending" },
  { id: 7, orderNo: "PO-007", productName: "Bangle", karigar: "Nasir Uddin", quantity: 10, startDate: "27 Apr 2025", dueDate: "05 May 2025", status: "Pending" },
  { id: 8, orderNo: "PO-008", productName: "Nose Pin", karigar: "Jahid Hasan", quantity: 20, startDate: "28 Apr 2025", dueDate: "06 May 2025", status: "In Progress" },
  { id: 9, orderNo: "PO-009", productName: "Diamond Ring", karigar: "Karim Hossain", quantity: 4, startDate: "29 Apr 2025", dueDate: "07 May 2025", status: "Completed" },
  { id: 10, orderNo: "PO-010", productName: "Mangalsutra", karigar: "Dafid Hossain", quantity: 8, startDate: "30 Apr 2025", dueDate: "08 May 2025", status: "Pending" },
];

const monthNames = ["Jan", "Feb", "Mar", "Apr"];

function dateLabel(index: number, offset: number) {
  const ordinal = index + offset;
  const month = monthNames[Math.floor(ordinal / 24) % monthNames.length];
  const day = (ordinal % 24) + 1;
  return `${String(day).padStart(2, "0")} ${month} 2025`;
}

const remainingOrders: ProductionOrder[] = Array.from({ length: 38 }, (_, offset) => {
  const id = offset + 11;
  const status: ProductionStatus = id <= 28 ? "Completed" : id <= 43 ? "In Progress" : "Delayed";
  return {
    id,
    orderNo: `PO-${String(id).padStart(3, "0")}`,
    productName: productOptions[offset % productOptions.length],
    karigar: karigarOptions[(offset * 3) % karigarOptions.length],
    quantity: 3 + ((offset * 7) % 20),
    startDate: dateLabel(offset, 2),
    dueDate: dateLabel(offset, 9),
    status,
  };
});

export const initialProductionOrders: ProductionOrder[] = [...featuredOrders, ...remainingOrders];
