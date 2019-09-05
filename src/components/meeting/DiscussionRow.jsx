import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Pluralize from 'pluralize';
import Truncate from 'react-truncate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faSparkles } from '@fortawesome/pro-solid-svg-icons';
import styled from '@emotion/styled/macro';

// import { getLocalUser } from 'utils/auth';

import AuthorDetails from 'components/shared/AuthorDetails';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderBottom: 'none',
  cursor: 'pointer',
  padding: '25px 30px',
  width: '100%',

  ':hover': {
    background: colors.lightestGrey,
  },
}));

const StyledLink = styled(Link)(({ theme: { colors } }) => ({
  // Setting !important because for some reason the 10th item's text was blue
  color: `${colors.mainText} !important`,
  textDecoration: 'none',

  ':hover': {
    color: colors.mainText,
    textDecoration: 'none',
  },

  ':last-of-type': {
    [Container]: {
      borderBottom: `1px solid ${colors.borderGrey}`,
    },
  },
}));

const ContextDisplay = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: '5px',
});

const ContextIcon = styled(FontAwesomeIcon)(({ isunread, theme: { colors } }) => ({
  color: isunread === 'true' ? colors.secondaryBlue : colors.grey5,
  fontSize: '14px',
  marginRight: '8px',
}));

const ContextLabel = styled.div(({ isUnread, theme: { colors } }) => ({
  color: isUnread ? colors.blue : colors.grey3,
  fontSize: '14px',
  fontWeight: isUnread ? 500 : 400,
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
  const { id: conversationId, lastMessage, messageCount, tags, title } = conversation;
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

  function showContext() {
    let displayText = '';
    let isUnread = false;
    if (tags.includes('new_discussion')) {
      displayText = 'New discussion';
      isUnread = true;
    } else if (tags.includes('new_messages')) {
      displayText = 'New messages';
      isUnread = true;
    } else {
      displayText = Pluralize('message', messageCount, true);
    }

    return (
      <ContextDisplay>
        <ContextIcon
          icon={displayText === 'New discussion' ? faSparkles : faComment}
          isunread={isUnread.toString()}
        />
        <ContextLabel isUnread={isUnread}>{displayText}</ContextLabel>
      </ContextDisplay>
    );
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
          size="small"
        />
      </Container>
    </StyledLink>
  );
};

DiscussionRow.propTypes = {
  conversation: PropTypes.object.isRequired,
};

export default DiscussionRow;
