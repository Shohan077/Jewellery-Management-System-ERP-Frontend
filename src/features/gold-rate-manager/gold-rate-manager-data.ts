export type GoldType = "24K" | "22K" | "21K" | "18K";

export type ManagedGoldRate = {
  id: string;
  date: string;
  goldType: GoldType;
  notes: string;
  rate: number;
};

export const goldTypes: ReadonlyArray<GoldType> = ["24K", "22K", "21K", "18K"];

export const initialManagedRates: ReadonlyArray<ManagedGoldRate> = [
  { id: "rate-30-apr", date: "2025-04-30", goldType: "22K", notes: "Daily showroom gold rate", rate: 8420 },
  { id: "rate-29-apr", date: "2025-04-29", goldType: "22K", notes: "Daily showroom gold rate", rate: 8320 },
  { id: "rate-28-apr", date: "2025-04-28", goldType: "22K", notes: "Daily showroom gold rate", rate: 8270 },
  { id: "rate-27-apr", date: "2025-04-27", goldType: "22K", notes: "Daily showroom gold rate", rate: 8300 },
  { id: "rate-26-apr", date: "2025-04-26", goldType: "22K", notes: "Daily showroom gold rate", rate: 8180 },
  { id: "rate-25-apr", date: "2025-04-25", goldType: "22K", notes: "Daily showroom gold rate", rate: 8200 },
  { id: "rate-24-apr", date: "2025-04-24", goldType: "22K", notes: "Daily showroom gold rate", rate: 8310 },
];

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

export function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function sortManagedRates(rates: ReadonlyArray<ManagedGoldRate>) {
  return [...rates].sort((first, second) => second.date.localeCompare(first.date));
}
