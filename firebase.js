import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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


const signInWithGoogle = () => {
  try {
    signInWithPopup(auth, googleProvider).then(result => {
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef).then(doc => {
        if (!doc.data().authProvider) {
          setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            authProvider: 'google',
            photoURL: user.photoURL,
            loggedIn: true,
            lastSeen: serverTimestamp()
          });
        } else {
          updateDoc(userRef, {
            loggedIn: true,
            lastSeen: serverTimestamp()
          })
        }
      });
      
      
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const logInWithEmailAndPassword = (email, password) => {
  try {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        const userRef = doc(db, 'users', user.uid);
        // const userSnap = await getDoc(userRef)
        updateDoc(userRef, {
          loggedIn: true,
          lastSeen: serverTimestamp()
        });
      });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    createUserWithEmailAndPassword(auth, email, password).then(result => {
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, {
        displayName: name,
        authProvider: 'local',
        photoURL: '',
        loggedIn: true,
        lastSeen: serverTimestamp()
      }).then();
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset link sent!');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = async () => {
  try {
    const user = auth.currentUser;
    const userRef = doc(db, 'users', user.uid);
    signOut(auth);
    await updateDoc(userRef, {
      loggedIn: false,
      lastSeen: serverTimestamp()
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};




export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};