export type BarcodeItem = {
  code: string;
  name: string;
  type: "Gold Jewellery" | "Diamond Jewellery";
  category: string;
  weight: string;
};

export type GeneratedBarcode = BarcodeItem & {
  id: string;
  date: string;
  barcodeType: "Code 128" | "Code 39" | "EAN-13";
};

export type InvoiceSettings = {
  shopName: string;
  address: string;
  phone: string;
  email: string;
  invoicePrefix: string;
  startingNumber: string;
  invoiceLayout: "Standard" | "Modern" | "Compact" | "Thermal Print (Small)";
  showBarcode: boolean;
  showItemImage: boolean;
  showTerms: boolean;
};

export type InvoiceTemplateId = "standard" | "modern" | "compact" | "thermal";

export const barcodeItems: BarcodeItem[] = [
  { code: "GNK-2025-001", name: "Gold Necklace", type: "Gold Jewellery", category: "Necklace", weight: "12.500 gm" },
  { code: "GBR-2025-002", name: "Gold Bracelet", type: "Gold Jewellery", category: "Bracelet", weight: "8.320 gm" },
  { code: "GRI-2025-003", name: "Gold Ring", type: "Gold Jewellery", category: "Ring", weight: "3.250 gm" },
  { code: "DER-2025-004", name: "Diamond Ring", type: "Diamond Jewellery", category: "Ring", weight: "1.200 ct" },
  { code: "DPE-2025-005", name: "Diamond Pendant", type: "Diamond Jewellery", category: "Pendant", weight: "2.450 gm" },
  { code: "GBN-2025-006", name: "Gold Bangle", type: "Gold Jewellery", category: "Bangle", weight: "10.750 gm" },
];

export const initialGeneratedBarcodes: GeneratedBarcode[] = barcodeItems.slice(0, 4).map((item, index) => ({
  ...item,
  id: `barcode-${index + 1}`,
  date: index < 2 ? "16 Apr 2025" : "15 Apr 2025",
  barcodeType: "Code 128",
}));

export const defaultInvoiceSettings: InvoiceSettings = {
  shopName: "স্বর্ণ নিবেদন জুয়েলারী",
  address: "কুমিল্লা কান্দিরপাড়, কুমিল্লা",
  phone: "01314-986798",
  email: "info@jewellerymanager.com",
  invoicePrefix: "INV",
  startingNumber: "100001",
  invoiceLayout: "Standard",
  showBarcode: true,
  showItemImage: true,
  showTerms: true,
};

export const BARCODE_RECORDS_KEY = "jewellery-erp:barcode-invoice:records:v1";
export const INVOICE_SETTINGS_KEY = "jewellery-erp:barcode-invoice:settings:v1";
export const INVOICE_TEMPLATE_KEY = "jewellery-erp:barcode-invoice:template:v1";
export const BARCODE_INVOICE_EVENT = "jewellery-erp:barcode-invoice:change";

export const INITIAL_BARCODE_SNAPSHOT = JSON.stringify(initialGeneratedBarcodes);
export const INITIAL_SETTINGS_SNAPSHOT = JSON.stringify(defaultInvoiceSettings);

function notify() {
  window.dispatchEvent(new Event(BARCODE_INVOICE_EVENT));
}

export function subscribeBarcodeInvoice(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(BARCODE_INVOICE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(BARCODE_INVOICE_EVENT, onChange);
  };
}

export function getBarcodeSnapshot() {
  try {
    return window.localStorage.getItem(BARCODE_RECORDS_KEY) ?? INITIAL_BARCODE_SNAPSHOT;
  } catch {
    return INITIAL_BARCODE_SNAPSHOT;
  }
}

export function getSettingsSnapshot() {
  try {
    return window.localStorage.getItem(INVOICE_SETTINGS_KEY) ?? INITIAL_SETTINGS_SNAPSHOT;
  } catch {
    return INITIAL_SETTINGS_SNAPSHOT;
  }
}

export function getTemplateSnapshot(): InvoiceTemplateId {
  try {
    const value = window.localStorage.getItem(INVOICE_TEMPLATE_KEY);
    return value === "modern" || value === "compact" || value === "thermal" ? value : "standard";
  } catch {
    return "standard";
  }
}

export function parseBarcodeRecords(snapshot: string): GeneratedBarcode[] {
  try {
    const records: unknown = JSON.parse(snapshot);
    return Array.isArray(records) ? records as GeneratedBarcode[] : initialGeneratedBarcodes;
  } catch {
    return initialGeneratedBarcodes;
  }
}

export function parseInvoiceSettings(snapshot: string): InvoiceSettings {
  try {
    const settings: unknown = JSON.parse(snapshot);
    return settings && typeof settings === "object" ? { ...defaultInvoiceSettings, ...settings } : defaultInvoiceSettings;
  } catch {
    return defaultInvoiceSettings;
  }
}

export function persistBarcodeRecords(records: GeneratedBarcode[]) {
  window.localStorage.setItem(BARCODE_RECORDS_KEY, JSON.stringify(records));
  notify();
}

export function persistInvoiceSettings(settings: InvoiceSettings) {
  window.localStorage.setItem(INVOICE_SETTINGS_KEY, JSON.stringify(settings));
  notify();
}

export function persistInvoiceTemplate(template: InvoiceTemplateId) {
  window.localStorage.setItem(INVOICE_TEMPLATE_KEY, template);
  notify();
}

export const barcodeCategories = [...new Set(barcodeItems.map((item) => item.category))];

