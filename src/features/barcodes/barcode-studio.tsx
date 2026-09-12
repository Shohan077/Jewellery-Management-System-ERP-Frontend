"use client";

import {
  Check,
  ChevronDown,
  CircleCheck,
  Eye,
  Gem,
  Layers3,
  Pencil,
  Printer,
  ScanBarcode,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  barcodeProducts,
  formatWeight,
  initialBarcodeRecords,
  type BarcodeProduct,
  type BarcodeRecord,
} from "./barcode-data";
import styles from "./barcode-studio.module.css";

type StudioMode = "single" | "bulk";
type RecordDialog = { mode: "view" | "edit"; recordId: number } | null;
type PrintItem = { product: BarcodeProduct; barcode: string; quantity: number };

const labelTemplates = ["Jewellery Label (Small)", "Retail Tag (Medium)", "Inventory Label (Compact)"];

function productDisplayName(product: BarcodeProduct) {
  return `${product.name} (${product.code})`;
}

function formatToday() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

function barcodeSegments(value: string) {
  const segments: Array<{ ink: boolean; width: number }> = [
    { ink: true, width: 2 },
    { ink: false, width: 1 },
    { ink: true, width: 1 },
    { ink: false, width: 2 },
  ];

  for (const character of value) {
    const code = character.charCodeAt(0);
    for (let index = 0; index < 6; index += 1) {
      segments.push({
        ink: index % 2 === 0,
        width: ((code >> (index % 5)) & 3) + 1,
      });
    }
  }

  segments.push(
    { ink: true, width: 2 },
    { ink: false, width: 1 },
    { ink: true, width: 3 },
  );
  return segments;
}

function BarcodeVisual({ compact = false, value }: { compact?: boolean; value: string }) {
  const segments = useMemo(() => barcodeSegments(value || "0"), [value]);

  return (
    <figure
      aria-label={`Code 128 barcode ${value}`}
      className={`${styles.barcodeFigure} ${compact ? styles.barcodeCompact : ""}`}
      role="img"
    >
      <span aria-hidden="true" className={styles.barcodeBars}>
        {segments.map((segment, index) => (
          <i
            className={segment.ink ? styles.inkBar : styles.spaceBar}
            key={`${index}-${segment.width}`}
            style={{ flexGrow: segment.width }}
          />
        ))}
      </span>
      <figcaption>{value || "Enter a barcode value"}</figcaption>
    </figure>
  );
}

function JewelleryLabel({
  barcode,
  product,
  template,
}: {
  barcode: string;
  product: BarcodeProduct;
  template: string;
}) {
  const compact = template === "Inventory Label (Compact)";

  return (
    <article
      aria-label={`${template} preview for ${product.name}`}
      className={`${styles.jewelleryLabel} ${compact ? styles.compactLabel : ""}`}
    >
      <header className={styles.labelBrand}>
        <Gem aria-hidden="true" size={24} strokeWidth={2.1} />
        <strong>Aarohan Jewellery</strong>
      </header>
      <div className={styles.labelProduct}>
        <strong>{product.name}</strong>
        <span>{product.purity} | {formatWeight(product.weight)}</span>
        <b>{product.code}</b>
        <Gem aria-hidden="true" className={styles.labelGem} size={31} strokeWidth={1.65} />
      </div>
      <BarcodeVisual compact value={barcode} />
    </article>
  );
}

type ProductComboboxProps = {
  onSelect: (product: BarcodeProduct) => void;
  selectedProduct: BarcodeProduct;
};

