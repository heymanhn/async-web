import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import Moment from 'react-moment';
import styled from '@emotion/styled';

import withHover from 'utils/withHover';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ hover, isSelected, theme: { colors } }) => ({
  background: (hover || isSelected) ? colors.lightestBlue : colors.white,
  borderBottom: `1px solid ${colors.borderGrey}`,
  cursor: 'pointer',
  padding: '18px 30px 20px',
  width: '460px',

  ':last-of-type': {
    borderBottom: 'none',
  },
}));

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
  conversationId,
  lastMessage,
  messageCount,
  onSelectConversation,
  title,
  ...props
}) => {
  const replyCount = messageCount - 1;
  const { author, body, createdAt } = lastMessage;
  const { text } = body;
  const messagePreview = text ? text.replace(/\n/, ' ') : null;

  const handleSelectConversation = (event) => {
    event.stopPropagation();
    onSelectConversation(conversationId);
  };

  return (
    <Container onClick={handleSelectConversation} {...props}>
      {replyCount > 0 && <RepliesDisplay>{Pluralize('reply', replyCount, true)}</RepliesDisplay>}
      <DiscussionTitle>{title || 'Untitled Discussion'}</DiscussionTitle>
      {messagePreview && <MessagePreview>{messagePreview}</MessagePreview>}
      <MessageDetails>
        <StyledAvatar src={author.profilePictureUrl} size={24} />
        <MessageAuthor>{author.fullName}</MessageAuthor>
        <MessageTimestamp fromNow parse="X">{createdAt}</MessageTimestamp>
      </MessageDetails>
    </Container>
  );
};

DiscussionsListCell.propTypes = {
  conversationId: PropTypes.string.isRequired,
  hover: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  lastMessage: PropTypes.object.isRequired,
  messageCount: PropTypes.number.isRequired,
  onSelectConversation: PropTypes.func.isRequired,
  title: PropTypes.string,
};

DiscussionsListCell.defaultProps = {
  title: 'Untitled Discussion',
};

export default withHover(DiscussionsListCell);
