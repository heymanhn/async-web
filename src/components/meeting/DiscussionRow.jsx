import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Pluralize from 'pluralize';
import Truncate from 'react-truncate';
import styled from '@emotion/styled/macro';

// import { getLocalUser } from 'utils/auth';

import AuthorDetails from 'components/shared/AuthorDetails';

const Container = styled.div(({ hover, theme: { colors } }) => ({
  background: hover ? colors.bgGrey : colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderBottom: 'none',
  cursor: 'pointer',
  padding: '25px 30px',
  width: '100%',
}));

const StyledLink = styled(Link)(({ theme: { colors } }) => ({
  color: colors.mainText,
  textDecoration: 'none',

  ':hover': {
    color: colors.mainText,
    textDecoration: 'none',
  },

  ':last-of-type': {
    color: colors.mainText,
    textDecoration: 'none',

    [Container]: {
      borderBottom: `1px solid ${colors.borderGrey}`,
    },
  },
}));

const ContextDisplay = styled.div(({ isUnread, theme: { colors } }) => ({
  color: isUnread ? colors.blue : colors.grey3,
  fontSize: '14px',
  fontWeight: isUnread ? 500 : 400,
  marginBottom: '5px',
}));

const DiscussionTitle = styled.div(({ isUnread }) => ({
  fontSize: '18px',
  fontWeight: isUnread ? 500 : 400,
  marginBottom: '10px',
}));

const MessagePreview = styled.div(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '14px',
  lineHeight: '24px',
  marginBottom: '15px',
}));

const DiscussionRow = ({ conversation, ...props }) => {
  const { id: conversationId, lastMessage, messageCount, title } = conversation;
  const { author, body, createdAt } = lastMessage;
  const { text } = body;
  const messagePreview = text ? text.replace(/\n/, ' ') : null;
  // const { userId } = getLocalUser();

  /*
   * TODO: Re-implement later
   *
   * Conditions that indicate unread:
   * 1. no unreadCounts from the current user (user hasn't seen this thread at all)
   * 2. user has an unreadCount where count > 0 (user hasn't read `count` messages)
   *
   * Return -1 if user hasn't read anything, or the number of unread messages
   */
  // function unreadMessageCount() {
  //   const userUnreadRecord = unreadCounts.find(c => c.userId === userId);
  //   return userUnreadRecord ? userUnreadRecord.count : -1;
  // }

  // TODO: unread states
  function showContext() {
    let displayText = '';
    if (messageCount <= 1) {
      displayText = 'New discussion';
    } else {
      displayText = Pluralize('message', messageCount, true);
    }

    return <ContextDisplay>{displayText}</ContextDisplay>;
  }

  return (
    <StyledLink to={`/discussions/${conversationId}`}>
      <Container {...props}>
        {showContext()}
        <DiscussionTitle>{title || 'Untitled Discussion'}</DiscussionTitle>
        {messagePreview && (
          <MessagePreview>
            <Truncate lines={2}>
              {messagePreview}
            </Truncate>
          </MessagePreview>
        )}
        <AuthorDetails
          author={author}
          createdAt={createdAt}
          mode="display"
        />
      </Container>
    </StyledLink>
  );
};

DiscussionRow.propTypes = {
  conversation: PropTypes.object.isRequired,
};

export default DiscussionRow;
