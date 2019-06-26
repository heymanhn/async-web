import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import { Modal } from 'reactstrap';
import isHotKey from 'is-hotkey';
import styled from '@emotion/styled/macro';

import conversationMessagesQuery from 'graphql/conversationMessagesQuery';
import updateConversationMessageMutation from 'graphql/updateConversationMessageMutation';
import { matchCurrentUserId } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import ContentToolbar from './ContentToolbar';
import DiscussionTopicReply from './DiscussionTopicReply';
import EditorActions from './EditorActions';

const StyledModal = styled(Modal)(({ theme: { maxModalViewport } }) => ({
  margin: '100px auto',
  width: maxModalViewport,
  maxWidth: maxModalViewport,

  '.modal-content': {
    border: 'none',
  },
}));

const TopicSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  margin: '25px 30px 30px',
});

const Header = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const AuthorSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const AvatarWithMargin = styled(Avatar)(({ mode }) => ({
  marginRight: '12px',
  opacity: mode === 'compose' ? 0.5 : 1,
}));

const Details = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Author = styled.span({
  fontWeight: 600,
  fontSize: '18px',
});

const Content = styled(Editor)({
  fontSize: '16px',
  lineHeight: '25px',
  fontWeight: 400,
  marginTop: '20px',

  'div:not(:first-of-type)': {
    marginTop: '1em',
  },
});

const RepliesSection = styled.div(({ theme: { colors } }) => ({
  background: colors.formGrey,
  borderTop: `1px solid ${colors.borderGrey}`,
}));

const RepliesLabel = styled.div({
  fontSize: '14px',
  fontWeight: 500,
  marginTop: '25px',
  marginLeft: '30px',
});

const Separator = styled.hr(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  margin: 0,
  marginLeft: '78px', // Assuming 36px avatars, 12px padding, 30px element margin
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
      isEditingTopic: false,
      isComposingReply: false,
      messages: props.messages,
      topicMessage: Value.fromJSON(JSON.parse(props.messages[0].body.payload)),
    };

    this.toggleComposeMode = this.toggleComposeMode.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.refetchMessages = this.refetchMessages.bind(this);
    this.updateDisplayURL = this.updateDisplayURL.bind(this);
    this.resetDisplayURL = this.resetDisplayURL.bind(this);
    this.handleUpdateTopicMessage = this.handleUpdateTopicMessage.bind(this);
    this.handleChangeTopicMessage = this.handleChangeTopicMessage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCancelEditMode = this.handleCancelEditMode.bind(this);
    this.isTopicEmpty = this.isTopicEmpty.bind(this);
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

  toggleComposeMode() {
    this.setState(prevState => ({ isComposingReply: !prevState.isComposingReply }));
  }

  toggleEditMode() {
    this.setState(prevState => ({ isEditingTopic: !prevState.isEditingTopic }));
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

      this.setState({
        isEditingTopic: false,
        messages,
        topicMessage: Value.fromJSON(JSON.parse(messages[0].body.payload)),
      });
    } else {
      console.log('Error re-fetching conversation messages');
    }
  }

  async handleUpdateTopicMessage() {
    const { messages, topicMessage } = this.state;
    if (this.isTopicEmpty()) return;

    const { client, conversationId, meetingId } = this.props;

    const response = await client.mutate({
      mutation: updateConversationMessageMutation,
      variables: {
        id: conversationId,
        mid: messages[0].id,
        input: {
          meetingId,
          body: {
            formatter: 'slatejs',
            text: Plain.serialize(topicMessage),
            payload: JSON.stringify(topicMessage.toJSON()),
          },
        },
      },
    });

    if (response.data && response.data.updateConversationMessage) this.refetchMessages();
  }

  handleKeyDown(event, editor, next) {
    if (isHotKey('Enter', event)) event.preventDefault();

    if (isHotKey('mod+Enter', event)) return this.handleUpdateTopicMessage();

    return next();
  }

  handleChangeTopicMessage({ value }) {
    this.setState({ topicMessage: value });
  }

  handleCancelEditMode() {
    const { messages } = this.state;
    this.setState({ topicMessage: Value.fromJSON(JSON.parse(messages[0].body.payload)) });
    this.toggleEditMode();
  }

  isTopicEmpty() {
    const { topicMessage } = this.state;
    return !Plain.serialize(topicMessage);
  }

  render() {
    const { isComposingReply, isEditingTopic, messages, topicMessage } = this.state;
    const {
      author,
      conversationId,
      meetingId,
      ...props
    } = this.props;

    const addReplyButton = (
      <AddReplyButton onClick={this.toggleComposeMode}>
        <PlusSign>+</PlusSign>
        <ButtonText>ADD A REPLY</ButtonText>
      </AddReplyButton>
    );

    const { createdAt, updatedAt } = messages[0];

    return (
      <StyledModal
        fade={false}
        {...props}
      >
        <TopicSection>
          <Header>
            <AuthorSection>
              <AvatarWithMargin src={author.profilePictureUrl} size={45} />
              <Details>
                <Author>{author.fullName}</Author>
                {!isEditingTopic && (
                  <ContentToolbar
                    createdAt={createdAt}
                    isEditable={matchCurrentUserId(author.id)}
                    isEdited={createdAt !== updatedAt}
                    onEdit={this.toggleEditMode}
                  />
                )}
              </Details>
            </AuthorSection>
          </Header>
          <Content
            onChange={this.handleChangeTopicMessage}
            onKeyDown={this.handleKeyDown}
            readOnly={!isEditingTopic}
            value={topicMessage}
          />
          {isEditingTopic && (
            <EditorActions
              isSubmitDisabled={this.isTopicEmpty()}
              mode="edit"
              onCancel={this.handleCancelEditMode}
              onSubmit={this.handleUpdateTopicMessage}
            />
          )}
        </TopicSection>
        {messages.length > 1 && (
          <RepliesSection>
            <RepliesLabel>REPLIES</RepliesLabel>
            {messages.slice(1).map(m => (
              <ReplyDisplay key={m.id}>
                <DiscussionTopicReply
                  mode="display"
                  conversationId={conversationId}
                  key={m.id}
                  meetingId={meetingId}
                  message={m}
                />
                <Separator />
              </ReplyDisplay>
            ))}
          </RepliesSection>
        )}
        <ActionsContainer>
          {!isComposingReply ? addReplyButton : (
            <DiscussionTopicReply
              mode="compose"
              afterSubmit={this.refetchMessages}
              conversationId={conversationId}
              replyCount={messages.length - 1}
              meetingId={meetingId}
              onCancelCompose={this.toggleComposeMode}
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
