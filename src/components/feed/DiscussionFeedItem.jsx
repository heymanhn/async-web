import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';

import conversationQuery from 'graphql/conversationQuery';
import { getLocalUser } from 'utils/auth';

import ThreadedDiscussion from './ThreadedDiscussion';
import TopLevelDiscussion from './TopLevelDiscussion';

const DiscussionFeedItem = ({ conversation, meeting }) => {
  const { id, messageCount, parentId, title } = conversation;
  const { loading, data, error } = useQuery(conversationQuery, {
    variables: { conversationId: id },
  });
  if (loading) return null;
  if (error || !data.conversation) return <div>{error}</div>;

  const unreadCounts = data.conversation.unreadCounts || [];
  const { userId } = getLocalUser();
  const userUnreadRecord = unreadCounts.find(c => c.userId === userId);

  const fwdProps = {
    conversation: {
      id,
      messageCount,
      parentId,
      title,
      userUnreadRecord,
    },
    meeting,
  };

  return (messageCount === 1 || !userUnreadRecord)
    ? <TopLevelDiscussion {...fwdProps} />
    : <ThreadedDiscussion {...fwdProps} />;
};

DiscussionFeedItem.propTypes = {
  conversation: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
};

export default DiscussionFeedItem;
