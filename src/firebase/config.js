import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these with your Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app, auth, db, isPreviewMode = false;

if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined") {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn("Firebase API key is missing. Authentication and database features will be disabled.");
  isPreviewMode = true;
  // Mock objects to prevent crashes in components
  auth = { 
    onAuthStateChanged: (callback) => {
      callback(null); // Call immediately to stop loading state
      return () => {}; 
    } 
  };
  db = {};
}

export { auth, db, isPreviewMode };
