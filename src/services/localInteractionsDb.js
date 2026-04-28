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
  'trihexyphenidyl', 'benztropine', 'haloperidol',
  // Egypt Brand Names (from PDF and common usage)
  'allergyl', 'tavegyl', 'tres orix', 'fenistil', 'amydramine', 'sibelium',
  'detrusitol', 'vesicare', 'urispas', 'spasmlyt', 'genurin',
  'spasmocure', 'colona', 'duspatalin', 'visceralgin',
  'tofranil', 'anafranil', 'pamelor', 'zyprexa', 'seroquel', 'parkinol',
  'congestal', '123', 'buscopan', 'tryptizol', 'artane',
  'uripan', 'ditropan', 'panadol night', 'benadryl', 'comtrex', 'flurest', 'prekal', 'haldol'
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
  'brufen', 'marcofen', 'voltaren', 'cataflam', 'olfen', 'declophen',
  'ketofan', 'ketolgin', 'naprofen', 'aleve',
  'mobic', 'anti-cox', 'feldene', 'celebrex', 'eurox', 'arcoxia',
  'aspirin protect', 'jusprin',
  'hostacortin', 'solu-cortef'
];

// 4. CYP Inhibitors - Major/Moderate
const liverInhibitors = [
  'ketoconazole', 'itraconazole', 'fluconazole', 'voriconazole',
  'erythromycin', 'clarithromycin', 'ciprofloxacin', 'levofloxacin',
  'fluoxetine', 'fluvoxamine', 'paroxetine', 'cimetidine', 'omeprazole',
  // Egypt Brand Names
  'nizoral', 'sporanox', 'itrapex', 'diflucan', 'treflucan', 'fungican', 'vfend',
  'erythrocin', 'klacid', 'klarimac', 'cipro', 'ciprocin', 'tavanic',
  'prozac', 'philozac', 'faverin', 'seroxat', 'paxil', 'tagamet',
  'losec', 'gastizole', 'klacid', 'klarimac'
];

// 4b. CYP Inducers - reduce AD drug levels (Major)
const liverInducers = [
  'rifampicin', 'carbamazepine', 'phenytoin', 'phenobarbital', 'valproic acid', "st. john's wort",
  // Egypt Brand Names
  'rimactane', 'tegretol', 'epanutin', 'sominal', 'depakine', 'convulex', 'safra'
];

// 4c. Carbapenem antibiotics (CNS toxicity risk)
const carbapenems = [
  'meropenem', 'imipenem', 'ertapenem',
  'meronem', 'tienam'
];

// 5. Warfarin & Anticoagulants
const warfarinGroup = ['warfarin', 'marevan'];

// 5b. Statins (CYP3A4 substrate — toxicity risk with inhibitors)
const statins = ['atorvastatin', 'lipitor', 'ator'];

// 5c. Metoclopramide (dopamine antagonist — worsens cognition)
const dopamineAntagonists = ['metoclopramide', 'primperan'];

// 5d. Tramadol (serotonin + seizure risk)
const tramadolGroup = ['tramadol', 'tramal', 'amadol'];

// 5e. Bupropion (lowers seizure threshold)
const bupropionGroup = ['bupropion', 'wellbutrin'];

// 5f. Allopurinol (amplifes some AD drug effects)
const allopurinolGroup = ['allopurinol', 'zyloric', 'no-uric'];

