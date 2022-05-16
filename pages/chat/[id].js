import Head from 'next/head';
import styled from 'styled-components';
import Sidebar from '../../components/sidebar';
import ChatScreen from '../../components/ChatScreen'
import{ 
  collection,
  query, 
  where, 
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase';

function Chat() {
  return (
    <Container>
      <Head>
        <title>Chat</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen />
      </ChatContainer>
    </Container>
  )
}

export default Chat;

export async function getServerSideProps(context) {
  const q = query(collection(db, 'messages'), 
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