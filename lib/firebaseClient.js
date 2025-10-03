// /lib/firebaseClient.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// (Opcional) Realtime DB
// import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

console.log("[Firebase projectId]", getApp().options.projectId);
console.log("[Firebase authDomain]", getApp().options.authDomain);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const rtdb = getDatabase(app); // si usás RTDB