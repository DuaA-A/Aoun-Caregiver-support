export const FOOD_INTERACTIONS = {
  "donepezil": {
    avoidFoods: ["Alcohol", "Caffeine"],
    timing: "Take at bedtime",
    instructions: "Alcohol is strictly forbidden. It severely depresses the CNS, negates effects, and increases liver toxicity. Avoid high intake of caffeine (tea, coffee, energy drinks) as it exacerbates insomnia and agitation commonly caused by Alzheimer's drugs."
  },
  "rivastigmine": {
    avoidFoods: ["Alcohol", "Caffeine"],
    timing: "Take with food",
    instructions: "Should be taken with a full meal. Alcohol is strictly forbidden. It severely depresses the CNS, negates effects, and increases liver toxicity. Avoid high intake of caffeine (tea, coffee, energy drinks) as it exacerbates insomnia and agitation."
  },
  "galantamine": {
    avoidFoods: ["Alcohol", "Grapefruit", "Grapefruit Juice", "Caffeine"],
    timing: "Take with food",
    instructions: "Take with morning and evening meals. Grapefruit/Grapefruit juice specifically blocks the CYP3A4 liver enzyme leading to toxic buildup in bloodstream. Alcohol is strictly forbidden. Avoid high intake of caffeine as it exacerbates insomnia and agitation."
  },
  "memantine": {
    avoidFoods: ["Alcohol", "Caffeine"],
    timing: "With or without food",
    instructions: "Can be taken with or without food. Alcohol is strictly forbidden. It severely depresses the CNS, negates effects, and increases liver toxicity. Avoid high intake of caffeine (tea, coffee, energy drinks) as it exacerbates insomnia and agitation."
  },
  "aduhelm": {
    avoidFoods: [],
    timing: "IV Infusion",
    instructions: "Monitor for ARIA-E (edema) and ARIA-H (hemorrhage) as seen in clinical data."
  }
};

// Add aliases for common Egyptian brand names
const aliases = {
  "donepezil": ["aricept", "alzepil", "alzam"],
  "rivastigmine": ["exelon", "rivamer"],
  "galantamine": ["reminyl"],
  "memantine": ["ebixa", "memixa", "memental"]
};

for (const [generic, brands] of Object.entries(aliases)) {
  for (const brand of brands) {
    FOOD_INTERACTIONS[brand] = FOOD_INTERACTIONS[generic];
  }
}