// 6. Memantine Exclusives (Level 4/3)
const nmdaCompetitors = ['dextromethorphan', 'amantadine', 'ketamine', 'methadone', 'tusskan', 'bronchopro', 'pk-merz', 'ketalar', 'codilar'];
const urineAlkalinizers = ['sodium bicarbonate', 'potassium citrate', 'acetazolamide', 'urosolvine', 'epico-gel', 'epicogel', 'urolite u', 'cidamez'];

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

  // 8. CYP Inducers — reduce AD drug plasma levels
  ...createCombinations(cholinesteraseInhibitors, liverInducers, {
    severity: 'Major (Level 3)',
    description: 'Mechanism: CYP Enzyme Induction. These drugs accelerate liver metabolism of AD medications, drastically reducing their blood levels and clinical effectiveness.',
    genderSpecifics: 'Elderly: Reduced drug efficacy may appear as sudden cognitive decline, mistaken for disease progression.',
    comment: 'WARNING: AD medication dose may need significant increase. Regular clinical monitoring required.',
    firstAid: {
      general: 'Do not stop the inducer abruptly — sudden discontinuation will cause AD drug toxicity as levels spike.',
      toxicity: 'SIGNS OF INEFFICACY: Sudden worsening memory, confusion, agitation — not an emergency but requires urgent prescriber review.',
      emergencyProtocol: 'Clinical review and plasma drug level monitoring.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),

  // 8b. CYP Inducers + Memantine
  ...createCombinations(memantineGroup, liverInducers, {
    severity: 'Moderate (Level 2)',
    description: 'Mechanism: CYP inducers may increase renal clearance of Memantine, reducing its therapeutic effect.',
    genderSpecifics: 'N/A',
    comment: 'CAUTION: Monitor for reduced Memantine effectiveness. Dose adjustment may be needed.',
    firstAid: {
      general: 'Report sudden worsening of symptoms to prescriber.',
      toxicity: 'No direct toxicity — risk is loss of efficacy.',
      emergencyProtocol: 'Clinical review.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),

  // 9. Carbapenems + AD drugs (CNS toxicity / valproate interaction)
  ...createCombinations(cholinesteraseInhibitors, carbapenems, {
    severity: 'Moderate (Level 2)',
    description: 'Mechanism: Carbapenems can cause CNS excitability and seizures, compounding neurological burden in Alzheimer\'s patients.',
    genderSpecifics: 'Elderly: Higher seizure susceptibility due to reduced seizure threshold.',
    comment: 'CAUTION: Monitor neurological status closely during carbapenem therapy.',
    firstAid: {
      general: 'Watch for new-onset seizures, tremors, or sudden confusion during IV antibiotic treatment.',
      toxicity: 'RED FLAGS: Seizures, myoclonus, severe agitation — emergency services required.',
      emergencyProtocol: 'ER evaluation and EEG if seizures occur.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),

  // 10. Warfarin + NSAIDs
  ...createCombinations(warfarinGroup, gastricIrritants, {
    severity: 'Critical (Level 4)',
    description: 'Mechanism: NSAIDs inhibit platelet function AND displace warfarin from protein binding, dramatically increasing bleeding risk.',
    genderSpecifics: 'Elderly females: Higher risk of intracranial bleeding due to combined anticoagulation.',
    comment: 'CRITICAL: Never combine warfarin with NSAIDs without strict INR monitoring. Prefer paracetamol.',
    firstAid: {
      general: 'Any bleeding (gums, nose, bruising, blood in urine/stool) requires urgent INR check.',
      toxicity: 'RED FLAGS: Severe headache (intracranial bleed), black tarry stool, coughing blood — emergency services immediately.',
      emergencyProtocol: 'ER required — Vitamin K and/or FFP reversal therapy.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),

  // 10b. Warfarin + CYP Inhibitors
  ...createCombinations(warfarinGroup, liverInhibitors, {
    severity: 'Critical (Level 4)',
    description: 'Mechanism: CYP2C9 inhibition by these drugs blocks warfarin metabolism, causing dangerous INR elevation and spontaneous bleeding.',
    genderSpecifics: 'Elderly: Any INR > 4 in an elderly patient is a medical emergency.',
    comment: 'CRITICAL: Mandatory INR check within 3 days of starting any new drug alongside warfarin.',
    firstAid: {
      general: 'Unexpected bruising or bleeding — check INR same day.',
      toxicity: 'RED FLAGS: Spontaneous bleeding from any site — emergency services.',
      emergencyProtocol: 'ER: Vitamin K IV and/or FFP.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),

  // 11. Metoclopramide + AD drugs (dopamine antagonism worsens cognition)
  ...createCombinations(cholinesteraseInhibitors, dopamineAntagonists, {
    severity: 'Moderate (Level 2)',
    description: 'Mechanism: Metoclopramide crosses the blood-brain barrier and blocks dopamine receptors, worsening cognitive symptoms and increasing Parkinsonism risk in Alzheimer\'s patients.',
    genderSpecifics: 'Elderly females: Higher risk of tardive dyskinesia with prolonged use.',
    comment: 'CAUTION: Avoid long-term use. Prefer domperidone (does not cross BBB) for nausea in AD patients.',
    firstAid: {
      general: 'Watch for new rigidity, shuffling gait, or facial grimacing.',
      toxicity: 'Prolonged use can cause irreversible movement disorders (tardive dyskinesia).',
      emergencyProtocol: 'Discontinue and refer to neurologist.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),

  // 12. Tramadol + AD drugs (serotonin syndrome + seizure risk)
  ...createCombinations(cholinesteraseInhibitors, tramadolGroup, {
    severity: 'Major (Level 3)',
    description: 'Mechanism: Tramadol lowers seizure threshold and has serotonergic activity. Cholinesterase inhibitors further increase CNS excitability.',
    genderSpecifics: 'Elderly: Significantly reduced tramadol clearance increases toxicity risk.',
    comment: 'WARNING: Use lowest effective tramadol dose for shortest duration. Monitor for seizures and confusion.',
    firstAid: {
      general: 'Agitation, muscle twitching, sweating, or rapid heart rate — stop tramadol and seek urgent care.',
      toxicity: 'RED FLAGS: Seizures, high fever, severe muscle rigidity — emergency services (Serotonin Syndrome protocol).',
      emergencyProtocol: 'ER: Benzodiazepines for seizures, Cyproheptadine for serotonin syndrome.',
      pregnancy: 'N/A',
      pediatric: 'N/A'
    }
  }),

  // 13. Bupropion + AD drugs (lowers seizure threshold)
  ...createCombinations(cholinesteraseInhibitors, bupropionGroup, {
    severity: 'Major (Level 3)',
    description: 'Mechanism: Bupropion lowers the seizure threshold dose-dependently. Combined with cholinergic stimulation from AD drugs, the risk of seizures is significantly elevated.',
    genderSpecifics: 'Elderly: Pre-existing cortical atrophy in Alzheimer\'s increases seizure vulnerability.',
    comment: 'WARNING: Avoid in patients with prior seizures. Use minimum effective bupropion dose.',
    firstAid: {
      general: 'New twitching, jerking, or loss of consciousness — emergency services immediately.',
      toxicity: 'RED FLAGS: Tonic-clonic seizure — do not restrain, protect head, call emergency services.',
      emergencyProtocol: 'ER: IV Lorazepam or Diazepam for seizure management.',
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
