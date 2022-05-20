import { useState, useEffect, useContext } from 'react';
import {
  Avatar,
  IconButton,
  Button,
  FormControl,
  Input,
  InputLabel,
} from '@material-ui/core';
import styled from 'styled-components';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from "@material-ui/icons/Close";

import Chat from '../components/Chat';

import { Context } from '../context';

function Sidebar(props) {
  const {
    username,
    signOut,
    onAuthStateChanged,
    auth,
    db,
    user,
    chatsSnapshot,
    createChat
  } = useContext(Context);
  const [showNewChatForm, setShowNewChatForm] = useState(false);
  const [userList, setUserList] = useState('');
  

  return (
    <Container>
      <Header>
        <UserAvatar onClick={() => signOut(auth)} src={user.photoURL} />
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
      <SidebarButton onClick={() => setShowNewChatForm(true)}>
        Start a new chat
      </SidebarButton>
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} emails={chat.data().users.filter(e => { return e !== user.email })} />
      ))}
      {showNewChatForm &&
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <a href="#" onClick={() => setShowNewChatForm(false)}>
                <CloseIcon />
              </a>
            </ModalHeader>
            <h2>Add users separated by spaces.</h2>
            <ModalBody>
              <Form>
                <FormControl>
                  <InputLabel
                    htmlFor="users"
                  >
                    Users
                  </InputLabel>
                  <Input
                    type="text"
                    value={userList}
                    onChange={(e) => setUserList(e.target.value)}
                    placeholder="Users"
                  />
                </FormControl>
                <Button
                  onClick={() => createChat(
                    db,
                    user,
                    userList
                  )}
                >
                  Create Chat
                </Button>
              </Form>
            </ModalBody>
          </ModalContainer>
        </ModalOverlay>
      }
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
const ModalBody = styled.div`
  padding-top: 10px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 25px;
`;

const ModalContainer = styled.div`
  background: white;
  width: 500px;
  height: 600px;
  border-radius: 2px;
  padding: 15px;
`;
const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;
const Form = styled.form`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
`;
// const createChat = async (db, user) => {
//   const input = prompt(
//     'Please enter email addresses seperated by spaces for users you wish to chat with'
//   );

//   if (!input) return null;

//   const emailArray = input.split(' ');
//   let validatedEmailArray = [];

//   for (let i = 0; i < emailArray.length; i++) {
//     if (EmailValidator.validate(emailArray[i])
//       && emailArray[i] !== user.email) {
//       if (!validatedEmailArray.includes(emailArray[i])) {
//         console.log(`${emailArray[i]} not in validated array, pushing now`)
//         validatedEmailArray.push(emailArray[i])
//       }
//     }
//   }
//   console.log(`Getting chats`)
//   await getChats(db, user).then((chatsSnapshot) => {
//     validatedEmailArray.push(user.email)
//     chatAlreadyExists(validatedEmailArray, chatsSnapshot).then((chatExists) => {
//       if (!chatExists) {
//         console.log(`Adding chat now`)
//         addDoc(collection(db, 'chats'), {
//           creator: user.uid,
//           users: validatedEmailArray
//         });
//       }
//     });
//   });
// };


// const chatAlreadyExists = async (chatUsers, chatsSnapshot) => {
//   let result = false;
//   chatsSnapshot.forEach((doc) => {
//     if (arraysAreEqual(doc.data().users, chatUsers)) {
//       result = true;
//     }
//   })
//   return result;
// };

// const getChats = async (db, user) => {
//   const q = query(collection(db, 'chats'), where('users', 'array-contains', user.email))
//   return await getDocs(q)
// }; 