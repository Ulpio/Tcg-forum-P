// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth }       from 'firebase/auth';
import { getFirestore }  from 'firebase/firestore';
import { getStorage }    from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyATh9GTy1mOTve7FdebQnwPgGmtZ_SKkaM",
  authDomain: "tcg-forum.firebaseapp.com",
  projectId: "tcg-forum",
  storageBucket: "tcg-forum.firebasestorage.app",
  messagingSenderId: "1029497173982",
  appId: "1:1029497173982:web:de445fb9f82a06e6530f4f",
  measurementId: "G-3BSTDSVV71"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);