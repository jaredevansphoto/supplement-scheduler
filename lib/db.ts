// lib/db.ts
// Supabase-backed types only (no Dexie).
// Keep these interfaces aligned with your Supabase tables.

export interface UserProfile {
  id: string;
  name: string;
  createdAt: number; // ms epoch
  activeStackId?: string;
}

export interface Stack {
  id: string;
  userId: string;
  name: string;
  createdAt: number; // ms epoch
}

/** Canonical supplement definition (shared across stacks) */
export interface CatalogSupplement {
  id: string;
  userId: string;

  name: string;

  defaultDose: string;
  defaultTiming: string;
  defaultNotes?: string;
  defaultServingsMultiplier?: number;

  createdAt: number; // ms epoch
  updatedAt: number; // ms epoch
}

/** Ingredients belong to the catalog supplement (shared) */
export interface CatalogIngredient {
  id: string;
  catalogSupplementId: string;

  name: string;
  amount?: number;
  unit?: string;
  form?: string;
  notes?: string;

  createdAt: number; // ms epoch
}

/** StackItem = scheduled entry that references a catalog supplement */
export interface StackItem {
  id: string;
  stackId: string;
  catalogSupplementId: string;

  dose: string;
  timing: string;
  notes?: string;
  servingsMultiplier?: number;

  createdAt: number; // ms epoch
}

/** Tracking is per stack-item per day */
export interface DailyLog {
  id: string; // `${stackItemId}_${date}`
  stackItemId: string;
  date: string; // yyyy-mm-dd
  status: "taken" | "skipped" | "missed";
}

/** Event history is per stack-item */
export interface TodayStatusEvent {
  id: string;
  stackItemId: string;
  date: string; // yyyy-mm-dd
  timing: string;
  fromStatus: "taken" | "skipped" | "missed";
  toStatus: "taken" | "skipped" | "missed";
  source: "cycle" | "segmented" | "bulk" | "undo";
  createdAt: number; // ms epoch
  clientTxId?: string;
}
