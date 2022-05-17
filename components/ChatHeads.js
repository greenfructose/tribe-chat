import {
  useState,
  useEffect,
} from 'react';
import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {
  db
} from '../firebase';

function ChatHeads(emails, users) {
  const [usersSnapshot, setUsersSnapshot] = useState(null);
  const [userEmails, setUsersEmails] = useState([]);

  useEffect(() => {
    async function getUsersSnapshot() {
      const usersSnapshot = await getUsers(db, emails.emails);
      setUsersSnapshot(usersSnapshot);
    }
    getUsersSnapshot();
  }, [emails])
  useEffect(() => {
    async function getUserEmails() {
      const usersSnapshot = await getUsers(db, emails.emails);
      let userEmails = []
      usersSnapshot.forEach(user => {
        setUsersEmails(() => [...userEmails, user.data().email])
      });
    }
    getUserEmails();
  }, [emails])
  return (
    <AvatarContainer>
      {emails.emails?.map(email => (
        !userEmails.includes(email)?(
          <UserAvatar>{email[0].toUpperCase()}</UserAvatar>
        ) : (
          usersSnapshot?.docs.map(user => (
            user.data().email == email?
            <UserAvatar key={user.id} id={user.id} src={user.data().photoURL}></UserAvatar>
            : null
          ))
        )
        
      ))}
      
    </AvatarContainer>


  )
}

export default ChatHeads


const AvatarContainer = styled.div`
  display: flex;
  margin-right: 1rem;
`;
const UserAvatar = styled(Avatar)`
  margin-left: -1rem;
`;

const getUsers = async (db, emails) => {
  const q = query(collection(db, 'users'), where('email', 'in', emails))
  return await getDocs(q)
}; 