import { PrismaClient } from "../lib/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const adapter = new PrismaLibSql({
  url: `file:${path.join(process.cwd(), "prisma", "dev.db")}`,
});

const prisma = new PrismaClient({ adapter });

const upperLimits: Record<string, { rda?: string; ul?: string; units: string; notes?: string }> = {
  "Vitamin A": { rda: "900 mcg RAE", ul: "3,000 mcg RAE", units: "mcg", notes: "Preformed (retinol) is toxic; beta-carotene is safer" },
  "Vitamin B1 (Thiamine)": { rda: "1.2 mg", ul: "None established", units: "mg", notes: "Water-soluble; excess excreted" },
  "Vitamin B2 (Riboflavin)": { rda: "1.3 mg", ul: "None established", units: "mg", notes: "Water-soluble; excess excreted" },
  "Vitamin B3 (Niacinamide)": { rda: "16 mg", ul: "35 mg", units: "mg", notes: "Avoid flushing/liver strain" },
  "Vitamin B5 (Pantothenic Acid)": { rda: "5 mg", ul: "None established", units: "mg", notes: "No toxicity concerns" },
  "Vitamin B6": { rda: "1.7 mg", ul: "100 mg", units: "mg", notes: "Nerve damage at high doses" },
  "Vitamin B7 (Biotin)": { rda: "30 mcg", ul: "None established", units: "mcg", notes: "No known toxicity" },
  "Vitamin B9 (Folate)": { rda: "400 mcg DFE", ul: "1,000 mcg", units: "mcg", notes: "Folic acid (synthetic) UL only" },
  "Vitamin B12": { rda: "2.4 mcg", ul: "None established", units: "mcg", notes: "No known toxicity" },
  "Vitamin C": { rda: "90 mg", ul: "2,000 mg", units: "mg", notes: "GI upset/kidney stones at high doses" },
  "Vitamin D3": { rda: "600 IU", ul: "4,000 IU", units: "IU", notes: "Morning dosing recommended" },
  "Vitamin E": { rda: "15 mg", ul: "1,000 mg", units: "mg", notes: "Synthetic form has lower UL" },
  "Vitamin K": { rda: "120 mcg", ul: "None established", units: "mcg", notes: "Interacts with blood thinners" },
  "Calcium": { rda: "1,000 mg", ul: "2,500 mg", units: "mg", notes: "Cardiovascular risk at high doses" },
  "Magnesium": { rda: "400 mg", ul: "350 mg (supplements)", units: "mg", notes: "Laxative if high; food-sourced exempt" },
  "Zinc": { rda: "11 mg", ul: "40 mg", units: "mg", notes: "Take with food; copper competition" },
  "Copper": { rda: "0.9 mg", ul: "10 mg", units: "mg", notes: "Balance with zinc" },
  "Selenium": { rda: "55 mcg", ul: "400 mcg", units: "mcg", notes: "Hair/nail loss at high doses" },
  "Iron": { rda: "8 mg (men)", ul: "45 mg", units: "mg", notes: "Constipation/organ damage risk" },
  "Iodine": { rda: "150 mcg", ul: "1,100 mcg", units: "mcg", notes: "Thyroid dysfunction at excess" },
  "Manganese": { rda: "2.3 mg", ul: "11 mg", units: "mg", notes: "Neurological issues at high doses" },
  "Chromium": { rda: "35 mcg", ul: "None established", units: "mcg", notes: "Limited toxicity data" },
  "Molybdenum": { rda: "45 mcg", ul: "2,000 mcg", units: "mcg", notes: "Gout-like symptoms at excess" },
  "Potassium": { rda: "3,400 mg", ul: "None (dietary)", units: "mg", notes: "Supplement forms limited by regulations" },
  "Choline": { rda: "550 mg", ul: "3,500 mg", units: "mg", notes: "Fishy odor/hypotension at high doses" },
  "Omega-3 (EPA+DHA)": { rda: "250-500 mg", ul: "3,000 mg", units: "mg", notes: "Bleeding risk at high doses" },
  "L-Carnitine": { rda: "None", ul: "2,000 mg", units: "mg", notes: "GI issues at high doses" },
  "NAC": { rda: "None", ul: "1,200 mg", units: "mg", notes: "GI upset possible" },
  "Alpha Lipoic Acid": { rda: "None", ul: "600 mg", units: "mg", notes: "Low blood sugar risk" },
  "CoQ10": { rda: "None", ul: "1,200 mg", units: "mg", notes: "Generally well tolerated" },
  "Rhodiola": { rda: "None", ul: "680 mg", units: "mg", notes: "Stimulant-like; cycle on/off" },
  "Ashwagandha": { rda: "None", ul: "1,200 mg", units: "mg", notes: "Thyroid effects; cycle" },
  "TMG (Betaine)": { rda: "None", ul: "6,000 mg", units: "mg", notes: "GI upset at high doses" },
  "Phosphatidylserine": { rda: "None", ul: "600 mg", units: "mg", notes: "Generally safe" },
  "Lutein": { rda: "None", ul: "20 mg", units: "mg", notes: "Carotenoid; skin yellowing possible" },
  "Zeaxanthin": { rda: "None", ul: "4 mg", units: "mg", notes: "Often paired with lutein" },
};

