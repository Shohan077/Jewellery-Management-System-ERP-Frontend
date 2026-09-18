"use client";

import {
  CheckCircle2,
  CircleAlert,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  MATERIAL_ISSUES_STORAGE_EVENT,
  MATERIAL_ISSUES_STORAGE_KEY,
  formatIssueDate,
  initialMaterialLines,
  isMaterialIssueRecord,
  karigarOptions,
  manufacturingOrderOptions,
  materialOptions,
  purityOptions,
  type MaterialIssueRecord,
  type MaterialLine,
} from "./material-issue-data";
import styles from "./material-issues.module.css";

type Feedback = { tone: "error" | "success"; message: string } | null;

type NewMaterial = {
  material: string;
  purity: string;
  weight: string;
  remarks: string;
};

const INITIAL_ISSUE_NO = "MI-2025-001";
const INITIAL_ISSUE_DATE = "2025-04-12";
const INITIAL_KARIGAR = "Mohammad Ali";
const INITIAL_ORDER = "MO-2025-001";

function freshInitialLines() {
  return initialMaterialLines.map((line) => ({ ...line }));
}

function defaultNewMaterial(): NewMaterial {
  return { material: "Gold (Raw)", purity: "22K", weight: "", remarks: "" };
}

function readStoredIssues() {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(MATERIAL_ISSUES_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter(isMaterialIssueRecord) : [];
  } catch {
    return [];
  }
}

