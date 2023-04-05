// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfjEFmX_VwSZgnhTjaWHbKweNfUrS79ck",
  authDomain: "expense-tracker-870a5.firebaseapp.com",
  projectId: "expense-tracker-870a5",
  storageBucket: "expense-tracker-870a5.appspot.com",
  messagingSenderId: "61731726393",
  appId: "1:61731726393:web:ed42ed2d087fd2aff019e8",
  measurementId: "G-4K937HGRJ1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth();
// storage is specific to user generated data, such as images, videos and files ...
export const storage = getStorage();
export const db = getFirestore();