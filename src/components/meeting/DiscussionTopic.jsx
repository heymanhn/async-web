import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/currentUserQuery';
import meetingConversationQuery from 'graphql/meetingConversationQuery';
import createConversationMutation from 'graphql/createConversationMutation';
import updateConversationMessageMutation from 'graphql/updateConversationMessageMutation';
import withHover from 'utils/withHover';
import { getLocalUser, matchCurrentUserId } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import RovalEditor from 'components/editor/RovalEditor';
import ContentHeader from './ContentHeader';
import ContentToolbar from './ContentToolbar';
import DiscussionTopicModal from './DiscussionTopicModal';
import HoverMenu from './HoverMenu';

const Container = styled.div(({ mode, theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
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
  alignItems: 'center',
  justifyContent: 'space-between',

  position: 'relative',
});

const MessageDetails = styled.div({
  display: 'flex',
  alignItems: 'baseline',
});

const Author = styled.span(({ mode }) => ({
  fontSize: '14px',
  fontWeight: 600,
  marginRight: '20px',
  opacity: mode === 'compose' ? 0.5 : 1,
}));

const TopicEditor = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '25px',
  fontWeight: 400,
  marginTop: '10px',

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

const StyledHoverMenu = styled(HoverMenu)({
  position: 'absolute',
  right: '0px',
});

class DiscussionTopic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      author: null,
      initialValue: null,
      isModalVisible: props.forceDisplayModal,
      loading: true,
      messages: [],
      mode: props.initialMode,
      replyCount: null,
    };

    this.editor = React.createRef();

    this.displayModalIfNeeded = this.displayModalIfNeeded.bind(this);
    this.fetchConversationData = this.fetchConversationData.bind(this);
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
    } = this.props;
    const { userId } = getLocalUser();

    if (!conversationId) {
      const res = await client.query({ query: currentUserQuery, variables: { id: userId } });
      if (res.data) this.setState({ author: res.data.user, loading: false });
      return;
    }

    this.displayModalIfNeeded();
    this.fetchConversationData();
  }

  componentDidUpdate() {
    this.displayModalIfNeeded();
  }

  displayModalIfNeeded() {
    const { isModalVisible } = this.state;
    const { forceDisplayModal, initialMode, resetDisplayOverride } = this.props;

    // Ensures the user can actually close the modal
    if (forceDisplayModal) {
      if (!isModalVisible) this.setState({ isModalVisible: true, mode: initialMode });
      resetDisplayOverride();
    }
  }

  async fetchConversationData() {
    const { client, conversationId, meetingId } = this.props;

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
        initialValue: payload,
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
      initialValue,
      isModalVisible,
      loading,
      messages,
      mode,
      replyCount,
    } = this.state;

    const {
      conversationId,
      hover,
      onCancelCompose,
      meetingId,
      resetDisplayOverride,
      ...props
    } = this.props;

    if (loading) return null;

    const { createdAt, updatedAt } = mode === 'display' ? messages[0] : {};

    return (
      <Container mode={mode} onClick={this.handleLaunchModal} {...props}>
        <MainContainer mode={mode}>
          <AvatarWithMargin src={author.profilePictureUrl} size={36} mode={mode} />
          <ContentContainer>
            <TopicMetadata>
              <MessageDetails>
                <Author mode={mode}>{author.fullName}</Author>
                {mode === 'display' && (
                  <ContentHeader createdAt={createdAt} isEdited={createdAt !== updatedAt} />
                )}
              </MessageDetails>
              <StyledHoverMenu
                bgMode="grey"
                isOpen={hover && mode === 'display'}
                onEdit={this.toggleEditMode}
                showEditButton={matchCurrentUserId(author.id)}
                source="topic"
              />
            </TopicMetadata>
            <TopicEditor
              initialValue={initialValue}
              mode={mode}
              onCancel={this.handleCancel}
              onSubmit={this.handleSubmit}
              contentType="topic"
            />
          </ContentContainer>
        </MainContainer>
        {mode === 'display' && (
          <ContentToolbar
            contentType="topic"
            replyCount={replyCount}
          />
        )}
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
  afterSubmit: PropTypes.func,
  client: PropTypes.object.isRequired,
  conversationId: PropTypes.string,
  forceDisplayModal: PropTypes.bool,
  hover: PropTypes.bool.isRequired,
  initialMode: PropTypes.oneOf(['compose', 'display']),
  meetingId: PropTypes.string.isRequired,
  onCancelCompose: PropTypes.func,
  resetDisplayOverride: PropTypes.func,
};

DiscussionTopic.defaultProps = {
  afterSubmit: () => {},
  conversationId: null,
  forceDisplayModal: false,
  initialMode: 'display',
  onCancelCompose: () => {},
  resetDisplayOverride: () => {},
};

export default withApollo(withHover(DiscussionTopic));
