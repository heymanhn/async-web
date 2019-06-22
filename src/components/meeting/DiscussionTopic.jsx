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

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey2,
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

/*
 * A discussion topic supports two modes:
 * 1. Display
 * 2. Compose
 *
 * In compose mode, the editor is no longer read-only.
 */
class DiscussionTopic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: Value.fromJSON(initialValue),
      createdAt: '',
      currentUser: null,
      isModalVisible: false,
      loading: true,
      replyCount: null,
    };

    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  async componentDidMount() {
    const { client, conversationId, meetingId } = this.props;
    const { userId } = getLocalUser();

    if (!conversationId) {
      // Assumes that currentUserQuery is already run once from <AvatarDropdown />
      const { user } = client.readQuery({ query: currentUserQuery, variables: { id: userId } });
      this.setState({ currentUser: user, loading: false });
      return;
    }

    try {
      const response = await client.query({
        query: meetingConversationQuery,
        variables: { meetingId, conversationId },
      });

      if (response.data && response.data.conversation) {
        const { author, createdAt, messages } = response.data.conversation;

        // Assumes each conversation has at least one message
        const { body: { payload } } = messages[0];
        const replyCount = messages.length - 1;

        this.setState({
          loading: false,
          currentUser: author,
          content: Value.fromJSON(JSON.parse(payload)),
          createdAt,
          replyCount,
        });
      }
    } catch (err) {
      console.log('Error loading the conversation');
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
      currentUser,
      content,
      createdAt,
      isModalVisible,
      loading,
      replyCount,
    } = this.state;
    const { conversationId, onCancelCompose, mode, ...props } = this.props;
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

    return (
      <Container mode={mode} onClick={this.toggleModal} {...props}>
        <MainContainer>
          <AvatarWithMargin src={currentUser.profilePictureUrl} size={36} mode={mode} />
          <ContentContainer>
            <TopicMetadata>
              <Author mode={mode}>{currentUser.fullName}</Author>
              {createdAt && <Timestamp fromNow parse="X">{createdAt}</Timestamp>}
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
            isOpen={isModalVisible}
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
  meetingId: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['compose', 'display']),
  afterCreate: PropTypes.func,
  onCancelCompose: PropTypes.func,
};

DiscussionTopic.defaultProps = {
  conversationId: null,
  mode: 'display',
  onCancelCompose: () => {},
  afterCreate: () => { },
};

export default withApollo(DiscussionTopic);
