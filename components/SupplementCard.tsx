"use client";

export type Status = "taken" | "skipped" | "missed";

export type Row = {
  supplementId: string;
  name: string;
  dose: string;
  timing: string;
  notes?: string;
  status: Status;
};

export type StatusSource = "cycle" | "segmented";

function cardAccent(status: Status) {
  if (status === "taken") return "border-l-green-400";
  if (status === "skipped") return "border-l-amber-400";
  return "border-l-red-400";
}

function btnClass(active: boolean) {
  if (active) {
    return "border rounded px-3 py-1 bg-gray-100 text-gray-500 cursor-not-allowed";
  }
  return "border rounded px-3 py-1 hover:bg-gray-50";
}

function nextByCycle(current: Status): Status {
  // Your existing cycle: missed → taken → skipped → missed
  if (current === "missed") return "taken";
  if (current === "taken") return "skipped";
  return "missed";
}

export default function SupplementCard(props: {
  row: Row;
  onSetStatus: (status: Status, source: StatusSource) => void;
}) {
  const { row, onSetStatus } = props;

  const onCycleTap = () => {
    const next = nextByCycle(row.status);
    onSetStatus(next, "cycle");
  };

  const onPick = (s: Status) => {
    if (s === row.status) return;
    onSetStatus(s, "segmented");
  };

  return (
    <div
      className={`border rounded-xl p-4 border-l-4 ${cardAccent(row.status)} transition-colors bg-white`}
      onClick={onCycleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onCycleTap();
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold flex items-center gap-2">
            <span>{row.name}</span>
            <span
              className={
                row.status === "taken"
                  ? "text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200"
                  : row.status === "skipped"
                  ? "text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                  : "text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200"
              }
            >
              {row.status === "taken" ? "Taken" : row.status === "skipped" ? "Skipped" : "Missed"}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            {row.dose} • {row.timing}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Tap card to cycle: Missed → Taken → Skipped
          </div>
        </div>

        {/* Prevent card-tap cycling when using buttons */}
        <div
          className="flex items-center"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="inline-flex overflow-hidden rounded border">
            <button
              className={btnClass(row.status === "taken")}
              disabled={row.status === "taken"}
              onClick={() => onPick("taken")}
              type="button"
            >
              Taken
            </button>
            <button
              className={btnClass(row.status === "skipped")}
              disabled={row.status === "skipped"}
              onClick={() => onPick("skipped")}
              type="button"
            >
              Skipped
            </button>
            <button
              className={btnClass(row.status === "missed")}
              disabled={row.status === "missed"}
              onClick={() => onPick("missed")}
              type="button"
            >
              Missed
            </button>
          </div>
        </div>
      </div>

      {row.notes ? <div className="mt-2 text-sm text-gray-600">{row.notes}</div> : null}
    </div>
  );
}
