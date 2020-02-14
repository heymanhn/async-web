import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  margin: '0 -30px 30px',
  padding: '0 30px',
  width: discussionViewport,
}));

const Divider = styled.hr(({ theme: { colors } }) => ({
  borderTop: `2px solid ${colors.blue}`,
  margin: '10px 0',
  width: '100%',
}));

const NewMessagesLabel = styled.div(({ theme: { colors } }) => ({
  background: colors.bgGrey,
  color: colors.blue,
  fontSize: '16px',
  fontWeight: 500,
  marginTop: '-2px',
  padding: '0px 25px',
  position: 'absolute',
}));

const NewMessagesDivider = () => (
  <Container>
    <Divider />
    <NewMessagesLabel>new messages</NewMessagesLabel>
  </Container>
);

export default NewMessagesDivider;
