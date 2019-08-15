/*
 * HN: This component is becoming increasingly similar to <ThreadedDiscussion />. Candidate for
 * DRYing up in the future
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { Link } from '@reach/router';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled/macro';

import conversationMessagesQuery from 'graphql/conversationMessagesQuery';

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

const TopLevelDiscussion = ({ conversation, meeting, ...props }) => {
  const { id, messageCount } = conversation;
  const { id: meetingId } = meeting;

  // Keeps track of any new replies the user added
  const [threadMessages, setThreadMessages] = useState([]);

  function updateThreadMessages(message) {
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

  const { loading, error, data } = useQuery(conversationMessagesQuery, {
    // Ensures that we get back all the messages in the discussion. Not ideal, but will do for now
    variables: { id, queryParams: { size: messageCount } },
  });
  if (loading) return null;
  if (error || !data.conversationMessages) return <div>{error}</div>;

  const { items } = data.conversationMessages;
  const messages = items.map(i => i.message);
  const isTruncated = messageCount > 4;

  // Make sure we remove the first message of the discussion from the replies list
  const repliesToShow = isTruncated ? messages.slice(1, 4) : messages.slice(1);

  if (!threadMessages.length && repliesToShow.length) {
    setThreadMessages(repliesToShow);
  }

  return (
    <Container {...props}>
      <FeedItemHeader
        conversation={conversation}
        meeting={meeting}
        numNewMessages={threadMessages.length}
      />
      <DiscussionReply
        conversationId={messages[0].conversationId}
        initialMode="display"
        meetingId={meetingId}
        message={messages[0]}
        replyCount={messageCount - 1}
        size="large"
        source="feed"
      />
      <Separator />
      {threadMessages.map(m => (
        <ReplyDisplay key={m.id}>
          <DiscussionReply
            afterSubmit={updateThreadMessages}
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
      {isTruncated ? (
        <StyledLink to={`/spaces/${meetingId}/conversations/${id}`}>
          <ViewEntireDiscussionButton>
            <StyledIcon icon={faComment} />
            <ButtonLabel>View entire discussion</ButtonLabel>
          </ViewEntireDiscussionButton>
        </StyledLink>
      ) : null}
      <ReplyComposer
        afterSubmit={updateThreadMessages}
        conversationId={messages[0].conversationId}
        markAsReadOnClick={false}
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
