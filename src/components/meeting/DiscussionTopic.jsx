import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import Moment from 'react-moment';
import Pluralize from 'pluralize';
import isHotKey from 'is-hotkey';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/currentUserQuery';
import meetingConversationQuery from 'graphql/meetingConversationQuery';
import createConversationMutation from 'graphql/createConversationMutation';
import { initialValue, discussionTopicPlugins } from 'utils/slateHelper';
import { getLocalUser } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import Button from 'components/shared/Button';

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

const AdditionalInfo = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '14px',
}));

const EditButtonSeparator = styled.span(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  margin: '0 10px',
}));

const EditedLabel = styled.span(({ theme: { colors } }) => ({
  color: colors.grey4,
  cursor: 'default',
  fontSize: '14px',
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

const SmallButton = styled(Button)({
  marginRight: '10px',
  padding: '5px 20px',
});

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
      replyCount: null,
    };

    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
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
    const { client, meetingId: id, onCancelCompose, afterCreate } = this.props;

    try {
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

      if (response.data && response.data.createConversation) {
        afterCreate();
        this.setState({ content: Value.fromJSON(initialValue) });
        if (hideCompose) onCancelCompose();
      }
    } catch (err) {
      // No error handling yet
      console.log('error creating conversation topic');
    }
  }

  handleKeyDown(event, editor, next) {
    if (isHotKey('Enter', event)) event.preventDefault();

    if (isHotKey('shift+Enter', event)) return this.handleCreate({ hideCompose: false });
    if (isHotKey('mod+Enter', event)) return this.handleCreate();

    return next();
  }

  toggleModal() {
    this.setState(prevState => ({ isModalVisible: !prevState.isModalVisible }));
  }

  render() {
    const {
      author,
      content,
      isModalVisible,
      loading,
      messages,
      replyCount,
    } = this.state;

    const {
      conversationId,
      onCancelCompose,
      meetingId,
      mode,
      resetDisplayOverride,
      ...props
    } = this.props;

    if (loading) return null;

    const composeBtns = (
      <React.Fragment>
        <SmallButton title="Add Topic" onClick={this.handleCreate} />
        <SmallButton type="light" title="Cancel" onClick={onCancelCompose} />
      </React.Fragment>
    );

    const replyButton = (
      <AddReplyButton>
        {replyCount > 0 ? Pluralize('reply', replyCount, true) : '+ Add a reply'}
      </AddReplyButton>
    );

    const { createdAt, updatedAt } = mode === 'display' ? messages : {};

    return (
      <Container mode={mode} onClick={this.toggleModal} {...props}>
        <MainContainer>
          <AvatarWithMargin src={author.profilePictureUrl} size={36} mode={mode} />
          <ContentContainer>
            <TopicMetadata>
              <Author mode={mode}>{author.fullName}</Author>
              <AdditionalInfo>
                {createdAt && <Timestamp fromNow parse="X">{createdAt}</Timestamp>}
                {/* DRY THIS UP PLEASE */}
                {createdAt !== updatedAt && (
                  <React.Fragment>
                    <EditButtonSeparator>&#8226;</EditButtonSeparator>
                    <EditedLabel>Edited</EditedLabel>
                  </React.Fragment>
                )}
              </AdditionalInfo>
            </TopicMetadata>
            <Content
              autoFocus={mode === 'compose'}
              readOnly={mode === 'display'}
              onChange={this.handleChangeContent}
              onKeyDown={this.handleKeyDown}
              value={content}
              plugins={discussionTopicPlugins}
            />
          </ContentContainer>
        </MainContainer>
        <ActionsContainer>
          {mode === 'compose' ? composeBtns : replyButton}
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
  mode: PropTypes.oneOf(['compose', 'display']),
  afterCreate: PropTypes.func,
  onCancelCompose: PropTypes.func,
  resetDisplayOverride: PropTypes.func,
};

DiscussionTopic.defaultProps = {
  conversationId: null,
  forceDisplayModal: false,
  mode: 'display',
  onCancelCompose: () => {},
  afterCreate: () => {},
  resetDisplayOverride: () => {},
};

export default withApollo(DiscussionTopic);
