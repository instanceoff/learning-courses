import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA00thNVMbg0ybrKyhquxWVVZFha3Zh3S0',
  authDomain: 'diplom-48598.firebaseapp.com',
  projectId: 'diplom-48598',
  storageBucket: 'diplom-48598.appspot.com',
  messagingSenderId: '116041238934',
  appId: '1:116041238934:web:e036a4b6db5d5946a975b7',
  measurementId: 'G-VFFFTGHJRV',
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
