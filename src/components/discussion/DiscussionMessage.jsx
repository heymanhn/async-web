import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo';
import styled from '@emotion/styled/macro';

// import currentUserQuery from 'graphql/queries/currentUser';
// import createConversationMessageMutation from 'graphql/mutations/createConversationMessage';
// import meetingQuery from 'graphql/queries/meeting';
// import { getLocalUser } from 'utils/auth';

import createConversationMessageMutation from 'graphql/mutations/createConversationMessage';
import updateConversationMessageMutation from 'graphql/mutations/updateConversationMessage';
import useHover from 'utils/hooks/useHover';

import AuthorDetails from 'components/shared/AuthorDetails';
import RovalEditor from 'components/editor/RovalEditor';
import HoverMenu from './HoverMenu';
import MessageReactions from './MessageReactions';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: `0px 0px 3px ${colors.grey7}`,
  cursor: 'default',
  marginBottom: '30px',
  padding: '20px 30px 25px',
}));

const HeaderSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
});

const StyledHoverMenu = styled(HoverMenu)({
  position: 'absolute',
  right: '0px',
});

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

const DiscussionMessage = ({ initialMode, initialMessage, ...props }) => {
  const client = useApolloClient();
  const [mode, setMode] = useState(initialMode);
  function setToDisplayMode() { setMode('display'); }
  function setToEditMode() { setMode('edit'); }
  const { hover, ...hoverProps } = useHover(mode !== 'display');

  const [message, setMessage] = useState(initialMessage);
  const { author, conversationId, createdAt, id: messageId, updatedAt, body } = message;

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit({ payload, text }) {
    setIsSubmitting(true);

    if (!conversationId) {
      console.log("TODO: creating new conversation?");
    }

    const { data } = await client.mutate({
      mutation: updateConversationMessageMutation,
      variables: {
        conversationId,
        messageId,
        input: {
          body: {
            formatter: 'slatejs',
            text,
            payload,
          },
        },
      },
    });

    if (data.updateConversationMessage) {
      setMessage(data.updateConversationMessage);
      setIsSubmitting(false);
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to save discussion message'));
  }


  return (
    <Container {...hoverProps} {...props}>
      <HeaderSection>
        <AuthorDetails
          author={author}
          createdAt={createdAt}
          isEdited={createdAt !== updatedAt}
          mode="display" // change this later
        />
        {conversationId && (
          <StyledHoverMenu
            conversationId={conversationId}
            handleEdit={setToEditMode}
            isOpen={hover}
            messageId={messageId}
          />
        )}
      </HeaderSection>
      <MessageEditor
        initialValue={body.payload}
        isSubmitting={isSubmitting}
        mode={mode}
        onCancel={setToDisplayMode}
        onSubmit={handleSubmit}
        contentType="message"
      />
      {mode === 'display' && (
        <MessageReactions conversationId={conversationId} messageId={messageId} />
      )}
    </Container>
  );
};

// class DiscussionReply extends Component {
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
  initialMode: PropTypes.oneOf(['compose', 'display', 'edit']),
  initialMessage: PropTypes.object,
};

DiscussionMessage.defaultProps = {
  initialMode: 'display',
  initialMessage: {},
};

export default DiscussionMessage;
