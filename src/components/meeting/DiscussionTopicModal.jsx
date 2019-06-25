import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Moment from 'react-moment';
import { Modal } from 'reactstrap';
import styled from '@emotion/styled/macro';

import conversationMessagesQuery from 'graphql/conversationMessagesQuery';
import menuIcon from 'images/icons/menu.png';

import Avatar from 'components/shared/Avatar';
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

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '14px',
}));

const StyledImg = styled.img({
  width: '26px',
  height: 'auto',
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

const ReplyComposer = styled(DiscussionTopicReply)(({ replyCount, theme: { colors } }) => ({
  background: replyCount === 0 ? colors.formGrey : 'initial',
}));

class DiscussionTopicModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isComposingReply: false,
      messages: props.messages,
    };

    this.toggleComposeMode = this.toggleComposeMode.bind(this);
    this.refetchMessages = this.refetchMessages.bind(this);
    this.updateDisplayURL = this.updateDisplayURL.bind(this);
    this.resetDisplayURL = this.resetDisplayURL.bind(this);
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

  render() {
    const { isComposingReply, messages } = this.state;
    const {
      author,
      conversationId,
      createdAt,
      meetingId,
      ...props
    } = this.props;

    const addReplyButton = (
      <AddReplyButton onClick={this.toggleComposeMode}>
        <PlusSign>+</PlusSign>
        <ButtonText>ADD A REPLY</ButtonText>
      </AddReplyButton>
    );

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
                <Timestamp fromNow parse="X">{createdAt}</Timestamp>
              </Details>
            </AuthorSection>
            <StyledImg alt="Menu" src={menuIcon} />
          </Header>
          <Content
            readOnly
            value={Value.fromJSON(JSON.parse(messages[0].body.payload))}
          />
        </TopicSection>
        {messages.length > 1 && (
          <RepliesSection>
            <RepliesLabel>REPLIES</RepliesLabel>
            {messages.slice(1).map(m => (
              <ReplyDisplay key={m.id}>
                <DiscussionTopicReply
                  author={m.author}
                  conversationId={conversationId}
                  createdAt={m.createdAt}
                  key={m.id}
                  meetingId={meetingId}
                  message={m.body.payload}
                  messageId={m.id}
                  mode="display"
                />
                <Separator />
              </ReplyDisplay>
            ))}
          </RepliesSection>
        )}
        <ActionsContainer>
          {!isComposingReply ? addReplyButton : (
            <ReplyComposer
              afterCreate={this.refetchMessages}
              conversationId={conversationId}
              replyCount={messages.length - 1}
              meetingId={meetingId}
              mode="compose"
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
  createdAt: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  meetingId: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
};

export default withApollo(DiscussionTopicModal);
