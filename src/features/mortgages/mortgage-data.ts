export type MortgageCustomer = {
  id: string;
  name: string;
  phone: string;
};

export type MortgageFormState = {
  branch: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  description: string;
  dueDate: string;
  goldType: string;
  interestRate: string;
  loanAmount: string;
  purity: string;
  remarks: string;
  staff: string;
  unit: string;
  weight: string;
};

export const CURRENT_GOLD_RATE = 8_420;

export const initialCustomers: MortgageCustomer[] = [
  { id: "C-000125", name: "Rahim Uddin", phone: "01712-345678" },
  { id: "C-000124", name: "Nusrat Jahan", phone: "01823-456789" },
  { id: "C-000123", name: "Farzana Akter", phone: "01988-776655" },
  { id: "C-000122", name: "Tanvir Ahmed", phone: "01611-223344" },
];

export function createInitialMortgageForm(): MortgageFormState {
  return {
    branch: "Main Branch",
    customerId: initialCustomers[0].id,
    customerName: initialCustomers[0].name,
    customerPhone: initialCustomers[0].phone,
    description: "Gold Necklace with Locket",
    dueDate: "2025-05-30",
    goldType: "Gold Jewellery",
    interestRate: "2",
    loanAmount: "70000",
    purity: "22K",
    remarks: "Customer needs short term loan.",
    staff: "Admin User",
    unit: "gram",
    weight: "10.50",
  };
}

export function formatTaka(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `৳ ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(safeValue)}`;
}
