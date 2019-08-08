/*
 * Experimenting with React Hooks to create stateful function components:
 * https://reactjs.org/docs/hooks-overview.html
 */
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
  overflow: 'hidden',
}));

const DiscussionsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',

  margin: '0 auto',
  padding: '25px 80px',
  paddingLeft: '400px', // 80px + 320px width for the filter UI
});

const DiscussionFeed = () => {
  const { userId: id } = getLocalUser();

  /* HN: Ideas:
   * - see if I can reorganize the elements so that the filter UI is rendered regardless
   *   of this query's progress
   * - Add a state to track which filter option is selected
   * - the "All Discussions" option is equivalent to resetting the state
   */
  const [meetingIdToFilter, setMeetingIdToFilter] = useState(null);

  return (
    <Query
      query={discussionFeedQuery}
      variables={{ id }}
      fetchPolicy="no-cache"
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error || !data.discussionFeed) return <div>{error}</div>;

        const { items } = data.discussionFeed;

        return (
          <Layout
            hideFooter
            mode="wide"
            title="My Discussions"
          >
            <Container>
              <DiscussionFeedFilters
                onSelectFilter={setMeetingIdToFilter}
                selectedMeetingId={meetingIdToFilter}
              />
              <DiscussionsContainer>
                {items.map(i => (
                  <DiscussionFeedItem
                    key={i.conversation.id}
                    conversation={i.conversation}
                    meeting={i.meeting}
                  />
                ))}
              </DiscussionsContainer>
            </Container>
          </Layout>
        );
      }}
    </Query>
  );
};

export default withPageTracking(DiscussionFeed, 'Discussion Feed');
