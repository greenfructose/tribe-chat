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

function ChatHeads(emails) {
  const [usersSnapshot, setUsersSnapshot] = useState(null);
  useEffect(() => {
    async function getUsersSnapshot(){
      const usersSnapshot = await getUsers(db, emails.emails);
      setUsersSnapshot(usersSnapshot);
    }
    getUsersSnapshot();
  }, [emails])
  return (
    <div>
{usersSnapshot?.docs.map((user) => (
      <UserAvatar key={user.id} id={user.id} src={user.data().photoURL} />
    ))}
    </div>
    
    
  )
}

export default ChatHeads

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;

const getUsers = async (db, emails) => {
  const q = query(collection(db, 'users'), where('email', 'in', emails))
  return await getDocs(q)
}; 