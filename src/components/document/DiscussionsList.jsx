import React, { useContext, useRef, useState } from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import { snakedQueryParams } from 'utils/queryParams';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
import {
  DocumentContext,
  DiscussionContext,
  DEFAULT_DISCUSSION_CONTEXT,
} from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import DiscussionMessage from 'components/discussion/DiscussionMessage';
import DiscussionListItem from './DiscussionListItem';

const Container = styled.div(({ theme: { documentViewport } }) => ({
  margin: '60px auto',
  width: documentViewport,
}));

const TitleSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.altContentText,
  fontSize: '32px',
  fontWeight: 600,
  letterSpacing: '-0.021em',
}));

const StartDiscussionButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  background: colors.blue,
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '5px 20px',
}));

const Label = styled.div(({ theme: { colors } }) => ({
  color: colors.white,
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
}));

// HN: There should be a way to DRY up these style declarations
const StyledDiscussionMessage = styled(DiscussionMessage)(
  ({ theme: { colors } }) => ({
    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
    margin: '40px 0',
  })
);

const DiscussionsList = () => {
  const listRef = useRef(null);
  const { documentId } = useContext(DocumentContext);

  const [isComposing, setIsComposing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [discussionId, setDiscussionId] = useState(null);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(listRef);

  const startComposing = () => setIsComposing(true);
  const stopComposing = () => {
    setDiscussionId(null);
    setIsComposing(false);
  };

  const { loading, error, data, fetchMore } = useQuery(
    documentDiscussionsQuery,
    {
      variables: { id: documentId, queryParams: { order: 'desc' } },
    }
  );

  if (loading) return null;
  if (error || !data.documentDiscussions) return <NotFound />;

  const { items, pageToken } = data.documentDiscussions;
  const discussions = (items || []).map(i => i.discussion);
  const discussionCount = discussions.length;

  if (!discussionCount && !isComposing) setIsComposing(true);

  function fetchMoreDiscussions() {
    const newQueryParams = { order: 'desc' };
    if (pageToken) newQueryParams.pageToken = pageToken;

    fetchMore({
      query: documentDiscussionsQuery,
      variables: {
        id: documentId,
        queryParams: snakedQueryParams(newQueryParams),
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { items: previousItems } = previousResult.documentDiscussions;
        const {
          items: newItems,
          pageToken: newToken,
        } = fetchMoreResult.documentDiscussions;
        setShouldFetch(false);
        setIsFetching(false);

        return {
          documentDiscussions: {
            pageToken: newToken,
            totalHits: fetchMoreResult.documentDiscussions.totalHits,
            items: [...previousItems, ...newItems],
            __typename: fetchMoreResult.documentDiscussions.__typename,
          },
        };
      },
    });
  }

  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreDiscussions();
  }

  const value = {
    ...DEFAULT_DISCUSSION_CONTEXT,
    discussionId,
    afterCreateDraft: id => setDiscussionId(id),
  };

  return (
    <Container ref={listRef}>
      <TitleSection>
        <Title>{discussionCount ? 'Discussions' : 'Start a discussion'}</Title>
        <StartDiscussionButton onClick={startComposing}>
          <Label>Start a discussion</Label>
        </StartDiscussionButton>
      </TitleSection>
      <DiscussionContext.Provider value={value}>
        {isComposing && (
          <StyledDiscussionMessage
            mode="compose"
            afterCreate={stopComposing}
            handleCancel={stopComposing}
          />
        )}
      </DiscussionContext.Provider>
      {discussions.map(d => (
        <DiscussionListItem key={d.id} discussionId={d.id} />
      ))}
    </Container>
  );
};

export default DiscussionsList;
