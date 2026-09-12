export type PosProduct = {
  id: string;
  name: string;
  code: string;
  purity: string;
  weight: number;
  rate: number;
};

export type PosCustomer = {
  id: string;
  name: string;
  phone: string;
  address: string;
};

export const posProductCatalog: PosProduct[] = [
  { id: "chain", name: "Gold Chain", code: "GC-005", purity: "22K", weight: 12, rate: 8_650 },
  { id: "bracelet", name: "Gold Bracelet", code: "GB-004", purity: "22K", weight: 8.75, rate: 8_650 },
  { id: "pendant", name: "Pendant", code: "PD-006", purity: "18K", weight: 4.2, rate: 6_800 },
  { id: "ring", name: "Gold Ring", code: "GR-002", purity: "22K", weight: 5.2, rate: 8_650 },
  { id: "earring", name: "Diamond Earring", code: "DE-003", purity: "18K", weight: 3.5, rate: 6_500 },
  { id: "necklace", name: "Gold Necklace", code: "GN-001", purity: "22K", weight: 10.5, rate: 8_650 },
];

export const initialPosProducts = posProductCatalog.slice(0, 3);

export const posCustomers: PosCustomer[] = [
  { id: "C-000125", name: "Rahim Uddin", phone: "01712-345678", address: "House 12, Road 5, Dhanmondi, Dhaka" },
  { id: "C-000124", name: "Nusrat Jahan", phone: "01823-456789", address: "Uttara, Dhaka" },
  { id: "C-000123", name: "Tanvir Ahmed", phone: "01611-223344", address: "Banani, Dhaka" },
  { id: "C-000122", name: "Farzana Akter", phone: "01898-776655", address: "Mirpur, Dhaka" },
];

export function getPosLineTotal(product: PosProduct) {
  return Math.round(product.weight * product.rate);
}

export function formatPosCurrency(value: number) {
  return `৳ ${Math.round(value).toLocaleString("en-IN")}`;
}
