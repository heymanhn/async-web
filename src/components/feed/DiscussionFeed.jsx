/*
 * Experimenting with React Hooks to create stateful function components:
 * https://reactjs.org/docs/hooks-overview.html
 */
import React from 'react';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import discussionFeedQuery from 'graphql/discussionFeedQuery';
import withPageTracking from 'utils/withPageTracking';
import { getLocalUser } from 'utils/auth';

import Layout from 'components/Layout';

import DiscussionFeedItem from './DiscussionFeedItem';

const Container = styled.div(({ theme: { wideViewport } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',

  maxHeight: 'calc(100vh - 70px)',
  margin: '0px auto',
  maxWidth: wideViewport,
  overflow: 'hidden',
}));

const DiscussionsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',

  height: 'calc(100vh - 70px)',
  margin: '0 auto',
  overflow: 'auto',
  padding: '25px 80px',
});

const DiscussionFeed = () => {
  const { userId: id } = getLocalUser();

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
            preventScrolling
            title="My Discussions"
          >
            <Container>
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
