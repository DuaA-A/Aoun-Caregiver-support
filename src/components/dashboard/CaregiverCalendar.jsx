import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Clock, Bell, ChevronRight, Plus, Pill, Check } from 'lucide-react';
import { useMemo } from 'react';

const CaregiverCalendar = ({ currentUser }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [timeLeft, setTimeLeft] = useState('--:--:--');
  const [schedule, setSchedule] = useState([]);
  const [adherence, setAdherence] = useState([]);

  useEffect(() => {
    const load = () => {
      const LS_SCHEDULE = 'preview_drug_schedule';
      try {
        const uid = currentUser?.uid;
        if (!uid) return;
        const d = JSON.parse(localStorage.getItem(`${LS_SCHEDULE}_${uid}`) || '{"schedule":[],"adherence":[]}');
        setSchedule(d.schedule || []);
        setAdherence(d.adherence || []);
      } catch (e) { console.error(e); }
    };
    load();
    window.addEventListener('dose-updated', load);
    const id = setInterval(load, 30000);
    return () => {
      window.removeEventListener('dose-updated', load);
      clearInterval(id);
    };
  }, [currentUser?.uid]);

  const reminders = useMemo(() => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const list = [];
    schedule.forEach(s => {
      s.times?.forEach(tm => {
        const isTaken = adherence.some(a => a.entryId === s.id && a.date === dateStr && a.time === tm && a.status === 'taken');
        list.push({ id: `${s.id}-${tm}`, title: s.name, time: tm, type: 'medical', taken: isTaken });
      });
    });
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }, [schedule, adherence]);

  return (
    <div className="cal-premium glass-card" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="cal-head">
        <div className="cal-title">
          <div className="cal-ico-box"><CalendarIcon size={20} /></div>
          <div>
            <h3>{t('dashboard.calendarTitle')}</h3>
            <p>{t('dashboard.calendarSubtitle')}</p>
          </div>
        </div>
        <button className="cal-add-btn"><Plus size={18} /></button>
      </header>

      <div className="cal-body">
        {reminders.length > 0 ? (
          <>
            {/* Reminders List */}
            <div className="reminders-stack">
              <div className="stack-label">{t('dashboard.upcomingTasks')}</div>
              {reminders.map(r => (
                <div key={r.id} className={`reminder-card-new ${r.taken ? 'is-taken' : ''}`}>
                  <div className={`reminder-indicator ${r.type}`}></div>
                  <div className="reminder-details">
                    <span className="r-name">{r.title}</span>
                    <span className="r-time">{r.time} {r.taken ? `(${t('notifications.taken')})` : ''}</span>
                  </div>
                  {r.taken ? <Check size={18} className="r-check" /> : <ChevronRight size={18} className="r-chevron" />}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="cal-empty-state">
            <Pill size={48} className="empty-ico" />
            <p>{isRTL ? 'لا توجد جرعات مجدولة. يرجى إضافة أدوية لتحديث مواعيدك.' : 'No scheduled doses. Please add drugs to update your schedule.'}</p>
          </div>
        )}
      </div>

      <style>{`
        .cal-premium { overflow: hidden; border-radius: 24px; background: white; height: 100%; display: flex; flex-direction: column; }
        .cal-head { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
        .cal-title { display: flex; gap: 12px; align-items: center; }
        .cal-ico-box { width: 40px; height: 40px; border-radius: 12px; background: #eff6ff; color: #3b82f6; display: flex; align-items: center; justify-content: center; }
        .cal-head h3 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #1e293b; }
        .cal-head p { margin: 2px 0 0; font-size: 0.8rem; color: #94a3b8; font-weight: 600; }
        
        .cal-add-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .cal-add-btn:hover { background: #f8fafc; color: #1e293b; }

        .cal-body { padding: 1.5rem; flex: 1; }
        
        .next-dose-banner {
          background: #1e3a5f; border-radius: 18px; padding: 1.25rem; color: white;
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
          box-shadow: 0 10px 25px rgba(30, 58, 95, 0.15);
        }
        .banner-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.8; font-weight: 800; }
        .banner-time { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
        .banner-time strong { font-size: 1.1rem; font-weight: 800; }
        .banner-countdown { font-size: 1.2rem; font-weight: 900; font-family: monospace; letter-spacing: 1px; }

        .reminders-stack { display: flex; flex-direction: column; gap: 10px; }
        .stack-label { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
        
        .reminder-card-new {
          display: flex; align-items: center; gap: 12px; padding: 12px;
          background: #f8fafc; border-radius: 14px; border: 1px solid #f1f5f9;
          transition: all 0.2s; cursor: pointer;
        }
        .reminder-card-new:hover { background: white; border-color: #3b82f6; transform: translateX(5px); }
        [dir="rtl"] .reminder-card-new:hover { transform: translateX(-5px); }
        
        .reminder-indicator { width: 4px; height: 30px; border-radius: 4px; }
        .reminder-indicator.activity { background: #3b82f6; }
        .reminder-indicator.exercise { background: #10b981; }
        .reminder-indicator.medical { background: #f59e0b; }
        
        .reminder-details { flex: 1; display: flex; flex-direction: column; }
        .r-name { font-size: 0.9rem; font-weight: 700; color: #1e293b; }
        .r-time { font-size: 0.75rem; color: #64748b; font-weight: 600; }
        .r-chevron { color: #cbd5e1; }
        .r-check { color: #10b981; }
        .is-taken { opacity: 0.6; background: #f1f5f9; }
        .is-taken .r-name { text-decoration: line-through; color: #94a3b8; }
        
        .cal-empty-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 3rem 1rem; text-align: center; color: #94a3b8; gap: 1rem;
        }
        .empty-ico { opacity: 0.2; }
        .cal-empty-state p { font-size: 0.9rem; font-weight: 600; line-height: 1.5; max-width: 200px; }
      `}</style>
    </div>
  );
};

export default CaregiverCalendar;
