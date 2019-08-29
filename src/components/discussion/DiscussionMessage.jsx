import React from 'react';
import PropTypes from 'prop-types';
// import { withApollo } from 'react-apollo';
import styled from '@emotion/styled/macro';

// import currentUserQuery from 'graphql/queries/currentUser';
// import createConversationMutation from 'graphql/mutations/createConversation';
// import createConversationMessageMutation from 'graphql/mutations/createConversationMessage';
// import meetingQuery from 'graphql/queries/meeting';
// import updateConversationMessageMutation from 'graphql/mutations/updateConversationMessage';
// import { getLocalUser } from 'utils/auth';

import AuthorDetails from 'components/shared/AuthorDetails';
import RovalEditor from 'components/editor/RovalEditor';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: `0px 0px 3px ${colors.grey7}`,
  cursor: 'default',
  marginBottom: '30px',
  padding: '20px 30px 25px',
}));

const MessageEditor = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: 400,
  marginTop: '15px',

  // HN: opportunity to DRY these up later once we find a pattern of typography
  // across different editor use cases
  'div:not(:first-of-type)': {
    marginTop: '1em',
  },

  h1: {
    fontSize: '28px',
    fontWeight: 600,
    marginTop: '1.4em',
  },

  h2: {
    fontSize: '24px',
    fontWeight: 500,
    marginTop: '1.3em',
  },

  h3: {
    fontSize: '20px',
    fontWeight: 500,
    marginTop: '1.2em',
  },
});

const DiscussionMessage = ({ message }) => {
  const { author, createdAt, updatedAt, body } = message;

  return (
    <Container>
      <AuthorDetails
        author={author}
        createdAt={createdAt}
        isEdited={createdAt !== updatedAt}
        mode="display" // change this later
      />
      <MessageEditor
        initialValue={body.payload}
        mode="display" // change this later
        // onCancel={handleCancel}
        // onSubmit={handleSubmit}
        contentType="largeReply"
      />
    </Container>
  );
};

// class DiscussionMessage extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       currentUser: null,
//       mode: props.initialMode,
//     };

//     this.handleCancel = this.handleCancel.bind(this);
//     this.handleFocusCurrentMessage = this.handleFocusCurrentMessage.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.createNestedConversation = this.createNestedConversation.bind(this);
//     this.toggleEditMode = this.toggleEditMode.bind(this);
//   }

//   async componentDidMount() {
//     const { client } = this.props;
//     const { userId } = getLocalUser();

//     const response = await client.query({ query: currentUserQuery, variables: { id: userId } });
//     if (response.data) this.setState({ currentUser: response.data.user });
//   }

//   async handleSubmit({ payload, text }) {
//     const { mode } = this.state;
//     const {
//       client,
//       conversationId,
//       meetingId,
//       message,
//       afterSubmit,
//     } = this.props;

//     // The currently focused message not having a conversation ID means we need to
//     // create a new (nested) one
//     if (!conversationId) return this.createNestedConversation({ payload, text });

//     const mutation = mode === 'compose'
//       ? createConversationMessageMutation : updateConversationMessageMutation;
//     const response = await client.mutate({
//       mutation,
//       variables: {
//         id: conversationId,
//         mid: message.id,
//         input: {
//           meetingId,
//           body: {
//             formatter: 'slatejs',
//             text,
//             payload,
//           },
//         },
//       },
//       refetchQueries: [{
//         query: meetingQuery,
//         variables: { id: meetingId },
//       }],
//     });

//     if (response.data) {
//       const { createConversationMessage, updateConversationMessage } = response.data;
//       const msg = mode === 'compose' ? createConversationMessage : updateConversationMessage;
//       afterSubmit(msg);
//       return Promise.resolve();
//     }

//     return Promise.reject(new Error('Failed to save discussion reply'));
//   }

//   handleCancel() {
//     const { onCancelCompose } = this.props;
//     const { mode } = this.state;
//     if (mode === 'edit') this.toggleEditMode();
//     if (mode === 'compose') onCancelCompose();
//   }

//   handleFocusCurrentMessage() {
//     const { mode } = this.state;
//     const { initialMode, message, handleFocusMessage } = this.props;
//     if (initialMode === 'compose' || mode !== 'display') return;

//     handleFocusMessage(message);
//   }

//   async createNestedConversation({ payload, text }) {
//     const { currentUser } = this.state;
//     const { afterSubmit, client, focusedMessage, meetingId: id } = this.props;
//     if (!focusedMessage) {
//       return Promise.reject(
//         new Error('No focused message found when creating nested conversation'),
//       );
//     }

//     const response = await client.mutate({
//       mutation: createConversationMutation,
//       variables: {
//         id,
//         input: {
//           parentId: focusedMessage.conversationId,
//           messages: [
//             focusedMessage,
//             {
//               body: {
//                 formatter: 'slatejs',
//                 text,
//                 payload,
//               },
//             },
//           ],
//         },
//       },
//     });

//     if (response.data) {
//       // TEMP: Append author manually, because backend doesn't provide it yet.
//       const newMessage = response.data.createConversation.messages[0];
//       newMessage.author = currentUser;

//       afterSubmit(newMessage);
//       return Promise.resolve();
//     }

//     return Promise.reject(new Error('Failed to create nested conversation'));
//   }

//   toggleEditMode(event) {
//     if (event) event.stopPropagation();
//     this.setState(prevState => ({ mode: prevState.mode === 'edit' ? 'display' : 'edit' }));
//   }

//   render() {
//     const { currentUser, mode } = this.state;
//     const {
//       conversationId,
//       meetingId,
//       message,
//       onCancelCompose,
//       size,
//       ...props
//     } = this.props;
//     if (!message.author && !currentUser) return null; // edge case

//     const fwdProps = {
//       author: message.author || currentUser,
//       conversationId,
//       handleCancel: this.handleCancel,
//       handleFocusCurrentMessage: this.handleFocusCurrentMessage,
//       handleSubmit: this.handleSubmit,
//       handleToggleEditMode: this.toggleEditMode,
//       message,
//       mode,
//       noHover: mode !== 'display',
//       ...props,
//     };

//     return size === 'large' ? <LargeReply {...fwdProps} /> : <SmallReply {...fwdProps} />;
//   }
// }

DiscussionMessage.propTypes = {
  message: PropTypes.object,
};

DiscussionMessage.defaultProps = {
  message: {},
};

export default DiscussionMessage;
