import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import withHover from 'utils/withHover';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ hover, theme: { colors } }) => ({
  background: hover ? colors.lightestBlue : colors.white,
  borderBottom: `1px solid ${colors.borderGrey}`,
  cursor: 'pointer',
  padding: '20px 30px',
  width: '460px',

  ':last-of-type': {
    borderBottom: 'none',
  },
}));

const RepliesDisplay = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '10px',
}));

const DiscussionTitle = styled.div({
  fontSize: '18px',
  marginBottom: '10px',
});

const MessagePreview = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
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

const MessageTimestamp = styled.div(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '14px',
  marginTop: '2px',
}));

const DiscussionsListCell = ({
  lastMessage,
  messageCount,
  onSelectConversation,
  title,
  ...props
}) => {
  const replyCount = messageCount - 1;
  // const { messages } = lastMessage;
  const author = {};

  return (
    <Container onClick={onSelectConversation} {...props}>
      {replyCount > 0 && <RepliesDisplay>{Pluralize('reply', replyCount, true)}</RepliesDisplay>}
      <DiscussionTitle>{title}</DiscussionTitle>
      <MessagePreview>The quick brown fox jumps over the lazy dog</MessagePreview>
      <MessageDetails>
        <StyledAvatar src={author.profilePictureUrl} size={24} />
        <MessageAuthor>Grace Hopper</MessageAuthor>
        <MessageTimestamp>2 days ago</MessageTimestamp>
      </MessageDetails>
    </Container>
  );
};

DiscussionsListCell.propTypes = {
  hover: PropTypes.bool.isRequired,
  lastMessage: PropTypes.object.isRequired,
  messageCount: PropTypes.number.isRequired,
  onSelectConversation: PropTypes.func.isRequired,
  title: PropTypes.string,
};

DiscussionsListCell.defaultProps = {
  title: 'Untitled Discussion',
};

export default withHover(DiscussionsListCell);
