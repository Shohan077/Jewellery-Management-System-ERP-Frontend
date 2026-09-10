export type OldGoldCustomer = {
  id: string;
  name: string;
  phone: string;
};

export type GoldPurity = "18K" | "20K" | "21K" | "22K" | "24K";

export type OldGoldPurchaseState = {
  condition: string;
  customerId: string;
  description: string;
  grossWeight: string;
  itemType: string;
  netWeight: string;
  paymentAmount: string;
  paymentMethod: string;
  purity: GoldPurity;
  remarks: string;
};

export const CURRENT_GOLD_RATE = 8_420;
export const APPRAISAL_ADJUSTMENT = 500;

export const initialOldGoldCustomers: OldGoldCustomer[] = [
  { id: "C-000125", name: "Sabir Hossain", phone: "01712-345678" },
  { id: "C-000124", name: "Nusrat Jahan", phone: "01823-456789" },
  { id: "C-000123", name: "Rahim Uddin", phone: "01912-334455" },
  { id: "C-000122", name: "Farzana Akter", phone: "01611-223344" },
];

export const purityOptions: ReadonlyArray<GoldPurity> = ["18K", "20K", "21K", "22K", "24K"];

export function createInitialOldGoldPurchase(): OldGoldPurchaseState {
  return {
    condition: "Good",
    customerId: initialOldGoldCustomers[0].id,
    description: "Old gold chain with locket",
    grossWeight: "22.250",
    itemType: "Old Gold Jewellery",
    netWeight: "15.250",
    paymentAmount: "128905",
    paymentMethod: "Cash",
    purity: "22K",
    remarks: "Purchased from customer",
  };
}

function getKaratValue(purity: GoldPurity): number {
  return Number.parseInt(purity, 10);
}

export function calculateOldGoldValue(
  netWeightInput: string,
  grossWeightInput: string,
  purity: GoldPurity,
): number {
  const netWeight = Number.parseFloat(netWeightInput);
  const grossWeight = Number.parseFloat(grossWeightInput);
  const valuationWeight = Number.isFinite(netWeight) && netWeight > 0
    ? netWeight
    : Number.isFinite(grossWeight) && grossWeight > 0
      ? grossWeight
      : 0;
  const purityFactor = getKaratValue(purity) / 22;

  if (valuationWeight === 0) return 0;

  return Math.max(0, Math.round(valuationWeight * CURRENT_GOLD_RATE * purityFactor + APPRAISAL_ADJUSTMENT));
}

export function formatTaka(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `৳ ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(safeValue)}`;
}
