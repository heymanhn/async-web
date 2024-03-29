import React from 'react';
import PropTypes from 'prop-types';

import ParticipantRow from './ParticipantRow';

const ParticipantsList = ({ participants, handleRemove, ...props }) => (
  <div {...props}>
    {participants.map(p => (
      <ParticipantRow
        key={p.user.id}
        accessType={p.accessType}
        user={p.user}
        handleRemove={handleRemove}
      />
    ))}
  </div>
);

ParticipantsList.propTypes = {
  participants: PropTypes.array.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default ParticipantsList;
