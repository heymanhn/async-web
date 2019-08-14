import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import Pluralize from 'pluralize';
import Moment from 'react-moment';
import Truncate from 'react-truncate';
import styled from '@emotion/styled';

import conversationQuery from 'graphql/conversationQuery';
import { getLocalUser } from 'utils/auth';
import withHover from 'utils/withHover';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ hover, isSelected, theme: { colors } }) => ({
  background: (hover || isSelected) ? colors.lightestBlue : colors.white,
  borderBottom: `1px solid ${colors.borderGrey}`,
  cursor: 'pointer',
  padding: '18px 30px 20px',
  width: '458px',

  ':last-of-type': {
    borderBottom: 'none',
  },
}), ({ isUnread, theme: { colors } }) => {
  if (!isUnread) return {};

  return {
    borderLeft: `8px solid ${colors.blue}`,
    paddingLeft: '22px',
  };
});

const RepliesDisplay = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '8px',
}));

const DiscussionTitle = styled.div({
  fontSize: '18px',
  marginBottom: '5px',
});

const MessagePreview = styled.div(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '14px',
  lineHeight: '22px',
  marginBottom: '20px',
}));

const MessageDetails = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const StyledAvatar = styled(Avatar)({
  flexShrink: 0,
  marginRight: '8px',
});

const MessageAuthor = styled.div({
  fontSize: '14px',
  fontWeight: 600,
  marginRight: '15px',
});

const MessageTimestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '14px',
  marginTop: '2px',
}));

const DiscussionsListCell = ({
  conversation,
  isSelected,
  onScrollTo,
  onSelectConversation,
  ...props
}) => {
  const { id: conversationId, lastMessage, meetingId, messageCount, title } = conversation;
  const replyCount = messageCount - 1;
  const { author, body, createdAt } = lastMessage;
  const { text } = body;
  const messagePreview = text ? text.replace(/\n/, ' ') : null;

  const handleSelectConversation = (event) => {
    event.stopPropagation();
    onSelectConversation(conversationId);
  };

  // Using new React Hooks API to scroll to this cell if it's selected and not visible
  // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const cellRef = useCallback((element) => {
    if (element && isSelected) onScrollTo(element);
  }, [isSelected, onScrollTo]);

  const { loading, data } = useQuery(conversationQuery, {
    variables: { meetingId, conversationId },
  });
  if (loading || !data.conversation) return null;

  const unreadCounts = data.conversation.unreadCounts || [];
  const { userId } = getLocalUser();

  /* Conditions that indicate unread:
   * 1. no unreadCounts from the current user (user hasn't seen this thread at all)
   * 2. user has an unreadCount where count > 0 (user hasn't read `count` messages)
   *
   * Return -1 if user hasn't read anything, or the number of unread messages
   */
  function unreadMessageCount() {
    const userUnreadRecord = unreadCounts.find(c => c.userId === userId);
    return userUnreadRecord ? userUnreadRecord.count : -1;
  }

  return (
    <Container
      ref={cellRef}
      isSelected={isSelected}
      isUnread={unreadMessageCount() !== 0}
      onClick={handleSelectConversation}
      {...props}
    >
      {replyCount > 0 && <RepliesDisplay>{Pluralize('reply', replyCount, true)}</RepliesDisplay>}
      <DiscussionTitle>{title || 'Untitled Discussion'}</DiscussionTitle>
      {messagePreview && (
        <MessagePreview>
          <Truncate lines={2}>
            {messagePreview}
          </Truncate>
        </MessagePreview>
      )}
      <MessageDetails>
        <StyledAvatar src={author.profilePictureUrl} size={24} />
        <MessageAuthor>{author.fullName}</MessageAuthor>
        <MessageTimestamp fromNow parse="X">{createdAt}</MessageTimestamp>
      </MessageDetails>
    </Container>
  );
};

DiscussionsListCell.propTypes = {
  conversation: PropTypes.object.isRequired,
  hover: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onScrollTo: PropTypes.func,
  onSelectConversation: PropTypes.func.isRequired,
};

DiscussionsListCell.defaultProps = {
  onScrollTo: () => {},
};

export default withHover(DiscussionsListCell);
