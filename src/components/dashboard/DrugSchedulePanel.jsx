import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isPreviewMode } from '../../firebase/config';
import { getRxCUI } from '../../services/rxnav';
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
} from 'lucide-react';

const LS_SCHEDULE = 'preview_drug_schedule';

const loadLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_SCHEDULE) || '{"schedule":[],"adherence":[]}');
  } catch {
    return { schedule: [], adherence: [] };
  }
};

const saveLocal = (data) => {
  localStorage.setItem(LS_SCHEDULE, JSON.stringify(data));
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

function computeNextDose(schedule) {
  const dateStr = todayStr();
  const now = Date.now();
  let best = null;
  for (const e of schedule) {
    for (const t of e.times || []) {
      const dt = combineDateTime(dateStr, t).getTime();
      if (dt > now && (!best || dt < best.at)) {
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
  for (let d = 0; d < days; d++) {
    const day = new Date(today);
    day.setDate(day.getDate() - d);
    const ds = day.toISOString().slice(0, 10);
    for (const e of schedule) {
      for (const tm of e.times || []) {
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
      new Notification('Aoun — medication time', {
        body: `Time for ${next.name} (${next.time}).`,
        icon: '/logo.png',
      });
    } catch {
      /* ignore */
    }
  }
};

const DrugSchedulePanel = ({ currentUser, t }) => {
  const [schedule, setSchedule] = useState([]);
  const [adherence, setAdherence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('09:00');
  const [notifyOn, setNotifyOn] = useState(false);
  const [tick, setTick] = useState(0);
  const notifiedRef = React.useRef(null);

  const persist = useCallback(
    async (nextSchedule, nextAdherence) => {
      const payload = { schedule: nextSchedule, adherence: nextAdherence.slice(-500) };
      setSaving(true);
      try {
        if (isPreviewMode || !db || !currentUser) {
          saveLocal(payload);
        } else {
          await setDoc(doc(db, 'user_drug_schedule', currentUser.uid), payload, { merge: true });
        }
      } finally {
        setSaving(false);
      }
    },
    [currentUser]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (isPreviewMode || !db || !currentUser) {
        const d = loadLocal();
        setSchedule(d.schedule || []);
        setAdherence(d.adherence || []);
      } else {
        const snap = await getDoc(doc(db, 'user_drug_schedule', currentUser.uid));
        if (snap.exists()) {
          const d = snap.data();
          setSchedule(d.schedule || []);
          setAdherence(d.adherence || []);
        } else {
          setSchedule([]);
          setAdherence([]);
        }
      }
    } catch (e) {
      console.error(e);
      setSchedule([]);
      setAdherence([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    refresh();
  }, [refresh, currentUser?.uid]);

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const next = useMemo(() => computeNextDose(schedule), [schedule]);

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
    if (!name.trim()) return;
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `e-${Date.now()}`;
    const entry = { id, name: name.trim(), times: [time] };
    const next = [...schedule, entry];
    setSchedule(next);
    setName('');
    await persist(next, adherence);
    if (!isPreviewMode && currentUser) {
      await getRxCUI(name.trim());
    }
  };

  const addTimeTo = async (entryId, newTime) => {
    const next = schedule.map((row) =>
      row.id === entryId ? { ...row, times: [...new Set([...(row.times || []), newTime])].sort() } : row
    );
    setSchedule(next);
    await persist(next, adherence);
  };

  const removeTime = async (entryId, tm) => {
    const next = schedule
      .map((row) =>
        row.id === entryId
          ? { ...row, times: (row.times || []).filter((x) => x !== tm) }
          : row
      )
      .filter((row) => (row.times || []).length > 0);
    setSchedule(next);
    await persist(next, adherence);
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

  if (loading) {
    return (
      <div className="dsp-wrap glass-card">
        <Loader2 className="spin" size={28} />
        <style>{`
          .dsp-wrap { padding: 2rem; display: flex; justify-content: center; align-items: center; min-height: 120px; }
          .spin { animation: spin 0.9s linear infinite; color: var(--primary); }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <section className="dsp-wrap glass-card" dir="inherit">
      <header className="dsp-head">
        <div className="dsp-title">
          <CalendarClock size={22} className="dsp-ico" />
          <div>
            <h3>{t('schedule.title')}</h3>
            <p className="dsp-sub">{t('schedule.subtitle')}</p>
          </div>
        </div>
        <div className="dsp-actions">
          {notifyOn ? (
            <button type="button" className="dsp-chip on" onClick={() => setNotifyOn(false)}>
              <Bell size={16} /> {t('schedule.notifyOn')}
            </button>
          ) : (
            <button type="button" className="dsp-chip" onClick={requestNotify}>
              <BellOff size={16} /> {t('schedule.notifyEnable')}
            </button>
          )}
          {saving && <span className="dsp-saving">{t('schedule.saving')}</span>}
        </div>
      </header>

      {schedule.length > 0 && next && (
        <div className="dsp-next">
          <div className="dsp-next-inner">
            <span className="dsp-label">{t('schedule.nextDose')}</span>
            <strong className="dsp-drug">{next.name}</strong>
            <div className="dsp-row">
              <Clock size={18} />
              <span>{next.time}</span>
              <span className="dsp-count">{formatCountdown(next.at - Date.now())}</span>
            </div>
            <button type="button" className="dsp-taken" onClick={markTaken}>
              <Check size={18} /> {t('schedule.markTaken')}
            </button>
          </div>
        </div>
      )}

      {stats.pct !== null && (
        <div className="dsp-stats">
          <TrendingUp size={18} />
          <span>{t('schedule.adherenceWeek', { pct: stats.pct, taken: stats.taken, expected: stats.expected })}</span>
        </div>
      )}

      <form className="dsp-form" onSubmit={addEntry}>
        <Pill size={18} className="dsp-muted" />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('schedule.drugPlaceholder')}
          className="dsp-input"
        />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="dsp-time" />
        <button type="submit" className="dsp-add" disabled={!name.trim()}>
          <Plus size={18} />
        </button>
      </form>

      <ul className="dsp-list">
        {schedule.length === 0 && <li className="dsp-empty">{t('schedule.empty')}</li>}
        {schedule.map((row) => (
          <li key={row.id} className="dsp-item">
            <div className="dsp-item-head">
              <strong>{row.name}</strong>
              <button type="button" className="dsp-del" onClick={() => removeEntry(row.id)} aria-label="remove">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="dsp-times">
              {(row.times || []).map((tm) => (
                <span key={tm} className="dsp-tag">
                  {tm}
                  <button type="button" onClick={() => removeTime(row.id, tm)}>×</button>
                </span>
              ))}
              <span className="dsp-mini">
                <input type="time" id={`extra-time-${row.id}`} aria-label={t('schedule.addAnotherTime')} />
                <button
                  type="button"
                  className="dsp-mini-btn"
                  onClick={() => {
                    const el = document.getElementById(`extra-time-${row.id}`);
                    if (el?.value) addTimeTo(row.id, el.value);
                  }}
                >
                  <Plus size={14} /> {t('schedule.addTime')}
                </button>
              </span>
            </div>
          </li>
        ))}
      </ul>

      <style>{`
        .dsp-wrap { padding: 1.25rem 1.25rem 1.5rem; border-radius: 20px; margin-bottom: 1.5rem; }
        .dsp-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; }
        .dsp-title { display: flex; gap: 0.75rem; align-items: flex-start; }
        .dsp-title h3 { margin: 0; font-size: 1.15rem; font-weight: 800; }
        .dsp-sub { margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--text-muted); max-width: 42ch; }
        .dsp-ico { color: var(--primary); flex-shrink: 0; margin-top: 2px; }
        .dsp-actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .dsp-chip {
          display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 999px;
          border: 1px solid var(--border); background: white; font-size: 0.8rem; font-weight: 700; cursor: pointer; color: var(--text-main);
        }
        .dsp-chip.on { border-color: rgba(126,34,206,0.35); background: rgba(126,34,206,0.08); color: var(--primary); }
        .dsp-saving { font-size: 0.75rem; color: var(--text-muted); }
        .dsp-next { background: linear-gradient(135deg, rgba(126,34,206,0.12), rgba(59,130,246,0.08)); border-radius: 16px; padding: 1rem 1.25rem; margin-bottom: 1rem; border: 1px solid rgba(126,34,206,0.15); }
        .dsp-next-inner { display: flex; flex-direction: column; gap: 0.35rem; align-items: flex-start; }
        .dsp-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 800; color: var(--primary); }
        .dsp-drug { font-size: 1.2rem; }
        .dsp-row { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: var(--text-secondary); }
        .dsp-count { font-variant-numeric: tabular-nums; font-weight: 800; color: var(--text-main); margin-inline-start: 0.5rem; }
        .dsp-taken {
          margin-top: 0.5rem; display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 12px;
          border: none; background: var(--primary); color: white; font-weight: 800; cursor: pointer; font-size: 0.9rem;
        }
        .dsp-taken:hover { filter: brightness(1.05); }
        .dsp-stats { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem; }
        .dsp-form { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 1rem; }
        .dsp-input { flex: 1 1 140px; min-height: 44px; border-radius: 12px; border: 1.5px solid var(--border); padding: 0 12px; font-weight: 600; }
        .dsp-time { min-height: 44px; border-radius: 12px; border: 1.5px solid var(--border); padding: 0 8px; }
        .dsp-add { width: 44px; height: 44px; border-radius: 12px; border: none; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .dsp-muted { color: var(--text-muted); }
        .dsp-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .dsp-empty { padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; border: 1px dashed var(--border); border-radius: 12px; }
        .dsp-item { border: 1px solid var(--border); border-radius: 14px; padding: 12px 14px; background: rgba(255,255,255,0.65); }
        .dsp-item-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .dsp-del { border: none; background: none; color: var(--text-muted); cursor: pointer; padding: 4px; }
        .dsp-del:hover { color: #ef4444; }
        .dsp-times { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
        .dsp-tag { display: inline-flex; align-items: center; gap: 6px; background: #f1f5f9; padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; }
        .dsp-tag button { border: none; background: none; cursor: pointer; color: var(--text-muted); font-size: 1rem; line-height: 1; padding: 0 2px; }
        .dsp-mini { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 4px 8px; border: 1px dashed var(--border); border-radius: 8px; font-size: 0.75rem; color: var(--text-muted); }
        .dsp-mini input { border: 1px solid var(--border); border-radius: 8px; padding: 4px 6px; width: auto; font: inherit; }
        .dsp-mini-btn { display: inline-flex; align-items: center; gap: 4px; border: none; background: rgba(126,34,206,0.1); color: var(--primary); font-weight: 700; border-radius: 8px; padding: 6px 10px; cursor: pointer; font-size: 0.75rem; }
        @media (max-width: 520px) {
          .dsp-form { flex-direction: column; align-items: stretch; }
          .dsp-add { width: 100%; height: 48px; }
        }
      `}</style>
    </section>
  );
};

export default DrugSchedulePanel;
