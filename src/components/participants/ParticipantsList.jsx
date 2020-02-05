import React, { useContext } from 'react';
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

<<<<<<< HEAD
  return (members || []).map(p => (
    <ParticipantRow
      key={p.user.id}
      accessType={p.accessType}
      documentId={documentId}
      user={p.user}
    />
=======
  return (participants || []).map(p => (
    <ParticipantRow key={p.user.id} accessType={p.accessType} user={p.user} />
>>>>>>> refactored props to useContext for share/invite modal
  ));
};

export default ParticipantsList;
