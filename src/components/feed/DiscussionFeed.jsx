import React, { useState } from 'react';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import discussionFeedQuery from 'graphql/discussionFeedQuery';
import withPageTracking from 'utils/withPageTracking';
import { getLocalUser } from 'utils/auth';

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

  return (
    <Layout
      hideFooter
      mode="wide"
      title="My Discussions"
    >
      <Container>
        <FiltersContainer>
          <DiscussionFeedFilters
            onSelectFilter={setMeetingIdToFilter}
            selectedMeetingId={meetingIdToFilter}
          />
        </FiltersContainer>
        <Query
          query={discussionFeedQuery}
          variables={{ id, meetingId: meetingIdToFilter || '' }}
          fetchPolicy="no-cache"
        >
          {({ loading, error, data }) => {
            if (loading) return null;
            if (error || !data.discussionFeed) return <div>{error}</div>;

            const { items } = data.discussionFeed;

            return (
              <DiscussionsContainer>
                {items.map(i => (
                  <DiscussionFeedItem
                    key={i.conversation.id}
                    conversation={i.conversation}
                    meeting={i.meeting}
                  />
                ))}
              </DiscussionsContainer>
            );
          }}
        </Query>
      </Container>
    </Layout>
  );
};

export default withPageTracking(DiscussionFeed, 'Discussion Feed');
