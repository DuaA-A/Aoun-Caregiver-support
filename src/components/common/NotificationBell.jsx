import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Clock, X, Pill } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationBell = ({ isFAB = false }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const nav = useNavigate();
  const n = useNotifications();
  const panelRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (!n?.open) return;
      if (panelRef.current && !panelRef.current.contains(e.target) && !e.target.closest?.('[data-bell]')) {
        n.setOpen(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [n?.open, n]);

  const { items, unreadCount, open, setOpen, markRead, markAllRead, markTaken } = n;

  return (
    <div className={`notif-bell-wrap ${isFAB ? 'is-fab' : ''}`} ref={panelRef} dir={isRTL ? 'rtl' : 'ltr'}>
      <button
        type="button"
        className="notif-bell"
        data-bell
        aria-label={t('notifications.title')}
        onClick={() => setOpen(!open)}
      >
        <Bell size={isFAB ? 28 : 22} strokeWidth={2} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className={`notif-panel glass-card ${isFAB ? 'panel-fab' : ''}`} role="dialog" aria-label={t('notifications.title')}>
          <div className="notif-head">
            <h4>{t('notifications.title')}</h4>
            <div className="notif-head-actions">
              {items.some((i) => !i.read) && (
                <button type="button" className="notif-text-btn" onClick={() => markAllRead()}>
                  <CheckCheck size={16} /> {t('notifications.markAllRead')}
                </button>
              )}
              <button type="button" className="notif-icon-x" onClick={() => setOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
          </div>

          <ul className="notif-list">
            {items.length === 0 && <li className="notif-empty">{t('notifications.empty')}</li>}
            {items.map((i) => (
              <li key={i.id} className={`notif-item ${!i.read ? 'unread' : ''} ${i.taken ? 'done' : ''}`}>
                <div className="notif-ico">
                  <Pill size={18} />
                </div>
                <div className="notif-body">
                  <strong>
                    {t('notifications.doseTitle', { name: i.drugName, time: i.time })}
                  </strong>
                  <span className="notif-sub">
                    <Clock size={12} /> {i.dateKey} · {i.time}
                  </span>
                  {!i.taken && i.type === 'dose_due' && (
                    <div className="notif-actions">
                      <button
                        type="button"
                        className="notif-pill mark-read"
                        onClick={() => markRead(i.id)}
                      >
                        {t('notifications.markRead')}
                      </button>
                      <button
                        type="button"
                        className="notif-pill mark-taken"
                        onClick={() => markTaken(i)}
                      >
                        <Check size={16} />
                        {t('notifications.markTaken')}
                      </button>
                    </div>
                  )}
                  {i.taken && <span className="notif-done-lbl"><Check size={14} /> {t('notifications.taken')}</span>}
                </div>
              </li>
            ))}
          </ul>

          <div className="notif-footer">
            <button type="button" className="notif-link-dash" onClick={() => { setOpen(false); nav('/profile'); }}>
              {t('notifications.openDashboard')}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .notif-bell-wrap { position: relative; z-index: 1001; }
        .notif-bell {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border: none; border-radius: 12px; cursor: pointer;
          background: rgba(10, 37, 64, 0.06);
          color: #0a2540;
          transition: background 0.2s, color 0.2s, transform 0.15s;
        }
        .notif-bell:hover { background: rgba(10, 37, 64, 0.12); }
        .is-fab .notif-bell {
          width: 64px; height: 64px; border-radius: 50%;
          background: linear-gradient(135deg, #1e3a5f, #3b82f6);
          color: #fff;
          box-shadow: 0 10px 30px rgba(30, 58, 95, 0.4);
          border: 3px solid #fff;
        }
        .is-fab .notif-bell:hover { transform: scale(1.05); box-shadow: 0 15px 40px rgba(30, 58, 95, 0.5); }
        
        .navbar-transparent .notif-bell { background: rgba(255,255,255,0.2); color: #fff; }
        .navbar-transparent .notif-bell:hover { background: rgba(255,255,255,0.3); }
        .navbar-scrolled .notif-bell { background: rgba(10, 37, 64, 0.06); color: #0a2540; }
        
        .notif-badge {
          position: absolute; top: 4px; right: 4px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px;
          background: #ef4444; color: #fff; font-size: 0.65rem; font-weight: 800; line-height: 18px; text-align: center;
          border: 2px solid #fff;
        }
        .is-fab .notif-badge { top: 10px; right: 10px; width: 22px; height: 22px; line-height: 22px; font-size: 0.75rem; }
        
        [dir="rtl"] .notif-badge { right: auto; left: 4px; }
        [dir="rtl"].is-fab .notif-badge { left: 10px; }

        .notif-panel {
          position: absolute; top: calc(100% + 15px);
          right: 0; width: min(400px, 96vw);
          max-height: min(70vh, 520px);
          display: flex; flex-direction: column; padding: 0;
          background: #fff; border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 20px 60px rgba(10, 37, 64, 0.2);
          border-radius: 24px; overflow: hidden; z-index: 1002;
          animation: notifPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-origin: top right;
        }
        
        .panel-fab {
          top: auto; bottom: calc(100% + 20px);
          transform-origin: bottom right;
        }
        
        [dir="rtl"] .notif-panel { right: auto; left: 0; transform-origin: top left; }
        [dir="rtl"] .panel-fab { transform-origin: bottom left; }

        @keyframes notifPop {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .notif-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid rgba(0,0,0,0.06); background: #f8fafc; }
        .notif-head h4 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #1e293b; }
        .notif-list { list-style: none; margin: 0; padding: 12px; overflow-y: auto; flex: 1; min-height: 120px; }
        .notif-item { display: flex; gap: 14px; padding: 16px; border-radius: 16px; margin-bottom: 8px; transition: all 0.2s; border: 1px solid transparent; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .notif-item.unread { background: #f0f9ff; border-color: #bae6fd; }
        .notif-item:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        
        .notif-ico { width: 40px; height: 40px; border-radius: 12px; background: #f1f5f9; color: #3b82f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .unread .notif-ico { background: #fff; }
        
        .notif-body strong { font-size: 0.95rem; color: #1e293b; line-height: 1.4; }
        .notif-sub { font-size: 0.8rem; color: #64748b; margin-top: 4px; }
        
        .notif-actions { display: flex; gap: 8px; margin-top: 12px; }
        .notif-pill { padding: 8px 14px; border-radius: 10px; font-weight: 700; transition: all 0.2s; }
        .notif-pill.mark-taken { background: #1e3a5f; color: #fff; }
        .notif-pill.mark-taken:hover { background: #2a528a; transform: translateY(-1px); }

        .notif-footer { padding: 16px; background: #f8fafc; border-top: 1px solid rgba(0,0,0,0.06); }
        .notif-link-dash { width: 100%; padding: 10px; border-radius: 10px; background: #fff; border: 1px solid #e2e8f0; color: #1e3a5f; transition: all 0.2s; }
        .notif-link-dash:hover { background: #1e3a5f; color: #fff; }

        @media (max-width: 768px) {
          .panel-fab {
            position: fixed;
            bottom: 100px;
            right: 20px;
            left: auto;
            width: 320px;
            max-width: calc(100vw - 40px);
            transform-origin: bottom right;
          }
          [dir="rtl"] .panel-fab { right: auto; left: 20px; transform-origin: bottom left; }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
