import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import useDisambiguatedResource from 'hooks/resources/useDisambiguatedResource';
import localDeleteThreadMutation from 'graphql/mutations/local/deleteThreadFromDocument';
import localUpdateParentMessageMtn from 'graphql/mutations/local/updateMessageInDiscussion';
import useMountEffect from 'hooks/shared/useMountEffect';
import { track } from 'utils/analytics';
import {
  DEFAULT_MESSAGE_CONTEXT,
  DEFAULT_THREAD_CONTEXT,
  MessageContext,
  ThreadContext,
} from 'utils/contexts';
import { isResourceUnread } from 'utils/helpers';

import Modal from 'components/shared/Modal';
import Editor from 'components/editor/Editor';
import MessageComposer from 'components/message/MessageComposer';
import ThreadMessages from './ThreadMessages';
import TopicComposer from './TopicComposer';

const StyledModal = styled(Modal)({
  alignSelf: 'flex-start',
  margin: '60px auto',
});

const Container = styled.div({
  borderRadius: '5px',
  maxHeight: 'calc(100vh - 120px)', // 60px vertical margin x2
  overflowY: 'auto',
  overflowX: 'hidden',
});

// Setting this additional container with a position allows the absolute
// positioned content in the modal to scroll along with the rest of the content
// https://www.bennadel.com/blog/3409-using-position-absolute-inside-a-scrolling-overflow-container.htm
const InnerContainer = styled.div({
  position: 'relative',
});

const StyledTopicComposer = styled(TopicComposer)({
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  padding: '0 30px',
});

const StyledMessageComposer = styled(MessageComposer)({
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
  const composerRef = useRef(null);
  const [quoteReply, setQuoteReply] = useState(null);

  // Hides the message composer if the user is an editing a message
  const [hideComposer, setHideComposer] = useState(false);

  // A thread's parent is either a document or a discussion
  const { resourceId, resourceType } = useDisambiguatedResource();
  const [localDeleteThread] = useMutation(localDeleteThreadMutation);
  const [localUpdateParentMessage] = useMutation(localUpdateParentMessageMtn);

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

  const { data: data2 } = useQuery(discussionMessagesQuery, {
    variables: { discussionId: threadId, queryParams: { order: 'desc' } },
  });

  if (!data || !data.discussion || !data2 || !data2.messages) return null;

  const { draft, messageCount, topic, tags, parent } = data.discussion;
  const { pageToken } = data2.messages;

  const afterCreateMessage = newThreadId => {
    // Only need to set this once, when the first message is created.
    if (!messageCount && sourceEditor) {
      Editor.updateInlineAnnotation(sourceEditor, newThreadId, {
        isInitialDraft: false,
      });
    }
  };

  const afterUpdateResolution = isResolved => {
    if (sourceEditor) {
      Editor.updateInlineAnnotation(sourceEditor, threadId, {
        isResolved,
      });
    }
  };

  const afterDeleteThread = () => {
    if (sourceEditor) Editor.removeInlineAnnotation(sourceEditor, threadId);

    if (parent && parent.contentParentType === 'document') {
      localDeleteThread({
        variables: { documentId: parent.contentParentId, threadId },
      });
    } else if (parent && parent.contentParentType === 'message') {
      localUpdateParentMessage({
        variables: {
          discussionId: parent.id,
          messageId: parent.contentParentId,
        },
      });
    }

    handleClose();
  };

  const threadValue = {
    ...DEFAULT_THREAD_CONTEXT,
    threadId,
    initialTopic,
    topic,
    quoteReply,
    modalRef,
    bottomRef,
    composerRef,
    hideComposer,
    messageCount,
    afterDeleteThread,
    setHideComposer,
    setQuoteReply,
    handleClose,
  };

  const messageValue = {
    ...DEFAULT_MESSAGE_CONTEXT,
    draft,
    isModalOpen: true,
    parentId: threadId,
    parentType: 'thread',
  };

  return (
    <StyledModal handleClose={handleClose} isOpen={!!threadId} {...props}>
      <ThreadContext.Provider value={threadValue}>
        <Container ref={modalRef}>
          <InnerContainer>
            <MessageContext.Provider value={messageValue}>
              {(initialTopic || topic) && !pageToken && <StyledTopicComposer />}
              <ThreadMessages isUnread={isResourceUnread(tags)} />
              <StyledMessageComposer
                ref={composerRef}
                isExpanded={!messageCount}
                afterCreateMessage={afterCreateMessage}
                afterUpdateResolution={afterUpdateResolution}
              />
              <div ref={bottomRef} />
            </MessageContext.Provider>
          </InnerContainer>
        </Container>
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
