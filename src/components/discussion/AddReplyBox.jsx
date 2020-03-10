import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import updateDiscussionMutation from 'graphql/mutations/updateDiscussion';
import discussionQuery from 'graphql/queries/discussion';
import useCurrentUser from 'utils/hooks/useCurrentUser';
import useHover from 'utils/hooks/useHover';

import Avatar from 'components/shared/Avatar';
import { DiscussionContext } from 'utils/contexts';

import AvatarWithIcon from './AvatarWithIcon';

const Container = styled.div(
  ({ theme: { colors } }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    boxShadow: `0px 0px 3px ${colors.grey7}`,
    cursor: 'pointer',
    padding: '20px 25px',
  }),
  ({ isModal, theme: { colors } }) => {
    if (!isModal) return {};
    return {
      background: colors.bgGrey,
      border: 'none',
      borderTop: `1px solid ${colors.borderGrey}`,
      borderRadius: 0,
      borderBottomLeftRadius: '5px',
      borderBottomRightRadius: '5px',
      boxShadow: 'none',
    };
  }
);

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

const IndicatorLabel = styled.div(({ isResolved, theme: { colors } }) => ({
  color: isResolved ? colors.grey2 : colors.grey4,
  fontSize: isResolved ? '14px' : '16px',
  marginLeft: '5px',
}));

const ActionButton = styled.div(({ isModal, theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  background: isModal ? colors.white : colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '4px 15px',

  color: colors.mainText,
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
}));

const AddReplyBox = ({ handleClickReply, isComposing, ...props }) => {
  const { discussionId, isModal } = useContext(DiscussionContext);
  const { hover, ...hoverProps } = useHover(!isComposing);
  const currentUser = useCurrentUser();

  const [updateDiscussion] = useMutation(updateDiscussionMutation);
  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId },
  });

  if (loading || !data.discussion) return null;
  const { status } = data.discussion;

  const updateDiscussionStatus = state => {
    updateDiscussion({
      variables: {
        discussionId,
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
      <ActionButton
        isModal={isModal}
        onClick={() => updateDiscussionStatus(newStatus)}
      >
        {label}
      </ActionButton>
    );
  };

  return (
    <Container isModal={isModal} {...props} {...hoverProps}>
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
