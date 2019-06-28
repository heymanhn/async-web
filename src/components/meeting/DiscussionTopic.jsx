import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/currentUserQuery';
import meetingConversationQuery from 'graphql/meetingConversationQuery';
import createConversationMutation from 'graphql/createConversationMutation';
import updateConversationMessageMutation from 'graphql/updateConversationMessageMutation';
import { getLocalUser, matchCurrentUserId } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import RovalEditor from 'components/shared/RovalEditor';
import ContentToolbar from './ContentToolbar';
import DiscussionTopicModal from './DiscussionTopicModal';

const Container = styled.div(({ mode, theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.grey5}`,
  borderRadius: '5px',
  boxShadow: `0px 1px 3px ${colors.buttonGrey}`,
  cursor: mode === 'display' ? 'pointer' : 'initial',
  marginBottom: '20px',
  width: '100%',
}));

const MainContainer = styled.div(({ mode }) => ({
  display: 'flex',
  flexDirection: 'row',
  margin: '20px',
  marginBottom: mode !== 'display' ? '0' : '20px',
}));

const AvatarWithMargin = styled(Avatar)(({ mode }) => ({
  marginRight: '12px',
  opacity: mode === 'compose' ? 0.5 : 1,
}));

const ContentContainer = styled.div({
  width: '100%',
});

const TopicMetadata = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
});

const Author = styled.span(({ mode }) => ({
  fontSize: '14px',
  fontWeight: 600,
  marginRight: '20px',
  opacity: mode === 'compose' ? 0.5 : 1,
}));

const EditorContent = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '25px',
  fontWeight: 400,
  marginTop: '10px',

  'div:not(:first-of-type)': {
    marginTop: '1em',
  },
});

const ActionsContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.formGrey,
  borderRadius: '0 0 5px 5px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: '68px',
  paddingRight: '20px',
  minHeight: '56px',
}));

const AddReplyButton = styled.div({
  fontSize: '14px',
  fontWeight: 500,
});

class DiscussionTopic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      author: null,
      initialContent: null,
      isModalVisible: props.forceDisplayModal,
      loading: true,
      messages: [],
      mode: props.initialMode,
      replyCount: null,
    };

    this.editor = React.createRef();

    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleLaunchModal = this.handleLaunchModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  async componentDidMount() {
    const {
      client,
      conversationId,
      forceDisplayModal,
      meetingId,
      resetDisplayOverride,
    } = this.props;
    const { userId } = getLocalUser();

    // Ensures the user can actually close the modal
    if (forceDisplayModal) resetDisplayOverride();

    if (!conversationId) {
      // Assumes that currentUserQuery is already run once from <AvatarDropdown />
      const { user } = client.readQuery({ query: currentUserQuery, variables: { id: userId } });
      this.setState({ author: user, loading: false });
      return;
    }

    // Assumes each conversation has at least one message from here on out
    const response = await client.query({
      query: meetingConversationQuery,
      variables: { meetingId, conversationId },
    });

    if (response.data && response.data.conversation) {
      const { author, messages } = response.data.conversation;
      const replyCount = messages.length - 1;
      const { body: { payload } } = messages[0];

      this.setState({
        initialContent: payload,
        author,
        loading: false,
        messages,
        replyCount,
      });
    }
  }

  async handleCreate({ payload, text }) {
    const { client, meetingId: id, afterSubmit } = this.props;
    const response = await client.mutate({
      mutation: createConversationMutation,
      variables: {
        id,
        input: {
          messages: [{
            body: {
              formatter: 'slatejs',
              text,
              payload,
            },
          }],
        },
      },
    });

    if (response.data) {
      afterSubmit();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to create discussion topic'));
  }

  // Assumes there's at least one message in the conversation
  async handleUpdate({ payload, text }) {
    const { messages } = this.state;

    const { client, conversationId, meetingId, afterSubmit } = this.props;
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
      afterSubmit();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to save discussion topic'));
  }

  handleSubmit(props) {
    const { mode } = this.state;
    return mode === 'compose' ? this.handleCreate(props) : this.handleUpdate(props);
  }

  toggleModal() {
    const { mode } = this.state;
    if (mode !== 'display') return;

    this.setState(prevState => ({ isModalVisible: !prevState.isModalVisible }));
  }

  toggleEditMode(event) {
    if (event) event.stopPropagation();

    this.setState(prevState => ({ mode: prevState.mode === 'edit' ? 'display' : 'edit' }));
  }

  // HN: this is the same as DiscussionTopicReply, can be DRY'ed up in a HOC
  handleCancel() {
    const { onCancelCompose } = this.props;
    const { mode } = this.state;
    if (mode === 'edit') this.toggleEditMode();
    if (mode === 'compose') onCancelCompose();
  }

  // HN: Because somehow some mouse events on the modal are triggering the onClick() handlers of
  // the UI in the background
  handleLaunchModal() {
    const { isModalVisible } = this.state;
    if (!isModalVisible) this.toggleModal();
  }

  render() {
    const {
      author,
      initialContent,
      isModalVisible,
      loading,
      messages,
      mode,
      replyCount,
    } = this.state;

    const {
      conversationId,
      onCancelCompose,
      meetingId,
      resetDisplayOverride,
      ...props
    } = this.props;

    if (loading) return null;

    const replyButton = (
      <AddReplyButton>
        {replyCount > 0 ? Pluralize('reply', replyCount, true) : '+ Add a reply'}
      </AddReplyButton>
    );

    const { createdAt, updatedAt } = mode === 'display' ? messages[0] : {};

    return (
      <Container mode={mode} onClick={this.handleLaunchModal} {...props}>
        <MainContainer mode={mode}>
          <AvatarWithMargin src={author.profilePictureUrl} size={36} mode={mode} />
          <ContentContainer>
            <TopicMetadata>
              <Author mode={mode}>{author.fullName}</Author>
              {mode === 'display' && (
                <ContentToolbar
                  createdAt={createdAt}
                  isEditable={matchCurrentUserId(author.id)}
                  isEdited={createdAt !== updatedAt}
                  onEdit={this.toggleEditMode}
                />
              )}
            </TopicMetadata>
            <EditorContent
              initialContent={initialContent}
              mode={mode}
              onCancel={this.handleCancel}
              onSubmit={this.handleSubmit}
              source="discussionTopic"
            />
          </ContentContainer>
        </MainContainer>
        {mode === 'display' && <ActionsContainer>{replyButton}</ActionsContainer>}
        {conversationId && (
          <DiscussionTopicModal
            author={author}
            conversationId={conversationId}
            isOpen={isModalVisible}
            meetingId={meetingId}
            messages={messages}
            toggle={this.toggleModal}
          />
        )}
      </Container>
    );
  }
}

DiscussionTopic.propTypes = {
  client: PropTypes.object.isRequired,
  conversationId: PropTypes.string,
  forceDisplayModal: PropTypes.bool,
  initialMode: PropTypes.oneOf(['compose', 'display']),
  meetingId: PropTypes.string.isRequired,
  afterSubmit: PropTypes.func,
  onCancelCompose: PropTypes.func,
  resetDisplayOverride: PropTypes.func,
};

DiscussionTopic.defaultProps = {
  conversationId: null,
  forceDisplayModal: false,
  initialMode: 'display',
  onCancelCompose: () => {},
  afterSubmit: () => {},
  resetDisplayOverride: () => {},
};

export default withApollo(DiscussionTopic);
