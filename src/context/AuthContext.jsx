import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, isPreviewMode } from '../firebase/config';
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

  const signup = async (email, password, displayName) => {
    if (isPreviewMode) {
      // Mock signup for preview purposes
      const mockUser = { email, displayName, uid: 'preview-id-' + Date.now() };
      setCurrentUser(mockUser);
      return { user: mockUser };
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential;
  };

  const login = async (email, password) => {
    if (isPreviewMode) {
      // Mock login for preview
      const mockUser = { email, displayName: email.split('@')[0], uid: 'preview-id' };
      setCurrentUser(mockUser);
      return { user: mockUser };
    }
    return signInWithEmailAndPassword(auth, email, password);
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
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
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
