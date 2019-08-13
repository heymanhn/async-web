import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import conversationMessagesQuery from 'graphql/conversationMessagesQuery';

import ThreadedDiscussion from './ThreadedDiscussion';
import TopLevelDiscussion from './TopLevelDiscussion';

const DiscussionFeedItem = ({ conversation, meeting }) => {
  const { id, title, parentId } = conversation;

  return (
    <Query
      query={conversationMessagesQuery}
      variables={{ id }}
    >
      {({ loading, data, error }) => {
        if (loading) return null;
        if (error || !data.conversationMessages) return <div>{error}</div>;

        const { items, messageCount } = data.conversationMessages;
        const messages = items.map(i => i.message);

        const fwdProps = {
          conversation: {
            id,
            messages,
            messageCount,
            parentId,
            title,
          },
          meeting,
        };

        // This will be more sophisticated later, as we incorporate read / unread discussions
        return messageCount > 1
          ? <ThreadedDiscussion {...fwdProps} />
          : <TopLevelDiscussion {...fwdProps} />;
      }}
    </Query>

  );
};

DiscussionFeedItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
};

export default DiscussionFeedItem;
