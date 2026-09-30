"use client";

import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  PackageCheck,
  Printer,
  Save,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import styles from "./finished-goods.module.css";

type Row = readonly string[];

const goods: Row[] = [
  ["PO-2505-001", "Necklace", "Necklace", "916", "22.340", "Approved", "20/05/2025"],
  ["PO-2505-002", "Ring", "Ring", "916", "18.750", "Approved", "19/05/2025"],
  ["PO-2505-003", "Bangle", "Bangle", "750", "31.420", "QC Pending", "—"],
  ["PO-2505-004", "Earrings", "Earrings", "916", "15.870", "Approved", "18/05/2025"],
  ["PO-2505-005", "Pendant", "Pendant", "916", "27.220", "Rejected", "17/05/2025"],
];

const qcChecklist = [
  ["Weight (g)", "22.350 ± 0.050", "22.340"],
  ["Purity", "916", "916"],
  ["Finishing", "Smooth & Shiny", "Smooth & Shiny"],
  ["Stone Setting", "Secure & Proper", "Secure & Proper"],
  ["Locking / Clasp", "Strong & Safe", "Strong & Safe"],
  ["Overall Appearance", "Excellent", "Excellent"],
] as const;

function Stat({ icon, label, value, meta }: { icon: ReactNode; label: string; value: string; meta: string }) {
  return (
    <Card className={styles.stat}>
      <span className={styles.icon}>{icon}</span>
      <div><p>{label}</p><h2>{value}</h2><small>{meta}</small></div>
    </Card>
  );
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={`${styles.field} ${wide ? styles.wide : ""}`}><span>{label}</span>{children}</label>;
}

function Status({ value }: { value: string }) {
  const className = value === "Approved" ? styles.approved : value === "QC Pending" ? styles.pending : styles.rejected;
  return <span className={className}>{value}</span>;
}

export function FinishedGoodsQcWastage192() {
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);
  const [wastageWeight, setWastageWeight] = useState("0.350");
  const [wastageType, setWastageType] = useState("Gold Wastage");
  const value = useMemo(() => (Number(wastageWeight || 0) * 5420).toFixed(2), [wastageWeight]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(`QC and ${wastageType.toLowerCase()} entry saved.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <div className={styles.actions}>
            <button className="button" form="qc-form" type="submit"><Save size={14} />Save QC</button>
            <button className={`button ${styles.primary}`} onClick={() => setMessage("Production completed and finished goods recorded.")} type="button"><CheckCircle2 size={14} />Complete Production</button>
          </div>
        )}
        description="Manufacturing  ›  Finished Goods, QC & Wastage"
        title="Finished Goods, QC & Wastage"
      />

      {message ? <p className={styles.notice}>{message}</p> : null}

      <section className={styles.stats}>
        <Stat icon={<PackageCheck size={19} />} label="Completed Orders" value="24" meta="This Month" />
        <Stat icon={<CircleDollarSign size={19} />} label="Finished Goods Value" value="₹ 32,85,450" meta="This Month" />
        <Stat icon={<AlertTriangle size={19} />} label="QC Pending" value="6" meta="Orders" />
        <Stat icon={<AlertTriangle size={19} />} label="Wastage Value" value="₹ 86,240" meta="This Month" />
        <Stat icon={<CheckCircle2 size={19} />} label="Approved QC" value="18" meta="Orders" />
      </section>

      <section className={styles.workGrid}>
        <Card className={styles.card}>
          <h2>QC Checklist</h2>
          <p className={styles.sub}>Order No: PO-2505-001 &nbsp; | &nbsp; Design: NCK-0258 &nbsp; | &nbsp; Karigar: Ramesh Kumar</p>
          <table className={styles.checkTable}>
            <thead><tr><th>Checkpoint</th><th>Standard</th><th>Actual</th><th>Status</th></tr></thead>
            <tbody>
              {qcChecklist.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, cellIndex) => <td key={`${row[0]}-${cellIndex}`}>{cell}</td>)}
                  <td><span className={styles.pass}>Pass</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.sub}>Remarks: All good</p>
        </Card>

        <Card className={styles.card}>
          <h2>Wastage Entry</h2>
          <form className={styles.form} id="qc-form" onSubmit={save}>
            <Field label="Wastage Type"><select className="select" onChange={(event) => setWastageType(event.target.value)} value={wastageType}><option>Gold Wastage</option><option>Stone Wastage</option></select></Field>
            <Field label="Wastage Weight (g)"><input className="field" min="0" onChange={(event) => setWastageWeight(event.target.value)} step="0.001" type="number" value={wastageWeight} /></Field>
            <Field label="Purity"><select className="select"><option>916</option><option>750</option></select></Field>
            <Field label="Reason"><select className="select"><option>Filing & Finishing</option><option>Melting Loss</option></select></Field>
            <Field label="Wastage Value (₹)"><input className="field" readOnly value={value} /></Field>
            <Field label="Notes"><textarea className="field" defaultValue="Normal wastage during finishing." /></Field>
          </form>
        </Card>
      </section>

      <Card className={styles.tableCard}>
        <h2>Finished Goods</h2>
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead><tr><th>Order No</th><th>Design</th><th>Product</th><th>Purity</th><th>Weight (g)</th><th>QC Status</th><th>Completed On</th><th>Action</th></tr></thead>
            <tbody>
              {goods.map((row) => (
                <tr key={row[0]}>
                  {row.slice(0, 5).map((cell, cellIndex) => <td key={`${row[0]}-${cellIndex}`}>{cell}</td>)}
                  <td><Status value={row[5]} /></td>
                  <td>{row[6]}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <button aria-label="View" onClick={() => setSelected(row)} type="button"><Eye size={12} /></button>
                      <button aria-label="Print" onClick={() => window.print()} type="button"><Printer size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => event.currentTarget === event.target && setSelected(null)}>
          <Card className={styles.modal}>
            <h2>Finished Good Details</h2>
            <dl>{selected.map((cell, index) => <div key={`${cell}-${index}`}><dt>Field {index + 1}</dt><dd>{cell}</dd></div>)}</dl>
            <div className={styles.modalFooter}><button className="button" onClick={() => setSelected(null)} type="button">Close</button></div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
