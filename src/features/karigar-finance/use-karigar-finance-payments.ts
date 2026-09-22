"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  KARIGAR_FINANCE_STORAGE_EVENT,
  KARIGAR_FINANCE_STORAGE_KEY,
  parseKarigarFinancePayments,
  type KarigarFinancePayment,
} from "./karigar-finance-data";

const EMPTY_SNAPSHOT = "[]";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(KARIGAR_FINANCE_STORAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(KARIGAR_FINANCE_STORAGE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(KARIGAR_FINANCE_STORAGE_KEY) ?? EMPTY_SNAPSHOT;
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

export function useKarigarFinancePayments() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_SNAPSHOT);
  return useMemo(() => parseKarigarFinancePayments(snapshot), [snapshot]);
}

export function persistKarigarFinancePayment(payment: KarigarFinancePayment) {
  try {
    const current = parseKarigarFinancePayments(
      window.localStorage.getItem(KARIGAR_FINANCE_STORAGE_KEY) ?? EMPTY_SNAPSHOT,
    );
    const next = [
      payment,
      ...current.filter((item) => item.paymentNo !== payment.paymentNo || item.karigarId !== payment.karigarId),
    ];
    window.localStorage.setItem(KARIGAR_FINANCE_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(KARIGAR_FINANCE_STORAGE_EVENT));
    return true;
  } catch {
    return false;
  }
}
