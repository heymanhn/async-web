import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Modal } from 'reactstrap';
import styled from '@emotion/styled/macro';

import conversationMessagesQuery from 'graphql/conversationMessagesQuery';

import DiscussionTopicReply from './DiscussionTopicReply';

const StyledModal = styled(Modal)(({ theme: { maxViewport } }) => ({
  margin: '100px auto',
  width: maxViewport,
  maxWidth: maxViewport,

  '.modal-content': {
    border: 'none',
  },
}));

const MessagesSection = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const Separator = styled.hr(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  margin: 0,
}));

const ReplyDisplay = styled.div({
  ':last-child': {
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

class DiscussionTopicModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedMessage: null,
      isComposingReply: false,
      messages: props.messages,
      parentConversation: null,
      messageCount: props.messageCount
    };

    this.handleFocusOnMessage = this.handleFocusOnMessage.bind(this);
    this.conversationIdForNewReply = this.conversationIdForNewReply.bind(this);
    this.fetchConversationMessages = this.fetchConversationMessages.bind(this);
    this.replyCountForMessage = this.replyCountForMessage.bind(this);
    this.resetDisplayURL = this.resetDisplayURL.bind(this);
    this.showFocusedConversation = this.showFocusedConversation.bind(this);
    this.sizeForMessage = this.sizeForMessage.bind(this);
    this.toggleReplyComposer = this.toggleReplyComposer.bind(this);
    this.updateDisplayURL = this.updateDisplayURL.bind(this);
    this.updateMessageInList = this.updateMessageInList.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;
    if (!prevProps.isOpen && isOpen) this.updateDisplayURL();
    if (prevProps.isOpen && !isOpen) this.resetDisplayURL();
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
      const { messageCountHash } = this.state;
      const messageCounts = messageCountHash || {}
      messageCounts[conversationId] = messageCount
      this.setState({ messageCountHash: messageCounts });

      return messages;
    }

    return new Error('Error fetching conversation messages');
  }

  // HN: Change this later, once the messageCount field is returned from backend
  replyCountForMessage(message) {
    const { messages, messageCountHash, messageCount } = this.state;
    if (message.id === messages[0].id) {
      return messageCountHash ? (messageCountHash[message.conversationId] - 1) : messageCount;
    }
    return message.replyCount || 0;
  }

  resetDisplayURL() {
    const { meetingId } = this.props;
    const url = `${origin}/meetings/${meetingId}`;
    window.history.replaceState({}, `meeting: ${meetingId}`, url);
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
      newMessages = await this.fetchConversationMessages(conversationId);
    } else {
      const index = messages.findIndex(m => m.id === focusedMessage.id);
      if (index === 0) return;

      newMessages = messages.slice(0, index + 1);
      if (focusedMessage.childConversationId) {
        const { childConversationId } = focusedMessage;
        const childMessages = await this.fetchConversationMessages(childConversationId);
        newMessages = newMessages.concat(childMessages);
      }
    }

    this.setState({ focusedMessage, messages: newMessages });
  }

  toggleReplyComposer() {
    this.setState(prevState => ({ isComposingReply: !prevState.isComposingReply }));
  }

  // Updates the URL in the address bar to reflect this conversation
  // https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries
  updateDisplayURL() {
    const { conversationId, meetingId } = this.props;
    const { origin } = window.location;

    const url = `${origin}/meetings/${meetingId}/conversations/${conversationId}`;
    window.history.replaceState({}, `conversation: ${conversationId}`, url);
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
      const secondIndex = messages.findIndex(m => m.id === focusedMessage.id);

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
    const {
      author,
      conversationId,
      meetingId,
      ...props
    } = this.props;

    const addReplyButton = (
      <AddReplyButton onClick={this.toggleReplyComposer}>
        <PlusSign>+</PlusSign>
        <ButtonText>ADD A REPLY</ButtonText>
      </AddReplyButton>
    );

    return (
      <StyledModal
        fade={false}
        {...props}
      >
        <MessagesSection>
          {messages.map(m => (
            <ReplyDisplay key={m.id}>
              <DiscussionTopicReply
                afterSubmit={this.updateMessageInList}
                conversationId={conversationId}
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
            <DiscussionTopicReply
              afterSubmit={this.updateMessageInList}
              conversationId={this.conversationIdForNewReply()}
              focusedMessage={focusedMessage}
              initialMode="compose"
              meetingId={meetingId}
              onCancelCompose={this.toggleReplyComposer}
            />
          )}
        </ActionsContainer>
      </StyledModal>
    );
  }
}

DiscussionTopicModal.propTypes = {
  author: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  conversationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  meetingId: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
};

export default withApollo(DiscussionTopicModal);
