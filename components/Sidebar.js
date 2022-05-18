import { useState, useEffect } from 'react';
import {
  Avatar,
  IconButton,
  Button,
} from '@material-ui/core';
import styled from 'styled-components';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { useAuthState } from 'react-firebase-hooks/auth';
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

} from 'firebase/firestore';
import { arraysAreEqual } from '../utils/arrayUtils';
import Chat from '../components/Chat';
import media from '../styles/media';

function Sidebar() {
  const [user] = useAuthState(auth);
  const [chatsSnapshot, setChatsSnapshot] = useState(null);
  useEffect(() => {
    async function getChatsSnapshot(){
      const chatsSnapshot = await getChats(db, user);
      setChatsSnapshot(chatsSnapshot);
    }
    getChatsSnapshot();
  }, [user])
  console.log(chatsSnapshot)
  return (
    <Container>
      <Header>
        <UserAvatar onClick={logout} src={user.photoURL} />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder='Search in chats' />
      </Search>
      <SidebarButton onClick={() => createChat(db, user)}>
        Start a new chat
      </SidebarButton>
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} emails={chat.data().users.filter(e => {return e !== user.email})} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 100%;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;
const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;

`;
const UserAvatar = styled(Avatar)`

    display: block;
    cursor: pointer;
    :hover {
      opacity: 0.8;
    }

`;
const IconsContainer = styled.div`

    display: block;

`;
const Search = styled.div`

    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;  

`;
const SearchInput = styled.input`

    display: flex;
    outline-width: 0;
    border: none;
    flex: 1;  

`;

const SidebarButton = styled(Button)`
    display: flex;
    width: 100%;
      &&&{
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
      } 
`;

const createChat = async (db, user) => {
  const input = prompt(
    'Please enter email addresses seperated by spaces for users you wish to chat with'
  );

  if (!input) return null;

  const emailArray = input.split(' ');
  let validatedEmailArray = [];

  for (let i = 0; i < emailArray.length; i++) {
    if (EmailValidator.validate(emailArray[i])
      && emailArray[i] !== user.email) {
      if (!validatedEmailArray.includes(emailArray[i])) {
        console.log(`${emailArray[i]} not in validated array, pushing now`)
        validatedEmailArray.push(emailArray[i])
      }
    }
  }
  console.log(`Getting chats`)
  await getChats(db, user).then((chatsSnapshot) => {
    validatedEmailArray.push(user.email)
    chatAlreadyExists(validatedEmailArray, chatsSnapshot).then((chatExists) => {
      if (!chatExists) {
        console.log(`Adding chat now`)
        addDoc(collection(db, 'chats'), {
          creator: user.uid,
          users: validatedEmailArray
        });
      }
    });
  });
};


const chatAlreadyExists = async (chatUsers, chatsSnapshot) => {
  let result = false;
  chatsSnapshot.forEach((doc) => {
    if (arraysAreEqual(doc.data().users, chatUsers)) {
      result = true;
    }
  })
  return result;
};

const getChats = async (db, user) => {
  const q = query(collection(db, 'chats'), where('users', 'array-contains', user.email))
  return await getDocs(q)
}; 