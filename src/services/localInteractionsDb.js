import { BASELINE_AD_DRUGS } from './rxnav';

const createCombinations = (groupA, groupB, interactionData) => {
  const result = [];
  for (const a of groupA) {
    for (const b of groupB) {
      result.push({
        drugs: [a, b],
        ...interactionData
      });
    }
  }
  return result;
};

const cholinesteraseInhibitors = ['rivastigmine', 'exelon', 'rivamer', 'galantamine', 'reminyl'];
const memantineGroup = ['memantine', 'ebixa', 'memixa', 'memental'];

// 1. Anticholinergics - Critical (Level 4)
const anticholinergics = [
  'diphenhydramine', 'chlorpheniramine', 'clemastine', 'cyproheptadine', 'promethazine', 'ketotifen',
  'oxybutynin', 'tolterodine', 'solifenacin', 'darifenacin', 'flavoxate', 'trospium',
  'hyoscine', 'scopolamine', 'dicyclomine', 'atropine', 'mebeverine',
  'amitriptyline', 'imipramine', 'clomipramine', 'nortriptyline',
  'olanzapine', 'quetiapine', 'clozapine', 'chlorpromazine',
  'trihexyphenidyl', 'benztropine',
  // Egypt Brand Names
  'allergyl', 'tavegyl', 'tres orix', 'fenistil', 'amydramine', 'sibelium',
  'detrusitol', 'vesicare', 'urispas', 'spasmlyt', 'genurin',
  'spasmocure', 'colona', 'duspatalin', 'visceralgin',
  'tofranil', 'anafranil', 'pamelor', 'zyprexa', 'seroquel', 'parkinol',
  'congestal', '123', 'buscopan', 'tryptizol', 'artane'
];

// 2. Bradycardic Agents - Critical (Level 4)
const bradycardicAgents = [
  'bisoprolol', 'propranolol', 'atenolol', 'metoprolol', 'carvedilol', 'nebivolol',
  'digoxin', 'amiodarone', 'diltiazem', 'verapamil',
  // Egypt Brand Names
  'concor', 'bisocard', 'lodoz', 'inderal', 'mayocord', 'tenormin', 'blokium', 'betaloc', 'dilatrol', 'nevilob',
  'lanoxin', 'cardixin', 'cordarone', 'altiazem', 'isoptin'
];

// 3. NSAIDs & Corticosteroids - Major (Level 3)
const gastricIrritants = [
  'ibuprofen', 'diclofenac', 'ketoprofen', 'naproxen', 'meloxicam', 'piroxicam', 'celecoxib', 'etoricoxib', 'aspirin',
  'prednisolone', 'dexamethasone', 'hydrocortisone',
  // Egypt Brand Names
  'brufen', 'voltaren', 'cataflam', 'olfen', 'ketofan', 'naprofen', 'mobic', 'feldene', 'celebrex', 'arcoxia',
  'hostacortin', 'solu-cortef'
];

// 4. CYP Inhibitors - Major/Moderate
const liverInhibitors = [
  'ketoconazole', 'itraconazole', 'fluconazole', 'voriconazole',
  'erythromycin', 'clarithromycin', 'ciprofloxacin',
  'fluoxetine', 'fluvoxamine', 'paroxetine', 'cimetidine',
  // Egypt Brand Names
  'nizoral', 'sporanox', 'diflucan', 'vfend', 'erythrocin', 'klacid', 'cipro', 'prozac', 'faverin', 'seroxat', 'tagamet'
];

// 6. Memantine Exclusives (Level 4/3)
const nmdaCompetitors = ['dextromethorphan', 'amantadine', 'ketamine', 'methadone', 'tusskan', 'bronchopro', 'pk-merz', 'ketalar', 'codilar'];
const urineAlkalinizers = ['sodium bicarbonate', 'potassium citrate', 'acetazolamide', 'urosolvine', 'epico-gel', 'urolite u', 'cidamez'];

