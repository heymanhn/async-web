import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import useMarkResourceAsRead from 'hooks/resources/useMarkResourceAsRead';
import usePaginatedResource from 'hooks/resources/usePaginatedResource';
import { DiscussionContext, MessageContext } from 'utils/contexts';
import { firstNewMessageId, scrollToBottom } from 'utils/helpers';

import NotFound from 'components/navigation/NotFound';
import Message from 'components/message/Message';

import NewMessagesDivider from 'components/shared/NewMessagesDivider';
import NewMessagesIndicator from 'components/shared/NewMessagesIndicator';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const LoadingMessage = styled.div(
  ({ theme: { colors, discussionViewport, fontProps } }) => ({
    ...fontProps({ size: 12, weight: 500 }),
    color: colors.grey6,
    margin: '-15px auto 0',
    padding: '15px 30px 0',
    width: discussionViewport,
  })
);

const StyledNewMessagesIndicator = styled(NewMessagesIndicator)({
  top: '46px', // vertically align to bottom of the nav bar (60px)
});

const DiscussionMessages = ({ isUnread, ...props }) => {
  const discussionRef = useRef(null);
  const dividerRef = useRef(null);
  const { discussionId, bottomRef, composerRef } = useContext(
    DiscussionContext
  );
  const messageContext = useContext(MessageContext);
  const [currentDiscussionId, setCurrentDiscussionId] = useState(null);
  const [scrollHeight, setScrollHeight] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevMessageCount, setPrevMessageCount] = useState(null);
  const markAsRead = useMarkResourceAsRead();

  // Keep track of the current discussion in state to make sure we can mark the
  // discussion as read each time the discussion ID changes.
  useEffect(() => {
    if (discussionId !== currentDiscussionId) {
      if (isUnread) markAsRead();
      setCurrentDiscussionId(discussionId);
      setIsScrolled(false);
    }
  }, [isUnread, markAsRead, discussionId, currentDiscussionId]);

  const { loading, isPaginating, data } = usePaginatedResource({
    containerRef: discussionRef,
    queryDetails: {
      query: discussionMessagesQuery,
      key: 'messages',
      variables: { discussionId, queryParams: { order: 'desc' } },
    },
    reverse: true,
    isDisabled: !isScrolled,
  });

  // Keep the scroll position of the container intact while reverse paginating
  // https://kirbysayshi.com/2013/08/19/maintaining-scroll-position-knockoutjs-list.html
  //
  // TODO: handle window vs modal scrolling.
  useEffect(() => {
    const { current: container } = discussionRef || {};
    const { items } = data || {};
    const safeItems = items || [];

    if (container) {
      if (isPaginating && !scrollHeight) {
        setScrollHeight(container.scrollHeight - window.scrollY);
      }

      if (!isPaginating && safeItems.length > prevMessageCount) {
        setScrollHeight(null);
        setPrevMessageCount(safeItems.length);

        // Extra scrolling is only needed if the window is not scrolled to
        // the very top. The offset is the difference in height of the
        // container element, before vs. after pagination.
        if (!window.scrollY) {
          window.scroll({ top: container.scrollHeight - scrollHeight });
        }
      }
    }
  }, [isPaginating, scrollHeight, data, prevMessageCount]);

  if (loading) return null;
  if (!data) return <NotFound />;

  const { items } = data;
  const safeItems = items || [];
  const messages = safeItems.map(i => i.message).reverse();
  if (!prevMessageCount) setPrevMessageCount(messages.length);

  // Logic to scroll to the bottom of the page on each initial render
  // of discussion messages
  if (!isScrolled) {
    scrollToBottom(bottomRef);
    setIsScrolled(true);
  }

  const generateValue = index => ({
    ...messageContext,
    listPosition: index,
  });

  return (
    <Container ref={discussionRef} {...props}>
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

DiscussionMessages.propTypes = {
  isUnread: PropTypes.bool.isRequired,
};

export default DiscussionMessages;
