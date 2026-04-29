import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { db, isPreviewMode } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { 
  LogOut, 
  Shield,
  Loader2,
  User,
} from 'lucide-react';
import CaregiverCalendar from '../dashboard/CaregiverCalendar';
import BehaviorLog from '../dashboard/BehaviorLog';
import DrugSchedulePanel from '../dashboard/DrugSchedulePanel';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ onOpenAuth }) => {
  const { currentUser, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [medCount, setMedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (isPreviewMode) {
        const uid = currentUser.uid;
        const d = JSON.parse(localStorage.getItem(`preview_drug_schedule_${uid}`) || '{"schedule":[]}');
        setMedCount(d.schedule?.length || 0);
      } else {
        const snap = await getDoc(doc(db, 'user_drug_schedule', currentUser.uid));
        if (snap.exists()) {
          setMedCount(snap.data().schedule?.length || 0);
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
    const handleUpdate = () => fetchUserData();
    window.addEventListener('dose-updated', handleUpdate);
    return () => window.removeEventListener('dose-updated', handleUpdate);
  }, [fetchUserData]);

  if (!currentUser) {
    return (
      <div className="profile-unauth-screen" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="unauth-glass-card glass-card animate-fade-in">
          <div className="unauth-icon-box"><Shield size={48} /></div>
          <h1 className="unauth-title">{t('dashboard.secureTitle')}</h1>
          <p className="unauth-desc">{t('dashboard.secureDesc')}</p>
          <div className="unauth-actions">
            <button onClick={onOpenAuth} className="btn btn-premium">
              <User size={18} /> {t('auth.signIn')}
            </button>
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              {t('dashboard.returnHome')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-loading-screen" dir={isRTL ? 'rtl' : 'ltr'}>
        <Loader2 size={48} className="profile-loading-spin" />
        <p>{t('auth.processing')}</p>
      </div>
    );
  }

  return (
    <div className="profile-page animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container py-8">
        {/* Header Section */}
        <header className="profile-header-new glass-card mb-8">
          <div className="profile-hero-info">
            <div className="profile-avatar-large">
              {currentUser.displayName?.[0] || currentUser.email?.[0].toUpperCase()}
            </div>
            <div className="profile-text-group">
              <span className="profile-kicker">{t('dashboard.welcomeKicker')}</span>
              <h1 className="profile-name">
                {currentUser.displayName || currentUser.email.split('@')[0]}
              </h1>
              <p className="profile-email">{currentUser.email}</p>
            </div>
          </div>
          <div className="profile-header-stats">
            <div className="stat-item">
              <span className="stat-val">{medCount}</span>
              <span className="stat-lab">{t('dashboard.drugsArchive')}</span>
            </div>
            {isPreviewMode && <div className="preview-pill">Preview Mode</div>}
          </div>
        </header>

        <div className="profile-main-grid">
          {/* Sidebar Area */}
          <aside className="profile-left-col">
            <section className="info-card glass-card mb-6">
              <div className="card-head">
                <h3><User size={18} /> {isRTL ? 'معلومات المريض' : 'Patient Info'}</h3>
              </div>
              <div className="card-body">
                <div className="p-detail">
                  <span className="p-label">Patient Name</span>
                  <span className="p-value">{currentUser.patientName || 'Not Set'}</span>
                </div>
                <div className="p-detail">
                  <span className="p-label">AD Stage</span>
                  <span className="p-value stage-tag">{currentUser.adStage || 'Not Set'}</span>
                </div>
                <div className="p-detail">
                  <span className="p-label">Emergency Contact</span>
                  <span className="p-value">{currentUser.emergencyContact || 'Not Set'}</span>
                </div>
              </div>
            </section>

            <button onClick={logout} className="logout-btn-premium">
              <LogOut size={18} /> {t('dashboard.logout')}
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="profile-right-col">
            <div className="dashboard-content-stack">
              {/* Main Medication Management Panel (Top Priority) */}
              <DrugSchedulePanel currentUser={currentUser} t={t} />

              {/* Secondary Widgets Row */}
              <div className="widgets-row">
                <CaregiverCalendar currentUser={currentUser} />
                <BehaviorLog />
              </div>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .profile-page { background: #f8fafc; min-height: 100vh; padding-top: 100px; padding-bottom: 60px; }
        
        .profile-unauth-screen {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: var(--bg-gradient); padding: 2rem;
          padding-top: 100px; /* Safe offset for fixed navbar */
        }
        .unauth-glass-card {
          max-width: 550px; width: 90%; padding: 4rem 2.5rem; text-align: center;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.4);
          overflow: hidden;
        }
        .unauth-icon-box {
          width: 80px; height: 80px; border-radius: 50%; background: #eff6ff; color: #3b82f6;
          display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;
        }
        .unauth-title { font-size: 2.2rem; font-weight: 900; color: #1e3a5f; margin-bottom: 1rem; line-height: 1.2; }
        .unauth-desc { font-size: 1.1rem; color: #64748b; line-height: 1.6; margin-bottom: 2rem; padding: 0 1rem; }
        .unauth-actions { display: flex; flex-direction: column; gap: 1rem; align-items: stretch; }
        .unauth-actions .btn { width: 100%; }
        .rotate-180 { transform: rotate(180deg); }
        
        .profile-header-new {
          display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
          padding: 2rem; border-radius: 28px; gap: 2rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(30, 58, 95, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .profile-hero-info { display: flex; align-items: center; gap: 2rem; }
        .profile-avatar-large {
          width: 100px; height: 100px; border-radius: 28px;
          background: linear-gradient(135deg, #3b82f6, #1e3a5f);
          color: white; font-size: 2.8rem; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 15px 35px rgba(30, 58, 95, 0.2);
          border: 4px solid white;
        }
        .profile-text-group { display: flex; flex-direction: column; }
        .profile-kicker { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em; color: #3b82f6; font-weight: 800; margin-bottom: 6px; opacity: 0.8; }
        .profile-name { font-size: 2.5rem; font-weight: 900; color: #1e293b; margin: 0; line-height: 1; letter-spacing: -0.02em; }
        .profile-email { font-size: 1rem; color: #64748b; margin-top: 8px; font-weight: 500; }
        
        .profile-header-stats { display: flex; gap: 1rem; align-items: center; }
        .stat-item { text-align: center; background: white; padding: 15px 30px; border-radius: 20px; border: 1px solid rgba(0,0,0,0.03); box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .stat-val { display: block; font-size: 2rem; font-weight: 900; color: #1e3a5f; line-height: 1; margin-bottom: 4px; }
        .stat-lab { font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.05em; }
        .preview-pill { background: #eff6ff; color: #3b82f6; padding: 8px 16px; border-radius: 12px; font-weight: 800; font-size: 0.8rem; border: 1px solid #dbeafe; }

        .profile-main-grid { display: grid; grid-template-columns: 320px 1fr; gap: 2rem; align-items: start; }
        .profile-left-col { position: sticky; top: 100px; }
        
        .info-card { border-radius: 20px; overflow: hidden; background: white; border: 1px solid rgba(0,0,0,0.03); box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
        .card-head { padding: 1.25rem; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
        .card-head h3 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 12px; }
        
        .card-body { padding: 1.25rem; }
        .p-detail { margin-bottom: 1rem; }
        .p-detail:last-child { margin-bottom: 0; }
        .p-label { display: block; font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 800; letter-spacing: 0.08em; margin-bottom: 6px; }
        .p-value { font-size: 1.1rem; font-weight: 700; color: #334155; }
        .stage-tag { color: #3b82f6; text-transform: capitalize; padding: 4px 10px; background: #eff6ff; border-radius: 8px; font-size: 0.9rem; }
        
        .logout-btn-premium {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 14px; border-radius: 16px; border: 1px solid #fee2e2; background: #fff;
          color: #ef4444; font-weight: 800; cursor: pointer; transition: all 0.2s;
        }
        .logout-btn-premium:hover { background: #fef2f2; transform: translateY(-2px); }

        .dashboard-content-stack { display: flex; flex-direction: column; gap: 2rem; }
        .widgets-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        
        .profile-loading-screen {
          height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 1.5rem; color: #64748b; font-weight: 600;
        }
        .profile-loading-spin { animation: spin 0.9s linear infinite; color: #3b82f6; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1100px) {
          .profile-main-grid { grid-template-columns: 1fr; }
          .profile-left-col { order: 2; }
          .profile-right-col { order: 1; }
          .widgets-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .profile-header-new { padding: 1.5rem; text-align: center; flex-direction: column; }
          .profile-hero-info { flex-direction: column; }
          .profile-name { font-size: 1.8rem; }
          .profile-header-stats { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
