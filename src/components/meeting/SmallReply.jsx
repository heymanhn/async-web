// HN: Could be DRY'ed up with <LargeReply /> in the future

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { matchCurrentUserId } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import RovalEditor from 'components/editor/RovalEditor';
import ContentHeader from './ContentHeader';
import ContentToolbar from './ContentToolbar';

const Container = styled.div(({ mode, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: mode === 'compose' ? colors.formGrey : 'initial',
  padding: '25px 30px',
  width: '100%',

  ':hover': {
    background: mode === 'display' ? colors.bgGrey : 'initial',
  },
}));

const AvatarWithMargin = styled(Avatar)(({ mode }) => ({
  flexShrink: 0,
  marginRight: '12px',
  opacity: mode === 'compose' ? 0.5 : 1,
}));

const MainContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const HeaderSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Details = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
});

const Author = styled.span(({ mode }) => ({
  fontSize: '14px',
  fontWeight: 600,
  marginRight: '20px',
  opacity: mode === 'compose' ? 0.5 : 1,
}));

const ReplyEditor = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '25px',
  fontWeight: 400,
  marginTop: '10px',

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

const SmallReply = ({
  author,
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
  <Container {...props}>
    <AvatarWithMargin src={author.profilePictureUrl} size={45} mode={mode} />
    <MainContainer>
      <HeaderSection>
        <Details>
          <Author mode={mode}>{author.fullName}</Author>
          {mode === 'display' && (
            <ContentHeader
              createdAt={createdAt}
              isEditable={matchCurrentUserId(author.id)}
              isEdited={createdAt !== updatedAt}
              onEdit={handleToggleEditMode}
            />
          )}
        </Details>
      </HeaderSection>
      <ReplyEditor
        initialValue={mode !== 'compose' ? message : null}
        mode={mode}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        contentType="modalReply"
      />
      {mode === 'display' && (
        <ContentToolbar
          contentType="modalReply"
          replyCount={0} // This will be introduced when nested replies are ready
        />
      )}
    </MainContainer>
  </Container>
);

SmallReply.propTypes = {
  author: PropTypes.object.isRequired,
  createdAt: PropTypes.number.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleToggleEditMode: PropTypes.func.isRequired,
  id: PropTypes.string,
  message: PropTypes.string,
  mode: PropTypes.string.isRequired,
  updatedAt: PropTypes.number.isRequired,
};

SmallReply.defaultProps = {
  id: null,
  message: null,
};

export default SmallReply;
