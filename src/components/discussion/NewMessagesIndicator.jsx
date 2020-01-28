import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors, discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  margin: '0 -30px 30px',
  padding: '0 30px',
  height: '37px',
  backgroundColor: colors.unreadBlue,
  width: discussionViewport,
}));

const NewMessagesLabel = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '16px',
  fontWeight: 500,
  marginTop: '-2px',
  padding: '0px 25px',
  position: 'absolute',
}));

const NewMessagesIndicator = () => (
  <Container>
    <NewMessagesLabel>show new replies</NewMessagesLabel>
  </Container>
);

export default NewMessagesIndicator;
