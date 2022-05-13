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

  useEffect(() => {
    async function getUsersSnapshot() {
      const usersSnapshot = await getUsers(db, emails.emails);
      setUsersSnapshot(usersSnapshot);
    }
    getUsersSnapshot();
  }, [emails])
  return (
    <AvatarContainer>
      {usersSnapshot?.docs.map((user) => (
        <UserAvatar key={user.id} id={user.id} src={user.data().photoURL} />
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