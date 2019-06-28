import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Modal } from 'reactstrap';
import styled from '@emotion/styled/macro';

import conversationMessagesQuery from 'graphql/conversationMessagesQuery';
import updateConversationMessageMutation from 'graphql/updateConversationMessageMutation';
import { matchCurrentUserId } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import RovalEditor from 'components/shared/RovalEditor';
import ContentToolbar from './ContentToolbar';
import DiscussionTopicReply from './DiscussionTopicReply';

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

const TopicEditor = styled(RovalEditor)({
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
      isComposingReply: false,
      messages: props.messages,
      mode: 'display',
    };

    this.toggleIsComposing = this.toggleIsComposing.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.refetchMessages = this.refetchMessages.bind(this);
    this.updateDisplayURL = this.updateDisplayURL.bind(this);
    this.resetDisplayURL = this.resetDisplayURL.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  toggleIsComposing() {
    this.setState(prevState => ({ isComposingReply: !prevState.isComposingReply }));
  }

  toggleEditMode() {
    this.setState(prevState => ({ mode: prevState.mode === 'edit' ? 'display' : 'edit' }));
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

      this.setState({ mode: 'display', messages });
    } else {
      console.log('Error re-fetching conversation messages');
    }
  }

  async handleSubmit({ payload, text }) {
    const { messages } = this.state;
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
            text,
            payload,
          },
        },
      },
    });

    if (response.data) {
      this.refetchMessages();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update discussion topic'));
  }

  render() {
    const { isComposingReply, messages, mode } = this.state;
    const {
      author,
      conversationId,
      meetingId,
      ...props
    } = this.props;

    const addReplyButton = (
      <AddReplyButton onClick={this.toggleisComposing}>
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
                {mode === 'display' && (
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
          <TopicEditor
            initialContent={messages[0].body.payload}
            mode={mode}
            onCancel={this.toggleEditMode}
            onSubmit={this.handleSubmit}
            source="discussionTopicModal"
          />
        </TopicSection>
        {messages.length > 1 && (
          <RepliesSection>
            <RepliesLabel>REPLIES</RepliesLabel>
            {messages.slice(1).map(m => (
              <ReplyDisplay key={m.id}>
                <DiscussionTopicReply
                  afterSubmit={this.refetchMessages}
                  conversationId={conversationId}
                  initialMode="display"
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
              afterSubmit={this.refetchMessages}
              conversationId={conversationId}
              initialMode="compose"
              replyCount={messages.length - 1}
              meetingId={meetingId}
              onCancelCompose={this.toggleIsComposing}
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
