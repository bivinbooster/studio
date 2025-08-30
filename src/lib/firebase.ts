// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// This is a public configuration and is safe to expose in the browser.
// Security is handled by Firestore Security Rules.
const firebaseConfig = {
  projectId: 'fintrack-3j0mp',
  appId: '1:1051561393455:web:f882ebeb1a906e382935da',
  storageBucket: 'fintrack-3j0mp.firebasestorage.app',
  apiKey: 'AIzaSyCFLQXlTPHkXJ2bwEd_wB4M68Aankdecqw',
  authDomain: 'fintrack-3j0mp.firebaseapp.com',
  messagingSenderId: '1051561393455',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
