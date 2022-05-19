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
import TimeAgo from 'timeago-react';

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
  getLastActive('info@justinturney.com');

  return (
    <MembersContainer>
      <Header>
        <HeaderInformation>
          <h3>Members</h3>
        </HeaderInformation>
      </Header>
      {registeredMembers.map((member => (
        <RegMemberContainer  key={member.id}>
        <RegisteredMember>{member.name ? member.name : member.email}</RegisteredMember>
        <p>{member.email}</p>
        <p>Last active: <TimeAgo timestamp={member.lastSeen}/></p>
        </RegMemberContainer>
      )
      ))
      }
      {unregisteredMembers.length>0 && <Breaker>Unregistered Members</Breaker>}
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

const RegMemberContainer = styled.div`
  cursor: pointer;
  :hover {
      background-color: #e9eaeb;
    }
  > p {
    font-size: 10px;
    color: gray;
    margin-left: 15px;
    margin-top: 1px;
  }
`;

const RegisteredMember = styled.div`
  display: none;
  ${media.tablet`
    display: flex;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    color: green;
  `}
`;



const UnregisteredMember = styled.div`
display: none;
  ${media.tablet`
    display: flex;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    color: red;
    :hover {
      background-color: #e9eaeb;
    }
    `
  }
`;
const Breaker = styled.p`
display: none;
  ${media.tablet`
    background-color: whitesmoke;
    display: flex;
    border-top: 2px solid whitesmoke;
    border-bottom: 2px solid whitesmoke;
    padding: 1rem
    `
  }
`;

const isRegistered = async (member) => {
  let result = null;
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', member))
  await getDocs(q).then((usersSnap) => {
    usersSnap.forEach((user) => {
      if (user.data().email === member) {
        result = user.data();
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
        reg.push(result);
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
  const userRef = doc(db, 'users', email);
  await getDoc(userRef).then(userSnap => {
    if (userSnap.exists()) {
      console.log(`Last Seen: ${userSnap.data()}`);
      // result = userSnap.data().lastSeen.toDate().getTime();
    }
  });
  return result;
};