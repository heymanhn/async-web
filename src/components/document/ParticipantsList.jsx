import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';

import documentParticipantsQuery from 'graphql/queries/documentParticipants';

import ParticipantRow from './ParticipantRow';

const ParticipantsList = ({ documentId }) => {
  const { loading, data } = useQuery(documentParticipantsQuery, {
    variables: { id: documentId },
  });

  if (loading) return null;

  const { documentParticipants } = data;
  const { participants } = documentParticipants;

  return (participants || []).map(p => (
    <ParticipantRow
      key={p.user.id}
      accessType={p.accessType}
      documentId={documentId}
      user={p.user}
    />
  ));
};

ParticipantsList.propTypes = { documentId: PropTypes.string.isRequired };

export default ParticipantsList;
