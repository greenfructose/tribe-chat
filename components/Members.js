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

function Members(members) {

  const [registeredMembers, setRegisteredMembers] = useState([]);
  const [unregisteredMembers, setUnregisteredMembers] = useState([]);
  useEffect(() => async () => {
    await getRegisteredMembers(members.members).then((result) => {
      if (result) {
        setRegisteredMembers(result)
      }
    })
  }, [members])
  useEffect(() => async () => {
    await getUnregisteredMembers(members.members).then((result) => {
      if (result) {
        setUnregisteredMembers(result)
      }
    })
  }, [members])


  return (
    <MembersContainer>
      <Header>
        <h3>Members</h3>
      </Header>
      {registeredMembers.map((member => (
        <RegisteredMember key={member}>{member}</RegisteredMember>
      )
      ))
      }
      {unregisteredMembers.map((member => (
        <UnregisteredMember key={member}>{member}</UnregisteredMember>
      )))}

    </MembersContainer>
  )
}

export default Members;



const Header = styled.div`
position: sticky;
background-color: white;
z-index: 100;
top: 0;
display: flex;
padding: 11px;
height: 80px;
align-items: center;
border-bottom: 1px solid whitesmoke;
border-left: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
margin-left: 15px;
flex: 1;
> h3 {
  margin-bottom: 3px;
}
> p {
  font-size: 14px;
  color: gray;
}
`
  ;
const MembersContainer = styled.div`

`;
const RegisteredMember = styled.p`
padding-left: 0.5rem;
padding-right: 0.5rem;

color: green;
`;
const UnregisteredMember = styled.p`
padding-left: 0.5rem;
padding-right: 0.5rem;
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

const getRegisteredMembers = async (members) => {
  let reg = [];
  for (let member of members) {

    await isRegistered(member).then((result) => {
      if (result) {
        reg.push(member)

      }
    });
  };

  return reg;
};

const getUnregisteredMembers = async (members) => {
  let unreg = [];
  for (let member of members) {

    await isRegistered(member).then((result) => {
      if (!result) {
        unreg.push(member)

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