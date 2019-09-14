import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { Redirect } from '@reach/router';
import styled from '@emotion/styled';

import meetingQuery from 'graphql/queries/meeting';
import { matchCurrentUserId } from 'utils/auth';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
import { snakedQueryParams } from 'utils/queryParams';
import useSelectedMeeting from 'utils/hooks/useSelectedMeeting';
import useViewedReaction from 'utils/hooks/useViewedReaction';

import DiscussionRow from './DiscussionRow';
import TitleBar from './TitleBar';
import NewMeetingSpaceBanner from './NewMeetingSpaceBanner';
import WelcomeBanner from './WelcomeBanner';

const Container = styled.div({
  marginBottom: '60px',
});

const DiscussionsContainer = styled.div(({ theme: { meetingSpaceViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',

  margin: '0 auto',
  maxWidth: meetingSpaceViewport,
  padding: '50px 30px',
}));

const DiscussionList = styled.div({
  marginBottom: '50px',
});

const ListLabel = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '15px',
}));

const MeetingSpace = ({ meetingId }) => {
  const discussionsListRef = useRef(null);
  const checkSelectedMeeting = useSelectedMeeting();
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(discussionsListRef);
  const [isFetching, setIsFetching] = useState(false);
  const { markAsRead } = useViewedReaction();

  checkSelectedMeeting(meetingId);

  const { loading, data, fetchMore } = useQuery(meetingQuery, {
    variables: { id: meetingId, queryParams: {} },
  });
  if (loading) return null;
  if (!data || !data.meeting || !data.conversations) return <Redirect to="/notfound" noThrow />;

  const { reactions } = data.meeting;
  const { pageToken, items } = data.conversations;
  const conversations = (items || []).map(i => i.conversation);

  function hasCurrentUserViewed() {
    return !!(reactions || []).find(r => r.code === 'viewed' && matchCurrentUserId(r.author.id));
  }
  if (!hasCurrentUserViewed()) {
    markAsRead({
      isUnread: true,
      objectType: 'meeting',
      objectId: meetingId,
    });
  }

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
        {conversations.length > 0 ? (
          <React.Fragment>
            {!hasCurrentUserViewed() && <WelcomeBanner />}
            <DiscussionList>
              <ListLabel>DISCUSSIONS</ListLabel>
              {conversations.map(c => <DiscussionRow key={c.id} conversation={c} />)}
            </DiscussionList>
          </React.Fragment>
        ) : (
          <NewMeetingSpaceBanner
            hasCurrentUserViewed={hasCurrentUserViewed()}
            meetingId={data.meeting.id}
          />
        )}
      </DiscussionsContainer>
    </Container>
  );
};

MeetingSpace.propTypes = {
  meetingId: PropTypes.string.isRequired,
};

export default MeetingSpace;
