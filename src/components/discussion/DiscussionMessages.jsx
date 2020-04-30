/*
 * TODO: Figure out how much this component can be DRY'ed up with
 * <ThreadMessages />
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
import { DiscussionContext } from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import Message from 'components/message/Message';

import NewMessagesDivider from './NewMessagesDivider';
import NewMessagesIndicator from './NewMessagesIndicator';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const DiscussionMessages = ({ isComposingFirstMsg, isUnread, ...props }) => {
  const client = useApolloClient();
  const discussionRef = useRef(null);
  const { discussionId } = useContext(DiscussionContext);
  const [pendingMessageCount, setPendingMessageCount] = useState(0);
  const [addPendingMessages] = useMutation(localAddPendingMessages, {
    variables: { discussionId },
  });
  const markAsRead = useMarkResourceAsRead();

  useMountEffect(() => {
    client.writeData({ data: { pendingMessages: [] } });
    if (isUnread) markAsRead();
  });

  const { data: localData } = useQuery(localStateQuery);
  const { loading, data } = usePaginatedResource(discussionRef, {
    query: discussionMessagesQuery,
    key: 'messages',
    variables: { discussionId, queryParams: {} },
  });

  // Workaround to make sure two copies of the first message aren't rendered
  // on the modal at the same time
  if (loading || isComposingFirstMsg) return null;
  if (!data) return <NotFound />;

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

  const firstNewMessageId = () => {
    const targetMessage = messages.find(
      m => m.tags && m.tags.includes('new_message')
    );

    return targetMessage ? targetMessage.id : null;
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
          {firstNewMessageId() === m.id && m.id !== messages[0].id && (
            <NewMessagesDivider />
          )}
          <Message
            index={i}
            message={m}
            parentId={discussionId}
            parentType="discussion"
          />
        </React.Fragment>
      ))}
    </Container>
  );
};

DiscussionMessages.propTypes = {
  isComposingFirstMsg: PropTypes.bool.isRequired,
  isUnread: PropTypes.bool.isRequired,
};

export default DiscussionMessages;
