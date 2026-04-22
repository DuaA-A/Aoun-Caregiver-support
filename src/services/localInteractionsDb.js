export const LOCAL_INTERACTION_DB = [
  {
    drugs: ["donepezil", "atropine"],
    severity: "Moderate",
    description: "Anticholinergic drugs like atropine may antagonize the effect of acetylcholinesterase inhibitors like Donepezil.",
    comment: "Monitor for reduced efficacy of Alzheimer's treatment. Avoid combination if possible."
  },
  {
    drugs: ["donepezil", "metoprolol"],
    severity: "Moderate",
    description: "Cholinesterase inhibitors may have vagotonic effects on the heart, which could be additive to those of beta-blockers, potentially causing bradycardia.",
    comment: "Monitor heart rate closely. Use with caution in patients with known conduction abnormalities."
  },
  {
    drugs: ["rivastigmine", "ibuprofen"],
    severity: "Moderate",
    description: "Cholinesterase inhibitors may increase gastric acid secretion. NSAIDs like Ibuprofen also increase gastric irritation, raising the risk of GI bleeding.",
    comment: "Monitor for signs of GI distress, dark stools, or abdominal pain. Consider a PPI if long-term use is necessary."
  },
  {
    drugs: ["memantine", "sodium bicarbonate"],
    severity: "Moderate",
    description: "Urinary alkalinizers like sodium bicarbonate can reduce the renal clearance of Memantine by up to 80%, leading to potential toxicity.",
    comment: "Monitor for Memantine side effects (agitation, confusion). Adjust dose if necessary."
  },
  {
    drugs: ["galantamine", "paroxetine"],
    severity: "Moderate",
    description: "Paroxetine inhibits CYP2D6 and CYP3A4, which are involved in the metabolism of Galantamine, potentially increasing Galantamine levels.",
    comment: "Monitor for cholinergic side effects (nausea, vomiting, diarrhea)."
  },
  {
    drugs: ["donepezil", "ketoconazole"],
    severity: "Moderate",
    description: "Ketoconazole inhibits CYP3A4, which is involved in the metabolism of Donepezil, potentially increasing its plasma concentration.",
    comment: "Monitor for enhanced pharmacological effects of Donepezil."
  }
];

export const checkLocalInteractions = (drugNames) => {
  const interactions = [];
  const normalizedInputs = drugNames.map(d => d.toLowerCase().trim());
  
  for (let i = 0; i < normalizedInputs.length; i++) {
    for (let j = i + 1; j < normalizedInputs.length; j++) {
      const d1 = normalizedInputs[i];
      const d2 = normalizedInputs[j];
      
      const match = LOCAL_INTERACTION_DB.find(db => 
        (db.drugs.includes(d1) && db.drugs.includes(d2)) ||
        (db.drugs.some(base => d1.includes(base)) && db.drugs.some(base => d2.includes(base)))
      );
      
      if (match) {
        interactions.push({
          drugA: d1.charAt(0).toUpperCase() + d1.slice(1),
          drugB: d2.charAt(0).toUpperCase() + d2.slice(1),
          severity: match.severity,
          description: match.description,
          recommendation: match.comment
        });
      }
    }
  }
  
  return Array.from(new Set(interactions.map(JSON.stringify))).map(JSON.parse);
};
