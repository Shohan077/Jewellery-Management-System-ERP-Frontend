export type SalesItem = {
  id: number;
  item: string;
  category: string;
  quantity: number;
  weight: string;
  sales: string;
  profit: string;
};

export const salesItems: readonly SalesItem[] = [
  { id: 1, item: "Gold Necklace", category: "Gold Jewellery", quantity: 158, weight: "325.250", sales: "৳ 68,50,000", profit: "৳ 16,25,000" },
  { id: 2, item: "Gold Chain (22K)", category: "Gold Jewellery", quantity: 210, weight: "410.500", sales: "৳ 45,20,000", profit: "৳ 10,85,000" },
  { id: 3, item: "Diamond Ring", category: "Diamond Jewellery", quantity: 95, weight: "48.120", sales: "৳ 28,40,000", profit: "৳ 8,40,000" },
  { id: 4, item: "Gold Earrings", category: "Gold Jewellery", quantity: 320, weight: "185.750", sales: "৳ 22,10,000", profit: "৳ 4,90,000" },
  { id: 5, item: "Silver Pendant", category: "Silver Jewellery", quantity: 410, weight: "210.300", sales: "৳ 10,30,000", profit: "৳ 2,05,000" },
];

export type CashTransaction = {
  id: number;
  date: string;
  voucher: string;
  particulars: string;
  type: "Receipt" | "Payment";
  paymentMode: "Cash" | "Card" | "Bank";
  receipt: string;
  payment: string;
  balance: string;
};

export const initialCashTransactions: readonly CashTransaction[] = [
  { id: 1, date: "01 May 2025", voucher: "RCPT-0001", particulars: "Cash Sales", type: "Receipt", paymentMode: "Cash", receipt: "38,500", payment: "—", balance: "5,87,250" },
  { id: 2, date: "01 May 2025", voucher: "RCPT-0002", particulars: "Gold Purchase", type: "Payment", paymentMode: "Cash", receipt: "—", payment: "1,25,000", balance: "4,62,250" },
  { id: 3, date: "02 May 2025", voucher: "RCPT-0003", particulars: "Customer Payment", type: "Receipt", paymentMode: "Cash", receipt: "75,000", payment: "—", balance: "5,37,250" },
  { id: 4, date: "03 May 2025", voucher: "PAY-0001", particulars: "Salary Payment", type: "Payment", paymentMode: "Cash", receipt: "—", payment: "55,000", balance: "4,82,250" },
  { id: 5, date: "04 May 2025", voucher: "RCPT-0004", particulars: "Old Gold Purchase", type: "Payment", paymentMode: "Cash", receipt: "—", payment: "1,10,000", balance: "3,72,250" },
  { id: 6, date: "05 May 2025", voucher: "RCPT-0005", particulars: "Diamond Sale", type: "Receipt", paymentMode: "Card", receipt: "2,40,000", payment: "—", balance: "6,12,250" },
  { id: 7, date: "06 May 2025", voucher: "PAY-0002", particulars: "Shop Expense", type: "Payment", paymentMode: "Cash", receipt: "—", payment: "38,200", balance: "5,74,050" },
  { id: 8, date: "07 May 2025", voucher: "RCPT-0006", particulars: "Cash Sales", type: "Receipt", paymentMode: "Cash", receipt: "46,300", payment: "—", balance: "6,20,350" },
];

export type LedgerTransaction = {
  id: number;
  date: string;
  voucher: string;
  particulars: string;
  debit: string;
  credit: string;
  balance: string;
  paymentMode: "Credit" | "Cash" | "Bank";
};

export const ledgerTransactions: readonly LedgerTransaction[] = [
  { id: 1, date: "01 May 2025", voucher: "INV-1001", particulars: "Sales Invoice", debit: "1,25,000", credit: "—", balance: "1,40,000 Dr", paymentMode: "Credit" },
  { id: 2, date: "05 May 2025", voucher: "RCPT-2001", particulars: "Payment Received", debit: "—", credit: "60,000", balance: "80,000 Dr", paymentMode: "Cash" },
  { id: 3, date: "10 May 2025", voucher: "INV-1003", particulars: "Sales Invoice", debit: "95,300", credit: "—", balance: "1,75,300 Dr", paymentMode: "Credit" },
  { id: 4, date: "15 May 2025", voucher: "RCPT-2002", particulars: "Payment Received", debit: "—", credit: "50,000", balance: "1,25,300 Dr", paymentMode: "Cash" },
  { id: 5, date: "20 May 2025", voucher: "INV-1005", particulars: "Sales Invoice", debit: "70,000", credit: "—", balance: "1,95,300 Dr", paymentMode: "Credit" },
  { id: 6, date: "25 May 2025", voucher: "RCPT-2003", particulars: "Payment Received", debit: "—", credit: "75,000", balance: "1,20,300 Dr", paymentMode: "Cash" },
  { id: 7, date: "28 May 2025", voucher: "INV-1007", particulars: "Sales Invoice", debit: "45,000", credit: "—", balance: "1,65,300 Dr", paymentMode: "Credit" },
  { id: 8, date: "31 May 2025", voucher: "RCPT-2004", particulars: "Payment Received", debit: "—", credit: "1,25,300", balance: "40,000 Dr", paymentMode: "Bank" },
];

export type UserRecord = {
  id: number;
  name: string;
  username: string;
  role: string;
  branch: string;
  status: "Active" | "Inactive";
  lastLogin: string;
};

export const initialUsers: readonly UserRecord[] = [
  { id: 1, name: "Abdul Karim", username: "abdul.karim", role: "Administrator", branch: "Head Office", status: "Active", lastLogin: "31 May 2025, 10:30 AM" },
  { id: 2, name: "Jalal Uddin", username: "jalal.uddin", role: "Manager", branch: "Head Office", status: "Active", lastLogin: "31 May 2025, 09:15 AM" },
  { id: 3, name: "Farhana Islam", username: "farhana.islam", role: "Sales Executive", branch: "Uttara Branch", status: "Active", lastLogin: "30 May 2025, 08:45 PM" },
  { id: 4, name: "Mehedi Hasan", username: "mehedi.hasan", role: "Accountant", branch: "Dhanmondi Branch", status: "Active", lastLogin: "31 May 2025, 11:20 AM" },
  { id: 5, name: "Sathi Akter", username: "sathi.akter", role: "Cashier", branch: "Mirpur Branch", status: "Active", lastLogin: "30 May 2025, 06:10 PM" },
  { id: 6, name: "Rafiqul Islam", username: "rafiqul.islam", role: "Sales Executive", branch: "Chattogram Branch", status: "Inactive", lastLogin: "—" },
  { id: 7, name: "Masud Rana", username: "masud.rana", role: "Store Incharge", branch: "Head Office", status: "Active", lastLogin: "31 May 2025, 07:50 AM" },
  { id: 8, name: "Shahida Akter", username: "shahida.akter", role: "Sales Executive", branch: "Sylhet Branch", status: "Active", lastLogin: "31 May 2025, 10:05 AM" },
];
