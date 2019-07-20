// HN: Could be DRY'ed up with <SmallReply /> in the future

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import withHover from 'utils/withHover';
import { matchCurrentUserId } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import RovalEditor from 'components/editor/RovalEditor';
import ContentHeader from './ContentHeader';
import ContentToolbar from './ContentToolbar';
import HoverMenu from './HoverMenu';

const MessageSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  margin: '25px 30px',
});

const Header = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const AuthorSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const AvatarWithMargin = styled(Avatar)(({ mode }) => ({
  marginRight: '12px',
  opacity: mode === 'compose' ? 0.5 : 1,
}));

const Details = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Author = styled.div({
  fontWeight: 600,
  fontSize: '18px',
});

const TopicEditor = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '25px',
  fontWeight: 400,
  marginTop: '20px',

  // HN: opportunity to DRY these up later once we find a pattern of typography
  // across different editor use cases
  'div:not(:first-of-type)': {
    marginTop: '1em',
  },

  h1: {
    fontSize: '28px',
    fontWeight: 600,
    marginTop: '1.4em',
  },

  h2: {
    fontSize: '24px',
    fontWeight: 500,
    marginTop: '1.3em',
  },

  h3: {
    fontSize: '20px',
    fontWeight: 500,
    marginTop: '1.2em',
  },
});

const StyledHoverMenu = styled(HoverMenu)({
  position: 'absolute',
  right: '30px',
});

const LargeReply = ({
  author,
  conversationId,
  handleCancel,
  handleFocusCurrentMessage,
  handleSubmit,
  handleToggleEditMode,
  hover,
  message,
  mode,
  replyCount,
  ...props
}) => {
  const { body, createdAt, updatedAt } = message || {};
  return (
    <React.Fragment>
      <MessageSection onClick={handleFocusCurrentMessage} {...props}>
        <Header>
          <AuthorSection>
            <AvatarWithMargin src={author.profilePictureUrl} size={45} />
            <Details>
              <Author>{author.fullName}</Author>
              {mode === 'display' && (
                <ContentHeader createdAt={createdAt} isEdited={createdAt !== updatedAt} />
              )}
            </Details>
          </AuthorSection>
          <StyledHoverMenu
            bgMode="grey"
            isOpen={hover && mode === 'display'}
            onEdit={handleToggleEditMode}
            showEditButton={matchCurrentUserId(author.id)}
          />
        </Header>
        <TopicEditor
          initialValue={body.payload}
          mode={mode}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          contentType="modalTopic"
        />
      </MessageSection>
      {mode === 'display' && (
        <ContentToolbar
          contentType="modalTopic"
          conversationId={conversationId}
          message={message}
          replyCount={replyCount}
        />
      )}
    </React.Fragment>
  );
};

LargeReply.propTypes = {
  author: PropTypes.object.isRequired,
  conversationId: PropTypes.string.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFocusCurrentMessage: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleToggleEditMode: PropTypes.func.isRequired,
  hover: PropTypes.bool.isRequired,
  message: PropTypes.object,
  mode: PropTypes.string.isRequired,
  replyCount: PropTypes.number.isRequired,
};

LargeReply.defaultProps = {
  message: null,
};

export default withHover(LargeReply);
