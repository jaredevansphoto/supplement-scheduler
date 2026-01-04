export type Status = "taken" | "skipped" | "missed";

export type TodayStatusEventSource = "cycle" | "segmented" | "bulk" | "undo";

export type TodayStatusEvent = {
  id: string;
  stackItemId: string;
  date: string; // yyyy-mm-dd
  timing: string;
  fromStatus: Status;
  toStatus: Status;
  source: TodayStatusEventSource;
  createdAt: number;
  clientTxId?: string;
};
