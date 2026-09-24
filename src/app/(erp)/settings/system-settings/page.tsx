import type { Metadata } from "next";
import { SystemControlSettings } from "@/features/admin-control-center/system-control-settings";

export const metadata: Metadata = { title: "System Settings | Jewellery Manager" };
export default function SystemControlSettingsPage() { return <SystemControlSettings />; }
