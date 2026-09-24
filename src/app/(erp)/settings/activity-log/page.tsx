import type { Metadata } from "next";
import { AdminActivityLog } from "@/features/admin-control-center/admin-activity-log";

export const metadata: Metadata = { title: "Activity Log | Jewellery Manager" };
export default function SettingsActivityLogPage() { return <AdminActivityLog />; }
