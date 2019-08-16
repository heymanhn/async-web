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

const ParticipantAvatars = ({ authorId, members, participantIds }) => {
  // Display the meeting organizer first in the list of participant avatars
  function sortByMeetingOwnerFirst() {
    if (!participantIds.length) return [];

    const orderedParticipantIds = [authorId, ...participantIds.filter(i => i !== authorId)];
    return orderedParticipantIds.map(id => members.find(m => m.id === id));
  }

  return (
    <Container>
      {sortByMeetingOwnerFirst().map(p => (
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
};

ParticipantAvatars.propTypes = {
  authorId: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  participantIds: PropTypes.array.isRequired,
};

export default ParticipantAvatars;
