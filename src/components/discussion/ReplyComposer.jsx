import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/queries/currentUser';
import { getLocalUser } from 'utils/auth';
import useHover from 'utils/hooks/useHover';

import Avatar from 'components/shared/Avatar';
import DiscussionReply from './DiscussionReply';

const Container = styled.div(({ hover, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.bgGrey,
  color: colors.grey4,
  cursor: 'pointer',
  opacity: hover ? 1 : 0.6,
  padding: '20px 25px',
  transition: 'opacity 0.2s',
}));

const AvatarWithMargin = styled(Avatar)({
  flexShrink: 0,
  marginRight: '12px',
});

const AddReplyLabel = styled.div({
  fontSize: '16px',
});

const StyledDiscussionReply = styled(DiscussionReply)({
  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
});

const ReplyComposer = ({ discussionId, draft, documentId }) => {
  const [isComposing, setIsComposing] = useState(!!draft);
  function startComposing() { setIsComposing(true); }
  function stopComposing() { setIsComposing(false); }

  const { ...hoverProps } = useHover(isComposing);

  const { userId } = getLocalUser();
  const { loading, data } = useQuery(currentUserQuery, {
    variables: { id: userId },
  });

  if (loading || !data.user) return null;
  const currentUser = data.user;

  const addReplyBox = (
    <Container onClick={startComposing} {...hoverProps}>
      <AvatarWithMargin avatarUrl={currentUser.profilePictureUrl} size={32} />
      <AddReplyLabel>Add a reply...</AddReplyLabel>
    </Container>
  );

  return isComposing ? (
    <StyledDiscussionReply
      currentUser={currentUser}
      discussionId={discussionId}
      draft={draft}
      initialMode="compose"
      documentId={documentId}
      onCancel={stopComposing}
    />
  ) : addReplyBox;
};

ReplyComposer.propTypes = {
  discussionId: PropTypes.string.isRequired,
  draft: PropTypes.object,
  documentId: PropTypes.string.isRequired,
};

ReplyComposer.defaultProps = {
  draft: null,
};

export default ReplyComposer;
