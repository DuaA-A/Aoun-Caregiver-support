import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, isPreviewMode } from '../../firebase/config';
import { getRxCUI } from '../../services/rxnav';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  BellOff,
  CalendarClock,
  Check,
  Clock,
  Loader2,
  Pill,
  Plus,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';

const LS_SCHEDULE = 'preview_drug_schedule';

const loadLocal = (uid) => {
  try {
    return JSON.parse(localStorage.getItem(`${LS_SCHEDULE}_${uid}`) || '{"schedule":[],"adherence":[]}');
  } catch {
    return { schedule: [], adherence: [] };
  }
};

const saveLocal = (uid, data) => {
  localStorage.setItem(`${LS_SCHEDULE}_${uid}`, JSON.stringify(data));
};

const parseHHMM = (t) => {
  const [h, m] = t.split(':').map(Number);
  return { h: h || 0, m: m || 0 };
};

const combineDateTime = (dateStr, hhmm) => {
  const { h, m } = parseHHMM(hhmm);
  const d = new Date(`${dateStr}T00:00:00`);
  d.setHours(h, m, 0, 0);
  return d;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

const formatCountdown = (ms) => {
  if (ms <= 0) return '0:00';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
};

function computeNextDose(schedule, adherence = []) {
  const dateStr = todayStr();
  const now = Date.now();
  let best = null;
  
  for (const e of schedule) {
    for (const t of e.times || []) {
      const dt = combineDateTime(dateStr, t).getTime();
      
      // Skip if already taken today
      const isTaken = adherence.some(a => a.entryId === e.id && a.date === dateStr && a.time === t && a.status === 'taken');
      
      if (dt > now && !isTaken && (!best || dt < best.at)) {
        best = { at: dt, name: e.name, entryId: e.id, time: t };
      }
    }
  }
  
  if (best) return best;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tStr = tomorrow.toISOString().slice(0, 10);
  let first = null;
  for (const e of schedule) {
    for (const t of e.times || []) {
      const dt = combineDateTime(tStr, t).getTime();
      if (!first || dt < first.at) first = { at: dt, name: e.name, entryId: e.id, time: t };
    }
  }
  return first;
}

function adherenceStats(schedule, adherence, days = 7) {
  if (!schedule.length) return { pct: null, taken: 0, expected: 0 };
  let expected = 0;
  let taken = 0;
  const today = new Date();
  const now = Date.now();
  
  for (let d = 0; d < days; d++) {
    const day = new Date(today);
    day.setDate(day.getDate() - d);
    const ds = day.toISOString().slice(0, 10);
    for (const e of schedule) {
      for (const tm of e.times || []) {
        const dt = combineDateTime(ds, tm).getTime();
        if (dt > now) continue;
        
        expected += 1;
        const hit = adherence.some(
          (a) =>
            a.entryId === e.id &&
            a.date === ds &&
            a.time === tm &&
            a.status === 'taken'
        );
        if (hit) taken += 1;
      }
    }
  }
  const pct = expected ? Math.round((taken / expected) * 100) : null;
  return { pct, taken, expected };
}

const notifyIfDue = (next, schedule, notifiedRef) => {
  if (!next || Notification.permission !== 'granted') return;
  const key = `${next.entryId}-${next.time}-${todayStr()}`;
  const ms = next.at - Date.now();
  if (ms > 0 && ms < 90_000 && notifiedRef.current !== key) {
    notifiedRef.current = key;
    try {
      new Notification('Aoun — Medication Time', {
        body: `Time for ${next.name} (${next.time}).`,
        icon: '/logo.png',
      });
    } catch {
      /* ignore */
    }
  }
};

const DrugSchedulePanel = ({ currentUser, t }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [schedule, setSchedule] = useState([]);
  const [adherence, setAdherence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [selectedTimes, setSelectedTimes] = useState(['09:00']);
  
  const [notifyOn, setNotifyOn] = useState(false);
  const [tick, setTick] = useState(0);
  const notifiedRef = React.useRef(null);

  const persist = useCallback(
    async (nextSchedule, nextAdherence) => {
      const payload = { schedule: nextSchedule, adherence: nextAdherence.slice(-500) };
      setSaving(true);
      try {
        if (isPreviewMode || !db || !currentUser) {
          saveLocal(currentUser?.uid, payload);
        } else {
          await setDoc(doc(db, 'user_drug_schedule', currentUser.uid), payload, { merge: true });
        }
      } finally {
        setSaving(false);
      }
    },
    [currentUser]
  );

  useEffect(() => {
    let unsub = () => {};
    const load = async () => {
      setLoading(true);
      try {
        if (isPreviewMode || !db || !currentUser) {
          const d = loadLocal(currentUser?.uid);
          setSchedule(d.schedule || []);
          setAdherence(d.adherence || []);
          setLoading(false);
        } else {
          unsub = onSnapshot(doc(db, 'user_drug_schedule', currentUser.uid), (snap) => {
            if (snap.exists()) {
              const d = snap.data();
              setSchedule(d.schedule || []);
              setAdherence(d.adherence || []);
            } else {
              setSchedule([]);
              setAdherence([]);
            }
            setLoading(false);
          });
        }
      } catch (e) {
        console.error(e);
        setSchedule([]);
        setAdherence([]);
        setLoading(false);
      }
    };
    load();

    const handleUpdate = () => load();
    window.addEventListener('dose-updated', handleUpdate);

    return () => {
      unsub();
      window.removeEventListener('dose-updated', handleUpdate);
    };
  }, [currentUser?.uid]);

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const next = useMemo(() => computeNextDose(schedule, adherence), [schedule, adherence, tick]);

  useEffect(() => {
    if (notifyOn) notifyIfDue(next, schedule, notifiedRef);
  }, [notifyOn, next, schedule, tick]);

  const stats = useMemo(() => adherenceStats(schedule, adherence, 7), [schedule, adherence]);

  const requestNotify = async () => {
    if (!('Notification' in window)) return;
    const p = await Notification.requestPermission();
    setNotifyOn(p === 'granted');
  };

  const addEntry = async (e) => {
    e.preventDefault();
    const drugName = name.trim();
    if (!drugName || selectedTimes.length === 0) return;
    
    // Check for timing conflicts
    const conflicts = schedule.filter(s => s.times.some(t => selectedTimes.includes(t)));
    const conflictNames = conflicts.map(c => c.name);
    
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `e-${Date.now()}`;
    const entry = { id, name: drugName, times: [...selectedTimes].sort(), frequency };
    const nextSchedule = [...schedule, entry];
    
    setSchedule(nextSchedule);
    setName('');
    setSelectedTimes(['09:00']);
    setFrequency('daily');
    
    await persist(nextSchedule, adherence);
    
    // Dispatch event for NotificationContext to catch and show the right alert
    window.dispatchEvent(new CustomEvent('drug-added', { 
      detail: { name: drugName, conflicts: conflictNames } 
    }));
    
    if (!isPreviewMode && currentUser) {
      await getRxCUI(drugName);
    }
  };

  const removeEntry = async (entryId) => {
    const next = schedule.filter((r) => r.id !== entryId);
    setSchedule(next);
    await persist(next, adherence);
  };

  const markTaken = async () => {
    if (!next) return;
    const row = { entryId: next.entryId, date: todayStr(), time: next.time, status: 'taken', at: new Date().toISOString() };
    const nextAd = [...adherence.filter((a) => !(a.entryId === row.entryId && a.date === row.date && a.time === row.time)), row];
    setAdherence(nextAd);
    await persist(schedule, nextAd);
  };

  const addTimeToForm = () => {
    setSelectedTimes([...selectedTimes, '12:00']);
  };

  const updateTimeInForm = (idx, val) => {
    const next = [...selectedTimes];
    next[idx] = val;
    setSelectedTimes(next);
  };

  const removeTimeFromForm = (idx) => {
    setSelectedTimes(selectedTimes.filter((_, i) => i !== idx));
  };

  if (loading) {
    return (
      <div className="dsp-loading glass-card">
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  return (
    <section className="dsp-container glass-card" dir="inherit">
      <header className="dsp-header">
        <div className="dsp-title-group">
          <div className="dsp-icon-box"><CalendarClock size={22} /></div>
          <div>
            <h3>{t('schedule.title')}</h3>
            <p className="dsp-subtitle">{t('schedule.subtitle')}</p>
          </div>
        </div>
        <div className="dsp-header-actions">
          <button type="button" className={`dsp-notify-btn ${notifyOn ? 'active' : ''}`} onClick={notifyOn ? () => setNotifyOn(false) : requestNotify}>
            {notifyOn ? <Bell size={18} /> : <BellOff size={18} />}
          </button>
          {saving && <Loader2 size={16} className="spin text-muted" />}
        </div>
      </header>

      {/* Next Dose Display */}
      {next ? (
        <div className="dsp-next-card">
          <div className="dsp-next-info">
            <span className="dsp-next-kicker">{t('schedule.nextDose')}</span>
            <h4 className="dsp-next-name">{next.name}</h4>
            <div className="dsp-next-time">
              <Clock size={16} />
              <span className="time-val">{next.time}</span>
              <span className="countdown">({formatCountdown(next.at - Date.now())})</span>
            </div>
          </div>
          <button type="button" className="dsp-mark-taken-btn" onClick={markTaken}>
            <Check size={20} /> {t('schedule.markTaken')}
          </button>
        </div>
      ) : (
        <div className="dsp-no-dose">
          <Pill size={40} className="empty-ico" />
          <p>{isRTL ? 'لا توجد أدوية مجدولة. يرجى إضافة أدوية لتحديث الجرعات والمواعيد.' : 'No medications scheduled. Please add drugs to update the doses and schedule.'}</p>
        </div>
      )}

      {/* Stats */}
      {stats.pct !== null && (
        <div className="dsp-stats-bar">
          <div className="stat-pill">
            <TrendingUp size={14} />
            <span>{stats.pct}% {t('schedule.adherence', 'Adherence')}</span>
          </div>
          <span className="stat-detail">{stats.taken}/{stats.expected} {t('schedule.doses', 'doses')}</span>
        </div>
      )}

      {/* Add Form */}
      <div className="dsp-add-section">
        <div className="section-divider"><span>{t('schedule.addDrug', 'Add New Medication')}</span></div>
        <form onSubmit={addEntry} className="dsp-premium-form">
          <div className="form-row-main">
            <div className="input-group">
              <Pill size={18} className="input-ico" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('schedule.drugPlaceholder')}
                className="dsp-main-input"
              />
            </div>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="dsp-freq-select">
              <option value="daily">{t('schedule.daily', 'Daily')}</option>
              <option value="weekly">{t('schedule.weekly', 'Weekly')}</option>
              <option value="custom">{t('schedule.custom', 'Custom')}</option>
            </select>
          </div>

          <div className="form-times-row">
            <label>{t('schedule.times', 'Select Times')}:</label>
            <div className="times-flex">
              {selectedTimes.map((tm, i) => (
                <div key={i} className="time-pill-input">
                  <input type="time" value={tm} onChange={(e) => updateTimeInForm(i, e.target.value)} />
                  {selectedTimes.length > 1 && (
                    <button type="button" onClick={() => removeTimeFromForm(i)} className="time-del"><X size={12} /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addTimeToForm} className="add-time-btn">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button type="submit" className="dsp-submit-btn" disabled={!name.trim()}>
            <Plus size={18} /> {t('schedule.addBtn', 'Add to Schedule')}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="dsp-list-section">
        <div className="section-divider"><span>{t('schedule.current', 'Active Schedule')}</span></div>
        <div className="dsp-items-grid">
          {schedule.map((row) => (
            <div key={row.id} className="dsp-schedule-item">
              <div className="item-top">
                <div className="item-name-group">
                  <span className="item-name">{row.name}</span>
                  <span className="item-freq">{row.frequency}</span>
                </div>
                <button onClick={() => removeEntry(row.id)} className="item-del-btn"><Trash2 size={16} /></button>
              </div>
              <div className="item-times-list">
                {row.times?.map(t => (
                  <span key={t} className="time-tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .dsp-container { padding: 2rem; border-radius: 24px; background: white; }
        .dsp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
        .dsp-title-group { display: flex; gap: 1rem; }
        .dsp-icon-box {
          width: 48px; height: 48px; border-radius: 14px; background: #f0f7ff;
          color: #3b82f6; display: flex; align-items: center; justify-content: center;
        }
        .dsp-header h3 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #1e293b; }
        .dsp-subtitle { margin: 4px 0 0; font-size: 0.85rem; color: #64748b; }
        
        .dsp-notify-btn {
          width: 40px; height: 40px; border-radius: 12px; border: 1px solid #e2e8f0;
          background: white; color: #64748b; cursor: pointer; transition: all 0.2s;
        }
        .dsp-notify-btn.active { background: #eff6ff; border-color: #bfdbfe; color: #3b82f6; }
        
        .dsp-next-card {
          background: linear-gradient(135deg, #1e3a5f, #2d5a8e); color: white;
          padding: 1.75rem; border-radius: 20px; display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 1.5rem; box-shadow: 0 12px 24px rgba(30, 58, 95, 0.15);
        }
        .dsp-next-kicker { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8; font-weight: 800; }
        .dsp-next-name { font-size: 1.5rem; font-weight: 900; margin: 6px 0; }
        .dsp-next-time { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 1.1rem; }
        .countdown { opacity: 0.7; font-size: 0.9rem; font-weight: 500; }
        
        .dsp-mark-taken-btn {
          background: white; color: #1e3a5f; border: none; padding: 12px 20px;
          border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px;
          transition: all 0.2s;
        }
        .dsp-mark-taken-btn:hover { transform: scale(1.05); background: #f8fafc; }

        .dsp-stats-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 2rem; }
        .stat-pill {
          display: flex; align-items: center; gap: 6px; background: #f0fdf4;
          color: #16a34a; padding: 6px 12px; border-radius: 999px; font-size: 0.8rem; font-weight: 800;
        }
        .stat-detail { font-size: 0.8rem; color: #64748b; font-weight: 600; }

        .section-divider {
          display: flex; align-items: center; margin: 2rem 0 1.5rem;
        }
        .section-divider::after, .section-divider::before { content: ""; flex: 1; height: 1px; background: #f1f5f9; }
        .section-divider span { padding: 0 15px; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }

        .dsp-premium-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-row-main { display: flex; gap: 12px; }
        .input-group { flex: 1; position: relative; }
        .input-ico { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        [dir="rtl"] .input-ico { left: auto; right: 14px; }
        .dsp-main-input {
          width: 100%; height: 50px; border-radius: 14px; border: 2px solid #f1f5f9;
          padding: 0 12px 0 42px; font-weight: 600;
        }
        [dir="rtl"] .dsp-main-input { padding: 0 42px 0 12px; }
        .dsp-freq-select { height: 50px; border-radius: 14px; border: 2px solid #f1f5f9; padding: 0 12px; background: white; font-weight: 600; }
        
        .form-times-row { display: flex; flex-direction: column; gap: 8px; }
        .form-times-row label { font-size: 0.85rem; font-weight: 700; color: #475569; }
        .times-flex { display: flex; flex-wrap: wrap; gap: 8px; }
        .time-pill-input {
          display: flex; align-items: center; gap: 6px; background: #f8fafc;
          padding: 4px 10px; border-radius: 10px; border: 1px solid #e2e8f0;
        }
        .time-pill-input input { border: none; background: none; font-weight: 700; color: #1e293b; font-family: inherit; font-size: 0.85rem; }
        .time-del { border: none; background: none; color: #94a3b8; cursor: pointer; display: flex; }
        .add-time-btn {
          width: 34px; height: 34px; border-radius: 10px; border: 1px dashed #cbd5e1;
          background: white; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }

        .dsp-submit-btn {
          height: 50px; border-radius: 14px; background: #3b82f6; color: white; border: none;
          font-weight: 800; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .dsp-submit-btn:hover { background: #2563eb; transform: translateY(-2px); }

        .dsp-items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
        .dsp-schedule-item { padding: 1.25rem; border-radius: 18px; border: 1px solid #f1f5f9; background: #fcfdfe; }
        .item-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
        .item-name-group { display: flex; flex-direction: column; }
        .item-name { font-weight: 800; color: #1e293b; }
        .item-freq { font-size: 0.65rem; text-transform: uppercase; color: #3b82f6; font-weight: 800; }
        .item-del-btn { background: none; border: none; color: #cbd5e1; cursor: pointer; transition: color 0.2s; }
        .item-del-btn:hover { color: #ef4444; }
        .item-times-list { display: flex; flex-wrap: wrap; gap: 6px; }
        .time-tag { background: white; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; color: #475569; }

        .dsp-loading { padding: 4rem; display: flex; justify-content: center; align-items: center; }
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .dsp-next-card { flex-direction: column; gap: 1.5rem; text-align: center; }
          .dsp-next-time { justify-content: center; }
          .dsp-mark-taken-btn { width: 100%; justify-content: center; }
          .form-row-main { flex-direction: column; }
        }
      `}</style>
    </section>
  );
};

export default DrugSchedulePanel;
