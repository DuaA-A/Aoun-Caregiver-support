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

const UserProfile = () => {
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
        const d = JSON.parse(localStorage.getItem('preview_drug_schedule') || '{"schedule":[]}');
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
  }, [fetchUserData]);

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
            {isPreviewMode && <div className="preview-pill">Preview Mode</div></div>
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
              {/* Top Widgets Row */}
              <div className="widgets-row">
                <CaregiverCalendar />
                <BehaviorLog />
              </div>

              {/* Main Medication Management Panel */}
              <DrugSchedulePanel currentUser={currentUser} t={t} />
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .profile-page { background: #f8fafc; min-height: 100vh; padding-top: 100px; padding-bottom: 80px; }
        
        .profile-header-new {
          display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
          padding: 2.5rem; border-radius: 30px; gap: 2rem;
          background: linear-gradient(135deg, #ffffff, #f0f7ff);
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
          border: 1px solid rgba(255,255,255,0.8);
        }
        .profile-hero-info { display: flex; align-items: center; gap: 1.5rem; }
        .profile-avatar-large {
          width: 90px; height: 90px; border-radius: 24px;
          background: linear-gradient(135deg, #3b82f6, #1e3a5f);
          color: white; font-size: 2.5rem; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 15px 35px rgba(30, 58, 95, 0.2);
        }
        .profile-text-group { display: flex; flex-direction: column; }
        .profile-kicker { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #3b82f6; font-weight: 800; margin-bottom: 4px; }
        .profile-name { font-size: 2.2rem; font-weight: 900; color: #1e293b; margin: 0; line-height: 1.1; }
        .profile-email { font-size: 0.95rem; color: #64748b; margin-top: 4px; }
        
        .profile-header-stats { display: flex; gap: 1.5rem; align-items: center; }
        .stat-item { text-align: center; background: white; padding: 12px 24px; border-radius: 18px; border: 1px solid rgba(0,0,0,0.05); min-width: 120px; }
        .stat-val { display: block; font-size: 1.8rem; font-weight: 900; color: #1e3a5f; }
        .stat-lab { font-size: 0.7rem; text-transform: uppercase; color: #64748b; font-weight: 700; }
        .preview-pill { background: #fff7ed; color: #c2410c; padding: 6px 14px; border-radius: 12px; font-weight: 800; font-size: 0.75rem; border: 1px solid #ffedd5; }

        .profile-main-grid { display: grid; grid-template-columns: 320px 1fr; gap: 2rem; }
        
        .card-head { padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .card-head h3 { margin: 0; font-size: 1rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 10px; }
        
        .card-body { padding: 1.5rem; }
        .p-detail { margin-bottom: 1.25rem; }
        .p-detail:last-child { margin-bottom: 0; }
        .p-label { display: block; font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 4px; }
        .p-value { font-size: 1rem; font-weight: 700; color: #334155; }
        .stage-tag { color: #3b82f6; text-transform: capitalize; }
        
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