const supplements: Record<string, { serving: string; cycleRule?: string; ingredients: Record<string, string> }> = {
  "ALLMAX Liquid L-Carnitine 1500": {
    serving: "1 tbsp (15 mL)",
    ingredients: {
      "L-Carnitine": "1500 mg",
      "Vitamin B1 (Thiamine)": "1.5 mg",
      "Vitamin B3 (Niacinamide)": "20 mg",
      "Vitamin B5 (Pantothenic Acid)": "10 mg",
      "Vitamin B6": "2 mg",
      "Vitamin B12": "6 mcg",
    },
  },
  "Carlson Fish Oil": {
    serving: "1 tsp (5 mL)",
    ingredients: {
      "Omega-3 (EPA+DHA)": "1600 mg",
    },
  },
  "Thorne NAC": {
    serving: "1 capsule",
    ingredients: {
      "NAC": "500 mg",
    },
  },
  "Thorne Rhodiola": {
    serving: "1 capsule",
    cycleRule: "5 on / 2 off; 1-2 weeks off after 6-8 weeks",
    ingredients: {
      "Rhodiola": "100 mg",
    },
  },
  "ATP Lab Methyl Syner-B": {
    serving: "1 capsule",
    ingredients: {
      "Vitamin B1 (Thiamine)": "50 mg",
      "Vitamin B2 (Riboflavin)": "25 mg",
      "Vitamin B3 (Niacinamide)": "25 mg",
      "Vitamin B5 (Pantothenic Acid)": "50 mg",
      "Vitamin B6": "25 mg",
      "Vitamin B7 (Biotin)": "500 mcg",
      "Vitamin B9 (Folate)": "800 mcg",
      "Vitamin B12": "1000 mcg",
      "Choline": "50 mg",
      "TMG (Betaine)": "250 mg",
    },
  },
  "AOR Ortho Core": {
    serving: "3 capsules",
    ingredients: {
      "Vitamin A": "750 mcg",
      "Vitamin C": "200 mg",
      "Vitamin D3": "1000 IU",
      "Vitamin E": "67 mg",
      "Vitamin K": "120 mcg",
      "Vitamin B1 (Thiamine)": "25 mg",
      "Vitamin B2 (Riboflavin)": "25 mg",
      "Vitamin B3 (Niacinamide)": "25 mg",
      "Vitamin B5 (Pantothenic Acid)": "50 mg",
      "Vitamin B6": "25 mg",
      "Vitamin B9 (Folate)": "400 mcg",
      "Vitamin B12": "250 mcg",
      "Calcium": "100 mg",
      "Magnesium": "100 mg",
      "Zinc": "15 mg",
      "Selenium": "100 mcg",
      "Copper": "1 mg",
      "Manganese": "2 mg",
      "Chromium": "100 mcg",
      "Molybdenum": "50 mcg",
      "Potassium": "50 mg",
      "Choline": "25 mg",
      "Alpha Lipoic Acid": "100 mg",
      "CoQ10": "30 mg",
      "Lutein": "3 mg",
    },
  },
  "Pure Encapsulations Magnesium Glycinate": {
    serving: "2 capsules",
    ingredients: {
      "Magnesium": "240 mg",
    },
  },
  "NOW Vitamin D3 5000 IU": {
    serving: "1 softgel",
    ingredients: {
      "Vitamin D3": "5000 IU",
    },
  },
  "Jarrow Formulas Zinc Balance": {
    serving: "1 capsule",
    cycleRule: "5 on / 2 off (M-F on)",
    ingredients: {
      "Zinc": "15 mg",
      "Copper": "1 mg",
    },
  },
  "NOW Selenium": {
    serving: "1 capsule",
    cycleRule: "5 on / 2 off (M-F on)",
    ingredients: {
      "Selenium": "200 mcg",
    },
  },
  "Sports Research Triple Strength Omega-3": {
    serving: "1 softgel",
    ingredients: {
      "Omega-3 (EPA+DHA)": "1040 mg",
    },
  },
  "Jarrow Formulas PS100": {
    serving: "1 softgel",
    ingredients: {
      "Phosphatidylserine": "100 mg",
    },
  },
  "Life Extension Super K": {
    serving: "1 softgel",
    ingredients: {
      "Vitamin K": "2600 mcg",
    },
  },
  "Thorne Basic B Complex": {
    serving: "1 capsule",
    ingredients: {
      "Vitamin B1 (Thiamine)": "40 mg",
      "Vitamin B2 (Riboflavin)": "10 mg",
      "Vitamin B3 (Niacinamide)": "80 mg",
      "Vitamin B5 (Pantothenic Acid)": "45 mg",
      "Vitamin B6": "10 mg",
      "Vitamin B7 (Biotin)": "200 mcg",
      "Vitamin B9 (Folate)": "400 mcg",
      "Vitamin B12": "400 mcg",
      "Choline": "28 mg",
    },
  },
  "Pure Encapsulations Alpha Lipoic Acid": {
    serving: "1 capsule",
    ingredients: {
      "Alpha Lipoic Acid": "400 mg",
    },
  },
};

