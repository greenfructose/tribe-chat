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
import { Loading } from '../components/Loading'

function ChatMembers(emails) {
  const [registeredMembers, setRegisteredMembers] = useState([]);
  const [unregisteredMembers, setUnregisteredMembers] = useState([]);
  useEffect(() => async () => {
    await getRegisteredMembers(emails.emails).then((result) => {
      if (result) {
        setRegisteredMembers(result)
      }
    })
  }, [emails])
  useEffect(() => async () => {
    await getUnregisteredMembers(emails.emails).then((result) => {
      if (result) {
        setUnregisteredMembers(result)
      }
    })
  }, [emails])


  console.log(`Registered members: ${registeredMembers}`)
  return (
    <MembersContainer>
      <RegisteredMember>{registeredMembers.join(', ')}</RegisteredMember>
      {registeredMembers.length>0 && unregisteredMembers.length>0 && <Breaker>|</Breaker>}
      <UnregisteredMember>{unregisteredMembers.join(', ')}</UnregisteredMember>
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
const Breaker = styled.p`
margin-left: 0;
margin-right: 0.5rem;
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
};

const getRegisteredMembers = async (emails) => {
  let reg = [];
  for (let email of emails) {
    console.log(`Checking if ${email} is registered...`)
    await isRegistered(email).then((result) => {
      if (result) {
        reg.push(email)
        console.log(`${email} is registered`)
      }
    });
  };
  console.log(`Reg: ${reg}`)
  return reg;
};

const getUnregisteredMembers = async (emails) => {
  let unreg = [];
  for (let email of emails) {
    console.log(`Checking if ${email} is registered...`)
    await isRegistered(email).then((result) => {
      if (!result) {
        unreg.push(email)
        console.log(`${email} is registered`)
      }
    });
  };
  console.log(`Reg: ${unreg}`)
  return unreg;
};

// const getUnregisteredMembers = async (emails) => {
//   let unregisteredMembers = [];
//   emails.forEach(email => {
//     isRegistered(email).then((result) => {
//       if (!result) {
//         console.log(`${email} is not registered`)
//         unregisteredMembers.push(email);
//       }
//     })
//   });
//   return unregisteredMembers;
// };