function ProductCombobox({ onSelect, selectedProduct }: ProductComboboxProps) {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(() => productDisplayName(selectedProduct));
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery || query === productDisplayName(selectedProduct)) return barcodeProducts;
    return barcodeProducts.filter((product) => (
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.code.toLowerCase().includes(normalizedQuery)
    ));
  }, [query, selectedProduct]);

  function chooseProduct(product: BarcodeProduct) {
    onSelect(product);
    setQuery(productDisplayName(product));
    setOpen(false);
    setActiveIndex(0);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setQuery(productDisplayName(selectedProduct));
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(matches.length - 1, index + 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
      return;
    }

    if (event.key === "Enter" && open && matches[activeIndex]) {
      event.preventDefault();
      chooseProduct(matches[activeIndex]);
    }
  }

  return (
    <div
      className={styles.productCombobox}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setOpen(false);
        setQuery(productDisplayName(selectedProduct));
      }}
    >
      <div className={styles.comboboxInput}>
        <Search aria-hidden="true" size={17} />
        <input
          aria-activedescendant={open && matches[activeIndex] ? `${listboxId}-${matches[activeIndex].id}` : undefined}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={open}
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          role="combobox"
          value={query}
        />
        <ChevronDown aria-hidden="true" size={17} />
      </div>
      <button
        aria-label="Show product choices"
        className={styles.scanButton}
        onClick={() => {
          setOpen((visible) => !visible);
          inputRef.current?.focus();
        }}
        type="button"
      >
        <ScanBarcode aria-hidden="true" size={17} />
      </button>
      {open ? (
        <div className={styles.productOptions} id={listboxId} role="listbox">
          {matches.length ? matches.map((product, index) => (
            <button
              aria-selected={product.id === selectedProduct.id}
              className={index === activeIndex ? styles.activeOption : ""}
              id={`${listboxId}-${product.id}`}
              key={product.id}
              onClick={() => chooseProduct(product)}
              onMouseEnter={() => setActiveIndex(index)}
              role="option"
              type="button"
            >
              <span>{product.name}<small>{product.purity} · {formatWeight(product.weight)}</small></span>
              <b>{product.code}</b>
            </button>
          )) : (
            <p>No products match “{query}”.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function SingleProductForm({
  barcodeValue,
  labelTemplate,
  onBarcodeChange,
  onGenerate,
  onProductSelect,
  onQuantityChange,
  onTemplateChange,
  product,
  quantity,
}: {
  barcodeValue: string;
  labelTemplate: string;
  onBarcodeChange: (value: string) => void;
  onGenerate: () => void;
  onProductSelect: (product: BarcodeProduct) => void;
  onQuantityChange: (quantity: number) => void;
  onTemplateChange: (template: string) => void;
  product: BarcodeProduct;
  quantity: number;
}) {
  return (
    <Card className={styles.formCard}>
      <div className={styles.formField}>
        <label htmlFor="barcode-product">Product Search <b aria-hidden="true">*</b></label>
        <div id="barcode-product">
          <ProductCombobox onSelect={onProductSelect} selectedProduct={product} />
        </div>
      </div>
      <label className={styles.formField}>
        <span>Barcode Type</span>
        <select className="select" defaultValue="Code 128">
          <option>Code 128</option>
          <option>Code 39</option>
          <option>EAN-13</option>
        </select>
      </label>
      <label className={styles.formField}>
        <span>Barcode Value</span>
        <input
          className="field"
          maxLength={32}
          onChange={(event) => onBarcodeChange(event.target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, ""))}
          required
          value={barcodeValue}
        />
      </label>
      <label className={styles.formField}>
        <span>Label Template</span>
        <select className="select" onChange={(event) => onTemplateChange(event.target.value)} value={labelTemplate}>
          {labelTemplates.map((template) => <option key={template}>{template}</option>)}
        </select>
      </label>
      <div className={styles.formBottomRow}>
        <label className={styles.formField}>
          <span>Quantity</span>
          <input
            className="field"
            max="20"
            min="1"
            onChange={(event) => onQuantityChange(Number(event.target.value))}
            required
            step="1"
            type="number"
            value={quantity}
          />
        </label>
        <button className="button button--primary" disabled={!barcodeValue || quantity < 1} onClick={onGenerate} type="button">
          <CircleCheck aria-hidden="true" size={17} /> Generate Barcode
        </button>
      </div>
    </Card>
  );
}

function BulkProductForm({
  labelTemplate,
  onGenerate,
  onQuantityChange,
  onSelectionChange,
  onTemplateChange,
  quantity,
  selectedIds,
}: {
  labelTemplate: string;
  onGenerate: () => void;
  onQuantityChange: (quantity: number) => void;
  onSelectionChange: (ids: number[]) => void;
  onTemplateChange: (template: string) => void;
  quantity: number;
  selectedIds: number[];
}) {
  const allSelected = selectedIds.length === barcodeProducts.length;

  function toggleProduct(productId: number) {
    onSelectionChange(selectedIds.includes(productId)
      ? selectedIds.filter((id) => id !== productId)
      : [...selectedIds, productId]);
  }

  return (
    <Card className={styles.bulkCard}>
      <div className={styles.bulkHeading}>
        <div>
          <strong>Select products</strong>
          <span>{selectedIds.length} of {barcodeProducts.length} selected</span>
        </div>
        <button
          className={styles.textButton}
          onClick={() => onSelectionChange(allSelected ? [] : barcodeProducts.map((product) => product.id))}
          type="button"
        >
          {allSelected ? "Clear all" : "Select all"}
        </button>
      </div>
      <div aria-label="Products to generate" className={styles.bulkProducts} role="group">
        {barcodeProducts.map((product) => {
          const checked = selectedIds.includes(product.id);
          return (
            <label className={checked ? styles.bulkProductSelected : ""} key={product.id}>
              <input checked={checked} onChange={() => toggleProduct(product.id)} type="checkbox" />
              <span aria-hidden="true" className={styles.checkbox}>{checked ? <Check size={13} strokeWidth={3} /> : null}</span>
              <span>{product.name}<small>{product.code} · {product.purity}</small></span>
            </label>
          );
        })}
      </div>
      <div className={styles.bulkControls}>
        <label className={styles.formField}>
          <span>Label Template</span>
          <select className="select" onChange={(event) => onTemplateChange(event.target.value)} value={labelTemplate}>
            {labelTemplates.map((template) => <option key={template}>{template}</option>)}
          </select>
        </label>
        <label className={styles.formField}>
          <span>Quantity each</span>
          <input
            className="field"
            max="20"
            min="1"
            onChange={(event) => onQuantityChange(Number(event.target.value))}
            required
            step="1"
            type="number"
            value={quantity}
          />
        </label>
      </div>
      <button
        className={`button button--primary ${styles.bulkGenerate}`}
        disabled={selectedIds.length === 0 || quantity < 1}
        onClick={onGenerate}
        type="button"
      >
        <Layers3 aria-hidden="true" size={17} /> Generate {selectedIds.length || "Bulk"} Barcode{selectedIds.length === 1 ? "" : "s"}
      </button>
    </Card>
  );
}

function RecentBarcodes({
  onDelete,
  onEdit,
  onToggleAll,
  onView,
  records,
  showAll,
}: {
  onDelete: (record: BarcodeRecord) => void;
  onEdit: (record: BarcodeRecord) => void;
  onToggleAll: () => void;
  onView: (record: BarcodeRecord) => void;
  records: BarcodeRecord[];
  showAll: boolean;
}) {
  const visibleRecords = showAll ? records : records.slice(0, 5);

  return (
    <Card className={styles.recentCard}>
      <header className={styles.recentHeader}>
        <h2>Recent Generated Barcodes</h2>
        <button className={styles.viewAll} onClick={onToggleAll} type="button">
          {showAll ? "Show Recent" : "View All"}
        </button>
      </header>
      <div className={styles.tableScroller}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Product Name</th>
              <th scope="col">Code</th>
              <th scope="col">Barcode</th>
              <th scope="col">Date</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleRecords.map((record, index) => (
              <tr key={record.id}>
                <td>{index + 1}</td>
                <td className={styles.productName}>{record.productName}</td>
                <td>{record.code}</td>
                <td className={styles.barcodeValue}>{record.barcode}</td>
                <td>{record.date}</td>
                <td>
                  <div className={styles.rowActions}>
                    <button aria-label={`View ${record.productName} barcode`} onClick={() => onView(record)} type="button">
                      <Eye aria-hidden="true" size={15} />
                    </button>
                    <button aria-label={`Edit ${record.productName} barcode`} onClick={() => onEdit(record)} type="button">
                      <Pencil aria-hidden="true" size={14} />
                    </button>
                    <button aria-label={`Delete ${record.productName} barcode`} onClick={() => onDelete(record)} type="button">
                      <Trash2 aria-hidden="true" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visibleRecords.length === 0 ? (
              <tr><td className={styles.emptyRow} colSpan={6}>No generated barcodes yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function BarcodeStudio() {
  const dialogRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<StudioMode>("single");
  const [selectedProductId, setSelectedProductId] = useState(barcodeProducts[0].id);
  const [barcodeValue, setBarcodeValue] = useState(barcodeProducts[0].barcode);
  const [labelTemplate, setLabelTemplate] = useState(labelTemplates[0]);
  const [quantity, setQuantity] = useState(1);
  const [bulkSelectedIds, setBulkSelectedIds] = useState([1, 2, 3]);
  const [records, setRecords] = useState<BarcodeRecord[]>(initialBarcodeRecords);
  const [printItems, setPrintItems] = useState<PrintItem[]>([
    { product: barcodeProducts[0], barcode: barcodeProducts[0].barcode, quantity: 1 },
  ]);
  const [dialog, setDialog] = useState<RecordDialog>(null);
  const [activityMessage, setActivityMessage] = useState("");
  const [showAll, setShowAll] = useState(false);

  const selectedProduct = barcodeProducts.find((product) => product.id === selectedProductId) ?? barcodeProducts[0];
  const selectedBulkProducts = barcodeProducts.filter((product) => bulkSelectedIds.includes(product.id));
  const previewProduct = mode === "bulk" ? selectedBulkProducts[0] ?? selectedProduct : selectedProduct;
  const previewBarcode = mode === "bulk" ? previewProduct.barcode : barcodeValue;
  const selectedRecord = dialog ? records.find((record) => record.id === dialog.recordId) ?? null : null;
  const selectedRecordProduct = selectedRecord
    ? barcodeProducts.find((product) => product.id === selectedRecord.productId) ?? selectedProduct
    : null;

  useEffect(() => {
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const timer = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("input, button")?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDialog(null);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [dialog]);

  function selectProduct(product: BarcodeProduct) {
    setSelectedProductId(product.id);
    setBarcodeValue(product.barcode);
    setPrintItems([{ product, barcode: product.barcode, quantity }]);
  }

  function upsertRecords(generated: Array<{ product: BarcodeProduct; barcode: string }>) {
    const generatedIds = new Set(generated.map(({ product }) => product.id));
    const date = formatToday();
    let nextId = records.reduce((largest, record) => Math.max(largest, record.id), 0) + 1;
    const generatedRecords = generated.map(({ product, barcode }) => {
      const existing = records.find((record) => record.productId === product.id);
      if (existing) return { ...existing, barcode, date };
      const record: BarcodeRecord = {
        id: nextId,
        productId: product.id,
        productName: product.name,
        code: product.code,
        barcode,
        date,
      };
      nextId += 1;
      return record;
    });
    setRecords([...generatedRecords, ...records.filter((record) => !generatedIds.has(record.productId))]);
  }

  function generateSingle() {
    if (!barcodeValue || quantity < 1) return;
    upsertRecords([{ product: selectedProduct, barcode: barcodeValue }]);
    setPrintItems([{ product: selectedProduct, barcode: barcodeValue, quantity }]);
    setActivityMessage(`${quantity} label${quantity === 1 ? "" : "s"} generated for ${selectedProduct.name}.`);
  }

  function generateBulk() {
    if (selectedBulkProducts.length === 0 || quantity < 1) return;
    const generated = selectedBulkProducts.map((product) => ({ product, barcode: product.barcode }));
    upsertRecords(generated);
    setPrintItems(generated.map(({ product, barcode }) => ({ product, barcode, quantity })));
    const totalLabels = selectedBulkProducts.length * quantity;
    setActivityMessage(`${totalLabels} labels generated for ${selectedBulkProducts.length} products.`);
  }

  function printLabels() {
    if (mode === "single") {
      setPrintItems([{ product: selectedProduct, barcode: barcodeValue, quantity: Math.max(1, quantity) }]);
    } else if (selectedBulkProducts.length > 0) {
      setPrintItems(selectedBulkProducts.map((product) => ({ product, barcode: product.barcode, quantity: Math.max(1, quantity) })));
    }
    window.setTimeout(() => window.print(), 0);
  }

  function deleteRecord(record: BarcodeRecord) {
    if (!window.confirm(`Delete the barcode for ${record.productName}?`)) return;
    setRecords((current) => current.filter((item) => item.id !== record.id));
    setActivityMessage(`${record.productName} barcode was deleted.`);
    if (dialog?.recordId === record.id) setDialog(null);
  }

  function editRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRecord) return;
    const value = String(new FormData(event.currentTarget).get("barcode") ?? "")
      .trim()
      .toUpperCase()
      .replaceAll(/[^A-Z0-9]/g, "");
    if (!value) return;
    setRecords((current) => current.map((record) => record.id === selectedRecord.id ? { ...record, barcode: value } : record));
    if (selectedRecord.productId === selectedProductId) setBarcodeValue(value);
    setActivityMessage(`${selectedRecord.productName} barcode was updated.`);
    setDialog(null);
  }

  const printableLabels = printItems.flatMap((item) => (
    Array.from({ length: Math.min(20, item.quantity) }, (_, index) => ({ ...item, copy: index }))
  ));

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className="button button--primary" onClick={printLabels} type="button">
            <Printer aria-hidden="true" size={17} /> Print Label
          </button>
        )}
        description="Create and print barcodes for products"
        title="Generate Barcode"
      />

      <div className={styles.studioGrid}>
        <section aria-label="Barcode settings" className={styles.settingsColumn}>
          <Card className={styles.tabsCard}>
            <div aria-label="Generation mode" className={styles.tabs} role="tablist">
              <button
                aria-selected={mode === "single"}
                className={mode === "single" ? styles.activeTab : ""}
                onClick={() => setMode("single")}
                role="tab"
                type="button"
              >
                <Tag aria-hidden="true" size={17} /> Single Product
              </button>
              <button
                aria-selected={mode === "bulk"}
                className={mode === "bulk" ? styles.activeTab : ""}
                onClick={() => setMode("bulk")}
                role="tab"
                type="button"
              >
                <Layers3 aria-hidden="true" size={17} /> Bulk Generate
              </button>
            </div>
          </Card>

          {mode === "single" ? (
            <SingleProductForm
              barcodeValue={barcodeValue}
              labelTemplate={labelTemplate}
              onBarcodeChange={setBarcodeValue}
              onGenerate={generateSingle}
              onProductSelect={selectProduct}
              onQuantityChange={setQuantity}
              onTemplateChange={setLabelTemplate}
              product={selectedProduct}
              quantity={quantity}
            />
          ) : (
            <BulkProductForm
              labelTemplate={labelTemplate}
              onGenerate={generateBulk}
              onQuantityChange={setQuantity}
              onSelectionChange={setBulkSelectedIds}
              onTemplateChange={setLabelTemplate}
              quantity={quantity}
              selectedIds={bulkSelectedIds}
            />
          )}
        </section>

        <aside aria-label="Barcode and label preview" className={styles.previewColumn}>
          <Card className={styles.previewCard}>
            <h2>Barcode Preview</h2>
            <BarcodeVisual value={previewBarcode} />
          </Card>
          <Card className={styles.labelPreviewCard}>
            <JewelleryLabel barcode={previewBarcode} product={previewProduct} template={labelTemplate} />
            {mode === "bulk" && selectedBulkProducts.length > 1 ? (
              <span className={styles.previewCount}>+{selectedBulkProducts.length - 1} more selected</span>
            ) : null}
          </Card>
        </aside>
      </div>

      <p aria-live="polite" className={activityMessage ? styles.activity : "sr-only"}>{activityMessage}</p>

      <RecentBarcodes
        onDelete={deleteRecord}
        onEdit={(record) => setDialog({ mode: "edit", recordId: record.id })}
        onToggleAll={() => setShowAll((visible) => !visible)}
        onView={(record) => setDialog({ mode: "view", recordId: record.id })}
        records={records}
        showAll={showAll}
      />

      <section aria-label="Labels prepared for printing" className={styles.printSheet}>
        {printableLabels.map((item) => (
          <JewelleryLabel
            barcode={item.barcode}
            key={`${item.product.id}-${item.copy}`}
            product={item.product}
            template={labelTemplate}
          />
        ))}
      </section>

      {dialog && selectedRecord && selectedRecordProduct ? (
        <div
          className={styles.modalBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDialog(null);
          }}
        >
          <section
            aria-labelledby="barcode-dialog-title"
            aria-modal="true"
            className={styles.modal}
            ref={dialogRef}
            role="dialog"
          >
            <header className={styles.modalHeader}>
              <div>
                <h2 id="barcode-dialog-title">{dialog.mode === "edit" ? "Edit Barcode" : "Barcode Details"}</h2>
                <p>{selectedRecord.productName} · {selectedRecord.code}</p>
              </div>
              <button aria-label="Close dialog" onClick={() => setDialog(null)} type="button"><X size={18} /></button>
            </header>
            {dialog.mode === "edit" ? (
              <form className={styles.editForm} onSubmit={editRecord}>
                <label className={styles.formField}>
                  <span>Barcode Value</span>
                  <input autoFocus className="field" defaultValue={selectedRecord.barcode} maxLength={32} name="barcode" required />
                </label>
                <div className={styles.modalActions}>
                  <button className="button" onClick={() => setDialog(null)} type="button">Cancel</button>
                  <button className="button button--primary" type="submit"><Check size={16} /> Save Changes</button>
                </div>
              </form>
            ) : (
              <div className={styles.detailContent}>
                <JewelleryLabel barcode={selectedRecord.barcode} product={selectedRecordProduct} template={labelTemplate} />
                <dl>
                  <div><dt>Product</dt><dd>{selectedRecord.productName}</dd></div>
                  <div><dt>Product code</dt><dd>{selectedRecord.code}</dd></div>
                  <div><dt>Generated</dt><dd>{selectedRecord.date}</dd></div>
                  <div><dt>Barcode type</dt><dd>Code 128</dd></div>
                </dl>
                <div className={styles.modalActions}>
                  <button className="button" onClick={() => setDialog(null)} type="button">Close</button>
                  <button className="button button--primary" onClick={() => setDialog({ mode: "edit", recordId: selectedRecord.id })} type="button">
                    <Pencil size={15} /> Edit Barcode
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