const dailySchedule = [
  { time: "Upon waking", supplement: "Thorne NAC", dose: "1 capsule (500 mg)", withFood: false, notes: "Empty stomach" },
  { time: "30 min pre-workout", supplement: "Thorne Rhodiola", dose: "2 capsules (200 mg)", withFood: false, notes: "Cycle; avoid late in day" },
  { time: "With breakfast", supplement: "ALLMAX Liquid L-Carnitine 1500", dose: "1 tbsp", withFood: true, notes: "" },
  { time: "With breakfast", supplement: "NOW Vitamin D3 5000 IU", dose: "1 softgel", withFood: true, notes: "Take with fat" },
  { time: "With breakfast", supplement: "Carlson Fish Oil", dose: "1 tsp", withFood: true, notes: "" },
  { time: "With breakfast", supplement: "ATP Lab Methyl Syner-B", dose: "1 capsule", withFood: true, notes: "M/W/F only" },
  { time: "With breakfast", supplement: "AOR Ortho Core", dose: "3 capsules", withFood: true, notes: "T/Th/Sat/Sun only" },
  { time: "With lunch", supplement: "Jarrow Formulas Zinc Balance", dose: "1 capsule", withFood: true, notes: "M-F only; cycle" },
  { time: "With lunch", supplement: "NOW Selenium", dose: "1 capsule", withFood: true, notes: "M-F only; cycle" },
  { time: "With lunch", supplement: "Life Extension Super K", dose: "1 softgel", withFood: true, notes: "Take with fat" },
  { time: "With dinner", supplement: "Sports Research Triple Strength Omega-3", dose: "1 softgel", withFood: true, notes: "" },
  { time: "With dinner", supplement: "Pure Encapsulations Alpha Lipoic Acid", dose: "1 capsule", withFood: true, notes: "" },
  { time: "Before bed", supplement: "Pure Encapsulations Magnesium Glycinate", dose: "2 capsules", withFood: false, notes: "Supports sleep" },
  { time: "Before bed", supplement: "Jarrow Formulas PS100", dose: "1 softgel", withFood: false, notes: "" },
];

async function seed() {
  console.log("Seeding database...");

  for (const [name, data] of Object.entries(upperLimits)) {
    await prisma.ingredient.upsert({
      where: { name },
      update: { rda: data.rda, ul: data.ul, units: data.units, notes: data.notes },
      create: { name, rda: data.rda, ul: data.ul, units: data.units, notes: data.notes },
    });
    console.log(`  Created/updated ingredient: ${name}`);
  }

  for (const [name, data] of Object.entries(supplements)) {
    const supplement = await prisma.supplement.upsert({
      where: { name },
      update: { servingSize: data.serving, cycleRule: data.cycleRule },
      create: { name, servingSize: data.serving, cycleRule: data.cycleRule },
    });
    console.log(`  Created/updated supplement: ${name}`);

    await prisma.supplementIngredient.deleteMany({
      where: { supplementId: supplement.id },
    });

    for (const [ingName, dose] of Object.entries(data.ingredients)) {
      const ingredient = await prisma.ingredient.findUnique({
        where: { name: ingName },
      });

      if (ingredient) {
        await prisma.supplementIngredient.create({
          data: {
            supplementId: supplement.id,
            ingredientId: ingredient.id,
            dose,
          },
        });
      } else {
        console.log(`    Warning: Ingredient "${ingName}" not found for supplement "${name}"`);
      }
    }
  }

  const defaultUser = await prisma.user.upsert({
    where: { email: "default@example.com" },
    update: { name: "Jared" },
    create: { email: "default@example.com", name: "Jared" },
  });
  console.log(`Created/updated default user: ${defaultUser.email}`);

  await prisma.userSchedule.deleteMany({
    where: { userId: defaultUser.id },
  });

  for (const entry of dailySchedule) {
    const supplement = await prisma.supplement.findUnique({
      where: { name: entry.supplement },
    });

    if (supplement) {
      await prisma.userSchedule.create({
        data: {
          userId: defaultUser.id,
          supplementId: supplement.id,
          time: entry.time,
          dose: entry.dose,
          withFood: entry.withFood,
          notes: entry.notes,
        },
      });
      console.log(`  Created schedule entry: ${entry.supplement} at ${entry.time}`);
    }
  }

  console.log("Seeding complete!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
