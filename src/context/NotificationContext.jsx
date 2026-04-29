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
  // Create date using local parts to match user's local schedule times
  const [y, mm, d] = dateStr.split('-').map(Number);
  const date = new Date(y, mm - 1, d, h, m, 0, 0);
  return date.getTime();
};

const todayStr = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

function buildDueDoseKeys(schedule, adherence, now = Date.now()) {
  const dateKey = todayStr();
  const due = [];
  for (const e of schedule || []) {
    for (const tm of e.times || []) {
      const at = combineDateTime(dateKey, tm);
      const isPast = at <= now;
      const isRecent = now - at < 60 * 60 * 1000; // 1 hour window instead of 24h
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
      console.log('[NotificationContext] No user, skipping sync');
      setItems([]);
      return;
    }
    console.log('[NotificationContext] Syncing for user:', currentUser.uid);
    const { schedule, adherence } = await loadScheduleBundle(currentUser.uid);
    console.log(`[NotificationContext] Schedule count: ${schedule?.length}, Adherence count: ${adherence?.length}`);
    
    const auto = buildDueDoseKeys(schedule, adherence);
    console.log(`[NotificationContext] Due doses found by auto-logic: ${auto.length}`);
    
    const existing = await loadInboxItems(currentUser.uid);
    const byId = new Map();
    for (const x of existing) {
      byId.set(x.id, x);
    }
    const newlyAddedIds = new Set();
    for (const d of auto) {
      if (!byId.has(d.id)) {
        const newItem = {
          ...d,
          read: false,
          taken: false,
          createdAt: new Date().toISOString(),
        };
        byId.set(d.id, newItem);
        newlyAddedIds.add(d.id);
        console.log('[NotificationContext] Found NEW due dose:', d.id);
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
    const newDues = merged.filter(it => it.type === 'dose_due' && !it.read && !it.taken && newlyAddedIds.has(it.id));
    console.log(`[NotificationContext] Total doses to notify: ${newDues.length}`);
    
    if (Notification.permission === 'granted') {
      for (const d of newDues) {
        try {
          console.log('[NotificationContext] Triggering browser notification for:', d.id);
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

    // Email Notification Logic
    for (const d of newDues) {
      if (currentUser?.email) {
        try {
          console.log(`[NotificationContext] Attempting to send email reminder for ${d.drugName} to ${currentUser.email}`);
          const res = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: currentUser.email,
              type: 'drug_reminder',
              data: { drugName: d.drugName, time: d.time }
            })
          });
          const resData = await res.json();
          console.log('[NotificationContext] Email API response:', resData);
        } catch (e) {
          console.error('Failed to send email reminder', e);
        }
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

    const handleStorage = (e) => {
      if (e.key?.includes(INBOX_KEY) || e.key?.includes('preview_drug_schedule')) {
        void sync();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(id);
      window.removeEventListener('storage', handleStorage);
    };
  }, [currentUser, sync]);

  useEffect(() => {
    const handleDrugAdded = async (e) => {
      const { name, conflicts } = e.detail;
      if (!currentUser?.uid) return;
      
      const newItems = [...items];
      const timestamp = new Date().toISOString();
      
      // Add "Drug Added" confirmation
      newItems.push({
        id: `system-add-${Date.now()}`,
        type: 'system_alert',
        drugName: name,
        title: i18n.language === 'ar' ? `تم إضافة ${name} إلى الجدول` : `${name} added to schedule`,
        read: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateKey: todayStr()
      });

      // Add Conflict warning if any
      if (conflicts && conflicts.length > 0) {
        newItems.push({
          id: `system-conflict-${Date.now()}`,
          type: 'warning',
          title: i18n.language === 'ar' ? 'تنبيه: تعارض في المواعيد' : 'Warning: Timing Conflict',
          drugName: name,
          desc: i18n.language === 'ar' 
            ? `هذا الدواء يشترك في نفس الموعد مع: ${conflicts.join(', ')}`
            : `This drug shares the same time with: ${conflicts.join(', ')}`,
          read: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dateKey: todayStr()
        });
      }

      setItems(newItems);
      await saveInboxItems(currentUser.uid, newItems);
    };

    window.addEventListener('drug-added', handleDrugAdded);
    return () => window.removeEventListener('drug-added', handleDrugAdded);
  }, [currentUser, items, i18n.language]);

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items]);

  const markRead = useCallback(
    async (id) => {
      if (!currentUser?.uid) return;
      const next = items.map((i) => (i.id === id ? { ...i, read: true } : i));
      setItems(next);
      await saveInboxItems(currentUser.uid, next);
    },
    [currentUser?.uid, items]
  );

  const markAllRead = useCallback(async () => {
    if (!currentUser?.uid) return;
    const next = items.map((i) => ({ ...i, read: true }));
    setItems(next);
    await saveInboxItems(currentUser.uid, next);
  }, [currentUser?.uid, items]);

  const markTaken = useCallback(
    async (n) => {
      if (!currentUser?.uid) return;
      console.log(`[NotificationContext] Marking as taken: drug=${n.drugName}, time=${n.time}`);
      try {
        await logDoseTaken(currentUser.uid, n.entryId, n.time, n.dateKey);
        const next = items.map((i) =>
          i.id === n.id ? { ...i, read: true, taken: true, takenAt: new Date().toISOString() } : i
        );
        setItems(next);
        await saveInboxItems(currentUser.uid, next);
        
        // Dispatch a custom event to notify other components (like Dashboard)
        window.dispatchEvent(new Event('dose-updated'));
        
        console.log('[NotificationContext] Successfully marked taken and saved inbox');
        await sync();
      } catch (e) {
        console.error('[NotificationContext] Failed to mark as taken', e);
      }
    },
    [currentUser?.uid, items, sync]
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
