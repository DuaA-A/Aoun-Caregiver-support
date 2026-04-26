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
      // Mock signup for preview purposes
      const mockUser = { email, displayName, patientName, adStage, emergencyContact, uid: 'preview-id-' + Date.now() };
      setCurrentUser(mockUser);
      return { user: mockUser };
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

    return userCredential;
  };

  const login = async (email, password) => {
    if (isPreviewMode) {
      // Mock login for preview
      const mockUser = { email, displayName: email.split('@')[0], patientName: 'John Doe', adStage: 'mild', uid: 'preview-id' };
      setCurrentUser(mockUser);
      return { user: mockUser };
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (userDoc.exists()) {
      setCurrentUser({ ...userCredential.user, ...userDoc.data() });
    } else {
      setCurrentUser(userCredential.user);
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
