"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
  directorySuppliers,
  isPurchaseSupplier,
  managementSuppliers,
  type PurchaseSupplier,
} from "./supplier-data";

export type SupplierCollection = "directory" | "management";

const storageKeys: Record<SupplierCollection, string> = {
  directory: "jewellery-erp:purchase-supplier-directory:v1",
  management: "jewellery-erp:purchase-supplier-management:v1",
};

const storageEvents: Record<SupplierCollection, string> = {
  directory: "jewellery-erp:purchase-supplier-directory:change",
  management: "jewellery-erp:purchase-supplier-management:change",
};

const defaults: Record<SupplierCollection, PurchaseSupplier[]> = {
  directory: directorySuppliers,
  management: managementSuppliers,
};

const defaultSnapshots: Record<SupplierCollection, string> = {
  directory: JSON.stringify(directorySuppliers),
  management: JSON.stringify(managementSuppliers),
};

function parseSnapshot(snapshot: string, fallback: PurchaseSupplier[]) {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!Array.isArray(parsed)) return fallback;
    return parsed.filter(isPurchaseSupplier);
  } catch {
    return fallback;
  }
}

export function useSupplierStore(collection: SupplierCollection) {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKeys[collection]) onStoreChange();
    };
    const handleLocalChange = () => onStoreChange();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(storageEvents[collection], handleLocalChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(storageEvents[collection], handleLocalChange);
    };
  }, [collection]);

  const getSnapshot = useCallback(
    () => window.localStorage.getItem(storageKeys[collection]) ?? defaultSnapshots[collection],
    [collection],
  );
  const getServerSnapshot = useCallback(() => defaultSnapshots[collection], [collection]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const records = useMemo(() => parseSnapshot(snapshot, defaults[collection]), [collection, snapshot]);

  const saveRecords = useCallback((next: PurchaseSupplier[]) => {
    window.localStorage.setItem(storageKeys[collection], JSON.stringify(next));
    window.dispatchEvent(new Event(storageEvents[collection]));
  }, [collection]);

  return { records, saveRecords };
}
