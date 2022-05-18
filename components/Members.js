import {
  useState,
  useEffect,
  setState,
} from 'react';
import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import media from '../styles/media';
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
        <HeaderInformation>
          <h3>Members</h3>
        </HeaderInformation>
      </Header>
      {registeredMembers.map((member => (
        <RegisteredMember key={member} >{member}<p>{getLastActive(member)}</p></RegisteredMember>
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
  display: none;
  ${media.tablet`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: block;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
    border-left: 1px solid whitesmoke;
    `
  }
`;
const HeaderInformation = styled.div`
  display: none;
  ${media.tablet`
    display: block;
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
  }
`;
const MembersContainer = styled.div`
  display: none;
  ${media.tablet`
    display: block;
  `}

`;
const RegisteredMember = styled.p`
  display: none;
  ${media.tablet`
    display: flex;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    color: green;
    > p {
      color: gray;
      font-size: 10px;
    }
    `
  }
`;
const UnregisteredMember = styled.p`
display: none;
  ${media.tablet`
    display: flex;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    color: red;
    `
  }
`;
const Breaker = styled.p`
display: none;
  ${media.tablet`
    display: flex;
    margin-left: 0;
    margin-right: 0.5rem;
    `
  }
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

const getLastActive = async (email) => {
  let result = '';
  const userRef = doc(db, 'users', `email: ${email}`);
  await getDoc(userRef).then((userSnap) => {
    if (userSnap.data()) {
      console.log(`Last Seen: ${userSnap.data()}`)
      result = userSnap.data().lastSeen.toDate().getTime()
    }
  });
  return result;
};