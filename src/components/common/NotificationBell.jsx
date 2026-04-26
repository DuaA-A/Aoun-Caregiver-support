import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Clock, X, Pill } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationBell = () => {
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
    <div className="notif-bell-wrap" ref={panelRef} dir={isRTL ? 'rtl' : 'ltr'}>
      <button
        type="button"
        className="notif-bell"
        data-bell
        aria-label={t('notifications.title')}
        onClick={() => setOpen(!open)}
      >
        <Bell size={22} strokeWidth={2} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-panel glass-card" role="dialog" aria-label={t('notifications.title')}>
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
        .navbar-transparent .notif-bell { background: rgba(255,255,255,0.2); color: #fff; }
        .navbar-transparent .notif-bell:hover { background: rgba(255,255,255,0.3); }
        .navbar-scrolled .notif-bell { background: rgba(10, 37, 64, 0.06); color: #0a2540; }
        .notif-badge {
          position: absolute; top: 4px; right: 4px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px;
          background: #e11d48; color: #fff; font-size: 0.65rem; font-weight: 800; line-height: 18px; text-align: center;
        }
        [dir="rtl"] .notif-badge { right: auto; left: 4px; }
        .notif-panel {
          position: absolute; top: calc(100% + 10px);
          right: 0; width: min(400px, 96vw);
          max-height: min(70vh, 520px);
          display: flex; flex-direction: column; padding: 0;
          background: #fff; border: 1px solid var(--border, rgba(0,0,0,0.08));
          box-shadow: 0 20px 50px rgba(10, 37, 64, 0.18);
          border-radius: 16px; overflow: hidden; z-index: 1002;
        }
        [dir="rtl"] .notif-panel { right: auto; left: 0; }
        .notif-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border, rgba(0,0,0,0.06)); gap: 8px; }
        .notif-head h4 { margin: 0; font-size: 1.05rem; font-weight: 800; color: #0a2540; }
        .notif-head-actions { display: flex; align-items: center; gap: 8px; }
        .notif-text-btn { display: inline-flex; align-items: center; gap: 4px; border: none; background: none; color: #2563eb; font-size: 0.8rem; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .notif-text-btn:hover { text-decoration: underline; }
        .notif-icon-x { border: none; background: none; color: #64748b; cursor: pointer; padding: 4px; border-radius: 8px; }
        .notif-icon-x:hover { background: #f1f5f9; color: #0f172a; }
        .notif-list { list-style: none; margin: 0; padding: 8px; overflow-y: auto; flex: 1; min-height: 120px; }
        .notif-empty { padding: 1.5rem; text-align: center; color: #94a3b8; font-size: 0.9rem; }
        .notif-item { display: flex; gap: 12px; padding: 12px; border-radius: 12px; margin-bottom: 4px; border: 1px solid transparent; }
        .notif-item.unread { background: #f0f9ff; border-color: #bae6fd; }
        .notif-item.done { background: #f0fdf4; border-color: #bbf7d0; opacity: 1; }
        .notif-item.done .notif-ico { color: #16a34a; }
        .notif-ico { color: #7c3aed; flex-shrink: 0; margin-top: 2px; }
        .notif-body { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; text-align: start; }
        .notif-body strong { font-size: 0.9rem; line-height: 1.35; color: #0a2540; }
        .notif-sub { font-size: 0.75rem; color: #64748b; display: flex; align-items: center; gap: 4px; }
        .notif-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .notif-pill { display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; cursor: pointer; border: none; }
        .notif-pill.mark-read { background: #f1f5f9; color: #475569; }
        .notif-pill.mark-taken { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #fff; }
        .notif-done-lbl { font-size: 0.75rem; color: #16a34a; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
        .notif-footer { padding: 10px 14px; border-top: 1px solid var(--border, rgba(0,0,0,0.06)); text-align: center; }
        .notif-link-dash { border: none; background: none; color: #2563eb; font-weight: 700; font-size: 0.85rem; cursor: pointer; text-decoration: underline; }
        @media (max-width: 900px) {
          .notif-panel { position: fixed; top: 80px; right: 8px; left: 8px; width: auto; max-height: 70vh; }
          [dir="rtl"] .notif-panel { left: 8px; right: 8px; }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
