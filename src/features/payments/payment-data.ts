export type PaymentPartyType = "Customer" | "Supplier";
export type PaymentStatus = "Received" | "Paid";

export type PaymentParty = {
  id: string;
  name: string;
  invoices: string[];
};

export type PaymentRecord = {
  id: string;
  date: string;
  type: PaymentPartyType;
  partyId: string;
  partyName: string;
  invoiceNo: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  referenceNo: string;
  bankName: string;
  remarks: string;
};

export const paymentCustomers: PaymentParty[] = [
  { id: "C-000125", name: "Rahim Uddin", invoices: ["S-2025-00125"] },
  { id: "C-000124", name: "Nusrat Jahan", invoices: ["S-2025-00118"] },
  { id: "C-000123", name: "Tanvir Ahmed", invoices: ["S-2025-00110"] },
];

export const paymentSuppliers: PaymentParty[] = [
  { id: "S-00001", name: "Ali Gold Traders", invoices: ["P-2025-001"] },
  { id: "S-00005", name: "Diamond World", invoices: ["P-2025-004"] },
];

export const initialPayments: PaymentRecord[] = [
  {
    id: "PAY-2025-00125",
    date: "2025-04-30",
    type: "Customer",
    partyId: "C-000125",
    partyName: "Rahim Uddin",
    invoiceNo: "S-2025-00125",
    amount: 125300,
    method: "Bank",
    status: "Received",
    referenceNo: "TXN123456",
    bankName: "BRAC Bank",
    remarks: "Payment received against invoice S-2025-00125",
  },
  {
    id: "PAY-2025-00124",
    date: "2025-04-28",
    type: "Supplier",
    partyId: "S-00001",
    partyName: "Ali Gold Traders",
    invoiceNo: "P-2025-001",
    amount: 280000,
    method: "Cash",
    status: "Paid",
    referenceNo: "CASH-280425",
    bankName: "",
    remarks: "Supplier payment recorded.",
  },
  {
    id: "PAY-2025-00123",
    date: "2025-04-25",
    type: "Customer",
    partyId: "C-000124",
    partyName: "Nusrat Jahan",
    invoiceNo: "S-2025-00118",
    amount: 95000,
    method: "bKash",
    status: "Received",
    referenceNo: "BKASH-250425",
    bankName: "",
    remarks: "Customer payment received by bKash.",
  },
  {
    id: "PAY-2025-00122",
    date: "2025-04-22",
    type: "Customer",
    partyId: "C-000123",
    partyName: "Tanvir Ahmed",
    invoiceNo: "S-2025-00110",
    amount: 85000,
    method: "Cash",
    status: "Received",
    referenceNo: "CASH-220425",
    bankName: "",
    remarks: "Cash payment received.",
  },
  {
    id: "PAY-2025-00121",
    date: "2025-04-20",
    type: "Supplier",
    partyId: "S-00005",
    partyName: "Diamond World",
    invoiceNo: "P-2025-004",
    amount: 195000,
    method: "Bank",
    status: "Paid",
    referenceNo: "TXN200425",
    bankName: "City Bank",
    remarks: "Supplier invoice payment.",
  },
];

export function formatPaymentAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
}

export function formatPaymentDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}
