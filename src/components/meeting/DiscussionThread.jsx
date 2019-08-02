import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import styled from '@emotion/styled/macro';

import conversationMessagesQuery from 'graphql/conversationMessagesQuery';

import DiscussionReply from './DiscussionReply';

const MessagesSection = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
}));

const Separator = styled.hr(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  margin: 0,
}));

const ReplyDisplay = styled.div({
  ':last-of-type': {
    [Separator]: {
      display: 'none',
    },
  },
});

const ActionsContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',

  borderTop: `1px solid ${colors.borderGrey}`,
  minHeight: '60px',
}));

// HN: DRY up these reply button styles later
const AddReplyButton = styled.div(({ theme: { colors } }) => ({
  alignSelf: 'center',
  color: colors.grey3,
  cursor: 'pointer',
  marginLeft: '30px',
  position: 'relative',
  top: '-2px',
}));

const PlusSign = styled.span(({ theme: { colors } }) => ({
  fontSize: '20px',
  fontWeight: 400,
  paddingRight: '5px',
  position: 'relative',
  top: '1px',

  ':hover': {
    color: colors.grey2,
  },
}));

const ButtonText = styled.span(({ theme: { colors } }) => ({
  fontSize: '14px',
  fontWeight: 500,

  ':hover': {
    color: colors.grey2,
    textDecoration: 'underline',
  },
}));

class DiscussionThread extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedMessage: null,
      isComposingReply: false,
      messages: props.messages,
      parentConversation: null,
      messageCount: props.messageCount,
    };

    this.handleFocusOnMessage = this.handleFocusOnMessage.bind(this);
    this.conversationIdForNewReply = this.conversationIdForNewReply.bind(this);
    this.fetchConversationMessages = this.fetchConversationMessages.bind(this);
    this.replyCountForMessage = this.replyCountForMessage.bind(this);
    this.showFocusedConversation = this.showFocusedConversation.bind(this);
    this.sizeForMessage = this.sizeForMessage.bind(this);
    this.toggleReplyComposer = this.toggleReplyComposer.bind(this);
    this.updateMessageInList = this.updateMessageInList.bind(this);
  }

  async handleFocusOnMessage(message) {
    const { focusedMessage, messages, parentConversation } = this.state;
    let newFocus;

    if (message.id === messages[0].id) {
      newFocus = null;
    } else if (focusedMessage && focusedMessage.id === message.id) {
      // TODO: Figure out how to set parentConversation properly
      newFocus = parentConversation ? parentConversation.messages[0] : null;
    } else {
      newFocus = message;
    }

    this.showFocusedConversation(newFocus);
  }

  conversationIdForNewReply() {
    const { focusedMessage } = this.state;
    const { conversationId } = this.props;

    return focusedMessage ? focusedMessage.childConversationId : conversationId;
  }

  async fetchConversationMessages(conversationId) {
    const { client } = this.props;
    const response = await client.query({
      query: conversationMessagesQuery,
      variables: { id: conversationId },
      fetchPolicy: 'no-cache',
    });

    if (response.data) {
      const { items, messageCount } = response.data.conversationMessagesQuery;
      const messages = (items || []).map(i => i.message);

      return { messages, messageCount };
    }

    return new Error('Error fetching conversation messages');
  }

  // The reply count for the first message in the root conversation is always the number
  // of messages in the conversation.
  replyCountForMessage(message) {
    const { messages, messageCount } = this.state;
    if (message.id === messages[0].id) return messageCount - 1 || 0;
    return message.replyCount || 0;
  }

  sizeForMessage(id) {
    const { focusedMessage, messages } = this.state;
    if (focusedMessage) return focusedMessage.id === id ? 'large' : 'small';

    return messages[0].id === id ? 'large' : 'small';
  }

  /*
   * When a message is selected, all the messages in the conversation after that message are no
   * no longer displayed, replaced by any replies to the current message, if it is the first
   * message of another conversation.
  */
  async showFocusedConversation(focusedMessage) {
    const { messages } = this.state;
    const { conversationId } = this.props;
    let newMessages = [];

    if (!focusedMessage) {
      // TODO: when parentConversation is implemented, have this code fetch the messages
      // from the parent conversation, instead of from the root
      const {
        messages: parentMessages,
        messageCount,
      } = await this.fetchConversationMessages(conversationId);
      this.setState({ focusedMessage, messageCount, messages: parentMessages });
    } else {
      const index = messages.findIndex(m => m.id === focusedMessage.id);

      if (index === 0) return;
      newMessages = messages.slice(0, index + 1);

      const { childConversationId } = focusedMessage;
      if (childConversationId) {
        const {
          messages: childMessages,
        } = await this.fetchConversationMessages(childConversationId);
        newMessages = newMessages.concat(childMessages);
      }

      this.setState({ focusedMessage, messages: newMessages });
    }
  }

  toggleReplyComposer() {
    this.setState(prevState => ({ isComposingReply: !prevState.isComposingReply }));
  }

  // Serves as an optimistic update to the messages state. Handles two cases:
  // 1. A new message is added to a conversation
  // 2. A message has been edited by the current user
  updateMessageInList(updatedMessage) {
    const { focusedMessage, messages } = this.state;
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

    this.setState({ messages: newMessages });
  }

  render() {
    const { focusedMessage, isComposingReply, messages } = this.state;
    const { meetingId } = this.props;

    const addReplyButton = (
      <AddReplyButton onClick={this.toggleReplyComposer}>
        <PlusSign>+</PlusSign>
        <ButtonText>ADD A REPLY</ButtonText>
      </AddReplyButton>
    );

    return (
      <React.Fragment>
        <MessagesSection>
          {messages.map(m => (
            <ReplyDisplay key={m.id}>
              <DiscussionReply
                afterSubmit={this.updateMessageInList}
                conversationId={m.conversationId}
                handleFocusMessage={this.handleFocusOnMessage}
                initialMode="display"
                key={m.id}
                meetingId={meetingId}
                message={m}
                replyCount={this.replyCountForMessage(m)}
                size={this.sizeForMessage(m.id)}
              />
              <Separator />
            </ReplyDisplay>
          ))}
        </MessagesSection>
        <ActionsContainer>
          {!isComposingReply ? addReplyButton : (
            <DiscussionReply
              afterSubmit={this.updateMessageInList}
              conversationId={this.conversationIdForNewReply()}
              focusedMessage={focusedMessage}
              initialMode="compose"
              meetingId={meetingId}
              onCancelCompose={this.toggleReplyComposer}
            />
          )}
        </ActionsContainer>
      </React.Fragment>
    );
  }
}

DiscussionThread.propTypes = {
  client: PropTypes.object.isRequired,
  conversationId: PropTypes.string.isRequired,
  meetingId: PropTypes.string.isRequired,
  messageCount: PropTypes.number.isRequired,
  messages: PropTypes.array.isRequired,
};

export default withApollo(DiscussionThread);
