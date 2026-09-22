"use client";

import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  CircleUserRound,
  Coins,
  Gem,
  PackageOpen,
  Phone,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { Card } from "@/components/ui/card";

import {
  PRODUCTION_MATERIAL_RETURNS_STORAGE_KEY,
  cloneInitialReturnedMaterials,
  isProductionMaterialReturnRecord,
  materialTypeOptions,
  productionKarigars,
  productionOrders,
  unitOptions,
  type ProductionMaterialReturnRecord,
  type ProductionMaterialType,
  type ProductionMaterialUnit,
  type ReturnedProductionMaterial,
} from "./production-material-return-data";
import styles from "./production-material-return.module.css";

type Feedback = {
  tone: "error" | "success" | "info";
  message: string;
} | null;

type NewMaterialDraft = {
  materialType: ProductionMaterialType;
  itemName: string;
  purity: string;
  quantity: string;
  unit: ProductionMaterialUnit;
  remarks: string;
};

const initialForm = {
  returnNo: "MR-2025-001",
  returnDate: "2025-04-30",
  karigarId: "K-001",
  productionOrder: "PO-2025-001",
  remarks: "Returning unused gold and stones",
};

function createMaterialDraft(): NewMaterialDraft {
  return {
    materialType: "Gold",
    itemName: "",
    purity: "22K (916)",
    quantity: "",
    unit: "gm",
    remarks: "",
  };
}

function readStoredReturns() {
  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(PRODUCTION_MATERIAL_RETURNS_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(value)
      ? value.filter(isProductionMaterialReturnRecord)
      : [];
  } catch {
    return [];
  }
}

function MaterialIcon({ type }: { type: ProductionMaterialType }) {
  if (type === "Gold") {
    return <Coins aria-hidden="true" className={styles.goldIcon} size={16} />;
  }
  if (type === "Diamond") {
    return <Gem aria-hidden="true" className={styles.diamondIcon} size={16} />;
  }
  return <PackageOpen aria-hidden="true" className={styles.otherIcon} size={16} />;
}

function FieldLabel({ children, required = false }: { children: ReactNode; required?: boolean }) {
  return (
    <span className={styles.fieldLabel}>
      {children}
      {required ? <b aria-hidden="true">*</b> : null}
    </span>
  );
}

function formatQuantity(material: ReturnedProductionMaterial) {
  return material.unit === "pcs"
    ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 }).format(material.quantity)
    : material.quantity.toFixed(3);
}

