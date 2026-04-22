const BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

// Simple in-memory caches
const rxcuiCache = new Map();
const interactionsCache = new Map();

// Base Alzheimer's drugs to cross-check against
export const BASELINE_AD_DRUGS = [
  "Donepezil",
  "Rivastigmine",
  "Galantamine",
  "Memantine"
];

// Helper to normalize the severity from RxNav API
const normalizeSeverity = (severityString) => {
  if (!severityString) return 'Minor';
  const sr = severityString.toLowerCase();
  if (sr.includes('high') || sr.includes('major') || sr.includes('contraindicated')) return 'High';
  if (sr.includes('moderate') || sr.includes('significant')) return 'Moderate';
  return 'Minor';
};

export const getRxCUI = async (drugName) => {
  const normalized = drugName.toLowerCase().trim();
  
  if (rxcuiCache.has(normalized)) return rxcuiCache.get(normalized);

  try {
    // First try direct lookup
    const rxcuiResponse = await fetch(`${BASE_URL}/rxcui.json?name=${encodeURIComponent(normalized)}`);
    const rxcuiData = await rxcuiResponse.json();
    let rxcui = rxcuiData.idGroup?.rxnormId?.[0] || null;
    
    // If not found, try spell check
    if (!rxcui) {
      const spellRes = await fetch(`${BASE_URL}/spellingsuggestions.json?name=${encodeURIComponent(normalized)}`);
      if (spellRes.ok) {
        const spellData = await spellRes.json();
        const bestMatch = spellData.suggestionGroup?.suggestionList?.suggestion?.[0];
        
        if (bestMatch) {
          const retryRes = await fetch(`${BASE_URL}/rxcui.json?name=${encodeURIComponent(bestMatch)}`);
          const retryData = await retryRes.json();
          rxcui = retryData.idGroup?.rxnormId?.[0] || null;
        }
      }
    }
    
    if (rxcui) {
      rxcuiCache.set(normalized, rxcui);
    }
    return rxcui;
  } catch (error) {
    console.error('Error fetching RxCUI:', error);
    return null;
  }
};

export const getInteractions = async (rxcuis) => {
  if (!rxcuis || rxcuis.length < 2) return [];
  
  // Sort to make cache key deterministic
  const cacheKey = [...rxcuis].sort().join('+');
  if (interactionsCache.has(cacheKey)) {
    return interactionsCache.get(cacheKey);
  }

  const interactions = [];

  try {
    const rxcuiList = cacheKey;
    const response = await fetch(`${BASE_URL}/interaction/list.json?rxcuis=${rxcuiList}`);
    const data = await response.json();
    
    if (data.fullInteractionTypeGroup) {
      data.fullInteractionTypeGroup.forEach(group => {
        group.fullInteractionType?.forEach(type => {
          type.interactionPair?.forEach(pair => {
            const drgA = pair.interactionConcept[0].minConceptItem.name;
            const drgB = pair.interactionConcept[1].minConceptItem.name;
            
            interactions.push({
              drugA: drgA,
              drugB: drgB,
              severity: normalizeSeverity(pair.severity),
              description: pair.description,
              recommendation: pair.comment || 'Consult your physician or pharmacist regarding this interaction combination.'
            });
          });
        });
      });
    }
    
    // Remove exact duplicates
    const uniqueInteractions = Array.from(new Set(interactions.map(JSON.stringify))).map(JSON.parse);
    
    interactionsCache.set(cacheKey, uniqueInteractions);
    return uniqueInteractions;

  } catch (error) {
    console.error('Error fetching API interactions:', error);
    return [];
  }
};
