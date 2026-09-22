"use client";

import { ChevronDown, Pencil, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  defaultCategories,
  getCategorySnapshot,
  INITIAL_CATEGORY_SNAPSHOT,
  parseCategories,
  persistCategories,
  subscribeToExpenseData,
  type ExpenseCategory,
} from "./purchase-expense-data";
import { SuiteDialog, SuiteHeader } from "./suite-components";
import styles from "./purchase-expense-suite.module.css";

type DraftCategory = Omit<ExpenseCategory, "id"> & { id?: string };

const emptyCategory: DraftCategory = { name: "", description: "", status: "Active" };

export function ExpenseCategoryManager() {
  const snapshot = useSyncExternalStore(subscribeToExpenseData, getCategorySnapshot, () => INITIAL_CATEGORY_SNAPSHOT);
  const categories = useMemo(() => parseCategories(snapshot), [snapshot]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState<DraftCategory | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ExpenseCategory | null>(null);
  const [message, setMessage] = useState("");

  function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    const name = draft.name.trim();
    const description = draft.description.trim();
    if (!name || !description) return;
    const duplicate = categories.some((category) => category.id !== draft.id && category.name.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      setMessage("A category with that name already exists.");
      return;
    }
    const record: ExpenseCategory = { ...draft, id: draft.id ?? `category-${crypto.randomUUID()}`, name, description };
    const next = draft.id ? categories.map((category) => category.id === draft.id ? record : category) : [...categories, record];
    persistCategories(next);
    setDraft(null);
    setMessage(`${record.name} ${draft.id ? "updated" : "added"} successfully.`);
  }

  function deleteCategory() {
    if (!pendingDelete) return;
    persistCategories(categories.filter((category) => category.id !== pendingDelete.id));
    setMessage(`${pendingDelete.name} deleted.`);
    setPendingDelete(null);
  }

  function restoreDefaults() {
    persistCategories(defaultCategories);
    setMenuOpen(false);
    setMessage("Default purchase expense categories restored.");
  }

  return (
    <div className={styles.page}>
      <SuiteHeader action={<div className={styles.actionMenu}><button aria-expanded={menuOpen} className={styles.primaryButton} onClick={() => setMenuOpen((open) => !open)} type="button"><Plus size={16} />Add Category<ChevronDown size={14} /></button>{menuOpen ? <div className={styles.menu} role="menu"><button onClick={() => { setDraft({ ...emptyCategory }); setMenuOpen(false); }} role="menuitem" type="button"><Plus size={14} />Create category</button><button onClick={restoreDefaults} role="menuitem" type="button"><RotateCcw size={14} />Restore defaults</button></div> : null}</div>} title="Purchase Expense Category" />

      <p aria-live="polite" className={message ? styles.feedback : "sr-only"}>{message}</p>

      <Card className={styles.tableCard}>
        <div className={styles.tableScroller}>
          <table className={`${styles.table} ${styles.categoryTable}`}>
            <caption className="sr-only">Purchase expense categories</caption>
            <thead><tr><th scope="col">SL</th><th scope="col">Category Name</th><th scope="col">Description</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {categories.map((category, index) => <tr key={category.id}><td>{index + 1}</td><td><strong>{category.name}</strong></td><td>{category.description}</td><td><span className={`${styles.status} ${category.status === "Active" ? styles.active : styles.inactive}`}>{category.status}</span></td><td><div className={styles.rowActions}><button aria-label={`Edit ${category.name}`} onClick={() => setDraft({ ...category })} type="button"><Pencil size={16} /></button><button aria-label={`Delete ${category.name}`} className={styles.deleteButton} onClick={() => setPendingDelete(category)} type="button"><Trash2 size={16} /></button></div></td></tr>)}
              {!categories.length ? <tr><td className={styles.emptyState} colSpan={5}>No expense categories. Add one to get started.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>

      {draft ? <SuiteDialog description="Category changes are shared with expense entry and reporting." onClose={() => setDraft(null)} title={draft.id ? `Edit ${draft.name}` : "Add Expense Category"}><form className={styles.dialogForm} onSubmit={saveCategory}><label className={styles.control}><span>Category Name <b>*</b></span><input autoFocus className="field" onChange={(event) => setDraft((current) => current ? { ...current, name: event.target.value } : current)} required value={draft.name} /></label><label className={styles.control}><span>Description <b>*</b></span><textarea className="textarea" onChange={(event) => setDraft((current) => current ? { ...current, description: event.target.value } : current)} required value={draft.description} /></label><label className={styles.control}><span>Status</span><select className="select" onChange={(event) => setDraft((current) => current ? { ...current, status: event.target.value as ExpenseCategory["status"] } : current)} value={draft.status}><option>Active</option><option>Inactive</option></select></label><footer className={styles.dialogActions}><button className="button" onClick={() => setDraft(null)} type="button">Cancel</button><button className={styles.primaryButton} type="submit"><Save size={16} />Save Category</button></footer></form></SuiteDialog> : null}

      {pendingDelete ? <SuiteDialog description="Existing expenses keep their historical category name." onClose={() => setPendingDelete(null)} title={`Delete ${pendingDelete.name}?`}><div className={styles.confirmBody}><p>This category will be removed from new expense forms.</p><footer className={styles.dialogActions}><button className="button" onClick={() => setPendingDelete(null)} type="button">Cancel</button><button className={`${styles.primaryButton} ${styles.dangerButton}`} onClick={deleteCategory} type="button"><Trash2 size={16} />Delete Category</button></footer></div></SuiteDialog> : null}
    </div>
  );
}
