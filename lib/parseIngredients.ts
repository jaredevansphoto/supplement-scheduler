export type ParsedIngredient = {
  name: string;
  amount?: number;
  unit?: string; // mg, mcg, g, IU
  form?: string;
  notes?: string;
};

const UNIT_ALIASES: Record<string, string> = {
  mg: "mg",
  g: "g",
  mcg: "mcg",
  ug: "mcg",
  "µg": "mcg",
  iu: "IU",
  "i.u.": "IU",
  "i.u": "IU",
};

function normalizeUnit(raw?: string) {
  if (!raw) return undefined;
  const k = raw.trim().toLowerCase();
  return UNIT_ALIASES[k] ?? raw.trim();
}

function parseAmount(raw?: string) {
  if (!raw) return undefined;
  const cleaned = raw.replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Parses common supplement label lines like:
 * - "Zinc 25 mg"
 * - "Zinc (as picolinate) 25 mg"
 * - "Vitamin D3 1,000 IU"
 * - "Selenium — 200 mcg"
 *
 * It will also accept messy text: bullets, separators, extra spaces.
 * Lines without a recognizable amount/unit are still kept as name-only items.
 */
export function parseIngredientsFromText(text: string): ParsedIngredient[] {
  const lines = (text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const out: ParsedIngredient[] = [];

  for (const line0 of lines) {
    // remove leading bullets and numbering
    let line = line0
      .replace(/^[\-\*\u2022]+\s*/g, "") // bullets
      .replace(/^\d+[\.\)]\s*/g, "") // "1. " or "1) "
      .trim();

    // normalize separators
    line = line.replace(/\s*[–—]\s*/g, " ").replace(/\s{2,}/g, " ").trim();

    // Try to capture: "<name> (<form>) <amount> <unit>"
    // amount at end is the strongest anchor.
    const m = line.match(
      /^(.*?)(?:\s*\((.*?)\))?\s+([\d.,]+)\s*([a-zA-Zµ\.]+)\s*$/i
    );

    if (m) {
      const name = (m[1] || "").trim();
      const form = (m[2] || "").trim() || undefined;
      const amount = parseAmount(m[3]);
      const unit = normalizeUnit(m[4]);

      if (name) {
        out.push({ name, form, amount, unit });
        continue;
      }
    }

    // Alternate pattern: "<name> <amount><unit>" (no space)
    const m2 = line.match(/^(.*?)(?:\s*\((.*?)\))?\s+([\d.,]+)([a-zA-Zµ\.]+)\s*$/i);
    if (m2) {
      const name = (m2[1] || "").trim();
      const form = (m2[2] || "").trim() || undefined;
      const amount = parseAmount(m2[3]);
      const unit = normalizeUnit(m2[4]);

      if (name) {
        out.push({ name, form, amount, unit });
        continue;
      }
    }

    // If we can’t parse amount/unit, still store as a name-only ingredient
    out.push({ name: line });
  }

  // Light dedupe: if same name+unit+amount repeats, keep first
  const seen = new Set<string>();
  const deduped: ParsedIngredient[] = [];
  for (const i of out) {
    const key = `${i.name.toLowerCase()}|${i.amount ?? ""}|${(i.unit ?? "").toLowerCase()}|${(i.form ?? "").toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(i);
  }

  return deduped;
}
