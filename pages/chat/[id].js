import Head from 'next/head';
import styled from 'styled-components';
import Sidebar from '../../components/sidebar';
import ChatScreen from '../../components/ChatScreen'
import{ 
  collection,
  query, 
  where, 
  getDocs,
  getDoc,
  doc,
  docs,
  orderBy,
} from 'firebase/firestore';
import { 
  db,
  auth
} from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function Chat({chat, messages}) {
  return (
    <Container>
      <Head>
        <title>Chat with {chat.users.join(', ')}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages}/>
      </ChatContainer>
    </Container>
  )
}

export default Chat;

export async function getServerSideProps(context) {
  const q = query(collection(db, 'chats'), 
    where('id', '==', context.query.id),
    orderBy('timestamp', 'asc'))
  const messageRes = await getDocs(q)
  const messages = messageRes.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })).map(messages => ({
    ...messages,
    timestamp: messages.timestamp.toDate().getTime()
  }));
  const chatRef = doc(db, 'chats', context.query.id);
  const chatRes = await getDoc(chatRef);
  const chat = {
    id: chatRes.id,
    ...chatRes.data()
  }
  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat
    }
  }
};

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;