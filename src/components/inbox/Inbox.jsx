import React, { useRef, useState } from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import withPageTracking from 'utils/withPageTracking';
import meetingsQuery from 'graphql/queries/meetings';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
import { snakedQueryParams } from 'utils/queryParams';

import MeetingRow from './MeetingRow';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.bgGrey,
}));

const InnerContainer = styled.div(({ theme: { colors, maxViewport } }) => ({
  background: colors.white,
  margin: '0px auto',
  maxWidth: maxViewport,
  padding: '40px 20px',
}));

const PageTitle = styled.div({
  fontSize: '20px',
  fontWeight: 500,
  marginBottom: '20px',
});

const Inbox = () => {
  const listRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(listRef);

  const { loading, error, data, fetchMore } = useQuery(meetingsQuery);
  if (loading) return null;
  if (error || !data.meetings) return <Container>Error fetching meetings</Container>;

  const { items: meetingItems, pageToken } = data.meetings;

  function fetchMoreMeetings() {
    fetchMore({
      query: meetingsQuery,
      variables: { queryParams: snakedQueryParams({ pageToken }) },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { items: previousItems } = previousResult.meetings;
        const { items: newItems, pageToken: newToken } = fetchMoreResult.meetings;
        setShouldFetch(false);
        setIsFetching(false);

        return {
          meetings: {
            pageToken: newToken,
            items: [...previousItems, ...newItems],
            __typename: previousResult.meetings.__typename,
          },
        };
      },
    });
  }

  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreMeetings();
  }

  return (
    <Container>
      <InnerContainer ref={listRef}>
        <PageTitle>Your Meetings</PageTitle>
        {(meetingItems || []).map(item => (
          <MeetingRow
            key={item.meeting.id}
            meeting={item.meeting}
            conversationCount={item.conversationCount}
          />
        ))}
      </InnerContainer>
    </Container>
  );
};

export default withPageTracking(Inbox, 'Inbox');
