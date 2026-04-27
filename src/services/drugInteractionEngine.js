import {
  getRxCUI,
  getInteractions,
  getInteractionsPairwise,
  BASELINE_AD_DRUGS,
} from './rxnav';
import { checkLocalAgainstAdMeds, checkLocalInteractions } from './localInteractionsDb';
import { getOpenFdaData } from './openFDA';
import { FOOD_INTERACTIONS } from '../utils/foodInteractions';

const normPairKey = (a, b) =>
  [String(a || '').toLowerCase().trim(), String(b || '').toLowerCase().trim()].sort().join('::');

/** Prefer RxNav clinical text; keep curated first-aid from local when present. */
const mergeInteractionsPriority = (apiList, localList) => {
  const map = new Map();
  for (const r of localList) {
    map.set(normPairKey(r.drugA, r.drugB), { ...r });
  }
  for (const r of apiList) {
    const k = normPairKey(r.drugA, r.drugB);
    const loc = map.get(k);
    map.set(k, {
      ...r,
      firstAid: loc?.firstAid ? { ...r.firstAid, ...loc.firstAid } : r.firstAid,
      genderSpecifics: loc?.genderSpecifics || r.genderSpecifics,
      description: r.description || loc?.description,
      recommendation: r.recommendation || loc?.recommendation,
      severity: r.severity || loc?.severity,
    });
  }
  return [...map.values()];
};

/**
 * @param {Array<{ name: string, rxcui?: string|null }>} queryMeds
 * @param {string[]} scheduledMedNames names from caregiver schedule (expected AD-focused)
 */
export async function buildFullInteractionReport({ queryMeds, scheduledMedNames = [] }) {
  const queryNames = queryMeds.map((m) => m.name.trim()).filter(Boolean);
  const regimenNames =
    scheduledMedNames.map((n) => String(n).trim()).filter(Boolean).length > 0
      ? scheduledMedNames.map((n) => String(n).trim()).filter(Boolean)
      : [...BASELINE_AD_DRUGS];

  const localCross = checkLocalAgainstAdMeds(queryNames, regimenNames);
  const localAmong = checkLocalInteractions([...queryNames, ...regimenNames]);

  const resolvedQuery = await Promise.all(
    queryMeds.map(async (m) => ({
      name: m.name,
      rxcui: m.rxcui && m.rxcui !== 'unknown' ? String(m.rxcui) : await getRxCUI(m.name),
    }))
  );

  const resolvedRegimen = await Promise.all(
    regimenNames.map(async (name) => ({
      name,
      rxcui: await getRxCUI(name),
    }))
  );

  const queryRxcuis = resolvedQuery.map((r) => r.rxcui).filter(Boolean);
  const regimenRxcuis = resolvedRegimen.map((r) => r.rxcui).filter(Boolean);
  const allRxcuis = [...new Set([...queryRxcuis, ...regimenRxcuis].map(String))];

  let apiRows = [];
  let apiOk = false;
  if (allRxcuis.length >= 2) {
    try {
      apiRows = await getInteractions(allRxcuis);
      apiOk = true;
      if (
        (!apiRows || apiRows.length === 0) &&
        queryRxcuis.length >= 1 &&
        regimenRxcuis.length >= 1
      ) {
        apiRows = await getInteractionsPairwise(queryRxcuis, regimenRxcuis);
      }
    } catch {
      apiRows = [];
    }
  }

  const apiFormatted = (apiRows || []).map((r) => ({
    ...r,
    source: 'rxnav',
  }));

  const mergedInteractions = mergeInteractionsPriority(apiFormatted, [
    ...localCross,
    ...localAmong,
  ]);

  const foodWarnings = [];
  for (const med of queryNames) {
    const medNameLower = med.toLowerCase();
    if (FOOD_INTERACTIONS[medNameLower]) {
      foodWarnings.push({
        drug: med,
        ...FOOD_INTERACTIONS[medNameLower],
        source: 'Aoun clinical baseline',
      });
    }
    try {
      const fdaData = await getOpenFdaData(med);
      if (fdaData?.foodRules?.length) {
        foodWarnings.push({
          drug: med,
          avoidFoods: fdaData.foodRules,
          timing: 'As directed on label',
          instructions: fdaData.dosAndDonts || 'Follow FDA label and prescriber instructions.',
          source: 'openFDA label (subset)',
        });
      }
    } catch {
      /* ignore per-drug FDA failure */
    }
  }

  return {
    interactions: mergedInteractions,
    foodWarnings,
    regimenNames,
    resolvedQuery,
    resolvedRegimen,
    meta: {
      rxnavUsed: apiOk && apiFormatted.length > 0,
      rxnavAttempted: allRxcuis.length >= 2,
      localPairs: localCross.length + localAmong.length,
    },
  };
}
