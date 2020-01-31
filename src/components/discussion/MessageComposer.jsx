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

import DiscussionMessage from './DiscussionMessage';
import AddReplyBox from './AddReplyBox';

const StyledDiscussionMessage = styled(DiscussionMessage)({
  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
});

const MessageComposer = ({
  afterDiscussionCreate,
  context,
  discussionId,
  draft,
  documentId,
  handleClose,
  source,
  ...props
}) => {
  const [isComposing, setIsComposing] = useState(!discussionId);
  function startComposing() {
    setIsComposing(true);
  }
  function stopComposing() {
    setIsComposing(false);
  }

  const { ...hoverProps } = useHover(isComposing);

  const { userId } = getLocalUser();
  const [createDiscussion] = useMutation(createDiscussionMutation);
  const { loading, data } = useQuery(currentUserQuery, {
    variables: { id: userId },
  });

  if (loading || !data.user) return null;
  const currentUser = data.user;

  function afterCreate(value, isDraft) {
    if (!discussionId) afterDiscussionCreate(value);
    if (!isDraft) stopComposing();
  }

  function handleCancel({ closeModal } = {}) {
    stopComposing();
    if (!discussionId || closeModal || source === 'discussionsList')
      handleClose();
  }

  if (!!draft && !isComposing) startComposing();

  return isComposing ? (
    <StyledDiscussionMessage
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
  ) : (
    <AddReplyBox
      discussionId={discussionId}
      documentId={documentId}
      currentUser={currentUser}
      handleClickReply={startComposing}
      {...hoverProps}
    />
  );
};

MessageComposer.propTypes = {
  afterDiscussionCreate: PropTypes.func.isRequired,
  context: PropTypes.string,
  discussionId: PropTypes.string,
  draft: PropTypes.object,
  documentId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  source: PropTypes.oneOf(['discussionContainer', 'discussionsList'])
    .isRequired,
};

MessageComposer.defaultProps = {
  context: null,
  discussionId: null,
  draft: null,
};

export default MessageComposer;
