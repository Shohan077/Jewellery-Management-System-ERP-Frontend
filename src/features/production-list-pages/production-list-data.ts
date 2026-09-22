export type ProductionOrderStatus = "In Progress" | "Completed" | "On Hold";

export type ProductionOrderListItem = {
  id: number;
  orderNo: string;
  itemName: string;
  category: string;
  quantity: number;
  karigar: string;
  status: ProductionOrderStatus;
  orderDate: string;
  orderDateIso: string;
};

export const productionOrderStatuses = ["All", "In Progress", "Completed", "On Hold"] as const;
export const productionKarigars = ["All", "Rahim Uddin", "Karim Ali", "Jamal Hossain", "Salim Khan", "Rafiq Mia"] as const;

export const productionOrders: ProductionOrderListItem[] = [
  { id: 1, orderNo: "PO-2025-001", itemName: "Gold Necklace", category: "Necklace", quantity: 5, karigar: "Rahim Uddin", status: "In Progress", orderDate: "10 Apr 2025", orderDateIso: "2025-04-10" },
  { id: 2, orderNo: "PO-2025-002", itemName: "Gold Ring", category: "Ring", quantity: 10, karigar: "Karim Ali", status: "Completed", orderDate: "08 Apr 2025", orderDateIso: "2025-04-08" },
  { id: 3, orderNo: "PO-2025-003", itemName: "Gold Bracelet", category: "Bracelet", quantity: 8, karigar: "Jamal Hossain", status: "In Progress", orderDate: "07 Apr 2025", orderDateIso: "2025-04-07" },
  { id: 4, orderNo: "DO-2025-004", itemName: "Diamond Pendant", category: "Pendant", quantity: 3, karigar: "Salim Khan", status: "On Hold", orderDate: "05 Apr 2025", orderDateIso: "2025-04-05" },
  { id: 5, orderNo: "PO-2025-005", itemName: "Gold Earring", category: "Earring", quantity: 12, karigar: "Rafiq Mia", status: "Completed", orderDate: "02 Apr 2025", orderDateIso: "2025-04-02" },
];

export const productionSummary = [
  { label: "Total Orders", value: "12", tone: "blue" },
  { label: "In Progress", value: "6", tone: "amber" },
  { label: "Completed", value: "4", tone: "cyan" },
  { label: "On Hold", value: "2", tone: "indigo" },
] as const;

export type MaterialIssueStatus = "Issued" | "Pending" | "Returned";

export type MaterialIssueListItem = {
  id: number;
  issueNo: string;
  issueDate: string;
  issueDateIso: string;
  karigar: string;
  materialType: "Gold" | "Diamond" | "Silver" | "Stone";
  item: string;
  quantity: string;
  unit: "gm" | "pcs";
  status: MaterialIssueStatus;
};

export const materialIssueStatuses = ["All", "Issued", "Pending", "Returned"] as const;
export const materialIssueKarigars = ["All", "Rahim Uddin", "Karim Ali", "Jamal Hossain", "Salim Khan", "Rafiq Mia"] as const;

export const materialIssues: MaterialIssueListItem[] = [
  { id: 1, issueNo: "MI-2025-001", issueDate: "10 Apr 2025", issueDateIso: "2025-04-10", karigar: "Rahim Uddin", materialType: "Gold", item: "Gold Sheet", quantity: "25.000", unit: "gm", status: "Issued" },
  { id: 2, issueNo: "MI-2025-002", issueDate: "09 Apr 2025", issueDateIso: "2025-04-09", karigar: "Karim Ali", materialType: "Diamond", item: "Round Diamond", quantity: "50", unit: "pcs", status: "Issued" },
  { id: 3, issueNo: "MI-2025-003", issueDate: "08 Apr 2025", issueDateIso: "2025-04-08", karigar: "Jamal Hossain", materialType: "Gold", item: "Gold Wire", quantity: "12.500", unit: "pcs", status: "Pending" },
  { id: 4, issueNo: "MI-2025-004", issueDate: "06 Apr 2025", issueDateIso: "2025-04-06", karigar: "Salim Khan", materialType: "Silver", item: "Silver Alloy", quantity: "100.000", unit: "gm", status: "Returned" },
  { id: 5, issueNo: "MI-2025-005", issueDate: "05 Apr 2025", issueDateIso: "2025-04-05", karigar: "Rafiq Mia", materialType: "Stone", item: "Ruby Stone", quantity: "20", unit: "pcs", status: "Issued" },
];

export const materialIssueSummary = [
  { label: "Total Gold Issued", value: "48.250 gm", tone: "amber" },
  { label: "Total Diamond Issued", value: "120 pcs", tone: "cyan" },
  { label: "Other Materials", value: "25.500 gm", tone: "blue" },
  { label: "Total Issues", value: "18", tone: "indigo" },
] as const;

export const defaultListFilters = {
  fromDate: "2025-04-01",
  toDate: "2025-04-30",
  status: "All",
  karigar: "All",
};
