import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentCheck } from '@fortawesome/pro-solid-svg-icons';

import updateDiscussionMutation from 'graphql/mutations/updateDiscussion';
import discussionQuery from 'graphql/queries/discussion';

import Avatar from 'components/shared/Avatar';

const AddReplyContainer = styled.div(({ hover, status, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  background: colors.bgGrey,
  color: colors.grey4,
  cursor: 'pointer',
  opacity: hover || status === 'resolved' ? 1 : 0.6,
  padding: '20px 25px',
  transition: 'opacity 0.2s',
}));

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

const ResolveDiscussionButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '4px 15px',
}));

const ResolvedDiscussionIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.successGreen,
  fontSize: '18px',
  marginRight: '12px',
}));

const ResolvedDiscussionAuthorIcon = styled(ResolvedDiscussionIcon)(({ theme: { colors } }) => ({
  position: 'absolute',
  marginTop: '10px',
  marginLeft: '10px',
  background: colors.white,
}));

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

const AddReplyBox = ({
  discussionId,
  documentId,
  currentUser,
  handleClickReply,
  ...props
}) => {
  const [updateDiscussion] = useMutation(updateDiscussionMutation);
  const { loading, data } = useQuery(discussionQuery, {
    variables: { id: discussionId, queryParams: {} },
  });

  if (loading) return null;
  const { status, author } = data.discussion;

  async function updateDiscussionStatus(value) {
    const input = { status: value };
    updateDiscussion({
      variables: { documentId, discussionId, input },
      refetchQueries: [{
        query: discussionQuery,
        variables: { id: discussionId, queryParams: {} },
      }],
    });
  }

  return (
    <AddReplyContainer {...props} status={status}>
      {status === 'resolved' ? (
        <React.Fragment>
          <AddReplyItem>
            <ResolveAuthorContainter>
              <AvatarWithMargin avatarUrl={author.profilePictureUrl} size={32} />
              <ResolvedDiscussionAuthorIcon icon={faCommentCheck} />
            </ResolveAuthorContainter>
            <AddReplyLabel>{`${author.fullName} marked this discussion as resolved`}</AddReplyLabel>
          </AddReplyItem>
          <AddReplyItem>
            <ResolveDiscussionButton onClick={() => updateDiscussionStatus('open')}>
              <Label>Reopen discussion</Label>
            </ResolveDiscussionButton>
          </AddReplyItem>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <AddReplyItem>
            <AvatarWithMargin avatarUrl={currentUser.profilePictureUrl} size={32} />
            <AddReplyLabel onClick={handleClickReply}>Add a reply...</AddReplyLabel>
          </AddReplyItem>
          <AddReplyItem>
            <ResolveDiscussionButton onClick={() => updateDiscussionStatus('resolved')}>
              <Label>Resolve discussion</Label>
            </ResolveDiscussionButton>
          </AddReplyItem>
        </React.Fragment>
      )}
    </AddReplyContainer>
  );
};

AddReplyBox.propTypes = {
  discussionId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
  handleClickReply: PropTypes.func.isRequired,
};

export default AddReplyBox;
