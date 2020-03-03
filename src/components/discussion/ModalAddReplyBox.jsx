import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import updateDiscussionMutation from 'graphql/mutations/updateDiscussion';
import discussionQuery from 'graphql/queries/discussion';
import useCurrentUser from 'utils/hooks/useCurrentUser';
import useHover from 'utils/hooks/useHover';

import Avatar from 'components/shared/Avatar';
import { DiscussionContext } from 'utils/contexts';

const AddReplyContainer = styled.div(
  ({ hover, status, theme: { colors } }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
    color: colors.grey4,
    cursor: 'pointer',
    opacity: hover || status === 'resolved' ? 1 : 0.6,
    padding: '20px 25px',
    transition: 'opacity 0.2s',
  }),
  ({ isModal, theme: { colors } }) => {
    if (!isModal) return {};
    return {
      background: colors.grey7,
      border: 'none',
      borderTop: `1px solid ${colors.borderGrey}`,
      borderRadius: 0,
      borderBottomLeftRadius: '5px',
      borderBottomRightRadius: '5px',
      boxShadow: 'none',
    };
  }
);

const AddReplyItem = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const AddReplyLabel = styled.div({
  fontSize: '16px',
});

const ResolveAuthorContainter = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const ResolveDiscussionButton = styled.div(
  ({ isModal, theme: { colors } }) => ({
    display: 'flex',
    alignItems: 'center',
    background: colors.bgGrey,
    border: `1px solid ${isModal ? colors.white : colors.borderGrey}`,
    borderRadius: '5px',
    cursor: 'pointer',
    padding: '4px 15px',
  })
);

const ResolvedDiscussionIcon = styled(FontAwesomeIcon)(
  ({ theme: { colors } }) => ({
    position: 'absolute',
    marginTop: '10px',
    marginLeft: '10px',

    background: colors.white,
    color: colors.successGreen,
    fontSize: '18px',
    marginRight: '12px',
  })
);

const AvatarWithMargin = styled(Avatar)({
  flexShrink: 0,
  marginRight: '12px',
});

const Label = styled.div(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
}));

const ModalAddReplyBox = ({ handleClickReply, isComposing, ...props }) => {
  const { discussionId, modalRef } = useContext(DiscussionContext);
  const { hover, ...hoverProps } = useHover(!isComposing);
  const currentUser = useCurrentUser();

  const [updateDiscussion] = useMutation(updateDiscussionMutation);
  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId },
  });

  if (loading || !data.discussion) return null;
  const { status } = data.discussion;

  const updateDiscussionStatus = ({ currentState }) => {
    const input = {
      status: {
        state: currentState,
      },
    };

    updateDiscussion({ variables: { discussionId, input } });
  };

  return (
    <AddReplyContainer
      isModal={!!modalRef.current}
      status={status && status.state}
      hover={hover}
      {...props}
      {...hoverProps}
    >
      {status && status.state === 'resolved' ? (
        <React.Fragment>
          <AddReplyItem>
            <ResolveAuthorContainter>
              <AvatarWithMargin
                avatarUrl={status.author.profilePictureUrl}
                size={32}
              />
              <ResolvedDiscussionIcon icon="comment-check" />
            </ResolveAuthorContainter>
            <AddReplyLabel>{`${status.author.fullName} marked this discussion as resolved`}</AddReplyLabel>
          </AddReplyItem>
          <AddReplyItem>
            <ResolveDiscussionButton
              isModal={!!modalRef.current}
              onClick={() =>
                updateDiscussionStatus({ currentState: status.state })
              }
            >
              <Label>Re-open discussion</Label>
            </ResolveDiscussionButton>
          </AddReplyItem>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <AddReplyItem>
            <AvatarWithMargin
              avatarUrl={currentUser.profilePictureUrl}
              size={32}
            />
            <AddReplyLabel onClick={handleClickReply}>
              Add a reply...
            </AddReplyLabel>
          </AddReplyItem>
          <AddReplyItem>
            <ResolveDiscussionButton
              onClick={() => updateDiscussionStatus({ currentState: 'open' })}
            >
              <Label>Resolve discussion</Label>
            </ResolveDiscussionButton>
          </AddReplyItem>
        </React.Fragment>
      )}
    </AddReplyContainer>
  );
};

ModalAddReplyBox.propTypes = {
  handleClickReply: PropTypes.func.isRequired,
  isComposing: PropTypes.bool.isRequired,
};

export default ModalAddReplyBox;
