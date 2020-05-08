/*
 * TODO (DISCUSSION V2): See if this can be re-combined with the AddReplyBox
 * for the discussion.
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import updateDiscussionMutation from 'graphql/mutations/updateDiscussion';
import discussionQuery from 'graphql/queries/discussion';
import useCurrentUser from 'hooks/shared/useCurrentUser';
import useHover from 'hooks/shared/useHover';
import { ThreadContext } from 'utils/contexts';

import Avatar from 'components/shared/Avatar';
import AvatarWithIcon from 'components/shared/AvatarWithIcon';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  background: colors.bgGrey,
  border: 'none',
  borderTop: `1px solid ${colors.borderGrey}`,
  borderRadius: 0,
  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
  boxShadow: 'none',
  cursor: 'pointer',
  padding: '20px 25px',
}));

const IndicatorContainer = styled.div(({ hover, isResolved }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  opacity: hover || isResolved ? 1 : 0.6,
  transition: 'opacity 0.2s',
}));

const AvatarWithMargin = styled(Avatar)({
  flexShrink: 0,
  marginRight: '12px',
});

const IndicatorLabel = styled.div(
  ({ isResolved, theme: { colors, fontProps } }) => ({
    ...fontProps({ size: isResolved ? 14 : 16 }),
    color: isResolved ? colors.grey2 : colors.grey4,
    marginLeft: '5px',
  })
);

const ActionButton = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14, weight: 500 }),

  display: 'flex',
  alignItems: 'center',
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '4px 15px',

  color: colors.mainText,
}));

const AddReplyBox = ({ handleClickReply, isComposing, ...props }) => {
  const { threadId } = useContext(ThreadContext);
  const { hover, ...hoverProps } = useHover(!isComposing);
  const currentUser = useCurrentUser();

  const [updateDiscussion] = useMutation(updateDiscussionMutation);
  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId: threadId },
  });

  if (loading || !data.discussion) return null;
  const { status } = data.discussion;

  const updateDiscussionStatus = state => {
    updateDiscussion({
      variables: {
        discussionId: threadId,
        input: { status: { state } },
      },
    });
  };

  const { state, author } = status || {};
  const newStatus = state || 'open';
  const isResolved = newStatus === 'resolved';

  // Either an indication that the discussion is resolved, or a call-out for
  // the current user to add a reply
  const renderIndicator = () => {
    const avatar = isResolved ? (
      <AvatarWithIcon
        avatarUrl={status.author.profilePictureUrl}
        icon="comment-check"
      />
    ) : (
      <AvatarWithMargin avatarUrl={currentUser.profilePictureUrl} size={32} />
    );

    const message = isResolved
      ? `${author.fullName} marked this discussion as resolved`
      : 'Add a reply...';

    const clickHandler = isResolved ? undefined : handleClickReply;

    return (
      <IndicatorContainer hover={hover} isResolved={isResolved}>
        {avatar}
        <IndicatorLabel isResolved={isResolved} onClick={clickHandler}>
          {message}
        </IndicatorLabel>
      </IndicatorContainer>
    );
  };

  const renderActionButton = () => {
    const label = isResolved ? 'Re-open discussion' : 'Resolve discussion';

    return (
      <ActionButton onClick={() => updateDiscussionStatus(newStatus)}>
        {label}
      </ActionButton>
    );
  };

  return (
    <Container {...props} {...hoverProps}>
      {renderIndicator()}
      {renderActionButton()}
    </Container>
  );
};

AddReplyBox.propTypes = {
  handleClickReply: PropTypes.func.isRequired,
  isComposing: PropTypes.bool.isRequired,
};

export default AddReplyBox;
