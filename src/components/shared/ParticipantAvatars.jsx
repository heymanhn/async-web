import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Avatar from './Avatar';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
});

// HN: Will perfect this component once we implement participants properly

const ParticipantAvatars = ({ participants }) => (
  <Container>
    {participants.map(participant => (
      <Avatar
        alt={participant.fullName}
        key={participant.id}
        size={30}
        src={participant.profilePictureUrl}
        title={participant.fullName}
      />
    ))}
  </Container>
);

ParticipantAvatars.propTypes = {
  participants: PropTypes.array.isRequired,
};

export default ParticipantAvatars;
