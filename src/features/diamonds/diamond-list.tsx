"use client";

import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FilePenLine,
  Filter,
  Gem,
  PackagePlus,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  diamondClarities,
  diamondColors,
  diamondShapes,
  formatCarat,
  initialDiamonds,
  type DiamondClarity,
  type DiamondColor,
  type DiamondRecord,
  type DiamondShape,
} from "./diamond-data";
import styles from "./diamond-list.module.css";

const PAGE_SIZE = 10;
const allShapesLabel = "All Shapes";
const allColorsLabel = "All Colors";

type ShapeFilter = typeof allShapesLabel | DiamondShape;
type ColorFilter = typeof allColorsLabel | DiamondColor;
type DialogState =
  | { mode: "add" }
  | { mode: "view" | "edit" | "stock"; diamondId: number }
  | null;

type ImportedRow = Record<string, unknown>;

function paginationItems(current: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", pageCount];
  if (current >= pageCount - 3) {
    return [1, "ellipsis", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", pageCount];
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function downloadDiamonds(records: DiamondRecord[]) {
  const header = ["Code", "Shape", "Carat", "Color", "Clarity", "Certificate No", "Status", "Stock"];
  const rows = records.map((diamond) => [
    diamond.code,
    diamond.shape,
    formatCarat(diamond.carat),
    diamond.color,
    diamond.clarity,
    diamond.certificateNo,
    diamond.status,
    diamond.stock,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "diamond-list.csv";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && quoted && line[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += character;
    }
  }

  values.push(value.trim());
  return values;
}

function parseImportedRows(fileName: string, text: string): ImportedRow[] {
  if (fileName.toLowerCase().endsWith(".json")) {
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("The JSON file must contain an array of diamonds.");
    return parsed.filter((row): row is ImportedRow => typeof row === "object" && row !== null);
  }

  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) throw new Error("The CSV file needs a header and at least one data row.");
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });
}

function normalizedRow(row: ImportedRow) {
  return new Map(
    Object.entries(row).map(([key, value]) => [
      key.toLowerCase().replaceAll(/[^a-z0-9]/g, ""),
      String(value ?? "").trim(),
    ]),
  );
}

function readImportedDiamond(row: ImportedRow): Omit<DiamondRecord, "id"> | null {
  const values = normalizedRow(row);
  const code = (values.get("code") ?? values.get("diamondcode") ?? "").toUpperCase();
  const shape = values.get("shape") ?? "";
  const carat = Number(values.get("carat") ?? "");
  const color = (values.get("color") ?? "").toUpperCase();
  const clarity = (values.get("clarity") ?? "").toUpperCase();
  const certificateNo = (
    values.get("certificateno") ??
    values.get("certificatenumber") ??
    values.get("certificate") ??
    ""
  ).toUpperCase();
  const stockValue = Number(values.get("stock") ?? "1");

  if (
    !code ||
    !diamondShapes.includes(shape as DiamondShape) ||
    !Number.isFinite(carat) ||
    carat <= 0 ||
    !diamondColors.includes(color as DiamondColor) ||
    !diamondClarities.includes(clarity as DiamondClarity) ||
    !certificateNo
  ) {
    return null;
  }

  return {
    code,
    shape: shape as DiamondShape,
    carat,
    color: color as DiamondColor,
    clarity: clarity as DiamondClarity,
    certificateNo,
    status: "Active",
    stock: Number.isInteger(stockValue) && stockValue > 0 ? stockValue : 1,
  };
}

function DiamondThumbnail({ diamond, large = false }: { diamond: DiamondRecord; large?: boolean }) {
  return (
    <span
      aria-label={`${diamond.shape} diamond illustration`}
      className={`${styles.thumbnail} ${large ? styles.thumbnailLarge : ""}`}
      data-shape={diamond.shape}
      role="img"
    >
      <Gem aria-hidden="true" size={large ? 38 : 23} strokeWidth={1.35} />
    </span>
  );
}

function DiamondStatusBadge() {
  return (
    <span className={styles.statusBadge}>
      <span aria-hidden="true" />
      Active
    </span>
  );
}

type DiamondFormProps = {
  error: string;
  initialValue?: DiamondRecord;
  mode: "add" | "edit";
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function DiamondForm({ error, initialValue, mode, onCancel, onSubmit }: DiamondFormProps) {
  return (
    <form className={styles.modalForm} onSubmit={onSubmit}>
      {error ? <p className={styles.formError} role="alert">{error}</p> : null}
      <label>
        <span>Diamond Code <b aria-hidden="true">*</b></span>
        <input
          autoComplete="off"
          autoFocus
          className="field"
          defaultValue={initialValue?.code ?? ""}
          name="code"
          pattern="[A-Za-z0-9-]+"
          placeholder="DM-246"
          required
        />
      </label>
      <label>
        <span>Certificate No <b aria-hidden="true">*</b></span>
        <input
          autoComplete="off"
          className="field"
          defaultValue={initialValue?.certificateNo ?? ""}
          name="certificateNo"
          placeholder="GIA123456"
          required
        />
      </label>
      <label>
        <span>Shape <b aria-hidden="true">*</b></span>
        <select className="select" defaultValue={initialValue?.shape ?? "Round"} name="shape">
          {diamondShapes.map((shape) => <option key={shape}>{shape}</option>)}
        </select>
      </label>
      <label>
        <span>Carat <b aria-hidden="true">*</b></span>
        <input
          className="field"
          defaultValue={initialValue ? formatCarat(initialValue.carat) : ""}
          inputMode="decimal"
          max="100"
          min="0.01"
          name="carat"
          placeholder="0.50"
          required
          step="0.01"
          type="number"
        />
      </label>
      <label>
        <span>Color <b aria-hidden="true">*</b></span>
        <select className="select" defaultValue={initialValue?.color ?? "D"} name="color">
          {diamondColors.map((color) => <option key={color}>{color}</option>)}
        </select>
      </label>
      <label>
        <span>Clarity <b aria-hidden="true">*</b></span>
        <select className="select" defaultValue={initialValue?.clarity ?? "VVS1"} name="clarity">
          {diamondClarities.map((clarity) => <option key={clarity}>{clarity}</option>)}
        </select>
      </label>
      <label className={styles.wideField}>
        <span>Opening Stock</span>
        <input
          className="field"
          defaultValue={initialValue?.stock ?? 1}
          min="1"
          name="stock"
          required
          step="1"
          type="number"
        />
      </label>
      <div className={styles.modalActions}>
        <button className="button" onClick={onCancel} type="button">Cancel</button>
        <button className="button button--primary" type="submit">
          {mode === "add" ? <Plus aria-hidden="true" size={16} /> : <FilePenLine aria-hidden="true" size={16} />}
          {mode === "add" ? "Add Diamond" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function readDiamondForm(event: FormEvent<HTMLFormElement>): Omit<DiamondRecord, "id"> {
  const form = new FormData(event.currentTarget);
  return {
    code: String(form.get("code") ?? "").trim().toUpperCase(),
    shape: String(form.get("shape") ?? "Round") as DiamondShape,
    carat: Number(form.get("carat") ?? 0),
    color: String(form.get("color") ?? "D") as DiamondColor,
    clarity: String(form.get("clarity") ?? "VVS1") as DiamondClarity,
    certificateNo: String(form.get("certificateNo") ?? "").trim().toUpperCase(),
    status: "Active",
    stock: Number(form.get("stock") ?? 1),
  };
}

export function DiamondList() {
  const importInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const [records, setRecords] = useState<DiamondRecord[]>(() => initialDiamonds);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [draftShape, setDraftShape] = useState<ShapeFilter>(allShapesLabel);
  const [draftColor, setDraftColor] = useState<ColorFilter>(allColorsLabel);
  const [shapeFilter, setShapeFilter] = useState<ShapeFilter>(allShapesLabel);
  const [colorFilter, setColorFilter] = useState<ColorFilter>(allColorsLabel);
  const [currentPage, setCurrentPage] = useState(1);
  const [activityMessage, setActivityMessage] = useState("");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [dialogError, setDialogError] = useState("");

  const filteredDiamonds = useMemo(() => {
    const searchTerm = deferredQuery.trim().toLowerCase();
    return records.filter((diamond) => {
      const matchesQuery =
        searchTerm.length === 0 ||
        diamond.code.toLowerCase().includes(searchTerm) ||
        diamond.certificateNo.toLowerCase().includes(searchTerm) ||
        diamond.shape.toLowerCase().includes(searchTerm);
      const matchesShape = shapeFilter === allShapesLabel || diamond.shape === shapeFilter;
      const matchesColor = colorFilter === allColorsLabel || diamond.color === colorFilter;
      return matchesQuery && matchesShape && matchesColor;
    });
  }, [colorFilter, deferredQuery, records, shapeFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredDiamonds.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const firstVisible = filteredDiamonds.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const lastVisible = Math.min(safePage * PAGE_SIZE, filteredDiamonds.length);
  const pageRows = filteredDiamonds.slice(firstVisible === 0 ? 0 : firstVisible - 1, lastVisible);
  const selectedDiamond = dialog && dialog.mode !== "add"
    ? records.find((diamond) => diamond.id === dialog.diamondId) ?? null
    : null;
  const unappliedFilters = draftShape !== shapeFilter || draftColor !== colorFilter;

  useEffect(() => {
    if (!dialog) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      modalRef.current?.querySelector<HTMLElement>("[autofocus], input, select, button")?.focus();
    }, 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDialog(null);
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
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
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = bodyOverflow;
      previouslyFocused?.focus();
    };
  }, [dialog]);

  function openDialog(nextDialog: Exclude<DialogState, null>) {
    setDialogError("");
    setDialog(nextDialog);
  }

  function closeDialog() {
    setDialogError("");
    setDialog(null);
  }

  function clearFilters() {
    setQuery("");
    setDraftShape(allShapesLabel);
    setDraftColor(allColorsLabel);
    setShapeFilter(allShapesLabel);
    setColorFilter(allColorsLabel);
    setCurrentPage(1);
    setActivityMessage("Diamond filters were cleared.");
  }

  function applyFilters() {
    setShapeFilter(draftShape);
    setColorFilter(draftColor);
    setCurrentPage(1);
    const shapeLabel = draftShape === allShapesLabel ? "all shapes" : draftShape;
    const colorLabel = draftColor === allColorsLabel ? "all colors" : `color ${draftColor}`;
    setActivityMessage(`Showing ${shapeLabel}, ${colorLabel}.`);
  }

  function validateUniqueDiamond(candidate: Omit<DiamondRecord, "id">, ignoredId?: number) {
    const duplicateCode = records.some((diamond) => diamond.id !== ignoredId && diamond.code === candidate.code);
    if (duplicateCode) return `Diamond code ${candidate.code} already exists.`;
    const duplicateCertificate = records.some(
      (diamond) => diamond.id !== ignoredId && diamond.certificateNo === candidate.certificateNo,
    );
    if (duplicateCertificate) return `Certificate ${candidate.certificateNo} is already assigned.`;
    return "";
  }

  function addDiamond(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const diamond = readDiamondForm(event);
    const error = validateUniqueDiamond(diamond);
    if (error) {
      setDialogError(error);
      return;
    }

    const id = records.reduce((largest, record) => Math.max(largest, record.id), 0) + 1;
    setRecords((previous) => [{ id, ...diamond }, ...previous]);
    setQuery(diamond.code);
    setDraftShape(allShapesLabel);
    setDraftColor(allColorsLabel);
    setShapeFilter(allShapesLabel);
    setColorFilter(allColorsLabel);
    setCurrentPage(1);
    setActivityMessage(`${diamond.code} was added to the diamond list.`);
    closeDialog();
  }

  function updateDiamond(event: FormEvent<HTMLFormElement>, diamondId: number) {
    event.preventDefault();
    const diamond = readDiamondForm(event);
    const error = validateUniqueDiamond(diamond, diamondId);
    if (error) {
      setDialogError(error);
      return;
    }

    setRecords((previous) => previous.map((record) => record.id === diamondId ? { id: diamondId, ...diamond } : record));
    setActivityMessage(`${diamond.code} was updated.`);
    closeDialog();
  }

  function addStock(event: FormEvent<HTMLFormElement>, diamond: DiamondRecord) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const quantity = Number(form.get("quantity") ?? 0);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      setDialogError("Enter a whole stock quantity greater than zero.");
      return;
    }

    setRecords((previous) => previous.map((record) => (
      record.id === diamond.id ? { ...record, stock: record.stock + quantity } : record
    )));
    setActivityMessage(`${quantity} unit${quantity === 1 ? "" : "s"} added to ${diamond.code}.`);
    closeDialog();
  }

  async function importDiamonds(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const rows = parseImportedRows(file.name, await file.text());
      const existingCodes = new Set(records.map((diamond) => diamond.code));
      const existingCertificates = new Set(records.map((diamond) => diamond.certificateNo));
      let nextId = records.reduce((largest, record) => Math.max(largest, record.id), 0) + 1;
      const imported: DiamondRecord[] = [];

      for (const row of rows) {
        const diamond = readImportedDiamond(row);
        if (!diamond || existingCodes.has(diamond.code) || existingCertificates.has(diamond.certificateNo)) continue;
        imported.push({ id: nextId, ...diamond });
        nextId += 1;
        existingCodes.add(diamond.code);
        existingCertificates.add(diamond.certificateNo);
      }

      if (imported.length === 0) {
        setActivityMessage(`No new valid diamonds were found in ${file.name}.`);
        return;
      }

      setRecords((previous) => [...imported, ...previous]);
      setCurrentPage(1);
      setActivityMessage(`Imported ${imported.length.toLocaleString("en-US")} diamond${imported.length === 1 ? "" : "s"} from ${file.name}.`);
    } catch (error) {
      setActivityMessage(error instanceof Error ? error.message : `Could not import ${file.name}.`);
    }
  }

  function exportFilteredDiamonds() {
    downloadDiamonds(filteredDiamonds);
    setActivityMessage(`Exported ${filteredDiamonds.length.toLocaleString("en-US")} diamonds to CSV.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <div className={styles.headerActions}>
            <input
              accept=".csv,text/csv,.json,application/json"
              className={styles.hiddenInput}
              onChange={importDiamonds}
              ref={importInputRef}
              type="file"
            />
            <button className="button" onClick={() => importInputRef.current?.click()} type="button">
              <Upload aria-hidden="true" size={16} />
              Import
            </button>
            <button className="button" onClick={exportFilteredDiamonds} type="button">
              <Download aria-hidden="true" size={16} />
              Export
            </button>
            <button className="button button--primary" onClick={() => openDialog({ mode: "add" })} type="button">
              <Plus aria-hidden="true" size={17} />
              Add Diamond
            </button>
          </div>
        )}
        description="View and manage all diamonds"
        title="Diamond List"
      />

      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <label className={styles.searchField}>
            <Search aria-hidden="true" size={17} />
            <span className="sr-only">Search diamonds by code, certificate number, or shape</span>
            <input
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by code, certificate no, shape..."
              type="search"
              value={query}
            />
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Choose a diamond shape</span>
            <select onChange={(event) => setDraftShape(event.target.value as ShapeFilter)} value={draftShape}>
              <option>{allShapesLabel}</option>
              {diamondShapes.map((shape) => <option key={shape}>{shape}</option>)}
            </select>
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Choose a diamond color</span>
            <select onChange={(event) => setDraftColor(event.target.value as ColorFilter)} value={draftColor}>
              <option>{allColorsLabel}</option>
              {diamondColors.map((color) => <option key={color}>{color}</option>)}
            </select>
          </label>
          <button
            className={`button ${styles.filterButton} ${unappliedFilters ? styles.filterButtonPending : ""}`}
            onClick={applyFilters}
            type="button"
          >
            <Filter aria-hidden="true" size={16} />
            Filter
          </button>
        </div>

        <p aria-live="polite" className={activityMessage ? styles.activity : "sr-only"}>{activityMessage}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Diamond inventory list</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Code</th>
                <th scope="col">Shape</th>
                <th scope="col">Carat</th>
                <th scope="col">Color</th>
                <th scope="col">Clarity</th>
                <th scope="col">Certificate No</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((diamond, index) => (
                <tr key={diamond.id}>
                  <td className={styles.rowNumber}>{firstVisible + index}</td>
                  <td><DiamondThumbnail diamond={diamond} /></td>
                  <td>
                    <button
                      className={styles.codeButton}
                      onClick={() => openDialog({ mode: "view", diamondId: diamond.id })}
                      type="button"
                    >
                      {diamond.code}
                    </button>
                  </td>
                  <td>{diamond.shape}</td>
                  <td className={styles.numeric}>{formatCarat(diamond.carat)}</td>
                  <td>{diamond.color}</td>
                  <td>{diamond.clarity}</td>
                  <td className={styles.certificate}>{diamond.certificateNo}</td>
                  <td><DiamondStatusBadge /></td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        aria-label={`View ${diamond.code}`}
                        onClick={() => openDialog({ mode: "view", diamondId: diamond.id })}
                        title="View diamond"
                        type="button"
                      >
                        <Eye aria-hidden="true" size={15} />
                      </button>
                      <button
                        aria-label={`Edit ${diamond.code}`}
                        onClick={() => openDialog({ mode: "edit", diamondId: diamond.id })}
                        title="Edit diamond"
                        type="button"
                      >
                        <FilePenLine aria-hidden="true" size={15} />
                      </button>
                      <button
                        aria-label={`Add stock for ${diamond.code}`}
                        onClick={() => openDialog({ mode: "stock", diamondId: diamond.id })}
                        title="Add stock"
                        type="button"
                      >
                        <Plus aria-hidden="true" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td className={styles.emptyState} colSpan={10}>
                    <Search aria-hidden="true" size={26} />
                    <strong>No diamonds found</strong>
                    <span>Try another code, certificate, shape, or color.</span>
                    <button className="button button--outline-gold" onClick={clearFilters} type="button">Clear filters</button>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.tableFooter}>
          <p>Showing {firstVisible} to {lastVisible} of {filteredDiamonds.length.toLocaleString("en-US")} diamonds</p>
          <nav aria-label="Diamond list pagination" className={styles.pagination}>
            <button
              aria-label="Previous page"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              type="button"
            >
              <ChevronLeft aria-hidden="true" size={17} />
            </button>
            {paginationItems(safePage, pageCount).map((item, index) => item === "ellipsis" ? (
              <span aria-hidden="true" className={styles.ellipsis} key={`ellipsis-${index}`}>…</span>
            ) : (
              <button
                aria-current={safePage === item ? "page" : undefined}
                className={safePage === item ? styles.currentPage : ""}
                key={item}
                onClick={() => setCurrentPage(item)}
                type="button"
              >
                {item}
              </button>
            ))}
            <button
              aria-label="Next page"
              disabled={safePage === pageCount}
              onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
              type="button"
            >
              <ChevronRight aria-hidden="true" size={17} />
            </button>
          </nav>
        </footer>
      </Card>

      {dialog ? (
        <div
          className={styles.modalBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section
            aria-labelledby="diamond-dialog-title"
            aria-modal="true"
            className={styles.modal}
            ref={modalRef}
            role="dialog"
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 id="diamond-dialog-title">
                  {dialog.mode === "add"
                    ? "Add Diamond"
                    : dialog.mode === "edit"
                      ? "Edit Diamond"
                      : dialog.mode === "stock"
                        ? "Add Diamond Stock"
                        : "Diamond Details"}
                </h2>
                <p>
                  {dialog.mode === "add"
                    ? "Register a certified diamond in your inventory."
                    : dialog.mode === "edit"
                      ? `Update ${selectedDiamond?.code ?? "diamond"} details.`
                      : dialog.mode === "stock"
                        ? `Increase the stock quantity for ${selectedDiamond?.code ?? "this diamond"}.`
                        : "Certificate, grading, and stock information."}
                </p>
              </div>
              <button aria-label="Close dialog" className={styles.closeButton} onClick={closeDialog} type="button">
                <X aria-hidden="true" size={19} />
              </button>
            </div>

            {dialog.mode === "add" ? (
              <DiamondForm error={dialogError} mode="add" onCancel={closeDialog} onSubmit={addDiamond} />
            ) : dialog.mode === "edit" && selectedDiamond ? (
              <DiamondForm
                error={dialogError}
                initialValue={selectedDiamond}
                key={selectedDiamond.id}
                mode="edit"
                onCancel={closeDialog}
                onSubmit={(event) => updateDiamond(event, selectedDiamond.id)}
              />
            ) : dialog.mode === "stock" && selectedDiamond ? (
              <form className={styles.stockForm} onSubmit={(event) => addStock(event, selectedDiamond)}>
                {dialogError ? <p className={styles.formError} role="alert">{dialogError}</p> : null}
                <div className={styles.stockIdentity}>
                  <DiamondThumbnail diamond={selectedDiamond} />
                  <div>
                    <strong>{selectedDiamond.code}</strong>
                    <span>{selectedDiamond.shape} · {formatCarat(selectedDiamond.carat)} ct · {selectedDiamond.clarity}</span>
                  </div>
                  <p><span>Current stock</span><strong>{selectedDiamond.stock}</strong></p>
                </div>
                <label>
                  <span>Quantity to add</span>
                  <input autoFocus className="field" defaultValue="1" min="1" name="quantity" required step="1" type="number" />
                </label>
                <div className={styles.modalActions}>
                  <button className="button" onClick={closeDialog} type="button">Cancel</button>
                  <button className="button button--primary" type="submit"><PackagePlus aria-hidden="true" size={16} /> Add Stock</button>
                </div>
              </form>
            ) : selectedDiamond ? (
              <div className={styles.details}>
                <div className={styles.detailsHero}>
                  <DiamondThumbnail diamond={selectedDiamond} large />
                  <div>
                    <span className={styles.eyebrow}>Certified diamond</span>
                    <h3>{selectedDiamond.code}</h3>
                    <p>{selectedDiamond.shape} cut · {formatCarat(selectedDiamond.carat)} carat</p>
                  </div>
                  <DiamondStatusBadge />
                </div>
                <dl>
                  <div><dt>Shape</dt><dd>{selectedDiamond.shape}</dd></div>
                  <div><dt>Carat</dt><dd>{formatCarat(selectedDiamond.carat)}</dd></div>
                  <div><dt>Color</dt><dd>{selectedDiamond.color}</dd></div>
                  <div><dt>Clarity</dt><dd>{selectedDiamond.clarity}</dd></div>
                  <div><dt>Certificate No</dt><dd>{selectedDiamond.certificateNo}</dd></div>
                  <div><dt>Stock</dt><dd>{selectedDiamond.stock} unit{selectedDiamond.stock === 1 ? "" : "s"}</dd></div>
                </dl>
                <div className={styles.certificateNote}>
                  <BadgeCheck aria-hidden="true" size={18} />
                  <div><strong>Certificate recorded</strong><span>The grading reference is attached to this inventory record.</span></div>
                </div>
                <div className={styles.modalActions}>
                  <button className="button" onClick={closeDialog} type="button">Close</button>
                  <button
                    className="button button--primary"
                    onClick={() => openDialog({ mode: "edit", diamondId: selectedDiamond.id })}
                    type="button"
                  >
                    <FilePenLine aria-hidden="true" size={16} /> Edit Diamond
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.missingRecord}>
                <Gem aria-hidden="true" size={28} />
                <strong>Diamond record not found</strong>
                <button className="button" onClick={closeDialog} type="button">Close</button>
              </div>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
