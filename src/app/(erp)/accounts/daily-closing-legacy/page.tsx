import type { Metadata } from "next";
import { DailyClosing } from "@/features/cash-management/daily-closing";
export const metadata: Metadata = { title: "Legacy Daily Closing" };
export default function Page() { return <DailyClosing />; }
