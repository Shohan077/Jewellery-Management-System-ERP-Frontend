import type { Metadata } from "next";
import { NotificationSettings } from "@/features/reference-30/notification-settings";

export const metadata: Metadata = { title: "Notification Settings | Jewellery Manager" };
export default function NotificationSettingsPage() { return <NotificationSettings />; }