// 7. Cholinergic Agonists (Level 2)
const cholinergicAgonists = ['pyridostigmine', 'neostigmine', 'pilocarpine', 'bethanechol', 'mestinon', 'prostigmin', 'salagen', 'urecholine'];

const ADDITIONAL_ENTRIES = [
  // 1. Anticholinergics
  ...createCombinations(cholinesteraseInhibitors, anticholinergics, {
    severity: 'Critical (Level 4)',
    description: 'Mechanism: Anticholinergics block acetylcholine receptors in the brain, completely neutralizing the clinical effect of Alzheimer\'s medication.',
    genderSpecifics: 'Females: Elderly women often use drugs for urinary incontinence (e.g., Vesicare). This interaction leads to painful urinary retention, potential sepsis, and acute delirium.',
    comment: 'CRITICAL: Strictly contraindicated. These drugs actively erase the benefit of memory treatment.',
    firstAid: {
      general: 'Stop the anticholinergic drug immediately. Cool the body if feverish.',
      toxicity: 'RED FLAGS: Acute delirium (sudden inability to recognize family), extreme dry mouth/eyes (unable to swallow), total urinary retention > 8 hours, and high fever without sweating.',
      emergencyProtocol: 'Hospitalization required for urinary catheterization, IV fluids, and potential Physostigmine antidote.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),
  // 2. Bradycardic Agents
  ...createCombinations(cholinesteraseInhibitors, bradycardicAgents, {
    severity: 'Critical (Level 4)',
    description: 'Mechanism: Synergistic Heart Rate Suppression. Alzheimer\'s meds stimulate the Vagus Nerve; combining with heart drugs leads to Heart Block.',
    genderSpecifics: 'Females: Significantly higher risk of syncope-related falls leading to hip fractures (70% higher than males due to osteoporosis).',
    comment: 'CRITICAL: Risk of sudden cardiac arrest or syncope. Monitor pulse daily.',
    firstAid: {
      general: 'Lay patient flat and elevate legs to maintain cerebral blood flow. Do not give food/drink if unconscious.',
      toxicity: 'RED FLAGS: Heart rate < 50 BPM, cold limbs, cold sweat, and full loss of consciousness (syncope).',
      emergencyProtocol: 'Emergency ER visit for ECG and standard IV Atropine injection to restore heart rate.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),
  // 3. NSAIDs & Corticosteroids
  ...createCombinations(cholinesteraseInhibitors, gastricIrritants, {
    severity: 'Major (Level 3)',
    description: 'Mechanism: Gastric Mucosal Depletion. AD drugs increase stomach acid while these irritants block the protective mucus layer.',
    genderSpecifics: 'Males: Elderly males who smoke or consume alcohol are at the highest risk for "silent" gastrointestinal bleeding.',
    comment: 'WARNING: Extremely high risk of GI bleed. Preferred alternative: Paracetamol.',
    firstAid: {
      general: 'Stop the irritant immediately.',
      toxicity: 'RED FLAGS: "Coffee-ground" vomit (digested blood), tarry black stool (Melena), and sharp anemia/hypotension.',
      emergencyProtocol: 'ER required for potential blood transfusion and IV Proton Pump Inhibitors (PPIs) to halt bleeding.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),
  // 4. CYP Inhibitors
  ...createCombinations(cholinesteraseInhibitors, liverInhibitors, {
    severity: 'Major/Moderate (Level 3/2)',
    description: 'Mechanism: Liver Filtration Blockage. These drugs prevent the liver from clearing AD meds, causing toxic accumulation.',
    genderSpecifics: 'Elderly: Highly susceptible to fluid shifts caused by massive glandular secretions.',
    comment: 'WARNING: Risk of "Cholinergic Crisis". Immediate dose review required.',
    firstAid: {
      general: 'Transfer to ICU immediately.',
      toxicity: 'SLUDGE Syndrome: Excessive salivation, tearing, involuntary urination, watery diarrhea, respiratory secretions, and muscle twitches.',
      emergencyProtocol: 'Standard ICU care with Atropine antidote and potential gastric lavage.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),
  // 6. Memantine Specific - NMDA Competitors
  ...createCombinations(memantineGroup, nmdaCompetitors, {
    severity: 'Critical (Level 4)',
    description: 'Mechanism: NMDA Receptor Competition. Shared receptor targets lead to central nervous system toxicity.',
    genderSpecifics: 'Elderly: High risk of aggression, psychosis, and vivid hallucinations.',
    comment: 'CRITICAL: Avoid dextromethorphan (cough syrup) and amantadine.',
    firstAid: {
      general: 'Discontinue and monitor for behavioral changes.',
      toxicity: 'RED FLAGS: Psychosis, aggression, vivid hallucinations, and neurological agitation.',
      emergencyProtocol: 'Hospital sedation (Benzodiazepines) typically required.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),
  // 6. Memantine Specific - Alkalinizers
  ...createCombinations(memantineGroup, urineAlkalinizers, {
    severity: 'Major (Level 3)',
    description: 'Mechanism: Urinary Excretion Blockage. Alkaline urine forces Memantine back into the bloodstream.',
    genderSpecifics: 'Dehydrated Seniors: High risk of neurotoxicity.',
    comment: 'WARNING: Avoid antacids like sodium bicarbonate when taking Memantine.',
    firstAid: {
      general: 'Stop the alkalinizing agent and increase hydration.',
      toxicity: 'SYMPTOMS: Severe confusion, neurotoxicity, and slowed cognitive processing.',
      emergencyProtocol: 'Clinical evaluation required if confusion persists.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),
  // 7. Cholinergic Agonists
  ...createCombinations(cholinesteraseInhibitors, cholinergicAgonists, {
    severity: 'Moderate (Level 2)',
    description: 'Mechanism: Additive Cholinergic Effect. Both drugs increase acetylcholine, leading to a mild overdose.',
    genderSpecifics: 'N/A',
    comment: 'CAUTION: Monitor for excessive GI distress.',
    firstAid: {
      general: 'Dose adjustment required for both drugs.',
      toxicity: 'SYMPTOMS: Persistent nausea, severe cramps, and excessive sweating.',
      emergencyProtocol: 'Clinical review.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),
];

/**
 * Curated Alzheimer-relevant interactions + first-aid style guidance.
 * Used as fast path and offline/API-fallback cache (not exhaustive vs RxNav).
 */
const BASE_ENTRIES = [
  {
    drugs: ['rivastigmine', 'ibuprofen'],
    severity: 'Moderate',
    description:
      'Cholinesterase inhibitors can increase gastric acid; NSAIDs increase GI bleeding risk — combined risk of stomach irritation or bleeding.',
    comment:
      'Prefer acetaminophen for pain if suitable. If an NSAID is necessary, use the lowest dose for the shortest time with food and clinician oversight.',
    firstAid: {
      general: 'Watch for black/tarry stools, vomiting blood, or severe stomach pain — seek urgent care.',
      toxicity: 'Heavy NSAID use can harm kidneys and stomach; seek help for reduced urine, swelling, or persistent vomiting.',
      pregnancy: 'Avoid NSAIDs in pregnancy unless specifically prescribed.',
      pediatric: 'NSAIDs in children: use only with weight-appropriate dosing and clinician advice.',
    },
  },
  {
    drugs: ['galantamine', 'paroxetine'],
    severity: 'Moderate',
    description:
      'Paroxetine inhibits CYP2D6 and can raise galantamine levels, increasing cholinergic side effects (nausea, vomiting, diarrhea, bradycardia).',
    comment: 'Report persistent vomiting, fainting, or very slow pulse to a clinician promptly.',
    firstAid: {
      general: 'Severe vomiting or fainting warrants urgent medical assessment.',
      toxicity: 'Confusion with sweating, tearing, or diarrhea may suggest cholinergic excess — seek emergency advice.',
      pregnancy: 'Medication review with prescriber before changes.',
      pediatric: 'Not typical combination in children; specialist only.',
    },
  },
  {
    drugs: ['memantine', 'sodium bicarbonate'],
    severity: 'Moderate',
    description:
      'Urinary alkalinizers can reduce memantine clearance and increase drug levels and central nervous system side effects.',
    comment: 'Review use of antacids and urinary alkalinizers with a pharmacist or doctor if memantine side effects appear.',
    firstAid: {
      general: 'New agitation, hallucinations, or dizziness after starting antacids — contact prescriber same day.',
      toxicity: 'Severe confusion or inability to walk safely — seek urgent care.',
      pregnancy: 'Discuss all new medicines with maternity care.',
      pediatric: 'Specialist guidance only.',
    },
  },
  {
    drugs: ['memantine', 'amantadine'],
    severity: 'Moderate',
    description: 'Additive CNS effects possible (dizziness, confusion).',
    comment: 'Avoid duplicate therapy unless neurologist-directed.',
    firstAid: {
      general: 'Falls or new dizziness — medication review with prescriber.',
      toxicity: 'Severe confusion or reduced consciousness — emergency services.',
      pregnancy: 'Specialist review.',
      pediatric: 'Specialist review.',
    },
  },
];

const ENTRIES = [...BASE_ENTRIES, ...ADDITIONAL_ENTRIES];

const norm = (s) => (s || '').toLowerCase().trim();

const nameMatchesKey = (inputLower, key) =>
  inputLower === key || inputLower.includes(key) || key.includes(inputLower);

const entryMatchesPair = (entry, a, b) => {
  const [k0, k1] = entry.drugs.map(norm);
  return (
    (nameMatchesKey(a, k0) && nameMatchesKey(b, k1)) ||
    (nameMatchesKey(a, k1) && nameMatchesKey(b, k0))
  );
};

export const LOCAL_INTERACTION_DB = ENTRIES.map((e) => ({
  drugs: e.drugs.map(norm),
  severity: e.severity,
  description: e.description,
  comment: e.comment,
  firstAid: e.firstAid,
}));

export const checkLocalInteractions = (drugNames) => {
  const interactions = [];
  const normalizedInputs = drugNames.map(norm).filter(Boolean);

  for (let i = 0; i < normalizedInputs.length; i++) {
    for (let j = i + 1; j < normalizedInputs.length; j++) {
      const d1 = normalizedInputs[i];
      const d2 = normalizedInputs[j];
      const match = ENTRIES.find((db) => entryMatchesPair(db, d1, d2));
      if (match) {
        interactions.push({
          drugA: drugNames[i]?.trim() || d1,
          drugB: drugNames[j]?.trim() || d2,
          severity: match.severity,
          description: match.description,
          recommendation: match.comment,
          firstAid: match.firstAid,
          source: 'local',
        });
      }
    }
  }

  return Array.from(new Map(interactions.map((x) => [JSON.stringify([x.drugA, x.drugB, x.description]), x])).values());
};

/**
 * Interactions between any of `queryDrugs` and any known AD therapy name in `adContextNames`.
 */
export const checkLocalAgainstAdMeds = (queryDrugs, adContextNames) => {
  const q = (queryDrugs || []).map(norm).filter(Boolean);
  const adList = (adContextNames || []).length
    ? adContextNames.map(norm).filter(Boolean)
    : BASELINE_AD_DRUGS.map(norm);

  const out = [];
  for (const entry of ENTRIES) {
    for (const qn of q) {
      for (const an of adList) {
        if (entryMatchesPair(entry, qn, an)) {
          const humanA = queryDrugs.find((n) => norm(n) === qn) || qn;
          const humanB =
            adContextNames?.find((n) => norm(n) === an) ||
            BASELINE_AD_DRUGS.find((b) => norm(b) === an) ||
            an;
          out.push({
            drugA: humanA,
            drugB: humanB,
            severity: entry.severity,
            description: entry.description,
            recommendation: entry.comment,
            firstAid: entry.firstAid,
            source: 'local',
          });
        }
      }
    }
  }
  return Array.from(new Map(out.map((x) => [JSON.stringify([x.drugA, x.drugB, x.description]), x])).values());
};
