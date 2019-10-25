import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/queries/currentUser';
import { getLocalUser } from 'utils/auth';
import useHover from 'utils/hooks/useHover';

import DiscussionMessage from 'components/discussion/DiscussionMessage';
import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ hover, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: `0px 0px 3px ${colors.grey7}`,
  color: colors.grey4,
  cursor: 'pointer',
  opacity: hover ? 1 : 0.6,
  padding: '20px 30px',
  transition: 'opacity 0.2s',
}));

const AvatarWithMargin = styled(Avatar)({
  flexShrink: 0,
  marginRight: '12px',
});

const AddReplyLabel = styled.div({
  fontSize: '16px',
});

const MessageComposer = ({ conversationId, draft, meetingId }) => {
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
    <DiscussionMessage
      currentUser={currentUser}
      conversationId={conversationId}
      draft={draft}
      initialMode="compose"
      meetingId={meetingId}
      onCancel={stopComposing}
    />
  ) : addReplyBox;
};

MessageComposer.propTypes = {
  conversationId: PropTypes.string.isRequired,
  draft: PropTypes.object,
  meetingId: PropTypes.string.isRequired,
};

MessageComposer.defaultProps = {
  draft: null,
};

export default MessageComposer;
