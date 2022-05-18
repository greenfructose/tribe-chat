import styled from 'styled-components';
import TimeAgo from 'timeago-react';

function Message({ user, message }) {
  return (
    <Container>
      <p>{message.message}</p>
        <p>{message.user}</p>
        <TimeAgo datetime={message.timestamp} />
        
    </Container>
  )
}

export default Message;

const Container = styled.div``;