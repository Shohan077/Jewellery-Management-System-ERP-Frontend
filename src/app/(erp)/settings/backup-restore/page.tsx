import type { Metadata } from "next";
import { BackupRestore } from "@/features/admin-control-center/backup-restore";

export const metadata: Metadata = { title: "Backup & Restore | Jewellery Manager" };
export default function BackupRestorePage() { return <BackupRestore />; }
