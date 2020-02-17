import React from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import inboxQuery from 'graphql/queries/inbox';
import InboxRow from './InboxRow';

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

const Inbox = () => {
  const { userId } = getLocalUser();
  const { loading, error, data } = useQuery(inboxQuery, {
    variables: { id: userId, queryParams: {} },
  });
  if (loading) return null;
  if (error || !data.inbox) return <Container>Error fetching page</Container>;

  const { items } = data.inbox;

  return (
    <Container>
      <InnerContainer>
        <PageTitle>Inbox</PageTitle>
        {items.map(item => {
          const object = item.document || item.discussion;
          return <InboxRow key={object.id} item={item} />;
        })}
      </InnerContainer>
    </Container>
  );
};

export default Inbox;
