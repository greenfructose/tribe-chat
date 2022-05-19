import { useEffect } from 'react';
import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import { serverTimestamp, collection, doc, getDoc, setDoc } from 'firebase/firestore';

function MyApp({ Component, pageProps }) {
  const [user, loading, error] = useAuthState(auth);
  console.log(useAuthState(auth));

  useEffect(() => {
    if (user) {
      const userRef = collection(db, 'users');
      setDoc(doc(userRef, user.uid), {
        email: user.email,
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL
      }, { merge: true });
    }
  }, [user])


  if (loading) return <Loading />

  if (!user) return <Login />

  return <Component {...pageProps} />  
}

export default MyApp
