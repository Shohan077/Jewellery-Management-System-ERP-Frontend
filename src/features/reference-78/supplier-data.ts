export type Supplier = {
  code: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  due: string;
  status: "Active" | "Inactive";
};

export const suppliers: Supplier[] = [
  { code: "SUP-0001", name: "Gold Palace", contact: "Mr. Imran Hossain", phone: "01711-223344", address: "Dhaka, Bangladesh", due: "1,58,750", status: "Active" },
  { code: "SUP-0002", name: "Shyamoli Jewellers", contact: "Mr. Shyamol Das", phone: "01819-445566", address: "Chattogram", due: "78,200", status: "Active" },
  { code: "SUP-0003", name: "Diamond World Ltd.", contact: "Mr. Rezaul Karim", phone: "01755-667788", address: "Dhaka, Bangladesh", due: "2,45,600", status: "Active" },
  { code: "SUP-0004", name: "Rahim Jewellers", contact: "Mr. Rahim Uddin", phone: "01922-334455", address: "Khulna", due: "35,450", status: "Inactive" },
  { code: "SUP-0005", name: "M/S Gold & Sons", contact: "Mr. Abdul Karim", phone: "01620-998877", address: "Rajshahi", due: "12,000", status: "Active" },
  { code: "SUP-0006", name: "Unique Ornaments", contact: "Mr. Tanvir Alam", phone: "01733-112233", address: "Sylhet", due: "0", status: "Active" },
  { code: "SUP-0007", name: "Bismillah Jewellers", contact: "Mr. Saleh Ahmed", phone: "01844-556677", address: "Barishal", due: "1,05,000", status: "Active" },
  { code: "SUP-0008", name: "New Gold House", contact: "Mr. Nayeem Khan", phone: "01788-665544", address: "Cumilla", due: "64,300", status: "Inactive" },
];

export const purchaseHistory = [
  ["PUR-2025-05-0012", "28 May 2025", "2,75,600", "1,16,850", "1,58,750", "Partial"],
  ["PUR-2025-05-0009", "20 May 2025", "4,85,200", "4,85,200", "0", "Paid"],
  ["PUR-2025-05-0004", "12 May 2025", "3,62,500", "3,62,500", "0", "Paid"],
  ["PUR-2025-04-0025", "28 Apr 2025", "2,98,750", "2,30,000", "68,750", "Partial"],
  ["PUR-2025-04-0011", "10 Apr 2025", "3,45,800", "3,45,800", "0", "Paid"],
] as const;
