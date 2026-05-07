import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getRxCUI, BASELINE_AD_DRUGS } from '../../services/rxnav';
import { buildFullInteractionReport } from '../../services/drugInteractionEngine';
import {
  Pill,
  Search,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  Shield,
  Info,
  Coffee,
  RefreshCw,
  Stethoscope,
  Baby,
  HeartPulse,
} from 'lucide-react';
import { db, isPreviewMode } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import '../../styles/about.css';

const LS_SCHEDULE = 'preview_drug_schedule';

const InteractionChecker = ({ onOpenAuth }) => {
  const { currentUser } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const translateResult = (text) => {
    if (!text || !isRTL) return text;
    const map = {
      // Descriptions
      'Mechanism: Anticholinergics block acetylcholine receptors in the brain, completely neutralizing the clinical effect of Alzheimer\'s medication.': 'الآلية: مضادات الكولين تمنع مستقبلات الأسيتيل كولين في الدماغ، مما يبطل تماماً التأثير السريري لأدوية الزهايمر.',
      'Mechanism: Synergistic Heart Rate Suppression. Alzheimer\'s meds stimulate the Vagus Nerve; combining with heart drugs leads to Heart Block.': 'الآلية: تثبيط تآزري لضربات القلب. أدوية الزهايمر تحفز العصب الحائر؛ دمجها مع أدوية القلب يؤدي إلى توقف القلب.',
      'Mechanism: Gastric Mucosal Depletion. AD drugs increase stomach acid while these irritants block the protective mucus layer.': 'الآلية: استنزاف الغشاء المخاطي للمعدة. أدوية الزهايمر تزيد من حموضة المعدة بينما تمنع هذه المهيجات طبقة المخاط الواقية.',
      'Mechanism: Liver Filtration Blockage. These drugs prevent the liver from clearing AD meds, causing toxic accumulation.': 'الآلية: انسداد تنقية الكبد. هذه الأدوية تمنع الكبد من التخلص من أدوية الزهايمر، مما يسبب تراكمًا سامًا.',
      'Mechanism: NMDA Receptor Competition. Shared receptor targets lead to central nervous system toxicity.': 'الآلية: تنافس على مستقبلات NMDA. الأهداف المشتركة للمستقبلات تؤدي إلى تسمم الجهاز العصبي المركزي.',
      'Mechanism: Urinary Excretion Blockage. Alkaline urine forces Memantine back into the bloodstream.': 'الآلية: انسداد الإفراز البولي. البول القلوي يجبر الميمانتين على العودة إلى مجرى الدم.',
      'Mechanism: Additive Cholinergic Effect. Both drugs increase acetylcholine, leading to a mild overdose.': 'الآلية: تأثير كوليني مضاف. كلا الدواءين يزيدان من الأسيتيل كولين، مما يؤدي لجرعة زائدة طفيفة.',
      'Mechanism: CYP Enzyme Induction. These drugs accelerate liver metabolism of AD medications, drastically reducing their blood levels and clinical effectiveness.': 'الآلية: تحفيز إنزيمات الكبد. هذه الأدوية تسرع عملية استقلاب أدوية الزهايمر في الكبد، مما يقلل بشكل كبير من مستوياتها في الدم وفعاليتها السريرية.',
      'Mechanism: CYP inducers may increase renal clearance of Memantine, reducing its therapeutic effect.': 'الآلية: محفزات الكبد قد تزيد من التخلص الكلوي من الميمانتين، مما يقلل من تأثيره العلاجي.',
      'Mechanism: Carbapenems can cause CNS excitability and seizures, compounding neurological burden in Alzheimer\'s patients.': 'الآلية: الكاربابينيمات يمكن أن تسبب استثارة الجهاز العصبي المركزي وتشنجات، مما يضاعف العبء العصبي على مرضى الزهايمر.',
      'Mechanism: Tramadol lowers seizure threshold and has serotonergic activity. Cholinesterase inhibitors further increase CNS excitability.': 'الآلية: الترامادول يقلل من عتبة التشنجات وله نشاط سيروتونيني. مثبطات الكولينستريز تزيد من استثارة الجهاز العصبي المركزي.',
      'Mechanism: Bupropion lowers the seizure threshold dose-dependently. Combined with cholinergic stimulation from AD drugs, the risk of seizures is significantly elevated.': 'الآلية: البوبروبيون يقلل من عتبة التشنجات بشكل يعتمد على الجرعة. بالاشتراك مع التحفيز الكوليني من أدوية الزهايمر، يرتفع خطر التشنجات بشكل كبير.',
      'Cholinesterase inhibitors can increase gastric acid; NSAIDs increase GI bleeding risk — combined risk of stomach irritation or bleeding.': 'مثبطات الكولينستريز يمكن أن تزيد من حموضة المعدة؛ المسكنات تزيد من خطر نزيف الجهاز الهضمي - خطر مشترك لتهيج المعدة أو النزيف.',
      'Paroxetine inhibits CYP2D6 and can raise galantamine levels, increasing cholinergic side effects (nausea, vomiting, diarrhea, bradycardia).': 'الباروكستين يثبط إنزيم CYP2D6 ويمكن أن يرفع مستويات الجالانتامين، مما يزيد من الآثار الجانبية الكولينية (الغثيان، القيء، الإسهال، بطء القلب).',
      'Urinary alkalinizers can reduce memantine clearance and increase drug levels and central nervous system side effects.': 'قلويات البول يمكن أن تقلل من التخلص من الميمانتين وتزيد من مستويات الدواء والآثار الجانبية للجهاز العصبي المركزي.',
      'Mechanism: Additive CNS effects possible (dizziness, confusion).': 'تأثيرات مضافة محتملة على الجهاز العصبي المركزي (دوخة، ارتباك).',
      'Mechanism: Additive Gastrointestinal Side Effects. Both drugs can irritate the digestive tract.': 'الآلية: آثار جانبية هضمية مضافة. كلا الدواءين قد يسببان تهيجاً للجهاز الهضمي.',
      'Mechanism: Renal Competition. Both drugs are excreted by the kidneys and may compete for clearance.': 'الآلية: تنافس كلوي. يتم إفراز كلا الدواءين عن طريق الكلى وقد يتنافسان على التخلص منهما.',
      'Mechanism: Mixed Autonomic Interaction. Hypoglycemia from diabetes meds combined with bradycardia from AD meds increases fall risk.': 'الآلية: تفاعل عصبي لاإرادي مختلط. انخفاض سكر الدم الناتج عن أدوية السكري مع بطء القلب الناتج عن أدوية الزهايمر يزيد من خطر السقوط.',
      'Mechanism: Masked Hypoglycemia. Donepezil/Rivastigmine may mask or be confused with symptoms of low blood sugar.': 'الآلية: نقص سكر الدم المقنع. قد تخفي أدوية الزهايمر أعراض انخفاض سكر الدم أو يتم الخلط بينهما.',
      'Mechanism: Shared Renal Excretion. Possible accumulation of both drugs in patients with kidney issues.': 'الآلية: إفراز كلوي مشترك. احتمال تراكم كلا الدواءين في المرضى الذين يعانون من مشاكل الكلى.',
      'Mechanism: Additive GI Side Effects. No direct serious interaction, but both can cause stomach upset.': 'الآلية: آثار جانبية هضمية مضافة. لا يوجد تفاعل خطير مباشر، لكن كلاهما قد يسببان اضطراباً في المعدة.',

      // Recommendations / Comments
      'CRITICAL: Strictly contraindicated. These drugs actively erase the benefit of memory treatment.': 'حرج: يمنع استخدامه قطعيًا. هذه الأدوية تبطل مفعول علاج الذاكرة تماماً.',
      'CRITICAL: Risk of sudden cardiac arrest or syncope. Monitor pulse daily.': 'حرج: خطر التوقف المفاجئ للقلب أو الإغماء. راقب النبض يومياً.',
      'WARNING: Extremely high risk of GI bleed. Preferred alternative: Paracetamol.': 'تحذير: خطر كبير جداً لنزيف الجهاز الهضمي. البديل المفضل: باراسيتامول.',
      'WARNING: Risk of "Cholinergic Crisis". Immediate dose review required.': 'تحذير: خطر حدوث "أزمة كولينية". مطلوب مراجعة فورية للجرعة.',
      'CRITICAL: Avoid dextromethorphan (cough syrup) and amantadine.': 'حرج: تجنب ديكستروميثورفان (شراب السعال) والأمانتادين.',
      'WARNING: Avoid antacids like sodium bicarbonate when taking Memantine.': 'تحذير: تجنب مضادات الحموضة مثل بيكربونات الصوديوم عند تناول الميمانتين.',
      'CAUTION: Monitor for excessive GI distress.': 'تنبيه: راقب وجود أي اضطرابات هضمية مفرطة.',
      'WARNING: AD medication dose may need significant increase. Regular clinical monitoring required.': 'تحذير: قد تحتاج جرعة دواء الزهايمر إلى زيادة كبيرة. المراقبة السريرية المنتظمة مطلوبة.',
      'CAUTION: Monitor for reduced Memantine effectiveness. Dose adjustment may be needed.': 'تنبيه: راقب تراجع فعالية الميمانتين. قد تكون هناك حاجة لتعديل الجرعة.',
      'CAUTION: Monitor neurological status closely during carbapenem therapy.': 'تنبيه: راقب الحالة العصبية عن كثب أثناء العلاج بالكاربابينيم.',
      'WARNING: Use lowest effective tramadol dose for shortest duration. Monitor for seizures and confusion.': 'تحذير: استخدم أقل جرعة فعالة من الترامادول ولأقصر مدة. راقب التشنجات والارتباك.',
      'WARNING: Avoid in patients with prior seizures. Use minimum effective bupropion dose.': 'تحذير: تجنب استخدامه للمرضى الذين عانوا من تشنجات سابقة. استخدم أقل جرعة فعالة من البوبروبيون.',
      'Prefer acetaminophen for pain if suitable. If an NSAID is necessary, use the lowest dose for the shortest time with food and clinician oversight.': 'يفضل استخدام الباراسيتامول للألم إذا كان مناسباً. إذا كان المسكن ضرورياً، استخدم أقل جرعة لأقصر وقت مع الطعام وإشراف الطبيب.',
      'Report persistent vomiting, fainting, or very slow pulse to a clinician promptly.': 'أبلغ الطبيب فوراً عن القيء المستمر أو الإغماء أو نبض القلب البطيء جداً.',
      'Review use of antacids and urinary alkalinizers with a pharmacist or doctor if memantine side effects appear.': 'راجع استخدام مضادات الحموضة وقلويات البول مع الصيدلي أو الطبيب إذا ظهرت آثار جانبية للميمانتين.',
      'Avoid duplicate therapy unless neurologist-directed.': 'تجنب العلاج المكرر ما لم يوجه بذلك طبيب الأعصاب.',
      'CAUTION: Increased risk of nausea and diarrhea. Monitor patient tolerance.': 'تنبيه: زيادة خطر الغثيان والإسهال. راقب تحمل المريض.',
      'CAUTION: Monitor kidney function, especially in patients with existing renal impairment.': 'تنبيه: راقب وظائف الكلى، خاصة في المرضى الذين يعانون من قصور كلوي موجود مسبقاً.',
      'WARNING: Close monitoring of blood glucose and pulse is mandatory.': 'تحذير: المراقبة الدقيقة لسكر الدم والنبض إلزامية.',
      'WARNING: Hypoglycemia confusion can be mistaken for Alzheimer\'s agitation. Monitor blood sugar closely.': 'تحذير: يمكن الخلط بين ارتباك نقص سكر الدم واضطراب الزهايمر. راقب سكر الدم عن كثب.',
      'CAUTION: Monitor renal function (Creatinine/GFR).': 'تنبيه: راقب وظائف الكلى (الكرياتينين/معدل الترشيح الكلوي).',
      'Generally safe together. Monitor for temporary nausea or diarrhea.': 'آمنان معاً بشكل عام. راقب الغثيان أو الإسهال المؤقت.',

      // Gender Specifics
      'Females: Elderly women often use drugs for urinary incontinence (e.g., Vesicare). This interaction leads to painful urinary retention, potential sepsis, and acute delirium.': 'الإناث: غالباً ما تستخدم النساء المسنات أدوية لسلس البول (مثل فيزيكير). هذا التفاعل يؤدي إلى احتباس بول مؤلم، وتسمم دم محتمل، وهذيان حاد.',
      'Females: Significantly higher risk of syncope-related falls leading to hip fractures (70% higher than males due to osteoporosis).': 'الإناث: خطر أعلى بكثير للسقوط المرتبط بالإغماء مما يؤدي لكسور الورك (أعلى بنسبة 70% من الذكور بسبب هشاشة العظام).',
      'Males: Elderly males who smoke or consume alcohol are at the highest risk for "silent" gastrointestinal bleeding.': 'الذكور: الرجال المسنون الذين يدخنون أو يستهلكون الكحول هم الأكثر عرضة لخطر نزيف الجهاز الهضمي "الصامت".',
      'Elderly: Highly susceptible to fluid shifts caused by massive glandular secretions.': 'كبار السن: عرضة بشكل كبير لاختلال السوائل الناتج عن إفرازات غدية ضخمة.',
      'Elderly: High risk of aggression, psychosis, and vivid hallucinations.': 'كبار السن: خطر كبير للعدوانية، الذهان، والهلوسة البصرية الواضحة.',
      'Dehydrated Seniors: High risk of neurotoxicity.': 'كبار السن المصابون بالجفاف: خطر كبير للتسمم العصبي.',
      'Elderly: Reduced drug efficacy may appear as sudden cognitive decline, mistaken for disease progression.': 'كبار السن: قد يظهر تراجع فعالية الدواء كتدهور معرفي مفاجئ، يُعتقد خطأً أنه تقدم في المرض.',
      'Elderly: Higher seizure susceptibility due to reduced seizure threshold.': 'كبار السن: حساسية أعلى للتشنجات بسبب انخفاض عتبة التشنج.',
      'Elderly: Significantly reduced tramadol clearance increases toxicity risk.': 'كبار السن: انخفاض تخلص الجسم من الترامادول بشكل كبير يزيد من خطر التسمم.',
      'Elderly: Pre-existing cortical atrophy in Alzheimer\'s increases seizure vulnerability.': 'كبار السن: ضمور القشرة الدماغية الموجود مسبقاً في مرضى الزهايمر يزيد من الحساسية للتشنجات.',

      // First Aid
      'Stop the anticholinergic drug immediately. Cool the body if feverish.': 'توقف عن تناول الدواء المضاد للكولين فوراً. برد الجسم إذا كان محموماً.',
      'RED FLAGS: Acute delirium (sudden inability to recognize family), extreme dry mouth/eyes (unable to swallow), total urinary retention > 8 hours, and high fever without sweating.': 'علامات الخطر: هذيان حاد (عدم القدرة المفاجئة على التعرف على الأهل)، جفاف شديد بالفم/العين، احتباس بولي كامل لأكثر من 8 ساعات، وحمى عالية بدون عرق.',
      'Hospitalization required for urinary catheterization, IV fluids, and potential Physostigmine antidote.': 'يتطلب دخول المستشفى لتركيب قسطرة بولية، سوائل وريدية، وترياق فيزوستيجمين المحتمل.',
      'Lay patient flat and elevate legs to maintain cerebral blood flow. Do not give food/drink if unconscious.': 'ضع المريض بشكل مسطح وارفع الساقين للحفاظ على تدفق الدم للدماغ. لا تعطِ طعاماً أو شراباً إذا كان فاقداً للوعي.',
      'RED FLAGS: Heart rate < 50 BPM, cold limbs, cold sweat, and full loss of consciousness (syncope).': 'علامات الخطر: نبض أقل من 50، برودة الأطراف، عرق بارد، وفقدان كامل للوعي (إغماء).',
      'Emergency ER visit for ECG and standard IV Atropine injection to restore heart rate.': 'زيارة طوارئ فورية لعمل رسم قلب وحقنة أتروبين وريدية لاستعادة معدل ضربات القلب.',
      'Stop the irritant immediately.': 'توقف عن تناول المادة المهيجة فوراً.',
      'RED FLAGS: "Coffee-ground" vomit (digested blood), tarry black stool (Melena), and sharp anemia/hypotension.': 'علامات الخطر: قيء يشبه "تفل القهوة" (دم مهضوم)، براز أسود قطراني، وأنيميا حادة أو انخفاض في الضغط.',
      'ER required for potential blood transfusion and IV Proton Pump Inhibitors (PPIs) to halt bleeding.': 'مطلوب طوارئ لنقل دم محتمل وحقن وريدية لمثبطات مضخة البروتون لوقف النزيف.',
      'Transfer to ICU immediately.': 'انقل المريض إلى العناية المركزة فوراً.',
      'SLUDGE Syndrome: Excessive salivation, tearing, involuntary urination, watery diarrhea, respiratory secretions, and muscle twitches.': 'متلازمة SLUDGE: لعاب مفرط، دموع، تبول لا إرادي، إسهال مائي، إفرازات تنفسية، وتقلصات عضلية.',
      'Standard ICU care with Atropine antidote and potential gastric lavage.': 'رعاية مركزة قياسية مع ترياق الأتروبين وغسيل معدة محتمل.',
      'Discontinue and monitor for behavioral changes.': 'توقف عن الدواء وراقب التغيرات السلوكية.',
      'RED FLAGS: Psychosis, aggression, vivid hallucinations, and neurological agitation.': 'علامات الخطر: ذهان، عدوانية، هلوسة واضحة، واضطراب عصبي.',
      'Hospital sedation (Benzodiazepines) typically required.': 'يتطلب عادةً تهدئة في المستشفى (بنزوديازيبينات).',
      'Stop the alkalinizing agent and increase hydration.': 'توقف عن العامل القلوي وزد من شرب السوائل.',
      'SYMPTOMS: Severe confusion, neurotoxicity, and slowed cognitive processing.': 'الأعراض: ارتباك شديد، تسمم عصبي، وبطء في العمليات الإدراكية.',
      'Clinical evaluation required if confusion persists.': 'مطلوب تقييم سريري إذا استمر الارتباك.',
      'Dose adjustment required for both drugs.': 'تعديل الجرعة مطلوب لكلا الدواءين.',
      'SYMPTOMS: Persistent nausea, severe cramps, and excessive sweating.': 'الأعراض: غثيان مستمر، تشنجات شديدة، وعرق مفرط.',
      'Clinical review.': 'مراجعة سريرية.',
      'Do not stop the inducer abruptly — sudden discontinuation will cause AD drug toxicity as levels spike.': 'لا توقف المحفز فجأة - التوقف المفاجئ سيسبب تسمماً بأدوية الزهايمر نتيجة ارتفاع مستوياتها.',
      'SIGNS OF INEFFICACY: Sudden worsening memory, confusion, agitation — not an emergency but requires urgent prescriber review.': 'علامات عدم الفعالية: تدهور مفاجئ في الذاكرة، ارتباك، اضطراب - ليست حالة طوارئ ولكنها تتطلب مراجعة الطبيب.',
      'Clinical review and plasma drug level monitoring.': 'مراجعة سريرية ومراقبة مستوى الدواء في البلازما.',
      'Report sudden worsening of symptoms to prescriber.': 'أبلغ الطبيب عن التدهور المفاجئ في الأعراض.',
      'No direct toxicity — risk is loss of efficacy.': 'لا يوجد تسمم مباشر - الخطر هو فقدان الفعالية.',
      'Watch for new-onset seizures, tremors, or sudden confusion during IV antibiotic treatment.': 'راقب ظهور تشنجات جديدة، رعشة، أو ارتباك مفاجئ أثناء العلاج بالمضاد الحيوي الوريدي.',
      'RED FLAGS: Seizures, myoclonus, severe agitation — emergency services required.': 'علامات الخطر: تشنجات، رمع عضلي، اضطراب حاد - مطلوب خدمات الطوارئ.',
      'ER evaluation and EEG if seizures occur.': 'تقييم في الطوارئ ورسم مخ في حالة حدوث تشنجات.',
      'Agitation, muscle twitching, sweating, or rapid heart rate — stop tramadol and seek urgent care.': 'اضطراب، رعشة عضلية، عرق، أو ضربات قلب سريعة - توقف عن الترامادول واطلب الرعاية العاجلة.',
      'RED FLAGS: Seizures, high fever, severe muscle rigidity — emergency services (Serotonin Syndrome protocol).': 'علامات الخطر: تشنجات، حمى عالية، تصلب عضلي شديد - خدمات الطوارئ (بروتوكول متلازمة السيروتونين).',
      'ER: Benzodiazepines for seizures, Cyproheptadine for serotonin syndrome.': 'الطوارئ: بنزوديازيبينات للتشنجات، سيبروهيبتادين لمتلازمة السيروتونين.',
      'New twitching, jerking, or loss of consciousness — emergency services immediately.': 'ارتجاف جديد، تشنجات، أو فقدان للوعي - خدمات الطوارئ فوراً.',
      'RED FLAGS: Tonic-clonic seizure — do not restrain, protect head, call emergency services.': 'علامات الخطر: نوبة صرع كبرى - لا تقيد المريض، احمِ الرأس، واتصل بالطوارئ.',
      'ER: IV Lorazepam or Diazepam for seizure management.': 'الطوارئ: لورازيبام أو ديازيبام وريدي لإدارة النوبة.',
      'Watch for black/tarry stools, vomiting blood, or severe stomach pain — seek urgent care.': 'راقب البراز الأسود/القطراني، قيء الدم، أو آلام المعدة الشديدة - اطلب الرعاية العاجلة.',
      'Heavy NSAID use can harm kidneys and stomach; seek help for reduced urine, swelling, or persistent vomiting.': 'الاستخدام الكثيف للمسكنات يضر الكلى والمعدة؛ اطلب المساعدة في حالة نقص البول، التورم، أو القيء المستمر.',
      'Avoid NSAIDs in pregnancy unless specifically prescribed.': 'تجنب المسكنات أثناء الحمل ما لم توصف خصيصاً.',
      'NSAIDs in children: use only with weight-appropriate dosing and clinician advice.': 'المسكنات للأطفال: تستخدم فقط بجرعات مناسبة للوزن وبنصيحة الطبيب.',
      'Severe vomiting or fainting warrants urgent medical assessment.': 'القيء الشديد أو الإغماء يتطلب تقييماً طبياً عاجلاً.',
      'Confusion with sweating, tearing, or diarrhea may suggest cholinergic excess — seek emergency advice.': 'الارتباك مع العرق أو الدموع أو الإسهال قد يشير إلى فرط كوليني - اطلب نصيحة الطوارئ.',
      'Medication review with prescriber before changes.': 'مراجعة الأدوية مع الطبيب قبل إجراء تغييرات.',
      'Not typical combination in children; specialist only.': 'ليست تركيبة شائعة للأطفال؛ للمتخصصين فقط.',
      'New agitation, hallucinations, or dizziness after starting antacids — contact prescriber same day.': 'اضطراب جديد، هلوسة، أو دوخة بعد بدء مضادات الحموضة - اتصل بالطبيب في نفس اليوم.',
      'Severe confusion or inability to walk safely — seek urgent care.': 'ارتباك شديد أو عدم القدرة على المشي بأمان - اطلب الرعاية العاجلة.',
      'Discuss all new medicines with maternity care.': 'ناقش جميع الأدوية الجديدة مع رعاية الأمومة.',
      'Specialist guidance only.': 'توجيهات المختصين فقط.',
      'Falls or new dizziness — medication review with prescriber.': 'سقوط أو دوخة جديدة - مراجعة الأدوية مع الطبيب.',
      'Severe confusion or reduced consciousness — emergency services.': 'ارتباك شديد أو انخفاض الوعي - خدمات الطوارئ.',
      'Specialist review.': 'مراجعة المختص.',
      'Monitor for dehydration if diarrhea occurs.': 'راقب حدوث الجفاف في حالة حدوث إسهال.',
      'Ensure adequate hydration.': 'تأكد من شرب كميات كافية من السوائل.',
      'Check blood glucose if patient feels dizzy or weak.': 'افحص سكر الدم إذا شعر المريض بالدوخة أو الضعف.',
      'Always rule out hypoglycemia first when sudden confusion occurs.': 'استبعد دائماً نقص سكر الدم أولاً عند حدوث ارتباك مفاجئ.',
      'Ensure regular kidney function check-ups.': 'تأكد من إجراء فحص دوري لوظائف الكلى.',
      'Take with food to minimize stomach upset.': 'تناول الدواء مع الطعام لتقليل اضطراب المعدة.',
      'RED FLAGS: Severe dizziness, cold sweat, confusion, and slow pulse.': 'علامات الخطر: دوخة شديدة، عرق بارد، ارتباك، ونبض بطيء.',
      'RED FLAGS: Sudden confusion, agitation, or loss of consciousness.': 'علامات الخطر: ارتباك مفاجئ، اضطراب، أو فقدان للوعي.',
      'SIGNS: Lactic acidosis (metformin) or neurotoxicity (memantine) in severe renal failure.': 'العلامات: الحماض اللبني (ميتفورمين) أو التسمم العصبي (ميمانتين) في حالة الفشل الكلوي الحاد.',
    };
    return map[text] || text;
  };

  const [activeTab, setActiveTab] = useState('quick');
  const [inputDrug, setInputDrug] = useState('');
  const [medsToCheck, setMedsToCheck] = useState([]);

  const [reportData, setReportData] = useState({
    interactions: [],
    foodWarnings: [],
    checked: false,
    regimenNames: [],
    meta: null,
  });

  const [loading, setLoading] = useState(false);
  const [savedMeds, setSavedMeds] = useState([]);
  const [scheduleRegimen, setScheduleRegimen] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const MAX_DRUGS = 4;

  const fetchSavedMeds = useCallback(async () => {
    if (!currentUser) return;
    try {
      if (isPreviewMode) {
        setSavedMeds(JSON.parse(localStorage.getItem('preview_meds') || '[]'));
      } else {
        const docSnap = await getDoc(doc(db, 'user_medications', currentUser.uid));
        if (docSnap.exists()) setSavedMeds(docSnap.data().medications || []);
      }
    } catch (err) {
      console.error('Error fetching meds:', err);
    }
  }, [currentUser]);

  const fetchUserScheduleNames = useCallback(async () => {
    if (!currentUser) {
      setScheduleRegimen([]);
      return [];
    }
    try {
      let names = [];
      if (isPreviewMode) {
        const d = JSON.parse(localStorage.getItem(LS_SCHEDULE) || '{}');
        names = (d.schedule || []).map((x) => x.name).filter(Boolean);
      } else {
        const snap = await getDoc(doc(db, 'user_drug_schedule', currentUser.uid));
        if (snap.exists()) {
          names = (snap.data().schedule || []).map((x) => x.name).filter(Boolean);
        }
      }
      setScheduleRegimen(names);
      return names;
    } catch {
      setScheduleRegimen([]);
      return [];
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      void fetchSavedMeds();
      void fetchUserScheduleNames();
    } else {
      setScheduleRegimen([]);
    }
  }, [currentUser, fetchSavedMeds, fetchUserScheduleNames]);

  const addDrug = async (e, forcedDrugName = null) => {
    if (e) e.preventDefault();
    const drugName = forcedDrugName || inputDrug;
    if (!drugName.trim()) return;
    if (medsToCheck.length >= MAX_DRUGS) {
      return setErrorMsg(t('checker.errors.maxDrugs', { max: MAX_DRUGS }));
    }
    if (medsToCheck.some((m) => m.name.toLowerCase() === drugName.toLowerCase())) {
      setErrorMsg(t('checker.errors.alreadyAdded', { name: drugName }));
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setReportData((prev) => ({ ...prev, checked: false }));
    try {
      const rxcui = await getRxCUI(drugName);
      setMedsToCheck((prev) => [...prev, { name: drugName.trim(), rxcui: rxcui || null }]);
      if (!forcedDrugName) setInputDrug('');
      if (!rxcui) {
        setErrorMsg(t('checker.errors.weakMatch'));
      }
    } catch {
      setErrorMsg(t('checker.errors.network'));
    } finally {
      setLoading(false);
    }
  };

  const removeDrug = (index) => {
    setMedsToCheck((prev) => prev.filter((_, i) => i !== index));
    setReportData({
      interactions: [],
      foodWarnings: [],
      checked: false,
      regimenNames: [],
      meta: null,
    });
    setErrorMsg('');
  };

  const checkInteractions = async () => {
    if (medsToCheck.length < 1) {
      return setErrorMsg(t('checker.errors.addOne'));
    }
    setLoading(true);
    setErrorMsg('');
    const regimen = await fetchUserScheduleNames();

    try {
      const report = await buildFullInteractionReport({
        queryMeds: medsToCheck,
        scheduledMedNames: regimen,
      });

      setReportData({
        interactions: report.interactions,
        foodWarnings: report.foodWarnings,
        checked: true,
        regimenNames: report.regimenNames,
        meta: report.meta,
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(t('checker.errors.apiDown'));
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (sev) => {
    const s = sev?.toLowerCase() || '';
    if (s.includes('high') || s.includes('major') || s.includes('critical') || s.includes('level 4') || s.includes('level 3')) {
      return <AlertTriangle className="icon-high" size={24} />;
    }
    if (s.includes('moderate') || s.includes('level 2')) return <AlertTriangle className="icon-mod" size={24} />;
    return <Info className="icon-low" size={24} />;
  };

  const getSeverityClass = (sev) => {
    const s = sev?.toLowerCase() || '';
    if (s.includes('high') || s.includes('major') || s.includes('critical') || s.includes('level 4') || s.includes('level 3')) {
      return 'sev-high';
    }
    if (s.includes('moderate') || s.includes('level 2')) return 'sev-mod';
    return 'sev-low';
  };

  const renderFirstAid = (inter) => {
    const fa = inter.firstAid;
    const gs = inter.genderSpecifics;
    if (!fa && !gs) {
      return (
        <div className="first-aid-box">
          <h5><Stethoscope size={16} /> {t('checker.firstAidTitle')}</h5>
          <p>{t('checker.firstAidFallback')}</p>
        </div>
      );
    }
    return (
      <div className="first-aid-box mt-4">
        <h5 className="text-red-700 font-bold mb-3 flex items-center gap-2">
          <Shield size={18} /> {t('checker.firstAidTitle')}
        </h5>
        <div className="space-y-3">
          {gs && (
            <div className="fa-row">
              <span className="fa-tag gender">{t('checker.faGender')}</span>
              <p className="fa-val font-bold text-purple-700">{translateResult(gs)}</p>
            </div>
          )}
          {fa?.general && (
            <div className="fa-row">
              <span className="fa-tag">{t('checker.faGeneral')}</span>
              <p className="fa-val">{translateResult(fa.general)}</p>
            </div>
          )}
          {fa?.toxicity && (
            <div className="fa-row">
              <span className="fa-tag toxic">{t('checker.faToxicity')}</span>
              <p className="fa-val text-red-600 font-black">{translateResult(fa.toxicity)}</p>
            </div>
          )}
          {fa?.emergencyProtocol && (
            <div className="fa-row emergency-highlight">
              <span className="fa-tag emergency">{t('checker.faEmergency')}</span>
              <p className="fa-val font-black text-red-900 uppercase">{translateResult(fa.emergencyProtocol)}</p>
            </div>
          )}
          {fa?.pregnancy && (
            <div className="fa-row">
              <span className="fa-tag">{t('checker.faPregnancy')}</span>
              <p className="fa-val">{translateResult(fa.pregnancy)}</p>
            </div>
          )}
          {fa?.pediatric && (
            <div className="fa-row">
              <span className="fa-tag">{t('checker.faPediatric')}</span>
              <p className="fa-val">{translateResult(fa.pediatric)}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const regimenLabel =
    scheduleRegimen.length > 0
      ? t('checker.regimenFromSchedule', { list: scheduleRegimen.join(', ') })
      : t('checker.regimenBaseline', { list: BASELINE_AD_DRUGS.join(', ') });

  return (
    <div className="checker-page container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="about-header-wrapper animate-fade-in">
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <span className="about-subtitle">{t('checker.subtitle')}</span>
          <h1 className="about-title">{t('checker.title')}</h1>
          <p className="about-desc">{t('checker.desc')}</p>

          <div className="tab-controls mt-6">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'quick' ? 'active' : ''}`}
              onClick={() => setActiveTab('quick')}
            >
              {t('checker.tabSafety')}
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              {t('checker.tabArchive')}
            </button>
          </div>
        </div>
      </div>

      <div className="checker-body mt-8">
        {activeTab === 'quick' ? (
          <div className="quick-check-layout">
            <div className="checker-input-area glass-card">
              <h2>{t('checker.buildTitle')}</h2>
              <p className="subtitle">{t('checker.buildDesc')}</p>

              <div className="regimen-hint glass-pill">
                <Info size={16} />
                <span>{regimenLabel}</span>
              </div>

              <div className="multi-drug-slots mt-6">
                {[...Array(MAX_DRUGS)].map((_, index) => (
                  <div key={index} className={`drug-slot ${medsToCheck[index] ? 'filled' : 'empty'}`}>
                    {medsToCheck[index] ? (
                      <>
                        <Pill size={20} className="slot-icon" />
                        <span className="slot-name">{medsToCheck[index].name}</span>
                        {!medsToCheck[index].rxcui && (
                          <span className="slot-warn" title={t('checker.offlineNameOnly')}>
                            RxNorm
                          </span>
                        )}
                        <button type="button" onClick={() => removeDrug(index)} className="slot-remove">
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <span className="slot-empty-text">
                        {t('checker.slotText', { index: index + 1 })} {index === 0 ? t('checker.required') : t('checker.optional')}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {medsToCheck.length < MAX_DRUGS && (
                <form onSubmit={(e) => addDrug(e)} className="drug-search-form mt-4">
                  <Search className="search-icon" size={20} />
                  <input
                    type="text"
                    className="drug-input"
                    placeholder={t('checker.placeholder')}
                    value={inputDrug}
                    disabled={loading}
                    onChange={(e) => setInputDrug(e.target.value)}
                  />
                  <button type="submit" disabled={loading || !inputDrug.trim()} className="btn-add">
                    {loading ? <Loader2 size={18} className="spinner" /> : <Plus size={18} />}
                  </button>
                </form>
              )}

              {errorMsg && (
                <div className="error-alert mt-4">
                  <AlertTriangle size={16} /> {errorMsg}
                </div>
              )}

              {medsToCheck.length > 0 && (
                <button type="button" className="btn-generate-report mt-6" onClick={checkInteractions} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="spinner" size={20} /> {t('checker.analysing')}
                    </>
                  ) : (
                    t('checker.generateBtn')
                  )}
                </button>
              )}
            </div>

            <div className="checker-results">
              {loading ? (
                <div className="loader-skeletons">
                  <div className="skeleton s-small"></div>
                  <div className="skeleton s-med"></div>
                  <div className="skeleton s-large"></div>
                </div>
              ) : reportData.checked ? (
                <div className="interactions-container animate-fade-in">
                  {/* Clinical results below */}

                  <div className="interaction-report glass-card border-top-purple">
                    <div className="report-header">
                      <Pill className="header-icon purple" />
                      <h3>{t('checker.apiInteractions')}</h3>
                    </div>

                    {reportData.interactions.length === 0 ? (
                      <div className="clear-status">
                        <CheckCircle2 size={32} className="status-icon green" />
                        <p>{t('checker.noInteractions')}</p>
                      </div>
                    ) : (
                      <div className="report-list">
                        {reportData.interactions.map((inter, idx) => (
                          <div key={idx} className={`interaction-card ${getSeverityClass(inter.severity)}`}>
                            <div className="card-icon-wrap">{getSeverityIcon(inter.severity)}</div>
                            <div className="card-content">
                              <span className={`severity-badge ${getSeverityClass(inter.severity)}`}>
                                {t('checker.riskLevel', { level: inter.severity })}
                              </span>
                              <h4>
                                {inter.drugA} + {inter.drugB}
                              </h4>
                              <div className="card-details">
                                <p>
                                  <strong>{t('checker.description')}</strong> {translateResult(inter.description)}
                                </p>
                                <p className="physician-note">
                                  <strong>{t('checker.note')}</strong> {translateResult(inter.recommendation)}
                                </p>
                                {renderFirstAid(inter)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="interaction-report glass-card border-top-amber mt-6">
                    <div className="report-header">
                      <Coffee className="header-icon amber" />
                      <h3>{t('checker.foodAlerts')}</h3>
                    </div>

                    {reportData.foodWarnings.length === 0 ? (
                      <div className="clear-status">
                        <Info size={32} className="status-icon muted" />
                        <p>{t('checker.noFoodWarnings')}</p>
                      </div>
                    ) : (
                      <div className="report-list">
                        {reportData.foodWarnings.map((warning, idx) => (
                          <div key={idx} className="interaction-card food-card">
                            <h4>{warning.drug}</h4>

                            {warning.avoidFoods && warning.avoidFoods.length > 0 && (
                              <div className="food-detail">
                                <strong>{t('checker.mustAvoid')}</strong>
                                <ul>
                                  {warning.avoidFoods.map((f, i) => (
                                    <li key={i}>{f}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {warning.timing && (
                              <div className="food-detail">
                                <strong>{t('checker.timing')}</strong>
                                <p>{warning.timing}</p>
                              </div>
                            )}
                            {warning.instructions && (
                              <div className="food-detail">
                                <strong>{t('checker.instruction')}</strong>
                                <p>{warning.instructions}</p>
                              </div>
                            )}
                            <div className="source-note">
                              {t('checker.source')} {warning.source}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="disclaimer-box mt-6">
                    <strong>{t('checker.disclaimerTitle')}</strong> {t('checker.disclaimerDesc')}
                  </div>
                </div>
              ) : (
                <div className="empty-state-board">
                  <Shield size={64} className="empty-icon" />
                  <h3>{t('checker.awaitingTitle')}</h3>
                  <p>{t('checker.awaitingDesc')}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-card padding-large">
            {!currentUser ? (
              <div className="auth-prompt">
                <Shield size={48} className="auth-icon" />
                <h3>{t('checker.archiveTitle')}</h3>
                <p>{t('checker.archiveDesc')}</p>
                <button type="button" className="btn btn-premium mt-4" onClick={onOpenAuth}>
                  {t('checker.loginBtn')}
                </button>
              </div>
            ) : (
              <div className="archive-view">
                <h3>{t('checker.savedTitle')}</h3>
                <div className="archive-grid mt-6">
                  {savedMeds.length > 0 ? (
                    savedMeds.map((m, i) => (
                      <div key={i} className="archive-card">
                        <div className="archive-info">
                          <strong>{m.name}</strong>
                          <span>{t('checker.archivedAt', { date: new Date(m.addedAt).toLocaleDateString() })}</span>
                        </div>
                        <Pill size={20} className="archive-card-icon" />
                      </div>
                    ))
                  ) : (
                    <div className="archive-empty">{t('checker.noSavedMeds')}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .tab-controls { display: flex; justify-content: center; gap: 1rem; }
        .tab-btn { padding: 12px 28px; border-radius: 30px; font-weight: 700; color: white; background: rgba(255,255,255,0.1); border: 2px solid transparent; transition: all 0.3s; cursor: pointer; }
        .tab-btn.active { background: white; color: var(--primary); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .tab-btn:hover:not(.active) { border-color: rgba(255,255,255,0.5); }

        .checker-body { max-width: 1200px; margin: 2rem auto; }
        .mt-6 { margin-top: 1.5rem; }
        .mt-8 { margin-top: 2rem; }

        .quick-check-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 900px) {
          .quick-check-layout { grid-template-columns: 5fr 7fr; }
        }

        .checker-input-area { padding: 2rem; }
        .checker-input-area h2 { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; }
        .subtitle { color: var(--text-secondary); font-size: 1.05rem; }

        .regimen-hint {
          margin-top: 1rem; padding: 10px 14px; border-radius: 12px; display: flex; gap: 10px; align-items: flex-start;
          font-size: 0.88rem; color: var(--text-main); background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2);
        }
        .glass-pill { }

        .multi-drug-slots { display: flex; flex-direction: column; gap: 0.75rem; }
        .drug-slot {
          display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem;
          border-radius: 12px; border: 2px solid; transition: all 0.3s;
        }
        .drug-slot.filled { border-color: rgba(126, 34, 206, 0.2); background: white; }
        .drug-slot.empty { border-color: var(--border); border-style: dashed; background: rgba(0,0,0,0.02); }
        .slot-icon { color: var(--primary); }
        .slot-name { flex: 1; font-weight: 700; color: var(--text-main); }
        .slot-warn { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: #b45309; background: #fffbeb; padding: 2px 6px; border-radius: 6px; }
        .slot-remove { color: var(--text-muted); background: none; border: none; cursor: pointer; transition: color 0.2s; }
        .slot-remove:hover { color: #ef4444; }
        .slot-empty-text { color: var(--text-muted); padding-inline-start: 0.5rem; font-size: 0.95rem; }

        .drug-search-form { position: relative; }
        .search-icon { position: absolute; inset-inline-start: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .drug-input {
          width: 100%; height: 56px; padding-inline-start: 3rem; padding-inline-end: 4rem; border-radius: 12px;
          border: 2px solid var(--border); font-size: 1rem; font-weight: 600; outline: none; transition: border-color 0.2s;
        }
        .drug-input:focus { border-color: var(--primary); }
        .btn-add {
          position: absolute; inset-inline-end: 0.5rem; top: 50%; transform: translateY(-50%);
          width: 40px; height: 40px; background: var(--primary); color: white; border: none; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;
        }
        .btn-add:hover:not(:disabled) { background: #6b21a8; }
        .btn-add:disabled { opacity: 0.5; cursor: not-allowed; }

        .error-alert { padding: 1rem; border-radius: 8px; background: #fef2f2; color: #dc2626; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; font-size: 0.9rem; border: 1px solid #fecaca; }

        .btn-generate-report {
          width: 100%; height: 56px; background: linear-gradient(to right, var(--primary), var(--secondary));
          color: white; font-weight: 800; font-size: 1.1rem; border: none; border-radius: 12px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-generate-report:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(126, 34, 206, 0.2); }
        .btn-generate-report:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .checker-results { width: 100%; }

        .source-banner { padding: 12px 16px; margin-bottom: 1rem; font-size: 0.85rem; border-radius: 12px; }
        .source-banner .ok { color: #15803d; font-weight: 700; }
        .source-banner .warn { color: #b45309; font-weight: 700; }
        .source-banner .muted { color: var(--text-muted); font-weight: 600; }

        .loader-skeletons { display: flex; flex-direction: column; gap: 1rem; }
        .skeleton { background: #e5e7eb; border-radius: 16px; animation: pulse 1.5s infinite; }
        .s-small { height: 100px; } .s-med { height: 150px; } .s-large { height: 250px; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

        .empty-state-board {
          height: 100%; min-height: 400px; border: 2px dashed var(--border); border-radius: 20px;
          display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; background: rgba(255,255,255,0.4);
        }
        .empty-icon { color: var(--text-muted); margin-bottom: 1rem; opacity: 0.5; }
        .empty-state-board h3 { font-size: 1.5rem; color: var(--text-muted); margin-bottom: 0.5rem; }
        .empty-state-board p { color: var(--text-secondary); max-width: 300px; margin: 0 auto; line-height: 1.5; }

        .interaction-report { padding: 2rem; }
        .border-top-purple { border-top: 6px solid var(--primary); }
        .border-top-amber { border-top: 6px solid #f59e0b; }
        .report-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .report-header h3 { font-size: 1.5rem; font-weight: 800; margin: 0; }
        .header-icon.purple { color: var(--primary); } .header-icon.amber { color: #f59e0b; }

        .clear-status { padding: 1.5rem; border-radius: 12px; border: 1px solid; display: flex; align-items: center; gap: 1rem; background: rgba(240, 253, 244, 0.4); border-color: #bbf7d0; }
        .status-icon.green { color: #16a34a; } .status-icon.muted { color: var(--text-muted); }
        .clear-status p { margin: 0; color: #166534; font-weight: 500; line-height: 1.5; }

        .report-list { display: flex; flex-direction: column; gap: 1rem; }
        .interaction-card { padding: 1.5rem; border-radius: 12px; border-inline-start: 5px solid; display: flex; gap: 1rem; }
        .interaction-card.sev-high { background: #fef2f2; border-color: #ef4444; }
        .interaction-card.sev-mod { background: #fff7ed; border-color: #f97316; }
        .interaction-card.sev-low { background: #f0fdf4; border-color: #22c55e; }

        .icon-high { color: #dc2626; } .icon-mod { color: #ea580c; } .icon-low { color: #16a34a; }

        .card-content { flex: 1; }
        .card-content h4 { font-size: 1.25rem; font-weight: 800; margin: 0.5rem 0; color: var(--text-main); text-align: inherit; }
        .severity-badge { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; display: block; text-align: inherit; }
        .severity-badge.sev-high { color: #b91c1c; } .severity-badge.sev-mod { color: #c2410c; } .severity-badge.sev-low { color: #15803d; }

        .card-details p { margin: 0 0 0.5rem 0; color: var(--text-secondary); line-height: 1.5; font-size: 0.95rem; text-align: inherit; }
        .physician-note { background: rgba(255,255,255,0.6); padding: 0.75rem; border-radius: 8px; margin-top: 0.5rem !important; text-align: inherit; }

        .first-aid-box {
          margin-top: 1rem; padding: 1rem; border-radius: 10px; background: rgba(30, 58, 95, 0.06); border: 1px solid rgba(30, 58, 95, 0.12);
        }
        .first-aid-box h5 { margin: 0 0 0.5rem; display: flex; align-items: center; gap: 8px; font-size: 0.95rem; color: #1e3a5f; }
        .first-aid-box p { margin: 0 0 0.45rem; font-size: 0.88rem; color: var(--text-main); line-height: 1.45; }

        .food-card { flex-direction: column; background: #fffbeb !important; border-color: #fcd34d !important; gap: 0.5rem; }
        .food-card h4 { font-size: 1.25rem; font-weight: 800; color: #92400e; margin: 0 0 0.5rem 0; border-bottom: 1px solid #fde68a; padding-bottom: 0.5rem; text-align: inherit; }
        .food-detail { margin-bottom: 0.75rem; text-align: inherit; }
        .food-detail strong { display: block; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #b45309; margin-bottom: 0.25rem; }
        .food-detail ul { margin: 0; padding-inline-start: 1.25rem; color: var(--text-main); font-size: 0.95rem; }
        .food-detail p { margin: 0; color: var(--text-main); font-size: 0.95rem; line-height: 1.5; }
        .source-note { font-size: 0.8rem; color: #d97706; border-top: 1px solid #fde68a; padding-top: 0.5rem; margin-top: 0.5rem; font-style: italic; text-align: inherit; }

        .disclaimer-box { 
          background: #f8fafc; 
          border: 1px solid #e2e8f0; 
          padding: 1rem 1.25rem; 
          border-radius: 12px; 
          color: #64748b; 
          font-size: 0.8rem; 
          line-height: 1.6; 
          text-align: inherit; 
          margin-top: 2rem;
        }
        .disclaimer-box strong { color: #475569; display: block; margin-bottom: 4px; font-size: 0.85rem; }

        .fa-row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; text-align: inherit; }
        .fa-tag { font-size: 0.65rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; color: #64748b; }
        .fa-tag.gender { color: #7c3aed; }
        .fa-tag.toxic { color: #dc2626; }
        .fa-tag.emergency { color: #991b1b; }
        .fa-val { margin: 0; font-size: 0.9rem; line-height: 1.45; text-align: inherit; }
        .emergency-highlight { background: #fef2f2; padding: 12px; border-radius: 8px; border: 1px dashed #ef4444; }
        
        .space-y-3 > * + * { margin-top: 0.75rem; }

        .padding-large { padding: 3rem; }
        .auth-prompt { text-align: center; max-width: 400px; margin: 0 auto; }
        .auth-icon { color: var(--primary); margin-bottom: 1rem; }
        .auth-prompt h3 { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; }
        .auth-prompt p { color: var(--text-secondary); margin-bottom: 1.5rem; }

        .archive-view h3 { font-size: 1.8rem; font-weight: 800; margin-bottom: 1.5rem; text-align: inherit; }
        .archive-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
        .archive-card { padding: 1.5rem; border: 1px solid var(--border); border-radius: 12px; background: white; display: flex; align-items: center; justify-content: space-between; transition: transform 0.2s, box-shadow 0.2s; }
        .archive-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); border-color: rgba(126, 34, 206, 0.3); }
        .archive-info { text-align: inherit; }
        .archive-info strong { display: block; font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.25rem; }
        .archive-info span { font-size: 0.85rem; color: var(--text-muted); }
        .archive-card-icon { color: var(--primary); opacity: 0.5; }
        .archive-empty { grid-column: 1 / -1; padding: 3rem; text-align: center; color: var(--text-muted); background: rgba(0,0,0,0.02); border-radius: 12px; border: 1px dashed var(--border); font-style: italic; }
      `}</style>
    </div>
  );
};

export default InteractionChecker;
