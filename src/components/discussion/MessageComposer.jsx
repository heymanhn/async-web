import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/queries/currentUser';
import { getLocalUser } from 'utils/auth';
import DiscussionMessage from 'components/discussion/DiscussionMessage';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  color: colors.grey4,
  cursor: 'pointer',
  padding: '20px 30px',
}));

const AvatarWithMargin = styled(Avatar)({
  flexShrink: 0,
  marginRight: '12px',
});

const AddReplyLabel = styled.div({
  fontSize: '16px',
});

const MessageComposer = ({ conversationId }) => {
  const [isComposing, setIsComposing] = useState(false);
  function startComposing() { setIsComposing(true); }
  function stopComposing() { setIsComposing(false); }

  const { userId } = getLocalUser();
  const { loading, data } = useQuery(currentUserQuery, {
    variables: { id: userId },
  });

  if (loading || !data.user) return null;
  const currentUser = data.user;

  const addReplyBox = (
    <Container onClick={startComposing}>
      <AvatarWithMargin src={currentUser.profilePictureUrl} size={32} />
      <AddReplyLabel>Add a reply...</AddReplyLabel>
    </Container>
  );

  return isComposing ? (
    <DiscussionMessage
      currentUser={currentUser}
      conversationId={conversationId}
      initialMode="compose"
      onCancel={stopComposing}
    />
  ) : addReplyBox;
};

MessageComposer.propTypes = {
  conversationId: PropTypes.string.isRequired,
};

export default MessageComposer;
