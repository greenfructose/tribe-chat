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
import ToolTip from './ToolTip';

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


  return (
    
      <ToolTip toolTipText={emails.emails.join('\r\n')}>
        <MembersContainer>
      {registeredMembers.length > 0 &&
        <RegisteredMember>{registeredMembers.join(', ')}</RegisteredMember>
      }
      {registeredMembers.length > 0 && unregisteredMembers.length > 0 && <Breaker></Breaker>}
      {unregisteredMembers.length > 0 &&
        <UnregisteredMember>{unregisteredMembers.join('(unregistered), ')}{unregisteredMembers.length > 0 && '(unregistered)'}</UnregisteredMember>
      }
</MembersContainer>
      </ToolTip>
      
    
  )
}

export default ChatMembers;


const MembersContainer = styled.div`
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

`;
const RegisteredMember = styled.p`
  margin-right: 0.5rem;
  width: 150px;
  color: green;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const UnregisteredMember = styled.p`
  margin-right: 0.5rem;
  color: red;
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

    await isRegistered(email).then((result) => {
      if (result) {
        reg.push(email)

      }
    });
  };

  return reg;
};

const getUnregisteredMembers = async (emails) => {
  let unreg = [];
  for (let email of emails) {

    await isRegistered(email).then((result) => {
      if (!result) {
        unreg.push(email)

      }
    });
  };

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