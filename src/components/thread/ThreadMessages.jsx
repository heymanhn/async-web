/*
 * TODO: Figure out how much this component can be DRY'ed up with
 * <DiscussionMessages />
 */
import React, { useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useQuery, useMutation } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import localStateQuery from 'graphql/queries/localState';
import localAddPendingMessages from 'graphql/mutations/local/addPendingMessagesToDiscussion';
import useMarkResourceAsRead from 'hooks/resources/useMarkResourceAsRead';
import useMountEffect from 'hooks/shared/useMountEffect';
import usePaginatedResource from 'hooks/resources/usePaginatedResource';
import { ThreadContext } from 'utils/contexts';

import NewMessagesIndicator from 'components/discussion/NewMessagesIndicator';
import Message from 'components/message/Message';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  maxWidth: discussionViewport,
}));

const ThreadMessages = ({ isUnread, ...props }) => {
  const client = useApolloClient();
  const discussionRef = useRef(null);
  const { threadId, modalRef } = useContext(ThreadContext);
  const [pendingMessageCount, setPendingMessageCount] = useState(0);
  const [addPendingMessages] = useMutation(localAddPendingMessages, {
    variables: { discussionId: threadId },
  });
  const markAsRead = useMarkResourceAsRead();

  useMountEffect(() => {
    client.writeData({ data: { pendingMessages: [] } });
    if (isUnread) markAsRead();
  });

  const { data: localData } = useQuery(localStateQuery);
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

  if (localData) {
    const { pendingMessages } = localData;
    if (pendingMessages && pendingMessages.length !== pendingMessageCount) {
      setPendingMessageCount(pendingMessages.length);
    }
  }

  const handleAddPendingMessages = () => {
    addPendingMessages();
    markAsRead();
  };

  return (
    <Container ref={discussionRef} {...props}>
      {pendingMessageCount > 0 && (
        <NewMessagesIndicator
          count={pendingMessageCount}
          onClick={handleAddPendingMessages}
        />
      )}
      {messages.map((m, i) => (
        <React.Fragment key={m.id}>
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
