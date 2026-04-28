import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, isPreviewMode } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, displayName, patientName, adStage, emergencyContact) => {
    if (isPreviewMode) {
      // Use local storage to simulate a database for preview mode
      const dbUsers = JSON.parse(localStorage.getItem('aoun_preview_users') || '[]');
      if (dbUsers.some(u => u.email === email)) {
        throw new Error('Firebase: Error (auth/email-already-in-use).');
      }

      const mockUser = { email, password, displayName, patientName, adStage, emergencyContact, uid: 'preview-id-' + Date.now() };
      dbUsers.push(mockUser);
      localStorage.setItem('aoun_preview_users', JSON.stringify(dbUsers));
      
      const sessionUser = { ...mockUser };
      delete sessionUser.password;
      setCurrentUser(sessionUser);
      
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            type: 'signup',
            data: { displayName, patientName }
          })
        });
      } catch (err) {
        console.error('Failed to send signup email', err);
      }

      return { user: sessionUser };
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    // Store user data in firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      displayName,
      patientName,
      adStage,
      emergencyContact,
      createdAt: new Date().toISOString()
    });

    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    setCurrentUser({ ...userCredential.user, ...userDoc.data() });

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          type: 'signup',
          data: { displayName, patientName }
        })
      });
    } catch (err) {
      console.error('Failed to send signup email', err);
    }

    return userCredential;
  };

  const login = async (email, password) => {
    if (isPreviewMode) {
      const dbUsers = JSON.parse(localStorage.getItem('aoun_preview_users') || '[]');
      const user = dbUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Firebase: Error (auth/invalid-credential).');
      }

      const sessionUser = { ...user };
      delete sessionUser.password;
      setCurrentUser(sessionUser);
      
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            type: 'login',
            data: {}
          })
        });
      } catch (err) {
        console.error('Failed to send login email', err);
      }

      return { user: sessionUser };
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (userDoc.exists()) {
      setCurrentUser({ ...userCredential.user, ...userDoc.data() });
    } else {
      setCurrentUser(userCredential.user);
    }

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          type: 'login',
          data: {}
        })
      });
    } catch (err) {
      console.error('Failed to send login email', err);
    }

    return userCredential;
  };

  const logout = () => {
    if (isPreviewMode) {
      setCurrentUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  useEffect(() => {
    if (isPreviewMode) {
      const timeoutId = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timeoutId);
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ ...user, ...userDoc.data() });
          } else {
            setCurrentUser(user);
          }
        } catch (err) {
          console.error("Error fetching user data", err);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
