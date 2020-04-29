import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import updateDiscussionMutation from 'graphql/mutations/updateDiscussion';
import discussionQuery from 'graphql/queries/discussion';
import useCurrentUser from 'hooks/shared/useCurrentUser';
import useMessageDraftMutations from 'hooks/message/useMessageDraftMutations';
import { MessageContext } from 'utils/contexts';

import Avatar from 'components/shared/Avatar';
import AvatarWithIcon from 'components/shared/AvatarWithIcon';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  height: '65px',
  margin: '0 auto',
  padding: '0 30px',
  width: discussionViewport,
}));

const IndicatorContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const AvatarWithMargin = styled(Avatar)({
  flexShrink: 0,
  marginRight: '12px',
});

const Label = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '12px',
}));

const ReplyButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  background: colors.altBlue,
  borderRadius: '5px',
  color: colors.white,
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 500,
  height: '25px',
  marginLeft: '8px',
  padding: '0 20px',
}));

const ActionButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  height: '25px',
  marginLeft: '8px',
  padding: '0 20px',

  color: colors.grey3,
  fontSize: '12px',
  fontWeight: 500,
}));

const ActionsBar = ({
  parentType,
  handleClickReply,
  handleClickDiscard,
  ...props
}) => {
  const { draft, parentId } = useContext(MessageContext);
  const currentUser = useCurrentUser();
  const { handleDeleteMessageDraft } = useMessageDraftMutations();

  // Reminder: A thread is just a discussion with a different UI
  const [updateDiscussion] = useMutation(updateDiscussionMutation);
  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId: parentId },
  });

  if (loading || !data.discussion) return null;
  const { status } = data.discussion;

  const updateDiscussionStatus = state => {
    updateDiscussion({
      variables: {
        discussionId: parentId,
        input: { status: { state } },
      },
    });
  };

  const handleClickDiscardWrapper = () => {
    handleDeleteMessageDraft();
    handleClickDiscard();
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
      <AvatarWithMargin avatarUrl={currentUser.profilePictureUrl} size={24} />
    );

    const message = isResolved ? (
      <Label>{`${author.fullName} marked this ${parentType} as resolved`}</Label>
    ) : (
      <>
        <Label>Shift + R to </Label>
        <ReplyButton onClick={handleClickReply}>
          {draft ? 'Continue Draft' : 'Reply'}
        </ReplyButton>
        {draft && (
          <ActionButton onClick={handleClickDiscardWrapper}>
            Discard
          </ActionButton>
        )}
      </>
    );

    return (
      <IndicatorContainer isResolved={isResolved}>
        {avatar}
        {message}
      </IndicatorContainer>
    );
  };

  const renderActionButton = () => {
    const label = `${isResolved ? 'Re-open ' : 'Resolve '} ${parentType}`;

    return (
      <ActionButton onClick={() => updateDiscussionStatus(newStatus)}>
        {label}
      </ActionButton>
    );
  };

  return (
    <Container {...props}>
      {renderIndicator()}
      {renderActionButton()}
    </Container>
  );
};

ActionsBar.propTypes = {
  parentType: PropTypes.oneOf(['discussion', 'thread']).isRequired,
  handleClickReply: PropTypes.func.isRequired,
  handleClickDiscard: PropTypes.func.isRequired,
};

export default ActionsBar;
