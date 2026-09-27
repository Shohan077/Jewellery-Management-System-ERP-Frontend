"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Gem,
  Save,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import styles from "./create-production-order.module.css";

type OrderForm = {
  orderNo: string;
  branch: string;
  productType: string;
  designCode: string;
  purity: string;
  estimatedWeight: string;
  karigar: string;
  deliveryDate: string;
  priority: string;
  notes: string;
};

const initialOrder: OrderForm = {
  orderNo: "PO-2505-008",
  branch: "Chennai Main",
  productType: "Necklace",
  designCode: "NKC-0258",
  purity: "916 Hallmark",
  estimatedWeight: "25.500",
  karigar: "Ramesh Kumar",
  deliveryDate: "2025-05-28",
  priority: "High",
  notes: "Customer order for wedding collection.\nSpecial finishing required.",
};

type FieldProps = {
  children: ReactNode;
  label: string;
  required?: boolean;
  wide?: boolean;
};

function Field({ children, label, required = false, wide = false }: FieldProps) {
  return (
    <label className={`${styles.field} ${wide ? styles.wideField : ""}`}>
      <span>{label}{required ? <b aria-hidden="true">*</b> : null}</span>
      {children}
    </label>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);
}

function SummaryRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`${styles.summaryRow} ${accent ? styles.accentRow : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function CreateProductionOrder190() {
  const [order, setOrder] = useState<OrderForm>(initialOrder);
  const [message, setMessage] = useState("");

  const totals = useMemo(() => {
    const weight = Math.max(0, Number(order.estimatedWeight) || 0);
    const makingCharge = weight * 100;
    const materialCost = weight * 4421.56862745;
    const totalCost = makingCharge + materialCost;
    const expectedValue = 175000;
    return {
      expectedValue,
      makingCharge,
      materialCost,
      profit: expectedValue - totalCost,
      totalCost,
      weight,
    };
  }, [order.estimatedWeight]);

  const materialRows = useMemo(() => [
    {
      available: "128.750",
      cost: totals.weight * 5420,
      issue: totals.weight.toFixed(3),
      material: "Gold",
      purity: order.purity.replace(" Hallmark", ""),
      required: "22.500",
      unitCost: "5,420.00",
    },
    { available: "2,500 pcs", cost: 2640, issue: "120.000 pcs", material: "Stone (CZ)", purity: "—", required: "120.000 pcs", unitCost: "22.00" },
    { available: "10.500", cost: 320, issue: "1.000", material: "Solder", purity: "916", required: "1.000", unitCost: "320.00" },
  ], [order.purity, totals.weight]);

  const materialTotal = materialRows.reduce((sum, row) => sum + row.cost, 0);

  function update<K extends keyof OrderForm>(key: K, value: OrderForm[K]) {
    setOrder((current) => ({ ...current, [key]: value }));
  }

  function saveOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(`Production order ${order.orderNo} was saved successfully.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={
          <div className={styles.headerActions}>
            <Link className={`button ${styles.backButton}`} href="/manufacturing/production-orders">
              <ArrowLeft aria-hidden="true" size={15} />Back to Orders
            </Link>
            <button className={`button ${styles.primaryButton}`} form="production-order-form" type="submit">
              <Save aria-hidden="true" size={15} />Save Order
            </button>
          </div>
        }
        description="Manufacturing  ›  Production Orders  ›  Create New"
        title="Create Production Order"
      />

      {message ? (
        <div className={styles.notice} role="status">
          <CheckCircle2 aria-hidden="true" size={16} />
          <span>{message}</span>
          <button aria-label="Dismiss notification" onClick={() => setMessage("")} type="button"><X size={14} /></button>
        </div>
      ) : null}

      <form className={styles.formLayout} id="production-order-form" onSubmit={saveOrder}>
        <Card className={styles.orderCard}>
          <div className={styles.cardHeading}>
            <div>
              <h2>Order Information</h2>
              <p>Enter production specifications and assignment details.</p>
            </div>
            <span><CalendarDays size={14} />New order</span>
          </div>

          <div className={styles.formGrid}>
            <Field label="Order No" required>
              <div className={styles.inputNote}>
                <input className="field" onChange={(event) => update("orderNo", event.target.value)} required value={order.orderNo} />
                <small>Auto-generated</small>
              </div>
            </Field>
            <Field label="Branch" required>
              <select className="select" onChange={(event) => update("branch", event.target.value)} value={order.branch}>
                <option>Chennai Main</option>
                <option>Madurai Branch</option>
                <option>Coimbatore Branch</option>
              </select>
            </Field>
            <Field label="Product Type" required>
              <select className="select" onChange={(event) => update("productType", event.target.value)} value={order.productType}>
                <option>Necklace</option>
                <option>Ring</option>
                <option>Bangle</option>
                <option>Earrings</option>
                <option>Pendant</option>
              </select>
            </Field>
            <Field label="Design Code" required>
              <div className={styles.inputAction}>
                <input className="field" onChange={(event) => update("designCode", event.target.value)} required value={order.designCode} />
                <button aria-label="Find design" onClick={() => setMessage(`Design ${order.designCode} loaded.`)} type="button"><Search size={15} /></button>
              </div>
            </Field>
            <Field label="Purity" required>
              <select className="select" onChange={(event) => update("purity", event.target.value)} value={order.purity}>
                <option>916 Hallmark</option>
                <option>750 Hallmark</option>
                <option>585 Hallmark</option>
              </select>
            </Field>
            <Field label="Estimated Weight (g)" required>
              <input className="field" min="0.001" onChange={(event) => update("estimatedWeight", event.target.value)} required step="0.001" type="number" value={order.estimatedWeight} />
            </Field>
            <Field label="Karigar" required>
              <select className="select" onChange={(event) => update("karigar", event.target.value)} value={order.karigar}>
                <option>Ramesh Kumar</option>
                <option>Suresh Babu</option>
                <option>Murugan M.</option>
                <option>Lakshmi M.</option>
              </select>
            </Field>
            <Field label="Delivery Date" required>
              <input className="field" min="2025-05-01" onChange={(event) => update("deliveryDate", event.target.value)} required type="date" value={order.deliveryDate} />
            </Field>
            <Field label="Priority" required>
              <select className="select" onChange={(event) => update("priority", event.target.value)} value={order.priority}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </Field>
            <Field label="Notes" wide>
              <textarea className="textarea" onChange={(event) => update("notes", event.target.value)} value={order.notes} />
            </Field>
          </div>
        </Card>

        <Card className={styles.summaryCard}>
          <div className={styles.cardHeading}>
            <div><h2>Order Summary</h2><p>Live estimate for this production order.</p></div>
          </div>
          <div className={styles.jewelryStage} aria-label="Gold necklace design preview" role="img">
            <div className={styles.necklaceArc} />
            <span className={styles.centerGem}><Gem size={26} /></span>
            <Sparkles aria-hidden="true" className={styles.sparkleOne} size={15} />
            <Sparkles aria-hidden="true" className={styles.sparkleTwo} size={11} />
          </div>
          <div className={styles.summaryRows}>
            <SummaryRow label="Product Type" value={order.productType} />
            <SummaryRow label="Purity" value={order.purity} />
            <SummaryRow label="Estimated Weight" value={`${totals.weight.toFixed(3)} g`} />
            <SummaryRow label="Making Charge Type" value="Per Gram" />
            <SummaryRow label="Est. Making Charge" value={formatCurrency(totals.makingCharge)} />
            <SummaryRow label="Est. Material Cost" value={formatCurrency(totals.materialCost)} />
            <SummaryRow label="Est. Total Cost" value={formatCurrency(totals.totalCost)} />
            <SummaryRow label="Expected Value" value={formatCurrency(totals.expectedValue)} />
            <SummaryRow accent label="Expected Profit" value={formatCurrency(totals.profit)} />
          </div>
        </Card>

        <Card className={styles.materialCard}>
          <div className={styles.cardHeading}>
            <div><h2>Material Plan</h2><p>Estimated material requirements and availability.</p></div>
            <span><Gem size={14} />3 materials</span>
          </div>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr><th>Material</th><th>Purity</th><th>Required (g)</th><th>Available (g)</th><th>To Issue (g)</th><th>Unit Cost (₹)</th><th>Total Cost (₹)</th></tr>
              </thead>
              <tbody>
                {materialRows.map((row) => (
                  <tr key={row.material}>
                    <td><strong>{row.material}</strong></td><td>{row.purity}</td><td>{row.required}</td><td>{row.available}</td><td>{row.issue}</td><td>{row.unitCost}</td><td>{row.cost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr><td colSpan={6}>Total Material Cost</td><td>{formatCurrency(materialTotal)}</td></tr></tfoot>
            </table>
          </div>
        </Card>
      </form>
    </div>
  );
}
