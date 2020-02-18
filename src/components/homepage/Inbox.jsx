import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import inboxQuery from 'graphql/queries/inbox';
import NewDocumentButton from 'components/document/NewDocumentButton';
import NewDiscussionButton from 'components/discussion/NewDiscussionButton';

import InboxRow from './InboxRow';
import NavBar from './Navbar';
import InboxViewMode from './InboxViewMode';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const InnerContainer = styled.div(({ theme: { colors, inboxViewport } }) => ({
  background: colors.white,
  margin: '0px auto',
  maxWidth: inboxViewport,
  padding: '40px 20px',
}));

const PageTitle = styled.div({
  fontSize: '32px',
  fontWeight: 600,
  letterSpacing: '-0.021em',
  marginBottom: '20px',
});

const ButtonContainer = styled.div({
  display: 'flex',
  marginTop: '20px',
});

const Inbox = () => {
  const [viewMode, setViewMode] = useState('all');

  const { userId } = getLocalUser();
  const { loading, error, data } = useQuery(inboxQuery, {
    variables: { id: userId, queryParams: { type: viewMode } },
  });
  if (loading) return null;
  if (error || !data.inbox) return <Container>Error fetching page</Container>;

  const { items } = data.inbox;

  return (
    <Container>
      <NavBar />
      <InnerContainer>
        <PageTitle>Inbox</PageTitle>
        <InboxViewMode viewMode={viewMode} setViewMode={setViewMode} />
        {items.map(item => {
          const object = item.document || item.discussion;
          return <InboxRow key={object.id} item={item} />;
        })}
        <ButtonContainer>
          <NewDocumentButton />
          <NewDiscussionButton />
        </ButtonContainer>
      </InnerContainer>
    </Container>
  );
};

export default Inbox;
