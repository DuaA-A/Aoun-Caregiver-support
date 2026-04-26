import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { db, isPreviewMode } from '../../firebase/config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { 
  Pill, 
  LogOut, 
  Shield,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';
import CaregiverCalendar from '../dashboard/CaregiverCalendar';
import BehaviorLog from '../dashboard/BehaviorLog';
import DrugSchedulePanel from '../dashboard/DrugSchedulePanel';
import { useNavigate } from 'react-router-dom';
import { getRxCUI } from '../../services/rxnav';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [medInput, setMedInput] = useState('');
  const [addingMed, setAddingMed] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (isPreviewMode) {
        const meds = JSON.parse(localStorage.getItem('preview_meds') || '[]');
        setMedications(meds);
      } else {
        const medRef = doc(db, 'user_medications', currentUser.uid);
        const medSnap = await getDoc(medRef);
        if (medSnap.exists()) {
          setMedications(medSnap.data().medications || []);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    void fetchUserData();
  }, [fetchUserData]);

  const handleAddMed = async (e) => {
    e.preventDefault();
    if (!medInput.trim()) return;
    setAddingMed(true);
    
    try {
      const rxcui = await getRxCUI(medInput);
      const newMed = { name: medInput, rxcui: rxcui || 'unknown', addedAt: new Date().toISOString() };
      
      if (isPreviewMode) {
        const meds = JSON.parse(localStorage.getItem('preview_meds') || '[]');
        meds.push(newMed);
        localStorage.setItem('preview_meds', JSON.stringify(meds));
        setMedications(meds);
      } else {
        const medRef = doc(db, 'user_medications', currentUser.uid);
        const medSnap = await getDoc(medRef);
        if (!medSnap.exists()) {
          await setDoc(medRef, { medications: [newMed] });
        } else {
          await updateDoc(medRef, { medications: arrayUnion(newMed) });
        }
        setMedications(prev => [...prev, newMed]);
      }
      setMedInput('');
    } catch (err) {
      console.error('Error adding medication:', err);
    } finally {
      setAddingMed(false);
    }
  };

  const removeMed = async (index) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
    if (isPreviewMode) {
      localStorage.setItem('preview_meds', JSON.stringify(updated));
    } else {
      try {
        const medRef = doc(db, 'user_medications', currentUser.uid);
        await updateDoc(medRef, { medications: updated });
      } catch (err) {
        console.error('Error removing medication:', err);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="container section-padding text-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <Shield size={64} className="icon-muted mb-4" />
        <h1>{t('dashboard.secureTitle')}</h1>
        <p>{t('dashboard.secureDesc')}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary mt-4">{t('dashboard.returnHome')}</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container section-padding text-center" dir={isRTL ? 'rtl' : 'ltr'} style={{ paddingTop: '4rem' }}>
        <Loader2 size={40} className="profile-loading-spin" />
        <p className="mt-4" style={{ color: 'var(--text-muted)' }}>{t('auth.processing')}</p>
      </div>
    );
  }

  return (
    <div className="profile-page animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container section-padding">
        <header className="dash-hero">
          <div>
            <p className="dash-kicker">{t('dashboard.welcomeKicker')}</p>
            <h1 className="dash-title">{t('dashboard.welcomeTitle', { name: currentUser.displayName || currentUser.email.split('@')[0] })}</h1>
            <p className="dash-sub">{t('dashboard.welcomeSub')}</p>
          </div>
          <div className="dash-hero-badges">
            <div className="dash-stat-pill">
              <Pill size={20} />
              <div>
                <span className="num">{medications.length}</span>
                <span className="lab">{t('dashboard.drugsArchive')}</span>
              </div>
            </div>
            {isPreviewMode && <span className="badge badge-warning">{t('dashboard.previewMode')}</span>}
          </div>
        </header>

        <div className="dashboard-grid">
        <aside className="profile-sidebar">
          <div className="profile-card glass-card">
            <div className="avatar">{currentUser.email[0].toUpperCase()}</div>
            <h2>{currentUser.displayName || currentUser.email.split('@')[0]}</h2>
            <p className="email">{currentUser.email}</p>
            
            {(currentUser.patientName || currentUser.adStage || currentUser.emergencyContact) && (
              <div className="patient-details">
                {currentUser.patientName && (
                  <div className="detail-item">
                    <span className="label">Patient Name</span>
                    <span className="value">{currentUser.patientName}</span>
                  </div>
                )}
                {currentUser.adStage && (
                  <div className="detail-item">
                    <span className="label">AD Stage</span>
                    <span className="value" style={{ textTransform: 'capitalize' }}>{currentUser.adStage}</span>
                  </div>
                )}
                {currentUser.emergencyContact && (
                  <div className="detail-item">
                    <span className="label">Emergency Contact</span>
                    <span className="value">{currentUser.emergencyContact}</span>
                  </div>
                )}
              </div>
            )}

            <div className="profile-actions">
              <button type="button" onClick={logout} className="btn-dash-logout">
                <LogOut size={18} /> {t('dashboard.logout')}
              </button>
            </div>
          </div>
        </aside>

        <main className="dashboard-main">
          <DrugSchedulePanel currentUser={currentUser} t={t} />

          <div className="dashboard-top-widgets grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CaregiverCalendar />
            <BehaviorLog />
          </div>

          <section className="dashboard-section">
            <div className="section-header">
              <h3><Pill size={20} /> {t('dashboard.myMeds')}</h3>
            </div>
            <div className="med-manager-card glass-card">
              <form onSubmit={handleAddMed} className="med-input-compact">
                <input 
                  type="text" 
                  value={medInput}
                  onChange={(e) => setMedInput(e.target.value)}
                  placeholder={t('dashboard.addPlaceholder')}
                  disabled={addingMed}
                />
                <button type="submit" disabled={addingMed}>
                  {addingMed ? <Loader2 className="animate-spin" /> : <Plus />}
                </button>
              </form>
              <div className="med-list-dashboard">
                {medications.length > 0 ? medications.map((med, i) => (
                  <div key={i} className="med-item-mini">
                    <span>{med.name}</span>
                    <button onClick={() => removeMed(i)}><Trash2 size={16} /></button>
                  </div>
                )) : <p className="empty-mini">{t('dashboard.noMeds')}</p>}
              </div>
            </div>
          </section>
        </main>
        </div>
      </div>

      <style>{`
        .profile-page { padding-top: 1rem; padding-bottom: 5rem; background: linear-gradient(180deg, rgba(10, 37, 64, 0.03) 0%, transparent 32%); }
        .dash-hero { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 1.5rem; margin-bottom: 2.5rem; padding: 1.5rem 0; border-bottom: 1px solid var(--border, rgba(0,0,0,0.06)); }
        .dash-kicker { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 800; color: #7c3aed; margin: 0 0 0.5rem; }
        .dash-title { font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 800; color: #0a2540; margin: 0; line-height: 1.25; font-family: 'Plus Jakarta Sans', 'Tajawal', sans-serif; }
        .dash-sub { margin: 0.5rem 0 0; color: #64748b; font-size: 1rem; max-width: 52ch; line-height: 1.5; }
        .dash-hero-badges { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .dash-stat-pill { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid var(--border, rgba(0,0,0,0.08)); border-radius: 16px; padding: 12px 18px; box-shadow: 0 4px 20px rgba(10, 37, 64, 0.06); }
        .dash-stat-pill .num { display: block; font-size: 1.4rem; font-weight: 800; color: #0a2540; }
        .dash-stat-pill .lab { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; font-weight: 700; }
        .dashboard-grid { display: grid; grid-template-columns: 280px 1fr; gap: 2rem; align-items: start; }
        .profile-sidebar { position: sticky; top: 96px; height: fit-content; }
        .profile-card { padding: 1.75rem; text-align: center; }
        .avatar { width: 72px; height: 72px; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.75rem; font-weight: 800; box-shadow: 0 8px 24px rgba(79, 70, 229, 0.25); }
        .profile-card h2 { font-size: 1.1rem; margin-bottom: 0.2rem; color: #0a2540; }
        .email { font-size: 0.8rem; color: #64748b; margin-bottom: 0; }
        
        .patient-details { margin-top: 1.5rem; background: rgba(248, 250, 252, 0.5); padding: 1rem; border-radius: 12px; border: 1px solid var(--border); text-align: left; }
        [dir="rtl"] .patient-details { text-align: right; }
        .detail-item { display: flex; flex-direction: column; margin-bottom: 0.75rem; }
        .detail-item:last-child { margin-bottom: 0; }
        .detail-item .label { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .detail-item .value { font-size: 0.95rem; font-weight: 600; color: #0a2540; }

        .profile-actions { margin-top: 1.25rem; }
        .btn-dash-logout { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; border-radius: 12px; border: 1px solid #fecdd3; background: #fff1f2; color: #be123c; font-weight: 700; cursor: pointer; }
        .btn-dash-logout:hover { background: #ffe4e6; }
        .badge-warning { background: #fffbeb; color: #92400e; font-size: 0.7rem; padding: 6px 10px; border-radius: 8px; font-weight: 700; }

        .dashboard-main { display: flex; flex-direction: column; gap: 4rem; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .section-header h3 { display: flex; align-items: center; gap: 10px; font-size: 1.15rem; }
        

        
        .med-manager-card { padding: 2rem; }
        .med-input-compact { display: flex; gap: 8px; margin-bottom: 1.5rem; }
        .med-input-compact input { flex: 1; height: 44px; border: 1.5px solid var(--border); border-radius: 8px; padding: 0 1rem; }
        .med-input-compact button { width: 44px; height: 44px; background: var(--primary); color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .med-list-dashboard { display: flex; flex-direction: column; gap: 8px; }
        .med-item-mini { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: white; border: 1px solid var(--border); border-radius: 8px; }
        .med-item-mini span { font-weight: 600; font-size: 0.9rem; }
        .med-item-mini button { background: none; border: none; color: var(--text-muted); cursor: pointer; }
        .empty-mini { text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 1rem; }

        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .gap-6 { gap: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        
        @media (min-width: 1024px) {
          .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        .profile-loading-spin { animation: spin 0.9s linear infinite; color: var(--primary); }
        @keyframes spin { to { transform: rotate(360deg); } }

        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .flex { display: flex; }
        .gap-3 { gap: 0.75rem; }
        .gap-2 { gap: 0.5rem; }
        .text-lg { font-size: 1.125rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .text-sm { font-size: 0.875rem; }
        .w-full { width: 100%; }
        .p-6 { padding: 1.5rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mt-1 { margin-top: 0.25rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .bg-gray-200 { background-color: #e5e7eb; }
        .text-gray-500 { color: #6b7280; }
        .text-orange-500 { color: #f97316; }
        .text-purple-500 { color: #a855f7; }
        .text-green-500 { color: #22c55e; }
        .text-blue-500 { color: #3b82f6; }
        .appearance-none { appearance: none; }
        .cursor-pointer { cursor: pointer; }

        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .profile-sidebar { position: relative; top: 0; order: 2; }
          .dashboard-main { order: 1; }
          .dash-hero { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
