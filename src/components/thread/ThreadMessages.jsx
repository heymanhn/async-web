import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import useMarkResourceAsRead from 'hooks/resources/useMarkResourceAsRead';
import useMountEffect from 'hooks/shared/useMountEffect';
import usePaginatedResource from 'hooks/resources/usePaginatedResource';
import { ThreadContext } from 'utils/contexts';
import { firstNewMessageId } from 'utils/helpers';

import NewMessagesDivider from 'components/shared/NewMessagesDivider';
import NewMessagesIndicator from 'components/shared/NewMessagesIndicator';
import Message from 'components/message/Message';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  maxWidth: discussionViewport,
}));

const ThreadMessages = ({ isUnread, ...props }) => {
  const discussionRef = useRef(null);
  const { threadId, modalRef, bottomRef } = useContext(ThreadContext);
  const markAsRead = useMarkResourceAsRead();

  useMountEffect(() => {
    if (isUnread) markAsRead();
  });

  const { loading, data } = usePaginatedResource(
    discussionRef,
    {
      query: discussionMessagesQuery,
      key: 'messages',
      variables: { discussionId: threadId, queryParams: {} },
    },
    undefined,
    modalRef
  );

  if (loading || !data) return null;

  const { items } = data;
  const messages = (items || []).map(i => i.message);

  const scrollToBottom = () => {
    const { current: bottomOfPage } = bottomRef;
    if (bottomOfPage) bottomOfPage.scrollIntoView();

    markAsRead();
  };

  return (
    <Container ref={discussionRef} {...props}>
      <NewMessagesIndicator handleClick={scrollToBottom} />
      {messages.map((m, i) => (
        <React.Fragment key={m.id}>
          {firstNewMessageId(messages) === m.id && m.id !== messages[0].id && (
            <NewMessagesDivider />
          )}
          <Message
            index={i}
            message={m}
            parentId={threadId}
            parentType="thread"
          />
        </React.Fragment>
      ))}
    </Container>
  );
};

ThreadMessages.propTypes = {
  isUnread: PropTypes.bool.isRequired,
};

export default ThreadMessages;
