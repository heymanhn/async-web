import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/currentUserQuery';
import createConversationMessageMutation from 'graphql/createConversationMessageMutation';
import updateConversationMessageMutation from 'graphql/updateConversationMessageMutation';
import {
  initialValue,
  discussionTopicReplyPlugins,
  handleKeyDown,
} from 'utils/slateHelper';
import { getLocalUser, matchCurrentUserId } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import ContentToolbar from './ContentToolbar';
import EditorActions from './EditorActions';

const Container = styled.div(({ mode, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: mode === 'display' ? colors.formGrey : 'none',
  padding: '20px 30px 25px',
  width: '100%',
}));

const AvatarWithMargin = styled(Avatar)(({ mode }) => ({
  flexShrink: 0,
  marginRight: '12px',
  opacity: mode === 'compose' ? 0.5 : 1,
}));

const MainContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const HeaderSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Details = styled.div({
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
  fontSize: '14px',
  lineHeight: '22px',
  fontWeight: 400,
  marginTop: '10px',

  'div:not(:first-of-type)': {
    marginTop: '1em',
  },
});

class DiscussionTopicReply extends Component {
  constructor(props) {
    super(props);

    const initialJSON = props.message.body ? JSON.parse(props.message.body.payload) : initialValue;

    this.state = {
      content: Value.fromJSON(initialJSON),
      currentUser: null,
      mode: props.mode,
    };

    this.editor = React.createRef();

    this.handleKeyDown = handleKeyDown.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitAndKeepOpen = this.handleSubmitAndKeepOpen.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.isReplyEmpty = this.isReplyEmpty.bind(this);
  }

  async componentDidMount() {
    const { client } = this.props;
    const { userId } = getLocalUser();

    // Assumes that currentUserQuery is already run once from <AvatarDropdown />
    const { user } = client.readQuery({ query: currentUserQuery, variables: { id: userId } });
    this.setState({ currentUser: user });
  }

  handleChangeContent({ value }) {
    this.setState({ content: value });
  }

  async handleSubmit({ hideCompose = true } = {}) {
    const { content, mode } = this.state;
    if (this.isReplyEmpty()) return;

    const mutation = mode === 'compose'
      ? createConversationMessageMutation : updateConversationMessageMutation;
    const {
      client,
      conversationId,
      meetingId,
      message,
      afterSubmit,
    } = this.props;

    const response = await client.mutate({
      mutation,
      variables: {
        id: conversationId,
        mid: message.id,
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
      if (mode === 'compose') this.setState({ content: Value.fromJSON(initialValue) });
      if (mode === 'edit' || hideCompose) this.handleCancel({ saved: true });
      if (!hideCompose) this.editor.current.focus();
    }
  }

  handleSubmitAndKeepOpen() {
    this.handleSubmit({ hideCompose: false });
  }

  handleCancel({ saved = false } = {}) {
    const { message, onCancelCompose } = this.props;
    const { mode } = this.state;
    if (mode === 'edit') {
      if (!saved) this.setState({ content: Value.fromJSON(JSON.parse(message.body.payload)) });
      this.toggleEditMode();
    } else {
      onCancelCompose();
    }
  }

  toggleEditMode() {
    this.setState(
      prevState => ({ mode: prevState.mode === 'edit' ? 'display' : 'edit' }),
      () => this.editor.current.focus().moveToEndOfDocument(),
    );
  }

  isReplyEmpty() {
    const { content } = this.state;
    return !Plain.serialize(content);
  }

  render() {
    const { content, currentUser, mode } = this.state;
    const {
      conversationId,
      meetingId,
      message: {
        author,
        createdAt,
        updatedAt,
      },
      onCancelCompose,
      ...props
    } = this.props;

    const replyAuthor = author || currentUser;
    if (!replyAuthor) return null;

    return (
      <Container mode={mode} {...props}>
        <AvatarWithMargin src={replyAuthor.profilePictureUrl} size={36} mode={mode} />
        <MainContainer>
          <HeaderSection>
            <Details>
              <Author mode={mode}>{replyAuthor.fullName}</Author>
              {mode === 'display' && (
                <ContentToolbar
                  createdAt={createdAt}
                  isEditable={matchCurrentUserId(author.id)}
                  isEdited={createdAt !== updatedAt}
                  onEdit={this.toggleEditMode}
                />
              )}
            </Details>
          </HeaderSection>
          <Content
            ref={this.editor}
            autoFocus={['compose', 'edit'].includes(mode)}
            readOnly={mode === 'display'}
            onChange={this.handleChangeContent}
            onKeyDown={this.handleKeyDown}
            value={content}
            plugins={discussionTopicReplyPlugins}
          />
          {['compose', 'edit'].includes(mode) && (
            <EditorActions
              isSubmitDisabled={this.isReplyEmpty()}
              mode={mode}
              onCancel={this.handleCancelCompose}
              onSubmit={this.handleSubmit}
            />
          )}
        </MainContainer>
      </Container>
    );
  }
}

DiscussionTopicReply.propTypes = {
  client: PropTypes.object.isRequired,
  conversationId: PropTypes.string.isRequired,
  meetingId: PropTypes.string.isRequired,
  message: PropTypes.object,
  mode: PropTypes.oneOf(['compose', 'display', 'edit']),
  afterSubmit: PropTypes.func,
  onCancelCompose: PropTypes.func,
};

DiscussionTopicReply.defaultProps = {
  message: {},
  mode: 'display',
  onCancelCompose: () => {},
  afterSubmit: () => {},
};

export default withApollo(DiscussionTopicReply);
