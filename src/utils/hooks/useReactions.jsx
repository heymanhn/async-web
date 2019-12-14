/* Provides APIs to access, add and remove reactions on a reply
 *
 * The hook provides the following functionality:
 * - func addReaction(code: String)
 * - func removeReaction(id: String)
 * - array of all the reactions to expect from a reply
 * - array of the reactions that users created for the given reply
 *
 */

import { useMutation, useQuery } from 'react-apollo';

import createReactionMutation from 'graphql/mutations/createReaction';
import deleteReactionMutation from 'graphql/mutations/deleteReaction';
import replyQuery from 'graphql/queries/reply';
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
    text: 'Thinking',
  },
  {
    code: 'clap',
    icon: '👏',
    text: 'Applause',
  },
];

const useReactions = ({ discussionId, replyId }) => {
  const [execAddReaction] = useMutation(createReactionMutation);
  const [execRemoveReaction] = useMutation(deleteReactionMutation);

  async function addReaction(code) {
    await execAddReaction({
      variables: {
        input: {
          objectType: 'reply',
          objectId: replyId,
          code,
        },
      },
      refetchQueries: [{
        query: replyQuery,
        variables: { discussionId, replyId },
      }],
    });

    track('Reaction added', { reaction: code, replyId });
  }

  async function removeReaction(id, code) {
    await execRemoveReaction({
      variables: { id },
      refetchQueries: [{
        query: replyQuery,
        variables: { discussionId, replyId },
      }],
    });

    track('Reaction removed', { reaction: code, replyId });
  }

  const { data } = useQuery(replyQuery, {
    variables: { discussionId, replyId },
  });

  let reactions = [];
  if (data.reply) {
    const { reactions: reax } = data.reply;
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
