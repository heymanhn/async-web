import React from 'react';
import PropTypes from 'prop-types';

import ParticipantRow from './ParticipantRow';

const ParticipantsList = ({ participants }) => (
  <>
    {participants.map(p => (
      <ParticipantRow key={p.user.id} accessType={p.accessType} user={p.user} />
    ))}
  </>
);

ParticipantsList.propTypes = {
  participants: PropTypes.array.isRequired,
};

export default ParticipantsList;
