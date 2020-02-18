import React, { useState, useRef } from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import inboxQuery from 'graphql/queries/inbox';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
import { snakedQueryParams } from 'utils/queryParams';

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
  const inboxRef = useRef(null);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(inboxRef);
  const [isFetching, setIsFetching] = useState(false);

  const { userId } = getLocalUser();
  const { loading, error, data, fetchMore } = useQuery(inboxQuery, {
    variables: { id: userId, queryParams: { type: viewMode } },
  });
  if (loading) return null;
  if (error || !data.inbox) return <Container>Error fetching page</Container>;

  const { items, pageToken, totalHits } = data.inbox;

  const fetchMoreMessages = () => {
    const newQueryParams = { type: viewMode };
    if (pageToken) newQueryParams.pageToken = pageToken;

    fetchMore({
      query: inboxQuery,
      variables: {
        id: userId,
        queryParams: snakedQueryParams(newQueryParams),
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { items: previousItems } = previousResult.inbox;
        const {
          items: newItems,
          pageToken: newToken,
          totalHits: newHits,
        } = fetchMoreResult.inbox;
        setShouldFetch(false);
        setIsFetching(false);

        return {
          inbox: {
            items: [...previousItems, ...newItems],
            pageToken: newToken,
            totalHits: totalHits + newHits,
            __typename: fetchMoreResult.inbox.__typename,
          },
        };
      },
    });
  };

  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreMessages();
  }

  return (
    <Container>
      <NavBar />
      <InnerContainer ref={inboxRef}>
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
