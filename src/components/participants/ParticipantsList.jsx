import React, { useContext } from 'react';
import { useQuery } from 'react-apollo';

import documentMembersQuery from 'graphql/queries/documentMembers';
import discussionMembersQuery from 'graphql/queries/discussionMembers';
import { DocumentContext, DiscussionContext } from 'utils/contexts';

import ParticipantRow from './ParticipantRow';

const ParticipantsList = () => {
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);

  const { loading, data } = useQuery(documentMembersQuery, {
    variables: { id: documentId },
    fetchPolicy: 'cache-and-network',
    skip: !documentId,
  });

  const { loading: loadingDiscussion, data: discussionData } = useQuery(
    discussionMembersQuery,
    {
      variables: { id: discussionId },
      fetchPolicy: 'cache-and-network',
      skip: !discussionId,
    }
  );

  if (loading || loadingDiscussion) return null;

  let members;
  if (documentId) {
    const { documentMembers } = data;
    ({ members } = documentMembers || {});
  } else if (discussionId) {
    const { discussionMembers } = discussionData;
    ({ members } = discussionMembers || {});
  }

  return (members || []).map(p => (
    <ParticipantRow key={p.user.id} accessType={p.accessType} user={p.user} />
  ));
};

export default ParticipantsList;
