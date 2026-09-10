export type DueStatus = "Overdue" | "Due" | "Paid";
export type DueCustomer = { id: number; name: string; customerId: string; branch: string; totalPurchase: number; totalPaid: number; dueAmount: number; status: DueStatus };

const featuredDues: DueCustomer[] = [
  { id: 1, name: "Rahim Uddin", customerId: "C-000125", branch: "Main Branch", totalPurchase: 520_000, totalPaid: 320_000, dueAmount: 200_000, status: "Overdue" },
  { id: 2, name: "Nusrat Jahan", customerId: "C-000124", branch: "Uttara Branch", totalPurchase: 345_200, totalPaid: 245_200, dueAmount: 100_000, status: "Due" },
  { id: 3, name: "Tanvir Ahmed", customerId: "C-000123", branch: "Main Branch", totalPurchase: 280_500, totalPaid: 280_500, dueAmount: 0, status: "Paid" },
  { id: 4, name: "Farzana Akter", customerId: "C-000122", branch: "Chittagong Branch", totalPurchase: 195_000, totalPaid: 100_000, dueAmount: 95_000, status: "Due" },
  { id: 5, name: "Md. Selim", customerId: "C-000121", branch: "Main Branch", totalPurchase: 162_300, totalPaid: 162_300, dueAmount: 0, status: "Paid" },
  { id: 6, name: "Salma Begum", customerId: "C-000120", branch: "Sylhet Branch", totalPurchase: 125_000, totalPaid: 75_000, dueAmount: 50_000, status: "Overdue" },
  { id: 7, name: "Arif Hossain", customerId: "C-000119", branch: "Main Branch", totalPurchase: 98_500, totalPaid: 98_500, dueAmount: 0, status: "Paid" },
  { id: 8, name: "Laila Khan", customerId: "C-000118", branch: "Uttara Branch", totalPurchase: 75_200, totalPaid: 25_200, dueAmount: 50_000, status: "Due" },
  { id: 9, name: "Jahid Hasan", customerId: "C-000117", branch: "Main Branch", totalPurchase: 64_800, totalPaid: 64_800, dueAmount: 0, status: "Paid" },
  { id: 10, name: "Tamanna Akter", customerId: "C-000116", branch: "Khulna Branch", totalPurchase: 52_400, totalPaid: 10_000, dueAmount: 42_400, status: "Overdue" },
];

const generatedNames = ["Ayesha Rahman", "Samiul Islam", "Nafisa Ahmed", "Mehedi Hasan", "Rumana Karim", "Fahim Chowdhury"] as const;
const branches = ["Main Branch", "Uttara Branch", "Chittagong Branch", "Sylhet Branch", "Khulna Branch"] as const;
const generatedDues: DueCustomer[] = Array.from({ length: 132 }, (_, index) => {
  const totalPurchase = 45_000 + (index % 18) * 12_500;
  const dueAmount = index % 4 === 0 ? 0 : 10_000 + (index % 7) * 5_000;
  return { id: index + 11, name: generatedNames[index % generatedNames.length], customerId: `C-${String(115 - index).padStart(6, "0")}`, branch: branches[index % branches.length], totalPurchase, totalPaid: totalPurchase - dueAmount, dueAmount, status: dueAmount === 0 ? "Paid" : index % 5 === 0 ? "Overdue" : "Due" };
});

export const dueCustomers = [...featuredDues, ...generatedDues];
export const formatDueCurrency = (value: number) => `৳ ${new Intl.NumberFormat("en-IN").format(Math.max(0, Math.round(value)))}`;
