import {
  useState,
  useEffect
} from 'react';
import { useRouter } from 'next/router';
import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  docs,
  query,
  orderBy,
  getDocs,
  getFirestore,
  collection,
  where
} from 'firebase/firestore';
import { auth, db, app } from '../firebase';
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Message from './Message';
import { InsertEmoticon } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [messagesSnapshot, setMessageSnapshot] = useState(null);
  const [input, setInput] = useState('');

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
      ))
    }
  }

  const sendMessage = (e) => {
    e.preventDefault();

    
  }
  return (
    <Container>
      <Header>
        <Avatar src={user.photoURL} />
        <HeaderInformation>
          <h3>{user.displayName}</h3>
          <p>Last Seen: </p>
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessages />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticon />
        <Input value={input} onChange={e => setInput(e.target.value)} />
        <button hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>
        <MicIcon />
      </InputContainer>
    </Container>
  )
}

export default ChatScreen

const Container = styled.div``;
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
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
padding: 30px;
background-color: #e5ded8;
min-height: 90vh;
`;
const EndOfMessages = styled.div``;
const InputContainer = styled.form`
display: flex;
align-items: center;
padding: 10px;
position: sticky;
bottom: 0;
background-color: white;
z-index: 100;
`;
const Input = styled.input`
flex: 1;
outline: 0;
border: none;
border-radius: 10px;
align-items: center;
padding: 20px;
margin-left: 15px;
margin-right: 15px;
position: sticky;
bottom: 0;
background-color: whitesmoke;
`;
