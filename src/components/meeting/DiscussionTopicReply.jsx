import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';

import currentUserQuery from 'graphql/currentUserQuery';
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

    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async componentDidMount() {
    const { client } = this.props;
    const { userId } = getLocalUser();

    const response = await client.query({ query: currentUserQuery, variables: { id: userId } });
    if (response.data) this.setState({ currentUser: response.data.user });
  }

  async handleSubmit({ payload, text }) {
    const { mode } = this.state;
    const mutation = mode === 'compose'
      ? createConversationMessageMutation : updateConversationMessageMutation;
    const {
      client,
      conversationId,
      meetingId,
      message,
      afterSubmit,
    } = this.props;

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
      afterSubmit();
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

  handleClick() {
    const { initialMode, message, handleFocusMessage } = this.props;
    if (initialMode === 'compose') return;

    handleFocusMessage(message);
  }

  toggleEditMode() {
    this.setState(prevState => ({ mode: prevState.mode === 'edit' ? 'display' : 'edit' }));
  }

  render() {
    const { currentUser, mode } = this.state;
    const {
      meetingId,
      message: {
        author,
        body,
        createdAt,
        id,
        updatedAt,
      },
      onCancelCompose,
      size,
      ...props
    } = this.props;
    if (!author && !currentUser) return null; // edge case

    const fwdProps = {
      author: author || currentUser,
      createdAt,
      handleCancel: this.handleCancel,
      handleSubmit: this.handleSubmit,
      handleToggleEditMode: this.toggleEditMode,
      id: mode === 'display' ? id : undefined,
      message: mode !== 'compose' ? body.payload : null,
      mode,
      onClick: this.handleClick,
      updatedAt,
      ...props,
    };

    return size === 'large' ? <LargeReply {...fwdProps} /> : <SmallReply {...fwdProps} />;
  }
}

DiscussionTopicReply.propTypes = {
  afterSubmit: PropTypes.func,
  client: PropTypes.object.isRequired,
  conversationId: PropTypes.string.isRequired,
  handleFocusMessage: PropTypes.func,
  initialMode: PropTypes.oneOf(['compose', 'display']),
  meetingId: PropTypes.string.isRequired,
  message: PropTypes.object,
  onCancelCompose: PropTypes.func,
  size: PropTypes.oneOf(['small', 'large']),
};

DiscussionTopicReply.defaultProps = {
  afterSubmit: () => {},
  handleFocusMessage: () => {},
  initialMode: 'display',
  message: {},
  onCancelCompose: () => {},
  size: 'small',
};

export default withApollo(DiscussionTopicReply);
