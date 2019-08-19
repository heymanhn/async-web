import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo';
import styled from '@emotion/styled/macro';

import conversationMessagesQuery from 'graphql/conversationMessagesQuery';
import meetingQuery from 'graphql/meetingQuery';
import updateConversationMutation from 'graphql/updateConversationMutation';
import withViewedReaction from 'utils/withViewedReaction';
// import useInfiniteScroll from 'utils/useInfiniteScroll';

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
  markAsRead,
  meetingId,
  ...props
}) => {
  const [messages, setMessages] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [parentConversation, setParentConversation] = useState(null);
  const [focusedMessage, setFocusedMessage] = useState(null);

  const client = useApolloClient();

  async function fetchMessages(conversationId) {
    const { data } = await client.query({
      query: conversationMessagesQuery,
      variables: { id: conversationId, queryParams: {} },
      fetchPolicy: 'no-cache',
    });

    const { items, messageCount } = data.conversationMessages;

    return { messages: (items || []).map(i => i.message), messageCount };
  }

  useEffect(async () => {
    const { messages, messageCount } = await fetchMessages(conversationId);
    setMessages(messages);
    setMessageCount(messageCount);
    setFocusedMessage(null);
    setParentConversation(null);
  }, [conversationId, messages, messageCount]);

  if (!messages) return null;

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

  /*
   * When a message is selected, all the messages in the conversation after that message are no
   * no longer displayed, replaced by any replies to the current message, if it is the first
   * message of another conversation.
  */
  async function showFocusedConversation(focusedMessage) {
    let newMessages = [];

    if (!focusedMessage) {
      // TODO: when parentConversation is implemented, have this code fetch the messages
      // from the parent conversation, instead of from the root
      const {
        messages: parentMessages,
        messageCount,
      } = await fetchMessages(conversationId);
      setFocusedMessage(focusedMessage);
      setMessageCount(messageCount);
      setMessages(parentMessages);
    } else {
      const index = messages.findIndex(m => m.id === focusedMessage.id);

      if (index === 0) return;
      newMessages = messages.slice(0, index + 1);

      const { childConversationId } = focusedMessage; // indicates nested conversation
      if (childConversationId) {
        markAsRead(childConversationId);
        const {
          messages: childMessages,
        } = await fetchMessages(childConversationId);

        // Backend returns the originating message of the nested conversation as the first
        // message in the list
        newMessages = newMessages.concat(childMessages.slice(1));
      }

      setFocusedMessage(focusedMessage);
      setMessages(newMessages);
    }
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

  return (
    <Container {...props}>
      <TitleEditor
        contentType="discussionTitle"
        initialValue={conversation.title || 'Untitled Discussion'}
        isPlainText
        onSubmit={this.handleUpdateTitle}
        saveOnBlur
      />
      <MessagesSection>
        {messages.map(m => (
          <React.Fragment key={m.id}>
            <DiscussionReply
              afterSubmit={this.updateMessageInList}
              conversationId={m.conversationId}
              handleFocusMessage={this.handleFocusOnMessage}
              initialMode="display"
              key={m.id}
              meetingId={meetingId}
              message={m}
              replyCount={this.replyCountForMessage(m)}
              size={(focusedMessage || messages[0]).id === m.id ? 'large' : 'small'}
             source="discussion"
            />
            <Separator />
          </React.Fragment>
        ))}
      </MessagesSection>
      <ReplyComposer
        afterSubmit={this.updateMessageInList}
        conversationId={conversation.id}
        focusedMessage={focusedMessage}
        meetingId={meetingId}
      />
    </Container>
  );
};

DiscussionThread.propTypes = {
  conversationId: PropTypes.string.isRequired,
  conversationTitle: PropTypes.string,
  markAsRead: PropTypes.func.isRequired,
  meetingId: PropTypes.string.isRequired,
};

DiscussionThread.defaultProps = {
  conversationTitle: null,
};

export default withViewedReaction(DiscussionThread);
