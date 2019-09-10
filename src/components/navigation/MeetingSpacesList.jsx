import React from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import meetingsQuery from 'graphql/queries/meetings';

import CreateMeetingSpaceButton from './CreateMeetingSpaceButton';
import MeetingRow from './MeetingRow';

const Container = styled.div({
  margin: '50px 20px 0',
});

const HeadingSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

const Heading = styled.div(({ theme: { colors } }) => ({
  color: colors.borderGrey,
  fontSize: '12px',
  fontWeight: 500,
}));

const MeetingSpacesList = () => {
  const { loading, data } = useQuery(meetingsQuery);

  if (loading || !data) return null;
  const { items } = data.meetings;
  const meetingItems = (items || []);

  return (
    <Container>
      <HeadingSection>
        <Heading>MEETING SPACES</Heading>
        <CreateMeetingSpaceButton />
      </HeadingSection>
      {meetingItems.map(mi => (
        <MeetingRow
          key={mi.meeting.id}
          meeting={mi.meeting}
          badgeCount={mi.badgeCount}
        />
      ))}
    </Container>
  );
};

export default MeetingSpacesList;
