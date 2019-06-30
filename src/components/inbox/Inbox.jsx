import React from 'react';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import withPageTracking from 'utils/withPageTracking';
import meetingsQuery from 'graphql/meetingsQuery';

import MeetingRow from './MeetingRow';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
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

const Inbox = () => (
  <Query query={meetingsQuery}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error || !data.meetings) return <Container>Error fetching meetings</Container>;

      const { items: meetingItems } = data.meetings;

      return (
        <Container>
          <InnerContainer>
            <PageTitle>Your Meetings</PageTitle>
            {meetingItems.map(item => (
              <MeetingRow
                key={item.meeting.id}
                meeting={item.meeting}
                conversationCount={item.conversationCount}
              />
            ))}
          </InnerContainer>
        </Container>
      );
    }}
  </Query>
);

export default withPageTracking(Inbox, 'Inbox');
