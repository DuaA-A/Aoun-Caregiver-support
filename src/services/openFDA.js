const FDA_BASE_URL = 'https://api.fda.gov/drug/label.json';

const extractFoodInstructions = (textBlocks) => {
  if (!textBlocks || !Array.isArray(textBlocks)) return null;
  const combinedText = textBlocks.join(' ').toLowerCase();

  const rules = [];

  if (combinedText.includes('grapefruit')) {
    rules.push('Avoid grapefruit and grapefruit juice.');
  }
  if (combinedText.includes('with food') || combinedText.includes('with meals')) {
    rules.push('Should be taken with food or meals.');
  }
  if (combinedText.includes('empty stomach') || combinedText.includes('1 hour before or 2 hours after meals')) {
    rules.push('Should be taken on an empty stomach.');
  }
  if (combinedText.includes('alcohol')) {
    rules.push('Avoid alcohol while on this medication unless your clinician advises otherwise.');
  }
  if (combinedText.includes('tyramine') || combinedText.includes('maoi')) {
    rules.push('If this drug is an MAOI, avoid tyramine-rich foods (aged cheese, cured meats) unless your label says otherwise.');
  }

  return rules.length > 0 ? rules : null;
};

const firstToken = (name) => (name || '').trim().split(/[\s,/]+/)[0] || '';

const esc = (s) => s.replace(/"/g, '\\"');

const fetchLabel = async (searchQuery) => {
  const response = await fetch(
    `${FDA_BASE_URL}?search=${encodeURIComponent(searchQuery)}&limit=1`
  );
  if (!response.ok) return null;
  const data = await response.json();
  if (!data.results || data.results.length === 0) return null;
  return data;
};

export const getOpenFdaData = async (drugName) => {
  try {
    const normalizedDrug = drugName.trim();
    if (!normalizedDrug) return null;

    const t = esc(normalizedDrug);
    const short = esc(firstToken(normalizedDrug));

    const attempts = [
      `openfda.generic_name:"${t}"`,
      `openfda.substance_name:"${t}"`,
      `openfda.brand_name:"${t}"`,
      short !== t ? `openfda.generic_name:"${short}"` : null,
      short !== t ? `openfda.substance_name:"${short}"` : null,
      `patient_drug:"${short}*"`,
    ].filter(Boolean);

    let data = null;
    for (const q of attempts) {
      data = await fetchLabel(q);
      if (data) break;
    }

    if (!data) return null;

    const label = data.results[0];

    const foodWarningsText = [
      ...(label.food_interactions || []),
      ...(label.warnings || []),
      ...(label.precautions || []),
      ...(label.dosage_and_administration || []),
      ...(label.contraindications || []),
    ];
    const detectedFoodRules = extractFoodInstructions(foodWarningsText);

    return {
      brandName: label.openfda?.brand_name?.[0] || drugName,
      boxedWarning: label.boxed_warning ? label.boxed_warning[0] : null,
      foodRules: detectedFoodRules,
      dosAndDonts: label.do_not_use ? label.do_not_use[0] : null,
    };
  } catch (error) {
    console.error('OpenFDA API Error:', error);
    return null;
  }
};
