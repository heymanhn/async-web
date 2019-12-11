/*
 * Repurposed from <DiscussionComposer />, used for the Roval V2 discussion UX
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useQuery } from 'react-apollo';

import createDiscussionMutation from 'graphql/mutations/createDiscussion';
import currentUserQuery from 'graphql/queries/currentUser';
import { getLocalUser } from 'utils/auth';

import DiscussionReply from './DiscussionReply';

const InlineDiscussionComposer = ({ afterCreate, documentId, handleClose }) => {
  const client = useApolloClient();
  const { userId } = getLocalUser();
  const { loading, data: currentUserData } = useQuery(currentUserQuery, {
    variables: { id: userId },
  });

  if (loading || !currentUserData.user) return null;
  const currentUser = currentUserData.user;

  async function handleCreateDiscussion() {
    const input = {};

    const { data: createDiscussionData } = await client.mutate({
      mutation: createDiscussionMutation,
      variables: { documentId, input },
    });

    if (createDiscussionData.createDiscussion) {
      const { id: discussionId } = createDiscussionData.createDiscussion;
      return Promise.resolve({ discussionId, isNewDiscussion: true });
    }

    return Promise.reject(new Error('Failed to create discussion'));
  }

  return (
    <DiscussionReply
      afterCreate={afterCreate}
      currentUser={currentUser}
      initialMode="compose"
      documentId={documentId}
      onCancel={handleClose}
      onCreateDiscussion={handleCreateDiscussion}
    />
  );
};

InlineDiscussionComposer.propTypes = {
  afterCreate: PropTypes.func.isRequired,
  documentId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default InlineDiscussionComposer;
