import React from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import localStateQuery from 'graphql/queries/localState';
import meetingsQuery from 'graphql/queries/meetings';
import { MEETINGS_QUERY_SIZE } from 'graphql/constants';
import { snakedQueryParams } from 'utils/queryParams';

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
  const { data: meetingsData } = useQuery(meetingsQuery, {
    variables: { queryParams: snakedQueryParams({ size: MEETINGS_QUERY_SIZE }) },
  });
  const { data: localStateData } = useQuery(localStateQuery);

  if (!meetingsData || !meetingsData.meetings) return null;
  const { items } = meetingsData.meetings;
  const meetingItems = (items || []);

  function isMeetingSelected(id) {
    if (!localStateData) return false;
    const { selectedMeetingId } = localStateData;
    return id === selectedMeetingId;
  }

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
          isSelected={isMeetingSelected(mi.meeting.id)}
        />
      ))}
    </Container>
  );
};

export default MeetingSpacesList;
