import React, { useContext } from 'react';
import { useQuery } from 'react-apollo';

import documentMembersQuery from 'graphql/queries/documentMembers';
import { DocumentContext } from 'utils/contexts';

import ParticipantRow from './ParticipantRow';

const ParticipantsList = () => {
  const { documentId } = useContext(DocumentContext);
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

export default ParticipantsList;
