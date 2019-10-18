/* Provides APIs to access, add and remove reactions on a message
 *
 * The hook provides the following functionality:
 * - func addReaction(code: String)
 * - func removeReaction(id: String)
 * - array of all the reactions to expect from a message
 * - array of the reactions that users created for the given message
 *
 */

import { useMutation, useQuery } from 'react-apollo';

import createReactionMutation from 'graphql/mutations/createReaction';
import deleteReactionMutation from 'graphql/mutations/deleteReaction';
import messageQuery from 'graphql/queries/message';
import { track } from 'utils/analytics';

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
  const [execAddReaction] = useMutation(createReactionMutation);
  const [execRemoveReaction] = useMutation(deleteReactionMutation);

  async function addReaction(code) {
    await execAddReaction({
      variables: {
        input: {
          objectType: 'message',
          objectId: messageId,
          code,
        },
      },
      refetchQueries: [{
        query: messageQuery,
        variables: { conversationId, messageId },
      }],
    });

    track('Reaction added', { reaction: code, messageId });
  }

  async function removeReaction(id, code) {
    await execRemoveReaction({
      variables: { id },
      refetchQueries: [{
        query: messageQuery,
        variables: { conversationId, messageId },
      }],
    });

    track('Reaction removed', { reaction: code, messageId });
  }

  const { data } = useQuery(messageQuery, {
    variables: { conversationId, messageId },
  });

  let reactions = [];
  if (data.message) {
    const { reactions: reax } = data.message;
    if (reax) reactions = reax;
  }

  return {
    addReaction,
    reactions,
    reactionsReference,
    removeReaction,
  };
};

export default useReactions;
