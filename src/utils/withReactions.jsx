import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo, Query } from 'react-apollo';

import conversationMessageQuery from 'graphql/queries/conversationMessage';
import createReactionMutation from 'graphql/mutations/createReaction';
import deleteReactionMutation from 'graphql/mutations/deleteReaction';

const getDisplayName = C => C.displayName || C.name || 'Component';

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

/* Provides APIs to add and remove reactions on a message
 *
 * Any parent component will need to pass the following props:
 * - conversationId
 * - message
 *
 * The HOC provides the following props to the child component:
 * - func addReaction(code: String)
 * - func removeReaction(id: String)
 * - array of all the reactions to expect from a message
 * - array of the reactions that users created for the given message
 *
 */
const withReactions = (WrappedComponent) => {
  class WithReactions extends Component {
    constructor(props) {
      super(props);

      this.addReaction = this.addReaction.bind(this);
      this.removeReaction = this.removeReaction.bind(this);
    }

    async addReaction(code) {
      const { client, conversationId: cid, messageId: mid } = this.props;

      const response = await client.mutate({
        mutation: createReactionMutation,
        variables: {
          input: {
            objectType: 'message',
            objectId: mid,
            parentId: cid,
            code,
          },
        },
        refetchQueries: [{
          query: conversationMessageQuery,
          variables: { cid, mid },
        }],
      });

      if (response.data && response.data.createReaction) {
        return Promise.resolve(true);
      }

      return Promise.reject(new Error('Failed to add reaction to message'));
    }

    async removeReaction(id) {
      const { client, conversationId: cid, messageId: mid } = this.props;

      const response = await client.mutate({
        mutation: deleteReactionMutation,
        variables: { id },
        refetchQueries: [{
          query: conversationMessageQuery,
          variables: { cid, mid },
        }],
      });

      if (response.data && response.data.deleteReaction) {
        return Promise.resolve(true);
      }

      return Promise.reject(new Error('Failed to remove reaction to message'));
    }

    render() {
      const { conversationId: cid, messageId: mid } = this.props;

      return (
        <Query
          query={conversationMessageQuery}
          variables={{ cid, mid }}
        >
          {({ loading, data }) => {
            if (loading) return null;

            const { reactions } = data.conversationMessage;
            return (
              <WrappedComponent
                addReaction={this.addReaction}
                removeReaction={this.removeReaction}
                reactions={reactions || []}
                reactionsReference={reactionsReference}
                {...this.props}
              />
            );
          }}
        </Query>
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
