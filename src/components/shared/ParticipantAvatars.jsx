import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Avatar from './Avatar';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const StyledAvatar = styled(Avatar)({
  display: 'inline-block',
  marginRight: '-4px',
});

// Display the meeting organizer first in the list of participants
const sortByMeetingOwnerFirst = (list, authorId) => {
  if (!list.length) return [];

  const meetingOrganizer = list.find(l => l.id === authorId);
  const others = list.filter(l => l.id !== authorId);

  return [meetingOrganizer, ...others];
};

const ParticipantAvatars = ({ authorId, participants }) => (
  <Container>
    {sortByMeetingOwnerFirst(participants, authorId).map(p => (
      <StyledAvatar
        alt={p.fullName}
        key={p.id}
        size={30}
        src={p.profilePictureUrl}
        title={p.fullName}
      />
    ))}
  </Container>
);

ParticipantAvatars.propTypes = {
  authorId: PropTypes.string.isRequired,
  participants: PropTypes.array.isRequired,
};

export default ParticipantAvatars;
