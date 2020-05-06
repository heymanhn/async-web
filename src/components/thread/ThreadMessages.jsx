import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import useMarkResourceAsRead from 'hooks/resources/useMarkResourceAsRead';
import useMountEffect from 'hooks/shared/useMountEffect';
import usePaginatedResource from 'hooks/resources/usePaginatedResource';
import { MessageContext, ThreadContext } from 'utils/contexts';
import { firstNewMessageId } from 'utils/helpers';

import NewMessagesDivider from 'components/shared/NewMessagesDivider';
import NewMessagesIndicator from 'components/shared/NewMessagesIndicator';
import Message from 'components/message/Message';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const StyledNewMessagesIndicator = styled(NewMessagesIndicator)({
  top: '75px', // 60px top margin for the modal + 15px buffer
});

const ThreadMessages = ({ isUnread, ...props }) => {
  const threadRef = useRef(null);
  const dividerRef = useRef(null);
  const { threadId, modalRef, bottomRef, composerRef } = useContext(
    ThreadContext
  );
  const messageContext = useContext(MessageContext);
  const markAsRead = useMarkResourceAsRead();

  useMountEffect(() => {
    if (isUnread) markAsRead();
  });

  const { loading, data } = usePaginatedResource(
    threadRef,
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
