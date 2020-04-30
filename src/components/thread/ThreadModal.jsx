import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import useDisambiguatedResource from 'hooks/resources/useDisambiguatedResource';
import useMountEffect from 'hooks/shared/useMountEffect';
import { track } from 'utils/analytics';
import { DEFAULT_THREAD_CONTEXT, ThreadContext } from 'utils/contexts';
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
  const bottomRef = useRef(null);

  // Hides the message composer if the user is an editing a message
  const [hideComposer, setHideComposer] = useState(false);

  // A thread's parent is either a document or a discussion
  const { resourceId, resourceType } = useDisambiguatedResource();

  useEffect(() => {
    const { origin } = window.location;
    const baseUrl = `${origin}/${Pluralize(resourceType)}/${resourceId}`;
    const setUrl = () => {
      const url = `${baseUrl}/threads/${threadId}`;
      return window.history.replaceState({}, `thread: ${threadId}`, url);
    };
    if (threadId) setUrl();

    // Triggering a navigation so that the discussionId prop can be reset in
    // the parent <DocumentContainer /> component.
    return () => navigate(baseUrl);
  }, [threadId, resourceType, resourceId]);

  useMountEffect(() => {
    track('Thread viewed', { threadId });
  });

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
    bottomRef,
    hideComposer,
    afterDeleteThread,
    setHideComposer,
  };

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
        <div ref={bottomRef} />
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
