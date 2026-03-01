"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set persistence so user stays logged in
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.error("Persistence error:", err);
    });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
      },
      (err) => {
        const msg = err?.message || "";
        if (msg.includes("api-key-not-valid") || msg.includes("invalid-api-key")) {
          setError(
            "Firebase is not configured. Add your Firebase web app config to frontend/.env.local (see frontend/FIREBASE_SETUP.md). Restart the dev server after changing .env.local."
          );
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      const msg = err?.message || "";
      if (msg.includes("api-key-not-valid") || msg.includes("invalid-api-key")) {
        setError(
          "Firebase is not configured. Add your Firebase web app config to frontend/.env.local (see frontend/FIREBASE_SETUP.md). Restart the dev server after changing .env.local."
        );
      } else {
        setError(err.message);
      }
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
