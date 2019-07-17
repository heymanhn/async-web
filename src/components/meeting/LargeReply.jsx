// HN: Could be DRY'ed up with <SmallReply /> in the future

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import { matchCurrentUserId } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import RovalEditor from 'components/editor/RovalEditor';
import ContentHeader from './ContentHeader';
import ContentToolbar from './ContentToolbar';

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

const Author = styled.span({
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

const LargeReply = ({
  author,
  conversationId,
  createdAt,
  handleCancel,
  handleSubmit,
  id,
  message,
  mode,
  handleToggleEditMode,
  updatedAt,
  ...props
}) => (
  <React.Fragment>
    <MessageSection {...props}>
      <Header>
        <AuthorSection>
          <AvatarWithMargin src={author.profilePictureUrl} size={45} />
          <Details>
            <Author>{author.fullName}</Author>
            {mode === 'display' && (
              <ContentHeader
                createdAt={createdAt}
                isEditable={matchCurrentUserId(author.id)}
                isEdited={createdAt !== updatedAt}
                onEdit={handleToggleEditMode}
              />
            )}
          </Details>
        </AuthorSection>
      </Header>
      <TopicEditor
        initialValue={message}
        mode={mode}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        contentType="modalTopic"
      />
    </MessageSection>
    {mode === 'display' && (
      <ContentToolbar
        contentType="modalTopic"
        replyCount={0}
      />
    )}
  </React.Fragment>
);

LargeReply.propTypes = {
  author: PropTypes.object.isRequired,
  conversationId: PropTypes.string.isRequired,
  createdAt: PropTypes.number.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleToggleEditMode: PropTypes.func.isRequired,
  id: PropTypes.string,
  message: PropTypes.string,
  mode: PropTypes.string.isRequired,
  updatedAt: PropTypes.number.isRequired,
};

LargeReply.defaultProps = {
  id: null,
  message: null,
};

export default LargeReply;
