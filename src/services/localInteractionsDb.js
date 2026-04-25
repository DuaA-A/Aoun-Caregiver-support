import { BASELINE_AD_DRUGS } from './rxnav';

/**
 * Curated Alzheimer-relevant interactions + first-aid style guidance.
 * Used as fast path and offline/API-fallback cache (not exhaustive vs RxNav).
 */
const ENTRIES = [
  {
    drugs: ['donepezil', 'tramadol'],
    severity: 'High',
    description:
      'Combining opioids with cholinesterase inhibitors or in frail patients increases risk of sedation, confusion, falls, and respiratory depression.',
    comment:
      'Use only if a prescriber has weighed risks; start low, monitor sedation and breathing. Do not stop Alzheimer medicines abruptly without medical advice.',
    firstAid: {
      general:
        'Watch for unusual sleepiness, slow or shallow breathing, hard-to-wake, or new confusion. If breathing is weak or the person is hard to arouse, call emergency services.',
      toxicity:
        'Suspected opioid excess: call emergency services. While waiting, keep airway clear, place on side if unconscious but breathing, and do not give food or drink.',
      pregnancy:
        'Pregnancy: both drug classes need obstetric review; do not combine without specialist advice.',
      pediatric:
        'Children are not typical Alzheimer-medication users; any use needs a pediatric specialist. Opioids carry high overdose risk in children.',
    },
  },
  {
    drugs: ['donepezil', 'paracetamol'],
    severity: 'Minor',
    description:
      'No major classic interaction at usual doses; both are commonly used together under medical supervision. Paracetamol is often preferred over NSAIDs with cholinesterase inhibitors.',
    comment:
      'Stay within maximum daily paracetamol limits (liver risk). Ask a pharmacist if using combination cold/flu products that also contain paracetamol.',
    firstAid: {
      general:
        'If accidental overdose of paracetamol is suspected (wrong dose or extra tablets), seek urgent medical care even if the person feels well — liver injury can be delayed.',
      toxicity:
        'Paracetamol overdose is a medical emergency. Go to the nearest emergency department; bring all medication packaging.',
      pregnancy: 'Use lowest effective paracetamol dose for shortest time as advised by maternity care.',
      pediatric: 'Use weight-based pediatric dosing only; never give adult tablets split without pharmacist guidance.',
    },
  },
  {
    drugs: ['donepezil', 'acetaminophen'],
    severity: 'Minor',
    description: 'Same considerations as paracetamol (acetaminophen).',
    comment: 'Avoid duplicate acetaminophen from combination OTC products.',
    firstAid: {
      general: 'Monitor total daily acetaminophen from all sources.',
      toxicity: 'Suspected overdose — emergency care immediately.',
      pregnancy: 'Follow obstetric guidance on maximum daily dose.',
      pediatric: 'Weight-based dosing only.',
    },
  },
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
    drugs: ['donepezil', 'ketoconazole'],
    severity: 'Moderate',
    description: 'Strong CYP3A4 inhibition can increase donepezil exposure.',
    comment: 'Watch for nausea, bradycardia, or fainting; dose adjustment may be needed.',
    firstAid: {
      general: 'Fainting or near-fainting — seek medical care.',
      toxicity: 'Persistent vomiting with dehydration — urgent assessment.',
      pregnancy: 'Obstetric and specialist review.',
      pediatric: 'Specialist use only.',
    },
  },
  {
    drugs: ['donepezil', 'diphenhydramine'],
    severity: 'Moderate',
    description:
      'Anticholinergic antihistamines can oppose the benefit of cholinesterase inhibitors and worsen confusion, constipation, and fall risk in dementia.',
    comment: 'Prefer non-sedating options when allergies must be treated; ask a pharmacist for safer alternatives.',
    firstAid: {
      general: 'Sudden worsening confusion after a new allergy tablet — contact clinician; ensure hydration and safe mobility.',
      toxicity: 'Hallucinations, inability to swallow, or fever with agitation — urgent evaluation.',
      pregnancy: 'Discuss antihistamine choice with prescriber.',
      pediatric: 'Age-appropriate allergy treatment only.',
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
  {
    drugs: ['donepezil', 'metoprolol'],
    severity: 'Moderate',
    description:
      'Cholinesterase inhibitors can have vagotonic cardiac effects; beta-blockers may add bradycardia or conduction issues.',
    comment: 'Monitor pulse; report dizziness or fainting.',
    firstAid: {
      general: 'If pulse is very slow or person faints, seek urgent medical care.',
      toxicity: 'Chest pain with shortness of breath — call emergency services.',
      pregnancy: 'Cardiology/obstetric coordinated care.',
      pediatric: 'Pediatric cardiology if applicable.',
    },
  },
];

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
