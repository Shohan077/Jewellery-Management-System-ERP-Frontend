export type SupplierStatementRow = {
  id: number;
  date: string;
  type: "Purchase" | "Payment";
  referenceNo: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

export const supplierOptions = [
  "Amin Jewellery Supply",
  "Diamond World Ltd.",
  "Rahman Gold House",
  "Karim & Sons",
];

export const aminSupplier = {
  name: "Amin Jewellery Supply",
  address: "Chawk Bazar, Dhaka",
  phone: "01312-445566",
  email: "amin.supply@gmail.com",
  status: "Active",
  openingBalance: 125_000,
  totalPurchase: 2_850_000,
  totalPayment: 2_629_700,
  closingBalance: 345_300,
} as const;

export const statementRows: SupplierStatementRow[] = [
  { id: 1, date: "2025-04-01", type: "Purchase", referenceNo: "PO-2025-0018", description: "Gold Purchase", debit: 450_000, credit: 0, balance: 575_000 },
  { id: 2, date: "2025-04-05", type: "Payment", referenceNo: "PAY-2025-0001", description: "Bank Transfer", debit: 0, credit: 325_000, balance: 250_000 },
  { id: 3, date: "2025-04-10", type: "Purchase", referenceNo: "PO-2025-0015", description: "Jewellery Items", debit: 620_000, credit: 0, balance: 870_000 },
  { id: 4, date: "2025-04-15", type: "Payment", referenceNo: "PAY-2025-0002", description: "Cash Payment", debit: 0, credit: 845_000, balance: 25_000 },
  { id: 5, date: "2025-04-18", type: "Purchase", referenceNo: "PO-2025-0019", description: "Gold Chain", debit: 320_000, credit: 0, balance: 345_300 },
];

const numberFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatStatementMoney(value: number) {
  return `\u09F3 ${numberFormatter.format(value)}`;
}

export function formatStatementDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
