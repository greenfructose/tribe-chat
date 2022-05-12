import { useState, useEffect } from 'react';
import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import {
  auth,
  db,
  logout,
} from '../firebase';
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  docs,
} from 'firebase/firestore';
import ChatHeads from '../components/ChatHeads';


function Chat({ id, emails }) {
  const [users, setUsers] = useState(null)
  useEffect(() => {
    async function getUsersByEmail(){
      const q = query(collection(db, 'users'), where('email', 'in', emails))
      const result = await getDocs(q);
      setUsers(result);
    }
    getUsersByEmail();
  }, [emails])
  
  console.log(typeof(users))
  
  return (
    <Container>
        <ChatHeads emails={emails}/>   
      <p>{emails.join(', ')}</p>      
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;

