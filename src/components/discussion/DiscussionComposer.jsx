import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useQuery } from 'react-apollo';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';

import createDiscussionMutation from 'graphql/mutations/createDiscussion';
import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import currentUserQuery from 'graphql/queries/currentUser';
import { getLocalUser } from 'utils/auth';

import DiscussionReply from './DiscussionReply';

const DiscussionComposer = ({ afterCreate, context, documentId, handleClose, ...props }) => {
  const client = useApolloClient();
  const { userId } = getLocalUser();
  const { loading, data: currentUserData } = useQuery(currentUserQuery, {
    variables: { id: userId },
  });

  if (loading || !currentUserData.user) return null;
  const currentUser = currentUserData.user;

  async function handleCreateDiscussion() {
    const input = {};
    if (context) {
      const initialJSON = JSON.parse(context);
      const value = Value.fromJSON(initialJSON);

      input.topic = {
        formatter: 'slatejs',
        text: Plain.serialize(value),
        payload: context,
      };
    }

    const { data: createDiscussionData } = await client.mutate({
      mutation: createDiscussionMutation,
      variables: { documentId, input },
      refetchQueries: [{
        query: documentDiscussionsQuery,
        variables: { id: documentId, queryParams: {} },
      }],
      awaitRefetchQueries: true,
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
      {...props}
    />
  );
};

DiscussionComposer.propTypes = {
  afterCreate: PropTypes.func.isRequired,
  context: PropTypes.string,
  documentId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

DiscussionComposer.defaultProps = {
  context: null,
};

export default DiscussionComposer;
