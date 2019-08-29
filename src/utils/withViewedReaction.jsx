import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';

import createReactionMutation from 'graphql/mutations/createReaction';
import conversationQuery from 'graphql/queries/conversation';

const getDisplayName = C => C.displayName || C.name || 'Component';

/*
 * Allows any wrapped component to mark a conversation as read
 */
const withViewedReaction = (WrappedComponent) => {
  class WithViewedReaction extends Component {
    constructor(props) {
      super(props);

      this.addViewedReaction = this.addViewedReaction.bind(this);
    }

    async addViewedReaction(conversationId) {
      const { client, meetingId } = this.props;
      client.mutate({
        mutation: createReactionMutation,
        variables: {
          input: {
            objectType: 'conversation',
            objectId: conversationId,
            parentId: meetingId,
            code: 'viewed',
          },
        },
        refetchQueries: [{
          query: conversationQuery,
          variables: { conversationId },
        }],
      });
    }

    render() {
      return (
        <WrappedComponent
          markAsRead={this.addViewedReaction}
          {...this.props}
        />
      );
    }
  }

  WithViewedReaction.displayName = `WithViewedReactions(${getDisplayName(WrappedComponent)})`;
  WithViewedReaction.propTypes = {
    client: PropTypes.object.isRequired,
    meetingId: PropTypes.string.isRequired,
  };

  return withApollo(WithViewedReaction);
};

export default withViewedReaction;
