export const SUPPLIER_PAYMENTS_STORAGE_KEY = "jewellery-erp:supplier-payments";
export const SUPPLIER_PAYMENT_EVENT = "jewellery-erp:supplier-payments-change";

export type PaymentAllocation = {
  invoiceNo: string;
  amount: number;
};

export type SupplierPaymentRecord = {
  id: string;
  supplier: string;
  referenceNo: string;
  date: string;
  method: string;
  amount: number;
  remarks: string;
  allocations: PaymentAllocation[];
};

export type LedgerRow = {
  id: string;
  date: string;
  type: "Opening Balance" | "Purchase" | "Payment";
  referenceNo: string;
  description: string;
  debit: number;
  credit: number;
};

export const suppliers = [
  "Shree Gems Suppliers",
  "Diamond World Ltd.",
  "Rahman Gold House",
  "Karim & Sons",
];

export const outstandingInvoices = [
  { invoiceNo: "PUR/2025/0123", invoiceDate: "05/05/2025", totalAmount: 50_000, paid: 20_000, due: 30_000, payment: 30_000 },
  { invoiceNo: "PUR/2025/0145", invoiceDate: "12/05/2025", totalAmount: 40_000, paid: 0, due: 40_000, payment: 40_000 },
  { invoiceNo: "PUR/2025/0162", invoiceDate: "16/05/2025", totalAmount: 25_000, paid: 0, due: 25_000, payment: 5_000 },
];

export const baseLedgerRows: LedgerRow[] = [
  { id: "opening-2025", date: "2025-04-01", type: "Opening Balance", referenceNo: "-", description: "Opening Balance", debit: 0, credit: 0 },
  { id: "purchase-0098", date: "2025-04-05", type: "Purchase", referenceNo: "PUR/2025/0098", description: "Purchase of Gold", debit: 150_000, credit: 0 },
  { id: "payment-0025", date: "2025-04-12", type: "Payment", referenceNo: "PAY/2025/0025", description: "Payment by Bank Transfer", debit: 0, credit: 80_000 },
  { id: "purchase-0112", date: "2025-04-20", type: "Purchase", referenceNo: "PUR/2025/0112", description: "Purchase of Diamond", debit: 200_000, credit: 0 },
  { id: "payment-0036", date: "2025-04-30", type: "Payment", referenceNo: "PAY/2025/0036", description: "Payment by Cheque", debit: 0, credit: 120_000 },
  { id: "purchase-0130", date: "2025-05-10", type: "Purchase", referenceNo: "PUR/2025/0130", description: "Purchase of Gold", debit: 130_000, credit: 0 },
  { id: "payment-0058", date: "2025-05-20", type: "Payment", referenceNo: "PAY/2025/0058", description: "Payment by Bank Transfer", debit: 0, credit: 75_000 },
];

export const defaultSupplierPayment: SupplierPaymentRecord = {
  id: "payment-0058",
  supplier: "Shree Gems Suppliers",
  referenceNo: "PAY/2025/0058",
  date: "2025-05-20",
  method: "Bank Transfer",
  amount: 75_000,
  remarks: "Payment against multiple invoices.",
  allocations: [
    { invoiceNo: "PUR/2025/0123", amount: 30_000 },
    { invoiceNo: "PUR/2025/0145", amount: 40_000 },
    { invoiceNo: "PUR/2025/0162", amount: 5_000 },
  ],
};

export function isSupplierPaymentRecord(value: unknown): value is SupplierPaymentRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<SupplierPaymentRecord>;
  return typeof record.id === "string"
    && typeof record.supplier === "string"
    && typeof record.referenceNo === "string"
    && typeof record.date === "string"
    && typeof record.method === "string"
    && typeof record.amount === "number"
    && typeof record.remarks === "string"
    && Array.isArray(record.allocations);
}

export function parseSavedPayments(snapshot: string): SupplierPaymentRecord[] {
  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value) ? value.filter(isSupplierPaymentRecord) : [];
  } catch {
    return [];
  }
}

export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatLedgerDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}