function AddMaterialDialog({
  onAdd,
  onClose,
}: {
  onAdd: (material: ReturnedProductionMaterial) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(createMaterialDraft);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const itemNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    itemNameRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled])',
        ),
      );
      const first = focusable.at(0);
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  function updateDraft<Key extends keyof NewMaterialDraft>(
    key: Key,
    value: NewMaterialDraft[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function submitMaterial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quantity = Number(draft.quantity);
    if (!draft.itemName.trim() || !draft.purity.trim()) {
      setError("Enter both the item name and purity/type.");
      return;
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Weight or quantity must be greater than zero.");
      return;
    }

    onAdd({
      id: `returned-production-material-${Date.now()}`,
      materialType: draft.materialType,
      itemName: draft.itemName.trim(),
      purity: draft.purity.trim(),
      quantity,
      unit: draft.unit,
      remarks: draft.remarks.trim() || "—",
    });
  }

  return (
    <div
      className={styles.dialogBackdrop}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
      ref={dialogRef}
    >
      <Card
        aria-describedby="add-return-material-description"
        aria-labelledby="add-return-material-title"
        aria-modal="true"
        className={styles.dialog}
        role="dialog"
      >
        <header className={styles.dialogHeader}>
          <div>
            <h2 id="add-return-material-title">Add Returned Material</h2>
            <p id="add-return-material-description">
              Add another material received back from this karigar.
            </p>
          </div>
          <button aria-label="Close add material dialog" onClick={onClose} type="button">
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        <form className={styles.dialogForm} noValidate onSubmit={submitMaterial}>
          {error ? (
            <p aria-live="assertive" className={styles.dialogError} role="alert">
              <CircleAlert aria-hidden="true" size={15} />
              {error}
            </p>
          ) : null}
          <label>
            <FieldLabel required>Material Type</FieldLabel>
            <select
              className="select"
              onChange={(event) => updateDraft("materialType", event.target.value as ProductionMaterialType)}
              value={draft.materialType}
            >
              {materialTypeOptions.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label>
            <FieldLabel required>Item Name</FieldLabel>
            <input
              className="field"
              onChange={(event) => updateDraft("itemName", event.target.value)}
              placeholder="e.g. Gold Wire"
              ref={itemNameRef}
              value={draft.itemName}
            />
          </label>
          <label>
            <FieldLabel required>Purity/Type</FieldLabel>
            <input
              className="field"
              onChange={(event) => updateDraft("purity", event.target.value)}
              placeholder="e.g. 22K (916)"
              value={draft.purity}
            />
          </label>
          <label>
            <FieldLabel required>Weight/Qty</FieldLabel>
            <input
              className="field"
              min="0.001"
              onChange={(event) => updateDraft("quantity", event.target.value)}
              step="0.001"
              type="number"
              value={draft.quantity}
            />
          </label>
          <label>
            <FieldLabel required>Unit</FieldLabel>
            <select
              className="select"
              onChange={(event) => updateDraft("unit", event.target.value as ProductionMaterialUnit)}
              value={draft.unit}
            >
              {unitOptions.map((unit) => <option key={unit}>{unit}</option>)}
            </select>
          </label>
          <label>
            <FieldLabel>Remarks</FieldLabel>
            <input
              className="field"
              onChange={(event) => updateDraft("remarks", event.target.value)}
              placeholder="Optional note"
              value={draft.remarks}
            />
          </label>
          <footer className={styles.dialogActions}>
            <button className="button" onClick={onClose} type="button">Cancel</button>
            <button className={styles.addButton} type="submit">
              <Plus aria-hidden="true" size={15} />Add Material
            </button>
          </footer>
        </form>
      </Card>
    </div>
  );
}

export function ProductionMaterialReturnCreate() {
  const router = useRouter();
  const [form, setForm] = useState({ ...initialForm });
  const [materials, setMaterials] = useState(cloneInitialReturnedMaterials);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const karigar = useMemo(
    () => productionKarigars.find((item) => item.id === form.karigarId) ?? productionKarigars[0],
    [form.karigarId],
  );
  const order = useMemo(
    () => productionOrders.find((item) => item.orderNo === form.productionOrder) ?? productionOrders[0],
    [form.productionOrder],
  );

  function updateForm<Key extends keyof typeof initialForm>(
    key: Key,
    value: (typeof initialForm)[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  }

  function addMaterial(material: ReturnedProductionMaterial) {
    setMaterials((current) => [...current, material]);
    setDialogOpen(false);
    setFeedback({
      tone: "success",
      message: `${material.itemName} was added to this return.`,
    });
  }

  function deleteMaterial(material: ReturnedProductionMaterial) {
    setMaterials((current) => current.filter((item) => item.id !== material.id));
    setFeedback({
      tone: "info",
      message: `${material.itemName} was removed from this return.`,
    });
  }

  function clearMaterials() {
    if (!materials.length) {
      setFeedback({ tone: "info", message: "There are no returned materials to clear." });
      return;
    }
    setMaterials([]);
    setFeedback({ tone: "info", message: "All returned materials were cleared." });
  }

  function saveReturn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.returnNo.trim() || !form.returnDate || !form.karigarId || !form.productionOrder) {
      setFeedback({ tone: "error", message: "Complete all required return information." });
      return;
    }
    if (!materials.length) {
      setFeedback({ tone: "error", message: "Add at least one material before saving the return." });
      return;
    }

    const record: ProductionMaterialReturnRecord = {
      returnNo: form.returnNo.trim(),
      returnDate: form.returnDate,
      karigarId: form.karigarId,
      productionOrder: form.productionOrder,
      remarks: form.remarks.trim(),
      materials,
      savedAt: new Date().toISOString(),
    };

    try {
      const stored = readStoredReturns();
      const next = [
        record,
        ...stored.filter((item) => item.returnNo !== record.returnNo),
      ];
      window.localStorage.setItem(
        PRODUCTION_MATERIAL_RETURNS_STORAGE_KEY,
        JSON.stringify(next),
      );
      setFeedback({
        tone: "success",
        message: `${record.returnNo} was saved successfully.`,
      });
    } catch {
      setFeedback({
        tone: "error",
        message: "The material return could not be saved in this browser. Please try again.",
      });
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Material Return</h1>
          <nav aria-label="Breadcrumb">
            <Link href="/dashboard">Home</Link>
            <span aria-hidden="true">›</span>
            <span>Production Management</span>
            <span aria-hidden="true">›</span>
            <span aria-current="page">Material Return</span>
          </nav>
        </div>
        <button className={styles.backButton} onClick={() => router.back()} type="button">
          <ArrowLeft aria-hidden="true" size={15} />Back
        </button>
      </header>

      <form noValidate onSubmit={saveReturn}>
        <div className={styles.topGrid}>
          <Card className={styles.returnCard}>
            <h2>Return Information</h2>
            <div className={styles.returnFields}>
              <label>
                <FieldLabel required>Return No</FieldLabel>
                <input
                  className="field"
                  onChange={(event) => updateForm("returnNo", event.target.value)}
                  value={form.returnNo}
                />
              </label>
              <label>
                <FieldLabel required>Return Date</FieldLabel>
                <input
                  className="field"
                  onChange={(event) => updateForm("returnDate", event.target.value)}
                  type="date"
                  value={form.returnDate}
                />
              </label>
              <label>
                <FieldLabel required>From Karigar</FieldLabel>
                <select
                  className="select"
                  onChange={(event) => updateForm("karigarId", event.target.value)}
                  value={form.karigarId}
                >
                  {productionKarigars.map((item) => (
                    <option key={item.id} value={item.id}>{item.name} ({item.id})</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">Production order</span>
                <select
                  aria-label="Production Order"
                  className="select"
                  onChange={(event) => updateForm("productionOrder", event.target.value)}
                  value={form.productionOrder}
                >
                  {productionOrders.map((item) => (
                    <option key={item.orderNo}>{item.orderNo}</option>
                  ))}
                </select>
              </label>
              <label>
                <FieldLabel>Remarks</FieldLabel>
                <textarea
                  className="textarea"
                  onChange={(event) => updateForm("remarks", event.target.value)}
                  value={form.remarks}
                />
              </label>
            </div>
          </Card>

          <Card className={styles.karigarCard}>
            <h2>Karigar Details</h2>
            <div className={styles.karigarLayout}>
              <div className={styles.karigarColumn}>
                <div className={styles.identity}>
                  <span aria-hidden="true" className={styles.avatar}>{karigar.initials}</span>
                  <div>
                    <strong>{karigar.name}</strong>
                    <small>{karigar.id}</small>
                    <a href={`tel:${karigar.phone}`}>
                      <Phone aria-hidden="true" size={11} />{karigar.phone}
                    </a>
                  </div>
                </div>
                <Link className={styles.profileButton} href="/karigars/manage">
                  <CircleUserRound aria-hidden="true" size={14} />View Profile
                </Link>
              </div>

              <section aria-labelledby="order-details-title" className={styles.orderDetails}>
                <h3 id="order-details-title">Order Details</h3>
                <dl>
                  <div><dt>PO No :</dt><dd>{order.orderNo}</dd></div>
                  <div><dt>Item :</dt><dd>{order.itemName}</dd></div>
                  <div><dt>Assigned Date:</dt><dd>{order.assignedDate}</dd></div>
                  <div><dt>Expected Date:</dt><dd>{order.expectedDate}</dd></div>
                </dl>
              </section>
            </div>
          </Card>
        </div>

        <Card className={styles.materialsCard}>
          <div className={styles.materialsHeader}>
            <h2>Returned Materials</h2>
            <button
              className={styles.addButton}
              onClick={() => {
                setDialogOpen(true);
                setFeedback(null);
              }}
              type="button"
            >
              <Plus aria-hidden="true" size={15} />Add Material
            </button>
          </div>

          <div className={styles.tableScroller}>
            <table>
              <caption className="sr-only">Materials returned by {karigar.name}</caption>
              <thead>
                <tr>
                  <th scope="col">SL</th>
                  <th scope="col">Material Type</th>
                  <th scope="col">Item Name</th>
                  <th scope="col">Purity/Type</th>
                  <th scope="col">Weight/Qty</th>
                  <th scope="col">Unit</th>
                  <th scope="col">Remarks</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material, index) => (
                  <tr key={material.id}>
                    <td>{index + 1}</td>
                    <td>
                      <span className={styles.materialType}>
                        <MaterialIcon type={material.materialType} />
                        {material.materialType}
                      </span>
                    </td>
                    <td>{material.itemName}</td>
                    <td>{material.purity}</td>
                    <td>{formatQuantity(material)}</td>
                    <td>{material.unit}</td>
                    <td>{material.remarks}</td>
                    <td>
                      <button
                        aria-label={`Delete ${material.itemName}`}
                        className={styles.deleteButton}
                        onClick={() => deleteMaterial(material)}
                        title={`Delete ${material.itemName}`}
                        type="button"
                      >
                        <Trash2 aria-hidden="true" size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!materials.length ? (
                  <tr>
                    <td className={styles.emptyState} colSpan={8}>
                      <strong>No returned materials</strong>
                      <span>Use Add Material to record the items returned by this karigar.</span>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <footer className={styles.materialActions}>
            <button className={styles.clearButton} onClick={clearMaterials} type="button">
              <X aria-hidden="true" size={14} />Clear All
            </button>
            <button className={styles.saveButton} type="submit">
              <Save aria-hidden="true" size={15} />Save Return
            </button>
          </footer>
        </Card>
      </form>

      <p
        aria-live="polite"
        className={feedback ? `${styles.feedback} ${styles[feedback.tone]}` : "sr-only"}
        role={feedback?.tone === "error" ? "alert" : "status"}
      >
        {feedback?.tone === "success"
          ? <CheckCircle2 aria-hidden="true" size={16} />
          : feedback?.tone === "error"
            ? <CircleAlert aria-hidden="true" size={16} />
            : <CircleUserRound aria-hidden="true" size={16} />}
        {feedback?.message ?? ""}
      </p>

      {dialogOpen ? (
        <AddMaterialDialog onAdd={addMaterial} onClose={() => setDialogOpen(false)} />
      ) : null}
    </div>
  );
}
