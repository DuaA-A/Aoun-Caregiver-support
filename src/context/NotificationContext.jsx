import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db, isPreviewMode } from '../firebase/config';
import { loadScheduleBundle, logDoseTaken } from '../utils/scheduleAdherence';

const CTX = createContext(null);

const INBOX_KEY = 'preview_user_inbox';
const INBOX_COL = 'user_inbox';

const combineDateTime = (dateStr, hhmm) => {
  const [h, m] = (hhmm || '0:0').split(':').map(Number);
  const d = new Date(`${dateStr}T00:00:00`);
  d.setHours(h || 0, m || 0, 0, 0);
  return d.getTime();
};

const todayStr = () => new Date().toISOString().slice(0, 10);

function buildDueDoseKeys(schedule, adherence, now = Date.now()) {
  const dateKey = todayStr();
  const due = [];
  for (const e of schedule || []) {
    for (const tm of e.times || []) {
      const at = combineDateTime(dateKey, tm);
      const isPast = at <= now;
      const isRecent = now - at < 3 * 60 * 60 * 1000; // 3h window
      const hasTaken = (adherence || []).some(
        (a) => a.entryId === e.id && a.date === dateKey && a.time === tm && a.status === 'taken'
      );
      if (isPast && isRecent && !hasTaken) {
        due.push({
          id: `dose-${e.id}-${dateKey}-${tm}`,
          type: 'dose_due',
          entryId: e.id,
          drugName: e.name,
          time: tm,
          dateKey,
        });
      }
    }
  }
  return due;
}

async function loadInboxItems(uid) {
  if (isPreviewMode) {
    try {
      const j = JSON.parse(localStorage.getItem(`${INBOX_KEY}_${uid}`) || '{"items":[]}');
      return j.items || [];
    } catch {
      return [];
    }
  }
  if (!db || !uid) return [];
  const snap = await getDoc(doc(db, INBOX_COL, uid));
  if (!snap.exists()) return [];
  return snap.data().items || [];
}

async function saveInboxItems(uid, items) {
  const trimmed = (items || []).slice(-200);
  if (isPreviewMode) {
    localStorage.setItem(`${INBOX_KEY}_${uid}`, JSON.stringify({ items: trimmed }));
    return;
  }
  if (!db || !uid) return;
  await setDoc(doc(db, INBOX_COL, uid), { items: trimmed, updatedAt: new Date().toISOString() }, { merge: true });
}

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const sync = useCallback(async () => {
    if (!currentUser?.uid) {
      setItems([]);
      return;
    }
    const { schedule, adherence } = await loadScheduleBundle(currentUser.uid);
    const auto = buildDueDoseKeys(schedule, adherence);
    const existing = await loadInboxItems(currentUser.uid);
    const byId = new Map();
    for (const x of existing) {
      byId.set(x.id, x);
    }
    for (const d of auto) {
      if (!byId.has(d.id)) {
        byId.set(d.id, {
          ...d,
          read: false,
          taken: false,
          createdAt: new Date().toISOString(),
        });
      }
    }
    const ad = adherence || [];
    const merged = [...byId.values()].map((it) => {
      if (it.type !== 'dose_due' || it.taken) return it;
      const has =
        it.entryId &&
        it.dateKey &&
        it.time &&
        ad.some(
          (a) =>
            a.entryId === it.entryId &&
            a.date === it.dateKey &&
            a.time === it.time &&
            a.status === 'taken'
        );
      if (has) return { ...it, taken: true, read: true };
      return it;
    });

    // Browser Notification Logic
    if (Notification.permission === 'granted') {
      const newDues = merged.filter(it => it.type === 'dose_due' && !it.read && !it.taken && !byId.has(it.id));
      for (const d of newDues) {
        try {
          const n = new Notification('Aoun Medication Reminder', {
            body: `It's time for your drug: ${d.drugName}. Click to mark as taken.`,
            icon: '/logo.png',
            tag: d.id,
          });
          n.onclick = () => {
            window.focus();
            window.location.hash = '#/profile';
          };
        } catch (e) { console.error(e); }
      }
    }

    const sorted = merged.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    setItems(sorted);
    await saveInboxItems(currentUser.uid, sorted);
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!currentUser) {
      setItems([]);
      return;
    }
    void sync();
    const id = setInterval(() => {
      void sync();
    }, 30_000);
    return () => clearInterval(id);
  }, [currentUser, sync]);

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items]);

  const markRead = useCallback(
    async (id) => {
      if (!currentUser?.uid) return;
      setItems((prev) => {
        const next = prev.map((i) => (i.id === id ? { ...i, read: true } : i));
        void saveInboxItems(currentUser.uid, next);
        return next;
      });
    },
    [currentUser?.uid]
  );

  const markAllRead = useCallback(async () => {
    if (!currentUser?.uid) return;
    setItems((prev) => {
      const next = prev.map((i) => ({ ...i, read: true }));
      void saveInboxItems(currentUser.uid, next);
      return next;
    });
  }, [currentUser?.uid]);

  const markTaken = useCallback(
    async (n) => {
      if (!currentUser?.uid) return;
      try {
        await logDoseTaken(currentUser.uid, n.entryId, n.time, n.dateKey);
        setItems((prev) => {
          const next = prev.map((i) =>
            i.id === n.id ? { ...i, read: true, taken: true, takenAt: new Date().toISOString() } : i
          );
          void saveInboxItems(currentUser.uid, next);
          return next;
        });
        void sync();
      } catch (e) {
        console.error(e);
      }
    },
    [currentUser?.uid, sync]
  );

  const value = useMemo(
    () => ({
      items,
      unreadCount,
      open,
      setOpen,
      markRead,
      markAllRead,
      markTaken,
      refresh: sync,
    }),
    [items, unreadCount, open, markRead, markAllRead, markTaken, sync]
  );

  return <CTX.Provider value={value}>{children}</CTX.Provider>;
};

const noop = () => {};
const defaultNotify = {
  items: [],
  unreadCount: 0,
  open: false,
  setOpen: noop,
  markRead: noop,
  markAllRead: noop,
  markTaken: noop,
  refresh: noop,
};

export const useNotifications = () => {
  const v = useContext(CTX);
  return v ?? defaultNotify;
};
