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
              <p className="fa-val font-bold text-purple-700">{gs}</p>
            </div>
          )}
          {fa?.general && (
            <div className="fa-row">
              <span className="fa-tag">{t('checker.faGeneral')}</span>
              <p className="fa-val">{fa.general}</p>
            </div>
          )}
          {fa?.toxicity && (
            <div className="fa-row">
              <span className="fa-tag toxic">{t('checker.faToxicity')}</span>
              <p className="fa-val text-red-600 font-black">{fa.toxicity}</p>
            </div>
          )}
          {fa?.emergencyProtocol && (
            <div className="fa-row emergency-highlight">
              <span className="fa-tag emergency">{t('checker.faEmergency')}</span>
              <p className="fa-val font-black text-red-900 uppercase">{fa.emergencyProtocol}</p>
            </div>
          )}
          {fa?.pregnancy && (
            <div className="fa-row">
              <span className="fa-tag">{t('checker.faPregnancy')}</span>
              <p className="fa-val">{fa.pregnancy}</p>
            </div>
          )}
          {fa?.pediatric && (
            <div className="fa-row">
              <span className="fa-tag">{t('checker.faPediatric')}</span>
              <p className="fa-val">{fa.pediatric}</p>
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
                  <div className="critical-medical-disclaimer glass-card mb-6">
                    <AlertTriangle size={24} className="text-red-600" />
                    <p className="font-bold text-red-800">{t('checker.criticalDisclaimer')}</p>
                  </div>

                  {reportData.meta && (
                    <div className="source-banner glass-card">
                      {reportData.meta.rxnavUsed ? (
                        <span className="ok">{t('checker.sourceRxnav')}</span>
                      ) : reportData.meta.rxnavAttempted ? (
                        <span className="warn">{t('checker.sourceRxnavEmpty')}</span>
                      ) : (
                        <span className="warn">{t('checker.sourceRxnavShort')}</span>
                      )}
                      {reportData.meta.localPairs > 0 && (
                        <span className="muted"> · {t('checker.sourceLocal', { n: reportData.meta.localPairs })}</span>
                      )}
                    </div>
                  )}

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
                                  <strong>{t('checker.description')}</strong> {inter.description}
                                </p>
                                <p className="physician-note">
                                  <strong>{t('checker.note')}</strong> {inter.recommendation}
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

        .disclaimer-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 1.25rem; border-radius: 12px; color: #1e40af; font-size: 0.9rem; line-height: 1.6; text-align: inherit; }

        .critical-medical-disclaimer { display: flex; gap: 1rem; align-items: center; padding: 1.25rem; background: #fff1f2; border: 2px solid #fecaca; border-radius: 16px; }
        .critical-medical-disclaimer p { margin: 0; font-size: 0.95rem; line-height: 1.5; }

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
