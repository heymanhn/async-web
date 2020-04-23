import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
// import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
// import { track } from 'utils/analytics';
import { DEFAULT_THREAD_CONTEXT, ThreadContext } from 'utils/contexts';
// import useMountEffect from 'hooks/shared/useMountEffect';
import useKeyDownHandler from 'hooks/shared/useKeyDownHandler';
import { isResourceUnread } from 'utils/helpers';

import Modal from 'components/shared/Modal';
import Editor from 'components/editor/Editor';
import AddReplyBox from 'components/discussion/AddReplyBox';
import Message from 'components/message/Message';
import ThreadMessages from './ThreadMessages';
import ContextComposer from './ContextComposer';

const ESCAPE_HOTKEY = 'Escape';

const StyledModal = styled(Modal)(({ theme: { colors } }) => ({
  alignSelf: 'flex-start',
  background: colors.bgGrey,
}));

const StyledContextComposer = styled(ContextComposer)({
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
});

const StyledMessage = styled(Message)(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
  paddingBottom: '25px',
}));

const ThreadModal = ({
  threadId,
  initialTopic,
  sourceEditor, // Reference to the editor that contains the content to be annotated
  handleClose,
  ...props
}) => {
  const modalRef = useRef(null);

  // TODO (DISCUSSION V2): set isComposing to true once we know the user has
  // a draft in progress for the thread.
  const [isComposing, setIsComposing] = useState(false);
  const startComposing = () => setIsComposing(true);
  const stopComposing = () => setIsComposing(false);

  // TODO (DISCUSSION V2): Clean this up
  // useMountEffect(() => {
  //   track('Discussion viewed', { discussionId: modalDiscussionId, documentId });
  // });

  // TODO (DISCUSSION V2): Support proper URLs later
  // useEffect(() => {
  //   const { origin } = window.location;
  //   const baseUrl = `${origin}/documents/${documentId}`;
  //   const setUrl = () => {
  //     const url = `${baseUrl}/discussions/${modalDiscussionId}`;
  //     return window.history.replaceState(
  //       {},
  //       `discussion: ${modalDiscussionId}`,
  //       url
  //     );
  //   };
  //   if (modalDiscussionId) setUrl();

  //   // Triggering a navigation so that the discussionId prop can be reset in
  //   // the parent <DocumentContainer /> component.
  //   return () => navigate(baseUrl);
  // }, [documentId, discussionId, modalDiscussionId]);

  useKeyDownHandler([ESCAPE_HOTKEY, () => !isComposing && handleClose()]);

  const { data } = useQuery(discussionQuery, {
    variables: { discussionId: threadId },
  });

  if (!data || !data.discussion) return null;

  const { draft, messageCount, topic, tags } = data.discussion;
  if (draft && !isComposing) startComposing();

  const handleCancelCompose = () => {
    stopComposing();
  };

  const handleCreateMessage = newThreadId => {
    stopComposing();

    // Only need to set this once, when the first message is created.
    if (!messageCount) {
      Editor.updateInlineAnnotation(sourceEditor, newThreadId, {
        isInitialDraft: false,
      });
    }
  };

  const afterDelete = () => {
    Editor.removeInlineAnnotation(sourceEditor, threadId);
    handleClose();
  };

  // TODO (DISCUSSION V2): This should be ThreadContext soon.
  const value = {
    ...DEFAULT_THREAD_CONTEXT,
    threadId,
    topic,
    draft,
    modalRef,
    isModal: true,
    afterDelete,
  };

  /* Three conditions when ready to show the composer:
   * 1. Inline discussion and the context has been created. This ensures the
   *    composer is in focus when it's rendered.
   * 2. General discussion. There won't be a topic to create context for.
   * 3. Subsequent messages to a discussion. Also won't be a topic present.
   */
  const readyToCompose = isComposing && (!initialTopic || topic);
  const isComposingFirstMsg = isComposing && !messageCount;

  return (
    <StyledModal
      ref={modalRef}
      handleClose={handleClose}
      isOpen={!!threadId}
      {...props}
    >
      <ThreadContext.Provider value={value}>
        {(initialTopic || topic) && <StyledContextComposer />}
        {initialTopic && (
          <ThreadMessages
            isComposingFirstMsg={isComposingFirstMsg}
            isUnread={isResourceUnread(tags)}
          />
        )}
        {readyToCompose ? (
          <StyledMessage
            mode="compose"
            afterCreate={handleCreateMessage}
            handleCancel={handleCancelCompose}
            {...props}
          />
        ) : (
          <AddReplyBox
            handleClickReply={startComposing}
            isComposing={isComposing}
          />
        )}
      </ThreadContext.Provider>
    </StyledModal>
  );
};

ThreadModal.propTypes = {
  threadId: PropTypes.string.isRequired,
  initialTopic: PropTypes.object,
  mode: PropTypes.oneOf(['document', 'discussion']).isRequired,
  sourceEditor: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

ThreadModal.defaultProps = {
  initialTopic: null,
};

export default ThreadModal;
