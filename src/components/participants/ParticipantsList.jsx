import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';

import documentMembersQuery from 'graphql/queries/documentMembers';

import ParticipantRow from './ParticipantRow';

const ParticipantsList = ({ documentId }) => {
  const { loading, data } = useQuery(documentMembersQuery, {
    variables: { id: documentId },
    fetchPolicy: 'cache-and-network',
  });

  if (loading && (!data || !data.documentMembers)) return null;

  const { documentMembers } = data;
  const { members } = documentMembers;

  return (members || []).map(p => (
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
