import {
  useState,
  createContext
} from 'react';
import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  getDoc,
  setDoc,
  doc,
  getFirestore,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

export const Context = createContext();

export const ContextProvider = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGE_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app)

  const googleProvider = new GoogleAuthProvider();





  const value = {
    username,
    setUsername,
    password,
    setPassword,
    auth,
    signInWithPopup,
    googleProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

