export type CustomerStatus = "Active" | "Inactive";

export type Customer = {
  code: string;
  name: string;
  phone: string;
  type: "Walk-in" | "Regular" | "VIP";
  due: string;
  status: CustomerStatus;
};

export const reference80Customers: Customer[] = [
  { code: "CUS-0001", name: "Walk-in Customer", phone: "—", type: "Walk-in", due: "0", status: "Active" },
  { code: "CUS-0002", name: "Rahim Hossain", phone: "01711-223344", type: "Regular", due: "1,58,750", status: "Active" },
  { code: "CUS-0003", name: "Abul Kalam", phone: "01819-445566", type: "Regular", due: "45,200", status: "Active" },
  { code: "CUS-0004", name: "Shahin Akter", phone: "01925-667788", type: "Regular", due: "0", status: "Inactive" },
  { code: "CUS-0005", name: "Mst. Jannatul", phone: "01733-998877", type: "Regular", due: "12,600", status: "Active" },
  { code: "CUS-0006", name: "Mizanur Rahman", phone: "01620-123456", type: "VIP", due: "2,45,300", status: "Active" },
  { code: "CUS-0007", name: "Sharmin Sultana", phone: "01844-556677", type: "Regular", due: "0", status: "Inactive" },
  { code: "CUS-0008", name: "Sakib Ahmed", phone: "01786-665544", type: "Regular", due: "36,850", status: "Active" },
];

export const reference80PurchaseHistory = [
  ["INV-2025-05-0012", "28 May 2025", "1,75,600", "1,16,850", "58,750", "Partial"],
  ["INV-2025-05-0009", "20 May 2025", "2,45,200", "2,00,000", "45,200", "Partial"],
  ["INV-2025-05-0003", "12 May 2025", "1,66,200", "1,11,150", "55,050", "Partial"],
  ["INV-2025-04-0021", "22 Apr 2025", "62,750", "0", "62,750", "Due"],
] as const;
