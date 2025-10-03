import React, { useEffect, useState, useMemo } from "react";
import FirebaseContext from "./context";
import { auth } from "../lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { registrar, iniciarSesion, cerrarSesion } from "../services/auth";

export default function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setReady(true);
    });
    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({ user, ready, registrar, iniciarSesion, cerrarSesion }),
    [user, ready]
  );

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}