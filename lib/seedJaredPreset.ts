import {
  createStack,
  getStacksForUser,
  setActiveStackForUser,
  createSupplement,
  replaceIngredientsForSupplement,
} from "@/lib/dbAccess";
import type { ParsedIngredient } from "@/lib/parseIngredients";

type SeedSupplement = {
  name: string;
  dose: string;
  timing: string;
  notes?: string;
  ingredients: ParsedIngredient[];
};

const BASE_STACK_NAME = "Jared — Preset Stack (Imported)";

function nextStackName(existingNames: string[]) {
  if (!existingNames.includes(BASE_STACK_NAME)) return BASE_STACK_NAME;

  let n = 2;
  while (existingNames.includes(`${BASE_STACK_NAME} (${n})`)) n++;
  return `${BASE_STACK_NAME} (${n})`;
}

const PRESET: SeedSupplement[] = [
  {
    name: "ALLMAX Essentials — Liquid L-Carnitine 1500 (Blue Raspberry)",
    dose: "1 tbsp (15 mL)",
    timing: "Morning",
    notes: "Fasted AM. Serving size: 1 tbsp (15 mL).",
    ingredients: [
      { name: "Thiamine (Vitamin B1)", amount: 1.5, unit: "mg" },
      { name: "Pantothenic acid (Vitamin B5)", amount: 5, unit: "mg" },
      { name: "Vitamin B12", amount: 6, unit: "mcg" },
      { name: "L-Carnitine (as L-Carnitine base)", amount: 1500, unit: "mg" },
    ],
  },
  {
    name: "Carlson — The Very Finest Fish Oil (Liquid)",
    dose: "1 tsp (5 mL)",
    timing: "Evening",
    notes: "With dinner (fat helps absorption). Serving size: 1 tsp (5 mL).",
    ingredients: [
      { name: "Norwegian fish oil", amount: 4.6, unit: "g" },
      { name: "Total Omega-3 fatty acids", amount: 1600, unit: "mg" },
      { name: "EPA", amount: 800, unit: "mg" },
      { name: "DHA", amount: 500, unit: "mg" },
      { name: "DPA", amount: 90, unit: "mg" },
      { name: "Vitamin E (as alpha-tocopherol)", amount: 6.7, unit: "mg" },
    ],
  },
  {
    name: "Thorne — NAC",
    dose: "1 capsule",
    timing: "Morning",
    notes: "Per capsule. Fasted OK.",
    ingredients: [{ name: "N-Acetyl-L-Cysteine (NAC)", amount: 500, unit: "mg" }],
  },
  {
    name: "Thorne — D-1,000 (Vitamin D3)",
    dose: "1 capsule",
    timing: "With meal",
    notes: "With food (fat helps). Per capsule.",
    ingredients: [{ name: "Vitamin D3 (cholecalciferol)", amount: 25, unit: "mcg", notes: "1,000 IU" }],
  },
  {
    name: "Thorne — Rhodiola",
    dose: "1 capsule",
    timing: "Morning",
    notes: "Cycling recommended (5 on / 2 off). Per capsule.",
    ingredients: [
      {
        name: "Rhodiola rosea root extract",
        amount: 100,
        unit: "mg",
        notes: "5:1; standardized to 3% rosavins & 1% salidrosides",
      },
    ],
  },
  {
    name: "Thorne — Calcium-Magnesium Malate",
    dose: "1 capsule",
    timing: "With meal",
    notes: "Separate from zinc complex if possible. Per capsule.",
    ingredients: [
      { name: "Calcium (as calcium citrate-malate)", amount: 100, unit: "mg" },
      { name: "Magnesium (as magnesium citrate-malate)", amount: 100, unit: "mg" },
    ],
  },
  {
    name: "Thorne — Thyrocsin",
    dose: "1 capsule",
    timing: "Morning",
    notes: "Stimulating; keep earlier. Per capsule.",
    ingredients: [
      { name: "L-Tyrosine", amount: 250, unit: "mg" },
      { name: "Vitamin C (ascorbic acid)", amount: 100, unit: "mg" },
      { name: "Ashwagandha root extract (KSM-66)", amount: 45, unit: "mg", notes: "15:1" },
      { name: "Vitamin E (d-alpha tocopheryl acid succinate)", amount: 33.5, unit: "mg", notes: "50 IU" },
      { name: "Zinc (as zinc bisglycinate)", amount: 2.5, unit: "mg" },
      { name: "Copper (as copper bisglycinate)", amount: 250, unit: "mcg" },
      { name: "Iodine (as potassium iodide)", amount: 112.5, unit: "mcg" },
      { name: "Vitamin B12 (as methylcobalamin)", amount: 50, unit: "mcg" },
      { name: "Selenium (as selenomethionine)", amount: 50, unit: "mcg" },
    ],
  },
  {
    name: "Thorne — Multi-Vitamin Elite A.M.",
    dose: "1 capsule",
    timing: "With meal",
    notes:
      "Outer panel only. Label says medicinal ingredients continue on inner panel (incomplete list here).",
    ingredients: [
      { name: "Vitamin C (ascorbic acid)", amount: 83.4, unit: "mg" },
      { name: "Curcuminoids–phosphatidylcholine complex", amount: 66.7, unit: "mg", notes: "33% curcuminoids" },
      { name: "Green tea polyphenols–phosphatidylcholine complex", amount: 25, unit: "mg", notes: "15% EGCG" },
      { name: "Magnesium (as bisglycinate)", amount: 21, unit: "mg" },
      { name: "Niacin (as niacinamide)", amount: 20, unit: "mg" },
      { name: "Thiamine (as thiamine HCl)", amount: 16.7, unit: "mg" },
      { name: "Pantothenic acid (as calcium D-pantothenate)", amount: 15, unit: "mg" },
      { name: "Calcium (as bisglycinate)", amount: 12.7, unit: "mg" },
      { name: "D-gamma tocopherol", amount: 8, unit: "mg" },
      { name: "Vitamin B6 (as P-5-P)", amount: 6.7, unit: "mg" },
      { name: "Choline (as choline dihydrogen citrate)", amount: 6, unit: "mg" },
      { name: "Vitamin E (d-alpha tocopheryl acid succinate)", amount: 4.5, unit: "mg", notes: "AT (6.7 IU)" },
      { name: "Riboflavin (as riboflavin-5-phosphate sodium)", amount: 4, unit: "mg" },
      { name: "Zinc (as bisglycinate)", amount: 3.4, unit: "mg" },
    ],
  },
  {
    name: "Natural Factors — Ubiquinol Active CoQ10 200 mg",
    dose: "1 softgel",
    timing: "With meal",
    notes: "With food (fat). Use this OR the 100 mg version, not both.",
    ingredients: [
      { name: "CoQ10 (ubiquinol form)", amount: 200, unit: "mg" },
      { name: "Organic flaxseed oil", amount: 340, unit: "mg" },
    ],
  },
  {
    name: "Natural Factors — Ubiquinol Active CoQ10 100 mg",
    dose: "1 softgel",
    timing: "With meal",
    notes: "With food (fat). Use this OR the 200 mg version, not both.",
    ingredients: [
      { name: "CoQ10 (ubiquinol form)", amount: 100, unit: "mg" },
      { name: "Organic flaxseed oil", amount: 170, unit: "mg" },
    ],
  },
  {
    name: "Organika — Magnesium Bisglycinate 200 mg",
    dose: "1 capsule",
    timing: "Bedtime",
    notes: "Bedtime. Adjust if GI side effects.",
    ingredients: [{ name: "Magnesium (as magnesium bisglycinate)", amount: 200, unit: "mg" }],
  },
  {
    name: "HOST (Healthcare Professional) — Choline",
    dose: "2 capsules",
    timing: "With meal",
    notes: "Serving size: 2 capsules.",
    ingredients: [{ name: "Choline (as choline bitartrate)", amount: 410, unit: "mg" }],
  },
  {
    name: "Nutratology — Turmeric Curcumin (with BioPerine)",
    dose: "1 capsule",
    timing: "Evening",
    notes: "With dinner. Consider optional if using Estro Control.",
    ingredients: [
      { name: "Turmeric (Curcuma longa, rhizome)", amount: 500, unit: "mg" },
      { name: "Turmeric extract 25:1 (95% curcuminoids)", amount: 50, unit: "mg", notes: "1250 mg dried herb equiv." },
      { name: "BioPerine black pepper extract (95% piperine)", amount: 5, unit: "mg" },
    ],
  },
  {
    name: "Webber Naturals — Vitamin B2 (Riboflavin) 100 mg",
    dose: "1 tablet",
    timing: "Morning",
    notes: "Water-soluble; urine may be bright yellow.",
    ingredients: [{ name: "Vitamin B2 (riboflavin)", amount: 100, unit: "mg" }],
  },
  {
    name: "DHN — Organic Beetroot",
    dose: "2 capsules",
    timing: "Pre-workout",
    notes: "Front indicates 1400 mg per 2-capsule serving.",
    ingredients: [{ name: "Organic beetroot (Beta vulgaris) root", amount: 1400, unit: "mg", notes: "per 2 capsules" }],
  },
  {
    name: "ATP Lab — Alpha Jack (Men’s Health)",
    dose: "1 capsule",
    timing: "With meal",
    notes: "Cycle recommended (e.g., 8w on / 2–4w off).",
    ingredients: [
      { name: "D-Aspartic acid", amount: 500, unit: "mg" },
      { name: "Tongkat ali root extract 100:1", amount: 66.67, unit: "mg" },
      { name: "Maca root extract 12:1", amount: 33.3, unit: "mg" },
      { name: "Cordyceps (Ophiocordyceps sinensis) stroma", amount: 50, unit: "mg" },
      { name: "Shilajit", amount: 41.66, unit: "mg" },
    ],
  },
  {
    name: "ATP Lab — Estro Control (Women’s Health)",
    dose: "1 capsule",
    timing: "With meal",
    notes: "Cycle recommended. Contains DIM + sulforaphane components.",
    ingredients: [
      { name: "ACUMIN turmeric extract", amount: 60, unit: "mg" },
      { name: "Green tea extract 10:1", amount: 100, unit: "mg" },
      { name: "DIM (BioResponse)", amount: 100, unit: "mg" },
      { name: "Calcium-D-glucarate", amount: 200, unit: "mg" },
      { name: "Sulforaphane glucosinolate (standardized 20%)", amount: 60, unit: "mg" },
      { name: "BroccoPhane (broccoli-derived ingredient)", amount: 150, unit: "mg" },
    ],
  },
  {
    name: "Vibrant Naturals — Zinc, Copper & Selenium Mineral Complex",
    dose: "1 capsule",
    timing: "Evening",
    notes: "Cycle 5 days on / 2 off. Take with dinner to reduce nausea risk.",
    ingredients: [
      { name: "Zinc (as zinc picolinate)", amount: 25, unit: "mg" },
      { name: "Copper (as copper (II) bisglycinate)", amount: 2.5, unit: "mg" },
      { name: "Selenium (as selenomethionine)", amount: 200, unit: "mcg" },
    ],
  },
];

export async function seedJaredPresetStack(userId: string) {
  const stacks = await getStacksForUser(userId);
  const existingNames = stacks.map((s: any) => s.name);

  const stackName = nextStackName(existingNames);
  const stackId = await createStack(userId, stackName);

  // create supplements + ingredients
  for (const s of PRESET) {
    const supplementId = await createSupplement(stackId, s.name, s.dose, s.timing, s.notes);
    await replaceIngredientsForSupplement({
      supplementId,
      ingredients: s.ingredients,
    });
  }

  await setActiveStackForUser(userId, stackId);

  return { stackId, stackName, count: PRESET.length };
}
