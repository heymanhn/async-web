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

const InlineDiscussionComposer = ({ documentId, handleClose }) => {
  const client = useApolloClient();
  const { userId } = getLocalUser();
  const { loading, data: currentUserData } = useQuery(currentUserQuery, {
    variables: { id: userId },
  });

  if (loading || !currentUserData.user) return null;
  const currentUser = currentUserData.user;

  async function handleCreateDiscussion({ payload, text } = {}) {
    const input = {};

    // It's possible to create a discussion without an initial message, such as
    // when creating a draft for the first reply to a discussion
    if (payload && text) {
      input.replies = [{
        body: {
          formatter: 'slatejs',
          text,
          payload,
        },
      }];
    }

    const { data: createDiscussionData } = await client.mutate({
      mutation: createDiscussionMutation,
      variables: { documentId, input },
    });

    if (createDiscussionData.createDiscussion) {
      const { id: discussionId } = createDiscussionData.createDiscussion;
      // afterSubmit(conversationId);
      return Promise.resolve({ discussionId, isNewDiscussion: true });
    }

    return Promise.reject(new Error('Failed to create discussion'));
  }

  return (
    <DiscussionReply
      currentUser={currentUser}
      initialMode="compose"
      documentId={documentId}
      onCancel={handleClose}
      onCreateDiscussion={handleCreateDiscussion}
    />
  );
};

InlineDiscussionComposer.propTypes = {
  // afterSubmit: PropTypes.func.isRequired,
  documentId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default InlineDiscussionComposer;
