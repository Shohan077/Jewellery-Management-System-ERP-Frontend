export type PurchaseSupplierStatus = "Active" | "Inactive";

export type PurchaseSupplier = {
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  address: string;
  dueAmount: number;
  status: PurchaseSupplierStatus;
};

export const directorySuppliers: PurchaseSupplier[] = [
  { code: "SUP-001", name: "Amin Jewellery Supply", contactPerson: "Md. Aminul Islam", phone: "01312-445566", email: "amin.supply@gmail.com", location: "Dhaka", address: "Chawk Bazar, Dhaka", dueAmount: 125_000, status: "Active" },
  { code: "SUP-002", name: "Rahman Gold House", contactPerson: "Abdur Rahman", phone: "01819-223344", email: "rahman@rgh.com", location: "Dhaka", address: "Mirpur, Dhaka", dueAmount: 0, status: "Active" },
  { code: "SUP-003", name: "Karim & Sons", contactPerson: "Md. Karim", phone: "01711-558677", email: "karim@ks.com", location: "Dhaka", address: "Uttara, Dhaka", dueAmount: 78_500, status: "Active" },
  { code: "SUP-004", name: "Diamond World Ltd.", contactPerson: "S. Akter", phone: "01988-776655", email: "info@dwl.com", location: "Dhaka", address: "Gulshan, Dhaka", dueAmount: 320_000, status: "Active" },
  { code: "SUP-005", name: "Beauty Gems", contactPerson: "Rafiqul Islam", phone: "01612-998877", email: "hello@beautygems.com", location: "Dhaka", address: "Bashundhara, Dhaka", dueAmount: 0, status: "Inactive" },
  { code: "SUP-006", name: "Shah Ali Traders", contactPerson: "Shah Ali", phone: "01815-667788", email: "accounts@shahali.com", location: "Sylhet", address: "Sylhet", dueAmount: 45_000, status: "Active" },
  { code: "SUP-007", name: "Gold Line BD", contactPerson: "Nizam Uddin", phone: "01755-334455", email: "sales@goldlinebd.com", location: "Chittagong", address: "Chittagong", dueAmount: 12_300, status: "Active" },
  { code: "SUP-008", name: "Royal Jewellery Ltd.", contactPerson: "Tanvir Ahmed", phone: "01966-112233", email: "office@royaljewellery.com", location: "Dhaka", address: "Dhanmondi, Dhaka", dueAmount: 0, status: "Active" },
];

export const managementSuppliers: PurchaseSupplier[] = [
  { code: "MGT-001", name: "Amin Jewellery Supply", contactPerson: "Aminul Islam", phone: "01312-445566", email: "amin@ajs.com", location: "Dhaka", address: "Chawk Bazar, Dhaka", dueAmount: 125_000, status: "Active" },
  { code: "MGT-002", name: "Diamond World Ltd.", contactPerson: "Rashid Karim", phone: "01811-223344", email: "info@dwl.com", location: "Chattogram", address: "Chattogram", dueAmount: 0, status: "Active" },
  { code: "MGT-003", name: "Rh-2025 Gold House", contactPerson: "Abdul Rahman", phone: "01755-667788", email: "rahman@rgh.com", location: "Dhaka", address: "Dhaka", dueAmount: 0, status: "Active" },
  { code: "MGT-004", name: "Karim & Sons", contactPerson: "Karim Uddin", phone: "01999-112233", email: "karim@ks.com", location: "Sylhet", address: "Sylhet", dueAmount: 78_500, status: "Active" },
  { code: "MGT-005", name: "Shine Metal Supply", contactPerson: "Salman Hossain", phone: "01622-334455", email: "shine@metal.com", location: "Khulna", address: "Khulna", dueAmount: 0, status: "Inactive" },
  { code: "MGT-006", name: "Brilliant Gems", contactPerson: "Nayeem Ahmed", phone: "01888-776655", email: "nayeem@bg.com", location: "Dhaka", address: "Dhaka", dueAmount: 0, status: "Active" },
  { code: "MGT-007", name: "Al-Noor Traders", contactPerson: "Fahim Rahman", phone: "01711-998877", email: "fahim@ant.com", location: "Rajshahi", address: "Rajshahi", dueAmount: 45_000, status: "Active" },
];

export type SupplierPurchaseHistory = {
  date: string;
  purchaseNo: string;
  totalAmount: number;
  payment: number;
  due: number;
};

export const aminPurchaseHistory: SupplierPurchaseHistory[] = [
  { date: "18 Apr 2025", purchaseNo: "PUR-2025-0142", totalAmount: 450_000, payment: 325_000, due: 125_000 },
  { date: "10 Apr 2025", purchaseNo: "PUR-2025-0138", totalAmount: 320_000, payment: 320_000, due: 0 },
  { date: "02 Apr 2025", purchaseNo: "PUR-2025-0131", totalAmount: 280_000, payment: 280_000, due: 0 },
  { date: "24 Mar 2025", purchaseNo: "PUR-2025-0126", totalAmount: 375_000, payment: 375_000, due: 0 },
];

export const aminSupplierProfile = {
  tagline: "Trusted Gold & Jewellery Material Supplier",
  tin: "123456789012",
  businessType: "Gold & Jewellery Material",
  remarks: "Regular supplier with good quality products",
  totalPurchase: 2_850_000,
  totalReturn: 95_300,
  totalPayment: 2_629_700,
  dueAmount: 125_000,
} as const;

const moneyFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatPurchaseSupplierMoney(value: number) {
  return `৳ ${moneyFormatter.format(value)}`;
}

export function isPurchaseSupplier(value: unknown): value is PurchaseSupplier {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PurchaseSupplier>;
  return typeof item.code === "string"
    && typeof item.name === "string"
    && typeof item.contactPerson === "string"
    && typeof item.phone === "string"
    && typeof item.email === "string"
    && typeof item.location === "string"
    && typeof item.address === "string"
    && typeof item.dueAmount === "number"
    && (item.status === "Active" || item.status === "Inactive");
}
