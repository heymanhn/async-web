import React, { useRef, useState } from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import discussionFeedQuery from 'graphql/queries/discussionFeed';
import withPageTracking from 'utils/withPageTracking';
import { getLocalUser } from 'utils/auth';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
import { snakedQueryParams } from 'utils/queryParams';

import Layout from 'components/Layout';

import DiscussionFeedItem from './DiscussionFeedItem';
import DiscussionFeedFilters from './DiscussionFeedFilters';

const Container = styled.div(({ theme: { wideViewport } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',

  margin: '0px auto',
  maxWidth: wideViewport,
}));

const FiltersContainer = styled.div({
  maxHeight: 'calc(100vh - 71px)',
  overflow: 'auto',
  paddingTop: '50px',
  position: 'fixed',
  width: '380px', // add 30px side margins to the filter UI, to aid with scrolling perception
});

const DiscussionsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',

  margin: '0 auto',
  padding: '25px 80px',
  paddingLeft: '400px', // 80px + 320px width for the filter UI
});

const DiscussionFeed = () => {
  const { userId: id } = getLocalUser();
  const [meetingIdToFilter, setMeetingIdToFilter] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const feedRef = useRef(null);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(feedRef);

  const queryParams = {};
  if (meetingIdToFilter) queryParams.meeting_id = meetingIdToFilter;
  const { loading, error, data, fetchMore } = useQuery(discussionFeedQuery, {
    variables: { id, queryParams },
  });
  if (loading) return null;
  if (error || !data.discussionFeed) return <div>{error}</div>;

  const { items, pageToken } = data.discussionFeed;

  function fetchMoreFeed() {
    const newQueryParams = {};
    if (meetingIdToFilter) newQueryParams.meetingId = meetingIdToFilter;
    if (pageToken) newQueryParams.pageToken = pageToken;

    fetchMore({
      query: discussionFeedQuery,
      variables: { id, queryParams: snakedQueryParams(newQueryParams) },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { items: previousItems } = previousResult.discussionFeed;
        const { items: newItems, pageToken: newToken } = fetchMoreResult.discussionFeed;
        setShouldFetch(false);
        setIsFetching(false);

        return {
          discussionFeed: {
            pageToken: newToken,
            items: [...previousItems, ...newItems],
            __typename: previousResult.discussionFeed.__typename,
          },
        };
      },
    });
  }

  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreFeed();
  }

  return (
    <Container>
      <FiltersContainer>
        <DiscussionFeedFilters
          onSelectFilter={setMeetingIdToFilter}
          selectedMeetingId={meetingIdToFilter}
        />
      </FiltersContainer>
      <DiscussionsContainer ref={feedRef}>
        {(items || []).map(i => (
          <DiscussionFeedItem
            key={i.conversation.id}
            conversation={i.conversation}
            meeting={i.meeting}
          />
        ))}
      </DiscussionsContainer>
    </Container>
  );
};

export default withPageTracking(DiscussionFeed, 'Discussion Feed');
