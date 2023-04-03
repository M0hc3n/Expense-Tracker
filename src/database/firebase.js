// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);