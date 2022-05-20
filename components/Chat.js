import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';
import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import media from '../styles/media';
import {
  db,
} from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import ChatHeads from '../components/ChatHeads';
import ChatMembers from '../components/ChatMembers';


function Chat({ id, emails}) {
  

  const router = useRouter();
  const enterChat = () => {
    router.push(`/chat/${id}`);
  }
  const ChatSelected = id === router.query.id ? SelectedChat : Container;


  return (
    <ChatSelected key={id} onClick={enterChat}>
      <ChatHeads emails={emails} />
      <ChatMembers emails={emails}  id={id} />
    </ChatSelected>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  :hover {
    background-color: #e9eaeb;
  }
`;

const SelectedChat = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  background-color: #e9eaeb;
`;


const UserAvatar = styled(Avatar)`

    display: block;
    margin: 5px;
    margin-right: 15px;

`;

