import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled/macro';

import DiscussionReply from 'components/discussion/DiscussionReply';
import ReplyComposer from 'components/discussion/ReplyComposer';
import FeedItemHeader from './FeedItemHeader';

// TODO(HN): DRY up these component styles in the future, with TopLevelDiscussion
const Container = styled.div(({ theme: { colors, discussionWidth } }) => ({
  background: colors.white,
  border: `1px solid ${colors.grey6}`,
  borderRadius: '5px',
  boxShadow: `0px 1px 3px ${colors.buttonGrey}`,
  cursor: 'default',
  margin: '25px 0',
  width: discussionWidth,
}));

const StyledLink = styled(Link)({
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'none',
  },
});

const ViewEntireDiscussionButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.formGrey,
  borderBottom: `1px solid ${colors.borderGrey}`,
  padding: '15px 30px',
}));

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '18px',
  marginRight: '10px',
}));

const ButtonLabel = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
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

const ThreadedDiscussion = ({ conversation, meeting, ...props }) => {
  const {
    id: conversationId,
    messageCount,
    messages,
  } = conversation;
  const { id: meetingId } = meeting;
  const isTruncated = messageCount > 3;
  const initialMessagesToShow = isTruncated ? messages.slice(messageCount - 3) : messages;

  // Manually keep track of any new replies the user added
  const [threadMessages, setThreadMessages] = useState(initialMessagesToShow);

  function updateMessageInThread(message) {
    const index = threadMessages.findIndex(m => m.id === message.id);
    if (index < 0) {
      setThreadMessages([...threadMessages, message]);
    } else {
      setThreadMessages([
        ...threadMessages.slice(0, index),
        message,
        ...threadMessages.slice(index + 1),
      ]);
    }
  }

  return (
    <Container {...props}>
      <FeedItemHeader
        conversation={conversation}
        meeting={meeting}
        numNewMessages={threadMessages.length - initialMessagesToShow.length}
      />
      {isTruncated ? (
        <StyledLink to={`/spaces/${meetingId}/conversations/${conversationId}`}>
          <ViewEntireDiscussionButton>
            <StyledIcon icon={faComment} />
            <ButtonLabel>View entire discussion</ButtonLabel>
          </ViewEntireDiscussionButton>
        </StyledLink>
      ) : null}
      {threadMessages.map(m => (
        <ReplyDisplay key={m.id}>
          <DiscussionReply
            afterSubmit={updateMessageInThread}
            conversationId={m.conversationId}
            initialMode="display"
            meetingId={meetingId}
            message={m}
            replyCount={m.replyCount || 0}
          />
          <Separator />
        </ReplyDisplay>
      ))}
      <ReplyComposer
        afterSubmit={updateMessageInThread}
        conversationId={conversationId}
        meetingId={meetingId}
        roundedCorner
      />
    </Container>
  );
};

ThreadedDiscussion.propTypes = {
  conversation: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
};

export default ThreadedDiscussion;