export function MaterialIssueCreate() {
  const [issueNo, setIssueNo] = useState(INITIAL_ISSUE_NO);
  const [issueDate, setIssueDate] = useState(INITIAL_ISSUE_DATE);
  const [karigar, setKarigar] = useState(INITIAL_KARIGAR);
  const [manufacturingOrder, setManufacturingOrder] = useState(INITIAL_ORDER);
  const [materials, setMaterials] = useState<MaterialLine[]>(freshInitialLines);
  const [note, setNote] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState<NewMaterial>(defaultNewMaterial);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const totalWeight = useMemo(
    () => materials.reduce((total, material) => total + material.weight, 0),
    [materials],
  );

  useEffect(() => {
    if (!addDialogOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAddDialogOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [addDialogOpen]);

  function resetForm() {
    setIssueNo(INITIAL_ISSUE_NO);
    setIssueDate(INITIAL_ISSUE_DATE);
    setKarigar(INITIAL_KARIGAR);
    setManufacturingOrder(INITIAL_ORDER);
    setMaterials(freshInitialLines());
    setNote("");
    setAddDialogOpen(false);
    setNewMaterial(defaultNewMaterial());
    setFeedback({ tone: "success", message: "Material issue form reset to its original values." });
  }

  function removeMaterial(id: string) {
    const removed = materials.find((material) => material.id === id);
    setMaterials((current) => current.filter((material) => material.id !== id));
    setFeedback(removed ? { tone: "success", message: `${removed.material} removed from this issue.` } : null);
  }

  function addMaterial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const weight = Number(newMaterial.weight);
    if (!Number.isFinite(weight) || weight <= 0) {
      setFeedback({ tone: "error", message: "Enter a material weight greater than zero." });
      return;
    }

    setMaterials((current) => [...current, {
      id: `material-${Date.now()}`,
      material: newMaterial.material,
      purity: newMaterial.purity,
      weight,
      remarks: newMaterial.remarks.trim() || "—",
    }]);
    setNewMaterial(defaultNewMaterial());
    setAddDialogOpen(false);
    setFeedback({ tone: "success", message: `${newMaterial.material} added to the issue.` });
  }

  function saveIssue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!issueNo.trim() || !issueDate || !karigar || !manufacturingOrder) {
      setFeedback({ tone: "error", message: "Complete all required material issue fields." });
      return;
    }
    if (materials.length === 0) {
      setFeedback({ tone: "error", message: "Add at least one material before saving the issue." });
      return;
    }

    const record: MaterialIssueRecord = {
      id: issueNo.trim(),
      issueNo: issueNo.trim(),
      date: formatIssueDate(issueDate),
      dateIso: issueDate,
      karigar,
      manufacturingOrder,
      totalMaterial: materials.length,
      totalWeight: Number(totalWeight.toFixed(3)),
      status: "Issued",
      materials,
      note: note.trim(),
    };

    try {
      const stored = readStoredIssues();
      const next = [record, ...stored.filter((item) => item.issueNo !== record.issueNo)];
      window.localStorage.setItem(MATERIAL_ISSUES_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(MATERIAL_ISSUES_STORAGE_EVENT));
      setFeedback({ tone: "success", message: `${record.issueNo} saved successfully for ${record.karigar}.` });
    } catch {
      setFeedback({ tone: "error", message: "The issue could not be saved in this browser. Please try again." });
    }
  }

  return (
    <div className={styles.createPage}>
      <PageHeader
        description="Issue raw materials to karigar for manufacturing"
        title="Material Issue to Karigar"
      />

      <p
        aria-live="polite"
        className={feedback ? `${styles.feedback} ${styles[feedback.tone]}` : "sr-only"}
        role={feedback?.tone === "error" ? "alert" : "status"}
      >
        {feedback?.tone === "success" ? <CheckCircle2 aria-hidden="true" size={16} /> : <CircleAlert aria-hidden="true" size={16} />}
        {feedback?.message ?? ""}
      </p>

      <form noValidate onSubmit={saveIssue}>
        <Card className={styles.issueFormCard}>
          <header className={styles.cardHeader}>
            <h2>Material Issue Information</h2>
            <p>Issue raw materials to karigar for manufacturing</p>
          </header>

          <div className={styles.fieldGrid}>
            <label className={styles.control}>
              <span>Issue No <b aria-hidden="true">*</b></span>
              <input className="field" onChange={(event) => { setIssueNo(event.target.value); setFeedback(null); }} required value={issueNo} />
            </label>
            <label className={styles.control}>
              <span>Issue Date <b aria-hidden="true">*</b></span>
              <input className="field" onChange={(event) => { setIssueDate(event.target.value); setFeedback(null); }} required type="date" value={issueDate} />
            </label>
            <label className={styles.control}>
              <span>Karigar <b aria-hidden="true">*</b></span>
              <select className="select" onChange={(event) => { setKarigar(event.target.value); setFeedback(null); }} required value={karigar}>
                {karigarOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className={styles.control}>
              <span>Manufacturing Order</span>
              <select className="select" onChange={(event) => { setManufacturingOrder(event.target.value); setFeedback(null); }} value={manufacturingOrder}>
                {manufacturingOrderOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>

          <section aria-labelledby="materials-title" className={styles.materialsSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 id="materials-title">Materials</h2>
                <p>{materials.length} materials · {totalWeight.toFixed(3)} g total</p>
              </div>
              <button className="button button--primary" onClick={() => { setAddDialogOpen(true); setFeedback(null); }} type="button">
                <Plus aria-hidden="true" size={16} />
                Add Material
              </button>
            </div>

            <div className={styles.tableScroller}>
              <table className={styles.materialTable}>
                <caption className="sr-only">Materials included in this issue</caption>
                <thead><tr><th scope="col">#</th><th scope="col">Material</th><th scope="col">Purity</th><th scope="col">Weight (Gram)</th><th scope="col">Remarks</th><th scope="col"><span className="sr-only">Action</span></th></tr></thead>
                <tbody>
                  {materials.map((material, index) => (
                    <tr key={material.id}>
                      <td>{index + 1}</td>
                      <td><strong>{material.material}</strong></td>
                      <td>{material.purity}</td>
                      <td>{material.weight.toFixed(3)}</td>
                      <td>{material.remarks}</td>
                      <td><button aria-label={`Remove ${material.material}`} className={styles.deleteButton} onClick={() => removeMaterial(material.id)} title={`Remove ${material.material}`} type="button"><Trash2 aria-hidden="true" size={16} /></button></td>
                    </tr>
                  ))}
                  {materials.length === 0 ? <tr><td className={styles.emptyMaterials} colSpan={6}>No materials added. Use “Add Material” to continue.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </section>

          <label className={`${styles.control} ${styles.noteField}`}>
            <span>Note</span>
            <textarea className="textarea" onChange={(event) => setNote(event.target.value)} placeholder="Enter note (optional)..." value={note} />
          </label>

          <footer className={styles.formActions}>
            <button className="button" onClick={resetForm} type="button"><RotateCcw aria-hidden="true" size={16} />Reset</button>
            <button className="button button--primary" type="submit"><Save aria-hidden="true" size={16} />Save Issue</button>
          </footer>
        </Card>
      </form>

      {addDialogOpen ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setAddDialogOpen(false); }}>
          <Card aria-describedby="add-material-description" aria-labelledby="add-material-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
            <header className={styles.modalHeader}>
              <div><h2 id="add-material-title">Add Material</h2><p id="add-material-description">Add another raw material to this issue.</p></div>
              <button aria-label="Close add material dialog" onClick={() => setAddDialogOpen(false)} type="button"><X aria-hidden="true" size={18} /></button>
            </header>
            <form className={styles.modalForm} onSubmit={addMaterial}>
              <label className={styles.control}><span>Material <b aria-hidden="true">*</b></span><select autoFocus className="select" onChange={(event) => setNewMaterial((current) => ({ ...current, material: event.target.value }))} value={newMaterial.material}>{materialOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
              <label className={styles.control}><span>Purity <b aria-hidden="true">*</b></span><select className="select" onChange={(event) => setNewMaterial((current) => ({ ...current, purity: event.target.value }))} value={newMaterial.purity}>{purityOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
              <label className={styles.control}><span>Weight (Gram) <b aria-hidden="true">*</b></span><input className="field" min="0.001" onChange={(event) => setNewMaterial((current) => ({ ...current, weight: event.target.value }))} required step="0.001" type="number" value={newMaterial.weight} /></label>
              <label className={styles.control}><span>Remarks</span><input className="field" onChange={(event) => setNewMaterial((current) => ({ ...current, remarks: event.target.value }))} placeholder="e.g. For Ring" value={newMaterial.remarks} /></label>
              <footer className={styles.modalActions}><button className="button" onClick={() => setAddDialogOpen(false)} type="button">Cancel</button><button className="button button--primary" type="submit"><Plus aria-hidden="true" size={16} />Add Material</button></footer>
            </form>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
