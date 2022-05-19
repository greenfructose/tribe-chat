import {
  useState,
  useEffect,
  useRef,
  useContext
} from 'react';
import { useRouter } from 'next/router';
import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import InputEmoji from 'react-input-emoji';
import {
  doc,
  addDoc,
  query,
  orderBy,
  getDocs,
  getDoc,
  updateDoc,
  collection,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, app } from '../firebase';
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Message from './Message';
import MicIcon from '@material-ui/icons/Mic';
import media from '../styles/media';


function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [messagesSnapshot, setMessageSnapshot] = useState(null);
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const endOfMessagesRef = useRef(null);
  const router = useRouter();


  useEffect(() => {
    async function getMessagesSnapshot() {
      const q = query(collection(db, 'messages'),
        where('chat', '==', router.query.id),
        orderBy('timestamp', 'asc'))
      const messagesSnapshot = await getDocs(q)
      setMessageSnapshot(messagesSnapshot)
    }
    getMessagesSnapshot();
  }, [router])

  const refreshData = () => {
    router.replace(router.asPath);
  }

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(message => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime()
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };


  const sendMessage = () => {
    const userRef = doc(db, 'users', user.uid);
    getDoc(userRef).then(doc => {
      updateDoc(userRef, {
        loggedIn: true,
        lastSeen: serverTimestamp()
      });
    });
    addDoc(collection(db, 'messages'), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      userName: user.displayName,
      photoURL: user.photoURL,
      chat: router.query.id
    }).then();
    setInput('');
    refreshData();
    scrollToBottom();
  };

  return (
    
    <Container>
      
      <Header>
        <p>Signed in as:</p>

        <HeaderInformation>
          <UserAvatar src={user.photoURL} />
          <h3>{user.displayName ? user.displayName : user.email}</h3>
        </HeaderInformation>
        <HeaderIcons>

          <IconButton>
            <MoreVertIcon  />
          </IconButton>
        </HeaderIcons>
        

      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessages ref={endOfMessagesRef} />

      </MessageContainer>
      <InputContainer>

        <InputEmoji
          value={input}
          onChange={setInput}
          onEnter={sendMessage}
        />
        {/* <Input value={input} onChange={e => setInput(e.target.value)} /> */}
        <button hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>
        <IconButton>
          <MicIcon />
        </IconButton>
        <IconButton>
          <AttachFileIcon />
        </IconButton>
      </InputContainer>
      
    </Container>
  )
}

export default ChatScreen

const Container = styled.div`
`;

const UserAvatar = styled(Avatar)`
  display: none;
  ${media.tablet`
    display: block;
    
  `}
`;

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
  > p {
    margin-right: 0.5rem;
  }
`;
const HeaderInformation = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 15px;
    cursor: pointer;
    :hover {
      background-color: #e9eaeb;
    }
    > h3 {
     margin: 1rem;
    }
    > p {
      font-size: 14px;
      color: gray;
    }
`;
const HeaderIcons = styled.div`
  display: flex;
  ${media.tablet`
    display: flex;
    position: absolute;
    right: 0;
    
  `}
`;
const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;
const EndOfMessages = styled.div`
  margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Menu = styled.div`
background-color: whitesmoke;
position: fixed;
left: 0;
top: 0;
transform: translate3d(-100vw, 0, 0);
width: 100vw;
height: 100vh;
`;
