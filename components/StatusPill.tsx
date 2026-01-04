"use client";

type Status = "taken" | "skipped" | "missed";

export default function StatusPill({ status }: { status: Status }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border";

  const cls =
    status === "taken"
      ? `${base} bg-green-50 text-green-700 border-green-200`
      : status === "skipped"
        ? `${base} bg-amber-50 text-amber-700 border-amber-200`
        : `${base} bg-red-50 text-red-700 border-red-200`;

  const label =
    status === "taken" ? "Taken" : status === "skipped" ? "Skipped" : "Missed";

  return <span className={cls}>{label}</span>;
}
