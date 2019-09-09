import React from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import meetingsQuery from 'graphql/queries/meetings';

import MeetingRow from './MeetingRow';

const Container = styled.div({
  margin: '50px 20px 0',
});

const Heading = styled.div(({ theme: { colors } }) => ({
  color: colors.borderGrey,
  fontSize: '12px',
  fontWeight: 500,
  marginBottom: '10px',
}));

const MeetingSpacesList = () => {
  const { loading, data } = useQuery(meetingsQuery);

  if (loading || !data) return null;
  const { items } = data.meetings;
  const meetings = (items || []).map(i => i.meeting);

  return (
    <Container>
      <Heading>MEETING SPACES</Heading>
      {meetings.map(m => <MeetingRow key={m.id} meeting={m} />)}
    </Container>
  );
};

export default MeetingSpacesList;
