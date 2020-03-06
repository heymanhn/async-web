import React, { useState } from 'react';
import styled from '@emotion/styled';

import NewDocumentButton from 'components/document/NewDocumentButton';
import NewDiscussionButton from 'components/discussion/NewDiscussionButton';
import NavBar from './Navbar';
import InboxViewMode from './InboxViewMode';
import InboxTable from './InboxTable';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const InnerContainer = styled.div(({ theme: { colors, inboxViewport } }) => ({
  background: colors.white,
  margin: '0px auto',
  maxWidth: inboxViewport,
  padding: '60px 20px 40px',
}));

const PageTitle = styled.div({
  fontSize: '42px',
  fontWeight: 600,
  letterSpacing: '-0.022em',
  marginBottom: '10px',
});

const ButtonContainer = styled.div({
  display: 'flex',
  marginTop: '20px',
});

const Inbox = () => {
  const [viewMode, setViewMode] = useState('all');

  return (
    <Container>
      <NavBar />
      <InnerContainer>
        <PageTitle>Inbox</PageTitle>
        <InboxViewMode viewMode={viewMode} setViewMode={setViewMode} />
        <InboxTable viewMode={viewMode} />
        <ButtonContainer>
          <NewDocumentButton />
          <NewDiscussionButton />
        </ButtonContainer>
      </InnerContainer>
    </Container>
  );
};

export default Inbox;
