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
    };

    this.toggleReplyComposer = this.toggleReplyComposer.bind(this);
    this.refetchMessages = this.refetchMessages.bind(this);
    this.updateDisplayURL = this.updateDisplayURL.bind(this);
    this.resetDisplayURL = this.resetDisplayURL.bind(this);
    this.replyCountForMessage = this.replyCountForMessage.bind(this);
    this.sizeForMessage = this.sizeForMessage.bind(this);
    this.handleFocusOnMessage = this.handleFocusOnMessage.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;
    if (!prevProps.isOpen && isOpen) this.updateDisplayURL();
    if (prevProps.isOpen && !isOpen) this.resetDisplayURL();
  }

  // Updates the URL in the address bar to reflect this conversation
  // https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries
  updateDisplayURL() {
    const { conversationId, meetingId } = this.props;
    const { origin } = window.location;

    const url = `${origin}/meetings/${meetingId}/conversations/${conversationId}`;
    window.history.replaceState({}, `conversation: ${conversationId}`, url);
  }

  resetDisplayURL() {
    const { meetingId } = this.props;
    const url = `${origin}/meetings/${meetingId}`;
    window.history.replaceState({}, `meeting: ${meetingId}`, url);
  }

  toggleReplyComposer() {
    this.setState(prevState => ({ isComposingReply: !prevState.isComposingReply }));
  }

  async refetchMessages() {
    const { client, conversationId } = this.props;
    const response = await client.query({
      query: conversationMessagesQuery,
      variables: { id: conversationId },
      fetchPolicy: 'no-cache',
    });

    if (response.data && response.data.conversationMessagesQuery) {
      const { items } = response.data.conversationMessagesQuery;
      const messages = (items || []).map(i => i.message);

      this.setState({ messages });
    } else {
      console.log('Error re-fetching conversation messages');
    }
  }

  // HN: Change this later, once the messageCount field is returned from backend
  replyCountForMessage(message) {
    const { messages } = this.state;
    if (message.id === messages[0].id) return messages.length - 1;
    return message.replyCount || 0;
  }

  sizeForMessage(id) {
    const { focusedMessage, messages } = this.state;
    if (focusedMessage) return focusedMessage.id === id ? 'large' : 'small';

    return messages[0].id === id ? 'large' : 'small';
  }

  handleFocusOnMessage(message) {
    const { focusedMessage, parentConversation } = this.state;

    if (focusedMessage && focusedMessage.id === message.id) {
      return this.setState({
        focusedMessage: parentConversation ? parentConversation.messages[0] : null,
      });
    }

    return this.setState({ focusedMessage: message });
  }

  render() {
    const { isComposingReply, messages } = this.state;
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
                afterSubmit={this.refetchMessages}
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
              afterSubmit={this.refetchMessages}
              conversationId={conversationId}
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
