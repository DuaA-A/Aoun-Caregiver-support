export const FOOD_INTERACTIONS = {
  donepezil: {
    avoidFoods: [],
    timing: 'Take once daily at bedtime to reduce nausea.',
    instructions: 'Can be taken with or without food. Avoid alcohol as it increases sedation.',
    source: 'Clinical Pharmacology / FDA',
  },
  rivastigmine: {
    avoidFoods: ['Alcohol'],
    timing: 'MUST be taken with a full, substantial meal (Breakfast and Dinner).',
    instructions: 'Taking on an empty stomach causes violent vomiting, severe loss of appetite, and dangerous weight loss.',
    source: 'Exelon Clinical Guide',
  },
  galantamine: {
    avoidFoods: ['Grapefruit Juice', 'Alcohol'],
    timing: 'MUST be taken with food.',
    instructions: 'CRITICAL: Grapefruit juice disables liver enzymes (CYP3A4), causing drug levels to spike. This leads to severe nausea and heart rate drops.',
    source: 'Reminyl Safety Data',
  },
  memantine: {
    avoidFoods: ['Excessive Sodium Bicarbonate (Antacids)', 'Alcohol'],
    timing: 'Take at the same time every day.',
    instructions: 'Alcohol is strictly contraindicated as it causes additive central nervous system depression and respiratory issues.',
    source: 'Ebixa Prescribing Info',
  },
  aduhelm: {
    avoidFoods: [],
    timing: "IV Infusion",
    instructions: "Monitor for ARIA-E (edema) and ARIA-H (hemorrhage) as seen in clinical data."
  }
};

export const LIFESTYLE_WARNINGS = [
  {
    category: 'Alcohol',
    severity: 'Critical',
    description: 'Alcohol causes direct destruction of remaining neurons and inhibits the brain\'s respiratory center. It completely counteracts the cognitive benefits of treatment.',
  },
  {
    category: 'Caffeine',
    severity: 'Moderate',
    description: 'Doubles the risk of insomnia and night-time urinary incontinence. This disrupts the patient\'s biological clock and increases caregiver burden. Limit intake after 2 PM.',
  },
];

// Add aliases for common Egyptian brand names
const aliases = {
  "donepezil": ["aricept", "alzepil", "alzam"],
  "rivastigmine": ["exelon", "rivamer"],
  "galantamine": ["reminyl"],
  "memantine": ["ebixa", "memixa", "memental"]
};

for (const [generic, brands] of Object.entries(aliases)) {
  for (const brand of brands) {
    if (FOOD_INTERACTIONS[generic]) {
      FOOD_INTERACTIONS[brand] = FOOD_INTERACTIONS[generic];
    }
  }
}
