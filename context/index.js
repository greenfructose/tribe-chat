import {
  useState,
  useEffect,
  createContext
} from 'react';
import * as EmailValidator from 'email-validator';
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
  query,
  collection,
  where,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  doc,
  getFirestore,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { arraysAreEqual } from '../utils/arrayUtils';

export const Context = createContext();

export const ContextProvider = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [chatsSnapshot, setChatsSnapshot] = useState(null);

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
  const user = auth.currentUser

  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    async function getChatsSnapshot() {
      if (user){
        const q = query(collection(db, 'chats'), where('users', 'array-contains', user.email))
        const chatsSnapshot = await getDocs(q);
        setChatsSnapshot(chatsSnapshot);
      }
    }
    getChatsSnapshot();
  }, [])
  console.log(chatsSnapshot)

  const createChat = async (db, user, userList) => {

    if (!userList) return null;

    const emailArray = userList.split(' ');
    let validatedEmailArray = [];

    for (let i = 0; i < emailArray.length; i++) {
      if (EmailValidator.validate(emailArray[i])
        && emailArray[i] !== user.email) {
        if (!validatedEmailArray.includes(emailArray[i])) {
          console.log(`${emailArray[i]} not in validated array, pushing now`)
          validatedEmailArray.push(emailArray[i])
        }
      }
    }
    console.log(`Getting chats`)
    validatedEmailArray.push(user.email)
    chatAlreadyExists(validatedEmailArray, chatsSnapshot).then((chatExists) => {
      if (!chatExists) {
        addDoc(collection(db, 'chats'), {
          creator: user.uid,
          users: validatedEmailArray
        });
      }
    });
    setChatsSnapshot();
  };


  const chatAlreadyExists = async (chatUsers, chatsSnapshot) => {
    let result = false;
    chatsSnapshot.forEach((doc) => {
      if (arraysAreEqual(doc.data().users, chatUsers)) {
        result = true;
      }
    })
    return result;
  };




  const value = {
    username,
    setUsername,
    password,
    setPassword,
    auth,
    db,
    user,
    signInWithPopup,
    googleProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    createChat,
    chatsSnapshot,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

