import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
// import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
// import { track } from 'utils/analytics';
import { DEFAULT_THREAD_CONTEXT, ThreadContext } from 'utils/contexts';
// import useMountEffect from 'hooks/shared/useMountEffect';
import { isResourceUnread } from 'utils/helpers';

import Modal from 'components/shared/Modal';
import Editor from 'components/editor/Editor';
import MessageComposer from 'components/message/MessageComposer';
import ThreadMessages from './ThreadMessages';
import TopicComposer from './TopicComposer';

const StyledModal = styled(Modal)({
  alignSelf: 'flex-start',
});

const StyledTopicComposer = styled(TopicComposer)({
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
});

// Render the 3px top border differently, since the box shadow trick
// won't work here
const StyledMessageComposer = styled(MessageComposer)({
  position: 'unset',
  overflow: 'initial',
  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
});

const ThreadModal = ({
  threadId,
  initialTopic,
  sourceEditor, // Reference to the editor that contains the content to be annotated
  handleClose,
  ...props
}) => {
  const modalRef = useRef(null);

  // Hides the message composer if the user is an editing a message
  const [hideComposer, setHideComposer] = useState(false);

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

  const { data } = useQuery(discussionQuery, {
    variables: { discussionId: threadId },
  });

  if (!data || !data.discussion) return null;

  const { draft, messageCount, topic, tags } = data.discussion;

  const afterCreateMessage = newThreadId => {
    // Only need to set this once, when the first message is created.
    if (!messageCount && sourceEditor) {
      Editor.updateInlineAnnotation(sourceEditor, newThreadId, {
        isInitialDraft: false,
      });
    }
  };

  const afterDeleteThread = () => {
    if (sourceEditor) Editor.removeInlineAnnotation(sourceEditor, threadId);

    handleClose();
  };

  const value = {
    ...DEFAULT_THREAD_CONTEXT,
    threadId,
    initialTopic,
    topic,
    modalRef,
    hideComposer,
    afterDeleteThread,
    setHideComposer,
  };

  /* Three conditions when ready to show the composer:
   * 1. Inline discussion and the context has been created. This ensures the
   *    composer is in focus when it's rendered.
   * 2. General discussion. There won't be a topic to create context for.
   * 3. Subsequent messages to a discussion. Also won't be a topic present.
   */
  // const readyToCompose = isComposing && (!initialTopic || topic);
  // const isComposingFirstMsg = isComposing && !messageCount;

  return (
    <StyledModal
      ref={modalRef}
      handleClose={handleClose}
      isOpen={!!threadId}
      {...props}
    >
      <ThreadContext.Provider value={value}>
        {(initialTopic || topic) && <StyledTopicComposer />}
        <ThreadMessages isUnread={isResourceUnread(tags)} />
        <StyledMessageComposer
          parentType="thread"
          parentId={threadId}
          draft={draft}
          messageCount={messageCount}
          afterCreateMessage={afterCreateMessage}
        />
      </ThreadContext.Provider>
    </StyledModal>
  );
};

ThreadModal.propTypes = {
  threadId: PropTypes.string.isRequired,
  initialTopic: PropTypes.array,
  sourceEditor: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};

ThreadModal.defaultProps = {
  initialTopic: null,
  sourceEditor: null,
};

export default ThreadModal;
