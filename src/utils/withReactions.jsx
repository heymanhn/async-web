import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';

import createReactionMutation from 'graphql/createReactionMutation';
import deleteReactionMutation from 'graphql/deleteReactionMutation';

const getDisplayName = C => C.displayName || C.name || 'Component';

const reactions = [
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

/* Provides APIs to add and remove reactions on a message
 *
 * Any parent component will need to pass the following props:
 * - conversationId
 * - messageId
 *
 * The HOC provides the following props to the child component:
 * - func addReaction(code: String)
 * - func removeReaction(code: String)
 * - array of reactions
 */
const withReactions = (WrappedComponent) => {
  class WithReactions extends Component {
    constructor(props) {
      super(props);

      this.addReaction = this.addReaction.bind(this);
      this.removeReaction = this.removeReaction.bind(this);
    }

    async addReaction(code) {
      const { client, conversationId, messageId } = this.props;

      const response = await client.mutate({
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

      if (response.data && response.data.createReaction) {
        return Promise.resolve(true);
      }

      return Promise.reject(new Error('Failed to add reaction to message'));
    }

    async removeReaction(code) {
      const { client, conversationId, messageId } = this.props;

      const response = await client.mutate({
        mutation: deleteReactionMutation,
        variables: {
          id: 0, // TODO: pass reactionIds via userReactions
          input: {
            objectType: 'message',
            objectId: messageId,
            parentId: conversationId,
            code,
          },
        },
      });

      if (response.data && response.data.removeReaction) {
        return Promise.resolve(true);
      }

      return Promise.reject(new Error('Failed to remove reaction to message'));
    }

    render() {
      return (
        <WrappedComponent
          addReaction={this.addReaction}
          removeReaction={this.removeReaction}
          reactions={reactions}
          {...this.props}
        />
      );
    }
  }

  WithReactions.displayName = `WithReactions(${getDisplayName(WrappedComponent)})`;
  WithReactions.propTypes = {
    client: PropTypes.object.isRequired,
    conversationId: PropTypes.string.isRequired,
    messageId: PropTypes.string.isRequired,
  };

  return withApollo(WithReactions);
};

export default withReactions;
