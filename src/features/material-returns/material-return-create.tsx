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
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  MATERIAL_RETURNS_DELETED_STORAGE_KEY,
  MATERIAL_RETURNS_STORAGE_EVENT,
  MATERIAL_RETURNS_STORAGE_KEY,
  formatReturnDate,
  initialReturnedMaterials,
  isMaterialReturnRecord,
  karigarOptions,
  manufacturingOrderOptions,
  materialOptions,
  purityOptions,
  type MaterialReturnRecord,
  type MaterialReturnType,
  type ReturnedMaterial,
} from "./material-return-data";
import styles from "./material-returns.module.css";

type Feedback = { tone: "error" | "success"; message: string } | null;

type NewMaterial = {
  material: string;
  purity: string;
  returnedWeight: string;
  usableWeight: string;
  wastage: string;
  remarks: string;
};

const INITIAL_RETURN_NO = "MR-2025-001";
const INITIAL_RETURN_DATE = "2025-04-12";
const INITIAL_KARIGAR = "Mohammad Ali";
const INITIAL_ORDER = "MO-2025-001";
const INITIAL_RETURN_TYPE: MaterialReturnType = "Partial Return";

function freshInitialMaterials() {
  return initialReturnedMaterials.map((material) => ({ ...material }));
}

function defaultNewMaterial(): NewMaterial {
  return {
    material: "Gold (Raw)",
    purity: "22K",
    returnedWeight: "",
    usableWeight: "",
    wastage: "",
    remarks: "",
  };
}

function readStoredReturns() {
  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(MATERIAL_RETURNS_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(value) ? value.filter(isMaterialReturnRecord) : [];
  } catch {
    return [];
  }
}

