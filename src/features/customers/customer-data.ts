export type CustomerStatus = "Active" | "Inactive";
export type CustomerGroup = "VIP" | "Regular" | "Wholesale";

export type Customer = {
  id: number;
  customerId: string;
  name: string;
  phone: string;
  email: string;
  totalPurchase: number;
  status: CustomerStatus;
  group: CustomerGroup;
  joinedThisMonth: boolean;
};

const featuredCustomers: Customer[] = [
  { id: 1, customerId: "C-000125", name: "Rahim Uddin", phone: "01712-345678", email: "rahimuddin@gmail.com", totalPurchase: 875_000, status: "Active", group: "VIP", joinedThisMonth: false },
  { id: 2, customerId: "C-000124", name: "Nusrat Jahan", phone: "01823-456789", email: "nusrat.jahan@gmail.com", totalPurchase: 520_000, status: "Active", group: "Regular", joinedThisMonth: false },
  { id: 3, customerId: "C-000123", name: "Tanvir Ahmed", phone: "01611-223344", email: "tanvir.ahmed@gmail.com", totalPurchase: 345_200, status: "Active", group: "Regular", joinedThisMonth: true },
  { id: 4, customerId: "C-000122", name: "Farzana Akter", phone: "01898-776655", email: "farzana.akter@gmail.com", totalPurchase: 280_500, status: "Active", group: "Regular", joinedThisMonth: false },
  { id: 5, customerId: "C-000121", name: "Md. Selim", phone: "01755-667788", email: "selim@gmail.com", totalPurchase: 195_000, status: "Active", group: "Wholesale", joinedThisMonth: false },
  { id: 6, customerId: "C-000120", name: "Salma Begum", phone: "01311-998877", email: "salma.begum@gmail.com", totalPurchase: 162_300, status: "Inactive", group: "Regular", joinedThisMonth: false },
  { id: 7, customerId: "C-000119", name: "Arif Hossain", phone: "01922-334455", email: "arif.hossain@gmail.com", totalPurchase: 125_000, status: "Active", group: "Regular", joinedThisMonth: false },
  { id: 8, customerId: "C-000118", name: "Laila Khan", phone: "01844-556677", email: "laila.khan@gmail.com", totalPurchase: 98_500, status: "Active", group: "VIP", joinedThisMonth: false },
  { id: 9, customerId: "C-000117", name: "Jahid Hasan", phone: "01677-889900", email: "jahid.hasan@gmail.com", totalPurchase: 75_200, status: "Active", group: "Regular", joinedThisMonth: false },
  { id: 10, customerId: "C-000116", name: "Tamanna Akter", phone: "01933-112233", email: "tamanna.akter@gmail.com", totalPurchase: 64_800, status: "Inactive", group: "Regular", joinedThisMonth: false },
];

const generatedNames = [
  "Ayesha Rahman",
  "Samiul Islam",
  "Nafisa Ahmed",
  "Mehedi Hasan",
  "Rumana Karim",
  "Fahim Chowdhury",
  "Sadika Noor",
  "Rafiq Uddin",
  "Mim Sultana",
  "Shakib Hossain",
];

const generatedCustomers = Array.from({ length: 1_973 }, (_, generatedIndex): Customer => {
  const id = featuredCustomers.length + generatedIndex + 1;
  const name = generatedNames[generatedIndex % generatedNames.length];
  const customerSequence = generatedIndex < 1_858 ? 1_983 - generatedIndex : 1_973 - generatedIndex;
  const status: CustomerStatus = generatedIndex < 1_642 ? "Active" : "Inactive";
  const group: CustomerGroup = generatedIndex < 208
    ? "VIP"
    : generatedIndex % 13 === 0
      ? "Wholesale"
      : "Regular";

  return {
    id,
    customerId: `C-${String(customerSequence).padStart(6, "0")}`,
    name,
    phone: `01${String(300_000_000 + generatedIndex).slice(-9)}`,
    email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
    totalPurchase: 35_000 + (generatedIndex % 24) * 27_500,
    status,
    group,
    joinedThisMonth: generatedIndex < 85,
  };
});

export const customers: Customer[] = [...featuredCustomers, ...generatedCustomers];

export const customerStats = {
  total: customers.length,
  active: customers.filter((customer) => customer.status === "Active").length,
  vip: customers.filter((customer) => customer.group === "VIP").length,
  newThisMonth: customers.filter((customer) => customer.joinedThisMonth).length,
};

export const recentPurchases = [
  { id: 1, date: "20 Apr 2025", invoiceNo: "S-000125", amount: 125_000 },
  { id: 2, date: "15 Mar 2025", invoiceNo: "S-000118", amount: 95_000 },
  { id: 3, date: "10 Feb 2025", invoiceNo: "S-000102", amount: 110_000 },
  { id: 4, date: "05 Jan 2025", invoiceNo: "S-000091", amount: 85_000 },
  { id: 5, date: "12 Dec 2024", invoiceNo: "S-000076", amount: 145_000 },
] as const;

export const purchaseTrend = [
  { month: "Nov", amount: 55_000 },
  { month: "Dec", amount: 65_000 },
  { month: "Jan", amount: 130_000 },
  { month: "Feb", amount: 70_000 },
  { month: "Mar", amount: 115_000 },
  { month: "Apr", amount: 165_000 },
] as const;

const currencyFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatCustomerCurrency(value: number) {
  return `৳ ${currencyFormatter.format(value)}`;
}

export function getCustomer(customerId: string) {
  return customers.find((customer) => customer.customerId === customerId) ?? featuredCustomers[0];
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
