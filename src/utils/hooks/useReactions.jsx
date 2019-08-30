import { useCallback, useEffect, useState } from 'react';
import { useApolloClient } from 'react-apollo';

import createReactionMutation from 'graphql/mutations/createReaction';
import deleteReactionMutation from 'graphql/mutations/deleteReaction';
import conversationMessageQuery from 'graphql/queries/conversationMessage';

const reactionsReference = [
  {
    code: 'smile',
    icon: '😄',
    text: "That's funny",
  },
  {
    code: 'heart',
    icon: '❤️',
    text: 'Love it',
  },
  {
    code: 'thumbs_up',
    icon: '👍',
    text: 'Agree',
  },
  {
    code: 'thumbs_down',
    icon: '👎',
    text: 'Disagree',
  },
  {
    code: 'thinking_face',
    icon: '🤔',
    text: 'Confused',
  },
  {
    code: 'clap',
    icon: '👏',
    text: 'Applause',
  },
];

const useReactions = ({ conversationId, messageId }) => {
  const [reactions, setReactions] = useState([]);
  const client = useApolloClient();

  const fetchReactions = useCallback(async ({ cid, mid }) => {
    const { data } = await client.query({
      query: conversationMessageQuery,
      variables: { conversationId: cid, messageId: mid },
    });

    setReactions(data.conversationMessage.reactions);
  }, [client]);

  async function addReaction(code) {
    const { data } = await client.mutate({
      mutation: createReactionMutation,
      variables: {
        input: {
          objectType: 'message',
          objectId: messageId,
          parentId: conversationId,
          code,
        },
      },
    });

    if (data.createReaction) {
      fetchReactions({ cid: conversationId, mid: messageId });
      return Promise.resolve(true);
    }

    return Promise.reject(new Error('Failed to add reaction to message'));
  }

  async function removeReaction(id) {
    const { data } = await client.mutate({
      mutation: deleteReactionMutation,
      variables: { id },
    });

    if (data.deleteReaction) {
      fetchReactions({ cid: conversationId, mid: messageId });
      return Promise.resolve(true);
    }

    return Promise.reject(new Error('Failed to remove reaction to message'));
  }

  useEffect(() => {
    fetchReactions({ cid: conversationId, mid: messageId });
  }, [conversationId, fetchReactions, messageId]);

  return {
    addReaction,
    reactions,
    reactionsReference,
    removeReaction,
  };
};

export default useReactions;
