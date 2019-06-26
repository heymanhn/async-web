import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import Pluralize from 'pluralize';
import isHotKey from 'is-hotkey';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/currentUserQuery';
import meetingConversationQuery from 'graphql/meetingConversationQuery';
import createConversationMutation from 'graphql/createConversationMutation';
import updateConversationMessageMutation from 'graphql/updateConversationMessageMutation';
import { initialValue, discussionTopicPlugins } from 'utils/slateHelper';
import { getLocalUser, matchCurrentUserId } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import ContentToolbar from './ContentToolbar';
import DiscussionTopicModal from './DiscussionTopicModal';
import TopicEditorActions from './TopicEditorActions';

const Container = styled.div(({ mode, theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.grey5}`,
  borderRadius: '5px',
  boxShadow: `0px 1px 3px ${colors.buttonGrey}`,
  cursor: mode === 'display' ? 'pointer' : 'initial',
  marginBottom: '20px',
  width: '100%',
}));

const MainContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  margin: '20px',
});

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

const Content = styled(Editor)({
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
      content: Value.fromJSON(initialValue),
      author: null,
      isModalVisible: props.forceDisplayModal,
      loading: true,
      messages: [],
      mode: props.mode,
      replyCount: null,
    };

    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.handleCancelCompose = this.handleCancelCompose.bind(this);
    this.isTopicEmpty = this.isTopicEmpty.bind(this);
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
        content: Value.fromJSON(JSON.parse(payload)),
        author,
        loading: false,
        messages,
        replyCount,
      });
    }
  }

  handleChangeContent({ value }) {
    this.setState({ content: value });
  }

  async handleCreate({ hideCompose = true } = {}) {
    const { content } = this.state;
    if (this.isTopicEmpty()) return;

    const { client, meetingId: id, onCancelCompose, afterSubmit } = this.props;
    const response = await client.mutate({
      mutation: createConversationMutation,
      variables: {
        id,
        input: {
          messages: [{
            body: {
              formatter: 'slatejs',
              text: Plain.serialize(content),
              payload: JSON.stringify(content.toJSON()),
            },
          }],
        },
      },
    });

    if (response.data) {
      afterSubmit();
      this.setState({ content: Value.fromJSON(initialValue) });
      if (hideCompose) onCancelCompose();
    }
  }

  // Assumes there's at least one message in the conversation
  async handleUpdate() {
    const { content, messages } = this.state;
    if (this.isTopicEmpty()) return;

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
            text: Plain.serialize(content),
            payload: JSON.stringify(content.toJSON()),
          },
        },
      },
    });

    if (response.data) {
      afterSubmit();
      this.handleCancelCompose();
    }
  }


  handleKeyDown(event, editor, next) {
    const { mode } = this.state;
    if (isHotKey('Enter', event)) event.preventDefault();

    if (mode === 'compose' && isHotKey('shift+Enter', event)) {
      return this.handleCreate({ hideCompose: false });
    }
    if (isHotKey('mod+Enter', event)) {
      return mode === 'compose' ? this.handleCreate() : this.handleUpdate();
    }

    if (isHotKey('Esc', event)) this.handleCancelCompose();

    return next();
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

  // HN: some of this is duplicative to DiscussionTopicReply, can be DRY'ed up
  handleCancelCompose() {
    const { onCancelCompose } = this.props;
    const { mode } = this.state;
    if (mode === 'edit') {
      this.setState({ mode: 'display' });
    } else {
      onCancelCompose();
    }
  }

  isTopicEmpty() {
    const { content } = this.state;
    return !Plain.serialize(content);
  }

  render() {
    const {
      author,
      content,
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
      <Container mode={mode} onClick={this.toggleModal} {...props}>
        <MainContainer>
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
            <Content
              autoFocus={['compose', 'edit'].includes(mode)}
              readOnly={mode === 'display'}
              onChange={this.handleChangeContent}
              onKeyDown={this.handleKeyDown}
              value={content}
              plugins={discussionTopicPlugins}
            />
          </ContentContainer>
        </MainContainer>
        <ActionsContainer>
          {['compose', 'edit'].includes(mode) ? (
            <TopicEditorActions
              isSubmitDisabled={this.isTopicEmpty()}
              mode={mode}
              onCancel={this.handleCancelCompose}
              onCreate={this.handleCreate}
              onUpdate={this.handleUpdate}
            />
          ) : replyButton}
        </ActionsContainer>
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
  meetingId: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['compose', 'display', 'edit']),
  afterSubmit: PropTypes.func,
  onCancelCompose: PropTypes.func,
  resetDisplayOverride: PropTypes.func,
};

DiscussionTopic.defaultProps = {
  conversationId: null,
  forceDisplayModal: false,
  mode: 'display',
  onCancelCompose: () => {},
  afterSubmit: () => {},
  resetDisplayOverride: () => {},
};

export default withApollo(DiscussionTopic);
