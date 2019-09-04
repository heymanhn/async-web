// HN: Could be DRY'ed up with <LargeReply /> in the future
import React from 'react';
import PropTypes from 'prop-types';

// Because hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import styled from '@emotion/styled';

import conversationQuery from 'graphql/queries/conversation';
import { getLocalUser } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import RovalEditor from 'components/editor/RovalEditor';

const Container = styled.div(({ isUnread, mode, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',

  background: mode === 'compose' ? colors.formGrey : 'initial',
  borderLeft: isUnread ? `6px solid ${colors.blue}` : 'none',
  padding: isUnread ? '25px 30px 25px 24px' : '25px 30px',
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
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
});

const Details = styled.div({
  display: 'flex',
  alignItems: 'baseline',
});

const Author = styled.div(({ mode }) => ({
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
  conversationId,
  handleCancel,
  handleFocusCurrentMessage,
  handleSubmit,
  handleToggleEditMode,
  hover,
  message,
  mode,
  replyCount,
  source,
  ...props
}) => {
  const { body, childConversationId } = message || {};
  let isUnread = false;

  const [getChildConversation, { data }] = useLazyQuery(conversationQuery, {
    variables: { id: childConversationId, queryParams: {} },
  });
  if (source === 'discussion' && childConversationId && !data) getChildConversation();
  if (data && data.conversation) {
    const unreadCounts = data.conversation.unreadCounts || [];
    const { userId } = getLocalUser();
    const userUnreadRecord = unreadCounts.find(c => c.userId === userId);

    if (!userUnreadRecord || userUnreadRecord.count) isUnread = true;
  }

  return (
    <Container
      isUnread={isUnread}
      mode={mode}
      onClick={handleFocusCurrentMessage}
      {...props}
    >
      <AvatarWithMargin src={author.profilePictureUrl} size={45} mode={mode} />
      <MainContainer>
        <HeaderSection>
          <Details>
            <Author mode={mode}>{author.fullName}</Author>
          </Details>
        </HeaderSection>
        <ReplyEditor
          initialHeight={120}
          initialValue={mode !== 'compose' ? body.payload : null}
          mode={mode}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          contentType="smallReply"
        />
      </MainContainer>
    </Container>
  );
};

SmallReply.propTypes = {
  author: PropTypes.object.isRequired,
  conversationId: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
  handleFocusCurrentMessage: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleToggleEditMode: PropTypes.func.isRequired,
  hover: PropTypes.bool,
  message: PropTypes.object,
  mode: PropTypes.string.isRequired,
  replyCount: PropTypes.number,
  source: PropTypes.string.isRequired,
};

SmallReply.defaultProps = {
  conversationId: null,
  hover: false,
  message: null,
  replyCount: null,
};

export default SmallReply;
