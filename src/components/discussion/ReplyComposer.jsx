import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import styled from '@emotion/styled';

import createDiscussionMutation from 'graphql/mutations/createDiscussion';
import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import currentUserQuery from 'graphql/queries/currentUser';
import { getLocalUser } from 'utils/auth';
import useHover from 'utils/hooks/useHover';

import Avatar from 'components/shared/Avatar';
import DiscussionReply from './DiscussionReply';

const AddReplyContainer = styled.div(({ hover, theme: { colors } }) => ({
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

const AddReplyLabel = styled.div({
  fontSize: '16px',
});

const AvatarWithMargin = styled(Avatar)({
  flexShrink: 0,
  marginRight: '12px',
});

const StyledDiscussionReply = styled(DiscussionReply)({
  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
});

const ReplyComposer = ({
  afterDiscussionCreate,
  context,
  discussionId,
  draft,
  documentId,
  handleClose,
  source,
  ...props
}) => {
  const [isComposing, setIsComposing] = useState(!!draft || !discussionId);
  function startComposing() { setIsComposing(true); }
  function stopComposing() { setIsComposing(false); }

  const { ...hoverProps } = useHover(isComposing);

  const { userId } = getLocalUser();
  const [createDiscussion] = useMutation(createDiscussionMutation);
  const { loading, data } = useQuery(currentUserQuery, {
    variables: { id: userId },
  });

  if (loading || !data.user) return null;
  const currentUser = data.user;

  async function handleCreateDiscussion() {
    const input = {};
    if (context) {
      const initialJSON = JSON.parse(context);
      const value = Value.fromJSON(initialJSON);

      input.topic = {
        formatter: 'slatejs',
        text: Plain.serialize(value),
        payload: context,
      };
    }

    const { data: createDiscussionData } = await createDiscussion({
      variables: { documentId, input },
      refetchQueries: [{
        query: documentDiscussionsQuery,
        variables: { id: documentId, queryParams: { order: 'desc' } },
      }],
      awaitRefetchQueries: true,
    });

    if (createDiscussionData.createDiscussion) {
      const { id: newDiscussionId } = createDiscussionData.createDiscussion;
      return Promise.resolve({ discussionId: newDiscussionId, isNewDiscussion: true });
    }

    return Promise.reject(new Error('Failed to create discussion'));
  }

  function afterCreate(value, isDraft) {
    if (!discussionId) afterDiscussionCreate(value);
    if (!isDraft) stopComposing();
  }

  function handleCancel({ closeModal } = {}) {
    stopComposing();
    if (!discussionId || closeModal || source === 'discussionsList') handleClose();
  }

  const addReplyBox = (
    <AddReplyContainer onClick={startComposing} {...hoverProps}>
      <AvatarWithMargin avatarUrl={currentUser.profilePictureUrl} size={32} />
      <AddReplyLabel>Add a reply...</AddReplyLabel>
    </AddReplyContainer>
  );

  return isComposing ? (
    <StyledDiscussionReply
      // Instead of special-casing RovalEditor again, use this callback pattern.
      afterCreate={afterCreate}

      currentUser={currentUser}
      discussionId={discussionId}
      draft={draft}
      initialMode="compose"
      documentId={documentId}
      onCancel={handleCancel}
      onCreateDiscussion={handleCreateDiscussion}
      {...props}
    />
  ) : addReplyBox;
};

ReplyComposer.propTypes = {
  afterDiscussionCreate: PropTypes.func.isRequired,
  context: PropTypes.string,
  discussionId: PropTypes.string,
  draft: PropTypes.object,
  documentId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  source: PropTypes.oneOf(['discussionContainer', 'discussionsList']).isRequired,
};

ReplyComposer.defaultProps = {
  context: null,
  discussionId: null,
  draft: null,
};

export default ReplyComposer;
