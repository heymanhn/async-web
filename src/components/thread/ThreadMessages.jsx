import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import useMarkResourceAsRead from 'hooks/resources/useMarkResourceAsRead';
import usePaginatedResource from 'hooks/resources/usePaginatedResource';
import useReversePaginateScroll from 'hooks/resources/useReversePaginateScroll';
import { MessageContext, ThreadContext } from 'utils/contexts';
import { firstNewMessageId, scrollToBottom } from 'utils/helpers';

import NewMessagesDivider from 'components/shared/NewMessagesDivider';
import NewMessagesIndicator from 'components/shared/NewMessagesIndicator';
import Message from 'components/message/Message';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const LoadingMessage = styled.div(
  ({ theme: { colors, discussionViewport, fontProps } }) => ({
    ...fontProps({ size: 12, weight: 500 }),
    color: colors.grey4,
    margin: '0 auto',
    padding: '15px 30px 0',
    width: discussionViewport,
  })
);

const StyledNewMessagesIndicator = styled(NewMessagesIndicator)({
  top: '75px', // 60px top margin for the modal + 15px buffer
});

/*
 * HN: Much of this logic is repeated from <DiscussionMessages />. Candidate
 * to clean up in the future
 */
const ThreadMessages = ({ isUnread, ...props }) => {
  const threadRef = useRef(null);
  const dividerRef = useRef(null);
  const { threadId, modalRef, bottomRef, composerRef, topicRef } = useContext(
    ThreadContext
  );
  const messageContext = useContext(MessageContext);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const markAsRead = useMarkResourceAsRead();

  // Keep track of the current thread in state to make sure we can mark the
  // thread as read each time the thread ID changes.
  useEffect(() => {
    if (threadId !== currentThreadId) {
      if (isUnread) markAsRead();
      setCurrentThreadId(threadId);
      setIsScrolled(false);
    }
  }, [isUnread, markAsRead, threadId, currentThreadId]);

  const { loading, isPaginating, data } = usePaginatedResource({
    queryDetails: {
      query: discussionMessagesQuery,
      key: 'messages',
      variables: { discussionId: threadId, queryParams: { order: 'desc' } },
    },
    containerRef: threadRef,
    modalRef,
    reverse: true,
    isDisabled: !isScrolled,
  });

  useReversePaginateScroll({
    isPaginating,
    data,
    containerRef: threadRef,
    modalRef,
    titleRef: topicRef,
  });

  if (loading || !data) return null;

  const { items } = data;
  const safeItems = items || [];
  const messages = safeItems.map(i => i.message).reverse();

  // Logic to scroll to the bottom of the page on each initial render
  // of thread messages
  if (!isScrolled) {
    scrollToBottom(bottomRef);
    setIsScrolled(true);
  }

  const generateValue = index => ({
    ...messageContext,
    listPosition: index,
    parentType: 'thread',
    parentId: threadId,
  });

  return (
    <Container ref={threadRef} {...props}>
      <StyledNewMessagesIndicator
        bottomRef={bottomRef}
        composerRef={composerRef}
        dividerRef={dividerRef}
        afterClick={markAsRead}
      />
      {isPaginating && (
        <LoadingMessage>Fetching earlier messages...</LoadingMessage>
      )}
      {messages.map((m, i) => (
        <React.Fragment key={m.id}>
          {firstNewMessageId(messages) === m.id && m.id !== messages[0].id && (
            <NewMessagesDivider ref={dividerRef} />
          )}
          <MessageContext.Provider value={generateValue(i)}>
            <Message message={m} />
          </MessageContext.Provider>
        </React.Fragment>
      ))}
    </Container>
  );
};

ThreadMessages.propTypes = {
  isUnread: PropTypes.bool.isRequired,
};

export default ThreadMessages;
