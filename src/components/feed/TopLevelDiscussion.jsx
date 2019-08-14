import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import DiscussionReply from 'components/discussion/DiscussionReply';
import ReplyComposer from 'components/discussion/ReplyComposer';
import FeedItemHeader from './FeedItemHeader';

const Container = styled.div(({ theme: { colors, discussionWidth } }) => ({
  background: colors.white,
  border: `1px solid ${colors.grey6}`,
  borderRadius: '5px',
  boxShadow: `0px 1px 3px ${colors.buttonGrey}`,
  cursor: 'default',
  margin: '25px 0',
  width: discussionWidth,
}));

const Separator = styled.hr(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  margin: 0,
}));

const ReplyDisplay = styled.div({
  ':last-of-type': {
    [Separator]: {
      display: 'none',
    },
  },
});

const TopLevelDiscussion = ({ conversation, meeting, ...props }) => {
  const { messages } = conversation;
  const { id: meetingId } = meeting;

  // Keep track of any new replies the user added
  const [newMessages, setNewMessages] = useState([]);

  function updateNewMessages(message) {
    const index = newMessages.findIndex(m => m.id === message.id);
    if (index < 0) {
      setNewMessages([...newMessages, message]);
    } else {
      setNewMessages([
        ...newMessages.slice(0, index),
        message,
        ...newMessages.slice(index + 1),
      ]);
    }
  }

  return (
    <Container {...props}>
      <FeedItemHeader
        conversation={conversation}
        meeting={meeting}
        numNewMessages={newMessages.length}
      />
      <DiscussionReply
        conversationId={messages[0].conversationId}
        initialMode="display"
        meetingId={meetingId}
        message={messages[0]}
        replyCount={0}
        size="large"
        source="feed"
      />
      <Separator />
      {newMessages.map(m => (
        <ReplyDisplay key={m.id}>
          <DiscussionReply
            afterSubmit={updateNewMessages}
            conversationId={m.conversationId}
            initialMode="display"
            meetingId={meetingId}
            message={m}
            replyCount={m.replyCount || 0}
            source="feed"
          />
          <Separator />
        </ReplyDisplay>
      ))}
      <ReplyComposer
        afterSubmit={updateNewMessages}
        conversationId={messages[0].conversationId}
        meetingId={meetingId}
        roundedCorner
      />
    </Container>
  );
};

TopLevelDiscussion.propTypes = {
  conversation: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
};

export default TopLevelDiscussion;
