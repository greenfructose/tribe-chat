import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import moment from 'moment';
import { auth } from '../firebase';

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth)

  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;
  const TypeOfUser = user === userLoggedIn.email ? Sent : Recieved;

  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
        </Timestamp>
        </TypeOfMessage>
        <TypeOfUser>
          {message.user}
        </TypeOfUser>
    </Container>
  )
}

export default Message;

const Container = styled.div`
`;
const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 0px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
  
`;
const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;

`;
const Reciever = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;

const UserStamp = styled.p`
  margin-left: 10px;
  font-size: 9px;
  text-align: left;
  margin-top: 1px;
`;

const Sent = styled(UserStamp)`
  display: none;
`;
const Recieved = styled(UserStamp)`

`;