const FDA_BASE_URL = 'https://api.fda.gov/drug/label.json';

// Simple text parser for basic food instruction detection
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
    rules.push('Avoid alcohol consumption while on this medication.');
  }

  return rules.length > 0 ? rules : null;
};

export const getOpenFdaData = async (drugName) => {
  try {
    const normalizedDrug = drugName.trim();
    const query = encodeURIComponent(
      `(openfda.brand_name:"${normalizedDrug}" OR openfda.generic_name:"${normalizedDrug}" OR openfda.substance_name:"${normalizedDrug}")`
    );
    const response = await fetch(`${FDA_BASE_URL}?search=${query}&limit=1`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;

    const label = data.results[0];

    // Extract relevant data points
    const foodWarningsText = [
      ...(label.food_interactions || []),
      ...(label.warnings || []),
      ...(label.precautions || []),
      ...(label.dosage_and_administration || [])
    ];
    const detectedFoodRules = extractFoodInstructions(foodWarningsText);
    
    return {
      brandName: label.openfda?.brand_name?.[0] || drugName,
      boxedWarning: label.boxed_warning ? label.boxed_warning[0] : null,
      foodRules: detectedFoodRules,
      dosAndDonts: label.do_not_use ? label.do_not_use[0] : null
    };

  } catch (error) {
    console.error('OpenFDA API Error:', error);
    return null;
  }
};
