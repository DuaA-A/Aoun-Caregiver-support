import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isPreviewMode } from '../firebase/config';

const LS = 'preview_drug_schedule';

const todayStr = () => new Date().toISOString().slice(0, 10);

/**
 * Log a single dose as taken (used from dashboard and notification center).
 */
export async function logDoseTaken(userId, entryId, time, dateStr) {
  const date = dateStr || todayStr();
  const row = {
    entryId,
    date,
    time,
    status: 'taken',
    at: new Date().toISOString(),
  };

  if (isPreviewMode) {
    try {
      const d = JSON.parse(localStorage.getItem(LS) || '{"schedule":[],"adherence":[]}');
      const ad = d.adherence || [];
      const next = [...ad.filter((a) => !(a.entryId === entryId && a.date === date && a.time === time)), row];
      d.adherence = next.slice(-500);
      localStorage.setItem(LS, JSON.stringify(d));
    } catch (e) {
      console.error(e);
    }
    return;
  }

  if (!userId || !db) return;
  const ref = doc(db, 'user_drug_schedule', userId);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : { schedule: [], adherence: [] };
  const ad = data.adherence || [];
  const next = [...ad.filter((a) => !(a.entryId === entryId && a.date === date && a.time === time)), row];
  await setDoc(ref, { ...data, adherence: next.slice(-500) }, { merge: true });
}

/**
 * Read schedule + adherence for a user (single source of truth for reminder logic).
 */
export async function loadScheduleBundle(userId) {
  if (isPreviewMode) {
    try {
      return JSON.parse(localStorage.getItem(LS) || '{"schedule":[],"adherence":[]}');
    } catch {
      return { schedule: [], adherence: [] };
    }
  }
  if (!userId || !db) return { schedule: [], adherence: [] };
  const snap = await getDoc(doc(db, 'user_drug_schedule', userId));
  if (!snap.exists()) return { schedule: [], adherence: [] };
  const d = snap.data();
  return { schedule: d.schedule || [], adherence: d.adherence || [] };
}
