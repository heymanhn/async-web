import React, { useContext } from 'react';
import { useQuery } from 'react-apollo';

import resourceMembersQuery from 'graphql/queries/resourceMembers';
import { DocumentContext, DiscussionContext } from 'utils/contexts';

import ParticipantRow from './ParticipantRow';

const ParticipantsList = () => {
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);

  const resourceType = documentId ? 'documents' : 'discussions';
  const id = documentId || discussionId;

  const { loading, data } = useQuery(resourceMembersQuery, {
    variables: { id, resourceType },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return null;

  const { resourceMembers } = data;
  const { members } = resourceMembers;

  return (members || []).map(p => (
    <ParticipantRow key={p.user.id} accessType={p.accessType} user={p.user} />
  ));
};

export default ParticipantsList;
