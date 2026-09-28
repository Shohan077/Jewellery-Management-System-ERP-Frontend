export const dashboardTransactions = [
  { invoice: "INV-250530-001", type: "22K", party: "Walk-in Customer", date: "30 May 2025", amount: "85,500", status: "Completed" },
  { invoice: "INV-250530-002", type: "Sale", party: "Rahim Jewelry", date: "30 May 2025", amount: "45,200", status: "Completed" },
  { invoice: "PUR-250530-001", type: "Purchase", party: "Gold Palace", date: "30 May 2025", amount: "2,35,000", status: "Completed" },
  { invoice: "INV-250529-005", type: "Sale", party: "Walk-in Customer", date: "29 May 2025", amount: "32,100", status: "Completed" },
  { invoice: "INV-250529-004", type: "Sale", party: "Sunshine Jewellers", date: "29 May 2025", amount: "67,800", status: "Completed" },
] as const;

export const topCustomers = [
  { name: "Sunshine Jewellers", amount: "2,45,000", initial: "S" },
  { name: "Rahim Jewelry", amount: "1,85,600", initial: "R" },
  { name: "Walk-in Customer", amount: "1,50,300", initial: "W" },
  { name: "Gold & More", amount: "1,25,400", initial: "G" },
  { name: "Premium Customer", amount: "1,10,200", initial: "P" },
] as const;

export type CartItem = {
  id: number;
  name: string;
  purity: string;
  weight: number;
  rate: number;
  makingPercent: number;
  amount: number;
};

export const cartSeed: CartItem[] = [
  { id: 1, name: "Gold Necklace", purity: "22K", weight: 25, rate: 11550, makingPercent: 12, amount: 324600 },
  { id: 2, name: "Gold Ring", purity: "22K", weight: 5, rate: 11550, makingPercent: 10, amount: 64050 },
  { id: 3, name: "Gold Earrings", purity: "22K", weight: 7, rate: 11550, makingPercent: 10, amount: 89100 },
];

export type GoldLot = {
  id: number;
  lot: string;
  purity: string;
  form: string;
  weight: string;
  rate: string;
  total: string;
  ref: string;
  date: string;
};

export const goldLots: GoldLot[] = [
  { id: 1, lot: "LOT-250530-001", purity: "22K", form: "Bar", weight: "500.000", rate: "11,550", total: "57,75,000", ref: "REF-001", date: "30 May 2025" },
  { id: 2, lot: "LOT-250530-002", purity: "22K", form: "Coin", weight: "250.000", rate: "11,550", total: "28,87,500", ref: "REF-002", date: "30 May 2025" },
  { id: 3, lot: "LOR-250529-001", purity: "18K", form: "Bar", weight: "300.000", rate: "9,450", total: "28,35,000", ref: "REF-003", date: "29 May 2025" },
  { id: 4, lot: "LOT-250529-002", purity: "22K", form: "Bar", weight: "400.000", rate: "11,480", total: "45,92,000", ref: "REF-004", date: "29 May 2025" },
  { id: 5, lot: "LOT-250528-001", purity: "24K", form: "Bar", weight: "200.000", rate: "12,350", total: "24,70,000", ref: "REF-005", date: "28 May 2025" },
  { id: 6, lot: "LOT-250528-002", purity: "22K", form: "Coin", weight: "150.000", rate: "11,400", total: "17,10,000", ref: "REF-006", date: "28 May 2025" },
  { id: 7, lot: "LOT-250527-001", purity: "18K", form: "Bar", weight: "100.000", rate: "9,300", total: "9,30,000", ref: "REF-007", date: "27 May 2025" },
];

export type SalesRow = {
  id: number;
  date: string;
  invoice: string;
  customer: string;
  category: string;
  weight: string;
  amount: string;
  payment: string;
};

export const salesRows: SalesRow[] = [
  { id: 1, date: "31 May 2025", invoice: "INV-250531-001", customer: "Sunshine Jewellers", category: "Gold Jewellery", weight: "25.000", amount: "3,24,600", payment: "Cash" },
  { id: 2, date: "30 May 2025", invoice: "INV-250530-002", customer: "Walk-in Customer", category: "Gold Jewellery", weight: "12.500", amount: "1,58,200", payment: "Card" },
  { id: 3, date: "30 May 2025", invoice: "PUR-250530-001", customer: "Rahim Jewelry", category: "Diamond Jewellery", weight: "8.000", amount: "1,92,000", payment: "bKash" },
  { id: 4, date: "29 May 2025", invoice: "INV-250529-004", customer: "Premium Customer", category: "Gold Jewellery", weight: "15.000", amount: "1,92,750", payment: "Cash" },
  { id: 5, date: "29 May 2025", invoice: "INV-250529-003", customer: "Gold & More", category: "Gold Jewellery", weight: "9.500", amount: "1,20,450", payment: "Nagad" },
];

export const dashboardCategories = [
  { color: "#1769df", label: "Gold Jewellery", value: 60 },
  { color: "#4d8ce5", label: "Diamond Jewellery", value: 20 },
  { color: "#8fb7eb", label: "Silver Jewellery", value: 10 },
  { color: "#8093b3", label: "Others", value: 10 },
] as const;
