import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import meetingQuery from 'graphql/queries/meeting';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
import { snakedQueryParams } from 'utils/queryParams';
// import withViewedReaction from 'utils/withViewedReaction';

import DiscussionRow from './DiscussionRow';
import TitleBar from './TitleBar';

const Container = styled.div({
  marginBottom: '60px',
});

const DiscussionsContainer = styled.div(({ theme: { meetingSpaceViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',

  margin: '0 auto',
  maxWidth: meetingSpaceViewport,
  padding: '30px',
}));

// const StartDiscussionButton = styled.div(({ theme: { colors } }) => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',

//   background: colors.white,
//   border: `1px solid ${colors.borderGrey}`,
//   cursor: 'pointer',
//   height: '48px',
//   marginLeft: '20px',
//   padding: '0 30px',
//   width: '460px', // Define as a constant elsewhere?
// }));

// const ButtonLabel = styled.div(({ theme: { colors } }) => ({
//   color: colors.grey2,
//   fontSize: '16px',
//   fontWeight: 500,
// }));

// const PlusSign = styled.div(({ theme: { colors } }) => ({
//   color: colors.grey3,
//   fontSize: '24px',
//   fontWeight: 500,
//   marginTop: '-4px',
// }));

const MeetingSpace = ({ meetingId }) => {
  const discussionsListRef = useRef(null);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(discussionsListRef);
  const [isFetching, setIsFetching] = useState(false);

  const { loading, data, fetchMore } = useQuery(meetingQuery, {
    variables: { id: meetingId, queryParams: {} },
  });
  if (loading || !data.meeting) return null;

  const { pageToken, items } = data.conversations;
  const conversations = (items || []).map(i => i.conversation);

  // HN: Opportunity to DRY this up with the fetch handler for the discussion page?
  function fetchMoreDiscussions() {
    const newQueryParams = {};
    if (pageToken) newQueryParams.pageToken = pageToken;

    fetchMore({
      query: meetingQuery,
      variables: { id: meetingId, queryParams: snakedQueryParams(newQueryParams) },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { items: previousItems } = previousResult.conversations;
        const { items: newItems, pageToken: newToken } = fetchMoreResult.conversations;
        setShouldFetch(false);
        setIsFetching(false);

        return {
          meeting: fetchMoreResult.meeting,
          conversations: {
            pageToken: newToken,
            totalHits: fetchMoreResult.conversations.totalHits,
            items: [...previousItems, ...newItems],
            __typename: fetchMoreResult.conversations.__typename,
          },
        };
      },
    });
  }

  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreDiscussions();
  }

  return (
    <Container>
      <TitleBar meeting={data.meeting} />
      <DiscussionsContainer ref={discussionsListRef}>
        {conversations.map(c => <DiscussionRow key={c.id} conversation={c} />)}
      </DiscussionsContainer>
    </Container>
  );
};

MeetingSpace.propTypes = {
  meetingId: PropTypes.string.isRequired,
};

export default MeetingSpace;
