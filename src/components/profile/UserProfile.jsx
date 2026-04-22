import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { db, isPreviewMode } from '../../firebase/config';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { 
  User, 
  History, 
  Pill, 
  LogOut, 
  ChevronRight, 
  Shield,
  Plus,
  Trash2,
  Calendar,
  Activity
} from 'lucide-react';
import CaregiverCalendar from '../dashboard/CaregiverCalendar';
import BehaviorLog from '../dashboard/BehaviorLog';
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

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
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
  };

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

  return (
    <div className="profile-page container section-padding animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="dashboard-grid">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-card glass-card">
            <div className="avatar">{currentUser.email[0].toUpperCase()}</div>
            <h2>{currentUser.displayName || currentUser.email.split('@')[0]}</h2>
            <p className="email">{currentUser.email}</p>
            {isPreviewMode && <span className="badge badge-warning">{t('dashboard.previewMode')}</span>}
            <div className="profile-stats">
              <div className="stat">
                <strong>{medications.length}</strong>
                <span>{t('dashboard.drugsArchive')}</span>
              </div>
            </div>
            <button onClick={logout} className="btn btn-ghost full-width logout-btn">
              <LogOut size={18} /> {t('dashboard.logout')}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="dashboard-main">


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

      <style>{`
        .profile-page { padding-top: 2rem; padding-bottom: 8rem; }
        .dashboard-grid { display: grid; grid-template-columns: 280px 1fr; gap: 3rem; }
        .profile-sidebar { position: sticky; top: 100px; height: fit-content; }
        .profile-card { padding: 3rem 2rem; text-align: center; }
        .avatar { width: 64px; height: 64px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.5rem; font-weight: 800; }
        .profile-card h2 { font-size: 1.25rem; margin-bottom: 0.25rem; }
        .email { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem; }
        .badge-warning { background: #fffbeb; color: #92400e; font-size: 0.7rem; padding: 4px 8px; border-radius: 4px; font-weight: 700; margin-bottom: 2rem; display: inline-block; }
        
        .profile-stats { display: flex; justify-content: space-around; padding: 1.5rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin: 1.5rem 0; }
        .stat { display: flex; flex-direction: column; gap: 4px; }
        .stat strong { font-size: 1.15rem; }
        .stat span { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
        .logout-btn { color: #c0392b !important; }

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
          .lg\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

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
          .profile-sidebar { position: relative; top: 0; }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
