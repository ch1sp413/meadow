import {
  ClipboardCheck,
  FileText,
  HeartPulse,
  Home,
  PackageOpen,
  PawPrint,
  PiggyBank,
  Route,
  Users,
  Warehouse
} from "lucide-react";
import type { Role } from "@/lib/supabase/database.types";
import type { Database } from "@/lib/supabase/database.types";

export type FieldType = "text" | "textarea" | "date" | "datetime-local" | "number" | "select";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
};

export type ModuleConfig = {
  key: string;
  title: string;
  singular: string;
  description: string;
  table: keyof Database["public"]["Tables"];
  icon: React.ComponentType<{ className?: string }>;
  writeRoles: Role[];
  fields: FieldConfig[];
  columns: string[];
  primary: string;
  orderBy: string;
};

export const modules: ModuleConfig[] = [
  {
    key: "animals",
    title: "Animals",
    singular: "Animal",
    description: "Resident profiles, intake details, lifecycle status, and care context.",
    table: "animals",
    icon: PawPrint,
    writeRoles: ["owner", "admin", "care_lead", "vet"],
    primary: "name",
    orderBy: "name",
    columns: ["name", "species", "status", "enclosure_name", "intake_date"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "species", label: "Species", type: "text", required: true },
      { name: "status", label: "Status", type: "select", required: true, options: ["intake", "resident", "rehab", "foster", "adopted", "deceased"] },
      { name: "enclosure_name", label: "Enclosure", type: "text" },
      { name: "intake_date", label: "Intake date", type: "date" },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "enclosures",
    title: "Enclosures",
    singular: "Enclosure",
    description: "Capacity, location, current use, and maintenance state.",
    table: "enclosures",
    icon: Warehouse,
    writeRoles: ["owner", "admin", "care_lead"],
    primary: "name",
    orderBy: "name",
    columns: ["name", "type", "capacity", "status"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "type", label: "Type", type: "text", required: true },
      { name: "capacity", label: "Capacity", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["available", "occupied", "quarantine", "maintenance"] },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "care",
    title: "Care",
    singular: "Care task",
    description: "Feeding, cleaning, medication, observation, and daily recurring work.",
    table: "care_tasks",
    icon: ClipboardCheck,
    writeRoles: ["owner", "admin", "care_lead", "vet", "volunteer"],
    primary: "title",
    orderBy: "due_at",
    columns: ["title", "category", "assigned_to", "due_at", "status"],
    fields: [
      { name: "title", label: "Task", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: ["feeding", "cleaning", "medication", "observation", "maintenance", "other"] },
      { name: "assigned_to", label: "Assigned to", type: "text" },
      { name: "due_at", label: "Due", type: "datetime-local" },
      { name: "status", label: "Status", type: "select", options: ["open", "in_progress", "done", "blocked"] },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "medical",
    title: "Medical",
    singular: "Medical record",
    description: "Clinical visits, treatments, vaccinations, and restricted health notes.",
    table: "medical_records",
    icon: HeartPulse,
    writeRoles: ["owner", "admin", "care_lead", "vet"],
    primary: "summary",
    orderBy: "occurred_on",
    columns: ["summary", "animal_name", "record_type", "occurred_on", "clinician"],
    fields: [
      { name: "summary", label: "Summary", type: "text", required: true },
      { name: "animal_name", label: "Animal", type: "text", required: true },
      { name: "record_type", label: "Type", type: "select", options: ["visit", "treatment", "vaccination", "medication", "lab", "note"] },
      { name: "occurred_on", label: "Date", type: "date" },
      { name: "clinician", label: "Clinician", type: "text" },
      { name: "notes", label: "Clinical notes", type: "textarea" }
    ]
  },
  {
    key: "people",
    title: "People",
    singular: "Person",
    description: "Staff, volunteers, contacts, availability, and sanctuary responsibilities.",
    table: "people",
    icon: Users,
    writeRoles: ["owner", "admin"],
    primary: "name",
    orderBy: "name",
    columns: ["name", "person_type", "email", "phone", "status"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "person_type", label: "Type", type: "select", options: ["staff", "volunteer", "vet", "contact"] },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "status", label: "Status", type: "select", options: ["active", "paused", "inactive"] },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "donations",
    title: "Donations",
    singular: "Donation",
    description: "Donor records, pledges, sponsorships, gifts, and offline payments.",
    table: "donations",
    icon: PiggyBank,
    writeRoles: ["owner", "admin", "fundraising"],
    primary: "donor_name",
    orderBy: "received_on",
    columns: ["donor_name", "donation_type", "amount", "received_on", "status"],
    fields: [
      { name: "donor_name", label: "Donor", type: "text", required: true },
      { name: "donation_type", label: "Type", type: "select", options: ["cash", "pledge", "sponsorship", "in_kind", "grant"] },
      { name: "amount", label: "Amount", type: "number" },
      { name: "received_on", label: "Received", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["recorded", "pledged", "received", "acknowledged"] },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "inventory",
    title: "Inventory",
    singular: "Inventory item",
    description: "Feed, medicines, supplies, low-stock alerts, and storage locations.",
    table: "inventory_items",
    icon: PackageOpen,
    writeRoles: ["owner", "admin", "care_lead", "vet"],
    primary: "name",
    orderBy: "name",
    columns: ["name", "category", "quantity", "unit", "reorder_level"],
    fields: [
      { name: "name", label: "Item", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: ["feed", "medicine", "cleaning", "equipment", "other"] },
      { name: "quantity", label: "Quantity", type: "number" },
      { name: "unit", label: "Unit", type: "text" },
      { name: "reorder_level", label: "Reorder level", type: "number" },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "transports",
    title: "Transport",
    singular: "Transport",
    description: "Trips, assigned drivers, animal movements, and transfer status.",
    table: "transports",
    icon: Route,
    writeRoles: ["owner", "admin", "care_lead"],
    primary: "title",
    orderBy: "scheduled_at",
    columns: ["title", "origin", "destination", "scheduled_at", "status"],
    fields: [
      { name: "title", label: "Trip", type: "text", required: true },
      { name: "origin", label: "Origin", type: "text" },
      { name: "destination", label: "Destination", type: "text" },
      { name: "scheduled_at", label: "Scheduled", type: "datetime-local" },
      { name: "status", label: "Status", type: "select", options: ["planned", "in_transit", "completed", "cancelled"] },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  },
  {
    key: "documents",
    title: "Documents",
    singular: "Document",
    description: "Permits, inspections, policies, renewal dates, and uploaded evidence.",
    table: "documents",
    icon: FileText,
    writeRoles: ["owner", "admin"],
    primary: "title",
    orderBy: "renewal_on",
    columns: ["title", "document_type", "renewal_on", "status"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "document_type", label: "Type", type: "select", options: ["permit", "inspection", "policy", "insurance", "contract", "other"] },
      { name: "renewal_on", label: "Renewal date", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["current", "pending", "expired", "archived"] },
      { name: "notes", label: "Notes", type: "textarea" }
    ]
  }
];

export const settingsModule = {
  key: "settings",
  title: "Settings",
  icon: Home
};

export function getModule(key: string) {
  return modules.find((module) => module.key === key);
}

export function canWriteModule(role: Role, module: ModuleConfig) {
  return module.writeRoles.includes(role);
}
