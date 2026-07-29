import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBPWvvf0rLccxFbD5KrMLFTCCs6rPiIvzM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nutrinest-79aef.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nutrinest-79aef",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nutrinest-79aef.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "556935224699",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:556935224699:web:1ab0d467962174d294b1de",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-LGHHNFHFTJ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
