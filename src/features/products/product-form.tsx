"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  RotateCcw,
  Save,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type DragEvent, type FormEvent, type KeyboardEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { productCategories } from "./product-data";
import styles from "./product-form.module.css";

const tabs = [
  { id: "basic", label: "Basic Information" },
  { id: "pricing", label: "Pricing & Stock" },
  { id: "materials", label: "Gold & Diamond Details" },
  { id: "images", label: "Images" },
  { id: "additional", label: "Additional Info" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function RequiredMark() {
  return <span className={styles.required}>*</span>;
}

export function ProductForm() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function selectImage(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFeedback("Choose a PNG or JPG image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFeedback("The product image must be 5 MB or smaller.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setImageName(file.name);
    setFeedback(`${file.name} added as the product image.`);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    selectImage(event.dataTransfer.files[0]);
  }

  function removeImage() {
    setPreviewUrl("");
    setImageName("");
    if (imageInputRef.current) imageInputRef.current.value = "";
    setFeedback("Product image removed.");
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    document.getElementById(`product-tab-${nextTab.id}`)?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const productName = String(formData.get("productName") ?? "").trim();
    const productCode = String(formData.get("productCode") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();

    if (!productName || !productCode || !category) {
      setActiveTab("basic");
      setFeedback("Complete Product Name, Product Code / SKU, and Category before saving.");
      requestAnimationFrame(() => {
        const firstMissing = !productName ? "productName" : !productCode ? "productCode" : "category";
        const field = form.elements.namedItem(firstMissing);
        if (field instanceof HTMLElement) field.focus();
      });
      return;
    }

    setFeedback(`${productName} (${productCode}) was saved successfully for this demo.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <Link className={`button ${styles.backButton}`} href="/products">
            <ArrowLeft aria-hidden="true" size={16} />
            Back to List
          </Link>
        )}
        description="Enter product details to add a new jewellery item"
        title="Add New Product"
      />

      <Card
        as="form"
        className={styles.formCard}
        noValidate
        onReset={() => {
          setPreviewUrl("");
          setImageName("");
          setActiveTab("basic");
          setFeedback("Form reset to default values.");
        }}
        onSubmit={handleSubmit}
      >
        <div aria-label="Product form sections" className={styles.tabs} role="tablist">
          {tabs.map((tab, index) => (
            <button
              aria-controls={`product-panel-${tab.id}`}
              aria-selected={activeTab === tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
              id={`product-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              role="tab"
              tabIndex={activeTab === tab.id ? 0 : -1}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section
          aria-labelledby="product-tab-basic"
          className={`${styles.panel} ${styles.basicPanel}`}
          hidden={activeTab !== "basic"}
          id="product-panel-basic"
          role="tabpanel"
        >
          <div className={styles.primaryFields}>
            <div className={styles.fieldGroup}>
              <label htmlFor="product-name">Product Name <RequiredMark /></label>
              <input aria-required="true" className="field" id="product-name" name="productName" placeholder="Enter product name" />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="product-code">Product Code / SKU <RequiredMark /></label>
              <input aria-required="true" className="field" id="product-code" name="productCode" placeholder="Enter product code" />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="product-category">Category <RequiredMark /></label>
              <select aria-required="true" className="select" defaultValue="" id="product-category" name="category">
                <option disabled value="">Select category</option>
                {productCategories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="product-brand">Brand</label>
              <select className="select" defaultValue="" id="product-brand" name="brand">
                <option value="">Select brand</option>
                <option>Aarohan Signature</option>
                <option>Aarohan Bridal</option>
                <option>Heritage Collection</option>
                <option>Unbranded</option>
              </select>
            </div>

            <fieldset className={styles.radioGroup}>
              <legend>Product Type</legend>
              <div className={styles.radioRow}>
                <label><input defaultChecked name="productType" type="radio" value="Gold" />Gold</label>
                <label><input name="productType" type="radio" value="Diamond" />Diamond</label>
                <label><input name="productType" type="radio" value="Other" />Other</label>
              </div>
            </fieldset>

            <div className={styles.fieldGroup}>
              <label htmlFor="product-description">Description</label>
              <textarea className={`textarea ${styles.description}`} id="product-description" name="description" placeholder="Enter product description..." />
            </div>
          </div>

          <aside className={styles.mediaFields}>
            <div className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Product Images</span>
              <input
                accept="image/png,image/jpeg"
                className={styles.hiddenInput}
                onChange={(event) => {
                  selectImage(event.target.files?.[0]);
                  event.currentTarget.value = "";
                }}
                ref={imageInputRef}
                type="file"
              />
              <div
                className={`${styles.uploadArea} ${previewUrl ? styles.hasPreview : ""}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <>
                    <Image
                      alt={`Preview of ${imageName}`}
                      fill
                      sizes="(max-width: 760px) 100vw, 320px"
                      src={previewUrl}
                      unoptimized
                    />
                    <button aria-label="Remove product image" className={styles.removeImage} onClick={removeImage} type="button">
                      <X size={16} />
                    </button>
                    <span className={styles.imageName}>{imageName}</span>
                  </>
                ) : (
                  <button className={styles.uploadPrompt} onClick={() => imageInputRef.current?.click()} type="button">
                    <ImagePlus aria-hidden="true" size={36} strokeWidth={1.45} />
                    <strong>Click to upload images</strong>
                    <span>PNG, JPG up to 5MB</span>
                  </button>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="product-status">Status</label>
              <select className="select" defaultValue="Active" id="product-status" name="status">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className={styles.checkOptions}>
              <label><input name="featured" type="checkbox" />Featured Product</label>
              <label><input name="showInPos" type="checkbox" />Show in POS</label>
            </div>
          </aside>
        </section>

        <section
          aria-labelledby="product-tab-pricing"
          className={`${styles.panel} ${styles.secondaryPanel}`}
          hidden={activeTab !== "pricing"}
          id="product-panel-pricing"
          role="tabpanel"
        >
          <div className={styles.sectionIntro}>
            <h2>Pricing & Stock</h2>
            <p>Set selling rates, stock levels, and making charges.</p>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldGroup}><label htmlFor="cost-price">Cost Price</label><input className="field" id="cost-price" min="0" name="costPrice" placeholder="৳ 0.00" step="0.01" type="number" /></div>
            <div className={styles.fieldGroup}><label htmlFor="selling-price">Selling Price</label><input className="field" id="selling-price" min="0" name="sellingPrice" placeholder="৳ 0.00" step="0.01" type="number" /></div>
            <div className={styles.fieldGroup}><label htmlFor="making-charge">Making Charge</label><input className="field" id="making-charge" min="0" name="makingCharge" placeholder="৳ 0.00" step="0.01" type="number" /></div>
            <div className={styles.fieldGroup}><label htmlFor="wastage">Wastage (%)</label><input className="field" id="wastage" min="0" name="wastage" placeholder="0" step="0.01" type="number" /></div>
            <div className={styles.fieldGroup}><label htmlFor="opening-stock">Opening Stock</label><input className="field" id="opening-stock" min="0" name="openingStock" placeholder="0" type="number" /></div>
            <div className={styles.fieldGroup}><label htmlFor="unit">Unit</label><select className="select" defaultValue="pcs" id="unit" name="unit"><option value="pcs">Pieces (pcs)</option><option value="g">Gram (g)</option><option value="set">Set</option></select></div>
            <div className={styles.fieldGroup}><label htmlFor="reorder-level">Reorder Alert Level</label><input className="field" id="reorder-level" min="0" name="reorderLevel" placeholder="0" type="number" /></div>
            <div className={styles.fieldGroup}><label htmlFor="tax-rate">Tax Rate (%)</label><input className="field" id="tax-rate" min="0" name="taxRate" placeholder="0" step="0.01" type="number" /></div>
          </div>
        </section>

        <section
          aria-labelledby="product-tab-materials"
          className={`${styles.panel} ${styles.secondaryPanel}`}
          hidden={activeTab !== "materials"}
          id="product-panel-materials"
          role="tabpanel"
        >
          <div className={styles.sectionIntro}>
            <h2>Gold & Diamond Details</h2>
            <p>Record metal weight, purity, and stone specifications.</p>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldGroup}><label htmlFor="gold-purity">Gold Purity</label><select className="select" defaultValue="22K" id="gold-purity" name="goldPurity"><option>24K</option><option>22K</option><option>21K</option><option>18K</option><option>14K</option></select></div>
            <div className={styles.fieldGroup}><label htmlFor="gross-weight">Gross Weight (g)</label><input className="field" id="gross-weight" min="0" name="grossWeight" placeholder="0.00" step="0.01" type="number" /></div>
            <div className={styles.fieldGroup}><label htmlFor="net-weight">Net Gold Weight (g)</label><input className="field" id="net-weight" min="0" name="netWeight" placeholder="0.00" step="0.01" type="number" /></div>
            <div className={styles.fieldGroup}><label htmlFor="stone-weight">Stone Weight (g)</label><input className="field" id="stone-weight" min="0" name="stoneWeight" placeholder="0.00" step="0.01" type="number" /></div>
            <div className={styles.fieldGroup}><label htmlFor="diamond-carat">Diamond Carat</label><input className="field" id="diamond-carat" min="0" name="diamondCarat" placeholder="0.00" step="0.01" type="number" /></div>
            <div className={styles.fieldGroup}><label htmlFor="diamond-clarity">Diamond Clarity</label><select className="select" defaultValue="" id="diamond-clarity" name="diamondClarity"><option value="">Select clarity</option><option>FL</option><option>VVS</option><option>VS</option><option>SI</option></select></div>
            <div className={styles.fieldGroup}><label htmlFor="diamond-color">Diamond Color</label><input className="field" id="diamond-color" name="diamondColor" placeholder="e.g. D, E, F" /></div>
            <div className={styles.fieldGroup}><label htmlFor="diamond-cut">Diamond Cut</label><select className="select" defaultValue="" id="diamond-cut" name="diamondCut"><option value="">Select cut</option><option>Excellent</option><option>Very Good</option><option>Good</option></select></div>
          </div>
        </section>

        <section
          aria-labelledby="product-tab-images"
          className={`${styles.panel} ${styles.secondaryPanel}`}
          hidden={activeTab !== "images"}
          id="product-panel-images"
          role="tabpanel"
        >
          <div className={styles.sectionIntro}>
            <h2>Product Images</h2>
            <p>Add or replace the primary image shown in the product catalogue.</p>
          </div>
          <button className={styles.galleryButton} onClick={() => imageInputRef.current?.click()} type="button">
            <UploadCloud aria-hidden="true" size={31} strokeWidth={1.5} />
            <strong>{previewUrl ? "Replace product image" : "Upload product image"}</strong>
            <span>{imageName || "PNG or JPG, up to 5MB"}</span>
          </button>
        </section>

        <section
          aria-labelledby="product-tab-additional"
          className={`${styles.panel} ${styles.secondaryPanel}`}
          hidden={activeTab !== "additional"}
          id="product-panel-additional"
          role="tabpanel"
        >
          <div className={styles.sectionIntro}>
            <h2>Additional Information</h2>
            <p>Add identifiers and internal catalogue details.</p>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldGroup}><label htmlFor="barcode">Barcode</label><input className="field" id="barcode" name="barcode" placeholder="Scan or enter barcode" /></div>
            <div className={styles.fieldGroup}><label htmlFor="hsn-code">HSN Code</label><input className="field" id="hsn-code" name="hsnCode" placeholder="Enter HSN code" /></div>
            <div className={styles.fieldGroup}><label htmlFor="supplier">Preferred Supplier</label><input className="field" id="supplier" name="supplier" placeholder="Enter supplier name" /></div>
            <div className={styles.fieldGroup}><label htmlFor="collection">Collection</label><input className="field" id="collection" name="collection" placeholder="e.g. Bridal 2025" /></div>
          </div>
          <div className={`${styles.fieldGroup} ${styles.notesField}`}><label htmlFor="internal-notes">Internal Notes</label><textarea className="textarea" id="internal-notes" name="internalNotes" placeholder="Add notes visible to staff only..." /></div>
        </section>

        <p aria-live="polite" className={feedback ? styles.feedback : "sr-only"}>{feedback}</p>

        <footer className={styles.formFooter}>
          <button className="button" type="reset">
            <RotateCcw aria-hidden="true" size={16} />
            Reset
          </button>
          <button className="button button--primary" type="submit">
            <Save aria-hidden="true" size={16} />
            Save Product
          </button>
        </footer>
      </Card>
    </div>
  );
}
