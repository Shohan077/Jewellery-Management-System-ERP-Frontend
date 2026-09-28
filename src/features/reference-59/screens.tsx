"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  Building2,
  CalendarDays,
  CirclePlus,
  Eye,
  FilePenLine,
  Filter,
  Gem,
  PackageSearch,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  UserRoundCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  DataTable,
  Feedback,
  IconAction,
  Modal,
  StatCard,
  StatusBadge,
  type TableColumn,
} from "@/features/reference-55/shared";
import {
  auditRecords,
  branchSeed,
  diamondSeed,
  type AuditAction,
  type AuditRecord,
  type BranchRecord,
  type DiamondRecord,
} from "./data";
import base from "@/features/reference-55/reference-55.module.css";
import styles from "./reference-59.module.css";

type DialogState<T> = { mode: "add" | "view" | "edit"; row?: T } | null;

function SelectFilter({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: readonly string[];
  value: string;
}) {
  return (
    <label>
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function FilterButton() {
  return <button className={base.primaryButton} type="button"><Filter size={12} />Filter</button>;
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return <button className={base.secondaryButton} onClick={onClick} type="button"><RotateCcw size={12} />Reset</button>;
}

function RowActions({ children }: { children: ReactNode }) {
  return <span className={base.rowActions}>{children}</span>;
}

export function Reference59DiamondInventory() {
  const [rows, setRows] = useState(diamondSeed);
  const [shape, setShape] = useState("All Shape");
  const [color, setColor] = useState("All Color");
  const [clarity, setClarity] = useState("All Clarity");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState<DiamondRecord>>(null);
  const [message, setMessage] = useState("");

  const visibleRows = useMemo(() => rows.filter((row) => (
    (shape === "All Shape" || row.shape === shape)
    && (color === "All Color" || row.color === color)
    && (clarity === "All Clarity" || row.clarity === clarity)
    && (status === "All Status" || row.status === status)
  )), [clarity, color, rows, shape, status]);

  function resetFilters() {
    setShape("All Shape");
    setColor("All Color");
    setClarity("All Clarity");
    setStatus("All Status");
    setPage(1);
  }

  function saveDiamond(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = dialog?.row?.id ?? rows.length + 1;
    const next: DiamondRecord = {
      id,
      code: dialog?.row?.code ?? `DIA-${1000 + id}`,
      shape: String(form.get("shape")),
      carat: String(form.get("carat")),
      color: String(form.get("color")),
      clarity: String(form.get("clarity")),
      cut: String(form.get("cut")),
      certificate: String(form.get("certificate")),
      rate: String(form.get("rate")),
      value: String(form.get("value")),
      status: form.get("status") as DiamondRecord["status"],
    };
    setRows((current) => dialog?.mode === "edit"
      ? current.map((row) => row.id === id ? next : row)
      : [...current, next]);
    setDialog(null);
    setMessage(`${next.code} saved successfully.`);
  }

  const columns: readonly TableColumn<DiamondRecord>[] = [
    { key: "number", label: "#", align: "center", render: (_, index) => index + 1 },
    { key: "code", label: "Diamond ID", render: (row) => <strong>{row.code}</strong> },
    { key: "shape", label: "Shape", render: (row) => row.shape },
    { key: "carat", label: "Carat (ct)", align: "right", render: (row) => row.carat },
    { key: "color", label: "Color", align: "center", render: (row) => row.color },
    { key: "clarity", label: "Clarity", align: "center", render: (row) => row.clarity },
    { key: "cut", label: "Cut", render: (row) => row.cut },
    { key: "certificate", label: "Certificate", render: (row) => row.certificate },
    { key: "rate", label: "Rate (৳/ct)", align: "right", render: (row) => row.rate },
    { key: "value", label: "Value (৳)", align: "right", render: (row) => `৳ ${row.value}` },
    { key: "status", label: "Status", align: "center", render: (row) => <StatusBadge tone={row.status === "In Stock" ? "success" : "warning"}>{row.status}</StatusBadge> },
    {
      key: "actions",
      label: "Action",
      align: "center",
      render: (row) => (
        <RowActions>
          <IconAction label={`View ${row.code}`} onClick={() => setDialog({ mode: "view", row })}><Eye size={12} /></IconAction>
          <IconAction label={`Edit ${row.code}`} onClick={() => setDialog({ mode: "edit", row })}><FilePenLine size={12} /></IconAction>
          <IconAction danger label={`Delete ${row.code}`} onClick={() => { setRows((current) => current.filter((item) => item.id !== row.id)); setMessage(`${row.code} deleted.`); }}><Trash2 size={12} /></IconAction>
        </RowActions>
      ),
    },
  ];

  return (
    <div className={base.page}>
      <section className={styles.metrics}>
        <StatCard icon={<Gem size={18} />} label="Total Diamonds" trend="+14.8%" value="2,458" />
        <StatCard accent="violet" icon={<WalletCards size={18} />} label="Total Value (৳)" trend="+18.6%" value="৳ 34,58,20,000" />
        <StatCard icon={<CirclePlus size={18} />} label="Total Carat (ct)" trend="+9.2%" value="3,245.680" />
        <StatCard accent="orange" icon={<PackageSearch size={18} />} label="Low Stock Items" value="28" />
      </section>

      <Card className={`${styles.filterBar} ${styles.diamondFilters}`}>
        <SelectFilter label="Shape" onChange={setShape} options={["All Shape", "Round", "Princess", "Oval", "Marquise", "Pear", "Emerald", "Cushion", "Heart"]} value={shape} />
        <SelectFilter label="Color" onChange={setColor} options={["All Color", "D", "E", "F", "G"]} value={color} />
        <SelectFilter label="Clarity" onChange={setClarity} options={["All Clarity", "VVS1", "VVS2", "VS1", "VS2", "SI1"]} value={clarity} />
        <SelectFilter label="Status" onChange={setStatus} options={["All Status", "In Stock", "Low Stock"]} value={status} />
        <FilterButton />
        <ResetButton onClick={resetFilters} />
        <span className={styles.spacer} />
        <button className={base.primaryButton} onClick={() => setDialog({ mode: "add" })} type="button"><Plus size={12} />Add Diamond</button>
      </Card>

      {message ? <Feedback>{message}</Feedback> : null}
      <DataTable
        columns={columns}
        currentPage={page}
        minWidth={1120}
        onPageChange={setPage}
        pageCount={5}
        rowKey={(row) => row.id}
        rows={visibleRows}
        showHeader={false}
        title="Diamond Inventory"
        total={2458}
      />

      {dialog?.mode === "view" && dialog.row ? (
        <Modal description={dialog.row.certificate} onClose={() => setDialog(null)} title={`${dialog.row.code} · ${dialog.row.shape}`}>
          <div className={base.viewDetails}>
            <p><span>Carat</span><strong>{dialog.row.carat} ct</strong></p>
            <p><span>Color / Clarity</span><strong>{dialog.row.color} / {dialog.row.clarity}</strong></p>
            <p><span>Cut</span><strong>{dialog.row.cut}</strong></p>
            <p><span>Value</span><strong>৳ {dialog.row.value}</strong></p>
            <p><span>Certificate</span><strong>{dialog.row.certificate}</strong></p>
            <p><span>Status</span><strong>{dialog.row.status}</strong></p>
          </div>
        </Modal>
      ) : dialog ? (
        <Modal onClose={() => setDialog(null)} title={dialog.mode === "add" ? "Add Diamond" : `Edit ${dialog.row?.code}`}>
          <form className={base.formGrid} onSubmit={saveDiamond}>
            <label><span>Shape</span><input defaultValue={dialog.row?.shape} name="shape" required /></label>
            <label><span>Carat</span><input defaultValue={dialog.row?.carat} name="carat" required /></label>
            <label><span>Color</span><input defaultValue={dialog.row?.color} name="color" required /></label>
            <label><span>Clarity</span><input defaultValue={dialog.row?.clarity} name="clarity" required /></label>
            <label><span>Cut</span><input defaultValue={dialog.row?.cut} name="cut" required /></label>
            <label><span>Certificate</span><input defaultValue={dialog.row?.certificate} name="certificate" required /></label>
            <label><span>Rate (৳/ct)</span><input defaultValue={dialog.row?.rate} name="rate" required /></label>
            <label><span>Value (৳)</span><input defaultValue={dialog.row?.value} name="value" required /></label>
            <label className={base.fullField}><span>Status</span><select defaultValue={dialog.row?.status ?? "In Stock"} name="status"><option>In Stock</option><option>Low Stock</option></select></label>
            <footer className={base.modalActions}>
              <button className={base.secondaryButton} onClick={() => setDialog(null)} type="button">Cancel</button>
              <button className={base.primaryButton} type="submit">Save Diamond</button>
            </footer>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

function actionTone(action: AuditAction) {
  if (action === "Delete") return "danger" as const;
  if (action === "Create") return "info" as const;
  return "success" as const;
}

export function Reference59AuditLog() {
  const [user, setUser] = useState("All Users");
  const [module, setModule] = useState("All Modules");
  const [action, setAction] = useState("All Actions");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => auditRecords.filter((row) => (
    (user === "All Users" || row.user === user)
    && (module === "All Modules" || row.module === module)
    && (action === "All Actions" || row.action === action)
  )), [action, module, user]);

  function resetFilters() {
    setUser("All Users");
    setModule("All Modules");
    setAction("All Actions");
    setPage(1);
  }

  const columns: readonly TableColumn<AuditRecord>[] = [
    { key: "number", label: "#", align: "center", render: (_, index) => index + 1 },
    { key: "date", label: "Date & Time", render: (row) => row.dateTime },
    { key: "user", label: "User", render: (row) => row.user },
    { key: "module", label: "Module", render: (row) => row.module },
    { key: "action", label: "Action", align: "center", render: (row) => <StatusBadge tone={actionTone(row.action)}>{row.action}</StatusBadge> },
    { key: "description", label: "Description", render: (row) => row.description },
    { key: "ip", label: "IP Address", render: (row) => row.ip },
  ];

  return (
    <div className={base.page}>
      <Card className={`${styles.filterBar} ${styles.auditFilters}`}>
        <label>
          <span>Date Range</span>
          <span className={base.dateInput}><input defaultValue="01/05/2025 - 31/05/2025" /><CalendarDays size={13} /></span>
        </label>
        <SelectFilter label="User" onChange={setUser} options={["All Users", "Abdul Karim", "Jalal Uddin", "Farhana Islam", "Sathi Akter", "Mehedi Hasan", "Rafiq Islam", "Abu Sayed", "Nasima Begum"]} value={user} />
        <SelectFilter label="Module" onChange={setModule} options={["All Modules", "Sales", "Inventory", "Customers", "Purchase", "Accounts", "Gold Management"]} value={module} />
        <SelectFilter label="Action" onChange={setAction} options={["All Actions", "Create", "Update", "Delete"]} value={action} />
        <FilterButton />
        <ResetButton onClick={resetFilters} />
      </Card>

      <section className={styles.metrics}>
        <StatCard icon={<Activity size={18} />} label="Total Activities" trend="+15.2%" value="1,856" />
        <StatCard accent="green" icon={<CirclePlus size={18} />} label="Create" trend="+12.5%" value="642" />
        <StatCard accent="orange" icon={<FilePenLine size={18} />} label="Update" trend="+18.6%" value="856" />
        <StatCard accent="orange" icon={<Trash2 size={18} />} label="Delete" trend="+9.8%" value="358" />
      </section>

      <DataTable
        columns={columns}
        currentPage={page}
        minWidth={950}
        onPageChange={setPage}
        pageCount={5}
        rowKey={(row) => row.id}
        rows={rows}
        showHeader={false}
        title="Audit Log"
        total={1856}
      />
    </div>
  );
}

export function Reference59BranchManagement() {
  const [rows, setRows] = useState(branchSeed);
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState<BranchRecord>>(null);
  const [message, setMessage] = useState("");

  const visibleRows = useMemo(() => rows.filter((row) => status === "All Status" || row.status === status), [rows, status]);

  function saveBranch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = dialog?.row?.id ?? rows.length + 1;
    const next: BranchRecord = {
      id,
      code: dialog?.row?.code ?? `BR-${String(id).padStart(3, "0")}`,
      name: String(form.get("name")),
      manager: String(form.get("manager")),
      phone: String(form.get("phone")),
      location: String(form.get("location")),
      staff: Number(form.get("staff")),
      status: form.get("status") as BranchRecord["status"],
    };
    setRows((current) => dialog?.mode === "edit"
      ? current.map((row) => row.id === id ? next : row)
      : [...current, next]);
    setDialog(null);
    setMessage(`${next.name} saved successfully.`);
  }

  const columns: readonly TableColumn<BranchRecord>[] = [
    { key: "number", label: "#", align: "center", render: (_, index) => index + 1 },
    { key: "code", label: "Branch Code", render: (row) => <strong>{row.code}</strong> },
    { key: "name", label: "Branch Name", render: (row) => <strong>{row.name}</strong> },
    { key: "manager", label: "Manager", render: (row) => row.manager },
    { key: "phone", label: "Phone", render: (row) => row.phone },
    { key: "location", label: "Location", render: (row) => row.location },
    { key: "staff", label: "Staff", align: "center", render: (row) => row.staff },
    { key: "status", label: "Status", align: "center", render: (row) => <StatusBadge tone={row.status === "Active" ? "success" : "danger"}>{row.status}</StatusBadge> },
    {
      key: "actions",
      label: "Action",
      align: "center",
      render: (row) => (
        <RowActions>
          <IconAction label={`View ${row.name}`} onClick={() => setDialog({ mode: "view", row })}><Eye size={12} /></IconAction>
          <IconAction label={`Edit ${row.name}`} onClick={() => setDialog({ mode: "edit", row })}><FilePenLine size={12} /></IconAction>
        </RowActions>
      ),
    },
  ];

  return (
    <div className={base.page}>
      <section className={styles.metrics}>
        <StatCard icon={<Building2 size={18} />} label="Total Branches" trend="+1" value="12" />
        <StatCard accent="green" icon={<UserRoundCheck size={18} />} label="Active Branches" trend="+1" value="10" />
        <StatCard icon={<UsersRound size={18} />} label="Total Staff" trend="+8" value="145" />
        <StatCard accent="green" icon={<WalletCards size={18} />} label="Total Stock Value (৳)" trend="+16.5%" value="৳ 12,45,80,000" />
      </section>

      <Card className={`${styles.filterBar} ${styles.branchFilters}`}>
        <SelectFilter label="Status" onChange={setStatus} options={["All Status", "Active", "Inactive"]} value={status} />
        <span className={styles.spacer} />
        <button className={base.primaryButton} onClick={() => setDialog({ mode: "add" })} type="button"><Plus size={12} />Add Branch</button>
      </Card>

      {message ? <Feedback>{message}</Feedback> : null}
      <DataTable
        columns={columns}
        currentPage={page}
        minWidth={900}
        onPageChange={setPage}
        pageCount={2}
        rowKey={(row) => row.id}
        rows={visibleRows}
        showHeader={false}
        title="Branch List"
        total={12}
      />

      {dialog?.mode === "view" && dialog.row ? (
        <Modal description={dialog.row.code} onClose={() => setDialog(null)} title={dialog.row.name}>
          <div className={base.viewDetails}>
            <p><span>Manager</span><strong>{dialog.row.manager}</strong></p>
            <p><span>Phone</span><strong>{dialog.row.phone}</strong></p>
            <p><span>Location</span><strong>{dialog.row.location}</strong></p>
            <p><span>Staff</span><strong>{dialog.row.staff}</strong></p>
            <p><span>Status</span><strong>{dialog.row.status}</strong></p>
          </div>
        </Modal>
      ) : dialog ? (
        <Modal onClose={() => setDialog(null)} title={dialog.mode === "add" ? "Add Branch" : `Edit ${dialog.row?.name}`}>
          <form className={base.formGrid} onSubmit={saveBranch}>
            <label><span>Branch Name</span><input defaultValue={dialog.row?.name} name="name" required /></label>
            <label><span>Manager</span><input defaultValue={dialog.row?.manager} name="manager" required /></label>
            <label><span>Phone</span><input defaultValue={dialog.row?.phone} name="phone" required /></label>
            <label><span>Location</span><input defaultValue={dialog.row?.location} name="location" required /></label>
            <label><span>Total Staff</span><input defaultValue={dialog.row?.staff ?? 1} min="1" name="staff" required type="number" /></label>
            <label><span>Status</span><select defaultValue={dialog.row?.status ?? "Active"} name="status"><option>Active</option><option>Inactive</option></select></label>
            <footer className={base.modalActions}>
              <button className={base.secondaryButton} onClick={() => setDialog(null)} type="button">Cancel</button>
              <button className={base.primaryButton} type="submit">Save Branch</button>
            </footer>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

const settingsTabs = [
  "General Settings",
  "Tax & VAT Settings",
  "Invoice Settings",
  "SMS Settings",
  "Backup Settings",
  "Notification Settings",
] as const;

type GeneralSettings = {
  shopName: string;
  shopOwner: string;
  phone: string;
  email: string;
  currency: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  language: string;
  businessType: string;
  financialYearStart: string;
  defaultBranch: string;
  lowStockAlert: boolean;
  barcodePrinting: boolean;
  customerDueAlert: boolean;
  autoBackup: boolean;
  smsNotification: boolean;
};

const initialSettings: GeneralSettings = {
  shopName: "Dream Jewellery",
  shopOwner: "Abdul Karim",
  phone: "01712-345678",
  email: "info@dreamjewellery.com",
  currency: "Bangladeshi Taka (৳)",
  timeZone: "(GMT+06:00) Dhaka",
  dateFormat: "dd/mm/yyyy",
  timeFormat: "12 Hour",
  language: "English",
  businessType: "Jewellery",
  financialYearStart: "01/01/2025",
  defaultBranch: "Head Office",
  lowStockAlert: true,
  barcodePrinting: true,
  customerDueAlert: true,
  autoBackup: true,
  smsNotification: true,
};

function SettingsField({ children, label }: { children: ReactNode; label: string }) {
  return <label className={styles.settingsField}><span>{label}</span>{children}</label>;
}

export function Reference59SystemSettings() {
  const [activeTab, setActiveTab] = useState<(typeof settingsTabs)[number]>("General Settings");
  const [form, setForm] = useState(initialSettings);
  const [message, setMessage] = useState("");

  function update<Key extends keyof GeneralSettings>(key: Key, value: GeneralSettings[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("General settings saved successfully.");
  }

  function reset() {
    setForm(initialSettings);
    setMessage("Settings reset to their saved values.");
  }

  return (
    <div className={base.page}>
      <Card className={styles.settingsShell}>
        <nav aria-label="System settings sections" className={styles.settingsNav}>
          {settingsTabs.map((tab) => (
            <button aria-current={activeTab === tab ? "page" : undefined} key={tab} onClick={() => { setActiveTab(tab); setMessage(""); }} type="button">{tab}</button>
          ))}
        </nav>

        {activeTab === "General Settings" ? (
          <form className={styles.settingsContent} onSubmit={save}>
            <h2>General Settings</h2>
            <div className={styles.settingsGrid}>
              <SettingsField label="Shop Name"><input onChange={(event) => update("shopName", event.target.value)} value={form.shopName} /></SettingsField>
              <SettingsField label="Shop Owner"><input onChange={(event) => update("shopOwner", event.target.value)} value={form.shopOwner} /></SettingsField>
              <SettingsField label="Phone"><input onChange={(event) => update("phone", event.target.value)} value={form.phone} /></SettingsField>
              <SettingsField label="Email"><input onChange={(event) => update("email", event.target.value)} type="email" value={form.email} /></SettingsField>
              <SettingsField label="Currency"><select onChange={(event) => update("currency", event.target.value)} value={form.currency}><option>Bangladeshi Taka (৳)</option><option>US Dollar ($)</option></select></SettingsField>
              <SettingsField label="Time Zone"><select onChange={(event) => update("timeZone", event.target.value)} value={form.timeZone}><option>(GMT+06:00) Dhaka</option><option>(GMT+00:00) UTC</option></select></SettingsField>
              <SettingsField label="Date Format"><select onChange={(event) => update("dateFormat", event.target.value)} value={form.dateFormat}><option>dd/mm/yyyy</option><option>mm/dd/yyyy</option><option>yyyy-mm-dd</option></select></SettingsField>
              <SettingsField label="Time Format"><select onChange={(event) => update("timeFormat", event.target.value)} value={form.timeFormat}><option>12 Hour</option><option>24 Hour</option></select></SettingsField>
              <SettingsField label="Language"><select onChange={(event) => update("language", event.target.value)} value={form.language}><option>English</option><option>বাংলা</option></select></SettingsField>
              <SettingsField label="Business Type"><select onChange={(event) => update("businessType", event.target.value)} value={form.businessType}><option>Jewellery</option><option>Retail</option></select></SettingsField>
              <SettingsField label="Financial Year Start"><span className={styles.dateField}><input onChange={(event) => update("financialYearStart", event.target.value)} value={form.financialYearStart} /><CalendarDays size={13} /></span></SettingsField>
              <SettingsField label="Default Branch"><select onChange={(event) => update("defaultBranch", event.target.value)} value={form.defaultBranch}><option>Head Office</option><option>Uttara Branch</option><option>Mirpur Branch</option></select></SettingsField>
            </div>

            <div className={styles.checkGrid}>
              <label><input checked={form.lowStockAlert} onChange={(event) => update("lowStockAlert", event.target.checked)} type="checkbox" />Enable Low Stock Alert</label>
              <label><input checked={form.barcodePrinting} onChange={(event) => update("barcodePrinting", event.target.checked)} type="checkbox" />Enable Barcode Printing</label>
              <label><input checked={form.customerDueAlert} onChange={(event) => update("customerDueAlert", event.target.checked)} type="checkbox" />Enable Customer Due Alert</label>
              <label><input checked={form.autoBackup} onChange={(event) => update("autoBackup", event.target.checked)} type="checkbox" />Enable Auto Backup</label>
              <label><input checked={form.smsNotification} onChange={(event) => update("smsNotification", event.target.checked)} type="checkbox" />Enable SMS Notification</label>
            </div>

            {message ? <Feedback>{message}</Feedback> : null}
            <footer className={styles.settingsActions}>
              <button className={base.secondaryButton} onClick={reset} type="button"><RotateCcw size={12} />Reset</button>
              <button className={base.primaryButton} type="submit"><Save size={12} />Save Changes</button>
            </footer>
          </form>
        ) : (
          <section className={styles.settingsPlaceholder}>
            <h2>{activeTab}</h2>
            <p>Select the related module from the ERP navigation to manage its detailed configuration.</p>
          </section>
        )}
      </Card>
    </div>
  );
}
