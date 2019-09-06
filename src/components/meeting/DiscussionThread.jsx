import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo';
import styled from '@emotion/styled/macro';

import conversationMessagesQuery from 'graphql/queries/conversationMessages';
import meetingQuery from 'graphql/queries/meeting';
import updateConversationMutation from 'graphql/mutations/updateConversation';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
import { snakedQueryParams } from 'utils/queryParams';

import RovalEditor from 'components/editor/RovalEditor';
import DiscussionReply from 'components/discussion/DiscussionReply';
import ReplyComposer from 'components/discussion/ReplyComposer';

const Container = styled.div({});

const TitleEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
  color: colors.mainText,
  fontSize: '20px',
  fontWeight: 500,
  padding: '20px 30px',
  width: '100%',
  outline: 'none',
}));

const MessagesSection = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
}));

const Separator = styled.hr(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  margin: 0,
}));

const DiscussionThread = ({
  conversationId,
  conversationTitle,
  meetingId,
  ...props
}) => {
  const [messages, setMessages] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [parentConversation, setParentConversation] = useState(null);
  const [focusedMessage, setFocusedMessage] = useState(null);
  const [pageToken, setPageToken] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const threadRef = useRef(null);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(threadRef);
  const client = useApolloClient();

  // Why useCallback()? See the react-hooks/exhaustive-deps linter rule
  const fetchMessages = useCallback(async (cid, token) => {
    const queryParams = {};
    if (token) queryParams.pageToken = token;

    const { data } = await client.query({
      query: conversationMessagesQuery,
      variables: { id: cid, queryParams: snakedQueryParams(queryParams) },
      fetchPolicy: 'no-cache',
    });

    const { items, messageCount: newCount, pageToken: newToken } = data.conversationMessages;

    return {
      messages: (items || []).map(i => i.message),
      messageCount: newCount,
      pageToken: newToken,
    };
  }, [client]);

  async function fetchMoreMessages() {
    // NOTE: not supporting infinite scroll yet if we're currently in a nested discussion.
    if (!pageToken || parentConversation) return;

    const {
      messages: newMessages,
      pageToken: newToken,
    } = await fetchMessages(conversationId, pageToken);

    setMessages([...messages, ...newMessages]);
    setPageToken(newToken);
    setShouldFetch(false);
    setIsFetching(false);
  }

  /*
   * When a message is selected, all the messages in the conversation after that message are no
   * no longer displayed, replaced by any replies to the current message, if it is the first
   * message of another conversation.
  */
  async function showFocusedConversation(newFocusedMessage) {
    let newMessages = [];

    if (!newFocusedMessage) {
      // TODO: when parentConversation is implemented, have this code fetch the messages
      // from the parent conversation, instead of from the root
      const {
        messages: parentMessages,
        messageCount: newMessageCount,
      } = await fetchMessages(conversationId);
      setFocusedMessage(newFocusedMessage);
      setMessageCount(newMessageCount);
      setMessages(parentMessages);
    } else {
      const index = messages.findIndex(m => m.id === newFocusedMessage.id);

      if (index === 0) return;
      newMessages = messages.slice(0, index + 1);

      const { childConversationId } = newFocusedMessage; // indicates nested conversation
      if (childConversationId) {
        const { messages: childMessages } = await fetchMessages(childConversationId);

        // Backend returns the originating message of the nested conversation as the first
        // message in the list
        newMessages = newMessages.concat(childMessages.slice(1));
      }

      setFocusedMessage(newFocusedMessage);
      setMessages(newMessages);
    }
  }

  async function handleFocusOnMessage(message) {
    let newFocus;

    if (message.id === messages[0].id) {
      newFocus = null;
    } else if (focusedMessage && focusedMessage.id === message.id) {
      // TODO: Figure out how to set parentConversation properly
      newFocus = parentConversation ? parentConversation.messages[0] : null;
    } else {
      newFocus = message;
    }

    showFocusedConversation(newFocus);
  }

  async function handleUpdateTitle({ text } = {}) {
    const input = { title: text };
    const { data } = await client.mutate({
      mutation: updateConversationMutation,
      variables: { meetingId, conversationId, input },
      refetchQueries: [{
        query: meetingQuery,
        variables: { id: meetingId },
      }],
    });

    if (data) return Promise.resolve();
    return new Error('Error updating conversation title');
  }

  // The reply count for the first message in the root conversation is always the number
  // of messages in the conversation.
  function replyCountForMessage(message) {
    if (message.id === messages[0].id) return messageCount - 1 || 0;
    return message.replyCount || 0;
  }

  // Serves as an optimistic update to the messages state. Handles two cases:
  // 1. A new message is added to a conversation
  // 2. A message has been edited by the current user
  function updateMessageInList(updatedMessage) {
    const index = messages.findIndex(m => m.id === updatedMessage.id);
    let newMessages;

    if (index < 0) {
      const messageToUpdate = focusedMessage || messages[0];
      messageToUpdate.replyCount += 1;
      const secondIndex = messages.findIndex(m => m.id === messageToUpdate.id);

      newMessages = [
        ...messages.slice(0, secondIndex),
        messageToUpdate,
        ...messages.slice(secondIndex + 1),
        updatedMessage,
      ];
    } else {
      newMessages = [
        ...messages.slice(0, index),
        updatedMessage,
        ...messages.slice(index + 1),
      ];
    }

    setMessages(newMessages);
  }

  useEffect(() => {
    async function fetchData() {
      const {
        messages: newMessages,
        messageCount: newMessageCount,
        pageToken: newToken,
      } = await fetchMessages(conversationId);
      setMessages(newMessages);
      setMessageCount(newMessageCount);
      setFocusedMessage(null);
      setParentConversation(null);
      setPageToken(newToken);
    }

    fetchData();
  }, [conversationId, fetchMessages]);

  if (!messages) return null;
  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreMessages();
  }

  return (
    <Container ref={threadRef} {...props}>
      <TitleEditor
        contentType="discussionTitle"
        initialValue={conversationTitle || 'Untitled Discussion'}
        isPlainText
        onSubmit={handleUpdateTitle}
        saveOnBlur
      />
      <MessagesSection>
        {messages.map(m => (
          <React.Fragment key={m.id}>
            <DiscussionReply
              afterSubmit={updateMessageInList}
              conversationId={m.conversationId}
              handleFocusMessage={handleFocusOnMessage}
              initialMode="display"
              key={m.id}
              meetingId={meetingId}
              message={m}
              replyCount={replyCountForMessage(m)}
              size={(focusedMessage || messages[0]).id === m.id ? 'large' : 'small'}
              source="discussion"
            />
            <Separator />
          </React.Fragment>
        ))}
      </MessagesSection>
      <ReplyComposer
        afterSubmit={updateMessageInList}
        conversationId={conversationId}
        focusedMessage={focusedMessage}
        meetingId={meetingId}
      />
    </Container>
  );
};

DiscussionThread.propTypes = {
  conversationId: PropTypes.string.isRequired,
  conversationTitle: PropTypes.string,
  meetingId: PropTypes.string.isRequired,
};

DiscussionThread.defaultProps = {
  conversationTitle: null,
};

export default DiscussionThread;
