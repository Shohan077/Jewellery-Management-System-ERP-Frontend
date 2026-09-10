export type GoldRateRecord = {
  date: string;
  rate: number;
  notes: string;
  updatedAt: string;
};

const historicalRates = [
  ["2025-04-01", 7580],
  ["2025-04-02", 7620],
  ["2025-04-03", 7640],
  ["2025-04-04", 7680],
  ["2025-04-05", 7730],
  ["2025-04-06", 7750],
  ["2025-04-07", 7790],
  ["2025-04-08", 7810],
  ["2025-04-09", 7860],
  ["2025-04-10", 7900],
  ["2025-04-11", 7930],
  ["2025-04-12", 7975],
  ["2025-04-13", 7960],
  ["2025-04-14", 7990],
  ["2025-04-15", 8020],
  ["2025-04-16", 8080],
  ["2025-04-17", 8060],
  ["2025-04-18", 8100],
  ["2025-04-19", 8120],
  ["2025-04-20", 8150],
  ["2025-04-21", 8180],
  ["2025-04-22", 8220],
  ["2025-04-23", 8270],
  ["2025-04-24", 8235],
  ["2025-04-25", 8325],
  ["2025-04-26", 8265],
  ["2025-04-27", 8290],
  ["2025-04-28", 8250],
  ["2025-04-29", 8320],
  ["2025-04-30", 8420],
] as const;

export const initialGoldRates: ReadonlyArray<GoldRateRecord> = historicalRates
  .map(([date, rate]) => ({
    date,
    rate,
    notes: "",
    updatedAt: date === "2025-04-30" ? "30 Apr 2025, 10:30 AM" : formatRateDate(date),
  }))
  .reverse();

export function formatRateDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatGoldRate(rate: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(rate);
}

export function calculateRateChange(currentRate: number, previousRate?: number) {
  if (!previousRate) {
    return 0;
  }

  return ((currentRate - previousRate) / previousRate) * 100;
}

export function sortRatesNewestFirst(rates: ReadonlyArray<GoldRateRecord>) {
  return [...rates].sort((first, second) => second.date.localeCompare(first.date));
}
