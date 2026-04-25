import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasValidKey =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "undefined" &&
  String(firebaseConfig.apiKey).length > 10;

let app;
let auth;
let db;
let isPreviewMode = false;

if (hasValidKey) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn(
    "[Aoun] Firebase env vars missing or invalid. Running in preview mode: auth and Firestore are disabled. Copy .env.example to .env and add your Aoun Firebase project keys."
  );
  isPreviewMode = true;
  auth = {
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    },
  };
  db = {};
}

export { auth, db, isPreviewMode, app };
