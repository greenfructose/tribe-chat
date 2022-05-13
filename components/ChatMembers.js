import {
  useState,
  useEffect,
  setState,
} from 'react';
import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import {
  db
} from '../firebase';

function ChatMembers(emails, users, id) {



  return (

    <MembersContainer>
      {emails.emails.map((email) => 

          <RegisteredMember key={email}>{email}</RegisteredMember>

          // <UnregisteredMember>{email}</UnregisteredMember>
  
      )}
      
    </MembersContainer>
  )
}

export default ChatMembers;

const MembersContainer = styled.div`
  display: flex;
`;
const RegisteredMember = styled.p`
margin-right: 0.5rem;
color: green;
`;
const UnregisteredMember = styled.p`
margin-right: 0.5rem;
color: red;
`;


const isRegistered = async (member) => {
  let result = false;
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', member))
  await getDocs(q).then((usersSnap) => {
    usersSnap.forEach((user) => {
      if (user.data().email === member) {
        result = true;
      }
    })
  });
  return result;
}