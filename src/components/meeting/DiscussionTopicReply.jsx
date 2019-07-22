import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';

import currentUserQuery from 'graphql/currentUserQuery';
import createConversationMutation from 'graphql/createConversationMutation';
import createConversationMessageMutation from 'graphql/createConversationMessageMutation';
import updateConversationMessageMutation from 'graphql/updateConversationMessageMutation';
import { getLocalUser } from 'utils/auth';

import LargeReply from './LargeReply';
import SmallReply from './SmallReply';

class DiscussionTopicReply extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      mode: props.initialMode,
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handleFocusCurrentMessage = this.handleFocusCurrentMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createNestedConversation = this.createNestedConversation.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async componentDidMount() {
    const { client } = this.props;
    const { userId } = getLocalUser();

    const response = await client.query({ query: currentUserQuery, variables: { id: userId } });
    if (response.data) this.setState({ currentUser: response.data.user });
  }

  async handleSubmit({ payload, text }) {
    const { mode } = this.state;
    const {
      client,
      conversationId,
      meetingId,
      message,
      afterSubmit,
    } = this.props;

    // The currently focused message not having a conversation ID means we need to
    // create a new (nested) one
    if (!conversationId) return this.createNestedConversation({ payload, text });

    const mutation = mode === 'compose'
      ? createConversationMessageMutation : updateConversationMessageMutation;
    const response = await client.mutate({
      mutation,
      variables: {
        id: conversationId,
        mid: message.id,
        input: {
          meetingId,
          body: {
            formatter: 'slatejs',
            text,
            payload,
          },
        },
      },
    });

    if (response.data) {
      const { createConversationMessage, updateConversationMessage } = response.data;
      const msg = mode === 'compose' ? createConversationMessage : updateConversationMessage;
      afterSubmit(msg);
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to save discussion topic reply'));
  }

  handleCancel() {
    const { onCancelCompose } = this.props;
    const { mode } = this.state;
    if (mode === 'edit') this.toggleEditMode();
    if (mode === 'compose') onCancelCompose();
  }

  handleFocusCurrentMessage() {
    const { mode } = this.state;
    const { initialMode, message, handleFocusMessage } = this.props;
    if (initialMode === 'compose' || mode !== 'display') return;

    handleFocusMessage(message);
  }

  async createNestedConversation({ payload, text }) {
    const { currentUser } = this.state;
    const { afterSubmit, client, focusedMessage, meetingId: id } = this.props;
    if (!focusedMessage) {
      return Promise.reject(
        new Error('No focused message found when creating nested conversation'),
      );
    }

    const response = await client.mutate({
      mutation: createConversationMutation,
      variables: {
        id,
        input: {
          parentId: focusedMessage.conversationId,
          messages: [
            focusedMessage,
            {
              body: {
                formatter: 'slatejs',
                text,
                payload,
              },
            },
          ],
        },
      },
    });

    if (response.data) {
      // TEMP: Append author manually, because backend doesn't provide it yet.
      const newMessage = response.data.createConversation.messages[0];
      newMessage.author = currentUser;

      afterSubmit(newMessage);
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to create nested conversation'));
  }

  toggleEditMode(event) {
    if (event) event.stopPropagation();
    this.setState(prevState => ({ mode: prevState.mode === 'edit' ? 'display' : 'edit' }));
  }

  render() {
    const { currentUser, mode } = this.state;
    const {
      conversationId,
      meetingId,
      message,
      onCancelCompose,
      size,
      ...props
    } = this.props;
    if (!message.author && !currentUser) return null; // edge case

    const fwdProps = {
      author: message.author || currentUser,
      conversationId,
      handleCancel: this.handleCancel,
      handleFocusCurrentMessage: this.handleFocusCurrentMessage,
      handleSubmit: this.handleSubmit,
      handleToggleEditMode: this.toggleEditMode,
      message,
      mode,
      ...props,
    };

    return size === 'large' ? <LargeReply {...fwdProps} /> : <SmallReply {...fwdProps} />;
  }
}

DiscussionTopicReply.propTypes = {
  afterSubmit: PropTypes.func,
  client: PropTypes.object.isRequired,
  conversationId: PropTypes.string,
  focusedMessage: PropTypes.object,
  handleFocusMessage: PropTypes.func,
  initialMode: PropTypes.oneOf(['compose', 'display']),
  meetingId: PropTypes.string.isRequired,
  message: PropTypes.object,
  onCancelCompose: PropTypes.func,
  size: PropTypes.oneOf(['small', 'large']),
};

DiscussionTopicReply.defaultProps = {
  afterSubmit: () => {},
  conversationId: null,
  focusedMessage: null,
  handleFocusMessage: () => {},
  initialMode: 'display',
  message: {},
  onCancelCompose: () => {},
  size: 'small',
};

export default withApollo(DiscussionTopicReply);
