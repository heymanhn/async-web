/*
 * Experimenting with React Hooks to create stateful function components:
 * https://reactjs.org/docs/hooks-overview.html
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import discussionFeedQuery from 'graphql/discussionFeedQuery';
import withPageTracking from 'utils/withPageTracking';
import { getLocalUser } from 'utils/auth';

import Layout from 'components/Layout';

const Container = styled.div(({ theme: { wideViewport } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',

  maxHeight: 'calc(100vh - 70px)',
  margin: '0 auto',
  maxWidth: wideViewport,
  overflow: 'hidden',
  padding: '50px 0',
}));

const DiscussionsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',

  height: 'calc(100vh - 100px)', // 70px nav bar, 30px margin until start of scroll line
  margin: '30px auto',
  overflow: 'auto',
  padding: '20px 80px',
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
            title="My Discussions"
          >
            <Container>
              <DiscussionsContainer>
                {items.map(i => <div key={i.conversation.id}>{i.conversation.title}</div>)}
              </DiscussionsContainer>
            </Container>
          </Layout>
        );
      }}
    </Query>
  );
};

DiscussionFeed.propTypes = {

};

export default withPageTracking(DiscussionFeed, 'Discussion Feed');
