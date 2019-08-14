import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
  padding: '25px 30px',
}));

const MetadataRow = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ReplyCountDisplay = styled.div(({ isUnread, theme: { colors } }) => ({
  color: isUnread ? colors.blue : colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
}));

const StyledLink = styled(Link)({
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'none',
  },
});

const MeetingSpaceLabel = styled.div(({ theme: { colors } }) => ({
  background: colors.borderGrey,
  borderRadius: '5px',
  color: colors.mainText,
  fontSize: '12px',
  fontWeight: 500,
  padding: '3px 12px',
  textDecoration: 'none',
}));

const ThreadLabel = styled.span(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontWeight: 400,
  paddingRight: '5px',
}));

const DiscussionTitle = styled.span(({ isLink, theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '20px',
  fontWeight: 500,
  width: '100%',

  ':hover': {
    color: isLink ? colors.blue : 'initial',
  },
}));

const FeedItemHeader = ({ conversation, meeting, numNewMessages, ...props }) => {
  const {
    id: conversationId,
    messageCount,
    title: conversationTitle,
    parentId,
    userUnreadRecord,
  } = conversation;
  const { id: meetingId, title: meetingTitle } = meeting;
  const totalMessageCount = messageCount + numNewMessages;
  const isRootConversation = !parentId;

  const discussionTitle = (
    <DiscussionTitle isLink={isRootConversation}>
      {!isRootConversation ? <ThreadLabel>Thread:</ThreadLabel> : undefined}
      {conversationTitle || 'Untitled Discussion'}
    </DiscussionTitle>
  );

  function showReplyCountDisplay() {
    const isUnread = !userUnreadRecord || userUnreadRecord.count !== 0;

    let displayText = '';
    if (!userUnreadRecord) {
      displayText = 'New discussion';
    } else if (userUnreadRecord.count > 0) {
      displayText = Pluralize('new reply', userUnreadRecord.count, true);
    } else if (totalMessageCount === 1) {
      displayText = 'no replies';
    } else {
      displayText = Pluralize('reply', totalMessageCount, true);
    }

    return <ReplyCountDisplay isUnread={isUnread}>{displayText}</ReplyCountDisplay>;
  }

  return (
    <Container {...props}>
      <MetadataRow>
        {showReplyCountDisplay()}
        <StyledLink to={`/spaces/${meetingId}`}>
          <MeetingSpaceLabel>
            {meetingTitle}
          </MeetingSpaceLabel>
        </StyledLink>
      </MetadataRow>
      {isRootConversation ? (
        <StyledLink to={`/spaces/${meetingId}/conversations/${conversationId}`}>
          {discussionTitle}
        </StyledLink>
      ) : discussionTitle}
    </Container>
  );
};

FeedItemHeader.propTypes = {
  conversation: PropTypes.object.isRequired,
  meeting: PropTypes.object.isRequired,
  numNewMessages: PropTypes.number,
};

FeedItemHeader.defaultProps = {
  numNewMessages: 0,
};

export default FeedItemHeader;