export function MaterialReturnCreate() {
  const [returnNo, setReturnNo] = useState(INITIAL_RETURN_NO);
  const [returnDate, setReturnDate] = useState(INITIAL_RETURN_DATE);
  const [karigar, setKarigar] = useState(INITIAL_KARIGAR);
  const [manufacturingOrder, setManufacturingOrder] = useState(INITIAL_ORDER);
  const [returnType, setReturnType] = useState<MaterialReturnType>(INITIAL_RETURN_TYPE);
  const [remarks, setRemarks] = useState("");
  const [materials, setMaterials] = useState<ReturnedMaterial[]>(freshInitialMaterials);
  const [note, setNote] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState<NewMaterial>(defaultNewMaterial);
  const [addMaterialError, setAddMaterialError] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const addMaterialButtonRef = useRef<HTMLButtonElement>(null);
  const addDialogRef = useRef<HTMLDivElement>(null);

  const totals = useMemo(
    () => materials.reduce(
      (total, material) => ({
        returned: total.returned + material.returnedWeight,
        usable: total.usable + material.usableWeight,
        wastage: total.wastage + material.wastage,
      }),
      { returned: 0, usable: 0, wastage: 0 },
    ),
    [materials],
  );

  useEffect(() => {
    if (!addDialogOpen) return;
    const returnFocusTo = addMaterialButtonRef.current;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAddDialogOpen(false);
        return;
      }
      if (event.key !== "Tab" || !addDialogRef.current) return;
      const focusable = Array.from(addDialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = bodyOverflow;
      returnFocusTo?.focus();
    };
  }, [addDialogOpen]);

  function resetForm() {
    setReturnNo(INITIAL_RETURN_NO);
    setReturnDate(INITIAL_RETURN_DATE);
    setKarigar(INITIAL_KARIGAR);
    setManufacturingOrder(INITIAL_ORDER);
    setReturnType(INITIAL_RETURN_TYPE);
    setRemarks("");
    setMaterials(freshInitialMaterials());
    setNote("");
    setAddDialogOpen(false);
    setNewMaterial(defaultNewMaterial());
    setAddMaterialError("");
    setFeedback({ tone: "success", message: "Material return form reset to its original values." });
  }

  function removeMaterial(id: string) {
    const removed = materials.find((material) => material.id === id);
    setMaterials((current) => current.filter((material) => material.id !== id));
    setFeedback(removed
      ? { tone: "success", message: `${removed.material} removed from this return.` }
      : null);
  }

  function addMaterial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const returnedWeight = Number(newMaterial.returnedWeight);
    const usableWeight = Number(newMaterial.usableWeight);
    const wastage = Number(newMaterial.wastage);

    if (![returnedWeight, usableWeight, wastage].every(Number.isFinite)
      || returnedWeight <= 0
      || usableWeight < 0
      || wastage < 0) {
      setAddMaterialError("Enter valid non-negative material weights.");
      return;
    }
    if (usableWeight + wastage > returnedWeight + 0.0005) {
      setAddMaterialError("Usable weight and wastage cannot exceed returned weight.");
      return;
    }

    setMaterials((current) => [...current, {
      id: `returned-material-${Date.now()}`,
      material: newMaterial.material,
      purity: newMaterial.purity,
      returnedWeight,
      usableWeight,
      wastage,
      remarks: newMaterial.remarks.trim() || "—",
    }]);
    setNewMaterial(defaultNewMaterial());
    setAddMaterialError("");
    setAddDialogOpen(false);
    setFeedback({ tone: "success", message: `${newMaterial.material} added to the return.` });
  }

  function saveReturn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!returnNo.trim() || !returnDate || !karigar || !manufacturingOrder || !returnType) {
      setFeedback({ tone: "error", message: "Complete all required material return fields." });
      return;
    }
    if (materials.length === 0) {
      setFeedback({ tone: "error", message: "Add at least one returned material before saving." });
      return;
    }

    const record: MaterialReturnRecord = {
      id: returnNo.trim(),
      returnNo: returnNo.trim(),
      date: formatReturnDate(returnDate),
      dateIso: returnDate,
      karigar,
      manufacturingOrder,
      returnType,
      totalMaterials: materials.length,
      returnedWeight: Number(totals.returned.toFixed(3)),
      wastage: Number(totals.wastage.toFixed(3)),
      status: "Received",
      materials,
      remarks: remarks.trim(),
      note: note.trim(),
    };

    try {
      const stored = readStoredReturns();
      const next = [record, ...stored.filter((item) => item.returnNo !== record.returnNo)];
      window.localStorage.setItem(MATERIAL_RETURNS_STORAGE_KEY, JSON.stringify(next));

      const deletedValue: unknown = JSON.parse(
        window.localStorage.getItem(MATERIAL_RETURNS_DELETED_STORAGE_KEY) ?? "[]",
      );
      const deletedIds = Array.isArray(deletedValue)
        ? deletedValue.filter((value): value is string => typeof value === "string" && value !== record.id)
        : [];
      window.localStorage.setItem(MATERIAL_RETURNS_DELETED_STORAGE_KEY, JSON.stringify(deletedIds));
      window.dispatchEvent(new Event(MATERIAL_RETURNS_STORAGE_EVENT));
      setFeedback({
        tone: "success",
        message: `${record.returnNo} saved successfully and is now available in the material return list.`,
      });
    } catch {
      setFeedback({ tone: "error", message: "The return could not be saved in this browser. Please try again." });
    }
  }

  return (
    <div className={styles.createPage}>
      <header className={styles.createHeader}>
        <h1>Material Return from Karigar</h1>
        <nav aria-label="Breadcrumb">
          <span>Manufacturing</span>
          <b aria-hidden="true">›</b>
          <span aria-current="page">Material Return from Karigar</span>
        </nav>
      </header>

      <p
        aria-live="polite"
        className={feedback ? `${styles.feedback} ${styles[feedback.tone]}` : "sr-only"}
        role={feedback?.tone === "error" ? "alert" : "status"}
      >
        {feedback?.tone === "success"
          ? <CheckCircle2 aria-hidden="true" size={16} />
          : <CircleAlert aria-hidden="true" size={16} />}
        {feedback?.message ?? ""}
      </p>

      <form noValidate onSubmit={saveReturn}>
        <Card className={styles.returnFormCard}>
          <header className={styles.cardHeader}>
            <h2>Return Information</h2>
            <p>Record materials returned by karigar</p>
          </header>

          <div className={styles.fieldGrid}>
            <label className={styles.control}>
              <span>Return No <b aria-hidden="true">*</b></span>
              <input className="field" onChange={(event) => { setReturnNo(event.target.value); setFeedback(null); }} required value={returnNo} />
            </label>
            <label className={styles.control}>
              <span>Return Date <b aria-hidden="true">*</b></span>
              <input className="field" onChange={(event) => { setReturnDate(event.target.value); setFeedback(null); }} required type="date" value={returnDate} />
            </label>
            <label className={styles.control}>
              <span>Karigar <b aria-hidden="true">*</b></span>
              <select className="select" onChange={(event) => { setKarigar(event.target.value); setFeedback(null); }} required value={karigar}>
                {karigarOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className={styles.control}>
              <span>Manufacturing Order <b aria-hidden="true">*</b></span>
              <select className="select" onChange={(event) => { setManufacturingOrder(event.target.value); setFeedback(null); }} required value={manufacturingOrder}>
                {manufacturingOrderOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className={styles.control}>
              <span>Return Type <b aria-hidden="true">*</b></span>
              <select className="select" onChange={(event) => { setReturnType(event.target.value as MaterialReturnType); setFeedback(null); }} required value={returnType}>
                <option>Partial Return</option>
                <option>Full Return</option>
                <option>Wastage Return</option>
              </select>
            </label>
            <label className={`${styles.control} ${styles.remarksField}`}>
              <span>Remarks</span>
              <textarea className="textarea" onChange={(event) => setRemarks(event.target.value)} placeholder="Enter remarks (optional)..." value={remarks} />
            </label>
          </div>

          <section aria-labelledby="returned-materials-title" className={styles.materialsSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 id="returned-materials-title">Returned Materials</h2>
                <p>{materials.length} materials · {totals.returned.toFixed(3)} g returned</p>
              </div>
              <button className="button button--primary" onClick={() => { setAddDialogOpen(true); setAddMaterialError(""); setFeedback(null); }} ref={addMaterialButtonRef} type="button">
                <Plus aria-hidden="true" size={16} />
                Add Material
              </button>
            </div>

            <div className={styles.tableScroller}>
              <table className={styles.materialTable}>
                <caption className="sr-only">Materials included in this return</caption>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Material</th>
                    <th scope="col">Purity</th>
                    <th scope="col">Returned Weight (Gram)</th>
                    <th scope="col">Usable Weight</th>
                    <th scope="col">Wastage</th>
                    <th scope="col">Remarks</th>
                    <th scope="col"><span className="sr-only">Action</span></th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material, index) => (
                    <tr key={material.id}>
                      <td>{index + 1}</td>
                      <td><strong>{material.material}</strong></td>
                      <td>{material.purity}</td>
                      <td>{material.returnedWeight.toFixed(3)}</td>
                      <td>{material.usableWeight.toFixed(3)}</td>
                      <td>{material.wastage.toFixed(3)}</td>
                      <td>{material.remarks}</td>
                      <td>
                        <button
                          aria-label={`Remove ${material.material}`}
                          className={styles.deleteButton}
                          onClick={() => removeMaterial(material.id)}
                          title={`Remove ${material.material}`}
                          type="button"
                        >
                          <Trash2 aria-hidden="true" size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {materials.length === 0 ? (
                    <tr><td className={styles.emptyMaterials} colSpan={8}>No returned materials. Use “Add Material” to continue.</td></tr>
                  ) : null}
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
            <button className="button button--primary" type="submit"><Save aria-hidden="true" size={16} />Save Return</button>
          </footer>
        </Card>
      </form>

      {addDialogOpen ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setAddDialogOpen(false); }} ref={addDialogRef}>
          <Card aria-describedby="add-return-material-description" aria-labelledby="add-return-material-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
            <header className={styles.modalHeader}>
              <div>
                <h2 id="add-return-material-title">Add Returned Material</h2>
                <p id="add-return-material-description">Record another material returned by this karigar.</p>
              </div>
              <button aria-label="Close add material dialog" onClick={() => setAddDialogOpen(false)} type="button"><X aria-hidden="true" size={18} /></button>
            </header>
            <form className={styles.modalForm} onSubmit={addMaterial}>
              {addMaterialError ? <p aria-live="assertive" className={`${styles.feedback} ${styles.error} ${styles.modalError}`} role="alert">{addMaterialError}</p> : null}
              <label className={styles.control}>
                <span>Material <b aria-hidden="true">*</b></span>
                <select autoFocus className="select" onChange={(event) => setNewMaterial((current) => ({ ...current, material: event.target.value }))} value={newMaterial.material}>
                  {materialOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className={styles.control}>
                <span>Purity <b aria-hidden="true">*</b></span>
                <select className="select" onChange={(event) => setNewMaterial((current) => ({ ...current, purity: event.target.value }))} value={newMaterial.purity}>
                  {purityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className={styles.control}>
                <span>Returned Weight (Gram) <b aria-hidden="true">*</b></span>
                <input className="field" min="0.001" onChange={(event) => setNewMaterial((current) => ({ ...current, returnedWeight: event.target.value }))} required step="0.001" type="number" value={newMaterial.returnedWeight} />
              </label>
              <label className={styles.control}>
                <span>Usable Weight (Gram) <b aria-hidden="true">*</b></span>
                <input className="field" min="0" onChange={(event) => setNewMaterial((current) => ({ ...current, usableWeight: event.target.value }))} required step="0.001" type="number" value={newMaterial.usableWeight} />
              </label>
              <label className={styles.control}>
                <span>Wastage (Gram) <b aria-hidden="true">*</b></span>
                <input className="field" min="0" onChange={(event) => setNewMaterial((current) => ({ ...current, wastage: event.target.value }))} required step="0.001" type="number" value={newMaterial.wastage} />
              </label>
              <label className={styles.control}>
                <span>Remarks</span>
                <input className="field" onChange={(event) => setNewMaterial((current) => ({ ...current, remarks: event.target.value }))} placeholder="e.g. Polish Loss" value={newMaterial.remarks} />
              </label>
              <footer className={styles.modalActions}>
                <button className="button" onClick={() => setAddDialogOpen(false)} type="button">Cancel</button>
                <button className="button button--primary" type="submit"><Plus aria-hidden="true" size={16} />Add Material</button>
              </footer>
            </form>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
