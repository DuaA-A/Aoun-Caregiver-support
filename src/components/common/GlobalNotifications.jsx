import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Pill, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

const GlobalNotifications = ({ onOpenAuth }) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const { unreadCount, open, setOpen } = useNotifications();
  const isRTL = i18n.language === 'ar';
  const [showGuestMsg, setShowGuestMsg] = useState(false);

  const handleClick = () => {
    if (currentUser) {
      setOpen(!open);
    } else {
      setShowGuestMsg(true);
    }
  };

  return (
    <>
      <div className="global-notif-container" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.button
          className={`floating-notif-btn ${unreadCount > 0 ? 'has-alerts' : ''}`}
          onClick={handleClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        >
          <Bell size={24} />
          {currentUser && unreadCount > 0 && (
            <span className="floating-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
          <div className="glow-effect"></div>
        </motion.button>

        <AnimatePresence>
          {open && currentUser && (
            <div className="floating-panel-wrapper">
              <NotificationBell />
            </div>
          )}

          {showGuestMsg && !currentUser && (
            <motion.div 
              className="guest-notif-modal glass-card"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button className="close-guest" onClick={() => setShowGuestMsg(false)}>
                <X size={20} />
              </button>
              <div className="guest-content">
                <div className="guest-icon-glow">
                  <Pill size={40} className="floating-pill" />
                </div>
                <h3>{t('notifications.guestTitle', 'Unlock Your Care Partner')}</h3>
                <p>
                  {t('notifications.guestDesc', 'Join Aoun for free to unlock smart medication reminders, dose tracking, and real-time safety alerts. Your caregiving journey made easier.')}
                </p>
                <button className="btn btn-premium-glow w-full" onClick={() => { setShowGuestMsg(false); onOpenAuth(); }}>
                  <LogIn size={18} /> {t('auth.createAccount')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .global-notif-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9999;
        }
        [dir="rtl"] .global-notif-container {
          right: auto;
          left: 2rem;
        }

        .floating-notif-btn {
          position: relative;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, var(--text-main), #1e3a5f);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 40px rgba(162, 210, 255, 0.6);
          z-index: 10;
        }

        .glow-effect {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
          z-index: -1;
          opacity: 0.7;
          filter: blur(12px);
          animation: glow-pulse 2s infinite ease-in-out;
        }

        @keyframes glow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        .floating-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 12px;
          border: 2px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .floating-panel-wrapper {
          position: absolute;
          bottom: calc(100% + 1.5rem);
          right: 0;
          width: 400px;
          max-width: 90vw;
        }
        [dir="rtl"] .floating-panel-wrapper {
          right: auto;
          left: 0;
        }

        /* Override NotificationBell absolute positioning when used here */
        .floating-panel-wrapper .notif-bell-wrap { width: 100%; }
        .floating-panel-wrapper .notif-bell { display: none; }
        .floating-panel-wrapper .notif-panel { 
          position: relative; 
          top: 0; 
          right: 0; 
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .guest-notif-modal {
          position: absolute;
          bottom: calc(100% + 1.5rem);
          right: 0;
          width: 320px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          border-radius: 24px;
          background: white;
          box-shadow: 0 25px 50px rgba(10, 37, 64, 0.25);
        }
        [dir="rtl"] .guest-notif-modal {
          right: auto;
          left: 0;
        }

        .close-guest {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
        }

        .guest-icon-glow {
          width: 80px;
          height: 80px;
          background: rgba(157, 141, 241, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: var(--primary);
        }

        .floating-pill {
          animation: float 3s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .guest-content h3 { font-size: 1.25rem; font-weight: 800; color: #0a2540; margin-bottom: 0.75rem; }
        .guest-content p { font-size: 0.95rem; color: #64748b; line-height: 1.6; margin-bottom: 1.5rem; }

        @media (max-width: 640px) {
          .global-notif-container { bottom: 1.5rem; right: 1.5rem; }
          .floating-panel-wrapper { width: 340px; }
          .guest-notif-modal { width: 280px; }
        }
      `}</style>
    </>
  );
};

export default GlobalNotifications;
