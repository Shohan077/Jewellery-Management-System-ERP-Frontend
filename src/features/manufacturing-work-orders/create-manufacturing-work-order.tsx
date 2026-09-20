"use client";

import { useRouter } from "next/navigation";
import { RotateCcw, Save } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  isManufacturingWorkOrder,
  karigarOptions,
  priorities,
  productOptions,
  WORK_ORDER_STORAGE_EVENT,
  WORK_ORDER_STORAGE_KEY,
  workOrderStatuses,
  type ManufacturingWorkOrder,
  type WorkOrderPriority,
  type WorkOrderStatus,
} from "./manufacturing-work-order-data";
import styles from "./manufacturing-work-orders.module.css";

const initialForm = {
  orderNo: "MO-2025-001",
  orderDate: "2025-04-12",
  product: "Gold Ring (22K)",
  designNo: "DR-001",
  quantity: "10",
  unit: "Pcs" as "Pcs" | "Set",
  estimatedWeight: "50.000",
  karigar: "Mohammad Ali",
  expectedDate: "2025-04-20",
  priority: "Normal" as WorkOrderPriority,
  status: "Draft" as WorkOrderStatus,
  remarks: "",
};

export function CreateManufacturingWorkOrder() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  function resetForm() {
    setForm(initialForm);
    setMessage("Form reset to the original manufacturing order values.");
  }

  function selectProduct(productName: string) {
    const selected = productOptions.find((product) => product.name === productName);
    setForm((current) => ({
      ...current,
      product: productName,
      designNo: selected?.designNo ?? current.designNo,
    }));
    setMessage("");
  }

  function saveOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedProduct = productOptions.find((product) => product.name === form.product) ?? productOptions[0];
    const order: ManufacturingWorkOrder = {
      id: Date.now(),
      orderNo: form.orderNo.trim(),
      orderDate: form.orderDate,
      product: form.product,
      productKind: selectedProduct.kind,
      designNo: form.designNo.trim(),
      quantity: Number(form.quantity),
      unit: form.unit,
      estimatedWeight: Number(form.estimatedWeight),
      karigar: form.karigar,
      expectedDate: form.expectedDate,
      priority: form.priority,
      status: form.status,
      remarks: form.remarks.trim(),
    };

    if (!order.orderNo || !order.designNo || order.quantity < 1 || order.estimatedWeight <= 0) {
      setMessage("Enter a valid order number, design, quantity, and estimated weight.");
      return;
    }

    try {
      const existingValue = window.localStorage.getItem(WORK_ORDER_STORAGE_KEY);
      const parsed: unknown = existingValue ? JSON.parse(existingValue) : [];
      const existing = Array.isArray(parsed) ? parsed.filter(isManufacturingWorkOrder) : [];
      const next = [order, ...existing.filter((item) => item.orderNo !== order.orderNo)];
      window.localStorage.setItem(WORK_ORDER_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(WORK_ORDER_STORAGE_EVENT));
    } catch {
      // The route hand-off still works if storage is blocked by the browser.
    }

    router.push(`/manufacturing/work-orders?saved=${encodeURIComponent(order.orderNo)}`);
  }

  return (
    <form className={styles.createPage} onSubmit={saveOrder}>
      <header className={styles.createHeader}>
        <h1>Create Manufacturing Order</h1>
        <nav aria-label="Breadcrumb"><span>Manufacturing</span><b aria-hidden="true">›</b><span aria-current="page">Create Manufacturing Order</span></nav>
      </header>

      <Card className={styles.formCard}>
        <div className={styles.cardHeading}>
          <h2>Manufacturing Order Information</h2>
          <p>Create a new manufacturing order for jewellery production</p>
        </div>

        <div className={styles.formGrid}>
          <label>
            <span>Order No <b>*</b></span>
            <input className="field" onChange={(event) => setForm((current) => ({ ...current, orderNo: event.target.value }))} required value={form.orderNo} />
          </label>
          <label>
            <span>Order Date <b>*</b></span>
            <input className="field" onChange={(event) => setForm((current) => ({ ...current, orderDate: event.target.value }))} required type="date" value={form.orderDate} />
          </label>
          <label>
            <span>Product <b>*</b></span>
            <select className="select" onChange={(event) => selectProduct(event.target.value)} required value={form.product}>
              {productOptions.map((product) => <option key={product.name}>{product.name}</option>)}
            </select>
          </label>
          <label>
            <span>Design No</span>
            <input className="field" onChange={(event) => setForm((current) => ({ ...current, designNo: event.target.value }))} required value={form.designNo} />
          </label>
          <label>
            <span>Quantity <b>*</b></span>
            <span className={styles.splitField}>
              <input aria-label="Manufacturing quantity" min="1" onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))} required step="1" type="number" value={form.quantity} />
              <select aria-label="Quantity unit" onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value as "Pcs" | "Set" }))} value={form.unit}><option>Pcs</option><option>Set</option></select>
            </span>
          </label>
          <label>
            <span>Estimated Weight (Gram)</span>
            <input className="field" min="0.001" onChange={(event) => setForm((current) => ({ ...current, estimatedWeight: event.target.value }))} required step="0.001" type="number" value={form.estimatedWeight} />
          </label>
          <label>
            <span>Target Karigar <b>*</b></span>
            <select className="select" onChange={(event) => setForm((current) => ({ ...current, karigar: event.target.value }))} required value={form.karigar}>
              {karigarOptions.map((karigar) => <option key={karigar}>{karigar}</option>)}
            </select>
          </label>
          <label>
            <span>Expected Completion Date</span>
            <input className="field" min={form.orderDate} onChange={(event) => setForm((current) => ({ ...current, expectedDate: event.target.value }))} required type="date" value={form.expectedDate} />
          </label>
          <label>
            <span>Priority</span>
            <select className="select" onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as WorkOrderPriority }))} value={form.priority}>
              {priorities.map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select className="select" onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as WorkOrderStatus }))} value={form.status}>
              {workOrderStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className={styles.fullField}>
            <span>Remarks</span>
            <textarea className="textarea" onChange={(event) => setForm((current) => ({ ...current, remarks: event.target.value }))} placeholder="Enter remarks (optional)..." value={form.remarks} />
          </label>
        </div>

        <p aria-live="polite" className={message ? styles.formMessage : "sr-only"}>{message}</p>

        <footer className={styles.formActions}>
          <button className={`button ${styles.resetButton}`} onClick={resetForm} type="button"><RotateCcw aria-hidden="true" size={17} />Reset</button>
          <button className="button button--primary" type="submit"><Save aria-hidden="true" size={16} />Save Order</button>
        </footer>
      </Card>
    </form>
  );
}
