import React, { useContext } from 'react';
import { useQuery } from 'react-apollo';

import objectMembersQuery from 'graphql/queries/objectMembers';
import { DocumentContext, DiscussionContext } from 'utils/contexts';

import ParticipantRow from './ParticipantRow';

const ParticipantsList = () => {
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);

  const objectType = documentId ? 'documents' : 'discussions';
  const id = documentId || discussionId;

  const { loading, data } = useQuery(objectMembersQuery, {
    variables: { id, objectType },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return null;

  const { objectMembers } = data;
  const { members } = objectMembers;

  return (members || []).map(p => (
    <ParticipantRow key={p.user.id} accessType={p.accessType} user={p.user} />
  ));
};

export default ParticipantsList;
