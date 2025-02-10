import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from "@/../firebase.config";

type AuthState = {
  user: User | null;
  role: string;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: 'user',
    loading: true
  });
  
  useEffect(() => {    
    const unsubscribe = onAuthStateChanged(auth, 
      async (currentUser: User | null) => {  
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();

          setAuthState({
            user: currentUser,
            role: userData?.role || 'user',
            loading: false
          });
        } else {
          setAuthState({
            user: null,
            role: 'user',
            loading: false
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return { 
    ...authState,
    isAuthorized: !!authState.user,
    login,
    logout
  };
};