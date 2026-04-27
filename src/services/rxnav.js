const BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

const rxcuiCache = new Map();
const interactionsCache = new Map();

export const BASELINE_AD_DRUGS = [
  'Rivastigmine',
  'Galantamine',
  'Memantine',
];

const AD_SYNONYMS = [
  'rivastigmine',
  'exelon',
  'galantamine',
  'razadyne',
  'memantine',
  'namenda',
];

export const isLikelyAdTherapyName = (name) => {
  const n = (name || '').toLowerCase().trim();
  if (!n) return false;
  return BASELINE_AD_DRUGS.some((b) => n.includes(b.toLowerCase())) || AD_SYNONYMS.some((s) => n.includes(s));
};

const normalizeSeverity = (severityString) => {
  if (!severityString) return 'Minor';
  const sr = severityString.toLowerCase();
  if (sr.includes('high') || sr.includes('major') || sr.includes('contraindicated')) return 'High';
  if (sr.includes('moderate') || sr.includes('significant')) return 'Moderate';
  return 'Minor';
};

const safeJson = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

/**
 * Resolve RxCUI: RxNorm name lookup → drugs.json → approximate term (fuzzy).
 */
export const getRxCUI = async (drugName) => {
  const raw = (drugName || '').trim();
  if (!raw) return null;
  const normalized = raw.toLowerCase();

  if (rxcuiCache.has(normalized)) return rxcuiCache.get(normalized);

  const tryStore = (rxcui) => {
    if (rxcui) rxcuiCache.set(normalized, rxcui);
    return rxcui || null;
  };

  try {
    const rxcuiRes = await fetch(`${BASE_URL}/rxcui.json?name=${encodeURIComponent(raw)}`);
    const rxcuiData = await safeJson(rxcuiRes);
    let rxcui = rxcuiData?.idGroup?.rxnormId?.[0] || null;
    if (rxcui) return tryStore(String(rxcui));

    const drugsRes = await fetch(`${BASE_URL}/drugs.json?name=${encodeURIComponent(raw)}`);
    const drugsData = await safeJson(drugsRes);
    const groups = drugsData?.drugGroup?.conceptGroup || [];
    for (const g of groups) {
      const props = g?.conceptProperties;
      if (!Array.isArray(props)) continue;
      const ing = props.find((p) => (p?.tty || '').includes('IN')) || props[0];
      if (ing?.rxcui) return tryStore(String(ing.rxcui));
    }

    const approxRes = await fetch(
      `${BASE_URL}/approximateTerm.json?term=${encodeURIComponent(raw)}&maxEntries=8`
    );
    const approxData = await safeJson(approxRes);
    const candidates = approxData?.approximateGroup?.candidate;
    const list = Array.isArray(candidates) ? candidates : candidates ? [candidates] : [];
    const best = list.find((c) => c?.rxcui) || list[0];
    if (best?.rxcui) return tryStore(String(best.rxcui));

    return tryStore(null);
  } catch (error) {
    console.error('Error fetching RxCUI:', error);
    return null;
  }
};

const extractPairs = (data) => {
  const interactions = [];
  const groups = data?.fullInteractionTypeGroup || [];
  groups.forEach((group) => {
    (group.fullInteractionType || []).forEach((type) => {
      (type.interactionPair || []).forEach((pair) => {
        const concepts = pair.interactionConcept || [];
        if (concepts.length < 2) return;
        const a = concepts[0]?.minConceptItem;
        const b = concepts[1]?.minConceptItem;
        const drgA = a?.name || a?.fullName || 'Drug A';
        const drgB = b?.name || b?.fullName || 'Drug B';
        interactions.push({
          drugA: drgA,
          drugB: drgB,
          severity: normalizeSeverity(pair.severity),
          description: pair.description || '',
          recommendation:
            pair.comment ||
            'Consult your physician or pharmacist regarding this combination.',
        });
      });
    });
  });
  return interactions;
};

/**
 * Fetch drug–drug interactions for a set of RxCUIs (RxNorm returns all pairs in the set).
 */
export const getInteractions = async (rxcuis) => {
  const unique = [...new Set((rxcuis || []).filter(Boolean).map(String))];
  if (unique.length < 2) return [];

  const cacheKey = unique.sort().join('+');
  if (interactionsCache.has(cacheKey)) {
    return interactionsCache.get(cacheKey);
  }

  try {
    const url = `${BASE_URL}/interaction/list.json?rxcuis=${encodeURIComponent(unique.join('+'))}`;
    const response = await fetch(url);
    const data = await safeJson(response);
    if (!response.ok) {
      console.warn('RxNav interaction HTTP', response.status, data);
      interactionsCache.set(cacheKey, []);
      return [];
    }
    const interactions = extractPairs(data);
    const uniqueInteractions = Array.from(new Set(interactions.map(JSON.stringify))).map(JSON.parse);
    interactionsCache.set(cacheKey, uniqueInteractions);
    return uniqueInteractions;
  } catch (error) {
    console.error('Error fetching API interactions:', error);
    return [];
  }
};

/**
 * Pairwise fallback when bulk list returns empty (some edge cases).
 */
export const getInteractionsPairwise = async (setA, setB) => {
  const a = [...new Set((setA || []).filter(Boolean).map(String))];
  const b = [...new Set((setB || []).filter(Boolean).map(String))];
  const out = [];
  const seen = new Set();
  for (const x of a) {
    for (const y of b) {
      if (x === y) continue;
      const key = [x, y].sort().join('::');
      if (seen.has(key)) continue;
      seen.add(key);
      const rows = await getInteractions([x, y]);
      out.push(...rows);
    }
  }
  return Array.from(new Map(out.map((r) => [[r.drugA, r.drugB].map((v) => v.toLowerCase()).sort().join('::'), r])).values());
};
